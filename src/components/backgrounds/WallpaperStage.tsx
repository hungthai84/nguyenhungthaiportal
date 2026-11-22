import React, { useEffect, useRef, useState } from 'react';
import {
  WallpaperPreset,
  getCleanImageUrl,
  parseCssStringToStyle,
} from '@/data/wallpapers';
import {
  GravityBackgroundCanvas,
  resolveGravityStage,
} from '@/components/backgrounds/GravityBackgroundCanvas';
import { DotGridWavesCanvas } from '@/components/ui/DotGridWavesCanvas';

const CROSSFADE_DURATION_MS = 400;
const PARALLAX_MAX_X = 14;
const PARALLAX_MAX_Y = 9;
const PARALLAX_OVERSCAN_SCALE = 1.04;
const PARALLAX_DAMPING = 0.085;

export interface WallpaperStageProps {
  wallpaper: WallpaperPreset;
  parallaxEnabled: boolean;
  isDark: boolean;
  currentTabIndex: number;
  pageSlides: Record<number, number>;
}

interface StageLayer {
  key: string;
  wallpaper: WallpaperPreset;
  visible: boolean;
}

function isEmptyWallpaper(wp?: WallpaperPreset | null): boolean {
  if (!wp || wp.id === 'none') return true;
  const hasValue = Boolean(wp.value || wp.bg);
  const hasPreview = Boolean(wp.previewStyle && Object.keys(wp.previewStyle).length > 0);
  return !hasValue && !hasPreview;
}

function getWallpaperLayerKey(wp: WallpaperPreset): string {
  if (isEmptyWallpaper(wp)) return 'none';
  if (wp.type === 'webgl') return `webgl::${wp.id}`;
  return `${wp.type}::${wp.id}::${wp.value || wp.bg || ''}`;
}

export const WallpaperStage: React.FC<WallpaperStageProps> = ({
  wallpaper,
  parallaxEnabled,
  isDark,
  currentTabIndex,
  pageSlides,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const incomingKey = getWallpaperLayerKey(wallpaper);
  const [layers, setLayers] = useState<StageLayer[]>(() => [
    { key: incomingKey, wallpaper, visible: true },
  ]);

  const cleanupTimerRef = useRef<number | null>(null);
  const fallbackShowTimerRef = useRef<number | null>(null);

  const revealLayer = (targetKey: string) => {
    setLayers((prev) => {
      const hasTarget = prev.some((l) => l.key === targetKey);
      if (!hasTarget) return prev;
      return prev.map((l) => (l.key === targetKey ? { ...l, visible: true } : l));
    });

    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
    }
    const delay = prefersReducedMotion ? 20 : CROSSFADE_DURATION_MS + 40;
    cleanupTimerRef.current = window.setTimeout(() => {
      setLayers((prev) => {
        if (prev.length <= 1) return prev;
        const latest = prev[prev.length - 1];
        if (latest.key === targetKey && latest.visible) {
          return [latest];
        }
        return prev;
      });
      cleanupTimerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    if (fallbackShowTimerRef.current !== null) {
      window.clearTimeout(fallbackShowTimerRef.current);
      fallbackShowTimerRef.current = null;
    }

    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top && top.key === incomingKey) {
        return prev.map((l, idx) =>
          idx === prev.length - 1 ? { ...l, wallpaper } : l
        );
      }
      // Keep the most recent visible layer beneath so crossfade never flashes empty
      const baseLayer = [...prev].reverse().find((l) => l.visible) || top;
      const nextLayer: StageLayer = {
        key: incomingKey,
        wallpaper,
        visible: prefersReducedMotion,
      };
      return baseLayer ? [baseLayer, nextLayer] : [nextLayer];
    });

    if (prefersReducedMotion) {
      revealLayer(incomingKey);
      return;
    }

    const isImageLayer = !isEmptyWallpaper(wallpaper) && wallpaper.type === 'image';
    if (!isImageLayer) {
      let raf2: number | null = null;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          revealLayer(incomingKey);
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        if (raf2 !== null) window.cancelAnimationFrame(raf2);
      };
    }

    // For image layers, onLoad calls revealLayer; keep a safety fallback in case of cache/error
    fallbackShowTimerRef.current = window.setTimeout(() => {
      revealLayer(incomingKey);
      fallbackShowTimerRef.current = null;
    }, 900);

    return () => {
      if (fallbackShowTimerRef.current !== null) {
        window.clearTimeout(fallbackShowTimerRef.current);
        fallbackShowTimerRef.current = null;
      }
    };
  }, [incomingKey, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current !== null) window.clearTimeout(cleanupTimerRef.current);
      if (fallbackShowTimerRef.current !== null) window.clearTimeout(fallbackShowTimerRef.current);
    };
  }, []);

  // Mouse Parallax Depth (hardware-accelerated translate3d, 0px blur, respects reduced motion)
  const parallaxWrapRef = useRef<HTMLDivElement | null>(null);
  const canUseParallax =
    parallaxEnabled &&
    !prefersReducedMotion &&
    !isEmptyWallpaper(wallpaper) &&
    wallpaper.type !== 'webgl';

  useEffect(() => {
    const el = parallaxWrapRef.current;
    if (!el) return;

    if (!canUseParallax) {
      el.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let isRunning = false;

    const tick = () => {
      currentX += (targetX - currentX) * PARALLAX_DAMPING;
      currentY += (targetY - currentY) * PARALLAX_DAMPING;

      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0px) scale(${PARALLAX_OVERSCAN_SCALE})`;

      if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentX = targetX;
        currentY = targetY;
        el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0px) scale(${PARALLAX_OVERSCAN_SCALE})`;
        isRunning = false;
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Apply subtle overscan immediately so edges never clip when pointer starts moving
    el.style.transform = `translate3d(0px, 0px, 0px) scale(${PARALLAX_OVERSCAN_SCALE})`;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (e.clientX / w - 0.5) * 2; // -1..1
      const ny = (e.clientY / h - 0.5) * 2; // -1..1
      targetX = Math.max(-PARALLAX_MAX_X, Math.min(PARALLAX_MAX_X, -nx * PARALLAX_MAX_X));
      targetY = Math.max(-PARALLAX_MAX_Y, Math.min(PARALLAX_MAX_Y, -ny * PARALLAX_MAX_Y));
      startLoop();
    };

    const handleReset = () => {
      targetX = 0;
      targetY = 0;
      startLoop();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleReset);
    window.addEventListener('blur', handleReset);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleReset);
      window.removeEventListener('blur', handleReset);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [canUseParallax]);

  const transitionCss = prefersReducedMotion
    ? 'none'
    : `opacity ${CROSSFADE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  return (
    <div
      ref={parallaxWrapRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        filter: 'none',
        WebkitFilter: 'none',
        willChange: canUseParallax ? 'transform' : 'auto',
        transition: canUseParallax ? 'none' : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {layers.map((layer, idx) => {
        const wp = layer.wallpaper;
        const empty = isEmptyWallpaper(wp);
        const isBaseLayer = idx === 0;
        const opacityValue = isBaseLayer ? 1 : layer.visible ? 1 : 0;

        return (
          <div
            key={layer.key}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              opacity: opacityValue,
              transition: isBaseLayer ? 'none' : transitionCss,
              zIndex: idx + 1,
              filter: 'none',
              WebkitFilter: 'none',
            }}
          >
            {empty ? (
              <div className="w-full h-full" style={{ background: 'transparent' }} />
            ) : wp.type === 'video' ? (
              (wp.value || wp.bg || '').includes('youtube.com') ||
              (wp.value || wp.bg || '').includes('youtu.be') ? (
                <div
                  className="w-full h-full relative overflow-hidden flex items-center justify-center bg-cover bg-center"
                  style={wp.previewStyle || {}}
                >
                  <iframe
                    src={wp.value || wp.bg}
                    title={wp.name}
                    className="w-[120vw] h-[120vh] min-w-[120vw] min-h-[120vh] border-0 pointer-events-none scale-125"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={wp.value || wp.bg}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )
            ) : wp.type === 'webgl' ? (
              wp.id === 'webgl-dot-grid-waves' ? (
                <div className="relative w-full h-full overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      background: isDark ? '#07080D' : '#F4F2EE',
                      transition: 'background 0.4s ease',
                    }}
                  />
                  <DotGridWavesCanvas isDark={isDark} />
                </div>
              ) : (
                (() => {
                  const gConfig = wp.gravityConfig;
                  const paletteId = gConfig?.paletteId || 'autoMorph';
                  const morphOnPageChange = gConfig?.morphOnPageChange ?? true;
                  const activeSlide = pageSlides[currentTabIndex] ?? 0;
                  const resolvedStage = resolveGravityStage(
                    paletteId,
                    currentTabIndex,
                    activeSlide,
                    morphOnPageChange
                  );
                  return (
                    <div className="relative w-full h-full overflow-hidden">
                      <div
                        id="gravity-gradient-backdrop"
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{
                          background: resolvedStage.bgGradient,
                          transition: 'background 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
                        }}
                      />
                      <GravityBackgroundCanvas
                        paletteId={paletteId}
                        pageIndex={currentTabIndex}
                        slideIndex={activeSlide}
                        morphOnPageChange={morphOnPageChange}
                        isDark={isDark}
                      />
                    </div>
                  );
                })()
              )
            ) : wp.type === 'css' || wp.type === 'gradient' ? (
              <div
                className="w-full h-full"
                style={
                  wp.previewStyle && Object.keys(wp.previewStyle).length > 0
                    ? wp.previewStyle
                    : parseCssStringToStyle(wp.value || wp.bg || '')
                }
              />
            ) : (
              (() => {
                const imgUrl = getCleanImageUrl(wp.value || wp.bg || '');
                return (
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      background: wp.previewStyle?.background
                        ? String(wp.previewStyle.background)
                        : 'transparent',
                    }}
                  >
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        onLoad={() => {
                          if (!layer.visible) {
                            revealLayer(layer.key);
                          }
                        }}
                        onError={() => {
                          if (!layer.visible) {
                            revealLayer(layer.key);
                          }
                        }}
                        ref={(imgNode) => {
                          if (imgNode && imgNode.complete && imgNode.naturalWidth > 0 && !layer.visible) {
                            window.requestAnimationFrame(() => revealLayer(layer.key));
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                );
              })()
            )}
          </div>
        );
      })}
    </div>
  );
};
