const mongoose = require('mongoose');

/**
 * UserTwitterConnections Schema
 * 
 * This model stores the connection between a user and their Twitter account
 * with all necessary verification and security information
 */
const userTwitterConnectionSchema = new mongoose.Schema({
  // Reference to the user in our system (Google authenticated user)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Twitter user information
  twitterId: {
    type: String,
    required: true,
    index: true
  },
  screenName: {
    type: String,
    required: true
  },
  
  // OAuth tokens for Twitter API access
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    default: null
  },
  
  // Connection metadata
  connectedAt: {
    type: Date,
    default: Date.now
  },
  
  // Verification status and method
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  verifiedBy: {
    type: String,
    enum: ['email', 'tweet', null],
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  
  // Email verification (if used)
  verificationEmail: {
    type: String,
    default: null
  },
  
  // Tweet verification code (if used)
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpiry: {
    type: Date,
    default: null
  },
  
  // OTP for email verification
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  
  // Auto-posting settings
  autoPostEnabled: {
    type: Boolean,
    default: false
  },
  autoPostSettings: {
    type: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily'
      },
      timesPerDay: {
        type: Number,
        default: 3
      },
      preferredHours: [Number]
    },
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
userTwitterConnectionSchema.index({ userId: 1, twitterId: 1 }, { unique: true });
userTwitterConnectionSchema.index({ screenName: 1 });
userTwitterConnectionSchema.index({ verified: 1, autoPostEnabled: 1 });

module.exports = mongoose.model('UserTwitterConnection', userTwitterConnectionSchema);