import { useMemo } from 'react';
import * as THREE from 'three';
import { createSnowTerrainMaterial } from './SnowMaterial';

export function RidgeLeft() {
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(45, 45, 120, 120);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt((x - 2) ** 2 + (z + 2) ** 2);
      const height = Math.exp(-dist * 0.04) * 8.5 + Math.sin(x * 0.45) * Math.cos(z * 0.45) * 1.8;
      pos.setY(i, Math.max(-1, height));
    }
    geo.computeVertexNormals();
    return { geometry: geo, material: createSnowTerrainMaterial() };
  }, []);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[-20, -3.5, 2]}
      rotation={[0, 0.42, 0]}
      castShadow
      receiveShadow
    />
  );
}
