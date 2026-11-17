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
    id: 'glassmorphism',
    label: 'Kính mờ pha lê',
    labelEn: 'Glassmorphism',
    description: 'Bề mặt kính mờ xuyên thấu Sáng / Tối đồng bộ',
    descriptionEn: 'Translucent frosted glass in Light & Dark modes',
    icon: 'sparkles',
    lightMode: 'light-glassmorphism',
    darkMode: 'dark-glassmorphism',
  },
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
    id: 'ice-blue-neumorphism',
    label: 'Nổi khối xanh băng',
    labelEn: 'Ice-Blue Neumorphism',
    description: 'Bề mặt nổi khối dập nổi 3D & dải chỉ số phát sáng Sáng / Tối',
    descriptionEn: 'Ice-Blue soft-extruded surfaces & neon bars in Light & Dark modes',
    icon: 'layers',
  },
  {
    id: 'pastel-soft-ui',
    label: 'Tím phấn dịu nhẹ',
    labelEn: 'Pastel Soft UI',
    description: 'Thẻ tím oải hương phấn bo góc 14px đồng bộ Sáng / Tối',
    descriptionEn: '14px soft pastel lilac modular cards in Light & Dark modes',
    icon: 'palette',
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
    desc: 'Phong cách Ice-Blue Soft UI (#e6f0f8) bo góc 14px đổ bóng nổi/chìm kép mềm mại kết hợp các thanh tiến trình gradient Cyan, Tím, Cam đào & Hồng phát sáng chuẩn WCAG.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #edf4fa 0%, #e4eef7 100%)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.85)',
      boxShadow:
        '10px 10px 22px rgba(176, 198, 219, 0.65), -8px -8px 18px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.9)',
      color: '#000000',
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
    desc: 'Nền xanh băng thẫm (#152030) bo góc 14px dập nổi mềm mại với đổ bóng kép âm dương (#0a1018 / #203147), lõi chìm và các thanh chỉ số gradient neon phát sáng.',
    cardSampleStyle: {
      background: 'linear-gradient(145deg, #182536 0%, #121c29 100%)',
      borderRadius: '14px',
      border: '1px solid rgba(148, 197, 248, 0.14)',
      boxShadow:
        '10px 10px 22px #0a1018, -8px -8px 18px #203147, inset 1px 1px 2px rgba(186, 230, 253, 0.14)',
      color: '#FFFFFF',
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
    tagLabel: 'Pastel Soft UI Sáng · 14px Radius',
    modeLabel: 'Pastel Lilac Sáng',
    isDark: false,
    icon: 'palette',
    color: '#8B7EF8',
    desc: 'Nền trắng kem pha sắc tím oải hương (#f8f7fc / #f4f2fa), bo góc chuẩn 14px, module phân tầng nhẹ và điểm nhấn cam đào – tím pastel chuẩn WCAG (#000000).',
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
    tagLabel: 'Pastel Soft UI Tối · 14px Radius',
    modeLabel: 'Pastel Lilac Tối',
    isDark: true,
    icon: 'sparkles',
    color: '#A78BFA',
    desc: 'Nền tím than nhung mịn (#1e1a30), bo góc chuẩn 14px, module phân tầng #2a2442 và điểm nhấn tím oải hương – cam đào pastel dịu mắt chuẩn WCAG (#FFFFFF).',
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
  glassmorphism: {
    familyId: 'glassmorphism',
    label: 'Kính mờ pha lê',
    labelEn: 'Glassmorphism',
    description: 'Bề mặt kính mờ pha lê Sáng / Tối',
    descriptionEn: 'Translucent frosted glass in Light & Dark modes',
    icon: 'sparkles',
    light: CARD_STYLES_MAP['light-glassmorphism'],
    dark: CARD_STYLES_MAP['dark-glassmorphism'],
  },
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
  'ice-blue-neumorphism': {
    familyId: 'ice-blue-neumorphism',
    label: 'Nổi khối xanh băng',
    labelEn: 'Ice-Blue Neumorphism',
    description: 'Bề mặt xanh băng dập nổi 3D & phát sáng Sáng / Tối',
    descriptionEn: 'Ice-Blue soft-extruded surfaces & neon bars',
    icon: 'layers',
    light: CARD_STYLES_MAP['ice-blue-neumorphism'],
    dark: CARD_STYLES_MAP['dark-ice-blue-neumorphism'],
  },
  'pastel-soft-ui': {
    familyId: 'pastel-soft-ui',
    label: 'Tím phấn dịu nhẹ',
    labelEn: 'Pastel Soft UI',
    description: 'Thẻ tím oải hương phấn bo góc 14px Sáng / Tối',
    descriptionEn: '14px soft pastel lilac modular cards',
    icon: 'palette',
    light: CARD_STYLES_MAP['pastel-lilac-soft'],
    dark: CARD_STYLES_MAP['dark-pastel-lilac-soft'],
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
    raw === 'dark-neon-multicolor-glass-light' ||
    raw === 'dark-neon-light'
  ) {
    return 'dark-neon-multicolor-glass-light';
  }
  if (
    raw === 'dark-neon-multicolor-glass' ||
    raw === 'dark-neon-glass' ||
    raw === 'dark-neon' ||
    raw === 'neon-dark' ||
    raw === 'kinh-mo-toi-neon'
  ) {
    return 'dark-neon-multicolor-glass';
  }
  if (
    raw === 'light-multicolor-glass-dark' ||
    raw === 'light-multicolor-dark'
  ) {
    return 'light-multicolor-glass-dark';
  }
  if (
    raw === 'light-multicolor-glass' ||
    raw === 'multicolor-glass' ||
    raw === 'kinh-mo-da-sac' ||
    raw === 'kinh-mo-sang-da-sac' ||
    raw === 'light-mica-multicolor' ||
    raw === 'mica-multicolor'
  ) {
    return 'light-multicolor-glass';
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
    raw === 'da-ca-sau-trang' ||
    raw === 'white-crocodile' ||
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
