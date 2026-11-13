import CinematicHero from "@/components/home/CinematicHero";

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-clip">
      {/* D.6 — Immersive hero */}
      {/* D.6.3A — Integrated cinematic hero */}
      <CinematicHero />
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