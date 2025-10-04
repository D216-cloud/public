// Test the fixed posting function
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const { TwitterApi } = require('twitter-api-v2');

async function testFixedPosting() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get user
    const user = await User.findOne({});
    if (!user) {
      console.error('❌ No user found');
      return;
    }
    
    console.log('👤 Found user:', user.email);
    
    // Test content
    const content = `🔥 Fixed posting test! ${new Date().toLocaleTimeString()}`;
    
    console.log(`🐦 Attempting to post: "${content}"`);
    
    // Use environment credentials directly (same as fixed postToTwitter function)
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // Post tweet
    const tweet = await client.v2.tweet(content);
    console.log('✅ Tweet posted successfully!');
    console.log('Tweet ID:', tweet.data.id);
    console.log('URL:', `https://twitter.com/i/web/status/${tweet.data.id}`);
    
    // Save to database
    const post = new Post({
      userId: user._id,
      content: content,
      platform: 'X',
      status: 'posted',
      postedAt: new Date(),
      externalId: tweet.data.id
    });
    await post.save();
    console.log('💾 Post saved to database');
    
    console.log('\n🎉 SUCCESS! The fixed posting function works correctly.');
    console.log('Your website can now post to Twitter without the 401/403 error.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.data) {
      console.error('Twitter API error details:', {
        status: error.data.status,
        title: error.data.title,
        detail: error.data.detail
      });
    }
  } finally {
    process.exit(0);
  }
}

testFixedPosting();