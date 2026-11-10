
/**
 * Registered disciplines.
 *
 * A discipline is added here only when it is ready
 * to become part of the public constellation.
 */
export const disciplines = {
    ai: {
        label: "Artificial Intelligence",
    },
    cloud: {
        label: "Cloud Engineering",
    },
    creative: {
        label: "Creative Development",
    },
    software: {
        label: "Software Engineering",
    },
} as const;

export type DisciplineId = keyof typeof disciplines;
