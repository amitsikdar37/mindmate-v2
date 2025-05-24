const express = require('express');
const Chat = require('../models/Chat');

const chatRouter = express.Router();

// POST /api/chat/send
chatRouter.post('/api/chat/send', async (req, res) => {
  try {
    const { userId, message, sender } = req.body;
    if (!userId || !message || !sender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const chat = await Chat.create({
      userId,
      message,
      sender,
      timestamp: new Date()
    });
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

// GET /api/chat/history/:userId
chatRouter.get('/api/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ timestamp: 1 });
    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history', details: err.message });
  }
});

module.exports = chatRouter; 