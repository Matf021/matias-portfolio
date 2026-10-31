
import * as THREE from "three";

import type {
  Position3D,
} from "@/types/constellation";

export type CameraFraming = {
  target: Position3D;
  position: Position3D;
  distance: number;
};

/**
 * Calculate camera framing for a collection
 * of 3D points.
 *
 * Assumes a camera looking along the negative
 * Z axis with no rotation.
 */
export function calculateCameraFraming(
  positions: Position3D[],
  aspect: number,
  fovDegrees = 55,
  padding = 1.2
): CameraFraming {
  if (positions.length === 0) {
    return {
      target: [0, 0, 0],
      position: [0, 0, 13],
      distance: 13,
    };
  }

  const box = new THREE.Box3();

  for (const position of positions) {
    box.expandByPoint(
      new THREE.Vector3(...position)
    );
  }

  const center = box.getCenter(new THREE.Vector3());

  const halfVerticalFov = THREE.MathUtils.degToRad(
    fovDegrees / 2
  );

  const tanVertical = Math.tan(halfVerticalFov);
  const tanHorizontal = tanVertical * Math.max(aspect, 0.1);

  let requiredDistance = 0;

  for (const position of positions) {
    const [x, y, z] = position;

    const dx = Math.abs(x - center.x);
    const dy = Math.abs(y - center.y);
    const dz = z - center.z;

    const verticalDistance =
      dy / tanVertical + dz;

    const horizontalDistance =
      dx / tanHorizontal + dz;

    requiredDistance = Math.max(
      requiredDistance,
      verticalDistance,
      horizontalDistance
    );
  }

  const distance = Math.max(
    requiredDistance * padding,
    6
  );

  return {
    target: [center.x, center.y, center.z],
    position: [
      center.x,
      center.y,
      center.z + distance,
    ],
    distance,
  };
}
