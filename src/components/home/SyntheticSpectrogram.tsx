
type SpectrogramCell = {
    x: number;
    y: number;
    intensity: number;
};

const COLUMNS = 120;
const ROWS = 40;

const PLOT = {
    x: 42,
    y: 14,
    width: 520,
    height: 140,
};

function gaussian(
    value: number,
    center: number,
    width: number
): number {
    const distance = (value - center) / width;
    return Math.exp(-(distance * distance));
}

function acousticEvent(
    time: number,
    frequency: number,
    centerTime: number,
    duration: number,
    fundamental: number,
    modulation: number
): number {
    const envelope = gaussian(
        time,
        centerTime,
        duration
    );

    const localTime = time - centerTime;

    // A gently varying fundamental frequency.
    const contour =
        fundamental +
        Math.sin(localTime * 32) * modulation +
        localTime * 0.22;

    // Multiple synthetic frequency bands.
    const harmonics =
        0.95 * gaussian(frequency, contour, 0.024) +
        0.68 * gaussian(frequency, contour * 1.75, 0.029) +
        0.42 * gaussian(frequency, contour * 2.45, 0.035);

    // Slight amplitude variation within the event.
    const modulationEnvelope =
        0.78 + 0.22 * Math.sin(time * 185) ** 2;

    return envelope * harmonics * modulationEnvelope;
}

const cells: SpectrogramCell[] = Array.from(
    { length: COLUMNS * ROWS },
    (_, index) => {
        const column = index % COLUMNS;
        const row = Math.floor(index / COLUMNS);

        const time = column / (COLUMNS - 1);

        // Frequency increases toward the top.
        const frequency = 1 - row / (ROWS - 1);

        // Deterministic low-level background texture.
        const texture =
            0.5 +
            0.25 * Math.sin(column * 3.17 + row * 2.41) +
            0.25 * Math.sin(column * 1.23 - row * 4.13);

        const noiseFloor =
            0.015 + Math.max(0, texture) * 0.045;

        const firstEvent = acousticEvent(
            time,
            frequency,
            0.34,
            0.092,
            0.24,
            0.045
        );

        const secondEvent = acousticEvent(
            time,
            frequency,
            0.76,
            0.067,
            0.28,
            0.035
        );

        const intensity = Math.min(
            1,
            noiseFloor + firstEvent + secondEvent
        );

        return {
            x: PLOT.x + column * PLOT.width / COLUMNS,
            y: PLOT.y + row * PLOT.height / ROWS,
            intensity,
        };
    }
);

export default function SyntheticSpectrogram() {
    return (
        <div className="mt-5 border-t border-border/60 pt-5">
            <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                    Time-Frequency Analysis
                </p>

                <span className="font-mono text-[10px] text-text-muted">
                    Synthetic Data
                </span>
            </div>

            <svg
                viewBox="0 0 600 190"
                className="mt-3 w-full"
                role="img"
                aria-label="Illustrative time-frequency spectrogram showing two synthetic acoustic events with multiple harmonic bands"
            >
                <rect
                    x={PLOT.x}
                    y={PLOT.y}
                    width={PLOT.width}
                    height={PLOT.height}
                    rx="3"
                    fill="#080F20"
                />

                {cells.map((cell, index) => (
                    <rect
                        key={index}
                        x={cell.x}
                        y={cell.y}
                        width={PLOT.width / COLUMNS + 0.1}
                        height={PLOT.height / ROWS + 0.1}
                        fill="#91BCFF"
                        fillOpacity={
                            (Math.pow(cell.intensity, 0.8) * 0.92).toFixed(4)
                        }
                    />
                ))}

                {[0, 1, 2, 3, 4].map((index) => (
                    <line
                        key={`horizontal-${index}`}
                        x1={PLOT.x}
                        x2={PLOT.x + PLOT.width}
                        y1={PLOT.y + index * PLOT.height / 4}
                        y2={PLOT.y + index * PLOT.height / 4}
                        stroke="#A5BBE0"
                        strokeOpacity="0.13"
                    />
                ))}

                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <line
                        key={`vertical-${index}`}
                        x1={PLOT.x + index * PLOT.width / 5}
                        x2={PLOT.x + index * PLOT.width / 5}
                        y1={PLOT.y}
                        y2={PLOT.y + PLOT.height}
                        stroke="#A5BBE0"
                        strokeOpacity="0.09"
                    />
                ))}

                <g
                    fill="#8295B6"
                    fontSize="10"
                    fontFamily="monospace"
                >
                    <text x="35" y="21" textAnchor="end">
                        HIGH
                    </text>

                    <text x="35" y="153" textAnchor="end">
                        LOW
                    </text>

                    <text x={PLOT.x} y="177">
                        FREQUENCY ↑
                    </text>

                    <text
                        x={PLOT.x + PLOT.width}
                        y="177"
                        textAnchor="end"
                    >
                        TIME →
                    </text>
                </g>
            </svg>
        </div>
    );
}
