
import type { ScreenRect } from "@/types/camera";
import type { LabelRect } from "@/lib/labelCollision";

const SCREEN_MARGIN = 16;
const PANEL_MARGIN = 20;
const MAX_SHIFT_PX = 20;

export function getLabelSafeShiftX(
    label: LabelRect,
    panel: ScreenRect | null,
    viewportWidth: number
): number {
    const labelCenter = label.x + label.width / 2;

    const minCenter =
        SCREEN_MARGIN + label.width / 2;

    const maxCenter =
        viewportWidth -
        SCREEN_MARGIN -
        label.width / 2;

    if (minCenter > maxCenter) {
        return 0;
    }

    let targetCenter = Math.max(
        minCenter,
        Math.min(maxCenter, labelCenter)
    );

    if (panel) {
        const verticalOverlap =
            label.y < panel.y + panel.height &&
            label.y + label.height > panel.y;

        const horizontalOverlap =
            targetCenter + label.width / 2 >
                panel.x - PANEL_MARGIN &&
            targetCenter - label.width / 2 <
                panel.x + panel.width + PANEL_MARGIN;

        if (verticalOverlap && horizontalOverlap) {
            const leftCenter =
                panel.x -
                PANEL_MARGIN -
                label.width / 2;

            const rightCenter =
                panel.x +
                panel.width +
                PANEL_MARGIN +
                label.width / 2;

            const candidates = [
                leftCenter,
                rightCenter,
            ].filter(
                (center) =>
                    center >= minCenter &&
                    center <= maxCenter
            );

            if (candidates.length > 0) {
                targetCenter = candidates.reduce(
                    (best, current) =>
                        Math.abs(current - labelCenter) <
                        Math.abs(best - labelCenter)
                            ? current
                            : best
                );
            }
        }
    }

    return Math.max(
        -MAX_SHIFT_PX,
        Math.min(
            MAX_SHIFT_PX,
            targetCenter - labelCenter
        )
    );
}
