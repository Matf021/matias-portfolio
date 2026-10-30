
import {
  constellationLayout,
  addPositions,
} from "@/data/constellationLayout";

import type {
  ConstellationNodeData,
  Position3D,
} from "@/types/constellation";

export function resolveNodePositions(
  nodes: ConstellationNodeData[]
): ConstellationNodeData[] {
  const positions = new Map<string, Position3D>();

  positions.set("matias", [0, 0, 0]);

  for (const [clusterId, cluster] of Object.entries(
    constellationLayout
  )) {
    positions.set(clusterId, cluster.center);

    for (const [nodeId, offset] of Object.entries(
      cluster.offsets
    )) {
      positions.set(
        nodeId,
        addPositions(cluster.center, offset)
      );
    }
  }

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? node.position,
  }));
}
