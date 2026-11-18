import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  WALLPAPER_PRESETS_LIST,
  WallpaperPreset,
  ACTIVE_WALLPAPER_STORAGE_KEY,
  parseCssStringToStyle,
  getCleanImageUrl,
  isCodePenWallpaper,
} from '../data/wallpapers';
import {
  CARD_STYLE_STORAGE_KEY,
  DEFAULT_CARD_STYLE,
  GLASS_CUSTOMIZATION_STORAGE_KEY,
  GLASS_CUSTOMIZATION_SYNC_EVENT,
  THEME_BACKGROUNDS,
  THEME_DEFAULT_GLASS_SETTINGS,
  THEME_DEFAULT_WALLPAPER_ID,
  WALLPAPER_MANUAL_STORAGE_KEY,
} from '../config/ui/themeDefaults';
import { CardStyleMode, GlassCustomization } from '../config/ui/theme.types';
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

function getDefaultWallpaperForTheme(mode: CardStyleMode): WallpaperPreset {
  const targetId = THEME_DEFAULT_WALLPAPER_ID[mode];
  return WALLPAPER_PRESETS_LIST.find((w) => w.id === targetId) || WALLPAPER_PRESETS_LIST[0];
}

export interface ThemeContextType {
  isDark: boolean;
  currentWallpaper: string;
  activeWallpaper: WallpaperPreset;
  setWallpaper: (wpOrBg: WallpaperPreset | string) => void;
  cardStyle: CardStyleMode;
  setCardStyle: (mode: CardStyleMode) => void;
  toggleLightDark: (targetDark?: boolean) => void;
  getCardStyleProps: (mode?: CardStyleMode) => React.CSSProperties;
  glassSettings: GlassCustomization;
  getGlassSettingsForMode: (mode: CardStyleMode) => GlassCustomization;
  isGlassCustomized: (mode?: CardStyleMode) => boolean;
  updateGlassSettings: (patch: Partial<GlassCustomization>, targetMode?: CardStyleMode) => void;
  resetGlassSettings: (targetMode?: CardStyleMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveCardStyleDark(style: CardStyleMode): boolean {
  return Boolean(CARD_STYLES_MAP[style]?.isDark);
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cardStyle, setCardStyleState] = useState<CardStyleMode>(() => {
    try {
      const saved = localStorage.getItem(CARD_STYLE_STORAGE_KEY);
      return normalizeCardStyle(saved);
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

  const [glassCustomizations, setGlassCustomizations] = useState<GlassCustomizationMap>(() =>
    readStoredGlassCustomizations()
  );

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
      document.documentElement.setAttribute(
        'data-theme',
        cardStyle === 'cowhide-leather'
          ? 'cowhide-leather'
          : cardStyle === 'black-cowhide-leather'
            ? 'black-cowhide-leather'
            : cardStyle === 'light-multicolor-glass-dark'
              ? 'light-multicolor-glass-dark'
              : 'dark'
      );
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-theme-mode', 'light');
    }

    document.documentElement.setAttribute('data-theme-mechanism', mechanism);
    document.documentElement.setAttribute('data-card-style', cardStyle);
    if (document.body) {
      document.body.setAttribute('data-card-style', cardStyle);
      document.body.setAttribute('data-theme-mechanism', mechanism);
    }
  }, [cardStyle]);

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
    window.addEventListener(WALLPAPER_SYNC_EVENT, handleSync);
    window.addEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    window.addEventListener(GLASS_CUSTOMIZATION_SYNC_EVENT, handleGlassSync);
    return () => {
      window.removeEventListener(WALLPAPER_SYNC_EVENT, handleSync);
      window.removeEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
      window.removeEventListener(GLASS_CUSTOMIZATION_SYNC_EVENT, handleGlassSync);
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

    if (
      activeWallpaper.id === 'none' ||
      (!activeWallpaper.value &&
        !activeWallpaper.bg &&
        (!activeWallpaper.previewStyle || Object.keys(activeWallpaper.previewStyle).length === 0))
    ) {
      root.style.setProperty('--theme-bg-image', 'none');
      document.body.style.background = 'var(--app-bg-gradient, var(--ambient-base-bg, var(--theme-bg-fallback)))';
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
    } else if (activeWallpaper.type === 'webgl') {
      root.style.setProperty('--theme-bg-image', 'none');
      const fallbackBg =
        activeWallpaper.value ||
        activeWallpaper.bg ||
        'radial-gradient(circle at center, #ffffff 0%, #ecefff 35%, #c2d1ff 100%)';
      document.body.style.background = fallbackBg;
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
      localStorage.setItem(WALLPAPER_MANUAL_STORAGE_KEY, '1');
    } catch (e) {
      // ignore
    }
    setActiveWallpaper(nextWp);
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: nextWp }));
  }, []);

  const setCardStyle = useCallback((mode: CardStyleMode) => {
    const normalized = normalizeCardStyle(mode);
    const nextDark = resolveCardStyleDark(normalized);
    const defaultWp = getDefaultWallpaperForTheme(normalized);
    let hasManualWallpaper = false;
    try {
      hasManualWallpaper = localStorage.getItem(WALLPAPER_MANUAL_STORAGE_KEY) === '1';
    } catch {
      hasManualWallpaper = false;
    }

    setCardStyleState(normalized);
    if (!hasManualWallpaper) {
      setActiveWallpaper(defaultWp);
    }
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, normalized);
      localStorage.setItem(
        nextDark ? 'hungthai_last_dark_style' : 'hungthai_last_light_style',
        normalized
      );
      if (!hasManualWallpaper) {
        localStorage.setItem(ACTIVE_WALLPAPER_STORAGE_KEY, JSON.stringify(defaultWp));
        localStorage.setItem('theme_wallpaper', defaultWp.value || defaultWp.bg || '');
      }
    } catch (e) {
      // ignore
    }
    const mechanism = CARD_STYLES_MAP[normalized]?.mechanism || (nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute(
        'data-theme',
        normalized === 'cowhide-leather'
          ? 'cowhide-leather'
          : normalized === 'black-cowhide-leather'
            ? 'black-cowhide-leather'
            : normalized === 'light-multicolor-glass-dark'
              ? 'light-multicolor-glass-dark'
              : 'dark'
      );
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-theme-mode', 'light');
    }
    document.documentElement.setAttribute('data-theme-mechanism', mechanism);
    document.documentElement.setAttribute('data-card-style', normalized);
    if (document.body) {
      document.body.setAttribute('data-card-style', normalized);
      document.body.setAttribute('data-theme-mechanism', mechanism);
    }
    window.dispatchEvent(new CustomEvent(CARD_STYLE_SYNC_EVENT, { detail: normalized }));
    if (!hasManualWallpaper) {
      window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: defaultWp }));
    }
  }, []);

  const toggleLightDark = useCallback(
    (targetDark?: boolean) => {
      const wantDark = typeof targetDark === 'boolean' ? targetDark : !isDark;
      if (wantDark === isDark) return;
      const targetMode = getLightDarkCounterpart(cardStyle, wantDark);
      setCardStyle(targetMode);
    },
    [cardStyle, isDark, setCardStyle]
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

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        currentWallpaper: activeWallpaper.value || activeWallpaper.bg || '',
        activeWallpaper,
        setWallpaper,
        cardStyle,
        setCardStyle,
        toggleLightDark,
        getCardStyleProps,
        glassSettings,
        getGlassSettingsForMode,
        isGlassCustomized,
        updateGlassSettings,
        resetGlassSettings,
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
