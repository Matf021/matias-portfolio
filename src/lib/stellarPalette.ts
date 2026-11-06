
import { constellationNodes } from "@/data/constellation";

import type {
    ConstellationNodeData,
    DisciplineId,
} from "@/types/constellation";

export type StellarPalette = {
    primary: string;
    secondary: string;
    tertiary: string;
    colorCount: number;
};

const DISCIPLINE_IDS: ReadonlySet<string> = new Set([
    "ai",
    "cloud",
    "creative",
    "software",
]);

function isDisciplineId(
    value: string
): value is DisciplineId {
    return DISCIPLINE_IDS.has(value);
}

const DISCIPLINE_COLORS = new Map<DisciplineId, string>(
    constellationNodes
        .filter(
            (node) =>
                node.category === "discipline" &&
                isDisciplineId(node.id)
        )
        .map((node) => [
            node.id as DisciplineId,
            node.color,
        ])
);

const MIXED_DISCIPLINE_COLORS: Partial<
    Record<DisciplineId, string>
> = {
    software: "#b5f5df",
};

export function getStellarPalette(
    node: ConstellationNodeData
): StellarPalette {
    if (node.category === "identity") {
        return {
            primary: node.color,
            secondary: node.color,
            tertiary: node.color,
            colorCount: 1,
        };
    }

    if (node.category === "discipline") {
        return {
            primary: node.color,
            secondary: node.color,
            tertiary: node.color,
            colorCount: 1,
        };
    }

    const disciplines = node.disciplines ?? [];

    const isMultiDiscipline = disciplines.length > 1;

    const colors = disciplines
        .map((id) => {
            const baseColor =
                DISCIPLINE_COLORS.get(id) ?? node.color;

            if (isMultiDiscipline) {
                return (
                    MIXED_DISCIPLINE_COLORS[id] ??
                    baseColor
                );
            }

            return baseColor;
        })
        .slice(0, 3);

    if (colors.length === 0) {
        return {
            primary: node.color,
            secondary: node.color,
            tertiary: node.color,
            colorCount: 1,
        };
    }

    return {
        primary: colors[0],
        secondary: colors[1] ?? colors[0],
        tertiary: colors[2] ?? colors[0],
        colorCount: colors.length,
    };
}
