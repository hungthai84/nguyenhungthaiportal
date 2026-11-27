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
    // 1. Thiết Kế Web — Electric Cobalt, Sky Cyan & Prismatic Aurora
    1: {
      shellBg:
        'radial-gradient(circle at 18% 10%, rgba(186, 230, 253, 0.72) 0%, transparent 50%), linear-gradient(155deg, #60A5FA 0%, #3B82F6 52%, #1D4ED8 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0284C7 0%, #1D4ED8 46%, #1E3A8A 84%, #172554 100%)',
      spineGradient:
        'linear-gradient(90deg, #172554 0%, #1D4ED8 50%, #1E3A8A 100%)',
      scrimDeep: 'rgba(6, 20, 62, 0.78)',
      topTint: 'rgba(14, 116, 240, 0.26)',
      glowShadow: 'rgba(15, 58, 178, 0.44)',
      wave1: '#38BDF8',
      wave2: '#FDE047',
      wave3: '#F472B6',
      accentSoft: '#7DD3FC',
    },
    // 2. Phân Tích Dữ Liệu — Glacial Aqua & Deep Ocean Sapphire
    2: {
      shellBg:
        'radial-gradient(circle at 82% 12%, rgba(165, 243, 252, 0.70) 0%, transparent 50%), linear-gradient(155deg, #38BDF8 0%, #0284C7 52%, #1E40AF 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0369A1 0%, #075985 44%, #1E3A8A 84%, #0F172A 100%)',
      spineGradient:
        'linear-gradient(90deg, #0C4A6E 0%, #0284C7 52%, #0F172A 100%)',
      scrimDeep: 'rgba(5, 26, 56, 0.80)',
      topTint: 'rgba(2, 132, 199, 0.26)',
      glowShadow: 'rgba(3, 86, 152, 0.44)',
      wave1: '#38BDF8',
      wave2: '#34D399',
      wave3: '#818CF8',
      accentSoft: '#67E8F9',
    },
    // 3. Quản Trị Rủi Ro — Burnished Amber & Deep Terracotta Bronze
    3: {
      shellBg:
        'radial-gradient(circle at 16% 10%, rgba(254, 243, 199, 0.72) 0%, transparent 50%), linear-gradient(155deg, #F59E0B 0%, #EA580C 54%, #9A3412 100%)',
      bottomGradient:
        'linear-gradient(152deg, #C2410C 0%, #9A3412 48%, #7C2D12 84%, #431407 100%)',
      spineGradient:
        'linear-gradient(90deg, #431407 0%, #C2410C 52%, #7C2D12 100%)',
      scrimDeep: 'rgba(54, 18, 6, 0.80)',
      topTint: 'rgba(194, 65, 12, 0.28)',
      glowShadow: 'rgba(154, 52, 18, 0.46)',
      wave1: '#FBBF24',
      wave2: '#FB7185',
      wave3: '#38BDF8',
      accentSoft: '#FDE68A',
    },
    // 4. Quản Lý Dự Án — Botanical Emerald & Forest Jade
    4: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(209, 250, 229, 0.70) 0%, transparent 50%), linear-gradient(155deg, #34D399 0%, #059669 52%, #065F46 100%)',
      bottomGradient:
        'linear-gradient(152deg, #047857 0%, #065F46 48%, #064E3B 84%, #022C22 100%)',
      spineGradient:
        'linear-gradient(90deg, #022C22 0%, #059669 52%, #064E3B 100%)',
      scrimDeep: 'rgba(3, 38, 28, 0.80)',
      topTint: 'rgba(5, 150, 105, 0.26)',
      glowShadow: 'rgba(6, 95, 70, 0.46)',
      wave1: '#34D399',
      wave2: '#38BDF8',
      wave3: '#FACC15',
      accentSoft: '#A7F3D0',
    },
    // 5. Quản Lý Cấp Cao — Imperial Amethyst & Velvet Violet
    5: {
      shellBg:
        'radial-gradient(circle at 20% 12%, rgba(237, 233, 254, 0.70) 0%, transparent 50%), linear-gradient(155deg, #A78BFA 0%, #7C3AED 52%, #4C1D95 100%)',
      bottomGradient:
        'linear-gradient(152deg, #6D28D9 0%, #5B21B6 48%, #3B0764 84%, #2E1065 100%)',
      spineGradient:
        'linear-gradient(90deg, #2E1065 0%, #6D28D9 52%, #3B0764 100%)',
      scrimDeep: 'rgba(30, 8, 62, 0.80)',
      topTint: 'rgba(109, 40, 217, 0.28)',
      glowShadow: 'rgba(76, 29, 149, 0.48)',
      wave1: '#C084FC',
      wave2: '#38BDF8',
      wave3: '#FBBF24',
      accentSoft: '#DDD6FE',
    },
    // 6. Quản Lý Cấp Trung — Deep Turquoise & Oceanic Teal
    6: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(207, 250, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #22D3EE 0%, #0891B2 52%, #155E75 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0E7490 0%, #155E75 48%, #164E63 84%, #083344 100%)',
      spineGradient:
        'linear-gradient(90deg, #083344 0%, #0891B2 52%, #164E63 100%)',
      scrimDeep: 'rgba(6, 36, 52, 0.80)',
      topTint: 'rgba(8, 145, 178, 0.26)',
      glowShadow: 'rgba(21, 94, 117, 0.46)',
      wave1: '#22D3EE',
      wave2: '#A78BFA',
      wave3: '#FB923C',
      accentSoft: '#A5F3FC',
    },
    // 7. Kỹ Năng Đào Tạo — Velvet Rose & Ruby Magenta
    7: {
      shellBg:
        'radial-gradient(circle at 18% 12%, rgba(252, 231, 243, 0.72) 0%, transparent 50%), linear-gradient(155deg, #F472B6 0%, #DB2777 52%, #9D174D 100%)',
      bottomGradient:
        'linear-gradient(152deg, #BE185D 0%, #9D174D 48%, #831843 84%, #500724 100%)',
      spineGradient:
        'linear-gradient(90deg, #500724 0%, #BE185D 52%, #831843 100%)',
      scrimDeep: 'rgba(58, 8, 34, 0.80)',
      topTint: 'rgba(190, 24, 93, 0.28)',
      glowShadow: 'rgba(157, 23, 77, 0.46)',
      wave1: '#F472B6',
      wave2: '#FACC15',
      wave3: '#38BDF8',
      accentSoft: '#FBCFE8',
    },
    // 8. Kỹ Năng Thuyết Trình — Midnight Indigo & Starlight Blue
    8: {
      shellBg:
        'radial-gradient(circle at 82% 12%, rgba(224, 231, 255, 0.72) 0%, transparent 50%), linear-gradient(155deg, #818CF8 0%, #4F46E5 52%, #312E81 100%)',
      bottomGradient:
        'linear-gradient(152deg, #4338CA 0%, #3730A3 48%, #312E81 84%, #1E1B4B 100%)',
      spineGradient:
        'linear-gradient(90deg, #1E1B4B 0%, #4338CA 52%, #312E81 100%)',
      scrimDeep: 'rgba(20, 16, 66, 0.80)',
      topTint: 'rgba(67, 56, 202, 0.28)',
      glowShadow: 'rgba(49, 46, 129, 0.48)',
      wave1: '#38BDF8',
      wave2: '#E879F9',
      wave3: '#FACC15',
      accentSoft: '#C7D2FE',
    },
    // 9. Kỹ Năng Phỏng Vấn — Lagoon Teal & Deep Jade
    9: {
      shellBg:
        'radial-gradient(circle at 18% 12%, rgba(204, 251, 241, 0.72) 0%, transparent 50%), linear-gradient(155deg, #2DD4BF 0%, #0D9488 52%, #115E59 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0F766E 0%, #115E59 48%, #134E4A 84%, #042F2E 100%)',
      spineGradient:
        'linear-gradient(90deg, #042F2E 0%, #0D9488 52%, #134E4A 100%)',
      scrimDeep: 'rgba(4, 38, 36, 0.80)',
      topTint: 'rgba(15, 118, 110, 0.26)',
      glowShadow: 'rgba(17, 94, 89, 0.46)',
      wave1: '#2DD4BF',
      wave2: '#38BDF8',
      wave3: '#F472B6',
      accentSoft: '#99F6E4',
    },
    // 10. Kỹ Năng Tuyển Dụng — Lush Botanical Moss & Deep Forest
    10: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(236, 252, 203, 0.72) 0%, transparent 50%), linear-gradient(155deg, #84CC16 0%, #16A34A 54%, #166534 100%)',
      bottomGradient:
        'linear-gradient(152deg, #15803D 0%, #166534 48%, #14532D 84%, #052E16 100%)',
      spineGradient:
        'linear-gradient(90deg, #052E16 0%, #15803D 52%, #14532D 100%)',
      scrimDeep: 'rgba(8, 38, 18, 0.80)',
      topTint: 'rgba(21, 128, 61, 0.28)',
      glowShadow: 'rgba(20, 83, 45, 0.46)',
      wave1: '#A3E635',
      wave2: '#22D3EE',
      wave3: '#FACC15',
      accentSoft: '#D9F99D',
    },
    // 11. Cử Nhân CNTT — Royal Academic Sapphire & Navy Crest
    11: {
      shellBg:
        'radial-gradient(circle at 20% 12%, rgba(219, 234, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #60A5FA 0%, #2563EB 52%, #1E3A8A 100%)',
      bottomGradient:
        'linear-gradient(152deg, #1D4ED8 0%, #1E40AF 48%, #1E3A8A 84%, #0F172A 100%)',
      spineGradient:
        'linear-gradient(90deg, #0F172A 0%, #1D4ED8 52%, #1E3A8A 100%)',
      scrimDeep: 'rgba(8, 22, 62, 0.80)',
      topTint: 'rgba(29, 78, 216, 0.28)',
      glowShadow: 'rgba(30, 58, 138, 0.48)',
      wave1: '#38BDF8',
      wave2: '#A78BFA',
      wave3: '#FB923C',
      accentSoft: '#BFDBFE',
    },
    // 12. Nghiệp Vụ Tổng Đài — Telecom Cerulean & Deep Marine
    12: {
      shellBg:
        'radial-gradient(circle at 82% 10%, rgba(224, 242, 254, 0.72) 0%, transparent 50%), linear-gradient(155deg, #38BDF8 0%, #0284C7 52%, #075985 100%)',
      bottomGradient:
        'linear-gradient(152deg, #0369A1 0%, #075985 48%, #0C4A6E 84%, #082F49 100%)',
      spineGradient:
        'linear-gradient(90deg, #082F49 0%, #0369A1 52%, #0C4A6E 100%)',
      scrimDeep: 'rgba(5, 28, 48, 0.80)',
      topTint: 'rgba(3, 105, 161, 0.26)',
      glowShadow: 'rgba(7, 89, 133, 0.46)',
      wave1: '#22D3EE',
      wave2: '#FBBF24',
      wave3: '#F472B6',
      accentSoft: '#BAE6FD',
    },
    // 13. Quản Trị Mạng CCNA — Cyber Indigo & Deep Electric Blue
    13: {
      shellBg:
        'radial-gradient(circle at 18% 12%, rgba(165, 243, 252, 0.64) 0%, transparent 50%), linear-gradient(155deg, #6366F1 0%, #4338CA 52%, #1E1B4B 100%)',
      bottomGradient:
        'linear-gradient(152deg, #3730A3 0%, #312E81 48%, #1E1B4B 84%, #0F172A 100%)',
      spineGradient:
        'linear-gradient(90deg, #0F172A 0%, #3730A3 52%, #1E1B4B 100%)',
      scrimDeep: 'rgba(14, 14, 52, 0.82)',
      topTint: 'rgba(55, 48, 163, 0.28)',
      glowShadow: 'rgba(49, 46, 129, 0.48)',
      wave1: '#22D3EE',
      wave2: '#818CF8',
      wave3: '#F472B6',
      accentSoft: '#A5F3FC',
    },
    // 14. Quản Trị Máy Chủ MCSA — Server Emerald & Slate Teal
    14: {
      shellBg:
        'radial-gradient(circle at 80% 10%, rgba(209, 250, 229, 0.68) 0%, transparent 50%), linear-gradient(155deg, #10B981 0%, #047857 52%, #064E3B 100%)',
      bottomGradient:
        'linear-gradient(152deg, #047857 0%, #0F766E 48%, #064E3B 84%, #022C22 100%)',
      spineGradient:
        'linear-gradient(90deg, #022C22 0%, #047857 52%, #064E3B 100%)',
      scrimDeep: 'rgba(3, 34, 28, 0.82)',
      topTint: 'rgba(4, 120, 87, 0.28)',
      glowShadow: 'rgba(6, 78, 59, 0.48)',
      wave1: '#34D399',
      wave2: '#38BDF8',
      wave3: '#FBBF24',
      accentSoft: '#A7F3D0',
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
  const titleFontSize = isShelf
    ? titleLen <= 14
      ? '6.8cqw'
      : titleLen <= 20
        ? '6.0cqw'
        : '5.2cqw'
    : titleLen <= 14
      ? '6.4cqw'
      : titleLen <= 20
        ? '5.7cqw'
        : '5.0cqw';

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
        padding: isShelf ? 'clamp(8px, 3.2cqw, 12px)' : 'clamp(10px, 3.6cqw, 14px)',
        gap: isShelf ? 'clamp(7px, 2.4cqw, 10px)' : 'clamp(9px, 2.8cqw, 12px)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(2, 6, 23, 0.24)',
        containerType: 'inline-size',
        fontFamily: BOOK_COVER_BODY_FONT,
        color: '#FFFFFF',
      }}
    >
      {/* Realistic hardcover left French-groove hinge crease */}
      {showSpine && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[3.8cqw]"
          style={{
            background:
              'linear-gradient(90deg, rgba(4, 10, 28, 0.34) 0%, rgba(4, 10, 28, 0.10) 44%, rgba(255, 255, 255, 0.24) 64%, transparent 100%)',
          }}
        />
      )}

      {showGlint && <div className="disc-glint" />}

      {/* ================= TIER 1 (~54%): FRAMELESS FULL-BLEED HERO BANNER ================= */}
      <div
        className="education-book-cover-banner-frame relative z-10 w-full flex-[1.22_1_0%] min-h-0 overflow-hidden box-border"
        style={{
          borderRadius: 'calc(max(6px, var(--radius-global, 14px) - 3px))',
          border: '1px solid rgba(255, 255, 255, 0.34)',
          boxShadow: `0 12px 26px -12px ${theme.glowShadow}`,
          background: theme.bottomGradient,
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
          className="pointer-events-none absolute inset-x-0 top-0 h-[30%]"
          style={{
            background: `linear-gradient(180deg, ${theme.scrimDeep} 0%, ${theme.topTint} 62%, transparent 100%)`,
          }}
        />

        {/* Measured bottom edge scrim for crisp issuer & year metadata */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
          style={{
            background: `linear-gradient(0deg, ${theme.scrimDeep} 0%, ${theme.topTint} 62%, transparent 100%)`,
          }}
        />

        {/* Top Unboxed Metadata Row: Category | Course Code */}
        <div
          className="absolute top-[2.8cqw] left-[3.4cqw] right-[3.4cqw] z-10 flex items-center justify-between gap-[2cqw] text-white"
          style={{ fontFamily: BOOK_COVER_BODY_FONT }}
        >
          <span className="inline-flex items-center gap-[1.3cqw] min-w-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.78)]">
            <WebIcon
              name={theme.categoryIconName}
              className="w-[3.2cqw] h-[3.2cqw] shrink-0"
              style={{ color: theme.accentSoft }}
            />
            <span className="font-semibold text-[2.95cqw] leading-none tracking-[0.01em] truncate text-white/95">
              {categoryLabel}
            </span>
          </span>

          <span className="inline-flex items-center gap-[1.1cqw] shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.78)]">
            <WebIcon
              name="calendar"
              className="w-[2.8cqw] h-[2.8cqw] shrink-0"
              style={{ color: theme.accentSoft }}
            />
            <span className="font-bold text-[2.85cqw] leading-none tabular-nums tracking-[0.04em] text-white/95">
              {course.code || `Y-${course.year}`}
            </span>
          </span>
        </div>

        {/* Bottom Unboxed Metadata Row: Issuer | Year */}
        <div
          className="absolute bottom-[2.6cqw] left-[3.4cqw] right-[3.4cqw] z-10 flex items-center justify-between gap-[2cqw] text-white"
          style={{ fontFamily: BOOK_COVER_BODY_FONT }}
        >
          <span className="inline-flex items-center gap-[1.3cqw] min-w-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.82)]">
            <WebIcon
              name="graduation"
              className="w-[3.4cqw] h-[3.4cqw] shrink-0"
              style={{ color: theme.accentSoft }}
            />
            <span className="font-semibold text-[2.95cqw] leading-none truncate text-white/95">
              {course.issuer}
            </span>
          </span>

          <span className="font-bold text-[2.95cqw] leading-none tabular-nums tracking-[0.02em] text-white/95 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.82)]">
            {isEn ? `${course.year}` : `Năm ${course.year}`}
          </span>
        </div>
      </div>

      {/* ================= TIER 2 (~46%): COURSE-COORDINATED EDITORIAL PANEL ================= */}
      <div
        className="relative z-10 w-full flex-[1_1_0%] min-h-0 overflow-hidden flex flex-col items-center justify-center text-center box-border"
        style={{
          background: theme.bottomGradient,
          borderRadius: 'calc(max(6px, var(--radius-global, 14px) - 3px))',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 8px 18px -10px ${theme.glowShadow}`,
          padding: isShelf
            ? 'clamp(7px, 2.8cqw, 11px) clamp(8px, 3cqw, 12px)'
            : 'clamp(9px, 3.2cqw, 14px) clamp(10px, 3.6cqw, 16px)',
          gap: isShelf ? 'clamp(4px, 1.8cqw, 7px)' : 'clamp(6px, 2.2cqw, 9px)',
          fontFamily: BOOK_COVER_BODY_FONT,
          color: '#FFFFFF',
        }}
      >
        {/* Subtle luminous top-right corner accent inside the course panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-6 w-[28cqw] h-[28cqw] rounded-full opacity-25 blur-xl"
          style={{ background: theme.wave1 }}
        />

        {/* Display Title & Clean Unboxed Subtitle */}
        <div className="relative z-10 w-full flex flex-col items-center gap-[1.3cqw] min-w-0">
          <h3
            className="font-extrabold m-0 flex items-center justify-center gap-[1.8cqw] max-w-full"
            style={{
              fontFamily: BOOK_COVER_DISPLAY_FONT,
              fontSize: titleFontSize,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
              color: '#FFFFFF',
              textShadow: '0 1px 3px rgba(2, 6, 23, 0.35)',
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
            className="font-semibold text-[2.95cqw] leading-snug m-0 flex items-center justify-center gap-[1.4cqw] max-w-full truncate tracking-[0.01em]"
            style={{
              fontFamily: BOOK_COVER_BODY_FONT,
              color: theme.accentSoft,
            }}
          >
            <span className="truncate">{subtitleLeft}</span>
            <span aria-hidden="true" className="opacity-65 font-bold shrink-0">
              ·
            </span>
            <span className="truncate tabular-nums">{subtitleRight}</span>
          </p>
        </div>

        {/* Summary Strip with Subtle Divider */}
        {summaryText && (
          <div
            className="relative z-10 w-full flex items-center justify-center gap-[1.8cqw] pt-[1.5cqw] px-[1.2cqw] min-w-0 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.16)' }}
          >
            <WebIcon
              name={theme.pillIconName}
              className="w-[3.4cqw] h-[3.4cqw] shrink-0"
              style={{ color: theme.pillIconColor }}
            />
            <span
              className={`min-w-0 text-left font-medium text-[2.8cqw] leading-[1.38] ${
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
      </div>
    </div>
  );
};
