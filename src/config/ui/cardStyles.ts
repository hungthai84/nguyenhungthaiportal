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
  presets: CardStyleConfig[];
}

export const THEME_FAMILY_DEFINITIONS: Array<Omit<ThemeFamilyGroupMeta, 'presets'>> = [
  {
    id: 'glassmorphism',
    label: 'Gương',
    labelEn: 'Glassmorphism',
    description: 'Bề mặt kính mờ xuyên thấu Sáng / Tối đồng bộ',
    descriptionEn: 'Translucent frosted glass in Light & Dark modes',
    icon: 'sparkles',
  },
  {
    id: 'ice-blue-neumorphism',
    label: 'Neumorphism',
    labelEn: 'Ice-Blue Neumorphism',
    description: 'Bề mặt nổi khối dập nổi 3D & dải chỉ số phát sáng Sáng / Tối',
    descriptionEn: 'Ice-Blue soft-extruded surfaces & neon bars in Light & Dark modes',
    icon: 'layers',
  },
  {
    id: 'pastel-soft-ui',
    label: 'Pastel Soft UI',
    labelEn: 'Pastel Soft UI',
    description: 'Thẻ tím oải hương phấn bo góc 32px đồng bộ Sáng / Tối',
    descriptionEn: '32px soft pastel lilac modular cards in Light & Dark modes',
    icon: 'palette',
  },
  {
    id: 'cowhide-leather',
    label: 'Da bò',
    labelEn: 'Cowhide Leather Craft',
    description: 'Chất liệu da bò thủ công chỉ khâu tay đồng bộ Sáng / Tối',
    descriptionEn: 'Hand-stitched full-grain cowhide leather in Light Tan & Classic Dark',
    icon: 'briefcase',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
  {
    id: 'light-glassmorphism',
    familyId: 'glassmorphism',
    familyLabel: 'Nhóm Kính mờ Pha lê',
    familyLabelEn: 'Glassmorphism Group',
    counterpartMode: 'dark-glassmorphism',
    cardClassName: 'card-light-glassmorphism',
    name: 'Gương sáng',
    label: 'Gương sáng (Light Frosted Glass)',
    shortBadge: 'Gương sáng',
    tagLabel: 'Gương sáng · Light Frosted Glass',
    modeLabel: 'Gương sáng',
    isDark: false,
    icon: 'sparkles',
    color: '#0284C7',
    desc: 'Lớp kính mờ sáng trong trẻo (rgba(255, 255, 255, 0.72)) kết hợp blur(22px) saturate(165%), viền phản quang trắng sắc nét và chữ #0f172a chuẩn WCAG.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.48) 100%)',
      backdropFilter: 'blur(22px) saturate(165%)',
      WebkitBackdropFilter: 'blur(22px) saturate(165%)',
      border: '1px solid rgba(255, 255, 255, 0.85)',
      boxShadow:
        '0 20px 44px -12px rgba(15, 23, 42, 0.18), inset 0 1.5px 1px rgba(255, 255, 255, 0.95)',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.54) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.90)',
      boxShadow: 'inset 0 1.5px 1px rgba(255, 255, 255, 0.95)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.86)',
      color: '#000000',
      borderColor: 'rgba(255, 255, 255, 0.92)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/75 text-black border-white/90',
  },
  {
    id: 'dark-glassmorphism',
    familyId: 'glassmorphism',
    familyLabel: 'Nhóm Kính mờ Pha lê',
    familyLabelEn: 'Glassmorphism Group',
    counterpartMode: 'light-glassmorphism',
    cardClassName: 'card-dark-glassmorphism',
    name: 'Gương tối',
    label: 'Gương tối (Dark Glassmorphism)',
    shortBadge: 'Gương Tối',
    tagLabel: 'Gương tối · Dark Frosted Glass',
    modeLabel: 'Gương tối',
    isDark: true,
    icon: 'moon',
    color: '#0EA5E9',
    desc: 'Lớp kính mờ tối sâu thẳm (rgba(15, 23, 42, 0.68)) kết hợp blur(22px) saturate(150%), viền sáng cạnh trên tinh tế và độ tương phản chữ #f8fafc tối ưu trên mọi hình nền.',
    cardSampleStyle: {
      background: 'rgba(15, 23, 42, 0.68)',
      backdropFilter: 'blur(22px) saturate(150%)',
      WebkitBackdropFilter: 'blur(22px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      boxShadow:
        '0 22px 48px -12px rgba(2, 6, 23, 0.72), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(15, 23, 42, 0.78)',
      borderColor: 'rgba(255, 255, 255, 0.16)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.18)',
    },
    miniTabStyle: {
      background: 'rgba(30, 41, 59, 0.85)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.18)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0EA5E9 0%, #4F46E5 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-slate-900/85 text-white border-white/20',
  },
  {
    id: 'ice-blue-neumorphism',
    familyId: 'ice-blue-neumorphism',
    familyLabel: 'Nhóm Neumorphism Xanh Băng',
    familyLabelEn: 'Ice-Blue Neumorphism',
    counterpartMode: 'dark-ice-blue-neumorphism',
    cardClassName: 'card-ice-blue-neu',
    name: 'Neumorphism Sáng',
    label: 'Neumorphism Sáng (Ice-Blue Soft UI & Glowing Progress)',
    shortBadge: 'Neumorphism',
    tagLabel: 'Neumorphism Sáng · Soft UI',
    modeLabel: 'Neumorphism Sáng',
    isDark: false,
    icon: 'layers',
    color: '#0EA5E9',
    desc: 'Phong cách Ice-Blue Soft UI (#e6f0f8) đổ bóng nổi/chìm mềm mại kết hợp các thanh tiến trình gradient Cyan, Tím, Cam đào & Hồng phát sáng chuẩn WCAG.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #edf4fa 0%, #e4eef7 100%)',
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
      background: 'linear-gradient(145deg, #edf4fa 0%, #e4eef7 100%)',
      color: '#000000',
      borderColor: 'rgba(255, 255, 255, 0.90)',
      boxShadow: '4px 4px 10px rgba(176, 198, 219, 0.55), -3px -3px 8px rgba(255, 255, 255, 0.92)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-sky-500/10 text-black border-white/90',
  },
  {
    id: 'dark-ice-blue-neumorphism',
    familyId: 'ice-blue-neumorphism',
    familyLabel: 'Nhóm Neumorphism Xanh Băng',
    familyLabelEn: 'Ice-Blue Neumorphism',
    counterpartMode: 'ice-blue-neumorphism',
    cardClassName: 'card-dark-ice-blue-neu',
    name: 'Neumorphism Tối',
    label: 'Neumorphism Tối (Dark Ice-Blue Neumorphism)',
    shortBadge: 'Neumorphism Tối',
    tagLabel: 'Neumorphism Tối · Deep #152030',
    modeLabel: 'Neumorphism Tối',
    isDark: true,
    icon: 'cpu',
    color: '#38BDF8',
    desc: 'Nền xanh băng thẫm (#152030) dập nổi mềm mại với đổ bóng kép lạnh (#0a1018 / #203147), lõi chìm .dark-ice-neu-inset và các thanh chỉ số gradient neon phát sáng.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #182536 0%, #121c29 100%)',
      borderRadius: '28px',
      border: '1px solid rgba(148, 197, 248, 0.12)',
      boxShadow:
        '12px 12px 26px #0a1018, -10px -10px 22px #203147, inset 1px 1px 2px rgba(186, 230, 253, 0.14)',
      color: '#e2e8f0',
    },
    miniPreviewWrapStyle: {
      background: '#131d2b',
      borderColor: 'rgba(148, 197, 248, 0.12)',
      boxShadow: 'inset 4px 4px 8px #0a1018, inset -4px -4px 8px #1e2e43',
    },
    miniTabStyle: {
      background: 'linear-gradient(145deg, #182536 0%, #121c29 100%)',
      color: '#FFFFFF',
      borderColor: 'rgba(148, 197, 248, 0.14)',
      boxShadow: '4px 4px 10px #0a1018, -3px -3px 8px #203147',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#131d2b] text-white border-sky-400/25',
  },
  {
    id: 'pastel-lilac-soft',
    familyId: 'pastel-soft-ui',
    familyLabel: 'Nhóm Pastel Soft UI',
    familyLabelEn: 'Pastel Soft UI Group',
    counterpartMode: 'dark-pastel-lilac-soft',
    cardClassName: 'card-pastel-lilac-soft',
    name: 'Pastel Soft UI Sáng',
    label: 'Pastel Soft UI Sáng (Pastel Lilac Soft UI)',
    shortBadge: 'Pastel Lilac',
    tagLabel: 'Pastel Soft UI Sáng · 32px Radius',
    modeLabel: 'Pastel Lilac Sáng',
    isDark: false,
    icon: 'palette',
    color: '#8B7EF8',
    desc: 'Nền trắng kem pha sắc tím oải hương (#f8f7fc / #f4f2fa), bo góc siêu mềm 32px, module phân tầng nhẹ và điểm nhấn cam đào – tím pastel chuẩn WCAG (#1e1b2e).',
    cardSampleStyle: {
      background: 'linear-gradient(165deg, #ffffff 0%, #f8f7fc 60%, #f1effa 100%)',
      border: '1.5px solid rgba(255, 255, 255, 0.95)',
      boxShadow:
        '0 24px 48px -12px rgba(124, 114, 184, 0.18), 0 8px 20px -6px rgba(15, 23, 42, 0.05), inset 0 2px 4px #ffffff',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background: '#f4f2fa',
      borderColor: 'rgba(226, 222, 243, 0.8)',
      boxShadow: '0 4px 12px -4px rgba(124, 114, 184, 0.12)',
    },
    miniTabStyle: {
      background: '#ffffff',
      color: '#000000',
      borderColor: 'rgba(226, 222, 243, 0.88)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #8b7ef8 0%, #aba2fc 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#f4f2fa] text-[#5b4bd6] border-[#e2def3]',
  },
  {
    id: 'dark-pastel-lilac-soft',
    familyId: 'pastel-soft-ui',
    familyLabel: 'Nhóm Pastel Soft UI',
    familyLabelEn: 'Pastel Soft UI Group',
    counterpartMode: 'pastel-lilac-soft',
    cardClassName: 'card-dark-pastel-lilac-soft',
    name: 'Pastel Soft UI Tối',
    label: 'Pastel Soft UI Tối (Dark Velvet Lilac Soft UI)',
    shortBadge: 'Pastel Lilac Tối',
    tagLabel: 'Pastel Soft UI Tối · 32px Radius',
    modeLabel: 'Pastel Lilac Tối',
    isDark: true,
    icon: 'sparkles',
    color: '#A78BFA',
    desc: 'Nền tím than nhung mịn (#1e1a30), bo góc siêu mềm 32px, module phân tầng #2a2442 và điểm nhấn tím oải hương – cam đào pastel dịu mắt chuẩn WCAG (#f5f3ff).',
    cardSampleStyle: {
      background: 'linear-gradient(165deg, #25203b 0%, #1e1a30 60%, #181427 100%)',
      border: '1.5px solid rgba(216, 206, 255, 0.16)',
      boxShadow:
        '0 24px 48px -12px rgba(6, 4, 16, 0.65), 0 8px 20px -6px rgba(10, 8, 22, 0.45), inset 0 1.5px 2px rgba(226, 222, 243, 0.12)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background: '#2a2442',
      borderColor: 'rgba(196, 181, 253, 0.16)',
      boxShadow: '0 6px 14px -4px rgba(6, 4, 16, 0.42)',
    },
    miniTabStyle: {
      background: '#312b4d',
      color: '#FFFFFF',
      borderColor: 'rgba(196, 181, 253, 0.22)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #8b7ef8 0%, #a78bfa 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#2a2442] text-white border-[#c4b5fd]/25',
  },
  {
    id: 'light-cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Nhóm Chất liệu Da Bò',
    familyLabelEn: 'Cowhide Leather Group',
    counterpartMode: 'cowhide-leather',
    cardClassName: 'card-light-cowhide-leather',
    name: 'Chất liệu da bò sáng',
    label: 'Chất liệu da bò sáng (Light Saddle Tan Leather)',
    shortBadge: 'Da Bò Sáng',
    tagLabel: 'Chất liệu da bò sáng · Saddle Tan',
    modeLabel: 'Da bò vàng sáng',
    isDark: false,
    icon: 'sun',
    color: '#B45309',
    desc: 'Chất liệu da bò thuộc mộc tông vàng kem sáng (#FDF8F0 → #EBD4B4) với đường chỉ khâu tay nâu cổ điển và chữ nâu espresso #2C1606 sắc nét.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #FDF8F0 0%, #F5E6D0 52%, #EBD4B4 100%)',
      border: '2px solid #C89B6E',
      boxShadow:
        '0 18px 36px -10px rgba(120, 72, 28, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.85), inset 0 -3px 6px rgba(139, 90, 43, 0.14)',
      color: '#000000',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #FBF2E4 0%, #EFE0C6 100%)',
      borderColor: 'rgba(139, 90, 43, 0.42)',
      borderStyle: 'dashed',
    },
    miniTabStyle: {
      background: 'rgba(255, 250, 240, 0.92)',
      color: '#000000',
      borderColor: 'rgba(180, 120, 62, 0.48)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #B45309 0%, #8B4513 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#F5E6D0] text-black border-[#C89B6E]',
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
  glassmorphism: {
    familyId: 'glassmorphism',
    label: 'Gương',
    labelEn: 'Glassmorphism',
    description: 'Bề mặt kính mờ pha lê Sáng / Tối',
    descriptionEn: 'Translucent frosted glass in Light & Dark modes',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['light-glassmorphism'],
    dark: CARD_STYLES_MAP['dark-glassmorphism'],
  },
  'ice-blue-neumorphism': {
    familyId: 'ice-blue-neumorphism',
    label: 'Neumorphism',
    labelEn: 'Ice-Blue Neumorphism',
    description: 'Bề mặt xanh băng dập nổi 3D & phát sáng Sáng / Tối',
    descriptionEn: 'Ice-Blue soft-extruded surfaces & neon bars',
    icon: 'layers',
    light: CARD_STYLES_MAP['ice-blue-neumorphism'],
    dark: CARD_STYLES_MAP['dark-ice-blue-neumorphism'],
  },
  'pastel-soft-ui': {
    familyId: 'pastel-soft-ui',
    label: 'Pastel Soft UI',
    labelEn: 'Pastel Soft UI',
    description: 'Thẻ tím oải hương phấn bo góc 32px Sáng / Tối',
    descriptionEn: '32px soft pastel lilac modular cards',
    icon: 'palette',
    light: CARD_STYLES_MAP['pastel-lilac-soft'],
    dark: CARD_STYLES_MAP['dark-pastel-lilac-soft'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Da bò',
    labelEn: 'Cowhide Leather Craft',
    description: 'Chất liệu da bò thủ công chỉ khâu tay Sáng / Tối',
    descriptionEn: 'Hand-stitched full-grain cowhide leather',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['light-cowhide-leather'],
    dark: CARD_STYLES_MAP['cowhide-leather'],
  },
};

/**
 * Chuyển đổi qua lại giữa biến thể Sáng và Tối của giao diện đang kích hoạt
 */
export function getLightDarkCounterpart(mode: CardStyleMode, targetDark?: boolean): CardStyleMode {
  const current = CARD_STYLES_MAP[mode] || CARD_STYLES_MAP[DEFAULT_CARD_STYLE];
  const wantDark = typeof targetDark === 'boolean' ? targetDark : !current.isDark;
  if (current.isDark === wantDark) {
    return current.id;
  }

  const counterpart = CARD_STYLES_MAP[current.counterpartMode];
  if (counterpart && counterpart.isDark === wantDark) {
    return counterpart.id;
  }

  const familyMatch = UNIFIED_INTERFACE_THEMES.find(
    (item) => item.familyId === current.familyId && item.isDark === wantDark
  );
  if (familyMatch) {
    return familyMatch.id;
  }

  return wantDark ? 'dark-glassmorphism' : 'light-glassmorphism';
}

export function getCardStyleProperties(mode?: CardStyleMode): React.CSSProperties {
  if (!mode || !CARD_STYLES_MAP[mode]) {
    return CARD_STYLES_MAP[DEFAULT_CARD_STYLE].cardSampleStyle;
  }
  return CARD_STYLES_MAP[mode].cardSampleStyle;
}

export function getCardStyleConfig(mode?: CardStyleMode): CardStyleConfig {
  if (!mode || !CARD_STYLES_MAP[mode]) {
    return CARD_STYLES_MAP[DEFAULT_CARD_STYLE];
  }
  return CARD_STYLES_MAP[mode];
}

export function normalizeCardStyle(raw: string | null): CardStyleMode {
  if (!raw) return DEFAULT_CARD_STYLE;
  if (
    raw === 'dark-ice-blue-neumorphism' ||
    raw === 'neumorphism-toi' ||
    raw === 'neu-dark' ||
    raw === 'dark-ice-blue' ||
    raw === 'dark-neu'
  ) {
    return 'dark-ice-blue-neumorphism';
  }
  if (
    raw === 'ice-blue-neumorphism' ||
    raw === 'neumorphism' ||
    raw === 'neu-light' ||
    raw === 'neumorphism-sang' ||
    raw === 'ice-blue-soft'
  ) {
    return 'ice-blue-neumorphism';
  }
  if (
    raw === 'dark-pastel-lilac-soft' ||
    raw === 'pastel-soft-ui-toi' ||
    raw === 'dark-pastel-soft' ||
    raw === 'dark-lilac-soft' ||
    raw === 'pastel-lilac-dark'
  ) {
    return 'dark-pastel-lilac-soft';
  }
  if (
    raw === 'pastel-lilac-soft' ||
    raw === 'pastel-soft-ui' ||
    raw === 'pastel-lilac' ||
    raw === 'lilac-soft' ||
    raw === 'pastel-soft'
  ) {
    return 'pastel-lilac-soft';
  }
  if (
    raw === 'dark-glassmorphism' ||
    raw === 'dark-frosted-glass' ||
    raw === 'dark-glass' ||
    raw === 'dark-frosted' ||
    raw === 'kinh-mo-toi' ||
    raw === 'guong-toi'
  ) {
    return 'dark-glassmorphism';
  }
  if (
    raw === 'light-cowhide-leather' ||
    raw === 'light-leather' ||
    raw === 'da-bo-sang' ||
    raw === 'cowhide-leather-light'
  ) {
    return 'light-cowhide-leather';
  }
  if (
    raw === 'cowhide-leather' ||
    raw === 'leather' ||
    raw === 'da-bo'
  ) {
    return 'cowhide-leather';
  }
  if (
    raw === 'light-glass' ||
    raw === 'light-glassmorphism' ||
    raw === 'guong-sang' ||
    raw === 'kinh-guong-sang' ||
    raw === 'glossy-glass' ||
    raw === 'glossy' ||
    raw === 'guong-bong' ||
    raw === 'glass-glossy' ||
    raw === 'frosted-glass' ||
    raw === 'mica-fluent' ||
    raw === 'multicolor-glass' ||
    raw === 'glass' ||
    raw === 'mica' ||
    raw === 'glass-flat' ||
    raw === 'fluent-mica' ||
    raw === 'liquid-glass' ||
    raw === 'pastel' ||
    raw === 'bento-pastel' ||
    raw === 'soft-pastel' ||
    raw === 'pastel-bento'
  ) {
    return 'light-glassmorphism';
  }
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
}
