/**
 * Test script to verify Twitter endpoint accessibility
 */

const http = require('http');

console.log('=== Testing Twitter Endpoint Accessibility ===');
console.log('');

// Test if the server is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Server Status: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Server is running and accessible');
  } else {
    console.log('❌ Server returned unexpected status code');
  }
  
  // Test Twitter auth endpoint
  const authOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/twitter/auth',
    method: 'GET'
  };
  
  const authReq = http.request(authOptions, (authRes) => {
    console.log('');
    console.log(`Twitter Auth Endpoint Status: ${authRes.statusCode}`);
    
    if (authRes.statusCode === 401) {
      console.log('✅ Twitter auth endpoint is accessible (401 is expected without auth token)');
    } else if (authRes.statusCode === 404) {
      console.log('❌ Twitter auth endpoint not found (check your routes)');
    } else {
      console.log(`❓ Twitter auth endpoint returned status: ${authRes.statusCode}`);
    }
    
    // Collect response data
    let data = '';
    authRes.on('data', (chunk) => {
      data += chunk;
    });
    
    authRes.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('Response:', JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('Response (non-JSON):', data.substring(0, 200) + '...');
      }
    });
  });
  
  authReq.on('error', (error) => {
    console.log('');
    console.log('❌ Error accessing Twitter auth endpoint:', error.message);
    console.log('   This usually means the server is not running or not accessible on port 5000');
  });
  
  authReq.end();
});

req.on('error', (error) => {
  console.log('❌ Error accessing server:', error.message);
  console.log('   This usually means the backend server is not running');
  console.log('   Please start your backend server with: npm run dev:backend');
});

req.end();