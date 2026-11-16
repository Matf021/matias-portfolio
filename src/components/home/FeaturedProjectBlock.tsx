
import type { ReactNode } from "react";

export type FeaturedProject = {
    number: string;
    category: string;
    title: string;
    description: string;
    contribution: string;
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
        <article className="grid gap-8 border-b border-border py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-20">
            <div className="min-w-0">
                <p className="font-mono text-sm text-accent">
                    {project.number}
                </p>

                <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
                    {project.category}
                </p>

                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {project.title}
                </h3>

                <p className="mt-6 text-base leading-relaxed text-text-secondary">
                    {project.description}
                </p>

                <div className="mt-8 border-l-2 border-accent/30 pl-5">
                    <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
                        My Contribution
                    </p>

                    <p className="text-sm leading-relaxed text-text-secondary">
                        {project.contribution}
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                        <span
                            key={technology}
                            className="rounded-full border border-border bg-surface/35 px-3 py-1.5 font-mono text-xs text-text-secondary"
                        >
                            {technology}
                        </span>
                    ))}
                </div>

                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
                    aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
                >
                    View Project on GitHub
                    <span aria-hidden="true">↗</span>
                </a>
            </div>

            {visual && (
                <div className="min-w-0">
                    {visual}
                </div>
            )}
        </article>
    );
}
