'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
import {
  ABOUT_PROFILE_STATS,
  SERVICE_PHILOSOPHY_VALUES,
} from '@/data/aboutData';
import { DOMAINS_DATA } from '@/data/domains';
import { POWER_SYSTEMS_12 } from '@/data/systemsData';
import { DRIVE_AVATARS, driveVideoUrl } from '@/config/driveMediaLinks';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';
import { getCardStyleConfig, normalizeCardStyle } from '@/config/ui/cardStyles';

export interface HomeViewProps {
  slideIndex?: number;
  currentTheme?: SiteTheme;
  onNavigateContact: () => void;
  onNavigatePage?: (pageIndex: number) => void;
  onOpenPagesCarousel?: () => void;
  onShowNotification?: (msg: string) => void;
}

export type HomeScreenId = 1 | 2 | 3;

// Video 1 Trang chủ: Phong Thái Lãnh Đạo & Tầm Nhìn (Auto Play, Loop vòng lặp, mặc định Mute)
export const HOME_VIDEO_1_ID = '1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp';
export const HOME_VIDEO_1_SRC =
  'https://cdn.scena.ai/project/10169/eae59f7007421658e611c298c206755ca060c878d07087694c06935208b9d8f9.mp4';

// Video 2 Trang chủ (từ tài nguyên dự án): Giới thiệu & Chuyển tiếp Màn hình 2
export const HOME_VIDEO_2_ID = '12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm';
export const HOME_VIDEO_2_TRANSITION_ID = '11FZeENhRMILyUrG-em1DIWPyx2zVdc9d';

export interface VideoScreenItem {
  id: HomeScreenId;
  label: string;
  badge: string;
  title: string;
  description: string;
  accentColor: string;
  heroBadge: string;
  heroIcon: string;
}

const DOMAIN_QUICK_HIGHLIGHTS = [
  { id: '01', icon: 'tower', color: '#0284c7', metric: 'SLA >98% · CSAT 96,5%' },
  { id: '02', icon: 'shopping-cart', color: '#ea580c', metric: 'CSAT 88% → 96,5%' },
  { id: '03', icon: 'shield-check', color: '#e11d48', metric: 'FCR >92% · -45% TG' },
  { id: '04', icon: 'game', color: '#7c3aed', metric: '>50.000/ngày · 96%' },
  { id: '05', icon: 'credit-card', color: '#4338ca', metric: 'RPA 90s · CSAT 98,2%' },
  { id: '06', icon: 'layers', color: '#059669', metric: '+40% Hiệu suất' },
];

const FEATURED_ENTERPRISE_PILLS = [
  { key: '2003', name: 'MobiFone', tenure: '2003–2007', role: 'Nhân viên CSKH' },
  { key: '2007', name: 'Viễn Liên V247', tenure: '2007–2011', role: 'Giám sát CSKH' },
  { key: '2011', name: 'LBC · HTVC', tenure: '2011–2013', role: 'Trưởng phòng CSKH' },
  { key: '2013', name: 'Vietnam eSport · Garena · Shopee', tenure: '2013–2016', role: 'Trưởng phòng cấp cao' },
  { key: '2016', name: 'Prudential VN', tenure: '2016–2018', role: 'Trưởng phòng Call Center' },
  { key: '2018', name: 'Mservice · Ví MoMo', tenure: '2018–2023', role: 'Trưởng phòng cấp cao' },
  { key: '2023', name: 'Công nghệ Finviet', tenure: '2023–2025', role: 'Trưởng phòng CSKH' },
  { key: '2026', name: 'Power Service', tenure: '2026+', role: 'Tư vấn Chiến lược CX' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  slideIndex,
  currentTheme = 'liquid-glass',
  onNavigateContact,
  onNavigatePage,
  onShowNotification,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const homeContainerRef = useRef<HTMLDivElement | null>(null);
  const activeScreenRef = useRef<HomeScreenId>(1);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const hasInitializedScrollRef = useRef<boolean>(false);
  const touchSwipeRef = useRef<{
    x: number;
    y: number;
    lastX: number;
    time: number;
    isHorizontal: boolean;
  } | null>(null);

  const isDark = themeIsDark || getCardStyleConfig(normalizeCardStyle(currentTheme)).isDark;

  const [showCircleVideo, setShowCircleVideo] = useState<boolean>(false);
  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

  // 3 màn hình trang chủ sử dụng 100% dữ liệu thực tế từ hồ sơ
  const VIDEO_SCREENS: VideoScreenItem[] = [
    {
      id: 1,
      label: isEn ? 'Screen 1' : 'Màn hình 1',
      badge: isEn ? 'Overview' : 'Tổng quan',
      title: isEn ? 'Leadership Presence & Vision' : 'Phong Thái Lãnh Đạo & Tầm Nhìn',
      description: isEn
        ? 'Executive presence in premier customer experience management'
        : 'Phong thái chuyên gia quản trị trải nghiệm khách hàng cao cấp',
      accentColor: '#38BDF8',
      heroBadge: isEn ? 'Leadership Vision' : 'Tầm Nhìn Lãnh Đạo',
      heroIcon: 'target',
    },
    {
      id: 2,
      label: isEn ? 'Screen 2' : 'Màn hình 2',
      badge: isEn ? 'Impact & Domains' : 'Thành tựu & Lĩnh vực',
      title: isEn ? 'Executive Metrics & 6 Core Domains' : 'Thành Tựu Thực Chiến & 6 Lĩnh Vực',
      description: isEn
        ? '22+ years of measurable CX KPIs across 6 core service sectors'
        : 'Hơn 22 năm chỉ số thực chiến và 6 lĩnh vực chuyên môn trọng điểm',
      accentColor: '#6366F1',
      heroBadge: isEn ? '6 Core Domains' : '6 Lĩnh Vực Trọng Tâm',
      heroIcon: 'layers',
    },
    {
      id: 3,
      label: isEn ? 'Screen 3' : 'Màn hình 3',
      badge: isEn ? 'Ecosystem' : 'Triết lý & Hệ sinh thái',
      title: isEn ? 'Service Philosophy & Power Service' : 'Triết Lý Phục Vụ & Hệ Sinh Thái',
      description: isEn
        ? 'Effective – Human-centric – Sustainable · 8 Enterprises · 12 Systems'
        : 'Hiệu quả – Nhân văn – Bền vững · 8 Môi trường · 12 Hệ thống',
      accentColor: '#10B981',
      heroBadge: isEn ? 'Power Service Ecosystem' : 'Hệ Sinh Thái Vận Hành',
      heroIcon: 'server',
    },
  ];

  const [activeVideoScreen, setActiveVideoScreen] = useState<HomeScreenId>(1);

  // Đo kích thước khung nhìn & container để căn giữa 1 Main Card / màn hình và đồng bộ chuẩn 100% bằng header
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [homeContainerWidth, setHomeContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [exactHeaderWidth, setExactHeaderWidth] = useState<number>(0);

  useEffect(() => {
    const container = homeContainerRef.current;
    const updateWidths = () => {
      const headerEl = document.getElementById('app-header');
      if (headerEl) {
        const w = headerEl.getBoundingClientRect().width;
        if (w > 0) {
          setExactHeaderWidth(w);
        }
      }
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      if (container) {
        setHomeContainerWidth(container.clientWidth || window.innerWidth);
      }
    };
    updateWidths();
    const headerEl = document.getElementById('app-header');
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro) {
      if (container) ro.observe(container);
      if (headerEl) ro.observe(headerEl);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateWidths);
    };
  }, []);

  const peekReserve = viewportWidth <= 1023 ? 32 : 112;
  const fallbackWidth = Math.min(1250, Math.max(260, viewportWidth - peekReserve));
  const homeCardWidth = exactHeaderWidth > 0 ? exactHeaderWidth : fallbackWidth;
  const homeSideInset = Math.max(0, (homeContainerWidth - homeCardWidth) / 2);

  const getCenteredScrollLeftForCard = useCallback(
    (screenId: HomeScreenId) => {
      const container = homeContainerRef.current;
      if (!container) return 0;
      const cardEl = document.getElementById(`home-main-card-${screenId}`);
      if (!cardEl) return 0;
      const headerEl = document.getElementById('app-header');
      const containerRect = container.getBoundingClientRect();
      const headerRect = headerEl?.getBoundingClientRect();
      const desiredCenterX =
        headerRect && headerRect.width > 0
          ? headerRect.left + headerRect.width / 2
          : containerRect.left + container.clientLeft + container.clientWidth / 2;
      const desiredLeftInContainer =
        desiredCenterX - (containerRect.left + container.clientLeft) - cardEl.offsetWidth / 2;
      return Math.max(0, Math.round(cardEl.offsetLeft - desiredLeftInContainer));
    },
    []
  );

  const scrollToHomeCard = useCallback(
    (targetId: HomeScreenId, smooth = true) => {
      activeScreenRef.current = targetId;
      setActiveVideoScreen(targetId);
      const container = homeContainerRef.current;
      if (!container) return;
      const targetLeft = getCenteredScrollLeftForCard(targetId);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      isProgrammaticScrollRef.current = true;
      if (smooth) {
        container.scrollTo({
          left: targetLeft,
          behavior: 'smooth',
        });
      } else {
        container.scrollLeft = targetLeft;
      }
      scrollTimeoutRef.current = window.setTimeout(
        () => {
          const settledLeft = getCenteredScrollLeftForCard(targetId);
          if (Math.abs(container.scrollLeft - settledLeft) > 1) {
            container.scrollLeft = settledLeft;
          }
          isProgrammaticScrollRef.current = false;
          evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
        },
        smooth ? 520 : 60
      );
    },
    [getCenteredScrollLeftForCard]
  );

  useLayoutEffect(() => {
    if (!hasInitializedScrollRef.current && homeContainerWidth > 0) {
      hasInitializedScrollRef.current = true;
      const initialId: HomeScreenId =
        slideIndex === 1 ? 2 : slideIndex === 2 ? 3 : 1;
      scrollToHomeCard(initialId, false);
    }
  }, [homeContainerWidth, scrollToHomeCard, slideIndex]);

  useEffect(() => {
    const container = homeContainerRef.current;
    if (!container || isProgrammaticScrollRef.current) return;
    const raf = requestAnimationFrame(() => {
      const expectedLeft = getCenteredScrollLeftForCard(activeScreenRef.current);
      if (Math.abs(container.scrollLeft - expectedLeft) > 1) {
        container.scrollLeft = expectedLeft;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [homeCardWidth, homeContainerWidth, getCenteredScrollLeftForCard]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 0, slide: activeVideoScreen - 1 },
      })
    );
  }, [activeVideoScreen]);

  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (
        detail &&
        (detail.tabIndex === undefined || detail.tabIndex === 0) &&
        typeof detail.slide === 'number'
      ) {
        const clamped = Math.max(0, Math.min(2, detail.slide)) + 1;
        scrollToHomeCard(clamped as HomeScreenId, true);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [scrollToHomeCard]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleSelectScreen = useCallback(
    (nextScreenId: HomeScreenId) => {
      if (nextScreenId === activeScreenRef.current) {
        return;
      }
      SoundEngine.playGlassChime();
      scrollToHomeCard(nextScreenId, true);
      const target = VIDEO_SCREENS.find((s) => s.id === nextScreenId);
      if (target) {
        showToast(
          isEn
            ? `Switching to ${target.label} · ${target.title}`
            : `Đang chuyển sang ${target.label} · ${target.title}`
        );
      }
    },
    [scrollToHomeCard, showToast, isEn, VIDEO_SCREENS]
  );

  const handleHomeContainerScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const container = homeContainerRef.current;
    if (!container) return;

    const currentScroll = container.scrollLeft;
    let closestId: HomeScreenId = 1;
    let minDiff = Infinity;
    ([1, 2, 3] as HomeScreenId[]).forEach((id) => {
      const diff = Math.abs(currentScroll - getCenteredScrollLeftForCard(id));
      if (diff < minDiff) {
        minDiff = diff;
        closestId = id;
      }
    });

    if (closestId !== activeScreenRef.current) {
      activeScreenRef.current = closestId;
      setActiveVideoScreen(closestId);
    }
  }, [getCenteredScrollLeftForCard]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchSwipeRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        lastX: touch.clientX,
        time: Date.now(),
        isHorizontal: false,
      };
    },
    []
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const state = touchSwipeRef.current;
    if (!state || e.touches.length !== 1) return;
    const touch = e.touches[0];
    state.lastX = touch.clientX;
    const dx = touch.clientX - state.x;
    const dy = touch.clientY - state.y;
    if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      state.isHorizontal = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const state = touchSwipeRef.current;
    touchSwipeRef.current = null;
    if (!state || !state.isHorizontal) return;
    const dx = state.lastX - state.x;
    if (Math.abs(dx) < 42) return;
    const current = activeScreenRef.current;
    if (dx < 0 && current < 3) {
      handleSelectScreen((current + 1) as HomeScreenId);
    } else if (dx > 0 && current > 1) {
      handleSelectScreen((current - 1) as HomeScreenId);
    }
  }, [handleSelectScreen]);

  const handleQuickNavigateAbout = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPageFlip();
    onNavigatePage?.(2);
  };

  const handleQuickNavigateContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPageFlip();
    onNavigateContact();
  };

  const handleQuickNavigatePdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playTap();
    onNavigatePage?.(16);
    onShowNotification?.(
      isEn ? 'Opening CV Resume PDF preview' : 'Đang mở bản xem trước Hồ sơ CV PDF'
    );
  };

  const contactSocialLinks: Array<{
    id: string;
    icon: string;
    label: string;
    href?: string;
    external?: boolean;
    onClick?: (e: React.MouseEvent) => void;
  }> = [
    {
      id: 'home-social-email',
      icon: 'mail',
      label: 'Email · hungthai84@gmail.com',
      href: 'mailto:hungthai84@gmail.com',
    },
    {
      id: 'home-social-phone',
      icon: 'phone',
      label: 'Zalo & Điện thoại · +84 0909097882',
      href: 'https://zalo.me/0909097882',
      external: true,
    },
    {
      id: 'home-social-linkedin',
      icon: 'linkedin',
      label: 'LinkedIn · linkedin.com/in/hungthai84',
      href: 'https://www.linkedin.com/in/hungthai84/',
      external: true,
    },
    {
      id: 'home-social-website',
      icon: 'globe',
      label: 'Website · nguyenhungthai.powerservice.one',
      href: 'https://nguyenhungthai.powerservice.one/',
      external: true,
    },
    {
      id: 'home-social-pdf',
      icon: 'file-text',
      label: isEn ? 'Download CV Resume PDF' : 'Xem & Tải Hồ sơ CV PDF',
      onClick: handleQuickNavigatePdf,
    },
  ];

  // Nền aurora pastel dịu nhẹ tái sử dụng giữa 3 màn hình Trang chủ
  const renderAuroraLayer = () => (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div
        className="absolute -left-24 -top-24 w-[360px] h-[360px] rounded-full blur-[72px] opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, rgba(168, 85, 247, 0.14) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(244, 114, 182, 0.34) 0%, rgba(192, 132, 252, 0.22) 48%, transparent 76%)',
        }}
      />
      <div
        className="absolute right-[-60px] top-[15%] w-[380px] h-[380px] rounded-full blur-[80px] opacity-55"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(99, 102, 241, 0.12) 55%, transparent 78%)'
            : 'radial-gradient(circle, rgba(196, 181, 253, 0.34) 0%, rgba(147, 197, 253, 0.22) 52%, transparent 78%)',
        }}
      />
      <div
        className="absolute left-[38%] -bottom-24 w-[320px] h-[260px] rounded-full blur-[70px] opacity-50"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, transparent 75%)'
            : 'radial-gradient(circle, rgba(254, 215, 170, 0.32) 0%, rgba(251, 207, 232, 0.18) 55%, transparent 78%)',
        }}
      />
    </div>
  );

  // Nút chuyển nhanh sang màn hình kế tiếp / trước đó ngay trong mỗi thẻ màn hình
  const renderScreenHeaderBar = (screen: VideoScreenItem) => (
    <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-subcard)] shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-badge font-bold shrink-0"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.72)',
            borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.9)',
            color: screen.accentColor,
          }}
        >
          <WebIcon name={screen.heroIcon} className="w-3.5 h-3.5 shrink-0" />
          <span>{screen.label} · {screen.heroBadge}</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          disabled={screen.id <= 1}
          onClick={(e) => {
            e.stopPropagation();
            if (screen.id > 1) handleSelectScreen((screen.id - 1) as HomeScreenId);
          }}
          aria-label={isEn ? 'Previous home screen' : 'Màn hình Trang chủ trước'}
          className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)]/80 text-[var(--text-primary)] inline-flex items-center justify-center transition hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
        >
          <WebIcon name="chevron-left" className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={screen.id >= 3}
          onClick={(e) => {
            e.stopPropagation();
            if (screen.id < 3) handleSelectScreen((screen.id + 1) as HomeScreenId);
          }}
          aria-label={isEn ? 'Next home screen' : 'Màn hình Trang chủ tiếp theo'}
          className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)]/80 text-[var(--text-primary)] inline-flex items-center justify-center transition hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
        >
          <WebIcon name="chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-full min-w-0 min-h-0 h-full flex-1 flex flex-col overflow-hidden">
      {/* Khung chứa 3 Main Card Trang Chủ */}
      <div
        ref={homeContainerRef}
        id="home-page-container"
        data-element-name="Trang chủ cá nhân"
        data-element-type="container"
        data-element-page="home"
        data-element-parent="global-content-viewport"
        data-no-wheel-horizontal="true"
        onScroll={handleHomeContainerScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        suppressHydrationWarning
        style={{
          touchAction: 'pan-y',
          ['--about-card-w' as any]: `${homeCardWidth}px`,
          ['--about-side-inset' as any]: `${homeSideInset}px`,
        }}
        className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-hidden overflow-y-hidden no-scrollbar select-none font-play rounded-none box-border"
      >
        <div
          id="home-cards-track"
          data-element-name="Track căn giữa Trang chủ"
          data-element-type="container"
          data-element-page="home"
          data-element-parent="home-page-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
            height: '100%',
            minHeight: '100%',
            width: 'max-content',
            paddingLeft: `${homeSideInset}px`,
            paddingRight: `${homeSideInset}px`,
            boxSizing: 'border-box',
          }}
          className="page-cards-track flex flex-row items-stretch justify-start gap-[15px] h-full min-h-full box-border"
        >
          {VIDEO_SCREENS.map((screen) => {
            const isActive = activeVideoScreen === screen.id;

            return (
              <div
                key={screen.id}
                id={`home-main-card-${screen.id}`}
                data-main-card="true"
                data-element-name={`Thẻ chính Trang chủ - ${screen.label}`}
                data-element-type="card"
                data-element-page="home"
                data-element-parent="home-cards-track"
                onClickCapture={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectScreen(screen.id);
                  }
                }}
                style={{
                  width: `${homeCardWidth}px`,
                  maxWidth: '1250px',
                  minWidth: `${homeCardWidth}px`,
                  flex: `0 0 ${homeCardWidth}px`,
                  height: '100%',
                  minHeight: '100%',
                  padding: 'var(--main-card-padding, 15px)',
                  gap: '15px',
                  borderRadius: 'var(--radius-main, 30px)',
                }}
                className={cn(
                  'page-main-card home-screen-main-card relative shrink-0 h-full min-h-full flex flex-col justify-between overflow-hidden select-none font-play box-border transition-opacity duration-300',
                  isActive ? 'opacity-100' : 'opacity-85 cursor-pointer'
                )}
              >
                {/* MÀN HÌNH 1: HERO SPLIT CHÂN DUNG & VIDEO PHONG THÁI LÃNH ĐẠO */}
                {screen.id === 1 && (
                  <div
                    id="home-hero-stage-1"
                    data-section-card="true"
                    data-element-name="Card chính Trang chủ 2 cột ngang"
                    data-element-type="card"
                    data-element-page="home"
                    data-element-parent="home-main-card-1"
                    className="bento-card glass-card home-split-hero-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-center overflow-y-auto md:overflow-hidden rounded-[var(--radius-card,24px)] box-border text-left !p-0"
                    style={{ borderRadius: 'var(--radius-card, 24px)' }}
                  >
                    {renderAuroraLayer()}

                    {/* Lưới 2 chiều ngang chuẩn responsive */}
                    <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 lg:gap-10 px-6 py-6 sm:px-9 sm:py-8 lg:px-14 lg:py-10">
                      {/* Cột Trái: Tiêu đề chính, giới thiệu, 2 nút CTA ngang & dãy icon liên kết */}
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-7 flex flex-col justify-center items-start gap-4 sm:gap-5 min-w-0 order-2 md:order-1"
                      >
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border typo-badge font-semibold"
                          style={{
                            background: isDark
                              ? 'rgba(255, 255, 255, 0.08)'
                              : 'rgba(255, 255, 255, 0.65)',
                            borderColor: isDark
                              ? 'rgba(255, 255, 255, 0.16)'
                              : 'rgba(255, 255, 255, 0.85)',
                            color: 'var(--text-link, var(--color-primary))',
                          }}
                        >
                          <WebIcon name="award" className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isEn
                              ? '22+ Years · CX & Contact Center Leader'
                              : '22+ Năm Thực Chiến · Chuyên Gia CSKH & CX'}
                          </span>
                        </div>

                        <div className="space-y-1.5 max-w-xl">
                          <h1
                            id="home-hero-heading"
                            className="font-play font-extrabold tracking-tight leading-[1.12] text-[clamp(1.75rem,3.6vw,3.15rem)]"
                            style={{ color: 'var(--text-heading, var(--text-primary))' }}
                          >
                            <span className="block">Nguyễn Hùng Thái</span>
                            <span
                              className="block mt-0.5 text-[clamp(1.25rem,2.4vw,2.15rem)] font-bold"
                              style={{ color: 'var(--text-link, var(--color-primary))' }}
                            >
                              {isEn
                                ? 'Customer Experience & Digital Transformation'
                                : 'Vận Hành CSKH & Chuyển Đổi Số'}
                            </span>
                          </h1>
                        </div>

                        <p
                          className="typo-body leading-relaxed max-w-lg font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {isEn
                            ? 'Over 22 years designing, standardizing, and leading large-scale Contact Center & omnichannel CRM operations across telecom, e-commerce, finance, and fintech. Effective – Human-centric – Sustainable.'
                            : 'Hơn 22 năm kinh nghiệm thực chiến kiến tạo, chuẩn hóa quy trình và điều hành hệ thống Contact Center quy mô lớn tại các doanh nghiệp hàng đầu. Hiệu quả – Nhân văn – Bền vững.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                          <button
                            id="home-hero-cta-primary"
                            type="button"
                            onClick={handleQuickNavigateAbout}
                            onMouseEnter={() => SoundEngine.playTap()}
                            style={{
                              background: 'var(--bg-button-primary, linear-gradient(135deg, #3B66F5, #2563EB))',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }}
                            className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-[14px] font-bold typo-button shadow-[0_10px_24px_rgba(37,99,235,0.28)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                          >
                            <WebIcon name="user-round" className="w-4 h-4 shrink-0" />
                            <span>{isEn ? 'Explore Profile' : 'Hồ Sơ Năng Lực'}</span>
                          </button>

                          <button
                            id="home-hero-cta-secondary"
                            type="button"
                            onClick={handleQuickNavigateContact}
                            onMouseEnter={() => SoundEngine.playTap()}
                            style={{
                              background: isDark
                                ? 'rgba(255, 255, 255, 0.10)'
                                : 'rgba(255, 255, 255, 0.92)',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.22)'
                                : 'rgba(255, 255, 255, 0.98)',
                              color: 'var(--text-heading, var(--text-primary))',
                            }}
                            className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-[14px] border font-bold typo-button shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                          >
                            <WebIcon
                              name="mail"
                              className="w-4 h-4 shrink-0"
                              style={{ color: 'var(--text-link, var(--color-primary))' }}
                            />
                            <span>{isEn ? 'Contact & Booking' : 'Liên Hệ Ngay'}</span>
                          </button>

                          <button
                            id="home-hero-cta-screen2"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectScreen(2);
                            }}
                            style={{
                              background: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(224, 242, 254, 0.85)',
                              borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(14, 165, 233, 0.28)',
                              color: 'var(--text-link, var(--color-primary))',
                            }}
                            className="min-h-[44px] px-4 py-2.5 rounded-[14px] border font-bold typo-button hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{isEn ? 'Screen 2' : 'Màn hình 2'}</span>
                            <WebIcon name="arrow-right" className="w-4 h-4 shrink-0" />
                          </button>
                        </div>

                        <div
                          className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-3 sm:pt-5"
                          aria-label={isEn ? 'Quick contact links' : 'Kênh kết nối nhanh'}
                        >
                          {contactSocialLinks.map((item) => {
                            const sharedClasses =
                              'w-9 h-9 rounded-full inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer border';
                            const sharedStyle: React.CSSProperties = {
                              background: isDark
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(255, 255, 255, 0.56)',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.16)'
                                : 'rgba(255, 255, 255, 0.85)',
                              color: 'var(--text-heading, var(--text-primary))',
                            };

                            if (item.href) {
                              return (
                                <a
                                  key={item.id}
                                  id={item.id}
                                  href={item.href}
                                  target={item.external ? '_blank' : undefined}
                                  rel={item.external ? 'noopener noreferrer' : undefined}
                                  aria-label={item.label}
                                  title={item.label}
                                  onClick={() => SoundEngine.playTap()}
                                  className={sharedClasses}
                                  style={sharedStyle}
                                >
                                  <WebIcon name={item.icon} className="w-[17px] h-[17px]" />
                                </a>
                              );
                            }

                            return (
                              <button
                                key={item.id}
                                id={item.id}
                                type="button"
                                aria-label={item.label}
                                title={item.label}
                                onClick={item.onClick}
                                className={sharedClasses}
                                style={sharedStyle}
                              >
                                <WebIcon name={item.icon} className="w-[17px] h-[17px]" />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Cột Phải: Khung chân dung vòng tròn đồng tâm */}
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-5 flex items-center justify-center order-1 md:order-2 py-2"
                      >
                        <div className="relative flex items-center justify-center w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] md:w-[295px] md:h-[295px] lg:w-[350px] lg:h-[350px] xl:w-[380px] xl:h-[380px] shrink-0">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full border-[1.5px] pointer-events-none"
                            style={{
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.24)'
                                : 'rgba(255, 255, 255, 0.88)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-[8px] sm:inset-[10px] rounded-full border-[1.5px] pointer-events-none"
                            style={{
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.16)'
                                : 'rgba(255, 255, 255, 0.72)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-2.5 top-[48%] w-5 h-5 sm:w-7 sm:h-7 rounded-full blur-[5px]"
                            style={{
                              background: isDark
                                ? 'rgba(244, 114, 182, 0.55)'
                                : 'rgba(244, 114, 182, 0.65)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-2 top-[34%] w-6 h-6 sm:w-8 sm:h-8 rounded-full blur-[6px]"
                            style={{
                              background: isDark
                                ? 'rgba(96, 165, 250, 0.55)'
                                : 'rgba(59, 130, 246, 0.62)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[24%] -bottom-4 sm:-bottom-5 w-4 h-4 sm:w-5 sm:h-5 rounded-full opacity-80"
                            style={{
                              background: isDark
                                ? 'rgba(251, 113, 133, 0.65)'
                                : 'rgba(253, 164, 175, 0.88)',
                            }}
                          />

                          <div
                            className="relative w-[calc(100%-34px)] h-[calc(100%-34px)] sm:w-[calc(100%-42px)] sm:h-[calc(100%-42px)] rounded-full overflow-hidden flex items-center justify-center shadow-[0_20px_48px_rgba(15,23,42,0.18)]"
                            style={{
                              background: isDark
                                ? 'linear-gradient(145deg, rgba(30,41,59,0.72), rgba(51,65,85,0.45))'
                                : 'linear-gradient(145deg, rgba(255,255,255,0.75), rgba(238,242,255,0.58))',
                              border: isDark
                                ? '2px solid rgba(255, 255, 255, 0.22)'
                                : '2px solid rgba(255, 255, 255, 0.92)',
                            }}
                          >
                            {showCircleVideo ? (
                              <DualLayerVideoPlayer
                                video1Id={HOME_VIDEO_1_ID}
                                video1Src={HOME_VIDEO_1_SRC}
                                video2Id={HOME_VIDEO_2_ID}
                                video2Src={driveVideoUrl(HOME_VIDEO_2_ID)}
                                autoPlayVideo1={true}
                                muteVideo1={true}
                                loopVideo1={true}
                                capsuleVariant="home"
                                className="absolute inset-0 z-0 pointer-events-auto"
                              />
                            ) : !avatarLoadError ? (
                              <img
                                src={DRIVE_AVATARS.hungThai}
                                alt="Nguyễn Hùng Thái - Chuyên gia vận hành CSKH & CX"
                                referrerPolicy="no-referrer"
                                loading="eager"
                                decoding="async"
                                onError={() => setAvatarLoadError(true)}
                                className="w-full h-full object-cover object-top select-none"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <WebIcon
                                  name="user-round"
                                  className="w-14 h-14"
                                  style={{ color: 'var(--color-primary)' }}
                                />
                                <span
                                  className="typo-caption font-bold"
                                  style={{ color: 'var(--text-heading)' }}
                                >
                                  Nguyễn Hùng Thái
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            id="home-hero-media-toggle-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playTap();
                              setShowCircleVideo((prev) => !prev);
                            }}
                            title={
                              showCircleVideo
                                ? isEn
                                  ? 'Switch back to Portrait'
                                  : 'Quay lại ảnh chân dung'
                                : isEn
                                  ? 'Watch Leadership Vision Video'
                                  : 'Xem Video Phong Thái Lãnh Đạo'
                            }
                            aria-label={
                              showCircleVideo
                                ? isEn
                                  ? 'Switch to portrait'
                                  : 'Chuyển sang ảnh chân dung'
                                : isEn
                                  ? 'Play leadership video'
                                  : 'Phát video phong thái lãnh đạo'
                            }
                            style={{
                              background: isDark
                                ? 'rgba(15, 23, 42, 0.82)'
                                : 'rgba(255, 255, 255, 0.94)',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.25)'
                                : 'rgba(255, 255, 255, 1)',
                              color: 'var(--text-link, var(--color-primary))',
                            }}
                            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg typo-badge font-bold hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            <WebIcon
                              name={showCircleVideo ? 'image' : 'play'}
                              className="w-3.5 h-3.5 shrink-0"
                            />
                            <span>
                              {showCircleVideo
                                ? isEn
                                  ? 'Portrait'
                                  : 'Chân dung'
                                : 'Video'}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* MÀN HÌNH 2: CHỈ SỐ THỰC CHIẾN, VIDEO GIỚI THIỆU & 6 LĨNH VỰC CHUYÊN SÂU */}
                {screen.id === 2 && (
                  <div
                    id="home-hero-stage-2"
                    data-section-card="true"
                    data-element-name="Màn hình 2 Trang chủ - Thành tựu & 6 Lĩnh vực"
                    data-element-type="card"
                    data-element-page="home"
                    data-element-parent="home-main-card-2"
                    className="bento-card glass-card home-split-hero-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-between gap-4 overflow-y-auto no-scrollbar rounded-[var(--radius-card,24px)] box-border text-left p-4 sm:p-6 lg:p-8"
                    style={{ borderRadius: 'var(--radius-card, 24px)' }}
                  >
                    {renderAuroraLayer()}
                    {renderScreenHeaderBar(screen)}

                    <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch pt-1 pb-6">
                      {/* Cột Trái (7 cột): Tiêu đề, 4 KPI Thực chiến & 6 Lĩnh vực trọng tâm */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-4 min-w-0">
                        <div className="space-y-1.5">
                          <h2
                            className="typo-h2 sm:typo-h1 font-play font-extrabold tracking-tight leading-tight m-0"
                            style={{ color: 'var(--text-heading, var(--text-primary))' }}
                          >
                            {isEn
                              ? 'Proven Performance & 6 Expertise Domains'
                              : 'Chỉ Số Thực Chiến & 6 Lĩnh Vực Trọng Điểm'}
                          </h2>
                          <p
                            className="typo-body-sm leading-relaxed m-0"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {isEn
                              ? 'Verified operational benchmarks across telecom, e-commerce, insurance, gaming, fintech e-wallets, and enterprise CX architecture.'
                              : 'Các cột mốc định lượng đã triển khai trực tiếp trong điều hành Contact Center, kiểm soát rủi ro và chuyển đổi số dịch vụ khách hàng.'}
                          </p>
                        </div>

                        {/* 4 Chỉ số nổi bật từ ABOUT_PROFILE_STATS */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                          {ABOUT_PROFILE_STATS.map((stat) => (
                            <div
                              key={stat.id}
                              data-subcard="true"
                              className="sub-card rounded-[14px] p-3 flex flex-col justify-between gap-1 border border-[var(--border-subcard)]"
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span
                                  className="typo-h3 font-extrabold tabular-nums tracking-tight"
                                  style={{ color: stat.color }}
                                >
                                  {stat.metric}
                                </span>
                                <WebIcon
                                  name={stat.iconName.toLowerCase()}
                                  className="w-4 h-4 shrink-0"
                                  style={{ color: stat.color }}
                                />
                              </div>
                              <div className="typo-caption font-semibold text-[var(--text-primary)] leading-snug">
                                {isEn
                                  ? `${stat.unitEn ? stat.unitEn + ' · ' : ''}${stat.labelEn}`
                                  : `${stat.unitVi ? stat.unitVi + ' · ' : ''}${stat.labelVi}`}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 6 Lĩnh vực từ DOMAINS_DATA */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {DOMAINS_DATA.map((domain) => {
                            const highlight =
                              DOMAIN_QUICK_HIGHLIGHTS.find((h) => h.id === domain.id) ||
                              DOMAIN_QUICK_HIGHLIGHTS[0];
                            return (
                              <button
                                key={domain.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundEngine.playPageFlip();
                                  onNavigatePage?.(4);
                                }}
                                data-subcard="true"
                                className="sub-card text-left rounded-[14px] p-3 border border-[var(--border-subcard)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-1.5 cursor-pointer"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                      background: `${highlight.color}1F`,
                                      color: highlight.color,
                                    }}
                                  >
                                    <WebIcon name={highlight.icon} className="w-4 h-4" />
                                  </span>
                                  <span
                                    className="typo-body-sm font-bold truncate"
                                    style={{ color: 'var(--text-heading, var(--text-primary))' }}
                                  >
                                    {isEn && domain.titleEn ? domain.titleEn : domain.title}
                                  </span>
                                </div>
                                <span
                                  className="typo-caption font-semibold tabular-nums"
                                  style={{ color: highlight.color }}
                                >
                                  {highlight.metric}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cột Phải (5 cột): Video giới thiệu Trang chủ Màn hình 2 & Nút truy cập nhanh */}
                      <div className="lg:col-span-5 flex flex-col justify-between gap-3 min-w-0">
                        <div
                          data-media-card="video"
                          className="relative flex-1 min-h-[210px] rounded-[14px] overflow-hidden border border-[var(--border-subcard)] bg-slate-900"
                        >
                          <DualLayerVideoPlayer
                            video1Id={HOME_VIDEO_2_TRANSITION_ID}
                            video1Src={driveVideoUrl(HOME_VIDEO_2_TRANSITION_ID)}
                            video2Id={HOME_VIDEO_2_ID}
                            video2Src={driveVideoUrl(HOME_VIDEO_2_ID)}
                            autoPlayVideo1={true}
                            muteVideo1={true}
                            loopVideo1={true}
                            capsuleVariant="home"
                            className="w-full h-full z-0"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playPageFlip();
                              onNavigatePage?.(4);
                            }}
                            style={{
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }}
                            className="flex-1 min-w-[140px] min-h-[42px] px-4 py-2 rounded-[14px] typo-button font-bold shadow-md hover:brightness-105 transition inline-flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <WebIcon name="layers" className="w-4 h-4 shrink-0" />
                            <span>{isEn ? 'View 6 Domains' : 'Xem 6 Lĩnh Vực'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playPageFlip();
                              onNavigatePage?.(5);
                            }}
                            className="flex-1 min-w-[140px] min-h-[42px] px-4 py-2 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-primary)] typo-button font-bold hover:border-[var(--color-primary)] transition inline-flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <WebIcon name="briefcase" className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                            <span>{isEn ? 'Career Journey' : 'Hành Trình Sự Nghiệp'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MÀN HÌNH 3: TRIẾT LÝ PHỤC VỤ, 8 DOANH NGHIỆP & HỆ SINH THÁI POWER SERVICE */}
                {screen.id === 3 && (
                  <div
                    id="home-hero-stage-3"
                    data-section-card="true"
                    data-element-name="Màn hình 3 Trang chủ - Triết lý & Hệ sinh thái"
                    data-element-type="card"
                    data-element-page="home"
                    data-element-parent="home-main-card-3"
                    className="bento-card glass-card home-split-hero-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-between gap-4 overflow-y-auto no-scrollbar rounded-[var(--radius-card,24px)] box-border text-left p-4 sm:p-6 lg:p-8"
                    style={{ borderRadius: 'var(--radius-card, 24px)' }}
                  >
                    {renderAuroraLayer()}
                    {renderScreenHeaderBar(screen)}

                    <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between gap-4 pt-1 pb-6">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div className="space-y-1 max-w-2xl">
                          <h2
                            className="typo-h2 sm:typo-h1 font-play font-extrabold tracking-tight leading-tight m-0"
                            style={{ color: 'var(--text-heading, var(--text-primary))' }}
                          >
                            {isEn
                              ? 'Service Philosophy & Power Service Ecosystem'
                              : 'Triết Lý Phục Vụ & Hệ Sinh Thái Điều Hành'}
                          </h2>
                          <p
                            className="typo-body-sm leading-relaxed m-0"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {isEn
                              ? 'Uniting 12 digital management systems, 21 strategic projects, and 22+ years of leadership across leading enterprises.'
                              : 'Kết nối đồng bộ 12 hệ thống quản trị số, 21 dự án trọng điểm và dấu ấn thực chiến tại 8 môi trường doanh nghiệp tiêu biểu.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playPageFlip();
                              onNavigatePage?.(8);
                            }}
                            style={{
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }}
                            className="min-h-[40px] px-4 py-2 rounded-[14px] typo-button font-bold shadow-md hover:brightness-105 transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <WebIcon name="server" className="w-4 h-4 shrink-0" />
                            <span>{isEn ? '12 Systems' : '12 Hệ Thống'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playPageFlip();
                              onNavigatePage?.(7);
                            }}
                            className="min-h-[40px] px-4 py-2 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-primary)] typo-button font-bold hover:border-[var(--color-primary)] transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <WebIcon name="kanban" className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                            <span>{isEn ? '21 Projects' : '21 Dự Án'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 3 Giá trị cốt lõi từ SERVICE_PHILOSOPHY_VALUES */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {SERVICE_PHILOSOPHY_VALUES.map((val, idx) => {
                          const tones = ['#0284c7', '#e11d48', '#059669'];
                          const icons = ['trending-up', 'heart-handshake', 'shield-check'];
                          const color = tones[idx % tones.length];
                          return (
                            <div
                              key={val.id}
                              data-subcard="true"
                              className="sub-card rounded-[14px] p-3.5 border border-[var(--border-subcard)] flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className="typo-h4 font-bold"
                                  style={{ color }}
                                >
                                  {isEn ? val.titleEn : val.titleVi}
                                </span>
                                <WebIcon
                                  name={icons[idx % icons.length]}
                                  className="w-4 h-4 shrink-0"
                                  style={{ color }}
                                />
                              </div>
                              <div className="typo-caption font-semibold text-[var(--text-primary)]">
                                {isEn ? val.subtitleEn : val.subtitleVi}
                              </div>
                              <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed m-0">
                                {isEn ? val.descEn : val.descVi}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dải 8 Doanh nghiệp & Cổng 12 Hệ thống */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                        <div
                          data-subcard="true"
                          className="lg:col-span-7 sub-card rounded-[14px] p-3.5 border border-[var(--border-subcard)] flex flex-col justify-between gap-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="typo-h5 font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5">
                              <WebIcon name="building-2" className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                              <span>{isEn ? '8 Career Environments (2003 – 2026+)' : '8 Môi Trường Công Tác (2003 – 2026+)'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                SoundEngine.playPageFlip();
                                onNavigatePage?.(5);
                              }}
                              className="typo-caption font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
                            >
                              {isEn ? 'Open timeline' : 'Xem chi tiết'}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {FEATURED_ENTERPRISE_PILLS.map((ent) => (
                              <button
                                key={ent.key}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundEngine.playPageFlip();
                                  onNavigatePage?.(5);
                                }}
                                className="rounded-[12px] px-2.5 py-2 border border-[var(--border-subcard)] bg-[var(--bg-card)]/60 hover:border-[var(--color-primary)] transition text-left flex flex-col gap-0.5 cursor-pointer"
                              >
                                <span className="typo-caption font-bold text-[var(--text-primary)] truncate">
                                  {ent.name}
                                </span>
                                <span className="typo-badge font-medium text-[var(--text-secondary)] truncate">
                                  {ent.tenure}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div
                          data-subcard="true"
                          className="lg:col-span-5 sub-card rounded-[14px] p-3.5 border border-[var(--border-subcard)] flex flex-col justify-between gap-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="typo-h5 font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5">
                              <WebIcon name="cpu" className="w-4 h-4" style={{ color: '#059669' }} />
                              <span>{isEn ? 'Power Service Platforms' : 'Nền Tảng Power Service'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                SoundEngine.playTap();
                                onNavigatePage?.(13);
                              }}
                              className="typo-caption font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
                            >
                              {isEn ? 'Ask AI Support' : 'Hỏi AI Hỗ Trợ'}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {POWER_SYSTEMS_12.slice(0, 4).map((sys) => (
                              <button
                                key={sys.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundEngine.playPageFlip();
                                  onNavigatePage?.(8);
                                }}
                                className="rounded-[12px] px-2.5 py-2 border border-[var(--border-subcard)] bg-[var(--bg-card)]/60 hover:border-[var(--color-primary)] transition text-left flex flex-col gap-0.5 cursor-pointer"
                              >
                                <span className="typo-caption font-bold text-[var(--color-primary)]">
                                  {sys.code}
                                </span>
                                <span className="typo-badge font-medium text-[var(--text-secondary)] truncate">
                                  {isEn ? sys.nameEn : sys.nameVi}
                                </span>
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={handleQuickNavigateContact}
                              className="flex-1 min-h-[38px] px-3 py-1.5 rounded-[12px] border border-[var(--border-subcard)] bg-[var(--bg-card)]/80 hover:border-[var(--color-primary)] text-[var(--text-primary)] typo-caption font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <WebIcon name="mail" className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                              <span>{isEn ? 'Contact' : 'Liên hệ trực tiếp'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleQuickNavigatePdf}
                              className="flex-1 min-h-[38px] px-3 py-1.5 rounded-[12px] border border-[var(--border-subcard)] bg-[var(--bg-card)]/80 hover:border-[var(--color-primary)] text-[var(--text-primary)] typo-caption font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <WebIcon name="file-text" className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                              <span>{isEn ? 'Download CV' : 'Tải Hồ sơ PDF'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lớp điều khiển nổi căn theo thẻ chính ở giữa (hiển thị dock chuyển giữa 3 màn hình) */}
      {VIDEO_SCREENS.length > 1 && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-stretch justify-center overflow-hidden">
          <div
            className="relative h-full max-w-full pointer-events-none"
            style={{ width: `${homeCardWidth}px` }}
          >
            <div className="absolute bottom-[22px] left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
              <div
                id="el-p0-div-16"
                data-element-id="el-p0-div-16"
                data-element-name="Thanh chuyển đổi màn hình trang chủ"
                data-element-type="card"
                data-element-page="home"
                className="theme-screen-switcher-dock pointer-events-auto inline-flex items-center gap-1.5 !rounded-[999px] border select-none transition-all duration-300 px-2.5 py-1.5 m-0"
                role="tablist"
                aria-label="Chuyển đổi màn hình trang chủ"
              >
                {VIDEO_SCREENS.map((screen) => {
                  const isActive = activeVideoScreen === screen.id;
                  return (
                    <button
                      key={screen.id}
                      id={`el-p0-screen-btn-${screen.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`${screen.label}: ${screen.title}`}
                      title={`${screen.label} · ${screen.title}`}
                      onClick={() => handleSelectScreen(screen.id)}
                      className={`group relative h-1.5 sm:h-[6px] rounded-full transition-all duration-300 cursor-pointer focus:outline-none select-none ${
                        isActive
                          ? 'w-5 sm:w-6 scale-105 bg-[var(--color-primary,#0284c7)]'
                          : 'w-2.5 sm:w-3 bg-slate-400/55 hover:w-3.5 hover:bg-slate-400/80 active:scale-95'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
