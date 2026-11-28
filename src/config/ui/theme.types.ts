import React from 'react';

export type ThemeMechanismMode = 'light' | 'dark' | 'color';

export type ColorSchemeMode = 'light' | 'dark' | 'system';

export type SurfaceDepthMode = 'flat' | 'depth';

export type WaveMotionMode = 'off' | 'gentle' | 'normal' | 'vivid';

export type CardEffectMode = 'default' | 'float' | 'inset' | 'glow' | 'shine' | 'tilt' | 'static';

export type CardStyleMode =
  | 'liquid-glass'
  | 'dark-liquid-glass'
  | 'cowhide-leather'
  | 'walnut-wood'
  | 'deep-ocean'
  | 'frost-ice-neu'
  | 'flat-soft-ui'
  | 'dark-flat-soft-ui'
  | 'mica-fluent'
  | 'gradient-dopamine'
  | 'iridescent-liquid-glass'
  | 'dark-iridescent-liquid-glass';

export type ThemeFamilyId =
  | 'liquid-glass'
  | 'iridescent-liquid-glass'
  | 'cowhide-leather'
  | 'walnut-wood'
  | 'deep-ocean'
  | 'frost-ice-neu'
  | 'flat-soft-ui'
  | 'mica-fluent'
  | 'gradient-dopamine';

export interface CardStyleConfig {
  id: CardStyleMode;
  familyId: ThemeFamilyId;
  familyLabel: string;
  familyLabelEn: string;
  mechanism: ThemeMechanismMode;
  counterpartMode: CardStyleMode;
  cardClassName: string;
  name: string;
  label: string;
  shortBadge: string;
  tagLabel: string;
  modeLabel: string;
  isDark: boolean;
  icon: string;
  color: string;
  desc: string;
  cardSampleStyle: React.CSSProperties;
  miniPreviewWrapStyle?: React.CSSProperties;
  miniTabStyle?: React.CSSProperties;
  miniBtnStyle?: React.CSSProperties;
  badgeColorClass?: string;
}

export interface DesignTokens {
  fontMain: string;
  fontQuote: string;
  containerMaxW: string;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  radiusDefault: string;
}

export interface ThemeState {
  cardStyle: CardStyleMode;
  isDark: boolean;
  activeWallpaper: any;
}

export interface GlassCustomization {
  cardOpacity: number;
  blurIntensity: number;
}

export interface WallpaperOverlaySettings {
  blur: number;
  dim: number;
}

export interface AdaptiveAccentPalette {
  primary: string;
  link: string;
  gradient: string;
  rgb: string;
  recommendedDark: boolean;
  contrastLabelVi: string;
  contrastLabelEn: string;
  swatches: string[];
}

export interface AdaptiveAccentState {
  enabled: boolean;
  activeAccent: AdaptiveAccentPalette | null;
}

export type ThemeWallpaperPreset = import('../../data/wallpapers').WallpaperPreset & {
  cardStyle?: import('./theme.types').CardStyleMode;
  wallpaper?: any;
};


