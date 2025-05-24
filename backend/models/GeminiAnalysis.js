const mongoose = require('mongoose');

const GeminiAnalysisSchema = new mongoose.Schema({
  access_token: { type: mongoose.Schema.Types.ObjectId, ref: 'YouTubeToken', required: true },
  videoTitles: [String],
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeminiAnalysis', GeminiAnalysisSchema); 