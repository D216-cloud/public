/**
 * Test script to verify Twitter credentials
 * This script checks if the Twitter API credentials are properly configured
 */

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('=== Twitter Credentials Verification ===');
console.log('');

// Check if credentials are set
const clientId = process.env.TWITTER_CLIENT_ID;
const clientSecret = process.env.TWITTER_CLIENT_SECRET;

console.log('TWITTER_CLIENT_ID:', clientId ? '✓ Set' : '✗ Not set');
console.log('TWITTER_CLIENT_SECRET:', clientSecret ? '✓ Set' : '✗ Not set');

// Check if credentials are placeholder values
if (clientId && clientId !== 'your_twitter_client_id_here') {
  console.log('✅ TWITTER_CLIENT_ID appears to be properly configured');
} else {
  console.log('❌ TWITTER_CLIENT_ID is missing or still contains placeholder value');
}

if (clientSecret && clientSecret !== 'your_twitter_client_secret_here') {
  console.log('✅ TWITTER_CLIENT_SECRET appears to be properly configured');
} else {
  console.log('❌ TWITTER_CLIENT_SECRET is missing or still contains placeholder value');
}

console.log('');
console.log('=== Instructions ===');
console.log('1. If either credential shows as "Not set" or contains placeholder values:');
console.log('   - Get real credentials from https://developer.twitter.com/');
console.log('   - Update your .env file with actual credentials');
console.log('   - Restart your backend server');
console.log('');
console.log('2. If both credentials are properly set:');
console.log('   - The Twitter connection should work correctly');
console.log('   - If you still have issues, check the backend logs for more details');