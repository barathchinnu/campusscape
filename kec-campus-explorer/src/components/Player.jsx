import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../data/campusData';
import { CharacterBody, animateWalk } from './NPC';

const MAX_SPEED      = 0.22;
const SPRINT_MULT    = 2.0;
const ACCEL          = 0.12;   // acceleration lerp factor
const DECEL          = 0.10;   // deceleration lerp factor
const CAM_DISTANCE   = 14;
const CAM_HEIGHT     = 7;
const PROXIMITY_DIST = 14;

export default function Player() {
  const playerRef     = useRef();
  const hipsRef       = useRef();
  const spineRef      = useRef();
  const shoulderGrpRef= useRef();
  const lThighRef     = useRef();
  const rThighRef     = useRef();
  const lShinRef      = useRef();
  const rShinRef      = useRef();
  const lAnkleRef     = useRef();
  const rAnkleRef     = useRef();
  const lArmRef       = useRef();
  const rArmRef       = useRef();
  const lForearmRef   = useRef();
  const rForearmRef   = useRef();
  const headRef       = useRef();

  const keysRef    = useRef({});
  const yawRef     = useRef(0);
  const pitchRef   = useRef(-0.2);
  const walkPhase  = useRef(0);
  const velRef     = useRef(new THREE.Vector3()); // smooth velocity
  const { camera } = useThree();

  const [cameraMode, setCameraMode] = useState('third');
  const [isSprinting, setIsSprinting] = useState(false);
  const [isMoving,    setIsMoving]    = useState(false);

  const setNearbyBuilding = useGameStore((s) => s.setNearbyBuilding);
  const nearbyBuilding    = useGameStore((s) => s.nearbyBuilding);
  const openInfoPanel     = useGameStore((s) => s.openInfoPanel);
  const visitBuilding     = useGameStore((s) => s.visitBuilding);
  const visitedBuildings  = useGameStore((s) => s.visitedBuildings);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);

  const refs = { hipsRef, spineRef, shoulderGrpRef, lThighRef, rThighRef, lShinRef, rShinRef, lAnkleRef, rAnkleRef, lArmRef, rArmRef, lForearmRef, rForearmRef, headRef };

  useEffect(() => {
    const down = (e) => {
      // Support WASD + Arrow keys
      const k = e.key;
      if (k === 'ArrowUp')    keysRef.current['w'] = true;
      if (k === 'ArrowDown')  keysRef.current['s'] = true;
      if (k === 'ArrowLeft')  keysRef.current['a'] = true;
      if (k === 'ArrowRight') keysRef.current['d'] = true;
      keysRef.current[k.toLowerCase()] = true;
      if (k.toLowerCase() === 'v') setCameraMode((p) => (p === 'third' ? 'first' : 'third'));
      if (k.toLowerCase() === 'e' && nearbyBuilding) {
        openInfoPanel(nearbyBuilding);
        visitBuilding(nearbyBuilding.name);
      }
      // Prevent arrow keys from scrolling the page
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)) e.preventDefault();
    };
    const up = (e) => {
      const k = e.key;
      if (k === 'ArrowUp')    keysRef.current['w'] = false;
      if (k === 'ArrowDown')  keysRef.current['s'] = false;
      if (k === 'ArrowLeft')  keysRef.current['a'] = false;
      if (k === 'ArrowRight') keysRef.current['d'] = false;
      keysRef.current[k.toLowerCase()] = false;
    };
    const onMouse = (e) => {
      if (!document.pointerLockElement) return;
      yawRef.current   -= e.movementX * 0.002;
      pitchRef.current -= e.movementY * 0.002;
      pitchRef.current  = Math.max(-0.6, Math.min(0.3, pitchRef.current));
    };
    window.addEventListener('keydown',   down);
    window.addEventListener('keyup',     up);
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('keydown',   down);
      window.removeEventListener('keyup',     up);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [nearbyBuilding, openInfoPanel, visitBuilding]);

  useFrame(() => {
    if (!playerRef.current) return;

    const yaw    = yawRef.current;
    const pitch  = pitchRef.current;
    const sprint = !!keysRef.current['shift'];
    const topSpeed = MAX_SPEED * (sprint ? SPRINT_MULT : 1);

    // Build desired direction from input (camera-relative)
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
    const inputDir = new THREE.Vector3();

    if (keysRef.current['w']) inputDir.add(forward);
    if (keysRef.current['s']) inputDir.sub(forward);
    if (keysRef.current['d']) inputDir.add(right);
    if (keysRef.current['a']) inputDir.sub(right);

    const hasInput = inputDir.lengthSq() > 0;

    // Smooth velocity — accelerate toward target, decelerate when no input
    const vel = velRef.current;
    if (hasInput) {
      inputDir.normalize().multiplyScalar(topSpeed);
      vel.lerp(inputDir, ACCEL);
    } else {
      vel.lerp(new THREE.Vector3(0, 0, 0), DECEL);
    }

    const moving = vel.lengthSq() > 0.00005;
    setIsMoving(moving);
    setIsSprinting(sprint && hasInput);

    if (moving) {
      const nextPos = playerRef.current.position.clone().add(vel);
      nextPos.x = Math.max(-110, Math.min(110, nextPos.x));
      nextPos.z = Math.max(-130, Math.min(90,  nextPos.z));
      playerRef.current.position.copy(nextPos);

      // Smoothly rotate character to face movement direction
      const targetYaw = Math.atan2(-vel.x, -vel.z);
      const curYaw    = playerRef.current.rotation.y;
      // Shortest-path yaw lerp
      let diff = targetYaw - curYaw;
      while (diff >  Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      playerRef.current.rotation.y += diff * 0.14;

      walkPhase.current += vel.length() * (sprint ? 9 : 7);
    }

    // GTA-style walk animation
    const swing = moving ? (sprint ? 0.72 : 0.52) : 0;
    const knee  = moving ? (sprint ? 0.88 : 0.68) : 0;
    animateWalk(refs, walkPhase.current, swing, knee, moving, 0.045);

    playerRef.current.position.y = moving ? Math.abs(Math.sin(walkPhase.current)) * 0.012 : 0;

    // Camera
    const pp = playerRef.current.position;
    setPlayerPosition([pp.x, pp.y, pp.z]);
    const lookTarget = new THREE.Vector3(
      pp.x + Math.cos(pitch) * -Math.sin(yaw),
      pp.y + 2 + Math.sin(pitch),
      pp.z + Math.cos(pitch) * -Math.cos(yaw)
    );
    if (cameraMode === 'third') {
      camera.position.lerp(new THREE.Vector3(
        pp.x + Math.sin(yaw) * CAM_DISTANCE,
        pp.y + CAM_HEIGHT + pitch * 4,
        pp.z + Math.cos(yaw) * CAM_DISTANCE
      ), 0.1);
      camera.lookAt(lookTarget);
    } else {
      camera.position.set(pp.x, pp.y + 1.8, pp.z);
      camera.lookAt(lookTarget);
    }

    // Building proximity
    let closest = null, minDist = PROXIMITY_DIST;
    BUILDINGS.forEach((b) => {
      const d = pp.distanceTo(new THREE.Vector3(...b.position));
      if (d < minDist) { minDist = d; closest = b; }
    });
    setNearbyBuilding(closest);
  });

  const shirtColor = isSprinting ? '#c0392b' : '#2471a3';

  return (
    <group ref={playerRef} position={[0, 0, 45]}>
      <CharacterBody shirt={shirtColor} skin="#f0c8a0" pants="#1a252f" shoes="#111" refs={refs} />

      {cameraMode === 'third' && (
        <Text position={[0, 2.9, 0]} fontSize={0.36} color="white" anchorX="center" outlineWidth={0.04} outlineColor="#000">
          YOU
        </Text>
      )}

      {nearbyBuilding && !visitedBuildings.includes(nearbyBuilding.name) && (
        <Html position={[0, 3.5, 0]} center distanceFactor={10}>
          <div style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 13, whiteSpace: 'nowrap', fontFamily: 'Inter,sans-serif', border: '1px solid #f5a623' }}>
            Press <b style={{ color: '#f5a623' }}>E</b> to enter {nearbyBuilding.emoji} {nearbyBuilding.name}
          </div>
        </Html>
      )}
      {nearbyBuilding && visitedBuildings.includes(nearbyBuilding.name) && (
        <Html position={[0, 3.5, 0]} center distanceFactor={10}>
          <div style={{ background: 'rgba(0,0,0,0.6)', color: '#aaffaa', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>
            Press <b>E</b> to revisit {nearbyBuilding.name}
          </div>
        </Html>
      )}
    </group>
  );
}
