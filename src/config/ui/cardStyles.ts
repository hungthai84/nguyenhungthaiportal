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
  {
    id: 'ice-blue-neu',
    label: 'Ice-Blue Soft UI',
    labelEn: 'Ice-Blue Neumorphism',
    description: 'Ice-Blue Soft UI (Sáng #e6f0f8) & Dark Ice-Blue Neu (Tối #152030) đổ bóng kép & thanh gradient phát sáng',
    descriptionEn: 'Ice-Blue Soft UI (Light #e6f0f8) & Dark Ice-Blue Neu (Dark #152030) dual soft shadows & glowing bars',
    icon: 'snowflake',
    defaultMode: 'ice-blue-neu',
    lightMode: 'ice-blue-neu',
    darkMode: 'dark-ice-blue-neu',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
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
  {
    id: 'ice-blue-neu',
    familyId: 'ice-blue-neu',
    familyLabel: 'Ice-Blue Soft UI',
    familyLabelEn: 'Ice-Blue Neumorphism',
    mechanism: 'light',
    counterpartMode: 'dark-ice-blue-neu',
    cardClassName: 'card-ice-blue-neu',
    name: 'Ice-Blue Soft UI (Sáng)',
    label: 'Ice-Blue Soft UI (Sáng)',
    shortBadge: 'Ice-Blue Neu',
    tagLabel: '#77 Ice-Blue Soft UI · Neumorphism Sáng',
    modeLabel: 'Ice-Blue Soft UI',
    isDark: false,
    icon: 'snowflake',
    color: '#6366F1',
    desc: 'Nền xanh băng nhạt (#e6f0f8) đổ bóng nổi/chìm mềm mại kết hợp bo góc 28px và các thanh tiến trình gradient Cyan, Tím, Cam đào & Hồng phát sáng.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #edf4fa 0%, #e4eef7 100%)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderRadius: '28px',
      border: '1px solid rgba(255, 255, 255, 0.85)',
      boxShadow:
        '12px 12px 26px rgba(176, 198, 219, 0.7), -10px -10px 22px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.9)',
      color: '#334155',
    },
    miniPreviewWrapStyle: {
      background: '#e5eff8',
      borderColor: 'rgba(255, 255, 255, 0.85)',
      boxShadow:
        'inset 4px 4px 8px rgba(176, 198, 219, 0.65), inset -4px -4px 8px rgba(255, 255, 255, 0.95)',
    },
    miniTabStyle: {
      background: '#e5eff8',
      color: '#0f172a',
      borderColor: 'rgba(255, 255, 255, 0.85)',
    },
    miniBtnStyle: {
      background: 'rgb(232, 241, 249)',
      color: 'rgb(99, 102, 241)',
    },
    badgeColorClass: 'bg-[#e8f1f9] text-[#6366f1] border-white/85',
  },
  {
    id: 'dark-ice-blue-neu',
    familyId: 'ice-blue-neu',
    familyLabel: 'Ice-Blue Soft UI',
    familyLabelEn: 'Ice-Blue Neumorphism',
    mechanism: 'dark',
    counterpartMode: 'ice-blue-neu',
    cardClassName: 'card-dark-ice-blue-neu',
    name: 'Dark Ice-Blue Neu (Tối)',
    label: 'Dark Ice-Blue Neu (Tối)',
    shortBadge: 'Dark Ice Neu',
    tagLabel: '#78 Dark Ice-Blue Neu · Neumorphism Tối',
    modeLabel: 'Dark Ice-Blue Neu',
    isDark: true,
    icon: 'moon',
    color: '#38BDF8',
    desc: 'Nền xanh băng thẫm (#152030) dập nổi mềm mại với bo góc 28px, đổ bóng kép lạnh sâu và các thanh chỉ số gradient neon phát sáng.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #182536 0%, #121c29 100%)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderRadius: '28px',
      border: '1px solid rgba(148, 197, 248, 0.12)',
      boxShadow:
        '12px 12px 26px #0a1018, -10px -10px 22px #203147, inset 1px 1px 2px rgba(186, 230, 253, 0.14)',
      color: '#e2e8f0',
    },
    miniPreviewWrapStyle: {
      background: '#131d2b',
      borderColor: 'rgba(148, 197, 248, 0.14)',
      boxShadow: 'inset 4px 4px 8px #0a1018, inset -4px -4px 8px #1e2e43',
    },
    miniTabStyle: {
      background: '#131d2b',
      color: '#f8fafc',
      borderColor: 'rgba(148, 197, 248, 0.16)',
    },
    miniBtnStyle: {
      background: 'rgb(22, 34, 50)',
      color: '#ffffff',
    },
    badgeColorClass: 'bg-[#162232] text-[#f8fafc] border-[#94c5f8]/20',
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
  'ice-blue-neu': {
    familyId: 'ice-blue-neu',
    label: 'Ice-Blue Soft UI',
    labelEn: 'Ice-Blue Neumorphism',
    description: 'Ice-Blue Soft UI (Sáng #e6f0f8) & Dark Ice-Blue Neu (Tối #152030)',
    descriptionEn: 'Ice-Blue Soft UI (Light #e6f0f8) & Dark Ice-Blue Neu (Dark #152030)',
    icon: 'snowflake',
    light: CARD_STYLES_MAP['ice-blue-neu'],
    dark: CARD_STYLES_MAP['dark-ice-blue-neu'],
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
