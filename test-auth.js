// Simple test script to verify authentication endpoints
console.log('Testing authentication endpoints...');

// Test the health check endpoint
fetch('http://localhost:5000/')
  .then(response => response.json())
  .then(data => console.log('Health check:', data))
  .catch(error => console.error('Health check failed:', error));

// Test the Google login endpoint (this will fail without a valid token, but we can check if it responds)
fetch('http://localhost:5000/api/auth/google', {
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
fetch('http://localhost:5000/api/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token',
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => console.log('Profile response:', data))
  .catch(error => console.error('Profile failed:', error));