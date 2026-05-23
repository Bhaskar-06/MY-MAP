import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useMap } from '../../context/MapContext';

const createIcon = (color, label) => L.divIcon({
  html: `<div style="background:${color};color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${label}</div>`,
  className: '',
  iconAnchor: [20, 10],
});

const Markers = () => {
  const { origin, destination, selectedRoute } = useMap();

  return (
    <>
      {origin && (
        <Marker position={[origin.lat, origin.lng]} icon={createIcon('#1a73e8', '📍 Start')}>
          <Popup><b>Start:</b> {origin.name}</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={createIcon('#ea4335', '🏁 End')}>
          <Popup><b>Destination:</b> {destination.name}</Popup>
        </Marker>
      )}
      {selectedRoute?.stops?.map((stop, i) => (
        <Marker key={i} position={[stop.lat, stop.lng]} icon={createIcon('#9c27b0', `🚏 ${stop.name}`)}>
          <Popup>
            <b>{stop.name}</b><br/>
            {stop.departureTime && `Departs: ${stop.departureTime}`}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;