const axios = require('axios');

class GoogleAIService {
  constructor() {
    // Use the API key from environment variables
    this.API_KEY = process.env.GEMINI_API_KEY;
    if (!this.API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    this.BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateContent(prompt, language = 'en', maxTokens = 1024, allowLongContent = false) {
    try {
      // Create language-specific prompt
      let languagePrompt = prompt;
      if (language !== 'en') {
        const languageMap = {
          'es': 'Spanish',
          'fr': 'French',
          'de': 'German',
          'it': 'Italian',
          'pt': 'Portuguese',
          'ru': 'Russian',
          'zh': 'Chinese',
          'ja': 'Japanese',
          'hi': 'Hindi'
        };
        
        if (languageMap[language]) {
          languagePrompt = `Generate content in ${languageMap[language]} language. ${prompt}`;
        }
      }

      // Try different models in order of preference
        const models = [
          'models/gemini-2.0-flash-exp',  // Gemini 2.0 Flash Experimental (recommended)
          'models/gemini-2.0-pro-exp',    // Gemini 2.0 Pro Experimental
          'models/gemini-1.5-flash',      // Gemini 1.5 Flash (legacy)
          'models/gemini-1.5-pro',        // Gemini 1.5 Pro (legacy)
        ];

      for (const model of models) {
        try {
          const response = await axios.post(
            `${this.BASE_URL}/${model}:generateContent?key=${this.API_KEY}`,
            {
              contents: [{
                parts: [{
                  text: languagePrompt
                }]
              }],
              generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: allowLongContent ? Math.min(maxTokens, 2048) : Math.min(maxTokens, 1024),
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ]
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000 // 30 second timeout
            }
          );

          const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          if (generatedText) {
            // For long content, don't limit to 280 characters
            if (allowLongContent) {
              const cleanedText = generatedText.trim();
              console.log(`Successfully generated long content with ${model}, length: ${cleanedText.length}`);
              return cleanedText;
            } else {
              // Clean up the generated text (remove extra whitespace, ensure it's under 280 chars for Twitter)
              const cleanedText = generatedText.trim().replace(/\n+/g, ' ').substring(0, 280);
              console.log(`Successfully generated content with ${model}:`, cleanedText.substring(0, 100) + '...');
              return cleanedText;
            }
          }
        } catch (modelError) {
          console.error(`Error with model ${model}:`, modelError.response?.data || modelError.message);
          // If this is the last model, throw the error
          if (model === models[models.length - 1]) {
            throw modelError;
          }
          // Otherwise, try the next model
          continue;
        }
      }
      
      throw new Error("No content generated");
    } catch (error) {
      console.error('Error generating content with Google AI:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GoogleAIService();