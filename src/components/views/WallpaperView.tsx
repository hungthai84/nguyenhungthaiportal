'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  WALLPAPER_PRESETS_LIST,
  WallpaperPreset,
  WallpaperType,
  CUSTOM_WALLPAPERS_STORAGE_KEY,
  ACTIVE_WALLPAPER_STORAGE_KEY,
  parseCssStringToStyle,
  getCleanImageUrl,
  getWallpaperThumbnailUrl,
  isCodePenWallpaper,
} from '@/data/wallpapers';
import {
  saveCustomWallpaperToDB,
  getAllCustomWallpapersFromDB,
  deleteCustomWallpaperFromDB,
  saveActiveWallpaperToDB,
} from '@/utils/indexedDBWallpaper';
import { WebIcon } from '@/components/ui/WebIcon';
import { Modal } from '@/components/ui/Modal';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleConfig } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';

export interface WallpaperViewProps {
  activeWallpaper: WallpaperPreset;
  onSelectWallpaper: (wp: WallpaperPreset) => void;
  onShowNotification?: (msg: string) => void;
  onClose?: () => void;
}

export const WallpaperView: React.FC<WallpaperViewProps> = ({
  activeWallpaper,
  onSelectWallpaper,
  onShowNotification,
  onClose,
}) => {
  const { cardStyle } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  // Danh sách hình nền lưu trữ lâu dài trong localStorage kết hợp danh sách mặc định (loại bỏ các hình nền dạng CodePen)
  const [customWallpapers, setCustomWallpapers] = useState<WallpaperPreset[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_WALLPAPERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((wp) => !isCodePenWallpaper(wp));
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'css' | 'webgl'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFilterDropdownOpen) {
          setIsFilterDropdownOpen(false);
          return;
        }
        if (isAddModalOpen) {
          setIsAddModalOpen(false);
        }
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    if (isFilterDropdownOpen || isAddModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterDropdownOpen, isAddModalOpen]);

  const activeCardStyleMeta = getCardStyleConfig(cardStyle);

  // State trong Modal Thêm Hình Nền & Nhập/Xuất JSON
  const [newName, setNewName] = useState<string>('');
  const [newType, setNewType] = useState<WallpaperType>('image');
  const [newValue, setNewValue] = useState<string>('');
  const [setAsDefaultImmediately, setSetAsDefaultImmediately] = useState<boolean>(true);
  const [jsonText, setJsonText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tải custom wallpapers từ IndexedDB và LocalStorage (tự động xóa bỏ các mục CodePen nếu có)
  useEffect(() => {
    getAllCustomWallpapersFromDB().then((dbList) => {
      if (dbList && dbList.length > 0) {
        dbList.filter((w) => isCodePenWallpaper(w)).forEach((w) => {
          deleteCustomWallpaperFromDB(w.id).catch(() => {});
        });
        const cleanDbList = dbList.filter((w) => !isCodePenWallpaper(w));
        setCustomWallpapers((prev) => {
          const map = new Map<string, WallpaperPreset>();
          prev.filter((w) => !isCodePenWallpaper(w)).forEach((w) => map.set(w.id, w));
          cleanDbList.forEach((w) => map.set(w.id, w));
          return Array.from(map.values());
        });
      }
    }).catch(() => {});
  }, []);

  // Lưu trữ lâu dài customWallpapers vào localStorage & IndexedDB mỗi khi cập nhật
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_WALLPAPERS_STORAGE_KEY, JSON.stringify(customWallpapers));
      customWallpapers.forEach((wp) => saveCustomWallpaperToDB(wp));
    } catch (e) {
      // ignore
    }
  }, [customWallpapers]);

  // Gộp danh sách hình nền tùy chỉnh mới thêm lên đầu + danh sách preset gốc (không trùng ID và không chứa CodePen)
  const allWallpapers = useMemo(() => {
    const map = new Map<string, WallpaperPreset>();
    // Luôn đặt nút "Mặc định / Không dùng hình nền" đầu tiên
    if (WALLPAPER_PRESETS_LIST[0]) {
      map.set(WALLPAPER_PRESETS_LIST[0].id, WALLPAPER_PRESETS_LIST[0]);
    }
    customWallpapers.forEach((wp) => {
      if (wp && wp.id && !isCodePenWallpaper(wp)) map.set(wp.id, wp);
    });
    WALLPAPER_PRESETS_LIST.forEach((wp) => {
      if (wp && wp.id && !isCodePenWallpaper(wp) && !map.has(wp.id)) {
        map.set(wp.id, wp);
      }
    });
    return Array.from(map.values());
  }, [customWallpapers]);

  const filteredWallpapers = useMemo(() => {
    return allWallpapers.filter((wp) => {
      if (wp.id === 'none' && filterType === 'all' && !searchQuery.trim()) return true;
      const matchType =
        filterType === 'all' ||
        wp.type === filterType ||
        (filterType === 'css' && wp.type === 'gradient');
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        wp.name.toLowerCase().includes(q) ||
        wp.type.toLowerCase().includes(q) ||
        wp.value.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [allWallpapers, filterType, searchQuery]);

  // Chọn hình nền và lưu trữ lâu dài làm mặc định
  const handleApplyWallpaper = (wp: WallpaperPreset) => {
    SoundEngine.playPop();
    onSelectWallpaper(wp);
    try {
      localStorage.setItem(ACTIVE_WALLPAPER_STORAGE_KEY, JSON.stringify(wp));
      localStorage.setItem('theme_wallpaper', wp.value || wp.bg || '');
      saveActiveWallpaperToDB(wp);
    } catch (e) {
      // ignore
    }
    if (onShowNotification) {
      if (wp.id === 'none') {
        onShowNotification(
          isEn
            ? '✓ Set Default Wallpaper (Transparent Glass) & saved permanently!'
            : '✓ Đã đặt hình nền Mặc định (Hệ thống) & lưu lâu dài!'
        );
      } else {
        onShowNotification(
          isEn
            ? `✓ Applied & saved permanently: ${t(wp.name)}`
            : `✓ Đã áp dụng & lưu mặc định lâu dài: ${wp.name}`
        );
      }
    }
  };

  // Thêm hình nền mới (Link Video, Link Hình, CSS Hình Nền)
  const handleAddWallpaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedVal = newValue.trim();
    if (!trimmedVal) {
      onShowNotification?.(
        isEn
          ? '⚠️ Please enter a Video URL, Image URL, or CSS code!'
          : '⚠️ Vui lòng nhập đường dẫn Link Video, Link Hình hoặc mã CSS!'
      );
      return;
    }

    const nameLabel =
      newName.trim() ||
      (newType === 'video'
        ? `${isEn ? 'Video Wallpaper' : 'Hình nền Video'} #${allWallpapers.length + 1}`
        : newType === 'css'
        ? `${isEn ? 'CSS Wallpaper' : 'Hình nền CSS'} #${allWallpapers.length + 1}`
        : `${isEn ? 'Wallpaper' : 'Hình nền'} #${allWallpapers.length + 1}`);

    let previewStyle: React.CSSProperties = {};
    if (newType === 'image') {
      previewStyle = {
        backgroundImage: `url('${trimmedVal}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    } else if (newType === 'css' || newType === 'gradient') {
      previewStyle = parseCssStringToStyle(trimmedVal);
    }

    const createdWp: WallpaperPreset = {
      id: `custom-wp-${Date.now()}`,
      name: nameLabel,
      type: newType,
      value: trimmedVal,
      bg: newType === 'image' ? `url('${trimmedVal}') center/cover no-repeat` : trimmedVal,
      previewStyle,
      isCustom: true,
      createdAt: Date.now(),
    };

    setCustomWallpapers((prev) => [createdWp, ...prev]);

    if (setAsDefaultImmediately) {
      handleApplyWallpaper(createdWp);
    } else {
      onShowNotification?.(
        isEn
          ? `✓ Added "${createdWp.name}" to permanent library!`
          : `✓ Đã thêm "${createdWp.name}" vào kho lưu trữ lâu dài!`
      );
    }

    setNewName('');
    setNewValue('');
    setIsAddModalOpen(false);
  };

  // Xuất file JSON toàn bộ danh sách hình nền
  const handleExportJson = () => {
    SoundEngine.playTap();
    const payload = {
      exportedAt: new Date().toISOString(),
      defaultActiveWallpaper: activeWallpaper,
      wallpapers: allWallpapers,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    setJsonText(jsonStr);

    try {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hungthai-wallpapers-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowNotification?.(
        isEn ? '✓ Exported wallpaper library JSON file!' : '✓ Đã xuất tệp JSON kho hình nền thành công!'
      );
    } catch (e) {
      navigator.clipboard?.writeText(jsonStr);
      onShowNotification?.(
        isEn ? '✓ Copied wallpaper JSON to clipboard!' : '✓ Đã sao chép JSON kho hình nền vào bộ nhớ tạm!'
      );
    }
  };

  // Nhập JSON từ chuỗi hoặc tệp
  const importFromJsonString = (rawJson: string) => {
    try {
      const parsed = JSON.parse(rawJson);
      const list: WallpaperPreset[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.wallpapers)
        ? parsed.wallpapers
        : Array.isArray(parsed?.customWallpapers)
        ? parsed.customWallpapers
        : [];

      if (list.length === 0 && parsed?.id && parsed?.type) {
        list.push(parsed as WallpaperPreset);
      }

      if (list.length === 0) {
        onShowNotification?.(
          isEn
            ? '⚠️ JSON format does not contain a valid wallpaper list!'
            : '⚠️ Định dạng JSON không chứa danh sách hình nền hợp lệ!'
        );
        return;
      }

      const validItems = list.filter(
        (item) => item && typeof item.id === 'string' && item.type && !isCodePenWallpaper(item)
      );
      setCustomWallpapers((prev) => {
        const merged = new Map<string, WallpaperPreset>();
        validItems.forEach((item) => merged.set(item.id, item));
        prev.forEach((item) => {
          if (!merged.has(item.id) && !isCodePenWallpaper(item)) merged.set(item.id, item);
        });
        return Array.from(merged.values());
      });

      if (
        parsed?.defaultActiveWallpaper &&
        parsed.defaultActiveWallpaper.id &&
        !isCodePenWallpaper(parsed.defaultActiveWallpaper)
      ) {
        handleApplyWallpaper(parsed.defaultActiveWallpaper);
      }

      onShowNotification?.(
        isEn
          ? `✓ Imported ${validItems.length} wallpapers from JSON & saved permanently!`
          : `✓ Đã nhập thành công ${validItems.length} hình nền từ JSON & lưu lâu dài!`
      );
      setJsonText('');
    } catch (err) {
      onShowNotification?.(
        isEn
          ? '⚠️ JSON syntax error! Please check your input data.'
          : '⚠️ Lỗi cú pháp JSON! Vui lòng kiểm tra lại dữ liệu nhập.'
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = String(evt.target?.result || '');
      setJsonText(content);
      importFromJsonString(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteCustomWallpaper = (wp: WallpaperPreset, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomWallpapers((prev) => prev.filter((item) => item.id !== wp.id));
    onShowNotification?.(
      isEn ? `Removed custom wallpaper: ${wp.name}` : `Đã xóa hình nền tùy chỉnh: ${wp.name}`
    );
  };

  const filterCategories = [
    { id: 'all', label: isEn ? 'All' : 'Tất cả', count: allWallpapers.length },
    {
      id: 'webgl',
      label: isEn ? '3D Dynamic (Page Morph)' : 'Nền Động 3D (Qua trang)',
      count: allWallpapers.filter((w) => w.type === 'webgl').length,
    },
    { id: 'image', label: isEn ? 'Image URLs' : 'Link Hình Ảnh', count: allWallpapers.filter((w) => w.type === 'image').length },
    { id: 'video', label: isEn ? '4K Video URLs' : 'Link Video 4K', count: allWallpapers.filter((w) => w.type === 'video').length },
    {
      id: 'css',
      label: 'CSS & Glass Flat',
      count: allWallpapers.filter((w) => w.type === 'css' || w.type === 'gradient').length,
    },
  ];

  const glassFlatPreset =
    allWallpapers.find((w) => w.id === 'wallpaper-official-gemini') || WALLPAPER_PRESETS_LIST[0];

  return (
    <div
      id="wallpaper-page-container"
      data-element-name="Trang Quản Lý Hình Nền & Giao Diện"
      data-element-type="container"
      data-element-page="wallpaper"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="wallpaper-cards-track"
        data-element-name="Track căn giữa Hình Nền"
        data-element-type="container"
        data-element-page="wallpaper"
        data-element-parent="wallpaper-page-container"
        className="page-cards-track"
      >
        <div
          id="wallpaper-main-card"
          data-main-card="true"
          data-element-name="Thẻ chính Trang Hình Nền"
          data-element-type="card"
          data-element-page="wallpaper"
          data-element-parent="wallpaper-cards-track"
          className="page-main-card flex flex-col justify-start p-[15px] gap-[15px] rounded-[14px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
      {/* 1. BANNER HÌNH NỀN: FORMAT GIỐNG BANNER HỌC VẤN, XÓA NÚT GIAO DIỆN TỐI, CARD SECTION CÁCH 15PX */}
      <section
        id="wallpaper-hero-banner"
        data-element-name="Banner chính trang Hình Nền"
        data-element-type="section"
        data-element-page="wallpaper"
        data-element-parent="wallpaper-main-card"
        data-section-card="true"
        className="banner-card hero-banner w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-visible relative shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: '14px' }}
      >
        <div
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #881337 0%, #e11d48 50%, #1e1b4b 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
            alt="Banner Hình nền & Giao diện"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
        </div>

        {/* Hàng trên: Icon + Tiêu đề bên trái, Câu nói chữ ký bên phải */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <WebIcon
              name="image"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
              style={{ color: '#38bdf8', width: '22px', height: '22px' }}
            />
            <h1
              id="el-p14-div-4"
              data-element-id="el-p14-div-4"
              className="typo-h3 font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] truncate"
              style={{
                color: '#38bdf8',
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              Hình nền & Giao diện
            </h1>
          </div>
          <p
            className="typo-h3 font-handwriting font-italianno not-italic font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
            style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontWeight: 700, fontStyle: 'normal' }}
          >
            &quot;Không gian trực quan khơi nguồn cảm hứng sáng tạo ♡&quot;
          </p>
        </div>

        {/* Hàng dưới: Bộ lọc danh mục bên trái + Tìm kiếm, Dạng thẻ & Thêm Hình bên phải */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative inline-block text-left" ref={filterMenuRef}>
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setIsFilterDropdownOpen((prev) => !prev);
                }}
                className="banner-control-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer typo-button font-play active:scale-95 group"
                title={isEn ? 'Filter' : 'Bộ lọc'}
                aria-label="Bộ lọc hình nền"
                aria-expanded={isFilterDropdownOpen}
                aria-haspopup="listbox"
              >
                <WebIcon name="sliders" className="w-4 h-4 text-[var(--text-primary)] transition-transform group-hover:rotate-45 shrink-0" />
                <span>{isEn ? 'Filter' : 'Bộ lọc'}</span>
                <span className="banner-count-pill px-2 py-0.5 rounded-full typo-badge font-mono">
                  {filteredWallpapers.length}
                </span>
                <WebIcon
                  name="chevron-down"
                  className={`w-3.5 h-3.5 text-[var(--text-primary)] transition-transform duration-200 shrink-0 ${
                    isFilterDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    id="wallpaper-filter-listbox"
                    data-element-type="card"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    role="listbox"
                    className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-[min(18rem,calc(100vw-96px))] sm:w-72 rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                  >
                    {filterCategories.map((cat) => {
                      const isActive = filterType === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-selected={isActive ? 'true' : 'false'}
                          onClick={() => {
                            SoundEngine.playTap();
                            setFilterType(cat.id as any);
                            setIsFilterDropdownOpen(false);
                          }}
                          className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                        >
                          <span className="truncate">{cat.label}</span>
                          <span className="banner-count-pill px-2 py-0.5 rounded-full typo-badge font-mono">
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tìm kiếm + Dạng thẻ + Thêm hình */}
          <div id="wallpaper-banner-right-actions" className="flex items-center justify-end gap-2 flex-wrap ml-auto w-full sm:w-auto min-w-0">
            <div id="wallpaper-search-wrapper" className="relative w-full sm:w-auto min-w-0 sm:min-w-[210px] max-w-full">
              <WebIcon
                name="search"
                className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                id="wallpaper-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Tìm hình nền, video, css..."
                className="banner-search-input w-full pl-8 pr-3 py-1.5 rounded-full typo-input font-play focus:outline-none"
              />
            </div>

            <button
              id="wallpaper-add-toggle-btn"
              type="button"
              onClick={() => {
                SoundEngine.playPop();
                setIsAddModalOpen((prev) => !prev);
              }}
              className="banner-primary-cta px-3.5 py-1.5 rounded-full typo-button font-play bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-1.5"
            >
              <WebIcon name="plus" className="w-3.5 h-3.5" />
              <span>Thêm hình</span>
            </button>
          </div>
        </div>
      </section>

      {/* KHUNG THÊM HÌNH NỀN MỚI & NHẬP / XUẤT JSON XUẤT HIỆN NGAY DƯỚI BANNER KHI CLICK NÚT "THÊM HÌNH" */}
      {isAddModalOpen && (
        <section
          id="wallpaper-add-panel"
          data-element-name="Khung thêm hình nền dưới banner"
          data-element-type="section"
          data-element-page="wallpaper"
          className="bento-card glass-card w-full rounded-[14px] p-[15px] flex flex-col gap-[15px] font-play text-left shrink-0 animate-fadeIn"
          style={{ padding: '15px' }}
        >
          <div id="wallpaper-add-panel-header" className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-2.5">
            <div className="card-header-sync flex items-center gap-2 text-[var(--color-primary)]">
              <WebIcon name="plus" className="w-4.5 h-4.5 text-[var(--color-primary)]" />
              <h3 id="wallpaper-add-panel-title" className="typo-h3 card-title-synced text-[var(--color-primary)]" data-card-title="true">
                Thêm Hình Nền Mới & Nhập / Xuất Dữ Liệu JSON
              </h3>
            </div>
            <button
              id="wallpaper-add-panel-close-btn"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="banner-control-pill px-3 py-1 rounded-full typo-button transition cursor-pointer flex items-center gap-1"
            >
              <WebIcon name="x" className="w-3.5 h-3.5" />
              <span>Thu gọn</span>
            </button>
          </div>

          <div id="wallpaper-add-panel-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-stretch">
            {/* PHẦN 1: FORM THÊM HÌNH NỀN */}
            <form
              id="wallpaper-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                const link = newValue.trim();
                if (!link) {
                  onShowNotification?.(
                    isEn
                      ? '⚠️ Please enter an Image, Video, or CSS URL!'
                      : '⚠️ Vui lòng nhập đường dẫn Link Hình ảnh, Video hoặc CSS!'
                  );
                  return;
                }

                let detectedType: WallpaperType = 'image';
                let autoName = newName.trim();

                if (link.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || link.includes('youtube.com') || link.includes('youtu.be')) {
                  detectedType = 'video';
                  if (!autoName) autoName = `Video Background #${allWallpapers.length + 1}`;
                } else if (link.includes('codepen.io')) {
                  onShowNotification?.(
                    isEn
                      ? '⚠️ CodePen wallpapers are no longer supported!'
                      : '⚠️ Hệ thống không còn hỗ trợ hình nền dạng CodePen!'
                  );
                  return;
                } else if (link.includes('gradient') || link.includes('linear-gradient') || link.startsWith('#') || link.startsWith('rgb')) {
                  detectedType = 'css';
                  if (!autoName) autoName = `CSS Gradient #${allWallpapers.length + 1}`;
                } else {
                  detectedType = 'image';
                  if (!autoName) {
                    const segments = link.split('/');
                    const lastSeg = segments[segments.length - 1]?.split('?')[0];
                    autoName = lastSeg && lastSeg.length > 3 ? decodeURIComponent(lastSeg).replace(/\.[^/.]+$/, '') : `${isEn ? 'Wallpaper' : 'Hình nền'} #${allWallpapers.length + 1}`;
                  }
                }

                let previewStyle: React.CSSProperties = {};
                if (detectedType === 'image') {
                  previewStyle = {
                    backgroundImage: `url('${link}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  };
                } else if (detectedType === 'css') {
                  previewStyle = parseCssStringToStyle(link);
                }

                const createdWp: WallpaperPreset = {
                  id: `custom-wp-${Date.now()}`,
                  name: autoName,
                  type: detectedType,
                  value: link,
                  bg: detectedType === 'image' ? `url('${link}') center/cover no-repeat` : link,
                  previewStyle,
                  isCustom: true,
                  createdAt: Date.now(),
                };

                setCustomWallpapers((prev) => [createdWp, ...prev]);
                handleApplyWallpaper(createdWp);
                setNewValue('');
                setNewName('');
                setIsAddModalOpen(false);
                onShowNotification?.(
                  isEn
                    ? `✓ Auto-detected and added: "${autoName}"!`
                    : `✓ Đã tự động nhận diện và thêm: "${autoName}"!`
                );
              }}
              data-subcard="true"
              className="sub-card p-[15px] rounded-[14px] flex flex-col justify-between gap-3"
            >
              <div className="space-y-3">
                <h4 className="subcard-header-sync subcard-title-synced typo-h4 text-[var(--color-primary)] flex items-center gap-2" data-subcard-title="true">
                  <WebIcon name="plus" className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>1. Thêm Hình Nền Mới (Tự Động Nhận Diện Link & Tên Hình)</span>
                </h4>

                <div>
                  <label className="typo-label text-[var(--text-secondary)] block mb-1">
                    Đường dẫn Link hoặc Mã CSS (Auto nhận diện)
                  </label>
                  <input
                    id="wallpaper-add-url-input"
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Dán link hình ảnh, video .mp4, YouTube hoặc mã gradient CSS vào đây..."
                    className="theme-input w-full px-3.5 py-2 rounded-[14px] typo-input font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="typo-label text-[var(--text-secondary)] block mb-1">
                    Tên hình nền (Tùy chọn - để trống sẽ tự động lấy tên theo link)
                  </label>
                  <input
                    id="wallpaper-add-name-input"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="VD: Không gian vũ trụ 4K..."
                    className="theme-input w-full px-3.5 py-2 rounded-[14px] typo-input focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  id="wallpaper-add-submit-btn"
                  type="submit"
                  style={{ background: 'var(--bg-button-primary)' }}
                  className="px-5 py-2 rounded-full typo-button text-white shadow-md hover:brightness-110 transition cursor-pointer"
                >
                  Thêm & Áp Dụng Ngay
                </button>
              </div>
            </form>

            {/* PHẦN 2: NHẬP / XUẤT JSON */}
            <div id="wallpaper-json-panel" data-subcard="true" className="sub-card p-[15px] rounded-[14px] flex flex-col justify-between gap-3">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="subcard-header-sync subcard-title-synced typo-h4 text-[var(--color-primary)] flex items-center gap-2" data-subcard-title="true">
                    <WebIcon name="database" className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>2. Nhập / Xuất Dữ Liệu Hình Nền Bằng JSON</span>
                  </h4>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      id="wallpaper-json-import-file-btn"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-full typo-button bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <WebIcon name="upload" className="w-3.5 h-3.5" />
                      <span>Nhập File JSON</span>
                    </button>

                    <button
                      id="wallpaper-json-export-file-btn"
                      type="button"
                      onClick={handleExportJson}
                      style={{ background: 'var(--bg-button-primary)' }}
                      className="px-3.5 py-1.5 rounded-full typo-button hover:brightness-110 text-white transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <WebIcon name="download" className="w-3.5 h-3.5" />
                      <span>Xuất File JSON</span>
                    </button>
                  </div>
                </div>

                <textarea
                  id="wallpaper-json-textarea"
                  rows={4}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='Dán nội dung JSON hình nền vào đây để nhập nhanh (VD: [{"id": "wp-1", "name": "Hình nền 1", "type": "image", "value": "https://..."}])'
                  className="theme-input w-full px-3 py-2 rounded-[14px] typo-input font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  id="wallpaper-json-import-text-btn"
                  type="button"
                  onClick={() => importFromJsonString(jsonText)}
                  disabled={!jsonText.trim()}
                  style={{ background: 'var(--bg-button-primary)' }}
                  className="px-4 py-1.5 rounded-full typo-button disabled:opacity-40 text-white hover:brightness-110 transition cursor-pointer"
                >
                  Nhập Dữ Liệu Từ Ô JSON
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LƯỚI HÌNH NỀN THU NHỎ HOẶC EMPTY STATE */}
      {filteredWallpapers.length === 0 ? (
        <div className="bento-card glass-card flex-1 flex flex-col items-center justify-center text-center py-12 px-4 rounded-[14px]">
          <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mb-3">
            <WebIcon name="image" className="w-6 h-6" />
          </div>
          <p className="typo-h4 text-[var(--text-heading,var(--text-primary))] font-play">
            Không tìm thấy hình nền phù hợp
          </p>
          <p className="typo-caption text-[var(--text-secondary)] mt-1 max-w-md">
            Hãy thử thay đổi bộ lọc loại media hoặc xóa từ khóa tìm kiếm hiện tại.
          </p>
          <button
            type="button"
            onClick={() => {
              SoundEngine.playTap();
              setFilterType('all');
              setSearchQuery('');
            }}
            style={{ background: 'var(--bg-button-primary)' }}
            className="mt-4 px-5 py-2 rounded-full typo-button hover:brightness-110 text-white transition cursor-pointer shadow-sm"
          >
            Xem lại tất cả hình nền
          </button>
        </div>
      ) : (
      <div id="wallpaper-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[15px] items-stretch flex-1">
          {filteredWallpapers.map((wp) => {
            const isSelected = activeWallpaper?.id === wp.id;
            const isCustomAdded = customWallpapers.some((c) => c.id === wp.id);
            const localizedName = t(wp.name);
            const titleWords = localizedName.trim().split(/\s+/);
            const title4Words = titleWords.length <= 4 ? localizedName : titleWords.slice(0, 4).join(' ');

            return (
              <div
                id={`wallpaper-card-${wp.id}`}
                key={wp.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleApplyWallpaper(wp)}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleApplyWallpaper(wp);
                  }
                }}
                title={
                  isEn
                    ? `${localizedName} (Click to apply as default wallpaper)`
                    : `${wp.name} (Nhấp chuột để áp dụng làm hình nền mặc định)`
                }
                data-element-type="card"
                style={{
                  borderRadius: '14px',
                  padding: '0px',
                }}
                className={`themed-image-card group relative flex flex-col rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none aspect-[16/10] sm:aspect-video w-full h-auto bg-slate-950 ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : ''
                }`}
              >
                {/* NỀN HÌNH THU NHỎ DẠNG NGANG (LẮP ĐẦY TOÀN BỘ CARD) */}
                <div
                  id={`wallpaper-card-media-${wp.id}`}
                  className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950"
                >
                  {wp.id === 'none' ? (
                    <div
                      id="wallpaper-card-content-none"
                      style={activeCardStyleMeta.cardSampleStyle}
                      className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-3 text-center transition-all"
                    >
                      <WebIcon name="sparkles" className="w-8 h-8 text-[var(--color-primary)] drop-shadow-xs" />
                      <span className="typo-badge font-play text-[var(--text-primary)] drop-shadow-xs">Mặc định (Hệ thống)</span>
                    </div>
                  ) : wp.type === 'video' ? (
                    wp.value.includes('youtube.com') || wp.value.includes('youtu.be') ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={
                          wp.previewStyle || {
                            backgroundImage:
                              "url('https://img.youtube.com/vi/Jox6R5-rIH0/hqdefault.jpg')",
                          }
                        }
                      />
                    ) : (
                      <video
                        src={wp.value}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )
                  ) : wp.type === 'webgl' ? (
                    <div
                      className="relative w-full h-full overflow-hidden transition-transform duration-500 group-hover:scale-105"
                      style={
                        wp.previewStyle && Object.keys(wp.previewStyle).length > 0
                          ? wp.previewStyle
                          : { background: wp.value || wp.bg }
                      }
                    >
                      {/* Cụm cầu 3D thu nhỏ đại diện cho trường hấp dẫn GRAVITY */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {(wp.gravityConfig?.previewSpheres || ['#2F69FF', '#A8C1FF', '#4D80FF', '#ECEFFF']).map(
                          (sphereColor, sIdx) => {
                            const positions = [
                              'w-14 h-14 -translate-x-7 -translate-y-2',
                              'w-10 h-10 translate-x-6 -translate-y-4',
                              'w-12 h-12 translate-x-2 translate-y-3',
                              'w-8 h-8 -translate-x-2 translate-y-4',
                            ];
                            const isGlassOrb = sIdx === 3;
                            return (
                              <span
                                key={`${wp.id}-orb-${sIdx}`}
                                className={`absolute rounded-full transition-transform duration-500 group-hover:scale-110 ${
                                  positions[sIdx % positions.length]
                                }`}
                                style={
                                  isGlassOrb
                                    ? {
                                        background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.95) 0%, ${sphereColor}55 48%, ${sphereColor}88 100%)`,
                                        border: '1px solid rgba(255,255,255,0.75)',
                                        boxShadow: `inset 0 2px 6px rgba(255,255,255,0.85), 0 8px 18px ${sphereColor}55`,
                                        backdropFilter: 'blur(4px)',
                                      }
                                    : {
                                        background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${sphereColor} 58%, rgba(15,23,42,0.28) 100%)`,
                                        boxShadow: `inset -3px -4px 8px rgba(15,23,42,0.14), 0 8px 18px ${sphereColor}50`,
                                      }
                                }
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  ) : wp.type === 'css' || wp.type === 'gradient' ? (
                    <div
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      style={
                        wp.previewStyle && Object.keys(wp.previewStyle).length > 0
                          ? wp.previewStyle
                          : parseCssStringToStyle(wp.value)
                      }
                    />
                  ) : (
                    <img
                      src={getWallpaperThumbnailUrl(wp.value || wp.bg || '')}
                      alt={wp.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const originalUrl = getCleanImageUrl(wp.value || wp.bg || '');
                        if (e.currentTarget.src !== originalUrl) {
                          e.currentTarget.src = originalUrl;
                          return;
                        }
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.style.background = 'linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #e11d48 100%)';
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-110 contrast-110 saturate-110"
                    />
                  )}
                </div>

                {/* OVERLAY TỐI DƯỚI ĐÁY TẤM HÌNH */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent pointer-events-none z-10" />

                {/* NỘI DUNG VÀ CÁC NÚT ĐƯỢC ĐƯA VÀO BÊN TRONG CARD (PADDING 10PX THEO YÊU CẦU) */}
                <div
                  id={`wallpaper-card-content-${wp.id}`}
                  style={{
                    padding: '10px',
                  }}
                  className="absolute inset-0 z-20 w-full h-full flex flex-col justify-between text-white pointer-events-auto p-[10px]"
                >
                  {/* Dòng trên: Huy hiệu loại media + Nút thao tác */}
                  <div className="flex items-center justify-between gap-1 w-full relative z-20">
                    <span
                      className={`px-2 py-0.5 rounded-full typo-badge font-mono text-white shadow-xs backdrop-blur-md border border-white/20 ${
                        wp.type === 'webgl'
                          ? 'bg-indigo-600/90'
                          : wp.type === 'video'
                          ? 'bg-purple-600/90'
                          : wp.type === 'css' || wp.type === 'gradient'
                          ? 'bg-emerald-600/90'
                          : 'bg-sky-600/90'
                      }`}
                    >
                      {wp.id === 'none'
                        ? 'Mặc định'
                        : wp.type === 'webgl'
                        ? isEn
                          ? '3D · Morph'
                          : '3D · Qua trang'
                        : wp.type}
                    </span>

                    <div className="flex items-center gap-1">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white typo-badge shadow-xs flex items-center gap-1 backdrop-blur-md">
                          <WebIcon name="check" className="w-2.5 h-2.5" />
                          <span>Mặc định</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/25 hover:bg-cyan-500 text-white typo-badge shadow-xs backdrop-blur-md transition-all">
                          Áp dụng
                        </span>
                      )}
                      {isCustomAdded && wp.id !== 'none' && (
                        <button
                          id={`wallpaper-card-delete-${wp.id}`}
                          type="button"
                          onClick={(e) => handleDeleteCustomWallpaper(wp, e)}
                          title="Xóa hình nền này"
                          className="w-5 h-5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-110 cursor-pointer"
                        >
                          <WebIcon name="x" className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dòng dưới: Tiêu đề hình nền thu nhỏ rõ ràng */}
                  <div className="w-full mt-auto flex items-center justify-between gap-1 pt-1 pointer-events-none">
                    <span className="typo-badge font-play text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate max-w-full">
                      {title4Words}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      )}
        </div>
      </div>
    </div>
  );
};
