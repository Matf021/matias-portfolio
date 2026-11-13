
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
    close: () => void;
};

type Props = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    edges: ConstellationEdge[];
    onActivateExplorer?: () => void;
};

const categories: {
    id: NodeCategory;
    label: string;
}[] = [
        { id: "discipline", label: "Disciplines" },
        { id: "project", label: "Projects" },
        { id: "technology", label: "Technologies" },
        { id: "identity", label: "Identity" },
    ];

const ConstellationKeyboardExplorer = forwardRef<
    KeyboardExplorerHandle,
    Props
>(function ConstellationKeyboardExplorer({
    nodes,
    selectedId,
    onSelect,
    edges,
    onActivateExplorer,
}, ref) {

    const [open, setOpen] = useState(false);

    const [relatedExpanded, setRelatedExpanded] =
        useState(true);

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

    const relatedGroups = categories
        .map((category) => ({
            ...category,
            nodes: relatedNodes.filter(
                (node) => node.category === category.id
            ),
        }))
        .filter((group) => group.nodes.length > 0);


    function getRelationshipDescription(
        relatedId: string
    ): string | undefined {
        if (!selectedId) {
            return undefined;
        }

        const edge = edges.find(
            (edge) =>
                (edge.source === selectedId &&
                    edge.target === relatedId) ||
                (edge.target === selectedId &&
                    edge.source === relatedId)
        );

        return edge?.description;
    }


    const panelId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => ({
        focusTrigger() {
            triggerRef.current?.focus();
        },
        close() {
            setOpen(false);
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
                onClick={() => {
                    if (!open) {
                        onActivateExplorer?.();
                    }

                    setOpen((current) => !current);
                }}
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

                <span>
                    {open ? "Hide explorer" : "Explore"}
                </span>

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
                        flex w-[min(85vw,19rem)] flex-col
                        max-h-[calc(100svh-7rem)]
                        overflow-hidden
                        rounded-xl
                        border border-white/15
                        bg-[#081120]/90
                        shadow-2xl
                        backdrop-blur-xl
                    "
                >
                    <div className="mb-4 flex items-center justify-between gap-3">

                        <h2 className="
                            flex shrink-0 items-center justify-between gap-3
                            border-b border-white/10
                            px-4 py-4
                        "
                        >
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
                    <div
                        className="
                            min-h-0 flex-1
                            overflow-y-auto
                            overscroll-contain
                            px-4 py-4
                            [scrollbar-width:thin]
                            [scrollbar-color:#405475_transparent]
                        "
                    >
                        <p className="mb-5 text-xs leading-relaxed text-[#8ea9ce]">
                            Explore the connections between my projects,
                            technologies, and areas of expertise.
                        </p>
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
                                {/* Selected node */}
                                <div>
                                    <p className="
                                        mb-1 text-[10px]
                                        font-semibold uppercase
                                        tracking-[0.16em]
                                        text-[#8ea9ce]
                                    ">
                                        Currently exploring
                                    </p>

                                    <p className="text-sm font-medium text-white">
                                        {selectedNode.label}
                                    </p>
                                </div>

                                {/* Related nodes toggle */}
                                <div className="mt-3 border-t border-white/10 pt-2">
                                    <h3>
                                        <button
                                            type="button"
                                            aria-expanded={relatedExpanded}
                                            aria-controls={`${panelId}-related`}
                                            onClick={() =>
                                                setRelatedExpanded((current) => !current)
                                            }
                                            className="
                                            flex w-full items-center
                                            justify-between gap-2
                                            rounded-md px-1 py-2
                                            text-left
                                            transition-colors
                                            hover:bg-white/5
                                            focus-visible:outline-2
                                            focus-visible:outline-blue-400
                                        "
                                        >
                                            <span className="
                                                flex items-center gap-2
                                                text-xs font-medium
                                                text-[#b6c9e8]
                                            ">
                                                <Network
                                                    size={13}
                                                    aria-hidden="true"
                                                />

                                                Related Nodes

                                                <span className="text-[#7892b5]">
                                                    {relatedNodes.length}
                                                </span>
                                            </span>

                                            <ChevronDown
                                                size={14}
                                                aria-hidden="true"
                                                className={`
                                                text-[#8ea9ce]
                                                transition-transform duration-200
                                                ${relatedExpanded
                                                        ? "rotate-180"
                                                        : ""
                                                    }
                                            `}
                                            />
                                        </button>
                                    </h3>

                                    {/* Related groups */}
                                    <div
                                        id={`${panelId}-related`}
                                        hidden={!relatedExpanded}
                                        className="space-y-3 pt-3"
                                    >
                                        {relatedGroups.map((group) => (
                                            <div key={group.id}>
                                                <p className="
                                                    mb-1.5 flex items-center
                                                    justify-between
                                                    text-[10px] font-semibold
                                                    uppercase tracking-[0.12em]
                                                    text-[#8ea9ce]
                                                ">
                                                    <span>{group.label}</span>
                                                    <span>{group.nodes.length}</span>
                                                </p>

                                                <div className="space-y-1">

                                                    {group.nodes.map((node) => {
                                                        const description =
                                                            getRelationshipDescription(node.id);

                                                        return (
                                                            <button
                                                                key={node.id}
                                                                type="button"
                                                                onClick={() => selectNode(node.id)}
                                                                className="
                                                                flex w-full items-start
                                                                gap-2 rounded-md
                                                                px-2 py-2
                                                                text-left
                                                                transition-colors
                                                                hover:bg-white/10
                                                                focus-visible:outline-2
                                                                focus-visible:outline-blue-400
                                                            "
                                                            >
                                                                <span
                                                                    className="
                                                                    mt-1 h-2 w-2
                                                                    shrink-0 rounded-full
                                                                "
                                                                    style={{
                                                                        backgroundColor: node.color,
                                                                    }}
                                                                    aria-hidden="true"
                                                                />

                                                                <span className="min-w-0 flex-1">
                                                                    <span className="
                                                                    block text-xs font-medium
                                                                    text-[#b6c9e8]
                                                                ">
                                                                        {node.label}
                                                                    </span>

                                                                    {description && (
                                                                        <span className="
                                                                        mt-1 block
                                                                        text-[11px]
                                                                        leading-relaxed
                                                                        text-[#8298b8]
                                                                    ">
                                                                            {description}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                </div>
            )}
        </div>
    );
});

export default ConstellationKeyboardExplorer;
