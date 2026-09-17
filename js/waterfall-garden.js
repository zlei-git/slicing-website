/**
 * NOTOSAN — Scroll-Following Waterfall & Living Cartoony Garden Controller
 * Manages scroll-driven waterfall cascade intensity, cartoony animal drinking,
 * frog hopping, koi fish reactions, and interactive pond ripples.
 */

class NotoWaterfallGarden {
  constructor() {
    this.gardenOasis = document.getElementById('zen-garden-oasis');
    this.scrollWaterfall = document.getElementById('scroll-waterfall-stream');
    this.drinkingAnimal = document.getElementById('drinking-animal');
    this.animalSpeech = document.getElementById('animal-speech-toast');
    this.pondFrog = document.getElementById('pond-frog');
    this.pondBasin = document.getElementById('pond-surface');

    this.waterfallStreams = document.querySelectorAll('.waterfall-rush-stream');
    this.impactFoams = document.querySelectorAll('.basin-impact-foam');

    this.animalPhrases = [
      "Slurp! Segar sekali air terjun Noto ini! 💧✨",
      "Air pegunungan Noto sangat murni dan dingin! 🏔️",
      "Guk! Haus setelah menjelajahi hutan Noto! 🌿",
      "Sluuuurp! Rasakan kesegaran mata air alami! 💦"
    ];
    this.phraseIndex = 0;
    this.speechTimeout = null;

    this.init();
  }

  init() {
    this.bindScrollWaterfall();
    this.bindAnimalInteraction();
    this.bindFrogInteraction();
    this.globalSpine = document.getElementById('global-waterfall-spine');
    this.heroCrest = document.getElementById('hero-waterfall-crest');
    this.scene2Overflow = document.getElementById('scene2-overflow');
    this.biodiversityGorge = document.getElementById('biodiversity-gorge');
    this.sanctuaryBasin = document.getElementById('sanctuary-basin');

    this.bindPondClicks();
    this.bindWaterBodiesClicks();
  }

  /* ==========================================================================
     1. SCROLL-FOLLOWING WATERFALL CASCADE DYNAMICS (ALL PAGES)
     ========================================================================== */
  bindScrollWaterfall() {
    window.addEventListener('scroll', () => {
      this.updateWaterfallCascade();
    }, { passive: true });

    this.updateWaterfallCascade();
  }

  updateWaterfallCascade() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - windowH;
    const overallProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

    // 1. Global spine visibility & speed
    if (this.globalSpine) {
      if (scrollY > 60) {
        this.globalSpine.classList.add('active');
        this.globalSpine.style.opacity = (0.35 + overallProgress * 0.45).toFixed(2);
      } else {
        this.globalSpine.classList.remove('active');
      }
    }

    // 2. Tranquility / About section target position
    const aboutSection = document.getElementById('tranquility');
    if (aboutSection && this.scrollWaterfall) {
      const aboutTop = aboutSection.offsetTop;
      const progress = Math.min(1.4, Math.max(0, scrollY / (aboutTop * 0.85)));
      const scaleY = 0.6 + progress * 0.55;
      const opacity = Math.min(1, 0.4 + progress * 0.6);
      this.scrollWaterfall.style.transform = `scaleY(${scaleY.toFixed(3)}) translateY(${(scrollY * 0.08).toFixed(1)}px)`;
      this.scrollWaterfall.style.opacity = opacity.toFixed(2);
    }

    // 3. Accelerate stream dash flow speed based on overall scroll
    this.waterfallStreams.forEach((stream, idx) => {
      const baseDuration = idx % 2 === 0 ? 0.9 : 0.7;
      const dynamicDuration = Math.max(0.28, baseDuration - overallProgress * 0.35);
      stream.style.animationDuration = `${dynamicDuration.toFixed(2)}s`;
    });

    // 4. If close to About section, spawn occasional spray mist at the basin
    if (this.gardenOasis) {
      const rect = this.gardenOasis.getBoundingClientRect();
      if (rect.top > -200 && rect.bottom < windowH + 200 && Math.random() > 0.65 && window.notoNatureCanvas) {
        const impactX = rect.left + rect.width * 0.72;
        const impactY = rect.top + rect.height * 0.58;
        window.notoNatureCanvas.spawnSparkles(impactX, impactY, 4, 'blue');
      }
    }
  }

  /* ==========================================================================
     2. CARTOONY ANIMAL DRINKING & REACTION
     ========================================================================== */
  bindAnimalInteraction() {
    if (!this.drinkingAnimal) return;

    // On Click: Happy bounce, slurp audio, water sparkles & speech toast!
    this.drinkingAnimal.addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerAnimalReaction();
    });

    // On Hover: Curious head tilt & water droplet sound
    this.drinkingAnimal.addEventListener('mouseenter', () => {
      if (window.soundEngine) {
        window.soundEngine.playWaterDrop();
      }
    });

    // Periodic ambient drinking sound when in view
    setInterval(() => {
      if (this.isGardenInView() && window.soundEngine && Math.random() > 0.55) {
        window.soundEngine.playWaterSlurp();
      }
    }, 6000);
  }

  triggerAnimalReaction() {
    if (this.drinkingAnimal.classList.contains('joyful-bounce')) return;

    // 1. Animal bounce animation
    this.drinkingAnimal.classList.add('joyful-bounce');
    setTimeout(() => {
      this.drinkingAnimal.classList.remove('joyful-bounce');
    }, 800);

    // 2. Play cute slurp & chime sound
    if (window.soundEngine) {
      window.soundEngine.playWaterSlurp();
      setTimeout(() => {
        if (window.soundEngine) window.soundEngine.playWindChime();
      }, 250);
    }

    // 3. Spawn water droplets & heart sparkles
    if (window.notoNatureCanvas && this.drinkingAnimal) {
      const rect = this.drinkingAnimal.getBoundingClientRect();
      const spawnX = rect.left + rect.width * 0.6;
      const spawnY = rect.top + rect.height * 0.45;
      window.notoNatureCanvas.spawnSparkles(spawnX, spawnY, 16, 'blue');
      window.notoNatureCanvas.spawnSparkles(spawnX, spawnY - 20, 10, 'pink');
    }

    // 4. Show cute speech toast
    this.showAnimalSpeech();
  }

  showAnimalSpeech() {
    if (!this.animalSpeech) return;

    const phrase = this.animalPhrases[this.phraseIndex];
    this.phraseIndex = (this.phraseIndex + 1) % this.animalPhrases.length;

    this.animalSpeech.textContent = phrase;
    this.animalSpeech.classList.add('active');

    if (this.speechTimeout) clearTimeout(this.speechTimeout);
    this.speechTimeout = setTimeout(() => {
      this.animalSpeech.classList.remove('active');
    }, 3800);
  }

  /* ==========================================================================
     3. CARTOONY POND FROG ("KERO") INTERACTION
     ========================================================================== */
  bindFrogInteraction() {
    if (!this.pondFrog) return;

    this.pondFrog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerFrogHop();
    });

    this.pondFrog.addEventListener('mouseenter', () => {
      if (window.soundEngine) {
        window.soundEngine.playWaterDrop();
      }
    });
  }

  triggerFrogHop() {
    if (this.pondFrog.classList.contains('hopping')) return;

    this.pondFrog.classList.add('hopping');

    // Play frog croak
    if (window.soundEngine) {
      window.soundEngine.playFrogRibbit();
    }

    // Spawn water splash
    if (window.notoNatureCanvas && this.pondFrog) {
      const rect = this.pondFrog.getBoundingClientRect();
      window.notoNatureCanvas.addRipple(rect.left + rect.width * 0.5, rect.top + rect.height);
      window.notoNatureCanvas.spawnSparkles(rect.left + rect.width * 0.5, rect.top + rect.height, 12, 'emerald');
    }

    setTimeout(() => {
      this.pondFrog.classList.remove('hopping');
    }, 750);
  }

  /* ==========================================================================
     4. POND SURFACE CLICKS (RIPPLES)
     ========================================================================== */
  bindPondClicks() {
    if (!this.gardenOasis) return;

    this.gardenOasis.addEventListener('click', (e) => {
      // Don't trigger if clicked on animal or frog
      if (e.target.closest('#drinking-animal') || e.target.closest('#pond-frog')) return;

      if (window.notoNatureCanvas) {
        window.notoNatureCanvas.addRipple(e.clientX, e.clientY);
        window.notoNatureCanvas.spawnSparkles(e.clientX, e.clientY, 8, 'blue');
      }

      if (window.soundEngine) {
        window.soundEngine.playWaterDrop();
      }
    });
  }

  /* ==========================================================================
     5. ALL WATER BODIES CLICKS & SPLASHES (Crest, River, Lake)
     ========================================================================== */
  bindWaterBodiesClicks() {
    const waterBodies = [this.heroCrest, this.biodiversityGorge, this.sanctuaryBasin];
    waterBodies.forEach(body => {
      if (!body) return;
      body.addEventListener('click', (e) => {
        if (window.notoNatureCanvas) {
          window.notoNatureCanvas.addRipple(e.clientX, e.clientY);
          window.notoNatureCanvas.spawnSparkles(e.clientX, e.clientY, 12, 'blue');
        }
        if (window.soundEngine) {
          window.soundEngine.playWaterDrop();
        }
      });
    });
  }

  isGardenInView() {
    if (!this.gardenOasis) return false;
    const rect = this.gardenOasis.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.notoWaterfallGarden = new NotoWaterfallGarden();
});
