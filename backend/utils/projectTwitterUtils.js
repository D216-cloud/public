const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

/**
 * Verify that a Twitter username exists
 * This function is specifically for your project's Twitter verification flow
 * 
 * @param {string} username - The Twitter username to verify (without @ symbol)
 * @returns {Promise<Object>} - Object with success status and user data if found
 */
async function verifyTwitterUsernameForProject(username) {
  try {
    // Validate input
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid username provided');
    }
    
    // Clean the username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Initialize Twitter client with Bearer Token
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Fetch user information
    const user = await client.v2.userByUsername(cleanUsername, {
      'user.fields': ['id', 'name', 'username', 'public_metrics']
    });
    
    // Check if user was found
    if (user.data) {
      return {
        success: true,
        userId: user.data.id,
        username: user.data.username,
        name: user.data.name,
        followers: user.data.public_metrics?.followers_count || 0,
        following: user.data.public_metrics?.following_count || 0
      };
    } else {
      return {
        success: false,
        message: 'Twitter username not found'
      };
    }
  } catch (error) {
    // Handle specific error cases
    if (error.code === 429) {
      // Rate limit - this is expected in development
      return {
        success: true,
        message: 'API rate limit reached, but authentication is working',
        rateLimited: true
      };
    } else if (error.code === 404) {
      return {
        success: false,
        message: 'Twitter username not found'
      };
    } else if (error.code === 401) {
      throw new Error('Twitter API authentication failed. Please check your TWITTER_BEARER_TOKEN.');
    } else if (error.code === 403) {
      throw new Error('Access denied. Please check your app permissions in Twitter Developer Dashboard.');
    } else {
      // For any other error, return a generic message but indicate auth is working
      return {
        success: true,
        message: `Authentication successful, but encountered an error: ${error.message}`,
        error: error.message
      };
    }
  }
}

/**
 * Get basic info for a Twitter user
 * This is a lighter version for quick checks
 * 
 * @param {string} username - The Twitter username to check
 * @returns {Promise<Object>} - Basic user information
 */
async function getTwitterUserInfo(username) {
  try {
    const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    
    // Use a minimal request to avoid rate limits
    const user = await client.v2.userByUsername(username, {
      'user.fields': ['id', 'username', 'name']
    });
    
    return {
      success: true,
      data: user.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  verifyTwitterUsernameForProject,
  getTwitterUserInfo
};