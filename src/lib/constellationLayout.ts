import {
    constellationLayout,
    addPositions,
} from "@/data/constellationLayout";

import type {
    ConstellationNodeData,
    Position3D,
} from "@/types/constellation";

export type ConstellationLayoutMode =
    | "desktop"
    | "mobile";

const MOBILE_X_SCALE = 0.55;
const MOBILE_Y_SCALE = 1.05;

function transformPosition(
    position: Position3D,
    mode: ConstellationLayoutMode
): Position3D {
    if (mode === "desktop") {
        return position;
    }

    return [
        position[0] * MOBILE_X_SCALE,
        position[1] * MOBILE_Y_SCALE,
        position[2],
    ];
}

export function resolveNodePositions(
    nodes: ConstellationNodeData[],
    mode: ConstellationLayoutMode = "desktop"
): ConstellationNodeData[] {
    const positions = new Map<string, Position3D>();

    positions.set("matias", [0, 0, 0]);

    for (const [clusterId, cluster] of Object.entries(
        constellationLayout
    )) {
        positions.set(clusterId, cluster.center);

        for (const [nodeId, offset] of Object.entries(
            cluster.offsets
        )) {
            positions.set(
                nodeId,
                addPositions(cluster.center, offset)
            );
        }
    }

    return nodes.map((node) => {
        const originalPosition =
            positions.get(node.id) ?? node.position;

        return {
            ...node,
            position: transformPosition(
                originalPosition,
                mode
            ),
        };
    });
}