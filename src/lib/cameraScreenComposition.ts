
import * as THREE from "three";

import type { CameraDestination } from "@/lib/cameraFocus";
import type { ScreenRect } from "@/types/camera";
import type { Position3D } from "@/types/constellation";

type ViewportSize = {
    width: number;
    height: number;
};

type SafeRegion = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

const VIEWING_DIRECTION = new THREE.Vector3(
    0.12,
    0.08,
    1
).normalize();

const MAX_ZOOM_MULTIPLIER = 1.4;
const MAX_ITERATIONS = 5;

function getSafeRegion(
    viewport: ViewportSize,
    panelRect: ScreenRect | null
): SafeRegion {
    const { width, height } = viewport;

    const margin = Math.max(
        24,
        Math.min(width, height) * 0.035
    );

    const region: SafeRegion = {
        left: margin,
        right: width - margin,
        top: Math.max(margin, 88),
        bottom: height - Math.max(margin, 65),
    };

    if (!panelRect) {
        return region;
    }

    const panelWidthRatio = panelRect.width / width;

    // A mobile bottom sheet needs a different
    // composition strategy.
    if (panelWidthRatio >= 0.9) {
        region.bottom = Math.min(
            region.bottom,
            panelRect.y - margin
        );

        return region;
    }

    // The information panel is on the right.
    // Reserve the space to its left.
    region.right = Math.min(
        region.right,
        panelRect.x - margin
    );

    return region;
}

function createProjectionCamera(
    camera: THREE.PerspectiveCamera,
    position: THREE.Vector3,
    target: THREE.Vector3
): THREE.PerspectiveCamera {
    const projectionCamera = camera.clone();

    projectionCamera.position.copy(position);
    projectionCamera.up.copy(camera.up);
    projectionCamera.lookAt(target);
    projectionCamera.updateMatrixWorld(true);
    projectionCamera.updateProjectionMatrix();

    return projectionCamera;
}

function projectToScreen(
    position: Position3D,
    camera: THREE.PerspectiveCamera,
    viewport: ViewportSize
) {
    const point = new THREE.Vector3(...position);
    point.project(camera);

    return {
        x: (point.x + 1) * viewport.width / 2,
        y: (1 - point.y) * viewport.height / 2,
    };
}

/**
 * Composes a selected node inside the visible
 * region of the screen.
 *
 * The selected node has priority. Nearby connected
 * nodes influence zoom, but only up to a modest limit.
 */
export function composeSelectedCamera(
    destination: CameraDestination,
    camera: THREE.PerspectiveCamera,
    viewport: ViewportSize,
    panelRect: ScreenRect | null,
    selectedPosition: Position3D,
    framingPositions: Position3D[]
): CameraDestination {
    if (
        viewport.width <= 0 ||
        viewport.height <= 0
    ) {
        return destination;
    }

    const region = getSafeRegion(viewport, panelRect);

    const regionWidth = region.right - region.left;
    const regionHeight = region.bottom - region.top;

    // Fall back if the available area is extremely small.
    if (regionWidth < 100 || regionHeight < 100) {
        return destination;
    }

    const desiredCenter = {
        x: (region.left + region.right) / 2,
        y: (region.top + region.bottom) / 2,
    };

    const selected = new THREE.Vector3(...selectedPosition);
    const baseTarget = new THREE.Vector3(...destination.target);

    const initialDistance = new THREE.Vector3(
        ...destination.position
    ).distanceTo(baseTarget);

    const maxDistance =
        initialDistance * MAX_ZOOM_MULTIPLIER;

    const right = new THREE.Vector3()
        .crossVectors(camera.up, VIEWING_DIRECTION)
        .normalize();

    const up = new THREE.Vector3()
        .crossVectors(VIEWING_DIRECTION, right)
        .normalize();

    const tanHalfVertical = Math.tan(
        THREE.MathUtils.degToRad(camera.fov) / 2
    );

    let distance = initialDistance;
    let position = new THREE.Vector3();
    let target = selected.clone();

    const points = framingPositions.length > 0
        ? framingPositions
        : [selectedPosition];

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
        target = selected.clone();

        position = target.clone().addScaledVector(
            VIEWING_DIRECTION,
            distance
        );

        let projectionCamera = createProjectionCamera(
            camera,
            position,
            target
        );

        // First place the selected star at the center
        // of the unobstructed viewing region.
        const selectedScreen = projectToScreen(
            selectedPosition,
            projectionCamera,
            viewport
        );

        const visibleHeight =
            2 * distance * tanHalfVertical;

        const visibleWidth =
            visibleHeight * camera.aspect;

        const horizontalShift =
            (selectedScreen.x - desiredCenter.x) *
            visibleWidth / viewport.width;

        const verticalShift =
            (desiredCenter.y - selectedScreen.y) *
            visibleHeight / viewport.height;

        const translation = right.clone()
            .multiplyScalar(horizontalShift)
            .addScaledVector(up, verticalShift);

        position.add(translation);
        target.add(translation);

        projectionCamera = createProjectionCamera(
            camera,
            position,
            target
        );

        // Allow a little breathing room around
        // nearby connected nodes and their labels.
        const innerRegion = {
            left: region.left + 20,
            right: region.right - 20,
            top: region.top + 20,
            bottom: region.bottom - 35,
        };

        let requiredScale = 1;

        for (const point of points) {
            const screen = projectToScreen(
                point,
                projectionCamera,
                viewport
            );

            const dx = Math.abs(
                screen.x - desiredCenter.x
            );

            const dy = Math.abs(
                screen.y - desiredCenter.y
            );

            const availableX = Math.max(
                1,
                Math.min(
                    desiredCenter.x - innerRegion.left,
                    innerRegion.right - desiredCenter.x
                )
            );

            const availableY = Math.max(
                1,
                Math.min(
                    desiredCenter.y - innerRegion.top,
                    innerRegion.bottom - desiredCenter.y
                )
            );

            requiredScale = Math.max(
                requiredScale,
                dx / availableX,
                dy / availableY
            );
        }

        if (requiredScale <= 1.01) {
            break;
        }

        const nextDistance = Math.min(
            maxDistance,
            distance * Math.min(requiredScale, 1.5)
        );

        if (nextDistance <= distance + 0.001) {
            break;
        }

        distance = nextDistance;
    }

    // Recalculate the final position at the final
    // distance, even if the last iteration hit its limit.
    target = selected.clone();
    position = target.clone().addScaledVector(
        VIEWING_DIRECTION,
        distance
    );

    const finalCamera = createProjectionCamera(
        camera,
        position,
        target
    );

    const finalScreen = projectToScreen(
        selectedPosition,
        finalCamera,
        viewport
    );

    const finalVisibleHeight =
        2 * distance * tanHalfVertical;

    const finalVisibleWidth =
        finalVisibleHeight * camera.aspect;

    const finalTranslation = right.clone()
        .multiplyScalar(
            (finalScreen.x - desiredCenter.x) *
            finalVisibleWidth / viewport.width
        )
        .addScaledVector(
            up,
            (desiredCenter.y - finalScreen.y) *
            finalVisibleHeight / viewport.height
        );

    position.add(finalTranslation);
    target.add(finalTranslation);

    return {
        position: position.toArray() as Position3D,
        target: target.toArray() as Position3D,
    };
}
