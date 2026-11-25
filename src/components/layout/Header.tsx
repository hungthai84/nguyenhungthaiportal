'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { PageMeta, SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';
import { WebIcon } from '@/components/ui/WebIcon';
import { useTheme } from '@/hooks/useTheme';
import { RadialContactMenu } from './RadialContactMenu';

export interface HeaderProps {
  pages: PageMeta[];
  currentPage: number;
  currentTheme?: SiteTheme;
  onSelectPage: (index: number) => void;
  onOpenAiChat?: () => void;
  onShowNotification?: (msg: string) => void;
}

// Cấu hình giao diện chuẩn theo định dạng nút bên phải của Footer cho tất cả 15 trang
interface HeaderButtonStyle {
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  mainTextColor: string;
  subTextColor: string;
  gradient: string;
  circleBg: string;
  ringColor: string;
  subColor: string;
  subVi: string;
  subEn: string;
  avatarGif?: string;
}

const PAGE_FOOTER_STYLE_MAP: Record<number, HeaderButtonStyle> = {
  0: {
    accentColor: '#D97706',
    accentBg: 'bg-amber-50/90 dark:bg-amber-950/70',
    accentBorder: 'border-amber-400/80 dark:border-amber-500/80',
    mainTextColor: 'text-amber-950 dark:text-amber-100',
    subTextColor: 'text-amber-700 dark:text-amber-400',
    gradient: 'from-[#B45309] via-[#D97706] to-[#F59E0B]',
    circleBg: 'bg-amber-500/90',
    ringColor: 'ring-amber-400/55',
    subColor: 'text-amber-600 dark:text-amber-300',
    subVi: 'Tổng quan',
    subEn: 'Overview',
  },
  1: {
    accentColor: '#EA580C',
    accentBg: 'bg-orange-50/90 dark:bg-orange-950/70',
    accentBorder: 'border-orange-400/80 dark:border-orange-500/80',
    mainTextColor: 'text-orange-950 dark:text-orange-100',
    subTextColor: 'text-orange-700 dark:text-orange-400',
    gradient: 'from-[#C2410C] via-[#EA580C] to-[#F97316]',
    circleBg: 'bg-orange-500/90',
    ringColor: 'ring-orange-400/55',
    subColor: 'text-orange-600 dark:text-orange-300',
    subVi: 'Tâm thư',
    subEn: 'Cover Letter',
  },
  2: {
    accentColor: '#E11D48',
    accentBg: 'bg-rose-50/90 dark:bg-rose-950/70',
    accentBorder: 'border-rose-400/80 dark:border-rose-500/80',
    mainTextColor: 'text-rose-950 dark:text-rose-100',
    subTextColor: 'text-rose-700 dark:text-rose-400',
    gradient: 'from-[#BE123C] via-[#E11D48] to-[#F43F5E]',
    circleBg: 'bg-rose-500/90',
    ringColor: 'ring-rose-400/55',
    subColor: 'text-rose-600 dark:text-rose-300',
    subVi: 'Hồ sơ',
    subEn: 'Profile',
  },
  3: {
    accentColor: '#0284C7',
    accentBg: 'bg-sky-50/90 dark:bg-sky-950/70',
    accentBorder: 'border-sky-400/80 dark:border-sky-500/80',
    mainTextColor: 'text-sky-950 dark:text-sky-100',
    subTextColor: 'text-sky-700 dark:text-sky-400',
    gradient: 'from-[#0369A1] via-[#0284C7] to-[#0EA5E9]',
    circleBg: 'bg-sky-500/90',
    ringColor: 'ring-sky-400/55',
    subColor: 'text-sky-600 dark:text-sky-300',
    subVi: 'Đào tạo',
    subEn: 'Education',
  },
  4: {
    accentColor: '#059669',
    accentBg: 'bg-emerald-50/90 dark:bg-emerald-950/70',
    accentBorder: 'border-emerald-400/80 dark:border-emerald-500/80',
    mainTextColor: 'text-emerald-950 dark:text-emerald-100',
    subTextColor: 'text-emerald-700 dark:text-emerald-400',
    gradient: 'from-[#047857] via-[#059669] to-[#0D9488]',
    circleBg: 'bg-emerald-500/90',
    ringColor: 'ring-emerald-400/55',
    subColor: 'text-emerald-600 dark:text-emerald-300',
    subVi: 'Giải pháp',
    subEn: 'Services',
  },
  5: {
    accentColor: '#0891B2',
    accentBg: 'bg-cyan-50/90 dark:bg-cyan-950/70',
    accentBorder: 'border-cyan-400/80 dark:border-cyan-500/80',
    mainTextColor: 'text-cyan-950 dark:text-cyan-100',
    subTextColor: 'text-cyan-700 dark:text-cyan-400',
    gradient: 'from-[#0E7490] via-[#0891B2] to-[#06B6D4]',
    circleBg: 'bg-cyan-500/90',
    ringColor: 'ring-cyan-400/55',
    subColor: 'text-cyan-600 dark:text-cyan-300',
    subVi: '22+ Năm',
    subEn: '22+ Years',
  },
  6: {
    accentColor: '#8B5CF6',
    accentBg: 'bg-violet-50/90 dark:bg-violet-950/70',
    accentBorder: 'border-violet-400/80 dark:border-violet-500/80',
    mainTextColor: 'text-violet-950 dark:text-violet-100',
    subTextColor: 'text-violet-700 dark:text-violet-400',
    gradient: 'from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]',
    circleBg: 'bg-violet-500/90',
    ringColor: 'ring-violet-400/55',
    subColor: 'text-violet-600 dark:text-violet-300',
    subVi: 'SWOT CX',
    subEn: 'SWOT Matrix',
  },
  7: {
    accentColor: '#0D9488',
    accentBg: 'bg-teal-50/90 dark:bg-teal-950/70',
    accentBorder: 'border-teal-400/80 dark:border-teal-500/80',
    mainTextColor: 'text-teal-950 dark:text-teal-100',
    subTextColor: 'text-teal-700 dark:text-teal-400',
    gradient: 'from-[#0F766E] via-[#0D9488] to-[#14B8A6]',
    circleBg: 'bg-teal-500/90',
    ringColor: 'ring-teal-400/55',
    subColor: 'text-teal-600 dark:text-teal-300',
    subVi: 'Thực chiến',
    subEn: 'Projects',
  },
  8: {
    accentColor: '#2563EB',
    accentBg: 'bg-blue-50/90 dark:bg-blue-950/70',
    accentBorder: 'border-blue-400/80 dark:border-blue-500/80',
    mainTextColor: 'text-blue-950 dark:text-blue-100',
    subTextColor: 'text-blue-700 dark:text-blue-400',
    gradient: 'from-[#1E40AF] via-[#2563EB] to-[#3B82F6]',
    circleBg: 'bg-blue-500/90',
    ringColor: 'ring-blue-400/55',
    subColor: 'text-blue-600 dark:text-blue-300',
    subVi: 'Công nghệ',
    subEn: 'Systems',
  },
  9: {
    accentColor: '#65A30D',
    accentBg: 'bg-lime-50/90 dark:bg-lime-950/70',
    accentBorder: 'border-lime-400/80 dark:border-lime-500/80',
    mainTextColor: 'text-lime-950 dark:text-lime-100',
    subTextColor: 'text-lime-700 dark:text-lime-400',
    gradient: 'from-[#3F6212] via-[#4D7C0F] to-[#65A30D]',
    circleBg: 'bg-lime-600/90',
    ringColor: 'ring-lime-400/55',
    subColor: 'text-lime-600 dark:text-lime-300',
    subVi: 'Hỏi & Đáp',
    subEn: 'Interview',
  },
  10: {
    accentColor: '#EA580C',
    accentBg: 'bg-orange-50/90 dark:bg-orange-950/70',
    accentBorder: 'border-orange-400/80 dark:border-orange-500/80',
    mainTextColor: 'text-orange-950 dark:text-orange-100',
    subTextColor: 'text-orange-700 dark:text-orange-400',
    gradient: 'from-[#9A3412] via-[#C2410C] to-[#EA580C]',
    circleBg: 'bg-orange-600/90',
    ringColor: 'ring-orange-400/55',
    subColor: 'text-orange-600 dark:text-orange-300',
    subVi: 'Phong thủy',
    subEn: 'Horoscope',
  },
  11: {
    accentColor: '#7C3AED',
    accentBg: 'bg-purple-50/90 dark:bg-purple-950/70',
    accentBorder: 'border-purple-400/80 dark:border-purple-500/80',
    mainTextColor: 'text-purple-950 dark:text-purple-100',
    subTextColor: 'text-purple-700 dark:text-purple-400',
    gradient: 'from-[#5B21B6] via-[#7C3AED] to-[#A78BFA]',
    circleBg: 'bg-purple-500/90',
    ringColor: 'ring-purple-400/55',
    subColor: 'text-purple-600 dark:text-purple-300',
    subVi: 'Khoảnh khắc',
    subEn: 'Memories',
  },
  12: {
    accentColor: '#4338CA',
    accentBg: 'bg-indigo-50/90 dark:bg-indigo-950/70',
    accentBorder: 'border-indigo-400/80 dark:border-indigo-500/80',
    mainTextColor: 'text-indigo-950 dark:text-indigo-100',
    subTextColor: 'text-indigo-700 dark:text-indigo-400',
    gradient: 'from-[#312E81] via-[#4338CA] to-[#6366F1]',
    circleBg: 'bg-indigo-500/90',
    ringColor: 'ring-indigo-400/60',
    subColor: 'text-indigo-600 dark:text-indigo-300',
    subVi: 'Kết nối',
    subEn: 'Contact',
  },
  13: {
    accentColor: '#0EA5E9',
    accentBg: 'bg-sky-50/90 dark:bg-sky-950/70',
    accentBorder: 'border-sky-400/80 dark:border-sky-500/80',
    mainTextColor: 'text-sky-950 dark:text-sky-100',
    subTextColor: 'text-sky-700 dark:text-sky-400',
    gradient: 'from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]',
    circleBg: 'bg-sky-500/90',
    ringColor: 'ring-sky-400/60',
    subColor: 'text-sky-600 dark:text-sky-300',
    subVi: 'Trợ lý 24/7',
    subEn: '24/7 AI',
    avatarGif: 'https://lh3.googleusercontent.com/d/1gY_ln5UNMGbqeLu5Sh6AQF-7Ymu7tIxJ',
  },
  14: {
    accentColor: '#F43F5E',
    accentBg: 'bg-rose-50/90 dark:bg-rose-950/70',
    accentBorder: 'border-rose-400/80 dark:border-rose-500/80',
    mainTextColor: 'text-rose-950 dark:text-rose-100',
    subTextColor: 'text-rose-700 dark:text-rose-400',
    gradient: 'from-[#BE123C] via-[#E11D48] to-[#FB7185]',
    circleBg: 'bg-rose-500/90',
    ringColor: 'ring-rose-400/55',
    subColor: 'text-rose-600 dark:text-rose-300',
    subVi: 'Tùy chỉnh',
    subEn: 'Wallpaper',
  },
  15: {
    accentColor: '#6366F1',
    accentBg: 'bg-indigo-50/90 dark:bg-indigo-950/70',
    accentBorder: 'border-indigo-400/80 dark:border-indigo-500/80',
    mainTextColor: 'text-indigo-950 dark:text-indigo-100',
    subTextColor: 'text-indigo-700 dark:text-indigo-400',
    gradient: 'from-[#4338CA] via-[#6366F1] to-[#818CF8]',
    circleBg: 'bg-indigo-500/90',
    ringColor: 'ring-indigo-400/55',
    subColor: 'text-indigo-600 dark:text-indigo-300',
    subVi: 'Phong cách',
    subEn: 'Interface',
  },
};

// Danh sách các trang hiển thị trên menu icon Header (Ẩn: 12 - Liên hệ / Đặt lịch, 13 - Trợ lý AI, 14 - Hình nền, 15 - Giao diện)
const HIDDEN_HEADER_PAGE_IDS = [12, 13, 14, 15];
const HEADER_ORDER_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const Header: React.FC<HeaderProps> = ({
  pages,
  currentPage,
  currentTheme = 'liquid-glass',
  onSelectPage,
  onShowNotification,
}) => {
  const { language } = useLanguage();

  // Hiển thị các trang trên menu icon Header
  const visiblePages = (pages || []).filter(
    (p: any) => p.name !== 'Nội dung không tồn tại' && !HIDDEN_HEADER_PAGE_IDS.includes(p.id)
  );

  const orderedPages = HEADER_ORDER_IDS.map((id) =>
    visiblePages.find((page: any) => page.id === id)
  ).filter(Boolean) as any[];

  const extraPages = visiblePages.filter(
    (p: any) => !HEADER_ORDER_IDS.includes(p.id) && !HIDDEN_HEADER_PAGE_IDS.includes(p.id)
  );
  const headerPages = [...orderedPages, ...extraPages];

  const { cardStyle } = useTheme();
  void currentTheme;

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [focusedNavIndex, setFocusedNavIndex] = useState<number | null>(null);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const [uniformPillWidth, setUniformPillWidth] = useState<number | null>(null);
  const [trailingGapByIdx, setTrailingGapByIdx] = useState<number[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [isCompactMobile, setIsCompactMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const avatarPillRef = useRef<HTMLDivElement>(null);

  // Đo kích thước tự nhiên và vị trí kết thúc chữ tiêu đề của từng nút ở Header
  useLayoutEffect(() => {
    const measureUniformWidth = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const small = width < 640;
      const compactMobile = width < 768;
      setViewportWidth(width);
      setIsSmallScreen(small);
      setIsCompactMobile(compactMobile);

      const wrappers = pillWrapperRefs.current.slice(0, headerPages.length + 1).filter(Boolean) as HTMLDivElement[];
      const btns = pillBtnRefs.current.slice(0, headerPages.length + 1).filter(Boolean) as HTMLButtonElement[];
      if (wrappers.length === 0 || btns.length === 0) return;

      wrappers.forEach((w) => {
        w.style.width = 'max-content';
      });

      let maxW = 0;
      wrappers.forEach((w) => {
        const rectWidth = Math.ceil(w.getBoundingClientRect().width);
        if (rectWidth > maxW) maxW = rectWidth;
      });

      wrappers.forEach((w) => {
        w.style.width = maxW > 0 ? `${maxW}px` : '';
      });

      if (maxW > 0) {
        setUniformPillWidth((prev) => (prev !== maxW ? maxW : prev));
      }

      const gaps = pillBtnRefs.current.slice(0, headerPages.length + 1).map((btn, idx) => {
        const wrapper = pillWrapperRefs.current[idx];
        if (!btn || !wrapper) return 14;
        const titleEl = btn.querySelector('.nav-pill-title') as HTMLElement | null;
        if (!titleEl) return 14;
        const wrapperRect = wrapper.getBoundingClientRect();
        let textRight = titleEl.getBoundingClientRect().right;
        try {
          if (typeof document !== 'undefined' && document.createRange) {
            const range = document.createRange();
            range.selectNodeContents(titleEl);
            const textRect = range.getBoundingClientRect();
            if (textRect.width > 0) {
              textRight = textRect.right;
            }
          }
        } catch {
          // Fallback to titleEl rect right
        }
        return Math.max(0, Math.round(wrapperRect.right - textRight));
      });
      setTrailingGapByIdx((prev) =>
        prev.length === gaps.length && prev.every((v, i) => v === gaps[i]) ? prev : gaps
      );
    };

    measureUniformWidth();
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measureUniformWidth();
      });
    }
    window.addEventListener('resize', measureUniformWidth);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measureUniformWidth);
    };
  }, [language, cardStyle, headerPages.length, currentPage]);

  const toggleRadialMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playTap();
    setIsRadialMenuOpen((prev) => !prev);
  };

  // Tự động đóng menu phụ & cuộn mượt nút đang chọn vào chính giữa thanh Header trên máy tính bảng / điện thoại
  useEffect(() => {
    setIsRadialMenuOpen(false);
    setFocusedNavIndex(null);
  }, [currentPage]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const rafId = window.requestAnimationFrame(() => {
      const targetId = currentPage === 12 ? '#header-btn-hungthai-avatar' : `#nav-item-${currentPage}`;
      const activeEl = nav.querySelector(targetId) as HTMLElement | null;
      if (!activeEl) return;

      const isScrollable = nav.scrollWidth > nav.clientWidth + 4;
      if (isScrollable || viewportWidth < 1024) {
        const navRect = nav.getBoundingClientRect();
        const btnRect = activeEl.getBoundingClientRect();
        const btnCenter = btnRect.left - navRect.left + nav.scrollLeft + btnRect.width / 2;
        const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
        const targetScrollLeft = Math.max(0, Math.min(maxScroll, btnCenter - nav.clientWidth / 2));
        nav.scrollTo({ left: targetScrollLeft, behavior: 'auto' });
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [currentPage, viewportWidth, uniformPillWidth, isCompactMobile]);


  const exposedWidth = isSmallScreen ? 44 : 46;
  const overlapPx = uniformPillWidth
    ? Math.max(0, uniformPillWidth - exposedWidth)
    : isSmallScreen
      ? 92
      : 96;

  const selectedNavIndex = useMemo(() => {
    if (isRadialMenuOpen || currentPage === 12) {
      return headerPages.length;
    }
    const idx = headerPages.findIndex((p) => p.id === currentPage);
    return idx >= 0 ? idx : null;
  }, [headerPages, currentPage, isRadialMenuOpen]);

  const revealedNavIndex =
    focusedNavIndex !== null ? focusedNavIndex : selectedNavIndex;

  const getRevealOverlapPx = (prevIdx: number) => {
    const trailingGap = trailingGapByIdx[prevIdx];
    if (typeof trailingGap !== 'number' || Number.isNaN(trailingGap)) {
      return 10;
    }
    // Chồng nhẹ vào phần đuôi trống sát ngay sau chữ tiêu đề nút trước, chừa tối thiểu 5px để không che mất chữ
    return Math.max(2, Math.min(28, trailingGap - 5));
  };

  const headerElement = (
    <header
      ref={headerRef}
      id="app-header"
      data-element-name="Thanh điều hướng Header chính"
      data-element-type="container"
      data-element-page="global"
      data-element-parent="website-root"
      style={{
        maxWidth: 'var(--main-card-target-w, 1000px)',
        width: '100%',
        height: 'var(--shell-bar-h, auto)',
        minHeight: 'var(--shell-bar-h, 52px)',
        boxSizing: 'border-box',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '0px',
        marginBottom: '0px',
        paddingTop: '5px',
        paddingBottom: '5px',
        zIndex: isRadialMenuOpen ? 99999 : 40,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: 'var(--radius-primary-surface, var(--radius-main, 14px))',
        borderBottomRightRadius: 'var(--radius-primary-surface, var(--radius-main, 14px))',
        borderRadius: '0 0 var(--radius-primary-surface, var(--radius-main, 14px)) var(--radius-primary-surface, var(--radius-main, 14px))',
      }}
      className={`neonav-bar mx-auto py-[5px] flex items-center justify-between px-[10px] sm:px-[15px] ${
        isRadialMenuOpen ? 'z-[99999]' : 'z-40'
      } relative flex-shrink-0 overflow-visible pointer-events-auto`}
    >
      {/* Khu vực Menu chính: Các nút định dạng xếp chồng trên desktop (tự tách rõ trên thiết bị chạm) */}
      <nav
        ref={navRef}
        id="header-center"
        aria-label={language === 'en' ? 'Primary navigation' : 'Điều hướng chính'}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setFocusedNavIndex(null);
          }
        }}
        className={`flex-1 min-w-0 h-full flex items-center justify-start lg:justify-center overflow-x-auto overflow-y-visible horizontal-scroll-smooth z-10 px-1.5 py-0.5 mx-auto bg-transparent relative flex-nowrap ${
          isCompactMobile ? 'gap-2' : ''
        }`}
        style={{ background: 'transparent' }}
      >
        {headerPages.map((page: any, index: number) => {
          const styleCfg = PAGE_FOOTER_STYLE_MAP[page.id] || PAGE_FOOTER_STYLE_MAP[0];
          const isSelected = page.id === currentPage;
          // Hiệu ứng nút sau nằm trên nút trước: z-index tăng dần từ trái sang phải, kể cả nút liền sau nút đang chọn
          // Đồng thời tính khoảng chồng sát phần cuối tiêu đề của nút nằm dưới để thấy trọn vẹn tiêu đề nút đang chọn
          const baseZIndex = index + 10;
          const isAfterRevealed = revealedNavIndex !== null && index === revealedNavIndex + 1;
          const itemMarginLeft = isCompactMobile
            ? '0px'
            : index === 0
              ? '0px'
              : isAfterRevealed
                ? `-${getRevealOverlapPx(index - 1)}px`
                : `-${overlapPx}px`;

          const pageTitle =
            language === 'en' && page.shortTitleEn
              ? page.shortTitleEn
              : page.shortTitle || page.name;
          const pageSub = language === 'en' ? styleCfg.subEn : styleCfg.subVi;

          return (
            <div
              key={page.id}
              className="relative pointer-events-auto shrink-0"
              style={{
                marginLeft: itemMarginLeft,
                zIndex: baseZIndex,
              }}
            >
              <div
                ref={(el) => {
                  pillWrapperRefs.current[index] = el;
                }}
                className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none w-max h-auto p-0 bg-transparent border-0"
                style={{
                  width: uniformPillWidth ? `${uniformPillWidth}px` : undefined,
                }}
              >
                {/* Main Inner Button */}
                <button
                  ref={(el) => {
                    pillBtnRefs.current[index] = el;
                  }}
                  id={`nav-item-${page.id}`}
                  type="button"
                  role="button"
                  aria-current={isSelected ? 'page' : undefined}
                  data-active={isSelected ? 'true' : 'false'}
                  onFocus={() => setFocusedNavIndex(index)}
                  onClick={() => {
                    SoundEngine.playPageSpecificSound(page.id);
                    onSelectPage(page.id);
                  }}
                  title={`${pageTitle} · ${pageSub}`}
                  className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[7px] cursor-pointer border"
                  style={
                    {
                      '--nav-pill-accent': styleCfg.accentColor,
                      width: '154px',
                      height: '42px',
                      paddingTop: '6px',
                      paddingRight: '10px',
                      paddingBottom: '6px',
                      paddingLeft: '10px',
                      fontWeight: 'normal',
                      borderWidth: '1px',
                    } as React.CSSProperties
                  }
                >
                  {/* Round Circle Badge with Icon or Avatar */}
                  <div className="nav-pill-icon-badge relative z-10 w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                    {styleCfg.avatarGif ? (
                      <img
                        src={styleCfg.avatarGif}
                        alt={pageTitle}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <WebIcon
                        name={page.icon || 'home'}
                        isActive={isSelected}
                        className="nav-pill-icon-svg w-[15px] h-[15px] text-center block shrink-0"
                      />
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div className="nav-pill-divider w-[1.5px] h-[18px] shrink-0 rounded-[999px]" />

                  <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                    <span
                      style={{ fontWeight: 'bold' }}
                      className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate"
                    >
                      {pageTitle}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          );
        })}

        {/* Nút Avatar Hùng Thái nằm sau nút cuối */}
        {(() => {
          const avatarNavIndex = headerPages.length;
          // Hiệu ứng nút sau nằm trên nút trước (nút avatar nằm ở cuối, z-index cao nhất)
          const baseZIndex = isRadialMenuOpen
            ? 99999
            : avatarNavIndex + 10;
          const isAfterRevealed = revealedNavIndex !== null && avatarNavIndex === revealedNavIndex + 1;
          const itemMarginLeft = isCompactMobile
            ? '0px'
            : headerPages.length === 0
              ? '0px'
              : isAfterRevealed
                ? `-${getRevealOverlapPx(avatarNavIndex - 1)}px`
                : `-${overlapPx}px`;

          return (
            <div
              key="header-hungthai-avatar-pill"
              ref={avatarPillRef}
              className="relative pointer-events-auto shrink-0"
              style={{
                marginLeft: itemMarginLeft,
                zIndex: baseZIndex,
              }}
            >
              <div
                ref={(el) => {
                  pillWrapperRefs.current[avatarNavIndex] = el;
                }}
                className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none w-max h-auto p-0 bg-transparent border-0"
                style={{
                  width: uniformPillWidth ? `${uniformPillWidth}px` : undefined,
                }}
              >
                <button
                  ref={(el) => {
                    pillBtnRefs.current[avatarNavIndex] = el;
                  }}
                  id="header-btn-hungthai-avatar"
                  type="button"
                  role="button"
                  aria-haspopup="dialog"
                  aria-label={
                    language === 'en'
                      ? 'Expert Nguyen Hung Thai · Booking and Customer Support Menu'
                      : 'Chuyên gia Nguyễn Hùng Thái · Đặt lịch và Chăm sóc khách hàng'
                  }
                  aria-current={currentPage === 12 ? 'page' : undefined}
                  data-active={currentPage === 12 || isRadialMenuOpen ? 'true' : 'false'}
                  aria-expanded={isRadialMenuOpen}
                  onFocus={() => setFocusedNavIndex(avatarNavIndex)}
                  onClick={(e) => {
                    toggleRadialMenu(e);
                  }}
                  title={
                    language === 'en'
                      ? 'Expert Nguyen Hung Thai · Booking & CS'
                      : 'Chuyên gia Nguyễn Hùng Thái · Đặt lịch & CSKH'
                  }
                  className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[7px] cursor-pointer border"
                  style={
                    {
                      '--nav-pill-accent': '#4F46E5',
                      width: '154px',
                      height: '42px',
                      paddingTop: '6px',
                      paddingRight: '10px',
                      paddingBottom: '6px',
                      paddingLeft: '10px',
                      fontWeight: 'normal',
                      borderWidth: '1px',
                    } as React.CSSProperties
                  }
                >
                  <div className="nav-pill-icon-badge relative z-10 w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                    <img
                      src="https://lh3.googleusercontent.com/d/1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm"
                      alt="Hùng Thái"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="nav-pill-divider w-[1.5px] h-[18px] shrink-0 rounded-[999px]" />
                  <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                    <span
                      style={{ fontWeight: 'bold' }}
                      className="nav-pill-title typo-nav leading-tight font-play truncate"
                    >
                      {language === 'en' ? 'Hung Thai' : 'Hùng Thái'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Radial Contact Menu Popup */}
              <RadialContactMenu
                isOpen={isRadialMenuOpen}
                onClose={() => setIsRadialMenuOpen(false)}
                onSelectTab={(tabId) => {
                  onSelectPage(tabId);
                  setIsRadialMenuOpen(false);
                }}
                onShowNotification={onShowNotification}
                currentTab={currentPage}
                position="top"
                align="left"
                anchorRef={avatarPillRef}
              />
            </div>
          );
        })()}
      </nav>
    </header>
  );

  return headerElement;
};
