/**
 * SEGESTA — Native Parallax Camera & Living 3D Orchestrator
 * Integrates Three.js 3D WebGL Boids, Rigged Animated SVG Characters,
 * and Spacious Editorial Scroll Flow.
 * 
 * Conforms to PRD Section 5, 10, 14: HTML5, CSS3, Vanilla JS only.
 * Zero external runtime libraries. Zero CDN dependencies.
 */

(function () {
  'use strict';

  // Chapter Configuration (Gateway 00 + 9 Chapters = 10 Sections)
  const CHAPTERS = [
    { id: 'hero-gateway', name: '00 / Gateway', title: 'The Threshold', desc: 'The Threshold • 3D Living Avian Domain & Kinetic Rings' },
    { id: 'chapter-1', name: '01 / Hero', title: 'Our Mission', desc: 'Futuristic Studio • Central Waterfall & Living Scientists' },
    { id: 'chapter-2', name: '02 / Canyon', title: 'The Urban Canyon', desc: 'Symmetrical City Perspectives • Suspension Skybridge' },
    { id: 'chapter-3', name: '03 / Mission', title: 'Form & Function', desc: 'Studio Frame Return • 60 FPS Architectural Lock' },
    { id: 'chapter-4', name: '04 / Descent', title: 'Cavern Conduit', desc: 'Subterranean Descent • Approaching Kinetic Core' },
    { id: 'chapter-5', name: '05 / Advantages', title: 'Our Advantages', desc: 'Kinetic Turbine Reactor • Catwalk Technicians' },
    { id: 'chapter-6', name: '06 / Smelting', title: 'Thermal Conduit', desc: 'Smelting Crucible • High-Load Engineering' },
    { id: 'chapter-7', name: '07 / Model', title: 'A Model For Success', desc: 'Molten Towers • Attentiveness as a Priority' },
    { id: 'chapter-8', name: '08 / Arch Portal', title: 'Horizon Reveal', desc: 'Cavern Arch Portal • Industrial to Organic Vista' },
    { id: 'chapter-9', name: '09 / Sunset Vista', title: 'The Horizon Ahead', desc: 'Faceted Purple Mountains • Calm Mirror Ocean' }
  ];

  // DOM Cache
  const scrollTrack = document.getElementById('scroll-track');
  const progressBar = document.getElementById('global-scroll-bar');
  const statusBadge = document.getElementById('status-badge');
  const statusDesc = document.getElementById('status-desc');
  const hudDots = document.querySelectorAll('.hud-dot-wrap');
  const sceneChambers = document.querySelectorAll('.scene-chamber');
  const scrollDownBtn = document.getElementById('scroll-down-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const mobileToggleBtn = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const canvas = document.getElementById('ambient-canvas');
  const heroFlockBtn = document.getElementById('hero-summon-flock-btn');

  // Animation Runtime State
  let currentScrollY = 0;
  let targetScrollY = 0;
  let maxScrollY = 1;
  let activeChapterIndex = 0;
  let mouseX = 0;
  let mouseY = 0;
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Window Dimension Sync
  function updateDimensions() {
    maxScrollY = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  window.addEventListener('resize', updateDimensions, { passive: true });
  updateDimensions();

  // Watch Accessibility Prefers-Reduced-Motion
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    isReducedMotion = e.matches;
  });

  // Native Scroll Listener
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  // Desktop Mouse Tilt Listener
  window.addEventListener('mousemove', (e) => {
    mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 28;
    mouseTargetY = (e.clientY / window.innerHeight - 0.5) * 28;
  }, { passive: true });

  // 3D Flock Interaction Button
  if (heroFlockBtn) {
    heroFlockBtn.addEventListener('click', () => {
      if (window.Segesta3D) {
        window.Segesta3D.triggerSwoop();
      }
    });
  }

  // Mobile Drawer Navigation Toggle
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Smooth Chapter Jump Utility
  function scrollToChapter(index) {
    const clampedIndex = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    const targetY = (clampedIndex / (CHAPTERS.length - 1)) * maxScrollY;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  // HUD Quick Jump Click Handlers
  hudDots.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      scrollToChapter(idx);
    });
  });

  // Navigation Links Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.replace('#', '');
      const idx = CHAPTERS.findIndex(ch => ch.id === targetId);
      if (idx !== -1) {
        e.preventDefault();
        scrollToChapter(idx);
      }
    });
  });

  // Advance to Next Chapter Button
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      const nextIndex = Math.min(CHAPTERS.length - 1, activeChapterIndex + 1);
      scrollToChapter(nextIndex);
    });
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (activeChapterIndex < CHAPTERS.length - 1) {
        e.preventDefault();
        scrollToChapter(activeChapterIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (activeChapterIndex > 0) {
        e.preventDefault();
        scrollToChapter(activeChapterIndex - 1);
      }
    }
  });

  /* ==========================================================================
     SPACIOUS EDITORIAL SCROLL & PARALLAX RENDER LOOP (requestAnimationFrame)
     ========================================================================== */
  function render() {
    // Weighted inertia camera glide lerp
    currentScrollY += (targetScrollY - currentScrollY) * 0.09;
    mouseX += (mouseTargetX - mouseX) * 0.08;
    mouseY += (mouseTargetY - mouseY) * 0.08;

    const globalProgress = Math.max(0, Math.min(1, currentScrollY / maxScrollY));

    // Update Top Progress Bar
    if (progressBar) {
      progressBar.style.width = `${(globalProgress * 100).toFixed(2)}%`;
    }

    // Sync with 3D WebGL Engine
    if (window.Segesta3D) {
      window.Segesta3D.setScrollProgress(globalProgress);

      // Update 3D Telemetry Strip in Gateway 00
      const telemetry = window.Segesta3D.getTelemetry();
      const elCount = document.getElementById('telemetry-boids-count');
      const elAlt = document.getElementById('telemetry-boids-alt');
      const elSpeed = document.getElementById('telemetry-boids-speed');
      if (elCount) elCount.textContent = `${telemetry.count} Avians`;
      if (elAlt) elAlt.textContent = `${telemetry.altitude} M`;
      if (elSpeed) elSpeed.textContent = `${telemetry.speed} KTS`;
    }

    // Continuous Chapter Calculation (0 to CHAPTERS.length - 1)
    const continuousChapter = globalProgress * (CHAPTERS.length - 1);
    const newActiveIndex = Math.round(continuousChapter);

    if (newActiveIndex !== activeChapterIndex) {
      activeChapterIndex = newActiveIndex;
      updateActiveChapterUI(activeChapterIndex);
    }

    // Telemetry Readout in Chapter 05 (Turbine)
    const telemetryRpm = document.getElementById('telemetry-rpm');
    if (telemetryRpm) {
      const baseRpm = 1420 + Math.floor(Math.sin(Date.now() * 0.0025) * 50) + Math.floor(globalProgress * 250);
      telemetryRpm.textContent = `${baseRpm.toLocaleString()} RPM`;
    }

    // Render Each Scene Chamber with Generous Dwell Plateau
    sceneChambers.forEach((chamber) => {
      const index = parseInt(chamber.getAttribute('data-index') || '0', 10);
      const delta = continuousChapter - index;
      const absDelta = Math.abs(delta);

      // Frustum Culling
      if (absDelta > 1.35 && !isReducedMotion) {
        chamber.classList.remove('is-active');
        chamber.style.opacity = '0';
        chamber.style.visibility = 'hidden';
        chamber.style.pointerEvents = 'none';
        return;
      }

      chamber.classList.add('is-active');
      chamber.style.visibility = 'visible';

      if (isReducedMotion) {
        chamber.style.opacity = '1';
        chamber.style.transform = 'none';
        chamber.style.pointerEvents = 'auto';
        return;
      }

      // DWELL PLATEAU:
      // Content stays at 100% full opacity across |delta| <= 0.35 (~70% of zone).
      // Only when scrolling past 0.35 does it gently cosine-fade into the next chapter!
      let opacity = 1;
      if (absDelta > 0.35) {
        const fadeProgress = (absDelta - 0.35) / 0.85;
        opacity = Math.max(0, Math.cos(Math.min(1, fadeProgress) * (Math.PI / 2)));
      }
      chamber.style.opacity = opacity.toFixed(3);
      chamber.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none';

      // Differential Multi-layer Parallax (gentle translation, no dizzying jumps)
      const layers = chamber.querySelectorAll('.layer-depth');
      layers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth') || '0.5');
        const translateY = delta * depth * -95 + (mouseY * (1 - depth) * 0.3);
        const translateX = (mouseX * (1 - depth) * 0.3);
        const scale = 1 + (delta * depth * 0.03);

        layer.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      });
    });

    requestAnimationFrame(render);
  }

  function updateActiveChapterUI(idx) {
    hudDots.forEach((btn, i) => {
      if (i === idx) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    if (statusBadge && statusDesc && CHAPTERS[idx]) {
      statusBadge.textContent = `0${idx} / 09`;
      statusDesc.textContent = CHAPTERS[idx].desc;
    }
  }

  /* ==========================================================================
     SUBTLE AMBIENT CANVAS PARTICLES (Native 2D Canvas)
     ========================================================================== */
  let ctx = null;
  const particles = [];
  const PARTICLE_COUNT = 36;

  function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.6,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.55 + 0.2,
        color: Math.random() > 0.45 ? 'rgba(246, 160, 74,' : 'rgba(56, 189, 248,'
      });
    }

    animateParticles();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animateParticles() {
    if (!ctx || isReducedMotion) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(animateParticles);
  }

  /* ==========================================================================
     WEB AUDIO API SYNTHESIZER (Native Browser Audio per PRD Section 11)
     ========================================================================== */
  let audioCtx = null;
  let isAudioPlaying = false;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let gainNode = null;

  function toggleAudio() {
    if (!audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return;
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isAudioPlaying) {
      if (gainNode) {
        gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
      }
      setTimeout(() => {
        if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); }
        if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); }
        isAudioPlaying = false;
        updateAudioButtonUI(false);
      }, 500);
    } else {
      droneOsc1 = audioCtx.createOscillator();
      droneOsc2 = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      droneOsc1.type = 'sine';
      droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note deep drone

      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 harmonic

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 2.0);

      droneOsc1.connect(filter);
      droneOsc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      droneOsc1.start();
      droneOsc2.start();
      isAudioPlaying = true;
      updateAudioButtonUI(true);
    }
  }

  function updateAudioButtonUI(active) {
    if (!audioToggleBtn) return;
    audioToggleBtn.classList.toggle('is-active', active);
    if (active) {
      audioToggleBtn.style.color = 'var(--accent-amber)';
      audioToggleBtn.style.borderColor = 'var(--accent-amber)';
      audioToggleBtn.setAttribute('aria-label', 'Mute Ambient Audio');
    } else {
      audioToggleBtn.style.color = 'var(--text-pure)';
      audioToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      audioToggleBtn.setAttribute('aria-label', 'Enable Ambient Audio');
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  // Start Loops
  initCanvas();
  requestAnimationFrame(render);
})();
