import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../data/campusData';
import * as THREE from 'three';

export default function GPSNav() {
  const playerPosition = useGameStore((s) => s.playerPosition);
  const gpsTarget = useGameStore((s) => s.gpsTarget);
  const setGpsTarget = useGameStore((s) => s.setGpsTarget);
  const [distance, setDistance] = useState(0);
  const [directionText, setDirectionText] = useState('Select target');
  const [arrow, setArrow] = useState('⬆');

  useEffect(() => {
    if (!gpsTarget) return;

    const px = playerPosition[0];
    const pz = playerPosition[2];
    const tx = gpsTarget.position[0];
    const tz = gpsTarget.position[2];

    // Calculate distance
    const dx = tx - px;
    const dz = tz - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    // 1 unit in our campus space corresponds roughly to 3 meters (since the campus is 167 acres, spread is ~200 units)
    const distMetres = Math.round(dist * 3);
    setDistance(distMetres);

    if (distMetres < 12) {
      setDirectionText('You have arrived at your destination! 🎉');
      setArrow('🏁');
      return;
    }

    // Direction calculation
    // Get angle from player to target (in X-Z plane)
    const angleToTarget = Math.atan2(dx, dz); // relative to Z-axis (South)

    // Player yaw (rotation.y) is facing direction. Let's find player rotation by finding active player element if we can, 
    // or just assume we face the movement direction. Actually, we can get player direction relative to camera angle or movement.
    // Let's compute relative angle. For simplicity, since the map has North as -Z and South as +Z,
    // let's give the arrow relative to the global coordinates or assume player looks North by default, or just show directional instruction.
    // Let's compute:
    // If target is north of player (dz < 0), and we want to go north:
    // We can show:
    // - If dz < -10 and Math.abs(dx) < 15: "⬆ Walk North (Straight)"
    // - If dz > 10 and Math.abs(dx) < 15: "⬇ Walk South"
    // - If dx > 10 and Math.abs(dz) < 15: "➡ Turn East (Right)"
    // - If dx < -10 and Math.abs(dz) < 15: "⬅ Turn West (Left)"
    // Even better, let's calculate relative direction based on player's current coordinate alignment, or absolute campus direction:
    if (Math.abs(dx) > Math.abs(dz)) {
      if (dx > 0) {
        setDirectionText('Turn East (Right)');
        setArrow('➡');
      } else {
        setDirectionText('Turn West (Left)');
        setArrow('⬅');
      }
    } else {
      if (dz < 0) {
        setDirectionText('Walk North (Forward)');
        setArrow('⬆');
      } else {
        setDirectionText('Turn South (Backward)');
        setArrow('⬇');
      }
    }
  }, [playerPosition, gpsTarget]);

  const handleSelect = (e) => {
    const id = e.target.value;
    if (!id) {
      setGpsTarget(null);
    } else {
      const found = BUILDINGS.find(b => b.id === id);
      setGpsTarget(found);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 70,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      fontFamily: "'Inter', sans-serif",
      pointerEvents: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      {/* Target Selector Dropdown */}
      <div style={{
        background: 'rgba(10, 20, 45, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: '6px 12px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        <span style={{ fontSize: 13, color: '#f5c518', fontWeight: 700 }}>🗺️ GPS TARGET:</span>
        <select 
          onChange={handleSelect}
          value={gpsTarget?.id || ''}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 12,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">-- No Destination Selected --</option>
          {BUILDINGS.map(b => (
            <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>
          ))}
        </select>
        {gpsTarget && (
          <button 
            onClick={() => setGpsTarget(null)}
            style={{
              background: '#e74c3c',
              border: 'none',
              borderRadius: 4,
              color: '#fff',
              padding: '2px 8px',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Google Maps Style Navigation Banner */}
      {gpsTarget && (
        <div style={{
          background: 'linear-gradient(135deg, #0f2d1e 0%, #071f12 100%)',
          border: '2px solid #2ecc71',
          borderRadius: 16,
          width: 320,
          padding: '12px 18px',
          boxShadow: '0 8px 32px rgba(46, 204, 113, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: '#fff',
          animation: 'slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Navigation Arrow Circle */}
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#2ecc71',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 800,
            color: '#071f12',
            boxShadow: '0 0 15px rgba(46,204,113,0.6)',
          }}>
            {arrow}
          </div>

          {/* Details */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#2ecc71', fontWeight: 800, letterSpacing: '0.05em' }}>
              NAVIGATION ACTIVE
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 1 }}>
              {directionText}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span>Distance:</span>
              <strong style={{ color: '#fff', fontSize: 13 }}>{distance} m</strong>
            </div>
          </div>
          <style>{`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
