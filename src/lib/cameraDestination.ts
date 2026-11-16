
import * as THREE from "three";

import { calculateFocusDestination } from "@/lib/cameraFocus";
import { composeSelectedCamera } from "@/lib/cameraScreenComposition";
import { applyCameraSafeArea } from "@/lib/cameraComposition";

import type { ScreenRect } from "@/types/camera";
import type {
    CameraDestination,
} from "@/lib/cameraFocus";
import type {
    ConstellationNodeData,
    Position3D,
} from "@/types/constellation";

type ViewportSize = {
    width: number;
    height: number;
};

type SelectedCameraOptions = {
    node: ConstellationNodeData;
    camera: THREE.PerspectiveCamera;
    viewport: ViewportSize;
    panelRect: ScreenRect | null;
    framingPositions: Position3D[];
};

/**
 * Single entry point for calculating selected-node
 * camera destinations.
 *
 * This first version preserves the existing behavior.
 * Subsequent improvements will happen here without
 * changing the cinematic flight controller.
 */
export function calculateSelectedCameraDestination({
    node,
    camera,
    viewport,
    panelRect,
    framingPositions,
}: SelectedCameraOptions): CameraDestination {
    const focusPositions =
        node.category === "identity"
            ? [node.position]
            : framingPositions;

    const baseDestination = calculateFocusDestination(
        node,
        camera.position,
        new THREE.Vector3(...node.position),
        camera,
        focusPositions
    );

    if (viewport.width >= 900) {
        return composeSelectedCamera(
            baseDestination,
            camera,
            viewport,
            panelRect,
            node.position,
            focusPositions
        );
    }

    return applyCameraSafeArea(
        baseDestination,
        camera,
        viewport,
        panelRect
    );
}
