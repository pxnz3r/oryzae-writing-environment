# Mycelium Animation System

## Concept

The animation visualizes a mycelium network — the underground root-like structure of fungi — growing from a central "question capsule" to connect with key words (spores) in the essay. This reinforces the essay's theme of thought as a slow, organic fermentation process.

## Lifecycle

Each connection path goes through three phases:

### 1. Growing
- **Trigger:** When fewer than `maxConnections` (3) paths exist and a random check (`Math.random() > 0.95`) passes
- **Selection:** An available `.spore` element (not already connected) within the viewport is chosen randomly
- **Animation:** `progress` increments by 0.02 per frame; `stroke-dashoffset` shrinks from `length` to `0`, drawing the path from source to target
- **Transition:** When `progress >= 1`, the path enters the sustained phase

### 2. Sustained
- The full path remains visible (`stroke-dashoffset = 0`)
- `life` counts down from a random value (100–300 frames ≈ 1.7–5s at 60fps)
- When `life <= 0`, the path transitions to dying

### 3. Dying
- `progress` decrements by 0.02 per frame
- `stroke-dashoffset` grows back toward `length`, retracting the path
- When `progress <= 0`, the target `.spore` loses its `connected` class and the path is removed

## Path Rendering

Each path is an SVG cubic bezier (`C` command):

```
M startX startY C cp1x cp1y, cp2x cp2y, endX endY
```

- **Source:** Right edge of the capsule element
- **Target:** Left edge of the spore element (+4px Y offset)
- **Control points:** Offset horizontally with a sinusoidal jitter (`Math.sin` / `Math.cos` over time + index) for organic, wavy movement

## Visual Styling

- **Stroke color:** `var(--color-accent-mycelium)` (#d4848c, rose)
- **Stroke width:** 1.5px with 0.6 opacity
- **Glow filter:** 2px Gaussian blur merged with the source graphic
- **Linear gradient:** Fades from full opacity at start to transparent at end
- **Target highlight:** Connected `.spore` elements change color to `#b56e75` and gain an underline via `.spore.connected::after`

## Event Handling

- **Resize:** All paths are cleared and `.spore` elements are reset (the animation restarts naturally)
- **Cleanup:** On component unmount, the `requestAnimationFrame` loop is cancelled and the resize listener removed

## Performance Considerations

- The animation uses `requestAnimationFrame` for smooth 60fps updates
- Path DOM elements are reused — only their `d` attribute is updated each frame
- `activePathsRef` avoids stale closures in the animation loop
- `setActivePaths` (re-render) is only called when paths are added or removed, not every frame
- Max 3 simultaneous connections to limit SVG path count
