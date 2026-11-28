import React from 'react';
import { CardStyleMode, CardStyleConfig, ThemeFamilyId, ThemeMechanismMode } from './theme.types';
import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const THEME_FOUR_WORD_NAMES: Record<CardStyleMode, { vi: string; en: string }> = {
  'liquid-glass': { vi: 'Kính Lỏng Mềm Sáng', en: 'Liquid Glass' },
  'dark-liquid-glass': { vi: 'Kính Lỏng Mềm Tối', en: 'Dark Glass' },
  'glassmorphism': { vi: 'Glassmorphism', en: 'Glassmorphism' },
  'cowhide-leather': { vi: 'Da Bò Cổ Điển', en: 'Cowhide Leather' },
  'walnut-wood': { vi: 'Vân Gỗ Óc Chó', en: 'Walnut Wood' },
  'deep-ocean': { vi: 'Đại Dương Sâu Thẳm', en: 'Deep Ocean' },
  'frost-ice-neu': {
    vi: 'Băng Tuyết Nổi Khối',
    en: 'Frost Ice',
  },
  'neumorphism-soft-ui': {
    vi: 'Neumorphism Soft UI',
    en: 'Neumorphism Soft UI',
  },
  'flat-soft-ui': {
    vi: 'Giao Diện Phẳng Sáng',
    en: 'Flat Soft',
  },
  'dark-flat-soft-ui': {
    vi: 'Giao Diện Phẳng Tối',
    en: 'Dark Flat',
  },
  'color-flat-soft-ui': {
    vi: 'Giao Diện Phẳng Màu',
    en: 'Color Flat',
  },
  'flat-ui': {
    vi: 'Flat UI',
    en: 'Flat UI',
  },
  'nexus-bento': {
    vi: 'Nexus Bento Tối',
    en: 'Nexus Bento Dark',
  },
  'light-nexus-bento': {
    vi: 'Nexus Bento Sáng',
    en: 'Nexus Bento Light',
  },
  'mica-fluent': {
    vi: 'Kính Mờ Phân Lớp',
    en: 'Mica Fluent',
  },
  'iridescent-liquid-glass': {
    vi: 'Kính Xà Cừ Sáng',
    en: 'Iridescent Glass',
  },
  'dark-iridescent-liquid-glass': {
    vi: 'Kính Xà Cừ Tối',
    en: 'Dark Iridescent',
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
    labelEn: 'Liquid Glass',
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
    id: 'glassmorphism',
    label: 'Glassmorphism',
    labelEn: 'Glassmorphism',
    description:
      'Bề mặt kính mờ bán trong suốt (rgba(255,255,255,0.12) · blur 16px) phủ đồng bộ lên toàn bộ thẻ nội dung, viền trắng mảnh 1px trong suốt, nền gradient sống động xuyên qua từng lớp và bóng nổi mềm rộng.',
    descriptionEn:
      'Classic Glassmorphism applied across all panels and content cards: semi-transparent frosted glass (rgba(255,255,255,0.12), blur 16px), 1px white edge borders, vivid gradient/photo bleed-through, wide floating shadows, contrast scrims, and reduced-transparency fallbacks.',
    icon: 'sparkles',
    defaultMode: 'glassmorphism',
    darkMode: 'glassmorphism',
    colorMode: 'glassmorphism',
  },
  {
    id: 'cowhide-leather',
    label: 'Da Bò Thủ Công',
    labelEn: 'Cowhide Leather',
    description:
      'Chất liệu da bò cổ điển màu nâu chỉ kem khâu tay thủ công sắc nét.',
    descriptionEn:
      'Classic brown cowhide leather with cream hand-stitching.',
    icon: 'briefcase',
    defaultMode: 'cowhide-leather',
    lightMode: 'cowhide-leather',
    colorMode: 'cowhide-leather',
  },
  {
    id: 'walnut-wood',
    label: 'Vân Gỗ Óc Chó',
    labelEn: 'Walnut Wood',
    description:
      'Vân gỗ óc chó sẫm thủ công với đường khảm đồng mảnh liền nét, sắc chữ trắng ngà ấm áp và điểm nhấn hổ phách tinh tế.',
    descriptionEn:
      'Handcrafted American walnut wood grain accented by solid hairline brass inlay and warm ivory typography.',
    icon: 'briefcase',
    defaultMode: 'walnut-wood',
    darkMode: 'walnut-wood',
  },
  {
    id: 'deep-ocean',
    label: 'Đại Dương Sâu Thẳm',
    labelEn: 'Deep Ocean',
    description:
      'Giao diện đại dương sâu thẳm: nền xanh biển sâu (#050B14), các lớp bề mặt kính đại dương, sắc xanh lam và điểm nhấn ngọc bích.',
    descriptionEn:
      'Deep Ocean Dark Blue UI: abyssal navy canvas with translucent ocean surfaces and cyan highlights.',
    icon: 'compass',
    defaultMode: 'deep-ocean',
    darkMode: 'deep-ocean',
  },
  {
    id: 'neumorphism-soft-ui',
    label: 'Neumorphism Soft UI',
    labelEn: 'Neumorphism Soft UI',
    description:
      'Bề mặt Soft UI lì đồng nhất không viền (#E0E5EC), đùn nổi bằng cặp bóng đổ kép sáng–tối mềm mại, trạng thái nhấn lún chìm vào trong và một sắc nhấn bão hòa cho nút chính.',
    descriptionEn:
      'Pure material-less matte Neumorphism (#E0E5EC) with dual soft raised/inset shadows, zero borders, generous rounded corners, a single saturated primary accent, and accessible focus cues.',
    icon: 'layers',
    defaultMode: 'neumorphism-soft-ui',
    lightMode: 'neumorphism-soft-ui',
  },
  {
    id: 'flat-soft-ui',
    label: 'Giao Diện Phẳng Mềm',
    labelEn: 'Flat Soft',
    description:
      'Giao diện phẳng hiện đại, thanh lịch với độ nổi khối siêu mềm mại, bề mặt mịn màng tinh tế kết hợp bảng 14 sắc màu Thư ngỏ sắc nét.',
    descriptionEn:
      'Modern Flat Soft UI with elegant flat planes, pristine matte surfaces, high-contrast readability, and 14-color Open Letter accents.',
    icon: 'layout',
    defaultMode: 'flat-soft-ui',
    lightMode: 'flat-soft-ui',
    darkMode: 'dark-flat-soft-ui',
    colorMode: 'color-flat-soft-ui',
  },
  {
    id: 'flat-ui',
    label: 'Flat UI',
    labelEn: 'Flat UI',
    description:
      'Phong cách Flat Design thuần túy không bóng đổ, không gradient, không làm mờ — phân cấp bằng khối màu đậm rõ nét (#FFFFFF, #F3F4F6, #3B82F6, #10B981, #F59E0B), hình học gọn và kiểu chữ Outfit hiện đại.',
    descriptionEn:
      'Pure Flat Design with zero shadows, zero blur, and zero gradients — bold color blocking (#FFFFFF, #F3F4F6, #3B82F6, #10B981, #F59E0B), crisp geometric shapes, Outfit typography, and snappy 200ms scale feedback.',
    icon: 'layout',
    defaultMode: 'flat-ui',
    lightMode: 'flat-ui',
  },
  {
    id: 'nexus-bento',
    label: 'Nexus Bento',
    labelEn: 'Nexus Bento',
    description:
      'Phong cách Nexus Bento UI hiện đại: phông Play (400/700), chế độ tối mặc định #090D16 với lưới chấm bi 24px và 3 quầng sáng radial (Tím #8B5CF6, Xanh trời #38BDF8, Hồng #EC4899), thẻ Bento 12px nổi chiều sâu 3D (hover nâng -6px · phóng 1.012x) và chuyển đổi mượt sang chế độ sáng #F4F7FB.',
    descriptionEn:
      'Modern Nexus Bento UI: Play typography (400/700), default Dark Mode (#090D16) with 24px dot-grid and 3 radial halos (Violet #8B5CF6, Sky #38BDF8, Pink #EC4899), frosted #111827 nav chrome (18px radius), 12px 3D BentoCards with -6px/1.012x glow hover, and smooth Light Mode (#F4F7FB) switching.',
    icon: 'grid',
    defaultMode: 'nexus-bento',
    darkMode: 'nexus-bento',
    lightMode: 'light-nexus-bento',
  },
  {
    id: 'mica-fluent',
    label: 'Kính Mờ Phân Lớp',
    labelEn: 'Mica Fluent',
    description:
      'Lớp nền kính mờ phân lớp bán trong suốt kết hợp trọn vẹn 14 sắc màu từ Trang Thư Ngỏ, ánh sáng dịu và bề mặt tinh tế.',
    descriptionEn:
      'Mica / Fluent Design: translucent layered material illuminated by the 14-color Open Letter spectrum and refined window hierarchy.',
    icon: 'layers',
    defaultMode: 'mica-fluent',
    lightMode: 'mica-fluent',
    colorMode: 'mica-fluent',
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
    familyLabelEn: 'Soft Optical Liquid Glass',
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
    color: '#7E22CE',
    desc: 'Vật liệu kính quang học trong suốt ứng dụng bảng 14 sắc màu từ Trang Thư Ngỏ (#7E22CE → #DB2777), viền phản quang mảnh và thẻ nội dung sáng rõ.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(255, 255, 255, 0.80) 0%, rgba(248, 246, 251, 0.72) 52%, rgba(238, 242, 252, 0.68) 100%)',
      backdropFilter: 'blur(16px) saturate(165%)',
      WebkitBackdropFilter: 'blur(16px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.86)',
      boxShadow:
        '0 18px 42px -10px rgba(79, 70, 229, 0.16), 0 6px 16px -4px rgba(126, 34, 206, 0.10), inset 0 1.5px 0 rgba(255, 255, 255, 0.94), inset 0 -1px 0 rgba(255, 255, 255, 0.42)',
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
      background: 'linear-gradient(135deg, #7E22CE 0%, #4F46E5 52%, #2563EB 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-purple-50/90 text-[#7E22CE] border-purple-200/80',
  },
  {
    id: 'dark-liquid-glass',
    familyId: 'liquid-glass',
    familyLabel: 'Kính Lỏng Mềm Mại',
    familyLabelEn: 'Soft Optical Liquid Glass',
    mechanism: 'dark',
    counterpartMode: 'liquid-glass',
    cardClassName: 'card-dark-liquid-glass',
    name: 'Kính Lỏng Mềm Tối',
    label: 'Kính Lỏng Mềm Tối',
    shortBadge: 'Kính Lỏng Mềm Tối',
    tagLabel: 'Kính lỏng mềm · 14 Sắc màu · Tối',
    modeLabel: 'Kính Lỏng Mềm Tối',
    isDark: true,
    icon: 'moon',
    color: '#C084FC',
    desc: 'Kính lỏng phiên bản tối ứng dụng 14 sắc màu sáng dịu từ Trang Thư Ngỏ (#C084FC → #22D3EE), làm mờ 18px và chiều sâu tương phản rõ nét.',
    cardSampleStyle: {
      background:
        'linear-gradient(145deg, rgba(26, 38, 62, 0.82) 0%, rgba(23, 31, 51, 0.86) 55%, rgba(16, 26, 43, 0.90) 100%)',
      backdropFilter: 'blur(16px) saturate(165%)',
      WebkitBackdropFilter: 'blur(16px) saturate(165%)',
      borderRadius: '14px',
      border: '1px solid rgba(192, 132, 252, 0.28)',
      boxShadow:
        '0 20px 48px -12px rgba(2, 6, 23, 0.72), 0 0 24px -8px rgba(192, 132, 252, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(2, 6, 23, 0.42)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(23, 31, 51, 0.78)',
      borderColor: 'rgba(192, 132, 252, 0.26)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(34, 48, 78, 0.78)',
      color: '#F8FAFC',
      borderColor: 'rgba(192, 132, 252, 0.26)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #C084FC 0%, #818CF8 55%, #22D3EE 100%)',
      color: '#101A2B',
    },
    badgeColorClass: 'bg-[#171F33]/90 text-[#C084FC] border-purple-300/25',
  },
  {
    id: 'glassmorphism',
    familyId: 'glassmorphism',
    familyLabel: 'Glassmorphism',
    familyLabelEn: 'Glassmorphism',
    mechanism: 'dark',
    counterpartMode: 'glassmorphism',
    cardClassName: 'card-glassmorphism',
    name: 'Glassmorphism',
    label: 'Glassmorphism',
    shortBadge: 'Glassmorphism',
    tagLabel: 'Kính mờ 16px · Viền 1px · Xuyên nền đa sắc',
    modeLabel: 'Glassmorphism',
    isDark: true,
    icon: 'sparkles',
    color: '#38BDF8',
    desc: 'Bề mặt kính mờ bán trong suốt (blur 16px, nền trắng 12%) phủ lên toàn bộ thẻ nội dung, viền trắng 1px thanh mảnh, màu nền sống động xuyên qua từng lớp nổi và đảm bảo chữ dễ đọc.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(16px) saturate(130%)',
      WebkitBackdropFilter: 'blur(16px) saturate(130%)',
      borderRadius: '18px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow:
        '0 20px 48px -12px rgba(5, 8, 26, 0.44), 0 8px 20px -6px rgba(5, 8, 26, 0.26)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background:
        'radial-gradient(circle at 18% 20%, rgba(56, 189, 248, 0.55) 0%, transparent 56%), radial-gradient(circle at 82% 24%, rgba(236, 72, 153, 0.50) 0%, transparent 56%), radial-gradient(circle at 52% 84%, rgba(139, 92, 246, 0.52) 0%, transparent 58%), #121530',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.14)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #38BDF8 0%, #6366F1 55%, #EC4899 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white/15 text-white border-white/25',
  },
  {
    id: 'cowhide-leather',
    familyId: 'cowhide-leather',
    familyLabel: 'Da Bò Thủ Công',
    familyLabelEn: 'Classic Handcrafted Cowhide Leather',
    mechanism: 'color',
    counterpartMode: 'cowhide-leather',
    cardClassName: 'card-cowhide-leather',
    name: 'Da Bò Cổ Điển',
    label: 'Da Bò Cổ Điển',
    shortBadge: 'Da Bò Cổ Điển',
    tagLabel: 'Da Bò Cổ Điển · Chỉ kem',
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
  },
  {
    id: 'walnut-wood',
    familyId: 'walnut-wood',
    familyLabel: 'Vân Gỗ Óc Chó',
    familyLabelEn: 'Inlaid American Walnut Wood',
    mechanism: 'dark',
    counterpartMode: 'walnut-wood',
    cardClassName: 'card-walnut-wood',
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
  },
  {
    id: 'deep-ocean',
    familyId: 'deep-ocean',
    familyLabel: 'Đại Dương Sâu Thẳm',
    familyLabelEn: 'Deep Abyssal Ocean Blue',
    mechanism: 'dark',
    counterpartMode: 'deep-ocean',
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
  },
  {
    id: 'neumorphism-soft-ui',
    familyId: 'neumorphism-soft-ui',
    familyLabel: 'Neumorphism Soft UI',
    familyLabelEn: 'Neumorphism Soft UI',
    mechanism: 'light',
    counterpartMode: 'neumorphism-soft-ui',
    cardClassName: 'card-neumorphism-soft-ui',
    name: 'Neumorphism Soft UI',
    label: 'Neumorphism Soft UI',
    shortBadge: 'Neumorphism Soft UI',
    tagLabel: 'Soft UI lì · Không viền · Bóng kép',
    modeLabel: 'Neumorphism Soft UI',
    isDark: false,
    icon: 'layers',
    color: '#4F46E5',
    desc: 'Bề mặt lì đồng màu nền (#E0E5EC) không viền, bo góc rộng, đùn nổi & lún chìm bằng cặp bóng mềm kép, tương phản chữ rõ nét và một sắc nhấn chính bão hòa.',
    cardSampleStyle: {
      background: '#E0E5EC',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '22px',
      border: 'none',
      boxShadow:
        '-6px -6px 12px rgba(255, 255, 255, 0.85), 6px 6px 12px rgba(163, 177, 198, 0.6)',
      color: '#1E293B',
    },
    miniPreviewWrapStyle: {
      background: '#E0E5EC',
      borderWidth: '0px',
      borderColor: 'transparent',
      boxShadow:
        'inset -4px -4px 8px rgba(255, 255, 255, 0.85), inset 4px 4px 8px rgba(163, 177, 198, 0.6)',
    },
    miniTabStyle: {
      background: '#E0E5EC',
      color: '#1E293B',
      borderWidth: '0px',
      borderColor: 'transparent',
      boxShadow:
        '-3px -3px 6px rgba(255, 255, 255, 0.85), 3px 3px 6px rgba(163, 177, 198, 0.55)',
    },
    miniBtnStyle: {
      background: '#4F46E5',
      color: '#FFFFFF',
      boxShadow:
        '-3px -3px 8px rgba(255, 255, 255, 0.82), 4px 4px 10px rgba(79, 70, 229, 0.35)',
    },
    badgeColorClass: 'bg-[#E0E5EC] text-[#3730A3] border-0',
  },
  {
    id: 'flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Giao Diện Phẳng Mềm',
    familyLabelEn: 'Modern Matte Flat Soft',
    mechanism: 'light',
    counterpartMode: 'dark-flat-soft-ui',
    cardClassName: 'card-flat-soft-ui',
    name: 'Giao Diện Phẳng Sáng',
    label: 'Giao Diện Phẳng Sáng',
    shortBadge: 'Giao Diện Phẳng Sáng',
    tagLabel: 'Bề mặt phẳng · 14 Sắc màu · Sáng',
    modeLabel: 'Giao Diện Phẳng Sáng',
    isDark: false,
    icon: 'layout',
    color: '#4F46E5',
    desc: 'Bề mặt sứ mờ siêu phẳng tinh khiết (#FFFFFF), viền mảnh mềm mại phối nhấn 14 sắc màu Thư ngỏ và bóng đổ khuếch tán dịu êm.',
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
      background: 'linear-gradient(135deg, #4F46E5 0%, #7E22CE 55%, #DB2777 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white text-[#4F46E5] border-slate-200 shadow-sm',
  },
  {
    id: 'dark-flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Giao Diện Phẳng Mềm',
    familyLabelEn: 'Modern Matte Flat Soft',
    mechanism: 'dark',
    counterpartMode: 'flat-soft-ui',
    cardClassName: 'card-dark-flat-soft-ui',
    name: 'Giao Diện Phẳng Tối',
    label: 'Giao Diện Phẳng Tối',
    shortBadge: 'Giao Diện Phẳng Tối',
    tagLabel: 'Bề mặt phẳng · 14 Sắc màu · Tối',
    modeLabel: 'Giao Diện Phẳng Tối',
    isDark: true,
    icon: 'moon',
    color: '#818CF8',
    desc: 'Mặt tối nhung êm dịu (#131B2A) không gây chói mắt, viền mảnh phối 14 sắc màu Thư ngỏ nổi bật và độ tương phản chữ sắc nét.',
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
      background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 55%, #F472B6 100%)',
      color: '#0A0E17',
    },
    badgeColorClass: 'bg-[#161F30] text-[#A5B4FC] border-slate-700/60 shadow-sm',
  },
  {
    id: 'color-flat-soft-ui',
    familyId: 'flat-soft-ui',
    familyLabel: 'Giao Diện Phẳng Mềm',
    familyLabelEn: 'Modern Matte Flat Soft',
    mechanism: 'color',
    counterpartMode: 'flat-soft-ui',
    cardClassName: 'card-color-flat-soft-ui',
    name: 'Giao Diện Phẳng Màu',
    label: 'Giao Diện Phẳng Màu',
    shortBadge: 'Giao Diện Phẳng Màu',
    tagLabel: 'Phẳng màu · 20 Mã màu Studio & 12 Module',
    modeLabel: 'Giao Diện Phẳng Màu',
    isDark: true,
    icon: 'palette',
    color: '#8B5CF6',
    desc: 'Giao diện phẳng màu xây dựng từ nền tối #090D16, thẻ #111827, sub-card phủ #0000004D kết hợp 4 sắc Studio (Violet, Indigo, Cyan, Emerald) và 12 mã màu module SDP → POS.',
    cardSampleStyle: {
      background: '#111827',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: '14px',
      border: '1px solid rgba(139, 92, 246, 0.36)',
      boxShadow:
        '0 8px 24px -4px rgba(9, 13, 22, 0.56), inset 0 1px 0 rgba(244, 247, 251, 0.08)',
      color: '#F4F7FB',
    },
    miniPreviewWrapStyle: {
      background: '#090D16',
      borderColor: 'rgba(139, 92, 246, 0.36)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(0, 0, 0, 0.30)',
      color: '#F4F7FB',
      borderColor: 'rgba(93, 195, 200, 0.35)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #4F46E5 52%, #06B6D4 100%)',
      color: '#F4F7FB',
    },
    badgeColorClass: 'bg-[#111827] text-[#FFDF25] border-[#8B5CF6]/45 shadow-sm',
  },
  {
    id: 'flat-ui',
    familyId: 'flat-ui',
    familyLabel: 'Flat UI',
    familyLabelEn: 'Pure Flat Design System',
    mechanism: 'light',
    counterpartMode: 'flat-ui',
    cardClassName: 'card-flat-ui',
    name: 'Flat UI',
    label: 'Flat UI',
    shortBadge: 'Flat UI',
    tagLabel: 'Flat Design thuần · Không bóng đổ · Outfit',
    modeLabel: 'Flat UI',
    isDark: false,
    icon: 'layout',
    color: '#3B82F6',
    desc: 'Thiết kế phẳng tuyệt đối: không box-shadow, không blur, không gradient trên thẻ/nút — sử dụng khối màu đặc (#FFFFFF, #F3F4F6, #3B82F6, #10B981, #F59E0B), bo góc hình học 6–8px và phản hồi phóng nhẹ 200ms.',
    cardSampleStyle: {
      background: '#FFFFFF',
      borderRadius: '8px',
      border: '0px solid transparent',
      boxShadow: 'none',
      color: '#111827',
    },
    miniPreviewWrapStyle: {
      background: '#F3F4F6',
      borderColor: 'transparent',
      borderWidth: '0px',
    },
    miniTabStyle: {
      background: '#EFF6FF',
      color: '#111827',
      borderColor: 'transparent',
    },
    miniBtnStyle: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#EFF6FF] text-[#2563EB] border-0',
  },
  {
    id: 'nexus-bento',
    familyId: 'nexus-bento',
    familyLabel: 'Nexus Bento',
    familyLabelEn: 'Nexus Bento UI',
    mechanism: 'dark',
    counterpartMode: 'light-nexus-bento',
    cardClassName: 'card-nexus-bento',
    name: 'Nexus Bento Tối',
    label: 'Nexus Bento Tối',
    shortBadge: 'Nexus Bento',
    tagLabel: 'Dark mặc định · #090D16 Lưới chấm bi · Play',
    modeLabel: 'Nexus Bento Tối',
    isDark: true,
    icon: 'grid',
    color: '#8B5CF6',
    desc: 'Bento Dashboard chuẩn Dark Mode (#090D16 + lưới chấm 24px + 3 quầng sáng #8B5CF6 · #38BDF8 · #EC4899), thanh điều hướng kính mờ #111827 bo 18px, thẻ Bento bo 12px đổ bóng 3D nâng -6px & phóng 1.012x khi hover.',
    cardSampleStyle: {
      background: 'rgba(17, 24, 39, 0.90)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.10)',
      boxShadow:
        '0 18px 40px -12px rgba(0, 0, 0, 0.72), 0 0 24px -6px rgba(139, 92, 246, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      color: '#F8FAFC',
    },
    miniPreviewWrapStyle: {
      background:
        'radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px) 0 0 / 10px 10px, radial-gradient(circle at 18% 20%, rgba(139, 92, 246, 0.35), transparent 55%), radial-gradient(circle at 85% 24%, rgba(56, 189, 248, 0.28), transparent 55%), radial-gradient(circle at 68% 88%, rgba(236, 72, 153, 0.25), transparent 55%), #090D16',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(17, 24, 39, 0.88)',
      color: '#F8FAFC',
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #38BDF8 58%, #EC4899 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-[#111827] text-[#38BDF8] border-white/15 shadow-sm',
  },
  {
    id: 'light-nexus-bento',
    familyId: 'nexus-bento',
    familyLabel: 'Nexus Bento',
    familyLabelEn: 'Nexus Bento UI',
    mechanism: 'light',
    counterpartMode: 'nexus-bento',
    cardClassName: 'card-light-nexus-bento',
    name: 'Nexus Bento Sáng',
    label: 'Nexus Bento Sáng',
    shortBadge: 'Nexus Bento Sáng',
    tagLabel: 'Light Mode · #F4F7FB Lưới chấm bi · Play',
    modeLabel: 'Nexus Bento Sáng',
    isDark: false,
    icon: 'grid',
    color: '#7C3AED',
    desc: 'Chế độ sáng mượt mà của Nexus Bento trên nền #F4F7FB lưới chấm 24px cùng 3 quầng sáng dịu (#8B5CF6 · #38BDF8 · #EC4899), thẻ Bento trắng sắc nét bo 12px nâng -6px & phóng 1.012x khi hover.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderRadius: '12px',
      border: '1px solid rgba(15, 23, 42, 0.09)',
      boxShadow:
        '0 14px 30px -10px rgba(15, 23, 42, 0.14), 0 0 20px -6px rgba(124, 58, 237, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
      color: '#0F172A',
    },
    miniPreviewWrapStyle: {
      background:
        'radial-gradient(rgba(15, 23, 42, 0.12) 1px, transparent 1px) 0 0 / 10px 10px, radial-gradient(circle at 18% 20%, rgba(139, 92, 246, 0.18), transparent 55%), radial-gradient(circle at 85% 24%, rgba(56, 189, 248, 0.16), transparent 55%), radial-gradient(circle at 68% 88%, rgba(236, 72, 153, 0.14), transparent 55%), #F4F7FB',
      borderColor: 'rgba(15, 23, 42, 0.09)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.92)',
      color: '#0F172A',
      borderColor: 'rgba(15, 23, 42, 0.09)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #7C3AED 0%, #0284C7 62%, #EC4899 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-white text-[#7C3AED] border-slate-200 shadow-xs',
  },
  {
    id: 'mica-fluent',
    familyId: 'mica-fluent',
    familyLabel: 'Kính Mờ Phân Lớp',
    familyLabelEn: 'Modern Layered Mica Fluent',
    mechanism: 'light',
    counterpartMode: 'mica-fluent',
    cardClassName: 'card-mica-fluent',
    name: 'Kính Mờ Phân Lớp',
    label: 'Kính Mờ Phân Lớp',
    shortBadge: 'Kính Mờ Phân Lớp',
    tagLabel: 'Kính mờ phân lớp · 14 Sắc màu Thư ngỏ',
    modeLabel: 'Kính Mờ Phân Lớp',
    isDark: false,
    icon: 'layers',
    color: '#DB2777',
    desc: 'Lớp nền kính mờ phân lớp bán trong suốt kết hợp bảng 14 sắc màu phân tích từ Trang Thư Ngỏ (#7E22CE → #0D9488 → #DB2777), ánh sáng dịu và bề mặt tinh tế.',
    cardSampleStyle: {
      background: 'rgba(255, 255, 255, 0.30)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.38)',
      boxShadow: '0px 4px 7px 2px rgba(0, 0, 0, 0.09)',
      color: '#1c0708',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(255, 255, 255, 0.30)',
      borderColor: 'rgba(255, 255, 255, 0.48)',
      borderWidth: '1px',
    },
    miniTabStyle: {
      background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 52%, #7E22CE 100%)',
      color: '#FFFFFF',
      borderColor: 'rgba(255, 255, 255, 0.32)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #DB2777 0%, #7E22CE 52%, #4F46E5 100%)',
      color: '#FDFDFD',
    },
    badgeColorClass: 'bg-pink-50 text-[#DB2777] border-pink-300/45 shadow-xs',
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
    labelEn: 'Soft Optical Liquid Glass',
    description:
      'Giao diện kính lỏng quang học trong suốt có viền phản quang sáng mảnh, sắc độ thích ứng theo nền.',
    descriptionEn: 'Liquid Glass Soft UI: optical glass material with subtle specular rim highlights and adaptive tint.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['liquid-glass'],
    dark: CARD_STYLES_MAP['dark-liquid-glass'],
  },
  'glassmorphism': {
    familyId: 'glassmorphism',
    label: 'Glassmorphism',
    labelEn: 'Glassmorphism',
    description:
      'Glassmorphism: bề mặt kính mờ bán trong suốt (blur 16px, rgba(255,255,255,0.12)) cho mọi thẻ nội dung, viền trắng 1px, chiều sâu nổi rộng và lớp bảo vệ độ tương phản chữ.',
    descriptionEn:
      'Glassmorphism: semi-transparent frosted panels (blur 16px, rgba(255,255,255,0.12)) across all content cards, thin 1px white edge borders, vivid backdrop bleed-through, soft wide shadows, and accessible fallbacks.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['glassmorphism'],
    dark: CARD_STYLES_MAP['glassmorphism'],
    color: CARD_STYLES_MAP['glassmorphism'],
  },
  'cowhide-leather': {
    familyId: 'cowhide-leather',
    label: 'Da Bò Thủ Công',
    labelEn: 'Classic Handcrafted Cowhide Leather',
    description: 'Da Bò Cổ Điển màu nâu chỉ kem khâu tay thủ công sắc nét.',
    descriptionEn: 'Classic brown cowhide leather with cream hand-stitching.',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['cowhide-leather'],
    dark: CARD_STYLES_MAP['cowhide-leather'],
    color: CARD_STYLES_MAP['cowhide-leather'],
  },
  'walnut-wood': {
    familyId: 'walnut-wood',
    label: 'Vân Gỗ Óc Chó',
    labelEn: 'Inlaid American Walnut Wood',
    description: 'Vân gỗ óc chó sẫm thủ công với đường khảm đồng mảnh liền nét và điểm nhấn hổ phách.',
    descriptionEn: 'Handcrafted American walnut wood grain with solid hairline brass inlay and warm amber accents.',
    icon: 'briefcase',
    light: CARD_STYLES_MAP['walnut-wood'],
    dark: CARD_STYLES_MAP['walnut-wood'],
  },
  'deep-ocean': {
    familyId: 'deep-ocean',
    label: 'Đại Dương Sâu Thẳm',
    labelEn: 'Deep Abyssal Ocean Blue',
    description: 'Đại Dương Sâu Thẳm: giao diện xanh lam đại dương tối với chiều sâu kính trong trẻo.',
    descriptionEn: 'Deep Ocean Dark: abyssal navy glass surfaces with ocean cyan highlights.',
    icon: 'compass',
    light: CARD_STYLES_MAP['deep-ocean'],
    dark: CARD_STYLES_MAP['deep-ocean'],
  },
  'neumorphism-soft-ui': {
    familyId: 'neumorphism-soft-ui',
    label: 'Neumorphism Soft UI',
    labelEn: 'Neumorphism Soft UI',
    description:
      'Neumorphism Soft UI: bề mặt lì đồng nhất không viền (#E0E5EC), đùn nổi và lún chìm bằng cặp bóng kép mềm mại, bo góc rộng và sắc nhấn bão hòa.',
    descriptionEn:
      'Neumorphism Soft UI: uniform material-less matte surface (#E0E5EC), zero borders, generous rounded corners, dual soft shadows, inset states, and a single saturated primary accent.',
    icon: 'layers',
    light: CARD_STYLES_MAP['neumorphism-soft-ui'],
    dark: CARD_STYLES_MAP['neumorphism-soft-ui'],
  },
  'flat-soft-ui': {
    familyId: 'flat-soft-ui',
    label: 'Giao Diện Phẳng Mềm',
    labelEn: 'Modern Matte Flat Soft',
    description:
      'Giao Diện Phẳng Sáng & Tối: phong cách phẳng thanh lịch với độ nổi khối siêu mềm mại, bề mặt mịn màng tinh tế và chống mỏi mắt.',
    descriptionEn:
      'Flat Soft UI Light & Dark: elegant flat planes, whisper-soft elevation, pristine matte surfaces, high contrast, and zero glare.',
    icon: 'layout',
    light: CARD_STYLES_MAP['flat-soft-ui'],
    dark: CARD_STYLES_MAP['dark-flat-soft-ui'],
    color: CARD_STYLES_MAP['color-flat-soft-ui'],
  },
  'flat-ui': {
    familyId: 'flat-ui',
    label: 'Flat UI',
    labelEn: 'Pure Flat Design',
    description:
      'Flat Design thuần túy: không bóng đổ, không gradient, phân cấp bằng khối màu đậm rõ nét, hình học gọn và kiểu chữ Outfit.',
    descriptionEn:
      'Pure Flat Design: zero artificial depth, bold color blocking (#FFFFFF, #F3F4F6, #3B82F6, #10B981, #F59E0B), Outfit typography, and snappy scale hover.',
    icon: 'layout',
    light: CARD_STYLES_MAP['flat-ui'],
    dark: CARD_STYLES_MAP['flat-ui'],
  },
  'nexus-bento': {
    familyId: 'nexus-bento',
    label: 'Nexus Bento',
    labelEn: 'Nexus Bento UI',
    description:
      'Nexus Bento UI: phông Play (400/700), nền tối #090D16 lưới chấm 24px cùng 3 quầng sáng #8B5CF6 · #38BDF8 · #EC4899, thanh kính mờ #111827 bo 18px, thẻ Bento bo 12px nổi 3D và chế độ sáng #F4F7FB.',
    descriptionEn:
      'Nexus Bento UI: Play typography, #090D16 24px dot-grid dark canvas with 3 radial halos (#8B5CF6, #38BDF8, #EC4899), frosted #111827 18px nav chrome, 12px 3D BentoCards (-6px/1.012x hover), and smooth #F4F7FB Light Mode.',
    icon: 'grid',
    light: CARD_STYLES_MAP['light-nexus-bento'],
    dark: CARD_STYLES_MAP['nexus-bento'],
  },
  'mica-fluent': {
    familyId: 'mica-fluent',
    label: 'Kính Mờ Phân Lớp',
    labelEn: 'Modern Layered Mica Fluent',
    description:
      'Lớp nền bán trong suốt, ánh sáng dịu, phân cấp cửa sổ và bề mặt tinh tế theo phong cách Windows hiện đại.',
    descriptionEn:
      'Mica / Fluent Design: translucent layered material, soft ambient illumination, refined window hierarchy, and subtle modern Windows surfaces.',
    icon: 'layers',
    light: CARD_STYLES_MAP['mica-fluent'],
    dark: CARD_STYLES_MAP['mica-fluent'],
    color: CARD_STYLES_MAP['mica-fluent'],
  },
  'frost-ice-neu': {
    familyId: 'frost-ice-neu',
    label: 'Băng Tuyết Nổi Khối',
    labelEn: 'Frost Ice Matte Soft',
    description: 'Băng tuyết nổi khối mềm mại.',
    descriptionEn: 'Frost Ice Matte Soft.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['frost-ice-neu'],
    dark: CARD_STYLES_MAP['frost-ice-neu'],
  },
  'iridescent-liquid-glass': {
    familyId: 'iridescent-liquid-glass',
    label: 'Kính Xà Cừ Sáng',
    labelEn: 'Light Iridescent Liquid Glass',
    description: 'Kính xà cừ quang học phát sáng.',
    descriptionEn: 'Light Iridescent Liquid Glass.',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['iridescent-liquid-glass'],
    dark: CARD_STYLES_MAP['dark-iridescent-liquid-glass'],
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
  'gradient-dopamine': 'color-flat-soft-ui',
  'frost-ice-neu': 'flat-soft-ui',
  'dark-frost-ice-neu': 'dark-flat-soft-ui',
  'iridescent-liquid-glass': 'liquid-glass',
  'dark-iridescent-liquid-glass': 'dark-liquid-glass',
  'soft-indigo-fintech': 'flat-soft-ui',
  'dark-soft-indigo-fintech': 'dark-liquid-glass',
  'light-cowhide-leather': 'liquid-glass',
  'ice-blue-neu': 'liquid-glass',
  'dark-ice-blue-neu': 'dark-liquid-glass',
  'glass-flat': 'liquid-glass',
  'rainbow-glass': 'liquid-glass',
  'dark-rainbow-glass': 'dark-liquid-glass',
  'special-rainbow-glass': 'dark-liquid-glass',
  'black-cowhide-leather': 'cowhide-leather',
  'dark-cowhide-leather': 'cowhide-leather',
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
