/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { useMyceliumAnimation } from './hooks/useMyceliumAnimation';
import MyceliumCanvas from './components/MyceliumCanvas';
import QuestionCapsule from './components/QuestionCapsule';
import EssayArticle from './components/EssayArticle';

/** Root layout: combines the SVG mycelium overlay with the essay reading interface */
export default function App() {
  const canvasRef = useRef<SVGSVGElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const manuscriptRef = useRef<HTMLElement>(null);

  const { activePaths } = useMyceliumAnimation({ sourceRef, manuscriptRef, canvasRef });

  return (
    <>
      <MyceliumCanvas canvasRef={canvasRef} activePaths={activePaths} />

      <div className="grid grid-cols-[1fr_240px_680px_1fr] max-w-[1400px] mx-auto relative pt-[120px] pb-[120px] max-lg:grid-cols-[1fr_60px_1fr_40px] max-lg:pt-[60px]">
        <QuestionCapsule sourceRef={sourceRef} />
        <EssayArticle manuscriptRef={manuscriptRef} />
      </div>
    </>
  );
}
