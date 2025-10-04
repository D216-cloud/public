// Fix the Twitter account mismatch by updating database
require('dotenv').config();
const mongoose = require('mongoose');
const { TwitterApi } = require('twitter-api-v2');
const User = require('./models/User');

async function fixTwitterAccount() {
  try {
    console.log('🔧 FIXING TWITTER ACCOUNT MISMATCH...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get the correct posting account details
    const postingClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    
    const me = await postingClient.v1.verifyCredentials();
    console.log('📱 Posting account:', `@${me.screen_name} (${me.name})`);
    
    // Update user with correct Twitter details
    const user = await User.findOne({ email: 'owner@hotel.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('\n🔄 UPDATING USER TWITTER DETAILS:');
    console.log('Old Twitter ID:', user.twitterId);
    console.log('Old Username:', user.twitterUsername);
    console.log('New Twitter ID:', me.id_str);
    console.log('New Username:', me.screen_name);
    
    // Update the user
    user.twitterId = me.id_str;
    user.twitterUsername = me.screen_name;
    user.twitterProfileImageUrl = me.profile_image_url_https;
    
    await user.save();
    console.log('✅ User updated successfully!');
    
    // Test fetching tweets from the correct account
    console.log('\n📱 TESTING TWEET FETCH FROM CORRECT ACCOUNT:');
    try {
      const bearerClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
      const userTweets = await bearerClient.v2.userTimeline(me.id_str, {
        max_results: 5,
        'tweet.fields': ['created_at', 'public_metrics'],
      });
      
      if (userTweets.data && userTweets.data.data) {
        console.log(`✅ Found ${userTweets.data.data.length} tweets from @${me.screen_name}:`);
        userTweets.data.data.forEach((tweet, index) => {
          console.log(`   ${index + 1}. "${tweet.text.substring(0, 60)}..." (${new Date(tweet.created_at).toLocaleString()})`);
        });
      } else {
        console.log('⚠️ No tweets found (might be rate limited)');
      }
    } catch (fetchError) {
      if (fetchError.code === 429) {
        console.log('⚠️ Rate limited - but fix should work once rate limit resets');
      } else {
        console.error('❌ Fetch error:', fetchError.message);
      }
    }
    
    console.log('\n✅ FIX COMPLETE!');
    console.log('Your X Profile page should now show tweets from the correct account.');
    console.log('Wait a few minutes for the rate limit to reset, then refresh your X Profile page.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('✅ Database disconnected');
  }
}

fixTwitterAccount();