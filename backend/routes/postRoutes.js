const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { postToX, getPostedContent, generateContent, getGeneratedContentHistory, postToTwitterWithMedia, generatePostByKeyword } = require('../controllers/postController');

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

// Get user's generated content history
router.get('/generated-content-history', getGeneratedContentHistory);

module.exports = router;