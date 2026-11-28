'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageMeta, SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';
import { WebIcon } from '@/components/ui/WebIcon';
import { useTheme } from '@/hooks/useTheme';
import {
  LETTER_14_DARK_HEXES,
  LETTER_14_LIGHT_HEXES,
  LETTER_14_PALETTE_THEME_STYLES,
} from '@/config/ui/themeDefaults';
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
  darkAccentColor: string;
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
    darkAccentColor: '#FBBF24',
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
    darkAccentColor: '#FB923C',
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
    darkAccentColor: '#FB7185',
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
    darkAccentColor: '#38BDF8',
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
    darkAccentColor: '#34D399',
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
    darkAccentColor: '#22D3EE',
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
    accentColor: '#7C3AED',
    darkAccentColor: '#A78BFA',
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
    darkAccentColor: '#2DD4BF',
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
    darkAccentColor: '#60A5FA',
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
    accentColor: '#4D7C0F',
    darkAccentColor: '#A3E635',
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
    darkAccentColor: '#FB923C',
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
    darkAccentColor: '#C084FC',
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
    darkAccentColor: '#A5B4FC',
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
    accentColor: '#0284C7',
    darkAccentColor: '#38BDF8',
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
    accentColor: '#E11D48',
    darkAccentColor: '#FDA4AF',
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
    accentColor: '#4F46E5',
    darkAccentColor: '#818CF8',
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

  const { cardStyle, isDark } = useTheme();
  void currentTheme;
  const isWalnutTheme = cardStyle === 'walnut-wood';
  const isLeatherTheme = cardStyle === 'cowhide-leather';
  const isOceanTheme = cardStyle === 'deep-ocean';
  const isLetter14PaletteTheme = LETTER_14_PALETTE_THEME_STYLES.includes(cardStyle);
  const leatherGoldAccent = isDark ? '#E5B87E' : '#D97706';
  const activeLetter14Palette = isDark ? LETTER_14_DARK_HEXES : LETTER_14_LIGHT_HEXES;

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [focusedNavIndex, setFocusedNavIndex] = useState<number | null>(null);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuPopupRef = useRef<HTMLDivElement>(null);
  const [mobilePopupCoords, setMobilePopupCoords] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({ top: 72, left: 8, width: 300, maxHeight: 420 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvePillAccent = (pageId: number, paletteIndex: number) => {
    const styleCfg = PAGE_FOOTER_STYLE_MAP[pageId] || PAGE_FOOTER_STYLE_MAP[0];
    if (isWalnutTheme) return '#F5C478';
    if (isLeatherTheme) return leatherGoldAccent;
    if (isOceanTheme) return '#38BDF8';
    if (isLetter14PaletteTheme) {
      return activeLetter14Palette[paletteIndex % activeLetter14Palette.length];
    }
    return (isDark ? styleCfg.darkAccentColor : styleCfg.accentColor) || '#4F46E5';
  };

  // Đo kích thước tự nhiên và vị trí kết thúc chữ tiêu đề của từng nút ở Header
  useLayoutEffect(() => {
    const measureUniformWidth = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const small = width < 640;
      const compactMobile = width < 768;
      setViewportWidth(width);
      setIsSmallScreen(small);
      setIsCompactMobile(compactMobile);

      if (compactMobile) {
        return;
      }

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

  // Tự động đóng menu phụ & cuộn mượt nút đang chọn vào chính giữa thanh Header trên máy tính bảng / desktop
  useEffect(() => {
    setIsRadialMenuOpen(false);
    setIsMobileMenuOpen(false);
    setFocusedNavIndex(null);
    setHoveredNavIndex(null);
  }, [currentPage]);

  useEffect(() => {
    if (!isCompactMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isCompactMobile, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || !isCompactMobile) return;

    const updateMobilePopupCoords = () => {
      const triggerEl = mobileTriggerRef.current;
      if (!triggerEl) return;
      const rect = triggerEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const left = Math.max(8, Math.min(Math.round(rect.left), vw - 260));
      const top = Math.max(8, Math.round(rect.bottom + 8));
      const width = Math.min(320, Math.max(240, vw - left - 8));
      const maxHeight = Math.max(220, vh - top - 88);
      setMobilePopupCoords({ top, left, width, maxHeight });
    };

    updateMobilePopupCoords();
    const timer = window.setTimeout(updateMobilePopupCoords, 16);

    const handleOutsidePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (mobileTriggerRef.current?.contains(target)) return;
      if (mobileMenuPopupRef.current?.contains(target)) return;
      setIsMobileMenuOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', updateMobilePopupCoords);
    window.addEventListener('scroll', updateMobilePopupCoords, true);
    document.addEventListener('mousedown', handleOutsidePointerDown);
    document.addEventListener('touchstart', handleOutsidePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateMobilePopupCoords);
      window.removeEventListener('scroll', updateMobilePopupCoords, true);
      document.removeEventListener('mousedown', handleOutsidePointerDown);
      document.removeEventListener('touchstart', handleOutsidePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, isCompactMobile]);

  useEffect(() => {
    if (isCompactMobile) return;
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
  const effectivePillWidth = uniformPillWidth ?? 176;
  const overlapPx = Math.max(0, effectivePillWidth - exposedWidth);

  const selectedNavIndex = useMemo(() => {
    if (isRadialMenuOpen || currentPage === 12) {
      return headerPages.length;
    }
    const idx = headerPages.findIndex((p) => p.id === currentPage);
    return idx >= 0 ? idx : null;
  }, [headerPages, currentPage, isRadialMenuOpen]);

  const revealedNavIndex =
    hoveredNavIndex !== null
      ? hoveredNavIndex
      : focusedNavIndex !== null
        ? focusedNavIndex
        : selectedNavIndex;

  const getRevealOverlapPx = (prevIdx: number) => {
    const trailingGap = trailingGapByIdx[prevIdx];
    if (typeof trailingGap !== 'number' || Number.isNaN(trailingGap)) {
      return 10;
    }
    // Chồng nhẹ vào phần đuôi trống sát ngay sau chữ tiêu đề nút trước, chừa tối thiểu 5px để không che mất chữ
    return Math.max(2, Math.min(28, trailingGap - 5));
  };

  const activePageMeta = useMemo(
    () => (pages || []).find((p: any) => p.id === currentPage) || headerPages[0],
    [pages, currentPage, headerPages]
  );

  const activePageTitle = useMemo(() => {
    if (currentPage === 12) {
      return language === 'en' ? 'Contact' : 'Liên hệ';
    }
    if (!activePageMeta) {
      return language === 'en' ? 'Home' : 'Trang chủ';
    }
    return language === 'en' && activePageMeta.shortTitleEn
      ? activePageMeta.shortTitleEn
      : activePageMeta.shortTitle || activePageMeta.name;
  }, [activePageMeta, currentPage, language]);

  const activeHeaderIdx = headerPages.findIndex((p: any) => p.id === currentPage);
  const mobileTriggerAccent = resolvePillAccent(
    currentPage,
    activeHeaderIdx >= 0 ? activeHeaderIdx : headerPages.length
  );

  const mobileCategoryDrawer =
    mounted && isCompactMobile
      ? createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                ref={mobileMenuPopupRef}
                id="mobile-nav-menu-popup"
                role="menu"
                aria-label={language === 'en' ? 'Navigation category menu' : 'Danh mục điều hướng'}
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed z-[999999] p-3 flex flex-col gap-2 overflow-y-auto horizontal-scroll-smooth pointer-events-auto select-none"
                style={{
                  top: `${mobilePopupCoords.top}px`,
                  left: `${mobilePopupCoords.left}px`,
                  width: `${mobilePopupCoords.width}px`,
                  maxWidth: 'calc(100vw - 16px)',
                  maxHeight: `${mobilePopupCoords.maxHeight}px`,
                }}
              >
                <div
                  className="flex items-center justify-between gap-2 px-1.5 pb-2 border-b"
                  style={{ borderColor: 'var(--border-muted, rgba(148, 163, 184, 0.24))' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <WebIcon
                      name="layout-grid"
                      animated={false}
                      className="w-4 h-4 shrink-0"
                      style={{ color: mobileTriggerAccent }}
                    />
                    <span
                      className="text-xs font-bold tracking-wider truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {language === 'en' ? 'Menu Categories' : 'Danh mục menu'}
                    </span>
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-full shrink-0"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-primary, #4F46E5) 14%, transparent)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {headerPages.length + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={language === 'en' ? 'Close menu' : 'Đóng danh mục'}
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-7 h-7 rounded-full inline-flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                    style={{
                      background: 'var(--surface-tertiary-bg, rgba(148, 163, 184, 0.14))',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <WebIcon name="x" animated={false} className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {headerPages.map((page: any, index: number) => {
                    const styleCfg = PAGE_FOOTER_STYLE_MAP[page.id] || PAGE_FOOTER_STYLE_MAP[0];
                    const isSelected = page.id === currentPage;
                    const pageTitle =
                      language === 'en' && page.shortTitleEn
                        ? page.shortTitleEn
                        : page.shortTitle || page.name;
                    const pageSub = language === 'en' ? styleCfg.subEn : styleCfg.subVi;

                    return (
                      <button
                        key={`mobile-cat-${page.id}`}
                        id={`mobile-nav-item-${page.id}`}
                        type="button"
                        role="menuitem"
                        aria-current={isSelected ? 'page' : undefined}
                        data-active={isSelected ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playPageSpecificSound(page.id);
                          onSelectPage(page.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className="nav-pill relative w-full inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer border px-2.5 py-1.5 text-left"
                        style={
                          {
                            '--nav-pill-accent': resolvePillAccent(page.id, index),
                            minHeight: '42px',
                          } as React.CSSProperties
                        }
                      >
                        <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                          <WebIcon
                            name={page.icon || 'home'}
                            isActive={isSelected}
                            className="nav-pill-icon-svg w-[16px] h-[16px] text-center block shrink-0"
                          />
                        </div>
                        <div className="nav-pill-divider w-[1.5px] h-[18px] shrink-0 rounded-[999px]" />
                        <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                          <span className="nav-pill-title text-[14px] font-bold leading-tight font-play tracking-tight truncate">
                            {pageTitle}
                          </span>
                          <span
                            className="text-[11px] font-medium opacity-70 truncate shrink-0"
                            style={{ color: 'var(--text-secondary, var(--text-muted))' }}
                          >
                            {pageSub}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Liên hệ & Đặt lịch */}
                  {(() => {
                    const contactIdx = headerPages.length;
                    const contactStyleCfg = PAGE_FOOTER_STYLE_MAP[12] || PAGE_FOOTER_STYLE_MAP[0];
                    const isContactSelected = currentPage === 12;
                    return (
                      <button
                        id="mobile-nav-item-contact"
                        type="button"
                        role="menuitem"
                        aria-current={isContactSelected ? 'page' : undefined}
                        data-active={isContactSelected ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playPageSpecificSound(12);
                          onSelectPage(12);
                          setIsMobileMenuOpen(false);
                        }}
                        className="nav-pill relative w-full inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer border px-2.5 py-1.5 text-left"
                        style={
                          {
                            '--nav-pill-accent': resolvePillAccent(12, contactIdx),
                            minHeight: '42px',
                          } as React.CSSProperties
                        }
                      >
                        <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                          <WebIcon
                            name="contact"
                            isActive={isContactSelected}
                            className="nav-pill-icon-svg w-[16px] h-[16px] text-center block shrink-0"
                          />
                        </div>
                        <div className="nav-pill-divider w-[1.5px] h-[18px] shrink-0 rounded-[999px]" />
                        <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                          <span className="nav-pill-title text-[14px] font-bold leading-tight font-play tracking-tight truncate">
                            {language === 'en' ? 'Contact' : 'Liên hệ'}
                          </span>
                          <span
                            className="text-[11px] font-medium opacity-70 truncate shrink-0"
                            style={{ color: 'var(--text-secondary, var(--text-muted))' }}
                          >
                            {language === 'en' ? contactStyleCfg.subEn : contactStyleCfg.subVi}
                          </span>
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  const headerElement = (
    <header
      ref={headerRef}
      id="app-header"
      data-element-name="Thanh điều hướng Header chính"
      data-element-type="container"
      data-element-page="global"
      data-element-parent="website-root"
      style={{
        maxWidth: 'var(--main-card-target-w, 1200px)',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '0px',
        marginBottom: '0px',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: 'var(--shell-px, clamp(10px, 3vw, 45px))',
        paddingRight: 'var(--shell-px, clamp(10px, 3vw, 45px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCompactMobile ? 'flex-start' : 'center',
        zIndex: isRadialMenuOpen || isMobileMenuOpen ? 99999 : 40,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: 'var(--radius-primary-surface, var(--radius-main, 14px))',
        borderBottomRightRadius: 'var(--radius-primary-surface, var(--radius-main, 14px))',
        borderRadius: '0 0 var(--radius-primary-surface, var(--radius-main, 14px)) var(--radius-primary-surface, var(--radius-main, 14px))',
      }}
      className={`neonav-bar mx-auto py-[5px] flex items-center ${
        isCompactMobile ? 'justify-start' : 'justify-center'
      } px-2.5 sm:px-6 lg:px-[45px] ${
        isRadialMenuOpen || isMobileMenuOpen ? 'z-[99999]' : 'z-40'
      } relative flex-shrink-0 overflow-visible pointer-events-auto`}
    >
      {/* Khu vực Menu chính: Mobile thu gọn thành thanh danh mục bên góc trái trên; Desktop giữ xếp chồng pill */}
      <nav
        ref={navRef}
        id="header-center"
        data-theme-synced="true"
        aria-label={language === 'en' ? 'Primary navigation' : 'Điều hướng chính'}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') {
            setHoveredNavIndex(null);
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setFocusedNavIndex(null);
          }
        }}
        className={`flex-1 min-w-0 h-full flex items-center ${
          isCompactMobile
            ? 'justify-start overflow-visible px-0'
            : 'justify-start lg:justify-center overflow-x-auto overflow-y-visible horizontal-scroll-smooth px-1.5'
        } z-10 py-0 my-auto bg-transparent relative flex-nowrap`}
        style={{ background: 'transparent', alignItems: 'center', height: '100%' }}
      >
        {isCompactMobile ? (
          <div className="relative inline-flex items-center justify-start max-w-full my-auto">
            <button
              ref={mobileTriggerRef}
              id="mobile-menu-trigger-btn"
              type="button"
              aria-haspopup="menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu-popup"
              data-active={isMobileMenuOpen ? 'true' : 'false'}
              onClick={() => {
                SoundEngine.playTap();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer border max-w-full"
              style={
                {
                  '--nav-pill-accent': mobileTriggerAccent,
                  width: 'auto',
                  maxWidth: '100%',
                  minHeight: '42px',
                  paddingTop: '4px',
                  paddingRight: '12px',
                  paddingBottom: '4px',
                  paddingLeft: '8px',
                  fontWeight: 'normal',
                } as React.CSSProperties
              }
            >
              <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                <WebIcon
                  name={isMobileMenuOpen ? 'x' : 'menu'}
                  isActive={isMobileMenuOpen}
                  className="nav-pill-icon-svg w-[17px] h-[17px] text-center block shrink-0"
                />
              </div>
              <div className="nav-pill-divider w-[1.5px] h-[20px] shrink-0 rounded-[999px]" />
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  style={{ fontWeight: 'bold' }}
                  className="nav-pill-title text-[14px] font-bold leading-tight font-play tracking-tight truncate"
                >
                  {language === 'en' ? `Menu · ${activePageTitle}` : `Danh mục · ${activePageTitle}`}
                </span>
                <WebIcon
                  name="chevron-down"
                  animated={false}
                  className={`mobile-menu-chevron w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    isMobileMenuOpen ? 'rotate-180' : ''
                  }`}
                  style={{ color: mobileTriggerAccent }}
                />
              </div>
            </button>
          </div>
        ) : (
          <>
            {headerPages.map((page: any, index: number) => {
              const styleCfg = PAGE_FOOTER_STYLE_MAP[page.id] || PAGE_FOOTER_STYLE_MAP[0];
              const isSelected = page.id === currentPage;
              // Hiệu ứng nút sau nằm trên nút trước: z-index tăng dần từ trái sang phải, kể cả nút liền sau nút đang chọn
              // Đồng thời tính khoảng chồng sát phần cuối tiêu đề của nút nằm dưới để thấy trọn vẹn tiêu đề nút đang chọn
              const baseZIndex = index + 10;
              const isAfterRevealed = revealedNavIndex !== null && index === revealedNavIndex + 1;
              const itemMarginLeft =
                index === 0
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
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') {
                      setHoveredNavIndex(index);
                    }
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') {
                      setHoveredNavIndex((prev) => (prev === index ? null : prev));
                    }
                  }}
                  className="relative pointer-events-auto shrink-0 flex items-center self-center my-auto transition-[margin] duration-250 ease-out"
                  style={{
                    marginLeft: itemMarginLeft,
                    zIndex: baseZIndex,
                  }}
                >
                  <div
                    ref={(el) => {
                      pillWrapperRefs.current[index] = el;
                    }}
                    className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between self-center my-auto rounded-[999px] select-none w-max h-auto p-0 bg-transparent border-0"
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
                      className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer border"
                      style={
                        {
                          '--nav-pill-accent': resolvePillAccent(page.id, index),
                          width: '176px',
                          height: '50px',
                          minHeight: '50px',
                          paddingTop: '4px',
                          paddingRight: '12px',
                          paddingBottom: '4px',
                          paddingLeft: '12px',
                          fontWeight: 'normal',
                        } as React.CSSProperties
                      }
                    >
                      {/* Round Circle Badge with Icon or Avatar */}
                      <div className="nav-pill-icon-badge relative z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
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
                            isHovered={hoveredNavIndex === index}
                            className="nav-pill-icon-svg w-[19px] h-[19px] text-center block shrink-0"
                          />
                        )}
                      </div>

                      {/* Vertical Divider */}
                      <div className="nav-pill-divider w-[1.5px] h-[22px] shrink-0 rounded-[999px]" />

                      <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-auto self-center">
                        <span
                          style={{
                            fontWeight: 'bold',
                          }}
                          className="nav-pill-title text-[15px] font-bold leading-tight font-play tracking-tight truncate"
                        >
                          {pageTitle}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Nút Liên hệ (kế thừa nút avatar Hùng Thái cũ) nằm sau nút cuối */}
            {(() => {
              const avatarNavIndex = headerPages.length;
              // Hiệu ứng nút sau nằm trên nút trước (nút liên hệ nằm ở cuối, z-index cao nhất)
              const baseZIndex = isRadialMenuOpen ? 99999 : avatarNavIndex + 10;
              const isAfterRevealed = revealedNavIndex !== null && avatarNavIndex === revealedNavIndex + 1;
              const itemMarginLeft =
                headerPages.length === 0
                  ? '0px'
                  : isAfterRevealed
                    ? `-${getRevealOverlapPx(avatarNavIndex - 1)}px`
                    : `-${overlapPx}px`;

              return (
                <div
                  key="header-hungthai-avatar-pill"
                  ref={avatarPillRef}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') {
                      setHoveredNavIndex(avatarNavIndex);
                    }
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') {
                      setHoveredNavIndex((prev) => (prev === avatarNavIndex ? null : prev));
                    }
                  }}
                  className="relative pointer-events-auto shrink-0 flex items-center self-center my-auto transition-[margin] duration-250 ease-out"
                  style={{
                    marginLeft: itemMarginLeft,
                    zIndex: baseZIndex,
                  }}
                >
                  <div
                    ref={(el) => {
                      pillWrapperRefs.current[avatarNavIndex] = el;
                    }}
                    className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between self-center my-auto rounded-[999px] select-none w-max h-auto p-0 bg-transparent border-0"
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
                      role="tab"
                      aria-selected={currentPage === 12 || isRadialMenuOpen}
                      aria-haspopup="dialog"
                      aria-label={
                        language === 'en'
                          ? 'Contact · Booking and Customer Support Menu'
                          : 'Liên hệ · Đặt lịch và Chăm sóc khách hàng'
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
                          ? 'Contact · Booking & CS'
                          : 'Liên hệ · Đặt lịch & CSKH'
                      }
                      className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer border"
                      style={
                        {
                          '--nav-pill-accent': resolvePillAccent(12, avatarNavIndex),
                          width: '176px',
                          height: '50px',
                          minHeight: '50px',
                          paddingTop: '4px',
                          paddingRight: '12px',
                          paddingBottom: '4px',
                          paddingLeft: '12px',
                          fontWeight: 'normal',
                          borderWidth: '1px',
                        } as React.CSSProperties
                      }
                    >
                      <div className="nav-pill-icon-badge relative z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                        <WebIcon
                          name="contact"
                          isActive={currentPage === 12 || isRadialMenuOpen}
                          isHovered={hoveredNavIndex === avatarNavIndex}
                          className="nav-pill-icon-svg w-[19px] h-[19px] text-center block shrink-0"
                        />
                      </div>
                      <div className="nav-pill-divider w-[1.5px] h-[22px] shrink-0 rounded-[999px]" />
                      <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-auto self-center">
                        <span
                          style={{
                            fontWeight: 'bold',
                          }}
                          className="nav-pill-title text-[15px] font-bold leading-tight font-play tracking-tight truncate"
                        >
                          {language === 'en' ? 'Contact' : 'Liên hệ'}
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
          </>
        )}
      </nav>
    </header>
  );

  return (
    <>
      {headerElement}
      {mobileCategoryDrawer}
    </>
  );
};
