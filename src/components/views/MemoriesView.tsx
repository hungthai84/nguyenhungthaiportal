'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import {
  MEMORIES_DATA,
  MEMORIES_COMPANIES,
  MEMORIES_CATEGORIES,
} from '@/data/memories';
import { MemoryPhoto } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { cn, formatCardTitle } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';

export interface MemoriesViewProps {
  currentTheme?: string;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ currentTheme = 'rainbow-glass' }) => {
  const { showToast } = useToast();
  const { isDark: themeIsDark } = useTheme();
  const isDark = themeIsDark || currentTheme.includes('dark');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [activeLightboxIdx, setActiveLightboxIdx] = useState<number | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCompanyDropdownOpen(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMemories = MEMORIES_DATA.filter((item) => {
    if (/logo_|_logo|\/logo\//i.test(item.imageUrl || '')) return false;
    if (companyFilter !== 'all' && item.companyId !== companyFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.titleVi.toLowerCase().includes(q) ||
        item.descVi.toLowerCase().includes(q) ||
        item.year.toLowerCase().includes(q) ||
        item.locationVi.toLowerCase().includes(q) ||
        item.tagVi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activePhoto: MemoryPhoto | null =
    activeLightboxIdx !== null ? filteredMemories[activeLightboxIdx] || null : null;

  // Auto-scroll active photo thumbnail into view in lightbox filmstrip
  useEffect(() => {
    if (activeLightboxIdx !== null && filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[activeLightboxIdx] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeLightboxIdx]);

  // Slideshow timer
  useEffect(() => {
    if (!isSlideshowPlaying || activeLightboxIdx === null || filteredMemories.length <= 1) return;
    const interval = setInterval(() => {
      setActiveLightboxIdx((prev) =>
        prev !== null ? (prev < filteredMemories.length - 1 ? prev + 1 : 0) : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isSlideshowPlaying, activeLightboxIdx, filteredMemories.length]);

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIdx === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIdx(null);
        setIsSlideshowPlaying(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIdx((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : filteredMemories.length - 1) : 0
        );
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIdx((prev) =>
          prev !== null ? (prev < filteredMemories.length - 1 ? prev + 1 : 0) : 0
        );
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsSlideshowPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIdx, filteredMemories.length]);

  const handleShareLink = () => {
    if (activePhoto) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(activePhoto.imageUrl);
        showToast('Đã sao chép liên kết ảnh vào clipboard!');
      } else {
        showToast(`Liên kết ảnh: ${activePhoto.imageUrl}`);
      }
    }
  };

  const handleResetFilters = () => {
    setCompanyFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    showToast('Đã đặt lại toàn bộ bộ lọc');
  };

  return (
    <div
      id="memories-page-container"
      data-element-name="Trang Kỷ Niệm & Thư Thư"
      data-element-type="container"
      data-element-page="memories"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="memories-cards-track"
        data-element-name="Track căn giữa Kỷ Niệm"
        data-element-type="container"
        data-element-page="memories"
        data-element-parent="memories-page-container"
        className="page-cards-track"
      >
        <div
          id="memories-main-card"
          data-main-card="true"
          data-element-name="Thẻ chính Trang Kỷ Niệm"
          data-element-type="card"
          data-element-page="memories"
          data-element-parent="memories-cards-track"
          className="page-main-card flex flex-col justify-start p-[15px] gap-[15px] rounded-[14px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
      {/* Style for crisp bright image, smooth zoom & fly-up animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes flyUpMemories {
              0% {
                opacity: 0;
                transform: translateY(40px) scale(0.96);
              }
              65% {
                opacity: 0.95;
                transform: translateY(-3px) scale(1.01);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .memory-photo-item {
              animation: flyUpMemories 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
              will-change: transform, opacity;
            }
            .memory-crisp-img {
              filter: brightness(1.06) contrast(1.06) saturate(1.06);
              image-rendering: -webkit-optimize-contrast;
            }
          `,
        }}
      />

      {/* BANNER KỶ NIỆM: Format chuẩn 100% theo phong cách banner Wallpaper (h-200px, p-[15px], bo cong 14px) */}
      <motion.div
        id="memories-hero-banner"
        data-element-name="Banner card"
        data-element-type="banner-card"
        data-element-page="memories"
        data-section-card="true"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 24px)' }}
      >
        <div
          className="project-detail-banner-media absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            borderRadius: 'var(--radius-banner, 24px)',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591947/K%E1%BB%B7_ni%E1%BB%87m.png"
            alt="Khoảnh khắc kỷ niệm"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center rounded-[14px] transition-all duration-700"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[14px] z-0" />

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon
              name="camera"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none"
              style={{ width: '22px', height: '22px' }}
            />
            <h1
              className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
              data-card-title="true"
              style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
            >
              Khoảnh khắc kỷ niệm
            </h1>
          </div>
          <p
            className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
            style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 600, fontStyle: 'normal' }}
          >
            &quot;Mỗi khoảnh khắc là một mảnh ghép tự hào của hành trình ♡&quot;
          </p>
        </div>

        {/* Nhóm bộ lọc bên trái + Ô tìm kiếm nhanh bên phải */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto w-full" ref={filterMenuRef}>
          <div className="flex flex-wrap items-center gap-2">
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterDropdownOpen((prev) => !prev);
              }}
              className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-play active:scale-95 group"
              title="Bộ lọc kỷ niệm"
              aria-label="Bộ lọc kỷ niệm"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="listbox"
            >
              <WebIcon name="sliders" className="w-4 h-4 text-[var(--text-primary)] shrink-0" />
              <span>Bộ lọc kỷ niệm</span>
              {(categoryFilter !== 'all' || companyFilter !== 'all') && (
                <span className="banner-count-pill px-2 py-0.5 rounded-full typo-badge font-mono">
                  {categoryFilter !== 'all'
                    ? MEMORIES_CATEGORIES.find((c) => c.id === categoryFilter)?.labelVi
                    : MEMORIES_COMPANIES.find((c) => c.id === companyFilter)?.labelVi}
                </span>
              )}
              <WebIcon
                name="chevron-down"
                className={cn(
                  'w-3.5 h-3.5 text-[var(--text-primary)] transition-transform duration-200 shrink-0',
                  isFilterDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.div
                  id="memories-filter-listbox"
                  data-element-type="card"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  role="listbox"
                  className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full max-h-80 overflow-y-auto no-scrollbar rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                >
                  <div className="px-2.5 py-1 typo-label font-mono tracking-wider text-[var(--text-heading,var(--text-primary))]">
                    Theo chủ đề kỷ niệm
                  </div>
                  {MEMORIES_CATEGORIES.map((cat) => {
                    const active = categoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-selected={active ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playTap();
                          setCategoryFilter(cat.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span>{cat.labelVi}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}

                  <div className="my-1 border-t border-[var(--border-subcard)]" />
                  <div className="px-2.5 py-1 typo-label font-mono tracking-wider text-[var(--text-heading,var(--text-primary))]">
                    Theo đơn vị công tác
                  </div>
                  {MEMORIES_COMPANIES.map((comp) => {
                    const isActive = companyFilter === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        data-selected={isActive ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playTap();
                          setCompanyFilter(comp.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span className="truncate">{comp.labelVi}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset filter button nếu có filter */}
          {(categoryFilter !== 'all' || companyFilter !== 'all' || searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="banner-control-pill px-3 py-1.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white typo-button font-play transition-all cursor-pointer shadow-xs active:scale-95"
            >
              ✕ Đặt lại
            </button>
          )}
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end ml-auto max-w-full sm:max-w-[300px]">
            <div className="relative flex-1 sm:w-52">
              <WebIcon
                name="search"
                className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kỷ niệm, địa điểm, năm..."
                aria-label="Tìm kiếm ảnh kỷ niệm"
                className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-input font-play focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <WebIcon name="cancel" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Vùng Album Hình Ảnh Pinterest Masonry — Ảnh lấp đầy thẻ, rê chuột mới hiện chi tiết */}
      <div className="w-full flex-grow relative min-h-[360px]">
        {filteredMemories.length === 0 ? (
          <div
            id="memories-empty-card"
            data-element-type="card"
            className="bento-card glass-card w-full py-16 px-6 rounded-[14px] text-center flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-[14px] bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <WebIcon name="camera" className="w-6 h-6" />
            </div>
            <p className="typo-h4 text-[var(--text-heading)]">Không tìm thấy ảnh kỷ niệm phù hợp với bộ lọc.</p>
            <p className="typo-caption text-[var(--text-secondary)]">Hãy thử chọn lại công ty hoặc chủ đề khác.</p>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{ background: 'var(--bg-button-primary)' }}
              className="px-4 py-2 rounded-full text-white typo-button shadow hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>↻ Đặt lại bộ lọc</span>
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-[15px] text-left">
            {filteredMemories.map((item, idx) => (
              <div
                id={`memory-card-${item.id}`}
                data-element-name={`Thẻ kỷ niệm: ${item.titleVi}`}
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  SoundEngine.playTap();
                  setActiveLightboxIdx(idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    SoundEngine.playTap();
                    setActiveLightboxIdx(idx);
                  }
                }}
                data-media-card="image"
                style={{
                  animationDelay: `${(idx % 16) * 35}ms`,
                  borderRadius: 'var(--radius-card, 14px)',
                  minHeight: '250px',
                  padding: '1px',
                  cursor: 'pointer',
                }}
                className={cn(
                  'themed-image-card memory-photo-item break-inside-avoid mb-[15px] relative rounded-[14px] overflow-hidden block group transition-all duration-300 hover:-translate-y-1'
                )}
              >
                {/* HÌNH ẢNH NẰM GỌN TRONG CARD VỚI PADDING 1PX */}
                <img
                  src={item.imageUrl}
                  alt={item.titleVi}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.backgroundImage =
                        'linear-gradient(135deg, rgba(15,23,42,0.55) 0%, rgba(30,41,59,0.75) 100%)';
                    }
                  }}
                  style={{ borderRadius: 'calc(var(--radius-card, 14px) - 1px)' }}
                  className="memory-crisp-img w-full h-auto min-h-[250px] max-h-[440px] object-cover block transition-opacity duration-300"
                />

                {/* LỚP PHỦ THEO GIAO DIỆN ĐANG CHỌN — CHỈ HIỆN KHI RÊ CHUỘT */}
                <div
                  style={{ inset: '1px', borderRadius: 'calc(var(--radius-card, 14px) - 1px)' }}
                  className="themed-image-card-scrim absolute pointer-events-none z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
                />

                {/* TIÊU ĐỀ & CÁC ĐỐI TƯỢNG TRONG CARD (PADDING 15PX, CHỈ HIỆN KHI OVER MOUSE) */}
                <div
                  id={`memory-card-content-${item.id}`}
                  style={{ padding: '15px' }}
                  className="themed-image-card-overlay absolute inset-0 z-20 w-full h-full flex flex-col justify-between gap-2 p-[15px] opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
                >
                  {/* Badge năm & tag */}
                  <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-none">
                    <span className="themed-image-card-badge typo-badge font-mono tracking-wide px-2.5 py-0.5 rounded-full">
                      {item.tagVi}
                    </span>
                    <span className="themed-image-card-badge typo-badge font-mono px-2.5 py-0.5 rounded-full">
                      {item.year}
                    </span>
                  </div>

                  {/* Tiêu đề & chi tiết */}
                  <div className="relative z-10 flex flex-col justify-end min-w-0">
                    <span className="themed-image-card-kicker typo-label font-mono capitalize tracking-wide block">
                      {item.companyId}
                    </span>
                    <h3
                      className="themed-image-card-title typo-h4 card-header-sync card-title-synced break-words line-clamp-2 mt-0.5 flex items-center gap-1.5"
                      data-card-title="true"
                    >
                      <WebIcon name="camera" className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatCardTitle(item.titleVi)}</span>
                    </h3>
                    <p className="themed-image-card-subtext typo-caption break-words mt-1 line-clamp-2">
                      {item.descVi}
                    </p>
                    <div className="themed-image-card-divider themed-image-card-subtext flex items-center justify-between mt-2 pt-1.5 border-t typo-label font-mono">
                      <span className="flex items-center gap-1 truncate">
                        <WebIcon name="location" className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.locationVi}</span>
                      </span>
                      {item.teamSize && (
                        <span className="themed-image-card-kicker font-bold shrink-0 ml-2">
                          {item.teamSize}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>

      {/* 3. Lightbox Modal với Slideshow & Filmstrip */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Xem ảnh kỷ niệm: ${activePhoto.titleVi}`}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5"
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 6px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
          }}
          onClick={() => {
            setActiveLightboxIdx(null);
            setIsSlideshowPlaying(false);
          }}
        >
          <div
            id="memories-lightbox-card"
            data-element-type="card"
            className="theme-modal-card w-full max-w-6xl max-h-[94vh] overflow-y-auto no-scrollbar rounded-[14px] flex flex-col relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ảnh lớn & Điều khiển */}
            <div
              className={cn(
                'relative w-full h-72 sm:h-[460px] md:h-[520px] rounded-[14px] flex items-center justify-center overflow-hidden',
                isDark ? 'bg-[#0B1220]' : 'bg-slate-100'
              )}
            >
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.titleVi}
                className="w-full h-full object-contain rounded-[14px] select-none"
              />
              <div
                className={cn(
                  'absolute inset-0 pointer-events-none',
                  isDark
                    ? 'bg-gradient-to-t from-[#111827] via-transparent to-[#0B1220]/60'
                    : 'bg-gradient-to-t from-slate-900/75 via-transparent to-slate-900/20'
                )}
              />

              {/* Nút lùi */}
              <button
                type="button"
                onClick={() =>
                  setActiveLightboxIdx((prev) =>
                    prev !== null ? (prev > 0 ? prev - 1 : filteredMemories.length - 1) : 0
                  )
                }
                title="Ảnh trước (Mũi tên trái)"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111827]/80 hover:bg-emerald-600 text-white transition-all border border-white/20 shadow-lg hover:scale-110 active:scale-95 cursor-pointer z-20"
              >
                <WebIcon name="chevron-left" className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Nút tới */}
              <button
                type="button"
                onClick={() =>
                  setActiveLightboxIdx((prev) =>
                    prev !== null ? (prev < filteredMemories.length - 1 ? prev + 1 : 0) : 0
                  )
                }
                title="Ảnh tiếp theo (Mũi tên phải)"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111827]/80 hover:bg-emerald-600 text-white transition-all border border-white/20 shadow-lg hover:scale-110 active:scale-95 cursor-pointer z-20"
              >
                <WebIcon name="chevron-right" className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Thanh thao tác phía trên */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#111827]/85 backdrop-blur-md border border-white/20 typo-badge font-mono text-[#E2E8F0]">
                    {(activeLightboxIdx ?? 0) + 1} / {filteredMemories.length}
                  </span>

                  {/* Bật / Tắt Slideshow */}
                  <button
                    type="button"
                    onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                    title={isSlideshowPlaying ? 'Tạm dừng trình chiếu' : 'Tự động trình chiếu 4s'}
                    className={`px-3 py-1 rounded-full typo-button flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSlideshowPlaying
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow ring-2 ring-emerald-400/50'
                        : 'bg-[#111827]/85 text-[#E2E8F0] border-white/20 hover:text-white'
                    }`}
                  >
                    {isSlideshowPlaying ? (
                      <WebIcon name="pause" className="w-3.5 h-3.5" />
                    ) : (
                      <WebIcon name="play" className="w-3.5 h-3.5" />
                    )}
                    <span>{isSlideshowPlaying ? 'Tạm dừng' : 'Trình chiếu'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareLink}
                    title="Sao chép link ảnh"
                    className="p-2 rounded-full bg-[#111827]/80 hover:bg-[#1F2937] text-white transition-colors border border-white/20 cursor-pointer"
                  >
                    <WebIcon name="share" className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Đóng trình xem ảnh"
                    onClick={() => {
                      setActiveLightboxIdx(null);
                      setIsSlideshowPlaying(false);
                    }}
                    title="Đóng (Phím Esc)"
                    className="p-2 rounded-full bg-[#111827]/80 hover:bg-rose-600 text-white transition-colors border border-white/20 cursor-pointer font-bold"
                  >
                    <WebIcon name="cancel" className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Tiêu đề & Thông tin hiển thị dưới ảnh */}
              <div className="absolute bottom-3 left-4 right-4 flex flex-col gap-1.5 z-20 pointer-events-none">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="typo-badge font-mono tracking-wider text-[#6EE7B7] bg-emerald-950/90 px-3 py-0.5 rounded-full border border-emerald-500/40">
                    {activePhoto.tagVi}
                  </span>
                  <span className="typo-badge font-mono text-[#E2E8F0] bg-[#1F2937]/90 px-3 py-0.5 rounded-full border border-white/15">
                    {activePhoto.year}
                  </span>
                  <span className="typo-badge font-mono capitalize text-[#FCD34D] bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-500/40">
                    {activePhoto.companyId}
                  </span>
                </div>
                <h3 className="typo-popup-title text-[#F8FAFC]">
                  {activePhoto.titleVi}
                </h3>
              </div>
            </div>

            {/* Dải cuộn ảnh thu nhỏ (Filmstrip) */}
            <div
              ref={filmstripRef}
              className="theme-modal-footer w-full flex items-center gap-2 px-4 py-2 overflow-x-auto horizontal-scroll-smooth"
            >
              {filteredMemories.map((thumb, tIdx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setActiveLightboxIdx(tIdx)}
                  className={`w-14 h-10 rounded-[14px] overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeLightboxIdx === tIdx
                      ? 'border-emerald-400 scale-105 shadow-md'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={thumb.imageUrl} alt={thumb.titleVi} className="w-full h-full object-cover rounded-[14px]" />
                </button>
              ))}
            </div>

            {/* Mô tả chi tiết */}
            <div className="p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4 typo-caption font-mono text-[var(--text-secondary)] border-b border-[var(--border-subcard)] pb-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                  <WebIcon name="location" className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{activePhoto.locationVi}</span>
                </div>
                {activePhoto.teamSize && (
                  <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
                    <WebIcon name="users" className="w-3.5 h-3.5" />
                    <span>Quy mô: {activePhoto.teamSize}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[var(--text-heading,var(--text-primary))]">
                  <WebIcon name="building" className="w-3.5 h-3.5" />
                  <span>{MEMORIES_COMPANIES.find((c) => c.id === activePhoto.companyId)?.labelVi}</span>
                </div>
              </div>

              <p className="typo-body text-[var(--text-primary)]">
                {activePhoto.descVi}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
