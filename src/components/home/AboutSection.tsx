
const focusAreas = [
    {
        number: "01",
        title: "Intelligent Systems",
        description:
            "Exploring machine learning, data processing, and applied AI to build solutions that solve meaningful problems.",
    },
    {
        number: "02",
        title: "Software Engineering",
        description:
            "Designing backend workflows, APIs, databases, and applications with attention to reliability and maintainability.",
    },
    {
        number: "03",
        title: "Creative Technology",
        description:
            "Combining programming, mathematics, and visual experimentation to create immersive interactive experiences.",
    },
];

export default function AboutSection() {
    return (
        <section
            id="introduction"
            aria-labelledby="introduction-heading"
            className="relative isolate overflow-hidden px-5 pb-32 pt-16 sm:px-6 sm:pb-40 sm:pt-20"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(138,184,255,0.07),transparent_72%)]"
            />

            <div className="mx-auto max-w-5xl">
                <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    01 / Beyond the Constellation
                </p>

                <h2
                    id="introduction-heading"
                    className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                >
                    Curiosity is where
                    <br />
                    everything begins.
                </h2>

                <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
                    <div className="space-y-5 text-base leading-relaxed text-text-secondary sm:text-lg">
                        <p>
                            I&apos;m a software engineering graduate specializing
                            in artificial intelligence, with a passion for
                            building systems that are both technically capable
                            and thoughtfully designed.
                        </p>

                        <p>
                            My work spans machine learning, backend
                            development, cloud technologies, and interactive
                            applications. I enjoy understanding how things
                            work, experimenting with new approaches, and
                            refining ideas until they become something
                            meaningful.
                        </p>
                    </div>

                    <div className="border-l border-accent/25 pl-5">
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                            How I approach development
                        </p>

                        <p className="mt-4 text-lg leading-relaxed text-foreground/85">
                            I see engineering and creativity as complementary
                            disciplines: One gives ideas structure, the other
                            pushes what they can become.
                        </p>
                    </div>
                </div>

                <div className="mt-16 grid gap-4 sm:grid-cols-3">
                    {focusAreas.map((area) => (
                        <article
                            key={area.number}
                            className="rounded-xl border border-border/70 bg-surface/25 p-6 transition-colors duration-300 hover:border-accent/35 hover:bg-surface/40"
                        >
                            <span className="font-mono text-xs text-accent">
                                {area.number}
                            </span>

                            <h3 className="mt-5 text-lg font-semibold text-foreground">
                                {area.title}
                            </h3>

                            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                                {area.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
