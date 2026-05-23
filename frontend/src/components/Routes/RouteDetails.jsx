import React, { useState } from 'react';
import { formatDuration, formatDistance } from '../../services/routeService';

const RouteDetails = ({ route }) => {
  const [expanded, setExpanded] = useState(true);
  if (!route) return null;

  const modeColor = { car: 'text-blue-600', walk: 'text-green-600', transit: 'text-purple-600' };
  const modeIcon = { car: '🚗', walk: '🚶', transit: '🚌' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <div>
          <div className={`text-sm font-bold ${modeColor[route.mode]}`}>
            {modeIcon[route.mode]} {route.mode === 'transit' ? 'Public Transport' : route.mode === 'car' ? 'Driving' : 'Walking'}
            {route.isEstimated && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Estimated</span>}
          </div>
          <div className="flex gap-3 mt-1 text-xs text-gray-500">
            <span>⏱ {formatDuration(route.duration)}</span>
            {route.distance && <span>{formatDistance(route.distance)}</span>}
            {route.fare && <span>₹{route.fare.amount}</span>}
          </div>
        </div>
        <span>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && route.steps && (
        <div className="border-t border-gray-100">
          {route.steps.map((step, i) => (
            <div key={i} className="p-3 border-b border-gray-50 last:border-0">
              <div className="flex items-start gap-3">
                <span className="text-lg">{step.icon || '📍'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{step.instruction}</p>
                  {step.distance && <p className="text-xs text-gray-400">{formatDistance(step.distance)}</p>}

                  {step.type === 'bus' && (
                    <div className="mt-2 bg-purple-50 rounded-xl p-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="font-bold text-purple-700">{step.busNumber}</span>
                        {step.departure && <span>Departs: {step.departure}</span>}
                      </div>
                      <div className="text-xs">
                        <span className="text-green-600">● {step.from}</span>
                        <span className="mx-2">→</span>
                        <span className="text-red-500">● {step.to}</span>
                      </div>
                      {step.fare && (
                        <div className="mt-1 text-xs text-gray-500">
                          ₹{step.fare.amount} • {step.frequency}
                        </div>
                      )}
                      {step.tips && (
                        <div className="mt-2 bg-yellow-50 rounded p-2">
                          {step.tips.map((t, ti) => <p key={ti} className="text-xs text-yellow-700">• {t}</p>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {route.isEstimated && (
        <div className="px-4 pb-4">
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
            <p className="text-xs text-amber-800 font-medium">⚠️ Limited transit data</p>
            <p className="text-xs text-amber-600">Call KSRTC: 1800-425-1900 for exact schedules</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;