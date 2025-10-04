// Check Twitter user connection and fetch tweets
require('dotenv').config();
const mongoose = require('mongoose');
const { TwitterApi } = require('twitter-api-v2');
const User = require('./models/User');

async function checkTwitterUser() {
  try {
    console.log('🔍 CHECKING TWITTER USER CONNECTION...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find user with email owner@hotel.com
    const user = await User.findOne({ email: 'owner@hotel.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('\n👤 USER DETAILS:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Twitter ID:', user.twitterId);
    console.log('Twitter Username:', user.twitterUsername);
    
    // Test Bearer Token
    console.log('\n🔑 TESTING BEARER TOKEN:');
    if (!process.env.TWITTER_BEARER_TOKEN) {
      console.log('❌ No TWITTER_BEARER_TOKEN found in environment');
      return;
    }
    
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Test 1: Get user by username
    if (user.twitterUsername) {
      try {
        console.log(`\n📍 Looking up username: ${user.twitterUsername}`);
        const userLookup = await twitterClient.v2.userByUsername(user.twitterUsername);
        console.log('✅ User lookup successful:', userLookup.data);
        
        // Test 2: Get user tweets
        console.log(`\n📱 Fetching tweets for user ID: ${userLookup.data.id}`);
        const userTweets = await twitterClient.v2.userTimeline(userLookup.data.id, {
          max_results: 5,
          'tweet.fields': ['created_at', 'public_metrics'],
        });
        
        if (userTweets.data && userTweets.data.data) {
          console.log(`✅ Found ${userTweets.data.data.length} tweets:`);
          userTweets.data.data.forEach((tweet, index) => {
            console.log(`   ${index + 1}. "${tweet.text.substring(0, 50)}..." (${tweet.created_at})`);
          });
        } else {
          console.log('⚠️ No tweets found in response');
        }
        
      } catch (twitterError) {
        console.error('❌ Twitter API error:', {
          code: twitterError.code,
          message: twitterError.message,
          data: twitterError.data
        });
      }
    } else {
      console.log('❌ No Twitter username stored for user');
    }
    
    // Test 3: Try to get user by ID if available
    if (user.twitterId) {
      try {
        console.log(`\n🆔 Looking up user by ID: ${user.twitterId}`);
        const userById = await twitterClient.v2.user(user.twitterId);
        console.log('✅ User by ID successful:', userById.data);
        
        // Try to get tweets by ID
        console.log(`\n📱 Fetching tweets for user ID: ${user.twitterId}`);
        const tweetsById = await twitterClient.v2.userTimeline(user.twitterId, {
          max_results: 5,
          'tweet.fields': ['created_at', 'public_metrics'],
        });
        
        if (tweetsById.data && tweetsById.data.data) {
          console.log(`✅ Found ${tweetsById.data.data.length} tweets by ID:`);
          tweetsById.data.data.forEach((tweet, index) => {
            console.log(`   ${index + 1}. "${tweet.text.substring(0, 50)}..." (${tweet.created_at})`);
          });
        } else {
          console.log('⚠️ No tweets found by ID');
        }
        
      } catch (twitterError) {
        console.error('❌ Twitter API error for ID lookup:', {
          code: twitterError.code,
          message: twitterError.message,
          data: twitterError.data
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n✅ Database disconnected');
  }
}

checkTwitterUser();