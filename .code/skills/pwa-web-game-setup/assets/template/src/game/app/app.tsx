import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { HUD } from '../../ui';

/**
 * Main game application component.
 * Renders the 3D canvas with game scene and UI overlay.
 */
export function App() {
  return (
    <>
      <Canvas
        style={{ position: 'fixed', inset: 0 }}
        camera={{ position: [0, 2, 5], fov: 75 }}
      >
        <Scene />
      </Canvas>
      <HUD />
    </>
  );
}

/**
 * Main 3D scene containing game objects.
 */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <gridHelper args={[10, 10]} />
      <OrbitControls />
    </>
  );
}
