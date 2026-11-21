import React, { useEffect, useMemo, useState } from 'react';
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
import { DEFAULT_CARD_STYLE, DEFAULT_LAYER_DEPTH, THEME_BACKGROUNDS } from '@/config/ui/themeDefaults';
import { LAYER_DEPTH_PRESETS } from '@/config/ui/layerDepth';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { useFirebase } from '@/context/FirebaseContext';

const INTERFACE_UI_PREFS_KEY = 'hungthai_interface_ui_prefs_v1';

interface InterfaceUiPrefs {
  selectedFamilyFilter: 'all' | ThemeFamilyId;
  selectedMechanismFilter: 'all' | ThemeMechanismMode;
  focusedLayerLevel: 'all' | 'l1' | 'l2' | 'l3';
  isSandboxOpen: boolean;
  neuSliders: number[];
}

function readInterfaceUiPrefs(): InterfaceUiPrefs {
  const fallback: InterfaceUiPrefs = {
    selectedFamilyFilter: 'all',
    selectedMechanismFilter: 'all',
    focusedLayerLevel: 'all',
    isSandboxOpen: false,
    neuSliders: [68, 38, 92, 54, 82, 70],
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(INTERFACE_UI_PREFS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<InterfaceUiPrefs>;
    return {
      selectedFamilyFilter: parsed.selectedFamilyFilter ?? fallback.selectedFamilyFilter,
      selectedMechanismFilter: parsed.selectedMechanismFilter ?? fallback.selectedMechanismFilter,
      focusedLayerLevel:
        parsed.focusedLayerLevel === 'all' ||
        parsed.focusedLayerLevel === 'l1' ||
        parsed.focusedLayerLevel === 'l2' ||
        parsed.focusedLayerLevel === 'l3'
          ? parsed.focusedLayerLevel
          : fallback.focusedLayerLevel,
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

interface ThemeVisualMeta {
  radius: string;
  activeRingColor: string;
  activeBorderClass: string;
  idleBorderClass: string;
  activeBadgeClass: string;
  iconColor: string;
  titleTextClass: string;
  bodyTextClass: string;
  accentTextClass: string;
  previewBorderClass: string;
  dividerClass: string;
  ctaIdleClass: string;
  ctaActiveClass: string;
  toggleTrackDarkClass: string;
  toggleTrackLightClass: string;
  toggleThumbDarkClass: string;
  toggleThumbLightClass: string;
  outlineStyle?: (isActive: boolean) => React.CSSProperties;
  demoVideoUrl: string;
  gradientBars: Array<{ label: string; width: string; gradient: string; glow?: string }>;
}

const THEME_VISUAL_META: Record<CardStyleMode, ThemeVisualMeta> = {
  'liquid-glass': {
    radius: '24px',
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
    radius: '24px',
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
  'mica-fluent': {
    radius: '16px',
    activeRingColor: '#0067C0',
    activeBorderClass: 'border-[#0067C0]',
    idleBorderClass: 'border-black/12 hover:border-[#0067C0]/50',
    activeBadgeClass: 'bg-[#0067C0] text-white border-[#0067C0]',
    iconColor: '#0067C0',
    titleTextClass: 'text-[#1F1F1F]',
    bodyTextClass: 'text-[#5F5F5F]',
    accentTextClass: 'text-[#0067C0]',
    previewBorderClass: 'border-black/12 border-solid',
    dividerClass: 'border-black/10 border-solid',
    ctaIdleClass: 'bg-white text-[#1F1F1F] hover:bg-slate-50 border border-black/12',
    ctaActiveClass: 'bg-gradient-to-r from-[#0067C0] to-[#2B88D8] text-white shadow-xs border border-[#0067C0]',
    toggleTrackDarkClass: 'bg-slate-800 border-slate-700',
    toggleTrackLightClass: 'bg-slate-200 border-slate-300',
    toggleThumbDarkClass: 'bg-white text-slate-900',
    toggleThumbLightClass: 'bg-[#0067C0] text-white',
    outlineStyle: (isActive) => ({
      outline: isActive ? '2px solid #0067C0' : '1.5px solid rgba(0, 0, 0, 0.15)',
      outlineOffset: '-6px',
    }),
    demoVideoUrl: 'https://cdn.scena.ai/project/10223/cc5a8e558d2380dc8bfb96fd26cd877e444d63b6a7036a8530abd823d6d6da63.mp4',
    gradientBars: [
      { label: 'M1', width: '88%', gradient: 'linear-gradient(90deg, #0067C0, #2B88D8)', glow: '0 0 10px rgba(0, 103, 192, 0.3)' },
      { label: 'M2', width: '72%', gradient: 'linear-gradient(90deg, #107C41, #00A4EF)', glow: '0 0 10px rgba(16, 124, 65, 0.3)' },
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
    demoVideoUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4',
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
};

export const InterfaceView: React.FC<InterfaceViewProps> = ({ onShowNotification }) => {
  const {
    cardStyle,
    setCardStyle,
    isDark,
    surfaceDepth,
    setSurfaceDepth,
    layerDepth,
    setLayerDepth,
    resetLayerDepth,
  } = useTheme();
  const { language, t } = useLanguage();
  const { user, isSigningIn, signInWithGoogle, logout } = useFirebase();
  const isEn = language === 'en';
  const activePreset = getCardStyleConfig(cardStyle);

  const initialPrefs = useMemo(() => readInterfaceUiPrefs(), []);
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<'all' | ThemeFamilyId>(
    initialPrefs.selectedFamilyFilter
  );
  const [selectedMechanismFilter, setSelectedMechanismFilter] = useState<'all' | ThemeMechanismMode>(
    initialPrefs.selectedMechanismFilter
  );
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(initialPrefs.isSandboxOpen);
  const [activeVideoPreviewId, setActiveVideoPreviewId] = useState<CardStyleMode | null>(null);
  const [failedVideoIds, setFailedVideoIds] = useState<Record<string, boolean>>({});
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const [neuSliders, setNeuSliders] = useState<number[]>(initialPrefs.neuSliders);
  const [focusedLayerLevel, setFocusedLayerLevel] = useState<'all' | 'l1' | 'l2' | 'l3'>(
    initialPrefs.focusedLayerLevel
  );

  // Tự động lưu toàn bộ các lựa chọn trong trang Giao diện để áp dụng mặc định cho sau này
  useEffect(() => {
    try {
      const payload: InterfaceUiPrefs = {
        selectedFamilyFilter,
        selectedMechanismFilter,
        focusedLayerLevel,
        isSandboxOpen,
        neuSliders,
      };
      localStorage.setItem(INTERFACE_UI_PREFS_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [selectedFamilyFilter, selectedMechanismFilter, focusedLayerLevel, isSandboxOpen, neuSliders]);

  const getMechanismLabel = (mech: ThemeMechanismMode) => {
    if (mech === 'light') return isEn ? 'Light' : 'Sáng';
    if (mech === 'dark') return isEn ? 'Dark' : 'Tối';
    return isEn ? 'Color' : 'Màu';
  };

  const handleSelectTheme = (mode: CardStyleMode, label: string) => {
    SoundEngine.playGlassChime();
    setCardStyle(mode);
    if (onShowNotification) {
      onShowNotification(
        isEn
          ? `✓ Saved & applied theme: ${t(label)}`
          : `✓ Đã lưu & áp dụng giao diện: ${label}`
      );
    }
  };

  const handleSelectSurfaceDepth = (mode: 'flat' | 'depth') => {
    if (mode === surfaceDepth) return;
    SoundEngine.playGlassChime();
    setSurfaceDepth(mode);
    if (onShowNotification) {
      onShowNotification(
        mode === 'flat'
          ? isEn
            ? '✓ Saved: Minimalist Flat (No Shadow)'
            : '✓ Đã lưu: Giao diện phẳng tối giản'
          : isEn
            ? '✓ Saved: Layered Depth (Elevated Shadows)'
            : '✓ Đã lưu: Giao diện có chiều sâu'
      );
    }
  };

  const handleResetDefault = () => {
    const defaultCfg = getCardStyleConfig(DEFAULT_CARD_STYLE);
    SoundEngine.playGlassChime();
    setCardStyle(DEFAULT_CARD_STYLE);
    if (surfaceDepth !== 'depth') {
      setSurfaceDepth('depth');
    }
    if (layerDepth !== DEFAULT_LAYER_DEPTH) {
      resetLayerDepth();
    }
    setSelectedFamilyFilter('all');
    setSelectedMechanismFilter('all');
    setFocusedLayerLevel('all');
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
        presets: g.presets.filter(
          (p) => (p.mechanism || (p.isDark ? 'dark' : 'light')) === selectedMechanismFilter
        ),
      }))
      .filter((g) => g.presets.length > 0);
  }, [selectedFamilyFilter, selectedMechanismFilter]);

  const displayedThemesCount = UNIFIED_INTERFACE_THEMES.length;
  const visibleThemesCount = useMemo(
    () => visibleGroups.reduce((acc, g) => acc + g.presets.length, 0),
    [visibleGroups]
  );
  const isDefaultConfig =
    cardStyle === DEFAULT_CARD_STYLE &&
    surfaceDepth === 'depth' &&
    layerDepth === DEFAULT_LAYER_DEPTH;

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
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
          >
            <div className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none">
              {!heroVideoFailed && (
                <video
                  src="https://res.cloudinary.com/q5tpzaxk/video/upload/v1795204135/Giao_di%E1%BB%87n.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={() => setHeroVideoFailed(true)}
                  className="w-full h-full object-cover object-center rounded-[inherit]"
                />
              )}
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
              <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                <h1
                  className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                >
                  {isEn ? `Appearance Studio (${displayedThemesCount} Themes)` : `Kho ${displayedThemesCount} giao diện hệ thống`}
                </h1>
              </div>
              <p
                className="banner-quote typo-h3 font-handwriting font-italianno not-italic select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[60%]"
                style={{ color: 'var(--text-secondary)' }}
              >
                &quot;Tinh tế từng sắc màu, kiến tạo không gian sống động ♡&quot;
              </p>
            </div>

            <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="banner-control-pill typo-badge font-semibold px-3 py-1 rounded-full border truncate max-w-full">
                  {isEn
                    ? THEME_FOUR_WORD_NAMES[activePreset.id]?.en || t(activePreset.name)
                    : THEME_FOUR_WORD_NAMES[activePreset.id]?.vi || activePreset.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {user ? (
                  <button
                    id="btn-firebase-signout"
                    type="button"
                    onClick={() => void logout()}
                    className="banner-control-pill inline-flex items-center gap-2 px-3 py-1 rounded-full border typo-badge font-bold cursor-pointer transition-all hover:opacity-90"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <WebIcon name="user" className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="max-w-[120px] truncate">{user.displayName || (isEn ? 'Account' : 'Tài khoản')}</span>
                    <WebIcon name="log-out" className="w-3.5 h-3.5 shrink-0 opacity-75" />
                  </button>
                ) : (
                  <button
                    id="btn-firebase-signin"
                    type="button"
                    disabled={isSigningIn}
                    onClick={() => void signInWithGoogle()}
                    className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-badge font-bold cursor-pointer transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    <WebIcon name="log-in" className="w-3.5 h-3.5 shrink-0" />
                    <span>{isSigningIn ? (isEn ? 'Signing in...' : 'Đang đăng nhập...') : isEn ? 'Google Sync' : 'Đồng bộ Google'}</span>
                  </button>
                )}
                {!isDefaultConfig && (
                  <button
                    id="btn-interface-reset-default"
                    type="button"
                    onClick={handleResetDefault}
                    className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-badge font-bold cursor-pointer transition-all hover:opacity-90"
                  >
                    <WebIcon name="rotate-ccw" className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Reset Default' : 'Khôi phục mặc định'}</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* 1. Bảng điều khiển nhanh: Chọn tên giao diện & Chiều sâu Layer (tự động lưu mặc định) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch w-full">
            {/* Thẻ trái: Chọn nhanh chỉ theo Tên giao diện */}
            <section
              data-subcard="true"
              className="sub-card lg:col-span-6 flex flex-col justify-between gap-[12px] p-[15px] border min-w-0"
              style={{
                background: 'var(--bg-subcard)',
                borderColor: 'var(--border-subcard)',
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b min-w-0" style={{ borderColor: 'var(--border-subcard)' }}>
                <div className="card-header-sync flex items-center gap-2 min-w-0">
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
                aria-label={isEn ? 'Select interface theme by name' : 'Chọn giao diện theo tên'}
                className="flex flex-wrap gap-1.5 w-full min-w-0"
              >
                {UNIFIED_INTERFACE_THEMES.map((preset) => {
                  const isSelected = cardStyle === preset.id;
                  const shortName = isEn
                    ? THEME_FOUR_WORD_NAMES[preset.id]?.en || t(preset.name)
                    : THEME_FOUR_WORD_NAMES[preset.id]?.vi || preset.name;
                  return (
                    <button
                      key={preset.id}
                      id={`btn-quick-theme-${preset.id}`}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectTheme(preset.id, shortName)}
                      className={`px-3 py-1.5 rounded-full typo-badge font-bold border transition-colors cursor-pointer max-w-full truncate ${
                        isSelected ? 'shadow-xs border-transparent' : 'hover:opacity-90'
                      }`}
                      style={
                        isSelected
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }
                          : {
                              background: 'var(--bg-card)',
                              borderColor: 'var(--border-subcard)',
                              color: 'var(--text-primary)',
                            }
                      }
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Thẻ phải: Tinh chỉnh Chiều sâu & Độ nổi Layer */}
            <section
              data-subcard="true"
              className="sub-card lg:col-span-6 flex flex-col justify-between gap-[15px] p-[15px] border min-w-0"
              style={{
                background: 'var(--bg-subcard)',
                borderColor: 'var(--border-subcard)',
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b" style={{ borderColor: 'var(--border-subcard)' }}>
                <div className="card-header-sync flex items-center gap-2 min-w-0">
                  <h2
                    className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                    data-card-title="true"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {isEn ? 'Layer Depth & Elevation' : 'Chiều sâu & Độ nổi Layer'}
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1 p-0.5 rounded-full border shrink-0" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}>
                  <button
                    type="button"
                    aria-pressed={surfaceDepth === 'flat'}
                    onClick={() => handleSelectSurfaceDepth('flat')}
                    className={`px-2.5 py-0.5 rounded-full typo-badge font-bold cursor-pointer transition-all ${
                      surfaceDepth === 'flat' ? 'text-white shadow-xs' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={surfaceDepth === 'flat' ? { background: 'var(--bg-button-primary)' } : { color: 'var(--text-secondary)' }}
                  >
                    {isEn ? 'Flat' : 'Phẳng'}
                  </button>
                  <button
                    type="button"
                    aria-pressed={surfaceDepth === 'depth'}
                    onClick={() => handleSelectSurfaceDepth('depth')}
                    className={`px-2.5 py-0.5 rounded-full typo-badge font-bold cursor-pointer transition-all ${
                      surfaceDepth === 'depth' ? 'text-white shadow-xs' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={surfaceDepth === 'depth' ? { background: 'var(--bg-button-primary)' } : { color: 'var(--text-secondary)' }}
                  >
                    {isEn ? '3D Layer' : 'Chiều sâu'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-[15px] w-full">
                {/* Thanh kéo Độ sâu Layer */}
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-label font-bold" style={{ color: 'var(--text-secondary)' }}>
                      {isEn ? 'Layer Elevation' : 'Độ nổi Layer'}
                    </span>
                    <span className="typo-badge font-mono font-bold tabular-nums" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                      {layerDepth}%
                    </span>
                  </div>
                  <input
                    id="interface-layer-depth-slider"
                    type="range"
                    min={0}
                    max={200}
                    step={10}
                    value={layerDepth}
                    aria-label={isEn ? 'Adjust Layer Card elevation' : 'Điều chỉnh độ nổi Layer Card'}
                    onChange={(e) => setLayerDepth(Number(e.target.value))}
                    className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
                  />
                </div>

                {/* Các mốc nhanh Độ sâu Layer */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  {LAYER_DEPTH_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      aria-pressed={layerDepth === preset.value}
                      onClick={() => {
                        SoundEngine.playTap();
                        setLayerDepth(preset.value);
                      }}
                      className={`px-2.5 py-1 rounded-full typo-badge font-bold tabular-nums border cursor-pointer transition-all ${
                        layerDepth === preset.value ? 'text-white border-transparent shadow-xs' : 'hover:opacity-90'
                      }`}
                      style={
                        layerDepth === preset.value
                          ? { background: 'var(--bg-button-primary)' }
                          : { background: 'var(--bg-card)', borderColor: 'var(--border-subcard)', color: 'var(--text-secondary)' }
                      }
                    >
                      {preset.value}%
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* 1B. Sơ đồ xem trước trực tiếp phân tầng Layer Card Level 1 – 2 – 3 */}
          <section
            id="interface-layer-preview-card"
            data-section-card="true"
            className="flex flex-col gap-[15px] p-[15px] border min-w-0"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-card, 14px)',
            }}
          >
            {/* Header chuẩn quy tắc: Trái chỉ có Icon không khung + Tiêu đề cùng màu; Phải là bộ lọc xem tập trung */}
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b"
              style={{ borderColor: 'var(--border-subcard)' }}
            >
              <div className="card-header-sync flex items-center gap-2 min-w-0">
                <h2
                  className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                  data-card-title="true"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {isEn
                    ? 'Live Layer Card Hierarchy Preview (Level 1 – 2 – 3)'
                    : 'Xem trước phân tầng Layer Card trực tiếp (Level 1 – 2 – 3)'}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                {(
                  [
                    { id: 'all' as const, vi: 'Tất cả', en: 'All' },
                    { id: 'l1' as const, vi: 'Level 1', en: 'Level 1' },
                    { id: 'l2' as const, vi: 'Level 2', en: 'Level 2' },
                    { id: 'l3' as const, vi: 'Level 3', en: 'Level 3' },
                  ]
                ).map((tab) => {
                  const isSelected = focusedLayerLevel === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        SoundEngine.playTap();
                        setFocusedLayerLevel(tab.id);
                      }}
                      className={`px-2.5 py-1 rounded-full typo-badge font-bold border cursor-pointer transition-all ${
                        isSelected ? 'text-white border-transparent shadow-xs' : 'hover:opacity-90'
                      }`}
                      style={
                        isSelected
                          ? { background: 'var(--bg-button-primary)' }
                          : {
                              background: 'var(--bg-subcard)',
                              borderColor: 'var(--border-subcard)',
                              color: 'var(--text-secondary)',
                            }
                      }
                    >
                      {isEn ? tab.en : tab.vi}
                    </button>
                  );
                })}
                <span
                  className="px-2.5 py-1 rounded-full typo-badge font-mono font-bold tabular-nums border"
                  style={{
                    background: 'var(--bg-subcard)',
                    borderColor: 'var(--border-subcard)',
                    color: 'var(--text-link, var(--color-primary))',
                  }}
                >
                  {surfaceDepth === 'flat' ? '0% · Flat' : `${layerDepth}%`}
                </span>
              </div>
            </div>

            {/* Sơ đồ trực quan Header · Main Card · Footer (Level 1) chứa các Card bên trong (Level 2) + Khe dự phòng Level 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch">
              {/* Cột trái (8/12): Mô phỏng trực tiếp cấu trúc trang thực tế */}
              <div
                className="lg:col-span-8 flex flex-col gap-3 p-3.5 border rounded-[var(--radius-card,14px)] min-w-0"
                style={{
                  background: 'var(--bg-subcard)',
                  borderColor: 'var(--border-subcard)',
                }}
              >
                {/* Mini Header — Level 1 */}
                <div
                  className={`layer-preview-l1 flex flex-wrap items-center justify-between gap-2 px-3 py-2 border transition-opacity duration-200 ${
                    focusedLayerLevel !== 'all' && focusedLayerLevel !== 'l1' && focusedLayerLevel !== 'l2'
                      ? 'opacity-45'
                      : 'opacity-100'
                  }`}
                  style={{
                    background: 'var(--surface-header-bg, var(--bg-card))',
                    borderColor:
                      focusedLayerLevel === 'l1'
                        ? 'var(--color-primary)'
                        : 'var(--surface-primary-border, var(--border-color))',
                    borderRadius: '0 0 12px 12px',
                    boxShadow:
                      surfaceDepth === 'flat'
                        ? 'none'
                        : 'var(--layer-l1-header-shadow, var(--surface-header-shadow))',
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="px-2 py-0.5 rounded-full typo-badge font-bold shrink-0"
                      style={{
                        background: 'var(--color-primary)',
                        color: '#FFFFFF',
                      }}
                    >
                      L1
                    </span>
                    <span className="typo-label font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      Header
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div
                      className={`layer-preview-l2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                        focusedLayerLevel === 'l2' ? 'ring-2 ring-[var(--color-primary)]' : ''
                      }`}
                      style={{
                        background: 'var(--surface-secondary-bg, var(--bg-card))',
                        borderColor: 'var(--surface-secondary-border, var(--border-subcard))',
                      }}
                    >
                      <span className="typo-badge font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {isEn ? 'L2 · Header Pill Card' : 'L2 · Card trong Header'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Main Card — Level 1 */}
                <div
                  className={`layer-preview-l1 flex flex-col gap-2.5 p-3 border rounded-[var(--radius-card,14px)] transition-opacity duration-200 ${
                    focusedLayerLevel !== 'all' && focusedLayerLevel !== 'l1' && focusedLayerLevel !== 'l2'
                      ? 'opacity-45'
                      : 'opacity-100'
                  }`}
                  style={{
                    background: 'var(--surface-primary-bg, var(--bg-card))',
                    borderColor:
                      focusedLayerLevel === 'l1'
                        ? 'var(--color-primary)'
                        : 'var(--surface-primary-border, var(--border-color))',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="px-2 py-0.5 rounded-full typo-badge font-bold shrink-0"
                        style={{
                          background: 'var(--color-primary)',
                          color: '#FFFFFF',
                        }}
                      >
                        L1
                      </span>
                      <span className="typo-label font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        Main Card
                      </span>
                    </div>
                    <span className="typo-badge font-mono" style={{ color: 'var(--text-muted)' }}>
                      --layer-l1-shadow
                    </span>
                  </div>

                  {/* Cards bên trong Main Card — Level 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div
                      className={`layer-preview-l2 flex flex-col gap-1.5 p-2.5 border rounded-[var(--radius-subcard,12px)] transition-all ${
                        focusedLayerLevel === 'l2' ? 'ring-2 ring-[var(--color-primary)]' : ''
                      } ${
                        focusedLayerLevel !== 'all' && focusedLayerLevel !== 'l2'
                          ? 'opacity-55'
                          : 'opacity-100'
                      }`}
                      style={{
                        background: 'var(--surface-secondary-bg, var(--bg-card))',
                        borderColor: 'var(--surface-secondary-border, var(--border-subcard))',
                      }}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="typo-badge font-bold" style={{ color: 'var(--accent-blue, #2563EB)' }}>
                          {isEn ? 'L2 · Content Card A' : 'L2 · Card nội dung A'}
                        </span>
                        <span className="typo-badge font-mono" style={{ color: 'var(--text-muted)' }}>
                          Hover ↑
                        </span>
                      </div>
                      <span className="typo-caption" style={{ color: 'var(--text-secondary)' }}>
                        {isEn
                          ? 'Cards nested inside Main Card share Level 2 elevation.'
                          : 'Các thẻ nội dung nằm trong Main Card dùng chung tầng Level 2.'}
                      </span>
                    </div>

                    <div
                      className={`layer-preview-l2 flex flex-col gap-1.5 p-2.5 border rounded-[var(--radius-subcard,12px)] transition-all ${
                        focusedLayerLevel === 'l2' ? 'ring-2 ring-[var(--color-primary)]' : ''
                      } ${
                        focusedLayerLevel !== 'all' && focusedLayerLevel !== 'l2'
                          ? 'opacity-55'
                          : 'opacity-100'
                      }`}
                      style={{
                        background: 'var(--surface-secondary-bg, var(--bg-card))',
                        borderColor: 'var(--surface-secondary-border, var(--border-subcard))',
                      }}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="typo-badge font-bold" style={{ color: 'var(--accent-emerald, #059669)' }}>
                          {isEn ? 'L2 · Content Card B' : 'L2 · Card nội dung B'}
                        </span>
                        <span className="typo-badge font-mono" style={{ color: 'var(--text-muted)' }}>
                          --layer-l2
                        </span>
                      </div>
                      <span className="typo-caption" style={{ color: 'var(--text-secondary)' }}>
                        {isEn
                          ? 'Synchronizes blur, border, and shadow depth live with slider.'
                          : 'Đồng bộ bóng đổ, viền và hiệu ứng nổi theo thanh Độ sâu Layer.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Footer — Level 1 */}
                <div
                  className={`layer-preview-l1 flex flex-wrap items-center justify-between gap-2 px-3 py-2 border transition-opacity duration-200 ${
                    focusedLayerLevel !== 'all' && focusedLayerLevel !== 'l1' && focusedLayerLevel !== 'l2'
                      ? 'opacity-45'
                      : 'opacity-100'
                  }`}
                  style={{
                    background: 'var(--surface-footer-bg, var(--bg-card))',
                    borderColor:
                      focusedLayerLevel === 'l1'
                        ? 'var(--color-primary)'
                        : 'var(--surface-primary-border, var(--border-color))',
                    borderRadius: '12px 12px 0 0',
                    boxShadow:
                      surfaceDepth === 'flat'
                        ? 'none'
                        : 'var(--layer-l1-footer-shadow, var(--surface-footer-shadow))',
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="px-2 py-0.5 rounded-full typo-badge font-bold shrink-0"
                      style={{
                        background: 'var(--color-primary)',
                        color: '#FFFFFF',
                      }}
                    >
                      L1
                    </span>
                    <span className="typo-label font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      Footer
                    </span>
                  </div>
                  <div
                    className={`layer-preview-l2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                      focusedLayerLevel === 'l2' ? 'ring-2 ring-[var(--color-primary)]' : ''
                    }`}
                    style={{
                      background: 'var(--surface-secondary-bg, var(--bg-card))',
                      borderColor: 'var(--surface-secondary-border, var(--border-subcard))',
                    }}
                  >
                    <span className="typo-badge font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {isEn ? 'L2 · Footer Control Card' : 'L2 · Card trong Footer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột phải (4/12): Bảng phân bổ 3 tầng Level 1 – 2 – 3 & Mẫu dự phòng Level 3 */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-2.5 min-w-0">
                <div
                  className={`flex flex-col gap-1 p-3 border rounded-[var(--radius-subcard,12px)] transition-all ${
                    focusedLayerLevel === 'l1' ? 'ring-2 ring-[var(--color-primary)]' : ''
                  }`}
                  style={{
                    background: 'var(--bg-subcard)',
                    borderColor: 'var(--border-subcard)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-label font-bold" style={{ color: 'var(--color-primary)' }}>
                      Level Layer 1
                    </span>
                    <span className="typo-badge font-mono" style={{ color: 'var(--text-muted)' }}>
                      Khung chính
                    </span>
                  </div>
                  <span className="typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
                    {isEn ? 'Header, Main Card, Footer' : 'Header, Main Card, Footer'}
                  </span>
                </div>

                <div
                  className={`flex flex-col gap-1 p-3 border rounded-[var(--radius-subcard,12px)] transition-all ${
                    focusedLayerLevel === 'l2' ? 'ring-2 ring-[var(--color-primary)]' : ''
                  }`}
                  style={{
                    background: 'var(--bg-subcard)',
                    borderColor: 'var(--border-subcard)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-label font-bold" style={{ color: 'var(--accent-blue, #2563EB)' }}>
                      Level Layer 2
                    </span>
                    <span className="typo-badge font-mono" style={{ color: 'var(--text-muted)' }}>
                      Card nội dung
                    </span>
                  </div>
                  <span className="typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
                    {isEn
                      ? 'All cards inside Header, Main Card, and Footer'
                      : 'Các card nằm trong Header, Main Card, Footer'}
                  </span>
                </div>

                <div
                  className={`layer-preview-l3 flex flex-col gap-1 p-3 border border-dashed rounded-[var(--radius-subcard,12px)] transition-all ${
                    focusedLayerLevel === 'l3' ? 'ring-2 ring-[var(--color-primary)]' : ''
                  }`}
                  style={{
                    background: 'var(--surface-tertiary-bg, var(--bg-subcard))',
                    borderColor:
                      focusedLayerLevel === 'l3'
                        ? 'var(--color-primary)'
                        : 'var(--border-subcard)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-label font-bold" style={{ color: 'var(--text-muted)' }}>
                      Level Layer 3
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full typo-badge font-semibold border"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-subcard)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {isEn ? 'Reserved' : 'Dự phòng'}
                    </span>
                  </div>
                  <span className="typo-body-sm" style={{ color: 'var(--text-muted)' }}>
                    {isEn ? 'Currently unassigned' : 'Tạm chưa phân bổ'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Bộ lọc nhanh theo nhóm phong cách & tông Sáng/Tối/Màu + Nút mở phòng thử vật liệu */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[15px] flex-wrap">
            <div
              role="tablist"
              aria-label={isEn ? 'Filter themes by family' : 'Lọc giao diện theo nhóm chất liệu'}
              className="flex items-center gap-1.5 flex-wrap"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedFamilyFilter === 'all'}
                onClick={() => setSelectedFamilyFilter('all')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border typo-label font-bold cursor-pointer transition-all ${
                  selectedFamilyFilter === 'all'
                    ? 'text-white border-transparent shadow-xs'
                    : 'hover:opacity-90'
                }`}
                style={
                  selectedFamilyFilter === 'all'
                    ? { background: 'var(--bg-button-primary)' }
                    : {
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                        color: 'var(--text-primary)',
                      }
                }
              >
                <WebIcon name="grid" className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isEn ? `All (${displayedThemesCount})` : `Tất cả (${displayedThemesCount})`}
                </span>
              </button>

              {CARD_STYLE_GROUPS.map((grp) => {
                const isSelectedTab = selectedFamilyFilter === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelectedTab}
                    onClick={() => setSelectedFamilyFilter(grp.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border typo-label font-bold cursor-pointer transition-all ${
                      isSelectedTab
                        ? 'text-white border-transparent shadow-xs'
                        : 'hover:opacity-90'
                    }`}
                    style={
                      isSelectedTab
                        ? { background: 'var(--bg-button-primary)' }
                        : {
                            background: 'var(--bg-subcard)',
                            borderColor: 'var(--border-subcard)',
                            color: 'var(--text-primary)',
                          }
                    }
                  >
                    <WebIcon name={grp.icon} className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isEn ? grp.labelEn : grp.label} ({grp.presets.length})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Lọc nhanh theo cơ chế Sáng / Tối / Màu */}
              <div
                className="inline-flex items-center gap-1 p-1 rounded-full border"
                style={{ background: 'var(--bg-subcard)', borderColor: 'var(--border-subcard)' }}
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
                      onClick={() => setSelectedMechanismFilter(item.id)}
                      className={`px-2.5 py-1 rounded-full typo-badge font-bold cursor-pointer transition-all ${
                        active ? 'text-white shadow-xs' : 'hover:opacity-90'
                      }`}
                      style={active ? { background: 'var(--bg-button-primary)' } : { color: 'var(--text-secondary)' }}
                    >
                      {isEn ? item.labelEn : item.labelVi}
                    </button>
                  );
                })}
              </div>

              {/* Nút mở / thu gọn phòng thử vật liệu Soft UI */}
              <button
                type="button"
                aria-expanded={isSandboxOpen}
                onClick={() => {
                  SoundEngine.playTap();
                  setIsSandboxOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border typo-badge font-bold cursor-pointer transition-all hover:opacity-90"
                style={{
                  background: isSandboxOpen ? 'var(--bg-button-primary)' : 'var(--bg-subcard)',
                  borderColor: isSandboxOpen ? 'transparent' : 'var(--border-subcard)',
                  color: isSandboxOpen ? '#FFFFFF' : 'var(--text-primary)',
                }}
              >
                <WebIcon name="sparkles" className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isSandboxOpen
                    ? isEn
                      ? 'Hide Material Lab'
                      : 'Ẩn phòng thử vật liệu'
                    : isEn
                      ? 'Material Lab'
                      : 'Phòng thử vật liệu'}
                </span>
              </button>
            </div>
          </div>

          {/* 3. Danh sách nhóm giao diện & thẻ xem trước tương tác kèm hình nền riêng từng giao diện */}
          <div className="flex flex-col gap-[15px]">
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
                  className="px-3.5 py-1.5 rounded-full typo-badge font-bold text-white cursor-pointer"
                  style={{ background: 'var(--bg-button-primary)' }}
                >
                  {isEn ? 'Show all themes' : 'Hiện tất cả giao diện'}
                </button>
              </div>
            ) : (
              visibleGroups.map((group) => {
                const groupActive = group.presets.some((p) => p.id === cardStyle);
                const gridColsClass =
                  group.presets.length === 1
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch'
                    : group.presets.length === 2
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch'
                      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch';

                return (
                  <section
                    key={group.id}
                    data-subcard="true"
                    className="sub-card flex flex-col gap-[15px] p-[15px] border transition-all duration-300"
                    style={{
                      background: 'var(--bg-subcard)',
                      borderColor: groupActive ? 'var(--color-primary)' : 'var(--border-subcard)',
                    }}
                  >
                    <div
                      className="flex items-center justify-between gap-2 pb-2.5 border-b"
                      style={{ borderColor: 'var(--border-subcard)' }}
                    >
                      <div className="card-header-sync flex items-center gap-2 min-w-0">
                        <h3
                          className="typo-h5 font-bold tracking-tight truncate card-title-synced"
                          data-card-title="true"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {isEn ? group.labelEn : group.label}
                        </h3>
                      </div>
                      <span
                        className="typo-badge px-2 py-0.5 rounded-full border font-semibold shrink-0"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: 'var(--border-subcard)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {group.presets.length} {isEn ? 'styles' : 'biến thể'}
                      </span>
                    </div>
                    <p className="typo-caption" style={{ color: 'var(--text-muted)' }}>
                      {isEn ? group.descriptionEn : group.description}
                    </p>

                    <div className={gridColsClass}>
                      {group.presets.map((preset) => {
                        const isActive = cardStyle === preset.id;
                        const meta = THEME_VISUAL_META[preset.id];
                        const bgSpec = THEME_BACKGROUNDS[preset.id];
                        const displayPresetName = t(preset.name);
                        const displayShortBadge = t(preset.shortBadge);
                        const sampleProps = getCardStyleProperties(preset.id).cardSampleStyle;
                        const isVideoVisible =
                          activeVideoPreviewId === preset.id && !failedVideoIds[preset.id];

                        return (
                          <motion.article
                            key={preset.id}
                            whileTap={{ scale: 0.99 }}
                            style={{
                              ...sampleProps,
                              borderRadius: meta.radius,
                              padding: '15px',
                              ...(meta.outlineStyle ? meta.outlineStyle(isActive) : {}),
                              ...(isActive
                                ? {
                                    boxShadow: `${(sampleProps as any).boxShadow || ''}, 0 0 0 2.5px ${meta.activeRingColor}`,
                                  }
                                : {}),
                            }}
                            className={`relative flex flex-col justify-between gap-[15px] transition-all duration-300 border min-w-0 ${preset.cardClassName} ${
                              isActive ? meta.activeBorderClass : meta.idleBorderClass
                            }`}
                          >
                            {/* Top Row: Badge + Dedicated Wallpaper Thumbnail Preview */}
                            <div className="flex flex-col gap-2.5 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`typo-badge font-bold px-2.5 py-0.5 rounded-full border ${
                                    isActive ? meta.activeBadgeClass : preset.badgeColorClass
                                  }`}
                                >
                                  {displayShortBadge}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isActive && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/35">
                                      <WebIcon name="check" className="w-3 h-3 shrink-0" />
                                      <span>{isEn ? 'Active' : 'Đang bật'}</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Title & Description */}
                              <div className="min-w-0 flex flex-col gap-1.5">
                                <div className="card-header-sync flex items-center gap-2 min-w-0">
                                  <h4
                                    className="typo-h4 font-bold leading-snug min-w-0 truncate card-title-synced"
                                    data-card-title="true"
                                    style={{ color: meta.iconColor }}
                                  >
                                    {displayPresetName}
                                  </h4>
                                </div>
                                <p className={`typo-body-sm leading-relaxed ${meta.bodyTextClass}`}>
                                  {t(preset.desc)}
                                </p>
                              </div>
                            </div>

                            {/* Dedicated Theme Wallpaper + Live Material Specimen */}
                            <div
                              style={{
                                borderRadius: preset.id.includes('glass') ? '20px' : 'var(--radius-subcard, 14px)',
                                backgroundImage: bgSpec?.imagePath
                                  ? `url('${bgSpec.imagePath}'), ${bgSpec.fallbackGradient}`
                                  : bgSpec?.fallbackGradient,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                              className={`relative overflow-hidden p-3 flex flex-col gap-2.5 border ${meta.previewBorderClass}`}
                            >
                              <div
                                className="relative z-10 p-2.5 flex flex-col gap-2 border"
                                style={{
                                  ...preset.miniPreviewWrapStyle,
                                  borderRadius: preset.id.includes('glass') ? '16px' : '12px',
                                }}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`typo-badge font-bold truncate ${meta.titleTextClass}`}>
                                    {isEn ? 'Wallpaper & Surface' : 'Hình nền & Vật liệu'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveVideoPreviewId((prev) =>
                                        prev === preset.id ? null : preset.id
                                      )
                                    }
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-semibold border cursor-pointer transition-opacity hover:opacity-90 shrink-0 ${meta.ctaIdleClass}`}
                                  >
                                    <WebIcon
                                      name={isVideoVisible ? 'x' : 'play'}
                                      className="w-3 h-3 shrink-0"
                                    />
                                    <span>
                                      {isVideoVisible
                                        ? isEn
                                          ? 'Close'
                                          : 'Đóng'
                                        : isEn
                                          ? 'Demo'
                                          : 'Video'}
                                    </span>
                                  </button>
                                </div>

                                {isVideoVisible ? (
                                  <div
                                    data-media-card="video"
                                    style={{
                                      padding: '2px',
                                      borderRadius: preset.id.includes('glass') ? '16px' : '12px',
                                    }}
                                    className="relative w-full h-[112px] overflow-hidden bg-slate-950/60 border border-white/20 box-border"
                                  >
                                    <video
                                      src={meta.demoVideoUrl}
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      onError={() =>
                                        setFailedVideoIds((prev) => ({ ...prev, [preset.id]: true }))
                                      }
                                      className="w-full h-full object-cover rounded-[inherit]"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <span
                                        style={preset.miniTabStyle}
                                        className="px-2.5 py-1 typo-badge font-bold flex-1 truncate rounded-full border text-center"
                                      >
                                        {isEn ? 'Header · Tab' : 'Header · Tab Mẫu'}
                                      </span>
                                      <span
                                        style={preset.miniBtnStyle}
                                        className="px-2.5 py-1 typo-badge font-bold rounded-full shadow-2xs shrink-0"
                                      >
                                        {isEn ? 'Accent' : 'Nút Nhấn'}
                                      </span>
                                    </div>

                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                      {meta.gradientBars.slice(0, 3).map((bar) => (
                                        <div key={bar.label} className="flex items-center gap-2">
                                          <span
                                            className={`w-9 shrink-0 typo-badge font-mono ${meta.accentTextClass}`}
                                          >
                                            {bar.label}
                                          </span>
                                          <div
                                            className="flex-1 h-2 rounded-full overflow-hidden"
                                            style={{
                                              background: preset.isDark
                                                ? 'rgba(15, 23, 42, 0.55)'
                                                : 'rgba(148, 163, 184, 0.22)',
                                            }}
                                          >
                                            <div
                                              className="h-full rounded-full"
                                              style={{
                                                width: bar.width,
                                                background: bar.gradient,
                                                boxShadow: bar.glow,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Single Clear Card Footer Action */}
                            <div className={`mt-auto pt-2.5 flex items-center justify-between gap-2 border-t ${meta.dividerClass}`}>
                              <span className={`typo-caption font-mono truncate ${meta.accentTextClass}`}>
                                {preset.id.includes('glass') ? '24px · blur(24px)' : meta.radius}
                              </span>

                              <button
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => handleSelectTheme(preset.id, displayPresetName)}
                                className={`typo-button font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                  isActive ? meta.ctaActiveClass : meta.ctaIdleClass
                                }`}
                              >
                                <WebIcon
                                  name={isActive ? 'check' : 'sparkles'}
                                  className="w-3.5 h-3.5 shrink-0"
                                />
                                <span>
                                  {isActive
                                    ? isEn
                                      ? 'Active Theme'
                                      : 'Đang áp dụng'
                                    : isEn
                                      ? 'Apply Theme'
                                      : 'Áp dụng giao diện'}
                                </span>
                              </button>
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>
                  </section>
                );
              })
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
                <div className="card-header-sync flex items-center gap-2 min-w-0">
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
                      placeholder="Search for ..."
                      className="w-full bg-transparent border-none outline-none typo-body text-[var(--text-input)] placeholder-[var(--text-placeholder)]"
                      readOnly
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playGlassChime();
                      if (onShowNotification) onShowNotification(isEn ? '✓ Soft button clicked!' : '✓ Đã bấm nút Soft UI!');
                    }}
                    className="w-full py-3 px-6 rounded-[999px] border typo-button font-bold text-center cursor-pointer transition-all active:scale-[0.99]"
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
