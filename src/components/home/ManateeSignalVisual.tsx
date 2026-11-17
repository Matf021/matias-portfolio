"use client";

import { useEffect, useRef, useState } from "react";
import SyntheticSpectrogram from "./SyntheticSpectrogram";
import { phaseProgress } from "@/lib/animationProgress";

const samples = Array.from({ length: 180 }, (_, index) => {
    const x = index / 179;
    const envelope =
        0.12 +
        0.65 * Math.exp(-Math.pow((x - 0.35) / 0.12, 2)) +
        0.45 * Math.exp(-Math.pow((x - 0.74) / 0.09, 2));

    const signal =
        Math.sin(x * 150) * 0.6 +
        Math.sin(x * 280) * 0.25 +
        Math.sin(x * 53) * 0.15;

    return {
        x: 24 + x * 552,
        y: 145 - signal * envelope * 62,
    };
});

const waveformPath = samples
    .map(({ x, y }, index) =>
        `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    )
    .join(" ");

export default function ManateeSignalVisual() {
    const figureRef = useRef<HTMLElement>(null);
    const [revealProgress, setRevealProgress] = useState(0);

    useEffect(() => {
        const figure = figureRef.current;
        if (!figure) return;

        const reducedMotionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let frameId: number | null = null;

        const updateProgress = () => {
            frameId = null;

            if (reducedMotionQuery.matches) {
                setRevealProgress(1);
                return;
            }

            const rect = figure.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Start as the top of the card enters the viewport.
            const startTop = viewportHeight * 0.85;

            // Complete when the bottom of the card reaches
            // 92% of the viewport height.
            const endBottom = viewportHeight * 0.92;

            // Convert the desired bottom position into a
            // corresponding top position.
            const endTop = endBottom - rect.height;

            const progress = Math.max(
                0,
                Math.min(
                    1,
                    (startTop - rect.top) / (startTop - endTop)
                )
            );

            setRevealProgress((previous) =>
                Math.abs(previous - progress) > 0.001
                    ? progress
                    : previous
            );
        };

        const scheduleUpdate = () => {
            if (frameId !== null) return;

            frameId = requestAnimationFrame(updateProgress);
        };

        scheduleUpdate();

        window.addEventListener("scroll", scheduleUpdate, {
            passive: true,
        });

        window.addEventListener("resize", scheduleUpdate);
        reducedMotionQuery.addEventListener(
            "change",
            scheduleUpdate
        );

        return () => {
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);

            reducedMotionQuery.removeEventListener(
                "change",
                scheduleUpdate
            );

            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
        };
    }, []);
    const waveformProgress = phaseProgress(
        revealProgress, 0, 0.58
    );

    const spectrogramProgress = phaseProgress(
        revealProgress, 0.18, 0.78
    );

    const detectionProgress = phaseProgress(
        revealProgress, 0.63, 0.88
    );

    const processingStages = [
        phaseProgress(revealProgress, 0.74, 0.82),
        phaseProgress(revealProgress, 0.82, 0.90),
        phaseProgress(revealProgress, 0.90, 1),
    ];
    return (
        <figure
            ref={figureRef}
            className="relative overflow-hidden rounded-2xl border border-accent/20 bg-[#0B1427] p-5 shadow-[0_0_60px_rgba(100,148,230,0.05)] sm:p-7"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_45%_45%,rgba(100,160,255,0.09),transparent_65%)]"
            />

            <div className="relative flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    Acoustic Analysis
                </span>

                <span className="rounded-full border border-accent/20 px-2.5 py-1 font-mono text-[10px] text-text-secondary">
                    Synthetic Signal
                </span>
            </div>

            <svg
                viewBox="0 0 600 290"
                className="relative mt-5 w-full"
                role="img"
                aria-label="Illustrative synthetic acoustic waveform with two highlighted detection regions"
            >
                <defs>
                    <linearGradient id="manatee-wave" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#548DD5" />
                        <stop offset="50%" stopColor="#BDD8FF" />
                        <stop offset="100%" stopColor="#72A7EF" />
                    </linearGradient>

                    <linearGradient id="manatee-region" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8AB8FF" stopOpacity="0.17" />
                        <stop offset="100%" stopColor="#8AB8FF" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {Array.from({ length: 9 }, (_, index) => (
                    <line
                        key={`vertical-${index}`}
                        x1={25 + index * 69}
                        y1="20"
                        x2={25 + index * 69}
                        y2="250"
                        stroke="#A4C3F2"
                        strokeOpacity="0.09"
                    />
                ))}

                {[45, 95, 145, 195, 245].map((y) => (
                    <line
                        key={`horizontal-${y}`}
                        x1="24"
                        y1={y}
                        x2="576"
                        y2={y}
                        stroke="#A4C3F2"
                        strokeOpacity="0.09"
                    />
                ))}

                <g opacity={detectionProgress.toFixed(3)}>
                    <rect
                        x="145"
                        y="22"
                        width="140"
                        height="224"
                        rx="6"
                        fill="url(#manatee-region)"
                        stroke="#8AB8FF"
                        strokeOpacity="0.35"
                        strokeDasharray="4 5"
                    />

                    <text
                        x="155"
                        y="38"
                        fill="#BDD8FF"
                        fontSize="10"
                    >
                        REGION 01
                    </text>
                </g>

                <g opacity={detectionProgress.toFixed(3)}>
                    <rect
                        x="408"
                        y="22"
                        width="100"
                        height="224"
                        rx="6"
                        fill="url(#manatee-region)"
                        stroke="#8AB8FF"
                        strokeOpacity="0.35"
                        strokeDasharray="4 5"
                    />

                    <text x="418" y="38" fill="#BDD8FF" fontSize="10">
                        REGION 02
                    </text>
                </g>
                <path
                    d={waveformPath}
                    fill="none"
                    stroke="url(#manatee-wave)"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - waveformProgress}
                />

                <text x="24" y="272" fill="#8295B6" fontSize="11">
                    TIME
                </text>

                <text
                    x="576"
                    y="272"
                    fill="#8295B6"
                    fontSize="11"
                    textAnchor="end"
                >
                    SYNTHETIC INPUT
                </text>
            </svg>

            <SyntheticSpectrogram
                revealProgress={spectrogramProgress}
            />

            <div className="relative mt-3 grid grid-cols-3 gap-2 border-t border-border/70 pt-5">
                {["FILTER", "MFCC", "HMM"].map((step, index) => {
                    const progress = processingStages[index];

                    return (
                        <div key={step} className="min-w-0">
                            <p
                                className="font-mono text-[10px] text-text-muted"
                            >
                                0{index + 1}
                            </p>

                            <p
                                className="mt-1 font-mono text-xs font-medium"
                                style={{
                                    color: progress > 0
                                        ? "#BDD8FF"
                                        : "#8295B6",
                                    opacity: (0.45 + progress * 0.55).toFixed(3),
                                }}
                            >
                                {step}
                            </p>

                            <div className="mt-2 h-px bg-border/40">
                                <div
                                    className="h-full bg-[#91BCFF]"
                                    style={{
                                        width: `${(progress * 100).toFixed(2)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <figcaption className="relative mt-5 text-xs leading-relaxed text-text-muted">
                Illustrative signal and detection regions. Not derived
                from restricted research recordings or actual model output.
            </figcaption>
        </figure>
    );
}
