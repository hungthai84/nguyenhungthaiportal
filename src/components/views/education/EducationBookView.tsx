'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn, formatCardTitle } from '@/lib/utils';
import {
  CREDENTIAL_VERIFICATION_MAP,
  EducationCourse,
} from '@/data/education';

export interface EducationBookViewProps {
  course: EducationCourse;
  courseColor: string;
  categoryLabel: string;
  isEn: boolean;
  isDark: boolean;
  getSkillTagIcon: (tag: string) => string;
  onClose: () => void;
  onNavigateSkillToSwot: (skill: string) => void;
  onOpenVerifyModal: (course: EducationCourse, e?: React.MouseEvent) => void;
  onOpenLightbox: (imgSrc: string, title: string, e?: React.MouseEvent) => void;
  disableKeyboardNav?: boolean;
}

type BookPageId = 0 | 1 | 2 | 3 | 4;

interface BookPageMeta {
  id: BookPageId;
  shortLabel: string;
  fullLabel: string;
  icon: string;
}

const BOOK_PAGES: BookPageMeta[] = [
  { id: 0, shortLabel: 'Bìa', fullLabel: 'Bìa · Thẻ học vấn', icon: 'book' },
  { id: 1, shortLabel: 'Trang 1', fullLabel: 'Trang 1 · Mô tả khóa học', icon: 'book-open' },
  { id: 2, shortLabel: 'Trang 2', fullLabel: 'Trang 2 · Danh mục khóa học', icon: 'list-filter' },
  { id: 3, shortLabel: 'Trang 3', fullLabel: 'Trang 3 · Kết quả đạt được', icon: 'trophy' },
  { id: 4, shortLabel: 'Trang 4', fullLabel: 'Trang 4 · Hình khóa học & Bằng cấp', icon: 'image' },
];

const BOOK_PAGES_EN: BookPageMeta[] = [
  { id: 0, shortLabel: 'Cover', fullLabel: 'Cover · Course Card', icon: 'book' },
  { id: 1, shortLabel: 'Page 1', fullLabel: 'Page 1 · Course Description', icon: 'book-open' },
  { id: 2, shortLabel: 'Page 2', fullLabel: 'Page 2 · Curriculum & Skills', icon: 'list-filter' },
  { id: 3, shortLabel: 'Page 3', fullLabel: 'Page 3 · Outcomes & Results', icon: 'trophy' },
  { id: 4, shortLabel: 'Page 4', fullLabel: 'Page 4 · Course & Certificate Photos', icon: 'image' },
];

function handleDriveImageFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  const currentSrc = img.getAttribute('src') || '';
  const match = currentSrc.match(/lh3\.googleusercontent\.com\/d\/([^/?]+)/);
  if (match && match[1]) {
    img.onerror = null;
    img.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920`;
  }
}

export const EducationBookView: React.FC<EducationBookViewProps> = ({
  course,
  courseColor,
  categoryLabel,
  isEn,
  isDark,
  getSkillTagIcon,
  onClose,
  onNavigateSkillToSwot,
  onOpenVerifyModal,
  onOpenLightbox,
  disableKeyboardNav = false,
}) => {
  const [pageIndex, setPageIndex] = useState<BookPageId>(0);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pageScrollRef = useRef<HTMLDivElement | null>(null);

  const pages = isEn ? BOOK_PAGES_EN : BOOK_PAGES;
  const activePageMeta = pages[pageIndex];
  const verifyInfo = CREDENTIAL_VERIFICATION_MAP[course.id];

  // Reset về trang Bìa mỗi khi chọn khóa học mới
  useEffect(() => {
    setPageIndex(0);
    setFlipDirection(1);
  }, [course.id]);

  // Cuộn về đầu trang khi lật trang mới
  useEffect(() => {
    pageScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageIndex]);

  const goToPage = (target: BookPageId) => {
    if (target === pageIndex) return;
    SoundEngine.playTap();
    setFlipDirection(target > pageIndex ? 1 : -1);
    setPageIndex(target);
  };

  const handlePrevPage = () => {
    if (pageIndex <= 0) return;
    goToPage((pageIndex - 1) as BookPageId);
  };

  const handleNextPage = () => {
    if (pageIndex >= 4) return;
    goToPage((pageIndex + 1) as BookPageId);
  };

  // Điều hướng bàn phím trái/phải
  useEffect(() => {
    if (disableKeyboardNav) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (pageIndex < 4) {
          SoundEngine.playTap();
          setFlipDirection(1);
          setPageIndex((p) => Math.min(4, p + 1) as BookPageId);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (pageIndex > 0) {
          SoundEngine.playTap();
          setFlipDirection(-1);
          setPageIndex((p) => Math.max(0, p - 1) as BookPageId);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [disableKeyboardNav, pageIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0 && pageIndex < 4) {
        handleNextPage();
      } else if (dx > 0 && pageIndex > 0) {
        handlePrevPage();
      }
    }
  };

  const pageVariants = {
    enter: (dir: 1 | -1) =>
      prefersReducedMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            rotateY: dir > 0 ? 34 : -34,
            x: dir > 0 ? 36 : -36,
            scale: 0.98,
          },
    center: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          rotateY: 0,
          x: 0,
          scale: 1,
        },
    exit: (dir: 1 | -1) =>
      prefersReducedMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            rotateY: dir > 0 ? -34 : 34,
            x: dir > 0 ? -36 : 36,
            scale: 0.98,
          },
  };

  const pageTransition = prefersReducedMotion
    ? { duration: 0.16 }
    : {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      };

  return (
    <motion.div
      id="education-book-view"
      key={`education-book-${course.id}`}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full flex-1 min-h-0 flex flex-col gap-[12px] p-[12px] sm:p-[15px] font-play text-left overflow-hidden box-border"
    >
      {/* 1. THANH ĐIỀU KHIỂN ĐẦU SÁCH */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => {
              SoundEngine.playTap();
              onClose();
            }}
            className="banner-control-pill h-9 px-3 rounded-full inline-flex items-center gap-1.5 typo-button font-semibold cursor-pointer transition-all active:scale-95 shrink-0"
            title={isEn ? 'Back to all courses' : 'Quay lại danh sách học vấn'}
            aria-label={isEn ? 'Back to all courses' : 'Quay lại danh sách học vấn'}
          >
            <WebIcon name="arrow-left" className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'All courses' : 'Danh sách'}</span>
          </button>

          <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: courseColor }}>
            <WebIcon name="book-open" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: courseColor }} />
            <h2
              className="card-title card-title-synced typo-h4 sm:typo-h3 font-play font-bold truncate m-0 p-0"
              data-card-title="true"
              style={{ color: courseColor }}
              title={formatCardTitle(course.title)}
            >
              {formatCardTitle(course.title)}
            </h2>
          </div>
        </div>

        {/* Mục lục nhanh các trang sách */}
        <div
          role="tablist"
          aria-label={isEn ? 'Book pages' : 'Mục lục trang sách'}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-0.5"
        >
          {pages.map((p) => {
            const isActive = pageIndex === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => goToPage(p.id)}
                title={p.fullLabel}
                className={cn(
                  'h-8 px-2.5 sm:px-3 rounded-full typo-badge font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border',
                  isActive
                    ? 'text-white shadow-xs'
                    : 'bg-[var(--bg-subcard)] text-[var(--text-secondary)] border-[var(--border-subcard)] hover:text-[var(--text-primary)]'
                )}
                style={
                  isActive
                    ? {
                        background: courseColor,
                        borderColor: courseColor,
                      }
                    : undefined
                }
              >
                <WebIcon name={p.icon} className="w-3.5 h-3.5 shrink-0" />
                <span>{p.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            SoundEngine.playTap();
            onClose();
          }}
          className="w-9 h-9 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] hover:bg-[var(--bg-button-primary)] hover:text-white text-[var(--text-secondary)] flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95"
          title={isEn ? 'Close book' : 'Đóng sách'}
          aria-label={isEn ? 'Close book' : 'Đóng sách'}
        >
          <WebIcon name="x" className="w-4 h-4" />
        </button>
      </div>

      {/* 2. SÂN KHẤU SÁCH LẬT 3D (PERSPECTIVE BOOK STAGE) */}
      <div
        className="relative flex-1 min-h-0 w-full flex items-stretch justify-center overflow-hidden"
        style={{ perspective: '1800px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Nút lật trang trái (Desktop) */}
        <div className="hidden md:flex items-center pr-2 shrink-0">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
            aria-label={isEn ? 'Previous page' : 'Trang trước'}
            title={isEn ? 'Previous page' : 'Trang trước'}
            className={cn(
              'w-10 h-10 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-center transition-all shadow-sm',
              pageIndex === 0
                ? 'opacity-35 cursor-not-allowed text-[var(--text-muted)]'
                : 'cursor-pointer hover:scale-105 active:scale-95 text-[var(--text-primary)]'
            )}
          >
            <WebIcon name="chevron-left" className="w-5 h-5" />
          </button>
        </div>

        {/* Khối sách chính với hiệu ứng gáy sách + xấp trang */}
        <div className="relative flex-1 min-w-0 max-w-4xl h-full min-h-0 flex items-stretch">
          {/* Hiệu ứng xấp trang dày bên mép phải khi còn trang phía sau */}
          {pageIndex < 4 && (
            <>
              <div
                aria-hidden="true"
                className="hidden sm:block absolute top-2 bottom-2 -right-1.5 w-3 rounded-r-[var(--radius-card,24px)] border border-[var(--border-card)] pointer-events-none opacity-65"
                style={{ background: 'var(--bg-subcard)' }}
              />
              <div
                aria-hidden="true"
                className="hidden sm:block absolute top-3.5 bottom-3.5 -right-3 w-3 rounded-r-[var(--radius-card,24px)] border border-[var(--border-card)] pointer-events-none opacity-40"
                style={{ background: 'var(--bg-subcard)' }}
              />
            </>
          )}

          <AnimatePresence mode="wait" custom={flipDirection}>
            <motion.article
              key={`book-page-${course.id}-${pageIndex}`}
              custom={flipDirection}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              data-element-type="card"
              data-section-card="true"
              className="bento-card glass-card relative w-full h-full min-h-0 rounded-[var(--radius-card,24px)] border shadow-lg flex overflow-hidden transform-style-3d backface-hidden"
              style={{
                borderColor: `${courseColor}55`,
                transformOrigin: flipDirection > 0 ? 'left center' : 'right center',
                boxShadow: isDark
                  ? `0 20px 50px rgba(0, 0, 0, 0.55), 0 0 28px ${courseColor}22`
                  : `0 18px 42px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
              }}
            >
              {/* Gáy sách (Book Spine) */}
              <div
                aria-hidden="true"
                className="w-3 sm:w-5 shrink-0 h-full relative"
                style={{
                  background: `linear-gradient(90deg, ${courseColor}40 0%, ${courseColor}15 55%, transparent 100%)`,
                  borderRight: `1px solid ${courseColor}30`,
                }}
              >
                <div
                  className="absolute inset-y-0 right-0 w-[2px] opacity-35"
                  style={{ background: isDark ? '#000000' : '#0f172a' }}
                />
              </div>

              {/* Nội dung từng trang */}
              <div
                ref={pageScrollRef}
                className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden glass-scrollbar p-[15px] sm:p-6 flex flex-col gap-[15px]"
              >
                {/* ================= BÌA SÁCH (PAGE 0): THẺ HỌC VẤN ================= */}
                {pageIndex === 0 && (
                  <div className="flex-1 flex flex-col justify-between gap-[15px] min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-semibold border"
                        style={{
                          backgroundColor: `${courseColor}18`,
                          borderColor: `${courseColor}45`,
                          color: courseColor,
                        }}
                      >
                        <WebIcon name="book" className="w-3.5 h-3.5 shrink-0" />
                        <span>{isEn ? 'Book Cover · Education Card' : 'Bìa sách · Thẻ học vấn'}</span>
                      </span>
                      <span className="typo-badge font-mono px-2.5 py-1 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-secondary)]">
                        {course.code || `Năm ${course.year}`}
                      </span>
                    </div>

                    {/* Ảnh thẻ học vấn bo cong đúng bằng card */}
                    <div
                      data-media-card="image"
                      style={{ borderRadius: 'var(--radius-card, 24px)' }}
                      className="education-card-banner themed-image-frame relative w-full aspect-[16/9] max-h-[300px] overflow-hidden bg-[var(--bg-subcard)] rounded-[var(--radius-card,24px)] border border-[var(--border-subcard)] shrink-0"
                    >
                      <img
                        src={course.image}
                        alt={formatCardTitle(course.title)}
                        style={{ borderRadius: 'var(--radius-card, 24px)' }}
                        className="w-full h-full object-cover object-center rounded-[inherit] block"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={handleDriveImageFallback}
                      />

                      {course.type && (
                        <span className="banner-control-pill absolute top-3 left-3 z-20 typo-badge px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 font-semibold max-w-[58%] truncate">
                          <WebIcon name="book" className="w-3 h-3 shrink-0" style={{ color: courseColor }} />
                          <span className="truncate">{course.type}</span>
                        </span>
                      )}

                      <span className="banner-control-pill absolute top-3 right-3 z-20 typo-badge font-mono px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 font-semibold">
                        <WebIcon name="calendar" className="w-3 h-3 shrink-0" style={{ color: courseColor }} />
                        <span>Năm {course.year}</span>
                      </span>

                      <span className="banner-control-pill absolute bottom-3 left-3 z-20 typo-badge px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 font-semibold max-w-[calc(100%-24px)] truncate">
                        <WebIcon name="graduation-cap" className="w-3 h-3 shrink-0" style={{ color: courseColor }} />
                        <span className="truncate">{course.issuer}</span>
                      </span>
                    </div>

                    {/* Tiêu đề & tóm tắt bìa sách */}
                    <div className="flex flex-col gap-2.5 min-w-0">
                      <div className="card-header-sync flex items-start gap-2.5 min-w-0" style={{ color: courseColor }}>
                        <WebIcon name="award" className="w-5 h-5 shrink-0 mt-1" style={{ color: courseColor }} />
                        <h3
                          className="card-title card-title-synced typo-h2 font-play font-bold m-0 p-0 break-words flex-1 min-w-0"
                          data-card-title="true"
                          style={{ color: courseColor }}
                        >
                          {formatCardTitle(course.title)}
                        </h3>
                      </div>

                      <p className="typo-body-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                        {course.desc || 'Thông tin chưa được cung cấp.'}
                      </p>

                      {course.result && (
                        <div
                          className="p-3 rounded-[var(--radius-subcard,16px)] border flex items-start gap-2.5 min-w-0"
                          style={{
                            backgroundColor: `${courseColor}12`,
                            borderColor: `${courseColor}38`,
                          }}
                        >
                          <WebIcon name="award" className="w-4 h-4 shrink-0 mt-0.5" style={{ color: courseColor }} />
                          <p className="typo-body-sm font-semibold m-0 break-words" style={{ color: courseColor }}>
                            {course.result}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CTA mở sách sang Trang 1 */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subcard)]">
                      <span className="typo-caption font-medium" style={{ color: 'var(--text-muted)' }}>
                        {isEn
                          ? 'Flip through pages 1–4 for full curriculum, outcomes & certificate.'
                          : 'Lật từ Trang 1 đến Trang 4 để xem chi tiết mô tả, danh mục, kết quả & bằng cấp.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => goToPage(1)}
                        className="px-4 py-2 rounded-full typo-button font-semibold text-white inline-flex items-center gap-2 shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer shrink-0"
                        style={{ background: courseColor }}
                      >
                        <span>{isEn ? 'Open Page 1' : 'Mở sách · Trang 1'}</span>
                        <WebIcon name="arrow-right" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= TRANG 1: THÔNG TIN MÔ TẢ KHÓA HỌC ================= */}
                {pageIndex === 1 && (
                  <div className="flex-1 flex flex-col gap-[15px] min-w-0">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] flex-wrap">
                      <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: courseColor }}>
                        <WebIcon name="book-open" className="w-5 h-5 shrink-0" style={{ color: courseColor }} />
                        <h3
                          className="card-title card-title-synced typo-h3 font-play font-bold m-0 p-0 break-words"
                          data-card-title="true"
                          style={{ color: courseColor }}
                        >
                          {isEn ? 'Page 1 · Course Description' : 'Trang 1 · Thông tin mô tả khóa học'}
                        </h3>
                      </div>
                      <span className="typo-badge font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-secondary)]">
                        1 / 4
                      </span>
                    </div>

                    <div className="p-4 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-3">
                      <h4 className="typo-h3 font-play font-bold m-0" style={{ color: 'var(--text-primary)' }}>
                        {formatCardTitle(course.title)}
                      </h4>
                      <p className="typo-body leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                        {course.desc || 'Thông tin chưa được cung cấp.'}
                      </p>

                      {course.orientation && course.orientation !== course.desc && (
                        <div className="pt-2 border-t border-[var(--border-subcard)] flex flex-col gap-1">
                          <span className="typo-caption font-semibold" style={{ color: courseColor }}>
                            Định hướng đào tạo
                          </span>
                          <p className="typo-body-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                            {course.orientation}
                          </p>
                        </div>
                      )}

                      {course.focus && (
                        <div className="pt-2 border-t border-[var(--border-subcard)] flex flex-col gap-1">
                          <span className="typo-caption font-semibold" style={{ color: courseColor }}>
                            Trọng tâm chuyên môn
                          </span>
                          <p className="typo-body-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                            {course.focus}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bảng thông tin chuẩn */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] min-w-0">
                      <div className="p-3.5 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                          <WebIcon name="calendar" className="w-4 h-4 shrink-0" />
                          <span className="typo-h4 font-semibold">Năm học &amp; Mã hồ sơ</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="typo-body-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Năm {course.year}
                          </span>
                          {course.code && (
                            <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 typo-badge font-mono">
                              {course.code}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                          <WebIcon name="building-2" className="w-4 h-4 shrink-0" />
                          <span className="typo-h4 font-semibold">Đơn vị đào tạo</span>
                        </div>
                        <span className="typo-body-sm font-semibold break-words" style={{ color: 'var(--text-primary)' }}>
                          {course.issuer || 'Thông tin chưa được cung cấp.'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                          <WebIcon name="layers" className="w-4 h-4 shrink-0" />
                          <span className="typo-h4 font-semibold">Hình thức đào tạo</span>
                        </div>
                        <span className="typo-body-sm font-semibold break-words" style={{ color: 'var(--text-primary)' }}>
                          {course.type || 'Thông tin chưa được cung cấp.'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                          <WebIcon name="tag" className="w-4 h-4 shrink-0" />
                          <span className="typo-h4 font-semibold">Nhóm lĩnh vực</span>
                        </div>
                        <span className="typo-body-sm font-semibold break-words" style={{ color: 'var(--text-primary)' }}>
                          {categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TRANG 2: DANH MỤC KHÓA HỌC ================= */}
                {pageIndex === 2 && (
                  <div className="flex-1 flex flex-col gap-[15px] min-w-0">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] flex-wrap">
                      <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: courseColor }}>
                        <WebIcon name="list-filter" className="w-5 h-5 shrink-0" style={{ color: courseColor }} />
                        <h3
                          className="card-title card-title-synced typo-h3 font-play font-bold m-0 p-0 break-words"
                          data-card-title="true"
                          style={{ color: courseColor }}
                        >
                          {isEn ? 'Page 2 · Course Curriculum' : 'Trang 2 · Danh mục khóa học'}
                        </h3>
                      </div>
                      <span className="typo-badge font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-secondary)]">
                        2 / 4
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 min-w-0">
                      <span className="typo-h4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Nội dung chuyên đề đào tạo ({course.modules?.length || 0} chuyên đề)
                      </span>
                      {course.modules && course.modules.length > 0 ? (
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 w-full">
                          {course.modules.map((mod, idx) => (
                            <li
                              key={idx}
                              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-subcard,14px)] bg-[var(--bg-subcard)] border border-[var(--border-subcard)] min-w-0 transition-all"
                            >
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center typo-badge font-mono font-bold shrink-0 text-white"
                                style={{ background: courseColor }}
                              >
                                {idx + 1}
                              </span>
                              <span className="typo-body-sm font-semibold flex-1 min-w-0 break-words" style={{ color: 'var(--text-primary)' }}>
                                {mod}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="typo-body-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                          Thông tin chưa được cung cấp.
                        </p>
                      )}
                    </div>

                    {/* Từ khóa kỹ năng đầu ra */}
                    <div className="pt-2 border-t border-[var(--border-subcard)] flex flex-col gap-2.5 min-w-0">
                      <div className="subcard-header-sync flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
                        <span className="subcard-title-synced typo-h4 font-semibold">
                          Từ khóa kỹ năng (Nhấn để xem trên Ma trận SWOT)
                        </span>
                      </div>
                      {course.skills && course.skills.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {course.skills.map((skill, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => onNavigateSkillToSwot(skill)}
                              title={isEn ? `View ${skill} in Core Skills SWOT` : `Xem kỹ năng "${skill}" trong Ma trận Kỹ năng SWOT`}
                              className="education-skill-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-badge cursor-pointer transition-all hover:shadow-xs active:scale-95"
                            >
                              <WebIcon name={getSkillTagIcon(skill)} className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{skill}</span>
                              <WebIcon name="arrow-right" className="w-3 h-3 opacity-60 shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="typo-body-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                          Thông tin chưa được cung cấp.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= TRANG 3: KẾT QUẢ ĐẠT ĐƯỢC ================= */}
                {pageIndex === 3 && (
                  <div className="flex-1 flex flex-col gap-[15px] min-w-0">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] flex-wrap">
                      <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: courseColor }}>
                        <WebIcon name="trophy" className="w-5 h-5 shrink-0" style={{ color: courseColor }} />
                        <h3
                          className="card-title card-title-synced typo-h3 font-play font-bold m-0 p-0 break-words"
                          data-card-title="true"
                          style={{ color: courseColor }}
                        >
                          {isEn ? 'Page 3 · Outcomes & Results' : 'Trang 3 · Kết quả đạt được'}
                        </h3>
                      </div>
                      <span className="typo-badge font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-secondary)]">
                        3 / 4
                      </span>
                    </div>

                    {/* Chứng nhận đánh giá */}
                    <div
                      className="p-4 rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2"
                      style={{
                        backgroundColor: `${courseColor}12`,
                        borderColor: `${courseColor}40`,
                      }}
                    >
                      <div className="flex items-center gap-2" style={{ color: courseColor }}>
                        <WebIcon name="shield-check" className="w-4 h-4 shrink-0" />
                        <span className="typo-h4 font-bold">Chứng nhận đánh giá</span>
                      </div>
                      <p className="typo-body font-semibold m-0 break-words" style={{ color: 'var(--text-primary)' }}>
                        {course.result || 'Thông tin chưa được cung cấp.'}
                      </p>
                    </div>

                    {/* Ứng dụng thực tiễn */}
                    <div className="p-4 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                        <WebIcon name="target" className="w-4 h-4 shrink-0" />
                        <span className="typo-h4 font-bold">Ứng dụng thực tiễn</span>
                      </div>
                      <p className="typo-body-sm leading-relaxed m-0 break-words" style={{ color: 'var(--text-secondary)' }}>
                        {course.application || 'Thông tin chưa được cung cấp.'}
                      </p>
                    </div>

                    {/* Hồ sơ xác thực chứng chỉ số */}
                    {verifyInfo && (
                      <div className="p-4 rounded-[var(--radius-subcard,16px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <WebIcon name="check-circle-02" className="w-4 h-4 shrink-0" />
                            <span className="typo-h4 font-bold">Thông tin xác thực chứng chỉ</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => onOpenVerifyModal(course, e)}
                            className="px-3 py-1.5 rounded-full typo-badge font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <WebIcon name="shield-check" className="w-3.5 h-3.5" />
                            <span>Tra cứu chứng chỉ số</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 typo-body-sm">
                          <div>
                            <span className="block typo-caption" style={{ color: 'var(--text-muted)' }}>Mã chứng chỉ số</span>
                            <code className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {verifyInfo.credentialId}
                            </code>
                          </div>
                          <div>
                            <span className="block typo-caption" style={{ color: 'var(--text-muted)' }}>Hệ thống đăng ký</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {verifyInfo.registryName}
                            </span>
                          </div>
                          <div>
                            <span className="block typo-caption" style={{ color: 'var(--text-muted)' }}>Tổ chức cấp</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {verifyInfo.organization}
                            </span>
                          </div>
                          <div>
                            <span className="block typo-caption" style={{ color: 'var(--text-muted)' }}>Trạng thái</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {verifyInfo.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= TRANG 4: HÌNH KHÓA HỌC VÀ HÌNH BẰNG CẤP ================= */}
                {pageIndex === 4 && (
                  <div className="flex-1 flex flex-col gap-[15px] min-w-0">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] flex-wrap">
                      <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: courseColor }}>
                        <WebIcon name="image" className="w-5 h-5 shrink-0" style={{ color: courseColor }} />
                        <h3
                          className="card-title card-title-synced typo-h3 font-play font-bold m-0 p-0 break-words"
                          data-card-title="true"
                          style={{ color: courseColor }}
                        >
                          {isEn ? 'Page 4 · Course & Certificate Photos' : 'Trang 4 · Hình khóa học và hình bằng cấp'}
                        </h3>
                      </div>
                      <span className="typo-badge font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-secondary)]">
                        4 / 4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch min-w-0">
                      {/* Hình khóa học */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) =>
                          onOpenLightbox(
                            course.courseImg || course.image,
                            `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${formatCardTitle(course.title)}`,
                            e
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onOpenLightbox(
                              course.courseImg || course.image,
                              `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${formatCardTitle(course.title)}`
                            );
                          }
                        }}
                        className="p-3.5 rounded-[var(--radius-card,20px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-2.5 cursor-pointer group/photo transition-all hover:shadow-md min-w-0"
                      >
                        <div className="flex items-center justify-between gap-2 text-purple-600 dark:text-purple-400">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <WebIcon name="image" className="w-4 h-4 shrink-0" />
                            <span className="typo-h4 font-semibold truncate">Hình ảnh khóa học</span>
                          </div>
                          <span className="typo-badge inline-flex items-center gap-1 group-hover/photo:underline shrink-0">
                            <WebIcon name="maximize" className="w-3.5 h-3.5" />
                            <span>Phóng to</span>
                          </span>
                        </div>
                        <div
                          data-media-card="image"
                          style={{ borderRadius: 'var(--radius-card, 20px)' }}
                          className="relative aspect-[16/10] w-full rounded-[var(--radius-card,20px)] overflow-hidden bg-slate-950/90 border border-[var(--border-subcard)]"
                        >
                          <img
                            src={course.courseImg || course.image}
                            alt={`Hình khóa học ${formatCardTitle(course.title)}`}
                            style={{ borderRadius: 'var(--radius-card, 20px)' }}
                            className="w-full h-full object-cover object-top rounded-[inherit] block"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={handleDriveImageFallback}
                          />
                        </div>
                      </div>

                      {/* Hình bằng cấp */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) =>
                          onOpenLightbox(
                            course.certImg || course.image,
                            `${isEn ? 'Certificate' : 'Hình ảnh bằng cấp'}: ${formatCardTitle(course.title)}`,
                            e
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onOpenLightbox(
                              course.certImg || course.image,
                              `${isEn ? 'Certificate' : 'Hình ảnh bằng cấp'}: ${formatCardTitle(course.title)}`
                            );
                          }
                        }}
                        className="p-3.5 rounded-[var(--radius-card,20px)] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] flex flex-col gap-2.5 cursor-pointer group/cert transition-all hover:shadow-md min-w-0"
                      >
                        <div className="flex items-center justify-between gap-2 text-rose-600 dark:text-rose-400">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <WebIcon name="award" className="w-4 h-4 shrink-0" />
                            <span className="typo-h4 font-semibold truncate">Hình ảnh bằng cấp</span>
                          </div>
                          <span className="typo-badge inline-flex items-center gap-1 group-hover/cert:underline shrink-0">
                            <WebIcon name="maximize" className="w-3.5 h-3.5" />
                            <span>Xem bằng</span>
                          </span>
                        </div>
                        <div
                          data-media-card="image"
                          style={{ borderRadius: 'var(--radius-card, 20px)' }}
                          className="relative aspect-[16/10] w-full rounded-[var(--radius-card,20px)] overflow-hidden bg-slate-950/90 border border-[var(--border-subcard)] flex items-center justify-center p-2"
                        >
                          <img
                            src={course.certImg || course.image}
                            alt={`Hình bằng cấp ${formatCardTitle(course.title)}`}
                            style={{ borderRadius: 'var(--radius-card, 20px)' }}
                            className="w-full h-full object-contain rounded-[inherit] block"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={handleDriveImageFallback}
                          />
                        </div>
                      </div>
                    </div>

                    {verifyInfo && (
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subcard)]">
                        <span className="typo-caption" style={{ color: 'var(--text-muted)' }}>
                          Mã văn bằng xác thực: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{verifyInfo.credentialId}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => onOpenVerifyModal(course, e)}
                          className="px-3.5 py-1.5 rounded-full typo-badge font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <WebIcon name="shield-check" className="w-3.5 h-3.5" />
                          <span>Kiểm tra chứng chỉ trực tuyến</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Nút lật trang phải (Desktop) */}
        <div className="hidden md:flex items-center pl-2 shrink-0">
          <button
            type="button"
            onClick={handleNextPage}
            disabled={pageIndex === 4}
            aria-label={isEn ? 'Next page' : 'Trang sau'}
            title={isEn ? 'Next page' : 'Trang sau'}
            className={cn(
              'w-10 h-10 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-center transition-all shadow-sm',
              pageIndex === 4
                ? 'opacity-35 cursor-not-allowed text-[var(--text-muted)]'
                : 'cursor-pointer hover:scale-105 active:scale-95 text-[var(--text-primary)]'
            )}
          >
            <WebIcon name="chevron-right" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. THANH LẬT TRANG CHÂN SÁCH */}
      <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-subcard)] shrink-0">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={pageIndex === 0}
          className={cn(
            'banner-control-pill h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 typo-button font-semibold transition-all',
            pageIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'
          )}
        >
          <WebIcon name="chevron-left" className="w-4 h-4 shrink-0" />
          <span>{isEn ? 'Prev' : 'Trang trước'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {pages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goToPage(p.id)}
                title={p.fullLabel}
                className={cn(
                  'h-2 rounded-full transition-all cursor-pointer',
                  pageIndex === p.id ? 'w-6' : 'w-2 opacity-40 hover:opacity-75'
                )}
                style={{
                  backgroundColor: pageIndex === p.id ? courseColor : 'var(--text-muted)',
                }}
              />
            ))}
          </div>
          <span className="hidden sm:inline typo-caption font-semibold ml-1" style={{ color: 'var(--text-secondary)' }}>
            {activePageMeta.fullLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={pageIndex === 4}
          className={cn(
            'h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 typo-button font-semibold transition-all text-white shadow-xs',
            pageIndex === 4 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:opacity-95'
          )}
          style={{
            background: pageIndex === 4 ? 'var(--bg-subcard)' : courseColor,
            color: pageIndex === 4 ? 'var(--text-muted)' : '#ffffff',
          }}
        >
          <span>{isEn ? 'Next' : 'Trang sau'}</span>
          <WebIcon name="chevron-right" className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </motion.div>
  );
};

export default EducationBookView;
