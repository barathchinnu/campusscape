import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 4, 8]} />
        <meshStandardMaterial color="#6b4c2a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[2.2, 3.5, 8]} />
        <meshStandardMaterial color="#1a6b2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 7.2, 0]} castShadow>
        <coneGeometry args={[1.6, 3, 8]} />
        <meshStandardMaterial color="#1e7a30" roughness={0.8} />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow>
        <coneGeometry args={[1, 2.5, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PalmTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 7, 8]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i}
          position={[Math.sin(i * 1.05) * 1.9, 7.2, Math.cos(i * 1.05) * 1.9]}
          rotation={[Math.sin(i * 1.05) * 0.55, 0, Math.cos(i * 1.05) * 0.55]}>
          <boxGeometry args={[0.14, 0.08, 3]} />
          <meshStandardMaterial color="#2d6a2d" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function LampPost({ position }) {
  const isNight = useGameStore((s) => s.timeOfDay < 0.22 || s.timeOfDay > 0.78);
  return (
    <group position={position}>
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 7, 6]} />
        <meshStandardMaterial color="#555" metalness={0.6} />
      </mesh>
      <mesh position={[0, 7.3, 0]}>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshStandardMaterial
          color={isNight ? '#fffbe0' : '#ffe888'}
          emissive={isNight ? '#fffbe0' : '#000'}
          emissiveIntensity={isNight ? 2 : 0}
        />
      </mesh>
    </group>
  );
}

function CollegeBus() {
  const busRef = useRef();
  const t = useRef(0);
  const route = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.5, 80),
    new THREE.Vector3(90, 0.5, 50),
    new THREE.Vector3(90, 0.5, -60),
    new THREE.Vector3(0, 0.5, -120),
    new THREE.Vector3(-90, 0.5, -60),
    new THREE.Vector3(-90, 0.5, 50),
  ], true);

  useFrame((_, delta) => {
    if (!busRef.current) return;
    t.current = (t.current + delta * 0.035) % 1;
    const pos = route.getPoint(t.current);
    const tang = route.getTangent(t.current);
    busRef.current.position.copy(pos);
    busRef.current.rotation.y = Math.atan2(tang.x, tang.z);
  });

  return (
    <group ref={busRef}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[3, 3.2, 8.5]} />
        <meshStandardMaterial color="#F5C518" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[2.8, 0.5, 8]} />
        <meshStandardMaterial color="#e8b800" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.2, 4.3]}>
        <boxGeometry args={[2.4, 1.8, 0.08]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      {[-2.5, 0, 2.5].map((z, i) => (
        <mesh key={i} position={[1.51, 2.2, z]}>
          <boxGeometry args={[0.05, 1.2, 1.4]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.65} />
        </mesh>
      ))}
      {[-3, 3].map((z, i) => (
        <mesh key={i} position={[0, 0.6, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.62, 0.62, 3.1, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 1.6, 4.3]}>
          <circleGeometry args={[0.28, 12]} />
          <meshStandardMaterial color="#fffbe0" emissive="#fffbe0" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function Environment() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const autoTime = useGameStore((s) => s.autoTime);
  const setTimeOfDay = useGameStore((s) => s.setTimeOfDay);
  const lightRef = useRef();

  useFrame((_, delta) => {
    if (autoTime) setTimeOfDay((useGameStore.getState().timeOfDay + delta * 0.008) % 1);
    if (lightRef.current) {
      const angle = timeOfDay * Math.PI * 2 - Math.PI / 2;
      lightRef.current.position.set(Math.cos(angle) * 100, Math.abs(Math.sin(angle)) * 100 + 5, 40);
    }
  });

  const sunAngle = timeOfDay * Math.PI * 2;
  const sunEl = Math.sin(sunAngle - Math.PI / 2);
  const isNight = timeOfDay < 0.22 || timeOfDay > 0.78;
  const isSunset = timeOfDay > 0.6 && timeOfDay < 0.78;
  const isSunrise = timeOfDay > 0.22 && timeOfDay < 0.35;
  const ambientInt = isNight ? 0.15 : Math.max(0.4, sunEl * 1.5 + 0.4);
  const dirInt = isNight ? 0 : Math.max(0, sunEl * 2.5 + 0.3);
  const sunPos = [Math.cos(sunAngle) * 100, Math.abs(Math.sin(sunAngle - Math.PI / 2)) * 100 + 5, 40];
  const lightColor = isSunset || isSunrise ? '#ff9944' : '#fffbe8';

  // Tree positions along the main paths
  const treePositions = [
    // Main road sides
    ...[-90,-70,-50,-30,-10,10,30,50,70,90].map(z => [-14, 0, z]),
    ...[-90,-70,-50,-30,-10,10,30,50,70,90].map(z => [14, 0, z]),
    // Horizontal road
    ...[-80,-60,-40,-20,20,40,60,80].map(x => [x, 0, -58]),
    // Corners & scattered
    [-85, 0, -85],[-65, 0, -85],[-45, 0, -90],[45, 0, -90],[65, 0, -85],[85, 0, -85],
    [-85, 0, 80],[85, 0, 80],[-85, 0, 0],[85, 0, 0],
  ];

  const palmPositions = [
    [-40, 0, 5],[-30, 0, 5],[30, 0, -45],[50, 0, -45],
    [20, 0, 40],[60, 0, 55],[-60, 0, 35],[-50, 0, -35],
  ];

  const lampPositions = [
    ...[-80,-55,-30,-5,20,45,70].map(z => [-10, 0, z]),
    ...[-80,-55,-30,-5,20,45,70].map(z => [10, 0, z]),
    ...[-70,-50,-30,-10,10,30,50,70].map(x => [x, 0, -57]),
  ];

  return (
    <>
      {/* Sky */}
      {!isNight ? (
        <Sky sunPosition={sunPos} inclination={0.48} azimuth={0.25} turbidity={8} rayleigh={2} />
      ) : (
        <>
          <color attach="background" args={['#050a14']} />
          <Stars radius={130} depth={50} count={6000} factor={4} saturation={0} fade />
        </>
      )}

      {/* Lighting */}
      <ambientLight intensity={ambientInt} color={isNight ? '#2a2a44' : '#fff8e8'} />
      <directionalLight
        ref={lightRef}
        position={sunPos}
        intensity={dirInt}
        color={lightColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={250}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
      />
      {isNight && <pointLight position={[0, 25, 0]} intensity={0.6} color="#334466" distance={200} />}

      {/* ─── MAIN GRASS GROUND ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 280]} />
        <meshStandardMaterial color={isNight ? '#1a2a1a' : '#4a7c3f'} roughness={0.9} />
      </mesh>

      {/* ─── ROADS ─── */}
      {/* Main vertical road (entrance spine) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -20]} receiveShadow>
        <planeGeometry args={[10, 220]} />
        <meshStandardMaterial color="#555" roughness={0.95} />
      </mesh>
      {/* Centre-line markings */}
      {[-90,-70,-50,-30,-10,10,30,50,70,90].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}>
          <planeGeometry args={[0.4, 4.5]} />
          <meshStandardMaterial color="#fff" roughness={0.7} />
        </mesh>
      ))}

      {/* Horizontal road connecting all zones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -60]} receiveShadow>
        <planeGeometry args={[220, 8]} />
        <meshStandardMaterial color="#555" roughness={0.95} />
      </mesh>
      {/* Front horizontal road near entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 28]} receiveShadow>
        <planeGeometry args={[200, 8]} />
        <meshStandardMaterial color="#555" roughness={0.95} />
      </mesh>

      {/* Side access roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-70, 0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 130]} />
        <meshStandardMaterial color="#555" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[70, 0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 130]} />
        <meshStandardMaterial color="#555" roughness={0.95} />
      </mesh>

      {/* ─── FOOTPATHS ─── */}
      {[[-24, 0, -20], [24, 0, -20], [-24, 0, 50], [24, 0, 50]].map(([x, y, z], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, z]} receiveShadow>
          <planeGeometry args={[4, 140]} />
          <meshStandardMaterial color="#c8b090" roughness={0.85} />
        </mesh>
      ))}

      {/* ─── ENTRANCE PLAZA ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 68]} receiveShadow>
        <planeGeometry args={[50, 25]} />
        <meshStandardMaterial color="#b8a888" roughness={0.8} />
      </mesh>
      {/* KEC roundel */}
      <mesh position={[0, 0.15, 68]}>
        <cylinderGeometry args={[7, 7, 0.3, 32]} />
        <meshStandardMaterial color="#c8a870" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.35, 68]}>
        <cylinderGeometry args={[5, 5, 0.2, 32]} />
        <meshStandardMaterial color="#1a4080" roughness={0.3} />
      </mesh>

      {/* ─── CAMPUS GATE ─── */}
      {[-7, 7].map((x, i) => (
        <mesh key={i} position={[x, 6, 88]} castShadow>
          <boxGeometry args={[1.4, 12, 1.4]} />
          <meshStandardMaterial color="#c8a870" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 12.5, 88]} castShadow>
        <boxGeometry args={[15.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#c8a870" roughness={0.4} />
      </mesh>
      {/* KEC name arch */}
      <mesh position={[0, 10, 88]}>
        <boxGeometry args={[12, 1, 0.3]} />
        <meshStandardMaterial color="#1a4080" roughness={0.3} />
      </mesh>

      {/* ─── TREES ─── */}
      {treePositions.map((p, i) => (
        <Tree key={`t-${i}`} position={p} scale={0.85 + (i % 3) * 0.12} />
      ))}
      {palmPositions.map((p, i) => (
        <PalmTree key={`palm-${i}`} position={p} scale={1} />
      ))}

      {/* ─── LAMP POSTS ─── */}
      {lampPositions.map((p, i) => (
        <LampPost key={`lp-${i}`} position={p} />
      ))}

      {/* ─── COLLEGE BUS ─── */}
      <CollegeBus />

      {/* ─── BOUNDARY WALLS ─── */}
      <mesh position={[0, 2, -135]}>
        <boxGeometry args={[260, 4, 1.2]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2, 95]}>
        <boxGeometry args={[260, 4, 1.2]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.8} />
      </mesh>
      <mesh position={[-128, 2, -20]}>
        <boxGeometry args={[1.2, 4, 230]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.8} />
      </mesh>
      <mesh position={[128, 2, -20]}>
        <boxGeometry args={[1.2, 4, 230]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.8} />
      </mesh>
    </>
  );
}
