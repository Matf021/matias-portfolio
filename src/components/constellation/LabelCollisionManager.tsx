
"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projectLabelBounds } from "@/lib/labelProjection";
import {
    getStellarVisualScale,
} from "@/lib/stellarLabel";

import {
    getLabelPriority,
    resolveLabelCollisions,
} from "@/lib/labelCollision";

import type {
    LabelCandidate,
} from "@/lib/labelCollision";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

import {
    projectConnections,
    getConnectionAvoidanceOffset,
} from "@/lib/labelConnection";

import type {
    ConstellationEdge,
} from "@/types/constellation";

type Props = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
    connectedIds: Set<string>;
    hoveredIdsRef: React.RefObject<Set<string>>;
    hiddenLabelsRef: React.RefObject<Set<string>>;
    edges: ConstellationEdge[];
    labelOffsetsRef: React.RefObject<Map<string, number>>;
};

export default function LabelCollisionManager({
    nodes,
    selectedId,
    connectedIds,
    hoveredIdsRef,
    hiddenLabelsRef,
    edges,
    labelOffsetsRef,
}: Props) {
    const { camera, size } = useThree();

    useFrame((_, delta) => {
        camera.updateMatrixWorld();
        const perspectiveCamera =
            camera as THREE.PerspectiveCamera;

        const visibleEdges =
            selectedId === null
                ? edges
                : edges.filter(
                    (edge) =>
                        edge.source === selectedId ||
                        edge.target === selectedId
                );

        const segments = projectConnections(
            nodes,
            visibleEdges,
            perspectiveCamera,
            size.width,
            size.height
        );

        const nextOffsets = new Map<string, number>();
        const candidates: LabelCandidate[] = [];

        for (const node of nodes) {
            const selected = node.id === selectedId;
            const hovered = hoveredIdsRef.current.has(node.id);
            const visualScale = getStellarVisualScale(
                selected,
                hovered
            );
            const connected =
                selectedId !== null &&
                connectedIds.has(node.id);

            // Skip labels hidden by the existing hierarchy.
            if (
                !selected &&
                !hovered &&
                !connected &&
                (
                    selectedId !== null ||
                    node.category === "technology"
                )
            ) {
                continue;
            }

            const scale =
                selected ? 1.12 : hovered ? 1.06 : 1;

            const rect = projectLabelBounds(
                node,
                camera as THREE.PerspectiveCamera,
                size.width,
                size.height,
                scale,
                visualScale
            );

            if (!rect) continue;

            const desiredOffset = getConnectionAvoidanceOffset(
                node.id,
                rect,
                segments
            );

            const previousOffset =
                labelOffsetsRef.current.get(node.id) ?? 0;

            // Ignore tiny changes to avoid micro-adjustments.
            const stableTarget =
                Math.abs(desiredOffset - previousOffset) < 3
                    ? previousOffset
                    : desiredOffset;

            const smoothing = 1 - Math.exp(-8 * delta);

            const animatedOffset = THREE.MathUtils.lerp(
                previousOffset,
                stableTarget,
                smoothing
            );

            const finalOffset =
                Math.abs(animatedOffset) < 0.1 &&
                    desiredOffset === 0
                    ? 0
                    : animatedOffset;

            nextOffsets.set(node.id, finalOffset);

            const adjustedRect = {
                ...rect,
                y: rect.y + finalOffset,
            };

            candidates.push({
                id: node.id,
                rect: adjustedRect,
                priority: getLabelPriority(
                    node.category,
                    selected,
                    hovered,
                    connected,
                    selectedId !== null
                ),
            });
        }

        labelOffsetsRef.current = nextOffsets;

        hiddenLabelsRef.current = resolveLabelCollisions(
            candidates,
            {
                previousHidden: hiddenLabelsRef.current,
                hidePadding: 4,
                revealPadding: 12,
            }
        );
    }, -1);

    useEffect(() => {
        hiddenLabelsRef.current = new Set<string>();
    }, [selectedId, hiddenLabelsRef]);

    return null;
}
