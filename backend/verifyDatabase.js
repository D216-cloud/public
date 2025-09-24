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

const verifyDatabase = async () => {
  try {
    console.log('Verifying data in MongoDB database "x"...');
    
    // Check users
    const users = await User.find({ email: 'apitest@example.com' });
    console.log(`Found ${users.length} test users`);
    
    if (users.length > 0) {
      console.log('User details:', {
        id: users[0]._id,
        name: users[0].name,
        email: users[0].email,
        createdAt: users[0].createdAt
      });
    }
    
    // Check posts
    if (users.length > 0) {
      const posts = await Post.find({ userId: users[0]._id });
      console.log(`Found ${posts.length} posts for test user`);
      
      if (posts.length > 0) {
        console.log('Post details:', {
          id: posts[0]._id,
          content: posts[0].content.substring(0, 50) + '...',
          template: posts[0].template,
          tone: posts[0].tone,
          status: posts[0].status,
          createdAt: posts[0].createdAt
        });
      }
    }
    
    // Check generated content
    if (users.length > 0) {
      const generatedContents = await GeneratedContent.find({ userId: users[0]._id });
      console.log(`Found ${generatedContents.length} generated content items for test user`);
      
      if (generatedContents.length > 0) {
        console.log('Generated content details:', {
          id: generatedContents[0]._id,
          content: generatedContents[0].content.substring(0, 50) + '...',
          template: generatedContents[0].template,
          tone: generatedContents[0].tone,
          topic: generatedContents[0].topic,
          characterCount: generatedContents[0].characterCount,
          wordCount: generatedContents[0].wordCount,
          hashtags: generatedContents[0].hashtags,
          createdAt: generatedContents[0].createdAt
        });
      }
    }
    
    console.log('Database verification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database verification failed:', error);
    process.exit(1);
  }
};

verifyDatabase();