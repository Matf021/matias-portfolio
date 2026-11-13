"use client";

import dynamic from "next/dynamic";

type ConstellationViewerProps = {
    onSelectionChange?: (hasSelection: boolean) => void;
    onActivateExplorer?: () => void;
    resetRequest?: number;
};

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

export default function ConstellationViewer({
    onSelectionChange,
    onActivateExplorer,
    resetRequest = 0,
}: ConstellationViewerProps) {
    return (
        <ConstellationScene
            onSelectionChange={onSelectionChange}
            onActivateExplorer={onActivateExplorer}
            resetRequest={resetRequest}
        />
    );
}