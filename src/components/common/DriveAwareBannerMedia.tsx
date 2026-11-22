import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_MP4_BANNER_FALLBACK =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4';

const extractDriveId = (url: string): string | null => {
  const m1 = url.match(/[?&]id=([^&#]+)/i);
  if (m1?.[1]) return m1[1];
  const m2 = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  return m2?.[1] ?? null;
};

export interface DriveAwareBannerMediaProps {
  directVideoUrl: string;
  iframeFallbackUrl?: string;
  mp4FallbackUrl?: string;
  allowIframeFallback?: boolean;
  posterUrl?: string;
  title?: string;
  forceIframeFallback?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  iframeClassName?: string;
  onModeChange?: (mode: 'video' | 'iframe' | 'poster') => void;
}

/**
 * Component phát Video Nền chuẩn HTML5:
 * - Tự phát (autoPlay), tắt tiếng mặc định (muted), lặp vô tận (loop + onEnded fallback), nội tuyến di động (playsInline)
 * - Lấp đầy khung banner, ẩn hoàn toàn controls và tối ưu hiển thị sắc nét bằng GPU compositing
 * - Tự động fallback qua luồng MP4 trực tiếp trước khi dùng poster/iframe
 */
export const DriveAwareBannerMedia: React.FC<DriveAwareBannerMediaProps> = ({
  directVideoUrl,
  iframeFallbackUrl,
  mp4FallbackUrl = DEFAULT_MP4_BANNER_FALLBACK,
  allowIframeFallback = true,
  posterUrl,
  title = 'Banner background video',
  forceIframeFallback = false,
  muted = true,
  loop = true,
  className,
  iframeClassName,
  onModeChange,
}) => {
  const driveId = extractDriveId(directVideoUrl) || (iframeFallbackUrl ? extractDriveId(iframeFallbackUrl) : null);
  const driveUsercontentUrl = driveId
    ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`
    : '';

  const supportsIO = typeof IntersectionObserver !== 'undefined';
  const [shouldLoad, setShouldLoad] = useState<boolean>(!supportsIO);
  const [useIframe, setUseIframe] = useState<boolean>(allowIframeFallback && forceIframeFallback);
  const [videoStage, setVideoStage] = useState<'primary' | 'driveAlt' | 'mp4Fallback'>('primary');
  const [videoFailedAll, setVideoFailedAll] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const isInViewportRef = useRef<boolean>(!supportsIO);

  const activeVideoSrc =
    videoStage === 'primary'
      ? directVideoUrl
      : videoStage === 'driveAlt'
        ? driveUsercontentUrl || mp4FallbackUrl
        : mp4FallbackUrl;

  useEffect(() => {
    setUseIframe(allowIframeFallback && forceIframeFallback);
    setVideoStage('primary');
    setVideoFailedAll(false);
    setIsBuffering(true);
    setShouldLoad(isInViewportRef.current);
  }, [directVideoUrl, iframeFallbackUrl, forceIframeFallback, allowIframeFallback]);

  // Lazy loading bằng IntersectionObserver: chỉ nạp video Drive khi banner sắp xuất hiện trong viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      isInViewportRef.current = true;
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        isInViewportRef.current = isVisible;
        if (isVisible) {
          setShouldLoad(true);
          const video = videoElRef.current;
          if (video && !useIframe && !videoFailedAll && video.paused) {
            video.play().catch(() => {});
          }
        } else {
          const video = videoElRef.current;
          if (video && !video.paused) {
            video.pause();
          }
        }
      },
      { rootMargin: '250px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [useIframe, videoFailedAll]);

  useEffect(() => {
    const el = videoElRef.current;
    if (!shouldLoad || !el) return;
    el.defaultMuted = muted;
    el.muted = muted;
    el.loop = loop;
    el.playsInline = true;
    el.autoplay = true;
    el.controls = false;
    el.disablePictureInPicture = true;
    (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    el.removeAttribute('controls');
  }, [muted, loop, activeVideoSrc, shouldLoad, useIframe]);

  useEffect(() => {
    if (!shouldLoad || !isBuffering || useIframe || videoFailedAll) {
      return;
    }
    const timer = window.setTimeout(() => {
      if (!isInViewportRef.current) return;
      if (videoStage === 'primary' && driveUsercontentUrl && directVideoUrl !== driveUsercontentUrl) {
        setVideoStage('driveAlt');
      } else if (allowIframeFallback && iframeFallbackUrl) {
        setUseIframe(true);
        setIsBuffering(true);
      } else if (videoStage !== 'mp4Fallback' && mp4FallbackUrl && activeVideoSrc !== mp4FallbackUrl) {
        setVideoStage('mp4Fallback');
      }
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [
    shouldLoad,
    isBuffering,
    useIframe,
    videoFailedAll,
    videoStage,
    driveUsercontentUrl,
    directVideoUrl,
    mp4FallbackUrl,
    activeVideoSrc,
    allowIframeFallback,
    iframeFallbackUrl,
  ]);

  useEffect(() => {
    if (videoFailedAll) {
      onModeChange?.('poster');
    } else if (useIframe && iframeFallbackUrl) {
      onModeChange?.('iframe');
    } else {
      onModeChange?.('video');
    }
  }, [useIframe, videoFailedAll, iframeFallbackUrl, onModeChange]);

  return (
    <div
      ref={containerRef}
      data-drive-banner-lazy={shouldLoad ? 'loaded' : 'pending'}
      style={{ containerType: 'size' }}
      className="absolute inset-0 w-full h-full min-w-full min-h-full overflow-hidden rounded-[inherit]"
    >
      {/* Poster & subtle backdrop while waiting for viewport or buffering */}
      {(!shouldLoad || isBuffering) && posterUrl && (
        <div className="absolute inset-0 z-[1] pointer-events-none rounded-[inherit] overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'translateZ(0) scale(1.02)',
            }}
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit]"
          />
        </div>
      )}

      {/* Primary & Chained MP4 HTML5 <video> Direct Stream */}
      {shouldLoad && !useIframe && !videoFailedAll && (
        <video
          ref={videoElRef}
          key={`video-${videoStage}-${activeVideoSrc}`}
          src={activeVideoSrc}
          poster={posterUrl}
          autoPlay
          muted={muted}
          loop={loop}
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedMetadata={(e) => {
            const el = e.currentTarget;
            el.defaultMuted = muted;
            el.muted = muted;
            el.loop = loop;
            el.controls = false;
            el.disablePictureInPicture = true;
            (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
            el.removeAttribute('controls');
          }}
          onLoadedData={() => setIsBuffering(false)}
          onCanPlay={() => {
            setIsBuffering(false);
            const el = videoElRef.current;
            if (el) {
              el.defaultMuted = muted;
              el.muted = muted;
              el.loop = loop;
              el.removeAttribute('controls');
              if (isInViewportRef.current && el.paused) {
                el.play().catch(() => {});
              }
            }
          }}
          onPlaying={() => setIsBuffering(false)}
          onTimeUpdate={() => {
            if (isBuffering) setIsBuffering(false);
          }}
          onEnded={(e) => {
            if (!loop || !isInViewportRef.current) return;
            const v = e.currentTarget;
            v.currentTime = 0;
            v.play().catch(() => {});
          }}
          onPause={(e) => {
            if (!loop || !isInViewportRef.current || (typeof document !== 'undefined' && document.hidden)) return;
            const v = e.currentTarget;
            v.play().catch(() => {});
          }}
          onError={() => {
            if (videoStage === 'primary' && driveUsercontentUrl && directVideoUrl !== driveUsercontentUrl) {
              setVideoStage('driveAlt');
            } else if (allowIframeFallback && iframeFallbackUrl) {
              setUseIframe(true);
              setIsBuffering(true);
            } else if (videoStage !== 'mp4Fallback' && mp4FallbackUrl && activeVideoSrc !== mp4FallbackUrl) {
              setVideoStage('mp4Fallback');
            } else {
              setVideoFailedAll(true);
              setIsBuffering(false);
            }
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            transform: 'translateZ(0) scale(1.02)',
            backfaceVisibility: 'hidden',
          }}
          className={cn(
            'absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit] pointer-events-none select-none transition-opacity duration-500 banner-video-sharp',
            isBuffering ? 'opacity-0' : 'opacity-100',
            className
          )}
        />
      )}

      {/* Optional Iframe Fallback (full-bleed container-query cover) */}
      {shouldLoad && useIframe && allowIframeFallback && iframeFallbackUrl && !videoFailedAll && (
        <iframe
          key={`iframe-${iframeFallbackUrl}`}
          src={iframeFallbackUrl}
          title={title}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen"
          tabIndex={-1}
          onLoad={() => setIsBuffering(false)}
          onError={() => {
            setVideoFailedAll(true);
            setIsBuffering(false);
          }}
          className={cn(
            'banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none transition-opacity duration-500',
            isBuffering ? 'opacity-0' : 'opacity-100',
            iframeClassName
          )}
        />
      )}

      {/* Final Fallback: Static Poster Image */}
      {videoFailedAll && posterUrl && (
        <img
          src={posterUrl}
          alt={title}
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translateZ(0) scale(1.02)',
          }}
          className={cn('absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit]', className)}
        />
      )}
    </div>
  );
};
