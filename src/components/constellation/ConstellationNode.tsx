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

const ARRIVAL_FLASH_DECAY = 5;

type ConstellationNodeProps = {
    node: ConstellationNodeData;
    selectedId: string | null;
    connectedIds: Set<string>;
    onSelect: (id: string) => void;
};

export default function ConstellationNode({
    node,
    selectedId,
    connectedIds,
    onSelect,
}: ConstellationNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef =
        useRef<THREE.MeshStandardMaterial>(null);
    const arrivalFlashRef = useRef(0);
    const [hovered, setHovered] = useState(false);

    const isSelected = selectedId === node.id;
    const isConnected = connectedIds.has(node.id);

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

    const baseHaloIntensity = isSelected
        ? 0.9
        : hovered
            ? 0.45
            : isConnected
                ? 0.3
                : 0;

    useFrame((_, delta) => {
        if (!meshRef.current || !materialRef.current) {
            return;
        }

        const smoothing = 1 - Math.exp(-8 * delta);

        // Animate node scale.
        const targetScale = isSelected
            ? 1.5
            : hovered
                ? 1.3
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

        // Animate emissive brightness.
        const targetEmissiveIntensity = isDimmed
            ? 0.05
            : isSelected
                ? 1.8
                : hovered
                    ? 1.1
                    : isConnected
                        ? 0.85
                        : 0.25;


        // Exponential decay of the arrival flash.
        arrivalFlashRef.current *= Math.exp(-ARRIVAL_FLASH_DECAY * delta);

        const arrivalBoost =
            arrivalFlashRef.current * 1.4;

        const finalEmissiveIntensity =
            targetEmissiveIntensity + arrivalBoost;


        materialRef.current.emissiveIntensity =
            THREE.MathUtils.lerp(
                materialRef.current.emissiveIntensity,
                finalEmissiveIntensity,
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
                    setHovered(true);
                }}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[node.size, 24, 24]} />

                <meshStandardMaterial
                    ref={materialRef}
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={0.4}
                    roughness={0.3}
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
            />
        </group>
    );
}
