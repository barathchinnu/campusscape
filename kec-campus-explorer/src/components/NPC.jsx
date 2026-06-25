import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const STUDENT_NAMES = ['Rahul', 'Priya', 'Arun', 'Kavya', 'Vijay', 'Deepa', 'Karthik', 'Meena', 'Surya', 'Ananya'];
const SHIRT_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22', '#34495e'];
const WALK_RADIUS = 8;

export default function NPC({ id, position, name, color = '#f0c8a0', shirt = '#3498db' }) {
  const groupRef = useRef();
  const walkPhase = useRef(Math.random() * Math.PI * 2);
  const walkSpeed = useRef(0.008 + Math.random() * 0.006);
  const originRef = useRef(new THREE.Vector3(...position));
  const [showChat, setShowChat] = useState(false);

  const talkToNPC = useGameStore((s) => s.talkToNPC);
  const playerPos = useGameStore((s) => s.playerPosition);
  const showToast = useGameStore((s) => s.showToast);
  const npcsTalked = useGameStore((s) => s.npcsTalked);

  const chatMessages = [
    'Hey! Welcome to KEC campus! 👋',
    'Have you seen the IT Park? It\'s amazing! 💻',
    'Don\'t miss the Food Court, great meals! 🍽️',
    'The Library has over 1 lakh books! 📚',
    'Catch the evening bus at 5:30 PM! 🚌',
    'The Auditorium hosts great events! 🎭',
    'KEC has the best campus in Tamil Nadu! 🏆',
  ];

  const [myChat] = useState(chatMessages[Math.floor(Math.random() * chatMessages.length)]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Walk in a circle around origin
    walkPhase.current += walkSpeed.current;
    const ox = originRef.current.x;
    const oz = originRef.current.z;
    const nx = ox + Math.cos(walkPhase.current) * WALK_RADIUS;
    const nz = oz + Math.sin(walkPhase.current) * WALK_RADIUS;
    groupRef.current.position.x = nx;
    groupRef.current.position.z = nz;
    groupRef.current.position.y = 0;
    groupRef.current.rotation.y = -walkPhase.current + Math.PI / 2;

    // Check proximity to player
    const pPos = new THREE.Vector3(...playerPos);
    const dist = groupRef.current.position.distanceTo(pPos);
    if (dist < 3.5 && !showChat) {
      setShowChat(true);
      talkToNPC();
    } else if (dist >= 3.5 && showChat) {
      setShowChat(false);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.85, 6, 12]} />
        <meshStandardMaterial color={shirt} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.29, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#2c1a0e" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 1.97, 0.24]}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.1, 1.97, 0.24]}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Left Leg */}
      <mesh position={[0.16, 0.18, 0]}>
        <capsuleGeometry args={[0.11, 0.55, 4, 8]} />
        <meshStandardMaterial color="#1a252f" />
      </mesh>
      {/* Right Leg */}
      <mesh position={[-0.16, 0.18, 0]}>
        <capsuleGeometry args={[0.11, 0.55, 4, 8]} />
        <meshStandardMaterial color="#1a252f" />
      </mesh>

      {/* Name tag */}
      <Text
        position={[0, 2.6, 0]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        {name}
      </Text>

      {/* Chat bubble when near */}
      {showChat && (
        <Html position={[0, 3.3, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            color: '#1a1a2e',
            padding: '8px 12px',
            borderRadius: 12,
            fontSize: 12,
            maxWidth: 160,
            textAlign: 'center',
            fontFamily: 'Inter,sans-serif',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '2px solid #3498db',
          }}>
            💬 {myChat}
          </div>
        </Html>
      )}
    </group>
  );
}