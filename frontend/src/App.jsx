import React from 'react';
import { MapProvider, useMap } from './context/MapContext';
import MapContainer from './components/Map/MapContainer';
import SearchPanel from './components/Search/SearchPanel';
import RoutePanel from './components/Routes/RoutePanel';
import LoadingSpinner from './components/UI/LoadingSpinner';
import './index.css';

const AppContent = () => {
  const { isLoading } = useMap();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Layer 1: Map */}
      <MapContainer />

      {/* Layer 2: Search Panel */}
      <SearchPanel />

      {/* Layer 3: Route Results */}
      <RoutePanel />

      {/* Layer 4: Loading */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

const App = () => (
  <MapProvider>
    <AppContent />
  </MapProvider>
);

export default App;