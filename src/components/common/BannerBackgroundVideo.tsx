import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_FALLBACK_BANNER_VIDEO =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4';

export interface BannerBackgroundVideoProps {
  id?: string;
  src: string;
  fallbackSrc?: string;
  poster?: string;
  alt?: string;
  objectPosition?: string;
  className?: string;
}

const extractDriveFileId = (url: string): string | null => {
  const idParam = url.match(/[?&]id=([^&#]+)/i);
  if (idParam?.[1]) return idParam[1];
  const pathId = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  return pathId?.[1] ?? null;
};

export const BannerBackgroundVideo: React.FC<BannerBackgroundVideoProps> = ({
  id,
  src,
  fallbackSrc = DEFAULT_FALLBACK_BANNER_VIDEO,
  poster,
  alt = 'Banner background',
  objectPosition = '50% 22%',
  className,
}) => {
  const driveId = extractDriveFileId(src);
  const normalizedPrimarySrc =
    driveId && /\/file\/d\/[^/]+\/preview/i.test(src)
      ? `https://drive.google.com/uc?export=download&id=${driveId}`
      : src;
  const driveDirectAlt = driveId
    ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`
    : '';
  const drivePreviewIframe = driveId
    ? `https://drive.google.com/file/d/${driveId}/preview?autoplay=1&mute=1&loop=1`
    : '';

  const [stage, setStage] = useState<'primary' | 'driveAlt' | 'driveIframe' | 'fallback' | 'poster'>('primary');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setStage('primary');
  }, [src, fallbackSrc]);

  const activeSrc =
    stage === 'primary'
      ? normalizedPrimarySrc
      : stage === 'driveAlt'
        ? driveDirectAlt || fallbackSrc
        : stage === 'fallback'
          ? fallbackSrc
          : '';

  useEffect(() => {
    if (stage === 'poster' || stage === 'driveIframe') return;
    if (stage === 'primary' && !driveDirectAlt && !drivePreviewIframe && (!fallbackSrc || normalizedPrimarySrc === fallbackSrc)) return;
    if (stage === 'driveAlt' && !drivePreviewIframe && (!fallbackSrc || driveDirectAlt === fallbackSrc)) return;
    if (stage === 'fallback') return;

    const stallTimer = window.setTimeout(() => {
      const el = videoRef.current;
      if (el && el.readyState < 2) {
        if (stage === 'primary' && driveDirectAlt && normalizedPrimarySrc !== driveDirectAlt) {
          setStage('driveAlt');
        } else if (drivePreviewIframe) {
          setStage('driveIframe');
        } else if (fallbackSrc && activeSrc !== fallbackSrc) {
          setStage('fallback');
        }
      }
    }, 4500);
    return () => window.clearTimeout(stallTimer);
  }, [stage, normalizedPrimarySrc, driveDirectAlt, drivePreviewIframe, fallbackSrc, activeSrc]);

  const enforceVideoState = (el: HTMLVideoElement | null) => {
    if (!el) return;
    el.defaultMuted = true;
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.autoplay = true;
    el.controls = false;
    el.disablePictureInPicture = true;
    (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    el.removeAttribute('controls');
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el || stage === 'poster' || stage === 'driveIframe') return;
    enforceVideoState(el);
    el.play().catch(() => {});
  }, [activeSrc, stage]);

  if (stage === 'driveIframe' && drivePreviewIframe) {
    return (
      <iframe
        id={id}
        src={drivePreviewIframe}
        title={alt}
        allow="autoplay; encrypted-media; fullscreen"
        tabIndex={-1}
        aria-hidden="true"
        onError={() => {
          if (fallbackSrc) {
            setStage('fallback');
          } else {
            setStage('poster');
          }
        }}
        className={cn(
          'banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none transition-opacity duration-500',
          className
        )}
      />
    );
  }

  if (stage === 'poster' && poster) {
    return (
      <img
        id={id}
        src={poster}
        alt={alt}
        referrerPolicy="no-referrer"
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
        }}
        className={cn(
          'absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] pointer-events-none select-none transition-all duration-700',
          className
        )}
      />
    );
  }

  return (
    <video
      id={id}
      ref={videoRef}
      key={`${stage}-${activeSrc}`}
      src={activeSrc}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget;
        enforceVideoState(v);
        if (v.paused) v.play().catch(() => {});
      }}
      onLoadedData={(e) => {
        const v = e.currentTarget;
        enforceVideoState(v);
        if (v.paused) v.play().catch(() => {});
      }}
      onCanPlay={(e) => {
        const v = e.currentTarget;
        enforceVideoState(v);
        if (v.paused) v.play().catch(() => {});
      }}
      onEnded={(e) => {
        const v = e.currentTarget;
        enforceVideoState(v);
        v.currentTime = 0;
        v.play().catch(() => {});
      }}
      onPause={(e) => {
        if (typeof document !== 'undefined' && document.hidden) return;
        const v = e.currentTarget;
        enforceVideoState(v);
        v.play().catch(() => {});
      }}
      onPlaying={(e) => {
        const v = e.currentTarget;
        enforceVideoState(v);
      }}
      onError={() => {
        if (stage === 'primary' && driveDirectAlt && normalizedPrimarySrc !== driveDirectAlt) {
          setStage('driveAlt');
        } else if (drivePreviewIframe) {
          setStage('driveIframe');
        } else if (stage !== 'fallback' && fallbackSrc && activeSrc !== fallbackSrc) {
          setStage('fallback');
        } else {
          setStage('poster');
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
        objectPosition,
        transform: 'translateZ(0) scale(1.02)',
        backfaceVisibility: 'hidden',
      }}
      className={cn(
        'absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] pointer-events-none select-none banner-video-sharp transition-all duration-700',
        className
      )}
    />
  );
};

export default BannerBackgroundVideo;
