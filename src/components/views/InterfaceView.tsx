import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { SpringDropdownMenu, SpringTick } from '@/components/ui/SpringDropdown';
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
import { CardStyleMode, ThemeFamilyId } from '@/config/ui/theme.types';
import {
  DEFAULT_CARD_STYLE,
  THEME_BACKGROUNDS,
  VISUAL_THEME_MODE_STORAGE_KEY,
  LAST_STANDARD_CARD_STYLE_STORAGE_KEY,
  VisualThemeMode,
  isNeumorphismCardStyle,
} from '@/config/ui/themeDefaults';
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
}

function readInterfaceUiPrefs(): InterfaceUiPrefs {
  const fallback: InterfaceUiPrefs = {
    selectedFamilyFilter: 'all',
    selectedMechanismFilter: 'all',
    isSandboxOpen: false,
    neuSliders: [68, 38, 92, 54, 82, 70],
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
      rawFamily === 'glassmorphism' ||
      rawFamily === 'cowhide-leather' ||
      rawFamily === 'walnut-wood' ||
      rawFamily === 'deep-ocean' ||
      rawFamily === 'frost-ice-neu' ||
      rawFamily === 'neumorphism-soft-ui' ||
      rawFamily === 'flat-soft-ui' ||
      rawFamily === 'flat-ui' ||
      rawFamily === 'nexus-bento' ||
      rawFamily === 'mica-fluent' ||
      rawFamily === 'iridescent-liquid-glass'
        ? rawFamily
        : fallback.selectedFamilyFilter;
    return {
      selectedFamilyFilter: migratedFamily,
      selectedMechanismFilter: parsed.selectedMechanismFilter ?? fallback.selectedMechanismFilter,
      isSandboxOpen: typeof parsed.isSandboxOpen === 'boolean' ? parsed.isSandboxOpen : fallback.isSandboxOpen,
      neuSliders:
        Array.isArray(parsed.neuSliders) && parsed.neuSliders.length === 6
          ? parsed.neuSliders.map((n) => (typeof n === 'number' && Number.isFinite(n) ? n : 50))
          : fallback.neuSliders,
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
  'glassmorphism': {
    radius: '18px',
    activeRingColor: '#38BDF8',
    activeBorderClass: 'border-white/45',
    idleBorderClass: 'border-white/25 hover:border-white/45',
    activeBadgeClass: 'bg-white/15 text-white border-white/30 shadow-xs backdrop-blur-[16px]',
    iconColor: '#38BDF8',
    titleTextClass: 'text-white',
    bodyTextClass: 'text-white/85',
    accentTextClass: 'text-[#7DD3FC]',
    previewBorderClass: 'border-white/25',
    dividerClass: 'border-white/20',
    ctaIdleClass: 'bg-white/12 text-white hover:bg-white/20 border border-white/25 shadow-xs backdrop-blur-[16px]',
    ctaActiveClass: 'bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] text-white font-bold shadow-xs border border-white/40',
    toggleTrackDarkClass: 'bg-white/12 border-white/25',
    toggleTrackLightClass: 'bg-white/20 border-white/35',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#38BDF8] to-[#EC4899] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    gradientBars: [
      { label: 'Frosted', width: '94%', gradient: 'linear-gradient(90deg, #38BDF8, #8B5CF6)', glow: '0 0 12px rgba(56, 189, 248, 0.40)' },
      { label: 'Aurora', width: '82%', gradient: 'linear-gradient(90deg, #8B5CF6, #EC4899)', glow: '0 0 12px rgba(236, 72, 153, 0.35)' },
      { label: 'Mint', width: '70%', gradient: 'linear-gradient(90deg, #2DD4BF, #38BDF8)', glow: '0 0 12px rgba(45, 212, 191, 0.32)' },
    ],
    primaryPalette: [
      { name: 'Glass Frost', hex: '#FFFFFF' },
      { name: 'Aurora Cyan', hex: '#38BDF8' },
      { name: 'Prism Violet', hex: '#8B5CF6' },
      { name: 'Magenta Bloom', hex: '#EC4899' },
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
  'neumorphism-soft-ui': {
    radius: '22px',
    activeRingColor: '#4F46E5',
    activeBorderClass: 'border-0',
    idleBorderClass: 'border-0',
    activeBadgeClass:
      'bg-[#E0E5EC] text-[#3730A3] border-0 shadow-[-4px_-4px_8px_rgba(255,255,255,0.85),4px_4px_8px_rgba(163,177,198,0.6)]',
    iconColor: '#4F46E5',
    titleTextClass: 'text-[#1E293B]',
    bodyTextClass: 'text-[#334155]',
    accentTextClass: 'text-[#3730A3]',
    previewBorderClass: 'border-0',
    dividerClass: 'border-0',
    ctaIdleClass:
      'bg-[#E0E5EC] text-[#1E293B] hover:text-[#3730A3] border-0 shadow-[-6px_-6px_12px_rgba(255,255,255,0.85),6px_6px_12px_rgba(163,177,198,0.6)] active:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.85),inset_6px_6px_12px_rgba(163,177,198,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]',
    ctaActiveClass:
      'bg-[#4F46E5] text-white border-0 shadow-[-4px_-4px_10px_rgba(255,255,255,0.82),5px_5px_12px_rgba(79,70,229,0.36)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3730A3]',
    toggleTrackDarkClass: 'bg-[#E0E5EC] border-0',
    toggleTrackLightClass: 'bg-[#4F46E5] border-0',
    toggleThumbDarkClass: 'bg-[#E0E5EC] text-[#334155]',
    toggleThumbLightClass: 'bg-[#FFFFFF] text-[#4F46E5]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Accent', width: '84%', gradient: '#4F46E5' },
      { label: 'Matte', width: '68%', gradient: '#6366F1' },
    ],
    primaryPalette: [
      { name: 'Matte Base', hex: '#E0E5EC' },
      { name: 'Primary Indigo', hex: '#4F46E5' },
      { name: 'Soft Shadow', hex: '#A3B1C6' },
      { name: 'Slate Ink', hex: '#1E293B' },
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
  'color-flat-soft-ui': {
    radius: '14px',
    activeRingColor: '#8B5CF6',
    activeBorderClass: 'border-[#8B5CF6]',
    idleBorderClass: 'border-white/15 hover:border-[#06B6D4]/70',
    activeBadgeClass: 'bg-[#111827] text-[#FFDF25] border-[#8B5CF6]/55 shadow-xs',
    iconColor: '#8B5CF6',
    titleTextClass: 'text-[#F4F7FB]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#06B6D4]',
    previewBorderClass: 'border-white/15',
    dividerClass: 'border-white/12',
    ctaIdleClass: 'bg-[#111827] text-[#F4F7FB] hover:bg-[#1E293B] border border-white/15',
    ctaActiveClass: 'bg-gradient-to-r from-[#8B5CF6] via-[#4F46E5] to-[#06B6D4] text-white font-bold border border-[#8B5CF6]/60',
    toggleTrackDarkClass: 'bg-[#090D16] border-white/15',
    toggleTrackLightClass: 'bg-[#F4F7FB] border-slate-300',
    toggleThumbDarkClass: 'bg-[#8B5CF6] text-white',
    toggleThumbLightClass: 'bg-[#4F46E5] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    gradientBars: [
      { label: 'Studio', width: '96%', gradient: 'linear-gradient(90deg, #8B5CF6, #4F46E5, #06B6D4, #10B981)' },
      { label: 'Modules 01–06', width: '88%', gradient: 'linear-gradient(90deg, #FFDF25, #5DC3C8, #E64C72, #1480C0, #F05A36, #A3D43A)' },
      { label: 'Modules 07–12', width: '80%', gradient: 'linear-gradient(90deg, #0D9488, #2563EB, #EC7D21, #A78BFA, #6353B5, #3BB8E6)' },
    ],
    primaryPalette: [
      { name: 'Dark Canvas Base', hex: '#090D16' },
      { name: 'Light Canvas Base', hex: '#F4F7FB' },
      { name: 'Card Glass Dark', hex: '#111827' },
      { name: 'Sub-Card Overlay', hex: '#0000004D' },
      { name: 'Studio Violet', hex: '#8B5CF6' },
      { name: 'Cyber Indigo', hex: '#4F46E5' },
      { name: 'Electric Cyan', hex: '#06B6D4' },
      { name: 'Emerald Success', hex: '#10B981' },
      { name: '01 · SDP Gold', hex: '#FFDF25' },
      { name: '02 · ERP Teal', hex: '#5DC3C8' },
      { name: '03 · CRM Rose', hex: '#E64C72' },
      { name: '04 · HRM Azure', hex: '#1480C0' },
      { name: '05 · BPM Coral', hex: '#F05A36' },
      { name: '06 · OKR Lime', hex: '#A3D43A' },
      { name: '07 · CLP Emerald', hex: '#0D9488' },
      { name: '08 · LMS Cobalt', hex: '#2563EB' },
      { name: '09 · CSC Amber', hex: '#EC7D21' },
      { name: '10 · BI Lavender', hex: '#A78BFA' },
      { name: '11 · AI Iris', hex: '#6353B5' },
      { name: '12 · POS Sky', hex: '#3BB8E6' },
    ],
  },
  'flat-ui': {
    radius: '8px',
    activeRingColor: '#3B82F6',
    activeBorderClass: 'border-2 border-[#3B82F6]',
    idleBorderClass: 'border-0',
    activeBadgeClass: 'bg-[#3B82F6] text-white border-0',
    iconColor: '#3B82F6',
    titleTextClass: 'text-[#111827]',
    bodyTextClass: 'text-[#374151]',
    accentTextClass: 'text-[#2563EB]',
    previewBorderClass: 'border-0',
    dividerClass: 'border-[#E5E7EB]',
    ctaIdleClass: 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB] hover:scale-105 border-0 rounded-md transition-all duration-200',
    ctaActiveClass: 'bg-[#3B82F6] text-white hover:bg-[#2563EB] hover:scale-105 border-0 rounded-md transition-all duration-200',
    toggleTrackDarkClass: 'bg-[#111827] border-0',
    toggleTrackLightClass: 'bg-[#F3F4F6] border-0',
    toggleThumbDarkClass: 'bg-[#3B82F6] text-white',
    toggleThumbLightClass: 'bg-[#3B82F6] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Primary', width: '92%', gradient: '#3B82F6' },
      { label: 'Secondary', width: '78%', gradient: '#10B981' },
      { label: 'Accent', width: '64%', gradient: '#F59E0B' },
    ],
    primaryPalette: [
      { name: 'Action Blue', hex: '#3B82F6' },
      { name: 'Emerald 500', hex: '#10B981' },
      { name: 'Amber 500', hex: '#F59E0B' },
      { name: 'Gray 100', hex: '#F3F4F6' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Gray 900', hex: '#111827' },
    ],
  },
  'nexus-bento': {
    radius: '12px',
    activeRingColor: '#8B5CF6',
    activeBorderClass: 'border border-[#8B5CF6]/70',
    idleBorderClass: 'border border-white/10 hover:border-[#8B5CF6]/50',
    activeBadgeClass: 'bg-[#111827] text-[#38BDF8] border border-white/15 shadow-xs backdrop-blur-xl',
    iconColor: '#8B5CF6',
    titleTextClass: 'text-[#F8FAFC]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#38BDF8]',
    previewBorderClass: 'border-white/10',
    dividerClass: 'border-white/10',
    ctaIdleClass: 'bg-[#111827]/85 text-[#F8FAFC] hover:bg-[#1E293B] border border-white/10 rounded-xl transition-all duration-200',
    ctaActiveClass: 'bg-gradient-to-r from-[#8B5CF6] via-[#38BDF8] to-[#EC4899] text-white border border-white/20 rounded-xl shadow-md transition-all duration-200',
    toggleTrackDarkClass: 'bg-[#111827] border border-white/15',
    toggleTrackLightClass: 'bg-[#F4F7FB] border border-slate-200',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Violet Halo', width: '94%', gradient: 'linear-gradient(90deg, #8B5CF6, #38BDF8)' },
      { label: 'Pink Halo', width: '82%', gradient: 'linear-gradient(90deg, #38BDF8, #EC4899)' },
    ],
    primaryPalette: [
      { name: 'Dark Canvas', hex: '#090D16' },
      { name: 'Frosted Nav', hex: '#111827' },
      { name: 'Violet Halo', hex: '#8B5CF6' },
      { name: 'Sky Halo', hex: '#38BDF8' },
      { name: 'Pink Halo', hex: '#EC4899' },
      { name: 'Light Canvas', hex: '#F4F7FB' },
    ],
  },
  'light-nexus-bento': {
    radius: '12px',
    activeRingColor: '#7C3AED',
    activeBorderClass: 'border border-[#7C3AED]/60',
    idleBorderClass: 'border border-slate-200 hover:border-[#7C3AED]/45',
    activeBadgeClass: 'bg-white text-[#7C3AED] border border-[#7C3AED]/30 shadow-xs backdrop-blur-xl',
    iconColor: '#7C3AED',
    titleTextClass: 'text-[#0F172A]',
    bodyTextClass: 'text-[#334155]',
    accentTextClass: 'text-[#7C3AED]',
    previewBorderClass: 'border-slate-200',
    dividerClass: 'border-slate-200',
    ctaIdleClass: 'bg-white/90 text-[#0F172A] hover:bg-[#F5F3FF] border border-slate-200 rounded-xl transition-all duration-200',
    ctaActiveClass: 'bg-gradient-to-r from-[#7C3AED] via-[#0284C7] to-[#EC4899] text-white border border-white/25 rounded-xl shadow-md transition-all duration-200',
    toggleTrackDarkClass: 'bg-[#111827] border border-white/15',
    toggleTrackLightClass: 'bg-[#F4F7FB] border border-slate-200',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#8B5CF6] to-[#38BDF8] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Violet Halo', width: '92%', gradient: 'linear-gradient(90deg, #7C3AED, #0284C7)' },
      { label: 'Pink Halo', width: '80%', gradient: 'linear-gradient(90deg, #0284C7, #EC4899)' },
    ],
    primaryPalette: [
      { name: 'Light Canvas', hex: '#F4F7FB' },
      { name: 'Pure Card', hex: '#FFFFFF' },
      { name: 'Violet Halo', hex: '#7C3AED' },
      { name: 'Sky Halo', hex: '#0284C7' },
      { name: 'Pink Halo', hex: '#EC4899' },
      { name: 'Dark Canvas', hex: '#090D16' },
    ],
  },
  'mica-fluent': {
    radius: '18px',
    activeRingColor: '#EA1A7F',
    activeBorderClass: 'border-[#EA1A7F]',
    idleBorderClass: 'border-white/25 hover:border-[#5274FF]/65',
    activeBadgeClass: 'bg-[#FFF0F7] text-[#EA1A7F] border-[#EA1A7F]/35 shadow-xs backdrop-blur-[20px]',
    iconColor: '#EA1A7F',
    titleTextClass: 'text-[#1C0708]',
    bodyTextClass: 'text-[#3F292B]',
    accentTextClass: 'text-[#EA1A7F]',
    previewBorderClass: 'border-white/35',
    dividerClass: 'border-[#1C0708]/12',
    ctaIdleClass: 'bg-[#FAFAFA]/85 text-[#1C0708] hover:bg-white border border-white/40 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#EA1A7F] via-[#AF64E8] to-[#5274FF] text-white shadow-xs border border-[#EA1A7F]',
    toggleTrackDarkClass: 'bg-[#5274FF] border-[#AF64E8]',
    toggleTrackLightClass: 'bg-[#FAFAFA] border-white/40',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#16D6FA] to-[#5274FF] text-white',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#EA1A7F] via-[#AF64E8] to-[#5274FF] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Warm', width: '94%', gradient: 'linear-gradient(90deg, #C65927, #FF7C17, #FEC603, #A8F387, #3ABA8F)' },
      { label: 'Vivid', width: '88%', gradient: 'linear-gradient(90deg, #16D6FA, #5274FF, #AF64E8, #EA1A7F, #D62424)' },
    ],
    primaryPalette: [
      { name: 'Terracotta Rust', hex: '#C65927' },
      { name: 'Tangerine Flame', hex: '#FF7C17' },
      { name: 'Solar Gold', hex: '#FEC603' },
      { name: 'Fresh Lime', hex: '#A8F387' },
      { name: 'Jade Mint', hex: '#3ABA8F' },
      { name: 'Electric Cyan', hex: '#16D6FA' },
      { name: 'Cobalt Blue', hex: '#5274FF' },
      { name: 'Orchid Purple', hex: '#AF64E8' },
      { name: 'Hot Magenta', hex: '#EA1A7F' },
      { name: 'Crimson Red', hex: '#D62424' },
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
    isDark,
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
      };
      localStorage.setItem(INTERFACE_UI_PREFS_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [selectedFamilyFilter, selectedMechanismFilter, isSandboxOpen, neuSliders]);

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
      const targetNeuStyle: CardStyleMode = 'neumorphism-soft-ui';
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
          data-floating-surface="main"
          data-element-name="Thẻ chính Trang Giao Diện"
          data-element-type="card"
          data-element-page="interface"
          data-element-parent="interface-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main flex flex-col justify-start p-[15px] gap-[15px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
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
                      <SpringDropdownMenu
                        id="interface-family-filter-listbox"
                        data-element-type="card"
                        placement="down"
                        origin="0% 0%"
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
                              <SpringTick active={selectedFamilyFilter === 'all'} />
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
                                  <SpringTick active={isSelectedTab} />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </SpringDropdownMenu>
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
              <div
                id="interface-themes-grid"
                data-cols="auto"
                data-card-layout="responsive-grid"
                data-card-shape="horizontal-rect"
                data-element-name="Danh sách tất cả thẻ giao diện"
                data-element-type="container"
                data-element-page="interface"
                className="interface-themes-grid unified-cards-grid card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch w-full max-w-full min-w-0"
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
