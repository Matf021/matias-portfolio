
"use client";

import { useMemo } from "react";
import * as THREE from "three";

const NEBULA_VERTEX_SHADER = `
    varying vec3 vDirection;

    void main() {
        vDirection = normalize(position);

        gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
    }
`;

const NEBULA_FRAGMENT_SHADER = `
    varying vec3 vDirection;

    float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;

        return fract(
            p.x * p.y * p.z *
            (p.x + p.y + p.z)
        );
    }

    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
            mix(
                mix(
                    hash(i + vec3(0, 0, 0)),
                    hash(i + vec3(1, 0, 0)),
                    f.x
                ),
                mix(
                    hash(i + vec3(0, 1, 0)),
                    hash(i + vec3(1, 1, 0)),
                    f.x
                ),
                f.y
            ),
            mix(
                mix(
                    hash(i + vec3(0, 0, 1)),
                    hash(i + vec3(1, 0, 1)),
                    f.x
                ),
                mix(
                    hash(i + vec3(0, 1, 1)),
                    hash(i + vec3(1, 1, 1)),
                    f.x
                ),
                f.y
            ),
            f.z
        );
    }

    float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;

        for (int i = 0; i < 4; i++) {
            value += noise(p) * amplitude;
            p *= 2.03;
            amplitude *= 0.5;
        }

        return value;
    }

    void main() {
        vec3 direction = normalize(vDirection);

        
        vec3 p = direction * 3.0;

        // Low-frequency distortion of the sampling space.
        vec3 warp = vec3(
            fbm(p + vec3(2.1, 0.0, 0.0)),
            fbm(p + vec3(0.0, 5.7, 0.0)),
            fbm(p + vec3(0.0, 0.0, 9.3))
        );

        // Center the distortion around zero.
        warp = (warp - 0.5) * 1.4;

        vec3 warpedP = p + warp;

        // Stretch the sampling space to create
        // less rounded, more elongated structures.
        vec3 filamentP = warpedP * vec3(
            1.8, 0.75, 1.3
        );

        float largeScale = fbm(warpedP);

        float filaments = fbm(
            filamentP * 2.4
        );

        float density =
            largeScale * 0.68 +
            filaments * 0.32;


        // Only the densest areas become visible.
        
        float cloud = smoothstep(
            0.40,
            0.66,
            density
        );

        // Broader, slightly more luminous color variation.
        vec3 deepBlue = vec3(
            0.07, 0.13, 0.26
        );

        vec3 mutedViolet = vec3(
            0.13, 0.08, 0.24
        );

        float colorMix = fbm(
            direction * 2.0 + 12.0
        );

        vec3 color = mix(
            deepBlue,
            mutedViolet,
            colorMix
        );

        // Strong enough to evaluate visually,
        // but still restrained.
        float opacity = cloud * 0.38;

        gl_FragColor = vec4(
            color,
            opacity
        );

    }
`;

export default function AtmosphericNebula() {
    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader: NEBULA_VERTEX_SHADER,
                fragmentShader: NEBULA_FRAGMENT_SHADER,
                transparent: true,
                depthWrite: false,
                side: THREE.BackSide,
                blending: THREE.NormalBlending,
                toneMapped: false,
            }),
        []
    );

    return (
        <mesh
            renderOrder={-10}
            raycast={() => null}
        >
            <sphereGeometry args={[65, 48, 32]} />
            <primitive
                object={material}
                attach="material"
                dispose={null}
            />
        </mesh>
    );
}
