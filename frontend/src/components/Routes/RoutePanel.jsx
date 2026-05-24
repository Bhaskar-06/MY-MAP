import React, { useState } from 'react';
import { useMap } from '../../context/MapContext';
import { formatDistance, formatDuration } from '../../services/routeService';

const ModeTab = ({ route, isSelected, onClick }) => {
  const icons = {
    transit: '🚌', bus: '🚌', train: '🚂', metro: '🚇',
    car: '🚗', walk: '🚶', cab: '🚕', multimodal: '🗺️'
  };
  const icon = icons[route.subMode || route.mode] || '📍';

  return (
    <button onClick={onClick}
      className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2
                 rounded-xl border-2 text-xs transition-all min-w-[60px]
                 ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-semibold">{route.title?.split(' ')[0] || route.mode}</span>
      <span className="text-gray-500 text-xs">
        {Math.round((route.duration || 0) / 60)}h {(route.duration || 0) % 60}m
      </span>
    </button>
  );
};

const StepCard = ({ step, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  const bgColors = {
    walk: 'bg-green-50 border-green-200',
    bus: 'bg-purple-50 border-purple-200',
    train: 'bg-red-50 border-red-200',
    metro: 'bg-blue-50 border-blue-200',
    auto: 'bg-orange-50 border-orange-200',
    cab: 'bg-yellow-50 border-yellow-200',
    taxi: 'bg-yellow-50 border-yellow-200',
    transit: 'bg-indigo-50 border-indigo-200',
    local: 'bg-orange-50 border-orange-200',
  };

  const bg = bgColors[step.type] || 'bg-gray-50 border-gray-200';

  return (
    <div className={`border rounded-xl p-3 mb-2 ${bg}`}>
      <div className="flex items-start gap-3">
        {/* Step Number + Icon */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center
                          justify-center text-xs font-bold text-gray-600">
            {index + 1}
          </div>
          <span className="text-xl">{step.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{step.instruction}</p>
          {step.detail && <p className="text-xs text-gray-600 mt-0.5">{step.detail}</p>}

          {/* Duration + Fare */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {step.duration && (
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border">
                ⏱ {step.duration}min
              </span>
            )}
            {step.fare && (
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border">
                💰 ₹{step.fare.amount} ({step.fare.type})
              </span>
            )}
            {step.distance && (
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border">
                📏 {(step.distance / 1000).toFixed(1)}km
              </span>
            )}
          </div>

          {/* From - To for bus/train */}
          {(step.from || step.to) && (
            <div className="mt-2 bg-white rounded-lg p-2 border">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"/>
                  <div className="w-0.5 h-4 bg-gray-300"/>
                  <div className="w-2 h-2 bg-red-500 rounded-full"/>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-700 font-medium">{step.from}</span>
                  <span className="text-gray-700 font-medium">{step.to}</span>
                </div>
              </div>
            </div>
          )}

          {/* Operator Info */}
          {step.operatorDetails && (
            <div className="mt-2 bg-white rounded-lg p-2 border">
              <p className="text-xs font-bold text-gray-700">{step.operatorDetails.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {step.operatorDetails.helpline && (
                  <a href={`tel:${step.operatorDetails.helpline}`}
                    className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    📞 {step.operatorDetails.helpline}
                  </a>
                )}
                {step.operatorDetails.website && (
                  <a href={`https://${step.operatorDetails.website}`} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    🌐 {step.operatorDetails.website}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Providers for cab */}
          {step.providers && (
            <div className="mt-2 space-y-1">
              {step.providers.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-white
                                        rounded-lg px-3 py-1.5 border text-xs">
                  <span className="font-medium">{p.icon} {p.name}</span>
                  <span className="text-green-600 font-bold">{p.fare}</span>
                </div>
              ))}
            </div>
          )}

          {/* Alternatives */}
          {step.alternatives && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Also available:</p>
              <div className="flex flex-wrap gap-1">
                {step.alternatives.map((a, i) => (
                  <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full border text-gray-600">
                    {a.mode}: {a.fare}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {step.options && !Array.isArray(step.options[0]) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {step.options.map((opt, i) => (
                <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full border text-gray-600">
                  {typeof opt === 'string' ? opt : `${opt.type}: ${opt.fare}`}
                </span>
              ))}
            </div>
          )}

          {/* Booking Info */}
          {step.bookingInfo && (
            <div className="mt-2 bg-blue-50 rounded-lg p-2">
              <p className="text-xs font-medium text-blue-800 mb-1">📱 Book via:</p>
              <div className="flex flex-wrap gap-1">
                {step.bookingInfo.app && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {step.bookingInfo.app}
                  </span>
                )}
                {step.bookingInfo.online && (
                  <a href={`https://${step.bookingInfo.online}`} target="_blank" rel="noreferrer"
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {step.bookingInfo.online}
                  </a>
                )}
                {step.bookingInfo.counter && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {step.bookingInfo.counter}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          {step.tips && (
            <div className="mt-2">
              <button onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-blue-600 font-medium">
                {showDetails ? '▲ Hide tips' : '▼ Show tips'}
              </button>
              {showDetails && (
                <div className="mt-1 bg-amber-50 rounded-lg p-2 border border-amber-100">
                  {step.tips.map((tip, i) => (
                    <p key={i} className="text-xs text-amber-800">💡 {tip}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RouteCard = ({ route }) => {
  const [showSteps, setShowSteps] = useState(true);

  const modeColors = {
    transit: 'bg-purple-600', bus: 'bg-purple-600',
    train: 'bg-red-600', metro: 'bg-blue-600',
    car: 'bg-blue-500', walk: 'bg-green-500',
    cab: 'bg-yellow-500', multimodal: 'bg-indigo-600'
  };

  const bgColor = modeColors[route.subMode || route.mode] || 'bg-gray-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-3 overflow-hidden">
      {/* Route Header */}
      <div className={`${bgColor} p-3 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">{route.title}</h3>
            <p className="text-xs opacity-90 mt-0.5">{route.summary}</p>
          </div>
          <div className="text-right">
            {route.fare > 0 && (
              <p className="text-lg font-bold">₹{route.fare}+</p>
            )}
            {route.fare === 0 && (
              <p className="text-sm font-bold">Free</p>
            )}
            <p className="text-xs opacity-75">
              {route.bookingRequired ? '📱 Book Required' : '🎫 No Booking'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 mt-2">
          <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
            ⏱ {Math.floor((route.duration || 0) / 60)}h {(route.duration || 0) % 60}m
          </span>
          <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
            📏 {route.distance ? `${(route.distance/1000).toFixed(0)}km` : 'N/A'}
          </span>
          {route.reliability && (
            <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
              ✅ {route.reliability}
            </span>
          )}
        </div>
      </div>

      {/* Steps Toggle */}
      <button onClick={() => setShowSteps(!showSteps)}
        className="w-full px-4 py-2 text-xs text-gray-500 hover:bg-gray-50
                   flex items-center justify-between border-b">
        <span className="font-medium">{route.steps?.length || 0} Steps</span>
        <span>{showSteps ? '▲ Hide' : '▼ Show steps'}</span>
      </button>

      {/* Steps */}
      {showSteps && route.steps && (
        <div className="p-3">
          {route.steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      )}

      {/* Note */}
      {route.note && (
        <div className="mx-3 mb-3 bg-blue-50 rounded-xl p-2 border border-blue-100">
          <p className="text-xs text-blue-700">ℹ️ {route.note}</p>
        </div>
      )}
    </div>
  );
};

const RoutePanel = () => {
  const {
    routes, selectedRoute, setSelectedRoute,
    showPanel, setShowPanel, origin, destination,
    clearRoutes
  } = useMap();

  const [panelHeight, setPanelHeight] = useState('60vh');

  if (!showPanel || routes.length === 0) return null;

  const transitRoutes = routes.filter(r => r.mode === 'transit' || r.mode === 'cab');
  const otherRoutes = routes.filter(r => r.mode === 'car' || r.mode === 'walk');

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 rounded-t-3xl shadow-2xl
                    glass-panel flex flex-col slide-up"
         style={{ maxHeight: panelHeight }}>

      {/* Handle */}
      <div className="flex justify-center pt-2 pb-1 cursor-pointer"
           onClick={() => setPanelHeight(panelHeight === '60vh' ? '90vh' : '60vh')}>
        <div className="w-10 h-1 bg-gray-300 rounded-full"/>
      </div>

      {/* Header */}
      <div className="px-4 pb-2 flex items-start justify-between">
        <div>
          <h2 className="font-bold text-gray-800 text-base">
            🗺️ {routes.length} Routes Found
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            📍 {origin?.name?.substring(0, 25)} →
            🏁 {destination?.name?.substring(0, 25)}
          </p>
        </div>
        <div className="flex gap-2">
          <a href="tel:139"
            className="flex items-center gap-1 bg-red-100 text-red-700
                       px-2 py-1.5 rounded-lg text-xs font-medium">
            🚂 139
          </a>
          <button onClick={clearRoutes}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500">
            ✕
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {routes.map((route, i) => (
            <ModeTab key={i} route={route}
              isSelected={selectedRoute === route}
              onClick={() => setSelectedRoute(route)} />
          ))}
        </div>
      </div>

      {/* Selected Route Details */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {selectedRoute && <RouteCard route={selectedRoute} />}

        {/* Emergency Contacts */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl
                        p-4 border border-blue-100 mb-3">
          <h3 className="text-sm font-bold text-gray-800 mb-2">
            📞 Emergency Transport Contacts
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Indian Railways', number: '139', icon: '🚂' },
              { name: 'Ola Cabs', number: '033-66000600', icon: '🟡' },
              { name: 'Uber', number: '000-800-919-0191', icon: '⬛' },
              { name: 'Police', number: '100', icon: '🚔' },
            ].map((c, i) => (
              <a key={i} href={`tel:${c.number}`}
                className="flex items-center gap-2 bg-white rounded-xl px-3 py-2
                           border border-gray-100 hover:bg-blue-50 transition-colors">
                <span>{c.icon}</span>
                <div>
                  <p className="text-xs font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-blue-600">{c.number}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* All Routes Overview */}
        {routes.length > 1 && (
          <div className="bg-gray-50 rounded-2xl p-4 border">
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              All Available Options
            </h3>
            <div className="space-y-2">
              {routes.map((route, i) => (
                <button key={i} onClick={() => setSelectedRoute(route)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl
                             border transition-all text-left
                             ${selectedRoute === route ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {route.subMode === 'bus' ? '🚌' :
                       route.subMode === 'train' ? '🚂' :
                       route.mode === 'car' ? '🚗' :
                       route.mode === 'walk' ? '🚶' :
                       route.mode === 'cab' ? '🚕' : '🗺️'}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{route.title}</p>
                      <p className="text-xs text-gray-500">{route.summary}</p>
                    </div>
                  </div>
                  {route.fare > 0 && (
                    <span className="text-sm font-bold text-green-600">₹{route.fare}+</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePanel;