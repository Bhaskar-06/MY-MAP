import React, { createContext, useContext, useState, useCallback } from 'react';

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedMode, setSelectedMode] = useState('transit');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [mapZoom, setMapZoom] = useState(5);
  const [showPanel, setShowPanel] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setSelectedRoute(null);
    setShowPanel(false);
    setError(null);
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
      showPanel, setShowPanel,
      error, setError,
      userLocation, setUserLocation,
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