import React from 'react';

const LoadingOverlay = () => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 2000,
    background: 'rgba(255,255,255,0.92)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center'
  }}>
    {/* Spinning ring */}
    <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '20px' }}>
      <div style={{
        width: '80px', height: '80px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px'
      }}>🚌</div>
    </div>

    <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>
      Finding Routes...
    </div>
    <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>
      Searching all transport options across India
    </div>

    {/* Transport icons */}
    <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '28px' }}>
      {['🚌', '🚂', '🚇', '🛺', '🚕'].map((icon, i) => (
        <span key={i} style={{
          animation: `pulse 1.5s ${i * 0.2}s infinite`
        }}>{icon}</span>
      ))}
    </div>

    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }
    `}</style>
  </div>
);

export default LoadingOverlay;