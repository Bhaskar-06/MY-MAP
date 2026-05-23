import React from 'react';

const LoadingSpinner = ({ message = 'Finding routes...' }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col
                    items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full
                        animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🚌</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-400 mt-1">Searching public transport...</p>
    </div>
  );
};

export default LoadingSpinner;