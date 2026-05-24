import React, { useState, useRef, useEffect } from 'react';
import { useMap } from '../../context/MapContext';
import { useRoutes } from '../../hooks/useRoutes';
import { searchLocation } from '../../services/mapService';

// Location search input component
const LocationInput = ({ label, value, onSelect, placeholder, dotColor }) => {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value?.name) setQuery(value.name);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length >= 2) {
      setSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await searchLocation(val);
          setResults(res);
          setShowDropdown(res.length > 0);
        } catch (e) {
          console.error(e);
        } finally {
          setSearching(false);
        }
      }, 400);
    } else {
      setResults([]);
      setShowDropdown(false);
      setSearching(false);
    }
  };

  const handleSelect = (location) => {
    setQuery(location.name);
    setShowDropdown(false);
    setResults([]);
    onSelect(location);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    setQuery('Getting location...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'User-Agent': 'TransitMapIndia/1.0' } }
          );
          const data = await res.json();
          const name = data.display_name?.split(',')[0] || 'My Location';
          const location = { lat, lng, name, fullName: data.display_name };
          setQuery(name);
          onSelect(location);
        } catch {
          const location = { lat, lng, name: 'My Location', fullName: 'Current Location' };
          setQuery('My Location');
          onSelect(location);
        }
      },
      () => setQuery('')
    );
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onSelect(null);
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative', marginBottom: '8px' }}>
      {/* Label */}
      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600',
                    marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>

      {/* Input Box */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#f9fafb', borderRadius: '12px',
        padding: '10px 12px', border: '1.5px solid #e5e7eb',
        transition: 'border-color 0.2s'
      }}>
        {/* Dot */}
        <div style={{
          width: '12px', height: '12px', borderRadius: '50%',
          background: dotColor, flexShrink: 0,
          boxShadow: `0 0 0 3px ${dotColor}30`
        }} />

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          style={{
            flex: 1, background: 'transparent', border: 'none',
            outline: 'none', fontSize: '14px', color: '#1f2937',
            fontFamily: 'inherit'
          }}
        />

        {/* Right Icons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {searching && (
            <div style={{
              width: '16px', height: '16px', border: '2px solid #e5e7eb',
              borderTopColor: '#3b82f6', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          )}
          {query && !searching && (
            <button onClick={clearInput} style={{
              background: '#e5e7eb', border: 'none', borderRadius: '50%',
              width: '20px', height: '20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#6b7280'
            }}>✕</button>
          )}
          {!query && label === 'FROM' && (
            <button onClick={handleMyLocation} style={{
              background: '#dbeafe', border: 'none', borderRadius: '8px',
              padding: '4px 8px', cursor: 'pointer',
              fontSize: '11px', color: '#2563eb', fontWeight: '600'
            }}>📍 Me</button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div ref={dropdownRef} style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', borderRadius: '12px', marginTop: '4px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          zIndex: 99999, maxHeight: '220px', overflowY: 'auto',
          border: '1px solid #e5e7eb'
        }}>
          {results.map((result, i) => (
            <button key={result.id || i} onClick={() => handleSelect(result)}
              style={{
                width: '100%', display: 'flex', alignItems: 'flex-start',
                gap: '10px', padding: '10px 14px', background: 'transparent',
                border: 'none', borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '16px', marginTop: '2px' }}>📍</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                  {result.name}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px',
                              maxWidth: '280px', overflow: 'hidden',
                              textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {result.fullName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Transport Mode Button
const ModeButton = ({ mode, icon, label, isSelected, onClick, color }) => (
  <button onClick={onClick} style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '4px', padding: '8px 4px', borderRadius: '12px', cursor: 'pointer',
    border: `2px solid ${isSelected ? color : '#e5e7eb'}`,
    background: isSelected ? `${color}15` : 'white',
    transition: 'all 0.2s'
  }}>
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <span style={{
      fontSize: '10px', fontWeight: '600',
      color: isSelected ? color : '#9ca3af'
    }}>{label}</span>
  </button>
);

// Main Search Panel
const SearchPanel = () => {
  const {
    origin, setOrigin,
    destination, setDestination,
    selectedMode, setSelectedMode,
    clearRoutes
  } = useMap();
  const { fetchRoutes } = useRoutes();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    clearRoutes();
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert('⚠️ Please enter both From and To locations');
      return;
    }
    setIsSearching(true);
    await fetchRoutes();
    setIsSearching(false);
    setIsMinimized(true);
  };

  const modes = [
    { id: 'transit', icon: '🚌', label: 'Transit', color: '#9c27b0' },
    { id: 'train', icon: '🚂', label: 'Train', color: '#f44336' },
    { id: 'car', icon: '🚗', label: 'Drive', color: '#2196f3' },
    { id: 'walk', icon: '🚶', label: 'Walk', color: '#4caf50' },
    { id: 'all', icon: '🗺️', label: 'All', color: '#ff9800' },
  ];

  return (
    <>
      {/* TOP NAVBAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000, background: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        {/* Logo */}
        <div style={{
          width: '38px', height: '38px',
          background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
          borderRadius: '10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0
        }}>🚌</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>
            TransitMap India
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>
            Public Transport • Every Destination
          </div>
        </div>

        <div style={{
          background: '#dcfce7', color: '#16a34a',
          padding: '4px 10px', borderRadius: '20px',
          fontSize: '11px', fontWeight: '700'
        }}>🇮🇳 All India</div>
      </div>

      {/* SEARCH PANEL */}
      <div style={{
        position: 'fixed',
        top: isMinimized ? '-10px' : '65px',
        left: '10px', right: '10px',
        zIndex: 999,
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        padding: isMinimized ? '0' : '16px',
        transition: 'all 0.3s ease',
        maxHeight: isMinimized ? '0' : '500px',
        overflow: isMinimized ? 'hidden' : 'visible',
        opacity: isMinimized ? 0 : 1,
      }}>
        {/* FROM Input */}
        <LocationInput
          label="FROM"
          value={origin}
          onSelect={setOrigin}
          placeholder="Enter starting location..."
          dotColor="#2563eb"
        />

        {/* Swap button + connector */}
        <div style={{
          display: 'flex', alignItems: 'center',
          margin: '4px 0', paddingLeft: '8px'
        }}>
          <div style={{
            width: '1px', height: '20px',
            background: 'linear-gradient(to bottom, #2563eb, #dc2626)',
            marginLeft: '5px', marginRight: '14px'
          }} />
          <button onClick={handleSwap} style={{
            background: '#f3f4f6', border: '1px solid #e5e7eb',
            borderRadius: '8px', padding: '4px 10px',
            cursor: 'pointer', fontSize: '14px',
            color: '#6b7280', transition: 'all 0.2s'
          }}>⇅ Swap</button>
        </div>

        {/* TO Input */}
        <LocationInput
          label="TO"
          value={destination}
          onSelect={setDestination}
          placeholder="Where to? (e.g. T. Shettigeri, Mysuru)"
          dotColor="#dc2626"
        />

        {/* Divider */}
        <div style={{ height: '1px', background: '#f3f4f6', margin: '12px 0' }} />

        {/* Transport Mode Selection */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280',
                        marginBottom: '8px', paddingLeft: '4px' }}>
            SELECT TRANSPORT MODE
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {modes.map(mode => (
              <ModeButton
                key={mode.id}
                {...mode}
                isSelected={selectedMode === mode.id}
                onClick={() => setSelectedMode(mode.id)}
              />
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!origin || !destination || isSearching}
          style={{
            width: '100%', marginTop: '14px',
            padding: '14px',
            background: !origin || !destination
              ? '#e5e7eb'
              : 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            color: !origin || !destination ? '#9ca3af' : 'white',
            border: 'none', borderRadius: '14px',
            fontSize: '15px', fontWeight: '700',
            cursor: !origin || !destination ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s',
            boxShadow: origin && destination ? '0 4px 15px rgba(29,78,216,0.3)' : 'none'
          }}
        >
          {isSearching ? (
            <>
              <div style={{
                width: '18px', height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Finding Routes...
            </>
          ) : (
            '🔍 Find All Routes'
          )}
        </button>
      </div>

      {/* MINIMIZED SEARCH BAR - shows when panel is hidden */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            position: 'fixed', top: '65px',
            left: '10px', right: '10px',
            zIndex: 999, background: 'white',
            borderRadius: '16px', padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center',
            gap: '10px', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '18px' }}>🔍</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
              {origin?.name || 'From'} → {destination?.name || 'To'}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              Tap to edit • {selectedMode} mode
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); clearRoutes(); setIsMinimized(false); }}
            style={{
              background: '#fee2e2', color: '#dc2626',
              border: 'none', borderRadius: '8px',
              padding: '4px 10px', cursor: 'pointer',
              fontSize: '12px', fontWeight: '600'
            }}
          >✕ Clear</button>
        </button>
      )}

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default SearchPanel;