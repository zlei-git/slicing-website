/**
 * NOTOSAN — Handcrafted Multi-Layer 2.5D Parallax Engine
 * Combines scroll-driven depth separation & interactive 3D mouse tilt parallax
 */

class NotoParallaxEngine {
  constructor() {
    this.layers = Array.from(document.querySelectorAll('.parallax-layer'));
    this.progressBar = document.getElementById('scroll-progress');
    this.sections = Array.from(document.querySelectorAll('.scene-section'));
    this.sideDots = Array.from(document.querySelectorAll('.side-dot'));
    this.navLinks = Array.from(document.querySelectorAll('.site-header .nav-link'));
    this.header = document.getElementById('site-header');

    // Mouse movement coordinates
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.enableMouseTilt = true;

    // Scroll state
    this.scrollY = 0;
    this.targetScrollY = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.observeSections();
    this.renderLoop();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY || window.pageYOffset;
      this.updateIndicators();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      if (!this.enableMouseTilt) return;
      // Normalize from -1 to 1 based on viewport center
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Perspective toggle button
    const perspectiveBtn = document.getElementById('toggle-perspective-btn');
    const perspectiveLabel = document.getElementById('perspective-label');
    if (perspectiveBtn) {
      perspectiveBtn.addEventListener('click', () => {
        this.enableMouseTilt = !this.enableMouseTilt;
        if (perspectiveLabel) {
          perspectiveLabel.textContent = `3D Tilt: ${this.enableMouseTilt ? 'ON' : 'OFF'}`;
        }
        if (!this.enableMouseTilt) {
          this.targetMouseX = 0;
          this.targetMouseY = 0;
        }
        if (window.soundEngine) window.soundEngine.playWaterDrop();
      });
    }

    // Side navigation clicks
    this.sideDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (window.soundEngine) window.soundEngine.playWaterDrop();
        }
      });
    });

    // Header nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (window.soundEngine) window.soundEngine.playWaterDrop();
          }
        }
      });
    });
  }

  updateIndicators() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }

    if (this.header) {
      if (scrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }

    const midScreen = scrollY + window.innerHeight * 0.45;
    let currentSectionId = 'visite';

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (midScreen >= top && midScreen < top + height) {
        currentSectionId = section.id;
        break;
      }
    }

    this.sideDots.forEach(dot => {
      const match = dot.getAttribute('data-target') === currentSectionId;
      dot.classList.toggle('active', match);
    });

    this.navLinks.forEach(link => {
      const match = link.getAttribute('data-section') === currentSectionId;
      link.classList.toggle('active', match);
    });
  }

  observeSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.2 });

    this.sections.forEach(sec => observer.observe(sec));
  }

  renderLoop() {
    // 1. Smooth LERP for scroll and mouse tilt
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.12;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

    // 2. Transform each parallax layer based on its individual depth factor
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;

      // Scroll translation (closer layers move faster)
      const translateY = -this.scrollY * speed;

      // Mouse tilt translation (depth offset)
      const tiltX = this.mouseX * speed * 35;
      const tiltY = this.mouseY * speed * 25;

      // Scale slightly so edges don't reveal background during tilt
      const baseScale = 1.04 + speed * 0.04;

      layer.style.transform = `translate3d(${tiltX.toFixed(2)}px, ${(translateY + tiltY).toFixed(2)}px, 0) scale(${baseScale})`;
    }

    requestAnimationFrame(() => this.renderLoop());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.notoParallaxEngine = new NotoParallaxEngine();
});
