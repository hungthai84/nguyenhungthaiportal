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
import {
  CARD_STYLE_STORAGE_KEY,
  COLOR_SCHEME_MODE_STORAGE_KEY,
  COLOR_SCHEME_MODE_SYNC_EVENT,
} from '../config/ui/themeDefaults';
import { CardStyleMode, ColorSchemeMode, SurfaceDepthMode, ThemeMechanismMode } from '../config/ui/theme.types';
import { useThemeContext } from '../context/ThemeContext';

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
  COLOR_SCHEME_MODE_STORAGE_KEY,
  COLOR_SCHEME_MODE_SYNC_EVENT,
};
export type { CardStyleMode, ColorSchemeMode, SurfaceDepthMode, ThemeFamilyGroupMeta, ThemeMechanismMode };

export function useTheme() {
  return useThemeContext();
}
