const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  setupTwitterCredentials, 
  getConnectionStatus, 
  disconnectTwitter 
} = require('../controllers/twitterSetupController');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/twitter-setup/credentials
// @desc    Setup Twitter API credentials
// @access  Private
router.post('/credentials', setupTwitterCredentials);

// @route   GET /api/twitter-setup/status
// @desc    Get Twitter connection status
// @access  Private
router.get('/status', getConnectionStatus);

// @route   DELETE /api/twitter-setup/disconnect
// @desc    Disconnect Twitter account
// @access  Private
router.delete('/disconnect', disconnectTwitter);

module.exports = router;