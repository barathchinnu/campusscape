import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// Campus bus route stops (world positions)
export const BUS_ROUTE = [
  new THREE.Vector3(70, 0, 80),   // Bus Stand
  new THREE.Vector3(55, 0, 40),   // Near IT Park
  new THREE.Vector3(20, 0, 20),   // Admin area
  new THREE.Vector3(0, 0, -30),   // Academic core
  new THREE.Vector3(-40, 0, -25),   // EEE / West block
  new THREE.Vector3(-85, 0, 20),   // Sports Ground
  new THREE.Vector3(-75, 0, 50),   // Ladies Hostel
  new THREE.Vector3(70, 0, 70),   // Back to Bus Stand
];

export const STOP_NAMES = [
  'Bus Stand 🚏',
  'IT Park Stop 💻',
  'Admin Block Stop 🏛️',
  'Academic Core Stop 🎓',
  'West Block Stop ⚡',
  'Sports Ground Stop 🏟️',
  'Hostel Stop 🏡',
  'Bus Stand 🚏',
];

const NORMAL_SPEED = 7.0;
const EXPRESS_SPEED = 20.0;
const BOARD_DIST = 8.0;

// ── 3D Realistic Bus Model ───────────────────────────────────────
function BusMesh({ busRef, speedFactor }) {
  const yellow = '#f39c12';
  const glass = '#aed6f1';
  const metal = '#7f8c8d';

  // Refs for rotating wheels
  const flWheel = useRef();
  const frWheel = useRef();
  const blWheel = useRef();
  const brWheel = useRef();

  // Ref for exhaust smoke particle
  const smokeParticles = useRef([]);

  useFrame((_, delta) => {
    // Spin wheels based on movement speed
    const rotationSpeed = speedFactor * delta * 5;
    if (flWheel.current) flWheel.current.rotation.x += rotationSpeed;
    if (frWheel.current) frWheel.current.rotation.x += rotationSpeed;
    if (blWheel.current) blWheel.current.rotation.x += rotationSpeed;
    if (brWheel.current) brWheel.current.rotation.x += rotationSpeed;

    // Exhaust smoke logic
    if (smokeParticles.current.length < 5 && Math.random() < 0.15) {
      smokeParticles.current.push({
        pos: new THREE.Vector3(-0.9, 0.35, -3.7),
        scale: 0.12,
        opacity: 0.8,
        life: 1.0,
      });
    }

    smokeParticles.current.forEach((p, idx) => {
      p.pos.z -= delta * 1.5;
      p.pos.y += delta * 0.5;
      p.scale += delta * 0.3;
      p.opacity -= delta * 0.9;
      p.life -= delta * 0.9;

      if (p.life <= 0) {
        smokeParticles.current.splice(idx, 1);
      }
    });
  });

  return (
    <group ref={busRef}>
      {/* 1. Chassis/Floor */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.15, 7.5]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>

      {/* Front Bumper & Grille */}
      <mesh position={[0, 0.55, 3.8]} castShadow>
        <boxGeometry args={[2.35, 0.4, 0.15]} />
        <meshStandardMaterial color="#111" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 3.89]}>
        <boxGeometry args={[1.2, 0.2, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.9} />
      </mesh>

      {/* Headlights throwing Spotlights */}
      {[-0.88, 0.88].map((x, i) => (
        <group key={i} position={[x, 0.65, 3.85]}>
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#ffffcc" emissiveIntensity={1.5} />
          </mesh>
          <spotLight
            position={[0, 0, 0]}
            target-position={[x, 0, 15]}
            angle={Math.PI / 6}
            penumbra={0.5}
            intensity={1.2}
            castShadow
          />
        </group>
      ))}

      {/* 2. Side Pillars and Roof (Hollow interior walls) */}
      {/* Left Wall pillars */}
      <mesh position={[1.12, 1.6, -1.8]} castShadow>
        <boxGeometry args={[0.06, 2.2, 3.8]} />
        <meshStandardMaterial color={yellow} roughness={0.4} />
      </mesh>
      {/* Left Window frames */}
      {[-3.0, -1.0, 1.0, 2.8].map((z, i) => (
        <mesh key={`lw-${i}`} position={[1.12, 1.8, z]}>
          <boxGeometry args={[0.02, 1.0, 1.2]} />
          <meshStandardMaterial color={glass} transparent opacity={0.4} metalness={0.5} />
        </mesh>
      ))}

      {/* Right Wall pillars */}
      <mesh position={[-1.12, 1.6, -1.8]} castShadow>
        <boxGeometry args={[0.06, 2.2, 3.8]} />
        <meshStandardMaterial color={yellow} roughness={0.4} />
      </mesh>
      {/* Right Window frames */}
      {[-3.0, -1.0, 1.0, 2.8].map((z, i) => (
        <mesh key={`rw-${i}`} position={[-1.12, 1.8, z]}>
          <boxGeometry args={[0.02, 1.0, 1.2]} />
          <meshStandardMaterial color={glass} transparent opacity={0.4} metalness={0.5} />
        </mesh>
      ))}

      {/* Back Wall */}
      <mesh position={[0, 1.6, -3.72]} castShadow>
        <boxGeometry args={[2.3, 2.2, 0.06]} />
        <meshStandardMaterial color={yellow} roughness={0.4} />
      </mesh>
      {/* Back Glass */}
      <mesh position={[0, 1.8, -3.76]}>
        <boxGeometry args={[1.6, 0.8, 0.02]} />
        <meshStandardMaterial color={glass} transparent opacity={0.5} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <boxGeometry args={[2.34, 0.1, 7.54]} />
        <meshStandardMaterial color={yellow} roughness={0.5} />
      </mesh>

      {/* Front Windshield Glass */}
      <mesh position={[0, 1.85, 3.72]} rotation={[-Math.PI / 16, 0, 0]}>
        <boxGeometry args={[2.1, 1.4, 0.04]} />
        <meshStandardMaterial color={glass} transparent opacity={0.45} metalness={0.8} />
      </mesh>

      {/* 3. Interior Seats */}
      {/* Driver Seat & Steering */}
      <group position={[0.6, 0.52, 2.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.12, 0.6]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0, 0.38, -0.2]} castShadow>
          <boxGeometry args={[0.55, 0.65, 0.1]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        {/* Steering Wheel */}
        <group position={[0, 0.72, 0.4]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 12]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color="#7f8c8d" />
          </mesh>
        </group>
      </group>

      {/* Driver NPC Mesh sitting at Steering wheel */}
      <group position={[0.6, 0.85, 2.3]}>
        {/* Torso */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.6, 0.35]} />
          <meshStandardMaterial color="#3498db" />
        </mesh>
        {/* Head & Driver Cap */}
        <mesh position={[0, 0.52, 0]} castShadow>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#ffcc99" />
        </mesh>
        <mesh position={[0, 0.7, 0.05]}>
          <boxGeometry args={[0.24, 0.08, 0.26]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        {/* Arms holding steering */}
        <mesh position={[-0.2, 0.1, 0.25]} rotation={[Math.PI / 6, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color="#3498db" />
        </mesh>
        <mesh position={[0.2, 0.1, 0.25]} rotation={[Math.PI / 6, 0, Math.PI / 8]}>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color="#3498db" />
        </mesh>
      </group>

      {/* Passenger Seats rows */}
      {/* Left side row seats */}
      {[-2.5, -1.4, -0.3, 0.8, 1.9].map((z, idx) => (
        <group key={`lseat-${idx}`} position={[-0.6, 0.52, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.1, 0.5]} />
            <meshStandardMaterial color="#2980b9" />
          </mesh>
          <mesh position={[0, 0.36, -0.22]} castShadow>
            <boxGeometry args={[0.5, 0.6, 0.08]} />
            <meshStandardMaterial color="#2980b9" />
          </mesh>
        </group>
      ))}
      {/* Right side row seats */}
      {[-2.5, -1.4, -0.3, 0.8, 1.9].map((z, idx) => (
        <group key={`rseat-${idx}`} position={[0.6, 0.52, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.1, 0.5]} />
            <meshStandardMaterial color="#2980b9" />
          </mesh>
          <mesh position={[0, 0.36, -0.22]} castShadow>
            <boxGeometry args={[0.5, 0.6, 0.08]} />
            <meshStandardMaterial color="#2980b9" />
          </mesh>
        </group>
      ))}

      {/* 4. Wheels */}
      <group ref={flWheel} position={[1.2, 0.45, 2.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.26, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={frWheel} position={[-1.2, 0.45, 2.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.26, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={blWheel} position={[1.2, 0.45, -2.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.32, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={brWheel} position={[-1.2, 0.45, -2.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.32, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>

      {/* Animated smoke particle display inside 3D group */}
      {smokeParticles.current.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.scale, 5, 5]} />
          <meshStandardMaterial color="#7f8c8d" transparent opacity={p.opacity} flatShading />
        </mesh>
      ))}

      {/* Destination Scrolling Sign */}
      <mesh position={[0, 2.45, 3.76]}>
        <boxGeometry args={[1.5, 0.22, 0.02]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Text position={[0, 2.45, 3.79]} fontSize={0.14} color="#f39c12" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        KEC EXPRESS BUS
      </Text>
    </group>
  );
}

// ── Translucent Dashboard HUD Overlay (No blocker) ───────────────
function BusHUDOverlay({ onExit, currentStop, nextStop, progress }) {
  const busTargetStop = useGameStore((s) => s.busTargetStop);
  const setBusTargetStop = useGameStore((s) => s.setBusTargetStop);

  const handleSelectStop = (e) => {
    const val = e.target.value;
    if (val === '') {
      setBusTargetStop(null);
    } else {
      setBusTargetStop(parseInt(val, 10));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: 480,
      fontFamily: "'Inter', sans-serif",
      pointerEvents: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Dashboard container */}
      <div style={{
        background: 'rgba(10, 15, 30, 0.85)',
        border: '2px solid #f39c12',
        borderRadius: 18,
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(243,156,18,0.25)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🚌</span>
            <span style={{ fontWeight: 800, color: '#f39c12', letterSpacing: '0.05em' }}>KONGU BUS SERVICE</span>
          </div>
          <span style={{
            fontSize: 10,
            background: busTargetStop !== null ? '#2ecc71' : '#f39c12',
            color: '#000',
            padding: '2px 8px',
            borderRadius: 12,
            fontWeight: 800,
          }}>
            {busTargetStop !== null ? '⚡ EXPRESS AUTO-DRIVE' : '🐢 REGULAR CRUISE'}
          </span>
        </div>

        {/* Current & Next Stop details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px' }}>
            <span style={{ fontSize: 9, color: '#aaa', display: 'block', marginBottom: 2 }}>CURRENT STOP</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f39c12' }}>{currentStop}</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px' }}>
            <span style={{ fontSize: 9, color: '#aaa', display: 'block', marginBottom: 2 }}>NEXT STOP</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#3498db' }}>{nextStop}</span>
          </div>
        </div>

        {/* Route progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#aaa', marginBottom: 3 }}>
            <span>ROUTE PROGRESS</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #f39c12, #f1c40f)',
              transition: 'width 0.2s',
            }} />
          </div>
        </div>

        {/* Driver Control selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 12,
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>DRIVER:</span>
            <select
              value={busTargetStop !== null ? busTargetStop : ''}
              onChange={handleSelectStop}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 12,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">-- Choose Stop / Drive Route --</option>
              {STOP_NAMES.slice(0, -1).map((s, idx) => (
                <option key={idx} value={idx}>🏁 Go to {s}</option>
              ))}
            </select>
          </div>
          <button
            onClick={onExit}
            style={{
              background: '#e74c3c',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(231,76,60,0.3)',
            }}
          >
            Exit (B)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Bus Component ───────────────────────────────────────────
export default function Bus() {
  const busRef = useRef();
  const segmentRef = useRef(0);
  const segProgressRef = useRef(0);
  const routeProgress = useRef(0);

  const isBoarded = useGameStore((s) => s.isBoarded);
  const setIsBoarded = useGameStore((s) => s.setIsBoarded);
  const setBusPosition = useGameStore((s) => s.setBusPosition);
  const setBusRotation = useGameStore((s) => s.setBusRotation);
  const busTargetStop = useGameStore((s) => s.busTargetStop);
  const setBusTargetStop = useGameStore((s) => s.setBusTargetStop);

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(NORMAL_SPEED);

  const playerPos = useGameStore((s) => s.playerPosition);
  const showToast = useGameStore((s) => s.showToast);
  const visitBuilding = useGameStore((s) => s.visitBuilding);

  // Key listener for B boarding
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'b') {
        if (isBoarded) {
          setIsBoarded(false);
          setBusTargetStop(null);
          showToast('👟 Exited the bus.');
        } else {
          if (!busRef.current) return;
          const dist = new THREE.Vector3(...playerPos).distanceTo(busRef.current.position);
          if (dist < BOARD_DIST) {
            setIsBoarded(true);
            visitBuilding('Bus Stand');
            showToast('🚌 Sitting in passenger seat. Tell the driver where to go!');
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPos, isBoarded]);

  useFrame((_, delta) => {
    if (!busRef.current) return;

    // Check if driver has a direct command destination stop
    let speed = NORMAL_SPEED;
    if (busTargetStop !== null) {
      const targetSeg = busTargetStop;
      const currentSeg = segmentRef.current;

      if (currentSeg === targetSeg && segProgressRef.current < 0.05) {
        // We have arrived at the destination!
        setBusTargetStop(null);
        showToast(`🔔 Arrived at destination: ${STOP_NAMES[targetSeg]}!`);
        speed = 0; // stop briefly
      } else {
        // Driver rides fast to destination stop!
        speed = EXPRESS_SPEED;
      }
    }

    setCurrentSpeed(speed);

    // Bus movement interpolation along route segments
    const seg = segmentRef.current;
    const from = BUS_ROUTE[seg];
    const to = BUS_ROUTE[(seg + 1) % BUS_ROUTE.length];
    const segLen = from.distanceTo(to);

    // Increment segment progress
    if (speed > 0) {
      const step = (speed * delta) / segLen;
      segProgressRef.current += step;

      if (segProgressRef.current >= 1) {
        segProgressRef.current = 0;
        segmentRef.current = (seg + 1) % (BUS_ROUTE.length - 1);
      }
    }

    // Set bus position
    const t = segProgressRef.current;
    busRef.current.position.lerpVectors(from, to, t);

    // Set bus rotation
    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    if (dir.lengthSq() > 0) {
      const angle = Math.atan2(dir.x, dir.z);
      busRef.current.rotation.y = angle;
    }

    // Update shared store values so Player camera follows bus position
    setBusPosition([busRef.current.position.x, busRef.current.position.y, busRef.current.position.z]);
    setBusRotation(busRef.current.rotation.y);

    // Calculate total route progress
    const totalSegs = BUS_ROUTE.length - 1;
    routeProgress.current = (segmentRef.current + segProgressRef.current) / totalSegs;

    // Proximity boarding prompt
    if (!isBoarded) {
      const dist = new THREE.Vector3(...playerPos).distanceTo(busRef.current.position);
      setShowPrompt(dist < BOARD_DIST);
    } else {
      setShowPrompt(false);
    }
  });

  const seg = segmentRef.current;
  const curStop = STOP_NAMES[seg] || STOP_NAMES[0];
  const nextStop = STOP_NAMES[(seg + 1) % STOP_NAMES.length] || STOP_NAMES[1];

  return (
    <>
      <BusMesh busRef={busRef} speedFactor={currentSpeed} />

      {/* Proximity text above the bus */}
      {showPrompt && (
        <Html position={[0, 4.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#f39c12',
            color: '#000',
            fontWeight: 800,
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            🚌 Press B to Board Bus
          </div>
        </Html>
      )}

      {/* Premium Dashboard control overlay */}
      {isBoarded && (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
          <BusHUDOverlay
            onExit={() => {
              setIsBoarded(false);
              setBusTargetStop(null);
              showToast('👟 Exited the bus.');
            }}
            currentStop={curStop}
            nextStop={nextStop}
            progress={routeProgress.current}
          />
        </Html>
      )}
    </>
  );
}
