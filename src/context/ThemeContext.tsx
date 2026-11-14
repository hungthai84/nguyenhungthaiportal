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
  THEME_DEFAULT_WALLPAPER_ID,
  WALLPAPER_MANUAL_STORAGE_KEY,
} from '../config/ui/themeDefaults';
import { CardStyleMode } from '../config/ui/theme.types';
import { CARD_STYLES_MAP, VALID_CARD_STYLES, getCardStyleProperties } from '../config/ui/cardStyles';

const WALLPAPER_SYNC_EVENT = 'hungthai:wallpaper-changed';
const CARD_STYLE_SYNC_EVENT = 'hungthai:card-style-changed';

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
  getCardStyleProps: (mode?: CardStyleMode) => React.CSSProperties;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function normalizeCardStyle(raw: string | null): CardStyleMode {
  if (!raw) return DEFAULT_CARD_STYLE;
  if (
    raw === 'multicolor-glass' ||
    raw === 'glass' ||
    raw === 'mica' ||
    raw === 'glass-flat' ||
    raw === 'fluent-mica' ||
    raw === 'liquid-glass'
  ) {
    return DEFAULT_CARD_STYLE;
  }
  if (
    raw === 'pastel' ||
    raw === 'bento-pastel' ||
    raw === 'soft-pastel' ||
    raw === 'pastel-bento'
  ) {
    return 'pastel-bento';
  }
  if (VALID_CARD_STYLES.includes(raw as CardStyleMode)) {
    return raw as CardStyleMode;
  }
  return DEFAULT_CARD_STYLE;
}

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

  const isDark = resolveCardStyleDark(cardStyle);

  // Sync cardStyle & single-mode theme attributes to HTML root & Body
  useEffect(() => {
    const nextDark = resolveCardStyleDark(cardStyle);
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, cardStyle);
      localStorage.removeItem('theme_mode');
    } catch (e) {
      // ignore
    }

    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', cardStyle === 'cowhide-leather' ? 'cowhide-leather' : 'dark-neon');
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
    window.addEventListener(WALLPAPER_SYNC_EVENT, handleSync);
    window.addEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    return () => {
      window.removeEventListener(WALLPAPER_SYNC_EVENT, handleSync);
      window.removeEventListener(CARD_STYLE_SYNC_EVENT, handleCardStyleSync);
    };
  }, []);

  // Update wallpaper styles on body
  useEffect(() => {
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
      document.body.style.backgroundColor = isDark ? '#050816' : '#F8FAFC';
    } else if (activeWallpaper.type === 'image') {
      const imgVal = activeWallpaper.value || activeWallpaper.bg || '';
      const cleanUrl = getCleanImageUrl(imgVal);
      if (cleanUrl) {
        document.body.style.backgroundImage = `url('${cleanUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
      }
    } else if (activeWallpaper.type === 'css' || activeWallpaper.type === 'gradient') {
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
      document.body.style.backgroundColor = isDark ? '#050816' : '#F8FAFC';
    }
  }, [activeWallpaper, isDark]);

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
    setCardStyleState(normalized);
    setActiveWallpaper(defaultWp);
    try {
      localStorage.setItem(CARD_STYLE_STORAGE_KEY, normalized);
      localStorage.removeItem(WALLPAPER_MANUAL_STORAGE_KEY);
      localStorage.setItem(ACTIVE_WALLPAPER_STORAGE_KEY, JSON.stringify(defaultWp));
      localStorage.setItem('theme_wallpaper', defaultWp.value || defaultWp.bg || '');
    } catch (e) {
      // ignore
    }
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', normalized === 'cowhide-leather' ? 'cowhide-leather' : 'dark-neon');
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

  const getCardStyleProps = useCallback((mode?: CardStyleMode) => {
    return getCardStyleProperties(mode || cardStyle);
  }, [cardStyle]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        currentWallpaper: activeWallpaper.value || activeWallpaper.bg || '',
        activeWallpaper,
        setWallpaper,
        cardStyle,
        setCardStyle,
        getCardStyleProps,
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
