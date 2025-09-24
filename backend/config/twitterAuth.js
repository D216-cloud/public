const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const twitterConfig = {
  apiKey: process.env.TWITTER_API_KEY || 'ufcmqWdQMERDiE6Pt34L3a36I',
  apiKeySecret: process.env.TWITTER_API_KEY_SECRET || 'wHc7NcIXBQ9uQ8mTRLZPiyNbC2co68OIMXGWUFCXtESD4dgWCO',
  bearerToken: process.env.TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAP0k4QEAAAAAMs1YJDzpPKEPoT%2F78eQp1mz7Vnk%3DrTSRe7Lt4FMZZQRIHi0H19jXsyHTLQGHLENUOq5DtlXe8Zx2ko',
  callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/twitter/callback'
};

module.exports = twitterConfig;