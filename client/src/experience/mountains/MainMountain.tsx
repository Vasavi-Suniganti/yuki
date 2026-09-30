import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createSnowTerrainMaterial } from './SnowMaterial';

// Realistic hydraulic erosion and ridged multifractal mountain elevation
function realisticMountainTerrain(x: number, z: number): number {
  const dist = Math.sqrt(x * x + z * z);

  // Central massive mountain peak
  const mainSummit = Math.exp(-dist * 0.06) * 15.0;

  // Secondary surrounding peaks and ridges
  const ridgeWest = Math.exp(-((x - 9.0) ** 2 + (z + 6.0) ** 2) * 0.035) * 8.8;
  const ridgeEast = Math.exp(-((x + 11.0) ** 2 + (z - 7.0) ** 2) * 0.03) * 10.2;
  const ridgeNorth = Math.exp(-((x + 1.0) ** 2 + (z + 13.0) ** 2) * 0.025) * 7.5;

  // Sharp glacial cirques & serrated ridges
  const ridgedNoise = Math.abs(Math.sin(x * 0.3 + z * 0.25)) * 3.6;
  const gullyNoise = -Math.abs(Math.sin(x * 0.65 + z * 0.55)) * 1.2;
  const microDetail = Math.sin(x * 1.8) * Math.cos(z * 1.8) * 0.4;

  const mask = Math.max(0, 1 - dist * 0.035);
  const totalHeight = mainSummit + ridgeWest + ridgeEast + ridgeNorth + (ridgedNoise + gullyNoise + microDetail) * mask - 2.5;

  return Math.max(-3.0, totalHeight);
}

export function MainMountain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    // 250x250 mesh grid for realistic mountain detail
    const geo = new THREE.PlaneGeometry(85, 85, 250, 250);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, realisticMountainTerrain(x, z));
    }
    geo.computeVertexNormals();

    const mat = createSnowTerrainMaterial();
    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    if (material.uniforms && material.uniforms.uTime) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, -2.5, -6]}
      castShadow
      receiveShadow
    />
  );
}
