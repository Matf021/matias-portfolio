import type { DisciplineId, Position3D } from "@/types/constellation";

export type ClusterId = DisciplineId;
type ClusterLayout = {
    center: Position3D;
    offsets: Record<string, Position3D>;
};

export const constellationLayout: Record<ClusterId, ClusterLayout> = {
    ai: {
        center: [-2.4, 2.2, 0.4],
        offsets: {
            manatee: [-1.3, -0.9, 0.5],
            ml: [-1.4, 1.1, -0.4],
            flask: [-2.1, -0.2, -0.5],
            python: [0.4, -1.5, 1],
        },
    },
    cloud: {
        center: [4.5, 3.6, -1.0],
        offsets: {
            "voice-notes": [-1.5, -1.3, 1.1],
            aws: [1.4, 1.1, -0.4],
            chalice: [2.1, -0.2, -0.5],
            nlp: [-2.2, 0.3, 1.5],
        },
    },
    creative: {
        center: [-5.2, -4.2, -0.8],
        offsets: {
            pipboy: [-1.3, -0.9, 0.5],
            rainmeter: [-1.5, -1.9, -0.4],
            lua: [-2.1, 0.2, -0.5],
        },
    },
    software: {
        center: [2.7, -1.0, 0.6],
        offsets: {
            hospitality: [1.3, -0.9, 0.5],
            sql: [2.1, -0.2, -0.5],
            oracle: [1.5, -1.9, -0.4],
            docker: [-0.5, -1.8, 0.8],
            typescript: [-1.5, -0.5, 0.7],
        },
    },
};

/** Absolute positions for cross-discipline bridge nodes. */
export const bridgePositions: Record<string, Position3D> = {
    react: [-0.7, -2.2, 1.5],
    portfolio: [-2.0, -4.0, 0.9],
};

/** Absolute positions for nodes not assigned to cluster-relative offsets. */
export const independentPositions: Record<string, Position3D> = {
    matias: [0, 0, 0],
    "nlp-sentiment": [-2.0, 3.3, 0.5],
    "autoencoder-pca": [-5.8, 3.2, 0.2],
    "dqn-lunarlander": [-6.0, 0.0, 0.2],
    "nextjs": [-0.4, -3.5, 1.2],
    "threejs": [0.5, -4.2, -0.3],
    "r3f": [0.0, -5.1, 1.4],
    "glsl": [0.9, -5.6, -0.8],
    "tailwind": [1.5, -4.7, 0.9],
    "scikit-learn": [-2.8, 4.4, -0.5],
    "librosa": [-6.5, 1.7, 1.0],
    "reinforcement-learning": [-7.0, -0.9, -0.7],
    "plsql": [6.2, -3.5, 0.8],
    "powershell": [-4.5, -4.7, 0.9],
    "s3": [6.3, 2.7, 0.6],
    "transcribe": [6.6, 1.5, -0.7],
    "comprehend": [5.9, 0.3, 1.0],
};

export function addPositions(a: Position3D, b: Position3D): Position3D {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
