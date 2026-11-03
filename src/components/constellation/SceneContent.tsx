
"use client";

import { useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";

import type {
  OrbitControls as OrbitControlsImpl,
} from "three-stdlib";

import {
  constellationNodes,
  constellationEdges,
} from "@/data/constellation";

import {
  resolveNodePositions,
} from "@/lib/constellationLayout";

import { getConnectedNodes } from "@/lib/graph";

import ConstellationNode from "./ConstellationNode";
import ConstellationConnection from "./ConstellationConnection";
import CinematicCameraController from "./CinematicCameraController";

type SceneContentProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function SceneContent({
  selectedId,
  onSelect,
}: SceneContentProps) {
  const controlsRef =
    useRef<OrbitControlsImpl>(null);

  const positionedNodes = useMemo(
    () => resolveNodePositions(constellationNodes),
    []
  );

  const nodeMap = useMemo(
    () =>
      new Map(
        positionedNodes.map((node) => [
          node.id,
          node,
        ])
      ),
    [positionedNodes]
  );

  const connectedIds = useMemo(
    () =>
      selectedId
        ? getConnectedNodes(
            selectedId,
            constellationEdges
          )
        : new Set<string>(),
    [selectedId]
  );

  return (
    <>
      <ambientLight intensity={0.6} />

      <pointLight
        position={[3, 4, 5]}
        intensity={25}
      />

      {constellationEdges.map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);

        if (!source || !target) return null;

        return (
          <ConstellationConnection
            key={`${edge.source}-${edge.target}`}
            start={source.position}
            end={target.position}
            edge={edge}
            selectedId={selectedId}
          />
        );
      })}

      {positionedNodes.map((node) => (
        <ConstellationNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          connectedIds={connectedIds}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enableRotate
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={40}
        enableDamping
        dampingFactor={0.05}
      />

      <CinematicCameraController
        nodes={positionedNodes}
        selectedId={selectedId}
        controlsRef={controlsRef}
      />
    </>
  );
}
