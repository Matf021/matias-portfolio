
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { constellationNodes } from "@/data/constellation";
import SceneContent from "./SceneContent";
import type { ScreenRect } from "@/types/camera";

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
                    className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 sm:right-auto sm:w-80"
                >
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
