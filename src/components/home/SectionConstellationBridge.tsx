export default function SectionConstellationBridge() {
    return (
        <div
            aria-hidden="true"
            className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10"
        >
            <div className="relative h-24 sm:h-28">
                {/* subtle glow backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,160,255,0.08),transparent_65%)]" />

                <svg
                    viewBox="0 0 1200 180"
                    className="absolute inset-0 h-full w-full overflow-visible"
                    fill="none"
                >
                    {/* connection lines */}
                    <path
                        d="M110 105 C 240 40, 330 135, 470 88"
                        stroke="rgba(160,190,255,0.18)"
                        strokeWidth="1.2"
                    />
                    <path
                        d="M470 88 C 610 35, 710 130, 860 76"
                        stroke="rgba(160,190,255,0.16)"
                        strokeWidth="1.2"
                    />
                    <path
                        d="M860 76 C 960 48, 1040 110, 1110 84"
                        stroke="rgba(160,190,255,0.14)"
                        strokeWidth="1.2"
                    />

                    {/* secondary faint lines */}
                    <path
                        d="M210 135 C 370 95, 520 120, 680 100"
                        stroke="rgba(160,190,255,0.08)"
                        strokeWidth="1"
                    />
                    <path
                        d="M620 55 C 760 85, 910 35, 1040 70"
                        stroke="rgba(160,190,255,0.08)"
                        strokeWidth="1"
                    />

                    {/* stars */}
                    <circle cx="110" cy="105" r="4" fill="rgba(210,225,255,0.75)" />
                    <circle cx="210" cy="135" r="2.5" fill="rgba(210,225,255,0.5)" />
                    <circle cx="470" cy="88" r="5" fill="rgba(210,225,255,0.85)" />
                    <circle cx="620" cy="55" r="2.5" fill="rgba(210,225,255,0.45)" />
                    <circle cx="680" cy="100" r="3" fill="rgba(210,225,255,0.55)" />
                    <circle cx="860" cy="76" r="4.5" fill="rgba(210,225,255,0.78)" />
                    <circle cx="960" cy="48" r="2.5" fill="rgba(210,225,255,0.45)" />
                    <circle cx="1040" cy="70" r="3" fill="rgba(210,225,255,0.55)" />
                    <circle cx="1110" cy="84" r="3.8" fill="rgba(210,225,255,0.7)" />
                </svg>

                {/* star glow points */}
                <div className="absolute left-[38%] top-[42%] h-3 w-3 rounded-full bg-blue-200/50 blur-md" />
                <div className="absolute left-[71%] top-[34%] h-3 w-3 rounded-full bg-blue-200/40 blur-md" />
            </div>
        </div>
    );
}