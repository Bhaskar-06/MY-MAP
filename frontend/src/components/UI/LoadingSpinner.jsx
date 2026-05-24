import React from 'react';

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col
                  items-center justify-center z-50">
    <div className="relative mb-4">
      <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-spin
                      border-t-blue-600"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl">🚌</span>
      </div>
    </div>
    <p className="text-gray-700 font-bold text-lg">Finding Routes...</p>
    <p className="text-gray-500 text-sm mt-1">Searching all transport options</p>
    <div className="flex gap-2 mt-4">
      {['🚌', '🚂', '🚇', '🛺', '🚕'].map((icon, i) => (
        <span key={i} className="text-xl pulse-dot" style={{ animationDelay: `${i * 0.2}s` }}>
          {icon}
        </span>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;