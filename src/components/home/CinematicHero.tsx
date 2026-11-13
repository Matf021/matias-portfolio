"use client";

import { useCallback, useState } from "react";
import ConstellationViewer from "@/components/constellation/ConstellationViewer";

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

    function handleModeChange() {
        if (mode === "intro") {
            setMode("explorer");
            return;
        }

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
                        resetRequest={resetRequest}
                    />
                </div>

                {/* Hero mode switch */}
                <button
                    type="button"
                    onClick={handleModeChange}
                    className="
                        absolute left-5 top-20 z-20
                        rounded-lg border border-white/15
                        bg-[#081120]/80 px-4 py-2.5
                        text-sm font-medium text-[#c6d5f0]
                        backdrop-blur-md
                        transition-colors duration-200
                        hover:border-white/30 hover:bg-[#14213a]
                        hover:text-white
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-blue-400
                        sm:left-8
                    "
                >
                    {isExploring ? "← Introduction" : "Explore constellation ↗"}
                </button>

                {/* Readability gradient */}
                <div
                    aria-hidden="true"
                    className={`
            pointer-events-none absolute inset-0 z-[1]
            bg-gradient-to-r
            from-background/95
            via-background/65
            to-transparent
            transition-opacity duration-500 ease-out
            lg:via-background/25
            ${isExploring ? "opacity-0" : "opacity-100"}
          `}
                />

                {/* Introduction */}
                <div
                    className={`
            pointer-events-none absolute inset-0 z-[2]
            flex items-start
            px-5 pt-24
            transition-all duration-500 ease-out
            sm:px-8 sm:pt-28
            lg:items-center lg:px-12 lg:pt-0
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
                    <div className="w-full max-w-[440px]">
                        <p className="mb-5 font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-accent">
                            Software Developer / Toronto, Canada
                        </p>

                        <h1
                            id="hero-heading"
                            className="
                text-5xl font-semibold
                leading-[1.05] tracking-tight
                text-foreground
                sm:text-6xl xl:text-7xl
              "
                        >
                            Matias
                            <br />
                            Franco<span className="text-accent">.</span>
                        </h1>

                        <p className="mt-6 max-w-sm text-base leading-relaxed text-text-secondary sm:text-lg">
                            I build intelligent systems and interactive
                            experiences, turning curiosity into code.
                        </p>

                        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
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
                                GitHub ↗
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll discovery */}
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
            </div>
        </section>
    );
}