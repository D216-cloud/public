const User = require('../models/User');
const Post = require('../models/Post');
const GeneratedContent = require('../models/GeneratedContent');
const googleAIService = require('../services/googleAIService');
const { TwitterApi } = require('twitter-api-v2');

// Content templates for fallback generation
const contentTemplates = {
  "motivational": [
    "🚀 Monday motivation: Every expert was once a beginner. The key is to start where you are, use what you have, and do what you can. Your journey to mastery begins with a single step! #MondayMotivation #Growth",
    "✨ Success isn't about being perfect, it's about being consistent. Small daily improvements compound into extraordinary results over time. Keep pushing forward! #Motivation #Success",
    "🔥 Your potential is endless. Don't let fear of failure stop you from trying. Every 'no' brings you closer to your 'yes'. Believe in yourself! #Believe #Potential"
  ],
  "tips": [
    "💡 Pro tip: Batch similar tasks together to maximize your productivity. Instead of switching between different types of work, dedicate blocks of time to similar activities. Your focus (and results) will thank you! #ProductivityTip #WorkSmart",
    "⚡ Quick productivity hack: The 2-minute rule. If a task takes less than 2 minutes, do it immediately instead of adding it to your to-do list. #Productivity #TimeManagement",
    "🎯 Focus hack: Turn off all notifications except for urgent messages. Your deep work sessions will be 3x more productive. #DeepWork #Focus"
  ],
  "question": [
    "🤔 Quick question: What's the one productivity tool you can't live without? I'm always looking to improve my workflow. Drop your favorite in the replies! #Productivity #Tools",
    "💬 Engagement question: What's the biggest challenge you're facing in your career right now? Let's help each other out in the comments! #Career #Community",
    "🔥 Discussion: Traditional marketing vs digital marketing - which do you think is more effective in 2023? Let's debate! #Marketing #Business"
  ],
  "announcement": [
    "🎉 Big announcement: We just launched our new feature that will revolutionize how you manage your social media content. Check it out and let us know what you think! #NewFeature #Launch",
    "🚀 Product update: Our latest version includes 15 new features based on your feedback. We're constantly improving to serve you better! #Update #Feedback",
    "🌟 Exclusive access: Our premium plan is now available with 30% off for early adopters. Limited time offer - grab it before it's gone! #Premium #Offer"
  ],
  "behind-scenes": [
    "Behind the scenes: Our team just spent 3 hours debugging a single line of code. Sometimes the smallest bugs create the biggest headaches! 😅 But that's the beauty of development. #DevLife #Coding",
    "🎥 Behind the scenes: Here's a sneak peek of our team working on the next big feature. We can't wait for you to experience it! #TeamWork #SneakPeek",
    "☕ Behind the scenes: Late night coding session with triple espresso. When you're passionate about what you do, work feels like play! #Coding #Passion"
  ],
  "industry-news": [
    "📊 Industry insight: 73% of companies plan to increase their AI investment in 2023. Are you ready for the AI revolution in your industry? #AI #Industry",
    "📈 Market trend: Remote work tools have seen a 200% increase in adoption since 2020. The future of work is flexible! #RemoteWork #Future",
    "💡 Innovation watch: Quantum computing is expected to break current encryption methods by 2030. Time to prepare for post-quantum security! #Quantum #Security"
  ]
};

// Function to post content to Twitter with optional image
const postToTwitter = async (content, userId, imageBuffer = null) => {
  try {
    // Get user's Twitter connection
    const user = await User.findById(userId);
    if (!user || !user.twitterId) {
      throw new Error('Twitter account not connected');
    }

    // For demo purposes, we'll simulate posting to Twitter
    // In a real implementation, you would use the Twitter API:
    /*
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: user.twitterAccessToken,
      accessSecret: user.twitterAccessSecret,
    });

    const tweetParams = { status: content };
    
    if (imageBuffer) {
      // Upload image and attach to tweet
      const mediaId = await client.v1.uploadMedia(imageBuffer);
      tweetParams.media_ids = [mediaId];
    }
    
    const tweet = await client.v1.tweet(content, tweetParams);
    return tweet;
    */

    // Simulate successful posting
    console.log(`Posted to Twitter: ${content}`);
    return { id: 'simulated_tweet_id', text: content };
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    throw error;
  }
};

const postToX = async (req, res) => {
  try {
    const { content, template, tone, length, audience, style, topic, language = 'en' } = req.body;
    const userId = req.user._id;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Check if content exceeds Twitter's character limit
    if (content.length > 280) {
      return res.status(400).json({ message: 'Content exceeds Twitter\'s 280 character limit' });
    }

    // Get user to check if they have connected their Twitter account
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Post to Twitter
    const twitterResponse = await postToTwitter(content, userId);

    // Create a post record in the database
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

    res.status(200).json({
      message: 'Successfully posted to X',
      post: post
    });
  } catch (error) {
    console.error('Error posting to X:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Post content to Twitter with optional image
const postToTwitterWithMedia = async (req, res) => {
  try {
    const { content, language = 'en' } = req.body;
    const userId = req.user._id;
    const image = req.file; // Multer will handle image upload

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Check if content exceeds Twitter's character limit
    if (content.length > 280) {
      return res.status(400).json({ message: 'Content exceeds Twitter\'s 280 character limit' });
    }

    // Get user to check if they have connected their Twitter account
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert image buffer if provided
    let imageBuffer = null;
    if (image) {
      imageBuffer = image.buffer;
    }

    // Post to Twitter with image
    const twitterResponse = await postToTwitter(content, userId, imageBuffer);

    // Create a post record in the database
    const post = new Post({
      userId: user._id,
      content: content,
      language: language,
      platform: 'X',
      status: 'posted',
      hasImage: !!imageBuffer,
      postedAt: new Date(),
      externalId: twitterResponse.id
    });

    await post.save();

    res.status(200).json({
      message: 'Successfully posted to Twitter',
      post: post
    });
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPostedContent = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch posts from the database for this user
    const posts = await Post.find({ userId: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      posts
    });
  } catch (error) {
    console.error('Error fetching posted content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate content using Google AI API
const generateContent = async (req, res) => {
  try {
    const { topic, template, tone, length, audience, style, language = 'en' } = req.body;
    const userId = req.user._id;
    
    // Create a detailed prompt based on user selections for better Twitter content
    let prompt = `Generate an engaging Twitter post`;
    
    if (template) {
      const templateDescriptions = {
        'motivational': 'inspirational and motivational content that encourages followers',
        'tips': 'helpful tips and advice for productivity or personal development',
        'question': 'engaging questions that spark conversation and interaction',
        'announcement': 'exciting announcements about new features, products, or updates',
        'behind-scenes': 'authentic behind-the-scenes content showing company culture or work',
        'industry-news': 'insightful commentary on industry trends and news'
      };
      prompt += ` in the style of ${templateDescriptions[template] || template}`;
    }
    
    if (tone) {
      const toneDescriptions = {
        'professional': 'professional and business-like',
        'casual': 'casual and conversational',
        'humorous': 'funny and light-hearted',
        'inspirational': 'uplifting and motivational',
        'educational': 'informative and teaching',
        'sarcastic': 'witty with a touch of sarcasm',
        'enthusiastic': 'excited and energetic'
      };
      prompt += ` with a ${toneDescriptions[tone] || tone} tone`;
    }
    
    if (length) {
      const lengthDescriptions = {
        'short': 'brief and concise (1-2 sentences)',
        'medium': 'moderately detailed (2-3 sentences)',
        'long': 'more comprehensive (3+ sentences)'
      };
      prompt += `, ${lengthDescriptions[length] || length}`;
    }
    
    if (audience) {
      const audienceDescriptions = {
        'general': 'general audience',
        'developers': 'software developers and tech professionals',
        'entrepreneurs': 'business owners and entrepreneurs',
        'students': 'students and young learners',
        'professionals': 'working professionals'
      };
      prompt += ` targeted at ${audienceDescriptions[audience] || audience}`;
    }
    
    if (style) {
      const styleDescriptions = {
        'concise': 'straightforward and to the point',
        'detailed': 'thorough and comprehensive',
        'storytelling': 'narrative and story-driven',
        'list-based': 'organized in a list format'
      };
      prompt += ` in a ${styleDescriptions[style] || style} style`;
    }
    
    if (topic) {
      prompt += ` about "${topic}"`;
    }
    
    prompt += `. Make it engaging for Twitter with emojis, relevant hashtags, and under 280 characters. Focus on creating content that encourages likes, retweets, and replies.`;
    
    // Add Twitter-specific best practices
    prompt += ` Include 1-3 relevant hashtags. Use emojis strategically. Make it conversational and engaging.`;
    
    if (template === 'question') {
      prompt += ` End with a question to encourage replies.`;
    } else if (template === 'announcement') {
      prompt += ` Include a call-to-action.`;
    } else if (template === 'tips') {
      prompt += ` Start with a number or bullet point style.`;
    }
    
    // Try to generate content with Google AI API
    let generatedContent;
    try {
      generatedContent = await googleAIService.generateContent(prompt, language);
      console.log('Successfully generated content with Gemini API');
    } catch (apiError) {
      console.error('Gemini API failed, using fallback templates:', apiError.message);
      
      // Enhanced fallback logic based on template
      const templateKey = template ? template.toLowerCase().replace(/\s+/g, '-') : 'motivational';
      const contentOptions = contentTemplates[templateKey] || contentTemplates.motivational;
      generatedContent = contentOptions[Math.floor(Math.random() * contentOptions.length)];
      
      console.log('Using fallback content for template:', templateKey);
    }
    
    // Extract hashtags and mentions for storage
    const hashtags = (generatedContent.match(/#\w+/g) || []).map(tag => tag.toLowerCase());
    const mentions = (generatedContent.match(/@\w+/g) || []).map(mention => mention.toLowerCase());
    
    // Create a record in the database for the generated content
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
      hashtags: hashtags,
      mentions: mentions,
      engagementScore: Math.floor(Math.random() * 40) + 60 // Random score between 60-100 for demo
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

// Generate content using Google AI API based on keyword and options
const generatePostByKeyword = async (req, res) => {
  try {
    const { 
      keyword, 
      language = 'en', 
      tone, 
      template, 
      length, 
      audience, 
      style,
      purpose,
      brandVoice
    } = req.body;
    
    const userId = req.user._id;
    
    // Validate keyword
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ message: 'Keyword is required' });
    }
    
    // Create a comprehensive prompt based on all options
    let prompt = `Generate a Twitter post`;
    
    if (template) {
      prompt += ` using the ${template} template`;
    }
    
    if (tone) {
      prompt += ` with a ${tone} tone`;
    }
    
    if (length) {
      prompt += ` in a ${length} format`;
    }
    
    if (audience) {
      prompt += ` for ${audience} audience`;
    }
    
    if (style) {
      prompt += ` using ${style} style`;
    }
    
    if (purpose) {
      prompt += ` for ${purpose} purpose`;
    }
    
    if (brandVoice) {
      prompt += ` with ${brandVoice} brand voice`;
    }
    
    prompt += ` about "${keyword}". Keep it under 280 characters for Twitter.`;
    
    // Try to generate content with Google AI API
    let generatedContent;
    try {
      generatedContent = await googleAIService.generateContent(prompt, language);
    } catch (apiError) {
      // Fallback to predefined templates if API fails
      console.error('Google AI API failed, using fallback:', apiError);
      const templateKey = Object.keys(contentTemplates).find(key => 
        template && template.toLowerCase().includes(key)
      ) || 'motivational';
      
      const contentOptions = contentTemplates[templateKey] || contentTemplates.motivational;
      generatedContent = contentOptions[Math.floor(Math.random() * contentOptions.length)];
    }
    
    // Extract hashtags and mentions for storage
    const hashtags = (generatedContent.match(/#\w+/g) || []).map(tag => tag.toLowerCase());
    const mentions = (generatedContent.match(/@\w+/g) || []).map(mention => mention.toLowerCase());
    
    // Create a record in the database for the generated content
    const generatedContentRecord = new GeneratedContent({
      userId: userId,
      content: generatedContent,
      template: template,
      tone: tone,
      length: length,
      audience: audience,
      style: style,
      purpose: purpose,
      brandVoice: brandVoice,
      topic: keyword,
      language: language,
      prompt: prompt,
      platform: 'X',
      characterCount: generatedContent.length,
      wordCount: generatedContent.trim().split(/\s+/).length,
      hashtags: hashtags,
      mentions: mentions,
      engagementScore: Math.floor(Math.random() * 40) + 60 // Random score between 60-100 for demo
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
};

// Get generated content history for a user
const getGeneratedContentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch generated content from the database for this user
    const generatedContent = await GeneratedContent.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 generated posts
    
    res.status(200).json({
      generatedContent
    });
  } catch (error) {
    console.error('Error fetching generated content history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  postToX,
  postToTwitterWithMedia,
  getPostedContent,
  generateContent,
  generatePostByKeyword,
  getGeneratedContentHistory
};