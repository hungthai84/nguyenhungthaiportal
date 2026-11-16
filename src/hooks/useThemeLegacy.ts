import { useState, useEffect, useCallback } from 'react';
import {
  WALLPAPER_PRESETS_LIST,
  WallpaperPreset,
  ACTIVE_WALLPAPER_STORAGE_KEY,
  parseCssStringToStyle,
  getCleanImageUrl,
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

export function useThemeLegacy() {
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
          if (parsed && parsed.id) {
            if (parsed.id === 'none') return parsed;
            const presetMatch = WALLPAPER_PRESETS_LIST.find((w) => w.id === parsed.id);
            const merged = presetMatch ? { ...presetMatch, ...parsed } : parsed;
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

  const [glassCustomizations, setGlassCustomizations] = useState<GlassCustomizationMap>(() => {
    try {
      const raw = localStorage.getItem(GLASS_CUSTOMIZATION_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as GlassCustomizationMap;
    } catch {
      // ignore
    }
    return {};
  });

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
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute(
        'data-theme',
        cardStyle === 'cowhide-leather'
          ? 'cowhide-leather'
          : cardStyle === 'dark-ice-blue-neumorphism'
            ? 'dark-ice-blue-neumorphism'
            : cardStyle === 'dark-pastel-lilac-soft'
              ? 'dark-pastel-lilac-soft'
              : 'dark-glassmorphism'
      );
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-theme-mode', 'light');
    }
    document.documentElement.setAttribute('data-card-style', cardStyle);
    if (document.body) {
      document.body.setAttribute('data-card-style', cardStyle);
    }
  }, [cardStyle, isDark]);

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
      localStorage.setItem(WALLPAPER_MANUAL_STORAGE_KEY, '1');
    } catch (e) {
      // ignore
    }
    setActiveWallpaper(nextWp);
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: nextWp }));
  }, []);

  const setCardStyle = useCallback((mode: CardStyleMode) => {
    const normalized = normalizeCardStyle(mode);
    const nextDark = Boolean(CARD_STYLES_MAP[normalized]?.isDark);
    const defaultWp = getDefaultWallpaperForTheme(normalized);
    setCardStyleState(normalized);
    setActiveWallpaper(defaultWp);
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, normalized);
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
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute(
        'data-theme',
        normalized === 'cowhide-leather'
          ? 'cowhide-leather'
          : normalized === 'dark-ice-blue-neumorphism'
            ? 'dark-ice-blue-neumorphism'
            : normalized === 'dark-pastel-lilac-soft'
              ? 'dark-pastel-lilac-soft'
              : 'dark-glassmorphism'
      );
      document.documentElement.setAttribute('data-theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-theme-mode', 'light');
    }
    document.documentElement.setAttribute('data-card-style', normalized);
    if (document.body) {
      document.body.setAttribute('data-card-style', normalized);
    }
    window.dispatchEvent(new CustomEvent(CARD_STYLE_SYNC_EVENT, { detail: normalized }));
    window.dispatchEvent(new CustomEvent(WALLPAPER_SYNC_EVENT, { detail: defaultWp }));
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

  return {
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
  };
}
