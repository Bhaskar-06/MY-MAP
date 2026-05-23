import transitData from '../data/transitData.json';
import { formatDuration, formatDistance } from './routeService';

// Find bus routes between two locations
export const findTransitRoutes = async (origin, destination) => {
  const routes = [];
  
  // Search through our local transit database
  const matchedRoutes = findMatchingRoutes(origin, destination);
  
  if (matchedRoutes.length > 0) {
    routes.push(...matchedRoutes);
  }
  
  // If no direct routes, find connecting routes
  if (routes.length === 0) {
    const connectingRoutes = findConnectingRoutes(origin, destination);
    if (connectingRoutes) {
      routes.push(connectingRoutes);
    }
  }
  
  // Always add a fallback route with general guidance
  if (routes.length === 0) {
    routes.push(generateFallbackRoute(origin, destination));
  }
  
  return routes;
};

// Find direct bus routes
const findMatchingRoutes = (origin, destination) => {
  const results = [];
  
  transitData.busRoutes.forEach(route => {
    const hasOriginArea = route.stops.some(stop => 
      isNearLocation(stop, origin, 15) // 15km radius
    );
    const hasDestArea = route.stops.some(stop => 
      isNearLocation(stop, destination, 15)
    );
    
    if (hasOriginArea && hasDestArea) {
      const originStop = findNearestStop(route.stops, origin);
      const destStop = findNearestStop(route.stops, destination);
      
      // Ensure we're going in right direction
      const originIdx = route.stops.indexOf(originStop);
      const destIdx = route.stops.indexOf(destStop);
      
      if (originIdx < destIdx) {
        results.push(formatTransitRoute(route, originStop, destStop, origin, destination));
      }
    }
  });
  
  return results;
};

// Format transit route for display
const formatTransitRoute = (route, originStop, destStop, userOrigin, userDest) => {
  const relevantStops = route.stops.slice(
    route.stops.indexOf(originStop),
    route.stops.indexOf(destStop) + 1
  );
  
  // Calculate walk distances
  const walkToStop = calculateDistance(userOrigin, originStop);
  const walkFromStop = calculateDistance(userDest, destStop);
  
  const steps = [];
  
  // Walk to first stop
  if (walkToStop > 100) {
    steps.push({
      type: 'walk',
      icon: '🚶',
      instruction: `Walk ${formatDistance(walkToStop)} to ${originStop.name}`,
      duration: walkToStop / 1.2, // Average walking speed
      distance: walkToStop,
    });
  }
  
  // Bus journey
  steps.push({
    type: 'bus',
    icon: '🚌',
    instruction: `Take ${route.operator} bus - ${route.routeName}`,
    busNumber: route.routeId,
    from: originStop.name,
    to: destStop.name,
    departure: originStop.departureTime,
    arrival: destStop.arrivalTime,
    stops: relevantStops,
    fare: route.fare,
    frequency: route.frequency,
    intermediateStops: relevantStops.slice(1, -1).map(s => s.name),
  });
  
  // Walk from last stop
  if (walkFromStop > 100) {
    steps.push({
      type: 'walk',
      icon: '🚶',
      instruction: `Walk ${formatDistance(walkFromStop)} to destination`,
      duration: walkFromStop / 1.2,
      distance: walkFromStop,
    });
  }
  
  // Calculate geometry (path through all stops)
  const geometry = relevantStops.map(stop => [stop.lat, stop.lng]);
  
  // Add user origin and destination
  geometry.unshift([userOrigin.lat, userOrigin.lng]);
  geometry.push([userDest.lat, userDest.lng]);
  
  return {
    mode: 'transit',
    routeId: route.routeId,
    routeName: route.routeName,
    operator: route.operator,
    type: 'direct',
    duration: estimateTotalDuration(originStop, destStop, walkToStop, walkFromStop),
    geometry,
    steps,
    stops: relevantStops,
    fare: route.fare,
    frequency: route.frequency,
    firstService: route.firstBus,
    lastService: route.lastBus,
    summary: `Bus via ${originStop.name}`,
  };
};

// Find connecting routes (with transfer)
const findConnectingRoutes = (origin, destination) => {
  // Find all stops near origin
  const nearOriginStops = getAllNearbyStops(origin, 20);
  // Find all stops near destination  
  const nearDestStops = getAllNearbyStops(destination, 20);
  
  if (nearOriginStops.length === 0 || nearDestStops.length === 0) {
    return null;
  }
  
  const nearestOriginStop = nearOriginStops[0];
  const nearestDestStop = nearDestStops[0];
  
  const walkToStop = calculateDistance(origin, nearestOriginStop);
  const walkFromStop = calculateDistance(destination, nearestDestStop);
  
  const steps = [];
  
  // Walk to nearest bus stop
  steps.push({
    type: 'walk',
    icon: '🚶',
    instruction: `Walk ${formatDistance(walkToStop)} to ${nearestOriginStop.name}`,
    duration: walkToStop / 1.2,
    distance: walkToStop,
    subSteps: [
      'Head towards main road',
      `Look for bus stop at ${nearestOriginStop.name}`,
    ]
  });
  
  // Get bus from nearest major hub
  steps.push({
    type: 'bus',
    icon: '🚌',
    instruction: `Take any bus towards ${nearestDestStop.name || 'nearest town'}`,
    note: 'Ask conductor for route to destination',
    from: nearestOriginStop.name,
    to: nearestDestStop.name,
    frequency: 'Check local schedule',
    fare: { currency: 'INR', amount: 50, type: 'estimated' },
    intermediateStops: [],
  });
  
  // Walk to destination
  if (walkFromStop > 200) {
    steps.push({
      type: 'walk',
      icon: '🚶',
      instruction: `Walk ${formatDistance(walkFromStop)} to destination`,
      duration: walkFromStop / 1.2,
      distance: walkFromStop,
    });
  }
  
  return {
    mode: 'transit',
    type: 'suggested',
    duration: (walkToStop + walkFromStop) / 1.2 + 5400, // estimate
    geometry: [
      [origin.lat, origin.lng],
      [nearestOriginStop.lat, nearestOriginStop.lng],
      [nearestDestStop.lat, nearestDestStop.lng],
      [destination.lat, destination.lng],
    ],
    steps,
    summary: 'Suggested transit route',
    note: 'Route based on nearest bus stops. Verify times locally.',
  };
};

// Generate fallback route when no data available
const generateFallbackRoute = (origin, destination) => {
  const distance = calculateDistance(origin, destination);
  
  return {
    mode: 'transit',
    type: 'fallback',
    duration: 7200,
    distance,
    geometry: [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ],
    steps: [
      {
        type: 'info',
        icon: 'ℹ️',
        instruction: 'No direct transit data available',
        detail: 'Here are general directions to reach your destination',
      },
      {
        type: 'bus',
        icon: '🚌',
        instruction: 'Go to nearest bus stand and ask for buses towards destination',
        note: 'KSRTC buses operate in this region',
        tips: [
          'Check KSRTC website: ksrtc.in for schedules',
          'Call KSRTC helpline: 1800-425-1900',
          'Ask locals for current bus timings',
        ]
      },
      {
        type: 'local',
        icon: '🛺',
        instruction: 'Local transport options available',
        options: [
          'Auto-rickshaw from nearest town',
          'Shared jeep/tempo towards destination',
          'Taxi booking through apps',
        ]
      }
    ],
    summary: 'Alternative transport options',
    isEstimated: true,
  };
};

// Utility Functions
const isNearLocation = (stop, location, radiusKm) => {
  const dist = calculateDistance(stop, location) / 1000;
  return dist <= radiusKm;
};

const findNearestStop = (stops, location) => {
  return stops.reduce((nearest, stop) => {
    const distToStop = calculateDistance(stop, location);
    const distToNearest = calculateDistance(nearest, location);
    return distToStop < distToNearest ? stop : nearest;
  });
};

const getAllNearbyStops = (location, radiusKm) => {
  const allStops = [];
  transitData.busRoutes.forEach(route => {
    route.stops.forEach(stop => {
      if (isNearLocation(stop, location, radiusKm)) {
        allStops.push(stop);
      }
    });
  });
  
  // Remove duplicates and sort by distance
  const unique = allStops.filter((stop, index, self) =>
    index === self.findIndex(s => s.stopId === stop.stopId)
  );
  
  return unique.sort((a, b) => 
    calculateDistance(a, location) - calculateDistance(b, location)
  );
};

export const calculateDistance = (point1, point2) => {
  const R = 6371000; // Earth radius in meters
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
  const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const estimateTotalDuration = (originStop, destStop, walkToStop, walkFromStop) => {
  // Parse time strings
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60;
  };
  
  const busTime = parseTime(destStop.arrivalTime) - parseTime(originStop.departureTime);
  const walkTime = (walkToStop + walkFromStop) / 1.2;
  
  return Math.max(busTime + walkTime, 1800); // minimum 30 minutes
};