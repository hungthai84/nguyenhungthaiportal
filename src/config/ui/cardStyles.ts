import React from 'react';
import { CardStyleMode, CardStyleConfig, ThemeFamilyId } from './theme.types';
import { DEFAULT_CARD_STYLE } from './themeDefaults';

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
  presets: CardStyleConfig[];
}

export const THEME_FAMILY_DEFINITIONS: Array<Omit<ThemeFamilyGroupMeta, 'presets'>> = [
  {
    id: 'light-multicolor-glass',
    label: 'Gương đa sắc',
    labelEn: 'Multicolor Glass',
    description: 'Kính mờ Mica đa sắc tươi sáng (Sáng) & kính mờ tối Obsidian Neon đa sắc (Tối)',
    descriptionEn: 'Luminous Multicolor Mica Glass (Light) & Obsidian Neon Multicolor Glass (Dark)',
    icon: 'sparkles',
    defaultMode: 'light-multicolor-glass',
    lightMode: 'light-multicolor-glass',
    darkMode: 'dark-neon-multicolor-glass',
  },
  {
    id: 'cowhide-leather',
    label: 'Da thuộc thủ công',
    labelEn: 'Artisan Leather Craft',
    description: 'Chất liệu da cá sấu trắng chỉ đen (Sáng) & da bò nâu chỉ kem (Tối)',
    descriptionEn: 'White Crocodile Leather with black stitching (Light) & Classic Brown Cowhide (Dark)',
    icon: 'briefcase',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
  {
    id: 'light-multicolor-glass',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương đa sắc',
    familyLabelEn: 'Multicolor Glass',
    counterpartMode: 'dark-neon-multicolor-glass',
    cardClassName: 'card-light-multicolor-glass',
    name: 'Gương đa sắc',
    label: 'Gương đa sắc (Sáng)',
    shortBadge: 'Gương Đa Sắc',
    tagLabel: 'Gương đa sắc · Mica Prism',
    modeLabel: 'Sáng (Chính)',
    isDark: false,
    icon: 'sparkles',
    color: '#DD4E9E',
    desc: 'Kính mờ Mica đa sắc tươi tắn (Pink, Purple, Blue, Cyan, Green, Orange, Yellow, Multicolor Gradient Glass) kết hợp Blur sâu, viền phản quang tinh tế, hỗ trợ đầy đủ chế độ Sáng & Tối.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(255, 255, 255, 0.84) 0%, rgba(239, 246, 255, 0.72) 48%, rgba(253, 242, 248, 0.72) 100%)',
      backdropFilter: 'blur(28px) saturate(165%)',
      WebkitBackdropFilter: 'blur(28px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.92)',
      boxShadow:
        '0 14px 32px -10px rgba(99, 83, 181, 0.16), 0 6px 16px -6px rgba(221, 78, 158, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(239, 246, 255, 0.85) 0%, rgba(245, 243, 255, 0.80) 50%, rgba(253, 242, 248, 0.85) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.92)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.96)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.92)',
      color: '#000000',
      borderColor: 'rgba(20, 128, 192, 0.25)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #1480C0 0%, #6353B5 52%, #DD4E9E 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/85 text-black border-pink-200',
  },
  {
    id: 'light-multicolor-glass-dark',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương đa sắc',
    familyLabelEn: 'Multicolor Glass',
    counterpartMode: 'light-multicolor-glass',
    cardClassName: 'card-light-multicolor-glass-dark',
    name: 'Gương đa sắc (Tối)',
    label: 'Gương đa sắc (Tối)',
    shortBadge: 'Gương Đa Sắc · Tối',
    tagLabel: 'Gương đa sắc · Dark Compatible',
    modeLabel: 'Tương thích Tối',
    isDark: true,
    icon: 'moon',
    color: '#6353B5',
    desc: 'Phiên bản chế độ Tối của Gương đa sắc: kính mờ lăng kính đa sắc dịu sâu, không lóa, bảo toàn chữ trắng #FFFFFF chuẩn WCAG 2.2.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(26, 30, 56, 0.82) 0%, rgba(20, 24, 46, 0.78) 52%, rgba(30, 22, 48, 0.80) 100%)',
      backdropFilter: 'blur(26px) saturate(160%)',
      WebkitBackdropFilter: 'blur(26px) saturate(160%)',
      borderRadius: '14px',
      border: '1px solid rgba(167, 139, 250, 0.28)',
      boxShadow:
        '0 18px 42px -12px rgba(4, 6, 18, 0.72), 0 6px 16px -6px rgba(99, 83, 181, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(22, 28, 54, 0.88) 0%, rgba(30, 24, 52, 0.85) 100%)',
      borderColor: 'rgba(167, 139, 250, 0.28)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.12)',
    },
    miniTabStyle: {
      background: 'rgba(30, 38, 72, 0.88)',
      color: '#FFFFFF',
      borderColor: 'rgba(167, 139, 250, 0.28)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #3BB8E6 0%, #A78BFA 52%, #DD4E9E 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-indigo-950/90 text-white border-violet-400/35',
  },
  {
    id: 'dark-neon-multicolor-glass-light',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương đa sắc',
    familyLabelEn: 'Multicolor Glass',
    counterpartMode: 'dark-neon-multicolor-glass',
    cardClassName: 'card-dark-neon-multicolor-glass-light',
    name: 'Gương đa sắc (Sáng Neon)',
    label: 'Gương đa sắc (Tương thích Sáng Neon)',
    shortBadge: 'Gương Đa Sắc · Sáng',
    tagLabel: 'Gương đa sắc · Light Neon Compatible',
    modeLabel: 'Tương thích Sáng',
    isDark: false,
    icon: 'sun',
    color: '#0E7490',
    desc: 'Phiên bản tương thích chế độ Sáng của Gương đa sắc Neon: kính công nghệ trong trẻo với viền Electric Jewel dịu mắt và chữ đen #0F172A sắc nét.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(248, 250, 255, 0.86) 0%, rgba(240, 249, 255, 0.80) 52%, rgba(245, 243, 255, 0.82) 100%)',
      backdropFilter: 'blur(24px) saturate(165%)',
      WebkitBackdropFilter: 'blur(24px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(14, 116, 144, 0.26)',
      boxShadow:
        '0 14px 32px -10px rgba(15, 23, 42, 0.14), 0 4px 14px -4px rgba(41, 121, 255, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(241, 247, 255, 0.90)',
      borderColor: 'rgba(14, 116, 144, 0.25)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.96)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.94)',
      color: '#000000',
      borderColor: 'rgba(14, 116, 144, 0.28)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0E7490 0%, #2979FF 52%, #7E22CE 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-cyan-50/95 text-slate-900 border-cyan-600/30',
  },
  {
    id: 'dark-neon-multicolor-glass',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương đa sắc',
    familyLabelEn: 'Multicolor Glass',
    counterpartMode: 'light-multicolor-glass',
    cardClassName: 'card-dark-neon-multicolor-glass',
    name: 'Gương đa sắc (Tối)',
    label: 'Gương đa sắc (Tối Obsidian Neon)',
    shortBadge: 'Gương Đa Sắc · Tối',
    tagLabel: 'Gương đa sắc · Obsidian Neon Dark',
    modeLabel: 'Tối (Chính)',
    isDark: true,
    icon: 'zap',
    color: '#00E5FF',
    desc: 'Kính mờ tối Obsidian đa sắc Neon phát quang có kiểm soát (Cyan, Blue, Electric Purple, Pink, Green, Lime, Yellow, Orange, Coral), tiêu đề & icon Neon dịu mắt, nội dung #FFFFFF sắc nét.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(13, 18, 32, 0.86) 0%, rgba(9, 13, 24, 0.84) 100%)',
      backdropFilter: 'blur(24px) saturate(190%)',
      WebkitBackdropFilter: 'blur(24px) saturate(190%)',
      borderRadius: '14px',
      border: '1px solid rgba(0, 229, 255, 0.35)',
      boxShadow:
        '0 18px 42px -12px rgba(0, 0, 0, 0.82), 0 0 22px -6px rgba(157, 78, 221, 0.28), inset 0 1px 0 rgba(0, 229, 255, 0.22)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(8, 12, 22, 0.88)',
      borderColor: 'rgba(157, 78, 221, 0.35)',
      boxShadow: 'inset 0 1px 1px rgba(0, 229, 255, 0.16)',
    },
    miniTabStyle: {
      background: 'rgba(15, 23, 42, 0.90)',
      color: '#FFFFFF',
      borderColor: 'rgba(0, 229, 255, 0.35)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #00E5FF 0%, #9D4EDD 52%, #FF3CAC 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-slate-950/90 text-white border-cyan-400/45',
  },
  {
    id: 'light-cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Nhóm Chất liệu Da Thủ Công',
    familyLabelEn: 'Artisan Leather Group',
    counterpartMode: 'cowhide-leather',
    cardClassName: 'card-light-cowhide-leather card-white-pebbled-leather',
    name: 'Da cá sấu trắng',
    label: 'Da cá sấu trắng thủ công (White Crocodile Leather)',
    shortBadge: 'Da Cá Sấu Trắng',
    tagLabel: 'Da cá sấu trắng · Chỉ khâu đen',
    modeLabel: 'Da cá sấu trắng',
    isDark: false,
    icon: 'sun',
    color: '#111827',
    desc: 'Chất liệu da cá sấu trắng ngọc trai (#fbfcfc → #edf1f4) viền nổi 2px #d1d5db, đường chỉ khâu tay đứt nét rgba(17, 24, 39, 0.65) và chữ #111827 sắc nét.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #fbfcfc 0%, #edf1f4 100%)',
      borderRadius: '14px',
      border: '2px solid #d1d5db',
      boxShadow:
        '0 18px 38px rgba(15, 23, 42, 0.12), inset 0 2px 4px #ffffff, inset 0 -3px 6px rgba(0, 0, 0, 0.08)',
      color: '#111827',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #fbfcfc 0%, #edf1f4 100%)',
      borderColor: 'rgba(17, 24, 39, 0.65)',
      borderStyle: 'dashed',
      borderWidth: '1.5px',
    },
    miniTabStyle: {
      background: '#fbfcfc',
      color: '#111827',
      borderColor: '#d1d5db',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#fbfcfc] text-[#111827] border-[#d1d5db]',
  },
  {
    id: 'cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Nhóm Chất liệu Da Bò',
    familyLabelEn: 'Cowhide Leather Group',
    counterpartMode: 'light-cowhide-leather',
    cardClassName: 'card-cowhide-leather',
    name: 'Chất liệu da bò',
    label: 'Chất liệu da bò (Full-Grain Cowhide Leather)',
    shortBadge: 'Da Bò · Thủ Công',
    tagLabel: 'Chất liệu da bò · Hand-Stitched',
    modeLabel: 'Da nâu bò thủ công',
    isDark: true,
    icon: 'briefcase',
    color: '#8B5A2B',
    desc: 'Mô phỏng da bò thật màu nâu cổ điển (#8B5A2B → #653A17) với đường chỉ khâu tay viền đứt nét và sắc chữ kem #FFF8DC sang trọng.',
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
}

export const THEME_REGISTRY: Record<ThemeFamilyId, ThemeFamilyRegistryEntry> = {
  'light-multicolor-glass': {
    familyId: 'light-multicolor-glass',
    label: 'Gương đa sắc',
    labelEn: 'Multicolor Glass',
    description: 'Kính mờ Mica đa sắc tươi sáng (Sáng) & Kính tối Obsidian Neon đa sắc (Tối)',
    descriptionEn: 'Multicolor Mica Glass (Light) & Obsidian Neon Multicolor (Dark)',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['light-multicolor-glass'],
    dark: CARD_STYLES_MAP['dark-neon-multicolor-glass'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Da thuộc thủ công',
    labelEn: 'Artisan Leather Craft',
    description: 'Da cá sấu trắng chỉ đen (Sáng) & Da bò nâu chỉ kem (Tối)',
    descriptionEn: 'White Crocodile Leather & Classic Brown Cowhide Leather',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['light-cowhide-leather'],
    dark: CARD_STYLES_MAP['cowhide-leather'],
  },
};

export const getCardStyleProperties = (styleId: CardStyleMode, isDark?: boolean): CardStyleConfig => {
  return CARD_STYLES_MAP[styleId] || CARD_STYLES_MAP[DEFAULT_CARD_STYLE] || UNIFIED_INTERFACE_THEMES[0];
};

export const getCardStyleConfig = getCardStyleProperties;

export const getLightDarkCounterpart = (styleId: CardStyleMode, targetDark?: boolean): CardStyleMode => {
  const config = CARD_STYLES_MAP[styleId];
  if (!config) return DEFAULT_CARD_STYLE;
  if (typeof targetDark === 'boolean') {
    if (config.isDark === targetDark) return styleId;
    return config.counterpartMode || styleId;
  }
  return config.counterpartMode || styleId;
};

export const normalizeCardStyle = (raw: string | null | undefined): CardStyleMode => {
  if (!raw) return DEFAULT_CARD_STYLE;
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
};
