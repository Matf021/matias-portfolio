"use client";

import { useCallback, useState } from "react";
import ConstellationViewer from "@/components/constellation/ConstellationViewer";
import { ArrowUpRight } from "lucide-react";

export default function CinematicHero() {
    type HeroMode = "intro" | "explorer";

    const [mode, setMode] = useState<HeroMode>("intro");
    const [resetRequest, setResetRequest] = useState(0);

    const isExploring = mode === "explorer";

    const handleSelectionChange = useCallback(
        (hasSelection: boolean) => {
            if (hasSelection) {
                setMode("explorer");
            }
        },
        []
    );

    const handleActivateExplorer = useCallback(() => {
        setMode("explorer");
    }, []);

    function returnToIntroduction() {
        setMode("intro");
        setResetRequest((current) => current + 1);
    }

    return (
        <section
            id="home"
            aria-labelledby="hero-heading"
            className="relative isolate min-h-svh overflow-hidden bg-background"
        >
            <div
                className="
          relative h-[680px] min-h-[100svh] w-full
          sm:h-[760px]
          lg:h-[100svh]
        "
            >
                {/* Full-bleed interactive constellation */}
                <div className="absolute inset-0">
                    <ConstellationViewer
                        onSelectionChange={handleSelectionChange}
                        onActivateExplorer={handleActivateExplorer}
                        onReturnToIntroduction={returnToIntroduction}
                        resetRequest={resetRequest}
                        introVisible={!isExploring}
                    />
                </div>

                {/* Readability gradient */}
                <div
                    aria-hidden="true"
                    className={`
                        pointer-events-none absolute inset-0 z-[1]
                        bg-[linear-gradient(to_bottom,rgba(8,17,32,0.97)_0%,rgba(8,17,32,0.85)_24%,rgba(8,17,32,0.10)_47%,rgba(8,17,32,0.10)_66%,rgba(8,17,32,0.78)_84%,rgba(8,17,32,0.96)_100%)]
                        transition-opacity duration-500 ease-out

                        lg:bg-gradient-to-r
                        lg:from-background/95
                        lg:via-background/25
                        lg:to-transparent

                        ${isExploring ? "opacity-0" : "opacity-100"}
                    `}
                />

                {/* Introduction */}
                <div
                    className={`
                        pointer-events-none absolute inset-0 z-[2]
                        flex items-start
                        px-5 pb-24 pt-16
                        transition-all duration-500 ease-out
                        sm:px-8 sm:pt-20
                        lg:items-center lg:px-12 lg:pb-0 lg:pt-0
                        xl:px-20
                        ${isExploring
                            ? "-translate-x-5 opacity-0"
                            : "translate-x-0 opacity-100"
                        }
                        motion-reduce:transform-none
                        motion-reduce:transition-none
                    `}
                    aria-hidden={isExploring}
                    inert={isExploring}
                >
                    <div className="flex h-full w-full flex-col justify-between lg:h-auto lg:max-w-[440px] lg:justify-start">
                        {/* Top: identity and introduction */}
                        <div>
                            <p className="mb-5 font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-accent">
                                Software Developer / Toronto, Canada
                            </p>

                            <h1
                                id="hero-heading"
                                className="
                                    whitespace-nowrap
                                    text-[clamp(2rem,8.8vw,2.75rem)]
                                    font-semibold leading-[1.05]
                                    tracking-tight text-foreground
                                    sm:text-[clamp(2.75rem,6.5vw,3.75rem)]
                                    lg:whitespace-normal
                                    lg:text-6xl xl:text-7xl
                                "
                            >
                                Matias
                                <span className="lg:hidden"> </span>
                                <br className="hidden lg:block" />
                                Franco<span className="text-accent">.</span>
                            </h1>

                            <p className="mt-6 max-w-sm text-base leading-relaxed text-text-secondary sm:text-lg">
                                I build intelligent systems and immersive digital
                                experiences, bringing engineering and creativity together.
                            </p>
                        </div>
                        {/* Bottom: actions and exploration hint */}
                        <div className="pointer-events-auto mt-8 space-y-5 lg:space-y-7">
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="#introduction"
                                    className="
                                        rounded-lg bg-accent px-5 py-3
                                        font-medium text-background
                                        transition-colors hover:bg-accent-hover
                                        "
                                >
                                    Discover My Work
                                </a>

                                <a
                                    href="https://github.com/Matf021"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        rounded-lg border border-border
                                        bg-background/40 px-5 py-3
                                        font-medium text-foreground
                                        backdrop-blur-sm transition-colors
                                        hover:bg-surface
                                        "
                                >
                                    <span className="inline-flex items-center gap-2">
                                        GitHub
                                        <ArrowUpRight
                                            size={16}
                                            strokeWidth={1.75}
                                            aria-hidden="true"
                                        />
                                    </span>
                                </a>
                            </div>
                            <div className="mt-6 flex items-center gap-2.5 text-xs leading-relaxed text-text-muted sm:text-sm">
                                <span
                                    aria-hidden="true"
                                    className="text-accent"
                                >
                                    ✦
                                </span>

                                <p>
                                    Curious?{" "}
                                    <span className="text-text-secondary">
                                        Click a star to explore my projects in 3D.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll discovery */}
                {!isExploring && (
                    <a
                        href="#introduction"
                        aria-label="Scroll to introduction"
                        className="
            group absolute bottom-8 left-1/2 z-[3]
            flex -translate-x-1/2 flex-col
            items-center gap-2
            text-text-muted transition-colors
            hover:text-accent
          "
                    >

                        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em]">
                            Scroll to explore
                        </span>

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-y-1"
                        >
                            <path d="M12 4v16M5 13l7 7 7-7" />
                        </svg>
                    </a>
                )}
            </div>
        </section>
    );
}