export function phaseProgress(
    progress: number,
    start: number,
    end: number
): number {
    if (end <= start) {
        return progress >= end ? 1 : 0;
    }

    return Math.max(
        0,
        Math.min(1, (progress - start) / (end - start))
    );
}