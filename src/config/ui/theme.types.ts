import React from 'react';

export type ThemeMechanismMode = 'light' | 'dark' | 'color';

export type ColorSchemeMode = 'light' | 'dark' | 'system';

export type SurfaceDepthMode = 'flat' | 'depth';

export type CardStyleMode =
  | 'soft-indigo-fintech'
  | 'dark-soft-indigo-fintech'
  | 'liquid-glass'
  | 'dark-liquid-glass'
  | 'multicolor-glass'
  | 'cowhide-leather'
  | 'deep-ocean'
  | 'mica-fluent'
  | 'neumorphism-beyond';

export type ThemeFamilyId =
  | 'soft-indigo-fintech'
  | 'liquid-glass'
  | 'multicolor-glass'
  | 'cowhide-leather'
  | 'deep-ocean'
  | 'mica-fluent'
  | 'neumorphism-beyond';

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

export interface ThemeWallpaperPreset {
  id: string;
  name: string;
  cardStyle: CardStyleMode;
  wallpaper: {
    id: string;
    name: string;
    type: 'image' | 'video' | 'css' | 'gradient' | 'webgl';
    value: string;
    bg?: string;
    previewStyle?: React.CSSProperties;
    gravityConfig?: any;
    isCustom?: boolean;
  };
  blur: number;
  dim: number;
  adaptiveAccentEnabled: boolean;
  isBuiltIn?: boolean;
  createdAt: number;
}

