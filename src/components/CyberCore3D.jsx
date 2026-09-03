import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const Core = () => {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.6} />
      </mesh>
      {/* Inner solid core */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
      </mesh>
    </Float>
  );
};

const CyberCore3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto opacity-60">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <Core />
      </Canvas>
    </div>
  );
};

export default CyberCore3D;
