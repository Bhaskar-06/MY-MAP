const busRoutesData = require('../data/busRoutes.json');

// Get all routes
exports.getAllRoutes = (req, res) => {
  try {
    res.json({
      success: true,
      count: busRoutesData.busRoutes.length,
      data: busRoutesData.busRoutes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find routes between origin and destination
exports.findRoutes = (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.body;
    
    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ 
        error: 'Origin and destination coordinates required' 
      });
    }
    
    const origin = { lat: parseFloat(originLat), lng: parseFloat(originLng) };
    const dest = { lat: parseFloat(destLat), lng: parseFloat(destLng) };
    
    const matchedRoutes = findMatchingRoutes(origin, dest);
    
    res.json({
      success: true,
      count: matchedRoutes.length,
      routes: matchedRoutes,
      hasDirect: matchedRoutes.some(r => r.type === 'direct'),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get nearby stops
exports.getNearbyStops = (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    const allStops = [];
    busRoutesData.busRoutes.forEach(route => {
      route.stops.forEach(stop => {
        const distance = calculateDistance(
          { lat: parseFloat(lat), lng: parseFloat(lng) },
          stop
        ) / 1000;
        
        if (distance <= parseFloat(radius)) {
          allStops.push({ ...stop, distance: distance.toFixed(2) });
        }
      });
    });
    
    // Deduplicate
    const unique = allStops.filter((stop, index, self) =>
      index === self.findIndex(s => s.stopId === stop.stopId)
    ).sort((a, b) => a.distance - b.distance);
    
    res.json({ success: true, stops: unique });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get routes by region
exports.getRoutesByRegion = (req, res) => {
  try {
    const { region } = req.params;
    const routes = busRoutesData.busRoutes.filter(route =>
      route.routeName.toLowerCase().includes(region.toLowerCase()) ||
      route.stops.some(stop => 
        stop.name.toLowerCase().includes(region.toLowerCase())
      )
    );
    
    res.json({ success: true, routes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new route
exports.addRoute = (req, res) => {
  try {
    // In production, this would save to database
    res.json({ 
      success: true, 
      message: 'Route submitted for review',
      id: Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
const findMatchingRoutes = (origin, destination) => {
  const results = [];
  
  busRoutesData.busRoutes.forEach(route => {
    const nearOrigin = route.stops.find(s => 
      calculateDistance(s, origin) / 1000 <= 15
    );
    const nearDest = route.stops.find(s => 
      calculateDistance(s, destination) / 1000 <= 15
    );
    
    if (nearOrigin && nearDest) {
      const originIdx = route.stops.indexOf(nearOrigin);
      const destIdx = route.stops.indexOf(nearDest);
      
      if (originIdx < destIdx) {
        results.push({
          routeId: route.routeId,
          routeName: route.routeName,
          operator: route.operator,
          type: 'direct',
          boardingStop: nearOrigin,
          alightingStop: nearDest,
          fare: route.fare,
          frequency: route.frequency,
        });
      }
    }
  });
  
  return results;
};

const calculateDistance = (p1, p2) => {
  const R = 6371000;
  const lat1 = p1.lat * Math.PI / 180;
  const lat2 = p2.lat * Math.PI / 180;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2)**2 + 
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
  
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};