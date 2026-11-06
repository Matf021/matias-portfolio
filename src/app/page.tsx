import ConstellationViewer from "@/components/constellation/ConstellationViewer";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-0 flex-col items-center px-5 py-12 sm:px-6 sm:py-16 lg:justify-center lg:py-20">
      <div className="min-w-0 w-full max-w-5xl">
        {/* Small introductory label */}
        <p className="mb-5 max-w-full text-xs font-mono uppercase leading-relaxed tracking-[0.18em] text-accent sm:mb-6 sm:text-sm sm:tracking-[0.25em]">
          Software Developer / Toronto, Canada
        </p>

        {/* Primary heading */}
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          Matias
          <br />
          Franco<span className="text-accent">.</span>
        </h1>

        {/* Supporting description */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:mt-8 sm:text-xl">
          I build intelligent systems and interactive experiences,
          turning curiosity into code.
        </p>

        {/* Navigation buttons */}
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

        {/* Future constellation placeholder */}
        <div
          className="mt-12 h-[min(65svh,560px)] min-h-[400px] w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface/20 sm:mt-16 sm:h-[520px]"
          aria-label="Interactive 3D constellation representing software development disciplines"
        >
          <ConstellationViewer />
        </div>
      </div>
    </main>
  );
}