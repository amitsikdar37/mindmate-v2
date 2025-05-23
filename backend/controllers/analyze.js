const express = require('express');
const{ analyseYouTubeEmotion } = require('../utils/analyser');

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
