import axios from 'axios';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export const formatDistance = (meters) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

// ─── GET REAL ROAD ROUTE FROM OSRM ───────────────────────────
const getOSRMRoute = async (profile, origin, destination) => {
  const url = `${OSRM_BASE}/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const response = await axios.get(url, {
    params: {
      overview: 'full',
      geometries: 'geojson',
      steps: true,
      annotations: false,
    },
    timeout: 10000,
  });

  if (response.data.code !== 'Ok') return null;
  return response.data.routes[0];
};

// ─── DECODE STEPS INTO INSTRUCTIONS ──────────────────────────
const decodeSteps = (steps) => {
  return steps
    .filter(s => s.maneuver.type !== 'arrive' || steps.indexOf(s) === steps.length - 1)
    .map(step => {
      const type = step.maneuver.type;
      const modifier = step.maneuver.modifier || '';
      const name = step.name || 'unnamed road';

      let instruction = '';

      if (type === 'depart') instruction = `Start on ${name}`;
      else if (type === 'arrive') instruction = `Arrive at destination`;
      else if (type === 'turn') {
        instruction = `Turn ${modifier} onto ${name}`;
      } else if (type === 'new name') instruction = `Continue onto ${name}`;
      else if (type === 'continue') instruction = `Continue on ${name}`;
      else if (type === 'merge') instruction = `Merge onto ${name}`;
      else if (type === 'on ramp') instruction = `Take ramp onto ${name}`;
      else if (type === 'off ramp') instruction = `Take exit onto ${name}`;
      else if (type === 'fork') instruction = `Keep ${modifier} at fork onto ${name}`;
      else if (type === 'end of road') instruction = `Turn ${modifier} at end onto ${name}`;
      else if (type === 'roundabout') instruction = `Enter roundabout, take exit onto ${name}`;
      else if (type === 'rotary') instruction = `Enter rotary onto ${name}`;
      else instruction = `Continue on ${name}`;

      return {
        instruction,
        distance: step.distance,
        duration: step.duration,
        type,
        modifier,
        name,
        maneuverIcon: getManeuverIcon(type, modifier),
      };
    });
};

const getManeuverIcon = (type, modifier) => {
  if (type === 'depart') return '🚦';
  if (type === 'arrive') return '🏁';
  if (type === 'turn' && modifier === 'left') return '↰';
  if (type === 'turn' && modifier === 'right') return '↱';
  if (type === 'turn' && modifier === 'sharp left') return '↺';
  if (type === 'turn' && modifier === 'sharp right') return '↻';
  if (type === 'turn' && modifier === 'slight left') return '↖';
  if (type === 'turn' && modifier === 'slight right') return '↗';
  if (type === 'merge') return '⤵';
  if (type === 'roundabout' || type === 'rotary') return '🔄';
  if (type === 'fork') return '⑂';
  if (type === 'continue' || type === 'new name') return '⬆';
  return '➡';
};

// ─── CAR ROUTE ────────────────────────────────────────────────
export const getDrivingRoute = async (origin, destination) => {
  try {
    const route = await getOSRMRoute('driving', origin, destination);
    if (!route) return null;

    const distKm = route.distance / 1000;
    const petrolCost = Math.round(distKm * 8);   // ₹8/km approx
    const dieselCost = Math.round(distKm * 6);    // ₹6/km approx
    const tollEstimate = distKm > 100 ? Math.round(distKm * 1.5) : 0;

    const steps = decodeSteps(route.legs[0].steps);

    return {
      mode: 'car',
      subMode: 'car',
      title: '🚗 Car / Private Vehicle',
      duration: Math.round(route.duration / 60),
      durationSeconds: route.duration,
      distance: route.distance,
      distanceText: formatDistance(route.distance),
      geometry: route.geometry.coordinates.map(c => [c[1], c[0]]),
      steps: [
        {
          type: 'car',
          icon: '🚗',
          instruction: 'Drive via road route',
          detail: `Total: ${formatDistance(route.distance)} • ${formatDuration(route.duration)}`,
          duration: Math.round(route.duration / 60),
          distance: route.distance,
          turnByTurn: steps,
          costs: {
            petrol: petrolCost,
            diesel: dieselCost,
            toll: tollEstimate,
          },
          tips: [
            `Estimated fuel cost: ₹${petrolCost} (petrol) / ₹${dieselCost} (diesel)`,
            tollEstimate > 0 ? `Toll charges approx: ₹${tollEstimate}` : 'No major tolls expected',
            'Check Google Maps or Waze for live traffic',
            'Use FASTag for cashless toll payment',
            'Check fuel stations on route using Maps',
          ],
          apps: [
            { name: 'Google Maps', icon: '🗺️' },
            { name: 'Waze', icon: '🚨' },
            { name: 'OLA Maps', icon: '🟡' },
          ]
        }
      ],
      summary: `${formatDuration(route.duration)} • ${formatDistance(route.distance)} • ₹${petrolCost}+ fuel`,
      fare: petrolCost,
      reliability: 'Very High',
      bookingRequired: false,
      isRealRoute: true,
    };
  } catch (error) {
    console.error('Car route error:', error);
    return null;
  }
};

// ─── BIKE ROUTE ───────────────────────────────────────────────
export const getBikeRoute = async (origin, destination) => {
  try {
    // Use driving profile for bike (same roads)
    const route = await getOSRMRoute('driving', origin, destination);
    if (!route) return null;

    const distKm = route.distance / 1000;
    const fuelCost = Math.round(distKm * 3);  // ₹3/km for bike

    const steps = decodeSteps(route.legs[0].steps);

    return {
      mode: 'bike',
      subMode: 'bike',
      title: '🏍️ Bike / Two-Wheeler',
      duration: Math.round(route.duration / 60),
      durationSeconds: route.duration,
      distance: route.distance,
      distanceText: formatDistance(route.distance),
      geometry: route.geometry.coordinates.map(c => [c[1], c[0]]),
      steps: [
        {
          type: 'bike',
          icon: '🏍️',
          instruction: 'Ride via road route',
          detail: `Total: ${formatDistance(route.distance)} • ${formatDuration(route.duration)}`,
          duration: Math.round(route.duration / 60),
          distance: route.distance,
          turnByTurn: steps,
          costs: {
            petrol: fuelCost,
          },
          tips: [
            `Estimated fuel cost: ₹${fuelCost} (₹3/km approx)`,
            'Wear helmet - mandatory by law',
            'No tolls for two-wheelers on most highways',
            'Use Google Maps bike mode for navigation',
            'Check tyre pressure before long rides',
            distKm > 200 ? '⚠️ Long ride - plan rest stops every 100km' : '',
          ].filter(Boolean),
          bikeInfo: {
            fuelEfficiency: '40-60 km/L (avg)',
            totalFuelNeeded: `${(distKm / 50).toFixed(1)} litres`,
            estimatedCost: `₹${fuelCost}`,
            parkingCost: '₹10-50 (most places)',
          },
          apps: [
            { name: 'Google Maps', icon: '🗺️' },
            { name: 'Rapido Bike', icon: '🟠' },
          ]
        }
      ],
      summary: `${formatDuration(route.duration)} • ${formatDistance(route.distance)} • ₹${fuelCost}+ fuel`,
      fare: fuelCost,
      reliability: 'Very High',
      bookingRequired: false,
      isRealRoute: true,
    };
  } catch (error) {
    console.error('Bike route error:', error);
    return null;
  }
};

// ─── WALKING ROUTE ────────────────────────────────────────────
export const getWalkingRoute = async (origin, destination) => {
  try {
    const route = await getOSRMRoute('foot', origin, destination);
    if (!route) return null;

    const steps = decodeSteps(route.legs[0].steps);

    return {
      mode: 'walk',
      subMode: 'walk',
      title: '🚶 Walking',
      duration: Math.round(route.duration / 60),
      durationSeconds: route.duration,
      distance: route.distance,
      distanceText: formatDistance(route.distance),
      geometry: route.geometry.coordinates.map(c => [c[1], c[0]]),
      steps: [
        {
          type: 'walk',
          icon: '🚶',
          instruction: 'Walk to destination',
          detail: `${formatDistance(route.distance)} • ${formatDuration(route.duration)}`,
          duration: Math.round(route.duration / 60),
          distance: route.distance,
          turnByTurn: steps,
          tips: [
            'Carry water for long walks',
            'Use footpath/pavement where available',
          ]
        }
      ],
      summary: `${formatDuration(route.duration)} • ${formatDistance(route.distance)} • Free`,
      fare: 0,
      reliability: 'High',
      bookingRequired: false,
      isRealRoute: true,
    };
  } catch (error) {
    return null;
  }
};