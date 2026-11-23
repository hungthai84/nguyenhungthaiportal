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

// Video 1 Trang chủ: Phong Thái Lãnh Đạo & Tầm Nhìn (Auto Play, Loop vòng lặp, mặc định Mute)
export const HOME_VIDEO_1_ID = '1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp';
export const HOME_VIDEO_1_SRC =
  'https://cdn.scena.ai/project/10169/eae59f7007421658e611c298c206755ca060c878d07087694c06935208b9d8f9.mp4';

export interface VideoScreenItem {
  id: 1;
  label: string;
  badge: string;
  title: string;
  description: string;
  accentColor: string;
  heroBadge: string;
  heroIcon: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentTheme = 'liquid-glass',
  onNavigateContact,
  onNavigatePage,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();

  const homeContainerRef = useRef<HTMLDivElement | null>(null);
  const activeScreenRef = useRef<1>(1);
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
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-frost-ice-neu';

  // Màn hình trang chủ (dùng chung định dạng Video card Giới thiệu)
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
  ];

  const [activeVideoScreen, setActiveVideoScreen] = useState<1>(1);

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
    (screenId: 1) => {
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
    (targetId: 1, smooth = true) => {
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

  // Căn giữa Màn hình 1 ngay khi mount xong
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
        scrollToHomeCard(1, true);
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
    (nextScreenId: 1) => {
      if (nextScreenId === activeScreenRef.current) {
        return;
      }
      SoundEngine.playGlassChime();
      scrollToHomeCard(nextScreenId, true);
      const target = VIDEO_SCREENS[0];
      if (target) {
        showToast(
          isEn
            ? `Switching to ${target.label} · ${target.title}`
            : `Đang chuyển sang ${target.label} · ${target.title}`
        );
      }
    },
    [scrollToHomeCard, showToast, isEn]
  );

  const handleHomeContainerScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const container = homeContainerRef.current;
    if (!container) return;
    if (activeScreenRef.current !== 1) {
      activeScreenRef.current = 1;
      setActiveVideoScreen(1);
    }
  }, []);

  // Hỗ trợ vuốt cảm ứng (Touch Swipe) cho track Trang chủ trên mobile/tablet
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

  const handleTouchEnd = useCallback(() => {
    touchSwipeRef.current = null;
  }, []);

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
        className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-center p-0 gap-[15px] overflow-x-hidden overflow-y-hidden no-scrollbar select-none font-play rounded-none box-border"
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
            justifyContent: 'center',
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
            height: '100%',
            minHeight: '100%',
            width: '100%',
            boxSizing: 'border-box',
          }}
          className="page-cards-track flex flex-row items-stretch justify-center gap-[15px] h-full min-h-full box-border"
        >
          {VIDEO_SCREENS.map((screen) => {
            const isActive = activeVideoScreen === screen.id;
            const heroCardId = 'home-intro-card';

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
                    {/* Dual-Layer Video chuẩn Video card Giới thiệu (dùng màu capsule riêng của Trang chủ) */}
                    <DualLayerVideoPlayer
                      video1Id={HOME_VIDEO_1_ID}
                      video1Src={HOME_VIDEO_1_SRC}
                      video2Id=""
                      video2Src={HOME_VIDEO_1_SRC}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      capsuleVariant="home"
                      className="absolute inset-0 z-0 pointer-events-auto"
                    />

                    {/* Viền vi khí hậu nhẹ trong suốt đảm bảo video luôn sáng rõ, sắc nét và tương phản cao */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
                      style={{
                        background: isDark
                          ? 'linear-gradient(180deg, transparent 75%, rgba(2,6,23,0.45) 100%)'
                          : 'linear-gradient(180deg, transparent 80%, rgba(15,23,42,0.25) 100%)',
                      }}
                    />

                    {/* Lớp nội dung nhãn top màn hình */}
                    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3.5 sm:p-5 pointer-events-none">
                      <div className="relative z-20 flex items-center justify-between gap-3 pointer-events-none">
                        {!isActive ? (
                          <span
                            className="typo-caption font-semibold tracking-wide px-1 py-0.5 select-none"
                            style={{
                              color: isDark ? 'rgba(241,245,249,0.9)' : 'rgba(255,255,255,0.92)',
                              textShadow: '0 1px 6px rgba(2,6,23,0.65)',
                            }}
                          >
                            {screen.label} · {screen.id} / {VIDEO_SCREENS.length}
                          </span>
                        ) : (
                          <span aria-hidden="true" />
                        )}
                      </div>
                      <div />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lớp điều khiển nổi căn theo thẻ chính ở giữa (chỉ hiển thị khi có nhiều hơn 1 màn hình) */}
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
      )}
    </div>
  );
};
