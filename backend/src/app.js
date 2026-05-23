const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - TEST THIS FIRST
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TransitMap API is running!',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TransitMap API running',
    version: '1.0.0'
  });
});

// Routes - Load safely with try/catch
try {
  const transitRoutes = require('./routes/transit');
  app.use('/api/transit', transitRoutes);
  console.log('✅ Transit routes loaded');
} catch (e) {
  console.error('❌ Transit routes failed:', e.message);
}

try {
  const directionsRoutes = require('./routes/directions');
  app.use('/api/directions', directionsRoutes);
  console.log('✅ Directions routes loaded');
} catch (e) {
  console.error('❌ Directions routes failed:', e.message);
}

try {
  const searchRoutes = require('./routes/search');
  app.use('/api/search', searchRoutes);
  console.log('✅ Search routes loaded');
} catch (e) {
  console.error('❌ Search routes failed:', e.message);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚌 TransitMap API running on port ${PORT}`);
});

module.exports = app;