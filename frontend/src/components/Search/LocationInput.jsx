import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader, Navigation } from 'lucide-react';
import { searchLocation } from '../../services/mapService';
import { useGeolocation } from '../../hooks/useGeolocation';

const LocationInput = ({ 
  placeholder, 
  value, 
  onChange, 
  onSelect, 
  isOrigin = false,
  icon 
}) => {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { getCurrentLocation, loading: geoLoading } = useGeolocation();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (value?.name) {
      setQuery(value.name);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (val.length > 2) {
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        const results = await searchLocation(val);
        setResults(results);
        setShowResults(true);
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (location) => {
    setQuery(location.name);
    setShowResults(false);
    onSelect(location);
  };

  const handleUseMyLocation = async () => {
    const location = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { default: mapService } = await import('../../services/mapService');
          const address = await mapService.reverseGeocode(
            pos.coords.latitude, 
            pos.coords.longitude
          );
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: 'My Location',
            fullName: address?.fullName || 'Current Location',
          });
        },
        () => resolve(null)
      );
    });
    
    if (location) {
      handleSelect(location);
    }
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    onSelect(null);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 
                      border border-gray-200 focus-within:border-blue-400 
                      focus-within:bg-white transition-all">
        {/* Icon */}
        <div className={`w-3 h-3 rounded-full flex-shrink-0 
          ${isOrigin ? 'bg-blue-500' : 'bg-red-500'}`} 
        />
        
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-700 
                     placeholder-gray-400 outline-none"
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        
        {/* Clear / Loading */}
        {isSearching ? (
          <Loader size={14} className="text-gray-400 animate-spin" />
        ) : query ? (
          <button onClick={clearInput}>
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        ) : isOrigin ? (
          <button 
            onClick={handleUseMyLocation}
            className="text-blue-500 hover:text-blue-700"
          >
            <Navigation size={14} />
          </button>
        ) : null}
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl 
                        shadow-lg border border-gray-100 z-50 max-h-48 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full flex items-start gap-3 px-4 py-3 
                         hover:bg-blue-50 text-left transition-colors border-b 
                         border-gray-50 last:border-0"
              onClick={() => handleSelect(result)}
            >
              <MapPin size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">{result.name}</p>
                <p className="text-xs text-gray-500 truncate">{result.fullName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;