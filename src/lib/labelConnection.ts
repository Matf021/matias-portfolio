
import * as THREE from "three";

import type { LabelRect } from "@/lib/labelCollision";
import type {
    ConstellationEdge,
    ConstellationNodeData,
} from "@/types/constellation";

export type ScreenSegment = {
    sourceId: string;
    targetId: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

function projectPoint(
    position: [number, number, number],
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number
): { x: number; y: number } | null {
    const point = new THREE.Vector3(...position);
    point.project(camera);

    if (point.z < -1 || point.z > 1) {
        return null;
    }

    return {
        x: (point.x * 0.5 + 0.5) * width,
        y: (-point.y * 0.5 + 0.5) * height,
    };
}

export function projectConnections(
    nodes: ConstellationNodeData[],
    edges: ConstellationEdge[],
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number
): ScreenSegment[] {
    const nodeMap = new Map(
        nodes.map((node) => [node.id, node])
    );

    const segments: ScreenSegment[] = [];

    for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);

        if (!source || !target) continue;

        const start = projectPoint(
            source.position,
            camera,
            width,
            height
        );

        const end = projectPoint(
            target.position,
            camera,
            width,
            height
        );

        if (!start || !end) continue;

        // Match the approximate fade regions used by
        // ConstellationConnection's line shader.
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        const screenLength = Math.hypot(dx, dy);
        const worldLength = Math.hypot(
            target.position[0] - source.position[0],
            target.position[1] - source.position[1],
            target.position[2] - source.position[2]
        );

        if (screenLength < 1 || worldLength < 0.001) {
            continue;
        }

        const startFadeWorld = source.size * 2.0;
        const endFadeWorld = target.size * 2.0;

        // Trim a conservative portion of the fade.
        // We don't trim the entire fade because the
        // line can still be visible inside that region.
        const trimFactor = 0.65;

        const startFraction =
            (startFadeWorld / worldLength) * trimFactor;

        const endFraction =
            (endFadeWorld / worldLength) * trimFactor;

        if (startFraction + endFraction >= 1) {
            continue;
        }

        segments.push({
            sourceId: edge.source,
            targetId: edge.target,
            x1: start.x + dx * startFraction,
            y1: start.y + dy * startFraction,
            x2: end.x - dx * endFraction,
            y2: end.y - dy * endFraction,
        });
    }

    return segments;
}

function intersectsRect(
    segment: ScreenSegment,
    rect: LabelRect
): boolean {
    const left = rect.x;
    const right = rect.x + rect.width;
    const top = rect.y;
    const bottom = rect.y + rect.height;

    // Liang-Barsky line clipping.
    const dx = segment.x2 - segment.x1;
    const dy = segment.y2 - segment.y1;

    const p = [-dx, dx, -dy, dy];
    const q = [
        segment.x1 - left,
        right - segment.x1,
        segment.y1 - top,
        bottom - segment.y1,
    ];

    let t0 = 0;
    let t1 = 1;

    for (let i = 0; i < 4; i++) {
        if (Math.abs(p[i]) < 1e-8) {
            if (q[i] < 0) return false;
            continue;
        }

        const t = q[i] / p[i];

        if (p[i] < 0) {
            t0 = Math.max(t0, t);
        } else {
            t1 = Math.min(t1, t);
        }

        if (t0 > t1) return false;
    }

    return true;
}

export function getConnectionAvoidanceOffset(
    nodeId: string,
    rect: LabelRect,
    segments: ScreenSegment[],
    maxOffsetPx = 16,
    stepPx = 4
): number {
    const relevantSegments = segments.filter(
        (segment) =>
            segment.sourceId !== nodeId &&
            segment.targetId !== nodeId
    );

    const hasCollision = (offset: number) => {
        const shiftedRect = {
            ...rect,
            y: rect.y + offset,
        };

        return relevantSegments.some((segment) =>
            intersectsRect(segment, shiftedRect)
        );
    };

    if (!hasCollision(0)) return 0;

    for (
        let offset = stepPx;
        offset <= maxOffsetPx;
        offset += stepPx
    ) {
        if (!hasCollision(offset)) return offset;
    }

    return 0;
}