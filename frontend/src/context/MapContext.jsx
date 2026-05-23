import React, { createContext, useContext, useState, useCallback } from 'react';

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedMode, setSelectedMode] = useState('transit');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.2958, 76.6394]);
  const [mapZoom, setMapZoom] = useState(10);
  const [busStops, setBusStops] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setSelectedRoute(null);
  }, []);

  return (
    <MapContext.Provider value={{
      origin, setOrigin,
      destination, setDestination,
      selectedMode, setSelectedMode,
      routes, setRoutes,
      selectedRoute, setSelectedRoute,
      isLoading, setIsLoading,
      mapCenter, setMapCenter,
      mapZoom, setMapZoom,
      busStops, setBusStops,
      showPanel, setShowPanel,
      clearRoutes,
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMap must be used within MapProvider');
  return context;
};