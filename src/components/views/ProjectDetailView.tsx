'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProjectData } from '@/types';
import { WebIcon } from '@/components/ui/WebIcon';
import {
  getProjectDetailedSpec,
  ProjectSpec,
  SCOPE_PALETTES,
  CHALLENGE_PALETTES,
} from '@/utils/projectSpecGenerator';

interface ProjectCardGroup {
  id: string;
  code: string;
  filterKey: string;
  badgeText: string;
  fourWordTitle: string;
  pillText: string;
  desc: string;
  visualId: string;
  illustrationSrc: string;
  iconName: string;
  projects: ProjectData[];
}

export interface ProjectDetailViewProps {
  selectedArticle: ProjectData;
  selectedGroup: ProjectCardGroup | null;
  onSelectProject: (proj: ProjectData) => void;
  onClose: () => void;
  onOpenMindmap: (proj: ProjectData) => void;
  getCardVisualConfig: (visualId: string) => {
    accentColor: string;
    cardBg: string;
    cardBorder: string;
    ambientGlow: string;
    titleColor: string;
    pillBg: string;
    arrowBg: string;
    arrowShadow: string;
  };
  isLight?: boolean;
  activeSection?: string;
  onSectionChange?: (secId: string) => void;
}

const STACK_CARD_GRADIENTS = [
  'linear-gradient(150deg, #6366F1 0%, #8B5CF6 100%)', // 0: Indigo-Violet (Mindmap)
  'linear-gradient(150deg, #1E40AF 0%, #0284C7 100%)', // 1: Blue-Sky (Overview)
  'linear-gradient(150deg, #C2410C 0%, #EA580C 100%)', // 2: Deep Orange-Amber (Context & Challenges)
  'linear-gradient(150deg, #0F766E 0%, #0D9488 100%)', // 3: Teal-Emerald (Objectives)
  'linear-gradient(150deg, #7C3AED 0%, #9333EA 100%)', // 4: Purple-Fuchsia (Scope 7 Items)
  'linear-gradient(150deg, #0369A1 0%, #0284C7 100%)', // 5: Sky-Cyan (Methodology & 5 Steps)
  'linear-gradient(150deg, #047857 0%, #059669 100%)', // 6: Emerald-Green (KPI & SLA)
  'linear-gradient(150deg, #BE185D 0%, #DB2777 100%)', // 7: Rose-Pink (Roles & Value Outcomes)
  'linear-gradient(150deg, #581C87 0%, #6D28D9 100%)', // 8: Deep Violet-Indigo (Philosophy)
];

const STACK_CARD_GRADIENTS_LIGHT = [
  'linear-gradient(150deg, #F5F3FF 0%, #EDE9FE 40%, #DDD6FE 100%)', // 0: Indigo-Violet Pastel (Mindmap)
  'linear-gradient(150deg, #EFF6FF 0%, #DBEAFE 40%, #BFDBFE 100%)', // 1: Blue-Sky Pastel (Overview)
  'linear-gradient(150deg, #FFF7ED 0%, #FFEDD5 40%, #FED7AA 100%)', // 2: Deep Orange-Amber Pastel (Context)
  'linear-gradient(150deg, #F0FDFA 0%, #CCFBF1 40%, #99F6E4 100%)', // 3: Teal-Emerald Pastel (Objectives)
  'linear-gradient(150deg, #FAF5FF 0%, #F3E8FF 40%, #E9D5FF 100%)', // 4: Purple-Fuchsia Pastel (Scope 7 Items)
  'linear-gradient(150deg, #F0F9FF 0%, #E0F2FE 40%, #BAE6FD 100%)', // 5: Sky-Cyan Pastel (Methodology)
  'linear-gradient(150deg, #ECFDF5 0%, #D1FAE5 40%, #A7F3D0 100%)', // 6: Emerald-Green Pastel (KPI & SLA)
  'linear-gradient(150deg, #FDF2F8 0%, #FCE7F3 40%, #FBCFE8 100%)', // 7: Rose-Pink Pastel (Roles & Value)
  'linear-gradient(150deg, #FAF5FF 0%, #EDE9FE 40%, #DDD6FE 100%)', // 8: Deep Violet-Indigo Pastel (Philosophy)
];

const STAR_CARD_GRADIENTS = [
  'linear-gradient(150deg, #C2410C 0%, #EA580C 100%)', // S: Situation
  'linear-gradient(150deg, #1E40AF 0%, #0284C7 100%)', // T/A: Approach
  'linear-gradient(150deg, #7C3AED 0%, #9333EA 100%)', // A: Actions
  'linear-gradient(150deg, #047857 0%, #059669 100%)', // R: Results
];

const STAR_CARD_GRADIENTS_LIGHT = [
  'linear-gradient(150deg, #FFF7ED 0%, #FFEDD5 40%, #FED7AA 100%)', // S: Situation
  'linear-gradient(150deg, #EFF6FF 0%, #DBEAFE 40%, #BFDBFE 100%)', // T/A: Approach
  'linear-gradient(150deg, #FAF5FF 0%, #F3E8FF 40%, #E9D5FF 100%)', // A: Actions
  'linear-gradient(150deg, #ECFDF5 0%, #D1FAE5 40%, #A7F3D0 100%)', // R: Results
];

interface GroupThemeVisual {
  accent: string;
  bannerBgLight: string;
  bannerBorderLight: string;
  bannerShadowLight: string;
  badgeGrad: string;
  groupBadgeLight: string;
  groupBadgeDark: string;
  subTitleLight: string;
  subTitleDark: string;
  taglineBorderLight: string;
  taglineBorderDark: string;
  roleLabelLight: string;
  roleIconLight: string;
  hashtagLight: string;
  hashtagDark: string;
  hubBorderLight: string;
  hubBorderDark: string;
  hubGrad: string;
  dividerLight: string;
  dividerDark: string;
  dotColor: string;
  activeBtnGrad: string;
}

const getProjectGroupTheme = (groupKey: string): GroupThemeVisual => {
  switch (groupKey) {
    case 'strategy':
      return {
        accent: '#0284c7',
        bannerBgLight: 'bg-gradient-to-br from-white via-sky-50/85 to-indigo-50/75',
        bannerBorderLight: 'border-sky-200/90',
        bannerShadowLight: 'shadow-[0_14px_40px_-10px_rgba(2,132,199,0.12)]',
        badgeGrad: 'from-sky-600 to-indigo-600',
        groupBadgeLight: 'bg-sky-100 text-sky-800 border-sky-300',
        groupBadgeDark: 'bg-sky-950/80 text-sky-200 border-sky-600/50',
        subTitleLight: 'text-sky-700',
        subTitleDark: 'text-sky-300',
        taglineBorderLight: 'border-l-sky-500',
        taglineBorderDark: 'border-l-cyan-400',
        roleLabelLight: 'text-sky-700',
        roleIconLight: 'text-sky-600',
        hashtagLight: 'bg-sky-50 text-sky-800 border-sky-200/90',
        hashtagDark: 'bg-white/10 text-cyan-200 border-cyan-400/20',
        hubBorderLight: 'border-sky-300/90',
        hubBorderDark: 'border-sky-500/40',
        hubGrad: 'from-sky-600 via-indigo-600 to-blue-600',
        dividerLight: 'via-sky-300',
        dividerDark: 'via-sky-600/50',
        dotColor: 'bg-sky-500',
        activeBtnGrad: 'from-sky-600 to-indigo-600',
      };
    case 'sop':
      return {
        accent: '#059669',
        bannerBgLight: 'bg-gradient-to-br from-white via-emerald-50/85 to-teal-50/75',
        bannerBorderLight: 'border-emerald-200/90',
        bannerShadowLight: 'shadow-[0_14px_40px_-10px_rgba(5,150,105,0.12)]',
        badgeGrad: 'from-emerald-600 to-teal-600',
        groupBadgeLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        groupBadgeDark: 'bg-emerald-950/80 text-emerald-200 border-emerald-600/50',
        subTitleLight: 'text-emerald-700',
        subTitleDark: 'text-emerald-300',
        taglineBorderLight: 'border-l-emerald-500',
        taglineBorderDark: 'border-l-emerald-400',
        roleLabelLight: 'text-emerald-700',
        roleIconLight: 'text-emerald-600',
        hashtagLight: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
        hashtagDark: 'bg-white/10 text-emerald-200 border-emerald-400/20',
        hubBorderLight: 'border-emerald-300/90',
        hubBorderDark: 'border-emerald-500/40',
        hubGrad: 'from-emerald-600 via-teal-600 to-cyan-600',
        dividerLight: 'via-emerald-300',
        dividerDark: 'via-emerald-600/50',
        dotColor: 'bg-emerald-500',
        activeBtnGrad: 'from-emerald-600 to-teal-600',
      };
    case 'cx':
      return {
        accent: '#ea580c',
        bannerBgLight: 'bg-gradient-to-br from-white via-amber-50/85 to-orange-50/75',
        bannerBorderLight: 'border-amber-200/90',
        bannerShadowLight: 'shadow-[0_14px_40px_-10px_rgba(234,88,12,0.12)]',
        badgeGrad: 'from-amber-600 to-orange-600',
        groupBadgeLight: 'bg-amber-100 text-amber-800 border-amber-300',
        groupBadgeDark: 'bg-amber-950/80 text-amber-200 border-amber-600/50',
        subTitleLight: 'text-amber-700',
        subTitleDark: 'text-amber-300',
        taglineBorderLight: 'border-l-amber-500',
        taglineBorderDark: 'border-l-amber-400',
        roleLabelLight: 'text-amber-700',
        roleIconLight: 'text-amber-600',
        hashtagLight: 'bg-amber-50 text-amber-800 border-amber-200/90',
        hashtagDark: 'bg-white/10 text-amber-200 border-amber-400/20',
        hubBorderLight: 'border-amber-300/90',
        hubBorderDark: 'border-amber-500/40',
        hubGrad: 'from-amber-600 via-orange-600 to-rose-600',
        dividerLight: 'via-amber-300',
        dividerDark: 'via-amber-600/50',
        dotColor: 'bg-amber-500',
        activeBtnGrad: 'from-amber-600 to-orange-600',
      };
    case 'tech':
      return {
        accent: '#7c3aed',
        bannerBgLight: 'bg-gradient-to-br from-white via-purple-50/85 to-indigo-50/75',
        bannerBorderLight: 'border-purple-200/90',
        bannerShadowLight: 'shadow-[0_14px_40px_-10px_rgba(124,58,237,0.12)]',
        badgeGrad: 'from-purple-600 to-indigo-600',
        groupBadgeLight: 'bg-purple-100 text-purple-800 border-purple-300',
        groupBadgeDark: 'bg-purple-950/80 text-purple-200 border-purple-600/50',
        subTitleLight: 'text-purple-700',
        subTitleDark: 'text-purple-300',
        taglineBorderLight: 'border-l-purple-500',
        taglineBorderDark: 'border-l-purple-400',
        roleLabelLight: 'text-purple-700',
        roleIconLight: 'text-purple-600',
        hashtagLight: 'bg-purple-50 text-purple-800 border-purple-200/90',
        hashtagDark: 'bg-white/10 text-purple-200 border-purple-400/20',
        hubBorderLight: 'border-purple-300/90',
        hubBorderDark: 'border-purple-500/40',
        hubGrad: 'from-purple-600 via-indigo-600 to-fuchsia-600',
        dividerLight: 'via-purple-300',
        dividerDark: 'via-purple-600/50',
        dotColor: 'bg-purple-500',
        activeBtnGrad: 'from-purple-600 to-indigo-600',
      };
    case 'learning':
    default:
      return {
        accent: '#0d9488',
        bannerBgLight: 'bg-gradient-to-br from-white via-teal-50/85 to-emerald-50/75',
        bannerBorderLight: 'border-teal-200/90',
        bannerShadowLight: 'shadow-[0_14px_40px_-10px_rgba(13,148,136,0.12)]',
        badgeGrad: 'from-teal-600 to-emerald-600',
        groupBadgeLight: 'bg-teal-100 text-teal-800 border-teal-300',
        groupBadgeDark: 'bg-teal-950/80 text-teal-200 border-teal-600/50',
        subTitleLight: 'text-teal-700',
        subTitleDark: 'text-teal-300',
        taglineBorderLight: 'border-l-teal-500',
        taglineBorderDark: 'border-l-teal-400',
        roleLabelLight: 'text-teal-700',
        roleIconLight: 'text-teal-600',
        hashtagLight: 'bg-teal-50 text-teal-800 border-teal-200/90',
        hashtagDark: 'bg-white/10 text-teal-200 border-teal-400/20',
        hubBorderLight: 'border-teal-300/90',
        hubBorderDark: 'border-teal-500/40',
        hubGrad: 'from-teal-600 via-emerald-600 to-cyan-600',
        dividerLight: 'via-teal-300',
        dividerDark: 'via-teal-600/50',
        dotColor: 'bg-teal-500',
        activeBtnGrad: 'from-teal-600 to-emerald-600',
      };
  }
};

const SECTION_COLORS: Record<string, { light: string; dark: string; grad: string }> = {
  fuchsia: { light: '#c026d3', dark: '#f0abfc', grad: 'from-fuchsia-600 to-purple-600' },
  blue: { light: '#2563eb', dark: '#93c5fd', grad: 'from-blue-600 to-indigo-600' },
  amber: { light: '#d97706', dark: '#fcd34d', grad: 'from-amber-600 to-orange-600' },
  indigo: { light: '#4f46e5', dark: '#a5b4fc', grad: 'from-indigo-600 to-purple-600' },
  purple: { light: '#9333ea', dark: '#d8b4fe', grad: 'from-purple-600 to-pink-600' },
  cyan: { light: '#0891b2', dark: '#67e8f9', grad: 'from-cyan-600 to-blue-600' },
  emerald: { light: '#059669', dark: '#6ee7b7', grad: 'from-emerald-600 to-teal-600' },
  rose: { light: '#e11d48', dark: '#fda4af', grad: 'from-rose-600 to-pink-600' },
  teal: { light: '#0d9488', dark: '#5eead4', grad: 'from-teal-600 to-emerald-600' },
  violet: { light: '#7c3aed', dark: '#c4b5fd', grad: 'from-violet-600 to-purple-600' },
};

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  selectedArticle,
  selectedGroup,
  onSelectProject,
  onClose,
  onOpenMindmap,
  getCardVisualConfig,
  isLight = true,
  activeSection = 'sec-mindmap',
  onSectionChange,
}) => {
  const [isLightMode, setIsLightMode] = useState<boolean>(true); // Safe default for SSR
  const [activeTab, setActiveTab] = useState<string>('all');
  const [mindmapMode, setMindmapMode] = useState<'interactive' | 'image'>('interactive');
  const spec = useMemo(() => getProjectDetailedSpec(selectedArticle), [selectedArticle]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bannerSidebarRef = useRef<HTMLElement>(null);
  const [bannerHeight, setBannerHeight] = useState<number | null>(null);
  const [isDesktopMd, setIsDesktopMd] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const el = bannerSidebarRef.current;
    if (!el) return;
    const updateHeight = () => {
      const desktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
      setIsDesktopMd(desktop);
      if (!desktop) {
        setBannerHeight(null);
        return;
      }
      const h = el.offsetHeight || Math.round(el.getBoundingClientRect().height);
      if (h > 100) {
        setBannerHeight((prev) => (prev === h ? prev : h));
      }
    };
    updateHeight();
    const rafId = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(updateHeight) : 0;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateHeight);
      ro.observe(el);
    }
    window.addEventListener('resize', updateHeight);
    return () => {
      if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [selectedArticle, spec]);

  // Bảng màu nhận diện chuyên sâu theo nhóm dự án (Áp dụng cho toàn bộ 21 dự án)
  const gt = getProjectGroupTheme(selectedArticle.groupKey);
  const isStrategy = selectedArticle.groupKey === 'strategy';

  useEffect(() => {
    const checkTheme = () => {
      const isDarkClass = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      const themeAttr = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
      if (typeof isLight === 'boolean') {
        setIsLightMode(isLight && !isDarkClass && themeAttr !== 'dark-neon');
      } else {
        setIsLightMode(!isDarkClass && themeAttr !== 'dark-neon');
      }
    };

    checkTheme();

    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });
      return () => observer.disconnect();
    }
  }, [isLight]);

  const getStackGradient = (idx: number) =>
    isLightMode ? STACK_CARD_GRADIENTS_LIGHT[idx] : STACK_CARD_GRADIENTS[idx];

  const getStarGradient = (idx: number) =>
    isLightMode ? STAR_CARD_GRADIENTS_LIGHT[idx] : STAR_CARD_GRADIENTS[idx];

  const getCardAccentColor = (key: keyof typeof SECTION_COLORS) => {
    const entry = SECTION_COLORS[key] || SECTION_COLORS.blue;
    return isLightMode ? entry.light : entry.dark;
  };

  const getSyncedCardStyle = (gradientIdx: number): React.CSSProperties => ({
    background: getStackGradient(gradientIdx),
    ...(isDesktopMd && bannerHeight
      ? {
          height: `${bannerHeight}px`,
          minHeight: `${bannerHeight}px`,
          maxHeight: `${bannerHeight}px`,
        }
      : {
          height: 'auto',
          minHeight: '0px',
        }),
    padding: '15px',
  });

  useEffect(() => {
    const sc = scrollContainerRef.current;
    if (!sc) return;

    const onScroll = () => {
      const cards = Array.from(sc.querySelectorAll<HTMLElement>('[data-section-card="true"]'));
      if (!cards.length) return;
      const top = sc.getBoundingClientRect().top;

      // Cập nhật mục lục đang xem (active section) theo vị trí cuộn tự nhiên (không chuyển động/co giãn thẻ)
      if (onSectionChange) {
        for (let i = cards.length - 1; i >= 0; i--) {
          const cardTop = cards[i].getBoundingClientRect().top;
          if (cardTop <= top + 180 && cards[i].id) {
            onSectionChange(cards[i].id);
            break;
          }
        }
      }
    };

    sc.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      sc.removeEventListener('scroll', onScroll);
    };
  }, [selectedArticle, spec, onSectionChange]);



  const scrollToSection = (id: string) => {
    onSectionChange?.(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentProjectIdx = selectedGroup?.projects.findIndex((p) => p.id === selectedArticle.id) ?? -1;
  const nextProject =
    selectedGroup && currentProjectIdx >= 0 && currentProjectIdx < selectedGroup.projects.length - 1
      ? selectedGroup.projects[currentProjectIdx + 1]
      : null;
  const prevProject =
    selectedGroup && currentProjectIdx > 0 ? selectedGroup.projects[currentProjectIdx - 1] : null;

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col gap-[15px] relative overflow-hidden text-left font-play">
      {/* 2 CỘT CHÍNH: CHI TIẾT BÀI VIẾT (TRÁI) VÀ MỤC LỤC ĐIỀU HƯỚNG (PHẢI) */}
      <div className="w-full flex-1 min-h-0 flex flex-col md:flex-row gap-[15px] items-stretch relative overflow-y-auto md:overflow-hidden glass-scrollbar">
        {/* 1. KHỐI NỘI DUNG CHI TIẾT BÀI VIẾT DỰ ÁN (BÊN TRÁI) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-w-0 min-h-0 md:h-full overflow-visible md:overflow-y-auto glass-scrollbar md:pr-1.5 pb-6 md:pb-28 flex flex-col gap-[15px] text-left"
        >
          {spec && (
            <>

          {/* STANDALONE PROJECT HEADER CARD (Đưa ra ngoài thẻ Sơ đồ tư duy) */}
          <div
            id="projects-info-card"
            data-section-card="true"
            className={`relative p-4 rounded-[14px] bg-white/95 dark:bg-slate-800/95 border-2 ${
              isStrategy
                ? 'border-sky-300/90 dark:border-sky-500/40 shadow-[0_4px_20px_-2px_rgba(2,132,199,0.12)]'
                : 'border-fuchsia-300/80 dark:border-fuchsia-500/40 shadow-md'
            } flex flex-col items-start justify-between gap-2.5 overflow-hidden shrink-0`}
          >
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${
              isStrategy
                ? 'bg-gradient-to-br from-sky-400/20 via-indigo-400/20 to-transparent'
                : 'bg-gradient-to-br from-fuchsia-400/20 via-purple-400/20 to-transparent'
            } blur-xl pointer-events-none`} />

            <div className="w-full min-w-0 relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-[14px] font-mono typo-badge font-black border ${
                  isStrategy
                    ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-600/50'
                    : 'bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-600/50'
                }`}>
                  {selectedArticle.code}
                </span>
                <span className={`px-2 py-0.5 rounded-[14px] typo-badge font-bold border ${
                  isStrategy
                    ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-600/50'
                    : 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600/50'
                }`}>
                  {selectedArticle.groupTitle}
                </span>
                <span className="typo-label font-bold text-slate-500 dark:text-slate-400">
                  Vai trò: <strong className={isStrategy ? 'text-sky-700 dark:text-sky-300' : 'text-purple-700 dark:text-purple-300'}>{selectedArticle.role}</strong>
                </span>
              </div>

              <h4 className="typo-h3 font-black text-slate-900 dark:text-white mt-1.5 leading-snug flex items-start sm:items-center gap-2">
                <WebIcon
                  name="brain"
                  className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 bg-transparent border-0 p-0 shadow-none ${
                    isStrategy ? 'text-sky-600 dark:text-sky-400' : 'text-fuchsia-600 dark:text-fuchsia-400'
                  }`}
                />
                <span className="min-w-0 break-words">{selectedArticle.title}</span>
              </h4>

              <p className="typo-body-sm text-slate-600 dark:text-slate-300 mt-1 italic">
                &ldquo;{selectedArticle.quote || spec.tagline}&rdquo;
              </p>

              {/* Tech stack / keywords chips chuyển xuống dưới mô tả */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                {selectedArticle.hashtags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-0.5 rounded-full typo-badge font-mono font-semibold border ${
                      isLightMode
                        ? isStrategy
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-slate-700/80 text-slate-200 border-slate-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 00: SƠ ĐỒ TƯ DUY KIẾN TRÚC DỰ ÁN (KÍCH THƯỚC CHIỀU CAO LUÔN BẰNG CHIỀU CAO BANNER CHI TIẾT DỰ ÁN) */}
          <section
            id="sec-mindmap"
            data-section-card="true"
            style={getSyncedCardStyle(0)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_14px_36px_rgba(99,102,241,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            {/* Header Card Sơ Đồ Tư Duy */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('fuchsia') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('fuchsia') }}>
                  1.
                </span>
                <WebIcon
                  name="brain"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('fuchsia') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('fuchsia') }}
                >
                  Sơ đồ tư duy
                </h3>
              </div>
            </div>

            {/* Mind Map Canvas Body (Cuộn mượt mà bên trong, giữ nguyên chiều cao chuẩn) */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-4">
            {mindmapMode === 'interactive' ? (
              <div className="space-y-4">
                {/* Connecting Visual Divider */}
                <div className="hidden lg:flex items-center justify-center gap-4 typo-label font-mono font-bold text-slate-400 dark:text-slate-500">
                  <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${
                    isStrategy ? 'via-sky-300 dark:via-sky-600/50' : 'via-fuchsia-300 dark:via-fuchsia-600/50'
                  } to-transparent`} />
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border ${
                    isStrategy ? 'border-sky-200 dark:border-sky-700' : 'border-fuchsia-200 dark:border-fuchsia-700'
                  } shadow-2xs`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isStrategy ? 'bg-sky-500' : 'bg-fuchsia-500'
                    } animate-ping`} />
                    4 Nhánh Triển Khai Chiến Lược & Vận Hành Cốt Lõi
                  </span>
                  <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${
                    isStrategy ? 'via-sky-300 dark:via-sky-600/50' : 'via-fuchsia-300 dark:via-fuchsia-600/50'
                  } to-transparent`} />
                </div>

                {/* 4 Radiating Branches (2x2 Grid, Equal Height) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
                  {/* Branch 1: Bối cảnh & Thách thức (Rose/Pink Tint) */}
                  <div id="projects-tech-card" className="h-full p-4 rounded-[14px] bg-gradient-to-br from-rose-50/95 via-rose-50/60 to-white/95 dark:from-rose-950/40 dark:via-slate-800/90 dark:to-slate-800/90 border-2 border-rose-200 dark:border-rose-500/40 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-rose-400 dark:hover:border-rose-400 transition-all duration-300">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-200/80 dark:border-rose-900/40">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <WebIcon name="alert" className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          <h5 className="typo-h5 font-black text-rose-600 dark:text-rose-400 tracking-wide font-play">
                            Bối Cảnh Vận Hành
                          </h5>
                        </div>
                      </div>

                      <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {spec.context.intro}
                      </p>

                      <div className="space-y-1.5 pt-1 border-l-2 border-dashed border-rose-300 dark:border-rose-600/60 pl-2.5">
                        {spec.context.challenges.slice(0, 3).map((ch, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 typo-label text-slate-600 dark:text-slate-300">
                            <WebIcon name="alert" className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{ch}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToSection('sec-context')}
                      className="mt-3 pt-2 border-t border-rose-200/70 dark:border-rose-900/40 typo-label font-bold text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100 flex items-center justify-between cursor-pointer transition"
                    >
                      <span>Xem bối cảnh & các điểm nghẽn chi tiết</span>
                      <span>↓</span>
                    </button>
                  </div>

                  {/* Branch 2: Mục tiêu & Chiến lược (Amber/Orange Tint) */}
                  <div className="h-full p-4 rounded-[14px] bg-gradient-to-br from-amber-50/95 via-amber-50/60 to-white/95 dark:from-amber-950/40 dark:via-slate-800/90 dark:to-slate-800/90 border-2 border-amber-200 dark:border-amber-500/40 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200/80 dark:border-amber-900/40">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <WebIcon name="target" className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <h5 className="typo-h5 font-black text-amber-600 dark:text-amber-400 tracking-wide font-play">
                            Mục Tiêu Kỳ Vọng
                          </h5>
                        </div>
                      </div>

                      <div className="space-y-1.5 border-l-2 border-dashed border-amber-300 dark:border-amber-600/60 pl-2.5">
                        {spec.objectives.slice(0, 3).map((obj, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex items-center gap-1.5 typo-caption font-bold text-amber-900 dark:text-amber-200">
                              <WebIcon name="target" className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{obj.title}</span>
                            </div>
                            {obj.items[0] && (
                              <p className="typo-label text-slate-600 dark:text-slate-300 pl-5 leading-snug">
                                • {obj.items[0]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToSection('sec-objectives')}
                      className="mt-3 pt-2 border-t border-amber-200/70 dark:border-amber-900/40 typo-label font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 flex items-center justify-between cursor-pointer transition"
                    >
                      <span>Xem chi tiết 3 mục tiêu chiến lược</span>
                      <span>↓</span>
                    </button>
                  </div>

                  {/* Branch 3: Phương pháp & 4 Trụ cột SOP (Sky/Blue Tint) */}
                  <div className="h-full p-4 rounded-[14px] bg-gradient-to-br from-sky-50/95 via-sky-50/60 to-white/95 dark:from-sky-950/40 dark:via-slate-800/90 dark:to-slate-800/90 border-2 border-sky-200 dark:border-sky-500/40 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-sky-400 dark:hover:border-sky-400 transition-all duration-300">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-sky-200/80 dark:border-sky-900/40">
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                          <WebIcon name="workflow" className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                          <h5 className="typo-h5 font-black text-sky-600 dark:text-sky-400 tracking-wide font-play">
                            Trụ Cột Vận Hành
                          </h5>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="p-2 rounded-[14px] bg-sky-100/70 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-700/50">
                          <span className="typo-label font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                            <WebIcon name="users" className="w-3 h-3 text-sky-500" />
                            <span>Con người</span>
                          </span>
                          <p className="typo-label text-slate-600 dark:text-slate-300 mt-0.5">Đào tạo, KPI, kỹ năng</p>
                        </div>
                        <div className="p-2 rounded-[14px] bg-sky-100/70 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-700/50">
                          <span className="typo-label font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                            <WebIcon name="cog" className="w-3 h-3 text-sky-500" />
                            <span>Quy trình SOP</span>
                          </span>
                          <p className="typo-label text-slate-600 dark:text-slate-300 mt-0.5">SOP & Escalation</p>
                        </div>
                        <div className="p-2 rounded-[14px] bg-sky-100/70 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-700/50">
                          <span className="typo-label font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                            <WebIcon name="database" className="w-3 h-3 text-sky-500" />
                            <span>Công nghệ CRM</span>
                          </span>
                          <p className="typo-label text-slate-600 dark:text-slate-300 mt-0.5">Omnichannel & AI</p>
                        </div>
                        <div className="p-2 rounded-[14px] bg-sky-100/70 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-700/50">
                          <span className="typo-label font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                            <WebIcon name="chart" className="w-3 h-3 text-sky-500" />
                            <span>Dữ liệu Realtime</span>
                          </span>
                          <p className="typo-label text-slate-600 dark:text-slate-300 mt-0.5">360° Dashboard</p>
                        </div>
                      </div>

                      <div className="typo-label text-slate-600 dark:text-slate-300 pt-0.5">
                        <strong className="text-sky-700 dark:text-sky-300">Lộ trình:</strong>{' '}
                        {spec.methodology.phases.map((p: any) => p.title).slice(0, 3).join(' → ')}...
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToSection('sec-methodology')}
                      className="mt-3 pt-2 border-t border-sky-200/70 dark:border-sky-900/40 typo-label font-bold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 flex items-center justify-between cursor-pointer transition"
                    >
                      <span>Xem lộ trình vận hành & các hạng mục</span>
                      <span>↓</span>
                    </button>
                  </div>

                  {/* Branch 4: Kết quả & Giá trị kinh doanh (Emerald/Green Tint) */}
                  <div className="h-full p-4 rounded-[14px] bg-gradient-to-br from-emerald-50/95 via-emerald-50/60 to-white/95 dark:from-emerald-950/40 dark:via-slate-800/90 dark:to-slate-800/90 border-2 border-emerald-200 dark:border-emerald-500/40 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-300">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-200/80 dark:border-emerald-900/40">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <WebIcon name="award" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <h5 className="typo-h5 font-black text-emerald-600 dark:text-emerald-400 tracking-wide font-play">
                            Kết Quả Định Lượng
                          </h5>
                        </div>
                      </div>

                      <div className="space-y-1.5 border-l-2 border-dashed border-emerald-300 dark:border-emerald-600/60 pl-2.5">
                        {selectedArticle.star.results.map((res, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-1.5 typo-label text-slate-700 dark:text-slate-200 font-medium">
                            <WebIcon name="check" className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToSection('sec-metrics')}
                      className="mt-3 pt-2 border-t border-emerald-200/70 dark:border-emerald-900/40 typo-label font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 flex items-center justify-between cursor-pointer transition"
                    >
                      <span>Xem bảng chỉ số KPI, SLA & Giá trị</span>
                      <span>↓</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Image mode view */
              <div className="space-y-2">
                <div
                  className="w-full h-80 sm:h-96 md:h-[480px] rounded-[14px] overflow-hidden bg-slate-950 border border-fuchsia-300/60 dark:border-fuchsia-500/30 relative group cursor-pointer shadow-md"
                  onClick={() => onOpenMindmap(selectedArticle)}
                >
                  <img
                    src={selectedArticle.mindmap}
                    alt={`Sơ đồ tư duy ${selectedArticle.code}`}
                    className="w-full h-full object-contain bg-slate-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = selectedArticle.image;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="typo-caption font-bold text-white flex items-center gap-1.5">
                      <WebIcon name="maximize" className="w-4 h-4 text-fuchsia-300" />
                      <span>Nhấp để phóng to toàn màn hình</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white typo-badge font-mono">
                      {selectedArticle.code}
                    </span>
                  </div>
                </div>
                <p className="typo-label text-slate-500 dark:text-slate-400 text-center italic">
                  Bản vẽ kiến trúc hệ thống gốc của dự án {selectedArticle.code}. Bấm vào hình ảnh hoặc nút Phóng to để tương tác kích thước đầy đủ.
                </p>
              </div>
            )}
            </div>
          </section>

          {/* SECTION 01: TỔNG QUAN DỰ ÁN */}
          <section
            id="sec-overview"
            data-section-card="true"
            style={getSyncedCardStyle(1)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_14px_36px_rgba(2,132,199,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('blue') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('blue') }}>
                  2.
                </span>
                <WebIcon
                  name="layers"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('blue') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('blue') }}
                >
                  Tổng quan dự án
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              {/* Overview Content with High-Fidelity Contextual Visual Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-8 p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {spec.overview.map((para: string, idx: number) => (
                      <p key={idx} className="typo-body-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center gap-2 flex-wrap typo-label font-semibold text-slate-600 dark:text-slate-300">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                      <WebIcon name="target" className="w-3.5 h-3.5" />
                      <span>Trọng tâm cốt lõi:</span>
                    </span>
                    <span>Kết nối chặt chẽ 4 nguồn lực: Con người · Quy trình · Công nghệ · Dữ liệu</span>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-[14px] overflow-hidden border border-blue-200/80 dark:border-blue-500/30 bg-slate-950 relative group shadow-xs flex flex-col justify-between min-h-[160px]">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover opacity-90  transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex flex-col justify-end p-3.5">
                    <span className="typo-label font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      Mô hình vận hành CSKH chuẩn
                    </span>
                    <h5 className="typo-h5 font-bold text-white leading-tight mt-0.5">
                      Phòng Dịch Vụ Khách Hàng Hiện Đại
                    </h5>
                  </div>
                </div>
              </div>

              {/* 4 Trụ Cột Vận Hành Cốt Lõi (4 Core Operational Pillars) */}
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black typo-caption text-blue-600 dark:text-cyan-400">04</span>
                    <WebIcon name="layers" className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <h4 className="typo-h4 font-black text-slate-900 dark:text-white">
                      Trụ cột vận hành
                    </h4>
                  </div>
                  <span className="typo-label font-mono font-bold text-slate-500 dark:text-slate-400">
                    4 Core Pillars
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
                  {/* Trụ Cột 1: Sky Tint */}
                  <div className="h-full p-3.5 rounded-[14px] bg-gradient-to-br from-sky-50/90 to-sky-100/40 dark:from-sky-950/40 dark:to-slate-800/80 border border-sky-200/90 dark:border-sky-500/30 flex flex-col justify-between shadow-2xs hover:border-sky-400 transition">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-sky-200/70 dark:border-sky-900/40">
                        <span className="font-mono font-black typo-label text-sky-600 dark:text-sky-400">2.1</span>
                        <WebIcon name="users" className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                        <h5 className="typo-h5 font-black text-sky-600 dark:text-sky-400 tracking-wide">
                          Con người vận hành
                        </h5>
                      </div>
                      <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        Cơ cấu tổ chức rõ ràng, phân định trách nhiệm, đào tạo và phát triển đội ngũ chuyên nghiệp.
                      </p>
                    </div>
                    <span className="typo-label font-mono font-bold text-sky-700 dark:text-sky-300 pt-2 border-t border-sky-200/50 dark:border-sky-800/40 mt-2 block">
                      People & Competency
                    </span>
                  </div>

                  {/* Trụ Cột 2: Emerald Tint */}
                  <div className="h-full p-3.5 rounded-[14px] bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border border-emerald-200/90 dark:border-emerald-500/30 flex flex-col justify-between shadow-2xs hover:border-emerald-400 transition">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-emerald-200/70 dark:border-emerald-900/40">
                        <span className="font-mono font-black typo-label text-emerald-600 dark:text-emerald-400">2.2</span>
                        <WebIcon name="workflow" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <h5 className="typo-h5 font-black text-emerald-600 dark:text-emerald-400 tracking-wide">
                          Quy trình chuẩn hóa
                        </h5>
                      </div>
                      <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        SOP chuẩn hóa, luồng tiếp nhận, phân loại, giải quyết khiếu nại và ma trận escalation chặt chẽ.
                      </p>
                    </div>
                    <span className="typo-label font-mono font-bold text-emerald-700 dark:text-emerald-300 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/40 mt-2 block">
                      Process & Standards
                    </span>
                  </div>

                  {/* Trụ Cột 3: Purple Tint */}
                  <div className="h-full p-3.5 rounded-[14px] bg-gradient-to-br from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/80 border border-purple-200/90 dark:border-purple-500/30 flex flex-col justify-between shadow-2xs hover:border-purple-400 transition">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-purple-200/70 dark:border-purple-900/40">
                        <span className="font-mono font-black typo-label text-purple-600 dark:text-purple-400">2.3</span>
                        <WebIcon name="headphones" className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <h5 className="typo-h5 font-black text-purple-600 dark:text-purple-400 tracking-wide">
                          Công nghệ tổng đài
                        </h5>
                      </div>
                      <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        Tổng đài thông minh, CRM 360 độ đa kênh và các công cụ giám sát vận hành thời gian thực.
                      </p>
                    </div>
                    <span className="typo-label font-mono font-bold text-purple-700 dark:text-purple-300 pt-2 border-t border-purple-200/50 dark:border-purple-800/40 mt-2 block">
                      Tech & Omnichannel
                    </span>
                  </div>

                  {/* Trụ Cột 4: Amber Tint */}
                  <div className="h-full p-3.5 rounded-[14px] bg-gradient-to-br from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-800/80 border border-amber-200/90 dark:border-amber-500/30 flex flex-col justify-between shadow-2xs hover:border-amber-400 transition">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/70 dark:border-amber-900/40">
                        <span className="font-mono font-black typo-label text-amber-600 dark:text-amber-400">2.4</span>
                        <WebIcon name="chart" className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <h5 className="typo-h5 font-black text-amber-600 dark:text-amber-400 tracking-wide">
                          Dữ liệu đo lường
                        </h5>
                      </div>
                      <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        Hệ thống đo lường KPI/SLA minh bạch, báo cáo phân tích nguyên nhân gốc rễ và tối ưu chi phí.
                      </p>
                    </div>
                    <span className="typo-label font-mono font-bold text-amber-700 dark:text-amber-300 pt-2 border-t border-amber-200/50 dark:border-amber-800/40 mt-2 block">
                      Data & Governance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: BỐI CẢNH THÁCH THỨC */}
          <section
            id="sec-context"
            data-section-card="true"
            style={getSyncedCardStyle(2)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_14px_36px_rgba(217,119,6,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('amber') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('amber') }}>
                  3.
                </span>
                <WebIcon
                  name="alert"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('amber') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('amber') }}
                >
                  Bối cảnh thách thức
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 typo-body-sm text-slate-800 dark:text-slate-100 leading-relaxed font-semibold shadow-xs">
                {spec.context.intro}
              </div>

              {/* Diagnostic Challenge Cards (Distinct Colors & Equal Height) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                {spec.context.challenges.map((chDesc: string, idx: number) => {
                  const palette = CHALLENGE_PALETTES[idx % CHALLENGE_PALETTES.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-3.5 rounded-[14px] bg-gradient-to-br ${palette.theme} border shadow-2xs flex flex-col justify-between  transition duration-200`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-black/5 dark:border-white/10">
                          <span className="font-mono font-black typo-caption">3.{idx + 1}</span>
                          <WebIcon name={palette.icon} className="w-4 h-4 shrink-0" />
                          <h5 className="typo-h5 font-black tracking-wide" style={{ color: 'inherit' }}>
                            {palette.fourWord}
                          </h5>
                        </div>
                        <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {chDesc}
                        </p>
                      </div>
                      <span className="typo-label font-mono font-bold text-slate-500 dark:text-slate-400 pt-2 border-t border-black/5 dark:border-white/5 mt-2 block">
                        Thách thức vận hành 3.{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Strategic Conclusion Callout */}
              <div className="p-4 rounded-[14px] bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border-2 border-amber-400/50 typo-body-sm font-bold text-amber-950 dark:text-amber-200 leading-relaxed flex items-center gap-3 shadow-xs">
                <span className="font-mono font-black typo-body text-amber-600 dark:text-amber-400">03</span>
                <WebIcon name="target" className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="flex-1 font-semibold">
                  <strong className="text-amber-900 dark:text-amber-100 mr-1.5 font-bold">
                    Giải pháp trọng tâm:
                  </strong>
                  {spec.context.conclusion}
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 03: MỤC TIÊU CHIẾN LƯỢC */}
          <section
            id="sec-objectives"
            data-section-card="true"
            style={getSyncedCardStyle(3)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_14px_36px_rgba(13,148,136,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('teal') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('teal') }}>
                  4.
                </span>
                <WebIcon
                  name="target"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('teal') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('teal') }}
                >
                  Mục tiêu chiến lược
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              {/* Objectives Cards (Equal Height, Distinct Colors, Unframed Icons, 4-word Titles) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
                {spec.objectives.map((obj: any, idx: number) => {
                  const objThemes = [
                    {
                      theme: 'from-blue-50/90 to-blue-100/40 dark:from-blue-950/40 dark:to-slate-800/80 border-blue-200/90 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
                      icon: 'building',
                      badge: 'Organizational Goal',
                    },
                    {
                      theme: 'from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                      icon: 'workflow',
                      badge: 'Operational Excellence',
                    },
                    {
                      theme: 'from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/80 border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
                      icon: 'rocket',
                      badge: 'Growth & Scalability',
                    },
                  ];
                  const t = objThemes[idx % objThemes.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-4 rounded-[14px] bg-gradient-to-br ${t.theme} border shadow-2xs space-y-3 flex flex-col justify-between  transition duration-200`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black typo-caption">4.{idx + 1}</span>
                            <WebIcon name={t.icon} className="w-4 h-4 shrink-0" />
                            <h4 className="typo-h4 font-black tracking-wide" style={{ color: 'inherit' }}>
                              {obj.title}
                            </h4>
                          </div>
                          <span className="typo-label font-mono font-bold opacity-80">
                            {t.badge}
                          </span>
                        </div>

                        <ul className="space-y-2">
                          {obj.items.map((sub: string, sIdx: number) => (
                            <li
                              key={sIdx}
                              className="typo-caption text-slate-700 dark:text-slate-200 leading-relaxed font-medium flex items-start gap-2"
                            >
                              <WebIcon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/10 typo-label font-mono font-bold text-slate-500 dark:text-slate-400 text-right">
                        Mục tiêu 0{idx + 1} / {spec.objectives.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 04: HẠNG MỤC TRIỂN KHAI */}
          <section
            id="sec-scope"
            data-section-card="true"
            style={getSyncedCardStyle(4)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_16px_40px_rgba(124,58,237,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('purple') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('purple') }}>
                  5.
                </span>
                <WebIcon
                  name="clipboard"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('purple') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('purple') }}
                >
                  Hạng mục triển khai
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              {/* Work Items (Distinct Pastel/Dark Backgrounds, Equal Height, Unframed Icons, 4-word Titles) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
                {spec.scopeItems.map((scopeItem: any, idx: number) => {
                  const palette = SCOPE_PALETTES[idx % SCOPE_PALETTES.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-4 rounded-[14px] bg-gradient-to-br ${palette.theme} border shadow-2xs space-y-3 flex flex-col justify-between  transition duration-200 ${
                        idx === spec.scopeItems.length - 1 && spec.scopeItems.length % 2 !== 0 ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black typo-caption">5.{idx + 1}</span>
                            <WebIcon name={palette.icon} className="w-4 h-4 shrink-0" />
                            <h4 className="typo-h4 font-black tracking-wide" style={{ color: 'inherit' }}>
                              {scopeItem.title || scopeItem.code}
                            </h4>
                          </div>
                          <span className="typo-badge font-mono font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/60 border border-black/10 dark:border-white/10">
                            {scopeItem.code}
                          </span>
                        </div>

                        <p className="typo-caption text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                          {scopeItem.intro}
                        </p>

                        <div className="space-y-1.5 bg-white/70 dark:bg-slate-900/60 p-3 rounded-[14px] border border-black/5 dark:border-white/10">
                          <p className="typo-label font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <WebIcon name="list" className="w-3 h-3 opacity-80" />
                            <span>Nhiệm vụ triển khai trọng tâm:</span>
                          </p>
                          <ul className="grid grid-cols-1 gap-1.5 pt-1">
                            {scopeItem.tasks.map((task: string, tIdx: number) => (
                              <li
                                key={tIdx}
                                className="typo-caption text-slate-700 dark:text-slate-200 leading-relaxed font-medium flex items-start gap-2"
                              >
                                <WebIcon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {scopeItem.note && (
                          <p className="typo-caption italic text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 p-2.5 rounded-[14px] border border-black/5 dark:border-white/5">
                            💡 {scopeItem.note}
                          </p>
                        )}
                      </div>

                      {/* Highlighted Deliverable Pill */}
                      <div className="p-2.5 rounded-[14px] bg-white/80 dark:bg-slate-900/80 border border-black/10 dark:border-white/10 flex items-start gap-2 typo-caption mt-auto">
                        <WebIcon name="award" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-emerald-800 dark:text-emerald-300 mr-1.5">
                            Kết quả đầu ra:
                          </strong>
                          <span className="font-medium text-slate-800 dark:text-slate-100">{scopeItem.deliverable}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 05: LỘ TRÌNH VẬN HÀNH */}
          <section
            id="sec-methodology"
            data-section-card="true"
            style={getSyncedCardStyle(5)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_14px_36px_rgba(6,182,212,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('cyan') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('cyan') }}>
                  6.
                </span>
                <WebIcon
                  name="workflow"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('cyan') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('cyan') }}
                >
                  Lộ trình vận hành
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 typo-body-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed shadow-xs">
                {spec.methodology.intro}
              </div>

              {/* Process Timeline (Distinct Colorful Backgrounds & Equal Height) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
                {spec.methodology.phases.map((ph: any, idx: number) => {
                  const phasePalettes = [
                    { theme: 'from-blue-50/90 to-blue-100/40 dark:from-blue-950/40 dark:to-slate-800/80 border-blue-200/90 dark:border-blue-500/30 text-blue-600 dark:text-blue-400', icon: 'search' },
                    { theme: 'from-indigo-50/90 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-800/80 border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400', icon: 'workflow' },
                    { theme: 'from-cyan-50/90 to-cyan-100/40 dark:from-cyan-950/40 dark:to-slate-800/80 border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400', icon: 'shield-check' },
                    { theme: 'from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400', icon: 'chart' },
                    { theme: 'from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/80 border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400', icon: 'trending-up' },
                  ];
                  const p = phasePalettes[idx % phasePalettes.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-3.5 rounded-[14px] bg-gradient-to-br ${p.theme} border shadow-2xs space-y-2 flex flex-col justify-between  transition duration-200`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 pb-1.5 border-b border-black/5 dark:border-white/10">
                          <span className="font-mono font-black typo-caption">6.{idx + 1}</span>
                          <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                          <h5 className="typo-h5 font-black tracking-wide leading-tight" style={{ color: 'inherit' }}>
                            {ph.title}
                          </h5>
                        </div>
                        <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {ph.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between typo-label font-mono font-bold opacity-80 mt-auto">
                        <span>{ph.stage}</span>
                        <span>Phase {idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {spec.methodology.outro && (
                <div className="p-3.5 rounded-[14px] bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-white/10 flex items-center gap-2">
                  <WebIcon name="target" className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <p className="typo-caption italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {spec.methodology.outro}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 06: CHỈ SỐ HIỆU QUẢ */}
          <section
            id="sec-metrics"
            data-section-card="true"
            style={getSyncedCardStyle(6)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_14px_36px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_16px_40px_rgba(5,150,105,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('emerald') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('emerald') }}>
                  7.
                </span>
                <WebIcon
                  name="chart"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('emerald') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('emerald') }}
                >
                  Chỉ số hiệu quả
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 typo-body-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed shadow-xs">
                {spec.metrics.intro}
              </div>

              {/* KPI Categories Grid Cards (Equal Height, Distinct Colorful Gradients, Unframed Icons) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
                {spec.metrics.table.map((m: any, idx: number) => {
                  const metricPalettes = [
                    { theme: 'from-sky-50/90 to-sky-100/40 dark:from-sky-950/40 dark:to-slate-800/80 border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400', icon: 'phone' },
                    { theme: 'from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400', icon: 'clock' },
                    { theme: 'from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/80 border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400', icon: 'award' },
                    { theme: 'from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-800/80 border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400', icon: 'target' },
                    { theme: 'from-rose-50/90 to-rose-100/40 dark:from-rose-950/40 dark:to-slate-800/80 border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400', icon: 'alert' },
                    { theme: 'from-cyan-50/90 to-cyan-100/40 dark:from-cyan-950/40 dark:to-slate-800/80 border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400', icon: 'users' },
                    { theme: 'from-indigo-50/90 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-800/80 border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400', icon: 'shield-check' },
                  ];
                  const p = metricPalettes[idx % metricPalettes.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-3.5 rounded-[14px] bg-gradient-to-br ${p.theme} border shadow-2xs space-y-2.5 flex flex-col justify-between  transition duration-200 ${
                        idx === spec.metrics.table.length - 1 && spec.metrics.table.length % 2 !== 0 ? 'sm:col-span-2 lg:col-span-2 xl:col-span-1' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-black/5 dark:border-white/10">
                          <span className="font-mono font-black typo-caption">7.{idx + 1}</span>
                          <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                          <h5 className="typo-h5 font-black tracking-wide leading-tight" style={{ color: 'inherit' }}>
                            {m.category}
                          </h5>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.indicators.split(/[,;·]/).filter(Boolean).map((ind: string, iIdx: number) => (
                            <span
                              key={iIdx}
                              className="px-2 py-0.5 rounded-[14px] bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold typo-badge"
                            >
                              {ind.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/5 typo-label font-mono font-bold opacity-80 flex items-center justify-between mt-auto">
                        <span>{m.category}</span>
                        <span>Nhóm 7.{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {spec.metrics.outro && (
                <div className="p-3.5 rounded-[14px] bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-white/10 flex items-center gap-2">
                  <WebIcon name="chart" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="typo-caption italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {spec.metrics.outro}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 07: VAI TRÒ TRÁCH NHIỆM */}
          <section
            id="sec-roles"
            data-section-card="true"
            style={getSyncedCardStyle(7)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_16px_40px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_16px_40px_rgba(225,29,72,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('rose') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('rose') }}>
                  8.
                </span>
                <WebIcon
                  name="users"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('rose') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('rose') }}
                >
                  Vai trò trách nhiệm
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 typo-body-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed shadow-xs">
                {spec.pmRoles.intro}
              </div>

              {/* Leadership Roles (Equal Height, Distinct Colorful Gradients, Unframed Icons) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
                {spec.pmRoles.items.map((r: any, idx: number) => {
                  const rolePalettes = [
                    { theme: 'from-sky-50/90 to-sky-100/40 dark:from-sky-950/40 dark:to-slate-800/80 border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400', icon: 'compass' },
                    { theme: 'from-indigo-50/90 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-800/80 border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400', icon: 'users' },
                    { theme: 'from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/80 border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400', icon: 'sliders' },
                    { theme: 'from-cyan-50/90 to-cyan-100/40 dark:from-cyan-950/40 dark:to-slate-800/80 border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400', icon: 'network' },
                    { theme: 'from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-800/80 border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400', icon: 'trending-up' },
                    { theme: 'from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400', icon: 'workflow' },
                    { theme: 'from-rose-50/90 to-rose-100/40 dark:from-rose-950/40 dark:to-slate-800/80 border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400', icon: 'shield-check' },
                  ];
                  const p = rolePalettes[idx % rolePalettes.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-3.5 rounded-[14px] bg-gradient-to-br ${p.theme} border shadow-2xs space-y-2 flex flex-col justify-between  transition duration-200 ${
                        idx === spec.pmRoles.items.length - 1 && spec.pmRoles.items.length % 2 !== 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-black/5 dark:border-white/10">
                          <span className="font-mono font-black typo-caption">8.{idx + 1}</span>
                          <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                          <h5 className="typo-h5 font-black tracking-wide leading-tight" style={{ color: 'inherit' }}>
                            {r.role}
                          </h5>
                        </div>
                        <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {r.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between typo-label font-mono font-bold opacity-80 mt-auto">
                        <span>{r.role}</span>
                        <span>Vai trò 8.{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 08: KẾT QUẢ ĐẠT ĐƯỢC */}
          <section
            id="sec-outcomes"
            data-legacy-id="projects-results-card"
            data-section-card="true"
            style={getSyncedCardStyle(3)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_16px_40px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_16px_40px_rgba(13,148,136,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('teal') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('teal') }}>
                  9.
                </span>
                <WebIcon
                  name="award"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('teal') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('teal') }}
                >
                  Kết quả đạt được
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 typo-body-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed shadow-xs">
                {spec.expectedOutcomes.intro}
              </div>

              {/* Value Outcomes (Equal Height, Distinct Colorful Gradients, Unframed Icons) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
                {spec.expectedOutcomes.items.map((item: any, idx: number) => {
                  const outcomePalettes = [
                    { theme: 'from-indigo-50/90 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-800/80 border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400', icon: 'building' },
                    { theme: 'from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400', icon: 'workflow' },
                    { theme: 'from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-slate-800/80 border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400', icon: 'award' },
                    { theme: 'from-sky-50/90 to-sky-100/40 dark:from-sky-950/40 dark:to-slate-800/80 border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400', icon: 'database' },
                    { theme: 'from-rose-50/90 to-rose-100/40 dark:from-rose-950/40 dark:to-slate-800/80 border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400', icon: 'heart' },
                    { theme: 'from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-800/80 border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400', icon: 'trending-up' },
                  ];
                  const p = outcomePalettes[idx % outcomePalettes.length];
                  return (
                    <div
                      key={idx}
                      className={`h-full p-4 rounded-[14px] bg-gradient-to-br ${p.theme} border shadow-2xs space-y-2 flex flex-col justify-between  transition duration-200`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-black/5 dark:border-white/10">
                          <span className="font-mono font-black typo-caption">9.{idx + 1}</span>
                          <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                          <h5 className="typo-h5 font-black tracking-wide leading-tight" style={{ color: 'inherit' }}>
                            {item.dimension}
                          </h5>
                        </div>
                        <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between typo-label font-mono font-bold opacity-80 mt-auto">
                        <span>Giá trị 0{idx + 1}</span>
                        <span>Đã nghiệm thu ✓</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {spec.expectedOutcomes.outro && (
                <div className="p-3.5 rounded-[14px] bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-white/10 flex items-center gap-2">
                  <WebIcon name="award" className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <p className="typo-caption italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {spec.expectedOutcomes.outro}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 09: TRIẾT LÝ QUẢN TRỊ */}
          <section
            id="sec-philosophy"
            data-section-card="true"
            style={getSyncedCardStyle(8)}
            className={`u223-c relative overflow-hidden w-full h-full p-[15px] rounded-[14px] flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-all duration-300 ${
              isLightMode
                ? 'border border-slate-300/80 shadow-[0_20px_48px_rgba(30,27,75,0.08)]'
                : 'border border-white/20 dark:border-white/10 shadow-[0_20px_48px_rgba(109,40,217,0.25)]'
            }`}
          >
            <span className="u223-art pointer-events-none select-none" aria-hidden="true" />
            
            {/* Header Card */}
            <div
              className={`relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b ${
                isLightMode ? 'border-slate-300/70' : 'border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5" style={{ color: getCardAccentColor('violet') }}>
                <span className="font-mono font-black text-base sm:text-lg" style={{ color: getCardAccentColor('violet') }}>
                  10.
                </span>
                <WebIcon
                  name="sparkles"
                  className="w-5 h-5 shrink-0 bg-transparent border-0 p-0 shadow-none"
                  style={{ color: getCardAccentColor('violet') }}
                />
                <h3
                  className="typo-h3 font-black font-play tracking-wide"
                  style={{ color: getCardAccentColor('violet') }}
                >
                  Triết lý quản trị
                </h3>
              </div>
            </div>

            {/* Body Card Cuộn Mượt Mà */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1.5 py-2.5 space-y-3.5 text-left">
              <div className="p-4 rounded-[14px] bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 space-y-2.5 shadow-xs">
                {spec.philosophy.paragraphs.map((p: string, idx: number) => (
                  <p key={idx} className="typo-body-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                    {p}
                  </p>
                ))}
              </div>

              {/* 3 Philosophy Pillars (Equal Height, Distinct Colorful Gradients, Unframed Icons, 4-word Titles) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
                {[
                  {
                    num: '10.1',
                    icon: 'cpu',
                    fourWord: 'Công nghệ tốc độ',
                    desc: 'Công nghệ và hệ thống tự động giúp tăng tốc độ phục vụ, tối ưu nguồn lực và kết nối thông suốt đa kênh.',
                    theme: 'from-sky-50/90 to-sky-100/40 dark:from-sky-950/40 dark:to-slate-800/80 border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
                  },
                  {
                    num: '10.2',
                    icon: 'workflow',
                    fourWord: 'Quy trình nhất quán',
                    desc: 'Chuẩn hóa quy trình SOP và tiêu chuẩn dịch vụ tạo ra chất lượng đồng nhất, hạn chế tối đa rủi ro và sai sót.',
                    theme: 'from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-800/80 border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                  },
                  {
                    num: '10.3',
                    icon: 'heart',
                    fourWord: 'Con người trọng tâm',
                    desc: 'Chính con người, văn hóa đồng cảm và sự tận tâm mới quyết định sự gắn kết trung thành dài lâu của khách hàng.',
                    theme: 'from-rose-50/90 to-rose-100/40 dark:from-rose-950/40 dark:to-slate-800/80 border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`h-full p-4 rounded-[14px] bg-gradient-to-br ${item.theme} border shadow-2xs space-y-2 flex flex-col justify-between  transition duration-200`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-black/5 dark:border-white/10">
                        <span className="font-mono font-black typo-caption">{item.num}</span>
                        <WebIcon name={item.icon} className="w-4 h-4 shrink-0" />
                        <h5 className="typo-h5 font-black tracking-wide leading-tight" style={{ color: 'inherit' }}>
                          {item.fourWord}
                        </h5>
                      </div>
                      <p className="typo-caption text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-black/5 dark:border-white/5 typo-label font-mono font-bold opacity-80 text-right mt-auto">
                      Trụ cột 0{idx + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Golden Core Message Box */}
              <div className="p-4 rounded-[14px] bg-gradient-to-r from-violet-500/10 via-purple-500/15 to-indigo-500/10 border-2 border-purple-400/60 space-y-2 shadow-xs">
                <span className="typo-label font-mono font-black uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <WebIcon name="sparkles" className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Thông điệp cốt lõi từ lãnh đạo dự án:</span>
                </span>
                <p className="typo-body font-black text-slate-900 dark:text-white italic leading-relaxed">
                  “{spec.philosophy.coreMessage}”
                </p>
                <div className="text-right typo-caption font-bold text-purple-700 dark:text-purple-300">
                  — {selectedArticle.role}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      </div>

      {/* 2. KHỐI BANNER MỤC LỤC BÊN PHẢI (BANNER DỌC CĂN GIỮA HÌNH ẢNH, NỀN TRONG SUỐT RÕ NÉT, TIÊU ĐỀ KHÔNG ĐÓNG KHUNG) */}
      {spec && (
        <aside
          ref={bannerSidebarRef}
          data-banner-aspect="sidebar"
          className="w-full md:w-[220px] lg:w-[235px] xl:w-[255px] shrink-0 h-auto max-h-[420px] md:max-h-none md:h-full flex flex-col pointer-events-auto"
        >
          <div className={`w-full h-full rounded-[14px] ${
            isLightMode
              ? 'bg-white/40 text-slate-800 border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)]'
              : 'bg-slate-950/60 text-white border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
          } border backdrop-blur-md p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden relative group`}>
            {/* HÌNH BANNER DỰ ÁN CĂN CHÍNH GIỮA (CENTER BANNER DỌC) VÀ NHÌN RÕ HÌNH NỀN BÊN DƯỚI */}
            {selectedArticle.image && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover object-center pointer-events-none opacity-85 dark:opacity-80 group-hover:opacity-100 transition-all duration-700 scale-100"
                />
              </div>
            )}

            {/* Lớp phủ chuyển sắc siêu trong suốt giúp nhìn rõ 100% hình ảnh nền banner và chữ banner bên dưới */}
            <div className={`absolute inset-0 ${
              isLightMode
                ? 'bg-gradient-to-b from-white/20 via-white/5 to-white/25'
                : 'bg-gradient-to-b from-slate-950/25 via-slate-950/10 to-slate-950/35'
            } backdrop-blur-[0.2px] pointer-events-none`} />

            {/* Header: TIÊU ĐỀ KHÔNG ĐÓNG KHUNG THẺ, ICON & TIÊU ĐỀ KÍCH THƯỚC BẰNG NHAU, ĐỒNG MÀU */}
            <div className={`relative z-10 flex items-center justify-between pb-2 border-b ${
              isLightMode ? 'border-slate-300/60' : 'border-white/20'
            } shrink-0`}>
              <div className="flex items-center gap-2 max-w-full">
                <span className="shrink-0 flex items-center justify-center" style={{ color: isLightMode ? '#4338ca' : '#38bdf8' }}>
                  <WebIcon name="layers" className="w-4 h-4 shrink-0" />
                </span>
                <h3
                  className="typo-h5 font-black font-play tracking-wide truncate"
                  style={{ color: isLightMode ? '#4338ca' : '#38bdf8' }}
                >
                  Mục Lục Dự Án
                </h3>
              </div>
              <span className={`typo-badge font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                isLightMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-xs'
              }`}>
                {selectedArticle.code}
              </span>
            </div>

            {/* Danh sách 10 mục lục điều hướng - Thứ tự chuẩn: Số thứ tự & Icon & Tiêu đề */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar py-2 space-y-1.5 pr-0.5">
              {[
                { id: 'sec-mindmap', num: '1.', title: 'Sơ đồ tư duy', icon: 'brain', color: 'fuchsia' },
                { id: 'sec-overview', num: '2.', title: 'Tổng quan dự án', icon: 'layers', color: 'blue' },
                { id: 'sec-context', num: '3.', title: 'Bối cảnh thách thức', icon: 'alert', color: 'amber' },
                { id: 'sec-objectives', num: '4.', title: 'Mục tiêu chiến lược', icon: 'target', color: 'teal' },
                { id: 'sec-scope', num: '5.', title: 'Hạng mục triển khai', icon: 'clipboard', color: 'purple' },
                { id: 'sec-methodology', num: '6.', title: 'Lộ trình vận hành', icon: 'workflow', color: 'cyan' },
                { id: 'sec-metrics', num: '7.', title: 'Chỉ số hiệu quả', icon: 'chart', color: 'emerald' },
                { id: 'sec-roles', num: '8.', title: 'Vai trò trách nhiệm', icon: 'users', color: 'rose' },
                { id: 'sec-outcomes', num: '9.', title: 'Kết quả đạt được', icon: 'award', color: 'teal' },
                { id: 'sec-philosophy', num: '10.', title: 'Triết lý quản trị', icon: 'sparkles', color: 'violet' },
              ].map((item) => {
                const isActive = activeSection === item.id;
                const itemTheme = SECTION_COLORS[item.color || 'rose'] || SECTION_COLORS.blue;
                const itemColor = isLightMode ? itemTheme.light : itemTheme.dark;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    style={
                      isActive
                        ? undefined
                        : {
                            color: itemColor,
                            borderColor: isLightMode ? `${itemTheme.light}45` : `${itemTheme.dark}35`,
                            backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.82)' : 'rgba(15, 23, 42, 0.75)',
                          }
                    }
                    className={`w-full text-left px-2.5 py-1.5 rounded-[14px] typo-label font-bold font-play tracking-wide transition-all border cursor-pointer flex items-center justify-between gap-1.5 ${
                      isActive
                        ? `bg-gradient-to-r ${itemTheme.grad} text-white border-white/40 shadow-md ring-1 ring-white/30`
                        : 'hover:brightness-105 backdrop-blur-md shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {/* 1. Số thứ tự */}
                      <span className="font-mono font-black typo-label shrink-0" style={{ color: isActive ? '#ffffff' : itemColor }}>
                        {item.num}
                      </span>
                      {/* 2. Icon */}
                      <span className="shrink-0 flex items-center" style={{ color: isActive ? '#ffffff' : itemColor }}>
                        <WebIcon name={item.icon} className="w-3.5 h-3.5" />
                      </span>
                      {/* 3. Tiêu đề */}
                      <span className="truncate font-play font-bold" style={{ color: isActive ? '#ffffff' : itemColor }}>
                        {item.title}
                      </span>
                    </div>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions trong Banner: Khung Hợp Nhất & Màu Chữ Giống Màu Icon */}
            <div className={`relative z-10 pt-2 border-t ${
              isLightMode ? 'border-slate-200/80' : 'border-white/15'
            } flex flex-col gap-1.5 shrink-0`}>
              <button
                type="button"
                onClick={() => onOpenMindmap(selectedArticle)}
                style={{
                  color: isLightMode ? '#4f46e5' : '#38bdf8',
                  borderColor: isLightMode ? 'rgba(79, 70, 229, 0.35)' : 'rgba(56, 189, 248, 0.4)',
                  backgroundColor: isLightMode ? 'rgba(79, 70, 229, 0.12)' : 'rgba(56, 189, 248, 0.18)',
                }}
                className="w-full py-1.5 px-2.5 rounded-[14px] typo-button font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs border backdrop-blur-md"
                title="Phóng to sơ đồ tư duy"
              >
                <span className="shrink-0 flex items-center" style={{ color: isLightMode ? '#4f46e5' : '#38bdf8' }}>
                  <WebIcon name="brain" className="w-3.5 h-3.5" />
                </span>
                <span className="font-play" style={{ color: isLightMode ? '#4f46e5' : '#38bdf8' }}>
                  Sơ Đồ Tư Duy
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  color: isLightMode ? '#e11d48' : '#fb7185',
                  borderColor: isLightMode ? 'rgba(225, 29, 72, 0.35)' : 'rgba(251, 113, 133, 0.4)',
                  backgroundColor: isLightMode ? 'rgba(225, 29, 72, 0.12)' : 'rgba(251, 113, 133, 0.18)',
                }}
                className="w-full py-1.5 px-2.5 rounded-[14px] typo-button font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs border backdrop-blur-md"
                title="Đóng chi tiết bài viết"
              >
                <span className="shrink-0 flex items-center" style={{ color: isLightMode ? '#e11d48' : '#fb7185' }}>
                  <WebIcon name="close" className="w-3.5 h-3.5" />
                </span>
                <span className="font-play" style={{ color: isLightMode ? '#e11d48' : '#fb7185' }}>
                  Đóng Bài Viết
                </span>
              </button>
            </div>
          </div>
        </aside>
      )}
      </div>
    </div>
  );
};
