import React from 'react';

interface NavigationProps {
  onJumpTo: (sectionId: string) => void;
  activeSection?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onJumpTo, activeSection = 'scene-1' }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-20 px-4 sm:px-8 md:px-12 flex items-center justify-between z-50 backdrop-blur-md bg-[#080820]/75 border-b border-white/10 transition-all duration-300">
      {/* Left Navigation Links: Page 1, Page 2, Page 3 */}
      <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[11px] sm:text-xs font-accent tracking-wider md:tracking-widest uppercase text-white/80">
        <button
          onClick={() => onJumpTo('scene-1')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
            activeSection === 'scene-1'
              ? 'text-amber-gold bg-white/10 font-bold shadow-sm'
              : 'hover:text-amber-gold'
          }`}
          title="Go to Page 1: Metropolis Canyon (Our Story)"
        >
          Our Story
        </button>
        <button
          onClick={() => onJumpTo('scene-2')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
            activeSection === 'scene-2'
              ? 'text-amber-gold bg-white/10 font-bold shadow-sm'
              : 'hover:text-amber-gold'
          }`}
          title="Go to Page 2: Our Mission"
        >
          Our Mission
        </button>
        <button
          onClick={() => onJumpTo('scene-3')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
            activeSection === 'scene-3'
              ? 'text-amber-gold bg-white/10 font-bold shadow-sm'
              : 'hover:text-amber-gold'
          }`}
          title="Go to Page 3: Our Advantages"
        >
          Advantages
        </button>
      </nav>

      {/* Center Brand Minimal Triangle Glyph */}
      <button
        onClick={() => onJumpTo('scene-1')}
        className="flex items-center justify-center p-2 group focus:outline-none"
        title="Back to Top (Home)"
      >
        <div className="w-8 h-8 relative flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current text-white group-hover:scale-110 transition-transform duration-300">
            <polygon points="12 3 22 21 2 21" strokeWidth="2" strokeLinejoin="round" />
            <line x1="6" y1="15" x2="18" y2="15" strokeWidth="1.8" />
          </svg>
        </div>
      </button>

      {/* Right Navigation Links: Page 4, Page 5, and Contact Button */}
      <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[11px] sm:text-xs font-accent tracking-wider md:tracking-widest uppercase text-white/80">
        <button
          onClick={() => onJumpTo('scene-4')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 hidden sm:inline-block ${
            activeSection === 'scene-4'
              ? 'text-amber-gold bg-white/10 font-bold shadow-sm'
              : 'hover:text-amber-gold'
          }`}
          title="Go to Page 4: A Model for Success"
        >
          Success Model
        </button>
        <button
          onClick={() => onJumpTo('scene-5')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
            activeSection === 'scene-5'
              ? 'text-amber-gold bg-white/10 font-bold shadow-sm'
              : 'hover:text-amber-gold'
          }`}
          title="Go to Page 5: Panoramic Horizon Vista"
        >
          Horizon Vista
        </button>
        <button
          onClick={() => onJumpTo('scene-5')}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/40 hover:border-amber-gold hover:text-amber-gold hover:bg-white/10 text-white transition-all duration-300"
          title="Jump to Contact Info at bottom"
        >
          Contact
        </button>
      </nav>
    </header>
  );
};
