import React, { useState } from 'react';
import { useMap } from '../../context/MapContext';

const formatMins = (mins) => {
  if (!mins) return 'N/A';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ─── TURN BY TURN ITEM ────────────────────────────────────────
const TurnByTurnList = ({ turns }) => (
  <div style={{
    marginTop: '8px',
    background: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    maxHeight: '300px',
    overflowY: 'auto',
  }}>
    {turns.map((turn, ti) => (
      <div key={ti} style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '8px 12px',
        borderBottom: ti < turns.length - 1 ? '1px solid #e5e7eb' : 'none',
        background: ti % 2 === 0 ? 'white' : '#f9fafb',
      }}>
        {/* Step number + Icon */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '20px', height: '20px',
            background: '#e5e7eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: '700',
            color: '#6b7280',
          }}>{ti + 1}</div>
          <span style={{
            fontSize: '16px',
            lineHeight: 1,
          }}>{turn.maneuverIcon}</span>
        </div>

        {/* Instruction */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#111827',
            lineHeight: 1.4,
          }}>
            {turn.instruction}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '2px',
            display: 'flex',
            gap: '8px',
          }}>
            {turn.distance > 0 && (
              <span>📏 {turn.distance >= 1000
                ? `${(turn.distance / 1000).toFixed(1)} km`
                : `${Math.round(turn.distance)} m`}
              </span>
            )}
            {turn.duration > 0 && (
              <span>⏱ {Math.round(turn.duration / 60)} min</span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── STEP ITEM COMPONENT ──────────────────────────────────────
const StepItem = ({ step, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [showTurns, setShowTurns] = useState(false);

  const bgColors = {
    walk: { bg: '#f0fdf4', border: '#86efac' },
    bus: { bg: '#faf5ff', border: '#d8b4fe' },
    train: { bg: '#fff1f2', border: '#fda4af' },
    metro: { bg: '#eff6ff', border: '#93c5fd' },
    auto: { bg: '#fff7ed', border: '#fdba74' },
    cab: { bg: '#fefce8', border: '#fde047' },
    taxi: { bg: '#fefce8', border: '#fde047' },
    transit: { bg: '#faf5ff', border: '#c084fc' },
    local: { bg: '#fff7ed', border: '#fb923c' },
    car: { bg: '#eff6ff', border: '#60a5fa' },
    bike: { bg: '#fff7ed', border: '#fb923c' },
  };

  const colors = bgColors[step.type] || { bg: '#f9fafb', border: '#d1d5db' };

  const iconColors = {
    walk: '#16a34a', bus: '#7c3aed', train: '#dc2626',
    metro: '#1d4ed8', auto: '#ea580c', cab: '#ca8a04',
    taxi: '#ca8a04', transit: '#7c3aed', local: '#ea580c',
    car: '#1565c0', bike: '#e65100',
  };
  const iconColor = iconColors[step.type] || '#6b7280';

  return (
    <div style={{
      background: colors.bg,
      borderRadius: '12px',
      marginBottom: '10px',
      border: `1.5px solid ${colors.border}`,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      {/* Step Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        gap: '10px',
      }}>
        {/* Index + Icon Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '26px', height: '26px',
            borderRadius: '50%',
            background: iconColor,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '800',
          }}>{index + 1}</div>
          <span style={{ fontSize: '24px', lineHeight: 1 }}>{step.icon}</span>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Instruction */}
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#111827',
            lineHeight: 1.4,
          }}>
            {step.instruction}
          </div>

          {/* Detail */}
          {step.detail && (
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '3px',
              lineHeight: 1.4,
            }}>
              {step.detail}
            </div>
          )}

          {/* Info Chips */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginTop: '8px',
            flexWrap: 'wrap',
          }}>
            {step.duration && (
              <span style={{
                background: 'rgba(255,255,255,0.8)',
                padding: '3px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#374151',
                border: '1px solid rgba(0,0,0,0.1)',
                fontWeight: '600',
              }}>⏱ {step.duration}min</span>
            )}
            {step.fare?.amount != null && (
              <span style={{
                background: '#dcfce7',
                padding: '3px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#166534',
                fontWeight: '600',
              }}>💰 ₹{step.fare.amount} {step.fare.type && `(${step.fare.type})`}</span>
            )}
            {step.distance != null && (
              <span style={{
                background: '#dbeafe',
                padding: '3px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#1e40af',
                fontWeight: '600',
              }}>📏 {step.distance >= 1000
                ? `${(step.distance / 1000).toFixed(1)}km`
                : `${Math.round(step.distance)}m`}
              </span>
            )}
          </div>

          {/* From → To (Bus/Train) */}
          {(step.from || step.to) && (
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginTop: '10px',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                }}>
                  <div style={{
                    width: '10px', height: '10px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px #22c55e',
                  }}/>
                  <div style={{
                    width: '1.5px', height: '20px',
                    background: 'linear-gradient(#22c55e, #ef4444)',
                  }}/>
                  <div style={{
                    width: '10px', height: '10px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px #ef4444',
                  }}/>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  flex: 1,
                }}>
                  <span style={{ fontWeight: '700', color: '#166534' }}>
                    {step.from}
                  </span>
                  <span style={{ fontWeight: '700', color: '#dc2626' }}>
                    {step.to}
                  </span>
                </div>
              </div>

              {/* Departure/Arrival Times */}
              {(step.departure || step.arrival) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#6b7280',
                }}>
                  {step.departure && <span>🕐 Dep: {step.departure}</span>}
                  {step.arrival && <span>🕑 Arr: {step.arrival}</span>}
                </div>
              )}
            </div>
          )}

          {/* Operator Info */}
          {step.operatorDetails && (
            <div style={{
              background: 'rgba(139,92,246,0.08)',
              borderRadius: '10px',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '800',
                color: '#6d28d9',
                marginBottom: '6px',
              }}>
                🏢 {step.operatorDetails.name}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {step.operatorDetails.helpline && (
                  <a href={`tel:${step.operatorDetails.helpline}`} style={{
                    background: '#ede9fe',
                    color: '#7c3aed',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    textDecoration: 'none',
                    fontWeight: '700',
                  }}>📞 {step.operatorDetails.helpline}</a>
                )}
                {step.operatorDetails.website && (
                  <a
                    href={`https://${step.operatorDetails.website}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      textDecoration: 'none',
                      fontWeight: '700',
                    }}>🌐 {step.operatorDetails.website}</a>
                )}
              </div>
            </div>
          )}

          {/* Cab Providers */}
          {step.providers && (
            <div style={{ marginTop: '10px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '6px',
              }}>🚕 Available Cabs:</div>
              {step.providers.map((p, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 12px',
                  background: '#fffbeb',
                  borderRadius: '8px',
                  marginBottom: '5px',
                  border: '1px solid #fde68a',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{p.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>
                      {p.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#059669',
                  }}>{p.fare}</span>
                </div>
              ))}
            </div>
          )}

          {/* Alternatives */}
          {step.alternatives && (
            <div style={{ marginTop: '8px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '4px',
              }}>Also available:</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {step.alternatives.map((a, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.8)',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: '#374151',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}>
                    {a.mode}: {a.fare}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options list */}
          {step.options && Array.isArray(step.options) && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
              {step.options.map((opt, i) => (
                <span key={i} style={{
                  background: 'rgba(255,255,255,0.8)',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  color: '#374151',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}>
                  {typeof opt === 'string' ? opt : `${opt.type}: ${opt.fare}`}
                </span>
              ))}
            </div>
          )}

          {/* Booking Info */}
          {step.bookingInfo && (
            <div style={{
              background: '#eff6ff',
              borderRadius: '10px',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid #bfdbfe',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '6px',
              }}>📱 How to Book:</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {step.bookingInfo.app && (
                  <span style={{
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}>📱 {step.bookingInfo.app}</span>
                )}
                {step.bookingInfo.online && (
                  <a
                    href={`https://${step.bookingInfo.online}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      textDecoration: 'none',
                      fontWeight: '700',
                    }}>🌐 {step.bookingInfo.online}</a>
                )}
                {step.bookingInfo.helpline && (
                  <a href={`tel:${step.bookingInfo.helpline}`} style={{
                    background: '#fce7f3',
                    color: '#be185d',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    textDecoration: 'none',
                    fontWeight: '700',
                  }}>📞 {step.bookingInfo.helpline}</a>
                )}
                {step.bookingInfo.counter && (
                  <span style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                  }}>🎫 {step.bookingInfo.counter}</span>
                )}
              </div>
            </div>
          )}

          {/* ── TURN BY TURN DIRECTIONS (Car/Bike) ── */}
          {step.turnByTurn && step.turnByTurn.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setShowTurns(!showTurns)}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#374151',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <span>🗺️ Turn-by-Turn ({step.turnByTurn.length} steps)</span>
                <span>{showTurns ? '▲ Hide' : '▼ Show'}</span>
              </button>

              {showTurns && <TurnByTurnList turns={step.turnByTurn} />}
            </div>
          )}

          {/* ── COST BREAKDOWN (Car/Bike) ── */}
          {step.costs && (
            <div style={{
              marginTop: '10px',
              background: '#f0fdf4',
              borderRadius: '10px',
              padding: '10px',
              border: '1px solid #bbf7d0',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#166534',
                marginBottom: '8px',
              }}>💰 Cost Estimate</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {step.costs.petrol != null && (
                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    border: '1px solid #bbf7d0',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#166534',
                  }}>
                    ⛽ Petrol: <strong>₹{step.costs.petrol}</strong>
                  </div>
                )}
                {step.costs.diesel != null && (
                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    border: '1px solid #bbf7d0',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#166534',
                  }}>
                    🛢️ Diesel: <strong>₹{step.costs.diesel}</strong>
                  </div>
                )}
                {step.costs.toll > 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    border: '1px solid #fde68a',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#92400e',
                  }}>
                    🛣️ Toll: <strong>₹{step.costs.toll}+</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BIKE SPECIFIC INFO ── */}
          {step.bikeInfo && (
            <div style={{
              marginTop: '10px',
              background: '#fff7ed',
              borderRadius: '10px',
              padding: '10px',
              border: '1px solid #fed7aa',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#9a3412',
                marginBottom: '8px',
              }}>🏍️ Bike Details</div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
              }}>
                {Object.entries(step.bikeInfo).map(([key, val]) => (
                  <div key={key} style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    border: '1px solid #fed7aa',
                    fontSize: '11px',
                    color: '#92400e',
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '2px' }}>
                      {key === 'fuelEfficiency' ? '⛽ Efficiency' :
                       key === 'totalFuelNeeded' ? '🪣 Fuel Needed' :
                       key === 'estimatedCost' ? '💰 Est. Cost' :
                       key === 'parkingCost' ? '🅿️ Parking' : key}
                    </div>
                    <div>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NAVIGATION APPS ── */}
          {step.apps && (
            <div style={{ marginTop: '10px' }}>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                marginBottom: '6px',
                fontWeight: '700',
              }}>📱 Navigate with:</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {step.apps.map((app, i) => (
                  <span key={i} style={{
                    background: '#f3f4f6',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#374151',
                    fontWeight: '700',
                    border: '1px solid #e5e7eb',
                  }}>
                    {app.icon} {app.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fare by class (Train) */}
          {step.fareByClass && (
            <div style={{
              marginTop: '10px',
              background: '#fff7ed',
              borderRadius: '10px',
              padding: '10px',
              border: '1px solid #fed7aa',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#9a3412',
                marginBottom: '8px',
              }}>🎫 Fare by Class:</div>
              {Object.entries(step.fareByClass).map(([cls, fare]) => (
                <div key={cls} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: '1px solid #fed7aa',
                  fontSize: '12px',
                }}>
                  <span style={{ color: '#7c2d12', fontWeight: '600' }}>{cls}</span>
                  <span style={{ fontWeight: '800', color: '#ea580c' }}>₹{fare}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {step.tips && (
            <div style={{ marginTop: '8px' }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#2563eb',
                  fontWeight: '700',
                  padding: '2px 0',
                  fontFamily: 'inherit',
                }}
              >
                💡 {expanded ? '▲ Hide Tips' : '▼ Show Tips'}
              </button>
              {expanded && (
                <div style={{
                  background: '#fffbeb',
                  borderRadius: '10px',
                  padding: '10px',
                  marginTop: '6px',
                  border: '1px solid #fde68a',
                }}>
                  {step.tips.map((tip, i) => (
                    <div key={i} style={{
                      fontSize: '12px',
                      color: '#92400e',
                      marginBottom: '4px',
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'flex-start',
                      lineHeight: 1.4,
                    }}>
                      <span>💡</span>
                      <span>{tip}</span>
                    </div>
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

// ─── ROUTE CARD ───────────────────────────────────────────────
const RouteCard = ({ route, isSelected }) => {
  const [showSteps, setShowSteps] = useState(true);

  const gradients = {
    bus: 'linear-gradient(135deg, #7c3aed, #9c27b0)',
    transit: 'linear-gradient(135deg, #7c3aed, #9c27b0)',
    train: 'linear-gradient(135deg, #b91c1c, #dc2626)',
    metro: 'linear-gradient(135deg, #1e40af, #2563eb)',
    car: 'linear-gradient(135deg, #1565c0, #1976d2)',
    bike: 'linear-gradient(135deg, #e65100, #f57c00)',
    walk: 'linear-gradient(135deg, #166534, #16a34a)',
    cab: 'linear-gradient(135deg, #b45309, #d97706)',
    multimodal: 'linear-gradient(135deg, #4338ca, #6366f1)',
  };

  const bg = gradients[route.subMode || route.mode] || gradients.transit;

  return (
    <div style={{
      borderRadius: '18px',
      overflow: 'hidden',
      marginBottom: '14px',
      boxShadow: isSelected
        ? '0 6px 24px rgba(0,0,0,0.18)'
        : '0 2px 10px rgba(0,0,0,0.08)',
      border: isSelected
        ? '2.5px solid #3b82f6'
        : '2px solid transparent',
      transition: 'all 0.2s',
    }}>

      {/* ── CARD HEADER ── */}
      <div style={{
        background: bg,
        padding: '14px 16px',
        color: 'white',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '800',
              lineHeight: 1.3,
            }}>{route.title}</div>
            <div style={{
              fontSize: '12px',
              opacity: 0.9,
              marginTop: '4px',
              lineHeight: 1.4,
            }}>{route.summary}</div>
          </div>

          {/* Fare Badge */}
          <div style={{ textAlign: 'right', marginLeft: '12px', flexShrink: 0 }}>
            {route.fare > 0 ? (
              <>
                <div style={{ fontSize: '22px', fontWeight: '900' }}>
                  ₹{route.fare}+
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>estimated</div>
              </>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '700',
              }}>FREE</div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          flexWrap: 'wrap',
        }}>
          {[
            `⏱ ${formatMins(route.duration)}`,
            route.distance
              ? `📏 ${route.distance >= 1000
                  ? `${(route.distance / 1000).toFixed(0)}km`
                  : `${Math.round(route.distance)}m`}`
              : null,
            route.reliability ? `✅ ${route.reliability}` : null,
            route.bookingRequired ? '📱 Book Required' : '🎫 No Booking',
            route.isRealRoute ? '🛣️ Real Route' : null,
          ].filter(Boolean).map((stat, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
            }}>{stat}</span>
          ))}
        </div>
      </div>

      {/* ── TOGGLE STEPS ── */}
      <button
        onClick={() => setShowSteps(!showSteps)}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: '#f9fafb',
          border: 'none',
          borderBottom: showSteps ? '1px solid #e5e7eb' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#6b7280',
          fontWeight: '700',
          fontFamily: 'inherit',
        }}
      >
        <span>📋 {route.steps?.length || 0} Steps</span>
        <span>{showSteps ? '▲ Hide Steps' : '▼ Show Steps'}</span>
      </button>

      {/* ── STEPS ── */}
      {showSteps && (
        <div style={{ padding: '12px', background: '#fafafa' }}>
          {route.steps?.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      )}

      {/* Note */}
      {route.note && (
        <div style={{
          margin: '0 12px 12px',
          background: '#eff6ff',
          borderRadius: '10px',
          padding: '10px',
          border: '1px solid #bfdbfe',
          fontSize: '12px',
          color: '#1e40af',
        }}>
          ℹ️ {route.note}
        </div>
      )}
    </div>
  );
};

// ─── MAIN ROUTE PANEL ─────────────────────────────────────────
const RoutePanel = () => {
  const {
    routes,
    selectedRoute,
    setSelectedRoute,
    showPanel,
    clearRoutes,
    origin,
    destination,
  } = useMap();

  const [activeIdx, setActiveIdx] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  if (!showPanel || routes.length === 0) return null;

  const handleSelect = (route, idx) => {
    setSelectedRoute(route);
    setActiveIdx(idx);
  };

  const getModeIcon = (route) => {
    const map = {
      bus: '🚌', transit: '🚌', train: '🚂',
      metro: '🚇', car: '🚗', bike: '🏍️',
      walk: '🚶', cab: '🚕', multimodal: '🗺️',
    };
    return map[route.subMode || route.mode] || '📍';
  };

  const getModeLabel = (route) => {
    const map = {
      bus: 'Bus', transit: 'Transit', train: 'Train',
      metro: 'Metro', car: 'Car', bike: 'Bike',
      walk: 'Walk', cab: 'Cab', multimodal: 'Multi',
    };
    return map[route.subMode || route.mode] || route.mode;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 1000,
      background: 'white',
      borderRadius: '24px 24px 0 0',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
      maxHeight: collapsed ? '75px' : '78vh',
      overflow: 'hidden',
      transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── DRAG HANDLE ── */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '12px',
          paddingBottom: '8px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: '40px', height: '4px',
          background: '#d1d5db',
          borderRadius: '4px',
        }}/>
      </div>

      {/* ── PANEL HEADER ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px 10px',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: '17px',
            fontWeight: '900',
            color: '#111827',
          }}>
            🗺️ {routes.length} Routes Found
          </div>
          <div style={{
            fontSize: '11px',
            color: '#9ca3af',
            marginTop: '2px',
          }}>
            📍 {origin?.name?.substring(0, 22)}
            {origin?.name?.length > 22 ? '...' : ''}
            {' → '}
            🏁 {destination?.name?.substring(0, 22)}
            {destination?.name?.length > 22 ? '...' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Railways helpline */}
          <a href="tel:139" style={{
            background: '#fef3c7',
            color: '#d97706',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '800',
            textDecoration: 'none',
          }}>🚂 139</a>

          {/* Close */}
          <button onClick={clearRoutes} style={{
            background: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '10px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'inherit',
          }}>✕ Close</button>
        </div>
      </div>

      {/* ── MODE TABS ── */}
      {!collapsed && (
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '0 16px 12px',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {routes.map((route, i) => {
            const isActive = activeIdx === i;
            const tabColors = {
              bus: '#9c27b0', transit: '#9c27b0',
              train: '#dc2626', metro: '#2563eb',
              car: '#1565c0', bike: '#e65100',
              walk: '#16a34a', cab: '#d97706',
              multimodal: '#4338ca',
            };
            const col = tabColors[route.subMode || route.mode] || '#6b7280';

            return (
              <button
                key={i}
                onClick={() => handleSelect(route, i)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '8px 14px',
                  borderRadius: '14px',
                  border: `2px solid ${isActive ? col : '#e5e7eb'}`,
                  background: isActive ? `${col}18` : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  minWidth: '64px',
                }}
              >
                <span style={{ fontSize: '22px' }}>{getModeIcon(route)}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: isActive ? col : '#9ca3af',
                }}>
                  {getModeLabel(route)}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: isActive ? col : '#d1d5db',
                  fontWeight: '600',
                }}>
                  {formatMins(route.duration)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── SCROLLABLE CONTENT ── */}
      {!collapsed && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 12px',
          paddingBottom: '20px',
        }}>

          {/* Selected Route Details */}
          {selectedRoute && (
            <RouteCard route={selectedRoute} isSelected={true} />
          )}

          {/* ── EMERGENCY CONTACTS ── */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
            borderRadius: '18px',
            padding: '14px',
            border: '1px solid #c7d2fe',
            marginBottom: '14px',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#3730a3',
              marginBottom: '10px',
            }}>
              📞 Quick Contacts
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}>
              {[
                { name: 'Indian Railways', num: '139', icon: '🚂' },
                { name: 'Ola Cabs', num: '033-66000600', icon: '🟡' },
                { name: 'KSRTC Karnataka', num: '1800-425-1900', icon: '🚌' },
                { name: 'Emergency', num: '112', icon: '🚨' },
              ].map((c, i) => (
                <a key={i} href={`tel:${c.num}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  textDecoration: 'none',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  <div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#374151',
                      lineHeight: 1.3,
                    }}>{c.name}</div>
                    <div style={{
                      fontSize: '11px',
                      color: '#2563eb',
                      fontWeight: '700',
                    }}>{c.num}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── ALL ROUTES COMPARISON ── */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '18px',
            padding: '14px',
            border: '1px solid #e5e7eb',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#374151',
              marginBottom: '10px',
            }}>
              📊 Compare All Routes
            </div>
            {routes.map((route, i) => (
              <button
                key={i}
                onClick={() => handleSelect(route, i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: activeIdx === i ? '#eff6ff' : 'white',
                  border: `1.5px solid ${activeIdx === i ? '#93c5fd' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  marginBottom: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{getModeIcon(route)}</span>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#111827',
                    }}>{route.title}</div>
                    <div style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '1px',
                    }}>
                      {formatMins(route.duration)}
                      {route.distance ? ` • ${(route.distance / 1000).toFixed(0)}km` : ''}
                      {' • '}
                      {route.bookingRequired ? 'Book Required' : 'No Booking'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {route.fare > 0 && (
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '900',
                      color: '#059669',
                    }}>₹{route.fare}+</span>
                  )}
                  {route.isRealRoute && (
                    <div style={{
                      fontSize: '9px',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}>🛣️ Real Route</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePanel;