// Load environment variables
require('dotenv').config({ path: '.env' });

console.log('Environment Variables Test:');
console.log('========================');

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 
  `${process.env.GEMINI_API_KEY.substring(0, 10)}...${process.env.GEMINI_API_KEY.slice(-5)}` : 
  'NOT SET');

console.log('TWITTER_CLIENT_ID:', process.env.TWITTER_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');

if (process.env.GEMINI_API_KEY) {
  console.log('\n✅ GEMINI_API_KEY is properly configured in .env file');
} else {
  console.log('\n❌ GEMINI_API_KEY is missing from .env file');
}