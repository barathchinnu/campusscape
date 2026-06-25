import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { CharacterBody } from './NPC';

const GUIDE_POSITION = [0, 0, 35]; // right in front of admin block path
const TALK_DIST = 4.0;

// Campus Guide Knowledge Base
const GUIDE_QA = [
  {
    q: 'Where is the Placement Cell?',
    a: 'The Placement Cell is located in the Central Admin Block, on the 1st floor. It coordinates placements with top global companies!',
  },
  {
    q: 'How large is the KEC Campus?',
    a: 'Kongu Engineering College is massive! It spans over 167 acres of lush green campus in Perundurai, Erode.',
  },
  {
    q: 'Where is the Food Court?',
    a: 'The Food Court is located at the South side of the campus (coordinates X: 0, Z: -75). They serve delicious South Indian meals, snacks, and fresh juices!',
  },
  {
    q: 'What are the college timings?',
    a: 'Academic classes run from 8:45 AM to 4:45 PM. The Library remains open until 8:00 PM for students.',
  },
  {
    q: 'How many buses does KEC run?',
    a: 'KEC operates a fleet of over 80 iconic yellow buses connecting Erode, Coimbatore, Salem, Tirupur, and Karur.',
  },
  {
    q: 'Who is the Principal?',
    a: 'The Principal of Kongu Engineering College is Dr. V. Balusamy, a visionary leader driving excellence in engineering education.',
  },
];

export default function CampusGuide() {
  const guideRef = useRef();
  const playerPos = useGameStore((s) => s.playerPosition);
  
  const [nearGuide, setNearGuide] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [guideAnswer, setGuideAnswer] = useState('Welcome to KEC! Ask me anything about our campus.');

  const refs = {
    hipsRef: useRef(), spineRef: useRef(), shoulderGrpRef: useRef(),
    lThighRef: useRef(), rThighRef: useRef(), lShinRef: useRef(), rShinRef: useRef(),
    lAnkleRef: useRef(), rAnkleRef: useRef(), lArmRef: useRef(), rArmRef: useRef(),
    lForearmRef: useRef(), rForearmRef: useRef(), headRef: useRef(),
  };

  useFrame(() => {
    if (!guideRef.current) return;
    const dist = guideRef.current.position.distanceTo(new THREE.Vector3(...playerPos));
    const isClose = dist < TALK_DIST;
    setNearGuide(isClose);
    if (!isClose && chatOpen) {
      setChatOpen(false);
    }
  });

  // Listen to E key to open chat
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'e' && nearGuide) {
        setChatOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nearGuide]);

  const handleQuestionSelect = (qa) => {
    setGuideAnswer(qa.a);
    speakText(qa.a);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.toLowerCase();
    let foundAnswer = "I'm not sure about that detail. Try asking where the placement cell or food court is!";

    // Simple keyword matching search
    for (const item of GUIDE_QA) {
      const qWords = item.q.toLowerCase().split(' ');
      const matches = qWords.filter(word => word.length > 3 && query.includes(word));
      if (matches.length >= 2 || (query.includes('placement') && item.q.includes('Placement')) || (query.includes('size') && item.q.includes('large'))) {
        foundAnswer = item.a;
        break;
      }
    }

    setGuideAnswer(foundAnswer);
    speakText(foundAnswer);
    setUserQuery('');
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <group ref={guideRef} position={GUIDE_POSITION}>
      {/* 3D Guide mesh: orange/yellow shirt to differentiate */}
      <CharacterBody shirt="#e67e22" skin="#f3c299" pants="#2c3e50" shoes="#222" refs={refs} />

      {/* Name Text */}
      <Text position={[0, 2.5, 0]} fontSize={0.28} color="#e67e22" anchorX="center" outlineWidth={0.03} outlineColor="#000">
        AI Campus Guide
      </Text>

      {/* Near prompt */}
      {nearGuide && !chatOpen && (
        <Html position={[0, 3.2, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(230,126,34,0.95)', color: '#fff',
            padding: '6px 12px', borderRadius: 8, fontSize: 12,
            whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)', fontWeight: 700,
          }}>
            💬 Press E to Talk to Guide
          </div>
        </Html>
      )}

      {/* Full Guide UI Modal */}
      {chatOpen && (
        <Html fullscreen>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1800,
            background: 'rgba(5, 10, 20, 0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(3px)',
            pointerEvents: 'auto',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1f1105 0%, #0d0702 100%)',
              border: '2px solid #e67e22',
              borderRadius: 20,
              width: 480,
              padding: '24px',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 12px 40px rgba(230,126,34,0.3)',
              position: 'relative',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(230,126,34,0.3)', paddingBottom: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#e67e22' }}>ℹ️ KEC Campus AI Guide</span>
                <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#ffbb88', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>

              {/* Guide Answer bubble */}
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                borderLeft: '4px solid #e67e22',
                padding: 16,
                borderRadius: '0 12px 12px 0',
                fontSize: 14,
                lineHeight: 1.5,
                marginBottom: 20,
                minHeight: 80,
              }}>
                {guideAnswer}
              </div>

              {/* Predefined Questions list */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700, marginBottom: 8 }}>SUGGESTED QUESTIONS:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {GUIDE_QA.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuestionSelect(item)}
                      style={{
                        background: 'rgba(230,126,34,0.12)',
                        border: '1px solid rgba(230,126,34,0.25)',
                        color: '#ffb380',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(230,126,34,0.22)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(230,126,34,0.12)'}
                    >
                      ❓ {item.q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Or type a question (e.g. Placement Cell)..."
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(230,126,34,0.4)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#e67e22',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Ask
                </button>
              </form>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
