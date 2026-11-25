import { CardStyleMode, ThemeMechanismMode, WaveMotionMode } from './theme.types';
import wpLiquidGlass from '@/assets/images/wp_liquid_glass_1795447886339.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import wpLightDeepOcean from '@/assets/images/wp_light_deep_ocean_1795447885624.jpg';
import neumorphismBeyondWallpaper from '@/assets/images/neumorphism_beyond_wallpaper_1795201986751.jpg';
import darkNeumorphismBeyondWallpaper from '@/assets/images/dark_neumorphism_beyond_wallpaper_1795344399348.jpg';
import multicolorGlassWallpaper from '@/assets/images/multicolor_glass_wallpaper_1795250561824.jpg';
import darkNeonGlassWallpaper from '@/assets/images/dark_neon_multicolor_bg_1794884146586.jpg';
import blackCowhideLeatherWallpaper from '@/assets/images/walnut_wood_grain_bg_1795551578186.jpg';
import wpFlatSoftUi from '@/assets/images/wp_flat_soft_ui_1795447887016.jpg';
import wpDarkFlatSoftUi from '@/assets/images/wp_dark_flat_soft_ui_1795447886342.jpg';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'liquid-glass';
export const DEFAULT_LAYER_DEPTH = 100;
export const DEFAULT_CORNER_RADIUS = 14;
export const DEFAULT_WAVE_MOTION: WaveMotionMode = 'normal';
export const MIN_CORNER_RADIUS = 0;
export const MAX_CORNER_RADIUS = 28;

export type VisualThemeMode = 'neumorphism' | 'standard';

export const CARD_STYLE_STORAGE_KEY = 'hungthai_card_style_v2';
export const VISUAL_THEME_MODE_STORAGE_KEY = 'hungthai_visual_theme_mode_v1';
export const LAST_STANDARD_CARD_STYLE_STORAGE_KEY = 'hungthai_last_standard_style_v1';
export const COLOR_SCHEME_MODE_STORAGE_KEY = 'hungthai_color_scheme_mode_v1';
export const WALLPAPER_MANUAL_STORAGE_KEY = 'hungthai_wallpaper_manual_v2';
export const GLASS_CUSTOMIZATION_STORAGE_KEY = 'hungthai_glass_customization_v1';
export const WALLPAPER_OVERLAY_STORAGE_KEY = 'hungthai_wallpaper_overlay_v1';
export const ADAPTIVE_ACCENT_STORAGE_KEY = 'hungthai_adaptive_accent_v1';
export const SURFACE_DEPTH_STORAGE_KEY = 'hungthai_surface_depth_v1';
export const LAYER_DEPTH_STORAGE_KEY = 'hungthai_layer_depth_v1';
export const AUTO_TIME_THEME_STORAGE_KEY = 'hungthai_auto_time_theme_v1';
export const GLOBAL_CORNER_RADIUS_STORAGE_KEY = 'hungthai_global_corner_radius_v1';
export const WAVE_MOTION_STORAGE_KEY = 'hungthai_wave_motion_v1';
export const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';
export const COLOR_SCHEME_MODE_SYNC_EVENT = 'hungthai:color-scheme-mode-changed';
export const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
export const GLASS_CUSTOMIZATION_SYNC_EVENT = 'hungthai:glass-customization-changed';
export const WALLPAPER_OVERLAY_SYNC_EVENT = 'hungthai:wallpaper-overlay-changed';
export const ADAPTIVE_ACCENT_SYNC_EVENT = 'hungthai:adaptive-accent-changed';
export const SURFACE_DEPTH_SYNC_EVENT = 'hungthai:surface-depth-changed';
export const LAYER_DEPTH_SYNC_EVENT = 'hungthai:layer-depth-changed';
export const AUTO_TIME_THEME_SYNC_EVENT = 'hungthai:auto-time-theme-changed';
export const GLOBAL_CORNER_RADIUS_SYNC_EVENT = 'hungthai:global-corner-radius-changed';
export const WAVE_MOTION_SYNC_EVENT = 'hungthai:wave-motion-changed';

export const isNeumorphismCardStyle = (style: CardStyleMode): boolean =>
  style === 'frost-ice-neu' || style === 'dark-frost-ice-neu';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'dark-liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'multicolor-glass': { cardOpacity: 15, blurIntensity: 16 },
  'dark-neon-glass': { cardOpacity: 34, blurIntensity: 16 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'black-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'deep-ocean': { cardOpacity: 84, blurIntensity: 20 },
  'light-deep-ocean': { cardOpacity: 84, blurIntensity: 22 },
  'neumorphism-beyond': { cardOpacity: 91, blurIntensity: 14 },
  'dark-neumorphism-beyond': { cardOpacity: 92, blurIntensity: 14 },
  'frost-ice-neu': { cardOpacity: 100, blurIntensity: 0 },
  'dark-frost-ice-neu': { cardOpacity: 100, blurIntensity: 0 },
  'flat-soft-ui': { cardOpacity: 98, blurIntensity: 0 },
  'dark-flat-soft-ui': { cardOpacity: 96, blurIntensity: 0 },
  'mica-fluent': { cardOpacity: 30, blurIntensity: 20 },
  'gradient-dopamine': { cardOpacity: 82, blurIntensity: 18 },
  'dark-luxury': { cardOpacity: 94, blurIntensity: 16 },
  'minimalism': { cardOpacity: 100, blurIntensity: 0 },
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
    presetId: 'custom-wp-1788112774646',
    label: 'Hình nền #32 (Liquid Glass UI Sáng)',
    themeMode: 'light',
    imagePath: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    fallbackGradient:
      'radial-gradient(ellipse 68% 58% at 12% 14%, rgba(245, 221, 224, 0.90) 0px, transparent 58%), radial-gradient(ellipse 64% 56% at 88% 16%, rgba(169, 230, 231, 0.72) 0px, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 48%, rgba(207, 197, 233, 0.68) 0px, transparent 60%), radial-gradient(ellipse 66% 54% at 82% 86%, rgba(174, 191, 206, 0.65) 0px, transparent 56%), linear-gradient(135deg, #F8F6F7 0%, #F1E7E5 44%, #ECE7F6 74%, #E6F3F6 100%)',
    overlayBg: 'rgba(248, 246, 247, 0.08)',
  },
  'dark-liquid-glass': {
    id: 'dark-liquid-glass',
    presetId: 'theme-bg-dark-liquid-glass',
    label: 'Nền Liquid Glass UI (Tối)',
    themeMode: 'dark',
    imagePath: darkRainbowGlassWallpaper,
    fallbackGradient:
      'radial-gradient(ellipse 66% 56% at 14% 16%, rgba(152, 137, 238, 0.24) 0px, transparent 56%), radial-gradient(ellipse 64% 54% at 86% 14%, rgba(103, 232, 249, 0.16) 0px, transparent 52%), radial-gradient(ellipse 62% 56% at 76% 84%, rgba(181, 167, 244, 0.18) 0px, transparent 54%), linear-gradient(140deg, #101A2B 0%, #171F33 52%, #131B2E 100%)',
    overlayBg: 'rgba(16, 26, 43, 0.16)',
  },
  'cowhide-leather': {
    id: 'cowhide-leather',
    presetId: 'theme-bg-cowhide-leather',
    label: 'Nền Chất liệu da (màu nâu)',
    themeMode: 'color',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 20% 18%, rgba(217, 119, 6, 0.30) 0%, transparent 54%), radial-gradient(circle at 82% 24%, rgba(180, 115, 58, 0.28) 0%, transparent 54%), radial-gradient(circle at 65% 84%, rgba(154, 52, 18, 0.24) 0%, transparent 56%), linear-gradient(145deg, #351b0b 0%, #241206 50%, #44230e 100%)',
    overlayBg: 'rgba(28, 14, 5, 0.08)',
  },
  'black-cowhide-leather': {
    id: 'black-cowhide-leather',
    presetId: 'theme-bg-black-cowhide-leather',
    label: 'Nền Vân Gỗ Óc Chó Cao Cấp',
    themeMode: 'dark',
    imagePath: blackCowhideLeatherWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(245, 196, 120, 0.14) 0%, transparent 52%), radial-gradient(circle at 82% 24%, rgba(164, 102, 54, 0.18) 0%, transparent 54%), linear-gradient(145deg, #2A190F 0%, #160D08 52%, #22140C 100%)',
    overlayBg: 'rgba(19, 11, 6, 0.14)',
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
    label: 'Nền Ocean Navy Light – Glossy Liquid Glass',
    themeMode: 'light',
    imagePath: wpLightDeepOcean,
    fallbackGradient:
      'radial-gradient(ellipse at 15% 10%, rgba(115, 191, 255, 0.65), transparent 40%), radial-gradient(ellipse at 85% 85%, rgba(3, 25, 91, 0.30), transparent 45%), linear-gradient(135deg, #1951FC 0%, #3781FC 48%, #73BFFF 100%)',
    overlayBg: 'rgba(25, 81, 252, 0.10)',
  },
  'neumorphism-beyond': {
    id: 'neumorphism-beyond',
    presetId: 'theme-bg-neumorphism-beyond',
    label: 'Nền Nổi Khối Kính Mờ (Sáng)',
    themeMode: 'light',
    imagePath: neumorphismBeyondWallpaper,
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
    fallbackGradient: '#E0E8F2',
    overlayBg: 'transparent',
  },
  'dark-frost-ice-neu': {
    id: 'dark-frost-ice-neu',
    presetId: 'theme-bg-dark-frost-ice-neu',
    label: 'Nền Băng Tuyết Nổi Khối (Tối)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient: '#1A2433',
    overlayBg: 'transparent',
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
  'flat-soft-ui': {
    id: 'flat-soft-ui',
    presetId: 'theme-bg-flat-soft-ui',
    label: 'Nền Flat Soft UI (Sáng)',
    themeMode: 'light',
    imagePath: wpFlatSoftUi,
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(226, 232, 240, 0.55) 0%, transparent 48%), radial-gradient(circle at 86% 84%, rgba(241, 245, 249, 0.70) 0%, transparent 52%), linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
    overlayBg: 'rgba(248, 250, 252, 0.05)',
  },
  'dark-flat-soft-ui': {
    id: 'dark-flat-soft-ui',
    presetId: 'theme-bg-dark-flat-soft-ui',
    label: 'Nền Flat Soft UI (Tối)',
    themeMode: 'dark',
    imagePath: wpDarkFlatSoftUi,
    fallbackGradient:
      'radial-gradient(circle at 16% 16%, rgba(30, 41, 59, 0.45) 0%, transparent 50%), radial-gradient(circle at 84% 84%, rgba(15, 23, 42, 0.65) 0%, transparent 52%), linear-gradient(135deg, #0A0E17 0%, #0F172A 50%, #060911 100%)',
    overlayBg: 'rgba(10, 14, 23, 0.15)',
  },
  'mica-fluent': {
    id: 'mica-fluent',
    presetId: 'theme-bg-mica-fluent',
    label: 'Nền Mica / Fluent Design (Windows hiện đại)',
    themeMode: 'light',
    imagePath: 'https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg',
    fallbackGradient:
      'radial-gradient(circle at 18% 16%, rgba(232, 65, 24, 0.22) 0%, transparent 48%), radial-gradient(circle at 82% 20%, rgba(217, 179, 130, 0.42) 0%, transparent 52%), radial-gradient(circle at 52% 84%, rgba(82, 90, 101, 0.30) 0%, transparent 54%), linear-gradient(145deg, #d7c7b5 0%, #b8a391 48%, #736358 100%)',
    overlayBg: 'radial-gradient(circle at center, rgba(15, 10, 8, 0.18) 0%, rgba(15, 10, 8, 0.42) 100%)',
  },
  'gradient-dopamine': {
    id: 'gradient-dopamine',
    presetId: 'theme-bg-gradient-dopamine',
    label: 'Nền Gradient / Dopamine UI – Đa sắc',
    themeMode: 'color',
    imagePath: multicolorGlassWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 12% 16%, rgba(255, 46, 147, 0.48) 0%, transparent 50%), radial-gradient(circle at 88% 18%, rgba(0, 210, 255, 0.46) 0%, transparent 48%), radial-gradient(circle at 80% 84%, rgba(255, 107, 0, 0.42) 0%, transparent 52%), radial-gradient(circle at 18% 82%, rgba(124, 58, 237, 0.44) 0%, transparent 50%), linear-gradient(135deg, #FFF0F7 0%, #F3E8FF 38%, #E0F7FF 72%, #FFF5EB 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.05)',
  },
  'dark-luxury': {
    id: 'dark-luxury',
    presetId: 'theme-bg-dark-luxury',
    label: 'Nền Dark Luxury – Sang trọng tối màu',
    themeMode: 'dark',
    imagePath: wpDarkFlatSoftUi,
    fallbackGradient:
      'radial-gradient(ellipse 64% 52% at 18% 14%, rgba(212, 175, 55, 0.18) 0%, transparent 54%), radial-gradient(ellipse 60% 50% at 84% 82%, rgba(243, 229, 171, 0.12) 0%, transparent 56%), linear-gradient(145deg, #090A0F 0%, #11131C 50%, #07080C 100%)',
    overlayBg: 'rgba(7, 8, 12, 0.24)',
  },
  'minimalism': {
    id: 'minimalism',
    presetId: 'theme-bg-minimalism',
    label: 'Nền Minimalism – Tối giản',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient: 'linear-gradient(180deg, #FAFAFA 0%, #F4F4F5 100%)',
    overlayBg: 'transparent',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'liquid-glass': 'custom-wp-1788112774646',
  'dark-liquid-glass': THEME_BACKGROUNDS['dark-liquid-glass'].presetId,
  'multicolor-glass': THEME_BACKGROUNDS['multicolor-glass'].presetId,
  'dark-neon-glass': THEME_BACKGROUNDS['dark-neon-glass'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'black-cowhide-leather': THEME_BACKGROUNDS['black-cowhide-leather'].presetId,
  'deep-ocean': THEME_BACKGROUNDS['deep-ocean'].presetId,
  'light-deep-ocean': THEME_BACKGROUNDS['light-deep-ocean'].presetId,
  'neumorphism-beyond': THEME_BACKGROUNDS['neumorphism-beyond'].presetId,
  'dark-neumorphism-beyond': THEME_BACKGROUNDS['dark-neumorphism-beyond'].presetId,
  'frost-ice-neu': THEME_BACKGROUNDS['frost-ice-neu'].presetId,
  'dark-frost-ice-neu': THEME_BACKGROUNDS['dark-frost-ice-neu'].presetId,
  'flat-soft-ui': THEME_BACKGROUNDS['flat-soft-ui'].presetId,
  'dark-flat-soft-ui': THEME_BACKGROUNDS['dark-flat-soft-ui'].presetId,
  'mica-fluent': 'img-wp-18',
  'gradient-dopamine': THEME_BACKGROUNDS['gradient-dopamine'].presetId,
  'dark-luxury': THEME_BACKGROUNDS['dark-luxury'].presetId,
  'minimalism': THEME_BACKGROUNDS['minimalism'].presetId,
};
