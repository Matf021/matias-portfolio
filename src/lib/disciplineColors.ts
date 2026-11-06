import type {
  ConstellationNodeData,
  DisciplineId,
} from "@/types/constellation";

export type DisciplineColor = {
  id: DisciplineId;
  color: string;
};

function isDisciplineId(
  id: string
): id is DisciplineId {
  return (
    id === "ai" ||
    id === "cloud" ||
    id === "creative" ||
    id === "software"
  );
}

export function getNodeDisciplineColors(
  node: ConstellationNodeData,
  nodes: ConstellationNodeData[]
): DisciplineColor[] {
  const disciplineIds: DisciplineId[] =
    node.category === "discipline"
      ? isDisciplineId(node.id) ? [node.id] : []
      : node.disciplines ?? [];

  return disciplineIds.flatMap((id) => {
    const discipline = nodes.find(
      (candidate) =>
        candidate.id === id &&
        candidate.category === "discipline"
    );

    return discipline
      ? [{ id, color: discipline.color }]
      : [];
  });
}