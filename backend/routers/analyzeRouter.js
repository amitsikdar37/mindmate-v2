const express = require('express');
const { analyzeYoutubeHistory } = require('../controllers/analyze');

const analyzeRouter = express.Router();

analyzeRouter.post('/api/Analyze', analyzeYoutubeHistory );

module.exports = analyzeRouter;