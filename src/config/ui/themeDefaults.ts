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
  'glass-flat': { cardOpacity: 94, blurIntensity: 12 },
  'rainbow-glass': { cardOpacity: 92, blurIntensity: 16 },
  'dark-rainbow-glass': { cardOpacity: 90, blurIntensity: 18 },
  'special-rainbow-glass': { cardOpacity: 94, blurIntensity: 16 },
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
  'glass-flat': {
    id: 'glass-flat',
    presetId: 'theme-bg-glass-flat',
    label: 'Nền Glass Flat UI đa màu sắc',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.18) 0%, transparent 52%), radial-gradient(circle at 85% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 54%), radial-gradient(circle at 70% 85%, rgba(99, 102, 241, 0.12) 0%, transparent 56%), linear-gradient(145deg, #f4f7fb 0%, #eef3fb 52%, #e2ecfb 100%)',
    overlayBg: 'rgba(240, 246, 255, 0.10)',
  },
  'rainbow-glass': {
    id: 'rainbow-glass',
    presetId: 'theme-bg-rainbow-glass',
    label: 'Nền Rainbow Glassmorphism (Sáng)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 10% 15%, rgba(244, 63, 94, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.14) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.10) 0%, transparent 50%), radial-gradient(circle at 80% 85%, rgba(245, 158, 11, 0.12) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 45%), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.12)',
  },
  'dark-rainbow-glass': {
    id: 'dark-rainbow-glass',
    presetId: 'theme-bg-dark-rainbow-glass',
    label: 'Nền Rainbow Glassmorphism (Tối)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 10% 15%, rgba(244, 63, 94, 0.18) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.18) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.16) 0%, transparent 50%), radial-gradient(circle at 80% 85%, rgba(245, 158, 11, 0.15) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.15) 0%, transparent 45%), linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
    overlayBg: 'rgba(15, 23, 42, 0.20)',
  },
  'special-rainbow-glass': {
    id: 'special-rainbow-glass',
    presetId: 'theme-bg-special-rainbow-glass',
    label: 'Nền Rainbow Glass Special (Aurora)',
    themeMode: 'color',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 12% 18%, rgba(236, 72, 153, 0.25) 0%, transparent 50%), radial-gradient(circle at 88% 22%, rgba(59, 130, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(16, 185, 129, 0.22) 0%, transparent 52%), radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.20) 0%, transparent 48%), linear-gradient(135deg, #fdf4ff 0%, #eff6ff 50%, #ecfdf5 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.15)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'light-cowhide-leather': THEME_BACKGROUNDS['light-cowhide-leather'].presetId,
  'black-cowhide-leather': THEME_BACKGROUNDS['black-cowhide-leather'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'ice-blue-neu': THEME_BACKGROUNDS['ice-blue-neu'].presetId,
  'dark-ice-blue-neu': THEME_BACKGROUNDS['dark-ice-blue-neu'].presetId,
  'glass-flat': THEME_BACKGROUNDS['glass-flat'].presetId,
  'rainbow-glass': THEME_BACKGROUNDS['rainbow-glass'].presetId,
  'dark-rainbow-glass': THEME_BACKGROUNDS['dark-rainbow-glass'].presetId,
  'special-rainbow-glass': THEME_BACKGROUNDS['special-rainbow-glass'].presetId,
};
