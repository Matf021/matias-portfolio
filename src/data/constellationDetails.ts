
import type {
    ConstellationDetail,
} from "@/types/constellationDetails";

export const constellationDetails: Record<
    string,
    ConstellationDetail
> = {
    // IDENTITY
    matias: {
        summary:
            "I'm a software engineering graduate with a focus on applied AI, backend development, and automation. I enjoy tackling complex problems and turning ideas into working systems, from machine-learning applications to interactive 3D experiences.",

        highlights: [
            "Developed an HMM-based audio detection pipeline as part of a collaborative research project submitted for academic review.",
            "Built cloud-backed applications using Python, AWS services, and REST APIs.",
            "Designed relational database workflows and automated validation using Oracle SQL and PL/SQL.",
            "Created interactive software combining React, TypeScript, Three.js, and custom GPU shaders.",
        ],

        technologies: [
            "Python",
            "TypeScript",
            "React",
            "SQL",
            "AWS",
            "Docker",
        ],

        relatedProjects: [
            "Manatee Call Detector",
            "AWS Voice Notes Organizer",
            "Interactive Developer Portfolio",
            "Pip-Boy Widget",
            "Hospitality Database",
        ],
    },

    // DISCIPLINES
    ai: {
        summary:
            "Applied machine learning and natural language processing, with an emphasis on data preparation, model evaluation, and integrating inference into working applications.",
        highlights: [
            "Developed an HMM-based audio detection pipeline using MFCC features.",
            "Compared supervised and lexicon-based approaches to sentiment analysis.",
            "Worked with model evaluation, feature engineering, and inference workflows.",
        ],
        technologies: [
            "Python",
            "Scikit-learn",
            "hmmlearn",
            "Librosa",
            "NLP",
        ],
        relatedProjects: [
            "Manatee Call Detector",
            "NLP Sentiment Analysis",
            "AWS Voice Notes Organizer",
        ],
    },

    cloud: {
        summary:
            "Cloud-backed applications and automation workflows, particularly serverless APIs, audio processing, and integration between managed AWS services.",
        highlights: [
            "Integrated Amazon S3, Transcribe, and Comprehend into an audio-processing workflow.",
            "Developed API endpoints using AWS Chalice.",
            "Built workflows that connect uploaded data, cloud processing, and user-facing results.",
        ],
        technologies: [
            "AWS",
            "Python",
            "AWS Chalice",
            "REST APIs",
        ],
        relatedProjects: [
            "AWS Voice Notes Organizer",
        ],
    },

    creative: {
        summary:
            "Interactive interfaces that combine practical functionality with distinctive visual design, animation, and user experience.",
        highlights: [
            "Designed a retro CRT-inspired desktop productivity interface.",
            "Built state-driven navigation, progress visualization, and achievement feedback.",
            "Explores 3D interaction and cinematic presentation through this portfolio.",
        ],
        technologies: [
            "Rainmeter",
            "Lua",
            "React",
            "TypeScript",
            "Three.js",
        ],
        relatedProjects: [
            "Matt Daily Dashboard",
            "Interactive Developer Portfolio",
        ],
    },

    software: {
        summary:
            "Software engineering across backend applications, relational databases, automation, and interactive frontend systems.",
        highlights: [
            "Designed modular PL/SQL business logic and automated database tests.",
            "Developed Python-based APIs and application workflows.",
            "Built interactive applications using React and TypeScript.",
        ],
        technologies: [
            "Python",
            "SQL",
            "PL/SQL",
            "React",
            "TypeScript",
            "Docker",
        ],
        relatedProjects: [
            "Oracle Hospitality Management",
            "AWS Voice Notes Organizer",
            "Interactive Developer Portfolio",
        ],
    },

    // PROJECTS
    manatee: {
        summary:
            "A collaborative research application for detecting manatee vocalizations in underwater audio. My primary contribution was the HMM-based detection system and audio preprocessing pipeline.",
        highlights: [
            "Designed and implemented the Hidden Markov Model detection workflow.",
            "Built MFCC extraction and contributed to filtering, denoising, and energy-based segmentation.",
            "Integrated inference into a Flask application with timestamped results and confidence scores.",
            "Contributed to a team system combining HMM and LSTM detection through ensemble voting.",
            "Contributed to a collaborative research project submitted for academic review.",
        ],
        technologies: [
            "Python",
            "Flask",
            "Librosa",
            "hmmlearn",
            "NumPy",
            "SciPy",
        ],
        repositoryUrl:
            "https://github.com/Matf021/manatee-call-detection",
    },

    "voice-notes": {
        summary:
            "A serverless voice-note application that converts uploaded audio into transcribed notes enriched with natural-language insights.",
        highlights: [
            "Implemented an audio upload workflow connected to Amazon S3.",
            "Integrated AWS Transcribe for speech-to-text processing.",
            "Used Amazon Comprehend to extract sentiment and key phrases.",
            "Developed AWS Chalice backend APIs and connected processing results to a web interface.",
        ],
        technologies: [
            "Python",
            "AWS Chalice",
            "Amazon S3",
            "Amazon Transcribe",
            "Amazon Comprehend",
            "JavaScript",
        ],
        repositoryUrl:
            "https://github.com/Matf021/aws-voice-notes-organizer",
    },

    pipboy: {
        summary:
            "A local-first, retro CRT-inspired productivity dashboard that evolved from a simple notes widget into a state-driven desktop application.",
        highlights: [
            "Built notes, task management, and recurring weekly/monthly goal tracking.",
            "Designed event-based completion history for calculating progress from recorded activity.",
            "Implemented productivity statistics, achievement progression, and hidden badges.",
            "Coordinated Rainmeter UI rendering, Lua application logic, and PowerShell file persistence.",
            "Packaged the application as an installable Rainmeter skin.",
        ],
        technologies: [
            "Rainmeter",
            "Lua",
            "PowerShell",
            "INI Configuration",
        ],
        repositoryUrl:
            "https://github.com/Matf021/matt-daily-dashboard",
    },

    hospitality: {
        summary:
            "An Oracle SQL and PL/SQL database project modeling hotel reservations, room assignments, guest stays, folios, and hospitality business rules.",
        highlights: [
            "Designed relational tables and relationships for hospitality operations.",
            "Implemented modular reservation and stay/folio management packages.",
            "Added validation for overlapping reservations, room capacity, maintenance status, and duplicate operations.",
            "Created automated PL/SQL tests for valid workflows and expected errors.",
            "Containerized the Oracle development environment using Docker.",
            "Payment and restaurant-order management remain in development.",
        ],
        technologies: [
            "Oracle Database",
            "SQL",
            "PL/SQL",
            "Docker",
        ],
        repositoryUrl:
            "https://github.com/Matf021/Oracle-hospitality-management-project",
    },

    "nlp-sentiment": {
        summary:
            "A comparative NLP project evaluating lexicon-based and supervised machine-learning approaches to sentiment classification on Amazon product reviews.",
        highlights: [
            "Built text preprocessing and TF-IDF feature extraction workflows.",
            "Compared VADER and TextBlob with supervised classifiers.",
            "Evaluated Logistic Regression, Linear SVM, Naive Bayes, and other models.",
            "Explored aspect-based sentiment analysis for more granular review interpretation.",
        ],
        technologies: [
            "Python",
            "Scikit-learn",
            "TF-IDF",
            "VADER",
            "TextBlob",
        ],
        repositoryUrl:
            "https://github.com/Matf021/nlp-sentiment-analysis",
    },


    portfolio: {
        summary:
            "An interactive 3D developer portfolio that transforms technical experience, projects, and skills into an explorable constellation. Designed to combine expressive visual presentation with practical navigation and accessibility.",
        highlights: [
            "Built an interactive 3D constellation using React Three Fiber and Three.js.",
            "Implemented cinematic camera transitions with Bézier trajectories and interruptible user controls.",
            "Developed graph-based navigation with visual and semantic relationships between projects, disciplines, and technologies.",
            "Created responsive information panels with camera-aware composition and keyboard-accessible navigation.",
            "Optimized interactive effects, particle animations, and starfield rendering for smooth performance.",
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Three.js",
            "React Three Fiber",
            "Tailwind CSS",
        ],
        repositoryUrl:
            "https://github.com/Matf021/matias-portfolio",
    },


    "autoencoder-pca": {
        summary:
            "A machine learning project exploring dimensionality reduction and image reconstruction using autoencoders and Principal Component Analysis on the Olivetti Faces dataset.",
        highlights: [
            "Explored dimensionality reduction and feature representation using PCA and autoencoders.",
            "Worked with the Olivetti Faces image dataset.",
            "Compared learned representations and reconstruction behavior across dimensionality-reduction approaches.",
        ],
        technologies: [
            "Python",
            "Machine Learning",
            "Principal Component Analysis",
            "Autoencoders",
            "Olivetti Faces Dataset",
        ],
    },


    "dqn-lunarlander": {
        summary:
            "A reinforcement learning project exploring Deep Q-Networks (DQN) to train an agent in the LunarLander environment through trial-and-error interaction and reward-based learning.",
        highlights: [
            "Explored value-based reinforcement learning using Deep Q-Networks.",
            "Worked with the LunarLander environment and its state, action, and reward structure.",
            "Investigated how an agent can learn decision-making behavior through repeated environment interaction.",
        ],
        technologies: [
            "Python",
            "Reinforcement Learning",
            "Deep Q-Networks",
            "LunarLander",
        ],
    },




    // TECHNOLOGIES
    python: {
        summary:
            "My primary language for backend development, machine learning, audio processing, automation, and cloud integrations.",
        highlights: [
            "Implemented HMM-based audio inference and preprocessing.",
            "Developed serverless APIs with AWS Chalice.",
            "Used Python for data processing and machine-learning evaluation.",
        ],
        relatedProjects: [
            "Manatee Call Detector",
            "AWS Voice Notes Organizer",
            "NLP Sentiment Analysis",
        ],
    },

    ml: {
        summary:
            "Practical experience developing, evaluating, and integrating machine-learning models into application workflows.",
        highlights: [
            "Gaussian Hidden Markov Models for audio classification.",
            "Supervised sentiment classification using TF-IDF features.",
            "Model evaluation using accuracy, precision, recall, and F1-score.",
        ],
        relatedProjects: [
            "Manatee Call Detector",
            "NLP Sentiment Analysis",
        ],
    },

    flask: {
        summary:
            "Python web framework used to expose backend functionality and machine-learning inference through browser-based applications.",
        relatedProjects: [
            "Manatee Call Detector",
        ],
    },

    aws: {
        summary:
            "Experience integrating managed AWS services into serverless application workflows.",
        technologies: [
            "Amazon S3",
            "Amazon Transcribe",
            "Amazon Comprehend",
            "AWS Chalice",
        ],
        relatedProjects: [
            "AWS Voice Notes Organizer",
        ],
    },

    chalice: {
        summary:
            "Python framework used to develop serverless API endpoints for AWS-backed applications.",
        relatedProjects: [
            "AWS Voice Notes Organizer",
        ],
    },

    nlp: {
        summary:
            "Natural language processing through sentiment classification, key-phrase extraction, and aspect-based analysis.",
        highlights: [
            "Compared VADER and TextBlob with supervised machine-learning classifiers.",
            "Used TF-IDF features with Logistic Regression and Linear SVM.",
            "Integrated Amazon Comprehend for managed text analysis.",
        ],
        relatedProjects: [
            "NLP Sentiment Analysis",
            "AWS Voice Notes Organizer",
        ],
    },

    lua: {
        summary:
            "Scripting language used to implement application state, task logic, navigation, goal tracking, and achievements in Rainmeter.",
        relatedProjects: [
            "Matt Daily Dashboard",
        ],
    },

    rainmeter: {
        summary:
            "Windows desktop customization platform used to build a fully interactive, local-first productivity dashboard.",
        highlights: [
            "Developed custom meters, navigation, scrolling, and CRT-inspired visual effects.",
            "Integrated Lua logic and PowerShell persistence.",
            "Packaged the finished application as an installable skin.",
        ],
        relatedProjects: [
            "Matt Daily Dashboard",
        ],
    },

    react: {
        summary:
            "Component-based frontend development for building reusable interfaces and interactive applications.",
        relatedProjects: [
            "Interactive Developer Portfolio",
        ],
    },

    typescript: {
        summary:
            "Typed JavaScript development for structuring application data, component interfaces, and frontend logic.",
        relatedProjects: [
            "Interactive Developer Portfolio",
        ],
    },

    docker: {
        summary:
            "Containerization for creating isolated and reproducible development environments.",
        highlights: [
            "Configured Oracle Database Free in a Docker container.",
        ],
        relatedProjects: [
            "Oracle Hospitality Management",
        ],
    },

    sql: {
        summary:
            "Relational data modeling, SQL querying, and database-backed business workflows.",
        highlights: [
            "Designed a hospitality relational database schema.",
            "Implemented reservation and stay-management business logic using PL/SQL.",
            "Developed automated tests for database operations and validation rules.",
        ],
        relatedProjects: [
            "Oracle Hospitality Management",
        ],
    },

    oracle: {
        summary:
            "Oracle Database development using SQL, PL/SQL packages, business-rule validation, and automated testing.",
        relatedProjects: [
            "Oracle Hospitality Management",
        ],
    },


    nextjs: {
        summary:
            "React-based application framework used to structure and deliver the interactive developer portfolio.",
        highlights: [
            "Organizes the portfolio using reusable application components.",
            "Integrates the interactive constellation with the surrounding interface.",
        ],
        technologies: ["Next.js", "React", "TypeScript"],
    },

    threejs: {
        summary:
            "3D graphics library used to create the constellation's geometry, materials, lighting effects, and cinematic camera behavior.",
        highlights: [
            "Supports custom stellar shaders and animated visual effects.",
            "Provides the underlying 3D scene and camera mathematics.",
        ],
        technologies: ["Three.js", "WebGL", "GLSL"],
    },

    r3f: {
        summary:
            "React renderer for Three.js, used to build the constellation as a component-based interactive 3D experience.",
        highlights: [
            "Integrates 3D objects with React's component architecture.",
            "Coordinates scene rendering with application state and interactions.",
        ],
        technologies: ["React Three Fiber", "React", "Three.js"],
    },

    glsl: {
        summary:
            "Shader programming language used to create procedural visual effects for the portfolio's 3D constellation.",
        highlights: [
            "Developed custom shaders for stellar surface appearance and atmospheric effects.",
            "Used shader uniforms to control animation, color, intensity, and selection responses.",
            "Integrated GPU-based visual effects into the Three.js rendering pipeline.",
        ],
        technologies: [
            "GLSL",
            "Three.js",
            "WebGL",
        ],
    },

    tailwind: {
        summary:
            "Utility-first CSS framework used to style the portfolio's responsive interface and navigation system.",
        highlights: [
            "Built responsive information panels and navigation components.",
            "Implemented consistent spacing, typography, and interaction states.",
            "Adapted interface layouts across desktop and mobile viewports.",
        ],
        technologies: [
            "Tailwind CSS",
            "React",
            "Next.js",
        ],
    },


    "scikit-learn": {
        summary:
            "Python machine learning library used for supervised learning, dimensionality reduction, and model evaluation.",
        highlights: [
            "Trained and evaluated sentiment classifiers using text-derived features.",
            "Applied Principal Component Analysis to dimensionality-reduction experiments.",
            "Worked with classification metrics and comparative model evaluation.",
        ],
        technologies: [
            "Python",
            "Scikit-learn",
            "Machine Learning",
        ],
    },

    librosa: {
        summary:
            "Python library for audio and music analysis, used in the Manatee Call Detector's signal-processing pipeline.",
        highlights: [
            "Processed and segmented audio recordings.",
            "Extracted MFCC features for acoustic modeling.",
            "Prepared audio features for Hidden Markov Model inference.",
        ],
        technologies: [
            "Python",
            "Librosa",
            "MFCC",
            "Audio Processing",
        ],
    },

    "reinforcement-learning": {
        summary:
            "Machine learning approach in which agents learn behavior through interaction with an environment and reward feedback.",
        highlights: [
            "Explored Deep Q-Networks for value-based decision-making.",
            "Worked with environment observations, actions, and rewards.",
            "Applied reinforcement learning concepts in the LunarLander project.",
        ],
        technologies: [
            "Python",
            "Reinforcement Learning",
            "Deep Q-Networks",
        ],
    },

    plsql: {
        summary:
            "Oracle's procedural SQL extension, used to implement business logic, validation, and automated tests for the hospitality database system.",
        highlights: [
            "Developed modular packages for reservation, stay, and folio management.",
            "Implemented validation for reservation conflicts, room capacity, and operational constraints.",
            "Created automated tests covering valid workflows and expected errors.",
        ],
        technologies: [
            "PL/SQL",
            "Oracle Database",
            "SQL",
        ],
        relatedProjects: [
            "Oracle Hospitality Management",
        ],
    },

    powershell: {
        summary:
            "Windows scripting and automation language used to support local data persistence and file operations in the Pip-Boy productivity dashboard.",
        highlights: [
            "Integrated PowerShell scripts with Rainmeter and Lua workflows.",
            "Supported local file reading and writing for productivity data.",
            "Contributed to the dashboard's local-first architecture.",
        ],
        technologies: [
            "PowerShell",
            "Lua",
            "Rainmeter",
        ],
        relatedProjects: [
            "Matt Daily Dashboard",
        ],
    },

    s3: {
        summary:
            "Amazon Web Services object-storage service used to store audio recordings for the Voice Notes Organizer.",
        highlights: [
            "Integrated audio uploads with cloud object storage.",
            "Used stored audio as input for transcription workflows.",
            "Connected S3 storage with a Python-based serverless backend.",
        ],
        technologies: [
            "Amazon S3",
            "AWS",
            "Python",
        ],
        relatedProjects: [
            "AWS Voice Notes Organizer",
        ],
    },

    transcribe: {
        summary:
            "AWS speech-recognition service used to convert recorded voice notes into text.",
        highlights: [
            "Integrated automated speech-to-text processing.",
            "Connected transcription results to the application's note-management workflow.",
            "Used transcription output as input for downstream natural-language analysis.",
        ],
        technologies: [
            "Amazon Transcribe",
            "AWS",
            "Python",
        ],
        relatedProjects: [
            "AWS Voice Notes Organizer",
        ],
    },

    comprehend: {
        summary:
            "AWS natural language processing service used to extract sentiment and key phrases from transcribed voice notes.",
        highlights: [
            "Integrated managed sentiment analysis into the application.",
            "Extracted key phrases from transcribed text.",
            "Connected NLP results to user-facing note information.",
        ],
        technologies: [
            "Amazon Comprehend",
            "AWS",
            "Natural Language Processing",
        ],
        relatedProjects: [
            "AWS Voice Notes Organizer",
        ],
    },
};
