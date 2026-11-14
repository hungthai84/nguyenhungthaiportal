import { CardStyleMode } from './theme.types';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'glassmorphism';

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'frosted-glass': 'custom-wp-1788112774646',      // Hình nền #32
  'glassmorphism': 'custom-wp-1788245365255',      // Hình nền #51
  'mica-fluent': 'custom-wp-1788351856323',        // Hình nền #65
  'pastel-bento': 'css-pastel-bento-soft',         // Hình nền Pastel Bento Dịu Nhẹ
  'glassmorphism-neon': 'custom-wp-1790261424372', // Hình nền #88
  'cowhide-leather': 'css-cowhide-leather-craft',  // Hình nền Da nâu bò thủ công #82
};
