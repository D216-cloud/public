/**
 * Simple test to verify Twitter OAuth public endpoint
 */

require('dotenv').config();

// Import the controller function directly
const { beginTwitterAuthPublic } = require('./controllers/twitterController');
const connectDB = require('./config/db');

// Mock request and response objects
const mockReq = {
  body: {},
  query: {},
  params: {}
};

const mockRes = {
  statusCode: 200,
  data: null,
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.data = data;
    console.log(`Response Status: ${this.statusCode}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    return this;
  }
};

async function testPublicTwitterAuth() {
  console.log('🧪 Testing beginTwitterAuthPublic function...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');
    
    // Test the function
    await beginTwitterAuthPublic(mockReq, mockRes);
    
    if (mockRes.statusCode === 200 && mockRes.data && mockRes.data.authUrl) {
      console.log('✅ Function works correctly!');
      console.log('🔗 OAuth URL would be:', mockRes.data.authUrl.substring(0, 100) + '...');
    } else {
      console.log('❌ Function test failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing function:', error.message);
  }
  
  process.exit(0);
}

testPublicTwitterAuth();