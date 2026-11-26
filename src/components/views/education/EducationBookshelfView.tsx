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
  isEn: boolean;
  isDark: boolean;
  onSelectCourse: (course: EducationCourse) => void;
}

export const EducationBookshelfView: React.FC<EducationBookshelfViewProps> = ({
  courses,
  getCourseColor,
  getShortCategoryLabel,
  isEn,
  isDark: _isDark,
  onSelectCourse,
}) => {
  const [sel, setSel] = useState<number>(0);
  const [open, setOpen] = useState<number>(0);
  const [shelfSize, setShelfSize] = useState<{ width: number; height: number }>({ width: 880, height: 420 });
  const shelfRef = useRef<HTMLElement | null>(null);
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

  // Tỉ lệ bìa sách dọc chuẩn (0.72) tăng kích thước sách lên 1 chút và giảm nhẹ độ dày gáy sách
  const bookHeight = Math.round(
    Math.max(188, Math.min(shelfSize.height * 0.93, shelfSize.width * 0.62, 445))
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

  const renderEducationBookCover = (
    course: EducationCourse,
    idx: number,
    showGlint: boolean
  ) => {
    const courseTitle = formatCardTitle(course.title);
    const categoryLabel = getShortCategoryLabel(course.category);

    return (
      <div className="disc-out edu-shelf-book-cover">
        {showGlint && <div className="disc-glint" />}
        <div className="edu-shelf-cover-wash" aria-hidden="true" />
        <div className="edu-shelf-cover-spine-strip" aria-hidden="true" />

        <div className="edu-shelf-cover-inner">
          {/* Thanh metadata đỉnh bìa sách học vấn */}
          <div className="edu-shelf-cover-top">
            <span
              className="inline-flex items-center gap-1 font-semibold truncate"
              style={{ color: themeAccent }}
            >
              <WebIcon name="book" className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {isEn ? 'Education Book' : 'Bìa sách · Học vấn'}
              </span>
            </span>
            <span className="font-mono font-semibold tabular-nums text-[var(--text-muted)] shrink-0">
              {course.code || `Năm ${course.year}`}
            </span>
          </div>

          {/* Khung ảnh bìa sách tỷ lệ 16:10 đồng bộ EducationBookView */}
          <div className="edu-shelf-cover-media">
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

          {/* Nội dung tiêu đề, phân loại, mô tả & kết quả */}
          <div className="edu-shelf-cover-body">
            <div className="edu-shelf-cover-category">
              <span style={{ color: themeAccent }}>{course.type}</span>
              <span className="mx-1 text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{categoryLabel}</span>
            </div>

            <h4 className="edu-shelf-cover-title" style={{ color: themeAccent }}>
              {courseTitle}
            </h4>

            <p className="edu-shelf-cover-desc">
              {course.desc || 'Thông tin chưa được cung cấp.'}
            </p>

            {course.result && (
              <div
                className="edu-shelf-cover-result"
                style={{ color: 'var(--text-badge, var(--text-link, var(--color-primary)))' }}
              >
                {course.result}
              </div>
            )}
          </div>
        </div>
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
      {/* Top Bar */}
      <header className="disc-top w-full flex items-center justify-end">
        <p className="disc-count m-0">
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
            const d = idx - safeSel;
            const ad = Math.abs(d);
            const L = d < 0 ? 1 : 0;
            const R = d > 0 ? 1 : 0;
            const C = d === 0 ? 1 : 0;
            const courseTitle = formatCardTitle(course.title);
            const courseAccent = getCourseColor(course, idx);

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
                    {renderEducationBookCover(course, idx, idx === safeSel && open === 1)}
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

        {/* Glossy Floor Reflection */}
        <div className="disc-mirror" aria-hidden="true">
          <ol className="disc-cases reflect">
            {courses.map((course, idx) => {
              const d = idx - safeSel;
              const ad = Math.abs(d);
              const L = d < 0 ? 1 : 0;
              const R = d > 0 ? 1 : 0;
              const C = d === 0 ? 1 : 0;
              const courseTitle = formatCardTitle(course.title);
              const courseAccent = getCourseColor(course, idx);
              const x =
                R * (firstGap + (d - 1) * sideStep) -
                L * (firstGap + (ad - 1) * sideStep) +
                C * open * openShift;
              const isWithinBounds = C === 1 || Math.abs(x) <= maxHalfReach;

              return (
                <li
                  key={`ref-${course.id}`}
                  className="disc-case"
                  style={{
                    '--disc-d': d,
                    '--disc-ad': ad,
                    '--disc-L': L,
                    '--disc-R': R,
                    '--disc-C': C,
                    '--disc-vis': isWithinBounds ? 1 : 0,
                    '--x': `${x}px`,
                    '--book-accent': courseAccent,
                  } as React.CSSProperties}
                >
                  <div className="disc-box" aria-hidden="true">
                    <div className="disc-cover">
                      {renderEducationBookCover(course, idx, false)}
                    </div>
                    <div className="disc-spine">
                      <b>{courseTitle}</b>
                      <span>{course.year}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

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
