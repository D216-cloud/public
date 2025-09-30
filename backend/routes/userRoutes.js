const express = require('express');
const { protect } = require('../middleware/auth');

const {
  getUserStats,
  getUserTweets
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, getUserStats);

// @route   GET /api/user/tweets
// @desc    Get user tweets
// @access  Private
router.get('/tweets', protect, getUserTweets);

module.exports = router;