const { TwitterApi } = require('twitter-api-v2');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const User = require('../models/User');
const crypto = require('crypto');
const { sendVerificationCodeEmail } = require('../utils/sendMail');

/**
 * Twitter Service
 * 
 * Handles all Twitter-related operations including OAuth, verification, and posting
 */

// Twitter API configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/twitter/callback';

// Log configuration for debugging
console.log('Twitter API Configuration:');
console.log('- TWITTER_CLIENT_ID:', TWITTER_CLIENT_ID ? '✓ Set' : '✗ Not set');
console.log('- TWITTER_CLIENT_SECRET:', TWITTER_CLIENT_SECRET ? '✓ Set' : '✗ Not set');
console.log('- TWITTER_CALLBACK_URL:', TWITTER_CALLBACK_URL);

/**
 * Generate a random verification code
 * @returns {string} - Verification code in format MYAPP-VERIFY-XXXXXX
 */
const generateVerificationCode = () => {
  const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `MYAPP-VERIFY-${randomString}`;
};

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Initialize Twitter client with user tokens
 * @param {string} accessToken - User's access token
 * @param {string} refreshToken - User's refresh token
 * @returns {TwitterApi} - Initialized Twitter client
 */
const initializeTwitterClient = (accessToken, refreshToken = null) => {
  if (refreshToken) {
    return new TwitterApi({
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET,
    }).loginWithOAuth2({
      accessToken,
      refreshToken
    });
  }
  
  return new TwitterApi(accessToken);
};

/**
 * Get Twitter OAuth2 URL for authentication
 * @param {string} state - State parameter for security
 * @returns {string} - OAuth URL
 */
const getTwitterOAuthURL = (state) => {
  // Check if Twitter credentials are configured
  if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
    throw new Error('Twitter API credentials not configured. Please set TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in your environment variables.');
  }
  
  const client = new TwitterApi({
    clientId: TWITTER_CLIENT_ID,
    clientSecret: TWITTER_CLIENT_SECRET,
  });
  
  const { url, codeVerifier } = client.generateOAuth2AuthLink(TWITTER_CALLBACK_URL, {
    state,
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
  });
  
  return { url, codeVerifier };
};

/**
 * Handle Twitter OAuth callback
 * @param {string} code - Authorization code from Twitter
 * @param {string} codeVerifier - Code verifier for PKCE
 * @returns {Object} - Access tokens and user info
 */
const handleTwitterCallback = async (code, codeVerifier) => {
  try {
    const client = new TwitterApi({
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET,
    });
    
    const { accessToken, refreshToken, expiresIn, client: loggedClient } = 
      await client.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: TWITTER_CALLBACK_URL
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
  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    // Provide more specific error messages
    if (error.code === 'ETIMEDOUT') {
      throw new Error('Twitter API request timed out. Please try again.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to Twitter API. Please check your internet connection.');
    } else if (error.data?.detail) {
      throw new Error(`Twitter API error: ${error.data.detail}`);
    } else if (error.message && error.message.includes('client_id')) {
      throw new Error('Invalid Twitter client credentials. Please check your TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET configuration.');
    } else if (error.message && error.message.includes('redirect_uri')) {
      throw new Error('Invalid redirect URI. Please check your TWITTER_CALLBACK_URL configuration.');
    } else {
      throw new Error(`Twitter authentication failed: ${error.message || 'Unknown error'}. Please try again.`);
    }
  }
};

/**
 * Store temporary Twitter connection data
 * @param {string} userId - User ID
 * @param {Object} twitterData - Twitter OAuth data
 * @param {string} codeVerifier - Code verifier for PKCE
 * @returns {Promise<User>} - Updated user document
 */
const storeTempTwitterConnection = async (userId, twitterData, codeVerifier) => {
  // Store temporary data in user document
  const user = await User.findByIdAndUpdate(
    userId,
    {
      tempTwitterData: {
        ...twitterData,
        codeVerifier,
        createdAt: new Date()
      }
    },
    { new: true }
  );
  
  return user;
};

/**
 * Create or update UserTwitterConnection
 * @param {string} userId - User ID
 * @param {Object} connectionData - Connection data
 * @returns {Promise<UserTwitterConnection>} - Connection document
 */
const createOrUpdateConnection = async (userId, connectionData) => {
  const connection = await UserTwitterConnection.findOneAndUpdate(
    { userId, twitterId: connectionData.twitterId },
    {
      ...connectionData,
      userId
    },
    { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
  
  // Update user with Twitter connection status
  await User.findByIdAndUpdate(userId, {
    twitterConnected: true,
    twitterId: connectionData.twitterId,
    twitterUsername: connectionData.screenName
  });
  
  return connection;
};

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPViaEmail = async (email, otp, userId) => {
  try {
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Send verification code email
    const result = await sendVerificationCodeEmail(
      email, 
      user.name || 'User', 
      otp, 
      'Twitter Account'
    );
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    // Provide more specific error messages for common issues
    if (error.code === 'EAUTH' || (error.message && error.message.includes('Invalid login'))) {
      throw new Error('Email authentication failed. Please ensure you are using an App Password if you have 2-Factor Authentication enabled.');
    } else if (error.code === 'EENVELOPE') {
      throw new Error('Invalid email address. Please check the recipient email address.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Unable to connect to email server. Please check your internet connection.');
    } else {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
};

/**
 * Generate and send OTP for email verification
 * @param {string} userId - User ID
 * @param {string} twitterId - Twitter ID
 * @param {string} email - Email to send OTP to
 * @returns {Promise<Object>} - OTP and expiry time
 */
const generateAndSendOTP = async (userId, twitterId, email) => {
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
  // Store OTP in connection
  await UserTwitterConnection.findOneAndUpdate(
    { userId, twitterId },
    {
      otp,
      otpExpiry,
      verificationEmail: email
    }
  );
  
  // Send OTP via email
  const emailSent = await sendOTPViaEmail(email, otp, userId);
  
  if (!emailSent) {
    throw new Error('Failed to send OTP email. Please check your email configuration.');
  }
  
  return { otp, otpExpiry };
};

/**
 * Verify OTP
 * @param {string} userId - User ID
 * @param {string} twitterId - Twitter ID
 * @param {string} otp - OTP to verify
 * @returns {Promise<boolean>} - Verification success
 */
const verifyOTP = async (userId, twitterId, otp) => {
  const connection = await UserTwitterConnection.findOne({ userId, twitterId });
  
  if (!connection) {
    throw new Error('Twitter connection not found');
  }
  
  if (!connection.otp || !connection.otpExpiry) {
    throw new Error('No OTP found for this connection');
  }
  
  if (new Date() > connection.otpExpiry) {
    throw new Error('OTP has expired');
  }
  
  if (connection.otp !== otp) {
    throw new Error('Invalid OTP');
  }
  
  // Mark as verified
  connection.verified = true;
  connection.verifiedBy = 'email';
  connection.verifiedAt = new Date();
  connection.otp = undefined;
  connection.otpExpiry = undefined;
  
  await connection.save();
  
  return true;
};

/**
 * Generate verification code for tweet verification
 * @param {string} userId - User ID
 * @param {string} twitterId - Twitter ID
 * @returns {Promise<string>} - Verification code
 */
const generateVerificationCodeForTweet = async (userId, twitterId) => {
  const verificationCode = generateVerificationCode();
  const codeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  // Store verification code
  await UserTwitterConnection.findOneAndUpdate(
    { userId, twitterId },
    {
      verificationCode,
      verificationCodeExpiry: codeExpiry
    }
  );
  
  return verificationCode;
};

/**
 * Verify tweet contains verification code
 * @param {string} userId - User ID
 * @param {string} twitterId - Twitter ID
 * @param {string} verificationCode - Code to verify
 * @returns {Promise<boolean>} - Verification success
 */
const verifyTweetCode = async (userId, twitterId, verificationCode) => {
  const connection = await UserTwitterConnection.findOne({ userId, twitterId });
  
  if (!connection) {
    throw new Error('Twitter connection not found');
  }
  
  if (!connection.verificationCode || !connection.verificationCodeExpiry) {
    throw new Error('No verification code found for this connection');
  }
  
  if (new Date() > connection.verificationCodeExpiry) {
    throw new Error('Verification code has expired');
  }
  
  if (connection.verificationCode !== verificationCode) {
    throw new Error('Invalid verification code');
  }
  
  // Mark as verified
  connection.verified = true;
  connection.verifiedBy = 'tweet';
  connection.verifiedAt = new Date();
  connection.verificationCode = undefined;
  connection.verificationCodeExpiry = undefined;
  
  await connection.save();
  
  return true;
};

/**
 * Toggle auto-posting
 * @param {string} userId - User ID
 * @param {string} twitterId - Twitter ID
 * @param {boolean} enable - Enable/disable auto-posting
 * @returns {Promise<boolean>} - Success status
 */
const toggleAutoPost = async (userId, twitterId, enable) => {
  const connection = await UserTwitterConnection.findOne({ userId, twitterId });
  
  if (!connection) {
    throw new Error('Twitter connection not found');
  }
  
  if (!connection.verified) {
    throw new Error('Twitter account must be verified before enabling auto-posting');
  }
  
  connection.autoPostEnabled = enable;
  await connection.save();
  
  return true;
};

/**
 * Check if user has verified Twitter connection
 * @param {string} userId - User ID
 * @param {string} twitterId - Twitter ID
 * @returns {Promise<boolean>} - Verification status
 */
const isTwitterVerified = async (userId, twitterId) => {
  const connection = await UserTwitterConnection.findOne({ userId, twitterId });
  return connection ? connection.verified : false;
};

/**
 * Get Twitter connection status
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Connection status
 */
const getTwitterConnectionStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.twitterId) {
    return { connected: false };
  }
  
  const connection = await UserTwitterConnection.findOne({ userId, twitterId: user.twitterId });
  
  return {
    connected: true,
    verified: connection ? connection.verified : false,
    autoPostEnabled: connection ? connection.autoPostEnabled : false,
    screenName: user.twitterUsername,
    twitterId: user.twitterId
  };
};

module.exports = {
  getTwitterOAuthURL,
  handleTwitterCallback,
  storeTempTwitterConnection,
  createOrUpdateConnection,
  generateAndSendOTP,
  verifyOTP,
  generateVerificationCodeForTweet,
  verifyTweetCode,
  toggleAutoPost,
  isTwitterVerified,
  getTwitterConnectionStatus,
  generateOTP,
  generateVerificationCode
};