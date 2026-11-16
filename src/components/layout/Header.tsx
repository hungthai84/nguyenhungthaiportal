'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { PageMeta, SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';
import { WebIcon } from '@/components/ui/WebIcon';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { RadialContactMenu } from './RadialContactMenu';

// Thêm keyframes cho hiệu ứng rung
const vibrateStyle = `
  @keyframes vibrate {
    0% { transform: translate(0); }
    20% { transform: translate(-1px, 1px); }
    40% { transform: translate(1px, -1px); }
    60% { transform: translate(-1px, -1px); }
    80% { transform: translate(1px, 1px); }
    100% { transform: translate(0); }
  }
  .vibrate { animation: vibrate 0.3s linear infinite; }
`;

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
  glowColor: string;
  laserColor: string;
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
    glowColor: 'rgba(245, 158, 11, 0.45)',
    laserColor: '#F59E0B',
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
    glowColor: 'rgba(249, 115, 22, 0.45)',
    laserColor: '#F97316',
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
    glowColor: 'rgba(244, 63, 94, 0.45)',
    laserColor: '#F43F5E',
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
    glowColor: 'rgba(14, 165, 233, 0.45)',
    laserColor: '#0EA5E9',
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
    glowColor: 'rgba(16, 185, 129, 0.45)',
    laserColor: '#10B981',
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
    glowColor: 'rgba(6, 182, 212, 0.45)',
    laserColor: '#06B6D4',
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
    glowColor: 'rgba(139, 92, 246, 0.45)',
    laserColor: '#8B5CF6',
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
    glowColor: 'rgba(20, 184, 166, 0.45)',
    laserColor: '#14B8A6',
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
    glowColor: 'rgba(59, 130, 246, 0.45)',
    laserColor: '#3B82F6',
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
    glowColor: 'rgba(132, 204, 22, 0.45)',
    laserColor: '#84CC16',
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
    glowColor: 'rgba(234, 88, 12, 0.45)',
    laserColor: '#EA580C',
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
    glowColor: 'rgba(167, 139, 250, 0.45)',
    laserColor: '#A78BFA',
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
    glowColor: 'rgba(79, 70, 229, 0.5)',
    laserColor: '#6366F1',
    subColor: 'text-indigo-600 dark:text-indigo-300',
    subVi: 'Kết nối',
    subEn: 'Contact',
  },
  13: {
    accentColor: '#A855F7',
    accentBg: 'bg-purple-50/90 dark:bg-purple-950/70',
    accentBorder: 'border-purple-400/80 dark:border-purple-500/80',
    mainTextColor: 'text-purple-950 dark:text-purple-100',
    subTextColor: 'text-purple-700 dark:text-purple-400',
    gradient: 'from-[#6B21A8] via-[#7E22CE] to-[#A855F7]',
    circleBg: 'bg-purple-950/80',
    ringColor: 'ring-purple-400/60',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    laserColor: '#A855F7',
    subColor: 'text-purple-600 dark:text-purple-300',
    subVi: 'Trợ lý 24/7',
    subEn: '24/7 AI',
    avatarGif: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550149/Avata_AI_h%E1%BB%97_tr%E1%BB%A3.gif',
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
    glowColor: 'rgba(244, 63, 94, 0.45)',
    laserColor: '#F43F5E',
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
    glowColor: 'rgba(99, 102, 241, 0.45)',
    laserColor: '#6366F1',
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
  currentTheme = 'light-glass',
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
  void vibrateStyle;

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const [uniformPillWidth, setUniformPillWidth] = useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const avatarPillRef = useRef<HTMLDivElement>(null);

  // Đo kích thước tự nhiên của toàn bộ các nút ở Header và đồng bộ chiều ngang bằng nút rộng nhất
  useLayoutEffect(() => {
    const measureUniformWidth = () => {
      const small = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
      setIsSmallScreen(small);

      const wrappers = pillWrapperRefs.current.filter(Boolean) as HTMLDivElement[];
      const btns = pillBtnRefs.current.filter(Boolean) as HTMLButtonElement[];
      if (wrappers.length === 0 || btns.length === 0) return;

      wrappers.forEach((w) => {
        w.style.width = 'max-content';
      });
      btns.forEach((b) => {
        b.style.width = 'max-content';
      });

      let maxW = 0;
      wrappers.forEach((w) => {
        const rectWidth = Math.ceil(w.getBoundingClientRect().width);
        if (rectWidth > maxW) maxW = rectWidth;
      });

      wrappers.forEach((w) => {
        w.style.width = maxW > 0 ? `${maxW}px` : '';
      });
      btns.forEach((b) => {
        b.style.width = '100%';
      });

      if (maxW > 0) {
        setUniformPillWidth((prev) => (prev !== maxW ? maxW : prev));
      }
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

  const handleHeaderMouseLeave = () => {
    setHoveredNavIndex(null);
  };

  // Hover handler with page-specific sound feedback
  const handleItemMouseEnter = (index: number, pageId: number) => {
    setHoveredNavIndex(index);
    SoundEngine.playPageSpecificSound(pageId);
  };

  const toggleRadialMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playTap();
    setIsRadialMenuOpen((prev) => !prev);
  };

  const headerCardStyle = getCardStyleProperties(cardStyle);
  const {
    border: _b,
    borderColor: _bc,
    borderWidth: _bw,
    borderStyle: _bs,
    borderRadius: _br,
    background: _hb,
    backgroundColor: _hbc,
    backgroundImage: _hbi,
    boxShadow: _hbs,
    backdropFilter: _hbf,
    WebkitBackdropFilter: _hwbf,
    ...cleanHeaderStyle
  } = headerCardStyle as any;
  const glassBorderVal = '1px solid rgba(255, 255, 255, 0.1)';

  // Tự động đóng menu phụ & cuộn tới nút trang đang được chọn nếu bị khuất
  useEffect(() => {
    setIsRadialMenuOpen(false);
    setHoveredNavIndex(null);
    if (navRef.current) {
      const activeEl = navRef.current.querySelector(`#nav-item-${currentPage}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    }
  }, [currentPage]);

  const exposedWidth = isSmallScreen ? 44 : 46;
  const overlapPx = uniformPillWidth
    ? Math.max(0, uniformPillWidth - exposedWidth)
    : isSmallScreen
      ? 96
      : 104;

  const headerElement = (
    <header
      ref={headerRef}
      id="app-header"
      data-element-name="Thanh điều hướng Header chính"
      data-element-type="card"
      data-element-page="global"
      data-element-parent="website-root"
      onMouseLeave={handleHeaderMouseLeave}
      style={{
        ...cleanHeaderStyle,
        maxWidth: '1250px',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderTop: 'none',
        borderBottom: glassBorderVal,
        borderLeft: glassBorderVal,
        borderRight: glassBorderVal,
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '14px',
        borderBottomRightRadius: '14px',
        zIndex: isRadialMenuOpen ? 99999 : 40,
      }}
      className={`neonav-bar w-full max-w-[1250px] mx-auto min-h-[72px] h-auto py-1.5 flex items-center justify-between px-2 sm:px-3 ${
        isRadialMenuOpen ? 'z-[99999]' : 'z-40'
      } relative flex-shrink-0 rounded-t-none rounded-b-[14px] backdrop-blur-md border-white/10 group/header overflow-visible pointer-events-auto`}
    >
      {/* Khu vực Menu chính: Các nút định dạng xếp chồng với hiệu ứng lan màu khi chọn */}
      <nav
        ref={navRef}
        id="header-center"
        className="flex-1 min-w-0 h-full flex items-center justify-start lg:justify-center overflow-x-auto overflow-y-visible horizontal-scroll-smooth z-10 px-1 py-1 mx-auto cursor-grab active:cursor-grabbing bg-transparent relative flex-nowrap"
        style={{ background: 'transparent' }}
      >
        {headerPages.map((page: any, index: number) => {
          const styleCfg = PAGE_FOOTER_STYLE_MAP[page.id] || PAGE_FOOTER_STYLE_MAP[0];
          const isSelected = page.id === currentPage;
          const isHovered = hoveredNavIndex === index;
          const isAfterHovered = hoveredNavIndex !== null && index > hoveredNavIndex;
          const baseZIndex = isHovered ? 150 : index + 10;

          const pageTitle =
            language === 'en' && page.shortTitleEn
              ? page.shortTitleEn
              : page.shortTitle || page.name;
          const pageSub = language === 'en' ? styleCfg.subEn : styleCfg.subVi;

          return (
            <div
              key={page.id}
              onMouseEnter={() => handleItemMouseEnter(index, page.id)}
              className="relative pointer-events-auto shrink-0 transition-all duration-300 ease-out"
              style={{
                marginLeft: index === 0 ? '0px' : `-${overlapPx}px`,
                transform: isAfterHovered ? `translateX(${overlapPx}px)` : 'translateX(0px)',
                zIndex: baseZIndex,
              }}
            >
              <div
                ref={(el) => {
                  pillWrapperRefs.current[index] = el;
                }}
                className={`nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-300 hover:scale-[1.05] w-max h-auto p-[1.5px] overflow-hidden ${
                  isSelected ? '' : 'shadow-[0_4px_14px_rgba(0,0,0,0.1)]'
                }`}
                style={{
                  width: uniformPillWidth ? `${uniformPillWidth}px` : undefined,
                  boxShadow: isSelected ? `0 4px 16px ${styleCfg.glowColor}` : 'none',
                }}
              >
                {/* HIỆU ỨNG LINE PHÁT SÁNG XOAY QUANH KHI ĐƯỢC CHỌN */}
                {isSelected && (
                  <div
                    className="nav-pill-laser absolute -inset-[250%] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none z-0"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0 210deg, #ffffff 270deg, ${styleCfg.laserColor || styleCfg.accentColor} 300deg, transparent 360deg)`,
                    }}
                  />
                )}

                {/* Main Inner Button - chiều ngang tự động theo nội dung lớn nhất & đồng bộ tất cả nút, padding top/bottom 2px, left/right 10px */}
                <button
                  ref={(el) => {
                    pillBtnRefs.current[index] = el;
                  }}
                  id={`nav-item-${page.id}`}
                  type="button"
                  onClick={() => {
                    SoundEngine.playPageSpecificSound(page.id);
                    onSelectPage(page.id);
                  }}
                  title={`${pageTitle} · ${pageSub}`}
                  className={`nav-pill relative z-10 inline-flex items-center w-full h-auto rounded-[999px] gap-1.5 cursor-pointer transition-all duration-300 border-2 ${
                    isSelected
                      ? `bg-gradient-to-r ${styleCfg.gradient} border-white/80 active shadow-[0_0_25px_${styleCfg.glowColor}]`
                      : `${styleCfg.accentBorder}`
                  }`}
                  style={{
                    paddingTop: '2px',
                    paddingRight: '10px',
                    paddingBottom: '2px',
                    paddingLeft: '10px',
                    ...(isSelected
                      ? {
                          boxShadow: `0 0 30px ${styleCfg.glowColor}, inset 0 0 12px rgba(255,255,255,0.4)`,
                        }
                      : {}),
                  }}
                >
                  {/* Round Circle Badge with Icon or Avatar */}
                  <div
                    className="nav-pill-icon-badge w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/40 transition-all duration-300 shadow-xs"
                    style={{
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : styleCfg.accentColor,
                    }}
                  >
                    {styleCfg.avatarGif ? (
                      <img
                        src={styleCfg.avatarGif}
                        alt={pageTitle}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <WebIcon
                        name={page.icon || 'home'}
                        className="nav-pill-icon-svg w-4 h-4 text-center block stroke-[2] shrink-0"
                        style={{
                          color: '#ffffff',
                        }}
                      />
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div
                    className={`nav-pill-divider w-[1.5px] h-4 shrink-0 mx-0.5 rounded-[999px] transition-colors duration-300 ${
                      isSelected
                        ? 'bg-white/50'
                        : 'bg-[var(--divider-nav-pill)]'
                    }`}
                  />

                  <div className="flex flex-col text-left leading-none shrink-0">
                    <span
                      className={`nav-pill-title typo-nav leading-tight font-play tracking-tight whitespace-nowrap transition-colors duration-300 ${
                        isSelected ? 'text-white' : styleCfg.mainTextColor
                      }`}
                    >
                      {pageTitle}
                    </span>
                    <span
                      className={`nav-pill-sub typo-label leading-none mt-0.5 whitespace-nowrap font-play transition-colors duration-300 ${
                        isSelected ? 'text-white/90' : styleCfg.subTextColor
                      }`}
                    >
                      {pageSub}
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
          const isHovered = hoveredNavIndex === avatarNavIndex;
          const isAfterHovered = hoveredNavIndex !== null && avatarNavIndex > hoveredNavIndex;
          const baseZIndex = isRadialMenuOpen ? 99999 : isHovered ? 150 : avatarNavIndex + 10;

          return (
            <div
              key="header-hungthai-avatar-pill"
              ref={avatarPillRef}
              onMouseEnter={() => {
                setHoveredNavIndex(avatarNavIndex);
                SoundEngine.playGlassChime();
              }}
              className="relative pointer-events-auto shrink-0 transition-transform duration-300 ease-out"
              style={{
                marginLeft: headerPages.length === 0 ? '0px' : `-${overlapPx}px`,
                transform: isAfterHovered ? `translateX(${overlapPx}px)` : 'translateX(0px)',
                zIndex: baseZIndex,
              }}
            >
              <div
                ref={(el) => {
                  pillWrapperRefs.current[avatarNavIndex] = el;
                }}
                className={`nav-pill-wrapper relative inline-flex items-center justify-between rounded-[999px] select-none group/hungthai transition-all duration-300 hover:scale-[1.05] w-max h-auto overflow-hidden p-[1.5px] ${
                  isRadialMenuOpen || currentPage === 12 ? 'shadow-none' : 'shadow-[0_4px_16px_rgba(79,70,229,0.22)]'
                }`}
                style={{
                  width: uniformPillWidth ? `${uniformPillWidth}px` : undefined,
                }}
              >
                {/* HIỆU ỨNG LINE PHÁT SÁNG XOAY QUANH KHI MỞ MENU HOẶC ĐANG CHỌN TRANG ĐẶT LỊCH */}
                {(isRadialMenuOpen || currentPage === 12) && (
                  <div
                    className="nav-pill-laser absolute -inset-[200%] animate-[spin_3s_linear_infinite] opacity-100 pointer-events-none z-0"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0 240deg, #ffffff 300deg, #6366f1 330deg, transparent 360deg)`,
                    }}
                  />
                )}
                <button
                  ref={(el) => {
                    pillBtnRefs.current[avatarNavIndex] = el;
                  }}
                  id="header-btn-hungthai-avatar"
                  type="button"
                  onClick={toggleRadialMenu}
                  title={
                    language === 'en'
                      ? 'Expert Nguyen Hung Thai · Booking & CS'
                      : 'Chuyên gia Nguyễn Hùng Thái · Đặt lịch & CSKH'
                  }
                  aria-expanded={isRadialMenuOpen}
                  className={`nav-pill relative z-10 inline-flex items-center w-full h-auto rounded-[999px] ${
                    currentPage === 12
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-100 active'
                      : 'text-[var(--text-primary)]'
                  } gap-1.5 shadow-sm cursor-pointer border-2 border-indigo-400/80 dark:border-indigo-500/80 transition-colors`}
                  style={{
                    paddingTop: '2px',
                    paddingRight: '10px',
                    paddingBottom: '2px',
                    paddingLeft: '10px',
                  }}
                >
                  <div className="nav-pill-icon-badge w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs bg-indigo-500 text-white leading-none p-0 overflow-hidden ring-1 ring-indigo-300">
                    <img
                      src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.gif"
                      alt="Hùng Thái"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="nav-pill-divider w-[1.5px] h-4 bg-indigo-300/80 dark:bg-indigo-400/40 shrink-0 mx-0.5 rounded-[999px]"></div>
                  <div className="flex flex-col text-left leading-none shrink-0">
                    <span className="nav-pill-title typo-nav leading-tight font-play text-indigo-950 dark:text-indigo-100 whitespace-nowrap">
                      {language === 'en' ? 'Hung Thai' : 'Hùng Thái'}
                    </span>
                    <span className="nav-pill-sub typo-label leading-none mt-0.5 text-indigo-700 dark:text-indigo-400 font-play whitespace-nowrap">
                      {currentPage === 12
                        ? language === 'en'
                          ? 'Booking'
                          : 'Đặt lịch'
                        : language === 'en'
                        ? 'CS Ops'
                        : 'CSKH'}
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
                align="right"
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
