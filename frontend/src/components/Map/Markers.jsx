import React from 'react';
import { Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useMap } from '../../context/MapContext';

// Fix Leaflet default icon
const createIcon = (color, emoji) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        color: white;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transform: rotate(-45deg);
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg)">${emoji}</span>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const busStopIcon = L.divIcon({
  html: `
    <div style="
      background: #ff5722;
      color: white;
      border-radius: 4px;
      padding: 3px 6px;
      font-size: 10px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      white-space: nowrap;
    ">🚌 Bus Stop</div>
  `,
  className: '',
  iconAnchor: [20, 10],
});

const routeStopIcon = L.divIcon({
  html: `
    <div style="
      background: #9c27b0;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const Markers = () => {
  const { origin, destination, busStops, selectedRoute } = useMap();
  
  const originIcon = createIcon('#1a73e8', '📍');
  const destIcon = createIcon('#ea4335', '🏁');

  return (
    <>
      {/* Origin Marker */}
      {origin && (
        <Marker 
          position={[origin.lat, origin.lng]} 
          icon={originIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-blue-600">📍 Starting Point</p>
              <p className="text-gray-700">{origin.name}</p>
              {origin.fullName && (
                <p className="text-xs text-gray-500 mt-1">{origin.fullName}</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Destination Marker */}
      {destination && (
        <Marker 
          position={[destination.lat, destination.lng]} 
          icon={destIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-red-600">🏁 Destination</p>
              <p className="text-gray-700">{destination.name}</p>
              {destination.fullName && (
                <p className="text-xs text-gray-500 mt-1">{destination.fullName}</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Bus Stop Markers */}
      {busStops.slice(0, 20).map(stop => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={busStopIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-orange-600">🚌 {stop.name}</p>
              {stop.operator && (
                <p className="text-xs text-gray-600">Operator: {stop.operator}</p>
              )}
              {stop.routes && (
                <p className="text-xs text-gray-600">Routes: {stop.routes}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Route Bus Stops */}
      {selectedRoute?.stops?.map((stop, idx) => (
        <Marker
          key={`route-stop-${idx}`}
          position={[stop.lat, stop.lng]}
          icon={routeStopIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-purple-600">🚏 {stop.name}</p>
              {stop.arrivalTime && (
                <p className="text-xs text-gray-600">Arrives: {stop.arrivalTime}</p>
              )}
              {stop.departureTime && (
                <p className="text-xs text-gray-600">Departs: {stop.departureTime}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;