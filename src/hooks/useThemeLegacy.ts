import { useState, useEffect, useCallback, useRef } from 'react';
import { triggerThemeCrossFade } from '../utils/themeTransition';
import {
  WALLPAPER_PRESETS_LIST,
  WallpaperPreset,
  ACTIVE_WALLPAPER_STORAGE_KEY,
  parseCssStringToStyle,
  getCleanImageUrl,
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
  ThemeWallpaperPreset,
  WallpaperOverlaySettings,
} from '../config/ui/theme.types';
import { getInstantWallpaperAccent } from '../utils/wallpaperColorAnalyzer';
import {
  applyLayerDepthCssVariables,
  getLayerDepthForTheme,
} from '../config/ui/layerDepth';
import {
  CARD_STYLES_MAP,
  getCardStyleProperties,
  getLightDarkCounterpart,
  normalizeCardStyle,
} from '../config/ui/cardStyles';

const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';

type GlassCustomizationMap = Partial<Record<CardStyleMode, GlassCustomization>>;

function clampLegacyGlass(raw?: Partial<GlassCustomization>, fallback?: GlassCustomization): GlassCustomization {
  const base = fallback || { cardOpacity: 74, blurIntensity: 22 };
  const rawOpacity = typeof raw?.cardOpacity === 'number' && Number.isFinite(raw.cardOpacity) ? raw.cardOpacity : base.cardOpacity;
  const rawBlur = typeof raw?.blurIntensity === 'number' && Number.isFinite(raw.blurIntensity) ? raw.blurIntensity : base.blurIntensity;
  return {
    cardOpacity: Math.min(100, Math.max(15, Math.round(rawOpacity))),
    blurIntensity: Math.min(48, Math.max(0, Math.round(rawBlur))),
  };
}

function getDefaultWallpaperForTheme(mode: CardStyleMode): WallpaperPreset {
  const targetId = THEME_DEFAULT_WALLPAPER_ID[mode];
  return WALLPAPER_PRESETS_LIST.find((w) => w.id === targetId) || WALLPAPER_PRESETS_LIST[0];
}

function getLegacyPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const LEGACY_UI_SEED_KEY = 'hungthai_default_ui_seed_v2026_neu_wp32_v2';
let didRunLegacyUiSeed = false;

function ensureLegacyDefaultUiSeedSync(): void {
  if (didRunLegacyUiSeed || typeof window === 'undefined') return;
  didRunLegacyUiSeed = true;
  try {
    if (localStorage.getItem(LEGACY_UI_SEED_KEY) !== '1') {
      localStorage.removeItem(CARD_STYLE_STORAGE_KEY);
      localStorage.removeItem(COLOR_SCHEME_MODE_STORAGE_KEY);
      localStorage.removeItem(WALLPAPER_MANUAL_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_WALLPAPER_STORAGE_KEY);
      localStorage.removeItem(WALLPAPER_OVERLAY_STORAGE_KEY);
      localStorage.removeItem(ADAPTIVE_ACCENT_STORAGE_KEY);
      localStorage.removeItem(LAYER_DEPTH_STORAGE_KEY);
      localStorage.removeItem(SURFACE_DEPTH_STORAGE_KEY);
      localStorage.setItem(LEGACY_UI_SEED_KEY, '1');
    }
  } catch {
    // ignore
  }
}

function readLegacyColorSchemeMode(): ColorSchemeMode {
  ensureLegacyDefaultUiSeedSync();
  try {
    const savedMode = localStorage.getItem(COLOR_SCHEME_MODE_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') return savedMode;
    const savedStyle = localStorage.getItem(CARD_STYLE_STORAGE_KEY);
    if (savedStyle) {
      return CARD_STYLES_MAP[normalizeCardStyle(savedStyle)]?.isDark ? 'dark' : 'light';
    }
  } catch {
    // ignore
  }
  return 'light';
}

export function useThemeLegacy() {
  const [colorSchemeMode, setColorSchemeModeState] = useState<ColorSchemeMode>(() => readLegacyColorSchemeMode());

  const [cardStyle, setCardStyleState] = useState<CardStyleMode>(() => {
    try {
      const mode = readLegacyColorSchemeMode();
      const saved = localStorage.getItem(CARD_STYLE_STORAGE_KEY);
      const base = saved ? normalizeCardStyle(saved) : DEFAULT_CARD_STYLE;
      return mode === 'system' ? getLightDarkCounterpart(base, getLegacyPrefersDark()) : base;
    } catch (e) {
      // ignore
    }
    return DEFAULT_CARD_STYLE;
  });

  const [activeWallpaper, setActiveWallpaper] = useState<WallpaperPreset>(() => {
    let initialStyle: CardStyleMode = DEFAULT_CARD_STYLE;
    try {
      initialStyle = normalizeCardStyle(localStorage.getItem(CARD_STYLE_STORAGE_KEY));
      const hasManualWallpaper = localStorage.getItem(WALLPAPER_MANUAL_STORAGE_KEY) === '1';
      if (hasManualWallpaper) {
        const savedJson = localStorage.getItem(ACTIVE_WALLPAPER_STORAGE_KEY);
        if (savedJson) {
          const parsed = JSON.parse(savedJson) as WallpaperPreset;
          if (parsed && parsed.id) {
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

  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperPreset | null>(null);
  const wallpaperOverlay: WallpaperOverlaySettings = { blur: 0, dim: 0 };
  const adaptiveAccentEnabled = false;
  const suggestedAccent: AdaptiveAccentPalette | null = getInstantWallpaperAccent(
    previewWallpaper || activeWallpaper
  );

  const [glassCustomizations, setGlassCustomizations] = useState<GlassCustomizationMap>(() => {
    try {
      const raw = localStorage.getItem(GLASS_CUSTOMIZATION_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as GlassCustomizationMap;
    } catch {
      // ignore
    }
    return {};
  });

  const layerDepth = getLayerDepthForTheme(cardStyle);
  const surfaceDepth: SurfaceDepthMode = layerDepth === 0 ? 'flat' : 'depth';

  const [autoTimeTheme, setAutoTimeThemeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTO_TIME_THEME_STORAGE_KEY) === 'true';
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


  const activeWallpaperIdRef = useRef<string>(activeWallpaper.id);
  useEffect(() => {
    activeWallpaperIdRef.current = activeWallpaper.id;
  }, [activeWallpaper.id]);

  const cardStyleRef = useRef<CardStyleMode>(cardStyle);
  useEffect(() => {
    cardStyleRef.current = cardStyle;
  }, [cardStyle]);

  const isDark = Boolean(CARD_STYLES_MAP[cardStyle]?.isDark);

  const getGlassSettingsForMode = useCallback(
    (mode: CardStyleMode): GlassCustomization => {
      const defaults = THEME_DEFAULT_GLASS_SETTINGS[mode] || THEME_DEFAULT_GLASS_SETTINGS[DEFAULT_CARD_STYLE];
      const custom = glassCustomizations[mode];
      return custom ? clampLegacyGlass(custom, defaults) : { ...defaults };
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
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, cardStyle);
    } catch (e) {
      // ignore
    }
    const mechanism = CARD_STYLES_MAP[cardStyle]?.mechanism || (isDark ? 'dark' : 'light');
    if (isDark) {
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
  }, [cardStyle, isDark]);

  useEffect(() => {
    applyLayerDepthCssVariables(layerDepth, cardStyle);
  }, [layerDepth, cardStyle]);

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
    window.addEventListener(WALLPAPER_SYNC_EVENT, handleSync);
    window.addEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    return () => {
      window.removeEventListener(WALLPAPER_SYNC_EVENT, handleSync);
      window.removeEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    };
  }, []);

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

    if (
      activeWallpaper.id === 'none' ||
      (!activeWallpaper.value &&
        !activeWallpaper.bg &&
        (!activeWallpaper.previewStyle || Object.keys(activeWallpaper.previewStyle).length === 0))
    ) {
      root.style.setProperty('--theme-bg-image', 'none');
      document.body.style.backgroundColor = isDark ? '#050816' : '#F5F7FD';
    } else if (activeWallpaper.type === 'image') {
      const imgVal = activeWallpaper.value || activeWallpaper.bg || '';
      const cleanUrl = getCleanImageUrl(imgVal);
      if (cleanUrl) {
        root.style.setProperty('--theme-bg-image', `url('${cleanUrl}')`);
        document.body.style.backgroundImage = `url('${cleanUrl}'), ${themeBgSpec.fallbackGradient}`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
      }
    } else if (activeWallpaper.type === 'css' || activeWallpaper.type === 'gradient') {
      root.style.setProperty('--theme-bg-image', 'none');
      const cssText = activeWallpaper.value || activeWallpaper.bg || '';
      const parsed =
        activeWallpaper.previewStyle && Object.keys(activeWallpaper.previewStyle).length > 0
          ? activeWallpaper.previewStyle
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
      document.body.style.backgroundColor = isDark ? '#050816' : '#F5F7FD';
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

  const setCardStyle = useCallback((mode: CardStyleMode) => {
    const normalized = normalizeCardStyle(mode);
    if (cardStyleRef.current !== normalized) {
      triggerThemeCrossFade();
    }
    const nextDark = Boolean(CARD_STYLES_MAP[normalized]?.isDark);
    const nextScheme: ColorSchemeMode = nextDark ? 'dark' : 'light';
    const defaultWp = getDefaultWallpaperForTheme(normalized);

    cardStyleRef.current = normalized;
    setCardStyleState(normalized);
    setColorSchemeModeState(nextScheme);
    activeWallpaperIdRef.current = defaultWp.id;
    setActiveWallpaper(defaultWp);

    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, normalized);
      localStorage.setItem(COLOR_SCHEME_MODE_STORAGE_KEY, nextScheme);
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
    if (document.body) {
      document.body.setAttribute('data-card-style', normalized);
      document.body.setAttribute('data-theme-mechanism', mechanism);
    }
    window.dispatchEvent(new CustomEvent(CARD_STYLE_SYNC_EVENT, { detail: normalized }));
    window.dispatchEvent(new CustomEvent(COLOR_SCHEME_MODE_SYNC_EVENT, { detail: nextScheme }));
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: defaultWp }));
  }, []);

  const setColorSchemeMode = useCallback(
    (mode: ColorSchemeMode) => {
      const nextScheme: ColorSchemeMode = mode === 'dark' || mode === 'light' || mode === 'system' ? mode : 'system';
      const wantDark = nextScheme === 'system' ? getLegacyPrefersDark() : nextScheme === 'dark';
      const targetMode = getLightDarkCounterpart(cardStyleRef.current, wantDark);
      setCardStyle(targetMode);
      setColorSchemeModeState(nextScheme);
      try {
        localStorage.setItem(COLOR_SCHEME_MODE_STORAGE_KEY, nextScheme);
      } catch {
        // ignore
      }
      window.dispatchEvent(new CustomEvent(COLOR_SCHEME_MODE_SYNC_EVENT, { detail: nextScheme }));
    },
    [setCardStyle]
  );

  const toggleLightDark = useCallback(
    (targetDark?: boolean) => {
      const wantDark = typeof targetDark === 'boolean' ? targetDark : !isDark;
      if (wantDark === isDark && colorSchemeMode !== 'system') return;
      const targetMode = getLightDarkCounterpart(cardStyle, wantDark);
      setCardStyle(targetMode);
    },
    [cardStyle, isDark, colorSchemeMode, setCardStyle]
  );

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
  }, [autoTimeTheme, cardStyle, setCardStyle]);

  const getCardStyleProps = useCallback((mode?: CardStyleMode) => {
    return getCardStyleProperties(mode || cardStyle);
  }, [cardStyle]);

  const updateGlassSettings = useCallback(
    (patch: Partial<GlassCustomization>, targetMode?: CardStyleMode) => {
      const mode = targetMode || cardStyle;
      const defaults = THEME_DEFAULT_GLASS_SETTINGS[mode];
      setGlassCustomizations((prev) => {
        const current = prev[mode] || defaults;
        const nextForMode = clampLegacyGlass({ ...current, ...patch }, defaults);
        const nextMap: GlassCustomizationMap = { ...prev, [mode]: nextForMode };
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

  const applyThemeWallpaperPreset = useCallback(
    (preset: ThemeWallpaperPreset) => {
      setCardStyle(preset.cardStyle);
      setWallpaper(preset.wallpaper);
    },
    [setCardStyle, setWallpaper]
  );

  return {
    isDark,
    colorSchemeMode,
    setColorSchemeMode,
    currentWallpaper: activeWallpaper.value || activeWallpaper.bg || '',
    activeWallpaper,
    previewWallpaper,
    setPreviewWallpaper,
    setWallpaper,
    wallpaperOverlay,
    updateWallpaperOverlay,
    resetWallpaperOverlay,
    adaptiveAccentEnabled,
    setAdaptiveAccentEnabled,
    suggestedAccent,
    applyThemeWallpaperPreset,
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
  };
}
