import React from 'react';
import { Polyline } from 'react-leaflet';
import { useMap } from '../../context/MapContext';

const RouteLayer = () => {
  const { routes, selectedRoute } = useMap();

  const getStyle = (route, isSelected) => {
    const base = { car: '#1a73e8', walk: '#34a853', transit: '#9c27b0' };
    return {
      color: base[route.mode] || '#666',
      weight: isSelected ? 6 : 3,
      opacity: isSelected ? 0.9 : 0.3,
      dashArray: route.mode === 'walk' ? '10,8' : null,
    };
  };

  return (
    <>
      {routes.filter(r => r !== selectedRoute && r.geometry?.length > 1).map((route, i) => (
        <Polyline key={`bg-${i}`} positions={route.geometry} pathOptions={getStyle(route, false)} />
      ))}
      {selectedRoute?.geometry?.length > 1 && (
        <Polyline positions={selectedRoute.geometry} pathOptions={getStyle(selectedRoute, true)} />
      )}
    </>
  );
};

export default RouteLayer;