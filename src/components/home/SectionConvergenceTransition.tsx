
export default function SectionConvergenceTransition() {
    return (
        <div
            aria-hidden="true"
            className="relative mx-auto w-full max-w-5xl overflow-hidden px-5 py-0 sm:px-6 sm:py-2"
        >
            <svg
                viewBox="0 0 900 240"
                className="h-auto w-full"
                fill="none"
            >
                <defs>
                    <radialGradient id="stellar-horizon-glow">
                        <stop
                            offset="0%"
                            stopColor="#D7E7FF"
                            stopOpacity="0.55"
                        />
                        <stop
                            offset="30%"
                            stopColor="#8AB8FF"
                            stopOpacity="0.17"
                        />
                        <stop
                            offset="100%"
                            stopColor="#8AB8FF"
                            stopOpacity="0"
                        />
                    </radialGradient>

                    <linearGradient
                        id="stellar-horizon-arc"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            stopColor="#8AB8FF"
                            stopOpacity="0"
                        />
                        <stop
                            offset="35%"
                            stopColor="#8AB8FF"
                            stopOpacity="0.5"
                        />
                        <stop
                            offset="58%"
                            stopColor="#F5D2AD"
                            stopOpacity="0.85"
                        />
                        <stop
                            offset="100%"
                            stopColor="#8AB8FF"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                {/* Atmospheric light */}
                <ellipse
                    cx="450"
                    cy="129"
                    rx="280"
                    ry="125"
                    fill="url(#stellar-horizon-glow)"
                    opacity="0.7"
                />

                {/* Primary trajectory */}
                <path
                    d="M0 184 C220 180 265 72 450 72 S680 180 900 184"
                    stroke="url(#stellar-horizon-arc)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />

                {/* Secondary orbital trace */}
                <path
                    d="M70 184 C250 194 330 122 450 122 S650 194 830 184"
                    stroke="#A5BDEB"
                    strokeWidth="0.8"
                    strokeOpacity="0.2"
                    strokeDasharray="3 8"
                />

                {/* Faint horizon */}
                <path
                    d="M0 184 H900"
                    stroke="#9EBAE4"
                    strokeOpacity="0.12"
                />

                {/* Reference guides */}
                <path
                    d="M450 72 L450 185 M390 128 L510 128"
                    stroke="#B9CFFA"
                    strokeOpacity="0.19"
                />

                {/* Central stellar point */}
                <circle
                    cx="450"
                    cy="72"
                    r="61"
                    fill="url(#stellar-horizon-glow)"
                />

                <circle
                    cx="450"
                    cy="72"
                    r="8"
                    stroke="#C8DDFD"
                    strokeOpacity="0.45"
                />

                <circle
                    cx="450"
                    cy="72"
                    r="3.5"
                    fill="#F8FAFF"
                />

                {/* Distant points */}
                {[
                    [145, 169, 2],
                    [300, 112, 1.5],
                    [614, 116, 2],
                    [758, 169, 1.5],
                    [450, 15, 1],
                ].map(([x, y, radius], index) => (
                    <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="#BFD5FF"
                        opacity="0.55"
                    />
                ))}
            </svg>
        </div>
    );
}
