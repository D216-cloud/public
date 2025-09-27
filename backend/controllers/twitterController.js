const twitterService = require('../services/twitterService');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const User = require('../models/User');
const crypto = require('crypto');
const { verifyTwitterUsername } = require('../utils/twitterAuth');

/**
 * Twitter Controller
 * 
 * Handles all Twitter-related API endpoints
 */

/**
 * Begin Twitter OAuth flow
 * @route GET /api/twitter/auth
 * @access Private
 */
const beginTwitterAuth = async (req, res) => {
  try {
    // Check if Twitter credentials are configured
    if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Twitter API credentials not configured. Please set TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in your environment variables.'
      });
    }
    
    // Generate a random state for security
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store state in user document temporarily
    await User.findByIdAndUpdate(req.user.id, {
      tempAuthState: state
    });
    
    // Get OAuth URL
    const { url, codeVerifier } = twitterService.getTwitterOAuthURL(state);
    
    // Store code verifier in user document
    await User.findByIdAndUpdate(req.user.id, {
      tempCodeVerifier: codeVerifier
    });
    
    res.json({
      success: true,
      authUrl: url
    });
  } catch (error) {
    console.error('Twitter auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Twitter authentication: ' + (error.message || 'Unknown error')
    });
  }
};

/**
 * Begin Twitter OAuth flow for public users (no authentication required)
 * @route GET /api/twitter/auth/public
 * @access Public
 */
const beginTwitterAuthPublic = async (req, res) => {
  try {
    // Check if Twitter credentials are configured
    if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Twitter API credentials not configured. Please set TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in your environment variables.'
      });
    }
    
    // Generate a random state for security
    const state = crypto.randomBytes(16).toString('hex');
    
    // For public auth, we'll store state in a temporary way
    // In a production environment, you might want to use a more robust solution
    // like Redis or a temporary database collection
    global.tempAuthStates = global.tempAuthStates || {};
    global.tempAuthStates[state] = {
      createdAt: Date.now(),
      // We'll need to handle the callback differently for public users
      isPublicAuth: true
    };
    
    // Get OAuth URL using the existing service function
    const { url, codeVerifier } = twitterService.getTwitterOAuthURL(state);
    
    // Store code verifier temporarily
    global.tempAuthStates[state].codeVerifier = codeVerifier;
    
    res.json({
      success: true,
      authUrl: url
    });
  } catch (error) {
    console.error('Twitter public auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Twitter authentication: ' + (error.message || 'Unknown error')
    });
  }
};

/**
 * Handle Twitter OAuth callback
 * @route GET /api/twitter/callback
 * @access Public (but requires state verification)
 */
const handleTwitterCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Check if this is a public auth flow
    let isPublicAuth = false;
    let tempAuthData = null;
    
    // First check if it's a regular authenticated user flow
    let user = await User.findOne({ tempAuthState: state });
    
    if (!user) {
      // Check if it's a public auth flow
      if (global.tempAuthStates && global.tempAuthStates[state]) {
        isPublicAuth = true;
        tempAuthData = global.tempAuthStates[state];
        
        // Clean up expired states (older than 1 hour)
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        Object.keys(global.tempAuthStates).forEach(key => {
          if (global.tempAuthStates[key].createdAt < oneHourAgo) {
            delete global.tempAuthStates[key];
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid state parameter'
        });
      }
    }
    
    // Get code verifier
    let codeVerifier;
    if (isPublicAuth) {
      codeVerifier = tempAuthData.codeVerifier;
    } else {
      codeVerifier = user.tempCodeVerifier;
    }
    
    if (!codeVerifier) {
      return res.status(400).json({
        success: false,
        message: 'Missing code verifier'
      });
    }
    
    // Handle OAuth callback
    const twitterData = await twitterService.handleTwitterCallback(code, codeVerifier);
    
    if (isPublicAuth) {
      // For public auth, redirect to a special page that can handle the Twitter data
      // This would typically be a page that allows the user to sign up or log in
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      
      // Clean up the temporary state
      delete global.tempAuthStates[state];
      
      // Redirect to a page that can handle the Twitter data
      // You might want to pass the Twitter data as query parameters or use sessions
      res.redirect(`${frontendUrl}/twitter-signup?twitterData=${encodeURIComponent(JSON.stringify(twitterData))}`);
    } else {
      // Store temporary connection data for authenticated users
      await twitterService.storeTempTwitterConnection(user._id, twitterData, codeVerifier);
      
      // Clean up temporary fields
      await User.findByIdAndUpdate(user._id, {
        $unset: {
          tempAuthState: 1,
          tempCodeVerifier: 1
        }
      });
      
      // Redirect to frontend with success
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      res.redirect(`${frontendUrl}/onboarding?twitterConnected=true&screenName=${twitterData.userInfo.username}`);
    }
  } catch (error) {
    console.error('Twitter callback error:', error);
    
    // Redirect to frontend with error - use a generic message to avoid URL issues
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    let errorMessage = 'Failed to complete Twitter authentication';
    
    // Provide more specific error messages based on the error type
    if (error.message && error.message.includes('credentials')) {
      errorMessage = 'Twitter API credentials not configured properly';
    } else if (error.message && error.message.includes('state')) {
      errorMessage = 'Invalid authentication state - please try again';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Limit the error message length and encode it properly
    const safeErrorMessage = encodeURIComponent(errorMessage.substring(0, 200));
    
    // Check if this is a public auth flow
    const state = req.query.state;
    let isPublicAuth = false;
    if (global.tempAuthStates && global.tempAuthStates[state]) {
      isPublicAuth = true;
      delete global.tempAuthStates[state];
    }
    
    if (isPublicAuth) {
      res.redirect(`${frontendUrl}/twitter-signup?error=${safeErrorMessage}`);
    } else {
      res.redirect(`${frontendUrl}/onboarding?twitterConnected=false&error=${safeErrorMessage}`);
    }
  }
};

/**
 * Send OTP to email for verification
 * @route POST /api/twitter/send-otp
 * @access Private
 */
const sendOTP = async (req, res) => {
  try {
    const { twitterId, email } = req.body;
    
    if (!twitterId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Twitter ID and email are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Generate and send OTP
    const { otp, otpExpiry } = await twitterService.generateAndSendOTP(req.user.id, twitterId, email);
    
    res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresAt: otpExpiry
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    
    // Provide more specific error messages
    let errorMessage = error.message || 'Failed to send OTP';
    
    if (errorMessage.includes('Email authentication failed')) {
      errorMessage = 'Email configuration error. Please contact support.';
    } else if (errorMessage.includes('Failed to send verification email')) {
      errorMessage = 'Unable to send verification email. Please check your email address and try again.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Verify OTP
 * @route POST /api/twitter/verify-otp
 * @access Private
 */
const verifyOTP = async (req, res) => {
  try {
    const { twitterId, otp } = req.body;
    
    if (!twitterId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Twitter ID and OTP are required'
      });
    }
    
    // Verify OTP
    await twitterService.verifyOTP(req.user.id, twitterId, otp);
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to verify OTP'
    });
  }
};

/**
 * Generate verification code for tweet verification
 * @route POST /api/twitter/generate-verify-code
 * @access Private
 */
const generateVerifyCode = async (req, res) => {
  try {
    const { twitterId } = req.body;
    
    if (!twitterId) {
      return res.status(400).json({
        success: false,
        message: 'Twitter ID is required'
      });
    }
    
    // Generate verification code
    const verificationCode = await twitterService.generateVerificationCodeForTweet(req.user.id, twitterId);
    
    res.json({
      success: true,
      verificationCode,
      message: 'Verification code generated successfully'
    });
  } catch (error) {
    console.error('Generate verify code error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate verification code'
    });
  }
};

/**
 * Check for verification tweet
 * @route POST /api/twitter/check-verify-code
 * @access Private
 */
const checkVerifyCode = async (req, res) => {
  try {
    const { twitterId, code } = req.body;
    
    if (!twitterId || !code) {
      return res.status(400).json({
        success: false,
        message: 'Twitter ID and verification code are required'
      });
    }
    
    // Verify tweet code
    await twitterService.verifyTweetCode(req.user.id, twitterId, code);
    
    res.json({
      success: true,
      message: 'Twitter account verified successfully'
    });
  } catch (error) {
    console.error('Check verify code error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to verify Twitter account'
    });
  }
};

/**
 * Toggle auto-posting
 * @route POST /api/twitter/toggle-auto-post
 * @access Private
 */
const toggleAutoPost = async (req, res) => {
  try {
    const { twitterId, enable } = req.body;
    
    if (!twitterId || typeof enable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Twitter ID and enable status are required'
      });
    }
    
    // Toggle auto-posting
    await twitterService.toggleAutoPost(req.user.id, twitterId, enable);
    
    res.json({
      success: true,
      message: `Auto-posting ${enable ? 'enabled' : 'disabled'} successfully`,
      autoPostEnabled: enable
    });
  } catch (error) {
    console.error('Toggle auto-post error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to toggle auto-posting'
    });
  }
};

/**
 * Get Twitter connection status
 * @route GET /api/twitter/status
 * @access Private
 */
const getTwitterStatus = async (req, res) => {
  try {
    const status = await twitterService.getTwitterConnectionStatus(req.user.id);
    
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Get Twitter status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Twitter status'
    });
  }
};

/**
 * Confirm Twitter connection (move from temp to permanent)
 * @route POST /api/twitter/confirm
 * @access Private
 */
const confirmTwitterConnection = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.tempTwitterData) {
      return res.status(400).json({
        success: false,
        message: 'No temporary Twitter connection found'
      });
    }
    
    // Create permanent connection
    const connection = await twitterService.createOrUpdateConnection(req.user.id, {
      twitterId: user.tempTwitterData.userInfo.id,
      screenName: user.tempTwitterData.userInfo.username,
      accessToken: user.tempTwitterData.accessToken,
      refreshToken: user.tempTwitterData.refreshToken
    });
    
    // Clean up temporary data
    await User.findByIdAndUpdate(req.user.id, {
      $unset: {
        tempTwitterData: 1
      }
    });
    
    res.json({
      success: true,
      message: 'Twitter account connected successfully',
      connection: {
        id: connection._id,
        twitterId: connection.twitterId,
        screenName: connection.screenName,
        verified: connection.verified,
        connectedAt: connection.connectedAt
      }
    });
  } catch (error) {
    console.error('Confirm Twitter connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm Twitter connection'
    });
  }
};

/**
 * Disconnect Twitter account
 * @route POST /api/twitter/disconnect
 * @access Private
 */
const disconnectTwitter = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.twitterId) {
      // Remove permanent connection
      await UserTwitterConnection.findOneAndDelete({
        userId: req.user.id,
        twitterId: user.twitterId
      });
      
      // Update user document
      await User.findByIdAndUpdate(req.user.id, {
        $unset: {
          twitterId: 1,
          twitterUsername: 1,
          twitterConnected: 1
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Twitter account disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect Twitter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect Twitter account'
    });
  }
};

/**
 * Verify Twitter username exists
 * @route POST /api/twitter/verify-username
 * @access Private
 */
const verifyTwitterUsernameController = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Twitter username is required'
      });
    }

    // Check if Twitter Bearer Token is configured
    if (!process.env.TWITTER_BEARER_TOKEN) {
      console.error('TWITTER_BEARER_TOKEN not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Twitter API not properly configured. Please contact support.'
      });
    }

    try {
      // Check if user exists using our utility function
      const user = await verifyTwitterUsername(username);
      
      if (user.data) {
        return res.json({
          success: true,
          message: 'Username verified successfully',
          userId: user.data.id
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Twitter username not found'
        });
      }
    } catch (twitterError) {
      console.error('Twitter API error:', twitterError);
      
      // Handle specific Twitter API errors
      if (twitterError.code === 401) {
        return res.status(401).json({
          success: false,
          message: 'Twitter API authentication failed. Please contact support.'
        });
      } else if (twitterError.code === 404) {
        return res.status(404).json({
          success: false,
          message: 'Twitter username not found'
        });
      } else if (twitterError.code === 429) {
        return res.status(429).json({
          success: false,
          message: 'Twitter API rate limit exceeded. Please try again later.'
        });
      }
      
      // Generic error handling
      return res.status(500).json({
        success: false,
        message: 'Failed to verify Twitter username. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Verify Twitter username error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify Twitter username. Please try again later.'
    });
  }
};

/**
 * Connect Twitter account directly (without OAuth)
 * @route POST /api/twitter/connect-direct
 * @access Private
 */
const connectTwitterDirect = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Twitter username is required'
      });
    }

    // Create a simple connection without OAuth tokens
    const User = require('../models/User');
    const UserTwitterConnection = require('../models/UserTwitterConnections');
    
    // Update user document
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        twitterConnected: true,
        twitterUsername: username,
        twitterId: `temp_${Date.now()}` // Temporary ID since we don't have real OAuth
      },
      { new: true }
    );

    // Create connection record
    await UserTwitterConnection.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        twitterId: `temp_${Date.now()}`,
        screenName: username,
        verified: false, // Not verified through OAuth
        connectedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Twitter account connected successfully',
      username: username
    });
  } catch (error) {
    console.error('Connect Twitter direct error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect Twitter account'
    });
  }
};

module.exports = {
  beginTwitterAuth,
  beginTwitterAuthPublic,
  handleTwitterCallback,
  sendOTP,
  verifyOTP,
  generateVerifyCode,
  checkVerifyCode,
  toggleAutoPost,
  getTwitterStatus,
  confirmTwitterConnection,
  disconnectTwitter,
  verifyTwitterUsername: verifyTwitterUsernameController,
  connectTwitterDirect
};
