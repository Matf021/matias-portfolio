
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

export default function SectionConstellationBridge() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            data-visible={visible}
            className="constellation-bridge relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10"
        >
            <div className="relative h-28 sm:h-36">
                <svg
                    viewBox="0 0 1200 180"
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 h-full w-full"
                    fill="none"
                >
                    <defs>
                        <radialGradient id="bridge-star-gradient">
                            <stop offset="0%" stopColor="#F0F5FF" />
                            <stop offset="40%" stopColor="#B6CFFF" />
                            <stop offset="100%" stopColor="#729CE6" />
                        </radialGradient>

                        <radialGradient id="bridge-glow-gradient">
                            <stop
                                offset="0%"
                                stopColor="#8AB8FF"
                                stopOpacity="0.3"
                            />
                            <stop
                                offset="100%"
                                stopColor="#8AB8FF"
                                stopOpacity="0"
                            />
                        </radialGradient>
                    </defs>

                    {/* Faint atmospheric stars */}
                    <g fill="#91A6C4" opacity="0.35">
                        {backgroundStars.map(([x, y], index) => (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="1.4"
                            />
                        ))}
                    </g>

                    {/* Connections draw after their stars appear */}
                    <g
                        stroke="#8AB8FF"
                        strokeWidth="1"
                        strokeOpacity="0.38"
                        strokeLinecap="round"
                    >
                        {connections.map(([fromId, toId], index) => {
                            const from = starById.get(fromId)!;
                            const to = starById.get(toId)!;

                            const style = {
                                transitionDelay: `${900 + index * 90}ms`,
                            } satisfies CSSProperties;

                            return (
                                <path
                                    key={`${fromId}-${toId}`}
                                    d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                                    pathLength={1}
                                    strokeDasharray="1"
                                    className="bridge-connection"
                                    style={style}
                                />
                            );
                        })}
                    </g>

                    {/* Stars appear progressively */}
                    {stars.map((star) => {
                        const style = {
                            transitionDelay: `${star.delay}ms`,
                        } satisfies CSSProperties;

                        return (
                            <g
                                key={star.id}
                                className="bridge-star"
                                style={style}
                            >
                                <circle
                                    cx={star.x}
                                    cy={star.y}
                                    r={star.radius * 5}
                                    fill="url(#bridge-glow-gradient)"
                                />

                                <circle
                                    cx={star.x}
                                    cy={star.y}
                                    r={star.radius}
                                    fill="url(#bridge-star-gradient)"
                                />

                                <circle
                                    cx={star.x - star.radius * 0.2}
                                    cy={star.y - star.radius * 0.25}
                                    r={star.radius * 0.22}
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
