// PostProcessing disabled - @react-three/postprocessing requires @react-three/fiber >= 9
// We have @react-three/fiber v8, so we use a no-op component instead.

interface PostProcessingProps {
  isMobile?: boolean;
}

export function PostProcessing({ isMobile: _isMobile = false }: PostProcessingProps) {
  // PostProcessing is disabled to maintain compatibility with @react-three/fiber v8.
  // For advanced bloom/vignette effects, upgrade to @react-three/fiber v9 and
  // @react-three/postprocessing v3.
  return null;
}
