import React, { useEffect, useRef, useState } from 'react';
import {
  WallpaperPreset,
  parseCssStringToStyle,
  getCleanImageUrl,
  getWallpaperThumbnailUrl,
} from '@/data/wallpapers';
import { WebIcon } from '@/components/ui/WebIcon';

const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #e11d48 100%)';

const LazyWallpaperVideo: React.FC<{ src: string }> = React.memo(({ src }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setIsInView(visible);
        const video = videoRef.current;
        if (!video) return;
        if (visible) {
          if (video.paused && video.readyState >= 2) {
            video.play().catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (hasError) {
    return (
      <div
        ref={containerRef}
        style={{ background: FALLBACK_GRADIENT }}
        className="w-full h-full rounded-[inherit] flex items-center justify-center"
      >
        <WebIcon name="video" className="w-6 h-6 text-white/80" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full rounded-[inherit] overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        autoPlay={isInView}
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        preload={isInView ? 'auto' : 'metadata'}
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
          if (isInView && v.paused) {
            v.play().catch(() => {});
          }
        }}
        onEnded={(e) => {
          if (!isInView) return;
          const v = e.currentTarget;
          v.currentTime = 0;
          v.play().catch(() => {});
        }}
        onError={() => setHasError(true)}
        style={{
          objectFit: 'cover',
          transform: 'translateZ(0) scale(1.005)',
          backfaceVisibility: 'hidden',
        }}
        className="w-full h-full min-w-full min-h-full object-cover rounded-[inherit] block pointer-events-none select-none banner-video-sharp"
      />
    </div>
  );
});

LazyWallpaperVideo.displayName = 'LazyWallpaperVideo';

export interface WallpaperGridCardProps {
  wp: WallpaperPreset;
  localizedName: string;
  isSelected: boolean;
  isCustomAdded: boolean;
  isEn: boolean;
  nonePreviewStyle?: React.CSSProperties;
  onApply: (wp: WallpaperPreset) => void;
  onDelete: (wp: WallpaperPreset, e: React.MouseEvent) => void;
}

export const WallpaperGridCard: React.FC<WallpaperGridCardProps> = React.memo(
  ({
    wp,
    localizedName,
    isSelected,
    isCustomAdded,
    isEn,
    nonePreviewStyle,
    onApply,
    onDelete,
  }) => {
    const titleWords = localizedName.trim().split(/\s+/);
    const title4Words =
      titleWords.length <= 4 ? localizedName : titleWords.slice(0, 4).join(' ');

    return (
      <div
        id={`wallpaper-card-${wp.id}`}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={() => onApply(wp)}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onApply(wp);
          }
        }}
        title={isEn ? localizedName : wp.name}
        data-element-type="card"
        data-media-card={wp.type === 'video' ? 'video' : 'image'}
        style={{
          borderRadius: 'var(--radius-card, 14px)',
          padding: '0px',
          contentVisibility: 'auto',
          containIntrinsicSize: '260px 150px',
        }}
        className={`themed-image-card group relative flex flex-col rounded-[var(--radius-card,14px)] overflow-hidden transition-all duration-300 cursor-pointer select-none aspect-[16/10] sm:aspect-video w-full h-auto ${
          isSelected
            ? 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
            : ''
        }`}
      >
        {/* NỀN HÌNH & VIDEO LẮP ĐẦY 100% CARD */}
        <div
          id={`wallpaper-card-media-${wp.id}`}
          style={{
            borderRadius: 'var(--radius-card, 14px)',
            background: 'transparent',
          }}
          className="relative flex-1 w-full h-full z-0 rounded-[inherit] overflow-hidden bg-transparent"
        >
          {wp.id === 'none' ? (
            <div
              id="wallpaper-card-preview-none"
              style={{
                ...(nonePreviewStyle || {}),
                borderRadius: 'var(--radius-card, 14px)',
              }}
              className="w-full h-full rounded-[inherit] flex items-center justify-center transition-all"
            />
          ) : wp.type === 'video' ? (
            wp.value.includes('youtube.com') || wp.value.includes('youtu.be') ? (
              <div
                className="w-full h-full rounded-[inherit] bg-cover bg-center"
                style={
                  wp.previewStyle || {
                    backgroundImage:
                      "url('https://img.youtube.com/vi/Jox6R5-rIH0/hqdefault.jpg')",
                  }
                }
              />
            ) : (
              <LazyWallpaperVideo src={wp.value} />
            )
          ) : wp.type === 'webgl' ? (
            <div
              className="relative w-full h-full rounded-[inherit] overflow-hidden"
              style={
                wp.previewStyle && Object.keys(wp.previewStyle).length > 0
                  ? wp.previewStyle
                  : { background: wp.value || wp.bg }
              }
            >
              {/* Cụm cầu 3D thu nhỏ đại diện cho trường hấp dẫn GRAVITY */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {(
                  wp.gravityConfig?.previewSpheres || [
                    '#2F69FF',
                    '#A8C1FF',
                    '#4D80FF',
                    '#ECEFFF',
                  ]
                ).map((sphereColor, sIdx) => {
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
                })}
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
              decoding="async"
              onError={(e) => {
                const originalUrl = getCleanImageUrl(wp.value || wp.bg || '');
                if (e.currentTarget.src !== originalUrl) {
                  e.currentTarget.src = originalUrl;
                  return;
                }
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.background = FALLBACK_GRADIENT;
                }
              }}
              className="w-full h-full object-cover rounded-[inherit] block brightness-110 contrast-110 saturate-110"
            />
          )}
        </div>

        {/* THÔNG TIN GỌN TRONG CARD */}
        <div
          id={`wallpaper-card-content-${wp.id}`}
          style={{
            padding: '10px',
          }}
          className="absolute inset-0 z-20 w-full h-full flex flex-col justify-between p-[10px] pointer-events-none"
        >
          <div className="flex items-center justify-between gap-1.5 w-full relative z-20">
            <span className="themed-image-card-badge px-2 py-0.5 rounded-full typo-badge font-mono shadow-xs bg-slate-950/55 text-white backdrop-blur-xs">
              {wp.id === 'custom-wp-1788112774646'
                ? isEn
                  ? 'Default'
                  : 'Mặc định'
                : wp.id === 'none'
                ? isEn
                  ? 'System'
                  : 'Hệ thống'
                : wp.type === 'webgl'
                ? isEn
                  ? '3D · Morph'
                  : '3D · Qua trang'
                : wp.type}
            </span>

            <div className="flex items-center gap-1.5">
              {isSelected && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white typo-badge shadow-xs flex items-center gap-1">
                  <WebIcon name="check" className="w-2.5 h-2.5" />
                  <span>{isEn ? 'Active' : 'Đang dùng'}</span>
                </span>
              )}
              {isCustomAdded &&
                wp.id !== 'none' &&
                wp.id !== 'custom-wp-1788112774646' && (
                  <button
                    id={`wallpaper-card-delete-${wp.id}`}
                    type="button"
                    onClick={(e) => onDelete(wp, e)}
                    title={isEn ? 'Delete this wallpaper' : 'Xóa hình nền này'}
                    className="pointer-events-auto w-5 h-5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <WebIcon name="x" className="w-3 h-3" />
                  </button>
                )}
            </div>
          </div>

          <div className="w-full mt-auto flex items-center justify-between gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded-full bg-slate-950/55 text-white backdrop-blur-xs typo-badge font-play font-semibold truncate max-w-full">
              {wp.id === 'custom-wp-1788112774646'
                ? isEn
                  ? 'Wallpaper #32 (Default)'
                  : 'Hình nền #32 (Mặc định)'
                : wp.id === 'none'
                ? isEn
                  ? 'No Wallpaper (Theme Base)'
                  : 'Nền gốc giao diện'
                : title4Words}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

WallpaperGridCard.displayName = 'WallpaperGridCard';

export default WallpaperGridCard;
