// Create a Twitter connection for your user
require('dotenv').config();
const mongoose = require('mongoose');
const UserTwitterConnection = require('./models/UserTwitterConnections');
const User = require('./models/User');
const { TwitterApi } = require('twitter-api-v2');

async function createTwitterConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get environment credentials
    const envCredentials = {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
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
    console.log(`✅ Credentials work! Connected as: @${userInfo.data.username} (${userInfo.data.name})`);
    
    // Find any user in the system (we'll use the first one)
    const user = await User.findOne({});
    if (!user) {
      console.error('❌ No users found in database. Please log in first.');
      process.exit(1);
    }
    
    console.log(`📱 Found user: ${user.name || user.email}`);
    
    // Check if connection already exists
    let twitterConnection = await UserTwitterConnection.findOne({ userId: user._id });
    
    if (twitterConnection) {
      console.log('🔧 Updating existing connection...');
    } else {
      console.log('🆕 Creating new connection...');
      twitterConnection = new UserTwitterConnection({ userId: user._id });
    }
    
    // Update the connection
    twitterConnection.apiKey = envCredentials.apiKey;
    twitterConnection.apiSecret = envCredentials.apiSecret;
    twitterConnection.accessToken = envCredentials.accessToken;
    twitterConnection.accessTokenSecret = envCredentials.accessTokenSecret;
    twitterConnection.verified = true;
    twitterConnection.verifiedAt = new Date();
    twitterConnection.twitterId = userInfo.data.id;
    twitterConnection.screenName = userInfo.data.username;
    twitterConnection.verifiedBy = 'email'; // Using valid enum value
    
    await twitterConnection.save();
    
    // Update user with Twitter info
    if (!user.name) {
      user.name = userInfo.data.name || 'Twitter User';
    }
    user.twitterId = userInfo.data.id;
    user.twitterUsername = userInfo.data.username;
    await user.save();
    
    console.log('🎉 Twitter connection created successfully!');
    console.log(`👤 User: ${user.name || user.email}`);
    console.log(`🐦 Twitter: @${userInfo.data.username}`);
    console.log(`🔗 Connection ID: ${twitterConnection._id}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    process.exit(0);
  }
}

createTwitterConnection();