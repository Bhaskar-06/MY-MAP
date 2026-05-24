import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useMap } from '../../context/MapContext';

const createPinIcon = (color, emoji, label) => L.divIcon({
  html: `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: auto;
    ">
      <div style="
        background: ${color};
        color: white;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg)">${emoji}</span>
      </div>
      <div style="
        background: ${color};
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        white-space: nowrap;
        margin-top: 2px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        font-family: sans-serif;
      ">${label}</div>
    </div>
  `,
  className: '',
  iconSize: [80, 55],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

const createStopIcon = (color) => L.divIcon({
  html: `
    <div style="
      width: 14px; height: 14px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Direction arrow markers
const createArrowIcon = () => L.divIcon({
  html: `<div style="
    color: #1565c0; font-size: 16px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  ">▶</div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const Markers = () => {
  const { origin, destination, selectedRoute } = useMap();

  const originIcon = createPinIcon('#1d4ed8', '📍', 'START');
  const destIcon = createPinIcon('#dc2626', '🏁', 'END');

  // Get intermediate waypoints for car/bike routes
  const getWaypoints = () => {
    if (!selectedRoute?.geometry) return [];
    const geo = selectedRoute.geometry;
    if (geo.length < 10) return [];

    // Show waypoints every ~20% of route
    const step = Math.floor(geo.length / 5);
    const points = [];
    for (let i = step; i < geo.length - step; i += step) {
      points.push(geo[i]);
    }
    return points;
  };

  return (
    <>
      {/* Origin Marker */}
      {origin && (
        <Marker
          position={[origin.lat, origin.lng]}
          icon={originIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <div style={{ fontFamily: 'sans-serif', minWidth: '150px' }}>
              <div style={{
                background: '#1d4ed8', color: 'white',
                padding: '8px 12px', borderRadius: '8px 8px 0 0',
                fontWeight: '700', fontSize: '13px'
              }}>📍 Starting Point</div>
              <div style={{ padding: '8px 12px' }}>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  {origin.name}
                </div>
                {origin.fullName && origin.fullName !== origin.name && (
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    {origin.fullName.substring(0, 60)}...
                  </div>
                )}
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>
                  📌 {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker
          position={[destination.lat, destination.lng]}
          icon={destIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <div style={{ fontFamily: 'sans-serif', minWidth: '150px' }}>
              <div style={{
                background: '#dc2626', color: 'white',
                padding: '8px 12px', borderRadius: '8px 8px 0 0',
                fontWeight: '700', fontSize: '13px'
              }}>🏁 Destination</div>
              <div style={{ padding: '8px 12px' }}>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  {destination.name}
                </div>
                {destination.fullName && destination.fullName !== destination.name && (
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    {destination.fullName.substring(0, 60)}...
                  </div>
                )}
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>
                  📌 {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Bus/Train Stops on selected transit route */}
      {selectedRoute?.mode === 'transit' && selectedRoute?.stops?.map((stop, i) => (
        <Marker
          key={`stop-${i}`}
          position={[stop.lat, stop.lng]}
          icon={createStopIcon('#9c27b0')}
        >
          <Popup>
            <div style={{ fontFamily: 'sans-serif' }}>
              <div style={{ fontWeight: '700', color: '#7b1fa2' }}>🚏 {stop.name}</div>
              {stop.departureTime && (
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Departs: {stop.departureTime}
                </div>
              )}
              {stop.arrivalTime && (
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Arrives: {stop.arrivalTime}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;