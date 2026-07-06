import { useEffect, useRef, useState, type RefObject } from 'react';

/** A single hypha path connecting the capsule to a spore word */
interface ActivePath {
  id: string;
  target: HTMLElement;
  progress: number;
  phase: 'growing' | 'sustained' | 'dying';
  life: number;
}

const MAX_CONNECTIONS = 3;
const GROWTH_RATE = 0.02;
const LIFE_MIN = 100;
const LIFE_RANGE = 200;

/** Generate a short unique id for each SVG path element */
function createPathId(): string {
  return 'path-' + Math.random().toString(36).substring(2, 11);
}

/** Get centre and edge coordinates of an element relative to the viewport */
function getElementCoords(elem: HTMLElement) {
  const rect = elem.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    right: rect.right,
    left: rect.left,
  };
}

export type { ActivePath };

interface UseMyceliumAnimationOptions {
  sourceRef: RefObject<HTMLDivElement | null>;
  manuscriptRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<SVGSVGElement | null>;
}

export function useMyceliumAnimation({
  sourceRef,
  manuscriptRef,
  canvasRef,
}: UseMyceliumAnimationOptions) {
  const [activePaths, setActivePaths] = useState<ActivePath[]>([]);
  const requestRef = useRef<number>();
  const activePathsRef = useRef<ActivePath[]>([]);

  useEffect(() => {
    function createPath(targetElement: HTMLElement): ActivePath {
      targetElement.classList.add('connected');
      return { id: createPathId(), target: targetElement, progress: 0, phase: 'growing', life: 0 };
    }

    function manageLifecycle() {
      if (!sourceRef.current || !manuscriptRef.current || !canvasRef.current) return;

      const spores = manuscriptRef.current.querySelectorAll('.spore');

      /* Spawn new connections if below the limit */
      if (activePathsRef.current.length < MAX_CONNECTIONS && Math.random() > 0.95) {
        const available = Array.from(spores).filter(
          (s) => !(s as HTMLElement).classList.contains('connected'),
        ) as HTMLElement[];
        if (available.length > 0) {
          const pick = available[Math.floor(Math.random() * available.length)];
          const rect = pick.getBoundingClientRect();
          if (rect.top > 0 && rect.bottom < window.innerHeight) {
            activePathsRef.current.push(createPath(pick));
            setActivePaths([...activePathsRef.current]);
          }
        }
      }

      const srcCoords = getElementCoords(sourceRef.current);
      const startX = srcCoords.right;
      const startY = srcCoords.y;
      let needsUpdate = false;

      activePathsRef.current.forEach((obj, index) => {
        const targetCoords = getElementCoords(obj.target);
        const endX = targetCoords.left;
        const endY = targetCoords.y + 4;

        /* Wavy control points for organic bezier curves */
        const cp1x = startX + 80 + Math.sin(Date.now() / 1000 + index) * 20;
        const cp1y = startY;
        const cp2x = endX - 80 + Math.cos(Date.now() / 800 + index) * 20;
        const cp2y = endY;

        const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        const el = document.getElementById(obj.id) as unknown as SVGPathElement | null;
        if (!el) return;

        el.setAttribute('d', d);
        const length = el.getTotalLength();
        el.style.strokeDasharray = String(length);

        if (obj.phase === 'growing') {
          obj.progress += GROWTH_RATE;
          if (obj.progress >= 1) {
            obj.progress = 1;
            obj.phase = 'sustained';
            obj.life = LIFE_MIN + Math.random() * LIFE_RANGE;
          }
          el.style.strokeDashoffset = String(length * (1 - obj.progress));
        } else if (obj.phase === 'sustained') {
          el.style.strokeDashoffset = '0';
          obj.life--;
          if (obj.life <= 0) obj.phase = 'dying';
        } else if (obj.phase === 'dying') {
          obj.progress -= GROWTH_RATE;
          el.style.strokeDashoffset = String(length * (1 - obj.progress));
          if (obj.progress <= 0) {
            obj.target.classList.remove('connected');
            activePathsRef.current.splice(index, 1);
            needsUpdate = true;
          }
        }
      });

      if (needsUpdate) setActivePaths([...activePathsRef.current]);
      requestRef.current = requestAnimationFrame(manageLifecycle);
    }

    requestRef.current = requestAnimationFrame(manageLifecycle);

    function handleResize() {
      activePathsRef.current.forEach((p) => p.target.classList.remove('connected'));
      activePathsRef.current = [];
      setActivePaths([]);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [sourceRef, manuscriptRef, canvasRef]);

  return { activePaths };
}
