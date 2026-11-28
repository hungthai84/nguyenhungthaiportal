'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProjectData } from '@/types';
import { WebIcon } from '@/components/ui/WebIcon';
import {
  getProjectDetailedSpec,
  SCOPE_PALETTES,
  CHALLENGE_PALETTES,
} from '@/utils/projectSpecGenerator';

export interface ProjectDetailViewProps {
  selectedArticle: ProjectData;
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

const SECTION_COLORS: Record<string, { light: string; dark: string }> = {
  fuchsia: { light: '#c026d3', dark: '#f0abfc' },
  blue: { light: '#2563eb', dark: '#93c5fd' },
  amber: { light: '#d97706', dark: '#fcd34d' },
  indigo: { light: '#4f46e5', dark: '#a5b4fc' },
  purple: { light: '#9333ea', dark: '#d8b4fe' },
  cyan: { light: '#0891b2', dark: '#67e8f9' },
  emerald: { light: '#059669', dark: '#6ee7b7' },
  rose: { light: '#e11d48', dark: '#fda4af' },
  teal: { light: '#0d9488', dark: '#5eead4' },
  violet: { light: '#7c3aed', dark: '#c4b5fd' },
};

const TOC_ITEMS = [
  { id: 'sec-mindmap', num: '1.', title: 'Tư Duy', icon: 'brain', color: 'fuchsia' },
  { id: 'sec-overview', num: '2.', title: 'Tổng Quan', icon: 'layers', color: 'blue' },
  { id: 'sec-context', num: '3.', title: 'Bối Cảnh', icon: 'alert', color: 'amber' },
  { id: 'sec-objectives', num: '4.', title: 'Mục Tiêu', icon: 'target', color: 'teal' },
  { id: 'sec-scope', num: '5.', title: 'Hạng Mục', icon: 'clipboard', color: 'purple' },
  { id: 'sec-methodology', num: '6.', title: 'Lộ Trình', icon: 'workflow', color: 'cyan' },
  { id: 'sec-metrics', num: '7.', title: 'Chỉ Số', icon: 'chart', color: 'emerald' },
  { id: 'sec-roles', num: '8.', title: 'Vai Trò', icon: 'users', color: 'rose' },
  { id: 'sec-outcomes', num: '9.', title: 'Kết Quả', icon: 'award', color: 'teal' },
  { id: 'sec-philosophy', num: '10.', title: 'Triết Lý', icon: 'sparkles', color: 'violet' },
] as const;

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  selectedArticle,
  onClose,
  onOpenMindmap,
  isLight = true,
  activeSection = 'sec-mindmap',
  onSectionChange,
}) => {
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [mindmapMode, setMindmapMode] = useState<'interactive' | 'image'>('interactive');
  const spec = useMemo(() => getProjectDetailedSpec(selectedArticle), [selectedArticle]);
  const outerScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);

  const isStrategy = selectedArticle.groupKey === 'strategy';

  // Đồng bộ nhận diện giao diện Sáng / Tối cho toàn bộ 11 theme
  useEffect(() => {
    const checkTheme = () => {
      const isDarkClass =
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      const themeAttr =
        typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
      const cardStyleAttr =
        typeof document !== 'undefined'
          ? document.documentElement.getAttribute('data-card-style')
          : null;
      const effectiveStyle = cardStyleAttr || themeAttr;
      const isDarkThemeAttr =
        effectiveStyle === 'dark-liquid-glass' ||
        effectiveStyle === 'dark-iridescent-liquid-glass' ||
        effectiveStyle === 'cowhide-leather' ||
        effectiveStyle === 'dark-cowhide-leather' ||
        effectiveStyle === 'walnut-wood' ||
        effectiveStyle === 'deep-ocean' ||
        effectiveStyle === 'dark-neumorphism-beyond' ||
        effectiveStyle === 'dark-frost-ice-neu' ||
        effectiveStyle === 'dark-flat-soft-ui' ||
        effectiveStyle === 'dark-luxury' ||
        effectiveStyle === 'dark-neon-glass' ||
        effectiveStyle === 'neumorphism-soft-ui-dark';
      if (typeof isLight === 'boolean') {
        setIsLightMode(isLight && !isDarkClass && !isDarkThemeAttr);
      } else {
        setIsLightMode(!isDarkClass && !isDarkThemeAttr);
      }
    };

    checkTheme();

    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme', 'data-card-style'],
      });
      return () => observer.disconnect();
    }
  }, [isLight]);

  // Reset vị trí cuộn & mục lục khi chuyển sang bài viết dự án khác
  useEffect(() => {
    setMindmapMode('interactive');
    onSectionChange?.('sec-mindmap');
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    outerScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedArticle.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCardAccentColor = (key: keyof typeof SECTION_COLORS) => {
    const entry = SECTION_COLORS[key] || SECTION_COLORS.blue;
    return isLightMode ? entry.light : entry.dark;
  };

  const sectionCardStyle: React.CSSProperties = {
    padding: '15px',
    borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
    height: 'var(--project-banner-h, 100cqh)',
    minHeight: 'var(--project-banner-h, 100cqh)',
    maxHeight: 'var(--project-banner-h, 100cqh)',
    boxSizing: 'border-box',
    overflowY: 'auto',
    transformOrigin: 'top center',
  };

  // Đồng bộ chiều cao thẻ từ 1 đến 10 chuẩn xác bằng chiều cao banner
  useEffect(() => {
    const banner = bannerRef.current;
    const container = scrollContainerRef.current;
    if (!banner || !container) return;

    const updateBannerHeight = () => {
      const h = banner.offsetHeight;
      if (h > 100) {
        container.style.setProperty('--project-banner-h', `${h}px`);
      }
    };

    updateBannerHeight();
    const observer = new ResizeObserver(updateBannerHeight);
    observer.observe(banner);
    return () => observer.disconnect();
  }, [selectedArticle.id]);

  // Theo dõi mục lục đang xem & Hiệu ứng Covering card (stacking cards)
  useEffect(() => {
    const desktopScroller = scrollContainerRef.current;
    const mobileScroller = outerScrollRef.current;
    if (!desktopScroller && !mobileScroller) return;

    const getActiveScroller = () => {
      if (
        desktopScroller &&
        desktopScroller.scrollHeight > desktopScroller.clientHeight + 4
      ) {
        return desktopScroller;
      }
      return mobileScroller || desktopScroller;
    };

    const handleScroll = () => {
      if (!desktopScroller) return;
      const scroller = getActiveScroller();
      if (!scroller) return;
      const cards = Array.from(
        desktopScroller.querySelectorAll<HTMLElement>('.project-detail-section-card[data-section-card="true"]')
      );
      if (!cards.length) return;
      const scrollerTop = scroller.getBoundingClientRect().top;

      let matchedId = cards[0]?.id || 'sec-mindmap';
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop <= scrollerTop + 28 && card.id) {
          matchedId = card.id;
        }

        // Nhập hẳn thẻ khi chồng lên nhau (top: 0px, không thu nhỏ viền hay chừa khoảng dư)
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const nextCardTop = nextCard.getBoundingClientRect().top;
          const distToCover = nextCardTop - scrollerTop;

          if (distToCover <= 0) {
            card.style.transform = 'scale(1)';
            card.style.filter = 'brightness(0.92)';
          } else if (distToCover < 240) {
            const progress = 1 - distToCover / 240;
            const brightness = 1 - progress * 0.08;
            card.style.transform = 'scale(1)';
            card.style.filter = `brightness(${brightness.toFixed(3)})`;
          } else {
            card.style.transform = 'scale(1)';
            card.style.filter = 'brightness(1)';
          }
        } else {
          card.style.transform = 'scale(1)';
          card.style.filter = 'brightness(1)';
        }
      }

      if (onSectionChange) {
        onSectionChange(matchedId);
      }
    };

    desktopScroller?.addEventListener('scroll', handleScroll, { passive: true });
    mobileScroller?.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      desktopScroller?.removeEventListener('scroll', handleScroll);
      mobileScroller?.removeEventListener('scroll', handleScroll);
    };
  }, [selectedArticle.id, spec, onSectionChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const scrollToSection = (id: string) => {
    onSectionChange?.(id);
    const el = document.getElementById(id);
    if (!el) return;

    const desktopScroller = scrollContainerRef.current;
    const mobileScroller = outerScrollRef.current;
    const scroller =
      desktopScroller && desktopScroller.scrollHeight > desktopScroller.clientHeight + 4
        ? desktopScroller
        : mobileScroller;

    if (scroller) {
      const cardIdx = parseInt(el.getAttribute('data-card-index') || '0', 10);
      const cardHeight = el.offsetHeight || bannerRef.current?.offsetHeight || scroller.clientHeight;
      if (scroller === desktopScroller && cardHeight > 0) {
        scroller.scrollTo({ top: Math.max(0, cardIdx * cardHeight), behavior: 'smooth' });
      } else {
        const deltaTop = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        scroller.scrollTo({ top: Math.max(0, scroller.scrollTop + deltaTop), behavior: 'smooth' });
      }
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeTocIndex = Math.max(
    0,
    TOC_ITEMS.findIndex((item) => item.id === activeSection)
  );
  const tocProgressPercent = Math.round(((activeTocIndex + 1) / TOC_ITEMS.length) * 100);

  return (
    <div
      id="project-detail-layout"
      ref={scrollContainerRef}
      className="w-full h-full flex-1 min-h-0 p-0 box-border items-start relative glass-scrollbar rounded-[inherit] text-left font-play"
    >
      {spec && (
        <div id="project-detail-cards-col" className="project-detail-cards-col flex flex-col w-full min-w-0 relative">
          {/* SECTION 01: SƠ ĐỒ TƯ DUY KIẾN TRÚC DỰ ÁN */}
            <section
              id="sec-mindmap"
              data-section-card="true"
              data-card-index="0"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 10 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              {/* Header Card Sơ Đồ Tư Duy + Nút chuyển chế độ Tương tác / Ảnh gốc & Phóng to */}
              <div className="relative z-10 shrink-0 flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2 min-w-0"
                  style={{ color: getCardAccentColor('fuchsia') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('fuchsia') }}
                  >
                    1.
                  </span>
                  <WebIcon
                    name="brain"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('fuchsia') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('fuchsia') }}
                  >
                    Sơ đồ tư duy
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setMindmapMode('interactive')}
                    className={`px-2.5 py-1 rounded-full typo-badge font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      mindmapMode === 'interactive'
                        ? 'border-transparent shadow-xs'
                        : 'project-detail-chip border-[var(--border-subcard)] text-[var(--text-secondary)] hover:opacity-90'
                    }`}
                    style={
                      mindmapMode === 'interactive'
                        ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                        : undefined
                    }
                  >
                    <WebIcon name="workflow" className="w-3.5 h-3.5 shrink-0" />
                    <span>Sơ đồ tương tác</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMindmapMode('image')}
                    className={`px-2.5 py-1 rounded-full typo-badge font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      mindmapMode === 'image'
                        ? 'border-transparent shadow-xs'
                        : 'project-detail-chip border-[var(--border-subcard)] text-[var(--text-secondary)] hover:opacity-90'
                    }`}
                    style={
                      mindmapMode === 'image'
                        ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                        : undefined
                    }
                  >
                    <WebIcon name="image" className="w-3.5 h-3.5 shrink-0" />
                    <span>Ảnh sơ đồ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenMindmap(selectedArticle)}
                    title="Phóng to sơ đồ tư duy toàn màn hình"
                    className="project-detail-chip px-2.5 py-1 rounded-full typo-badge font-bold border border-[var(--border-subcard)] text-[var(--text-primary)] hover:opacity-90 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <WebIcon name="maximize" className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Phóng to</span>
                  </button>
                </div>
              </div>

              {/* Mind Map Body */}
              <div className="relative z-10 flex flex-col gap-[15px] flex-1 min-h-0 justify-between">
                {mindmapMode === 'interactive' ? (
                  <div className="flex flex-col gap-[15px] flex-1 min-h-0 justify-between">
                    {/* Connecting Visual Divider */}
                    <div className="hidden lg:flex items-center justify-center gap-4 typo-label font-mono font-bold text-[var(--text-muted)]">
                      <div
                        className={`h-px flex-1 bg-gradient-to-r from-transparent ${
                          isStrategy
                            ? 'via-sky-300 dark:via-sky-600/50'
                            : 'via-fuchsia-300 dark:via-fuchsia-600/50'
                        } to-transparent`}
                      />
                      <span
                        className={`project-detail-chip flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                          isStrategy
                            ? 'border-sky-200 dark:border-sky-700'
                            : 'border-fuchsia-200 dark:border-fuchsia-700'
                        } shadow-2xs`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isStrategy ? 'bg-sky-500' : 'bg-fuchsia-500'
                          }`}
                        />
                        4 Nhánh Triển Khai Chiến Lược & Vận Hành Cốt Lõi
                      </span>
                      <div
                        className={`h-px flex-1 bg-gradient-to-r from-transparent ${
                          isStrategy
                            ? 'via-sky-300 dark:via-sky-600/50'
                            : 'via-fuchsia-300 dark:via-fuchsia-600/50'
                        } to-transparent`}
                      />
                    </div>

                    {/* 4 Radiating Branches (2x2 Grid, Equal Height, 15px Gap & Padding) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-stretch flex-1 min-h-0">
                      {/* Branch 1: Bối cảnh & Thách thức */}
                      <div
                        id="projects-mindmap-branch-1"
                        data-subcard="true"
                        className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border-2 border-rose-200 dark:border-rose-500/40 shadow-xs flex flex-col justify-between gap-[15px] hover:border-rose-400 dark:hover:border-rose-400 transition-all duration-300"
                      >
                        <div className="space-y-2.5 min-w-0">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-200/80 dark:border-rose-900/40">
                            <div className="subcard-header-sync flex items-center gap-2 text-rose-600 dark:text-rose-400 min-w-0">
                              <WebIcon
                                name="alert"
                                className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0"
                              />
                              <h5
                                className="typo-h5 subcard-title-synced text-rose-600 dark:text-rose-400 tracking-wide font-play m-0 truncate"
                                data-subcard-title="true"
                              >
                                Bối Cảnh Vận Hành
                              </h5>
                            </div>
                          </div>

                          <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                            {spec.context.intro}
                          </p>

                          <div className="space-y-1.5 pt-1 border-l-2 border-dashed border-rose-300 dark:border-rose-600/60 pl-2.5">
                            {spec.context.challenges.slice(0, 3).map((ch, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-1.5 typo-label text-[var(--text-secondary)]"
                              >
                                <WebIcon
                                  name="alert"
                                  className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5"
                                />
                                <span className="leading-snug">{ch}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => scrollToSection('sec-context')}
                          className="pt-2.5 border-t border-rose-200/70 dark:border-rose-900/40 typo-label font-bold text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <span>Xem bối cảnh & các điểm nghẽn chi tiết</span>
                          <span>↓</span>
                        </button>
                      </div>

                      {/* Branch 2: Mục tiêu & Chiến lược */}
                      <div
                        data-subcard="true"
                        className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border-2 border-amber-200 dark:border-amber-500/40 shadow-xs flex flex-col justify-between gap-[15px] hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300"
                      >
                        <div className="space-y-2.5 min-w-0">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200/80 dark:border-amber-900/40">
                            <div className="subcard-header-sync flex items-center gap-2 text-amber-600 dark:text-amber-400 min-w-0">
                              <WebIcon
                                name="target"
                                className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
                              />
                              <h5
                                className="typo-h5 subcard-title-synced text-amber-600 dark:text-amber-400 tracking-wide font-play m-0 truncate"
                                data-subcard-title="true"
                              >
                                Mục Tiêu Kỳ Vọng
                              </h5>
                            </div>
                          </div>

                          <div className="space-y-2 border-l-2 border-dashed border-amber-300 dark:border-amber-600/60 pl-2.5">
                            {spec.objectives.slice(0, 3).map((obj, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <div className="flex items-center gap-1.5 typo-caption font-bold text-amber-900 dark:text-amber-200">
                                  <WebIcon
                                    name="target"
                                    className="w-3.5 h-3.5 text-amber-500 shrink-0"
                                  />
                                  <span>{obj.title}</span>
                                </div>
                                {obj.items[0] && (
                                  <p className="typo-label text-[var(--text-secondary)] pl-5 leading-snug">
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
                          className="pt-2.5 border-t border-amber-200/70 dark:border-amber-900/40 typo-label font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <span>Xem chi tiết 3 mục tiêu chiến lược</span>
                          <span>↓</span>
                        </button>
                      </div>

                      {/* Branch 3: Phương pháp & 4 Trụ cột SOP */}
                      <div
                        data-subcard="true"
                        className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border-2 border-sky-200 dark:border-sky-500/40 shadow-xs flex flex-col justify-between gap-[15px] hover:border-sky-400 dark:hover:border-sky-400 transition-all duration-300"
                      >
                        <div className="space-y-2.5 min-w-0">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-sky-200/80 dark:border-sky-900/40">
                            <div className="subcard-header-sync flex items-center gap-2 text-sky-600 dark:text-sky-400 min-w-0">
                              <WebIcon
                                name="workflow"
                                className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0"
                              />
                              <h5
                                className="typo-h5 subcard-title-synced text-sky-600 dark:text-sky-400 tracking-wide font-play m-0 truncate"
                                data-subcard-title="true"
                              >
                                Trụ Cột Vận Hành
                              </h5>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="project-detail-chip p-2.5 rounded-[12px] border border-sky-200/80 dark:border-sky-700/50 min-w-0">
                              <span className="typo-label font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                                <WebIcon
                                  name="users"
                                  className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300 shrink-0"
                                />
                                <span className="truncate">Con người</span>
                              </span>
                              <p className="typo-label text-[var(--text-secondary)] mt-0.5">
                                Đào tạo, KPI, kỹ năng
                              </p>
                            </div>
                            <div className="project-detail-chip p-2.5 rounded-[12px] border border-sky-200/80 dark:border-sky-700/50 min-w-0">
                              <span className="typo-label font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                                <WebIcon
                                  name="cog"
                                  className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300 shrink-0"
                                />
                                <span className="truncate">Quy trình SOP</span>
                              </span>
                              <p className="typo-label text-[var(--text-secondary)] mt-0.5">
                                SOP & Escalation
                              </p>
                            </div>
                            <div className="project-detail-chip p-2.5 rounded-[12px] border border-sky-200/80 dark:border-sky-700/50 min-w-0">
                              <span className="typo-label font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                                <WebIcon
                                  name="database"
                                  className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300 shrink-0"
                                />
                                <span className="truncate">Công nghệ CRM</span>
                              </span>
                              <p className="typo-label text-[var(--text-secondary)] mt-0.5">
                                Omnichannel & AI
                              </p>
                            </div>
                            <div className="project-detail-chip p-2.5 rounded-[12px] border border-sky-200/80 dark:border-sky-700/50 min-w-0">
                              <span className="typo-label font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                                <WebIcon
                                  name="chart"
                                  className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300 shrink-0"
                                />
                                <span className="truncate">Dữ liệu Realtime</span>
                              </span>
                              <p className="typo-label text-[var(--text-secondary)] mt-0.5">
                                360° Dashboard
                              </p>
                            </div>
                          </div>

                          <div className="typo-label text-[var(--text-secondary)] pt-0.5 leading-relaxed">
                            <strong className="text-sky-700 dark:text-sky-300">Lộ trình:</strong>{' '}
                            {spec.methodology.phases
                              .map((p: any) => p.title)
                              .slice(0, 3)
                              .join(' → ')}
                            ...
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => scrollToSection('sec-methodology')}
                          className="pt-2.5 border-t border-sky-200/70 dark:border-sky-900/40 typo-label font-bold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <span>Xem lộ trình vận hành & các hạng mục</span>
                          <span>↓</span>
                        </button>
                      </div>

                      {/* Branch 4: Kết quả & Giá trị kinh doanh */}
                      <div
                        data-subcard="true"
                        className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border-2 border-emerald-200 dark:border-emerald-500/40 shadow-xs flex flex-col justify-between gap-[15px] hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-300"
                      >
                        <div className="space-y-2.5 min-w-0">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-200/80 dark:border-emerald-900/40">
                            <div className="subcard-header-sync flex items-center gap-2 text-emerald-600 dark:text-emerald-400 min-w-0">
                              <WebIcon
                                name="award"
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                              />
                              <h5
                                className="typo-h5 subcard-title-synced text-emerald-600 dark:text-emerald-400 tracking-wide font-play m-0 truncate"
                                data-subcard-title="true"
                              >
                                Kết Quả Định Lượng
                              </h5>
                            </div>
                          </div>

                          <div className="space-y-1.5 border-l-2 border-dashed border-emerald-300 dark:border-emerald-600/60 pl-2.5">
                            {selectedArticle.star.results.map((res, rIdx) => (
                              <div
                                key={rIdx}
                                className="flex items-start gap-1.5 typo-label text-[var(--text-secondary)] font-medium"
                              >
                                <WebIcon
                                  name="check"
                                  className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"
                                />
                                <span className="leading-snug">{res}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => scrollToSection('sec-metrics')}
                          className="pt-2.5 border-t border-emerald-200/70 dark:border-emerald-900/40 typo-label font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <span>Xem bảng chỉ số KPI, SLA & Giá trị</span>
                          <span>↓</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Image mode view */
                  <div className="space-y-2.5 flex-1 min-h-0 flex flex-col justify-between">
                    <div
                      className="w-full flex-1 min-h-[300px] rounded-[14px] overflow-hidden bg-slate-950 border border-fuchsia-300/60 dark:border-fuchsia-500/30 relative group cursor-pointer shadow-md"
                      onClick={() => onOpenMindmap(selectedArticle)}
                    >
                      <img
                        src={selectedArticle.mindmap || selectedArticle.image}
                        alt={`Sơ đồ tư duy ${selectedArticle.code}`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-slate-900 rounded-[14px]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = selectedArticle.image;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-[15px]">
                        <span className="typo-caption font-bold text-white flex items-center gap-1.5">
                          <WebIcon name="maximize" className="w-4 h-4 text-fuchsia-300" />
                          <span>Nhấp để phóng to toàn màn hình</span>
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white typo-badge font-mono">
                          {selectedArticle.code}
                        </span>
                      </div>
                    </div>
                    <p className="typo-label text-[var(--text-muted)] text-center italic">
                      Bản vẽ kiến trúc hệ thống gốc của dự án {selectedArticle.code}. Bấm vào hình
                      ảnh hoặc nút Phóng to để tương tác kích thước đầy đủ.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 02: TỔNG QUAN DỰ ÁN */}
            <section
              id="sec-overview"
              data-section-card="true"
              data-card-index="1"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 11 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('blue') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('blue') }}
                  >
                    2.
                  </span>
                  <WebIcon
                    name="layers"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('blue') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('blue') }}
                  >
                    Tổng quan dự án
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch">
                  <div
                    data-subcard="true"
                    className="project-detail-subcard min-w-0 lg:col-span-8 p-[15px] rounded-[14px] border border-[var(--border-subcard)] space-y-3 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      {spec.overview.map((para: string, idx: number) => (
                        <p
                          key={idx}
                          className="typo-body-sm text-[var(--text-primary)] leading-relaxed font-medium"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subcard)] flex items-center gap-2 flex-wrap typo-label font-semibold text-[var(--text-secondary)]">
                      <span className="text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                        <WebIcon name="target" className="w-3.5 h-3.5 shrink-0" />
                        <span>Trọng tâm cốt lõi:</span>
                      </span>
                      <span>
                        Kết nối chặt chẽ 4 nguồn lực: Con người · Quy trình · Công nghệ · Dữ liệu
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 lg:col-span-4 rounded-[14px] overflow-hidden border border-blue-200/80 dark:border-blue-500/30 bg-slate-950 relative group shadow-xs flex flex-col justify-between min-h-[190px]">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-[14px] opacity-90 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://i.postimg.cc/fRLM4D4K/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.webp';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent flex flex-col justify-end p-[15px]">
                      <span className="typo-label font-mono font-bold text-cyan-300 tracking-wider">
                        {selectedArticle.groupTitle}
                      </span>
                      <h5 className="typo-h5 text-white leading-tight mt-0.5">
                        {selectedArticle.title.replace(/^[\d.]+\s*·\s*/, '')}
                      </h5>
                    </div>
                  </div>
                </div>

                {/* 4 Trụ Cột Vận Hành Cốt Lõi */}
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] shadow-xs flex flex-col gap-[15px]"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-2 text-blue-600 dark:text-cyan-400 min-w-0">
                      <span className="font-mono typo-h4 text-blue-600 dark:text-cyan-400 shrink-0">
                        04
                      </span>
                      <WebIcon
                        name="layers"
                        className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0"
                      />
                      <h4
                        className="typo-h4 subcard-title-synced text-blue-600 dark:text-cyan-400 m-0 truncate"
                        data-subcard-title="true"
                      >
                        Trụ cột vận hành
                      </h4>
                    </div>
                    <span className="typo-label font-mono font-bold text-[var(--text-muted)] shrink-0">
                      4 Core Pillars
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[15px] items-stretch">
                    {/* Trụ Cột 1 */}
                    <div
                      data-subcard="true"
                      className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border border-sky-200/90 dark:border-sky-500/30 flex flex-col justify-between gap-2.5 shadow-2xs hover:border-sky-400 transition"
                    >
                      <div className="space-y-2">
                        <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-sky-200/70 dark:border-sky-900/40 text-sky-600 dark:text-sky-400">
                          <span className="font-mono typo-h5 text-sky-600 dark:text-sky-400 shrink-0">
                            2.1
                          </span>
                          <WebIcon
                            name="users"
                            className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0"
                          />
                          <h5
                            className="typo-h5 subcard-title-synced text-sky-600 dark:text-sky-400 tracking-wide m-0"
                            data-subcard-title="true"
                          >
                            Con người vận hành
                          </h5>
                        </div>
                        <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                          Cơ cấu tổ chức rõ ràng, phân định trách nhiệm, đào tạo và phát triển đội
                          ngũ chuyên nghiệp.
                        </p>
                      </div>
                      <span className="typo-label font-mono font-bold text-sky-700 dark:text-sky-300 pt-2 border-t border-sky-200/50 dark:border-sky-800/40 block">
                        People & Competency
                      </span>
                    </div>

                    {/* Trụ Cột 2 */}
                    <div
                      data-subcard="true"
                      className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border border-emerald-200/90 dark:border-emerald-500/30 flex flex-col justify-between gap-2.5 shadow-2xs hover:border-emerald-400 transition"
                    >
                      <div className="space-y-2">
                        <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-emerald-200/70 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                          <span className="font-mono typo-h5 text-emerald-600 dark:text-emerald-400 shrink-0">
                            2.2
                          </span>
                          <WebIcon
                            name="workflow"
                            className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                          />
                          <h5
                            className="typo-h5 subcard-title-synced text-emerald-600 dark:text-emerald-400 tracking-wide m-0"
                            data-subcard-title="true"
                          >
                            Quy trình chuẩn hóa
                          </h5>
                        </div>
                        <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                          SOP chuẩn hóa, luồng tiếp nhận, phân loại, giải quyết khiếu nại và ma trận
                          escalation chặt chẽ.
                        </p>
                      </div>
                      <span className="typo-label font-mono font-bold text-emerald-700 dark:text-emerald-300 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/40 block">
                        Process & Standards
                      </span>
                    </div>

                    {/* Trụ Cột 3 */}
                    <div
                      data-subcard="true"
                      className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border border-purple-200/90 dark:border-purple-500/30 flex flex-col justify-between gap-2.5 shadow-2xs hover:border-purple-400 transition"
                    >
                      <div className="space-y-2">
                        <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-purple-200/70 dark:border-purple-900/40 text-purple-600 dark:text-purple-400">
                          <span className="font-mono typo-h5 text-purple-600 dark:text-purple-400 shrink-0">
                            2.3
                          </span>
                          <WebIcon
                            name="headphones"
                            className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0"
                          />
                          <h5
                            className="typo-h5 subcard-title-synced text-purple-600 dark:text-purple-400 tracking-wide m-0"
                            data-subcard-title="true"
                          >
                            Công nghệ tổng đài
                          </h5>
                        </div>
                        <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                          Tổng đài thông minh, CRM 360 độ đa kênh và các công cụ giám sát vận hành
                          thời gian thực.
                        </p>
                      </div>
                      <span className="typo-label font-mono font-bold text-purple-700 dark:text-purple-300 pt-2 border-t border-purple-200/50 dark:border-purple-800/40 block">
                        Tech & Omnichannel
                      </span>
                    </div>

                    {/* Trụ Cột 4 */}
                    <div
                      data-subcard="true"
                      className="project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] border border-amber-200/90 dark:border-amber-500/30 flex flex-col justify-between gap-2.5 shadow-2xs hover:border-amber-400 transition"
                    >
                      <div className="space-y-2">
                        <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-amber-200/70 dark:border-amber-900/40 text-amber-600 dark:text-amber-400">
                          <span className="font-mono typo-h5 text-amber-600 dark:text-amber-400 shrink-0">
                            2.4
                          </span>
                          <WebIcon
                            name="chart"
                            className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
                          />
                          <h5
                            className="typo-h5 subcard-title-synced text-amber-600 dark:text-amber-400 tracking-wide m-0 whitespace-nowrap min-w-0 pr-1"
                            data-subcard-title="true"
                          >
                            Dữ liệu đo lường
                          </h5>
                        </div>
                        <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                          Hệ thống đo lường KPI/SLA minh bạch, báo cáo phân tích nguyên nhân gốc rễ
                          và tối ưu chi phí.
                        </p>
                      </div>
                      <span className="typo-label font-mono font-bold text-amber-700 dark:text-amber-300 pt-2 border-t border-amber-200/50 dark:border-amber-800/40 block">
                        Data & Governance
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 03: BỐI CẢNH THÁCH THỨC */}
            <section
              id="sec-context"
              data-section-card="true"
              data-card-index="2"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 12 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('amber') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('amber') }}
                  >
                    3.
                  </span>
                  <WebIcon
                    name="alert"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('amber') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('amber') }}
                  >
                    Bối cảnh thách thức
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] typo-body-sm text-[var(--text-primary)] leading-relaxed font-semibold shadow-xs"
                >
                  {spec.context.intro}
                </div>

                {/* Diagnostic Challenge Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[15px] items-stretch">
                  {spec.context.challenges.map((chDesc: string, idx: number) => {
                    const palette = CHALLENGE_PALETTES[idx % CHALLENGE_PALETTES.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] ${palette.theme} border shadow-2xs flex flex-col justify-between gap-3 transition duration-200`}
                      >
                        <div className="space-y-2">
                          <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-[var(--border-subcard)]">
                            <span className="font-mono font-bold typo-h5 shrink-0">
                              3.{idx + 1}
                            </span>
                            <WebIcon name={palette.icon} className="w-4 h-4 shrink-0" />
                            <h5
                              className="typo-h5 subcard-title-synced font-semibold tracking-wide m-0"
                              data-subcard-title="true"
                            >
                              {spec.context.challengeTitles?.[idx] || palette.fourWord}
                            </h5>
                          </div>
                          <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                            {chDesc}
                          </p>
                        </div>
                        <span className="typo-label font-mono font-bold text-[var(--text-muted)] pt-2 border-t border-[var(--border-subcard)] block">
                          Thách thức vận hành 3.{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Strategic Conclusion Callout */}
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border-2 border-amber-400/50 typo-body-sm font-bold text-amber-700 dark:text-amber-300 leading-relaxed flex items-start sm:items-center gap-3 shadow-xs"
                >
                  <span className="font-mono font-bold typo-body text-amber-600 dark:text-amber-400 shrink-0">
                    03
                  </span>
                  <WebIcon
                    name="target"
                    className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span className="flex-1 min-w-0 font-semibold">
                    <strong className="text-amber-600 dark:text-amber-400 mr-1.5 font-bold">
                      Giải pháp trọng tâm:
                    </strong>
                    <span className="text-[var(--text-primary)]">{spec.context.conclusion}</span>
                  </span>
                </div>
              </div>
            </section>

            {/* SECTION 04: MỤC TIÊU CHIẾN LƯỢC */}
            <section
              id="sec-objectives"
              data-section-card="true"
              data-card-index="3"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 13 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('teal') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('teal') }}
                  >
                    4.
                  </span>
                  <WebIcon
                    name="target"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('teal') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('teal') }}
                  >
                    Mục tiêu chiến lược
                  </h3>
                </div>
              </div>

              <div className="relative z-10 text-left grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[15px] items-stretch">
                  {spec.objectives.map((obj: any, idx: number) => {
                    const objThemes = [
                      {
                        theme:
                          'border-blue-200/90 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
                        icon: 'building',
                        badge: 'Organizational Goal',
                      },
                      {
                        theme:
                          'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                        icon: 'workflow',
                        badge: 'Operational Excellence',
                      },
                      {
                        theme:
                          'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
                        icon: 'rocket',
                        badge: 'Growth & Scalability',
                      },
                    ];
                    const t = objThemes[idx % objThemes.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] ${t.theme} border shadow-2xs flex flex-col justify-between gap-[15px] transition duration-200 ${
                          idx === spec.objectives.length - 1 && spec.objectives.length % 2 !== 0
                            ? 'md:col-span-2 xl:col-span-1'
                            : ''
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[var(--border-subcard)] flex-wrap">
                            <div className="subcard-header-sync flex items-center gap-2 min-w-0">
                              <span className="font-mono font-bold typo-h4 shrink-0">
                                4.{idx + 1}
                              </span>
                              <WebIcon name={t.icon} className="w-4 h-4 shrink-0" />
                              <h4
                                className="typo-h4 subcard-title-synced tracking-wide m-0"
                                data-subcard-title="true"
                              >
                                {obj.title.replace(/^\d+\.\d+\.\s*/, '')}
                              </h4>
                            </div>
                            <span className="typo-label font-mono font-bold opacity-80 shrink-0">
                              {t.badge}
                            </span>
                          </div>

                          <ul className="space-y-2">
                            {obj.items.map((sub: string, sIdx: number) => (
                              <li
                                key={sIdx}
                                className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium flex items-start gap-2"
                              >
                                <WebIcon
                                  name="check"
                                  className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80"
                                />
                                <span>{sub}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subcard)] typo-label font-mono font-bold text-[var(--text-muted)] text-right">
                          Mục tiêu 0{idx + 1} / {spec.objectives.length}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* SECTION 05: HẠNG MỤC TRIỂN KHAI */}
            <section
              id="sec-scope"
              data-section-card="true"
              data-card-index="4"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 14 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('purple') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('purple') }}
                  >
                    5.
                  </span>
                  <WebIcon
                    name="clipboard"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('purple') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('purple') }}
                  >
                    Hạng mục triển khai
                  </h3>
                </div>
              </div>

              <div className="relative z-10 text-left grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-stretch">
                  {spec.scopeItems.map((scopeItem: any, idx: number) => {
                    const palette = SCOPE_PALETTES[idx % SCOPE_PALETTES.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] rounded-[14px] ${palette.theme} border shadow-2xs flex flex-col justify-between gap-3 transition duration-200 ${
                          idx === spec.scopeItems.length - 1 && spec.scopeItems.length % 2 !== 0
                            ? 'lg:col-span-2'
                            : ''
                        }`}
                      >
                        <div className="space-y-3 min-w-0">
                          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subcard)] flex-wrap gap-2">
                            <div className="subcard-header-sync flex items-center gap-2 min-w-0">
                              <span className="font-mono font-bold typo-h4 shrink-0">
                                5.{idx + 1}
                              </span>
                              <WebIcon name={palette.icon} className="w-4 h-4 shrink-0" />
                              <h4
                                className="typo-h4 subcard-title-synced tracking-wide m-0"
                                data-subcard-title="true"
                              >
                                {scopeItem.title || scopeItem.code}
                              </h4>
                            </div>
                            <span className="project-detail-chip typo-badge font-mono font-bold px-2.5 py-0.5 rounded-full border border-[var(--border-subcard)] shrink-0">
                              {scopeItem.code}
                            </span>
                          </div>

                          <p className="typo-caption text-[var(--text-secondary)] font-semibold leading-relaxed">
                            {scopeItem.intro}
                          </p>

                          {/* Nhiệm vụ triển khai (phân tách tinh gọn bằng đường kẻ mảnh, không lồng card) */}
                          <div className="pt-2.5 border-t border-[var(--border-subcard)] space-y-2">
                            <p className="typo-label font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                              <WebIcon name="list" className="w-3.5 h-3.5 opacity-80 shrink-0" />
                              <span>Nhiệm vụ triển khai trọng tâm:</span>
                            </p>
                            <ul className="space-y-1.5">
                              {scopeItem.tasks.map((task: string, tIdx: number) => (
                                <li
                                  key={tIdx}
                                  className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium flex items-start gap-2"
                                >
                                  <WebIcon
                                    name="check"
                                    className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80"
                                  />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {scopeItem.note && (
                            <p className="typo-caption italic text-[var(--text-secondary)] pt-2 border-t border-dashed border-[var(--border-subcard)] flex items-start gap-1.5">
                              <WebIcon
                                name="sparkles"
                                className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80"
                              />
                              <span>{scopeItem.note}</span>
                            </p>
                          )}
                        </div>

                        {/* Highlighted Deliverable Footer */}
                        <div className="pt-2.5 border-t border-[var(--border-subcard)] flex items-start gap-2 typo-caption mt-auto">
                          <WebIcon
                            name="award"
                            className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                          />
                          <div className="min-w-0">
                            <strong className="font-bold text-emerald-600 dark:text-emerald-400 mr-1.5">
                              Kết quả đầu ra:
                            </strong>
                            <span className="font-medium text-[var(--text-primary)]">
                              {scopeItem.deliverable}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* SECTION 06: LỘ TRÌNH VẬN HÀNH */}
            <section
              id="sec-methodology"
              data-section-card="true"
              data-card-index="5"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 15 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('cyan') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('cyan') }}
                  >
                    6.
                  </span>
                  <WebIcon
                    name="workflow"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('cyan') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('cyan') }}
                  >
                    Lộ trình vận hành
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] typo-body-sm text-[var(--text-primary)] font-semibold leading-relaxed shadow-xs"
                >
                  {spec.methodology.intro}
                </div>

                {/* Process Timeline: Thoáng rộng 1 -> 2 -> 3 cột thay vì ép 5 cột */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[15px] items-stretch">
                  {spec.methodology.phases.map((ph: any, idx: number) => {
                    const phasePalettes = [
                      {
                        theme:
                          'border-blue-200/90 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
                        icon: 'search',
                      },
                      {
                        theme:
                          'border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
                        icon: 'workflow',
                      },
                      {
                        theme:
                          'border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
                        icon: 'shield-check',
                      },
                      {
                        theme:
                          'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                        icon: 'chart',
                      },
                      {
                        theme:
                          'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
                        icon: 'trending-up',
                      },
                    ];
                    const p = phasePalettes[idx % phasePalettes.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] gap-[15px] rounded-[14px] ${p.theme} border shadow-2xs flex flex-col justify-between transition duration-200`}
                      >
                        <div className="space-y-2">
                          <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-[var(--border-subcard)]">
                            <span className="font-mono font-bold typo-h5 shrink-0">
                              6.{idx + 1}
                            </span>
                            <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                            <h5
                              className="typo-h5 subcard-title-synced font-semibold tracking-wide leading-tight m-0"
                              data-subcard-title="true"
                            >
                              {ph.title}
                            </h5>
                          </div>
                          <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                            {ph.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subcard)] flex items-center justify-between gap-2 typo-label font-mono font-bold opacity-80 mt-auto">
                          <span className="truncate">{ph.stage}</span>
                          <span className="shrink-0">Phase {idx + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {spec.methodology.outro && (
                  <div
                    data-subcard="true"
                    className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] flex items-start sm:items-center gap-[15px]"
                  >
                    <WebIcon
                      name="target"
                      className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 sm:mt-0"
                    />
                    <p className="typo-caption italic text-[var(--text-secondary)] leading-relaxed font-medium">
                      {spec.methodology.outro}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 07: CHỈ SỐ HIỆU QUẢ */}
            <section
              id="sec-metrics"
              data-section-card="true"
              data-card-index="6"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 16 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('emerald') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('emerald') }}
                  >
                    7.
                  </span>
                  <WebIcon
                    name="chart"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('emerald') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('emerald') }}
                  >
                    Chỉ số hiệu quả
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] typo-body-sm text-[var(--text-primary)] font-semibold leading-relaxed shadow-xs"
                >
                  {spec.metrics.intro}
                </div>

                {/* KPI Categories Grid Cards: 1 -> 2 -> 3 cột thoáng rộng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[15px] items-stretch">
                  {spec.metrics.table.map((m: any, idx: number) => {
                    const metricPalettes = [
                      {
                        theme:
                          'border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
                        icon: 'phone',
                      },
                      {
                        theme:
                          'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                        icon: 'clock',
                      },
                      {
                        theme:
                          'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
                        icon: 'award',
                      },
                      {
                        theme:
                          'border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
                        icon: 'target',
                      },
                      {
                        theme:
                          'border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400',
                        icon: 'alert',
                      },
                      {
                        theme:
                          'border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
                        icon: 'users',
                      },
                      {
                        theme:
                          'border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
                        icon: 'shield-check',
                      },
                    ];
                    const p = metricPalettes[idx % metricPalettes.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] gap-[15px] rounded-[14px] ${p.theme} border shadow-2xs flex flex-col justify-between transition duration-200`}
                      >
                        <div className="space-y-2.5">
                          <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-[var(--border-subcard)]">
                            <span className="font-mono font-bold typo-h5 shrink-0">
                              7.{idx + 1}
                            </span>
                            <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                            <h5
                              className="typo-h5 subcard-title-synced font-semibold tracking-wide leading-tight m-0"
                              data-subcard-title="true"
                            >
                              {m.category}
                            </h5>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {m.indicators
                              .split(/[,;·]/)
                              .filter(Boolean)
                              .map((ind: string, iIdx: number) => (
                                <span
                                  key={iIdx}
                                  className="project-detail-chip px-2.5 py-0.5 rounded-full border border-[var(--border-subcard)] text-[var(--text-primary)] font-bold typo-badge"
                                >
                                  {ind.trim()}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subcard)] typo-label font-mono font-bold opacity-80 flex items-center justify-between gap-2 mt-auto">
                          <span className="truncate">{m.category}</span>
                          <span className="shrink-0">Nhóm 7.{idx + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {spec.metrics.outro && (
                  <div
                    data-subcard="true"
                    className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] flex items-start sm:items-center gap-[15px]"
                  >
                    <WebIcon
                      name="chart"
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0"
                    />
                    <p className="typo-caption italic text-[var(--text-secondary)] leading-relaxed font-medium">
                      {spec.metrics.outro}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 08: VAI TRÒ TRÁCH NHIỆM */}
            <section
              id="sec-roles"
              data-section-card="true"
              data-card-index="7"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 17 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('rose') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('rose') }}
                  >
                    8.
                  </span>
                  <WebIcon
                    name="users"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('rose') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('rose') }}
                  >
                    Vai trò trách nhiệm
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] typo-body-sm text-[var(--text-primary)] font-semibold leading-relaxed shadow-xs"
                >
                  {spec.pmRoles.intro}
                </div>

                {/* Leadership Roles: 1 -> 2 -> 3 cột dễ đọc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[15px] items-stretch">
                  {spec.pmRoles.items.map((r: any, idx: number) => {
                    const rolePalettes = [
                      {
                        theme:
                          'border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
                        icon: 'compass',
                      },
                      {
                        theme:
                          'border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
                        icon: 'users',
                      },
                      {
                        theme:
                          'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
                        icon: 'sliders',
                      },
                      {
                        theme:
                          'border-cyan-200/90 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
                        icon: 'network',
                      },
                      {
                        theme:
                          'border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
                        icon: 'trending-up',
                      },
                      {
                        theme:
                          'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                        icon: 'workflow',
                      },
                      {
                        theme:
                          'border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400',
                        icon: 'shield-check',
                      },
                    ];
                    const p = rolePalettes[idx % rolePalettes.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] gap-[15px] rounded-[14px] ${p.theme} border shadow-2xs flex flex-col justify-between transition duration-200`}
                      >
                        <div className="space-y-2">
                          <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-[var(--border-subcard)]">
                            <span className="font-mono font-bold typo-h5 shrink-0">
                              8.{idx + 1}
                            </span>
                            <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                            <h5
                              className="typo-h5 subcard-title-synced font-semibold tracking-wide leading-tight m-0"
                              data-subcard-title="true"
                            >
                              {r.role}
                            </h5>
                          </div>
                          <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                            {r.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subcard)] flex items-center justify-between gap-2 typo-label font-mono font-bold opacity-80 mt-auto">
                          <span className="truncate">{r.role}</span>
                          <span className="shrink-0">Vai trò 8.{idx + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 09: KẾT QUẢ ĐẠT ĐƯỢC */}
            <section
              id="sec-outcomes"
              data-legacy-id="projects-results-card"
              data-section-card="true"
              data-card-index="8"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 18 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('teal') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('teal') }}
                  >
                    9.
                  </span>
                  <WebIcon
                    name="award"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('teal') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('teal') }}
                  >
                    Kết quả đạt được
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] typo-body-sm text-[var(--text-primary)] font-semibold leading-relaxed shadow-xs"
                >
                  {spec.expectedOutcomes.intro}
                </div>

                {/* Value Outcomes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[15px] items-stretch">
                  {spec.expectedOutcomes.items.map((item: any, idx: number) => {
                    const outcomePalettes = [
                      {
                        theme:
                          'border-indigo-200/90 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
                        icon: 'building',
                      },
                      {
                        theme:
                          'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                        icon: 'workflow',
                      },
                      {
                        theme:
                          'border-purple-200/90 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
                        icon: 'award',
                      },
                      {
                        theme:
                          'border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
                        icon: 'database',
                      },
                      {
                        theme:
                          'border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400',
                        icon: 'heart',
                      },
                      {
                        theme:
                          'border-amber-200/90 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
                        icon: 'trending-up',
                      },
                    ];
                    const p = outcomePalettes[idx % outcomePalettes.length];
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={`project-detail-subcard min-w-0 h-full p-[15px] gap-[15px] rounded-[14px] ${p.theme} border shadow-2xs flex flex-col justify-between transition duration-200`}
                      >
                        <div className="space-y-2">
                          <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-[var(--border-subcard)]">
                            <span className="font-mono font-bold typo-h5 shrink-0">
                              9.{idx + 1}
                            </span>
                            <WebIcon name={p.icon} className="w-4 h-4 shrink-0" />
                            <h5
                              className="typo-h5 subcard-title-synced font-semibold tracking-wide leading-tight m-0"
                              data-subcard-title="true"
                            >
                              {item.dimension}
                            </h5>
                          </div>
                          <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-subcard)] flex items-center justify-between gap-2 typo-label font-mono font-bold opacity-80 mt-auto">
                          <span>Giá trị 0{idx + 1}</span>
                          <span>Đã nghiệm thu ✓</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {spec.expectedOutcomes.outro && (
                  <div
                    data-subcard="true"
                    className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] flex items-start sm:items-center gap-[15px]"
                  >
                    <WebIcon
                      name="award"
                      className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 sm:mt-0"
                    />
                    <p className="typo-caption italic text-[var(--text-secondary)] leading-relaxed font-medium">
                      {spec.expectedOutcomes.outro}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 10: TRIẾT LÝ QUẢN TRỊ */}
            <section
              id="sec-philosophy"
              data-section-card="true"
              data-card-index="9"
              style={{ ...sectionCardStyle, top: '0px', zIndex: 19 }}
              className="project-detail-section-card u223-c relative overflow-hidden w-full p-[15px] rounded-[14px] flex flex-col gap-[15px] shrink-0"
            >
              <span className="u223-art pointer-events-none select-none" aria-hidden="true" />

              <div className="relative z-10 shrink-0 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)]">
                <div
                  className="card-header-sync flex items-center gap-2.5 min-w-0"
                  style={{ color: getCardAccentColor('violet') }}
                >
                  <span
                    className="font-mono font-bold typo-h3 shrink-0"
                    style={{ color: getCardAccentColor('violet') }}
                  >
                    10.
                  </span>
                  <WebIcon
                    name="sparkles"
                    className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ color: getCardAccentColor('violet') }}
                  />
                  <h3
                    className="typo-h3 card-title-synced font-play tracking-wide m-0 truncate"
                    data-card-title="true"
                    style={{ color: getCardAccentColor('violet') }}
                  >
                    Triết lý quản trị
                  </h3>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-[15px] text-left">
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border border-[var(--border-subcard)] flex flex-col gap-3 shadow-xs"
                >
                  {spec.philosophy.paragraphs.map((p: string, idx: number) => (
                    <p
                      key={idx}
                      className="typo-body-sm text-[var(--text-primary)] leading-relaxed font-medium"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* 3 Philosophy Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px] items-stretch">
                  {[
                    {
                      num: '10.1',
                      icon: 'cpu',
                      fourWord: 'Công nghệ tốc độ',
                      desc: 'Công nghệ và hệ thống tự động giúp tăng tốc độ phục vụ, tối ưu nguồn lực và kết nối thông suốt đa kênh.',
                      theme:
                        'border-sky-200/90 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
                    },
                    {
                      num: '10.2',
                      icon: 'workflow',
                      fourWord: 'Quy trình nhất quán',
                      desc: 'Chuẩn hóa quy trình SOP và tiêu chuẩn dịch vụ tạo ra chất lượng đồng nhất, hạn chế tối đa rủi ro và sai sót.',
                      theme:
                        'border-emerald-200/90 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                    },
                    {
                      num: '10.3',
                      icon: 'heart',
                      fourWord: 'Con người trọng tâm',
                      desc: 'Chính con người, văn hóa đồng cảm và sự tận tâm mới quyết định sự gắn kết trung thành dài lâu của khách hàng.',
                      theme:
                        'border-rose-200/90 dark:border-rose-500/30 text-rose-600 dark:text-rose-400',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      data-subcard="true"
                      className={`project-detail-subcard min-w-0 h-full p-[15px] gap-[15px] rounded-[14px] ${item.theme} border shadow-2xs flex flex-col justify-between transition duration-200`}
                    >
                      <div className="space-y-2">
                        <div className="subcard-header-sync flex items-center gap-2 pb-1.5 border-b border-[var(--border-subcard)]">
                          <span className="font-mono font-bold typo-h5 shrink-0">{item.num}</span>
                          <WebIcon name={item.icon} className="w-4 h-4 shrink-0" />
                          <h5
                            className="typo-h5 subcard-title-synced font-semibold tracking-wide leading-tight m-0"
                            data-subcard-title="true"
                          >
                            {item.fourWord}
                          </h5>
                        </div>
                        <p className="typo-caption text-[var(--text-secondary)] leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subcard)] typo-label font-mono font-bold opacity-80 text-right mt-auto">
                        Trụ cột 0{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Golden Core Message Box */}
                <div
                  data-subcard="true"
                  className="project-detail-subcard p-[15px] rounded-[14px] border-2 border-purple-400/60 flex flex-col gap-3 shadow-xs"
                >
                  <span className="typo-h5 font-mono font-bold tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <WebIcon
                      name="sparkles"
                      className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0"
                    />
                    <span>Thông điệp cốt lõi từ lãnh đạo dự án:</span>
                  </span>
                  <p className="typo-body font-semibold text-[var(--text-heading,var(--text-primary))] italic leading-relaxed">
                    “{spec.philosophy.coreMessage}”
                  </p>
                  <div className="text-right typo-caption font-bold text-purple-700 dark:text-purple-300">
                    — {selectedArticle.role}
                  </div>
                </div>
              </div>
            </section>
        </div>
      )}

      {/* 2. KHỐI BANNER DỌC MỤC LỤC BÊN PHẢI (Chiều cao khớp thẻ bài viết ở mọi kích thước) */}
      {spec && (
        <aside
          ref={bannerRef}
          id="project-detail-banner"
          data-banner-aspect="sidebar"
          data-banner-orientation="vertical"
          data-element-name="Banner dọc Mục lục dự án"
          data-element-type="banner-card"
          data-section-card="true"
          data-theme-synced="true"
          className="order-2 banner-card bento-card glass-card shrink-0 h-full min-h-0 max-h-full self-stretch flex flex-col pointer-events-auto rounded-[var(--radius-card,var(--radius-global,14px))] p-[15px] gap-2.5 overflow-hidden relative group"
        >
          {/* Nội dung phân tách trực tiếp trên Mục lục dọc (chỉ giữ nút nổi X ở góc trên phải, chừa pr-10 cho dòng đầu tiên) */}
          <div
            className="relative z-10 pr-10 typo-label font-bold leading-snug break-words shrink-0"
            style={{
              color: isStrategy
                ? 'var(--accent-blue, var(--text-link, var(--color-primary)))'
                : 'var(--accent-purple, var(--text-accent, var(--color-primary)))',
            }}
          >
            {selectedArticle.groupTitle}
          </div>

          <h4
            className="relative z-10 typo-h4 font-play font-bold flex items-start gap-1.5 leading-snug break-words m-0 shrink-0"
            data-card-title="true"
            style={{
              color: isStrategy
                ? 'var(--accent-sky, var(--text-heading, var(--text-primary)))'
                : 'var(--accent-fuchsia, var(--text-heading, var(--text-primary)))',
            }}
          >
            <WebIcon
              name="brain"
              className="w-4 h-4 shrink-0 mt-0.5 bg-transparent border-0 p-0 shadow-none"
              style={{
                color: isStrategy
                  ? 'var(--accent-sky, var(--text-link, var(--color-primary)))'
                  : 'var(--accent-fuchsia, var(--text-accent, var(--color-primary)))',
              }}
            />
            <span className="min-w-0">{selectedArticle.title}</span>
          </h4>

          <div
            className="relative z-10 typo-caption font-semibold text-[var(--text-primary)] leading-snug break-words shrink-0"
          >
            Vai trò:{' '}
            <strong
              style={{
                color: isStrategy
                  ? 'var(--accent-sky, var(--text-link, var(--color-primary)))'
                  : 'var(--accent-purple, var(--text-accent, var(--color-primary)))',
              }}
            >
              {selectedArticle.role}
            </strong>
          </div>

          {/* Thanh tiến độ đọc 10 phần */}
          <div className="relative z-10 w-full h-1.5 rounded-full bg-[var(--border-subcard,var(--color-border-soft))] overflow-hidden shrink-0">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${tocProgressPercent}%`,
                background: 'var(--bg-button-primary, var(--color-primary))',
              }}
            />
          </div>

          {/* Danh sách 10 mục lục điều hướng xếp dọc */}
          <nav
            aria-label="Mục lục chi tiết dự án"
            className="relative z-10 flex flex-1 min-h-0 overflow-y-auto glass-scrollbar rounded-[var(--radius-subcard,12px)] flex-col gap-1.5 pr-0.5"
          >
            {TOC_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const itemTheme = SECTION_COLORS[item.color] || SECTION_COLORS.blue;
              const itemColor = isLightMode ? itemTheme.light : itemTheme.dark;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  data-active={isActive ? 'true' : 'false'}
                  style={isActive ? undefined : { color: itemColor }}
                  className={`project-detail-toc-btn w-full text-left px-2.5 py-2 rounded-[var(--radius-subcard,12px)] typo-label font-bold font-play tracking-wide transition-all cursor-pointer flex items-center justify-between gap-1.5 shrink-0 ${
                    isActive ? 'shadow-md' : 'hover:brightness-105 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    <span
                      className="font-mono font-bold typo-label tabular-nums shrink-0"
                      style={{ color: isActive ? 'var(--text-button-primary, #ffffff)' : itemColor }}
                    >
                      {item.num}
                    </span>
                    <span
                      className="shrink-0 flex items-center"
                      style={{ color: isActive ? 'var(--text-button-primary, #ffffff)' : itemColor }}
                    >
                      <WebIcon name={item.icon} className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className="truncate font-play font-bold"
                      style={{ color: isActive ? 'var(--text-button-primary, #ffffff)' : itemColor }}
                    >
                      {item.title}
                    </span>
                  </div>
                  {isActive && (
                    <WebIcon
                      name="chevron-right"
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: 'var(--text-button-primary, #ffffff)' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </div>
  );
};
