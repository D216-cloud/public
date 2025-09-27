const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

async function testTwitterAPI() {
  console.log('Testing Twitter API setup...');
  
  // Check if required environment variables are set
  if (!process.env.TWITTER_BEARER_TOKEN) {
    console.error('Error: TWITTER_BEARER_TOKEN is not set in environment variables');
    console.log('Please set TWITTER_BEARER_TOKEN in your .env file');
    return;
  }

  console.log('TWITTER_BEARER_TOKEN is set');
  
  try {
    // Initialize Twitter client with Bearer Token
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Test the API by fetching a public user (using a different username)
    console.log('Testing API connection...');
    const user = await twitterClient.v2.userByUsername('elonmusk');
    
    if (user.data) {
      console.log('✅ Twitter API connection successful!');
      console.log(`User found: ${user.data.name} (@${user.data.username})`);
      console.log(`User ID: ${user.data.id}`);
    } else {
      console.log('❌ Twitter API connection failed');
      console.log('Response:', user);
    }
  } catch (error) {
    console.error('❌ Twitter API test failed:', error.message);
    
    if (error.code === 401) {
      console.error('This indicates an authentication issue. Please check your TWITTER_BEARER_TOKEN.');
    } else if (error.code === 404) {
      console.error('This indicates the requested resource was not found.');
    } else if (error.code === 429) {
      console.error('This indicates you have exceeded the rate limit.');
    }
  }
}

// Run the test
testTwitterAPI();