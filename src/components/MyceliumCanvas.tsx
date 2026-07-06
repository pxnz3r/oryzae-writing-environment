import type { RefObject } from 'react';
import type { ActivePath } from '../hooks/useMyceliumAnimation';

interface MyceliumCanvasProps {
  canvasRef: RefObject<SVGSVGElement | null>;
  activePaths: ActivePath[];
}

/** Full-screen SVG overlay that draws the glowing hyphae paths */
export default function MyceliumCanvas({ canvasRef, activePaths }: MyceliumCanvasProps) {
  return (
    <svg
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hyphae-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'var(--color-accent-mycelium)', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent-mycelium)', stopOpacity: 0 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {activePaths.map((path) => (
        <path
          key={path.id}
          id={path.id}
          fill="none"
          stroke="var(--color-accent-mycelium)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          filter="url(#glow)"
        />
      ))}
    </svg>
  );
}
