import axios from 'axios';

const NOMINATIM = 'https://nominatim.openstreetmap.org';

export const searchLocation = async (query) => {
  try {
    const response = await axios.get(`${NOMINATIM}/search`, {
      params: {
        q: `${query}, India`,
        format: 'json',
        addressdetails: 1,
        limit: 6,
        countrycodes: 'in',
      },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'TransitMapIndia/1.0 contact@transitmap.in',
      }
    });

    return response.data.map(item => ({
      id: item.place_id,
      name: item.display_name.split(',')[0].trim(),
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      importance: item.importance,
    })).sort((a, b) => b.importance - a.importance);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`${NOMINATIM}/reverse`, {
      params: { lat, lon: lng, format: 'json' },
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'TransitMapIndia/1.0',
      }
    });
    return {
      name: response.data.display_name?.split(',')[0] || 'My Location',
      fullName: response.data.display_name,
      lat, lng,
    };
  } catch {
    return { name: 'My Location', fullName: 'Current Location', lat, lng };
  }
};

export const getNearbyBusStops = async () => [];