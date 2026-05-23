import React from 'react';
import { useMap } from '../../context/MapContext';
import RouteDetails from './RouteDetails';

const RoutePanel = () => {
  const { routes, selectedRoute, setSelectedRoute, showPanel, setShowPanel, origin, destination } = useMap();

  if (!showPanel || routes.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-gray-50 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col slide-up">
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-12 h-1 bg-gray-300 rounded-full" />
      </div>

      <div className="px-4 pb-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Routes Found</h2>
          <p className="text-xs text-gray-500">{origin?.name} → {destination?.name}</p>
        </div>
        <div className="flex gap-2">
          <a href="tel:1800-425-1900"
            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium">
            📞 KSRTC
          </a>
          <button onClick={() => setShowPanel(false)} className="p-1.5 hover:bg-gray-200 rounded-full">✕</button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {routes.map((route, i) => (
            <button key={i} onClick={() => setSelectedRoute(route)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-xl border-2 text-xs transition-all
                ${selectedRoute === route ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
              <span>{route.mode === 'transit' ? '🚌' : route.mode === 'car' ? '🚗' : '🚶'}</span>
              <span className="capitalize">{route.mode}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {routes.map((route, i) => (
          <RouteDetails key={i} route={route} />
        ))}

        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mt-2">
          <h3 className="text-sm font-bold text-blue-800 mb-2">📞 Useful Contacts</h3>
          <div className="space-y-2">
            {[
              { name: 'KSRTC Helpline', number: '1800-425-1900' },
              { name: 'Mysuru Bus Stand', number: '0821-2523652' },
            ].map((c, i) => (
              <div key={i} className="flex justify-between">
                <p className="text-xs text-blue-900">{c.name}</p>
                <a href={`tel:${c.number}`} className="text-xs text-blue-600 hover:underline">{c.number}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePanel;