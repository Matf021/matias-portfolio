
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StellarChromosphereProps = {
    color: string;
    radius: number;
    selected: boolean;
    arrivalFlashRef?: React.RefObject<number>;
    intensityScale?: number;
};

const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vObjectPosition;

    void main() {
        vec4 viewPosition =
            modelViewMatrix * vec4(position, 1.0);

        vViewPosition = -viewPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vObjectPosition = position;

        gl_Position =
            projectionMatrix * viewPosition;
    }
`;

const fragmentShader = `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vObjectPosition;

    float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;

        return fract(
            p.x * p.y * p.z *
            (p.x + p.y + p.z)
        );
    }

    float noise3D(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
            mix(
                mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
                mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x),
                f.y
            ),
            mix(
                mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x),
                f.y
            ),
            f.z
        );
    }

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewPosition);

        float facing = abs(
            dot(normal, viewDirection)
        );

        // Fresnel-style limb illumination.
        float rim = pow(
            1.0 - facing,
            8.0
        );

        vec3 surfacePosition =
            normalize(vObjectPosition);

        float t = uTime * 0.025;

        // Broad atmospheric irregularity.
        float broadNoise = noise3D(
            surfacePosition * 7.0 +
            vec3(t, -t * 0.7, t * 0.3)
        );

        // Finer local structure.
        float fineNoise = noise3D(
            surfacePosition * 19.0 +
            vec3(-t, t * 0.6, t)
        );

        float irregularity =
            broadNoise * 0.7 +
            fineNoise * 0.3;

        // Slightly irregular brightness,
        // rather than a uniform neon outline.
        float atmosphericVariation =
            mix(0.35, 1.0, irregularity);

        float alpha =
            rim *
            atmosphericVariation *
            uIntensity;

        vec3 chromosphereColor = mix(
            uColor,
            vec3(1.0),
            0.2
        );

        gl_FragColor = vec4(
            chromosphereColor,
            alpha
        );
    }
`;

export default function StellarChromosphere({
    color,
    radius,
    selected,
    arrivalFlashRef,
    intensityScale = 1,
}: StellarChromosphereProps) {
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
            uTime: {
                value: 0,
            },
        }),
        [color]
    );

    useFrame(({ clock }, delta) => {
        const material = materialRef.current;
        if (!material) return;

        const arrival =
            arrivalFlashRef?.current ?? 0;

        const targetIntensity =
            (
                (selected ? 0.4 : 0.22) +
                arrival * 0.25
            ) * intensityScale;

        const smoothing =
            1 - Math.exp(-5 * delta);

        material.uniforms.uIntensity.value =
            THREE.MathUtils.lerp(
                material.uniforms.uIntensity.value,
                targetIntensity,
                smoothing
            );

        material.uniforms.uTime.value =
            clock.getElapsedTime();
    });

    return (
        <mesh
            scale={1.025}
            raycast={() => []}
            renderOrder={2}
        >
            <sphereGeometry args={[radius, 32, 32]} />

            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.FrontSide}
            />
        </mesh>
    );
}
