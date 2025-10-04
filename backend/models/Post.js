const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // faster lookups
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
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
    platform: {
      type: String,
      enum: ['X', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'Other'],
      default: 'X',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'posted', 'failed'],
      default: 'draft',
    },
    hasMedia: {
      type: Boolean,
      default: false,
    },
    mediaCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 4, // Twitter's limit
    },
    mediaTypes: [{
      type: String,
      enum: ['image', 'video', 'gif'],
    }],
    externalId: {
      type: String, // Twitter tweet ID, Instagram post ID, etc.
      sparse: true, // allows null values but unique when present
    },
    mediaIds: {
      type: [String],
      default: []
    },
    scheduledFor: {
      type: Date, // when post is planned
    },
    postedAt: {
      type: Date, // when post was actually published
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Indexes for better performance
postSchema.index({ status: 1, scheduledFor: 1 }); // useful for cron jobs
postSchema.index({ platform: 1 });

module.exports = mongoose.model('Post', postSchema);
