const fetch = require('node-fetch');

async function testServerConnection() {
  console.log('🔍 Testing server connection...\n');
  
  const baseURL = 'http://localhost:5000';
  
  try {
    // Test if server is running
    console.log('1. Testing server availability...');
    const response = await fetch(`${baseURL}/api/posts/post-to-twitter`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    if (response.status === 401) {
      console.log('✅ Server is running (401 = unauthorized, which is expected)');
    } else if (response.status === 404) {
      console.log('❌ Endpoint not found (404) - route may not be configured');
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
    }
    
    // Test the response content type
    const contentType = response.headers.get('content-type');
    console.log(`   Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('   Response:', data);
    } else {
      const text = await response.text();
      console.log('   Response (first 200 chars):', text.substring(0, 200));
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running - connection refused');
      console.log('   Please start the server with: npm start');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Make sure backend server is running: cd backend && npm start');
  console.log('2. Check that VITE_API_URL is set correctly in frontend .env');
  console.log('3. Verify no CORS issues between frontend and backend');
}

testServerConnection();