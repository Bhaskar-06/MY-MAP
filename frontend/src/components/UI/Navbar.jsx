import React from 'react';

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🚌</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">TransitMap</h1>
            <p className="text-xs text-gray-500">Public Transport Guide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;