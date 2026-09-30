import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CloudsProps {
  progress?: number;
}

const CloudShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uOpacity: { value: 0.65 },
    uColor: { value: new THREE.Color(0xebf3f7) },
    uShadowColor: { value: new THREE.Color(0xb5c9d6) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uColor;
    uniform vec3 uShadowColor;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 centerUv = vUv - vec2(0.5);
      float dist = length(centerUv);
      float edgeAlpha = smoothstep(0.5, 0.1, dist);

      vec2 st = vUv * 3.0 + vec2(uTime * 0.03, uTime * 0.015);
      float n = fbm(st);
      
      float cloudDensity = smoothstep(0.2, 0.7, n) * edgeAlpha;
      vec3 cloudColor = mix(uShadowColor, uColor, smoothstep(0.1, 0.6, n));

      gl_FragColor = vec4(cloudColor, cloudDensity * uOpacity);
    }
  `
};

export function Clouds({ progress = 0 }: CloudsProps) {
  const fgGroup = useRef<THREE.Group>(null);
  const midGroup = useRef<THREE.Group>(null);
  const valleyGroup = useRef<THREE.Group>(null);
  const farGroup = useRef<THREE.Group>(null);

  const cloudMaterials = useMemo(() => {
    const createMat = (opacity: number, shadowTint: number) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(CloudShaderMaterial.uniforms),
        vertexShader: CloudShaderMaterial.vertexShader,
        fragmentShader: CloudShaderMaterial.fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      mat.uniforms.uOpacity.value = opacity;
      mat.uniforms.uShadowColor.value = new THREE.Color(shadowTint);
      return mat;
    };

    return {
      fg: createMat(0.45, 0xb8ccd8),
      mid: createMat(0.55, 0xaec3d2),
      valley: createMat(0.65, 0x9fb5c6),
      far: createMat(0.75, 0xd0e0ea),
      transition: createMat(0.0, 0x9cb4c5),
    };
  }, []);

  useFrame(() => {
    const t = performance.now() * 0.001;

    cloudMaterials.fg.uniforms.uTime.value = t;
    cloudMaterials.mid.uniforms.uTime.value = t;
    cloudMaterials.valley.uniforms.uTime.value = t;
    cloudMaterials.far.uniforms.uTime.value = t;
    cloudMaterials.transition.uniforms.uTime.value = t;

    if (fgGroup.current) fgGroup.current.position.x = (t * 0.012 * 8) % 30 - 15;
    if (midGroup.current) midGroup.current.position.x = (t * 0.007 * 8) % 40 - 20;
    if (valleyGroup.current) valleyGroup.current.position.x = (t * 0.005 * 8) % 35 - 17.5;
    if (farGroup.current) farGroup.current.position.x = (t * 0.003 * 8) % 50 - 25;

    const transitionPeak = Math.exp(-Math.pow((progress - 0.22) * 12.0, 2.0));
    const targetTransitionOpacity = transitionPeak * 0.8;
    cloudMaterials.transition.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      cloudMaterials.transition.uniforms.uOpacity.value,
      targetTransitionOpacity,
      0.1
    );
  });

  return (
    <group name="layered-clouds">
      {/* 1. Foreground Clouds */}
      <group ref={fgGroup} position={[0, 4.5, 10]}>
        <mesh material={cloudMaterials.fg} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[28, 12]} />
        </mesh>
        <mesh material={cloudMaterials.fg} position={[-12, 1, -2]} rotation={[-0.15, 0.2, 0.1]}>
          <planeGeometry args={[24, 10]} />
        </mesh>
      </group>

      {/* 2. Middle Clouds */}
      <group ref={midGroup} position={[-2, 6, 2]}>
        <mesh material={cloudMaterials.mid} rotation={[-0.1, -0.3, 0]}>
          <planeGeometry args={[36, 14]} />
        </mesh>
        <mesh material={cloudMaterials.mid} position={[15, -1, -5]} rotation={[0, 0.2, -0.05]}>
          <planeGeometry args={[32, 12]} />
        </mesh>
      </group>

      {/* 3. Valley Clouds */}
      <group ref={valleyGroup} position={[2, 2.2, -6]}>
        <mesh material={cloudMaterials.valley} rotation={[-0.4, 0.1, 0]}>
          <planeGeometry args={[42, 16]} />
        </mesh>
        <mesh material={cloudMaterials.valley} position={[-18, 0.5, -4]} rotation={[-0.3, -0.1, 0.05]}>
          <planeGeometry args={[38, 14]} />
        </mesh>
      </group>

      {/* 4. Far Background Clouds */}
      <group ref={farGroup} position={[0, 11, -38]}>
        <mesh material={cloudMaterials.far}>
          <planeGeometry args={[90, 30]} />
        </mesh>
      </group>

      {/* 5. Transition Obscuration Cloud */}
      <mesh material={cloudMaterials.transition} position={[-1, 5, 11]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[16, 9]} />
      </mesh>
    </group>
  );
}
