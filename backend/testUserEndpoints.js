const express = require('express');
const { protect } = require('./middleware/auth');

// Mock protect middleware for testing
const mockProtect = (req, res, next) => {
  // For testing purposes, we'll mock a user
  req.user = { id: 'test-user-id' };
  next();
};

const {
  getUserStats,
  getUserTweets
} = require('./controllers/userController');

const router = express.Router();

// Test routes without authentication for development
router.get('/test/stats', mockProtect, getUserStats);
router.get('/test/tweets', mockProtect, getUserTweets);

module.exports = router;