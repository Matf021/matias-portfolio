
"use client";

import { useRef, useState } from "react";
import { constellationDetails } from "@/data/constellationDetails";

import type { ConstellationNodeData } from "@/types/constellation";

type Props = {
    node: ConstellationNodeData;
    onClose: () => void;
};

export default function ConstellationInfoPanel({
    node,
    onClose,
}: Props) {
    const [expanded, setExpanded] = useState(false);

    const details = constellationDetails[node.id];
    const accentStyle = {
        "--panel-accent": node.color,
    } as React.CSSProperties;

    const contentRef = useRef<HTMLDivElement>(null);

    const hasDetails = Boolean(
        details &&
        (
            details.summary ||
            details.highlights?.length ||
            details.technologies?.length ||
            details.relatedProjects?.length ||
            details.repositoryUrl ||
            details.externalUrl
        )
    );

    const highlightsHeading =
        node.category === "project"
            ? "Technical Highlights"
            : node.category === "technology"
                ? "Practical Experience"
                : node.category === "discipline"
                    ? "Areas of Focus"
                    : "About Me";

    return (
        <div
            style={accentStyle}
            className="
                constellation-panel-enter
                flex w-full flex-col overflow-hidden
                max-h-[min(45svh,24rem)]
                rounded-none border-x-0 border-b-0 border-t border-border
                bg-background/95 shadow-2xl backdrop-blur-md
                sm:max-h-[min(70vh,36rem)]
                sm:rounded-xl sm:border
            "
        >
            <div
                className="h-[2px] shrink-0"
                style={{ backgroundColor: "var(--panel-accent)" }}
                aria-hidden="true"
            />

            {/* Fixed panel header */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-start gap-3">
                    <div
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                            backgroundColor: "var(--panel-accent)",
                            boxShadow: "0 0 12px var(--panel-accent)",
                        }}
                        aria-hidden="true"
                    />

                    <div className="min-w-0">
                        <p
                            className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em]"
                            style={{ color: "var(--panel-accent)" }}
                        >
                            {node.category}
                        </p>

                        <h3 className="text-lg font-semibold text-foreground">
                            {node.label}
                        </h3>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-md px-2 py-1 text-text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label="Close node information"
                >
                    ✕
                </button>
            </div>

            {/* Scrollable panel content */}
            <div
                ref={contentRef}
                className="min-h-0 overflow-y-auto overscroll-contain px-5 py-4"
            >

                <p className="text-sm leading-relaxed text-text-secondary">
                    {node.description ??
                        "Explore the connections within this part of my development journey."}
                </p>

                {expanded && (
                    <div className="constellation-details-enter mt-4 space-y-4 border-t border-border pt-4">

                        {details?.summary && (
                            <p className="text-sm leading-relaxed text-text-secondary">
                                {details.summary}
                            </p>
                        )}

                        {details?.highlights &&
                            details.highlights.length > 0 && (
                                <section>
                                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                                        {highlightsHeading}
                                    </h4>

                                    <ul className="space-y-2">
                                        {details.highlights.map((highlight) => (
                                            <li
                                                key={highlight}
                                                className="flex gap-2 text-sm leading-relaxed text-text-secondary"
                                            >
                                                <span
                                                    className="mt-1 text-accent"
                                                    aria-hidden="true"
                                                >
                                                    •
                                                </span>

                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                        {details?.technologies &&
                            details.technologies.length > 0 && (
                                <section>
                                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                                        Technologies
                                    </h4>

                                    <div className="flex flex-wrap gap-2">
                                        {details.technologies.map((technology) => (
                                            <span
                                                key={technology}
                                                className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text-secondary"
                                            >
                                                {technology}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                        {details?.relatedProjects &&
                            details.relatedProjects.length > 0 && (
                                <section>
                                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                                        Related Projects
                                    </h4>

                                    <div className="flex flex-wrap gap-2">
                                        {details.relatedProjects.map((project) => (
                                            <span
                                                key={project}
                                                className="rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary"
                                            >
                                                {project}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                        {details?.repositoryUrl && (
                            <a
                                href={details.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-foreground"
                            >
                                View GitHub Repository
                                <span aria-hidden="true">↗</span>
                            </a>
                        )}

                        {details?.externalUrl && (
                            <a
                                href={details.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-foreground"
                            >
                                Visit Project
                                <span aria-hidden="true">↗</span>
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Fixed panel footer */}
            {hasDetails && (
                <div className="shrink-0 border-t border-border bg-background/95 px-5 py-3">
                    <button
                        type="button"
                        onClick={() => {
                            contentRef.current?.scrollTo({
                                top: 0,
                                behavior: "instant",
                            });

                            setExpanded((current) => !current);
                        }}
                        className="flex w-full items-center justify-between gap-3 text-sm font-medium text-accent transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        <span>
                            {expanded ? "Show less" : "Explore details"}
                        </span>

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""
                                }`}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
