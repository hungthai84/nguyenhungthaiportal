'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TABS_DATA, TabItem } from '@/data/tabs';
import { WeatherWidget } from '@/components/common/WeatherWidget';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import {
  CARD_STYLE_GROUPS,
  THEME_FOUR_WORD_NAMES,
  getCardStyleConfig,
} from '@/config/ui/cardStyles';
import { CARD_EFFECT_PRESETS } from '@/config/ui/themeDefaults';
import { getSavedMutedPref, saveMutedPref, AUDIO_PREF_EVENT } from '@/utils/audioPreference';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const normalizeSearchText = (input: string) =>
  (input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();

export interface MobileTopBarAndFloatingNavProps {
  currentTabIndex: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  isAtLastPage: boolean;
  onSelectPage: (index: number) => void;
  onNavigatePage: (direction: number) => void;
  onBackToTop: () => void;
  onShowNotification?: (msg: string) => void;
}

// 13 trang danh mục chính theo đúng thứ tự yêu cầu:
// 1. Trang Chủ (0), 2. Thư Ngỏ (1), 3. Giới Thiệu (2), 4. Học Vấn (3), 5. Lĩnh Vực / Dịch vụ (4),
// 6. Kinh Nghiệm (5), 7. Kỹ Năng (6), 8. Dự Án (7), 9. Phỏng Vấn (9), 10. Tử Vi (10),
// 11. Kỷ Niệm (11), 12. Hệ Thống (8), 13. Liên Hệ (12)
const MOBILE_PRIMARY_PAGE_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8, 12];

const PAGE_ACCENT_MAP: Record<
  number,
  { color: string; subVi: string; subEn: string; keywords: string }
> = {
  0: { color: '#F59E0B', subVi: 'Tổng quan', subEn: 'Overview', keywords: 'trang chu home overview' },
  1: { color: '#F97316', subVi: 'Tâm thư', subEn: 'Cover Letter', keywords: 'thu ngo letter tam thu' },
  2: { color: '#F43F5E', subVi: 'Hồ sơ', subEn: 'Profile', keywords: 'gioi thieu about profile' },
  3: { color: '#0EA5E9', subVi: 'Đào tạo', subEn: 'Education', keywords: 'hoc van education dao tao' },
  4: {
    color: '#10B981',
    subVi: 'Lĩnh vực',
    subEn: 'Domains',
    keywords: 'linh vuc dich vu services domains',
  },
  5: {
    color: '#06B6D4',
    subVi: '22+ Năm',
    subEn: '22+ Years',
    keywords: 'kinh nghiem experience timeline',
  },
  6: { color: '#8B5CF6', subVi: 'SWOT CX', subEn: 'SWOT Matrix', keywords: 'ky nang skills swot' },
  7: {
    color: '#14B8A6',
    subVi: 'Portfolio',
    subEn: 'Portfolio',
    keywords: 'du an projects portfolio',
  },
  8: {
    color: '#3B82F6',
    subVi: 'Công nghệ',
    subEn: 'Systems',
    keywords: 'he thong systems cong nghe',
  },
  9: {
    color: '#84CC16',
    subVi: 'Hỏi & Đáp',
    subEn: 'Interview',
    keywords: 'phong van interview q&a',
  },
  10: {
    color: '#F97316',
    subVi: 'Phong thủy',
    subEn: 'Horoscope',
    keywords: 'tu vi horoscope phong thuy',
  },
  11: {
    color: '#A855F7',
    subVi: 'Khoảnh khắc',
    subEn: 'Memories',
    keywords: 'ky niem memories hinh anh',
  },
  12: {
    color: '#6366F1',
    subVi: 'Kết nối',
    subEn: 'Contact',
    keywords: 'lien he contact email phone',
  },
  13: {
    color: '#0EA5E9',
    subVi: 'Trợ lý 24/7',
    subEn: '24/7 AI',
    keywords: 'ai tri nhan tro ly ho tro assistant',
  },
  14: {
    color: '#EC4899',
    subVi: 'Tùy chỉnh',
    subEn: 'Wallpaper',
    keywords: 'hinh nen wallpaper background',
  },
  15: {
    color: '#6366F1',
    subVi: 'Phong cách',
    subEn: 'Interface',
    keywords: 'giao dien theme hieu ung effect',
  },
  16: {
    color: '#2563EB',
    subVi: 'Hồ sơ PDF',
    subEn: 'PDF CV',
    keywords: 'cv pdf ho so tai ve',
  },
};

const CONTACT_COPY_PAYLOAD =
  'Nguyễn Hùng Thái | Email: hungthai84@gmail.com | Hotline/Zalo: +84 0909097882 | LinkedIn: https://www.linkedin.com/in/hungthai84/';

export const MobileTopBarAndFloatingNav: React.FC<MobileTopBarAndFloatingNavProps> = ({
  currentTabIndex,
  hasPrevPage,
  hasNextPage,
  isAtLastPage: _isAtLastPage,
  onSelectPage,
  onNavigatePage,
  onBackToTop,
  onShowNotification,
}) => {
  const { language, setLanguageMode, t } = useLanguage();
  const isEn = language === 'en';
  const { cardStyle, setCardStyle, cardEffect, setCardEffect, isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showEffectPicker, setShowEffectPicker] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => getSavedMutedPref(true));
  const [copiedContact, setCopiedContact] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync audio mute state across header/footer/mobile menu
  useEffect(() => {
    const syncMute = () => setIsMuted(getSavedMutedPref(true));
    const onAudioPref = (e: Event) => {
      const detail = (e as CustomEvent<{ muted?: boolean }>).detail;
      if (typeof detail?.muted === 'boolean') {
        setIsMuted(detail.muted);
      } else {
        syncMute();
      }
    };
    window.addEventListener(AUDIO_PREF_EVENT, onAudioPref);
    window.addEventListener('storage', syncMute);
    return () => {
      window.removeEventListener(AUDIO_PREF_EVENT, onAudioPref);
      window.removeEventListener('storage', syncMute);
    };
  }, []);

  // Hide or yield floating nav while virtual keyboard / text input is focused
  useEffect(() => {
    const isTextControl = (el: Element | null) => {
      if (!el || !(el instanceof HTMLElement)) return false;
      if (el.id === 'mobile-drawer-search-input') return false;
      const tag = el.tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (tag === 'INPUT') {
        const type = ((el as HTMLInputElement).type || 'text').toLowerCase();
        return !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color'].includes(
          type
        );
      }
      return el.isContentEditable;
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (isTextControl(e.target as Element | null)) {
        setIsInputFocused(true);
      }
    };
    const handleFocusOut = () => {
      window.setTimeout(() => {
        setIsInputFocused(isTextControl(document.activeElement));
      }, 60);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const orderedPrimaryPages = useMemo(() => {
    return MOBILE_PRIMARY_PAGE_ORDER.map((id) => TABS_DATA.find((p) => p.id === id)).filter(
      (p): p is TabItem => Boolean(p)
    );
  }, []);

  const normalizedQuery = useMemo(() => normalizeSearchText(searchQuery), [searchQuery]);

  const filteredPages = useMemo(() => {
    if (!normalizedQuery) return orderedPrimaryPages;
    return orderedPrimaryPages.filter((page) => {
      const meta = PAGE_ACCENT_MAP[page.id];
      const haystack = normalizeSearchText(
        `${page.name} ${page.nameEn || ''} ${page.shortTitle || ''} ${page.shortTitleEn || ''} ${meta?.subVi || ''} ${meta?.subEn || ''} ${meta?.keywords || ''}`
      );
      return haystack.includes(normalizedQuery);
    });
  }, [orderedPrimaryPages, normalizedQuery]);

  const matchesUtility = useCallback(
    (keywords: string) => {
      if (!normalizedQuery) return true;
      return normalizeSearchText(keywords).includes(normalizedQuery);
    },
    [normalizedQuery]
  );

  const activePageMeta = useMemo(
    () => TABS_DATA.find((p) => p.id === currentTabIndex) || TABS_DATA[0],
    [currentTabIndex]
  );

  const activePageTitle = useMemo(() => {
    if (!activePageMeta) return isEn ? 'Home' : 'Trang chủ';
    return isEn && activePageMeta.shortTitleEn
      ? activePageMeta.shortTitleEn
      : activePageMeta.shortTitle || activePageMeta.name;
  }, [activePageMeta, isEn]);

  const activeAccent = PAGE_ACCENT_MAP[currentTabIndex]?.color || '#6366F1';

  // Measure visual scroll progress relative to total scrollable page height
  const updateScrollProgress = useCallback((eventTarget?: EventTarget | null) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const viewport = document.getElementById('global-content-viewport');
    let targetEl: HTMLElement | null = null;

    if (
      eventTarget instanceof HTMLElement &&
      viewport?.contains(eventTarget) &&
      eventTarget.scrollHeight > eventTarget.clientHeight + 2
    ) {
      targetEl = eventTarget;
    } else if (viewport) {
      const candidates = Array.from(
        viewport.querySelectorAll<HTMLElement>(
          '.main-card-scroll-viewport, #education-disc-bookshelf-view, [id$="-main-card"], .overflow-y-auto, .overflow-auto'
        )
      );
      const scrollable = candidates.filter((el) => {
        if (el.scrollHeight <= el.clientHeight + 2) return false;
        const style = window.getComputedStyle(el);
        return style.overflowY === 'auto' || style.overflowY === 'scroll';
      });
      targetEl = scrollable.find((el) => el.scrollTop > 0) || scrollable[0] || null;
    }

    let ratio = 0;
    if (targetEl) {
      const maxScroll = Math.max(1, targetEl.scrollHeight - targetEl.clientHeight);
      ratio = clamp(targetEl.scrollTop / maxScroll, 0, 1);
    } else {
      const docEl = document.documentElement;
      const maxDocScroll = docEl.scrollHeight - docEl.clientHeight;
      if (maxDocScroll > 2) {
        ratio = clamp((window.scrollY || docEl.scrollTop) / maxDocScroll, 0, 1);
      }
    }

    setScrollProgress((prev) => (Math.abs(prev - ratio) < 0.005 ? prev : ratio));
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const scheduleMeasure = (target?: EventTarget | null) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateScrollProgress(target);
      });
    };

    const handleScroll = (e: Event) => {
      scheduleMeasure(e.target);
    };
    const handleResize = () => {
      scheduleMeasure();
    };

    updateScrollProgress();
    const settleTimer = window.setTimeout(() => updateScrollProgress(), 220);

    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    const viewport = document.getElementById('global-content-viewport');
    const ro =
      typeof ResizeObserver !== 'undefined' && viewport
        ? new ResizeObserver(() => scheduleMeasure())
        : null;
    if (ro && viewport) {
      ro.observe(viewport);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
    };
  }, [currentTabIndex, updateScrollProgress]);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setShowThemePicker(false);
    setShowEffectPicker(false);
  }, []);

  // Close drawer automatically on route change
  useEffect(() => {
    closeDrawer();
  }, [currentTabIndex, closeDrawer]);

  // Close drawer on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeDrawer]);

  const activeThemeConfig = getCardStyleConfig(cardStyle);
  const currentThemeBadge = isEn
    ? THEME_FOUR_WORD_NAMES[cardStyle]?.en || t(activeThemeConfig.shortBadge)
    : THEME_FOUR_WORD_NAMES[cardStyle]?.vi || activeThemeConfig.shortBadge;

  const activeEffectPreset =
    CARD_EFFECT_PRESETS.find((e) => e.id === cardEffect) || CARD_EFFECT_PRESETS[0];

  const handleToggleLightDarkQuick = () => {
    SoundEngine.playGlassChime();
    const activeGroup =
      CARD_STYLE_GROUPS.find(
        (g) => g.lightMode === cardStyle || g.darkMode === cardStyle || g.defaultMode === cardStyle
      ) || CARD_STYLE_GROUPS[0];
    const nextStyle =
      isDark && activeGroup.lightMode
        ? activeGroup.lightMode
        : !isDark && activeGroup.darkMode
          ? activeGroup.darkMode
          : isDark
            ? 'liquid-glass'
            : 'dark-liquid-glass';
    setCardStyle(nextStyle);
  };

  const handleToggleAudioMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    SoundEngine.setGlobalMuted(nextMuted);
    saveMutedPref(nextMuted);
    if (!nextMuted) {
      SoundEngine.playGlassChime();
    }
  };

  const handleSelectPageAndClose = (pageId: number) => {
    SoundEngine.playPageSpecificSound(pageId);
    onSelectPage(pageId);
    closeDrawer();
  };

  const handleOpenWeatherForecast = () => {
    SoundEngine.playTap();
    closeDrawer();
    window.setTimeout(() => {
      const mobileWeatherTrigger = document.querySelector<HTMLElement>(
        '#mobile-top-controls-bar [data-weather-card="true"]'
      );
      mobileWeatherTrigger?.click();
    }, 120);
  };

  const handleDownloadPdf = () => {
    SoundEngine.playTap();
    closeDrawer();
    if (currentTabIndex === 16) {
      window.dispatchEvent(new CustomEvent('app:export-pdf'));
    } else {
      try {
        sessionStorage.setItem('hungthai_pending_pdf_export', '1');
      } catch {}
      onSelectPage(16);
    }
  };

  const handleCopyContact = async () => {
    SoundEngine.playGlassChime();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(CONTACT_COPY_PAYLOAD);
      } else {
        const ta = document.createElement('textarea');
        ta.value = CONTACT_COPY_PAYLOAD;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedContact(true);
      onShowNotification?.(
        isEn
          ? '✓ Contact information copied to clipboard'
          : '✓ Đã sao chép thông tin liên hệ'
      );
      window.setTimeout(() => setCopiedContact(false), 2200);
    } catch {}
  };

  const showNavQuickRow = matchesUtility('trang chu home len dau trang back to top quick');
  const showThemeUtility = matchesUtility('giao dien sang toi light dark mode theme');
  const showWallpaperUtility = matchesUtility('hinh nen wallpaper background');
  const showEffectUtility = matchesUtility('hieu ung giao dien glass float glow shine tilt effect');
  const showAudioUtility = matchesUtility('am thanh audio sound mute unmute');
  const showLanguageUtility = matchesUtility('ngon ngu language tieng viet english vi en');
  const showGroup2 =
    showThemeUtility ||
    showWallpaperUtility ||
    showEffectUtility ||
    showAudioUtility ||
    showLanguageUtility;

  const showWeatherUtility = matchesUtility('thoi tiet weather du bao forecast');
  const showAiUtility = matchesUtility('tro ly ai tri nhan assistant chatbot 24/7');
  const showGroup3 = showWeatherUtility || showAiUtility;

  const showViewCvUtility = matchesUtility('xem cv ho so pdf resume');
  const showDownloadPdfUtility = matchesUtility('tai cv pdf download export print');
  const showPortfolioUtility = matchesUtility('xem portfolio du an projects');
  const showCopyContactUtility = matchesUtility('sao chep thong tin lien he copy email phone');
  const showGroup4 =
    showViewCvUtility || showDownloadPdfUtility || showPortfolioUtility || showCopyContactUtility;

  const glassSurfaceStyle: React.CSSProperties = {
    background: isDark
      ? 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #141824)) 92%, #090d16)'
      : 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 94%, #f8fafc)',
    borderColor: isOpen
      ? activeAccent
      : 'var(--surface-primary-border, var(--border-card, rgba(148,163,184,0.34)))',
    boxShadow: 'var(--surface-primary-shadow, 0 8px 22px rgba(15, 23, 42, 0.16))',
    backdropFilter: 'blur(24px) saturate(175%)',
    WebkitBackdropFilter: 'blur(24px) saturate(175%)',
  };

  const pct = Math.round(scrollProgress * 100);
  const ringRadius = 16;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeDashoffset = ringCircumference * (1 - scrollProgress);

  const primaryPos = MOBILE_PRIMARY_PAGE_ORDER.indexOf(currentTabIndex);
  const isInPrimaryList = primaryPos !== -1;
  const effectiveHasPrev = isInPrimaryList ? primaryPos > 0 : hasPrevPage;
  const effectiveHasNext = isInPrimaryList
    ? primaryPos < MOBILE_PRIMARY_PAGE_ORDER.length - 1
    : hasNextPage;
  const badgeNumerator = isInPrimaryList ? primaryPos + 1 : currentTabIndex + 1;
  const badgeDenominator = isInPrimaryList ? MOBILE_PRIMARY_PAGE_ORDER.length : TABS_DATA.length;

  const handleMobileFloatingPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!effectiveHasPrev) return;
    if (isInPrimaryList) {
      const targetTab = MOBILE_PRIMARY_PAGE_ORDER[primaryPos - 1];
      SoundEngine.playPageFlip();
      onSelectPage(targetTab);
    } else {
      onNavigatePage(-1);
    }
  };

  const handleMobileFloatingNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!effectiveHasNext) return;
    if (isInPrimaryList) {
      const targetTab = MOBILE_PRIMARY_PAGE_ORDER[primaryPos + 1];
      SoundEngine.playPageFlip();
      onSelectPage(targetTab);
    } else {
      onNavigatePage(1);
    }
  };

  return (
    <>
      {/* 1. MOBILE TOP BAR (< 768px): ICON DANH MỤC GÓC TRÊN TRÁI + THỜI TIẾT BÊN PHẢI PHÍA TRÊN MAIN CARD */}
      <div
        id="mobile-top-controls-bar"
        data-element-name="Thanh điều khiển đầu trang Mobile"
        className="md:hidden sticky top-0 z-[9995] w-full max-w-[var(--home-main-card-w,calc(100vw-16px))] mx-auto pt-1.5 pb-0.5 px-0 flex items-center justify-between gap-2 shrink-0 select-none"
      >
        {/* GÓC TRÊN BÊN TRÁI: NÚT ICON DANH MỤC (>= 44x44px, Glass UI) */}
        <motion.button
          id="mobile-menu-trigger-btn"
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          aria-expanded={isOpen}
          aria-controls="mobile-menu-drawer-panel"
          aria-label={isEn ? 'Open category menu' : 'Mở menu danh mục'}
          onClick={() => {
            SoundEngine.playTap();
            setIsOpen((prev) => !prev);
          }}
          style={glassSurfaceStyle}
          className="h-[44px] min-w-[44px] min-h-[44px] px-2 min-[375px]:px-2.5 rounded-full border flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)] font-play shrink-0 max-w-[calc(100%-152px)] min-[375px]:max-w-[calc(100%-164px)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs transition-transform"
            style={{ backgroundColor: activeAccent }}
          >
            <WebIcon name={isOpen ? 'x' : 'layout-grid'} className="w-4 h-4 text-white shrink-0" />
          </span>
          <span className="text-[12.5px] font-bold tracking-tight truncate text-[var(--text-primary)] pr-1">
            {activePageTitle}
          </span>
        </motion.button>

        {/* PHÍA TRÊN BÊN PHẢI MAIN CARD: TIỆN ÍCH THỜI TIẾT */}
        <div className="shrink-0 min-w-0 flex items-center justify-end">
          <WeatherWidget onShowNotification={onShowNotification} />
        </div>
      </div>

      {/* 2. BẢNG MENU DANH MỤC POPOVER / DRAWER TRƯỢT TỪ GÓC TRÊN BÊN TRÁI (CHỈ MOBILE < 768px) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                className="md:hidden fixed inset-0 z-[10050] flex items-start justify-start pointer-events-auto"
                style={{
                  paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
                  paddingLeft: 'max(10px, env(safe-area-inset-left, 10px))',
                  paddingRight: 'max(10px, env(safe-area-inset-right, 10px))',
                  paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
                }}
              >
                {/* Scrim nền mờ đóng menu khi chạm ra ngoài */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={closeDrawer}
                  className="fixed inset-0 bg-slate-950/45 backdrop-blur-[4px]"
                  aria-hidden="true"
                />

                {/* Popover / Drawer Kính Mờ */}
                <motion.aside
                  id="mobile-menu-drawer-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label={isEn ? 'Navigation & Utilities Menu' : 'Menu Danh mục & Tiện ích'}
                  initial={{ opacity: 0, x: -26, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -22, y: -6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.8 }}
                  style={{
                    background: isDark
                      ? 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #111827)) 94%, #090d16)'
                      : 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 96%, #f8fafc)',
                    borderColor:
                      'var(--surface-primary-border, var(--border-card, rgba(148,163,184,0.34)))',
                    boxShadow: '0 24px 56px -12px rgba(15, 23, 42, 0.48)',
                    backdropFilter: 'blur(26px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(26px) saturate(180%)',
                  }}
                  className="relative z-10 w-full max-w-[min(368px,calc(100vw-20px))] max-h-[calc(100dvh-24px-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] rounded-[22px] border flex flex-col overflow-hidden font-play text-[var(--text-primary)] select-none"
                >
                  {/* Header cố định của Drawer */}
                  <div className="px-3.5 pt-3.5 pb-2.5 border-b border-[var(--border-subcard)] flex flex-col gap-2.5 shrink-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                          style={{ backgroundColor: activeAccent }}
                        >
                          <WebIcon name="layout-grid" className="w-4 h-4 text-white" />
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14.5px] font-bold tracking-tight truncate leading-tight text-[var(--text-heading,var(--text-primary))]">
                            {isEn ? 'Directory & Tools' : 'Danh Mục & Tiện Ích'}
                          </span>
                          <span className="text-[11px] font-medium text-[var(--text-secondary)] truncate">
                            {isEn ? 'Nguyen Hung Thai Portfolio' : 'Nguyễn Hùng Thái · Hồ sơ năng lực'}
                          </span>
                        </div>
                      </div>

                      <button
                        id="mobile-drawer-close-btn"
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          closeDrawer();
                        }}
                        aria-label={isEn ? 'Close menu' : 'Đóng menu'}
                        className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] flex items-center justify-center text-[var(--text-primary)] cursor-pointer active:scale-95 transition-transform shrink-0"
                      >
                        <WebIcon name="x" className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ô Tìm kiếm trang & tiện ích */}
                    <div className="relative flex items-center">
                      <WebIcon
                        name="search"
                        className="w-4 h-4 text-[var(--text-muted)] absolute left-3 pointer-events-none"
                      />
                      <input
                        id="mobile-drawer-search-input"
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          isEn ? 'Search pages or tools...' : 'Tìm kiếm trang, tiện ích...'
                        }
                        className="w-full h-[40px] pl-9 pr-9 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[13px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            searchInputRef.current?.focus();
                          }}
                          aria-label={isEn ? 'Clear search' : 'Xóa từ khóa'}
                          className="absolute right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-card)] cursor-pointer"
                        >
                          <WebIcon name="x" className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thân cuộn độc lập bên trong Drawer */}
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3 flex flex-col gap-3.5 no-scrollbar">
                    {/* NHÓM 1 – ĐIỀU HƯỚNG */}
                    {(showNavQuickRow || filteredPages.length > 0) && (
                      <section aria-label={isEn ? 'Group 1 – Navigation' : 'Nhóm 1 – Điều Hướng'}>
                        <div className="px-1.5 pb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          <span>{isEn ? 'Group 1 · Navigation' : 'Nhóm 1 · Điều Hướng'}</span>
                          <span className="tabular-nums">{filteredPages.length}/13</span>
                        </div>

                        {/* Chuyển nhanh: Trang Chủ + Lên đầu trang */}
                        {showNavQuickRow && (
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => handleSelectPageAndClose(0)}
                              className={`min-h-[44px] px-3 rounded-[13px] border flex items-center gap-2 text-left cursor-pointer transition-colors ${
                                currentTabIndex === 0
                                  ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] font-bold'
                                  : 'bg-[var(--bg-subcard)] border-[var(--border-subcard)] font-semibold'
                              }`}
                            >
                              <WebIcon
                                name="home"
                                className="w-4 h-4 shrink-0"
                                style={{ color: '#F59E0B' }}
                              />
                              <span className="text-[12.5px] truncate">
                                {isEn ? 'Home' : 'Trang Chủ'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                SoundEngine.playPageFlip();
                                onBackToTop();
                                closeDrawer();
                              }}
                              className="min-h-[44px] px-3 rounded-[13px] border bg-[var(--bg-subcard)] border-[var(--border-subcard)] flex items-center gap-2 text-left font-semibold cursor-pointer transition-colors hover:border-[var(--color-primary)]/50"
                            >
                              <WebIcon
                                name="arrow-up"
                                className="w-4 h-4 shrink-0 text-[var(--color-primary)]"
                              />
                              <span className="text-[12.5px] truncate">
                                {isEn ? 'Back to Top' : 'Lên đầu trang'}
                              </span>
                            </button>
                          </div>
                        )}

                        {/* 13 Trang Danh Mục */}
                        <div className="flex flex-col gap-1">
                          {filteredPages.map((page, index) => {
                            const isSelected = page.id === currentTabIndex;
                            const meta = PAGE_ACCENT_MAP[page.id] || PAGE_ACCENT_MAP[0];
                            const title =
                              isEn && page.nameEn
                                ? page.nameEn
                                : page.shortTitle || page.name;
                            const sub = isEn ? meta.subEn : meta.subVi;

                            return (
                              <button
                                key={`mobile-drawer-page-${page.id}`}
                                id={`mobile-nav-item-${page.id}`}
                                type="button"
                                onClick={() => handleSelectPageAndClose(page.id)}
                                style={
                                  isSelected
                                    ? {
                                        backgroundColor: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
                                        borderColor: meta.color,
                                      }
                                    : undefined
                                }
                                className={`w-full min-h-[44px] px-2.5 py-1.5 rounded-[13px] border flex items-center justify-between gap-2 text-left cursor-pointer transition-colors ${
                                  isSelected
                                    ? ''
                                    : 'border-transparent hover:bg-[var(--bg-subcard)]/80'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <span
                                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                                    style={{ backgroundColor: meta.color }}
                                  >
                                    <WebIcon
                                      name={page.icon || 'home'}
                                      className="w-3.5 h-3.5 text-white"
                                    />
                                  </span>
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] shrink-0 tabular-nums">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[13.5px] font-bold tracking-tight truncate text-[var(--text-primary)]">
                                      {title}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-subcard)] text-[var(--text-secondary)]">
                                    {sub}
                                  </span>
                                  {isSelected && (
                                    <WebIcon
                                      name="check"
                                      className="w-3.5 h-3.5 shrink-0"
                                      style={{ color: meta.color }}
                                    />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {/* NHÓM 2 – GIAO DIỆN */}
                    {showGroup2 && (
                      <section
                        aria-label={isEn ? 'Group 2 – Appearance' : 'Nhóm 2 – Giao Diện'}
                        className="pt-2.5 border-t border-[var(--border-subcard)] flex flex-col gap-1.5"
                      >
                        <div className="px-1.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {isEn ? 'Group 2 · Appearance' : 'Nhóm 2 · Giao Diện'}
                        </div>

                        {/* Sáng / Tối + Chọn giao diện Theme */}
                        {showThemeUtility && (
                          <div className="rounded-[14px] bg-[var(--bg-subcard)]/65 border border-[var(--border-subcard)] p-1.5 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-1.5">
                              <button
                                type="button"
                                onClick={handleToggleLightDarkQuick}
                                className="min-h-[44px] flex-1 px-2.5 rounded-[11px] flex items-center gap-2 text-left cursor-pointer hover:bg-[var(--bg-subcard)]"
                              >
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
                                  style={{ backgroundColor: isDark ? '#334155' : '#F59E0B' }}
                                >
                                  <WebIcon
                                    name={isDark ? 'moon' : 'sun'}
                                    className="w-3.5 h-3.5 text-white"
                                  />
                                </span>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-bold leading-tight truncate">
                                    {isDark
                                      ? isEn
                                        ? 'Dark Mode'
                                        : 'Chế độ Tối'
                                      : isEn
                                        ? 'Light Mode'
                                        : 'Chế độ Sáng'}
                                  </span>
                                  <span className="text-[10.5px] text-[var(--text-secondary)] truncate">
                                    {currentThemeBadge}
                                  </span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  SoundEngine.playTap();
                                  setShowThemePicker((prev) => !prev);
                                }}
                                aria-expanded={showThemePicker}
                                className="min-h-[44px] px-3 rounded-[11px] bg-[var(--bg-card)]/70 border border-[var(--border-subcard)] text-[11.5px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                <span>{isEn ? 'Theme' : 'Mẫu'}</span>
                                <WebIcon
                                  name="chevron-down"
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    showThemePicker ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {showThemePicker && (
                              <div className="pt-1 border-t border-[var(--border-subcard)] flex flex-col gap-1">
                                {CARD_STYLE_GROUPS.map((group) => {
                                  const lightMode =
                                    group.lightMode || group.defaultMode || group.presets[0]?.id;
                                  const darkMode = group.darkMode;
                                  const isGroupActive =
                                    cardStyle === lightMode ||
                                    (darkMode && cardStyle === darkMode);
                                  const groupTitle = isEn ? group.labelEn : group.label;
                                  return (
                                    <button
                                      key={group.id}
                                      type="button"
                                      onClick={() => {
                                        const target =
                                          isDark && darkMode ? darkMode : lightMode;
                                        if (target) {
                                          SoundEngine.playGlassChime();
                                          setCardStyle(target);
                                        }
                                      }}
                                      className={`w-full min-h-[38px] px-2.5 rounded-[10px] text-left text-[12px] font-semibold flex items-center justify-between cursor-pointer ${
                                        isGroupActive
                                          ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold'
                                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-subcard)]'
                                      }`}
                                    >
                                      <span className="truncate">{groupTitle}</span>
                                      {isGroupActive && (
                                        <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                                <button
                                  type="button"
                                  onClick={() => handleSelectPageAndClose(15)}
                                  className="w-full min-h-[38px] px-2.5 rounded-[10px] text-[12px] font-bold text-[var(--color-primary)] flex items-center justify-between cursor-pointer hover:bg-[var(--bg-subcard)]"
                                >
                                  <span>
                                    {isEn
                                      ? 'Open full Theme settings'
                                      : 'Mở trang Giao diện chi tiết'}
                                  </span>
                                  <WebIcon name="chevron-right" className="w-3.5 h-3.5 shrink-0" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Hiệu ứng giao diện */}
                        {showEffectUtility && (
                          <div className="rounded-[14px] bg-[var(--bg-subcard)]/65 border border-[var(--border-subcard)] p-1.5 flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                SoundEngine.playTap();
                                setShowEffectPicker((prev) => !prev);
                              }}
                              aria-expanded={showEffectPicker}
                              className="w-full min-h-[44px] px-2.5 rounded-[11px] flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-[var(--bg-subcard)]"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
                                  style={{ backgroundColor: '#6366F1' }}
                                >
                                  <WebIcon name="sparkles" className="w-3.5 h-3.5 text-white" />
                                </span>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-bold leading-tight truncate">
                                    {isEn ? 'Interface Effects' : 'Hiệu ứng giao diện'}
                                  </span>
                                  <span className="text-[10.5px] text-[var(--text-secondary)] truncate">
                                    {isEn
                                      ? activeEffectPreset.labelEn
                                      : activeEffectPreset.labelVi}
                                  </span>
                                </div>
                              </div>
                              <WebIcon
                                name="chevron-down"
                                className={`w-4 h-4 text-[var(--text-secondary)] transition-transform shrink-0 ${
                                  showEffectPicker ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {showEffectPicker && (
                              <div className="pt-1 border-t border-[var(--border-subcard)] flex flex-wrap gap-1.5 px-1 pb-1">
                                {CARD_EFFECT_PRESETS.map((preset) => {
                                  const isActiveEffect = cardEffect === preset.id;
                                  return (
                                    <button
                                      key={preset.id}
                                      type="button"
                                      onClick={() => {
                                        SoundEngine.playGlassChime();
                                        setCardEffect(preset.id);
                                      }}
                                      className={`min-h-[36px] px-2.5 py-1 rounded-full border text-[11.5px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                        isActiveEffect
                                          ? 'bg-[var(--color-primary)] text-white border-transparent font-bold'
                                          : 'bg-[var(--bg-card)]/75 border-[var(--border-subcard)] text-[var(--text-primary)]'
                                      }`}
                                    >
                                      <WebIcon name={preset.icon} className="w-3 h-3 shrink-0" />
                                      <span>{isEn ? preset.labelEn : preset.labelVi}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Cài đặt Hình nền */}
                        {showWallpaperUtility && (
                          <button
                            id="mobile-menu-util-wallpaper"
                            type="button"
                            onClick={() => handleSelectPageAndClose(14)}
                            className={`w-full min-h-[44px] px-3 rounded-[13px] border flex items-center justify-between gap-2 text-left cursor-pointer ${
                              currentTabIndex === 14
                                ? 'bg-pink-500/15 border-pink-500'
                                : 'bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
                                style={{ backgroundColor: '#EC4899' }}
                              >
                                <WebIcon name="image" className="w-3.5 h-3.5 text-white" />
                              </span>
                              <span className="text-[13px] font-bold truncate">
                                {isEn ? 'Wallpaper Settings' : 'Cài đặt Hình nền'}
                              </span>
                            </div>
                            <WebIcon
                              name="chevron-right"
                              className="w-4 h-4 text-[var(--text-secondary)] shrink-0"
                            />
                          </button>
                        )}

                        {/* Bật / Tắt Âm thanh & Ngôn ngữ */}
                        {(showAudioUtility || showLanguageUtility) && (
                          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-1.5">
                            {showAudioUtility && (
                              <button
                                id="mobile-menu-util-audio"
                                type="button"
                                onClick={handleToggleAudioMute}
                                className="min-h-[44px] px-2.5 rounded-[13px] border bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)] flex items-center justify-between gap-2 text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
                                    style={{
                                      backgroundColor: isMuted ? '#64748B' : '#0EA5E9',
                                    }}
                                  >
                                    <WebIcon
                                      name={isMuted ? 'volume-x' : 'volume-2'}
                                      className="w-3.5 h-3.5 text-white"
                                    />
                                  </span>
                                  <span className="text-[12.5px] font-bold truncate">
                                    {isEn
                                      ? isMuted
                                        ? 'Sound Off'
                                        : 'Sound On'
                                      : isMuted
                                        ? 'Tắt âm'
                                        : 'Bật âm'}
                                  </span>
                                </div>
                              </button>
                            )}

                            {showLanguageUtility && (
                              <div className="min-h-[44px] px-2.5 rounded-[13px] border bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)] flex items-center justify-between gap-1.5">
                                <span className="inline-flex items-center gap-1.5 min-w-0">
                                  <WebIcon
                                    name="languages"
                                    className="w-4 h-4 shrink-0 text-emerald-500"
                                  />
                                  <span className="text-[12px] font-bold truncate">
                                    {isEn ? 'Lang' : 'Ngôn ngữ'}
                                  </span>
                                </span>
                                <div className="inline-flex items-center gap-0.5 p-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subcard)] shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      SoundEngine.playGlassChime();
                                      setLanguageMode('vi');
                                    }}
                                    className={`px-2 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                                      language === 'vi'
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-[var(--text-secondary)]'
                                    }`}
                                  >
                                    VI
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      SoundEngine.playGlassChime();
                                      setLanguageMode('en');
                                    }}
                                    className={`px-2 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                                      language === 'en'
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-[var(--text-secondary)]'
                                    }`}
                                  >
                                    EN
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </section>
                    )}

                    {/* NHÓM 3 – TIỆN ÍCH */}
                    {showGroup3 && (
                      <section
                        aria-label={isEn ? 'Group 3 – Utilities' : 'Nhóm 3 – Tiện Ích'}
                        className="pt-2.5 border-t border-[var(--border-subcard)] flex flex-col gap-1.5"
                      >
                        <div className="px-1.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {isEn ? 'Group 3 · Utilities' : 'Nhóm 3 · Tiện Ích'}
                        </div>

                        {showWeatherUtility && (
                          <button
                            id="mobile-menu-util-weather"
                            type="button"
                            onClick={handleOpenWeatherForecast}
                            className="w-full min-h-[44px] px-3 rounded-[13px] border bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)] flex items-center justify-between gap-2 text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
                                style={{ backgroundColor: '#F59E0B' }}
                              >
                                <WebIcon name="sun" className="w-3.5 h-3.5 text-white" />
                              </span>
                              <span className="text-[13px] font-bold truncate">
                                {isEn ? 'Weather & Forecast' : 'Thời tiết & Dự báo'}
                              </span>
                            </div>
                            <WebIcon
                              name="chevron-right"
                              className="w-4 h-4 text-[var(--text-secondary)] shrink-0"
                            />
                          </button>
                        )}

                        {showAiUtility && (
                          <button
                            id="mobile-menu-util-ai"
                            type="button"
                            onClick={() => handleSelectPageAndClose(13)}
                            className={`w-full min-h-[44px] px-3 rounded-[13px] border flex items-center justify-between gap-2 text-left cursor-pointer ${
                              currentTabIndex === 13
                                ? 'bg-sky-500/15 border-sky-500'
                                : 'bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white"
                                style={{ backgroundColor: '#0EA5E9' }}
                              >
                                <WebIcon name="bot" className="w-3.5 h-3.5 text-white" />
                              </span>
                              <span className="text-[13px] font-bold truncate">
                                {isEn ? 'AI Tri Nhan Assistant' : 'Trợ lý AI Trí Nhân'}
                              </span>
                            </div>
                            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 shrink-0">
                              24/7
                            </span>
                          </button>
                        )}
                      </section>
                    )}

                    {/* NHÓM 4 – TÀI LIỆU */}
                    {showGroup4 && (
                      <section
                        aria-label={isEn ? 'Group 4 – Documents' : 'Nhóm 4 · Tài Liệu'}
                        className="pt-2.5 border-t border-[var(--border-subcard)] flex flex-col gap-1.5"
                      >
                        <div className="px-1.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {isEn ? 'Group 4 · Documents' : 'Nhóm 4 · Tài Liệu'}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          {showViewCvUtility && (
                            <button
                              id="mobile-menu-doc-view-cv"
                              type="button"
                              onClick={() => handleSelectPageAndClose(16)}
                              className={`min-h-[44px] px-2.5 rounded-[13px] border flex items-center gap-2 text-left cursor-pointer ${
                                currentTabIndex === 16
                                  ? 'bg-blue-500/15 border-blue-500'
                                  : 'bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)]'
                              }`}
                            >
                              <WebIcon
                                name="file-text"
                                className="w-4 h-4 shrink-0 text-blue-500"
                              />
                              <span className="text-[12.5px] font-bold truncate">
                                {isEn ? 'View CV' : 'Xem CV'}
                              </span>
                            </button>
                          )}

                          {showDownloadPdfUtility && (
                            <button
                              id="mobile-menu-doc-download-pdf"
                              type="button"
                              onClick={handleDownloadPdf}
                              className="min-h-[44px] px-2.5 rounded-[13px] border bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)] flex items-center gap-2 text-left cursor-pointer"
                            >
                              <WebIcon
                                name="download"
                                className="w-4 h-4 shrink-0 text-emerald-500"
                              />
                              <span className="text-[12.5px] font-bold truncate">
                                {isEn ? 'Download PDF' : 'Tải CV PDF'}
                              </span>
                            </button>
                          )}

                          {showPortfolioUtility && (
                            <button
                              id="mobile-menu-doc-portfolio"
                              type="button"
                              onClick={() => handleSelectPageAndClose(7)}
                              className="min-h-[44px] px-2.5 rounded-[13px] border bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)] flex items-center gap-2 text-left cursor-pointer"
                            >
                              <WebIcon
                                name="folder"
                                className="w-4 h-4 shrink-0 text-teal-500"
                              />
                              <span className="text-[12.5px] font-bold truncate">
                                {isEn ? 'Portfolio' : 'Xem Portfolio'}
                              </span>
                            </button>
                          )}

                          {showCopyContactUtility && (
                            <button
                              id="mobile-menu-doc-copy-contact"
                              type="button"
                              onClick={handleCopyContact}
                              className="min-h-[44px] px-2.5 rounded-[13px] border bg-[var(--bg-subcard)]/65 border-[var(--border-subcard)] flex items-center gap-2 text-left cursor-pointer"
                            >
                              <WebIcon
                                name={copiedContact ? 'check' : 'copy'}
                                className={`w-4 h-4 shrink-0 ${
                                  copiedContact ? 'text-emerald-500' : 'text-indigo-500'
                                }`}
                              />
                              <span className="text-[12.5px] font-bold truncate">
                                {copiedContact
                                  ? isEn
                                    ? '✓ Copied'
                                    : '✓ Đã sao chép'
                                  : isEn
                                    ? 'Copy Contact'
                                    : 'Sao chép LH'}
                              </span>
                            </button>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Empty search state */}
                    {filteredPages.length === 0 && !showGroup2 && !showGroup3 && !showGroup4 && (
                      <div className="py-8 px-4 text-center text-[13px] text-[var(--text-secondary)]">
                        {isEn
                          ? 'No matching pages or tools found.'
                          : 'Không tìm thấy trang hoặc tiện ích phù hợp.'}
                      </div>
                    )}
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* 3. NÚT CHUYỂN TRANG FLOATING GÓC DƯỚI BÊN PHẢI (< 768px):
          - Vùng bấm tối thiểu 44 x 44 px
          - Trang đầu: chỉ hiển thị nút Trang Tiếp Theo (↓)
          - Các trang giữa: hiển thị cả hai nút (↑ / ↓)
          - Trang cuối: chỉ hiển thị nút Trang Trước (↑) — không lặp vòng, không nút vô tác dụng
          - Tự động thu gọn khi nhập liệu bàn phím mở */}
      <div
        id="mobile-floating-page-nav"
        role="group"
        aria-label={isEn ? 'Floating Page Navigation' : 'Nút nổi điều hướng chuyển trang'}
        style={{
          bottom: 'max(14px, calc(env(safe-area-inset-bottom, 0px) + 12px))',
          right: 'max(12px, calc(env(safe-area-inset-right, 0px) + 10px))',
        }}
        className={`md:hidden fixed z-[9990] flex flex-col items-end gap-1.5 select-none transition-all duration-200 ${
          isInputFocused || isOpen
            ? 'opacity-0 scale-90 pointer-events-none'
            : 'opacity-100 scale-100 pointer-events-auto'
        }`}
      >
        <div
          style={{
            background: isDark
              ? 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #141824)) 92%, #090d16)'
              : 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 94%, #f8fafc)',
            borderColor:
              'var(--surface-primary-border, var(--border-card, rgba(148,163,184,0.35)))',
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.36)',
            backdropFilter: 'blur(22px) saturate(170%)',
            WebkitBackdropFilter: 'blur(22px) saturate(170%)',
          }}
          className="p-1.5 rounded-full border flex flex-col items-center gap-1.5"
        >
          {/* Nút Trang Trước ↑ (chỉ hiển thị khi có trang trước) */}
          {effectiveHasPrev && (
            <motion.button
              id="mobile-floating-prev-btn"
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleMobileFloatingPrev}
              title={isEn ? 'Previous Page ↑' : 'Trang trước ↑'}
              aria-label={isEn ? 'Previous Page' : 'Trang trước'}
              className="theme-prev-next-btn w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center cursor-pointer border-0"
            >
              <WebIcon name="chevron-up" strokeWidth={2.8} className="w-[18px] h-[18px]" />
            </motion.button>
          )}

          {/* Chỉ số trang + Vòng tiến trình cuộn trang */}
          <div
            id="mobile-floating-scroll-progress"
            role="progressbar"
            aria-label={isEn ? 'Page scroll progress' : 'Tiến trình cuộn trang'}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            title={isEn ? `Scroll position: ${pct}%` : `Vị trí cuộn trang: ${pct}%`}
            className="relative w-11 h-11 min-w-[44px] flex flex-col items-center justify-center shrink-0 select-none"
          >
            <svg
              viewBox="0 0 38 38"
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              aria-hidden="true"
            >
              <circle
                cx="19"
                cy="19"
                r={ringRadius}
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'}
                strokeWidth="2.5"
              />
              <circle
                cx="19"
                cy="19"
                r={ringRadius}
                fill="none"
                stroke={activeAccent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringStrokeDashoffset}
                style={{ transition: 'stroke-dashoffset 120ms ease-out' }}
              />
            </svg>
            <span
              className="relative z-10 text-[9.5px] font-play font-extrabold tabular-nums leading-none"
              style={{ color: activeAccent }}
            >
              {String(badgeNumerator).padStart(2, '0')}/
              {String(badgeDenominator).padStart(2, '0')}
            </span>
            <span
              className="relative z-10 text-[7.5px] font-mono font-bold tabular-nums leading-none mt-0.5 opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              {pct}%
            </span>
          </div>

          {/* Nút Trang Tiếp Theo ↓ (chỉ hiển thị khi còn trang kế tiếp, không lặp vòng) */}
          {effectiveHasNext && (
            <motion.button
              id="mobile-floating-next-btn"
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleMobileFloatingNext}
              title={isEn ? 'Next Page ↓' : 'Trang tiếp theo ↓'}
              aria-label={isEn ? 'Next Page' : 'Trang tiếp theo'}
              className="theme-prev-next-btn w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center cursor-pointer border-0"
            >
              <WebIcon name="chevron-down" strokeWidth={2.8} className="w-[18px] h-[18px]" />
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
};
