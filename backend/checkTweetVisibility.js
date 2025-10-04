// Check tweet visibility and account details
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

async function checkTweetVisibility() {
  try {
    console.log('🔍 Checking tweet visibility and account details...');
    
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // 1. Check which account we're posting from
    console.log('\n👤 Checking account details...');
    const userInfo = await client.v2.me({
      'user.fields': ['id', 'username', 'name', 'public_metrics', 'verified', 'protected']
    });
    
    console.log('Account Info:', {
      id: userInfo.data.id,
      username: userInfo.data.username,
      name: userInfo.data.name,
      verified: userInfo.data.verified,
      protected: userInfo.data.protected,
      followers: userInfo.data.public_metrics?.followers_count,
      following: userInfo.data.public_metrics?.following_count,
      tweets: userInfo.data.public_metrics?.tweet_count
    });

    // 2. Check recent tweets to see if our test tweet exists
    console.log('\n📝 Checking recent tweets...');
    const timeline = await client.v2.userTimeline(userInfo.data.id, {
      max_results: 10,
      'tweet.fields': ['id', 'text', 'created_at', 'public_metrics']
    });

    if (timeline.data && timeline.data.length > 0) {
      console.log('Recent tweets:');
      timeline.data.forEach((tweet, index) => {
        console.log(`${index + 1}. ID: ${tweet.id}`);
        console.log(`   Text: ${tweet.text}`);
        console.log(`   Created: ${tweet.created_at}`);
        console.log(`   URL: https://twitter.com/i/web/status/${tweet.id}`);
        console.log('---');
      });
      
      // Look for our test tweet
      const testTweet = timeline.data.find(tweet => tweet.id === '1974383970226782524');
      if (testTweet) {
        console.log('✅ Test tweet found in timeline!');
        console.log('Tweet is visible and posted correctly.');
      } else {
        console.log('⚠️ Test tweet not found in recent timeline.');
        console.log('This might be because:');
        console.log('1. Tweet was deleted');
        console.log('2. Account has many tweets and it\'s not in recent 10');
        console.log('3. There might be a delay in timeline updates');
      }
    } else {
      console.log('❌ No tweets found in timeline');
      console.log('This suggests the account may be new or tweets were deleted');
    }

    // 3. Try to fetch the specific tweet directly
    console.log('\n🔍 Trying to fetch specific tweet...');
    try {
      const specificTweet = await client.v2.singleTweet('1974383970226782524', {
        'tweet.fields': ['id', 'text', 'created_at', 'author_id', 'public_metrics']
      });
      
      console.log('✅ Specific tweet found:');
      console.log('ID:', specificTweet.data.id);
      console.log('Text:', specificTweet.data.text);
      console.log('Created:', specificTweet.data.created_at);
      console.log('Author ID:', specificTweet.data.author_id);
      console.log('URL:', `https://twitter.com/i/web/status/${specificTweet.data.id}`);
      
      if (specificTweet.data.author_id === userInfo.data.id) {
        console.log('✅ Tweet belongs to your account');
      } else {
        console.log('❌ Tweet belongs to different account!');
        console.log('This explains why it doesn\'t show on your profile');
      }
      
    } catch (tweetError) {
      console.log('❌ Could not fetch specific tweet:', tweetError.data?.title || tweetError.message);
      console.log('Possible reasons:');
      console.log('1. Tweet was deleted');
      console.log('2. Tweet is from a different account');
      console.log('3. Access permissions issue');
    }

    // 4. Post a new test tweet to verify current posting
    console.log('\n🆕 Posting new test tweet...');
    const newContent = `🔍 Profile visibility test ${new Date().toLocaleTimeString()} #test`;
    
    try {
      const newTweet = await client.v2.tweet(newContent);
      console.log('✅ New tweet posted successfully!');
      console.log('ID:', newTweet.data.id);
      console.log('URL:', `https://twitter.com/i/web/status/${newTweet.data.id}`);
      console.log('Check your profile now: https://twitter.com/' + userInfo.data.username);
      
    } catch (postError) {
      console.log('❌ Failed to post new tweet:', postError.data?.title || postError.message);
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
    if (error.data) {
      console.error('Details:', error.data);
    }
  }
}

checkTweetVisibility();