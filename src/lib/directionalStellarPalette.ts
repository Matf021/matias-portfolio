
import * as THREE from "three";

import type {
    ConstellationNodeData,
    DisciplineId,
    Position3D,
} from "@/types/constellation";

export type DirectionalColorSource = {
    disciplineId: DisciplineId;
    color: string;
    direction: Position3D;
};

export type DirectionalStellarPalette = {
    sources: DirectionalColorSource[];
};

/**
 * Calculates the directions from a project
 * toward its associated discipline stars.
 *
 * Positions must already be resolved by
 * resolveNodePositions().
 */
export function getDirectionalStellarPalette(
    node: ConstellationNodeData,
    nodes: ConstellationNodeData[]
): DirectionalStellarPalette | null {
    if (node.category !== "project") {
        return null;
    }

    const disciplineIds = [
        ...new Set(node.disciplines ?? []),
    ];

    if (disciplineIds.length < 2) {
        return null;
    }

    const origin = new THREE.Vector3(
        ...node.position
    );

    const sources: DirectionalColorSource[] = [];

    for (const disciplineId of disciplineIds) {
        const discipline = nodes.find(
            (candidate) =>
                candidate.id === disciplineId &&
                candidate.category === "discipline"
        );

        if (!discipline) continue;

        const direction = new THREE.Vector3(
            ...discipline.position
        ).sub(origin);

        // Ignore coincident positions.
        if (direction.lengthSq() < 0.000001) {
            continue;
        }

        direction.normalize();

        sources.push({
            disciplineId,
            color: discipline.color,
            direction: [
                direction.x,
                direction.y,
                direction.z,
            ],
        });
    }

    if (sources.length < 2) {
        return null;
    }

    return { sources };
}
