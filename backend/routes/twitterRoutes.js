const express = require('express');
const { protect } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const {
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
  verifyTwitterUsername,  // Add this new function
  connectTwitterDirect,    // Add this new function
  requestTwitterVerification, // Add this new function
  verifyTwitterAccount,       // Add this new function
  postTweet,        // Add this new function
  scheduleTweet,    // Add this new function
  getRecentTweets   // Add this new function
} = require('../controllers/twitterController');

const router = express.Router();

// @route   GET /api/twitter/auth
// @desc    Begin Twitter OAuth flow
// @access  Private
router.get('/auth', protect, beginTwitterAuth);

// @route   GET /api/twitter/auth/public
// @desc    Begin Twitter OAuth flow for non-authenticated users
// @access  Public
router.get('/auth/public', beginTwitterAuthPublic);

// @route   GET /api/twitter/callback
// @desc    Handle Twitter OAuth callback
// @access  Public
router.get('/callback', handleTwitterCallback);

// @route   POST /api/twitter/verify-username
// @desc    Verify Twitter username exists
// @access  Private
router.post('/verify-username', protect, verifyTwitterUsername);

// @route   POST /api/twitter/connect-direct
// @desc    Connect Twitter account directly (without OAuth)
// @access  Private
router.post('/connect-direct', protect, connectTwitterDirect);

// @route   POST /api/twitter/request-verification
// @desc    Request verification code for Twitter account
// @access  Private
router.post('/request-verification', protect, requestTwitterVerification);

// @route   POST /api/twitter/verify-account
// @desc    Verify Twitter account with code
// @access  Private
router.post('/verify-account', protect, verifyTwitterAccount);

// @route   POST /api/twitter/send-otp
// @desc    Send OTP to email for verification
// @access  Private
router.post('/send-otp', protect, sendOTP);

// @route   POST /api/twitter/verify-otp
// @desc    Verify OTP
// @access  Private
router.post('/verify-otp', protect, verifyOTP);

// @route   POST /api/twitter/generate-verify-code
// @desc    Generate verification code for tweet verification
// @access  Private
router.post('/generate-verify-code', protect, generateVerifyCode);

// @route   POST /api/twitter/check-verify-code
// @desc    Check for verification tweet
// @access  Private
router.post('/check-verify-code', protect, checkVerifyCode);

// @route   POST /api/twitter/toggle-auto-post
// @desc    Toggle auto-posting
// @access  Private
router.post('/toggle-auto-post', protect, toggleAutoPost);

// @route   GET /api/twitter/status
// @desc    Get Twitter connection status
// @access  Private
router.get('/status', protect, getTwitterStatus);

// @route   POST /api/twitter/confirm
// @desc    Confirm Twitter connection
// @access  Private
router.post('/confirm', protect, confirmTwitterConnection);

// @route   POST /api/twitter/disconnect
// @desc    Disconnect Twitter account
// @access  Private
router.post('/disconnect', protect, disconnectTwitter);

// @route   POST /api/twitter/post
// @desc    Post a tweet
// @access  Private
router.post('/post', protect, upload.single('image'), postTweet);

// @route   POST /api/twitter/schedule
// @desc    Schedule a tweet
// @access  Private
router.post('/schedule', protect, upload.single('image'), scheduleTweet);

// @route   GET /api/twitter/recent
// @desc    Get recent tweets
// @access  Private
router.get('/recent', protect, getRecentTweets);

module.exports = router;