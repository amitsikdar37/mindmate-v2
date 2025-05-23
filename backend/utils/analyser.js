const express = require('express');
require('dotenv').config

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyseYouTubeEmotion = async (videoTitles) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
  Analyze the emotional state of a user based on the YouTube videos they watched:
  
  ${videoTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')}
  
  Respond with:
  - Primary emotion: (happy/sad/depressed/neutral)
  - Confidence score out of 100
  - Short reasoning
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}


