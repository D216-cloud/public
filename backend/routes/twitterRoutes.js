const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Twitter API credentials - using the provided values directly
const TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAP0k4QEAAAAAMs1YJDzpPKEPoT%2F78eQp1mz7Vnk%3DrTSRe7Lt4FMZZQRIHi0H19jXsyHTLQGHLENUOq5DtlXe8Zx2ko';

// Initialize Twitter client
const twitterClient = new TwitterApi(TWITTER_BEARER_TOKEN);

// @route   POST /api/twitter/connect
// @desc    Simple connect Twitter username (for onboarding)
// @access  Private
router.post('/connect', protect, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    // For onboarding, we'll do a simple connection without full OAuth
    // Just verify the username exists and store it
    try {
      const twitterUser = await twitterClient.v2.userByUsername(cleanUsername);
      
      if (!twitterUser.data) {
        return res.status(404).json({
          success: false,
          message: 'Twitter user not found. Please check the username.'
        });
      }

      // Update user with Twitter info
      await User.findByIdAndUpdate(
        req.user.id,
        {
          twitterUsername: twitterUser.data.username,
          twitterId: twitterUser.data.id,
          twitterConnected: true
        }
      );

      res.json({
        success: true,
        message: 'Twitter account connected successfully',
        twitterUser: {
          id: twitterUser.data.id,
          username: twitterUser.data.username,
          name: twitterUser.data.name
        }
      });
    } catch (twitterError) {
      console.error('Twitter API error:', twitterError);
      return res.status(404).json({
        success: false,
        message: 'Could not find that Twitter username. Please check and try again.'
      });
    }
  } catch (error) {
    console.error('Twitter connect error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Twitter account'
    });
  }
});

// @route   POST /api/twitter/verify
// @desc    Verify Twitter username and generate verification code
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    // Verify the user exists on Twitter
    const twitterUser = await twitterClient.v2.userByUsername(cleanUsername);

    if (!twitterUser.data) {
      return res.status(404).json({
        success: false,
        message: 'Twitter user not found'
      });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code temporarily (in production, use Redis or database)
    // For now, we'll store it in the user document temporarily
    await User.findByIdAndUpdate(
      req.user.id,
      {
        tempTwitterUsername: twitterUser.data.username,
        tempTwitterId: twitterUser.data.id,
        twitterVerificationCode: verificationCode,
        verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    );

    res.json({
      success: true,
      message: 'User verified. Please add this code to your Twitter bio or tweet it, then click verify.',
      verificationCode,
      twitterUser: {
        id: twitterUser.data.id,
        username: twitterUser.data.username,
        name: twitterUser.data.name
      }
    });
  } catch (error) {
    console.error('Twitter verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify Twitter username'
    });
  }
});

// @route   POST /api/twitter/confirm
// @desc    Confirm Twitter connection with verification code
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user.twitterVerificationCode || !user.verificationCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No verification process found. Please start over.'
      });
    }

    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please start over.'
      });
    }

    if (user.twitterVerificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.'
      });
    }

    // Verification successful - connect the account
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        twitterId: user.tempTwitterId,
        twitterUsername: user.tempTwitterUsername,
        twitterConnected: true,
        $unset: {
          tempTwitterUsername: 1,
          tempTwitterId: 1,
          twitterVerificationCode: 1,
          verificationCodeExpiry: 1
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Twitter account connected successfully',
      twitterUser: {
        id: user.tempTwitterId,
        username: user.tempTwitterUsername
      }
    });
  } catch (error) {
    console.error('Twitter confirm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm Twitter connection'
    });
  }
});

// @route   POST /api/twitter/disconnect
// @desc    Disconnect Twitter account
// @access  Private
router.post('/disconnect', protect, async (req, res) => {
  try {
    // Update user in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $unset: {
          twitterId: 1,
          twitterUsername: 1,
          twitterAccessToken: 1,
          twitterRefreshToken: 1
        },
        twitterConnected: false,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Twitter account disconnected successfully'
    });
  } catch (error) {
    console.error('Twitter disconnect error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect Twitter account'
    });
  }
});

// @route   GET /api/twitter/status
// @desc    Get Twitter connection status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      connected: user.twitterConnected || false,
      username: user.twitterUsername || null,
      twitterId: user.twitterId || null
    });
  } catch (error) {
    console.error('Twitter status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Twitter status'
    });
  }
});

module.exports = router;