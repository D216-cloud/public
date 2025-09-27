const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

async function testUserFetch() {
  console.log('Testing Twitter user fetch for project integration...');
  
  try {
    // Initialize Twitter client with Bearer Token
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Test fetching a few different users to see which ones work
    const testUsers = ['elonmusk', 'twitter', 'twitterapi'];
    
    for (const username of testUsers) {
      try {
        console.log(`\nFetching info for @${username}...`);
        const user = await client.v2.userByUsername(username);
        
        if (user.data) {
          console.log(`✅ Success!`);
          console.log(`  Name: ${user.data.name}`);
          console.log(`  Username: @${user.data.username}`);
          console.log(`  ID: ${user.data.id}`);
          console.log(`  Followers: ${user.data.public_metrics?.followers_count || 'N/A'}`);
          console.log(`  Following: ${user.data.public_metrics?.following_count || 'N/A'}`);
          return user; // Return the first successful result
        }
      } catch (error) {
        console.log(`❌ Failed to fetch @${username}: ${error.message}`);
        if (error.code === 429) {
          console.log('  Rate limit exceeded. Try again later.');
          break;
        }
      }
    }
    
    console.log('\n✅ Twitter API is working. You can now use it in your project.');
  } catch (error) {
    console.error('❌ Twitter API test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
testUserFetch();