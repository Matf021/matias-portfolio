import { Mail } from "lucide-react";
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
                    {/* Email */}
                    <a
                        href={`mailto:${email}?subject=Let's%20Connect`}
                        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        <Mail size={18} strokeWidth={2} aria-hidden="true" />
                        Get in touch
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/matias-franco-605303273"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile (opens in a new tab)"
                        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-border bg-surface/25 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                        </svg>
                        LinkedIn
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/Matf021"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile (opens in a new tab)"
                        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-border bg-surface/25 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 .297a12 12 0 0 0-3.793 23.386c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.333-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23A11.52 11.52 0 0 1 12 5.803c1.019.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.806 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
                        </svg>
                        GitHub
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
