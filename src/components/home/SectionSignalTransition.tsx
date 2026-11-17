
export default function SectionSignalTransition() {
    return (
        <div
            aria-hidden="true"
            className="mx-auto flex h-16 max-w-5xl items-center justify-center px-5 sm:px-6"
        >
            <svg
                viewBox="0 0 640 54"
                className="h-full w-full max-w-2xl"
                fill="none"
            >
                <defs>
                    <linearGradient id="section-signal">
                        <stop offset="0%" stopColor="#8AB8FF" stopOpacity="0" />
                        <stop offset="35%" stopColor="#8AB8FF" stopOpacity="0.45" />
                        <stop offset="65%" stopColor="#D5A377" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#D5A377" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path
                    d="M 0 27 H 170 L 190 27 L 201 16 L 213 38 L 226 27 H 290 L 301 11 L 313 43 L 325 27 H 390 L 402 19 L 414 35 L 427 27 H 640"
                    stroke="url(#section-signal)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <g fill="#A8BBDD" opacity="0.35">
                    {Array.from({ length: 13 }, (_, index) => (
                        <rect
                            key={index}
                            x={248 + index * 12}
                            y="48"
                            width="4"
                            height="2"
                            rx="1"
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}
