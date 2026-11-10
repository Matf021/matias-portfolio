
import type {
    ConstellationNodeData,
} from "@/types/constellation";

type Props = {
    title: string;
    nodes: ConstellationNodeData[];
    onNavigate: (id: string) => void;
};

export default function RelatedNodeSection({
    title,
    nodes,
    onNavigate,
}: Props) {
    if (nodes.length === 0) {
        return null;
    }

    return (
        <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                {title}
            </h4>

            <div className="flex flex-col gap-1.5">
                {nodes.map((node) => (
                    <button
                        key={node.id}
                        type="button"
                        onClick={() => onNavigate(node.id)}
                        className="
                            group flex w-full items-center
                            justify-between gap-3
                            rounded-md border border-border
                            bg-surface/40 px-3 py-2
                            text-left transition-colors
                            hover:border-white/20
                            hover:bg-surface
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-accent
                        "
                    >
                        <span className="flex min-w-0 items-center gap-2.5">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: node.color,
                                    boxShadow: `0 0 8px ${node.color}55`,
                                }}
                                aria-hidden="true"
                            />

                            <span className="text-xs font-medium text-text-secondary transition-colors group-hover:text-foreground">
                                {node.label}
                            </span>
                        </span>

                        <span
                            className="shrink-0 text-xs text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                            aria-hidden="true"
                        >
                            ↗
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
