
import * as THREE from "three";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

import type {
    LabelRect,
} from "@/lib/labelCollision";

import {
    getCameraAwareLabelOffset,
} from "@/lib/stellarLabel";

const LABEL_FONT_SIZE = {
    identity: 0.24,
    discipline: 0.2,
    project: 0.17,
    technology: 0.15,
} as const;

const CHARACTER_WIDTH_FACTOR = 0.55;
const COLLISION_PADDING_PX = 8;

export function getLabelFontSize(
    node: ConstellationNodeData
): number {
    return LABEL_FONT_SIZE[node.category];
}


const MAX_LABEL_HEIGHT_PX = {
    identity: 26,
    discipline: 23,
    project: 22,
    technology: 19,
} as const;

export function getLabelScreenScale(
    node: ConstellationNodeData,
    depth: number,
    camera: THREE.PerspectiveCamera,
    viewportHeight: number,
    emphasisScale = 1
): number {
    if (depth <= 0 || viewportHeight <= 0) {
        return 1;
    }

    const verticalFov = THREE.MathUtils.degToRad(
        camera.fov
    );

    const pixelsPerWorldUnit =
        viewportHeight /
        (
            2 *
            depth *
            Math.tan(verticalFov / 2)
        );

    const naturalHeightPx =
        getLabelFontSize(node) *
        emphasisScale *
        pixelsPerWorldUnit;

    return Math.min(
        1,
        MAX_LABEL_HEIGHT_PX[node.category] /
        Math.max(naturalHeightPx, 0.001)
    );
}


export function projectLabelBounds(
    node: ConstellationNodeData,
    camera: THREE.PerspectiveCamera,
    viewportWidth: number,
    viewportHeight: number,
    scale = 1,
    visualScale = 1
): LabelRect | null {
    const worldPosition = new THREE.Vector3(
        ...node.position
    );

    // Convert the node's position into camera space.
    const cameraSpace = worldPosition
        .clone()
        .applyMatrix4(camera.matrixWorldInverse);

    const depth = -cameraSpace.z;

    if (
        depth <= camera.near ||
        depth >= camera.far ||
        viewportHeight <= 0
    ) {
        return null;
    }

    // Calculate perspective conversion factors.
    const verticalFov =
        THREE.MathUtils.degToRad(camera.fov);

    const worldUnitsPerPixel =
        (
            2 *
            depth *
            Math.tan(verticalFov / 2)
        ) /
        viewportHeight;

    const pixelsPerWorldUnit =
        1 / worldUnitsPerPixel;

    // Position the label beneath the star,
    // limiting the screen-space gap.
    cameraSpace.y += getCameraAwareLabelOffset(
        node,
        visualScale,
        worldUnitsPerPixel
    );

    // Project the label into screen space.
    const projected = cameraSpace
        .clone()
        .applyMatrix4(camera.projectionMatrix);

    if (
        projected.z < -1 ||
        projected.z > 1
    ) {
        return null;
    }

    // Apply the same font-size limit
    // used by the rendered label.
    const screenScale = getLabelScreenScale(
        node,
        depth,
        camera,
        viewportHeight,
        scale
    );

    const fontSize =
        getLabelFontSize(node) *
        scale *
        screenScale;

    // Estimate the label's screen-space dimensions.
    const estimatedWorldWidth =
        node.label.length *
        fontSize *
        CHARACTER_WIDTH_FACTOR;

    const estimatedWorldHeight = fontSize;

    const width =
        estimatedWorldWidth *
        pixelsPerWorldUnit +
        COLLISION_PADDING_PX;

    const height =
        estimatedWorldHeight *
        pixelsPerWorldUnit +
        COLLISION_PADDING_PX;

    const x =
        (projected.x * 0.5 + 0.5) *
        viewportWidth;

    const y =
        (-projected.y * 0.5 + 0.5) *
        viewportHeight;

    return {
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
    };
}
