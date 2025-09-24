const axios = require('axios');

class GoogleAIService {
  constructor() {
    this.API_KEY = process.env.GOOGLE_AI_API_KEY || "AIzaSyC_igBEBZKTzDmOJAHhk9vUy54j5BUp1f0";
    this.BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateContent(prompt) {
    try {
      // Updated to use the correct model name
      const response = await axios.post(
        `${this.BASE_URL}/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!generatedText) {
        throw new Error("No content generated");
      }
      
      return generatedText;
    } catch (error) {
      console.error('Error generating content with Google AI:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GoogleAIService();