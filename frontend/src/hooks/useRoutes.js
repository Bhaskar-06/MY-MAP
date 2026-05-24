import { useCallback } from 'react';
import { useMap } from '../context/MapContext';
import { getDrivingRoute, getBikeRoute, getWalkingRoute } from '../services/routeService';
import { generateTransitPlan, calculateDistanceKm } from '../services/indiaTransitService';

export const useRoutes = () => {
  const {
    origin, destination, selectedMode,
    setRoutes, setSelectedRoute,
    setIsLoading, setShowPanel, setError,
    setMapCenter, setMapZoom,
  } = useMap();

  const fetchRoutes = useCallback(async () => {
    if (!origin || !destination) return;

    setIsLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    setError(null);

    // Center map between origin and destination
    const midLat = (origin.lat + destination.lat) / 2;
    const midLng = (origin.lng + destination.lng) / 2;
    const distKm = calculateDistanceKm(origin, destination);

    // Auto zoom based on distance
    let zoom = 12;
    if (distKm > 1000) zoom = 5;
    else if (distKm > 500) zoom = 6;
    else if (distKm > 200) zoom = 7;
    else if (distKm > 100) zoom = 8;
    else if (distKm > 50) zoom = 9;
    else if (distKm > 20) zoom = 11;

    setMapCenter([midLat, midLng]);
    setMapZoom(zoom);

    try {
      const allRoutes = [];

      // ── TRANSIT ROUTES (Bus, Train, Metro) ──
      if (selectedMode === 'transit' || selectedMode === 'all') {
        const transitPlans = generateTransitPlan(origin, destination);
        allRoutes.push(...transitPlans);
      }

      // ── CAR ROUTE ──
      if (selectedMode === 'car' || selectedMode === 'all') {
        const carRoute = await getDrivingRoute(origin, destination);
        if (carRoute) allRoutes.push(carRoute);
      }

      // ── BIKE ROUTE ──
      if (selectedMode === 'bike' || selectedMode === 'all') {
        const bikeRoute = await getBikeRoute(origin, destination);
        if (bikeRoute) allRoutes.push(bikeRoute);
      }

      // ── WALKING (only for short distances < 15km) ──
      if ((selectedMode === 'walk' || selectedMode === 'all') && distKm < 15) {
        const walkRoute = await getWalkingRoute(origin, destination);
        if (walkRoute) allRoutes.push(walkRoute);
      }

      // ── IF "ALL" MODE - get everything ──
      if (selectedMode === 'all') {
        // Make sure we have car + bike even if not explicitly selected
        const hasCar = allRoutes.some(r => r.mode === 'car');
        const hasBike = allRoutes.some(r => r.mode === 'bike');

        if (!hasCar) {
          const carRoute = await getDrivingRoute(origin, destination);
          if (carRoute) allRoutes.push(carRoute);
        }
        if (!hasBike) {
          const bikeRoute = await getBikeRoute(origin, destination);
          if (bikeRoute) allRoutes.push(bikeRoute);
        }
      }

      setRoutes(allRoutes);

      if (allRoutes.length > 0) {
        // Default select: transit first, else first route
        const defaultRoute = allRoutes.find(r => r.mode === 'transit') || allRoutes[0];
        setSelectedRoute(defaultRoute);
        setShowPanel(true);
      }

    } catch (error) {
      console.error('Route fetch error:', error);
      setError('Failed to find routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, selectedMode]);

  return { fetchRoutes };
};