import { useMemo } from 'react';
import * as THREE from 'three';

interface SkyBackgroundProps {
  progress?: number;
}

export function SkyBackground({ progress = 0 }: SkyBackgroundProps) {
  const skyMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTopColor: { value: new THREE.Color(0x92b8d4) },
        uBottomColor: { value: new THREE.Color(0xdde9ee) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(uBottomColor, uTopColor, pow(vUv.y, 0.7)), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh material={skyMat} renderOrder={-1}>
      <sphereGeometry args={[180, 32, 16]} />
    </mesh>
  );
}
