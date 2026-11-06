
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ConnectionPulse from "./ConnectionPulse";
import * as THREE from "three";

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
        useRef<THREE.LineBasicMaterial>(null);

    const geometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...start),
            new THREE.Vector3(...end),
        ]);
    }, [start, end]);

    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

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
        if (!materialRef.current) return;

        const targetOpacity =
            selectedId !== null
                ? highlighted
                    ? 1
                    : 0.05
                : hoverHighlighted
                    ? 0.78
                    : 0.5;

        const smoothing = 1 - Math.exp(-8 * delta);

        materialRef.current.opacity = THREE.MathUtils.lerp(
            materialRef.current.opacity,
            targetOpacity,
            smoothing
        );

        const targetColor = highlighted
            ? CONNECTION_COLORS.selected
            : hoverHighlighted
                ? CONNECTION_COLORS.hover
                : CONNECTION_COLORS.normal;

        materialRef.current.color.lerp(
            targetColor,
            smoothing
        );
    });


    return (
        <>
            <lineSegments geometry={geometry}>
                <lineBasicMaterial
                    ref={materialRef}
                    color="#456b9a"
                    transparent
                    opacity={0.5}
                    depthWrite={false}
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
