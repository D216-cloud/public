const mongoose = require('mongoose');

const generatedContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // faster queries by user
    },
    content: {
      type: String,
      required: [true, 'Content text is required'],
      trim: true,
    },
    template: {
      type: String,
      default: null,
      trim: true,
    },
    tone: {
      type: String,
      default: null,
      trim: true,
    },
    length: {
      type: String,
      default: null,
    },
    audience: {
      type: String,
      default: null,
      trim: true,
    },
    style: {
      type: String,
      default: null,
      trim: true,
    },
    topic: {
      type: String,
      default: null,
      trim: true,
    },
    prompt: {
      type: String,
      default: null,
      trim: true,
    },
    platform: {
      type: String,
      enum: ['X', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'Other'],
      default: 'X',
    },
    characterCount: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    mentions: [
      {
        type: String,
        trim: true,
      },
    ],
    engagementScore: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// Index for searching by hashtags quickly
generatedContentSchema.index({ hashtags: 1 });

module.exports = mongoose.model('GeneratedContent', generatedContentSchema);
