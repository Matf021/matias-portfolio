
"use client";

import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type NodeHaloProps = {
    color: string;
    radius: number;
    intensity: number;
    selected: boolean;
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
  uniform float uIntensity;

  varying vec2 vUv;

  void main() {
    vec2 centeredUv = vUv - vec2(0.5);

    float distanceFromCenter =
      length(centeredUv) * 2.0;

    // Soft radial falloff.
    float glow = exp(
      -2.5 *
      distanceFromCenter *
      distanceFromCenter
    );

    // Fade out at the outer boundary.
    float edgeFade =
      1.0 - smoothstep(
        0.55,
        1.0,
        distanceFromCenter
      );

    float alpha =
      glow * edgeFade * uIntensity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function NodeHalo({
    color,
    radius,
    intensity,
    selected,
}: NodeHaloProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const materialRef =
        useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uColor: {
                value: new THREE.Color(color),
            },
            uIntensity: {
                value: 0,
            },
        }),
        [color]
    );

    useFrame(({ clock }, delta) => {
        const mesh = meshRef.current;
        const material = materialRef.current;

        if (!mesh || !material) return;

        const time = clock.getElapsedTime();

        const pulse = selected
            ? 1 + Math.sin(time * 2.2) * 0.06
            : 1;

        const targetScale = radius * 2 * pulse;

        const smoothing =
            1 - Math.exp(-6 * delta);

        const nextScale = THREE.MathUtils.lerp(
            mesh.scale.x,
            targetScale,
            smoothing
        );

        mesh.scale.setScalar(nextScale);

        const currentIntensity =
            material.uniforms.uIntensity.value;

        material.uniforms.uIntensity.value =
            THREE.MathUtils.lerp(
                currentIntensity,
                intensity,
                smoothing
            );
    });


    return (
        <Billboard follow>
            <mesh
                ref={meshRef}
                renderOrder={1}
                raycast={() => []}
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
    );
}
