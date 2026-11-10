
"use client";

import { useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Stats } from "@react-three/drei";
import AtmosphericStarfield from "./AtmosphericStarfield";
import ConstellationLighting from "./ConstellationLighting";
import type { ScreenRect } from "@/types/camera";
import LabelCollisionManager from "./LabelCollisionManager";
import AtmosphericNebula from "./AtmosphericNebula";
import SpatialDust from "./SpatialDust";

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
    onExplore: () => void;
    panelRect: ScreenRect | null;
    overviewRequest: number;
};

export default function SceneContent({
    selectedId,
    onSelect,
    onExplore,
    panelRect,
    overviewRequest,
}: SceneContentProps) {
    const { size } = useThree();

    const layoutMode =
        size.width < 640 ? "mobile" : "desktop";
    const controlsRef =
        useRef<OrbitControlsImpl>(null);

    const hoveredIdsRef = useRef<Set<string>>(new Set());
    const hiddenLabelsRef = useRef<Set<string>>(new Set());

    const labelOffsetsRef = useRef<Map<string, number>>(
        new Map()
    );

    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const hoverConnectedIds = useMemo(
        () =>
            hoveredId
                ? getConnectedNodes(
                    hoveredId,
                    constellationEdges
                )
                : new Set<string>(),
        [hoveredId]
    );

    const positionedNodes = useMemo(
        () =>
            resolveNodePositions(
                constellationNodes,
                layoutMode
            ),
        [layoutMode]
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
            <ConstellationLighting />

            <ambientLight intensity={0.6} />

            <pointLight
                position={[3, 4, 5]}
                intensity={25}
            />

            <AtmosphericNebula />

            <SpatialDust
                nodes={positionedNodes}
                selectedId={selectedId}
            />

            <AtmosphericStarfield
                count={450}
                radius={75}
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
                        startRadius={source.size}
                        endRadius={target.size}
                        edge={edge}
                        selectedId={selectedId}
                        hoveredId={hoveredId}
                    />
                );
            })}

            <LabelCollisionManager
                nodes={positionedNodes}
                edges={constellationEdges}
                selectedId={selectedId}
                connectedIds={connectedIds}
                hoveredIdsRef={hoveredIdsRef}
                hiddenLabelsRef={hiddenLabelsRef}
                labelOffsetsRef={labelOffsetsRef}
            />

            {positionedNodes.map((node) => (
                <ConstellationNode
                    key={node.id}
                    node={node}
                    selectedId={selectedId}
                    connectedIds={connectedIds}
                    onSelect={onSelect}
                    hoveredIdsRef={hoveredIdsRef}
                    hiddenLabelsRef={hiddenLabelsRef}

                    hoveredId={hoveredId}
                    hoverConnectedIds={hoverConnectedIds}
                    onHoverChange={setHoveredId}
                    labelOffsetsRef={labelOffsetsRef}
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
                onStart={onExplore}
            />

            <CinematicCameraController
                nodes={positionedNodes}
                edges={constellationEdges}
                selectedId={selectedId}
                controlsRef={controlsRef}
                panelRect={panelRect}
                overviewRequest={overviewRequest}
            />
            {process.env.NODE_ENV === "development" && (
                <Stats showPanel={0} />
            )}
        </>
    );
}
