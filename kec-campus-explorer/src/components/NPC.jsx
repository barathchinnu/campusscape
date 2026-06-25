import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const WALK_RADIUS = 8;

// Shared GTA-style character body
function CharacterBody({ shirt = '#3498db', skin = '#f0c8a0', pants = '#1c2833', shoes = '#111', refs = {} }) {
  const {
    hipsRef, spineRef, shoulderGrpRef,
    lThighRef, rThighRef, lShinRef, rShinRef, lAnkleRef, rAnkleRef,
    lArmRef, rArmRef, lForearmRef, rForearmRef, headRef,
  } = refs;

  const hair = '#2c1810';

  return (
    <>
      {/* ── HIPS PIVOT (drives legs + pelvis sway) ── */}
      <group ref={hipsRef} position={[0, 0.82, 0]}>
        {/* Pelvis */}
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.16, 0.2]} />
          <meshStandardMaterial color={pants} roughness={0.75} />
        </mesh>

        {/* LEFT LEG */}
        <group ref={lThighRef} position={[0.1, -0.08, 0]}>
          {/* thigh */}
          <mesh position={[0, -0.19, 0]} castShadow>
            <capsuleGeometry args={[0.088, 0.28, 4, 8]} />
            <meshStandardMaterial color={pants} roughness={0.75} />
          </mesh>
          <group ref={lShinRef} position={[0, -0.38, 0]}>
            {/* shin */}
            <mesh position={[0, -0.17, 0]} castShadow>
              <capsuleGeometry args={[0.073, 0.26, 4, 8]} />
              <meshStandardMaterial color={pants} roughness={0.75} />
            </mesh>
            <group ref={lAnkleRef} position={[0, -0.35, 0]}>
              {/* shoe */}
              <mesh position={[0.01, -0.04, 0.06]} castShadow>
                <boxGeometry args={[0.13, 0.09, 0.26]} />
                <meshStandardMaterial color={shoes} roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={rThighRef} position={[-0.1, -0.08, 0]}>
          <mesh position={[0, -0.19, 0]} castShadow>
            <capsuleGeometry args={[0.088, 0.28, 4, 8]} />
            <meshStandardMaterial color={pants} roughness={0.75} />
          </mesh>
          <group ref={rShinRef} position={[0, -0.38, 0]}>
            <mesh position={[0, -0.17, 0]} castShadow>
              <capsuleGeometry args={[0.073, 0.26, 4, 8]} />
              <meshStandardMaterial color={pants} roughness={0.75} />
            </mesh>
            <group ref={rAnkleRef} position={[0, -0.35, 0]}>
              <mesh position={[0.01, -0.04, 0.06]} castShadow>
                <boxGeometry args={[0.13, 0.09, 0.26]} />
                <meshStandardMaterial color={shoes} roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ── SPINE / TORSO ── */}
      <group ref={spineRef} position={[0, 0.88, 0]}>
        {/* Belly */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.2]} />
          <meshStandardMaterial color={shirt} roughness={0.65} />
        </mesh>
        {/* Chest — wider at top */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[0.4, 0.22, 0.22]} />
          <meshStandardMaterial color={shirt} roughness={0.65} />
        </mesh>
        {/* Collar line */}
        <mesh position={[0, 0.35, 0.11]}>
          <boxGeometry args={[0.14, 0.04, 0.02]} />
          <meshStandardMaterial color={shirt} roughness={0.5} />
        </mesh>

        {/* SHOULDER GROUP — counter-rotates vs hips */}
        <group ref={shoulderGrpRef} position={[0, 0.38, 0]}>
          {/* Shoulder caps */}
          <mesh position={[ 0.22, 0, 0]} castShadow>
            <sphereGeometry args={[0.085, 8, 8]} />
            <meshStandardMaterial color={shirt} roughness={0.6} />
          </mesh>
          <mesh position={[-0.22, 0, 0]} castShadow>
            <sphereGeometry args={[0.085, 8, 8]} />
            <meshStandardMaterial color={shirt} roughness={0.6} />
          </mesh>

          {/* LEFT ARM */}
          <group ref={lArmRef} position={[0.22, 0, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.24, 4, 8]} />
              <meshStandardMaterial color={shirt} roughness={0.65} />
            </mesh>
            <group ref={lForearmRef} position={[0, -0.32, 0]}>
              <mesh position={[0, -0.13, 0]} castShadow>
                <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.6} />
              </mesh>
              {/* hand */}
              <mesh position={[0, -0.28, 0]} castShadow>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color={skin} roughness={0.6} />
              </mesh>
            </group>
          </group>

          {/* RIGHT ARM */}
          <group ref={rArmRef} position={[-0.22, 0, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.24, 4, 8]} />
              <meshStandardMaterial color={shirt} roughness={0.65} />
            </mesh>
            <group ref={rForearmRef} position={[0, -0.32, 0]}>
              <mesh position={[0, -0.13, 0]} castShadow>
                <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.6} />
              </mesh>
              <mesh position={[0, -0.28, 0]} castShadow>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color={skin} roughness={0.6} />
              </mesh>
            </group>
          </group>

          {/* NECK */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.09, 0.18, 10]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>

          {/* HEAD GROUP */}
          <group ref={headRef} position={[0, 0.29, 0]}>
            {/* skull */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.34, 0.28]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            {/* jaw/chin */}
            <mesh position={[0, -0.17, 0.06]} castShadow>
              <boxGeometry args={[0.22, 0.07, 0.2]} />
              <meshStandardMaterial color={skin} roughness={0.55} />
            </mesh>
            {/* hair top */}
            <mesh position={[0, 0.18, -0.01]}>
              <boxGeometry args={[0.31, 0.1, 0.3]} />
              <meshStandardMaterial color={hair} roughness={0.9} />
            </mesh>
            {/* hair back */}
            <mesh position={[0, 0.08, -0.13]}>
              <boxGeometry args={[0.28, 0.2, 0.06]} />
              <meshStandardMaterial color={hair} roughness={0.9} />
            </mesh>
            {/* eyebrows */}
            <mesh position={[ 0.09, 0.07, 0.14]}>
              <boxGeometry args={[0.07, 0.018, 0.02]} />
              <meshStandardMaterial color={hair} />
            </mesh>
            <mesh position={[-0.09, 0.07, 0.14]}>
              <boxGeometry args={[0.07, 0.018, 0.02]} />
              <meshStandardMaterial color={hair} />
            </mesh>
            {/* eyes whites */}
            <mesh position={[ 0.09, 0.02, 0.14]}>
              <boxGeometry args={[0.07, 0.045, 0.02]} />
              <meshStandardMaterial color="#fff" roughness={0.3} />
            </mesh>
            <mesh position={[-0.09, 0.02, 0.14]}>
              <boxGeometry args={[0.07, 0.045, 0.02]} />
              <meshStandardMaterial color="#fff" roughness={0.3} />
            </mesh>
            {/* pupils */}
            <mesh position={[ 0.09, 0.02, 0.15]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.09, 0.02, 0.15]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            {/* nose */}
            <mesh position={[0, -0.04, 0.15]}>
              <boxGeometry args={[0.05, 0.07, 0.06]} />
              <meshStandardMaterial color={skin} roughness={0.5} />
            </mesh>
            {/* mouth */}
            <mesh position={[0, -0.1, 0.14]}>
              <boxGeometry args={[0.09, 0.022, 0.02]} />
              <meshStandardMaterial color="#b05550" roughness={0.5} />
            </mesh>
            {/* ears */}
            <mesh position={[ 0.155, 0, 0]}>
              <sphereGeometry args={[0.045, 6, 6]} />
              <meshStandardMaterial color={skin} roughness={0.6} />
            </mesh>
            <mesh position={[-0.155, 0, 0]}>
              <sphereGeometry args={[0.045, 6, 6]} />
              <meshStandardMaterial color={skin} roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

// GTA-style walk animation helper
function animateWalk(refs, t, swing, kneeAmt, moving, hipSway) {
  const {
    hipsRef, spineRef, shoulderGrpRef,
    lThighRef, rThighRef, lShinRef, rShinRef, lAnkleRef, rAnkleRef,
    lArmRef, rArmRef, lForearmRef, rForearmRef, headRef,
  } = refs;

  const bob = moving ? Math.abs(Math.sin(t)) * 0.05 : 0;

  if (hipsRef?.current) {
    hipsRef.current.position.x    = moving ? Math.sin(t) * hipSway : 0;
    hipsRef.current.rotation.y    = moving ? -Math.sin(t) * 0.08 : 0;
    hipsRef.current.position.y    = 0.82 + bob;
  }
  if (spineRef?.current) {
    spineRef.current.position.x   = moving ? Math.sin(t) * hipSway * 0.4 : 0;
    spineRef.current.position.y   = 0.88 + bob;
  }
  if (shoulderGrpRef?.current) {
    shoulderGrpRef.current.rotation.y = moving ? Math.sin(t) * 0.1 : 0;
  }

  // Legs
  if (lThighRef?.current)  lThighRef.current.rotation.x  = moving ? -Math.sin(t) * swing : 0;
  if (rThighRef?.current)  rThighRef.current.rotation.x  = moving ?  Math.sin(t) * swing : 0;
  if (lShinRef?.current)   lShinRef.current.rotation.x   = moving ? Math.max(0, -Math.sin(t)) * kneeAmt : 0;
  if (rShinRef?.current)   rShinRef.current.rotation.x   = moving ? Math.max(0,  Math.sin(t)) * kneeAmt : 0;
  // Ankle flex (heel strike)
  if (lAnkleRef?.current)  lAnkleRef.current.rotation.x  = moving ? Math.max(0,  Math.sin(t)) * 0.25 : 0;
  if (rAnkleRef?.current)  rAnkleRef.current.rotation.x  = moving ? Math.max(0, -Math.sin(t)) * 0.25 : 0;

  // Arms — swing opposite to legs
  if (lArmRef?.current)    lArmRef.current.rotation.x    = moving ?  Math.sin(t) * swing * 0.85 : 0;
  if (rArmRef?.current)    rArmRef.current.rotation.x    = moving ? -Math.sin(t) * swing * 0.85 : 0;
  // Elbow bend when arm swings back
  if (lForearmRef?.current) lForearmRef.current.rotation.x = moving ? Math.max(0,  Math.sin(t)) * 0.55 : 0.1;
  if (rForearmRef?.current) rForearmRef.current.rotation.x = moving ? Math.max(0, -Math.sin(t)) * 0.55 : 0.1;

  // Head bob
  if (headRef?.current)    headRef.current.position.y    = 0.29 + Math.sin(t * 2) * 0.008;

  // Idle arm hang
  if (!moving && lArmRef?.current)  lArmRef.current.rotation.z  = THREE.MathUtils.lerp(lArmRef.current.rotation.z,   0.15, 0.08);
  if (!moving && rArmRef?.current)  rArmRef.current.rotation.z  = THREE.MathUtils.lerp(rArmRef.current.rotation.z,  -0.15, 0.08);
  if (moving && lArmRef?.current)   lArmRef.current.rotation.z  = THREE.MathUtils.lerp(lArmRef.current.rotation.z,   0, 0.12);
  if (moving && rArmRef?.current)   rArmRef.current.rotation.z  = THREE.MathUtils.lerp(rArmRef.current.rotation.z,   0, 0.12);
}

export default function NPC({ id, position, name, color = '#f0c8a0', shirt = '#3498db' }) {
  const groupRef      = useRef();
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

  const walkPhase = useRef(Math.random() * Math.PI * 2);
  const walkSpeed = useRef(0.022 + Math.random() * 0.012);
  const originRef = useRef(new THREE.Vector3(...position));
  const [showChat, setShowChat] = useState(false);

  const talkToNPC = useGameStore((s) => s.talkToNPC);
  const playerPos = useGameStore((s) => s.playerPosition);

  const chatMessages = [
    'Hey! Welcome to KEC campus! 👋',
    'Have you seen the IT Park? Amazing! 💻',
    'Don\'t miss the Food Court! 🍽️',
    'Library has over 1 lakh books! 📚',
    'Catch the evening bus at 5:30 PM! 🚌',
    'KEC has the best campus in TN! 🏆',
  ];
  const [myChat] = useState(chatMessages[Math.floor(Math.random() * chatMessages.length)]);

  const refs = { hipsRef, spineRef, shoulderGrpRef, lThighRef, rThighRef, lShinRef, rShinRef, lAnkleRef, rAnkleRef, lArmRef, rArmRef, lForearmRef, rForearmRef, headRef };

  useFrame(() => {
    if (!groupRef.current) return;
    walkPhase.current += walkSpeed.current;
    const t = walkPhase.current;
    groupRef.current.position.x = originRef.current.x + Math.cos(t) * WALK_RADIUS;
    groupRef.current.position.z = originRef.current.z + Math.sin(t) * WALK_RADIUS;
    groupRef.current.position.y = 0;
    groupRef.current.rotation.y = -t + Math.PI / 2;

    animateWalk(refs, t * 5, 0.52, 0.68, true, 0.04);

    const dist = groupRef.current.position.distanceTo(new THREE.Vector3(...playerPos));
    if (dist < 3.5 && !showChat) { setShowChat(true); talkToNPC(); }
    else if (dist >= 3.5 && showChat) setShowChat(false);
  });

  return (
    <group ref={groupRef} position={position}>
      <CharacterBody shirt={shirt} skin={color} pants="#1c2833" shoes="#111" refs={refs} />
      <Text position={[0, 2.5, 0]} fontSize={0.26} color="#fff" anchorX="center" outlineWidth={0.03} outlineColor="#000">
        {name}
      </Text>
      {showChat && (
        <Html position={[0, 3.0, 0]} center distanceFactor={8}>
          <div style={{ background: 'rgba(255,255,255,0.95)', color: '#1a1a2e', padding: '8px 12px', borderRadius: 12, fontSize: 12, maxWidth: 160, textAlign: 'center', fontFamily: 'Inter,sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', border: '2px solid #3498db' }}>
            💬 {myChat}
          </div>
        </Html>
      )}
    </group>
  );
}

export { CharacterBody, animateWalk };