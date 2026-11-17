
const skillGroups = [
    {
        title: "Languages & Development",
        skills: [
            "Python",
            "TypeScript",
            "JavaScript",
            "SQL",
            "React",
            "Next.js",
        ],
    },
    {
        title: "AI & Data",
        skills: [
            "Machine Learning",
            "NLP",
            "Signal Processing",
            "Data Analysis",
            "Power BI",
        ],
    },
    {
        title: "Cloud & Infrastructure",
        skills: [
            "AWS",
            "REST APIs",
            "Docker",
            "Git",
            "Linux",
            "PostgreSQL",
        ],
    },
    {
        title: "Creative Engineering",
        skills: [
            "Three.js",
            "React Three Fiber",
            "GLSL",
            "3D Visualization",
            "Interactive Graphics",
        ],
    },
];

const education = [
    {
        year: "2025",
        title: "Software Engineering Technology – Artificial Intelligence",
        institution: "Centennial College",
        credential: "Advanced Diploma",
        description:
            "Software development, artificial intelligence, databases, and cloud technologies.",
        highlights: [
            "GPA: 4.1 / 4.5",
            "Advanced Machine Learning",
            "Natural Language Processing",
            "Database Systems & Cloud Computing",
        ],
    },
    {
        year: "IB",
        title: "International Baccalaureate Diploma Programme",
        institution: "International Baccalaureate",
        credential: "IB Diploma",
        description:
            "An interdisciplinary academic foundation emphasizing mathematics, critical thinking, and independent research.",
        highlights: [
            "Mathematics",
            "Extended Essay",
            "Theory of Knowledge",
            "Creativity, Activity, Service",
        ],
    },
];

export default function ExperienceSkillsSection() {
    return (
        <section
            id="expertise"
            aria-labelledby="expertise-heading"
            className="relative px-5 pb-24 pt-8 sm:px-6 sm:pb-28 sm:pt-10"
        >
            <div className="mx-auto max-w-5xl">
                <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    03 / Experience & Expertise
                </p>

                <h2
                    id="expertise-heading"
                    className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                >
                    The foundation behind the work.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
                    Combining hands-on development, applied
                    research, and continuous exploration
                    across software, AI, and creative technology.
                </p>

                <div className="mt-16 grid gap-14 border-t border-border pt-12 lg:grid-cols-2 lg:gap-16">

                    {/* Experience */}
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                            Experience
                        </h3>

                        <div className="mt-8 space-y-10">
                            <article className="border-l-2 border-accent/30 pl-5">
                                <p className="font-mono text-xs text-text-muted">
                                    Apr – Sep 2025
                                </p>

                                <h4 className="mt-3 text-xl font-semibold text-foreground">
                                    Junior AI Researcher
                                </h4>

                                <p className="mt-1 text-sm text-accent">
                                    WIMTACH · Centennial College
                                </p>

                                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                                    Developed Python and Flask workflows for marine mammal
                                    vocalization detection, connecting audio preprocessing,
                                    machine learning, REST APIs, and a user-facing application.
                                </p>

                                <div className="mt-5 space-y-3 border-t border-border/50 pt-4">
                                    <p className="text-sm leading-relaxed text-text-secondary">
                                        <span className="font-medium text-foreground">
                                            Research outcome:
                                        </span>{" "}
                                        Contributed to a classification system achieving
                                        approximately 96% test accuracy.
                                    </p>

                                    <p className="text-sm leading-relaxed text-text-secondary">
                                        <span className="font-medium text-foreground">
                                            Collaboration:
                                        </span>{" "}
                                        Worked with researchers on model evaluation,
                                        application integration, and technical documentation.
                                    </p>
                                </div>
                            </article>

                            <article className="border-l-2 border-border pl-5">
                                <p className="font-mono text-xs text-text-muted">
                                    Aug 2024 – Present
                                </p>

                                <h4 className="mt-3 text-xl font-semibold text-foreground">
                                    Junior Bartender
                                </h4>

                                <p className="mt-1 text-sm text-accent">
                                    Bar Banane · Toronto
                                </p>

                                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                                    Work in a high-volume fine-dining environment where
                                    accuracy, prioritization, teamwork, and effective
                                    communication are essential.
                                </p>

                                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                                    Coordinate across teams, resolve operational
                                    challenges, and maintain consistent execution
                                    under pressure.
                                </p>
                            </article>
                        </div>
                    </div>
                    {/* Skills */}
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                            Technical Toolkit
                        </h3>

                        <div className="mt-8 space-y-6">
                            {skillGroups.map((group) => (
                                <div key={group.title}>
                                    <h4 className="text-sm font-medium text-foreground">
                                        {group.title}
                                    </h4>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {group.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md border border-border/70 bg-surface/25 px-3 py-1.5 font-mono text-xs text-text-secondary"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="mt-20 border-t border-border pt-12">
                    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                        Education
                    </h3>

                    <div className="mt-8 divide-y divide-border/70">
                        {education.map((item) => (
                            <article
                                key={item.title}
                                className="grid gap-5 py-8 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[96px_minmax(0,1.3fr)_minmax(0,0.8fr)]"
                            >
                                <span className="font-mono text-sm text-accent">
                                    {item.year}
                                </span>

                                <div className="min-w-0">
                                    <h4 className="text-lg font-semibold text-foreground">
                                        {item.title}
                                    </h4>

                                    <p className="mt-2 text-sm text-text-secondary">
                                        {item.institution} · {item.credential}
                                    </p>

                                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="border-l border-accent/20 pl-4 sm:col-start-2 lg:col-start-3">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                                        Academic Highlights
                                    </p>

                                    <div className="mt-3 space-y-2">
                                        {item.highlights.map((highlight) => (
                                            <p
                                                key={highlight}
                                                className="text-xs leading-relaxed text-text-secondary"
                                            >
                                                {highlight}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
