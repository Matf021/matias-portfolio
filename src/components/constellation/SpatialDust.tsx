
"use client";

import { useMemo } from "react";
import * as THREE from "three";

type DustFilament = {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    opacity: number;
    seed: number;
};

const FILAMENTS: DustFilament[] = [
    {
        position: [-11, 6, -19],
        rotation: [0.1, 0.25, -0.35],
        scale: [16, 5, 1],
        color: "#6485b8",
        opacity: 0.24,
        seed: 1.7,
    },
    {
        position: [12, 7, -27],
        rotation: [-0.15, -0.2, 0.3],
        scale: [18, 4, 1],
        color: "#7868aa",
        opacity: 0.20,
        seed: 4.3,
    },
    {
        position: [-13, -6, -24],
        rotation: [0.2, -0.1, 0.45],
        scale: [15, 4, 1],
        color: "#5577a3",
        opacity: 0.20,
        seed: 6.8,
    },
    {
        position: [11, -8, -20],
        rotation: [-0.1, 0.2, -0.25],
        scale: [17, 4.5, 1],
        color: "#5279a6",
        opacity: 0.20,
        seed: 9.2,
    },
    {
        position: [-3, 11, -34],
        rotation: [0.25, 0.1, 0.15],
        scale: [22, 5, 1],
        color: "#6675a5",
        opacity: 0.15,
        seed: 12.4,
    },
    {
        position: [4, -13, -30],
        rotation: [-0.2, -0.15, -0.4],
        scale: [20, 5, 1],
        color: "#536c9b",
        opacity: 0.16,
        seed: 15.8,
    },
];

const VERTEX_SHADER = `
    varying vec2 vUv;

    void main() {
        vUv = uv;

        gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
    }
`;

const FRAGMENT_SHADER = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uSeed;

    varying vec2 vUv;

    float hash(vec2 p) {
        return fract(
            sin(dot(p, vec2(127.1, 311.7))) *
            43758.5453
        );
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
            mix(
                hash(i),
                hash(i + vec2(1.0, 0.0)),
                f.x
            ),
            mix(
                hash(i + vec2(0.0, 1.0)),
                hash(i + vec2(1.0, 1.0)),
                f.x
            ),
            f.y
        );
    }

    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;

        for (int i = 0; i < 3; i++) {
            value += noise(p) * amplitude;
            p *= 2.03;
            amplitude *= 0.5;
        }

        return value;
    }

    void main() {
        vec2 uv = vUv * 2.0 - 1.0;

        // Coordinates elongated along X.
        vec2 p = uv * vec2(2.4, 3.0);

        // Warp the vertical centerline.
        float warp = fbm(
            vec2(p.x * 0.8, uSeed)
        );

        float centerline =
            (warp - 0.5) * 0.7;

        float distanceFromFilament =
            abs(uv.y - centerline);

        // Variable filament thickness.
        float thicknessNoise = fbm(
            vec2(p.x * 1.2, uSeed + 5.0)
        );

        float thickness =
            0.12 +
            thicknessNoise * 0.20;

        float filamentMask =
            1.0 - smoothstep(
                thickness * 0.35,
                thickness,
                distanceFromFilament
            );

        // Break the filament into uneven segments.
        float density = fbm(
            p * 1.7 + uSeed * 2.1
        );

        float densityMask = smoothstep(
            0.32,
            0.68,
            density
        );

        // Fade the ends without creating
        // a large elliptical silhouette.
        float endFade =
            1.0 - smoothstep(
                0.55,
                1.0,
                abs(uv.x)
            );

        // Very faint surrounding material.
        float diffuse =
            exp(
                -8.0 *
                distanceFromFilament *
                distanceFromFilament
            ) * 0.12;

        float alpha =
            (
                filamentMask * densityMask * 0.88 +
                diffuse
            ) *
            endFade *
            uOpacity;

        gl_FragColor = vec4(
            uColor,
            alpha
        );
    }
`;

export default function SpatialDust() {
    const filaments = useMemo(
        () =>
            FILAMENTS.map((filament) => ({
                ...filament,
                colorValue: new THREE.Color(
                    filament.color
                ),
            })),
        []
    );

    return (
        <group>
            {filaments.map((filament, index) => (
                <mesh
                    key={index}
                    position={filament.position}
                    rotation={filament.rotation}
                    scale={filament.scale}
                    renderOrder={-5}
                    raycast={() => null}
                >
                    <planeGeometry args={[1, 1]} />

                    <shaderMaterial
                        vertexShader={VERTEX_SHADER}
                        fragmentShader={FRAGMENT_SHADER}
                        uniforms={{
                            uColor: {
                                value: filament.colorValue,
                            },
                            uOpacity: {
                                value: filament.opacity,
                            },
                            uSeed: {
                                value: filament.seed,
                            },
                        }}
                        transparent
                        depthWrite={false}
                        depthTest={true}
                        side={THREE.DoubleSide}
                        blending={THREE.NormalBlending}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
}
