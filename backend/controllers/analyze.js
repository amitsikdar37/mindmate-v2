const axios = require('axios');
const { analyseYouTubeEmotion } = require('../utils/analyser');
const YouTubeToken = require('../models/YouTubeToken');
const YouTubeHistory = require('../models/YouTubeHistory');
const GeminiAnalysis = require('../models/GeminiAnalysis');

exports.analyzeYoutubeHistory = async (req, res) => {
  const { videoTitles } = req.body;

  if (!videoTitles || !Array.isArray(videoTitles)) {
    return res.status(400).json({ error: "Missing or invalid videoTitles array" });
  }

  try {
    const analysis = await analyseYouTubeEmotion(videoTitles);
    res.json({ analysis }); // send back the Gemini response
  } catch (err) {
    res.status(500).json({ error: "Gemini analysis failed", details: err.message });
  }
};

// Receives { access_token } and fetches YouTube activity list, stores everything in MongoDB
exports.handleYouTubeToken = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) {
    return res.status(400).json({ error: "Missing access token" });
  }
  try {
    // Store the access token
    const tokenDoc = await YouTubeToken.create({ access_token });

    // Fetch YouTube activity list
    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/activities', {
      params: {
        part: 'snippet,contentDetails',
        mine: true,
        maxResults: 20
      },
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const activities = ytRes.data.items || [];
    // Store raw YouTube history
    const historyDoc = await YouTubeHistory.create({
      access_token: tokenDoc._id,
      raw: ytRes.data
    });
    // Extract video titles/descriptions
    const videoTitles = activities.map(item => item.snippet?.title || '').filter(Boolean);
    // Analyze with Gemini
    const geminiResult = await analyseYouTubeEmotion(videoTitles);
    // Store Gemini analysis
    await GeminiAnalysis.create({
      access_token: tokenDoc._id,
      videoTitles,
      result: geminiResult
    });
    res.json({ success: true, videoTitles, geminiResult });
  } catch (err) {
    console.error("Error processing YouTube token:", err?.response?.data || err);
    res.status(500).json({ error: "Failed to process YouTube token", details: err?.response?.data || err.message });
  }
};
