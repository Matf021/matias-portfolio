
import type {
    ConstellationNodeData,
    ConstellationEdge,
} from "@/types/constellation";

export const constellationNodes: ConstellationNodeData[] = [
    // Identity
    {
        id: "matias",
        label: "Matias Franco",
        category: "identity",
        position: [0, 0, 0],
        color: "#8ab8ff",
        size: 0.42,
    },

    // Disciplines
    {
        id: "ai",
        label: "Artificial Intelligence",
        category: "discipline",
        position: [-3.2, 1.8, -1],
        color: "#72c7ff",
        size: 0.3,
    },
    {
        id: "cloud",
        label: "Cloud Engineering",
        category: "discipline",
        position: [3.2, 1.8, -1],
        color: "#b29aff",
        size: 0.3,
    },
    {
        id: "creative",
        label: "Creative Development",
        category: "discipline",
        position: [-3.2, -1.8, 0],
        color: "#ffc58a",
        size: 0.3,
    },
    {
        id: "software",
        label: "Software Engineering",
        category: "discipline",
        position: [3.2, -1.8, 0],
        color: "#6ddbb8",
        size: 0.3,
    },

    // Projects
    {
        id: "manatee",
        label: "Manatee Call Detector",
        category: "project",
        position: [-4.5, 0.6, 0.6],
        color: "#a6d8ff",
        size: 0.2,
        description:
            "Machine learning system for detecting manatee vocalizations.",
        disciplines: ["ai", "software"],
    },
    {
        id: "voice-notes",
        label: "AWS Voice Notes",
        category: "project",
        position: [4.4, 0.7, 0.6],
        color: "#c3b0ff",
        size: 0.2,
        description:
            "Cloud-based audio transcription and NLP application.",
        disciplines: ["cloud", "ai", "software"],
    },
    {
        id: "hospitality",
        label: "Hospitality Database",
        category: "project",
        position: [4.3, -3, 0.4],
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
        position: [-4.4, -3, 0.4],
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
        position: [-3.0, -3.0, 0.9],
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
        position: [-2.0, 3.3, 0.5],
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
        position: [-5.8, 3.2, 0.2],
        color: "#b6caff",
        size: 0.2,
        description:
            "Machine learning project exploring dimensionality reduction and image reconstruction using autoencoders and Principal Component Analysis.",
        disciplines: ["ai"],
    },




    // Technologies
    {
        id: "python",
        label: "Python",
        category: "technology",
        position: [-2.1, 0.5, 1.5],
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai", "cloud", "software"],
    },
    {
        id: "flask",
        label: "Flask",
        category: "technology",
        position: [-5.3, 1.4, -0.4],
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai", "software"],
    },
    {
        id: "ml",
        label: "Machine Learning",
        category: "technology",
        position: [-4.8, 2.8, -0.6],
        color: "#a7cfff",
        size: 0.12,
        disciplines: ["ai"],
    },
    {
        id: "aws",
        label: "AWS",
        category: "technology",
        position: [4.9, 2.8, -0.6],
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud"],
    },
    {
        id: "chalice",
        label: "AWS Chalice",
        category: "technology",
        position: [5.5, 1.5, -0.4],
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["cloud", "software"],
    },
    {
        id: "nlp",
        label: "NLP",
        category: "technology",
        position: [2, 0.7, 1.5],
        color: "#c5b7ff",
        size: 0.12,
        disciplines: ["ai", "cloud"],
    },
    {
        id: "sql",
        label: "SQL",
        category: "technology",
        position: [5.3, -2.1, -0.4],
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software"],
    },
    {
        id: "oracle",
        label: "Oracle",
        category: "technology",
        position: [5, -4, -0.5],
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software"],
    },
    {
        id: "docker",
        label: "Docker",
        category: "technology",
        position: [2.1, -3.2, 1.2],
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software", "cloud"],
    },
    {
        id: "rainmeter",
        label: "Rainmeter",
        category: "technology",
        position: [-5.4, -4, -0.5],
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative"],
    },
    {
        id: "lua",
        label: "Lua",
        category: "technology",
        position: [-5.3, -2.1, -0.4],
        color: "#ffe0b4",
        size: 0.12,
        disciplines: ["creative", "software"],
    },
    {
        id: "react",
        label: "React",
        category: "technology",
        position: [1.6, -1.4, 1.5],
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software", "creative"],
    },
    {
        id: "typescript",
        label: "TypeScript",
        category: "technology",
        position: [1.5, -2.6, 1.5],
        color: "#b2ffe2",
        size: 0.12,
        disciplines: ["software", "creative"],
    },
    {
        id: "dqn-lunarlander",
        label: "DQN LunarLander",
        category: "project",
        position: [-6.0, 0.0, 0.2],
        color: "#9ec5ff",
        size: 0.2,
        description:
            "Reinforcement learning project exploring Deep Q-Networks for autonomous decision-making in the LunarLander environment.",
        disciplines: ["ai"],
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


    // Cross-discipline relationships
    { source: "software", target: "react" },
    { source: "creative", target: "react" },
    { source: "software", target: "typescript" },
    { source: "software", target: "docker" },
    { source: "ai", target: "python" },
];
