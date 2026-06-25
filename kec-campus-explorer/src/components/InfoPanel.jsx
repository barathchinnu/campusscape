import { useGameStore } from '../store/gameStore';

export default function InfoPanel() {
  const infoPanelOpen = useGameStore((s) => s.infoPanelOpen);
  const activeBuilding = useGameStore((s) => s.activeBuilding);
  const closeInfoPanel = useGameStore((s) => s.closeInfoPanel);

  if (!infoPanelOpen || !activeBuilding) return null;

  const { name, emoji, info, accentColor } = activeBuilding;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2000,
      width: 420,
      maxWidth: '90vw',
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: `2px solid ${accentColor}`,
      boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${accentColor}33`,
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
        borderBottom: `1px solid ${accentColor}44`,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <span style={{ fontSize: 42 }}>{emoji}</span>
        <div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{name}</div>
          <div style={{ color: accentColor, fontSize: 13, marginTop: 2 }}>KEC Campus</div>
        </div>
        <button onClick={closeInfoPanel} style={{
          marginLeft: 'auto',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: 32,
          height: 32,
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>✕</button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px' }}>
        <p style={{ color: '#c8d8e8', fontSize: 14, lineHeight: 1.7, margin: '0 0 16px' }}>
          {info.description}
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: accentColor, fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: '0.08em' }}>
            ✨ HIGHLIGHTS
          </div>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {info.highlights.map((h, i) => (
              <li key={i} style={{
                color: '#e0e8f0',
                fontSize: 13,
                padding: '5px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ color: accentColor }}>▸</span> {h}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '8px 14px',
            flex: 1,
          }}>
            <div style={{ color: '#888', fontSize: 11, marginBottom: 3 }}>⏰ HOURS</div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{info.timing}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '8px 14px',
            flex: 1,
          }}>
            <div style={{ color: '#888', fontSize: 11, marginBottom: 3 }}>📧 CONTACT</div>
            <div style={{ color: '#fff', fontSize: 12 }}>{info.contact}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 24px',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: '#666', fontSize: 12 }}>Press ESC or click ✕ to close</span>
        <button onClick={closeInfoPanel} style={{
          background: accentColor,
          border: 'none',
          color: '#fff',
          padding: '8px 20px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}>
          Got it! 👍
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, -45%) scale(0.92); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
