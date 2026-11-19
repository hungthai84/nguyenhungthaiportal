import { CardStyleMode, FontScaleMode, ThemeMechanismMode } from './theme.types';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'soft-indigo-fintech';
export const DEFAULT_LAYER_DEPTH = 100;
export const DEFAULT_FONT_SCALE: FontScaleMode = 'normal';

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style_v2';
export const COLOR_SCHEME_MODE_STORAGE_KEY = 'hungthai_color_scheme_mode_v1';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const GLASS_CUSTOMIZATION_STORAGE_KEY = 'hungthai_glass_customization_v1';
export const SURFACE_DEPTH_STORAGE_KEY = 'hungthai_surface_depth_v1';
export const LAYER_DEPTH_STORAGE_KEY = 'hungthai_layer_depth_v1';
export const FONT_SCALE_STORAGE_KEY = 'hungthai_font_scale_v1';
export const AUTO_TIME_THEME_STORAGE_KEY = 'hungthai_auto_time_theme_v1';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const COLOR_SCHEME_MODE_SYNC_EVENT = 'hungthai:color-scheme-mode-changed';
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
  'soft-indigo-fintech': { cardOpacity: 98, blurIntensity: 18 },
  'dark-soft-indigo-fintech': { cardOpacity: 96, blurIntensity: 18 },
  'light-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'black-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'ice-blue-neu': { cardOpacity: 96, blurIntensity: 18 },
  'dark-ice-blue-neu': { cardOpacity: 96, blurIntensity: 18 },
  'glass-flat': { cardOpacity: 94, blurIntensity: 12 },
  'rainbow-glass': { cardOpacity: 22, blurIntensity: 24 },
  'dark-rainbow-glass': { cardOpacity: 56, blurIntensity: 24 },
  'special-rainbow-glass': { cardOpacity: 56, blurIntensity: 24 },
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
  'soft-indigo-fintech': {
    id: 'soft-indigo-fintech',
    presetId: 'theme-bg-soft-indigo-fintech',
    label: 'Nền Soft Indigo FinTech (#EEF0FA)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(108, 76, 230, 0.14) 0%, transparent 48%), radial-gradient(circle at 86% 18%, rgba(56, 189, 248, 0.14) 0%, transparent 50%), radial-gradient(circle at 76% 84%, rgba(163, 230, 53, 0.10) 0%, transparent 50%), linear-gradient(145deg, #EEF0FA 0%, #E5E9F8 52%, #DCE0F5 100%)',
    overlayBg: 'rgba(238, 240, 250, 0.08)',
  },
  'dark-soft-indigo-fintech': {
    id: 'dark-soft-indigo-fintech',
    presetId: 'theme-bg-dark-soft-indigo-fintech',
    label: 'Nền Soft Indigo FinTech (Tối #0E1225)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(108, 76, 230, 0.24) 0%, transparent 48%), radial-gradient(circle at 86% 18%, rgba(56, 189, 248, 0.16) 0%, transparent 50%), radial-gradient(circle at 76% 84%, rgba(163, 230, 53, 0.10) 0%, transparent 50%), linear-gradient(145deg, #0E1225 0%, #151A33 52%, #11162B 100%)',
    overlayBg: 'rgba(14, 18, 37, 0.20)',
  },
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
    label: 'Nền Gương đa sắc (Sáng)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 12% 14%, rgba(243, 185, 167, 0.56) 0%, transparent 48%), radial-gradient(circle at 86% 16%, rgba(169, 223, 222, 0.52) 0%, transparent 48%), radial-gradient(circle at 48% 42%, rgba(190, 176, 235, 0.44) 0%, transparent 54%), radial-gradient(circle at 18% 84%, rgba(232, 187, 216, 0.48) 0%, transparent 50%), radial-gradient(circle at 84% 82%, rgba(184, 208, 242, 0.52) 0%, transparent 52%), linear-gradient(135deg, #FFF0E8 0%, #F7E8F2 26%, #EEE9FA 52%, #E6F0FC 76%, #E0F5F3 90%, #FDFDFF 100%)',
    overlayBg: 'rgba(253, 253, 255, 0.14)',
  },
  'dark-rainbow-glass': {
    id: 'dark-rainbow-glass',
    presetId: 'theme-bg-dark-rainbow-glass',
    label: 'Nền Gương đa sắc (Tối)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(185, 130, 131, 0.22) 0%, transparent 46%), radial-gradient(circle at 84% 18%, rgba(78, 158, 170, 0.24) 0%, transparent 48%), radial-gradient(circle at 50% 48%, rgba(142, 128, 189, 0.22) 0%, transparent 54%), radial-gradient(circle at 20% 84%, rgba(120, 154, 203, 0.18) 0%, transparent 48%), radial-gradient(circle at 82% 84%, rgba(194, 183, 243, 0.16) 0%, transparent 48%), linear-gradient(140deg, #101A2B 0%, #171F33 38%, #202238 70%, #153039 100%)',
    overlayBg: 'rgba(16, 26, 43, 0.22)',
  },
  'special-rainbow-glass': {
    id: 'special-rainbow-glass',
    presetId: 'theme-bg-special-rainbow-glass',
    label: 'Nền Gương đa sắc (Đặc biệt Aurora)',
    themeMode: 'color',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 14% 18%, rgba(185, 130, 131, 0.28) 0%, transparent 48%), radial-gradient(circle at 86% 20%, rgba(78, 158, 170, 0.28) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(142, 128, 189, 0.26) 0%, transparent 54%), radial-gradient(circle at 50% 85%, rgba(194, 183, 243, 0.22) 0%, transparent 52%), linear-gradient(135deg, #171F33 0%, #202238 52%, #153039 100%)',
    overlayBg: 'rgba(23, 31, 51, 0.24)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'soft-indigo-fintech': THEME_BACKGROUNDS['soft-indigo-fintech'].presetId,
  'dark-soft-indigo-fintech': THEME_BACKGROUNDS['dark-soft-indigo-fintech'].presetId,
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
