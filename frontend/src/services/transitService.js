import transitData from '../data/transitData.json';
import { formatDistance } from './routeService';

export const calculateDistance = (point1, point2) => {
  const R = 6371000;
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const findTransitRoutes = async (origin, destination) => {
  const routes = [];

  transitData.busRoutes.forEach(route => {
    const nearOrigin = route.stops.find(s =>
      calculateDistance(s, origin) / 1000 <= 20
    );
    const nearDest = route.stops.find(s =>
      calculateDistance(s, destination) / 1000 <= 20
    );

    if (nearOrigin && nearDest) {
      const originIdx = route.stops.indexOf(nearOrigin);
      const destIdx = route.stops.indexOf(nearDest);

      if (originIdx < destIdx) {
        const relevantStops = route.stops.slice(originIdx, destIdx + 1);
        const walkToStop = calculateDistance(origin, nearOrigin);
        const walkFromStop = calculateDistance(destination, nearDest);

        const steps = [];

        if (walkToStop > 100) {
          steps.push({
            type: 'walk',
            icon: '🚶',
            instruction: `Walk ${formatDistance(walkToStop)} to ${nearOrigin.name}`,
            distance: walkToStop,
            duration: walkToStop / 1.2,
          });
        }

        steps.push({
          type: 'bus',
          icon: '🚌',
          instruction: `Take ${route.operator} bus - ${route.routeName}`,
          busNumber: route.routeId,
          from: nearOrigin.name,
          to: nearDest.name,
          departure: nearOrigin.departureTime,
          arrival: nearDest.arrivalTime,
          fare: route.fare,
          frequency: route.frequency,
          intermediateStops: relevantStops.slice(1, -1).map(s => s.name),
          stops: relevantStops,
        });

        if (walkFromStop > 100) {
          steps.push({
            type: 'walk',
            icon: '🚶',
            instruction: `Walk ${formatDistance(walkFromStop)} to destination`,
            distance: walkFromStop,
            duration: walkFromStop / 1.2,
          });
        }

        routes.push({
          mode: 'transit',
          routeId: route.routeId,
          routeName: route.routeName,
          operator: route.operator,
          type: 'direct',
          duration: 5400,
          geometry: [
            [origin.lat, origin.lng],
            ...relevantStops.map(s => [s.lat, s.lng]),
            [destination.lat, destination.lng],
          ],
          steps,
          stops: relevantStops,
          fare: route.fare,
          frequency: route.frequency,
          summary: `Bus via ${nearOrigin.name}`,
        });
      }
    }
  });

  if (routes.length === 0) {
    routes.push({
      mode: 'transit',
      type: 'fallback',
      duration: 7200,
      geometry: [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ],
      steps: [
        {
          type: 'bus',
          icon: '🚌',
          instruction: 'Go to nearest bus stand',
          tips: [
            'Check KSRTC website: ksrtc.in',
            'Call KSRTC helpline: 1800-425-1900',
            'Ask locals for bus timings',
          ]
        }
      ],
      summary: 'Suggested transit route',
      isEstimated: true,
    });
  }

  return routes;
};