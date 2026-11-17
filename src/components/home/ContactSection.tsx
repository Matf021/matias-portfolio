
const email = "matias.fyion@gmail.com";

export default function ContactSection() {
    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative px-5 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-8"
        >
            <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    04 / Let&apos;s Connect
                </p>

                <h2
                    id="contact-heading"
                    className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                >
                    Let&apos;s build what
                    <br />
                    comes <span className="text-accent">next.</span>
                </h2>

                <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
                    I&apos;m interested in opportunities to build
                    meaningful software, explore intelligent systems,
                    and create engaging digital experiences.
                    Whether you&apos;re looking for an engineer
                    or have an interesting idea, I&apos;d love to connect.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                    <a
                        href={`mailto:${email}?subject=Let's%20Connect`}
                        className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        Get in touch
                        <span aria-hidden="true" className="ml-3">
                            ↗
                        </span>
                    </a>

                    <a
                        href="https://github.com/Matf021"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-surface/25 px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        Explore GitHub
                        <span aria-hidden="true" className="ml-3">
                            ↗
                        </span>
                    </a>
                </div>

                <div className="mt-10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                        Prefer email?
                    </p>

                    <a
                        href={`mailto:${email}`}
                        className="mt-2 inline-block break-all text-sm text-accent transition-colors hover:text-foreground"
                    >
                        {email}
                    </a>
                </div>

                {/* Footer */}
                <footer className="mt-12 flex flex-col gap-4 border-t border-border/70 pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Matias Franco
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                            Software Engineering & Creative Technology
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 font-mono text-xs text-text-muted">
                        <a
                            href="#home"
                            className="transition-colors hover:text-accent"
                        >
                            Back to the stars ↑
                        </a>

                        <a
                            href="https://github.com/Matf021"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-accent"
                        >
                            GitHub ↗
                        </a>
                    </div>
                </footer>
            </div>
        </section>
    );
}
