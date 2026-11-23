import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MapModal } from './components/common/MapModal';
import { BentoFocusModal } from './components/common/BentoFocusModal';
import { MilestoneModal } from './components/common/MilestoneModal';
import { XRayInspector } from './components/common/XRayInspector';
import { PullCord } from './components/ui/PullCord';
import { PottedPlantWidget } from './components/ui/PottedPlantWidget';
import { AiMascotWidget } from './components/ui/AiMascotWidget';

import { HomeView } from './components/views/HomeView';
import { LetterView } from './components/views/LetterView';
import { AboutView } from './components/views/AboutView';
import { EducationView } from './components/views/EducationView';
import { ServicesView } from './components/views/ServicesView';
import { ExperienceView } from './components/views/ExperienceView';
import { SkillsView } from './components/views/SkillsView';
import { ProjectsView } from './components/views/ProjectsView';
import { SystemsView } from './components/views/SystemsView';
import { InterviewView } from './components/views/InterviewView';
import { HoroscopeView } from './components/views/HoroscopeView';
import { MemoriesView } from './components/views/MemoriesView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { WallpaperView } from './components/views/WallpaperView';
import { ContactView } from './components/views/ContactView';
import { InterfaceView } from './components/views/InterfaceView';
import { PdfView } from './components/views/PdfView';
import { Modal } from './components/ui/Modal';
import { useBannerVideo } from './context/BannerVideoContext';

import { MapLocation } from './data/aboutData';
import { ExperienceMilestone } from './data/experience';
import { TABS_DATA, PAGE_NEON_COLORS } from './data/tabs';
import { useTheme } from './hooks/useTheme';
import { useGlobalHorizontalScroll } from './hooks/useGlobalHorizontalScroll';
import { usePeripheralClearance } from './hooks/usePeripheralClearance';
import { parseCssStringToStyle, getCleanImageUrl } from './data/wallpapers';
import {
  applyTypographyScaleToDocument,
  evaluateOverallLayoutTypography,
} from './config/typographyScale';
import { SoundEngine } from './components/ui/SoundEngine';
import {
  GravityBackgroundCanvas,
  resolveGravityStage,
} from './components/backgrounds/GravityBackgroundCanvas';
import { DotGridWavesCanvas } from './components/ui/DotGridWavesCanvas';

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const peripheralClearance = usePeripheralClearance(currentTabIndex !== 16);
  const { isStudioModalOpen, closeStudioModal, studioInitialPage } = useBannerVideo();

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

  // Thứ tự trang theo Menu Icon trên Header (0..11, PDF 16, Hùng Thái 12) rồi tới các trang tiện ích Footer (15, 14, 13)
  const MENU_ICON_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 12, 15, 14, 13];
  const PAGE_SLIDE_COUNTS: Record<number, number> = {
    0: 1,
    1: 4,
    2: 1,
    5: 1,
    10: 5,
  };

  const [pageSlides, setPageSlides] = useState<Record<number, number>>({
    0: 0,
    5: 0,
  });
  const [pendingSlideTarget, setPendingSlideTarget] = useState<{
    tabIndex: number;
    slide: number;
  } | null>(null);

  const { isDark, cardStyle, activeWallpaper, setWallpaper } = useTheme();
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
      viewportEl.querySelectorAll('.page-main-card, [data-main-card="true"]').forEach((el) => {
        ro.observe(el);
      });
    }

    const mo =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            scheduleEvaluate();
          })
        : null;
    if (mo) {
      mo.observe(viewportEl, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-selected', 'aria-expanded', 'data-swot'],
      });
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      ro?.disconnect();
      mo?.disconnect();
    };
  }, [currentTabIndex, pageSlides, experienceShowJobCard, experienceActiveKey]);

  // Tự động rà soát và gắn ID định danh cho toàn bộ các đối tượng DOM hiển thị chưa có ID
  useEffect(() => {
    const rootEl = document.getElementById('website-root');
    if (!rootEl) return;

    const assignMissingIds = () => {
      const pageInfo = TABS_DATA[currentTabIndex];
      const pageSlug = pageInfo?.id !== undefined ? `p${currentTabIndex}` : 'global';
      const pageTitle = pageInfo?.name || 'Trang';
      const elements = rootEl.querySelectorAll(
        'section, article, header, footer, nav, aside, main, form, div, button, a, input, select, textarea, img, video, iframe, ul, ol, li, h1, h2, h3, h4, h5, h6, p, span, svg'
      );
      const counters: Record<string, number> = {};

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const tag = el.tagName.toLowerCase();
        counters[tag] = (counters[tag] || 0) + 1;

        if (!el.id) {
          el.id = `el-${pageSlug}-${tag}-${counters[tag]}`;
        }

        // Tự động gán tên đối tượng có ngữ nghĩa nếu chưa có data-element-name
        if (!htmlEl.getAttribute('data-element-name')) {
          let derivedName = '';

          // 1. Lấy từ title, aria-label, placeholder, alt
          const titleAttr = htmlEl.getAttribute('title');
          const ariaLabel = htmlEl.getAttribute('aria-label');
          const altAttr = htmlEl.getAttribute('alt');
          const placeholderAttr = htmlEl.getAttribute('placeholder');

          if (titleAttr && titleAttr.trim()) {
            derivedName = titleAttr.trim();
          } else if (ariaLabel && ariaLabel.trim()) {
            derivedName = ariaLabel.trim();
          } else if (altAttr && altAttr.trim()) {
            derivedName = `Hình: ${altAttr.trim()}`;
          } else if (placeholderAttr && placeholderAttr.trim()) {
            derivedName = `Ô nhập: ${placeholderAttr.trim()}`;
          } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            const headingText = (htmlEl.innerText || htmlEl.textContent || '').trim().replace(/\s+/g, ' ');
            derivedName = headingText ? `Tiêu đề: ${headingText.slice(0, 40)}` : `Tiêu đề ${tag.toUpperCase()}`;
          } else if (tag === 'button') {
            const btnText = (htmlEl.innerText || htmlEl.textContent || '').trim().replace(/\s+/g, ' ');
            derivedName = btnText ? `Nút: ${btnText.slice(0, 35)}` : 'Nút bấm tương tác';
          } else if (tag === 'a') {
            const linkText = (htmlEl.innerText || htmlEl.textContent || '').trim().replace(/\s+/g, ' ');
            derivedName = linkText ? `Liên kết: ${linkText.slice(0, 35)}` : 'Đường dẫn liên kết';
          } else if (htmlEl.classList.contains('bento-card') || htmlEl.classList.contains('glass-card') || htmlEl.getAttribute('data-section-card')) {
            const cardHeading = htmlEl.querySelector('h1, h2, h3, h4, h5, h6');
            const hText = cardHeading ? (cardHeading.textContent || '').trim().replace(/\s+/g, ' ') : '';
            derivedName = hText ? `Thẻ: ${hText.slice(0, 40)}` : `Thẻ nội dung ${pageTitle}`;
          } else {
            // Lấy text ngắn gọn nếu có
            const shortText = (htmlEl.innerText || '').trim().replace(/\s+/g, ' ');
            if (shortText && shortText.length <= 40 && !shortText.includes('\n')) {
              derivedName = `${tag.toUpperCase()}: ${shortText}`;
            } else {
              derivedName = `Phần tử ${tag.toUpperCase()} (#${el.id})`;
            }
          }

          htmlEl.setAttribute('data-element-name', derivedName);
          if (!htmlEl.getAttribute('data-element-page')) {
            htmlEl.setAttribute('data-element-page', pageSlug);
          }
          if (!htmlEl.getAttribute('data-element-type')) {
            const derivedType =
              ['section', 'article', 'main'].includes(tag) ? 'section'
              : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? 'heading'
              : tag === 'button' ? 'button'
              : tag === 'a' ? 'link'
              : tag === 'img' ? 'image'
              : htmlEl.classList.contains('bento-card') ? 'card'
              : 'container';
            htmlEl.setAttribute('data-element-type', derivedType);
          }
        }
      });
    };

    assignMissingIds();
    const observer = new MutationObserver(() => {
      assignMissingIds();
    });
    observer.observe(rootEl, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [currentTabIndex]);

  const showNotification = useCallback((_msg: string) => {}, []);

  // Điều hướng Tới trang / Qua trang theo thứ tự sắp xếp trên Menu Icon; nếu trang có slide thì qua từng slide rồi mới tới trang kế tiếp
  const navigatePage = useCallback(
    (direction: number) => {
      SoundEngine.playPageFlip();
      const activeIdx = MENU_ICON_ORDER.includes(currentTabIndex) ? currentTabIndex : 0;
      const totalSlides = PAGE_SLIDE_COUNTS[activeIdx] || 1;
      const currentSlide = pageSlides[activeIdx] ?? 0;

      if (direction > 0) {
        if (totalSlides > 1 && currentSlide < totalSlides - 1) {
          const nextSlide = currentSlide + 1;
          setPageSlides((prev) => ({ ...prev, [activeIdx]: nextSlide }));
          window.dispatchEvent(
            new CustomEvent('app:set-slide', {
              detail: { tabIndex: activeIdx, slide: nextSlide },
            })
          );
          return;
        }
        const pos = MENU_ICON_ORDER.indexOf(activeIdx);
        const nextPos = (pos + 1) % MENU_ICON_ORDER.length;
        const nextTab = MENU_ICON_ORDER[nextPos];
        if ((PAGE_SLIDE_COUNTS[nextTab] || 1) > 1) {
          setPendingSlideTarget({ tabIndex: nextTab, slide: 0 });
        }
        setCurrentTabIndex(nextTab);
      } else if (direction < 0) {
        if (totalSlides > 1 && currentSlide > 0) {
          const prevSlide = currentSlide - 1;
          setPageSlides((prev) => ({ ...prev, [activeIdx]: prevSlide }));
          window.dispatchEvent(
            new CustomEvent('app:set-slide', {
              detail: { tabIndex: activeIdx, slide: prevSlide },
            })
          );
          return;
        }
        const pos = MENU_ICON_ORDER.indexOf(activeIdx);
        const prevPos = (pos - 1 + MENU_ICON_ORDER.length) % MENU_ICON_ORDER.length;
        const prevTab = MENU_ICON_ORDER[prevPos];
        const prevTotalSlides = PAGE_SLIDE_COUNTS[prevTab] || 1;
        if (prevTotalSlides > 1) {
          setPendingSlideTarget({ tabIndex: prevTab, slide: prevTotalSlides - 1 });
        }
        setCurrentTabIndex(prevTab);
      }
    },
    [currentTabIndex, pageSlides]
  );

  const activeTheme = cardStyle || (isDark ? 'dark-liquid-glass' : 'neumorphism-beyond');

  const renderActiveView = () => {
    switch (currentTabIndex) {
      case 0:
        return (
          <HomeView
            currentTheme={activeTheme}
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
        return <AiAssistantView currentTheme={activeTheme} />;
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
            onShowNotification={showNotification}
            onNavigateContact={() => handleSelectTabWithSound(12)}
            onNavigatePage={handleSelectTabWithSound}
          />
        );
    }
  };

  return (
    <div
      id="website-root"
      data-element-name="Khung chứa toàn bộ trang web"
      data-element-type="container"
      data-element-page="global"
      style={{
        padding: '0px',
        gap: currentTabIndex === 16 ? '0px' : 'var(--shell-section-gap, 10px)',
      }}
      className="h-screen w-screen overflow-hidden flex flex-col items-center m-0 p-0 select-text relative transition-colors duration-300 ease-in-out"
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
            ) : activeWallpaper.type === 'webgl' ? (
              activeWallpaper.id === 'webgl-dot-grid-waves' ? (
                <div
                  key={activeWallpaper.id}
                  className="relative w-full h-full overflow-hidden"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      background: isDark ? '#07080D' : '#F4F2EE',
                      transition: 'background 0.5s ease',
                    }}
                  />
                  <DotGridWavesCanvas isDark={isDark} />
                </div>
              ) : (
                (() => {
                  const gConfig = activeWallpaper.gravityConfig;
                  const paletteId = gConfig?.paletteId || 'autoMorph';
                  const morphOnPageChange = false;
                  const activeSlide = pageSlides[currentTabIndex] ?? 0;
                  const resolvedStage = resolveGravityStage(
                    paletteId,
                    currentTabIndex,
                    activeSlide,
                    morphOnPageChange
                  );
                  return (
                    <div
                      key={activeWallpaper.id}
                      className="relative w-full h-full overflow-hidden"
                    >
                      <div
                        id="gravity-gradient-backdrop"
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{
                          background: resolvedStage.bgGradient,
                          transition: 'background 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
                        }}
                      />
                      <GravityBackgroundCanvas
                        paletteId={paletteId}
                        pageIndex={currentTabIndex}
                        slideIndex={activeSlide}
                        morphOnPageChange={morphOnPageChange}
                        isDark={isDark}
                      />
                    </div>
                  );
                })()
              )
            ) : activeWallpaper.type === 'css' || activeWallpaper.type === 'gradient' ? (
              <div
                key={activeWallpaper.id}
                className="w-full h-full transition-all duration-500"
                style={
                  activeWallpaper.previewStyle && Object.keys(activeWallpaper.previewStyle).length > 0
                    ? activeWallpaper.previewStyle
                    : parseCssStringToStyle(activeWallpaper.value || activeWallpaper.bg || '')
                }
              />
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
            </div>

            <div aria-hidden="true" className="ambient-layer-depth" />

            <div aria-hidden="true" className="ambient-layer-transition" />
          </>
        )}
      </div>
        );
      })()}

      {/* ĐÈN KÉO DÂY (PULL CORD) Ở GÓC TRÊN BÊN TRÁI HEADER — TỰ ẨN KHI KHÔNG ĐỦ CHỖ TRỐNG */}
      {currentTabIndex !== 16 && (
        <PullCord
          visible={peripheralClearance.showLeftLamp}
          leftOffsetPx={peripheralClearance.lampLeftOffsetPx}
        />
      )}

      {/* HEADER: 10% chiều cao khung hình (Ẩn khi xem Trang Tải PDF) */}
      {currentTabIndex !== 16 && (
        <div
          id="app-header-container"
          style={{
            flex: '0 0 10%',
            height: '10%',
            maxHeight: '10%',
            minHeight: 0,
          }}
          className="w-full relative z-40 flex items-stretch justify-center bg-transparent border-0 shadow-none rounded-none"
        >
          <Header
            pages={TABS_DATA}
            currentPage={currentTabIndex}
            currentTheme={activeTheme}
            onSelectPage={handleSelectTabWithSound}
            onShowNotification={showNotification}
          />
        </div>
      )}

      {/* MAIN CENTER CARD: Chiếm % chiều cao còn lại (100% khi xem Trang Tải PDF) */}
      <main
        ref={mainViewportRef}
        id="global-content-viewport"
        data-element-name="Khung hiển thị nội dung chính"
        data-element-type="container"
        data-element-page="global"
        data-element-parent="website-root"
        style={{
          width: '100%',
          maxWidth: currentTabIndex === 16 ? '1250px' : '100%',
          flex: '1 1 0%',
          height:
            currentTabIndex === 16
              ? '100%'
              : 'calc(80% - (var(--shell-section-gap, 10px) * 2))',
          minHeight: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '0px',
          marginBottom: '0px',
        }}
        className={`w-full ${
          currentTabIndex === 16 ? 'max-w-[1250px]' : 'max-w-full'
        } mx-auto my-0 min-h-0 rounded-[var(--radius-main,14px)] p-0 flex flex-col justify-between overflow-visible shadow-none relative z-10 text-left bg-transparent [&>div]:w-full [&>div]:h-full [&>div]:max-w-full [&>div]:flex-1 [&>section]:w-full [&>section]:h-full [&>section]:max-w-full [&>section]:flex-1`}
      >
        <div
          key={`page-view-${currentTabIndex}`}
          className="tab-content-host w-full h-full flex flex-col items-center flex-1 min-h-0 overflow-visible"
        >
          {renderActiveView()}
        </div>
      </main>

      {/* FOOTER: 10% chiều cao khung hình (Ẩn khi xem Trang Tải PDF) */}
      {currentTabIndex !== 16 && (
        <div
          id="el-p0-div-98"
          data-element-name="Phần tử DIV (#el-p0-div-98)"
          data-element-type="container"
          data-element-page="p0"
          style={{
            flex: '0 0 10%',
            height: '10%',
            maxHeight: '10%',
            minHeight: 0,
          }}
          className="w-full relative z-50 flex items-stretch justify-center bg-transparent border-0 shadow-none rounded-none"
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
      )}

      {/* CHẬU CÂY BÊN TRÁI FOOTER & NHÂN VẬT AI BÊN PHẢI FOOTER — TỰ ẨN KHI KHÔNG ĐỦ CHỖ TRỐNG */}
      {currentTabIndex !== 16 && (
        <>
          <PottedPlantWidget
            visible={peripheralClearance.showLeftPlant}
            widthPx={peripheralClearance.plantWidthPx}
            isDark={isDark}
            onShowNotification={showNotification}
          />
          <AiMascotWidget
            visible={peripheralClearance.showRightMascot}
            widthPx={peripheralClearance.mascotWidthPx}
            isDark={isDark}
            onOpenAiAssistant={() => handleSelectTabWithSound(13)}
          />
        </>
      )}


      {/* MODALS & INSPECTOR */}
      <MapModal location={mapLocation} onClose={() => setMapLocation(null)} />
      <BentoFocusModal cardKey={bentoFocusKey} onClose={() => setBentoFocusKey(null)} />
      <MilestoneModal item={selectedMilestone} onClose={() => setSelectedMilestone(null)} />
      <XRayInspector onShowNotification={showNotification} />
    </div>
  );
}
