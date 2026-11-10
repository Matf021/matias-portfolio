
import type { Position3D } from "@/types/constellation";

type FutureDisciplineId =
    | "gamedev"
    | "cybersecurity"
    | "data";

type ExpansionZone = {
    label: string;
    candidateCenter: Position3D;
    relatedDisciplines: string[];
    status: "planned";
};

export const expansionZones: Record<
    FutureDisciplineId,
    ExpansionZone
> = {
    gamedev: {
        label: "Game Development",
        candidateCenter: [-7.2, -1.8, -2.0],
        relatedDisciplines: ["creative", "software"],
        status: "planned",
    },

    cybersecurity: {
        label: "Cybersecurity",
        candidateCenter: [5.8, -4.0, -2.2],
        relatedDisciplines: ["software", "cloud"],
        status: "planned",
    },

    data: {
        label: "Data Engineering",
        candidateCenter: [1.2, 4.3, -1.8],
        relatedDisciplines: ["ai", "cloud"],
        status: "planned",
    },
};
