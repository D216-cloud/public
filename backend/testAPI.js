// Simple test script to verify the API is working
const jwt = require('jsonwebtoken');

// Use environment variable for API URL or default to localhost:5000
const API_URL = process.env.API_URL || 'http://localhost:5000';

// Create a test token (in a real scenario, this would come from a login)
// Note: the token should have 'id' property, not '_id'
const testUser = {
  id: '60f7b3b3d3a7d60015f0e8a4',  // Changed from '_id' to 'id'
  name: 'Test User',
  email: 'test@example.com'
};

const token = jwt.sign(testUser, process.env.JWT_SECRET || 'supersecretkey');

console.log('Testing API with token:', token);
console.log('Using API URL:', API_URL);

// Test the generate content endpoint
fetch(`${API_URL}/api/posts/generate-content`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topic: 'productivity tips',
    template: 'tips',
    tone: 'professional'
  })
})
.then(res => {
  console.log('Generate Content Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Generate Content Response:', data);
})
.catch(console.error);

// Test the post to X endpoint
fetch(`${API_URL}/api/posts/post-to-x`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: 'This is a test post to X using the Gemini API integration!',
    template: 'tips',
    tone: 'professional',
    topic: 'API testing'
  })
})
.then(res => {
  console.log('Post to X Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Post to X Response:', data);
})
.catch(console.error);

// Test the generated content history endpoint
fetch(`${API_URL}/api/posts/generated-content-history`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => {
  console.log('Generated Content History Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Generated Content History Response:', data);
})
.catch(console.error);