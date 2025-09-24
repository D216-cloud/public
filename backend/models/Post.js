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
