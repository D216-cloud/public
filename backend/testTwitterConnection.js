/**
 * Test script for Twitter connection flow
 * This script tests the Twitter OAuth flow and verification process
 */

const express = require('express');
const { TwitterApi } = require('twitter-api-v2');

// Load environment variables
require('dotenv').config({ path: '../.env' });

// Twitter API configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/twitter/callback';

console.log('Twitter Connection Test');
console.log('======================');
console.log('Client ID:', TWITTER_CLIENT_ID ? '✓ Set' : '✗ Not set');
console.log('Client Secret:', TWITTER_CLIENT_SECRET ? '✓ Set' : '✗ Not set');
console.log('Callback URL:', TWITTER_CALLBACK_URL);

// Test Twitter API initialization
try {
  if (TWITTER_CLIENT_ID && TWITTER_CLIENT_SECRET) {
    const client = new TwitterApi({
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET,
    });
    
    console.log('✓ Twitter API client initialized successfully');
    
    // Generate OAuth URL for testing
    const { url, codeVerifier } = client.generateOAuth2AuthLink(TWITTER_CALLBACK_URL, {
      scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
    });
    
    console.log('OAuth URL:', url);
    console.log('Code Verifier (save this for callback):', codeVerifier);
  } else {
    console.log('✗ Twitter API credentials not configured');
    console.log('Please set TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in your .env file');
  }
} catch (error) {
  console.error('✗ Error initializing Twitter API client:', error.message);
}

console.log('\nTo test the full flow:');
console.log('1. Visit the OAuth URL above');
console.log('2. Authorize the application');
console.log('3. Copy the authorization code from the callback URL');
console.log('4. Use the code and code verifier to complete the OAuth flow');