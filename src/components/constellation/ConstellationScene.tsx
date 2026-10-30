
"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Canvas,
    useFrame,
} from "@react-three/fiber";

import {
    OrbitControls,
    Text,
} from "@react-three/drei";

import * as THREE from "three";

import {
    constellationNodes,
    constellationEdges,
} from "@/data/constellation";

import {
    getConnectedNodes,
    isConnectedEdge,
} from "@/lib/graph";

import {
    resolveNodePositions
} from "@/lib/constellationLayout";

import type {
    ConstellationNodeData,
    ConstellationEdge,
    Position3D,
} from "@/types/constellation";

// Individual 3D node
function ConstellationNode({
    node,
    selectedId,
    connectedIds,
    onSelect,
}: {
    node: ConstellationNodeData;
    selectedId: string | null;
    connectedIds: Set<string>;
    onSelect: (id: string) => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const [hovered, setHovered] = useState(false);

    const isSelected = selectedId === node.id;

    const isDimmed =
        selectedId !== null &&
        !connectedIds.has(node.id);

    useEffect(() => {
        if (!hovered) return;

        document.body.style.cursor = "pointer";

        return () => {
            document.body.style.cursor = "";
        };
    }, [hovered]);

    useFrame((_, delta) => {
        if (!meshRef.current || !materialRef.current) return;

        const targetScale = isSelected
            ? 1.5
            : hovered
                ? 1.3
                : 1;

        const smoothing = 1 - Math.exp(-8 * delta);

        const nextScale = THREE.MathUtils.lerp(
            meshRef.current.scale.x,
            targetScale,
            smoothing
        );

        meshRef.current.scale.setScalar(nextScale);

        const targetOpacity = isDimmed ? 0.12 : 1;

        materialRef.current.opacity = THREE.MathUtils.lerp(
            materialRef.current.opacity,
            targetOpacity,
            smoothing
        );

        const targetEmissive = isSelected
            ? 2
            : hovered
                ? 1.5
                : isDimmed
                    ? 0.05
                    : 0.4;

        materialRef.current.emissiveIntensity =
            THREE.MathUtils.lerp(
                materialRef.current.emissiveIntensity,
                targetEmissive,
                smoothing
            );
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
                onClick={(event) => {
                    event.stopPropagation();
                    onSelect(node.id);
                }}
                onPointerOver={(event) => {
                    event.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[node.size, 24, 24]} />

                <meshStandardMaterial
                    ref={materialRef}
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={0.4}
                    roughness={0.3}
                    transparent
                    opacity={1}
                    depthWrite={false}
                />
            </mesh>

            <Text
                position={[0, -node.size - 0.2, 0]}
                fontSize={labelSize}
                color={
                    isSelected
                        ? "#ffffff"
                        : isDimmed
                            ? "#52647e"
                            : "#b8c9e2"
                }
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

// Connection between two nodes
function Connection({
    start,
    end,
    edge,
    selectedId,
}: {
    start: Position3D;
    end: Position3D;
    edge: ConstellationEdge;
    selectedId: string | null;
}) {
    const geometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...start),
            new THREE.Vector3(...end),
        ]);
    }, [start, end]);

    const materialRef = useRef<THREE.LineBasicMaterial>(null);

    useEffect(() => {
        return () => geometry.dispose();
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

// 3D scene contents
function SceneContent({
    selectedId,
    onSelect,
}: {
    selectedId: string | null;
    onSelect: (id: string) => void;
}) {
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
                    <Connection
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
                enablePan={false}
                enableZoom
                minDistance={10}
                maxDistance={22}
                enableDamping
                dampingFactor={0.05}
            />
        </>
    );
}

// Main constellation component
export default function ConstellationScene() {
    const [selectedId, setSelectedId] =
        useState<string | null>(null);

    const selectedNode = constellationNodes.find(
        (node) => node.id === selectedId
    );

    function handleSelect(id: string) {
        setSelectedId((current) =>
            current === id ? null : id
        );
    }

    return (
        <div className="relative h-full w-full">
            <Canvas
                camera={{
                    position: [0, 0, 16],
                    fov: 55,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                }}
            >
                <SceneContent
                    selectedId={selectedId}
                    onSelect={handleSelect}
                />
            </Canvas>

            {/* Information panel */}
            {selectedNode && (
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 sm:right-auto sm:w-80">
                    <div className="pointer-events-auto rounded-xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-md">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                                <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">
                                    {selectedNode.category}
                                </p>

                                <h3 className="text-lg font-semibold text-foreground">
                                    {selectedNode.label}
                                </h3>
                            </div>

                            <button
                                onClick={() => setSelectedId(null)}
                                className="rounded-md px-2 py-1 text-text-secondary hover:bg-surface hover:text-foreground"
                                aria-label="Close project information"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-sm leading-relaxed text-text-secondary">
                            {selectedNode.description ??
                                "Explore the connections within this part of my development journey."}
                        </p>
                    </div>
                </div>
            )}

            {/* Clear selection button */}
            {selectedId && (
                <button
                    onClick={() => setSelectedId(null)}
                    className="absolute right-4 top-4 z-10 rounded-lg border border-border bg-background/90 px-3 py-2 text-xs text-text-secondary hover:text-foreground"
                >
                    Reset View
                </button>
            )}
        </div>
    );
}
