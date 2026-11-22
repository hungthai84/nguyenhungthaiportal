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
  meta: ThemeVisualMeta;
  bgSpec?: ThemeBackgroundSpec;
  sampleProps: React.CSSProperties;
  isActive: boolean;
  isEn: boolean;
  isVideoVisible: boolean;
  hasVideoFailed: boolean;
  displayPresetName: string;
  displayShortBadge: string;
  displayDesc: string;
  onSelectTheme: (mode: CardStyleMode, label: string) => void;
  onToggleVideo: (id: CardStyleMode) => void;
  onVideoError: (id: CardStyleMode) => void;
}

export const ThemePresetCard: React.FC<ThemePresetCardProps> = React.memo(
  ({
    preset,
    groupIcon,
    meta,
    bgSpec,
    sampleProps,
    isActive,
    isEn,
    isVideoVisible,
    hasVideoFailed,
    displayPresetName,
    displayShortBadge,
    displayDesc,
    onSelectTheme,
    onToggleVideo,
    onVideoError,
  }) => {
    return (
      <article
        style={{
          ...sampleProps,
          borderRadius: meta.radius,
          padding: '15px',
          ...(meta.outlineStyle ? meta.outlineStyle(isActive) : {}),
          ...(isActive
            ? {
                boxShadow: `${(sampleProps as Record<string, string | number>).boxShadow || ''}, 0 0 0 2.5px ${meta.activeRingColor}`,
              }
            : {}),
        }}
        className={`relative flex flex-col justify-between gap-[15px] transition-all duration-300 border min-w-0 active:scale-[0.99] ${preset.cardClassName} ${
          isActive ? meta.activeBorderClass : meta.idleBorderClass
        }`}
      >
        {/* Top Row: Badge + Dedicated Wallpaper Thumbnail Preview */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`typo-badge font-bold px-2.5 py-0.5 rounded-full border ${
                isActive ? meta.activeBadgeClass : preset.badgeColorClass
              }`}
            >
              {displayShortBadge}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/35">
                  <WebIcon name="check" className="w-3 h-3 shrink-0" />
                  <span>{isEn ? 'Active' : 'Đang bật'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="min-w-0 flex flex-col gap-1.5">
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
                className="typo-h4 font-bold leading-snug min-w-0 truncate card-title-synced"
                data-card-title="true"
                style={{ color: meta.iconColor }}
              >
                {displayPresetName}
              </h4>
            </div>
            <p className={`typo-body-sm leading-relaxed ${meta.bodyTextClass}`}>
              {displayDesc}
            </p>
          </div>
        </div>

        {/* Dedicated Theme Wallpaper + Live Material Specimen */}
        <div
          style={{
            borderRadius: preset.id.includes('glass') ? '20px' : 'var(--radius-subcard, 14px)',
            backgroundImage: bgSpec?.imagePath
              ? `url('${bgSpec.imagePath}'), ${bgSpec.fallbackGradient}`
              : bgSpec?.fallbackGradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className={`relative overflow-hidden p-3 flex flex-col gap-2.5 border ${meta.previewBorderClass}`}
        >
          <div
            className="relative z-10 p-2.5 flex flex-col gap-2 border"
            style={{
              ...preset.miniPreviewWrapStyle,
              borderRadius: preset.id.includes('glass') ? '16px' : '12px',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`typo-badge font-bold truncate ${meta.titleTextClass}`}>
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
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-semibold border cursor-pointer transition-opacity hover:opacity-90 shrink-0 ${meta.ctaIdleClass}`}
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
                  borderRadius: preset.id.includes('glass') ? '16px' : '12px',
                }}
                className="relative w-full h-[112px] overflow-hidden bg-slate-950/60 border border-white/20 box-border"
              >
                <video
                  src={meta.demoVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
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
                    className="px-2.5 py-1 typo-badge font-bold rounded-full shadow-2xs shrink-0"
                  >
                    {isEn ? 'Accent' : 'Nút Nhấn'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 pt-0.5">
                  {meta.gradientBars.slice(0, 3).map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span
                        className={`w-9 shrink-0 typo-badge font-mono ${meta.accentTextClass}`}
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

        {/* Single Clear Card Footer Action */}
        <div
          className={`mt-auto pt-2.5 flex items-center justify-between gap-2 border-t ${meta.dividerClass}`}
        >
          <span className={`typo-caption font-mono truncate ${meta.accentTextClass}`}>
            {preset.id.includes('glass') ? '24px · blur(24px)' : meta.radius}
          </span>

          <button
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectTheme(preset.id, displayPresetName)}
            className={`typo-button font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
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
                  ? 'Active Theme'
                  : 'Đang áp dụng'
                : isEn
                  ? 'Apply Theme'
                  : 'Áp dụng giao diện'}
            </span>
          </button>
        </div>
      </article>
    );
  }
);

ThemePresetCard.displayName = 'ThemePresetCard';

export default ThemePresetCard;
