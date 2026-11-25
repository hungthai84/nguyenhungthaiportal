import React from 'react';
import { CardStyleMode, CardStyleConfig, ThemeFamilyId, ThemeMechanismMode } from './theme.types';
import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const THEME_FOUR_WORD_NAMES: Record<CardStyleMode, { vi: string; en: string }> = {
  'liquid-glass': { vi: 'Kính Lỏng Mềm Sáng', en: 'Liquid Glass Soft Light' },
  'dark-liquid-glass': { vi: 'Kính Lỏng Mềm Tối', en: 'Liquid Glass Soft Dark' },
  'multicolor-glass': { vi: 'Kính Mờ Đa Sắc', en: 'Multicolor Frosted Glass UI' },
  'dark-neon-glass': { vi: 'Kính Ánh Sáng Tối', en: 'Dark Neon Glass UI' },
  'cowhide-leather': { vi: 'Da Bò Cổ Điển', en: 'Brown Leather Classic Edition' },
  'black-cowhide-leather': { vi: 'Vân Gỗ Óc Chó', en: 'Premium Walnut Wood Grain' },
  'deep-ocean': { vi: 'Đại Dương Sâu Thẳm', en: 'Deep Ocean Dark Blue' },
  'light-deep-ocean': { vi: 'Biển Xanh Ánh Kính', en: 'Light Ocean Navy Glass' },
  'neumorphism-beyond': {
    vi: 'Nổi Khối Kính Mờ',
    en: 'Soft UI Glass Beyond',
  },
  'dark-neumorphism-beyond': {
    vi: 'Khối Kính Mờ Tối',
    en: 'Dark Soft Glass Beyond',
  },
  'frost-ice-neu': {
    vi: 'Băng Tuyết Nổi Khối',
    en: 'Frost Ice Matte Soft',
  },
  'dark-frost-ice-neu': {
    vi: 'Băng Tuyết Tối Màu',
    en: 'Dark Frost Ice Matte',
  },
  'flat-soft-ui': {
    vi: 'Giao Diện Phẳng Sáng',
    en: 'Flat Soft UI Light',
  },
  'dark-flat-soft-ui': {
    vi: 'Giao Diện Phẳng Tối',
    en: 'Flat Soft UI Dark',
  },
  'mica-fluent': {
    vi: 'Mica / Fluent Design',
    en: 'Mica / Fluent Design',
  },
  'gradient-dopamine': {
    vi: 'Gradient / Dopamine UI – Đa sắc',
    en: 'Gradient / Dopamine UI – Multicolor',
  },
  'dark-luxury': {
    vi: 'Dark Luxury – Sang trọng tối màu',
    en: 'Dark Luxury – Metallic Obsidian',
  },
  'minimalism': {
    vi: 'Minimalism – Tối giản',
    en: 'Minimalism – Pure Editorial',
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
    label: 'Kính Lỏng Mềm Mại',
    labelEn: 'Liquid Glass Soft UI',
    description:
      'Giao diện kính lỏng quang học trong suốt có viền phản quang sáng mảnh, sắc độ thích ứng theo nền và tách bạch rõ vùng nội dung sáng tối sắc nét.',
    descriptionEn:
      'Liquid Glass Soft UI: optical glass material with subtle specular rim highlights, adaptive tint, and clear separation between floating glass chrome and readable content cards.',
    icon: 'sparkles',
    defaultMode: 'liquid-glass',
    lightMode: 'liquid-glass',
    darkMode: 'dark-liquid-glass',
  },
  {
    id: 'cowhide-leather',
    label: 'Da Bò & Gỗ Óc Chó',
    labelEn: 'Heritage Leather & Walnut',
    description:
      'Chất liệu da bò cổ điển màu nâu chỉ kem (Sáng) và phiên bản Vân Gỗ Óc Chó viền khảm đồng thanh lịch (Tối).',
    descriptionEn:
      'Classic brown cowhide leather with cream stitching paired with Premium Walnut Wood Grain accented by solid brass hairline inlay.',
    icon: 'briefcase',
    defaultMode: 'cowhide-leather',
    lightMode: 'cowhide-leather',
    darkMode: 'black-cowhide-leather',
    colorMode: 'cowhide-leather',
  },
  {
    id: 'deep-ocean',
    label: 'Biển Xanh Đại Dương',
    labelEn: 'Light Ocean Navy',
    description:
      'Giao diện biển xanh ánh kính: nền sáng trắng xanh đại dương, thẻ kính mờ cao cấp, sắc xanh lam đậm và điểm nhấn xanh ngọc.',
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
      'Giao diện nổi khối kép kết hợp kính mờ hiện đại trên nền sáng #EBF0F6 và nền tối #151B26 cùng hệ 6 sắc màu nổi bật.',
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
      'Giao diện nổi khối lì thuần chất không viền: nền và thẻ đồng nhất một màu lì (#E0E8F2 / #1A2433), đùn nổi bằng cặp bóng đổ đối xứng sáng/tối và điểm nhấn đơn sắc.',
    descriptionEn:
      'Authentic borderless Neumorphism (Soft UI): uniform matte surface shared across canvas and controls (#E0E8F2 / #1A2433), dual opposing soft shadows, inset pressed states, and a single saturated primary accent.',
    icon: 'sparkles',
    defaultMode: 'frost-ice-neu',
    lightMode: 'frost-ice-neu',
    darkMode: 'dark-frost-ice-neu',
  },
  {
    id: 'multicolor-glass',
    label: 'Kính Mờ Đa Sắc',
    labelEn: 'Glass UI',
    description:
      'Giao diện kính mờ đa sắc (Sáng) kết hợp kính ánh sáng tối (Tối): kính mờ trong suốt bão hòa cao cùng viền phản quang tinh tế.',
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
    label: 'Giao Diện Phẳng Mềm',
    labelEn: 'Flat Soft UI',
    description:
      'Giao diện phẳng hiện đại, thanh lịch với độ nổi khối siêu mềm mại, bề mặt mịn màng tinh tế, độ tương phản cao và không gây mỏi mắt.',
    descriptionEn:
      'Modern Flat Soft UI with elegant flat planes, whisper-soft elevation, pristine matte surfaces, high-contrast readability, and zero glare.',
    icon: 'layout',
    defaultMode: 'flat-soft-ui',
    lightMode: 'flat-soft-ui',
    darkMode: 'dark-flat-soft-ui',
  },
  {
    id: 'mica-fluent',
    label: 'Mica / Fluent Design',
    labelEn: 'Mica / Fluent Design',
    description:
      'Lớp nền bán trong suốt, ánh sáng dịu, phân cấp cửa sổ và bề mặt tinh tế theo phong cách Windows hiện đại.',
    descriptionEn:
      'Mica / Fluent Design: translucent layered material, soft ambient illumination, refined window hierarchy, and subtle modern Windows surfaces.',
    icon: 'layers',
    defaultMode: 'mica-fluent',
    lightMode: 'mica-fluent',
    colorMode: 'mica-fluent',
  },
  {
    id: 'gradient-dopamine',
    label: 'Gradient / Dopamine UI – Đa sắc',
    labelEn: 'Gradient / Dopamine UI',
    description:
      'Gradient chuyển màu, màu sắc sinh động, phối màu giàu năng lượng.',
    descriptionEn:
      'Gradient / Dopamine UI: vivid color transitions, vibrant multi-hue surfaces, and high-energy dopamine color palettes.',
    icon: 'sparkles',
    defaultMode: 'gradient-dopamine',
    lightMode: 'gradient-dopamine',
    colorMode: 'gradient-dopamine',
  },
  {
    id: 'dark-luxury',
    label: 'Dark Luxury – Sang trọng tối màu',
    labelEn: 'Dark Luxury Edition',
    description:
      'Nền tối, typography tinh tế, điểm nhấn ánh kim và tương phản cao.',
    descriptionEn:
      'Dark Luxury: deep obsidian surfaces, refined editorial typography, metallic champagne-gold accents, and high contrast.',
    icon: 'award',
    defaultMode: 'dark-luxury',
    darkMode: 'dark-luxury',
  },
  {
    id: 'minimalism',
    label: 'Minimalism – Tối giản',
    labelEn: 'Minimalism UI',
    description:
      'Hạn chế trang trí, tập trung nội dung, typography rõ ràng và nhiều khoảng trắng.',
    descriptionEn:
      'Minimalism: restrained ornament, content-first hierarchy, crisp typography, and generous breathing whitespace.',
    icon: 'layout',
    defaultMode: 'minimalism',
    lightMode: 'minimalism',
  },
];

/**
 * Mảng hợp nhất tất cả giao diện hệ thống theo từng nhóm đồng nhất (Single Source of Truth)
 */
export const UNIFIED_INTERFACE_THEMES: CardStyleConfig[] = [
  {
    id: 'liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Kính Lỏng Mềm Mại',
    familyLabelEn: 'Liquid Glass Soft UI',
    mechanism: 'light',
    counterpartMode: 'dark-liquid-glass',
    cardClassName: 'card-liquid-glass',
    name: 'Kính Lỏng Mềm Sáng',
    label: 'Kính Lỏng Mềm Sáng',
    shortBadge: 'Kính Lỏng Mềm Sáng',
    tagLabel: 'Kính lỏng mềm · Phiên bản sáng',
    modeLabel: 'Kính Lỏng Mềm Sáng',
    isDark: false,
    icon: 'sparkles',
    color: '#6D28D9',
    desc: 'Vật liệu kính quang học trong suốt có viền phản quang sáng mảnh, thanh điều hướng nổi tinh tế và vùng thẻ nội dung sáng rõ dễ đọc.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(255, 255, 255, 0.78) 0%, rgba(248, 246, 247, 0.72) 52%, rgba(241, 231, 229, 0.68) 100%)',
      backdropFilter: 'blur(16px) saturate(165%)',
      WebkitBackdropFilter: 'blur(16px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.86)',
      boxShadow:
        '0 18px 42px -10px rgba(79, 70, 229, 0.16), 0 6px 16px -4px rgba(109, 40, 217, 0.08), inset 0 1.5px 0 rgba(255, 255, 255, 0.94), inset 0 -1px 0 rgba(255, 255, 255, 0.42)',
      color: '#1E293B',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.72)',
      borderColor: 'rgba(255, 255, 255, 0.88)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.82)',
      color: '#1E293B',
      borderColor: 'rgba(255, 255, 255, 0.88)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-violet-50/90 text-[#6D28D9] border-violet-200/80',
    layerDepth: 100,
  },
  {
    id: 'dark-liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Kính Lỏng Mềm Mại',
    familyLabelEn: 'Liquid Glass Soft UI',
    mechanism: 'dark',
    counterpartMode: 'liquid-glass',
    cardClassName: 'card-dark-liquid-glass',
    name: 'Kính Lỏng Mềm Tối',
    label: 'Kính Lỏng Mềm Tối',
    shortBadge: 'Kính Lỏng Mềm Tối',
    tagLabel: 'Kính lỏng mềm · Phiên bản tối',
    modeLabel: 'Kính Lỏng Mềm Tối',
    isDark: true,
    icon: 'moon',
    color: '#B5A7F4',
    desc: 'Kính lỏng phiên bản tối (bo góc 14px): kính quang học trong suốt làm mờ 18px, viền phản quang đa tầng và chiều sâu tương phản rõ nét.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(26, 38, 62, 0.82) 0%, rgba(23, 31, 51, 0.86) 55%, rgba(16, 26, 43, 0.90) 100%)',
      backdropFilter: 'blur(16px) saturate(165%)',
      WebkitBackdropFilter: 'blur(16px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(181, 167, 244, 0.28)',
      boxShadow:
        '0 20px 48px -12px rgba(2, 6, 23, 0.72), 0 0 24px -8px rgba(181, 167, 244, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(2, 6, 23, 0.42)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(23, 31, 51, 0.78)',
      borderColor: 'rgba(181, 167, 244, 0.24)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(34, 48, 78, 0.78)',
      color: '#F8FAFC',
      borderColor: 'rgba(181, 167, 244, 0.24)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #B5A7F4 0%, #9889EE 58%, #67E8F9 100%)',
      color: '#101A2B',
    },
    badgeColorClass: 'bg-[#171F33]/90 text-[#B5A7F4] border-violet-300/25',
    layerDepth: 100,
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
      borderRadius: '14px',
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
    layerDepth: 100,
  },
  {
    id: 'black-cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Da Bò & Gỗ Óc Chó',
    familyLabelEn: 'Heritage Leather & Walnut',
    mechanism: 'dark',
    counterpartMode: 'cowhide-leather',
    cardClassName: 'card-black-cowhide-leather',
    name: 'Vân Gỗ Óc Chó',
    label: 'Vân Gỗ Óc Chó',
    shortBadge: 'Vân Gỗ Óc Chó',
    tagLabel: 'Vân Gỗ Óc Chó · Khảm Đồng',
    modeLabel: 'Vân Gỗ Óc Chó',
    isDark: true,
    icon: 'briefcase',
    color: '#F5C478',
    desc: 'Vân gỗ óc chó sẫm thủ công (#3A2214 → #1B1009) với đường khảm đồng mảnh liền nét, sắc chữ trắng ngà ấm áp và điểm nhấn hổ phách tinh tế.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #3A2214 0%, #24150C 50%, #160D07 100%)',
      borderRadius: '14px',
      border: '1.5px solid #4E2F1B',
      boxShadow:
        '0 18px 38px rgba(10, 5, 2, 0.58), inset 0 1px 0 rgba(245, 196, 120, 0.24), inset 0 -3px 6px rgba(0, 0, 0, 0.65)',
      color: '#FFFBF4',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #2A190F 0%, #150C06 100%)',
      borderColor: 'rgba(245, 196, 120, 0.36)',
      borderStyle: 'solid',
    },
    miniTabStyle: {
      background: 'rgba(42, 25, 15, 0.92)',
      color: '#FFFBF4',
      borderColor: 'rgba(245, 196, 120, 0.32)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #F5C478 0%, #D97706 100%)',
      color: '#1B1009',
    },
    badgeColorClass: 'bg-[#2A190F]/92 text-[#F5C478] border-[#F5C478]/45',
    layerDepth: 100,
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
    shortBadge: 'Đại Dương Sâu Thẳm',
    tagLabel: 'Đại dương tối · Xanh lam & Ngọc',
    modeLabel: 'Đại Dương Sâu Thẳm',
    isDark: true,
    icon: 'compass',
    color: '#38BDF8',
    desc: 'Giao diện đại dương sâu thẳm tối: nền xanh biển sâu (#050B14), các lớp bề mặt xanh đại dương, chữ sáng xanh và điểm nhấn ngọc bích.',
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
    layerDepth: 100,
  },
  {
    id: 'light-deep-ocean',
    familyId: 'deep-ocean',
    familyLabel: 'Đại Dương Sâu Thẳm',
    familyLabelEn: 'Deep Ocean',
    mechanism: 'light',
    counterpartMode: 'deep-ocean',
    cardClassName: 'card-light-deep-ocean',
    name: 'Biển Xanh Ánh Kính',
    label: 'Biển Xanh Ánh Kính',
    shortBadge: 'Biển Xanh Ánh Kính',
    tagLabel: 'Biển xanh ánh kính · Trong trẻo',
    modeLabel: 'Biển Xanh Ánh Kính',
    isDark: false,
    icon: 'sun',
    color: '#1951FC',
    desc: 'Giao diện biển xanh ánh kính: nền xanh đại dương sáng (#1951FC), thẻ xanh kính nhiều lớp (#3781FC/#73BFFF), sắc xanh đậm (#03195B) và độ bóng tinh tế.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, rgba(115, 191, 255, 0.42), rgba(55, 129, 252, 0.30), rgba(203, 233, 253, 0.32))',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.55)',
      boxShadow: '0 8px 24px rgba(3, 25, 91, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -2px 8px rgba(25, 81, 252, 0.12)',
      color: '#03195B',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, rgba(115, 191, 255, 0.45) 0%, rgba(55, 129, 252, 0.30) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.65)',
    },
    miniTabStyle: {
      background: 'rgba(203, 233, 253, 0.88)',
      color: '#03195B',
      borderColor: 'rgba(255, 255, 255, 0.72)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #1951FC 0%, #3781FC 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#CBE9FD]/90 text-[#03195B] border-white/80',
    layerDepth: 100,
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
    tagLabel: 'Nổi khối · Kính mờ · 6 Sắc màu',
    modeLabel: 'Nổi Khối Kính Mờ',
    isDark: false,
    icon: 'sliders',
    color: '#4973FF',
    desc: 'Giao diện nổi khối kép sắc nét kết hợp kính mờ dịu mắt trên nền sáng #EBF0F6 với bộ 6 sắc màu hiện đại.',
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
    layerDepth: 100,
  },
  {
    id: 'dark-neumorphism-beyond',
    familyId: 'neumorphism-beyond',
    familyLabel: 'Nổi Khối Kính Mờ',
    familyLabelEn: 'Soft UI Glass Beyond',
    mechanism: 'dark',
    counterpartMode: 'neumorphism-beyond',
    cardClassName: 'card-dark-neumorphism-beyond',
    name: 'Khối Kính Mờ Tối',
    label: 'Khối Kính Mờ Tối',
    shortBadge: 'Khối Kính Mờ Tối',
    tagLabel: 'Nổi khối tối · Kính mờ · 6 Sắc màu',
    modeLabel: 'Khối Kính Mờ Tối',
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
    layerDepth: 100,
  },
  {
    id: 'frost-ice-neu',
    familyId: 'frost-ice-neu',
    familyLabel: 'Băng Tuyết Nổi Khối',
    familyLabelEn: 'Frost Ice Neumorphism',
    mechanism: 'light',
    counterpartMode: 'dark-frost-ice-neu',
    cardClassName: 'card-frost-ice-neu',
    name: 'Băng Tuyết Nổi Khối',
    label: 'Băng Tuyết Nổi Khối',
    shortBadge: 'Băng Tuyết Nổi Khối',
    tagLabel: 'Nổi khối lì · Băng tuyết sáng',
    modeLabel: 'Băng Tuyết Nổi Khối',
    isDark: false,
    icon: 'sun',
    color: '#5B57E8',
    desc: 'Giao diện nổi khối thuần chất: bề mặt lì đồng nhất #E0E8F2 không viền, không mờ kính, đùn nổi bằng cặp bóng mềm đối xứng sáng tối và nhấn lõm tinh tế.',
    cardSampleStyle: {
      background: '#E0E8F2',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '14px',
      border: 'none',
      boxShadow:
        '-7px -7px 16px rgba(255, 255, 255, 0.86), 7px 7px 16px rgba(163, 179, 199, 0.58)',
      color: '#18273B',
    },
    miniPreviewWrapStyle: {
      background: '#E0E8F2',
      border: 'none',
      boxShadow:
        'inset -4px -4px 9px rgba(255, 255, 255, 0.85), inset 4px 4px 9px rgba(163, 179, 199, 0.56)',
    },
    miniTabStyle: {
      background: '#E0E8F2',
      color: '#18273B',
      border: 'none',
      boxShadow:
        '-4px -4px 9px rgba(255, 255, 255, 0.86), 4px 4px 9px rgba(163, 179, 199, 0.56)',
    },
    miniBtnStyle: {
      background: '#5B57E8',
      color: '#FFFFFF',
      border: 'none',
      boxShadow:
        '-3px -3px 8px rgba(255, 255, 255, 0.80), 4px 4px 10px rgba(91, 87, 232, 0.34)',
    },
    badgeColorClass: 'bg-[#E0E8F2] text-[#433EC9] border-0',
    layerDepth: 100,
  },
  {
    id: 'dark-frost-ice-neu',
    familyId: 'frost-ice-neu',
    familyLabel: 'Băng Tuyết Nổi Khối',
    familyLabelEn: 'Frost Ice Neumorphism',
    mechanism: 'dark',
    counterpartMode: 'frost-ice-neu',
    cardClassName: 'card-dark-frost-ice-neu',
    name: 'Băng Tuyết Tối Màu',
    label: 'Băng Tuyết Tối Màu',
    shortBadge: 'Băng Tuyết Tối Màu',
    tagLabel: 'Nổi khối lì · Băng tuyết tối',
    modeLabel: 'Băng Tuyết Tối Màu',
    isDark: true,
    icon: 'moon',
    color: '#6E6AF6',
    desc: 'Nổi khối tối thuần chất: bề mặt xanh lam trầm đồng nhất #1A2433 không viền, không bóng kính, đùn nổi đối xứng mềm chống chói và điểm nhấn tím thanh lịch.',
    cardSampleStyle: {
      background: '#1A2433',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '14px',
      border: 'none',
      boxShadow:
        '-7px -7px 16px rgba(38, 52, 74, 0.70), 7px 7px 16px rgba(10, 15, 24, 0.78)',
      color: '#F1F6FC',
    },
    miniPreviewWrapStyle: {
      background: '#1A2433',
      border: 'none',
      boxShadow:
        'inset -4px -4px 9px rgba(38, 52, 74, 0.68), inset 4px 4px 9px rgba(10, 15, 24, 0.78)',
    },
    miniTabStyle: {
      background: '#1A2433',
      color: '#F1F6FC',
      border: 'none',
      boxShadow:
        '-4px -4px 9px rgba(38, 52, 74, 0.68), 4px 4px 9px rgba(10, 15, 24, 0.76)',
    },
    miniBtnStyle: {
      background: '#6E6AF6',
      color: '#FFFFFF',
      border: 'none',
      boxShadow:
        '-3px -3px 8px rgba(38, 52, 74, 0.65), 4px 4px 10px rgba(8, 12, 22, 0.75)',
    },
    badgeColorClass: 'bg-[#1A2433] text-[#B8B6FF] border-0',
    layerDepth: 100,
  },
  {
    id: 'multicolor-glass',
    familyId: 'multicolor-glass',
    familyLabel: 'Kính Mờ Đa Sắc',
    familyLabelEn: 'Glass UI',
    mechanism: 'color',
    counterpartMode: 'dark-neon-glass',
    cardClassName: 'card-multicolor-glass',
    name: 'Kính Mờ Đa Sắc',
    label: 'Kính Mờ Đa Sắc',
    shortBadge: 'Kính Mờ Đa Sắc',
    tagLabel: 'Kính mờ · Thẩm thấu đa sắc',
    modeLabel: 'Kính Mờ Đa Sắc',
    isDark: false,
    icon: 'sparkles',
    color: '#6366F1',
    desc: 'Bề mặt kính mờ bán trong suốt với độ làm mờ nền 16px, viền trắng mỏng mảnh và đổ bóng rộng đa tầng cho màu nền rực rỡ xuyên thấu.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow:
        '0 20px 44px -12px rgba(15, 23, 42, 0.18), 0 8px 20px -6px rgba(99, 102, 241, 0.12)',
      color: '#0F172A',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.16)',
      borderColor: 'rgba(255, 255, 255, 0.30)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.24)',
      color: '#0F172A',
      borderColor: 'rgba(255, 255, 255, 0.35)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 52%, #06B6D4 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/30 text-[#0F172A] border-white/40',
    layerDepth: 100,
  },
  {
    id: 'dark-neon-glass',
    familyId: 'multicolor-glass',
    familyLabel: 'Kính Mờ Đa Sắc',
    familyLabelEn: 'Glass UI',
    mechanism: 'dark',
    counterpartMode: 'multicolor-glass',
    cardClassName: 'card-dark-neon-glass',
    name: 'Kính Ánh Sáng Tối',
    label: 'Kính Ánh Sáng Tối',
    shortBadge: 'Kính Ánh Sáng Tối',
    tagLabel: 'Kính tối · Thẩm thấu ánh sáng',
    modeLabel: 'Kính Ánh Sáng Tối',
    isDark: true,
    icon: 'zap',
    color: '#22D3EE',
    desc: 'Kính tối sâu thẳm: tấm kính bán trong suốt kết hợp làm mờ nền 16px, viền trắng sáng mảnh và dải sắc độ rực rỡ xuyên qua bề mặt mọi thẻ nội dung.',
    cardSampleStyle: {
      background: 'rgba(15, 23, 42, 0.34)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow:
        '0 22px 48px -12px rgba(2, 6, 23, 0.56), 0 8px 24px -6px rgba(34, 211, 238, 0.16)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(15, 23, 42, 0.42)',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.12)',
      color: '#F8FAFC',
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 50%, #D946EF 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#091229]/70 text-[#67E8F9] border-white/25',
    layerDepth: 100,
  },
  {
    id: 'flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Giao Diện Phẳng Mềm',
    familyLabelEn: 'Flat Soft UI',
    mechanism: 'light',
    counterpartMode: 'dark-flat-soft-ui',
    cardClassName: 'card-flat-soft-ui',
    name: 'Giao Diện Phẳng Sáng',
    label: 'Giao Diện Phẳng Sáng',
    shortBadge: 'Giao Diện Phẳng Sáng',
    tagLabel: 'Bề mặt phẳng · Sứ mịn sáng',
    modeLabel: 'Giao Diện Phẳng Sáng',
    isDark: false,
    icon: 'layout',
    color: '#4F46E5',
    desc: 'Bề mặt sứ mờ siêu phẳng và tinh khiết (#FFFFFF), viền mảnh mềm mại và bóng đổ khuếch tán đa tầng tạo độ nổi khối dịu êm.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '14px',
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
    layerDepth: 100,
  },
  {
    id: 'dark-flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Giao Diện Phẳng Mềm',
    familyLabelEn: 'Flat Soft UI',
    mechanism: 'dark',
    counterpartMode: 'flat-soft-ui',
    cardClassName: 'card-dark-flat-soft-ui',
    name: 'Giao Diện Phẳng Tối',
    label: 'Giao Diện Phẳng Tối',
    shortBadge: 'Giao Diện Phẳng Tối',
    tagLabel: 'Bề mặt phẳng · Nhung xám tối',
    modeLabel: 'Giao Diện Phẳng Tối',
    isDark: true,
    icon: 'moon',
    color: '#6366F1',
    desc: 'Mặt tối nhung êm dịu (#131B2A) không gây chói mắt, viền mảnh tinh tế và độ tương phản chữ sắc nét dịu nhẹ suốt ngày dài.',
    cardSampleStyle: {
      background: 'rgba(19, 27, 42, 0.94)',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '14px',
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
    layerDepth: 100,
  },
  {
    id: 'mica-fluent',
    familyId: 'mica-fluent',
    familyLabel: 'Mica / Fluent Design',
    familyLabelEn: 'Mica / Fluent Design',
    mechanism: 'light',
    counterpartMode: 'mica-fluent',
    cardClassName: 'card-mica-fluent',
    name: 'Mica / Fluent Design',
    label: 'Mica / Fluent Design',
    shortBadge: 'Mica / Fluent',
    tagLabel: 'Mica / Fluent · Windows hiện đại',
    modeLabel: 'Mica / Fluent Design',
    isDark: false,
    icon: 'layers',
    color: '#e84118',
    desc: 'Lớp nền bán trong suốt, ánh sáng dịu, phân cấp cửa sổ và bề mặt tinh tế theo phong cách Windows hiện đại.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.30)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.35)',
      boxShadow: '0px 4px 7px 2px rgba(0, 0, 0, 0.09)',
      color: '#1c0708',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.30)',
      borderColor: 'rgba(255, 255, 255, 0.45)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'linear-gradient(25deg, #525a65, #3b424c)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.28)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #e84118 0%, #c23616 100%)',
      color: '#FDFDFD',
    },
    badgeColorClass: 'bg-[#fff3f0] text-[#c23616] border-[#e84118]/30 shadow-sm',
    layerDepth: 100,
  },
  {
    id: 'gradient-dopamine',
    familyId: 'gradient-dopamine',
    familyLabel: 'Gradient / Dopamine UI – Đa sắc',
    familyLabelEn: 'Gradient / Dopamine UI',
    mechanism: 'color',
    counterpartMode: 'gradient-dopamine',
    cardClassName: 'card-gradient-dopamine',
    name: 'Gradient / Dopamine UI – Đa sắc',
    label: 'Gradient / Dopamine UI – Đa sắc',
    shortBadge: 'Dopamine UI',
    tagLabel: 'Gradient chuyển màu · Đa sắc năng lượng',
    modeLabel: 'Gradient / Dopamine UI – Đa sắc',
    isDark: false,
    icon: 'sparkles',
    color: '#FF2E93',
    desc: 'Gradient chuyển màu, màu sắc sinh động, phối màu giàu năng lượng.',
    cardSampleStyle: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 240, 248, 0.84) 48%, rgba(240, 247, 255, 0.86) 100%)',
      backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      borderRadius: '18px',
      border: '1.5px solid rgba(255, 46, 147, 0.35)',
      boxShadow:
        '0 16px 36px -10px rgba(255, 46, 147, 0.22), 0 8px 20px -6px rgba(124, 58, 237, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
      color: '#181028',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(255, 46, 147, 0.14) 0%, rgba(124, 58, 237, 0.14) 50%, rgba(0, 210, 255, 0.14) 100%)',
      borderColor: 'rgba(255, 46, 147, 0.35)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.90)',
      color: '#181028',
      borderColor: 'rgba(255, 46, 147, 0.32)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #FF2E93 0%, #7C3AED 52%, #FF6B00 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-pink-50 text-[#FF2E93] border-pink-300/70 shadow-xs',
    layerDepth: 100,
  },
  {
    id: 'dark-luxury',
    familyId: 'dark-luxury',
    familyLabel: 'Dark Luxury – Sang trọng tối màu',
    familyLabelEn: 'Dark Luxury Edition',
    mechanism: 'dark',
    counterpartMode: 'dark-luxury',
    cardClassName: 'card-dark-luxury',
    name: 'Dark Luxury – Sang trọng tối màu',
    label: 'Dark Luxury – Sang trọng tối màu',
    shortBadge: 'Dark Luxury',
    tagLabel: 'Nền tối · Ánh kim · Tương phản cao',
    modeLabel: 'Dark Luxury – Sang trọng tối màu',
    isDark: true,
    icon: 'award',
    color: '#D4AF37',
    desc: 'Nền tối, typography tinh tế, điểm nhấn ánh kim và tương phản cao.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(20, 22, 31, 0.96) 0%, rgba(12, 14, 20, 0.96) 55%, rgba(8, 9, 13, 0.98) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '18px',
      border: '1px solid rgba(212, 175, 55, 0.42)',
      boxShadow:
        '0 20px 44px -10px rgba(0, 0, 0, 0.85), 0 0 24px -8px rgba(212, 175, 55, 0.22), inset 0 1px 0 rgba(243, 229, 171, 0.26)',
      color: '#FAF8F5',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #161822 0%, #0B0C10 100%)',
      borderColor: 'rgba(212, 175, 55, 0.38)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(24, 26, 36, 0.95)',
      color: '#F3E5AB',
      borderColor: 'rgba(212, 175, 55, 0.36)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 52%, #AA7C11 100%)',
      color: '#090A0F',
    },
    badgeColorClass: 'bg-[#14161F] text-[#F3E5AB] border-[#D4AF37]/45',
    layerDepth: 100,
  },
  {
    id: 'minimalism',
    familyId: 'minimalism',
    familyLabel: 'Minimalism – Tối giản',
    familyLabelEn: 'Minimalism UI',
    mechanism: 'light',
    counterpartMode: 'minimalism',
    cardClassName: 'card-minimalism',
    name: 'Minimalism – Tối giản',
    label: 'Minimalism – Tối giản',
    shortBadge: 'Minimalism',
    tagLabel: 'Tối giản · Typography rõ ràng · Khoảng trắng',
    modeLabel: 'Minimalism – Tối giản',
    isDark: false,
    icon: 'layout',
    color: '#111111',
    desc: 'Hạn chế trang trí, tập trung nội dung, typography rõ ràng và nhiều khoảng trắng.',
    cardSampleStyle: {
      background: '#FFFFFF',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '18px',
      border: '1px solid #E4E4E7',
      boxShadow: '0 1px 2px rgba(17, 17, 17, 0.03)',
      color: '#111111',
    },
    miniPreviewWrapStyle: {
      background: '#FAFAFA',
      borderColor: '#E4E4E7',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: '#FFFFFF',
      color: '#111111',
      borderColor: '#E4E4E7',
    },
    miniBtnStyle: {
      background: '#111111',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    layerDepth: 100,
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
    label: 'Kính Lỏng Mềm Mại',
    labelEn: 'Liquid Glass Soft UI',
    description:
      'Giao diện kính lỏng quang học trong suốt có viền phản quang sáng mảnh, sắc độ thích ứng theo nền.',
    descriptionEn: 'Liquid Glass Soft UI: optical glass material with subtle specular rim highlights and adaptive tint.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['liquid-glass'],
    dark: CARD_STYLES_MAP['dark-liquid-glass'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Da Bò & Gỗ Óc Chó',
    labelEn: 'Heritage Leather & Walnut',
    description: 'Da Bò Cổ Điển (nâu chỉ kem) và Vân Gỗ Óc Chó khảm đồng liền nét.',
    descriptionEn: 'Classic brown leather and premium walnut wood grain with solid brass inlay.',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['cowhide-leather'],
    dark: CARD_STYLES_MAP['black-cowhide-leather'],
    color: CARD_STYLES_MAP['cowhide-leather'],
  },
  'deep-ocean': {
    familyId: 'deep-ocean',
    label: 'Biển Xanh Đại Dương',
    labelEn: 'Deep Ocean',
    description: 'Biển Xanh Ánh Kính & Đại Dương Sâu Thẳm: giao diện thủy tinh nắng biển sáng trong và xanh lam sâu thẳm.',
    descriptionEn: 'Deep Ocean Light & Dark: sunlit coastal aqua crystal glass paired with abyssal navy.',
    icon: 'compass',
    light: CARD_STYLES_MAP['light-deep-ocean'],
    dark: CARD_STYLES_MAP['deep-ocean'],
  },
  'neumorphism-beyond': {
    familyId: 'neumorphism-beyond',
    label: 'Nổi Khối Kính Mờ',
    labelEn: 'Soft UI Glass Beyond',
    description: 'Nổi khối kép sắc nét kết hợp kính mờ phiên bản Sáng & Tối cùng 6 sắc màu chuẩn.',
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
      'Băng Tuyết Nổi Khối & Băng Tuyết Tối Màu: nổi khối lì thuần chất không viền trên nền #E0E8F2 / #1A2433 với bóng nổi đối xứng.',
    descriptionEn:
      'Frost Ice Neumorphism Light & Dark: borderless matte Soft UI (#E0E8F2 / #1A2433) with dual soft extrusion, inset pressed states, and a single saturated primary accent.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['frost-ice-neu'],
    dark: CARD_STYLES_MAP['dark-frost-ice-neu'],
  },
  'multicolor-glass': {
    familyId: 'multicolor-glass',
    label: 'Kính Mờ Đa Sắc',
    labelEn: 'Glass UI',
    description: 'Kính Mờ Đa Sắc (Sáng) và Kính Ánh Sáng Tối (Tối) với hiệu ứng kính mờ phản quang đa sắc.',
    descriptionEn: 'Multicolor frosted Glass UI (Light) paired with Dark Neon obsidian Glass UI (Dark).',
    icon: 'zap',
    light: CARD_STYLES_MAP['multicolor-glass'],
    dark: CARD_STYLES_MAP['dark-neon-glass'],
    color: CARD_STYLES_MAP['multicolor-glass'],
  },
  'flat-soft-ui': {
    familyId: 'flat-soft-ui',
    label: 'Giao Diện Phẳng Mềm',
    labelEn: 'Flat Soft UI',
    description:
      'Giao Diện Phẳng Sáng & Tối: phong cách phẳng thanh lịch với độ nổi khối siêu mềm mại, bề mặt mịn màng tinh tế và chống mỏi mắt.',
    descriptionEn:
      'Flat Soft UI Light & Dark: elegant flat planes, whisper-soft elevation, pristine matte surfaces, high contrast, and zero glare.',
    icon: 'layout',
    light: CARD_STYLES_MAP['flat-soft-ui'],
    dark: CARD_STYLES_MAP['dark-flat-soft-ui'],
  },
  'mica-fluent': {
    familyId: 'mica-fluent',
    label: 'Mica / Fluent Design',
    labelEn: 'Mica / Fluent Design',
    description:
      'Lớp nền bán trong suốt, ánh sáng dịu, phân cấp cửa sổ và bề mặt tinh tế theo phong cách Windows hiện đại.',
    descriptionEn:
      'Mica / Fluent Design: translucent layered material, soft ambient illumination, refined window hierarchy, and subtle modern Windows surfaces.',
    icon: 'layers',
    light: CARD_STYLES_MAP['mica-fluent'],
    dark: CARD_STYLES_MAP['mica-fluent'],
    color: CARD_STYLES_MAP['mica-fluent'],
  },
  'gradient-dopamine': {
    familyId: 'gradient-dopamine',
    label: 'Gradient / Dopamine UI – Đa sắc',
    labelEn: 'Gradient / Dopamine UI',
    description:
      'Gradient chuyển màu, màu sắc sinh động, phối màu giàu năng lượng.',
    descriptionEn:
      'Gradient / Dopamine UI: vivid color transitions, vibrant multi-hue surfaces, and high-energy dopamine color palettes.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['gradient-dopamine'],
    dark: CARD_STYLES_MAP['gradient-dopamine'],
    color: CARD_STYLES_MAP['gradient-dopamine'],
  },
  'dark-luxury': {
    familyId: 'dark-luxury',
    label: 'Dark Luxury – Sang trọng tối màu',
    labelEn: 'Dark Luxury Edition',
    description:
      'Nền tối, typography tinh tế, điểm nhấn ánh kim và tương phản cao.',
    descriptionEn:
      'Dark Luxury: deep obsidian surfaces, refined editorial typography, metallic champagne-gold accents, and high contrast.',
    icon: 'award',
    light: CARD_STYLES_MAP['dark-luxury'],
    dark: CARD_STYLES_MAP['dark-luxury'],
  },
  'minimalism': {
    familyId: 'minimalism',
    label: 'Minimalism – Tối giản',
    labelEn: 'Minimalism UI',
    description:
      'Hạn chế trang trí, tập trung nội dung, typography rõ ràng và nhiều khoảng trắng.',
    descriptionEn:
      'Minimalism: restrained ornament, content-first hierarchy, crisp typography, and generous breathing whitespace.',
    icon: 'layout',
    light: CARD_STYLES_MAP['minimalism'],
    dark: CARD_STYLES_MAP['minimalism'],
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
