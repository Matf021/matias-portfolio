
"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projectLabelBounds } from "@/lib/labelProjection";

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

type Props = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
    connectedIds: Set<string>;
    hoveredIdsRef: React.RefObject<Set<string>>;
    hiddenLabelsRef: React.RefObject<Set<string>>;
};

export default function LabelCollisionManager({
    nodes,
    selectedId,
    connectedIds,
    hoveredIdsRef,
    hiddenLabelsRef,
}: Props) {
    const { camera, size } = useThree();

    const worldPosition = useRef(new THREE.Vector3());

    useFrame(() => {
        camera.updateMatrixWorld();
        const candidates: LabelCandidate[] = [];

        for (const node of nodes) {
            const selected = node.id === selectedId;
            const hovered = hoveredIdsRef.current.has(node.id);
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

            worldPosition.current.set(...node.position);

            // Match the vertical label offset.
            worldPosition.current.y -= node.size + 0.23;

            worldPosition.current.project(camera);

            const scale =
                selected ? 1.12 : hovered ? 1.06 : 1;

            const rect = projectLabelBounds(
                node,
                camera as THREE.PerspectiveCamera,
                size.width,
                size.height,
                scale
            );

            if (!rect) continue;

            candidates.push({
                id: node.id,
                rect,
                priority: getLabelPriority(
                    node.category,
                    selected,
                    hovered,
                    connected,
                    selectedId !== null
                ),
            });
        }

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
