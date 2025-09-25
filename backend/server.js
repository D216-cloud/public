const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const twitterRoutes = require('./routes/twitterRoutes');
const path = require('path');

// Load env vars from main project directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/twitter', twitterRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});