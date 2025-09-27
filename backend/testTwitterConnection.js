const { verifyTwitterUsername } = require('./utils/twitterAuth');
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

async function testTwitterConnection() {
  console.log('Testing Twitter API connection...');
  
  // Check if required environment variables are set
  const requiredVars = [
    'TWITTER_BEARER_TOKEN',
    'TWITTER_CLIENT_ID',
    'TWITTER_CLIENT_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars);
    return;
  }
  
  console.log('All required environment variables are set');
  console.log('TWITTER_BEARER_TOKEN length:', process.env.TWITTER_BEARER_TOKEN?.length || 0);
  
  try {
    // Test 1: Bearer Token authentication
    console.log('\n1. Testing Bearer Token authentication...');
    
    // Check if Bearer Token looks valid
    if (!process.env.TWITTER_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN.length < 20) {
      console.error('❌ Bearer Token appears to be invalid or too short');
      return;
    }
    
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Test fetching a public user (using elonmusk as it's a well-known account)
    console.log('Fetching user info for @elonmusk...');
    const user = await client.v2.userByUsername('elonmusk');
    
    if (user.data) {
      console.log('✅ Bearer Token authentication successful!');
      console.log(`User: ${user.data.name} (@${user.data.username})`);
      console.log(`User ID: ${user.data.id}`);
    } else {
      console.log('❌ Failed to fetch user info');
      console.log('Response:', user);
    }
  } catch (error) {
    console.error('❌ Bearer Token authentication failed:', error.message);
    console.error('Error details:', error);
  }
  
  try {
    // Test 2: OAuth 2.0 credentials
    console.log('\n2. Testing OAuth 2.0 credentials...');
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });
    
    console.log('✅ OAuth 2.0 credentials validated (no errors on client creation)');
  } catch (error) {
    console.error('❌ OAuth 2.0 credentials validation failed:', error.message);
  }
  
  try {
    // Test 3: Using our utility function
    console.log('\n3. Testing utility function...');
    const result = await verifyTwitterUsername('elonmusk');
    
    if (result.data) {
      console.log('✅ Utility function works correctly!');
      console.log(`User: ${result.data.name} (@${result.data.username})`);
    } else {
      console.log('❌ Utility function returned no data');
      console.log('Response:', result);
    }
  } catch (error) {
    console.error('❌ Utility function test failed:', error.message);
    console.error('Error details:', error);
  }
  
  console.log('\nTwitter API connection test completed.');
}

// Run the test
testTwitterConnection();