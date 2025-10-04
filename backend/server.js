const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const twitterRoutes = require('./routes/twitterRoutes');
const twitterSetupRoutes = require('./routes/twitterSetupRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { startScheduler } = require('./services/schedulerService');
const path = require('path');

// Load env vars from backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get frontend URL from environment variable
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    
    // For development, only allow localhost URLs
    const allowedOrigins = [
      frontendUrl, // Frontend URL (default: http://localhost:8080)
      'http://localhost:5173', 
      'http://127.0.0.1:8080',
      'http://localhost:3000',
      'http://localhost:5000'
      // Note: Removed deployed URLs like https://public-1rk3.onrender.com for development
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else {
        return allowed.test(origin);
      }
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      console.log('Allowed frontend URL:', frontendUrl);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (with safety wrapper to prevent crash if a router export is wrong)
function safeMount(path, router, name){
  if (typeof router === 'function') {
    try {
      app.use(path, router);
      console.log(`✅ Mounted ${name} at ${path}`);
    } catch (e) {
      console.error(`❌ Failed mounting ${name} at ${path}:`, e.message);
    }
  } else {
    console.error(`⚠️  Skipping ${name} at ${path}. Export type: ${typeof router}. Expected function (Express router).`);
  }
}

console.log('Route module types (pre-mount):', {
  auth: typeof authRoutes,
  posts: typeof postRoutes,
  onboarding: typeof onboardingRoutes,
  twitter: typeof twitterRoutes,
  twitterSetup: typeof twitterSetupRoutes,
  user: typeof userRoutes,
  analytics: typeof analyticsRoutes,
});

safeMount('/api/auth', authRoutes, 'authRoutes');
safeMount('/api/posts', postRoutes, 'postRoutes');
safeMount('/api/onboarding', onboardingRoutes, 'onboardingRoutes');
safeMount('/api/twitter', twitterRoutes, 'twitterRoutes');
safeMount('/api/twitter-setup', twitterSetupRoutes, 'twitterSetupRoutes');
safeMount('/api/user', userRoutes, 'userRoutes');
safeMount('/api/analytics', analyticsRoutes, 'analyticsRoutes');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Use 5000 as default so frontend hitting 5000 works
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the scheduler
  startScheduler();
});