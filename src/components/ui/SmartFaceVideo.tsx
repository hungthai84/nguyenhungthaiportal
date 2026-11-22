import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface SmartFaceVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'children'> {
  /** Optional external ref synced to the primary <video> element */
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  /** Target horizontal/vertical face focal point in % (defaults to upper-center portrait safe zone) */
  faceAnchor?: {
    x?: number;
    y?: number;
  };
  /** Aspect ratio distortion threshold above which face-safe contain + blurred ambient fill activates */
  maxCropDistortion?: number;
  /** Additional classes applied to the outer container wrapper */
  wrapperClassName?: string;
  /** Always fill container edge-to-edge with object-fit: cover (disables blurred contain ambient pillars) */
  alwaysCover?: boolean;
}

const extractSmartVideoDriveId = (url?: string): string | null => {
  if (!url) return null;
  const ucMatch = url.match(/[?&]id=([^&#]+)/i);
  if (ucMatch?.[1]) return ucMatch[1];
  const pathMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  return pathMatch?.[1] ?? null;
};

const normalizeSmartVideoSrc = (url?: string): string | undefined => {
  if (!url) return url;
  if (/drive\.google\.com\/file\/d\//i.test(url)) {
    const id = extractSmartVideoDriveId(url);
    if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
};

/**
 * SmartFaceVideo: Tự động nhận diện kích thước khung chứa (ResizeObserver) và tỷ lệ gốc của video
 * để tính toán object-position / object-fit thông minh, luôn lấp đầy card sắc nét, tắt tiếng mặc định,
 * lặp vô tận và ẩn hoàn toàn thanh điều khiển trình duyệt ở mọi kích thước Desktop, Tablet và Mobile.
 */
export const SmartFaceVideo: React.FC<SmartFaceVideoProps> = ({
  videoRef,
  faceAnchor,
  maxCropDistortion = 1.72,
  wrapperClassName,
  alwaysCover = true,
  className,
  style,
  src,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'auto',
  onLoadedMetadata,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onError,
  onClick,
  ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);

  const normalizedSrc = normalizeSmartVideoSrc(src);
  const [driveFallbackActive, setDriveFallbackActive] = useState<boolean>(false);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    setDriveFallbackActive(false);
  }, [src]);

  const driveId = extractSmartVideoDriveId(normalizedSrc);
  const driveUsercontentUrl = driveId
    ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`
    : undefined;

  const effectiveSrc =
    driveFallbackActive && driveUsercontentUrl && normalizedSrc !== driveUsercontentUrl
      ? driveUsercontentUrl
      : normalizedSrc;

  const setMergedVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      internalVideoRef.current = node;
      if (videoRef && typeof videoRef === 'object' && 'current' in videoRef) {
        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
      }
    },
    [videoRef]
  );

  // Theo dõi kích thước khung thẻ video theo thời gian thực khi co giãn thiết bị
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w > 0 && h > 0) {
        setContainerSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      }
    };

    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Đọc lại videoWidth / videoHeight nếu metadata đã sẵn sàng khi đổi src
  useEffect(() => {
    const v = internalVideoRef.current;
    if (v && v.videoWidth > 0 && v.videoHeight > 0) {
      setNaturalSize({ w: v.videoWidth, h: v.videoHeight });
    }
  }, [effectiveSrc]);

  const syncVideoDomFlags = useCallback(
    (v: HTMLVideoElement | null) => {
      if (!v) return;
      v.defaultMuted = muted;
      v.muted = muted;
      v.loop = loop;
      v.playsInline = playsInline;
      v.autoplay = Boolean(autoPlay);
      v.controls = false;
      v.disablePictureInPicture = true;
      (v as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
      v.removeAttribute('controls');
    },
    [muted, loop, playsInline, autoPlay]
  );

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    syncVideoDomFlags(v);
    if (autoPlay && v.paused) {
      v.play().catch(() => {});
    }
    if (v.videoWidth > 0 && v.videoHeight > 0) {
      setNaturalSize({ w: v.videoWidth, h: v.videoHeight });
    }
    onLoadedMetadata?.(e);
  };

  // Đồng bộ thuộc tính muted/loop/controls trên HTMLVideoElement khi props thay đổi
  useEffect(() => {
    const v = internalVideoRef.current;
    syncVideoDomFlags(v);
    if (autoPlay && v && v.paused) {
      v.play().catch(() => {});
    }
  }, [syncVideoDomFlags, effectiveSrc, autoPlay]);

  // Tính toán chế độ hiển thị thông minh bảo toàn vùng khuôn mặt (hoặc alwaysCover cho video nền card)
  const anchorX = faceAnchor?.x ?? 50;
  const baseAnchorY = faceAnchor?.y ?? 18;

  let objectFit: 'cover' | 'contain' = 'cover';
  let objectPosition = `${anchorX}% ${baseAnchorY}%`;
  let isFaceSafeContain = false;

  if (!alwaysCover && containerSize.w > 0 && containerSize.h > 0 && naturalSize.w > 0 && naturalSize.h > 0) {
    const containerRatio = containerSize.w / containerSize.h;
    const videoRatio = naturalSize.w / naturalSize.h;
    const distortion = Math.max(containerRatio / videoRatio, videoRatio / containerRatio);

    if (distortion > maxCropDistortion) {
      objectFit = 'contain';
      objectPosition = '50% 50%';
      isFaceSafeContain = true;
    } else if (containerRatio > videoRatio) {
      const cropIntensity = Math.min(1, (containerRatio / videoRatio - 1) / 0.75);
      const dynamicY = Math.round(Math.max(12, baseAnchorY - cropIntensity * 6));
      objectPosition = `${anchorX}% ${dynamicY}%`;
    } else {
      objectPosition = `${anchorX}% ${baseAnchorY}%`;
    }
  }

  const handlePlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (ambientVideoRef.current) {
      ambientVideoRef.current.currentTime = e.currentTarget.currentTime;
      ambientVideoRef.current.play().catch(() => {});
    }
    onPlay?.(e);
  };

  const handlePause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (ambientVideoRef.current) {
      ambientVideoRef.current.pause();
    }
    onPause?.(e);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (ambientVideoRef.current && Math.abs(ambientVideoRef.current.currentTime - e.currentTarget.currentTime) > 0.6) {
      ambientVideoRef.current.currentTime = e.currentTarget.currentTime;
    }
    onTimeUpdate?.(e);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!onError && !driveFallbackActive && driveUsercontentUrl && normalizedSrc !== driveUsercontentUrl) {
      setDriveFallbackActive(true);
      return;
    }
    onError?.(e);
  };

  return (
    <div
      ref={containerRef}
      data-smart-face-video="true"
      data-face-safe-mode={isFaceSafeContain ? 'contain-ambient' : 'cover-anchored'}
      className={cn(
        'smart-face-video-root relative w-full h-full overflow-hidden rounded-[inherit]',
        wrapperClassName
      )}
    >
      {isFaceSafeContain && effectiveSrc && (
        <video
          ref={ambientVideoRef}
          data-smart-face-ambient="true"
          src={effectiveSrc}
          autoPlay={autoPlay}
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          aria-hidden="true"
          tabIndex={-1}
          style={{
            objectFit: 'cover',
            objectPosition: `${anchorX}% ${baseAnchorY}%`,
            filter: 'blur(26px) saturate(1.12)',
            transform: 'scale(1.16)',
          }}
          className="absolute inset-0 w-full h-full object-cover scale-115 blur-2xl opacity-75 saturate-110 pointer-events-none select-none z-0 rounded-[inherit]"
        />
      )}

      {/* Video chính */}
      <video
        {...restProps}
        ref={setMergedVideoRef}
        data-smart-face-primary="true"
        data-banner-always-cover={alwaysCover ? 'true' : undefined}
        src={effectiveSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        preload={preload}
        onLoadedMetadata={handleMetadata}
        onCanPlay={(e) => {
          const v = e.currentTarget;
          syncVideoDomFlags(v);
          if (autoPlay && v.paused) {
            v.play().catch(() => {});
          }
          restProps.onCanPlay?.(e);
        }}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onError={handleVideoError}
        onEnded={(e) => {
          if (loop) {
            const v = e.currentTarget;
            v.currentTime = 0;
            v.play().catch(() => {});
          }
          onEnded?.(e);
        }}
        onClick={onClick}
        style={{
          transform: 'translateZ(0) scale(1.005)',
          backfaceVisibility: 'hidden',
          ...style,
          objectFit,
          objectPosition,
        }}
        className={cn(
          'relative z-[1] w-full h-full min-w-full min-h-full object-cover rounded-[inherit] banner-video-sharp transition-[object-position,filter] duration-300',
          className
        )}
      />
    </div>
  );
};

export default SmartFaceVideo;
