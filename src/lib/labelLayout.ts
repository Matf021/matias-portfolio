
import type {
    ConstellationNodeData,
} from "@/types/constellation";

const MOBILE_BREAKPOINT = 640;
const MOBILE_TITLE_LENGTH = 22;

export function getLabelLines(
    node: ConstellationNodeData,
    viewportWidth: number
): string[] {
    if (
        viewportWidth >= MOBILE_BREAKPOINT ||
        node.category !== "project" ||
        node.label.length <= MOBILE_TITLE_LENGTH
    ) {
        return [node.label];
    }

    const words = node.label.split(/\s+/);

    if (words.length < 2) {
        return [node.label];
    }

    let bestSplit = 1;
    let smallestDifference = Infinity;

    for (let i = 1; i < words.length; i++) {
        const firstLine = words.slice(0, i).join(" ");
        const secondLine = words.slice(i).join(" ");

        const difference = Math.abs(
            firstLine.length - secondLine.length
        );

        if (difference < smallestDifference) {
            smallestDifference = difference;
            bestSplit = i;
        }
    }

    return [
        words.slice(0, bestSplit).join(" "),
        words.slice(bestSplit).join(" "),
    ];
}
