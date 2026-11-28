import { CardEffectMode, CardStyleMode, SurfaceDepthMode, ThemeMechanismMode, WaveMotionMode } from './theme.types';
import wpLiquidGlass from '@/assets/images/wp_liquid_glass_1795447886339.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import neumorphismBeyondWallpaper from '@/assets/images/neumorphism_beyond_wallpaper_1795201986751.jpg';
import darkNeumorphismBeyondWallpaper from '@/assets/images/dark_neumorphism_beyond_wallpaper_1795344399348.jpg';
import multicolorGlassWallpaper from '@/assets/images/multicolor_glass_wallpaper_1795250561824.jpg';
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
  'cowhide-leather': 'depth',
  'walnut-wood': 'depth',
  'deep-ocean': 'depth',
  'neumorphism-beyond': 'depth',
  'dark-neumorphism-beyond': 'depth',
  'frost-ice-neu': 'depth',
  'flat-soft-ui': 'flat',
  'dark-flat-soft-ui': 'flat',
  'mica-fluent': 'depth',
  'gradient-dopamine': 'depth',
  'iridescent-liquid-glass': 'depth',
  'dark-iridescent-liquid-glass': 'depth',
};

export const getThemeNativeSurfaceDepth = (style: CardStyleMode): SurfaceDepthMode =>
  THEME_NATIVE_SURFACE_DEPTH[style] ?? 'depth';

export const isNeumorphismCardStyle = (style: CardStyleMode): boolean =>
  style === 'neumorphism-beyond' || style === 'dark-neumorphism-beyond';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'dark-liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'walnut-wood': { cardOpacity: 100, blurIntensity: 0 },
  'deep-ocean': { cardOpacity: 84, blurIntensity: 20 },
  'neumorphism-beyond': { cardOpacity: 100, blurIntensity: 0 },
  'dark-neumorphism-beyond': { cardOpacity: 100, blurIntensity: 0 },
  'frost-ice-neu': { cardOpacity: 100, blurIntensity: 0 },
  'flat-soft-ui': { cardOpacity: 98, blurIntensity: 0 },
  'dark-flat-soft-ui': { cardOpacity: 96, blurIntensity: 0 },
  'mica-fluent': { cardOpacity: 30, blurIntensity: 20 },
  'gradient-dopamine': { cardOpacity: 82, blurIntensity: 18 },
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
  'neumorphism-beyond': {
    id: 'neumorphism-beyond',
    presetId: 'theme-bg-neumorphism-beyond',
    label: 'Nền Lì Nổi Khối Soft UI Sáng',
    themeMode: 'light',
    imagePath: '',
    fallbackGradient: '#E0E5EC',
    overlayBg: 'transparent',
  },
  'dark-neumorphism-beyond': {
    id: 'dark-neumorphism-beyond',
    presetId: 'theme-bg-dark-neumorphism-beyond',
    label: 'Nền Lì Nổi Khối Soft UI Tối',
    themeMode: 'dark',
    imagePath: '',
    fallbackGradient: '#1E242E',
    overlayBg: 'transparent',
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
  'gradient-dopamine': {
    id: 'gradient-dopamine',
    presetId: 'theme-bg-gradient-dopamine',
    label: 'Nền Sắc Màu Rực Rỡ',
    themeMode: 'color',
    imagePath: multicolorGlassWallpaper,
    fallbackGradient:
      'radial-gradient(circle at 12% 16%, rgba(255, 46, 147, 0.48) 0%, transparent 50%), radial-gradient(circle at 88% 18%, rgba(0, 210, 255, 0.46) 0%, transparent 48%), radial-gradient(circle at 80% 84%, rgba(255, 107, 0, 0.42) 0%, transparent 52%), radial-gradient(circle at 18% 82%, rgba(124, 58, 237, 0.44) 0%, transparent 50%), linear-gradient(135deg, #FFF0F7 0%, #F3E8FF 38%, #E0F7FF 72%, #FFF5EB 100%)',
    overlayBg: 'rgba(255, 255, 255, 0.05)',
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
  'cowhide-leather': THEME_BACKGROUNDS['cowhide-leather'].presetId,
  'walnut-wood': THEME_BACKGROUNDS['walnut-wood'].presetId,
  'deep-ocean': THEME_BACKGROUNDS['deep-ocean'].presetId,
  'neumorphism-beyond': THEME_BACKGROUNDS['neumorphism-beyond'].presetId,
  'dark-neumorphism-beyond': THEME_BACKGROUNDS['dark-neumorphism-beyond'].presetId,
  'frost-ice-neu': THEME_BACKGROUNDS['frost-ice-neu'].presetId,
  'flat-soft-ui': THEME_BACKGROUNDS['flat-soft-ui'].presetId,
  'dark-flat-soft-ui': THEME_BACKGROUNDS['dark-flat-soft-ui'].presetId,
  'mica-fluent': 'img-wp-18',
  'gradient-dopamine': THEME_BACKGROUNDS['gradient-dopamine'].presetId,
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
 * Ứng dụng đồng bộ cho 4 nhóm giao diện:
 *   1. Kính Lỏng Mềm Mại (liquid-glass / dark-liquid-glass)
 *   2. Nổi Khối Kính Mờ (neumorphism-beyond / dark-neumorphism-beyond)
 *   3. Giao Diện Phẳng Mềm (flat-soft-ui / dark-flat-soft-ui)
 *   4. Kính Mờ Phân Lớp (mica-fluent)
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
  'neumorphism-beyond',
  'dark-neumorphism-beyond',
  'flat-soft-ui',
  'dark-flat-soft-ui',
  'mica-fluent',
];

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
  'neumorphism-beyond': {
    surfaceColorHex: '#E0E5EC',
    surfaceColorNameVi: 'Xám xanh lì Soft UI',
    surfaceColorNameEn: 'Matte Soft UI Slate',
    primaryColorHex: '#2563EB',
    primaryColorNameVi: '14 Sắc Màu Thư Ngỏ (Xanh Quy Trình)',
    primaryColorNameEn: '14-Color Letter Spectrum (Royal Blue)',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Nổi khối & nhấn lún không viền',
    cardEffectKindEn: 'Borderless Dual-Shadow Soft UI',
    cardEffectDescVi: 'Một bề mặt lì đồng nhất #E0E5EC không viền, đổ bóng kép sáng–tối và nhấn lún mềm chuẩn Neumorphism',
    cardEffectDescEn: 'One continuous matte #E0E5EC surface with dual soft shadows, inset press states, and zero borders',
  },
  'dark-neumorphism-beyond': {
    surfaceColorHex: '#1E242E',
    surfaceColorNameVi: 'Than xanh lì Soft UI',
    surfaceColorNameEn: 'Dark Soft UI Slate',
    primaryColorHex: '#60A5FA',
    primaryColorNameVi: '14 Sắc Màu Thư Ngỏ (Xanh Đêm)',
    primaryColorNameEn: '14-Color Letter Spectrum (Sky Glow)',
    defaultCardEffect: 'inset',
    cardEffectKindVi: 'Nổi khối & nhấn lún tối không viền',
    cardEffectKindEn: 'Dark Borderless Dual-Shadow Soft UI',
    cardEffectDescVi: 'Bề mặt than lì đồng nhất #1E242E không viền, bóng kép góc chéo và trạng thái nhấn lõm dịu mắt',
    cardEffectDescEn: 'One continuous matte #1E242E dark surface with dual soft shadows, inset press states, and zero borders',
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
