
import type {
    ConstellationNodeData,
    DisciplineId,
} from "@/types/constellation";

export type DisciplineBridge = {
    nodeId: string;
    disciplines: DisciplineId[];
};

/**
 * Find project and technology nodes that connect
 * two or more disciplines.
 *
 * These are potential spatial bridges, not
 * automatically rendered visual edges.
 */
export function getDisciplineBridges(
    nodes: ConstellationNodeData[]
): DisciplineBridge[] {
    const existingDisciplines = new Set(
        nodes
            .filter((node) => node.category === "discipline")
            .map((node) => node.id)
    );

    return nodes
        .filter(
            (node) =>
                node.category === "project" ||
                node.category === "technology"
        )
        .map((node) => ({
            nodeId: node.id,
            disciplines: [
                ...new Set(node.disciplines ?? []),
            ].filter((id) => existingDisciplines.has(id)),
        }))
        .filter((bridge) => bridge.disciplines.length >= 2);
}
