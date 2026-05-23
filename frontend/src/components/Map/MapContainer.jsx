import React, { useEffect } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  ZoomControl,
  useMap as useLeafletMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../../context/MapContext';
import RouteLayer from './RouteLayer';
import Markers from './Markers';

const MapController = () => {
  const map = useLeafletMap();
  const { mapCenter, mapZoom } = useMap();

  useEffect(() => {
    if (mapCenter) {
      map.flyTo(mapCenter, mapZoom, { animate: true, duration: 1.5 });
    }
  }, [mapCenter, mapZoom, map]);

  return null;
};

const MapContainer = () => {
  const { mapCenter, mapZoom } = useMap();

  return (
    <LeafletMap
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <MapController />
      <RouteLayer />
      <Markers />
    </LeafletMap>
  );
};

export default MapContainer;