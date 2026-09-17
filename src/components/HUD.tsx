import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HUDProps {
  scrollProgress: number;
  onJumpTo: (sectionId: string) => void;
}

const CHAPTERS = [
  { id: 'scene-1', name: '01 / Metropolis Canyon' },
  { id: 'scene-2', name: '02 / Our Mission' },
  { id: 'scene-3', name: '03 / Our Advantages' },
  { id: 'scene-4', name: '04 / Model for Success' },
  { id: 'scene-5', name: '05 / Panoramic Horizon' },
];

export const HUD: React.FC<HUDProps> = ({ scrollProgress, onJumpTo }) => {
  let activeIndex = 0;
  if (scrollProgress < 0.18) activeIndex = 0;
  else if (scrollProgress < 0.38) activeIndex = 1;
  else if (scrollProgress < 0.58) activeIndex = 2;
  else if (scrollProgress < 0.78) activeIndex = 3;
  else activeIndex = 4;

  return (
    <>
      {/* Right Chapter Quick Dots */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-5">
        {CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => onJumpTo(ch.id)}
            className="group flex items-center gap-3 focus:outline-none"
            title={ch.name}
          >
            <span
              className={`text-[11px] font-accent tracking-widest uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:inline-block ${
                activeIndex === idx ? 'text-amber-gold font-bold' : 'text-slate-400'
              }`}
            >
              {ch.name}
            </span>
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'bg-amber-gold scale-125 shadow-[0_0_10px_#ff934f]'
                  : 'bg-white/20 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Bottom Right Scroll Down Helper */}
      <div className="fixed bottom-8 right-8 md:right-14 z-40 flex items-center gap-3">
        <button
          onClick={() => {
            const nextIdx = Math.min(CHAPTERS.length - 1, activeIndex + 1);
            onJumpTo(CHAPTERS[nextIdx].id);
          }}
          className="w-10 h-10 rounded-full border border-white/20 bg-[#06030e]/70 backdrop-blur-md flex items-center justify-center text-slate-200 hover:text-white hover:border-white transition-all duration-200 shadow-lg"
          title="Advance to next chapter"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </>
  );
};
