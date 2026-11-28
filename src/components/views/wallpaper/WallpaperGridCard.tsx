import React, { useEffect, useRef, useState } from 'react';
import {
  WallpaperPreset,
  parseCssStringToStyle,
  getCleanImageUrl,
  getWallpaperThumbnailUrl,
} from '@/data/wallpapers';
import { WebIcon } from '@/components/ui/WebIcon';
import { BlurUpImage } from '@/components/ui/BlurUpImage';
import {
  AnimatedSceneWallpaper,
  isAnimatedSceneWallpaper,
} from '@/components/backgrounds/AnimatedSceneWallpaper';

const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #e11d48 100%)';

const LazyWallpaperVideo: React.FC<{ src: string }> = React.memo(({ src }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setHasEnteredView(true);
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          setHasEnteredView(true);
        }
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
      { rootMargin: '150px' }
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
    <div
      ref={containerRef}
      data-video-lazy={hasEnteredView ? 'loaded' : 'pending'}
      style={!hasEnteredView ? { background: FALLBACK_GRADIENT } : undefined}
      className="w-full h-full rounded-[inherit] overflow-hidden"
    >
      {hasEnteredView && (
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
          preload="metadata"
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
      )}
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
        data-card-shape="horizontal-rect"
        data-media-card={wp.type === 'video' ? 'video' : 'image'}
        style={{
          borderRadius: 'var(--radius-card, 14px)',
          padding: '0px',
          contentVisibility: 'auto',
          containIntrinsicSize: '280px 158px',
        }}
        className={`themed-image-card wallpaper-rect-card group relative flex flex-col rounded-[var(--radius-card,14px)] overflow-hidden transition-all duration-300 cursor-pointer select-none aspect-[16/9] min-h-[138px] sm:min-h-[150px] w-full h-auto ${
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
          ) : wp.type === 'css' || wp.type === 'gradient' ? (
            isAnimatedSceneWallpaper(wp.id) ? (
              <AnimatedSceneWallpaper
                id={wp.id}
                compact
                className="rounded-[inherit]"
              />
            ) : (
              <div
                className="w-full h-full"
                style={
                  wp.previewStyle && Object.keys(wp.previewStyle).length > 0
                    ? wp.previewStyle
                    : parseCssStringToStyle(wp.value)
                }
              />
            )
          ) : (
            <BlurUpImage
              src={getWallpaperThumbnailUrl(wp.value || wp.bg || '')}
              fallbackSrc={getCleanImageUrl(wp.value || wp.bg || '')}
              alt={wp.name}
              variant="cover"
              onError={(e) => {
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
              {wp.id === 'theme-bg-liquid-glass'
                ? isEn
                  ? 'Default'
                  : 'Mặc định'
                : wp.id === 'none'
                ? isEn
                  ? 'System'
                  : 'Hệ thống'
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
                wp.id !== 'theme-bg-liquid-glass' && (
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
              {wp.id === 'theme-bg-liquid-glass'
                ? isEn
                  ? 'Liquid Glass (Default)'
                  : 'Kính Lỏng (Mặc định)'
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
