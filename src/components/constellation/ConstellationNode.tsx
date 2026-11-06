"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { subscribeToNodeArrival } from "@/lib/constellationEvents";
import ConstellationLabel from "./ConstellationLabel";
import NodeHalo from "./NodeHalo";
import StellarCoreMaterial from "./StellarCoreMaterial";
import ProceduralPhotosphereMaterial from "./ProceduralPhotosphereMaterial";
import StellarChromosphere from "./StellarChromosphere";
import StellarCorona from "./StellarCorona";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

const NODE_LIGHTING = {
    identity: {
        idle: 0.08,
        selected: 0.18,
        halo: 0.16,
    },
    discipline: {
        idle: 0.06,
        selected: 0.15,
        halo: 0.09,
    },
    detail: {
        idle: 0.04,
        selected: 0.12,
        halo: 0.025,
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
    hoveredId: string | null;
    hoverConnectedIds: Set<string>;
    onHoverChange: (id: string | null) => void;
};

export default function ConstellationNode({
    node,
    selectedId,
    connectedIds,
    onSelect,
    hoveredIdsRef,
    hiddenLabelsRef,
    hoveredId,
    hoverConnectedIds,
    onHoverChange,
}: ConstellationNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef =
        useRef<THREE.ShaderMaterial>(null);
    const arrivalFlashRef = useRef(0);
    const [hovered, setHovered] = useState(false);

    const isSelected = selectedId === node.id;
    const isConnected = connectedIds.has(node.id);
    const tier = getNodeTier(node.id);
    const isPrimaryStar = tier === "identity";
    const isDisciplineStar = tier === "discipline";

    const hasStellarAtmosphere =
        isPrimaryStar || isDisciplineStar;
    const lighting = NODE_LIGHTING[tier];

    const isHoverRelated =
        hoveredId !== null &&
        hoveredId !== node.id &&
        hoverConnectedIds.has(node.id);

    const isEclipsed =
        selectedId !== null &&
        !isSelected &&
        !isConnected;

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
                : isHoverRelated && selectedId === null
                    ? lighting.halo + 0.09
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
        const targetOpacity = isEclipsed ? 0.12 : 1;

        const uniforms = materialRef.current.uniforms;

        uniforms.uOpacity.value = THREE.MathUtils.lerp(
            uniforms.uOpacity.value,
            targetOpacity,
            smoothing
        );


        const baseEmissive = isEclipsed
            ? lighting.idle * 0.5
            : isSelected
                ? lighting.selected
                : hovered
                    ? lighting.idle + NODE_LIGHTING.hoverBoost
                    : isConnected && selectedId !== null
                        ? lighting.idle + 0.025
                        : isHoverRelated
                            ? lighting.idle + 0.035
                            : lighting.idle;


        const arrivalEmissive =
            arrivalFlashRef.current *
            NODE_LIGHTING.arrivalBoost;

        const targetEmissive =
            baseEmissive + arrivalEmissive;

        const targetBrightness =
            1 + targetEmissive * 1.5;

        uniforms.uBrightness.value = THREE.MathUtils.lerp(
            uniforms.uBrightness.value,
            targetBrightness,
            smoothing
        );
    });

    return (
        <group position={node.position}>
            {hasStellarAtmosphere ? (
                <StellarCorona
                    color={node.color}
                    radius={node.size}
                    selected={isSelected}
                    eclipsed={isEclipsed}
                    photosphereRef={meshRef}
                    arrivalFlashRef={arrivalFlashRef}
                    intensityScale={isPrimaryStar ? 1 : 0.7}
                    debug={false}
                />
            ) : (
                <NodeHalo
                    color={node.color}
                    radius={node.size * 4}
                    intensity={baseHaloIntensity}
                    arrivalFlashRef={arrivalFlashRef}
                    selected={isSelected}
                />
            )}

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
                    onHoverChange(node.id);
                }}

                onPointerOut={() => {
                    hoveredIdsRef.current.delete(node.id);
                    setHovered(false);
                    onHoverChange(null);
                }}
            >
                <sphereGeometry args={[node.size, 24, 24]} />


                {hasStellarAtmosphere ? (
                    <ProceduralPhotosphereMaterial
                        color={node.color}
                        materialRef={materialRef}
                        detail={isPrimaryStar ? "primary" : "secondary"}
                    />
                ) : (
                    <StellarCoreMaterial
                        color={node.color}
                        materialRef={materialRef}
                    />
                )}

                {hasStellarAtmosphere && (
                    <StellarChromosphere
                        color={node.color}
                        radius={node.size}
                        selected={isSelected}
                        arrivalFlashRef={arrivalFlashRef}
                        intensityScale={isPrimaryStar ? 1 : 0.65}
                    />
                )}

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
