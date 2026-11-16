
"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Star = {
    id: string;
    x: number;
    y: number;
    radius: number;
    delay: number;
};

const stars: Star[] = [
    { id: "a", x: 85, y: 116, radius: 3.5, delay: 0 },
    { id: "b", x: 210, y: 60, radius: 4.5, delay: 100 },
    { id: "c", x: 270, y: 145, radius: 2.5, delay: 200 },
    { id: "d", x: 375, y: 96, radius: 7, delay: 300 },
    { id: "e", x: 480, y: 40, radius: 3.5, delay: 400 },
    { id: "f", x: 530, y: 142, radius: 2.5, delay: 500 },
    { id: "g", x: 635, y: 85, radius: 5.5, delay: 600 },
    { id: "h", x: 735, y: 43, radius: 3, delay: 700 },
    { id: "i", x: 815, y: 110, radius: 4.5, delay: 800 },
    { id: "j", x: 935, y: 66, radius: 3.5, delay: 900 },
    { id: "k", x: 1035, y: 120, radius: 2.5, delay: 1000 },
    { id: "l", x: 1110, y: 65, radius: 3.5, delay: 1100 },
];

const connections = [
    ["a", "b"],
    ["b", "d"],
    ["b", "c"],
    ["c", "d"],
    ["d", "e"],
    ["d", "f"],
    ["d", "g"],
    ["e", "g"],
    ["f", "g"],
    ["g", "h"],
    ["g", "i"],
    ["h", "i"],
    ["i", "j"],
    ["i", "k"],
    ["j", "l"],
    ["k", "l"],
] as const;

const starById = new Map(stars.map((star) => [star.id, star]));

const backgroundStars = [
    [145, 25],
    [330, 35],
    [450, 168],
    [585, 22],
    [710, 164],
    [865, 29],
    [990, 151],
    [1150, 142],
];

const clamp01 = (value: number) =>
    Math.max(0, Math.min(1, value));

const smoothstep = (value: number) => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
};

// Compress the vertical distribution, not the SVG circles.
const flattenY = (y: number) =>
    45 + (y - 90) * 0.38;

export default function SectionConstellationBridge() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const svg = svgRef.current;

        if (!container || !svg) return;

        const starElements = Array.from(
            svg.querySelectorAll<SVGGElement>(".bridge-star")
        );

        const lineElements = Array.from(
            svg.querySelectorAll<SVGPathElement>(".bridge-connection")
        );

        let frameId = 0;

        const update = () => {
            frameId = 0;

            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Begin when the bridge reaches 80% of viewport height.
            // Finish when it reaches 38%.
            const start = viewportHeight * 0.8;
            const end = viewportHeight * 0.38;

            const progress = clamp01(
                (start - rect.top) / (start - end)
            );

            // Stars reveal in a staggered sequence.
            starElements.forEach((star, index) => {
                const localProgress = smoothstep(
                    (progress - index * 0.045) / 0.28
                );

                star.style.opacity = String(localProgress);
                star.style.transform = `scale(${0.5 + localProgress * 0.5
                    })`;
            });

            // Connections begin forming after the first stars.
            lineElements.forEach((line, index) => {
                const localProgress = smoothstep(
                    (progress - 0.22 - index * 0.025) / 0.38
                );

                line.style.strokeDashoffset =
                    String(1 - localProgress);
            });
        };

        const scheduleUpdate = () => {
            if (frameId) return;
            frameId = window.requestAnimationFrame(update);
        };

        update();

        window.addEventListener("scroll", scheduleUpdate, {
            passive: true,
        });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
        >
            <div className="relative h-20 sm:h-24">
                <svg
                    ref={svgRef}
                    viewBox="0 0 1200 90"
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 h-full w-full"
                    fill="none"
                >
                    <defs>
                        <radialGradient id="bridge-star-gradient">
                            <stop offset="0%" stopColor="#F0F5FF" />
                            <stop offset="45%" stopColor="#B6CFFF" />
                            <stop offset="100%" stopColor="#729CE6" />
                        </radialGradient>

                        <radialGradient id="bridge-glow-gradient">
                            <stop
                                offset="0%"
                                stopColor="#8AB8FF"
                                stopOpacity="0.22"
                            />
                            <stop
                                offset="100%"
                                stopColor="#8AB8FF"
                                stopOpacity="0"
                            />
                        </radialGradient>
                    </defs>

                    {/* Atmospheric background points */}
                    <g fill="#91A6C4" opacity="0.24">
                        {backgroundStars.map(([x, y], index) => (
                            <circle
                                key={index}
                                cx={x}
                                cy={flattenY(y)}
                                r="1"
                            />
                        ))}
                    </g>

                    {/* Scroll-controlled connecting lines */}
                    <g
                        stroke="#8AB8FF"
                        strokeWidth="0.7"
                        strokeOpacity="0.28"
                        strokeLinecap="round"
                    >
                        {connections.map(([fromId, toId]) => {
                            const from = starById.get(fromId)!;
                            const to = starById.get(toId)!;

                            return (
                                <path
                                    key={`${fromId}-${toId}`}
                                    className="bridge-connection"
                                    d={`M ${from.x} ${flattenY(from.y)}
                                        L ${to.x} ${flattenY(to.y)}`}
                                    pathLength={1}
                                    strokeDasharray="1"
                                    strokeDashoffset={1}
                                />
                            );
                        })}
                    </g>

                    {/* Scroll-controlled stars */}
                    {stars.map((star) => {
                        const radius = star.radius * 0.75;
                        const y = flattenY(star.y);

                        return (
                            <g
                                key={star.id}
                                className="bridge-star"
                            >
                                <circle
                                    cx={star.x}
                                    cy={y}
                                    r={radius * 5}
                                    fill="url(#bridge-glow-gradient)"
                                />

                                <circle
                                    cx={star.x}
                                    cy={y}
                                    r={radius}
                                    fill="url(#bridge-star-gradient)"
                                />

                                <circle
                                    cx={star.x - radius * 0.2}
                                    cy={y - radius * 0.25}
                                    r={radius * 0.22}
                                    fill="#FFFFFF"
                                    opacity="0.7"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}