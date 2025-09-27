// Load environment variables
require('dotenv').config({ path: '.env' });

const axios = require('axios');

async function listGeminiModels() {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCAlb0aYQbUDhg4sz5sjnY5qULvQFUc_5U";
    const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
    
    console.log('Fetching available Gemini models...');
    console.log(`Using API Key: ${API_KEY.substring(0, 10)}...`);
    
    const response = await axios.get(
      `${BASE_URL}/models?key=${API_KEY}`,
      {
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log('\nAvailable models:');
    if (response.data && response.data.models) {
      response.data.models.forEach(model => {
        console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
        if (model.description) {
          console.log(`  Description: ${model.description}`);
        }
        if (model.version) {
          console.log(`  Version: ${model.version}`);
        }
        console.log('');
      });
    } else {
      console.log('No models found in response');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('Error fetching models:', error.response?.data || error.message);
    
    // If it's a 404 error, try a different endpoint
    if (error.response?.status === 404) {
      console.log('\nTrying alternative endpoint...');
      try {
        const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCAlb0aYQbUDhg4sz5sjnY5qULvQFUc_5U";
        const response = await axios.get(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
          {
            timeout: 10000 // 10 second timeout
          }
        );
        
        console.log('Alternative endpoint response:');
        console.log(JSON.stringify(response.data, null, 2));
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError.response?.data || altError.message);
      }
    }
  }
}

listGeminiModels(); // Fixed function name