require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyDgVy7dCt9Cf9sy5QGYpjQuzRSQf2H2ukM';
const GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

exports.analyseYouTubeEmotion = async (videoTitles) => {
  const prompt = `
  Analyze the emotional state of a user based on the YouTube videos they watched:
  
  ${videoTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')}
  
  Respond with:
  - Primary emotion: (happy/sad/depressed/neutral)
  - Confidence score out of 100
  - Short reasoning
  `;

  try {
    const response = await axios.post(
      `${GEMINI_FLASH_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }
    );
    // The response format may vary; adjust as needed
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(response.data);
  } catch (err) {
    console.error('Gemini 2.0 Flash API error:', err?.response?.data || err.message);
    throw new Error('Gemini 2.0 Flash API error: ' + (err?.response?.data?.error?.message || err.message));
  }
};


