import axios from 'axios';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';

// Search for locations using Nominatim
export const searchLocation = async (query) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE}/search`, {
      params: {
        q: `${query}, Karnataka, India`,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        countrycodes: 'in',
      },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'TransitMapApp/1.0',
      }
    });
    
    return response.data.map(item => ({
      id: item.place_id,
      name: item.display_name.split(',')[0],
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
      },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'TransitMapApp/1.0',
      }
    });
    
    return {
      name: response.data.display_name.split(',')[0],
      fullName: response.data.display_name,
      lat,
      lng,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Get bus stops near a location using Overpass API
export const getNearbyBusStops = async (lat, lng, radius = 5000) => {
  const query = `
    [out:json][timeout:25];
    (
      node["highway"="bus_stop"](around:${radius},${lat},${lng});
      node["amenity"="bus_station"](around:${radius},${lat},${lng});
      relation["route"="bus"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;
  
  try {
    const response = await axios.post(OVERPASS_BASE, query, {
      headers: { 'Content-Type': 'text/plain' }
    });
    
    return response.data.elements
      .filter(el => el.type === 'node')
      .map(el => ({
        id: el.id,
        name: el.tags?.name || el.tags?.['name:en'] || 'Bus Stop',
        lat: el.lat,
        lng: el.lon,
        operator: el.tags?.operator || 'Local',
        routes: el.tags?.route_ref || '',
      }));
  } catch (error) {
    console.error('Overpass API error:', error);
    return [];
  }
};