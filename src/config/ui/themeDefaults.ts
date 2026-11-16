import { CardStyleMode } from './theme.types';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'light-glassmorphism';

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
  'light-glassmorphism': { cardOpacity: 72, blurIntensity: 22 },
  'dark-glassmorphism': { cardOpacity: 68, blurIntensity: 22 },
  'ice-blue-neumorphism': { cardOpacity: 100, blurIntensity: 0 },
  'dark-ice-blue-neumorphism': { cardOpacity: 100, blurIntensity: 0 },
  'pastel-lilac-soft': { cardOpacity: 100, blurIntensity: 14 },
  'dark-pastel-lilac-soft': { cardOpacity: 100, blurIntensity: 14 },
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
  'light-glassmorphism': {
    id: 'light-glassmorphism',
    presetId: 'theme-bg-light-glassmorphism',
    label: 'Nền Gương Sáng Pha Lê (Light Frosted Glass)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/light-glassmorphism/light-glassmorphism-light.jpg',
    fallbackGradient:
      'radial-gradient(circle at 14% 14%, rgba(56, 189, 248, 0.30) 0%, transparent 52%), radial-gradient(circle at 84% 18%, rgba(129, 140, 248, 0.28) 0%, transparent 52%), radial-gradient(circle at 74% 86%, rgba(244, 114, 182, 0.22) 0%, transparent 54%), radial-gradient(circle at 20% 82%, rgba(34, 211, 238, 0.22) 0%, transparent 52%), linear-gradient(135deg, #eaf2ff 0%, #eff1ff 38%, #f7effd 70%, #e7f6ff 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.06)',
  },
  'dark-glassmorphism': {
    id: 'dark-glassmorphism',
    presetId: 'theme-bg-dark-glassmorphism',
    label: 'Nền Gương Tối Sâu Thẳm (Dark Glassmorphism)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/dark-glassmorphism/dark-glassmorphism-dark.jpg',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(14, 165, 233, 0.30) 0%, transparent 52%), radial-gradient(circle at 84% 22%, rgba(99, 102, 241, 0.30) 0%, transparent 52%), radial-gradient(circle at 68% 84%, rgba(192, 132, 252, 0.24) 0%, transparent 54%), linear-gradient(145deg, #020617 0%, #0f172a 50%, #082f49 100%)',
    overlayBg: 'rgba(2, 6, 23, 0.12)',
  },
  'ice-blue-neumorphism': {
    id: 'ice-blue-neumorphism',
    presetId: 'theme-bg-ice-blue-neumorphism',
    label: 'Nền Xanh Băng Soft UI (Ice-Blue Neumorphism)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/ice-blue-neumorphism/ice-blue-neumorphism-light.jpg',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.20) 0%, transparent 52%), radial-gradient(circle at 84% 20%, rgba(168, 85, 247, 0.14) 0%, transparent 52%), radial-gradient(circle at 70% 84%, rgba(244, 114, 182, 0.14) 0%, transparent 54%), linear-gradient(145deg, #e6f0f8 0%, #edf4fa 50%, #e1ecf6 100%)',
    overlayBg: 'rgba(230, 240, 248, 0.10)',
  },
  'dark-ice-blue-neumorphism': {
    id: 'dark-ice-blue-neumorphism',
    presetId: 'theme-bg-dark-ice-blue-neumorphism',
    label: 'Nền Neumorphism Xanh Băng Tối (#152030)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 12%, rgba(34, 211, 238, 0.16) 0%, transparent 54%), radial-gradient(circle at 86% 18%, rgba(168, 85, 247, 0.14) 0%, transparent 54%), radial-gradient(circle at 72% 86%, rgba(244, 114, 182, 0.12) 0%, transparent 54%), linear-gradient(145deg, #152030 0%, #182536 50%, #121c29 100%)',
    overlayBg: 'rgba(21, 32, 48, 0.10)',
  },
  'pastel-lilac-soft': {
    id: 'pastel-lilac-soft',
    presetId: 'theme-bg-pastel-lilac-soft',
    label: 'Nền Kem Tím Oải Hương Phấn (Pastel Lilac Soft UI)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 14%, rgba(171, 162, 252, 0.24) 0%, transparent 56%), radial-gradient(circle at 86% 18%, rgba(253, 186, 116, 0.22) 0%, transparent 54%), radial-gradient(circle at 72% 84%, rgba(244, 114, 182, 0.14) 0%, transparent 56%), linear-gradient(165deg, #ffffff 0%, #f8f7fc 55%, #f1effa 100%)',
    overlayBg: 'rgba(248, 247, 252, 0.06)',
  },
  'dark-pastel-lilac-soft': {
    id: 'dark-pastel-lilac-soft',
    presetId: 'theme-bg-dark-pastel-lilac-soft',
    label: 'Nền Pastel Soft UI Tối (Velvet Twilight Lilac)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 14%, rgba(167, 139, 250, 0.24) 0%, transparent 56%), radial-gradient(circle at 86% 18%, rgba(251, 146, 60, 0.16) 0%, transparent 54%), radial-gradient(circle at 72% 84%, rgba(244, 114, 182, 0.14) 0%, transparent 56%), linear-gradient(165deg, #1b1730 0%, #151226 55%, #110e1f 100%)',
    overlayBg: 'rgba(17, 14, 31, 0.12)',
  },
  'light-cowhide-leather': {
    id: 'light-cowhide-leather',
    presetId: 'theme-bg-light-cowhide-leather',
    label: 'Nền Da Bò Sáng Thủ Công (Light Saddle Tan Leather)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(217, 119, 6, 0.18) 0%, transparent 54%), radial-gradient(circle at 84% 22%, rgba(180, 115, 58, 0.16) 0%, transparent 54%), radial-gradient(circle at 68% 84%, rgba(245, 158, 11, 0.14) 0%, transparent 56%), linear-gradient(145deg, #fbf4e8 0%, #f4e6d0 52%, #ead5b5 100%)',
    overlayBg: 'rgba(250, 243, 232, 0.08)',
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
  'light-glassmorphism': THEME_BACKGROUNDS['light-glassmorphism'].presetId,
  'dark-glassmorphism': THEME_BACKGROUNDS['dark-glassmorphism'].presetId,
  'ice-blue-neumorphism': THEME_BACKGROUNDS['ice-blue-neumorphism'].presetId,
  'dark-ice-blue-neumorphism': THEME_BACKGROUNDS['dark-ice-blue-neumorphism'].presetId,
  'pastel-lilac-soft': THEME_BACKGROUNDS['pastel-lilac-soft'].presetId,
  'dark-pastel-lilac-soft': THEME_BACKGROUNDS['dark-pastel-lilac-soft'].presetId,
  'light-cowhide-leather': THEME_BACKGROUNDS['light-cowhide-leather'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
};
