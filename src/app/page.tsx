import CinematicHero from "@/components/home/CinematicHero";
import AboutSection from "@/components/home/AboutSection";

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
      <AboutSection />
    </main>
  );
}