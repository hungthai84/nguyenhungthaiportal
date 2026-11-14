import React from 'react';
import { CardStyleMode, CardStyleConfig } from './theme.types';

import { DEFAULT_CARD_STYLE } from './themeDefaults';

export const VALID_CARD_STYLES: CardStyleMode[] = [
  'frosted-glass',
  'glassmorphism',
  'mica-fluent',
  'glassmorphism-neon',
];

export const CARD_STYLES_MAP: Record<CardStyleMode, CardStyleConfig> = {
  'frosted-glass': {
    id: 'frosted-glass',
    name: 'Giao diện Chuẩn',
    label: 'Giao diện Chuẩn (Giao diện sáng)',
    shortBadge: 'Chuẩn · Sáng',
    tagLabel: 'Giao diện Chuẩn · Sáng',
    modeLabel: 'Giao diện sáng',
    isDark: false,
    icon: 'sparkles',
    color: '#4338CA',
    desc: 'Giao diện sáng với bề mặt thẻ trắng tinh khiết hiện đại, viền sắc nét và đổ bóng mượt mà.',
    cardSampleStyle: {
      backgroundColor: '#FFFFFF',
    },
    badgeColorClass: 'bg-indigo-500/10 text-indigo-800 border-indigo-300/60',
  },
  'glassmorphism': {
    id: 'glassmorphism',
    name: 'Kính sáng đa sắc',
    label: 'Kính sáng đa sắc (Giao diện sáng)',
    shortBadge: 'Kính · Đa sắc',
    tagLabel: 'Kính sáng đa sắc · Đa sắc',
    modeLabel: 'Kính sáng đa sắc',
    isDark: false,
    icon: 'layers',
    color: '#6D28D9',
    desc: 'Giao diện sáng kính mờ sáng trong trẻo blur(22px) hòa quyện các dải màu pastel đa sắc rạng rỡ cùng viền ánh sáng cầu vồng mềm mại.',
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
    name: 'Fluent Mica (Màu Sáng)',
    label: 'Fluent Mica (Màu Sáng) - Windows 11 Light Mode Mica Surface',
    shortBadge: 'Fluent Mica · Sáng',
    tagLabel: 'Fluent Mica (Màu Sáng) · Windows 11',
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
  'glassmorphism-neon': {
    id: 'glassmorphism-neon',
    name: 'Kính tối neon đa sắc',
    label: 'Kính tối neon đa sắc (Glassmorphism Tối Neon Đa Sắc)',
    shortBadge: 'Kính Neon Đa Sắc',
    tagLabel: 'Kính tối neon đa sắc · RGB Neon Aura',
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
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
}

