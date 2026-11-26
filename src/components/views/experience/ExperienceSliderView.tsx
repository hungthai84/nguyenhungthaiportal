'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn } from '@/lib/utils';

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
  onSwitchViewMode: (mode: 'origami' | 'slider') => void;
  viewMode: 'origami' | 'slider';
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
  onSwitchViewMode,
  viewMode,
  isDarkSurface,
  isWalnutWood,
  isDarkLeather,
  isBrownLeather,
}) => {
  const initialIdx = useMemo(() => {
    const idx = roadmapCards.findIndex((c) => c.key === activeKey);
    return idx >= 0 ? idx : Math.min(3, Math.max(0, roadmapCards.length - 1));
  }, [roadmapCards, activeKey]);

  const totalCards = roadmapCards.length;
  const useLoopClones = totalCards >= 3;
  const clonePad = useLoopClones ? 3 : 0;

  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(initialIdx);
  const [visualTrackIdx, setVisualTrackIdx] = useState<number>(() =>
    useLoopClones ? initialIdx + 3 : initialIdx
  );
  const [hoveredSlotIdx, setHoveredSlotIdx] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [slideWidth, setSlideWidth] = useState<number>(0);
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isDraggingTrack, setIsDraggingTrack] = useState<boolean>(false);
  const [disableTrackTransition, setDisableTrackTransition] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrpRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const slotSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaXRef = useRef<number>(0);
  const didDragRef = useRef<boolean>(false);
  const wheelCooldownRef = useRef<number>(0);
  const wheelAccumRef = useRef<number>(0);
  const snapTimerRef = useRef<number | null>(null);

  const extendedSlides = useMemo<ExtendedRoadmapSlide[]>(() => {
    if (!useLoopClones) {
      return roadmapCards.map((item, idx) => ({
        item,
        origIdx: idx,
        slotKey: `orig-${item.key}-${idx}`,
        isClone: false,
      }));
    }

    const pre3Idx = (totalCards - 3) % totalCards;
    const pre2Idx = (totalCards - 2) % totalCards;
    const pre1Idx = (totalCards - 1) % totalCards;
    const post0Idx = 0;
    const post1Idx = 1 % totalCards;
    const post2Idx = 2 % totalCards;

    return [
      {
        item: roadmapCards[pre3Idx],
        origIdx: pre3Idx,
        slotKey: `clone-pre-3-${roadmapCards[pre3Idx].key}`,
        isClone: true,
      },
      {
        item: roadmapCards[pre2Idx],
        origIdx: pre2Idx,
        slotKey: `clone-pre-2-${roadmapCards[pre2Idx].key}`,
        isClone: true,
      },
      {
        item: roadmapCards[pre1Idx],
        origIdx: pre1Idx,
        slotKey: `clone-pre-1-${roadmapCards[pre1Idx].key}`,
        isClone: true,
      },
      ...roadmapCards.map((item, idx) => ({
        item,
        origIdx: idx,
        slotKey: `orig-${item.key}-${idx}`,
        isClone: false,
      })),
      {
        item: roadmapCards[post0Idx],
        origIdx: post0Idx,
        slotKey: `clone-post-0-${roadmapCards[post0Idx].key}`,
        isClone: true,
      },
      {
        item: roadmapCards[post1Idx],
        origIdx: post1Idx,
        slotKey: `clone-post-1-${roadmapCards[post1Idx].key}`,
        isClone: true,
      },
      {
        item: roadmapCards[post2Idx],
        origIdx: post2Idx,
        slotKey: `clone-post-2-${roadmapCards[post2Idx].key}`,
        isClone: true,
      },
    ];
  }, [roadmapCards, totalCards, useLoopClones]);

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
    return containerWidth / 2 - (visualTrackIdx * slideWidth + slideWidth / 2);
  }, [containerWidth, slideWidth, visualTrackIdx]);

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
    const nextOrig = currentOrig > 0 ? currentOrig - 1 : totalCards - 1;
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
    const nextOrig = currentOrig < totalCards - 1 ? currentOrig + 1 : 0;
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
      {/* Top Header with Title and View Switcher */}
      <div className="w-full flex items-center justify-between gap-3 px-[18px] sm:px-[24px] pt-[12px] pb-[8px] z-20 shrink-0">
        <header className="min-w-0">
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--surface-secondary-bg)] border border-[var(--border-subcard)] pointer-events-auto backdrop-blur-md shadow-xs">
          <button
            type="button"
            onClick={() => {
              SoundEngine.playTap?.();
              onSwitchViewMode('origami');
            }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'origami'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
            title="Chuyển sang dạng xem Bản đồ Origami"
          >
            <WebIcon name="layers" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bản đồ Origami</span>
          </button>
          <button
            type="button"
            onClick={() => {
              SoundEngine.playTap?.();
              onSwitchViewMode('slider');
            }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'slider'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
            title="Chuyển sang dạng xem Thẻ Slider"
          >
            <WebIcon name="layout-grid" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thẻ Slider</span>
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
                      role="button"
                      tabIndex={isPrevSlide || isActiveCenter || isNextSlide ? 0 : -1}
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
                      className={cn('news-card-item h-full flex flex-col justify-between gap-2.5', isHighlighted && 'active')}
                    >
                      <div className="news-card-date !mb-0 flex flex-col gap-1.5 shrink-0">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span className="news-card-date-title inline-flex items-center gap-1.5 !mb-0">
                            <WebIcon name="calendar" className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
                            <span>{item.yearBadge}</span>
                          </span>
                          {/* Group logo bên phải năm */}
                          <div className="flex items-center -space-x-1.5 shrink-0">
                            {(item.logos && item.logos.length > 0
                              ? item.logos
                              : [{ src: item.logo, alt: item.shortName }]
                            ).map((lg, lgIdx) => (
                              <div
                                key={`${item.key}-logo-${lgIdx}`}
                                className="w-7 h-7 rounded-full bg-white/95 border border-[var(--border-subcard)] p-0.5 shadow-xs overflow-hidden flex items-center justify-center shrink-0"
                                title={lg.alt}
                              >
                                <img
                                  src={lg.src}
                                  alt={lg.alt}
                                  loading="lazy"
                                  decoding="async"
                                  referrerPolicy="no-referrer"
                                  draggable={false}
                                  className="w-full h-full object-contain rounded-full select-none pointer-events-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="news-card-date-txt !text-[12px] font-semibold opacity-90 block">
                          {item.period && item.tenure
                            ? `${item.period} : ${item.tenure}`
                            : item.period || item.tenure || item.yearBadge}
                        </span>
                      </div>

                      <div className="news-card-title !mb-0 flex items-start gap-1.5 shrink-0" title={item.shortName}>
                        <WebIcon name="building-2" className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-primary)]" />
                        <span className="leading-snug">{item.shortName}</span>
                      </div>

                      <div className="news-card-txt !mb-0 flex flex-col gap-1.5 text-[12.5px] leading-snug shrink-0">
                        <div className="flex items-start gap-1.5">
                          <WebIcon name="briefcase" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-primary)]" />
                          <span className="min-w-0">
                            <strong className="font-bold">Chức vụ:</strong>{' '}
                            <span className="font-semibold text-[var(--color-primary)]">
                              {item.roleTitle || item.roleSummary}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <WebIcon name="users" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="min-w-0">
                            <strong className="font-bold">Quản lý:</strong>{' '}
                            <span>{item.headcountLabel}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5" title={item.description}>
                          <WebIcon name="file-text" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                          <span className="min-w-0 line-clamp-3">
                            <strong className="font-bold">Giới thiệu:</strong>{' '}
                            <span>{item.description}</span>
                          </span>
                        </div>
                      </div>

                      <div className="news-card-img !mt-auto flex-1 min-h-[140px] w-full p-0 overflow-hidden rounded-[12px] relative bg-black/5">
                        <img
                          src={item.bannerUrl || item.logo}
                          alt={`Banner công việc ${item.shortName}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          draggable={false}
                          className="w-full h-full object-cover select-none pointer-events-none"
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
              disabled={totalCards <= 1}
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
              disabled={totalCards <= 1}
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

          {/* Pagination Controls */}
          <div className="news-slider-ctr">
            <div className="news-slider-pagination">
              {roadmapCards.map((item, idx) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelectBullet(idx)}
                  className={cn(
                    'news-slider-bullet',
                    idx === activeCarouselIdx && 'active-bullet'
                  )}
                  aria-label={`Chuyển tới mốc ${item.yearBadge}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
