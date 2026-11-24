'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { EducationCourse } from '@/data/education';
import { WebIcon } from '@/components/ui/WebIcon';
import { formatCardTitle, cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface EducationBookshelfViewProps {
  courses: EducationCourse[];
  getCourseColor: (course: EducationCourse, idx: number) => string;
  getShortCategoryLabel: (category: EducationCourse['category']) => string;
  isEn: boolean;
  isDark: boolean;
  onSelectCourse: (course: EducationCourse) => void;
}

const SHELF_GROUPS: Array<{
  id: EducationCourse['category'];
  labelVi: string;
  labelEn: string;
  icon: string;
}> = [
  { id: 'degree', labelVi: 'Kệ Bằng Cấp & Học Vị', labelEn: 'Degrees & Foundations', icon: 'graduation' },
  { id: 'management', labelVi: 'Kệ Quản Trị & Lãnh Đạo', labelEn: 'Management & Leadership', icon: 'briefcase' },
  { id: 'tech', labelVi: 'Kệ Công Nghệ & Hệ Thống', labelEn: 'Technology & Systems', icon: 'cpu' },
  { id: 'skills', labelVi: 'Kệ Kỹ Năng Thực Chiến', labelEn: 'Practical Skills', icon: 'sparkles' },
];

export const EducationBookshelfView: React.FC<EducationBookshelfViewProps> = ({
  courses,
  getCourseColor,
  getShortCategoryLabel,
  isEn,
  isDark,
  onSelectCourse,
}) => {
  const populatedShelves = useMemo(() => {
    return SHELF_GROUPS.map((group) => ({
      ...group,
      items: courses.filter((c) => c.category === group.id),
    })).filter((g) => g.items.length > 0);
  }, [courses]);

  return (
    <div
      id="education-bookshelf-view"
      className="w-full min-w-0 flex flex-col gap-5 pb-2 font-play"
    >
      {populatedShelves.map((shelf, shelfIdx) => (
        <section
          key={shelf.id}
          aria-label={isEn ? shelf.labelEn : shelf.labelVi}
          className="w-full min-w-0 flex flex-col gap-3"
        >
          {/* Tiêu đề tầng kệ */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div
              className="flex items-center gap-2 min-w-0"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            >
              <WebIcon name={shelf.icon} className="w-4 h-4 shrink-0" />
              <h2 className="typo-h4 font-bold truncate m-0">
                {isEn ? shelf.labelEn : shelf.labelVi}
              </h2>
            </div>
            <span
              className="typo-badge font-mono tabular-nums px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: 'var(--bg-subcard)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subcard)',
              }}
            >
              {shelf.items.length} {isEn ? 'books' : 'cuốn'}
            </span>
          </div>

          {/* Hàng sách trên kệ */}
          <div className="relative w-full min-w-0 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 px-1 sm:px-2 pb-2 items-stretch">
              {shelf.items.map((course, itemIdx) => {
                const colorIdx = shelfIdx * 4 + itemIdx;
                const cardColor = getCourseColor(course, colorIdx);
                const displayTitle = formatCardTitle(course.title);

                return (
                  <motion.button
                    key={course.id}
                    type="button"
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      SoundEngine.playBookOpen();
                      onSelectCourse(course);
                    }}
                    className={cn(
                      'bento-card glass-card group relative text-left flex flex-row items-stretch overflow-hidden rounded-[var(--radius-card,14px)] border transition-all duration-200 cursor-pointer min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2'
                    )}
                    style={{
                      background: isDark
                        ? `linear-gradient(155deg, ${cardColor}26 0%, rgba(15, 23, 42, 0.88) 100%)`
                        : `linear-gradient(155deg, ${cardColor}1A 0%, var(--bg-card, rgba(255, 255, 255, 0.86)) 100%)`,
                      borderColor: isDark ? `${cardColor}55` : 'var(--border-subcard)',
                      boxShadow: isDark
                        ? '0 10px 22px -6px rgba(2, 6, 23, 0.6)'
                        : '0 10px 20px -6px rgba(15, 23, 42, 0.14)',
                    }}
                  >
                    {/* Gáy sách (Book Spine) */}
                    <div
                      aria-hidden="true"
                      className="w-3 sm:w-3.5 shrink-0 flex flex-col items-center justify-between py-2.5"
                      style={{
                        background: `linear-gradient(180deg, ${cardColor} 0%, ${cardColor}CC 100%)`,
                        boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.18), inset 1px 0 2px rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/75" />
                      <span className="w-1 h-8 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/75" />
                    </div>

                    {/* Bìa & thông tin sách */}
                    <div className="flex-1 min-w-0 p-2.5 flex flex-col justify-between gap-2">
                      <div
                        data-media-card="image"
                        className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden border"
                        style={{
                          borderColor: 'var(--border-subcard)',
                          background: 'var(--bg-subcard)',
                        }}
                      >
                        <img
                          src={course.image}
                          alt={displayTitle}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between gap-1 text-white">
                          <span className="typo-badge font-mono font-semibold tabular-nums">
                            {course.year}
                          </span>
                          <span className="typo-badge font-semibold px-1.5 py-0.5 rounded-full bg-black/45 backdrop-blur-xs truncate max-w-[68%]">
                            {getShortCategoryLabel(course.category)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <h3
                          className="typo-body-sm font-bold leading-snug line-clamp-2 break-words m-0"
                          style={{ color: 'var(--text-primary)' }}
                          title={displayTitle}
                        >
                          {displayTitle}
                        </h3>
                        <span
                          className="typo-caption truncate"
                          style={{ color: 'var(--text-secondary)' }}
                          title={course.issuer}
                        >
                          {course.issuer}
                        </span>
                      </div>

                      <div
                        className="pt-1.5 mt-auto border-t flex items-center justify-between gap-2"
                        style={{ borderColor: 'var(--border-subcard)' }}
                      >
                        <span
                          className="typo-badge font-semibold truncate"
                          style={{ color: cardColor }}
                        >
                          {course.code}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 typo-badge font-semibold shrink-0"
                          style={{ color: 'var(--text-link, var(--color-primary))' }}
                        >
                          <WebIcon name="book-open" className="w-3 h-3" />
                          <span>{isEn ? 'Read' : 'Mở sách'}</span>
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Thanh kệ sách (Bookshelf Plank) */}
            <div
              aria-hidden="true"
              className="w-full h-3 rounded-full border shadow-md"
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, rgba(120, 82, 54, 0.85) 0%, rgba(58, 34, 20, 0.95) 55%, rgba(28, 16, 9, 0.98) 100%)'
                  : 'linear-gradient(180deg, rgba(214, 174, 130, 0.88) 0%, rgba(168, 120, 76, 0.92) 55%, rgba(124, 82, 46, 0.96) 100%)',
                borderColor: isDark ? 'rgba(245, 196, 120, 0.28)' : 'rgba(120, 72, 34, 0.28)',
              }}
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default EducationBookshelfView;
