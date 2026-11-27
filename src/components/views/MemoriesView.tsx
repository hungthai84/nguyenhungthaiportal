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
import { VideoBanner } from '@/components/common/VideoBanner';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ViewState } from '@/components/common/ViewState';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';

export interface MemoriesViewProps {
  currentTheme?: string;
}

interface ParallaxMemoryCardProps {
  item: MemoryPhoto;
  globalIdx: number;
  isBlurred: boolean;
  onHoverChange: (id: string | null) => void;
  onSelect: (idx: number) => void;
}

const ParallaxMemoryCard: React.FC<ParallaxMemoryCardProps> = React.memo(
  ({ item, globalIdx, isBlurred, onHoverChange, onSelect }) => {
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
      const scale = 1.08;
      const dx = offsetX - w / 2;
      const dy = offsetY - h / 2;
      const theta = Math.atan2(dy, dx);
      let angle = (theta * 180) / Math.PI - 90;
      if (angle < 0) {
        angle += 360;
      }

      cardEl.style.transform = `perspective(1000px) translateX(${(0.5 - offsetXPercentage) * 10}px) translateY(${(0.5 - offsetYPercentage) * 10}px) scale3d(${scale}, ${scale}, ${scale}) rotateX(${(0.5 - offsetYPercentage) * 16}deg) rotateY(${(offsetXPercentage - 0.5) * 16}deg)`;

      if (shineRef.current) {
        const shineAlpha = Math.max(0, (offsetYPercentage - 0.3) * 0.32);
        shineRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${shineAlpha}) 0%, rgba(255,255,255,0) 80%)`;
      }

      if (imgRef.current) {
        imgRef.current.style.transform = `translateX(${(offsetXPercentage - 0.5) * 10}px) translateY(${(offsetYPercentage - 0.5) * 10}px)`;
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
          'pinterest-memory-card card group relative break-inside-avoid mb-4 block rounded-[16px] overflow-hidden border border-[var(--border-subcard)] bg-[var(--surface-primary-bg,var(--bg-card))] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
          isBlurred && 'blur'
        )}
      >
        <div ref={shineRef} className="shineLayer pointer-events-none" />

        {!isLoaded && (
          <div
            aria-hidden="true"
            className="w-full min-h-[180px] animate-pulse bg-gradient-to-br from-slate-400/20 via-slate-500/15 to-slate-400/25"
          />
        )}

        <img
          ref={imgRef}
          src={item.imageUrl}
          alt={item.titleVi}
          loading={globalIdx < 6 ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-auto object-cover block transition-transform duration-500 ease-out group-hover:scale-105',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Chỉ hiển thị thông tin & huy hiệu khi rê chuột hoặc focus */}
        <div
          aria-hidden="true"
          className="memory-parallax-meta absolute inset-0 z-20 p-3 flex flex-col justify-between bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/45 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-black/65 text-white border border-white/25 backdrop-blur-md shadow-xs">
              {item.tagVi}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-400 text-slate-950 shadow-xs">
              {item.year}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <h3 className="typo-h4 text-[13.5px] font-play font-bold text-white leading-snug line-clamp-2 drop-shadow-sm m-0">
              {formatCardTitle(item.titleVi)}
            </h3>
            <div className="flex items-center justify-between gap-2 text-[11px] text-white/90 font-play">
              <span className="flex items-center gap-1 truncate">
                <WebIcon name="map-pin" className="w-3 h-3 shrink-0 text-emerald-400" />
                <span className="truncate">{item.locationVi}</span>
              </span>
              {item.teamSize && (
                <span className="shrink-0 flex items-center gap-1 font-bold text-rose-300 font-mono text-[10.5px]">
                  <WebIcon name="users" className="w-3 h-3 shrink-0" />
                  <span>{item.teamSize}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ParallaxMemoryCard.displayName = 'ParallaxMemoryCard';

const CATEGORY_SECTION_SUBTITLES: Record<string, string> = {
  team: 'Những khoảnh khắc đồng hành, gắn kết và phát triển đội ngũ qua từng chặng đường thực chiến',
  event: 'Dấu ấn sự kiện, lễ tổng kết và vinh danh những tập thể xuất sắc qua các năm',
  training: 'Hoạt động đào tạo nội bộ, chia sẻ quy trình và nâng tầm năng lực Chăm sóc Khách hàng',
  office: 'Không gian làm việc, trung tâm điều hành Contact Center và môi trường văn hóa doanh nghiệp',
};

interface LazyFilmstripThumbProps {
  src: string;
  alt: string;
  isActive: boolean;
  isNearActive: boolean;
  filmstripRootRef?: React.RefObject<HTMLElement | null>;
}

const LazyFilmstripThumb: React.FC<LazyFilmstripThumbProps> = React.memo(
  ({ src, alt, isActive, isNearActive, filmstripRootRef }) => {
    const thumbRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState<boolean>(isActive || isNearActive);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
      if (isActive || isNearActive) {
        setShouldLoad(true);
      }
    }, [isActive, isNearActive]);

    useEffect(() => {
      if (shouldLoad) return;
      const el = thumbRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') {
        setShouldLoad(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.disconnect();
              break;
            }
          }
        },
        {
          root: filmstripRootRef?.current || null,
          rootMargin: '0px 160px',
          threshold: 0.01,
        }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [shouldLoad, filmstripRootRef]);

    return (
      <div ref={thumbRef} className="relative w-full h-full rounded-[inherit] overflow-hidden">
        {!isLoaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-slate-500/20 rounded-[inherit]"
          />
        )}
        {shouldLoad && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            fetchPriority={isActive ? 'high' : 'low'}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            className={cn(
              'w-full h-full object-cover rounded-[inherit] transition-opacity duration-200',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </div>
    );
  }
);
LazyFilmstripThumb.displayName = 'LazyFilmstripThumb';

export const MemoriesView: React.FC<MemoriesViewProps> = ({ currentTheme = 'liquid-glass' }) => {
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
  const [isLightboxImgLoaded, setIsLightboxImgLoaded] = useState<boolean>(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const memoriesBannerVideo = getDefaultBannerVideoConfig('memories');
  const mainCardScrollRef = useRef<HTMLDivElement>(null);
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
        String(item.year).toLowerCase().includes(q) ||
        item.locationVi.toLowerCase().includes(q) ||
        item.tagVi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Tổ chức các kỷ niệm theo từng .card-section đúng bố cục mẫu mà không thay đổi MEMORIES_DATA
  const memorySections = React.useMemo(() => {
    const indexMap = new Map<string, number>();
    filteredMemories.forEach((m, i) => indexMap.set(String(m.id), i));

    const categoriesToRender = MEMORIES_CATEGORIES.filter((c) => c.id !== 'all');
    const sections = categoriesToRender
      .map((cat) => {
        const items = filteredMemories
          .filter((m) => m.category === cat.id)
          .map((item) => ({
            item,
            globalIdx: indexMap.get(String(item.id)) ?? 0,
          }));
        return {
          id: cat.id,
          title: cat.labelVi,
          subtitle:
            CATEGORY_SECTION_SUBTITLES[cat.id] ||
            'Rê chuột vào hình ảnh để trải nghiệm hiệu ứng 3D Parallax sống động',
          items,
        };
      })
      .filter((sec) => sec.items.length > 0);

    if (sections.length > 0) return sections;

    return [
      {
        id: 'all',
        title: 'Bộ sưu tập kỷ niệm',
        subtitle: 'Rê chuột vào hình ảnh để trải nghiệm hiệu ứng 3D Parallax sống động',
        items: filteredMemories.map((item, idx) => ({ item, globalIdx: idx })),
      },
    ];
  }, [filteredMemories]);

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
          data-element-name="Thẻ chính Trang Kỷ Niệm"
          data-element-type="card"
          data-element-page="memories"
          data-element-parent="memories-cards-track"
          className="page-main-card flex flex-col justify-start p-2.5 sm:p-[15px] gap-2.5 sm:gap-3 rounded-[var(--radius-main,14px)] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
      {/* CSS cho bố cục .card-section, .card-list, .card, .shineLayer và hiệu ứng 3D Parallax + Sibling Blur */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #memories-main-card .card-section {
              margin: 15px 0 20px 0;
              padding: 20px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
              border-radius: var(--radius-subcard, 14px);
              background: var(--bg-subcard, rgba(255, 255, 255, 0.32));
              border: 1px solid var(--border-subcard, rgba(148, 163, 184, 0.2));
              box-sizing: border-box;
            }

            #memories-main-card .card-section > h1 {
              margin-top: 0;
              margin-bottom: 0;
              font-size: clamp(1.25rem, 2vw, 1.6rem);
              font-weight: 700;
              color: var(--text-heading, var(--text-primary));
              text-align: center;
              letter-spacing: -0.01em;
            }

            #memories-main-card .card-section > h4 {
              color: var(--text-muted, #999);
              margin-top: 4px;
              margin-bottom: 10px;
              font-size: clamp(0.82rem, 1.15vw, 0.95rem);
              font-weight: 500;
              text-align: center;
              max-width: 720px;
            }

            #memories-main-card .card-list {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              width: 100%;
            }

            #memories-main-card .card.memory-parallax-card {
              position: relative;
              width: 320px;
              max-width: calc(100vw - 56px);
              height: 180px;
              border-radius: var(--radius-image, 10px);
              overflow: hidden;
              margin: 15px 20px;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2), 0 0 5px rgba(0, 0, 0, 0.15);
              transform: scale3d(1, 1, 1);
              transition: all 0.2s ease-out, filter 0.75s ease-out;
              background: rgba(0, 0, 0, 0.2);
              filter: grayscale(0.1) saturate(95%) brightness(95%) contrast(90%);
              isolation: isolate;
              will-change: transform, filter, box-shadow;
            }

            #memories-main-card .card.memory-parallax-card:hover {
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 0, 0, 0.3);
              filter: grayscale(0) saturate(105%) brightness(100%) contrast(100%);
              z-index: 20;
            }

            #memories-main-card .card.memory-parallax-card > img.memory-parallax-img {
              position: absolute;
              width: 108%;
              height: 108%;
              max-width: none;
              top: -4%;
              left: -4%;
              z-index: -10;
              transform: scale(1.05);
              transition: all 0.2s ease-out;
              object-fit: cover;
              pointer-events: none;
            }

            #memories-main-card .card.memory-parallax-card > .shineLayer {
              position: relative;
              z-index: 15;
              height: 100%;
              width: 100%;
              background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 80%);
              transition: all 0.2s ease-out;
            }

            #memories-main-card .card.memory-parallax-card.blur {
              filter: blur(1px) grayscale(0.25) saturate(65%) contrast(75%) brightness(90%);
              transform: scale(0.95);
            }

            #memories-main-card .card.memory-parallax-card .memory-parallax-meta {
              position: absolute;
              inset: 0;
              z-index: 12;
              padding: 10px 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background: linear-gradient(
                180deg,
                rgba(15, 23, 42, 0.18) 0%,
                rgba(15, 23, 42, 0.04) 45%,
                rgba(15, 23, 42, 0.78) 100%
              );
              opacity: 0;
              transition: opacity 0.24s ease-out;
            }

            #memories-main-card .card.memory-parallax-card:hover .memory-parallax-meta,
            #memories-main-card .card.memory-parallax-card:focus-visible .memory-parallax-meta {
              opacity: 1;
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
        data-has-compact-menu="true"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,24px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 24px)' }}
      >
        <div
          className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
        >
          <VideoBanner
            videoId={memoriesBannerVideo.videoId}
            title={memoriesBannerVideo.title}
            className="rounded-[inherit]"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

        <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon name="camera" className="w-[22px] h-[22px] shrink-0" />
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

          <CompactBannerMenu
            id="memories-compact-menu-btn"
            label="Điều khiển"
            ariaLabel="Bộ lọc và tìm kiếm kỷ niệm"
            activeCount={(categoryFilter !== 'all' ? 1 : 0) + (companyFilter !== 'all' ? 1 : 0) + (searchQuery.trim() ? 1 : 0)}
          >
            {(closeMenu) => (
              <>
                <div className="relative w-full">
                  <WebIcon
                    name="search"
                    className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="memories-compact-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kỷ niệm, địa điểm, năm..."
                    aria-label="Tìm kiếm ảnh kỷ niệm"
                    className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-input font-normal font-play focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="typo-label text-[var(--text-muted)] px-1">Theo chủ đề kỷ niệm</span>
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
                          closeMenu();
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span>{cat.labelVi}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1 border-t border-[var(--border-subcard)] pt-2">
                  <span className="typo-label text-[var(--text-muted)] px-1">Theo đơn vị công tác</span>
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
                        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span className="truncate">{comp.labelVi}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}
                </div>

                {(categoryFilter !== 'all' || companyFilter !== 'all' || searchQuery.trim() !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      handleResetFilters();
                      closeMenu();
                    }}
                    className="banner-control-pill w-full px-3 py-1.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white typo-button font-play transition-all cursor-pointer"
                  >
                    ✕ Đặt lại bộ lọc
                  </button>
                )}
              </>
            )}
          </CompactBannerMenu>
        </div>

        {/* Nhóm bộ lọc bên trái + Ô tìm kiếm nhanh bên phải */}
        <div className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto w-full" ref={filterMenuRef}>
          <div className="flex flex-wrap items-center gap-2">
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterDropdownOpen((prev) => !prev);
              }}
              className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play group"
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
              className="banner-control-pill px-3 py-1.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white typo-button font-play transition-all cursor-pointer shadow-xs"
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
                className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-body font-normal font-play focus:outline-none"
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

      {/* 2. Vùng Album Hình Ảnh Bố Cục .card-section & Hiệu Ứng 3D Parallax + ShineLayer + Sibling Blur */}
      <div className="w-full flex-grow relative min-h-[360px]">
        {filteredMemories.length === 0 ? (
          <ViewState
            id="memories-empty-card"
            variant="empty"
            icon="camera"
            title="Không tìm thấy ảnh kỷ niệm phù hợp với bộ lọc."
            description="Hãy thử chọn lại công ty hoặc chủ đề khác."
            actionLabel="↻ Đặt lại bộ lọc"
            onAction={handleResetFilters}
          />
        ) : (
          <div
            id="memories-master-card"
            data-subcard="true"
            className="bento-card glass-card w-full p-6 rounded-[14px] flex flex-col gap-4 shadow-md"
          >
            <SectionHeader
              divided
              title="Bộ sưu tập kỷ niệm"
              subtitle={`Tổng hợp ${filteredMemories.length} khoảnh khắc đáng nhớ trong sự nghiệp`}
            />
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:break-inside-avoid [&>*]:mb-4 w-full">
              {filteredMemories.map((item, idx) => (
                <ParallaxMemoryCard
                  key={item.id}
                  item={item}
                  globalIdx={idx}
                  isBlurred={hoveredCardId !== null && hoveredCardId !== item.id}
                  onHoverChange={setHoveredCardId}
                  onSelect={setActiveLightboxIdx}
                />
              ))}
            </div>
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
              style={{ borderRadius: 'var(--radius-card, 14px)' }}
              className={cn(
                'relative w-full h-72 sm:h-[460px] md:h-[520px] rounded-[var(--radius-card,14px)] flex items-center justify-center overflow-hidden',
                isDark ? 'bg-[#0B1220]' : 'bg-slate-100'
              )}
            >
              {!isLightboxImgLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-500/15 via-slate-400/10 to-slate-500/20"
                />
              )}
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.titleVi}
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                onLoad={() => setIsLightboxImgLoaded(true)}
                className={cn(
                  'w-full h-full object-contain rounded-[inherit] select-none transition-opacity duration-200',
                  isLightboxImgLoaded ? 'opacity-100' : 'opacity-0'
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
                title="Ảnh trước (Mũi tên trái)"
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
                title="Ảnh tiếp theo (Mũi tên phải)"
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
                <h3 className="typo-popup-title text-[#F8FAFC] flex items-center gap-2">
                  <WebIcon name="camera" className="w-5 h-5 shrink-0 text-[#6EE7B7]" />
                  <span>{activePhoto.titleVi}</span>
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
