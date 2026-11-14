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
    name: 'Kính',
    label: 'Kính (Giao diện sáng)',
    shortBadge: 'Kính · Đa sắc',
    tagLabel: 'Kính · Đa sắc',
    modeLabel: 'Kính mờ đa sắc',
    isDark: false,
    icon: 'layers',
    color: '#6D28D9',
    desc: 'Giao diện sáng kính mờ đa màu sắc hiện đại, hiệu ứng Backdrop Blur 22px hòa quyện sắc xanh, tím, ngọc và hồng dịu mắt.',
    cardSampleStyle: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.76) 0%, rgba(238, 242, 255, 0.68) 36%, rgba(236, 254, 255, 0.66) 70%, rgba(253, 242, 248, 0.70) 100%)',
      backdropFilter: 'blur(22px) saturate(180%)',
      boxShadow:
        '0 12px 32px -6px rgba(99, 102, 241, 0.16), 0 6px 20px -4px rgba(14, 165, 233, 0.12)',
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
    name: 'Mica Fluent',
    label: 'Mica Fluent (Giao diện sáng)',
    shortBadge: 'Mica · Sáng',
    tagLabel: 'Mica Fluent · Sáng',
    modeLabel: 'Giao diện sáng',
    isDark: false,
    icon: 'layers',
    color: '#0E7490',
    desc: 'Giao diện sáng vật liệu Mica theo phong cách Microsoft Fluent, thanh thoát và có chiều sâu.',
    cardSampleStyle: {
      backgroundColor: 'rgba(248, 250, 252, 0.82)',
      backdropFilter: 'blur(24px)',
    },
    badgeColorClass: 'bg-blue-500/10 text-blue-800 border-blue-300/60',
  },
  'glassmorphism-neon': {
    id: 'glassmorphism-neon',
    name: 'Kính Tối Neon',
    label: 'Kính Tối Neon đa sắc',
    shortBadge: 'Kính Neon',
    tagLabel: 'Kính Tối Neon · Đa sắc',
    modeLabel: 'Kính Neon đa sắc',
    isDark: true,
    icon: 'zap',
    color: '#EC4899',
    desc: 'Giao diện tối kính mờ đa màu sắc Neon (Cyan, Hồng Magenta, Tím điện, Ngọc lục bảo) với viền phát sáng rực rỡ.',
    cardSampleStyle: {
      background:
        'linear-gradient(135deg, rgba(10, 16, 38, 0.86) 0%, rgba(28, 15, 54, 0.82) 52%, rgba(8, 30, 48, 0.86) 100%)',
      backdropFilter: 'blur(20px)',
      boxShadow:
        '0 10px 30px -6px rgba(6, 182, 212, 0.28), 0 0 24px -6px rgba(236, 72, 153, 0.25)',
    },
    miniPreviewWrapStyle: {
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 27, 75, 0.88))',
      borderColor: 'rgba(34, 211, 238, 0.45)',
    },
    miniTabStyle: {
      background: 'rgba(15, 23, 42, 0.9)',
      color: '#67E8F9',
      borderColor: 'rgba(34, 211, 238, 0.5)',
    },
    miniBtnStyle: {
      background: 'linear-gradient(90deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)',
      color: '#FFFFFF',
    },
    badgeColorClass: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/50',
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

