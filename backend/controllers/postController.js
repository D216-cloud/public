const Post = require('../models/Post');
const User = require('../models/User');
const GeneratedContent = require('../models/GeneratedContent');
const googleAIService = require('../services/googleAIService');
const { TwitterApi } = require('twitter-api-v2');
const UserTwitterConnection = require('../models/UserTwitterConnections');
const { sendPostSuccessEmail } = require('../utils/sendMail');

// In-memory cache to avoid re-validating Twitter credentials on every post
// Map key: userId string, value: { validatedAt: Date }
const twitterValidationCache = new Map();

function isValidationFresh(userId, maxAgeMs = 15 * 60 * 1000) { // 15 minutes
  const entry = twitterValidationCache.get(String(userId));
  if (!entry) return false;
  return Date.now() - entry.validatedAt.getTime() < maxAgeMs;
}

// Helper function to post to Twitter
const postToTwitter = async (content, userId, imageBuffer = null) => {
  try {
    // Use environment credentials directly (they work as proven by test)
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    
    console.log('Using Twitter credentials:', {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasAccessToken: !!accessToken,
      hasAccessTokenSecret: !!accessTokenSecret,
      source: 'environment'
    });

    // Validate we have all required credentials
    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      throw new Error('Missing Twitter API credentials in environment variables.');
    }

    // OAuth 1.0a authentication (working configuration)
    console.log('Using OAuth 1.0a authentication with environment credentials');
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    // Skip validation cache - just post directly since we know it works
    console.log('Posting directly with verified working credentials');

    let mediaId = null;
    if (imageBuffer) {
      mediaId = await client.v1.uploadMedia(imageBuffer, { type: 'png' });
    }

    const tweetParams = { text: content };
    if (mediaId) {
      tweetParams.media = { media_ids: [mediaId] };
    }

    let tweet;
    try {
      tweet = await client.v2.tweet(tweetParams);
    } catch (tweetErr) {
      const diag = {
        code: tweetErr.code,
        title: tweetErr.data?.title,
        detail: tweetErr.data?.detail,
        status: tweetErr.data?.status
      };
      console.error('Tweet post failed diagnostics:', diag);
      if (diag.status === 403) {
        throw new Error('Tweet rejected (403). Your app or tokens may lack write permissions. Ensure Elevated access and Read/Write tokens.');
      }
      if (diag.status === 401) {
        throw new Error('Unauthorized (401). Access tokens expired or revoked. Regenerate Access Token & Secret.');
      }
      throw tweetErr;
    }
    console.log('Posted to Twitter:', content);
    return { id: tweet.data.id, text: content };
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    throw error;
  }
};

// Post content to X/Twitter
const postToX = async (req, res) => {
  try {
    const { content, template, tone, length, audience, style, topic, language = 'en' } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if (content.length > 270) {
      return res.status(400).json({ 
        message: 'Content is too long. Please keep it under 270 characters for Twitter.',
        currentLength: content.length,
        maxLength: 270
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`🐦 Posting to Twitter: "${content}"`);
    const twitterResponse = await postToTwitter(content, userId);

    const post = new Post({
      userId: user._id,
      content: content,
      template: template,
      tone: tone,
      length: length,
      audience: audience,
      style: style,
      topic: topic,
      language: language,
      platform: 'X',
      status: 'posted',
      postedAt: new Date(),
      externalId: twitterResponse.id
    });

    await post.save();

    try {
      if (user.email && user.name) {
        await sendPostSuccessEmail(user.email, user.name, content, 'X (Twitter)');
        console.log('Post success email sent to:', user.email);
      }
    } catch (emailError) {
      console.error('Error sending post success email:', emailError);
    }

    res.status(200).json({
      message: 'Successfully posted to X',
      post: post,
      tweetId: twitterResponse.id,
      characterCount: content.length
    });
  } catch (error) {
    console.error('Error posting to X:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Auto-post generated content immediately
const autoPostGeneratedContent = async (req, res) => {
  try {
    const { content, template, tone, length, audience, style, topic, language = 'en', autoPost = false } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if (content.length > 270) {
      return res.status(400).json({ 
        message: 'Content is too long. Please keep it under 270 characters for Twitter.',
        currentLength: content.length,
        maxLength: 270
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (autoPost) {
      // Check for Twitter connection (more flexible approach)
      const twitterConnection = await UserTwitterConnection.findOne({ 
        userId: userId
      });
      
      if (!twitterConnection || !twitterConnection.accessToken) {
        return res.status(200).json({
          message: 'Content generated successfully, but auto-posting failed: Twitter account not connected',
          content: content,
          autoPosted: false,
          error: 'Twitter account not connected. Please connect your Twitter account to enable auto-posting.',
          requiresTwitterConnection: true,
          characterCount: content.length
        });
      }

      try {
        const twitterResponse = await postToTwitter(content, userId);

        const post = new Post({
          userId: user._id,
          content: content,
          template: template,
          tone: tone,
          length: length,
          audience: audience,
          style: style,
          topic: topic,
          language: language,
          platform: 'X',
          status: 'posted',
          postedAt: new Date(),
          externalId: twitterResponse.id
        });

        await post.save();

        try {
          if (user.email && user.name) {
            await sendPostSuccessEmail(user.email, user.name, content, 'X (Twitter)');
            console.log('Auto-post success email sent to:', user.email);
          }
        } catch (emailError) {
          console.error('Error sending auto-post success email:', emailError);
        }

        res.status(200).json({
          message: 'Content generated and auto-posted to X successfully',
          content: content,
          post: post,
          tweetId: twitterResponse.id,
          autoPosted: true,
          characterCount: content.length
        });
      } catch (postError) {
        console.error('Error auto-posting generated content:', postError);
        res.status(200).json({
          message: 'Content generated successfully, but auto-posting failed',
          content: content,
          autoPosted: false,
          error: postError.message,
          characterCount: content.length
        });
      }
    } else {
      res.status(200).json({
        message: 'Content generated successfully',
        content: content,
        autoPosted: false,
        characterCount: content.length
      });
    }
  } catch (error) {
    console.error('Error in auto-post generation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate content using Google AI API
const generateContent = async (req, res) => {
  try {
    console.log('generateContent API called');
    const { topic, template, tone, length, audience, style, language = 'en' } = req.body;
    const userId = req.user._id;
    
    let prompt = 'Generate an engaging Twitter post';
    
    if (topic) {
      prompt += ' about "' + topic + '"';
    }
    
    prompt += '. CRITICAL: Make it under 270 characters for Twitter. Use 2-3 lines maximum. Be extremely concise and punchy. Include 2-3 emojis and 1-2 hashtags only.';
    
    let generatedContent = await googleAIService.generateContent(prompt, language, 1024, false);
    console.log('Successfully generated content with Gemini API, length:', generatedContent.length);
    
    const generatedContentRecord = new GeneratedContent({
      userId: userId,
      content: generatedContent,
      template: template,
      tone: tone,
      length: length,
      audience: audience,
      style: style,
      topic: topic,
      language: language,
      prompt: prompt,
      platform: 'X',
      characterCount: generatedContent.length,
      wordCount: generatedContent.trim().split(/\s+/).length,
      engagementScore: Math.floor(Math.random() * 40) + 60
    });
    
    await generatedContentRecord.save();
    
    res.status(200).json({
      content: generatedContent,
      id: generatedContentRecord._id
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Debug function to check what's in the database
const debugTwitterConnection = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('=== TWITTER CONNECTION DEBUG ===');
    console.log('User ID:', userId);
    
    // Check user
    const user = await User.findById(userId);
    console.log('User found:', !!user);
    console.log('User twitterId:', user?.twitterId);
    console.log('User twitterUsername:', user?.twitterUsername);
    
    // Check all Twitter connections for this user
    const connections = await UserTwitterConnection.find({ userId: userId });
    console.log('Total connections found:', connections.length);
    
    connections.forEach((conn, index) => {
      console.log(`Connection ${index + 1}:`, {
        _id: conn._id,
        twitterId: conn.twitterId,
        screenName: conn.screenName,
        hasAccessToken: !!conn.accessToken,
        hasAccessTokenSecret: !!conn.accessTokenSecret,
        hasApiKey: !!conn.apiKey,
        hasApiSecret: !!conn.apiSecret,
        verified: conn.verified,
        verifiedBy: conn.verifiedBy,
        connectedAt: conn.connectedAt
      });
    });
    
    res.json({
      success: true,
      debug: {
        userId: userId,
        userHasTwitterId: !!user?.twitterId,
        totalConnections: connections.length,
        connections: connections.map(conn => ({
          id: conn._id,
          twitterId: conn.twitterId,
          screenName: conn.screenName,
          hasCredentials: {
            accessToken: !!conn.accessToken,
            accessTokenSecret: !!conn.accessTokenSecret,
            apiKey: !!conn.apiKey,
            apiSecret: !!conn.apiSecret
          },
          verified: conn.verified,
          verifiedBy: conn.verifiedBy
        }))
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Test Twitter connection and posting capability
const testTwitterConnection = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user info
    const user = await User.findById(userId);
    console.log('User check:', {
      hasUser: !!user,
      userId: userId,
      twitterId: user?.twitterId
    });
    
    // Get Twitter connection
    const twitterConnection = await UserTwitterConnection.findOne({ 
      userId: userId
    });
    
    console.log('Twitter connection check:', {
      hasConnection: !!twitterConnection,
      hasAccessToken: !!twitterConnection?.accessToken,
      hasApiKey: !!twitterConnection?.apiKey,
      hasApiSecret: !!twitterConnection?.apiSecret,
      hasAccessTokenSecret: !!twitterConnection?.accessTokenSecret,
      verified: twitterConnection?.verified
    });
    
    if (!twitterConnection || !twitterConnection.accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No Twitter connection found',
        details: {
          hasConnection: !!twitterConnection,
          hasAccessToken: !!twitterConnection?.accessToken
        }
      });
    }
    
    // Try to create Twitter client and test
    try {
      let client;
      if (twitterConnection.apiKey && twitterConnection.apiSecret && twitterConnection.accessToken && twitterConnection.accessTokenSecret) {
        client = new TwitterApi({
          appKey: twitterConnection.apiKey,
          appSecret: twitterConnection.apiSecret,
          accessToken: twitterConnection.accessToken,
          accessSecret: twitterConnection.accessTokenSecret,
        });
      } else if (twitterConnection.accessToken) {
        client = new TwitterApi(twitterConnection.accessToken);
      } else {
        throw new Error('No valid Twitter credentials found');
      }
      
      // Test with a simple API call
      const me = await client.v2.me();
      
      res.json({
        success: true,
        message: 'Twitter connection is working!',
        twitterUser: me.data,
        connectionDetails: {
          hasApiKey: !!twitterConnection.apiKey,
          hasApiSecret: !!twitterConnection.apiSecret,
          hasAccessToken: !!twitterConnection.accessToken,
          hasAccessTokenSecret: !!twitterConnection.accessTokenSecret,
          authMethod: (twitterConnection.apiKey && twitterConnection.apiSecret) ? 'OAuth 1.0a' : 'OAuth 2.0'
        }
      });
      
    } catch (apiError) {
      console.error('Twitter API test failed:', apiError);
      res.status(400).json({
        success: false,
        message: 'Twitter API test failed',
        error: apiError.message,
        connectionDetails: {
          hasApiKey: !!twitterConnection.apiKey,
          hasApiSecret: !!twitterConnection.apiSecret,
          hasAccessToken: !!twitterConnection.accessToken,
          hasAccessTokenSecret: !!twitterConnection.accessTokenSecret
        }
      });
    }
    
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Repair Twitter connection by updating with environment credentials
const repairTwitterConnection = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find existing connection
    const twitterConnection = await UserTwitterConnection.findOne({ userId: userId });
    
    if (!twitterConnection) {
      return res.status(404).json({
        success: false,
        message: 'No Twitter connection found to repair'
      });
    }
    
    // Check if environment variables are available
    const envCredentials = {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_CLIENT_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    };
    
    if (!envCredentials.apiKey || !envCredentials.apiSecret || !envCredentials.accessToken || !envCredentials.accessTokenSecret) {
      return res.status(400).json({
        success: false,
        message: 'Environment credentials not available for repair'
      });
    }
    
    // Test the environment credentials
    try {
      const testClient = new TwitterApi({
        appKey: envCredentials.apiKey,
        appSecret: envCredentials.apiSecret,
        accessToken: envCredentials.accessToken,
        accessSecret: envCredentials.accessTokenSecret,
      });
      
      const userInfo = await testClient.v2.me();
      
      // Update the connection with working credentials
      twitterConnection.apiKey = envCredentials.apiKey;
      twitterConnection.apiSecret = envCredentials.apiSecret;
      twitterConnection.accessToken = envCredentials.accessToken;
      twitterConnection.accessTokenSecret = envCredentials.accessTokenSecret;
      twitterConnection.verified = true;
      twitterConnection.verifiedAt = new Date();
      twitterConnection.twitterId = userInfo.data.id;
      twitterConnection.screenName = userInfo.data.username;
      
      await twitterConnection.save();
      
      res.json({
        success: true,
        message: 'Twitter connection repaired successfully!',
        twitterUser: {
          id: userInfo.data.id,
          username: userInfo.data.username,
          name: userInfo.data.name
        }
      });
      
    } catch (testError) {
      console.error('Environment credentials test failed:', testError);
      return res.status(400).json({
        success: false,
        message: 'Environment credentials are invalid',
        error: testError.message
      });
    }
    
  } catch (error) {
    console.error('Repair Twitter connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to repair Twitter connection',
      error: error.message
    });
  }
};

// Simple direct post endpoint for testing
const testPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Content is required for posting' 
      });
    }

    if (content.length > 280) {
      return res.status(400).json({ 
        success: false,
        message: `Content too long: ${content.length}/280 characters`,
        currentLength: content.length,
        maxLength: 280
      });
    }

    console.log(`🐦 Attempting to post: "${content}"`);
    
    // Post directly using environment credentials (most reliable)
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const tweet = await client.v2.tweet(content);
    
    console.log('✅ Tweet posted successfully:', tweet.data.id);

    // Save to database
    const user = await User.findById(userId);
    const post = new Post({
      userId: user._id,
      content: content,
      platform: 'X',
      status: 'posted',
      postedAt: new Date(),
      externalId: tweet.data.id
    });
    await post.save();

    res.json({
      success: true,
      message: 'Tweet posted successfully!',
      tweetId: tweet.data.id,
      content: content,
      characterCount: content.length,
      url: `https://twitter.com/i/web/status/${tweet.data.id}`
    });

  } catch (error) {
    console.error('❌ Post failed:', error);
    
    let errorMessage = 'Failed to post tweet';
    let statusCode = 500;
    
    if (error.data?.status === 403) {
      errorMessage = 'Twitter app lacks write permissions. Check developer portal settings.';
      statusCode = 403;
    } else if (error.data?.status === 401) {
      errorMessage = 'Twitter credentials invalid or expired. Regenerate tokens.';
      statusCode = 401;
    } else if (error.data?.detail) {
      errorMessage = error.data.detail;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      details: error.data
    });
  }
};

module.exports = {
  postToTwitter,
  postToX,
  autoPostGeneratedContent,
  generateContent,
  postToTwitterWithMedia: async (req, res) => {
    try {
      const { content, language = 'en', template, tone, length, audience, style, topic } = req.body;
      const userId = req.user._id;
      const file = req.file;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: 'Content is required' });
      }

      if (content.length > 270) {
        return res.status(400).json({ 
          message: 'Content is too long. Please keep it under 270 characters for Twitter.',
          currentLength: content.length,
          maxLength: 270
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.twitterId) {
        return res.status(400).json({ 
          message: 'Twitter account not connected. Please connect your Twitter account first.',
          requiresTwitterConnection: true
        });
      }

      const twitterConnection = await UserTwitterConnection.findOne({ 
        userId: userId, 
        twitterId: user.twitterId 
      });
      
      if (!twitterConnection || !twitterConnection.accessToken) {
        return res.status(400).json({ 
          message: 'Twitter account not properly connected. Please reconnect your Twitter account.',
          requiresTwitterConnection: true
        });
      }

      let fileBuffer = null;
      if (file) {
        fileBuffer = file.buffer;
      }

      const twitterResponse = await postToTwitter(content, userId, fileBuffer);

      const post = new Post({
        userId: user._id,
        content: content,
        template: template,
        tone: tone,
        length: length,
        audience: audience,
        style: style,
        topic: topic,
        language: language,
        platform: 'X',
        status: 'posted',
        hasMedia: !!fileBuffer,
        postedAt: new Date(),
        externalId: twitterResponse.id
      });

      await post.save();

      try {
        if (user.email && user.name) {
          await sendPostSuccessEmail(user.email, user.name, content, 'X (Twitter)');
        }
      } catch (emailError) {
        console.error('Error sending post success email:', emailError);
      }

      res.status(200).json({
        message: 'Successfully posted to Twitter',
        post: post,
        tweetId: twitterResponse.id,
        characterCount: content.length,
        hasMedia: !!fileBuffer
      });
    } catch (error) {
      console.error('Error posting to Twitter:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getPostedContent: async (req, res) => {
    try {
      const userId = req.user._id;
      const posts = await Post.find({ userId: userId }).sort({ createdAt: -1 });
      
      res.status(200).json({
        posts
      });
    } catch (error) {
      console.error('Error fetching posted content:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  generatePostByKeyword: async (req, res) => {
    try {
      const { keyword, language = 'en', tone, template, length, audience, style } = req.body;
      const userId = req.user._id;
      
      if (!keyword || keyword.trim().length === 0) {
        return res.status(400).json({ message: 'Keyword is required' });
      }
      
      let prompt = 'Generate a Twitter post about "' + keyword + '". Keep it under 270 characters for Twitter.';
      
      let generatedContent = await googleAIService.generateContent(prompt, language);
      
      const generatedContentRecord = new GeneratedContent({
        userId: userId,
        content: generatedContent,
        template: template,
        tone: tone,
        length: length,
        audience: audience,
        style: style,
        topic: keyword,
        language: language,
        prompt: prompt,
        platform: 'X',
        characterCount: generatedContent.length,
        wordCount: generatedContent.trim().split(/\s+/).length,
        engagementScore: Math.floor(Math.random() * 40) + 60
      });
      
      await generatedContentRecord.save();
      
      res.status(200).json({
        content: generatedContent,
        id: generatedContentRecord._id
      });
    } catch (error) {
      console.error('Error generating content by keyword:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getGeneratedContentHistory: async (req, res) => {
    try {
      const userId = req.user._id;
      
      const generatedContent = await GeneratedContent.find({ userId: userId })
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.status(200).json({
        generatedContent
      });
    } catch (error) {
      console.error('Error fetching generated content history:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  schedulePost: async (req, res) => {
    try {
      const { content, template, tone, length, audience, style, topic, language = 'en', scheduledFor } = req.body;
      const userId = req.user._id;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: 'Content is required' });
      }

      if (!scheduledFor) {
        return res.status(400).json({ message: 'Scheduled time is required' });
      }

      const scheduledTime = new Date(scheduledFor);
      const now = new Date();
      
      if (scheduledTime <= now) {
        return res.status(400).json({ message: 'Scheduled time must be in the future' });
      }

      if (content.length > 270) {
        return res.status(400).json({ message: 'Content exceeds Twitter character limit' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = new Post({
        userId: user._id,
        content: content,
        template: template,
        tone: tone,
        length: length,
        audience: audience,
        style: style,
        topic: topic,
        language: language,
        platform: 'X',
        status: 'scheduled',
        scheduledFor: scheduledTime
      });

      await post.save();

      res.status(200).json({
        message: 'Post scheduled successfully',
        post: post
      });
    } catch (error) {
      console.error('Error scheduling post:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  getScheduledPosts: async (req, res) => {
    try {
      const userId = req.user._id;
      
      const scheduledPosts = await Post.find({ 
        userId: userId, 
        status: 'scheduled' 
      }).sort({ scheduledFor: 1 });
      
      res.status(200).json({
        scheduledPosts
      });
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  testTwitterConnection,
  debugTwitterConnection,
  repairTwitterConnection,
  testPost
};
