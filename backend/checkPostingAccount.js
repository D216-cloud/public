// Check which Twitter account is being used for posting
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

async function checkPostingAccount() {
  try {
    console.log('🔍 CHECKING POSTING ACCOUNT CREDENTIALS...\n');
    
    // Check posting credentials
    const postingClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    
    console.log('📱 POSTING ACCOUNT DETAILS:');
    const me = await postingClient.v1.verifyCredentials();
    console.log('Account ID:', me.id_str);
    console.log('Username:', me.screen_name);
    console.log('Name:', me.name);
    console.log('Profile URL: https://twitter.com/' + me.screen_name);
    
    console.log('\n🔄 COMPARISON:');
    console.log('Posting Account ID:  ', me.id_str);
    console.log('Database Account ID: ', '1968371267142352896');
    console.log('Match:', me.id_str === '1968371267142352896' ? '✅ YES' : '❌ NO');
    
    if (me.id_str !== '1968371267142352896') {
      console.log('\n🚨 ISSUE FOUND:');
      console.log('Your app is posting to Twitter account:', `@${me.screen_name}`);
      console.log('But your X Profile page is looking for tweets from a different account!');
      console.log('\n🔧 SOLUTION OPTIONS:');
      console.log('1. Update your database to use the posting account ID');
      console.log('2. Or connect the correct Twitter account for posting');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPostingAccount();