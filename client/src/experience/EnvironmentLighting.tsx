import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface EnvironmentLightingProps {
  progress?: number;
}

export function EnvironmentLighting({ progress = 0 }: EnvironmentLightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!dirLightRef.current) return;
    const sunX = THREE.MathUtils.lerp(8, 12, progress);
    const sunY = THREE.MathUtils.lerp(14, 11, progress);
    const sunZ = THREE.MathUtils.lerp(10, 6, progress);
    dirLightRef.current.position.set(sunX, sunY, sunZ);
  });

  return (
    <>
      {/* Main diagonal sunlight */}
      <directionalLight
        ref={dirLightRef}
        position={[8, 14, 10]}
        intensity={2.8}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0002}
      />

      {/* Soft cold alpine sky */}
      <hemisphereLight args={['#d8ecf6', '#8baec4', 1.4]} />

      {/* Fill rim light from opposite side */}
      <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#b8d4e8" />
    </>
  );
}
