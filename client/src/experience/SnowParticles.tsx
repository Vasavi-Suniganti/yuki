import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SnowParticlesProps {
  count?: number;
}

export function SnowParticles({ count = 800 }: SnowParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [geometry, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;

      vel[i * 3] = (Math.random() - 0.5) * 0.015;
      vel[i * 3 + 1] = -(Math.random() * 0.02 + 0.008);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return [geo, vel];
  }, [count]);

  const particleMaterial = useMemo(() => {
    // Create soft circular snowflake texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.4, 'rgba(235, 245, 250, 0.6)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      size: 0.14,
      map: tex,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const time = performance.now() * 0.001;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.004;
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(time * 0.8 + i) * 0.004;

      if (arr[i * 3 + 1] < -2) arr[i * 3 + 1] = 25;
      if (arr[i * 3] < -30) arr[i * 3] = 30;
      if (arr[i * 3] > 30) arr[i * 3] = -30;
      if (arr[i * 3 + 2] < -35) arr[i * 3 + 2] = 15;
      if (arr[i * 3 + 2] > 15) arr[i * 3 + 2] = -35;
    }

    posAttr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={particleMaterial} />;
}
