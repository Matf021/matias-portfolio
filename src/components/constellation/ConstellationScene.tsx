
"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

type NodeData = {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  size: number;
};

const nodes: NodeData[] = [
  {
    id: "MF",
    label: "Matias Franco",
    position: [0, 0, 0],
    color: "#8ab8ff",
    size: 0.45,
  },
  {
    id: "AI",
    label: "Artificial Intelligence",
    position: [-2.5, 1.5, -1],
    color: "#72c7ff",
    size: 0.25,
  },
  {
    id: "Cloud",
    label: "Cloud Engineering",
    position: [2.5, 1.3, -1.5],
    color: "#b29aff",
    size: 0.3,
  },
  {
    id: "Design",
    label: "Creative Development",
    position: [-2, -1.5, 0.5],
    color: "#ffc58a",
    size: 0.28,
  },
  {
    id: "Code",
    label: "Software Engineering",
    position: [2.2, -1.5, 1],
    color: "#92ffcf",
    size: 0.3,
  },
];

function ConstellationNode({ node }: { node: NodeData }) {
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

    const targetScale = hovered ? 1.3 : 1;

    const smoothing = 1 - Math.exp(-8 * delta);

    const currentScale = meshRef.current.scale.x;

    const nextScale = THREE.MathUtils.lerp(
      currentScale,
      targetScale,
      smoothing
    );

    meshRef.current.scale.setScalar(nextScale);
  });

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
        <sphereGeometry args={[node.size, 32, 32]} />

        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 1.5 : 0.4}
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[0, -node.size - 0.3, 0]}
        fontSize={0.18}
        color={hovered ? "#ffffff" : "#b8c9e2"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
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
  start: [number, number, number];
  end: [number, number, number];
}) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#456b9a"
        transparent
        opacity={0.65}
      />
    </lineSegments>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 4, 5]} intensity={25} />

      {nodes.map((node) => (
        <ConstellationNode key={node.id} node={node} />
      ))}

      {nodes.slice(1).map((node) => (
        <Connection
          key={`connection-${node.id}`}
          start={nodes[0].position}
          end={node.position}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
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
        position: [0, 0, 8],
        fov: 50,
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
