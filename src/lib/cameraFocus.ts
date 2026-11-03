
import * as THREE from "three";

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
  node: ConstellationNodeData,
  currentCameraPosition: THREE.Vector3,
  currentTarget: THREE.Vector3
): CameraDestination {
  const target = new THREE.Vector3(...node.position);

  // Preserve the visitor's current viewing direction.
  const viewingDirection = currentCameraPosition
    .clone()
    .sub(currentTarget);

  // Fallback if camera and target overlap.
  if (viewingDirection.lengthSq() < 0.000001) {
    viewingDirection.set(0, 0, 1);
  }

  viewingDirection.normalize();

  const distance = focusDistances[node.category];

  const destination = target
    .clone()
    .addScaledVector(viewingDirection, distance);

  return {
    target: [target.x, target.y, target.z],
    position: [
      destination.x,
      destination.y,
      destination.z,
    ],
  };
}
