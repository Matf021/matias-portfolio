"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { subscribeToNodeArrival } from "@/lib/constellationEvents";
import ConstellationLabel from "./ConstellationLabel";
import NodeHalo from "./NodeHalo";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

const NODE_LIGHTING = {
    identity: {
        idle: 0.08,
        selected: 0.18,
        halo: 0.10,
    },
    discipline: {
        idle: 0.06,
        selected: 0.15,
        halo: 0.05,
    },
    detail: {
        idle: 0.04,
        selected: 0.12,
        halo: 0,
    },
    hoverBoost: 0.06,
    arrivalBoost: 0.30,
    arrivalDecay: 3,
} as const;

type NodeTier = "identity" | "discipline" | "detail";

const DISCIPLINE_IDS = new Set([
    "ai",
    "cloud",
    "creative",
    "software",
]);

function getNodeTier(id: string): NodeTier {
    if (id === "matias") {
        return "identity";
    }

    if (DISCIPLINE_IDS.has(id)) {
        return "discipline";
    }

    return "detail";
}

type ConstellationNodeProps = {
    node: ConstellationNodeData;
    selectedId: string | null;
    connectedIds: Set<string>;
    onSelect: (id: string) => void;
    hoveredIdsRef: React.RefObject<Set<string>>;
    hiddenLabelsRef: React.RefObject<Set<string>>;
};

export default function ConstellationNode({
    node,
    selectedId,
    connectedIds,
    onSelect,
    hoveredIdsRef,
    hiddenLabelsRef,
}: ConstellationNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef =
        useRef<THREE.MeshStandardMaterial>(null);
    const arrivalFlashRef = useRef(0);
    const [hovered, setHovered] = useState(false);

    const isSelected = selectedId === node.id;
    const isConnected = connectedIds.has(node.id);
    const tier = getNodeTier(node.id);
    const lighting = NODE_LIGHTING[tier];

    const isDimmed =
        selectedId !== null && !isConnected;

    useEffect(() => {
        if (!hovered) return;

        document.body.style.cursor = "pointer";

        return () => {
            document.body.style.cursor = "";
        };
    }, [hovered]);

    useEffect(() => {
        return subscribeToNodeArrival(
            node.id,
            () => {
                arrivalFlashRef.current = 1;
            }
        );
    }, [node.id]);

    useEffect(() => {
        const hoveredIds = hoveredIdsRef.current;
        const nodeId = node.id;

        return () => {
            hoveredIds.delete(nodeId);
        };
    }, [node.id, hoveredIdsRef]);

    const baseHaloIntensity = isSelected
        ? 0.65
        : hovered
            ? 0.3
            : isConnected && selectedId !== null
                ? 0.15
                : lighting.halo;


    useFrame((_, delta) => {
        if (!meshRef.current || !materialRef.current) {
            return;
        }

        const smoothing = 1 - Math.exp(-8 * delta);

        // Decay arrival feedback over time.
        arrivalFlashRef.current *= Math.exp(
            -NODE_LIGHTING.arrivalDecay * delta
        );

        // Avoid keeping extremely small residual values.
        if (arrivalFlashRef.current < 0.001) {
            arrivalFlashRef.current = 0;
        }

        // Animate node scale.
        const targetScale = isSelected
            ? 1.5
            : hovered
                ? 1.18
                : 1;

        const nextScale = THREE.MathUtils.lerp(
            meshRef.current.scale.x,
            targetScale,
            smoothing
        );

        meshRef.current.scale.setScalar(nextScale);

        // Animate node transparency.
        const targetOpacity = isDimmed ? 0.12 : 1;

        materialRef.current.opacity = THREE.MathUtils.lerp(
            materialRef.current.opacity,
            targetOpacity,
            smoothing
        );


        const baseEmissive = isDimmed
            ? lighting.idle * 0.5
            : isSelected
                ? lighting.selected
                : hovered
                    ? lighting.idle + NODE_LIGHTING.hoverBoost
                    : isConnected && selectedId !== null
                        ? lighting.idle + 0.025
                        : lighting.idle;


        const arrivalEmissive =
            arrivalFlashRef.current *
            NODE_LIGHTING.arrivalBoost;

        const targetEmissive =
            baseEmissive + arrivalEmissive;

        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
            materialRef.current.emissiveIntensity,
            targetEmissive,
            smoothing
        );
    });

    return (
        <group position={node.position}>
            <NodeHalo
                color={node.color}
                radius={node.size * 4}
                intensity={baseHaloIntensity}
                arrivalFlashRef={arrivalFlashRef}
                selected={isSelected}
            />

            <mesh
                ref={meshRef}
                onClick={(event) => {
                    event.stopPropagation();
                    onSelect(node.id);
                }}
                onPointerOver={(event) => {
                    event.stopPropagation();

                    hoveredIdsRef.current.add(node.id);
                    setHovered(true);
                }}

                onPointerOut={() => {
                    hoveredIdsRef.current.delete(node.id);
                    setHovered(false);
                }}
            >
                <sphereGeometry args={[node.size, 24, 24]} />


                <meshStandardMaterial
                    ref={materialRef}
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={lighting.idle}
                    roughness={0.42}
                    metalness={0.08}
                    transparent
                    opacity={1}
                    depthWrite={false}
                />

            </mesh>

            <ConstellationLabel
                node={node}
                hovered={hovered}
                selected={isSelected}
                connected={isConnected}
                hasSelection={selectedId !== null}
                hiddenLabelsRef={hiddenLabelsRef}
            />
        </group>
    );
}
