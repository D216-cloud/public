const express = require('express');
const { protect } = require('../middleware/auth');
const { postToX, getPostedContent, generateContent, getGeneratedContentHistory } = require('../controllers/postController');

const router = express.Router();

// All routes protected by authentication
router.use(protect);

// Post content to X (Twitter)
router.post('/post-to-x', postToX);

// Get user's posted content
router.get('/posted-content', getPostedContent);

// Generate content using Google AI
router.post('/generate-content', generateContent);

// Get user's generated content history
router.get('/generated-content-history', getGeneratedContentHistory);

module.exports = router;