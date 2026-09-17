/**
 * NOTOSAN — Meditative Nature Audio Engine (Web Audio API)
 * Synthesizes Japanese Insen scale meditation harmonies & serene mountain stream sounds
 */

class NotoSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.ambientGain = null;
    this.oscillators = [];
    this.waterNoise = null;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.audioCtx = new AudioContext();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);
  }

  startAmbient() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.ambientGain = this.audioCtx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(0.28, this.audioCtx.currentTime + 3.0);
    this.ambientGain.connect(this.masterGain);

    // Japanese Insen Pentatonic Scale (D, Eb, G, A, C)
    const insenFrequencies = [146.83, 155.56, 196.00, 220.00, 261.63, 293.66];

    this.oscillators = insenFrequencies.map((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Slow organic vibrato (LFO)
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.06 + index * 0.02, this.audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.2, this.audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.ambientGain);
      osc.start();

      return { osc, lfo };
    });

    // Mountain stream gentle noise
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(520, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

    const waterGain = this.audioCtx.createGain();
    waterGain.gain.setValueAtTime(0.035, this.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(this.ambientGain);
    whiteNoise.start();

    this.waterNoise = whiteNoise;
  }

  stopAmbient() {
    if (!this.isPlaying || !this.ambientGain) return;
    this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);
    setTimeout(() => {
      this.oscillators.forEach(d => {
        try { d.osc.stop(); d.lfo.stop(); } catch (e) {}
      });
      if (this.waterNoise) {
        try { this.waterNoise.stop(); } catch (e) {}
      }
      this.isPlaying = false;
    }, 1200);
  }

  toggle() {
    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  playWaterDrop() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.12);
  }

  playTempleBell() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12 / (idx + 1), this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 2.5);
    });
  }

  playStaffTap() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  playKodama() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Charming wooden rattle sound (like Ghibli Kodama head-shakes)
    const clicks = [0, 0.04, 0.08, 0.12, 0.16];
    clicks.forEach((delay, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 + idx * 120 + Math.random() * 80, this.audioCtx.currentTime + delay);
      gain.gain.setValueAtTime(0.09, this.audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + delay + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.audioCtx.currentTime + delay);
      osc.stop(this.audioCtx.currentTime + delay + 0.035);
    });
  }

  playFlameWhoosh() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, this.audioCtx.currentTime + 0.18);
    osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }

  playWindChime() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const chimeFreqs = [1760, 2093, 2637, 3135]; // A6, C7, E7, G7
    chimeFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + idx * 0.05 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.audioCtx.currentTime + idx * 0.05);
      osc.stop(this.audioCtx.currentTime + idx * 0.05 + 1.2);
    });
  }

  playWaterSlurp() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Cute animated bubbling water slurp
    const tones = [500, 720, 960, 680, 840];
    tones.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.audioCtx.currentTime + idx * 0.04 + 0.05);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.04 + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.audioCtx.currentTime + idx * 0.04);
      osc.stop(this.audioCtx.currentTime + idx * 0.04 + 0.06);
    });
  }

  playFrogRibbit() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Cartoony springy frog croak
    [220, 240].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.12);
      osc.frequency.linearRampToValueAtTime(freq * 0.7, this.audioCtx.currentTime + idx * 0.12 + 0.08);

      gain.gain.setValueAtTime(0.07, this.audioCtx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.12 + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.audioCtx.currentTime + idx * 0.12);
      osc.stop(this.audioCtx.currentTime + idx * 0.12 + 0.09);
    });
  }
}

window.soundEngine = new NotoSoundEngine();
