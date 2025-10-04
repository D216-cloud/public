// Diagnostic script to identify Twitter posting vs profile display issue
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

async function diagnoseTwitterIssue() {
  try {
    console.log('🔍 DIAGNOSING TWITTER POSTING ISSUE...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // 1. Check environment credentials
    console.log('\n📋 CHECKING ENVIRONMENT CREDENTIALS:');
    const envCreds = {
      hasApiKey: !!process.env.TWITTER_API_KEY,
      hasApiSecret: !!process.env.TWITTER_API_SECRET,
      hasAccessToken: !!process.env.TWITTER_ACCESS_TOKEN,
      hasAccessTokenSecret: !!process.env.TWITTER_ACCESS_TOKEN_SECRET,
      hasBearerToken: !!process.env.TWITTER_BEARER_TOKEN
    };
    console.log(envCreds);
    
    // 2. Test environment credentials (what your app uses to post)
    console.log('\n🚀 TESTING POSTING CREDENTIALS:');
    const postingClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    
    try {
      const me = await postingClient.v2.me();
      console.log('✅ Posting credentials work - connected as:', me.data.username);
      console.log('   Account ID:', me.data.id);
      console.log('   Account Name:', me.data.name);
    } catch (error) {
      console.log('❌ Posting credentials failed:', error.message);
    }
    
    // 3. Test Bearer Token (what your app uses to read tweets)
    console.log('\n👁️ TESTING READING CREDENTIALS:');
    if (process.env.TWITTER_BEARER_TOKEN) {
      const readingClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
      
      try {
        // Try to read tweets from the same account we post with
        const tweets = await readingClient.v2.userTimeline(me.data.id, { max_results: 5 });
        console.log('✅ Reading credentials work - found', tweets.data?.length || 0, 'tweets');
        
        if (tweets.data && tweets.data.length > 0) {
          console.log('   Latest tweet:', tweets.data[0].text.substring(0, 50) + '...');
        }
      } catch (error) {
        console.log('❌ Reading credentials failed:', error.message);
        console.log('   This is why your X Profile page shows no tweets!');
      }
    } else {
      console.log('❌ No Bearer Token found - cannot read tweets');
    }
    
    // 4. Check recent posts in database
    console.log('\n💾 CHECKING RECENT POSTS IN DATABASE:');
    const recentPosts = await Post.find({ platform: 'X' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');
    
    console.log(`Found ${recentPosts.length} recent X posts in database:`);
    recentPosts.forEach((post, index) => {
      console.log(`   ${index + 1}. "${post.content.substring(0, 50)}..." (${post.status})`);
      console.log(`      Posted: ${post.createdAt}`);
      console.log(`      External ID: ${post.externalId || 'None'}`);
      console.log(`      User: ${post.userId.name} (${post.userId.email})`);
      console.log('');
    });
    
    // 5. Test actual posting to verify it works
    console.log('\n🧪 TESTING ACTUAL POST (will be deleted):');
    const testContent = `🔧 Diagnostic test - ${new Date().toISOString()}`;
    
    try {
      const testTweet = await postingClient.v2.tweet(testContent);
      console.log('✅ Test post successful!');
      console.log('   Tweet ID:', testTweet.data.id);
      console.log('   URL:', `https://twitter.com/i/web/status/${testTweet.data.id}`);
      
      // Try to read it back
      try {
        const readBack = await readingClient.v2.singleTweet(testTweet.data.id);
        console.log('✅ Can read back the posted tweet');
      } catch (readError) {
        console.log('❌ Cannot read back the posted tweet:', readError.message);
      }
      
      // Clean up - delete the test tweet
      setTimeout(async () => {
        try {
          await postingClient.v2.deleteTweet(testTweet.data.id);
          console.log('🧹 Test tweet deleted');
        } catch (delError) {
          console.log('⚠️ Could not delete test tweet');
        }
      }, 2000);
      
    } catch (postError) {
      console.log('❌ Test post failed:', postError.message);
    }
    
    // 6. Recommendations
    console.log('\n💡 DIAGNOSIS SUMMARY:');
    console.log('='.repeat(50));
    
    if (envCreds.hasApiKey && envCreds.hasAccessToken) {
      console.log('✅ Your app CAN post to Twitter (that\'s why you get success emails)');
    } else {
      console.log('❌ Your app cannot post to Twitter - missing credentials');
    }
    
    if (envCreds.hasBearerToken) {
      console.log('✅ Your app has Bearer Token for reading tweets');
    } else {
      console.log('❌ Your app cannot read tweets - missing Bearer Token');
      console.log('   This is why your X Profile page shows no tweets!');
    }
    
    console.log('\n🔧 RECOMMENDED FIXES:');
    console.log('1. Add TWITTER_BEARER_TOKEN to your .env file');
    console.log('2. Make sure all credentials are from the same Twitter app');
    console.log('3. Verify your Twitter app has both read and write permissions');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

diagnoseTwitterIssue();