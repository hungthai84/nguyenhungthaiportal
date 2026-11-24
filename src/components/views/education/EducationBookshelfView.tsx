'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EducationCourse } from '@/data/education';
import { formatCardTitle } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';

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
  isDark,
  onSelectCourse,
}) => {
  const [sel, setSel] = useState<number>(0);
  const [open, setOpen] = useState<number>(0);
  const [shelfSize, setShelfSize] = useState<{ width: number; height: number }>({ width: 760, height: 320 });
  const shelfRef = useRef<HTMLElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
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

  // Measure shelf dimensions to keep 3D books cleanly bounded within 25px card inset
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
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const bookSize = Math.round(
    Math.max(84, Math.min(186, shelfSize.height * 0.62, shelfSize.width * 0.24))
  );
  const firstGap = Math.round(bookSize * 0.86);
  const sideStep = Math.max(20, Math.round(bookSize * 0.22));
  const openShift = Math.round(bookSize * 0.22);
  const maxHalfReach = Math.max(80, shelfSize.width / 2 - bookSize * 0.32);

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
    sel0Ref.current = safeSel;
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartXRef.current === null || open === 1) return;
    const deltaX = clientX - dragStartXRef.current;
    const step = Math.round(-deltaX / 64);
    const newSel = Math.max(0, Math.min(lastIdx, sel0Ref.current + step));
    if (newSel !== safeSel) {
      setSel(newSel);
    }
  };

  const handleDragEnd = () => {
    dragStartXRef.current = null;
  };

  return (
    <div
      id="education-disc-bookshelf-view"
      className="disc-library w-full min-w-0 flex-1 min-h-0 h-full max-h-full flex flex-col items-center justify-between font-play box-border"
      style={{
        '--disc-sel': safeSel,
        '--disc-open': open,
        '--last': lastIdx,
        '--W': `${bookSize}px`,
        '--H': `${bookSize}px`,
      } as React.CSSProperties}
    >
      {/* Background Backdrops */}
      <div className="disc-backdrops" aria-hidden="true">
        {courses.map((course, idx) => (
          <div
            key={course.id}
            style={{
              '--bg-img': `url('${course.image}')`,
              opacity: idx === safeSel ? 1 : 0,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Top Bar */}
      <header className="disc-top w-full flex items-center justify-between">
        <p className="disc-brand flex items-center gap-2">
          <i aria-hidden="true" />
          <span>{isEn ? '3D Interactive Bookshelf' : 'Kệ Sách 3D Tương Tác'}</span>
        </p>
        <p className="disc-count">
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

            const x =
              R * (firstGap + (d - 1) * sideStep) -
              L * (firstGap + (ad - 1) * sideStep) +
              C * open * openShift;
            const isWithinBounds = C === 1 || Math.abs(x) <= maxHalfReach;

            return (
              <li
                key={course.id}
                className="disc-case"
                style={{
                  '--disc-d': d,
                  '--disc-ad': ad,
                  '--disc-L': L,
                  '--disc-R': R,
                  '--disc-C': C,
                  '--disc-vis': isWithinBounds ? 1 : 0,
                  '--x': `${x}px`,
                  zIndex: C ? 10 : 10 - ad,
                  pointerEvents: isWithinBounds ? 'auto' : 'none',
                } as React.CSSProperties}
                onClick={() => {
                  if (open === 0) {
                    setSel(idx);
                    setOpen(1);
                    SoundEngine.playBookOpen?.();
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
                    <div className="disc-out">
                      {idx === safeSel && open === 1 && <div className="disc-glint" />}
                      <img src={course.image} alt="" loading={idx === safeSel ? 'eager' : 'lazy'} />
                      <i className="disc-hinge" />
                      <p className="disc-art">
                        <b>{courseTitle}</b>
                        <span>{course.issuer}</span>
                      </p>
                    </div>
                    <div className="disc-in">
                      <p className="disc-notes-title">{courseTitle}</p>
                      <ol>
                        <li>
                          <span>{course.code}</span>
                          <small>{course.year}</small>
                        </li>
                        <li>
                          <span>{course.issuer}</span>
                          <small>{getShortCategoryLabel(course.category)}</small>
                        </li>
                      </ol>
                      <p className="text-xs opacity-70 mt-2">{course.desc}</p>
                    </div>
                  </div>
                  <div className="disc-spine">
                    <b>{courseTitle}</b>
                    <span>{course.year}</span>
                  </div>
                  <div className="disc-edge" />
                  <div className="disc-lid" />
                  <div className="disc-base" />
                  <div className="disc-tray">
                    <div className="disc-item-disc">
                      <img src={course.image} alt="" />
                      <i style={idx === safeSel && open === 1 ? { animation: 'discSpin 5s linear infinite' } : undefined} />
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
                  } as React.CSSProperties}
                >
                  <div className="disc-box" aria-hidden="true">
                    <div className="disc-cover">
                      <div className="disc-out">
                        <img src={course.image} alt="" />
                      </div>
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
            if (open === 0) {
              setOpen(1);
              SoundEngine.playBookOpen?.();
            } else {
              onSelectCourse(currentCourse);
            }
          }}
          aria-label={open === 0 ? 'Open book' : 'View book details'}
        />
      </section>

      {/* Active Titles Section */}
      <div className="disc-titles" aria-live="polite">
        <div className="disc-title-item">
          <h3>{displayTitle}</h3>
          <p>
            {currentCourse?.issuer} · {currentCourse?.year} · {getShortCategoryLabel(currentCourse?.category)}
          </p>
        </div>
      </div>

      {/* Key Bar / Hints */}
      <footer className="disc-keys" aria-hidden="true">
        <span>
          <kbd>←</kbd> <kbd>→</kbd> {isEn ? 'Browse' : 'Duyệt'}
        </span>
        {open === 0 ? (
          <span>
            <kbd>Enter</kbd> {isEn ? 'Open' : 'Mở sách'}
          </span>
        ) : (
          <span>
            <kbd>Esc</kbd> {isEn ? 'Close' : 'Đóng'}
          </span>
        )}
      </footer>
    </div>
  );
};

export default EducationBookshelfView;
