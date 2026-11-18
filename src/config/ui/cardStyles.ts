import React from 'react';
import { CardStyleMode, CardStyleConfig, ThemeFamilyId, ThemeMechanismMode } from './theme.types';
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
  colorMode?: CardStyleMode;
  presets: CardStyleConfig[];
}

export const THEME_FAMILY_DEFINITIONS: Array<Omit<ThemeFamilyGroupMeta, 'presets'>> = [
  {
    id: 'light-multicolor-glass',
    label: 'Gương kính mờ',
    labelEn: 'Mirror Glass',
    description: 'Gương đơn sắc (sáng), Gương Neon màu (tối) & Gương đa sắc (màu)',
    descriptionEn: 'Monochrome Glass (Light), Neon Color Glass (Dark) & Multicolor Glass (Color)',
    icon: 'sparkles',
    defaultMode: 'light-multicolor-glass',
    lightMode: 'light-multicolor-glass',
    darkMode: 'light-multicolor-glass-dark',
    colorMode: 'light-multicolor-glass-color',
  },
  {
    id: 'cowhide-leather',
    label: 'Chất liệu da',
    labelEn: 'Leather Material',
    description: 'Chất liệu da (màu trắng), Chất liệu da (màu đen) & Chất liệu da (màu nâu)',
    descriptionEn: 'Leather Material (White), Leather Material (Black) & Leather Material (Brown)',
    icon: 'briefcase',
    defaultMode: 'cowhide-leather',
    lightMode: 'light-cowhide-leather',
    darkMode: 'black-cowhide-leather',
    colorMode: 'cowhide-leather',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
  {
    id: 'light-multicolor-glass',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương kính mờ',
    familyLabelEn: 'Mirror Glass',
    mechanism: 'light',
    counterpartMode: 'light-multicolor-glass-dark',
    cardClassName: 'card-light-multicolor-glass',
    name: 'Gương đơn sắc (sáng)',
    label: 'Gương đơn sắc (sáng)',
    shortBadge: 'Gương đơn sắc (sáng)',
    tagLabel: 'Gương đơn sắc (sáng) · Frosted Glass',
    modeLabel: 'Gương đơn sắc (sáng)',
    isDark: false,
    icon: 'sun',
    color: '#334155',
    desc: 'Kính mờ đơn sắc sáng tông trắng băng tinh khiết, độ mờ Blur sâu, viền phản quang sắc nét và chữ đen #000000 chuẩn WCAG 2.2.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(255, 255, 255, 0.86) 0%, rgba(244, 247, 252, 0.74) 50%, rgba(235, 240, 248, 0.78) 100%)',
      backdropFilter: 'blur(28px) saturate(135%)',
      WebkitBackdropFilter: 'blur(28px) saturate(135%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.94)',
      boxShadow:
        '0 14px 32px -10px rgba(15, 23, 42, 0.12), 0 6px 16px -6px rgba(51, 65, 85, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(241, 245, 249, 0.82) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.94)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.96)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.94)',
      color: '#000000',
      borderColor: 'rgba(148, 163, 184, 0.35)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #334155 0%, #1E293B 55%, #0F172A 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/90 text-black border-slate-300',
  },
  {
    id: 'light-multicolor-glass-dark',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương kính mờ',
    familyLabelEn: 'Mirror Glass',
    mechanism: 'dark',
    counterpartMode: 'light-multicolor-glass',
    cardClassName: 'card-light-multicolor-glass-dark',
    name: 'Gương Neon màu (tối)',
    label: 'Gương Neon màu (tối)',
    shortBadge: 'Gương Neon màu (tối)',
    tagLabel: 'Gương Neon màu (tối) · Obsidian Neon',
    modeLabel: 'Gương Neon màu (tối)',
    isDark: true,
    icon: 'moon',
    color: '#8B5CF6',
    desc: 'Phiên bản chế độ tối Gương Neon màu: kính mờ lăng kính Neon đa màu dịu sâu, không lóa, bảo toàn chữ trắng #FFFFFF chuẩn WCAG 2.2.',
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
    id: 'light-multicolor-glass-color',
    familyId: 'light-multicolor-glass',
    familyLabel: 'Gương kính mờ',
    familyLabelEn: 'Mirror Glass',
    mechanism: 'color',
    counterpartMode: 'light-multicolor-glass-dark',
    cardClassName: 'card-light-multicolor-glass-color',
    name: 'Gương đa sắc (màu)',
    label: 'Gương đa sắc (màu)',
    shortBadge: 'Gương đa sắc (màu)',
    tagLabel: 'Gương đa sắc (màu) · Random Prism',
    modeLabel: 'Gương đa sắc (màu)',
    isDark: false,
    icon: 'palette',
    color: '#DD4E9E',
    desc: 'Định dạng giống Gương đơn sắc (sáng) với kính mờ trong trẻo và chữ đen #000000 sắc nét, nhưng nền mỗi thẻ có nhiều màu sắc ngẫu nhiên tươi tắn.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(236, 254, 255, 0.84) 0%, rgba(245, 243, 255, 0.78) 48%, rgba(253, 242, 248, 0.80) 100%)',
      backdropFilter: 'blur(28px) saturate(165%)',
      WebkitBackdropFilter: 'blur(28px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.92)',
      boxShadow:
        '0 14px 32px -10px rgba(99, 83, 181, 0.18), 0 6px 16px -6px rgba(221, 78, 158, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(239, 246, 255, 0.86) 0%, rgba(245, 243, 255, 0.82) 50%, rgba(253, 242, 248, 0.86) 100%)',
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
    id: 'light-cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Chất liệu da',
    familyLabelEn: 'Leather Material',
    mechanism: 'light',
    counterpartMode: 'black-cowhide-leather',
    cardClassName: 'card-light-cowhide-leather card-white-pebbled-leather',
    name: 'Chất liệu da (màu trắng)',
    label: 'Chất liệu da (màu trắng)',
    shortBadge: 'Chất liệu da (màu trắng)',
    tagLabel: 'Chất liệu da (màu trắng) · Chỉ khâu',
    modeLabel: 'Chất liệu da (màu trắng)',
    isDark: false,
    icon: 'sun',
    color: '#111827',
    desc: 'Chất liệu da màu trắng thanh lịch viền nổi với đường chỉ khâu tay viền đứt nét và sắc chữ tương phản cao rõ ràng.',
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
    id: 'black-cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Chất liệu da',
    familyLabelEn: 'Leather Material',
    mechanism: 'dark',
    counterpartMode: 'light-cowhide-leather',
    cardClassName: 'card-black-cowhide-leather',
    name: 'Chất liệu da (màu đen)',
    label: 'Chất liệu da (màu đen)',
    shortBadge: 'Chất liệu da (màu đen)',
    tagLabel: 'Chất liệu da (màu đen) · Chỉ khâu',
    modeLabel: 'Chất liệu da (màu đen)',
    isDark: true,
    icon: 'moon',
    color: '#94A3B8',
    desc: 'Chất liệu da màu đen mờ lì (#252830 → #15171C) kết hợp chỉ khâu bạch kim đứt nét và độ tương phản chữ trắng #FFFFFF sắc nét.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #252830 0%, #15171c 52%, #1d2027 100%)',
      borderRadius: '14px',
      border: '2px solid #090a0d',
      boxShadow:
        '0 18px 38px rgba(0, 0, 0, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.12), inset 0 -3px 6px rgba(0, 0, 0, 0.72)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #1d2027 0%, #111318 100%)',
      borderColor: 'rgba(226, 232, 240, 0.45)',
      borderStyle: 'dashed',
      borderWidth: '1.5px',
    },
    miniTabStyle: {
      background: 'rgba(24, 27, 34, 0.94)',
      color: '#FFFFFF',
      borderColor: 'rgba(226, 232, 240, 0.34)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#121419] text-white border-[#334155]',
  },
  {
    id: 'cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Chất liệu da',
    familyLabelEn: 'Leather Material',
    mechanism: 'color',
    counterpartMode: 'light-cowhide-leather',
    cardClassName: 'card-cowhide-leather',
    name: 'Chất liệu da (màu nâu)',
    label: 'Chất liệu da (màu nâu)',
    shortBadge: 'Chất liệu da (màu nâu)',
    tagLabel: 'Chất liệu da (màu nâu) · Chỉ khâu',
    modeLabel: 'Chất liệu da (màu nâu)',
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
  'light-multicolor-glass': {
    familyId: 'light-multicolor-glass',
    label: 'Gương kính mờ',
    labelEn: 'Mirror Glass',
    description: 'Gương đơn sắc (sáng), Gương Neon màu (tối) & Gương đa sắc (màu)',
    descriptionEn: 'Monochrome Glass (Light), Neon Color Glass (Dark) & Multicolor Glass (Color)',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['light-multicolor-glass'],
    dark: CARD_STYLES_MAP['light-multicolor-glass-dark'],
    color: CARD_STYLES_MAP['light-multicolor-glass-color'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Chất liệu da',
    labelEn: 'Leather Material',
    description: 'Chất liệu da (màu trắng), Chất liệu da (màu đen) & Chất liệu da (màu nâu)',
    descriptionEn: 'Leather Material (White), Leather Material (Black) & Leather Material (Brown)',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['light-cowhide-leather'],
    dark: CARD_STYLES_MAP['black-cowhide-leather'],
    color: CARD_STYLES_MAP['cowhide-leather'],
  },
};

export const getCardStyleProperties = (styleId: CardStyleMode, isDark?: boolean): CardStyleConfig => {
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

export const normalizeCardStyle = (raw: string | null | undefined): CardStyleMode => {
  if (!raw) return DEFAULT_CARD_STYLE;
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
};
