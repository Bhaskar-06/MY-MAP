import { useCallback } from 'react';
import { useMap } from '../context/MapContext';
import { getDrivingRoute, getWalkingRoute } from '../services/routeService';
import { generateTransitPlan, calculateDistanceKm } from '../services/indiaTransitService';

export const useRoutes = () => {
  const {
    origin, destination, selectedMode,
    setRoutes, setSelectedRoute, setIsLoading,
    setShowPanel, setError, setMapCenter, setMapZoom,
  } = useMap();

  const fetchRoutes = useCallback(async () => {
    if (!origin || !destination) return;

    setIsLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    setError(null);

    // Center map
    const midLat = (origin.lat + destination.lat) / 2;
    const midLng = (origin.lng + destination.lng) / 2;
    const distKm = calculateDistanceKm(origin, destination);
    const zoom = distKm > 500 ? 5 : distKm > 200 ? 7 : distKm > 50 ? 9 : 11;
    setMapCenter([midLat, midLng]);
    setMapZoom(zoom);

    try {
      const allRoutes = [];

      // Always get transit routes (our specialty!)
      if (selectedMode === 'transit' || selectedMode === 'all') {
        const transitPlans = generateTransitPlan(origin, destination);
        allRoutes.push(...transitPlans);
      }

      // Get driving route
      if (selectedMode === 'car' || selectedMode === 'all') {
        const carRoute = await getDrivingRoute(origin, destination);
        if (carRoute) allRoutes.push(carRoute);
      }

      // Get walking route (only if short distance)
      if ((selectedMode === 'walk' || selectedMode === 'all') && distKm < 20) {
        const walkRoute = await getWalkingRoute(origin, destination);
        if (walkRoute) allRoutes.push(walkRoute);
      }

      setRoutes(allRoutes);
      if (allRoutes.length > 0) {
        setSelectedRoute(allRoutes[0]);
        setShowPanel(true);
      }
    } catch (error) {
      setError('Could not fetch routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, selectedMode]);

  return { fetchRoutes };
};