import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { triggerThemeCrossFade } from '../utils/themeTransition';
import {
  WALLPAPER_PRESETS_LIST,
  WallpaperPreset,
  ACTIVE_WALLPAPER_STORAGE_KEY,
  parseCssStringToStyle,
  getCleanImageUrl,
  isCodePenWallpaper,
  getThemeBackgroundForMode,
} from '../data/wallpapers';
import { toOptimizedWebPUrl } from '../utils/imageWebp';
import {
  CARD_STYLE_STORAGE_KEY,
  VISUAL_THEME_MODE_STORAGE_KEY,
  LAST_STANDARD_CARD_STYLE_STORAGE_KEY,
  isNeumorphismCardStyle,
  COLOR_SCHEME_MODE_STORAGE_KEY,
  COLOR_SCHEME_MODE_SYNC_EVENT,
  DEFAULT_CARD_STYLE,
  DEFAULT_CORNER_RADIUS,
  DEFAULT_WAVE_MOTION,
  DEFAULT_CARD_EFFECT,
  MIN_CORNER_RADIUS,
  MAX_CORNER_RADIUS,
  GLOBAL_CORNER_RADIUS_STORAGE_KEY,
  GLOBAL_CORNER_RADIUS_SYNC_EVENT,
  WAVE_MOTION_STORAGE_KEY,
  WAVE_MOTION_SYNC_EVENT,
  CUSTOM_SURFACE_COLOR_STORAGE_KEY,
  CUSTOM_SURFACE_COLOR_SYNC_EVENT,
  CUSTOM_PRIMARY_COLOR_STORAGE_KEY,
  CUSTOM_PRIMARY_COLOR_SYNC_EVENT,
  CARD_EFFECT_STORAGE_KEY,
  CARD_EFFECT_SYNC_EVENT,
  GLASS_CUSTOMIZATION_STORAGE_KEY,
  GLASS_CUSTOMIZATION_SYNC_EVENT,
  AUTO_TIME_THEME_STORAGE_KEY,
  AUTO_TIME_THEME_SYNC_EVENT,
  THEME_BACKGROUNDS,
  THEME_CARD_SPECS,
  THEME_DEFAULT_GLASS_SETTINGS,
  THEME_DEFAULT_WALLPAPER_ID,
  WALLPAPER_MANUAL_STORAGE_KEY,
  WALLPAPER_OVERLAY_STORAGE_KEY,
  ADAPTIVE_ACCENT_STORAGE_KEY,
  getThemeNativeSurfaceDepth,
} from '../config/ui/themeDefaults';
import {
  AdaptiveAccentPalette,
  CardEffectMode,
  CardStyleMode,
  ColorSchemeMode,
  GlassCustomization,
  SurfaceDepthMode,
  WallpaperOverlaySettings,
  WaveMotionMode,
} from '../config/ui/theme.types';
import {
  analyzeWallpaperColors,
  applyAdaptiveAccentVariables,
  getInstantWallpaperAccent,
} from '../utils/wallpaperColorAnalyzer';
import {
  CARD_STYLES_MAP,
  VALID_CARD_STYLES,
  getCardStyleProperties,
  getLightDarkCounterpart,
  normalizeCardStyle,
} from '../config/ui/cardStyles';
import {
  applyThemeStudioConfigToDocument,
  clearThemeStudioVariablesFromDocument,
  isIridescentTheme,
  loadStudioConfigForTheme,
  THEME_STUDIO_SYNC_EVENT,
  ThemeStudioConfig,
} from '../config/ui/iridescentConfig';
import { SoundEngine } from '../components/ui/SoundEngine';

const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';

type GlassCustomizationMap = Partial<Record<CardStyleMode, GlassCustomization>>;

function clampGlassSettings(raw?: Partial<GlassCustomization>, fallback?: GlassCustomization): GlassCustomization {
  const base = fallback || { cardOpacity: 74, blurIntensity: 22 };
  const rawOpacity = typeof raw?.cardOpacity === 'number' && Number.isFinite(raw.cardOpacity) ? raw.cardOpacity : base.cardOpacity;
  const rawBlur = typeof raw?.blurIntensity === 'number' && Number.isFinite(raw.blurIntensity) ? raw.blurIntensity : base.blurIntensity;
  return {
    cardOpacity: Math.min(100, Math.max(15, Math.round(rawOpacity))),
    blurIntensity: Math.min(48, Math.max(0, Math.round(rawBlur))),
  };
}

function readStoredGlassCustomizations(): GlassCustomizationMap {
  try {
    const raw = localStorage.getItem(GLASS_CUSTOMIZATION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<GlassCustomization>>;
    if (!parsed || typeof parsed !== 'object') return {};
    const clean: GlassCustomizationMap = {};
    for (const mode of VALID_CARD_STYLES) {
      if (parsed[mode]) {
        clean[mode] = clampGlassSettings(parsed[mode], THEME_DEFAULT_GLASS_SETTINGS[mode]);
      }
    }
    return clean;
  } catch {
    return {};
  }
}

function applyGlassCssVariables(mode: CardStyleMode, settings: GlassCustomization) {
  const root = document.documentElement;
  const defaults = THEME_DEFAULT_GLASS_SETTINGS[mode];
  const isCustomOpacity = settings.cardOpacity !== defaults.cardOpacity;
  const isCustomBlur = settings.blurIntensity !== defaults.blurIntensity;

  if (isCustomBlur) {
    const blur = settings.blurIntensity;
    root.setAttribute('data-custom-blur', 'true');
    root.style.setProperty('--bg-blur', `${blur}px`);
    root.style.setProperty('--glass-blur', `${blur}px`);
    root.style.setProperty('--blur-subcard', `${Math.round(blur * 0.8)}px`);
    root.style.setProperty('--blur-nav-pill', `${Math.round(blur * 0.85)}px`);
    root.style.setProperty('--blur-modal', `${Math.min(48, Math.round(blur * 1.15))}px`);
    root.style.setProperty('--surface-primary-blur', `${blur}px`);
    root.style.setProperty('--surface-secondary-blur', `${blur}px`);
    root.style.setProperty('--surface-tertiary-blur', `${Math.round(blur * 0.8)}px`);
    root.style.setProperty('--surface-interactive-blur', `${Math.round(blur * 0.85)}px`);
  } else {
    root.removeAttribute('data-custom-blur');
    root.style.removeProperty('--bg-blur');
    root.style.removeProperty('--glass-blur');
    root.style.removeProperty('--blur-subcard');
    root.style.removeProperty('--blur-nav-pill');
    root.style.removeProperty('--blur-modal');
    root.style.removeProperty('--surface-primary-blur');
    root.style.removeProperty('--surface-secondary-blur');
    root.style.removeProperty('--surface-tertiary-blur');
    root.style.removeProperty('--surface-interactive-blur');
  }

  if (isCustomOpacity) {
    const alpha = Math.max(0.15, Math.min(1, settings.cardOpacity / 100));
    const subcardAlpha = Math.max(0.15, Math.min(1, alpha * 1.02));
    const headerAlpha = alpha;
    const popupAlpha = Math.max(0.58, Math.min(1, alpha + 0.16));
    root.setAttribute('data-custom-opacity', 'true');
    root.style.setProperty('--card-alpha', alpha.toFixed(2));
    root.style.setProperty('--subcard-alpha', subcardAlpha.toFixed(2));
    root.style.setProperty('--header-alpha', headerAlpha.toFixed(2));
    root.style.setProperty('--popup-alpha', popupAlpha.toFixed(2));
  } else {
    root.removeAttribute('data-custom-opacity');
    root.style.removeProperty('--card-alpha');
    root.style.removeProperty('--subcard-alpha');
    root.style.removeProperty('--header-alpha');
    root.style.removeProperty('--popup-alpha');
  }
}

const DEFAULT_WALLPAPER_OVERLAY: WallpaperOverlaySettings = { blur: 0, dim: 0 };

function applyWallpaperOverlayCssVariables(settings: WallpaperOverlaySettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const blur = settings.blur || 0;
  const dim = settings.dim || 0;
  root.style.setProperty('--wallpaper-bg-blur', `${blur}px`);
  root.style.setProperty('--wallpaper-bg-dim', (dim / 100).toFixed(2));
  root.style.setProperty('--wallpaper-bg-scale', '1');
}

function getDefaultWallpaperForTheme(mode: CardStyleMode): WallpaperPreset {
  const targetId = THEME_DEFAULT_WALLPAPER_ID[mode];
  return WALLPAPER_PRESETS_LIST.find((w) => w.id === targetId) || WALLPAPER_PRESETS_LIST[0];
}

function clampCornerRadius(raw: unknown): number {
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(num)) return DEFAULT_CORNER_RADIUS;
  return Math.min(MAX_CORNER_RADIUS, Math.max(MIN_CORNER_RADIUS, Math.round(num)));
}

function readInitialCornerRadius(): number {
  if (typeof window === 'undefined') return DEFAULT_CORNER_RADIUS;
  try {
    const saved = localStorage.getItem(GLOBAL_CORNER_RADIUS_STORAGE_KEY);
    if (saved === null || saved === '') return DEFAULT_CORNER_RADIUS;
    return clampCornerRadius(saved);
  } catch {
    return DEFAULT_CORNER_RADIUS;
  }
}

function applyGlobalCornerRadiusCssVariables(radius: number): void {
  if (typeof document === 'undefined') return;
  const r = clampCornerRadius(radius);
  const px = `${r}px`;
  const targets: HTMLElement[] = [document.documentElement];
  if (document.body) {
    targets.push(document.body);
  }
  for (const el of targets) {
    el.style.setProperty('--radius-global', px, 'important');
    el.style.setProperty('--radius-main', px, 'important');
    el.style.setProperty('--radius-card', px, 'important');
    el.style.setProperty('--radius-subcard', px, 'important');
    el.style.setProperty('--radius-banner', px, 'important');
    el.style.setProperty('--radius-media', px, 'important');
    el.style.setProperty('--radius-video', px, 'important');
    el.style.setProperty('--radius-image', px, 'important');
    el.style.setProperty('--radius-modal', px, 'important');
    el.style.setProperty('--radius-popup', px, 'important');
    el.style.setProperty('--radius-widget', px, 'important');
    el.style.setProperty('--radius-input', px, 'important');
    el.style.setProperty('--radius-primary-surface', px, 'important');
    el.style.setProperty('--surface-radius-main', px, 'important');
    el.style.setProperty('--surface-radius-header', px, 'important');
    el.style.setProperty('--radius-header', px, 'important');
    el.style.setProperty('--surface-radius-footer', px, 'important');
    el.style.setProperty('--radius-footer', px, 'important');
  }
}

function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function getRelativeLum(r: number, g: number, b: number): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function clampByteVal(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toHexColor(r: number, g: number, b: number): string {
  return (
    '#' +
    [clampByteVal(r), clampByteVal(g), clampByteVal(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function applyCustomSurfaceColorVariables(surfaceColor: string): void {
  if (typeof document === 'undefined') return;
  const targets: HTMLElement[] = [document.documentElement];
  if (document.body) targets.push(document.body);

  const props = [
    '--bg-main',
    '--bg-card',
    '--bg-card-hover',
    '--bg-subcard',
    '--bg-subcard-hover',
    '--bg-header',
    '--bg-footer',
    '--surface-primary-bg',
    '--surface-secondary-bg',
    '--surface-tertiary-bg',
    '--glass-main-bg',
    '--surface-card-glass',
    '--text-primary',
    '--text-heading',
    '--text-secondary',
    '--text-muted',
    '--border-subcard',
    '--border-color',
  ];

  const rgb = surfaceColor !== 'default' ? parseHexRgb(surfaceColor) : null;
  if (!rgb) {
    for (const el of targets) {
      el.removeAttribute('data-custom-surface');
      for (const prop of props) el.style.removeProperty(prop);
    }
    return;
  }

  const lum = getRelativeLum(rgb.r, rgb.g, rgb.b);
  const darkSurface = lum < 0.42;
  const mainBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkSurface ? 0.78 : 0.72})`;
  const cardBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkSurface ? 0.84 : 0.80})`;
  const cardHover = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkSurface ? 0.92 : 0.90})`;
  const subR = darkSurface ? clampByteVal(rgb.r + 12) : clampByteVal(rgb.r - 4);
  const subG = darkSurface ? clampByteVal(rgb.g + 14) : clampByteVal(rgb.g - 3);
  const subB = darkSurface ? clampByteVal(rgb.b + 18) : clampByteVal(rgb.b - 1);
  const subcardBg = `rgba(${subR}, ${subG}, ${subB}, ${darkSurface ? 0.88 : 0.88})`;
  const subcardHover = `rgba(${subR}, ${subG}, ${subB}, 0.95)`;
  const chromeBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkSurface ? 0.86 : 0.84})`;

  const textPrimary = darkSurface ? '#F8FAFC' : '#0F172A';
  const textHeading = darkSurface ? '#FFFFFF' : '#0F172A';
  const textSecondary = darkSurface ? '#CBD5E1' : '#475569';
  const textMuted = darkSurface ? '#94A3B8' : '#64748B';
  const borderCol = darkSurface ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.12)';

  for (const el of targets) {
    el.setAttribute('data-custom-surface', 'true');
    el.style.setProperty('--bg-main', mainBg, 'important');
    el.style.setProperty('--surface-primary-bg', mainBg, 'important');
    el.style.setProperty('--glass-main-bg', mainBg, 'important');
    el.style.setProperty('--bg-card', cardBg, 'important');
    el.style.setProperty('--surface-secondary-bg', cardBg, 'important');
    el.style.setProperty('--surface-card-glass', cardBg, 'important');
    el.style.setProperty('--bg-card-hover', cardHover, 'important');
    el.style.setProperty('--bg-subcard', subcardBg, 'important');
    el.style.setProperty('--surface-tertiary-bg', subcardBg, 'important');
    el.style.setProperty('--bg-subcard-hover', subcardHover, 'important');
    el.style.setProperty('--bg-header', chromeBg, 'important');
    el.style.setProperty('--bg-footer', chromeBg, 'important');
    el.style.setProperty('--text-primary', textPrimary, 'important');
    el.style.setProperty('--text-heading', textHeading, 'important');
    el.style.setProperty('--text-secondary', textSecondary, 'important');
    el.style.setProperty('--text-muted', textMuted, 'important');
    el.style.setProperty('--border-subcard', borderCol, 'important');
    el.style.setProperty('--border-color', borderCol, 'important');
  }
}

function applyCustomPrimaryColorVariables(primaryColor: string, isThemeDark: boolean): void {
  if (typeof document === 'undefined') return;
  const targets: HTMLElement[] = [document.documentElement];
  if (document.body) targets.push(document.body);

  const props = [
    '--color-primary',
    '--color-accent',
    '--color-focus-ring',
    '--text-link',
    '--text-accent',
    '--text-badge',
    '--bg-button-primary',
    '--surface-interactive-active',
    '--color-primary-rgb',
    '--text-button-primary',
  ];

  const rgb = primaryColor !== 'default' ? parseHexRgb(primaryColor) : null;
  if (!rgb) {
    for (const el of targets) {
      el.removeAttribute('data-custom-primary');
      for (const prop of props) el.style.removeProperty(prop);
    }
    return;
  }

  const primaryHex = toHexColor(rgb.r, rgb.g, rgb.b);
  const gradEnd = toHexColor(
    rgb.r + (isThemeDark ? 24 : -18),
    rgb.g + (isThemeDark ? 24 : -12),
    rgb.b + (isThemeDark ? 28 : 16)
  );
  const linkHex = isThemeDark
    ? toHexColor(rgb.r + (255 - rgb.r) * 0.32, rgb.g + (255 - rgb.g) * 0.32, rgb.b + (255 - rgb.b) * 0.32)
    : primaryHex;
  const btnLum = getRelativeLum(rgb.r, rgb.g, rgb.b);
  const btnText = btnLum > 0.62 ? '#0F172A' : '#FFFFFF';
  const btnGrad = `linear-gradient(135deg, ${primaryHex} 0%, ${gradEnd} 100%)`;

  for (const el of targets) {
    el.setAttribute('data-custom-primary', 'true');
    el.style.setProperty('--color-primary', primaryHex, 'important');
    el.style.setProperty('--color-accent', primaryHex, 'important');
    el.style.setProperty('--color-focus-ring', primaryHex, 'important');
    el.style.setProperty('--text-link', linkHex, 'important');
    el.style.setProperty('--text-accent', linkHex, 'important');
    el.style.setProperty('--text-badge', linkHex, 'important');
    el.style.setProperty('--bg-button-primary', btnGrad, 'important');
    el.style.setProperty('--surface-interactive-active', btnGrad, 'important');
    el.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`, 'important');
    el.style.setProperty('--text-button-primary', btnText, 'important');
  }
}

export interface ThemeContextType {
  isDark: boolean;
  colorSchemeMode: ColorSchemeMode;
  setColorSchemeMode: (mode: ColorSchemeMode) => void;
  currentWallpaper: string;
  activeWallpaper: WallpaperPreset;
  setWallpaper: (wpOrBg: WallpaperPreset | string) => void;
  wallpaperOverlay: WallpaperOverlaySettings;
  updateWallpaperOverlay: (patch: Partial<WallpaperOverlaySettings>) => void;
  resetWallpaperOverlay: () => void;
  adaptiveAccentEnabled: boolean;
  setAdaptiveAccentEnabled: (enabled: boolean) => void;
  suggestedAccent: AdaptiveAccentPalette | null;
  cardStyle: CardStyleMode;
  setCardStyle: (mode: CardStyleMode) => void;
  toggleLightDark: (targetDark?: boolean) => void;
  getCardStyleProps: (mode?: CardStyleMode) => React.CSSProperties;
  glassSettings: GlassCustomization;
  getGlassSettingsForMode: (mode: CardStyleMode) => GlassCustomization;
  isGlassCustomized: (mode?: CardStyleMode) => boolean;
  updateGlassSettings: (patch: Partial<GlassCustomization>, targetMode?: CardStyleMode) => void;
  resetGlassSettings: (targetMode?: CardStyleMode) => void;
  surfaceDepth: SurfaceDepthMode;
  autoTimeTheme: boolean;
  setAutoTimeTheme: (enabled: boolean) => void;
  toggleAutoTimeTheme: () => void;
  cornerRadius: number;
  setCornerRadius: (radius: number) => void;
  resetCornerRadius: () => void;
  waveMotion: WaveMotionMode;
  setWaveMotion: (mode: WaveMotionMode) => void;
  customSurfaceColor: string;
  setCustomSurfaceColor: (color: string) => void;
  customPrimaryColor: string;
  setCustomPrimaryColor: (color: string) => void;
  cardEffect: CardEffectMode;
  setCardEffect: (effect: CardEffectMode) => void;
  resetInterfaceCustomColors: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveCardStyleDark(style: CardStyleMode): boolean {
  return Boolean(CARD_STYLES_MAP[style]?.isDark);
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const DEFAULT_UI_SEED_KEY = 'hungthai_default_ui_seed_v2026_liquid_glass_wp32_v6';
const DEFAULT_OVERLAY_RESET_SEED_KEY = 'hungthai_overlay_reset_0px_0pct_v3';
let didRunDefaultUiSeed = false;

function ensureDefaultUiSeedSync(): void {
  if (didRunDefaultUiSeed || typeof window === 'undefined') return;
  didRunDefaultUiSeed = true;
  try {
    if (localStorage.getItem(DEFAULT_UI_SEED_KEY) !== '1') {
      const keysToClear = [
        CARD_STYLE_STORAGE_KEY,
        VISUAL_THEME_MODE_STORAGE_KEY,
        LAST_STANDARD_CARD_STYLE_STORAGE_KEY,
        'hungthai_card_style',
        'hungthai_card_style_manual',
        'hungthai_last_dark_style',
        'hungthai_last_light_style',
        COLOR_SCHEME_MODE_STORAGE_KEY,
        'theme_mode',
        WALLPAPER_MANUAL_STORAGE_KEY,
        ACTIVE_WALLPAPER_STORAGE_KEY,
        'theme_wallpaper',
        WALLPAPER_OVERLAY_STORAGE_KEY,
        ADAPTIVE_ACCENT_STORAGE_KEY,
        AUTO_TIME_THEME_STORAGE_KEY,
        GLASS_CUSTOMIZATION_STORAGE_KEY,
        'hungthai_layer_depth_v1',
        'hungthai_surface_depth_v1',
        CUSTOM_SURFACE_COLOR_STORAGE_KEY,
        CUSTOM_PRIMARY_COLOR_STORAGE_KEY,
        CARD_EFFECT_STORAGE_KEY,
        'hungthai_interface_ui_prefs_v1',
        'hungthai_about_view_mode',
        'hungthai_bento_palette',
        'hungthai_letter_active_slide',
        'hungthai_font_scale_v1',
      ];
      for (const key of keysToClear) {
        localStorage.removeItem(key);
      }
      localStorage.setItem(DEFAULT_UI_SEED_KEY, '1');
    }
    if (localStorage.getItem(DEFAULT_OVERLAY_RESET_SEED_KEY) !== '1') {
      localStorage.removeItem(WALLPAPER_OVERLAY_STORAGE_KEY);
      localStorage.removeItem(ADAPTIVE_ACCENT_STORAGE_KEY);
      localStorage.removeItem('hungthai_layer_depth_v1');
      localStorage.removeItem('hungthai_surface_depth_v1');
      localStorage.setItem(DEFAULT_OVERLAY_RESET_SEED_KEY, '1');
    }
  } catch {
    // ignore storage errors
  }
}

function readInitialColorSchemeMode(): ColorSchemeMode {
  ensureDefaultUiSeedSync();
  try {
    const savedMode = localStorage.getItem(COLOR_SCHEME_MODE_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
      return savedMode;
    }
    const savedStyle = localStorage.getItem(CARD_STYLE_STORAGE_KEY);
    if (savedStyle) {
      const normalized = normalizeCardStyle(savedStyle);
      return resolveCardStyleDark(normalized) ? 'dark' : 'light';
    }
  } catch {
    // ignore
  }
  return 'light';
}

function readInitialCardStyle(initialSchemeMode: ColorSchemeMode): CardStyleMode {
  ensureDefaultUiSeedSync();
  try {
    const savedStyle = localStorage.getItem(CARD_STYLE_STORAGE_KEY);
    let baseStyle = savedStyle ? normalizeCardStyle(savedStyle) : DEFAULT_CARD_STYLE;
    if (!savedStyle) {
      const savedVisualMode = localStorage.getItem(VISUAL_THEME_MODE_STORAGE_KEY);
      if (savedVisualMode === 'neumorphism') {
        baseStyle = 'frost-ice-neu';
      }
    }
    if (initialSchemeMode === 'system') {
      return getLightDarkCounterpart(baseStyle, getSystemPrefersDark());
    }
    return baseStyle;
  } catch {
    return DEFAULT_CARD_STYLE;
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [colorSchemeMode, setColorSchemeModeState] = useState<ColorSchemeMode>(() => readInitialColorSchemeMode());

  const [cardStyle, setCardStyleState] = useState<CardStyleMode>(() =>
    readInitialCardStyle(readInitialColorSchemeMode())
  );

  const [activeWallpaper, setActiveWallpaper] = useState<WallpaperPreset>(() => {
    const initialMode = readInitialColorSchemeMode();
    const initialStyle = readInitialCardStyle(initialMode);
    try {
      const hasManualWallpaper = localStorage.getItem(WALLPAPER_MANUAL_STORAGE_KEY) === '1';
      if (hasManualWallpaper) {
        const savedJson = localStorage.getItem(ACTIVE_WALLPAPER_STORAGE_KEY);
        if (savedJson) {
          const parsed = JSON.parse(savedJson) as WallpaperPreset;
          if (parsed && parsed.id && !isCodePenWallpaper(parsed)) {
            if (parsed.id === 'none') return parsed;
            const presetMatch = WALLPAPER_PRESETS_LIST.find((w) => w.id === parsed.id);
            const merged = presetMatch
              ? presetMatch.id.startsWith('theme-bg-') && !presetMatch.isCustom
                ? { ...parsed, ...presetMatch }
                : { ...presetMatch, ...parsed }
              : parsed;
            if (
              merged.value ||
              merged.bg ||
              (merged.previewStyle && Object.keys(merged.previewStyle).length > 0)
            ) {
              return merged;
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
    return getDefaultWallpaperForTheme(initialStyle);
  });

  const wallpaperOverlay = DEFAULT_WALLPAPER_OVERLAY;
  const adaptiveAccentEnabled = false;

  const [suggestedAccent, setSuggestedAccent] = useState<AdaptiveAccentPalette | null>(() =>
    getInstantWallpaperAccent(getDefaultWallpaperForTheme(DEFAULT_CARD_STYLE))
  );

  const [glassCustomizations, setGlassCustomizations] = useState<GlassCustomizationMap>(() =>
    readStoredGlassCustomizations()
  );

  const surfaceDepth: SurfaceDepthMode = getThemeNativeSurfaceDepth(cardStyle);

  const [autoTimeTheme, setAutoTimeThemeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTO_TIME_THEME_STORAGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [cornerRadius, setCornerRadiusState] = useState<number>(() => readInitialCornerRadius());

  const [waveMotion, setWaveMotionState] = useState<WaveMotionMode>(() => {
    if (typeof window === 'undefined') return DEFAULT_WAVE_MOTION;
    try {
      const saved = localStorage.getItem(WAVE_MOTION_STORAGE_KEY);
      if (saved === 'off' || saved === 'gentle' || saved === 'normal' || saved === 'vivid') {
        return saved;
      }
    } catch {
      // ignore
    }
    return DEFAULT_WAVE_MOTION;
  });

  const [customSurfaceColor, setCustomSurfaceColorState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'default';
    try {
      const saved = localStorage.getItem(CUSTOM_SURFACE_COLOR_STORAGE_KEY);
      if (saved && (saved === 'default' || /^#[0-9a-fA-F]{6}$/.test(saved))) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'default';
  });

  const [customPrimaryColor, setCustomPrimaryColorState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'default';
    try {
      const saved = localStorage.getItem(CUSTOM_PRIMARY_COLOR_STORAGE_KEY);
      if (saved && (saved === 'default' || /^#[0-9a-fA-F]{6}$/.test(saved))) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'default';
  });

  const [cardEffect, setCardEffectState] = useState<CardEffectMode>(() => {
    if (typeof window === 'undefined') return DEFAULT_CARD_EFFECT;
    try {
      const saved = localStorage.getItem(CARD_EFFECT_STORAGE_KEY);
      if (
        saved === 'default' ||
        saved === 'float' ||
        saved === 'inset' ||
        saved === 'glow' ||
        saved === 'shine' ||
        saved === 'tilt' ||
        saved === 'static'
      ) {
        return saved;
      }
    } catch {
      // ignore
    }
    return THEME_CARD_SPECS[readInitialCardStyle(readInitialColorSchemeMode())]?.defaultCardEffect || DEFAULT_CARD_EFFECT;
  });

  const setWaveMotion = useCallback((mode: WaveMotionMode) => {
    const valid: WaveMotionMode =
      mode === 'off' || mode === 'gentle' || mode === 'normal' || mode === 'vivid'
        ? mode
        : DEFAULT_WAVE_MOTION;
    setWaveMotionState(valid);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-wave-motion', valid);
      if (document.body) {
        document.body.setAttribute('data-wave-motion', valid);
      }
    }
    try {
      localStorage.setItem(WAVE_MOTION_STORAGE_KEY, valid);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(WAVE_MOTION_SYNC_EVENT, { detail: valid }));
  }, []);

  const setCustomSurfaceColor = useCallback((rawColor: string) => {
    const nextVal = rawColor !== 'default' && parseHexRgb(rawColor) ? rawColor.toUpperCase() : 'default';
    setCustomSurfaceColorState(nextVal);
    applyCustomSurfaceColorVariables(nextVal);
    try {
      if (nextVal === 'default') {
        localStorage.removeItem(CUSTOM_SURFACE_COLOR_STORAGE_KEY);
      } else {
        localStorage.setItem(CUSTOM_SURFACE_COLOR_STORAGE_KEY, nextVal);
      }
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(CUSTOM_SURFACE_COLOR_SYNC_EVENT, { detail: nextVal }));
  }, []);

  const setCustomPrimaryColor = useCallback(
    (rawColor: string) => {
      const nextVal = rawColor !== 'default' && parseHexRgb(rawColor) ? rawColor.toUpperCase() : 'default';
      setCustomPrimaryColorState(nextVal);
      applyCustomPrimaryColorVariables(nextVal, resolveCardStyleDark(cardStyleRef.current));
      try {
        if (nextVal === 'default') {
          localStorage.removeItem(CUSTOM_PRIMARY_COLOR_STORAGE_KEY);
        } else {
          localStorage.setItem(CUSTOM_PRIMARY_COLOR_STORAGE_KEY, nextVal);
        }
      } catch {
        // ignore
      }
      window.dispatchEvent(new CustomEvent(CUSTOM_PRIMARY_COLOR_SYNC_EVENT, { detail: nextVal }));
    },
    []
  );

  const setCardEffect = useCallback((effect: CardEffectMode) => {
    const valid: CardEffectMode =
      effect === 'default' ||
      effect === 'float' ||
      effect === 'inset' ||
      effect === 'glow' ||
      effect === 'shine' ||
      effect === 'tilt' ||
      effect === 'static'
        ? effect
        : THEME_CARD_SPECS[cardStyleRef.current]?.defaultCardEffect || DEFAULT_CARD_EFFECT;
    setCardEffectState(valid);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-card-effect', valid);
      if (document.body) {
        document.body.setAttribute('data-card-effect', valid);
      }
    }
    try {
      if (valid === 'default') {
        localStorage.removeItem(CARD_EFFECT_STORAGE_KEY);
      } else {
        localStorage.setItem(CARD_EFFECT_STORAGE_KEY, valid);
      }
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(CARD_EFFECT_SYNC_EVENT, { detail: valid }));
  }, []);

  const resetInterfaceCustomColors = useCallback(() => {
    setCustomSurfaceColor('default');
    setCustomPrimaryColor('default');
    setCardEffect(THEME_CARD_SPECS[cardStyleRef.current]?.defaultCardEffect || 'default');
  }, [setCustomSurfaceColor, setCustomPrimaryColor, setCardEffect]);

  const setCornerRadius = useCallback((rawRadius: number) => {
    const clamped = clampCornerRadius(rawRadius);
    setCornerRadiusState(clamped);
    applyGlobalCornerRadiusCssVariables(clamped);
    try {
      localStorage.setItem(GLOBAL_CORNER_RADIUS_STORAGE_KEY, String(clamped));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(GLOBAL_CORNER_RADIUS_SYNC_EVENT, { detail: clamped }));
  }, []);

  const resetCornerRadius = useCallback(() => {
    setCornerRadius(DEFAULT_CORNER_RADIUS);
  }, [setCornerRadius]);

  const setAutoTimeTheme = useCallback((enabled: boolean) => {
    setAutoTimeThemeState(enabled);
    try {
      localStorage.setItem(AUTO_TIME_THEME_STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(AUTO_TIME_THEME_SYNC_EVENT, { detail: enabled }));
  }, []);

  const toggleAutoTimeTheme = useCallback(() => {
    setAutoTimeTheme(!autoTimeTheme);
  }, [autoTimeTheme, setAutoTimeTheme]);

  useEffect(() => {
    if (!autoTimeTheme) return;
    const checkTimeTheme = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      const targetStyle = getLightDarkCounterpart(cardStyle, isNight);
      if (targetStyle !== cardStyle) {
        setCardStyle(targetStyle);
      }
    };
    checkTimeTheme();
    const interval = setInterval(checkTimeTheme, 60000);
    return () => clearInterval(interval);
  }, [autoTimeTheme, cardStyle]);

  const activeWallpaperIdRef = useRef<string>(activeWallpaper.id);
  useEffect(() => {
    activeWallpaperIdRef.current = activeWallpaper.id;
  }, [activeWallpaper.id]);

  const cardStyleRef = useRef<CardStyleMode>(cardStyle);
  useEffect(() => {
    cardStyleRef.current = cardStyle;
  }, [cardStyle]);

  const isDark = resolveCardStyleDark(cardStyle);

  const getGlassSettingsForMode = useCallback(
    (mode: CardStyleMode): GlassCustomization => {
      const defaults = THEME_DEFAULT_GLASS_SETTINGS[mode] || THEME_DEFAULT_GLASS_SETTINGS[DEFAULT_CARD_STYLE];
      const custom = glassCustomizations[mode];
      return custom ? clampGlassSettings(custom, defaults) : { ...defaults };
    },
    [glassCustomizations]
  );

  const glassSettings = getGlassSettingsForMode(cardStyle);

  const isGlassCustomized = useCallback(
    (mode?: CardStyleMode): boolean => {
      const target = mode || cardStyle;
      const defaults = THEME_DEFAULT_GLASS_SETTINGS[target];
      const current = getGlassSettingsForMode(target);
      return current.cardOpacity !== defaults.cardOpacity || current.blurIntensity !== defaults.blurIntensity;
    },
    [cardStyle, getGlassSettingsForMode]
  );

  useEffect(() => {
    applyGlassCssVariables(cardStyle, glassSettings);
  }, [cardStyle, glassSettings]);

  useEffect(() => {
    applyWallpaperOverlayCssVariables(wallpaperOverlay);
  }, [wallpaperOverlay]);

  const effectiveAccentTarget = activeWallpaper;

  useEffect(() => {
    let cancelled = false;
    const instant = getInstantWallpaperAccent(effectiveAccentTarget);
    setSuggestedAccent(instant);
    if (!adaptiveAccentEnabled) {
      return () => {
        cancelled = true;
      };
    }
    analyzeWallpaperColors(effectiveAccentTarget).then((analyzed) => {
      if (!cancelled) {
        setSuggestedAccent(analyzed);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveAccentTarget, adaptiveAccentEnabled]);

  useEffect(() => {
    applyAdaptiveAccentVariables(suggestedAccent, adaptiveAccentEnabled, isDark);
  }, [suggestedAccent, adaptiveAccentEnabled, isDark]);

  // Sync cardStyle & single-mode theme attributes to HTML root & Body
  useEffect(() => {
    const nextDark = resolveCardStyleDark(cardStyle);
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, cardStyle);
      const isNeu = isNeumorphismCardStyle(cardStyle);
      localStorage.setItem(VISUAL_THEME_MODE_STORAGE_KEY, isNeu ? 'neumorphism' : 'standard');
      if (!isNeu) {
        localStorage.setItem(LAST_STANDARD_CARD_STYLE_STORAGE_KEY, cardStyle);
      }
      localStorage.removeItem('theme_mode');
    } catch (e) {
      // ignore
    }

    const mechanism = CARD_STYLES_MAP[cardStyle]?.mechanism || (nextDark ? 'dark' : 'light');

    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', cardStyle);
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', cardStyle);
      document.documentElement.setAttribute('data-theme-mode', 'light');
    }

    document.documentElement.setAttribute('data-theme-mechanism', mechanism);
    document.documentElement.setAttribute('data-card-style', cardStyle);
    if (document.body) {
      document.body.setAttribute('data-card-style', cardStyle);
      document.body.setAttribute('data-theme-mechanism', mechanism);
    }
    SoundEngine.setThemeSoundMode(cardStyle);
  }, [cardStyle]);

  // Sync Iridescent Liquid Glass per-theme studio CSS variables & sound settings globally
  useEffect(() => {
    const syncStudio = (overrideConfig?: ThemeStudioConfig) => {
      SoundEngine.setThemeSoundMode(cardStyle);
      if (isIridescentTheme(cardStyle)) {
        const cfg = overrideConfig || loadStudioConfigForTheme(cardStyle);
        applyThemeStudioConfigToDocument(cfg, cardStyle);
        SoundEngine.configureStudioSound(cfg.sound);
      } else {
        clearThemeStudioVariablesFromDocument();
        SoundEngine.configureStudioSound(null);
      }
    };

    syncStudio();

    const handleStudioEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ themeId?: CardStyleMode; config?: ThemeStudioConfig }>).detail;
      if (detail?.themeId && detail.themeId === cardStyle && detail.config) {
        syncStudio(detail.config);
      } else {
        syncStudio();
      }
    };

    window.addEventListener(THEME_STUDIO_SYNC_EVENT, handleStudioEvent);
    return () => {
      window.removeEventListener(THEME_STUDIO_SYNC_EVENT, handleStudioEvent);
    };
  }, [cardStyle]);

  // Sync theme-native surface depth ('flat' for Flat Soft UI & Minimalism, 'depth' for volumetric themes)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const targets: HTMLElement[] = [document.documentElement];
    if (document.body) targets.push(document.body);
    try {
      localStorage.removeItem('hungthai_layer_depth_v1');
      localStorage.removeItem('hungthai_surface_depth_v1');
    } catch {
      // ignore
    }
    const staleProps = [
      '--layer-depth-scale',
      '--layer-l1-shadow',
      '--layer-l2-shadow',
      '--layer-l2-hover-shadow',
      '--layer-l3-shadow',
      '--layer-l3-hover-shadow',
      '--layer-l2-lift',
      '--layer-l3-lift',
    ];
    for (const el of targets) {
      el.setAttribute('data-surface-depth', surfaceDepth);
      el.removeAttribute('data-layer-depth');
      for (const prop of staleProps) {
        el.style.removeProperty(prop);
      }
    }
  }, [surfaceDepth, cardStyle]);

  useEffect(() => {
    applyGlobalCornerRadiusCssVariables(cornerRadius);
  }, [cornerRadius, cardStyle]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-wave-motion', waveMotion);
    if (document.body) {
      document.body.setAttribute('data-wave-motion', waveMotion);
    }
  }, [waveMotion]);

  useEffect(() => {
    applyCustomSurfaceColorVariables(customSurfaceColor);
  }, [customSurfaceColor, cardStyle]);

  useEffect(() => {
    applyCustomPrimaryColorVariables(customPrimaryColor, isDark);
  }, [customPrimaryColor, isDark, cardStyle]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const effectiveEffect =
      cardEffect === 'default'
        ? THEME_CARD_SPECS[cardStyle]?.defaultCardEffect || 'float'
        : cardEffect;
    document.documentElement.setAttribute('data-card-effect', cardEffect);
    document.documentElement.setAttribute('data-effective-card-effect', effectiveEffect);
    if (document.body) {
      document.body.setAttribute('data-card-effect', cardEffect);
      document.body.setAttribute('data-effective-card-effect', effectiveEffect);
    }
  }, [cardEffect, cardStyle]);

  useEffect(() => {
    try {
      localStorage.removeItem('hungthai_font_scale_v1');
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-font-scale');
      document.documentElement.style.setProperty('--font-scale', '1');
      document.documentElement.style.zoom = '';
      if (document.body) {
        document.body.removeAttribute('data-font-scale');
        document.body.style.zoom = '';
      }
    }
  }, []);

  // Sync state between components
  useEffect(() => {
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent<WallpaperPreset>).detail;
      if (detail && detail.id) {
        setActiveWallpaper((prev) => (prev.id === detail.id && prev.value === detail.value ? prev : detail));
      }
    };
    const handleCardStyleSync = (e: Event) => {
      const nextStyle = normalizeCardStyle((e as CustomEvent<string>).detail);
      setCardStyleState((prev) => (prev === nextStyle ? prev : nextStyle));
    };
    const handleGlassSync = (e: Event) => {
      const detail = (e as CustomEvent<GlassCustomizationMap>).detail;
      if (detail && typeof detail === 'object') {
        setGlassCustomizations(detail);
      }
    };
    const handleAutoTimeThemeSync = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      if (typeof detail === 'boolean') {
        setAutoTimeThemeState(detail);
      }
    };
    const handleColorSchemeModeSync = (e: Event) => {
      const detail = (e as CustomEvent<ColorSchemeMode>).detail;
      if (detail === 'light' || detail === 'dark' || detail === 'system') {
        setColorSchemeModeState((prev) => (prev === detail ? prev : detail));
      }
    };
    const handleCornerRadiusSync = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === 'number' && Number.isFinite(detail)) {
        const clamped = clampCornerRadius(detail);
        setCornerRadiusState((prev) => (prev === clamped ? prev : clamped));
      }
    };
    const handleWaveMotionSync = (e: Event) => {
      const detail = (e as CustomEvent<WaveMotionMode>).detail;
      if (detail === 'off' || detail === 'gentle' || detail === 'normal' || detail === 'vivid') {
        setWaveMotionState((prev) => (prev === detail ? prev : detail));
      }
    };
    const handleCustomSurfaceSync = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === 'string') {
        setCustomSurfaceColorState((prev) => (prev === detail ? prev : detail));
      }
    };
    const handleCustomPrimarySync = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === 'string') {
        setCustomPrimaryColorState((prev) => (prev === detail ? prev : detail));
      }
    };
    const handleCardEffectSync = (e: Event) => {
      const detail = (e as CustomEvent<CardEffectMode>).detail;
      if (
        detail === 'default' ||
        detail === 'float' ||
        detail === 'inset' ||
        detail === 'glow' ||
        detail === 'shine' ||
        detail === 'tilt' ||
        detail === 'static'
      ) {
        setCardEffectState((prev) => (prev === detail ? prev : detail));
      }
    };
    window.addEventListener(WALLPAPER_SYNC_EVENT, handleSync);
    window.addEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    window.addEventListener(GLASS_CUSTOMIZATION_SYNC_EVENT, handleGlassSync);
    window.addEventListener(AUTO_TIME_THEME_SYNC_EVENT, handleAutoTimeThemeSync);
    window.addEventListener(COLOR_SCHEME_MODE_SYNC_EVENT, handleColorSchemeModeSync);
    window.addEventListener(GLOBAL_CORNER_RADIUS_SYNC_EVENT, handleCornerRadiusSync);
    window.addEventListener(WAVE_MOTION_SYNC_EVENT, handleWaveMotionSync);
    window.addEventListener(CUSTOM_SURFACE_COLOR_SYNC_EVENT, handleCustomSurfaceSync);
    window.addEventListener(CUSTOM_PRIMARY_COLOR_SYNC_EVENT, handleCustomPrimarySync);
    window.addEventListener(CARD_EFFECT_SYNC_EVENT, handleCardEffectSync);
    return () => {
      window.removeEventListener(WALLPAPER_SYNC_EVENT, handleSync);
      window.removeEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
      window.removeEventListener(GLASS_CUSTOMIZATION_SYNC_EVENT, handleGlassSync);
      window.removeEventListener(AUTO_TIME_THEME_SYNC_EVENT, handleAutoTimeThemeSync);
      window.removeEventListener(COLOR_SCHEME_MODE_SYNC_EVENT, handleColorSchemeModeSync);
      window.removeEventListener(GLOBAL_CORNER_RADIUS_SYNC_EVENT, handleCornerRadiusSync);
      window.removeEventListener(WAVE_MOTION_SYNC_EVENT, handleWaveMotionSync);
      window.removeEventListener(CUSTOM_SURFACE_COLOR_SYNC_EVENT, handleCustomSurfaceSync);
      window.removeEventListener(CUSTOM_PRIMARY_COLOR_SYNC_EVENT, handleCustomPrimarySync);
      window.removeEventListener(CARD_EFFECT_SYNC_EVENT, handleCardEffectSync);
    };
  }, []);

  // Update wallpaper styles on body & sync --theme-bg-* CSS custom properties
  useEffect(() => {
    const themeBgSpec = THEME_BACKGROUNDS[cardStyle] || THEME_BACKGROUNDS[DEFAULT_CARD_STYLE];
    const root = document.documentElement;
    root.style.setProperty('--theme-bg-fallback', themeBgSpec.fallbackGradient);
    root.style.setProperty('--theme-bg-overlay', themeBgSpec.overlayBg);

    try {
      localStorage.setItem(ACTIVE_WALLPAPER_STORAGE_KEY, JSON.stringify(activeWallpaper));
      localStorage.setItem('theme_wallpaper', activeWallpaper.value || activeWallpaper.bg || '');
    } catch (e) {
      // ignore
    }

    document.body.style.background = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundRepeat = '';

    let activeWpToRender = activeWallpaper;
    if (
      activeWallpaper.type === 'image' &&
      !activeWallpaper.isCustom &&
      activeWallpaper.id.startsWith('theme-bg-') &&
      activeWallpaper.id === THEME_DEFAULT_WALLPAPER_ID[cardStyle]
    ) {
      const autoBgUrl = getThemeBackgroundForMode(cardStyle, isDark);
      activeWpToRender = {
        ...activeWallpaper,
        value: autoBgUrl,
        bg: `url('${autoBgUrl}') center/cover no-repeat`,
      };
    }

    const hasWallpaper = !(
      activeWpToRender.id === 'none' ||
      (!activeWpToRender.value &&
        !activeWpToRender.bg &&
        (!activeWpToRender.previewStyle || Object.keys(activeWpToRender.previewStyle).length === 0))
    );
    root.setAttribute('data-has-wallpaper', hasWallpaper ? 'true' : 'false');
    if (document.body) {
      document.body.setAttribute('data-has-wallpaper', hasWallpaper ? 'true' : 'false');
    }
    applyWallpaperOverlayCssVariables(DEFAULT_WALLPAPER_OVERLAY);

    if (!hasWallpaper) {
      root.style.setProperty('--theme-bg-image', 'none');
      document.body.style.background = 'var(--app-bg-gradient, var(--ambient-base-bg, var(--theme-bg-fallback)))';
    } else if (activeWpToRender.type === 'image') {
      const imgVal = activeWpToRender.value || activeWpToRender.bg || '';
      const cleanUrl = getCleanImageUrl(imgVal);
      if (cleanUrl) {
        const optimizedUrl = toOptimizedWebPUrl(cleanUrl, { width: 1920, quality: 84 });
        root.style.setProperty('--theme-bg-image', `url('${optimizedUrl}')`);
        document.body.style.backgroundImage = `url('${optimizedUrl}'), ${themeBgSpec.fallbackGradient}`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
      }
    } else if (activeWpToRender.type === 'webgl') {
      root.style.setProperty('--theme-bg-image', 'none');
      const fallbackBg =
        activeWpToRender.value ||
        activeWpToRender.bg ||
        'radial-gradient(circle at center, #ffffff 0%, #ecefff 35%, #c2d1ff 100%)';
      document.body.style.background = fallbackBg;
    } else if (activeWpToRender.type === 'css' || activeWpToRender.type === 'gradient') {
      root.style.setProperty('--theme-bg-image', 'none');
      const cssText = activeWpToRender.value || activeWpToRender.bg || '';
      const parsed =
        activeWpToRender.previewStyle && Object.keys(activeWpToRender.previewStyle).length > 0
          ? activeWpToRender.previewStyle
          : parseCssStringToStyle(cssText);
      if (parsed.background) {
        document.body.style.background = String(parsed.background);
      } else if (parsed.backgroundImage) {
        document.body.style.backgroundImage = String(parsed.backgroundImage);
        if (parsed.backgroundColor) {
          document.body.style.backgroundColor = String(parsed.backgroundColor);
        }
        if (parsed.backgroundSize) {
          document.body.style.backgroundSize = String(parsed.backgroundSize);
        }
      } else if (cssText) {
        document.body.style.background = cssText;
      }
    } else {
      root.style.setProperty('--theme-bg-image', 'none');
      document.body.style.background = 'var(--app-bg-gradient, var(--ambient-base-bg, var(--theme-bg-fallback)))';
    }
  }, [activeWallpaper, cardStyle, isDark]);

  const setWallpaper = useCallback((wpOrBg: WallpaperPreset | string) => {
    let nextWp: WallpaperPreset;
    if (typeof wpOrBg === 'string') {
      const matched = WALLPAPER_PRESETS_LIST.find(
        (w) => w.value === wpOrBg || w.bg === wpOrBg || w.id === wpOrBg
      );
      if (matched) {
        nextWp = matched;
      } else {
        nextWp = {
          id: `custom-${Date.now()}`,
          name: 'Hình nền tùy chỉnh',
          type: wpOrBg.startsWith('http') ? 'image' : 'css',
          value: wpOrBg,
          bg: wpOrBg,
        };
      }
    } else {
      nextWp = { ...wpOrBg };
    }
    try {
      const activeDefaultId = THEME_DEFAULT_WALLPAPER_ID[cardStyleRef.current];
      if (nextWp.id === activeDefaultId) {
        localStorage.removeItem(WALLPAPER_MANUAL_STORAGE_KEY);
      } else {
        localStorage.setItem(WALLPAPER_MANUAL_STORAGE_KEY, '1');
      }
    } catch (e) {
      // ignore
    }
    activeWallpaperIdRef.current = nextWp.id;
    setActiveWallpaper(nextWp);
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: nextWp }));
  }, []);

  const applyCardStyleInternal = useCallback((mode: CardStyleMode, schemeOverride?: ColorSchemeMode) => {
    const normalized = normalizeCardStyle(mode);
    if (cardStyleRef.current !== normalized) {
      triggerThemeCrossFade();
    }
    const nextDark = resolveCardStyleDark(normalized);
    const defaultWp = getDefaultWallpaperForTheme(normalized);
    const resolvedScheme: ColorSchemeMode = schemeOverride || (nextDark ? 'dark' : 'light');
    const themeCardEffect = THEME_CARD_SPECS[normalized]?.defaultCardEffect || DEFAULT_CARD_EFFECT;

    cardStyleRef.current = normalized;
    setCardStyleState(normalized);
    setColorSchemeModeState(resolvedScheme);
    activeWallpaperIdRef.current = defaultWp.id;
    setActiveWallpaper(defaultWp);

    // Áp dụng màu dùng cho giao diện, màu chính và hiệu ứng card mặc định của giao diện mới
    setCustomSurfaceColorState('default');
    setCustomPrimaryColorState('default');
    setCardEffectState(themeCardEffect);
    applyCustomSurfaceColorVariables('default');
    applyCustomPrimaryColorVariables('default', nextDark);

    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, normalized);
      localStorage.setItem(COLOR_SCHEME_MODE_STORAGE_KEY, resolvedScheme);
      if (!schemeOverride) {
        localStorage.setItem('hungthai_card_style_manual', '1');
      }
      localStorage.setItem(
        nextDark ? 'hungthai_last_dark_style' : 'hungthai_last_light_style',
        normalized
      );
      localStorage.removeItem(WALLPAPER_MANUAL_STORAGE_KEY);
      localStorage.removeItem(CUSTOM_SURFACE_COLOR_STORAGE_KEY);
      localStorage.removeItem(CUSTOM_PRIMARY_COLOR_STORAGE_KEY);
      localStorage.removeItem(CARD_EFFECT_STORAGE_KEY);
      localStorage.setItem(ACTIVE_WALLPAPER_STORAGE_KEY, JSON.stringify(defaultWp));
      localStorage.setItem('theme_wallpaper', defaultWp.value || defaultWp.bg || '');
    } catch (e) {
      // ignore
    }
    const mechanism = CARD_STYLES_MAP[normalized]?.mechanism || (nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', normalized);
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', normalized);
      document.documentElement.setAttribute('data-theme-mode', 'light');
    }
    document.documentElement.setAttribute('data-theme-mechanism', mechanism);
    document.documentElement.setAttribute('data-card-style', normalized);
    document.documentElement.setAttribute('data-color-scheme-mode', resolvedScheme);
    document.documentElement.setAttribute('data-card-effect', themeCardEffect);
    if (document.body) {
      document.body.setAttribute('data-card-style', normalized);
      document.body.setAttribute('data-theme-mechanism', mechanism);
      document.body.setAttribute('data-color-scheme-mode', resolvedScheme);
      document.body.setAttribute('data-card-effect', themeCardEffect);
    }
    window.dispatchEvent(new CustomEvent(CARD_STYLE_SYNC_EVENT, { detail: normalized }));
    window.dispatchEvent(new CustomEvent(COLOR_SCHEME_MODE_SYNC_EVENT, { detail: resolvedScheme }));
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: defaultWp }));
    window.dispatchEvent(new CustomEvent(CUSTOM_SURFACE_COLOR_SYNC_EVENT, { detail: 'default' }));
    window.dispatchEvent(new CustomEvent(CUSTOM_PRIMARY_COLOR_SYNC_EVENT, { detail: 'default' }));
    window.dispatchEvent(new CustomEvent(CARD_EFFECT_SYNC_EVENT, { detail: themeCardEffect }));
  }, []);

  const setCardStyle = useCallback(
    (mode: CardStyleMode) => {
      applyCardStyleInternal(mode);
    },
    [applyCardStyleInternal]
  );

  const setColorSchemeMode = useCallback(
    (mode: ColorSchemeMode) => {
      const nextScheme: ColorSchemeMode = mode === 'dark' || mode === 'light' || mode === 'system' ? mode : 'system';
      const wantDark = nextScheme === 'system' ? getSystemPrefersDark() : nextScheme === 'dark';
      const targetStyle = getLightDarkCounterpart(cardStyleRef.current, wantDark);
      applyCardStyleInternal(targetStyle, nextScheme);
    },
    [applyCardStyleInternal]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme-mode', colorSchemeMode);
    if (document.body) {
      document.body.setAttribute('data-color-scheme-mode', colorSchemeMode);
    }
  }, [colorSchemeMode]);

  useEffect(() => {
    if (colorSchemeMode !== 'system' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const syncWithSystem = (matchesDark: boolean) => {
      const targetStyle = getLightDarkCounterpart(cardStyleRef.current, matchesDark);
      if (targetStyle !== cardStyleRef.current) {
        applyCardStyleInternal(targetStyle, 'system');
      }
    };
    syncWithSystem(mq.matches);
    const onChange = (event: MediaQueryListEvent) => syncWithSystem(event.matches);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, [colorSchemeMode, applyCardStyleInternal]);

  const toggleLightDark = useCallback(
    (targetDark?: boolean) => {
      const wantDark = typeof targetDark === 'boolean' ? targetDark : !isDark;
      if (wantDark === isDark && colorSchemeMode !== 'system') return;
      const targetMode = getLightDarkCounterpart(cardStyle, wantDark);
      setCardStyle(targetMode);
    },
    [cardStyle, isDark, colorSchemeMode, setCardStyle]
  );

  const getCardStyleProps = useCallback((mode?: CardStyleMode) => {
    return getCardStyleProperties(mode || cardStyle);
  }, [cardStyle]);

  const updateGlassSettings = useCallback(
    (patch: Partial<GlassCustomization>, targetMode?: CardStyleMode) => {
      const mode = targetMode || cardStyle;
      const defaults = THEME_DEFAULT_GLASS_SETTINGS[mode];
      setGlassCustomizations((prev) => {
        const current = prev[mode] || defaults;
        const nextForMode = clampGlassSettings({ ...current, ...patch }, defaults);
        const nextMap: GlassCustomizationMap = { ...prev };
        if (
          nextForMode.cardOpacity === defaults.cardOpacity &&
          nextForMode.blurIntensity === defaults.blurIntensity
        ) {
          delete nextMap[mode];
        } else {
          nextMap[mode] = nextForMode;
        }
        try {
          localStorage.setItem(GLASS_CUSTOMIZATION_STORAGE_KEY, JSON.stringify(nextMap));
        } catch {
          // ignore
        }
        window.dispatchEvent(new CustomEvent(GLASS_CUSTOMIZATION_SYNC_EVENT, { detail: nextMap }));
        return nextMap;
      });
    },
    [cardStyle]
  );

  const resetGlassSettings = useCallback(
    (targetMode?: CardStyleMode) => {
      const mode = targetMode || cardStyle;
      setGlassCustomizations((prev) => {
        if (!prev[mode]) return prev;
        const nextMap: GlassCustomizationMap = { ...prev };
        delete nextMap[mode];
        try {
          localStorage.setItem(GLASS_CUSTOMIZATION_STORAGE_KEY, JSON.stringify(nextMap));
        } catch {
          // ignore
        }
        window.dispatchEvent(new CustomEvent(GLASS_CUSTOMIZATION_SYNC_EVENT, { detail: nextMap }));
        return nextMap;
      });
    },
    [cardStyle]
  );

  const updateWallpaperOverlay = useCallback((_patch: Partial<WallpaperOverlaySettings>) => {}, []);
  const resetWallpaperOverlay = useCallback(() => {}, []);
  const setAdaptiveAccentEnabled = useCallback((_enabled: boolean) => {}, []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colorSchemeMode,
        setColorSchemeMode,
        currentWallpaper: activeWallpaper.value || activeWallpaper.bg || '',
        activeWallpaper,
        setWallpaper,
        wallpaperOverlay,
        updateWallpaperOverlay,
        resetWallpaperOverlay,
        adaptiveAccentEnabled,
        setAdaptiveAccentEnabled,
        suggestedAccent,
        cardStyle,
        setCardStyle,
        toggleLightDark,
        getCardStyleProps,
        glassSettings,
        getGlassSettingsForMode,
        isGlassCustomized,
        updateGlassSettings,
        resetGlassSettings,
        surfaceDepth,
        autoTimeTheme,
        setAutoTimeTheme,
        toggleAutoTimeTheme,
        cornerRadius,
        setCornerRadius,
        resetCornerRadius,
        waveMotion,
        setWaveMotion,
        customSurfaceColor,
        setCustomSurfaceColor,
        customPrimaryColor,
        setCustomPrimaryColor,
        cardEffect,
        setCardEffect,
        resetInterfaceCustomColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
