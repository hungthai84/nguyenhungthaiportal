import { CardStyleMode, ThemeMechanismMode } from './theme.types';
import rainbowGlassWallpaper from '@/assets/images/wallpaper_rainbow_glass_1795175771284.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import lightDeepOceanWallpaper from '@/assets/images/light_deep_ocean_wallpaper_1795344399317.jpg';
import neumorphismBeyondWallpaper from '@/assets/images/neumorphism_beyond_wallpaper_1795201986751.jpg';
import darkNeumorphismBeyondWallpaper from '@/assets/images/dark_neumorphism_beyond_wallpaper_1795344399348.jpg';
import multicolorGlassWallpaper from '@/assets/images/multicolor_glass_wallpaper_1795250561824.jpg';
import darkNeonGlassWallpaper from '@/assets/images/dark_neon_multicolor_bg_1794884146586.jpg';
import blackCowhideLeatherWallpaper from '@/assets/images/black_cowhide_leather_bg_1795346191975.jpg';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'neumorphism-beyond';
export const DEFAULT_LAYER_DEPTH = 100;

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style_v2';
export const COLOR_SCHEME_MODE_STORAGE_KEY = 'hungthai_color_scheme_mode_v1';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const GLASS_CUSTOMIZATION_STORAGE_KEY = 'hungthai_glass_customization_v1';
export const WALLPAPER_OVERLAY_STORAGE_KEY = 'hungthai_wallpaper_overlay_v1';
export const ADAPTIVE_ACCENT_STORAGE_KEY = 'hungthai_adaptive_accent_v1';
export const SURFACE_DEPTH_STORAGE_KEY = 'hungthai_surface_depth_v1';
export const LAYER_DEPTH_STORAGE_KEY = 'hungthai_layer_depth_v1';
export const AUTO_TIME_THEME_STORAGE_KEY = 'hungthai_auto_time_theme_v1';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const COLOR_SCHEME_MODE_SYNC_EVENT = 'hungthai:color-scheme-mode-changed';
export const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
export const GLASS_CUSTOMIZATION_SYNC_EVENT = 'hungthai:glass-customization-changed';
export const WALLPAPER_OVERLAY_SYNC_EVENT = 'hungthai:wallpaper-overlay-changed';
export const ADAPTIVE_ACCENT_SYNC_EVENT = 'hungthai:adaptive-accent-changed';
export const SURFACE_DEPTH_SYNC_EVENT = 'hungthai:surface-depth-changed';
export const LAYER_DEPTH_SYNC_EVENT = 'hungthai:layer-depth-changed';
export const AUTO_TIME_THEME_SYNC_EVENT = 'hungthai:auto-time-theme-changed';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'dark-liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'multicolor-glass': { cardOpacity: 92, blurIntensity: 22 },
  'dark-neon-glass': { cardOpacity: 58, blurIntensity: 24 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'black-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'deep-ocean': { cardOpacity: 84, blurIntensity: 20 },
  'light-deep-ocean': { cardOpacity: 84, blurIntensity: 22 },
  'neumorphism-beyond': { cardOpacity: 91, blurIntensity: 14 },
  'dark-neumorphism-beyond': { cardOpacity: 92, blurIntensity: 14 },
  'frost-ice-neu': { cardOpacity: 93, blurIntensity: 14 },
  'dark-frost-ice-neu': { cardOpacity: 93, blurIntensity: 14 },
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
  'black-cowhide-leather': {
    id: 'black-cowhide-leather',
    presetId: 'theme-bg-black-cowhide-leather',
    label: 'Nền Da Bò Đen Chỉ Trắng',
    themeMode: 'dark',
    imagePath: blackCowhideLeatherWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.08) 0%, transparent 52%), radial-gradient(circle at 82% 24%, rgba(148, 163, 184, 0.09) 0%, transparent 54%), linear-gradient(145deg, #16181E 0%, #0B0C10 52%, #14171D 100%)',
    overlayBg: 'rgba(10, 11, 15, 0.10)',
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
  'light-deep-ocean': {
    id: 'light-deep-ocean',
    presetId: 'theme-bg-light-deep-ocean',
    label: 'Nền Đại Dương Sâu Thẳm Sáng',
    themeMode: 'light',
    imagePath: lightDeepOceanWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 20% 18%, rgba(6, 182, 212, 0.20) 0%, transparent 48%), radial-gradient(circle at 82% 82%, rgba(56, 189, 248, 0.22) 0%, transparent 52%), linear-gradient(155deg, #F2FBFF 0%, #E3F4FD 52%, #D4EEFC 100%)',
    overlayBg: 'rgba(240, 250, 255, 0.12)',
  },
  'neumorphism-beyond': {
    id: 'neumorphism-beyond',
    presetId: 'custom-wp-1788112774646',
    label: 'Hình nền #32',
    themeMode: 'light',
    imagePath: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    fallbackGradient: 'linear-gradient(145deg, #EAEFF6 0%, #E6ECF4 55%, #DFE6F0 100%)',
    overlayBg: 'transparent',
  },
  'dark-neumorphism-beyond': {
    id: 'dark-neumorphism-beyond',
    presetId: 'theme-bg-dark-neumorphism-beyond',
    label: 'Nền Nổi Khối Kính Mờ Tối',
    themeMode: 'dark',
    imagePath: darkNeumorphismBeyondWallpaper,
    fallbackGradient: 'linear-gradient(145deg, #171E2B 0%, #141A25 55%, #111620 100%)',
    overlayBg: 'rgba(15, 20, 30, 0.18)',
  },
  'frost-ice-neu': {
    id: 'frost-ice-neu',
    presetId: 'theme-bg-frost-ice-neu',
    label: 'Nền Băng Tuyết Nổi Khối (Sáng)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.92) 0%, transparent 48%), radial-gradient(circle at 86% 24%, rgba(168, 212, 248, 0.50) 0%, transparent 54%), radial-gradient(circle at 50% 88%, rgba(186, 218, 245, 0.45) 0%, transparent 56%), linear-gradient(145deg, #EDF6FD 0%, #E4F0FB 52%, #D4E6F7 100%)',
    overlayBg: 'rgba(232, 243, 252, 0.12)',
  },
  'dark-frost-ice-neu': {
    id: 'dark-frost-ice-neu',
    presetId: 'theme-bg-dark-frost-ice-neu',
    label: 'Nền Băng Tuyết Nổi Khối (Tối)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 18% 14%, rgba(110, 106, 246, 0.16) 0%, transparent 46%), radial-gradient(circle at 84% 22%, rgba(74, 184, 249, 0.14) 0%, transparent 50%), radial-gradient(circle at 74% 84%, rgba(255, 112, 161, 0.10) 0%, transparent 52%), linear-gradient(145deg, #162235 0%, #101928 52%, #0C1320 100%)',
    overlayBg: 'rgba(12, 19, 32, 0.22)',
  },
  'multicolor-glass': {
    id: 'multicolor-glass',
    presetId: 'theme-bg-multicolor-glass',
    label: 'Nền Glass UI Đa Sắc Hiện Đại',
    themeMode: 'color',
    imagePath: multicolorGlassWallpaper,
    fallbackGradient:
      'radial-gradient(at 14% 16%, rgba(56, 189, 248, 0.34) 0px, transparent 50%), radial-gradient(at 86% 16%, rgba(192, 132, 252, 0.32) 0px, transparent 48%), radial-gradient(at 78% 84%, rgba(251, 146, 60, 0.24) 0px, transparent 52%), radial-gradient(at 20% 82%, rgba(52, 211, 153, 0.28) 0px, transparent 50%), linear-gradient(135deg, #edf6ff 0%, #f4eeff 50%, #fff0f7 100%)',
    overlayBg: 'rgba(244, 247, 255, 0.08)',
  },
  'dark-neon-glass': {
    id: 'dark-neon-glass',
    presetId: 'theme-bg-dark-neon-glass',
    label: 'Nền Glass UI Neon Tối',
    themeMode: 'dark',
    imagePath: darkNeonGlassWallpaper,
    fallbackGradient:
      'radial-gradient(at 16% 18%, rgba(34, 211, 238, 0.24) 0px, transparent 50%), radial-gradient(at 84% 18%, rgba(217, 70, 239, 0.22) 0px, transparent 48%), radial-gradient(at 78% 84%, rgba(99, 102, 241, 0.20) 0px, transparent 52%), linear-gradient(145deg, #050814 0%, #090e24 50%, #0d0822 100%)',
    overlayBg: 'rgba(5, 8, 20, 0.20)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'liquid-glass': THEME_BACKGROUNDS['liquid-glass'].presetId,
  'dark-liquid-glass': THEME_BACKGROUNDS['dark-liquid-glass'].presetId,
  'multicolor-glass': THEME_BACKGROUNDS['multicolor-glass'].presetId,
  'dark-neon-glass': THEME_BACKGROUNDS['dark-neon-glass'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'black-cowhide-leather': THEME_BACKGROUNDS['black-cowhide-leather'].presetId,
  'deep-ocean': THEME_BACKGROUNDS['deep-ocean'].presetId,
  'light-deep-ocean': THEME_BACKGROUNDS['light-deep-ocean'].presetId,
  'neumorphism-beyond': 'custom-wp-1788112774646',
  'dark-neumorphism-beyond': THEME_BACKGROUNDS['dark-neumorphism-beyond'].presetId,
  'frost-ice-neu': THEME_BACKGROUNDS['frost-ice-neu'].presetId,
  'dark-frost-ice-neu': THEME_BACKGROUNDS['dark-frost-ice-neu'].presetId,
};
