
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
    arrivalFlashRef?: React.RefObject<number>;
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
    float r = length(centeredUv) * 2.0;

    // Concentrated light close to the stellar core.
    float innerCorona = exp(
      -10.0 * r * r
    );

    // Broad, faint atmospheric illumination.
    float outerAtmosphere = exp(
      -3.5 * r * r
    );

    // Smoothly fade the atmosphere at the
    // edge of the billboard.
    float edgeFade =
      1.0 - smoothstep(0.65, 1.0, r);

    // Keep the outer atmosphere restrained.
    float glow =
      innerCorona * 0.65 +
      outerAtmosphere * 0.35;

    float alpha =
      glow * edgeFade * uIntensity;

    gl_FragColor = vec4(
      uColor,
      alpha
    );
  }
`;

export default function NodeHalo({
    color,
    radius,
    intensity,
    selected,
    arrivalFlashRef,
}: NodeHaloProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const materialRef =
        useRef<THREE.ShaderMaterial>(null);

    const baseIntensityRef = useRef(0);
    const arrivalIntensityRef = useRef(0);
    const arrivalExpansionRef = useRef(0);

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

        // The arrival signal is shared with the brightness animation.
        const arrivalSignal = arrivalFlashRef?.current ?? 0;

        // Smoothly follow the arrival signal for expansion.
        const expansionSmoothing =
            1 - Math.exp(-7 * delta);

        arrivalExpansionRef.current = THREE.MathUtils.lerp(
            arrivalExpansionRef.current,
            arrivalSignal,
            expansionSmoothing
        );

        // Expand the halo by up to 18% during an arrival.
        const expansion =
            1 + arrivalExpansionRef.current * 0.18;

        const targetScale =
            radius * 2 * pulse * expansion;

        const smoothing =
            1 - Math.exp(-6 * delta);

        const nextScale = THREE.MathUtils.lerp(
            mesh.scale.x,
            targetScale,
            smoothing
        );

        mesh.scale.setScalar(nextScale);


        // Smooth the underlying selection/hover glow.
        baseIntensityRef.current = THREE.MathUtils.lerp(
            baseIntensityRef.current,
            intensity,
            smoothing
        );

        // Apply the arrival flash directly, without
        // smoothing away its initial brightness.

        const arrivalTarget = arrivalSignal * 0.4;

        // Smoothly follow the arrival signal.
        // Rise quickly, but fade more gently.
        const arrivalSmoothing =
            1 - Math.exp(
                -(arrivalTarget > arrivalIntensityRef.current
                    ? 14
                    : 4) * delta
            );

        arrivalIntensityRef.current = THREE.MathUtils.lerp(
            arrivalIntensityRef.current,
            arrivalTarget,
            arrivalSmoothing
        );

        material.uniforms.uIntensity.value =
            baseIntensityRef.current +
            arrivalIntensityRef.current;
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
