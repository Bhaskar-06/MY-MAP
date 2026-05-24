import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { useMap } from '../../context/MapContext';

const RouteLayer = () => {
  const { routes, selectedRoute, setSelectedRoute } = useMap();

  // Route style definitions
  const getRouteStyle = (route, isSelected) => {
    const styles = {
      transit: {
        color: isSelected ? '#9c27b0' : '#ce93d8',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: null,
        lineCap: 'round',
        lineJoin: 'round',
      },
      bus: {
        color: isSelected ? '#7b1fa2' : '#ba68c8',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.9 : 0.3,
        dashArray: null,
      },
      train: {
        color: isSelected ? '#c62828' : '#ef9a9a',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.9 : 0.3,
        dashArray: '12, 4',
      },
      car: {
        color: isSelected ? '#1565c0' : '#64b5f6',
        weight: isSelected ? 7 : 4,
        opacity: isSelected ? 1 : 0.5,
        dashArray: null,
        lineCap: 'round',
        lineJoin: 'round',
      },
      bike: {
        color: isSelected ? '#e65100' : '#ffb74d',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 1 : 0.5,
        dashArray: null,
        lineCap: 'round',
      },
      walk: {
        color: isSelected ? '#2e7d32' : '#81c784',
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: '8, 8',
      },
      cab: {
        color: isSelected ? '#f57f17' : '#ffd54f',
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 0.9 : 0.4,
      },
    };

    const mode = route.subMode || route.mode;
    return styles[mode] || styles.transit;
  };

  // Filter routes with valid geometry
  const validRoutes = routes.filter(r =>
    r.geometry && Array.isArray(r.geometry) && r.geometry.length >= 2
  );

  return (
    <>
      {/* Draw non-selected routes first (behind) */}
      {validRoutes
        .filter(r => r !== selectedRoute)
        .map((route, i) => (
          <Polyline
            key={`bg-${i}-${route.mode}`}
            positions={route.geometry}
            pathOptions={getRouteStyle(route, false)}
            eventHandlers={{
              click: () => setSelectedRoute(route),
            }}
          >
            <Tooltip sticky>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>
                {route.title} • {route.summary}
              </span>
            </Tooltip>
          </Polyline>
        ))
      }

      {/* Draw selected route on top */}
      {selectedRoute?.geometry?.length >= 2 && (
        <>
          {/* Shadow/outline effect */}
          <Polyline
            positions={selectedRoute.geometry}
            pathOptions={{
              ...getRouteStyle(selectedRoute, true),
              color: 'rgba(0,0,0,0.2)',
              weight: (getRouteStyle(selectedRoute, true).weight || 6) + 4,
              opacity: 0.3,
            }}
          />
          {/* Main route line */}
          <Polyline
            positions={selectedRoute.geometry}
            pathOptions={getRouteStyle(selectedRoute, true)}
          >
            <Tooltip permanent={false} sticky>
              <div style={{ fontSize: '12px' }}>
                <strong>{selectedRoute.title}</strong><br/>
                {selectedRoute.summary}
              </div>
            </Tooltip>
          </Polyline>
        </>
      )}
    </>
  );
};

export default RouteLayer;