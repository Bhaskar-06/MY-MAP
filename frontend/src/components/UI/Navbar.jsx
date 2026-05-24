import React from 'react';

const Navbar = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    background: 'white',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    {/* Left: Logo + Title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px', height: '40px',
        background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        boxShadow: '0 4px 12px rgba(29,78,216,0.3)'
      }}>🚌</div>

      <div>
        <div style={{
          fontSize: '17px', fontWeight: '800',
          color: '#111827', lineHeight: 1.2
        }}>TransitMap India</div>
        <div style={{
          fontSize: '11px', color: '#6b7280',
          lineHeight: 1.2
        }}>Public Transport • Every Destination</div>
      </div>
    </div>

    {/* Right: Badge */}
    <div style={{
      background: '#dcfce7',
      color: '#16a34a',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700'
    }}>🇮🇳 All India</div>
  </div>
);

export default Navbar;