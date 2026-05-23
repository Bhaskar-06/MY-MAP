import React, { useEffect } from 'react';
import { 
  MapContainer as LeafletMap, 
  TileLayer, 
  useMap as useLeafletMap,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../../context/MapContext';
import RouteLayer from './RouteLayer';
import Markers from './Markers';

// Component to sync map center from context
const MapController = () => {
  const map = useLeafletMap();
  const { mapCenter, mapZoom } = useMap();
  
  useEffect(() => {
    if (mapCenter) {
      map.flyTo(mapCenter, mapZoom, { 
        animate: true, 
        duration: 1.5 
      });
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
      attributionControl={true}
    >
      {/* Map Tiles - OpenStreetMap (Free) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      
      {/* Alternative: Satellite view */}
      {/* 
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri"
      />
      */}
      
      <ZoomControl position="bottomright" />
      <MapController />
      <RouteLayer />
      <Markers />
    </LeafletMap>
  );
};

export default MapContainer;