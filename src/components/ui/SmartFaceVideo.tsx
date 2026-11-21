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
}

/**
 * SmartFaceVideo: Tự động nhận diện kích thước khung chứa (ResizeObserver) và tỷ lệ gốc của video
 * để tính toán object-position / object-fit thông minh, luôn giữ trọn khuôn mặt nhân vật
 * ở mọi kích thước Desktop, Tablet và Mobile mà không bị cắt mất phần đầu/mặt.
 */
export const SmartFaceVideo: React.FC<SmartFaceVideoProps> = ({
  videoRef,
  faceAnchor,
  maxCropDistortion = 1.72,
  wrapperClassName,
  className,
  style,
  src,
  autoPlay = true,
  loop = false,
  muted = true,
  playsInline = true,
  onLoadedMetadata,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onClick,
  ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);

  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

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
  }, [src]);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.videoWidth > 0 && v.videoHeight > 0) {
      setNaturalSize({ w: v.videoWidth, h: v.videoHeight });
    }
    onLoadedMetadata?.(e);
  };

  // Tính toán chế độ hiển thị thông minh bảo toàn vùng khuôn mặt
  const anchorX = faceAnchor?.x ?? 50;
  const baseAnchorY = faceAnchor?.y ?? 18;

  let objectFit: 'cover' | 'contain' = 'cover';
  let objectPosition = `${anchorX}% ${baseAnchorY}%`;
  let isFaceSafeContain = false;

  if (containerSize.w > 0 && containerSize.h > 0 && naturalSize.w > 0 && naturalSize.h > 0) {
    const containerRatio = containerSize.w / containerSize.h;
    const videoRatio = naturalSize.w / naturalSize.h;
    const distortion = Math.max(containerRatio / videoRatio, videoRatio / containerRatio);

    if (distortion > maxCropDistortion) {
      // Khung thiết bị quá hẹp/dọc hoặc quá dẹt so với video -> chuyển sang hiển thị trọn vẹn khuôn mặt kết hợp nền mờ đồng bộ
      objectFit = 'contain';
      objectPosition = '50% 50%';
      isFaceSafeContain = true;
    } else if (containerRatio > videoRatio) {
      // Khung rộng hơn video -> cắt theo chiều dọc, neo sát phần đầu/mặt phía trên để không mất trán/mắt/cằm
      const cropIntensity = Math.min(1, (containerRatio / videoRatio - 1) / 0.75);
      const dynamicY = Math.round(Math.max(12, baseAnchorY - cropIntensity * 6));
      objectPosition = `${anchorX}% ${dynamicY}%`;
    } else {
      // Khung cao/hẹp hơn video -> giữ chính giữa theo chiều ngang và neo vùng mặt ở phần trên khung
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
      {/* Nền mờ đồng bộ từ chính video khi tỷ lệ khung quá hẹp/dài, loại bỏ hoàn toàn viền đen */}
      {isFaceSafeContain && src && (
        <video
          ref={ambientVideoRef}
          data-smart-face-ambient="true"
          src={src}
          autoPlay={autoPlay}
          loop
          muted
          playsInline
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

      {/* Video chính với cơ chế tự động giữ trọn khuôn mặt nhân vật */}
      <video
        {...restProps}
        ref={setMergedVideoRef}
        data-smart-face-primary="true"
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onLoadedMetadata={handleMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onClick={onClick}
        style={{
          ...style,
          objectFit,
          objectPosition,
        }}
        className={cn(
          'relative z-[1] w-full h-full rounded-[inherit] transition-[object-position,filter] duration-300',
          className
        )}
      />
    </div>
  );
};

export default SmartFaceVideo;
