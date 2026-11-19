import { useState, useEffect, useCallback, useRef } from 'react';
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
  SURFACE_DEPTH_STORAGE_KEY,
  SURFACE_DEPTH_SYNC_EVENT,
  AUTO_COLLAPSE_ON_SCROLL_STORAGE_KEY,
  AUTO_COLLAPSE_ON_SCROLL_SYNC_EVENT,
  AUTO_TIME_THEME_STORAGE_KEY,
  AUTO_TIME_THEME_SYNC_EVENT,
  THEME_BACKGROUNDS,
  THEME_DEFAULT_GLASS_SETTINGS,
  THEME_DEFAULT_WALLPAPER_ID,
  WALLPAPER_MANUAL_STORAGE_KEY,
} from '../config/ui/themeDefaults';
import { CardStyleMode, GlassCustomization, SurfaceDepthMode } from '../config/ui/theme.types';
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

  const [glassCustomizations, setGlassCustomizations] = useState<GlassCustomizationMap>(() => {
    try {
      const raw = localStorage.getItem(GLASS_CUSTOMIZATION_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as GlassCustomizationMap;
    } catch {
      // ignore
    }
    return {};
  });

  const [surfaceDepth, setSurfaceDepthState] = useState<SurfaceDepthMode>(() => {
    try {
      return localStorage.getItem(SURFACE_DEPTH_STORAGE_KEY) === 'flat' ? 'flat' : 'depth';
    } catch {
      return 'depth';
    }
  });

  const [autoCollapseOnScroll, setAutoCollapseOnScrollState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTO_COLLAPSE_ON_SCROLL_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

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
      document.documentElement.setAttribute(
        'data-theme',
        cardStyle === 'cowhide-leather'
          ? 'cowhide-leather'
          : cardStyle === 'black-cowhide-leather'
            ? 'black-cowhide-leather'
            : cardStyle === 'light-multicolor-glass-dark'
              ? 'light-multicolor-glass-dark'
              : cardStyle === 'dark-ice-blue-neu'
                ? 'dark-ice-blue-neu'
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
    const nextDark = Boolean(CARD_STYLES_MAP[normalized]?.isDark);
    const defaultWp = getDefaultWallpaperForTheme(normalized);
    let hasManualWallpaper = false;
    let storedWpId = activeWallpaperIdRef.current;
    try {
      hasManualWallpaper = localStorage.getItem(WALLPAPER_MANUAL_STORAGE_KEY) === '1';
      if (!storedWpId) {
        const storedRaw = localStorage.getItem(ACTIVE_WALLPAPER_STORAGE_KEY);
        if (storedRaw) {
          storedWpId = (JSON.parse(storedRaw) as WallpaperPreset)?.id || '';
        }
      }
    } catch {
      hasManualWallpaper = false;
    }

    const isThemeOwnedOrEmptyWp =
      !storedWpId || storedWpId === 'none' || storedWpId.startsWith('theme-bg-');
    const shouldApplyThemeDefaultWp = !hasManualWallpaper || isThemeOwnedOrEmptyWp;

    cardStyleRef.current = normalized;
    setCardStyleState(normalized);
    if (shouldApplyThemeDefaultWp) {
      activeWallpaperIdRef.current = defaultWp.id;
      setActiveWallpaper(defaultWp);
    }
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, normalized);
      localStorage.setItem(
        nextDark ? 'hungthai_last_dark_style' : 'hungthai_last_light_style',
        normalized
      );
      if (shouldApplyThemeDefaultWp) {
        localStorage.removeItem(WALLPAPER_MANUAL_STORAGE_KEY);
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
              : normalized === 'dark-ice-blue-neu'
                ? 'dark-ice-blue-neu'
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
    if (shouldApplyThemeDefaultWp) {
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

  useEffect(() => {
    if (!autoTimeTheme) return;
    const checkTimeTheme = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      if (cardStyle === 'ice-blue-neu' || cardStyle === 'dark-ice-blue-neu') {
        if (isNight && cardStyle !== 'dark-ice-blue-neu') {
          setCardStyle('dark-ice-blue-neu');
        } else if (!isNight && cardStyle !== 'ice-blue-neu') {
          setCardStyle('ice-blue-neu');
        }
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

  const setSurfaceDepth = useCallback((mode: SurfaceDepthMode) => {
    const next: SurfaceDepthMode = mode === 'depth' ? 'depth' : 'flat';
    setSurfaceDepthState(next);
    document.documentElement.setAttribute('data-surface-depth', next);
    try {
      localStorage.setItem(SURFACE_DEPTH_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(SURFACE_DEPTH_SYNC_EVENT, { detail: next }));
  }, []);

  const toggleSurfaceDepth = useCallback(() => {
    setSurfaceDepth(surfaceDepth === 'flat' ? 'depth' : 'flat');
  }, [surfaceDepth, setSurfaceDepth]);

  const setAutoCollapseOnScroll = useCallback((enabled: boolean) => {
    setAutoCollapseOnScrollState(enabled);
    try {
      localStorage.setItem(AUTO_COLLAPSE_ON_SCROLL_STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent(AUTO_COLLAPSE_ON_SCROLL_SYNC_EVENT, { detail: enabled })
    );
  }, []);

  const toggleAutoCollapseOnScroll = useCallback(() => {
    setAutoCollapseOnScroll(!autoCollapseOnScroll);
  }, [autoCollapseOnScroll, setAutoCollapseOnScroll]);

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
    surfaceDepth,
    setSurfaceDepth,
    toggleSurfaceDepth,
    autoCollapseOnScroll,
    setAutoCollapseOnScroll,
    toggleAutoCollapseOnScroll,
    autoTimeTheme,
    setAutoTimeTheme,
    toggleAutoTimeTheme,
  };
}
