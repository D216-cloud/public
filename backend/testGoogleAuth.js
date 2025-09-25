// Google OAuth Test Script
// Run this script to verify Google OAuth configuration

const { OAuth2Client } = require('google-auth-library');

// Load environment variables
require('dotenv').config({ path: './.env' });

console.log('Testing Google OAuth Configuration...');
console.log('=====================================');

// Check if required environment variables are set
const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing environment variables:', missingEnvVars);
  console.error('Please set these variables in your .env file');
  process.exit(1);
}

console.log('✅ GOOGLE_CLIENT_ID is set');
console.log('✅ GOOGLE_CLIENT_SECRET is set');

// Test Google OAuth client initialization
try {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(clientId);
  console.log('✅ Google OAuth client initialized successfully');
  
  // Display client configuration
  console.log('\nClient Configuration:');
  console.log('- Client ID:', clientId.substring(0, 20) + '...');
  
  console.log('\n✅ All Google OAuth configurations appear to be correct');
  console.log('\nNext steps:');
  console.log('1. Ensure your Google Cloud Console project has http://localhost:8080 and http://localhost:5000 in the authorized origins');
  console.log('2. Make sure the redirect URIs include http://localhost:5000/api/auth/google/callback');
  console.log('3. Verify the Google Client ID matches the one in your Google Cloud Console');
  
} catch (error) {
  console.error('❌ Error initializing Google OAuth client:', error.message);
  process.exit(1);
}