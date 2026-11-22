import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface VideoBannerProps {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  objectPosition?: string;
  /**
   * Khoảng đệm trước khi banner lọt vào viewport (IntersectionObserver rootMargin).
   * Mặc định '250px' để bắt đầu tải ngay khi banner sắp xuất hiện.
   */
  lazyRootMargin?: string;
  /**
   * Khi true (mặc định cho Banner Card), video đóng vai trò lớp nền toàn khung card
   * (pointer-events-none, không controls, tự co giãn object-cover) nằm phía dưới nội dung banner.
   */
  backgroundMode?: boolean;
}

export const buildGoogleDrivePreviewUrl = (videoId: string): string => {
  const cleanId = videoId.trim();
  return `https://drive.google.com/file/d/${encodeURIComponent(cleanId)}/preview`;
};

export const buildSameOriginDriveVideoUrl = (videoId: string): string => {
  const cleanId = videoId.trim();
  return `/api/media/drive-video/${encodeURIComponent(cleanId)}`;
};

export const buildDirectDriveVideoUrl = (videoId: string): string => {
  const cleanId = videoId.trim();
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(cleanId)}&export=download&confirm=t`;
};

type BannerStreamStage = 'proxy' | 'direct' | 'iframe';

/**
 * Component VideoBanner dùng chung cho toàn bộ Banner Card:
 * - Lazy loading bằng IntersectionObserver: chỉ gắn và tải video Google Drive khi banner sắp vào viewport.
 * - Tự động tạm dừng khi cuộn ra khỏi viewport để tiết kiệm GPU/băng thông và phát tiếp khi cuộn lại.
 * - Phát video nền trực tiếp bằng thẻ HTML5 <video> qua luồng MP4 cùng nguồn (206 Partial Content),
 *   đảm bảo Autoplay, Loop vô tận, Mute mặc định, Không hiển thị nút control và tự co giãn phủ kín khung card.
 * - Tự động dự phòng sang luồng MP4 trực tiếp từ Google Drive và cuối cùng sang iframe /preview nếu cần.
 */
export const VideoBanner: React.FC<VideoBannerProps> = React.memo(
  ({
    videoId,
    title,
    className,
    aspectRatio,
    autoplay = true,
    loop = true,
    muted = true,
    objectPosition = '50% 50%',
    lazyRootMargin = '250px',
    backgroundMode = true,
  }) => {
    const supportsIO = typeof IntersectionObserver !== 'undefined';
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoElRef = useRef<HTMLVideoElement | null>(null);
    const isInViewportRef = useRef<boolean>(!supportsIO);
    const [shouldLoad, setShouldLoad] = useState<boolean>(!supportsIO);
    const [stage, setStage] = useState<BannerStreamStage>('proxy');
    const [isReady, setIsReady] = useState<boolean>(false);

    const enforceVideoAttributes = useCallback(
      (el: HTMLVideoElement | null) => {
        if (!el) return;
        el.defaultMuted = muted;
        el.muted = muted;
        el.loop = loop;
        el.autoplay = autoplay;
        el.playsInline = true;
        el.controls = false;
        el.disablePictureInPicture = true;
        (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
        if (muted) el.setAttribute('muted', '');
        if (autoplay) el.setAttribute('autoplay', '');
        if (loop) el.setAttribute('loop', '');
        el.setAttribute('playsinline', '');
        el.setAttribute('webkit-playsinline', '');
        el.removeAttribute('controls');
      },
      [autoplay, loop, muted]
    );

    const tryAutoPlay = useCallback(
      (el: HTMLVideoElement | null) => {
        if (!el || !autoplay || !isInViewportRef.current) return;
        enforceVideoAttributes(el);
        if (el.paused) {
          const playPromise = el.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              // Retry once muted is explicitly enforced in DOM
              el.muted = true;
              el.defaultMuted = true;
              el.setAttribute('muted', '');
              el.play().catch(() => {});
            });
          }
        }
      },
      [autoplay, enforceVideoAttributes]
    );

    const attachVideoRef = useCallback(
      (el: HTMLVideoElement | null) => {
        videoElRef.current = el;
        if (el) {
          enforceVideoAttributes(el);
          if (el.readyState >= 2 && isInViewportRef.current) {
            tryAutoPlay(el);
          }
        }
      },
      [enforceVideoAttributes, tryAutoPlay]
    );

    useEffect(() => {
      setStage('proxy');
      setIsReady(false);
      setShouldLoad(isInViewportRef.current);
    }, [videoId]);

    // Lazy load khi banner sắp xuất hiện trong viewport + tạm dừng khi cuộn ra ngoài
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
            if (video && autoplay && stage !== 'iframe') {
              tryAutoPlay(video);
            }
          } else {
            const video = videoElRef.current;
            if (video && !video.paused) {
              video.pause();
            }
          }
        },
        { rootMargin: lazyRootMargin, threshold: 0 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [autoplay, lazyRootMargin, stage, tryAutoPlay]);

    // Resume playback if tab returns to foreground or after first user gesture (for strict mobile browsers)
    useEffect(() => {
      if (!shouldLoad || !autoplay || stage === 'iframe') return;

      const resumeIfPaused = () => {
        if (typeof document !== 'undefined' && document.hidden) return;
        if (!isInViewportRef.current) return;
        tryAutoPlay(videoElRef.current);
      };

      document.addEventListener('visibilitychange', resumeIfPaused);
      window.addEventListener('pointerdown', resumeIfPaused, { passive: true, once: true });
      window.addEventListener('touchstart', resumeIfPaused, { passive: true, once: true });

      return () => {
        document.removeEventListener('visibilitychange', resumeIfPaused);
        window.removeEventListener('pointerdown', resumeIfPaused);
        window.removeEventListener('touchstart', resumeIfPaused);
      };
    }, [autoplay, shouldLoad, stage, tryAutoPlay, videoId]);

    const isDirectUrl = videoId.startsWith('http://') || videoId.startsWith('https://') || videoId.startsWith('/');
    const activeVideoSrc = isDirectUrl
      ? videoId
      : stage === 'proxy'
        ? buildSameOriginDriveVideoUrl(videoId)
        : buildDirectDriveVideoUrl(videoId);
    const previewSrc = isDirectUrl ? videoId : buildGoogleDrivePreviewUrl(videoId);

    const handleStreamError = () => {
      if (stage === 'proxy') {
        setStage('direct');
      } else if (stage === 'direct') {
        setStage('iframe');
      }
    };

    return (
      <div
        ref={containerRef}
        data-video-banner-id={videoId}
        data-video-lazy={shouldLoad ? 'loaded' : 'pending'}
        data-video-stage={stage}
        data-video-autoplay={autoplay ? 'true' : 'false'}
        data-video-loop={loop ? 'true' : 'false'}
        data-video-muted={muted ? 'true' : 'false'}
        style={{
          aspectRatio: aspectRatio || undefined,
          background: 'var(--bg-subcard, transparent)',
          containerType: 'size',
        }}
        className={cn(
          'video-banner',
          backgroundMode ? 'video-banner--background pointer-events-none select-none' : '',
          className
        )}
      >
        {shouldLoad && stage !== 'iframe' && (
          <video
            ref={attachVideoRef}
            key={`banner-video-${videoId}-${stage}`}
            src={activeVideoSrc}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            aria-hidden={backgroundMode ? true : undefined}
            tabIndex={backgroundMode ? -1 : undefined}
            onLoadedMetadata={(e) => {
              tryAutoPlay(e.currentTarget);
            }}
            onLoadedData={(e) => {
              setIsReady(true);
              tryAutoPlay(e.currentTarget);
            }}
            onCanPlay={(e) => {
              setIsReady(true);
              tryAutoPlay(e.currentTarget);
            }}
            onPlaying={(e) => {
              setIsReady(true);
              enforceVideoAttributes(e.currentTarget);
            }}
            onEnded={(e) => {
              if (!loop || !isInViewportRef.current) return;
              const v = e.currentTarget;
              enforceVideoAttributes(v);
              v.currentTime = 0;
              v.play().catch(() => {});
            }}
            onPause={(e) => {
              if (!autoplay || !loop || !isInViewportRef.current) return;
              if (typeof document !== 'undefined' && document.hidden) return;
              const v = e.currentTarget;
              enforceVideoAttributes(v);
              v.play().catch(() => {});
            }}
            onError={handleStreamError}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              objectFit: 'cover',
              objectPosition,
              transform: 'translateZ(0) scale(1.02)',
              backfaceVisibility: 'hidden',
            }}
            className={cn(
              'absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] pointer-events-none select-none banner-video-sharp transition-opacity duration-500',
              isReady ? 'opacity-100' : 'opacity-95'
            )}
          />
        )}

        {shouldLoad && stage === 'iframe' && (
          <iframe
            key={`banner-iframe-${videoId}`}
            src={previewSrc}
            title={title}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            tabIndex={backgroundMode ? -1 : undefined}
            aria-hidden={backgroundMode ? true : undefined}
            onLoad={() => setIsReady(true)}
            className={cn(
              'banner-drive-iframe-cover transition-opacity duration-500',
              isReady ? 'opacity-100' : 'opacity-90'
            )}
          />
        )}
      </div>
    );
  }
);

VideoBanner.displayName = 'VideoBanner';

export default VideoBanner;
