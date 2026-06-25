import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TRAFFIC_ROUTE = [
  new THREE.Vector3( 70,  0,  80),   // Bus Stand
  new THREE.Vector3( 55,  0,  40),   // Near IT Park
  new THREE.Vector3( 20,  0,  20),   // Admin area
  new THREE.Vector3(  0,  0, -30),   // Academic core
  new THREE.Vector3(-40,  0, -25),   // EEE / West block
  new THREE.Vector3(-85,  0,  20),   // Sports Ground
  new THREE.Vector3(-75,  0,  50),   // Ladies Hostel
  new THREE.Vector3( 70,  0,  70),   // Back to Bus Stand
];

const VEHICLES = [
  { id: 'car1', type: 'car', color: '#c0392b', speed: 10, startSeg: 1, progress: 0.1 },
  { id: 'car2', type: 'car', color: '#2980b9', speed: 9,  startSeg: 4, progress: 0.4 },
  { id: 'bike1', type: 'bike', color: '#27ae60', speed: 13, startSeg: 2, progress: 0.7 },
  { id: 'bike2', type: 'bike', color: '#8e44ad', speed: 12, startSeg: 5, progress: 0.2 },
  { id: 'auto1', type: 'auto', color: '#f1c40f', speed: 8,  startSeg: 6, progress: 0.0 },
];

// ── 3D Car Mesh ──────────────────────────────────────────────────
function CarMesh({ color }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.5, 0.6, 3.2]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.9, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.45, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 0.9, 0.72]}>
        <boxGeometry args={[1.25, 0.35, 0.05]} />
        <meshStandardMaterial color="#6ab0e8" transparent opacity={0.6} />
      </mesh>
      {/* Wheels */}
      {[[-0.8, -0.9], [0.8, -0.9], [-0.8, 0.9], [0.8, 0.9]].map(([x, z], i) => (
        <mesh key={i} position={[x * 0.9, 0.22, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 10]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
      {/* Headlights */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 1.62]}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
          <meshStandardMaterial color="#ffeedd" emissive="#ffffcc" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ── 3D Bike Mesh ─────────────────────────────────────────────────
function BikeMesh({ color }) {
  return (
    <group>
      {/* Main frame */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.25, 0.5, 1.4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 0.85, 0.4]}>
        <boxGeometry args={[0.9, 0.08, 0.08]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.65, -0.2]}>
        <boxGeometry args={[0.3, 0.08, 0.45]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Rider box representation */}
      <mesh position={[0, 1.0, -0.1]} castShadow>
        <boxGeometry args={[0.45, 0.7, 0.45]} />
        <meshStandardMaterial color="#2471a3" roughness={0.7} />
      </mesh>
      {/* Rider Helmet */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.3} />
      </mesh>
      {/* Wheels */}
      {[-0.6, 0.6].map((z, i) => (
        <mesh key={i} position={[0, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.15, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── 3D Auto Rickshaw Mesh ────────────────────────────────────────
function AutoMesh() {
  const yellow = '#f1c40f';
  const green = '#27ae60';
  const black = '#222';

  return (
    <group>
      {/* Lower green body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.3, 0.6, 2.3]} />
        <meshStandardMaterial color={green} roughness={0.5} />
      </mesh>
      {/* Yellow canopy roof */}
      <mesh position={[0, 1.3, -0.1]} castShadow>
        <boxGeometry args={[1.34, 0.1, 1.8]} />
        <meshStandardMaterial color={yellow} roughness={0.5} />
      </mesh>
      {/* Cabin pillars */}
      {[[-0.6, -0.8], [0.6, -0.8], [-0.6, 0.8], [0.6, 0.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.95, z]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color={black} />
        </mesh>
      ))}
      {/* Rear wheels (double) */}
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={i} position={[x * 0.72, 0.28, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.2, 10]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
      {/* Front wheel (single steering) */}
      <mesh position={[0, 0.28, 0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.18, 10]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Front headlight */}
      <mesh position={[0, 0.6, 1.16]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#ffeedd" emissive="#ffffcc" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ── Single Traffic Vehicle Tracker ───────────────────────────────
function TrafficVehicle({ type, color, speed, startSeg, initialProgress }) {
  const ref = useRef();
  const segIndex = useRef(startSeg);
  const segProgress = useRef(initialProgress);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const currentSeg = segIndex.current;
    const from = TRAFFIC_ROUTE[currentSeg];
    const to = TRAFFIC_ROUTE[(currentSeg + 1) % TRAFFIC_ROUTE.length];
    const segLen = from.distanceTo(to);
    
    // Increment progress
    const step = (speed * delta) / segLen;
    segProgress.current += step;

    if (segProgress.current >= 1) {
      segProgress.current = 0;
      segIndex.current = (currentSeg + 1) % TRAFFIC_ROUTE.length;
    }

    const t = segProgress.current;
    ref.current.position.lerpVectors(from, to, t);

    // Rotate to face travel direction
    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    if (dir.lengthSq() > 0) {
      const angle = Math.atan2(dir.x, dir.z);
      ref.current.rotation.y = angle;
    }
  });

  return (
    <group ref={ref}>
      {type === 'car' && <CarMesh color={color} />}
      {type === 'bike' && <BikeMesh color={color} />}
      {type === 'auto' && <AutoMesh />}
    </group>
  );
}

export default function Traffic() {
  return (
    <group>
      {VEHICLES.map((v) => (
        <TrafficVehicle
          key={v.id}
          type={v.type}
          color={v.color}
          speed={v.speed}
          startSeg={v.startSeg}
          initialProgress={v.progress}
        />
      ))}
    </group>
  );
}
