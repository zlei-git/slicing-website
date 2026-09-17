import React from 'react';

export const TransitionCliff: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* SVG Splitting Boulders & Waterfall Precipice */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="cliff-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#411f52" />
            <stop offset="50%" stop-color="#1c1135" />
            <stop offset="100%" stop-color="#06030e" />
          </linearGradient>
        </defs>

        {/* Left Parting Boulder Group */}
        <g id="cliff-boulder-left">
          <polygon
            points="0,600 680,680 720,1080 0,1080"
            fill="url(#cliff-gradient)"
            stroke="#180e2b"
            strokeWidth="4"
          />
          <line x1="300" y1="750" x2="550" y2="920" stroke="#ff934f" strokeWidth="2" opacity="0.4" />
        </g>

        {/* Right Parting Boulder Group */}
        <g id="cliff-boulder-right">
          <polygon
            points="1920,600 1240,680 1200,1080 1920,1080"
            fill="url(#cliff-gradient)"
            stroke="#180e2b"
            strokeWidth="4"
          />
          <line x1="1620" y1="750" x2="1370" y2="920" stroke="#ff934f" strokeWidth="2" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
};
