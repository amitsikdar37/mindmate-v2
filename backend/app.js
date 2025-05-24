const express =  require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const analyseRouter = require('./routers/analyzeRouter');
const chatRouter = require('./routers/chatRouter');

const app = express();

// --- MongoDB Connection ---
const MONGO_URI = 'mongodb+srv://anshuman:bytewise@cluster0.buzrufy.mongodb.net/';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Add body parser middleware
app.use(express.json());

app.use(analyseRouter);
app.use(chatRouter);

// --- Chat Router (to be added) ---
// const chatRouter = require('./routers/chatRouter');
// app.use(chatRouter);

const isProduction = process.env.NODE_ENV === 'production';

const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server Is Running At ${PORT}`)
});