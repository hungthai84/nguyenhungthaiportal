import React from 'react';
import { CardStyleMode, CardStyleConfig } from './theme.types';

import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const VALID_CARD_STYLES: CardStyleMode[] = [
  'frosted-glass',
  'mica-fluent',
  'dark-frosted-glass',
  'cowhide-leather',
];

export const CARD_STYLES_MAP: Record<CardStyleMode, CardStyleConfig> = {
  'frosted-glass': {
    id: 'frosted-glass',
    name: 'Flat UI Thẻ Đa Màu Sắc',
    label: 'Flat UI Thẻ Card Nền Đa Màu Sắc (Flat Multicolor Cards UI)',
    shortBadge: 'Flat · Đa Màu Sắc',
    tagLabel: 'Flat UI Thẻ Đa Màu Sắc · Sống Động',
    modeLabel: 'Flat UI Thẻ Đa Màu Sắc',
    isDark: false,
    icon: 'palette',
    color: '#3B82F6',
    desc: 'Giao diện Flat UI hiện đại với các thẻ card nền đa màu sắc rực rỡ (xanh dương, oải hương, xanh ngọc, vàng ấm, hồng phấn) trực quan và không mờ kính.',
    cardSampleStyle: {
      background: '#F8FAFC',
      border: '1.5px solid #CBD5E1',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
    },
    badgeColorClass: 'bg-blue-500/10 text-blue-800 border-blue-300/60',
  },
  'mica-fluent': {
    id: 'mica-fluent',
    name: 'Chất liệu mica sáng',
    label: 'Chất liệu mica sáng (Windows 11 Light Mode Mica Surface)',
    shortBadge: 'Fluent Mica · Sáng',
    tagLabel: 'Chất liệu mica sáng · Windows 11',
    modeLabel: 'Fluent Mica Sáng',
    isDark: false,
    icon: 'layers',
    color: '#0067C0',
    desc: 'Chất liệu Mica nền sáng chuẩn Windows 11 (rgba(243, 243, 243, 0.86)), lấy mẫu màu nền dịu nhẹ, chữ đen tương phản cao, blur(36px) saturate(125%).',
    cardSampleStyle: {
      background: 'rgba(243, 243, 243, 0.86)',
      backdropFilter: 'blur(36px) saturate(125%)',
      WebkitBackdropFilter: 'blur(36px) saturate(125%)',
      border: '1px solid rgba(255, 255, 255, 0.92)',
      boxShadow:
        '0 8px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(243, 243, 243, 0.92)',
      borderColor: 'rgba(255, 255, 255, 0.95)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.90)',
      color: '#0F172A',
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    miniBtnStyle: {
      background: '#0067C0',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-blue-600/10 text-blue-900 border-blue-400/50',
  },
  'dark-frosted-glass': {
    id: 'dark-frosted-glass',
    name: 'Kính mờ tối',
    label: 'Kính mờ tối (Dark Frosted Glass)',
    shortBadge: 'Kính Mờ Tối',
    tagLabel: 'Kính mờ tối · Specular Glass',
    modeLabel: 'Kính mờ tối',
    isDark: true,
    icon: 'moon',
    color: '#38BDF8',
    desc: 'Lớp kính mờ tối sâu thẳm (rgba(15, 23, 42, 0.68)) kết hợp blur(22px) saturate(150%), viền sáng cạnh trên tinh tế và độ tương phản chữ #f8fafc tối ưu trên mọi hình nền.',
    cardSampleStyle: {
      background: 'rgba(15, 23, 42, 0.68)',
      backdropFilter: 'blur(22px) saturate(150%)',
      WebkitBackdropFilter: 'blur(22px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      boxShadow:
        '0 22px 48px -12px rgba(2, 6, 23, 0.72), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
      color: '#f8fafc',
    },
    miniPreviewWrapStyle: {
      background: 'rgba(15, 23, 42, 0.78)',
      borderColor: 'rgba(255, 255, 255, 0.16)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.18)',
    },
    miniTabStyle: {
      background: 'rgba(30, 41, 59, 0.85)',
      color: '#f8fafc',
      borderColor: 'rgba(255, 255, 255, 0.18)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-slate-800/85 text-slate-100 border-white/25',
  },
  'cowhide-leather': {
    id: 'cowhide-leather',
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
      color: '#FFF8DC',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(145deg, #7A4A20 0%, #522E10 100%)',
      borderColor: 'rgba(245, 222, 179, 0.48)',
      borderStyle: 'dashed',
    },
    miniTabStyle: {
      background: 'rgba(82, 46, 16, 0.88)',
      color: '#FFF8DC',
      borderColor: 'rgba(245, 222, 179, 0.45)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
      color: '#FFF8DC',
    },
    badgeColorClass: 'bg-[#522E10]/90 text-[#FFF8DC] border-[#F5DEB3]/50',
  },
};

export const CARD_STYLE_PRESETS_LIST: CardStyleConfig[] = VALID_CARD_STYLES.map(id => CARD_STYLES_MAP[id]);

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
    raw === 'multicolor-glass' ||
    raw === 'glass' ||
    raw === 'mica' ||
    raw === 'glass-flat' ||
    raw === 'fluent-mica' ||
    raw === 'liquid-glass'
  ) {
    return DEFAULT_CARD_STYLE;
  }
  if (
    raw === 'pastel' ||
    raw === 'bento-pastel' ||
    raw === 'soft-pastel' ||
    raw === 'pastel-bento' ||
    raw === 'glossy-glass' ||
    raw === 'glossy' ||
    raw === 'guong-bong' ||
    raw === 'glass-glossy'
  ) {
    return DEFAULT_CARD_STYLE;
  }
  if (
    raw === 'dark-glass' ||
    raw === 'dark-glassmorphism' ||
    raw === 'dark-frosted' ||
    raw === 'kinh-mo-toi'
  ) {
    return 'dark-frosted-glass';
  }
  if (VALID_CARD_STYLES.includes(raw as any)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
}

