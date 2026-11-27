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
 * Unified with site-wide Card font settings (Play sans-serif)
 */
export const BOOK_COVER_DISPLAY_FONT = 'var(--font-play, "Play", sans-serif)';
export const BOOK_COVER_BODY_FONT = 'var(--font-play, "Play", sans-serif)';

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

  // 14 curated distinct jewel-toned liquid-glass hardcover palettes keyed by course ID.
  // Each course has a completely unique, vibrant theme across the entire color spectrum.
  const byCourseId: Record<
    number,
    Omit<BookCoverTheme, 'pillIconName' | 'pillIconColor' | 'categoryIconName'>
  > = {
    // 1. Thiết Kế Web — 1. Sapphire Blue (Cobalt)
    1: {
      shellBg:
        'radial-gradient(circle at 18% 10%, rgba(186, 230, 253, 0.72) 0%, transparent 50%), linear-gradient(155deg, #3B82F6 0%, #2563EB 52%, #1D4ED8 100%)',
      bottomGradient:
        'linear-gradient(152deg, #1D4ED8 0%, #1E40AF 46%, #1E3A8A 84%, #172554 100%)',
      spineGradient:
        'linear-gradient(90deg, #172554 0%, #2563EB 50%, #1E3A8A 100%)',
      scrimDeep: 'rgba(6, 20, 62, 0.82)',
      topTint: 'rgba(37, 99, 235, 0.28)',
      glowShadow: 'rgba(37, 99, 235, 0.44)',
      wave1: '#38BDF8',
      wave2: '#FDE047',
      wave3: '#F472B6',
      accentSoft: '#93C5FD',
    },
    // 2. Phân Tích Dữ Liệu — 2. Glacial Aqua / Electric Cyan
    2: {
      shellBg:
        'radial-gradient(circle at 82% 12%, rgba(165, 243, 252, 0.75) 0%, transparent 50%), linear-gradient(155deg, #22D3EE 0%, #06B6D4 52%, #0891B2 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0891B2 0%, #0E7490 44%, #155E75 84%, #083344 100%)',
      spineGradient:
        'linear-gradient(90deg, #083344 0%, #06B6D4 52%, #155E75 100%)',
      scrimDeep: 'rgba(4, 30, 48, 0.82)',
      topTint: 'rgba(6, 182, 212, 0.28)',
      glowShadow: 'rgba(6, 182, 212, 0.44)',
      wave1: '#22D3EE',
      wave2: '#34D399',
      wave3: '#818CF8',
      accentSoft: '#67E8F9',
    },
    // 3. Quản Trị Rủi Ro — 3. Scarlet Crimson / Ruby Red
    3: {
      shellBg:
        'radial-gradient(circle at 16% 10%, rgba(254, 205, 211, 0.72) 0%, transparent 50%), linear-gradient(155deg, #F43F5E 0%, #E11D48 54%, #9F1239 100%)',
      bottomGradient:
        'linear-gradient(152deg, #BE123C 0%, #9F1239 48%, #881337 84%, #4C0519 100%)',
      spineGradient:
        'linear-gradient(90deg, #4C0519 0%, #E11D48 52%, #881337 100%)',
      scrimDeep: 'rgba(50, 4, 18, 0.84)',
      topTint: 'rgba(225, 29, 72, 0.28)',
      glowShadow: 'rgba(225, 29, 72, 0.46)',
      wave1: '#FB7185',
      wave2: '#FBBF24',
      wave3: '#38BDF8',
      accentSoft: '#FECDD3',
    },
    // 4. Quản Lý Dự Án — 4. Pure Emerald Green
    4: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(209, 250, 229, 0.72) 0%, transparent 50%), linear-gradient(155deg, #34D399 0%, #10B981 52%, #059669 100%)',
      bottomGradient:
        'linear-gradient(152deg, #059669 0%, #047857 48%, #064E3B 84%, #022C22 100%)',
      spineGradient:
        'linear-gradient(90deg, #022C22 0%, #10B981 52%, #064E3B 100%)',
      scrimDeep: 'rgba(2, 36, 26, 0.82)',
      topTint: 'rgba(16, 185, 129, 0.28)',
      glowShadow: 'rgba(16, 185, 129, 0.46)',
      wave1: '#34D399',
      wave2: '#38BDF8',
      wave3: '#FACC15',
      accentSoft: '#A7F3D0',
    },
    // 5. Quản Lý Cấp Cao — 5. Imperial Amethyst / Royal Violet
    5: {
      shellBg:
        'radial-gradient(circle at 20% 12%, rgba(237, 233, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #A78BFA 0%, #8B5CF6 52%, #6D28D9 100%)',
      bottomGradient:
        'linear-gradient(152deg, #6D28D9 0%, #5B21B6 48%, #3B0764 84%, #2E1065 100%)',
      spineGradient:
        'linear-gradient(90deg, #2E1065 0%, #8B5CF6 52%, #3B0764 100%)',
      scrimDeep: 'rgba(30, 8, 62, 0.82)',
      topTint: 'rgba(139, 92, 246, 0.28)',
      glowShadow: 'rgba(139, 92, 246, 0.48)',
      wave1: '#C084FC',
      wave2: '#38BDF8',
      wave3: '#FBBF24',
      accentSoft: '#DDD6FE',
    },
    // 6. Quản Lý Cấp Trung — 6. Warm Golden Amber / Honey Gold
    6: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(254, 243, 199, 0.75) 0%, transparent 50%), linear-gradient(155deg, #FBBF24 0%, #F59E0B 52%, #D97706 100%)',
      bottomGradient:
        'linear-gradient(152deg, #D97706 0%, #B45309 48%, #92400E 84%, #451A03 100%)',
      spineGradient:
        'linear-gradient(90deg, #451A03 0%, #F59E0B 52%, #92400E 100%)',
      scrimDeep: 'rgba(48, 20, 4, 0.82)',
      topTint: 'rgba(245, 158, 11, 0.28)',
      glowShadow: 'rgba(245, 158, 11, 0.46)',
      wave1: '#FBBF24',
      wave2: '#F472B6',
      wave3: '#38BDF8',
      accentSoft: '#FDE68A',
    },
    // 7. Kỹ Năng Đào Tạo — 7. Fuchsia Rose / Vivid Pink
    7: {
      shellBg:
        'radial-gradient(circle at 18% 12%, rgba(252, 231, 243, 0.74) 0%, transparent 50%), linear-gradient(155deg, #F472B6 0%, #EC4899 52%, #BE185D 100%)',
      bottomGradient:
        'linear-gradient(152deg, #BE185D 0%, #9D174D 48%, #831843 84%, #500724 100%)',
      spineGradient:
        'linear-gradient(90deg, #500724 0%, #EC4899 52%, #831843 100%)',
      scrimDeep: 'rgba(56, 8, 32, 0.82)',
      topTint: 'rgba(236, 72, 153, 0.28)',
      glowShadow: 'rgba(236, 72, 153, 0.46)',
      wave1: '#F472B6',
      wave2: '#FACC15',
      wave3: '#38BDF8',
      accentSoft: '#FBCFE8',
    },
    // 8. Kỹ Năng Thuyết Trình — 8. Midnight Indigo / Starlight Deep Indigo
    8: {
      shellBg:
        'radial-gradient(circle at 82% 12%, rgba(224, 231, 255, 0.74) 0%, transparent 50%), linear-gradient(155deg, #818CF8 0%, #6366F1 52%, #4338CA 100%)',
      bottomGradient:
        'linear-gradient(152deg, #4338CA 0%, #3730A3 48%, #312E81 84%, #1E1B4B 100%)',
      spineGradient:
        'linear-gradient(90deg, #1E1B4B 0%, #6366F1 52%, #312E81 100%)',
      scrimDeep: 'rgba(20, 16, 64, 0.82)',
      topTint: 'rgba(99, 102, 241, 0.28)',
      glowShadow: 'rgba(99, 102, 241, 0.48)',
      wave1: '#818CF8',
      wave2: '#E879F9',
      wave3: '#FACC15',
      accentSoft: '#C7D2FE',
    },
    // 9. Kỹ Năng Phỏng Vấn — 9. Oceanic Deep Teal / Seafoam Jade
    9: {
      shellBg:
        'radial-gradient(circle at 18% 12%, rgba(204, 251, 241, 0.74) 0%, transparent 50%), linear-gradient(155deg, #2DD4BF 0%, #14B8A6 52%, #0F766E 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0F766E 0%, #115E59 48%, #134E4A 84%, #042F2E 100%)',
      spineGradient:
        'linear-gradient(90deg, #042F2E 0%, #14B8A6 52%, #134E4A 100%)',
      scrimDeep: 'rgba(4, 38, 36, 0.82)',
      topTint: 'rgba(20, 184, 166, 0.28)',
      glowShadow: 'rgba(20, 184, 166, 0.46)',
      wave1: '#2DD4BF',
      wave2: '#38BDF8',
      wave3: '#F472B6',
      accentSoft: '#99F6E4',
    },
    // 10. Kỹ Năng Tuyển Dụng — 10. Lush Forest Lime / Chartreuse Olive
    10: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(236, 252, 203, 0.74) 0%, transparent 50%), linear-gradient(155deg, #A3E635 0%, #84CC16 54%, #4D7C0F 100%)',
      bottomGradient:
        'linear-gradient(152deg, #4D7C0F 0%, #3F6212 48%, #365314 84%, #1A2E05 100%)',
      spineGradient:
        'linear-gradient(90deg, #1A2E05 0%, #84CC16 52%, #365314 100%)',
      scrimDeep: 'rgba(18, 36, 5, 0.82)',
      topTint: 'rgba(132, 204, 22, 0.28)',
      glowShadow: 'rgba(132, 204, 22, 0.46)',
      wave1: '#A3E635',
      wave2: '#22D3EE',
      wave3: '#FACC15',
      accentSoft: '#D9F99D',
    },
    // 11. Cử Nhân CNTT — 11. Midnight Oceanic Navy / Ultramarine
    11: {
      shellBg:
        'radial-gradient(circle at 20% 12%, rgba(219, 234, 254, 0.74) 0%, transparent 50%), linear-gradient(155deg, #3B82F6 0%, #1E40AF 52%, #0F172A 100%)',
      bottomGradient:
        'linear-gradient(152deg, #1E3A8A 0%, #172554 48%, #0F172A 84%, #020617 100%)',
      spineGradient:
        'linear-gradient(90deg, #020617 0%, #1E40AF 52%, #0F172A 100%)',
      scrimDeep: 'rgba(2, 6, 23, 0.86)',
      topTint: 'rgba(30, 58, 138, 0.28)',
      glowShadow: 'rgba(30, 58, 138, 0.48)',
      wave1: '#38BDF8',
      wave2: '#A78BFA',
      wave3: '#FB923C',
      accentSoft: '#93C5FD',
    },
    // 12. Nghiệp Vụ Tổng Đài — 12. Radiant Sunset Tangerine Orange
    12: {
      shellBg:
        'radial-gradient(circle at 82% 10%, rgba(254, 215, 170, 0.74) 0%, transparent 50%), linear-gradient(155deg, #FB923C 0%, #F97316 52%, #C2410C 100%)',
      bottomGradient:
        'linear-gradient(152deg, #C2410C 0%, #9A3412 48%, #7C2D12 84%, #431407 100%)',
      spineGradient:
        'linear-gradient(90deg, #431407 0%, #F97316 52%, #7C2D12 100%)',
      scrimDeep: 'rgba(52, 16, 5, 0.84)',
      topTint: 'rgba(249, 115, 22, 0.28)',
      glowShadow: 'rgba(249, 115, 22, 0.46)',
      wave1: '#FB923C',
      wave2: '#FBBF24',
      wave3: '#F472B6',
      accentSoft: '#FED7AA',
    },
    // 13. Quản Trị Mạng CCNA — 13. Electric Orchid Magenta / Purple Neon
    13: {
      shellBg:
        'radial-gradient(circle at 18% 12%, rgba(245, 208, 254, 0.74) 0%, transparent 50%), linear-gradient(155deg, #E879F9 0%, #D946EF 52%, #86198F 100%)',
      bottomGradient:
        'linear-gradient(152deg, #A21CAF 0%, #86198F 48%, #701A75 84%, #3B0764 100%)',
      spineGradient:
        'linear-gradient(90deg, #3B0764 0%, #D946EF 52%, #701A75 100%)',
      scrimDeep: 'rgba(45, 5, 55, 0.84)',
      topTint: 'rgba(217, 70, 239, 0.28)',
      glowShadow: 'rgba(217, 70, 239, 0.48)',
      wave1: '#E879F9',
      wave2: '#818CF8',
      wave3: '#F472B6',
      accentSoft: '#F5D0FE',
    },
    // 14. Quản Trị Máy Chủ MCSA — 14. Cool Graphite Slate Charcoal
    14: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(203, 213, 225, 0.70) 0%, transparent 50%), linear-gradient(155deg, #64748B 0%, #475569 52%, #334155 100%)',
      bottomGradient:
        'linear-gradient(152deg, #334155 0%, #1E293B 48%, #0F172A 84%, #020617 100%)',
      spineGradient:
        'linear-gradient(90deg, #020617 0%, #475569 52%, #0F172A 100%)',
      scrimDeep: 'rgba(15, 23, 42, 0.86)',
      topTint: 'rgba(71, 85, 105, 0.28)',
      glowShadow: 'rgba(71, 85, 105, 0.48)',
      wave1: '#94A3B8',
      wave2: '#38BDF8',
      wave3: '#FBBF24',
      accentSoft: '#CBD5E1',
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

  // Typography scale synced with site-wide Card font specifications
  const titleFontSize = 'clamp(14px, 5.2cqw, var(--fs-card-title, var(--fs-h3, 20px)))';
  const subtitleFontSize = 'clamp(11px, 3.2cqw, var(--fs-body-sm, 13.5px))';
  const metaFontSize = 'clamp(10px, 2.95cqw, var(--fs-label, 12px))';
  const summaryFontSize = 'clamp(10px, 2.8cqw, var(--fs-caption, 12px))';

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
        background: theme.bottomGradient,
        borderRadius: 'var(--radius-global, var(--radius-primary-surface, var(--radius-card, 14px)))',
        padding: 0,
        gap: 0,
        border: 'none',
        boxShadow: `0 12px 26px -12px ${theme.glowShadow}`,
        containerType: 'inline-size',
        fontFamily: BOOK_COVER_BODY_FONT,
        color: '#FFFFFF',
      }}
    >
      {/* Full-bleed banner image filling 100% of the 3D book cover */}
      <img
        src={course.image}
        alt={cleanTitle}
        className="education-book-cover-banner-img absolute inset-0 z-0 w-full h-full object-cover object-center block"
        loading={imageLoading}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={handleImgError}
      />

      {/* Realistic hardcover left French-groove hinge crease */}
      {showSpine && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[3.8cqw]"
          style={{
            background:
              'linear-gradient(90deg, rgba(4, 10, 28, 0.38) 0%, rgba(4, 10, 28, 0.12) 44%, rgba(255, 255, 255, 0.24) 64%, transparent 100%)',
          }}
        />
      )}

      {showGlint && <div className="disc-glint" />}

      {/* Top edge scrim — keeps middle artwork unobstructed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[28%]"
        style={{
          background: `linear-gradient(180deg, ${theme.scrimDeep} 0%, ${theme.topTint} 58%, transparent 100%)`,
        }}
      />

      {/* Bottom graduated editorial scrim — preserves full-bleed banner while ensuring crisp typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[56%]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.48) 30%, ${theme.scrimDeep} 68%, rgba(2, 6, 23, 0.94) 100%)`,
        }}
      />

      {/* Top Unboxed Metadata Row: Category | Course Code */}
      <div
        className="relative z-20 flex items-center justify-between gap-[2cqw] text-white"
        style={{
          fontFamily: BOOK_COVER_BODY_FONT,
          padding: 'clamp(8px, 3cqw, 14px) clamp(10px, 3.6cqw, 16px) 0',
        }}
      >
        <span className="inline-flex items-center gap-[1.3cqw] min-w-0 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
          <WebIcon
            name={theme.categoryIconName}
            className="w-[3.2cqw] h-[3.2cqw] shrink-0"
            style={{ color: theme.accentSoft }}
          />
          <span
            className="font-semibold leading-none tracking-[0.01em] truncate text-white/95"
            style={{ fontSize: metaFontSize }}
          >
            {categoryLabel}
          </span>
        </span>

        <span className="inline-flex items-center gap-[1.1cqw] shrink-0 drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
          <WebIcon
            name="calendar"
            className="w-[2.8cqw] h-[2.8cqw] shrink-0"
            style={{ color: theme.accentSoft }}
          />
          <span
            className="font-bold leading-none tabular-nums tracking-[0.04em] text-white/95"
            style={{ fontSize: metaFontSize }}
          >
            {course.code || `Y-${course.year}`}
          </span>
        </span>
      </div>

      {/* Bottom Editorial Typography Overlay on Full-Bleed Banner */}
      <div
        className="relative z-20 w-full flex flex-col items-center justify-end text-center box-border mt-auto"
        style={{
          padding: isShelf
            ? 'clamp(8px, 3cqw, 13px) clamp(9px, 3.4cqw, 15px)'
            : 'clamp(10px, 3.4cqw, 16px) clamp(12px, 3.8cqw, 18px)',
          gap: 'clamp(4px, 1.8cqw, 8px)',
          fontFamily: BOOK_COVER_BODY_FONT,
          color: '#FFFFFF',
        }}
      >
        {/* Issuer | Year Row */}
        <div className="w-full flex items-center justify-between gap-[2cqw] text-white/95 pb-[0.6cqw]">
          <span className="inline-flex items-center gap-[1.3cqw] min-w-0 drop-shadow-[0_1px_5px_rgba(0,0,0,0.88)]">
            <WebIcon
              name="graduation"
              className="w-[3.4cqw] h-[3.4cqw] shrink-0"
              style={{ color: theme.accentSoft }}
            />
            <span
              className="font-semibold leading-none truncate text-white/95"
              style={{ fontSize: metaFontSize }}
            >
              {course.issuer}
            </span>
          </span>

          <span
            className="font-bold leading-none tabular-nums tracking-[0.02em] text-white/95 shrink-0 drop-shadow-[0_1px_5px_rgba(0,0,0,0.88)]"
            style={{ fontSize: metaFontSize }}
          >
            {isEn ? `${course.year}` : `Năm ${course.year}`}
          </span>
        </div>

        {/* Display Title & Clean Unboxed Subtitle */}
        <div className="relative z-10 w-full flex flex-col items-center gap-[1.2cqw] min-w-0">
          <h3
            className="font-extrabold m-0 flex items-center justify-center gap-[1.8cqw] max-w-full"
            style={{
              fontFamily: BOOK_COVER_DISPLAY_FONT,
              fontSize: titleFontSize,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(2, 6, 23, 0.72)',
            }}
          >
            <WebIcon
              name={courseIconName}
              className="w-[5.1cqw] h-[5.1cqw] shrink-0"
              style={{ color: theme.accentSoft }}
            />
            <span className="line-clamp-2 text-center">{cleanTitle}</span>
          </h3>

          <p
            className="font-semibold leading-snug m-0 flex items-center justify-center gap-[1.4cqw] max-w-full truncate tracking-[0.01em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]"
            style={{
              fontFamily: BOOK_COVER_BODY_FONT,
              fontSize: subtitleFontSize,
              color: theme.accentSoft,
            }}
          >
            <span className="truncate">{subtitleLeft}</span>
            <span aria-hidden="true" className="opacity-75 font-bold shrink-0">
              ·
            </span>
            <span className="truncate tabular-nums">{subtitleRight}</span>
          </p>
        </div>

        {/* Summary Strip with Subtle Divider */}
        {summaryText && (
          <div
            className="relative z-10 w-full flex items-center justify-center gap-[1.8cqw] pt-[1.4cqw] px-[1.2cqw] min-w-0 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.22)' }}
          >
            <WebIcon
              name={theme.pillIconName}
              className="w-[3.4cqw] h-[3.4cqw] shrink-0"
              style={{ color: theme.pillIconColor }}
            />
            <span
              className="min-w-0 text-left font-medium leading-[1.38] line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              style={{
                fontFamily: BOOK_COVER_BODY_FONT,
                fontSize: summaryFontSize,
                color: 'rgba(255, 255, 255, 0.94)',
              }}
            >
              {summaryText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
