
const nodes = [
    { id: "core", x: 300, y: 175, r: 12, label: "PORTFOLIO" },
    { id: "shaders", x: 132, y: 83, r: 7, label: "GLSL SHADERS" },
    { id: "graph", x: 454, y: 77, r: 7, label: "SCENE GRAPH" },
    { id: "camera", x: 128, y: 285, r: 7, label: "CAMERA SYSTEM" },
    { id: "interaction", x: 455, y: 277, r: 7, label: "INTERACTION" },
    { id: "lighting", x: 305, y: 57, r: 5, label: "LIGHTING" },
];

const connections = [
    ["core", "shaders"],
    ["core", "graph"],
    ["core", "camera"],
    ["core", "interaction"],
    ["core", "lighting"],
    ["shaders", "lighting"],
    ["lighting", "graph"],
    ["camera", "interaction"],
];

const features = [
    {
        number: "01",
        title: "Rendering",
        detail: "Custom GLSL materials",
    },
    {
        number: "02",
        title: "Navigation",
        detail: "Cinematic camera flights",
    },
    {
        number: "03",
        title: "Interaction",
        detail: "Connected node exploration",
    },
];

export default function PortfolioSystemVisual() {
    const nodeMap = new Map(
        nodes.map((node) => [node.id, node])
    );

    return (
        <figure className="relative overflow-hidden rounded-2xl border border-[#E4A66E]/20 bg-[#0B1427] p-5 shadow-[0_0_60px_rgba(228,166,110,0.04)] sm:p-7">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(228,166,110,0.08),transparent_65%)]"
            />

            <div className="relative flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E9B17E]">
                    Creative Engineering
                </span>

                <span className="rounded-full border border-[#E4A66E]/20 px-2.5 py-1 font-mono text-[10px] text-text-secondary">
                    System Overview
                </span>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-xl border border-border/60 bg-[#080F20]/70">
                <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                        Constellation / Architecture
                    </span>

                    <span className="font-mono text-[10px] text-[#E9B17E]">
                        R3F + Three.js
                    </span>
                </div>

                <svg
                    viewBox="0 0 600 355"
                    className="w-full"
                    role="img"
                    aria-label="Conceptual scene graph showing the portfolio connected to shaders, lighting, camera navigation, and interactive nodes"
                >
                    <defs>
                        <radialGradient id="portfolio-core-glow">
                            <stop
                                offset="0%"
                                stopColor="#FBE0B8"
                                stopOpacity="0.75"
                            />
                            <stop
                                offset="30%"
                                stopColor="#E7A568"
                                stopOpacity="0.28"
                            />
                            <stop
                                offset="100%"
                                stopColor="#E7A568"
                                stopOpacity="0"
                            />
                        </radialGradient>

                        <radialGradient id="portfolio-node-glow">
                            <stop
                                offset="0%"
                                stopColor="#E4A66E"
                                stopOpacity="0.35"
                            />
                            <stop
                                offset="100%"
                                stopColor="#E4A66E"
                                stopOpacity="0"
                            />
                        </radialGradient>
                    </defs>

                    {/* Subtle technical grid */}
                    {Array.from({ length: 11 }, (_, index) => (
                        <line
                            key={`v-${index}`}
                            x1={index * 60}
                            x2={index * 60}
                            y1="0"
                            y2="355"
                            stroke="#A5BBE0"
                            strokeOpacity="0.045"
                        />
                    ))}

                    {Array.from({ length: 7 }, (_, index) => (
                        <line
                            key={`h-${index}`}
                            x1="0"
                            x2="600"
                            y1={index * 60}
                            y2={index * 60}
                            stroke="#A5BBE0"
                            strokeOpacity="0.045"
                        />
                    ))}

                    {/* Graph connections */}
                    {connections.map(([fromId, toId]) => {
                        const from = nodeMap.get(fromId)!;
                        const to = nodeMap.get(toId)!;

                        return (
                            <line
                                key={`${fromId}-${toId}`}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke="#E4A66E"
                                strokeWidth="1"
                                strokeOpacity="0.32"
                            />
                        );
                    })}

                    {/* Glow behind central node */}
                    <circle
                        cx="300"
                        cy="175"
                        r="75"
                        fill="url(#portfolio-core-glow)"
                    />

                    {/* Individual nodes */}
                    {nodes.map((node) => {
                        const isCore = node.id === "core";

                        return (
                            <g key={node.id}>
                                {!isCore && (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={node.r * 5}
                                        fill="url(#portfolio-node-glow)"
                                    />
                                )}

                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.r}
                                    fill={
                                        isCore
                                            ? "#E6A66A"
                                            : "#172338"
                                    }
                                    stroke="#F3BD8C"
                                    strokeWidth="1"
                                />

                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={isCore ? 4 : 2.5}
                                    fill="#FFE8C9"
                                />

                                <text
                                    x={node.x}
                                    y={
                                        node.y +
                                        (isCore ? 38 : 24)
                                    }
                                    textAnchor="middle"
                                    fill={
                                        isCore
                                            ? "#F5D2AB"
                                            : "#9FB0CB"
                                    }
                                    fontSize={isCore ? 11 : 10}
                                    fontFamily="monospace"
                                    letterSpacing="1"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="relative mt-5 grid grid-cols-3 gap-2">
                {features.map((feature) => (
                    <div
                        key={feature.number}
                        className="min-w-0 rounded-lg border border-[#E4A66E]/15 bg-[#E4A66E]/5 p-3"
                    >
                        <p className="font-mono text-[10px] text-[#E9B17E]/70">
                            {feature.number}
                        </p>

                        <p className="mt-3 text-xs font-medium text-foreground">
                            {feature.title}
                        </p>

                        <p className="mt-1 text-[10px] leading-relaxed text-text-muted">
                            {feature.detail}
                        </p>
                    </div>
                ))}
            </div>

            <figcaption className="relative mt-5 text-xs leading-relaxed text-text-muted">
                Simplified illustration of the interactive
                constellation&apos;s graphics and navigation systems.
            </figcaption>
        </figure>
    );
}
