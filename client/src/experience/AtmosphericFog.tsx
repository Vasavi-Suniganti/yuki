import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

interface AtmosphericFogProps {
  progress?: number;
  isLoaded?: boolean;
}

export function AtmosphericFog({ progress = 0, isLoaded = true }: AtmosphericFogProps) {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2(new THREE.Color(0xdce7ea), 0.02);
    return () => { scene.fog = null; };
  }, [scene]);

  useFrame(() => {
    if (!scene.fog || !(scene.fog instanceof THREE.FogExp2)) return;

    // Color progression across scroll
    const colorA = new THREE.Color(0xdce7ea);
    const colorB = new THREE.Color(0xc6d6dc);
    const colorC = new THREE.Color(0xb8ccd5);
    const colorD = new THREE.Color(0xe8f1f4);

    let target = new THREE.Color();
    if (progress < 0.3) {
      target.lerpColors(colorA, colorB, progress / 0.3);
    } else if (progress < 0.7) {
      target.lerpColors(colorB, colorC, (progress - 0.3) / 0.4);
    } else {
      target.lerpColors(colorC, colorD, (progress - 0.7) / 0.3);
    }

    scene.fog.color.lerp(target, 0.04);

    // Natural fog density – slightly deeper in valleys mid-scroll
    const baseDensity = 0.018;
    const midBoost = 0.006 * Math.sin(progress * Math.PI);
    const targetDensity = baseDensity + midBoost;
    scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, targetDensity, 0.04);
  });

  return null;
}
