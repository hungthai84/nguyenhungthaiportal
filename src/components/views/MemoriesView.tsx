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
        <div ref={shineRef} className="shineLayer absolute inset-0 z-15 pointer-events-none" />

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
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://i.postimg.cc/zBnjzm2t/Khong-bang-cap.png';
            setIsLoaded(true);
          }}
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
          data-floating-surface="main"
          data-element-name="Thẻ chính Trang Kỷ Niệm"
          data-element-type="card"
          data-element-page="memories"
          data-element-parent="memories-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main flex flex-col justify-start p-2.5 sm:p-[15px] gap-2.5 sm:gap-3 rounded-[var(--radius-main,14px)] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
        {/* CSS Tối ưu khoảng cách dòng, giãn chữ di động & hiệu ứng hover nhấp nháy / shimmer */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes memoryCardShimmerPulse {
                0% {
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0px rgba(14, 165, 233, 0);
                }
                50% {
                  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.2), 0 0 18px rgba(14, 165, 233, 0.4);
                }
                100% {
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0px rgba(14, 165, 233, 0);
                }
              }

              #memories-main-card .exp-detail-subcard {
                line-height: 1.68;
                letter-spacing: 0.012em;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              }

              #memories-main-card .exp-detail-subcard p {
                line-height: 1.72;
                letter-spacing: 0.016em;
                font-size: clamp(13.5px, 2vw, 14.5px);
              }

              #memories-main-card .exp-detail-subcard:hover {
                animation: memoryCardShimmerPulse 2.2s ease-in-out infinite;
                border-color: var(--text-link, var(--color-primary));
                transform: translateY(-2px);
              }
            `,
          }}
        />

        {/* HEADER GIỐNG THẺ CHI TIẾT TRẢ LỜI (#interview-answers-card) */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[var(--border-subcard)] min-w-0 shrink-0">
          <h3 className="card-title card-header-sync card-title-synced typo-h3 flex items-center gap-2 text-pink-600 dark:text-pink-400 min-w-0" data-card-title="true">
            <WebIcon name="image" className="w-5 h-5 shrink-0" />
            <span className="truncate">Bộ sưu tập kỷ niệm</span>
          </h3>
          <span className="typo-caption font-semibold text-[var(--text-secondary)] shrink-0 tabular-nums whitespace-nowrap">
            {filteredMemories.length} khoảnh khắc
            <span aria-hidden="true" className="mx-1 opacity-60">·</span>
            <span className="text-[var(--text-link,var(--color-primary))]">
              {categoryFilter !== 'all' ? MEMORIES_CATEGORIES.find(c => c.id === categoryFilter)?.labelVi : 'Tất cả chủ đề'}
            </span>
          </span>
        </div>

        {/* VÙNG DANH SÁCH SUBCARDS CUỘN DỌC MƯỢT MÀ GIỐNG HỆT CHI TIẾT TRẢ LỜI */}
        <div
          data-scrollable="true"
          data-no-wheel-horizontal="true"
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden glass-scrollbar flex flex-col gap-3"
        >
          {filteredMemories.length === 0 ? (
            <div className="w-full flex-grow relative min-h-[360px]">
              <ViewState
                id="memories-empty-card"
                variant="empty"
                icon="camera"
                title="Không tìm thấy ảnh kỷ niệm phù hợp với bộ lọc."
                description="Hãy thử chọn lại công ty hoặc chủ đề khác."
                actionLabel="↻ Đặt lại bộ lọc"
                onAction={handleResetFilters}
              />
            </div>
          ) : (
            filteredMemories.map((item, idx) => (
              <div
                key={item.id}
                id={`memory-subcard-${item.id}`}
                data-element-type="card"
                data-subcard="true"
                style={{ borderRadius: '14px' }}
                className="exp-detail-subcard p-[15px] rounded-[14px] border flex flex-col gap-3 shrink-0 cursor-pointer"
                onClick={() => {
                  SoundEngine.playTap();
                  setActiveLightboxIdx(idx);
                }}
              >
                {/* Subcard Header */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[var(--border-subcard)] min-w-0">
                  <div className="interview-time-heading subcard-header-sync typo-h4 flex items-center gap-2 text-sky-600 dark:text-sky-400 min-w-0">
                    <WebIcon name="camera" className="w-4 h-4 shrink-0" />
                    <span className="subcard-title-synced tracking-wide text-sky-600 dark:text-sky-400 truncate" data-subcard-title="true">
                      {formatCardTitle(item.titleVi)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-400 text-slate-950 shadow-xs">
                      {item.year}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-black/10 dark:bg-white/10 text-[var(--text-secondary)]">
                      {item.tagVi}
                    </span>
                  </div>
                </div>

                {/* Subcard Image Banner */}
                <div className="relative w-full h-56 sm:h-72 rounded-[12px] overflow-hidden group bg-black/10 border border-[var(--border-subcard)]">
                  <img
                    src={item.imageUrl}
                    alt={item.titleVi}
                    loading={idx < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <WebIcon name="maximize-2" className="w-3.5 h-3.5" />
                      Bấm để phóng to ảnh kỷ niệm
                    </span>
                  </div>
                </div>

                {/* Subcard Description & Footer Info */}
                <div className="flex flex-col gap-2 text-left pt-1">
                  <p className="typo-body text-[var(--text-secondary)] leading-relaxed m-0">
                    {item.descVi}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subcard)]/60 text-[11.5px] text-[var(--text-muted)] font-play">
                    <span className="flex items-center gap-1.5 truncate">
                      <WebIcon name="map-pin" className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.locationVi}</span>
                    </span>
                    {item.teamSize && (
                      <span className="flex items-center gap-1 font-mono text-rose-500 font-bold shrink-0">
                        <WebIcon name="users" className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.teamSize}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
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
