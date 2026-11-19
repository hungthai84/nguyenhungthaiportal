/* Lucian UX/UI Prompt #363 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#363 */
import React, { useEffect, useRef } from 'react';

export interface DotGridWavesCanvasProps {
  isDark: boolean;
}

export const DotGridWavesCanvas: React.FC<DotGridWavesCanvasProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const cx = canvas.getContext('2d');
    if (!cx) return;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = container.offsetWidth || window.innerWidth;
    let H = container.offsetHeight || window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const GAP = 22;

    const resize = () => {
      if (!container || !canvas) return;
      W = container.offsetWidth || window.innerWidth;
      H = container.offsetHeight || window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      cx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const dots: [number, number][] = [];
    for (let y = GAP; y < H + GAP; y += GAP) {
      for (let x = GAP; x < W + GAP; x += GAP) {
        dots.push([x, y]);
      }
    }

    let waves: Array<{ x: number; y: number; t: number; a: number }> = [];
    let lastAdd = 0;

    const addWave = (x: number, y: number, a: number) => {
      waves.push({ x, y, t: performance.now(), a });
      if (waves.length > 25) waves.shift();
    };

    let animationFrameId = 0;
    let vis = true;

    const draw = (now: number) => {
      cx.clearRect(0, 0, W, H);
      waves = waves.filter((w) => now - w.t < 2600);

      const idleColor = isDark ? 'rgba(244,240,232,0.42)' : '#8E8A97';

      dots.forEach((d) => {
        let h = 0;
        waves.forEach((w) => {
          const age = (now - w.t) / 1000;
          const dist = Math.hypot(d[0] - w.x, d[1] - w.y);
          const front = age * 180;
          const k = dist - front;
          if (k > 0 || k < -90) return;
          h += Math.sin(k / 14) * Math.exp(k / 60) * w.a * Math.exp(-age * 1.3);
        });

        const m = Math.max(-1, Math.min(1.6, h));
        const r = 1.6 + Math.max(0, m) * 3.4;
        const hue = 230 - Math.max(0, m) * 110;
        const calm = Math.abs(m) < 0.04;

        cx.globalAlpha = calm ? (isDark ? 0.35 : 0.55) : 1;
        cx.fillStyle = calm
          ? idleColor
          : `hsl(${hue.toFixed(0)} 85% ${(isDark ? 52 : 58) - Math.min(0, m) * 10}%)`;
        cx.beginPath();
        cx.arc(d[0], d[1] - m * 3, r, 0, Math.PI * 2);
        cx.fill();
      });
      cx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      animationFrameId = 0;
      if (!container.isConnected || !vis) return;
      draw(now);
      animationFrameId = requestAnimationFrame(frame);
    };

    const run = () => {
      if (rm) {
        draw(performance.now());
        return;
      }
      if (!animationFrameId && vis) {
        animationFrameId = requestAnimationFrame(frame);
      }
    };

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((es) => {
        vis = es[0].isIntersecting;
        run();
      });
      observer.observe(container);
    }

    const getLocation = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const k = canvas.offsetWidth / (rect.width || 1);
      return [(e.clientX - rect.left) * k, (e.clientY - rect.top) * k];
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastAdd < 110) return;
      lastAdd = now;
      const [qx, qy] = getLocation(e);
      addWave(qx, qy, 0.55);
      if (rm) draw(now + 300);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const [qx, qy] = getLocation(e);
      addWave(qx, qy, 1.6);
      if (rm) draw(performance.now() + 500);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    run();

    return () => {
      window.removeEventListener('resize', resize);
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="ux u363 absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{ background: 'transparent' }}
    >
      <canvas
        ref={canvasRef}
        className="u363-cv absolute inset-0 w-full h-full touch-none cursor-crosshair"
        role="img"
        aria-label="Dot grid, press to send a wave"
      />
    </div>
  );
};
