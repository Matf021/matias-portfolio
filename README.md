# Matias Franco — Interactive Developer Portfolio

An immersive developer portfolio that transforms projects, technologies, and areas of expertise into an explorable 3D constellation.

Built with **Next.js, TypeScript, React Three Fiber, Three.js, and custom GLSL shaders**, the project combines software engineering, interactive graphics, and cinematic navigation.

**[Explore the Live Portfolio](https://matias-portfolio-theta.vercel.app/)**

## Overview

Rather than presenting a conventional list of projects, this portfolio uses a connected stellar environment to visualize my development journey.

Each star represents an aspect of my work, including projects, technologies, disciplines, and personal identity. Visitors can explore relationships between nodes, navigate through a 3D environment, and discover the technical work behind each project.

The experience is designed around a simple principle: **engineering and creativity should complement one another.**

## Key Features

### Interactive 3D Constellation

- Connected graph of projects, technologies, disciplines, and identity nodes
- Interactive star selection, hover feedback, and relationship highlighting
- Atmospheric starfield, nebula effects, and spatial particles
- Custom stellar appearance using procedural shaders
- Responsive constellation composition across desktop, tablet, and mobile

### Cinematic Camera Navigation

- Smooth camera flights between selected nodes
- Quadratic Bézier trajectories and easing functions
- Context-aware framing of selected nodes and their relationships
- Automatic composition adjustments for information panels
- Manual camera interaction with OrbitControls
- Touch navigation supporting rotation, panning, and pinch-to-zoom

### Procedural Stellar Rendering

The stars are rendered with custom materials and layered visual effects informed by stellar structures, including:

- **Photosphere:** Procedural surface patterns and variations
- **Chromosphere:** Additional atmospheric color and depth
- **Corona:** Directional glow and surrounding stellar effects

Node lighting changes according to interaction state, including selection, hover, connected relationships, and camera arrival effects.

### Interactive Project Showcases

The portfolio includes visual demonstrations of featured engineering projects.

**Manatee Call Detector**

A research-oriented machine-learning application for detecting manatee vocalizations in underwater recordings.

The portfolio illustrates its signal-processing workflow through a synthetic waveform, time-frequency visualization, detection regions, and processing stages.

All illustrated signals are synthetic and are not derived from restricted research recordings or actual model output.

**AWS Voice Notes Organizer**

A serverless application that uses AWS services to transform recorded audio into searchable notes.

Its interactive demonstration illustrates a processing pipeline involving Amazon S3, Transcribe, and Comprehend.

The website demonstration uses sample data and does not execute live cloud requests.

**Interactive Developer Portfolio**

An architectural visualization highlighting the portfolio's rendering, navigation, and interaction systems.

## Technology Stack

| Area | Technologies |
|---|---|
| Framework | Next.js, React, TypeScript |
| 3D rendering | Three.js, React Three Fiber, React Three Drei |
| Shaders | GLSL |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Deployment | Vercel |
| Version control | Git, GitHub |

## Architecture

The application separates its interactive 3D environment from the surrounding portfolio content.

```text
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── constellation/
│   │   ├── ConstellationScene.tsx
│   │   ├── SceneContent.tsx
│   │   ├── ConstellationNode.tsx
│   │   ├── CinematicCameraController.tsx
│   │   └── ...
│   └── home/
│       ├── CinematicHero.tsx
│       ├── SelectedWorkSection.tsx
│       ├── ManateeSignalVisual.tsx
│       ├── VoiceNotesPipelineVisual.tsx
│       └── ...
├── data/
├── lib/
└── types/
```

**Rendering:** React Three Fiber manages the Three.js scene and component lifecycle.

**Graph relationships:** Structured node and edge data defines how projects, disciplines, and technologies are connected.

**Camera navigation:** Dedicated utilities calculate camera destinations, trajectories, and viewport-aware framing.

**Interaction:** Selection state coordinates visual highlighting, connected nodes, camera transitions, and information panels.

**Presentation:** The surrounding portfolio sections are implemented separately from the WebGL scene.

## Engineering Decisions

### Keeping Rendering and UI Responsibilities Separate

The Three.js scene handles spatial visualization, while React components manage interface elements such as navigation controls and project information panels.

This separation makes the system easier to maintain and allows the 3D experience to evolve independently of the surrounding content.

### Camera Movement as a Navigation System

Camera movement is designed to communicate relationships rather than simply move between fixed positions.

The camera system considers the selected node, nearby connected nodes, viewport dimensions, and available screen space.

Manual interaction remains available after cinematic transitions.

### Accessibility and Interaction

The portfolio includes:

- Keyboard-based constellation exploration
- Alternative navigation through an explorer interface
- Semantic page sections and accessible controls
- Reduced-motion support
- Responsive layouts and touch interactions
- Visible focus states

### Performance

The project was tested using Lighthouse and browser performance profiling.

Implemented performance techniques include:

- Dynamic loading of the 3D scene
- Pausing the render loop when the hero is outside the viewport
- Memoization of selected graph computations
- Reuse of temporary Three.js objects
- Optimized scroll-driven visual updates
- Separation of synthetic visual demonstrations from expensive live processing

The optimization strategy prioritizes maintaining visual and interactive quality while reducing unnecessary CPU and rendering work.

## Running Locally

**Requirements:** Node.js and npm compatible with the installed Next.js version.

Clone the repository:

```bash
git clone https://github.com/Matf021/matias-portfolio.git
cd matias-portfolio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To test a production build:

```bash
npm run build
npm run start
```

To run linting:

```bash
npm run lint
```

## Future Development

Potential future improvements include additional project visualizations, deeper interactive graphics experiments, and continued accessibility and performance refinements.

## Author

**Matias Franco**

Software Developer & Creative Technologist  
Toronto, Canada

[Live Portfolio](https://matias-portfolio-theta.vercel.app/) · [GitHub](https://github.com/Matf021)