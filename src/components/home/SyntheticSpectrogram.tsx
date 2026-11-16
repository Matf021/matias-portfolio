
const columns = 72;
const rows = 20;

const cells = Array.from(
    { length: columns * rows },
    (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);

        const time = column / (columns - 1);
        const frequency = 1 - row / (rows - 1);

        // Two illustrative acoustic events.
        const eventOne =
            Math.exp(-Math.pow((time - 0.35) / 0.105, 2));

        const eventTwo =
            Math.exp(-Math.pow((time - 0.74) / 0.075, 2));

        // Synthetic frequency contours.
        const contourOne = 0.28 + time * 0.38;
        const contourTwo = 0.67 - time * 0.27;

        const bandOne =
            Math.exp(
                -Math.pow((frequency - contourOne) / 0.085, 2)
            );

        const bandTwo =
            Math.exp(
                -Math.pow((frequency - contourTwo) / 0.075, 2)
            );

        // Deterministic texture, not recorded audio.
        const texture =
            (Math.sin(column * 2.7 + row * 1.9) + 1) * 0.5;

        const energy = Math.min(
            1,
            0.035 +
            texture * 0.07 +
            eventOne * (bandOne * 0.85 + bandTwo * 0.35) +
            eventTwo * (bandTwo * 0.75 + bandOne * 0.25)
        );

        return {
            x: 24 + column * (552 / columns),
            y: 12 + row * (104 / rows),
            energy,
        };
    }
);

export default function SyntheticSpectrogram() {
    return (
        <div className="mt-5 border-t border-border/60 pt-5">
            <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                    Time-Frequency Representation
                </p>

                <span className="font-mono text-[10px] text-text-muted">
                    Illustrative
                </span>
            </div>

            <svg
                viewBox="0 0 600 145"
                className="mt-3 w-full"
                role="img"
                aria-label="Synthetic spectrogram showing two illustrative acoustic events with varying frequency energy"
            >
                <rect
                    x="24"
                    y="12"
                    width="552"
                    height="104"
                    rx="4"
                    fill="#080F20"
                />

                {cells.map((cell, index) => (
                    <rect
                        key={index}
                        x={cell.x}
                        y={cell.y}
                        width={552 / columns + 0.2}
                        height={104 / rows + 0.2}
                        fill="#8AB8FF"
                        fillOpacity={cell.energy * 0.9}
                    />
                ))}

                <text
                    x="24"
                    y="136"
                    fill="#8295B6"
                    fontSize="11"
                >
                    LOW FREQUENCY
                </text>

                <text
                    x="576"
                    y="136"
                    textAnchor="end"
                    fill="#8295B6"
                    fontSize="11"
                >
                    TIME →
                </text>
            </svg>
        </div>
    );
}
