import React from 'react';

export type ThemeMechanismMode = 'light' | 'dark' | 'color';

export type ColorSchemeMode = 'light' | 'dark' | 'system';

export type SurfaceDepthMode = 'flat' | 'depth';

export type CardStyleMode =
  | 'liquid-glass'
  | 'dark-liquid-glass'
  | 'multicolor-glass'
  | 'dark-neon-glass'
  | 'cowhide-leather'
  | 'black-cowhide-leather'
  | 'deep-ocean'
  | 'light-deep-ocean'
  | 'neumorphism-beyond'
  | 'dark-neumorphism-beyond'
  | 'frost-ice-neu'
  | 'dark-frost-ice-neu';

export type ThemeFamilyId =
  | 'liquid-glass'
  | 'cowhide-leather'
  | 'deep-ocean'
  | 'neumorphism-beyond'
  | 'frost-ice-neu'
  | 'multicolor-glass';

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
  layerDepth?: number;
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


