const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { 
  postToX, 
  postToTwitterWithMedia, 
  autoPostGeneratedContent, 
  getPostedContent, 
  generateContent, 
  generatePostByKeyword, 
  getGeneratedContentHistory, 
  schedulePost, 
  getScheduledPosts,
  testTwitterConnection,
  debugTwitterConnection,
  repairTwitterConnection,
  testPost
} = require('../controllers/postController');

// Configure multer for image and video uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 512 * 1024 * 1024, // 512MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept image and video files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Multer configuration for multiple files
const uploadMultiple = multer({ 
  storage: storage,
  limits: {
    fileSize: 512 * 1024 * 1024, // 512MB limit
    files: 10 // Maximum 10 files (Twitter limit is 4 images or 1 video)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

const router = express.Router();

// All routes protected by authentication
router.use(protect);

// Post content to X (Twitter)
router.post('/post-to-x', postToX);

// Debug: inspect twitter posting prerequisites
router.get('/debug/posting-status', async (req, res) => {
  try {
    const user = req.user;
    const connections = await require('../models/UserTwitterConnections').find({ userId: user._id });
    res.json({
      userId: user._id,
      userTwitterId: user.twitterId || null,
      connectionCount: connections.length,
      connections: connections.map(c => ({ id: c._id, twitterId: c.twitterId, hasAccessToken: !!c.accessToken, connectedAt: c.connectedAt }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Post content to Twitter with optional media (single or multiple)
router.post('/post-to-twitter', uploadMultiple.array('media', 4), postToTwitterWithMedia);

// Post content to Twitter with multiple media files (images/videos)
router.post('/post-to-twitter-media', uploadMultiple.array('media', 4), postToTwitterWithMedia);

// Post content with media files (up to 4 images or 1 video)
router.post('/post-with-media', uploadMultiple.array('media', 4), postToTwitterWithMedia);

// Get user's posted content
router.get('/posted-content', getPostedContent);

// Generate content using Google AI
router.post('/generate-content', generateContent);

// Generate content by keyword with options
router.post('/generate-by-keyword', generatePostByKeyword);

// Auto-post generated content immediately
router.post('/auto-post-generated', autoPostGeneratedContent);

// Schedule a post
router.post('/schedule', schedulePost);

// Get scheduled posts
router.get('/scheduled', getScheduledPosts);

// Get user's generated content history
router.get('/generated-content-history', getGeneratedContentHistory);

// Test Twitter connection
router.get('/test-twitter-connection', testTwitterConnection);

// Debug Twitter connection
router.get('/debug-twitter-connection', debugTwitterConnection);

// Repair Twitter connection using environment credentials
router.post('/repair-twitter-connection', repairTwitterConnection);

// Simple test post endpoint
router.post('/test-post', testPost);

module.exports = router;