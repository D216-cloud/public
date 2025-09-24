const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to database
const connectDB = require('./config/db');
connectDB();

const User = require('./models/User');
const Post = require('./models/Post');
const GeneratedContent = require('./models/GeneratedContent');

const testDatabase = async () => {
  try {
    console.log('Testing database operations...');
    
    // Test 1: Create a user
    console.log('Creating test user...');
    const user = new User({
      name: 'Database Test User',
      email: 'dbtest@example.com',
      googleId: 'test-google-id-123'
    });
    
    const savedUser = await user.save();
    console.log('User created:', savedUser._id);
    
    // Test 2: Create a post
    console.log('Creating test post...');
    const post = new Post({
      userId: savedUser._id,
      content: 'This is a test post stored in MongoDB database x',
      template: 'test',
      tone: 'professional',
      platform: 'X',
      status: 'posted',
      postedAt: new Date()
    });
    
    const savedPost = await post.save();
    console.log('Post created:', savedPost._id);
    
    // Test 3: Create generated content
    console.log('Creating test generated content...');
    const generatedContent = new GeneratedContent({
      userId: savedUser._id,
      content: 'This is AI-generated content stored in MongoDB database x',
      template: 'tips',
      tone: 'professional',
      topic: 'database testing',
      prompt: 'Generate content about database testing',
      platform: 'X',
      characterCount: 52,
      wordCount: 9,
      hashtags: ['#database', '#testing'],
      mentions: [],
      engagementScore: 85
    });
    
    const savedGeneratedContent = await generatedContent.save();
    console.log('Generated content created:', savedGeneratedContent._id);
    
    // Test 4: Retrieve data
    console.log('Retrieving data...');
    const users = await User.find({ email: 'dbtest@example.com' });
    const posts = await Post.find({ userId: savedUser._id });
    const contents = await GeneratedContent.find({ userId: savedUser._id });
    
    console.log(`Found ${users.length} users, ${posts.length} posts, ${contents.length} generated contents`);
    
    // Test 5: Clean up (optional)
    console.log('Cleaning up test data...');
    await User.deleteOne({ email: 'dbtest@example.com' });
    await Post.deleteMany({ userId: savedUser._id });
    await GeneratedContent.deleteMany({ userId: savedUser._id });
    
    console.log('Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
};

testDatabase();