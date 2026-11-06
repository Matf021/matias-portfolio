
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import ConnectionPulse from "./ConnectionPulse";
import { isConnectedEdge } from "@/lib/graph";

import type {
    ConstellationEdge,
    Position3D,
} from "@/types/constellation";

const CONNECTION_COLORS = {
    normal: new THREE.Color("#456b9a"),
    hover: new THREE.Color("#719bd0"),
    selected: new THREE.Color("#8ab8ff"),
};

type ConstellationConnectionProps = {
    start: Position3D;
    end: Position3D;
    edge: ConstellationEdge;
    selectedId: string | null;
    hoveredId: string | null;
    startRadius: number;
    endRadius: number;
};

const vertexShader = `
    attribute float aProgress;

    varying float vProgress;

    void main() {
        vProgress = aProgress;

        gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;

    uniform float uLength;
    uniform float uStartFade;
    uniform float uEndFade;

    varying float vProgress;

    void main() {
        // Distance from each endpoint
        // measured along the connection.
        float fromStart =
            vProgress * uLength;

        float fromEnd =
            (1.0 - vProgress) * uLength;

        // The line disappears near each
        // stellar surface and gradually
        // emerges outside its atmosphere.
        float startVisibility = smoothstep(
            uStartFade * 0.65,
            uStartFade,
            fromStart
        );

        float endVisibility = smoothstep(
            uEndFade * 0.65,
            uEndFade,
            fromEnd
        );

        float visibility =
            startVisibility * endVisibility;

        float alpha =
            uOpacity * visibility;

        gl_FragColor = vec4(
            uColor,
            alpha
        );
    }
`;

function getEdgeDelay(
    source: string,
    target: string
): number {
    const key = `${source}-${target}`;

    let hash = 0;

    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) | 0;
    }

    return (Math.abs(hash) % 6) * 0.15;
}

export default function ConstellationConnection({
    start,
    end,
    edge,
    selectedId,
    hoveredId,
    startRadius,
    endRadius,
}: ConstellationConnectionProps) {
    const materialRef =
        useRef<THREE.ShaderMaterial>(null);

    const geometry = useMemo(() => {
        const buffer = new THREE.BufferGeometry();

        buffer.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                [...start, ...end],
                3
            )
        );

        buffer.setAttribute(
            "aProgress",
            new THREE.Float32BufferAttribute(
                [0, 1],
                1
            )
        );

        return buffer;
    }, [start, end]);

    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

    const length = useMemo(() => {
        return new THREE.Vector3(...start)
            .distanceTo(new THREE.Vector3(...end));
    }, [start, end]);

    const uniforms = useMemo(
        () => ({
            uColor: {
                value: CONNECTION_COLORS.normal.clone(),
            },
            uOpacity: {
                value: 0.5,
            },
            uLength: {
                value: length,
            },
            uStartFade: {
                value: startRadius * 2.0,
            },
            uEndFade: {
                value: endRadius * 2.0,
            },
        }),
        [length, startRadius, endRadius]
    );

    const highlighted =
        selectedId !== null &&
        isConnectedEdge(selectedId, edge);

    const hoverHighlighted =
        selectedId === null &&
        hoveredId !== null &&
        isConnectedEdge(hoveredId, edge);

    const pulseStart =
        selectedId === edge.target ? end : start;

    const pulseEnd =
        selectedId === edge.target ? start : end;

    const destinationId =
        selectedId === edge.target
            ? edge.source
            : edge.target;

    const pulseDelay = getEdgeDelay(
        edge.source,
        edge.target
    );

    useFrame((_, delta) => {
        const material = materialRef.current;

        if (!material) return;

        const targetOpacity =
            selectedId !== null
                ? highlighted
                    ? 1
                    : 0.05
                : hoverHighlighted
                    ? 0.78
                    : 0.5;

        const targetColor = highlighted
            ? CONNECTION_COLORS.selected
            : hoverHighlighted
                ? CONNECTION_COLORS.hover
                : CONNECTION_COLORS.normal;

        const smoothing =
            1 - Math.exp(-8 * delta);

        material.uniforms.uOpacity.value =
            THREE.MathUtils.lerp(
                material.uniforms.uOpacity.value,
                targetOpacity,
                smoothing
            );

        (
            material.uniforms.uColor
                .value as THREE.Color
        ).lerp(
            targetColor,
            smoothing
        );
    });

    return (
        <>
            <lineSegments geometry={geometry}>
                <shaderMaterial
                    ref={materialRef}
                    uniforms={uniforms}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent
                    depthWrite={false}
                    depthTest
                    toneMapped={false}
                />
            </lineSegments>

            <ConnectionPulse
                start={pulseStart}
                end={pulseEnd}
                startRadius={
                    (selectedId === edge.target
                        ? endRadius
                        : startRadius) * 1.5
                }
                endRadius={
                    selectedId === edge.target
                        ? startRadius
                        : endRadius
                }
                destinationId={destinationId}
                active={highlighted}
                delay={pulseDelay}
                duration={2.4}
            />
        </>
    );
}
