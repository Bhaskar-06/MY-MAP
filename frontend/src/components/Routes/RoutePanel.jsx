import React, { useState } from 'react';
import { useMap } from '../../context/MapContext';

const formatMins = (mins) => {
  if (!mins) return 'N/A';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const StepItem = ({ step, index }) => {
  const [expanded, setExpanded] = useState(false);

  const colors = {
    walk: '#4caf50', bus: '#9c27b0', train: '#f44336',
    metro: '#2196f3', auto: '#ff9800', cab: '#ffc107',
    taxi: '#ffc107', transit: '#673ab7', local: '#ff5722',
  };

  const color = colors[step.type] || '#666';

  return (
    <div style={{
      background: 'white', borderRadius: '12px', marginBottom: '8px',
      border: `1px solid ${color}30`, overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      {/* Step Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '12px', gap: '12px' }}>
        {/* Number + Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: color, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: '700', flexShrink: 0
          }}>{index + 1}</div>
          <span style={{ fontSize: '22px' }}>{step.icon}</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
            {step.instruction}
          </div>
          {step.detail && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px' }}>
              {step.detail}
            </div>
          )}

          {/* Chips */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            {step.duration && (
              <span style={{
                background: '#f3f4f6', padding: '3px 8px',
                borderRadius: '20px', fontSize: '11px', color: '#374151'
              }}>⏱ {step.duration}min</span>
            )}
            {step.fare?.amount && (
              <span style={{
                background: '#dcfce7', padding: '3px 8px',
                borderRadius: '20px', fontSize: '11px', color: '#166534'
              }}>💰 ₹{step.fare.amount}</span>
            )}
            {step.distance && (
              <span style={{
                background: '#dbeafe', padding: '3px 8px',
                borderRadius: '20px', fontSize: '11px', color: '#1e40af'
              }}>📏 {(step.distance/1000).toFixed(1)}km</span>
            )}
          </div>

          {/* From-To */}
          {(step.from || step.to) && (
            <div style={{
              background: '#f9fafb', borderRadius: '8px',
              padding: '8px', marginTop: '8px', border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}/>
                  <div style={{ width: '1px', height: '16px', background: '#d1d5db' }}/>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {step.from && <span style={{ color: '#374151', fontWeight: '600' }}>{step.from}</span>}
                  {step.to && <span style={{ color: '#374151', fontWeight: '600' }}>{step.to}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Operator */}
          {step.operatorDetails && (
            <div style={{
              background: '#faf5ff', borderRadius: '8px',
              padding: '8px', marginTop: '8px', border: '1px solid #e9d5ff'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#6d28d9', marginBottom: '4px' }}>
                {step.operatorDetails.name}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {step.operatorDetails.helpline && (
                  <a href={`tel:${step.operatorDetails.helpline}`} style={{
                    background: '#ede9fe', color: '#7c3aed', padding: '3px 8px',
                    borderRadius: '20px', fontSize: '11px', textDecoration: 'none',
                    fontWeight: '600'
                  }}>📞 {step.operatorDetails.helpline}</a>
                )}
                {step.operatorDetails.website && (
                  <a href={`https://${step.operatorDetails.website}`} target="_blank" rel="noreferrer"
                    style={{
                      background: '#dbeafe', color: '#1d4ed8', padding: '3px 8px',
                      borderRadius: '20px', fontSize: '11px', textDecoration: 'none',
                      fontWeight: '600'
                    }}>🌐 Website</a>
                )}
              </div>
            </div>
          )}

          {/* Cab Providers */}
          {step.providers && (
            <div style={{ marginTop: '8px' }}>
              {step.providers.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '6px 10px',
                  background: '#fffbeb', borderRadius: '8px',
                  marginBottom: '4px', border: '1px solid #fde68a'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{p.icon} {p.name}</span>
                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>{p.fare}</span>
                </div>
              ))}
            </div>
          )}

          {/* Options */}
          {step.alternatives && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
              {step.alternatives.map((a, i) => (
                <span key={i} style={{
                  background: '#f3f4f6', padding: '3px 8px',
                  borderRadius: '20px', fontSize: '11px', color: '#374151'
                }}>{a.mode}: {a.fare}</span>
              ))}
            </div>
          )}

          {/* Tips Toggle */}
          {step.tips && (
            <button onClick={() => setExpanded(!expanded)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '11px', color: '#2563eb', marginTop: '6px',
              padding: '2px 0', fontWeight: '600'
            }}>
              💡 {expanded ? '▲ Hide Tips' : '▼ Show Tips'}
            </button>
          )}
          {expanded && step.tips && (
            <div style={{
              background: '#fffbeb', borderRadius: '8px',
              padding: '8px', marginTop: '6px', border: '1px solid #fde68a'
            }}>
              {step.tips.map((tip, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#92400e', marginBottom: '3px' }}>
                  💡 {tip}
                </div>
              ))}
            </div>
          )}

          {/* Booking Info */}
          {step.bookingInfo && (
            <div style={{
              background: '#eff6ff', borderRadius: '8px',
              padding: '8px', marginTop: '8px', border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                📱 How to Book:
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {step.bookingInfo.app && (
                  <span style={{
                    background: '#dbeafe', color: '#1d4ed8', padding: '3px 8px',
                    borderRadius: '20px', fontSize: '11px', fontWeight: '600'
                  }}>{step.bookingInfo.app}</span>
                )}
                {step.bookingInfo.helpline && (
                  <a href={`tel:${step.bookingInfo.helpline}`} style={{
                    background: '#dcfce7', color: '#166534', padding: '3px 8px',
                    borderRadius: '20px', fontSize: '11px', textDecoration: 'none',
                    fontWeight: '600'
                  }}>📞 {step.bookingInfo.helpline}</a>
                )}
                {step.bookingInfo.counter && (
                  <span style={{
                    background: '#f3f4f6', color: '#374151', padding: '3px 8px',
                    borderRadius: '20px', fontSize: '11px'
                  }}>🎫 {step.bookingInfo.counter}</span>
                )}
              </div>
            </div>
          )}

          {/* Fare by class for trains */}
          {step.fareByClass && (
            <div style={{
              background: '#fff7ed', borderRadius: '8px',
              padding: '8px', marginTop: '8px', border: '1px solid #fed7aa'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#9a3412', marginBottom: '4px' }}>
                🎫 Fare by Class:
              </div>
              {Object.entries(step.fareByClass).map(([cls, fare]) => (
                <div key={cls} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px', padding: '2px 0',
                  borderBottom: '1px solid #fed7aa'
                }}>
                  <span style={{ color: '#7c2d12' }}>{cls}</span>
                  <span style={{ fontWeight: '700', color: '#ea580c' }}>₹{fare}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RouteCard = ({ route, isSelected }) => {
  const [showSteps, setShowSteps] = useState(isSelected);

  const headerColors = {
    bus: 'linear-gradient(135deg, #7c3aed, #9c27b0)',
    train: 'linear-gradient(135deg, #dc2626, #ef4444)',
    metro: 'linear-gradient(135deg, #1d4ed8, #2196f3)',
    car: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
    walk: 'linear-gradient(135deg, #166534, #22c55e)',
    cab: 'linear-gradient(135deg, #92400e, #f59e0b)',
    multimodal: 'linear-gradient(135deg, #4338ca, #6366f1)',
  };

  const bg = headerColors[route.subMode || route.mode] || headerColors.bus;

  return (
    <div style={{
      borderRadius: '16px', overflow: 'hidden', marginBottom: '12px',
      boxShadow: isSelected ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
      border: isSelected ? '2px solid #3b82f6' : '2px solid transparent'
    }}>
      {/* Header */}
      <div style={{ background: bg, padding: '14px 16px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800' }}>{route.title}</div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '3px' }}>{route.summary}</div>
          </div>
          {route.fare > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: '800' }}>₹{route.fare}+</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>estimated</div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          {[
            { label: `⏱ ${formatMins(route.duration)}` },
            { label: route.distance ? `📏 ${(route.distance/1000).toFixed(0)}km` : null },
            { label: route.reliability ? `✅ ${route.reliability}` : null },
            { label: route.bookingRequired ? '📱 Booking Needed' : '🎫 Walk-in' },
          ].filter(s => s.label).map((s, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.2)', padding: '4px 10px',
              borderRadius: '20px', fontSize: '11px', fontWeight: '600'
            }}>{s.label}</span>
          ))}
        </div>
      </div>

      {/* Toggle Steps */}
      <button onClick={() => setShowSteps(!showSteps)} style={{
        width: '100%', padding: '10px 16px',
        background: '#f9fafb', border: 'none', borderBottom: '1px solid #e5e7eb',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: '12px', color: '#6b7280',
        fontWeight: '600', fontFamily: 'inherit'
      }}>
        <span>📋 {route.steps?.length || 0} Steps</span>
        <span>{showSteps ? '▲ Hide' : '▼ Show Steps'}</span>
      </button>

      {/* Steps */}
      {showSteps && (
        <div style={{ padding: '12px', background: '#f9fafb' }}>
          {route.steps?.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

const RoutePanel = () => {
  const {
    routes, selectedRoute, setSelectedRoute,
    showPanel, clearRoutes, origin, destination
  } = useMap();

  const [activeRoute, setActiveRoute] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  if (!showPanel || routes.length === 0) return null;

  const handleRouteSelect = (route, index) => {
    setSelectedRoute(route);
    setActiveRoute(index);
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 1000, background: 'white',
      borderRadius: '24px 24px 0 0',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
      maxHeight: collapsed ? '80px' : '75vh',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      animation: 'slideUp 0.4s ease-out',
    }}>
      {/* Handle */}
      <div onClick={() => setCollapsed(!collapsed)} style={{
        display: 'flex', justifyContent: 'center',
        paddingTop: '12px', paddingBottom: '4px',
        cursor: 'pointer'
      }}>
        <div style={{
          width: '40px', height: '4px',
          background: '#d1d5db', borderRadius: '4px'
        }}/>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '8px 16px 12px'
      }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>
            🗺️ {routes.length} Routes Found
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
            📍 {origin?.name?.substring(0, 20)} → 🏁 {destination?.name?.substring(0, 20)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="tel:139" style={{
            background: '#fef3c7', color: '#d97706',
            padding: '6px 12px', borderRadius: '10px',
            fontSize: '12px', fontWeight: '700', textDecoration: 'none'
          }}>🚂 139</a>
          <button onClick={clearRoutes} style={{
            background: '#fee2e2', color: '#dc2626',
            border: 'none', borderRadius: '10px',
            padding: '6px 12px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '700', fontFamily: 'inherit'
          }}>✕ Close</button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Route Mode Tabs */}
          <div style={{
            display: 'flex', gap: '8px', overflowX: 'auto',
            padding: '0 16px 12px',
            scrollbarWidth: 'none'
          }}>
            {routes.map((route, i) => {
              const icons = {
                bus: '🚌', train: '🚂', metro: '🚇',
                car: '🚗', walk: '🚶', cab: '🚕', multimodal: '🗺️'
              };
              const icon = icons[route.subMode || route.mode] || '📍';
              const isActive = activeRoute === i;

              return (
                <button key={i} onClick={() => handleRouteSelect(route, i)} style={{
                  flexShrink: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '3px',
                  padding: '8px 14px', borderRadius: '14px',
                  border: `2px solid ${isActive ? '#3b82f6' : '#e5e7eb'}`,
                  background: isActive ? '#eff6ff' : 'white',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}>
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    color: isActive ? '#2563eb' : '#9ca3af'
                  }}>
                    {route.title?.split(' ').slice(0, 2).join(' ') || route.mode}
                  </span>
                  <span style={{
                    fontSize: '10px', color: '#6b7280'
                  }}>
                    {formatMins(route.duration)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Route Details - Scrollable */}
          <div style={{ overflowY: 'auto', padding: '0 12px',
                        maxHeight: 'calc(75vh - 180px)' }}>
            {selectedRoute && (
              <RouteCard route={selectedRoute} isSelected={true} />
            )}

            {/* Quick Contact Card */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
              borderRadius: '16px', padding: '14px',
              border: '1px solid #dbeafe', marginBottom: '12px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e40af', marginBottom: '10px' }}>
                📞 Quick Transport Contacts
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { name: 'Indian Railways', num: '139', icon: '🚂' },
                  { name: 'Ola Cabs', num: '033-66000600', icon: '🟡' },
                  { name: 'KSRTC Karnataka', num: '1800-425-1900', icon: '🚌' },
                  { name: 'Emergency', num: '112', icon: '🚨' },
                ].map((c, i) => (
                  <a key={i} href={`tel:${c.num}`} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'white', borderRadius: '12px',
                    padding: '8px 10px', textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                  }}>
                    <span style={{ fontSize: '18px' }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#374151' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>{c.num}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* All Routes Summary */}
            <div style={{
              background: '#f9fafb', borderRadius: '16px',
              padding: '14px', border: '1px solid #e5e7eb', marginBottom: '20px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#374151', marginBottom: '10px' }}>
                📊 All Options Compared
              </div>
              {routes.map((route, i) => {
                const icons = { bus: '🚌', train: '🚂', metro: '🚇', car: '🚗', walk: '🚶', cab: '🚕' };
                return (
                  <button key={i} onClick={() => handleRouteSelect(route, i)} style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '10px 12px',
                    background: activeRoute === i ? '#eff6ff' : 'white',
                    border: `1px solid ${activeRoute === i ? '#93c5fd' : '#e5e7eb'}`,
                    borderRadius: '12px', marginBottom: '6px',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {icons[route.subMode || route.mode] || '📍'}
                      </span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>
                          {route.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {formatMins(route.duration)} • {route.bookingRequired ? 'Book Required' : 'No Booking'}
                        </div>
                      </div>
                    </div>
                    {route.fare > 0 && (
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#059669' }}>
                        ₹{route.fare}+
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RoutePanel;