import React from 'react';
import { CardStyleMode, CardStyleConfig } from './theme.types';

import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const VALID_CARD_STYLES: CardStyleMode[] = [
  'frosted-glass',
  'glassmorphism',
  'mica-fluent',
  'pastel-bento',
  'glassmorphism-neon',
  'cowhide-leather',
  'glossy-glass',
];

export const CARD_STYLES_MAP: Record<CardStyleMode, CardStyleConfig> = {
  'frosted-glass': {
    id: 'frosted-glass',
    name: 'Kính Trắng Tinh Khiết',
    label: 'Kính Trắng Tinh Khiết (Nền sáng)',
    shortBadge: 'Chuẩn · Sáng',
    tagLabel: 'Kính Trắng Tinh Khiết · Sáng',
    modeLabel: 'Nền sáng chuẩn',
    isDark: false,
    icon: 'sparkles',
    color: '#4338CA',
    desc: 'Bề mặt thẻ trắng tinh khiết hiện đại, viền sắc nét và đổ bóng mượt mà.',
    cardSampleStyle: {
      backgroundColor: '#FFFFFF',
    },
    badgeColorClass: 'bg-indigo-500/10 text-indigo-800 border-indigo-300/60',
  },
  'glassmorphism': {
    id: 'glassmorphism',
    name: 'Kính sáng đa sắc',
    label: 'Kính sáng đa sắc (Nền sáng)',
    shortBadge: 'Kính · Đa sắc',
    tagLabel: 'Kính sáng đa sắc · Đa sắc',
    modeLabel: 'Kính sáng đa sắc',
    isDark: false,
    icon: 'layers',
    color: '#6D28D9',
    desc: 'Kính mờ sáng trong trẻo blur(22px) hòa quyện các dải màu pastel đa sắc rạng rỡ cùng viền ánh sáng cầu vồng mềm mại.',
    cardSampleStyle: {
      background: `
        radial-gradient(circle at 12% 15%, rgba(56, 189, 248, 0.28) 0%, transparent 48%),
        radial-gradient(circle at 88% 18%, rgba(244, 114, 182, 0.28) 0%, transparent 48%),
        radial-gradient(circle at 52% 90%, rgba(167, 139, 250, 0.26) 0%, transparent 52%),
        rgba(255, 255, 255, 0.74)
      `.trim(),
      backdropFilter: 'blur(22px) saturate(165%)',
      WebkitBackdropFilter: 'blur(22px) saturate(165%)',
      boxShadow:
        '0 18px 42px -10px rgba(99, 102, 241, 0.18), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(238, 242, 255, 0.85), rgba(236, 254, 255, 0.82), rgba(253, 242, 248, 0.85))',
      borderColor: 'rgba(255, 255, 255, 0.92)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.86)',
      color: '#312E81',
      borderColor: 'rgba(165, 180, 252, 0.65)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(90deg, #4F46E5 0%, #0EA5E9 52%, #EC4899 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-gradient-to-r from-indigo-500/15 via-cyan-500/15 to-pink-500/15 text-indigo-900 border-indigo-300/70',
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
  'pastel-bento': {
    id: 'pastel-bento',
    name: 'Bento Pastel Dịu Nhẹ',
    label: 'Bento Pastel Dịu Nhẹ (Soft Gradient Pastel Bento Box UI)',
    shortBadge: 'Pastel · Bento',
    tagLabel: 'Bento Pastel Dịu Nhẹ · Soft Gradient',
    modeLabel: 'Pastel Bento Dịu Nhẹ',
    isDark: false,
    icon: 'palette',
    color: '#6366F1',
    desc: 'Sự hòa quyện giữa bố cục Bento bo góc lớn và bảng màu pastel hồng phấn – oải hương – xanh thiên thanh (#fdf2f8 → #f5f3ff → #eff6ff), viền trắng 1.5px và chữ #1e1b4b chuẩn WCAG.',
    cardSampleStyle: {
      background: 'linear-gradient(155deg, #fdf2f8 0%, #f5f3ff 50%, #eff6ff 100%)',
      border: '1.5px solid #ffffff',
      boxShadow: '0 18px 36px -10px rgba(99, 102, 241, 0.16), inset 0 2px 4px #ffffff',
      color: '#1e1b4b',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(155deg, #fdf2f8 0%, #f5f3ff 50%, #eff6ff 100%)',
      borderColor: '#ffffff',
      boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.14), inset 0 1.5px 3px #ffffff',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.90)',
      color: '#1e1b4b',
      borderColor: '#ffffff',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 52%, #EC4899 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-gradient-to-r from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff] text-[#1e1b4b] border-white shadow-2xs',
  },
  'glassmorphism-neon': {
    id: 'glassmorphism-neon',
    name: 'Kính tối màu neon',
    label: 'Kính tối màu neon (Glassmorphism Tối Neon Đa Sắc)',
    shortBadge: 'Kính Neon Đa Sắc',
    tagLabel: 'Kính tối màu neon · RGB Neon Aura',
    modeLabel: 'Kính tối neon đa sắc',
    isDark: true,
    icon: 'zap',
    color: '#00F0FF',
    desc: 'Nền kính mờ tối sâu (blur(24px) saturate(190%)) hòa quyện hào quang đa cực Cyan, Magenta, Tím & Xanh Neon rực rỡ.',
    cardSampleStyle: {
      background: 'rgba(10, 13, 22, 0.78)',
      backdropFilter: 'blur(24px) saturate(190%)',
      WebkitBackdropFilter: 'blur(24px) saturate(190%)',
      boxShadow:
        '0 20px 50px rgba(0, 0, 0, 0.75), -6px -6px 24px rgba(0, 240, 255, 0.25), 6px -4px 24px rgba(255, 0, 127, 0.25)',
      border: '1px solid rgba(0, 240, 255, 0.3)',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(135deg, rgba(10, 13, 22, 0.95), rgba(20, 10, 35, 0.92))',
      borderColor: 'rgba(0, 240, 255, 0.55)',
    },
    miniTabStyle: {
      background: 'rgba(10, 13, 22, 0.9)',
      color: '#00F0FF',
      borderColor: 'rgba(0, 240, 255, 0.5)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(90deg, #00F0FF 0%, #A855F7 50%, #FF007F 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50',
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
  'glossy-glass': {
    id: 'glossy-glass',
    name: 'Gương bóng',
    label: 'Gương bóng (Glossy Glass – gloss-sheen • highlight)',
    shortBadge: 'Gương Bóng',
    tagLabel: 'Gương bóng · Glossy Glass',
    modeLabel: 'Gương bóng kính cao cấp',
    isDark: false,
    icon: 'sparkles',
    color: '#0284C7',
    desc: 'Bề mặt bóng loáng phản chiếu ánh sáng với dải highlight góc nghiêng -12°, viền sáng 1.5px và bóng đổ đa tầng kính cao cấp.',
    cardSampleStyle: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.22) 100%)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      border: '1.5px solid rgba(255, 255, 255, 0.55)',
      boxShadow:
        'rgba(0, 0, 0, 0.35) 0px 20px 45px, rgba(255, 255, 255, 0.85) 0px 2px 4px inset',
      position: 'relative',
      overflow: 'hidden',
    },
    miniPreviewWrapStyle: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.75)',
      boxShadow:
        '0 8px 24px -4px rgba(0, 0, 0, 0.25), inset 0 1.5px 3px rgba(255, 255, 255, 0.95)',
    },
    miniTabStyle: {
      background: 'rgba(255, 255, 255, 0.85)',
      color: '#0F172A',
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 55%, #4F46E5 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-sky-500/15 text-sky-900 border-sky-300/80 shadow-2xs',
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
    raw === 'pastel-bento'
  ) {
    return 'pastel-bento';
  }
  if (
    raw === 'glossy-glass' ||
    raw === 'glossy' ||
    raw === 'guong-bong' ||
    raw === 'glass-glossy'
  ) {
    return 'glossy-glass';
  }
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
}

