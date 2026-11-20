import React from 'react';

export type ThemeMechanismMode = 'light' | 'dark' | 'color';

export type ColorSchemeMode = 'light' | 'dark' | 'system';

export type SurfaceDepthMode = 'flat' | 'depth';

export type CardStyleMode =
  | 'liquid-glass'
  | 'dark-liquid-glass'
  | 'cowhide-leather'
  | 'deep-ocean'
  | 'mica-fluent';

export type ThemeFamilyId =
  | 'liquid-glass'
  | 'cowhide-leather'
  | 'deep-ocean'
  | 'mica-fluent';

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
