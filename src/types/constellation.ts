export type NodeCategory =
  | "identity"
  | "discipline"
  | "project"
  | "technology";

export type DisciplineId =
  | "ai"
  | "cloud"
  | "creative"
  | "software";

export type Position3D = [number, number, number];

export interface ConstellationNodeData {
  id: string;
  label: string;
  category: NodeCategory;
  position: Position3D;
  color: string;
  size: number;
  description?: string;

  disciplines?: DisciplineId[];
}

export interface ConstellationEdge {
  source: string;
  target: string;
}
