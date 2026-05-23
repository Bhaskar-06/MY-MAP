import { useState, useEffect, useCallback } from 'react';
import { reverseGeocode } from '../services/mapService';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          setLocation({
            lat: latitude,
            lng: longitude,
            name: address?.name || 'Your Location',
            fullName: address?.fullName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        } catch {
          setLocation({
            lat: latitude,
            lng: longitude,
            name: 'Your Location',
            fullName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        }
        
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { location, error, loading, getCurrentLocation };
};