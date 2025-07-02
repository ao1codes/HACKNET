class SoundManager {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.3;
  private enabled: boolean = true;
  private rickrollOscillator: OscillatorNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private createBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createGlitchNoise(duration: number) {
    if (!this.audioContext || !this.enabled) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * this.volume * 0.1;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  play(soundName: string) {
    if (!this.enabled || !this.audioContext) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (soundName) {
      case 'startup':
        // Classic computer startup sound :)
        this.createBeep(200, 0.1);
        setTimeout(() => this.createBeep(400, 0.1), 100);
        setTimeout(() => this.createBeep(600, 0.2), 200);
        break;

      case 'typing':
        // Short typing click
        this.createBeep(800, 0.05, 'square');
        break;

      case 'success':
        // Success chime
        this.createBeep(523, 0.15); // C
        setTimeout(() => this.createBeep(659, 0.15), 150); // E
        setTimeout(() => this.createBeep(784, 0.3), 300); // G
        break;

      case 'glitch':
        // Glitch/error sound
        this.createGlitchNoise(0.3);
        break;

      case 'rickroll':
        // Simple melody approximation
        this.playRickrollMelody();
        break;

      default:
        console.log(`Unknown sound: ${soundName}`);
    }
  }

  private playRickrollMelody() {
    if (!this.audioContext || !this.enabled) return;

    // Simple Rick Astley "Never Gonna Give You Up" melody
    const notes = [
      { freq: 392, duration: 0.2 }, // G
      { freq: 440, duration: 0.2 }, // A
      { freq: 494, duration: 0.2 }, // B
      { freq: 440, duration: 0.2 }, // A
      { freq: 523, duration: 0.4 }, // C
      { freq: 523, duration: 0.4 }, // C
      { freq: 494, duration: 0.6 }, // B
    ];

    let currentTime = 0;
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.createBeep(note.freq, note.duration, 'sawtooth');
      }, currentTime * 1000);
      currentTime += note.duration;
    });
  }

  stop(soundName: string) {
    if (soundName === 'rickroll' && this.rickrollOscillator) {
      this.rickrollOscillator.stop();
      this.rickrollOscillator = null;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
