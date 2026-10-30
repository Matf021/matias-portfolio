"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type NodeData = {
  id: string;
  position: [number, number, number];
  color: string;
  size: number;
};

const nodes: NodeData[] = [
  { id: "MF", position: [0, 0, 0], color: "#8ab8ff", size: 0.45 },
  { id: "AI", position: [-2.5, 1.5, -1], color: "#72c7ff", size: 0.25 },
  { id: "Cloud", position: [2.5, 1.3, -1.5], color: "#b29aff", size: 0.3 },
  { id: "Design", position: [-2, -1.5, 0.5], color: "#ffc58a", size: 0.28 },
  { id: "Code", position: [2.2, -1.5, 1], color: "#92ffcf", size: 0.3 },
];

function ConstellationNode({ node }: { node: NodeData }) {
  return (
    <mesh position={node.position}>
      <sphereGeometry args={[node.size, 32, 32]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}

function Connection({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#456b9a" transparent opacity={0.65} />
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

      <OrbitControls enablePan={false} enableZoom={false} />
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
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContent />
    </Canvas>
  );
}