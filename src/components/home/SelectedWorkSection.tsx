
const featuredProjects = [
    {
        number: "01",
        category: "Applied AI / Machine Learning",
        title: "Manatee Call Detector",
        description:
            "A collaborative research application designed to detect manatee vocalizations in underwater audio recordings using signal processing and machine learning.",
        contribution:
            "Designed the Hidden Markov Model detection workflow, developed audio preprocessing and MFCC feature extraction, and contributed to Flask application integration.",
        technologies: [
            "Python",
            "Flask",
            "Librosa",
            "HMM",
            "Signal Processing",
        ],
        github:
            "https://github.com/Matf021/manatee-call-detection",
    },
    {
        number: "02",
        category: "Cloud / Backend Development",
        title: "AWS Voice Notes Organizer",
        description:
            "A serverless application that transforms recorded audio into searchable notes using automatic transcription and sentiment analysis.",
        contribution:
            "Built backend workflows connecting audio storage, transcription, and NLP services through AWS Chalice.",
        technologies: [
            "Python",
            "AWS Chalice",
            "Amazon S3",
            "Transcribe",
            "Comprehend",
        ],
        github:
            "https://github.com/Matf021/aws-voice-notes-organizer",
    },
    {
        number: "03",
        category: "Creative Engineering / 3D",
        title: "Interactive Developer Portfolio",
        description:
            "An immersive developer portfolio that turns projects, technologies, and skills into an interactive three-dimensional constellation.",
        contribution:
            "Developed cinematic camera navigation, interactive graph exploration, custom stellar shaders, and responsive interfaces.",
        technologies: [
            "Next.js",
            "TypeScript",
            "Three.js",
            "React Three Fiber",
            "GLSL",
        ],
        github: "https://github.com/Matf021/matias-portfolio",
    },
];

export default function SelectedWorkSection() {
    return (
        <section
            id="selected-work"
            aria-labelledby="selected-work-heading"
            className="relative px-5 pb-28 pt-12 sm:px-6 sm:pb-36 sm:pt-16"
        >
            <div className="mx-auto max-w-5xl">
                <div className="mb-16">
                    <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                        02 / Selected Work
                    </p>

                    <h2
                        id="selected-work-heading"
                        className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                    >
                        Ideas, brought to life.
                    </h2>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
                        A selection of projects exploring intelligent
                        systems, software architecture, and interactive
                        experiences.
                    </p>
                </div>

                <div className="border-t border-border">
                    {featuredProjects.map((project) => (
                        <article
                            key={project.number}
                            className="group grid gap-6 border-b border-border py-12 md:grid-cols-[100px_1fr] md:gap-10 md:py-16"
                        >
                            <div>
                                <span className="font-mono text-sm text-accent">
                                    {project.number}
                                </span>
                            </div>

                            <div>
                                <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-text-muted">
                                    {project.category}
                                </p>

                                <h3 className="text-3xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-4xl">
                                    {project.title}
                                </h3>

                                <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
                                    {project.description}
                                </p>

                                <div className="mt-8 max-w-2xl border-l-2 border-accent/30 pl-5">
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
                                    aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
                                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
                                >
                                    View Project on GitHub
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
