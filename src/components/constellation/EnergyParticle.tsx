
"use client";

import { useMemo } from "react";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

type EnergyParticleProps = {
    groupRef: React.RefObject<THREE.Group | null>;
    meshRef: React.RefObject<THREE.Mesh | null>;
    materialRef: React.RefObject<THREE.ShaderMaterial | null>;
    color?: string;
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
    vec2 centered = vUv - vec2(0.5);

    float distanceFromCenter =
      length(centered) * 2.0;

    // Bright, concentrated white core.
    float core =
      exp(-80.0 *
          distanceFromCenter *
          distanceFromCenter);

    // Soft surrounding glow.
    float glow =
      exp(-7.0 *
          distanceFromCenter *
          distanceFromCenter);

    // Remove the square plane's corners.
    float edgeFade =
      1.0 - smoothstep(
        0.65,
        1.0,
        distanceFromCenter
      );

    vec3 finalColor =
      mix(uColor, vec3(1.0), core);

    float alpha =
      (core * 0.9 + glow * 0.7) *
      edgeFade *
      uOpacity;

    gl_FragColor =
      vec4(finalColor, alpha);
  }
`;

export default function EnergyParticle({
    groupRef,
    meshRef,
    materialRef,
    color = "#8ab8ff",
}: EnergyParticleProps) {
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
        <group ref={groupRef}>
            <Billboard follow>
                <mesh
                    ref={meshRef}
                    visible={false}
                    position={[0, 0, 0]}
                    scale={0.16}
                    raycast={() => []}
                    renderOrder={3}
                >
                    <planeGeometry args={[1, 1]} />

                    <shaderMaterial
                        ref={materialRef}
                        uniforms={uniforms}
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        transparent
                        depthWrite={false}
                        depthTest={false}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </Billboard>
        </group>
    );
}
