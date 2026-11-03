
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";


function createSeededRandom(initialSeed: number) {
    let seed = initialSeed;

    return function random() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}


type AtmosphericStarfieldProps = {
    count?: number;
    radius?: number;
};

export default function AtmosphericStarfield({
    count = 450,
    radius = 75,
}: AtmosphericStarfieldProps) {
    const starsRef = useRef<THREE.Points>(null);
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const brightness = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        const random = createSeededRandom(12345);

        const coolWhite = new THREE.Color("#dbe8ff");
        const paleBlue = new THREE.Color("#b4ceff");
        const softWhite = new THREE.Color("#ffffff");
        const starColor = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Uniform direction on a sphere
            const theta = random() * Math.PI * 2;
            const z = random() * 2 - 1;
            const xy = Math.sqrt(1 - z * z);

            // Multiple depth layers
            const distance =
                radius * (0.55 + random() * 0.45);

            const x =
                distance * xy * Math.cos(theta);

            const y =
                distance * xy * Math.sin(theta);

            const depth = distance * z;

            const index = i * 3;

            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = depth;

            // Choose star population
            const type = random();


            if (type < 0.75) {
                // Background stars: small but clearly visible
                sizes[i] = 2.4;
                brightness[i] = 0.75 + random() * 0.15;

                starColor.copy(paleBlue);
            } else if (type < 0.95) {
                // Midrange stars: slightly brighter
                sizes[i] = 3.0;
                brightness[i] = 0.85 + random() * 0.1;

                starColor.copy(coolWhite);
            } else {
                // Accent stars: rare luminous highlights
                sizes[i] = 4.0;
                brightness[i] = 0.95 + random() * 0.05;

                starColor.copy(softWhite);
            }

            colors[index] = starColor.r;
            colors[index + 1] = starColor.g;
            colors[index + 2] = starColor.b;
        }

        const bufferGeometry =
            new THREE.BufferGeometry();

        bufferGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        bufferGeometry.setAttribute(
            "aSize",
            new THREE.BufferAttribute(sizes, 1)
        );

        bufferGeometry.setAttribute(
            "aBrightness",
            new THREE.BufferAttribute(brightness, 1)
        );

        bufferGeometry.setAttribute(
            "aColor",
            new THREE.BufferAttribute(colors, 3)
        );

        return bufferGeometry;
    }, [count, radius]);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: `
                attribute float aSize;
                attribute float aBrightness;
                attribute vec3 aColor;

                varying float vBrightness;
                varying vec3 vColor;

                void main() {
                    vBrightness = aBrightness;
                    vColor = aColor;

                    vec4 mvPosition =
                        modelViewMatrix *
                        vec4(position, 1.0);

                    gl_Position =
                        projectionMatrix * mvPosition;

                    // Fixed size in screen pixels
                    gl_PointSize = aSize;
                }
            `,
            fragmentShader: `
                varying float vBrightness;
                varying vec3 vColor;

                void main() {
                    vec2 uv = gl_PointCoord - vec2(0.5);
                    float distanceFromCenter = length(uv);

                    // Bright central region
                    float core = 1.0 - smoothstep(
                        0.2,
                        0.42,
                        distanceFromCenter
                    );

                    // Softer outer glow
                    float halo = 1.0 - smoothstep(
                        0.0,
                        0.5,
                        distanceFromCenter
                    );

                    // Favor a crisp center over a diffuse gradient
                    float glow = core * 0.9 + halo * 0.1;

                    float alpha = glow * vBrightness;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending,
        });
    }, []);


    useFrame((_, delta) => {
        if (!starsRef.current) return;

        // Extremely slow ambient rotation
        starsRef.current.rotation.y += delta * 0.0008;
    });


    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    return (
        <points
            ref={starsRef}
            geometry={geometry}
            material={material}
            frustumCulled={false}
        />
    );
}
