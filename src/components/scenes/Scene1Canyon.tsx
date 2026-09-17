import React from 'react';
import { ArrowDown } from 'lucide-react';

export const Scene1Canyon: React.FC = () => {
  return (
    <div className="relative w-full h-screen min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#18092a]">
      {/* 1. FULLSCREEN USER PHOTO AS HOMEPAGE BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <img
          src="/hero-metropolis-canyon.jpg"
          alt="Segesta Metropolis Canyon"
          className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
        />
        {/* Soft atmospheric vignettes for pristine typography readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080820]/60 via-transparent via-50% to-[#0c0617]/75 z-10 pointer-events-none" />
      </div>

      {/* Top spacing for fixed navbar */}
      <div className="w-full h-24 relative z-20" />

      {/* 2. S E G E S T A HERO TYPOGRAPHY (Popup Animated) */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 my-auto select-none">
        <h1 className="anim-popup-title font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-[0.26em] text-white uppercase drop-shadow-[0_8px_40px_rgba(0,0,0,0.95)]">
          SEGESTA
        </h1>
        <p className="anim-popup-p1 font-accent font-semibold text-xs sm:text-base md:text-lg tracking-[0.45em] text-white/95 uppercase mt-3 sm:mt-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
          INNOVATIVE SOLUTIONS
        </p>
      </div>

      {/* 3. BOTTOM EDITORIAL SCROLL PROMPT */}
      <div className="relative z-20 pb-10 flex flex-col items-center gap-3">
        <button
          onClick={() => {
            const el = document.getElementById('scene-2');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="anim-popup-btn group flex flex-col items-center gap-2.5 text-white hover:text-amber-gold transition-colors duration-300 focus:outline-none"
        >
          <span className="font-accent tracking-[0.35em] text-xs uppercase font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            Explore Our Mission
          </span>
          <div className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center group-hover:border-amber-gold group-hover:scale-110 transition-all duration-300 backdrop-blur-md bg-black/40 shadow-xl">
            <ArrowDown className="w-4 h-4 text-white group-hover:text-amber-gold transition-colors" />
          </div>
        </button>
      </div>
    </div>
  );
};
