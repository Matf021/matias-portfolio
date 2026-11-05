
export type LabelRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type LabelCandidate = {
    id: string;
    rect: LabelRect;
    priority: number;
};

export function rectanglesOverlap(
    a: LabelRect,
    b: LabelRect,
    padding = 6
): boolean {
    return (
        a.x < b.x + b.width + padding &&
        a.x + a.width + padding > b.x &&
        a.y < b.y + b.height + padding &&
        a.y + a.height + padding > b.y
    );
}


export type CollisionOptions = {
    previousHidden?: ReadonlySet<string>;
    hidePadding?: number;
    revealPadding?: number;
};

export function resolveLabelCollisions(
    candidates: LabelCandidate[],
    options: CollisionOptions = {}
): Set<string> {
    const {
        previousHidden = new Set<string>(),
        hidePadding = 4,
        revealPadding = 12,
    } = options;

    const sorted = [...candidates].sort(
        (a, b) =>
            b.priority - a.priority ||
            a.id.localeCompare(b.id)
    );

    const accepted: LabelCandidate[] = [];
    const hidden = new Set<string>();

    for (const candidate of sorted) {
        const wasHidden = previousHidden.has(candidate.id);

        const padding = wasHidden
            ? revealPadding
            : hidePadding;

        const overlaps = accepted.some((other) =>
            rectanglesOverlap(
                candidate.rect,
                other.rect,
                padding
            )
        );

        if (overlaps) {
            hidden.add(candidate.id);
        } else {
            accepted.push(candidate);
        }
    }

    return hidden;
}


export function getLabelPriority(
    category: string,
    selected: boolean,
    hovered: boolean,
    connected: boolean,
    hasSelection: boolean
): number {
    if (selected) return 100;
    if (hovered) return 90;
    if (hasSelection && connected) return 70;

    if (hasSelection) return 0;

    switch (category) {
        case "identity":
            return 60;
        case "discipline":
            return 50;
        case "project":
            return 30;
        case "technology":
            return 10;
        default:
            return 0;
    }
}