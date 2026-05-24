import React from 'react';

const Navbar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 glass-panel shadow-md">
    <div className="flex items-center justify-between px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600
                        rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-lg">🚌</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-tight">
            TransitMap India
          </h1>
          <p className="text-xs text-gray-500 leading-tight">
            Public Transport for Every Destination
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
          🇮🇳 All India
        </span>
      </div>
    </div>
  </div>
);

export default Navbar;