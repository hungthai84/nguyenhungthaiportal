import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  useTheme,
  getCardStyleProperties,
  getCardStyleConfig,
  UNIFIED_INTERFACE_THEMES,
  CARD_STYLE_GROUPS,
  ThemeMechanismMode,
} from '@/hooks/useTheme';
import { THEME_FOUR_WORD_NAMES } from '@/config/ui/cardStyles';
import { CardStyleMode, ThemeFamilyId } from '@/config/ui/theme.types';
import { DEFAULT_CARD_STYLE, THEME_BACKGROUNDS } from '@/config/ui/themeDefaults';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { ThemePresetCard, ThemeVisualMeta } from './interface/ThemePresetCard';

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
      rawFamily === 'dark-neon-glass'
        ? 'multicolor-glass'
        : rawFamily === 'all' ||
            rawFamily === 'liquid-glass' ||
            rawFamily === 'cowhide-leather' ||
            rawFamily === 'deep-ocean' ||
            rawFamily === 'neumorphism-beyond' ||
            rawFamily === 'frost-ice-neu' ||
            rawFamily === 'multicolor-glass'
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
    radius: '28px',
    activeRingColor: '#0284C7',
    activeBorderClass: 'border-[#0284C7]',
    idleBorderClass: 'border-white/80 hover:border-sky-400/60',
    activeBadgeClass: 'bg-sky-50/90 text-[#0284C7] border-sky-400/45 shadow-xs backdrop-blur-md',
    iconColor: '#0284C7',
    titleTextClass: 'text-[#0F172A]',
    bodyTextClass: 'text-[#475569]',
    accentTextClass: 'text-[#0284C7]',
    previewBorderClass: 'border-white/75',
    dividerClass: 'border-slate-300/60',
    ctaIdleClass: 'bg-white/75 text-[#0284C7] hover:bg-white border border-white/85 shadow-xs backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#4F46E5] text-white shadow-xs border border-white/80',
    toggleTrackDarkClass: 'bg-[#0F172A] border-sky-400/45',
    toggleTrackLightClass: 'bg-sky-50/95 border-white/90',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#38BDF8] to-[#818CF8] text-slate-950',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#0284C7] to-[#4F46E5] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Cyan', width: '92%', gradient: 'linear-gradient(90deg, #0284C7, #38BDF8)', glow: '0 0 10px rgba(14, 165, 233, 0.35)' },
      { label: 'Indigo', width: '78%', gradient: 'linear-gradient(90deg, #4F46E5, #818CF8)', glow: '0 0 10px rgba(79, 70, 229, 0.3)' },
      { label: 'Teal', width: '66%', gradient: 'linear-gradient(90deg, #0D9488, #2DD4BF)', glow: '0 0 10px rgba(20, 184, 166, 0.3)' },
    ],
  },
  'dark-liquid-glass': {
    radius: '14px',
    activeRingColor: '#38BDF8',
    activeBorderClass: 'border-[#38BDF8]',
    idleBorderClass: 'border-white/15 hover:border-sky-400/50',
    activeBadgeClass: 'bg-slate-900/90 text-[#38BDF8] border-sky-400/45 shadow-xs backdrop-blur-md',
    iconColor: '#38BDF8',
    titleTextClass: 'text-[#F8FAFC]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#38BDF8]',
    previewBorderClass: 'border-white/20',
    dividerClass: 'border-white/15',
    ctaIdleClass: 'bg-slate-900/75 text-[#F8FAFC] hover:bg-slate-800 border border-white/20 backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#818CF8] text-[#082F49] shadow-xs border border-sky-200/50',
    toggleTrackDarkClass: 'bg-[#091224] border-sky-400/35',
    toggleTrackLightClass: 'bg-sky-50 border-white/70',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#38BDF8] to-[#818CF8] text-slate-950',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#0284C7] to-[#4F46E5] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    gradientBars: [
      { label: 'Cyan', width: '94%', gradient: 'linear-gradient(90deg, #38BDF8, #0EA5E9)', glow: '0 0 12px rgba(56, 189, 248, 0.45)' },
      { label: 'Indigo', width: '82%', gradient: 'linear-gradient(90deg, #818CF8, #6366F1)', glow: '0 0 12px rgba(129, 140, 248, 0.4)' },
      { label: 'Mint', width: '70%', gradient: 'linear-gradient(90deg, #2DD4BF, #14B8A6)', glow: '0 0 12px rgba(45, 212, 191, 0.4)' },
    ],
  },
  'dark-neon-glass': {
    radius: '24px',
    activeRingColor: '#22D3EE',
    activeBorderClass: 'border-[#22D3EE]',
    idleBorderClass: 'border-cyan-400/25 hover:border-fuchsia-400/60',
    activeBadgeClass: 'bg-[#0B1026]/90 text-[#22D3EE] border-cyan-400/50 shadow-xs backdrop-blur-md',
    iconColor: '#22D3EE',
    titleTextClass: 'text-[#F8FAFC]',
    bodyTextClass: 'text-[#CBD5E1]',
    accentTextClass: 'text-[#22D3EE]',
    previewBorderClass: 'border-cyan-400/30',
    dividerClass: 'border-cyan-400/20',
    ctaIdleClass: 'bg-[#0D1430]/80 text-[#F8FAFC] hover:bg-[#141D42] border border-cyan-400/30 backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#22D3EE] via-[#A855F7] to-[#EC4899] text-[#050816] font-bold shadow-xs border border-cyan-200/60',
    toggleTrackDarkClass: 'bg-[#060918] border-cyan-400/45',
    toggleTrackLightClass: 'bg-indigo-50 border-white/80',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#22D3EE] via-[#A855F7] to-[#EC4899] text-[#050816]',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#4F46E5] via-[#0EA5E9] to-[#EC4899] text-white',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4',
    gradientBars: [
      { label: 'Neon Cyan', width: '96%', gradient: 'linear-gradient(90deg, #22D3EE, #06B6D4)', glow: '0 0 14px rgba(34, 211, 238, 0.55)' },
      { label: 'Neon Violet', width: '86%', gradient: 'linear-gradient(90deg, #A855F7, #EC4899)', glow: '0 0 14px rgba(168, 85, 247, 0.5)' },
      { label: 'Neon Mint', width: '74%', gradient: 'linear-gradient(90deg, #34D399, #22D3EE)', glow: '0 0 14px rgba(52, 211, 153, 0.45)' },
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
  },
  'black-cowhide-leather': {
    radius: '14px',
    activeRingColor: '#FFFFFF',
    activeBorderClass: 'border-white',
    idleBorderClass: 'border-[#08090C] hover:border-white/75',
    activeBadgeClass: 'bg-gradient-to-r from-[#2D313D] to-[#14171F] text-white border-white/85',
    iconColor: '#FFFFFF',
    titleTextClass: 'text-white',
    bodyTextClass: 'text-zinc-200',
    accentTextClass: 'text-white',
    previewBorderClass: 'border-white/75 border-dashed',
    dividerClass: 'border-white/40 border-dashed',
    ctaIdleClass: 'bg-[#14171D]/92 text-white hover:bg-[#232731] border border-white/55',
    ctaActiveClass: 'bg-gradient-to-r from-[#FFFFFF] to-[#E4E4E7] text-[#0B0C10] font-bold shadow-xs border border-white',
    toggleTrackDarkClass: 'bg-[#0D0F14] border-white/65',
    toggleTrackLightClass: 'bg-[#522E10] border-[#F5DEB3]/60',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#FFFFFF] to-[#D4D4D8] text-[#0B0C10]',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#FDE68A] to-[#D97706] text-[#3D210B]',
    outlineStyle: (isActive) => ({
      outline: isActive ? '2px dashed #FFFFFF' : '1.5px dashed rgba(255, 255, 255, 0.76)',
      outlineOffset: '-6px',
    }),
    demoVideoUrl:
      'https://cdn.scena.ai/project/10223/50b7b30031d4b9124af4948a069cdf530ca8f0942767f6e6b713c350cb8bd6b2.mp4',
    gradientBars: [
      { label: 'Stitch', width: '92%', gradient: 'linear-gradient(90deg, #FFFFFF, #E4E4E7)' },
      { label: 'Grain', width: '76%', gradient: 'linear-gradient(90deg, #A1A1AA, #F4F4F5)' },
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
  },
  'light-deep-ocean': {
    radius: '18px',
    activeRingColor: '#1951FC',
    activeBorderClass: 'border-[#1951FC]',
    idleBorderClass: 'border-white/65 hover:border-[#73BFFF]',
    activeBadgeClass: 'bg-gradient-to-r from-[#1951FC] to-[#3781FC] text-white border-white/75',
    iconColor: '#1951FC',
    titleTextClass: 'text-[#03195B]',
    bodyTextClass: 'text-[#082B70]',
    accentTextClass: 'text-[#1951FC]',
    previewBorderClass: 'border-white/70 border-solid',
    dividerClass: 'border-[#73BFFF]/55 border-solid',
    ctaIdleClass: 'bg-[#CBE9FD]/85 text-[#03195B] hover:bg-white border border-white/75',
    ctaActiveClass: 'bg-gradient-to-r from-[#1951FC] via-[#3781FC] to-[#73BFFF] text-white shadow-xs border border-white/75',
    toggleTrackDarkClass: 'bg-[#03195B] border-[#3781FC]/55',
    toggleTrackLightClass: 'bg-[#CBE9FD] border-[#73BFFF]',
    toggleThumbDarkClass: 'bg-[#73BFFF] text-[#03195B]',
    toggleThumbLightClass: 'bg-[#1951FC] text-white',
    outlineStyle: (isActive) => ({
      outline: isActive ? '2px solid rgba(255, 255, 255, 0.90)' : '1px solid rgba(255, 255, 255, 0.55)',
      outlineOffset: '-6px',
    }),
    demoVideoUrl: 'https://cdn.scena.ai/project/10223/cc5a8e558d2380dc8bfb96fd26cd877e444d63b6a7036a8530abd823d6d6da63.mp4',
    gradientBars: [
      { label: 'Primary', width: '94%', gradient: 'linear-gradient(90deg, #1951FC, #3781FC)', glow: '0 0 10px rgba(25, 81, 252, 0.35)' },
      { label: 'Sky Cyan', width: '80%', gradient: 'linear-gradient(90deg, #3781FC, #73BFFF)', glow: '0 0 10px rgba(115, 191, 255, 0.38)' },
    ],
  },
  'multicolor-glass': {
    radius: '24px',
    activeRingColor: '#4F46E5',
    activeBorderClass: 'border-[#4F46E5]',
    idleBorderClass: 'border-white/80 hover:border-indigo-400/70',
    activeBadgeClass: 'bg-indigo-50/90 text-[#4F46E5] border-indigo-400/45 shadow-xs backdrop-blur-md',
    iconColor: '#4F46E5',
    titleTextClass: 'text-[#0F172A]',
    bodyTextClass: 'text-[#334155]',
    accentTextClass: 'text-[#4F46E5]',
    previewBorderClass: 'border-white/80',
    dividerClass: 'border-indigo-200/60',
    ctaIdleClass: 'bg-white/75 text-[#4F46E5] hover:bg-white border border-white/85 shadow-xs backdrop-blur-md',
    ctaActiveClass: 'bg-gradient-to-r from-[#4F46E5] via-[#0EA5E9] to-[#EC4899] text-white shadow-xs border border-white/80',
    toggleTrackDarkClass: 'bg-[#0F172A] border-indigo-400/45',
    toggleTrackLightClass: 'bg-indigo-50/95 border-white/90',
    toggleThumbDarkClass: 'bg-gradient-to-br from-[#818CF8] to-[#F472B6] text-slate-950',
    toggleThumbLightClass: 'bg-gradient-to-br from-[#4F46E5] via-[#0EA5E9] to-[#EC4899] text-white',
    demoVideoUrl: 'https://cdn.scena.ai/project/10223/13eee325b1e14c3b5496ca67e6bf5a3558a5ff156c17f40045f15f82d9e29391.mp4',
    gradientBars: [
      { label: 'Indigo', width: '94%', gradient: 'linear-gradient(90deg, #4F46E5, #818CF8)', glow: '0 0 10px rgba(79, 70, 229, 0.35)' },
      { label: 'Cyan', width: '82%', gradient: 'linear-gradient(90deg, #0284C7, #38BDF8)', glow: '0 0 10px rgba(14, 165, 233, 0.35)' },
      { label: 'Rose', width: '74%', gradient: 'linear-gradient(90deg, #DB2777, #F472B6)', glow: '0 0 10px rgba(236, 72, 153, 0.3)' },
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
  },
  'frost-ice-neu': {
    radius: '20px',
    activeRingColor: '#6E6AF6',
    activeBorderClass: 'border-[#6E6AF6]',
    idleBorderClass: 'border-white/90 hover:border-[#4AB8F9]',
    activeBadgeClass: 'bg-[#EEF6FD] text-[#6E6AF6] border-white shadow-xs',
    iconColor: '#6E6AF6',
    titleTextClass: 'text-[#25384B]',
    bodyTextClass: 'text-[#546B82]',
    accentTextClass: 'text-[#6E6AF6]',
    previewBorderClass: 'border-white/90 border-solid',
    dividerClass: 'border-[#CFE0F0]/75 border-solid',
    ctaIdleClass: 'bg-[#EDF6FD] text-[#546B82] hover:text-[#25384B] border border-white/90 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#6E6AF6] via-[#965CE8] to-[#4AB8F9] text-white shadow-xs border border-[#6E6AF6]/40',
    toggleTrackDarkClass: 'bg-[#DFECF8] border-white/80',
    toggleTrackLightClass: 'bg-[#6E6AF6] border-[#6E6AF6]',
    toggleThumbDarkClass: 'bg-[#F5FAFF] text-[#546B82]',
    toggleThumbLightClass: 'bg-[#F5FAFF] text-[#6E6AF6]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Violet', width: '73%', gradient: 'linear-gradient(90deg, #6E6AF6, #965CE8)' },
      { label: 'Aqua', width: '82%', gradient: 'linear-gradient(90deg, #4AB8F9, #3CD9D8)' },
      { label: 'Apricot', width: '54%', gradient: 'linear-gradient(90deg, #FDCB63, #FA8F60)' },
      { label: 'Rose', width: '91%', gradient: 'linear-gradient(90deg, #FF70A1, #F84D9C)' },
    ],
  },
  'dark-frost-ice-neu': {
    radius: '20px',
    activeRingColor: '#8E8BFF',
    activeBorderClass: 'border-[#8E8BFF]',
    idleBorderClass: 'border-sky-300/20 hover:border-[#4AB8F9]/60',
    activeBadgeClass: 'bg-[#1D2B40] text-[#A4A1FF] border-sky-300/25 shadow-xs',
    iconColor: '#8E8BFF',
    titleTextClass: 'text-[#F1F8FF]',
    bodyTextClass: 'text-[#B5CAE0]',
    accentTextClass: 'text-[#8E8BFF]',
    previewBorderClass: 'border-sky-300/20 border-solid',
    dividerClass: 'border-sky-300/18 border-solid',
    ctaIdleClass: 'bg-[#1A263A] text-[#B5CAE0] hover:text-white border border-sky-300/20 shadow-xs',
    ctaActiveClass: 'bg-gradient-to-r from-[#6E6AF6] via-[#965CE8] to-[#4AB8F9] text-white shadow-xs border border-[#8E8BFF]/45',
    toggleTrackDarkClass: 'bg-[#101927] border-sky-300/20',
    toggleTrackLightClass: 'bg-[#6E6AF6] border-[#8E8BFF]',
    toggleThumbDarkClass: 'bg-[#23344F] text-[#8E8BFF]',
    toggleThumbLightClass: 'bg-[#F1F8FF] text-[#141F31]',
    demoVideoUrl: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    gradientBars: [
      { label: 'Violet', width: '73%', gradient: 'linear-gradient(90deg, #6E6AF6, #965CE8)' },
      { label: 'Aqua', width: '82%', gradient: 'linear-gradient(90deg, #4AB8F9, #3CD9D8)' },
      { label: 'Apricot', width: '54%', gradient: 'linear-gradient(90deg, #FDCB63, #FA8F60)' },
      { label: 'Rose', width: '91%', gradient: 'linear-gradient(90deg, #FF70A1, #F84D9C)' },
    ],
  },
  'flat-soft-ui': {
    radius: '16px',
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
  },
  'dark-flat-soft-ui': {
    radius: '16px',
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
  const [activeVideoPreviewId, setActiveVideoPreviewId] = useState<CardStyleMode | null>(null);
  const [failedVideoIds, setFailedVideoIds] = useState<Record<string, boolean>>({});
  const interfaceBannerVideo = getDefaultBannerVideoConfig('interface');
  const [neuSliders, setNeuSliders] = useState<number[]>(initialPrefs.neuSliders);

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

  const handleSelectTheme = useCallback(
    (mode: CardStyleMode, label: string) => {
      SoundEngine.playGlassChime();
      setCardStyle(mode);
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
    setCardStyle(DEFAULT_CARD_STYLE);
    setSelectedFamilyFilter('all');
    setSelectedMechanismFilter('all');
    setIsFamilyFilterOpen(false);
    if (onShowNotification) {
      onShowNotification(
        isEn
          ? `✓ Restored & saved default interface: ${t(defaultCfg.name)}`
          : `✓ Đã khôi phục & lưu mặc định: ${defaultCfg.name}`
      );
    }
  };

  const visibleGroups = useMemo(() => {
    const familyScoped =
      selectedFamilyFilter === 'all'
        ? CARD_STYLE_GROUPS
        : CARD_STYLE_GROUPS.filter((g) => g.id === selectedFamilyFilter);

    if (selectedMechanismFilter === 'all') return familyScoped;

    return familyScoped
      .map((g) => ({
        ...g,
        presets: g.presets.filter((p) => {
          if (selectedMechanismFilter === 'light') {
            return p.id === g.lightMode || p.mechanism === 'light';
          }
          if (selectedMechanismFilter === 'dark') {
            return p.id === g.darkMode || p.mechanism === 'dark';
          }
          return (p.mechanism || (p.isDark ? 'dark' : 'light')) === selectedMechanismFilter;
        }),
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

  const isDefaultConfig = cardStyle === DEFAULT_CARD_STYLE;

  return (
    <div
      id="interface-page-container"
      data-element-name="Trang Cấu Hình Giao Diện & Kiểu Thẻ"
      data-element-type="container"
      data-element-page="interface"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none box-border"
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
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,24px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
          >
            <div className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none">
              <VideoBanner
                videoId={interfaceBannerVideo.videoId}
                title={interfaceBannerVideo.title}
                className="rounded-[inherit]"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
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
            </div>

            <div
              id="interface-hero-banner-controls"
              className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full"
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
                  className="banner-control-pill h-9 inline-flex items-center gap-1 px-1.5 py-1 rounded-full border"
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
                        className={`px-2.5 py-0.5 rounded-full typo-badge font-bold cursor-pointer transition-all whitespace-nowrap ${
                          active ? 'text-white shadow-xs' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={
                          active
                            ? { background: 'var(--bg-button-primary)' }
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
                    className="banner-control-pill h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full border typo-badge font-bold cursor-pointer transition-all hover:opacity-90"
                    title={isEn ? 'Clear filters' : 'Xóa bộ lọc'}
                  >
                    <WebIcon name="x" className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Clear' : 'Xóa lọc'}</span>
                  </button>
                )}
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
                aria-label={isEn ? 'Select interface theme by name' : 'Danh sách giao diện Sáng và Tối'}
                className="flex flex-col gap-1.5 w-full min-w-0"
              >
                {CARD_STYLE_GROUPS.map((group) => {
                  const lightMode = group.lightMode || group.defaultMode || group.presets[0]?.id;
                  const darkMode = group.darkMode || group.presets[group.presets.length - 1]?.id || lightMode;
                  const isLightActive = Boolean(lightMode && cardStyle === lightMode);
                  const isDarkActive = Boolean(darkMode && cardStyle === darkMode);
                  const isGroupActive = isLightActive || isDarkActive;
                  const groupTitle = isEn ? group.labelEn : group.label;

                  return (
                    <div
                      key={group.id}
                      id={`quick-theme-group-${group.id}`}
                      className={`w-full flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-[12px] border transition-colors min-w-0 ${
                        isGroupActive ? 'shadow-xs' : 'hover:opacity-95'
                      }`}
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: isGroupActive ? 'var(--color-primary)' : 'var(--border-subcard)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const targetMode = isDark ? darkMode : lightMode;
                          if (!targetMode) return;
                          const modeName = isEn
                            ? THEME_FOUR_WORD_NAMES[targetMode]?.en || groupTitle
                            : THEME_FOUR_WORD_NAMES[targetMode]?.vi || groupTitle;
                          handleSelectTheme(targetMode, modeName);
                        }}
                        className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer py-0.5"
                        style={{
                          color: isGroupActive
                            ? 'var(--text-link, var(--color-primary))'
                            : 'var(--text-primary)',
                        }}
                      >
                        <WebIcon name={group.icon} className="w-3.5 h-3.5 shrink-0" />
                        <span className="typo-badge font-bold truncate">{groupTitle}</span>
                      </button>

                      <div
                        role="group"
                        aria-label={`${groupTitle} ${isEn ? 'Light or Dark' : 'Sáng hoặc Tối'}`}
                        className="inline-flex items-center gap-0.5 p-0.5 rounded-full border shrink-0"
                        style={{
                          background: 'var(--bg-subcard)',
                          borderColor: 'var(--border-subcard)',
                        }}
                      >
                        {lightMode && (
                          <button
                            id={`btn-quick-theme-${lightMode}`}
                            type="button"
                            aria-pressed={isLightActive}
                            onClick={() => {
                              const modeName = isEn
                                ? THEME_FOUR_WORD_NAMES[lightMode]?.en || groupTitle
                                : THEME_FOUR_WORD_NAMES[lightMode]?.vi || groupTitle;
                              handleSelectTheme(lightMode, modeName);
                            }}
                            title={
                              isEn
                                ? THEME_FOUR_WORD_NAMES[lightMode]?.en
                                : THEME_FOUR_WORD_NAMES[lightMode]?.vi
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap ${
                              isLightActive ? 'shadow-xs' : 'opacity-75 hover:opacity-100'
                            }`}
                            style={
                              isLightActive
                                ? {
                                    background: 'var(--bg-button-primary)',
                                    color: 'var(--text-button-primary, #FFFFFF)',
                                  }
                                : { color: 'var(--text-secondary)' }
                            }
                          >
                            <WebIcon name="sun" className="w-3 h-3 shrink-0" />
                            <span>{isEn ? 'Light' : 'Sáng'}</span>
                          </button>
                        )}
                        {darkMode && (
                          <button
                            id={`btn-quick-theme-${darkMode}`}
                            type="button"
                            aria-pressed={isDarkActive}
                            onClick={() => {
                              const modeName = isEn
                                ? THEME_FOUR_WORD_NAMES[darkMode]?.en || groupTitle
                                : THEME_FOUR_WORD_NAMES[darkMode]?.vi || groupTitle;
                              handleSelectTheme(darkMode, modeName);
                            }}
                            title={
                              isEn
                                ? THEME_FOUR_WORD_NAMES[darkMode]?.en
                                : THEME_FOUR_WORD_NAMES[darkMode]?.vi
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap ${
                              isDarkActive ? 'shadow-xs' : 'opacity-75 hover:opacity-100'
                            }`}
                            style={
                              isDarkActive
                                ? {
                                    background: 'var(--bg-button-primary)',
                                    color: 'var(--text-button-primary, #FFFFFF)',
                                  }
                                : { color: 'var(--text-secondary)' }
                            }
                          >
                            <WebIcon name="moon" className="w-3 h-3 shrink-0" />
                            <span>{isEn ? 'Dark' : 'Tối'}</span>
                          </button>
                        )}
                      </div>
                    </div>
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
                className="sub-card p-[15px] border flex flex-col sm:flex-row items-center justify-between gap-[15px]"
                style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
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
                  className="px-3.5 py-1.5 rounded-full typo-badge font-bold text-white cursor-pointer whitespace-nowrap shrink-0"
                  style={{ background: 'var(--bg-button-primary)' }}
                >
                  {isEn ? 'Show all themes' : 'Hiện tất cả giao diện'}
                </button>
              </div>
            ) : (
              <>
                <div
                  className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b min-w-0"
                  style={{ borderColor: 'var(--border-subcard)' }}
                >
                  <span
                    className="typo-caption font-semibold tabular-nums"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {isEn
                      ? `${visibleThemesCount} of ${displayedThemesCount} themes`
                      : `Hiển thị ${visibleThemesCount} / ${displayedThemesCount} giao diện`}
                  </span>
                  <span
                    className="typo-caption font-semibold truncate max-w-full"
                    style={{ color: 'var(--text-link, var(--color-primary))' }}
                  >
                    {isEn ? 'Active: ' : 'Đang bật: '}
                    {t(activePreset.name)}
                  </span>
                </div>

                <div
                  id="interface-themes-groups"
                  data-element-name="Danh sách nhóm thẻ giao diện"
                  data-element-type="container"
                  data-element-page="interface"
                  className="interface-themes-groups grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch w-full max-w-full min-w-0"
                >
                  {visibleGroups.map((group) => {
                    const isGroupActive = group.presets.some((p) => p.id === cardStyle);
                    return (
                      <section
                        key={group.id}
                        id={`interface-group-${group.id}`}
                        data-element-name={`Nhóm giao diện ${group.label}`}
                        data-element-type="card"
                        data-subcard="true"
                        className="interface-group-card sub-card rounded-[14px] border p-[14px] flex flex-col gap-[12px] w-full h-full min-w-0"
                        style={{
                          background: 'var(--bg-subcard)',
                          borderColor: isGroupActive
                            ? 'var(--color-primary)'
                            : 'var(--border-subcard)',
                        }}
                      >
                        <div
                          className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b min-w-0"
                          style={{ borderColor: 'var(--border-subcard)' }}
                        >
                          <div
                            className="card-header-sync flex items-center gap-2 min-w-0"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            <WebIcon name={group.icon} className="w-4 h-4 shrink-0" />
                            <h2
                              className="typo-h5 font-bold tracking-tight truncate card-title-synced m-0"
                              data-card-title="true"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {isEn ? group.labelEn : group.label}
                            </h2>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isGroupActive && (
                              <span
                                className="typo-badge font-semibold"
                                style={{ color: 'var(--text-link, var(--color-primary))' }}
                              >
                                {isEn ? 'Active group' : 'Đang sử dụng'}
                              </span>
                            )}
                            <span
                              className="typo-caption font-semibold tabular-nums"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {group.presets.length} {isEn ? 'themes' : 'giao diện'}
                            </span>
                          </div>
                        </div>

                        <div
                          id={`interface-group-grid-${group.id}`}
                          className="interface-group-grid flex-1 grid grid-cols-1 sm:grid-cols-2 gap-[15px] items-stretch w-full max-w-full min-w-0"
                        >
                          {group.presets.map((preset) => (
                            <ThemePresetCard
                              key={preset.id}
                              preset={preset}
                              groupIcon={group.icon}
                              groupLabel={isEn ? group.labelEn : group.label}
                              meta={THEME_VISUAL_META[preset.id]}
                              bgSpec={THEME_BACKGROUNDS[preset.id]}
                              sampleProps={presetSampleStyles[preset.id]}
                              isActive={cardStyle === preset.id}
                              isEn={isEn}
                              isVideoVisible={
                                activeVideoPreviewId === preset.id && !failedVideoIds[preset.id]
                              }
                              hasVideoFailed={Boolean(failedVideoIds[preset.id])}
                              displayPresetName={t(preset.name)}
                              displayShortBadge={t(preset.shortBadge)}
                              displayDesc={t(preset.desc)}
                              onSelectTheme={handleSelectTheme}
                              onToggleVideo={handleToggleVideoPreview}
                              onVideoError={handleVideoPreviewError}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* 4. Phòng thử nghiệm thành phần Soft UI (Thu gọn mặc định để ưu tiên kho giao diện) */}
          {isSandboxOpen && (
            <div
              id="interface-soft-ui-reference-widget"
              data-subcard="true"
              className="sub-card flex flex-col gap-[15px] p-[15px] border"
              style={{
                background: 'var(--bg-subcard)',
                borderColor: 'var(--border-subcard)',
              }}
            >
              <div
                className="flex items-center justify-between gap-3 pb-2.5 border-b"
                style={{ borderColor: 'var(--border-subcard)' }}
              >
                <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--color-primary)' }}>
                  <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
                  <h4
                    className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                    data-card-title="true"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {isEn ? 'Liquid Glass Soft UI Component Suite (Reference Match)' : 'Bộ thành phần Liquid Glass Soft UI (Khớp mẫu tham khảo)'}
                  </h4>
                </div>
              </div>
              <p className="typo-caption" style={{ color: 'var(--text-muted)' }}>
                {isEn
                  ? 'Interactive replica of search bar, pill buttons, soft icon cards, and crisp multi-color vertical slider tracks.'
                  : 'Mô phỏng tương tác thanh tìm kiếm, nút bấm, thẻ icon và các thanh trượt dọc đa sắc từ mẫu thiết kế.'}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-center pt-1">
                <div className="lg:col-span-5 flex flex-col gap-[15px]">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-[999px] border transition-all"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-subcard)',
                      boxShadow: 'var(--neu-inset-shadow)',
                    }}
                  >
                    <WebIcon name="search" className="w-4 h-4 shrink-0 opacity-70" />
                    <input
                      type="text"
                      value={sandboxQuery}
                      onChange={(e) => setSandboxQuery(e.target.value)}
                      placeholder={isEn ? 'Search for ...' : 'Nhập thử từ khóa...'}
                      className="w-full bg-transparent border-none outline-none typo-body text-[var(--text-input)] placeholder-[var(--text-placeholder)]"
                    />
                    {sandboxQuery && (
                      <button
                        type="button"
                        onClick={() => setSandboxQuery('')}
                        aria-label={isEn ? 'Clear text' : 'Xóa chữ'}
                        className="w-5 h-5 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                      >
                        <WebIcon name="x" className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playGlassChime();
                      if (onShowNotification) onShowNotification(isEn ? '✓ Soft button clicked!' : '✓ Đã bấm nút Soft UI!');
                    }}
                    className="w-full py-3 px-6 rounded-[999px] border typo-button font-bold text-center cursor-pointer transition-all"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-subcard)',
                      boxShadow: 'var(--neu-raised-shadow)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Button
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onShowNotification) onShowNotification('♥ Liked');
                      }}
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center border transition-all cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-subcard)',
                        boxShadow: 'var(--neu-raised-shadow)',
                      }}
                    >
                      <WebIcon name="heart" className="w-5 h-5" style={{ color: '#EE6AD2', fill: '#EE6AD2' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onShowNotification) onShowNotification('💬 Chat opened');
                      }}
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center border transition-all cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-subcard)',
                        boxShadow: 'var(--neu-raised-shadow)',
                      }}
                    >
                      <WebIcon name="message-square" className="w-5 h-5" style={{ color: '#64B6FF', fill: '#64B6FF' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onShowNotification) onShowNotification('📌 Saved');
                      }}
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center border transition-all cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-subcard)',
                        boxShadow: 'var(--neu-raised-shadow)',
                      }}
                    >
                      <WebIcon name="bookmark" className="w-5 h-5" style={{ color: '#4973FF', fill: '#4973FF' }} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onShowNotification) onShowNotification('🔗 Shared');
                      }}
                      className="flex-1 py-2.5 px-5 rounded-[999px] border flex items-center justify-center gap-2 typo-label font-bold cursor-pointer transition-all"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-subcard)',
                        boxShadow: 'var(--neu-raised-shadow)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <WebIcon name="share-2" className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onShowNotification) onShowNotification('➕ Action added');
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-subcard)',
                        boxShadow: 'var(--neu-raised-shadow)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <WebIcon name="plus" className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="lg:col-span-7 flex items-end justify-around gap-3 p-[15px] rounded-[var(--radius-subcard,14px)] border"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subcard)',
                    boxShadow: 'var(--neu-inset-shadow)',
                  }}
                >
                  {[
                    { label: 'Sky', color: 'linear-gradient(180deg, #64B6FF 0%, #4FA4FA 100%)' },
                    { label: 'Blue', color: 'linear-gradient(180deg, #4973FF 0%, #3760EE 100%)' },
                    { label: 'Indigo', color: 'linear-gradient(180deg, #445CE6 0%, #344AD4 100%)' },
                    { label: 'Pink', color: 'linear-gradient(180deg, #EE6AD2 0%, #DE54C2 100%)' },
                    { label: 'Cyan', color: 'linear-gradient(180deg, #2AD8E6 0%, #18C2D2 100%)' },
                    { label: 'Mint', color: 'linear-gradient(180deg, #52E0A8 0%, #3ACF94 100%)' },
                  ].map((bar, idx) => {
                    const val = neuSliders[idx] || 60;
                    return (
                      <div key={bar.label} className="flex flex-col items-center gap-3">
                        <div
                          className="relative w-3.5 h-[140px] rounded-[999px] cursor-pointer overflow-hidden"
                          style={{
                            background: 'var(--bg-subcard)',
                            boxShadow: 'inset 2px 2px 5px rgba(163, 177, 198, 0.48), inset -2px -2px 4px rgba(255, 255, 255, 0.42)',
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
                          className="w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm"
                          style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border-subcard)',
                            boxShadow: 'var(--neu-raised-shadow)',
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
