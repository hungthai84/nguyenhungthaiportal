// Dynamic Menu, by DesignBookmark (https://designbookmark.com/motion#db-dynamic-menu)
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TABS_DATA, TabItem } from '@/data/tabs';
import { WeatherWidget } from '@/components/common/WeatherWidget';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import { CARD_STYLE_GROUPS, THEME_FOUR_WORD_NAMES, getCardStyleConfig } from '@/config/ui/cardStyles';

interface Spring1D {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
}

const createSpring = (x: number, k = 400, c = 30): Spring1D => ({
  x,
  v: 0,
  t: x,
  k,
  c,
});

const stepSpring = (s: Spring1D, dt: number) => {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

interface ScheduledTimer {
  t: number;
  fn: () => void;
}

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

const PRIMARY_PAGE_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 12];

const PAGE_ACCENT_MAP: Record<number, { color: string; subVi: string; subEn: string }> = {
  0: { color: '#F59E0B', subVi: 'Tổng quan', subEn: 'Overview' },
  1: { color: '#F97316', subVi: 'Tâm thư', subEn: 'Cover Letter' },
  2: { color: '#F43F5E', subVi: 'Hồ sơ', subEn: 'Profile' },
  3: { color: '#0EA5E9', subVi: 'Đào tạo', subEn: 'Education' },
  4: { color: '#10B981', subVi: 'Giải pháp', subEn: 'Services' },
  5: { color: '#06B6D4', subVi: '22+ Năm', subEn: '22+ Years' },
  6: { color: '#8B5CF6', subVi: 'SWOT CX', subEn: 'SWOT Matrix' },
  7: { color: '#14B8A6', subVi: 'Thực chiến', subEn: 'Projects' },
  8: { color: '#3B82F6', subVi: 'Công nghệ', subEn: 'Systems' },
  9: { color: '#84CC16', subVi: 'Hỏi & Đáp', subEn: 'Interview' },
  10: { color: '#F97316', subVi: 'Phong thủy', subEn: 'Horoscope' },
  11: { color: '#A855F7', subVi: 'Khoảnh khắc', subEn: 'Memories' },
  12: { color: '#6366F1', subVi: 'Kết nối', subEn: 'Contact' },
  13: { color: '#0EA5E9', subVi: 'Trợ lý 24/7', subEn: '24/7 AI' },
  14: { color: '#EC4899', subVi: 'Tùy chỉnh', subEn: 'Wallpaper' },
  15: { color: '#6366F1', subVi: 'Phong cách', subEn: 'Interface' },
  16: { color: '#2563EB', subVi: 'Hồ sơ PDF', subEn: 'PDF CV' },
};

export const MobileTopBarAndFloatingNav: React.FC<MobileTopBarAndFloatingNavProps> = ({
  currentTabIndex,
  hasPrevPage,
  hasNextPage,
  isAtLastPage,
  onSelectPage,
  onNavigatePage,
  onBackToTop,
  onShowNotification,
}) => {
  const { language, setLanguageMode, t } = useLanguage();
  const isEn = language === 'en';
  const { cardStyle, setCardStyle, isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const isOpenRef = useRef(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const b1Ref = useRef<HTMLElement | null>(null);
  const b2Ref = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Total rows inside Dynamic Menu: 14 primary pages + 5 right-side utility rows (including Weather) = 19 items
  const orderedPrimaryPages = useMemo(() => {
    return PRIMARY_PAGE_ORDER.map((id) => TABS_DATA.find((p) => p.id === id)).filter(
      (p): p is TabItem => Boolean(p)
    );
  }, []);

  const totalMenuItemsCount = orderedPrimaryPages.length + 5;

  // DesignBookmark Dynamic Menu spring state:
  // Width W = S(178, 320, 26), Height H = S(40, 240, 22), Cross X = S(0, 380, 24)
  const springsRef = useRef<{
    W: Spring1D;
    H: Spring1D;
    X: Spring1D;
    items: Spring1D[];
    timers: ScheduledTimer[];
  }>({
    W: createSpring(172, 320, 26),
    H: createSpring(40, 240, 22),
    X: createSpring(0, 380, 24),
    items: Array.from({ length: 24 }, () => createSpring(0, 260, 22)),
    timers: [],
  });

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

  // Close menu when route changes
  useEffect(() => {
    if (isOpenRef.current) {
      triggerMenuState(false);
    }
  }, [currentTabIndex]);

  const triggerMenuState = (nextOpen: boolean) => {
    isOpenRef.current = nextOpen;
    setIsOpen(nextOpen);
    if (!nextOpen) {
      setShowThemePicker(false);
    }

    const sp = springsRef.current;
    sp.timers.length = 0;

    const vw = typeof window !== 'undefined' ? window.innerWidth : 375;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
    const expandedW = Math.min(316, Math.max(264, vw - 20));
    const closedW = Math.min(182, Math.max(150, Math.floor(vw * 0.46)));
    const expandedH = Math.min(vh - 76, 560);

    sp.W.t = nextOpen ? expandedW : closedW;
    sp.H.t = nextOpen ? expandedH : 40;
    sp.X.t = nextOpen ? 1 : 0;

    for (let i = 0; i < totalMenuItemsCount; i++) {
      const delaySec = nextOpen
        ? 0.06 + i * 0.028
        : (totalMenuItemsCount - 1 - i) * 0.016;
      sp.timers.push({
        t: delaySec,
        fn: () => {
          if (sp.items[i]) {
            sp.items[i].t = isOpenRef.current ? 1 : 0;
          }
        },
      });
    }
  };

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        triggerMenuState(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerMenuState(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // 60fps DesignBookmark spring loop for Dynamic Menu
  useEffect(() => {
    let rafId: number | null = null;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const sp = springsRef.current;

      for (let i = sp.timers.length - 1; i >= 0; i--) {
        sp.timers[i].t -= dt;
        if (sp.timers[i].t <= 0) {
          const timer = sp.timers.splice(i, 1)[0];
          timer.fn();
        }
      }

      const sub = 4;
      const subDt = dt / sub;
      for (let k = 0; k < sub; k++) {
        stepSpring(sp.W, subDt);
        stepSpring(sp.H, subDt);
        stepSpring(sp.X, subDt);
        for (let i = 0; i < totalMenuItemsCount; i++) {
          if (sp.items[i]) stepSpring(sp.items[i], subDt);
        }
      }

      const menuEl = menuRef.current;
      if (menuEl) {
        menuEl.style.width = `${sp.W.x.toFixed(2)}px`;
        menuEl.style.height = `${sp.H.x.toFixed(2)}px`;
        menuEl.style.borderRadius = `${(20 - 4 * clamp(sp.X.x, 0, 1)).toFixed(2)}px`;
      }

      const x = clamp(sp.X.x, -0.1, 1.1);
      if (b1Ref.current) {
        b1Ref.current.style.transform = `translateY(${(-3.8 * (1 - x)).toFixed(2)}px) rotate(${(45 * x).toFixed(2)}deg)`;
      }
      if (b2Ref.current) {
        b2Ref.current.style.transform = `translateY(${(3.8 * (1 - x)).toFixed(2)}px) rotate(${(-45 * x).toFixed(2)}deg)`;
      }

      for (let i = 0; i < totalMenuItemsCount; i++) {
        const liEl = itemRefs.current[i];
        const s = sp.items[i];
        if (liEl && s) {
          liEl.style.opacity = clamp(s.x, 0, 1).toFixed(3);
          liEl.style.transform = `translateY(${((1 - s.x) * 16).toFixed(2)}px)`;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [totalMenuItemsCount]);

  const activeThemeConfig = getCardStyleConfig(cardStyle);
  const currentThemeBadge = isEn
    ? THEME_FOUR_WORD_NAMES[cardStyle]?.en || t(activeThemeConfig.shortBadge)
    : THEME_FOUR_WORD_NAMES[cardStyle]?.vi || activeThemeConfig.shortBadge;

  const handleToggleLightDarkQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <>
      {/* 1. NÚT DANH MỤC & CHUYỂN TRANG CHỦ NHANH GÓC TRÊN BÊN TRÁI THẺ CHÍNH Ở CHẾ ĐỘ MOBILE (< 768px) */}
      <div
        id="mobile-top-controls-bar"
        data-element-name="Danh mục góc trên bên trái thẻ chính (Mobile)"
        className="md:hidden w-full max-w-[var(--home-main-card-w,calc(100vw-16px))] mx-auto pt-1.5 pb-0 px-0 flex items-center justify-start gap-2 relative z-[9995] shrink-0 select-none"
      >
        {/* GÓC TRÁI TRÊN THẺ CHÍNH: NÚT DANH MỤC · TRANG HIỆN TẠI (DesignBookmark db-dynamic-menu) */}
        <div className="relative h-[40px] w-[172px] sm:w-[182px] shrink-0">
          <div
            ref={menuRef}
            id="mobile-dynamic-menu"
            data-open={isOpen ? 'true' : 'false'}
            style={{
              width: '172px',
              height: '40px',
              borderRadius: '20px',
              background: isDark
                ? 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #141824)) 96%, #090d16)'
                : 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 97%, #f8fafc)',
              borderColor: isOpen
                ? activeAccent
                : 'var(--surface-primary-border, var(--border-card, rgba(148,163,184,0.32)))',
              boxShadow: isOpen
                ? '0 22px 48px -12px rgba(15, 23, 42, 0.55), 0 0 0 1px rgba(255,255,255,0.14)'
                : 'var(--surface-primary-shadow, 0 6px 18px rgba(15, 23, 42, 0.14))',
              backdropFilter: 'blur(24px) saturate(170%)',
              WebkitBackdropFilter: 'blur(24px) saturate(170%)',
            }}
            className="absolute left-0 top-0 z-[9999] border overflow-hidden font-play text-[var(--text-primary)]"
          >
            {/* Header Toggle Button (.head) — Gom gọn Danh mục & Trang hiện tại */}
            <button
              id="mobile-menu-trigger-btn"
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-dynamic-menu-links"
              onClick={() => {
                SoundEngine.playTap();
                triggerMenuState(!isOpenRef.current);
              }}
              className="w-full h-[40px] px-2 flex items-center justify-between gap-1.5 border-0 bg-transparent text-[var(--text-primary)] cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
                  style={{ backgroundColor: activeAccent }}
                >
                  <WebIcon
                    name={activePageMeta?.icon || 'home'}
                    className="w-3.5 h-3.5 text-white shrink-0"
                  />
                </span>
                <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)] shrink-0">
                    {isEn ? 'Menu' : 'Danh mục'}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] shrink-0">·</span>
                  <span className="text-[12.5px] font-bold tracking-tight truncate text-[var(--text-primary)]">
                    {activePageTitle}
                  </span>
                </div>
              </div>

              {/* Two-line toggle morphing into X (.tog) */}
              <span
                className="relative w-5 h-5 shrink-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <i
                  ref={b1Ref}
                  className="absolute left-[3px] right-[3px] h-[2px] rounded-full bg-current top-[9px] will-change-transform"
                />
                <i
                  ref={b2Ref}
                  className="absolute left-[3px] right-[3px] h-[2px] rounded-full bg-current top-[9px] will-change-transform"
                />
              </span>
            </button>

            {/* Danh sách trang & các nút tiện ích (gồm Thời tiết) đưa vào menu (.links) */}
            <ul
              id="mobile-dynamic-menu-links"
              className="w-full max-h-[calc(100%-44px)] overflow-y-auto no-scrollbar px-2 pt-1 pb-3 m-0 list-none flex flex-col gap-1"
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            >
              {/* PHẦN 0: TIỆN ÍCH THỜI TIẾT BÊN TRONG DANH MỤC */}
              <li
                ref={(el) => {
                  itemRefs.current[0] = el;
                }}
                style={{ opacity: 0 }}
                className="will-change-[transform,opacity] pb-1 mb-0.5 border-b border-[var(--border-subcard)]"
              >
                <div className="w-full flex items-center justify-center overflow-hidden rounded-[12px] bg-[var(--bg-subcard)]/65 border border-[var(--border-subcard)] px-1.5 py-1">
                  <WeatherWidget onShowNotification={onShowNotification} />
                </div>
              </li>

              {/* PHẦN 1: CÁC TRANG DANH MỤC CHÍNH */}
              {orderedPrimaryPages.map((page, idx) => {
                const isSelected = page.id === currentTabIndex;
                const meta = PAGE_ACCENT_MAP[page.id] || PAGE_ACCENT_MAP[0];
                const title =
                  isEn && page.shortTitleEn
                    ? page.shortTitleEn
                    : page.shortTitle || page.name;
                const sub = isEn ? meta.subEn : meta.subVi;

                return (
                  <li
                    key={`dyn-page-${page.id}`}
                    ref={(el) => {
                      itemRefs.current[idx + 1] = el;
                    }}
                    style={{ opacity: 0 }}
                    className="will-change-[transform,opacity]"
                  >
                    <button
                      id={`mobile-nav-item-${page.id}`}
                      type="button"
                      onClick={() => {
                        SoundEngine.playPageSpecificSound(page.id);
                        onSelectPage(page.id);
                        triggerMenuState(false);
                      }}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `color-mix(in srgb, ${meta.color} 16%, transparent)`,
                              borderColor: meta.color,
                            }
                          : { borderColor: 'transparent' }
                      }
                      className="w-full h-[38px] px-2.5 rounded-[12px] border flex items-center justify-between gap-2 text-left cursor-pointer transition-colors hover:bg-[var(--bg-subcard)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white"
                          style={{ backgroundColor: meta.color }}
                        >
                          <WebIcon name={page.icon || 'home'} className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span className="text-[13.5px] font-bold tracking-tight truncate text-[var(--text-primary)]">
                          {title}
                        </span>
                      </div>
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-subcard)] text-[var(--text-secondary)] shrink-0">
                        {sub}
                      </span>
                    </button>
                  </li>
                );
              })}

              {/* VÁCH NGĂN: CÁC NÚT BÊN PHẢI FOOTER ĐƯA VÀO DANH MỤC MENU */}
              <li className="px-2 pt-1.5 pb-0.5">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-[var(--text-muted)] border-t border-[var(--border-subcard)] pt-1.5">
                  <span>{isEn ? 'Utilities & Settings' : 'Tiện ích & Cài đặt'}</span>
                  <span>4</span>
                </div>
              </li>

              {/* Utility 1: AI Trí Nhân (tabIndex = 13) */}
              <li
                ref={(el) => {
                  itemRefs.current[orderedPrimaryPages.length + 1] = el;
                }}
                style={{ opacity: 0 }}
                className="will-change-[transform,opacity]"
              >
                <button
                  id="mobile-menu-util-ai"
                  type="button"
                  onClick={() => {
                    SoundEngine.playPageSpecificSound(13);
                    onSelectPage(13);
                    triggerMenuState(false);
                  }}
                  style={
                    currentTabIndex === 13
                      ? {
                          backgroundColor: 'color-mix(in srgb, #0EA5E9 16%, transparent)',
                          borderColor: '#0EA5E9',
                        }
                      : { borderColor: 'transparent' }
                  }
                  className="w-full h-[38px] px-2.5 rounded-[12px] border flex items-center justify-between gap-2 text-left cursor-pointer transition-colors hover:bg-[var(--bg-subcard)]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: '#0EA5E9' }}
                    >
                      <WebIcon name="bot" className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="text-[13.5px] font-bold tracking-tight truncate text-[var(--text-primary)]">
                      {isEn ? 'AI Tri Nhan' : 'AI Trí Nhân'}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 shrink-0">
                    24/7
                  </span>
                </button>
              </li>

              {/* Utility 2: Hình Nền (tabIndex = 14) */}
              <li
                ref={(el) => {
                  itemRefs.current[orderedPrimaryPages.length + 2] = el;
                }}
                style={{ opacity: 0 }}
                className="will-change-[transform,opacity]"
              >
                <button
                  id="mobile-menu-util-wallpaper"
                  type="button"
                  onClick={() => {
                    SoundEngine.playPageSpecificSound(14);
                    onSelectPage(14);
                    triggerMenuState(false);
                  }}
                  style={
                    currentTabIndex === 14
                      ? {
                          backgroundColor: 'color-mix(in srgb, #EC4899 16%, transparent)',
                          borderColor: '#EC4899',
                        }
                      : { borderColor: 'transparent' }
                  }
                  className="w-full h-[38px] px-2.5 rounded-[12px] border flex items-center justify-between gap-2 text-left cursor-pointer transition-colors hover:bg-[var(--bg-subcard)]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: '#EC4899' }}
                    >
                      <WebIcon name="image" className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="text-[13.5px] font-bold tracking-tight truncate text-[var(--text-primary)]">
                      {isEn ? 'Wallpaper' : 'Hình Nền'}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-subcard)] text-[var(--text-secondary)] shrink-0">
                    {isEn ? 'Customize' : 'Tùy chỉnh'}
                  </span>
                </button>
              </li>

              {/* Utility 3: Giao Diện (tabIndex = 15 + nút đổi nhanh Sáng/Tối & danh sách giao diện) */}
              <li
                ref={(el) => {
                  itemRefs.current[orderedPrimaryPages.length + 3] = el;
                }}
                style={{ opacity: 0 }}
                className="will-change-[transform,opacity] flex flex-col gap-1"
              >
                <div className="w-full h-[38px] px-2.5 rounded-[12px] border border-transparent flex items-center justify-between gap-1.5 hover:bg-[var(--bg-subcard)]">
                  <button
                    id="mobile-menu-util-interface"
                    type="button"
                    onClick={() => {
                      SoundEngine.playPageSpecificSound(15);
                      onSelectPage(15);
                      triggerMenuState(false);
                    }}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer bg-transparent border-0 p-0"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: '#6366F1' }}
                    >
                      <WebIcon name="layers" className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13.5px] font-bold tracking-tight truncate text-[var(--text-primary)] leading-tight">
                        {isEn ? 'Theme' : 'Giao Diện'}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] truncate leading-none">
                        {currentThemeBadge}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={handleToggleLightDarkQuick}
                      title={isEn ? 'Switch Light / Dark' : 'Đổi nhanh Sáng / Tối'}
                      className="px-2 py-1 rounded-full text-[10.5px] font-bold bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <WebIcon name={isDark ? 'moon' : 'sun'} className="w-3 h-3" />
                      <span>{isDark ? (isEn ? 'Dark' : 'Tối') : isEn ? 'Light' : 'Sáng'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        SoundEngine.playTap();
                        setShowThemePicker((prev) => !prev);
                      }}
                      aria-expanded={showThemePicker}
                      title={isEn ? 'Choose theme preset' : 'Chọn mẫu giao diện'}
                      className="w-6 h-6 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
                    >
                      <WebIcon
                        name="chevron-down"
                        className={`w-3 h-3 transition-transform ${showThemePicker ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {showThemePicker && (
                  <div className="mx-1 p-1.5 rounded-[12px] bg-[var(--bg-subcard)]/90 border border-[var(--border-subcard)] flex flex-col gap-1 max-h-40 overflow-y-auto no-scrollbar">
                    {CARD_STYLE_GROUPS.map((group) => {
                      const lightMode = group.lightMode || group.defaultMode || group.presets[0]?.id;
                      const darkMode = group.darkMode;
                      const isGroupActive = cardStyle === lightMode || (darkMode && cardStyle === darkMode);
                      const groupTitle = isEn ? group.labelEn : group.label;
                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => {
                            const target = isDark && darkMode ? darkMode : lightMode;
                            if (target) {
                              SoundEngine.playGlassChime();
                              setCardStyle(target);
                            }
                          }}
                          className={`w-full px-2 py-1 rounded-[8px] text-left text-[11.5px] font-semibold flex items-center justify-between cursor-pointer ${
                            isGroupActive
                              ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          <span className="truncate">{groupTitle}</span>
                          {isGroupActive && <WebIcon name="check" className="w-3 h-3 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </li>

              {/* Utility 4: Ngôn Ngữ (Tiếng Việt / English) */}
              <li
                ref={(el) => {
                  itemRefs.current[orderedPrimaryPages.length + 4] = el;
                }}
                style={{ opacity: 0 }}
                className="will-change-[transform,opacity]"
              >
                <div className="w-full h-[38px] px-2.5 rounded-[12px] border border-transparent flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: '#059669' }}
                    >
                      <WebIcon name="languages" className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="text-[13.5px] font-bold tracking-tight truncate text-[var(--text-primary)]">
                      {isEn ? 'Language' : 'Ngôn Ngữ'}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playGlassChime();
                        setLanguageMode('vi');
                        onShowNotification?.('✓ Đã chuyển ngôn ngữ sang Tiếng Việt');
                      }}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
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
                        onShowNotification?.('✓ Switched display language to English');
                      }}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                        language === 'en'
                          ? 'bg-emerald-600 text-white'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* NÚT CHUYỂN NHANH VỀ TRANG CHỦ Ở CHẾ ĐỘ MOBILE */}
        <button
          id="mobile-home-quick-btn"
          type="button"
          aria-current={currentTabIndex === 0 ? 'page' : undefined}
          title={isEn ? 'Go to Home' : 'Chuyển về Trang chủ'}
          aria-label={isEn ? 'Home' : 'Trang chủ'}
          onClick={() => {
            if (isOpenRef.current) {
              triggerMenuState(false);
            }
            if (currentTabIndex === 0) {
              SoundEngine.playTap();
              onBackToTop();
            } else {
              SoundEngine.playPageSpecificSound(0);
              onSelectPage(0);
            }
          }}
          style={{
            height: '40px',
            borderRadius: '20px',
            background:
              currentTabIndex === 0
                ? isDark
                  ? 'color-mix(in srgb, #F59E0B 18%, var(--bg-popup, var(--bg-card, #141824)))'
                  : 'color-mix(in srgb, #F59E0B 14%, var(--bg-popup, var(--bg-card, #ffffff)))'
                : isDark
                  ? 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #141824)) 96%, #090d16)'
                  : 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 97%, #f8fafc)',
            borderColor:
              currentTabIndex === 0
                ? '#F59E0B'
                : 'var(--surface-primary-border, var(--border-card, rgba(148,163,184,0.32)))',
            boxShadow: 'var(--surface-primary-shadow, 0 6px 18px rgba(15, 23, 42, 0.14))',
            backdropFilter: 'blur(24px) saturate(170%)',
            WebkitBackdropFilter: 'blur(24px) saturate(170%)',
          }}
          className="h-[40px] px-2.5 border inline-flex items-center gap-1.5 font-play text-[var(--text-primary)] shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs"
            style={{ backgroundColor: '#F59E0B' }}
          >
            <WebIcon name="fa-house-chimney" className="w-3.5 h-3.5 text-white shrink-0" />
          </span>
          <span className="text-[12.5px] font-bold tracking-tight whitespace-nowrap text-[var(--text-primary)]">
            {isEn ? 'Home' : 'Trang chủ'}
          </span>
        </button>
      </div>

      {/* 2. NÚT CHUYỂN TRANG NỔI GÓC DƯỚI BÊN PHẢI Ở CHẾ ĐỘ MOBILE (< 768px):
          - Trường hợp 1 (Trang đầu): chỉ hiển thị nút dưới (Trang tiếp theo ↓)
          - Trường hợp 2 (Trang giữa): nút trên (Trang trước ↑) + nút dưới (Trang tiếp theo ↓)
          - Trường hợp 3 (Trang cuối): nút trên (Trang trước ↑) + nút dưới (Back to Top ↑) */}
      <div
        id="mobile-floating-page-nav"
        role="group"
        aria-label={isEn ? 'Floating Page Navigation' : 'Nút nổi điều hướng chuyển trang'}
        style={{
          bottom: 'max(14px, calc(env(safe-area-inset-bottom, 0px) + 10px))',
          right: 'max(12px, calc(env(safe-area-inset-right, 0px) + 10px))',
        }}
        className="md:hidden fixed z-[9990] flex flex-col items-end gap-1.5 pointer-events-auto select-none"
      >
        <div
          style={{
            background: isDark
              ? 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #141824)) 92%, #090d16)'
              : 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 94%, #f8fafc)',
            borderColor: 'var(--surface-primary-border, var(--border-card, rgba(148,163,184,0.35)))',
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.38)',
            backdropFilter: 'blur(20px) saturate(165%)',
            WebkitBackdropFilter: 'blur(20px) saturate(165%)',
          }}
          className="p-1 rounded-full border flex flex-col items-center gap-1"
        >
          {/* Nút Trên: Trang trước ↑ (Chỉ hiển thị khi đã có trang trước đó) */}
          {hasPrevPage && (
            <button
              id="mobile-floating-prev-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigatePage(-1);
              }}
              title={isEn ? 'Previous Page ↑' : 'Trang trước ↑'}
              aria-label={isEn ? 'Previous Page' : 'Trang trước'}
              className="theme-prev-next-btn w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-0 active:scale-95 transition-transform"
            >
              <WebIcon name="chevron-up" strokeWidth={2.8} className="w-4 h-4" />
            </button>
          )}

          {/* Chỉ số trang hiện tại */}
          <span
            className="px-1.5 py-0.5 text-[10.5px] font-play font-extrabold tabular-nums leading-none select-none"
            style={{ color: activeAccent }}
          >
            {String(currentTabIndex + 1).padStart(2, '0')}/{String(TABS_DATA.length).padStart(2, '0')}
          </span>

          {/* Nút Dưới: Trang tiếp theo ↓ (Khi còn trang kế tiếp) hoặc Back to Top ↑ (Ở trang cuối cùng) */}
          {hasNextPage ? (
            <button
              id="mobile-floating-next-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigatePage(1);
              }}
              title={isEn ? 'Next Page ↓' : 'Trang tiếp theo ↓'}
              aria-label={isEn ? 'Next Page' : 'Trang tiếp theo'}
              className="theme-prev-next-btn w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-0 active:scale-95 transition-transform"
            >
              <WebIcon name="chevron-down" strokeWidth={2.8} className="w-4 h-4" />
            </button>
          ) : (
            isAtLastPage && (
              <button
                id="mobile-floating-back-to-top-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  SoundEngine.playPageFlip();
                  onBackToTop();
                }}
                title={isEn ? 'Back to Top ↑' : 'Back to Top ↑ (Cuộn lên đầu trang)'}
                aria-label={isEn ? 'Back to Top' : 'Back to Top'}
                style={{
                  background: 'var(--bg-button-primary, linear-gradient(135deg, #4F46E5, #06B6D4))',
                  color: 'var(--text-button-primary, #FFFFFF)',
                }}
                className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center font-play font-bold cursor-pointer active:scale-95 transition-transform"
              >
                <WebIcon name="arrow-up" strokeWidth={2.6} className="w-4 h-4 shrink-0" />
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};
