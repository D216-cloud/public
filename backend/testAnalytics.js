// Test the analytics endpoints
require('dotenv').config();

async function testAnalytics() {
  try {
    console.log('🔍 Testing analytics endpoints...');
    
    // Test analytics endpoint
    const analyticsResponse = await fetch('http://localhost:5000/api/analytics/analytics?period=30', {
      headers: {
        'Authorization': 'Bearer your_token_here' // You'll need to replace this with a real token
      }
    });
    
    console.log('Analytics endpoint status:', analyticsResponse.status);
    
    // Test calendar endpoint
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const calendarResponse = await fetch(`http://localhost:5000/api/analytics/calendar?year=${year}&month=${month}`, {
      headers: {
        'Authorization': 'Bearer your_token_here' // You'll need to replace this with a real token
      }
    });
    
    console.log('Calendar endpoint status:', calendarResponse.status);
    
    if (analyticsResponse.status === 200) {
      console.log('✅ Analytics endpoint is working!');
    } else {
      console.log('❌ Analytics endpoint returned:', analyticsResponse.status);
    }
    
    if (calendarResponse.status === 200) {
      console.log('✅ Calendar endpoint is working!');
    } else {
      console.log('❌ Calendar endpoint returned:', calendarResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnalytics();