const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: {
    type: String,
  },
  profileImage: {
    type: String,
    default: null,
  },
  // Twitter connection fields
  twitterId: {
    type: String,
    sparse: true,
  },
  twitterUsername: {
    type: String,
    sparse: true,
  },
  twitterAccessToken: {
    type: String,
    sparse: true,
  },
  twitterRefreshToken: {
    type: String,
    sparse: true,
  },
  twitterConnected: {
    type: Boolean,
    default: false,
  },
  // Temporary fields for verification process
  tempTwitterUsername: {
    type: String,
    sparse: true,
  },
  tempTwitterId: {
    type: String,
    sparse: true,
  },
  twitterVerificationCode: {
    type: String,
    sparse: true,
  },
  verificationCodeExpiry: {
    type: Date,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
