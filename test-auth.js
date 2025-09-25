// Simple test script to verify authentication endpoints
const API_URL = process.env.API_URL || 'http://localhost:5000';
console.log('Testing authentication endpoints...');
console.log('Using API URL:', API_URL);

// Test the health check endpoint
fetch(`${API_URL}/`)
  .then(response => response.json())
  .then(data => console.log('Health check:', data))
  .catch(error => console.error('Health check failed:', error));

// Test the Google login endpoint (this will fail without a valid token, but we can check if it responds)
fetch(`${API_URL}/api/auth/google`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ tokenId: 'test-token' }),
})
  .then(response => response.json())
  .then(data => console.log('Google login response:', data))
  .catch(error => console.error('Google login failed:', error));

// Test the profile endpoint (this will fail without a valid token)
fetch(`${API_URL}/api/auth/profile`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token',
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => console.log('Profile response:', data))
  .catch(error => console.error('Profile failed:', error));