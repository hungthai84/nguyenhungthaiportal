import { useContext } from 'react';
import {
  CARD_STYLE_PRESETS_LIST,
  CARD_STYLES_MAP,
  VALID_CARD_STYLES,
  getCardStyleProperties,
  getCardStyleConfig,
} from '../config/ui/cardStyles';
import { CARD_STYLE_STORAGE_KEY } from '../config/ui/themeDefaults';
import { CardStyleMode } from '../config/ui/theme.types';
import { useThemeContext } from '../context/ThemeContext';
import { useThemeLegacy } from './useThemeLegacy';

export {
  CARD_STYLE_PRESETS_LIST,
  CARD_STYLES_MAP,
  VALID_CARD_STYLES,
  getCardStyleProperties,
  getCardStyleConfig,
  CARD_STYLE_STORAGE_KEY,
};
export type { CardStyleMode };

export function useTheme() {
  try {
    const ctx = useThemeContext();
    return ctx;
  } catch (e) {
    // If used outside ThemeProvider fallback to legacy hook
    return useThemeLegacy();
  }
}
