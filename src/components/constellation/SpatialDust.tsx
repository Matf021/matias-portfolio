
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

type SpatialDustProps = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
};

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

const DISCIPLINE_IDS = [
    "ai",
    "cloud",
    "creative",
    "software",
] as const;

const LIGHT_RADIUS = 35;
const LIGHT_STRENGTH = 0.22;

const VERTEX_SHADER = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
        vUv = uv;

        vec4 worldPosition =
            modelMatrix * vec4(position, 1.0);

        vWorldPosition = worldPosition.xyz;

        gl_Position =
            projectionMatrix *
            viewMatrix *
            worldPosition;
    }
`;

const FRAGMENT_SHADER = `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uSeed;

    uniform vec3 uLightPositions[4];
    uniform vec3 uLightColors[4];
    uniform float uLightRadius;
    uniform float uLightStrength;
    uniform vec4 uSelectionWeights;
    uniform float uSelectionBoost;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

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
    
        vec3 calculateStellarIllumination(
            vec3 worldPosition
        ) {
            vec3 illumination = vec3(0.0);

            for (int i = 0; i < 4; i++) {
                float distanceToStar = distance(
                    worldPosition,
                    uLightPositions[i]
                );

                float influence =
                    1.0 - smoothstep(
                        0.0,
                        uLightRadius,
                        distanceToStar
                    );

                float selectionWeight =
                    uSelectionWeights[i];

                float strength =
                    uLightStrength *
                    (
                        1.0 +
                        selectionWeight * uSelectionBoost
                    );

                illumination +=
                    uLightColors[i] *
                    influence *
                    strength;
            }

            return illumination;
        }


    void main() {
        vec2 uv = vUv * 2.0 - 1.0;

        // Elongated sampling coordinates.
        vec2 p = uv * vec2(2.4, 3.0);

        // Distort the filament centerline.
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

        // Fade the ends of the filament.
        float endFade =
            1.0 - smoothstep(
                0.55,
                1.0,
                abs(uv.x)
            );

        // Faint surrounding material.
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

        // Calculate color contribution from stars.
        vec3 illumination =
            calculateStellarIllumination(
                vWorldPosition
            );

        vec3 finalColor =
            uColor + illumination;

        gl_FragColor = vec4(
            finalColor,
            alpha
        );
    }
`;

export default function SpatialDust({
    nodes,
    selectedId,
}: SpatialDustProps) {
    const materialsRef = useRef<THREE.ShaderMaterial[]>([]);

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

    const disciplineLights = useMemo(() => {
        return DISCIPLINE_IDS.map((id) => {
            const node = nodes.find(
                (candidate) => candidate.id === id
            );

            if (!node) {
                throw new Error(
                    `Missing discipline node: ${id}`
                );
            }

            return node;
        });
    }, [nodes]);

    const lightPositions = useMemo(
        () =>
            disciplineLights.map(
                (node) =>
                    new THREE.Vector3(...node.position)
            ),
        [disciplineLights]
    );

    const lightColors = useMemo(
        () =>
            disciplineLights.map(
                (node) =>
                    new THREE.Color(node.color)
            ),
        [disciplineLights]
    );

    const dustUniforms = useMemo(
        () =>
            filaments.map((filament) => ({
                uColor: {
                    value: filament.colorValue,
                },
                uOpacity: {
                    value: filament.opacity,
                },
                uSeed: {
                    value: filament.seed,
                },
                uLightPositions: {
                    value: lightPositions,
                },
                uLightColors: {
                    value: lightColors,
                },
                uLightRadius: {
                    value: LIGHT_RADIUS,
                },
                uLightStrength: {
                    value: LIGHT_STRENGTH,
                },
                uSelectionWeights: {
                    value: new THREE.Vector4(0, 0, 0, 0),
                },
                uSelectionBoost: {
                    value: 3.0,
                },
            })),
        [filaments, lightPositions, lightColors]
    );

    const selectionWeights = useMemo(() => {
        const weights = [0, 0, 0, 0];

        if (!selectedId) {
            return weights;
        }

        const selectedNode = nodes.find(
            (node) => node.id === selectedId
        );

        if (!selectedNode) {
            return weights;
        }

        const activeDisciplines =
            selectedNode.category === "discipline"
                ? [selectedNode.id]
                : selectedNode.disciplines ?? [];

        DISCIPLINE_IDS.forEach((id, index) => {
            if (activeDisciplines.includes(id)) {
                weights[index] = 1;
            }
        });

        return weights;
    }, [nodes, selectedId]);


    useFrame((_, delta) => {
        const smoothing =
            1 - Math.exp(-3.5 * delta);

        for (const material of materialsRef.current) {
            if (!material) continue;

            const weights =
                material.uniforms.uSelectionWeights
                    .value as THREE.Vector4;

            weights.x = THREE.MathUtils.lerp(
                weights.x,
                selectionWeights[0],
                smoothing
            );

            weights.y = THREE.MathUtils.lerp(
                weights.y,
                selectionWeights[1],
                smoothing
            );

            weights.z = THREE.MathUtils.lerp(
                weights.z,
                selectionWeights[2],
                smoothing
            );

            weights.w = THREE.MathUtils.lerp(
                weights.w,
                selectionWeights[3],
                smoothing
            );
        }
    });


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
                        ref={(material) => {
                            if (material) {
                                materialsRef.current[index] = material;
                            }
                        }}
                        vertexShader={VERTEX_SHADER}
                        fragmentShader={FRAGMENT_SHADER}
                        uniforms={dustUniforms[index]}
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
