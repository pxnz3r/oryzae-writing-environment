# Oryzae Writing Environment

A Japanese essay-reading interface featuring an animated mycelium (菌糸体) visual effect. As you read, glowing hyphae-like paths grow from a question capsule to connect with highlighted "spore" words in the text — a visual metaphor for the fermentation of thought.

Built with React, TypeScript, Vite, and Tailwind CSS v4.

## Features

- **Animated Mycelium Network** — SVG paths pulse and grow toward key words, mimicking fungal hyphae
- **Japanese Essay Layout** — Traditional vertical-rl capsule with a horizontal reading column
- **Interactive Spore Words** — Words in the essay become connection points for the mycelium animation
- **Glow Effects** — Subtle SVG filter glow on active hyphae paths

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open http://localhost:3000 in your browser.

## Live Demo

[https://pxnz3r.github.io/oryzae-writing-environment/](https://pxnz3r.github.io/oryzae-writing-environment/)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` directory |

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite 6** — Build tool with HMR
- **Tailwind CSS v4** — Utility-first styling with `@tailwindcss/vite` plugin

## Project Structure

```
src/
  App.tsx        # Main component: mycelium animation + essay layout
  main.tsx       # React entry point
  index.css      # Tailwind imports, theme tokens, custom keyframes

docs/
  ARCHITECTURE.md  # Codebase architecture overview
  ANIMATION.md     # Mycelium animation system details
```

## License

Apache 2.0
