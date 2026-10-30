
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
    color: "#92ffcf",
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
    description: "Machine learning system for detecting manatee vocalizations.",
  },
  {
    id: "voice-notes",
    label: "AWS Voice Notes",
    category: "project",
    position: [4.4, 0.7, 0.6],
    color: "#c3b0ff",
    size: 0.2,
    description: "Cloud-based audio transcription and NLP application.",
  },
  {
    id: "hospitality",
    label: "Hospitality Database",
    category: "project",
    position: [4.3, -3, 0.4],
    color: "#a8ffe0",
    size: 0.2,
    description: "Oracle database system for hospitality operations.",
  },
  {
    id: "pipboy",
    label: "Pip-Boy Widget",
    category: "project",
    position: [-4.4, -3, 0.4],
    color: "#ffdaa6",
    size: 0.2,
    description: "Gamified desktop productivity dashboard built with Rainmeter.",
  },

  // Technologies
  {
    id: "python",
    label: "Python",
    category: "technology",
    position: [-2.1, 0.5, 1.5],
    color: "#a7cfff",
    size: 0.12,
  },
  {
    id: "flask",
    label: "Flask",
    category: "technology",
    position: [-5.3, 1.4, -0.4],
    color: "#a7cfff",
    size: 0.12,
  },
  {
    id: "ml",
    label: "Machine Learning",
    category: "technology",
    position: [-4.8, 2.8, -0.6],
    color: "#a7cfff",
    size: 0.12,
  },
  {
    id: "aws",
    label: "AWS",
    category: "technology",
    position: [4.9, 2.8, -0.6],
    color: "#c5b7ff",
    size: 0.12,
  },
  {
    id: "chalice",
    label: "AWS Chalice",
    category: "technology",
    position: [5.5, 1.5, -0.4],
    color: "#c5b7ff",
    size: 0.12,
  },
  {
    id: "nlp",
    label: "NLP",
    category: "technology",
    position: [2, 0.7, 1.5],
    color: "#c5b7ff",
    size: 0.12,
  },
  {
    id: "sql",
    label: "SQL",
    category: "technology",
    position: [5.3, -2.1, -0.4],
    color: "#b2ffe2",
    size: 0.12,
  },
  {
    id: "oracle",
    label: "Oracle",
    category: "technology",
    position: [5, -4, -0.5],
    color: "#b2ffe2",
    size: 0.12,
  },
  {
    id: "docker",
    label: "Docker",
    category: "technology",
    position: [2.1, -3.2, 1.2],
    color: "#b2ffe2",
    size: 0.12,
  },
  {
    id: "rainmeter",
    label: "Rainmeter",
    category: "technology",
    position: [-5.4, -4, -0.5],
    color: "#ffe0b4",
    size: 0.12,
  },
  {
    id: "lua",
    label: "Lua",
    category: "technology",
    position: [-5.3, -2.1, -0.4],
    color: "#ffe0b4",
    size: 0.12,
  },
  {
    id: "react",
    label: "React",
    category: "technology",
    position: [1.6, -1.4, 1.5],
    color: "#b2ffe2",
    size: 0.12,
  },
  {
    id: "typescript",
    label: "TypeScript",
    category: "technology",
    position: [1.5, -2.6, 1.5],
    color: "#b2ffe2",
    size: 0.12,
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

  // Projects to technologies
  { source: "manatee", target: "python" },
  { source: "manatee", target: "flask" },
  { source: "manatee", target: "ml" },

  { source: "voice-notes", target: "aws" },
  { source: "voice-notes", target: "chalice" },
  { source: "voice-notes", target: "nlp" },
  { source: "voice-notes", target: "python" },

  { source: "hospitality", target: "sql" },
  { source: "hospitality", target: "oracle" },

  { source: "pipboy", target: "rainmeter" },
  { source: "pipboy", target: "lua" },

  // Cross-discipline relationships
  { source: "software", target: "react" },
  { source: "software", target: "typescript" },
  { source: "software", target: "docker" },
  { source: "ai", target: "python" },
];
