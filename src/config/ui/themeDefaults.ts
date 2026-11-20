import { CardStyleMode, ThemeMechanismMode } from './theme.types';
import rainbowGlassWallpaper from '@/assets/images/wallpaper_rainbow_glass_1795175771284.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import micaFluentWallpaper from '@/assets/images/wallpaper_mica_fluent_1795175772748.jpg';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'liquid-glass';
export const DEFAULT_LAYER_DEPTH = 100;

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style_v2';
export const COLOR_SCHEME_MODE_STORAGE_KEY = 'hungthai_color_scheme_mode_v1';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const GLASS_CUSTOMIZATION_STORAGE_KEY = 'hungthai_glass_customization_v1';
export const SURFACE_DEPTH_STORAGE_KEY = 'hungthai_surface_depth_v1';
export const LAYER_DEPTH_STORAGE_KEY = 'hungthai_layer_depth_v1';
export const AUTO_TIME_THEME_STORAGE_KEY = 'hungthai_auto_time_theme_v1';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const COLOR_SCHEME_MODE_SYNC_EVENT = 'hungthai:color-scheme-mode-changed';
export const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
export const GLASS_CUSTOMIZATION_SYNC_EVENT = 'hungthai:glass-customization-changed';
export const SURFACE_DEPTH_SYNC_EVENT = 'hungthai:surface-depth-changed';
export const LAYER_DEPTH_SYNC_EVENT = 'hungthai:layer-depth-changed';
export const AUTO_TIME_THEME_SYNC_EVENT = 'hungthai:auto-time-theme-changed';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'liquid-glass': { cardOpacity: 64, blurIntensity: 24 },
  'dark-liquid-glass': { cardOpacity: 64, blurIntensity: 24 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'deep-ocean': { cardOpacity: 84, blurIntensity: 20 },
  'mica-fluent': { cardOpacity: 82, blurIntensity: 30 },
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
  'liquid-glass': {
    id: 'liquid-glass',
    presetId: 'theme-bg-liquid-glass',
    label: 'Nền Liquid Glass UI (Sáng)',
    themeMode: 'light',
    imagePath: rainbowGlassWallpaper,
    fallbackGradient:
      'radial-gradient(at 14% 16%, rgba(165, 180, 252, 0.34) 0px, transparent 52%), radial-gradient(at 86% 14%, rgba(125, 211, 252, 0.30) 0px, transparent 48%), radial-gradient(at 78% 84%, rgba(251, 207, 232, 0.28) 0px, transparent 52%), linear-gradient(135deg, #f3f6fd 0%, #e9eefb 50%, #edf2fc 100%)',
    overlayBg: 'rgba(243, 246, 253, 0.12)',
  },
  'dark-liquid-glass': {
    id: 'dark-liquid-glass',
    presetId: 'theme-bg-dark-liquid-glass',
    label: 'Nền Liquid Glass UI (Tối)',
    themeMode: 'dark',
    imagePath: darkRainbowGlassWallpaper,
    fallbackGradient:
      'radial-gradient(at 14% 16%, rgba(99, 102, 241, 0.24) 0px, transparent 52%), radial-gradient(at 86% 14%, rgba(56, 189, 248, 0.20) 0px, transparent 48%), radial-gradient(at 78% 84%, rgba(168, 85, 247, 0.16) 0px, transparent 52%), linear-gradient(140deg, #0b1221 0%, #111b31 52%, #0e172a 100%)',
    overlayBg: 'rgba(11, 18, 33, 0.18)',
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
  'deep-ocean': {
    id: 'deep-ocean',
    presetId: 'theme-bg-deep-ocean',
    label: 'Nền Đại Dương Sâu (#050B14)',
    themeMode: 'dark',
    imagePath: deepOceanWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.18) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), linear-gradient(145deg, #0A1128 0%, #050B14 50%, #030712 100%)',
    overlayBg: 'rgba(5, 11, 20, 0.22)',
  },
  'mica-fluent': {
    id: 'mica-fluent',
    presetId: 'theme-bg-mica-fluent',
    label: 'Nền Mica Fluent (Windows 11 Acrylic)',
    themeMode: 'light',
    imagePath: micaFluentWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 15% 15%, rgba(200, 215, 235, 0.45) 0%, transparent 50%), radial-gradient(circle at 85% 25%, rgba(220, 230, 245, 0.4) 0%, transparent 52%), radial-gradient(circle at 50% 85%, rgba(210, 220, 240, 0.35) 0%, transparent 54%), linear-gradient(135deg, #f3f6fa 0%, #e8edf5 52%, #dfe6f0 100%)',
    overlayBg: 'rgba(243, 246, 250, 0.12)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'liquid-glass': THEME_BACKGROUNDS['liquid-glass'].presetId,
  'dark-liquid-glass': THEME_BACKGROUNDS['dark-liquid-glass'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'deep-ocean': THEME_BACKGROUNDS['deep-ocean'].presetId,
  'mica-fluent': THEME_BACKGROUNDS['mica-fluent'].presetId,
};
