import * as THREE from 'three';

// Custom shader material for translucent polar glacial icebergs with cyan subsurface scattering & top snow cap
export function createIcebergMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDeepIceColor: { value: new THREE.Color('#0c5268') },    // Deep cyan-blue glacial core
      uIceSurfaceColor: { value: new THREE.Color('#5ec5d6') }, // Translucent turquoise ice
      uSnowCapColor: { value: new THREE.Color('#f4fafc') },    // Fresh top snow cover
      uSunDirection: { value: new THREE.Vector3(0.55, 0.78, 0.35).normalize() },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uDeepIceColor;
      uniform vec3 uIceSurfaceColor;
      uniform vec3 uSnowCapColor;
      uniform vec3 uSunDirection;
      uniform float uTime;

      varying vec3 vNormal;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 worldNorm = normalize(vWorldNormal);
        vec3 viewDir = normalize(vViewPosition);

        // 1. Fresnel rim reflection for translucent ice edges
        float fresnel = pow(1.0 - max(dot(viewDir, worldNorm), 0.0), 3.0);

        // 2. Snow cap accumulation on upward-facing flat ice surfaces
        float snowMask = smoothstep(0.55, 0.90, worldNorm.y);

        // 3. Glacial ice subsurface cyan gradient
        vec3 iceBase = mix(uDeepIceColor, uIceSurfaceColor, fresnel * 0.75 + 0.25);
        vec3 finalColor = mix(iceBase, uSnowCapColor, snowMask);

        // 4. Sun specular glint on ice facets
        vec3 halfVector = normalize(uSunDirection + viewDir);
        float spec = pow(max(dot(worldNorm, halfVector), 0.0), 32.0) * 0.6;
        finalColor += vec3(spec);

        gl_FragColor = vec4(finalColor, 0.95);
      }
    `,
    transparent: true,
  });
}
