import type { RefObject } from 'react';

interface QuestionCapsuleProps {
  sourceRef: RefObject<HTMLDivElement | null>;
}

/** Vertical-rl capsule that serves as the source node for mycelium connections */
export default function QuestionCapsule({ sourceRef }: QuestionCapsuleProps) {
  return (
    <div className="col-start-2 relative flex justify-end pr-[48px] max-lg:pr-[10px] fade-in"
      style={{ animationDelay: '0.2s' }}>
      <div className="sticky top-[20vh] h-max">
        <div
          ref={sourceRef}
          className="bg-capsule-bg border border-capsule-border rounded-full py-[32px] px-[14px] writing-vertical font-serif text-[1.1rem] tracking-[0.15em] text-text-ink shadow-[0_4px_20px_rgba(180,140,145,0.08)] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative z-20 select-none hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(180,140,145,0.15)] hover:border-accent-mycelium group"
        >
          <div className="absolute -inset-[4px] rounded-full border border-accent-mycelium opacity-30 scale-100 animate-pulse-border transition-all duration-500 pointer-events-none" />
          自分にとって豊かさとは何か
        </div>
      </div>
    </div>
  );
}
