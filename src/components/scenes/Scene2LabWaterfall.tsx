import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Scene2LabWaterfall: React.FC = () => {
  return (
    <div className="relative w-full h-screen min-h-screen flex items-center justify-start overflow-hidden bg-[#0c0617]">
      {/* 1. FULLSCREEN BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          src="/page2-mission.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0617] via-[#0c0617]/80 md:via-[#0c0617]/65 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#18092a]/60 via-transparent to-[#0c0617]/70 z-10" />
      </div>

      {/* 2. FOREGROUND EDITORIAL CONTENT */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col justify-center h-full">
        <div className="max-w-xl text-left">
          {/* Main Title with Popup Animation (No small text above) */}
          <h2 className="anim-popup-title font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Our Mission
          </h2>

          <p className="anim-popup-p1 font-body text-slate-100 text-sm sm:text-base leading-relaxed mb-4 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            At Segesta, our purpose is to empower digital relationships through mobility. By designing and developing custom apps and mobile web apps, we act as a guide - leading our clients through the process of building complex digital products.
          </p>
          <p className="anim-popup-p2 font-body text-slate-200 text-xs sm:text-sm leading-relaxed mb-8 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            By designing and developing custom apps and mobile web apps, we act as a guide - leading our clients through every stage of technological evolution.
          </p>

          {/* Feature Tags with Popup Animation */}
          <div className="anim-popup-tags flex flex-wrap items-center gap-2.5 mb-8">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-accent tracking-wider text-slate-100 backdrop-blur-md hover:border-amber-gold/60 transition-colors shadow-sm">
              Custom Mobility
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-accent tracking-wider text-slate-100 backdrop-blur-md hover:border-amber-gold/60 transition-colors shadow-sm">
              Cloud Infrastructure
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-accent tracking-wider text-slate-100 backdrop-blur-md hover:border-amber-gold/60 transition-colors shadow-sm">
              Enterprise Scale
            </span>
          </div>

          {/* Action CTA Button with Popup Animation */}
          <div className="anim-popup-btn">
            <button
              onClick={() => {
                const el = document.getElementById('scene-3');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black font-accent text-xs tracking-widest uppercase font-bold hover:bg-amber-gold hover:text-black hover:shadow-[0_0_30px_rgba(255,147,79,0.6)] transition-all duration-300 group shadow-xl"
            >
              <span>Let's Build!</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
