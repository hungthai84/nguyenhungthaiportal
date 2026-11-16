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
  'light-glassmorphism': { cardOpacity: 72, blurIntensity: 22 },
  'dark-frosted-glass': { cardOpacity: 68, blurIntensity: 22 },
  'dark-glassmorphism': { cardOpacity: 68, blurIntensity: 22 },
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
      'radial-gradient(circle at 16% 16%, rgba(96, 165, 250, 0.28) 0%, transparent 52%), radial-gradient(circle at 84% 20%, rgba(167, 139, 250, 0.26) 0%, transparent 52%), radial-gradient(circle at 72% 86%, rgba(244, 114, 182, 0.22) 0%, transparent 54%), linear-gradient(135deg, #eef4ff 0%, #f1effe 45%, #f9eef9 100%)',
    overlayBg: 'rgba(248, 250, 252, 0.04)',
  },
  'mica-fluent': {
    id: 'mica-fluent',
    presetId: 'theme-bg-mica-fluent',
    label: 'Nền Mica Ánh Mây Sáng (Windows 11)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/mica-fluent/mica-fluent-light.webp',
    fallbackGradient:
      'radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.24) 0%, transparent 52%), radial-gradient(circle at 82% 24%, rgba(165, 180, 252, 0.24) 0%, transparent 52%), radial-gradient(circle at 60% 86%, rgba(244, 114, 182, 0.16) 0%, transparent 54%), linear-gradient(145deg, #f2f6fd 0%, #eef1fc 52%, #f7f1fa 100%)',
    overlayBg: 'rgba(243, 243, 243, 0.05)',
  },
  'light-glassmorphism': {
    id: 'light-glassmorphism',
    presetId: 'theme-bg-light-glassmorphism',
    label: 'Nền Gương Sáng Pha Lê (Light Frosted Glass)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 14%, rgba(56, 189, 248, 0.30) 0%, transparent 52%), radial-gradient(circle at 84% 18%, rgba(129, 140, 248, 0.28) 0%, transparent 52%), radial-gradient(circle at 74% 86%, rgba(244, 114, 182, 0.22) 0%, transparent 54%), radial-gradient(circle at 20% 82%, rgba(34, 211, 238, 0.22) 0%, transparent 52%), linear-gradient(135deg, #eaf2ff 0%, #eff1ff 38%, #f7effd 70%, #e7f6ff 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.06)',
  },
  'dark-frosted-glass': {
    id: 'dark-frosted-glass',
    presetId: 'theme-bg-dark-frosted-glass',
    label: 'Nền Đêm Sapphire Kính Mờ (Dark Glass)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/dark-frosted-glass/dark-frosted-dark.webp',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(14, 165, 233, 0.28) 0%, transparent 52%), radial-gradient(circle at 84% 22%, rgba(99, 102, 241, 0.28) 0%, transparent 52%), radial-gradient(circle at 68% 84%, rgba(192, 132, 252, 0.22) 0%, transparent 54%), linear-gradient(145deg, #070d1f 0%, #0f1735 50%, #171338 100%)',
    overlayBg: 'rgba(2, 6, 23, 0.10)',
  },
  'dark-glassmorphism': {
    id: 'dark-glassmorphism',
    presetId: 'theme-bg-dark-glassmorphism',
    label: 'Nền Gương Tối Sâu Thẳm (Dark Glassmorphism)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(14, 165, 233, 0.30) 0%, transparent 52%), radial-gradient(circle at 84% 22%, rgba(99, 102, 241, 0.30) 0%, transparent 52%), radial-gradient(circle at 68% 84%, rgba(192, 132, 252, 0.24) 0%, transparent 54%), linear-gradient(145deg, #020617 0%, #0f172a 50%, #082f49 100%)',
    overlayBg: 'rgba(2, 6, 23, 0.12)',
  },
  'cowhide-leather': {
    id: 'cowhide-leather',
    presetId: 'theme-bg-cowhide-leather',
    label: 'Nền Da Bò Thủ Công Ấm Áp (Full-Grain Leather)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/cowhide-leather/cowhide-leather-dark.webp',
    fallbackGradient:
      'radial-gradient(circle at 20% 18%, rgba(217, 119, 6, 0.30) 0%, transparent 54%), radial-gradient(circle at 82% 24%, rgba(180, 115, 58, 0.28) 0%, transparent 54%), radial-gradient(circle at 65% 84%, rgba(154, 52, 18, 0.24) 0%, transparent 56%), linear-gradient(145deg, #351b0b 0%, #241206 50%, #44230e 100%)',
    overlayBg: 'rgba(28, 14, 5, 0.08)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'frosted-glass': THEME_BACKGROUNDS['frosted-glass'].presetId,
  'mica-fluent': THEME_BACKGROUNDS['mica-fluent'].presetId,
  'light-glassmorphism': THEME_BACKGROUNDS['light-glassmorphism'].presetId,
  'dark-frosted-glass': THEME_BACKGROUNDS['dark-frosted-glass'].presetId,
  'dark-glassmorphism': THEME_BACKGROUNDS['dark-glassmorphism'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
};
