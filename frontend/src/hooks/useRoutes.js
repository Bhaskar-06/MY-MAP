import { useCallback } from 'react';
import { useMap } from '../context/MapContext';
import { getDrivingRoute, getWalkingRoute } from '../services/routeService';
import { findTransitRoutes } from '../services/transitService';

export const useRoutes = () => {
  const {
    origin, destination, selectedMode,
    setRoutes, setSelectedRoute, setIsLoading, setShowPanel,
  } = useMap();

  const fetchRoutes = useCallback(async () => {
    if (!origin || !destination) return;

    setIsLoading(true);
    setRoutes([]);
    setSelectedRoute(null);

    try {
      const allRoutes = [];

      if (selectedMode === 'transit' || selectedMode === 'all') {
        const transitRoutes = await findTransitRoutes(origin, destination);
        allRoutes.push(...transitRoutes);
      }

      if (selectedMode === 'car' || selectedMode === 'all') {
        const carRoute = await getDrivingRoute(origin, destination);
        if (carRoute) allRoutes.push(carRoute);
      }

      if (selectedMode === 'walk' || selectedMode === 'all') {
        const walkRoute = await getWalkingRoute(origin, destination);
        if (walkRoute) allRoutes.push(walkRoute);
      }

      setRoutes(allRoutes);
      if (allRoutes.length > 0) {
        setSelectedRoute(allRoutes[0]);
        setShowPanel(true);
      }
    } catch (error) {
      console.error('Route fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, selectedMode]);

  return { fetchRoutes };
};