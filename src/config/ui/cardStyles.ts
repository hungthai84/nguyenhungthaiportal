import React from 'react';
import { CardStyleMode, CardStyleConfig, ThemeFamilyId, ThemeMechanismMode } from './theme.types';
import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const THEME_FOUR_WORD_NAMES: Record<CardStyleMode, { vi: string; en: string }> = {
  'liquid-glass': { vi: 'Liquid Glass Sáng', en: 'Liquid Glass Light' },
  'dark-liquid-glass': { vi: 'Liquid Glass Tối', en: 'Liquid Glass Dark' },
  'multicolor-glass': { vi: 'Glass UI Đa Sắc', en: 'Multicolor Glass UI' },
  'cowhide-leather': { vi: 'Da Bò Cổ Điển', en: 'Brown Leather Classic Edition' },
  'deep-ocean': { vi: 'Đại Dương Sâu Thẳm', en: 'Deep Ocean Dark Blue' },
  'mica-fluent': { vi: 'Kính Mờ Hiện Đại', en: 'Mica Fluent Modern Light' },
  'neumorphism-beyond': {
    vi: 'Nổi Khối Kính Mờ',
    en: 'Soft UI Glass Beyond',
  },
};

export interface ThemeFamilyGroupMeta {
  id: ThemeFamilyId;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  defaultMode?: CardStyleMode;
  lightMode?: CardStyleMode;
  darkMode?: CardStyleMode;
  colorMode?: CardStyleMode;
  presets: CardStyleConfig[];
}

export const THEME_FAMILY_DEFINITIONS: Array<Omit<ThemeFamilyGroupMeta, 'presets'>> = [
  {
    id: 'liquid-glass',
    label: 'Liquid Glass UI',
    labelEn: 'Liquid Glass UI',
    description:
      'Vật liệu kính quang học trong suốt có viền specular highlight sáng mảnh, tint thích ứng theo nền và tách bạch rõ vùng nội dung sáng/tối sắc nét.',
    descriptionEn:
      'Optical glass material with subtle specular rim highlights, adaptive tint, and clear separation between floating glass chrome and readable content cards.',
    icon: 'sparkles',
    defaultMode: 'liquid-glass',
    lightMode: 'liquid-glass',
    darkMode: 'dark-liquid-glass',
  },
  {
    id: 'cowhide-leather',
    label: 'Chất liệu da',
    labelEn: 'Leather Material',
    description: 'Chất liệu da (màu nâu) với đường chỉ khâu tay viền đứt nét và sắc chữ kem tương phản cao.',
    descriptionEn: 'Classic brown cowhide leather craft with hand-stitched dashed rim and high-contrast cream typography.',
    icon: 'briefcase',
    defaultMode: 'cowhide-leather',
    colorMode: 'cowhide-leather',
  },
  {
    id: 'deep-ocean',
    label: 'Đại Dương Sâu',
    labelEn: 'Deep Ocean Dark',
    description: 'Deep Ocean Dark: nền navy sâu, ocean blue surfaces, chữ trắng xanh sáng & aqua accent.',
    descriptionEn: 'Deep Ocean Dark: deep navy background, ocean blue surfaces, bright blue-white text & aqua accent.',
    icon: 'compass',
    defaultMode: 'deep-ocean',
    darkMode: 'deep-ocean',
  },
  {
    id: 'mica-fluent',
    label: 'Mica Fluent',
    labelEn: 'Mica Fluent UI',
    description: 'Mica Fluent: phong cách Windows 11 Acrylic & Mica, nền mờ trong suốt, ánh sáng specular rim & bề mặt cao cấp.',
    descriptionEn: 'Mica Fluent: Windows 11 Acrylic & Mica style, translucent blur, specular rim highlights & premium surfaces.',
    icon: 'monitor',
    defaultMode: 'mica-fluent',
    lightMode: 'mica-fluent',
  },
  {
    id: 'neumorphism-beyond',
    label: 'Nổi Khối Kính Mờ',
    labelEn: 'Soft UI Glass Beyond',
    description:
      'Giao diện Neumorphism, Glassmorphism & Beyond: nổi khối kép kết hợp kính mờ hiện đại trên nền xám băng #EBF0F6 cùng hệ 6 sắc màu (#EE6AD2, #64B6FF, #4973FF, #445CE6, #2AD8E6, #52E0A8).',
    descriptionEn:
      'Neumorphism, Glassmorphism & Beyond: tactile Soft UI extrusion blended with frosted glassmorphism on cool ice-slate #EBF0F6 surfaces, accented with 6 vivid reference hues.',
    icon: 'sliders',
    defaultMode: 'neumorphism-beyond',
    lightMode: 'neumorphism-beyond',
  },
  {
    id: 'multicolor-glass',
    label: 'Glass UI Đa Sắc',
    labelEn: 'Multicolor Glass UI',
    description:
      'Giao diện Kính Trong Đa Sắc hiện đại với bề mặt card trong suốt phủ sắc độ xanh lam, tím iris, hồng phớt, ngọc mint và cam đào hòa quyện.',
    descriptionEn:
      'Modern translucent multicolor frosted glass UI with vibrant cyan, violet, rose, mint and warm peach glass card tints.',
    icon: 'sparkles',
    defaultMode: 'multicolor-glass',
    colorMode: 'multicolor-glass',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
  {
    id: 'liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Liquid Glass UI',
    familyLabelEn: 'Liquid Glass UI',
    mechanism: 'light',
    counterpartMode: 'dark-liquid-glass',
    cardClassName: 'card-liquid-glass',
    name: 'Liquid Glass UI (Sáng)',
    label: 'Liquid Glass UI (Sáng)',
    shortBadge: 'Liquid Sáng',
    tagLabel: 'Liquid Glass · Optical Light',
    modeLabel: 'Liquid Glass Sáng',
    isDark: false,
    icon: 'sparkles',
    color: '#4F46E5',
    desc: 'Vật liệu kính quang học trong suốt có viền specular rim sáng mảnh, thanh điều hướng nổi tinh tế và vùng thẻ nội dung sáng rõ chuẩn WCAG AA.',
    cardSampleStyle: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(238, 244, 255, 0.56) 100%)',
      backdropFilter: 'blur(24px) saturate(168%)',
      WebkitBackdropFilter: 'blur(24px) saturate(168%)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.92)',
      boxShadow:
        '0 18px 40px -10px rgba(30, 41, 59, 0.14), inset 0 1.5px 0 rgba(255, 255, 255, 0.96)',
      color: '#162036',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.86)',
      borderColor: 'rgba(255, 255, 255, 0.92)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.78)',
      color: '#162036',
      borderColor: 'rgba(255, 255, 255, 0.92)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/85 text-[#4F46E5] border-white/90',
  },
  {
    id: 'dark-liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Liquid Glass UI',
    familyLabelEn: 'Liquid Glass UI',
    mechanism: 'dark',
    counterpartMode: 'liquid-glass',
    cardClassName: 'card-dark-liquid-glass',
    name: 'Liquid Glass UI (Tối)',
    label: 'Liquid Glass UI (Tối)',
    shortBadge: 'Liquid Tối',
    tagLabel: 'Liquid Glass · Optical Dark',
    modeLabel: 'Liquid Glass Tối',
    isDark: true,
    icon: 'moon',
    color: '#818CF8',
    desc: 'Phiên bản kính quang học tối: nền sâu dịu mắt, viền phản quang specular rim mảnh và các khối nội dung tương phản rõ ràng.',
    cardSampleStyle: {
      background: 'linear-gradient(135deg, rgba(22, 34, 62, 0.74) 0%, rgba(14, 23, 44, 0.64) 100%)',
      backdropFilter: 'blur(24px) saturate(165%)',
      WebkitBackdropFilter: 'blur(24px) saturate(165%)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      boxShadow:
        '0 20px 44px -10px rgba(2, 6, 23, 0.62), inset 0 1px 0 rgba(255, 255, 255, 0.20)',
      color: '#F1F5F9',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(18, 29, 52, 0.88)',
      borderColor: 'rgba(255, 255, 255, 0.16)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(30, 45, 78, 0.86)',
      color: '#F1F5F9',
      borderColor: 'rgba(255, 255, 255, 0.20)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
      color: '#0B1221',
    },
    badgeColorClass: 'bg-[#121d34]/90 text-[#A5B4FC] border-white/20',
  },
  {
    id: 'cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Chất liệu da',
    familyLabelEn: 'Leather Material',
    mechanism: 'color',
    counterpartMode: 'liquid-glass',
    cardClassName: 'card-cowhide-leather',
    name: 'Chất liệu da (màu nâu)',
    label: 'Chất liệu da (màu nâu)',
    shortBadge: 'Da Bò Cổ Điển',
    tagLabel: 'Chất liệu da (màu nâu) · Chỉ khâu',
    modeLabel: 'Da Bò Cổ Điển',
    isDark: true,
    icon: 'briefcase',
    color: '#8B5A2B',
    desc: 'Mô phỏng chất liệu da màu nâu cổ điển (#8B5A2B → #653A17) với đường chỉ khâu tay viền đứt nét và sắc chữ kem #FFF8DC sang trọng.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #8B5A2B 0%, #653A17 50%, #7A4A20 100%)',
      border: '2px solid #522E10',
      boxShadow:
        '0 18px 38px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255, 220, 180, 0.25), inset 0 -3px 6px rgba(0, 0, 0, 0.6)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #7A4A20 0%, #522E10 100%)',
      borderColor: 'rgba(245, 222, 179, 0.48)',
      borderStyle: 'dashed',
    },
    miniTabStyle: {
      background: 'rgba(82, 46, 16, 0.88)',
      color: '#FFFFFF',
      borderColor: 'rgba(245, 222, 179, 0.45)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#522E10]/90 text-white border-[#F5DEB3]/50',
  },
  {
    id: 'deep-ocean',
    familyId: 'deep-ocean',
    familyLabel: 'Đại Dương Sâu',
    familyLabelEn: 'Deep Ocean Dark',
    mechanism: 'dark',
    counterpartMode: 'liquid-glass',
    cardClassName: 'card-deep-ocean',
    name: 'Đại Dương Sâu',
    label: 'Đại Dương Sâu',
    shortBadge: 'Đại Dương Sâu',
    tagLabel: 'Deep Ocean Dark · Navy & Aqua',
    modeLabel: 'Deep Ocean',
    isDark: true,
    icon: 'compass',
    color: '#38BDF8',
    desc: 'Giao diện Deep Ocean tối: nền navy đại dương sâu thẳm (#050B14), các lớp surface xanh đại dương, chữ sáng xanh và điểm nhấn aqua/turquoise.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #101C38 0%, #0A1128 50%, #050B14 100%)',
      borderRadius: '14px',
      border: '1px solid rgba(56, 189, 248, 0.35)',
      boxShadow: '0 18px 38px rgba(5, 11, 20, 0.75), inset 0 1px 2px rgba(56, 189, 248, 0.25)',
      color: '#E2E8F0',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #101C38 0%, #050B14 100%)',
      borderColor: 'rgba(56, 189, 248, 0.45)',
    },
    miniTabStyle: {
      background: '#101C38',
      color: '#E2E8F0',
      borderColor: 'rgba(56, 189, 248, 0.35)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#101C38] text-sky-200 border-sky-400/40',
  },
  {
    id: 'mica-fluent',
    familyId: 'mica-fluent',
    familyLabel: 'Mica Fluent',
    familyLabelEn: 'Mica Fluent UI',
    mechanism: 'light',
    counterpartMode: 'dark-liquid-glass',
    cardClassName: 'card-mica-fluent',
    name: 'Mica Fluent',
    label: 'Mica Fluent',
    shortBadge: 'Mica Fluent',
    tagLabel: 'Windows 11 · Mica & Acrylic',
    modeLabel: 'Mica Fluent',
    isDark: false,
    icon: 'monitor',
    color: '#0067C0',
    desc: 'Giao diện Mica Fluent cảm hứng từ Windows 11: hiệu ứng mờ acrylic mượt mà, phản chiếu ánh sáng specular tinh tế và các bề mặt nổi hiện đại.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(240,240,240,0.85) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.12)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
      color: '#1F1F1F',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #F3F3F3 0%, #E5E5E5 100%)',
      borderColor: 'rgba(0,0,0,0.12)',
    },
    miniTabStyle: {
      background: '#FFFFFF',
      color: '#1F1F1F',
      borderColor: 'rgba(0,0,0,0.12)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0067C0 0%, #2B88D8 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/90 text-[#0067C0] border-black/10',
  },
  {
    id: 'neumorphism-beyond',
    familyId: 'neumorphism-beyond',
    familyLabel: 'Nổi Khối Kính Mờ',
    familyLabelEn: 'Soft UI Glass Beyond',
    mechanism: 'light',
    counterpartMode: 'dark-liquid-glass',
    cardClassName: 'card-neumorphism-beyond',
    name: 'Nổi Khối Kính Mờ',
    label: 'Nổi Khối Kính Mờ',
    shortBadge: 'Nổi Khối Kính Mờ',
    tagLabel: 'Neumorphism · Glass · 6 Màu',
    modeLabel: 'Nổi Khối Kính Mờ',
    isDark: false,
    icon: 'sliders',
    color: '#4973FF',
    desc: 'Giao diện Neumorphism, Glassmorphism & Beyond nổi khối kép sắc nét, không phát sáng trên nền #EBF0F6 với bộ 6 màu (#EE6AD2, #64B6FF, #4973FF, #445CE6, #2AD8E6, #52E0A8).',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, rgba(235, 240, 247, 0.94) 0%, rgba(226, 232, 241, 0.90) 100%)',
      backdropFilter: 'blur(14px) saturate(105%)',
      WebkitBackdropFilter: 'blur(14px) saturate(105%)',
      borderRadius: '14px',
      border: '1px solid rgba(196, 209, 226, 0.72)',
      boxShadow:
        '0 5px 14px rgba(148, 163, 184, 0.18), 3px 4px 10px rgba(163, 177, 198, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.34)',
      color: '#1E293B',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #EAEFF6 0%, #E1E8F2 100%)',
      borderColor: 'rgba(196, 209, 226, 0.72)',
      boxShadow: 'inset 2px 2px 5px rgba(163, 177, 198, 0.38), inset -2px -2px 4px rgba(255, 255, 255, 0.42)',
    },
    miniTabStyle: {
      background: '#E8EEF6',
      color: '#1E293B',
      borderColor: 'rgba(196, 209, 226, 0.74)',
      boxShadow: '0 2px 6px rgba(148, 163, 184, 0.16), 2px 2px 6px rgba(163, 177, 198, 0.22)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #4973FF 0%, #64B6FF 55%, #2AD8E6 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#E5EBF3] text-[#4973FF] border-[#C4D1E2]',
  },
  {
    id: 'multicolor-glass',
    familyId: 'multicolor-glass',
    familyLabel: 'Glass UI Đa Sắc',
    familyLabelEn: 'Multicolor Glass UI',
    mechanism: 'color',
    counterpartMode: 'dark-liquid-glass',
    cardClassName: 'card-multicolor-glass',
    name: 'Glass UI Đa Sắc',
    label: 'Glass UI Đa Sắc',
    shortBadge: 'Glass Đa Sắc',
    tagLabel: 'Glass UI · Đa sắc trong suốt',
    modeLabel: 'Glass UI Đa Sắc',
    isDark: false,
    icon: 'sparkles',
    color: '#6366F1',
    desc: 'Giao diện Glass UI nền card trong suốt đa màu sắc hiện đại: hiệu ứng kính mờ bão hòa cao kết hợp sắc độ Cyan, Tím Iris, Hồng Blush và Mint.',
    cardSampleStyle: {
      background:
        'linear-gradient(135deg, rgba(212, 240, 255, 0.56) 0%, rgba(238, 224, 255, 0.52) 52%, rgba(255, 228, 244, 0.54) 100%)',
      backdropFilter: 'blur(22px) saturate(185%)',
      WebkitBackdropFilter: 'blur(22px) saturate(185%)',
      borderRadius: '22px',
      border: '1px solid rgba(255, 255, 255, 0.84)',
      boxShadow:
        '0 14px 34px -8px rgba(79, 70, 229, 0.16), inset 0 1.5px 0 rgba(255, 255, 255, 0.92)',
      color: '#0F172A',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(216, 242, 255, 0.68) 0%, rgba(242, 228, 255, 0.62) 52%, rgba(255, 232, 245, 0.66) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.86)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.56)',
      color: '#0F172A',
      borderColor: 'rgba(255, 255, 255, 0.84)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 52%, #06B6D4 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/75 text-[#4F46E5] border-white/85',
  },
];

export const VALID_CARD_STYLES: CardStyleMode[] = UNIFIED_INTERFACE_THEMES.map((theme) => theme.id);

export const CARD_STYLES_MAP: Record<CardStyleMode, CardStyleConfig> = UNIFIED_INTERFACE_THEMES.reduce(
  (acc, theme) => {
    acc[theme.id] = theme;
    return acc;
  },
  {} as Record<CardStyleMode, CardStyleConfig>
);

export const CARD_STYLE_PRESETS_LIST: CardStyleConfig[] = UNIFIED_INTERFACE_THEMES;

export const CARD_STYLE_GROUPS: ThemeFamilyGroupMeta[] = THEME_FAMILY_DEFINITIONS.map((group) => ({
  ...group,
  presets: UNIFIED_INTERFACE_THEMES.filter((theme) => theme.familyId === group.id),
}));

export interface ThemeFamilyRegistryEntry {
  familyId: ThemeFamilyId;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  light: CardStyleConfig;
  dark: CardStyleConfig;
  color?: CardStyleConfig;
}

export const THEME_REGISTRY: Record<ThemeFamilyId, ThemeFamilyRegistryEntry> = {
  'liquid-glass': {
    familyId: 'liquid-glass',
    label: 'Liquid Glass UI',
    labelEn: 'Liquid Glass UI',
    description:
      'Vật liệu kính quang học trong suốt có viền specular highlight sáng mảnh, tint thích ứng theo nền.',
    descriptionEn: 'Optical glass material with subtle specular rim highlights and adaptive tint.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['liquid-glass'],
    dark: CARD_STYLES_MAP['dark-liquid-glass'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Chất liệu da',
    labelEn: 'Leather Material',
    description: 'Chất liệu da (màu nâu) với đường chỉ khâu tay viền đứt nét.',
    descriptionEn: 'Classic brown cowhide leather craft.',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['cowhide-leather'],
    dark: CARD_STYLES_MAP['cowhide-leather'],
    color: CARD_STYLES_MAP['cowhide-leather'],
  },
  'deep-ocean': {
    familyId: 'deep-ocean',
    label: 'Đại Dương Sâu',
    labelEn: 'Deep Ocean Dark',
    description: 'Deep Ocean Dark: nền navy sâu, ocean blue surfaces, chữ trắng xanh sáng & aqua accent',
    descriptionEn: 'Deep Ocean Dark: deep navy background, ocean blue surfaces, bright blue-white text & aqua accent',
    icon: 'compass',
    light: CARD_STYLES_MAP['deep-ocean'],
    dark: CARD_STYLES_MAP['deep-ocean'],
  },
  'mica-fluent': {
    familyId: 'mica-fluent',
    label: 'Mica Fluent',
    labelEn: 'Mica Fluent UI',
    description: 'Mica Fluent: phong cách Windows 11 Acrylic & Mica, nền mờ trong suốt, ánh sáng specular rim & bề mặt cao cấp',
    descriptionEn: 'Mica Fluent: Windows 11 Acrylic & Mica style, translucent blur, specular rim highlights & premium surfaces',
    icon: 'monitor',
    light: CARD_STYLES_MAP['mica-fluent'],
    dark: CARD_STYLES_MAP['mica-fluent'],
  },
  'neumorphism-beyond': {
    familyId: 'neumorphism-beyond',
    label: 'Nổi Khối Kính Mờ',
    labelEn: 'Soft UI Glass Beyond',
    description: 'Neumorphism, Glassmorphism & Beyond nổi khối kép sắc nét cùng 6 sắc màu chuẩn trên nền #EBF0F6.',
    descriptionEn: 'Neumorphism, Glassmorphism & Beyond dual-shadow extrusion paired with frosted glass and 6 reference accents on #EBF0F6.',
    icon: 'sliders',
    light: CARD_STYLES_MAP['neumorphism-beyond'],
    dark: CARD_STYLES_MAP['neumorphism-beyond'],
  },
  'multicolor-glass': {
    familyId: 'multicolor-glass',
    label: 'Glass UI Đa Sắc',
    labelEn: 'Multicolor Glass UI',
    description: 'Glass UI nền card trong suốt đa màu sắc hiện đại.',
    descriptionEn: 'Modern translucent multicolor frosted glass UI.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['multicolor-glass'],
    dark: CARD_STYLES_MAP['multicolor-glass'],
    color: CARD_STYLES_MAP['multicolor-glass'],
  },
};

export const getCardStyleProperties = (styleId: CardStyleMode, _isDark?: boolean): CardStyleConfig => {
  return CARD_STYLES_MAP[styleId] || CARD_STYLES_MAP[DEFAULT_CARD_STYLE] || UNIFIED_INTERFACE_THEMES[0];
};

export const getCardStyleConfig = getCardStyleProperties;

export const getLightDarkCounterpart = (styleId: CardStyleMode, targetDark?: boolean): CardStyleMode => {
  const config = CARD_STYLES_MAP[styleId];
  if (!config) return DEFAULT_CARD_STYLE;
  const group = CARD_STYLE_GROUPS.find((g) => g.id === config.familyId);
  if (typeof targetDark === 'boolean') {
    if (group) {
      if (targetDark && group.darkMode) return group.darkMode;
      if (!targetDark && group.lightMode) return group.lightMode;
    }
    if (config.isDark === targetDark) return styleId;
    return config.counterpartMode || styleId;
  }
  return config.counterpartMode || styleId;
};

export const getThemeForMechanism = (
  styleId: CardStyleMode,
  mechanism: ThemeMechanismMode
): CardStyleMode => {
  const currentConfig = CARD_STYLES_MAP[styleId] || CARD_STYLES_MAP[DEFAULT_CARD_STYLE];
  const currentGroup = CARD_STYLE_GROUPS.find((g) => g.id === currentConfig.familyId);

  const pickFromGroup = (group: ThemeFamilyGroupMeta | undefined): CardStyleMode | undefined => {
    if (!group) return undefined;
    if (mechanism === 'light') return group.lightMode;
    if (mechanism === 'dark') return group.darkMode;
    return group.colorMode;
  };

  const sameFamilyMatch = pickFromGroup(currentGroup);
  if (sameFamilyMatch) return sameFamilyMatch;

  const fallbackGroup = CARD_STYLE_GROUPS.find((g) => Boolean(pickFromGroup(g)));
  return pickFromGroup(fallbackGroup) || DEFAULT_CARD_STYLE;
};

const DELETED_THEME_MIGRATION_MAP: Record<string, CardStyleMode> = {
  'light-cowhide-leather': 'liquid-glass',
  'black-cowhide-leather': 'dark-liquid-glass',
  'ice-blue-neu': 'liquid-glass',
  'dark-ice-blue-neu': 'dark-liquid-glass',
  'glass-flat': 'liquid-glass',
  'rainbow-glass': 'liquid-glass',
  'dark-rainbow-glass': 'dark-liquid-glass',
  'special-rainbow-glass': 'dark-liquid-glass',
};

export const normalizeCardStyle = (raw: string | null | undefined): CardStyleMode => {
  if (!raw) return DEFAULT_CARD_STYLE;
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  if (raw in DELETED_THEME_MIGRATION_MAP) {
    return DELETED_THEME_MIGRATION_MAP[raw];
  }
  return DEFAULT_CARD_STYLE;
};
