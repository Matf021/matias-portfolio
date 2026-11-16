
import * as THREE from "three";

import type {
    ConstellationNodeData,
    Position3D,
} from "@/types/constellation";

type Category = ConstellationNodeData["category"];

const MAX_NEIGHBOR_DISTANCE: Record<Category, number> = {
    identity: 5.5,
    discipline: 4.5,
    project: 4.5,
    technology: 4,
};

// Limit how many neighboring stars influence zoom.
// These are framing limits, not graph visibility limits.
const MAX_SUPPORTING_NODES: Record<Category, number> = {
    identity: 0,
    discipline: 4,
    project: 5,
    technology: 5,
};

// The preferred supporting-node type depends on
// what the visitor is currently exploring.
const CATEGORY_PRIORITY: Record<
    Category,
    Partial<Record<Category, number>>
> = {
    identity: {},
    discipline: {
        project: 0,
        technology: 1,
        discipline: 2,
        identity: 3,
    },
    project: {
        technology: 0,
        discipline: 1,
        project: 2,
        identity: 3,
    },
    technology: {
        project: 0,
        discipline: 1,
        technology: 2,
        identity: 3,
    },
};

/**
 * Selects supporting nodes for camera framing.
 *
 * The full graph remains unchanged.
 * Only directly connected, nearby nodes can
 * influence the selected camera composition.
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

    // Identity is the visual anchor of the entire
    // constellation. Its camera shot is intentionally
    // composed around the central star.
    if (selectedNode.category === "identity") {
        return [selectedNode.position];
    }

    const selectedPosition = new THREE.Vector3(
        ...selectedNode.position
    );

    const maxDistance =
        MAX_NEIGHBOR_DISTANCE[selectedNode.category];

    const priority =
        CATEGORY_PRIORITY[selectedNode.category];

    const candidates = nodes
        .filter(
            (node) =>
                node.id !== selectedId &&
                connectedIds.has(node.id) &&
                !(
                    selectedNode.category === "discipline" &&
                    node.category === "identity"
                )
        )
        .map((node) => {
            const distance = selectedPosition.distanceTo(
                new THREE.Vector3(...node.position)
            );

            return {
                node,
                distance,
                priority: priority[node.category] ?? 99,
            };
        })
        .filter(
            (candidate) =>
                candidate.distance <= maxDistance
        );

    // Select important relationships first.
    // Use distance only to break ties, keeping
    // the final result deterministic.
    candidates.sort(
        (a, b) =>
            a.priority - b.priority ||
            a.distance - b.distance ||
            a.node.id.localeCompare(b.node.id)
    );

    const supportingPositions = candidates
        .slice(
            0,
            MAX_SUPPORTING_NODES[selectedNode.category]
        )
        .map(({ node }) => node.position);

    return [
        selectedNode.position,
        ...supportingPositions,
    ];
}
