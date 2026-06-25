import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS, ZONE_COLORS } from '../data/campusData';

const MAP_SIZE = 340;
const WORLD = 240;
const scale = MAP_SIZE / WORLD;

const worldToMap = (wx, wz) => ({
  x: (wx + WORLD / 2) * scale,
  y: (wz + WORLD / 2) * scale,
});

export default function MiniMap() {
  const canvasRef = useRef();
  const [open, setOpen] = useState(false);
  const playerPos = useGameStore((s) => s.playerPosition);
  const visitedBuildings = useGameStore((s) => s.visitedBuildings);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < MAP_SIZE; i += 22) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, MAP_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(MAP_SIZE, i); ctx.stroke();
    }

    // Roads
    ctx.fillStyle = '#3a3a3a';
    // Main vertical spine
    const rv = worldToMap(-4.5, -130);
    ctx.fillRect(rv.x, rv.y, 9 * scale, 210 * scale);
    // Horizontal roads
    const rh1 = worldToMap(-110, 24);
    ctx.fillRect(rh1.x, rh1.y, 220 * scale, 8 * scale);
    const rh2 = worldToMap(-110, -64);
    ctx.fillRect(rh2.x, rh2.y, 220 * scale, 6 * scale);
    // Side roads
    const rs1 = worldToMap(-74, -60);
    ctx.fillRect(rs1.x, rs1.y, 8 * scale, 130 * scale);
    const rs2 = worldToMap(66, -60);
    ctx.fillRect(rs2.x, rs2.y, 8 * scale, 130 * scale);

    // Footpaths
    ctx.fillStyle = '#5a4a30';
    [[-24, -120, 4, 180], [20, -120, 4, 180]].forEach(([x, z, w, l]) => {
      const fp = worldToMap(x, z);
      ctx.fillRect(fp.x, fp.y, w * scale, l * scale);
    });

    // Buildings
    BUILDINGS.forEach((b) => {
      const visited = visitedBuildings.includes(b.name);
      const zoneColor = ZONE_COLORS[b.zone] || '#aaa';
      const pos = worldToMap(b.position[0] - b.size[0] / 2, b.position[2] - b.size[2] / 2);
      const bw = b.size[0] * scale;
      const bh = b.size[2] * scale;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(pos.x + 2, pos.y + 2, bw, bh);

      // Building fill
      if (visited) {
        ctx.fillStyle = zoneColor;
      } else {
        ctx.fillStyle = 'rgba(160,160,160,0.25)';
      }
      ctx.fillRect(pos.x, pos.y, bw, bh);

      // Border
      ctx.strokeStyle = visited ? '#fff' : 'rgba(150,150,150,0.4)';
      ctx.lineWidth = visited ? 1 : 0.5;
      ctx.strokeRect(pos.x, pos.y, bw, bh);

      // Label
      const cx = pos.x + bw / 2;
      const cy = pos.y + bh / 2;
      ctx.fillStyle = visited ? '#fff' : '#999';
      ctx.font = `bold ${Math.max(6, Math.min(9, bw / 4))}px Inter,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Word wrap for small boxes
      const label = b.name.length > 10 ? b.name.split(' ')[0] : b.name;
      ctx.fillText(label, cx, cy - 2);

      // Emoji
      if (bw > 14) {
        ctx.font = `${Math.max(8, Math.min(12, bw / 3))}px serif`;
        ctx.fillText(b.emoji, cx, cy + 6);
      }
    });

    // Campus gate
    ctx.fillStyle = '#c8a870';
    const gate = worldToMap(-6, 85);
    ctx.fillRect(gate.x, gate.y, 2 * scale, 5 * scale);
    const gate2 = worldToMap(4, 85);
    ctx.fillRect(gate2.x, gate2.y, 2 * scale, 5 * scale);

    // Player dot
    const pp = worldToMap(playerPos[0], playerPos[2]);
    // Pulse ring
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,50,50,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Dot
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3333';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Compass
    const cx2 = MAP_SIZE - 22, cy2 = 22;
    ctx.beginPath();
    ctx.arc(cx2, cy2, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', cx2, cy2 - 5);
    ctx.fillStyle = '#fff';
    ctx.fillText('↑', cx2, cy2 + 3);

    // Stats footer
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, MAP_SIZE - 28, MAP_SIZE, 28);
    ctx.fillStyle = '#aaa';
    ctx.font = '9px Inter,sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`  Visited: ${visitedBuildings.length}/13 buildings`, 4, MAP_SIZE - 14);
    ctx.fillStyle = '#ff3333';
    ctx.fillText('●', MAP_SIZE - 60, MAP_SIZE - 14);
    ctx.fillStyle = '#ccc';
    ctx.fillText(' You', MAP_SIZE - 54, MAP_SIZE - 14);

  }, [open, playerPos, visitedBuildings]);

  return (
    <>
      {/* Map toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1100,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg, #1a4080, #2d6abf)'
            : 'rgba(10,20,40,0.88)',
          border: `2px solid ${open ? '#4a9edd' : 'rgba(255,255,255,0.2)'}`,
          color: '#fff',
          fontSize: 22,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: open
            ? '0 0 20px rgba(74,158,221,0.5)'
            : '0 4px 16px rgba(0,0,0,0.6)',
          transition: 'all 0.25s ease',
          backdropFilter: 'blur(10px)',
        }}
        title="Toggle Campus Map (M)"
      >
        🗺️
      </button>

      {/* Full Map Overlay */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 84,
          right: 20,
          zIndex: 1050,
          borderRadius: 16,
          overflow: 'hidden',
          border: '2px solid rgba(74,158,221,0.5)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(74,158,221,0.2)',
          animation: 'mapSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(10,20,40,0.98), rgba(20,40,80,0.98))',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(74,158,221,0.3)',
            fontFamily: "'Inter', sans-serif",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🗺️</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>KEC Campus Map</span>
              <span style={{
                background: 'rgba(74,158,221,0.2)', border: '1px solid rgba(74,158,221,0.4)',
                color: '#4a9edd', fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
              }}>
                167 Acres
              </span>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#aaa', width: 24, height: 24, borderRadius: '50%',
              cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={MAP_SIZE}
            height={MAP_SIZE}
            style={{ display: 'block' }}
          />

          {/* Legend */}
          <div style={{
            background: 'rgba(8,14,28,0.97)',
            padding: '10px 14px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 14px',
            fontFamily: "'Inter', sans-serif",
          }}>
            {[
              { color: '#f5d55a', label: 'Admin' },
              { color: '#4a9edd', label: 'Tech' },
              { color: '#3498db', label: 'Academic' },
              { color: '#F5C518', label: 'Transport' },
              { color: '#27ae60', label: 'Residential' },
              { color: '#8B7355', label: 'Events' },
              { color: '#f39c12', label: 'Amenities' },
              { color: '#2ecc71', label: 'Sports' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ color: '#aaa', fontSize: 10 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes mapSlideIn {
          from { opacity: 0; transform: scale(0.85) translateY(10px); transform-origin: bottom right; }
          to   { opacity: 1; transform: scale(1) translateY(0); transform-origin: bottom right; }
        }
      `}</style>
    </>
  );
}
