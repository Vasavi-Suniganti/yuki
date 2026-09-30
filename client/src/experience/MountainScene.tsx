import { Suspense } from 'react';
import { MountainModel } from './MountainModel';
import { Clouds } from './Clouds';
import { SnowParticles } from './SnowParticles';
import { AtmosphericFog } from './AtmosphericFog';
import { EnvironmentLighting } from './EnvironmentLighting';
import { CameraRig } from './CameraRig';
import { SkyBackground } from './SkyBackground';
import { GlacialOcean } from './icebergs/GlacialOcean';
import { Icebergs } from './icebergs/Icebergs';

interface MountainSceneProps {
  progress: number;
  velocity: number;
  isMobile: boolean;
  isDebug: boolean;
  isLoaded: boolean;
}

export function MountainScene({ progress, velocity, isMobile, isDebug }: MountainSceneProps) {
  return (
    <>
      <AtmosphericFog progress={progress} />
      <EnvironmentLighting progress={progress} />

      <Suspense fallback={null}>
        <GlacialOcean />
        <Icebergs />
        <MountainModel snowStart={0.5} snowPeak={8.0} />
        <Clouds progress={progress} />
        <SnowParticles count={isMobile ? 300 : 700} />
      </Suspense>

      <CameraRig progress={progress} velocity={velocity} isDebug={isDebug} />
    </>
  );
}
