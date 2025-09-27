const { TwitterApi } = require('twitter-api-v2');
const NodeCache = require('node-cache');
require('dotenv').config();

// Initialize cache with 5 minute TTL (Twitter API rate limits)
const verificationCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Rate limiting tracking
const rateLimitTracker = {
  requests: 0,
  lastReset: Date.now(),
  maxRequestsPerWindow: 300, // Twitter's rate limit for app-only auth
  windowMs: 15 * 60 * 1000 // 15 minutes
};

/**
 * Check if we're within rate limits
 * @returns {boolean} - Whether we can make another request
 */
const canMakeRequest = () => {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - rateLimitTracker.lastReset > rateLimitTracker.windowMs) {
    rateLimitTracker.requests = 0;
    rateLimitTracker.lastReset = now;
  }
  
  return rateLimitTracker.requests < rateLimitTracker.maxRequestsPerWindow;
};

/**
 * Increment request counter
 */
const incrementRequestCounter = () => {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - rateLimitTracker.lastReset > rateLimitTracker.windowMs) {
    rateLimitTracker.requests = 0;
    rateLimitTracker.lastReset = now;
  }
  
  rateLimitTracker.requests++;
};

/**
 * Verify Twitter username exists (with proper rate limiting and caching)
 * @param {string} username - Twitter username to verify
 * @returns {Promise<Object>} - Verification result
 */
const verifyTwitterUsername = async (username) => {
  try {
    // Validate input
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username provided');
    }
    
    // Clean username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Check cache first
    const cachedResult = verificationCache.get(cleanUsername);
    if (cachedResult !== undefined) {
      return {
        success: true,
        cached: true,
        data: cachedResult
      };
    }
    
    // Check rate limits
    if (!canMakeRequest()) {
      return {
        success: false,
        rateLimited: true,
        message: 'Rate limit exceeded. Please try again later.'
      };
    }
    
    // Check if Bearer Token is configured
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error('Twitter Bearer Token not configured');
    }
    
    // Increment request counter
    incrementRequestCounter();
    
    // Initialize Twitter client with Bearer Token
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Fetch user information (minimal data to reduce payload)
    const user = await client.v2.userByUsername(cleanUsername, {
      'user.fields': ['id', 'username', 'public_metrics']
    });
    
    // Check if user was found
    if (user.data) {
      // Cache the result
      verificationCache.set(cleanUsername, {
        id: user.data.id,
        username: user.data.username,
        followers: user.data.public_metrics?.followers_count || 0
      });
      
      return {
        success: true,
        cached: false,
        data: {
          id: user.data.id,
          username: user.data.username,
          followers: user.data.public_metrics?.followers_count || 0
        }
      };
    } else {
      // Cache the negative result to avoid repeated lookups
      verificationCache.set(cleanUsername, null);
      
      return {
        success: false,
        message: 'Twitter username not found'
      };
    }
  } catch (error) {
    // Handle specific error cases
    if (error.code === 429) {
      return {
        success: false,
        rateLimited: true,
        message: 'Rate limit exceeded. Please try again later.'
      };
    } else if (error.code === 401) {
      console.error('Twitter API authentication failed:', error);
      throw new Error('Twitter API authentication failed. Please check credentials.');
    } else if (error.code === 404) {
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      // Cache the negative result
      verificationCache.set(cleanUsername, null);
      
      return {
        success: false,
        message: 'Twitter username not found'
      };
    } else {
      console.error('Twitter verification error:', error);
      throw new Error(`Failed to verify Twitter username: ${error.message}`);
    }
  }
};

/**
 * Get rate limit status
 * @returns {Object} - Current rate limit status
 */
const getRateLimitStatus = () => {
  const now = Date.now();
  const timeUntilReset = rateLimitTracker.windowMs - (now - rateLimitTracker.lastReset);
  
  return {
    remainingRequests: Math.max(0, rateLimitTracker.maxRequestsPerWindow - rateLimitTracker.requests),
    maxRequests: rateLimitTracker.maxRequestsPerWindow,
    timeUntilReset: Math.max(0, timeUntilReset),
    isRateLimited: !canMakeRequest()
  };
};

/**
 * Clear cache for a specific username
 * @param {string} username - Username to clear from cache
 */
const clearCacheForUsername = (username) => {
  const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
  verificationCache.del(cleanUsername);
};

/**
 * Clear entire cache
 */
const clearCache = () => {
  verificationCache.flushAll();
};

module.exports = {
  verifyTwitterUsername,
  getRateLimitStatus,
  clearCacheForUsername,
  clearCache
};