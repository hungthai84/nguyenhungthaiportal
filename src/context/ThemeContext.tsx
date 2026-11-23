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
import {
  CARD_STYLE_STORAGE_KEY,
  COLOR_SCHEME_MODE_STORAGE_KEY,
  COLOR_SCHEME_MODE_SYNC_EVENT,
  DEFAULT_CARD_STYLE,
  GLASS_CUSTOMIZATION_STORAGE_KEY,
  GLASS_CUSTOMIZATION_SYNC_EVENT,
  LAYER_DEPTH_STORAGE_KEY,
  SURFACE_DEPTH_STORAGE_KEY,
  AUTO_TIME_THEME_STORAGE_KEY,
  AUTO_TIME_THEME_SYNC_EVENT,
  THEME_BACKGROUNDS,
  THEME_DEFAULT_GLASS_SETTINGS,
  THEME_DEFAULT_WALLPAPER_ID,
  WALLPAPER_MANUAL_STORAGE_KEY,
  WALLPAPER_OVERLAY_STORAGE_KEY,
  ADAPTIVE_ACCENT_STORAGE_KEY,
} from '../config/ui/themeDefaults';
import {
  AdaptiveAccentPalette,
  CardStyleMode,
  ColorSchemeMode,
  GlassCustomization,
  SurfaceDepthMode,
  WallpaperOverlaySettings,
} from '../config/ui/theme.types';
import {
  analyzeWallpaperColors,
  applyAdaptiveAccentVariables,
  getInstantWallpaperAccent,
} from '../utils/wallpaperColorAnalyzer';
import {
  applyLayerDepthCssVariables,
  getLayerDepthForTheme,
} from '../config/ui/layerDepth';
import {
  CARD_STYLES_MAP,
  VALID_CARD_STYLES,
  getCardStyleProperties,
  getLightDarkCounterpart,
  normalizeCardStyle,
} from '../config/ui/cardStyles';

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
    const headerAlpha = Math.max(0.2, Math.min(1, alpha + 0.04));
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
  setSurfaceDepth: (mode: SurfaceDepthMode) => void;
  toggleSurfaceDepth: () => void;
  layerDepth: number;
  setLayerDepth: (depth: number) => void;
  resetLayerDepth: () => void;
  autoTimeTheme: boolean;
  setAutoTimeTheme: (enabled: boolean) => void;
  toggleAutoTimeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveCardStyleDark(style: CardStyleMode): boolean {
  return Boolean(CARD_STYLES_MAP[style]?.isDark);
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const DEFAULT_UI_SEED_KEY = 'hungthai_default_ui_seed_v2026_light_ocean_navy_v1';
const DEFAULT_OVERLAY_RESET_SEED_KEY = 'hungthai_overlay_reset_0px_0pct_v3';
let didRunDefaultUiSeed = false;

function ensureDefaultUiSeedSync(): void {
  if (didRunDefaultUiSeed || typeof window === 'undefined') return;
  didRunDefaultUiSeed = true;
  try {
    if (localStorage.getItem(DEFAULT_UI_SEED_KEY) !== '1') {
      localStorage.removeItem(CARD_STYLE_STORAGE_KEY);
      localStorage.removeItem(COLOR_SCHEME_MODE_STORAGE_KEY);
      localStorage.removeItem(WALLPAPER_MANUAL_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_WALLPAPER_STORAGE_KEY);
      localStorage.removeItem(WALLPAPER_OVERLAY_STORAGE_KEY);
      localStorage.removeItem(ADAPTIVE_ACCENT_STORAGE_KEY);
      localStorage.removeItem(LAYER_DEPTH_STORAGE_KEY);
      localStorage.removeItem(SURFACE_DEPTH_STORAGE_KEY);
      localStorage.setItem(DEFAULT_UI_SEED_KEY, '1');
    }
    if (localStorage.getItem(DEFAULT_OVERLAY_RESET_SEED_KEY) !== '1') {
      localStorage.removeItem(WALLPAPER_OVERLAY_STORAGE_KEY);
      localStorage.removeItem(ADAPTIVE_ACCENT_STORAGE_KEY);
      localStorage.removeItem(LAYER_DEPTH_STORAGE_KEY);
      localStorage.removeItem(SURFACE_DEPTH_STORAGE_KEY);
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
    const baseStyle = savedStyle ? normalizeCardStyle(savedStyle) : DEFAULT_CARD_STYLE;
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

  const layerDepth = getLayerDepthForTheme(cardStyle);
  const surfaceDepth: SurfaceDepthMode = layerDepth === 0 ? 'flat' : 'depth';

  const [autoTimeTheme, setAutoTimeThemeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTO_TIME_THEME_STORAGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

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
  }, [cardStyle]);

  useEffect(() => {
    applyLayerDepthCssVariables(layerDepth, cardStyle);
  }, [layerDepth, cardStyle]);

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
    window.addEventListener(WALLPAPER_SYNC_EVENT, handleSync);
    window.addEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    window.addEventListener(GLASS_CUSTOMIZATION_SYNC_EVENT, handleGlassSync);
    window.addEventListener(AUTO_TIME_THEME_SYNC_EVENT, handleAutoTimeThemeSync);
    window.addEventListener(COLOR_SCHEME_MODE_SYNC_EVENT, handleColorSchemeModeSync);
    return () => {
      window.removeEventListener(WALLPAPER_SYNC_EVENT, handleSync);
      window.removeEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
      window.removeEventListener(GLASS_CUSTOMIZATION_SYNC_EVENT, handleGlassSync);
      window.removeEventListener(AUTO_TIME_THEME_SYNC_EVENT, handleAutoTimeThemeSync);
      window.removeEventListener(COLOR_SCHEME_MODE_SYNC_EVENT, handleColorSchemeModeSync);
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
        root.style.setProperty('--theme-bg-image', `url('${cleanUrl}')`);
        document.body.style.backgroundImage = `url('${cleanUrl}'), ${themeBgSpec.fallbackGradient}`;
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

    cardStyleRef.current = normalized;
    setCardStyleState(normalized);
    setColorSchemeModeState(resolvedScheme);
    activeWallpaperIdRef.current = defaultWp.id;
    setActiveWallpaper(defaultWp);

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
    if (document.body) {
      document.body.setAttribute('data-card-style', normalized);
      document.body.setAttribute('data-theme-mechanism', mechanism);
      document.body.setAttribute('data-color-scheme-mode', resolvedScheme);
    }
    window.dispatchEvent(new CustomEvent(CARD_STYLE_SYNC_EVENT, { detail: normalized }));
    window.dispatchEvent(new CustomEvent(COLOR_SCHEME_MODE_SYNC_EVENT, { detail: resolvedScheme }));
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: defaultWp }));
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

  const setLayerDepth = useCallback((_rawDepth: number) => {}, []);
  const resetLayerDepth = useCallback(() => {}, []);
  const setSurfaceDepth = useCallback((_mode: SurfaceDepthMode) => {}, []);
  const toggleSurfaceDepth = useCallback(() => {}, []);
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
        setSurfaceDepth,
        toggleSurfaceDepth,
        layerDepth,
        setLayerDepth,
        resetLayerDepth,
        autoTimeTheme,
        setAutoTimeTheme,
        toggleAutoTimeTheme,
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
