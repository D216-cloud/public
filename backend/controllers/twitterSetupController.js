const User = require('../models/User');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const { TwitterApi } = require('twitter-api-v2');

/**
 * Set up Twitter connection with user's API credentials
 * @route POST /api/twitter/setup-credentials
 * @access Private
 */
const setupTwitterCredentials = async (req, res) => {
  try {
    const { accessToken, accessTokenSecret, apiKey, apiSecret } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!accessToken || !accessTokenSecret || !apiKey || !apiSecret) {
      return res.status(400).json({
        success: false,
        message: 'All Twitter API credentials are required: Access Token, Access Token Secret, API Key, and API Secret'
      });
    }

    // Test the credentials by making a simple API call
    try {
      const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
      });

      // Test the credentials by getting user info
      const userInfo = await client.v2.me();
      
      if (!userInfo.data) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Twitter API credentials. Please check your keys and tokens.'
        });
      }

      // Update user with Twitter ID
      const user = await User.findById(userId);
      user.twitterId = userInfo.data.id;
      user.twitterUsername = userInfo.data.username;
      await user.save();

      // Create or update Twitter connection
      let twitterConnection = await UserTwitterConnection.findOne({ 
        userId: userId 
      });

      if (twitterConnection) {
        // Update existing connection
        twitterConnection.twitterId = userInfo.data.id;
        twitterConnection.accessToken = accessToken;
        twitterConnection.accessTokenSecret = accessTokenSecret;
        twitterConnection.apiKey = apiKey;
        twitterConnection.apiSecret = apiSecret;
        twitterConnection.verified = true;
        twitterConnection.verifiedAt = new Date();
        twitterConnection.verifiedBy = 'credentials';
      } else {
        // Create new connection
        twitterConnection = new UserTwitterConnection({
          userId: userId,
          twitterId: userInfo.data.id,
          accessToken: accessToken,
          accessTokenSecret: accessTokenSecret,
          apiKey: apiKey,
          apiSecret: apiSecret,
          verified: true,
          verifiedAt: new Date(),
          verifiedBy: 'credentials'
        });
      }

      await twitterConnection.save();

      res.json({
        success: true,
        message: 'Twitter credentials configured successfully!',
        twitterUser: {
          id: userInfo.data.id,
          username: userInfo.data.username,
          name: userInfo.data.name
        }
      });

    } catch (apiError) {
      console.error('Twitter API test failed:', apiError);
      return res.status(400).json({
        success: false,
        message: 'Failed to verify Twitter credentials. Please check your API keys and tokens.',
        details: apiError.message
      });
    }

  } catch (error) {
    console.error('Setup Twitter credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup Twitter credentials',
      error: error.message
    });
  }
};

/**
 * Get current Twitter connection status
 * @route GET /api/twitter/connection-status
 * @access Private
 */
const getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Simply check if user has ANY Twitter connection
    const twitterConnection = await UserTwitterConnection.findOne({ 
      userId: userId
    });

    if (!twitterConnection) {
      return res.json({
        success: true,
        connected: false,
        message: 'No Twitter account connected'
      });
    }

    console.log('Connection status check - connection found:', {
      userId: userId,
      connectionId: twitterConnection._id,
      hasAccessToken: !!twitterConnection.accessToken,
      verified: twitterConnection.verified
    });

    res.json({
      success: true,
      connected: true,
      twitterUser: {
        id: twitterConnection.twitterId,
        username: twitterConnection.screenName
      },
      verifiedAt: twitterConnection.verifiedAt || new Date(),
      hasApiCredentials: !!(twitterConnection.apiKey && twitterConnection.apiSecret)
    });

  } catch (error) {
    console.error('Get connection status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get connection status'
    });
  }
};

/**
 * Remove Twitter connection
 * @route DELETE /api/twitter/disconnect
 * @access Private
 */
const disconnectTwitter = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Remove Twitter connection
    await UserTwitterConnection.deleteMany({ userId: userId });
    
    // Remove Twitter info from user
    const user = await User.findById(userId);
    user.twitterId = undefined;
    user.twitterUsername = undefined;
    await user.save();

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
  setupTwitterCredentials,
  getConnectionStatus,
  disconnectTwitter
};