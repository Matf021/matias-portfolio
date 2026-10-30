export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Small introductory label */}
        <p className="mb-6 font-mono text-sm uppercase tracking-[0.25em] text-accent">
          Software Developer / Toronto, Canada
        </p>

        {/* Primary heading */}
        <h1 className="max-w-4xl text-6xl font-semibold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          Matias
          <br />
          Franco<span className="text-accent">.</span>
        </h1>

        {/* Supporting description */}
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
          I build intelligent systems and interactive experiences,
          turning curiosity into code.
        </p>

        {/* Navigation buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Explore My Work
          </a>

          <a
            href="https://github.com/Matf021"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface"
          >
            GitHub ↗
          </a>
        </div>

        {/* Future constellation placeholder */}
        <div
          className="mt-16 flex h-48 items-center justify-center rounded-2xl border border-border bg-surface/40 sm:h-64"
          aria-label="Interactive constellation coming soon"
        >
          <p className="font-mono text-sm tracking-widest text-text-muted">
            [ CONSTELLATION SYSTEM / INITIALIZING ]
          </p>
        </div>
      </div>
    </main>
  );
}