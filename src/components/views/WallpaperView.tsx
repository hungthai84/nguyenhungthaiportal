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
import { useFirebase } from '@/context/FirebaseContext';

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
  const { user, cloudWallpapers, saveCloudWallpaper, deleteCloudWallpaper } = useFirebase();
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

  // Gộp danh sách hình nền cloud (nếu đã đăng nhập), tùy chỉnh local + preset gốc
  const allWallpapers = useMemo(() => {
    const map = new Map<string, WallpaperPreset>();
    if (WALLPAPER_PRESETS_LIST[0]) {
      map.set(WALLPAPER_PRESETS_LIST[0].id, WALLPAPER_PRESETS_LIST[0]);
    }
    cloudWallpapers.forEach((wp) => {
      if (wp && wp.id && !isCodePenWallpaper(wp)) map.set(wp.id, wp);
    });
    customWallpapers.forEach((wp) => {
      if (wp && wp.id && !isCodePenWallpaper(wp) && !map.has(wp.id)) map.set(wp.id, wp);
    });
    WALLPAPER_PRESETS_LIST.forEach((wp) => {
      if (wp && wp.id && !isCodePenWallpaper(wp) && !map.has(wp.id)) {
        map.set(wp.id, wp);
      }
    });
    return Array.from(map.values());
  }, [cloudWallpapers, customWallpapers]);

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
    if (user) {
      void saveCloudWallpaper(createdWp);
    }

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
      if (user) {
        validItems.forEach((item) => {
          if (item.isCustom) {
            void saveCloudWallpaper(item);
          }
        });
      }

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
    if (user) {
      void deleteCloudWallpaper(wp.id);
    }
    onShowNotification?.(
      isEn ? `Removed custom wallpaper: ${wp.name}` : `Đã xóa hình nền tùy chỉnh: ${wp.name}`
    );
  };

  const filterCategories = [
    { id: 'all', label: isEn ? 'All Wallpapers' : 'Tất cả hình nền', count: allWallpapers.length },
    {
      id: 'webgl',
      label: isEn ? '3D Dynamic Scenes' : 'Nền động không gian',
      count: allWallpapers.filter((w) => w.type === 'webgl').length,
    },
    { id: 'image', label: isEn ? 'Static Image Walls' : 'Hình nền ảnh tĩnh', count: allWallpapers.filter((w) => w.type === 'image').length },
    { id: 'video', label: isEn ? '4K Motion Videos' : 'Hình nền video động', count: allWallpapers.filter((w) => w.type === 'video').length },
    {
      id: 'css',
      label: isEn ? 'Glass Color Effects' : 'Hiệu ứng màu kính',
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
        className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,24px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 24px)' }}
      >
        <div
          className="project-detail-banner-media absolute inset-0 z-0 rounded-[var(--radius-banner,24px)] overflow-hidden pointer-events-none"
          style={{
            borderRadius: 'var(--radius-banner, 24px)',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
            alt="Banner Hình nền & Giao diện"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center rounded-[14px] transition-all duration-700"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[14px] z-0" />

        {/* Hàng trên: Icon + Tiêu đề bên trái, Câu nói chữ ký bên phải */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon
              name="image"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none"
              style={{ width: '22px', height: '22px' }}
            />
            <h1
              id="el-p14-div-4"
              data-element-id="el-p14-div-4"
              className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
              data-card-title="true"
              style={{
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              Hình nền &amp; Giao diện
            </h1>
          </div>
          <p
            className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
            style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 600, fontStyle: 'normal' }}
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
                className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-play active:scale-95 group"
                title={isEn ? 'Wallpaper Filter' : 'Bộ lọc hình nền'}
                aria-label="Bộ lọc hình nền"
                aria-expanded={isFilterDropdownOpen}
                aria-haspopup="listbox"
              >
                <WebIcon name="sliders" className="w-4 h-4 text-[var(--text-primary)] shrink-0" />
                <span>{isEn ? 'Wallpaper Filter' : 'Bộ lọc hình nền'}</span>
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
                    className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
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
                className="banner-search-input h-9 w-full pl-8 pr-3 py-0 rounded-full typo-input font-play focus:outline-none"
              />
            </div>

            <button
              id="wallpaper-add-toggle-btn"
              type="button"
              onClick={() => {
                SoundEngine.playPop();
                setIsAddModalOpen((prev) => !prev);
              }}
              className="banner-primary-cta h-9 px-3.5 py-0 rounded-full typo-button font-play bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-1.5"
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
                data-media-card={wp.type === 'video' ? 'video' : 'image'}
                style={{
                  borderRadius: 'var(--radius-card, 14px)',
                  padding: wp.type === 'video' ? '5px' : '1px',
                }}
                className={`themed-image-card group relative flex flex-col rounded-[var(--radius-card,14px)] overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none aspect-[16/10] sm:aspect-video w-full h-auto ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : ''
                }`}
              >
                {/* NỀN HÌNH THU NHỎ DẠNG NGANG NẰM GỌN TRONG PADDING (5PX VIDEO / 1PX HÌNH) */}
                <div
                  id={`wallpaper-card-media-${wp.id}`}
                  style={{
                    borderRadius:
                      wp.type === 'video'
                        ? 'calc(var(--radius-card, 14px) - 5px)'
                        : 'calc(var(--radius-card, 14px) - 1px)',
                    background: 'transparent',
                  }}
                  className="relative flex-1 w-full h-full z-0 overflow-hidden bg-transparent"
                >
                  {wp.id === 'none' ? (
                    <div
                      id="wallpaper-card-preview-none"
                      style={{
                        ...activeCardStyleMeta.cardSampleStyle,
                        borderRadius: 'calc(var(--radius-card, 14px) - 1px)',
                      }}
                      className="w-full h-full flex items-center justify-center transition-all"
                    />
                  ) : wp.type === 'video' ? (
                    wp.value.includes('youtube.com') || wp.value.includes('youtu.be') ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
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
                        className="w-full h-full object-cover block"
                      />
                    )
                  ) : wp.type === 'webgl' ? (
                    <div
                      className="relative w-full h-full overflow-hidden"
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
                                className={`absolute rounded-full ${
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
                      className="w-full h-full"
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
                      className="w-full h-full object-cover block brightness-110 contrast-110 saturate-110"
                    />
                  )}
                </div>

                {/* LỚP PHỦ THEO GIAO DIỆN ĐANG CHỌN — CHỈ HIỆN KHI RÊ CHUỘT */}
                <div
                  style={{
                    inset: wp.type === 'video' ? '5px' : '1px',
                    borderRadius:
                      wp.type === 'video'
                        ? 'calc(var(--radius-card, 14px) - 5px)'
                        : 'calc(var(--radius-card, 14px) - 1px)',
                  }}
                  className="themed-image-card-scrim absolute pointer-events-none z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
                />

                {/* NỘI DUNG VÀ CÁC ĐỐI TƯỢNG TRONG CARD (PADDING 15PX, CHỈ HIỆN KHI OVER MOUSE) */}
                <div
                  id={`wallpaper-card-content-${wp.id}`}
                  style={{
                    padding: '15px',
                  }}
                  className="themed-image-card-overlay absolute inset-0 z-20 w-full h-full flex flex-col justify-between p-[15px] opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-300"
                >
                  {/* Dòng trên: Huy hiệu loại media + Nút thao tác */}
                  <div className="flex items-center justify-between gap-1.5 w-full relative z-20">
                    <span className="themed-image-card-badge px-2.5 py-0.5 rounded-full typo-badge font-mono shadow-xs">
                      {wp.id === 'none'
                        ? 'Mặc định'
                        : wp.type === 'webgl'
                        ? isEn
                          ? '3D · Morph'
                          : '3D · Qua trang'
                        : wp.type}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isSelected ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white typo-badge shadow-xs flex items-center gap-1">
                          <WebIcon name="check" className="w-2.5 h-2.5" />
                          <span>Mặc định</span>
                        </span>
                      ) : (
                        <span
                          style={{ background: 'var(--bg-button-primary)' }}
                          className="px-2.5 py-0.5 rounded-full text-white typo-badge shadow-xs transition-all"
                        >
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

                  {/* Dòng dưới: Tiêu đề hình nền đồng bộ theo giao diện đang chọn */}
                  <div className="w-full mt-auto flex items-center justify-between gap-1.5 pt-1 pointer-events-none">
                    <span className="themed-image-card-title typo-badge font-play font-semibold truncate max-w-full">
                      {wp.id === 'none' ? (isEn ? 'Default (System)' : 'Mặc định (Hệ thống)') : title4Words}
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
