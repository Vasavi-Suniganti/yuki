import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createIcebergMaterial } from './IcebergMaterial';

interface IcebergInstanceProps {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  bobbingPhase?: number;
}

function SingleIceberg({ position, scale, rotation = [0, 0, 0], bobbingPhase = 0 }: IcebergInstanceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    // Angular tabular/pinnacle iceberg geometry with faceted ice cliffs
    const geo = new THREE.ConeGeometry(3.5, 6, 7);
    geo.rotateY(Math.PI / 5);

    // Randomize vertex offsets to create realistic jagged iceberg geometry
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      if (y > 0) {
        pos.setX(i, x * 0.85 + Math.sin(y * 1.5) * 0.4);
        pos.setZ(i, z * 0.85 + Math.cos(y * 1.5) * 0.4);
      }
    }
    geo.computeVertexNormals();

    const mat = createIcebergMaterial();
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * 0.8 + bobbingPhase;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.15;
      meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.7) * 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}

export function Icebergs() {
  return (
    <group>
      {/* 1. Large tabular iceberg floating near left valley ocean pass */}
      <SingleIceberg
        position={[-12, -1.8, 4]}
        scale={[1.8, 1.4, 2.2]}
        rotation={[0.1, 0.4, -0.05]}
        bobbingPhase={0}
      />

      {/* 2. Pinnacle iceberg floating right foreground */}
      <SingleIceberg
        position={[14, -1.5, -2]}
        scale={[2.2, 1.8, 1.9]}
        rotation={[-0.05, 1.2, 0.08]}
        bobbingPhase={1.5}
      />

      {/* 3. Massive ice shelf iceberg near mountain base */}
      <SingleIceberg
        position={[-4, -2.0, -14]}
        scale={[3.5, 2.2, 3.0]}
        rotation={[0, 2.1, 0]}
        bobbingPhase={2.8}
      />

      {/* 4. Secondary floating ice floes */}
      <SingleIceberg
        position={[6, -2.2, 8]}
        scale={[1.2, 0.8, 1.4]}
        rotation={[0.05, 0.7, 0]}
        bobbingPhase={4.1}
      />

      <SingleIceberg
        position={[-18, -2.1, -8]}
        scale={[1.6, 1.1, 1.8]}
        rotation={[0, -0.5, 0.04]}
        bobbingPhase={3.3}
      />
    </group>
  );
}
