import { CardEffectMode, CardStyleMode, ThemeMechanismMode, WaveMotionMode } from './theme.types';
import wpLiquidGlass from '@/assets/images/wp_liquid_glass_1795447886339.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import wpLightDeepOcean from '@/assets/images/wp_light_deep_ocean_1795447885624.jpg';
import neumorphismBeyondWallpaper from '@/assets/images/neumorphism_beyond_wallpaper_1795201986751.jpg';
import darkNeumorphismBeyondWallpaper from '@/assets/images/dark_neumorphism_beyond_wallpaper_1795344399348.jpg';
import multicolorGlassWallpaper from '@/assets/images/multicolor_glass_wallpaper_1795250561824.jpg';
import darkNeonGlassWallpaper from '@/assets/images/dark_neon_multicolor_bg_1794884146586.jpg';
import walnutWoodWallpaper from '@/assets/images/walnut_wood_grain_bg_1795551578186.jpg';
import wpFlatSoftUi from '@/assets/images/wp_flat_soft_ui_1795447887016.jpg';
import wpDarkFlatSoftUi from '@/assets/images/wp_dark_flat_soft_ui_1795447886342.jpg';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'liquid-glass';
export const DEFAULT_LAYER_DEPTH = 100;
export const DEFAULT_CORNER_RADIUS = 14;
export const DEFAULT_WAVE_MOTION: WaveMotionMode = 'normal';
export const DEFAULT_CARD_EFFECT: CardEffectMode = 'default';
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
export const CUSTOM_SURFACE_COLOR_STORAGE_KEY = 'hungthai_custom_surface_color_v1';
export const CUSTOM_PRIMARY_COLOR_STORAGE_KEY = 'hungthai_custom_primary_color_v1';
export const CARD_EFFECT_STORAGE_KEY = 'hungthai_card_effect_v1';
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
export const CUSTOM_SURFACE_COLOR_SYNC_EVENT = 'hungthai:custom-surface-color-changed';
export const CUSTOM_PRIMARY_COLOR_SYNC_EVENT = 'hungthai:custom-primary-color-changed';
export const CARD_EFFECT_SYNC_EVENT = 'hungthai:card-effect-changed';

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
  'dark-cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'walnut-wood': { cardOpacity: 100, blurIntensity: 0 },
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
  'dark-cowhide-leather': {
    id: 'dark-cowhide-leather',
    presetId: 'theme-bg-dark-cowhide-leather',
    label: 'Nền Da Bò Tối Màu',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(229, 184, 126, 0.14) 0%, transparent 52%), radial-gradient(circle at 82% 24%, rgba(161, 108, 63, 0.16) 0%, transparent 54%), linear-gradient(145deg, #2B221E 0%, #1C1613 52%, #140F0D 100%)',
    overlayBg: 'rgba(13, 9, 8, 0.12)',
  },
  'walnut-wood': {
    id: 'walnut-wood',
    presetId: 'theme-bg-walnut-wood',
    label: 'Nền Vân Gỗ Óc Chó Cao Cấp',
    themeMode: 'dark',
    imagePath: walnutWoodWallpaper,
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
  'dark-cowhide-leather': THEME_BACKGROUNDS['dark-cowhide-leather'].presetId,
  'walnut-wood': THEME_BACKGROUNDS['walnut-wood'].presetId,
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

export interface InterfaceColorPreset {
  id: string;
  labelVi: string;
  labelEn: string;
  hex: string;
  previewBg: string;
}

export const INTERFACE_SURFACE_COLOR_PRESETS: InterfaceColorPreset[] = [
  { id: 'surface-white', labelVi: 'Trắng tinh khiết', labelEn: 'Pure White', hex: '#FFFFFF', previewBg: 'linear-gradient(135deg, #FFFFFF, #F1F5F9)' },
  { id: 'surface-cloud', labelVi: 'Xanh mây dịu', labelEn: 'Cloud Blue', hex: '#EFF6FF', previewBg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
  { id: 'surface-iris', labelVi: 'Tím oải hương', labelEn: 'Soft Lavender', hex: '#F5F3FF', previewBg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
  { id: 'surface-mint', labelVi: 'Bạc hà thanh mát', labelEn: 'Fresh Mint', hex: '#ECFDF5', previewBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
  { id: 'surface-cream', labelVi: 'Kem lụa ấm', labelEn: 'Warm Silk', hex: '#FFFBEB', previewBg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
  { id: 'surface-rose', labelVi: 'Hồng phấn nhẹ', labelEn: 'Blush Rose', hex: '#FFF1F2', previewBg: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)' },
  { id: 'surface-slate-dark', labelVi: 'Xám đá tối', labelEn: 'Deep Slate', hex: '#1E293B', previewBg: 'linear-gradient(135deg, #1E293B, #0F172A)' },
  { id: 'surface-navy-dark', labelVi: 'Xanh đêm thẳm', labelEn: 'Midnight Navy', hex: '#0F172A', previewBg: 'linear-gradient(135deg, #172554, #090D16)' },
];

export const INTERFACE_PRIMARY_COLOR_PRESETS: InterfaceColorPreset[] = [
  { id: 'primary-violet', labelVi: 'Tím Hoàng Gia', labelEn: 'Royal Violet', hex: '#6D28D9', previewBg: 'linear-gradient(135deg, #6D28D9, #4F46E5)' },
  { id: 'primary-blue', labelVi: 'Xanh Đại Dương', labelEn: 'Ocean Blue', hex: '#2563EB', previewBg: 'linear-gradient(135deg, #2563EB, #0284C7)' },
  { id: 'primary-cyan', labelVi: 'Lam Ngọc Sáng', labelEn: 'Bright Cyan', hex: '#0891B2', previewBg: 'linear-gradient(135deg, #0891B2, #06B6D4)' },
  { id: 'primary-emerald', labelVi: 'Ngọc Lục Bảo', labelEn: 'Emerald Mint', hex: '#059669', previewBg: 'linear-gradient(135deg, #059669, #10B981)' },
  { id: 'primary-rose', labelVi: 'Hồng Năng Lượng', labelEn: 'Vibrant Rose', hex: '#E11D48', previewBg: 'linear-gradient(135deg, #E11D48, #EC4899)' },
  { id: 'primary-amber', labelVi: 'Vàng Hổ Phách', labelEn: 'Warm Amber', hex: '#D97706', previewBg: 'linear-gradient(135deg, #D97706, #F59E0B)' },
  { id: 'primary-indigo', labelVi: 'Chàm Hiện Đại', labelEn: 'Modern Indigo', hex: '#4F46E5', previewBg: 'linear-gradient(135deg, #4F46E5, #7C3AED)' },
  { id: 'primary-slate', labelVi: 'Đen Tinh Tế', labelEn: 'Refined Ink', hex: '#1E293B', previewBg: 'linear-gradient(135deg, #1E293B, #475569)' },
];

export interface CardEffectPreset {
  id: CardEffectMode;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  icon: string;
}

export const CARD_EFFECT_PRESETS: CardEffectPreset[] = [
  {
    id: 'default',
    labelVi: 'Mặc định',
    labelEn: 'Default',
    descVi: 'Theo thiết lập nguyên bản của giao diện đang bật',
    descEn: 'Follows the active theme defaults',
    icon: 'layers',
  },
  {
    id: 'float',
    labelVi: 'Nổi bật mượt',
    labelEn: 'Soft Float',
    descVi: 'Nâng nhẹ thẻ lên trên và tăng độ sâu bóng đổ khi chạm',
    descEn: 'Lifts cards gently upward with deeper shadow on hover',
    icon: 'arrow-up-right',
  },
  {
    id: 'inset',
    labelVi: 'Lún chìm mềm',
    labelEn: 'Soft Inset',
    descVi: 'Nhấn chìm bề mặt thẻ vào trong với bóng đổ lõm tinh tế',
    descEn: 'Presses card surfaces subtly inward with recessed tactile shadow',
    icon: 'layers',
  },
  {
    id: 'glow',
    labelVi: 'Viền phát sáng',
    labelEn: 'Aura Glow',
    descVi: 'Tỏa ánh sáng viền dịu theo màu chính của giao diện',
    descEn: 'Emits a soft perimeter aura in the active primary color',
    icon: 'sparkles',
  },
  {
    id: 'shine',
    labelVi: 'Phản quang kính',
    labelEn: 'Glass Sheen',
    descVi: 'Lướt vệt sáng phản quang chéo qua bề mặt thẻ',
    descEn: 'Sweeps a diagonal optical sheen across card surfaces',
    icon: 'zap',
  },
  {
    id: 'tilt',
    labelVi: 'Nổi khối 3D',
    labelEn: '3D Lift',
    descVi: 'Nghiêng phối cảnh tinh tế và phóng nhẹ khi di chuột',
    descEn: 'Subtle perspective tilt and gentle scale on hover',
    icon: 'compass',
  },
  {
    id: 'static',
    labelVi: 'Tĩnh tối giản',
    labelEn: 'Static Focus',
    descVi: 'Giữ nguyên vị trí thẻ, tắt chuyển động khi di chuột',
    descEn: 'Keeps cards stationary without hover motion',
    icon: 'shield-check',
  },
];

export interface ThemeCardSpec {
  surfaceColorHex: string;
  surfaceColorNameVi: string;
  surfaceColorNameEn: string;
  primaryColorHex: string;
  primaryColorNameVi: string;
  primaryColorNameEn: string;
  defaultCardEffect: CardEffectMode;
  cardEffectKindVi: string;
  cardEffectKindEn: string;
  cardEffectDescVi: string;
  cardEffectDescEn: string;
}

export const THEME_CARD_SPECS: Record<CardStyleMode, ThemeCardSpec> = {
  'liquid-glass': {
    surfaceColorHex: '#F8F6F7',
    surfaceColorNameVi: 'Kính trắng ngọc trai',
    surfaceColorNameEn: 'Pearl Glass Tint',
    primaryColorHex: '#6D28D9',
    primaryColorNameVi: 'Tím Hoàng Gia',
    primaryColorNameEn: 'Royal Violet',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Nổi kính phản quang',
    cardEffectKindEn: 'Optical Glass Sheen',
    cardEffectDescVi: 'Nổi nhẹ mặt kính kèm vệt phản quang chéo tinh tế',
    cardEffectDescEn: 'Lifted translucent glass with subtle diagonal sheen',
  },
  'dark-liquid-glass': {
    surfaceColorHex: '#1A263E',
    surfaceColorNameVi: 'Kính xanh đêm sâu',
    surfaceColorNameEn: 'Deep Slate Glass',
    primaryColorHex: '#B5A7F4',
    primaryColorNameVi: 'Oải hương dịu',
    primaryColorNameEn: 'Soft Lavender',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Nổi kính phản quang',
    cardEffectKindEn: 'Night Glass Sheen',
    cardEffectDescVi: 'Phản quang ánh kính dịu mắt trên nền tối trong suốt',
    cardEffectDescEn: 'Soft specular sweep across dark translucent glass',
  },
  'multicolor-glass': {
    surfaceColorHex: '#EDF6FF',
    surfaceColorNameVi: 'Kính mờ đa sắc',
    surfaceColorNameEn: 'Prismatic Frost Glass',
    primaryColorHex: '#4F46E5',
    primaryColorNameVi: 'Chàm Lăng Kính',
    primaryColorNameEn: 'Prism Indigo',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Nổi phản quang đa sắc',
    cardEffectKindEn: 'Prism Sheen',
    cardEffectDescVi: 'Kính nổi phản quang lướt sáng nhiều lớp quang phổ',
    cardEffectDescEn: 'Multi-hue optical glass with luminous surface sweep',
  },
  'dark-neon-glass': {
    surfaceColorHex: '#0F172A',
    surfaceColorNameVi: 'Kính đêm Obsidian',
    surfaceColorNameEn: 'Obsidian Night Glass',
    primaryColorHex: '#22D3EE',
    primaryColorNameVi: 'Lam Neon Sáng',
    primaryColorNameEn: 'Neon Cyan',
    defaultCardEffect: 'glow',
    cardEffectKindVi: 'Nổi phát sáng viền',
    cardEffectKindEn: 'Neon Aura Glow',
    cardEffectDescVi: 'Tỏa quầng sáng viền neon cyan sắc nét khi tương tác',
    cardEffectDescEn: 'Radiates crisp cyan perimeter glow on hover',
  },
  'cowhide-leather': {
    surfaceColorHex: '#653A17',
    surfaceColorNameVi: 'Da bò nâu cognac',
    surfaceColorNameEn: 'Cognac Hide Brown',
    primaryColorHex: '#F5DEB3',
    primaryColorNameVi: 'Chỉ kem cổ điển',
    primaryColorNameEn: 'Cream Stitch',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Nổi thủ công ấm',
    cardEffectKindEn: 'Crafted Soft Float',
    cardEffectDescVi: 'Nổi êm nhẹ nhàng giữ nguyên đường khâu chỉ kem',
    cardEffectDescEn: 'Gentle elevation preserving stitched leather craft',
  },
  'dark-cowhide-leather': {
    surfaceColorHex: '#2B221E',
    surfaceColorNameVi: 'Da bò nâu sẫm',
    surfaceColorNameEn: 'Dark Espresso Hide',
    primaryColorHex: '#E5B87E',
    primaryColorNameVi: 'Vàng đồng ấm',
    primaryColorNameEn: 'Warm Saddle Tan',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Lún chìm khâu tay',
    cardEffectKindEn: 'Debossed Leather Inset',
    cardEffectDescVi: 'Nhấn lún chìm cổ điển như dập nổi trên mặt da tối',
    cardEffectDescEn: 'Tactile debossed press across dark stitched leather',
  },
  'walnut-wood': {
    surfaceColorHex: '#2A190F',
    surfaceColorNameVi: 'Gỗ óc chó sẫm',
    surfaceColorNameEn: 'American Walnut',
    primaryColorHex: '#F5C478',
    primaryColorNameVi: 'Đồng xước hổ phách',
    primaryColorNameEn: 'Brushed Brass',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Lún khảm đồng tinh xảo',
    cardEffectKindEn: 'Inlaid Wood Inset',
    cardEffectDescVi: 'Bề mặt thẻ lún nhẹ tạo cảm giác khảm đồng trên gỗ',
    cardEffectDescEn: 'Subtle recessed wood inlay depth on interaction',
  },
  'deep-ocean': {
    surfaceColorHex: '#0D1C38',
    surfaceColorNameVi: 'Xanh thẳm đại dương',
    surfaceColorNameEn: 'Abyssal Navy',
    primaryColorHex: '#38BDF8',
    primaryColorNameVi: 'Lam Sonar sáng',
    primaryColorNameEn: 'Sonar Cyan',
    defaultCardEffect: 'glow',
    cardEffectKindVi: 'Nổi phát sáng biển sâu',
    cardEffectKindEn: 'Sonar Aura Glow',
    cardEffectDescVi: 'Phát sáng viền xanh lam sâu dịu theo nhịp đại dương',
    cardEffectDescEn: 'Soft deep-sea cyan edge glow on hover',
  },
  'light-deep-ocean': {
    surfaceColorHex: '#CBE9FD',
    surfaceColorNameVi: 'Kính xanh biển sáng',
    surfaceColorNameEn: 'Coastal Sky Glass',
    primaryColorHex: '#1951FC',
    primaryColorNameVi: 'Xanh Cobalt biển',
    primaryColorNameEn: 'Cobalt Surf',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Nổi ánh kính mặt biển',
    cardEffectKindEn: 'Glossy Wave Sheen',
    cardEffectDescVi: 'Mặt kính bóng bẩy phản quang ánh sáng biển xanh',
    cardEffectDescEn: 'Glossy ocean surface with crisp specular reflection',
  },
  'neumorphism-beyond': {
    surfaceColorHex: '#EBF0F6',
    surfaceColorNameVi: 'Xám băng nổi khối',
    surfaceColorNameEn: 'Ice Slate Matte',
    primaryColorHex: '#4973FF',
    primaryColorNameVi: 'Xanh điện năng',
    primaryColorNameEn: 'Electric Blue',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Nổi khối đùn mềm',
    cardEffectKindEn: 'Extruded Soft Float',
    cardEffectDescVi: 'Đùn nổi khối mềm kết hợp bóng đổ đối xứng sáng/tối',
    cardEffectDescEn: 'Soft extruded block with dual opposing elevation shadows',
  },
  'dark-neumorphism-beyond': {
    surfaceColorHex: '#151B26',
    surfaceColorNameVi: 'Than tối nổi khối',
    surfaceColorNameEn: 'Charcoal Slate Matte',
    primaryColorHex: '#64B6FF',
    primaryColorNameVi: 'Xanh băng sáng',
    primaryColorNameEn: 'Ice Sky',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Lún khối than mềm',
    cardEffectKindEn: 'Recessed Dark Inset',
    cardEffectDescVi: 'Nhấn lún chìm dịu mắt trên bề mặt than lì không gắt',
    cardEffectDescEn: 'Softly recessed matte charcoal depth on hover',
  },
  'frost-ice-neu': {
    surfaceColorHex: '#E0E8F2',
    surfaceColorNameVi: 'Băng tuyết lì sáng',
    surfaceColorNameEn: 'Frost Ice Matte',
    primaryColorHex: '#5B57E8',
    primaryColorNameVi: 'Chàm băng giá',
    primaryColorNameEn: 'Indigo Frost',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Lún & nổi không viền',
    cardEffectKindEn: 'Borderless Soft Inset',
    cardEffectDescVi: 'Không viền, nhấn lún chìm trực tiếp vào nền băng lì',
    cardEffectDescEn: 'Borderless tactile press sinking directly into matte ice',
  },
  'dark-frost-ice-neu': {
    surfaceColorHex: '#1A2433',
    surfaceColorNameVi: 'Băng đêm lì tối',
    surfaceColorNameEn: 'Arctic Night Matte',
    primaryColorHex: '#6E6AF6',
    primaryColorNameVi: 'Tím băng Bắc Cực',
    primaryColorNameEn: 'Glacier Violet',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Lún khối băng đêm',
    cardEffectKindEn: 'Borderless Dark Inset',
    cardEffectDescVi: 'Không viền, đổ bóng lõm đều hai chiều trên nền đêm',
    cardEffectDescEn: 'Borderless dual-shadow recessed press on arctic slate',
  },
  'flat-soft-ui': {
    surfaceColorHex: '#FFFFFF',
    surfaceColorNameVi: 'Trắng mịn thanh lịch',
    surfaceColorNameEn: 'Crisp Paper White',
    primaryColorHex: '#4F46E5',
    primaryColorNameVi: 'Chàm Studio',
    primaryColorNameEn: 'Studio Indigo',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Nổi phẳng nhẹ nhàng',
    cardEffectKindEn: 'Feather Soft Float',
    cardEffectDescVi: 'Bề mặt phẳng mịn nâng nhẹ 4px với bóng đổ dịu',
    cardEffectDescEn: 'Clean flat plane lifting smoothly with feather shadow',
  },
  'dark-flat-soft-ui': {
    surfaceColorHex: '#131B2A',
    surfaceColorNameVi: 'Xám đêm phẳng mịn',
    surfaceColorNameEn: 'Obsidian Flat Matte',
    primaryColorHex: '#6366F1',
    primaryColorNameVi: 'Chàm đêm dịu',
    primaryColorNameEn: 'Soft Indigo',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Nổi phẳng nền tối',
    cardEffectKindEn: 'Dark Soft Float',
    cardEffectDescVi: 'Nâng nhẹ êm ái, giữ độ tương phản chữ tối ưu',
    cardEffectDescEn: 'Smooth gentle lift preserving low-glare readability',
  },
  'mica-fluent': {
    surfaceColorHex: '#F5EFEA',
    surfaceColorNameVi: 'Mica ấm bán trong suốt',
    surfaceColorNameEn: 'Warm Translucent Mica',
    primaryColorHex: '#E84118',
    primaryColorNameVi: 'Đỏ đất nung',
    primaryColorNameEn: 'Terracotta CTA',
    defaultCardEffect: 'tilt',
    cardEffectKindVi: 'Nổi phối cảnh Fluent',
    cardEffectKindEn: 'Fluent 3D Lift',
    cardEffectDescVi: 'Nghiêng 3D nhẹ nhàng theo chiều ánh sáng Windows Fluent',
    cardEffectDescEn: 'Subtle 3D perspective lift inspired by Fluent Design',
  },
  'gradient-dopamine': {
    surfaceColorHex: '#FFF0F7',
    surfaceColorNameVi: 'Hồng phấn đa sắc',
    surfaceColorNameEn: 'Pastel Multi-Hue',
    primaryColorHex: '#FF2E93',
    primaryColorNameVi: 'Hồng rực năng lượng',
    primaryColorNameEn: 'Hot Magenta',
    defaultCardEffect: 'glow',
    cardEffectKindVi: 'Nổi phát sáng đa sắc',
    cardEffectKindEn: 'Dopamine Aura Glow',
    cardEffectDescVi: 'Tỏa viền rực rỡ giàu năng lượng theo bảng màu đa sắc',
    cardEffectDescEn: 'Energetic vibrant aura highlight on interaction',
  },
  'dark-luxury': {
    surfaceColorHex: '#14161F',
    surfaceColorNameVi: 'Nhung đen Obsidian',
    surfaceColorNameEn: 'Velvet Onyx',
    primaryColorHex: '#D4AF37',
    primaryColorNameVi: 'Vàng Champagne ánh kim',
    primaryColorNameEn: 'Champagne Gold',
    defaultCardEffect: 'tilt',
    cardEffectKindVi: 'Nổi 3D ánh kim',
    cardEffectKindEn: 'Luxury 3D Lift',
    cardEffectDescVi: 'Nổi khối 3D thanh lịch kết hợp đường viền ánh vàng kim',
    cardEffectDescEn: 'Refined 3D perspective lift with metallic gold trim',
  },
  'minimalism': {
    surfaceColorHex: '#FFFFFF',
    surfaceColorNameVi: 'Trắng tinh giản',
    surfaceColorNameEn: 'Pure Canvas White',
    primaryColorHex: '#111111',
    primaryColorNameVi: 'Mực đen tối giản',
    primaryColorNameEn: 'Editorial Ink',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Phẳng tĩnh tối giản',
    cardEffectKindEn: 'Minimal Static',
    cardEffectDescVi: 'Giữ nguyên vị trí tĩnh, tập trung tối đa vào nội dung',
    cardEffectDescEn: 'Zero hover displacement to keep focus strictly on content',
  },
};
