
"use client";

import {
    forwardRef,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import {
    Network,
    ChevronDown,
    X,
} from "lucide-react";

import type {
    ConstellationNodeData,
    ConstellationEdge,
    NodeCategory,
} from "@/types/constellation";

import { getNodeRelationships } from "@/lib/graph";

export type KeyboardExplorerHandle = {
    focusTrigger: () => void;
};

type Props = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    edges: ConstellationEdge[];
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
    edges,
}, ref) {

    const [open, setOpen] = useState(false);

    const [expandedCategories, setExpandedCategories] =
        useState<Set<NodeCategory>>(
            () => new Set(["discipline"])
        );

    function toggleCategory(category: NodeCategory) {
        setExpandedCategories((previous) => {
            const next = new Set(previous);

            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }

            return next;
        });
    }


    const selectedNode = selectedId
        ? nodes.find((node) => node.id === selectedId)
        : null;

    const relatedNodes = selectedId
        ? (() => {
            const relationships = getNodeRelationships(
                selectedId,
                nodes,
                edges
            );

            return nodes.filter(
                (node) => relationships.all.has(node.id)
            );
        })()
        : [];


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
                aria-label="Explore constellation"
                onClick={() => setOpen((current) => !current)}
                className="
                    flex items-center gap-2
                    rounded-lg
                    border border-white/10
                    bg-[#081120]/65
                    px-3 py-2
                    text-xs font-medium
                    text-[#a9bddb]
                    backdrop-blur-md
                    transition-all duration-200
                    hover:border-white/25
                    hover:bg-[#101d33]/85
                    hover:text-white
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-blue-400
                "
            >
                <Network size={14} aria-hidden="true" />

                <span>Explore</span>

                <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={`
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
        `}
                />
            </button>


            {open && (
                <div
                    id={panelId}

                    className="
                        absolute left-0 top-12
                        w-[min(85vw,20rem)]
                        max-h-[min(65svh,420px)]
                        overflow-y-auto
                        rounded-xl
                        border border-white/10
                        bg-[#081120]/95
                        p-4
                        shadow-2xl
                        backdrop-blur-xl
                    "
                >
                    <div className="mb-4 flex items-center justify-between gap-3">

                        <h2 className="text-sm font-semibold text-foreground">
                            Constellation Explorer
                        </h2>

                        <button
                            type="button"
                            onClick={closeExplorer}
                            className="
                                rounded-md p-1.5
                                text-[#a9bddb]
                                transition-colors
                                hover:bg-white/10
                                hover:text-white
                                focus-visible:outline-2
                                focus-visible:outline-blue-400
                            "
                            aria-label="Close constellation explorer"
                        >
                            <X size={16} aria-hidden="true" />
                        </button>

                    </div>


                    {selectedNode && relatedNodes.length > 0 && (
                        <section
                            aria-label={`Connections for ${selectedNode.label}`}
                            className="
            mb-4 rounded-lg
            border border-white/10
            bg-white/[0.035]
            p-3
        "
                        >
                            <p className="
            mb-1 text-[10px]
            font-semibold uppercase
            tracking-[0.16em]
            text-[#8ea9ce]
        ">
                                Currently exploring
                            </p>

                            <p className="mb-3 text-sm font-medium text-white">
                                {selectedNode.label}
                            </p>

                            <p className="
            mb-2 text-[10px]
            font-semibold uppercase
            tracking-[0.16em]
            text-[#8ea9ce]
        ">
                                Related nodes
                            </p>

                            <div className="space-y-1">
                                {relatedNodes.map((node) => (
                                    <button
                                        key={node.id}
                                        type="button"
                                        onClick={() => selectNode(node.id)}
                                        className="
                        flex w-full items-center
                        gap-2 rounded-md
                        px-2 py-2 text-left
                        text-xs text-[#b6c9e8]
                        transition-colors
                        hover:bg-white/10
                        hover:text-white
                        focus-visible:outline-2
                        focus-visible:outline-blue-400
                    "
                                    >
                                        <span
                                            className="
                            h-2 w-2 shrink-0
                            rounded-full
                        "
                                            style={{
                                                backgroundColor: node.color,
                                            }}
                                            aria-hidden="true"
                                        />

                                        <span className="min-w-0 flex-1">
                                            {node.label}
                                        </span>

                                        <span className="
                        shrink-0 text-[10px]
                        capitalize text-[#7892b5]
                    ">
                                            {node.category}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}



                    <div className="space-y-2">
                        {categories.map((category) => {
                            const categoryNodes = nodes.filter(
                                (node) => node.category === category.id
                            );

                            if (categoryNodes.length === 0) {
                                return null;
                            }

                            const expanded = expandedCategories.has(
                                category.id
                            );

                            const categoryPanelId =
                                `${panelId}-${category.id}`;

                            return (
                                <section
                                    key={category.id}
                                    className="
                                        border-b border-white/10
                                        pb-2 last:border-b-0
                                    "
                                >
                                    <h3>
                                        <button
                                            type="button"
                                            aria-expanded={expanded}
                                            aria-controls={categoryPanelId}
                                            onClick={() =>
                                                toggleCategory(category.id)
                                            }
                                            className="
                                                flex w-full items-center
                                                justify-between gap-3
                                                rounded-md px-2 py-2
                                                text-left text-xs
                                                font-semibold uppercase
                                                tracking-wider
                                                text-[#b6c9e8]
                                                transition-colors
                                                hover:bg-white/5
                                                hover:text-white
                                                focus-visible:outline-2
                                                focus-visible:outline-blue-400
                                            "
                                        >
                                            <span>{category.label}</span>

                                            <ChevronDown
                                                size={14}
                                                aria-hidden="true"
                                                className={`
                                                    shrink-0
                                                    transition-transform
                                                    duration-200
                                                    ${expanded
                                                        ? "rotate-180"
                                                        : ""
                                                    }
                                                `}
                                            />
                                        </button>
                                    </h3>

                                    <div
                                        id={categoryPanelId}
                                        hidden={!expanded}
                                        className="mt-1 space-y-1"
                                    >
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
                                                    gap-2 rounded-md
                                                    px-2 py-2
                                                    text-left text-sm
                                                    text-[#a9bddb]
                                                    transition-colors
                                                    hover:bg-white/10
                                                    hover:text-white
                                                    focus-visible:outline-2
                                                    focus-visible:outline-blue-400
                                                    aria-current:bg-white/10
                                                    aria-current:text-white
                                                "
                                            >
                                                <span
                                                    className="
                                                        h-2 w-2 shrink-0
                                                        rounded-full
                                                    "
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
