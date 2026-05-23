const express = require('express');
const router = express.Router();
const axios = require('axios');

// Search locations
router.get('/locations', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${q}, Karnataka, India`,
        format: 'json',
        addressdetails: 1,
        limit: 8,
        countrycodes: 'in',
      },
      headers: {
        'User-Agent': 'TransitMapApp/1.0',
        'Accept-Language': 'en',
      }
    });
    
    const results = response.data.map(item => ({
      id: item.place_id,
      name: item.display_name.split(',')[0],
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;