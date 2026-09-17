import React, { useEffect, useRef } from 'react';

interface AtmosphericCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  scrollVelocity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  type: 'mist' | 'ember' | 'dust';
  life: number;
  maxLife: number;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({ scrollProgress, scrollVelocity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize initial ambient dust particles
    const particles: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        color: '255, 225, 160',
        type: 'dust',
        life: 0,
        maxLife: 99999
      });
    }
    particlesRef.current = particles;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const currentParticles = particlesRef.current;

      // Spawn Scene-Specific Atmospheric Particles
      // Scene 2: Waterfall mist (scrollProgress 0.28 - 0.48)
      if (scrollProgress >= 0.25 && scrollProgress <= 0.52 && Math.random() < 0.65) {
        currentParticles.push({
          x: width * 0.35 + (Math.random() - 0.5) * (width * 0.25),
          y: height * 0.85 + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -Math.random() * 2.2 - 0.5,
          radius: Math.random() * 3.5 + 1.2,
          alpha: 0.7,
          color: '56, 189, 248',
          type: 'mist',
          life: 0,
          maxLife: 60 + Math.random() * 30
        });
      }

      // Scene 4: Foundry embers/sparks (scrollProgress 0.65 - 0.86)
      if (scrollProgress >= 0.62 && scrollProgress <= 0.88 && Math.random() < 0.75) {
        currentParticles.push({
          x: width * 0.7 + (Math.random() - 0.5) * (width * 0.3),
          y: height * 0.95,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -Math.random() * 4.5 - 1.5,
          radius: Math.random() * 2.4 + 0.8,
          alpha: 0.95,
          color: '255, 147, 79',
          type: 'ember',
          life: 0,
          maxLife: 80 + Math.random() * 40
        });
      }

      // Update and Draw Particles
      for (let i = currentParticles.length - 1; i >= 0; i--) {
        const p = currentParticles[i];
        p.life++;

        // Velocity influence from scroll velocity
        const velInfluence = scrollVelocity * 0.0004;

        if (p.type === 'mist') {
          p.x += p.vx;
          p.y += p.vy - velInfluence * 20;
          p.radius += 0.08;
          p.alpha -= 0.012;
        } else if (p.type === 'ember') {
          p.x += p.vx + Math.sin(p.life * 0.1) * 0.6;
          p.y += p.vy - velInfluence * 40;
          p.alpha -= 0.011;
        } else {
          // Dust
          p.x += p.vx;
          p.y += p.vy - velInfluence * 15;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        if (p.alpha <= 0 || p.life > p.maxLife) {
          currentParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
        if (p.type === 'ember') {
          ctx.shadowColor = '#ff934f';
          ctx.shadowBlur = 8;
        } else if (p.type === 'mist') {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [scrollProgress, scrollVelocity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
};
