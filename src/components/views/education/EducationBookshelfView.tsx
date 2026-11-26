'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EducationCourse } from '@/data/education';
import { formatCardTitle } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';

import {
  BOOK_COVER_DISPLAY_FONT,
  EducationBookCoverArt,
  getBookCoverTheme,
} from './EducationBookCoverArt';

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
}) => {
  const [internalSel, setInternalSel] = useState<number>(0);
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
  const sel = selectedBookIndex !== undefined ? selectedBookIndex : internalSel;
  const safeSel = Math.min(Math.max(0, sel), lastIdx);

  const setSel = React.useCallback(
    (next: number | ((prev: number) => number)) => {
      const resolved = typeof next === 'function' ? next(safeSel) : next;
      const clamped = Math.max(0, Math.min(lastIdx, resolved));
      setInternalSel(clamped);
      onSelectBookIndex?.(clamped);
    },
    [safeSel, lastIdx, onSelectBookIndex]
  );

  const currentCourse = courses[safeSel] || courses[0];
  const displayTitle = formatCardTitle(currentCourse?.title || '');

  useEffect(() => {
    if (sel > lastIdx) {
      setSel(0);
      setOpen(0);
    }
  }, [sel, lastIdx, setSel]);

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
    distinctColor: string,
    glowShadow: string
  ) => {
    const categoryLabel = getShortCategoryLabel(course.category);
    const courseIconName = getCourseIcon ? getCourseIcon(course.title) : 'code';

    return (
      <div
        className="disc-out edu-shelf-book-cover"
        style={{
          background: 'transparent',
          backgroundColor: 'transparent',
          borderRadius: 'var(--radius-global, var(--radius-primary-surface, var(--radius-card, 14px)))',
          border: '1px solid var(--border-subcard, rgba(148, 163, 184, 0.32))',
          boxShadow: `0 18px 36px -14px rgba(2, 8, 28, 0.28), 0 8px 20px -10px ${glowShadow}`,
          containerType: 'inline-size',
        }}
      >
        <EducationBookCoverArt
          course={course}
          courseColor={distinctColor}
          categoryLabel={categoryLabel}
          courseIconName={courseIconName}
          isEn={isEn}
          variant="shelf"
          showSpine={true}
          showGlint={showGlint}
          imageLoading={idx === safeSel ? 'eager' : 'lazy'}
        />
      </div>
    );
  };

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
      )}

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
            const coverTheme = getBookCoverTheme(course, courseAccent);

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
                    {renderEducationBookCover(
                      course,
                      idx,
                      idx === safeSel && open === 1,
                      courseAccent,
                      coverTheme.glowShadow
                    )}
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
                  <div
                    className="disc-spine overflow-hidden"
                    style={{
                      background: coverTheme.spineGradient,
                      fontFamily: BOOK_COVER_DISPLAY_FONT,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[-20%] z-0"
                      style={{
                        backgroundImage: `url("${course.image}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(12px) saturate(1.5) brightness(0.62)',
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-[1]"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(4, 10, 26, 0.56) 0%, rgba(4, 10, 26, 0.24) 50%, rgba(4, 10, 26, 0.58) 100%)',
                      }}
                    />
                    <b className="relative z-10">{courseTitle}</b>
                    <span className="relative z-10 tabular-nums">{course.year}</span>
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
    </div>
  );
};

export default EducationBookshelfView;
