
import * as THREE from "three";

import type { ScreenRect } from "@/types/camera";
import type { Position3D } from "@/types/constellation";
import type { CameraDestination } from "@/lib/cameraFocus";

type ViewportSize = {
    width: number;
    height: number;
};

type Point2D = {
    x: number;
    y: number;
};

type SafeRegion = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

function getSafeRegion(
    viewport: ViewportSize,
    panelRect: ScreenRect
): SafeRegion {
    const { width, height } = viewport;
    const margin = 28;

    const safe: SafeRegion = {
        left: margin,
        right: width - margin,
        top: Math.max(88, height * 0.10),
        bottom: height - Math.max(52, height * 0.07),
    };

    const isBottomSheet =
        panelRect.width / width >= 0.9;

    if (isBottomSheet) {
        safe.bottom = Math.min(
            safe.bottom,
            panelRect.y - margin
        );
    } else {
        const panelCenter =
            panelRect.x + panelRect.width / 2;

        if (panelCenter >= width / 2) {
            safe.right = Math.min(
                safe.right,
                panelRect.x - margin
            );
        } else {
            safe.left = Math.max(
                safe.left,
                panelRect.x +
                panelRect.width +
                margin
            );
        }
    }

    return safe;
}

function projectPoints(
    worldPositions: Position3D[],
    position: THREE.Vector3,
    target: THREE.Vector3,
    camera: THREE.PerspectiveCamera,
    viewport: ViewportSize
): Point2D[] {
    const previewCamera = camera.clone();

    previewCamera.position.copy(position);
    previewCamera.lookAt(target);
    previewCamera.updateMatrixWorld(true);

    return worldPositions.map((worldPosition) => {
        const projected = new THREE.Vector3(
            ...worldPosition
        ).project(previewCamera);

        return {
            x: (projected.x * 0.5 + 0.5) *
                viewport.width,
            y: (0.5 - projected.y * 0.5) *
                viewport.height,
        };
    });
}

function getBounds(points: Point2D[]) {
    return {
        left: Math.min(...points.map((point) => point.x)),
        right: Math.max(...points.map((point) => point.x)),
        top: Math.min(...points.map((point) => point.y)),
        bottom: Math.max(...points.map((point) => point.y)),
    };
}

/**
 * Frame a selected node and its important
 * connections inside the visible screen region.
 *
 * The camera orientation remains unchanged.
 * Only distance and parallel translation change.
 */
export function applyCameraSafeArea(
    destination: CameraDestination,
    camera: THREE.PerspectiveCamera,
    viewport: ViewportSize,
    panelRect: ScreenRect | null,
    framingPositions: Position3D[] = []
): CameraDestination {
    if (
        !panelRect ||
        viewport.width <= 0 ||
        viewport.height <= 0
    ) {
        return destination;
    }

    const safe = getSafeRegion(viewport, panelRect);

    const safeWidth = safe.right - safe.left;
    const safeHeight = safe.bottom - safe.top;

    if (safeWidth < 100 || safeHeight < 100) {
        return destination;
    }

    const target = new THREE.Vector3(
        ...destination.target
    );

    const position = new THREE.Vector3(
        ...destination.position
    );

    const direction = position.clone()
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

    const worldPositions: Position3D[] = [
        destination.target,
        ...framingPositions,
    ];

    // First, evaluate the group's projected size.
    let points = projectPoints(
        worldPositions,
        position,
        target,
        camera,
        viewport
    );

    let bounds = getBounds(points);

    // Allow moderate zoom-out when nearby
    // connections need a little more room.
    // Avoid zooming out indefinitely.
    const groupWidth = bounds.right - bounds.left;
    const groupHeight = bounds.bottom - bounds.top;

    const fitFactor = Math.max(
        1,
        groupWidth / (safeWidth * 0.84),
        groupHeight / (safeHeight * 0.84)
    );

    const zoomFactor = THREE.MathUtils.clamp(
        fitFactor,
        1,
        1.4
    );

    if (zoomFactor > 1) {
        const distance = position.distanceTo(target);

        position.copy(target).addScaledVector(
            direction,
            distance * zoomFactor
        );

        points = projectPoints(
            worldPositions,
            position,
            target,
            camera,
            viewport
        );

        bounds = getBounds(points);
    }

    // The first projected point is the selected node.
    const selected = points[0];

    const groupCenter = {
        x: (bounds.left + bounds.right) / 2,
        y: (bounds.top + bounds.bottom) / 2,
    };

    const safeCenter = {
        x: (safe.left + safe.right) / 2,
        y: (safe.top + safe.bottom) / 2,
    };

    // Prioritize the selected star, while allowing
    // nearby connected nodes to influence the shot.
    // Keep the selected star as the strongest
    // visual anchor in the composition.
    const GROUP_INFLUENCE = 0.2;

    // Prevent distant nodes from excessively
    // pulling the composition away from its focus.
    const MAX_GROUP_PULL = 85;

    const anchor = {
        x: selected.x + THREE.MathUtils.clamp(
            (groupCenter.x - selected.x) *
            GROUP_INFLUENCE,
            -MAX_GROUP_PULL,
            MAX_GROUP_PULL
        ),

        y: selected.y + THREE.MathUtils.clamp(
            (groupCenter.y - selected.y) *
            GROUP_INFLUENCE,
            -MAX_GROUP_PULL,
            MAX_GROUP_PULL
        ),
    };

    // Camera movement has the opposite horizontal
    // effect on the projected objects.
    let shiftX = anchor.x - safeCenter.x;

    // Screen Y increases downward; camera up
    // movement makes objects move down on screen.
    let shiftY = safeCenter.y - anchor.y;

    // Guarantee that the selected star itself
    // remains in the usable region.
    const selectedMargin = 40;

    const minX = safe.left + selectedMargin;
    const maxX = safe.right - selectedMargin;
    const minY = safe.top + selectedMargin;
    const maxY = safe.bottom - selectedMargin;

    const projectedSelectedX = selected.x - shiftX;
    const projectedSelectedY = selected.y + shiftY;

    if (projectedSelectedX < minX) {
        shiftX -= minX - projectedSelectedX;
    } else if (projectedSelectedX > maxX) {
        shiftX += projectedSelectedX - maxX;
    }

    if (projectedSelectedY < minY) {
        shiftY += minY - projectedSelectedY;
    } else if (projectedSelectedY > maxY) {
        shiftY -= projectedSelectedY - maxY;
    }

    // Convert the pixel shift into world units
    // at the selected target's viewing distance.
    const distance = position.distanceTo(target);

    const worldHeight =
        2 * distance *
        Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

    const worldUnitsPerPixel =
        worldHeight / viewport.height;

    const offset = right
        .multiplyScalar(
            shiftX * worldUnitsPerPixel
        )
        .addScaledVector(
            up,
            shiftY * worldUnitsPerPixel
        );

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
