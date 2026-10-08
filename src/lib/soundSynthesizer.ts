// Web Audio API synthesized romantic piano chords & melody for wedding background ambiance
// Zero external dependencies or broken links needed!

class RomanticWeddingSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private stepIndex: number = 0;

  // Romantic Canon in D / Wedding chord progression (frequencies in Hz)
  private readonly chords: { root: number; notes: number[] }[] = [
    // D Major
    { root: 146.83, notes: [293.66, 369.99, 440.0, 587.33] },
    // A Major
    { root: 110.0, notes: [220.0, 277.18, 329.63, 440.0] },
    // B Minor
    { root: 123.47, notes: [246.94, 293.66, 369.99, 493.88] },
    // F# Minor
    { root: 92.5, notes: [185.0, 220.0, 277.18, 369.99] },
    // G Major
    { root: 98.0, notes: [196.0, 246.94, 293.66, 392.0] },
    // D Major / F#
    { root: 146.83, notes: [220.0, 293.66, 369.99, 440.0] },
    // G Major
    { root: 98.0, notes: [196.0, 246.94, 293.66, 392.0] },
    // A Major (Dominant resolve)
    { root: 110.0, notes: [220.0, 277.18, 329.63, 554.37] },
  ];

  public init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private playPianoNote(freq: number, startTime: number, duration: number, velocity: number = 0.5) {
    if (!this.ctx || !this.gainNode) return;

    // Dual oscillator for rich warm acoustic piano harmonic resonance
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // subtle chorus detune

    // Warm Lowpass Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1600, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    // Natural piano amplitude envelope: quick attack, smooth exponential decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.35, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  private scheduleNextMeasure() {
    if (!this.isPlaying || !this.ctx) return;

    const currentChord = this.chords[this.stepIndex % this.chords.length];
    const now = this.ctx.currentTime;
    const noteGap = 0.55; // tempo ~ 75 BPM

    // Play bass root note
    this.playPianoNote(currentChord.root, now, 3.2, 0.45);

    // Play gentle arpeggiated upper notes
    currentChord.notes.forEach((freq, idx) => {
      this.playPianoNote(freq, now + (idx + 1) * noteGap * 0.75, 2.4, 0.38);
    });

    this.stepIndex++;
    const measureDuration = 2400; // ms per measure
    this.timerId = window.setTimeout(() => {
      this.scheduleNextMeasure();
    }, measureDuration);
  }

  public play() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.scheduleNextMeasure();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.25, this.ctx.currentTime);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new RomanticWeddingSynth();
