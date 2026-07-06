/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

// Types for the animation
interface ActivePath {
  id: string;
  target: HTMLElement;
  progress: number;
  phase: 'growing' | 'sustained' | 'dying';
  life: number;
}

export default function App() {
  const canvasRef = useRef<SVGSVGElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const manuscriptRef = useRef<HTMLElement>(null);
  const [activePaths, setActivePaths] = useState<ActivePath[]>([]);
  const requestRef = useRef<number>();
  const activePathsRef = useRef<ActivePath[]>([]); // Use ref for mutable state in animation loop

  useEffect(() => {
    const maxConnections = 3;

    const createPath = (targetElement: HTMLElement): ActivePath => {
      const pathId = 'path-' + Math.random().toString(36).substring(2, 11);
      targetElement.classList.add('connected');
      
      return {
        id: pathId,
        target: targetElement,
        progress: 0,
        phase: 'growing',
        life: 0
      };
    };

    const getCoordinates = (elem: HTMLElement) => {
      const rect = elem.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        right: rect.right,
        left: rect.left
      };
    };

    const manageLifecycle = () => {
      if (!sourceRef.current || !manuscriptRef.current || !canvasRef.current) return;

      const spores = manuscriptRef.current.querySelectorAll('.spore');
      
      // Spawn new paths
      if (activePathsRef.current.length < maxConnections && Math.random() > 0.95) {
        const availableSpores = Array.from(spores).filter(s => !s.classList.contains('connected')) as HTMLElement[];
        if (availableSpores.length > 0) {
          const randomSpore = availableSpores[Math.floor(Math.random() * availableSpores.length)];
          const rect = randomSpore.getBoundingClientRect();
          if (rect.top > 0 && rect.bottom < window.innerHeight) {
            activePathsRef.current.push(createPath(randomSpore));
            // Trigger re-render to add the SVG path element
            setActivePaths([...activePathsRef.current]);
          }
        }
      }

      // Update paths
      const srcCoords = getCoordinates(sourceRef.current);
      const startX = srcCoords.right;
      const startY = srcCoords.y;
      
      let needsUpdate = false;

      activePathsRef.current.forEach((obj, index) => {
        const targetCoords = getCoordinates(obj.target);
        const endX = targetCoords.left;
        const endY = targetCoords.y + 4;

        const cp1x = startX + 80 + (Math.sin(Date.now() / 1000 + index) * 20);
        const cp1y = startY;
        
        const cp2x = endX - 80 + (Math.cos(Date.now() / 800 + index) * 20);
        const cp2y = endY;

        const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        
        const pathElement = document.getElementById(obj.id) as SVGPathElement | null;
        if (pathElement) {
          pathElement.setAttribute("d", d);
          const length = pathElement.getTotalLength();
          pathElement.style.strokeDasharray = length.toString();
          
          if (obj.phase === 'growing') {
            obj.progress += 0.02;
            if (obj.progress >= 1) {
              obj.progress = 1;
              obj.phase = 'sustained';
              obj.life = 100 + Math.random() * 200;
            }
            pathElement.style.strokeDashoffset = (length * (1 - obj.progress)).toString();
          } else if (obj.phase === 'sustained') {
            pathElement.style.strokeDashoffset = '0';
            obj.life--;
            if (obj.life <= 0) obj.phase = 'dying';
          } else if (obj.phase === 'dying') {
            obj.progress -= 0.02;
            pathElement.style.strokeDashoffset = (length * (1 - obj.progress)).toString();
            if (obj.progress <= 0) {
              obj.target.classList.remove('connected');
              activePathsRef.current.splice(index, 1);
              needsUpdate = true;
            }
          }
        }
      });

      if (needsUpdate) {
        setActivePaths([...activePathsRef.current]);
      }

      requestRef.current = requestAnimationFrame(manageLifecycle);
    };

    requestRef.current = requestAnimationFrame(manageLifecycle);

    const handleResize = () => {
      activePathsRef.current.forEach(p => {
        p.target.classList.remove('connected');
      });
      activePathsRef.current = [];
      setActivePaths([]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <svg 
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-10" 
        id="mycelium-canvas" 
        ref={canvasRef}
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
        {activePaths.map(path => (
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

      <div className="grid grid-cols-[1fr_240px_680px_1fr] max-w-[1400px] mx-auto relative pt-[120px] pb-[120px] max-lg:grid-cols-[1fr_60px_1fr_40px] max-lg:pt-[60px]">
        
        <div className="col-start-2 relative flex justify-end pr-[48px] max-lg:pr-[10px] fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="sticky top-[20vh] h-max">
            <div 
              ref={sourceRef}
              className="bg-capsule-bg border border-capsule-border rounded-full py-[32px] px-[14px] writing-vertical font-serif text-[1.1rem] tracking-[0.15em] text-text-ink shadow-[0_4px_20px_rgba(180,140,145,0.08)] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative z-20 select-none hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(180,140,145,0.15)] hover:border-accent-mycelium group"
            >
              <div className="absolute -inset-[4px] rounded-full border border-accent-mycelium opacity-30 scale-100 animate-pulse-border transition-all duration-500 pointer-events-none"></div>
              自分にとって豊かさとは何か
            </div>
          </div>
        </div>

        <article ref={manuscriptRef} className="col-start-3 text-[1.15rem] text-[#4a4242] fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="font-sans text-[0.85rem] text-text-meta mb-[4rem] flex gap-[24px] border-b border-hairline pb-[24px]">
            <span>思考のエッセイ</span>
            <span>2023年10月</span>
            <span>読了時間: 4分</span>
          </div>

          <h1 className="text-[4.5rem] font-medium mb-[2rem] tracking-[-0.02em] leading-[1.2] text-[#2d2626] max-lg:text-[3rem]">
            発酵する思考
          </h1>

          <p className="mb-[2.5rem] text-justify">
            思考とは、真空の中で生まれるものではない。それは<span className="spore">土壌</span>のようなものだ。無数の断片的な記憶、感情、そして外部からの刺激が混ざり合い、静かな時間をかけて変質していくプロセスである。私たちは即時的な答えを求めがちだが、真の理解は、まるで微生物が有機物を分解するように、ゆっくりとした<span className="spore">発酵</span>を経て初めて醸成される。
          </p>

          <p className="mb-[2.5rem] text-justify">
            「待つ」という行為は、現代において最も贅沢で、かつ困難な技術となった。スマートフォンを開けば数秒で答えが見つかる世界において、未解決の<span className="spore">問い</span>を抱え続けることは苦痛を伴う。しかし、答えが出ない空白の時間こそが、思考の菌糸が伸びるための不可欠な余白なのだ。
          </p>

          <p className="mb-[2.5rem] text-justify">
            日本酒造りにおいて、杜氏は麹菌の機謙を伺い、温度や湿度を微細に調整する。彼らは菌をコントロールするのではなく、菌が<span className="spore">活動</span>しやすい環境を整えるに過ぎない。私たちの創造性も同様ではないだろうか。新しいアイデアを無理やり絞り出すのではなく、自分自身の内面を整え、偶然のひらめきが降りてくるのを<span className="spore">待つ</span>姿勢。それが「発酵する思考」の正体である。
          </p>

          <p className="mb-[2.5rem] text-justify">
            腐敗と発酵の違いは、人間にとって有益か否かという主観的な境界線に過ぎない。失敗や挫折といったネガティブな経験も、適切な環境と時間さえあれば、人生を味わい深くする<span className="spore">旨味</span>へと変化しうる。重要なのは、そのプロセスを急がないことだ。焦燥感は、繊細な菌の働きを阻害する雑菌のようなものである。
          </p>

          <p className="mb-[2.5rem] text-justify">
            静寂の中に身を置き、自分の内なる声に耳を傾けるとき、思考は個人の枠を超えて<span className="spore">広がる</span>。それはまるで、森の地下に広がるマイセリウム（菌糸体）のネットワークのように、見えないところで他者や世界と繋がっているのかもしれない。私たちが「自分の考え」だと思っているものは、実は長い歴史の中で受け継がれてきた知恵の<span className="spore">胞子</span>が、たまたま私という個体に着床し、芽吹いた結果に過ぎないのだから。
          </p>
          
          <p className="mb-[2.5rem] text-justify">
            だからこそ、私たちは問い続けなければならない。目に見える成果や数字だけを追い求めるのではなく、目に見えない<span className="spore">プロセス</span>にこそ価値を見出すこと。それが、この加速する世界で人間性を保ち続けるための、唯一の抵抗手段なのかもしれない。
          </p>

        </article>
      </div>
    </>
  );
}
