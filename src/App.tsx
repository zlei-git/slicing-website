import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from './components/Navigation';
import { HUD } from './components/HUD';
import { AtmosphericCanvas } from './components/AtmosphericCanvas';

import { Scene1Canyon } from './components/scenes/Scene1Canyon';
import { Scene2LabWaterfall } from './components/scenes/Scene2LabWaterfall';
import { Scene3FusionCore } from './components/scenes/Scene3FusionCore';
import { Scene4CrucibleFoundry } from './components/scenes/Scene4CrucibleFoundry';
import { Scene5PanoramicLandscape } from './components/scenes/Scene5PanoramicLandscape';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  const lastScrollYRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      
      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      const dy = scrollY - lastScrollYRef.current;
      const velocity = (dy / dt) * 1000;

      lastScrollYRef.current = scrollY;
      lastTimeRef.current = now;

      setScrollProgress(progress);
      setScrollVelocity(velocity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJumpTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const directScene = searchParams ? searchParams.get('scene') : null;

  if (directScene === '1') return <Scene1Canyon />;
  if (directScene === '2') return <Scene2LabWaterfall />;
  if (directScene === '3') return <Scene3FusionCore />;
  if (directScene === '4') return <Scene4CrucibleFoundry />;
  if (directScene === '5') return <Scene5PanoramicLandscape />;

  return (
    <div className="relative w-full bg-[#18092a] text-white selection:bg-[#ff934f] selection:text-black">
      {/* Fixed Glassmorphic Navigation with all 5 Page Buttons */}
      <Navigation
        onJumpTo={handleJumpTo}
        activeSection={
          scrollProgress < 0.18
            ? 'scene-1'
            : scrollProgress < 0.38
            ? 'scene-2'
            : scrollProgress < 0.58
            ? 'scene-3'
            : scrollProgress < 0.78
            ? 'scene-4'
            : 'scene-5'
        }
      />

      {/* Atmospheric Real-Time Particle Canvas */}
      <AtmosphericCanvas scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />

      {/* HUD & Quick Jump Dots for all 5 Chapters */}
      <HUD
        scrollProgress={scrollProgress}
        onJumpTo={handleJumpTo}
      />

      {/* =====================================================================
          SEGESTA 5-PAGE INTERACTIVE CINEMATIC EXPERIENCE
          Page 1: Metropolis Canyon (Our Story)
          Page 2: Our Mission (page2-mission.mp4 fullscreen background)
          Page 3: Our Advantages (page3.mp4 fullscreen background)
          Page 4: Model for Success (page4.mp4 fullscreen background)
          Page 5: Panoramic Horizon Vista (Scenic landscape with observatory)
          ===================================================================== */}
      <main className="relative w-full flex flex-col">
        {/* Page 1: Metropolis Canyon */}
        <section id="scene-1" className="relative w-full min-h-screen flex items-center justify-center">
          <Scene1Canyon />
        </section>

        {/* Page 2: Our Mission */}
        <section id="scene-2" className="relative w-full min-h-screen flex items-center justify-center">
          <Scene2LabWaterfall />
        </section>

        {/* Page 3: Our Advantages */}
        <section id="scene-3" className="relative w-full min-h-screen flex items-center justify-center">
          <Scene3FusionCore />
        </section>

        {/* Page 4: Model for Success */}
        <section id="scene-4" className="relative w-full min-h-screen flex items-center justify-center">
          <Scene4CrucibleFoundry />
        </section>

        {/* Page 5: Panoramic Horizon Vista */}
        <section id="scene-5" className="relative w-full min-h-screen flex items-center justify-center">
          <Scene5PanoramicLandscape />
        </section>
      </main>
    </div>
  );
}
