import {
    constellationLayout,
    bridgePositions,
    independentPositions,
    addPositions,
} from "@/data/constellationLayout";
import type {
    ConstellationNodeDefinition,
    ConstellationNodeData,
    Position3D,
} from "@/types/constellation";

export type ConstellationLayoutMode = "desktop" | "mobile";
const MOBILE_X_SCALE = 0.55;
const MOBILE_Y_SCALE = 1.05;

function transformPosition(position: Position3D, mode: ConstellationLayoutMode): Position3D {
    if (mode === "desktop") return position;
    return [position[0] * MOBILE_X_SCALE, position[1] * MOBILE_Y_SCALE, position[2]];
}

export function resolveNodePositions(
    nodes: ConstellationNodeDefinition[],
    mode: ConstellationLayoutMode = "desktop"
): ConstellationNodeData[] {
    const positions = new Map<string, Position3D>();

    function assign(id: string, position: Position3D) {
        if (positions.has(id)) {
            throw new Error(`Duplicate constellation layout position for node: ${id}`);
        }
        positions.set(id, position);
    }

    for (const [id, position] of Object.entries(independentPositions)) {
        assign(id, position);
    }

    for (const [clusterId, cluster] of Object.entries(constellationLayout)) {
        assign(clusterId, cluster.center);
        for (const [nodeId, offset] of Object.entries(cluster.offsets)) {
            assign(nodeId, addPositions(cluster.center, offset));
        }
    }

    for (const [nodeId, position] of Object.entries(bridgePositions)) {
        assign(nodeId, position);
    }

    const nodeIds = new Set(nodes.map((node) => node.id));
    for (const id of positions.keys()) {
        if (!nodeIds.has(id)) {
            throw new Error(`Layout contains unknown constellation node: ${id}`);
        }
    }

    return nodes.map((node) => {
        const position = positions.get(node.id);
        if (!position) {
            throw new Error(`Missing constellation layout position for node: ${node.id}`);
        }
        return { ...node, position: transformPosition(position, mode) };
    });
}
