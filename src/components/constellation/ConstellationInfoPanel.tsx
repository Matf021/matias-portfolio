
"use client";

import { useEffect, useRef, useState } from "react";
import { constellationDetails } from "@/data/constellationDetails";

import type { ConstellationNodeData } from "@/types/constellation";
import RelatedNodeSection from "./RelatedNodeSection";

type Props = {
    node: ConstellationNodeData;
    relatedNodes: ConstellationNodeData[];
    featuredProjects: ConstellationNodeData[];
    onNavigate: (
        id: string,
        fromKeyboard: boolean
    ) => void;
    onClose: () => void;
    focusHeading?: boolean;
};

export default function ConstellationInfoPanel({
    node,
    relatedNodes,
    onNavigate,
    focusHeading = false,
    onClose,
    featuredProjects,
}: Props) {
    const [expanded, setExpanded] = useState(false);

    const details = constellationDetails[node.id];
    const relatedProjects = relatedNodes.filter(
        (related) => related.category === "project"
    );

    const relatedDisciplines = relatedNodes.filter(
        (related) => related.category === "discipline"
    );

    const relatedTechnologies = relatedNodes.filter(
        (related) => related.category === "technology"
    );

    // const exploreNext = [
    //     ...relatedProjects,
    //     ...relatedDisciplines,
    //     ...relatedTechnologies,
    // ].slice(0, 2);

    const accentStyle = {
        "--panel-accent": node.color,
    } as React.CSSProperties;

    const contentRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const hasDetails = Boolean(
        relatedNodes.length > 0 ||
        (
            details &&
            (
                details.summary ||
                details.highlights?.length ||
                details.technologies?.length ||
                details.relatedProjects?.length ||
                details.repositoryUrl ||
                details.externalUrl
            )
        )
    );

    useEffect(() => {
        if (focusHeading) {
            headingRef.current?.focus({
                preventScroll: true,
            });
        }
    }, [focusHeading]);

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

                        <h3
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-lg font-semibold text-foreground"
                        >
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

                {node.category === "identity" && featuredProjects.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                        <RelatedNodeSection
                            title="Featured Projects"
                            nodes={featuredProjects}
                            onNavigate={onNavigate}
                        />
                    </div>
                )}

                {/* 
                {exploreNext.length > 0 && (
                    <section
                        aria-label="Suggested constellation destinations"
                        className="mt-4 border-t border-border pt-3"
                    >
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                                Explore Next
                            </h4>

                            <span className="font-mono text-[10px] text-text-secondary">
                                {relatedNodes.length} connections
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {exploreNext.map((destination) => (
                                <button
                                    key={destination.id}
                                    type="button"
                                    onClick={() => onNavigate(destination.id)}
                                    className="
                        group flex min-h-14 min-w-0
                        items-center justify-between gap-2
                        rounded-md border border-border
                        bg-surface/40 px-2.5 py-2
                        text-left transition-colors
                        hover:border-white/25
                        hover:bg-surface
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-accent
                    "
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: destination.color,
                                                boxShadow: `0 0 8px ${destination.color}55`,
                                            }}
                                            aria-hidden="true"
                                        />

                                        <span className="text-xs leading-snug text-text-secondary transition-colors group-hover:text-foreground">
                                            {destination.label}
                                        </span>
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="shrink-0 text-xs text-text-secondary transition-transform group-hover:translate-x-0.5"
                                    >
                                        ↗
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )} */}

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


                        <RelatedNodeSection
                            title="Related Projects"
                            nodes={relatedProjects}
                            onNavigate={onNavigate}
                        />

                        <RelatedNodeSection
                            title="Related Disciplines"
                            nodes={relatedDisciplines}
                            onNavigate={onNavigate}
                        />

                        <RelatedNodeSection
                            title="Related Technologies"
                            nodes={relatedTechnologies}
                            onNavigate={onNavigate}
                        />


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
