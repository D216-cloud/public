const cron = require('node-cron');
const Post = require('../models/Post');
const User = require('../models/User');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const { TwitterApi } = require('twitter-api-v2');

// Function to post content to Twitter with optional image
const postToTwitter = async (content, userId, imageBuffer = null) => {
  try {
    // Get user's Twitter connection
    const user = await User.findById(userId);
    if (!user || !user.twitterId) {
      throw new Error('Twitter account not connected');
    }

    // Get the user's Twitter connection with access tokens
    const twitterConnection = await UserTwitterConnection.findOne({ 
      userId: userId, 
      twitterId: user.twitterId 
    });
    
    if (!twitterConnection || !twitterConnection.accessToken) {
      throw new Error('Twitter access token not found');
    }

    // Initialize Twitter client with user's access tokens
    const client = new TwitterApi(twitterConnection.accessToken);

    let mediaId = null;
    if (imageBuffer) {
      // Upload image and get media ID
      mediaId = await client.v1.uploadMedia(imageBuffer, { type: 'png' });
    }

    // Prepare tweet parameters
    const tweetParams = { text: content };
    
    if (mediaId) {
      tweetParams.media = { media_ids: [mediaId] };
    }

    // Post the tweet using v2 API
    const tweet = await client.v2.tweet(tweetParams);
    
    console.log(`Posted to Twitter: ${content}`);
    return { id: tweet.data.id, text: content };
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    throw error;
  }
};

// Process scheduled posts
const processScheduledPosts = async () => {
  try {
    const now = new Date();
    
    // Find posts that are scheduled and due to be posted
    const scheduledPosts = await Post.find({
      status: 'scheduled',
      scheduledFor: { $lte: now }
    }).limit(10); // Limit to 10 posts at a time to prevent blocking
    
    if (scheduledPosts.length === 0) {
      // Only log when there are posts to avoid spamming the console
      // console.log('No scheduled posts to process');
      return;
    }
    
    console.log(`Processing ${scheduledPosts.length} scheduled posts`);
    
    // Process each scheduled post
    for (const post of scheduledPosts) {
      try {
        // Post to Twitter
        await postToTwitter(post.content, post.userId);
        
        // Update post status
        post.status = 'posted';
        post.postedAt = new Date();
        await post.save();
        
        console.log(`Successfully posted scheduled post: ${post._id}`);
      } catch (error) {
        console.error(`Error posting scheduled post ${post._id}:`, error);
        
        // Update post status to failed
        post.status = 'failed';
        await post.save();
      }
    }
  } catch (error) {
    console.error('Error processing scheduled posts:', error);
  }
};

// Start the scheduler
const startScheduler = () => {
  // Run every 5 minutes instead of every minute to reduce load
  cron.schedule('*/5 * * * *', async () => {
    console.log('Checking for scheduled posts...');
    await processScheduledPosts();
  });
  
  console.log('Scheduler started - checking for scheduled posts every 5 minutes');
};

module.exports = {
  startScheduler,
  processScheduledPosts
};