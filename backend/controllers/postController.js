const User = require('../models/User');
const Post = require('../models/Post');
const GeneratedContent = require('../models/GeneratedContent');
const googleAIService = require('../services/googleAIService');

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

const postToX = async (req, res) => {
  try {
    const { content, template, tone, length, audience, style, topic } = req.body;
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
      platform: 'X',
      status: 'posted',
      postedAt: new Date()
    });

    await post.save();

    // In a real implementation, you would:
    // 1. Check if user has connected their Twitter account
    // 2. Use Twitter API to post the content
    // 3. Update the post status based on the API response
    
    // For simulation, we'll just log the post
    console.log(`Posted to X: ${content}`);

    res.status(200).json({
      message: 'Successfully posted to X',
      post: post
    });
  } catch (error) {
    console.error('Error posting to X:', error);
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
    const { topic, template, tone, length, audience, style } = req.body;
    const userId = req.user._id;
    
    // Create a prompt based on user selections
    const prompt = `Generate a Twitter post${template ? ` using the ${template} template` : ''}${tone ? ` with a ${tone} tone` : ''}${length ? ` in a ${length} format` : ''}${audience ? ` for ${audience} audience` : ''}${topic ? ` about "${topic}"` : ''}. Keep it under 280 characters for Twitter.`;
    
    // Try to generate content with Google AI API
    let generatedContent;
    try {
      generatedContent = await googleAIService.generateContent(prompt);
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
      topic: topic,
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
  getPostedContent,
  generateContent,
  getGeneratedContentHistory
};