'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Minimize2 = createAnimatedIcon('minimize-2');
const ExternalLink = createAnimatedIcon('external-link');
const Database = createAnimatedIcon('database');
const Network = createAnimatedIcon('network');
const Table = createAnimatedIcon('table');
const LayoutGrid = createAnimatedIcon('grid');
import { SYSTEMS_DATA } from '@/data/systems';
import { SystemData, SiteTheme } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn } from '@/lib/utils';
import { EcosystemDiagramModal } from '@/components/common/EcosystemDiagramModal';
import { useTheme } from '@/hooks/useTheme';
import { stopActiveSpeech } from '@/utils/speechVoice';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import { SpringDropdownMenu, SpringTick } from '@/components/ui/SpringDropdown';
import { SystemBentoCard } from './systems/SystemBentoCard';
import { SYSTEM_TECH_SPECS_MAP, SYSTEM_DESIGN_MAP } from './systems/systemsMeta';

export interface SystemsViewProps {
  currentTheme?: SiteTheme;
  onShowNotification?: (msg: string) => void;
}

const SYSTEM_FLOATING_IDLE_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/581097478f9de72616d982e302e1c8d0aab6d66cbee040430c610424c0c72a44.mp4';
const SYSTEM_FLOATING_INTRO_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/ac120a105730c378447fd67f5e8b6aeb9557b5e4e8854ac2e21148d5316f780b.mp4';

const REFERENCE_GRID_ORDER = [
  'csc',
  'sdp',
  'okr',
  'bpm',
  'ai',
  'hrm',
  'crm',
  'clp',
  'pos',
  'erp',
  'lms',
  'bi',
];

export const SystemsView: React.FC<SystemsViewProps> = ({ currentTheme }) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark, cardStyle } = useTheme();

  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-iridescent-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-flat-soft-ui';
  const isLight = !isDark;
  const isLeatherTheme = cardStyle === 'cowhide-leather' || cardStyle === 'walnut-wood';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [isEcosystemDiagramOpen, setIsEcosystemDiagramOpen] = useState<boolean>(false);
  const systemsBannerVideo = getDefaultBannerVideoConfig('systems');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Unified In-Grid 6-Card Bento Expansion
  const [expandedBentoId, setExpandedBentoId] = useState<string | null>(null);
  const [baseCardHeight, setBaseCardHeight] = useState<number>(172);
  const [gridCols, setGridCols] = useState<1 | 2 | 3>(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });

  // Floating Intro Video Circle
  const introStageVideoRef = useRef<HTMLVideoElement>(null);
  const [isCircleVideoPlaying, setIsCircleVideoPlaying] = useState<boolean>(false);
  const [isIntroStageMuted, setIsIntroStageMuted] = useState<boolean>(false);
  const [nineCardBoxSize, setNineCardBoxSize] = useState<{ width: number; height: number } | null>(null);

  // Refs for layout measurement
  const systemsMainRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    return () => {
      stopActiveSpeech();
    };
  }, []);

  const getSystemCategory = (id: string): string => {
    if (['sdp', 'csc', 'crm', 'clp', 'pos'].includes(id)) return 'cskh';
    if (['erp', 'hrm', 'bpm', 'okr', 'lms'].includes(id)) return 'enterprise';
    if (['bi', 'ai'].includes(id)) return 'ai_analytics';
    return 'cskh';
  };

  const ecosystemSegments = useMemo(
    () => [
      {
        id: 'all',
        label: isEn ? 'All 12 Systems' : 'Tất cả phân hệ',
        count: 12,
      },
      {
        id: 'cskh',
        label: isEn ? 'Customer Ops (CSKH)' : 'Vận hành CSKH',
        count: 5,
      },
      {
        id: 'enterprise',
        label: isEn ? 'Enterprise Management' : 'Quản trị doanh nghiệp',
        count: 5,
      },
      {
        id: 'ai_analytics',
        label: isEn ? 'AI & Analytics' : 'Phân tích & AI',
        count: 2,
      },
    ],
    [isEn]
  );

  const filteredSystems = useMemo(() => {
    let list = [...SYSTEMS_DATA];
    if (activeCategory === 'all' && !searchQuery.trim()) {
      return list;
    }
    if (activeCategory !== 'all') {
      list = list.filter((item) => getSystemCategory(item.id) === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const matchVi =
          (item.nameVi || item.name || '').toLowerCase().includes(q) ||
          (item.descVi || item.description || '').toLowerCase().includes(q);
        const matchEn =
          (item.nameEn || item.name || '').toLowerCase().includes(q) ||
          (item.descEn || item.description || '').toLowerCase().includes(q);
        const matchCode =
          (item.abbr || item.code || '').toLowerCase().includes(q) ||
          (item.fullName || item.name || '').toLowerCase().includes(q) ||
          (item.metrics || '').toLowerCase().includes(q);
        return matchVi || matchEn || matchCode;
      });
    }
    return list;
  }, [activeCategory, searchQuery]);

  const orderedAllSystems = useMemo(() => {
    const copy = [...SYSTEMS_DATA];
    copy.sort((a, b) => {
      const idxA = REFERENCE_GRID_ORDER.indexOf(a.id);
      const idxB = REFERENCE_GRID_ORDER.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });
    return copy;
  }, []);

  const getAccentColor = useCallback(
    (id: string) => {
      if (cardStyle === 'walnut-wood') {
        return '#F5C478';
      }
      if (isLeatherTheme) {
        return '#FDE68A';
      }
      const meta = SYSTEM_DESIGN_MAP[id] || SYSTEM_DESIGN_MAP.sdp;
      return isLight ? meta.lightAccent : meta.darkAccent;
    },
    [isLeatherTheme, cardStyle, isLight]
  );

  // Measure single collapsed card height & responsive column count to size expanded card = 6 cards combined
  useEffect(() => {
    const updateGridGeometry = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const nextCols: 1 | 2 | 3 = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      setGridCols(nextCols);

      const collapsedSample = Object.entries(cardRefs.current).find(
        ([id, el]) => el && id !== expandedBentoId
      )?.[1];
      if (collapsedSample) {
        const rect = collapsedSample.getBoundingClientRect();
        if (rect.height >= 140) {
          setBaseCardHeight(Math.round(rect.height));
        }
      }
    };

    updateGridGeometry();
    window.addEventListener('resize', updateGridGeometry, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && cardsGridRef.current) {
      ro = new ResizeObserver(updateGridGeometry);
      ro.observe(cardsGridRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateGridGeometry);
      if (ro) ro.disconnect();
    };
  }, [filteredSystems.length, viewMode, expandedBentoId]);

  const expandedSixCardHeight = useMemo(() => {
    const h = Math.max(156, baseCardHeight);
    if (gridCols === 3) {
      // Desktop: 3 cols x 2 rows = 6 system cards combined
      return h * 2 + 16;
    }
    if (gridCols === 2) {
      // Tablet: 2 cols x 3 rows = 6 system cards combined
      return h * 3 + 32;
    }
    return undefined;
  }, [baseCardHeight, gridCols]);

  const selectAndScrollSystem = useCallback((id: string) => {
    SoundEngine.playTechChimeExpand();
    setIsCircleVideoPlaying(false);
    setViewMode('grid');
    setExpandedBentoId(id);
    window.setTimeout(() => {
      const targetEl = cardRefs.current[id];
      targetEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }, []);

  // Floating intro circle video helpers
  const measureNineCardsBox = useCallback((): { width: number; height: number } | null => {
    const gridEl = cardsGridRef.current || cardsWrapperRef.current;
    if (!gridEl) return null;
    const gridRect = gridEl.getBoundingClientRect();
    if (gridRect.width <= 0) return null;

    const firstCardKey = Object.keys(cardRefs.current).find((k) => cardRefs.current[k]);
    const firstCardEl = firstCardKey ? cardRefs.current[firstCardKey] : null;
    const cardRect = firstCardEl?.getBoundingClientRect();

    const cols =
      gridRect.width >= 960 ? 3 : gridRect.width >= 600 ? 2 : 1;
    const targetCols = Math.min(3, cols);
    const targetRows = Math.ceil(9 / targetCols);

    const singleCardW =
      cardRect && cardRect.width > 0
        ? cardRect.width
        : (gridRect.width - Math.max(0, cols - 1) * 15) / cols;
    const singleCardH = cardRect && cardRect.height > 0 ? cardRect.height : 196;

    const rawW = targetCols * singleCardW + Math.max(0, targetCols - 1) * 15;
    const rawH = targetRows * singleCardH + Math.max(0, targetRows - 1) * 15;

    return {
      width: Math.min(Math.round(gridRect.width), Math.max(300, Math.round(rawW))),
      height: Math.max(260, Math.round(rawH)),
    };
  }, []);

  useEffect(() => {
    if (!isCircleVideoPlaying) return;
    const video = introStageVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    setIsIntroStageMuted(false);
    const p = video.play();
    if (p !== undefined) {
      p.catch(() => {
        if (introStageVideoRef.current) {
          introStageVideoRef.current.muted = true;
          setIsIntroStageMuted(true);
          introStageVideoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isCircleVideoPlaying]);

  const handleCloseIntroVideo = useCallback(() => {
    SoundEngine.playTap();
    if (introStageVideoRef.current) {
      introStageVideoRef.current.pause();
      introStageVideoRef.current.currentTime = 0;
    }
    setIsCircleVideoPlaying(false);
    showToast(isEn ? 'Closed intro video' : 'Đã đóng video giới thiệu — Hiển thị lại 12 hệ thống');
  }, [isEn, showToast]);

  const handleToggleCircleVideo = useCallback(() => {
    SoundEngine.playTap();
    if (isCircleVideoPlaying) {
      handleCloseIntroVideo();
      return;
    }
    stopActiveSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setExpandedBentoId(null);
    const measured = measureNineCardsBox();
    if (measured) setNineCardBoxSize(measured);
    setViewMode('grid');
    setIsCircleVideoPlaying(true);
    showToast(isEn ? 'Playing systems intro video' : 'Đang phát video giới thiệu 12 hệ thống 🔊');
  }, [isCircleVideoPlaying, handleCloseIntroVideo, measureNineCardsBox, isEn, showToast]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  const handleToggleBentoCard = useCallback((id: string) => {
    setExpandedBentoId((prev) => (prev === id ? null : id));
  }, []);

  const handleCollapseBentoCard = useCallback(() => {
    setExpandedBentoId(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
      } else if (isEcosystemDiagramOpen) {
        setIsEcosystemDiagramOpen(false);
      } else if (expandedBentoId) {
        setExpandedBentoId(null);
      } else if (isCircleVideoPlaying) {
        handleCloseIntroVideo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isFilterDropdownOpen,
    isEcosystemDiagramOpen,
    expandedBentoId,
    isCircleVideoPlaying,
    handleCloseIntroVideo,
  ]);

  const handleOpenExternalUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!url || url === '#') {
      showToast(
        isEn
          ? 'BI Dashboard API integration is being finalized.'
          : 'Hệ thống BI Dashboard đang hoàn thiện tích hợp API thời gian thực!'
      );
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="systems-page-container"
      data-element-name="Trang Hệ Thống Vận Hành"
      data-element-type="container"
      data-element-page="systems"
      data-element-parent="global-content-viewport"
      className={cn(
        "main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left rounded-[var(--radius-global,var(--radius-main,14px))] text-[var(--text-primary)] box-border",
        !isDark && "systems-bento-light-mode"
      )}
    >
      <style>{`
        html #systems-page-container.systems-bento-light-mode .sys-bento-studio-card,
        html #systems-page-container.systems-bento-light-mode .system-card {
          background: rgba(255, 255, 255, 0.88) !important;
          color: #172554 !important;
          border: 1px solid rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(16px) saturate(140%) !important;
          box-shadow: 0 14px 30px -8px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1) !important;
        }

        html #systems-page-container.systems-bento-light-mode .sys-bento-studio-card h3,
        html #systems-page-container.systems-bento-light-mode .sys-bento-studio-card h3 span,
        html #systems-page-container.systems-bento-light-mode .sys-bento-studio-card .sys-desc-copy,
        html #systems-page-container.systems-bento-light-mode .sys-bento-studio-card .sys-fullname-copy {
          color: #172554 !important;
        }

        html #systems-page-container.systems-bento-light-mode .sys-bento-studio-card .sys-bottom-meta {
          border-top-color: rgba(15, 23, 42, 0.1) !important;
        }
      `}</style>
      <div
        id="systems-cards-track"
        data-element-name="Track căn giữa Hệ Thống"
        data-element-type="container"
        data-element-page="systems"
        data-element-parent="systems-page-container"
        className="page-cards-track"
      >
        <div
          id="systems-main-card"
          ref={systemsMainRef}
          data-main-card="true"
          data-floating-surface="main"
          data-detail-open={isCircleVideoPlaying ? 'true' : 'false'}
          data-detail-overlay="false"
          data-element-name="Thẻ chính Trang Hệ Thống Vận Hành"
          data-element-type="card"
          data-element-page="systems"
          data-element-parent="systems-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play select-none text-left box-border"
          style={{
            padding: '15px',
            gap: '0px',
            borderRadius: 'var(--radius-main, 14px)',
          }}
        >
          <div
            id="systems-main-scroll-viewport"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-center justify-start gap-[15px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
          >
          {/* 1. HERO BANNER ĐẦU TRANG HỆ THỐNG */}
          {!isCircleVideoPlaying && (
          <motion.section
            id="systems-hero-banner"
            data-element-name="Banner card"
            data-element-type="banner-card"
            data-element-page="systems"
            data-section-card="true"
            data-has-compact-menu="true"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-0 rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300 box-border"
            style={{
              padding: '15px',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              borderRadius: 'var(--radius-banner, 14px)',
            }}
          >
            <div
              className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
            >
              <VideoBanner
                videoId={systemsBannerVideo.videoId}
                title={systemsBannerVideo.title}
                className="rounded-[inherit]"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            {/* Vùng Tiêu Đề Banner */}
            <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
              <div
                className="card-header-sync flex items-center gap-2 min-w-0"
                style={{ color: 'var(--text-link, var(--color-primary))' }}
              >
                <WebIcon name="cpu" className="w-[22px] h-[22px] shrink-0" />
                <h1
                  className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                  style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  {isEn ? 'Enterprise operating systems' : 'Hệ thống vận hành'}
                </h1>
              </div>
              <p
                className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[58%]"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                  fontWeight: 600,
                  fontStyle: 'normal',
                }}
              >
                &quot;Hệ thống thông minh, vận hành tinh gọn và đồng bộ ♡&quot;
              </p>

              <CompactBannerMenu
                id="systems-compact-menu-btn"
                label={isEn ? 'Controls' : 'Điều khiển'}
                ariaLabel={isEn ? 'System search, filters and view mode' : 'Tìm kiếm, bộ lọc phân hệ và sơ đồ'}
                activeCount={(activeCategory !== 'all' ? 1 : 0) + (searchQuery.trim() ? 1 : 0)}
              >
                {(closeMenu) => (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Search' : 'Tìm kiếm'}
                      </span>
                      <div className="relative w-full">
                        <WebIcon
                          name="search"
                          className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (expandedBentoId) setExpandedBentoId(null);
                          }}
                          placeholder={isEn ? 'Search systems...' : 'Tìm hệ thống...'}
                          className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-input font-play focus:outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                          >
                            <WebIcon name="cancel" className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'View mode' : 'Dạng hiển thị'}
                      </span>
                      <div className="banner-control-pill w-full inline-flex items-center gap-1 p-0.5 rounded-full">
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setIsCircleVideoPlaying(false);
                            setViewMode('grid');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'grid'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'grid' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Grid' : 'Dạng lưới'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setExpandedBentoId(null);
                            setIsCircleVideoPlaying(false);
                            setViewMode('matrix');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'matrix'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'matrix' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <Table className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Matrix' : 'Ma trận'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'System segment' : 'Bộ lọc phân hệ'}
                      </span>
                      {ecosystemSegments.map((seg) => {
                        const isActive = activeCategory === seg.id;
                        return (
                          <button
                            key={seg.id}
                            type="button"
                            data-selected={isActive ? 'true' : undefined}
                            onClick={() => {
                              SoundEngine.playTap();
                              setActiveCategory(seg.id);
                              setExpandedBentoId(null);
                              setIsCircleVideoPlaying(false);
                              closeMenu();
                            }}
                            className={cn(
                              'theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
                              isActive ? 'shadow-xs font-bold' : ''
                            )}
                          >
                            <span>{seg.label}</span>
                            {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1 border-t border-[var(--border-subcard)]">
                      <button
                        type="button"
                        onClick={() => {
                          SoundEngine.playTechChimeExpand();
                          setIsEcosystemDiagramOpen(true);
                          closeMenu();
                        }}
                        className="banner-primary-cta h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-play cursor-pointer"
                      >
                        <WebIcon name="git-merge" className="w-3.5 h-3.5 shrink-0" />
                        <span>{isEn ? 'Architecture' : 'Sơ đồ hệ thống'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleToggleCircleVideo();
                          closeMenu();
                        }}
                        className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-play cursor-pointer"
                      >
                        <WebIcon name={isCircleVideoPlaying ? 'cancel' : 'play'} className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isCircleVideoPlaying
                            ? isEn
                              ? 'Close intro video'
                              : 'Đóng video giới thiệu'
                            : isEn
                              ? 'Watch intro video'
                              : 'Video giới thiệu'}
                        </span>
                      </button>

                      {expandedBentoId && (
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedBentoId(null);
                            closeMenu();
                          }}
                          className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-full typo-button font-play cursor-pointer"
                        >
                          <Minimize2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Back to 12 Systems' : 'Thu gọn 12 thẻ'}</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </CompactBannerMenu>
            </div>

            {/* Bộ điều khiển dưới banner */}
            <div
              id="systems-hero-banner-controls"
              className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full"
              ref={filterDropdownRef}
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                {/* Bộ lọc phân hệ */}
                <div className="relative inline-block text-left">
                  <button
                    id="systems-filter-toggle-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterDropdownOpen((prev) => !prev);
                    }}
                    className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play group"
                    title={isEn ? 'System Filter' : 'Bộ lọc phân hệ'}
                    aria-label={isEn ? 'System Filter' : 'Bộ lọc phân hệ'}
                    aria-expanded={isFilterDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <WebIcon name="sliders" className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>{isEn ? 'System Filter' : 'Bộ lọc phân hệ'}</span>
                    {activeCategory !== 'all' && (
                      <span className="banner-count-pill px-1.5 py-0.5 rounded-full typo-badge font-mono">
                        {ecosystemSegments.find((s) => s.id === activeCategory)?.label}
                      </span>
                    )}
                    <WebIcon
                      name="chevron-down"
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
                        isFilterDropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isFilterDropdownOpen && (
                      <SpringDropdownMenu
                        id="systems-filter-listbox"
                        data-element-type="card"
                        placement="down"
                        origin="0% 0%"
                        role="listbox"
                        className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14.5rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                      >
                        {ecosystemSegments.map((seg) => {
                          const isActive = activeCategory === seg.id;
                          return (
                            <button
                              key={seg.id}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              data-selected={isActive ? 'true' : undefined}
                              onClick={() => {
                                SoundEngine.playTap();
                                setActiveCategory(seg.id);
                                setExpandedBentoId(null);
                                setIsCircleVideoPlaying(false);
                                setIsFilterDropdownOpen(false);
                              }}
                              className={cn(
                                'theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
                                isActive ? 'shadow-xs font-bold' : ''
                              )}
                            >
                              <span>{seg.label}</span>
                              {isActive && <SpringTick active={isActive} />}
                            </button>
                          );
                        })}
                      </SpringDropdownMenu>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sơ đồ hệ thống */}
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTechChimeExpand();
                    setIsEcosystemDiagramOpen(true);
                  }}
                  className="banner-primary-cta h-9 inline-flex items-center gap-1.5 px-3.5 py-0 rounded-full transition-all cursor-pointer typo-button font-play"
                  title={isEn ? 'System Architecture Diagram' : 'Mở Sơ đồ liên kết hệ thống'}
                >
                  <WebIcon name="git-merge" className="w-3.5 h-3.5 text-current shrink-0" />
                  <span>{isEn ? 'Architecture' : 'Sơ đồ hệ thống'}</span>
                </button>

                {/* Chuyển chế độ Lưới / Bảng ma trận */}
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setExpandedBentoId(null);
                    setIsCircleVideoPlaying(false);
                    setViewMode((prev) => (prev === 'grid' ? 'matrix' : 'grid'));
                  }}
                  className="banner-control-pill h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full transition-colors cursor-pointer typo-button font-play"
                  title={
                    viewMode === 'grid'
                      ? isEn
                        ? 'Switch to Matrix Table'
                        : 'Xem bảng ma trận kỹ thuật 12 hệ thống'
                      : isEn
                        ? 'Switch to Card Grid'
                        : 'Quay về lưới 12 thẻ hệ thống'
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <Table className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      <span className="hidden sm:inline">{isEn ? 'Matrix' : 'Ma trận'}</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      <span className="hidden sm:inline">{isEn ? 'Grid' : 'Dạng lưới'}</span>
                    </>
                  )}
                </button>

                {expandedBentoId && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTechChimeCollapse?.();
                      setExpandedBentoId(null);
                    }}
                    className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-button font-play cursor-pointer transition"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Collapse Card' : 'Thu gọn thẻ'}</span>
                  </button>
                )}
              </div>

              {/* Tìm kiếm + Badge số lượng + Video tròn giới thiệu */}
              <div className="flex items-center gap-2 ml-auto shrink-0 max-w-full">
                <div className="relative w-32 sm:w-44 md:w-48">
                  <WebIcon
                    name="search"
                    className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="systems-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (expandedBentoId) setExpandedBentoId(null);
                    }}
                    placeholder={isEn ? 'Search systems...' : 'Tìm hệ thống...'}
                    aria-label={isEn ? 'Search systems' : 'Tìm kiếm hệ thống'}
                    className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-body font-normal font-play focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div
                  id="systems-intro-video-circle-btn"
                  role="button"
                  tabIndex={0}
                  onClick={handleToggleCircleVideo}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleCircleVideo();
                    }
                  }}
                  aria-label={
                    isCircleVideoPlaying
                      ? isEn
                        ? 'Close intro video'
                        : 'Đóng video giới thiệu hệ thống'
                      : isEn
                        ? 'Watch intro video'
                        : 'Xem video giới thiệu hệ thống'
                  }
                  title={
                    isCircleVideoPlaying
                      ? isEn
                        ? 'Close intro video'
                        : 'Đóng video giới thiệu hệ thống'
                      : isEn
                        ? 'Watch intro video'
                        : 'Xem video giới thiệu hệ thống'
                  }
                  className={cn(
                    'video-play-btn video-play-btn--systems relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full aspect-square p-0.5 flex items-center justify-center cursor-pointer transition-all duration-300 group',
                    isCircleVideoPlaying ? 'is-playing ring-4 ring-[var(--color-primary)]/45' : ''
                  )}
                >
                  <div
                    className="relative w-full h-full rounded-full overflow-hidden border"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-card)',
                    }}
                  >
                    <DualLayerVideoPlayer
                      video1Id=""
                      video2Id=""
                      video1Src={SYSTEM_FLOATING_IDLE_VIDEO_URL}
                      video2Src={SYSTEM_FLOATING_INTRO_VIDEO_URL}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      className="absolute inset-0 z-0 pointer-events-none"
                    />
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300',
                        isCircleVideoPlaying
                          ? 'bg-slate-950/45 group-hover:bg-slate-950/60'
                          : 'bg-slate-950/20 group-hover:bg-slate-950/40'
                      )}
                    >
                      <span
                        style={
                          isCircleVideoPlaying
                            ? { background: '#E11D48', borderColor: 'rgba(255,255,255,0.75)' }
                            : {
                                background: 'var(--bg-button-primary)',
                                color: 'var(--text-button-primary, #FFFFFF)',
                                borderColor: 'rgba(255,255,255,0.72)',
                              }
                        }
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 ${
                          isCircleVideoPlaying ? 'text-white' : ''
                        }`}
                      >
                        <WebIcon
                          name={isCircleVideoPlaying ? 'cancel' : 'play'}
                          className={cn(
                            'w-3.5 h-3.5',
                            !isCircleVideoPlaying && 'ml-0.5'
                          )}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          )}

          {/* 2. VÙNG HIỂN THỊ CHÍNH (VIDEO GIỚI THIỆU / BẢNG MA TRẬN / 12 THẺ + FLIP MORPH EXPANSION) */}
          {isCircleVideoPlaying ? (
            <motion.div
              id="systems-intro-video-stage-wrap"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex-1 w-full h-full min-h-0 flex items-stretch justify-center p-0"
            >
              <div
                id="systems-intro-video-stage"
                data-element-type="card"
                data-section-card="true"
                className="bento-card glass-card w-full h-full flex flex-col rounded-[var(--radius-main,14px)] overflow-hidden border-0 shadow-2xl bg-black relative"
                style={{ borderRadius: 'var(--radius-main, 14px)' }}
              >
                <div className="relative w-full h-full flex-1 bg-black rounded-[inherit] overflow-hidden">
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const v = introStageVideoRef.current;
                        if (!v) return;
                        const nextMuted = !v.muted;
                        v.muted = nextMuted;
                        setIsIntroStageMuted(nextMuted);
                        showToast(
                          nextMuted ? 'Đã tắt âm thanh video' : 'Đã bật âm thanh video 🔊'
                        );
                      }}
                      title={isIntroStageMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                      className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                    >
                      <WebIcon
                        name={isIntroStageMuted ? 'volume-x' : 'volume-2'}
                        className="w-4 h-4 text-cyan-300"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseIntroVideo}
                      title="Đóng video và hiện lại 12 thẻ hệ thống"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 backdrop-blur-md border border-white/20 text-white typo-button font-play transition cursor-pointer shadow-md"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Close Video' : 'Đóng video'}</span>
                    </button>
                  </div>

                  <video
                    ref={introStageVideoRef}
                    src={SYSTEM_FLOATING_INTRO_VIDEO_URL}
                    controls={false}
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    muted={isIntroStageMuted}
                    onEnded={() => setIsCircleVideoPlaying(false)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 18%',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      filter: 'contrast(1.08) saturate(1.1) brightness(1.04)',
                    }}
                    className="absolute inset-0 w-full h-full object-cover bg-black rounded-[inherit] banner-video-sharp"
                  />
                </div>
              </div>
            </motion.div>
          ) : filteredSystems.length === 0 ? (
            <div className="theme-muted-surface text-center py-14 px-4 rounded-[14px] backdrop-blur-md flex flex-col items-center justify-center flex-1 shadow-xs">
              <div
                className="w-12 h-12 rounded-[14px] bg-indigo-500/15 flex items-center justify-center mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                <WebIcon name="search" className="w-6 h-6" />
              </div>
              <p
                className="typo-h3 font-play"
                style={{ color: 'var(--text-heading, var(--text-primary))' }}
              >
                {isEn ? 'No matching systems found' : 'Không tìm thấy hệ thống phù hợp'}
              </p>
              <p className="typo-body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {isEn
                  ? 'Try searching CRM, ERP, LMS, AI, or SLA...'
                  : 'Hãy thử nhập từ khóa khác như "CRM", "ERP", "LMS" hoặc "CSKH"...'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                className="mt-4 px-5 py-2 rounded-full typo-button hover:opacity-90 transition cursor-pointer shadow-sm"
              >
                {isEn ? 'Show All 12 Systems' : 'Xem lại tất cả 12 hệ thống'}
              </button>
            </div>
          ) : viewMode === 'matrix' ? (
            /* CHẾ ĐỘ XEM BẢNG MA TRẬN KỸ THUẬT 12 PHÂN HỆ */
            <div className="flex-1 min-h-0 overflow-auto glass-scrollbar no-scrollbar">
              <table className="theme-table w-full text-left border-collapse min-w-[780px] rounded-[14px] overflow-hidden">
                <thead
                  className="sticky top-0 z-20 backdrop-blur-md border-b typo-caption font-semibold font-mono tracking-wider"
                  style={{ borderColor: 'var(--border-table)' }}
                >
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">{isEn ? 'System' : 'Phân hệ'}</th>
                    <th className="py-2.5 px-2.5 font-semibold">{isEn ? 'Group' : 'Nhóm'}</th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-sky-500" />
                        <span>{isEn ? 'Database' : 'Cơ sở dữ liệu'}</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Network className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{isEn ? 'API Protocol' : 'Giao thức API'}</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold">SLA</th>
                    <th className="py-2.5 px-2.5 font-semibold">ISO 27001</th>
                    <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'Portal' : 'Truy cập'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y typo-body-sm" style={{ borderColor: 'var(--border-table)' }}>
                  {filteredSystems.map((item) => {
                    const meta = SYSTEM_DESIGN_MAP[item.id] || SYSTEM_DESIGN_MAP.sdp;
                    const tech = SYSTEM_TECH_SPECS_MAP[item.id] || SYSTEM_TECH_SPECS_MAP.sdp;
                    const accent = getAccentColor(item.id);
                    return (
                      <tr
                        key={item.id}
                        tabIndex={0}
                        onClick={() => selectAndScrollSystem(item.id)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectAndScrollSystem(item.id);
                          }
                        }}
                        className="hover:bg-sky-500/10 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <WebIcon
                              name={meta.iconName}
                              className="w-[18px] h-[18px] shrink-0"
                              style={{ color: accent }}
                            />
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="px-1.5 py-0.5 rounded typo-badge font-mono font-bold"
                                style={{
                                  background: isLight ? meta.tintBgLight : meta.tintBgDark,
                                  color: accent,
                                }}
                              >
                                {item.abbr}
                              </span>
                              <span className="font-semibold text-[var(--text-primary)] truncate">
                                {isEn ? item.nameEn : item.nameVi}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className="px-2 py-0.5 rounded-full typo-badge border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)]">
                            {isEn ? tech.ecosystemLabelEn : tech.ecosystemLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 font-mono typo-caption font-semibold text-[var(--text-primary)]">
                          {tech.database}
                        </td>
                        <td className="py-2.5 px-2.5 font-mono typo-caption font-semibold text-[var(--color-primary)]">
                          {tech.apiProtocol}
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className="px-2 py-0.5 rounded-full typo-badge font-mono bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {tech.slaCommitment}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 typo-caption font-semibold text-[var(--text-primary)]">
                          {tech.isoSecurity}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {item.url ? (
                            <button
                              type="button"
                              onClick={(e) => handleOpenExternalUrl(e, item.url)}
                              className="px-3 py-1 rounded-full typo-badge text-white inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
                              style={{ background: meta.gradient }}
                            >
                              <span>Live</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="typo-badge text-amber-600 dark:text-amber-300 font-semibold">
                              {isEn ? 'Integrating' : 'Đang tích hợp'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* LƯỚI BENTO STUDIO 12 THẺ HỆ THỐNG (TÍCH HỢP CHI TIẾT VÀO THẺ + BUNG RỘNG BẰNG 6 THẺ CỘNG LẠI) */
            <LayoutGroup id="systems-bento-layout-group">
              <div
                id="systems-cards-wrapper"
                ref={cardsWrapperRef}
                className="relative w-full flex flex-col"
              >
                <div
                  id="systems-cards-grid"
                  ref={cardsGridRef}
                  data-system-bento-grid="true"
                  data-card-layout="responsive-grid"
                  data-card-shape="horizontal-rect"
                  style={
                    gridCols >= 2 && baseCardHeight > 0
                      ? { gridAutoRows: `${baseCardHeight}px` }
                      : undefined
                  }
                  className="unified-cards-grid systems-cards-grid systems-responsive-grid sys-bento-studio-grid card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-dense items-stretch w-full min-w-0"
                >
                  {filteredSystems.map((item) => (
                    <SystemBentoCard
                      key={item.id}
                      sys={item}
                      allSystems={orderedAllSystems}
                      isEn={isEn}
                      isExpanded={expandedBentoId === item.id}
                      hasAnyExpanded={Boolean(expandedBentoId)}
                      expandedSixCardHeight={expandedSixCardHeight}
                      onToggleExpand={handleToggleBentoCard}
                      onCollapse={handleCollapseBentoCard}
                      onSelectSystem={selectAndScrollSystem}
                      onOpenDiagram={() => setIsEcosystemDiagramOpen(true)}
                      showToast={showToast}
                      cardRef={(el) => {
                        cardRefs.current[item.id] = el;
                      }}
                    />
                  ))}
                </div>
              </div>
            </LayoutGroup>
          )}
          </div>
        </div>
      </div>

      {/* SƠ ĐỒ LIÊN KẾT HỆ THỐNG MODAL */}
      <EcosystemDiagramModal
        isOpen={isEcosystemDiagramOpen}
        onClose={() => setIsEcosystemDiagramOpen(false)}
        onShowNotification={showToast}
      />
    </div>
  );
};

export default SystemsView;
