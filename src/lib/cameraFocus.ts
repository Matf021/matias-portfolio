
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
    currentTarget: THREE.Vector3,
    camera: THREE.PerspectiveCamera,
    framingPositions: Position3D[] = [node.position],
    padding = 1.25
): CameraDestination {
    const target = new THREE.Vector3(...node.position);

    // Preserve the current viewing direction.
    const viewingDirection = currentCameraPosition
        .clone()
        .sub(currentTarget);

    if (viewingDirection.lengthSq() < 0.000001) {
        viewingDirection.set(0, 0, 1);
    }

    viewingDirection.normalize();

    // Camera axes based on its current orientation.
    const right = new THREE.Vector3()
        .crossVectors(
            camera.up,
            viewingDirection
        )
        .normalize();

    if (right.lengthSq() < 0.000001) {
        right.set(1, 0, 0);
    }

    const up = new THREE.Vector3()
        .crossVectors(
            viewingDirection,
            right
        )
        .normalize();

    const verticalFov =
        THREE.MathUtils.degToRad(camera.fov);

    const tanVertical =
        Math.tan(verticalFov / 2);

    const tanHorizontal =
        tanVertical * camera.aspect;

    let requiredDistance = 0;

    for (const position of framingPositions) {
        const relative = new THREE.Vector3(...position)
            .sub(target);

        const horizontal = Math.abs(
            relative.dot(right)
        );

        const vertical = Math.abs(
            relative.dot(up)
        );

        const depth = relative.dot(viewingDirection);

        const horizontalDistance =
            horizontal / tanHorizontal + depth;

        const verticalDistance =
            vertical / tanVertical + depth;

        requiredDistance = Math.max(
            requiredDistance,
            horizontalDistance,
            verticalDistance
        );
    }

    const baseDistance = focusDistances[node.category];

    const distance = Math.max(
        baseDistance,
        requiredDistance * padding
    );

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
