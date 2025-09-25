const Onboarding = require('../models/Onboarding');
const User = require('../models/User');

// Save or update onboarding data
const saveOnboardingData = async (req, res) => {
  try {
    console.log('📝 Saving onboarding data...');
    console.log('User ID:', req.user._id);
    console.log('User object:', req.user);
    console.log('Request body:', req.body);

    const {
      goals,
      audience,
      niche,
      contentTypes,
      competitors,
      postingFrequency,
      tone,
      autoPosting,
      twitterConnected,
      twitterHandle,
      isCompleted
    } = req.body;

    const userId = req.user._id;
    const email = req.user.email;

    // Validate that we have the required email
    if (!email) {
      console.error('❌ User email is missing from auth token');
      return res.status(400).json({
        success: false,
        message: 'User email is required but not found. Please log in again.',
        error: 'Missing user email'
      });
    }

    console.log('User email:', email);

    // Check if onboarding data already exists
    let onboarding = await Onboarding.findOne({ userId });
    console.log('Existing onboarding:', onboarding ? 'Found' : 'Not found');

    if (onboarding) {
      // Update existing onboarding data
      console.log('Updating existing onboarding data...');
      
      // Ensure email is preserved during update
      onboarding.email = email;
      onboarding.goals = goals || onboarding.goals;
      onboarding.audience = audience || onboarding.audience;
      onboarding.niche = niche || onboarding.niche;
      onboarding.contentTypes = contentTypes || onboarding.contentTypes;
      onboarding.competitors = competitors || onboarding.competitors;
      onboarding.postingFrequency = postingFrequency || onboarding.postingFrequency;
      onboarding.tone = tone || onboarding.tone;
      onboarding.autoPosting = autoPosting !== undefined ? autoPosting : onboarding.autoPosting;
      onboarding.twitterConnected = twitterConnected !== undefined ? twitterConnected : onboarding.twitterConnected;
      onboarding.twitterHandle = twitterHandle || onboarding.twitterHandle;
      onboarding.isCompleted = isCompleted !== undefined ? isCompleted : onboarding.isCompleted;
      
      await onboarding.save();
      console.log('✅ Onboarding data updated successfully');
    } else {
      // Create new onboarding data
      console.log('Creating new onboarding data...');
      onboarding = await Onboarding.create({
        userId,
        email,
        goals: goals || [],
        audience: audience || '',
        niche: niche || '',
        contentTypes: contentTypes || [],
        competitors: competitors || '',
        postingFrequency: postingFrequency || '',
        tone: tone || '',
        autoPosting: autoPosting !== undefined ? autoPosting : false,
        twitterConnected: twitterConnected !== undefined ? twitterConnected : false,
        twitterHandle: twitterHandle || null,
        isCompleted: isCompleted !== undefined ? isCompleted : false
      });
      console.log('✅ New onboarding data created successfully');
    }

    res.json({
      success: true,
      message: 'Onboarding data saved successfully! 🎉',
      data: onboarding
    });
  } catch (error) {
    console.error('❌ Error saving onboarding data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save onboarding data. Please try again.',
      error: error.message 
    });
  }
};

// Get onboarding data
const getOnboardingData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const onboarding = await Onboarding.findOne({ userId }).populate('userId', 'name email');
    
    if (!onboarding) {
      return res.status(404).json({ 
        success: false,
        message: 'Onboarding data not found' 
      });
    }

    res.json({
      success: true,
      data: onboarding
    });
  } catch (error) {
    console.error('Error getting onboarding data:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while getting onboarding data',
      error: error.message 
    });
  }
};

// Complete onboarding
const completeOnboarding = async (req, res) => {
  try {
    console.log('🎆 Completing onboarding for user:', req.user._id);
    console.log('User object:', req.user);
    const userId = req.user._id;
    const email = req.user.email;
    
    // Validate that we have the required email
    if (!email) {
      console.error('❌ User email is missing from auth token');
      return res.status(400).json({
        success: false,
        message: 'User email is required but not found. Please log in again.',
        error: 'Missing user email'
      });
    }
    
    console.log('User email:', email);
    
    // Extract final onboarding data from request body if provided
    const {
      goals,
      audience,
      niche,
      contentTypes,
      competitors,
      postingFrequency,
      tone,
      autoPosting,
      twitterConnected,
      twitterHandle,
      isCompleted
    } = req.body;
    
    // Find existing onboarding or create new one
    let onboarding = await Onboarding.findOne({ userId });
    
    if (onboarding) {
      // Update with final data
      onboarding.email = email; // Ensure email is preserved
      if (goals) onboarding.goals = goals;
      if (audience) onboarding.audience = audience;
      if (niche) onboarding.niche = niche;
      if (contentTypes) onboarding.contentTypes = contentTypes;
      if (competitors) onboarding.competitors = competitors;
      if (postingFrequency) onboarding.postingFrequency = postingFrequency;
      if (tone) onboarding.tone = tone;
      if (autoPosting !== undefined) onboarding.autoPosting = autoPosting;
      if (twitterConnected !== undefined) onboarding.twitterConnected = twitterConnected;
      if (twitterHandle) onboarding.twitterHandle = twitterHandle;
      
      // Always mark as completed when this endpoint is called
      onboarding.isCompleted = true;
      onboarding.completedAt = new Date();
      
      await onboarding.save();
    } else {
      // Create new complete onboarding record
      onboarding = await Onboarding.create({
        userId,
        email,
        goals: goals || [],
        audience: audience || '',
        niche: niche || '',
        contentTypes: contentTypes || [],
        competitors: competitors || '',
        postingFrequency: postingFrequency || '',
        tone: tone || '',
        autoPosting: autoPosting !== undefined ? autoPosting : false,
        twitterConnected: twitterConnected !== undefined ? twitterConnected : false,
        twitterHandle: twitterHandle || null,
        isCompleted: true,
        completedAt: new Date()
      });
    }

    console.log('✅ Onboarding completed successfully!');
    res.json({
      success: true,
      message: 'Congratulations! Your setup is complete! 🎉 Welcome to TwitterAI Pro!',
      data: onboarding
    });
  } catch (error) {
    console.error('❌ Error completing onboarding:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to complete onboarding setup. Please try again.',
      error: error.message 
    });
  }
};

module.exports = {
  saveOnboardingData,
  getOnboardingData,
  completeOnboarding,
};