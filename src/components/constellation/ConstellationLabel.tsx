
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

import type {
  ConstellationNodeData,
} from "@/types/constellation";

type ConstellationLabelProps = {
  node: ConstellationNodeData;
  hovered: boolean;
  selected: boolean;
  connected: boolean;
  hasSelection: boolean;
};

export default function ConstellationLabel({
  node,
  hovered,
  selected,
  connected,
  hasSelection,
}: ConstellationLabelProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const isTechnology = node.category === "technology";

  const isRelevant =
    !hasSelection || selected || connected;

  const shouldShow =
    hovered ||
    selected ||
    (hasSelection && connected) ||
    (!isTechnology && !hasSelection);

  const labelSize =
    node.category === "identity"
      ? 0.24
      : node.category === "discipline"
        ? 0.2
        : node.category === "project"
          ? 0.17
          : 0.15;

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const targetOpacity = shouldShow
      ? isRelevant || hovered
        ? 1
        : 0.25
      : 0;

    const smoothing = 1 - Math.exp(-7 * delta);

    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      targetOpacity,
      smoothing
    );
  });

  return (
    <Billboard follow lockX={false} lockY={false} lockZ={false}>
      <Text
        position={[0, -node.size - 0.23, 0]}
        fontSize={labelSize}
        color={
          selected || hovered
            ? "#ffffff"
            : "#c4d4eb"
        }
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#081120"
        raycast={() => null}
      >
        {node.label}

        <meshBasicMaterial
          ref={materialRef}
          color={
            selected || hovered
              ? "#ffffff"
              : "#c4d4eb"
          }
          transparent
          opacity={shouldShow ? 1 : 0}
          depthWrite={false}
          toneMapped={false}
        />
      </Text>
    </Billboard>
  );
}
