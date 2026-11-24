import React, { useEffect, useRef } from 'react';

const ANIMATED_SCENE_WALLPAPER_IDS = new Set<string>([
  'css-prism-wave-flow',
  'css-sky-rising-bubbles',
  'css-cosmic-bokeh-beams',
  'css-interactive-liquid-blobs',
  'css-mountain-cloud-layers',
  'css-pastel-hsl-particles',
  'css-teal-violet-aurora',
  'css-cyan-xo-motion',
  'css-confetti-floating-balls',
]);

export function isAnimatedSceneWallpaper(id?: string | null): boolean {
  return Boolean(id && ANIMATED_SCENE_WALLPAPER_IDS.has(id));
}

export interface AnimatedSceneWallpaperProps {
  id: string;
  isDark?: boolean;
  compact?: boolean;
  className?: string;
}

const CONFETTI_BALLS = [
  { size: '3.4rem', left: '8%', top: '14%', color: '#f472b6', tx: '3.5rem', ty: '4.5rem', scale: '1', dur: '5.5s', delay: '0s' },
  { size: '2.2rem', left: '22%', top: '68%', color: '#38bdf8', tx: '4.2rem', ty: '-3.8rem', scale: '0.92', dur: '4.8s', delay: '-1.2s' },
  { size: '4.2rem', left: '38%', top: '26%', color: '#a78bfa', tx: '-3.2rem', ty: '5rem', scale: '1.08', dur: '6.2s', delay: '-2.1s' },
  { size: '1.9rem', left: '52%', top: '76%', color: '#34d399', tx: '3rem', ty: '-4.2rem', scale: '1', dur: '4.4s', delay: '-0.8s' },
  { size: '3.1rem', left: '66%', top: '18%', color: '#fbbf24', tx: '-3.8rem', ty: '3.6rem', scale: '0.95', dur: '5.8s', delay: '-1.8s' },
  { size: '2.7rem', left: '78%', top: '58%', color: '#60a5fa', tx: '-2.8rem', ty: '-4.4rem', scale: '1.05', dur: '5.1s', delay: '-2.9s' },
  { size: '3.8rem', left: '88%', top: '28%', color: '#fb7185', tx: '-4rem', ty: '3.2rem', scale: '0.9', dur: '6.4s', delay: '-0.5s' },
  { size: '2.4rem', left: '14%', top: '42%', color: '#2dd4bf', tx: '4.4rem', ty: '2.6rem', scale: '1.04', dur: '4.9s', delay: '-3.4s' },
  { size: '2.9rem', left: '46%', top: '48%', color: '#c084fc', tx: '2.8rem', ty: '4.8rem', scale: '0.96', dur: '5.7s', delay: '-1.5s' },
  { size: '2.1rem', left: '72%', top: '82%', color: '#f97316', tx: '-3.4rem', ty: '-3.2rem', scale: '1', dur: '4.6s', delay: '-2.4s' },
];

const HSL_PARTICLES = [
  { size: 110, x1: '8%', y1: '14%', x2: '26%', y2: '34%', color: 'hsla(172, 74%, 74%, 0.45)', dur: '28s', delay: '0s' },
  { size: 140, x1: '72%', y1: '12%', x2: '56%', y2: '36%', color: 'hsla(214, 82%, 78%, 0.42)', dur: '34s', delay: '-6s' },
  { size: 95, x1: '36%', y1: '68%', x2: '52%', y2: '44%', color: 'hsla(282, 72%, 82%, 0.40)', dur: '30s', delay: '-11s' },
  { size: 125, x1: '82%', y1: '70%', x2: '64%', y2: '54%', color: 'hsla(152, 68%, 74%, 0.42)', dur: '38s', delay: '-16s' },
  { size: 84, x1: '18%', y1: '76%', x2: '34%', y2: '56%', color: 'hsla(336, 76%, 82%, 0.38)', dur: '32s', delay: '-8s' },
  { size: 105, x1: '48%', y1: '16%', x2: '66%', y2: '28%', color: 'hsla(192, 80%, 76%, 0.44)', dur: '36s', delay: '-20s' },
];

const CyanXoScene: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = 0;
    let height = 0;

    interface Mark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rot: number;
      vrot: number;
      kind: 'x' | 'o';
      alpha: number;
    }

    const count = compact ? 12 : 24;
    const marks: Mark[] = Array.from({ length: count }, (_, idx) => ({
      x: ((idx * 137) % 100) / 100,
      y: ((idx * 251) % 100) / 100,
      vx: ((idx % 5) - 2) * 0.00045 + 0.00025,
      vy: (((idx * 3) % 5) - 2) * 0.0004 - 0.0002,
      size: (compact ? 10 : 18) + (idx % 4) * (compact ? 4 : 8),
      rot: (idx * 0.7) % (Math.PI * 2),
      vrot: ((idx % 2 === 0 ? 1 : -1) * 0.006),
      kind: idx % 2 === 0 ? 'x' : 'o',
      alpha: 0.16 + (idx % 4) * 0.06,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#04bbd3');
      grad.addColorStop(1, '#069cb3');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (const m of marks) {
        if (animate) {
          m.x = (m.x + m.vx + 1) % 1;
          m.y = (m.y + m.vy + 1) % 1;
          m.rot += m.vrot;
        }
        const px = m.x * width;
        const py = m.y * height;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(m.rot);
        ctx.strokeStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.lineWidth = compact ? 2 : 3.2;
        ctx.lineCap = 'round';
        if (m.kind === 'o') {
          ctx.beginPath();
          ctx.arc(0, 0, m.size * 0.45, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const half = m.size * 0.42;
          ctx.beginPath();
          ctx.moveTo(-half, -half);
          ctx.lineTo(half, half);
          ctx.moveTo(half, -half);
          ctx.lineTo(-half, half);
          ctx.stroke();
        }
        ctx.restore();
      }
    };

    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    if (prefersReducedMotion || compact) {
      drawFrame(false);
    } else {
      const tick = () => {
        drawFrame(true);
        animId = window.requestAnimationFrame(tick);
      };
      animId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (animId) window.cancelAnimationFrame(animId);
      ro?.disconnect();
    };
  }, [compact]);

  return (
    <div className="wp-cyan-xo-stage w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" aria-hidden="true" />
    </div>
  );
};

const CosmicBokehScene: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const dots = [
    { left: '16%', top: '24%', size: compact ? 28 : 96, bg: 'rgba(56, 189, 248, 0.34)' },
    { left: '42%', top: '18%', size: compact ? 34 : 120, bg: 'rgba(139, 92, 246, 0.32)' },
    { left: '72%', top: '30%', size: compact ? 26 : 88, bg: 'rgba(14, 165, 233, 0.36)' },
    { left: '28%', top: '64%', size: compact ? 30 : 108, bg: 'rgba(168, 85, 247, 0.28)' },
    { left: '62%', top: '70%', size: compact ? 38 : 136, bg: 'rgba(34, 211, 238, 0.26)' },
    { left: '84%', top: '62%', size: compact ? 22 : 76, bg: 'rgba(99, 102, 241, 0.32)' },
  ];

  return (
    <div
      className="wp-cosmic-bokeh-stage w-full h-full"
      style={{
        background:
          'radial-gradient(circle at 24% 20%, rgba(0, 150, 240, 0.52) 0%, rgba(40, 20, 105, 0.48) 46%, #090d00 100%)',
      }}
    >
      {dots.map((d, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            left: d.left,
            top: d.top,
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: `radial-gradient(circle, ${d.bg} 0%, transparent 72%)`,
            filter: compact ? 'blur(4px)' : 'blur(12px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

const LiquidBlobsScene: React.FC<{ isDark?: boolean; compact?: boolean }> = ({
  isDark,
  compact,
}) => {
  const interactiveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (compact) return;
    const el = interactiveRef.current;
    if (!el) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let rafId = 0;

    const move = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      el.style.transform = `translate3d(${Math.round(curX)}px, ${Math.round(curY)}px, 0)`;
      rafId = window.requestAnimationFrame(move);
    };

    const onPointerMove = (e: PointerEvent) => {
      tgX = e.clientX;
      tgY = e.clientY;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = window.requestAnimationFrame(move);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [compact]);

  return (
    <div
      className={`wp-liquid-blobs-stage${isDark ? ' wp-liquid-blobs-stage--dark' : ''}${
        compact ? ' wp-liquid-blobs-stage--compact' : ''
      }`}
    >
      <div className="wp-liquid-blobs-container">
        <div className="wp-liquid-blob wp-liquid-blob--1" />
        <div className="wp-liquid-blob wp-liquid-blob--2" />
        <div className="wp-liquid-blob wp-liquid-blob--3" />
        <div className="wp-liquid-blob wp-liquid-blob--4" />
        <div className="wp-liquid-blob wp-liquid-blob--5" />
        {!compact && <div ref={interactiveRef} className="wp-liquid-blob-interactive" />}
      </div>
    </div>
  );
};

export const AnimatedSceneWallpaper: React.FC<AnimatedSceneWallpaperProps> = React.memo(
  ({ id, isDark = false, compact = false, className = '' }) => {
    const wrapClass = `w-full h-full ${className}`.trim();

    switch (id) {
      case 'css-prism-wave-flow':
        return (
          <div className={`wp-prism-wave-stage${compact ? ' wp-prism-wave-stage--compact' : ''} ${wrapClass}`}>
            <div className="wp-prism-wave-ribbon wp-prism-wave-ribbon--1" />
            <div className="wp-prism-wave-ribbon wp-prism-wave-ribbon--2" />
            <div className="wp-prism-wave-ribbon wp-prism-wave-ribbon--3" />
          </div>
        );

      case 'css-sky-rising-bubbles':
        return (
          <div className={`wp-sky-bubbles-stage${compact ? ' wp-sky-bubbles-stage--compact' : ''} ${wrapClass}`}>
            <div className="wp-sky-bubbles-track">
              {Array.from({ length: 10 }, (_, idx) => (
                <span key={idx} className={`wp-sky-bubble wp-sky-bubble--${idx + 1}`} />
              ))}
            </div>
          </div>
        );

      case 'css-confetti-floating-balls':
        return (
          <div
            className={`wp-confetti-stage${compact ? ' wp-confetti-stage--compact' : ''} ${wrapClass}`}
            style={{
              background: isDark
                ? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 55%, #0b1120 100%)'
                : 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 55%, #f0f9ff 100%)',
            }}
          >
            {CONFETTI_BALLS.map((ball, idx) => (
              <span
                key={idx}
                className="wp-confetti-ball"
                style={
                  {
                    width: ball.size,
                    height: ball.size,
                    left: ball.left,
                    top: ball.top,
                    background: ball.color,
                    animationDuration: ball.dur,
                    animationDelay: ball.delay,
                    '--ball-tx': ball.tx,
                    '--ball-ty': ball.ty,
                    '--ball-scale': ball.scale,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        );

      case 'css-cyan-xo-motion':
        return (
          <div className={wrapClass}>
            <CyanXoScene compact={compact} />
          </div>
        );

      case 'css-teal-violet-aurora':
        return (
          <div className={`wp-teal-violet-stage ${wrapClass}`}>
            <div className="wp-teal-violet-veil" />
          </div>
        );

      case 'css-pastel-hsl-particles':
        return (
          <div
            className={`wp-hsl-particles-stage ${wrapClass}`}
            style={{
              background: isDark
                ? 'linear-gradient(145deg, #0f172a 0%, #132238 100%)'
                : 'linear-gradient(145deg, #ecf3f3 0%, #e2eef2 100%)',
            }}
          >
            {HSL_PARTICLES.map((p, idx) => {
              const diameter = compact ? Math.round(p.size * 0.36) : p.size;
              return (
                <span
                  key={idx}
                  className="wp-hsl-particle"
                  style={
                    {
                      width: `${diameter}px`,
                      height: `${diameter}px`,
                      background: `radial-gradient(circle, ${p.color} 0%, transparent 72%)`,
                      filter: compact ? 'blur(4px)' : 'blur(12px)',
                      animationDuration: p.dur,
                      animationDelay: p.delay,
                      '--px-start': p.x1,
                      '--py-start': p.y1,
                      '--px-end': p.x2,
                      '--py-end': p.y2,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
        );

      case 'css-mountain-cloud-layers':
        return (
          <div className={`wp-mountain-layers-stage${compact ? ' wp-mountain-layers-stage--compact' : ''} ${wrapClass}`}>
            <div className="wp-cloud-band wp-cloud-band--3" />
            <svg
              className="wp-mountain-svg wp-mountain-svg--3"
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,420 L0,250 L210,130 L420,235 L660,95 L910,220 L1160,115 L1440,210 L1440,420 Z"
                fill="rgba(116, 134, 198, 0.45)"
              />
            </svg>
            <div className="wp-cloud-band wp-cloud-band--2" />
            <svg
              className="wp-mountain-svg wp-mountain-svg--2"
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,420 L0,295 L260,175 L520,275 L780,150 L1060,260 L1280,165 L1440,245 L1440,420 Z"
                fill="rgba(91, 96, 168, 0.56)"
              />
            </svg>
            <div className="wp-cloud-band wp-cloud-band--1" />
            <svg
              className="wp-mountain-svg wp-mountain-svg--1"
              viewBox="0 0 1440 420"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,420 L0,335 L310,225 L590,320 L890,215 L1190,305 L1440,245 L1440,420 Z"
                fill="rgba(64, 61, 126, 0.68)"
              />
            </svg>
            <div className="wp-mountain-pastel-veil" />
          </div>
        );

      case 'css-interactive-liquid-blobs':
        return (
          <div className={wrapClass}>
            <LiquidBlobsScene isDark={isDark} compact={compact} />
          </div>
        );

      case 'css-cosmic-bokeh-beams':
        return (
          <div className={wrapClass}>
            <CosmicBokehScene compact={compact} />
          </div>
        );

      default:
        return <div className={wrapClass} />;
    }
  }
);

AnimatedSceneWallpaper.displayName = 'AnimatedSceneWallpaper';
