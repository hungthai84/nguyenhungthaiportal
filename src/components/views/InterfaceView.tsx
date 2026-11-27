import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  useTheme,
  getCardStyleProperties,
  getCardStyleConfig,
  getLightDarkCounterpart,
  UNIFIED_INTERFACE_THEMES,
  CARD_STYLE_GROUPS,
  ThemeMechanismMode,
} from '@/hooks/useTheme';
import { THEME_FOUR_WORD_NAMES, normalizeCardStyle } from '@/config/ui/cardStyles';
import { CardEffectMode, CardStyleMode, ThemeFamilyId } from '@/config/ui/theme.types';
import {
  DEFAULT_CARD_STYLE,
  DEFAULT_CORNER_RADIUS,
  DEFAULT_CARD_EFFECT,
  MIN_CORNER_RADIUS,
  MAX_CORNER_RADIUS,
  THEME_BACKGROUNDS,
  THEME_CARD_SPECS,
  THEME_DEFAULT_WALLPAPER_ID,
  INTERFACE_SURFACE_COLOR_PRESETS,
  INTERFACE_PRIMARY_COLOR_PRESETS,
  CARD_EFFECT_PRESETS,
  VISUAL_THEME_MODE_STORAGE_KEY,
  LAST_STANDARD_CARD_STYLE_STORAGE_KEY,
  VisualThemeMode,
  isNeumorphismCardStyle,
} from '@/config/ui/themeDefaults';
import {
  WALLPAPER_PRESETS_LIST,
  getWallpaperThumbnailUrl,
  isCodePenWallpaper,
} from '@/data/wallpapers';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { ThemePresetCard, ThemeVisualMeta } from './interface/ThemePresetCard';
import { IridescentStudioPanel } from './interface/IridescentStudioPanel';
import { isIridescentTheme } from '@/config/ui/iridescentConfig';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';

const INTERFACE_UI_PREFS_KEY = 'hungthai_interface_ui_prefs_v1';

interface InterfaceUiPrefs {
  selectedFamilyFilter: 'all' | ThemeFamilyId;
  selectedMechanismFilter: 'all' | ThemeMechanismMode;
  isSandboxOpen: boolean;
  neuSliders: number[];
  gridColumns: 'auto' | 4 | 5;
}

function readInterfaceUiPrefs(): InterfaceUiPrefs {
  const fallback: InterfaceUiPrefs = {
    selectedFamilyFilter: 'all',
    selectedMechanismFilter: 'all',
    isSandboxOpen: false,
    neuSliders: [68, 38, 92, 54, 82, 70],
    gridColumns: 'auto',
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(INTERFACE_UI_PREFS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<InterfaceUiPrefs>;
    const rawFamily = parsed.selectedFamilyFilter as string | undefined;
    const migratedFamily: 'all' | ThemeFamilyId =
      rawFamily === 'all' ||
      rawFamily === 'liquid-glass' ||
      rawFamily === 'cowhide-leather' ||
      rawFamily === 'walnut-wood' ||
      rawFamily === 'deep-ocean' ||
      rawFamily === 'neumorphism-beyond' ||
      rawFamily === 'frost-ice-neu' ||
      rawFamily === 'flat-soft-ui' ||
      rawFamily === 'mica-fluent' ||
      rawFamily === 'gradient-dopamine' ||
      rawFamily === 'iridescent-liquid-glass'
        ? rawFamily
        : fallback.selectedFamilyFilter;
    const validGridCols: 'auto' | 4 | 5 =
      parsed.gridColumns === 4 || parsed.gridColumns === 5 || parsed.gridColumns === 'auto'
        ? parsed.gridColumns
        : fallback.gridColumns;
    return {
      selectedFamilyFilter: migratedFamily,
      selectedMechanismFilter: parsed.selectedMechanismFilter ?? fallback.selectedMechanismFilter,
      isSandboxOpen: typeof parsed.isSandboxOpen === 'boolean' ? parsed.isSandboxOpen : fallback.isSandboxOpen,
      neuSliders:
        Array.isArray(parsed.neuSliders) && parsed.neuSliders.length === 6
          ? parsed.neuSliders.map((n) => (typeof n === 'number' && Number.isFinite(n) ? n : 50))
          : fallback.neuSliders,
      gridColumns: validGridCols,
    };
  } catch {
    return fallback;
  }
}

export interface InterfaceViewProps {
  onShowNotification?: (msg: string) => void;
}

const THEME_VISUAL_META: Record<CardStyleMode, ThemeVisualMeta> = {
  'liquid-glass': {
    radius: '14px',
    activeRingColor: '#6D28D9',
    activeBorderClass: 'border-[#6D28D9]',
    idleBorderClass: 'border-white/85 hover:border-violet-400/60',
    activeBadgeClass: 'bg-violet-50/90 text-[#6D28D9] border-violet-300/60 shadow-xs backdrop-blur-md',
    iconColor: '#6D28D9',
    titleTextClass: 'text-[#1E293B]',
    bodyTextClass: 'text-[#475569]',
    accentTextClass: 'text-[#6D28D9]',
    previewBorderClass: 'border-white/80',
    dividerClass: 'border-violet-200/55',
    ctaIdleClass: 'bg-white/80 text-[#6D28D9] hover:bg-white border border-white/90 shadow-xs backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#6D28D9] via-[#4F46E5] to-[#0891B2] text-white shadow-xs border border-white/75',
    toggleTrackDarkClass: 'bg-[#101A2B] border-violet-300/40',
    toggleTrackLightClass: 'bg-[#F8F6F7] border-white/90',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#B5A7F4] to-[#67E8F9] text-[#101A2B]',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#6D28D9] to-[#4F46E5] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Purple', width: '92%', gradient: 'linear-gradient(90deg, #6D28D9, #4F46E5)', glow: '0 0 10px rgba(109, 40, 217, 0.30)' },
      { label: 'Lavender', width: '80%', gradient: 'linear-gradient(90deg, #A78BFA, #CFC5E9)', glow: '0 0 10px rgba(167, 139, 250, 0.28)' },
      { label: 'Cyan', width: '68%', gradient: 'linear-gradient(90deg, #0891B2, #A9E6E7)', glow: '0 0 10px rgba(8, 145, 178, 0.25)' },
    ],
    primaryPalette: [
      { name: 'Royal Violet', hex: '#6D28D9' },
      { name: 'Indigo Iris', hex: '#4F46E5' },
      { name: 'Ocean Cyan', hex: '#0891B2' },
      { name: 'Pearl White', hex: '#F8F6F7' },
    ],
  },
  'dark-liquid-glass': {
    radius: '14px',
    activeRingColor: '#B5A7F4',
    activeBorderClass: 'border-[#B5A7F4]',
    idleBorderClass: 'border-white/15 hover:border-[#B5A7F4]/55',
    activeBadgeClass: 'bg-[#171F33]/90 text-[#B5A7F4] border-[#B5A7F4]/45 shadow-xs backdrop-blur-md',
    iconColor: '#B5A7F4',
    titleTextClass: 'text-[#F8FAFC]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#B5A7F4]',
    previewBorderClass: 'border-white/20',
    dividerClass: 'border-white/15',
    ctaIdleClass: 'bg-[#171F33]/80 text-[#F8FAFC] hover:bg-[#1E2B45] border border-white/20 backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#B5A7F4] via-[#9889EE] to-[#67E8F9] text-[#101A2B] font-bold shadow-xs border border-violet-200/50',
    toggleTrackDarkClass: 'bg-[#101A2B] border-[#B5A7F4]/40',
    toggleTrackLightClass: 'bg-[#F8F6F7] border-white/80',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#B5A7F4] to-[#67E8F9] text-[#101A2B]',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#6D28D9] to-[#4F46E5] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    gradientBars: [
      { label: 'Lavender', width: '94%', gradient: 'linear-gradient(90deg, #B5A7F4, #9889EE)', glow: '0 0 12px rgba(181, 167, 244, 0.42)' },
      { label: 'Cyan', width: '82%', gradient: 'linear-gradient(90deg, #67E8F9, #4E9EAA)', glow: '0 0 12px rgba(103, 232, 249, 0.36)' },
      { label: 'Rose', width: '70%', gradient: 'linear-gradient(90deg, #F5A8B7, #9889EE)', glow: '0 0 12px rgba(245, 168, 183, 0.34)' },
    ],
    primaryPalette: [
      { name: 'Soft Lavender', hex: '#B5A7F4' },
      { name: 'Frost Cyan', hex: '#67E8F9' },
      { name: 'Rose Blush', hex: '#F5A8B7' },
      { name: 'Deep Indigo', hex: '#101A2B' },
    ],
  },
  'cowhide-leather': {
    radius: '14px',
    activeRingColor: '#F5DEB3',
    activeBorderClass: 'border-[#F5DEB3]',
    idleBorderClass: 'border-[#522E10] hover:border-[#D4A373]',
    activeBadgeClass: 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] border-[#F5DEB3]/80',
    iconColor: '#FDE68A',
    titleTextClass: 'text-[#FFF8DC]',
    bodyTextClass: 'text-[#F5DEB3]',
    accentTextClass: 'text-[#FDE68A]',
    previewBorderClass: 'border-[#F5DEB3]/45 border-dashed',
    dividerClass: 'border-[#F5DEB3]/30 border-dashed',
    ctaIdleClass: 'bg-[#522E10]/90 text-[#FFF8DC] hover:bg-[#3D210B] border border-[#F5DEB3]/35',
    ctaActiveClass: 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] shadow-xs border border-[#F5DEB3]/60',
    toggleTrackDarkClass: 'bg-[#3D210B] border-[#F5DEB3]/55',
    toggleTrackLightClass: 'bg-[#FEF3C7] border-[#D97706]/60',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#FDE68A] to-[#D97706] text-[#3D210B]',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#D97706] to-[#92400E] text-white',
    outlineStyle: (isActive) => ({
      outline: isActive ? '2px dashed #FFF8DC' : '1.5px dashed rgba(245, 222, 179, 0.58)',
      outlineOffset: '-6px',
    }),
    demoVideoUrl:
      'https://cdn.scena.ai/project/10223/50b7b30031d4b9124af4948a069cdf530ca8f0942767f6e6b713c350cb8bd6b2.mp4',
    gradientBars: [
      { label: 'B1', width: '88%', gradient: 'linear-gradient(90deg, #f59e0b, #fde68a)' },
      { label: 'B2', width: '72%', gradient: 'linear-gradient(90deg, #d97706, #fbbf24)' },
    ],
    primaryPalette: [
      { name: 'Saddle Cognac', hex: '#92400E' },
      { name: 'Burnished Amber', hex: '#D97706' },
      { name: 'Cream Stitch', hex: '#F5DEB3' },
      { name: 'Warm Hide', hex: '#522E10' },
    ],
  },
  'walnut-wood': {
    radius: '14px',
    activeRingColor: '#F5C478',
    activeBorderClass: 'border-[#F5C478]',
    idleBorderClass: 'border-[#4E2F1B] hover:border-[#F5C478]/80',
    activeBadgeClass: 'bg-gradient-to-r from-[#5A341C] to-[#2B170C] text-[#FFFBF4] border-[#F5C478]/75',
    iconColor: '#F5C478',
    titleTextClass: 'text-[#FFFBF4]',
    bodyTextClass: 'text-[#F5E9D6]',
    accentTextClass: 'text-[#F5C478]',
    previewBorderClass: 'border-[#F5C478]/35 border-solid',
    dividerClass: 'border-[#F5C478]/25 border-solid',
    ctaIdleClass: 'bg-[#2A190F]/92 text-[#FFFBF4] hover:bg-[#3A2214] border border-[#F5C478]/40',
    ctaActiveClass: 'bg-gradient-to-r from-[#F5C478] to-[#D97706] text-[#1A0E07] font-bold shadow-xs border border-[#FDE68A]',
    toggleTrackDarkClass: 'bg-[#1B1009] border-[#F5C478]/50',
    toggleTrackLightClass: 'bg-[#522E10] border-[#F5DEB3]/60',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#FDE68A] to-[#D97706] text-[#1A0E07]',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#FDE68A] to-[#D97706] text-[#3D210B]',
    outlineStyle: (isActive) => ({
      outline: isActive ? '1.5px solid #F5C478' : '1px solid rgba(245, 196, 120, 0.28)',
      outlineOffset: '-6px',
    }),
    demoVideoUrl:
      'https://cdn.scena.ai/project/10223/50b7b30031d4b9124af4948a069cdf530ca8f0942767f6e6b713c350cb8bd6b2.mp4',
    gradientBars: [
      { label: 'Grain', width: '92%', gradient: 'linear-gradient(90deg, #F5C478, #D97706)' },
      { label: 'Walnut', width: '78%', gradient: 'linear-gradient(90deg, #8B5A2B, #F5C478)' },
    ],
    primaryPalette: [
      { name: 'Brushed Brass', hex: '#F5C478' },
      { name: 'Heartwood', hex: '#4E2F1B' },
      { name: 'Dark Walnut', hex: '#2A190F' },
      { name: 'Ivory Cream', hex: '#FFFBF4' },
    ],
  },
  'deep-ocean': {
    radius: '14px',
    activeRingColor: '#38BDF8',
    activeBorderClass: 'border-[#38BDF8]',
    idleBorderClass: 'border-sky-500/30 hover:border-sky-400',
    activeBadgeClass: 'bg-[#06B6D4] text-white border-sky-400',
    iconColor: '#38BDF8',
    titleTextClass: 'text-sky-200',
    bodyTextClass: 'text-slate-300',
    accentTextClass: 'text-sky-300',
    previewBorderClass: 'border-sky-400/40 border-solid',
    dividerClass: 'border-sky-400/30 border-solid',
    ctaIdleClass: 'bg-[#101C38] text-sky-200 hover:bg-[#162850] border border-sky-400/30',
    ctaActiveClass: 'bg-gradient-to-r from-[#06B6D4] to-[#0284C7] text-white shadow-xs border border-sky-400',
    toggleTrackDarkClass: 'bg-[#0A1128] border-sky-500/40',
    toggleTrackLightClass: 'bg-slate-800 border-slate-700',
    toggleThumbDarkClass: 'bg-sky-400 text-slate-950',
    toggleThumbLightClass: 'bg-sky-400 text-slate-950',
    outlineStyle: (isActive) => ({
      outline: isActive ? '2px solid #38BDF8' : '1.5px solid rgba(56, 189, 248, 0.35)',
      outlineOffset: '-6px',
    }),
    demoVideoUrl: 'https://cdn.scena.ai/project/10223/cc5a8e558d2380dc8bfb96fd26cd877e444d63b6a7036a8530abd823d6d6da63.mp4',
    gradientBars: [
      { label: 'O1', width: '92%', gradient: 'linear-gradient(90deg, #06B6D4, #38BDF8)', glow: '0 0 10px rgba(6, 182, 212, 0.4)' },
      { label: 'O2', width: '78%', gradient: 'linear-gradient(90deg, #0284C7, #06B6D4)', glow: '0 0 10px rgba(2, 132, 199, 0.4)' },
    ],
    primaryPalette: [
      { name: 'Sonar Cyan', hex: '#38BDF8' },
      { name: 'Trench Aqua', hex: '#06B6D4' },
      { name: 'Abyssal Blue', hex: '#0284C7' },
      { name: 'Deep Trench', hex: '#0A1128' },
    ],
  },
  'neumorphism-beyond': {
    radius: '14px',
    activeRingColor: '#4973FF',
    activeBorderClass: 'border-[#4973FF]',
    idleBorderClass: 'border-[#C4D1E2] hover:border-[#64B6FF]',
    activeBadgeClass: 'bg-[#E5EBF3] text-[#4973FF] border-[#C4D1E2] shadow-xs',
    iconColor: '#EE6AD2',
    titleTextClass: 'text-[#1E293B]',
    bodyTextClass: 'text-[#475569]',
    accentTextClass: 'text-[#4973FF]',
    previewBorderClass: 'border-[#C4D1E2] border-solid',
    dividerClass: 'border-slate-300/60 border-solid',
    ctaIdleClass: 'bg-[#E8EEF6] text-[#475569] hover:text-[#1E293B] border border-[#C4D1E2] shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#4973FF] via-[#64B6FF] to-[#2AD8E6] text-white shadow-xs border border-[#4973FF]/40',
    toggleTrackDarkClass: 'bg-[#DFE6F0] border-[#C4D1E2]',
    toggleTrackLightClass: 'bg-[#4973FF] border-[#4973FF]',
    toggleThumbDarkClass: 'bg-[#EAEFF6] text-[#475569]',
    toggleThumbLightClass: 'bg-[#EAEFF6] text-[#4973FF]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Sky', width: '68%', gradient: 'linear-gradient(90deg, #64B6FF, #4FA4FA)' },
      { label: 'Blue', width: '42%', gradient: 'linear-gradient(90deg, #4973FF, #3760EE)' },
      { label: 'Indigo', width: '92%', gradient: 'linear-gradient(90deg, #445CE6, #344AD4)' },
      { label: 'Pink', width: '56%', gradient: 'linear-gradient(90deg, #EE6AD2, #DE54C2)' },
      { label: 'Cyan', width: '80%', gradient: 'linear-gradient(90deg, #2AD8E6, #18C2D2)' },
      { label: 'Mint', width: '70%', gradient: 'linear-gradient(90deg, #52E0A8, #3ACF94)' },
    ],
    primaryPalette: [
      { name: 'Electric Blue', hex: '#4973FF' },
      { name: 'Glass Magenta', hex: '#EE6AD2' },
      { name: 'Aqua Glow', hex: '#2AD8E6' },
      { name: 'Soft Mist', hex: '#EBF0F6' },
    ],
  },
  'dark-neumorphism-beyond': {
    radius: '14px',
    activeRingColor: '#64B6FF',
    activeBorderClass: 'border-[#64B6FF]',
    idleBorderClass: 'border-slate-700/80 hover:border-[#64B6FF]/70',
    activeBadgeClass: 'bg-[#1D2636] text-[#64B6FF] border-slate-600/80 shadow-xs',
    iconColor: '#EE6AD2',
    titleTextClass: 'text-[#F1F5F9]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#64B6FF]',
    previewBorderClass: 'border-slate-700/80 border-solid',
    dividerClass: 'border-slate-700/60 border-solid',
    ctaIdleClass: 'bg-[#1B2230] text-[#CBD5E1] hover:text-white border border-slate-700/80 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#4973FF] via-[#64B6FF] to-[#2AD8E6] text-white shadow-xs border border-[#64B6FF]/45',
    toggleTrackDarkClass: 'bg-[#151B26] border-slate-700',
    toggleTrackLightClass: 'bg-[#4973FF] border-[#64B6FF]',
    toggleThumbDarkClass: 'bg-[#263042] text-[#64B6FF]',
    toggleThumbLightClass: 'bg-[#E2E8F0] text-[#151B26]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Sky', width: '68%', gradient: 'linear-gradient(90deg, #64B6FF, #4FA4FA)' },
      { label: 'Blue', width: '42%', gradient: 'linear-gradient(90deg, #4973FF, #3760EE)' },
      { label: 'Indigo', width: '92%', gradient: 'linear-gradient(90deg, #445CE6, #344AD4)' },
      { label: 'Pink', width: '56%', gradient: 'linear-gradient(90deg, #EE6AD2, #DE54C2)' },
      { label: 'Cyan', width: '80%', gradient: 'linear-gradient(90deg, #2AD8E6, #18C2D2)' },
      { label: 'Mint', width: '70%', gradient: 'linear-gradient(90deg, #52E0A8, #3ACF94)' },
    ],
    primaryPalette: [
      { name: 'Ice Sky', hex: '#64B6FF' },
      { name: 'Neon Pink', hex: '#EE6AD2' },
      { name: 'Mint Teal', hex: '#52E0A8' },
      { name: 'Charcoal Slate', hex: '#151B26' },
    ],
  },
  'frost-ice-neu': {
    radius: '14px',
    activeRingColor: '#5B57E8',
    activeBorderClass: 'border-0',
    idleBorderClass: 'border-0',
    activeBadgeClass: 'bg-[#E0E8F2] text-[#433EC9] border-0 shadow-[-4px_-4px_8px_rgba(255,255,255,0.86),4px_4px_8px_rgba(163,179,199,0.56)]',
    iconColor: '#5B57E8',
    titleTextClass: 'text-[#18273B]',
    bodyTextClass: 'text-[#475B73]',
    accentTextClass: 'text-[#433EC9]',
    previewBorderClass: 'border-0',
    dividerClass: 'border-0',
    ctaIdleClass:
      'bg-[#E0E8F2] text-[#18273B] hover:text-[#433EC9] border-0 shadow-[-4px_-4px_9px_rgba(255,255,255,0.86),4px_4px_9px_rgba(163,179,199,0.56)] hover:shadow-[-5px_-5px_11px_rgba(255,255,255,0.92),5px_5px_11px_rgba(163,179,199,0.62)] active:shadow-[inset_3px_3px_6px_rgba(163,179,199,0.60),inset_-3px_-3px_6px_rgba(255,255,255,0.86)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B57E8]',
    ctaActiveClass:
      'bg-[#5B57E8] text-white border-0 shadow-[-3px_-3px_8px_rgba(255,255,255,0.80),4px_4px_10px_rgba(91,87,232,0.36),inset_1px_1px_2px_rgba(255,255,255,0.22),inset_-1px_-1px_3px_rgba(34,30,128,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#433EC9]',
    toggleTrackDarkClass: 'bg-[#E0E8F2] border-0',
    toggleTrackLightClass: 'bg-[#5B57E8] border-0',
    toggleThumbDarkClass: 'bg-[#E0E8F2] text-[#475B73]',
    toggleThumbLightClass: 'bg-[#FFFFFF] text-[#5B57E8]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Primary', width: '82%', gradient: '#5B57E8' },
      { label: 'Inset', width: '64%', gradient: '#433EC9' },
    ],
    primaryPalette: [
      { name: 'Indigo Frost', hex: '#5B57E8' },
      { name: 'Deep Periwinkle', hex: '#433EC9' },
      { name: 'Ice Matte', hex: '#E0E8F2' },
      { name: 'Frost Ink', hex: '#18273B' },
    ],
  },
  'flat-soft-ui': {
    radius: '14px',
    activeRingColor: '#4F46E5',
    activeBorderClass: 'border-[#4F46E5]',
    idleBorderClass: 'border-slate-200 hover:border-indigo-400',
    activeBadgeClass: 'bg-indigo-50 text-[#4F46E5] border-indigo-200 shadow-xs',
    iconColor: '#4F46E5',
    titleTextClass: 'text-[#0F172A]',
    bodyTextClass: 'text-[#475569]',
    accentTextClass: 'text-[#4F46E5]',
    previewBorderClass: 'border-slate-200',
    dividerClass: 'border-slate-200',
    ctaIdleClass: 'bg-white text-[#4F46E5] hover:bg-slate-50 border border-slate-200 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white shadow-xs border border-indigo-500',
    toggleTrackDarkClass: 'bg-slate-900 border-slate-700',
    toggleTrackLightClass: 'bg-indigo-50 border-indigo-200',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Indigo', width: '88%', gradient: 'linear-gradient(90deg, #4F46E5, #6366F1)' },
      { label: 'Blue', width: '76%', gradient: 'linear-gradient(90deg, #3B82F6, #60A5FA)' },
      { label: 'Teal', width: '64%', gradient: 'linear-gradient(90deg, #0D9488, #2DD4BF)' },
    ],
    primaryPalette: [
      { name: 'Studio Indigo', hex: '#4F46E5' },
      { name: 'Azure Blue', hex: '#3B82F6' },
      { name: 'Flat Teal', hex: '#0D9488' },
      { name: 'Paper White', hex: '#F8FAFC' },
    ],
  },
  'dark-flat-soft-ui': {
    radius: '14px',
    activeRingColor: '#6366F1',
    activeBorderClass: 'border-[#6366F1]',
    idleBorderClass: 'border-slate-700/60 hover:border-indigo-400/60',
    activeBadgeClass: 'bg-[#1E293B] text-[#A5B4FC] border-indigo-500/30 shadow-xs',
    iconColor: '#818CF8',
    titleTextClass: 'text-[#F8FAFC]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#818CF8]',
    previewBorderClass: 'border-slate-700/60',
    dividerClass: 'border-slate-800',
    ctaIdleClass: 'bg-[#1E293B] text-[#CBD5E1] hover:text-white border border-slate-700/60 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-xs border border-indigo-400/50',
    toggleTrackDarkClass: 'bg-[#0A0E17] border-slate-700/60',
    toggleTrackLightClass: 'bg-[#6366F1] border-indigo-400',
    toggleThumbDarkClass: 'bg-[#1E293B] text-[#A5B4FC]',
    toggleThumbLightClass: 'bg-[#F8FAFC] text-[#0F172A]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    gradientBars: [
      { label: 'Indigo', width: '92%', gradient: 'linear-gradient(90deg, #6366F1, #818CF8)' },
      { label: 'Sky', width: '80%', gradient: 'linear-gradient(90deg, #38BDF8, #60A5FA)' },
      { label: 'Mint', width: '68%', gradient: 'linear-gradient(90deg, #2DD4BF, #34D399)' },
    ],
    primaryPalette: [
      { name: 'Soft Indigo', hex: '#6366F1' },
      { name: 'Sky Slate', hex: '#38BDF8' },
      { name: 'Mint Emerald', hex: '#2DD4BF' },
      { name: 'Obsidian Matte', hex: '#0F172A' },
    ],
  },
  'mica-fluent': {
    radius: '18px',
    activeRingColor: '#FF2E93',
    activeBorderClass: 'border-[#FF2E93]',
    idleBorderClass: 'border-white/25 hover:border-[#FF2E93]/65',
    activeBadgeClass: 'bg-[#FFF0F7] text-[#FF2E93] border-[#FF2E93]/35 shadow-xs backdrop-blur-[20px]',
    iconColor: '#FF2E93',
    titleTextClass: 'text-[#1C0708]',
    bodyTextClass: 'text-[#3F292B]',
    accentTextClass: 'text-[#FF2E93]',
    previewBorderClass: 'border-white/35',
    dividerClass: 'border-[#1C0708]/12',
    ctaIdleClass: 'bg-[#FAFAFA]/85 text-[#1C0708] hover:bg-white border border-white/40 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#FF2E93] to-[#E11D48] text-white shadow-xs border border-[#FF2E93]',
    toggleTrackDarkClass: 'bg-[#525A65] border-[#3B424C]',
    toggleTrackLightClass: 'bg-[#FAFAFA] border-white/40',
    toggleThumbDarkClass: 'bg-[#3B424C] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#FF2E93] to-[#E11D48] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Hot Magenta', width: '92%', gradient: 'linear-gradient(90deg, #FF2E93, #E11D48)' },
      { label: 'Espresso', width: '80%', gradient: 'linear-gradient(90deg, #525A65, #1C0708)' },
    ],
    primaryPalette: [
      { name: 'Hot Magenta', hex: '#FF2E93' },
      { name: 'Vibrant Rose', hex: '#E11D48' },
      { name: 'Warm Espresso', hex: '#1C0708' },
      { name: 'Slate Graphite', hex: '#525A65' },
    ],
  },
  'gradient-dopamine': {
    radius: '18px',
    activeRingColor: '#FF2E93',
    activeBorderClass: 'border-[#FF2E93]',
    idleBorderClass: 'border-pink-300/60 hover:border-[#FF2E93]',
    activeBadgeClass: 'bg-pink-50/90 text-[#FF2E93] border-pink-300/75 shadow-xs backdrop-blur-md',
    iconColor: '#FF2E93',
    titleTextClass: 'text-[#181028]',
    bodyTextClass: 'text-[#3B2654]',
    accentTextClass: 'text-[#FF2E93]',
    previewBorderClass: 'border-pink-300/55',
    dividerClass: 'border-pink-200/70',
    ctaIdleClass: 'bg-white/90 text-[#FF2E93] hover:bg-white border border-pink-200/80 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#FF2E93] via-[#7C3AED] to-[#FF6B00] text-white shadow-xs border border-white/60',
    toggleTrackDarkClass: 'bg-[#181028] border-pink-400/50',
    toggleTrackLightClass: 'bg-pink-50 border-pink-200',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#FF2E93] to-[#00D2FF] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#FF2E93] via-[#7C3AED] to-[#FF6B00] text-white',
    demoVideoUrl: 'https://cdn.scena.ai/project/10223/13eee325b1e14c3b5496ca67e6bf5a3558a5ff156c17f40045f15f82d9e29391.mp4',
    gradientBars: [
      { label: 'Dopamine', width: '96%', gradient: 'linear-gradient(90deg, #FF2E93, #7C3AED, #00D2FF)', glow: '0 0 12px rgba(255, 46, 147, 0.42)' },
      { label: 'Energy', width: '84%', gradient: 'linear-gradient(90deg, #FF6B00, #FF2E93)', glow: '0 0 12px rgba(255, 107, 0, 0.38)' },
    ],
    primaryPalette: [
      { name: 'Hot Magenta', hex: '#FF2E93' },
      { name: 'Electric Violet', hex: '#7C3AED' },
      { name: 'Sunset Coral', hex: '#FF6B00' },
      { name: 'Cyber Cyan', hex: '#00D2FF' },
    ],
  },
  'iridescent-liquid-glass': {
    radius: '16px',
    activeRingColor: '#06B6D4',
    activeBorderClass: 'border-[#06B6D4]',
    idleBorderClass: 'border-cyan-300/60 hover:border-orange-300/80',
    activeBadgeClass: 'bg-cyan-50/90 text-[#0284C7] border-cyan-300/60 shadow-xs backdrop-blur-md',
    iconColor: '#0284C7',
    titleTextClass: 'text-[#0F172A]',
    bodyTextClass: 'text-[#475569]',
    accentTextClass: 'text-[#0284C7]',
    previewBorderClass: 'border-white/85',
    dividerClass: 'border-cyan-200/55',
    ctaIdleClass: 'bg-white/85 text-[#0284C7] hover:bg-white border border-cyan-200/75 shadow-xs backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#FB923C] text-white font-bold shadow-xs border border-white/80',
    toggleTrackDarkClass: 'bg-[#070B14] border-cyan-400/45',
    toggleTrackLightClass: 'bg-[#F4F8FF] border-cyan-300/75',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#22D3EE] to-[#FB923C] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#06B6D4] to-[#FB923C] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Cyan', width: '92%', gradient: 'linear-gradient(90deg, #06B6D4, #3B82F6, #8B5CF6)', glow: '0 0 12px rgba(6, 182, 212, 0.42)' },
      { label: 'Chrome', width: '80%', gradient: 'linear-gradient(90deg, #FB923C, #EC4899, #22D3EE)', glow: '0 0 12px rgba(251, 146, 60, 0.36)' },
    ],
    primaryPalette: [
      { name: 'Aurora Cyan', hex: '#06B6D4' },
      { name: 'Glossy Orange', hex: '#FB923C' },
      { name: 'Prism Violet', hex: '#8B5CF6' },
      { name: 'Pearl White', hex: '#FFFFFF' },
    ],
  },
  'dark-iridescent-liquid-glass': {
    radius: '16px',
    activeRingColor: '#22D3EE',
    activeBorderClass: 'border-[#22D3EE]',
    idleBorderClass: 'border-cyan-400/35 hover:border-orange-400/65',
    activeBadgeClass: 'bg-slate-900/90 text-[#67E8F9] border-cyan-400/45 shadow-xs backdrop-blur-md',
    iconColor: '#67E8F9',
    titleTextClass: 'text-[#F8FAFC]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#67E8F9]',
    previewBorderClass: 'border-cyan-400/30',
    dividerClass: 'border-white/15',
    ctaIdleClass: 'bg-slate-900/80 text-[#67E8F9] hover:bg-slate-800 border border-cyan-400/35 shadow-xs backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#22D3EE] via-[#6366F1] to-[#FB923C] text-white font-bold shadow-xs border border-white/35',
    toggleTrackDarkClass: 'bg-[#070B14] border-cyan-400/45',
    toggleTrackLightClass: 'bg-[#F4F8FF] border-cyan-300/75',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#22D3EE] to-[#FB923C] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#06B6D4] to-[#FB923C] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Neon Cyan', width: '94%', gradient: 'linear-gradient(90deg, #22D3EE, #6366F1, #C084FC)', glow: '0 0 12px rgba(34, 211, 238, 0.48)' },
      { label: 'Prism', width: '84%', gradient: 'linear-gradient(90deg, #FB923C, #F472B6, #22D3EE)', glow: '0 0 12px rgba(251, 146, 60, 0.40)' },
    ],
    primaryPalette: [
      { name: 'Liquid Cyan', hex: '#22D3EE' },
      { name: 'Sunset Orange', hex: '#FB923C' },
      { name: 'Prism Indigo', hex: '#6366F1' },
      { name: 'Deep Glass', hex: '#0F172A' },
    ],
  },
};

export const InterfaceView: React.FC<InterfaceViewProps> = ({ onShowNotification }) => {
  const {
    cardStyle,
    setCardStyle,
    resetGlassSettings,
    setAutoTimeTheme,
    isDark,
    cornerRadius,
    setCornerRadius,
    resetCornerRadius,
    activeWallpaper,
    setWallpaper,
    customSurfaceColor,
    setCustomSurfaceColor,
    customPrimaryColor,
    setCustomPrimaryColor,
    cardEffect,
    setCardEffect,
    resetInterfaceCustomColors,
  } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const activePreset = getCardStyleConfig(cardStyle);

  const initialPrefs = useMemo(() => readInterfaceUiPrefs(), []);
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<'all' | ThemeFamilyId>(
    initialPrefs.selectedFamilyFilter
  );
  const [selectedMechanismFilter, setSelectedMechanismFilter] = useState<'all' | ThemeMechanismMode>(
    initialPrefs.selectedMechanismFilter
  );
  const [gridColumns, setGridColumns] = useState<'auto' | 4 | 5>(initialPrefs.gridColumns);
  const [wallpaperFilterType, setWallpaperFilterType] = useState<'all' | 'image' | 'css'>('all');
  const [isFamilyFilterOpen, setIsFamilyFilterOpen] = useState<boolean>(false);
  const familyFilterMenuRef = useRef<HTMLDivElement | null>(null);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(initialPrefs.isSandboxOpen);
  const [isQuickThemeSectionOpen, setIsQuickThemeSectionOpen] = useState<boolean>(false);
  const [sandboxQuery, setSandboxQuery] = useState<string>('');
  const [neuKitPressed, setNeuKitPressed] = useState<{
    mainBtn: boolean;
    heart: boolean;
    comment: boolean;
    bookmark: boolean;
    share: boolean;
  }>({
    mainBtn: false,
    heart: true,
    comment: false,
    bookmark: false,
    share: false,
  });
  const [activeVideoPreviewId, setActiveVideoPreviewId] = useState<CardStyleMode | null>(null);
  const [failedVideoIds, setFailedVideoIds] = useState<Record<string, boolean>>({});
  const [expandedThemeId, setExpandedThemeId] = useState<CardStyleMode | null>(null);
  const [isIridescentStudioOpen, setIsIridescentStudioOpen] = useState<boolean>(() =>
    isIridescentTheme(cardStyle)
  );
  const [iridescentStudioMode, setIridescentStudioMode] = useState<'light' | 'dark'>(() =>
    cardStyle === 'dark-iridescent-liquid-glass' ? 'dark' : 'light'
  );
  const interfaceBannerVideo = getDefaultBannerVideoConfig('interface');
  const [neuSliders, setNeuSliders] = useState<number[]>(initialPrefs.neuSliders);

  const isNeumorphismActive = isNeumorphismCardStyle(cardStyle);
  const visualThemeMode: VisualThemeMode = isNeumorphismActive ? 'neumorphism' : 'standard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        familyFilterMenuRef.current &&
        !familyFilterMenuRef.current.contains(event.target as Node)
      ) {
        setIsFamilyFilterOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFamilyFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cache style specimen cho từng giao diện để tránh tính lại mỗi khi thay đổi bộ lọc
  const presetSampleStyles = useMemo(() => {
    const cache = {} as Record<CardStyleMode, React.CSSProperties>;
    UNIFIED_INTERFACE_THEMES.forEach((preset) => {
      cache[preset.id] = getCardStyleProperties(preset.id).cardSampleStyle;
    });
    return cache;
  }, []);

  // Tự động lưu toàn bộ các lựa chọn trong trang Giao diện để áp dụng mặc định cho sau này
  useEffect(() => {
    try {
      const payload: InterfaceUiPrefs = {
        selectedFamilyFilter,
        selectedMechanismFilter,
        isSandboxOpen,
        neuSliders,
        gridColumns,
      };
      localStorage.setItem(INTERFACE_UI_PREFS_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [selectedFamilyFilter, selectedMechanismFilter, isSandboxOpen, neuSliders, gridColumns]);

  // Persist visual theme mode ('neumorphism' | 'standard') and last standard style in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(VISUAL_THEME_MODE_STORAGE_KEY, visualThemeMode);
      if (!isNeumorphismCardStyle(cardStyle)) {
        localStorage.setItem(LAST_STANDARD_CARD_STYLE_STORAGE_KEY, cardStyle);
      }
    } catch {
      // ignore storage quota errors
    }
  }, [cardStyle, visualThemeMode]);

  const handleToggleVisualThemeMode = useCallback(() => {
    SoundEngine.playGlassChime();
    if (isNeumorphismCardStyle(cardStyle)) {
      let savedStandard: CardStyleMode = DEFAULT_CARD_STYLE;
      try {
        const rawLast = localStorage.getItem(LAST_STANDARD_CARD_STYLE_STORAGE_KEY);
        if (rawLast) {
          const normalized = normalizeCardStyle(rawLast);
          if (!isNeumorphismCardStyle(normalized)) {
            savedStandard = normalized;
          }
        }
        localStorage.setItem(VISUAL_THEME_MODE_STORAGE_KEY, 'standard');
      } catch {
        // ignore storage errors
      }
      const targetStyle = getLightDarkCounterpart(savedStandard, isDark);
      const targetCfg = getCardStyleConfig(targetStyle);
      setCardStyle(targetStyle);
      onShowNotification?.(
        isEn
          ? `✓ Switched to Standard theme: ${THEME_FOUR_WORD_NAMES[targetStyle]?.en || t(targetCfg.name)}`
          : `✓ Đã chuyển sang giao diện Chuẩn: ${THEME_FOUR_WORD_NAMES[targetStyle]?.vi || targetCfg.name}`
      );
    } else {
      try {
        localStorage.setItem(LAST_STANDARD_CARD_STYLE_STORAGE_KEY, cardStyle);
        localStorage.setItem(VISUAL_THEME_MODE_STORAGE_KEY, 'neumorphism');
      } catch {
        // ignore storage errors
      }
      const targetNeuStyle: CardStyleMode = 'neumorphism-beyond';
      const targetCfg = getCardStyleConfig(targetNeuStyle);
      setCardStyle(targetNeuStyle);
      onShowNotification?.(
        isEn
          ? `✓ Switched to Neumorphism theme: ${THEME_FOUR_WORD_NAMES[targetNeuStyle]?.en || t(targetCfg.name)}`
          : `✓ Đã chuyển sang giao diện Nổi khối: ${THEME_FOUR_WORD_NAMES[targetNeuStyle]?.vi || targetCfg.name}`
      );
    }
  }, [cardStyle, isDark, isEn, onShowNotification, setCardStyle, t]);

  const handleSelectTheme = useCallback(
    (mode: CardStyleMode, label: string) => {
      SoundEngine.playGlassChime();
      try {
        localStorage.setItem(
          VISUAL_THEME_MODE_STORAGE_KEY,
          isNeumorphismCardStyle(mode) ? 'neumorphism' : 'standard'
        );
        if (!isNeumorphismCardStyle(mode)) {
          localStorage.setItem(LAST_STANDARD_CARD_STYLE_STORAGE_KEY, mode);
        }
      } catch {
        // ignore storage errors
      }
      setCardStyle(mode);
      if (isIridescentTheme(mode)) {
        setIridescentStudioMode(mode === 'dark-iridescent-liquid-glass' ? 'dark' : 'light');
        setIsIridescentStudioOpen(true);
      }
      if (onShowNotification) {
        onShowNotification(
          isEn
            ? `✓ Saved & applied theme: ${t(label)}`
            : `✓ Đã lưu & áp dụng giao diện: ${label}`
        );
      }
    },
    [isEn, onShowNotification, setCardStyle, t]
  );

  const handleOpenIridescentStudio = useCallback((mode: CardStyleMode) => {
    setIridescentStudioMode(mode === 'dark-iridescent-liquid-glass' ? 'dark' : 'light');
    setIsIridescentStudioOpen(true);
    setTimeout(() => {
      document.getElementById('iridescent-liquid-glass-studio')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 60);
  }, []);

  const handleToggleVideoPreview = useCallback(
    (id: CardStyleMode) => {
      SoundEngine.playTap();
      setFailedVideoIds((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setActiveVideoPreviewId((prev) => (prev === id ? null : id));
    },
    []
  );

  const handleVideoPreviewError = useCallback(
    (id: CardStyleMode) => {
      setFailedVideoIds((prev) => ({ ...prev, [id]: true }));
      setActiveVideoPreviewId((prev) => (prev === id ? null : prev));
      onShowNotification?.(
        isEn
          ? 'Unable to load preview video for this theme. Click Retry to try again.'
          : 'Không tải được video minh họa cho giao diện này. Bấm Thử lại để kiểm tra.'
      );
    },
    [isEn, onShowNotification]
  );

  const handleResetDefault = () => {
    const defaultCfg = getCardStyleConfig(DEFAULT_CARD_STYLE);
    SoundEngine.playGlassChime();
    setAutoTimeTheme(false);
    resetGlassSettings(DEFAULT_CARD_STYLE);
    resetCornerRadius();
    resetInterfaceCustomColors();
    setCardStyle(DEFAULT_CARD_STYLE);
    try {
      localStorage.setItem(VISUAL_THEME_MODE_STORAGE_KEY, 'standard');
      localStorage.setItem(LAST_STANDARD_CARD_STYLE_STORAGE_KEY, DEFAULT_CARD_STYLE);
    } catch {
      // ignore storage errors
    }
    setSelectedFamilyFilter('all');
    setSelectedMechanismFilter('all');
    setGridColumns('auto');
    setWallpaperFilterType('all');
    setIsFamilyFilterOpen(false);
    setIsSandboxOpen(false);
    setIsQuickThemeSectionOpen(false);
    setSandboxQuery('');
    setActiveVideoPreviewId(null);
    setNeuSliders([68, 38, 92, 54, 82, 70]);
    if (onShowNotification) {
      onShowNotification(
        isEn
          ? `✓ Restored & saved default interface: ${THEME_FOUR_WORD_NAMES[DEFAULT_CARD_STYLE]?.en || t(defaultCfg.name)}`
          : `✓ Đã khôi phục & lưu mặc định: ${THEME_FOUR_WORD_NAMES[DEFAULT_CARD_STYLE]?.vi || defaultCfg.name}`
      );
    }
  };

  const curatedWallpapers = useMemo(() => {
    return WALLPAPER_PRESETS_LIST.filter((wp) => {
      if (!wp || wp.id === 'none' || wp.type === 'video' || isCodePenWallpaper(wp)) return false;
      if (wallpaperFilterType === 'image') return wp.type === 'image';
      if (wallpaperFilterType === 'css') return wp.type === 'css' || wp.type === 'gradient';
      return true;
    }).slice(0, 20);
  }, [wallpaperFilterType]);

  const themeDefaultWallpaperId = THEME_DEFAULT_WALLPAPER_ID[cardStyle];
  const themeDefaultCardEffect = THEME_CARD_SPECS[cardStyle]?.defaultCardEffect || DEFAULT_CARD_EFFECT;
  const activeCardEffectMeta = useMemo(
    () => CARD_EFFECT_PRESETS.find((item) => item.id === cardEffect) || CARD_EFFECT_PRESETS[0],
    [cardEffect]
  );

  const visibleGroups = useMemo(() => {
    const familyScoped =
      selectedFamilyFilter === 'all'
        ? CARD_STYLE_GROUPS
        : CARD_STYLE_GROUPS.filter((g) => g.id === selectedFamilyFilter);

    if (selectedMechanismFilter === 'all') return familyScoped;

    return familyScoped
      .map((g) => ({
        ...g,
        presets: g.presets.filter(
          (p) => (p.mechanism || (p.isDark ? 'dark' : 'light')) === selectedMechanismFilter
        ),
      }))
      .filter((g) => g.presets.length > 0);
  }, [selectedFamilyFilter, selectedMechanismFilter]);

  const displayedThemesCount = UNIFIED_INTERFACE_THEMES.length;
  const visibleThemeEntries = useMemo(
    () =>
      visibleGroups.flatMap((group) =>
        group.presets.map((preset) => ({
          preset,
          group,
        }))
      ),
    [visibleGroups]
  );
  const visibleThemesCount = visibleThemeEntries.length;

  // Tự động đóng video preview nếu card đó bị ẩn bởi bộ lọc
  useEffect(() => {
    if (!activeVideoPreviewId) return;
    const isStillVisible = visibleThemeEntries.some(
      ({ preset }) => preset.id === activeVideoPreviewId
    );
    if (!isStillVisible) {
      setActiveVideoPreviewId(null);
    }
  }, [activeVideoPreviewId, visibleThemeEntries]);

  const isDefaultConfig =
    cardStyle === DEFAULT_CARD_STYLE &&
    cornerRadius === DEFAULT_CORNER_RADIUS &&
    customSurfaceColor === 'default' &&
    customPrimaryColor === 'default' &&
    cardEffect === themeDefaultCardEffect;

  return (
    <div
      id="interface-page-container"
      data-element-name="Trang Cấu Hình Giao Diện & Kiểu Thẻ"
      data-element-type="container"
      data-element-page="interface"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left rounded-none box-border"
    >
      <div
        id="interface-cards-track"
        data-element-name="Track căn giữa Giao Diện"
        data-element-type="container"
        data-element-page="interface"
        data-element-parent="interface-page-container"
        className="page-cards-track"
      >
        <div
          id="interface-main-card"
          data-main-card="true"
          data-element-name="Thẻ chính Trang Giao Diện"
          data-element-type="card"
          data-element-page="interface"
          data-element-parent="interface-cards-track"
          className="page-main-card flex flex-col justify-start p-[15px] gap-[15px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
          {/* BANNER TRANG GIAO DIỆN */}
          <section
            id="interface-hero-banner"
            data-element-name="Banner card Giao diện"
            data-element-type="banner-card"
            data-element-page="interface"
            data-section-card="true"
            data-has-compact-menu="true"
            className={`banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,14px)] overflow-visible relative ${
              isNeumorphismActive ? 'border-0' : 'border'
            } text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300`}
          >
            <div className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none">
              <VideoBanner
                videoId={interfaceBannerVideo.videoId}
                title={interfaceBannerVideo.title}
                className="rounded-[inherit]"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
              <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                <WebIcon name="palette" className="w-[22px] h-[22px] shrink-0" />
                <h1
                  className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                >
                  {isEn ? 'Interface theme studio' : 'Cấu hình giao diện'}
                </h1>
              </div>
              <p
                className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[60%]"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                  fontWeight: 600,
                  fontStyle: 'normal',
                }}
              >
                &quot;Tinh tế từng sắc màu, kiến tạo không gian sống động ♡&quot;
              </p>

              <CompactBannerMenu
                id="interface-compact-menu-btn"
                label={isEn ? 'Controls' : 'Điều khiển'}
                ariaLabel={isEn ? 'Theme filters and interface controls' : 'Bộ lọc nhóm giao diện và chế độ hiển thị'}
                activeCount={(selectedFamilyFilter !== 'all' ? 1 : 0) + (selectedMechanismFilter !== 'all' ? 1 : 0)}
              >
                {(closeMenu) => (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Color mode' : 'Chế độ Sáng / Tối / Màu'}
                      </span>
                      <div className="banner-control-pill w-full grid grid-cols-4 gap-1 p-1 rounded-full">
                        {(
                          [
                            { id: 'all' as const, labelVi: 'Tất cả', labelEn: 'All' },
                            { id: 'light' as const, labelVi: 'Sáng', labelEn: 'Light' },
                            { id: 'dark' as const, labelVi: 'Tối', labelEn: 'Dark' },
                            { id: 'color' as const, labelVi: 'Màu', labelEn: 'Color' },
                          ]
                        ).map((item) => {
                          const active = selectedMechanismFilter === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => {
                                SoundEngine.playTap();
                                setSelectedMechanismFilter(item.id);
                              }}
                              className={`h-7 px-2 rounded-full typo-badge font-bold cursor-pointer transition-all whitespace-nowrap border-0 ${
                                active ? 'shadow-xs' : 'opacity-80 hover:opacity-100'
                              }`}
                              style={
                                active
                                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                                  : { color: 'var(--text-primary)' }
                              }
                            >
                              {isEn ? item.labelEn : item.labelVi}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Theme family' : 'Nhóm giao diện'}
                      </span>
                      <button
                        type="button"
                        data-selected={selectedFamilyFilter === 'all' ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playTap();
                          setSelectedFamilyFilter('all');
                          closeMenu();
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span className="inline-flex items-center gap-2 truncate">
                          <WebIcon name="grid" className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{isEn ? 'All Families' : 'Tất cả giao diện'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 shrink-0">
                          <span className="typo-badge font-mono opacity-75 tabular-nums">{displayedThemesCount}</span>
                          {selectedFamilyFilter === 'all' && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                        </span>
                      </button>

                      {CARD_STYLE_GROUPS.map((grp) => {
                        const isSelectedTab = selectedFamilyFilter === grp.id;
                        return (
                          <button
                            key={grp.id}
                            type="button"
                            data-selected={isSelectedTab ? 'true' : 'false'}
                            onClick={() => {
                              SoundEngine.playTap();
                              setSelectedFamilyFilter(grp.id);
                              closeMenu();
                            }}
                            className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                          >
                            <span className="inline-flex items-center gap-2 truncate">
                              <WebIcon name={grp.icon} className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isEn ? grp.labelEn : grp.label}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 shrink-0">
                              <span className="typo-badge font-mono opacity-75 tabular-nums">{grp.presets.length}</span>
                              {isSelectedTab && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1 border-t border-[var(--border-subcard)]">
                      <button
                        type="button"
                        aria-pressed={isNeumorphismActive}
                        onClick={() => {
                          handleToggleVisualThemeMode();
                          closeMenu();
                        }}
                        className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-2 px-3 rounded-full typo-button font-bold cursor-pointer transition-all"
                        style={
                          isNeumorphismActive
                            ? {
                                background: 'var(--bg-button-primary)',
                                color: 'var(--text-button-primary, #FFFFFF)',
                              }
                            : undefined
                        }
                      >
                        <WebIcon name={isNeumorphismActive ? 'sparkles' : 'layers'} className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isEn
                            ? isNeumorphismActive
                              ? 'Theme: Neumorphism'
                              : 'Theme: Standard'
                            : isNeumorphismActive
                              ? 'Chế độ: Nổi khối'
                              : 'Chế độ: Chuẩn'}
                        </span>
                      </button>

                      <button
                        type="button"
                        aria-pressed={isSandboxOpen}
                        onClick={() => {
                          SoundEngine.playTap();
                          setIsSandboxOpen((prev) => !prev);
                          closeMenu();
                        }}
                        className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-bold cursor-pointer transition-all"
                      >
                        <WebIcon name="sliders" className="w-3.5 h-3.5 shrink-0" />
                        <span>{isEn ? 'UI Kit' : 'Bộ mẫu'}</span>
                      </button>

                      {(selectedFamilyFilter !== 'all' || selectedMechanismFilter !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setSelectedFamilyFilter('all');
                            setSelectedMechanismFilter('all');
                            closeMenu();
                          }}
                          className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-bold cursor-pointer transition-all"
                        >
                          <WebIcon name="x" className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Clear filters' : 'Xóa lọc'}</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </CompactBannerMenu>
            </div>

            <div
              id="interface-hero-banner-controls"
              className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full"
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                {/* Bộ lọc 1: Nhóm chất liệu giao diện (Dropdown trong Banner) */}
                <div className="relative inline-block text-left" ref={familyFilterMenuRef}>
                  <button
                    id="interface-family-filter-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFamilyFilterOpen((prev) => !prev);
                    }}
                    className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play"
                    title={isEn ? 'Theme family filter' : 'Bộ lọc nhóm giao diện'}
                    aria-label={isEn ? 'Theme family filter' : 'Bộ lọc nhóm giao diện'}
                    aria-expanded={isFamilyFilterOpen}
                    aria-haspopup="listbox"
                  >
                    <WebIcon name="sliders" className="w-4 h-4 shrink-0" />
                    <span>
                      {selectedFamilyFilter === 'all'
                        ? isEn
                          ? `All Families (${displayedThemesCount})`
                          : `Tất cả nhóm (${displayedThemesCount})`
                        : (() => {
                            const activeGrp = CARD_STYLE_GROUPS.find((g) => g.id === selectedFamilyFilter);
                            if (!activeGrp) return isEn ? 'Filter' : 'Bộ lọc';
                            return `${isEn ? activeGrp.labelEn : activeGrp.label} (${activeGrp.presets.length})`;
                          })()}
                    </span>
                    <WebIcon
                      name="chevron-down"
                      className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                        isFamilyFilterOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isFamilyFilterOpen && (
                      <motion.div
                        id="interface-family-filter-listbox"
                        data-element-type="card"
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        role="listbox"
                        className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14.5rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={selectedFamilyFilter === 'all'}
                          data-selected={selectedFamilyFilter === 'all' ? 'true' : 'false'}
                          onClick={() => {
                            SoundEngine.playTap();
                            setSelectedFamilyFilter('all');
                            setIsFamilyFilterOpen(false);
                          }}
                          className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                        >
                          <span className="inline-flex items-center gap-2 truncate">
                            <WebIcon name="grid" className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{isEn ? 'All Families' : 'Tất cả giao diện'}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 shrink-0">
                            <span className="typo-badge font-mono opacity-75 tabular-nums">
                              {displayedThemesCount}
                            </span>
                            {selectedFamilyFilter === 'all' && (
                              <WebIcon name="check" className="w-3.5 h-3.5 text-current stroke-[2.5] shrink-0" />
                            )}
                          </span>
                        </button>

                        {CARD_STYLE_GROUPS.map((grp) => {
                          const isSelectedTab = selectedFamilyFilter === grp.id;
                          return (
                            <button
                              key={grp.id}
                              type="button"
                              role="option"
                              aria-selected={isSelectedTab}
                              data-selected={isSelectedTab ? 'true' : 'false'}
                              onClick={() => {
                                SoundEngine.playTap();
                                setSelectedFamilyFilter(grp.id);
                                setIsFamilyFilterOpen(false);
                              }}
                              className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                            >
                              <span className="inline-flex items-center gap-2 truncate">
                                <WebIcon name={grp.icon} className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{isEn ? grp.labelEn : grp.label}</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5 shrink-0">
                                <span className="typo-badge font-mono opacity-75 tabular-nums">
                                  {grp.presets.length}
                                </span>
                                {isSelectedTab && (
                                  <WebIcon name="check" className="w-3.5 h-3.5 text-current stroke-[2.5] shrink-0" />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bộ lọc 2: Cơ chế Sáng / Tối / Màu ngay trong Banner */}
                <div
                  role="group"
                  aria-label={isEn ? 'Filter by mechanism' : 'Lọc theo chế độ Sáng, Tối, Màu'}
                  className={`banner-control-pill h-9 inline-flex items-center gap-1 px-1.5 py-1 rounded-full ${
                    isNeumorphismActive ? 'border-0' : 'border'
                  }`}
                >
                  {(
                    [
                      { id: 'all' as const, labelVi: 'Tất cả', labelEn: 'All' },
                      { id: 'light' as const, labelVi: 'Sáng', labelEn: 'Light' },
                      { id: 'dark' as const, labelVi: 'Tối', labelEn: 'Dark' },
                      { id: 'color' as const, labelVi: 'Màu', labelEn: 'Color' },
                    ]
                  ).map((item) => {
                    const active = selectedMechanismFilter === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          SoundEngine.playTap();
                          setSelectedMechanismFilter(item.id);
                        }}
                        className={`px-2.5 py-0.5 rounded-full typo-badge font-bold cursor-pointer transition-all whitespace-nowrap border-0 ${
                          active ? 'shadow-xs' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={
                          active
                            ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                            : { color: 'var(--text-primary)' }
                        }
                      >
                        {isEn ? item.labelEn : item.labelVi}
                      </button>
                    );
                  })}
                </div>

                {(selectedFamilyFilter !== 'all' || selectedMechanismFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setSelectedFamilyFilter('all');
                      setSelectedMechanismFilter('all');
                    }}
                    className={`banner-control-pill h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full ${
                      isNeumorphismActive ? 'border-0' : 'border'
                    } typo-button font-bold cursor-pointer transition-all hover:opacity-90 whitespace-nowrap shrink-0`}
                    title={isEn ? 'Clear filters' : 'Xóa bộ lọc'}
                  >
                    <WebIcon name="x" className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Clear' : 'Xóa lọc'}</span>
                  </button>
                )}
              </div>

              {/* Dedicated Visual Theme Toggle (Neumorphism <-> Standard) + Soft UI Kit Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="interface-neu-standard-toggle-btn"
                  type="button"
                  role="switch"
                  aria-checked={isNeumorphismActive}
                  aria-pressed={isNeumorphismActive}
                  data-visual-mode={visualThemeMode}
                  onClick={handleToggleVisualThemeMode}
                  className={`banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full typo-button font-bold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                    isNeumorphismActive ? 'border-0' : 'border'
                  }`}
                  style={
                    isNeumorphismActive
                      ? {
                          background: 'var(--bg-button-primary)',
                          color: 'var(--text-button-primary, #FFFFFF)',
                        }
                      : undefined
                  }
                  title={
                    isEn
                      ? isNeumorphismActive
                        ? 'Switch to Standard visual theme'
                        : 'Switch to Neumorphism visual theme'
                      : isNeumorphismActive
                        ? 'Chuyển về giao diện Chuẩn'
                        : 'Chuyển sang giao diện Nổi khối'
                  }
                >
                  <WebIcon
                    name={isNeumorphismActive ? 'sparkles' : 'layers'}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>
                    {isEn
                      ? isNeumorphismActive
                        ? 'Theme: Neumorphism'
                        : 'Theme: Standard'
                      : isNeumorphismActive
                        ? 'Chế độ: Nổi khối'
                        : 'Chế độ: Chuẩn'}
                  </span>
                </button>

                <button
                  id="interface-uikit-toggle-btn"
                  type="button"
                  aria-pressed={isSandboxOpen}
                  onClick={() => {
                    SoundEngine.playTap();
                    setIsSandboxOpen((prev) => !prev);
                  }}
                  className={`banner-control-pill h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full typo-button font-bold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                    isNeumorphismActive ? 'border-0' : 'border'
                  }`}
                  title={isEn ? 'Toggle Neumorphism UI Kit' : 'Bật/tắt bộ mẫu giao diện'}
                >
                  <WebIcon name="sliders" className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'UI Kit' : 'Bộ mẫu'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* TÙY CHỈNH CHUNG: BO CONG 4 GÓC ÁP DỤNG CHO TẤT CẢ GIAO DIỆN */}
          <section
            id="interface-global-customization-card"
            data-element-name="Tùy chỉnh chung Bo cong 4 góc"
            data-element-type="subcard"
            data-element-page="interface"
            data-subcard="true"
            className={`sub-card w-full h-auto min-h-0 shrink-0 self-start flex flex-col gap-3 p-[15px] rounded-[var(--radius-subcard,14px)] transition-all duration-200 ${
              isNeumorphismActive ? 'border-0' : 'border'
            }`}
            style={{
              background: 'var(--bg-subcard)',
              height: 'auto',
              minHeight: 0,
              flex: '0 0 auto',
              ...(isNeumorphismActive ? {} : { borderColor: 'var(--border-subcard)' }),
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-8 h-8 rounded-[var(--radius-subcard,14px)] flex items-center justify-center shrink-0"
                  style={{
                    background: 'var(--bg-button-secondary, var(--bg-card))',
                    color: 'var(--text-link, var(--color-primary))',
                  }}
                >
                  <WebIcon name="sliders" className="w-4 h-4 shrink-0" />
                </span>
                <div className="min-w-0">
                  <h2
                    className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                    data-card-title="true"
                    style={{ color: 'var(--text-link, var(--color-primary))' }}
                  >
                    {isEn
                      ? 'Global UI Customization Studio'
                      : 'Tùy chỉnh chung · Bo cong 4 góc'}
                  </h2>
                  <p className="typo-caption truncate" style={{ color: 'var(--text-muted)' }}>
                    {isEn
                      ? 'Syncs all 4 corners for Card, Sub card, Image, Video & Banner across every theme (Default: 14px)'
                      : 'Áp dụng 4 góc cho Card, Sub card, Hình ảnh, Video & Banner trên tất cả giao diện (Chuẩn: 14px)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  id="global-corner-radius-value"
                  className={`px-3 py-1 rounded-full typo-badge font-mono font-bold tabular-nums whitespace-nowrap ${
                    isNeumorphismActive ? 'border-0' : 'border'
                  }`}
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-link, var(--color-primary))',
                    ...(isNeumorphismActive ? {} : { borderColor: 'var(--border-subcard)' }),
                  }}
                >
                  {cornerRadius}px
                </span>

                <button
                  id="global-corner-radius-reset-btn"
                  type="button"
                  disabled={cornerRadius === DEFAULT_CORNER_RADIUS}
                  onClick={() => {
                    SoundEngine.playGlassChime();
                    resetCornerRadius();
                    onShowNotification?.(
                      isEn
                        ? `✓ Restored 4-corner radius to default (${DEFAULT_CORNER_RADIUS}px)`
                        : `✓ Đã khôi phục bo cong 4 góc mặc định (${DEFAULT_CORNER_RADIUS}px)`
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold transition-all whitespace-nowrap shrink-0 ${
                    isNeumorphismActive ? 'border-0' : 'border'
                  } ${
                    cornerRadius === DEFAULT_CORNER_RADIUS
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:opacity-90'
                  }`}
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    ...(isNeumorphismActive ? {} : { borderColor: 'var(--border-subcard)' }),
                  }}
                  title={
                    isEn
                      ? `Reset corner radius to ${DEFAULT_CORNER_RADIUS}px`
                      : `Đặt lại bo cong 4 góc về ${DEFAULT_CORNER_RADIUS}px`
                  }
                >
                  <WebIcon name="rotate-ccw" className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? `Default ${DEFAULT_CORNER_RADIUS}px` : `Mặc định ${DEFAULT_CORNER_RADIUS}px`}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className="typo-badge font-mono tabular-nums shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {MIN_CORNER_RADIUS}px
                </span>
                <input
                  id="global-corner-radius-slider"
                  type="range"
                  min={MIN_CORNER_RADIUS}
                  max={MAX_CORNER_RADIUS}
                  step={1}
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(Number(e.target.value))}
                  aria-label={
                    isEn
                      ? 'Global 4-corner border radius in pixels'
                      : 'Tùy chỉnh chung độ bo cong 4 góc (px)'
                  }
                  className="w-full h-2 rounded-full cursor-pointer accent-[var(--color-primary)]"
                />
                <span
                  className="typo-badge font-mono tabular-nums shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {MAX_CORNER_RADIUS}px
                </span>
              </div>

              <div
                role="group"
                aria-label={isEn ? 'Corner radius presets' : 'Mức bo cong nhanh'}
                className="flex flex-wrap items-center gap-1.5 shrink-0"
              >
                {[0, 8, 14, 20, 24].map((presetRadius) => {
                  const isSelected = cornerRadius === presetRadius;
                  return (
                    <button
                      key={presetRadius}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        SoundEngine.playTap();
                        setCornerRadius(presetRadius);
                      }}
                      className={`px-2.5 py-1 rounded-full typo-badge font-mono font-bold tabular-nums transition-all cursor-pointer whitespace-nowrap ${
                        isNeumorphismActive ? 'border-0' : 'border'
                      } ${isSelected ? 'shadow-xs' : 'opacity-85 hover:opacity-100'}`}
                      style={
                        isSelected
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFFFFF)',
                              ...(isNeumorphismActive ? {} : { borderColor: 'transparent' }),
                            }
                          : {
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              ...(isNeumorphismActive ? {} : { borderColor: 'var(--border-subcard)' }),
                            }
                      }
                    >
                      {presetRadius}px
                    </button>
                  );
                })}
              </div>
            </div>
          </section>


          {/* 1. Bảng điều khiển nhanh: Chọn tên giao diện (ẩn mặc định, fade-in mượt mà khi hiển thị lại) */}
          <AnimatePresence initial={false}>
            {isQuickThemeSectionOpen && (
              <motion.div
                key="el-p15-section-2-wrapper"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch w-full"
              >
                {/* Chọn nhanh theo Tên giao diện */}
                <section
                  id="el-p15-section-2"
                  className="animate-fadeIn lg:col-span-12 flex flex-col justify-between gap-[12px] p-0 border-0 bg-transparent shadow-none min-w-0"
                >
              <div className="flex items-center justify-between gap-2 pb-2 border-b min-w-0" style={{ borderColor: 'var(--border-subcard)' }}>
                <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--color-primary)' }}>
                  <WebIcon name="palette" className="w-4 h-4 shrink-0" />
                  <h2
                    className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                    data-card-title="true"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {isEn ? 'Theme Name' : 'Tên giao diện'}
                  </h2>
                </div>
                <span className="typo-badge font-semibold truncate max-w-[50%]" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                  {isEn
                    ? THEME_FOUR_WORD_NAMES[activePreset.id]?.en || t(activePreset.name)
                    : THEME_FOUR_WORD_NAMES[activePreset.id]?.vi || activePreset.name}
                </span>
              </div>

              <div
                role="group"
                aria-label={isEn ? 'Select individual interface theme' : 'Danh sách từng giao diện riêng biệt'}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-0"
              >
                {UNIFIED_INTERFACE_THEMES.map((preset) => {
                  const isActiveTheme = cardStyle === preset.id;
                  const presetName = isEn
                    ? THEME_FOUR_WORD_NAMES[preset.id]?.en || t(preset.name)
                    : THEME_FOUR_WORD_NAMES[preset.id]?.vi || preset.name;
                  const mode = preset.mechanism || (preset.isDark ? 'dark' : 'light');
                  const modeLabel =
                    mode === 'dark'
                      ? isEn
                        ? 'Dark'
                        : 'Tối'
                      : mode === 'color'
                        ? isEn
                          ? 'Color'
                          : 'Màu'
                        : isEn
                          ? 'Light'
                          : 'Sáng';
                  const modeIcon = mode === 'dark' ? 'moon' : mode === 'color' ? 'palette' : 'sun';

                  return (
                    <button
                      key={preset.id}
                      id={`btn-quick-theme-${preset.id}`}
                      type="button"
                      aria-pressed={isActiveTheme}
                      onClick={() => handleSelectTheme(preset.id, presetName)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-subcard,14px)] ${
                        isNeumorphismActive ? 'border-0' : 'border'
                      } transition-colors min-w-0 text-left cursor-pointer ${
                        isActiveTheme ? 'shadow-xs' : 'hover:opacity-95'
                      }`}
                      style={{
                        background: isActiveTheme ? 'var(--bg-button-primary)' : 'var(--bg-card)',
                        borderColor: isActiveTheme ? 'var(--color-primary)' : 'var(--border-subcard)',
                        color: isActiveTheme
                          ? 'var(--text-button-primary, #FFFFFF)'
                          : 'var(--text-primary)',
                      }}
                    >
                      <span className="flex items-center gap-2 min-w-0 flex-1">
                        <WebIcon name={preset.icon || 'palette'} className="w-3.5 h-3.5 shrink-0" />
                        <span className="typo-badge font-bold truncate">{presetName}</span>
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-semibold shrink-0 whitespace-nowrap"
                        style={
                          isActiveTheme
                            ? {
                                background: 'rgba(255, 255, 255, 0.18)',
                                color: 'var(--text-button-primary, #FFFFFF)',
                              }
                            : {
                                background: 'var(--bg-subcard)',
                                color: 'var(--text-secondary)',
                              }
                        }
                      >
                        <WebIcon name={modeIcon} className="w-3 h-3 shrink-0" />
                        <span>{modeLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Lưới thẻ Responsive Grid View Card cho toàn bộ giao diện */}
          <div className="flex flex-col gap-[12px] min-w-0">
            {visibleThemesCount === 0 ? (
              <div
                data-subcard="true"
                className={`sub-card p-[15px] ${
                  isNeumorphismActive ? 'border-0' : 'border'
                } flex flex-col sm:flex-row items-center justify-between gap-[15px]`}
                style={
                  isNeumorphismActive
                    ? { background: 'var(--bg-subcard)' }
                    : { background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }
                }
              >
                <p className="typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
                  {isEn
                    ? 'No themes match the current filter combination.'
                    : 'Không có giao diện nào khớp với bộ lọc hiện tại.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFamilyFilter('all');
                    setSelectedMechanismFilter('all');
                  }}
                  className="px-3.5 py-1.5 rounded-full typo-badge font-bold cursor-pointer whitespace-nowrap shrink-0 border-0"
                  style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                >
                  {isEn ? 'Show all themes' : 'Hiện tất cả giao diện'}
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 pb-2 ${
                    isNeumorphismActive ? 'border-0' : 'border-b'
                  } min-w-0`}
                  style={isNeumorphismActive ? undefined : { borderColor: 'var(--border-subcard)' }}
                >
                  <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                    <span
                      className="typo-caption font-semibold tabular-nums"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {isEn
                        ? `${visibleThemesCount} of ${displayedThemesCount} themes`
                        : `Hiển thị ${visibleThemesCount} / ${displayedThemesCount} giao diện`}
                    </span>

                    <div
                      role="group"
                      aria-label={
                        isEn ? 'Theme grid column view' : 'Số cột hiển thị lưới giao diện'
                      }
                      className={`hidden lg:inline-flex items-center gap-1 p-0.5 rounded-full ${
                        isNeumorphismActive ? 'border-0' : 'border'
                      }`}
                      style={{
                        background: 'var(--bg-subcard)',
                        ...(isNeumorphismActive ? {} : { borderColor: 'var(--border-subcard)' }),
                      }}
                    >
                      {(
                        [
                          { value: 'auto', labelVi: 'Tự động', labelEn: 'Auto' },
                          { value: 4, labelVi: '4 cột', labelEn: '4 cols' },
                          { value: 5, labelVi: '5 cột', labelEn: '5 cols' },
                        ] as const
                      ).map((opt) => {
                        const isSelectedCol = gridColumns === opt.value;
                        return (
                          <button
                            key={String(opt.value)}
                            type="button"
                            aria-pressed={isSelectedCol}
                            onClick={() => {
                              SoundEngine.playTap();
                              setGridColumns(opt.value);
                            }}
                            className="px-2.5 py-0.5 rounded-full typo-badge font-semibold transition-all cursor-pointer whitespace-nowrap border-0"
                            style={
                              isSelectedCol
                                ? {
                                    background: 'var(--bg-button-primary)',
                                    color: 'var(--text-button-primary, #FFFFFF)',
                                  }
                                : {
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                  }
                            }
                          >
                            {isEn ? opt.labelEn : opt.labelVi}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <span
                    className="typo-caption font-semibold truncate max-w-full"
                    style={{ color: 'var(--text-link, var(--color-primary))' }}
                  >
                    {isEn ? 'Active: ' : 'Đang bật: '}
                    {isEn
                      ? THEME_FOUR_WORD_NAMES[activePreset.id]?.en || t(activePreset.name)
                      : THEME_FOUR_WORD_NAMES[activePreset.id]?.vi || activePreset.name}
                  </span>
                </div>

                <div
                  id="interface-themes-grid"
                  data-cols={gridColumns}
                  data-element-name="Danh sách tất cả thẻ giao diện"
                  data-element-type="container"
                  data-element-page="interface"
                  className="interface-themes-grid card-grid w-full max-w-full min-w-0"
                >
                  {visibleThemeEntries.map(({ preset, group }) => {
                    const groupIcon = group.icon || 'palette';
                    const groupLabel = isEn ? group.labelEn : group.label;

                    return (
                      <ThemePresetCard
                        key={preset.id}
                        preset={preset}
                        groupIcon={groupIcon}
                        groupLabel={groupLabel}
                        meta={THEME_VISUAL_META[preset.id]}
                        bgSpec={THEME_BACKGROUNDS[preset.id]}
                        sampleProps={presetSampleStyles[preset.id]}
                        isActive={cardStyle === preset.id}
                        isEn={isEn}
                        isVideoVisible={
                          activeVideoPreviewId === preset.id && !failedVideoIds[preset.id]
                        }
                        hasVideoFailed={Boolean(failedVideoIds[preset.id])}
                        displayPresetName={
                          isEn
                            ? THEME_FOUR_WORD_NAMES[preset.id]?.en || t(preset.name)
                            : THEME_FOUR_WORD_NAMES[preset.id]?.vi || preset.name
                        }
                        displayEnglishName={THEME_FOUR_WORD_NAMES[preset.id]?.en || preset.name}
                        displayShortBadge={isEn ? t(preset.shortBadge) : preset.shortBadge}
                        displayDesc={isEn ? t(preset.desc) : preset.desc}
                        onSelectTheme={handleSelectTheme}
                        onToggleVideo={handleToggleVideoPreview}
                        onVideoError={handleVideoPreviewError}
                        onOpenStudio={
                          isIridescentTheme(preset.id) ? handleOpenIridescentStudio : undefined
                        }
                        isExpanded={expandedThemeId === preset.id}
                        onToggleExpand={(mode) => setExpandedThemeId((prev) => (prev === mode ? null : mode))}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* 3. Studio Tùy Chỉnh 9 Nhóm Iridescent Liquid Glass (Mở khi chọn giao diện hoặc bấm Tùy chỉnh) */}
          {isIridescentStudioOpen && (
            <IridescentStudioPanel
              activeCardStyle={cardStyle}
              targetMode={iridescentStudioMode}
              isEn={isEn}
              onApplyCardStyle={handleSelectTheme}
              onClose={() => setIsIridescentStudioOpen(false)}
              onShowNotification={onShowNotification}
            />
          )}

          {/* 4. Bộ thành phần Neumorphism Soft UI Kit (Thu gọn mặc định, tuân thủ 100% không viền + bóng nổi/lõm kép) */}
          {isSandboxOpen && (
            <div
              id="interface-soft-ui-reference-widget"
              data-subcard="true"
              className="sub-card neu-kit-surface flex flex-col gap-[15px] p-[18px] rounded-[var(--radius-subcard,14px)] border-0"
              style={{
                background: 'var(--bg-subcard)',
              }}
            >
              <div className="flex items-center justify-between gap-3 pb-1 border-0">
                <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--color-primary)' }}>
                  <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
                  <h4
                    className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                    data-card-title="true"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {isEn ? 'Neumorphism UI Kit (Borderless Soft UI)' : 'Bộ Mẫu Nổi Khối (Không Viền)'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setIsSandboxOpen(false);
                  }}
                  aria-label={isEn ? 'Close UI Kit' : 'Đóng bộ mẫu'}
                  className="neu-kit-btn w-8 h-8 rounded-full border-0 flex items-center justify-center cursor-pointer shrink-0"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <WebIcon name="x" className="w-4 h-4" />
                </button>
              </div>
              <p className="typo-caption" style={{ color: 'var(--text-muted)' }}>
                {isEn
                  ? 'Zero CSS borders across all interactive controls—depth is sculpted purely with dual outset and inset box-shadows.'
                  : 'Loại bỏ hoàn toàn viền ở mọi thành phần tương tác — độ nổi khối và nhấn lõm được tạo thuần bằng cặp bóng đổ kép.'}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-center pt-1">
                <div className="lg:col-span-5 flex flex-col gap-[15px]">
                  <div
                    className="neu-kit-well flex items-center gap-3 px-4 py-3 rounded-[999px] border-0 transition-all"
                    style={{
                      background: 'var(--bg-card)',
                    }}
                  >
                    <WebIcon name="search" className="w-4 h-4 shrink-0 opacity-70" />
                    <input
                      type="text"
                      value={sandboxQuery}
                      onChange={(e) => setSandboxQuery(e.target.value)}
                      placeholder={isEn ? 'Search for ...' : 'Nhập thử từ khóa...'}
                      className="w-full bg-transparent border-0 outline-none typo-body text-[var(--text-input)] placeholder-[var(--text-placeholder)]"
                      style={{ boxShadow: 'none' }}
                    />
                    {sandboxQuery && (
                      <button
                        type="button"
                        onClick={() => setSandboxQuery('')}
                        aria-label={isEn ? 'Clear text' : 'Xóa chữ'}
                        className="neu-kit-btn w-6 h-6 rounded-full border-0 flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer shrink-0"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <WebIcon name="x" className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-pressed={neuKitPressed.mainBtn}
                    onClick={() => {
                      SoundEngine.playGlassChime();
                      setNeuKitPressed((prev) => ({ ...prev, mainBtn: !prev.mainBtn }));
                      onShowNotification?.(isEn ? '✓ Soft UI button toggled!' : '✓ Đã chuyển trạng thái nút nổi khối!');
                    }}
                    className="neu-kit-btn w-full py-3 px-6 rounded-[999px] border-0 typo-button font-bold text-center cursor-pointer"
                    style={{
                      background: 'var(--bg-card)',
                      color: neuKitPressed.mainBtn ? 'var(--color-primary)' : 'var(--text-primary)',
                    }}
                  >
                    {neuKitPressed.mainBtn
                      ? isEn
                        ? 'Pressed (Inset)'
                        : 'Đang nhấn (Lõm)'
                      : isEn
                        ? 'Button'
                        : 'Nút bấm'}
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-pressed={neuKitPressed.heart}
                      aria-label={isEn ? 'Like toggle' : 'Thích'}
                      onClick={() => {
                        SoundEngine.playTap();
                        setNeuKitPressed((prev) => ({ ...prev, heart: !prev.heart }));
                        onShowNotification?.(isEn ? '♥ Liked' : '♥ Đã thích');
                      }}
                      className="neu-kit-btn w-12 h-12 rounded-[var(--radius-subcard,14px)] border-0 flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                      }}
                    >
                      <WebIcon name="heart" className="w-5 h-5" style={{ color: '#EE6AD2', fill: neuKitPressed.heart ? '#EE6AD2' : 'none' }} />
                    </button>
                    <button
                      type="button"
                      aria-pressed={neuKitPressed.comment}
                      aria-label={isEn ? 'Comment toggle' : 'Bình luận'}
                      onClick={() => {
                        SoundEngine.playTap();
                        setNeuKitPressed((prev) => ({ ...prev, comment: !prev.comment }));
                        onShowNotification?.(isEn ? '💬 Chat toggled' : '💬 Đã bật trò chuyện');
                      }}
                      className="neu-kit-btn w-12 h-12 rounded-[var(--radius-subcard,14px)] border-0 flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                      }}
                    >
                      <WebIcon name="message-square" className="w-5 h-5" style={{ color: '#64B6FF', fill: neuKitPressed.comment ? '#64B6FF' : 'none' }} />
                    </button>
                    <button
                      type="button"
                      aria-pressed={neuKitPressed.bookmark}
                      aria-label={isEn ? 'Bookmark toggle' : 'Lưu dấu'}
                      onClick={() => {
                        SoundEngine.playTap();
                        setNeuKitPressed((prev) => ({ ...prev, bookmark: !prev.bookmark }));
                        onShowNotification?.(isEn ? '📌 Saved' : '📌 Đã lưu');
                      }}
                      className="neu-kit-btn w-12 h-12 rounded-[var(--radius-subcard,14px)] border-0 flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                      }}
                    >
                      <WebIcon name="bookmark" className="w-5 h-5" style={{ color: '#4973FF', fill: neuKitPressed.bookmark ? '#4973FF' : 'none' }} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-pressed={neuKitPressed.share}
                      onClick={() => {
                        SoundEngine.playTap();
                        setNeuKitPressed((prev) => ({ ...prev, share: !prev.share }));
                        onShowNotification?.(isEn ? '🔗 Shared' : '🔗 Đã chia sẻ');
                      }}
                      className="neu-kit-btn flex-1 py-2.5 px-5 rounded-[999px] border-0 flex items-center justify-center gap-2 typo-label font-bold cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                        color: neuKitPressed.share ? 'var(--color-primary)' : 'var(--text-primary)',
                      }}
                    >
                      <WebIcon name="share-2" className="w-4 h-4" />
                      <span>{isEn ? 'Share' : 'Chia sẻ'}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={isEn ? 'Increment all sliders' : 'Tăng thanh trượt'}
                      onClick={() => {
                        SoundEngine.playTap();
                        setNeuSliders((prev) => prev.map((v) => (v >= 90 ? 30 : Math.min(95, v + 10))));
                        onShowNotification?.(isEn ? '➕ Action added' : '➕ Đã tăng thanh trượt');
                      }}
                      className="neu-kit-btn w-11 h-11 rounded-full border-0 flex items-center justify-center cursor-pointer shrink-0"
                      style={{
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <WebIcon name="plus" className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="neu-kit-well lg:col-span-7 flex items-end justify-around gap-3 p-[15px] rounded-[var(--radius-subcard,14px)] border-0"
                  style={{
                    background: 'var(--bg-card)',
                  }}
                >
                  {[
                    { label: isEn ? 'Sky' : 'Xanh trời', color: 'linear-gradient(180deg, #64B6FF 0%, #4FA4FA 100%)' },
                    { label: isEn ? 'Blue' : 'Xanh dương', color: 'linear-gradient(180deg, #4973FF 0%, #3760EE 100%)' },
                    { label: isEn ? 'Indigo' : 'Chàm', color: 'linear-gradient(180deg, #445CE6 0%, #344AD4 100%)' },
                    { label: isEn ? 'Pink' : 'Hồng', color: 'linear-gradient(180deg, #EE6AD2 0%, #DE54C2 100%)' },
                    { label: isEn ? 'Cyan' : 'Lục lam', color: 'linear-gradient(180deg, #2AD8E6 0%, #18C2D2 100%)' },
                    { label: isEn ? 'Mint' : 'Bạc hà', color: 'linear-gradient(180deg, #52E0A8 0%, #3ACF94 100%)' },
                  ].map((bar, idx) => {
                    const val = neuSliders[idx] || 60;
                    return (
                      <div key={bar.label} className="flex flex-col items-center gap-3">
                        <div
                          role="slider"
                          tabIndex={0}
                          aria-label={isEn ? `${bar.label} level` : `Mức ${bar.label}`}
                          aria-valuemin={10}
                          aria-valuemax={95}
                          aria-valuenow={val}
                          className="neu-kit-well relative w-3.5 h-[140px] rounded-[999px] border-0 cursor-pointer overflow-hidden"
                          style={{
                            background: 'var(--bg-card)',
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                              e.preventDefault();
                              setNeuSliders((prev) => prev.map((n, i) => (i === idx ? Math.min(95, n + 5) : n)));
                            } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                              e.preventDefault();
                              setNeuSliders((prev) => prev.map((n, i) => (i === idx ? Math.max(10, n - 5) : n)));
                            }
                          }}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickY = e.clientY - rect.top;
                            const newPct = Math.round(Math.max(10, Math.min(95, 100 - (clickY / rect.height) * 100)));
                            const updated = [...neuSliders];
                            updated[idx] = newPct;
                            setNeuSliders(updated);
                            SoundEngine.playTap();
                          }}
                        >
                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-[999px] transition-all duration-200"
                            style={{
                              height: `${val}%`,
                              background: bar.color,
                              boxShadow: 'none',
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            const updated = [...neuSliders];
                            updated[idx] = val >= 90 ? 30 : val + 15;
                            setNeuSliders(updated);
                          }}
                          className="neu-kit-btn w-9 h-9 rounded-full border-0 flex items-center justify-center cursor-pointer"
                          style={{
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                          }}
                          title={`${bar.label}: ${val}%`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full" style={{ background: bar.color }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterfaceView;
