import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import Player from './components/Player';
import NPC from './components/NPC';
import Building from './components/Building';
import Environment from './components/Environment';
import HUD from './components/HUD';
import InfoPanel from './components/InfoPanel';
import MiniMap from './components/MiniMap';
import { BUILDINGS, NPC_CONFIGS } from './data/campusData';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1a4080" />
    </mesh>
  );
}

function GameScene() {
  return (
    <>
      <Environment />
      {BUILDINGS.map((b) => (
        <Building key={b.id} data={b} />
      ))}
      {NPC_CONFIGS.map((npc) => (
        <NPC
          key={npc.id}
          id={npc.id}
          position={npc.position}
          name={npc.name}
          color={npc.color}
          shirt={npc.shirt}
        />
      ))}
      <Player />
      <PointerLockControls />
    </>
  );
}

export default function App() {
  const closeInfoPanel = useGameStore((s) => s.closeInfoPanel);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeInfoPanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeInfoPanel]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050a14', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 25, 65], fov: 68, near: 0.1, far: 600 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <GameScene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <HUD />
      <InfoPanel />
      <MiniMap />

      {/* Global fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}