
import type {
  ConstellationNodeData,
  Position3D,
} from "@/types/constellation";

export type CameraDestination = {
  position: Position3D;
  target: Position3D;
};

const focusDistances: Record<
  ConstellationNodeData["category"],
  number
> = {
  identity: 12,
  discipline: 8,
  project: 5.5,
  technology: 4.5,
};

export function calculateFocusDestination(
  node: ConstellationNodeData
): CameraDestination {
  const [x, y, z] = node.position;

  const distance = focusDistances[node.category];

  return {
    target: [x, y, z],
    position: [
      x,
      y + distance * 0.12,
      z + distance,
    ],
  };
}
