
"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { StellarPalette } from "@/lib/stellarPalette";
import type {
    DirectionalStellarPalette,
} from "@/lib/directionalStellarPalette";

type ProceduralPhotosphereMaterialProps = {
    color: string;
    materialRef: React.RefObject<THREE.ShaderMaterial | null>;
    palette?: StellarPalette;
    directionalPalette?: DirectionalStellarPalette | null;
    detail?: "primary" | "secondary" | "technology";
};

const STELLAR_RIFT = {
    width: 0.055,
    brightness: 0.24,
    irregularity: 0.18,
} as const;

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
    uniform vec3 uPrimaryColor;
    uniform vec3 uSecondaryColor;
    uniform vec3 uTertiaryColor;
    uniform float uColorCount;
    uniform float uOpacity;
    uniform float uBrightness;
    uniform float uTime;
    uniform float uLargeFrequency;
    uniform float uFineFrequency;
    uniform float uVariationStrength;
    uniform float uDirectionalCount;
    uniform vec3 uDirectionalColors[3];
    uniform vec3 uDirectionalVectors[3];
    uniform float uRiftWidth;
    uniform float uRiftBrightness;
    uniform float uRiftIrregularity;

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
            surfacePosition * uLargeFrequency +
            vec3(t, t * 0.6, -t * 0.4)
        );

        // Smaller surface granulation.
        float finePattern = noise3D(
            surfacePosition * uFineFrequency +
            vec3(-t * 1.2, t * 0.8, t)
        );

        // Combine spatial scales.
        float granulation =
            largePattern * 0.65 +
            finePattern * 0.35;

        // Broad regions of different stellar temperatures.
        // These reuse the existing noise system.
        
        vec3 blendedColor = uPrimaryColor;
        float riftMask = 0.0;
        float riftShadow = 0.0;
        float riftIntensity = 1.0;

        if (uColorCount > 1.5) {
            float colorPattern = noise3D(
                surfacePosition * 3.2 +
                vec3(
                    t * 0.45,
                    -t * 0.3,
                    t * 0.2
                )
            );

            float colorDetail = noise3D(
                surfacePosition * 8.0 +
                vec3(
                    -t * 0.6,
                    t * 0.4,
                    t * 0.3
                )
            );

            float colorVariation =
                colorPattern * 0.8 +
                colorDetail * 0.2;

            float secondaryWeight = smoothstep(
                0.40,
                0.78,
                colorVariation
            ) * 0.24;

            blendedColor = mix(
                blendedColor,
                uSecondaryColor,
                secondaryWeight
            );

            if (uColorCount > 2.5) {
                float tertiaryWeight = smoothstep(
                    0.42,
                    0.78,
                    1.0 - colorVariation
                ) * 0.25;

                blendedColor = mix(
                    blendedColor,
                    uTertiaryColor,
                    tertiaryWeight
                );
            }
        }

        if (uDirectionalCount > 1.5) {
            vec3 weightedColor = vec3(0.0);
            float totalWeight = 0.0;
            float firstWeight = 0.0;
            float secondWeight = 0.0;

            // Gentle displacement of the boundaries,
            // driven by the existing surface noise.
            float boundaryVariation =
                (granulation - 0.5) * 0.22;
   
            for (int i = 0; i < 3; i++) {
                if (float(i) >= uDirectionalCount) {
                    break;
                }

                vec3 direction =
                    normalize(uDirectionalVectors[i]);

                float alignment = dot(
                    surfacePosition,
                    direction
                );

                // Calculate the weight first.
                float weight = 0.04 + pow(
                    max(
                        alignment + boundaryVariation + 0.25,
                        0.0
                    ),
                    3.0
                );

                // Store the first two weights
                // for the rift calculation.
                if (i == 0) {
                    firstWeight = weight;
                } else if (i == 1) {
                    secondWeight = weight;
                }

                weightedColor +=
                    uDirectionalColors[i] * weight;

                totalWeight += weight;
            }

            blendedColor =
                weightedColor / max(totalWeight, 0.0001);

                        
            if (uDirectionalCount > 1.5 &&
                uDirectionalCount < 2.5) {
                
            vec3 firstDirection =
                normalize(uDirectionalVectors[0]);

            vec3 secondDirection =
                normalize(uDirectionalVectors[1]);

            // The normal of the boundary separating
            // the two directional color regions.
            vec3 boundaryAxis = normalize(
                firstDirection - secondDirection
            );

            // Signed distance from the boundary
            // in directional space.
            float boundaryDistance = dot(
                surfacePosition,
                boundaryAxis
            );

            // Large-scale distortion:
            // bends the overall path of the rift.
            float broadNoise = noise3D(
                surfacePosition * 3.5 +
                vec3(
                    t * 0.035,
                    -t * 0.025,
                    t * 0.02
                )
            );

            // Medium-scale distortion:
            // introduces uneven curves and bends.
            float mediumNoise = noise3D(
                surfacePosition * 9.0 +
                vec3(
                    -t * 0.08,
                    t * 0.06,
                    t * 0.04
                )
            );

            // Fine-scale distortion:
            // adds small irregularities along the edges.
            float fineNoise = noise3D(
                surfacePosition * 24.0
            );

            // Combine the three scales.
            float distortion =
                (broadNoise - 0.5) *
                    uRiftIrregularity * 2.0 +
                (mediumNoise - 0.5) *
                    uRiftIrregularity * 0.75 +
                (fineNoise - 0.5) *
                    uRiftIrregularity * 0.25;

            // Calculate distance from the
            // irregularly displaced boundary.
            float distanceToRift = abs(
                boundaryDistance + distortion
            );

            // Stable variation along the fracture.
            // Low frequency produces broad, natural
            // sections rather than random pixel noise.
            float widthNoise = noise3D(
                surfacePosition * 6.0 +
                vec3(17.3, 4.1, 9.7)
            );

            // Most sections stay close to the base width.
            // Some narrow to 75%; others widen to 125%.
            float localRiftWidth = uRiftWidth * mix(
                0.75,
                1.25,
                widthNoise
            );
            
            riftMask = 1.0 - smoothstep(
                0.0,
                localRiftWidth,
                distanceToRift
            );

            riftShadow = 1.0 - smoothstep(
                localRiftWidth * 0.5,
                localRiftWidth * 2.0,
                distanceToRift
            );
            // Different noise coordinates prevent
            // brightness from perfectly following width.
            float brightnessNoise = noise3D(
                surfacePosition * 8.0 +
                vec3(31.7, 12.4, 5.9)
            );

            // Gentle variation in emitted light.
            riftIntensity = mix(
                0.65,
                1.20,
                brightnessNoise
            );
            }

        }

        // Center the variation around zero.
        float thermalVariation =
            (granulation - 0.5) * uVariationStrength;

        // Photospheric limb darkening.
        float limbDarkening =
            0.68 + 0.32 * pow(facing, 0.65);

        // Mildly warmer/brighter regions.
        float whiteningStrength =
            uColorCount > 1.5 ? 0.06 : 0.10;

        vec3 brightColor = mix(
            blendedColor,
            vec3(1.0),
            whiteningStrength
        );

        vec3 surfaceColor = mix(
            blendedColor,
            brightColor,
            clamp(
                granulation * 0.85,
                0.0,
                1.0
            )
        );

        // Darken the area surrounding the rift,
        // suggesting a shallow depression.
        surfaceColor *= 1.0 - riftShadow * 0.12;

        // Warm plasma light along the fracture.
        // The emission is deliberately restrained.
        vec3 riftColor = vec3(
            1.0,
            0.87,
            0.67
        );

        surfaceColor +=
            riftColor *
            riftMask *
            uRiftBrightness *
            riftIntensity;

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
    palette,
    detail = "primary",
    directionalPalette,
}: ProceduralPhotosphereMaterialProps) {
    const isPrimary = detail === "primary";
    const isTechnology = detail === "technology";

    const directionalSources = useMemo(
        () => directionalPalette?.sources.slice(0, 3) ?? [],
        [directionalPalette?.sources]
    );

    const uniforms = useMemo(
        () => ({
            uColor: {
                value: new THREE.Color(color),
            },
            uPrimaryColor: {
                value: new THREE.Color(
                    palette?.primary ?? color
                ),
            },
            uSecondaryColor: {
                value: new THREE.Color(
                    palette?.secondary ?? color
                ),
            },
            uTertiaryColor: {
                value: new THREE.Color(
                    palette?.tertiary ?? color
                ),
            },
            uColorCount: {
                value: palette?.colorCount ?? 1,
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

            // Restore the procedural surface controls.
            uLargeFrequency: {
                value: isTechnology ? 4.0 : isPrimary ? 5.0 : 6.5,
            },
            uFineFrequency: {
                value: isTechnology ? 12.0 : isPrimary ? 17.0 : 21.0,
            },
            uVariationStrength: {
                value: isTechnology ? 0.22 : isPrimary ? 0.42 : 0.34,
            },
            uDirectionalCount: {
                value: directionalSources.length,
            },
            uDirectionalColors: {
                value: [0, 1, 2].map(
                    (index) =>
                        new THREE.Color(
                            directionalSources[index]?.color ?? "#ffffff"
                        )
                ),
            },
            uDirectionalVectors: {
                value: [0, 1, 2].map(
                    (index) =>
                        new THREE.Vector3(
                            ...(directionalSources[index]?.direction ??
                                [0, 0, 1])
                        )
                ),
            },
            uRiftWidth: {
                value: STELLAR_RIFT.width,
            },
            uRiftBrightness: {
                value: STELLAR_RIFT.brightness,
            },
            uRiftIrregularity: {
                value: STELLAR_RIFT.irregularity,
            },
        }),
        [
            color,
            palette?.primary,
            palette?.secondary,
            palette?.tertiary,
            palette?.colorCount,
            isPrimary,
            isTechnology,
            directionalSources,
        ]
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
