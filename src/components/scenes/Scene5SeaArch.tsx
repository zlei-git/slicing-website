import React from 'react';
import { Compass, Sun, ArrowRight } from 'lucide-react';
import { getAssetUrl } from '../../utils/assets';

export const Scene5SeaArch: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1a0415]">
      {/* 1. Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 filter brightness-85"
          src={getAssetUrl('segesta-dribbble.mp4')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0415]/90 via-[#360d30]/85 via-[#631c43]/80 to-[#080310]" />
      </div>

      {/* 2. MASSIVE TYPOGRAPHIC BACKGROUND LAYER ("BEYOND THE HORIZON") */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-display font-black text-[13vw] leading-none tracking-tight text-white/[0.04] uppercase whitespace-nowrap"
          style={{
            WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.08)',
          }}
        >
          BEYOND THE HORIZON
        </span>
      </div>

      {/* 3. EDITORIAL FOREGROUND CONTENT */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-14 py-28 flex flex-col justify-between min-h-screen items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-accent tracking-widest uppercase mb-6">
          <Sun className="w-4 h-4 text-amber-sun animate-spin" />
          <span>04 / THE SANCTUARY AT DAWN</span>
        </div>

        <div className="my-auto max-w-3xl">
          <h2 className="font-display font-bold text-5xl sm:text-7xl md:text-8xl text-white tracking-tight leading-tight mb-8 drop-shadow-xl">
            BEYOND THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-sun via-amber-gold to-[#f472b6]">
              HORIZON AHEAD
            </span>
          </h2>

          <p className="font-body text-slate-200 text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto mb-10 drop-shadow">
            Standing atop the coastal headland, the ancient beacon fire burns into the golden morning. The vast ocean stretches onward into uncharted realms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-gold to-amber-sun text-[#090314] font-accent font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(255,147,79,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Return to Summit</span>
              <Compass className="w-4 h-4" />
            </button>

            <a
              href="mailto:contact@webcareidn.com"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-accent font-semibold text-sm tracking-wider uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-2"
            >
              <span>Join The Expedition</span>
              <ArrowRight className="w-4 h-4 text-amber-gold" />
            </a>
          </div>
        </div>

        <div className="w-full pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-body">
          <div className="flex items-center gap-3">
            <span className="font-accent font-bold text-white tracking-widest uppercase">SEGESTA</span>
            <span className="text-slate-600">&bull;</span>
            <span>Crafted with Editorial Precision &amp; Webcare IDN Typography</span>
          </div>

          <div className="flex items-center gap-6 font-accent uppercase tracking-wider text-[11px]">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="text-amber-gold font-bold">&copy; 2026 Segesta Systems</span>
          </div>
        </div>
      </div>
    </div>
  );
};
