import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const points = useGameStore((s) => s.points);
  const badges = useGameStore((s) => s.badges);
  const missions = useGameStore((s) => s.missions);
  const nearbyBuilding = useGameStore((s) => s.nearbyBuilding);
  const toast = useGameStore((s) => s.toast);
  const showControls = useGameStore((s) => s.showControls);
  const dismissControls = useGameStore((s) => s.dismissControls);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const autoTime = useGameStore((s) => s.autoTime);
  const toggleAutoTime = useGameStore((s) => s.toggleAutoTime);
  const setTimeOfDay = useGameStore((s) => s.setTimeOfDay);
  const showMissions = useGameStore((s) => s.showMissions);
  const toggleMissions = useGameStore((s) => s.toggleMissions);
  const npcsTalked = useGameStore((s) => s.npcsTalked);
  const visitedBuildings = useGameStore((s) => s.visitedBuildings);

  const completedCount = missions.filter((m) => m.completed).length;
  const timeLabel = (() => {
    const h = Math.floor(timeOfDay * 24);
    const m = Math.floor((timeOfDay * 24 * 60) % 60);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m.toString().padStart(2, '0')} ${suffix}`;
  })();

  const isNight = timeOfDay < 0.22 || timeOfDay > 0.78;
  const timeIcon = isNight ? '🌙' : timeOfDay < 0.4 || timeOfDay > 0.65 ? '🌅' : '☀️';

  return (
    <>
      {/* Top Bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
        padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: 'none',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a4080, #2d6abf)',
            borderRadius: 10, padding: '6px 14px',
            color: '#fff', fontWeight: 800, fontSize: 16,
            letterSpacing: '0.05em',
            boxShadow: '0 2px 12px rgba(26,64,128,0.5)',
          }}>
            🏫 KEC Campus
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '4px 12px',
            color: '#f5c518', fontSize: 13, fontWeight: 600,
          }}>
            {nearbyBuilding ? `📍 ${nearbyBuilding.name}` : '📍 Campus'}
          </div>
        </div>

        {/* Right stats */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '5px 14px',
            color: '#f5c518', fontSize: 14, fontWeight: 700,
            border: '1px solid rgba(245,197,24,0.3)',
          }}>
            ⭐ {points} pts
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '5px 14px',
            color: '#aaddff', fontSize: 14,
            border: '1px solid rgba(100,170,255,0.3)',
          }}>
            🏅 {badges.length} badges
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '5px 14px',
            color: '#ccffcc', fontSize: 13,
            border: '1px solid rgba(100,255,100,0.2)',
          }}>
            {timeIcon} {timeLabel}
          </div>
        </div>
      </div>

      {/* Mission Panel */}
      <div style={{
        position: 'fixed', top: 70, right: 16, zIndex: 900,
        width: 280, fontFamily: "'Inter', sans-serif",
      }}>
        <button onClick={toggleMissions} style={{
          width: '100%', background: 'rgba(10,20,40,0.85)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: showMissions ? '12px 12px 0 0' : 12,
          color: '#fff', padding: '9px 14px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 13, fontWeight: 600, backdropFilter: 'blur(10px)',
          pointerEvents: 'all',
        }}>
          <span>📋 Missions ({completedCount}/{missions.length})</span>
          <span style={{ fontSize: 10, color: '#888' }}>{showMissions ? '▲ Hide' : '▼ Show'}</span>
        </button>
        {showMissions && (
          <div style={{
            background: 'rgba(8,14,30,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            maxHeight: 340, overflowY: 'auto',
          }}>
            {missions.map((m) => (
              <div key={m.id} style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                opacity: m.completed ? 0.55 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: m.completed ? '#6aff6a' : '#fff', fontSize: 12, fontWeight: 600 }}>
                    {m.completed ? '✅' : '⬜'} {m.title}
                  </div>
                </div>
                <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>{m.description}</div>
                {/* Progress for mission 3 */}
                {m.id === 3 && !m.completed && (
                  <div style={{ marginTop: 5 }}>
                    <div style={{ background: '#222', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                      <div style={{
                        background: '#3498db', height: '100%',
                        width: `${(m.count / m.required) * 100}%`,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    <div style={{ color: '#888', fontSize: 10, marginTop: 2 }}>
                      {m.count || 0}/{m.required} students
                    </div>
                  </div>
                )}
                {/* Progress for mission 2 */}
                {m.id === 2 && !m.completed && Array.isArray(m.trigger) && (
                  <div style={{ color: '#aaa', fontSize: 10, marginTop: 3 }}>
                    {m.trigger.map((t) => (
                      <span key={t} style={{
                        marginRight: 6, color: (m.visited || []).includes(t) ? '#6aff6a' : '#888'
                      }}>
                        {(m.visited || []).includes(t) ? '✅' : '⬜'} {t}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ color: '#f5c518', fontSize: 11, marginTop: 3 }}>🎁 {m.reward}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges panel */}
      {badges.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 200, right: 16, zIndex: 900,
          background: 'rgba(10,20,40,0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(245,197,24,0.3)', borderRadius: 12,
          padding: '10px 14px', fontFamily: "'Inter', sans-serif",
          maxWidth: 200,
        }}>
          <div style={{ color: '#f5c518', fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em' }}>
            🏆 BADGES
          </div>
          {badges.map((b, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: 6,
              padding: '4px 10px', marginBottom: 4,
              color: '#fff', fontSize: 12,
            }}>
              🏅 {b}
            </div>
          ))}
        </div>
      )}

      {/* Time control */}
      <div style={{
        position: 'fixed', bottom: 200, left: 16, zIndex: 900,
        background: 'rgba(10,20,40,0.85)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
        padding: '10px 14px', fontFamily: "'Inter', sans-serif",
        width: 180, pointerEvents: 'all',
      }}>
        <div style={{ color: '#aaa', fontSize: 11, marginBottom: 8, fontWeight: 600 }}>🕐 TIME CONTROL</div>
        <input type="range" min="0" max="100" value={Math.floor(timeOfDay * 100)}
          onChange={(e) => setTimeOfDay(e.target.value / 100)}
          style={{ width: '100%', marginBottom: 6 }} />
        <button onClick={toggleAutoTime} style={{
          width: '100%', background: autoTime ? '#2ecc71' : '#555',
          border: 'none', borderRadius: 6, color: '#fff',
          padding: '5px 0', fontSize: 12, cursor: 'pointer',
        }}>
          {autoTime ? '⏸ Pause Time' : '▶ Auto Time'}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3000,
          background: 'linear-gradient(135deg, #1a4080, #2d6abf)',
          color: '#fff', padding: '16px 32px', borderRadius: 16,
          fontSize: 16, fontWeight: 700, textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 8px 40px rgba(0,0,0,0.8)',
          animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}>
          {toast}
          <style>{`
            @keyframes popIn {
              from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Controls help */}
      {showControls && (
        <div style={{
          position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 900, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
          borderRadius: 12, padding: '12px 24px',
          fontFamily: "'Inter', sans-serif",
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          justifyContent: 'center', pointerEvents: 'all',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          {[
            { key: 'WASD', desc: 'Move' },
            { key: 'SHIFT', desc: 'Sprint' },
            { key: 'MOUSE', desc: 'Look' },
            { key: 'E', desc: 'Enter Building' },
            { key: 'V', desc: 'Camera' },
            { key: 'CLICK', desc: 'Lock Mouse' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: 6,
                padding: '3px 8px', color: '#fff', fontSize: 11, fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.25)',
              }}>{c.key}</span>
              <span style={{ color: '#aaa', fontSize: 11 }}>{c.desc}</span>
            </div>
          ))}
          <button onClick={dismissControls} style={{
            background: 'transparent', border: 'none', color: '#666',
            cursor: 'pointer', fontSize: 11, marginLeft: 8,
          }}>✕ dismiss</button>
        </div>
      )}

      {/* Visited counter */}
      <div style={{
        position: 'fixed', top: 70, left: 16, zIndex: 900,
        background: 'rgba(10,20,40,0.85)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
        padding: '10px 16px', fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ color: '#888', fontSize: 10, fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em' }}>
          🗺️ EXPLORED
        </div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, textAlign: 'center' }}>
          {visitedBuildings.length}<span style={{ fontSize: 14, color: '#666' }}>/13</span>
        </div>
      </div>
    </>
  );
}
