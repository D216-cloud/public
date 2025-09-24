const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  goals: [{
    type: String,
    enum: ['followers', 'engagement', 'brand', 'leads', 'thought-leadership', 'community'],
  }],
  audience: {
    type: String,
    maxlength: 1000,
  },
  niche: {
    type: String,
    enum: ['tech', 'business', 'design', 'marketing', 'lifestyle', 'travel', 'food', 'fitness', 'photography', 'gaming', 'music', 'other'],
  },
  contentTypes: [{
    type: String,
    enum: ['tips', 'personal', 'industry', 'behind-scenes', 'educational', 'motivational', 'humor', 'product'],
  }],
  competitors: {
    type: String,
    maxlength: 1000,
  },
  postingFrequency: {
    type: String,
    enum: ['daily', 'frequent', 'moderate', 'light'],
  },
  tone: {
    type: String,
    enum: ['professional', 'casual', 'humorous', 'inspirational'],
  },
  autoPosting: {
    type: Boolean,
    default: false,
  },
  twitterConnected: {
    type: Boolean,
    default: false,
  },
  twitterHandle: {
    type: String,
    default: null,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
onboardingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Onboarding', onboardingSchema);