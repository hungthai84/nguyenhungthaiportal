import { AUDIO_PREF_EVENT, getSavedMutedPref } from '@/utils/audioPreference';

export type SoundThemeProfile = 'soft-glass' | 'crystal' | 'liquid' | 'digital' | 'futuristic' | 'minimal';
export type StudioSoundEvent =
  | 'buttonClick'
  | 'buttonHover'
  | 'toggleOn'
  | 'toggleOff'
  | 'tabChange'
  | 'cardSelect'
  | 'popupOpen'
  | 'popupClose'
  | 'notification'
  | 'success'
  | 'error';

export interface SoundEngineSettings {
  enabled: boolean;
  volume: number; // 0..100
  theme: SoundThemeProfile;
  hoverSound: boolean;
  clickSound: boolean;
  notificationSound: boolean;
  events: Record<StudioSoundEvent, boolean>;
}

interface ThemeAcousticProfile {
  oscType: OscillatorType;
  pitchScale: number;
  tapStartFreq: number;
  tapEndFreq: number;
  tapDur: number;
  popStartFreq: number;
  popEndFreq: number;
  chimeNotes: [number, number, number];
  flipNotes: [number, number];
}

const THEME_ACOUSTIC_PROFILES: Record<string, ThemeAcousticProfile> = {
  'liquid-glass': {
    oscType: 'sine',
    pitchScale: 1.0,
    tapStartFreq: 920,
    tapEndFreq: 560,
    tapDur: 0.045,
    popStartFreq: 640,
    popEndFreq: 1280,
    chimeNotes: [1240, 1620, 2040],
    flipNotes: [540, 810],
  },
  'dark-liquid-glass': {
    oscType: 'sine',
    pitchScale: 0.88,
    tapStartFreq: 780,
    tapEndFreq: 460,
    tapDur: 0.05,
    popStartFreq: 520,
    popEndFreq: 1040,
    chimeNotes: [1040, 1380, 1760],
    flipNotes: [460, 690],
  },
  'cowhide-leather': {
    oscType: 'triangle',
    pitchScale: 0.72,
    tapStartFreq: 420,
    tapEndFreq: 210,
    tapDur: 0.055,
    popStartFreq: 340,
    popEndFreq: 620,
    chimeNotes: [520, 680, 860],
    flipNotes: [330, 495],
  },
  'walnut-wood': {
    oscType: 'triangle',
    pitchScale: 0.68,
    tapStartFreq: 380,
    tapEndFreq: 185,
    tapDur: 0.052,
    popStartFreq: 310,
    popEndFreq: 560,
    chimeNotes: [480, 640, 820],
    flipNotes: [310, 465],
  },
  'deep-ocean': {
    oscType: 'sine',
    pitchScale: 0.82,
    tapStartFreq: 560,
    tapEndFreq: 860,
    tapDur: 0.06,
    popStartFreq: 480,
    popEndFreq: 980,
    chimeNotes: [880, 1180, 1520],
    flipNotes: [420, 660],
  },
  'neumorphism-beyond': {
    oscType: 'sine',
    pitchScale: 0.94,
    tapStartFreq: 680,
    tapEndFreq: 440,
    tapDur: 0.042,
    popStartFreq: 540,
    popEndFreq: 960,
    chimeNotes: [980, 1280, 1620],
    flipNotes: [480, 720],
  },
  'dark-neumorphism-beyond': {
    oscType: 'sine',
    pitchScale: 0.84,
    tapStartFreq: 590,
    tapEndFreq: 380,
    tapDur: 0.046,
    popStartFreq: 460,
    popEndFreq: 840,
    chimeNotes: [840, 1120, 1440],
    flipNotes: [420, 630],
  },
  'frost-ice-neu': {
    oscType: 'triangle',
    pitchScale: 1.18,
    tapStartFreq: 1120,
    tapEndFreq: 740,
    tapDur: 0.04,
    popStartFreq: 780,
    popEndFreq: 1520,
    chimeNotes: [1480, 1920, 2420],
    flipNotes: [640, 960],
  },
  'flat-soft-ui': {
    oscType: 'sine',
    pitchScale: 0.96,
    tapStartFreq: 740,
    tapEndFreq: 510,
    tapDur: 0.036,
    popStartFreq: 580,
    popEndFreq: 1020,
    chimeNotes: [1060, 1340, 1680],
    flipNotes: [500, 740],
  },
  'dark-flat-soft-ui': {
    oscType: 'sine',
    pitchScale: 0.86,
    tapStartFreq: 640,
    tapEndFreq: 430,
    tapDur: 0.038,
    popStartFreq: 490,
    popEndFreq: 880,
    chimeNotes: [920, 1180, 1480],
    flipNotes: [440, 650],
  },
  'mica-fluent': {
    oscType: 'triangle',
    pitchScale: 1.04,
    tapStartFreq: 860,
    tapEndFreq: 540,
    tapDur: 0.044,
    popStartFreq: 620,
    popEndFreq: 1180,
    chimeNotes: [1160, 1520, 1940],
    flipNotes: [520, 790],
  },
  'gradient-dopamine': {
    oscType: 'triangle',
    pitchScale: 1.14,
    tapStartFreq: 980,
    tapEndFreq: 660,
    tapDur: 0.045,
    popStartFreq: 720,
    popEndFreq: 1440,
    chimeNotes: [1320, 1760, 2240],
    flipNotes: [600, 920],
  },
  'iridescent-liquid-glass': {
    oscType: 'sine',
    pitchScale: 1.22,
    tapStartFreq: 1080,
    tapEndFreq: 680,
    tapDur: 0.048,
    popStartFreq: 760,
    popEndFreq: 1540,
    chimeNotes: [1420, 1880, 2360],
    flipNotes: [620, 940],
  },
  'dark-iridescent-liquid-glass': {
    oscType: 'sine',
    pitchScale: 1.08,
    tapStartFreq: 940,
    tapEndFreq: 580,
    tapDur: 0.05,
    popStartFreq: 660,
    popEndFreq: 1340,
    chimeNotes: [1260, 1660, 2120],
    flipNotes: [550, 840],
  },
};

class SoundEngineClass {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastTapTime: number = 0;
  private lastHoverTime: number = 0;
  private lastFlipTime: number = 0;
  private lastBookSoundTime: number = 0;
  private studioOverrideActive: boolean = false;
  private activeThemeMode: string = 'liquid-glass';
  private globalMuted: boolean = getSavedMutedPref(true);
  private settings: SoundEngineSettings = {
    enabled: false,
    volume: 45,
    theme: 'soft-glass',
    hoverSound: false,
    clickSound: true,
    notificationSound: true,
    events: {
      buttonClick: true,
      buttonHover: false,
      toggleOn: true,
      toggleOff: true,
      tabChange: true,
      cardSelect: true,
      popupOpen: true,
      popupClose: true,
      notification: true,
      success: true,
      error: true,
    },
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener(AUDIO_PREF_EVENT, (evt: Event) => {
        const detail = (evt as CustomEvent<{ muted?: boolean }>).detail;
        this.globalMuted =
          typeof detail?.muted === 'boolean' ? detail.muted : getSavedMutedPref(true);
      });
    }
  }

  setGlobalMuted(muted: boolean) {
    this.globalMuted = Boolean(muted);
  }

  private canPlaySound(forcePreview = false): boolean {
    if (forcePreview) return true;
    if (this.globalMuted) return false;
    if (this.studioOverrideActive && !this.settings.enabled) return false;
    return true;
  }

  setThemeSoundMode(mode: string) {
    if (mode && THEME_ACOUSTIC_PROFILES[mode]) {
      this.activeThemeMode = mode;
    } else {
      this.activeThemeMode = 'liquid-glass';
    }
  }

  private getActiveAcousticProfile(): ThemeAcousticProfile {
    return THEME_ACOUSTIC_PROFILES[this.activeThemeMode] || THEME_ACOUSTIC_PROFILES['liquid-glass'];
  }

  configureStudioSound(settings: SoundEngineSettings | null) {
    if (!settings) {
      this.studioOverrideActive = false;
      return;
    }
    this.studioOverrideActive = true;
    this.settings = {
      ...settings,
      events: { ...settings.events },
    };
  }

  private getVolumeGain(base: number): number {
    if (this.globalMuted) return 0;
    if (!this.studioOverrideActive) return base;
    if (!this.settings.enabled) return 0;
    return base * Math.max(0, Math.min(1, this.settings.volume / 100)) * 1.4;
  }

  private getThemeOscType(): OscillatorType {
    if (!this.studioOverrideActive) {
      return this.getActiveAcousticProfile().oscType;
    }
    switch (this.settings.theme) {
      case 'crystal':
        return 'triangle';
      case 'digital':
        return 'square';
      case 'futuristic':
        return 'sawtooth';
      case 'liquid':
      case 'minimal':
      case 'soft-glass':
      default:
        return 'sine';
    }
  }

  playEvent(event: StudioSoundEvent, forcePreview = false) {
    try {
      if (!this.canPlaySound(forcePreview)) return;
      if (!forcePreview && this.studioOverrideActive) {
        if (!this.settings.events[event]) return;
        if (event === 'buttonHover' && !this.settings.hoverSound) return;
        if ((event === 'buttonClick' || event === 'cardSelect') && !this.settings.clickSound) return;
        if ((event === 'notification' || event === 'success' || event === 'error') && !this.settings.notificationSound) return;
      }

      const now = Date.now();
      if (event === 'buttonHover') {
        if (now - this.lastHoverTime < 140) return;
        this.lastHoverTime = now;
      }

      const ctx = this.getContext();
      if (!ctx) return;

      const volScale = forcePreview
        ? Math.max(0.15, Math.min(1, this.settings.volume / 100))
        : this.studioOverrideActive
          ? Math.max(0, Math.min(1, this.settings.volume / 100))
          : 0.5;
      if (volScale <= 0) return;

      const profile = this.getActiveAcousticProfile();
      const type = this.getThemeOscType();
      const studioShift =
        this.settings.theme === 'crystal'
          ? 1.28
          : this.settings.theme === 'futuristic'
            ? 1.12
            : this.settings.theme === 'liquid'
              ? 0.88
              : this.settings.theme === 'minimal'
                ? 0.78
                : 1;
      const pitchShift = this.studioOverrideActive ? studioShift : profile.pitchScale;

      const t = ctx.currentTime;
      const playTone = (startFreq: number, endFreq: number, dur: number, offset = 0, peak = 0.09) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(startFreq * pitchShift, t + offset);
        osc.frequency.exponentialRampToValueAtTime(Math.max(60, endFreq * pitchShift), t + offset + dur);
        gain.gain.setValueAtTime(0.001, t + offset);
        gain.gain.linearRampToValueAtTime(peak * volScale, t + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + offset);
        osc.stop(t + offset + dur + 0.01);
      };

      switch (event) {
        case 'buttonClick':
          playTone(760, 480, 0.06, 0, 0.11);
          break;
        case 'buttonHover':
          playTone(980, 1120, 0.035, 0, 0.045);
          break;
        case 'toggleOn':
          playTone(540, 880, 0.08, 0, 0.1);
          break;
        case 'toggleOff':
          playTone(780, 440, 0.08, 0, 0.09);
          break;
        case 'tabChange':
          playTone(620, 790, 0.07, 0, 0.085);
          break;
        case 'cardSelect':
          playTone(680, 960, 0.09, 0, 0.095);
          break;
        case 'popupOpen':
          playTone(480, 760, 0.09, 0, 0.085);
          playTone(760, 1080, 0.12, 0.045, 0.075);
          break;
        case 'popupClose':
          playTone(840, 520, 0.09, 0, 0.085);
          break;
        case 'notification':
          playTone(880, 1180, 0.11, 0, 0.09);
          playTone(1180, 1480, 0.14, 0.07, 0.07);
          break;
        case 'success':
          playTone(587, 784, 0.09, 0, 0.09);
          playTone(784, 1175, 0.16, 0.07, 0.095);
          break;
        case 'error':
          playTone(340, 220, 0.11, 0, 0.11);
          playTone(260, 175, 0.14, 0.09, 0.1);
          break;
      }
    } catch {}
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const durationSec = 0.6;
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Warm pink-tinted noise (Paul Kellet's refined filter) for natural paper texture
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = Math.max(-1, Math.min(1, pink * 0.14));
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  playPop() {
    try {
      const vol = this.getVolumeGain(0.12);
      if (vol <= 0) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const profile = this.getActiveAcousticProfile();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = profile.oscType;
      osc.frequency.setValueAtTime(profile.popStartFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(profile.popEndFreq, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  playTap() {
    try {
      if (!this.canPlaySound(false)) return;
      if (this.studioOverrideActive) {
        this.playEvent('buttonClick');
        return;
      }
      const now = Date.now();
      if (now - this.lastTapTime < 55) return;
      this.lastTapTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      const profile = this.getActiveAcousticProfile();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = profile.oscType;
      osc.frequency.setValueAtTime(profile.tapStartFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(profile.tapEndFreq, ctx.currentTime + profile.tapDur);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + profile.tapDur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + profile.tapDur);
    } catch {}
  }

  playGlassChime() {
    try {
      if (!this.canPlaySound(false)) return;
      if (this.studioOverrideActive) {
        this.playEvent('cardSelect');
        return;
      }
      const ctx = this.getContext();
      if (!ctx) return;
      const profile = this.getActiveAcousticProfile();
      profile.chimeNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = profile.oscType;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.2);
      });
    } catch {}
  }

  playPageFlip() {
    try {
      if (!this.canPlaySound(false)) return;
      if (this.studioOverrideActive) {
        this.playEvent('tabChange');
        return;
      }
      const now = Date.now();
      if (now - this.lastFlipTime < 80) return;
      this.lastFlipTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      const profile = this.getActiveAcousticProfile();
      profile.flipNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = profile.oscType;
        const start = ctx.currentTime + i * 0.045;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.18, start + 0.09);
        gain.gain.setValueAtTime(0.085, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.11);
      });
    } catch {}
  }

  /**
   * Realistic tactile book cover opening sound (warm spine lift + airy paper sweep + soft settle)
   */
  playBookOpen() {
    try {
      if (!this.canPlaySound(false)) return;
      const now = Date.now();
      if (now - this.lastBookSoundTime < 90) return;
      this.lastBookSoundTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const noiseBuf = this.getNoiseBuffer(ctx);

      // 1. Soft hardcover/spine creak & air lift
      const liftSrc = ctx.createBufferSource();
      liftSrc.buffer = noiseBuf;
      const liftFilter = ctx.createBiquadFilter();
      liftFilter.type = 'bandpass';
      liftFilter.Q.setValueAtTime(1.1, t);
      liftFilter.frequency.setValueAtTime(420, t);
      liftFilter.frequency.exponentialRampToValueAtTime(1250, t + 0.14);
      liftFilter.frequency.exponentialRampToValueAtTime(680, t + 0.30);
      const liftGain = ctx.createGain();
      liftGain.gain.setValueAtTime(0.001, t);
      liftGain.gain.linearRampToValueAtTime(0.22, t + 0.04);
      liftGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      liftSrc.connect(liftFilter);
      liftFilter.connect(liftGain);
      liftGain.connect(ctx.destination);
      liftSrc.start(t);
      liftSrc.stop(t + 0.34);

      // 2. Crisp paper edge shimmer
      const crispSrc = ctx.createBufferSource();
      crispSrc.buffer = noiseBuf;
      const crispFilter = ctx.createBiquadFilter();
      crispFilter.type = 'highpass';
      crispFilter.frequency.setValueAtTime(1900, t + 0.04);
      const crispGain = ctx.createGain();
      crispGain.gain.setValueAtTime(0.001, t + 0.04);
      crispGain.gain.linearRampToValueAtTime(0.11, t + 0.09);
      crispGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      crispSrc.connect(crispFilter);
      crispFilter.connect(crispGain);
      crispGain.connect(ctx.destination);
      crispSrc.start(t + 0.04, 0.08);
      crispSrc.stop(t + 0.27);

      // 3. Soft open-book settle thump
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(135, t + 0.15);
      thudOsc.frequency.exponentialRampToValueAtTime(58, t + 0.27);
      thudGain.gain.setValueAtTime(0.001, t + 0.15);
      thudGain.gain.linearRampToValueAtTime(0.07, t + 0.165);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(t + 0.15);
      thudOsc.stop(t + 0.29);
    } catch {}
  }

  /**
   * Realistic paper page flip rustle synced to forward (+1) or backward (-1) page turns
   */
  playBookPageTurn(dir: 1 | -1 = 1) {
    try {
      if (!this.canPlaySound(false)) return;
      const now = Date.now();
      if (now - this.lastBookSoundTime < 75) return;
      this.lastBookSoundTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const noiseBuf = this.getNoiseBuffer(ctx);

      // 1. Initial finger brush / paper edge lift
      const edgeSrc = ctx.createBufferSource();
      edgeSrc.buffer = noiseBuf;
      const edgeFilter = ctx.createBiquadFilter();
      edgeFilter.type = 'bandpass';
      edgeFilter.Q.setValueAtTime(1.6, t);
      edgeFilter.frequency.setValueAtTime(dir === 1 ? 2300 : 1950, t);
      const edgeGain = ctx.createGain();
      edgeGain.gain.setValueAtTime(0.001, t);
      edgeGain.gain.linearRampToValueAtTime(0.14, t + 0.018);
      edgeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
      edgeSrc.connect(edgeFilter);
      edgeFilter.connect(edgeGain);
      edgeGain.connect(ctx.destination);
      edgeSrc.start(t, 0.02);
      edgeSrc.stop(t + 0.095);

      // 2. Main paper arc swoosh across the spine
      const sweepSrc = ctx.createBufferSource();
      sweepSrc.buffer = noiseBuf;
      const sweepFilter = ctx.createBiquadFilter();
      sweepFilter.type = 'bandpass';
      sweepFilter.Q.setValueAtTime(1.25, t);
      if (dir === 1) {
        sweepFilter.frequency.setValueAtTime(880, t + 0.02);
        sweepFilter.frequency.exponentialRampToValueAtTime(2200, t + 0.13);
        sweepFilter.frequency.exponentialRampToValueAtTime(920, t + 0.24);
      } else {
        sweepFilter.frequency.setValueAtTime(1950, t + 0.02);
        sweepFilter.frequency.exponentialRampToValueAtTime(1050, t + 0.14);
        sweepFilter.frequency.exponentialRampToValueAtTime(760, t + 0.24);
      }
      const sweepGain = ctx.createGain();
      sweepGain.gain.setValueAtTime(0.001, t + 0.02);
      sweepGain.gain.linearRampToValueAtTime(0.24, t + 0.075);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      sweepSrc.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweepSrc.start(t + 0.02, 0.14);
      sweepSrc.stop(t + 0.26);

      // 3. Gentle paper settle against opposite page
      const settleSrc = ctx.createBufferSource();
      settleSrc.buffer = noiseBuf;
      const settleFilter = ctx.createBiquadFilter();
      settleFilter.type = 'lowpass';
      settleFilter.frequency.setValueAtTime(720, t + 0.18);
      const settleGain = ctx.createGain();
      settleGain.gain.setValueAtTime(0.001, t + 0.18);
      settleGain.gain.linearRampToValueAtTime(0.11, t + 0.205);
      settleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.27);
      settleSrc.connect(settleFilter);
      settleFilter.connect(settleGain);
      settleGain.connect(ctx.destination);
      settleSrc.start(t + 0.18, 0.28);
      settleSrc.stop(t + 0.28);
    } catch {}
  }

  /**
   * Soft muted book-closing sound when shutting cover or exiting book view
   */
  playBookClose() {
    try {
      if (!this.canPlaySound(false)) return;
      const now = Date.now();
      if (now - this.lastBookSoundTime < 75) return;
      this.lastBookSoundTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const noiseBuf = this.getNoiseBuffer(ctx);

      const puffSrc = ctx.createBufferSource();
      puffSrc.buffer = noiseBuf;
      const puffFilter = ctx.createBiquadFilter();
      puffFilter.type = 'lowpass';
      puffFilter.frequency.setValueAtTime(920, t);
      puffFilter.frequency.exponentialRampToValueAtTime(320, t + 0.16);
      const puffGain = ctx.createGain();
      puffGain.gain.setValueAtTime(0.001, t);
      puffGain.gain.linearRampToValueAtTime(0.18, t + 0.025);
      puffGain.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
      puffSrc.connect(puffFilter);
      puffFilter.connect(puffGain);
      puffGain.connect(ctx.destination);
      puffSrc.start(t, 0.22);
      puffSrc.stop(t + 0.18);

      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(115, t + 0.03);
      thudOsc.frequency.exponentialRampToValueAtTime(48, t + 0.15);
      thudGain.gain.setValueAtTime(0.001, t + 0.03);
      thudGain.gain.linearRampToValueAtTime(0.085, t + 0.045);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(t + 0.03);
      thudOsc.stop(t + 0.17);
    } catch {}
  }

  playCardFlip() {
    this.playPageFlip();
  }

  playTechChimeExpand() {
    this.playGlassChime();
  }

  playTechChimeCollapse() {
    this.playPop();
  }

  playClockTick() {
    this.playTap();
  }

  playRainDrop() {
    this.playPop();
  }

  playWeatherFeedback(cond?: string) {
    this.playGlassChime();
  }

  playPageSpecificSound(pageId: number) {
    try {
      if (!this.canPlaySound(false)) return;
      const vol = this.getVolumeGain(0.08);
      if (vol <= 0) return;
      const now = Date.now();
      if (now - this.lastTapTime < 50) return;
      this.lastTapTime = now;
      const ctx = this.getContext();
      if (!ctx) return;

      const frequencies: Record<number, number> = {
        0: 523.25, // C5
        1: 587.33, // D5
        2: 659.25, // E5 (Giới thiệu)
        3: 698.46, // F5 (Học vấn)
        4: 783.99, // G5 (Dịch vụ)
        5: 880.00, // A5 (Kinh nghiệm)
        6: 987.77, // B5 (Kỹ năng)
        7: 1046.50, // C6 (Dự án)
        8: 1174.66, // D6 (Hệ thống)
        9: 1318.51, // E6 (Phỏng vấn)
        10: 1396.91, // F6 (Tử vi)
        11: 1567.98, // G6 (Kỷ niệm)
        12: 1760.00, // A6 (Liên hệ)
        13: 1975.53, // B6 (AI Assistant)
        14: 2093.00, // C7
        15: 2349.32, // D7
        16: 2637.02, // E7
      };

      const profile = this.getActiveAcousticProfile();
      const baseFreq = (frequencies[pageId] || 784) * profile.pitchScale;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = profile.oscType;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }
}

export const SoundEngine = new SoundEngineClass();
