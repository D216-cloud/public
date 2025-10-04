const Post = require('../models/Post');
const GeneratedContent = require('../models/GeneratedContent');

/**
 * Get analytics data for a user
 */
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query; // Default to 30 days

    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get total posts count
    const totalPosts = await Post.countDocuments({ userId });
    
    // Get posts in period
    const postsInPeriod = await Post.countDocuments({
      userId,
      createdAt: { $gte: startDate }
    });

    // Get total generated content count
    const totalGenerated = await GeneratedContent.countDocuments({ userId });
    
    // Get generated content in period
    const generatedInPeriod = await GeneratedContent.countDocuments({
      userId,
      createdAt: { $gte: startDate }
    });

    // Get posts by platform
    const postsByPlatform = await Post.aggregate([
      { $match: { userId } },
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    // Get posts by status
    const postsByStatus = await Post.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get daily post counts for the period
    const dailyPosts = await Post.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          posts: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get daily generated content counts for the period
    const dailyGenerated = await GeneratedContent.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          generated: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get recent posts with details
    const recentPosts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('content platform status createdAt postedAt externalId');

    // Get recent generated content
    const recentGenerated = await GeneratedContent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('prompt generatedText createdAt wordCount engagementScore');

    res.json({
      success: true,
      analytics: {
        summary: {
          totalPosts,
          postsInPeriod,
          totalGenerated,
          generatedInPeriod,
          period: daysAgo
        },
        breakdown: {
          byPlatform: postsByPlatform,
          byStatus: postsByStatus
        },
        timeline: {
          dailyPosts,
          dailyGenerated
        },
        recent: {
          posts: recentPosts,
          generated: recentGenerated
        }
      }
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
      error: error.message
    });
  }
};

/**
 * Get calendar data showing posts and generated content by date
 */
const getCalendarData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    
    // Default to current month if not specified
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth(); // Month is 0-indexed
    
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0); // Last day of month
    
    // Get posts for the month
    const posts = await Post.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('content platform status createdAt postedAt externalId');

    // Get generated content for the month
    const generated = await GeneratedContent.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('prompt generatedText createdAt wordCount');

    // Group by date
    const calendarData = {};
    
    // Process posts
    posts.forEach(post => {
      const dateKey = post.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!calendarData[dateKey]) {
        calendarData[dateKey] = { posts: [], generated: [] };
      }
      calendarData[dateKey].posts.push({
        id: post._id,
        content: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
        platform: post.platform,
        status: post.status,
        time: post.createdAt.toTimeString().split(' ')[0], // HH:MM:SS
        externalId: post.externalId
      });
    });

    // Process generated content
    generated.forEach(gen => {
      const dateKey = gen.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!calendarData[dateKey]) {
        calendarData[dateKey] = { posts: [], generated: [] };
      }
      calendarData[dateKey].generated.push({
        id: gen._id,
        prompt: gen.prompt?.substring(0, 30) + (gen.prompt?.length > 30 ? '...' : '') || 'Generated content',
        content: gen.generatedText.substring(0, 50) + (gen.generatedText.length > 50 ? '...' : ''),
        time: gen.createdAt.toTimeString().split(' ')[0], // HH:MM:SS
        wordCount: gen.wordCount
      });
    });

    res.json({
      success: true,
      calendar: {
        year: targetYear,
        month: targetMonth + 1, // Convert back to 1-indexed
        monthName: new Date(targetYear, targetMonth).toLocaleString('default', { month: 'long' }),
        data: calendarData,
        summary: {
          totalPosts: posts.length,
          totalGenerated: generated.length,
          activeDays: Object.keys(calendarData).length
        }
      }
    });

  } catch (error) {
    console.error('Error getting calendar data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar data',
      error: error.message
    });
  }
};

module.exports = {
  getAnalytics,
  getCalendarData
};