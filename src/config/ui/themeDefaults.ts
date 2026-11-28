import { CardEffectMode, CardStyleMode, SurfaceDepthMode, ThemeMechanismMode, WaveMotionMode } from './theme.types';
import wpLiquidGlass from '@/assets/images/wp_liquid_glass_1795447886339.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import walnutWoodWallpaper from '@/assets/images/walnut_wood_grain_bg_1795551578186.jpg';
import wpFlatSoftUi from '@/assets/images/wp_flat_soft_ui_1795447887016.jpg';
import wpDarkFlatSoftUi from '@/assets/images/wp_dark_flat_soft_ui_1795447886342.jpg';

export const DEFAULT_CARD_STYLE: CardStyleMode = 'liquid-glass';
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
export const AUTO_TIME_THEME_STORAGE_KEY = 'hungthai_auto_time_theme_v1';
export const GLOBAL_CORNER_RADIUS_STORAGE_KEY = 'hungthai_global_corner_radius_v1';
export const THEME_CORNER_RADIUS_STORAGE_KEY = 'hungthai_theme_corner_radius_v1';
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
export const AUTO_TIME_THEME_SYNC_EVENT = 'hungthai:auto-time-theme-changed';
export const GLOBAL_CORNER_RADIUS_SYNC_EVENT = 'hungthai:global-corner-radius-changed';
export const THEME_CORNER_RADIUS_SYNC_EVENT = 'hungthai:theme-corner-radius-changed';
export const WAVE_MOTION_SYNC_EVENT = 'hungthai:wave-motion-changed';
export const CUSTOM_SURFACE_COLOR_SYNC_EVENT = 'hungthai:custom-surface-color-changed';
export const CUSTOM_PRIMARY_COLOR_SYNC_EVENT = 'hungthai:custom-primary-color-changed';
export const CARD_EFFECT_SYNC_EVENT = 'hungthai:card-effect-changed';

export const THEME_NATIVE_SURFACE_DEPTH: Record<CardStyleMode, SurfaceDepthMode> = {
  'liquid-glass': 'depth',
  'dark-liquid-glass': 'depth',
  'glassmorphism': 'depth',
  'cowhide-leather': 'depth',
  'walnut-wood': 'depth',
  'deep-ocean': 'depth',
  'frost-ice-neu': 'depth',
  'neumorphism-soft-ui': 'depth',
  'flat-soft-ui': 'flat',
  'dark-flat-soft-ui': 'flat',
  'color-flat-soft-ui': 'flat',
  'flat-ui': 'flat',
  'nexus-bento': 'depth',
  'light-nexus-bento': 'depth',
  'mica-fluent': 'depth',
  'iridescent-liquid-glass': 'depth',
  'dark-iridescent-liquid-glass': 'depth',
};

export const getThemeNativeSurfaceDepth = (style: CardStyleMode): SurfaceDepthMode =>
  THEME_NATIVE_SURFACE_DEPTH[style] ?? 'depth';

export const isNeumorphismCardStyle = (style: CardStyleMode): boolean =>
  style === 'neumorphism-soft-ui';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'dark-liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'glassmorphism': { cardOpacity: 12, blurIntensity: 16 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'walnut-wood': { cardOpacity: 100, blurIntensity: 0 },
  'deep-ocean': { cardOpacity: 84, blurIntensity: 20 },
  'frost-ice-neu': { cardOpacity: 100, blurIntensity: 0 },
  'neumorphism-soft-ui': { cardOpacity: 100, blurIntensity: 0 },
  'flat-soft-ui': { cardOpacity: 98, blurIntensity: 0 },
  'dark-flat-soft-ui': { cardOpacity: 96, blurIntensity: 0 },
  'color-flat-soft-ui': { cardOpacity: 96, blurIntensity: 0 },
  'flat-ui': { cardOpacity: 100, blurIntensity: 0 },
  'nexus-bento': { cardOpacity: 90, blurIntensity: 24 },
  'light-nexus-bento': { cardOpacity: 90, blurIntensity: 24 },
  'mica-fluent': { cardOpacity: 30, blurIntensity: 20 },
  'iridescent-liquid-glass': { cardOpacity: 64, blurIntensity: 24 },
  'dark-iridescent-liquid-glass': { cardOpacity: 66, blurIntensity: 24 },
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
    label: 'Nền Kính Lỏng Trong Suốt',
    themeMode: 'light',
    imagePath: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    fallbackGradient:
      'radial-gradient(ellipse 64% 54% at 12% 14%, rgba(126, 34, 206, 0.20) 0px, transparent 56%), radial-gradient(ellipse 62% 54% at 88% 16%, rgba(8, 145, 178, 0.20) 0px, transparent 54%), radial-gradient(ellipse 60% 56% at 50% 48%, rgba(79, 70, 229, 0.16) 0px, transparent 58%), radial-gradient(ellipse 62% 52% at 82% 86%, rgba(219, 39, 119, 0.16) 0px, transparent 56%), radial-gradient(ellipse 56% 50% at 18% 84%, rgba(217, 119, 6, 0.14) 0px, transparent 54%), linear-gradient(135deg, #F8F6FB 0%, #F4F0F9 44%, #EEF2FC 74%, #ECF8F9 100%)',
    overlayBg: 'rgba(248, 246, 251, 0.08)',
  },
  'dark-liquid-glass': {
    id: 'dark-liquid-glass',
    presetId: 'theme-bg-dark-liquid-glass',
    label: 'Nền Kính Lỏng Bóng Đêm',
    themeMode: 'dark',
    imagePath: darkRainbowGlassWallpaper,
    fallbackGradient:
      'radial-gradient(ellipse 64% 54% at 14% 16%, rgba(192, 132, 252, 0.24) 0px, transparent 56%), radial-gradient(ellipse 62% 52% at 86% 14%, rgba(34, 211, 238, 0.18) 0px, transparent 52%), radial-gradient(ellipse 60% 54% at 76% 84%, rgba(244, 114, 182, 0.18) 0px, transparent 54%), radial-gradient(ellipse 56% 50% at 20% 82%, rgba(52, 211, 153, 0.14) 0px, transparent 52%), linear-gradient(140deg, #101A2B 0%, #171F33 52%, #131B2E 100%)',
    overlayBg: 'rgba(16, 26, 43, 0.16)',
  },
  'glassmorphism': {
    id: 'glassmorphism',
    presetId: 'theme-bg-glassmorphism',
    label: 'Nền Aurora Đa Sắc Glassmorphism',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(ellipse 62% 56% at 14% 18%, rgba(6, 182, 212, 0.72) 0%, transparent 58%), radial-gradient(ellipse 58% 54% at 86% 20%, rgba(236, 72, 153, 0.68) 0%, transparent 56%), radial-gradient(ellipse 64% 58% at 50% 52%, rgba(99, 102, 241, 0.62) 0%, transparent 62%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(249, 115, 22, 0.54) 0%, transparent 56%), radial-gradient(ellipse 60% 56% at 16% 86%, rgba(139, 92, 246, 0.68) 0%, transparent 58%), linear-gradient(135deg, #0D102B 0%, #17143D 46%, #131B3A 100%)',
    overlayBg: 'linear-gradient(180deg, rgba(8, 12, 28, 0.22) 0%, rgba(10, 14, 34, 0.30) 100%)',
  },
  'cowhide-leather': {
    id: 'cowhide-leather',
    presetId: 'theme-bg-cowhide-leather',
    label: 'Nền Da Bò Thủ Công',
    themeMode: 'color',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 20% 18%, rgba(217, 119, 6, 0.32) 0%, transparent 54%), radial-gradient(circle at 82% 24%, rgba(180, 115, 58, 0.30) 0%, transparent 54%), radial-gradient(circle at 65% 84%, rgba(154, 52, 18, 0.26) 0%, transparent 56%), linear-gradient(145deg, #3A1F0D 0%, #241206 50%, #4A2912 100%)',
    overlayBg: 'rgba(28, 14, 5, 0.08)',
  },
  'walnut-wood': {
    id: 'walnut-wood',
    presetId: 'theme-bg-walnut-wood',
    label: 'Nền Gỗ Óc Chó Trầm',
    themeMode: 'dark',
    imagePath: walnutWoodWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 18% 18%, rgba(245, 196, 120, 0.14) 0%, transparent 52%), radial-gradient(circle at 82% 24%, rgba(164, 102, 54, 0.18) 0%, transparent 54%), linear-gradient(145deg, #2A190F 0%, #160D08 52%, #22140C 100%)',
    overlayBg: 'rgba(19, 11, 6, 0.14)',
  },
  'deep-ocean': {
    id: 'deep-ocean',
    presetId: 'theme-bg-deep-ocean',
    label: 'Nền Biển Sâu Thẳm Xanh',
    themeMode: 'dark',
    imagePath: deepOceanWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.18) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), linear-gradient(145deg, #0A1128 0%, #050B14 50%, #030712 100%)',
    overlayBg: 'rgba(5, 11, 20, 0.22)',
  },
  'frost-ice-neu': {
    id: 'frost-ice-neu',
    presetId: 'theme-bg-frost-ice-neu',
    label: 'Nền Băng Tuyết Nổi Khối',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 84%, rgba(196, 212, 232, 0.55) 0%, transparent 56%), linear-gradient(145deg, #E6EEF8 0%, #E0E8F2 52%, #D6E1EE 100%)',
    overlayBg: 'transparent',
  },
  'neumorphism-soft-ui': {
    id: 'neumorphism-soft-ui',
    presetId: 'theme-bg-neumorphism-soft-ui',
    label: 'Nền Lì Neumorphism (#E0E5EC)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient: '#E0E5EC',
    overlayBg: 'transparent',
  },
  'flat-soft-ui': {
    id: 'flat-soft-ui',
    presetId: 'theme-bg-flat-soft-ui',
    label: 'Nền Phẳng Mềm Tinh Khiết',
    themeMode: 'light',
    imagePath: wpFlatSoftUi,
    fallbackGradient:
      'radial-gradient(circle at 14% 16%, rgba(226, 232, 240, 0.55) 0%, transparent 48%), radial-gradient(circle at 86% 84%, rgba(241, 245, 249, 0.70) 0%, transparent 52%), linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
    overlayBg: 'rgba(248, 250, 252, 0.05)',
  },
  'dark-flat-soft-ui': {
    id: 'dark-flat-soft-ui',
    presetId: 'theme-bg-dark-flat-soft-ui',
    label: 'Nền Phẳng Mềm Đêm Tối',
    themeMode: 'dark',
    imagePath: wpDarkFlatSoftUi,
    fallbackGradient:
      'radial-gradient(circle at 16% 16%, rgba(30, 41, 59, 0.45) 0%, transparent 50%), radial-gradient(circle at 84% 84%, rgba(15, 23, 42, 0.65) 0%, transparent 52%), linear-gradient(135deg, #0A0E17 0%, #0F172A 50%, #060911 100%)',
    overlayBg: 'rgba(10, 14, 23, 0.15)',
  },
  'color-flat-soft-ui': {
    id: 'color-flat-soft-ui',
    presetId: 'theme-bg-color-flat-soft-ui',
    label: 'Nền Phẳng Màu Studio (#090D16)',
    themeMode: 'color',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(ellipse 56% 48% at 14% 16%, rgba(139, 92, 246, 0.22) 0%, transparent 56%), radial-gradient(ellipse 54% 48% at 86% 18%, rgba(6, 182, 212, 0.18) 0%, transparent 56%), radial-gradient(ellipse 52% 46% at 78% 84%, rgba(79, 70, 229, 0.18) 0%, transparent 54%), radial-gradient(ellipse 48% 44% at 18% 82%, rgba(16, 185, 129, 0.14) 0%, transparent 52%), linear-gradient(145deg, #090D16 0%, #0D1322 52%, #090D16 100%)',
    overlayBg: 'rgba(9, 13, 22, 0.12)',
  },
  'flat-ui': {
    id: 'flat-ui',
    presetId: 'theme-bg-flat-ui',
    label: 'Nền Trắng Phẳng Flat UI (#FFFFFF)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient: '#FFFFFF',
    overlayBg: 'transparent',
  },
  'nexus-bento': {
    id: 'nexus-bento',
    presetId: 'theme-bg-nexus-bento',
    label: 'Nền Nexus Bento Đêm Tối (#090D16)',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.24) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.20) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.18) 0%, transparent 60%), linear-gradient(180deg, #090D16 0%, #0B1120 100%)',
    overlayBg: 'rgba(9, 13, 22, 0.14)',
  },
  'light-nexus-bento': {
    id: 'light-nexus-bento',
    presetId: 'theme-bg-light-nexus-bento',
    label: 'Nền Nexus Bento Sáng (#F4F7FB)',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.14) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.11) 0%, transparent 60%), linear-gradient(180deg, #F4F7FB 0%, #EEF3FA 100%)',
    overlayBg: 'rgba(244, 247, 251, 0.08)',
  },
  'mica-fluent': {
    id: 'mica-fluent',
    presetId: 'theme-bg-mica-fluent',
    label: 'Nền Kính Mờ Hiện Đại',
    themeMode: 'light',
    imagePath: 'https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg',
    fallbackGradient:
      'radial-gradient(circle at 12% 16%, rgba(126, 34, 206, 0.26) 0%, transparent 46%), radial-gradient(circle at 38% 12%, rgba(37, 99, 235, 0.24) 0%, transparent 44%), radial-gradient(circle at 68% 18%, rgba(8, 145, 178, 0.24) 0%, transparent 46%), radial-gradient(circle at 88% 48%, rgba(5, 150, 105, 0.22) 0%, transparent 48%), radial-gradient(circle at 76% 84%, rgba(217, 119, 6, 0.22) 0%, transparent 48%), radial-gradient(circle at 46% 86%, rgba(225, 29, 72, 0.24) 0%, transparent 48%), radial-gradient(circle at 16% 80%, rgba(219, 39, 119, 0.24) 0%, transparent 46%), linear-gradient(145deg, #efe7f3 0%, #e7e5f2 48%, #ddebf0 100%)',
    overlayBg: 'radial-gradient(circle at center, rgba(15, 10, 8, 0.12) 0%, rgba(15, 10, 8, 0.34) 100%)',
  },
  'iridescent-liquid-glass': {
    id: 'iridescent-liquid-glass',
    presetId: 'theme-bg-iridescent-liquid-glass',
    label: 'Nền Xà Cừ Ánh Sáng',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(ellipse 68% 58% at 14% 16%, rgba(56, 189, 248, 0.34) 0%, transparent 56%), radial-gradient(ellipse 64% 56% at 86% 18%, rgba(251, 146, 60, 0.28) 0%, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 56%, rgba(168, 85, 247, 0.24) 0%, transparent 58%), radial-gradient(ellipse 60% 54% at 80% 86%, rgba(244, 114, 182, 0.24) 0%, transparent 54%), linear-gradient(135deg, #F6FAFF 0%, #EEF6FF 46%, #FDF2FA 76%, #FFF7ED 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.06)',
  },
  'dark-iridescent-liquid-glass': {
    id: 'dark-iridescent-liquid-glass',
    presetId: 'theme-bg-dark-iridescent-liquid-glass',
    label: 'Nền Xà Cừ Đêm Tối',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient:
      'radial-gradient(ellipse 66% 56% at 16% 16%, rgba(34, 211, 238, 0.30) 0%, transparent 56%), radial-gradient(ellipse 60% 52% at 86% 18%, rgba(251, 146, 60, 0.22) 0%, transparent 52%), radial-gradient(ellipse 64% 58% at 72% 84%, rgba(168, 85, 247, 0.28) 0%, transparent 56%), linear-gradient(140deg, #070B16 0%, #0F172A 52%, #130F26 100%)',
    overlayBg: 'rgba(7, 11, 22, 0.14)',
  },
};

export const THEME_DEFAULT_WALLPAPER_ID: Record<CardStyleMode, string> = {
  'liquid-glass': THEME_BACKGROUNDS['liquid-glass'].presetId,
  'dark-liquid-glass': THEME_BACKGROUNDS['dark-liquid-glass'].presetId,
  'glassmorphism': THEME_BACKGROUNDS['glassmorphism'].presetId,
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'walnut-wood': THEME_BACKGROUNDS['walnut-wood'].presetId,
  'deep-ocean': THEME_BACKGROUNDS['deep-ocean'].presetId,
  'frost-ice-neu': THEME_BACKGROUNDS['frost-ice-neu'].presetId,
  'neumorphism-soft-ui': THEME_BACKGROUNDS['neumorphism-soft-ui'].presetId,
  'flat-soft-ui': THEME_BACKGROUNDS['flat-soft-ui'].presetId,
  'dark-flat-soft-ui': THEME_BACKGROUNDS['dark-flat-soft-ui'].presetId,
  'color-flat-soft-ui': THEME_BACKGROUNDS['color-flat-soft-ui'].presetId,
  'flat-ui': THEME_BACKGROUNDS['flat-ui'].presetId,
  'nexus-bento': THEME_BACKGROUNDS['nexus-bento'].presetId,
  'light-nexus-bento': THEME_BACKGROUNDS['light-nexus-bento'].presetId,
  'mica-fluent': 'img-wp-18',
  'iridescent-liquid-glass': THEME_BACKGROUNDS['iridescent-liquid-glass'].presetId,
  'dark-iridescent-liquid-glass': THEME_BACKGROUNDS['dark-iridescent-liquid-glass'].presetId,
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

export interface LetterColorToken extends InterfaceColorPreset {
  darkHex: string;
  sourceVi: string;
}

/**
 * 14 sắc màu phân tích & phát triển từ hệ thẻ màu Trang Thư Ngỏ (LetterView.tsx)
 * Ứng dụng đồng bộ cho các nhóm giao diện:
 *   1. Kính Lỏng Mềm Mại (liquid-glass / dark-liquid-glass)
 *   2. Giao Diện Phẳng Mềm (flat-soft-ui / dark-flat-soft-ui)
 *   3. Kính Mờ Phân Lớp (mica-fluent)
 */
export const LETTER_14_COLOR_PALETTE: LetterColorToken[] = [
  { id: 'letter-c1', labelVi: 'Tím Năng Lực', labelEn: 'Royal Amethyst', hex: '#7E22CE', darkHex: '#C084FC', sourceVi: 'Thẻ Hồ sơ năng lực', previewBg: 'linear-gradient(135deg, #9333EA, #7E22CE)' },
  { id: 'letter-c2', labelVi: 'Chàm Thư Ngỏ', labelEn: 'Signature Indigo', hex: '#4F46E5', darkHex: '#818CF8', sourceVi: 'Thẻ Triết lý & Viền thư', previewBg: 'linear-gradient(135deg, #4F46E5, #3730A3)' },
  { id: 'letter-c3', labelVi: 'Xanh Quy Trình', labelEn: 'Royal Blue', hex: '#2563EB', darkHex: '#60A5FA', sourceVi: 'Thẻ Quy trình & MobiFone', previewBg: 'linear-gradient(135deg, #2563EB, #4338CA)' },
  { id: 'letter-c4', labelVi: 'Xanh Thiên Thanh', labelEn: 'Azure Sky', hex: '#0284C7', darkHex: '#38BDF8', sourceVi: 'Chuyển sắc Xanh - Lam', previewBg: 'linear-gradient(135deg, #0284C7, #0EA5E9)' },
  { id: 'letter-c5', labelVi: 'Lam Ngọc Sáng', labelEn: 'Cerulean Cyan', hex: '#0891B2', darkHex: '#22D3EE', sourceVi: 'Chuyển sắc Lam - Ngọc', previewBg: 'linear-gradient(135deg, #0891B2, #06B6D4)' },
  { id: 'letter-c6', labelVi: 'Xanh Cổ Vịt', labelEn: 'Ocean Teal', hex: '#0D9488', darkHex: '#2DD4BF', sourceVi: 'Thẻ Công nghệ & Đòn bẩy', previewBg: 'linear-gradient(135deg, #0D9488, #0F766E)' },
  { id: 'letter-c7', labelVi: 'Ngọc Lục Bảo', labelEn: 'Emerald Jade', hex: '#059669', darkHex: '#34D399', sourceVi: 'Thẻ Tech Focus & Ví ECO', previewBg: 'linear-gradient(135deg, #10B981, #059669)' },
  { id: 'letter-c8', labelVi: 'Xanh Lá Bền Vững', labelEn: 'Vibrant Olive', hex: '#65A30D', darkHex: '#A3E635', sourceVi: 'Chuyển sắc Ngọc - Vàng', previewBg: 'linear-gradient(135deg, #65A30D, #84CC16)' },
  { id: 'letter-c9', labelVi: 'Vàng Ánh Kim', labelEn: 'Solar Gold', hex: '#CA8A04', darkHex: '#FDE047', sourceVi: 'Ánh kim Thẻ Hồ sơ & Con người', previewBg: 'linear-gradient(135deg, #EAB308, #CA8A04)' },
  { id: 'letter-c10', labelVi: 'Hổ Phách Dấu Sáp', labelEn: 'Wax Seal Amber', hex: '#D97706', darkHex: '#FBBF24', sourceVi: 'Dấu sáp & Kết nối thiện chí', previewBg: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  { id: 'letter-c11', labelVi: 'Cam Nhiệt Huyết', labelEn: 'Tangerine Orange', hex: '#EA580C', darkHex: '#FB923C', sourceVi: 'Thẻ Con người & VED/Shopee', previewBg: 'linear-gradient(135deg, #F97316, #EA580C)' },
  { id: 'letter-c12', labelVi: 'Đỏ Hồng Ngọc', labelEn: 'Crimson Rose', hex: '#E11D48', darkHex: '#FB7185', sourceVi: 'Thẻ Triết lý tâm niệm & Prudential', previewBg: 'linear-gradient(135deg, #E11D48, #BE123C)' },
  { id: 'letter-c13', labelVi: 'Hồng Tâm Niệm', labelEn: 'Magenta Pink', hex: '#DB2777', darkHex: '#F472B6', sourceVi: 'Thẻ Trích dẫn & Garena', previewBg: 'linear-gradient(135deg, #DB2777, #EC4899)' },
  { id: 'letter-c14', labelVi: 'Tím Lan Số Hóa', labelEn: 'Orchid Fuchsia', hex: '#C026D3', darkHex: '#E879F9', sourceVi: 'Cột mốc MoMo & Cầu sắc Tím-Hồng', previewBg: 'linear-gradient(135deg, #C026D3, #9333EA)' },
];

export const LETTER_14_LIGHT_HEXES: string[] = LETTER_14_COLOR_PALETTE.map((c) => c.hex);
export const LETTER_14_DARK_HEXES: string[] = LETTER_14_COLOR_PALETTE.map((c) => c.darkHex);

export const LETTER_14_PALETTE_THEME_STYLES: CardStyleMode[] = [
  'liquid-glass',
  'dark-liquid-glass',
  'flat-soft-ui',
  'dark-flat-soft-ui',
  'color-flat-soft-ui',
  'mica-fluent',
];

export interface FlatColorToken {
  id: string;
  label: string;
  hex: string;
  tailwindClass: string;
  group: 'surface' | 'studio' | 'module';
}

/**
 * Bảng 20 mã màu chính thức cho Giao Diện Phẳng Màu (color-flat-soft-ui)
 */
export const FLAT_COLOR_SYSTEM_PALETTE: FlatColorToken[] = [
  { id: 'flat-dark-canvas', label: 'Dark Canvas Base', hex: '#090D16', tailwindClass: 'bg-[#090d16]', group: 'surface' },
  { id: 'flat-light-canvas', label: 'Light Canvas Base', hex: '#F4F7FB', tailwindClass: 'bg-[#f4f7fb]', group: 'surface' },
  { id: 'flat-card-glass-dark', label: 'Card Glass Dark', hex: '#111827', tailwindClass: 'bg-gray-900/90', group: 'surface' },
  { id: 'flat-subcard-overlay', label: 'Sub-Card Overlay', hex: '#0000004D', tailwindClass: 'bg-black/30', group: 'surface' },
  { id: 'flat-studio-violet', label: 'Studio Violet', hex: '#8B5CF6', tailwindClass: 'bg-violet-500', group: 'studio' },
  { id: 'flat-cyber-indigo', label: 'Cyber Indigo', hex: '#4F46E5', tailwindClass: 'bg-indigo-600', group: 'studio' },
  { id: 'flat-electric-cyan', label: 'Electric Cyan', hex: '#06B6D4', tailwindClass: 'bg-cyan-500', group: 'studio' },
  { id: 'flat-emerald-success', label: 'Emerald Success', hex: '#10B981', tailwindClass: 'bg-emerald-500', group: 'studio' },
  { id: 'flat-m01-sdp-gold', label: '01 · SDP Gold', hex: '#FFDF25', tailwindClass: 'text-[#FFDF25]', group: 'module' },
  { id: 'flat-m02-erp-teal', label: '02 · ERP Teal', hex: '#5DC3C8', tailwindClass: 'text-[#5DC3C8]', group: 'module' },
  { id: 'flat-m03-crm-rose', label: '03 · CRM Rose', hex: '#E64C72', tailwindClass: 'text-[#E64C72]', group: 'module' },
  { id: 'flat-m04-hrm-azure', label: '04 · HRM Azure', hex: '#1480C0', tailwindClass: 'text-[#1480C0]', group: 'module' },
  { id: 'flat-m05-bpm-coral', label: '05 · BPM Coral', hex: '#F05A36', tailwindClass: 'text-[#F05A36]', group: 'module' },
  { id: 'flat-m06-okr-lime', label: '06 · OKR Lime', hex: '#A3D43A', tailwindClass: 'text-[#A3D43A]', group: 'module' },
  { id: 'flat-m07-clp-emerald', label: '07 · CLP Emerald', hex: '#0D9488', tailwindClass: 'text-[#0D9488]', group: 'module' },
  { id: 'flat-m08-lms-cobalt', label: '08 · LMS Cobalt', hex: '#2563EB', tailwindClass: 'text-[#2563EB]', group: 'module' },
  { id: 'flat-m09-csc-amber', label: '09 · CSC Amber', hex: '#EC7D21', tailwindClass: 'text-[#EC7D21]', group: 'module' },
  { id: 'flat-m10-bi-lavender', label: '10 · BI Lavender', hex: '#A78BFA', tailwindClass: 'text-[#A78BFA]', group: 'module' },
  { id: 'flat-m11-ai-iris', label: '11 · AI Iris', hex: '#6353B5', tailwindClass: 'text-[#6353B5]', group: 'module' },
  { id: 'flat-m12-pos-sky', label: '12 · POS Sky', hex: '#3BB8E6', tailwindClass: 'text-[#3BB8E6]', group: 'module' },
];

export const FLAT_COLOR_SWATCH_HEXES: string[] = FLAT_COLOR_SYSTEM_PALETTE.filter(
  (c) => c.group !== 'surface'
).map((c) => c.hex);

export const INTERFACE_PRIMARY_COLOR_PRESETS: InterfaceColorPreset[] = LETTER_14_COLOR_PALETTE.map(
  ({ id, labelVi, labelEn, hex, previewBg }) => ({
    id,
    labelVi,
    labelEn,
    hex,
    previewBg,
  })
);

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
    surfaceColorHex: '#F8F6FB',
    surfaceColorNameVi: 'Kính trắng ngọc trai',
    surfaceColorNameEn: 'Pearl Glass Tint',
    primaryColorHex: '#7E22CE',
    primaryColorNameVi: '14 Sắc Màu Thư Ngỏ (Tím Năng Lực)',
    primaryColorNameEn: '14-Color Letter Spectrum (Amethyst)',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Nổi kính phản quang',
    cardEffectKindEn: 'Optical Glass Sheen',
    cardEffectDescVi: 'Nổi nhẹ mặt kính kèm dải 14 sắc màu Thư ngỏ phản quang tinh tế',
    cardEffectDescEn: 'Lifted translucent glass with subtle 14-hue Open Letter optical sheen',
  },
  'dark-liquid-glass': {
    surfaceColorHex: '#1A263E',
    surfaceColorNameVi: 'Kính xanh đêm sâu',
    surfaceColorNameEn: 'Deep Slate Glass',
    primaryColorHex: '#C084FC',
    primaryColorNameVi: '14 Sắc Màu Thư Ngỏ (Tím Đêm Sáng)',
    primaryColorNameEn: '14-Color Letter Spectrum (Night Amethyst)',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Nổi kính phản quang',
    cardEffectKindEn: 'Night Glass Sheen',
    cardEffectDescVi: 'Phản quang ánh kính dịu mắt cùng dải 14 sắc màu Thư ngỏ nổi bật',
    cardEffectDescEn: 'Soft specular sweep across dark translucent glass with 14-hue highlights',
  },
  'glassmorphism': {
    surfaceColorHex: '#1A2040',
    surfaceColorNameVi: 'Kính mờ bán trong suốt (12%)',
    surfaceColorNameEn: 'Frosted Translucent Glass (12%)',
    primaryColorHex: '#38BDF8',
    primaryColorNameVi: 'Lam Aurora sáng',
    primaryColorNameEn: 'Aurora Cyan',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Nổi kính mờ viền trắng 1px',
    cardEffectKindEn: 'Floating Frosted Glass Depth',
    cardEffectDescVi: 'Tấm kính mờ 16px viền trắng 1px nổi trên nền đa sắc xuyên thấu với bóng rộng mềm',
    cardEffectDescEn: '16px frosted translucent panels with 1px white borders and wide layered floating shadows',
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
  'neumorphism-soft-ui': {
    surfaceColorHex: '#E0E5EC',
    surfaceColorNameVi: 'Xám xanh lì Soft UI',
    surfaceColorNameEn: 'Matte Soft Grey-Blue',
    primaryColorHex: '#4F46E5',
    primaryColorNameVi: 'Chàm bão hòa',
    primaryColorNameEn: 'Saturated Indigo',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Đùn nổi & lún chìm không viền',
    cardEffectKindEn: 'Borderless Raised & Inset',
    cardEffectDescVi: 'Bề mặt lì đồng màu nền, đùn nổi kép và lún chìm khi nhấn, không viền',
    cardEffectDescEn: 'Uniform matte surface with dual soft raised/inset shadows and zero borders',
  },
  'flat-soft-ui': {
    surfaceColorHex: '#FFFFFF',
    surfaceColorNameVi: 'Trắng mịn phẳng lì',
    surfaceColorNameEn: 'Crisp Matte White',
    primaryColorHex: '#4F46E5',
    primaryColorNameVi: '14 Sắc Màu Thư Ngỏ (Chàm Thư Ngỏ)',
    primaryColorNameEn: '14-Color Letter Spectrum (Indigo)',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Phẳng mịn thuần chất',
    cardEffectKindEn: 'Pure Flat Matte',
    cardEffectDescVi: 'Bề mặt phẳng mịn tinh khiết, phối viền nhấn theo bảng 14 sắc màu Thư ngỏ',
    cardEffectDescEn: 'Clean matte flat plane accented by the 14-color Open Letter palette',
  },
  'dark-flat-soft-ui': {
    surfaceColorHex: '#131B2A',
    surfaceColorNameVi: 'Xám đêm phẳng lì',
    surfaceColorNameEn: 'Obsidian Flat Matte',
    primaryColorHex: '#818CF8',
    primaryColorNameVi: '14 Sắc Màu Thư Ngỏ (Chàm Sáng)',
    primaryColorNameEn: '14-Color Letter Spectrum (Luminous Indigo)',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Phẳng tối êm dịu',
    cardEffectKindEn: 'Dark Flat Matte',
    cardEffectDescVi: 'Bề mặt phẳng tối mịn chống chói, tương phản sắc nét cùng bảng 14 màu Thư ngỏ',
    cardEffectDescEn: 'Smooth low-glare dark flat plane with 14-hue Open Letter accents',
  },
  'color-flat-soft-ui': {
    surfaceColorHex: '#111827',
    surfaceColorNameVi: 'Card Glass Dark (#111827) · Canvas #090D16',
    surfaceColorNameEn: 'Card Glass Dark (#111827) · Base #090D16',
    primaryColorHex: '#8B5CF6',
    primaryColorNameVi: 'Studio Violet & 12 Mã Màu Module',
    primaryColorNameEn: 'Studio Violet & 12-Module Spectrum',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Phẳng màu phân mã 12 module',
    cardEffectKindEn: '12-Module Flat Color Coded',
    cardEffectDescVi: 'Bề mặt phẳng tối #111827 với sub-card phủ #0000004D và dải 12 sắc màu SDP → POS',
    cardEffectDescEn: 'Crisp matte #111827 cards with #0000004D sub-card overlays and 12 enterprise accent hues',
  },
  'flat-ui': {
    surfaceColorHex: '#FFFFFF',
    surfaceColorNameVi: 'Trắng Thuần (#FFFFFF) · Khối #F3F4F6',
    surfaceColorNameEn: 'Pure White (#FFFFFF) · Muted #F3F4F6',
    primaryColorHex: '#3B82F6',
    primaryColorNameVi: 'Xanh Hành Động (#3B82F6) · #10B981 · #F59E0B',
    primaryColorNameEn: 'Action Blue (#3B82F6) · Emerald · Amber',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Khối màu phẳng · Phóng 1.02x không bóng',
    cardEffectKindEn: 'Color-Block Flat · 1.02x Scale, Zero Shadow',
    cardEffectDescVi: 'Bề mặt phẳng tuyệt đối không bóng đổ, không blur, không gradient, phản hồi đổi sắc & scale mượt 200ms',
    cardEffectDescEn: 'Zero shadows, zero blur, zero gradients — bold solid color blocks with crisp 200ms scale & tint shifts',
  },
  'nexus-bento': {
    surfaceColorHex: '#111827',
    surfaceColorNameVi: 'Kính Mờ #111827 · Nền Lưới Chấm #090D16',
    surfaceColorNameEn: 'Frosted #111827 · #090D16 Dot-Grid Canvas',
    primaryColorHex: '#8B5CF6',
    primaryColorNameVi: 'Tím #8B5CF6 · Xanh Trời #38BDF8 · Hồng #EC4899',
    primaryColorNameEn: 'Violet #8B5CF6 · Sky #38BDF8 · Pink #EC4899',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Bento 3D Nâng -6px · Phóng 1.012x & Phát Sáng Viền',
    cardEffectKindEn: '3D Bento Lift (-6px · 1.012x) & Subtle Glow Rim',
    cardEffectDescVi: 'BentoCard bo 12px, viền trắng mờ 1px, đổ bóng chiều sâu 3D trên nền chấm bi 24px cùng 3 quầng sáng radial',
    cardEffectDescEn: '12px BentoCards with 1px frosted border and 3D depth over a 24px dot-grid canvas with 3 radial ambient glows',
  },
  'light-nexus-bento': {
    surfaceColorHex: '#FFFFFF',
    surfaceColorNameVi: 'Bento Sáng #FFFFFF · Nền Lưới Chấm #F4F7FB',
    surfaceColorNameEn: 'Crisp Bento #FFFFFF · #F4F7FB Dot-Grid Canvas',
    primaryColorHex: '#7C3AED',
    primaryColorNameVi: 'Tím #7C3AED · Xanh Trời #0284C7 · Hồng #DB2777',
    primaryColorNameEn: 'Violet #7C3AED · Sky #0284C7 · Pink #DB2777',
    defaultCardEffect: 'float',
    cardEffectKindVi: 'Bento Sáng 3D Nâng -6px · Phóng 1.012x',
    cardEffectKindEn: 'Light 3D Bento Lift (-6px · 1.012x)',
    cardEffectDescVi: 'Phiên bản sáng của Nexus Bento trên nền #F4F7FB lưới chấm bi 24px, giữ nguyên hiệu ứng nâng -6px & phát sáng viền',
    cardEffectDescEn: 'Light Mode counterpart of Nexus Bento on a #F4F7FB 24px dot-grid canvas with -6px hover lift and violet/sky rim glow',
  },
  'mica-fluent': {
    surfaceColorHex: '#F3EEF6',
    surfaceColorNameVi: 'Mica 14 sắc màu bán trong suốt',
    surfaceColorNameEn: '14-Hue Layered Mica',
    primaryColorHex: '#DB2777',
    primaryColorNameVi: 'Bảng 14 Sắc Màu Thư Ngỏ',
    primaryColorNameEn: '14-Hue Open Letter Spectrum',
    defaultCardEffect: 'tilt',
    cardEffectKindVi: 'Nổi phối cảnh Fluent',
    cardEffectKindEn: 'Fluent 3D Lift',
    cardEffectDescVi: 'Kính mờ phân lớp kết hợp trọn vẹn 14 sắc màu chuyển sắc từ Trang Thư Ngỏ',
    cardEffectDescEn: 'Layered translucent Mica illuminated by the 14-hue Open Letter palette',
  },
  'iridescent-liquid-glass': {
    surfaceColorHex: '#F4F8FF',
    surfaceColorNameVi: 'Kính trắng sữa ánh xà cừ',
    surfaceColorNameEn: 'Pearl Iridescent Glass',
    primaryColorHex: '#06B6D4',
    primaryColorNameVi: 'Xanh Cyan & Chrome Cầu Vồng',
    primaryColorNameEn: 'Aurora Cyan & Prism Chrome',
    defaultCardEffect: 'shine',
    cardEffectKindVi: 'Kính lỏng khúc xạ ánh xà cừ',
    cardEffectKindEn: 'Iridescent Liquid Refraction',
    cardEffectDescVi: 'Bề mặt Glossy bóng kính, viền Chrome cầu vồng và khúc xạ ánh sáng 3D',
    cardEffectDescEn: 'Glossy liquid surface with rainbow chrome rims and optical light refraction',
  },
  'dark-iridescent-liquid-glass': {
    surfaceColorHex: '#0F172A',
    surfaceColorNameVi: 'Kính tối ánh xà cừ',
    surfaceColorNameEn: 'Midnight Iridescent Glass',
    primaryColorHex: '#22D3EE',
    primaryColorNameVi: 'Cyan Neon & Prism Chrome',
    primaryColorNameEn: 'Prism Cyan & Sunset Orange',
    defaultCardEffect: 'glow',
    cardEffectKindVi: 'Kính tối phản xạ xà cừ',
    cardEffectKindEn: 'Dark Prism Chrome Glow',
    cardEffectDescVi: 'Thẻ kính tối bán trong suốt viền Chrome ánh cầu vồng và hào quang phản xạ',
    cardEffectDescEn: 'Translucent dark glossy glass with rainbow chrome bevels and specular glow',
  },
};
