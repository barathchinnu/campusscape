import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../data/campusData';
import { CharacterBody, animateWalk } from './NPC';

const SPEED          = 0.18;
const SPRINT_MULT    = 2.2;
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
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'v') setCameraMode((p) => (p === 'third' ? 'first' : 'third'));
      if (e.key.toLowerCase() === 'e' && nearbyBuilding) {
        openInfoPanel(nearbyBuilding);
        visitBuilding(nearbyBuilding.name);
      }
    };
    const up      = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
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
    const speed  = SPEED * (sprint ? SPRINT_MULT : 1);

    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
    const dir     = new THREE.Vector3();

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
      nextPos.x = Math.max(-110, Math.min(110, nextPos.x));
      nextPos.z = Math.max(-130, Math.min(90,  nextPos.z));
      playerRef.current.position.copy(nextPos);
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y, Math.atan2(-dir.x, -dir.z), 0.18
      );
      walkPhase.current += speed * (sprint ? 9 : 7);
    }

    // GTA-style walk
    const swing   = moving ? (sprint ? 0.72 : 0.52) : 0;
    const knee    = moving ? (sprint ? 0.88 : 0.68) : 0;
    animateWalk(refs, walkPhase.current, swing, knee, moving, 0.045);

    playerRef.current.position.y = moving ? Math.abs(Math.sin(walkPhase.current)) * 0.025 * 0.5 : 0;

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
