const mongoose = require('mongoose');

const YouTubeTokenSchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('YouTubeToken', YouTubeTokenSchema); 