import React, { createContext, useContext, useState, useCallback } from 'react';

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedMode, setSelectedMode] = useState('transit');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.2958, 76.6394]); // Mysuru
  const [mapZoom, setMapZoom] = useState(10);
  const [busStops, setBusStops] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setSelectedRoute(null);
  }, []);

  const value = {
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
    searchResults, setSearchResults,
    clearRoutes,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within MapProvider');
  }
  return context;
};