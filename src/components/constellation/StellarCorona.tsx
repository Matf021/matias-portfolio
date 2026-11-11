
"use client";

import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
    DirectionalStellarPalette,
} from "@/lib/directionalStellarPalette";

type StellarCoronaProps = {
    color: string;
    radius: number;
    selected: boolean;
    eclipsed?: boolean;
    photosphereRef: React.RefObject<THREE.Mesh | null>;
    arrivalFlashRef?: React.RefObject<number>;
    intensityScale?: number;
    debug?: boolean;
    directionalPalette?: DirectionalStellarPalette | null;
};

const CORONA_LUMINOSITY = {
    standard: {
        inner: 1.18,
        outer: 1.30,
    },
    directional: {
        inner: 1.85,
        outer: 2.20,
    },
} as const;

const SELECTION_LUMINOSITY = {
    innerBoost: 0.22,
    outerBoost: 0.35,
    riseSpeed: 2.4,
    fallSpeed: 1.6,
} as const;

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
    uniform float uInnerIntensity;
    uniform float uOuterIntensity;
    uniform float uTime;
    uniform float uDebug;
    uniform float uDirectionalCount;
    uniform vec3 uDirectionalColors[3];
    uniform vec3 uDirectionalScreenVectors[3];

    varying vec2 vUv;

    float hash(vec2 p) {
        return fract(
            sin(dot(p, vec2(127.1, 311.7))) *
            43758.5453
        );
    }

    float noise2D(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        return mix(
            mix(a, b, f.x),
            mix(c, d, f.x),
            f.y
        );
    }

    void main() {
        vec2 p = (vUv - 0.5) * 2.0;

        // The billboard is eight stellar
        // radii wide, so r = 1 corresponds
        // to the photosphere's edge.
        float r = length(p) * 4.0;

        vec2 direction =
            p / max(length(p), 0.0001);

        float outside = max(r - 1.0, 0.0);

        float t = uTime * 0.012;

        // --------------------------------
        // LAYER A: INNER ATMOSPHERE
        // --------------------------------

        // A continuous glow, with no noise
        // or directional activity mask.
        float innerGlow = exp(
            -2.0 * outside
        );

        // A soft transition at the limb.
        float limbGlow = exp(
            -pow((r - 1.08) / 0.32, 2.0)
        );

        float innerCorona =
            innerGlow * 0.42 +
            limbGlow * 0.58;

        // --------------------------------
        // LAYER B: OUTER CORONA
        // --------------------------------

        // Smoothly bend the sampling
        // direction as radius increases.
        // This avoids perfectly straight
        // radial structures.
        float bend = 0.12 * outside +
            0.045 * sin(
                outside * 1.8 + t
            );

        float cs = cos(bend);
        float sn = sin(bend);

        vec2 curvedDirection = vec2(
            direction.x * cs -
                direction.y * sn,
            direction.x * sn +
                direction.y * cs
        );

        // Periodic around the star because
        // we sample using a direction vector.
        float broad = noise2D(
            curvedDirection * 2.4 +
            vec2(13.7 + t, 4.3)
        );

        // A second field changes gradually
        // with distance from the surface.
        float flowing = noise2D(
            curvedDirection * 4.5 +
            vec2(
                outside * 0.65 + 8.1,
                outside * 0.42 - t
            )
        );

        // Small-scale variation, kept subtle.
        float detail = noise2D(
            curvedDirection * 8.0 +
            vec2(
                outside * 1.1 + 3.2,
                outside * 0.6 + 17.4
            )
        );

        // Smooth variation without hard
        // thresholds or activity cutoffs.
        float structure =
            broad * 0.55 +
            flowing * 0.35 +
            detail * 0.10;

        float reachNoise = noise2D(
            direction * 1.8 +
            vec2(21.4, 7.6)
        );

        // Broad, irregular variations in how far
        // the atmosphere extends.
        float reachVariation = mix(
            0.82,
            1.18,
            reachNoise
        );

        // Always retain a faint atmospheric
        // contribution in every direction.
        float density = mix(
            0.18,
            1.0,
            structure
        );

        // Outer plasma decays smoothly.
        float outerFalloff = exp(
            -0.65 * outside /
            reachVariation
        );
        
        // --------------------------------
        // OUTER CORONAL FILAMENTS
        // --------------------------------

        // Keep the existing diffuse outer
        // corona as our stable foundation.
        float diffuseOuter =
            density * outerFalloff;

        // Use an angle around the star.
        float angle = atan(
            direction.y,
            direction.x
        );

        // A slow, radius-dependent angular
        // displacement creates curved paths.
        float filamentBend =
            0.13 * outside +
            0.045 * sin(
                outside * 1.7 + t * 0.6
            );

        float filamentAngle =
            angle + filamentBend;

        // Four broad, smooth directional
        // regions around the star.
        //
        // Each uses a periodic cosine,
        // so there is no angular seam.
        float filamentPattern =
            0.5 + 0.5 * cos(
                filamentAngle * 4.0 + 0.7
            );

        // Narrow the brighter regions,
        // without introducing hard edges.
        float filamentShape =
            pow(filamentPattern, 6.0);

        // Add gentle spatial variation
        // along the filament paths.
        vec2 filamentDirection = vec2(
            cos(filamentAngle),
            sin(filamentAngle)
        );

        float filamentVariation = noise2D(
            filamentDirection *
                (3.0 + outside * 0.35) +
            vec2(
                outside * 0.25,
                -t * 0.4
            )
        );

        float filamentDensity =
            filamentShape *
            mix(
                0.65,
                1.0,
                filamentVariation
            );

        // Filaments become visible beyond
        // the immediate atmospheric boundary.
        float filamentStart = smoothstep(
            0.10,
            0.45,
            outside
        );

        // Extend farther than the diffuse
        // outer corona, but remain faint.
        float filamentFalloff = exp(
            -0.78 * outside
        );

        float filaments =
            filamentDensity *
            filamentStart *
            filamentFalloff;

        // Combine both outer structures.
        // The diffuse atmosphere remains
        // dominant.
        float outerCorona =
            diffuseOuter * 0.78 +
            filaments * 0.22;

        // --------------------------------
        // COMPOSITION
        // --------------------------------

        // Fade the effect into the stellar
        // limb instead of starting abruptly.
        float surfaceBlend = smoothstep(
            0.78,
            1.05,
            r
        );

        // Fade away before the billboard
        // boundary becomes visible.
        float boundaryFade =
            1.0 - smoothstep(
                2.4,
                3.95,
                r
            );

        innerCorona *=
            surfaceBlend * boundaryFade;

        outerCorona *=
            surfaceBlend * boundaryFade;
                
        // Start with the original corona color.
        // Non-directional stars remain unchanged.
        vec3 atmosphericBaseColor = uColor;

        if (uDirectionalCount > 1.5) {
            vec3 weightedColor = vec3(0.0);
            float totalWeight = 0.0;

            // Use the billboard's angular direction.
            // This is intentionally softer than
            // the photosphere's directional blending.
            for (int i = 0; i < 3; i++) {
                if (float(i) >= uDirectionalCount) {
                    break;
                }

                vec3 sourceDirection =
                    normalize(
                        uDirectionalScreenVectors[i]
                    );

                float alignment = dot(
                    direction,
                    sourceDirection.xy
                );

                float weight =
                    0.25 +
                    pow(
                        max(
                            alignment + 0.35,
                            0.0
                        ),
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

        // Slightly different temperatures
        // for the two atmospheric regions.
        float innerTint = uDirectionalCount > 1.5
            ? 0.24
            : 0.42;

        vec3 innerColor = mix(
            atmosphericBaseColor,
            vec3(0.88, 0.95, 1.0),
            innerTint
        );

        vec3 outerColor = mix(
            atmosphericBaseColor,
            vec3(0.68, 0.82, 1.0),
            0.18
        );

        // Additive atmospheric contributions.
        vec3 light =
            innerColor *
                innerCorona *
                uInnerIntensity +
            outerColor *
                outerCorona *
                uOuterIntensity;

        if (uDebug > 0.5) {
            light =
                innerColor * innerCorona * 0.8 +
                outerColor * outerCorona * 0.9;
        }

        // Keep alpha bounded while retaining
        // the relative RGB contributions.
        float alpha = clamp(
            max(
                max(light.r, light.g),
                light.b
            ),
            0.0,
            0.95
        );

        vec3 outputColor =
            alpha > 0.0001
                ? light / alpha
                : vec3(0.0);

        gl_FragColor = vec4(
            outputColor,
            alpha
        );
    }
`;

export default function StellarCorona({
    color,
    radius,
    selected,
    eclipsed = false,
    photosphereRef,
    arrivalFlashRef,
    debug = false,
    intensityScale = 1,
    directionalPalette,
}: StellarCoronaProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const selectionLuminosityRef = useRef(0);

    const materialRef =
        useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uColor: {
                value: new THREE.Color(color),
            },
            uInnerIntensity: {
                value: 0,
            },
            uOuterIntensity: {
                value: 0,
            },
            uTime: {
                value: 0,
            },
            uDebug: {
                value: debug ? 1 : 0,
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
            uDirectionalScreenVectors: {
                value: [0, 1, 2].map(
                    () => new THREE.Vector3(0, 0, 1)
                ),
            },
        }),
        [
            color,
            debug,
            directionalPalette?.sources,
        ]
    );

    const directionVector = useMemo(
        () => new THREE.Vector3(),
        []
    );

    useFrame(({ clock, camera }, delta) => {
        const mesh = meshRef.current;
        const material = materialRef.current;

        if (!mesh || !material) return;

        const arrival =
            arrivalFlashRef?.current ?? 0;

        const smoothing =
            1 - Math.exp(-5 * delta);


        const selectionTarget =
            selected && !eclipsed ? 1 : 0;

        const selectionSpeed =
            selectionTarget > selectionLuminosityRef.current
                ? SELECTION_LUMINOSITY.riseSpeed
                : SELECTION_LUMINOSITY.fallSpeed;

        const selectionSmoothing =
            1 - Math.exp(-selectionSpeed * delta);

        selectionLuminosityRef.current =
            THREE.MathUtils.lerp(
                selectionLuminosityRef.current,
                selectionTarget,
                selectionSmoothing
            );

        const selectionGlow =
            selectionLuminosityRef.current;


        // An eclipsed star retains a luminous rim,
        // but loses most of its extended atmosphere.
        const innerBase = eclipsed
            ? 0.46
            : selected
                ? 0.56
                : 0.36;

        const outerBase = eclipsed
            ? 0.055
            : selected
                ? 0.46
                : 0.24;

        const isDirectional =
            (directionalPalette?.sources.length ?? 0) >= 2;

        const luminosity = isDirectional
            ? CORONA_LUMINOSITY.directional
            : CORONA_LUMINOSITY.standard;


        const selectionInnerMultiplier =
            1 +
            selectionGlow *
            SELECTION_LUMINOSITY.innerBoost;

        const selectionOuterMultiplier =
            1 +
            selectionGlow *
            SELECTION_LUMINOSITY.outerBoost;

        const targetInner =
            (innerBase + arrival * 0.16) *
            intensityScale *
            luminosity.inner *
            selectionInnerMultiplier;

        const targetOuter =
            (outerBase + arrival * 0.12) *
            intensityScale *
            luminosity.outer *
            selectionOuterMultiplier;


        material.uniforms.uInnerIntensity.value =
            THREE.MathUtils.lerp(
                material.uniforms.uInnerIntensity.value,
                targetInner,
                smoothing
            );

        material.uniforms.uOuterIntensity.value =
            THREE.MathUtils.lerp(
                material.uniforms.uOuterIntensity.value,
                targetOuter,
                smoothing
            );

        material.uniforms.uTime.value =
            clock.getElapsedTime();

        material.uniforms.uDebug.value =
            debug ? 1 : 0;


        // Convert world-space discipline directions
        // into camera-space directions.
        //
        // X/Y correspond to the billboard's axes.
        // Z describes whether a discipline is
        // toward or away from the camera.
        for (
            let index = 0;
            index < Math.min(
                directionalPalette?.sources.length ?? 0,
                3
            );
            index++
        ) {
            const source =
                directionalPalette!.sources[index];

            directionVector
                .set(...source.direction)
                .transformDirection(
                    camera.matrixWorldInverse
                );

            const vectors =
                material.uniforms
                    .uDirectionalScreenVectors
                    .value as THREE.Vector3[];

            vectors[index].copy(directionVector);
        }

        // Synchronize the billboard with
        // the actual animated photosphere.
        const photosphereScale =
            photosphereRef.current?.scale.x ?? 1;

        mesh.scale.setScalar(
            radius * 8 * photosphereScale
        );
    });

    return (
        <Billboard follow>
            <mesh
                ref={meshRef}
                raycast={() => []}
                renderOrder={0}
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
                    toneMapped={false}
                />
            </mesh>
        </Billboard>
    );
}
