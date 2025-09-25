const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyGoogleToken } = require('../config/googleAuth');
const { cloudinary } = require('../config/cloudinary');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    // Verify Google token
    const googleUser = await verifyGoogleToken(tokenId);
    
    if (!googleUser.email_verified) {
      return res.status(400).json({ message: 'Google account not verified' });
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    // If user doesn't exist, create new user
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub,
        profilePicture: googleUser.picture,
      });
    } else if (!user.googleId) {
      // If user exists but doesn't have googleId, update it
      user.googleId = googleUser.sub;
      user.profilePicture = googleUser.picture;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    // Return a more user-friendly error message
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return res.status(503).json({ message: 'Authentication service temporarily unavailable. Please try again later.' });
    }
    return res.status(401).json({ message: 'Authentication failed. Please try again.' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        profileImage: user.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile image
const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete previous image from cloudinary if exists
    if (user.profileImage) {
      try {
        const publicId = user.profileImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
      } catch (error) {
        console.log('Error deleting previous image:', error);
      }
    }

    // Update user with new image URL
    user.profileImage = req.file.path;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  googleLogin,
  getUserProfile,
  updateProfileImage,
  updateProfile,
};