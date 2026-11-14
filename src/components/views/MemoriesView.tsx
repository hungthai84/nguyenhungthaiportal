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
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';

export interface MemoriesViewProps {
  currentTheme?: string;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ currentTheme = 'light-glass' }) => {
  const { showToast } = useToast();
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

  const { cardStyle } = useTheme();
  const cardSampleStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cleanCardStyle } = cardSampleStyle as any;

  return (
    <div
      id="memories-page-container"
      data-element-name="Trang Kỷ Niệm & Thư Thư"
      data-element-type="card"
      data-section-card="true"
      data-element-page="memories"
      style={{
        ...cleanCardStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card w-full h-full flex flex-col justify-between p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
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
        className="banner-card hero-banner w-full max-w-full lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-hidden relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: '14px' }}
      >
        <div
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f172a 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591947/K%E1%BB%B7_ni%E1%BB%87m.png"
            alt="Khoảnh khắc kỷ niệm"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/75 via-[#0B1220]/25 to-[#0B1220]/55 pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2 shrink-0">
            <WebIcon
              name="camera"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
              style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
            />
            <h1
              className="text-[22px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] whitespace-nowrap"
              style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 700, textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
            >
              Khoảnh khắc kỷ niệm
            </h1>
          </div>
          <p
            className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
            style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '28px', fontWeight: 700, fontStyle: 'normal' }}
          >
            &quot;Mỗi khoảnh khắc là một mảnh ghép tự hào của hành trình ♡&quot;
          </p>
        </div>

        {/* Nhóm các nút lại thành 1 filter icon ở bên dưới banner bên trái */}
        <div className="relative z-30 flex flex-wrap items-center justify-start gap-2.5 mt-auto" ref={filterMenuRef}>
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterDropdownOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#1F2937] text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
              title="Bộ lọc kỷ niệm"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="listbox"
            >
              <WebIcon name="sliders" className="w-4 h-4 text-emerald-700 dark:text-emerald-400 transition-transform group-hover:rotate-45 shrink-0" />
              <span>Bộ lọc kỷ niệm</span>
              {(categoryFilter !== 'all' || companyFilter !== 'all') && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-[10px] font-mono text-emerald-900 dark:text-emerald-200 font-bold">
                  {categoryFilter !== 'all'
                    ? MEMORIES_CATEGORIES.find((c) => c.id === categoryFilter)?.labelVi
                    : MEMORIES_COMPANIES.find((c) => c.id === companyFilter)?.labelVi}
                </span>
              )}
              <WebIcon
                name="chevron-down"
                className={cn(
                  'w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 transition-transform duration-200 shrink-0',
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
                  className="bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-64 max-h-80 overflow-y-auto no-scrollbar rounded-[14px] bg-white/[0.98] dark:bg-[#111827]/[0.96] border border-emerald-200 dark:border-[#334155] shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur-2xl py-2 px-2 z-50 flex flex-col gap-1 text-[#334155] dark:text-[#E2E8F0]"
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider text-[#047857] dark:text-[#6EE7B7]">
                    Theo chủ đề kỷ niệm
                  </div>
                  {MEMORIES_CATEGORIES.map((cat) => {
                    const active = categoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setCategoryFilter(cat.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] text-xs font-bold font-play transition-all cursor-pointer text-left',
                          active
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-[#6EE7B7] border border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                            : 'text-[#334155] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-[#1E1B4B] dark:hover:text-[#F8FAFC] border border-transparent font-medium'
                        )}
                      >
                        <span>{cat.labelVi}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#6EE7B7]" />}
                      </button>
                    );
                  })}

                  <div className="my-1 border-t border-[#E2E8F0] dark:border-[#334155]" />
                  <div className="px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider text-[#047857] dark:text-[#6EE7B7]">
                    Theo đơn vị công tác
                  </div>
                  {MEMORIES_COMPANIES.map((comp) => {
                    const isActive = companyFilter === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setCompanyFilter(comp.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] text-xs font-bold font-play transition-all cursor-pointer text-left',
                          isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-[#6EE7B7] border border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                            : 'text-[#334155] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-[#1E1B4B] dark:hover:text-[#F8FAFC] border border-transparent font-medium'
                        )}
                      >
                        <span className="truncate">{comp.labelVi}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#6EE7B7]" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset filter button nếu có filter */}
          {(categoryFilter !== 'all' || companyFilter !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white text-[11px] font-bold font-play transition-all cursor-pointer shadow-xs active:scale-95"
            >
              ✕ Đặt lại
            </button>
          )}
        </div>
      </motion.div>

      {/* 2. Vùng Album Hình Ảnh Pinterest Masonry — Ảnh lấp đầy thẻ, rê chuột mới hiện chi tiết */}
      <div className="w-full flex-grow relative min-h-[360px]">
        {filteredMemories.length === 0 ? (
          <div
            id="memories-empty-card"
            data-element-type="card"
            className="bento-card glass-card w-full py-16 px-6 rounded-[14px] bg-white/80 dark:bg-[#111827]/85 border border-dashed border-[#CBD5E1] dark:border-[#334155] text-center flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-[14px] bg-rose-100 dark:bg-rose-950/60 text-[#BE185D] dark:text-[#FDA4AF] flex items-center justify-center">
              <WebIcon name="camera" className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC]">Không tìm thấy ảnh kỷ niệm phù hợp với bộ lọc.</p>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Hãy thử chọn lại công ty hoặc chủ đề khác.</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-[14px] bg-rose-600 text-white font-bold text-xs shadow hover:bg-rose-700 transition-all flex items-center gap-1.5 cursor-pointer"
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
                onClick={() => setActiveLightboxIdx(idx)}
                style={{ animationDelay: `${(idx % 16) * 35}ms`, padding: 0 }}
                className="memory-photo-item break-inside-avoid mb-[15px] block w-full relative rounded-[14px] overflow-hidden p-0 m-0 border-0 cursor-pointer group bg-[#0B1220]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.titleVi}
                  className="memory-crisp-img w-full h-full min-h-[200px] object-cover transition-transform duration-500 block m-0 p-0 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                />

                {/* Badge năm & tag luôn hiển thị trên thiết bị cảm ứng, hover mới hiện trên Desktop */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity duration-300 z-10">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-white bg-[#0B1220]/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                    {item.tagVi}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-white bg-[#0B1220]/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {item.year}
                  </span>
                </div>

                {/* Tiêu đề & chi tiết luôn dễ đọc trên thiết bị cảm ứng, hover mới hiện trên Desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/95 via-[#0B1220]/55 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 backdrop-blur-[1.5px] transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none">
                  <span className="text-[10px] font-mono font-bold text-[#6EE7B7] uppercase tracking-wide block">
                    {item.companyId?.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug break-words mt-0.5 flex items-center gap-1.5">
                    <WebIcon name="camera" className="w-3.5 h-3.5 text-[#6EE7B7] shrink-0" />
                    <span>{formatCardTitle(item.titleVi)}</span>
                  </h3>
                  <p className="text-[11px] text-[#E2E8F0] break-words mt-1 leading-tight line-clamp-2">
                    {item.descVi}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/20 text-[10px] font-mono text-[#CBD5E1]">
                    <span className="flex items-center gap-1 truncate">
                      <WebIcon name="location" className="w-3 h-3 text-[#6EE7B7] shrink-0" />
                      <span className="truncate">{item.locationVi}</span>
                    </span>
                    {item.teamSize && (
                      <span className="text-[#67E8F9] font-bold shrink-0 ml-2">
                        {item.teamSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Lightbox Modal với Slideshow & Filmstrip */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 bg-[#0B1220]/95 backdrop-blur-md"
          onClick={() => {
            setActiveLightboxIdx(null);
            setIsSlideshowPlaying(false);
          }}
        >
          <div
            id="memories-lightbox-card"
            data-element-type="card"
            className="w-full max-w-6xl max-h-[94vh] overflow-y-auto no-scrollbar rounded-[14px] bg-[#111827] text-[#F8FAFC] border border-[#334155] shadow-2xl flex flex-col relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ảnh lớn & Điều khiển */}
            <div className="relative w-full h-72 sm:h-[460px] md:h-[520px] bg-[#0B1220] flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.titleVi}
                className="w-full h-full object-contain select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#0B1220]/60 pointer-events-none" />

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
                  <span className="px-3 py-1 rounded-full bg-[#111827]/85 backdrop-blur-md border border-white/20 text-xs font-mono text-[#E2E8F0] font-bold">
                    {(activeLightboxIdx ?? 0) + 1} / {filteredMemories.length}
                  </span>

                  {/* Bật / Tắt Slideshow */}
                  <button
                    type="button"
                    onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                    title={isSlideshowPlaying ? 'Tạm dừng trình chiếu' : 'Tự động trình chiếu 4s'}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSlideshowPlaying
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow animate-pulse'
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
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6EE7B7] bg-emerald-950/90 px-3 py-0.5 rounded-full border border-emerald-500/40">
                    {activePhoto.tagVi}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#E2E8F0] bg-[#1F2937]/90 px-3 py-0.5 rounded-full border border-white/15">
                    {activePhoto.year}
                  </span>
                  <span className="text-xs font-mono font-bold uppercase text-[#FCD34D] bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-500/40">
                    {activePhoto.companyId?.toUpperCase()}
                  </span>
                </div>
                <h3 className="card-title text-base sm:text-xl text-[#F8FAFC]">
                  {activePhoto.titleVi}
                </h3>
              </div>
            </div>

            {/* Dải cuộn ảnh thu nhỏ (Filmstrip) */}
            <div
              ref={filmstripRef}
              className="w-full flex items-center gap-2 px-4 py-2 bg-[#0B1220]/90 border-y border-[#334155] overflow-x-auto no-scrollbar"
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
                  <img src={thumb.imageUrl} alt={thumb.titleVi} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Mô tả chi tiết */}
            <div className="p-4 sm:p-6 flex flex-col gap-4 bg-[#111827]">
              <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8] border-b border-[#334155] pb-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[#E2E8F0]">
                  <WebIcon name="location" className="w-3.5 h-3.5 text-[#6EE7B7]" />
                  <span>{activePhoto.locationVi}</span>
                </div>
                {activePhoto.teamSize && (
                  <div className="flex items-center gap-1.5 text-[#67E8F9]">
                    <WebIcon name="users" className="w-3.5 h-3.5" />
                    <span>Quy mô: {activePhoto.teamSize}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[#FCD34D]">
                  <WebIcon name="building" className="w-3.5 h-3.5" />
                  <span>{MEMORIES_COMPANIES.find((c) => c.id === activePhoto.companyId)?.labelVi}</span>
                </div>
              </div>

              <p className="text-sm text-[#E2E8F0] leading-relaxed font-normal">
                {activePhoto.descVi}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
