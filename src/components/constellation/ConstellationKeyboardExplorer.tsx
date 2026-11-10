
"use client";

import {
    forwardRef,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import type {
    ConstellationNodeData,
    NodeCategory,
} from "@/types/constellation";

export type KeyboardExplorerHandle = {
    focusTrigger: () => void;
};

type Props = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

const categories: {
    id: NodeCategory;
    label: string;
}[] = [
        { id: "identity", label: "Identity" },
        { id: "discipline", label: "Disciplines" },
        { id: "project", label: "Projects" },
        { id: "technology", label: "Technologies" },
    ];

const ConstellationKeyboardExplorer = forwardRef<
    KeyboardExplorerHandle,
    Props
>(function ConstellationKeyboardExplorer({
    nodes,
    selectedId,
    onSelect,
}, ref) {

    const [open, setOpen] = useState(false);
    const panelId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => ({
        focusTrigger() {
            triggerRef.current?.focus();
        },
    }), []);

    function closeExplorer() {
        setOpen(false);
        triggerRef.current?.focus();
    }

    function selectNode(id: string) {
        setOpen(false);
        onSelect(id);
    }

    return (

        <div
            className="absolute left-4 top-4 z-20"
            onKeyDown={(event) => {
                if (event.key === "Escape" && open) {
                    event.stopPropagation();
                    closeExplorer();
                }
            }}
        >


            <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((current) => !current)}

                className="
                    sr-only
                    focus:not-sr-only
                    focus:absolute
                    focus:left-0
                    focus:top-0
                    focus:z-30
                    focus:whitespace-nowrap
                    focus:rounded-md
                    focus:border
                    focus:border-border
                    focus:bg-background
                    focus:px-3
                    focus:py-2
                    focus:text-sm
                    focus:text-foreground
                    focus:shadow-lg
                    focus-visible:outline-2
                    focus-visible:outline-accent
                "
            >
                Explore constellation by keyboard
            </button>

            {open && (
                <div
                    id={panelId}
                    className="
                        absolute left-0 top-14
                        w-[min(85vw,20rem)]
                        max-h-[65svh]
                        overflow-y-auto rounded-xl
                        border border-border
                        bg-background/95 p-4
                        shadow-2xl backdrop-blur-md
                    "
                >
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            Constellation Explorer
                        </h2>

                        <button
                            type="button"
                            onClick={closeExplorer}
                            className="rounded px-2 py-1 text-text-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                            aria-label="Close constellation explorer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        {categories.map((category) => {
                            const categoryNodes = nodes.filter(
                                (node) =>
                                    node.category === category.id
                            );

                            if (categoryNodes.length === 0) {
                                return null;
                            }

                            return (
                                <section key={category.id}>
                                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        {category.label}
                                    </h3>

                                    <div className="space-y-1">
                                        {categoryNodes.map((node) => (
                                            <button
                                                key={node.id}
                                                type="button"
                                                aria-current={
                                                    selectedId === node.id
                                                        ? "true"
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    selectNode(node.id)
                                                }
                                                className="
                                                    flex w-full items-center
                                                    gap-2 rounded-md px-2 py-2
                                                    text-left text-sm
                                                    text-text-secondary
                                                    hover:bg-surface
                                                    hover:text-foreground
                                                    focus-visible:outline-2
                                                    focus-visible:outline-accent
                                                    aria-current:bg-surface
                                                    aria-current:text-foreground
                                                "
                                            >
                                                <span
                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            node.color,
                                                    }}
                                                    aria-hidden="true"
                                                />

                                                {node.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
});

export default ConstellationKeyboardExplorer;
