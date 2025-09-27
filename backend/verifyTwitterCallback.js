/**
 * Script to verify Twitter callback URL configuration
 */

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('=== Twitter Callback URL Verification ===');
console.log('');

// Check callback URL configuration
const callbackUrl = process.env.TWITTER_CALLBACK_URL;
console.log('Configured Callback URL:', callbackUrl);

// Verify it matches Twitter app requirements
if (callbackUrl) {
  if (callbackUrl === 'http://localhost:5000/api/twitter/callback') {
    console.log('✅ Callback URL is correctly configured for local development');
  } else {
    console.log('⚠️  Callback URL is configured but may not match your Twitter app settings');
    console.log('   Make sure your Twitter app has this exact callback URL configured:');
    console.log('   ', callbackUrl);
  }
} else {
  console.log('❌ TWITTER_CALLBACK_URL is not set in your .env file');
  console.log('   Add this line to your .env file:');
  console.log('   TWITTER_CALLBACK_URL=http://localhost:5000/api/twitter/callback');
}

console.log('');
console.log('=== Twitter App Settings Checklist ===');
console.log('1. Go to https://developer.twitter.com/');
console.log('2. Navigate to your app → "Settings" → "User authentication settings"');
console.log('3. Verify these settings:');
console.log('   - Callback URLs: ', callbackUrl || 'NOT SET');
console.log('   - App permissions: Read and Write');
console.log('   - App type: Web application');
console.log('   - Environment: Development (for local testing)');

console.log('');
console.log('=== Testing Callback URL Accessibility ===');
console.log('You can test if your callback URL is accessible by:');
console.log('1. Starting your backend server');
console.log('2. Visiting this URL in your browser:');
console.log('   ', callbackUrl || 'http://localhost:5000/api/twitter/callback');
console.log('3. You should see a JSON response with an error about missing parameters');
console.log('   (This is expected and indicates the endpoint is working)');