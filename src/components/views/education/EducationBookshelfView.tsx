'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { EducationCourse } from '@/data/education';
import { formatCardTitle } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { WebIcon } from '@/components/ui/WebIcon';

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
}

type BookTemplate =
  | 'vjy-layered'
  | 'variant-editorial'
  | 'variant-bauhaus'
  | 'side-spine'
  | 'variant-zen';

type ArtPattern =
  | 'p-grid'
  | 'p-dots'
  | 'p-split'
  | 'p-arch'
  | 'p-sun'
  | 'p-stripes'
  | 'p-waves'
  | 'p-rings';

interface ShelfTierConfig {
  id: 'tier-1' | 'tier-2';
  boardStyle: 'wood' | 'chalkboard';
  titleVi: string;
  titleEn: string;
  icon: string;
  match: (course: EducationCourse) => boolean;
}

const WEBSITE_BOOK_TEMPLATES: BookTemplate[] = [
  'vjy-layered',
  'variant-editorial',
  'variant-bauhaus',
  'side-spine',
  'variant-zen',
];

const ART_PATTERNS: ArtPattern[] = [
  'p-grid',
  'p-dots',
  'p-split',
  'p-arch',
  'p-sun',
  'p-stripes',
  'p-waves',
  'p-rings',
];

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

const DISTINCT_BOOK_FALLBACK_COLORS = [
  '#2563EB', // Sapphire Blue
  '#06B6D4', // Glacial Aqua Cyan
  '#E11D48', // Scarlet Crimson
  '#10B981', // Pure Emerald Green
  '#8B5CF6', // Royal Violet Amethyst
  '#F59E0B', // Golden Amber
  '#EC4899', // Fuchsia Rose
  '#6366F1', // Midnight Indigo
  '#14B8A6', // Oceanic Deep Teal
  '#84CC16', // Forest Lime
  '#1E3A8A', // Midnight Navy
  '#F97316', // Tangerine Orange
  '#D946EF', // Electric Orchid
  '#475569', // Slate Charcoal
];

interface BookPalette {
  base: string;
  deep: string;
  mid: string;
  soft: string;
  highlight: string;
  coverBg: string;
  spineBg: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 37, g: 99, b: 235 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function mixRgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  weightB: number
): string {
  const w = Math.max(0, Math.min(1, weightB));
  const r = Math.round(a.r * (1 - w) + b.r * w);
  const g = Math.round(a.g * (1 - w) + b.g * w);
  const bl = Math.round(a.b * (1 - w) + b.b * w);
  return `rgb(${r}, ${g}, ${bl})`;
}

function buildPaletteFromAccent(accentHex: string): BookPalette {
  const rgb = hexToRgb(accentHex);
  const darkAnchor = { r: 9, g: 14, b: 28 };
  const lightAnchor = { r: 255, g: 255, b: 255 };

  const deep = mixRgb(rgb, darkAnchor, 0.56);
  const mid = mixRgb(rgb, darkAnchor, 0.22);
  const soft = mixRgb(rgb, lightAnchor, 0.72);
  const highlight = mixRgb(rgb, lightAnchor, 0.42);

  return {
    base: accentHex,
    deep,
    mid,
    soft,
    highlight,
    coverBg: `radial-gradient(circle at 20% 12%, ${highlight} 0%, transparent 48%), linear-gradient(155deg, ${accentHex} 0%, ${mid} 56%, ${deep} 100%)`,
    spineBg: `linear-gradient(90deg, ${deep} 0%, ${accentHex} 45%, ${mid} 76%, ${deep} 100%)`,
  };
}

interface BookItemProps {
  course: EducationCourse;
  globalIdx: number;
  template: BookTemplate;
  pattern: ArtPattern;
  palette: BookPalette;
  categoryLabel: string;
  iconName: string;
  isActive: boolean;
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
  isEn,
  registerRef,
  onActivate,
  onOpen,
}) => {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const title = formatCardTitle(course.title);
  const shortCode = course.code || `EDU-${course.year}`;

  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const relY = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    const rx = (-relY * 14).toFixed(2);
    const ry = (relX * 16).toFixed(2);
    el.style.setProperty('--tilt-rx', `${rx}deg`);
    el.style.setProperty('--tilt-ry', `${ry}deg`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-rx', '0deg');
    el.style.setProperty('--tilt-ry', '0deg');
  }, []);

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

          <span className="edu-side-spine-title drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
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
            className="edu-book-frame text-white p-3.5 pl-5"
            style={{ background: palette.coverBg }}
          >
            <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
            <div className="edu-book-spine-crease" aria-hidden="true" />
            <div className="edu-book-paper-grain" aria-hidden="true" />
            <div className="edu-book-light" aria-hidden="true" />

            {/* Top Kicker Row */}
            <div className="relative z-10 flex items-center justify-between gap-1.5 w-full">
              <span
                className="text-[9px] font-bold uppercase tracking-wider truncate px-1.5 py-0.5 rounded bg-black/25 border border-white/15"
                style={{ color: palette.soft }}
              >
                {categoryLabel}
              </span>
              <span className="text-[9px] font-bold tabular-nums text-white/85 shrink-0">
                {shortCode}
              </span>
            </div>

            {/* Center Cover Artwork Emblem */}
            <div className="relative z-10 flex flex-col items-start gap-2 my-auto">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-black/22 border border-white/22 shadow-sm"
                style={{ color: palette.soft }}
              >
                <WebIcon name={iconName} className="w-4.5 h-4.5" />
              </div>
              <h3 className="m-0 text-[13.5px] font-extrabold leading-tight tracking-tight text-white line-clamp-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                {title}
              </h3>
            </div>

            {/* Bottom Colophon */}
            <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between gap-1 w-full">
              <span className="text-[9.5px] font-semibold text-white/88 truncate">
                {course.issuer}
              </span>
              <WebIcon
                name="arrow-up-right"
                className="w-3 h-3 shrink-0 opacity-80"
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
            <div className="flex items-center justify-between gap-1 text-[9px] font-bold uppercase tracking-widest">
              <span className="truncate" style={{ color: palette.soft }}>
                {categoryLabel}
              </span>
              <span className="tabular-nums text-white/80 shrink-0">
                {course.year}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-1.5 my-auto">
            <h3 className="m-0 text-[14.5px] font-extrabold leading-[1.18] tracking-tight text-white line-clamp-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              {title}
            </h3>
            <p className="m-0 text-[9.5px] leading-snug text-white/82 line-clamp-2">
              {course.type || course.issuer}
            </p>
          </div>

          <div className="relative z-10 w-full flex items-center justify-between gap-1.5 pt-2 border-t border-white/20">
            <span className="inline-flex items-center gap-1 min-w-0">
              <WebIcon
                name={iconName}
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: palette.soft }}
              />
              <span className="text-[9.5px] font-semibold text-white/90 truncate">
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
                style={{ background: '#ffffff', opacity: 0.85 }}
              />
              <span
                className="edu-bauhaus-dot"
                style={{ background: palette.highlight, opacity: 0.65 }}
              />
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/28 text-white/90 tabular-nums">
              {shortCode}
            </span>
          </div>

          {/* Geometric Center Block */}
          <div className="relative z-10 w-full my-auto flex flex-col gap-2">
            <div
              className="w-full h-[3px] rounded-full opacity-55"
              style={{
                background: `linear-gradient(90deg, ${palette.soft} 0%, transparent 100%)`,
              }}
              aria-hidden="true"
            />
            <h3 className="m-0 text-[14px] font-extrabold leading-[1.2] tracking-tight text-white line-clamp-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.48)]">
              {title}
            </h3>
            <span
              className="text-[9.5px] font-bold uppercase tracking-wide truncate"
              style={{ color: palette.soft }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Bauhaus Footer Strip */}
          <div className="relative z-10 w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-md bg-black/26 border border-white/15">
            <span className="text-[9px] font-semibold text-white/92 truncate">
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

        <div className="relative z-10 w-full flex items-center justify-center pb-1.5 border-b border-white/20">
          <span
            className="text-[9px] font-bold uppercase tracking-[0.12em] truncate"
            style={{ color: palette.soft }}
          >
            {categoryLabel}
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 my-auto w-full">
          <div
            className="edu-zen-circle"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${palette.highlight} 0%, rgba(0,0,0,0.28) 100%)`,
            }}
          >
            <WebIcon
              name={iconName}
              className="w-5 h-5 text-white drop-shadow"
            />
            <span className="text-[8.5px] font-extrabold tracking-widest tabular-nums text-white/90">
              {course.year}
            </span>
          </div>

          <h3 className="m-0 text-[13px] font-extrabold leading-tight tracking-tight text-white line-clamp-2 px-0.5 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
            {title}
          </h3>
        </div>

        <div className="relative z-10 w-full pt-1.5 border-t border-white/20">
          <span className="block text-[9px] font-semibold text-white/85 truncate">
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
      className={`edu-book-slot ${isActive ? 'is-active' : ''}`}
      data-book-template={template}
      aria-label={`${title} — ${course.issuer} (${course.year}). ${
        isEn ? 'Open course book' : 'Mở sách khóa học'
      }`}
      aria-pressed={isActive}
      title={`${title} · ${course.issuer} (${course.year})`}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onFocus={onActivate}
      onClick={() => {
        SoundEngine.playTap?.();
        onActivate();
        onOpen();
      }}
    >
      <div ref={tiltRef} className="edu-tilt-book">
        {renderBookVisual()}
      </div>

      {/* Contact shadow on wooden ledge */}
      <span className="edu-book-shadow" aria-hidden="true" />

      {/* Calendar year badge mounted on the wooden plank fascia */}
      <span className="edu-book-shelf-year" aria-hidden="true">
        <WebIcon name="calendar" className="w-2.5 h-2.5 shrink-0 opacity-85" />
        <span>{course.year}</span>
      </span>
    </button>
  );
};

interface TierShelfProps {
  tier: ShelfTierConfig;
  items: Array<{ course: EducationCourse; globalIdx: number }>;
  safeSel: number;
  getDistinctBookColor: (course: EducationCourse, idx: number) => string;
  getShortCategoryLabel: (category: EducationCourse['category']) => string;
  getCourseIcon?: (title: string) => string;
  isEn: boolean;
  bookRefs: React.MutableRefObject<Record<number, HTMLButtonElement | null>>;
  onSelectBookIndex: (idx: number) => void;
  onSelectCourse: (course: EducationCourse) => void;
}

const WoodenShelfTier: React.FC<TierShelfProps> = ({
  tier,
  items,
  safeSel,
  getDistinctBookColor,
  getShortCategoryLabel,
  getCourseIcon,
  isEn,
  bookRefs,
  onSelectBookIndex,
  onSelectCourse,
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

  return (
    <section
      className="edu-wood-tier"
      aria-label={isEn ? tier.titleEn : tier.titleVi}
    >
      {/* Sign Board Header + Horizontal Scroll Controls */}
      <div className="edu-wood-tier-header">
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

        {(canScrollLeft || canScrollRight) && (
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
        )}
      </div>

      {/* Horizontal Book Row Resting on 3D Wooden Plank */}
      <div className="edu-wood-shelf-stage">
        <div ref={scrollRef} className="edu-wood-scroll-area">
          {items.map(({ course, globalIdx }) => {
            const accentHex = getDistinctBookColor(course, globalIdx);
            const palette = buildPaletteFromAccent(accentHex);
            const template =
              WEBSITE_BOOK_TEMPLATES[globalIdx % WEBSITE_BOOK_TEMPLATES.length];
            const pattern =
              ART_PATTERNS[(course.id + globalIdx) % ART_PATTERNS.length];
            const categoryLabel = getShortCategoryLabel(course.category);
            const iconName = getCourseIcon ? getCourseIcon(course.title) : 'book-open';

            return (
              <ShelfBookItem
                key={course.id}
                course={course}
                globalIdx={globalIdx}
                template={template}
                pattern={pattern}
                palette={palette}
                categoryLabel={categoryLabel}
                iconName={iconName}
                isActive={globalIdx === safeSel}
                isEn={isEn}
                registerRef={(el) => {
                  bookRefs.current[globalIdx] = el;
                }}
                onActivate={() => onSelectBookIndex(globalIdx)}
                onOpen={() => onSelectCourse(course)}
              />
            );
          })}
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
}) => {
  const [internalSel, setInternalSel] = useState<number>(0);
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

  // Sync horizontal scroll on the matching wooden shelf tier when selectedBookIndex changes (e.g., from top banner timeline)
  useEffect(() => {
    const activeBookEl = bookRefs.current[safeSel];
    if (!activeBookEl) return;
    activeBookEl.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
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
  }, [lastIdx, setSel]);

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

  return (
    <div
      id="education-disc-bookshelf-view"
      data-theme={isDark ? 'dark' : 'light'}
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
        {populatedTiers.map(({ tier, items }) => (
          <WoodenShelfTier
            key={tier.id}
            tier={tier}
            items={items}
            safeSel={safeSel}
            getDistinctBookColor={getDistinctBookColor}
            getShortCategoryLabel={getShortCategoryLabel}
            getCourseIcon={getCourseIcon}
            isEn={isEn}
            bookRefs={bookRefs}
            onSelectBookIndex={setSel}
            onSelectCourse={onSelectCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default EducationBookshelfView;
