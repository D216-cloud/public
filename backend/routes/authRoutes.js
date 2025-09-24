const express = require('express');
const { googleLogin, getUserProfile, updateProfileImage, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { parser } = require('../config/cloudinary');

const router = express.Router();

router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-image', protect, parser.single('image'), updateProfileImage);

module.exports = router;