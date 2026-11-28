'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn } from '@/lib/utils';
import { resolveCompanyLogo } from '@/utils/companyBrandAssets';

const Briefcase = createAnimatedIcon('briefcase');

export interface RoadmapCardItem {
  key: string;
  yearBadge: string;
  period?: string;
  tenure?: string;
  companyLine1: string;
  companyLine2: string;
  shortName: string;
  roleSummary: string;
  roleTitle?: string;
  headcountLabel: string;
  description: string;
  logo: string;
  bannerUrl?: string;
  logos?: Array<{ src: string; fallback?: string; alt: string }>;
  productSummary: string;
  accentColor: string;
  darkAccentColor?: string;
  blockGradient: string;
  colBgGradient?: string;
  colBgGradientDark?: string;
  colBgGradientLeather?: string;
}

export interface ExperienceSliderViewProps {
  roadmapCards: RoadmapCardItem[];
  activeKey: string;
  onSelectMilestone: (key: string, idx: number) => void;
  isDarkSurface?: boolean;
  isWalnutWood?: boolean;
  isDarkLeather?: boolean;
  isBrownLeather?: boolean;
}

interface ExtendedRoadmapSlide {
  item: RoadmapCardItem;
  origIdx: number;
  slotKey: string;
  isClone: boolean;
}

export const ExperienceSliderView: React.FC<ExperienceSliderViewProps> = ({
  roadmapCards,
  activeKey,
  onSelectMilestone,
  isDarkSurface,
  isWalnutWood,
  isDarkLeather,
  isBrownLeather,
}) => {
  const initialIdx = useMemo(() => {
    const idx = roadmapCards.findIndex((c) => c.key === activeKey);
    return idx >= 0 ? idx : 0;
  }, [roadmapCards, activeKey]);

  const totalCards = roadmapCards.length;
  // Sắp xếp cố định từ trái qua phải theo thời gian từ năm thấp (2002) đến năm cao (2026+)
  const useLoopClones = false;
  const clonePad = 0;

  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(initialIdx);
  const [visualTrackIdx, setVisualTrackIdx] = useState<number>(initialIdx);
  const [hoveredSlotIdx, setHoveredSlotIdx] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [slideWidth, setSlideWidth] = useState<number>(0);
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isDraggingTrack, setIsDraggingTrack] = useState<boolean>(false);
  const [disableTrackTransition, setDisableTrackTransition] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrpRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const timelineNodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slotSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaXRef = useRef<number>(0);
  const didDragRef = useRef<boolean>(false);
  const wheelCooldownRef = useRef<number>(0);
  const wheelAccumRef = useRef<number>(0);
  const snapTimerRef = useRef<number | null>(null);

  // Tự động căn giữa mốc công ty đang chọn trên thanh timeline ngang phía trên
  useEffect(() => {
    const scrollEl = timelineScrollRef.current;
    const nodeEl = timelineNodeRefs.current[activeCarouselIdx];
    if (!scrollEl || !nodeEl) return;
    const targetLeft = nodeEl.offsetLeft - scrollEl.clientWidth / 2 + nodeEl.offsetWidth / 2;
    scrollEl.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [activeCarouselIdx, totalCards]);

  const extendedSlides = useMemo<ExtendedRoadmapSlide[]>(() => {
    return roadmapCards.map((item, idx) => ({
      item,
      origIdx: idx,
      slotKey: `orig-${item.key}-${idx}`,
      isClone: false,
    }));
  }, [roadmapCards]);

  const measureSliderGeometry = useCallback(() => {
    const containerEl = containerRef.current;
    const firstSlideEl = slotSlideRefs.current[0];
    if (containerEl) {
      const cw = containerEl.clientWidth;
      if (cw > 0) setContainerWidth(cw);
    }
    if (firstSlideEl) {
      const sw = firstSlideEl.offsetWidth;
      if (sw > 0) setSlideWidth(sw);
    }
  }, []);

  useEffect(() => {
    measureSliderGeometry();
    const containerEl = containerRef.current;
    const firstSlideEl = slotSlideRefs.current[0];
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measureSliderGeometry());
      if (containerEl) ro.observe(containerEl);
      if (firstSlideEl) ro.observe(firstSlideEl);
    }
    window.addEventListener('resize', measureSliderGeometry);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measureSliderGeometry);
    };
  }, [measureSliderGeometry, extendedSlides.length]);

  const baseTrackX = useMemo(() => {
    if (containerWidth <= 0 || slideWidth <= 0) return 0;
    const totalTrackW = extendedSlides.length * slideWidth;
    if (totalTrackW <= containerWidth) return 0;
    const rawCenter = containerWidth / 2 - (visualTrackIdx * slideWidth + slideWidth / 2);
    const minTrackX = Math.min(0, containerWidth - totalTrackW);
    return Math.max(minTrackX, Math.min(0, rawCenter));
  }, [containerWidth, slideWidth, visualTrackIdx, extendedSlides.length]);

  const currentTrackX = baseTrackX + dragDeltaX;

  const activeHighlightSlotIdx =
    hoveredSlotIdx !== null ? hoveredSlotIdx : visualTrackIdx;

  const syncItemBg = useCallback(() => {
    const bgEl = bgRef.current;
    const wrpEl = wrpRef.current;
    const slideEl = slotSlideRefs.current[activeHighlightSlotIdx];
    const itemEl = slotItemRefs.current[activeHighlightSlotIdx];
    if (!bgEl || !wrpEl || !slideEl || !itemEl) return;

    const x = wrpEl.offsetLeft + currentTrackX + slideEl.offsetLeft + itemEl.offsetLeft;
    const y = wrpEl.offsetTop + slideEl.offsetTop + itemEl.offsetTop;
    const w = itemEl.offsetWidth;
    const h = itemEl.offsetHeight;

    if (w > 0 && h > 0) {
      bgEl.style.width = `${w}px`;
      bgEl.style.height = `${h}px`;
      bgEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      bgEl.classList.add('active');
    }
  }, [activeHighlightSlotIdx, currentTrackX]);

  useEffect(() => {
    syncItemBg();
  }, [syncItemBg, extendedSlides.length, containerWidth, slideWidth]);

  useEffect(() => {
    const activeItemEl = slotItemRefs.current[activeHighlightSlotIdx];
    const containerEl = containerRef.current;
    const wrpEl = wrpRef.current;
    if ((!activeItemEl && !containerEl && !wrpEl) || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(() => syncItemBg());
    });
    if (activeItemEl) ro.observe(activeItemEl);
    if (containerEl) ro.observe(containerEl);
    if (wrpEl) ro.observe(wrpEl);
    return () => ro.disconnect();
  }, [activeHighlightSlotIdx, syncItemBg]);

  const scheduleLoopSnapIfNeeded = useCallback(
    (targetTrackIdx: number) => {
      if (!useLoopClones) return;
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }
      if (targetTrackIdx < clonePad || targetTrackIdx >= clonePad + totalCards) {
        const canonicalTrackIdx =
          targetTrackIdx < clonePad
            ? targetTrackIdx + totalCards
            : targetTrackIdx - totalCards;
        snapTimerRef.current = window.setTimeout(() => {
          setDisableTrackTransition(true);
          setVisualTrackIdx(canonicalTrackIdx);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              setDisableTrackTransition(false);
            });
          });
        }, 430);
      }
    },
    [useLoopClones, clonePad, totalCards]
  );

  useEffect(() => {
    return () => {
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

  const handlePrevCarousel = useCallback(() => {
    if (totalCards <= 1) return;
    SoundEngine.playTap?.();
    setHoveredSlotIdx(null);
    const currentOrig = Math.min(activeCarouselIdx, totalCards - 1);
    const nextOrig = currentOrig > 0 ? currentOrig - 1 : 0;
    setActiveCarouselIdx(nextOrig);

    if (!useLoopClones) {
      setVisualTrackIdx(nextOrig);
      return;
    }

    const baseTrack =
      visualTrackIdx < clonePad
        ? visualTrackIdx + totalCards
        : visualTrackIdx >= clonePad + totalCards
          ? visualTrackIdx - totalCards
          : visualTrackIdx;
    const nextTrack = Math.max(0, baseTrack - 1);
    if (baseTrack !== visualTrackIdx) {
      setDisableTrackTransition(true);
      setVisualTrackIdx(baseTrack);
      window.requestAnimationFrame(() => {
        setDisableTrackTransition(false);
        setVisualTrackIdx(nextTrack);
        scheduleLoopSnapIfNeeded(nextTrack);
      });
    } else {
      setVisualTrackIdx(nextTrack);
      scheduleLoopSnapIfNeeded(nextTrack);
    }
  }, [activeCarouselIdx, clonePad, scheduleLoopSnapIfNeeded, totalCards, useLoopClones, visualTrackIdx]);

  const handleNextCarousel = useCallback(() => {
    if (totalCards <= 1) return;
    SoundEngine.playTap?.();
    setHoveredSlotIdx(null);
    const currentOrig = Math.min(activeCarouselIdx, totalCards - 1);
    const nextOrig = currentOrig < totalCards - 1 ? currentOrig + 1 : totalCards - 1;
    setActiveCarouselIdx(nextOrig);

    if (!useLoopClones) {
      setVisualTrackIdx(nextOrig);
      return;
    }

    const baseTrack =
      visualTrackIdx < clonePad
        ? visualTrackIdx + totalCards
        : visualTrackIdx >= clonePad + totalCards
          ? visualTrackIdx - totalCards
          : visualTrackIdx;
    const nextTrack = Math.min(extendedSlides.length - 1, baseTrack + 1);
    if (baseTrack !== visualTrackIdx) {
      setDisableTrackTransition(true);
      setVisualTrackIdx(baseTrack);
      window.requestAnimationFrame(() => {
        setDisableTrackTransition(false);
        setVisualTrackIdx(nextTrack);
        scheduleLoopSnapIfNeeded(nextTrack);
      });
    } else {
      setVisualTrackIdx(nextTrack);
      scheduleLoopSnapIfNeeded(nextTrack);
    }
  }, [activeCarouselIdx, clonePad, extendedSlides.length, scheduleLoopSnapIfNeeded, totalCards, useLoopClones, visualTrackIdx]);

  const handleSelectBullet = useCallback(
    (origIdx: number) => {
      SoundEngine.playTap?.();
      setHoveredSlotIdx(null);
      setActiveCarouselIdx(origIdx);
      setVisualTrackIdx(useLoopClones ? origIdx + clonePad : origIdx);
    },
    [clonePad, useLoopClones]
  );

  // Keyboard navigation
  useEffect(() => {
    const onArrowKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCarousel();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCarousel();
      }
    };
    window.addEventListener('keydown', onArrowKey);
    return () => window.removeEventListener('keydown', onArrowKey);
  }, [handlePrevCarousel, handleNextCarousel]);

  // Pointer drag events
  const finishSliderDrag = useCallback(() => {
    if (dragStartXRef.current === null) return;
    const dx = dragDeltaXRef.current;
    dragStartXRef.current = null;
    dragDeltaXRef.current = 0;
    setIsDraggingTrack(false);
    setDragDeltaX(0);
    if (dx <= -24) {
      handleNextCarousel();
    } else if (dx >= 24) {
      handlePrevCarousel();
    }
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 60);
  }, [handleNextCarousel, handlePrevCarousel]);

  useEffect(() => {
    if (!isDraggingTrack) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (dragStartXRef.current === null) return;
      const dx = e.clientX - dragStartXRef.current;
      if (Math.abs(dx) > 6) {
        didDragRef.current = true;
      }
      dragDeltaXRef.current = dx;
      setDragDeltaX(dx);
    };

    const handleWindowPointerEnd = () => {
      finishSliderDrag();
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerEnd);
    window.addEventListener('pointercancel', handleWindowPointerEnd);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerEnd);
      window.removeEventListener('pointercancel', handleWindowPointerEnd);
    };
  }, [isDraggingTrack, finishSliderDrag]);

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || totalCards <= 1) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('.news-slider-arrow, .news-slider-bullet')) return;
    dragStartXRef.current = e.clientX;
    dragDeltaXRef.current = 0;
    didDragRef.current = false;
    setIsDraggingTrack(true);
    setDragDeltaX(0);
  };

  // Wheel browsing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || totalCards <= 1) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX < 0.5 && absY < 0.5) return;

      const delta = absX >= absY ? e.deltaX : e.deltaY;
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - wheelCooldownRef.current < 240) return;

      wheelAccumRef.current += delta;
      if (Math.abs(wheelAccumRef.current) >= 20) {
        wheelCooldownRef.current = now;
        const dir = wheelAccumRef.current;
        wheelAccumRef.current = 0;
        if (dir > 0) {
          handleNextCarousel();
        } else {
          handlePrevCarousel();
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [totalCards, handleNextCarousel, handlePrevCarousel]);

  return (
    <div className="exp-slider-view-root w-full h-full min-h-0 flex-1 flex flex-col justify-between overflow-hidden relative">
      {/* Top Header with Title and Horizontal Company Logo + Year Timeline */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-5 px-[18px] sm:px-[24px] pt-[8px] pb-[6px] z-20 shrink-0">
        <header className="shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap min-w-0">
            <Briefcase
              className="w-5 h-5 sm:w-[22px] sm:h-[22px] shrink-0"
              strokeWidth={2.75}
              style={{
                color: isWalnutWood
                  ? '#F5C478'
                  : isDarkLeather
                    ? '#E5B87E'
                    : isBrownLeather
                      ? '#FDE68A'
                      : 'var(--color-primary, #0284C7)',
              }}
            />
            <h1
              className="typo-h3 sm:typo-h2 md:typo-h1 font-bold tracking-[0.04em] leading-none m-0 whitespace-nowrap"
              style={{
                color: isWalnutWood
                  ? '#F5C478'
                  : isDarkLeather
                    ? '#E5B87E'
                    : isBrownLeather
                      ? '#FDE68A'
                      : 'var(--color-primary, #0284C7)',
              }}
            >
              Thời gian công tác
            </h1>
          </div>
          <div className="flex items-center gap-[6px] mt-1.5">
            <span className="w-[8px] h-[8px] rounded-full bg-[#F8C605]" />
            <span className="w-[8px] h-[8px] rounded-full bg-[#EE2A7B]" />
            <span className="w-[8px] h-[8px] rounded-full bg-[#00AEEF]" />
            <span className="w-[8px] h-[8px] rounded-full bg-[#39B54A]" />
            <span
              className={cn(
                'w-[8px] h-[8px] rounded-full',
                isDarkSurface ? 'bg-slate-200' : 'bg-[#334155]'
              )}
            />
            <span className="w-[44px] h-[2px] bg-[#EE2A7B] ml-1" />
          </div>
        </header>

        {/* Horizontal Career Timeline containing < / > Controls, Gradient Track, Conic Active Halo & Blue Year Pill */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrevCarousel}
            disabled={totalCards <= 1 || activeCarouselIdx <= 0}
            aria-label="Mốc công tác trước"
            className={cn(
              'no-theme-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed',
              isDarkSurface
                ? 'bg-slate-900/75 border-white/20 text-white hover:bg-slate-800'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-white shadow-xs'
            )}
          >
            <WebIcon name="chevron-left" className="w-4 h-4" />
          </button>

          <div
            ref={timelineScrollRef}
            role="navigation"
            aria-label="Timeline logo và năm công tác các công ty"
            className="exp-header-timeline-scroll flex-1 min-w-0 overflow-x-auto no-scrollbar py-1"
          >
            <div className="relative inline-flex md:flex items-center justify-between gap-2 sm:gap-3 min-w-full px-2">
              {/* Horizontal gradient timeline track behind logos */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-7 right-7 top-[27px] sm:top-[29px] h-[3px] rounded-full"
                style={{
                  background: isWalnutWood
                    ? 'linear-gradient(90deg, rgba(245, 196, 120, 0.35), rgba(245, 196, 120, 0.85), rgba(238, 42, 123, 0.65))'
                    : isDarkLeather || isBrownLeather
                      ? 'linear-gradient(90deg, rgba(229, 184, 126, 0.35), rgba(229, 184, 126, 0.85), rgba(238, 42, 123, 0.65))'
                      : 'linear-gradient(90deg, rgba(14, 165, 233, 0.45) 0%, rgba(124, 58, 237, 0.68) 45%, rgba(238, 42, 123, 0.72) 78%, rgba(16, 185, 129, 0.55) 100%)',
                }}
              />

              {roadmapCards.map((item, idx) => {
                const isActive = idx === activeCarouselIdx;
                const shortYear = item.yearBadge.replace(/^Năm\s+/i, '').trim() || item.yearBadge;

                return (
                  <button
                    key={`header-timeline-${item.key}`}
                    ref={(el) => {
                      timelineNodeRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => handleSelectBullet(idx)}
                    aria-current={isActive ? 'step' : undefined}
                    title={`${item.yearBadge} · ${item.shortName}`}
                    data-transparent-btn="true"
                    className={cn(
                      'no-theme-btn exp-timeline-node-btn group relative z-10 flex flex-col items-center gap-1.5 shrink-0 cursor-pointer bg-transparent border-0 p-0 shadow-none transition-transform duration-200 focus-visible:outline-none',
                      isActive ? 'scale-105' : 'opacity-85 hover:opacity-100 hover:scale-105'
                    )}
                    style={{
                      background: 'transparent',
                      backgroundColor: 'transparent',
                      backgroundImage: 'none',
                      border: 'none',
                      boxShadow: 'none',
                      backdropFilter: 'none',
                      WebkitBackdropFilter: 'none',
                    }}
                  >
                    <span className="relative flex items-center justify-center w-[54px] h-[54px] sm:w-[58px] sm:h-[58px]">
                      {isActive && (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute -inset-1.5 rounded-full opacity-75 blur-[6px] pointer-events-none"
                            style={{
                              background: 'conic-gradient(from 45deg, #EC4899, #8B5CF6, #38BDF8, #EC4899)',
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="absolute -inset-[2px] rounded-full pointer-events-none"
                            style={{
                              background: 'conic-gradient(from 45deg, #EC4899, #8B5CF6, #38BDF8, #EC4899)',
                            }}
                          />
                        </>
                      )}
                      <span
                        className={cn(
                          'relative z-10 w-full h-full rounded-full p-1 flex items-center justify-center overflow-hidden transition-transform duration-200',
                          isActive
                            ? 'bg-white shadow-md'
                            : isDarkSurface
                              ? 'bg-slate-900/90 border border-white/25'
                              : 'bg-white/95 border border-slate-200/90 shadow-xs'
                        )}
                      >
                        <img
                          src={item.logo}
                          alt={item.shortName}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          draggable={false}
                          onError={(e) => {
                            const fallback = resolveCompanyLogo(item.shortName);
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                          className="w-full h-full object-contain rounded-full select-none pointer-events-none"
                        />
                      </span>
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] leading-none tabular-nums whitespace-nowrap transition-all duration-200',
                        isActive
                          ? 'px-2 py-0.5 rounded-full bg-[#2563EB] text-white font-bold shadow-xs'
                          : 'px-1.5 py-0.5 rounded-full font-semibold'
                      )}
                      style={
                        isActive
                          ? undefined
                          : {
                              color:
                                isWalnutWood || isDarkLeather || isBrownLeather
                                  ? 'rgba(255, 245, 232, 0.84)'
                                  : 'var(--text-secondary)',
                            }
                      }
                    >
                      <WebIcon name="calendar" className="w-2.5 h-2.5 shrink-0" />
                      <span>{shortYear}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextCarousel}
            disabled={totalCards <= 1 || activeCarouselIdx >= totalCards - 1}
            aria-label="Mốc công tác tiếp theo"
            className={cn(
              'no-theme-btn w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed',
              isDarkSurface
                ? 'bg-slate-900/75 border-white/20 text-white hover:bg-slate-800'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-white shadow-xs'
            )}
          >
            <WebIcon name="chevron-right" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* News-Slider CodePen Architecture + Theme Integration */}
      <div
        data-section-card="true"
        data-element-type="card"
        className="news-slider-wrapper-container projects-themed-slider bento-card glass-card relative w-full h-full max-h-full flex-1 min-h-0 flex flex-col justify-center overflow-hidden"
        onMouseLeave={() => setHoveredSlotIdx(null)}
      >
        <div className="news-slider-bg" aria-hidden="true" />

        <div ref={containerRef} className="news-slider-container">
          <div
            className={cn('news-slider-stage', isDraggingTrack && 'is-dragging')}
            onPointerDown={handleSliderPointerDown}
            onDragStart={(e) => e.preventDefault()}
          >
            <div ref={bgRef} className="news-item-bg projects-themed-item-bg" aria-hidden="true" />

            <div
              ref={wrpRef}
              style={{
                transform: `translate3d(${currentTrackX}px, 0, 0)`,
                transition:
                  disableTrackTransition || isDraggingTrack
                    ? 'none'
                    : 'transform 0.43s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="news-slider-wrp"
            >
              {extendedSlides.map((slideItem, slotIdx) => {
                const { item, origIdx, slotKey } = slideItem;
                const isActiveCenter = slotIdx === visualTrackIdx;
                const isPrevSlide = slotIdx === visualTrackIdx - 1;
                const isNextSlide = slotIdx === visualTrackIdx + 1;
                const isPeekSlide = Math.abs(slotIdx - visualTrackIdx) === 2;
                const isHighlighted =
                  hoveredSlotIdx !== null ? slotIdx === hoveredSlotIdx : isActiveCenter;
                const cardLogos =
                  item.logos && item.logos.length > 0
                    ? item.logos
                    : [{ src: item.logo, alt: item.shortName }];
                const logoSizeClass = 'w-10 h-10 sm:w-11 sm:h-11';

                return (
                  <div
                    key={slotKey}
                    ref={(el) => {
                      slotSlideRefs.current[slotIdx] = el;
                    }}
                    className={cn(
                      'news-slider-slide',
                      isActiveCenter && 'active-slide swiper-slide-active',
                      isPrevSlide && 'swiper-slide-prev',
                      isNextSlide && 'swiper-slide-next',
                      isPeekSlide && 'swiper-slide-peek'
                    )}
                  >
                    <div
                      ref={(el) => {
                        slotItemRefs.current[slotIdx] = el;
                      }}
                      id={isActiveCenter ? `milestone-card-${item.key}` : undefined}
                      data-milestone-key={item.key}
                      role="button"
                      tabIndex={0}
                      onMouseEnter={() => {
                        if (typeof window !== 'undefined' && window.innerWidth > 800) {
                          setHoveredSlotIdx(slotIdx);
                        }
                      }}
                      onMouseLeave={() => {
                        if (typeof window !== 'undefined' && window.innerWidth > 800) {
                          setHoveredSlotIdx((prev) => (prev === slotIdx ? null : prev));
                        }
                      }}
                      onClick={() => {
                        if (didDragRef.current) return;
                        SoundEngine.playTap?.();
                        setActiveCarouselIdx(origIdx);
                        setVisualTrackIdx(slotIdx);
                        onSelectMilestone(item.key, origIdx);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          SoundEngine.playTap?.();
                          setActiveCarouselIdx(origIdx);
                          setVisualTrackIdx(slotIdx);
                          onSelectMilestone(item.key, origIdx);
                        }
                      }}
                      className={cn('news-card-item relative h-full flex flex-col justify-between gap-2', isHighlighted && 'active')}
                      style={{ padding: '15px' }}
                    >
                      {/* Nhãn Đang xem trên thẻ trung tâm */}
                      {isActiveCenter && (
                        <div className="flex items-center justify-between gap-2 w-full shrink-0 -mb-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-xs">
                            <span aria-hidden="true">★</span>
                            <span>Đang xem</span>
                          </span>
                          <span className="text-[11px] font-semibold opacity-70 truncate">
                            Nhấn để mở chi tiết
                          </span>
                        </div>
                      )}

                      {/* Hàng trên cùng: Bên trái là Icon lịch + Năm (cùng 1 hàng) & Thời gian; Bên phải chứa nhóm Group Logo */}
                      <div className="exp-card-top-row w-full flex items-center justify-between gap-2.5 shrink-0">
                        <div className="news-card-date !mb-0 flex flex-col gap-1 shrink-0 min-w-0">
                          <span className="news-card-date-title !flex flex-row items-center gap-1.5 !mb-0 whitespace-nowrap">
                            <WebIcon name="calendar" className="w-4 h-4 shrink-0 text-[#2563EB] dark:text-sky-400" />
                            <span className="leading-none font-bold">{item.yearBadge}</span>
                          </span>
                          <span className="news-card-date-txt !text-[11.5px] font-semibold opacity-90 block truncate">
                            {item.period && item.tenure
                              ? `${item.period} : ${item.tenure}`
                              : item.period || item.tenure || item.yearBadge}
                          </span>
                        </div>

                        {/* Nhóm Logo công ty */}
                        <div
                          className={cn(
                            'exp-card-logo-group flex items-center justify-end shrink-0',
                            cardLogos.length > 2 ? '-space-x-1.5' : 'gap-1'
                          )}
                        >
                          {cardLogos.map((lg, lgIdx) => (
                            <div
                              key={`${item.key}-logo-${lgIdx}`}
                              className={cn(
                                logoSizeClass,
                                'rounded-full bg-transparent border-0 ring-0 p-0 shadow-none overflow-hidden flex items-center justify-center shrink-0'
                              )}
                              style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
                              title={lg.alt}
                            >
                              <img
                                src={lg.src}
                                alt={lg.alt}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                draggable={false}
                                onError={(e) => {
                                  const fallback = resolveCompanyLogo(lg.alt || item.shortName);
                                  if (e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  }
                                }}
                                className="w-full h-full object-contain rounded-full select-none pointer-events-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Icon công ty và Tên công ty (H3) cùng 1 hàng */}
                      <div
                        className="exp-card-framed-box news-card-title !my-0 w-full rounded-[9px] border-0 px-2 py-1 flex flex-row items-center gap-1.5 shrink-0 min-w-0"
                        title={item.shortName}
                        style={{ border: 'none', outline: 'none' }}
                      >
                        <WebIcon name="building-2" className="w-4 h-4 shrink-0 text-[#2563EB] dark:text-sky-400" />
                        <h3 className="truncate min-w-0 flex-1 text-[14px] font-bold leading-snug m-0">{item.shortName}</h3>
                      </div>

                      {/* Chức vụ (#EE2A7B magenta), Quản lý, Giới thiệu */}
                      <div className="news-card-txt !mb-0 w-full !flex flex-col gap-1 text-[12px] leading-snug shrink-0">
                        <div className="exp-card-framed-box w-full rounded-[9px] border-0 px-2 py-1 flex items-center gap-1.5 min-w-0" style={{ border: 'none', outline: 'none' }}>
                          <WebIcon name="briefcase" className="w-3.5 h-3.5 shrink-0 text-[#EE2A7B]" />
                          <span className="min-w-0 truncate !text-[12px]">
                            <strong className="font-bold">Chức vụ:</strong>{' '}
                            <span className="font-bold text-[#EE2A7B]">
                              {item.roleTitle || item.roleSummary}
                            </span>
                          </span>
                        </div>
                        <div className="exp-card-framed-box w-full rounded-[9px] border-0 px-2 py-1 flex items-center gap-1.5 min-w-0" style={{ border: 'none', outline: 'none' }}>
                          <WebIcon name="users" className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="min-w-0 truncate !text-[12px]">
                            <strong className="font-bold">Quản lý:</strong>{' '}
                            <span>{item.headcountLabel}</span>
                          </span>
                        </div>
                        <div
                          className="exp-card-framed-box w-full rounded-[9px] border-0 px-2 py-1 flex items-start gap-1.5 min-w-0"
                          title={item.description}
                          style={{ border: 'none', outline: 'none' }}
                        >
                          <WebIcon name="file-text" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                          <span className="min-w-0 line-clamp-2 leading-[1.35] !text-[12px]">
                            <strong className="font-bold">Giới thiệu:</strong>{' '}
                            <span>{item.description}</span>
                          </span>
                        </div>
                      </div>

                      {/* Hình banner: Căn chỉnh hình thấy toàn bộ hình banner (object-contain) */}
                      <div className="news-card-img !mt-auto flex-1 min-h-[120px] w-full p-1.5 overflow-hidden rounded-[12px] relative bg-slate-900/5 dark:bg-white/5 flex items-center justify-center">
                        <img
                          src={item.bannerUrl || item.logo}
                          alt={`Banner công việc ${item.shortName}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          draggable={false}
                          onError={(e) => {
                            const fallback = item.logo || resolveCompanyLogo(item.shortName);
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                          className="w-full h-full max-h-full max-w-full object-contain select-none pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prev / Next Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrevCarousel}
              disabled={totalCards <= 1 || activeCarouselIdx <= 0}
              className="news-slider-arrow news-slider-prev absolute no-theme-btn"
              aria-label="Cột mốc trước"
            >
              <span className="icon-font">
                <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              onClick={handleNextCarousel}
              disabled={totalCards <= 1 || activeCarouselIdx >= totalCards - 1}
              className="news-slider-arrow news-slider-next absolute no-theme-btn"
              aria-label="Cột mốc tiếp theo"
            >
              <span className="icon-font">
                <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M31.296 14.304l-9.856-9.856c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.792 5.856h-21.568c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.824 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.696z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};
