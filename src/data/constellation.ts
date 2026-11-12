
import type {
    ConstellationNodeDefinition,
    ConstellationEdge,
} from "@/types/constellation";

export const constellationNodes: ConstellationNodeDefinition[] = [
    // Identity
    {
        id: "matias",
        label: "Matias Franco",
        category: "identity",
        color: "#8ab8ff",
        size: 0.42,
        description:
            "Software engineering graduate building intelligent applications, backend systems, and interactive experiences.",
    },

    // Disciplines
    {
        id: "ai",
        label: "Artificial Intelligence",
        category: "discipline",
        color: "#72c7ff",
        size: 0.3,
    },
    {
        id: "cloud",
        label: "Cloud Engineering",
        category: "discipline",
        color: "#b29aff",
        size: 0.3,
    },
    {
        id: "creative",
        label: "Creative Development",
        category: "discipline",
        color: "#ffc58a",
        size: 0.3,
    },
    {
        id: "software",
        label: "Software Engineering",
        category: "discipline",
        color: "#6ddbb8",
        size: 0.3,
    },

    // Projects
    {
        id: "manatee",
        label: "Manatee Call Detector",
        category: "project",
        color: "#a6d8ff",
        size: 0.2,
        description:
            "Machine learning system for detecting manatee vocalizations.",
        disciplines: ["ai", "software"],
    },
    {
        id: "voice-notes",
        label: "AWS Voice Notes Organizer",
        category: "project",
        color: "#c3b0ff",
        size: 0.2,
        description:
            "Cloud-based audio transcription and NLP application.",
        disciplines: ["cloud", "ai", "software"],
    },
    {
        id: "hospitality",
        label: "Oracle Hospitality Management",
        category: "project",
        color: "#a8ffe0",
        size: 0.2,
        description:
            "Oracle database system for hospitality operations.",
        disciplines: ["software"],
    },
    {
        id: "pipboy",
        label: "Pip-Boy Widget",
        category: "project",
        color: "#ffdaa6",
        size: 0.2,
        description:
            "Gamified desktop productivity dashboard built with Rainmeter.",
        disciplines: ["creative", "software"],
    },
    {
        id: "portfolio",
        label: "Interactive Developer Portfolio",
        category: "project",
        color: "#f0c6ff",
        stellarColorMode: "directional",
        size: 0.2,
        description:
            "An immersive 3D developer portfolio built around an interactive constellation, cinematic navigation, and contextual project discovery.",
        disciplines: ["creative", "software"],
    },
    {
        id: "nlp-sentiment",
        label: "NLP Sentiment Analysis",
        category: "project",
        color: "#9fd7ff",
        size: 0.2,
        description:
            "Comparative NLP project evaluating sentiment classification approaches using Amazon product reviews.",
        disciplines: ["ai", "software"],
    },

    {
        id: "autoencoder-pca",
        label: "Autoencoder & PCA",
        category: "project",
        color: "#b6caff",
        size: 0.2,
        description:
            "Machine learning project exploring dimensionality reduction and image reconstruction using autoencoders and Principal Component Analysis.",
        disciplines: ["ai"],
    },
    {
        id: "dqn-lunarlander",
        label: "DQN LunarLander",
        category: "project",
        color: "#9ec5ff",
        size: 0.2,
        description:
            "Reinforcement learning project exploring Deep Q-Networks for autonomous decision-making in the LunarLander environment.",
        disciplines: ["ai"],
    },




    // Technologies
    {
        id: "python",
        label: "Python",
        category: "technology",
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai", "cloud", "software"],
    },
    {
        id: "flask",
        label: "Flask",
        category: "technology",
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai", "software"],
    },
    {
        id: "ml",
        label: "Machine Learning",
        category: "technology",
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai"],
    },
    {
        id: "aws",
        label: "AWS",
        category: "technology",
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud"],
    },
    {
        id: "chalice",
        label: "AWS Chalice",
        category: "technology",
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud", "software"],
    },
    {
        id: "nlp",
        label: "NLP",
        category: "technology",
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["ai", "cloud"],
    },
    {
        id: "sql",
        label: "SQL",
        category: "technology",
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software"],
    },
    {
        id: "oracle",
        label: "Oracle",
        category: "technology",
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software"],
    },
    {
        id: "docker",
        label: "Docker",
        category: "technology",
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software", "cloud"],
    },
    {
        id: "rainmeter",
        label: "Rainmeter",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative"],
    },
    {
        id: "lua",
        label: "Lua",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },
    {
        id: "react",
        label: "React",
        category: "technology",
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software", "creative"],
    },
    {
        id: "typescript",
        label: "TypeScript",
        category: "technology",
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software", "creative"],
    },
    {
        id: "nextjs",
        label: "Next.js",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },
    {
        id: "threejs",
        label: "Three.js",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },
    {
        id: "r3f",
        label: "React Three Fiber",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },

    {
        id: "glsl",
        label: "GLSL",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },
    {
        id: "tailwind",
        label: "Tailwind CSS",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },


    {
        id: "scikit-learn",
        label: "Scikit-learn",
        category: "technology",
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai", "software"],
    },
    {
        id: "librosa",
        label: "Librosa",
        category: "technology",
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai", "software"],
    },
    {
        id: "reinforcement-learning",
        label: "Reinforcement Learning",
        category: "technology",
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai"],
    },

    {
        id: "plsql",
        label: "PL/SQL",
        category: "technology",
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software"],
    },
    {
        id: "powershell",
        label: "PowerShell",
        category: "technology",
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },

    {
        id: "s3",
        label: "Amazon S3",
        category: "technology",
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud"],
    },
    {
        id: "transcribe",
        label: "Amazon Transcribe",
        category: "technology",
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud", "ai"],
    },
    {
        id: "comprehend",
        label: "Amazon Comprehend",
        category: "technology",
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud", "ai"],
    },


];

export const constellationEdges: ConstellationEdge[] = [
    // Identity to disciplines
    { source: "matias", target: "ai" },
    { source: "matias", target: "cloud" },
    { source: "matias", target: "creative" },
    { source: "matias", target: "software" },

    // Disciplines to projects
    { source: "ai", target: "manatee" },
    { source: "cloud", target: "voice-notes" },
    { source: "software", target: "hospitality" },
    { source: "creative", target: "pipboy" },
    { source: "creative", target: "portfolio" },
    { source: "ai", target: "autoencoder-pca" },
    { source: "ai", target: "dqn-lunarlander" },

    // Projects to technologies

    // Manatee Call Detector
    {
        source: "manatee",
        target: "python",
        description:
            "Audio preprocessing, MFCC feature extraction, and HMM inference.",
    },
    {
        source: "manatee",
        target: "flask",
        description:
            "Web application and model inference integration.",
    },
    {
        source: "manatee",
        target: "ml",
        description:
            "Hidden Markov Models for vocalization detection and classification.",
    },

    // AWS Voice Notes
    {
        source: "voice-notes",
        target: "aws",
        description:
            "Cloud services for audio storage, transcription, and sentiment analysis.",
    },
    {
        source: "voice-notes",
        target: "chalice",
        description:
            "Serverless backend APIs and integration with AWS services.",
    },
    {
        source: "voice-notes",
        target: "nlp",
        description:
            "Sentiment analysis of transcribed voice notes using Amazon Comprehend.",
    },
    {
        source: "voice-notes",
        target: "python",
        description:
            "Backend logic and orchestration of audio-processing workflows.",
    },
    {
        source: "voice-notes",
        target: "s3",
        description:
            "Object storage for uploaded audio recordings used in the voice-note processing workflow.",
    },
    {
        source: "voice-notes",
        target: "transcribe",
        description:
            "Speech-to-text processing that converts uploaded audio into written transcripts.",
    },
    {
        source: "voice-notes",
        target: "comprehend",
        description:
            "Natural language analysis of transcripts to identify sentiment and key phrases.",
    },

    // Hospitality Database
    {
        source: "hospitality",
        target: "sql",
        description:
            "Relational queries and data operations for hospitality workflows.",
    },
    {
        source: "hospitality",
        target: "oracle",
        description:
            "Relational database platform for managing hospitality data.",
    },
    {
        source: "hospitality",
        target: "plsql",
        description:
            "Stored procedures, modular business logic, validation rules, and automated database tests.",
    },

    // Pip-Boy Widget
    {
        source: "pipboy",
        target: "rainmeter",
        description:
            "Desktop widget framework for the interactive productivity dashboard.",
    },
    {
        source: "pipboy",
        target: "lua",
        description:
            "Custom scripting for widget behavior, interactions, and productivity features.",
    },
    {
        source: "pipboy",
        target: "powershell",
        description:
            "Local file persistence and supporting automation for the Rainmeter productivity dashboard.",
    },

    // Interactive Developer Portfolio
    {
        source: "portfolio",
        target: "react",
        description:
            "Component-based interface and interactive 3D scene integration.",
    },
    {
        source: "portfolio",
        target: "typescript",
        description:
            "Type-safe application logic, constellation data, and component interfaces.",
    },

    {
        source: "portfolio",
        target: "nextjs",
        description:
            "Next.js application architecture, routing, and integration of the portfolio interface.",
    },
    {
        source: "portfolio",
        target: "threejs",
        description:
            "3D scene rendering, custom materials, stellar effects, and camera transformations.",
    },
    {
        source: "portfolio",
        target: "r3f",
        description:
            "Declarative integration of the Three.js scene with React components and state.",
    },

    {
        source: "portfolio",
        target: "glsl",
        description:
            "Custom GPU shaders for procedural stellar surfaces, atmospheric effects, and animated lighting.",
    },
    {
        source: "portfolio",
        target: "tailwind",
        description:
            "Responsive interface styling, navigation layouts, and visual hierarchy around the 3D scene.",
    },



    // NLP Sentiment Analysis
    {
        source: "ai",
        target: "nlp-sentiment",
    },
    {
        source: "nlp-sentiment",
        target: "python",
        description:
            "Text preprocessing, feature extraction, model training, and evaluation.",
    },
    {
        source: "nlp-sentiment",
        target: "nlp",
        description:
            "Sentiment classification using TF-IDF, lexicon-based methods, and supervised learning.",
    },
    {
        source: "nlp-sentiment",
        target: "ml",
        description:
            "Comparison and evaluation of supervised sentiment classifiers.",
    },


    // Autoencoder & PCA
    {
        source: "autoencoder-pca",
        target: "python",
        description:
            "Implementation and evaluation of image-processing and dimensionality-reduction workflows.",
    },
    {
        source: "autoencoder-pca",
        target: "ml",
        description:
            "Autoencoder-based representation learning and comparison with PCA.",
    },

    // DQN LunarLander
    {
        source: "dqn-lunarlander",
        target: "python",
        description:
            "Python-based implementation of the reinforcement learning workflow.",
    },
    {
        source: "dqn-lunarlander",
        target: "ml",
        description:
            "Deep Q-Learning for training an agent through environment interaction and reward feedback.",
    },


    // Additional AI technologies
    {
        source: "nlp-sentiment",
        target: "scikit-learn",
        description:
            "Training and evaluation of supervised sentiment classifiers, including logistic regression and LinearSVC.",
    },
    {
        source: "autoencoder-pca",
        target: "scikit-learn",
        description:
            "PCA-based dimensionality reduction and analysis of image representations.",
    },
    {
        source: "manatee",
        target: "librosa",
        description:
            "Audio loading, segmentation, and MFCC feature extraction for vocalization analysis.",
    },
    {
        source: "dqn-lunarlander",
        target: "reinforcement-learning",
        description:
            "Training a decision-making agent through environment interaction and reward-based learning.",
    },



    // Cross-discipline relationships
    { source: "software", target: "react" },
    { source: "creative", target: "react" },
    { source: "software", target: "typescript" },
    { source: "software", target: "docker" },
    { source: "ai", target: "python" },
];
