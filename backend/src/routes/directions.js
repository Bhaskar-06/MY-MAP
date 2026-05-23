const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get directions between two points
router.post('/route', async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, mode } = req.body;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({
        error: 'Missing coordinates'
      });
    }

    // Use OSRM free routing API
    const profile = mode === 'walk' ? 'foot' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${originLng},${originLat};${destLng},${destLat}`;

    const response = await axios.get(url, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: true,
      }
    });

    if (response.data.code !== 'Ok') {
      return res.status(404).json({ error: 'Route not found' });
    }

    const route = response.data.routes[0];

    res.json({
      success: true,
      mode: mode || 'driving',
      duration: route.duration,
      distance: route.distance,
      geometry: route.geometry,
      steps: route.legs[0].steps,
    });

  } catch (error) {
    console.error('Directions error:', error.message);
    res.status(500).json({ error: 'Failed to get directions' });
  }
});

// Get multi-mode directions
router.post('/multimode', async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.body;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    const modes = ['driving', 'foot'];
    const results = {};

    for (const mode of modes) {
      try {
        const url = `https://router.project-osrm.org/route/v1/${mode}/${originLng},${originLat};${destLng},${destLat}`;
        const response = await axios.get(url, {
          params: {
            overview: 'full',
            geometries: 'geojson',
            steps: true,
          }
        });

        if (response.data.code === 'Ok') {
          results[mode] = {
            duration: response.data.routes[0].duration,
            distance: response.data.routes[0].distance,
          };
        }
      } catch (e) {
        results[mode] = null;
      }
    }

    res.json({ success: true, routes: results });

  } catch (error) {
    console.error('Multimode error:', error.message);
    res.status(500).json({ error: 'Failed to get routes' });
  }
});

module.exports = router;