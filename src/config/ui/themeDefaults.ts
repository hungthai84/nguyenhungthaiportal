import { CardStyleMode } from './theme.types';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'frosted-glass';

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const GLASS_CUSTOMIZATION_STORAGE_KEY = 'hungthai_glass_customization_v1';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
export const GLASS_CUSTOMIZATION_SYNC_EVENT = 'hungthai:glass-customization-changed';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'frosted-glass': { cardOpacity: 100, blurIntensity: 0 },
  'mica-fluent': { cardOpacity: 86, blurIntensity: 36 },
  'dark-frosted-glass': { cardOpacity: 68, blurIntensity: 22 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
};

export interface ThemeBackgroundSpec {
  id: CardStyleMode;
  presetId: string;
  label: string;
  themeMode: 'light' | 'dark';
  imagePath: string;
  fallbackGradient: string;
  overlayBg: string;
}

export const THEME_BACKGROUNDS: Record<CardStyleMode, ThemeBackgroundSpec> = {
  'frosted-glass': {
    id: 'frosted-glass',
    presetId: 'theme-bg-frosted-glass',
    label: 'Nền Ánh Sáng Đa Sắc (Flat UI)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/frosted-glass/frosted-glass-light.webp',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(59, 130, 246, 0.22) 0%, transparent 48%), radial-gradient(circle at 82% 24%, rgba(167, 139, 250, 0.22) 0%, transparent 48%), radial-gradient(circle at 52% 86%, rgba(45, 212, 191, 0.18) 0%, transparent 52%), linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 50%, #eef2ff 100%)',
    overlayBg: 'rgba(241, 245, 249, 0.14)',
  },
  'mica-fluent': {
    id: 'mica-fluent',
    presetId: 'theme-bg-mica-fluent',
    label: 'Nền Mica Ánh Mây Sáng (Windows 11)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/mica-fluent/mica-fluent-light.webp',
    fallbackGradient:
      'radial-gradient(circle at 22% 20%, rgba(0, 103, 192, 0.18) 0%, transparent 50%), radial-gradient(circle at 78% 78%, rgba(56, 189, 248, 0.16) 0%, transparent 52%), linear-gradient(145deg, #f3f6fb 0%, #e6eef8 55%, #f3f3f3 100%)',
    overlayBg: 'rgba(243, 243, 243, 0.16)',
  },
  'dark-frosted-glass': {
    id: 'dark-frosted-glass',
    presetId: 'theme-bg-dark-frosted-glass',
    label: 'Nền Đêm Sapphire Kính Mờ (Dark Glass)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/dark-frosted-glass/dark-frosted-dark.webp',
    fallbackGradient:
      'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.28) 0%, transparent 50%), radial-gradient(circle at 82% 76%, rgba(99, 102, 241, 0.26) 0%, transparent 52%), linear-gradient(145deg, #020617 0%, #0f172a 55%, #082f49 100%)',
    overlayBg: 'rgba(2, 6, 23, 0.24)',
  },
  'cowhide-leather': {
    id: 'cowhide-leather',
    presetId: 'theme-bg-cowhide-leather',
    label: 'Nền Da Bò Thủ Công Ấm Áp (Full-Grain Leather)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/cowhide-leather/cowhide-leather-dark.webp',
    fallbackGradient:
      'radial-gradient(circle at 22% 20%, rgba(180, 115, 58, 0.34) 0%, transparent 52%), radial-gradient(circle at 80% 78%, rgba(139, 90, 43, 0.30) 0%, transparent 54%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%)',
    overlayBg: 'rgba(28, 14, 5, 0.24)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'frosted-glass': THEME_BACKGROUNDS['frosted-glass'].presetId,
  'mica-fluent': THEME_BACKGROUNDS['mica-fluent'].presetId,
  'dark-frosted-glass': THEME_BACKGROUNDS['dark-frosted-glass'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
};
