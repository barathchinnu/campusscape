import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../data/campusData';

const SPEED = 0.18;
const SPRINT_MULT = 2.2;
const CAM_DISTANCE = 14;
const CAM_HEIGHT = 7;
const PROXIMITY_DIST = 14;

export default function Player() {
  const playerRef = useRef();
  const keysRef = useRef({});
  const yawRef = useRef(0);
  const pitchRef = useRef(-0.2);
  const walkPhase = useRef(0);
  const { camera } = useThree();
  const [cameraMode, setCameraMode] = useState('third');
  const [isSprinting, setIsSprinting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const setNearbyBuilding = useGameStore((s) => s.setNearbyBuilding);
  const nearbyBuilding = useGameStore((s) => s.nearbyBuilding);
  const openInfoPanel = useGameStore((s) => s.openInfoPanel);
  const visitBuilding = useGameStore((s) => s.visitBuilding);
  const visitedBuildings = useGameStore((s) => s.visitedBuildings);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);

  useEffect(() => {
    const down = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'v') setCameraMode((p) => (p === 'third' ? 'first' : 'third'));
      if (e.key.toLowerCase() === 'e' && nearbyBuilding) {
        openInfoPanel(nearbyBuilding);
        visitBuilding(nearbyBuilding.name);
      }
    };
    const up = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    const onMouse = (e) => {
      if (!document.pointerLockElement) return;
      const s = 0.002;
      yawRef.current -= e.movementX * s;
      pitchRef.current -= e.movementY * s;
      pitchRef.current = Math.max(-0.6, Math.min(0.3, pitchRef.current));
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [nearbyBuilding, openInfoPanel, visitBuilding]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const sprint = !!keysRef.current['shift'];
    const speed = SPEED * (sprint ? SPRINT_MULT : 1);

    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const dir = new THREE.Vector3();

    if (keysRef.current['w']) dir.add(forward);
    if (keysRef.current['s']) dir.sub(forward);
    if (keysRef.current['d']) dir.add(right);
    if (keysRef.current['a']) dir.sub(right);

    const moving = dir.lengthSq() > 0;
    setIsMoving(moving);
    setIsSprinting(sprint && moving);

    if (moving) {
      dir.normalize();
      const nextPos = playerRef.current.position.clone().addScaledVector(dir, speed);

      // Simple boundary + building collision
      nextPos.x = Math.max(-90, Math.min(90, nextPos.x));
      nextPos.z = Math.max(-120, Math.min(70, nextPos.z));

      playerRef.current.position.copy(nextPos);
      const faceYaw = Math.atan2(-dir.x, -dir.z);
      playerRef.current.rotation.y = THREE.MathUtils.lerp(playerRef.current.rotation.y, faceYaw, 0.18);
      walkPhase.current += speed * 8;
    }

    // Walk bob animation on legs/body
    const bob = moving ? Math.sin(walkPhase.current) * 0.08 : 0;
    playerRef.current.position.y = 0 + bob * 0.3;

    // Camera
    const pp = playerRef.current.position;
    setPlayerPosition([pp.x, pp.y, pp.z]);

    const lookTarget = new THREE.Vector3(
      pp.x + Math.cos(pitch) * -Math.sin(yaw),
      pp.y + 2 + Math.sin(pitch),
      pp.z + Math.cos(pitch) * -Math.cos(yaw)
    );

    if (cameraMode === 'third') {
      const camPos = new THREE.Vector3(
        pp.x + Math.sin(yaw) * CAM_DISTANCE,
        pp.y + CAM_HEIGHT + pitch * 4,
        pp.z + Math.cos(yaw) * CAM_DISTANCE
      );
      camera.position.lerp(camPos, 0.1);
      camera.lookAt(lookTarget);
    } else {
      camera.position.set(pp.x, pp.y + 1.8, pp.z);
      camera.lookAt(lookTarget);
    }

    // Building proximity
    let closest = null;
    let minDist = PROXIMITY_DIST;
    BUILDINGS.forEach((b) => {
      const bPos = new THREE.Vector3(b.position[0], b.position[1], b.position[2]);
      const d = pp.distanceTo(bPos);
      if (d < minDist) { minDist = d; closest = b; }
    });
    setNearbyBuilding(closest);
  });

  return (
    <group ref={playerRef} position={[0, 0, 45]}>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.38, 1.0, 8, 16]} />
        <meshStandardMaterial color={isSprinting ? '#e74c3c' : '#3498db'} roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#f0c8a0" roughness={0.7} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.38, 0]} castShadow>
        <sphereGeometry args={[0.33, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.12, 2.18, 0.28]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.12, 2.18, 0.28]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Left Arm */}
      <mesh position={[0.52, 1.2, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.12, 0.55, 4, 8]} />
        <meshStandardMaterial color={isSprinting ? '#c0392b' : '#2980b9'} />
      </mesh>
      {/* Right Arm */}
      <mesh position={[-0.52, 1.2, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.12, 0.55, 4, 8]} />
        <meshStandardMaterial color={isSprinting ? '#c0392b' : '#2980b9'} />
      </mesh>
      {/* Left Leg */}
      <mesh position={[0.2, 0.1, 0]}>
        <capsuleGeometry args={[0.14, 0.65, 4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Right Leg */}
      <mesh position={[-0.2, 0.1, 0]}>
        <capsuleGeometry args={[0.14, 0.65, 4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Name tag */}
      {cameraMode === 'third' && (
        <Text position={[0, 2.9, 0]} fontSize={0.4} color="white" anchorX="center"
          outlineWidth={0.04} outlineColor="#000">
          YOU
        </Text>
      )}

      {/* E prompt near building */}
      {nearbyBuilding && !visitedBuildings.includes(nearbyBuilding.name) && (
        <Html position={[0, 3.6, 0]} center distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '4px 10px',
            borderRadius: 8, fontSize: 13, whiteSpace: 'nowrap', fontFamily: 'Inter,sans-serif',
            border: '1px solid #f5a623'
          }}>
            Press <b style={{ color: '#f5a623' }}>E</b> to enter {nearbyBuilding.emoji} {nearbyBuilding.name}
          </div>
        </Html>
      )}
      {nearbyBuilding && visitedBuildings.includes(nearbyBuilding.name) && (
        <Html position={[0, 3.6, 0]} center distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.6)', color: '#aaffaa', padding: '4px 10px',
            borderRadius: 8, fontSize: 12, fontFamily: 'Inter,sans-serif'
          }}>
            Press <b>E</b> to revisit {nearbyBuilding.name}
          </div>
        </Html>
      )}
    </group>
  );
}
