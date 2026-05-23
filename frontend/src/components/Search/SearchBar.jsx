import React, { useState } from 'react';
import { ArrowUpDown, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useMap } from '../../context/MapContext';
import { useRoutes } from '../../hooks/useRoutes';
import LocationInput from './LocationInput';
import TransportMode from '../Routes/TransportMode';

const SearchBar = () => {
  const { 
    origin, setOrigin, 
    destination, setDestination,
    setMapCenter, setMapZoom,
  } = useMap();
  const { fetchRoutes } = useRoutes();
  const [expanded, setExpanded] = useState(true);

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert('Please enter both origin and destination');
      return;
    }
    
    // Center map between origin and destination
    const midLat = (origin.lat + destination.lat) / 2;
    const midLng = (origin.lng + destination.lng) / 2;
    setMapCenter([midLat, midLng]);
    setMapZoom(11);
    
    await fetchRoutes();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="absolute top-14 left-2 right-2 z-40 
                    bg-white rounded-2xl shadow-xl border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h2 className="text-sm font-semibold text-gray-700">Plan Your Journey</h2>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expanded && (
        <div className="px-3 pb-3">
          {/* Location Inputs */}
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <LocationInput
                placeholder="Starting point"
                value={origin}
                onSelect={setOrigin}
                isOrigin={true}
              />
              <LocationInput
                placeholder="Where to? (e.g., T. Shettigeri)"
                value={destination}
                onSelect={setDestination}
                isOrigin={false}
              />
            </div>
            
            {/* Swap Button */}
            <button
              onClick={swapLocations}
              className="self-center p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowUpDown size={18} className="text-gray-500" />
            </button>
          </div>
          
          {/* Transport Mode Selector */}
          <TransportMode />
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!origin || !destination}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                       text-white font-semibold py-2.5 rounded-xl transition-colors 
                       flex items-center justify-center gap-2"
          >
            <Search size={16} />
            Find Routes
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;