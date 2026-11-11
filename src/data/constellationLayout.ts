
import type { Position3D } from "@/types/constellation";

import type {
    DisciplineId,
} from "@/types/constellation";

export type ClusterId = DisciplineId;
type ClusterLayout = {
    center: Position3D;
    offsets: Record<string, Position3D>;
};

export const constellationLayout: Record<
    ClusterId,
    ClusterLayout
> = {
    ai: {
        center: [-2.4, 2.2, 0.4],
        offsets: {
            manatee: [-1.3, -0.9, 0.5],
            ml: [-1.4, 1.1, -0.4],
            flask: [-2.1, -0.2, -0.5],
            python: [0.4, -1.5, 1],
        },
    },

    cloud: {
        center: [4.5, 3.6, -1.0],
        offsets: {
            "voice-notes": [-1.5, -1.3, 1.1],
            aws: [1.4, 1.1, -0.4],
            chalice: [2.1, -0.2, -0.5],
            nlp: [-0.4, -1.5, 1],
        },
    },

    creative: {
        center: [-5.2, -4.2, -0.8],
        offsets: {
            pipboy: [-1.3, -0.9, 0.5],
            rainmeter: [-1.5, -1.9, -0.4],
            lua: [-2.1, 0.2, -0.5],
        },
    },

    software: {
        center: [2.7, -1.0, 0.6],
        offsets: {
            hospitality: [1.3, -0.9, 0.5],
            sql: [2.1, -0.2, -0.5],
            oracle: [1.5, -1.9, -0.4],
            docker: [-0.5, -1.8, 0.8],
            typescript: [-1.5, -0.5, 0.7],
        },
    },
};


/**
 * Nodes that occupy independent positions because
 * they connect multiple discipline clusters.
 *
 * These coordinates are absolute world positions,
 * not offsets from a discipline center.
 */
export const bridgePositions: Record<string, Position3D> = {
    react: [-0.7, -2.2, 1.5],
    portfolio: [-2.0, -4.0, 0.9],
};


export function addPositions(
    a: Position3D,
    b: Position3D
): Position3D {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
    ];
}
