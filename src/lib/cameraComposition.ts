
import * as THREE from "three";

import type { ScreenRect } from "@/types/camera";
import type { CameraDestination } from "@/lib/cameraFocus";

type ViewportSize = {
    width: number;
    height: number;
};

/**
 * Shift the camera framing away from an
 * obstructing interface panel.
 *
 * Preserves the camera's viewing direction.
 */
export function applyCameraSafeArea(
    destination: CameraDestination,
    camera: THREE.PerspectiveCamera,
    viewport: ViewportSize,
    panelRect: ScreenRect | null
): CameraDestination {
    if (!panelRect) return destination;

    const { width, height } = viewport;

    if (width <= 0 || height <= 0) {
        return destination;
    }

    const target = new THREE.Vector3(
        ...destination.target
    );

    const position = new THREE.Vector3(
        ...destination.position
    );

    const direction = position
        .clone()
        .sub(target)
        .normalize();

    const right = new THREE.Vector3()
        .crossVectors(camera.up, direction)
        .normalize();

    if (right.lengthSq() < 0.000001) {
        right.set(1, 0, 0);
    }

    const up = new THREE.Vector3()
        .crossVectors(direction, right)
        .normalize();

    const distance = position.distanceTo(target);

    const verticalFov =
        THREE.MathUtils.degToRad(camera.fov);

    const visibleHeight =
        2 * distance * Math.tan(verticalFov / 2);

    const visibleWidth =
        visibleHeight * camera.aspect;

    // Panel bounds in normalized screen coordinates.
    const panelRight =
        (panelRect.x + panelRect.width) / width;

    const panelTop =
        panelRect.y / height;

    // Only adjust when the panel reaches into
    // the central composition region.
    const horizontalOverlap =
        Math.max(0, panelRight - 0.35);

    const verticalOverlap =
        Math.max(0, 0.65 - panelTop);

    if (
        horizontalOverlap === 0 ||
        verticalOverlap === 0
    ) {
        return destination;
    }

    // Keep the adjustment subtle.
    const offsetX =
        Math.min(horizontalOverlap, 0.15) *
        visibleWidth;

    const offsetY =
        Math.min(verticalOverlap, 0.12) *
        visibleHeight;

    const offset = right
        .multiplyScalar(-offsetX)
        .addScaledVector(up, -offsetY);

    position.add(offset);
    target.add(offset);

    return {
        position: [
            position.x,
            position.y,
            position.z,
        ],
        target: [
            target.x,
            target.y,
            target.z,
        ],
    };
}
