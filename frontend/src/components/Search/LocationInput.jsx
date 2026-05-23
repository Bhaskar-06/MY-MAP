import React, { useState, useRef } from 'react';
import { searchLocation } from '../../services/mapService';

const LocationInput = ({ placeholder, value, onSelect, isOrigin }) => {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length > 2) {
      debounceRef.current = setTimeout(async () => {
        const res = await searchLocation(val);
        setResults(res);
        setShowResults(true);
      }, 500);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (loc) => {
    setQuery(loc.name);
    setShowResults(false);
    onSelect(loc);
  };

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        name: 'My Location',
        fullName: 'Current Location',
      };
      setQuery('My Location');
      onSelect(loc);
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isOrigin ? 'bg-blue-500' : 'bg-red-500'}`} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {isOrigin && !query && (
          <button onClick={handleMyLocation} className="text-blue-500 text-xs">📍</button>
        )}
        {query && (
          <button onClick={() => { setQuery(''); onSelect(null); }} className="text-gray-400 text-xs">✕</button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border z-50 max-h-48 overflow-y-auto">
          {results.map(r => (
            <button key={r.id} onClick={() => handleSelect(r)}
              className="w-full flex items-start gap-2 px-4 py-2 hover:bg-blue-50 text-left border-b last:border-0">
              <span className="text-red-500 mt-0.5">📍</span>
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-gray-400 truncate">{r.fullName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;