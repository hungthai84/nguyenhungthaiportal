import { CardStyleMode, FontScaleMode, ThemeMechanismMode } from './theme.types';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'ice-blue-neu';
export const DEFAULT_LAYER_DEPTH = 100;
export const DEFAULT_FONT_SCALE: FontScaleMode = 'normal';

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const GLASS_CUSTOMIZATION_STORAGE_KEY = 'hungthai_glass_customization_v1';
export const SURFACE_DEPTH_STORAGE_KEY = 'hungthai_surface_depth_v1';
export const LAYER_DEPTH_STORAGE_KEY = 'hungthai_layer_depth_v1';
export const FONT_SCALE_STORAGE_KEY = 'hungthai_font_scale_v1';
export const AUTO_TIME_THEME_STORAGE_KEY = 'hungthai_auto_time_theme_v1';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
export const GLASS_CUSTOMIZATION_SYNC_EVENT = 'hungthai:glass-customization-changed';
export const SURFACE_DEPTH_SYNC_EVENT = 'hungthai:surface-depth-changed';
export const LAYER_DEPTH_SYNC_EVENT = 'hungthai:layer-depth-changed';
export const FONT_SCALE_SYNC_EVENT = 'hungthai:font-scale-changed';
export const AUTO_TIME_THEME_SYNC_EVENT = 'hungthai:auto-time-theme-changed';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'light-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'black-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'ice-blue-neu': { cardOpacity: 96, blurIntensity: 18 },
  'dark-ice-blue-neu': { cardOpacity: 96, blurIntensity: 18 },
};

export interface ThemeBackgroundSpec {
  id: CardStyleMode;
  presetId: string;
  label: string;
  themeMode: ThemeMechanismMode;
  imagePath: string;
  fallbackGradient: string;
  overlayBg: string;
}

export const THEME_BACKGROUNDS: Record<CardStyleMode, ThemeBackgroundSpec> = {
  'light-cowhide-leather': {
    id: 'light-cowhide-leather',
    presetId: 'theme-bg-light-cowhide-leather',
    label: 'Nền Chất liệu da (màu trắng)',
    themeMode: 'light',
    imagePath: '/backgrounds/themes/light-cowhide-leather/light-cowhide-leather-light.jpg',
    fallbackGradient:
      'radial-gradient(circle at 18% 16%, rgba(148, 163, 184, 0.20) 0%, transparent 52%), radial-gradient(circle at 82% 20%, rgba(203, 213, 225, 0.24) 0%, transparent 54%), radial-gradient(circle at 68% 84%, rgba(100, 116, 139, 0.14) 0%, transparent 56%), linear-gradient(145deg, #ffffff 0%, #f8fafc 52%, #edf2f7 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.06)',
  },
  'black-cowhide-leather': {
    id: 'black-cowhide-leather',
    presetId: 'theme-bg-black-cowhide-leather',
    label: 'Nền Chất liệu da (màu đen)',
    themeMode: 'dark',
    imagePath: '/backgrounds/themes/black-cowhide-leather/black-cowhide-leather-dark.jpg',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(148, 163, 184, 0.14) 0%, transparent 52%), radial-gradient(circle at 82% 24%, rgba(56, 189, 248, 0.10) 0%, transparent 54%), radial-gradient(circle at 65% 84%, rgba(100, 116, 139, 0.14) 0%, transparent 56%), linear-gradient(145deg, #090a0e 0%, #14171f 52%, #0d0f14 100%)',
    overlayBg: 'rgba(6, 7, 10, 0.14)',
  },
  'cowhide-leather': {
    id: 'cowhide-leather',
    presetId: 'theme-bg-cowhide-leather',
    label: 'Nền Chất liệu da (màu nâu)',
    themeMode: 'color',
    imagePath: '/backgrounds/themes/cowhide-leather/cowhide-leather-dark.jpg',
    fallbackGradient:
      'radial-gradient(circle at 20% 18%, rgba(217, 119, 6, 0.30) 0%, transparent 54%), radial-gradient(circle at 82% 24%, rgba(180, 115, 58, 0.28) 0%, transparent 54%), radial-gradient(circle at 65% 84%, rgba(154, 52, 18, 0.24) 0%, transparent 56%), linear-gradient(145deg, #351b0b 0%, #241206 50%, #44230e 100%)',
    overlayBg: 'rgba(28, 14, 5, 0.08)',
  },
  'ice-blue-neu': {
    id: 'ice-blue-neu',
    presetId: 'theme-bg-ice-blue-neu',
    label: 'Nền Xanh băng nhạt (#e6f0f8)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(56, 189, 248, 0.16) 0%, transparent 50%), radial-gradient(circle at 86% 18%, rgba(129, 140, 248, 0.14) 0%, transparent 52%), radial-gradient(circle at 78% 84%, rgba(244, 114, 182, 0.12) 0%, transparent 52%), linear-gradient(145deg, #edf4fa 0%, #e6f0f8 52%, #dfeaf5 100%)',
    overlayBg: 'rgba(230, 240, 248, 0.08)',
  },
  'dark-ice-blue-neu': {
    id: 'dark-ice-blue-neu',
    presetId: 'theme-bg-dark-ice-blue-neu',
    label: 'Nền Xanh băng thẫm (#152030)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(56, 189, 248, 0.14) 0%, transparent 50%), radial-gradient(circle at 86% 18%, rgba(168, 85, 247, 0.12) 0%, transparent 52%), radial-gradient(circle at 78% 84%, rgba(236, 72, 153, 0.10) 0%, transparent 52%), linear-gradient(145deg, #182536 0%, #152030 52%, #0f1723 100%)',
    overlayBg: 'rgba(15, 23, 35, 0.14)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'light-cowhide-leather': THEME_BACKGROUNDS['light-cowhide-leather'].presetId,
  'black-cowhide-leather': THEME_BACKGROUNDS['black-cowhide-leather'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'ice-blue-neu': THEME_BACKGROUNDS['ice-blue-neu'].presetId,
  'dark-ice-blue-neu': THEME_BACKGROUNDS['dark-ice-blue-neu'].presetId,
};
