const express = require('express');
const { protect } = require('../middleware/auth');
const { getAnalytics, getCalendarData } = require('../controllers/analyticsController');

const router = express.Router();

// All routes protected by authentication
router.use(protect);

// Get analytics data
router.get('/analytics', getAnalytics);

// Get calendar data
router.get('/calendar', getCalendarData);

module.exports = router;