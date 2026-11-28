'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  WALLPAPER_PRESETS_LIST,
  WallpaperPreset,
  WallpaperType,
  CUSTOM_WALLPAPERS_STORAGE_KEY,
  ACTIVE_WALLPAPER_STORAGE_KEY,
  parseCssStringToStyle,
  isCodePenWallpaper,
} from '@/data/wallpapers';
import {
  saveCustomWallpaperToDB,
  getAllCustomWallpapersFromDB,
  deleteCustomWallpaperFromDB,
  saveActiveWallpaperToDB,
} from '@/utils/indexedDBWallpaper';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleConfig } from '@/hooks/useTheme';
import { compressImageFileToWebP } from '@/utils/imageWebp';
import type { WaveMotionMode } from '@/config/ui/theme.types';
import { useLanguage } from '@/context/LanguageContext';
import { useFirebase } from '@/context/FirebaseContext';
import type { SmartFilterCategory } from './wallpaper/WallpaperStudioControls';
import { WallpaperGridCard } from './wallpaper/WallpaperGridCard';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import { SpringDropdownMenu, SpringTick } from '@/components/ui/SpringDropdown';

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
  const { cardStyle, waveMotion, setWaveMotion } = useTheme();
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

  const [filterType, setFilterType] = useState<SmartFilterCategory>('all');
  const wallpaperBannerVideo = getDefaultBannerVideoConfig('wallpaper');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const localMediaInputRef = useRef<HTMLInputElement | null>(null);

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

  // Lưu trữ customWallpapers vào localStorage (IndexedDB chỉ ghi/xóa đúng mục phát sinh)
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_WALLPAPERS_STORAGE_KEY, JSON.stringify(customWallpapers));
    } catch (e) {
      // ignore
    }
  }, [customWallpapers]);

  // Đã gỡ bỏ tính năng xem trước khi rê/nhấn giữ trong Trang Hình nền theo cấu hình mới

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

  const userUploadedIds = useMemo(() => {
    const ids = new Set<string>();
    cloudWallpapers.forEach((w) => w?.id && ids.add(w.id));
    customWallpapers.forEach((w) => w?.id && ids.add(w.id));
    return ids;
  }, [cloudWallpapers, customWallpapers]);

  const matchesCategory = (wp: WallpaperPreset, cat: SmartFilterCategory): boolean => {
    if (cat === 'all') return true;
    if (cat === 'video') return wp.type === 'video';
    if (cat === 'webgl') return wp.type === 'webgl';
    if (cat === 'minimal') return wp.type === 'image' || wp.type === 'css' || wp.type === 'gradient' || wp.id === 'none';
    if (cat === 'custom') return userUploadedIds.has(wp.id);
    return true;
  };

  const filterCounts = useMemo<Record<SmartFilterCategory, number>>(
    () => ({
      all: allWallpapers.length,
      video: allWallpapers.filter((w) => matchesCategory(w, 'video')).length,
      webgl: allWallpapers.filter((w) => matchesCategory(w, 'webgl')).length,
      minimal: allWallpapers.filter((w) => matchesCategory(w, 'minimal')).length,
      custom: allWallpapers.filter((w) => matchesCategory(w, 'custom')).length,
    }),
    [allWallpapers, userUploadedIds]
  );

  const filteredWallpapers = useMemo(() => {
    return allWallpapers.filter((wp) => {
      if (wp.id === 'none' && filterType === 'all' && !searchQuery.trim()) return true;
      const matchType = matchesCategory(wp, filterType);
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        wp.name.toLowerCase().includes(q) ||
        wp.type.toLowerCase().includes(q) ||
        wp.value.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [allWallpapers, filterType, searchQuery, userUploadedIds]);

  // Chọn hình nền và lưu trữ lâu dài làm mặc định
  const handleApplyWallpaper = useCallback(
    (wp: WallpaperPreset) => {
      SoundEngine.playPop();
      onSelectWallpaper(wp);
      try {
        localStorage.setItem(ACTIVE_WALLPAPER_STORAGE_KEY, JSON.stringify(wp));
        localStorage.setItem('theme_wallpaper', wp.value || wp.bg || '');
        void saveActiveWallpaperToDB(wp);
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
    },
    [isEn, onSelectWallpaper, onShowNotification, t]
  );

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
    void saveCustomWallpaperToDB(createdWp);
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

  void handleAddWallpaperSubmit;
  void onClose;
  void setNewType;
  void setSetAsDefaultImmediately;

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
      validItems.forEach((item) => {
        void saveCustomWallpaperToDB(item);
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

  const handleDeleteCustomWallpaper = useCallback(
    (wp: WallpaperPreset, e: React.MouseEvent) => {
      e.stopPropagation();
      setCustomWallpapers((prev) => prev.filter((item) => item.id !== wp.id));
      void deleteCustomWallpaperFromDB(wp.id);
      if (wp.value && wp.value.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(wp.value);
        } catch {
          // ignore
        }
      }
      if (user) {
        void deleteCloudWallpaper(wp.id);
      }
      onShowNotification?.(
        isEn ? `Removed custom wallpaper: ${wp.name}` : `Đã xóa hình nền tùy chỉnh: ${wp.name}`
      );
    },
    [deleteCloudWallpaper, isEn, onShowNotification, user]
  );

  const handleLocalMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      onShowNotification?.(
        isEn ? '⚠️ Please select an image or video file!' : '⚠️ Vui lòng chọn tệp hình ảnh hoặc video hợp lệ!'
      );
      e.target.value = '';
      return;
    }

    const baseName = file.name.replace(/\.[^/.]+$/, '') || (isVideo ? 'Video cá nhân' : 'Hình ảnh cá nhân');
    if (isVideo) {
      const objectUrl = URL.createObjectURL(file);
      const createdWp: WallpaperPreset = {
        id: `custom-wp-upload-${Date.now()}`,
        name: baseName,
        type: 'video',
        value: objectUrl,
        bg: objectUrl,
        isCustom: true,
        createdAt: Date.now(),
      };
      setCustomWallpapers((prev) => [createdWp, ...prev]);
      void saveCustomWallpaperToDB(createdWp);
      handleApplyWallpaper(createdWp);
      setIsAddModalOpen(false);
      e.target.value = '';
      return;
    }

    e.target.value = '';
    try {
      const result = await compressImageFileToWebP(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.84,
      });
      const dataUrl = result.dataUrl;
      if (!dataUrl) return;
      const createdWp: WallpaperPreset = {
        id: `custom-wp-upload-${Date.now()}`,
        name: baseName,
        type: 'image',
        value: dataUrl,
        bg: `url('${dataUrl}') center/cover no-repeat`,
        previewStyle: {
          backgroundImage: `url('${dataUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        isCustom: true,
        createdAt: Date.now(),
      };
      setCustomWallpapers((prev) => [createdWp, ...prev]);
      void saveCustomWallpaperToDB(createdWp);
      if (user) {
        void saveCloudWallpaper(createdWp);
      }
      handleApplyWallpaper(createdWp);
      setIsAddModalOpen(false);
    } catch {
      onShowNotification?.(isEn ? 'Could not optimize uploaded image.' : 'Không thể xử lý hình ảnh tải lên.');
    }
  };

  const filterCategories: Array<{ id: SmartFilterCategory; label: string; icon: string; count: number }> = [
    { id: 'all', label: isEn ? 'All' : 'Tất cả', icon: 'grid', count: filterCounts.all },
    { id: 'video', label: isEn ? 'Motion Video' : 'Video động', icon: 'video', count: filterCounts.video },
    { id: 'minimal', label: isEn ? 'Minimal Static' : 'Tĩnh tối giản', icon: 'image', count: filterCounts.minimal },
    { id: 'custom', label: isEn ? 'Personal Uploads' : 'Cá nhân tải lên', icon: 'upload', count: filterCounts.custom },
  ];

  const activeFilterCategory =
    filterCategories.find((cat) => cat.id === filterType) || filterCategories[0];

  return (
    <div
      id="wallpaper-page-container"
      data-element-name="Trang Quản Lý Hình Nền & Giao Diện"
      data-element-type="container"
      data-element-page="wallpaper"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left rounded-none box-border"
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
          data-floating-surface="main"
          data-element-name="Thẻ chính Trang Hình Nền"
          data-element-type="card"
          data-element-page="wallpaper"
          data-element-parent="wallpaper-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main flex flex-col justify-start p-[15px] gap-[15px] rounded-[14px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
      {/* 1. BANNER HÌNH NỀN: FORMAT GIỐNG BANNER HỌC VẤN, XÓA NÚT GIAO DIỆN TỐI, CARD SECTION CÁCH 15PX */}
      <section
        id="wallpaper-hero-banner"
        data-element-name="Banner chính trang Hình Nền"
        data-element-type="section"
        data-element-page="wallpaper"
        data-element-parent="wallpaper-main-card"
        data-section-card="true"
        data-has-compact-menu="true"
        className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 14px)' }}
      >
        <div
          className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
        >
          <VideoBanner
            videoId={wallpaperBannerVideo.videoId}
            title={wallpaperBannerVideo.title}
            className="rounded-[inherit]"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

        {/* Hàng trên: Tiêu đề bên trái, Câu nói chữ ký bên phải */}
        <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon name="image" className="w-[22px] h-[22px] shrink-0" />
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
              Thư viện hình nền
            </h1>
          </div>
          <p
            className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
            style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 600, fontStyle: 'normal' }}
          >
            &quot;Không gian trực quan khơi nguồn cảm hứng sáng tạo ♡&quot;
          </p>

          <CompactBannerMenu
            id="wallpaper-compact-menu-btn"
            label={isEn ? 'Controls' : 'Điều khiển'}
            ariaLabel={isEn ? 'Wallpaper filters, search and settings' : 'Bộ lọc, tìm kiếm và thêm hình nền'}
            activeCount={(filterType !== 'all' ? 1 : 0) + (searchQuery.trim() ? 1 : 0)}
          >
            {(closeMenu) => (
              <>
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
                      placeholder={isEn ? 'Search wallpaper, video, css...' : 'Tìm hình nền, video, css...'}
                      className="banner-search-input h-9 w-full pl-8 pr-8 py-0 rounded-full typo-input font-play focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        <WebIcon name="x" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="typo-label text-[var(--text-muted)] px-1">
                    {isEn ? 'Category' : 'Bộ lọc hình nền'}
                  </span>
                  {filterCategories.map((cat) => {
                    const isActive = filterType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-selected={isActive ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playTap();
                          setFilterType(cat.id as SmartFilterCategory);
                          closeMenu();
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <WebIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0 opacity-85" />
                          <span className="truncate">{cat.label}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 shrink-0">
                          <span className="typo-badge font-mono opacity-80 tabular-nums">({cat.count})</span>
                          {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="typo-label text-[var(--text-muted)] px-1">
                    {isEn ? 'Ambient wave' : 'Chuyển động sóng nền'}
                  </span>
                  <div className="banner-control-pill w-full grid grid-cols-4 gap-1 p-1 rounded-full">
                    {(
                      [
                        { id: 'off', labelVi: 'Tắt', labelEn: 'Off' },
                        { id: 'gentle', labelVi: 'Nhẹ', labelEn: 'Gentle' },
                        { id: 'normal', labelVi: 'Chuẩn', labelEn: 'Normal' },
                        { id: 'vivid', labelVi: 'Mạnh', labelEn: 'Vivid' },
                      ] as Array<{ id: WaveMotionMode; labelVi: string; labelEn: string }>
                    ).map((opt) => {
                      const active = waveMotion === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            SoundEngine.playTap();
                            setWaveMotion(opt.id);
                            onShowNotification?.(
                              isEn ? `✓ Wave motion: ${opt.labelEn}` : `✓ Sóng nền: ${opt.labelVi}`
                            );
                          }}
                          style={
                            active
                              ? {
                                  background: 'var(--bg-button-primary)',
                                  color: 'var(--text-button-primary, #FFFFFF)',
                                }
                              : undefined
                          }
                          className={`h-7 px-2 rounded-full typo-badge font-semibold whitespace-nowrap cursor-pointer transition-all ${
                            active ? 'shadow-2xs' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {isEn ? opt.labelEn : opt.labelVi}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playPop();
                    setIsAddModalOpen((prev) => !prev);
                    closeMenu();
                  }}
                  className="banner-primary-cta h-9 w-full px-3.5 rounded-full typo-button font-bold font-play bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white shadow-md hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <WebIcon name="plus" className="w-3.5 h-3.5" />
                  <span>{isAddModalOpen ? (isEn ? 'Close add panel' : 'Đóng thêm hình') : (isEn ? 'Add wallpaper' : 'Thêm hình')}</span>
                </button>
              </>
            )}
          </CompactBannerMenu>
        </div>

        {/* Hàng dưới: Bộ lọc danh mục bên trái + Tìm kiếm, Dạng thẻ & Thêm Hình bên phải */}
        <div className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative inline-block text-left" ref={filterMenuRef}>
              <button
                id="wallpaper-filter-trigger"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setIsFilterDropdownOpen((prev) => !prev);
                }}
                className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play group"
                title={isEn ? 'Wallpaper Filter' : 'Bộ lọc hình nền'}
                aria-label="Bộ lọc hình nền"
                aria-expanded={isFilterDropdownOpen}
                aria-haspopup="listbox"
              >
                <WebIcon name={filterType === 'all' ? 'sliders' : activeFilterCategory.icon} className="w-4 h-4 text-[var(--text-primary)] shrink-0" />
                <span>
                  {filterType === 'all'
                    ? isEn
                      ? 'Wallpaper Filter'
                      : 'Bộ lọc hình nền'
                    : `${isEn ? 'Filter' : 'Lọc'}: ${activeFilterCategory.label}`}
                </span>
                <span className="tabular-nums text-[11px] font-mono opacity-80">
                  ({activeFilterCategory.count})
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
                  <SpringDropdownMenu
                    id="wallpaper-filter-listbox"
                    data-element-type="card"
                    placement="down"
                    origin="0% 0%"
                    role="listbox"
                    className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[15.5rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                  >
                    {filterCategories.map((cat) => {
                      const isActive = filterType === cat.id;
                      return (
                        <button
                          key={cat.id}
                          id={`wallpaper-filter-option-${cat.id}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-selected={isActive ? 'true' : 'false'}
                          onClick={() => {
                            SoundEngine.playTap();
                            setFilterType(cat.id as SmartFilterCategory);
                            setIsFilterDropdownOpen(false);
                          }}
                          className="theme-dropdown-option w-full flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left"
                        >
                          <span className="inline-flex items-center gap-2 min-w-0">
                            <WebIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0 opacity-85" />
                            <span className="truncate">{cat.label}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 shrink-0">
                            <span className="typo-badge font-mono opacity-80 tabular-nums">
                              ({cat.count})
                            </span>
                            {isActive && <SpringTick active={isActive} />}
                          </span>
                        </button>
                      );
                    })}
                  </SpringDropdownMenu>
                )}
              </AnimatePresence>
            </div>

            {/* Điều khiển hiệu ứng sóng nền */}
            <div
              id="wallpaper-wave-motion-group"
              role="group"
              aria-label={isEn ? 'Ambient wave motion' : 'Chuyển động sóng nền'}
              className="banner-control-pill h-9 inline-flex items-center gap-0.5 px-1.5 rounded-full shrink-0"
            >
              <span className="inline-flex items-center gap-1 pl-1.5 pr-1 typo-badge font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                <WebIcon name="waves" className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                <span className="hidden md:inline">{isEn ? 'Wave' : 'Sóng nền'}</span>
              </span>
              {(
                [
                  { id: 'off', labelVi: 'Tắt', labelEn: 'Off' },
                  { id: 'gentle', labelVi: 'Nhẹ', labelEn: 'Gentle' },
                  { id: 'normal', labelVi: 'Chuẩn', labelEn: 'Normal' },
                  { id: 'vivid', labelVi: 'Mạnh', labelEn: 'Vivid' },
                ] as Array<{ id: WaveMotionMode; labelVi: string; labelEn: string }>
              ).map((opt) => {
                const active = waveMotion === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`wallpaper-wave-btn-${opt.id}`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      SoundEngine.playTap();
                      setWaveMotion(opt.id);
                      onShowNotification?.(
                        isEn
                          ? `✓ Wave motion: ${opt.labelEn}`
                          : `✓ Sóng nền: ${opt.labelVi}`
                      );
                    }}
                    style={
                      active
                        ? {
                            background: 'var(--bg-button-primary)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                          }
                        : undefined
                    }
                    className={`h-7 px-2.5 rounded-full typo-badge font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      active
                        ? 'shadow-2xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {isEn ? opt.labelEn : opt.labelVi}
                  </button>
                );
              })}
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
                placeholder={isEn ? 'Search wallpaper, video, css...' : 'Tìm hình nền, video, css...'}
                className="banner-search-input h-9 w-full pl-8 pr-8 py-0 rounded-full typo-body font-normal font-play focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={isEn ? 'Clear search' : 'Xóa từ khóa tìm kiếm'}
                  title={isEn ? 'Clear search' : 'Xóa tìm kiếm'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                >
                  <WebIcon name="x" className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              id="wallpaper-add-toggle-btn"
              type="button"
              onClick={() => {
                SoundEngine.playPop();
                setIsAddModalOpen((prev) => !prev);
              }}
              className="banner-primary-cta h-9 px-3.5 py-0 rounded-full typo-button font-bold font-play bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-1.5"
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
              <WebIcon name="image" className="w-5 h-5 shrink-0" />
              <h3 id="wallpaper-add-panel-title" className="typo-h3 card-title-synced text-[var(--color-primary)]" data-card-title="true">
                Thêm Hình Nền Mới &amp; Nhập / Xuất Dữ Liệu JSON
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
                void saveCustomWallpaperToDB(createdWp);
                if (user) {
                  void saveCloudWallpaper(createdWp);
                }
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
                  <WebIcon name="upload" className="w-4 h-4 shrink-0" />
                  <span>Thêm Hình Nền Mới (Tự Động Nhận Diện Link &amp; Tên Hình)</span>
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

              <input
                ref={localMediaInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleLocalMediaUpload}
                className="hidden"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  id="wallpaper-upload-local-media-btn"
                  type="button"
                  onClick={() => localMediaInputRef.current?.click()}
                  className="px-4 py-2 rounded-full typo-button border border-[var(--border-subcard)] text-[var(--text-primary)] hover:border-[var(--color-primary)] transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <WebIcon name="upload" className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>{isEn ? 'Upload from Device' : 'Tải ảnh/video từ máy'}</span>
                </button>

                <button
                  id="wallpaper-add-submit-btn"
                  type="submit"
                  style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                  className="px-5 py-2 rounded-full typo-button shadow-md hover:brightness-110 transition cursor-pointer"
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
                    <WebIcon name="file-text" className="w-4 h-4 shrink-0" />
                    <span>Nhập / Xuất Dữ Liệu Hình Nền Bằng JSON</span>
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
                      style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                      className="px-3.5 py-1.5 rounded-full typo-button hover:brightness-110 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
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
                  style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                  className="px-4 py-1.5 rounded-full typo-button disabled:opacity-40 hover:brightness-110 transition cursor-pointer"
                >
                  Nhập Dữ Liệu Từ Ô JSON
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Đã hợp nhất thanh lọc thông minh vào dropdown "Bộ lọc hình nền" trên banner */}

      {/* THANH TRẠNG THÁI KẾT QUẢ LỌC NHANH (CHỈ HIỆN KHI ĐANG LỌC HOẶC TÌM KIẾM) */}
      {(filterType !== 'all' || searchQuery.trim().length > 0) && filteredWallpapers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-subcard)] shrink-0">
          <span className="typo-caption font-semibold text-[var(--text-secondary)]">
            {isEn
              ? `Showing ${filteredWallpapers.length} of ${allWallpapers.length} wallpapers`
              : `Đang hiển thị ${filteredWallpapers.length} / ${allWallpapers.length} hình nền`}
          </span>
          <button
            type="button"
            onClick={() => {
              SoundEngine.playTap();
              setFilterType('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-card)] text-[var(--text-primary)] typo-badge font-semibold cursor-pointer hover:border-[var(--color-primary)] transition-colors"
          >
            <WebIcon name="rotate-ccw" className="w-3 h-3 shrink-0" />
            <span>{isEn ? 'Reset filters' : 'Xóa bộ lọc'}</span>
          </button>
        </div>
      )}

      {/* LƯỚI HÌNH NỀN THU NHỎ HOẶC EMPTY STATE */}
      {filteredWallpapers.length === 0 ? (
        <div className="bento-card glass-card flex-1 flex flex-col items-center justify-center text-center py-12 px-4 rounded-[14px]">
          <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mb-3">
            <WebIcon name={filterType === 'custom' ? 'upload' : 'image'} className="w-6 h-6" />
          </div>
          <p className="typo-h4 text-[var(--text-heading,var(--text-primary))] font-play">
            {filterType === 'custom'
              ? isEn
                ? 'No personal wallpapers uploaded yet'
                : 'Chưa có hình nền cá nhân nào được tải lên'
              : 'Không tìm thấy hình nền phù hợp'}
          </p>
          <p className="typo-caption text-[var(--text-secondary)] mt-1 max-w-md">
            {filterType === 'custom'
              ? isEn
                ? 'Upload an image/video from your device or paste a link to add to your personal library.'
                : 'Tải lên hình ảnh, video từ thiết bị hoặc dán đường dẫn để thêm vào kho cá nhân.'
              : 'Hãy thử thay đổi bộ lọc loại media hoặc xóa từ khóa tìm kiếm hiện tại.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {filterType === 'custom' && (
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playPop();
                  setIsAddModalOpen(true);
                }}
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                className="px-5 py-2 rounded-full typo-button hover:brightness-110 transition cursor-pointer shadow-sm"
              >
                {isEn ? 'Add Personal Wallpaper' : 'Thêm hình nền cá nhân'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setFilterType('all');
                setSearchQuery('');
              }}
              style={
                filterType === 'custom'
                  ? undefined
                  : { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
              }
              className={`px-5 py-2 rounded-full typo-button transition cursor-pointer shadow-sm ${
                filterType === 'custom'
                  ? 'border border-[var(--border-subcard)] text-[var(--text-primary)]'
                  : 'hover:brightness-110'
              }`}
            >
              Xem lại tất cả hình nền
            </button>
          </div>
        </div>
      ) : (
        <div
          id="wallpaper-cards-grid"
          data-card-layout="responsive-grid"
          data-card-shape="horizontal-rect"
          className="unified-cards-grid wallpaper-responsive-grid card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch flex-1 w-full min-w-0"
        >
          {filteredWallpapers.map((wp) => (
            <WallpaperGridCard
              key={wp.id}
              wp={wp}
              localizedName={t(wp.name)}
              isSelected={activeWallpaper?.id === wp.id}
              isCustomAdded={userUploadedIds.has(wp.id)}
              isEn={isEn}
              nonePreviewStyle={wp.id === 'none' ? activeCardStyleMeta.cardSampleStyle : undefined}
              onApply={handleApplyWallpaper}
              onDelete={handleDeleteCustomWallpaper}
            />
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
