import { constellationNodes } from "@/data/constellation";

const disciplineColors = new Map(
    constellationNodes
        .filter((node) => node.category === "discipline")
        .map((node) => [node.id, node.color])
);

export function getNodeAccent(
    color: string,
    disciplines?: string[],
    useMultipleColors = false
): string {
    if (!useMultipleColors || !disciplines?.length) {
        return color;
    }

    const colors = [
        ...new Set(
            disciplines
                .map((id) => disciplineColors.get(id))
                .filter((value): value is string => Boolean(value))
        ),
    ];

    if (colors.length < 2) {
        return color;
    }

    return `linear-gradient(90deg, ${colors.join(", ")})`;
}