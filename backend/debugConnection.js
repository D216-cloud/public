// Debug script to see exactly what's in your Twitter connection
require('dotenv').config();
const mongoose = require('mongoose');
const UserTwitterConnection = require('./models/UserTwitterConnections');

async function debugConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find all connections
    const connections = await UserTwitterConnection.find({});
    console.log(`Found ${connections.length} total connections`);
    
    connections.forEach((conn, index) => {
      console.log(`\n--- Connection ${index + 1} ---`);
      console.log('User ID:', conn.userId);
      console.log('Twitter ID:', conn.twitterId);
      console.log('Screen Name:', conn.screenName);
      console.log('Verified:', conn.verified);
      console.log('API Key exists:', !!conn.apiKey);
      console.log('API Secret exists:', !!conn.apiSecret);
      console.log('Access Token exists:', !!conn.accessToken);
      console.log('Access Token Secret exists:', !!conn.accessTokenSecret);
      
      if (conn.apiKey) {
        console.log('API Key preview:', conn.apiKey.substring(0, 10) + '...');
      }
      if (conn.accessToken) {
        console.log('Access Token preview:', conn.accessToken.substring(0, 10) + '...');
      }
    });
    
    // Check environment variables
    console.log('\n--- Environment Variables ---');
    console.log('TWITTER_API_KEY exists:', !!process.env.TWITTER_API_KEY);
    console.log('TWITTER_CLIENT_SECRET exists:', !!process.env.TWITTER_CLIENT_SECRET);
    console.log('TWITTER_ACCESS_TOKEN exists:', !!process.env.TWITTER_ACCESS_TOKEN);
    console.log('TWITTER_ACCESS_TOKEN_SECRET exists:', !!process.env.TWITTER_ACCESS_TOKEN_SECRET);
    
    if (process.env.TWITTER_API_KEY) {
      console.log('TWITTER_API_KEY preview:', process.env.TWITTER_API_KEY.substring(0, 10) + '...');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    process.exit(0);
  }
}

debugConnection();