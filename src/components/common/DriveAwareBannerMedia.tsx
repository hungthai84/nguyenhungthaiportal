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

  const [useIframe, setUseIframe] = useState<boolean>(allowIframeFallback && forceIframeFallback);
  const [videoStage, setVideoStage] = useState<'primary' | 'driveAlt' | 'mp4Fallback'>('primary');
  const [videoFailedAll, setVideoFailedAll] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

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
  }, [directVideoUrl, iframeFallbackUrl, forceIframeFallback, allowIframeFallback]);

  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;
    el.defaultMuted = muted;
    el.muted = muted;
    el.loop = loop;
    el.playsInline = true;
    el.autoplay = true;
    el.controls = false;
    el.disablePictureInPicture = true;
    (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    el.removeAttribute('controls');
  }, [muted, loop, activeVideoSrc, useIframe]);

  useEffect(() => {
    if (!isBuffering || useIframe || videoFailedAll) {
      return;
    }
    const timer = window.setTimeout(() => {
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
    <div className="absolute inset-0 w-full h-full min-w-full min-h-full overflow-hidden rounded-[inherit]">
      {/* Poster & subtle backdrop while video buffers */}
      {isBuffering && posterUrl && (
        <div className="absolute inset-0 z-[1] pointer-events-none rounded-[inherit] overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit]"
          />
        </div>
      )}

      {/* Primary & Chained MP4 HTML5 <video> Direct Stream */}
      {!useIframe && !videoFailedAll && (
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
              if (el.paused) {
                el.play().catch(() => {});
              }
            }
          }}
          onEnded={(e) => {
            if (!loop) return;
            const v = e.currentTarget;
            v.currentTime = 0;
            v.play().catch(() => {});
          }}
          onPause={(e) => {
            if (!loop || (typeof document !== 'undefined' && document.hidden)) return;
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
            objectFit: 'cover',
            transform: 'translateZ(0) scale(1.005)',
            backfaceVisibility: 'hidden',
          }}
          className={cn(
            'w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit] pointer-events-none select-none transition-opacity duration-500 banner-video-sharp',
            isBuffering ? 'opacity-0' : 'opacity-100',
            className
          )}
        />
      )}

      {/* Optional Iframe Fallback (only when explicitly enabled) */}
      {useIframe && allowIframeFallback && iframeFallbackUrl && !videoFailedAll && (
        <iframe
          key={`iframe-${iframeFallbackUrl}`}
          src={iframeFallbackUrl}
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
          tabIndex={-1}
          onLoad={() => setIsBuffering(false)}
          onError={() => {
            setVideoFailedAll(true);
            setIsBuffering(false);
          }}
          className={cn(
            'w-full h-full min-w-full min-h-full border-0 pointer-events-none select-none scale-[1.28] rounded-[inherit] transition-opacity duration-500',
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
          className={cn('w-full h-full object-cover object-center rounded-[inherit]', className)}
        />
      )}
    </div>
  );
};
