import React from 'react';
import { toOptimizedWebPUrl } from '@/utils/imageWebp';
import wpLiquidGlass from '@/assets/images/wp_liquid_glass_1795447886339.jpg';
import darkRainbowGlassWallpaper from '@/assets/images/wallpaper_dark_rainbow_glass_clean_1795175810945.jpg';
import deepOceanWallpaper from '@/assets/images/wallpaper_deep_ocean_1795175773255.jpg';
import walnutWoodWallpaper from '@/assets/images/walnut_wood_grain_bg_1795551578186.jpg';
import wpFlatSoftUi from '@/assets/images/wp_flat_soft_ui_1795447887016.jpg';
import wpDarkFlatSoftUi from '@/assets/images/wp_dark_flat_soft_ui_1795447886342.jpg';

export type WallpaperType = 'image' | 'video' | 'css' | 'gradient' | 'webgl';

export interface GravityWallpaperConfig {
  paletteId: 'autoMorph' | 'roseGold' | 'pinkBlush' | 'voltLime' | 'arcticBlue';
  morphOnPageChange: boolean;
  swatchColor: string;
  secondaryColor: string;
  previewSpheres: string[];
}

export interface WallpaperPreset {
  id: string;
  name: string;
  type: WallpaperType;
  value: string;
  bg?: string;
  previewStyle?: React.CSSProperties;
  gravityConfig?: GravityWallpaperConfig;
  isCustom?: boolean;
  createdAt?: number;
}

export interface ThemeBackground {
  light: string;
  dark: string;
}

export const THEME_BACKGROUND_CONFIGS: Record<string, ThemeBackground> = {
  'liquid-glass': {
    light: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    dark: darkRainbowGlassWallpaper,
  },
  'dark-liquid-glass': {
    light: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    dark: darkRainbowGlassWallpaper,
  },
  'glassmorphism': {
    light:
      'radial-gradient(ellipse 62% 56% at 14% 18%, rgba(6, 182, 212, 0.72) 0%, transparent 58%), radial-gradient(ellipse 58% 54% at 86% 20%, rgba(236, 72, 153, 0.68) 0%, transparent 56%), radial-gradient(ellipse 64% 58% at 50% 52%, rgba(99, 102, 241, 0.62) 0%, transparent 62%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(249, 115, 22, 0.54) 0%, transparent 56%), radial-gradient(ellipse 60% 56% at 16% 86%, rgba(139, 92, 246, 0.68) 0%, transparent 58%), linear-gradient(135deg, #0D102B 0%, #17143D 46%, #131B3A 100%)',
    dark:
      'radial-gradient(ellipse 62% 56% at 14% 18%, rgba(6, 182, 212, 0.72) 0%, transparent 58%), radial-gradient(ellipse 58% 54% at 86% 20%, rgba(236, 72, 153, 0.68) 0%, transparent 56%), radial-gradient(ellipse 64% 58% at 50% 52%, rgba(99, 102, 241, 0.62) 0%, transparent 62%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(249, 115, 22, 0.54) 0%, transparent 56%), radial-gradient(ellipse 60% 56% at 16% 86%, rgba(139, 92, 246, 0.68) 0%, transparent 58%), linear-gradient(135deg, #0D102B 0%, #17143D 46%, #131B3A 100%)',
  },
  'cowhide-leather': {
    light:
      'radial-gradient(circle at 22% 20%, rgba(180, 115, 58, 0.34) 0%, transparent 52%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%)',
    dark:
      'radial-gradient(circle at 22% 20%, rgba(180, 115, 58, 0.34) 0%, transparent 52%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%)',
  },
  'walnut-wood': {
    light: walnutWoodWallpaper,
    dark: walnutWoodWallpaper,
  },
  'deep-ocean': {
    light: deepOceanWallpaper,
    dark: deepOceanWallpaper,
  },
  'frost-ice-neu': {
    light:
      'radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 84%, rgba(196, 212, 232, 0.55) 0%, transparent 56%), linear-gradient(145deg, #E6EEF8 0%, #E0E8F2 52%, #D6E1EE 100%)',
    dark:
      'radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 84%, rgba(196, 212, 232, 0.55) 0%, transparent 56%), linear-gradient(145deg, #E6EEF8 0%, #E0E8F2 52%, #D6E1EE 100%)',
  },
  'neumorphism-soft-ui': {
    light: '#E0E5EC',
    dark: '#E0E5EC',
  },
  'flat-soft-ui': {
    light: wpFlatSoftUi,
    dark: wpDarkFlatSoftUi,
  },
  'dark-flat-soft-ui': {
    light: wpFlatSoftUi,
    dark: wpDarkFlatSoftUi,
  },
  'color-flat-soft-ui': {
    light:
      'radial-gradient(ellipse 56% 48% at 14% 16%, rgba(139, 92, 246, 0.22) 0%, transparent 56%), radial-gradient(ellipse 54% 48% at 86% 18%, rgba(6, 182, 212, 0.18) 0%, transparent 56%), radial-gradient(ellipse 52% 46% at 78% 84%, rgba(79, 70, 229, 0.18) 0%, transparent 54%), radial-gradient(ellipse 48% 44% at 18% 82%, rgba(16, 185, 129, 0.14) 0%, transparent 52%), linear-gradient(145deg, #090D16 0%, #0D1322 52%, #090D16 100%)',
    dark:
      'radial-gradient(ellipse 56% 48% at 14% 16%, rgba(139, 92, 246, 0.22) 0%, transparent 56%), radial-gradient(ellipse 54% 48% at 86% 18%, rgba(6, 182, 212, 0.18) 0%, transparent 56%), radial-gradient(ellipse 52% 46% at 78% 84%, rgba(79, 70, 229, 0.18) 0%, transparent 54%), radial-gradient(ellipse 48% 44% at 18% 82%, rgba(16, 185, 129, 0.14) 0%, transparent 52%), linear-gradient(145deg, #090D16 0%, #0D1322 52%, #090D16 100%)',
  },
  'flat-ui': {
    light: '#FFFFFF',
    dark: '#FFFFFF',
  },
  'nexus-bento': {
    light:
      'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.14) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.11) 0%, transparent 60%), linear-gradient(180deg, #F4F7FB 0%, #EEF3FA 100%)',
    dark:
      'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.24) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.20) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.18) 0%, transparent 60%), linear-gradient(180deg, #090D16 0%, #0B1120 100%)',
  },
  'light-nexus-bento': {
    light:
      'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.14) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.11) 0%, transparent 60%), linear-gradient(180deg, #F4F7FB 0%, #EEF3FA 100%)',
    dark:
      'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.24) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.20) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.18) 0%, transparent 60%), linear-gradient(180deg, #090D16 0%, #0B1120 100%)',
  },
  'mica-fluent': {
    light: 'https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg',
    dark: 'https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg',
  },
  'iridescent-liquid-glass': {
    light:
      'radial-gradient(ellipse 68% 58% at 14% 16%, rgba(56, 189, 248, 0.34) 0%, transparent 56%), radial-gradient(ellipse 64% 56% at 86% 18%, rgba(251, 146, 60, 0.28) 0%, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 56%, rgba(168, 85, 247, 0.24) 0%, transparent 58%), linear-gradient(135deg, #F6FAFF 0%, #EEF6FF 46%, #FDF2FA 76%, #FFF7ED 100%)',
    dark:
      'radial-gradient(ellipse 66% 56% at 16% 16%, rgba(34, 211, 238, 0.30) 0%, transparent 56%), radial-gradient(ellipse 60% 52% at 86% 18%, rgba(251, 146, 60, 0.22) 0%, transparent 52%), radial-gradient(ellipse 64% 58% at 72% 84%, rgba(168, 85, 247, 0.28) 0%, transparent 56%), linear-gradient(140deg, #070B16 0%, #0F172A 52%, #130F26 100%)',
  },
  'dark-iridescent-liquid-glass': {
    light:
      'radial-gradient(ellipse 68% 58% at 14% 16%, rgba(56, 189, 248, 0.34) 0%, transparent 56%), radial-gradient(ellipse 64% 56% at 86% 18%, rgba(251, 146, 60, 0.28) 0%, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 56%, rgba(168, 85, 247, 0.24) 0%, transparent 58%), linear-gradient(135deg, #F6FAFF 0%, #EEF6FF 46%, #FDF2FA 76%, #FFF7ED 100%)',
    dark:
      'radial-gradient(ellipse 66% 56% at 16% 16%, rgba(34, 211, 238, 0.30) 0%, transparent 56%), radial-gradient(ellipse 60% 52% at 86% 18%, rgba(251, 146, 60, 0.22) 0%, transparent 52%), radial-gradient(ellipse 64% 58% at 72% 84%, rgba(168, 85, 247, 0.28) 0%, transparent 56%), linear-gradient(140deg, #070B16 0%, #0F172A 52%, #130F26 100%)',
  },
};

export function getThemeBackgroundForMode(themeId: string, isDark: boolean): string {
  const direct = THEME_BACKGROUND_CONFIGS[themeId];
  if (direct) return isDark ? direct.dark : direct.light;
  const cleanId = themeId.replace('-dark', '');
  const config = THEME_BACKGROUND_CONFIGS[cleanId] || THEME_BACKGROUND_CONFIGS['liquid-glass'];
  return isDark ? config.dark : config.light;
}

export const CUSTOM_WALLPAPERS_STORAGE_KEY = 'hungthai_custom_wallpapers_v2';
export const ACTIVE_WALLPAPER_STORAGE_KEY = 'hungthai_active_wallpaper_v2';

/**
 * Chuyển đổi chuỗi CSS nhiều dòng (ví dụ: "background: ...; background-size: ...;")
 * sang đối tượng React.CSSProperties để render trực tiếp.
 */
export function parseCssStringToStyle(cssText: string): React.CSSProperties {
  if (!cssText || !cssText.trim()) return {};
  const trimmed = cssText.trim();

  // Nếu người dùng chỉ nhập giá trị gradient hoặc màu mà không có tên thuộc tính CSS
  if (!trimmed.includes(':')) {
    return { background: trimmed };
  }

  const style: Record<string, string> = {};
  // Tách theo dấu chấm phẩy nằm ngoài ngoặc đơn
  const declarations = trimmed
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/;(?![^(]*\))/)
    .map((decl) => decl.trim())
    .filter(Boolean);

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx === -1) continue;
    const rawProp = decl.slice(0, colonIdx).trim();
    const rawVal = decl
      .slice(colonIdx + 1)
      .replace(/\s+/g, ' ')
      .trim();
    if (!rawProp || !rawVal) continue;

    // Chuyển đổi kebab-case sang camelCase (ví dụ: background-image -> backgroundImage)
    const camelProp = rawProp.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    // Bỏ qua position/overflow để tránh phá vỡ khung nền cố định
    if (camelProp === 'position' || camelProp === 'overflow') continue;
    style[camelProp] = rawVal;
  }

  if (Object.keys(style).length === 0) {
    return { background: trimmed };
  }

  return style as React.CSSProperties;
}

/**
 * Kiểm tra một hình nền có thuộc dạng CodePen hoặc 3D · Qua trang (WebGL) đã gỡ bỏ hay không
 */
export function isCodePenWallpaper(wp?: Partial<WallpaperPreset> & { type?: string } | null): boolean {
  if (!wp) return false;
  const typeStr = String(wp.type || '').toLowerCase();
  const idStr = String(wp.id || '').toLowerCase();
  const nameStr = String(wp.name || '').toLowerCase();
  const valueStr = String(wp.value || '').toLowerCase();
  const bgStr = String(wp.bg || '').toLowerCase();
  return (
    typeStr === 'codepen' ||
    typeStr === 'webgl' ||
    idStr.startsWith('gravity-') ||
    idStr === 'webgl-dot-grid-waves' ||
    idStr.includes('codepen') ||
    nameStr.includes('codepen') ||
    valueStr.includes('codepen.io') ||
    bgStr.includes('codepen.io')
  );
}

/**
 * Trích xuất URL hình ảnh sạch từ chuỗi giá trị (xử lý trường hợp chuỗi có chứa url('...'))
 */
export function getCleanImageUrl(val: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  const match = trimmed.match(/url\(['"]?(.*?)['"]?\)/i);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Tự động tạo URL hình nền thu nhỏ (Thumbnail) tối ưu tải nhanh và vô cùng sắc nét.
 * Giữ nguyên vẹn 100% data link gốc của hình nền khi áp dụng.
 */
export function getWallpaperThumbnailUrl(val: string): string {
  const cleanUrl = getCleanImageUrl(val);
  if (!cleanUrl) return '';

  // Cloudinary image: chèn f_auto,q_auto,w_800,c_fill để tạo ảnh thumbnail cực kỳ sắc nét, rõ ràng
  if (cleanUrl.includes('res.cloudinary.com') && cleanUrl.includes('/upload/')) {
    return cleanUrl.replace('/upload/', '/upload/c_fill,w_800,h_500,f_auto,q_90/');
  }

  // Unsplash image: tối ưu w=800&h=500&fit=crop&fm=webp&q=90
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(cleanUrl);
      urlObj.searchParams.set('w', '800');
      urlObj.searchParams.set('h', '500');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', '90');
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fm', 'webp');
      return urlObj.toString();
    } catch {
      return cleanUrl;
    }
  }

  return toOptimizedWebPUrl(cleanUrl, { width: 800, quality: 86 });
}

/**
 * Danh sách toàn bộ hình nền được phân tích và trích xuất nguyên bản 100% từ file JSON của người dùng
 */
export const WALLPAPER_PRESETS_LIST: WallpaperPreset[] = [
  {
    id: 'wallpaper-liquid-glass-flowers',
    name: '✨ Kính Lỏng Trong Suốt (Quang học)',
    type: 'image',
    value: wpLiquidGlass,
    bg: `url('${wpLiquidGlass}') center/cover no-repeat`,
    previewStyle: {
      backgroundImage: `url('${wpLiquidGlass}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1795393000000,
  },
  {
    id: 'wallpaper-official-gemini',
    name: '🌟 Hình nền chính thức (Vũ trụ Glass UI)',
    type: 'image',
    value: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png',
    bg: "url('https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794035600000,
  },
  {
    id: 'css-prism-wave-flow',
    name: 'Sóng Sắc Cầu Vồng',
    type: 'css',
    value:
      'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
    bg: 'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
    previewStyle: {
      background:
        'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
      backgroundSize: '400% 400%',
    },
    isCustom: false,
    createdAt: 1795400000000,
  },
  {
    id: 'css-sky-rising-bubbles',
    name: 'Bong Bóng Bầu Trời',
    type: 'css',
    value: 'linear-gradient(180deg, #29b6f6 0%, #38bdf8 55%, #0284c7 100%)',
    bg: 'linear-gradient(180deg, #29b6f6 0%, #38bdf8 55%, #0284c7 100%)',
    previewStyle: {
      background: 'linear-gradient(180deg, #29b6f6 0%, #38bdf8 55%, #0284c7 100%)',
    },
    isCustom: false,
    createdAt: 1795400000001,
  },
  {
    id: 'css-cosmic-bokeh-beams',
    name: 'Vũ Trụ Bokeh Ánh Sáng',
    type: 'css',
    value:
      'radial-gradient(circle at 25% 20%, rgba(0, 150, 240, 0.72) 0%, rgba(40, 20, 105, 0.58) 45%, #090d00 100%)',
    bg: 'radial-gradient(circle at 25% 20%, rgba(0, 150, 240, 0.72) 0%, rgba(40, 20, 105, 0.58) 45%, #090d00 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 25% 20%, rgba(0, 150, 240, 0.72) 0%, rgba(40, 20, 105, 0.58) 45%, #090d00 100%)',
    },
    isCustom: false,
    createdAt: 1795400000002,
  },
  {
    id: 'css-interactive-liquid-blobs',
    name: 'Chuyển Sắc Tương Tác',
    type: 'css',
    value:
      'radial-gradient(circle at 30% 30%, rgba(104, 109, 224, 0.48) 0%, transparent 55%), radial-gradient(circle at 75% 65%, rgba(255, 121, 121, 0.42) 0%, transparent 55%), linear-gradient(40deg, #dff9fb, #ffffff)',
    bg: 'linear-gradient(40deg, #dff9fb, #ffffff)',
    previewStyle: {
      background:
        'radial-gradient(circle at 30% 30%, rgba(104, 109, 224, 0.48) 0%, transparent 55%), radial-gradient(circle at 75% 65%, rgba(255, 121, 121, 0.42) 0%, transparent 55%), linear-gradient(40deg, #dff9fb, #ffffff)',
    },
    isCustom: false,
    createdAt: 1795400000003,
  },
  {
    id: 'css-mountain-cloud-layers',
    name: 'Núi Mây Hoàng Hôn',
    type: 'css',
    value: 'linear-gradient(135deg, #61b2d8 0%, #9fc3eb 48%, #f9a4f2 100%)',
    bg: 'linear-gradient(135deg, #61b2d8 0%, #9fc3eb 48%, #f9a4f2 100%)',
    previewStyle: {
      background: 'linear-gradient(135deg, #61b2d8 0%, #9fc3eb 48%, #f9a4f2 100%)',
    },
    isCustom: false,
    createdAt: 1795400000004,
  },
  {
    id: 'css-pastel-hsl-particles',
    name: 'Hạt Sáng Đa Sắc',
    type: 'css',
    value: 'linear-gradient(145deg, #ecf3f3 0%, #e2eef2 100%)',
    bg: '#ecf3f3',
    previewStyle: {
      background: 'linear-gradient(145deg, #ecf3f3 0%, #e2eef2 100%)',
    },
    isCustom: false,
    createdAt: 1795400000005,
  },
  {
    id: 'css-teal-violet-aurora',
    name: 'Cực Quang Ngọc Tím',
    type: 'css',
    value: 'linear-gradient(253deg, #0cc898, #1797d2, #864fe1)',
    bg: 'linear-gradient(253deg, #0cc898, #1797d2, #864fe1)',
    previewStyle: {
      background: 'linear-gradient(253deg, #0cc898, #1797d2, #864fe1)',
      backgroundSize: '300% 300%',
    },
    isCustom: false,
    createdAt: 1795400000006,
  },
  {
    id: 'css-cyan-xo-motion',
    name: 'Họa Tiết X & O',
    type: 'css',
    value: 'linear-gradient(145deg, #04bbd3 0%, #06a3ba 100%)',
    bg: '#04bbd3',
    previewStyle: {
      background: 'linear-gradient(145deg, #04bbd3 0%, #06a3ba 100%)',
    },
    isCustom: false,
    createdAt: 1795400000007,
  },
  {
    id: 'css-confetti-floating-balls',
    name: 'Quả Cầu Sắc Màu',
    type: 'css',
    value: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 55%, #f0f9ff 100%)',
    bg: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 55%, #f0f9ff 100%)',
    previewStyle: {
      background: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 55%, #f0f9ff 100%)',
    },
    isCustom: false,
    createdAt: 1795400000008,
  },
  {
    id: 'theme-bg-cowhide-leather',
    name: '💼 Nền Da Bò Thủ Công (Giao diện riêng)',
    type: 'css',
    value:
      'background: radial-gradient(circle at 22% 20%, rgba(180, 115, 58, 0.34) 0%, transparent 52%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%);',
    bg: 'radial-gradient(circle at 22% 20%, rgba(180, 115, 58, 0.34) 0%, transparent 52%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 22% 20%, rgba(180, 115, 58, 0.34) 0%, transparent 52%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%)',
    },
    isCustom: false,
    createdAt: 1794300000005,
  },
  {
    id: 'theme-bg-walnut-wood',
    name: '🪵 Nền Gỗ Óc Chó Trầm (Giao diện riêng)',
    type: 'image',
    value: walnutWoodWallpaper,
    bg: `url('${walnutWoodWallpaper}') center/cover no-repeat`,
    previewStyle: {
      background:
        'radial-gradient(circle at 22% 20%, rgba(245, 196, 120, 0.16) 0%, transparent 52%), linear-gradient(145deg, #3A2214 0%, #160D08 55%, #24150C 100%)',
      backgroundImage: `url('${walnutWoodWallpaper}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000006,
  },
  {
    id: 'theme-bg-mica-fluent',
    name: '🪟 Nền Kính Mờ Hiện Đại (Giao diện riêng)',
    type: 'image',
    value: 'https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg',
    bg: "url('https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg') center/cover no-repeat",
    previewStyle: {
      background:
        'radial-gradient(circle at 18% 16%, rgba(232, 65, 24, 0.22) 0%, transparent 50%), linear-gradient(145deg, #d7c7b5 0%, #9b897a 55%, #5c4e44 100%)',
      backgroundImage: "url('https://assets.codepen.io/4927073/AdobeStock_78589840.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000007,
  },
  {
    id: 'theme-bg-iridescent-liquid-glass',
    name: '✨ Nền Xà Cừ Ánh Sáng (Giao diện riêng)',
    type: 'gradient',
    value:
      'radial-gradient(ellipse 68% 58% at 14% 16%, rgba(56, 189, 248, 0.34) 0%, transparent 56%), radial-gradient(ellipse 64% 56% at 86% 18%, rgba(251, 146, 60, 0.28) 0%, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 56%, rgba(168, 85, 247, 0.24) 0%, transparent 58%), radial-gradient(ellipse 60% 54% at 80% 86%, rgba(244, 114, 182, 0.24) 0%, transparent 54%), linear-gradient(135deg, #F6FAFF 0%, #EEF6FF 46%, #FDF2FA 76%, #FFF7ED 100%)',
    bg: 'radial-gradient(ellipse 68% 58% at 14% 16%, rgba(56, 189, 248, 0.34) 0%, transparent 56%), radial-gradient(ellipse 64% 56% at 86% 18%, rgba(251, 146, 60, 0.28) 0%, transparent 54%), radial-gradient(ellipse 62% 58% at 50% 56%, rgba(168, 85, 247, 0.24) 0%, transparent 58%), radial-gradient(ellipse 60% 54% at 80% 86%, rgba(244, 114, 182, 0.24) 0%, transparent 54%), linear-gradient(135deg, #F6FAFF 0%, #EEF6FF 46%, #FDF2FA 76%, #FFF7ED 100%)',
    previewStyle: {
      background:
        'radial-gradient(ellipse 68% 58% at 14% 16%, rgba(56, 189, 248, 0.42) 0%, transparent 56%), radial-gradient(ellipse 64% 56% at 86% 18%, rgba(251, 146, 60, 0.36) 0%, transparent 54%), linear-gradient(135deg, #F6FAFF 0%, #EEF6FF 50%, #FDF2FA 100%)',
    },
    isCustom: false,
    createdAt: 1794300000012,
  },
  {
    id: 'theme-bg-dark-iridescent-liquid-glass',
    name: '🌌 Nền Xà Cừ Đêm Tối (Giao diện riêng)',
    type: 'gradient',
    value:
      'radial-gradient(ellipse 66% 56% at 16% 16%, rgba(34, 211, 238, 0.30) 0%, transparent 56%), radial-gradient(ellipse 60% 52% at 86% 18%, rgba(251, 146, 60, 0.22) 0%, transparent 52%), radial-gradient(ellipse 64% 58% at 72% 84%, rgba(168, 85, 247, 0.28) 0%, transparent 56%), linear-gradient(140deg, #070B16 0%, #0F172A 52%, #130F26 100%)',
    bg: 'radial-gradient(ellipse 66% 56% at 16% 16%, rgba(34, 211, 238, 0.30) 0%, transparent 56%), radial-gradient(ellipse 60% 52% at 86% 18%, rgba(251, 146, 60, 0.22) 0%, transparent 52%), radial-gradient(ellipse 64% 58% at 72% 84%, rgba(168, 85, 247, 0.28) 0%, transparent 56%), linear-gradient(140deg, #070B16 0%, #0F172A 52%, #130F26 100%)',
    previewStyle: {
      background:
        'radial-gradient(ellipse 66% 56% at 16% 16%, rgba(34, 211, 238, 0.36) 0%, transparent 56%), radial-gradient(ellipse 60% 52% at 86% 18%, rgba(251, 146, 60, 0.26) 0%, transparent 52%), linear-gradient(140deg, #070B16 0%, #0F172A 52%, #130F26 100%)',
    },
    isCustom: false,
    createdAt: 1794300000013,
  },
  {
    id: 'theme-bg-liquid-glass',
    name: '✨ Nền Kính Lỏng Trong Suốt (Giao diện riêng)',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg',
    bg: "url('https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg') center/cover no-repeat",
    previewStyle: {
      background:
        'radial-gradient(at 14% 16%, rgba(165, 180, 252, 0.34) 0px, transparent 52%), linear-gradient(135deg, #f3f6fd 0%, #e9eefb 50%, #edf2fc 100%)',
      backgroundImage: "url('https://i.pinimg.com/1200x/fc/6c/6a/fc6c6a2b63a7034a08aba58149feb702.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000017,
  },
  {
    id: 'theme-bg-dark-liquid-glass',
    name: '🌙 Nền Kính Lỏng Bóng Đêm (Giao diện riêng)',
    type: 'image',
    value: darkRainbowGlassWallpaper,
    bg: `url('${darkRainbowGlassWallpaper}') center/cover no-repeat`,
    previewStyle: {
      background:
        'radial-gradient(at 14% 16%, rgba(99, 102, 241, 0.24) 0px, transparent 52%), linear-gradient(140deg, #0b1221 0%, #111b31 52%, #0e172a 100%)',
      backgroundImage: `url('${darkRainbowGlassWallpaper}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000018,
  },
  {
    id: 'theme-bg-deep-ocean',
    name: '🌊 Nền Biển Sâu Thẳm Xanh (Giao diện riêng)',
    type: 'image',
    value: deepOceanWallpaper,
    bg: `url('${deepOceanWallpaper}') center/cover no-repeat`,
    previewStyle: {
      background:
        'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.18) 0%, transparent 55%), linear-gradient(145deg, #0A1128 0%, #050B14 50%, #030712 100%)',
      backgroundImage: `url('${deepOceanWallpaper}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000020,
  },
  {
    id: 'theme-bg-frost-ice-neu',
    name: '❄️ Nền Băng Tuyết Nổi Khối (Giao diện riêng)',
    type: 'css',
    value:
      'background: radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 84%, rgba(196, 212, 232, 0.55) 0%, transparent 56%), linear-gradient(145deg, #E6EEF8 0%, #E0E8F2 52%, #D6E1EE 100%);',
    bg: 'radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 84%, rgba(196, 212, 232, 0.55) 0%, transparent 56%), linear-gradient(145deg, #E6EEF8 0%, #E0E8F2 52%, #D6E1EE 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 84%, rgba(196, 212, 232, 0.55) 0%, transparent 56%), linear-gradient(145deg, #E6EEF8 0%, #E0E8F2 52%, #D6E1EE 100%)',
    },
    isCustom: false,
    createdAt: 1794300000025,
  },
  {
    id: 'theme-bg-neumorphism-soft-ui',
    name: '☁️ Nền Lì Neumorphism Soft UI (#E0E5EC)',
    type: 'css',
    value: 'background: #E0E5EC;',
    bg: '#E0E5EC',
    previewStyle: {
      background: '#E0E5EC',
    },
    isCustom: false,
    createdAt: 1794300000027,
  },
  {
    id: 'theme-bg-glassmorphism',
    name: '✨ Nền Aurora Đa Sắc Glassmorphism',
    type: 'css',
    value:
      'background: radial-gradient(ellipse 62% 56% at 14% 18%, rgba(6, 182, 212, 0.72) 0%, transparent 58%), radial-gradient(ellipse 58% 54% at 86% 20%, rgba(236, 72, 153, 0.68) 0%, transparent 56%), radial-gradient(ellipse 64% 58% at 50% 52%, rgba(99, 102, 241, 0.62) 0%, transparent 62%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(249, 115, 22, 0.54) 0%, transparent 56%), radial-gradient(ellipse 60% 56% at 16% 86%, rgba(139, 92, 246, 0.68) 0%, transparent 58%), linear-gradient(135deg, #0D102B 0%, #17143D 46%, #131B3A 100%);',
    bg: 'radial-gradient(ellipse 62% 56% at 14% 18%, rgba(6, 182, 212, 0.72) 0%, transparent 58%), radial-gradient(ellipse 58% 54% at 86% 20%, rgba(236, 72, 153, 0.68) 0%, transparent 56%), radial-gradient(ellipse 64% 58% at 50% 52%, rgba(99, 102, 241, 0.62) 0%, transparent 62%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(249, 115, 22, 0.54) 0%, transparent 56%), radial-gradient(ellipse 60% 56% at 16% 86%, rgba(139, 92, 246, 0.68) 0%, transparent 58%), linear-gradient(135deg, #0D102B 0%, #17143D 46%, #131B3A 100%)',
    previewStyle: {
      background:
        'radial-gradient(ellipse 62% 56% at 14% 18%, rgba(6, 182, 212, 0.72) 0%, transparent 58%), radial-gradient(ellipse 58% 54% at 86% 20%, rgba(236, 72, 153, 0.68) 0%, transparent 56%), radial-gradient(ellipse 64% 58% at 50% 52%, rgba(99, 102, 241, 0.62) 0%, transparent 62%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(249, 115, 22, 0.54) 0%, transparent 56%), radial-gradient(ellipse 60% 56% at 16% 86%, rgba(139, 92, 246, 0.68) 0%, transparent 58%), linear-gradient(135deg, #0D102B 0%, #17143D 46%, #131B3A 100%)',
    },
    isCustom: false,
    createdAt: 1794300000026,
  },
  {
    id: 'theme-bg-flat-soft-ui',
    name: '🎨 Nền Phẳng Mềm Tinh Khiết (Giao diện riêng)',
    type: 'image',
    value: wpFlatSoftUi,
    bg: `url('${wpFlatSoftUi}') center/cover no-repeat`,
    previewStyle: {
      background:
        'radial-gradient(circle at 14% 16%, rgba(226, 232, 240, 0.55) 0%, transparent 48%), radial-gradient(circle at 86% 84%, rgba(241, 245, 249, 0.70) 0%, transparent 52%), linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
      backgroundImage: `url('${wpFlatSoftUi}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000028,
  },
  {
    id: 'theme-bg-dark-flat-soft-ui',
    name: '🌌 Nền Phẳng Mềm Đêm Tối (Giao diện riêng)',
    type: 'image',
    value: wpDarkFlatSoftUi,
    bg: `url('${wpDarkFlatSoftUi}') center/cover no-repeat`,
    previewStyle: {
      background:
        'radial-gradient(circle at 16% 16%, rgba(30, 41, 59, 0.45) 0%, transparent 50%), radial-gradient(circle at 84% 84%, rgba(15, 23, 42, 0.65) 0%, transparent 52%), linear-gradient(135deg, #0A0E17 0%, #0F172A 50%, #060911 100%)',
      backgroundImage: `url('${wpDarkFlatSoftUi}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794300000029,
  },
  {
    id: 'theme-bg-flat-ui',
    name: '⬜ Nền Trắng Phẳng Flat UI (#FFFFFF)',
    type: 'css',
    value: 'background: #FFFFFF;',
    bg: '#FFFFFF',
    previewStyle: {
      background: '#FFFFFF',
    },
    isCustom: false,
    createdAt: 1794300000031,
  },
  {
    id: 'theme-bg-nexus-bento',
    name: '🌌 Nền Nexus Bento Đêm Tối (#090D16)',
    type: 'css',
    value:
      'background: radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px) 0 0 / 24px 24px, radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.24) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.20) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.18) 0%, transparent 60%), #090D16;',
    bg: 'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.24) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.20) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.18) 0%, transparent 60%), #090D16',
    previewStyle: {
      background:
        'radial-gradient(rgba(148, 163, 184, 0.16) 1px, transparent 1px) 0 0 / 16px 16px, radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.28) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.24) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.22) 0%, transparent 60%), #090D16',
    },
    isCustom: false,
    createdAt: 1794300000032,
  },
  {
    id: 'theme-bg-light-nexus-bento',
    name: '☁️ Nền Nexus Bento Sáng (#F4F7FB)',
    type: 'css',
    value:
      'background: radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px) 0 0 / 24px 24px, radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.14) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.11) 0%, transparent 60%), #F4F7FB;',
    bg: 'radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.14) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.14) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.11) 0%, transparent 60%), #F4F7FB',
    previewStyle: {
      background:
        'radial-gradient(rgba(15, 23, 42, 0.10) 1px, transparent 1px) 0 0 / 16px 16px, radial-gradient(ellipse 48% 44% at 14% 16%, rgba(139, 92, 246, 0.18) 0%, transparent 62%), radial-gradient(ellipse 46% 42% at 86% 20%, rgba(56, 189, 248, 0.16) 0%, transparent 60%), radial-gradient(ellipse 48% 44% at 72% 86%, rgba(236, 72, 153, 0.14) 0%, transparent 60%), #F4F7FB',
    },
    isCustom: false,
    createdAt: 1794300000033,
  },
  {
    id: 'theme-bg-color-flat-soft-ui',
    name: '🎨 Nền Phẳng Màu Studio (#090D16)',
    type: 'css',
    value:
      'background: radial-gradient(ellipse 56% 48% at 14% 16%, rgba(139, 92, 246, 0.22) 0%, transparent 56%), radial-gradient(ellipse 54% 48% at 86% 18%, rgba(6, 182, 212, 0.18) 0%, transparent 56%), radial-gradient(ellipse 52% 46% at 78% 84%, rgba(79, 70, 229, 0.18) 0%, transparent 54%), radial-gradient(ellipse 48% 44% at 18% 82%, rgba(16, 185, 129, 0.14) 0%, transparent 52%), linear-gradient(145deg, #090D16 0%, #0D1322 52%, #090D16 100%);',
    bg: 'radial-gradient(ellipse 56% 48% at 14% 16%, rgba(139, 92, 246, 0.22) 0%, transparent 56%), radial-gradient(ellipse 54% 48% at 86% 18%, rgba(6, 182, 212, 0.18) 0%, transparent 56%), radial-gradient(ellipse 52% 46% at 78% 84%, rgba(79, 70, 229, 0.18) 0%, transparent 54%), radial-gradient(ellipse 48% 44% at 18% 82%, rgba(16, 185, 129, 0.14) 0%, transparent 52%), linear-gradient(145deg, #090D16 0%, #0D1322 52%, #090D16 100%)',
    previewStyle: {
      background:
        'radial-gradient(ellipse 56% 48% at 14% 16%, rgba(139, 92, 246, 0.22) 0%, transparent 56%), radial-gradient(ellipse 54% 48% at 86% 18%, rgba(6, 182, 212, 0.18) 0%, transparent 56%), radial-gradient(ellipse 52% 46% at 78% 84%, rgba(79, 70, 229, 0.18) 0%, transparent 54%), radial-gradient(ellipse 48% 44% at 18% 82%, rgba(16, 185, 129, 0.14) 0%, transparent 52%), linear-gradient(145deg, #090D16 0%, #0D1322 52%, #090D16 100%)',
    },
    isCustom: false,
    createdAt: 1794300000030,
  },

  {
    id: 'glass-ui-vang',
    name: '💛 Glass UI Vàng #FFDF25',
    type: 'gradient',
    value: 'background: radial-gradient(circle at 20% 20%, rgba(255, 223, 37, 0.38) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 125, 33, 0.25) 0%, transparent 50%), linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #ffffff 100%);',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #fffbeb 0%, #FFDF25 100%)' },
    isCustom: false,
  },
  {
    id: 'glass-ui-xanhduong',
    name: '💙 Glass UI Xanh dương #1480C0',
    type: 'gradient',
    value: 'background: radial-gradient(circle at 20% 20%, rgba(20, 128, 192, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 184, 230, 0.28) 0%, transparent 50%), linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ffffff 100%);',
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #3BB8E6 0%, #1480C0 100%)' },
    isCustom: false,
  },
  {
    id: 'glass-ui-xanhla',
    name: '💚 Glass UI Xanh lá #50B347',
    type: 'gradient',
    value: 'background: radial-gradient(circle at 20% 20%, rgba(80, 179, 71, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(163, 212, 58, 0.25) 0%, transparent 50%), linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ffffff 100%);',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #A3D43A 0%, #50B347 100%)' },
    isCustom: false,
  },
  {
    id: 'glass-ui-hongdo',
    name: '💖 Glass UI Hồng đỏ #E64C72',
    type: 'gradient',
    value: 'background: radial-gradient(circle at 20% 20%, rgba(230, 76, 114, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(221, 78, 158, 0.28) 0%, transparent 50%), linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #ffffff 100%);',
    bg: 'linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #DD4E9E 0%, #E64C72 100%)' },
    isCustom: false,
  },
  {
    id: 'glass-ui-tim',
    name: '💜 Glass UI Tím #6353B5 & Lavender',
    type: 'gradient',
    value: 'background: radial-gradient(circle at 20% 20%, rgba(99, 83, 181, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.28) 0%, transparent 50%), linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ffffff 100%);',
    bg: 'linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #A78BFA 0%, #6353B5 100%)' },
    isCustom: false,
  },
  {
    id: 'none',
    name: '🚫 Không Dùng Hình Nền (Mặc định hệ thống)',
    type: 'image',
    value: '',
    bg: '',
    isCustom: true,
    createdAt: 1793306553634,
    previewStyle: {},
  },
  {
    id: 'yt-liquid-blue-shapes',
    name: 'Gradient Liquid Blue Shapes (YouTube Video)',
    type: 'video',
    value: 'https://www.youtube.com/embed/Jox6R5-rIH0?si=XekcDne6eU9URrsv&autoplay=1&mute=1&loop=1&playlist=Jox6R5-rIH0&controls=0&showinfo=0',
    bg: "url('https://img.youtube.com/vi/Jox6R5-rIH0/hqdefault.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://img.youtube.com/vi/Jox6R5-rIH0/hqdefault.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: Date.now(),
  },
  {
    id: 'custom-wp-1788113303651',
    name: 'Hình nền #41',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/e5/41/2f/e5412f90727c824210b57af865d48a7e.jpg',
    bg: "url('https://i.pinimg.com/1200x/e5/41/2f/e5412f90727c824210b57af865d48a7e.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/e5/41/2f/e5412f90727c824210b57af865d48a7e.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793306530762,
  },
  {
    id: 'custom-wp-1788112123524',
    name: 'Hình nền #28',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/f8/58/20/f858205b0f91ab2dd9036b3d01e8341a.jpg',
    bg: "url('https://i.pinimg.com/1200x/f8/58/20/f858205b0f91ab2dd9036b3d01e8341a.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/f8/58/20/f858205b0f91ab2dd9036b3d01e8341a.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793306530762,
  },
  {
    id: 'img-wp-18',
    name: 'Abstract Vibrant Horizon 18',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/da/78/3c/da783c1ae91c1810381cf8cbc5a234fd.jpg',
    bg: "url('https://i.pinimg.com/1200x/da/78/3c/da783c1ae91c1810381cf8cbc5a234fd.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/da/78/3c/da783c1ae91c1810381cf8cbc5a234fd.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305989120,
  },
  {
    id: 'custom-css-1790281790561',
    name: 'Hình nền CSS Custom',
    type: 'css',
    value: 'background:\n  linear-gradient(\n    to right bottom,\n    #0093E9 0%,\n    #80D0C7 100%\n  );',
    bg: 'linear-gradient( to right bottom, #0093E9 0%, #80D0C7 100% )',
    previewStyle: {
      background: 'linear-gradient( to right bottom, #0093E9 0%, #80D0C7 100% )',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1790261474954',
    name: 'Hình nền #89',
    type: 'video',
    value: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/source/1782066616542-motion_111.mp4',
    bg: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/source/1782066616542-motion_111.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1790261424372',
    name: 'Hình nền #88',
    type: 'video',
    value: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/source/1782066869696-motion_112.mp4',
    bg: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionitems/source/1782066869696-motion_112.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787476757058',
    name: 'Hình nền #25',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/f4/5c/a5/f45ca538988ec678bdd13564c6e422e0.jpg',
    bg: "url('https://i.pinimg.com/1200x/f4/5c/a5/f45ca538988ec678bdd13564c6e422e0.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/f4/5c/a5/f45ca538988ec678bdd13564c6e422e0.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787474863337',
    name: 'Hình nền #24',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/8b/1e/b9/8b1eb99060f70ca44abb1467991e0218.jpg',
    bg: "url('https://i.pinimg.com/1200x/8b/1e/b9/8b1eb99060f70ca44abb1467991e0218.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/8b/1e/b9/8b1eb99060f70ca44abb1467991e0218.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787474467133',
    name: 'Hình nền #23',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/df/a9/7d/dfa97d9d5fc6370a3291a60a7eaac630.jpg',
    bg: "url('https://i.pinimg.com/1200x/df/a9/7d/dfa97d9d5fc6370a3291a60a7eaac630.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/df/a9/7d/dfa97d9d5fc6370a3291a60a7eaac630.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787411641956',
    name: 'Hình nền Video #23',
    type: 'video',
    value: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4',
    bg: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787411610689',
    name: 'Hình nền Video #22',
    type: 'video',
    value: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_034306_165449ef-7d2e-4e81-850f-1939c5cb442d.mp4',
    bg: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_034306_165449ef-7d2e-4e81-850f-1939c5cb442d.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787385268921',
    name: 'Hình nền Video #20',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/mc/720p/24/04/f5/2404f5b12afbf179a6aa0be40c5468e4.mp4',
    bg: 'https://v1.pinimg.com/videos/mc/720p/24/04/f5/2404f5b12afbf179a6aa0be40c5468e4.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787385177593',
    name: 'Hình nền #19',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/6e/ce/8d/6ece8dd1d119c72abe2ec5975cba98a7.jpg',
    bg: "url('https://i.pinimg.com/1200x/6e/ce/8d/6ece8dd1d119c72abe2ec5975cba98a7.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/6e/ce/8d/6ece8dd1d119c72abe2ec5975cba98a7.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787385080160',
    name: 'Hình nền #17',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/f7/ee/67/f7ee67286822641202752fdb2392af61.jpg',
    bg: "url('https://i.pinimg.com/1200x/f7/ee/67/f7ee67286822641202752fdb2392af61.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/f7/ee/67/f7ee67286822641202752fdb2392af61.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787385043511',
    name: 'Hình nền #16',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/bf/bd/f2/bfbdf26043b404d7a2ee18f176695c5f.jpg',
    bg: "url('https://i.pinimg.com/1200x/bf/bd/f2/bfbdf26043b404d7a2ee18f176695c5f.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/bf/bd/f2/bfbdf26043b404d7a2ee18f176695c5f.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787384730889',
    name: 'Hình nền #15',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/23/2c/1d/232c1dfaaee23d7e6c07a2bf66380c40.jpg',
    bg: "url('https://i.pinimg.com/1200x/23/2c/1d/232c1dfaaee23d7e6c07a2bf66380c40.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/23/2c/1d/232c1dfaaee23d7e6c07a2bf66380c40.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787384608963',
    name: 'Hình nền #14',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/a3/51/a6/a351a69c0a3ddd6dcc1f7d46e9d7fc2f.jpg',
    bg: "url('https://i.pinimg.com/1200x/a3/51/a6/a351a69c0a3ddd6dcc1f7d46e9d7fc2f.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/a3/51/a6/a351a69c0a3ddd6dcc1f7d46e9d7fc2f.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787384523506',
    name: 'Hình nền #13',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/81/43/bd/8143bd40b96f7252f9f2964d0916dafe.jpg',
    bg: "url('https://i.pinimg.com/1200x/81/43/bd/8143bd40b96f7252f9f2964d0916dafe.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/81/43/bd/8143bd40b96f7252f9f2964d0916dafe.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787384473842',
    name: 'Hình nền #12',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/8b/4c/38/8b4c383bf9cfe64ec3878f267769f5f3.jpg',
    bg: "url('https://i.pinimg.com/1200x/8b/4c/38/8b4c383bf9cfe64ec3878f267769f5f3.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/8b/4c/38/8b4c383bf9cfe64ec3878f267769f5f3.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362244022',
    name: 'Hình nền #2',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/4d/80/91/4d80911e8d5f12e891e9a1b78604fc15.jpg',
    bg: "url('https://i.pinimg.com/1200x/4d/80/91/4d80911e8d5f12e891e9a1b78604fc15.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/4d/80/91/4d80911e8d5f12e891e9a1b78604fc15.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362669332',
    name: 'Hình nền #10',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/95/3c/ae/953caedb2a4f25bd463c1b74a4329651.jpg',
    bg: "url('https://i.pinimg.com/1200x/95/3c/ae/953caedb2a4f25bd463c1b74a4329651.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/95/3c/ae/953caedb2a4f25bd463c1b74a4329651.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362648848',
    name: 'Hình nền Video #9',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/mc/720p/10/77/ab/1077abb576579eba02148d3a25d62246.mp4',
    bg: 'https://v1.pinimg.com/videos/mc/720p/10/77/ab/1077abb576579eba02148d3a25d62246.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362619870',
    name: 'Hình nền #8',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/a7/64/67/a764671d012a974456bd70ea13f9e856.jpg',
    bg: "url('https://i.pinimg.com/1200x/a7/64/67/a764671d012a974456bd70ea13f9e856.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/a7/64/67/a764671d012a974456bd70ea13f9e856.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362519361',
    name: 'Hình nền #6',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/ea/da/bf/eadabffb44fb936533d37219dd3f5fd5.jpg',
    bg: "url('https://i.pinimg.com/1200x/ea/da/bf/eadabffb44fb936533d37219dd3f5fd5.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/ea/da/bf/eadabffb44fb936533d37219dd3f5fd5.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362485474',
    name: 'Hình nền Video #4',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/iht/hevcMp4V3/cd/8f/44/cd8f44dd4a75d66aeeb1c4343084966a_720w.mp4',
    bg: 'https://v1.pinimg.com/videos/iht/hevcMp4V3/cd/8f/44/cd8f44dd4a75d66aeeb1c4343084966a_720w.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787362377113',
    name: 'Hình nền #3',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/88/27/2f/88272fed43faf6368862ac2b6a763fdb.jpg',
    bg: "url('https://i.pinimg.com/1200x/88/27/2f/88272fed43faf6368862ac2b6a763fdb.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/88/27/2f/88272fed43faf6368862ac2b6a763fdb.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },

  {
    id: 'custom-wp-1788305458076',
    name: 'Hình nền #58',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/mc/720p/fa/b9/6e/fab96e55b0f2e181e4c1f2005ae2d4f2.mp4',
    bg: 'https://v1.pinimg.com/videos/mc/720p/fa/b9/6e/fab96e55b0f2e181e4c1f2005ae2d4f2.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788305429681',
    name: 'Hình nền #57',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/mc/720p/80/a2/26/80a226c99f3dd23fdb1b19511ae95800.mp4',
    bg: 'https://v1.pinimg.com/videos/mc/720p/80/a2/26/80a226c99f3dd23fdb1b19511ae95800.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788305326019',
    name: 'Hình nền #56',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/720p/0d/dd/3d/0ddd3dd500024126499b49447815d829.mp4',
    bg: 'https://v1.pinimg.com/videos/720p/0d/dd/3d/0ddd3dd500024126499b49447815d829.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788305253777',
    name: 'Hình nền #55',
    type: 'image',
    value: 'https://i.pinimg.com/originals/10/3a/37/103a3731818300730d8455c54dc7b6ce.gif',
    bg: "url('https://i.pinimg.com/originals/10/3a/37/103a3731818300730d8455c54dc7b6ce.gif') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/originals/10/3a/37/103a3731818300730d8455c54dc7b6ce.gif')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788256063185',
    name: 'Hình nền #54',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/24047.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/24047.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/24047.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788256052669',
    name: 'Hình nền #53',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/17263.png',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/17263.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/17263.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788246311512',
    name: 'Hình nền #52',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/24769.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/24769.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/24769.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788245365255',
    name: 'Hình nền #51',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/25729.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/25729.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/25729.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788244948932',
    name: 'Hình nền #50',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/8966.png',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/8966.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/8966.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113838828',
    name: 'Hình nền #49',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/78/55/c1/7855c19c9d9b1783f0370eeac61c852c.jpg',
    bg: "url('https://i.pinimg.com/1200x/78/55/c1/7855c19c9d9b1783f0370eeac61c852c.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/78/55/c1/7855c19c9d9b1783f0370eeac61c852c.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113643739',
    name: 'Hình nền #48',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/mc/720p/33/64/b5/3364b532b36f0a0dced2a4dcb3522d29.mp4',
    bg: 'https://v1.pinimg.com/videos/mc/720p/33/64/b5/3364b532b36f0a0dced2a4dcb3522d29.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113606770',
    name: 'Hình nền #47',
    type: 'video',
    value: 'https://v1.pinimg.com/videos/iht/expMp4/f7/83/16/f7831662ced2dcc096aa27eb16a0323c_720w.mp4',
    bg: 'https://v1.pinimg.com/videos/iht/expMp4/f7/83/16/f7831662ced2dcc096aa27eb16a0323c_720w.mp4',
    previewStyle: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113482002',
    name: 'Hình nền #46',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/55/90/e9/5590e953e904040e5ca140e1b4af35e2.jpg',
    bg: "url('https://i.pinimg.com/1200x/55/90/e9/5590e953e904040e5ca140e1b4af35e2.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/55/90/e9/5590e953e904040e5ca140e1b4af35e2.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113452197',
    name: 'Hình nền #45',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/76/22/54/7622546f915d172079c56c6244cf5c7b.jpg',
    bg: "url('https://i.pinimg.com/1200x/76/22/54/7622546f915d172079c56c6244cf5c7b.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/76/22/54/7622546f915d172079c56c6244cf5c7b.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113436797',
    name: 'Hình nền #44',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/6e/79/0f/6e790fbd1a0166e5b40338d024628330.jpg',
    bg: "url('https://i.pinimg.com/1200x/6e/79/0f/6e790fbd1a0166e5b40338d024628330.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/6e/79/0f/6e790fbd1a0166e5b40338d024628330.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113349613',
    name: 'Hình nền #43',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/20/bc/ec/20bcec026923335816db573b44d90402.jpg',
    bg: "url('https://i.pinimg.com/1200x/20/bc/ec/20bcec026923335816db573b44d90402.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/20/bc/ec/20bcec026923335816db573b44d90402.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113327505',
    name: 'Hình nền #42',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/0f/69/39/0f6939ca4e265db250f2598a4679f4b9.jpg',
    bg: "url('https://i.pinimg.com/1200x/0f/69/39/0f6939ca4e265db250f2598a4679f4b9.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/0f/69/39/0f6939ca4e265db250f2598a4679f4b9.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113164969',
    name: 'Hình nền #40',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/18/c8/43/18c8437bd997140d5a9bf5257bfdf0be.jpg',
    bg: "url('https://i.pinimg.com/1200x/18/c8/43/18c8437bd997140d5a9bf5257bfdf0be.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/18/c8/43/18c8437bd997140d5a9bf5257bfdf0be.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113137012',
    name: 'Hình nền #39',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/7f/a4/b3/7fa4b369861cb0b46e984326035c309b.jpg',
    bg: "url('https://i.pinimg.com/1200x/7f/a4/b3/7fa4b369861cb0b46e984326035c309b.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/7f/a4/b3/7fa4b369861cb0b46e984326035c309b.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113023789',
    name: 'Hình nền #38',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/e5/c4/27/e5c42708fe123cc72bd4d5148ae8b035.jpg',
    bg: "url('https://i.pinimg.com/1200x/e5/c4/27/e5c42708fe123cc72bd4d5148ae8b035.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/e5/c4/27/e5c42708fe123cc72bd4d5148ae8b035.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788113000282',
    name: 'Hình nền #37',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/ef/5b/6e/ef5b6ef2a3459dbab37c1c051e267819.jpg',
    bg: "url('https://i.pinimg.com/1200x/ef/5b/6e/ef5b6ef2a3459dbab37c1c051e267819.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/ef/5b/6e/ef5b6ef2a3459dbab37c1c051e267819.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112968373',
    name: 'Hình nền #35',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/ad/df/5a/addf5a6fd4d647fb94f115e95f655eea.jpg',
    bg: "url('https://i.pinimg.com/1200x/ad/df/5a/addf5a6fd4d647fb94f115e95f655eea.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/ad/df/5a/addf5a6fd4d647fb94f115e95f655eea.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112934267',
    name: 'Hình nền #34',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/0b/a2/3f/0ba23f8bf15ae2e598bc7b881135fb8a.jpg',
    bg: "url('https://i.pinimg.com/1200x/0b/a2/3f/0ba23f8bf15ae2e598bc7b881135fb8a.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/0b/a2/3f/0ba23f8bf15ae2e598bc7b881135fb8a.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112915658',
    name: 'Hình nền #33',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/c5/95/0c/c5950c0b0434b8d2539a344781e2eac7.jpg',
    bg: "url('https://i.pinimg.com/1200x/c5/95/0c/c5950c0b0434b8d2539a344781e2eac7.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/c5/95/0c/c5950c0b0434b8d2539a344781e2eac7.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112425580',
    name: 'Hình nền #31',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/19/60/45/1960453d1b77c583b8afb9ef5d585bec.jpg',
    bg: "url('https://i.pinimg.com/1200x/19/60/45/1960453d1b77c583b8afb9ef5d585bec.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/19/60/45/1960453d1b77c583b8afb9ef5d585bec.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112264534',
    name: 'Hình nền #30',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/c8/e8/3e/c8e83e64889a9c93c9bb5056b3f5bbe7.jpg',
    bg: "url('https://i.pinimg.com/1200x/c8/e8/3e/c8e83e64889a9c93c9bb5056b3f5bbe7.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/c8/e8/3e/c8e83e64889a9c93c9bb5056b3f5bbe7.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112183718',
    name: 'Hình nền #30 (Bản 2)',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/02/95/16/029516b3f76912a7f29e7da43ecd52c1.jpg',
    bg: "url('https://i.pinimg.com/1200x/02/95/16/029516b3f76912a7f29e7da43ecd52c1.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/02/95/16/029516b3f76912a7f29e7da43ecd52c1.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788112147387',
    name: 'Hình nền #29',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/d6/6c/8b/d66c8b55ed556d49a6547b828dadef43.jpg',
    bg: "url('https://i.pinimg.com/1200x/d6/6c/8b/d66c8b55ed556d49a6547b828dadef43.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/d6/6c/8b/d66c8b55ed556d49a6547b828dadef43.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787843412602',
    name: 'Hình nền #32 (Bản 2)',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/a6/29/db/a629dbc314a1289abd8e8cb6907aa00b.jpg',
    bg: "url('https://i.pinimg.com/1200x/a6/29/db/a629dbc314a1289abd8e8cb6907aa00b.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/a6/29/db/a629dbc314a1289abd8e8cb6907aa00b.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787821658922',
    name: 'Hình nền #47 (Ảnh)',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/92/fa/d1/92fad177712a5a559faf08abf73d9bf4.jpg',
    bg: "url('https://i.pinimg.com/1200x/92/fa/d1/92fad177712a5a559faf08abf73d9bf4.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/92/fa/d1/92fad177712a5a559faf08abf73d9bf4.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1787821618493',
    name: 'Hình nền #46 (Bản 2)',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/b9/ec/27/b9ec275698274ba685f25d12d9fc6df4.jpg',
    bg: "url('https://i.pinimg.com/1200x/b9/ec/27/b9ec275698274ba685f25d12d9fc6df4.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/b9/ec/27/b9ec275698274ba685f25d12d9fc6df4.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788351856323',
    name: 'Hình nền #65',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/39/00/a0/3900a03de7c46f463202b54b40a27d74.jpg',
    bg: "url('https://i.pinimg.com/1200x/39/00/a0/3900a03de7c46f463202b54b40a27d74.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/39/00/a0/3900a03de7c46f463202b54b40a27d74.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788306249476',
    name: 'Hình nền #63',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/a9/4c/0e/a94c0e462b93b242c533cb0b51c935c1.jpg',
    bg: "url('https://i.pinimg.com/1200x/a9/4c/0e/a94c0e462b93b242c533cb0b51c935c1.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/a9/4c/0e/a94c0e462b93b242c533cb0b51c935c1.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788305641548',
    name: 'Hình nền #61',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/0c/19/3e/0c193e43855220f878d5df376af6841f.jpg',
    bg: "url('https://i.pinimg.com/1200x/0c/19/3e/0c193e43855220f878d5df376af6841f.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/0c/19/3e/0c193e43855220f878d5df376af6841f.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788305575669',
    name: 'Hình nền #60',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/cf/f5/27/cff527da70852f4d539934031ca96d39.jpg',
    bg: "url('https://i.pinimg.com/1200x/cf/f5/27/cff527da70852f4d539934031ca96d39.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/cf/f5/27/cff527da70852f4d539934031ca96d39.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'custom-wp-1788305541265',
    name: 'Hình nền #59',
    type: 'image',
    value: 'https://i.pinimg.com/1200x/ba/32/eb/ba32ebf387cc1f74a58a90f274c17c7f.jpg',
    bg: "url('https://i.pinimg.com/1200x/ba/32/eb/ba32ebf387cc1f74a58a90f274c17c7f.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://i.pinimg.com/1200x/ba/32/eb/ba32ebf387cc1f74a58a90f274c17c7f.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'canvas-luminous-orbs-particles',
    name: 'Luminous Orbs Particles (Canvas Animated 5-Color)',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=2000',
    bg: "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975639,
  },
  {
    id: 'css-aurora-borealis',
    name: 'Cực quang Aurora CSS (Animated Mesh)',
    type: 'css',
    value:
      'background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%);\nposition: relative;\noverflow: hidden;\nbox-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%)',
    previewStyle: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%)',
      boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8)',
    },
    isCustom: true,
    createdAt: 1793305975640,
  },
  {
    id: 'css-sunset-mesh',
    name: 'Hoàng hôn Sunset Flow (CSS Mesh)',
    type: 'css',
    value:
      'background: radial-gradient(at 0% 0%, #ff5e62 0px, transparent 50%),\nradial-gradient(at 100% 0%, #ff9966 0px, transparent 50%),\nradial-gradient(at 100% 100%, #6b11ff 0px, transparent 50%),\nradial-gradient(at 0% 100%, #3a1c71 0px, transparent 50%),\n#0b0c10;',
    bg: 'radial-gradient(at 0% 0%, #ff5e62 0px, transparent 50%), radial-gradient(at 100% 0%, #ff9966 0px, transparent 50%), radial-gradient(at 100% 100%, #6b11ff 0px, transparent 50%), radial-gradient(at 0% 100%, #3a1c71 0px, transparent 50%), #0b0c10',
    previewStyle: {
      background:
        'radial-gradient(at 0% 0%, #ff5e62 0px, transparent 50%), radial-gradient(at 100% 0%, #ff9966 0px, transparent 50%), radial-gradient(at 100% 100%, #6b11ff 0px, transparent 50%), radial-gradient(at 0% 100%, #3a1c71 0px, transparent 50%), #0b0c10',
    },
    isCustom: true,
    createdAt: 1793305975640,
  },
  {
    id: 'css-deep-space',
    name: 'Vũ trụ Sao Cosmic Starfield (CSS Space)',
    type: 'css',
    value:
      'background-color: #030014;\nbackground-image: \n  radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),\n  radial-gradient(1.5px 1.5px at 90px 40px, #f472b6, rgba(0,0,0,0)),\n  radial-gradient(ellipse at 70% 30%, rgba(99, 102, 241, 0.25) 0%, transparent 60%),\n  radial-gradient(ellipse at 20% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 60%);\nbackground-size: 150px 150px, 150px 150px, 100% 100%, 100% 100%;',
    bg: '#030014',
    previewStyle: {
      backgroundColor: '#030014',
      backgroundImage:
        'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #f472b6, rgba(0,0,0,0)), radial-gradient(ellipse at 70% 30%, rgba(99, 102, 241, 0.25) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 60%)',
      backgroundSize: '150px 150px, 150px 150px, 100% 100%, 100% 100%',
    },
    isCustom: true,
    createdAt: 1793305975640,
  },
  {
    id: 'css-emerald-matrix',
    name: 'Ma trận Lục bảo Isometric (CSS Emerald)',
    type: 'css',
    value:
      'background: #022c22;\nbackground-image: \n  radial-gradient(circle at 100% 150%, #022c22 24%, #059669 25%, #059669 28%, #022c22 29%, #022c22 36%, #059669 36%, #059669 40%, transparent 40%),\n  radial-gradient(circle at 0% 150%, #022c22 24%, #059669 25%, #059669 28%, #022c22 29%, #022c22 36%, #059669 36%, #059669 40%, transparent 40%),\n  radial-gradient(circle at 50% 100%, #10b981 10%, #047857 11%, #047857 23%, #064e3b 24%, #059669 31%, #022c22 44%, transparent 53%);\nbackground-size: 80px 40px;',
    bg: '#022c22',
    previewStyle: {
      backgroundImage:
        'radial-gradient(circle at 100% 150%, #022c22 24%, #059669 25%, #059669 28%, #022c22 29%, #022c22 36%, #059669 36%, #059669 40%, transparent 40%), radial-gradient(circle at 0% 150%, #022c22 24%, #059669 25%, #059669 28%, #022c22 29%, #022c22 36%, #059669 36%, #059669 40%, transparent 40%), radial-gradient(circle at 50% 100%, #10b981 10%, #047857 11%, #047857 23%, #064e3b 24%, #059669 31%, #022c22 44%, transparent 53%)',
      backgroundSize: '80px 40px',
      backgroundColor: '#022c22',
    },
    isCustom: true,
    createdAt: 1793305975640,
  },
  {
    id: 'video-wp-aurora-stream',
    name: 'Cực quang Chuyển động Aurora Stream 4K',
    type: 'video',
    value: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    bg: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975640,
  },
  {
    id: 'video-wp-cosmic-flow',
    name: 'Dải Ngân hà Cosmic Flow Motion HD',
    type: 'video',
    value: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    bg: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975640,
  },
  {
    id: 'img-wp-minimal-white',
    name: 'Không gian Trắng Tối giản Minimalist',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920',
    bg: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975641,
  },
  {
    id: 'img-wp-geometric-mountain',
    name: 'Dãy núi Hình học Geometric Mountain',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920',
    bg: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975641,
  },
  {
    id: 'img-wp-cyber-city',
    name: 'Thành phố Đêm Neon Cyberpunk',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1920',
    bg: "url('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1920') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975641,
  },
  {
    id: 'img-wp-calm-lake',
    name: 'Hồ nước Tĩnh lặng Calm Reflection',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920',
    bg: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: true,
    createdAt: 1793305975641,
  },
  {
    id: 'css-cowhide-leather-craft',
    name: 'Da nâu bò thủ công #82 (Full-Grain Leather)',
    type: 'css',
    value:
      'background: radial-gradient(circle at 20% 20%, rgba(180, 115, 58, 0.35) 0%, transparent 52%), radial-gradient(circle at 80% 78%, rgba(139, 90, 43, 0.32) 0%, transparent 54%), linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%);',
    bg: 'linear-gradient(145deg, #3A1F0D 0%, #241206 55%, #4A2912 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 25% 25%, rgba(180, 115, 58, 0.38) 0%, transparent 55%), linear-gradient(145deg, #522E10 0%, #2B1608 100%)',
    },
    isCustom: false,
    createdAt: 1794035601000,
  },
  {
    id: 'css-dark-cowhide-leather-craft',
    name: 'Da bò tối màu chỉ kem (Dark Cowhide Leather)',
    type: 'css',
    value:
      'background: radial-gradient(circle at 20% 20%, rgba(229, 184, 126, 0.14) 0%, transparent 52%), radial-gradient(circle at 80% 78%, rgba(161, 108, 63, 0.16) 0%, transparent 54%), linear-gradient(145deg, #2B221E 0%, #1C1613 55%, #140F0D 100%);',
    bg: 'linear-gradient(145deg, #2B221E 0%, #1C1613 55%, #140F0D 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 25% 25%, rgba(229, 184, 126, 0.16) 0%, transparent 55%), linear-gradient(145deg, #2B221E 0%, #140F0D 100%)',
    },
    isCustom: false,
    createdAt: 1794035603000,
  },
  {
    id: 'css-walnut-wood-craft',
    name: 'Vân gỗ óc chó khảm đồng (Walnut Wood Grain)',
    type: 'css',
    value:
      'background: radial-gradient(circle at 20% 20%, rgba(245, 196, 120, 0.14) 0%, transparent 52%), radial-gradient(circle at 80% 78%, rgba(164, 102, 54, 0.18) 0%, transparent 54%), linear-gradient(145deg, #3A2214 0%, #160D08 55%, #24150C 100%);',
    bg: 'linear-gradient(145deg, #3A2214 0%, #160D08 55%, #24150C 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 25% 25%, rgba(245, 196, 120, 0.16) 0%, transparent 55%), linear-gradient(145deg, #3A2214 0%, #160D08 100%)',
    },
    isCustom: false,
    createdAt: 1794035602000,
  },
  {
    id: 'css-pastel-bento-soft',
    name: 'Bento Pastel Dịu Nhẹ (Hồng Phấn · Oải Hương · Thiên Thanh)',
    type: 'css',
    value:
      'background: radial-gradient(circle at 14% 16%, rgba(251, 207, 232, 0.55) 0%, transparent 48%), radial-gradient(circle at 86% 20%, rgba(196, 181, 253, 0.50) 0%, transparent 48%), radial-gradient(circle at 52% 88%, rgba(186, 230, 253, 0.55) 0%, transparent 52%), linear-gradient(155deg, #fdf2f8 0%, #f5f3ff 50%, #eff6ff 100%);',
    bg: 'linear-gradient(155deg, #fdf2f8 0%, #f5f3ff 50%, #eff6ff 100%)',
    previewStyle: {
      background:
        'radial-gradient(circle at 22% 20%, rgba(251, 207, 232, 0.65) 0%, transparent 52%), radial-gradient(circle at 82% 78%, rgba(186, 230, 253, 0.65) 0%, transparent 54%), linear-gradient(155deg, #fdf2f8 0%, #f5f3ff 50%, #eff6ff 100%)',
    },
    isCustom: false,
    createdAt: 1794240000000,
  },
  {
    id: 'wp-4k-24611',
    name: 'Abstract Gradient Waves 24611 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/24611.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/24611.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/24611.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000001,
  },
  {
    id: 'wp-4k-20129',
    name: 'Crystal Blue Horizon 20129 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/20129.png',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20129.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20129.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000002,
  },
  {
    id: 'wp-4k-20099',
    name: 'Luminous Glass Waves 20099 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/20099.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20099.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20099.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000003,
  },
  {
    id: 'wp-4k-20092',
    name: 'Minimalist Fluid Flow 20092 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/20092.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20092.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/20092.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000004,
  },
  {
    id: 'wp-4k-16779',
    name: 'Silk Soft Gradient 16779 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/16779.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/16779.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/16779.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000005,
  },
  {
    id: 'wp-4k-15320',
    name: 'Aurora Dreamscape 15320 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/15320.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/15320.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/15320.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000006,
  },
  {
    id: 'wp-4k-18139',
    name: 'Chromatic Prism 18139 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/18139.png',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/18139.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/18139.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000007,
  },
  {
    id: 'wp-4k-14217',
    name: 'Cosmic Mist 14217 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/14217.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/14217.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/14217.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000008,
  },
  {
    id: 'wp-4k-12662',
    name: 'Twilight Smooth Curves 12662 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/12662.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/12662.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/12662.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000009,
  },
  {
    id: 'wp-4k-12656',
    name: 'Nebula Mesh Flow 12656 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/12656.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/12656.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/12656.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000010,
  },
  {
    id: 'wp-4k-11753',
    name: 'Vibrant Spectrum 11753 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/11753.jpeg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/11753.jpeg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/11753.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000011,
  },
  {
    id: 'wp-4k-10732',
    name: 'Soft Horizon Layers 10732 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/10732.jpg',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/10732.jpg') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/10732.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000012,
  },
  {
    id: 'wp-4k-9030',
    name: 'Pastel Wave Glass 9030 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/9030.png',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/9030.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/9030.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000013,
  },
  {
    id: 'wp-4k-9022',
    name: 'Ethereal Silk Light 9022 (4K)',
    type: 'image',
    value: 'https://4kwallpapers.com/images/walls/thumbs_3t/9022.png',
    bg: "url('https://4kwallpapers.com/images/walls/thumbs_3t/9022.png') center/cover no-repeat",
    previewStyle: {
      backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/9022.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    isCustom: false,
    createdAt: 1794500000014,
  },
  {
    id: 'vid-dribbble-13498087',
    name: 'Fluid Abstract Motion Loop (Dribbble HD)',
    type: 'video',
    value: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)',
    previewStyle: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)',
    },
    isCustom: false,
    createdAt: 1794500000015,
  },
  {
    id: 'vid-dribbble-18230475',
    name: 'Luminous Glass Waves Motion (Dribbble HD)',
    type: 'video',
    value: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    bg: 'linear-gradient(135deg, #090d16 0%, #312e81 50%, #0ea5e9 100%)',
    previewStyle: {
      background: 'linear-gradient(135deg, #090d16 0%, #312e81 50%, #0ea5e9 100%)',
    },
    isCustom: false,
    createdAt: 1794500000016,
  },
];
