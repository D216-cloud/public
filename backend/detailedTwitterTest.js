/**
 * Detailed test script to verify Twitter credentials and connection
 */

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('=== Detailed Twitter Credentials Verification ===');
console.log('');

// Check if credentials are set
const clientId = process.env.TWITTER_CLIENT_ID;
const clientSecret = process.env.TWITTER_CLIENT_SECRET;

console.log('Environment Variables Check:');
console.log('TWITTER_CLIENT_ID:', clientId ? '✓ Set' : '✗ Not set');
console.log('TWITTER_CLIENT_SECRET:', clientSecret ? '✓ Set' : '✗ Not set');

// Check if credentials are placeholder values
if (clientId && clientId !== 'your_twitter_client_id_here') {
  console.log('✅ TWITTER_CLIENT_ID appears to be properly configured');
} else {
  console.log('❌ TWITTER_CLIENT_ID is missing or still contains placeholder value');
  console.log('   Current value:', clientId);
}

if (clientSecret && clientSecret !== 'your_twitter_client_secret_here') {
  console.log('✅ TWITTER_CLIENT_SECRET appears to be properly configured');
} else {
  console.log('❌ TWITTER_CLIENT_SECRET is missing or still contains placeholder value');
  console.log('   Current value:', clientSecret);
}

console.log('');
console.log('Actual Values (for debugging only - do not share these):');
console.log('TWITTER_CLIENT_ID:', clientId);
console.log('TWITTER_CLIENT_SECRET:', clientSecret ? '********' + clientSecret.substring(clientSecret.length - 4) : 'NOT SET');

console.log('');
console.log('=== Testing Twitter API Connection ===');

// Try to initialize the Twitter API client
try {
  const { TwitterApi } = require('twitter-api-v2');
  
  if (clientId && clientSecret && 
      clientId !== 'your_twitter_client_id_here' && 
      clientSecret !== 'your_twitter_client_secret_here') {
    
    const client = new TwitterApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });
    
    console.log('✅ Twitter API client initialized successfully');
    console.log('   This means your credentials are syntactically correct');
    console.log('   However, we cannot verify if they are valid without the OAuth flow');
    
  } else {
    console.log('❌ Cannot test Twitter API client - credentials are not properly configured');
  }
} catch (error) {
  console.log('❌ Error initializing Twitter API client:', error.message);
}

console.log('');
console.log('=== Common Issues and Solutions ===');
console.log('1. If credentials appear correct but connection still fails:');
console.log('   - Check that your Twitter app has the correct permissions');
console.log('   - Verify your callback URL is set to: http://localhost:5000/api/twitter/callback');
console.log('   - Ensure your Twitter app is in "Development" mode if testing locally');
console.log('');
console.log('2. If you see "invalid credentials" errors:');
console.log('   - Double-check that you copied the API Key and Secret correctly');
console.log('   - Make sure you are using the "API Key and Secret", not the "Bearer Token"');
console.log('   - Verify there are no extra spaces in your credentials');
console.log('');
console.log('3. If everything looks correct but still fails:');
console.log('   - Restart your backend server completely');
console.log('   - Check the backend logs for more detailed error messages');