import React, { useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { CardStyleConfig, CardStyleMode } from '@/config/ui/theme.types';
import {
  THEME_CARD_SPECS,
  THEME_DEFAULT_WALLPAPER_ID,
  ThemeBackgroundSpec,
} from '@/config/ui/themeDefaults';
import { WALLPAPER_PRESETS_LIST, getWallpaperThumbnailUrl } from '@/data/wallpapers';

export interface ThemeVisualMeta {
  radius: string;
  activeRingColor: string;
  activeBorderClass: string;
  idleBorderClass: string;
  activeBadgeClass: string;
  iconColor: string;
  titleTextClass: string;
  bodyTextClass: string;
  accentTextClass: string;
  previewBorderClass: string;
  dividerClass: string;
  ctaIdleClass: string;
  ctaActiveClass: string;
  toggleTrackDarkClass: string;
  toggleTrackLightClass: string;
  toggleThumbDarkClass: string;
  toggleThumbLightClass: string;
  outlineStyle?: (isActive: boolean) => React.CSSProperties;
  demoVideoUrl: string;
  gradientBars: Array<{ label: string; width: string; gradient: string; glow?: string }>;
  primaryPalette: Array<{ name: string; hex: string }>;
}

export interface ThemePresetCardProps {
  preset: CardStyleConfig;
  groupIcon: string;
  groupLabel: string;
  meta: ThemeVisualMeta;
  bgSpec?: ThemeBackgroundSpec;
  sampleProps: React.CSSProperties;
  isActive: boolean;
  isEn: boolean;
  isVideoVisible: boolean;
  hasVideoFailed: boolean;
  displayPresetName: string;
  displayEnglishName?: string;
  displayShortBadge?: string;
  displayDesc: string;
  lightModeId?: CardStyleMode;
  darkModeId?: CardStyleMode;
  currentVariant?: 'light' | 'dark';
  onVariantChange?: (variant: 'light' | 'dark') => void;
  onSelectTheme: (mode: CardStyleMode, label: string) => void;
  onToggleVideo: (id: CardStyleMode) => void;
  onVideoError: (id: CardStyleMode) => void;
  onOpenStudio?: (mode: CardStyleMode) => void;
}

export const ThemePresetCard: React.FC<ThemePresetCardProps> = React.memo(
  ({
    preset,
    groupIcon,
    groupLabel,
    meta,
    bgSpec,
    sampleProps,
    isActive,
    isEn,
    isVideoVisible,
    hasVideoFailed,
    displayPresetName,
    displayEnglishName,
    displayDesc,
    lightModeId,
    darkModeId,
    currentVariant,
    onVariantChange,
    onSelectTheme,
    onToggleVideo,
    onVideoError,
    onOpenStudio,
  }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMediaHovered, setIsMediaHovered] = useState(false);
    const showHoverVideo = (isVideoVisible || isMediaHovered) && !hasVideoFailed && Boolean(meta.demoVideoUrl);

    const mechanismMode = preset.mechanism || (preset.isDark ? 'dark' : 'light');
    const mechanismLabel = isEn
      ? mechanismMode === 'dark'
        ? 'Dark'
        : mechanismMode === 'color'
          ? 'Color'
          : 'Light'
      : mechanismMode === 'dark'
        ? 'Tối'
        : mechanismMode === 'color'
          ? 'Màu'
          : 'Sáng';

    const themeSpec = THEME_CARD_SPECS[preset.id];
    const defaultWallpaperId = THEME_DEFAULT_WALLPAPER_ID[preset.id];
    const defaultWallpaper =
      WALLPAPER_PRESETS_LIST.find((wp) => wp.id === defaultWallpaperId) || undefined;
    const defaultWallpaperThumbUrl =
      defaultWallpaper?.type === 'image'
        ? getWallpaperThumbnailUrl(defaultWallpaper.value || defaultWallpaper.bg || '')
        : bgSpec?.imagePath || '';
    const defaultWallpaperLabel =
      defaultWallpaper?.name || bgSpec?.label || (isEn ? 'Theme Default' : 'Mặc định theo giao diện');

    const safeSampleStyle: React.CSSProperties = (() => {
      if (preset.id === 'liquid-glass') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.84) 0%, rgba(248, 246, 247, 0.78) 52%, rgba(241, 231, 229, 0.72) 100%)',
        };
      }
      if (preset.id === 'dark-liquid-glass') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(145deg, rgba(26, 38, 62, 0.88) 0%, rgba(23, 31, 51, 0.90) 55%, rgba(16, 26, 43, 0.94) 100%)',
        };
      }
      if (preset.id === 'mica-fluent') {
        return {
          ...sampleProps,
          background: 'rgba(255, 255, 255, 0.30)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0px 4px 7px 2px rgba(0, 0, 0, 0.09)',
          color: '#1C0708',
        };
      }
      if (preset.id === 'gradient-dopamine') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 240, 248, 0.86) 48%, rgba(240, 247, 255, 0.88) 100%)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          border: '1.5px solid rgba(255, 46, 147, 0.35)',
          color: '#181028',
        };
      }
      if (preset.id === 'iridescent-liquid-glass') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.90) 0%, rgba(236, 254, 255, 0.84) 45%, rgba(245, 243, 255, 0.86) 76%, rgba(255, 247, 237, 0.88) 100%)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          border: '1.5px solid rgba(6, 182, 212, 0.42)',
          boxShadow:
            '0 14px 32px -10px rgba(6, 182, 212, 0.28), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)',
          color: '#0F172A',
        };
      }
      if (preset.id === 'dark-iridescent-liquid-glass') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(145deg, rgba(15, 23, 42, 0.90) 0%, rgba(17, 24, 52, 0.88) 52%, rgba(24, 18, 46, 0.92) 100%)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          border: '1.5px solid rgba(34, 211, 238, 0.45)',
          boxShadow:
            '0 16px 34px -10px rgba(34, 211, 238, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.24)',
          color: '#F8FAFC',
        };
      }
      return sampleProps;
    })();

    const isMatteNeu = preset.id === 'frost-ice-neu';

    const safeMiniWrapStyle: React.CSSProperties | undefined = (() => {
      if (!preset.miniPreviewWrapStyle) return undefined;
      if (preset.id === 'liquid-glass') {
        return {
          ...preset.miniPreviewWrapStyle,
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.84) 0%, rgba(245, 221, 224, 0.28) 50%, rgba(169, 230, 231, 0.24) 100%)',
          border: 'none',
        };
      }
      if (preset.id === 'dark-liquid-glass') {
        return {
          ...preset.miniPreviewWrapStyle,
          background:
            'linear-gradient(145deg, rgba(23, 31, 51, 0.86) 0%, rgba(16, 26, 43, 0.90) 100%)',
          border: 'none',
        };
      }
      if (isMatteNeu) {
        return {
          ...preset.miniPreviewWrapStyle,
          border: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        };
      }
      if (preset.id === 'iridescent-liquid-glass') {
        return {
          ...preset.miniPreviewWrapStyle,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(103,232,249,0.28) 46%, rgba(251,146,60,0.26) 100%)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
        };
      }
      if (preset.id === 'dark-iridescent-liquid-glass') {
        return {
          ...preset.miniPreviewWrapStyle,
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(34,211,238,0.22) 52%, rgba(251,146,60,0.22) 100%)',
          border: '1px solid rgba(103,232,249,0.42)',
        };
      }
      return { ...preset.miniPreviewWrapStyle, border: 'none' };
    })();

    const faceStyle: React.CSSProperties = {
      ...safeSampleStyle,
      borderRadius: 'var(--radius-card, 18px)',
      padding: '15px',
      cursor: 'pointer',
      ...(meta.outlineStyle ? meta.outlineStyle(isActive) : {}),
      ...(isActive
        ? {
            boxShadow: [
              (safeSampleStyle as Record<string, string | number>).boxShadow,
              `0 0 0 2.5px ${meta.activeRingColor}`,
            ]
              .filter(Boolean)
              .join(', '),
          }
        : {}),
    };

    const faceSurfaceClass = `relative col-start-1 row-start-1 h-full min-w-0 overflow-hidden flex flex-col justify-between gap-[10px] ${preset.cardClassName} ${
      isMatteNeu
        ? 'border-0'
        : `border ${isActive ? meta.activeBorderClass : meta.idleBorderClass}`
    }`;

    const specBoxClass = isMatteNeu
      ? 'border-0 bg-black/5 dark:bg-white/5'
      : preset.isDark
        ? 'border border-white/15 bg-slate-950/35'
        : 'border border-slate-900/10 bg-white/55';

    return (
      <article
        data-theme-preset-id={preset.id}
        data-flipped={isFlipped ? 'true' : 'false'}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectTheme(preset.id, displayPresetName);
        }}
        title={isEn ? 'Double-click to apply theme' : 'Nhấp đúp để áp dụng giao diện'}
        className="theme-preset-card relative h-full min-w-0 transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5"
      >
        <div className="w-full h-full" style={{ perspective: '1200px' }}>
          <div
            className="w-full h-full grid [grid-template-columns:minmax(0,1fr)]"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1)',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* ==================== MẶT TRƯỚC: BỐ CỤC 3 TẦNG GIỐNG CARD TRANG HỆ THỐNG ==================== */}
            <div
              aria-hidden={isFlipped}
              style={{
                ...faceStyle,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
                pointerEvents: isFlipped ? 'none' : 'auto',
              }}
              className={faceSurfaceClass}
            >
              {/* TOP: Icon + Tên giao diện + (Chế độ / Nhóm) */}
              <div className="theme-card-header flex items-start justify-between gap-2 min-w-0 shrink-0">
                <div
                  className="card-header-sync flex items-start gap-2 min-w-0 flex-1"
                  style={{ color: meta.iconColor }}
                >
                  <WebIcon
                    name={groupIcon}
                    className="w-5 h-5 mt-0.5 shrink-0"
                    style={{ color: meta.iconColor }}
                  />
                  <h4
                    className="font-play text-[15px] sm:text-[16px] font-bold leading-snug min-w-0 flex-1 line-clamp-2 card-title-synced m-0"
                    data-card-title="true"
                    style={{ color: meta.iconColor }}
                    title={`${displayPresetName} (${groupLabel} · ${mechanismLabel})`}
                  >
                    <span>{displayPresetName}</span>{' '}
                    <span className={`text-[12px] font-medium opacity-80 ${meta.bodyTextClass}`}>
                      ({!isEn && displayEnglishName ? displayEnglishName : `${groupLabel} · ${mechanismLabel}`})
                    </span>
                  </h4>
                </div>

                {lightModeId && darkModeId && (
                  <div
                    role="group"
                    aria-label={isEn ? 'Light / Dark mode tab' : 'Chuyển chế độ Sáng hoặc Tối'}
                    className="inline-flex items-center gap-0.5 p-0.5 rounded-full border border-white/25 bg-black/15 shrink-0"
                  >
                    <button
                      type="button"
                      tabIndex={isFlipped ? -1 : 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onVariantChange?.('light');
                        if (lightModeId) onSelectTheme(lightModeId, displayPresetName);
                      }}
                      className={`px-2 py-0.5 rounded-full typo-badge font-bold cursor-pointer transition-all ${
                        currentVariant === 'light'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-current opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isEn ? 'Light' : 'Sáng'}
                    </button>
                    <button
                      type="button"
                      tabIndex={isFlipped ? -1 : 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onVariantChange?.('dark');
                        if (darkModeId) onSelectTheme(darkModeId, displayPresetName);
                      }}
                      className={`px-2 py-0.5 rounded-full typo-badge font-bold cursor-pointer transition-all ${
                        currentVariant === 'dark'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-current opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isEn ? 'Dark' : 'Tối'}
                    </button>
                  </div>
                )}
              </div>

              {/* CENTER: Trái = Mô tả + Bảng màu, Phải = Mẫu trực quan / Video hover giống cột phải trang Hệ thống */}
              <div className="theme-card-middle flex-1 min-w-0 w-full">
                {/* CENTER LEFT: Mô tả nội dung dạng body-text + nhóm màu đặc trưng */}
                <div className="flex flex-col justify-center gap-2 min-w-0">
                  <p className={`theme-desc-text m-0 font-normal text-[13px] leading-[1.52] line-clamp-4 break-words ${meta.bodyTextClass}`}>
                    {displayDesc}
                  </p>
                  <div className="flex items-center flex-wrap gap-1.5 min-w-0">
                    <span className={`typo-badge font-semibold truncate ${meta.accentTextClass}`}>
                      {groupLabel} · {mechanismLabel}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {meta.primaryPalette.slice(0, 4).map((swatch) => (
                        <span
                          key={`${preset.id}-front-${swatch.hex}-${swatch.name}`}
                          title={`${swatch.name} (${swatch.hex.toLowerCase()})`}
                          className="w-3 h-3 rounded-full border border-white/60 shadow-2xs shrink-0"
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* CENTER RIGHT: Khung mẫu trực quan & phát video ngay vị trí khi rê chuột / bấm Demo */}
                <div
                  role="button"
                  tabIndex={isFlipped ? -1 : 0}
                  onMouseEnter={() => setIsMediaHovered(true)}
                  onMouseLeave={() => setIsMediaHovered(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVideo(preset.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleVideo(preset.id);
                    }
                  }}
                  title={
                    hasVideoFailed
                      ? isEn
                        ? 'Click to retry preview video'
                        : 'Bấm để thử tải lại video minh họa'
                      : isEn
                        ? 'Hover or click to preview demo video'
                        : 'Rê chuột hoặc bấm để xem video minh họa'
                  }
                  style={{
                    borderRadius: 'var(--radius-subcard, 14px)',
                    backgroundImage: bgSpec?.imagePath
                      ? `url('${bgSpec.imagePath}'), ${bgSpec.fallbackGradient}`
                      : bgSpec?.fallbackGradient,
                    backgroundColor: isMatteNeu ? (preset.isDark ? '#1A2433' : '#E0E8F2') : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className={`theme-card-media-slot relative w-full overflow-hidden p-1.5 flex flex-col justify-between cursor-pointer ${
                    isMatteNeu ? 'border-0' : 'border border-white/25 dark:border-white/10'
                  }`}
                >
                  {showHoverVideo ? (
                    <video
                      src={meta.demoVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      controls={false}
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                      aria-hidden="true"
                      tabIndex={-1}
                      onLoadedMetadata={(e) => {
                        const v = e.currentTarget;
                        v.defaultMuted = true;
                        v.muted = true;
                        v.loop = true;
                        v.controls = false;
                        v.disablePictureInPicture = true;
                        (v as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
                      }}
                      onCanPlay={(e) => {
                        const v = e.currentTarget;
                        v.defaultMuted = true;
                        v.muted = true;
                        v.loop = true;
                        if (v.paused) v.play().catch(() => {});
                      }}
                      onEnded={(e) => {
                        const v = e.currentTarget;
                        v.currentTime = 0;
                        v.play().catch(() => {});
                      }}
                      onError={() => onVideoError(preset.id)}
                      className="absolute inset-0 z-20 w-full h-full object-cover rounded-[inherit] pointer-events-none select-none banner-video-sharp"
                    />
                  ) : (
                    <div
                      className={`relative z-10 h-full w-full p-2 flex flex-col justify-between gap-1.5 rounded-[var(--radius-subcard,12px)] ${
                        isMatteNeu ? '' : 'bg-black/25 dark:bg-black/40 backdrop-blur-xs'
                      }`}
                      style={safeMiniWrapStyle}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          style={preset.miniTabStyle}
                          className={`px-1.5 py-0.5 text-[10px] font-bold flex-1 truncate rounded-full text-center ${
                            isMatteNeu ? 'border-0' : 'border'
                          }`}
                        >
                          {isEn ? 'Tab' : 'Thẻ'}
                        </span>
                        <span
                          style={preset.miniBtnStyle}
                          className="px-1.5 py-0.5 text-[10px] font-bold rounded-full shadow-2xs shrink-0 whitespace-nowrap"
                        >
                          CTA
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 my-auto">
                        {meta.gradientBars.slice(0, 2).map((bar) => (
                          <div
                            key={bar.label}
                            className="w-full h-1.5 rounded-full overflow-hidden"
                            style={{
                              background: isMatteNeu
                                ? preset.isDark
                                  ? '#1A2433'
                                  : '#E0E8F2'
                                : preset.isDark
                                  ? 'rgba(15, 23, 42, 0.55)'
                                  : 'rgba(148, 163, 184, 0.25)',
                            }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: bar.width,
                                background: bar.gradient,
                                boxShadow: bar.glow,
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-semibold truncate opacity-85 ${meta.titleTextClass}`}>
                          {isEn ? 'Preview' : 'Mẫu thẻ'}
                        </span>
                        <WebIcon
                          name={hasVideoFailed ? 'rotate-ccw' : 'play'}
                          className="w-3 h-3 shrink-0 opacity-85"
                          style={{ color: meta.iconColor }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM: Hiệu ứng đặc trưng + Áp dụng + Tùy chỉnh + Lật 4 mục */}
              <div
                className={`mt-auto pt-2.5 flex flex-wrap items-center justify-between gap-2 min-w-0 shrink-0 ${
                  isMatteNeu ? 'border-0' : `border-t ${meta.dividerClass}`
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <button
                    type="button"
                    tabIndex={isFlipped ? -1 : 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTheme(preset.id, displayPresetName);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-semibold cursor-pointer transition-all shrink-0 whitespace-nowrap ${
                      isActive ? meta.ctaActiveClass : meta.ctaIdleClass
                    }`}
                  >
                    <WebIcon name={isActive ? 'check' : 'palette'} className="w-3 h-3 shrink-0" />
                    <span>
                      {isActive
                        ? isEn
                          ? 'Active'
                          : 'Đang bật'
                        : isEn
                          ? 'Apply'
                          : 'Áp dụng'}
                    </span>
                  </button>

                  {themeSpec && (
                    <span className={`typo-badge font-semibold truncate hidden sm:inline ${meta.accentTextClass}`}>
                      {isEn ? themeSpec.cardEffectKindEn : themeSpec.cardEffectKindVi}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onOpenStudio && (
                    <button
                      type="button"
                      tabIndex={isFlipped ? -1 : 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenStudio(preset.id);
                      }}
                      onDoubleClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-bold cursor-pointer transition-all shrink-0 whitespace-nowrap ${
                        isMatteNeu ? 'border-0' : 'border'
                      } ${meta.ctaIdleClass}`}
                      aria-label={isEn ? 'Preview & Customize studio' : 'Xem trước & Tùy chỉnh giao diện'}
                    >
                      <WebIcon name="sliders" className="w-3 h-3 shrink-0" />
                      <span>{isEn ? 'Studio' : 'Tùy chỉnh'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    tabIndex={isFlipped ? -1 : 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    onDoubleClick={(e) => e.stopPropagation()}
                    className={`theme-flip-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-semibold cursor-pointer transition-all shrink-0 whitespace-nowrap ${
                      isMatteNeu ? 'border-0' : 'border'
                    } ${meta.ctaIdleClass}`}
                    aria-label={isEn ? 'Flip card to view 4 theme specs' : 'Lật thẻ xem 4 thông số giao diện'}
                  >
                    <WebIcon name="rotate-ccw" className="w-3 h-3 shrink-0" />
                    <span>{isEn ? 'Specs · 4' : 'Lật · 4 mục'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== MẶT SAU: 4 MỤC THÔNG SỐ GIAO DIỆN ==================== */}
            <div
              aria-hidden={!isFlipped}
              style={{
                ...faceStyle,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                pointerEvents: isFlipped ? 'auto' : 'none',
              }}
              className={faceSurfaceClass}
            >
              {/* Back Header */}
              <div
                className={`flex items-center justify-between gap-2 pb-1.5 min-w-0 ${
                  isMatteNeu ? 'border-0' : `border-b ${meta.dividerClass}`
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1" style={{ color: meta.iconColor }}>
                  <WebIcon name={groupIcon} className="w-4 h-4 shrink-0" />
                  <h4
                    className="typo-h6 font-bold truncate card-title-synced"
                    data-card-title="true"
                    style={{ color: meta.iconColor }}
                  >
                    {displayPresetName}
                  </h4>
                </div>
                <button
                  type="button"
                  tabIndex={isFlipped ? 0 : -1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  onDoubleClick={(e) => e.stopPropagation()}
                  className={`theme-flip-back-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-semibold cursor-pointer shrink-0 whitespace-nowrap ${
                    isMatteNeu ? 'border-0' : 'border'
                  } ${meta.ctaIdleClass}`}
                  aria-label={isEn ? 'Flip back to front' : 'Lật về mặt trước'}
                >
                  <WebIcon name="rotate-ccw" className="w-3 h-3 shrink-0" />
                  <span>{isEn ? 'Front' : 'Mặt trước'}</span>
                </button>
              </div>

              {/* 4 Required Theme Specification Items */}
              <div className="flex-1 flex flex-col justify-between gap-1.5 min-h-0">
                {/* 1. Hình nền mặc định */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-[var(--radius-subcard,12px)] min-w-0 ${specBoxClass}`}
                >
                  <div
                    className="w-10 h-10 rounded-[8px] shrink-0 overflow-hidden border border-white/25"
                    style={{
                      ...(defaultWallpaper?.previewStyle || {
                        background: bgSpec?.fallbackGradient || themeSpec?.surfaceColorHex,
                      }),
                    }}
                  >
                    {defaultWallpaperThumbUrl && (
                      <img
                        src={defaultWallpaperThumbUrl}
                        alt={defaultWallpaperLabel}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`typo-badge font-semibold truncate ${meta.accentTextClass}`}>
                      {isEn ? '1. Default wallpaper' : '1. Hình nền mặc định'}
                    </div>
                    <div className={`typo-caption font-medium truncate ${meta.titleTextClass}`}>
                      {defaultWallpaperLabel}
                    </div>
                    <div className={`typo-badge opacity-80 truncate ${meta.bodyTextClass}`}>
                      {isEn ? 'Auto-applied on switch' : 'Tự áp dụng khi chuyển giao diện'}
                    </div>
                  </div>
                </div>

                {/* 2. Màu dùng cho giao diện */}
                <div
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[var(--radius-subcard,12px)] min-w-0 ${specBoxClass}`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full border border-white/50 shadow-2xs shrink-0"
                      style={{ backgroundColor: themeSpec.surfaceColorHex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`typo-badge font-semibold truncate ${meta.accentTextClass}`}>
                        {isEn ? '2. Interface color' : '2. Màu dùng cho giao diện'}
                      </div>
                      <div className={`typo-caption truncate ${meta.bodyTextClass}`}>
                        {isEn ? themeSpec.surfaceColorNameEn : themeSpec.surfaceColorNameVi}
                      </div>
                    </div>
                  </div>
                  <span className={`typo-badge font-mono shrink-0 ${meta.titleTextClass}`}>
                    {themeSpec.surfaceColorHex.toLowerCase()}
                  </span>
                </div>

                {/* 3. Màu chính cho giao diện */}
                <div
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[var(--radius-subcard,12px)] min-w-0 ${specBoxClass}`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full border border-white/50 shadow-2xs shrink-0"
                      style={{ backgroundColor: themeSpec.primaryColorHex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`typo-badge font-semibold truncate ${meta.accentTextClass}`}>
                        {isEn ? '3. Primary color' : '3. Màu chính cho giao diện'}
                      </div>
                      <div className={`typo-caption truncate ${meta.bodyTextClass}`}>
                        {isEn ? themeSpec.primaryColorNameEn : themeSpec.primaryColorNameVi}
                      </div>
                    </div>
                  </div>
                  <span className={`typo-badge font-mono shrink-0 ${meta.titleTextClass}`}>
                    {themeSpec.primaryColorHex.toLowerCase()}
                  </span>
                </div>

                {/* 4. Hiệu ứng của card */}
                <div
                  className={`flex flex-col gap-0.5 px-2.5 py-1.5 rounded-[var(--radius-subcard,12px)] min-w-0 ${specBoxClass}`}
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span className={`typo-badge font-semibold truncate ${meta.accentTextClass}`}>
                      {isEn ? '4. Card effect' : '4. Hiệu ứng của card'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full typo-badge font-bold shrink-0 ${meta.activeBadgeClass}`}
                    >
                      {isEn ? themeSpec.cardEffectKindEn : themeSpec.cardEffectKindVi}
                    </span>
                  </div>
                  <p className={`typo-badge leading-snug line-clamp-2 ${meta.bodyTextClass}`}>
                    {isEn ? themeSpec.cardEffectDescEn : themeSpec.cardEffectDescVi}
                  </p>
                </div>
              </div>

              {/* Back Footer */}
              <div
                className={`mt-auto pt-2 flex items-center justify-between gap-2 ${
                  isMatteNeu ? 'border-0' : `border-t ${meta.dividerClass}`
                }`}
              >
                <button
                  type="button"
                  tabIndex={isFlipped ? 0 : -1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTheme(preset.id, displayPresetName);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full typo-badge font-bold cursor-pointer transition-all ${
                    isActive ? meta.ctaActiveClass : meta.ctaIdleClass
                  }`}
                >
                  <WebIcon name={isActive ? 'check' : 'sparkles'} className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isActive
                      ? isEn
                        ? '✓ Currently Active'
                        : '✓ Đang áp dụng giao diện này'
                      : isEn
                        ? 'Apply theme & defaults'
                        : 'Áp dụng giao diện & mặc định'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
);

ThemePresetCard.displayName = 'ThemePresetCard';

export default ThemePresetCard;
