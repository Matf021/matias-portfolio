
"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProceduralPhotosphereMaterialProps = {
    color: string;
    materialRef: React.RefObject<THREE.ShaderMaterial | null>;
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

        // Object-space coordinates for stable
        // surface patterns without UV seams.
        vObjectPosition = position;

        gl_Position =
            projectionMatrix * viewPosition;
    }
`;

const fragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uBrightness;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vObjectPosition;

    // Deterministic pseudo-random values.
    float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;

        return fract(
            p.x * p.y * p.z *
            (p.x + p.y + p.z)
        );
    }

    // Smooth 3D value noise.
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

        float facing = max(
            dot(normal, viewDirection),
            0.0
        );

        // Normalize object position so the
        // pattern scale is independent of radius.
        vec3 surfacePosition =
            normalize(vObjectPosition);

        // Very slow surface evolution.
        float t = uTime * 0.035;

        // Large-scale convection-inspired structure.
        float largePattern = noise3D(
            surfacePosition * 5.0 +
            vec3(t, t * 0.6, -t * 0.4)
        );

        // Smaller surface granulation.
        float finePattern = noise3D(
            surfacePosition * 17.0 +
            vec3(-t * 1.2, t * 0.8, t)
        );

        // Combine spatial scales.
        float granulation =
            largePattern * 0.65 +
            finePattern * 0.35;

        // Center the variation around zero.
        float thermalVariation =
            (granulation - 0.5) * 0.42;

        // Photospheric limb darkening.
        float limbDarkening =
            0.68 + 0.32 * pow(facing, 0.65);

        // Mildly warmer/brighter regions.
        vec3 brightColor = mix(
            uColor,
            vec3(1.0),
            0.28
        );

        vec3 surfaceColor = mix(
            uColor,
            brightColor,
            clamp(
                granulation * 0.85,
                0.0,
                1.0
            )
        );

        float luminosity =
            (1.0 + thermalVariation) *
            limbDarkening *
            uBrightness;

        // Preserve a soft silhouette.
        float edgeSoftness = smoothstep(
            0.0,
            0.18,
            facing
        );

        gl_FragColor = vec4(
            surfaceColor * luminosity,
            edgeSoftness * uOpacity
        );
    }
`;

export default function ProceduralPhotosphereMaterial({
    color,
    materialRef,
}: ProceduralPhotosphereMaterialProps) {
    const uniforms = useMemo(
        () => ({
            uColor: {
                value: new THREE.Color(color),
            },
            uOpacity: {
                value: 1,
            },
            uBrightness: {
                value: 1,
            },
            uTime: {
                value: 0,
            },
        }),
        [color]
    );

    useFrame(({ clock }) => {
        const material = materialRef.current;

        if (!material) return;

        material.uniforms.uTime.value =
            clock.getElapsedTime();
    });

    return (
        <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            side={THREE.FrontSide}
        />
    );
}
