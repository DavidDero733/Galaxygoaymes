class PS2AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;

  constructor() {
    // Lazy initialize to bypass browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plays the iconic deep, cosmic PS2 ambient boot sound
  public playBoot() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Core deep rumble sub-bass
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(55, now); // A1
      sub.frequency.exponentialRampToValueAtTime(41.2, now + 10); // down to E1

      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 12);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 12);

      // 2. Majestic low/mid pads (C-minor/major ambient cluster)
      const frequencies = [110, 164.8, 220, 293.7, 440]; // A2, E3, A3, D4, A4
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 4);
      filter.frequency.exponentialRampToValueAtTime(250, now + 11);
      filter.Q.setValueAtTime(4, now);
      filter.connect(this.ctx.destination);

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        // Alternate waves to create complexity
        o.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        o.frequency.setValueAtTime(freq, now);
        // Add subtle detune for hover effect
        o.detune.setValueAtTime((idx - 2) * 8, now);

        // LFO for nice cosmic modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.12 + idx * 0.05, now);
        lfoGain.gain.setValueAtTime(15, now);
        lfo.connect(lfoGain);
        lfoGain.connect(o.detune);
        lfo.start(now);
        lfo.stop(now + 14);

        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.08 / frequencies.length, now + 2 + idx * 0.4);
        g.gain.exponentialRampToValueAtTime(0.001, now + 13);

        o.connect(g);
        g.connect(filter);
        o.start(now);
        o.stop(now + 14);
      });

      // 3. Cybernetic Wind Swoosh & Shimmer
      const bufferSize = this.ctx.sampleRate * 6; // 6 seconds
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(80, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(3200, now + 1.2);
      noiseFilter.frequency.exponentialRampToValueAtTime(450, now + 3.5);
      noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 6);
      noiseFilter.Q.setValueAtTime(6, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 5.5);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 4. Double Delay echo chime (the sweet loading bell)
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1200, now + 0.5);
      chime.frequency.exponentialRampToValueAtTime(880, now + 1.5);
      
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.05, now + 0.5);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      const delay = this.ctx.createDelay();
      delay.delayTime.value = 0.35;
      const delayGain = this.ctx.createGain();
      delayGain.gain.value = 0.45;

      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      
      // Feedback loop
      chimeGain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.ctx.destination);
      delayGain.connect(delay); // feedback

      chime.start(now + 0.5);
      chime.stop(now + 4);

    } catch (e) {
      console.warn('Audio playback blocked or unsupported:', e);
    }
  }

  // Continuous background ambient hum for the PS2 Dashboard
  public startAmbientHum() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.stopAmbientHum();

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.06, now + 2); // Soft hum
      this.ambientGain.connect(this.ctx.destination);

      const freqs = [55, 110, 165]; // harmonic series
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Slow phase vibrato
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.05, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);

        osc.connect(this.ambientGain);
        lfo.start(now);
        osc.start(now);

        this.ambientOscillators.push({ osc, gain: this.ambientGain });
      });
    } catch (e) {
      console.warn('Hum error:', e);
    }
  }

  public stopAmbientHum() {
    this.ambientOscillators.forEach(item => {
      try {
        item.osc.stop();
      } catch {}
    });
    this.ambientOscillators = [];
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch {}
      this.ambientGain = null;
    }
  }

  // PS2 browser menu navigation select click (delicate glass click)
  public playClickSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Navigating highlight click sound
  public playHoverSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Soft swoosh for memory card entry/reboot
  public playSwooshSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(90, now);
      osc1.frequency.exponentialRampToValueAtTime(380, now + 0.4);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(150, now);
      osc2.frequency.exponentialRampToValueAtTime(50, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {}
  }

  // Authentic PS Vita-inspired bubble touch / pop sound
  public playVitaBubblePop() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Quick pitch drop creates a distinct glassy bubble pop
      osc.frequency.setValueAtTime(1250, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // PS Vita LiveArea crystalline confirmation chime
  public playVitaChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const frequencies = [880, 1318.5]; // A5 and E6

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.06 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {}
  }
}

export const ps2Audio = new PS2AudioEngine();
