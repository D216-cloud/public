const cron = require('node-cron');
const Post = require('../models/Post');
const User = require('../models/User');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const { TwitterApi } = require('twitter-api-v2');

// Function to post content to Twitter with optional media (images/videos)
const postToTwitter = async (content, userId, mediaFiles = null) => {
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

    let mediaIds = [];
    
    if (mediaFiles) {
      // Handle single file (backward compatibility)
      if (Buffer.isBuffer(mediaFiles)) {
        try {
          const mediaId = await client.v1.uploadMedia(mediaFiles, { type: 'png' });
          mediaIds.push(mediaId);
        } catch (error) {
          console.error('Error uploading single media file:', error);
          throw new Error('Failed to upload media file');
        }
      } 
      // Handle multiple files
      else if (Array.isArray(mediaFiles)) {
        const videos = mediaFiles.filter(file => file.mimetype.startsWith('video/'));
        const images = mediaFiles.filter(file => file.mimetype.startsWith('image/'));
        
        // Twitter limitation: only 1 video OR up to 4 images
        if (videos.length > 1) {
          throw new Error('Only one video can be posted at a time');
        }
        
        if (videos.length > 0 && images.length > 0) {
          throw new Error('Cannot post videos and images together');
        }
        
        if (images.length > 4) {
          throw new Error('Maximum 4 images can be posted at once');
        }
        
        // Upload each media file
        for (const file of mediaFiles) {
          try {
            let mediaType = 'png';
            if (file.mimetype.startsWith('video/')) {
              mediaType = 'mp4';
            } else if (file.mimetype === 'image/jpeg') {
              mediaType = 'jpg';
            } else if (file.mimetype === 'image/gif') {
              mediaType = 'gif';
            }
            
            console.log(`Uploading ${file.mimetype} file (${Math.round(file.buffer.length / 1024)}KB)`);
            const mediaId = await client.v1.uploadMedia(file.buffer, { type: mediaType });
            mediaIds.push(mediaId);
            console.log(`✅ Media uploaded successfully: ${mediaId}`);
          } catch (error) {
            console.error('Error uploading media file:', error);
            throw new Error(`Failed to upload ${file.mimetype} file: ${error.message}`);
          }
        }
      }
    }

    // Prepare tweet parameters
    const tweetParams = { text: content };
    
    if (mediaIds.length > 0) {
      tweetParams.media = { media_ids: mediaIds };
      console.log(`📎 Attaching ${mediaIds.length} media file(s) to tweet`);
    }

    // Post the tweet using v2 API
    const tweet = await client.v2.tweet(tweetParams);
    
    console.log(`🐦 Posted to Twitter: "${content}" ${mediaIds.length > 0 ? `with ${mediaIds.length} media file(s)` : ''}`);
    return { id: tweet.data.id, text: content, mediaCount: mediaIds.length };
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
  postToTwitter,
  startScheduler,
  processScheduledPosts
};