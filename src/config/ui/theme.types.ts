import React from 'react';

export type CardStyleMode =
  | 'light-glassmorphism'
  | 'light-multicolor-glass'
  | 'light-multicolor-glass-dark'
  | 'dark-glassmorphism'
  | 'dark-neon-multicolor-glass'
  | 'dark-neon-multicolor-glass-light'
  | 'ice-blue-neumorphism'
  | 'dark-ice-blue-neumorphism'
  | 'pastel-lilac-soft'
  | 'dark-pastel-lilac-soft'
  | 'light-cowhide-leather'
  | 'cowhide-leather';

export type ThemeFamilyId =
  | 'glassmorphism'
  | 'light-multicolor-glass'
  | 'ice-blue-neumorphism'
  | 'pastel-soft-ui'
  | 'cowhide-leather';

export interface CardStyleConfig {
  id: CardStyleMode;
  familyId: ThemeFamilyId;
  familyLabel: string;
  familyLabelEn: string;
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
