import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

export const Scene5PanoramicLandscape: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * 8;
      setMouseOffset({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#120722]">
      {/* 1. ATMOSPHERIC SKY GRADIENT (Sunset to Deep Twilight) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b0834] via-[#4a1854] via-[#92355e] via-[#e2694b] to-[#ff9752] z-0" />

      {/* 2. AMBIENT STARS & MIST PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-8 left-1/5 w-1 h-1 rounded-full bg-white/70 animate-pulse" />
        <div className="absolute top-16 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-200/80 animate-ping" />
        <div className="absolute top-24 right-1/4 w-1 h-1 rounded-full bg-white/80 animate-pulse" />
        <div className="absolute top-12 right-1/6 w-1.5 h-1.5 rounded-full bg-cyan-200/90" />
        <div className="absolute top-32 left-1/2 w-1 h-1 rounded-full bg-white/60" />
        <div className="absolute top-1/4 left-0 w-full h-48 bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-0 w-full h-56 bg-gradient-to-t from-[#1b0834]/70 via-transparent to-transparent blur-xl" />
      </div>

      {/* 3. PURE VECTOR PANORAMIC LANDSCAPE ARTWORK */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`
        }}
      >
        <defs>
          <linearGradient id="vista-mtn-back" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7a2b6f" />
            <stop offset="100%" stopColor="#3d1445" />
          </linearGradient>

          <linearGradient id="vista-mtn-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9b3d68" />
            <stop offset="60%" stopColor="#4f1a46" />
            <stop offset="100%" stopColor="#250b2e" />
          </linearGradient>

          <linearGradient id="vista-cliff-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#140620" />
            <stop offset="70%" stopColor="#37123f" />
            <stop offset="100%" stopColor="#c75845" />
          </linearGradient>

          <linearGradient id="vista-cliff-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#140620" />
            <stop offset="70%" stopColor="#37123f" />
            <stop offset="100%" stopColor="#c75845" />
          </linearGradient>

          <linearGradient id="vista-river" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#a5f3fc" />
            <stop offset="65%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="vista-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>

          <filter id="vista-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LAYER 1: DISTANT HIGH-ALTITUDE MOUNTAINS --- */}
        <g id="distant-peaks" opacity="0.95">
          <polygon points="120,560 380,310 640,560" fill="url(#vista-mtn-back)" />
          <polygon points="380,310 640,560 520,560" fill="#602159" opacity="0.75" />

          <polygon points="680,560 960,220 1240,560" fill="url(#vista-mtn-back)" />
          <polygon points="960,220 1240,560 1100,560" fill="#50184b" opacity="0.8" />
          <polygon points="960,220 840,560 680,560" fill="#933a7e" opacity="0.6" />

          <polygon points="1200,560 1480,280 1760,560" fill="url(#vista-mtn-back)" />
          <polygon points="1480,280 1760,560 1620,560" fill="#602159" opacity="0.7" />
          <polygon points="1600,560 1820,380 1960,560" fill="#4d1645" />
        </g>

        {/* --- LAYER 2: MIDGROUND ROLLING MESAS --- */}
        <g id="midground-mesas">
          <path
            d="M-50,680 L280,540 L520,590 L760,520 L960,570 L1180,520 L1460,590 L1720,530 L1980,680 L1980,1080 L-50,1080 Z"
            fill="url(#vista-mtn-mid)"
          />
          <path d="M-50,680 L280,540 L520,590" stroke="#f472b6" strokeWidth="2.5" opacity="0.5" fill="none" />
          <path d="M760,520 L960,570 L1180,520" stroke="#fb923c" strokeWidth="2" opacity="0.6" fill="none" />
          <path d="M1460,590 L1720,530 L1980,680" stroke="#f472b6" strokeWidth="2" opacity="0.5" fill="none" />
        </g>

        {/* --- LAYER 3: FLOATING SCI-FI SKY CRAFTS --- */}
        <g id="sky-drones">
          <g transform="translate(420, 260) scale(0.9)">
            <ellipse cx="0" cy="0" rx="36" ry="6" fill="#1b082e" />
            <polygon points="-24,-2 0,-14 24,-2 0,4" fill="#2d1045" />
            <circle cx="0" cy="-6" r="3" fill="#38bdf8" filter="url(#vista-glow)" />
            <line x1="-30" y1="2" x2="30" y2="2" stroke="#ff934f" strokeWidth="1.5" />
          </g>

          <g transform="translate(1440, 240) scale(0.75)">
            <ellipse cx="0" cy="0" rx="28" ry="5" fill="#1b082e" />
            <circle cx="0" cy="-4" r="2.5" fill="#f43f5e" filter="url(#vista-glow)" />
            <line x1="-20" y1="1" x2="20" y2="1" stroke="#fcd34d" strokeWidth="1.2" />
          </g>

          <path d="M320,510 Q960,460 1600,510" stroke="#260b37" strokeWidth="6" fill="none" />
          <path d="M320,512 Q960,462 1600,512" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="16 12" opacity="0.8" fill="none" />
          <rect x="910" y="474" width="48" height="8" rx="4" fill="#ffffff" filter="url(#vista-glow)" />
        </g>

        {/* --- LAYER 4: GRAND CANYON & GLOWING RIVER --- */}
        <g id="canyon-river">
          <polygon points="640,640 1280,640 1480,1080 440,1080" fill="#0d0316" />
          <path
            d="M960,540 C930,620 1000,720 940,820 C880,920 980,1000 960,1080"
            stroke="url(#vista-river)"
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
            filter="url(#vista-glow)"
          />
          <path
            d="M960,540 C930,620 1000,720 940,820 C880,920 980,1000 960,1080"
            stroke="#ffffff"
            strokeWidth="14"
            strokeDasharray="24 16"
            strokeLinecap="round"
            opacity="0.95"
            fill="none"
          />
        </g>

        {/* --- LAYER 5: CLIFFS & OBSERVATION DECK --- */}
        <g id="foreground-cliffs">
          <polygon points="0,480 380,660 480,820 420,1080 0,1080" fill="url(#vista-cliff-left)" />
          <path d="M0,480 L380,660 L480,820 L420,1080" stroke="#ff934f" strokeWidth="4" opacity="0.85" fill="none" />

          <polygon points="1920,480 1540,660 1440,820 1500,1080 1920,1080" fill="url(#vista-cliff-right)" />
          <path d="M1920,480 L1540,660 L1440,820 L1500,1080" stroke="#ff934f" strokeWidth="4" opacity="0.85" fill="none" />
        </g>

        {/* Observation Platform */}
        <g id="observation-deck">
          <polygon points="760,780 1160,780 1240,880 680,880" fill="#17072a" stroke="#3b1559" strokeWidth="3" />
          <line x1="760" y1="780" x2="1160" y2="780" stroke="#ff934f" strokeWidth="3" />
          <polygon points="760,740 1160,740 1160,780 760,780" fill="url(#vista-glass)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
          <line x1="760" y1="740" x2="1160" y2="740" stroke="#38bdf8" strokeWidth="2.5" filter="url(#vista-glow)" />

          {/* Scientist Silhouettes */}
          <g transform="translate(860, 725)">
            <path d="M0,0 L-7,35 L7,35 Z" fill="#090211" />
            <path d="M3,12 L22,4" stroke="#ff934f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M-3,12 L-8,24" stroke="#ff934f" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="-6" r="5" fill="#fcd34d" />
          </g>

          <g transform="translate(920, 726)">
            <path d="M0,0 L-6,34 L6,34 Z" fill="#090211" />
            <path d="M-3,12 L3,20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M3,12 L3,20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <polygon points="2,16 14,12 16,22 4,26" fill="#38bdf8" opacity="0.8" filter="url(#vista-glow)" />
            <circle cx="0" cy="-6" r="5" fill="#fcd34d" />
          </g>

          <g transform="translate(1040, 727)">
            <path d="M0,0 L-6,33 L6,33 Z" fill="#090211" />
            <circle cx="0" cy="-5" r="4.5" fill="#fcd34d" />
          </g>
          <g transform="translate(1070, 728)">
            <path d="M0,0 L-6,32 L6,32 Z" fill="#090211" />
            <circle cx="0" cy="-5" r="4.5" fill="#fcd34d" />
          </g>
        </g>
      </svg>

      {/* 4. FOREGROUND EDITORIAL CONTENT */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-16 pt-28 pb-6 flex flex-col justify-between h-full">
        <div className="max-w-xl text-left">
          

          <h2 className={`font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] ${isVisible ? "anim-popup-title" : "opacity-0"}`}>

            Panoramic Vista & Frontier
          </h2>

          <p className={`font-body text-slate-100 text-sm sm:text-base leading-relaxed mb-4 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${isVisible ? "anim-popup-p1" : "opacity-0"}`}>

            Standing at the precipice between conceptual vision and digital execution. Segesta bridges subterranean infrastructure with soaring interactive frontiers.
          </p>
          <p className={`font-body text-slate-200 text-xs sm:text-sm leading-relaxed mb-8 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${isVisible ? "anim-popup-p2" : "opacity-0"}`}>

            Every layer of our methodology is engineered for long-range durability — charting pathways across uncharted technological landscapes for forward-thinking enterprises.
          </p>

          <div className={`flex flex-wrap items-center gap-4 ${isVisible ? "anim-popup-btn" : "opacity-0"}`}>

            <a
              href="mailto:contact@segesta.solutions"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black font-accent text-xs tracking-widest uppercase font-bold hover:bg-amber-gold hover:text-black hover:shadow-[0_0_30px_rgba(255,147,79,0.6)] transition-all duration-300 group shadow-xl"
            >
              <span>Start Your Project</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('scene-1');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/30 text-white font-accent text-xs tracking-widest uppercase font-semibold hover:border-amber-gold hover:text-amber-gold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* 5. CLOSING BRAND FOOTER */}
        <footer className="w-full pt-4 mt-auto border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-accent tracking-widest uppercase text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border border-white/30 rounded flex items-center justify-center text-white text-[10px]">
              ▲
            </div>
            <span>SEGESTA &bull; INNOVATIVE SOLUTIONS &copy; 2026</span>
          </div>
          <div className="flex items-center gap-8 text-slate-300">
            <span className="hover:text-white transition-colors cursor-pointer">Studio V&Oslash;R</span>
            <span className="hover:text-white transition-colors cursor-pointer">Zak Steele-Eklund</span>
            <a href="mailto:contact@segesta.solutions" className="hover:text-amber-gold transition-colors font-bold text-white">
              Get In Touch
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
