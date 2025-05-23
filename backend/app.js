const express =  require('express');
require('dotenv').config();
const cors = require('cors')

const analyseRouter = require('./routers/analyzeRouter');

const app = express();

const allowedOrigins = [
  'http://localhost:5500', // local frontend
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

app.use(analyseRouter);


const isProduction = process.env.NODE_ENV === 'production';

const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server Is Running At ${PORT}`)
});