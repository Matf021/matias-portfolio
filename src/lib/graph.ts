
import type {
  ConstellationEdge,
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
