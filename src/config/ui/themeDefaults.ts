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
  style === 'frost-ice-neu';

export const THEME_DEFAULT_GLASS_SETTINGS: Record<
  CardStyleMode,
  { cardOpacity: number; blurIntensity: number }
> = {
  'liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'dark-liquid-glass': { cardOpacity: 13, blurIntensity: 18 },
  'cowhide-leather': { cardOpacity: 100, blurIntensity: 0 },
  'walnut-wood': { cardOpacity: 100, blurIntensity: 0 },
  'deep-ocean': { cardOpacity: 84, blurIntensity: 20 },
  'neumorphism-beyond': { cardOpacity: 91, blurIntensity: 14 },
  'dark-neumorphism-beyond': { cardOpacity: 92, blurIntensity: 14 },
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
    presetId: 'custom-wp-1788112774646',
    label: 'Nền Kính Lỏng Trong Suốt',
    themeMode: 'light',
    imagePath: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    fallbackGradient:
      'radial-gradient(ellipse 68% 58% at 12% 14%, rgba(245, 221, 224, 0.90) 0px, transparent 58%), radial-gradient(ellipse 64% 56% at 88% 16%, rgba(169, 230, 231, 0.72) 0px, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 48%, rgba(207, 197, 233, 0.68) 0px, transparent 60%), radial-gradient(ellipse 66% 54% at 82% 86%, rgba(174, 191, 206, 0.65) 0px, transparent 56%), linear-gradient(135deg, #F8F6F7 0%, #F1E7E5 44%, #ECE7F6 74%, #E6F3F6 100%)',
    overlayBg: 'rgba(248, 246, 247, 0.08)',
  },
  'dark-liquid-glass': {
    id: 'dark-liquid-glass',
    presetId: 'theme-bg-dark-liquid-glass',
    label: 'Nền Kính Lỏng Bóng Đêm',
    themeMode: 'dark',
    imagePath: darkRainbowGlassWallpaper,
    fallbackGradient:
      'radial-gradient(ellipse 66% 56% at 14% 16%, rgba(152, 137, 238, 0.24) 0px, transparent 56%), radial-gradient(ellipse 64% 54% at 86% 14%, rgba(103, 232, 249, 0.16) 0px, transparent 52%), radial-gradient(ellipse 62% 56% at 76% 84%, rgba(181, 167, 244, 0.18) 0px, transparent 54%), linear-gradient(140deg, #101A2B 0%, #171F33 52%, #131B2E 100%)',
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
    label: 'Nền Khối Mềm Sáng Mịn',
    themeMode: 'light',
    imagePath: neumorphismBeyondWallpaper,
    fallbackGradient: 'linear-gradient(145deg, #EAEFF6 0%, #E6ECF4 55%, #DFE6F0 100%)',
    overlayBg: 'transparent',
  },
  'dark-neumorphism-beyond': {
    id: 'dark-neumorphism-beyond',
    presetId: 'theme-bg-dark-neumorphism-beyond',
    label: 'Nền Khối Mềm Đêm Tối',
    themeMode: 'dark',
    imagePath: darkNeumorphismBeyondWallpaper,
    fallbackGradient: 'linear-gradient(145deg, #171E2B 0%, #141A25 55%, #111620 100%)',
    overlayBg: 'rgba(15, 20, 30, 0.18)',
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
      'radial-gradient(circle at 18% 16%, rgba(232, 65, 24, 0.22) 0%, transparent 48%), radial-gradient(circle at 82% 20%, rgba(217, 179, 130, 0.42) 0%, transparent 52%), radial-gradient(circle at 52% 84%, rgba(82, 90, 101, 0.30) 0%, transparent 54%), linear-gradient(145deg, #d7c7b5 0%, #b8a391 48%, #736358 100%)',
    overlayBg: 'radial-gradient(circle at center, rgba(15, 10, 8, 0.18) 0%, rgba(15, 10, 8, 0.42) 100%)',
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
  'liquid-glass': 'custom-wp-1788112774646',
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
  'flat-soft-ui': {
    surfaceColorHex: '#FFFFFF',
    surfaceColorNameVi: 'Trắng mịn phẳng lì',
    surfaceColorNameEn: 'Crisp Matte White',
    primaryColorHex: '#4F46E5',
    primaryColorNameVi: 'Chàm Studio',
    primaryColorNameEn: 'Studio Indigo',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Phẳng mịn thuần chất',
    cardEffectKindEn: 'Pure Flat Matte',
    cardEffectDescVi: 'Bề mặt phẳng mịn tinh khiết, không đổ bóng gắt hay nổi khối thừa',
    cardEffectDescEn: 'Clean matte flat plane with crisp border hierarchy and zero heavy shadow',
  },
  'dark-flat-soft-ui': {
    surfaceColorHex: '#131B2A',
    surfaceColorNameVi: 'Xám đêm phẳng lì',
    surfaceColorNameEn: 'Obsidian Flat Matte',
    primaryColorHex: '#6366F1',
    primaryColorNameVi: 'Chàm đêm dịu',
    primaryColorNameEn: 'Soft Indigo',
    defaultCardEffect: 'static',
    cardEffectKindVi: 'Phẳng tối êm dịu',
    cardEffectKindEn: 'Dark Flat Matte',
    cardEffectDescVi: 'Bề mặt phẳng tối mịn chống chói, tương phản chữ sắc nét dễ đọc',
    cardEffectDescEn: 'Smooth low-glare dark flat plane with crisp editorial legibility',
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
