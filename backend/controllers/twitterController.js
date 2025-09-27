const twitterService = require('../services/twitterService');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const User = require('../models/User');
const crypto = require('crypto');

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
    
    // Verify state parameter
    const user = await User.findOne({ tempAuthState: state });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }
    
    // Get code verifier
    const codeVerifier = user.tempCodeVerifier;
    
    if (!codeVerifier) {
      return res.status(400).json({
        success: false,
        message: 'Missing code verifier'
      });
    }
    
    // Handle OAuth callback
    const twitterData = await twitterService.handleTwitterCallback(code, codeVerifier);
    
    // Store temporary connection data
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
    res.redirect(`${frontendUrl}/onboarding?twitterConnected=false&error=${safeErrorMessage}`);
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
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
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

module.exports = {
  beginTwitterAuth,
  handleTwitterCallback,
  sendOTP,
  verifyOTP,
  generateVerifyCode,
  checkVerifyCode,
  toggleAutoPost,
  getTwitterStatus,
  confirmTwitterConnection,
  disconnectTwitter
};