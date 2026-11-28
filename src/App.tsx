import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { motion, MotionConfig, AnimatePresence } from 'motion/react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileTopBarAndFloatingNav } from './components/layout/MobileTopBarAndFloatingNav';
import { HomeView } from './components/views/HomeView';
import { GlobalLoadingOverlay } from './components/common/GlobalLoadingOverlay';

import { MapLocation } from './data/aboutData';
import { ExperienceMilestone } from './data/experience';
import { TABS_DATA, MENU_ICON_PAGE_ORDER } from './data/tabs';
import { useTheme } from './hooks/useTheme';
import { useGlobalHorizontalScroll } from './hooks/useGlobalHorizontalScroll';
import { useDesktopMomentumScroll } from './hooks/useDesktopMomentumScroll';
import { parseCssStringToStyle, getCleanImageUrl } from './data/wallpapers';
import {
  applyTypographyScaleToDocument,
  evaluateOverallLayoutTypography,
} from './config/typographyScale';
import { SoundEngine } from './components/ui/SoundEngine';
import { isAnimatedSceneWallpaper } from './components/backgrounds/AnimatedSceneWallpaper';

const AnimatedSceneWallpaper = React.lazy(() =>
  import('./components/backgrounds/AnimatedSceneWallpaper').then((m) => ({
    default: m.AnimatedSceneWallpaper,
  }))
);
const LiquidGlassCursor = React.lazy(() =>
  import('./components/ui/LiquidGlassCursor').then((m) => ({
    default: m.LiquidGlassCursor,
  }))
);

const MapModal = React.lazy(() =>
  import('./components/common/MapModal').then((m) => ({ default: m.MapModal }))
);
const BentoFocusModal = React.lazy(() =>
  import('./components/common/BentoFocusModal').then((m) => ({ default: m.BentoFocusModal }))
);
const MilestoneModal = React.lazy(() =>
  import('./components/common/MilestoneModal').then((m) => ({ default: m.MilestoneModal }))
);
const XRayInspector = React.lazy(() =>
  import('./components/common/XRayInspector').then((m) => ({ default: m.XRayInspector }))
);

const LetterView = React.lazy(() =>
  import('./components/views/LetterView').then((m) => ({ default: m.LetterView }))
);
const AboutView = React.lazy(() =>
  import('./components/views/AboutView').then((m) => ({ default: m.AboutView }))
);
const EducationView = React.lazy(() =>
  import('./components/views/EducationView').then((m) => ({ default: m.EducationView }))
);
const ServicesView = React.lazy(() =>
  import('./components/views/ServicesView').then((m) => ({ default: m.ServicesView }))
);
const ExperienceView = React.lazy(() =>
  import('./components/views/ExperienceView').then((m) => ({ default: m.ExperienceView }))
);
const SkillsView = React.lazy(() =>
  import('./components/views/SkillsView').then((m) => ({ default: m.SkillsView }))
);
const ProjectsView = React.lazy(() =>
  import('./components/views/ProjectsView').then((m) => ({ default: m.ProjectsView }))
);
const SystemsView = React.lazy(() =>
  import('./components/views/SystemsView').then((m) => ({ default: m.SystemsView }))
);
const InterviewView = React.lazy(() =>
  import('./components/views/InterviewView').then((m) => ({ default: m.InterviewView }))
);
const HoroscopeView = React.lazy(() =>
  import('./components/views/HoroscopeView').then((m) => ({ default: m.HoroscopeView }))
);
const MemoriesView = React.lazy(() =>
  import('./components/views/MemoriesView').then((m) => ({ default: m.MemoriesView }))
);
const AiAssistantView = React.lazy(() =>
  import('./components/views/AiAssistantView').then((m) => ({ default: m.AiAssistantView }))
);
const WallpaperView = React.lazy(() =>
  import('./components/views/WallpaperView').then((m) => ({ default: m.WallpaperView }))
);
const ContactView = React.lazy(() =>
  import('./components/views/ContactView').then((m) => ({ default: m.ContactView }))
);
const InterfaceView = React.lazy(() =>
  import('./components/views/InterfaceView').then((m) => ({ default: m.InterfaceView }))
);
const PdfView = React.lazy(() =>
  import('./components/views/PdfView').then((m) => ({ default: m.PdfView }))
);

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const [mapLocation, setMapLocation] = useState<MapLocation | null>(null);
  const [bentoFocusKey, setBentoFocusKey] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<ExperienceMilestone | null>(null);
  const [experienceActiveKey, setExperienceActiveKey] = useState<string>('2013');
  const [experienceShowJobCard, setExperienceShowJobCard] = useState<boolean>(false);
  const [projectNavigationRequest, setProjectNavigationRequest] = useState<{
    projectId: string | null;
    returnTabIndex: number | null;
    nonce: number;
  } | null>(null);

  // Thứ tự trang theo đúng Menu Icon trên Header (0..11 -> Tải PDF 16 -> Liên hệ 12)
  const MENU_ICON_ORDER = MENU_ICON_PAGE_ORDER;
  const PAGE_SLIDE_COUNTS: Record<number, number> = {
    0: 1,
    1: 1,
    2: 1,
    5: 1,
    10: 6,
  };

  const [pageSlides, setPageSlides] = useState<Record<number, number>>({
    0: 0,
    5: 0,
  });
  const [pendingSlideTarget, setPendingSlideTarget] = useState<{
    tabIndex: number;
    slide: number;
  } | null>(null);

  const { isDark, cardStyle, activeWallpaper, setWallpaper, cornerRadius = 14 } = useTheme();
  const mainViewportRef = useRef<HTMLElement | null>(null);
  const [loadedWallpaperUrl, setLoadedWallpaperUrl] = useState<string>('');
  const wallpaperImgRef = useRef<HTMLImageElement | null>(null);
  const activeImageUrl =
    activeWallpaper?.type === 'image' && activeWallpaper?.id !== 'none'
      ? getCleanImageUrl(activeWallpaper.value || activeWallpaper.bg || '')
      : '';

  useEffect(() => {
    if (!activeImageUrl) {
      setLoadedWallpaperUrl('');
      return;
    }
    if (wallpaperImgRef.current?.complete && wallpaperImgRef.current.naturalWidth > 0) {
      setLoadedWallpaperUrl(activeImageUrl);
    }
  }, [activeImageUrl]);

  useGlobalHorizontalScroll();
  useDesktopMomentumScroll();

  // Phát âm thanh click nhẹ khi bấm trên toàn ứng dụng (không tạo hiệu ứng lún nút)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactiveEl = target.closest(
        'button, a, [role="button"], [role="tab"], [role="option"], article, [data-element-type="card"], .cursor-pointer, input[type="button"], input[type="submit"], summary'
      );
      if (interactiveEl) {
        SoundEngine.playTap();
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  const handleSelectTabWithSound = useCallback((nextIndex: number) => {
    setProjectNavigationRequest(null);
    setCurrentTabIndex((prev) => {
      if (prev !== nextIndex) {
        SoundEngine.playPageFlip();
      } else {
        SoundEngine.playTap();
      }
      return nextIndex;
    });
  }, []);

  const handleOpenProjectFromJob = useCallback((projectId?: string) => {
    setExperienceShowJobCard(true);
    setProjectNavigationRequest({
      projectId: projectId || null,
      returnTabIndex: 5,
      nonce: Date.now(),
    });
    setCurrentTabIndex((prev) => {
      if (prev !== 7) {
        SoundEngine.playPageFlip();
      } else {
        SoundEngine.playTap();
      }
      return 7;
    });
  }, []);

  const handleReturnFromProjectDetail = useCallback(() => {
    const targetTab = projectNavigationRequest?.returnTabIndex ?? 5;
    setProjectNavigationRequest(null);
    SoundEngine.playPageFlip();
    setCurrentTabIndex(targetTab);
  }, [projectNavigationRequest]);

  // Lắng nghe sự kiện thay đổi slide từ các trang con (Thư Ngỏ, Giới thiệu, Kinh nghiệm, Tử vi)
  useEffect(() => {
    const handleSlideChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.tabIndex === 'number' && typeof detail.slide === 'number') {
        setPageSlides((prev) => {
          if (prev[detail.tabIndex] === detail.slide) return prev;
          SoundEngine.playPageFlip();
          return { ...prev, [detail.tabIndex]: detail.slide };
        });
      }
    };
    const handleNavigateTab = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'number') {
        handleSelectTabWithSound(detail);
      }
    };
    window.addEventListener('app:slide-changed', handleSlideChanged);
    window.addEventListener('app:navigate-tab', handleNavigateTab);
    return () => {
      window.removeEventListener('app:slide-changed', handleSlideChanged);
      window.removeEventListener('app:navigate-tab', handleNavigateTab);
    };
  }, [handleSelectTabWithSound]);

  // Khi chuyển sang trang mới cần nhảy tới slide đầu hoặc slide cuối của trang đó
  useEffect(() => {
    if (pendingSlideTarget && pendingSlideTarget.tabIndex === currentTabIndex) {
      const target = pendingSlideTarget;
      setPendingSlideTarget(null);
      setPageSlides((prev) => ({ ...prev, [target.tabIndex]: target.slide }));
      const timer = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('app:set-slide', {
            detail: { tabIndex: target.tabIndex, slide: target.slide },
          })
        );
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [currentTabIndex, pendingSlideTarget]);

  // Read URL query parameter `?company=...` and sync document title & favicon
  useEffect(() => {
    document.title = 'Nguyễn Hùng Thái';
    const avatarUrl = 'https://lh3.googleusercontent.com/d/1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm';
    let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.type = 'image/png';
    iconLink.href = avatarUrl;

  }, []);

  // Kết nối hệ thống Typography tập trung & đánh giá bố cục tổng thể (src/config/typographyScale.ts)
  useEffect(() => {
    applyTypographyScaleToDocument();
  }, []);

  useEffect(() => {
    const viewportEl = mainViewportRef.current;
    let rafId: number | null = null;
    const scheduleEvaluate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        evaluateOverallLayoutTypography(viewportEl);
      });
    };

    scheduleEvaluate();
    // Re-evaluate after route transition settles so final unscaled bounds are captured
    const settleTimer = window.setTimeout(scheduleEvaluate, 320);

    if (!viewportEl) {
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        window.clearTimeout(settleTimer);
      };
    }

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            scheduleEvaluate();
          })
        : null;
    if (ro) {
      ro.observe(viewportEl);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      ro?.disconnect();
    };
  }, [currentTabIndex, pageSlides, experienceShowJobCard, experienceActiveKey]);

  // Đồng bộ chính xác chiều cao thanh Header và Footer và chiều rộng chuẩn Thẻ chính trên mọi màn hình
  useEffect(() => {
    const rootEl = document.getElementById('website-root');
    const headerEl = document.getElementById('app-header');
    const footerEl = document.getElementById('app-footer');
    if (!rootEl) return;

    let rafId: number | null = null;
    const syncBarHeight = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const headerMeasured = headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 64;
        const footerMeasured = footerEl ? Math.round(footerEl.getBoundingClientRect().height) : 0;

        // Tính chính xác chiều rộng mục tiêu của Thẻ chính Trang chủ 1 (#home-main-card-1) theo viewport & --main-card-target-w (tránh khóa vòng lặp CSS)
        const vw = Math.max(
          280,
          Math.round(document.documentElement.clientWidth || window.innerWidth || 1280)
        );
        const rawTargetW = getComputedStyle(document.documentElement)
          .getPropertyValue('--main-card-target-w')
          .trim();
        const parsedTargetW = Number.parseFloat(rawTargetW);
        const targetMaxW = Number.isFinite(parsedTargetW) && parsedTargetW > 300 ? parsedTargetW : 1200;
        const targetWidth =
          vw < 640
            ? Math.max(260, vw - 16)
            : Math.min(targetMaxW, Math.max(260, vw - 32));

        const hVal = `${Math.max(0, headerMeasured)}px`;
        rootEl.style.setProperty('--header-bar-h', hVal);
        document.documentElement.style.setProperty('--header-bar-h', hVal);
        if (targetWidth > 0) {
          const wVal = `${targetWidth}px`;
          rootEl.style.setProperty('--home-main-card-w', wVal);
          rootEl.style.setProperty('--header-synced-w', wVal);
          document.documentElement.style.setProperty('--home-main-card-w', wVal);
          document.documentElement.style.setProperty('--header-synced-w', wVal);
        }
        const fVal = `${Math.max(0, footerMeasured)}px`;
        rootEl.style.setProperty('--footer-bar-h', fVal);
        document.documentElement.style.setProperty('--footer-bar-h', fVal);
      });
    };

    syncBarHeight();
    const settleTimer = window.setTimeout(syncBarHeight, 160);
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => syncBarHeight())
        : null;
    if (headerEl) ro?.observe(headerEl);
    if (footerEl) ro?.observe(footerEl);
    const homeTarget = document.getElementById('home-main-card-1');
    if (homeTarget) ro?.observe(homeTarget);
    const mainViewport = document.getElementById('global-content-viewport');
    if (mainViewport) ro?.observe(mainViewport);
    window.addEventListener('resize', syncBarHeight, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      ro?.disconnect();
      window.removeEventListener('resize', syncBarHeight);
    };
  }, [currentTabIndex, cardStyle, isDark]);

  // Gán ID định danh nhẹ nhàng trong thời gian rảnh (idle) khi chuyển trang, không dùng MutationObserver hay innerText gây reflow
  useEffect(() => {
    const rootEl = document.getElementById('website-root');
    if (!rootEl) return;

    const assignMissingIds = () => {
      const pageInfo = TABS_DATA[currentTabIndex];
      const pageSlug = pageInfo?.id !== undefined ? `p${currentTabIndex}` : 'global';
      const pageTitle = pageInfo?.name || 'Trang';
      const elements = rootEl.querySelectorAll(
        'section:not([id]), article:not([id]), header:not([id]), footer:not([id]), nav:not([id]), main:not([id]), button:not([id]), a:not([id]), input:not([id]), select:not([id]), textarea:not([id])'
      );
      const counters: Record<string, number> = {};

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const tag = el.tagName.toLowerCase();
        counters[tag] = (counters[tag] || 0) + 1;
        el.id = `el-${pageSlug}-${tag}-${counters[tag]}`;

        if (!htmlEl.getAttribute('data-element-name')) {
          const titleAttr = htmlEl.getAttribute('title');
          const ariaLabel = htmlEl.getAttribute('aria-label');
          const placeholderAttr = htmlEl.getAttribute('placeholder');
          const rawText = (htmlEl.textContent || '').trim().replace(/\s+/g, ' ');
          const derivedName =
            (titleAttr && titleAttr.trim()) ||
            (ariaLabel && ariaLabel.trim()) ||
            (placeholderAttr && `Ô nhập: ${placeholderAttr.trim()}`) ||
            (rawText ? `${tag.toUpperCase()}: ${rawText.slice(0, 36)}` : `Thẻ nội dung ${pageTitle}`);

          htmlEl.setAttribute('data-element-name', derivedName);
          if (!htmlEl.getAttribute('data-element-page')) {
            htmlEl.setAttribute('data-element-page', pageSlug);
          }
        }
      });
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | null = null;
    const timerId = window.setTimeout(() => {
      if (typeof win.requestIdleCallback === 'function') {
        idleId = win.requestIdleCallback(assignMissingIds, { timeout: 1200 });
      } else {
        assignMissingIds();
      }
    }, 240);

    return () => {
      window.clearTimeout(timerId);
      if (idleId !== null && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
    };
  }, [currentTabIndex]);

  const showNotification = useCallback((_msg: string) => {}, []);

  // Điều hướng Tới trang / Qua trang theo đúng thứ tự trang trên Menu Icon (Header)
  const navigatePage = useCallback(
    (direction: number, preventLoop = false) => {
      const currentPos = MENU_ICON_ORDER.indexOf(currentTabIndex);
      const isInMenuOrder = currentPos !== -1;

      if (!isInMenuOrder) {
        SoundEngine.playPageFlip();
        const fallbackTab =
          direction >= 0
            ? MENU_ICON_ORDER[0]
            : MENU_ICON_ORDER[MENU_ICON_ORDER.length - 1];
        const fallbackSlides = PAGE_SLIDE_COUNTS[fallbackTab] || 1;
        if (fallbackSlides > 1) {
          setPendingSlideTarget({
            tabIndex: fallbackTab,
            slide: direction >= 0 ? 0 : fallbackSlides - 1,
          });
        }
        setCurrentTabIndex(fallbackTab);
        return;
      }

      const activeIdx = currentTabIndex;
      const totalSlides = PAGE_SLIDE_COUNTS[activeIdx] || 1;
      const currentSlide = pageSlides[activeIdx] ?? 0;

      if (direction > 0) {
        if (totalSlides > 1 && currentSlide < totalSlides - 1) {
          SoundEngine.playPageFlip();
          const nextSlide = currentSlide + 1;
          setPageSlides((prev) => ({ ...prev, [activeIdx]: nextSlide }));
          window.dispatchEvent(
            new CustomEvent('app:set-slide', {
              detail: { tabIndex: activeIdx, slide: nextSlide },
            })
          );
          return;
        }
        if (preventLoop && currentPos >= MENU_ICON_ORDER.length - 1) {
          return;
        }
        SoundEngine.playPageFlip();
        const nextPos = (currentPos + 1) % MENU_ICON_ORDER.length;
        const nextTab = MENU_ICON_ORDER[nextPos];
        if ((PAGE_SLIDE_COUNTS[nextTab] || 1) > 1) {
          setPendingSlideTarget({ tabIndex: nextTab, slide: 0 });
        }
        setCurrentTabIndex(nextTab);
      } else if (direction < 0) {
        if (totalSlides > 1 && currentSlide > 0) {
          SoundEngine.playPageFlip();
          const prevSlide = currentSlide - 1;
          setPageSlides((prev) => ({ ...prev, [activeIdx]: prevSlide }));
          window.dispatchEvent(
            new CustomEvent('app:set-slide', {
              detail: { tabIndex: activeIdx, slide: prevSlide },
            })
          );
          return;
        }
        if (preventLoop && currentPos <= 0) {
          return;
        }
        SoundEngine.playPageFlip();
        const prevPos = (currentPos - 1 + MENU_ICON_ORDER.length) % MENU_ICON_ORDER.length;
        const prevTab = MENU_ICON_ORDER[prevPos];
        const prevTotalSlides = PAGE_SLIDE_COUNTS[prevTab] || 1;
        if (prevTotalSlides > 1) {
          setPendingSlideTarget({ tabIndex: prevTab, slide: prevTotalSlides - 1 });
        }
        setCurrentTabIndex(prevTab);
      }
    },
    [currentTabIndex, pageSlides, MENU_ICON_ORDER]
  );

  const activeTheme = cardStyle || (isDark ? 'dark-liquid-glass' : 'liquid-glass');

  const activeOrderIdx = MENU_ICON_ORDER.includes(currentTabIndex) ? currentTabIndex : 0;
  const activeOrderPos = MENU_ICON_ORDER.indexOf(activeOrderIdx);
  const activeSlideIdx = pageSlides[activeOrderIdx] ?? 0;
  const activeTotalSlides = PAGE_SLIDE_COUNTS[activeOrderIdx] || 1;
  const hasPrevPage = activeOrderPos > 0 || activeSlideIdx > 0;
  const isAtLastPage =
    activeOrderPos === MENU_ICON_ORDER.length - 1 && activeSlideIdx >= activeTotalSlides - 1;
  const hasNextPage = !isAtLastPage;

  const handleBackToTop = useCallback(() => {
    SoundEngine.playPageFlip();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const rootEl = document.getElementById('website-root');
    if (rootEl) {
      rootEl.scrollTo({ top: 0, behavior: 'smooth' });
      rootEl
        .querySelectorAll<HTMLElement>(
          '.overflow-y-auto, .overflow-auto, #global-content-viewport, .main-card'
        )
        .forEach((el) => {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
  }, []);

  const renderActiveView = () => {
    switch (currentTabIndex) {
      case 0:
        return (
          <HomeView
            currentTheme={activeTheme}
            slideIndex={pageSlides[0] ?? 0}
            onShowNotification={showNotification}
            onNavigateContact={() => handleSelectTabWithSound(12)}
            onNavigatePage={handleSelectTabWithSound}
          />
        );
      case 1:
        return (
          <LetterView
            currentTheme={activeTheme}
            onShowNotification={showNotification}
            onOpenMilestoneModal={(item) => setSelectedMilestone(item)}
          />
        );
      case 2:
        return (
          <AboutView
            currentTheme={activeTheme}
            onShowNotification={showNotification}
            onOpenMapModal={(loc) => setMapLocation(loc)}
            onOpenBentoFocusModal={(key) => setBentoFocusKey(key)}
          />
        );
      case 3:
        return <EducationView currentTheme={activeTheme} />;
      case 4:
        return <ServicesView currentTheme={activeTheme} />;
      case 5:
        return (
          <ExperienceView
            currentTheme={activeTheme}
            onShowNotification={showNotification}
            onNavigateTab={(tabIndex) => handleSelectTabWithSound(tabIndex)}
            activeKey={experienceActiveKey}
            onActiveKeyChange={setExperienceActiveKey}
            showJobCard={experienceShowJobCard}
            onShowJobCardChange={setExperienceShowJobCard}
            onOpenProjectFromJob={handleOpenProjectFromJob}
          />
        );
      case 6:
        return <SkillsView currentTheme={activeTheme} />;
      case 7:
        return (
          <ProjectsView
            currentTheme={activeTheme}
            requestedProject={projectNavigationRequest}
            onReturnToOrigin={
              projectNavigationRequest?.returnTabIndex !== null &&
              projectNavigationRequest?.returnTabIndex !== undefined
                ? handleReturnFromProjectDetail
                : undefined
            }
          />
        );
      case 8:
        return (
          <SystemsView
            currentTheme={activeTheme}
            onShowNotification={showNotification}
          />
        );
      case 9:
        return (
          <InterviewView
            currentTheme={activeTheme}
            onShowNotification={showNotification}
          />
        );
      case 10:
        return <HoroscopeView currentTheme={activeTheme} />;
      case 11:
        return <MemoriesView currentTheme={activeTheme} />;
      case 12:
        return <ContactView currentTheme={activeTheme} onShowNotification={showNotification} />;
      case 13:
        return (
          <AiAssistantView
            currentTheme={activeTheme}
            onSelectTab={handleSelectTabWithSound}
            onShowNotification={showNotification}
          />
        );
      case 14:
        return (
          <WallpaperView
            activeWallpaper={activeWallpaper}
            onSelectWallpaper={setWallpaper}
            onShowNotification={showNotification}
            onClose={() => setCurrentTabIndex(0)}
          />
        );
      case 15:
        return <InterfaceView onShowNotification={showNotification} />;
      case 16:
        return <PdfView onShowNotification={showNotification} onNavigateTab={(tab) => setCurrentTabIndex(tab)} />;
      default:
        return (
          <HomeView
            currentTheme={activeTheme}
            slideIndex={pageSlides[0] ?? 0}
            onShowNotification={showNotification}
            onNavigateContact={() => handleSelectTabWithSound(12)}
            onNavigatePage={handleSelectTabWithSound}
          />
        );
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <div
      id="website-root"
      data-element-name="Khung chứa toàn bộ trang web"
      data-element-type="container"
      data-element-page="global"
      style={{
        padding: '0px',
        gap: '0px',
        width: '100%',
        height: '100dvh',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      }}
      className="w-full h-[100dvh] overflow-hidden flex flex-col items-center m-0 p-0 select-text relative"
    >
      {/* GLOBAL UNIFIED AMBIENT GLASS BACKGROUND & WALLPAPER SYSTEM */}
      {(() => {
        const hasActiveWallpaper = !(
          activeWallpaper?.id === 'none' ||
          (!activeWallpaper?.value &&
            !activeWallpaper?.bg &&
            (!activeWallpaper?.previewStyle || Object.keys(activeWallpaper.previewStyle).length === 0))
        );
        return (
      <div
        id="global-wallpaper-layer"
        data-theme-card-style={cardStyle}
        data-has-wallpaper={hasActiveWallpaper ? 'true' : 'false'}
        data-element-name="Lớp nền hình nền động toàn website"
        data-element-type="media"
        data-element-page="global"
        data-element-parent="website-root"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          backgroundColor: 'var(--app-bg-base, var(--color-bg))',
          backgroundImage: hasActiveWallpaper
            ? 'none'
            : 'var(--app-bg-gradient, var(--ambient-base-bg, var(--theme-bg-fallback, var(--bg-main))))',
          filter: 'none',
          WebkitFilter: 'none',
          backdropFilter: 'none',
        }}
      >
        {/* Lớp 1 – Base Background: Chỉ hiển thị khi chưa đặt hình nền */}
        {!hasActiveWallpaper && <div aria-hidden="true" className="ambient-layer-base" />}

        {/* Active Theme Texture / Custom Wallpaper (0% blur, sắc nét ở mọi kích thước) */}
        {hasActiveWallpaper && (
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
            style={{
              opacity: 1,
              filter: 'none',
              WebkitFilter: 'none',
              backdropFilter: 'none',
              transform: 'scale(1)',
            }}
          >
            {activeWallpaper.type === 'video' ? (
              (activeWallpaper.value || activeWallpaper.bg || '').includes('youtube.com') ||
              (activeWallpaper.value || activeWallpaper.bg || '').includes('youtu.be') ? (
                <div
                  className="w-full h-full relative overflow-hidden flex items-center justify-center bg-cover bg-center"
                  style={activeWallpaper.previewStyle || {}}
                >
                  <iframe
                    key={activeWallpaper.id + '-' + (activeWallpaper.value || activeWallpaper.bg)}
                    src={activeWallpaper.value || activeWallpaper.bg}
                    title={activeWallpaper.name}
                    className="w-[120vw] h-[120vh] min-w-[120vw] min-h-[120vh] border-0 pointer-events-none scale-125"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  key={activeWallpaper.id + '-' + (activeWallpaper.value || activeWallpaper.bg)}
                  src={activeWallpaper.value || activeWallpaper.bg}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  onEnded={(e) => {
                    const v = e.currentTarget;
                    v.currentTime = 0;
                    v.play().catch(() => {});
                  }}
                  style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                  className="w-full h-full min-w-full min-h-full object-cover banner-video-sharp"
                />
              )
            ) : activeWallpaper.type === 'css' || activeWallpaper.type === 'gradient' ? (
              isAnimatedSceneWallpaper(activeWallpaper.id) ? (
                <Suspense fallback={null}>
                  <AnimatedSceneWallpaper
                    key={activeWallpaper.id}
                    id={activeWallpaper.id}
                    isDark={isDark}
                  />
                </Suspense>
              ) : (
                <div
                  key={activeWallpaper.id}
                  className="w-full h-full transition-all duration-500"
                  style={
                    activeWallpaper.previewStyle && Object.keys(activeWallpaper.previewStyle).length > 0
                      ? activeWallpaper.previewStyle
                      : parseCssStringToStyle(activeWallpaper.value || activeWallpaper.bg || '')
                  }
                />
              )
            ) : (
              <div
                key={activeWallpaper.id}
                className="relative w-full h-full overflow-hidden transition-all duration-500"
                style={{
                  background: activeWallpaper.previewStyle?.background
                    ? String(activeWallpaper.previewStyle.background)
                    : 'transparent',
                }}
              >
                {activeImageUrl && (
                  <img
                    ref={wallpaperImgRef}
                    key={activeImageUrl}
                    src={activeImageUrl}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    onLoad={() => setLoadedWallpaperUrl(activeImageUrl)}
                    onError={() => setLoadedWallpaperUrl('')}
                    style={{
                      filter: 'none',
                      WebkitFilter: 'none',
                      backdropFilter: 'none',
                    }}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                      loadedWallpaperUrl === activeImageUrl ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Lớp điều chỉnh độ tối nền (Dim Scrim) — luôn giữ trong suốt 0% mờ */}
        <div
          id="global-wallpaper-dim-layer"
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: 'transparent',
            filter: 'none',
            WebkitFilter: 'none',
            backdropFilter: 'none',
          }}
        />

        {/* Các lớp Ambient Glow / Abstract Wave / Depth / Transition chỉ dùng khi không đặt hình nền */}
        {!hasActiveWallpaper && (
          <>
            <div aria-hidden="true" className="ambient-layer-glow">
              <span className="ambient-orb ambient-orb--1" />
              <span className="ambient-orb ambient-orb--2" />
              <span className="ambient-orb ambient-orb--3" />
              <span className="ambient-orb ambient-orb--4" />
            </div>

            <div aria-hidden="true" className="ambient-layer-abstract">
              <span className="ambient-wave ambient-wave--1" />
              <span className="ambient-wave ambient-wave--2" />
              <span className="ambient-wave ambient-wave--3" />
            </div>

            <div aria-hidden="true" className="ambient-layer-depth" />

            <div aria-hidden="true" className="ambient-layer-transition" />
          </>
        )}
      </div>
        );
      })()}

      {/* HEADER: Top Zone 9% chiều cao, nội dung bên trong căn giữa tối đa 1200px (Ẩn khi xem Trang Tải PDF) */}
      {currentTabIndex !== 16 && (
        <div
          id="app-header-container"
          style={{
            flex: '0 0 auto',
            height: 'var(--shell-bar-h, clamp(68px, 9dvh, 84px))',
            maxHeight: '88px',
            minHeight: '68px',
            padding: '0px',
            boxSizing: 'border-box',
            maxWidth: '100%',
            width: '100%',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            borderRadius: '0px',
          }}
          className="w-full relative z-40 hidden md:flex items-stretch justify-center bg-transparent border-0 shadow-none"
        >
          <div
            id="app-header-wrapper"
            data-element-name="Khung DIV bọc Header"
            data-element-type="container"
            data-element-page="global"
            data-element-parent="app-header-container"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
            className="w-full h-full flex items-stretch justify-center bg-transparent border-0 shadow-none"
          >
            <Header
              pages={TABS_DATA}
              currentPage={currentTabIndex}
              currentTheme={activeTheme}
              onSelectPage={handleSelectTabWithSound}
              onShowNotification={showNotification}
            />
          </div>
        </div>
      )}

      {/* MOBILE MODE: Thanh điều khiển phía trên Thẻ chính (Menu Danh mục Icon bên trái + Thời tiết bên phải) & Nút nổi chuyển trang góc dưới phải */}
      <MobileTopBarAndFloatingNav
        currentTabIndex={currentTabIndex >= TABS_DATA.length ? 0 : currentTabIndex}
        onSelectPage={handleSelectTabWithSound}
        onNavigatePage={(dir) => navigatePage(dir, true)}
        onBackToTop={handleBackToTop}
        onShowNotification={showNotification}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        isAtLastPage={isAtLastPage}
      />

      {/* MAIN CENTER CARD: Center Zone 82% chiều cao, padding trên/dưới 10px, trái/phải 0px (100% khi xem Trang Tải PDF) */}
      <main
        ref={mainViewportRef}
        id="global-content-viewport"
        data-element-name="Khung hiển thị nội dung chính"
        data-element-type="container"
        data-element-page="global"
        data-element-parent="website-root"
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          flex: currentTabIndex === 16 ? '0 0 auto' : '1 1 0%',
          height: currentTabIndex === 16 ? 'auto' : 'auto',
          minHeight: currentTabIndex === 16 ? 'calc(100dvh - 30px)' : '0px',
          maxHeight: currentTabIndex === 16 ? 'none' : '100%',
          minWidth: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '0px',
          marginBottom: '0px',
          paddingTop: currentTabIndex === 16 ? '16px' : '10px',
          paddingBottom: currentTabIndex === 16 ? '16px' : '10px',
          paddingLeft: '0px',
          paddingRight: '0px',
        }}
        className={`w-full ${
          currentTabIndex === 16
            ? 'max-w-full overflow-visible py-4'
            : currentTabIndex === 10
              ? 'max-w-full overflow-hidden'
              : 'max-w-full overflow-visible'
        } mx-auto my-0 min-h-0 rounded-none px-0 flex flex-col justify-between shadow-none relative z-10 text-left bg-transparent [&>div]:w-full [&>div]:h-full [&>div]:max-w-full [&>div]:flex-1 [&>section]:w-full [&>section]:h-full [&>section]:max-w-full [&>section]:flex-1`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`page-view-${currentTabIndex}`}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{
              opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            className="tab-content-host w-full h-full flex flex-col items-center flex-1 min-h-0 overflow-visible"
          >
            <Suspense fallback={<GlobalLoadingOverlay />}>
              {renderActiveView()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER: Bottom Zone 9% chiều cao, nội dung bên trong căn giữa tối đa 1200px (Ẩn khi xem Trang Tải PDF) */}
      {currentTabIndex !== 16 && (
        <div
          id="el-p0-div-98"
          data-element-name="Phần tử DIV (#el-p0-div-98)"
          data-element-type="container"
          data-element-page="p0"
          style={{
            flex: '0 0 auto',
            height: 'var(--shell-bar-h, clamp(68px, 9dvh, 84px))',
            maxHeight: '88px',
            minHeight: '68px',
            padding: '0px',
            boxSizing: 'border-box',
            maxWidth: '100%',
            width: '100%',
            marginLeft: '0px',
            marginRight: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            borderRadius: '0px',
          }}
          className="w-full relative z-50 hidden md:flex items-stretch justify-center bg-transparent border-0 shadow-none"
        >
          <div
            id="app-footer-wrapper"
            data-element-name="Khung DIV bọc Footer"
            data-element-type="container"
            data-element-page="global"
            data-element-parent="el-p0-div-98"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
            className="w-full h-full flex items-stretch justify-center bg-transparent border-0 shadow-none"
          >
            <Footer
              currentTabIndex={currentTabIndex >= TABS_DATA.length ? 0 : currentTabIndex}
              onNavigate={navigatePage}
              onSelectTab={handleSelectTabWithSound}
              onShowNotification={showNotification}
              onOpenAiAssistant={() => handleSelectTabWithSound(13)}
              onOpenWallpaper={() => {
                handleSelectTabWithSound(14);
                showNotification('Mở trang Hình Nền & Giao diện (Lưu trữ lâu dài)');
              }}
            />
          </div>
        </div>
      )}

      {/* MODALS & INSPECTOR */}
      <Suspense fallback={null}>
        {mapLocation && (
          <MapModal location={mapLocation} onClose={() => setMapLocation(null)} />
        )}
        {bentoFocusKey && (
          <BentoFocusModal cardKey={bentoFocusKey} onClose={() => setBentoFocusKey(null)} />
        )}
        {selectedMilestone && (
          <MilestoneModal item={selectedMilestone} onClose={() => setSelectedMilestone(null)} />
        )}
        <XRayInspector onShowNotification={showNotification} />
        <LiquidGlassCursor />
      </Suspense>
    </div>
    </MotionConfig>
  );
}
