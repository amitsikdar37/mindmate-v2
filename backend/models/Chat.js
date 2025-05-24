const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, enum: ['user', 'bot'], required: true }
});

module.exports = mongoose.model('Chat', ChatSchema); 