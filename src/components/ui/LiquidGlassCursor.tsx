import React, { useEffect, useRef, useState } from 'react';
import {
  ThemeStudioConfig,
  THEME_STUDIO_SYNC_EVENT,
  isIridescentTheme,
  loadStudioConfigForTheme,
  hexToRgba,
} from '@/config/ui/iridescentConfig';
import { useTheme } from '@/hooks/useTheme';

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

export const LiquidGlassCursor: React.FC = () => {
  const { cardStyle } = useTheme();
  const [cursorCfg, setCursorCfg] = useState<ThemeStudioConfig['cursor']>(() =>
    loadStudioConfigForTheme(cardStyle).cursor
  );
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const trailPosRef = useRef<Array<{ x: number; y: number }>>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFinePointer(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    setCursorCfg(loadStudioConfigForTheme(cardStyle).cursor);
    const onSync = (e: Event) => {
      const detail = (e as CustomEvent<{ themeId: string; config: ThemeStudioConfig }>).detail;
      if (detail?.config?.cursor) {
        setCursorCfg(detail.config.cursor);
      }
    };
    window.addEventListener(THEME_STUDIO_SYNC_EVENT, onSync);
    return () => window.removeEventListener(THEME_STUDIO_SYNC_EVENT, onSync);
  }, [cardStyle]);

  const active =
    isFinePointer &&
    isIridescentTheme(cardStyle) &&
    cursorCfg.enabled &&
    cursorCfg.style !== 'default';

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    const trailCount = Math.max(0, Math.min(10, cursorCfg.trailLength));
    trailPosRef.current = Array.from({ length: trailCount }, () => ({ x: -100, y: -100 }));

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      posRef.current.tx = e.clientX;
      posRef.current.ty = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest('button, a, input, select, textarea, [role="button"], [role="tab"], [role="switch"], .cursor-pointer')
      );
      setIsHoveringInteractive(interactive);
    };

    const handleLeave = () => setVisible(false);

    const handleClick = (e: MouseEvent) => {
      if (!cursorCfg.clickRipple) return;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 480);
    };

    const ease = Math.max(0.12, Math.min(0.45, cursorCfg.animationSpeed / 250));

    const loop = () => {
      const p = posRef.current;
      p.x += (p.tx - p.x) * ease;
      p.y += (p.ty - p.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      }

      const trails = trailPosRef.current;
      for (let i = 0; i < trails.length; i++) {
        const prev = i === 0 ? { x: p.x, y: p.y } : trails[i - 1];
        trails[i].x += (prev.x - trails[i].x) * 0.36;
        trails[i].y += (prev.y - trails[i].y) * 0.36;
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${trails[i].x}px, ${trails[i].y}px, 0) translate(-50%, -50%)`;
        }
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mousedown', handleClick);
    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mousedown', handleClick);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [active, cursorCfg.animationSpeed, cursorCfg.clickRipple, cursorCfg.trailLength]);

  if (!active || !visible) return null;

  const baseSize = Math.max(14, Math.min(56, cursorCfg.size));
  const scale = isHoveringInteractive ? Math.max(1, cursorCfg.hoverScale / 100) : 1;
  const sizePx = Math.round(baseSize * scale);
  const opacityVal = Math.max(0.15, Math.min(1, cursorCfg.opacity / 100));
  const glowAlpha = Math.max(0.1, Math.min(0.85, cursorCfg.glowIntensity / 100));

  const getCursorStyleCss = (): React.CSSProperties => {
    const common: React.CSSProperties = {
      width: `${sizePx}px`,
      height: `${sizePx}px`,
      opacity: opacityVal,
      borderRadius: '9999px',
      transition: 'width 160ms ease, height 160ms ease, border-color 160ms ease',
    };

    switch (cursorCfg.style) {
      case 'iridescent':
        return {
          ...common,
          background: cursorCfg.glassReflection
            ? `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.75), ${hexToRgba(cursorCfg.color, 0.22)} 65%, rgba(192,132,252,0.18))`
            : hexToRgba(cursorCfg.color, 0.16),
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          backdropFilter: `blur(${Math.min(14, cursorCfg.blur)}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${Math.min(14, cursorCfg.blur)}px) saturate(180%)`,
          boxShadow: cursorCfg.softGlow
            ? `0 0 ${Math.round(14 + cursorCfg.glowIntensity * 0.28)}px ${hexToRgba(cursorCfg.color, glowAlpha)}, 0 0 12px rgba(244, 114, 182, 0.35), inset 0 1px 0 rgba(255,255,255,0.85)`
            : 'inset 0 1px 0 rgba(255,255,255,0.85)',
        };
      case 'crystal':
        return {
          ...common,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(103,232,249,0.22) 55%, rgba(196,181,253,0.26) 100%)',
          border: '1.5px solid rgba(255,255,255,0.9)',
          backdropFilter: `blur(${Math.min(12, cursorCfg.blur)}px)`,
          boxShadow: `0 0 18px ${hexToRgba(cursorCfg.color, glowAlpha * 0.7)}`,
        };
      case 'glow':
        return {
          ...common,
          background: `radial-gradient(circle, ${hexToRgba(cursorCfg.color, 0.65)} 0%, ${hexToRgba(cursorCfg.color, 0.08)} 72%)`,
          border: `1px solid ${hexToRgba(cursorCfg.color, 0.6)}`,
          boxShadow: `0 0 ${Math.round(22 + cursorCfg.glowIntensity * 0.3)}px ${hexToRgba(cursorCfg.color, glowAlpha)}`,
        };
      case 'magnetic':
        return {
          ...common,
          background: hexToRgba(cursorCfg.color, isHoveringInteractive ? 0.24 : 0.12),
          border: `2px solid ${cursorCfg.color}`,
          boxShadow: `0 0 16px ${hexToRgba(cursorCfg.color, glowAlpha * 0.65)}`,
        };
      case 'spotlight':
        return {
          ...common,
          background: 'transparent',
          border: `1.5px solid ${hexToRgba(cursorCfg.color, 0.75)}`,
          boxShadow: `0 0 24px ${hexToRgba(cursorCfg.color, glowAlpha * 0.8)}`,
        };
      case 'soft-circle':
        return {
          ...common,
          background: hexToRgba(cursorCfg.color, 0.22),
          border: `1px solid ${hexToRgba(cursorCfg.color, 0.45)}`,
        };
      case 'glass':
      default:
        return {
          ...common,
          background: 'rgba(255, 255, 255, 0.26)',
          border: '1.5px solid rgba(255, 255, 255, 0.75)',
          backdropFilter: `blur(${Math.min(12, cursorCfg.blur)}px)`,
          WebkitBackdropFilter: `blur(${Math.min(12, cursorCfg.blur)}px)`,
          boxShadow: cursorCfg.softGlow ? `0 4px 16px ${hexToRgba(cursorCfg.color, glowAlpha * 0.55)}` : undefined,
        };
    }
  };

  const rainbowColors = ['#22D3EE', '#818CF8', '#F472B6', '#FB923C', '#34D399', '#38BDF8', '#C084FC', '#FACC15'];
  const trailCount = Math.max(0, Math.min(10, cursorCfg.trailLength));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 99998 }}
    >
      {(cursorCfg.interactiveSpotlight || cursorCfg.style === 'spotlight') && (
        <div
          ref={spotlightRef}
          className="fixed top-0 left-0 rounded-full pointer-events-none"
          style={{
            width: `${sizePx * 6}px`,
            height: `${sizePx * 6}px`,
            background: `radial-gradient(circle, ${hexToRgba(cursorCfg.color, 0.16)} 0%, transparent 70%)`,
            willChange: 'transform',
          }}
        />
      )}

      {cursorCfg.rainbowTrail &&
        Array.from({ length: trailCount }).map((_, idx) => {
          const dotSize = Math.max(4, Math.round(baseSize * (0.42 - idx * 0.035)));
          const dotColor = rainbowColors[idx % rainbowColors.length];
          return (
            <div
              key={idx}
              ref={(el) => {
                trailRefs.current[idx] = el;
              }}
              className="fixed top-0 left-0 rounded-full pointer-events-none"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                background: dotColor,
                opacity: Math.max(0.08, (opacityVal * (trailCount - idx)) / (trailCount * 2.2)),
                filter: `blur(${Math.min(4, idx * 0.5)}px)`,
                willChange: 'transform',
              }}
            />
          );
        })}

      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="fixed rounded-full pointer-events-none animate-ping"
          style={{
            left: `${rp.x}px`,
            top: `${rp.y}px`,
            width: `${baseSize * 1.3}px`,
            height: `${baseSize * 1.3}px`,
            transform: 'translate(-50%, -50%)',
            border: `2px solid ${cursorCfg.color}`,
            opacity: 0.55,
          }}
        />
      ))}

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          ...getCursorStyleCss(),
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default LiquidGlassCursor;
