class SoundEngineClass {
  private ctx: AudioContext | null = null;
  private lastTapTime: number = 0;
  private lastFlipTime: number = 0;

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

  playPop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  playTap() {
    try {
      const now = Date.now();
      if (now - this.lastTapTime < 55) return;
      this.lastTapTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.045);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {}
  }

  playGlassChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      [1200, 1600, 2000].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
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
      const now = Date.now();
      if (now - this.lastFlipTime < 80) return;
      this.lastFlipTime = now;
      const ctx = this.getContext();
      if (!ctx) return;
      // Soft two-note ascending transition chime
      [520, 780].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
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
      
      const baseFreq = frequencies[pageId] || 784;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }
}

export const SoundEngine = new SoundEngineClass();
