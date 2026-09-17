/**
 * NOTOSAN — Dynamic Nature & Interactive Canvas Engine
 * Animates flying cranes, drifting sakura petals, waterfall spray, fireflies,
 * interactive water ripples, cursor sparkle trails, and particle bursts.
 */

class NotoNatureCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.cranes = [];
    this.petals = [];
    this.fireflies = [];
    this.waterMist = [];
    this.ripples = [];
    this.sparkles = [];
    this.cursorTrail = [];

    this.mouseX = -100;
    this.mouseY = -100;
    this.lastMouseX = -100;
    this.lastMouseY = -100;

    this.theme = 'sunset'; // 'sunset' | 'midnight' | 'sakura' | 'emerald'

    this.resize();
    this.initCranes();
    this.initPetals();
    this.initFireflies();
    this.initMist();

    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setTheme(themeName) {
    this.theme = themeName;
    if (themeName === 'sakura') {
      this.initPetals(60); // More petals in sakura mode
    } else if (themeName === 'midnight') {
      this.initFireflies(45); // More glowing fireflies in midnight mode
    }
  }

  /* ==========================================================================
     1. FLYING CRANES (Japanese Tancho) — With Interactive Flight Flutter
     ========================================================================== */
  initCranes() {
    this.cranes = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      this.cranes.push({
        x: (this.width * 0.2) + i * 45 + Math.random() * 20,
        y: (this.height * 0.22) + (i % 2 === 0 ? i * 18 : -i * 12),
        baseSpeedX: 0.85 + Math.random() * 0.25,
        speedX: 0.85 + Math.random() * 0.25,
        speedY: (Math.random() - 0.5) * 0.2,
        wingPhase: i * 0.6,
        wingSpeed: 0.08 + Math.random() * 0.03,
        scale: 0.8 + Math.random() * 0.4,
        alerted: false
      });
    }
  }

  drawCrane(c) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(c.scale, c.scale);

    const wingSpread = Math.sin(c.wingPhase) * (c.alerted ? 19 : 14);

    // Crane Body
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 4, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Red Crown mark on head
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(14, -1, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Wings (flapping up/down)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(0, -wingSpread - 4, 10, -wingSpread);
    ctx.quadraticCurveTo(2, -2, -4, 0);
    ctx.fill();

    // Black wingtips
    ctx.fillStyle = '#1e1b2e';
    ctx.beginPath();
    ctx.moveTo(6, -wingSpread * 0.8);
    ctx.lineTo(10, -wingSpread);
    ctx.lineTo(8, -wingSpread * 0.5);
    ctx.fill();

    // Golden Beak
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(22, 1);
    ctx.stroke();

    ctx.restore();
  }

  /* ==========================================================================
     2. WINDBORNE SAKURA PETALS
     ========================================================================== */
  initPetals(count = 35) {
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal());
    }
  }

  createPetal() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 6 + 4,
      speedX: Math.random() * 1.6 + 0.8,
      speedY: Math.random() * 1.3 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.6 + 0.35,
      hue: this.theme === 'sakura' ? 'pink' : (this.theme === 'emerald' ? 'green' : (Math.random() > 0.4 ? 'pink' : 'gold'))
    };
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.hue === 'pink') {
      ctx.fillStyle = `rgba(251, 207, 232, ${p.opacity})`;
    } else if (p.hue === 'green') {
      ctx.fillStyle = `rgba(167, 243, 208, ${p.opacity * 0.8})`;
    } else {
      ctx.fillStyle = `rgba(253, 230, 138, ${p.opacity * 0.85})`;
    }

    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ==========================================================================
     3. FOREST FIREFLIES / ENCHANTED ORBS
     ========================================================================== */
  initFireflies(count = 25) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: this.height * 0.4 + Math.random() * (this.height * 0.6),
        radius: Math.random() * 2.5 + 1.2,
        phase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? 'rgba(250, 204, 21, ' : 'rgba(56, 189, 248, '
      });
    }
  }

  drawFirefly(f) {
    const ctx = this.ctx;
    const pulseAlpha = (Math.sin(f.phase) * 0.5 + 0.5) * 0.7 + 0.2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${f.color}${pulseAlpha})`;
    ctx.shadowColor = `${f.color}0.9)`;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }

  /* ==========================================================================
     4. WATERFALL MIST SPRAY
     ========================================================================== */
  initMist() {
    this.waterMist = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      this.waterMist.push({
        x: this.width * 0.35 + (Math.random() - 0.5) * (this.width * 0.3),
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.8,
        speedY: Math.random() * 3 + 2,
        opacity: Math.random() * 0.45 + 0.15
      });
    }
  }

  /* ==========================================================================
     5. DYNAMIC WATER RIPPLES (Interactive on Click & Stones)
     ========================================================================== */
  addRipple(x, y) {
    const count = 3;
    for (let i = 0; i < count; i++) {
      this.ripples.push({
        x: x,
        y: y,
        radius: 4 + i * 8,
        maxRadius: 65 + Math.random() * 45,
        speed: 1.4 + Math.random() * 0.4,
        opacity: 0.85 - i * 0.15,
        fadeRate: 0.012 + i * 0.003
      });
    }

    // Play water drop chime
    if (window.soundEngine) {
      window.soundEngine.playWaterDrop();
    }
  }

  drawRipples() {
    const ctx = this.ctx;
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.opacity -= r.fadeRate;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      // Concentric elliptical water reflection
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${r.opacity * 0.75})`;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Inner faint crest ring
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius * 0.6, r.radius * 0.22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ==========================================================================
     6. INTERACTIVE SPARKLE BURSTS (For Traveler, Lantern, Kodama Clicks)
     ========================================================================== */
  spawnSparkles(x, y, count = 18, color = 'gold') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.2;
      this.sparkles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 3.5 + 1.5,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        color: color
      });
    }
  }

  drawSparkles() {
    const ctx = this.ctx;
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08; // subtle gravity
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);

      let fillCol;
      if (s.color === 'gold') fillCol = `rgba(250, 204, 21, ${s.life})`;
      else if (s.color === 'blue') fillCol = `rgba(56, 189, 248, ${s.life})`;
      else if (s.color === 'pink') fillCol = `rgba(244, 114, 182, ${s.life})`;
      else if (s.color === 'crimson') fillCol = `rgba(239, 68, 68, ${s.life})`;
      else fillCol = `rgba(167, 243, 208, ${s.life})`;

      ctx.fillStyle = fillCol;
      ctx.shadowColor = fillCol;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ==========================================================================
     7. MOUSE CURSOR GLOW TRAIL
     ========================================================================== */
  addCursorParticle(x, y) {
    if (Math.random() > 0.45) return;
    this.cursorTrail.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      radius: Math.random() * 2 + 1,
      opacity: 0.7,
      decay: 0.025
    });
    if (this.cursorTrail.length > 25) this.cursorTrail.shift();
  }

  drawCursorTrail() {
    const ctx = this.ctx;
    for (let i = this.cursorTrail.length - 1; i >= 0; i--) {
      const p = this.cursorTrail[i];
      p.opacity -= p.decay;
      p.y -= 0.4;

      if (p.opacity <= 0) {
        this.cursorTrail.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248, 175, 78, ${p.opacity * 0.6})`;
      ctx.shadowColor = 'rgba(248, 175, 78, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ==========================================================================
     EVENT LISTENERS & INTERACTIVITY
     ========================================================================== */
  bindEvents() {
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.addCursorParticle(e.clientX, e.clientY);

      // Check cranes proximity (alarm / flutter if close)
      for (let i = 0; i < this.cranes.length; i++) {
        const c = this.cranes[i];
        const dx = c.x - e.clientX;
        const dy = c.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          c.alerted = true;
          c.speedX = c.baseSpeedX * 2.2;
          c.speedY = -0.6; // swoop up
          c.wingSpeed = 0.18;
        } else {
          c.alerted = false;
          c.speedX = c.baseSpeedX;
          c.speedY = (Math.random() - 0.5) * 0.2;
          c.wingSpeed = 0.08;
        }
      }
    }, { passive: true });

    // Click anywhere on the water (lower portion of the screen) to create water ripples!
    window.addEventListener('pointerdown', (e) => {
      // If clicked in bottom 32% of screen (lake surface), spawn water ripple
      const lakeThreshold = window.innerHeight * 0.68;
      if (e.clientY > lakeThreshold) {
        this.addRipple(e.clientX, e.clientY);
        this.spawnSparkles(e.clientX, e.clientY, 8, 'blue');
      }
    });
  }

  /* ==========================================================================
     MAIN ANIMATION LOOP
     ========================================================================== */
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Water Ripples (drawn underneath characters)
    this.drawRipples();

    // 2. Flying Cranes
    for (let i = 0; i < this.cranes.length; i++) {
      const c = this.cranes[i];
      c.x += c.speedX;
      c.y += c.speedY;
      c.wingPhase += c.wingSpeed;

      if (c.x > this.width + 60) {
        c.x = -60;
        c.y = (this.height * 0.18) + Math.random() * (this.height * 0.25);
      }

      this.drawCrane(c);
    }

    // 3. Drifting Sakura Petals
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.x > this.width + 20 || p.y > this.height + 20) {
        p.x = Math.random() * this.width * 0.6 - 20;
        p.y = -15;
      }

      this.drawPetal(p);
    }

    // 4. Forest Fireflies
    for (let i = 0; i < this.fireflies.length; i++) {
      const f = this.fireflies[i];
      f.x += f.speedX;
      f.y += f.speedY;
      f.phase += 0.04;

      if (f.x < 0) f.x = this.width;
      if (f.x > this.width) f.x = 0;
      if (f.y < this.height * 0.3) f.y = this.height;
      if (f.y > this.height) f.y = this.height * 0.3;

      this.drawFirefly(f);
    }

    // 5. Waterfall Mist
    for (let i = 0; i < this.waterMist.length; i++) {
      const m = this.waterMist[i];
      m.y += m.speedY;

      if (m.y > this.height + 10) {
        m.y = -10;
        m.x = this.width * 0.35 + (Math.random() - 0.5) * (this.width * 0.3);
      }

      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(224, 242, 254, ${m.opacity})`;
      this.ctx.fill();
    }

    // 6. Interactive Sparkle Bursts
    this.drawSparkles();

    // 7. Cursor Stardust Trail
    this.drawCursorTrail();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvasId = document.getElementById('nature-canvas') ? 'nature-canvas' : 'effects-canvas';
  window.notoNatureCanvas = new NotoNatureCanvas(canvasId);
});
