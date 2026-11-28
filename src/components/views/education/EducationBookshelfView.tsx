'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { EducationCourse } from '@/data/education';
import { formatCardTitle } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { WebIcon } from '@/components/ui/WebIcon';
import {
  getCourseShelfDesign,
  DISTINCT_BOOK_FALLBACK_COLORS,
  type BookTemplate,
  type ArtPattern,
  type BookPalette,
} from './EducationBookCoverArt';
import {
  EducationBookPresentationOverlay,
  type PresentedBookData,
} from './EducationBookPresentationOverlay';

export interface EducationBookshelfViewProps {
  courses: EducationCourse[];
  getCourseColor: (course: EducationCourse, idx: number) => string;
  getShortCategoryLabel: (category: EducationCourse['category']) => string;
  getCourseIcon?: (title: string) => string;
  isEn: boolean;
  isDark: boolean;
  onSelectCourse: (course: EducationCourse) => void;
  selectedBookIndex?: number;
  onSelectBookIndex?: (idx: number) => void;
  hideTopTimeline?: boolean;
  topWallContent?: React.ReactNode;
  shelfWallFrame?: React.ReactNode;
  cardStyle?: string;
}

interface ShelfTierConfig {
  id: 'tier-1' | 'tier-2';
  boardStyle: 'wood' | 'chalkboard';
  titleVi: string;
  titleEn: string;
  icon: string;
  match: (course: EducationCourse) => boolean;
}

const SHELF_CATEGORIES: ShelfTierConfig[] = [
  {
    id: 'tier-1',
    boardStyle: 'wood',
    titleVi: 'Chính quy, Kỹ thuật & Tự học',
    titleEn: 'Degree, Tech & Self-Taught',
    icon: 'graduation-cap',
    match: (course) => course.category === 'degree' || course.category === 'tech',
  },
  {
    id: 'tier-2',
    boardStyle: 'chalkboard',
    titleVi: 'Doanh nghiệp, Nghiệp vụ & Kỹ năng',
    titleEn: 'Corporate, Operations & Skills',
    icon: 'briefcase',
    match: (course) => course.category !== 'degree' && course.category !== 'tech',
  },
];

interface BookItemProps {
  course: EducationCourse;
  globalIdx: number;
  template: BookTemplate;
  pattern: ArtPattern;
  palette: BookPalette;
  categoryLabel: string;
  iconName: string;
  isActive: boolean;
  isPulled: boolean;
  isEn: boolean;
  registerRef: (el: HTMLButtonElement | null) => void;
  onActivate: () => void;
  onOpen: () => void;
}

const ShelfBookItem: React.FC<BookItemProps> = ({
  course,
  template,
  pattern,
  palette,
  categoryLabel,
  iconName,
  isActive,
  isPulled,
  isEn,
  registerRef,
  onActivate,
  onOpen,
}) => {
  const title = formatCardTitle(course.title);
  const shortCode = course.code || `EDU-${course.year}`;

  const renderBookVisual = () => {
    // 1. SIDE-SPINE: Vertical standing hardcover spine facing outward
    if (template === 'side-spine') {
      return (
        <div
          className="edu-side-book text-white"
          style={{ background: palette.spineBg }}
        >
          <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
          <div className="edu-book-paper-grain" aria-hidden="true" />
          <div className="edu-book-light" aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center gap-1.5 w-full">
            <span
              className="edu-side-spine-band"
              style={{ background: palette.soft }}
              aria-hidden="true"
            />
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-black/25 border border-white/20"
              style={{ color: palette.soft }}
            >
              <WebIcon name={iconName} className="w-3.5 h-3.5" />
            </span>
          </div>

          <span className="edu-side-spine-title drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {title}
          </span>

          <div className="relative z-10 flex flex-col items-center gap-1.5 w-full">
            <span className="edu-side-spine-badge text-white/95">
              {course.year}
            </span>
            <span
              className="edu-side-spine-band"
              style={{ background: palette.soft }}
              aria-hidden="true"
            />
          </div>
        </div>
      );
    }

    // 2. VJY-LAYERED: 3D angled hardcover with stacked cream page edges
    if (template === 'vjy-layered') {
      return (
        <div className="edu-vjy-wrap">
          <div
            className="edu-vjy-backboard"
            style={{ background: palette.deep }}
            aria-hidden="true"
          />
          <div className="edu-vjy-pages" aria-hidden="true" />
          <div
            className="edu-book-frame text-white p-2.5 pl-4"
            style={{ background: palette.coverBg }}
          >
            <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
            <div className="edu-book-spine-crease" aria-hidden="true" />
            <div className="edu-book-paper-grain" aria-hidden="true" />
            <div className="edu-book-light" aria-hidden="true" />

            {/* Top Kicker Row */}
            <div className="relative z-10 flex items-center justify-between gap-1.5 w-full">
              <span
                className="text-[10.5px] font-bold tracking-wide truncate px-1.5 py-0.5 rounded bg-black/25 border border-white/18"
                style={{ color: palette.soft }}
              >
                {categoryLabel}
              </span>
              <span className="text-[10px] font-bold tabular-nums text-white/90 shrink-0">
                {shortCode}
              </span>
            </div>

            {/* Center Cover Artwork Emblem & Bold Title */}
            <div className="relative z-10 flex flex-col items-start gap-1.5 my-auto">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/22 border border-white/22 shadow-sm"
                style={{ color: palette.soft }}
              >
                <WebIcon name={iconName} className="w-4 h-4" />
              </div>
              <h3 className="m-0 text-[15.5px] font-extrabold leading-[1.15] tracking-tight text-white line-clamp-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
                {title}
              </h3>
            </div>

            {/* Bottom Colophon */}
            <div className="relative z-10 pt-1.5 border-t border-white/22 flex items-center justify-between gap-1 w-full">
              <span className="text-[10.5px] font-semibold text-white/92 truncate">
                {course.issuer}
              </span>
              <WebIcon
                name="arrow-up-right"
                className="w-3.5 h-3.5 shrink-0 opacity-85"
                style={{ color: palette.soft }}
              />
            </div>
          </div>
        </div>
      );
    }

    // 3. VARIANT-EDITORIAL: Minimalist monograph with crisp horizontal top accent rule
    if (template === 'variant-editorial') {
      return (
        <div
          className="edu-book-frame edu-book-frame--editorial text-white"
          style={{ background: palette.coverBg }}
        >
          <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
          <div className="edu-book-spine-crease" aria-hidden="true" />
          <div className="edu-book-paper-grain" aria-hidden="true" />
          <div className="edu-book-light" aria-hidden="true" />

          <div className="relative z-10 w-full flex flex-col">
            <div
              className="edu-editorial-rule"
              style={{ background: palette.soft }}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-1 text-[10.5px] font-bold tracking-wide">
              <span className="truncate" style={{ color: palette.soft }}>
                {categoryLabel}
              </span>
              <span className="tabular-nums text-white/90 shrink-0">
                {course.year}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-1.5 my-auto">
            <h3 className="m-0 text-[16px] font-extrabold leading-[1.15] tracking-tight text-white line-clamp-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.42)]">
              {title}
            </h3>
            <p className="m-0 text-[10.5px] font-semibold leading-snug text-white/85 line-clamp-2">
              {course.type || course.issuer}
            </p>
          </div>

          <div className="relative z-10 w-full flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/22">
            <span className="inline-flex items-center gap-1 min-w-0">
              <WebIcon
                name={iconName}
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: palette.soft }}
              />
              <span className="text-[10.5px] font-semibold text-white/92 truncate">
                {course.issuer}
              </span>
            </span>
          </div>
        </div>
      );
    }

    // 4. VARIANT-BAUHAUS: Geometric dot accent + Reading Room art cover
    if (template === 'variant-bauhaus') {
      return (
        <div
          className="edu-book-frame edu-book-frame--bauhaus text-white"
          style={{ background: palette.coverBg }}
        >
          <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
          <div className="edu-book-spine-crease" aria-hidden="true" />
          <div className="edu-book-paper-grain" aria-hidden="true" />
          <div className="edu-book-light" aria-hidden="true" />

          {/* Geometric Bauhaus Header */}
          <div className="relative z-10 w-full flex items-center justify-between gap-1">
            <div className="edu-bauhaus-dots" aria-hidden="true">
              <span
                className="edu-bauhaus-dot"
                style={{ background: palette.soft }}
              />
              <span
                className="edu-bauhaus-square"
                style={{ background: '#ffffff', opacity: 0.9 }}
              />
              <span
                className="edu-bauhaus-dot"
                style={{ background: palette.highlight, opacity: 0.78 }}
              />
            </div>
            <span className="text-[10px] font-extrabold tracking-wide px-1.5 py-0.5 rounded bg-black/28 text-white/95 tabular-nums">
              {shortCode}
            </span>
          </div>

          {/* Geometric Center Block */}
          <div className="relative z-10 w-full my-auto flex flex-col gap-1.5">
            <div
              className="w-full h-[2.5px] rounded-full opacity-75"
              style={{
                background: `linear-gradient(90deg, ${palette.soft} 0%, transparent 100%)`,
              }}
              aria-hidden="true"
            />
            <h3 className="m-0 text-[15.5px] font-extrabold leading-[1.15] tracking-tight text-white line-clamp-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
              {title}
            </h3>
            <span
              className="text-[11px] font-bold tracking-wide truncate"
              style={{ color: palette.soft }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Bauhaus Footer Strip */}
          <div className="relative z-10 w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-md bg-black/28 border border-white/18">
            <span className="text-[10.5px] font-semibold text-white/95 truncate">
              {course.issuer}
            </span>
            <WebIcon
              name={iconName}
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: palette.soft }}
            />
          </div>
        </div>
      );
    }

    // 5. VARIANT-ZEN: Centered luminous circle motif hardcover
    return (
      <div
        className="edu-book-frame edu-book-frame--zen text-white"
        style={{ background: palette.coverBg }}
      >
        <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
        <div className="edu-book-spine-crease" aria-hidden="true" />
        <div className="edu-book-paper-grain" aria-hidden="true" />
        <div className="edu-book-light" aria-hidden="true" />

        <div className="relative z-10 w-full flex items-center justify-center pb-1.5 border-b border-white/22">
          <span
            className="text-[11px] font-bold tracking-wide truncate"
            style={{ color: palette.soft }}
          >
            {categoryLabel}
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-1.5 my-auto w-full">
          <div
            className="edu-zen-circle"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${palette.highlight} 0%, rgba(0,0,0,0.32) 100%)`,
            }}
          >
            <WebIcon
              name={iconName}
              className="w-4.5 h-4.5 text-white drop-shadow"
            />
            <span className="text-[10px] font-extrabold tracking-wider tabular-nums text-white/95">
              {course.year}
            </span>
          </div>

          <h3 className="m-0 text-[15px] font-extrabold leading-[1.15] tracking-tight text-white line-clamp-2 px-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
            {title}
          </h3>
        </div>

        <div className="relative z-10 w-full pt-1.5 border-t border-white/22">
          <span className="block text-[10.5px] font-semibold text-white/92 truncate">
            {course.issuer}
          </span>
        </div>
      </div>
    );
  };

  return (
    <button
      ref={registerRef}
      type="button"
      className={isActive ? 'edu-book-slot is-active' : 'edu-book-slot'}
      data-book-template={template}
      data-pulled={isPulled ? 'true' : undefined}
      aria-label={`${title} — ${course.issuer} (${course.year}). ${
        isEn ? 'Open course book' : 'Mở sách khóa học'
      }`}
      aria-pressed={isActive}
      title={`${title} · ${course.issuer} (${course.year})`}
      onFocus={onActivate}
      onClick={() => {
        onActivate();
        onOpen();
      }}
    >
      <div className="edu-tilt-book">
        {renderBookVisual()}
      </div>

      {/* Contact shadow on wooden ledge */}
      <span className="edu-book-shadow" aria-hidden="true" />

      {/* Calendar year badge mounted on the wooden plank fascia */}
      <span className="edu-book-shelf-year" aria-hidden="true">
        <WebIcon name="calendar" className="edu-book-shelf-year-icon w-3 h-3 shrink-0" />
        <span>{isEn ? course.year : `Năm ${course.year}`}</span>
      </span>
    </button>
  );
};

interface TierShelfProps {
  tier: ShelfTierConfig;
  items: Array<{ course: EducationCourse; globalIdx: number }>;
  safeSel: number;
  pulledGlobalIdx: number | null;
  getDistinctBookColor: (course: EducationCourse, idx: number) => string;
  getShortCategoryLabel: (category: EducationCourse['category']) => string;
  getCourseIcon?: (title: string) => string;
  isEn: boolean;
  bookRefs: React.MutableRefObject<Record<number, HTMLButtonElement | null>>;
  shelfWallFrame?: React.ReactNode;
  onSelectBookIndex: (idx: number) => void;
  onPullOutBook: (payload: {
    course: EducationCourse;
    globalIdx: number;
    template: BookTemplate;
    pattern: ArtPattern;
    palette: BookPalette;
    accentHex: string;
    categoryLabel: string;
    iconName: string;
  }) => void;
}

const WoodenShelfTier: React.FC<TierShelfProps> = ({
  tier,
  items,
  safeSel,
  pulledGlobalIdx,
  getDistinctBookColor,
  getShortCategoryLabel,
  getCourseIcon,
  isEn,
  bookRefs,
  shelfWallFrame,
  onSelectBookIndex,
  onPullOutBook,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => updateScrollButtons();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateScrollButtons);
      ro.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollButtons);
      if (ro) ro.disconnect();
    };
  }, [items.length, updateScrollButtons]);

  // Mousewheel-to-horizontal scroll when the wooden shelf overflows horizontally
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 4;
      if (!hasOverflow) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      const atStart = el.scrollLeft <= 1 && e.deltaY < 0;
      const atEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const scrollByAmount = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    SoundEngine.playTap?.();
    const delta = Math.max(240, Math.round(el.clientWidth * 0.65));
    el.scrollBy({ left: direction * delta, behavior: 'smooth' });
  };

  const countLabel = isEn
    ? `${items.length} ${items.length === 1 ? 'book' : 'books'}`
    : `${items.length} cuốn`;

  const isRightAlignedHeader = tier.id === 'tier-1' || tier.id === 'tier-2';

  const shelfBoardEl = (
    <div
      className={`edu-shelf-board ${
        tier.boardStyle === 'wood'
          ? 'edu-shelf-board--wood'
          : 'edu-shelf-board--chalkboard'
      }`}
    >
      <WebIcon
        name={tier.icon}
        className="w-4 h-4 shrink-0 opacity-90"
      />
      <h2 className="edu-shelf-board-title m-0">
        {isEn ? tier.titleEn : tier.titleVi}
      </h2>
      <span className="edu-shelf-board-count">{countLabel}</span>
    </div>
  );

  const navControlsEl = (canScrollLeft || canScrollRight) ? (
    <div className="edu-wood-nav-group">
      <button
        type="button"
        className="edu-wood-nav-btn"
        disabled={!canScrollLeft}
        onClick={() => scrollByAmount(-1)}
        aria-label={isEn ? 'Scroll shelf left' : 'Cuộn kệ sang trái'}
      >
        <WebIcon name="chevron-left" className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="edu-wood-nav-btn"
        disabled={!canScrollRight}
        onClick={() => scrollByAmount(1)}
        aria-label={isEn ? 'Scroll shelf right' : 'Cuộn kệ sang phải'}
      >
        <WebIcon name="chevron-right" className="w-4 h-4" />
      </button>
    </div>
  ) : null;

  return (
    <section
      id={tier.id === 'tier-1' ? 'el-p3-section-1' : 'el-p3-section-2'}
      className="edu-wood-tier"
      aria-label={isEn ? tier.titleEn : tier.titleVi}
    >
      {/* Sign Board Header + Horizontal Scroll Controls */}
      <div
        className={`edu-wood-tier-header ${
          isRightAlignedHeader ? 'edu-wood-tier-header--right' : ''
        }`}
      >
        {isRightAlignedHeader ? (
          <>
            {navControlsEl}
            {shelfBoardEl}
          </>
        ) : (
          <>
            {shelfBoardEl}
            {navControlsEl}
          </>
        )}
      </div>

      {/* Horizontal Book Row Resting on 3D Wooden Plank */}
      <div className="edu-wood-shelf-stage">
        <div ref={scrollRef} className="edu-wood-scroll-area">
          {(() => {
            const hasMcsaBook = items.some(({ course }) => course.id === 14);
            return (
              <>
                {items.map(({ course, globalIdx }) => {
                  const accentHex = getDistinctBookColor(course, globalIdx);
                  const { palette, template, pattern } = getCourseShelfDesign(
                    course,
                    accentHex
                  );
                  const categoryLabel = getShortCategoryLabel(course.category);
                  const iconName = getCourseIcon ? getCourseIcon(course.title) : 'book-open';

                  return (
                    <React.Fragment key={course.id}>
                      <ShelfBookItem
                        course={course}
                        globalIdx={globalIdx}
                        template={template}
                        pattern={pattern}
                        palette={palette}
                        categoryLabel={categoryLabel}
                        iconName={iconName}
                        isActive={globalIdx === safeSel}
                        isPulled={pulledGlobalIdx === globalIdx}
                        isEn={isEn}
                        registerRef={(el) => {
                          bookRefs.current[globalIdx] = el;
                        }}
                        onActivate={() => onSelectBookIndex(globalIdx)}
                        onOpen={() =>
                          onPullOutBook({
                            course,
                            globalIdx,
                            template,
                            pattern,
                            palette,
                            accentHex,
                            categoryLabel,
                            iconName,
                          })
                        }
                      />
                      {shelfWallFrame && course.id === 14 && shelfWallFrame}
                    </React.Fragment>
                  );
                })}
                {shelfWallFrame && !hasMcsaBook && shelfWallFrame}
              </>
            );
          })()}
        </div>

        {/* 3D Wood Grain Shelf Plank */}
        <div className="edu-wood-plank" aria-hidden="true">
          <div className="edu-wood-plank-top" />
          <div className="edu-wood-plank-front" />
        </div>
      </div>
    </section>
  );
};

export const EducationBookshelfView: React.FC<EducationBookshelfViewProps> = ({
  courses,
  getCourseColor,
  getShortCategoryLabel,
  getCourseIcon,
  isEn,
  isDark,
  onSelectCourse,
  selectedBookIndex,
  onSelectBookIndex,
  hideTopTimeline = false,
  topWallContent,
  shelfWallFrame,
}) => {
  const [internalSel, setInternalSel] = useState<number>(0);
  const [presentedBook, setPresentedBook] = useState<PresentedBookData | null>(null);
  const bookRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const timelineScrollRef = useRef<HTMLDivElement | null>(null);
  const timelineNodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const total = courses.length || 1;
  const lastIdx = Math.max(0, total - 1);
  const sel = selectedBookIndex !== undefined ? selectedBookIndex : internalSel;
  const safeSel = Math.min(Math.max(0, sel), lastIdx);

  const setSel = useCallback(
    (next: number | ((prev: number) => number)) => {
      const resolved = typeof next === 'function' ? next(safeSel) : next;
      const clamped = Math.max(0, Math.min(lastIdx, resolved));
      setInternalSel(clamped);
      onSelectBookIndex?.(clamped);
    },
    [safeSel, lastIdx, onSelectBookIndex]
  );

  // Sync horizontal scroll on the matching wooden shelf tier when selectedBookIndex changes (without triggering vertical scroll)
  useEffect(() => {
    const activeBookEl = bookRefs.current[safeSel];
    if (!activeBookEl) return;
    const shelfArea = activeBookEl.closest('.edu-wood-scroll-area') as HTMLElement | null;
    if (!shelfArea) return;
    const bookLeft = activeBookEl.offsetLeft;
    const bookRight = bookLeft + activeBookEl.offsetWidth;
    const viewLeft = shelfArea.scrollLeft;
    const viewRight = viewLeft + shelfArea.clientWidth;
    if (bookLeft < viewLeft + 12) {
      shelfArea.scrollTo({ left: Math.max(0, bookLeft - 18), behavior: 'smooth' });
    } else if (bookRight > viewRight - 12) {
      shelfArea.scrollTo({ left: bookRight - shelfArea.clientWidth + 18, behavior: 'smooth' });
    }
  }, [safeSel, courses.length]);

  // Keep optional built-in timeline centered when visible
  useEffect(() => {
    if (hideTopTimeline) return;
    const container = timelineScrollRef.current;
    const node = timelineNodeRefs.current[safeSel];
    if (!container || !node) return;
    const targetLeft =
      node.offsetLeft - container.clientWidth / 2 + node.offsetWidth / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [safeSel, courses.length, hideTopTimeline]);

  // Keyboard navigation across books on the shelves
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (presentedBook) return;
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSel((prev) => Math.min(lastIdx, prev + 1));
        SoundEngine.playTap?.();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSel((prev) => Math.max(0, prev - 1));
        SoundEngine.playTap?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastIdx, setSel, presentedBook]);

  const getBookSourceRect = useCallback((globalIdx: number): DOMRect | null => {
    const slotEl = bookRefs.current[globalIdx];
    if (!slotEl) return null;
    const tiltEl = slotEl.querySelector('.edu-tilt-book');
    return (tiltEl || slotEl).getBoundingClientRect();
  }, []);

  const handlePullOutBook = useCallback(
    (payload: {
      course: EducationCourse;
      globalIdx: number;
      template: BookTemplate;
      pattern: ArtPattern;
      palette: BookPalette;
      accentHex: string;
      categoryLabel: string;
      iconName: string;
    }) => {
      if (presentedBook) return;
      const rect = getBookSourceRect(payload.globalIdx);
      if (!rect) {
        onSelectCourse(payload.course);
        return;
      }
      SoundEngine.playBookPullOut?.();
      setPresentedBook({
        ...payload,
        sourceRect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      });
    },
    [presentedBook, getBookSourceRect, onSelectCourse]
  );

  const getDistinctBookColor = useCallback(
    (course: EducationCourse, idx: number): string => {
      if (course.accentColor && course.accentColor.startsWith('#')) {
        return course.accentColor;
      }
      const base = getCourseColor(course, idx);
      if (base && base.startsWith('#')) {
        return base;
      }
      return DISTINCT_BOOK_FALLBACK_COLORS[
        idx % DISTINCT_BOOK_FALLBACK_COLORS.length
      ];
    },
    [getCourseColor]
  );

  // Partition courses into the 2 wooden shelf tiers while preserving global indices for timeline sync
  const populatedTiers = useMemo(() => {
    const indexed = courses.map((course, globalIdx) => ({ course, globalIdx }));
    return SHELF_CATEGORIES.map((tier) => ({
      tier,
      items: indexed.filter(({ course }) => tier.match(course)),
    })).filter((group) => group.items.length > 0);
  }, [courses]);

  const handleOpenInterior = useCallback(
    (course: EducationCourse) => {
      setPresentedBook(null);
      onSelectCourse(course);
    },
    [onSelectCourse]
  );

  return (
    <div
      id="education-disc-bookshelf-view"
      data-theme={isDark ? 'dark' : 'light'}
      data-has-pulled-book={presentedBook ? 'true' : 'false'}
      className="edu-wood-library font-play"
    >
      {topWallContent}
      {!hideTopTimeline && (
        <header className="disc-top edu-shelf-timeline-header w-full">
          <div
            ref={timelineScrollRef}
            className="edu-shelf-timeline-scroll"
            role="navigation"
            aria-label={isEn ? 'Course Timeline' : 'Dòng thời gian các khóa học'}
          >
            <div className="edu-shelf-timeline-track">
              <span className="edu-shelf-timeline-line" aria-hidden="true" />
              {courses.map((course, idx) => {
                const isActive = idx === safeSel;
                const nodeTitle = formatCardTitle(course.title);
                return (
                  <button
                    key={`timeline-${course.id}`}
                    ref={(el) => {
                      timelineNodeRefs.current[idx] = el;
                    }}
                    type="button"
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => {
                      setSel(idx);
                      SoundEngine.playTap?.();
                    }}
                    className="edu-shelf-timeline-node"
                    aria-current={isActive ? 'step' : undefined}
                    title={`${course.year} · ${nodeTitle}`}
                  >
                    <span className="edu-shelf-timeline-year">{course.year}</span>
                    <span className="edu-shelf-timeline-dot-wrap" aria-hidden="true">
                      <span className="edu-shelf-timeline-dot" />
                    </span>
                    <span className="edu-shelf-timeline-name">{nodeTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="disc-count m-0 shrink-0 pl-2">
            <b>{safeSel + 1}</b> / {courses.length}
          </p>
        </header>
      )}

      <div className="edu-wood-tiers-stack">
        {populatedTiers.map(({ tier, items }, tierIdx) => (
          <WoodenShelfTier
            key={tier.id}
            tier={tier}
            items={items}
            safeSel={safeSel}
            pulledGlobalIdx={presentedBook?.globalIdx ?? null}
            getDistinctBookColor={getDistinctBookColor}
            getShortCategoryLabel={getShortCategoryLabel}
            getCourseIcon={getCourseIcon}
            isEn={isEn}
            bookRefs={bookRefs}
            shelfWallFrame={tierIdx === 0 ? shelfWallFrame : undefined}
            onSelectBookIndex={setSel}
            onPullOutBook={handlePullOutBook}
          />
        ))}
      </div>

      <EducationBookPresentationOverlay
        presented={presentedBook}
        getSourceRect={getBookSourceRect}
        isEn={isEn}
        onCloseComplete={() => setPresentedBook(null)}
        onOpenInterior={handleOpenInterior}
      />
    </div>
  );
};

export default EducationBookshelfView;
