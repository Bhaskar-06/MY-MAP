import { useCallback } from 'react';
import { useMap } from '../context/MapContext';
import { getDrivingRoute, getWalkingRoute } from '../services/routeService';
import { findTransitRoutes } from '../services/transitService';
import { getNearbyBusStops } from '../services/mapService';

export const useRoutes = () => {
  const {
    origin, destination, selectedMode,
    setRoutes, setSelectedRoute, setIsLoading,
    setBusStops, setShowPanel,
  } = useMap();

  const fetchRoutes = useCallback(async () => {
    if (!origin || !destination) return;
    
    setIsLoading(true);
    setRoutes([]);
    setSelectedRoute(null);
    
    try {
      const routePromises = [];
      
      if (selectedMode === 'car' || selectedMode === 'all') {
        routePromises.push(getDrivingRoute(origin, destination));
      }
      
      if (selectedMode === 'walk' || selectedMode === 'all') {
        routePromises.push(getWalkingRoute(origin, destination));
      }
      
      if (selectedMode === 'transit' || selectedMode === 'all') {
        routePromises.push(findTransitRoutes(origin, destination));
        
        // Also fetch nearby bus stops
        const stops = await getNearbyBusStops(origin.lat, origin.lng);
        setBusStops(stops);
      }
      
      const results = await Promise.allSettled(routePromises);
      const validRoutes = [];
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          if (Array.isArray(result.value)) {
            validRoutes.push(...result.value);
          } else {
            validRoutes.push(result.value);
          }
        }
      });
      
      setRoutes(validRoutes);
      
      if (validRoutes.length > 0) {
        setSelectedRoute(validRoutes[0]);
        setShowPanel(true);
      }
      
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, selectedMode]);

  return { fetchRoutes };
};