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
      // Create language-specific prompt with strict character limit
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

      // Add very strict character limit instruction for Twitter posts
      languagePrompt += ` CRITICAL RULES: 1) Maximum 280 characters total 2) Only 2-3 lines maximum 3) No long sentences 4) Be extremely concise 5) Use short words and phrases 6) Stop generating at 270 characters to be safe. Make it punchy and engaging but VERY short.`;

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
              // Clean up the generated text and ensure it's under 280 characters STRICTLY
              let cleanedText = generatedText.trim();
              
              // Split into lines and ensure max 2-3 lines
              let lines = cleanedText.split(/\n+/).filter(line => line.trim());
              if (lines.length > 3) {
                lines = lines.slice(0, 3);
              }
              cleanedText = lines.join('\n');
              
              // Hard cut at 280 characters - no exceptions
              if (cleanedText.length > 280) {
                // Try to cut at word boundary within 280 chars
                const words = cleanedText.split(' ');
                let trimmedText = '';
                
                for (let i = 0; i < words.length; i++) {
                  const potentialText = trimmedText + (trimmedText ? ' ' : '') + words[i];
                  if (potentialText.length <= 275) { // Leave 5 chars buffer
                    trimmedText = potentialText;
                  } else {
                    break;
                  }
                }
                
                cleanedText = trimmedText || cleanedText.substring(0, 275);
              }
              
              console.log(`Successfully generated content with ${model}, length: ${cleanedText.length}`);
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