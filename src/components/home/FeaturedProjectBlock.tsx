
import type { ReactNode } from "react";

export type FeaturedProject = {
    number: string;
    category: string;
    title: string;
    description: string;
    contribution: string;
    contributionLabel?: string;
    technologies: string[];
    github: string;
};

type Props = {
    project: FeaturedProject;
    visual?: ReactNode;
};

export default function FeaturedProjectBlock({
    project,
    visual,
}: Props) {

    return (
        <article
            className="
            grid gap-6 border-b border-border
            py-9
            sm:gap-8 sm:py-12
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
            lg:items-center lg:gap-x-12 lg:gap-y-5 lg:py-16
        "
        >
            {/* Project description */}
            <div className="min-w-0">
                <p className="font-mono text-sm text-accent">
                    {project.number}
                </p>

                <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-text-muted sm:mt-6">
                    {project.category}
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:mt-4 sm:text-4xl">
                    {project.title}
                </h3>

                <p className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6">
                    {project.description}
                </p>

                <div className="mt-6 border-l-2 border-accent/30 pl-4 sm:mt-8 sm:pl-5">
                    <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
                        {project.contributionLabel ?? "My Contribution"}
                    </p>

                    <p className="text-sm leading-relaxed text-text-secondary">
                        {project.contribution}
                    </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                    {project.technologies.map((technology) => (
                        <span
                            key={technology}
                            className="rounded-full border border-border bg-surface/35 px-3 py-1.5 font-mono text-xs text-text-secondary"
                        >
                            {technology}
                        </span>
                    ))}
                </div>
            </div>

            {/* Visualization followed by source link */}
            <div className="min-w-0">
                {visual && <div>{visual}</div>}

                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                    mt-5 inline-flex min-h-11
                    items-center gap-2 rounded-md
                    text-sm font-medium text-accent
                    transition-colors
                    hover:text-foreground
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-accent
                "
                    aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
                >
                    View Project on GitHub
                    <span aria-hidden="true">↗</span>
                </a>
            </div>
        </article>
    );
}
