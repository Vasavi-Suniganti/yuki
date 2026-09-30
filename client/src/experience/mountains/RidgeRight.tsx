import { useMemo } from 'react';
import * as THREE from 'three';
import { createSnowTerrainMaterial } from './SnowMaterial';

export function RidgeRight() {
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(50, 50, 130, 130);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt((x + 3) ** 2 + (z - 1) ** 2);
      const height = Math.exp(-dist * 0.035) * 9.8 + Math.cos(x * 0.5) * Math.sin(z * 0.5) * 2.1;
      pos.setY(i, Math.max(-1, height));
    }
    geo.computeVertexNormals();
    return { geometry: geo, material: createSnowTerrainMaterial() };
  }, []);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[22, -3.5, -12]}
      rotation={[0, -0.38, 0]}
      castShadow
      receiveShadow
    />
  );
}
