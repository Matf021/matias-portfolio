
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
    DirectionalStellarPalette,
} from "@/lib/directionalStellarPalette";

type StellarChromosphereProps = {
    color: string;
    radius: number;
    selected: boolean;
    arrivalFlashRef?: React.RefObject<number>;
    intensityScale?: number;
    directionalPalette?: DirectionalStellarPalette | null;
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
    uniform float uDirectionalCount;
    uniform vec3 uDirectionalColors[3];
    uniform vec3 uDirectionalVectors[3];

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
            5.5
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
            mix(0.22, 1.0, irregularity);

        float alpha =
            rim *
            atmosphericVariation *
            uIntensity;

                
        vec3 atmosphericBaseColor = uColor;

        // Directional project stars inherit
        // the colors of their associated disciplines.
        if (uDirectionalCount > 1.5) {
            vec3 weightedColor = vec3(0.0);
            float totalWeight = 0.0;

            for (int i = 0; i < 3; i++) {
                if (float(i) >= uDirectionalCount) {
                    break;
                }

                vec3 sourceDirection =
                    normalize(uDirectionalVectors[i]);

                float alignment = dot(
                    surfacePosition,
                    sourceDirection
                );

                // Broad, overlapping color regions.
                // A small baseline prevents abrupt
                // boundaries between disciplines.
                float weight =
                    0.12 +
                    pow(
                        max(alignment + 0.4, 0.0),
                        2.0
                    );

                weightedColor +=
                    uDirectionalColors[i] * weight;

                totalWeight += weight;
            }

            atmosphericBaseColor =
                weightedColor / max(
                    totalWeight,
                    0.0001
                );
        }

        // Keep a slightly luminous atmospheric tint,
        // while preserving more color on directional stars.
        float whiteBlend =
            uDirectionalCount > 1.5
                ? 0.12
                : 0.20;

        vec3 chromosphereColor = mix(
            atmosphericBaseColor,
            vec3(1.0),
            whiteBlend
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
    directionalPalette,
}: StellarChromosphereProps) {
    const materialRef =
        useRef<THREE.ShaderMaterial>(null);

    const directionalKey =
        directionalPalette?.sources
            .slice(0, 3)
            .map(
                (source) =>
                    `${source.color}:${source.direction.join(",")}`
            )
            .join("|") ?? "";

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

            uDirectionalCount: {
                value: Math.min(
                    directionalPalette?.sources.length ?? 0,
                    3
                ),
            },
            uDirectionalColors: {
                value: [0, 1, 2].map(
                    (index) =>
                        new THREE.Color(
                            directionalPalette?.sources[index]?.color ??
                            color
                        )
                ),
            },
            uDirectionalVectors: {
                value: [0, 1, 2].map(
                    (index) =>
                        new THREE.Vector3(
                            ...(directionalPalette?.sources[index]
                                ?.direction ?? [0, 0, 1])
                        ).normalize()
                ),
            },

        }),
        [color, directionalKey]
    );

    useFrame(({ clock }, delta) => {
        const material = materialRef.current;
        if (!material) return;

        const arrival =
            arrivalFlashRef?.current ?? 0;

        const targetIntensity =
            (
                (selected ? 0.34 : 0.19) +
                arrival * 0.22
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
