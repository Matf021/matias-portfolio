import FeaturedProjectBlock from "./FeaturedProjectBlock";
import ManateeSignalVisual from "./ManateeSignalVisual";

const featuredProjects = [
    {
        number: "01",
        category: "Applied AI / Machine Learning",
        title: "Manatee Call Detector",
        description:
            "A collaborative research application designed to detect manatee vocalizations in underwater audio recordings using signal processing and machine learning.",
        contribution:
            "Designed the Hidden Markov Model detection workflow, developed audio preprocessing and MFCC feature extraction, and contributed to Flask application integration.",
        technologies: [
            "Python",
            "Flask",
            "Librosa",
            "HMM",
            "Signal Processing",
        ],
        github:
            "https://github.com/Matf021/manatee-call-detection",
    },
    {
        number: "02",
        category: "Cloud / Backend Development",
        title: "AWS Voice Notes Organizer",
        description:
            "A serverless application that transforms recorded audio into searchable notes using automatic transcription and sentiment analysis.",
        contribution:
            "Built backend workflows connecting audio storage, transcription, and NLP services through AWS Chalice.",
        technologies: [
            "Python",
            "AWS Chalice",
            "Amazon S3",
            "Transcribe",
            "Comprehend",
        ],
        github:
            "https://github.com/Matf021/aws-voice-notes-organizer",
    },
    {
        number: "03",
        category: "Creative Engineering / 3D",
        title: "Interactive Developer Portfolio",
        description:
            "An immersive developer portfolio that turns projects, technologies, and skills into an interactive three-dimensional constellation.",
        contribution:
            "Developed cinematic camera navigation, interactive graph exploration, custom stellar shaders, and responsive interfaces.",
        technologies: [
            "Next.js",
            "TypeScript",
            "Three.js",
            "React Three Fiber",
            "GLSL",
        ],
        github: "https://github.com/Matf021/matias-portfolio",
    },
];

export default function SelectedWorkSection() {
    return (
        <section
            id="selected-work"
            aria-labelledby="selected-work-heading"
            className="relative px-5 pb-28 pt-10 sm:px-6 sm:pb-36 sm:pt-12"
        >
            <div className="mx-auto max-w-5xl">
                <div className="mb-16">
                    <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-accent">
                        02 / Selected Work
                    </p>

                    <h2
                        id="selected-work-heading"
                        className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                    >
                        Ideas, brought to life.
                    </h2>

                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
                        A selection of projects exploring intelligent
                        systems, software architecture, and interactive
                        experiences.
                    </p>
                </div>

                <div className="border-t border-border">
                    {featuredProjects.map((project, index) => (
                        <FeaturedProjectBlock
                            key={project.number}
                            project={project}
                            visual={
                                index === 0
                                    ? <ManateeSignalVisual />
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
