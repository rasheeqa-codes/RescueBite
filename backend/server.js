const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const requestRoutes = require('./routes/requestRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded food images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Authentication Routes
app.use('/api/auth', authRoutes);
// Donation Routes
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/locations', locationRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to RescueBite Backend!');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RescueBite API is running successfully!'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`RescueBite server running on port ${PORT}`);
  });
};

startServer();