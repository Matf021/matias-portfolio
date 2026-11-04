
import * as THREE from "three";

import type {
    ConstellationNodeData,
    Position3D,
} from "@/types/constellation";

const MAX_NEIGHBOR_DISTANCE = {
    project: 4.5,
    technology: 4,
} as const;

/**
 * Returns positions to consider when framing
 * a selected node.
 *
 * Identity and discipline nodes include all
 * directly connected nodes.
 *
 * Project and technology nodes prioritize
 * nearby connections.
 */
export function getSelectionFramingPositions(
    selectedId: string,
    nodes: ConstellationNodeData[],
    connectedIds: Set<string>
): Position3D[] {
    const selectedNode = nodes.find(
        (node) => node.id === selectedId
    );

    if (!selectedNode) return [];

    const selectedPosition = new THREE.Vector3(
        ...selectedNode.position
    );

    const maxDistance =
        selectedNode.category === "project" ||
        selectedNode.category === "technology"
            ? MAX_NEIGHBOR_DISTANCE[
                  selectedNode.category
              ]
            : Infinity;

    return nodes
        .filter((node) => {
            if (node.id === selectedId) {
                return true;
            }

            if (!connectedIds.has(node.id)) {
                return false;
            }

            const distance = selectedPosition.distanceTo(
                new THREE.Vector3(...node.position)
            );

            return distance <= maxDistance;
        })
        .map((node) => node.position);
}
