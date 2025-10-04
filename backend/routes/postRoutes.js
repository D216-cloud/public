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
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
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

const router = express.Router();

// All routes protected by authentication
router.use(protect);

// Post content to X (Twitter)
router.post('/post-to-x', postToX);

// Post content to Twitter with optional image
router.post('/post-to-twitter', upload.single('image'), postToTwitterWithMedia);

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