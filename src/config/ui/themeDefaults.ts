import { CardStyleMode } from './theme.types';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'light-multicolor-glass';

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
  'light-multicolor-glass': { cardOpacity: 78, blurIntensity: 28 },
  'light-multicolor-glass-dark': { cardOpacity: 78, blurIntensity: 26 },
  'dark-neon-multicolor-glass': { cardOpacity: 80, blurIntensity: 24 },
  'dark-neon-multicolor-glass-light': { cardOpacity: 82, blurIntensity: 24 },
  'light-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
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
  'light-multicolor-glass': {
    id: 'light-multicolor-glass',
    presetId: 'theme-bg-light-multicolor-glass',
    label: 'Nền Gương đa sắc Sáng (Mica Prism)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/light-multicolor-glass/light-multicolor-glass-light.jpg',
    fallbackGradient:
      'radial-gradient(circle at 12% 14%, rgba(59, 184, 230, 0.34) 0%, transparent 50%), radial-gradient(circle at 88% 16%, rgba(221, 78, 158, 0.28) 0%, transparent 50%), radial-gradient(circle at 80% 84%, rgba(167, 139, 250, 0.26) 0%, transparent 52%), radial-gradient(circle at 16% 86%, rgba(80, 179, 71, 0.22) 0%, transparent 52%), radial-gradient(circle at 52% 48%, rgba(236, 125, 33, 0.16) 0%, transparent 58%), linear-gradient(135deg, #F0F6FF 0%, #F7EEFF 42%, #EEFDF8 76%, #FFF5EC 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.04)',
  },
  'light-multicolor-glass-dark': {
    id: 'light-multicolor-glass-dark',
    presetId: 'theme-bg-light-multicolor-glass-dark',
    label: 'Nền Gương đa sắc Tối (Twilight Prism)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/light-multicolor-glass-dark/light-multicolor-glass-dark.jpg',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(59, 184, 230, 0.24) 0%, transparent 50%), radial-gradient(circle at 86% 18%, rgba(221, 78, 158, 0.22) 0%, transparent 50%), radial-gradient(circle at 78% 84%, rgba(99, 83, 181, 0.24) 0%, transparent 52%), radial-gradient(circle at 18% 82%, rgba(80, 179, 71, 0.18) 0%, transparent 50%), linear-gradient(135deg, #090D1F 0%, #141230 48%, #0C1A2B 100%)',
    overlayBg: 'rgba(7, 11, 26, 0.12)',
  },
  'dark-neon-multicolor-glass': {
    id: 'dark-neon-multicolor-glass',
    presetId: 'theme-bg-dark-neon-multicolor-glass',
    label: 'Nền Glassmorphism Dark Neon Multicolor (Obsidian Prism)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/dark-neon-multicolor-glass/dark-neon-multicolor-glass-dark.jpg',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(0, 229, 255, 0.20) 0%, transparent 48%), radial-gradient(circle at 86% 18%, rgba(157, 78, 221, 0.22) 0%, transparent 50%), radial-gradient(circle at 78% 84%, rgba(255, 60, 172, 0.18) 0%, transparent 50%), radial-gradient(circle at 18% 82%, rgba(57, 255, 20, 0.12) 0%, transparent 48%), linear-gradient(145deg, #04060D 0%, #080D1B 50%, #090616 100%)',
    overlayBg: 'rgba(4, 6, 13, 0.14)',
  },
  'dark-neon-multicolor-glass-light': {
    id: 'dark-neon-multicolor-glass-light',
    presetId: 'theme-bg-dark-neon-multicolor-glass-light',
    label: 'Nền Glassmorphism Dark Neon Sáng (Ice Cyber Glass)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/dark-neon-multicolor-glass-light/dark-neon-multicolor-glass-light.jpg',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(14, 165, 233, 0.24) 0%, transparent 50%), radial-gradient(circle at 86% 18%, rgba(139, 92, 246, 0.22) 0%, transparent 50%), radial-gradient(circle at 78% 84%, rgba(236, 72, 153, 0.18) 0%, transparent 52%), radial-gradient(circle at 18% 82%, rgba(16, 185, 129, 0.16) 0%, transparent 50%), linear-gradient(135deg, #EDF4FF 0%, #F1EEFF 50%, #ECFAFF 100%)',
    overlayBg: 'rgba(241, 246, 255, 0.06)',
  },
  'light-cowhide-leather': {
    id: 'light-cowhide-leather',
    presetId: 'theme-bg-light-cowhide-leather',
    label: 'Nền Da Cá Sấu Trắng Thủ Công (White Crocodile Leather)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/light-cowhide-leather/light-cowhide-leather-light.jpg',
    fallbackGradient:
      'radial-gradient(circle at 18% 16%, rgba(148, 163, 184, 0.20) 0%, transparent 52%), radial-gradient(circle at 82% 20%, rgba(203, 213, 225, 0.24) 0%, transparent 54%), radial-gradient(circle at 68% 84%, rgba(100, 116, 139, 0.14) 0%, transparent 56%), linear-gradient(145deg, #ffffff 0%, #f8fafc 52%, #edf2f7 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.06)',
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
  'light-multicolor-glass': THEME_BACKGROUNDS['light-multicolor-glass'].presetId,
  'light-multicolor-glass-dark': THEME_BACKGROUNDS['light-multicolor-glass-dark'].presetId,
  'dark-neon-multicolor-glass': THEME_BACKGROUNDS['dark-neon-multicolor-glass'].presetId,
  'dark-neon-multicolor-glass-light': THEME_BACKGROUNDS['dark-neon-multicolor-glass-light'].presetId,
  'light-cowhide-leather': THEME_BACKGROUNDS['light-cowhide-leather'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
};
