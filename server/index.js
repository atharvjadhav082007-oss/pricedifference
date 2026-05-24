require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { startPriceScraper } = require('./jobs/priceScraper');
const { startAlertChecker } = require('./jobs/alertChecker');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/priceradar';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost origin in dev, or the configured CLIENT_URL in prod
    const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
    if (!origin || origin.startsWith('http://localhost') || origin === allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/prices', require('./routes/prices'));
app.use('/api/history', require('./routes/history'));
app.use('/api/alerts', require('./routes/alerts'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect using the environment variable you set up on Render
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ PriceRadar successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ Database connection error:', err.message));

// Render injects its own PORT variable automatically
app.listen(PORT, () => {
  console.log(`✅ Server is running smoothly on port ${PORT}`);
  // Start background jobs
  startPriceScraper();
  startAlertChecker();
});

module.exports = app;
