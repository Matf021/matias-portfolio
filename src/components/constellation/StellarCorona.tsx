
"use client";

import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StellarCoronaProps = {
    color: string;
    radius: number;
    selected: boolean;
    photosphereRef: React.RefObject<THREE.Mesh | null>;
    arrivalFlashRef?: React.RefObject<number>;
    debug?: boolean;
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
    uniform float uInnerIntensity;
    uniform float uOuterIntensity;
    uniform float uTime;
    uniform float uDebug;

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
            -pow((r - 1.06) / 0.24, 2.0)
        );

        float innerCorona =
            innerGlow * 0.58 +
            limbGlow * 0.42;

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

        // Always retain a faint atmospheric
        // contribution in every direction.
        float density = mix(
            0.38,
            1.0,
            structure
        );

        // Outer plasma decays smoothly.
        float outerFalloff = exp(
            -1.15 * outside
        );

        float outerCorona =
            density * outerFalloff;

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
                2.9,
                3.8,
                r
            );

        innerCorona *=
            surfaceBlend * boundaryFade;

        outerCorona *=
            surfaceBlend * boundaryFade;

        // Slightly different temperatures
        // for the two atmospheric regions.
        vec3 innerColor = mix(
            uColor,
            vec3(0.88, 0.95, 1.0),
            0.42
        );

        vec3 outerColor = mix(
            uColor,
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
    photosphereRef,
    arrivalFlashRef,
    debug = false,
}: StellarCoronaProps) {
    const meshRef = useRef<THREE.Mesh>(null);

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
        }),
        [color, debug]
    );

    useFrame(({ clock }, delta) => {
        const mesh = meshRef.current;
        const material = materialRef.current;

        if (!mesh || !material) return;

        const arrival =
            arrivalFlashRef?.current ?? 0;

        const smoothing =
            1 - Math.exp(-5 * delta);

        const targetInner =
            (selected ? 0.56 : 0.36) +
            arrival * 0.16;

        const targetOuter =
            (selected ? 0.38 : 0.24) +
            arrival * 0.12;

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
