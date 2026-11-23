import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { CardStyleConfig, CardStyleMode } from '@/config/ui/theme.types';
import { ThemeBackgroundSpec } from '@/config/ui/themeDefaults';

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
  displayShortBadge?: string;
  displayDesc: string;
  onSelectTheme: (mode: CardStyleMode, label: string) => void;
  onToggleVideo: (id: CardStyleMode) => void;
  onVideoError: (id: CardStyleMode) => void;
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
    displayDesc,
    onSelectTheme,
    onToggleVideo,
    onVideoError,
  }) => {
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
      if (preset.id === 'light-deep-ocean') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(145deg, rgba(219, 238, 255, 0.92), rgba(167, 214, 255, 0.86), rgba(226, 243, 255, 0.90))',
        };
      }
      if (preset.id === 'dark-neon-glass') {
        return {
          ...sampleProps,
          background:
            'linear-gradient(145deg, rgba(10, 16, 38, 0.90) 0%, rgba(18, 14, 46, 0.88) 52%, rgba(12, 10, 34, 0.92) 100%)',
        };
      }
      return sampleProps;
    })();

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
      if (preset.id === 'light-deep-ocean') {
        return {
          ...preset.miniPreviewWrapStyle,
          background:
            'linear-gradient(145deg, rgba(235, 246, 255, 0.88) 0%, rgba(203, 233, 253, 0.82) 100%)',
          border: 'none',
        };
      }
      return { ...preset.miniPreviewWrapStyle, border: 'none' };
    })();

    return (
      <article
        style={{
          ...safeSampleStyle,
          borderRadius: meta.radius,
          padding: '15px',
          ...(meta.outlineStyle ? meta.outlineStyle(isActive) : {}),
          ...(isActive
            ? {
                boxShadow: `${(safeSampleStyle as Record<string, string | number>).boxShadow || ''}, 0 0 0 2.5px ${meta.activeRingColor}`,
              }
            : {}),
        }}
        className={`theme-preset-card relative h-full flex flex-col justify-between gap-[12px] transition-[transform,border-color,box-shadow] duration-200 ease-out border min-w-0 overflow-hidden hover:-translate-y-0.5 ${preset.cardClassName} ${
          isActive ? meta.activeBorderClass : meta.idleBorderClass
        }`}
      >
        {/* Top Visual Specimen Stage: Wallpaper & Surface / Demo Video */}
        <div
          style={{
            borderRadius: '12px',
            backgroundImage: bgSpec?.imagePath
              ? `url('${bgSpec.imagePath}'), ${bgSpec.fallbackGradient}`
              : bgSpec?.fallbackGradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="relative h-[152px] shrink-0 overflow-hidden p-2 flex flex-col justify-between border border-white/25 dark:border-white/10 shadow-none"
        >
          <div
            className="relative z-10 h-full p-2 flex flex-col justify-between gap-2 rounded-[10px] bg-black/25 dark:bg-black/40 backdrop-blur-xs"
            style={safeMiniWrapStyle}
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className={`typo-caption font-semibold truncate ${meta.titleTextClass}`}>
                {isEn ? 'Wallpaper & Surface' : 'Hình nền & Vật liệu'}
              </span>
              <button
                type="button"
                onClick={() => onToggleVideo(preset.id)}
                title={
                  hasVideoFailed
                    ? isEn
                      ? 'Retry demo video'
                      : 'Thử tải lại video minh họa'
                    : undefined
                }
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full typo-badge font-semibold border cursor-pointer transition-opacity hover:opacity-90 shrink-0 whitespace-nowrap ${meta.ctaIdleClass}`}
              >
                <WebIcon
                  name={isVideoVisible ? 'x' : hasVideoFailed ? 'rotate-ccw' : 'play'}
                  className="w-3 h-3 shrink-0"
                />
                <span>
                  {isVideoVisible
                    ? isEn
                      ? 'Close'
                      : 'Đóng'
                    : hasVideoFailed
                      ? isEn
                        ? 'Retry'
                        : 'Thử lại'
                      : isEn
                        ? 'Demo'
                        : 'Video'}
                </span>
              </button>
            </div>

            {isVideoVisible ? (
              <div
                data-media-card="video"
                style={{
                  padding: '0px',
                  borderRadius: preset.id.includes('glass') ? '10px' : '8px',
                }}
                className="relative w-full h-[94px] overflow-hidden bg-slate-950/60 border border-white/20 box-border"
              >
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
                  style={{
                    objectFit: 'cover',
                    transform: 'translateZ(0) scale(1.005)',
                    backfaceVisibility: 'hidden',
                  }}
                  className="w-full h-full min-w-full min-h-full object-cover rounded-[inherit] pointer-events-none select-none banner-video-sharp"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    style={preset.miniTabStyle}
                    className="px-2.5 py-1 typo-badge font-bold flex-1 truncate rounded-full border text-center"
                  >
                    {isEn ? 'Header · Tab' : 'Header · Tab Mẫu'}
                  </span>
                  <span
                    style={preset.miniBtnStyle}
                    className="px-2.5 py-1 typo-badge font-bold rounded-full shadow-2xs shrink-0 whitespace-nowrap"
                  >
                    {isEn ? 'Accent' : 'Nút Nhấn'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {meta.gradientBars.slice(0, 2).map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span
                        className={`w-12 shrink-0 typo-badge font-mono truncate ${meta.accentTextClass}`}
                      >
                        {bar.label}
                      </span>
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{
                          background: preset.isDark
                            ? 'rgba(15, 23, 42, 0.55)'
                            : 'rgba(148, 163, 184, 0.22)',
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Card Body: Unboxed Kicker + Title + Concise Description */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className={`typo-caption font-semibold truncate ${meta.accentTextClass}`}>
              {groupLabel} · {mechanismLabel}
            </span>
            {isActive && (
              <span className="inline-flex items-center gap-1 typo-caption font-bold text-emerald-600 dark:text-emerald-300 shrink-0 whitespace-nowrap">
                <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Active' : 'Đang bật'}</span>
              </span>
            )}
          </div>

          <div
            className="card-header-sync flex items-center gap-2 min-w-0"
            style={{ color: meta.iconColor }}
          >
            <WebIcon
              name={groupIcon}
              className="w-4 h-4 shrink-0"
              style={{ color: meta.iconColor }}
            />
            <h4
              className="typo-h5 font-bold leading-snug min-w-0 truncate card-title-synced"
              data-card-title="true"
              style={{ color: meta.iconColor }}
            >
              {displayPresetName}
            </h4>
          </div>

          <p className={`typo-body-sm leading-relaxed line-clamp-3 ${meta.bodyTextClass}`}>
            {displayDesc}
          </p>
        </div>

        {/* Single Clear Card Footer Action */}
        <div
          className={`mt-auto pt-2.5 flex items-center justify-between gap-2 border-t ${meta.dividerClass}`}
        >
          <span className={`typo-caption font-mono tabular-nums truncate ${meta.accentTextClass}`}>
            {preset.id === 'liquid-glass' || preset.id === 'dark-liquid-glass'
              ? `${meta.radius} · blur(16px)`
              : preset.id.includes('glass')
                ? '24px · blur(24px)'
                : meta.radius}
          </span>

          <button
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectTheme(preset.id, displayPresetName)}
            className={`typo-button font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
              isActive ? meta.ctaActiveClass : meta.ctaIdleClass
            }`}
          >
            <WebIcon
              name={isActive ? 'check' : 'sparkles'}
              className="w-3.5 h-3.5 shrink-0"
            />
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
        </div>
      </article>
    );
  }
);

ThemePresetCard.displayName = 'ThemePresetCard';

export default ThemePresetCard;
