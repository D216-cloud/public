// Quick script to repair your Twitter connection with environment credentials
require('dotenv').config();
const mongoose = require('mongoose');
const UserTwitterConnection = require('./models/UserTwitterConnections');
const { TwitterApi } = require('twitter-api-v2');

async function repairTwitterConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find all connections that need repair (have no credentials)
    const connections = await UserTwitterConnection.find({
      $or: [
        { apiKey: { $exists: false } },
        { apiKey: null },
        { apiKey: '' }
      ]
    });
    
    console.log(`Found ${connections.length} connections that need repair`);
    
    if (connections.length === 0) {
      console.log('No connections found that need repair');
      process.exit(0);
    }
    
    // Check environment credentials
    const envCredentials = {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_CLIENT_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };
    
    console.log('Environment credentials check:', {
      hasApiKey: !!envCredentials.apiKey,
      hasApiSecret: !!envCredentials.apiSecret,
      hasAccessToken: !!envCredentials.accessToken,
      hasAccessTokenSecret: !!envCredentials.accessTokenSecret
    });
    
    if (!envCredentials.apiKey || !envCredentials.apiSecret || !envCredentials.accessToken || !envCredentials.accessTokenSecret) {
      console.error('❌ Missing environment credentials');
      process.exit(1);
    }
    
    // Test the credentials
    console.log('🔍 Testing environment credentials...');
    const testClient = new TwitterApi({
      appKey: envCredentials.apiKey,
      appSecret: envCredentials.apiSecret,
      accessToken: envCredentials.accessToken,
      accessSecret: envCredentials.accessTokenSecret,
    });
    
    const userInfo = await testClient.v2.me();
    console.log(`✅ Credentials work! Connected as: @${userInfo.data.username}`);
    
    // Update all connections
    for (const connection of connections) {
      console.log(`🔧 Repairing connection for user: ${connection.userId}`);
      
      connection.apiKey = envCredentials.apiKey;
      connection.apiSecret = envCredentials.apiSecret;
      connection.accessToken = envCredentials.accessToken;
      connection.accessTokenSecret = envCredentials.accessTokenSecret;
      connection.verified = true;
      connection.verifiedAt = new Date();
      connection.twitterId = userInfo.data.id;
      connection.screenName = userInfo.data.username;
      
      await connection.save();
      console.log(`✅ Repaired connection for user: ${connection.userId}`);
    }
    
    console.log('🎉 All connections repaired successfully!');
    
  } catch (error) {
    console.error('❌ Repair failed:', error);
  } finally {
    process.exit(0);
  }
}

repairTwitterConnection();