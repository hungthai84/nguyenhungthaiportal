import React, { useEffect } from 'react';

interface AppleLiquidGlassEngineProps {
  activeTheme: string;
}

const LIQUID_GLASS_SURFACE_SELECTOR = [
  '#app-header',
  '#app-footer',
  '.page-main-card',
  '[data-main-card="true"]',
  '[data-section-card="true"]',
  '.bento-card',
  '.glass-card',
  '.project-card',
  '.education-card',
  '.education-course-card',
  '.exp-bento-surface-card',
  '.exp-detail-card',
  '.project-detail-section-card',
  '.swot-quadrant-card',
  '.home-hero-card',
  '#home-intro-card',
  '#home-stats-card',
  '#home-capabilities-card',
  '#home-achievements-card',
  '.banner-card',
  '.hero-banner',
  '[data-subcard="true"]',
  '.sub-card',
  'button.nav-pill',
  '#footer-nav-capsule',
  '.banner-control-pill',
  '.video-play-btn',
].join(', ');

/**
 * Apple Liquid Glass Optical Engine (iOS 26 / macOS Tahoe inspired)
 * - Injects lightweight hidden SVG optical lens refraction filter defs
 * - Drives real-time pointer specular light reflection (--lg-mx / --lg-my)
 *   exclusively when 'liquid-glass' or 'dark-liquid-glass' is active.
 */
export const AppleLiquidGlassEngine: React.FC<AppleLiquidGlassEngineProps> = ({ activeTheme }) => {
  const isAppleLiquidGlass =
    activeTheme === 'liquid-glass' || activeTheme === 'dark-liquid-glass';

  useEffect(() => {
    if (!isAppleLiquidGlass || typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    let lastTarget: HTMLElement | null = null;
    let pendingEvent: PointerEvent | null = null;

    const applySpecular = () => {
      rafId = 0;
      const ev = pendingEvent;
      pendingEvent = null;
      if (!ev) return;

      const el = ev.target instanceof Element
        ? (ev.target.closest(LIQUID_GLASS_SURFACE_SELECTOR) as HTMLElement | null)
        : null;

      if (lastTarget && lastTarget !== el) {
        lastTarget.style.removeProperty('--lg-mx');
        lastTarget.style.removeProperty('--lg-my');
        lastTarget.style.removeProperty('--lg-specular-opacity');
      }

      if (!el) {
        lastTarget = null;
        return;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const xPct = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100));
        const yPct = Math.max(0, Math.min(100, ((ev.clientY - rect.top) / rect.height) * 100));
        el.style.setProperty('--lg-mx', `${xPct.toFixed(1)}%`);
        el.style.setProperty('--lg-my', `${yPct.toFixed(1)}%`);
        el.style.setProperty('--lg-specular-opacity', '1');
        lastTarget = el;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pendingEvent = e;
      if (!rafId) {
        rafId = window.requestAnimationFrame(applySpecular);
      }
    };

    const handlePointerLeave = () => {
      if (lastTarget) {
        lastTarget.style.removeProperty('--lg-mx');
        lastTarget.style.removeProperty('--lg-my');
        lastTarget.style.removeProperty('--lg-specular-opacity');
        lastTarget = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      handlePointerLeave();
    };
  }, [isAppleLiquidGlass]);

  if (!isAppleLiquidGlass) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{
        position: 'fixed',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter
          id="apple-liquid-glass-lens"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves={2}
            seed={8}
            result="liquidNoise"
          />
          <feGaussianBlur in="liquidNoise" stdDeviation="3.5" result="smoothLens" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothLens"
            scale={6}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
