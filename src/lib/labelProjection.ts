
import * as THREE from "three";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

import type {
    LabelRect,
} from "@/lib/labelCollision";

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

export function projectLabelBounds(
    node: ConstellationNodeData,
    camera: THREE.PerspectiveCamera,
    viewportWidth: number,
    viewportHeight: number,
    scale = 1
): LabelRect | null {
    const worldPosition = new THREE.Vector3(
        ...node.position
    );

    worldPosition.y -= node.size + 0.23;

    // Convert the world position to camera coordinates.
    const cameraSpace = worldPosition
        .clone()
        .applyMatrix4(camera.matrixWorldInverse);

    const depth = -cameraSpace.z;

    if (depth <= camera.near || depth >= camera.far) {
        return null;
    }

    const projected = worldPosition.clone().project(camera);

    if (
        projected.z < -1 ||
        projected.z > 1
    ) {
        return null;
    }

    const verticalFov = THREE.MathUtils.degToRad(camera.fov);

    const pixelsPerWorldUnit =
        viewportHeight /
        (
            2 *
            depth *
            Math.tan(verticalFov / 2)
        );

    const fontSize = getLabelFontSize(node) * scale;

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
