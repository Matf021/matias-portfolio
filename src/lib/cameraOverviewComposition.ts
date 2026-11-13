import * as THREE from "three";
import type { CameraDestination } from "@/lib/cameraFocus";

type ViewportSize = {
    width: number;
    height: number;
};

export function applyExplorerOverviewComposition(
    destination: CameraDestination,
    camera: THREE.PerspectiveCamera,
    viewport: ViewportSize,
    explorerOpen: boolean
): CameraDestination {
    if (!explorerOpen || viewport.width < 900) {
        return destination;
    }

    const position = new THREE.Vector3(...destination.position);
    const target = new THREE.Vector3(...destination.target);

    const direction = position.clone().sub(target).normalize();

    const right = new THREE.Vector3()
        .crossVectors(camera.up, direction)
        .normalize();

    if (right.lengthSq() < 0.000001) {
        return destination;
    }

    const distance = position.distanceTo(target);

    const visibleWidth =
        2 *
        distance *
        Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
        camera.aspect;

    // Explorer is currently capped at 17rem and
    // positioned 1rem from the left viewport edge.
    const explorerWidth = Math.min(
        viewport.width * 0.86,
        272
    );

    const occupiedWidth = explorerWidth + 16 + 24;

    // Shift the constellation's visual center right,
    // but avoid overcorrecting.
    const shiftRatio = Math.min(
        occupiedWidth / (2 * viewport.width),
        0.12
    );

    const offset = right.multiplyScalar(
        -visibleWidth * shiftRatio
    );

    position.add(offset);
    target.add(offset);

    return {
        position: position.toArray() as [number, number, number],
        target: target.toArray() as [number, number, number],
    };
}