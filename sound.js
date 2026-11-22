// Romantic Sound Effects Generator using Web Audio API (Zero dependencies, 100% offline)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Master dynamics compressor to eliminate clipping and maximize punch/loudness
        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
        this.masterCompressor.knee.setValueAtTime(20, this.ctx.currentTime);
        this.masterCompressor.ratio.setValueAtTime(4, this.ctx.currentTime);
        this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.15, this.ctx.currentTime);

        this.masterCompressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getMasterNode() {
    return this.masterCompressor || this.ctx?.destination;
  }

  // Playful boing when the NO button runs away
  boing() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Sweet chime when answering YES or picking up a heart coin
  chime(pitch = 1) {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    });
  }

  // Triumphant chord when a question is answered
  triumph() {
    this.init();
    if (!this.ctx) return;
    const chord = [440, 554.37, 659.25, 880]; // A major
    const now = this.ctx.currentTime;
    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    });
  }

  // Grand celebration fanfare on Mission Complete
  victoryFanfare() {
    this.init();
    if (!this.ctx) return;
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.50, d: 0.4 },
      { f: 880.00, d: 0.15 },
      { f: 1046.50, d: 0.6 }
    ];
    let offset = 0;
    melody.forEach((note) => {
      const now = this.ctx.currentTime + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + note.d + 0.05);

      offset += note.d * 0.85;
    });
  }

  // Car engine rev sound
  rev() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.5);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  }

  // Sweet kiss sound effect (💋 muah!)
  kissSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1350, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Soft click pop sound
  pop(freq = 600) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Master-quality Multi-Harmonic Synthesizer (Realistic Grand Piano, Acoustic Guitar, Symphony Strings, Studio Drums)
  // Designed to match the rich acoustic fidelity of musicca.com/piano
  playPianoNote(freq, type = 'piano', duration = 2.2) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dest = this.getMasterNode();

    if (type === 'drums') {
      // Dynamic studio drum pad synthesis based on frequency/pitch range
      if (freq < 310) {
        // Deep 808 Studio Kick Drum
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(160, now);
        kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.16);
        kickGain.gain.setValueAtTime(0.85, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        kickOsc.connect(kickGain);
        kickGain.connect(dest);
        kickOsc.start(now);
        kickOsc.stop(now + 0.36);

        // Click punch transient
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(450, now);
        clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.025);
        clickGain.gain.setValueAtTime(0.5, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        clickOsc.connect(clickGain);
        clickGain.connect(dest);
        clickOsc.start(now);
        clickOsc.stop(now + 0.035);
      } else if (freq < 450) {
        // Crisp Studio Snare Drum (Noise burst + tonal body)
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, now);
        snareOsc.frequency.exponentialRampToValueAtTime(90, now + 0.1);
        snareGain.gain.setValueAtTime(0.6, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        snareOsc.connect(snareGain);
        snareGain.connect(dest);
        snareOsc.start(now);
        snareOsc.stop(now + 0.18);

        // Noise buffer for snare snap
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1800, now);
        noiseFilter.Q.setValueAtTime(1.2, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.65, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(dest);
        noise.start(now);
      } else {
        // Metallic Hi-Hat Cymbal Sizzle
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.025));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(7500, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.45, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(dest);
        noise.start(now);
      }
      return;
    }

    if (type === 'guitar') {
      // Acoustic Guitar: Steel-string pluck with body formant
      const gDuration = Math.max(1.6, duration);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + gDuration);
      filter.Q.setValueAtTime(2.2, now);

      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.65, now + 0.004); // Instant crisp pluck
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + gDuration);

      // 3 string oscillators: Fundamental + Octave + Detune
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + gDuration + 0.05);
      osc2.stop(now + gDuration + 0.05);
      osc3.stop(now + gDuration + 0.05);
      return;
    }

    if (type === 'strings') {
      // Symphony Orchestral Strings: 3 detuned chorus voices + sweet expressive vibrato
      const sDuration = Math.max(2.2, duration);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.Q.setValueAtTime(1.0, now);

      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.42, now + 0.12); // Lush gentle bow attack
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + sDuration);

      // Vibrato LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(5.4, now); // 5.4 Hz natural string vibrato
      lfoGain.gain.setValueAtTime(freq * 0.012, now); // gentle depth
      lfo.connect(lfoGain);

      // 3 Detuned String Voices
      const v1 = this.ctx.createOscillator();
      const v2 = this.ctx.createOscillator();
      const v3 = this.ctx.createOscillator();

      v1.type = 'sawtooth';
      v1.frequency.setValueAtTime(freq, now);
      v2.type = 'triangle';
      v2.frequency.setValueAtTime(freq * 1.005, now);
      v3.type = 'sawtooth';
      v3.frequency.setValueAtTime(freq * 0.995, now);

      lfoGain.connect(v1.frequency);
      lfoGain.connect(v2.frequency);
      lfoGain.connect(v3.frequency);

      v1.connect(filter);
      v2.connect(filter);
      v3.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(dest);

      lfo.start(now);
      v1.start(now);
      v2.start(now);
      v3.start(now);

      lfo.stop(now + sDuration + 0.05);
      v1.stop(now + sDuration + 0.05);
      v2.stop(now + sDuration + 0.05);
      v3.stop(now + sDuration + 0.05);
      return;
    }

    // Default: Grand Acoustic Concert Piano (like musicca.com/piano)
    // Multi-harmonic acoustic modeling with hammer strike & warm soundboard resonance
    const pDuration = Math.max(2.4, duration);

    // 1. Acoustic Soundboard Resonant Filter
    const boardFilter = this.ctx.createBiquadFilter();
    boardFilter.type = 'lowpass';
    boardFilter.frequency.setValueAtTime(3800, now);
    boardFilter.frequency.exponentialRampToValueAtTime(750, now + pDuration * 0.85);
    boardFilter.Q.setValueAtTime(1.6, now);

    // 2. Main Piano Amplifier Envelope (High volume, percussive attack, rich sustain)
    const pianoGain = this.ctx.createGain();
    pianoGain.gain.setValueAtTime(0.001, now);
    pianoGain.gain.linearRampToValueAtTime(0.72, now + 0.005); // Rapid felt hammer strike
    pianoGain.gain.exponentialRampToValueAtTime(0.24, now + 0.45); // Warm acoustic sustain
    pianoGain.gain.exponentialRampToValueAtTime(0.001, now + pDuration);

    // 3. String Harmony Oscillators:
    // Fundamental (f0) - Warm Triangle
    const oscF = this.ctx.createOscillator();
    oscF.type = 'triangle';
    oscF.frequency.setValueAtTime(freq, now);

    // Detuned Chorus string pair (Acoustic 3-string harp effect: f0 * 1.0016 and f0 * 0.9984)
    const oscDetune1 = this.ctx.createOscillator();
    oscDetune1.type = 'sine';
    oscDetune1.frequency.setValueAtTime(freq * 1.0016, now);

    const oscDetune2 = this.ctx.createOscillator();
    oscDetune2.type = 'sine';
    oscDetune2.frequency.setValueAtTime(freq * 0.9984, now);

    // 2nd Harmonic (2 * f0) - Octave body
    const oscH2 = this.ctx.createOscillator();
    const gainH2 = this.ctx.createGain();
    oscH2.type = 'sine';
    oscH2.frequency.setValueAtTime(freq * 2, now);
    gainH2.gain.setValueAtTime(0.42, now);
    gainH2.gain.exponentialRampToValueAtTime(0.001, now + pDuration * 0.7);

    // 3rd Harmonic (3 * f0) - Fifth overtone warmth
    const oscH3 = this.ctx.createOscillator();
    const gainH3 = this.ctx.createGain();
    oscH3.type = 'sine';
    oscH3.frequency.setValueAtTime(freq * 3, now);
    gainH3.gain.setValueAtTime(0.22, now);
    gainH3.gain.exponentialRampToValueAtTime(0.001, now + pDuration * 0.5);

    // 4. Felt Hammer Transient Attack (Mechanical thump of hammer hitting string)
    const hammerOsc = this.ctx.createOscillator();
    const hammerGain = this.ctx.createGain();
    hammerOsc.type = 'triangle';
    hammerOsc.frequency.setValueAtTime(1400, now);
    hammerOsc.frequency.exponentialRampToValueAtTime(120, now + 0.015);
    hammerGain.gain.setValueAtTime(0.45, now);
    hammerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    // Wire up piano nodes
    oscF.connect(boardFilter);
    oscDetune1.connect(boardFilter);
    oscDetune2.connect(boardFilter);

    oscH2.connect(gainH2);
    gainH2.connect(boardFilter);

    oscH3.connect(gainH3);
    gainH3.connect(boardFilter);

    hammerOsc.connect(hammerGain);
    hammerGain.connect(dest);

    boardFilter.connect(pianoGain);
    pianoGain.connect(dest);

    // Start all audio nodes
    oscF.start(now);
    oscDetune1.start(now);
    oscDetune2.start(now);
    oscH2.start(now);
    oscH3.start(now);
    hammerOsc.start(now);

    // Stop all audio nodes
    oscF.stop(now + pDuration + 0.05);
    oscDetune1.stop(now + pDuration + 0.05);
    oscDetune2.stop(now + pDuration + 0.05);
    oscH2.stop(now + pDuration + 0.05);
    oscH3.stop(now + pDuration + 0.05);
    hammerOsc.stop(now + 0.025);
  }
}

window.soundFX = new SoundFX();
