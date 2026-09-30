import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { cameraPath } from '../experience/CameraPath';
import { targetPath } from '../experience/TargetPath';

interface UseCameraScrollProps {
  progress: number;
  velocity?: number;
  mouse: { x: number; y: number };
  isDebug?: boolean;
}

export function useCameraScroll({ progress, velocity = 0, mouse, isDebug = false }: UseCameraScrollProps) {
  const currentPos = useRef(new THREE.Vector3(0, 4, 16));
  const currentTarget = useRef(new THREE.Vector3(0, 5, 0));
  const currentFov = useRef(35);
  const currentRoll = useRef(0);

  useFrame((state) => {
    if (isDebug) return; // OrbitControls handles camera in debug mode

    const clampedProgress = THREE.MathUtils.clamp(progress, 0, 1);
    
    // Get raw points along catmull rom splines
    const targetPos = cameraPath.getPointAt(clampedProgress);
    const targetLookAt = targetPath.getPointAt(clampedProgress);

    // Mouse parallax offset (max X +- 0.4deg => 0.007rad, Y +- 0.3deg => 0.005rad)
    const mouseOffsetX = mouse.x * 0.35;
    const mouseOffsetY = mouse.y * 0.25;

    targetPos.x += mouseOffsetX;
    targetPos.y += mouseOffsetY;

    // Smooth inertia lerp
    currentPos.current.lerp(targetPos, 0.06);
    currentTarget.current.lerp(targetLookAt, 0.06);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);

    // Camera roll (0 deg to 1.2 deg => 0.021 rad) along progress
    const targetRoll = THREE.MathUtils.lerp(0, 0.021, clampedProgress);
    currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, targetRoll, 0.05);
    state.camera.rotation.z += currentRoll.current;

    // FOV dynamic reactivity on fast scroll (35 -> 38 deg)
    const speed = Math.min(Math.abs(velocity) * 0.002, 3);
    const targetFov = 35 + speed;
    currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov, 0.08);

    if (state.camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(state.camera.fov - currentFov.current) > 0.01) {
        state.camera.fov = currentFov.current;
        state.camera.updateProjectionMatrix();
      }
    }
  });

  return { currentPos, currentTarget };
}
