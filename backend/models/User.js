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
  // Twitter connection fields (deprecated - kept for backward compatibility)
  twitterId: {
    type: String,
    sparse: true,
  },
  twitterUsername: {
    type: String,
    sparse: true,
  },
  twitterProfileImageUrl: {
    type: String,
    sparse: true,
  },
  twitterLocation: {
    type: String,
    sparse: true,
  },
  twitterBio: {
    type: String,
    sparse: true,
  },
  twitterAccountCreatedAt: {
    type: Date,
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
  // Temporary fields for OAuth flow
  tempTwitterData: {
    type: {
      accessToken: String,
      refreshToken: String,
      expiresIn: Number,
      userInfo: {
        id: String,
        username: String,
        name: String
      },
      codeVerifier: String,
      createdAt: Date
    },
    default: null
  },
  tempAuthState: {
    type: String,
    default: null
  },
  tempCodeVerifier: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);