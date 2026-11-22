import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface DriveAwareBannerMediaProps {
  directVideoUrl: string;
  iframeFallbackUrl?: string;
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
 * - Lấp đầy khung banner và tối ưu hiển thị sắc nét bằng GPU compositing
 * - Tự động fallback sang <iframe> Google Drive preview nếu trình duyệt chặn phát luồng trực tiếp
 */
export const DriveAwareBannerMedia: React.FC<DriveAwareBannerMediaProps> = ({
  directVideoUrl,
  iframeFallbackUrl,
  posterUrl,
  title = 'Banner background video',
  forceIframeFallback = false,
  muted = true,
  loop = true,
  className,
  iframeClassName,
  onModeChange,
}) => {
  const [useIframe, setUseIframe] = useState<boolean>(forceIframeFallback);
  const [videoFailedAll, setVideoFailedAll] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setUseIframe(forceIframeFallback);
    setVideoFailedAll(false);
    setIsBuffering(true);
  }, [directVideoUrl, iframeFallbackUrl, forceIframeFallback]);

  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;
    el.defaultMuted = muted;
    el.muted = muted;
    el.loop = loop;
    el.playsInline = true;
  }, [muted, loop, directVideoUrl, useIframe]);

  useEffect(() => {
    if (!isBuffering || useIframe || videoFailedAll || !iframeFallbackUrl) {
      return;
    }
    const timer = window.setTimeout(() => {
      setUseIframe(true);
      setIsBuffering(true);
    }, 9000);
    return () => window.clearTimeout(timer);
  }, [isBuffering, useIframe, videoFailedAll, iframeFallbackUrl]);

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
    <div className="relative w-full h-full overflow-hidden rounded-[inherit]">
      {/* Poster & Loading indicator while video/iframe buffers (no blur filter over media) */}
      {isBuffering && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-slate-900/70" />
          )}
          <div className="absolute inset-0 bg-slate-950/24 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[999px] bg-black/55 border border-white/20 text-white text-xs font-play">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Đang tải video nền...</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary: HTML5 <video> Direct Stream */}
      {!useIframe && !videoFailedAll && (
        <video
          ref={videoElRef}
          key={`video-${directVideoUrl}`}
          src={directVideoUrl}
          poster={posterUrl}
          autoPlay
          muted={muted}
          loop={loop}
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          preload="auto"
          onLoadedData={() => setIsBuffering(false)}
          onCanPlay={() => {
            setIsBuffering(false);
            const el = videoElRef.current;
            if (el) {
              el.defaultMuted = muted;
              el.muted = muted;
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
          onError={() => {
            if (iframeFallbackUrl) {
              setUseIframe(true);
              setIsBuffering(true);
            } else {
              setVideoFailedAll(true);
              setIsBuffering(false);
            }
          }}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          className={cn(
            'w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit] transition-opacity duration-500 banner-video-sharp',
            isBuffering ? 'opacity-0' : 'opacity-100',
            className
          )}
        />
      )}

      {/* Fallback: Google Drive Preview <iframe> */}
      {useIframe && iframeFallbackUrl && !videoFailedAll && (
        <iframe
          key={`iframe-${iframeFallbackUrl}`}
          src={iframeFallbackUrl}
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
          onLoad={() => setIsBuffering(false)}
          onError={() => {
            setVideoFailedAll(true);
            setIsBuffering(false);
          }}
          className={cn(
            'w-full h-full border-0 pointer-events-none scale-[1.12] rounded-[inherit] transition-opacity duration-500',
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
