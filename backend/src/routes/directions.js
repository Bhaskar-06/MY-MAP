const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Get directions
router.post('/route', routeController.getDirections);

// Get multi-mode directions
router.post('/multimode', routeController.getMultiModeDirections);

module.exports = router;