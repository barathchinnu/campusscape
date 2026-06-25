import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function PhotoMode() {
  const photoMode = useGameStore((s) => s.photoMode);
  const togglePhotoMode = useGameStore((s) => s.togglePhotoMode);
  const [filter, setFilter] = useState('none');
  const showToast = useGameStore((s) => s.showToast);

  const filters = [
    { id: 'none', name: '📷 Standard' },
    { id: 'contrast(1.2) saturate(1.3) sepia(0.15)', name: '🎬 Cinematic' },
    { id: 'grayscale(1)', name: '🎞️ B&W Classic' },
    { id: 'sepia(0.6) hue-rotate(-10deg) saturate(1.4)', name: '🌅 Golden Hour' },
    { id: 'invert(1) hue-rotate(180deg)', name: '🌌 Cyberpunk' },
  ];

  // Global key listener for P and Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'p') {
        togglePhotoMode();
      }
      if (e.key === ' ' && photoMode) {
        e.preventDefault();
        capturePhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePhotoMode, photoMode]);

  // Apply CSS filter to the canvas element
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      if (photoMode) {
        canvas.style.filter = filter;
        canvas.style.transition = 'filter 0.3s ease';
      } else {
        canvas.style.filter = 'none';
      }
    }
    return () => {
      if (canvas) canvas.style.filter = 'none';
    };
  }, [photoMode, filter]);

  const capturePhoto = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      showToast('❌ Error: Canvas not found!');
      return;
    }

    // Capture sound effect (optional/visual feedback)
    showToast('📸 Snap! Saving screenshot...');

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `kec_campus_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      showToast('❌ Failed to capture screenshot. (Context security limit)');
    }
  };

  if (!photoMode) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      pointerEvents: 'none',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Viewfinder Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff',
        pointerEvents: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, animation: 'blink 1.2s infinite' }}>🔴 REC</span>
          <span style={{ color: '#aaa', fontSize: 13 }}>PHOTO MODE ACTIVE</span>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                background: filter === f.id ? '#f5c518' : 'rgba(255,255,255,0.1)',
                color: filter === f.id ? '#000' : '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
        <button
          onClick={togglePhotoMode}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Close (P)
        </button>
      </div>

      {/* Viewfinder Corners (Visual decoration) */}
      <div style={{
        position: 'absolute',
        inset: '80px 40px',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Crosshair */}
        <div style={{ width: 16, height: 2, background: 'rgba(255,255,255,0.4)' }} />
        <div style={{ height: 16, width: 2, background: 'rgba(255,255,255,0.4)', position: 'absolute' }} />
      </div>

      {/* Bottom Shutter Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        color: '#fff',
        pointerEvents: 'auto',
      }}>
        {/* Shutter Button */}
        <button
          onClick={capturePhoto}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fff',
            border: '8px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255,255,255,0.4)',
            transition: 'all 0.1s active',
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.92)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#e74c3c',
            transition: 'all 0.2s',
          }} />
        </button>
        <div style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.08em' }}>
          CLICK SHUTTER OR PRESS SPACE TO CAPTURE
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
