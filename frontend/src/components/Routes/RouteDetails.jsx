import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Clock, Navigation, 
  AlertCircle, Info, DollarSign 
} from 'lucide-react';
import { formatDuration, formatDistance } from '../../services/routeService';

const StepIcon = ({ type }) => {
  const icons = {
    walk: '🚶',
    bus: '🚌',
    local: '🛺',
    info: 'ℹ️',
    transfer: '🔄',
  };
  return <span className="text-lg">{icons[type] || '📍'}</span>;
};

const BusStepDetails = ({ step }) => {
  const [showStops, setShowStops] = useState(false);
  
  return (
    <div className="ml-10">
      {/* Bus Info Card */}
      <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 
                           px-2 py-0.5 rounded-full">
              {step.busNumber || 'BUS'}
            </span>
            {step.departure && (
              <span className="ml-2 text-xs text-gray-500">
                Departs: {step.departure}
              </span>
            )}
          </div>
          {step.arrival && (
            <span className="text-xs text-gray-500">
              Arrives: {step.arrival}
            </span>
          )}
        </div>
        
        {/* From - To */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="w-0.5 h-8 bg-gray-300" />
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-gray-700">{step.from}</span>
            <span className="font-medium text-gray-700">{step.to}</span>
          </div>
        </div>
        
        {/* Intermediate Stops */}
        {step.intermediateStops && step.intermediateStops.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowStops(!showStops)}
              className="text-xs text-purple-600 flex items-center gap-1"
            >
              {showStops ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {step.intermediateStops.length} stops
            </button>
            
            {showStops && (
              <div className="mt-2 space-y-1">
                {step.intermediateStops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full ml-1" />
                    {stop}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Fare & Frequency */}
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-purple-100">
          {step.fare && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <DollarSign size={10} />
              ₹{step.fare.amount} ({step.fare.type})
            </div>
          )}
          {step.frequency && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock size={10} />
              {step.frequency}
            </div>
          )}
        </div>
      </div>
      
      {/* Tips/Notes */}
      {step.tips && (
        <div className="mt-2 bg-yellow-50 rounded-lg p-2 border border-yellow-100">
          <p className="text-xs font-medium text-yellow-800 mb-1">💡 Tips:</p>
          {step.tips.map((tip, idx) => (
            <p key={idx} className="text-xs text-yellow-700">• {tip}</p>
          ))}
        </div>
      )}
      
      {/* Local transport options */}
      {step.options && (
        <div className="mt-2 space-y-1">
          {step.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <span>•</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RouteDetails = ({ route }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!route) return null;
  
  const isTransit = route.mode === 'transit';
  const modeColors = {
    car: 'text-blue-600',
    walk: 'text-green-600',
    transit: 'text-purple-600',
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Route Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${modeColors[route.mode]}`}>
              {route.mode === 'transit' ? '🚌 Public Transport' : 
               route.mode === 'car' ? '🚗 Driving' : '🚶 Walking'}
            </span>
            {route.type === 'fallback' && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                Estimated
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={10} />
              {formatDuration(route.duration)}
            </span>
            {route.distance && (
              <span className="text-xs text-gray-500">
                {formatDistance(route.distance)}
              </span>
            )}
            {route.fare && (
              <span className="text-xs text-gray-500">
                ₹{route.fare.amount}
              </span>
            )}
          </div>
          
          {route.summary && (
            <p className="text-xs text-gray-400 mt-0.5">{route.summary}</p>
          )}
        </div>
        
        {expanded ? 
          <ChevronUp size={16} className="text-gray-400" /> : 
          <ChevronDown size={16} className="text-gray-400" />
        }
      </div>
      
      {/* Route Steps */}
      {expanded && route.steps && (
        <div className="border-t border-gray-100">
          {route.steps.map((step, idx) => (
            <div key={idx} className="p-4 border-b border-gray-50 last:border-0">
              <div className="flex items-start gap-3">
                <StepIcon type={step.type} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {step.instruction}
                  </p>
                  {step.detail && (
                    <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                  )}
                  {(step.distance || step.duration) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {step.distance && formatDistance(step.distance)}
                      {step.distance && step.duration && ' • '}
                      {step.duration && formatDuration(step.duration)}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Bus step extra details */}
              {(step.type === 'bus' || step.type === 'local') && (
                <BusStepDetails step={step} />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Warning for estimated routes */}
      {route.isEstimated && (
        <div className="px-4 pb-4">
          <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 
                          border border-amber-200">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-amber-800">
                Limited transit data for this area
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Contact KSRTC: 1800-425-1900 for exact schedules
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteDetails;