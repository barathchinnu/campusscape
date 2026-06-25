import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// Generic multi-floor building
function GenericBlock({ position, size, color, accentColor, floors = 3, hasRoof = false }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      {/* Floor lines */}
      {Array.from({ length: floors - 1 }, (_, i) => (
        <mesh key={i} position={[0, ((i + 1) * h) / floors, d / 2 + 0.05]}>
          <boxGeometry args={[w + 0.1, 0.25, 0.08]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>
      ))}
      {/* Windows */}
      {Array.from({ length: floors }, (_, row) =>
        [-2, -1, 0, 1, 2].map((col) => (
          <mesh key={`${row}-${col}`} position={[col * (w / 6), ((row + 0.5) * h) / floors, d / 2 + 0.08]}>
            <boxGeometry args={[w / 8, h / (floors * 1.8), 0.06]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.65} metalness={0.3} />
          </mesh>
        ))
      )}
      {/* Entrance */}
      <mesh position={[0, h / (floors * 2), d / 2 + 0.8]}>
        <boxGeometry args={[w / 4, h / floors, 1.6]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} />
      </mesh>
      {/* Ground border */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w + 1, 0.1, d + 1]} />
        <meshStandardMaterial color="#c8b090" roughness={0.8} />
      </mesh>
    </group>
  );
}

// IT Park — white 3-storey, blue accent stripes, glass pyramid
function ITParkBuilding({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#edf2f7" roughness={0.4} />
      </mesh>
      {[2.5, 5, 7.5, 10].map((y, i) => (
        <mesh key={i} position={[0, y, d / 2 + 0.05]}>
          <boxGeometry args={[w + 0.2, 0.35, 0.1]} />
          <meshStandardMaterial color="#4a9edd" roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
      {[-1, 0, 1].map((row) =>
        [-3, -1, 1, 3].map((col) => (
          <mesh key={`${row}-${col}`} position={[col * 5, 5 + row * 3, d / 2 + 0.1]}>
            <boxGeometry args={[2.5, 1.8, 0.05]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} metalness={0.5} roughness={0.1} />
          </mesh>
        ))
      )}
      {/* Glass Pyramid */}
      <mesh position={[4, h + 3, 0]} castShadow>
        <coneGeometry args={[4, 6, 4]} />
        <meshStandardMaterial color="#a8d8ea" transparent opacity={0.55} metalness={0.6} roughness={0.1} />
      </mesh>
      {/* Entrance canopy */}
      <mesh position={[0, 2.5, d / 2 + 1.5]}>
        <boxGeometry args={[8, 0.3, 3]} />
        <meshStandardMaterial color="#4a9edd" roughness={0.3} />
      </mesh>
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 1.2, d / 2 + 2.5]}>
          <cylinderGeometry args={[0.22, 0.22, 2.4, 8]} />
          <meshStandardMaterial color="#cdd6e0" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Auditorium — Kongu Convention Centre
function AuditoriumBuilding({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2 - 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h - 2, d]} />
        <meshStandardMaterial color="#8B7355" roughness={0.7} />
      </mesh>
      <mesh position={[0, h - 1, 0]} castShadow>
        <boxGeometry args={[w + 4, 2, d + 2]} />
        <meshStandardMaterial color="#6b5740" roughness={0.6} />
      </mesh>
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[14, h, d - 4]} />
        <meshStandardMaterial color="#7a6348" roughness={0.6} />
      </mesh>
      {[-2, -1, 0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 5, h / 2, d / 2 + 0.1]}>
          <boxGeometry args={[3, 6, 0.1]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`ls-${i}`} position={[-w / 2 + 6, i * 0.4, d / 2 + 2 + i * 0.5]}>
          <boxGeometry args={[12, 0.4, 1.2]} />
          <meshStandardMaterial color="#9b8a72" roughness={0.8} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`rs-${i}`} position={[w / 2 - 6, i * 0.4, d / 2 + 2 + i * 0.5]}>
          <boxGeometry args={[12, 0.4, 1.2]} />
          <meshStandardMaterial color="#9b8a72" roughness={0.8} />
        </mesh>
      ))}
      {/* Flagpole */}
      <mesh position={[0, h + 5, -2]}>
        <cylinderGeometry args={[0.08, 0.08, 10, 6]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
      <mesh position={[0.8, h + 9, -2]}>
        <boxGeometry args={[2, 1, 0.05]} />
        <meshStandardMaterial color="#FF9933" />
      </mesh>
    </group>
  );
}

// Library — classical columns + fountain
function LibraryBuilding({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#f0e8d8" roughness={0.5} />
      </mesh>
      {/* Pediment */}
      <mesh position={[0, h + 1.8, 0]}>
        <coneGeometry args={[w / 1.9, 3.5, 4]} />
        <meshStandardMaterial color="#e0d4bc" roughness={0.5} />
      </mesh>
      {/* Columns */}
      {[-6, -3, 0, 3, 6].map((x, i) => (
        <mesh key={i} position={[x, h / 2, d / 2 + 0.2]}>
          <cylinderGeometry args={[0.3, 0.35, h, 12]} />
          <meshStandardMaterial color="#f5efe0" roughness={0.4} />
        </mesh>
      ))}
      {/* Clock */}
      <mesh position={[0, h - 0.5, d / 2 + 0.1]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#fff8e8" roughness={0.3} />
      </mesh>
      {/* Fountain */}
      <mesh position={[0, 0.5, d / 2 + 10]}>
        <cylinderGeometry args={[3.5, 3.5, 0.8, 32]} />
        <meshStandardMaterial color="#b0c4de" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.9, d / 2 + 10]}>
        <cylinderGeometry args={[3.2, 3.2, 0.4, 32]} />
        <meshStandardMaterial color="#6fa8dc" transparent opacity={0.7} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.4, d / 2 + 10]}>
        <cylinderGeometry args={[0.25, 0.4, 1.5, 8]} />
        <meshStandardMaterial color="#a0b8c8" roughness={0.4} />
      </mesh>
    </group>
  );
}

// Bus Stand — shed with yellow buses
function BusStandBuilding({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h, 0]} castShadow>
        <boxGeometry args={[w + 2, 0.8, d + 2]} />
        <meshStandardMaterial color="#cc4444" roughness={0.6} />
      </mesh>
      {[-15, -5, 5, 15].map((x, i) =>
        [-9, 9].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, h / 2, z]}>
            <cylinderGeometry args={[0.3, 0.3, h, 8]} />
            <meshStandardMaterial color="#999" metalness={0.5} />
          </mesh>
        ))
      )}
      {[-14, -5, 5, 14].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[2.8, 3.8, 8]} />
            <meshStandardMaterial color="#F5C518" roughness={0.5} />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[2.6, 0.5, 7.5]} />
            <meshStandardMaterial color="#e8b800" roughness={0.5} />
          </mesh>
          {[-2.5, 2.5].map((z, j) => (
            <mesh key={j} position={[0, 0.55, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.55, 0.55, 2.9, 16]} />
              <meshStandardMaterial color="#222" roughness={0.9} />
            </mesh>
          ))}
          <Text position={[0, 2.5, 4.05]} fontSize={0.35} color="#1a1a1a" anchorX="center">KONGU</Text>
        </group>
      ))}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[w + 4, 0.02, d + 4]} />
        <meshStandardMaterial color="#707070" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Admin Block
function AdminBuilding({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#d8e8f0" roughness={0.4} />
      </mesh>
      {[3.5, 7, 10.5].map((y, i) => (
        <mesh key={i} position={[0, y, d / 2 + 0.05]}>
          <boxGeometry args={[w + 0.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#a8c8d8" />
        </mesh>
      ))}
      {[2.5, 6, 9.5].map((y) =>
        [-8, -5, -2, 2, 5, 8].map((x, j) => (
          <mesh key={`${y}-${j}`} position={[x, y, d / 2 + 0.1]}>
            <boxGeometry args={[1.8, 2.2, 0.08]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.65} metalness={0.3} />
          </mesh>
        ))
      )}
      {/* Gold sign bar */}
      <mesh position={[0, h - 0.6, d / 2 + 0.12]}>
        <boxGeometry args={[16, 1.3, 0.12]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Entrance porch */}
      <mesh position={[0, 2.8, d / 2 + 1.2]}>
        <boxGeometry args={[9, 5, 2.4]} />
        <meshStandardMaterial color="#e8d4a0" roughness={0.5} />
      </mesh>
      {/* Steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.3, d / 2 + 3 + i * 0.4]}>
          <boxGeometry args={[9, 0.3, 1]} />
          <meshStandardMaterial color="#c8d8e0" roughness={0.7} />
        </mesh>
      ))}
      {/* Palm trees */}
      {[-11, -8, 8, 11].map((x, i) => (
        <group key={i} position={[x, 0, d / 2 + 1]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.18, 0.25, 6, 8]} />
            <meshStandardMaterial color="#8B6914" roughness={0.8} />
          </mesh>
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh key={j} position={[Math.sin(j * 1.25) * 1.5, 6.5, Math.cos(j * 1.25) * 1.5]}
              rotation={[Math.sin(j * 1.25) * 0.5, 0, Math.cos(j * 1.25) * 0.5]}>
              <boxGeometry args={[0.12, 0.08, 2.5]} />
              <meshStandardMaterial color="#2d6a2d" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Food Court — curved white with circular canopy
function FoodCourtBuilding({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#f0f0f5" roughness={0.4} />
      </mesh>
      {/* Side wings */}
      <mesh position={[-w / 2 - 2, h / 2 - 2, 0]} castShadow>
        <boxGeometry args={[4, h - 4, d - 2]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.4} />
      </mesh>
      <mesh position={[w / 2 + 2, h / 2 - 2, 0]} castShadow>
        <boxGeometry args={[4, h - 4, d - 2]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.4} />
      </mesh>
      {/* Circular canopy */}
      <mesh position={[0, h - 1.5, d / 2 + 2]} castShadow>
        <cylinderGeometry args={[6.5, 6.5, 0.5, 32]} />
        <meshStandardMaterial color="#c8c8d8" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Canopy columns */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.sin(i * Math.PI / 3) * 5.5, (h - 1.5) / 2, d / 2 + 2 + Math.cos(i * Math.PI / 3) * 5.5]}>
          <cylinderGeometry args={[0.18, 0.18, h - 1.5, 8]} />
          <meshStandardMaterial color="#999aaa" roughness={0.4} />
        </mesh>
      ))}
      {/* Steps */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, i * 0.28, d / 2 + 4 + i * 0.4]}>
          <cylinderGeometry args={[5 - i * 0.3, 5.3 - i * 0.3, 0.28, 32]} />
          <meshStandardMaterial color="#b0b0c0" roughness={0.7} />
        </mesh>
      ))}
      {/* Bushes */}
      {[-8, -5, 5, 8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, d / 2 + 2]}>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshStandardMaterial color="#2d6a2d" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Sports ground — flat with markings
function SportsGround({ position, size }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#3a8a3a" roughness={0.9} />
      </mesh>
      {/* Cricket pitch */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 20]} />
        <meshStandardMaterial color="#c8b090" roughness={0.9} />
      </mesh>
      {/* Boundary line */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[28, 0.18, 4, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      {/* Goal posts */}
      {[-1, 1].map((s, i) => (
        <group key={i} position={[s * 32, 0, 0]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 4, 6]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[6, 0.1, 0.1]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Building({ data }) {
  const nearbyBuilding = useGameStore((s) => s.nearbyBuilding);
  const isNear = nearbyBuilding?.id === data.id;

  const renderBuilding = () => {
    switch (data.id) {
      case 'itpark': return <ITParkBuilding position={data.position} size={data.size} />;
      case 'auditorium': return <AuditoriumBuilding position={data.position} size={data.size} />;
      case 'library': return <LibraryBuilding position={data.position} size={data.size} />;
      case 'busstand': return <BusStandBuilding position={data.position} size={data.size} />;
      case 'adminblock': return <AdminBuilding position={data.position} size={data.size} />;
      case 'foodcourt': return <FoodCourtBuilding position={data.position} size={data.size} />;
      case 'sportsground': return <SportsGround position={data.position} size={data.size} />;
      default:
        return <GenericBlock position={data.position} size={data.size}
          color={data.color} accentColor={data.accentColor}
          floors={Math.round(data.size[1] / 4)} />;
    }
  };

  return (
    <group>
      {renderBuilding()}
      {isNear && data.id !== 'sportsground' && (
        <mesh position={[data.position[0], data.position[1] + data.size[1] / 2, data.position[2]]}>
          <boxGeometry args={[data.size[0] + 0.6, data.size[1] + 0.6, data.size[2] + 0.6]} />
          <meshStandardMaterial color={data.accentColor} transparent opacity={0.07} wireframe />
        </mesh>
      )}
      {data.id !== 'sportsground' && (
        <Text
          position={[data.position[0], data.position[1] + data.size[1] + 2.5, data.position[2]]}
          fontSize={1.6}
          color="white"
          anchorX="center"
          outlineWidth={0.12}
          outlineColor="#000000"
        >
          {data.emoji} {data.name}
        </Text>
      )}
    </group>
  );
}
