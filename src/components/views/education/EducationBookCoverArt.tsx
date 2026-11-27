import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { EducationCourse } from '@/data/education';
import { formatCardTitle } from '@/lib/utils';

export interface EducationBookCoverArtProps {
  course: EducationCourse;
  courseColor: string;
  categoryLabel: string;
  courseIconName: string;
  isEn: boolean;
  /** Compact variant used inside the 3D Bookshelf cards; full variant used inside PageFlip 3D Book */
  variant?: 'book' | 'shelf';
  /** Show subtle 3D spine shadow along left edge */
  showSpine?: boolean;
  /** Show glossy glint overlay (used by bookshelf active card) */
  showGlint?: boolean;
  /** Eager or lazy loading for banner image */
  imageLoading?: 'eager' | 'lazy';
  onImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export interface BookCoverTheme {
  /** Course-coordinated silky luminous gradient outer hardcover shell */
  shellBg: string;
  /** Bottom liquid-glass panel deep-to-radiant gradient (WCAG AAA contrast for white type) */
  bottomGradient: string;
  /** Matching 3D book spine gradient for the bookshelf carousel */
  spineGradient: string;
  /** Chromatic deep scrim for hero banner top/bottom legibility */
  scrimDeep: string;
  /** Soft chromatic atmospheric tint blending into hero artwork */
  topTint: string;
  /** Ambient colored drop shadow under floating glass panels */
  glowShadow: string;
  /** Subtle warm/cool iridescent aurora ribbon colors */
  wave1: string;
  wave2: string;
  wave3: string;
  /** Subtle highlight accent color for summary strip icon */
  accentSoft: string;
  pillIconName: string;
  pillIconColor: string;
  categoryIconName: string;
}

/**
 * 100% Vietnamese-native geometric sans-serif display & editorial family
 * (Plus Jakarta Sans includes full Vietnamese stacked diacritics, preventing ugly fallback mixing).
 */
export const BOOK_COVER_DISPLAY_FONT = '"Plus Jakarta Sans", "Play", sans-serif';
export const BOOK_COVER_BODY_FONT = '"Plus Jakarta Sans", "Play", sans-serif';

export function getBookCoverTheme(course: EducationCourse, fallbackColor: string): BookCoverTheme {
  const categoryIconMap: Record<EducationCourse['category'], string> = {
    tech: 'code',
    degree: 'graduation',
    management: 'briefcase',
    skills: 'sparkles',
  };

  const pillIconMap: Record<EducationCourse['category'], { icon: string; color: string }> = {
    tech: { icon: 'rocket', color: '#FDBA74' },
    degree: { icon: 'award', color: '#FDE047' },
    management: { icon: 'target', color: '#7DD3FC' },
    skills: { icon: 'sparkles', color: '#FDE68A' },
  };

  const categoryIconName = categoryIconMap[course.category] || 'book-open';
  const pillMeta = pillIconMap[course.category] || { icon: 'rocket', color: '#FDBA74' };

  // 14 curated jewel-toned 2-layer liquid-glass hardcover palettes keyed by course ID.
  // Calibrated for both Light & Dark environments with deep lower-stop anchoring for >= 8:1 white text contrast.
  const byCourseId: Record<
    number,
    Omit<BookCoverTheme, 'pillIconName' | 'pillIconColor' | 'categoryIconName'>
  > = {
    // 1. Thiết Kế Web — Menu Icon 0: Amber (#D97706, from-[#B45309] via-[#D97706] to-[#F59E0B])
    1: {
      shellBg:
        'radial-gradient(circle at 18% 10%, rgba(254, 243, 199, 0.72) 0%, transparent 50%), linear-gradient(155deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
      bottomGradient:
        'linear-gradient(152deg, #D97706 0%, #B45309 46%, #78350F 84%, #451A03 100%)',
      spineGradient:
        'linear-gradient(90deg, #451A03 0%, #B45309 50%, #D97706 100%)',
      scrimDeep: 'rgba(54, 22, 4, 0.80)',
      topTint: 'rgba(217, 119, 6, 0.28)',
      glowShadow: 'rgba(217, 119, 6, 0.46)',
      wave1: '#FBBF24',
      wave2: '#F59E0B',
      wave3: '#D97706',
      accentSoft: '#FDE68A',
    },
    // 2. Phân Tích Dữ Liệu — Menu Icon 1: Orange (#EA580C, from-[#C2410C] via-[#EA580C] to-[#F97316])
    2: {
      shellBg:
        'radial-gradient(circle at 82% 12%, rgba(255, 237, 213, 0.72) 0%, transparent 50%), linear-gradient(155deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
      bottomGradient:
        'linear-gradient(152deg, #EA580C 0%, #C2410C 46%, #9A3412 84%, #431407 100%)',
      spineGradient:
        'linear-gradient(90deg, #431407 0%, #C2410C 50%, #EA580C 100%)',
      scrimDeep: 'rgba(56, 18, 6, 0.80)',
      topTint: 'rgba(234, 88, 12, 0.28)',
      glowShadow: 'rgba(234, 88, 12, 0.46)',
      wave1: '#FB923C',
      wave2: '#F97316',
      wave3: '#EA580C',
      accentSoft: '#FFEDD5',
    },
    // 3. Quản Trị Rủi Ro — Menu Icon 2: Rose (#E11D48, from-[#BE123C] via-[#E11D48] to-[#F43F5E])
    3: {
      shellBg:
        'radial-gradient(circle at 16% 10%, rgba(255, 228, 230, 0.72) 0%, transparent 50%), linear-gradient(155deg, #F43F5E 0%, #E11D48 50%, #BE123C 100%)',
      bottomGradient:
        'linear-gradient(152deg, #E11D48 0%, #BE123C 46%, #881337 84%, #4C0519 100%)',
      spineGradient:
        'linear-gradient(90deg, #4C0519 0%, #BE123C 50%, #E11D48 100%)',
      scrimDeep: 'rgba(58, 8, 26, 0.80)',
      topTint: 'rgba(225, 29, 72, 0.28)',
      glowShadow: 'rgba(225, 29, 72, 0.46)',
      wave1: '#FB7185',
      wave2: '#F43F5E',
      wave3: '#E11D48',
      accentSoft: '#FFE4E6',
    },
    // 4. Quản Lý Dự Án — Menu Icon 3: Sky (#0284C7, from-[#0369A1] via-[#0284C7] to-[#0EA5E9])
    4: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(224, 242, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0284C7 0%, #0369A1 46%, #075985 84%, #082F49 100%)',
      spineGradient:
        'linear-gradient(90deg, #082F49 0%, #0369A1 50%, #0284C7 100%)',
      scrimDeep: 'rgba(6, 28, 52, 0.80)',
      topTint: 'rgba(2, 132, 199, 0.28)',
      glowShadow: 'rgba(2, 132, 199, 0.46)',
      wave1: '#38BDF8',
      wave2: '#0EA5E9',
      wave3: '#0284C7',
      accentSoft: '#BAE6FD',
    },
    // 5. Quản Lý Cấp Cao — Menu Icon 4: Emerald (#059669, from-[#047857] via-[#059669] to-[#0D9488])
    5: {
      shellBg:
        'radial-gradient(circle at 25% 10%, rgba(209, 250, 229, 0.72) 0%, transparent 50%), linear-gradient(155deg, #10B981 0%, #059669 50%, #047857 100%)',
      bottomGradient:
        'linear-gradient(152deg, #059669 0%, #047857 46%, #064E3B 84%, #022C22 100%)',
      spineGradient:
        'linear-gradient(90deg, #022C22 0%, #047857 50%, #059669 100%)',
      scrimDeep: 'rgba(4, 38, 26, 0.80)',
      topTint: 'rgba(5, 150, 105, 0.28)',
      glowShadow: 'rgba(5, 150, 105, 0.46)',
      wave1: '#34D399',
      wave2: '#10B981',
      wave3: '#059669',
      accentSoft: '#A7F3D0',
    },
    // 6. Quản Lý Cấp Trung — Menu Icon 5: Cyan (#0891B2, from-[#0E7490] via-[#0891B2] to-[#06B6D4])
    6: {
      shellBg:
        'radial-gradient(circle at 75% 15%, rgba(207, 250, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0891B2 0%, #0E7490 46%, #155E75 84%, #083344 100%)',
      spineGradient:
        'linear-gradient(90deg, #083344 0%, #0E7490 50%, #0891B2 100%)',
      scrimDeep: 'rgba(6, 36, 52, 0.80)',
      topTint: 'rgba(8, 145, 178, 0.28)',
      glowShadow: 'rgba(8, 145, 178, 0.46)',
      wave1: '#22D3EE',
      wave2: '#06B6D4',
      wave3: '#0891B2',
      accentSoft: '#A5F3FC',
    },
    // 7. Kỹ Năng Đào Tạo — Menu Icon 6: Violet (#8B5CF6, from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6])
    7: {
      shellBg:
        'radial-gradient(circle at 20% 12%, rgba(237, 233, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #8B5CF6 0%, #6D28D9 50%, #4C1D95 100%)',
      bottomGradient:
        'linear-gradient(152deg, #7C3AED 0%, #5B21B6 46%, #3B0764 84%, #1E1B4B 100%)',
      spineGradient:
        'linear-gradient(90deg, #1E1B4B 0%, #5B21B6 50%, #7C3AED 100%)',
      scrimDeep: 'rgba(28, 10, 60, 0.80)',
      topTint: 'rgba(139, 92, 246, 0.28)',
      glowShadow: 'rgba(139, 92, 246, 0.46)',
      wave1: '#A78BFA',
      wave2: '#8B5CF6',
      wave3: '#6D28D9',
      accentSoft: '#DDD6FE',
    },
    // 8. Kỹ Năng Thuyết Trình — Menu Icon 7: Teal (#0D9488, from-[#0F766E] via-[#0D9488] to-[#14B8A6])
    8: {
      shellBg:
        'radial-gradient(circle at 80% 12%, rgba(204, 251, 241, 0.72) 0%, transparent 50%), linear-gradient(155deg, #14B8A6 0%, #0D9488 50%, #0F766E 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0D9488 0%, #0F766E 46%, #115E59 84%, #042F2E 100%)',
      spineGradient:
        'linear-gradient(90deg, #042F2E 0%, #0F766E 50%, #0D9488 100%)',
      scrimDeep: 'rgba(4, 38, 36, 0.80)',
      topTint: 'rgba(13, 148, 136, 0.28)',
      glowShadow: 'rgba(13, 148, 136, 0.46)',
      wave1: '#2DD4BF',
      wave2: '#14B8A6',
      wave3: '#0D9488',
      accentSoft: '#99F6E4',
    },
    // 9. Kỹ Năng Phỏng Vấn — Menu Icon 8: Blue (#2563EB, from-[#1E40AF] via-[#2563EB] to-[#3B82F6])
    9: {
      shellBg:
        'radial-gradient(circle at 22% 10%, rgba(219, 234, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #3B82F6 0%, #2563EB 50%, #1E40AF 100%)',
      bottomGradient:
        'linear-gradient(152deg, #2563EB 0%, #1E40AF 46%, #1E3A8A 84%, #172554 100%)',
      spineGradient:
        'linear-gradient(90deg, #172554 0%, #1E40AF 50%, #2563EB 100%)',
      scrimDeep: 'rgba(8, 24, 64, 0.80)',
      topTint: 'rgba(37, 99, 235, 0.28)',
      glowShadow: 'rgba(37, 99, 235, 0.46)',
      wave1: '#60A5FA',
      wave2: '#3B82F6',
      wave3: '#2563EB',
      accentSoft: '#BFDBFE',
    },
    // 10. Kỹ Năng Tuyển Dụng — Menu Icon 9: Lime (#65A30D, from-[#3F6212] via-[#4D7C0F] to-[#65A30D])
    10: {
      shellBg:
        'radial-gradient(circle at 78% 12%, rgba(236, 252, 203, 0.72) 0%, transparent 50%), linear-gradient(155deg, #84CC16 0%, #65A30D 50%, #4D7C0F 100%)',
      bottomGradient:
        'linear-gradient(152deg, #65A30D 0%, #4D7C0F 46%, #365314 84%, #1A2E05 100%)',
      spineGradient:
        'linear-gradient(90deg, #1A2E05 0%, #4D7C0F 50%, #65A30D 100%)',
      scrimDeep: 'rgba(26, 42, 6, 0.80)',
      topTint: 'rgba(101, 163, 13, 0.28)',
      glowShadow: 'rgba(101, 163, 13, 0.46)',
      wave1: '#A3E635',
      wave2: '#84CC16',
      wave3: '#65A30D',
      accentSoft: '#D9F99D',
    },
    // 11. Cử Nhân CNTT — Menu Icon 11: Purple (#7C3AED, from-[#5B21B6] via-[#7C3AED] to-[#A78BFA])
    11: {
      shellBg:
        'radial-gradient(circle at 20% 12%, rgba(243, 232, 255, 0.72) 0%, transparent 50%), linear-gradient(155deg, #A855F7 0%, #7C3AED 50%, #5B21B6 100%)',
      bottomGradient:
        'linear-gradient(152deg, #7C3AED 0%, #5B21B6 46%, #3B0764 84%, #1E1B4B 100%)',
      spineGradient:
        'linear-gradient(90deg, #1E1B4B 0%, #5B21B6 50%, #7C3AED 100%)',
      scrimDeep: 'rgba(30, 8, 62, 0.80)',
      topTint: 'rgba(124, 58, 237, 0.28)',
      glowShadow: 'rgba(124, 58, 237, 0.46)',
      wave1: '#C084FC',
      wave2: '#A855F7',
      wave3: '#7C3AED',
      accentSoft: '#E9D5FF',
    },
    // 12. Nghiệp Vụ Tổng Đài — Menu Icon 12: Indigo (#4338CA, from-[#312E81] via-[#4338CA] to-[#6366F1])
    12: {
      shellBg:
        'radial-gradient(circle at 75% 10%, rgba(224, 231, 255, 0.72) 0%, transparent 50%), linear-gradient(155deg, #6366F1 0%, #4338CA 50%, #312E81 100%)',
      bottomGradient:
        'linear-gradient(152deg, #4338CA 0%, #312E81 46%, #1E1B4B 84%, #0F172A 100%)',
      spineGradient:
        'linear-gradient(90deg, #0F172A 0%, #312E81 50%, #4338CA 100%)',
      scrimDeep: 'rgba(18, 14, 56, 0.80)',
      topTint: 'rgba(67, 56, 202, 0.28)',
      glowShadow: 'rgba(67, 56, 202, 0.46)',
      wave1: '#818CF8',
      wave2: '#6366F1',
      wave3: '#4338CA',
      accentSoft: '#C7D2FE',
    },
    // 13. Quản Trị Mạng CCNA — Menu Icon 13: Electric Sky (#0EA5E9, from-[#0284C7] via-[#0EA5E9] to-[#38BDF8])
    13: {
      shellBg:
        'radial-gradient(circle at 25% 15%, rgba(224, 242, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #38BDF8 0%, #0EA5E9 50%, #0284C7 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0EA5E9 0%, #0284C7 46%, #0369A1 84%, #082F49 100%)',
      spineGradient:
        'linear-gradient(90deg, #082F49 0%, #0284C7 50%, #0EA5E9 100%)',
      scrimDeep: 'rgba(6, 32, 58, 0.80)',
      topTint: 'rgba(14, 165, 233, 0.28)',
      glowShadow: 'rgba(14, 165, 233, 0.46)',
      wave1: '#7DD3FC',
      wave2: '#38BDF8',
      wave3: '#0EA5E9',
      accentSoft: '#BAE6FD',
    },
    // 14. Quản Trị Máy Chủ MCSA — Menu Icon 14: Crimson Rose (#F43F5E, from-[#BE123C] via-[#E11D48] to-[#FB7185])
    14: {
      shellBg:
        'radial-gradient(circle at 80% 12%, rgba(255, 228, 230, 0.72) 0%, transparent 50%), linear-gradient(155deg, #FB7185 0%, #F43F5E 50%, #BE123C 100%)',
      bottomGradient:
        'linear-gradient(152deg, #F43F5E 0%, #BE123C 46%, #881337 84%, #4C0519 100%)',
      spineGradient:
        'linear-gradient(90deg, #4C0519 0%, #BE123C 50%, #F43F5E 100%)',
      scrimDeep: 'rgba(58, 6, 24, 0.80)',
      topTint: 'rgba(244, 63, 94, 0.28)',
      glowShadow: 'rgba(244, 63, 94, 0.46)',
      wave1: '#FDA4AF',
      wave2: '#FB7185',
      wave3: '#F43F5E',
      accentSoft: '#FECDD3',
    },
  };

  const chosen = byCourseId[course.id] || {
    shellBg: `linear-gradient(155deg, color-mix(in srgb, ${fallbackColor} 58%, #E0F2FE) 0%, ${fallbackColor} 54%, color-mix(in srgb, ${fallbackColor} 55%, #0F172A) 100%)`,
    bottomGradient: `linear-gradient(152deg, color-mix(in srgb, ${fallbackColor} 88%, #0F172A) 0%, color-mix(in srgb, ${fallbackColor} 65%, #0F172A) 54%, #0F172A 100%)`,
    spineGradient: `linear-gradient(90deg, #0F172A 0%, color-mix(in srgb, ${fallbackColor} 72%, #0F172A) 52%, #0F172A 100%)`,
    scrimDeep: 'rgba(7, 18, 46, 0.80)',
    topTint: `color-mix(in srgb, ${fallbackColor} 28%, transparent)`,
    glowShadow: `color-mix(in srgb, ${fallbackColor} 44%, transparent)`,
    wave1: '#22D3EE',
    wave2: '#FACC15',
    wave3: '#F472B6',
    accentSoft: '#BAE6FD',
  };

  return {
    ...chosen,
    categoryIconName,
    pillIconName: pillMeta.icon,
    pillIconColor: pillMeta.color,
  };
}

export const EducationBookCoverArt: React.FC<EducationBookCoverArtProps> = ({
  course,
  courseColor,
  categoryLabel,
  courseIconName,
  isEn,
  variant = 'book',
  showSpine = true,
  showGlint = false,
  imageLoading = 'eager',
  onImageError,
}) => {
  const cleanTitle = formatCardTitle(course.title);
  const theme = getBookCoverTheme(course, courseColor);
  const rawLeft = (course.type || categoryLabel).trim();
  const rawRight = (course.issuer || categoryLabel).trim();

  // Deduplicate subtitle cleanly so "Tự học phát triển · Tự học phát triển" never occurs
  const subtitleLeft = rawLeft;
  const subtitleRight =
    rawRight.toLowerCase() === rawLeft.toLowerCase()
      ? categoryLabel.toLowerCase() === rawLeft.toLowerCase()
        ? course.code || `${course.year}`
        : categoryLabel
      : rawRight;

  const summaryText = course.result || course.desc;
  const isShelf = variant === 'shelf';
  const titleLen = cleanTitle.length;
  const titleFontSize =
    titleLen <= 14 ? '7.1cqw' : titleLen <= 19 ? '6.4cqw' : '5.7cqw';

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (onImageError) {
      onImageError(e);
      return;
    }
    const img = e.currentTarget;
    const currentSrc = img.getAttribute('src') || '';
    const match = currentSrc.match(/lh3\.googleusercontent\.com\/d\/([^/?]+)/);
    if (match && match[1]) {
      img.onerror = null;
      img.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920`;
    }
  };

  return (
    <div
      className="education-book-cover relative flex size-full flex-col items-stretch justify-between select-none overflow-hidden box-border text-white"
      style={{
        background: theme.shellBg,
        borderRadius: 'var(--radius-global, var(--radius-primary-surface, var(--radius-card, 14px)))',
        padding: '15px',
        gap: isShelf ? '10px' : '12px',
        containerType: 'inline-size',
        fontFamily: BOOK_COVER_BODY_FONT,
        color: '#FFFFFF',
        boxShadow: `0 18px 36px -14px rgba(2, 8, 28, 0.38), 0 8px 20px -10px ${theme.glowShadow}`,
      }}
    >
      {/* Full-bleed diffused ambient backdrop derived directly from the book cover image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src={course.image}
          alt=""
          loading={imageLoading}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className="absolute inset-[-18%] w-[136%] h-[136%] max-w-none object-cover object-center scale-110 select-none"
          style={{
            filter: 'blur(26px) saturate(1.55) brightness(0.75)',
            transform: 'scale(1.16)',
            opacity: 0.65,
          }}
        />
        {/* Smooth ambient tonal gradient radiating down from the hero image for crisp text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6, 12, 28, 0.12) 0%, rgba(6, 12, 28, 0.30) 46%, rgba(4, 9, 22, 0.70) 100%)',
          }}
        />
      </div>

      {/* Seamless studio overhead sheen across the entire frameless hardcover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 92% 44% at 22% 4%, rgba(255, 255, 255, 0.22) 0%, transparent 62%), radial-gradient(ellipse 68% 48% at 86% 88%, rgba(255, 255, 255, 0.10) 0%, transparent 58%)',
        }}
      />

      {/* Realistic hardcover left French-groove hinge crease */}
      {showSpine && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[3.6cqw]"
          style={{
            background:
              'linear-gradient(90deg, rgba(4, 10, 28, 0.24) 0%, rgba(4, 10, 28, 0.08) 42%, rgba(255, 255, 255, 0.16) 60%, transparent 100%)',
          }}
        />
      )}

      {showGlint && <div className="disc-glint" />}

      {/* ================= TIER 1 (~56%): FRAMELESS FULL-BLEED HERO BANNER ================= */}
      <div
        className="education-book-cover-banner-frame relative z-10 w-full flex-[1.28_1_0%] min-h-0 overflow-hidden box-border"
        style={{
          borderRadius: 'calc(max(4px, var(--radius-global, 14px) - 2px))',
          border: 'none',
          boxShadow: '0 10px 24px -10px rgba(2, 8, 28, 0.36)',
          background: 'transparent',
          padding: 0,
        }}
      >
        {/* Full-bleed unique course artwork */}
        <img
          src={course.image}
          alt={cleanTitle}
          className="education-book-cover-banner-img absolute inset-0 w-full h-full object-cover object-center block"
          loading={imageLoading}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImgError}
        />

        {/* Measured top edge scrim — keeps middle artwork unobstructed */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[28%]"
          style={{
            background: `linear-gradient(180deg, ${theme.scrimDeep} 0%, ${theme.topTint} 58%, transparent 100%)`,
          }}
        />

        {/* Measured bottom edge scrim for crisp issuer & year metadata */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%]"
          style={{
            background: `linear-gradient(0deg, ${theme.scrimDeep} 0%, ${theme.topTint} 58%, transparent 100%)`,
          }}
        />

        {/* Top Unboxed Metadata Row: Category | Course Code */}
        <div
          className="absolute top-[3cqw] left-[3.6cqw] right-[3.6cqw] z-10 flex items-center justify-between gap-[2cqw] text-white"
          style={{ fontFamily: BOOK_COVER_BODY_FONT }}
        >
          <span className="inline-flex items-center gap-[1.4cqw] min-w-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.72)]">
            <WebIcon
              name={theme.categoryIconName}
              className="w-[3.4cqw] h-[3.4cqw] shrink-0 text-white/95"
            />
            <span className="font-semibold text-[3.1cqw] leading-none tracking-[0.01em] truncate">
              {categoryLabel}
            </span>
          </span>

          <span className="inline-flex items-center gap-[1.2cqw] shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.72)]">
            <WebIcon
              name="calendar"
              className="w-[2.9cqw] h-[2.9cqw] shrink-0 text-white/85"
            />
            <span className="font-bold text-[2.9cqw] leading-none tabular-nums tracking-[0.04em] text-white/95">
              {course.code || `Y-${course.year}`}
            </span>
          </span>
        </div>

        {/* Bottom Unboxed Metadata Row: Issuer | Year */}
        <div
          className="absolute bottom-[2.8cqw] left-[3.6cqw] right-[3.6cqw] z-10 flex items-center justify-between gap-[2cqw] text-white"
          style={{ fontFamily: BOOK_COVER_BODY_FONT }}
        >
          <span className="inline-flex items-center gap-[1.4cqw] min-w-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.78)]">
            <WebIcon
              name="graduation"
              className="w-[3.7cqw] h-[3.7cqw] shrink-0 text-white/95"
            />
            <span className="font-semibold text-[3.05cqw] leading-none truncate">
              {course.issuer}
            </span>
          </span>

          <span className="font-bold text-[3.05cqw] leading-none tabular-nums tracking-[0.02em] text-white/95 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.78)]">
            {isEn ? `${course.year}` : `Năm ${course.year}`}
          </span>
        </div>
      </div>

      {/* ================= TIER 2 (~44%): FRAMELESS EDITORIAL TYPOGRAPHY & CUE ================= */}
      <div
        className="relative z-10 w-full flex-[1_1_0%] min-h-0 overflow-hidden flex flex-col items-center justify-between text-center box-border text-white"
        style={{
          background: 'transparent',
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: isShelf ? '2px 2px 0' : '4px 4px 0',
          fontFamily: BOOK_COVER_BODY_FONT,
          color: '#FFFFFF',
        }}
      >
        {/* Display Title & Clean Unboxed Subtitle */}
        <div className="relative z-10 w-full flex flex-col items-center gap-[1.4cqw] min-w-0">
          <h3
            className="font-extrabold m-0 flex items-center justify-center gap-[2cqw] max-w-full text-white drop-shadow-[0_2px_8px_rgba(2,8,28,0.52)]"
            style={{
              fontFamily: BOOK_COVER_DISPLAY_FONT,
              fontSize: titleFontSize,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              textWrap: 'balance',
              color: '#FFFFFF',
            }}
          >
            <WebIcon
              name={courseIconName}
              className="w-[5.6cqw] h-[5.6cqw] shrink-0 text-white/95 drop-shadow-[0_1px_6px_rgba(2,8,28,0.34)]"
              style={{ color: theme.accentSoft || '#FFFFFF' }}
            />
            <span className="line-clamp-2 text-center text-white">{cleanTitle}</span>
          </h3>

          <p
            className="font-medium text-[3.1cqw] leading-snug text-white/88 m-0 flex items-center justify-center gap-[1.6cqw] max-w-full truncate tracking-[0.01em] drop-shadow-[0_1px_4px_rgba(2,8,28,0.42)]"
            style={{
              fontFamily: BOOK_COVER_BODY_FONT,
              color: 'rgba(255, 255, 255, 0.88)',
            }}
          >
            <span className="truncate">{subtitleLeft}</span>
            <span aria-hidden="true" className="opacity-65 font-bold shrink-0 text-white/60">
              ·
            </span>
            <span className="truncate tabular-nums">{subtitleRight}</span>
          </p>
        </div>

        {/* Frameless Summary Line */}
        {summaryText && (
          <div className="relative z-10 w-full flex items-center justify-center gap-[2cqw] px-[1.5cqw] min-w-0">
            <WebIcon
              name={theme.pillIconName}
              className="w-[3.6cqw] h-[3.6cqw] shrink-0 text-white/95"
              style={{ color: theme.accentSoft || '#FFFFFF' }}
            />
            <span
              className={`min-w-0 text-left font-medium text-[2.95cqw] leading-[1.38] text-white/92 drop-shadow-[0_1px_4px_rgba(2,8,28,0.42)] ${
                isShelf ? 'truncate' : 'line-clamp-2'
              }`}
              style={{
                fontFamily: BOOK_COVER_BODY_FONT,
                color: 'rgba(255, 255, 255, 0.92)',
              }}
            >
              {summaryText}
            </span>
          </div>
        )}

        {/* Single Clean Action Cue with Flanking Hairline Rules */}
        <div className="relative z-10 w-full flex items-center justify-center gap-[2.2cqw] px-[1cqw] pb-[0.6cqw]">
          <span
            aria-hidden="true"
            className="h-[1px] flex-1 max-w-[14cqw]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.52) 100%)',
            }}
          />
          <span
            className="inline-flex items-center gap-[1.4cqw] font-semibold text-[3cqw] tracking-[0.02em] whitespace-nowrap text-white drop-shadow-[0_1px_5px_rgba(2,10,32,0.55)]"
            style={{
              fontFamily: BOOK_COVER_BODY_FONT,
              color: '#FFFFFF',
            }}
          >
            <span>
              {isShelf
                ? isEn
                  ? 'Click to open book'
                  : 'Nhấn để mở sách'
                : isEn
                  ? 'Turn the corner to open'
                  : 'Lật góc sách để mở'}
            </span>
            <WebIcon name="arrow-right" className="w-[3.1cqw] h-[3.1cqw] shrink-0 text-white/95" />
          </span>
          <span
            aria-hidden="true"
            className="h-[1px] flex-1 max-w-[14cqw]"
            style={{
              background:
                'linear-gradient(90deg, rgba(255, 255, 255, 0.52) 0%, transparent 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
