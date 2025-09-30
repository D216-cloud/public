require('dotenv').config();

const { TwitterApi } = require('twitter-api-v2');

// Test function to fetch Twitter profile image
async function testTwitterProfileImage(username) {
  try {
    // Check if Twitter Bearer Token is configured
    if (!process.env.TWITTER_BEARER_TOKEN) {
      console.log('TWITTER_BEARER_TOKEN not configured in environment variables');
      return null;
    }

    // Use Twitter API to get the profile image
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Get user info including profile image
    const user = await twitterClient.v2.userByUsername(username, {
      'user.fields': ['profile_image_url']
    });
    
    if (user.data && user.data.profile_image_url) {
      // Use the higher resolution version
      const profileImageUrl = user.data.profile_image_url.replace('_normal', '_400x400');
      console.log('Profile image URL:', profileImageUrl);
      return profileImageUrl;
    } else {
      console.log('No profile image found for user:', username);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Twitter profile image:', error);
    return null;
  }
}

// Test with a known Twitter username
testTwitterProfileImage('elonmusk')
  .then(url => {
    if (url) {
      console.log('Successfully fetched profile image URL');
    } else {
      console.log('Failed to fetch profile image URL');
    }
  });