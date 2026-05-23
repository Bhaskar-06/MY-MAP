import React from 'react';
import { useMap } from '../../context/MapContext';

const MODES = [
  { id: 'transit', label: 'Transit', icon: '🚌' },
  { id: 'car', label: 'Drive', icon: '🚗' },
  { id: 'walk', label: 'Walk', icon: '🚶' },
  { id: 'all', label: 'All', icon: '🗺️' },
];

const TransportMode = () => {
  const { selectedMode, setSelectedMode } = useMap();

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2">Transport Mode</p>
      <div className="grid grid-cols-4 gap-2">
        {MODES.map(mode => (
          <button key={mode.id} onClick={() => setSelectedMode(mode.id)}
            className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all text-xs
              ${selectedMode === mode.id ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>
            <span className="text-lg">{mode.icon}</span>
            <span className="font-medium">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransportMode;