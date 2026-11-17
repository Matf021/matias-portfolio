export default function SectionSignalTransition() {
    return (
        <div
            aria-hidden="true"
            className="mx-auto flex h-20 max-w-5xl items-center justify-center px-5 sm:h-24 sm:px-6"
        >
            <svg
                viewBox="0 0 1000 115"
                className="h-full w-full"
                fill="none"
            >
                <defs>
                    <linearGradient
                        id="orbital-transition-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#86AAE5" stopOpacity="0" />
                        <stop offset="38%" stopColor="#86AAE5" stopOpacity="0.55" />
                        <stop offset="70%" stopColor="#D6AB8A" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#D6AB8A" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path
                    d="M0 68 C120 72 190 30 300 43 S470 82 590 49 S780 25 875 55 S950 72 1000 58"
                    stroke="url(#orbital-transition-gradient)"
                    strokeWidth="1.4"
                />

                <path
                    d="M190 79 Q500 0 825 80"
                    stroke="#7895C4"
                    strokeWidth="0.7"
                    strokeOpacity="0.18"
                    strokeDasharray="3 7"
                />

                <g>
                    <circle cx="300" cy="43" r="13" fill="#86AAE5" fillOpacity="0.05" />
                    <circle cx="300" cy="43" r="4" stroke="#86AAE5" strokeOpacity="0.6" />
                    <circle cx="300" cy="43" r="1.6" fill="#B8D4FF" />

                    <circle cx="590" cy="49" r="13" fill="#E0AF88" fillOpacity="0.05" />
                    <circle cx="590" cy="49" r="4" stroke="#E0AF88" strokeOpacity="0.6" />
                    <circle cx="590" cy="49" r="1.6" fill="#F2D0AC" />
                </g>
            </svg>
        </div>
    );
}