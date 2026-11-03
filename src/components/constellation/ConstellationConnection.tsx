
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isConnectedEdge } from "@/lib/graph";

import type {
  ConstellationEdge,
  Position3D,
} from "@/types/constellation";

type ConstellationConnectionProps = {
  start: Position3D;
  end: Position3D;
  edge: ConstellationEdge;
  selectedId: string | null;
};

export default function ConstellationConnection({
  start,
  end,
  edge,
  selectedId,
}: ConstellationConnectionProps) {
  const materialRef =
    useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const highlighted =
    selectedId !== null &&
    isConnectedEdge(selectedId, edge);

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const targetOpacity =
      selectedId === null
        ? 0.5
        : highlighted
          ? 1
          : 0.05;

    const smoothing = 1 - Math.exp(-8 * delta);

    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      targetOpacity,
      smoothing
    );

    materialRef.current.color.lerp(
      new THREE.Color(
        highlighted ? "#8ab8ff" : "#456b9a"
      ),
      smoothing
    );
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#456b9a"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </lineSegments>
  );
}
