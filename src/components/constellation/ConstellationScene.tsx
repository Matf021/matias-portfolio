
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { constellationNodes } from "@/data/constellation";
import SceneContent from "./SceneContent";
import type { ScreenRect } from "@/types/camera";
import ConstellationInfoPanel from "./ConstellationInfoPanel";

export default function ConstellationScene() {
    const [selectedId, setSelectedId] =
        useState<string | null>(null);


    const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const selectedNode = constellationNodes.find(
        (node) => node.id === selectedId
    );

    const [panelRect, setPanelRect] =
        useState<ScreenRect | null>(null);

    function handleSelect(id: string) {
        setSelectedId((current) =>
            current === id ? null : id
        );
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

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full"
        >
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
                    panelRect={selectedId ? panelRect : null}
                />
            </Canvas>


            {/* Information panel */}
            {selectedNode && (
                <div
                    ref={panelRef}
                    className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 max-h-[calc(100%-2rem)] sm:right-auto sm:w-96"
                >
                    <div className="pointer-events-auto max-h-[calc(100dvh-2rem)]">
                        <ConstellationInfoPanel
                            key={selectedNode.id}
                            node={selectedNode}
                            onClose={() => setSelectedId(null)}
                        />
                    </div>
                </div>
            )}

            {/* Reset view */}
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
