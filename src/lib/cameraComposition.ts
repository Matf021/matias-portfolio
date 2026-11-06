
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

    const panelWidthRatio =
        panelRect.width / width;

    // Identify a bottom sheet by its geometry,
    // rather than relying on the browser width alone.
    const isBottomSheet = panelWidthRatio >= 0.9;

    let offsetX = 0;
    let offsetY = 0;

    if (isBottomSheet) {
        // The sheet occupies the lower portion of
        // the canvas, so shift the focus upward.
        const sheetHeightRatio =
            Math.max(0, 1 - panelTop);

        // Position the focus around the center of
        // the unobstructed region.
        const upwardShift =
            Math.min(sheetHeightRatio * 0.5, 0.3);

        offsetY = -upwardShift * visibleHeight;
    } else {
        // Preserve the existing desktop behavior.
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

        offsetX =
            Math.min(horizontalOverlap, 0.15) *
            visibleWidth;

        offsetY =
            Math.min(verticalOverlap, 0.12) *
            visibleHeight;
    }

    const offset = right
        .multiplyScalar(-offsetX)
        .addScaledVector(up, offsetY);

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
