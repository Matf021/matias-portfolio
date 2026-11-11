
import type {
    ConstellationNodeData,
} from "@/types/constellation";

const LABEL_GAP = {
    identity: 0.30,
    discipline: 0.23,
    project: 0.23,
    technology: 0.23,
} as const;

export function getStellarVisualScale(
    selected: boolean,
    hovered: boolean
): number {
    if (selected) return 1.5;
    if (hovered) return 1.18;

    return 1;
}

export function getStellarLabelOffset(
    node: ConstellationNodeData,
    visualScale: number
): number {
    return -(
        node.size * visualScale +
        LABEL_GAP[node.category]
    );
}


export function getCameraAwareLabelOffset(
    node: ConstellationNodeData,
    visualScale: number,
    worldUnitsPerPixel: number
): number {
    const naturalGap = LABEL_GAP[node.category];

    const maxGapPx = {
        identity: 24,
        discipline: 21,
        project: 18,
        technology: 16,
    }[node.category];

    const adjustedGap = Math.min(
        naturalGap,
        maxGapPx * worldUnitsPerPixel
    );

    return -(
        node.size * visualScale +
        adjustedGap
    );
}
