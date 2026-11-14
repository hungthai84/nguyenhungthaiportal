import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { MapModal } from './components/common/MapModal';
import { BentoFocusModal } from './components/common/BentoFocusModal';
import { MilestoneModal } from './components/common/MilestoneModal';
import { XRayInspector } from './components/common/XRayInspector';

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

import { MapLocation } from './data/about';
import { ExperienceMilestone } from './data/experience';
import { TABS_DATA, PAGE_NEON_COLORS } from './data/tabs';
import { useTheme } from './hooks/useTheme';
import { parseCssStringToStyle, getCleanImageUrl } from './data/wallpapers';
import { applyTypographyScaleToDocument } from './config/typographyScale';
import { SoundEngine } from './components/ui/SoundEngine';

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [mapLocation, setMapLocation] = useState<MapLocation | null>(null);
  const [bentoFocusKey, setBentoFocusKey] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<ExperienceMilestone | null>(null);

  // Thứ tự trang theo Menu Icon trên Header (0..16)
  const MENU_ICON_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const PAGE_SLIDE_COUNTS: Record<number, number> = {
    1: 1,
    2: 1,
    5: 1,
    10: 6,
  };

  const [pageSlides, setPageSlides] = useState<Record<number, number>>({
    5: 0,
  });
  const [pendingSlideTarget, setPendingSlideTarget] = useState<{
    tabIndex: number;
    slide: number;
  } | null>(null);

  const { isDark, activeWallpaper, setWallpaper } = useTheme();

  // Phát âm thanh khi chọn click & khi chuyển trang trên toàn ứng dụng
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
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  const handleSelectTabWithSound = useCallback((nextIndex: number) => {
    setCurrentTabIndex((prev) => {
      if (prev !== nextIndex) {
        SoundEngine.playPageFlip();
      } else {
        SoundEngine.playTap();
      }
      return nextIndex;
    });
  }, []);

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
    const avatarUrl = 'https://res.cloudinary.com/q5tpzaxk/image/upload/w_128,h_128,c_fill,g_face,r_max/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.png';
    let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.type = 'image/png';
    iconLink.href = avatarUrl;

  }, []);

  // Kết nối hệ thống Typography tập trung (src/config/typographyScale.ts) với CSS Custom Properties
  useEffect(() => {
    applyTypographyScaleToDocument();
  }, []);

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

  const showNotification = useCallback((_msg: string) => {
    // Notifications disabled per user request
    setToastMessage(null);
  }, []);

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

  const activeTheme = isDark ? 'dark-neon' : 'light-glass';

  const renderActiveView = () => {
    switch (currentTabIndex) {
      case 0:
        return (
          <HomeView
            currentTheme={activeTheme}
            onShowNotification={showNotification}
            onNavigateContact={() => setCurrentTabIndex(12)}
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
            onNavigateTab={(tabIndex) => setCurrentTabIndex(tabIndex)}
          />
        );
      case 6:
        return <SkillsView currentTheme={activeTheme} />;
      case 7:
        return <ProjectsView currentTheme={activeTheme} />;
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
            onNavigateContact={() => setCurrentTabIndex(12)}
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
      className="h-screen w-screen overflow-hidden flex flex-col justify-between m-0 select-text relative px-[25px]"
      style={{ paddingLeft: '25px', paddingRight: '25px' }}
    >
      {/* GLOBAL DYNAMIC WALLPAPER LAYER */}
      <div
        id="global-wallpaper-layer"
        data-element-name="Lớp nền hình nền động toàn website"
        data-element-type="media"
        data-element-page="global"
        data-element-parent="website-root"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        {activeWallpaper?.id === 'none' ||
        (!activeWallpaper?.value &&
          !activeWallpaper?.bg &&
          (!activeWallpaper?.previewStyle || Object.keys(activeWallpaper.previewStyle).length === 0)) ? (
          <div
            className="w-full h-full transition-colors duration-500"
            style={{ backgroundColor: isDark ? '#0B1220' : '#F5F7FD' }}
          />
        ) : activeWallpaper.type === 'video' ? (
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
              className="w-full h-full object-cover"
            />
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
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{
              backgroundImage: `url('${getCleanImageUrl(activeWallpaper.value || activeWallpaper.bg || '')}')`,
            }}
          />
        )}
      </div>

      {/* HEADER (Ẩn khi xem Trang Tải PDF) */}
      {currentTabIndex !== 16 && (
        <Header
          pages={TABS_DATA}
          currentPage={currentTabIndex}
          currentTheme={activeTheme}
          onSelectPage={handleSelectTabWithSound}
          onShowNotification={showNotification}
        />
      )}

      {/* MAIN CENTER CARD */}
      <main
        id="global-content-viewport"
        data-element-name="Khung hiển thị nội dung chính"
        data-element-type="container"
        data-element-page="global"
        data-element-parent="website-root"
        style={{ width: '100%', maxWidth: '1250px', height: '100%', maxHeight: '100%', marginLeft: 'auto', marginRight: 'auto' }}
        className="w-full max-w-[1250px] mx-auto flex-1 my-[4px] sm:my-[6px] lg:my-[8px] min-h-0 rounded-[14px] p-0 flex flex-col justify-between overflow-hidden shadow-none relative z-10 text-left h-full bg-transparent [&>div]:w-full [&>div]:h-full [&>div]:max-w-full [&>div]:flex-1 [&>section]:w-full [&>section]:h-full [&>section]:max-w-full [&>section]:flex-1"
      >
        {renderActiveView()}

        <Toast message={toastMessage} />
      </main>

      {/* FOOTER (Ẩn khi xem Trang Tải PDF) */}
      {currentTabIndex !== 16 && (
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
      )}

      {/* MODALS & INSPECTOR */}
      <MapModal location={mapLocation} onClose={() => setMapLocation(null)} />
      <BentoFocusModal cardKey={bentoFocusKey} onClose={() => setBentoFocusKey(null)} />
      <MilestoneModal item={selectedMilestone} onClose={() => setSelectedMilestone(null)} />
      <XRayInspector onShowNotification={showNotification} />
    </div>
  );
}
