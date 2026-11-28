'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { ViewState } from '@/components/common/ViewState';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import { BlurUpImage } from '@/components/ui/BlurUpImage';

export interface MemoriesViewProps {
  currentTheme?: string;
}

interface ParallaxMemoryCardProps {
  item: MemoryPhoto;
  globalIdx: number;
  isBlurred?: boolean;
  onHoverChange: (id: string | null) => void;
  onSelect: (idx: number) => void;
}

/**
 * Thẻ kỷ niệm Pinterest với hiệu ứng 3D Parallax Tilt, ánh sáng phản xạ (shine)
 * và hình ảnh hiển thị trong trẻo, sạch sẽ, không bị che khuất bởi chữ.
 */
const ParallaxMemoryCard: React.FC<ParallaxMemoryCardProps> = React.memo(
  ({ item, globalIdx, isBlurred = false, onHoverChange, onSelect }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const shineRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleMouseEnter = () => {
      onHoverChange(String(item.id));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const cardEl = cardRef.current;
      if (!cardEl) return;
      const rect = cardEl.getBoundingClientRect();
      const w = rect.width || 320;
      const h = rect.height || 180;
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const offsetXPercentage = offsetX / w;
      const offsetYPercentage = offsetY / h;
      const scale = 1.03;
      const dx = offsetX - w / 2;
      const dy = offsetY - h / 2;
      const theta = Math.atan2(dy, dx);
      let angle = (theta * 180) / Math.PI - 90;
      if (angle < 0) {
        angle += 360;
      }

      cardEl.style.transform = `perspective(1000px) translateX(${(0.5 - offsetXPercentage) * 8}px) translateY(${(0.5 - offsetYPercentage) * 8}px) scale3d(${scale}, ${scale}, ${scale}) rotateX(${(0.5 - offsetYPercentage) * 12}deg) rotateY(${(offsetXPercentage - 0.5) * 12}deg)`;

      if (shineRef.current) {
        const shineAlpha = Math.max(0, (offsetYPercentage - 0.25) * 0.35);
        shineRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${shineAlpha}) 0%, rgba(255,255,255,0) 80%)`;
      }

      if (imgRef.current) {
        imgRef.current.style.transform = `translateX(${(offsetXPercentage - 0.5) * 8}px) translateY(${(offsetYPercentage - 0.5) * 8}px)`;
      }
    };

    const handleMouseLeave = () => {
      onHoverChange(null);
      if (cardRef.current) {
        cardRef.current.style.transform = '';
      }
      if (imgRef.current) {
        imgRef.current.style.transform = '';
      }
      if (shineRef.current) {
        shineRef.current.style.background =
          'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 80%)';
      }
    };

    return (
      <div
        ref={cardRef}
        id={`memory-card-${item.id}`}
        data-element-name={`Thẻ kỷ niệm Pinterest: ${item.titleVi}`}
        data-media-card="image"
        role="button"
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          SoundEngine.playTap();
          onSelect(globalIdx);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            SoundEngine.playTap();
            onSelect(globalIdx);
          }
        }}
        className={cn(
          'pinterest-memory-card card memory-photo-item group relative break-inside-avoid mb-3.5 block rounded-[14px] overflow-hidden border border-[var(--border-subcard)] bg-[var(--surface-primary-bg,var(--bg-card))] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
          isBlurred && 'blur'
        )}
      >
        {/* Lớp ánh sáng phản chiếu gương khi rê chuột */}
        <div ref={shineRef} className="shineLayer absolute inset-0 z-15 pointer-events-none" />

        {/* Ảnh kỷ niệm độ nét cao với BlurUpImage & lazy loading */}
        <BlurUpImage
          ref={imgRef}
          src={item.imageUrl}
          fallbackSrc="https://i.postimg.cc/zBnjzm2t/Khong-bang-cap.png"
          alt={item.titleVi}
          priority={globalIdx < 6 ? 'eager' : 'lazy'}
          variant="cover"
          onReadyChange={(ok) => {
            if (ok) setIsLoaded(true);
          }}
          className={cn(
            'w-full h-auto object-cover block transition-transform duration-500 ease-out group-hover:scale-105',
            !isLoaded && 'min-h-[220px]'
          )}
        />

        {/* Huy hiệu năm cố định nhẹ nhàng góc trên bên phải */}
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-black/60 text-amber-300 backdrop-blur-md border border-white/20 shadow-xs">
            {item.year}
          </span>
        </div>

        {/* Lớp thông tin tinh tế chỉ hiển thị dịu dàng khi rê chuột vào ảnh */}
        <div
          aria-hidden="true"
          className="memory-parallax-meta absolute inset-x-0 bottom-0 z-20 p-3 pt-8 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/45 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none text-left"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/20 text-white backdrop-blur-md border border-white/25">
              {item.tagVi}
            </span>
            {item.locationVi && (
              <span className="text-[11px] text-white/80 font-play truncate">
                · {item.locationVi}
              </span>
            )}
          </div>

          <h3 className="typo-h4 text-[13.5px] font-play font-bold text-white leading-snug line-clamp-2 drop-shadow-sm m-0">
            {formatCardTitle(item.titleVi)}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-300 font-medium">
            <WebIcon name="maximize-2" className="w-3 h-3 shrink-0" />
            <span>Bấm xem chi tiết</span>
          </div>
        </div>
      </div>
    );
  }
);
ParallaxMemoryCard.displayName = 'ParallaxMemoryCard';

interface LazyFilmstripThumbProps {
  src: string;
  alt: string;
  isActive: boolean;
  isNearActive: boolean;
  filmstripRootRef?: React.RefObject<HTMLElement | null>;
}

const LazyFilmstripThumb: React.FC<LazyFilmstripThumbProps> = React.memo(
  ({ src, alt, isActive, isNearActive, filmstripRootRef }) => {
    return (
      <BlurUpImage
        src={src}
        alt={alt}
        rootRef={filmstripRootRef}
        rootMargin="0px 160px"
        priority={isActive || isNearActive ? 'eager' : 'lazy'}
        variant="cover"
        className="w-full h-full object-cover rounded-[inherit]"
      />
    );
  }
);
LazyFilmstripThumb.displayName = 'LazyFilmstripThumb';

export const MemoriesView: React.FC<MemoriesViewProps> = ({ currentTheme = 'liquid-glass' }) => {
  const { showToast } = useToast();
  const { isDark: themeIsDark } = useTheme();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isDark = themeIsDark || currentTheme.includes('dark');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxIdx, setActiveLightboxIdx] = useState<number | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState<boolean>(false);
  const [isLightboxImgLoaded, setIsLightboxImgLoaded] = useState<boolean>(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const memoriesBannerVideo = getDefaultBannerVideoConfig('memories');
  const mainCardScrollRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  const filteredMemories = useMemo(() => {
    return MEMORIES_DATA.filter((item) => {
      if (/logo_|_logo|\/logo\//i.test(item.imageUrl || '')) return false;
      if (companyFilter !== 'all' && item.companyId !== companyFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.titleVi.toLowerCase().includes(q) ||
          item.descVi.toLowerCase().includes(q) ||
          String(item.year).toLowerCase().includes(q) ||
          item.locationVi.toLowerCase().includes(q) ||
          item.tagVi.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [companyFilter, categoryFilter, searchQuery]);

  const activePhoto: MemoryPhoto | null =
    activeLightboxIdx !== null ? filteredMemories[activeLightboxIdx] || null : null;

  useEffect(() => {
    setIsLightboxImgLoaded(false);
  }, [activePhoto?.imageUrl]);

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
        showToast(isEn ? 'Copied photo link to clipboard!' : 'Đã sao chép liên kết ảnh vào clipboard!');
      } else {
        showToast(isEn ? `Photo link: ${activePhoto.imageUrl}` : `Liên kết ảnh: ${activePhoto.imageUrl}`);
      }
    }
  };

  const handleResetFilters = () => {
    setCompanyFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    showToast(isEn ? 'Reset all memory filters' : 'Đã đặt lại toàn bộ bộ lọc');
  };

  const activeFiltersCount =
    (companyFilter !== 'all' ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div
      id="memories-page-container"
      data-element-name="Trang Kỷ Niệm & Thư Thư"
      data-element-type="container"
      data-element-page="memories"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left rounded-none box-border"
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
          ref={mainCardScrollRef}
          id="memories-main-card"
          data-main-card="true"
          data-floating-surface="main"
          data-element-name="Thẻ chính Trang Kỷ Niệm"
          data-element-type="card"
          data-element-page="memories"
          data-element-parent="memories-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main flex flex-col justify-start p-2.5 sm:p-[15px] gap-3 rounded-[var(--radius-main,14px)] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
          {/* 1. HERO BANNER TRANG KỶ NIỆM (ĐỒNG BỘ CHUẨN BANNER TOÀN BỘ CÁC TRANG) */}
          <section
            id="memories-hero-banner"
            data-element-name="Banner chính trang Kỷ Niệm"
            data-element-type="section"
            data-element-page="memories"
            data-element-parent="memories-main-card"
            data-section-card="true"
            data-has-compact-menu="true"
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300 box-border"
            style={{
              padding: '15px',
              width: '100%',
              maxWidth: '100%',
              borderRadius: 'var(--radius-banner, 14px)',
            }}
          >
            {/* Lớp nền video và scrim */}
            <div className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none">
              <VideoBanner
                videoId={memoriesBannerVideo.videoId}
                title={memoriesBannerVideo.title}
                className="rounded-[inherit]"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            {/* Hàng trên: Tiêu đề bên trái, Quote chữ ký bên phải */}
            <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
              <div
                className="card-header-sync flex items-center gap-2 min-w-0"
                style={{ color: 'var(--text-link, var(--color-primary))' }}
              >
                <WebIcon name="camera-retro" className="w-[22px] h-[22px] shrink-0" />
                <h1
                  id="memories-hero-banner-title"
                  className="typo-h3 card-title-synced font-bold font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                  style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  {isEn ? 'Memorable Milestones' : 'Khoảnh Khắc Kỷ Niệm'}
                </h1>
              </div>

              <p
                id="memories-hero-banner-quote"
                className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                  fontWeight: 600,
                  fontStyle: 'normal',
                }}
              >
                {isEn
                  ? '"Preserving memorable milestones across every journey ♡"'
                  : '"Lưu giữ những khoảnh khắc đáng nhớ trong từng hành trình ♡"'}
              </p>

              {/* Nút Điều Khiển Gọn (Compact Menu) Đồng Bộ Hệ Thống */}
              <CompactBannerMenu
                id="memories-compact-menu-btn"
                label={isEn ? 'Controls' : 'Điều khiển'}
                ariaLabel={isEn ? 'Memory filters and search' : 'Bộ lọc và tìm kiếm kỷ niệm'}
                activeCount={activeFiltersCount}
              >
                {(closeMenu) => (
                  <>
                    {/* Tìm kiếm */}
                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Search' : 'Tìm kiếm'}
                      </span>
                      <div className="relative w-full">
                        <WebIcon
                          name="search"
                          className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={isEn ? 'Search title, year, tag...' : 'Tìm tên, năm, chủ đề, nơi chốn...'}
                          className="banner-search-input h-9 w-full pl-8 pr-8 py-0 rounded-full typo-input font-play focus:outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            aria-label={isEn ? 'Clear search' : 'Xóa từ khóa'}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                          >
                            <WebIcon name="x" className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lọc theo chủ đề */}
                    <div className="flex flex-col gap-1">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Category' : 'Chủ đề'}
                      </span>
                      {MEMORIES_CATEGORIES.map((cat) => {
                        const isActive = categoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            data-selected={isActive ? 'true' : 'false'}
                            onClick={() => {
                              SoundEngine.playTap();
                              setCategoryFilter(cat.id);
                              closeMenu();
                            }}
                            className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                          >
                            <span className="inline-flex items-center gap-2 min-w-0">
                              <WebIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0 opacity-85" />
                              <span className="truncate">{cat.labelVi}</span>
                            </span>
                            {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Lọc theo đơn vị công tác */}
                    <div className="flex flex-col gap-1">
                      <span className="typo-label text-[var(--text-muted)] px-1">
                        {isEn ? 'Organization' : 'Đơn vị'}
                      </span>
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
                              closeMenu();
                            }}
                            className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                          >
                            <span className="inline-flex items-center gap-2 min-w-0">
                              <WebIcon name="building" className="w-3.5 h-3.5 shrink-0 opacity-85" />
                              <span className="truncate">{comp.labelVi}</span>
                            </span>
                            {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Nút đặt lại */}
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          handleResetFilters();
                          closeMenu();
                        }}
                        className="w-full mt-1 px-3 py-2 rounded-[12px] text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <WebIcon name="rotate-ccw" className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Reset all filters' : 'Đặt lại bộ lọc'}</span>
                      </button>
                    )}
                  </>
                )}
              </CompactBannerMenu>
            </div>
          </section>

          {/* 3. LƯỚI ẢNH PINTEREST MASONRY WATERFALL THỰC SỰ */}
          <div
            data-scrollable="true"
            data-no-wheel-horizontal="true"
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden glass-scrollbar"
          >
            {filteredMemories.length === 0 ? (
              <div className="w-full flex-grow relative min-h-[360px]">
                <ViewState
                  id="memories-empty-card"
                  variant="empty"
                  icon="camera"
                  title={isEn ? 'No memory photos match the filter.' : 'Không tìm thấy ảnh kỷ niệm phù hợp với bộ lọc.'}
                  description={isEn ? 'Try selecting another company or category.' : 'Hãy thử chọn lại công ty hoặc chủ đề khác.'}
                  actionLabel={isEn ? '↻ Reset filters' : '↻ Đặt lại bộ lọc'}
                  onAction={handleResetFilters}
                />
              </div>
            ) : (
              <div
                id="memories-grid"
                className="w-full columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-3.5 space-y-3.5 pt-1"
              >
                {filteredMemories.map((item, idx) => (
                  <ParallaxMemoryCard
                    key={item.id}
                    item={item}
                    globalIdx={idx}
                    isBlurred={hoveredCardId !== null && hoveredCardId !== String(item.id)}
                    onHoverChange={setHoveredCardId}
                    onSelect={(selectIdx) => {
                      setActiveLightboxIdx(selectIdx);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. LIGHTBOX MODAL VỚI SLIDESHOW & FILMSTRIP THUMBNAILS */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${isEn ? 'View memory photo' : 'Xem ảnh kỷ niệm'}: ${activePhoto.titleVi}`}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5"
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 8px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 8px))',
          }}
          onClick={() => {
            setActiveLightboxIdx(null);
            setIsSlideshowPlaying(false);
          }}
        >
          <div
            id="memories-lightbox-card"
            data-element-type="card"
            className="theme-modal-card w-full max-w-6xl max-h-[94vh] overflow-y-auto no-scrollbar rounded-[14px] flex flex-col relative text-left border border-[var(--border-subcard)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ảnh lớn & Điều khiển */}
            <div
              style={{ borderRadius: 'var(--radius-card, 14px)' }}
              className={cn(
                'relative w-full h-72 sm:h-[460px] md:h-[520px] rounded-[var(--radius-card,14px)] flex items-center justify-center overflow-hidden',
                isDark ? 'bg-[#0B1220]' : 'bg-slate-100'
              )}
            >
              <BlurUpImage
                src={activePhoto.imageUrl}
                alt={activePhoto.titleVi}
                priority="eager"
                variant="contain"
                onReadyChange={(ok) => {
                  if (ok) setIsLightboxImgLoaded(true);
                }}
                className={cn(
                  'w-full h-full object-contain rounded-[inherit] select-none',
                  isLightboxImgLoaded ? 'opacity-100' : 'opacity-95'
                )}
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
                title={isEn ? 'Previous photo (Left arrow)' : 'Ảnh trước (Mũi tên trái)'}
                className="nav-arrow-btn theme-prev-next-btn absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all shadow-lg hover:scale-110 cursor-pointer z-20"
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
                title={isEn ? 'Next photo (Right arrow)' : 'Ảnh tiếp theo (Mũi tên phải)'}
                className="nav-arrow-btn theme-prev-next-btn absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all shadow-lg hover:scale-110 cursor-pointer z-20"
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
                    <span>{isSlideshowPlaying ? (isEn ? 'Pause' : 'Tạm dừng') : (isEn ? 'Slideshow' : 'Trình chiếu')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareLink}
                    title={isEn ? 'Copy photo URL' : 'Sao chép link ảnh'}
                    className="p-2 rounded-full bg-[#111827]/80 hover:bg-[#1F2937] text-white transition-colors border border-white/20 cursor-pointer"
                  >
                    <WebIcon name="share" className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    aria-label={isEn ? 'Close photo viewer' : 'Đóng trình xem ảnh'}
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
                    {MEMORIES_COMPANIES.find((c) => c.id === activePhoto.companyId)?.labelVi || activePhoto.companyId}
                  </span>
                </div>
                <h3 className="typo-popup-title text-[#F8FAFC] flex items-center gap-2">
                  <WebIcon name="camera" className="w-5 h-5 shrink-0 text-[#6EE7B7]" />
                  <span>{activePhoto.titleVi}</span>
                </h3>
              </div>
            </div>

            {/* Dải cuộn ảnh thu nhỏ (Filmstrip) */}
            <div
              ref={filmstripRef}
              className="theme-modal-footer w-full flex items-center gap-2 px-4 py-2 overflow-x-auto horizontal-scroll-smooth border-t border-[var(--border-subcard)]/60"
            >
              {filteredMemories.map((thumb, tIdx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setActiveLightboxIdx(tIdx)}
                  className={`w-14 h-10 rounded-[8px] overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeLightboxIdx === tIdx
                      ? 'border-emerald-400 scale-105 shadow-md'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <LazyFilmstripThumb
                    src={thumb.imageUrl}
                    alt={thumb.titleVi}
                    isActive={activeLightboxIdx === tIdx}
                    isNearActive={
                      activeLightboxIdx !== null && Math.abs(activeLightboxIdx - tIdx) <= 3
                    }
                    filmstripRootRef={filmstripRef}
                  />
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

              <p className="typo-body text-[var(--text-primary)] leading-relaxed m-0">
                {activePhoto.descVi}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoriesView;
