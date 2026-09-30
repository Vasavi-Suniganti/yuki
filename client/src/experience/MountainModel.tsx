import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

// Multi-octave noise for realistic mountain terrain
function noise2D(x: number, z: number): number {
  const d = Math.sqrt(x * x + z * z);
  const mainPeak = Math.exp(-d * 0.08) * 14.5;
  const ridge1 = Math.abs(Math.sin(x * 0.18 + Math.cos(z * 0.15))) * 5.2;
  const p2 = Math.sin(x * 0.08) * Math.cos(z * 0.09) * 4.0;
  const detail = (Math.sin(x * 0.45) * Math.cos(z * 0.42) + Math.sin(x * 0.9 + z * 0.8) * 0.5) * 1.2;
  const valley = Math.pow(Math.abs(Math.sin(x * 0.05 + z * 0.05)), 1.8) * -3.5;
  return mainPeak + ridge1 + p2 + detail + valley - 2.0;
}

function distantNoise(x: number, z: number): number {
  return (
    Math.sin(x * 0.06 + 1.2) * Math.cos(z * 0.05 - 0.8) * 7.5 +
    Math.abs(Math.sin(x * 0.15 + z * 0.12)) * 3.2 - 3.0
  );
}

function buildTerrainGeo(width: number, depth: number, segs: number, heightFn: (x: number, z: number) => number) {
  const geo = new THREE.PlaneGeometry(width, depth, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, heightFn(x, z));
  }
  geo.computeVertexNormals();
  return geo;
}

function buildMat(snowStart: number, snowPeak: number) {
  const mat = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.05,
    color: new THREE.Color(0xd8e8ef),
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uSnowStart = { value: snowStart };
    shader.uniforms.uSnowPeak = { value: snowPeak };

    shader.vertexShader = `
      varying vec3 vWPos;
      varying vec3 vWNorm;
      ${shader.vertexShader}
    `.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
       vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
       vWNorm = normalize(mat3(modelMatrix) * normal);`
    );

    shader.fragmentShader = `
      uniform float uSnowStart;
      uniform float uSnowPeak;
      varying vec3 vWPos;
      varying vec3 vWNorm;
      ${shader.fragmentShader}
    `.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
       float snowSlope  = smoothstep(0.35, 0.75, vWNorm.y);
       float snowHeight = smoothstep(uSnowStart, uSnowPeak, vWPos.y);
       float snow = snowSlope * snowHeight;
       float steep = 1.0 - clamp(vWNorm.y, 0.0, 1.0);
       vec3 rock = mix(vec3(0.27,0.31,0.35), vec3(0.12,0.15,0.17), smoothstep(0.3,0.8,steep));
       diffuseColor.rgb = mix(rock, vec3(0.94,0.97,0.99), snow);`
    );
  };

  return mat;
}

interface MountainModelProps {
  snowStart?: number;
  snowPeak?: number;
}

export function MountainModel({ snowStart = 0.5, snowPeak = 8.0 }: MountainModelProps) {
  const [tryGlb] = useState(true);
  const [glbFailed, setGlbFailed] = useState(false);

  // Build geometry imperatively so no R3F declarative API issues
  const geos = useMemo(() => ({
    main: buildTerrainGeo(80, 80, 200, noise2D),
    secondary: buildTerrainGeo(110, 110, 140, distantNoise),
    rightRidge: buildTerrainGeo(60, 60, 140, noise2D),
    far: buildTerrainGeo(180, 140, 100, (x, z) =>
      Math.sin(x * 0.04) * Math.cos(z * 0.03) * 11.0 + Math.sin(x * 0.1) * 3.0 - 5.0),
  }), []);

  const mat = useMemo(() => buildMat(snowStart, snowPeak), [snowStart, snowPeak]);

  // Try GLB; on 404/error fall back silently
  useEffect(() => {
    if (!tryGlb) return;
    fetch('/models/mountain.glb', { method: 'HEAD' })
      .then(r => { if (!r.ok) setGlbFailed(true); })
      .catch(() => setGlbFailed(true));
  }, [tryGlb]);

  // Always render procedural terrain (GLB integration can be added later)
  return (
    <group name="mountain-landscape">
      {/* Giant main summit – fills 75-90% of viewport */}
      <mesh geometry={geos.main} material={mat} position={[0, 0, -2]} castShadow receiveShadow />

      {/* Secondary range behind */}
      <mesh geometry={geos.secondary} material={mat} position={[-15, -1, -28]} rotation={[0, 0.4, 0]} receiveShadow />

      {/* Right foreground ridge */}
      <mesh geometry={geos.rightRidge} material={mat} position={[24, -2.5, -14]} rotation={[0, -0.75, 0]} scale={[0.75, 0.85, 0.75]} castShadow receiveShadow />

      {/* Far atmospheric layer */}
      <mesh geometry={geos.far} material={mat} position={[0, -2, -55]} rotation={[0, 0.1, 0]} receiveShadow />
    </group>
  );
}
