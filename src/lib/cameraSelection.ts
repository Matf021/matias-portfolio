
import * as THREE from "three";

import type {
    ConstellationNodeData,
    Position3D,
} from "@/types/constellation";

const MAX_NEIGHBOR_DISTANCE: Record<
    ConstellationNodeData["category"],
    number
> = {
    identity: 5.5,
    discipline: 4.5,
    project: 4.5,
    technology: 4,
};

/**
 * Returns positions used to frame a selected node.
 *
 * Nearby connected nodes influence camera distance.
 * Distant connections remain part of the graph,
 * but do not force the camera to zoom out.
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
        MAX_NEIGHBOR_DISTANCE[selectedNode.category];

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
