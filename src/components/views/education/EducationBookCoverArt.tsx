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

export type BookTemplate =
  | 'vjy-layered'
  | 'variant-editorial'
  | 'variant-bauhaus'
  | 'side-spine'
  | 'variant-zen';

export type ArtPattern =
  | 'p-grid'
  | 'p-dots'
  | 'p-split'
  | 'p-arch'
  | 'p-sun'
  | 'p-stripes'
  | 'p-waves'
  | 'p-rings';

export interface BookPalette {
  base: string;
  deep: string;
  mid: string;
  soft: string;
  highlight: string;
  coverBg: string;
  spineBg: string;
}

export const WEBSITE_BOOK_TEMPLATES: BookTemplate[] = [
  'vjy-layered',
  'variant-editorial',
  'variant-bauhaus',
  'side-spine',
  'variant-zen',
];

export const ART_PATTERNS: ArtPattern[] = [
  'p-grid',
  'p-dots',
  'p-split',
  'p-arch',
  'p-sun',
  'p-stripes',
  'p-waves',
  'p-rings',
];

export const DISTINCT_BOOK_FALLBACK_COLORS = [
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = (hex || '#2563EB').replace('#', '').trim();
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

export function buildPaletteFromAccent(accentHex: string): BookPalette {
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

export function getCourseShelfDesign(
  course: EducationCourse,
  fallbackColor?: string,
  explicitIndex?: number
): {
  canonicalIdx: number;
  accentHex: string;
  palette: BookPalette;
  template: BookTemplate;
  pattern: ArtPattern;
} {
  const canonicalIdx =
    typeof explicitIndex === 'number' && explicitIndex >= 0
      ? explicitIndex
      : Math.max(0, (Number(course.id) || 1) - 1);
  const accentHex =
    course.accentColor && course.accentColor.startsWith('#')
      ? course.accentColor
      : fallbackColor && fallbackColor.startsWith('#')
        ? fallbackColor
        : DISTINCT_BOOK_FALLBACK_COLORS[canonicalIdx % DISTINCT_BOOK_FALLBACK_COLORS.length];
  const palette = buildPaletteFromAccent(accentHex);
  const template = WEBSITE_BOOK_TEMPLATES[canonicalIdx % WEBSITE_BOOK_TEMPLATES.length];
  const pattern = ART_PATTERNS[(course.id + canonicalIdx) % ART_PATTERNS.length];

  return {
    canonicalIdx,
    accentHex,
    palette,
    template,
    pattern,
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
}) => {
  const cleanTitle = formatCardTitle(course.title);
  const theme = getBookCoverTheme(course, courseColor);
  const { palette, template, pattern } = getCourseShelfDesign(course, courseColor);
  const shortCode = course.code || `EDU-${course.year}`;

  const rawLeft = (course.type || categoryLabel).trim();
  const rawRight = (course.issuer || categoryLabel).trim();
  const subtitleLeft = rawLeft;
  const subtitleRight =
    rawRight.toLowerCase() === rawLeft.toLowerCase()
      ? categoryLabel.toLowerCase() === rawLeft.toLowerCase()
        ? shortCode
        : categoryLabel
      : rawRight;

  const summaryText = course.result || course.desc;

  const titleFontSize = 'clamp(19px, 6.8cqw, 28px)';
  const subtitleFontSize = 'clamp(12.5px, 3.8cqw, 15.5px)';
  const metaFontSize = 'clamp(11px, 3.3cqw, 13.5px)';
  const summaryFontSize = 'clamp(11.5px, 3.4cqw, 14px)';

  return (
    <div
      data-book-template={template}
      className="education-book-cover relative flex size-full flex-col items-stretch justify-between select-none overflow-hidden box-border text-white"
      style={{
        background: template === 'side-spine' ? palette.spineBg : palette.coverBg,
        borderRadius:
          variant === 'book'
            ? 'inherit'
            : 'var(--radius-global, var(--radius-primary-surface, var(--radius-card, 14px)))',
        padding: 'clamp(14px, 4.4cqw, 22px) clamp(14px, 4.6cqw, 22px) clamp(14px, 4.4cqw, 22px) clamp(18px, 5.6cqw, 26px)',
        border: 'none',
        boxShadow: `0 12px 26px -12px ${theme.glowShadow}, inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.32)`,
        containerType: 'inline-size',
        fontFamily: BOOK_COVER_BODY_FONT,
        color: '#FFFFFF',
      }}
    >
      <div className={`edu-art-pattern ${pattern}`} aria-hidden="true" />
      {showSpine && <div className="edu-book-spine-crease" aria-hidden="true" />}
      <div className="edu-book-paper-grain" aria-hidden="true" />
      <div className="edu-book-light" aria-hidden="true" />
      {showGlint && <div className="disc-glint" />}

      {/* 1. MẪU BÌA VARIANT-EDITORIAL (Monograph thanh ngang & chữ biên tập) */}
      {template === 'variant-editorial' && (
        <>
          <div className="relative z-10 w-full flex flex-col gap-[2cqw]">
            <div
              className="w-full h-[3px] rounded-full"
              style={{ background: palette.soft }}
              aria-hidden="true"
            />
            <div
              className="flex items-center justify-between gap-2 font-bold tracking-[0.06em]"
              style={{ fontSize: metaFontSize }}
            >
              <span className="truncate" style={{ color: palette.soft }}>
                {categoryLabel}
              </span>
              <span className="tabular-nums text-white/90 shrink-0">
                {shortCode} · {course.year}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-start gap-[2.4cqw] my-auto w-full">
            <div
              className="w-[11cqw] h-[11cqw] min-w-[36px] min-h-[36px] max-w-[48px] max-h-[48px] rounded-xl flex items-center justify-center bg-black/22 border border-white/25 shadow-sm"
              style={{ color: palette.soft }}
            >
              <WebIcon name={courseIconName} className="w-[5.5cqw] h-[5.5cqw] min-w-[18px] min-h-[18px]" />
            </div>

            <h3
              className="m-0 font-extrabold tracking-tight text-white text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
              style={{
                fontFamily: BOOK_COVER_DISPLAY_FONT,
                fontSize: titleFontSize,
                lineHeight: 1.18,
              }}
            >
              {cleanTitle}
            </h3>

            <p
              className="m-0 font-semibold leading-snug text-left"
              style={{ fontSize: subtitleFontSize, color: palette.soft }}
            >
              {subtitleLeft} · {subtitleRight}
            </p>

            {summaryText && (
              <p
                className="m-0 text-left font-medium leading-[1.42] line-clamp-3 text-white/90 pt-[1.5cqw] border-t border-white/20 w-full"
                style={{ fontSize: summaryFontSize }}
              >
                {summaryText}
              </p>
            )}
          </div>

          <div className="relative z-10 w-full flex items-center justify-between gap-2 pt-[2.2cqw] border-t border-white/22">
            <span className="inline-flex items-center gap-[1.5cqw] min-w-0">
              <WebIcon
                name={courseIconName}
                className="w-[3.8cqw] h-[3.8cqw] shrink-0"
                style={{ color: palette.soft }}
              />
              <span className="font-semibold text-white/95 truncate" style={{ fontSize: metaFontSize }}>
                {course.issuer}
              </span>
            </span>
            <span
              className="font-bold tabular-nums px-[2cqw] py-[0.6cqw] rounded-md bg-black/25 border border-white/15 shrink-0"
              style={{ fontSize: metaFontSize, color: palette.soft }}
            >
              {isEn ? `Year ${course.year}` : `Năm ${course.year}`}
            </span>
          </div>
        </>
      )}

      {/* 2. MẪU BÌA VARIANT-BAUHAUS (Chấm hình học Bauhaus + dải phân cách) */}
      {template === 'variant-bauhaus' && (
        <>
          <div className="relative z-10 w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-[1.6cqw]" aria-hidden="true">
              <span
                className="w-[3.2cqw] h-[3.2cqw] min-w-[10px] min-h-[10px] rounded-full"
                style={{ background: palette.soft }}
              />
              <span
                className="w-[3.2cqw] h-[3.2cqw] min-w-[10px] min-h-[10px] rounded-[3px]"
                style={{ background: '#ffffff', opacity: 0.9 }}
              />
              <span
                className="w-[3.2cqw] h-[3.2cqw] min-w-[10px] min-h-[10px] rounded-full"
                style={{ background: palette.highlight, opacity: 0.75 }}
              />
            </div>
            <span
              className="font-extrabold tracking-wide px-[2.2cqw] py-[0.8cqw] rounded-md bg-black/28 border border-white/15 text-white/95 tabular-nums"
              style={{ fontSize: metaFontSize }}
            >
              {shortCode}
            </span>
          </div>

          <div className="relative z-10 w-full my-auto flex flex-col items-start gap-[2.2cqw]">
            <div
              className="w-full h-[4px] rounded-full opacity-75"
              style={{
                background: `linear-gradient(90deg, ${palette.soft} 0%, transparent 100%)`,
              }}
              aria-hidden="true"
            />
            <span
              className="font-bold tracking-wide"
              style={{ fontSize: metaFontSize, color: palette.soft }}
            >
              {categoryLabel} · {course.year}
            </span>
            <h3
              className="m-0 font-extrabold tracking-tight text-white text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.48)]"
              style={{
                fontFamily: BOOK_COVER_DISPLAY_FONT,
                fontSize: titleFontSize,
                lineHeight: 1.18,
              }}
            >
              {cleanTitle}
            </h3>
            {summaryText && (
              <p
                className="m-0 text-left font-medium leading-[1.42] line-clamp-3 text-white/90"
                style={{ fontSize: summaryFontSize }}
              >
                {summaryText}
              </p>
            )}
          </div>

          <div className="relative z-10 w-full flex items-center justify-between gap-2 px-[3cqw] py-[2cqw] rounded-xl bg-black/28 border border-white/18">
            <div className="flex flex-col items-start min-w-0">
              <span className="font-bold text-white/95 truncate max-w-full" style={{ fontSize: metaFontSize }}>
                {course.issuer}
              </span>
              <span className="text-[2.6cqw] text-white/75 truncate max-w-full">
                {subtitleLeft}
              </span>
            </div>
            <div
              className="w-[8.5cqw] h-[8.5cqw] min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center bg-white/12 shrink-0"
              style={{ color: palette.soft }}
            >
              <WebIcon name={courseIconName} className="w-[4.5cqw] h-[4.5cqw] min-w-[15px] min-h-[15px]" />
            </div>
          </div>
        </>
      )}

      {/* 3. MẪU BÌA VARIANT-ZEN (Vòng tròn huy hiệu Zen ở tâm bìa) */}
      {template === 'variant-zen' && (
        <>
          <div className="relative z-10 w-full flex items-center justify-between pb-[2cqw] border-b border-white/22">
            <span
              className="font-bold tracking-[0.06em] truncate"
              style={{ fontSize: metaFontSize, color: palette.soft }}
            >
              {categoryLabel}
            </span>
            <span
              className="font-bold tabular-nums text-white/90 shrink-0"
              style={{ fontSize: metaFontSize }}
            >
              {shortCode}
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-[2.4cqw] my-auto w-full">
            <div
              className="w-[23cqw] h-[23cqw] min-w-[74px] min-h-[74px] max-w-[104px] max-h-[104px] rounded-full border border-white/30 flex flex-col items-center justify-center gap-[1cqw] shadow-[inset_0_2px_10px_rgba(255,255,255,0.22),0_10px_22px_rgba(0,0,0,0.28)]"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${palette.highlight} 0%, rgba(0,0,0,0.32) 100%)`,
              }}
            >
              <WebIcon
                name={courseIconName}
                className="w-[8cqw] h-[8cqw] min-w-[24px] min-h-[24px] text-white drop-shadow"
              />
              <span className="text-[2.8cqw] font-extrabold tracking-widest tabular-nums text-white/95">
                {course.year}
              </span>
            </div>

            <h3
              className="m-0 font-extrabold tracking-tight text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              style={{
                fontFamily: BOOK_COVER_DISPLAY_FONT,
                fontSize: titleFontSize,
                lineHeight: 1.18,
              }}
            >
              {cleanTitle}
            </h3>

            {summaryText && (
              <p
                className="m-0 text-center font-medium leading-[1.4] line-clamp-2 text-white/90 px-[2cqw]"
                style={{ fontSize: summaryFontSize }}
              >
                {summaryText}
              </p>
            )}
          </div>

          <div className="relative z-10 w-full pt-[2cqw] border-t border-white/22 flex items-center justify-between gap-2">
            <span className="font-semibold text-white/92 truncate" style={{ fontSize: metaFontSize }}>
              {course.issuer}
            </span>
            <span className="font-bold text-white/80 shrink-0" style={{ fontSize: metaFontSize, color: palette.soft }}>
              {subtitleLeft}
            </span>
          </div>
        </>
      )}

      {/* 4. MẪU BÌA SIDE-SPINE (Đai gáy sách cổ điển trên/dưới mở rộng thành bìa chính) */}
      {template === 'side-spine' && (
        <>
          <div className="relative z-10 w-full flex flex-col items-center gap-[2.2cqw]">
            <div
              className="w-full h-[3px] rounded-full opacity-85"
              style={{ background: palette.soft }}
              aria-hidden="true"
            />
            <div className="w-full flex items-center justify-between gap-2">
              <span
                className="font-bold tracking-wide px-[2cqw] py-[0.7cqw] rounded bg-black/25 border border-white/20 truncate"
                style={{ fontSize: metaFontSize, color: palette.soft }}
              >
                {categoryLabel}
              </span>
              <span
                className="font-bold tabular-nums px-[2cqw] py-[0.7cqw] rounded bg-black/25 border border-white/20 text-white/95 shrink-0"
                style={{ fontSize: metaFontSize }}
              >
                {shortCode}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-[2.5cqw] my-auto w-full px-[1.5cqw]">
            <div
              className="w-[14cqw] h-[14cqw] min-w-[44px] min-h-[44px] max-w-[60px] max-h-[60px] rounded-xl bg-black/28 border border-white/25 flex items-center justify-center shadow-md"
              style={{ color: palette.soft }}
            >
              <WebIcon name={courseIconName} className="w-[7cqw] h-[7cqw] min-w-[22px] min-h-[22px]" />
            </div>

            <h3
              className="m-0 font-extrabold tracking-tight text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              style={{
                fontFamily: BOOK_COVER_DISPLAY_FONT,
                fontSize: titleFontSize,
                lineHeight: 1.18,
              }}
            >
              {cleanTitle}
            </h3>

            <p
              className="m-0 font-semibold leading-snug text-center"
              style={{ fontSize: subtitleFontSize, color: palette.soft }}
            >
              {subtitleLeft} · {subtitleRight}
            </p>

            {summaryText && (
              <p
                className="m-0 text-center font-medium leading-[1.4] line-clamp-2 text-white/90"
                style={{ fontSize: summaryFontSize }}
              >
                {summaryText}
              </p>
            )}
          </div>

          <div className="relative z-10 w-full flex flex-col items-center gap-[2cqw]">
            <div className="w-full flex items-center justify-between gap-2">
              <span className="font-semibold text-white/92 truncate" style={{ fontSize: metaFontSize }}>
                {course.issuer}
              </span>
              <span
                className="font-extrabold tabular-nums px-[2.2cqw] py-[0.6cqw] rounded bg-black/28 border border-white/20 text-white/95 shrink-0"
                style={{ fontSize: metaFontSize }}
              >
                {course.year}
              </span>
            </div>
            <div
              className="w-full h-[3px] rounded-full opacity-85"
              style={{ background: palette.soft }}
              aria-hidden="true"
            />
          </div>
        </>
      )}

      {/* 5. MẪU BÌA VJY-LAYERED (Mặc định: Huy hiệu bo góc + Tiêu đề lớn + Colophon chân trang) */}
      {template === 'vjy-layered' && (
        <>
          <div className="relative z-10 flex items-center justify-between gap-2 w-full">
            <span
              className="font-bold tracking-wide truncate px-[2.2cqw] py-[0.8cqw] rounded-md bg-black/26 border border-white/18"
              style={{ fontSize: metaFontSize, color: palette.soft }}
            >
              {categoryLabel}
            </span>
            <span
              className="font-bold tabular-nums text-white/90 shrink-0"
              style={{ fontSize: metaFontSize }}
            >
              {shortCode}
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-start gap-[2.4cqw] my-auto w-full">
            <div
              className="w-[13cqw] h-[13cqw] min-w-[42px] min-h-[42px] max-w-[56px] max-h-[56px] rounded-xl flex items-center justify-center bg-black/24 border border-white/24 shadow-md"
              style={{ color: palette.soft }}
            >
              <WebIcon name={courseIconName} className="w-[6.5cqw] h-[6.5cqw] min-w-[20px] min-h-[20px]" />
            </div>

            <h3
              className="m-0 font-extrabold tracking-tight text-white text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.48)]"
              style={{
                fontFamily: BOOK_COVER_DISPLAY_FONT,
                fontSize: titleFontSize,
                lineHeight: 1.18,
              }}
            >
              {cleanTitle}
            </h3>

            <p
              className="m-0 font-semibold leading-snug text-left"
              style={{ fontSize: subtitleFontSize, color: palette.soft }}
            >
              {subtitleLeft} · {isEn ? `Year ${course.year}` : `Năm ${course.year}`}
            </p>

            {summaryText && (
              <p
                className="m-0 text-left font-medium leading-[1.42] line-clamp-3 text-white/92 pt-[1.5cqw] border-t border-white/20 w-full"
                style={{ fontSize: summaryFontSize }}
              >
                {summaryText}
              </p>
            )}
          </div>

          <div className="relative z-10 pt-[2.2cqw] border-t border-white/22 flex items-center justify-between gap-2 w-full">
            <span className="font-semibold text-white/92 truncate" style={{ fontSize: metaFontSize }}>
              {course.issuer}
            </span>
            <WebIcon
              name="arrow-up-right"
              className="w-[4cqw] h-[4cqw] min-w-[14px] min-h-[14px] shrink-0 opacity-90"
              style={{ color: palette.soft }}
            />
          </div>
        </>
      )}
    </div>
  );
};

