
"use client";

import { useMemo } from "react";
import * as THREE from "three";

type StellarCoreMaterialProps = {
    color: string;
    materialRef: React.RefObject<THREE.ShaderMaterial | null>;
};

const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
        vec4 viewPosition =
            modelViewMatrix * vec4(position, 1.0);

        vViewPosition = -viewPosition.xyz;

        vNormal = normalize(
            normalMatrix * normal
        );

        gl_Position =
            projectionMatrix * viewPosition;
    }
`;

const fragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uBrightness;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewPosition);

        float facing = max(
            dot(normal, viewDirection),
            0.0
        );

        // Softer silhouette toward the edge.
        float edgeSoftness = smoothstep(
            0.0,
            0.45,
            facing
        );

        // Concentrate light toward the center.
        float core = pow(facing, 1.1);

        // Keep the center nearly white.
        vec3 stellarColor = mix(
            uColor,
            vec3(1.0),
            core * 0.4
        );

        float luminosity =
            0.65 + core * 0.4;

        vec3 finalColor =
            stellarColor *
            luminosity *
            uBrightness;

        float alpha =
            edgeSoftness * uOpacity;

        gl_FragColor =
            vec4(finalColor, alpha);
    }
`;

export default function StellarCoreMaterial({
    color,
    materialRef,
}: StellarCoreMaterialProps) {
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
        }),
        [color]
    );

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
