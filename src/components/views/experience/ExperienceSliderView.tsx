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
  companyLine1: string;
  companyLine2: string;
  shortName: string;
  roleSummary: string;
  headcountLabel: string;
  description: string;
  logo: string;
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
    return idx >= 0 ? idx : 3;
  }, [roadmapCards, activeKey]);

  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(initialIdx);
  const [hoveredSlotIdx, setHoveredSlotIdx] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [slideWidth, setSlideWidth] = useState<number>(0);
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isDraggingTrack, setIsDraggingTrack] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrpRef = useRef<HTMLDivElement>(null);
  const slotSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartXRef = useRef<number | null>(null);
  const didDragRef = useRef<boolean>(false);
  const wheelCooldownRef = useRef<number>(0);

  const totalCards = roadmapCards.length;

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
  }, [measureSliderGeometry, totalCards]);

  const baseTrackX = useMemo(() => {
    if (containerWidth <= 0 || slideWidth <= 0) return 0;
    return containerWidth / 2 - (activeCarouselIdx * slideWidth + slideWidth / 2);
  }, [containerWidth, slideWidth, activeCarouselIdx]);

  const currentTrackX = baseTrackX + dragDeltaX;

  const handlePrevCarousel = useCallback(() => {
    if (totalCards <= 1) return;
    SoundEngine.playTap?.();
    setActiveCarouselIdx((prev) => Math.max(0, prev - 1));
  }, [totalCards]);

  const handleNextCarousel = useCallback(() => {
    if (totalCards <= 1) return;
    SoundEngine.playTap?.();
    setActiveCarouselIdx((prev) => Math.min(totalCards - 1, prev + 1));
  }, [totalCards]);

  // Pointer drag events for smooth swipe
  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = e.clientX;
    didDragRef.current = false;
    setIsDraggingTrack(true);
    setDragDeltaX(0);

    const onPointerMove = (ev: PointerEvent) => {
      if (dragStartXRef.current === null) return;
      const deltaX = ev.clientX - dragStartXRef.current;
      if (Math.abs(deltaX) > 6) {
        didDragRef.current = true;
      }
      setDragDeltaX(deltaX);
    };

    const onPointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (dragStartXRef.current === null) return;
      const totalDelta = ev.clientX - dragStartXRef.current;
      dragStartXRef.current = null;
      setIsDraggingTrack(false);
      setDragDeltaX(0);

      const threshold = Math.max(40, (slideWidth || 260) * 0.2);
      if (totalDelta < -threshold && activeCarouselIdx < totalCards - 1) {
        handleNextCarousel();
      } else if (totalDelta > threshold && activeCarouselIdx > 0) {
        handlePrevCarousel();
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Wheel browsing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const delta = absX >= absY ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 6) return;

      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - wheelCooldownRef.current < 200) return;
      wheelCooldownRef.current = now;

      if (delta > 0 && activeCarouselIdx < totalCards - 1) {
        handleNextCarousel();
      } else if (delta < 0 && activeCarouselIdx > 0) {
        handlePrevCarousel();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [activeCarouselIdx, totalCards, handleNextCarousel, handlePrevCarousel]);

  return (
    <div className="w-full h-full min-h-0 flex-1 flex flex-col justify-between overflow-hidden relative">
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
                  ? '#FFFBF4'
                  : isDarkLeather
                    ? '#FFF8EE'
                    : isBrownLeather
                      ? '#FFF8DC'
                      : 'var(--text-heading, var(--text-primary))',
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

      {/* 3D Slider Container */}
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
            <div
              ref={wrpRef}
              style={{
                transform: `translate3d(${currentTrackX}px, 0, 0)`,
                transition: isDraggingTrack ? 'none' : 'transform 0.43s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="news-slider-wrp"
            >
              {roadmapCards.map((item, slotIdx) => {
                const isActiveCenter = slotIdx === activeCarouselIdx;
                const isPrevSlide = slotIdx === activeCarouselIdx - 1;
                const isNextSlide = slotIdx === activeCarouselIdx + 1;
                const isPeekSlide = Math.abs(slotIdx - activeCarouselIdx) === 2;
                const isHighlighted =
                  hoveredSlotIdx !== null ? slotIdx === hoveredSlotIdx : isActiveCenter;

                return (
                  <div
                    key={item.key}
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
                        setActiveCarouselIdx(slotIdx);
                        onSelectMilestone(item.key, slotIdx);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveCarouselIdx(slotIdx);
                          onSelectMilestone(item.key, slotIdx);
                        }
                      }}
                      className={cn('news-card-item', isHighlighted && 'active')}
                    >
                      <div className="news-card-date">
                        <span className="news-card-date-title">{item.yearBadge}</span>
                        <span className="news-card-date-txt">{item.headcountLabel}</span>
                      </div>
                      <div className="news-card-title" title={item.shortName}>
                        {item.shortName}
                      </div>
                      <p className="news-card-txt" title={item.description}>
                        <span className="font-bold text-[var(--color-primary)] block mb-1">
                          {item.roleSummary}
                        </span>
                        {item.description}
                      </p>
                      <div
                        className="news-card-img flex items-center justify-center p-3"
                        style={{
                          background: item.colBgGradient || item.blockGradient,
                        }}
                      >
                        <img
                          src={item.logo}
                          alt={item.shortName}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          draggable={false}
                          className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
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
              disabled={activeCarouselIdx <= 0}
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
              disabled={activeCarouselIdx >= totalCards - 1}
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
                  onClick={() => {
                    SoundEngine.playTap?.();
                    setActiveCarouselIdx(idx);
                  }}
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
