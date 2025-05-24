const express = require('express');
const { analyzeYoutubeHistory, handleYouTubeToken } = require('../controllers/analyze');

const analyzeRouter = express.Router();

analyzeRouter.post('/api/Analyze', analyzeYoutubeHistory);
analyzeRouter.post('/api/youtube/token', handleYouTubeToken);

// Chat endpoints will be added in a separate chatRouter for modularity

module.exports = analyzeRouter;