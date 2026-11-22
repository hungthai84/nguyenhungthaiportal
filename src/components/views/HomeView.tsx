'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';

export interface HomeViewProps {
  slideIndex?: number;
  currentTheme?: SiteTheme;
  onNavigateContact: () => void;
  onNavigatePage?: (pageIndex: number) => void;
  onOpenPagesCarousel?: () => void;
  onShowNotification?: (msg: string) => void;
}

export interface VideoScreenItem {
  id: 1 | 2 | 3;
  label: string;
  badge: string;
  title: string;
  description: string;
  accentColor: string;
  heroBadge: string;
  heroIcon: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  slideIndex,
  currentTheme = 'liquid-glass',
  onNavigateContact,
  onNavigatePage,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();

  const homeContainerRef = useRef<HTMLDivElement | null>(null);
  const activeScreenRef = useRef<1 | 2 | 3>(2);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const hasInitializedScrollRef = useRef<boolean>(false);
  const touchSwipeRef = useRef<{
    x: number;
    y: number;
    time: number;
    isHorizontal: boolean;
  } | null>(null);

  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'black-cowhide-leather' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond';

  // Danh sách 3 màn hình trang chủ (dùng chung định dạng Video card Giới thiệu)
  const VIDEO_SCREENS: VideoScreenItem[] = [
    {
      id: 1,
      label: isEn ? 'Screen 1' : 'Màn hình 1',
      badge: 'Video 1',
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
      badge: isEn ? 'Video 2 (Default)' : 'Video 2 (Gốc)',
      title: isEn ? 'Executive Portrait & Greeting' : 'Chân Dung Chuyên Gia & Lời Chào',
      description: isEn
        ? 'Customer Service executive profile with 22+ years of hands-on experience'
        : 'Chân dung điều hành dịch vụ khách hàng 22+ năm kinh nghiệm',
      accentColor: '#F125D6',
      heroBadge: isEn ? 'Senior Executive Profile' : 'Hồ Sơ Lãnh Đạo',
      heroIcon: 'user',
    },
    {
      id: 3,
      label: isEn ? 'Screen 3' : 'Màn hình 3',
      badge: 'Video 3',
      title: isEn ? 'Digital Space & Ecosystem' : 'Không Gian Số Hóa & Hệ Sinh Thái',
      description: isEn
        ? 'Automated technology infrastructure and modern solution architecture'
        : 'Hạ tầng công nghệ tự động hóa và kiến trúc giải pháp hiện đại',
      accentColor: '#10B981',
      heroBadge: isEn ? 'Digital Ecosystem' : 'Hệ Sinh Thái Số',
      heroIcon: 'layers',
    },
  ];

  const initialScreen: 1 | 2 | 3 =
    slideIndex === 0 ? 1 : slideIndex === 2 ? 3 : 2;

  const [activeVideoScreen, setActiveVideoScreen] = useState<1 | 2 | 3>(initialScreen);

  // Đo kích thước khung nhìn & container để căn giữa 1 Main Card / màn hình và hé lộ thẻ kế bên (peek)
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [homeContainerWidth, setHomeContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const container = homeContainerRef.current;
    const updateWidths = () => {
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      if (container) {
        setHomeContainerWidth(container.clientWidth || window.innerWidth);
      }
    };
    updateWidths();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro && container) {
      ro.observe(container);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateWidths);
    };
  }, []);

  const peekReserve = viewportWidth <= 1023 ? 32 : 112;
  const homeCardWidth = Math.min(1250, Math.max(260, viewportWidth - peekReserve));
  const homeSideInset = Math.max(15, (homeContainerWidth - homeCardWidth) / 2);

  const getCenteredScrollLeftForCard = useCallback(
    (screenId: 1 | 2 | 3) => {
      const container = homeContainerRef.current;
      if (!container) return (screenId - 1) * (homeCardWidth + 15);
      const cardEl = document.getElementById(`home-main-card-${screenId}`);
      if (!cardEl) return (screenId - 1) * (homeCardWidth + 15);
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
    [homeCardWidth]
  );

  const scrollToHomeCard = useCallback(
    (targetId: 1 | 2 | 3, smooth = true) => {
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

  // Căn giữa Màn hình mặc định (Màn hình 2) ngay khi mount xong
  useLayoutEffect(() => {
    if (!hasInitializedScrollRef.current && homeContainerWidth > 0) {
      hasInitializedScrollRef.current = true;
      scrollToHomeCard(activeScreenRef.current, false);
    }
  }, [homeContainerWidth, scrollToHomeCard]);

  // Giữ thẻ đang chọn luôn căn giữa thẳng hàng với #app-header khi resize
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

  // Đồng bộ trạng thái màn hình hiện tại với Footer Prev/Next
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 0, slide: activeVideoScreen - 1 },
      })
    );
  }, [activeVideoScreen]);

  // Lắng nghe sự kiện điều hướng slide từ Footer / Header
  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (
        detail &&
        (detail.tabIndex === undefined || detail.tabIndex === 0) &&
        typeof detail.slide === 'number'
      ) {
        const clampedSlide = Math.max(0, Math.min(2, detail.slide));
        const targetId = (clampedSlide + 1) as 1 | 2 | 3;
        scrollToHomeCard(targetId, true);
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
    (nextScreenId: 1 | 2 | 3) => {
      if (nextScreenId === activeScreenRef.current) {
        return;
      }
      SoundEngine.playGlassChime();
      scrollToHomeCard(nextScreenId, true);
      const target = VIDEO_SCREENS[nextScreenId - 1];
      showToast(
        isEn
          ? `Switching to ${target.label} · ${target.title}`
          : `Đang chuyển sang ${target.label} · ${target.title}`
      );
    },
    [scrollToHomeCard, showToast, isEn]
  );

  const handlePrevVideoScreen = useCallback(() => {
    const next = (activeVideoScreen === 1 ? 3 : activeVideoScreen - 1) as 1 | 2 | 3;
    handleSelectScreen(next);
  }, [activeVideoScreen, handleSelectScreen]);

  const handleNextVideoScreen = useCallback(() => {
    const next = (activeVideoScreen === 3 ? 1 : activeVideoScreen + 1) as 1 | 2 | 3;
    handleSelectScreen(next);
  }, [activeVideoScreen, handleSelectScreen]);

  const handleHomeContainerScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const container = homeContainerRef.current;
    if (!container) return;
    const ids: Array<1 | 2 | 3> = [1, 2, 3];
    let closestId: 1 | 2 | 3 = activeScreenRef.current;
    let closestDist = Number.POSITIVE_INFINITY;
    ids.forEach((id) => {
      const dist = Math.abs(container.scrollLeft - getCenteredScrollLeftForCard(id));
      if (dist < closestDist) {
        closestDist = dist;
        closestId = id;
      }
    });
    if (closestId !== activeScreenRef.current) {
      activeScreenRef.current = closestId;
      setActiveVideoScreen(closestId);
    }
  }, [getCenteredScrollLeftForCard]);

  // Hỗ trợ vuốt cảm ứng (Touch Swipe) mượt mà cho track Trang chủ trên mobile/tablet
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchSwipeRef.current = {
        x: touch.clientX,
        y: touch.clientY,
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
    const dx = touch.clientX - state.x;
    const dy = touch.clientY - state.y;
    if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      state.isHorizontal = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const state = touchSwipeRef.current;
      touchSwipeRef.current = null;
      if (!state || e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - state.x;
      const dy = touch.clientY - state.y;
      const elapsed = Date.now() - state.time;

      const isQuickFlick = Math.abs(dx) >= 24 && elapsed <= 260;
      const isClearSwipe = Math.abs(dx) >= 42 || isQuickFlick;
      if (!isClearSwipe || Math.abs(dx) <= Math.abs(dy) * 1.15) return;

      if (dx < 0 && activeScreenRef.current < 3) {
        handleSelectScreen((activeScreenRef.current + 1) as 1 | 2 | 3);
      } else if (dx > 0 && activeScreenRef.current > 1) {
        handleSelectScreen((activeScreenRef.current - 1) as 1 | 2 | 3);
      }
    },
    [handleSelectScreen]
  );

  // Điều hướng 3 màn hình trang chủ bằng phím mũi tên Trái / Phải
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        handlePrevVideoScreen();
      } else if (e.key === 'ArrowRight') {
        handleNextVideoScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevVideoScreen, handleNextVideoScreen]);

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

  return (
    <div className="relative w-full max-w-full min-w-0 min-h-0 h-full flex-1 flex flex-col overflow-hidden">
      {/* Khung cuộn ngang chứa 3 Main Card (1 Main Card cho mỗi màn hình, hỗ trợ vuốt cảm ứng) */}
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
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
            paddingLeft: `${homeSideInset}px`,
            paddingRight: `${homeSideInset}px`,
            height: '100%',
            minHeight: '100%',
            width: 'max-content',
            boxSizing: 'border-box',
          }}
          className="page-cards-track flex flex-row items-stretch gap-[15px] h-full min-h-full box-border"
        >
          {VIDEO_SCREENS.map((screen) => {
            const isActive = activeVideoScreen === screen.id;
            const heroCardId =
              screen.id === 1
                ? 'home-intro-card'
                : screen.id === 2
                  ? 'home-stats-card'
                  : 'home-capabilities-card';

            return (
              <div
                key={screen.id}
                id={`home-main-card-${screen.id}`}
                data-main-card="true"
                data-layer-level="1"
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
                title={
                  !isActive
                    ? isEn
                      ? `Click to focus ${screen.label}`
                      : `Click để chuyển ${screen.label} ra chính giữa màn hình`
                    : undefined
                }
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
                  !isActive ? 'cursor-pointer opacity-80 hover:opacity-100' : 'opacity-100'
                )}
              >
                {/* Khung Video & Nội dung bên trong Main Card của màn hình (Định dạng chuẩn Video card Giới thiệu) */}
                <div
                  id={`home-main-content-${screen.id}`}
                  data-media-card="video"
                  data-section-card="true"
                  data-layer-level="2"
                  data-element-name={`Khung video ${screen.label}`}
                  data-element-type="card"
                  data-element-page="home"
                  data-element-parent={`home-main-card-${screen.id}`}
                  className="bento-card glass-card home-screen-media-stage relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-center items-center overflow-hidden rounded-[var(--radius-card,14px)] p-0 box-border group/video text-left"
                  style={{
                    borderRadius: 'var(--radius-card, 14px)',
                    padding: '0px',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      minWidth: '100%',
                      minHeight: '100%',
                      padding: 0,
                      margin: 0,
                      borderRadius: 'inherit',
                      overflow: 'hidden',
                    }}
                    className="relative w-full h-full flex-1 rounded-[inherit] overflow-hidden min-h-0 flex items-center justify-center"
                  >
                    {/* Dual-Layer Video chuẩn Video card Giới thiệu */}
                    <DualLayerVideoPlayer className="absolute inset-0 z-0 pointer-events-auto" />

                    {/* Lớp nội dung nổi trên video (Nhãn màn hình top + Thẻ thông tin tổng quan bottom-left để không đè capsule góc phải) */}
                    <div className="relative z-20 w-full h-full flex flex-col justify-between p-[15px] pointer-events-none">
                      <div className="relative z-20 flex items-center justify-between gap-3 pointer-events-none">
                        {!isActive ? (
                          <span
                            className="text-xs font-semibold tracking-wide px-1 py-0.5 select-none"
                            style={{
                              color: isDark ? 'rgba(241,245,249,0.85)' : 'rgba(15,23,42,0.8)',
                              textShadow: isDark
                                ? '0 1px 4px rgba(0,0,0,0.65)'
                                : '0 1px 4px rgba(255,255,255,0.85)',
                            }}
                          >
                            {screen.label} · {screen.id} / {VIDEO_SCREENS.length}
                          </span>
                        ) : (
                          <span aria-hidden="true" />
                        )}

                        {isActive && (
                          <span
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide px-1 py-0.5 select-none tabular-nums"
                            style={{
                              color: isDark ? 'rgba(241,245,249,0.88)' : 'rgba(15,23,42,0.82)',
                              textShadow: isDark
                                ? '0 1px 6px rgba(0,0,0,0.6)'
                                : '0 1px 6px rgba(255,255,255,0.9)',
                            }}
                          >
                            {screen.label} · {screen.id}/{VIDEO_SCREENS.length}
                          </span>
                        )}
                      </div>

                      {/* Thẻ thông tin tổng quan nằm góc dưới trái (~1/2 kích thước) để tách biệt hoàn toàn khỏi nút capsule Video góc dưới phải */}
                      <div className="relative z-20 w-full flex-1 min-h-0 flex items-end justify-start pointer-events-none pt-4 sm:pt-0 sm:pl-6 pb-10 sm:pb-2.5">
                        <div className="pointer-events-none flex items-end justify-start w-fit max-w-full mr-auto">
                          <div
                            id={heroCardId}
                            data-element-name={`Thẻ thông tin tổng quan ${screen.label}`}
                            data-element-type="card"
                            data-element-page="home"
                            data-element-parent={`home-main-card-${screen.id}`}
                            data-section-card="true"
                            data-card-theme-sync="true"
                            className="home-hero-card bento-card layered-card pointer-events-auto p-2.5 rounded-[var(--radius-card,14px)] relative max-h-full overflow-y-auto overflow-x-hidden glass-scrollbar group transition-all duration-300 w-fit max-w-[205px] sm:max-w-[225px] text-left"
                          >
                            <div className="relative z-10 flex flex-col gap-1.5 w-full">
                              <div className="flex items-center justify-between gap-2">
                                <div
                                  className="home-hero-badge inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold tracking-tight leading-tight px-0 py-0 border-0 bg-transparent shadow-none"
                                  style={{
                                    color: `var(--card-synced-accent, var(--color-primary, ${screen.accentColor}))`,
                                  }}
                                >
                                  <span>{screen.heroBadge}</span>
                                </div>
                              </div>

                              <div
                                className="card-header-sync flex items-center gap-1.5 flex-wrap sm:flex-nowrap"
                                style={{
                                  color: `var(--card-synced-accent, var(--text-heading, ${screen.accentColor}))`,
                                }}
                              >
                                <WebIcon
                                  name={screen.heroIcon || 'sparkles'}
                                  className="w-3.5 h-3.5 shrink-0"
                                  style={{
                                    color: `var(--card-synced-accent, var(--text-heading, ${screen.accentColor}))`,
                                  }}
                                />
                                <h3
                                  className="card-title card-title-synced text-[11.5px] sm:text-[12.5px] font-bold font-play tracking-tight leading-snug whitespace-normal m-0"
                                  data-card-title="true"
                                  style={{
                                    color: `var(--card-synced-accent, var(--text-heading, ${screen.accentColor}))`,
                                  }}
                                >
                                  {screen.title}
                                </h3>
                              </div>

                              <p
                                className="text-[10px] sm:text-[10.5px] font-medium leading-snug m-0"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                {screen.description}
                              </p>

                              {/* Nhóm điều khiển: Nút hành động phụ chuyển nhanh Giới thiệu / Liên hệ */}
                              <div
                                id={isActive ? 'el-p0-group-container' : `home-group-container-${screen.id}`}
                                data-element-name="Nhóm điều khiển chuyển nhanh trang"
                                data-element-type="container"
                                data-element-page="home"
                                className="pt-0.5 flex flex-wrap items-center justify-start gap-1.5 w-full"
                              >
                                <button
                                  id={isActive ? 'home-quick-about-btn' : `home-quick-about-btn-${screen.id}`}
                                  type="button"
                                  onClick={handleQuickNavigateAbout}
                                  title={isEn ? 'Open Executive Profile (About)' : 'Xem chi tiết Hồ sơ Giới thiệu'}
                                  aria-label={isEn ? 'About Profile' : 'Giới thiệu'}
                                  className="theme-modal-close inline-flex items-center justify-center gap-1 px-2.5 py-1 min-h-[24px] rounded-[999px] text-[10px] sm:text-[10.5px] font-bold font-play whitespace-nowrap shrink-0 cursor-pointer pointer-events-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  <WebIcon name="user" className="w-3 h-3 shrink-0" />
                                  <span>{isEn ? 'About' : 'Giới thiệu'}</span>
                                </button>

                                <button
                                  id={isActive ? 'home-quick-contact-btn' : `home-quick-contact-btn-${screen.id}`}
                                  type="button"
                                  onClick={handleQuickNavigateContact}
                                  title={isEn ? 'Go to Contact & Booking' : 'Đặt lịch hẹn & Liên hệ trực tiếp'}
                                  aria-label={isEn ? 'Contact' : 'Liên hệ'}
                                  className="theme-modal-close inline-flex items-center justify-center gap-1 px-2.5 py-1 min-h-[24px] rounded-[999px] text-[10px] sm:text-[10.5px] font-bold font-play whitespace-nowrap shrink-0 cursor-pointer pointer-events-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  <WebIcon name="calendar" className="w-3 h-3 shrink-0" />
                                  <span>{isEn ? 'Contact' : 'Liên hệ'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lớp điều khiển nổi căn theo thẻ chính ở giữa: Nút Trái/Phải & Dock chuyển 3 Main Card */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-stretch justify-center overflow-hidden">
          <div
            className="relative h-full max-w-full pointer-events-none"
            style={{ width: `${homeCardWidth}px` }}
          >
            <button
              id="el-p0-button-1"
              data-element-id="el-p0-button-1"
              type="button"
              onClick={handlePrevVideoScreen}
              title="Màn hình trước (Chuyển màn hình video)"
              aria-label="Màn hình trước"
              className="nav-arrow-btn theme-prev-next-btn absolute left-[26px] sm:left-[26px] top-[26px] sm:top-1/2 sm:-translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-md"
            >
              <WebIcon
                name="chevron-left"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform"
              />
            </button>

            <button
              id="el-p0-button-2"
              data-element-id="el-p0-button-2"
              type="button"
              onClick={handleNextVideoScreen}
              title="Màn hình kế tiếp (Chuyển màn hình video)"
              aria-label="Màn hình kế tiếp"
              className="nav-arrow-btn theme-prev-next-btn absolute right-[26px] sm:right-[26px] top-[26px] sm:top-1/2 sm:-translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-md"
            >
              <WebIcon
                name="chevron-right"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform"
              />
            </button>

            <div className="absolute bottom-[22px] left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
              <div
                id="el-p0-div-16"
                data-element-id="el-p0-div-16"
                data-element-name="Thanh chuyển đổi màn hình trang chủ"
                data-element-type="card"
                data-element-page="home"
                className="theme-screen-switcher-dock pointer-events-auto inline-flex items-center gap-1 !rounded-[999px] border select-none transition-all duration-300 px-2 py-1 m-0"
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
                      className={`group relative h-1 sm:h-[5px] rounded-full transition-all duration-300 cursor-pointer focus:outline-none select-none ${
                        isActive
                          ? 'w-3.5 sm:w-[18px] scale-105'
                          : 'w-2.5 sm:w-3 hover:w-3 sm:hover:w-3.5 active:scale-95'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};
