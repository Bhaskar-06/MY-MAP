import React, { useState } from 'react';
import { X, RefreshCw, Share2, Phone } from 'lucide-react';
import { useMap } from '../../context/MapContext';
import RouteDetails from './RouteDetails';

const RoutePanel = () => {
  const { 
    routes, selectedRoute, setSelectedRoute, 
    showPanel, setShowPanel, origin, destination 
  } = useMap();
  
  const [activeTab, setActiveTab] = useState('routes');

  if (!showPanel || routes.length === 0) return null;

  const transitRoutes = routes.filter(r => r.mode === 'transit');
  const otherRoutes = routes.filter(r => r.mode !== 'transit');

  const getModeIcon = (mode) => {
    const icons = { car: '🚗', walk: '🚶', transit: '🚌' };
    return icons[mode] || '📍';
  };

  const getModeColor = (mode, isSelected) => {
    if (!isSelected) return 'border-gray-200 bg-white';
    const colors = {
      car: 'border-blue-400 bg-blue-50',
      walk: 'border-green-400 bg-green-50',
      transit: 'border-purple-400 bg-purple-50',
    };
    return colors[mode] || 'border-gray-400 bg-gray-50';
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 
                    bg-gray-50 rounded-t-3xl shadow-2xl 
                    max-h-[70vh] overflow-hidden flex flex-col slide-up">
      
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-12 h-1 bg-gray-300 rounded-full" />
      </div>
      
      {/* Panel Header */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">
            Routes Found
          </h2>
          <p className="text-xs text-gray-500">
            {origin?.name} → {destination?.name}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* KSRTC Helpline */}
          <a 
            href="tel:1800-425-1900"
            className="flex items-center gap-1 bg-green-100 text-green-700 
                       px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            <Phone size={12} />
            KSRTC
          </a>
          
          <button
            onClick={() => setShowPanel(false)}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Route Mode Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {routes.map((route, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRoute(route)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 
                         px-4 py-2 rounded-xl border-2 transition-all text-xs
                         ${getModeColor(route.mode, selectedRoute === route)}`}
            >
              <span className="text-base">{getModeIcon(route.mode)}</span>
              <span className="font-medium capitalize">{route.mode}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Route Details Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        
        {/* Transit Routes First */}
        {transitRoutes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-purple-700 mb-2 
                          flex items-center gap-1">
              🚌 Public Transport Options
            </p>
            {transitRoutes.map((route, idx) => (
              <RouteDetails key={idx} route={route} />
            ))}
          </div>
        )}
        
        {/* Other Routes */}
        {otherRoutes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Other Options
            </p>
            {otherRoutes.map((route, idx) => (
              <RouteDetails key={idx} route={route} />
            ))}
          </div>
        )}
        
        {/* Contact Info Card */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <h3 className="text-sm font-bold text-blue-800 mb-2">
            📞 Useful Contacts
          </h3>
          <div className="space-y-2">
            {[
              { name: 'KSRTC Helpline', number: '1800-425-1900', free: true },
              { name: 'Mysuru Bus Stand', number: '0821-2523652', free: false },
              { name: 'Hunsur Bus Stand', number: '08222-252272', free: false },
            ].map((contact, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-900">{contact.name}</p>
                  {contact.free && (
                    <span className="text-xs text-green-600">Toll Free</span>
                  )}
                </div>
                <a 
                  href={`tel:${contact.number}`}
                  className="text-xs text-blue-600 font-mono hover:underline"
                >
                  {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePanel;