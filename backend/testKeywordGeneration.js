// Load environment variables
require('dotenv').config({ path: '.env' });

const express = require('express');
const app = express();

// Mock user object for testing
const mockUser = {
  _id: 'test-user-id'
};

// Mock request and response objects
const mockReq = {
  user: mockUser,
  body: {
    keyword: 'productivity',
    language: 'en',
    tone: 'motivational',
    template: 'tips',
    length: 'short',
    audience: 'professionals',
    style: 'concise',
    purpose: 'engagement',
    brandVoice: 'professional'
  }
};

const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.data = data;
    console.log(`Status: ${this.statusCode}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

async function testKeywordGeneration() {
  try {
    console.log('Testing Keyword-based Content Generation...');
    console.log('Request data:', mockReq.body);
    
    // Import the controller function
    const { generatePostByKeyword } = require('./controllers/postController');
    
    // Call the function
    await generatePostByKeyword(mockReq, mockRes);
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing keyword generation:', error.message);
  }
}

// Run the test
testKeywordGeneration();