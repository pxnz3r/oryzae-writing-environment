# Architecture

## Overview

The Oryzae Writing Environment is a single-page React application. All state and rendering are managed within `src/App.tsx`. The app displays a Japanese essay alongside a vertical-rl question capsule, connected by an animated SVG mycelium network.

## File Layout

```
index.html              — HTML shell (Vite entry)
src/
  main.tsx              — React root (StrictMode wrapper)
  App.tsx               — Main component (animation + layout)
  index.css             — Global styles, theme tokens, animations
vite.config.ts          — Vite config (React, Tailwind, env vars)
tsconfig.json           — TypeScript configuration
package.json            — Dependencies and scripts
metadata.json           — AI Studio deployment metadata
.env.example            — Environment variable template
```

## Data Flow

1. `main.tsx` mounts `<App />` inside `React.StrictMode`
2. `App.tsx` manages all state internally:
   - `activePaths` — array of `ActivePath` objects tracking SVG connections
   - `sourceRef` — ref to the question capsule (hyphae source)
   - `manuscriptRef` — ref to the article container (contains `.spore` targets)
   - `canvasRef` — ref to the SVG overlay where paths are drawn
3. A `requestAnimationFrame` loop (`manageLifecycle`) runs the animation lifecycle
4. On `resize`, all active paths are cleared

## Component Tree

```
<App>
  <svg id="mycelium-canvas">       — Full-screen SVG overlay
    <defs>
      <linearGradient>             — Hyphae gradient fade
      <filter id="glow">           — Gaussian blur glow
    </defs>
    {activePaths.map(path =>       — Rendered <path> elements
      <path id={path.id} />
    )}
  </svg>
  <div class="grid ...">
    <div>                          — Sticky vertical-rl question capsule
      <div ref={sourceRef} />      — "What does richness mean to me?"
    </div>
    <article ref={manuscriptRef}>  — Essay content
      <span class="spore"> ... </span>  — Connection targets
    </article>
  </div>
</App>
```

## Key Types

```ts
interface ActivePath {
  id: string;           // Unique SVG path element ID
  target: HTMLElement;  // The .spore element being connected to
  progress: number;     // 0–1, dashes offset for grow/die animation
  phase: 'growing' | 'sustained' | 'dying';
  life: number;         // Countdown ticks during 'sustained' phase
}
```

## Styling Approach

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- Custom theme tokens defined in `index.css` via `@theme`:
  - Soft paper-toned background (`--color-bg-paper`)
  - Rose/muted accent for mycelium (`--color-accent-mycelium`)
  - Capsule backgrounds and hairline borders
- Japanese-optimized fonts: `Shippori Mincho` (serif) and `Zen Kaku Gothic New` (sans)
- Keyframe animations: `pulse-border`, `fadeIn`
- `writing-vertical` class applies `writing-mode: vertical-rl` for the question capsule
