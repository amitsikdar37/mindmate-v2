const mongoose = require('mongoose');

const YouTubeHistorySchema = new mongoose.Schema({
  access_token: { type: mongoose.Schema.Types.ObjectId, ref: 'YouTubeToken', required: true },
  raw: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('YouTubeHistory', YouTubeHistorySchema); 