// Load environment variables
require('dotenv').config({ path: '.env' });

const googleAIService = require('./services/googleAIService');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testGeminiAPI(attempt = 1, maxAttempts = 3) {
  try {
    console.log(`Testing Gemini API with environment key (Attempt ${attempt}/${maxAttempts})...`);
    
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY not found in environment variables');
      return;
    }
    
    console.log(`Using API Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
    
    // Test 1: English content generation
    console.log('\n1. Testing English content generation:');
    const englishPrompt = "Write a short motivational tweet about productivity.";
    const englishContent = await googleAIService.generateContent(englishPrompt, 'en');
    console.log('Generated English content:', englishContent);
    
    // Test 2: Hindi content generation
    console.log('\n2. Testing Hindi content generation:');
    const hindiPrompt = "Write a short motivational tweet about productivity.";
    const hindiContent = await googleAIService.generateContent(hindiPrompt, 'hi');
    console.log('Generated Hindi content:', hindiContent);
    
    // Test 3: Spanish content generation
    console.log('\n3. Testing Spanish content generation:');
    const spanishPrompt = "Write a short motivational tweet about productivity.";
    const spanishContent = await googleAIService.generateContent(spanishPrompt, 'es');
    console.log('Generated Spanish content:', spanishContent);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error(`❌ Error testing Gemini API (Attempt ${attempt}/${maxAttempts}):`, error.message);
    
    if (attempt < maxAttempts) {
      console.log(`\n⏳ Waiting 5 seconds before retry...`);
      await delay(5000);
      return testGeminiAPI(attempt + 1, maxAttempts);
    } else {
      console.log('\n❌ All retry attempts failed. The service may be temporarily unavailable.');
      console.log('Please try again later when the Gemini API service is back online.');
    }
  }
}

// Run the test
testGeminiAPI();