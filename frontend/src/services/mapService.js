import axios from 'axios';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

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
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE}/reverse`, {
      params: { lat, lon: lng, format: 'json' },
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
    return null;
  }
};

export const getNearbyBusStops = async (lat, lng) => {
  return [];
};