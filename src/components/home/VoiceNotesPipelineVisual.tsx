
"use client";

import { useEffect, useRef, useState } from "react";

const services = [
    {
        number: "01",
        name: "S3",
        description: "Audio storage",
    },
    {
        number: "02",
        name: "Transcribe",
        description: "Speech to text",
    },
    {
        number: "03",
        name: "Comprehend",
        description: "NLP analysis",
    },
];

const stageMessages = [
    "Ready to process sample audio",
    "Sending audio through the Chalice API",
    "Sample audio stored in Amazon S3",
    "Transcribing sample audio",
    "Analyzing transcript with Comprehend",
    "Sample note generated",
];

export default function VoiceNotesPipelineVisual() {
    const [stage, setStage] = useState(0);
    const timersRef = useRef<
        Array<ReturnType<typeof setTimeout>>
    >([]);

    // Cancel scheduled transitions if the component unmounts.
    useEffect(() => {
        const timers = timersRef.current;

        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    const isProcessing = stage >= 1 && stage <= 4;
    const isComplete = stage === 5;

    function runDemo() {
        if (isProcessing) return;

        // Prevent old transitions from affecting a replay.
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];

        setStage(1);

        const sequence = [
            { delay: 650, stage: 2 },
            { delay: 1400, stage: 3 },
            { delay: 2200, stage: 4 },
            { delay: 3000, stage: 5 },
        ];

        sequence.forEach((step) => {
            const timer = setTimeout(() => {
                setStage(step.stage);
            }, step.delay);

            timersRef.current.push(timer);
        });
    }

    return (
        <figure className="relative overflow-hidden rounded-2xl border border-[#B9A4FF]/20 bg-[#0B1427] p-5 shadow-[0_0_60px_rgba(135,113,255,0.05)] sm:p-7">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_25%,rgba(135,113,255,0.09),transparent_65%)]"
            />

            <div className="relative flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B9A4FF]">
                    Cloud Processing
                </span>

                <span className="rounded-full border border-[#B9A4FF]/20 px-2.5 py-1 font-mono text-[10px] text-text-secondary">
                    Interactive Demo
                </span>
            </div>

            {/* Input */}
            <div className="relative mt-7 rounded-xl border border-border/70 bg-[#080F20]/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                            Input / Sample Audio
                        </p>

                        <p className="mt-2 truncate font-mono text-sm text-foreground">
                            voice-note.wav
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={runDemo}
                        disabled={isProcessing}
                        className="rounded-lg border border-[#B9A4FF]/30 bg-[#B9A4FF]/10 px-3 py-2 font-mono text-xs font-medium text-[#CCBCFF] transition-colors hover:bg-[#B9A4FF]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B9A4FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isProcessing
                            ? "Processing..."
                            : isComplete
                                ? "Replay"
                                : "Process Sample"}
                    </button>
                </div>

                {/* Static synthetic audio illustration */}
                <div
                    aria-hidden="true"
                    className="mt-4 flex h-9 items-end justify-center gap-[3px] overflow-hidden opacity-75"
                >
                    {Array.from({ length: 45 }, (_, index) => {
                        const height =
                            18 +
                            52 * Math.abs(
                                Math.sin(index * 0.73) *
                                Math.cos(index * 0.31)
                            );

                        return (
                            <span
                                key={index}
                                className="w-1 rounded-full bg-[#9F94E8]"
                                style={{
                                    height: `${height.toFixed(4)}%`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Current pipeline status */}
            <div
                role="status"
                aria-live="polite"
                className="relative mt-4 flex min-h-7 items-center gap-2 font-mono text-[11px] text-[#B9A4FF]"
            >
                <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                        isComplete
                            ? "bg-emerald-300"
                            : isProcessing
                                ? "bg-[#B9A4FF]"
                                : "bg-text-muted"
                    }`}
                />
                {stageMessages[stage]}
            </div>

            {/* Service pipeline */}
            <div className="relative mt-3 grid grid-cols-3 gap-2">
                {services.map((service, index) => {
                    const serviceStage = index + 2;
                    const isActive = stage === serviceStage;
                    const isDone = stage > serviceStage;

                    return (
                        <div
                            key={service.name}
                            className={`min-w-0 rounded-lg border p-3 transition-colors duration-300 ${
                                isActive
                                    ? "border-[#B9A4FF]/70 bg-[#B9A4FF]/15"
                                    : isDone
                                        ? "border-[#B9A4FF]/35 bg-[#B9A4FF]/10"
                                        : "border-[#B9A4FF]/20 bg-[#B9A4FF]/5"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-1">
                                <p className="font-mono text-[10px] text-[#B9A4FF]/70">
                                    {service.number}
                                </p>

                                <span
                                    aria-hidden="true"
                                    className="font-mono text-[10px] text-[#B9A4FF]"
                                >
                                    {isDone
                                        ? "✓"
                                        : isActive
                                            ? "●"
                                            : "○"}
                                </span>
                            </div>

                            <p className="mt-3 break-words text-xs font-medium text-foreground">
                                {service.name}
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-text-muted">
                                {service.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Output */}
            <div className="relative mt-5 rounded-xl border border-border/70 bg-[#080F20]/80 p-4">
                <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                        Output / Structured Note
                    </p>

                    <span className="font-mono text-[10px] text-[#B9A4FF]">
                        {isComplete ? "READY" : "SAMPLE"}
                    </span>
                </div>

                <div className="mt-4 min-h-28">
                    {isComplete ? (
                        <div className="space-y-3">
                            <div>
                                <p className="font-mono text-[10px] text-text-muted">
                                    TRANSCRIPT
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                                    Remember to review the project
                                    documentation before Friday.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] text-emerald-300">
                                    Neutral
                                </span>

                                <span className="font-mono text-[10px] text-text-muted">
                                    Key phrase: project documentation
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-24 items-center justify-center text-center">
                            <p className="font-mono text-[11px] text-text-muted">
                                {isProcessing
                                    ? "Generating structured note..."
                                    : "Awaiting sample processing"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <figcaption className="relative mt-4 text-xs leading-relaxed text-text-muted">
                Interactive simulation of the AWS workflow.
                Sample audio and results are illustrative;
                no cloud requests are performed.
            </figcaption>
        </figure>
    );
}
