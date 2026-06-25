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

  const droneMode         = useGameStore((s) => s.droneMode);
  const toggleDroneMode   = useGameStore((s) => s.toggleDroneMode);
  const photoMode         = useGameStore((s) => s.photoMode);
  const voiceAssistantActive = useGameStore((s) => s.voiceAssistantActive);
  const setVoiceAssistantActive = useGameStore((s) => s.setVoiceAssistantActive);

  // Bus sitting states
  const isBoarded         = useGameStore((s) => s.isBoarded);
  const busPosition       = useGameStore((s) => s.busPosition);
  const busRotation       = useGameStore((s) => s.busRotation);

  // Drone pan offset from player
  const droneOffsetRef = useRef(new THREE.Vector3(0, 0, 0));
  // Free camera position for photo mode
  const freeCamPosRef  = useRef(new THREE.Vector3(0, 0, 0));
  const freeCamInitialized = useRef(false);

  const refs = { hipsRef, spineRef, shoulderGrpRef, lThighRef, rThighRef, lShinRef, rShinRef, lAnkleRef, rAnkleRef, lArmRef, rArmRef, lForearmRef, rForearmRef, headRef };

  useEffect(() => {
    const down = (e) => {
      const k = e.key;
      if (k === 'ArrowUp')    keysRef.current['w'] = true;
      if (k === 'ArrowDown')  keysRef.current['s'] = true;
      if (k === 'ArrowLeft')  keysRef.current['a'] = true;
      if (k === 'ArrowRight') keysRef.current['d'] = true;
      keysRef.current[k.toLowerCase()] = true;

      // Controls
      if (k.toLowerCase() === 'c') setCameraMode((p) => (p === 'third' ? 'first' : 'third'));
      if (k.toLowerCase() === 'g') toggleDroneMode();
      if (k.toLowerCase() === 'v') setVoiceAssistantActive(!voiceAssistantActive);

      if (k.toLowerCase() === 'e' && nearbyBuilding) {
        openInfoPanel(nearbyBuilding);
        visitBuilding(nearbyBuilding.name);
      }
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
  }, [nearbyBuilding, openInfoPanel, visitBuilding, voiceAssistantActive]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const yaw    = yawRef.current;
    const pitch  = pitchRef.current;
    const sprint = !!keysRef.current['shift'];
    const topSpeed = MAX_SPEED * (sprint ? SPRINT_MULT : 1);

    const pp = playerRef.current.position;
    setPlayerPosition([pp.x, pp.y, pp.z]);

    // Direction vectors
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
    const inputDir = new THREE.Vector3();

    if (keysRef.current['w']) inputDir.add(forward);
    if (keysRef.current['s']) inputDir.sub(forward);
    if (keysRef.current['d']) inputDir.add(right);
    if (keysRef.current['a']) inputDir.sub(right);

    const hasInput = inputDir.lengthSq() > 0;
    const vel = velRef.current;

    if (droneMode) {
      // 1. DRONE MODE
      // Damping player movement
      vel.set(0, 0, 0);
      setIsMoving(false);
      setIsSprinting(false);
      animateWalk(refs, 0, 0, 0, false, 0);

      // Pan drone offset
      if (hasInput) {
        inputDir.normalize().multiplyScalar(40 * delta); // pan speed
        droneOffsetRef.current.add(inputDir);
      }

      // Position camera high above pan offset
      const targetCamPos = new THREE.Vector3(
        pp.x + droneOffsetRef.current.x,
        75,
        pp.z + droneOffsetRef.current.z
      );
      camera.position.lerp(targetCamPos, 0.1);

      // Look straight down (or slightly angled based on pitch)
      const lookPos = new THREE.Vector3(
        pp.x + droneOffsetRef.current.x,
        pp.y,
        pp.z + droneOffsetRef.current.z
      );
      camera.lookAt(lookPos);

      // Reset free cam
      freeCamInitialized.current = false;

    } else if (photoMode) {
      // 2. PHOTO MODE (Free Camera)
      // Damping player movement
      vel.set(0, 0, 0);
      setIsMoving(false);
      setIsSprinting(false);
      animateWalk(refs, 0, 0, 0, false, 0);

      // Initialize free cam to current player cam position if not done
      if (!freeCamInitialized.current) {
        const initialCamPos = new THREE.Vector3(
          pp.x + Math.sin(yaw) * CAM_DISTANCE,
          pp.y + CAM_HEIGHT,
          pp.z + Math.cos(yaw) * CAM_DISTANCE
        );
        freeCamPosRef.current.copy(initialCamPos);
        freeCamInitialized.current = true;
      }

      // Fly free cam based on input
      if (hasInput) {
        // Move in the actual 3D direction camera is facing
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0,1,0)).normalize();
        
        const moveVec = new THREE.Vector3();
        if (keysRef.current['w']) moveVec.add(camDir);
        if (keysRef.current['s']) moveVec.sub(camDir);
        if (keysRef.current['d']) moveVec.sub(camRight); // right vector is left-handed depending on cross
        if (keysRef.current['a']) moveVec.add(camRight);

        moveVec.normalize().multiplyScalar(30 * delta); // fly speed
        freeCamPosRef.current.add(moveVec);
      }

      camera.position.copy(freeCamPosRef.current);
      
      // Look forward based on mouse yaw/pitch
      const targetLook = new THREE.Vector3(
        freeCamPosRef.current.x + Math.cos(pitch) * -Math.sin(yaw),
        freeCamPosRef.current.y + Math.sin(pitch),
        freeCamPosRef.current.z + Math.cos(pitch) * -Math.cos(yaw)
      );
      camera.lookAt(targetLook);

    } else if (isBoarded) {
      // 3. SITTING ON THE BUS
      vel.set(0, 0, 0);
      setIsMoving(false);
      setIsSprinting(false);

      // Force sitting pose
      if (refs.lThighRef.current && refs.rThighRef.current) {
        refs.lThighRef.current.rotation.x = -Math.PI / 2;
        refs.rThighRef.current.rotation.x = -Math.PI / 2;
        refs.lShinRef.current.rotation.x  = Math.PI / 2.2;
        refs.rShinRef.current.rotation.x  = Math.PI / 2.2;
        refs.lArmRef.current.rotation.x   = -Math.PI / 4;
        refs.rArmRef.current.rotation.x   = -Math.PI / 4;
        if (refs.hipsRef.current) refs.hipsRef.current.position.y = -0.4;
      }

      // Seat offset inside the bus local space
      const seatLocalOffset = new THREE.Vector3(-0.6, 0.52, -0.3);
      seatLocalOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), busRotation);
      const seatWorldPos = new THREE.Vector3(...busPosition).add(seatLocalOffset);
      
      pp.copy(seatWorldPos);
      playerRef.current.rotation.y = busRotation;

      if (cameraMode === 'third') {
        // Chase view behind the bus
        const chasePos = new THREE.Vector3(
          busPosition[0] + Math.sin(busRotation) * 11,
          busPosition[1] + 5.2,
          busPosition[2] + Math.cos(busRotation) * 11
        );
        camera.position.lerp(chasePos, 0.1);
        camera.lookAt(busPosition[0], busPosition[1] + 1.2, busPosition[2]);
      } else {
        // First person seat view
        const headWorldPos = new THREE.Vector3(pp.x, pp.y + 1.35, pp.z);
        camera.position.copy(headWorldPos);
        const lookTarget = new THREE.Vector3(
          headWorldPos.x + Math.cos(pitch) * -Math.sin(yaw),
          headWorldPos.y + Math.sin(pitch),
          headWorldPos.z + Math.cos(pitch) * -Math.cos(yaw)
        );
        camera.lookAt(lookTarget);
      }

      freeCamInitialized.current = false;

    } else {
      // 4. NORMAL PLAYER MODE
      // Reset drone offset and hips position
      if (refs.hipsRef.current) refs.hipsRef.current.position.y = 0;
      droneOffsetRef.current.set(0, 0, 0);
      freeCamInitialized.current = false;

      // Smooth velocity
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
        const nextPos = pp.clone().add(vel);
        nextPos.x = Math.max(-110, Math.min(110, nextPos.x));
        nextPos.z = Math.max(-130, Math.min(90,  nextPos.z));
        pp.copy(nextPos);

        // Smoothly rotate character to face movement direction
        const targetYaw = Math.atan2(-vel.x, -vel.z);
        const curYaw    = playerRef.current.rotation.y;
        let diff = targetYaw - curYaw;
        while (diff >  Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        playerRef.current.rotation.y += diff * 0.14;

        walkPhase.current += vel.length() * (sprint ? 9 : 7);
      }

      // GTA walk cycle
      const swing = moving ? (sprint ? 0.72 : 0.52) : 0;
      const knee  = moving ? (sprint ? 0.88 : 0.68) : 0;
      animateWalk(refs, walkPhase.current, swing, knee, moving, 0.045);

      playerRef.current.position.y = moving ? Math.abs(Math.sin(walkPhase.current)) * 0.012 : 0;

      // Standard camera follow
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
