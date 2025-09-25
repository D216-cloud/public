const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to database
const connectDB = require('./config/db');
connectDB();

const User = require('./models/User');

// Create a test user if it doesn't exist
const createOrGetTestUser = async () => {
  try {
    let user = await User.findOne({ email: 'apitest@example.com' });
    
    if (!user) {
      user = new User({
        name: 'API Test User',
        email: 'apitest@example.com',
        googleId: 'api-test-google-id-456'
      });
      await user.save();
      console.log('Created test user:', user._id);
    } else {
      console.log('Using existing test user:', user._id);
    }
    
    return user;
  } catch (error) {
    console.error('Error creating/getting test user:', error);
    throw error;
  }
};

// Test the full API flow
const testFullAPI = async () => {
  try {
    console.log('Testing full API flow...');
    
    // 1. Create or get test user
    const user = await createOrGetTestUser();
    
    // 2. Create JWT token
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET || 'supersecretkey'
    );
    console.log('Generated JWT token');
    
    // 3. Test content generation
    console.log('Testing content generation...');
    const API_URL = process.env.API_URL || 'http://localhost:5000';
    const generateResponse = await fetch(`${API_URL}/api/posts/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        topic: 'productivity tips for developers',
        template: 'tips',
        tone: 'professional',
        audience: 'developers'
      })
    });
    
    console.log('Generate content status:', generateResponse.status);
    
    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      console.error('Generate content error:', errorData);
      return;
    }
    
    const generateData = await generateResponse.json();
    console.log('Generated content:', generateData.content);
    
    // 4. Test posting to X
    console.log('Testing post to X...');
    const postResponse = await fetch(`${API_URL}/api/posts/post-to-x`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: generateData.content,
        template: 'tips',
        tone: 'professional',
        topic: 'productivity tips for developers'
      })
    });
    
    console.log('Post to X status:', postResponse.status);
    
    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      console.error('Post to X error:', errorData);
      return;
    }
    
    const postData = await postResponse.json();
    console.log('Post to X result:', postData.message);
    
    // 5. Test getting generated content history
    console.log('Testing generated content history...');
    const historyResponse = await fetch(`${API_URL}/api/posts/generated-content-history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Generated content history status:', historyResponse.status);
    
    if (!historyResponse.ok) {
      const errorData = await historyResponse.json();
      console.error('Generated content history error:', errorData);
      return;
    }
    
    const historyData = await historyResponse.json();
    console.log(`Found ${historyData.generatedContent.length} generated content items in history`);
    
    console.log('Full API test completed successfully!');
  } catch (error) {
    console.error('Full API test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

testFullAPI();