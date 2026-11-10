export type NodeCategory =
    | "identity"
    | "discipline"
    | "project"
    | "technology";

import type {
    DisciplineId,
} from "@/data/disciplines";

export type { DisciplineId };

export type Position3D = [number, number, number];

export interface ConstellationNodeData {
    id: string;
    label: string;
    category: NodeCategory;
    position: Position3D;
    color: string;
    size: number;
    description?: string;
    stellarColorMode?: "organic" | "directional";

    disciplines?: DisciplineId[];
}

export interface ConstellationEdge {
    source: string;
    target: string;
}
