"use client";

import dynamic from "next/dynamic";

const ConstellationScene = dynamic(
  () => import("./ConstellationScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-sm tracking-widest text-text-muted">
          INITIALIZING CONSTELLATION...
        </p>
      </div>
    ),
  }
);

export default function ConstellationViewer() {
  return <ConstellationScene />;
}