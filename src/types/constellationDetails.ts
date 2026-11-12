export type ProjectStory = {
    challenge: string;
    contribution: string;
    approach: string[];
    outcome: string;
};

export type ConstellationDetail = {
    summary?: string;
    highlights?: string[];
    technologies?: string[];
    relatedProjects?: string[];
    repositoryUrl?: string;
    externalUrl?: string;
    story?: ProjectStory;
};
