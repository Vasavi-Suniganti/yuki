import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function GlacialOcean() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uDeepWater: { value: new THREE.Color('#061624') },
        uShallowWater: { value: new THREE.Color('#104154') },
        uSunDirection: { value: new THREE.Vector3(0.55, 0.78, 0.35).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;
          // Subtle polar ocean wave ripples
          pos.z += sin(pos.x * 0.25 + uTime * 0.8) * 0.12 + cos(pos.y * 0.3 + uTime * 0.6) * 0.1;
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepWater;
        uniform vec3 uShallowWater;
        uniform vec3 uSunDirection;
        uniform float uTime;

        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          float wave = sin(vWorldPosition.x * 0.4 + vWorldPosition.z * 0.4 + uTime) * 0.5 + 0.5;
          vec3 waterColor = mix(uDeepWater, uShallowWater, wave * 0.35);
          gl_FragColor = vec4(waterColor, 0.88);
        }
      `,
    });
  }, []);

  useFrame(({ clock }) => {
    if (material.uniforms) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.8, -10]}
      material={material}
      receiveShadow
    >
      <planeGeometry args={[160, 160, 64, 64]} />
    </mesh>
  );
}
