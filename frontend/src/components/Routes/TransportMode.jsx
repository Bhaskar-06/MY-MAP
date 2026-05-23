import React from 'react';
import { useMap } from '../../context/MapContext';

const MODES = [
  { id: 'transit', label: 'Transit', icon: '🚌', color: 'purple' },
  { id: 'car', label: 'Drive', icon: '🚗', color: 'blue' },
  { id: 'walk', label: 'Walk', icon: '🚶', color: 'green' },
  { id: 'all', label: 'All', icon: '🗺️', color: 'orange' },
];

const TransportMode = () => {
  const { selectedMode, setSelectedMode } = useMap();

  const getColors = (mode, id) => {
    const isActive = selectedMode === id;
    
    const colorMap = {
      purple: isActive 
        ? 'bg-purple-100 text-purple-700 border-purple-400' 
        : 'border-gray-200 text-gray-500',
      blue: isActive 
        ? 'bg-blue-100 text-blue-700 border-blue-400' 
        : 'border-gray-200 text-gray-500',
      green: isActive 
        ? 'bg-green-100 text-green-700 border-green-400' 
        : 'border-gray-200 text-gray-500',
      orange: isActive 
        ? 'bg-orange-100 text-orange-700 border-orange-400' 
        : 'border-gray-200 text-gray-500',
    };
    
    return colorMap[mode];
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2 font-medium">Transport Mode</p>
      <div className="grid grid-cols-4 gap-2">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl 
                       border-2 transition-all duration-200 
                       ${getColors(mode.color, mode.id)}`}
          >
            <span className="text-xl">{mode.icon}</span>
            <span className="text-xs font-medium">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransportMode;