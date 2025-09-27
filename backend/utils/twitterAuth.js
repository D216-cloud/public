const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

/**
 * Initialize Twitter client with Bearer Token for read-only operations
 * @returns {TwitterApi} - Twitter API client
 */
const initTwitterClient = () => {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    throw new Error('TWITTER_BEARER_TOKEN is not configured in environment variables');
  }
  
  return new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
};

/**
 * Initialize Twitter client with OAuth 2.0 User Context for authenticated operations
 * @param {string} accessToken - User's access token
 * @param {string} refreshToken - User's refresh token
 * @returns {TwitterApi} - Twitter API client with user context
 */
const initTwitterClientWithUserContext = (accessToken, refreshToken = null) => {
  if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
    throw new Error('Twitter OAuth credentials not configured');
  }
  
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });
  
  if (refreshToken) {
    return client.loginWithOAuth2({
      accessToken,
      refreshToken
    });
  }
  
  return client;
};

/**
 * Generate Twitter OAuth URL for user authentication
 * @param {string} state - State parameter for security
 * @returns {Object} - OAuth URL and code verifier
 */
const generateAuthUrl = (state) => {
  if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
    throw new Error('Twitter OAuth credentials not configured');
  }
  
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });
  
  const callbackUrl = process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/twitter/callback';
  
  return client.generateOAuth2AuthLink(callbackUrl, {
    state,
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
  });
};

/**
 * Handle Twitter OAuth callback
 * @param {string} code - Authorization code from Twitter
 * @param {string} codeVerifier - Code verifier for PKCE
 * @returns {Promise<Object>} - Access tokens and user info
 */
const handleOAuthCallback = async (code, codeVerifier) => {
  if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
    throw new Error('Twitter OAuth credentials not configured');
  }
  
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });
  
  const callbackUrl = process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/twitter/callback';
  
  const { accessToken, refreshToken, expiresIn, client: loggedClient } = 
    await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: callbackUrl
    });
  
  // Get user info
  const { data: userInfo } = await loggedClient.v2.me();
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
    userInfo: {
      id: userInfo.id,
      username: userInfo.username,
      name: userInfo.name
    }
  };
};

/**
 * Verify Twitter username exists
 * @param {string} username - Twitter username to verify
 * @returns {Promise<Object>} - User data if found
 */
const verifyTwitterUsername = async (username) => {
  try {
    const client = initTwitterClient();
    const user = await client.v2.userByUsername(username);
    return user;
  } catch (error) {
    throw new Error(`Failed to verify Twitter username: ${error.message}`);
  }
};

module.exports = {
  initTwitterClient,
  initTwitterClientWithUserContext,
  generateAuthUrl,
  handleOAuthCallback,
  verifyTwitterUsername
};