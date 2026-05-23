const express = require('express');
const router = express.Router();
const transitController = require('../controllers/transitController');

// Get all bus routes
router.get('/routes', transitController.getAllRoutes);

// Find routes between two points
router.post('/find', transitController.findRoutes);

// Get routes by region
router.get('/routes/:region', transitController.getRoutesByRegion);

// Get bus stops near coordinates
router.get('/stops', transitController.getNearbyStops);

// Add new route (for admin/contribution)
router.post('/routes', transitController.addRoute);

module.exports = router;