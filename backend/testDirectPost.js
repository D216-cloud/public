// Direct test of Twitter posting with current credentials
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

async function testDirectPost() {
  try {
    console.log('🔍 Testing Twitter credentials for posting...');
    
    // Check environment variables
    const creds = {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };
    
    console.log('📋 Credential check:', {
      hasApiKey: !!creds.apiKey,
      hasApiSecret: !!creds.apiSecret,
      hasAccessToken: !!creds.accessToken,
      hasAccessTokenSecret: !!creds.accessTokenSecret
    });
    
    if (!creds.apiKey || !creds.apiSecret || !creds.accessToken || !creds.accessTokenSecret) {
      console.error('❌ Missing credentials in environment');
      return;
    }
    
    // Create Twitter client
    const client = new TwitterApi({
      appKey: creds.apiKey,
      appSecret: creds.apiSecret,
      accessToken: creds.accessToken,
      accessSecret: creds.accessTokenSecret,
    });
    
    // Test 1: Verify user info (read permission)
    console.log('\n📖 Testing READ permission...');
    try {
      const userInfo = await client.v2.me();
      console.log('✅ READ test passed - Connected as:', userInfo.data.username);
    } catch (readError) {
      console.error('❌ READ test failed:', {
        status: readError.data?.status,
        title: readError.data?.title,
        detail: readError.data?.detail
      });
      return;
    }
    
    // Test 2: Try to post a tweet (write permission)
    console.log('\n✍️ Testing WRITE permission...');
    const testContent = `🔥 Test post from my website! ${new Date().toISOString()}`;
    
    try {
      const tweet = await client.v2.tweet(testContent);
      console.log('🎉 WRITE test passed - Tweet posted!');
      console.log('Tweet ID:', tweet.data.id);
      console.log('Content:', testContent);
      
      // Clean up - delete the test tweet after 5 seconds
      setTimeout(async () => {
        try {
          await client.v2.deleteTweet(tweet.data.id);
          console.log('🧹 Test tweet deleted');
        } catch (delError) {
          console.log('⚠️ Could not delete test tweet (non-critical)');
        }
      }, 5000);
      
    } catch (writeError) {
      console.error('❌ WRITE test failed:', {
        status: writeError.data?.status,
        title: writeError.data?.title,
        detail: writeError.data?.detail
      });
      
      // Provide specific guidance based on error
      if (writeError.data?.status === 403) {
        console.log('\n🔧 SOLUTION for 403 error:');
        console.log('1. Go to developer.twitter.com → Your App → Settings');
        console.log('2. Enable "Read and Write" permissions');
        console.log('3. Regenerate Access Token & Secret (BOTH)');
        console.log('4. Update your .env file with new tokens');
      } else if (writeError.data?.status === 401) {
        console.log('\n🔧 SOLUTION for 401 error:');
        console.log('1. Your tokens may be expired or mismatched');
        console.log('2. Regenerate Access Token & Secret in developer portal');
        console.log('3. Ensure API Key and Access Token belong to same app');
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

testDirectPost();