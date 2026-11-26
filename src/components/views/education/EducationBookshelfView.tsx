'use client';

import React, { useState, useRef, useEffect } from 'react';
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
}

const DISTINCT_BOOK_FALLBACK_COLORS = [
  '#10B981', // Emerald
  '#0EA5E9', // Sky
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#3B82F6', // Royal Blue
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#A855F7', // Purple
  '#6366F1', // Indigo
  '#E11D48', // Crimson
  '#059669', // Jade
  '#D97706', // Ochre
];

function parseHexRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return [r, g, b];
  } else if (clean.length >= 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return [r, g, b];
  }
  return [99, 102, 241];
}

function mixRgb(
  c1: [number, number, number],
  c2: [number, number, number],
  weight1: number
): [number, number, number] {
  const w1 = Math.max(0, Math.min(1, weight1));
  const w2 = 1 - w1;
  return [
    Math.round(c1[0] * w1 + c2[0] * w2),
    Math.round(c1[1] * w1 + c2[1] * w2),
    Math.round(c1[2] * w1 + c2[2] * w2),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function computeBookCoverPalette(accentHex: string, isDarkEnv: boolean) {
  const accentRgb = parseHexRgb(accentHex);
  const envBase: [number, number, number] = isDarkEnv ? [15, 23, 42] : [255, 255, 255];
  const envDeep: [number, number, number] = isDarkEnv ? [9, 13, 28] : [241, 245, 249];

  // Rich distinct cover tone per book while respecting Light/Dark surrounding environment
  const coverTopRgb = mixRgb(accentRgb, envBase, isDarkEnv ? 0.34 : 0.22);
  const coverMidRgb = mixRgb(accentRgb, envBase, isDarkEnv ? 0.44 : 0.30);
  const coverBotRgb = mixRgb(accentRgb, envDeep, isDarkEnv ? 0.52 : 0.38);

  // Evaluate average cover surface luminance for WCAG contrast
  const avgLum = relativeLuminance(coverMidRgb);
  const darkInk: [number, number, number] = [15, 23, 42];
  const whiteInk: [number, number, number] = [255, 255, 255];
  const darkContrast = (Math.max(avgLum, 0.0072) + 0.05) / (Math.min(avgLum, 0.0072) + 0.05);
  const lightContrast = (Math.max(avgLum, 1.0) + 0.05) / (Math.min(avgLum, 1.0) + 0.05);
  const useLightText = lightContrast >= darkContrast;

  const primaryText = useLightText ? '#FFFFFF' : '#0F172A';
  const subText = useLightText ? 'rgba(248, 250, 252, 0.92)' : '#1E293B';
  const mutedText = useLightText ? 'rgba(226, 232, 240, 0.88)' : '#334155';

  // Crisp accent text & title icon ink tuned directly against cover surface + environment
  const accentInkRgb = useLightText
    ? mixRgb(accentRgb, whiteInk, 0.32)
    : mixRgb(accentRgb, darkInk, 0.48);
  const accentInk = toHex(accentInkRgb);

  const iconBg = useLightText
    ? `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, 0.34)`
    : `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, 0.16)`;
  const iconBorder = useLightText
    ? 'rgba(255, 255, 255, 0.42)'
    : `rgba(${accentInkRgb[0]}, ${accentInkRgb[1]}, ${accentInkRgb[2]}, 0.38)`;

  const badgeBg = useLightText
    ? 'rgba(15, 23, 42, 0.42)'
    : 'rgba(255, 255, 255, 0.78)';
  const badgeBorder = useLightText
    ? 'rgba(255, 255, 255, 0.32)'
    : `rgba(${accentInkRgb[0]}, ${accentInkRgb[1]}, ${accentInkRgb[2]}, 0.32)`;

  const coverBorder = isDarkEnv
    ? `rgba(${Math.min(255, accentRgb[0] + 60)}, ${Math.min(255, accentRgb[1] + 60)}, ${Math.min(255, accentRgb[2] + 60)}, 0.48)`
    : `rgba(${accentInkRgb[0]}, ${accentInkRgb[1]}, ${accentInkRgb[2]}, 0.36)`;

  const coverAura = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${isDarkEnv ? 0.38 : 0.28})`;

  return {
    bgGradient: `linear-gradient(155deg, ${toHex(coverTopRgb)} 0%, ${toHex(coverMidRgb)} 52%, ${toHex(coverBotRgb)} 100%)`,
    primaryText,
    subText,
    mutedText,
    accentInk,
    iconBg,
    iconBorder,
    badgeBg,
    badgeBorder,
    coverBorder,
    coverAura,
  };
}

export const EducationBookshelfView: React.FC<EducationBookshelfViewProps> = ({
  courses,
  getCourseColor,
  getShortCategoryLabel,
  getCourseIcon,
  isEn,
  isDark,
  onSelectCourse,
}) => {
  const [sel, setSel] = useState<number>(0);
  const [open, setOpen] = useState<number>(0);
  const [shelfSize, setShelfSize] = useState<{ width: number; height: number }>({ width: 880, height: 420 });
  const shelfRef = useRef<HTMLElement | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement | null>(null);
  const timelineNodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragStartXRef = useRef<number | null>(null);
  const dragMovedRef = useRef<boolean>(false);
  const sel0Ref = useRef<number>(0);
  const wheelCooldownRef = useRef<number>(0);

  const total = courses.length || 1;
  const lastIdx = Math.max(0, total - 1);
  const safeSel = Math.min(sel, lastIdx);
  const currentCourse = courses[safeSel] || courses[0];
  const displayTitle = formatCardTitle(currentCourse?.title || '');

  useEffect(() => {
    if (sel > lastIdx) {
      setSel(0);
      setOpen(0);
    }
  }, [sel, lastIdx]);

  // Measure shelf stage dimensions to scale 3D portrait books generously to fill the container
  useEffect(() => {
    const el = shelfRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setShelfSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Keep active timeline milestone centered horizontally inside timeline scroll bar
  useEffect(() => {
    const container = timelineScrollRef.current;
    const node = timelineNodeRefs.current[safeSel];
    if (!container || !node) return;
    const targetLeft = node.offsetLeft - container.clientWidth / 2 + node.offsetWidth / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [safeSel, courses.length]);

  // Tỉ lệ bìa sách dọc chuẩn (0.72) tự co giãn cân đối với không gian kệ sách
  const bookHeight = Math.round(
    Math.max(165, Math.min(shelfSize.height * 0.90, shelfSize.width * 0.60, 430))
  );
  const bookWidth = Math.round(bookHeight * 0.72);
  const bookSpine = Math.max(11, Math.min(20, Math.round(bookWidth * 0.072)));
  const firstGap = Math.round(bookWidth * 0.92);
  const sideStep = Math.max(22, Math.round(bookWidth * 0.25));
  const openShift = Math.round(bookWidth * 0.34);
  const maxHalfReach = Math.max(110, shelfSize.width / 2 - bookWidth * 0.2);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }
      if (open === 0) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setSel((prev) => Math.min(lastIdx, prev + 1));
          SoundEngine.playTap?.();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setSel((prev) => Math.max(0, prev - 1));
          SoundEngine.playTap?.();
        } else if (e.key === 'Home') {
          e.preventDefault();
          setSel(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          setSel(lastIdx);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          setOpen(1);
          SoundEngine.playBookOpen?.();
        }
      } else {
        if (e.key === 'Escape') {
          e.preventDefault();
          setOpen(0);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentCourse) {
            onSelectCourse(currentCourse);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, lastIdx, currentCourse, onSelectCourse]);

  // Native wheel browsing on bookshelf
  useEffect(() => {
    const el = shelfRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (open === 1 || total <= 1) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const delta = absX >= absY ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 4) return;
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - wheelCooldownRef.current < 160) return;
      wheelCooldownRef.current = now;
      if (delta > 0) {
        setSel((prev) => Math.min(lastIdx, prev + 1));
      } else {
        setSel((prev) => Math.max(0, prev - 1));
      }
      SoundEngine.playTap?.();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [open, total, lastIdx]);

  const handleDragStart = (clientX: number) => {
    if (open === 1) return;
    dragStartXRef.current = clientX;
    dragMovedRef.current = false;
    sel0Ref.current = safeSel;
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartXRef.current === null || open === 1) return;
    const deltaX = clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 8) {
      dragMovedRef.current = true;
    }
    const step = Math.round(-deltaX / 64);
    const newSel = Math.max(0, Math.min(lastIdx, sel0Ref.current + step));
    if (newSel !== safeSel) {
      setSel(newSel);
    }
  };

  const handleDragEnd = () => {
    dragStartXRef.current = null;
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 60);
  };

  const themeAccent = 'var(--text-link, var(--color-primary))';

  const getDistinctBookColor = (course: EducationCourse, idx: number): string => {
    const base = getCourseColor(course, idx);
    if (base && base.startsWith('#')) {
      return base;
    }
    return DISTINCT_BOOK_FALLBACK_COLORS[idx % DISTINCT_BOOK_FALLBACK_COLORS.length];
  };

  const renderEducationBookCover = (
    course: EducationCourse,
    idx: number,
    showGlint: boolean,
    palette: ReturnType<typeof computeBookCoverPalette>
  ) => {
    const courseTitle = formatCardTitle(course.title);
    const categoryLabel = getShortCategoryLabel(course.category);
    const courseIconName = getCourseIcon ? getCourseIcon(course.title) : 'book';

    return (
      <div
        className="disc-out edu-shelf-book-cover"
        style={{
          background: palette.bgGradient,
          color: palette.primaryText,
          borderColor: palette.coverBorder,
        }}
      >
        {showGlint && <div className="disc-glint" />}
        <div className="edu-shelf-cover-wash" aria-hidden="true" />
        <div className="edu-shelf-cover-spine-strip" aria-hidden="true" />

        <div className="edu-shelf-cover-inner">
          {/* Thanh metadata đỉnh bìa sách học vấn */}
          <div className="edu-shelf-cover-top">
            <span
              className="inline-flex items-center gap-1 font-bold truncate"
              style={{ color: palette.accentInk }}
            >
              <WebIcon name="book" className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {isEn ? 'Education Book' : 'Bìa sách · Học vấn'}
              </span>
            </span>
            <span
              className="font-mono font-bold tabular-nums shrink-0"
              style={{ color: palette.mutedText }}
            >
              {course.code || `Năm ${course.year}`}
            </span>
          </div>

          {/* Khung ảnh bìa sách bo cong đồng bộ bo cong tùy chỉnh và lấp đầy không gian thừa */}
          <div
            data-media-card="image"
            className="edu-shelf-cover-media"
            style={{
              borderRadius: 'var(--radius-image, var(--radius-global, var(--radius-card, 14px)))',
              padding: '0px',
              borderColor: palette.coverBorder,
            }}
          >
            <img
              src={course.image}
              alt=""
              loading={idx === safeSel ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="edu-shelf-cover-media-scrim" />
            <div className="edu-shelf-cover-media-meta">
              <span className="truncate">{course.issuer}</span>
              <span className="font-mono shrink-0 tabular-nums">Năm {course.year}</span>
            </div>
          </div>

          {/* Nội dung tiêu đề kèm icon sắc nét, phân loại, mô tả & kết quả */}
          <div className="edu-shelf-cover-body">
            <div className="edu-shelf-cover-category">
              <span className="font-bold" style={{ color: palette.accentInk }}>
                {course.type}
              </span>
              <span className="mx-1" style={{ color: palette.mutedText }}>·</span>
              <span className="font-semibold" style={{ color: palette.mutedText }}>
                {categoryLabel}
              </span>
            </div>

            <h4 className="edu-shelf-cover-title" style={{ color: palette.primaryText }}>
              <span
                className="edu-shelf-cover-title-icon-badge"
                style={{
                  background: palette.iconBg,
                  borderColor: palette.iconBorder,
                  color: palette.accentInk,
                }}
                aria-hidden="true"
              >
                <WebIcon
                  name={courseIconName}
                  className="edu-shelf-cover-title-icon"
                />
              </span>
              <span className="edu-shelf-cover-title-text">{courseTitle}</span>
            </h4>

            <p className="edu-shelf-cover-desc" style={{ color: palette.subText }}>
              {course.desc || 'Thông tin chưa được cung cấp.'}
            </p>

            {course.result && (
              <div
                className="edu-shelf-cover-result"
                style={{
                  color: palette.primaryText,
                  background: palette.badgeBg,
                  borderColor: palette.badgeBorder,
                }}
              >
                {course.result}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const currentCourseIconName = currentCourse && getCourseIcon ? getCourseIcon(currentCourse.title) : 'book';

  return (
    <div
      id="education-disc-bookshelf-view"
      className="disc-library w-full min-w-0 flex-1 min-h-0 h-full max-h-full flex flex-col items-center justify-between font-play box-border"
      style={{
        '--disc-sel': safeSel,
        '--disc-open': open,
        '--last': lastIdx,
        '--W': `${bookWidth}px`,
        '--H': `${bookHeight}px`,
        '--S': `${bookSpine}px`,
      } as React.CSSProperties}
    >
      {/* Top Timeline Bar (Year + Course Name) & Book Counter */}
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
                    setOpen(0);
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

      {/* 3D Shelf Section */}
      <section
        ref={shelfRef}
        tabIndex={0}
        aria-label="Education 3D Bookshelf. Use left and right arrows to browse, Enter to open book, Escape to close."
        className="disc-shelf relative flex items-center justify-center w-full flex-1 min-h-0"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <ol className="disc-cases">
          {courses.map((course, idx) => {
            const courseTitle = formatCardTitle(course.title);
            const d = idx - safeSel;
            const ad = Math.abs(d);
            const L = d < 0 ? 1 : 0;
            const R = d > 0 ? 1 : 0;
            const C = d === 0 ? 1 : 0;
            const courseAccent = getDistinctBookColor(course, idx);
            const palette = computeBookCoverPalette(courseAccent, isDark);

            const x =
              R * (firstGap + (d - 1) * sideStep) -
              L * (firstGap + (ad - 1) * sideStep) +
              C * open * openShift;
            const isWithinBounds = C === 1 || Math.abs(x) <= maxHalfReach;

            return (
              <li
                key={course.id}
                className="disc-case"
                data-center={C === 1 ? 'true' : 'false'}
                data-open={C === 1 && open === 1 ? 'true' : 'false'}
                style={{
                  '--disc-d': d,
                  '--disc-ad': ad,
                  '--disc-L': L,
                  '--disc-R': R,
                  '--disc-C': C,
                  '--disc-vis': isWithinBounds ? 1 : 0,
                  '--x': `${x}px`,
                  '--book-accent': courseAccent,
                  zIndex: C ? 10 : 10 - ad,
                  pointerEvents: isWithinBounds ? 'auto' : 'none',
                } as React.CSSProperties}
                onClick={() => {
                  if (dragMovedRef.current) return;
                  if (open === 0) {
                    if (C === 1) {
                      onSelectCourse(course);
                    } else {
                      setSel(idx);
                      SoundEngine.playTap?.();
                    }
                  } else if (C === 1) {
                    onSelectCourse(course);
                  }
                }}
              >
                <button
                  className="disc-pick"
                  type="button"
                  tabIndex={-1}
                  aria-label={`${courseTitle} by ${course.issuer}, ${course.year}`}
                />
                <div className="disc-box" aria-hidden="true">
                  <div className="disc-cover">
                    {renderEducationBookCover(course, idx, idx === safeSel && open === 1, palette)}
                    <div className="disc-in">
                      <p className="disc-notes-title" style={{ color: themeAccent }}>
                        {courseTitle}
                      </p>
                      <ol>
                        <li>
                          <span>{course.code || 'EDU'}</span>
                          <small>{course.year}</small>
                        </li>
                        <li>
                          <span>{course.issuer}</span>
                          <small>{getShortCategoryLabel(course.category)}</small>
                        </li>
                      </ol>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed m-0 line-clamp-5">
                        {course.desc}
                      </p>
                    </div>
                  </div>
                  <div className="disc-spine">
                    <b>{courseTitle}</b>
                    <span>{course.year}</span>
                  </div>
                  <div className="disc-edge" />
                  <div className="disc-lid" />
                  <div className="disc-base" />
                  <div className="disc-tray edu-shelf-inner-page">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: themeAccent }}
                      >
                        {isEn ? 'Curriculum Preview' : 'Nội dung đào tạo'}
                      </span>
                      <p className="text-[11px] font-bold text-[var(--text-primary)] m-0 leading-snug line-clamp-2">
                        {course.result || courseTitle}
                      </p>
                      <ul className="m-0 p-0 list-none flex flex-col gap-1">
                        {(course.modules || []).slice(0, 4).map((mod, mIdx) => (
                          <li
                            key={mIdx}
                            className="text-[10px] text-[var(--text-secondary)] leading-snug truncate"
                          >
                            {mIdx + 1}. {mod}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-subcard)] flex items-center justify-between text-[10px] font-semibold">
                      <span className="text-[var(--text-muted)]">
                        {course.issuer}
                      </span>
                      <span className="edu-shelf-cover-open-pill">
                        {isEn ? 'Read full book' : 'Đọc toàn bộ'}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          className="disc-open-hit"
          type="button"
          onClick={() => {
            if (dragMovedRef.current) return;
            if (currentCourse) {
              SoundEngine.playBookOpen?.();
              onSelectCourse(currentCourse);
            }
          }}
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            border: 'none',
            boxShadow: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            outline: 'none',
          }}
          aria-label={isEn ? `Open ${displayTitle}` : `Mở sách ${displayTitle}`}
        />
      </section>

      {/* Active Titles Section */}
      <div className="disc-titles" aria-live="polite">
        <div className="disc-title-item">
          <h3 title={displayTitle}>{displayTitle}</h3>
          <p>
            · {currentCourse?.issuer} · {currentCourse?.year} · {getShortCategoryLabel(currentCourse?.category)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationBookshelfView;
