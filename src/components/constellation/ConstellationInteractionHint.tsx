
"use client";

import { MousePointer2, Rotate3D } from "lucide-react";

type ConstellationInteractionHintProps = {
    dismissed: boolean;
};

export default function ConstellationInteractionHint({
    dismissed,
}: ConstellationInteractionHintProps) {
    return (
        <div
            aria-hidden="true"
            className={`
                pointer-events-none
                absolute bottom-7 left-1/2 z-10
                -translate-x-1/2
                flex items-center gap-3
                whitespace-nowrap
                rounded-full
                border border-white/10
                bg-[#081120]/70
                px-4 py-2
                text-xs tracking-wide
                text-[#b6c9e8]
                backdrop-blur-md
                transition-opacity duration-700
                motion-reduce:transition-none
                ${
                    dismissed
                        ? "opacity-0"
                        : "opacity-100"
                }
            `}
        >
            <span className="flex items-center gap-1.5">
                <MousePointer2 size={13} />
                Click a node to explore
            </span>

            <span className="h-3 w-px bg-white/20" />

            <span className="flex items-center gap-1.5">
                <Rotate3D size={14} />
                Drag to orbit
            </span>
        </div>
    );
}
