const User = require('../models/User');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const { TwitterApi } = require('twitter-api-v2');

// Simple in-memory cache for Twitter data (in production, use Redis or similar)
const twitterCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get user statistics
 * @route GET /api/user/stats
 * @access Private
 */
const getUserStats = async (req, res) => {
  try {
    console.log('Fetching user stats for user ID:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', user.name, user.email);
    
    // Check cache first
    const cacheKey = `stats_${user._id}`;
    if (twitterCache.has(cacheKey)) {
      const cached = twitterCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Returning cached stats');
        return res.json(cached.data);
      } else {
        // Remove expired cache
        twitterCache.delete(cacheKey);
      }
    }
    
    // Aggregate full profile structure
    let twitterStats = {
      posts: 0,
      following: 0,
      followers: 0,
      likes: 0,
      description: "",
      name: user.name || '',
      username: user.twitterUsername || '',
      location: user.twitterLocation || '',
      profileImageUrl: user.twitterProfileImageUrl || '',
      createdAt: null,
      verified: false
    };

    if (user.twitterId && process.env.TWITTER_BEARER_TOKEN) {
      console.log('User has Twitter connection, fetching real stats');
      try {
        // Initialize Twitter client with Bearer Token
        const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
        
        // Fetch user info including public metrics and description
        let userInfo;
        if (user.twitterUsername) {
          try {
            userInfo = await twitterClient.v2.userByUsername(user.twitterUsername, {
              'user.fields': ['public_metrics', 'description', 'created_at', 'location', 'profile_image_url', 'verified']
            });
          } catch (e) {
            console.log('Lookup by username failed, attempting by ID:', e.message);
          }
        }
        if ((!userInfo || !userInfo.data) && user.twitterId) {
          try {
            userInfo = await twitterClient.v2.user(user.twitterId, {
              'user.fields': ['public_metrics', 'description', 'created_at', 'location', 'profile_image_url', 'verified']
            });
          } catch (e2) {
            console.log('Lookup by ID also failed:', e2.message);
          }
        }
        
        if (userInfo.data) {
          const d = userInfo.data;
          twitterStats = {
            posts: d.public_metrics?.tweet_count ?? 0,
            following: d.public_metrics?.following_count ?? 0,
            followers: d.public_metrics?.followers_count ?? 0,
            likes: d.public_metrics?.like_count ?? 0,
            description: d.description || '',
            name: d.name || twitterStats.name,
            username: d.username || twitterStats.username,
            location: d.location || '',
            profileImageUrl: d.profile_image_url || twitterStats.profileImageUrl,
            createdAt: d.created_at || null,
            verified: !!d.verified
          };

          // Persist any new profile info to User model for reuse
          let dirty = false;
          if (d.profile_image_url && user.twitterProfileImageUrl !== d.profile_image_url) { user.twitterProfileImageUrl = d.profile_image_url; dirty = true; }
          if (d.location && user.twitterLocation !== d.location) { user.twitterLocation = d.location; dirty = true; }
          if (d.description && user.twitterBio !== d.description) { user.twitterBio = d.description; dirty = true; }
          if (d.created_at && user.twitterAccountCreatedAt?.toISOString() !== d.created_at) { user.twitterAccountCreatedAt = new Date(d.created_at); dirty = true; }
          if (dirty) {
            try { await user.save(); } catch (e) { console.log('Could not persist twitter profile info:', e.message); }
          }
        }
      } catch (twitterError) {
        console.error('Error fetching Twitter stats:', twitterError);
        // Instead of mock data, return 0 values with error information
        twitterStats.error = 'Failed to fetch Twitter data';
        twitterStats.message = getTwitterErrorMessage(twitterError);
        if (twitterError.code === 429 && twitterError.rateLimit?.reset) {
          twitterStats.rateLimitResetAt = new Date(twitterError.rateLimit.reset * 1000).toISOString();
        }
      }
    } else {
      console.log('User does not have Twitter connection or Bearer token not configured');
  twitterStats.error = 'No Twitter connection';
  twitterStats.message = user.twitterId ? 'Twitter API not configured' : 'Twitter account not connected';
    }

    const response = {
      success: true,
      posts: twitterStats.posts,
      following: twitterStats.following,
      followers: twitterStats.followers,
      likes: twitterStats.likes,
      description: twitterStats.description || user.twitterBio || '',
      name: twitterStats.name || user.name || '',
      username: twitterStats.username || user.twitterUsername || '',
      location: twitterStats.location || user.twitterLocation || '',
      profileImageUrl: twitterStats.profileImageUrl || user.twitterProfileImageUrl || '',
      createdAt: twitterStats.createdAt || (user.twitterAccountCreatedAt ? user.twitterAccountCreatedAt.toISOString() : null),
      verified: twitterStats.verified,
      error: twitterStats.error,
      message: twitterStats.message,
      rateLimitResetAt: twitterStats.rateLimitResetAt
    };
    
    // Cache the response
    twitterCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
    
    console.log('Sending stats response:', response);
    res.json(response);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics: ' + error.message
    });
  }
};

/**
 * Get user tweets
 * @route GET /api/user/tweets
 * @access Private
 */
const getUserTweets = async (req, res) => {
  try {
    console.log('Fetching user tweets for user ID:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', user.name, user.email);
    
    // Check cache first
    const cacheKey = `tweets_${user._id}`;
    if (twitterCache.has(cacheKey)) {
      const cached = twitterCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Returning cached tweets');
        return res.json(cached.data);
      } else {
        // Remove expired cache
        twitterCache.delete(cacheKey);
      }
    }
    
    let tweets = [];
    let response = {}; // Initialize response object
    
    // Fetch real tweets if user has connected Twitter
    if (user.twitterId && process.env.TWITTER_BEARER_TOKEN) {
      console.log('User has Twitter connection, fetching real tweets');
      try {
        // Initialize Twitter client with Bearer Token
        const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
        
        // First get the user ID from username
        const userLookup = await twitterClient.v2.userByUsername(user.twitterUsername);
        const userId = userLookup.data.id;
        
        // Fetch user's recent tweets using the user ID
        const userTweets = await twitterClient.v2.userTimeline(userId, {
          max_results: 20,
          'tweet.fields': ['created_at', 'public_metrics', 'attachments'],
          'expansions': ['attachments.media_keys'],
          'media.fields': ['url', 'preview_image_url']
        });
        
        if (userTweets.data && userTweets.data.data) {
          // Process tweets to match our expected format
          tweets = userTweets.data.data.map(tweet => ({
            id: tweet.id,
            content: tweet.text,
            timestamp: tweet.created_at,
            likes: tweet.public_metrics?.like_count || 0,
            retweets: tweet.public_metrics?.retweet_count || 0,
            replies: tweet.public_metrics?.reply_count || 0,
            // Add image if available
            ...(tweet.attachments?.media_keys && userTweets.data.includes?.media 
              ? { image: userTweets.data.includes.media[0]?.url || userTweets.data.includes.media[0]?.preview_image_url }
              : {})
          }));
        }
        
        // Set up successful response
        response = {
          success: true,
          tweets: tweets
        };
      } catch (twitterError) {
        console.error('Error fetching Twitter tweets:', twitterError);
        
        // Handle rate limiting specifically
        if (twitterError.code === 429) {
          console.log('Twitter API rate limited, returning empty set with reset hint');
          tweets = [];
          let resetAt = null;
          try {
            // twitterError.data may include rate limit headers when using twitter-api-v2
            const resetHeader = twitterError.rateLimit?.reset || twitterError.rateLimitReset || twitterError.data?.reset;
            if (resetHeader) {
              // If numeric seconds epoch
              if (typeof resetHeader === 'number') {
                resetAt = new Date(resetHeader * 1000).toISOString();
              } else if (typeof resetHeader === 'string' && /\d+/.test(resetHeader)) {
                const num = parseInt(resetHeader, 10);
                if (!isNaN(num) && num > 1000000000) resetAt = new Date(num * 1000).toISOString();
              }
            }
          } catch {}
          response = {
            success: true,
            tweets: [],
            message: 'Twitter API rate limited. Please wait and try again.',
            rateLimited: true,
            rateLimitResetAt: resetAt
          };
        } else {
          // For other errors, return empty array with error information
          tweets = [];
          response = {
            success: false,
            tweets: [],
            error: 'Failed to fetch Twitter tweets',
            message: getTwitterErrorMessage(twitterError)
          };
        }
      }
    } else {
      console.log('User does not have Twitter connection or Bearer token not configured, returning empty tweets');
      tweets = [];
      // Create response for users without Twitter connection
      response = {
        success: true,
        tweets: [],
        message: user.twitterId ? 'Twitter API not configured' : 'Twitter account not connected'
      };
    }
    
    // Cache the response
    twitterCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    console.log('Sending tweets response with', tweets.length, 'tweets');
    res.json(response);
  } catch (error) {
    console.error('Get user tweets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user tweets: ' + error.message
    });
  }
};

// Helper function to get appropriate error message based on Twitter API error
const getTwitterErrorMessage = (error) => {
  if (error.code === 429) {
    return 'Twitter API rate limit reached. Please try again later.';
  } else if (error.code === 401) {
    return 'Twitter API authentication failed. Please reconnect your account.';
  } else if (error.code === 404) {
    return 'Twitter account not found. Please check your username.';
  } else if (error.code === 500 || error.code === 503) {
    return 'Twitter API is temporarily unavailable. Please try again later.';
  } else {
    return 'Failed to fetch data from Twitter. Please try again later.';
  }
};

module.exports = {
  getUserStats,
  getUserTweets
};