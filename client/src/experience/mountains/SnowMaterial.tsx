import * as THREE from 'three';

// Hyper-realistic terrain shader with procedural normal detail, rock/snow albedo, specular glint, and altitude/slope blending
export function createSnowTerrainMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRockColor: { value: new THREE.Color('#111c26') },         // Dark basalt slate rock
      uRockHighlight: { value: new THREE.Color('#253746') },     // Weathered rock ridge highlights
      uSnowColor: { value: new THREE.Color('#f8fafc') },         // Crisp alpine powder snow
      uSnowShadow: { value: new THREE.Color('#b8d2e0') },        // Snow shadow tone
      uShadowColor: { value: new THREE.Color('#52758a') },       // Deep atmospheric shadow tint
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
      uniform vec3 uRockColor;
      uniform vec3 uRockHighlight;
      uniform vec3 uSnowColor;
      uniform vec3 uSnowShadow;
      uniform vec3 uShadowColor;
      uniform vec3 uSunDirection;
      uniform float uTime;

      varying vec3 vNormal;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      // High-precision 3D Noise generator for micro-rock bump detail
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
                       mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
                       mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y), f.z);
      }

      float fbm(vec3 p) {
        float v = 0.0; float a = 0.5;
        for(int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.08;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 worldNorm = normalize(vWorldNormal);

        // 1. Procedural micro-rock bump & cliff detail
        float rockGrain = fbm(vWorldPosition * 0.55);
        vec3 rockBase = mix(uRockColor, uRockHighlight, rockGrain);

        // 2. Realistic Slope snow accumulation
        // Flatter surfaces accumulate snow; steep cliff faces (>48° slope) shed snow exposing dark rock
        float slopeSnow = smoothstep(0.38, 0.82, worldNorm.y + (rockGrain - 0.5) * 0.18);

        // 3. Altitude snowline mask
        float altitudeSnow = smoothstep(0.1, 8.5, vWorldPosition.y + (rockGrain - 0.5) * 0.8);

        float snowMask = clamp(slopeSnow * altitudeSnow, 0.0, 1.0);

        // 4. Snow specular sparkle / sun glint
        vec3 viewDir = normalize(vViewPosition);
        vec3 halfVector = normalize(uSunDirection + viewDir);
        float NdotH = max(dot(worldNorm, halfVector), 0.0);
        float snowGlint = pow(NdotH, 24.0) * 0.4;

        vec3 snowBase = mix(uSnowShadow, uSnowColor, smoothstep(0.0, 0.5, dot(worldNorm, uSunDirection))) + vec3(snowGlint);

        vec3 terrainColor = mix(rockBase, snowBase, snowMask);

        // 5. Directional sun lighting + ambient shadow tinting
        float NdotL = max(dot(worldNorm, uSunDirection), 0.0);
        float lightIntensity = 0.35 + 0.65 * NdotL;

        vec3 shadowTint = mix(uShadowColor * 1.1, vec3(1.0), NdotL);
        vec3 finalColor = terrainColor * lightIntensity * shadowTint;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });
}
