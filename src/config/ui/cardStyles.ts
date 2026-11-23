import React from 'react';
import { CardStyleMode, CardStyleConfig, ThemeFamilyId, ThemeMechanismMode } from './theme.types';
import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const THEME_FOUR_WORD_NAMES: Record<CardStyleMode, { vi: string; en: string }> = {
  'liquid-glass': { vi: 'Liquid Glass Soft UI Sáng', en: 'Liquid Glass Soft UI Light' },
  'dark-liquid-glass': { vi: 'Liquid Glass Soft UI Tối', en: 'Liquid Glass Soft UI Dark' },
  'multicolor-glass': { vi: 'Glass UI Đa Sắc', en: 'Multicolor Glass UI' },
  'dark-neon-glass': { vi: 'Glass UI Neon Tối', en: 'Dark Neon Glass UI' },
  'cowhide-leather': { vi: 'Da Bò Cổ Điển', en: 'Brown Leather Classic Edition' },
  'black-cowhide-leather': { vi: 'Da Bò Đen Chỉ Trắng', en: 'Black Leather White Stitch' },
  'deep-ocean': { vi: 'Đại Dương Sâu Thẳm', en: 'Deep Ocean Dark Blue' },
  'light-deep-ocean': { vi: 'Light Ocean Navy', en: 'Light Ocean Navy Glass UI' },
  'neumorphism-beyond': {
    vi: 'Nổi Khối Kính Mờ',
    en: 'Soft UI Glass Beyond',
  },
  'dark-neumorphism-beyond': {
    vi: 'Nổi Khối Kính Mờ Tối',
    en: 'Soft UI Glass Dark',
  },
  'frost-ice-neu': {
    vi: 'Băng Tuyết Nổi Khối',
    en: 'Frost Ice Neumorphism',
  },
  'dark-frost-ice-neu': {
    vi: 'Băng Tuyết Nổi Khối Tối',
    en: 'Dark Frost Ice Neu',
  },
  'flat-soft-ui': {
    vi: 'Flat Soft UI Sáng',
    en: 'Flat Soft UI Light',
  },
  'dark-flat-soft-ui': {
    vi: 'Flat Soft UI Tối',
    en: 'Flat Soft UI Dark',
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
    label: 'Liquid Glass Soft UI',
    labelEn: 'Liquid Glass Soft UI',
    description:
      'Giao diện Liquid Glass Soft UI: vật liệu kính quang học trong suốt có viền specular highlight sáng mảnh, tint thích ứng theo nền và tách bạch rõ vùng nội dung sáng/tối sắc nét.',
    descriptionEn:
      'Liquid Glass Soft UI: optical glass material with subtle specular rim highlights, adaptive tint, and clear separation between floating glass chrome and readable content cards.',
    icon: 'sparkles',
    defaultMode: 'liquid-glass',
    lightMode: 'liquid-glass',
    darkMode: 'dark-liquid-glass',
  },
  {
    id: 'cowhide-leather',
    label: 'Da Bò cổ điển',
    labelEn: 'Classic Cowhide Leather',
    description:
      'Chất liệu da bò cổ điển màu nâu chỉ kem (Sáng) và phiên bản da bò đen tuyền khâu chỉ trắng sắc nét (Tối).',
    descriptionEn:
      'Classic brown cowhide leather with cream stitching paired with jet-black full-grain leather accented by crisp white hand-stitching.',
    icon: 'briefcase',
    defaultMode: 'cowhide-leather',
    lightMode: 'cowhide-leather',
    darkMode: 'black-cowhide-leather',
    colorMode: 'cowhide-leather',
  },
  {
    id: 'deep-ocean',
    label: 'Light Ocean Navy',
    labelEn: 'Light Ocean Navy',
    description:
      'Giao diện Light Ocean Navy – Bright Glass UI: nền sáng trắng xanh đại dương, thẻ kính mờ cao cấp, nhận diện Navy và điểm nhấn Cyan.',
    descriptionEn:
      'Light Ocean Navy – Bright Glass UI: sunlit coastal bright glass canvas with navy branding and cyan accents.',
    icon: 'compass',
    defaultMode: 'light-deep-ocean',
    lightMode: 'light-deep-ocean',
    darkMode: 'deep-ocean',
  },
  {
    id: 'neumorphism-beyond',
    label: 'Nổi Khối Kính Mờ',
    labelEn: 'Soft UI Glass Beyond',
    description:
      'Giao diện Neumorphism, Glassmorphism & Beyond: nổi khối kép kết hợp kính mờ hiện đại trên nền sáng #EBF0F6 và nền tối #151B26 cùng hệ 6 sắc màu (#EE6AD2, #64B6FF, #4973FF, #445CE6, #2AD8E6, #52E0A8).',
    descriptionEn:
      'Neumorphism, Glassmorphism & Beyond: tactile Soft UI extrusion blended with frosted glassmorphism in light ice-slate and dark matte charcoal editions with 6 vivid hues.',
    icon: 'sliders',
    defaultMode: 'neumorphism-beyond',
    lightMode: 'neumorphism-beyond',
    darkMode: 'dark-neumorphism-beyond',
  },
  {
    id: 'frost-ice-neu',
    label: 'Băng Tuyết Nổi Khối',
    labelEn: 'Frost Ice Neumorphism',
    description:
      'Giao diện Soft Ice-Blue Clay Neumorphism thanh khiết từ hình mẫu: bề mặt băng tuyết xanh ngọc nổi khối kép (#EAF4FC), rãnh lõm tinh tế cùng 4 dải màu điểm nhấn Tím Violet, Xanh Aqua, Cam Mơ và Hồng Rose.',
    descriptionEn:
      'Soft Ice-Blue Clay Neumorphism inspired by reference UI: luminous glacier surfaces with dual soft extrusion, recessed pill tracks, and 4 vibrant gradient accents (Violet, Aqua, Apricot, Rose).',
    icon: 'sparkles',
    defaultMode: 'frost-ice-neu',
    lightMode: 'frost-ice-neu',
    darkMode: 'dark-frost-ice-neu',
  },
  {
    id: 'multicolor-glass',
    label: 'Glass UI',
    labelEn: 'Glass UI',
    description:
      'Giao diện Glass UI Đa Sắc (Sáng) kết hợp Glass UI Neon Tối (Tối): kính mờ trong suốt bão hòa cao cùng viền phản quang đa sắc tinh tế.',
    descriptionEn:
      'Multicolor frosted Glass UI (Light) paired with Dark Neon obsidian Glass UI (Dark) featuring vivid multi-spectrum translucent tints.',
    icon: 'zap',
    defaultMode: 'multicolor-glass',
    lightMode: 'multicolor-glass',
    darkMode: 'dark-neon-glass',
    colorMode: 'multicolor-glass',
  },
  {
    id: 'flat-soft-ui',
    label: 'Flat Soft UI',
    labelEn: 'Flat Soft UI',
    description:
      'Giao diện Flat Soft UI hiện đại, phẳng thanh lịch với độ nổi khối siêu mềm mại, bề mặt mịn màng tinh tế, độ tương phản cao và không gây mỏi mắt.',
    descriptionEn:
      'Modern Flat Soft UI with elegant flat planes, whisper-soft elevation, pristine matte surfaces, high-contrast readability, and zero glare.',
    icon: 'layout',
    defaultMode: 'flat-soft-ui',
    lightMode: 'flat-soft-ui',
    darkMode: 'dark-flat-soft-ui',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
  {
    id: 'liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Liquid Glass Soft UI',
    familyLabelEn: 'Liquid Glass Soft UI',
    mechanism: 'light',
    counterpartMode: 'dark-liquid-glass',
    cardClassName: 'card-liquid-glass',
    name: 'Liquid Glass Soft UI (Sáng)',
    label: 'Liquid Glass Soft UI (Sáng)',
    shortBadge: 'Liquid Soft Sáng',
    tagLabel: 'Liquid Glass Soft UI · Light',
    modeLabel: 'Liquid Glass Soft UI Sáng',
    isDark: false,
    icon: 'sparkles',
    color: '#4F46E5',
    desc: 'Vật liệu kính quang học trong suốt có viền specular rim sáng mảnh, thanh điều hướng nổi tinh tế và vùng thẻ nội dung sáng rõ chuẩn WCAG AA.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.13)',
      backdropFilter: 'blur(18px) saturate(188%) contrast(108%)',
      WebkitBackdropFilter: 'blur(18px) saturate(188%) contrast(108%)',
      borderRadius: '28px',
      border: '1px solid rgba(255, 255, 255, 0.26)',
      boxShadow:
        '0 20px 70px rgba(0, 0, 0, 0.114), 0 0 25px rgba(255, 255, 255, 0.029), inset 0 1px 0.5px rgba(255, 255, 255, 0.446), inset 0 2px 5px rgba(255, 255, 255, 0.167), inset 1px 0 1px rgba(255, 255, 255, 0.115), inset -1px 0 1px rgba(255, 255, 255, 0.101), inset 0 -1px 0.5px rgba(255, 255, 255, 0.086), inset 0 0 34px rgba(255, 255, 255, 0.046), inset 0 -12px 22px rgba(0, 0, 0, 0.086)',
      color: '#0F172A',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.22)',
      borderColor: 'rgba(255, 255, 255, 0.36)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.28)',
      color: '#0F172A',
      borderColor: 'rgba(255, 255, 255, 0.36)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/85 text-[#4F46E5] border-white/90',
    layerDepth: 0,
  },
  {
    id: 'dark-liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Liquid Glass Soft UI',
    familyLabelEn: 'Liquid Glass Soft UI',
    mechanism: 'dark',
    counterpartMode: 'liquid-glass',
    cardClassName: 'card-dark-liquid-glass',
    name: 'Liquid Glass Soft UI (Tối)',
    label: 'Liquid Glass Soft UI (Tối)',
    shortBadge: 'Liquid Soft Tối',
    tagLabel: 'Liquid Glass Soft UI · Dark',
    modeLabel: 'Liquid Glass Soft UI Tối',
    isDark: true,
    icon: 'moon',
    color: '#818CF8',
    desc: 'Liquid Glass iOS Clear phiên bản tối (bo góc 14px): kính quang học trong suốt blur 18px saturate 188%, viền specular highlight đa tầng và chiều sâu tương phản rõ nét.',
    cardSampleStyle: {
      background: 'rgba(0, 0, 0, 0.13)',
      backdropFilter: 'blur(18px) saturate(188%) contrast(108%)',
      WebkitBackdropFilter: 'blur(18px) saturate(188%) contrast(108%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.26)',
      boxShadow:
        '0 20px 70px rgba(0, 0, 0, 0.187), 0 0 25px rgba(255, 255, 255, 0.029), inset 0 1px 0.5px rgba(255, 255, 255, 0.446), inset 0 2px 5px rgba(255, 255, 255, 0.167), inset 1px 0 1px rgba(255, 255, 255, 0.115), inset -1px 0 1px rgba(255, 255, 255, 0.101), inset 0 -1px 0.5px rgba(255, 255, 255, 0.086), inset 0 0 34px rgba(255, 255, 255, 0.046), inset 0 -12px 22px rgba(0, 0, 0, 0.086)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(0, 0, 0, 0.13)',
      borderColor: 'rgba(255, 255, 255, 0.26)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(0, 0, 0, 0.20)',
      color: '#F8FAFC',
      borderColor: 'rgba(255, 255, 255, 0.26)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
      color: '#0B1221',
    },
    badgeColorClass: 'bg-[#121d34]/90 text-[#A5B4FC] border-white/20',
    layerDepth: 0,
  },
  {
    id: 'cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Da Bò cổ điển',
    familyLabelEn: 'Classic Cowhide Leather',
    mechanism: 'color',
    counterpartMode: 'black-cowhide-leather',
    cardClassName: 'card-cowhide-leather',
    name: 'Da Bò Cổ Điển (Nâu)',
    label: 'Da Bò Cổ Điển (Nâu)',
    shortBadge: 'Da Bò Cổ Điển',
    tagLabel: 'Da Bò Nâu Cổ Điển · Chỉ kem',
    modeLabel: 'Da Bò Cổ Điển',
    isDark: true,
    icon: 'briefcase',
    color: '#8B5A2B',
    desc: 'Mô phỏng chất liệu da màu nâu cổ điển (#8B5A2B → #653A17) với đường chỉ khâu tay viền đứt nét màu kem và sắc chữ tương phản sang trọng.',
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
    layerDepth: 0,
  },
  {
    id: 'black-cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Da Bò cổ điển',
    familyLabelEn: 'Classic Cowhide Leather',
    mechanism: 'dark',
    counterpartMode: 'cowhide-leather',
    cardClassName: 'card-black-cowhide-leather',
    name: 'Da Bò Đen Chỉ Trắng',
    label: 'Da Bò Đen Chỉ Trắng',
    shortBadge: 'Da Đen Chỉ Trắng',
    tagLabel: 'Da Bò Đen Tuyền · Chỉ trắng',
    modeLabel: 'Da Bò Đen Chỉ Trắng',
    isDark: true,
    icon: 'briefcase',
    color: '#FFFFFF',
    desc: 'Chất liệu da bò đen tuyền cao cấp (#22252D → #101217) kết hợp đường chỉ khâu tay màu trắng tinh khiết nổi bật và chữ trắng sắc nét.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #22252D 0%, #111318 50%, #1A1D24 100%)',
      border: '2px solid #090A0E',
      boxShadow:
        '0 18px 38px rgba(0, 0, 0, 0.62), inset 0 2px 4px rgba(255, 255, 255, 0.14), inset 0 -3px 6px rgba(0, 0, 0, 0.78)',
      color: '#FFFFFF',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #1B1E25 0%, #0E1014 100%)',
      borderColor: 'rgba(255, 255, 255, 0.72)',
      borderStyle: 'dashed',
    },
    miniTabStyle: {
      background: 'rgba(18, 20, 26, 0.92)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.65)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 100%)',
      color: '#0B0C10',
    },
    badgeColorClass: 'bg-[#14171D]/92 text-white border-white/70',
    layerDepth: 0,
  },
  {
    id: 'deep-ocean',
    familyId: 'deep-ocean',
    familyLabel: 'Đại Dương Sâu Thẳm',
    familyLabelEn: 'Deep Ocean',
    mechanism: 'dark',
    counterpartMode: 'light-deep-ocean',
    cardClassName: 'card-deep-ocean',
    name: 'Đại Dương Sâu Thẳm',
    label: 'Đại Dương Sâu Thẳm',
    shortBadge: 'Đại Dương Sâu',
    tagLabel: 'Deep Ocean Dark · Navy & Aqua',
    modeLabel: 'Deep Ocean Tối',
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
    layerDepth: 0,
  },
  {
    id: 'light-deep-ocean',
    familyId: 'deep-ocean',
    familyLabel: 'Đại Dương Sâu Thẳm',
    familyLabelEn: 'Deep Ocean',
    mechanism: 'light',
    counterpartMode: 'deep-ocean',
    cardClassName: 'card-light-deep-ocean',
    name: 'Light Ocean Navy – Bright Glass UI',
    label: 'Light Ocean Navy – Bright Glass UI',
    shortBadge: 'Light Ocean Navy',
    tagLabel: 'Light Ocean Navy · Bright Glass UI',
    modeLabel: 'Light Ocean Navy',
    isDark: false,
    icon: 'sun',
    color: '#1951FC',
    desc: 'Giao diện Ocean Navy Light – Glossy Liquid Glass UI: nền Ocean Navy sáng (#1951FC), card xanh kính nhiều lớp (#3781FC/#73BFFF), nhận diện Navy Deep (#03195B) và phản chiếu Glossy cao cấp.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, rgba(115, 191, 255, 0.42), rgba(55, 129, 252, 0.30), rgba(203, 233, 253, 0.32))',
      borderRadius: '18px',
      border: '1px solid rgba(255, 255, 255, 0.55)',
      boxShadow: '0 8px 24px rgba(3, 25, 91, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -2px 8px rgba(25, 81, 252, 0.12)',
      color: '#03195B',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, rgba(115, 191, 255, 0.45) 0%, rgba(55, 129, 252, 0.30) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.60)',
    },
    miniTabStyle: {
      background: 'rgba(244, 251, 255, 0.92)',
      color: '#082F49',
      borderColor: 'rgba(14, 165, 233, 0.28)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-sky-50 text-[#0284C7] border-sky-300/70',
    layerDepth: 0,
  },
  {
    id: 'neumorphism-beyond',
    familyId: 'neumorphism-beyond',
    familyLabel: 'Nổi Khối Kính Mờ',
    familyLabelEn: 'Soft UI Glass Beyond',
    mechanism: 'light',
    counterpartMode: 'dark-neumorphism-beyond',
    cardClassName: 'card-neumorphism-beyond',
    name: 'Nổi Khối Kính Mờ',
    label: 'Nổi Khối Kính Mờ',
    shortBadge: 'Nổi Khối Kính Mờ',
    tagLabel: 'Neumorphism · Glass · 6 Màu',
    modeLabel: 'Nổi Khối Sáng',
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
    layerDepth: 0,
  },
  {
    id: 'dark-neumorphism-beyond',
    familyId: 'neumorphism-beyond',
    familyLabel: 'Nổi Khối Kính Mờ',
    familyLabelEn: 'Soft UI Glass Beyond',
    mechanism: 'dark',
    counterpartMode: 'neumorphism-beyond',
    cardClassName: 'card-dark-neumorphism-beyond',
    name: 'Nổi Khối Kính Mờ Tối',
    label: 'Nổi Khối Kính Mờ Tối',
    shortBadge: 'Nổi Khối Tối',
    tagLabel: 'Dark Soft UI · Glass · 6 Màu',
    modeLabel: 'Nổi Khối Tối',
    isDark: true,
    icon: 'moon',
    color: '#64B6FF',
    desc: 'Phiên bản tối của Nổi Khối Kính Mờ: bề mặt than chì mờ chống chói #151B26, đổ bóng nổi khối mềm kép cùng hệ 6 màu chuẩn dịu mắt.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, rgba(29, 38, 54, 0.94) 0%, rgba(21, 28, 41, 0.90) 100%)',
      backdropFilter: 'blur(14px) saturate(108%)',
      WebkitBackdropFilter: 'blur(14px) saturate(108%)',
      borderRadius: '14px',
      border: '1px solid rgba(148, 163, 184, 0.16)',
      boxShadow:
        '0 8px 20px rgba(4, 7, 14, 0.56), 3px 4px 10px rgba(3, 6, 12, 0.62), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      color: '#E2E8F0',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #1B2332 0%, #141A25 100%)',
      borderColor: 'rgba(148, 163, 184, 0.18)',
      boxShadow: 'inset 2px 2px 5px rgba(4, 7, 14, 0.72), inset -2px -2px 4px rgba(51, 65, 85, 0.24)',
    },
    miniTabStyle: {
      background: '#1E2738',
      color: '#E2E8F0',
      borderColor: 'rgba(148, 163, 184, 0.18)',
      boxShadow: '0 3px 8px rgba(4, 7, 14, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #4973FF 0%, #64B6FF 55%, #2AD8E6 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#1E2738] text-[#64B6FF] border-slate-600/50',
    layerDepth: 0,
  },
  {
    id: 'frost-ice-neu',
    familyId: 'frost-ice-neu',
    familyLabel: 'Băng Tuyết Nổi Khối',
    familyLabelEn: 'Frost Ice Neumorphism',
    mechanism: 'light',
    counterpartMode: 'dark-frost-ice-neu',
    cardClassName: 'card-frost-ice-neu',
    name: 'Băng Tuyết Nổi Khối (Sáng)',
    label: 'Băng Tuyết Nổi Khối',
    shortBadge: 'Frost Ice Sáng',
    tagLabel: 'Frost Clay · Soft Ice Neumorphism',
    modeLabel: 'Băng Tuyết Sáng',
    isDark: false,
    icon: 'sun',
    color: '#6E6AF6',
    desc: 'Giao diện Soft Ice-Blue Neumorphism trích xuất từ hình mẫu: nền băng xanh phấn #E6F1FB, thẻ nổi khối trắng ngọc mềm mại và 4 dải gradient Tím, Aqua, Cam Mơ, Hồng Rose.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #F5FAFF 0%, #E7F2FC 100%)',
      backdropFilter: 'blur(14px) saturate(112%)',
      WebkitBackdropFilter: 'blur(14px) saturate(112%)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.90)',
      boxShadow:
        '8px 10px 22px rgba(162, 193, 224, 0.36), -6px -6px 16px rgba(255, 255, 255, 0.96), inset 0 1px 0 rgba(255, 255, 255, 0.98)',
      color: '#25384B',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #EDF6FD 0%, #DFECF8 100%)',
      borderColor: 'rgba(255, 255, 255, 0.92)',
      boxShadow: 'inset 3px 3px 7px rgba(162, 193, 224, 0.36), inset -3px -3px 7px rgba(255, 255, 255, 0.94)',
    },
    miniTabStyle: {
      background: 'linear-gradient(145deg, #F6FBFF 0%, #E6F1FB 100%)',
      color: '#25384B',
      borderColor: 'rgba(255, 255, 255, 0.88)',
      boxShadow: '4px 5px 10px rgba(162, 193, 224, 0.32), -3px -3px 8px rgba(255, 255, 255, 0.94)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6E6AF6 0%, #965CE8 55%, #4AB8F9 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#EEF6FD] text-[#6E6AF6] border-white/90',
    layerDepth: 0,
  },
  {
    id: 'dark-frost-ice-neu',
    familyId: 'frost-ice-neu',
    familyLabel: 'Băng Tuyết Nổi Khối',
    familyLabelEn: 'Frost Ice Neumorphism',
    mechanism: 'dark',
    counterpartMode: 'frost-ice-neu',
    cardClassName: 'card-dark-frost-ice-neu',
    name: 'Băng Tuyết Nổi Khối (Tối)',
    label: 'Băng Tuyết Nổi Khối Tối',
    shortBadge: 'Frost Ice Tối',
    tagLabel: 'Midnight Glacier · Dark Frost Neu',
    modeLabel: 'Băng Tuyết Tối',
    isDark: true,
    icon: 'moon',
    color: '#8E8BFF',
    desc: 'Phiên bản tối của Băng Tuyết Nổi Khối: nền băng đêm sâu #101928 nổi khối mềm chống chói, rãnh lõm tinh xảo cùng 4 dải điểm nhấn phát sáng Violet, Aqua, Apricot, Rose.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #1E2C42 0%, #141F31 100%)',
      backdropFilter: 'blur(14px) saturate(112%)',
      WebkitBackdropFilter: 'blur(14px) saturate(112%)',
      borderRadius: '20px',
      border: '1px solid rgba(148, 189, 232, 0.18)',
      boxShadow:
        '8px 10px 22px rgba(4, 9, 18, 0.68), -5px -5px 14px rgba(44, 67, 102, 0.32), inset 0 1px 0 rgba(186, 218, 250, 0.12)',
      color: '#F1F8FF',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #162235 0%, #0E1725 100%)',
      borderColor: 'rgba(148, 189, 232, 0.16)',
      boxShadow: 'inset 3px 3px 7px rgba(4, 9, 18, 0.72), inset -2px -2px 6px rgba(44, 67, 102, 0.28)',
    },
    miniTabStyle: {
      background: 'linear-gradient(145deg, #213049 0%, #172336 100%)',
      color: '#F1F8FF',
      borderColor: 'rgba(148, 189, 232, 0.18)',
      boxShadow: '4px 5px 10px rgba(4, 9, 18, 0.56), -2px -2px 7px rgba(44, 67, 102, 0.28)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6E6AF6 0%, #965CE8 55%, #4AB8F9 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#1B283D] text-[#A4A1FF] border-sky-300/25',
    layerDepth: 0,
  },
  {
    id: 'multicolor-glass',
    familyId: 'multicolor-glass',
    familyLabel: 'Glass UI',
    familyLabelEn: 'Glass UI',
    mechanism: 'color',
    counterpartMode: 'dark-neon-glass',
    cardClassName: 'card-multicolor-glass',
    name: 'Glass UI Đa Sắc',
    label: 'Glass UI Đa Sắc',
    shortBadge: 'Glass Đa Sắc',
    tagLabel: 'Glass UI · Đa sắc trong suốt',
    modeLabel: 'Glass UI Đa Sắc',
    isDark: false,
    icon: 'sparkles',
    color: '#6366F1',
    desc: 'Giao diện Glass UI nền card màu trắng kính mờ hiện đại kết hợp sắc độ đa sắc ở viền, bóng đổ và điểm nhấn Cyan, Tím Iris, Hồng Blush.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(22px) saturate(185%)',
      WebkitBackdropFilter: 'blur(22px) saturate(185%)',
      borderRadius: '22px',
      border: '1px solid rgba(255, 255, 255, 0.94)',
      boxShadow:
        '0 14px 34px -8px rgba(79, 70, 229, 0.16), inset 0 1.5px 0 rgba(255, 255, 255, 0.98)',
      color: '#0F172A',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.92)',
      borderColor: 'rgba(255, 255, 255, 0.94)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.96)',
      color: '#0F172A',
      borderColor: 'rgba(226, 232, 240, 0.85)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 52%, #06B6D4 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/75 text-[#4F46E5] border-white/85',
    layerDepth: 0,
  },
  {
    id: 'dark-neon-glass',
    familyId: 'multicolor-glass',
    familyLabel: 'Glass UI',
    familyLabelEn: 'Glass UI',
    mechanism: 'dark',
    counterpartMode: 'multicolor-glass',
    cardClassName: 'card-dark-neon-glass',
    name: 'Glass UI Neon Tối',
    label: 'Glass UI Neon Tối',
    shortBadge: 'Neon Glass Tối',
    tagLabel: 'Glass UI · Neon Tối Đa Sắc',
    modeLabel: 'Glass UI Neon Tối',
    isDark: true,
    icon: 'zap',
    color: '#22D3EE',
    desc: 'Giao diện Glass UI Neon Tối hiện đại: bề mặt kính mờ obsidian sâu thẳm kết hợp viền neon Cyan, Tím Violet và Magenta sắc nét.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(10, 16, 38, 0.66) 0%, rgba(18, 14, 46, 0.60) 52%, rgba(12, 10, 34, 0.68) 100%)',
      backdropFilter: 'blur(24px) saturate(185%)',
      WebkitBackdropFilter: 'blur(24px) saturate(185%)',
      borderRadius: '22px',
      border: '1px solid rgba(34, 211, 238, 0.36)',
      boxShadow:
        '0 16px 38px -8px rgba(2, 6, 23, 0.78), 0 0 22px -6px rgba(34, 211, 238, 0.24), inset 0 1px 0 rgba(165, 243, 252, 0.24)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(145deg, rgba(10, 18, 44, 0.78) 0%, rgba(20, 16, 50, 0.74) 52%, rgba(10, 14, 38, 0.80) 100%)',
      borderColor: 'rgba(34, 211, 238, 0.38)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(14, 24, 54, 0.78)',
      color: '#F8FAFC',
      borderColor: 'rgba(34, 211, 238, 0.38)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 50%, #D946EF 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#091229]/90 text-[#67E8F9] border-cyan-400/40',
    layerDepth: 0,
  },
  {
    id: 'flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Flat Soft UI',
    familyLabelEn: 'Flat Soft UI',
    mechanism: 'light',
    counterpartMode: 'dark-flat-soft-ui',
    cardClassName: 'card-flat-soft-ui',
    name: 'Flat Soft UI (Sáng)',
    label: 'Flat Soft UI (Sáng)',
    shortBadge: 'Flat Sáng',
    tagLabel: 'Flat Soft UI · Matte Porcelain',
    modeLabel: 'Flat Soft UI Sáng',
    isDark: false,
    icon: 'layout',
    color: '#4F46E5',
    desc: 'Bề mặt sứ mờ siêu phẳng và tinh khiết (#FFFFFF), viền hairline mềm mại và bóng đổ khuếch tán đa tầng tạo độ nổi khối dịu êm.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '20px',
      border: '1px solid rgba(226, 232, 240, 0.90)',
      boxShadow:
        '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 18px -2px rgba(15, 23, 42, 0.05), 0 16px 32px -8px rgba(15, 23, 42, 0.04)',
      color: '#0F172A',
    },
    miniPreviewWrapStyle: {
      background: '#F8FAFC',
      borderColor: 'rgba(226, 232, 240, 0.90)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: '#FFFFFF',
      color: '#0F172A',
      borderColor: 'rgba(226, 232, 240, 0.90)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white text-[#4F46E5] border-slate-200 shadow-sm',
    layerDepth: 0,
  },
  {
    id: 'dark-flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Flat Soft UI',
    familyLabelEn: 'Flat Soft UI',
    mechanism: 'dark',
    counterpartMode: 'flat-soft-ui',
    cardClassName: 'card-dark-flat-soft-ui',
    name: 'Flat Soft UI (Tối)',
    label: 'Flat Soft UI (Tối)',
    shortBadge: 'Flat Tối',
    tagLabel: 'Flat Soft UI · Velvet Slate Dark',
    modeLabel: 'Flat Soft UI Tối',
    isDark: true,
    icon: 'moon',
    color: '#6366F1',
    desc: 'Mặt slate tối nhung êm dịu (#131B2A) không gây chói mắt, viền hairline thanh mảnh và độ tương phản chữ hoàn hảo chuẩn WCAG AAA.',
    cardSampleStyle: {
      background: 'rgba(19, 27, 42, 0.94)',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '20px',
      border: '1px solid rgba(148, 163, 184, 0.16)',
      boxShadow:
        '0 4px 20px -2px rgba(0, 0, 0, 0.45), 0 10px 30px -4px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background: '#0B0F17',
      borderColor: 'rgba(148, 163, 184, 0.20)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: '#161F30',
      color: '#F8FAFC',
      borderColor: 'rgba(148, 163, 184, 0.20)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#161F30] text-[#A5B4FC] border-slate-700/60 shadow-sm',
    layerDepth: 0,
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
    label: 'Liquid Glass Soft UI',
    labelEn: 'Liquid Glass Soft UI',
    description:
      'Giao diện Liquid Glass Soft UI: vật liệu kính quang học trong suốt có viền specular highlight sáng mảnh, tint thích ứng theo nền.',
    descriptionEn: 'Liquid Glass Soft UI: optical glass material with subtle specular rim highlights and adaptive tint.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['liquid-glass'],
    dark: CARD_STYLES_MAP['dark-liquid-glass'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Da Bò cổ điển',
    labelEn: 'Classic Cowhide Leather',
    description: 'Da Bò Cổ Điển (nâu chỉ kem) và Da Bò Đen Chỉ Trắng cao cấp.',
    descriptionEn: 'Classic brown leather and jet-black cowhide leather with white hand-stitching.',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['cowhide-leather'],
    dark: CARD_STYLES_MAP['black-cowhide-leather'],
    color: CARD_STYLES_MAP['cowhide-leather'],
  },
  'deep-ocean': {
    familyId: 'deep-ocean',
    label: 'Đại Dương Sâu Thẳm',
    labelEn: 'Deep Ocean',
    description: 'Deep Ocean Sáng & Tối: giao diện thủy tinh đại dương nắng biển sáng trong và navy sâu thẳm.',
    descriptionEn: 'Deep Ocean Light & Dark: sunlit coastal aqua crystal glass paired with abyssal navy.',
    icon: 'compass',
    light: CARD_STYLES_MAP['light-deep-ocean'],
    dark: CARD_STYLES_MAP['deep-ocean'],
  },
  'neumorphism-beyond': {
    familyId: 'neumorphism-beyond',
    label: 'Nổi Khối Kính Mờ',
    labelEn: 'Soft UI Glass Beyond',
    description: 'Neumorphism, Glassmorphism & Beyond nổi khối kép sắc nét phiên bản Sáng & Tối cùng 6 sắc màu chuẩn.',
    descriptionEn: 'Neumorphism, Glassmorphism & Beyond dual-shadow extrusion in Light & Dark editions with 6 reference accents.',
    icon: 'sliders',
    light: CARD_STYLES_MAP['neumorphism-beyond'],
    dark: CARD_STYLES_MAP['dark-neumorphism-beyond'],
  },
  'frost-ice-neu': {
    familyId: 'frost-ice-neu',
    label: 'Băng Tuyết Nổi Khối',
    labelEn: 'Frost Ice Neumorphism',
    description:
      'Băng Tuyết Nổi Khối Sáng & Tối: Soft Clay Neumorphism xanh băng thanh khiết với 4 dải điểm nhấn Tím Violet, Aqua, Cam Mơ, Hồng Rose.',
    descriptionEn:
      'Frost Ice Neumorphism Light & Dark: soft glacier clay extrusion paired with Violet, Aqua, Apricot, and Rose luminous accents.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['frost-ice-neu'],
    dark: CARD_STYLES_MAP['dark-frost-ice-neu'],
  },
  'multicolor-glass': {
    familyId: 'multicolor-glass',
    label: 'Glass UI',
    labelEn: 'Glass UI',
    description: 'Glass UI Đa Sắc (Sáng) và Glass UI Neon Tối (Tối) với hiệu ứng kính mờ phản quang đa sắc.',
    descriptionEn: 'Multicolor frosted Glass UI (Light) paired with Dark Neon obsidian Glass UI (Dark).',
    icon: 'zap',
    light: CARD_STYLES_MAP['multicolor-glass'],
    dark: CARD_STYLES_MAP['dark-neon-glass'],
    color: CARD_STYLES_MAP['multicolor-glass'],
  },
  'flat-soft-ui': {
    familyId: 'flat-soft-ui',
    label: 'Flat Soft UI',
    labelEn: 'Flat Soft UI',
    description:
      'Flat Soft UI Sáng & Tối: phong cách phẳng thanh lịch với độ nổi khối siêu mềm mại, bề mặt mịn màng tinh tế, độ tương phản cao và chống mỏi mắt.',
    descriptionEn:
      'Flat Soft UI Light & Dark: elegant flat planes, whisper-soft elevation, pristine matte surfaces, high contrast, and zero glare.',
    icon: 'layout',
    light: CARD_STYLES_MAP['flat-soft-ui'],
    dark: CARD_STYLES_MAP['dark-flat-soft-ui'],
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
  'soft-indigo-fintech': 'neumorphism-beyond',
  'dark-soft-indigo-fintech': 'dark-liquid-glass',
  'light-cowhide-leather': 'liquid-glass',
  'ice-blue-neu': 'liquid-glass',
  'dark-ice-blue-neu': 'dark-liquid-glass',
  'glass-flat': 'liquid-glass',
  'rainbow-glass': 'liquid-glass',
  'dark-rainbow-glass': 'dark-liquid-glass',
  'special-rainbow-glass': 'dark-liquid-glass',
  'mica-fluent': 'neumorphism-beyond',
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
