
"use client";

import { useMemo } from "react";
import * as THREE from "three";


type ConnectionTrailProps = {
    color?: string;
    meshRef: React.RefObject<THREE.Mesh | null>;
    materialRef: React.RefObject<THREE.ShaderMaterial | null>;
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // Tail fades toward the left.
    float longitudinalFade =
      smoothstep(0.0, 1.0, vUv.x);

    // Soft edges across the trail's width.
    float distanceFromCenter =
      abs(vUv.y - 0.5) * 2.0;

    float widthFade =
      exp(-6.0 * distanceFromCenter *
          distanceFromCenter);

    float alpha =
      longitudinalFade *
      widthFade *
      uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function ConnectionTrail({
    color = "#8ab8ff",
    meshRef,
    materialRef,
}: ConnectionTrailProps) {

    const uniforms = useMemo(
        () => ({
            uColor: {
                value: new THREE.Color(color),
            },
            uOpacity: {
                value: 0,
            },
        }),
        [color]
    );

    return (
        <mesh
            ref={meshRef}
            raycast={() => []}
            renderOrder={2}
        >
            <planeGeometry args={[1, 1]} />

            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
