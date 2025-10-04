// Diagnostic script to check why posted tweets aren't showing in X profile
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const User = require('./models/User');
const Post = require('./models/Post');
const mongoose = require('mongoose');

async function diagnoseTweetVisibility() {
  try {
    console.log('🔍 DIAGNOSING TWEET VISIBILITY ISSUE\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database\n');
    
    // Check environment credentials (used for posting)
    console.log('📋 ENVIRONMENT CREDENTIALS CHECK:');
    console.log('- TWITTER_API_KEY:', process.env.TWITTER_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('- TWITTER_API_SECRET:', process.env.TWITTER_API_SECRET ? '✓ Set' : '✗ Missing');
    console.log('- TWITTER_ACCESS_TOKEN:', process.env.TWITTER_ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
    console.log('- TWITTER_ACCESS_TOKEN_SECRET:', process.env.TWITTER_ACCESS_TOKEN_SECRET ? '✓ Set' : '✗ Missing');
    console.log('- TWITTER_BEARER_TOKEN:', process.env.TWITTER_BEARER_TOKEN ? '✓ Set' : '✗ Missing');
    console.log();
    
    // Test posting credentials (environment)
    console.log('🐦 TESTING POSTING CREDENTIALS:');
    try {
      const postClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      });
      
      // Get the authenticated user info
      const me = await postClient.v2.me();
      console.log('✅ Environment credentials work for posting');
      console.log('   Account:', me.data.username, `(@${me.data.username})`);
      console.log('   User ID:', me.data.id);
      console.log();
    } catch (error) {
      console.log('❌ Environment credentials failed:', error.message);
      console.log();
    }
    
    // Test reading credentials (bearer token)
    console.log('📖 TESTING READING CREDENTIALS:');
    try {
      const readClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
      
      // Try to get user info using bearer token
      const userLookup = await readClient.v2.userByUsername('elonmusk'); // Test with known user
      console.log('✅ Bearer token works for reading');
      console.log('   Test user:', userLookup.data.username);
      console.log();
    } catch (error) {
      console.log('❌ Bearer token failed:', error.message);
      console.log();
    }
    
    // Check database posts
    console.log('💾 DATABASE POSTS CHECK:');
    const recentPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email twitterUsername');
    
    console.log(`Found ${recentPosts.length} recent posts in database:`);
    recentPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.content.substring(0, 50)}...`);
      console.log(`   Posted: ${post.createdAt}`);
      console.log(`   External ID: ${post.externalId || 'Missing!'}`);
      console.log(`   User: ${post.userId?.name} (@${post.userId?.twitterUsername || 'No username'})`);
      console.log();
    });
    
    // Check user Twitter connections
    console.log('👤 USER TWITTER CONNECTIONS:');
    const users = await User.find({ twitterId: { $exists: true } });
    console.log(`Found ${users.length} users with Twitter connections:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Twitter Username: @${user.twitterUsername || 'Missing'}`);
      console.log(`   Twitter ID: ${user.twitterId || 'Missing'}`);
      console.log();
    });
    
    // THE PROBLEM EXPLANATION
    console.log('🔧 DIAGNOSIS RESULTS:');
    console.log('════════════════════════════════════════════════════════════');
    console.log('ISSUE: Your posts appear successful but don\'t show in X profile');
    console.log();
    console.log('CAUSE: Credential mismatch between posting and reading:');
    console.log('1. POSTING uses environment credentials (TWITTER_ACCESS_TOKEN)');
    console.log('2. READING uses bearer token (TWITTER_BEARER_TOKEN)');
    console.log('3. These credentials may be for DIFFERENT Twitter accounts!');
    console.log();
    console.log('SOLUTION OPTIONS:');
    console.log('A. Use same account for both posting and reading');
    console.log('B. Update X Profile to show posts from database instead of API');
    console.log('C. Connect your personal Twitter account for profile display');
    console.log('════════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

diagnoseTweetVisibility();