import React from 'react';
import { Polyline } from 'react-leaflet';
import { useMap } from '../../context/MapContext';

const RouteLayer = () => {
  const { routes, selectedRoute } = useMap();
  
  const getRouteStyle = (route, isSelected) => {
    const styles = {
      car: {
        color: isSelected ? '#1a73e8' : '#90caf9',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: null,
      },
      walk: {
        color: isSelected ? '#34a853' : '#a5d6a7',
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: '10, 8',
      },
      transit: {
        color: isSelected ? '#9c27b0' : '#ce93d8',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: null,
      },
    };
    
    return styles[route.mode] || styles.transit;
  };

  return (
    <>
      {/* Background routes (not selected) */}
      {routes
        .filter(r => r !== selectedRoute && r.geometry?.length > 1)
        .map((route, idx) => (
          <Polyline
            key={`bg-route-${idx}`}
            positions={route.geometry}
            pathOptions={getRouteStyle(route, false)}
          />
        ))
      }
      
      {/* Selected route (on top) */}
      {selectedRoute?.geometry?.length > 1 && (
        <Polyline
          positions={selectedRoute.geometry}
          pathOptions={getRouteStyle(selectedRoute, true)}
        />
      )}
    </>
  );
};

export default RouteLayer;