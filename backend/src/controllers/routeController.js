const axios = require('axios');

exports.getDirections = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, mode } = req.body;

    const profile = mode === 'walk' ? 'foot' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${originLng},${originLat};${destLng},${destLat}`;

    const response = await axios.get(url, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: true,
      }
    });

    res.json({
      success: true,
      data: response.data.routes[0],
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMultiModeDirections = async (req, res) => {
  try {
    res.json({ success: true, message: 'Multi-mode directions' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};