import { OrbitControls } from '@react-three/drei';
import { useCameraScroll } from '../hooks/useCameraScroll';
import { useMouseParallax } from '../hooks/useMouseParallax';

interface CameraRigProps {
  progress: number;
  velocity?: number;
  isDebug?: boolean;
}

export function CameraRig({ progress, velocity = 0, isDebug = false }: CameraRigProps) {
  const mouse = useMouseParallax();
  const { currentPos, currentTarget } = useCameraScroll({ progress, velocity, mouse, isDebug });

  if (isDebug) {
    return <OrbitControls makeDefault enableDamping dampingFactor={0.05} />;
  }

  return null;
}
