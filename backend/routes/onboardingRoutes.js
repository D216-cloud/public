const express = require('express');
const { 
  saveOnboardingData, 
  getOnboardingData, 
  completeOnboarding 
} = require('../controllers/onboardingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Save/update onboarding data
router.post('/save', saveOnboardingData);

// Get onboarding data
router.get('/data', getOnboardingData);

// Complete onboarding
router.post('/complete', completeOnboarding);

module.exports = router;