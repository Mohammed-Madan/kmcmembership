const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const memberRoutes = require('./routes/memberRoutes');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

// Configure CORS for deployment
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://kmcmembership.onrender.com', 'https://kmc-membership-frontend.onrender.com'] 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/api/members', memberRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});