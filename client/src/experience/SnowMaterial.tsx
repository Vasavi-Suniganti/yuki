import * as THREE from 'three';
import { useMemo } from 'react';

interface SnowMaterialProps {
  mountainSnowStart?: number;
  mountainSnowPeak?: number;
}

export function useSnowMaterial({
  mountainSnowStart = 0.5,
  mountainSnowPeak = 8.0
}: SnowMaterialProps = {}) {
  return useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      metalness: 0.05,
      color: new THREE.Color(0xe6f0f5),
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSnowStart = { value: mountainSnowStart };
      shader.uniforms.uSnowPeak = { value: mountainSnowPeak };
      shader.uniforms.uRockColorDark = { value: new THREE.Color(0x1e272e) };
      shader.uniforms.uRockColorMid = { value: new THREE.Color(0x485460) };
      shader.uniforms.uSnowColor = { value: new THREE.Color(0xf5f9fc) };

      shader.vertexShader = `
        varying vec3 vCustomWorldPos;
        varying vec3 vCustomWorldNormal;
        ${shader.vertexShader}
      `;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `
        #include <worldpos_vertex>
        vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vCustomWorldNormal = normalize(mat3(modelMatrix) * normal);
        `
      );

      shader.fragmentShader = `
        uniform float uSnowStart;
        uniform float uSnowPeak;
        uniform vec3 uRockColorDark;
        uniform vec3 uRockColorMid;
        uniform vec3 uSnowColor;
        varying vec3 vCustomWorldPos;
        varying vec3 vCustomWorldNormal;
        ${shader.fragmentShader}
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>

        float snowSlope = smoothstep(0.35, 0.75, vCustomWorldNormal.y);
        float snowHeight = smoothstep(uSnowStart, uSnowPeak, vCustomWorldPos.y);
        float snowAmount = snowSlope * snowHeight;

        float steepness = 1.0 - clamp(vCustomWorldNormal.y, 0.0, 1.0);
        vec3 rockColor = mix(uRockColorMid, uRockColorDark, smoothstep(0.3, 0.8, steepness));

        diffuseColor.rgb = mix(rockColor, uSnowColor, snowAmount);
        `
      );
    };

    return mat;
  }, [mountainSnowStart, mountainSnowPeak]);
}
