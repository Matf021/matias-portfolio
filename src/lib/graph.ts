
import type {
  ConstellationEdge,
  ConstellationNodeData,
} from "@/types/constellation";

/**
 * Returns the selected node and all directly
 * connected nodes.
 *
 * Edges are treated as undirected relationships.
 */
export function getConnectedNodes(
  selectedId: string,
  edges: ConstellationEdge[]
): Set<string> {
  const connected = new Set<string>([selectedId]);

  for (const edge of edges) {
    if (edge.source === selectedId) {
      connected.add(edge.target);
    }

    if (edge.target === selectedId) {
      connected.add(edge.source);
    }
  }

  return connected;
}

/**
 * Checks whether an edge touches the selected node.
 */
export function isConnectedEdge(
  selectedId: string,
  edge: ConstellationEdge
): boolean {
  return (
    edge.source === selectedId ||
    edge.target === selectedId
  );
}

/**
 * Finds relationships represented by node metadata,
 * independently of the visible constellation edges.
 *
 * - Discipline: projects and technologies assigned
 *   to that discipline.
 * - Project: disciplines assigned to that project.
 * - Technology: disciplines assigned to that technology.
 *
 * Direct project-to-technology relationships are
 * already represented by the visual graph.
 */
export function getSemanticRelatedNodes(
  selectedId: string,
  nodes: ConstellationNodeData[]
): Set<string> {
  const related = new Set<string>();

  const selectedNode = nodes.find(
    (node) => node.id === selectedId
  );

  if (!selectedNode) {
    return related;
  }

  if (selectedNode.category === "discipline") {
    for (const node of nodes) {
      if (
        node.id !== selectedId &&
        node.disciplines?.includes(
          selectedNode.id as
            NonNullable<ConstellationNodeData["disciplines"]>[number]
        )
      ) {
        related.add(node.id);
      }
    }
  }

  if (
    selectedNode.category === "project" ||
    selectedNode.category === "technology"
  ) {
    for (const disciplineId of
      selectedNode.disciplines ?? []) {
      if (nodes.some(
        (node) =>
          node.id === disciplineId &&
          node.category === "discipline"
      )) {
        related.add(disciplineId);
      }
    }
  }

  return related;
}

export type NodeRelationships = {
  visual: Set<string>;
  semantic: Set<string>;
  all: Set<string>;
};

/**
 * Combines both relationship systems without
 * changing the actual constellation edges.
 *
 * The selected node is excluded from all results.
 */
export function getNodeRelationships(
  selectedId: string,
  nodes: ConstellationNodeData[],
  edges: ConstellationEdge[]
): NodeRelationships {
  const visual = getConnectedNodes(
    selectedId,
    edges
  );

  visual.delete(selectedId);

  const semantic = getSemanticRelatedNodes(
    selectedId,
    nodes
  );

  const all = new Set([
    ...visual,
    ...semantic,
  ]);

  return {
    visual,
    semantic,
    all,
  };
}
