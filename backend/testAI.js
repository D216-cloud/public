const googleAIService = require('./services/googleAIService');

async function testAI() {
  try {
    const prompt = "Generate a motivational Twitter post about productivity, keep it under 280 characters.";
    console.log("Testing AI content generation...");
    console.log("Prompt:", prompt);
    
    const result = await googleAIService.generateContent(prompt);
    console.log("Generated content:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAI();