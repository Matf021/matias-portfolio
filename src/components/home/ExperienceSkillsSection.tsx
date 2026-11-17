
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
    },
    {
        year: "IB",
        title: "International Baccalaureate Diploma Programme",
        institution: "International Baccalaureate",
        credential: "IB Diploma",
        description:
            "Mathematics, independent research, Theory of Knowledge, Extended Essay, and CAS.",
    },
];

export default function ExperienceSkillsSection() {
    return (
        <section
            id="expertise"
            aria-labelledby="expertise-heading"
            className="relative px-5 py-24 sm:px-6 sm:py-32"
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

                        <article className="mt-8 border-l-2 border-accent/30 pl-5">
                            <p className="font-mono text-xs text-text-muted">
                                Apr – Sept 2025
                            </p>

                            <h4 className="mt-3 text-xl font-semibold text-foreground">
                                AI Student Researcher
                            </h4>

                            <p className="mt-1 text-sm text-accent">
                                WIMTACH
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                                Contributed to applied AI research
                                and collaborative software development,
                                working with data-processing and
                                machine-learning techniques.
                            </p>
                        </article>

                        <p className="mt-8 text-sm leading-relaxed text-text-muted">
                            My experience also includes working
                            in fast-paced hospitality environments,
                            developing communication, teamwork,
                            and adaptability.
                        </p>
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
                                className="grid gap-4 py-7 sm:grid-cols-[100px_1fr] sm:gap-8"
                            >
                                <span className="font-mono text-sm text-accent">
                                    {item.year}
                                </span>

                                <div>
                                    <h4 className="text-lg font-semibold text-foreground">
                                        {item.title}
                                    </h4>

                                    <p className="mt-2 text-sm text-text-secondary">
                                        {item.institution}
                                        {" · "}
                                        {item.credential}
                                    </p>

                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
                                        {item.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
