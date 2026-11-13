
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
    constellationNodes,
    constellationEdges,
} from "@/data/constellation";
import SceneContent from "./SceneContent";
import type { ScreenRect } from "@/types/camera";
import ConstellationInfoPanel from "./ConstellationInfoPanel";
import ConstellationInteractionHint from "./ConstellationInteractionHint";
import { getNodeRelationships } from "@/lib/graph";
import ConstellationKeyboardExplorer, {
    type KeyboardExplorerHandle,
} from "./ConstellationKeyboardExplorer";
import { resolveNodePositions } from "@/lib/constellationLayout";
import type { ConstellationNodeData } from "@/types/constellation";

type ConstellationSceneProps = {
    onSelectionChange?: (hasSelection: boolean) => void;
};

export default function ConstellationScene({
    onSelectionChange,
}: ConstellationSceneProps) {
    const nodes = useMemo<ConstellationNodeData[]>(
        () => resolveNodePositions(constellationNodes, "desktop"),
        []
    );
    const [selectedId, setSelectedId] =
        useState<string | null>(null);
    useEffect(() => {
        onSelectionChange?.(selectedId !== null);
    }, [selectedId, onSelectionChange]);

    const [overviewRequest, setOverviewRequest] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [focusHeading, setFocusHeading] = useState(false);
    const keyboardExplorerRef =
        useRef<KeyboardExplorerHandle>(null);

    const selectedNode = nodes.find(
        (node) => node.id === selectedId
    );

    const relatedNodes = useMemo(() => {
        if (!selectedId) {
            return [];
        }

        const relationships = getNodeRelationships(
            selectedId,
            nodes,
            constellationEdges
        );

        return nodes.filter(
            (node) =>
                node.id !== selectedId &&
                relationships.all.has(node.id)
        );
    }, [selectedId, nodes]);

    const featuredProjects = useMemo(() => {
        const featuredIds = [
            "manatee",
            "voice-notes",
            "portfolio",
        ];

        return featuredIds
            .map((id) => nodes.find((node) => node.id === id))
            .filter(
                (node): node is ConstellationNodeData =>
                    node !== undefined
            );
    }, [nodes]);


    const [panelRect, setPanelRect] =
        useState<ScreenRect | null>(null);


    function handleSelect(id: string) {
        keyboardExplorerRef.current?.close();

        setHasInteracted(true);
        setFocusHeading(false);

        setSelectedId((current) =>
            current === id ? null : id
        );
    }

    function handleRelatedNavigate(
        id: string,
        fromKeyboard: boolean
    ) {
        setHasInteracted(true);
        setFocusHeading(fromKeyboard);

        setSelectedId(id);
    }
    function handleOverview() {
        keyboardExplorerRef.current?.close();

        setFocusHeading(false);
        setSelectedId(null);
        setOverviewRequest((current) => current + 1);
    }
    function handleKeyboardExplorerSelect(id: string) {
        setHasInteracted(true);
        setFocusHeading(true);
        setSelectedId(id);
    }

    useEffect(() => {
        const container = containerRef.current;
        const panel = panelRef.current;

        if (!container || !panel) return;

        const measure = () => {
            const containerRect =
                container.getBoundingClientRect();

            const rect =
                panel.getBoundingClientRect();

            const nextRect: ScreenRect = {
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
                width: rect.width,
                height: rect.height,
            };

            setPanelRect((previous) => {
                if (
                    previous &&
                    previous.x === nextRect.x &&
                    previous.y === nextRect.y &&
                    previous.width === nextRect.width &&
                    previous.height === nextRect.height
                ) {
                    return previous;
                }
                return nextRect;
            });
        };

        const observer = new ResizeObserver(measure);

        observer.observe(container);
        observer.observe(panel);

        measure();

        return () => observer.disconnect();
    }, [selectedId]);

    useEffect(() => {
        if (!selectedId) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            setFocusHeading(false);
            setSelectedId(null);
            setOverviewRequest((current) => current + 1);

            keyboardExplorerRef.current?.focusTrigger();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedId]);

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full"

        >
            <p className="sr-only">
                Interactive constellation of projects and technical skills.
                Select a node to explore its details.
                Drag to rotate the constellation and scroll to zoom.
            </p>
            <ConstellationKeyboardExplorer
                ref={keyboardExplorerRef}
                nodes={nodes}
                selectedId={selectedId}
                onSelect={handleKeyboardExplorerSelect}
                edges={constellationEdges}
            />
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
                    onExplore={() => setHasInteracted(true)}
                    panelRect={selectedId ? panelRect : null}
                    overviewRequest={overviewRequest}
                />
            </Canvas>

            <ConstellationInteractionHint
                dismissed={hasInteracted}
            />

            {/* Information panel */}
            {selectedNode && (
                <div
                    ref={panelRef}
                    className="
            pointer-events-none
            absolute bottom-0 left-0 right-0 z-10
            sm:bottom-4 sm:left-4 sm:right-auto sm:w-96
        "
                >
                    <div className="pointer-events-auto">
                        <ConstellationInfoPanel
                            key={selectedNode.id}
                            node={selectedNode}
                            relatedNodes={relatedNodes}
                            onNavigate={handleRelatedNavigate}
                            focusHeading={focusHeading}
                            onClose={handleOverview}
                            featuredProjects={featuredProjects}
                        />
                    </div>
                </div>
            )}

            {/* Overview navigation */}
            <button
                type="button"
                onClick={handleOverview}
                aria-label="Return to constellation overview"
                className="
                    absolute right-4 top-4 z-10
                    flex items-center gap-2
                    rounded-lg
                    border border-white/10
                    bg-[#081120]/65
                    px-3 py-2
                    text-xs font-medium
                    text-[#a9bddb]
                    backdrop-blur-md
                    transition-all duration-200
                    hover:border-white/25
                    hover:bg-[#101d33]/85
                    hover:text-white
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-blue-400
                "
            >
                <span aria-hidden="true">◎</span>
                Overview
            </button>
        </div>
    );
}
