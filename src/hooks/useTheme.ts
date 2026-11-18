import { useContext } from 'react';
import {
  UNIFIED_INTERFACE_THEMES,
  CARD_STYLE_PRESETS_LIST,
  CARD_STYLE_GROUPS,
  CARD_STYLES_MAP,
  VALID_CARD_STYLES,
  getCardStyleProperties,
  getCardStyleConfig,
  getLightDarkCounterpart,
  getThemeForMechanism,
} from '../config/ui/cardStyles';
import type { ThemeFamilyGroupMeta } from '../config/ui/cardStyles';
import { CARD_STYLE_STORAGE_KEY } from '../config/ui/themeDefaults';
import { CardStyleMode, SurfaceDepthMode, ThemeMechanismMode } from '../config/ui/theme.types';
import { useThemeContext } from '../context/ThemeContext';
import { useThemeLegacy } from './useThemeLegacy';

export {
  UNIFIED_INTERFACE_THEMES,
  CARD_STYLE_PRESETS_LIST,
  CARD_STYLE_GROUPS,
  CARD_STYLES_MAP,
  VALID_CARD_STYLES,
  getCardStyleProperties,
  getCardStyleConfig,
  getLightDarkCounterpart,
  getThemeForMechanism,
  CARD_STYLE_STORAGE_KEY,
};
export type { CardStyleMode, SurfaceDepthMode, ThemeFamilyGroupMeta, ThemeMechanismMode };

export function useTheme() {
  try {
    const ctx = useThemeContext();
    return ctx;
  } catch (e) {
    // If used outside ThemeProvider fallback to legacy hook
    return useThemeLegacy();
  }
}
