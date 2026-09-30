import { useMemo } from 'react';
import * as THREE from 'three';

export function BackgroundMountains() {
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(130, 55, 90, 45);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = Math.sin(x * 0.14) * Math.cos(z * 0.14) * 7.2 + Math.cos(x * 0.28) * 3.5;
      pos.setY(i, Math.max(0, h));
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#325064'),
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });
    return { geometry: geo, material: mat };
  }, []);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, -5, -48]}
      receiveShadow
    />
  );
}
