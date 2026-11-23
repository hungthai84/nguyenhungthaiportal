import React, { useEffect, useMemo, useRef } from 'react';
import {
  PrismWaveWallpaper,
  PRISM_WAVE_WALLPAPER_ID,
} from './PrismWaveWallpaper';

export const ANIMATED_SCENE_WALLPAPER_IDS = {
  PRISM_WAVE: PRISM_WAVE_WALLPAPER_ID,
  SKY_BUBBLES: 'css-sky-rising-bubbles',
  CONFETTI_BALLS: 'css-confetti-floating-balls',
  CYAN_XO: 'css-cyan-xo-motion',
  TEAL_VIOLET_AURORA: 'css-teal-violet-aurora',
  PASTEL_PARTICLES: 'css-pastel-hsl-particles',
  MOUNTAIN_CLOUDS: 'css-mountain-cloud-layers',
  INTERACTIVE_BLOBS: 'css-interactive-liquid-blobs',
  COSMIC_BOKEH: 'css-cosmic-bokeh-beams',
} as const;

const ANIMATED_ID_SET = new Set<string>(Object.values(ANIMATED_SCENE_WALLPAPER_IDS));

export function isAnimatedSceneWallpaper(id?: string | null): boolean {
  return Boolean(id && ANIMATED_ID_SET.has(id));
}

export interface AnimatedSceneWallpaperProps {
  id: string;
  compact?: boolean;
  isDark?: boolean;
  className?: string;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const CONFETTI_COLORS = ['#3CC157', '#2AA7FF', '#1B1B1B', '#FCBC0F', '#F85F36'];

interface BallSpec {
  id: number;
  color: string;
  leftPct: number;
  topPct: number;
  sizeEm: number;
  scale: number;
  toXRem: number;
  toYRem: number;
  durationMs: number;
}

interface ParticleSpec {
  id: number;
  sizePx: number;
  opacity: number;
  hue: number;
  delaySec: number;
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
}

/* 1. Sky Blue Rising Bubbles (Hinh_nen_9) */
const SkyRisingBubblesStage: React.FC<{ compact?: boolean }> = React.memo(({ compact }) => (
  <div
    aria-hidden="true"
    className={`wp-sky-bubbles-stage ${compact ? 'wp-sky-bubbles-stage--compact' : ''}`}
  >
    <div className="wp-sky-bubbles-track">
      {Array.from({ length: 10 }, (_, idx) => (
        <div key={idx} className={`wp-sky-bubble wp-sky-bubble--${idx + 1}`} />
      ))}
    </div>
  </div>
));
SkyRisingBubblesStage.displayName = 'SkyRisingBubblesStage';

/* 2. Colorful Floating Balls (Hinh_nen_2) */
const ConfettiFloatingBallsStage: React.FC<{ compact?: boolean; isDark?: boolean }> = React.memo(
  ({ compact, isDark }) => {
    const balls = useMemo<BallSpec[]>(() => {
      const rand = createSeededRandom(20261123);
      return Array.from({ length: compact ? 24 : 50 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
        leftPct: Math.floor(rand() * 96),
        topPct: Math.floor(rand() * 96),
        sizeEm: 0.45 + rand() * 0.85,
        scale: 0.55 + rand() * 0.65,
        toXRem: (rand() * 11) * (i % 2 === 0 ? -1 : 1),
        toYRem: 3 + rand() * 9,
        durationMs: Math.round((rand() + 1) * 2400),
      }));
    }, [compact]);

    return (
      <div
        aria-hidden="true"
        className={`wp-confetti-stage ${compact ? 'wp-confetti-stage--compact' : ''}`}
        style={{
          background: isDark
            ? 'linear-gradient(145deg, #0b1120 0%, #111827 55%, #172554 100%)'
            : 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 55%, #f0f9ff 100%)',
        }}
      >
        {balls.map((b) => (
          <div
            key={b.id}
            className="wp-confetti-ball"
            style={
              {
                background: b.color,
                left: `${b.leftPct}%`,
                top: `${b.topPct}%`,
                width: `${b.sizeEm}em`,
                height: `${b.sizeEm}em`,
                animationDuration: `${b.durationMs}ms`,
                '--ball-scale': b.scale,
                '--ball-tx': `${compact ? b.toXRem * 0.35 : b.toXRem}rem`,
                '--ball-ty': `${compact ? b.toYRem * 0.35 : b.toYRem}rem`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    );
  }
);
ConfettiFloatingBallsStage.displayName = 'ConfettiFloatingBallsStage';

/* 3. Cyan Canvas X & O Pattern (Hinh_nen_3) */
const CyanXoCanvasStage: React.FC<{ compact?: boolean }> = React.memo(({ compact }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    interface XoItem {
      kind: 'o' | 'x';
      x: number;
      y: number;
      r: number;
      s: number;
      w: number;
      rot: number;
      dr: number;
      phase: number;
    }

    let items: XoItem[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;

    const rebuild = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(120, Math.floor(rect.width));
      height = Math.max(80, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = createSeededRandom(303132);
      const count = compact ? 18 : Math.min(90, Math.max(36, Math.floor((width * height) / 14000)));
      const scaleFactor = compact ? 0.55 : 1;
      items = Array.from({ length: count }, () => {
        const s = (((rand() * 5 + 1) / 10) * scaleFactor);
        const kind = rand() >= 0.5 ? 'o' : 'x';
        return {
          kind,
          x: rand() * width,
          y: rand() * height,
          r: 12 * s,
          s: 20 * s,
          w: Math.max(1.5, 4.5 * s),
          rot: rand() * 360,
          dr: (rand() * 3 - 1) / 10,
          phase: rand() * 1000,
        };
      });
    };

    const drawFrame = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = timeMs * 0.6;
      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        if (!prefersReducedMotion) {
          it.rot += it.dr;
        }
        if (it.kind === 'o') {
          const ox = it.x + Math.sin((50 + it.x + t / 10 + it.phase) / 100) * (compact ? 1.8 : 3);
          const oy = it.y + Math.sin((45 + it.x + t / 10 + it.phase) / 100) * (compact ? 2.2 : 4);
          ctx.beginPath();
          ctx.arc(ox, oy, it.r, 0, Math.PI * 2, false);
          ctx.lineWidth = it.w;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
          ctx.stroke();
        } else {
          const xx = it.x + Math.sin((it.x + t / 10 + it.phase) / 100) * (compact ? 2.5 : 5);
          const xy = it.y + Math.sin((10 + it.x + t / 10 + it.phase) / 100) * (compact ? 1.5 : 2);
          const half = it.s / 2;
          ctx.save();
          ctx.translate(xx, xy);
          ctx.rotate((it.rot * Math.PI) / 180);
          ctx.lineWidth = it.w;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
          ctx.beginPath();
          ctx.moveTo(-half, -half);
          ctx.lineTo(half, half);
          ctx.moveTo(half, -half);
          ctx.lineTo(-half, half);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    rebuild();
    drawFrame(0);

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            rebuild();
            drawFrame(performance.now());
          })
        : null;
    observer?.observe(container);

    const tick = (now: number) => {
      if (!document.hidden) {
        drawFrame(now);
      }
      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    if (!prefersReducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [compact]);

  return (
    <div ref={containerRef} aria-hidden="true" className="wp-cyan-xo-stage">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
});
CyanXoCanvasStage.displayName = 'CyanXoCanvasStage';

/* 4. Teal-Blue-Violet Animated Aurora (Hinh_nen_4) */
const TealVioletAuroraStage: React.FC = React.memo(() => (
  <div aria-hidden="true" className="wp-teal-violet-stage">
    <div className="wp-teal-violet-veil" />
  </div>
));
TealVioletAuroraStage.displayName = 'TealVioletAuroraStage';

/* 5. Soft Mint Floating HSL Particles (Hinh_nen_5) */
const PastelHslParticlesStage: React.FC<{ compact?: boolean; isDark?: boolean }> = React.memo(
  ({ compact, isDark }) => {
    const particles = useMemo<ParticleSpec[]>(() => {
      const rand = createSeededRandom(505152);
      return Array.from({ length: compact ? 18 : 30 }, (_, i) => ({
        id: i,
        sizePx: Math.round((rand() * 5 + 5) * (compact ? 0.72 : 1.1)),
        opacity: Number((0.35 + rand() * 0.65).toFixed(2)),
        hue: Math.floor(rand() * 360),
        delaySec: Number((-(i + 1) * 0.45).toFixed(2)),
        startX: Math.round(rand() * 90),
        startY: Math.round(rand() * 90),
        startZ: Math.round(rand() * 80),
        endX: Math.round(rand() * 90),
        endY: Math.round(rand() * 90),
        endZ: Math.round(rand() * 80),
      }));
    }, [compact]);

    return (
      <div
        aria-hidden="true"
        className="wp-hsl-particles-stage"
        style={{
          background: isDark
            ? 'linear-gradient(145deg, #0d161b 0%, #132129 100%)'
            : '#ecf3f3',
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="wp-hsl-particle"
            style={
              {
                width: `${p.sizePx}px`,
                height: `${p.sizePx}px`,
                opacity: p.opacity,
                background: `hsl(${p.hue}, 70%, ${isDark ? 60 : 50}%)`,
                animationDelay: `${p.delaySec}s`,
                '--px-start': `${p.startX}%`,
                '--py-start': `${p.startY}%`,
                '--px-end': `${p.endX}%`,
                '--py-end': `${p.endY}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    );
  }
);
PastelHslParticlesStage.displayName = 'PastelHslParticlesStage';

/* 6. Layered Mountains & Drifting Clouds (Hinh_nen_6) */
const MountainCloudLayersStage: React.FC<{ compact?: boolean }> = React.memo(({ compact }) => (
  <div
    aria-hidden="true"
    className={`wp-mountain-layers-stage ${compact ? 'wp-mountain-layers-stage--compact' : ''}`}
  >
    {/* Distant mountain silhouette (layer 3) */}
    <svg
      viewBox="0 0 1440 480"
      preserveAspectRatio="none"
      className="wp-mountain-svg wp-mountain-svg--3"
    >
      <path
        d="M0,480 L0,250 L190,145 L390,235 L610,120 L860,240 L1080,140 L1275,215 L1440,150 L1440,480 Z"
        fill="rgba(79, 108, 168, 0.42)"
      />
    </svg>

    {/* Drifting cloud layer 3 */}
    <div className="wp-cloud-band wp-cloud-band--3" />

    {/* Mid mountain silhouette (layer 2) */}
    <svg
      viewBox="0 0 1440 480"
      preserveAspectRatio="none"
      className="wp-mountain-svg wp-mountain-svg--2"
    >
      <path
        d="M0,480 L0,310 L210,210 L460,315 L700,190 L960,305 L1210,205 L1440,290 L1440,480 Z"
        fill="rgba(53, 73, 126, 0.56)"
      />
    </svg>

    {/* Drifting cloud layer 2 */}
    <div className="wp-cloud-band wp-cloud-band--2" />

    {/* Foreground mountain silhouette (layer 1) */}
    <svg
      viewBox="0 0 1440 480"
      preserveAspectRatio="none"
      className="wp-mountain-svg wp-mountain-svg--1"
    >
      <path
        d="M0,480 L0,365 L180,295 L420,385 L680,270 L950,375 L1190,285 L1440,360 L1440,480 Z"
        fill="rgba(34, 44, 86, 0.72)"
      />
    </svg>

    {/* Drifting cloud layer 1 */}
    <div className="wp-cloud-band wp-cloud-band--1" />

    {/* Pastel atmospheric gradient veil */}
    <div className="wp-mountain-pastel-veil" />
  </div>
));
MountainCloudLayersStage.displayName = 'MountainCloudLayersStage';

/* 7. Interactive Liquid Gradient Blobs (Hinh_nen_7) */
const InteractiveLiquidBlobsStage: React.FC<{ compact?: boolean; isDark?: boolean }> = React.memo(
  ({ compact, isDark }) => {
    const interRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (compact) return;
      const el = interRef.current;
      if (!el) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      let curX = window.innerWidth * 0.5;
      let curY = window.innerHeight * 0.5;
      let tgX = curX;
      let tgY = curY;
      let rafId = 0;

      const onPointerMove = (event: PointerEvent) => {
        tgX = event.clientX;
        tgY = event.clientY;
      };

      const animate = () => {
        if (!document.hidden) {
          curX += (tgX - curX) / 20;
          curY += (tgY - curY) / 20;
          el.style.transform = `translate3d(${Math.round(curX)}px, ${Math.round(curY)}px, 0)`;
        }
        rafId = window.requestAnimationFrame(animate);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      rafId = window.requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }, [compact]);

    return (
      <div
        aria-hidden="true"
        className={`wp-liquid-blobs-stage ${compact ? 'wp-liquid-blobs-stage--compact' : ''} ${
          isDark ? 'wp-liquid-blobs-stage--dark' : ''
        }`}
      >
        <div className="wp-liquid-blobs-container">
          <div className="wp-liquid-blob wp-liquid-blob--1" />
          <div className="wp-liquid-blob wp-liquid-blob--2" />
          <div className="wp-liquid-blob wp-liquid-blob--3" />
          <div className="wp-liquid-blob wp-liquid-blob--4" />
          <div className="wp-liquid-blob wp-liquid-blob--5" />
          <div ref={interRef} className="wp-liquid-blob-interactive" />
        </div>
      </div>
    );
  }
);
InteractiveLiquidBlobsStage.displayName = 'InteractiveLiquidBlobsStage';

/* 8. Cosmic Blue-Violet Bokeh & Diagonal Light Beams (Hinh_nen_8) */
const CosmicBokehBeamsStage: React.FC<{ compact?: boolean }> = React.memo(({ compact }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bokehCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const beamCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bgCanvas = bgCanvasRef.current;
    const bokehCanvas = bokehCanvasRef.current;
    const beamCanvas = beamCanvasRef.current;
    if (!container || !bgCanvas || !bokehCanvas || !beamCanvas) return;

    const bctx = bgCanvas.getContext('2d');
    const fctx1 = bokehCanvas.getContext('2d');
    const fctx2 = beamCanvas.getContext('2d');
    if (!bctx || !fctx1 || !fctx2) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const degree = (20 / 360) * Math.PI * 2;
    const sin = Math.sin(degree);
    const cos = Math.cos(degree);
    const baseSpeed = compact ? 0.28 : 0.5;

    interface CircleParticle {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
    }

    interface LineBeam {
      x: number;
      y: number;
      width: number;
      alpha: number;
      speed: number;
    }

    let width = 0;
    let height = 0;
    let circles: CircleParticle[] = [];
    let lines: LineBeam[] = [];
    let rafId = 0;

    const drawBackdrop = () => {
      bctx.clearRect(0, 0, width, height);

      bctx.save();
      const g0 = bctx.createRadialGradient(
        width * 0.3,
        height * 0.1,
        0,
        width * 0.3,
        height * 0.1,
        width * 0.9
      );
      g0.addColorStop(0, 'rgb(0, 26, 77)');
      g0.addColorStop(1, 'transparent');
      bctx.translate(width, 0);
      bctx.scale(-1, 1);
      bctx.fillStyle = g0;
      bctx.fillRect(0, 0, width, height);
      bctx.restore();

      const g1 = bctx.createRadialGradient(
        width * 0.1,
        height * 0.1,
        0,
        width * 0.3,
        height * 0.1,
        width
      );
      g1.addColorStop(0, 'rgb(0, 150, 240)');
      g1.addColorStop(0.8, 'transparent');
      bctx.fillStyle = g1;
      bctx.fillRect(0, 0, width, height);

      const g2 = bctx.createRadialGradient(
        width * 0.1,
        height * 0.5,
        0,
        width * 0.1,
        height * 0.5,
        width * 0.5
      );
      g2.addColorStop(0, 'rgb(40, 20, 105)');
      g2.addColorStop(1, 'transparent');
      bctx.fillStyle = g2;
      bctx.fillRect(0, 0, width, height);
    };

    const drawParticles = (advance: boolean) => {
      fctx1.clearRect(0, 0, width, height);
      for (let i = 0; i < circles.length; i += 1) {
        const item = circles[i];
        if (advance) {
          item.x += sin * item.speed;
          item.y -= cos * item.speed;
          if (item.x > width + item.radius) item.x = -item.radius;
          else if (item.x < -item.radius) item.x = width + item.radius;
          if (item.y > height + item.radius) item.y = -item.radius;
          else if (item.y < -item.radius) item.y = height + item.radius;
        }
        const grad = fctx1.createRadialGradient(
          item.x,
          item.y,
          item.radius,
          item.x,
          item.y,
          0
        );
        grad.addColorStop(0, `rgba(157, 97, 207, ${item.alpha})`);
        grad.addColorStop(1, `rgba(157, 97, 207, ${Math.max(0.02, item.alpha - 0.1)})`);
        fctx1.beginPath();
        fctx1.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
        fctx1.fillStyle = grad;
        fctx1.fill();
      }

      fctx2.clearRect(0, 0, width, height);
      for (let j = 0; j < lines.length; j += 1) {
        const item = lines[j];
        if (advance) {
          item.x += sin * item.speed;
          item.y -= cos * item.speed;
          if (item.x > width + item.width * sin) item.x = -item.width * sin;
          else if (item.x < -item.width * sin) item.x = width + item.width * sin;
          if (item.y > height + item.width * cos) item.y = -item.width * cos;
          else if (item.y < -item.width * cos) item.y = height + item.width * cos;
        }
        const endX = item.x + sin * item.width;
        const endY = item.y - cos * item.width;
        const grad = fctx2.createLinearGradient(item.x, item.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${item.alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${Math.max(0.02, item.alpha - 0.1)})`);
        fctx2.beginPath();
        fctx2.moveTo(item.x, item.y);
        fctx2.lineTo(endX, endY);
        fctx2.lineWidth = compact ? 1.6 : 3;
        fctx2.lineCap = 'round';
        fctx2.strokeStyle = grad;
        fctx2.stroke();
      }
    };

    const rebuild = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(120, Math.floor(rect.width));
      height = Math.max(80, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      [bgCanvas, bokehCanvas, beamCanvas].forEach((cv) => {
        cv.width = Math.floor(width * dpr);
        cv.height = Math.floor(height * dpr);
      });
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx1.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx2.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = createSeededRandom(808182);
      const scaleSize = compact ? 0.36 : 1;

      circles = [];
      for (let i = 0; i < 6; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          circles.push({
            x: rand() * width,
            y: rand() * height,
            radius: (rand() * (20 + j * 5) + (20 + j * 5)) * scaleSize,
            alpha: Math.max(0.06, rand() * 0.2 + (0.3 - j * 0.1)),
            speed: baseSpeed * (1 + j * 0.5),
          });
        }
      }

      lines = [];
      for (let m = 0; m < 4; m += 1) {
        for (let n = 0; n < 3; n += 1) {
          lines.push({
            x: rand() * width,
            y: rand() * height,
            width: (rand() * (20 + n * 5) + (20 + n * 5)) * scaleSize,
            alpha: Math.max(0.06, rand() * 0.2 + (0.3 - n * 0.1)),
            speed: baseSpeed * (1 + n * 0.5),
          });
        }
      }

      drawBackdrop();
      drawParticles(false);
    };

    rebuild();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            rebuild();
          })
        : null;
    observer?.observe(container);

    const tick = () => {
      if (!document.hidden) {
        drawParticles(true);
      }
      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    if (!prefersReducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [compact]);

  return (
    <div ref={containerRef} aria-hidden="true" className="wp-cosmic-bokeh-stage">
      <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full block" />
      <canvas ref={bokehCanvasRef} className="absolute inset-0 w-full h-full block" />
      <canvas ref={beamCanvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
});
CosmicBokehBeamsStage.displayName = 'CosmicBokehBeamsStage';

export const AnimatedSceneWallpaper: React.FC<AnimatedSceneWallpaperProps> = React.memo(
  ({ id, compact = false, isDark = false, className = '' }) => {
    switch (id) {
      case ANIMATED_SCENE_WALLPAPER_IDS.PRISM_WAVE:
        return <PrismWaveWallpaper compact={compact} className={className} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.SKY_BUBBLES:
        return <SkyRisingBubblesStage compact={compact} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.CONFETTI_BALLS:
        return <ConfettiFloatingBallsStage compact={compact} isDark={isDark} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.CYAN_XO:
        return <CyanXoCanvasStage compact={compact} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.TEAL_VIOLET_AURORA:
        return <TealVioletAuroraStage />;
      case ANIMATED_SCENE_WALLPAPER_IDS.PASTEL_PARTICLES:
        return <PastelHslParticlesStage compact={compact} isDark={isDark} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.MOUNTAIN_CLOUDS:
        return <MountainCloudLayersStage compact={compact} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.INTERACTIVE_BLOBS:
        return <InteractiveLiquidBlobsStage compact={compact} isDark={isDark} />;
      case ANIMATED_SCENE_WALLPAPER_IDS.COSMIC_BOKEH:
        return <CosmicBokehBeamsStage compact={compact} />;
      default:
        return null;
    }
  }
);

AnimatedSceneWallpaper.displayName = 'AnimatedSceneWallpaper';

export default AnimatedSceneWallpaper;
