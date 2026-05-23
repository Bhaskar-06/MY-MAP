import { useState, useCallback } from 'react';
import { reverseGeocode } from '../services/mapService';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setLocation({
          lat: latitude,
          lng: longitude,
          name: address?.name || 'My Location',
          fullName: address?.fullName || 'Current Location',
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading, getCurrentLocation };
};