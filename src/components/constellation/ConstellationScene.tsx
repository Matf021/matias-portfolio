
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { constellationNodes } from "@/data/constellation";
import SceneContent from "./SceneContent";
import type { ScreenRect } from "@/types/camera";
import ConstellationInfoPanel from "./ConstellationInfoPanel";
import ConstellationInteractionHint from "./ConstellationInteractionHint";

export default function ConstellationScene() {
    const [selectedId, setSelectedId] =
        useState<string | null>(null);

    const [overviewRequest, setOverviewRequest] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const selectedNode = constellationNodes.find(
        (node) => node.id === selectedId
    );

    const [panelRect, setPanelRect] =
        useState<ScreenRect | null>(null);

    function handleSelect(id: string) {
        setHasInteracted(true);

        setSelectedId((current) =>
            current === id ? null : id
        );
    }
    function handleOverview() {
        setSelectedId(null);
        setOverviewRequest((current) => current + 1);
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

            setSelectedId(null);
            setOverviewRequest((current) => current + 1);
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
                            onClose={() => setSelectedId(null)}
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
