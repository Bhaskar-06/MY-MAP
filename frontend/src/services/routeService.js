import axios from 'axios';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
};

export const formatDistance = (meters) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

export const getDrivingRoute = async (origin, destination) => {
  try {
    const url = `${OSRM_BASE}/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const response = await axios.get(url, {
      params: { overview: 'full', geometries: 'geojson', steps: true }
    });

    if (response.data.code !== 'Ok') return null;
    const route = response.data.routes[0];

    return {
      mode: 'car',
      duration: route.duration,
      distance: route.distance,
      geometry: route.geometry.coordinates.map(c => [c[1], c[0]]),
      steps: route.legs[0].steps.map(step => ({
        instruction: step.name ? `Continue on ${step.name}` : 'Continue',
        distance: step.distance,
        duration: step.duration,
      })),
      summary: `${formatDuration(route.duration)} • ${formatDistance(route.distance)}`,
    };
  } catch (error) {
    console.error('Driving route error:', error);
    return null;
  }
};

export const getWalkingRoute = async (origin, destination) => {
  try {
    const url = `${OSRM_BASE}/foot/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const response = await axios.get(url, {
      params: { overview: 'full', geometries: 'geojson', steps: true }
    });

    if (response.data.code !== 'Ok') return null;
    const route = response.data.routes[0];

    return {
      mode: 'walk',
      duration: route.duration,
      distance: route.distance,
      geometry: route.geometry.coordinates.map(c => [c[1], c[0]]),
      steps: route.legs[0].steps.map(step => ({
        instruction: step.name ? `Walk along ${step.name}` : 'Continue walking',
        distance: step.distance,
        duration: step.duration,
      })),
      summary: `${formatDuration(route.duration)} • ${formatDistance(route.distance)}`,
    };
  } catch (error) {
    console.error('Walking route error:', error);
    return null;
  }
};