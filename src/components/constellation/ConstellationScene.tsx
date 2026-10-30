
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

import {
  constellationNodes,
  constellationEdges,
} from "@/data/constellation";

import type {
  ConstellationNodeData,
  Position3D,
} from "@/types/constellation";

function ConstellationNode({
  node,
}: {
  node: ConstellationNodeData;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;

    document.body.style.cursor = "pointer";

    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const targetScale = hovered ? 1.35 : 1;
    const smoothing = 1 - Math.exp(-8 * delta);

    const nextScale = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      smoothing
    );

    meshRef.current.scale.setScalar(nextScale);
  });

  const labelSize =
    node.category === "identity"
      ? 0.2
      : node.category === "discipline"
        ? 0.16
        : node.category === "project"
          ? 0.13
          : 0.1;

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[node.size, 24, 24]} />

        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 1.5 : 0.4}
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[0, -node.size - 0.2, 0]}
        fontSize={labelSize}
        color={hovered ? "#ffffff" : "#b8c9e2"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#081120"
      >
        {node.label}
      </Text>
    </group>
  );
}

function Connection({
  start,
  end,
}: {
  start: Position3D;
  end: Position3D;
}) {
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#456b9a"
        transparent
        opacity={0.5}
      />
    </lineSegments>
  );
}

function SceneContent() {
  const nodeMap = useMemo(
    () => new Map(
      constellationNodes.map((node) => [node.id, node])
    ),
    []
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 4, 5]} intensity={25} />

      {constellationEdges.map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);

        if (!source || !target) return null;

        return (
          <Connection
            key={`${edge.source}-${edge.target}`}
            start={source.position}
            end={target.position}
          />
        );
      })}

      {constellationNodes.map((node) => (
        <ConstellationNode key={node.id} node={node} />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6}
        maxDistance={16}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function ConstellationScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 13],
        fov: 55,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
