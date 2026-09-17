/**
 * NOTOSAN — Interactive Living Characters & Stage Controller
 * Manages Traveler head mouse tracking, dialogues, Stone Lantern flame ignition,
 * Kodama spirit interactions, Sika deer bowing, and living atmosphere modes.
 */

class NotoInteractiveStage {
  constructor() {
    this.travelerWrap = document.getElementById('interactive-traveler');
    this.travelerHead = document.getElementById('traveler-head');
    this.travelerStaff = document.getElementById('traveler-staff');
    this.travelerCape = document.getElementById('traveler-cape');
    this.travelerBubble = document.getElementById('traveler-bubble');
    this.travelerQuote = document.getElementById('traveler-quote');

    this.lanternWrap = document.getElementById('interactive-lantern');
    this.lanternAura = document.querySelector('.lantern-aura');
    this.lanternFlame = document.querySelector('.lantern-flame-core');

    this.deerCard = document.querySelector('.nature-widget.deer-spotlight-card');

    this.flameModeIndex = 0;
    this.flameModes = ['gold', 'blue', 'crimson'];

    this.dialogueIndex = 0;
    this.travelerQuotes = [
      { text: "“The mountain path is quiet, but the spirit sings.”", kanji: "静かな山道、歌う心" },
      { text: "“Listen closely... the waterfalls of Noto carry centuries of mountain memory.”", kanji: "能登の滝響" },
      { text: "“The sacred Sika deer wander through ancient cedar roots. Bow gently to them.”", kanji: "神鹿の加護" },
      { text: "“Touch the stone lantern on the bank to awaken its spirit flame.”", kanji: "石灯籠の炎" },
      { text: "“Tap the water surface to see concentric ripples bloom across the lake.”", kanji: "湖畔の波紋" },
      { text: "“High above us, the Tancho cranes fly toward Mount Noto's zenith.”", kanji: "丹頂鶴の空" }
    ];

    this.bubbleTimeout = null;

    this.initTraveler();
    this.initLantern();
    this.initKodama();
    this.initDeer();
    this.initAtmosphere();
  }

  /* ==========================================================================
     1. TRAVELER KENJI INTERACTION & MOUSE LOOK
     ========================================================================== */
  initTraveler() {
    if (!this.travelerWrap) return;

    // Track mouse to rotate Traveler's head and hat
    window.addEventListener('mousemove', (e) => {
      if (!this.travelerHead) return;
      const rect = this.travelerWrap.getBoundingClientRect();
      const travelerCenterX = rect.left + rect.width * 0.5;
      const travelerCenterY = rect.top + rect.height * 0.3;

      const deltaX = e.clientX - travelerCenterX;
      const deltaY = e.clientY - travelerCenterY;

      // Calculate angle in degrees, clamped for natural neck movement
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const clampedAngle = Math.max(-18, Math.min(18, angle * 0.25));

      this.travelerHead.style.transform = `rotate(${clampedAngle}deg)`;

      // If mouse passes close quickly, give cape a wind flutter
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < 160 && this.travelerCape && !this.travelerCape.classList.contains('gust')) {
        this.travelerCape.classList.add('gust');
        setTimeout(() => this.travelerCape.classList.remove('gust'), 600);
      }
    }, { passive: true });

    // Click on Traveler: Tip Hat + Staff Tap + Speech Bubble + Sparkles!
    this.travelerWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerTravelerInteraction(e.clientX, e.clientY);
    });
  }

  triggerTravelerInteraction(clickX, clickY) {
    // 1. Hat tip animation
    if (this.travelerHead) {
      this.travelerHead.classList.add('tipping');
      setTimeout(() => this.travelerHead.classList.remove('tipping'), 850);
    }

    // 2. Staff tap animation
    if (this.travelerStaff) {
      this.travelerStaff.classList.add('tapping');
      setTimeout(() => this.travelerStaff.classList.remove('tapping'), 500);
    }

    // 3. Play SFX
    if (window.soundEngine) {
      window.soundEngine.playStaffTap();
      setTimeout(() => {
        if (window.soundEngine) window.soundEngine.playWindChime();
      }, 180);
    }

    // 4. Sparkle particles
    if (window.notoNatureCanvas) {
      const rect = this.travelerWrap.getBoundingClientRect();
      const spawnX = clickX || (rect.left + rect.width * 0.5);
      const spawnY = clickY || (rect.top + rect.height * 0.3);
      window.notoNatureCanvas.spawnSparkles(spawnX, spawnY, 22, 'gold');
    }

    // 5. Show / Cycle Dialogue Bubble
    this.cycleTravelerDialogue();
  }

  cycleTravelerDialogue() {
    if (!this.travelerBubble || !this.travelerQuote) return;

    const quoteObj = this.travelerQuotes[this.dialogueIndex];
    this.dialogueIndex = (this.dialogueIndex + 1) % this.travelerQuotes.length;

    this.travelerQuote.textContent = quoteObj.text;
    const kanjiStamp = this.travelerBubble.querySelector('.bubble-kanji-stamp');
    if (kanjiStamp) kanjiStamp.textContent = quoteObj.kanji;

    this.travelerBubble.classList.remove('hidden');
    // Force reflow
    void this.travelerBubble.offsetWidth;
    this.travelerBubble.classList.add('active');

    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    this.bubbleTimeout = setTimeout(() => {
      this.travelerBubble.classList.remove('active');
      setTimeout(() => this.travelerBubble.classList.add('hidden'), 400);
    }, 7000);
  }

  /* ==========================================================================
     2. STONE LANTERN (TŌRŌ) INTERACTION
     ========================================================================== */
  initLantern() {
    if (!this.lanternWrap) return;

    this.lanternWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cycleLanternFlame(e.clientX, e.clientY);
    });
  }

  cycleLanternFlame(clickX, clickY) {
    this.flameModeIndex = (this.flameModeIndex + 1) % this.flameModes.length;
    const mode = this.flameModes[this.flameModeIndex];

    // Remove old modes
    if (this.lanternAura && this.lanternFlame) {
      this.lanternAura.classList.remove('mode-gold', 'mode-blue', 'mode-crimson');
      this.lanternFlame.classList.remove('mode-gold', 'mode-blue', 'mode-crimson');

      // Add new mode
      this.lanternAura.classList.add(`mode-${mode}`);
      this.lanternFlame.classList.add(`mode-${mode}`, 'burst');
      setTimeout(() => this.lanternFlame.classList.remove('burst'), 600);
    }

    // Play Flame sound
    if (window.soundEngine) {
      window.soundEngine.playFlameWhoosh();
      setTimeout(() => {
        if (window.soundEngine) window.soundEngine.playTempleBell();
      }, 150);
    }

    // Spawn flame embers into the sky
    if (window.notoNatureCanvas) {
      const rect = this.lanternWrap.getBoundingClientRect();
      const spawnX = clickX || (rect.left + rect.width * 0.5);
      const spawnY = clickY || (rect.top + rect.height * 0.4);
      window.notoNatureCanvas.spawnSparkles(spawnX, spawnY, 26, mode);
    }
  }

  /* ==========================================================================
     3. FOREST KODAMA TREE SPIRITS
     ========================================================================== */
  initKodama() {
    const kodamas = document.querySelectorAll('.interactive-kodama-spirit');
    kodamas.forEach(k => {
      k.addEventListener('mouseenter', () => {
        k.classList.add('rattling');
        if (window.soundEngine) {
          window.soundEngine.playKodama();
        }
        if (window.notoNatureCanvas) {
          const rect = k.getBoundingClientRect();
          window.notoNatureCanvas.spawnSparkles(rect.left + rect.width * 0.5, rect.top + rect.height * 0.4, 14, 'emerald');
        }
      });

      k.addEventListener('mouseleave', () => {
        k.classList.remove('rattling');
      });

      k.addEventListener('click', (e) => {
        e.stopPropagation();
        k.classList.add('rattling');
        if (window.soundEngine) window.soundEngine.playKodama();
        if (window.notoNatureCanvas) {
          const rect = k.getBoundingClientRect();
          window.notoNatureCanvas.spawnSparkles(rect.left + rect.width * 0.5, rect.top + rect.height * 0.4, 20, 'emerald');
        }
      });
    });
  }

  /* ==========================================================================
     4. SIKA DEER INTERACTION (NARA-STYLE RESPECTFUL BOW)
     ========================================================================== */
  initDeer() {
    if (!this.deerCard) return;

    this.deerCard.addEventListener('click', (e) => {
      this.triggerDeerBow();
    });

    this.deerCard.addEventListener('mouseenter', () => {
      // Subtle ear/head attention
      if (window.soundEngine) {
        window.soundEngine.playWaterDrop();
      }
    });
  }

  triggerDeerBow() {
    if (this.deerCard.classList.contains('bowing')) return;

    this.deerCard.classList.add('bowing');
    if (window.soundEngine) {
      window.soundEngine.playTempleBell();
    }

    if (window.notoNatureCanvas) {
      const rect = this.deerCard.getBoundingClientRect();
      window.notoNatureCanvas.spawnSparkles(rect.left + rect.width * 0.5, rect.top + 100, 20, 'pink');
    }

    setTimeout(() => {
      this.deerCard.classList.remove('bowing');
    }, 1500);
  }

  /* ==========================================================================
     5. LIVING ATMOSPHERE / TIME OF DAY PRESETS
     ========================================================================== */
  initAtmosphere() {
    const btns = document.querySelectorAll('.atmosphere-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const theme = btn.dataset.theme;
        this.setAtmosphere(theme);
      });
    });
  }

  setAtmosphere(theme) {
    document.body.classList.remove('theme-sunset', 'theme-midnight', 'theme-sakura', 'theme-emerald');
    document.body.classList.add(`theme-${theme}`);

    if (window.notoNatureCanvas) {
      window.notoNatureCanvas.setTheme(theme);
      window.notoNatureCanvas.spawnSparkles(window.innerWidth * 0.5, window.innerHeight * 0.3, 30, theme === 'sunset' ? 'gold' : (theme === 'midnight' ? 'blue' : (theme === 'sakura' ? 'pink' : 'emerald')));
    }

    if (window.soundEngine) {
      window.soundEngine.playWindChime();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.notoInteractiveStage = new NotoInteractiveStage();
});
