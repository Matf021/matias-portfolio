import ConstellationViewer from "@/components/constellation/ConstellationViewer";

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-clip">
      {/* D.6 — Immersive hero */}
      {/* D.6.3A — Integrated cinematic hero */}
      <section
        id="home"
        aria-labelledby="hero-heading"
        className="relative isolate min-h-svh overflow-hidden bg-background"
      >
        {/* Full-bleed constellation */}
        <div
          className="
      relative h-[680px] min-h-[100svh] w-full
      sm:h-[760px]
      lg:h-[100svh]
    "
        >
          <div
            className="absolute inset-0"
            aria-label="Interactive 3D constellation of projects and disciplines"
          >
            <ConstellationViewer />
          </div>

          {/* Readability gradient — does not intercept pointer events */}
          <div
            aria-hidden="true"
            className="
        pointer-events-none absolute inset-0 z-[1]
        bg-gradient-to-r
        from-background/95
        via-background/65
        to-transparent
        lg:via-background/25
      "
          />

          {/* Hero introduction */}
          <div
            className="
        pointer-events-none absolute inset-0 z-[2]
        flex items-start
        px-5 pt-24
        sm:px-8 sm:pt-28
        lg:items-center lg:px-12 lg:pt-0
        xl:px-20
      "
          >
            <div className="w-full max-w-[440px]">
              <p
                className="
            mb-5 font-mono text-xs uppercase
            leading-relaxed tracking-[0.18em]
            text-accent
          "
              >
                Software Developer / Toronto, Canada
              </p>

              <h1
                id="hero-heading"
                className="
            text-5xl font-semibold
            leading-[1.05] tracking-tight
            text-foreground
            sm:text-6xl
            xl:text-7xl
          "
              >
                Matias
                <br />
                Franco<span className="text-accent">.</span>
              </h1>

              <p
                className="
            mt-6 max-w-sm text-base
            leading-relaxed text-text-secondary
            sm:text-lg
          "
              >
                I build intelligent systems and interactive
                experiences, turning curiosity into code.
              </p>

              <div
                className="
            pointer-events-auto mt-8
            flex flex-wrap gap-3
          "
              >
                <a
                  href="#introduction"
                  className="
              rounded-lg bg-accent px-5 py-3
              font-medium text-background
              transition-colors hover:bg-accent-hover
            "
                >
                  Discover My Work
                </a>

                <a
                  href="https://github.com/Matf021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
              rounded-lg border border-border
              bg-background/40 px-5 py-3
              font-medium text-foreground
              backdrop-blur-sm transition-colors
              hover:bg-surface
            "
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>

          {/* Scroll discovery */}
          <a
            href="#introduction"
            aria-label="Scroll to introduction"
            className="
        group absolute bottom-8 left-1/2 z-[3]
        flex -translate-x-1/2 flex-col
        items-center gap-2
        text-text-muted transition-colors
        hover:text-accent
      "
          >
            <span
              className="
          whitespace-nowrap font-mono
          text-[10px] uppercase tracking-[0.3em]
        "
            >
              Scroll to explore
            </span>

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="
          transition-transform duration-300
          group-hover:translate-y-1
        "
            >
              <path d="M12 4v16M5 13l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>
      {/* D.6.2A — Atmospheric bridge */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative h-28 overflow-hidden sm:h-36"
      >
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(ellipse_at_50%_100%,rgba(138,184,255,0.09),transparent_70%)]
          "
        />

        <div
          className="
            absolute inset-x-0 bottom-0 h-px
            bg-gradient-to-r from-transparent via-accent/15 to-transparent
          "
        />
      </div>

      {/* D.6 — Atmospheric transition prototype */}
      <section
        id="introduction"
        aria-labelledby="introduction-heading"
        className="relative isolate overflow-hidden px-5 pb-32 pt-16 sm:px-6 sm:pb-40 sm:pt-20"
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]
            bg-[radial-gradient(ellipse_at_50%_0%,rgba(138,184,255,0.07),transparent_72%)]
          "
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