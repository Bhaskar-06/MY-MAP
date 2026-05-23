import React from 'react';
import { MapProvider } from './context/MapContext';
import MapContainer from './components/Map/MapContainer';
import SearchBar from './components/Search/SearchBar';
import RoutePanel from './components/Routes/RoutePanel';
import Navbar from './components/UI/Navbar';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { useMap } from './context/MapContext';

const AppContent = () => {
  const { isLoading } = useMap();
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Base Map Layer */}
      <MapContainer />
      
      {/* UI Overlays */}
      <Navbar />
      <SearchBar />
      <RoutePanel />
      
      {/* Loading State */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

const App = () => {
  return (
    <MapProvider>
      <AppContent />
    </MapProvider>
  );
};

export default App;