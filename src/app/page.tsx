import ConstellationViewer from "@/components/constellation/ConstellationViewer";

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-clip">
      {/* D.6 — Immersive hero */}
      <section
        id="home"
        aria-labelledby="hero-heading"
        className="flex min-h-screen min-w-0 flex-col items-center px-5 py-12 sm:px-6 sm:py-16 lg:justify-center lg:py-20"
      >
        <div className="w-full min-w-0 max-w-5xl">
          <p className="mb-5 font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-accent sm:mb-6 sm:text-sm sm:tracking-[0.25em]">
            Software Developer / Toronto, Canada
          </p>

          <h1
            id="hero-heading"
            className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          >
            Matias
            <br />
            Franco<span className="text-accent">.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:mt-8 sm:text-xl">
            I build intelligent systems and interactive experiences,
            turning curiosity into code.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
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

          <div
            className="mt-12 h-[min(65svh,560px)] min-h-[400px] w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface/20 sm:mt-16 sm:h-[520px]"
            aria-label="Interactive 3D constellation representing software development disciplines"
          >
            <ConstellationViewer />
          </div>
        </div>
      </section>

      {/* D.6 — Atmospheric transition prototype */}
      <section
        id="introduction"
        aria-labelledby="introduction-heading"
        className="relative isolate overflow-hidden px-5 pb-32 pt-32 sm:px-6 sm:pb-40 sm:pt-40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_50%_0%,rgba(138,184,255,0.10),transparent_70%)]"
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

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            I enjoy exploring complex ideas and turning them into
            thoughtful, functional experiences. From intelligent
            systems to interactive worlds, I approach development
            as both an engineering challenge and a creative process.
          </p>
        </div>
      </section>
    </main>
  );
}