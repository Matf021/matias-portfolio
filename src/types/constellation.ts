import type { DisciplineId } from "@/data/disciplines";

export type { DisciplineId };
export type NodeCategory = "identity" | "discipline" | "project" | "technology";
export type Position3D = [number, number, number];

export interface ConstellationNodeDefinition {
    id: string;
    label: string;
    category: NodeCategory;
    color: string;
    size: number;
    description?: string;
    stellarColorMode?: "organic" | "directional";
    disciplines?: DisciplineId[];
}

export interface ConstellationNodeData extends ConstellationNodeDefinition {
    position: Position3D;
}

export interface ConstellationEdge {
    source: string;
    target: string;
    description?: string;
}
