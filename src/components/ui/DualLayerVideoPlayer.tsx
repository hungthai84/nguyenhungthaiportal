'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export interface DualLayerVideoPlayerProps {
  video1Id?: string;
  video1Src?: string;
  video2Id?: string;
  video2Src?: string;
  autoPlayVideo1?: boolean;
  muteVideo1?: boolean;
  loopVideo1?: boolean;
  capsuleVariant?: 'home' | 'about';
  hideSpeaker?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type StreamStage = 'custom' | 'proxy' | 'uc' | 'alt' | 'iframe';

const DEFAULT_VIDEO_1_ID = '1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp';
const DEFAULT_VIDEO_2_ID = '1YBxLU_NyWM8T3WAjOvtjSz0iP_6m1aB5';

const normalizeMediaSrc = (src?: string): string | undefined => {
  if (!src) return undefined;
  const trimmed = src.trim();
  if (!trimmed) return undefined;
  if (/^https:\/\/(photos\.app\.goo\.gl\/|photos\.google\.com\/share\/)/i.test(trimmed)) {
    return `/api/media/photos-video?url=${encodeURIComponent(trimmed)}`;
  }
  return trimmed;
};

export const DualLayerVideoPlayer: React.FC<DualLayerVideoPlayerProps> = ({
  video1Id = DEFAULT_VIDEO_1_ID,
  video1Src,
  video2Id = DEFAULT_VIDEO_2_ID,
  video2Src,
  autoPlayVideo1 = true,
  muteVideo1 = true,
  loopVideo1 = true,
  capsuleVariant = 'about',
  hideSpeaker = false,
  className,
  style,
}) => {
  const { showToast } = useToast();
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isInViewportRef = useRef<boolean>(true);

  const resolvedVideo1Src = normalizeMediaSrc(video1Src);
  const resolvedVideo2Src = normalizeMediaSrc(video2Src);

  const initialVideo1Stage: StreamStage = resolvedVideo1Src ? 'custom' : 'proxy';
  const initialVideo2Stage: StreamStage = resolvedVideo2Src ? 'custom' : 'proxy';

  const video1StageRef = useRef<StreamStage>(initialVideo1Stage);
  const video2StageRef = useRef<StreamStage>(initialVideo2Stage);
  const isPlayingIntroRef = useRef<boolean>(false);
  const isAudioOnRef = useRef<boolean>(!muteVideo1);

  const [video1Stage, setVideo1Stage] = useState<StreamStage>(initialVideo1Stage);
  const [video2Stage, setVideo2Stage] = useState<StreamStage>(initialVideo2Stage);
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(false);
  const [isVideo2Ready, setIsVideo2Ready] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(!muteVideo1);
  const [isPosterError, setIsPosterError] = useState<boolean>(false);

  // Intersection Observer to pause video when scrolled out of viewport and resume when entering viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        isInViewportRef.current = isVisible;
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

        if (isVisible) {
          if (!isPlayingIntroRef.current && v1 && v1.paused) {
            tryStartVideo1(v1, isAudioOnRef.current);
          } else if (isPlayingIntroRef.current && v2 && v2.paused) {
            tryStartVideo2(v2, isAudioOnRef.current);
          }
        } else {
          if (v1 && !v1.paused) v1.pause();
          if (v2 && !v2.paused) v2.pause();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getVideo1StreamUrl = useCallback(
    (stage: StreamStage, id: string): string => {
      if (stage === 'custom' && resolvedVideo1Src) {
        return resolvedVideo1Src;
      }
      if (stage === 'uc') {
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
      if (stage === 'alt') {
        return `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
      }
      return `/api/media/drive-video/${id}`;
    },
    [resolvedVideo1Src]
  );

  const getVideo2StreamUrl = useCallback(
    (stage: StreamStage, id: string): string => {
      if (stage === 'custom' && resolvedVideo2Src) {
        return resolvedVideo2Src;
      }
      if (stage === 'uc') {
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
      if (stage === 'alt') {
        return `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
      }
      return `/api/media/drive-video/${id}`;
    },
    [resolvedVideo2Src]
  );

  const enforceVideoAttributes = useCallback(
    (el: HTMLVideoElement | null, muted: boolean, autoplay: boolean, loop: boolean = true) => {
      if (!el) return;
      el.defaultMuted = muted;
      el.muted = muted;
      el.volume = 1;
      el.loop = loop;
      el.autoplay = autoplay;
      el.playsInline = true;
      el.controls = false;
      el.disablePictureInPicture = true;
      (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
      if (muted) {
        el.setAttribute('muted', '');
      } else {
        el.removeAttribute('muted');
      }
      if (autoplay) {
        el.setAttribute('autoplay', '');
      } else {
        el.removeAttribute('autoplay');
      }
      if (loop) {
        el.setAttribute('loop', '');
      } else {
        el.removeAttribute('loop');
      }
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
      el.removeAttribute('controls');
    },
    []
  );

  const tryStartVideo1 = useCallback(
    (el: HTMLVideoElement | null, audioOn: boolean) => {
      if (!el) return;
      enforceVideoAttributes(el, !audioOn, autoPlayVideo1, loopVideo1);
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (audioOn && !isPlayingIntroRef.current) {
            isAudioOnRef.current = false;
            setIsAudioOn(false);
            enforceVideoAttributes(el, true, autoPlayVideo1, loopVideo1);
            el.play().catch(() => {});
          }
        });
      }
    },
    [autoPlayVideo1, enforceVideoAttributes, loopVideo1]
  );

  const tryStartVideo2 = useCallback(
    (el: HTMLVideoElement | null, audioOn: boolean) => {
      if (!el) return;
      enforceVideoAttributes(el, !audioOn, true, true);
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          if (!isPlayingIntroRef.current) return;
          if (err && err.name === 'NotAllowedError' && audioOn) {
            isAudioOnRef.current = false;
            setIsAudioOn(false);
            enforceVideoAttributes(el, true, true, true);
            el.play().catch(() => {});
            showToast('Trình duyệt tạm chặn âm thanh tự động — bấm biểu tượng loa để bật tiếng.');
          }
        });
      }
    },
    [enforceVideoAttributes, showToast]
  );

  const loadVideo1 = useCallback(
    (stage: StreamStage) => {
      video1StageRef.current = stage;
      setVideo1Stage(stage);
      if (stage === 'iframe') return;

      const video = video1Ref.current;
      if (!video) return;

      video.src = getVideo1StreamUrl(stage, video1Id);
      video.preload = 'metadata';
      const shouldAudioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, autoPlayVideo1, loopVideo1);
      try {
        video.load();
      } catch {}
      if (!isPlayingIntroRef.current && autoPlayVideo1) {
        tryStartVideo1(video, shouldAudioOn);
      }
    },
    [autoPlayVideo1, enforceVideoAttributes, getVideo1StreamUrl, loopVideo1, tryStartVideo1, video1Id]
  );

  const warmUpVideo2 = useCallback(() => {
    if (video2StageRef.current === 'iframe') return;
    const v2 = video2Ref.current;
    if (!v2) return;
    const targetSrc = getVideo2StreamUrl(video2StageRef.current, video2Id);
    if (!v2.src) {
      v2.preload = 'metadata';
      v2.src = targetSrc;
    }
  }, [getVideo2StreamUrl, video2Id]);

  const loadVideo2 = useCallback(
    (stage: StreamStage, shouldPlayImmediately: boolean) => {
      video2StageRef.current = stage;
      setVideo2Stage(stage);
      if (stage === 'iframe') return;

      const video = video2Ref.current;
      if (!video) return;

      video.src = getVideo2StreamUrl(stage, video2Id);
      video.preload = shouldPlayImmediately ? 'auto' : 'metadata';
      const shouldAudioOn = isPlayingIntroRef.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, shouldPlayImmediately, true);
      try {
        video.load();
      } catch {}
      if (shouldPlayImmediately && isPlayingIntroRef.current) {
        tryStartVideo2(video, shouldAudioOn);
      }
    },
    [enforceVideoAttributes, getVideo2StreamUrl, tryStartVideo2, video2Id]
  );

  useEffect(() => {
    setIsPosterError(false);
    const startStage1: StreamStage = resolvedVideo1Src ? 'custom' : 'proxy';
    const startStage2: StreamStage = resolvedVideo2Src ? 'custom' : 'proxy';
    video1StageRef.current = startStage1;
    video2StageRef.current = startStage2;
    setVideo1Stage(startStage1);
    setVideo2Stage(startStage2);

    if (!isPlayingIntroRef.current) {
      isAudioOnRef.current = !muteVideo1;
      setIsAudioOn(!muteVideo1);
    }

    loadVideo1(startStage1);
    const v2 = video2Ref.current;
    if (v2) {
      if (isPlayingIntroRef.current) {
        v2.src = getVideo2StreamUrl(startStage2, video2Id);
        v2.preload = 'auto';
        enforceVideoAttributes(v2, !isAudioOnRef.current, true, true);
        tryStartVideo2(v2, isAudioOnRef.current);
      } else {
        v2.removeAttribute('src');
        v2.preload = 'none';
        enforceVideoAttributes(v2, true, false, true);
      }
    }
  }, [enforceVideoAttributes, getVideo2StreamUrl, loadVideo1, muteVideo1, tryStartVideo2, video1Id, resolvedVideo1Src, video2Id, resolvedVideo2Src]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      if (document.hidden) {
        if (v1 && !v1.paused) v1.pause();
        if (v2 && !v2.paused) v2.pause();
      } else if (isPlayingIntroRef.current) {
        if (v2 && video2StageRef.current !== 'iframe' && v2.paused) {
          tryStartVideo2(v2, isAudioOnRef.current);
        }
      } else if (autoPlayVideo1 && v1 && video1StageRef.current !== 'iframe' && v1.paused) {
        tryStartVideo1(v1, isAudioOnRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoPlayVideo1, tryStartVideo1, tryStartVideo2]);

  const handleVideo1Error = useCallback(() => {
    if (video1StageRef.current === 'custom') {
      if (video1Id) loadVideo1('proxy');
    } else if (video1StageRef.current === 'proxy') {
      loadVideo1('uc');
    } else if (video1StageRef.current === 'uc') {
      loadVideo1('alt');
    } else if (video1StageRef.current === 'alt') {
      video1StageRef.current = 'iframe';
      setVideo1Stage('iframe');
    }
  }, [loadVideo1, video1Id]);

  const handleVideo2Error = useCallback(() => {
    if (video2StageRef.current === 'custom') {
      if (video2Id) loadVideo2('proxy', isPlayingIntroRef.current);
    } else if (video2StageRef.current === 'proxy') {
      loadVideo2('uc', isPlayingIntroRef.current);
    } else if (video2StageRef.current === 'uc') {
      loadVideo2('alt', isPlayingIntroRef.current);
    } else if (video2StageRef.current === 'alt') {
      video2StageRef.current = 'iframe';
      setVideo2Stage('iframe');
      if (isPlayingIntroRef.current) {
        setIsVideo2Ready(true);
      }
    }
  }, [loadVideo2, video2Id]);

  const handlePlayIntro = useCallback(() => {
    isPlayingIntroRef.current = true;
    isAudioOnRef.current = true;
    setIsPlayingIntro(true);
    setIsAudioOn(true);
    setIsVideo2Ready(false);

    if (video2StageRef.current === 'iframe') {
      setIsVideo2Ready(true);
      const v1 = video1Ref.current;
      if (v1 && !v1.paused) v1.pause();
      showToast('Đang phát Video 2 (mở âm thanh)');
      return;
    }

    const v2 = video2Ref.current;
    if (v2) {
      const targetSrc = getVideo2StreamUrl(video2StageRef.current, video2Id);
      if (!v2.src || (video2Id ? !v2.src.includes(video2Id) && v2.src !== targetSrc : v2.src !== targetSrc)) {
        v2.src = targetSrc;
      }
      v2.preload = 'auto';
      enforceVideoAttributes(v2, false, true, true);
      if (v2.readyState >= 1) {
        try {
          v2.currentTime = 0;
        } catch {}
      }
      tryStartVideo2(v2, true);
    }
    showToast('Đang phát Video 2 (mở âm thanh)');
  }, [enforceVideoAttributes, getVideo2StreamUrl, showToast, tryStartVideo2, video2Id]);

  const handleCancelIntro = useCallback(() => {
    isPlayingIntroRef.current = false;
    const restoredAudioOn = !muteVideo1;
    isAudioOnRef.current = restoredAudioOn;
    setIsPlayingIntro(false);
    setIsVideo2Ready(false);
    setIsAudioOn(restoredAudioOn);

    const v2 = video2Ref.current;
    if (v2) {
      try {
        v2.pause();
      } catch {}
      enforceVideoAttributes(v2, true, false, true);
      if (v2.readyState >= 1) {
        try {
          v2.currentTime = 0;
        } catch {}
      }
    }

    const v1 = video1Ref.current;
    if (v1 && video1StageRef.current !== 'iframe') {
      enforceVideoAttributes(v1, !restoredAudioOn, autoPlayVideo1, loopVideo1);
      if (autoPlayVideo1) {
        tryStartVideo1(v1, restoredAudioOn);
      }
    }
    showToast(restoredAudioOn ? 'Đã quay về Video 1' : 'Đã quay về Video 1 (tắt âm thanh)');
  }, [autoPlayVideo1, enforceVideoAttributes, loopVideo1, muteVideo1, showToast, tryStartVideo1]);

  const toggleVideoMute = useCallback(() => {
    if (!isPlayingIntroRef.current) {
      // Khi đang ở chế độ Video 1 nền lặp mà bấm loa bật tiếng -> Chuyển ngay sang phát video có âm thanh
      handlePlayIntro();
      return;
    }
    const nextAudioOn = !isAudioOnRef.current;
    isAudioOnRef.current = nextAudioOn;
    setIsAudioOn(nextAudioOn);

    const v2 = video2Ref.current;
    if (v2 && video2StageRef.current !== 'iframe') {
      enforceVideoAttributes(v2, !nextAudioOn, true, true);
      if (v2.paused) tryStartVideo2(v2, nextAudioOn);
    }
    showToast(nextAudioOn ? 'Đã bật âm thanh video' : 'Đã tắt âm thanh video');
  }, [enforceVideoAttributes, handlePlayIntro, showToast, tryStartVideo2]);

  const isHomeCircle = capsuleVariant === 'home';

  const sharedVideoStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover',
    objectPosition: isHomeCircle ? '50% 20%' : '50% 22%',
    transform: isHomeCircle ? 'translateZ(0) scale(1.06)' : 'translateZ(0) scale(1.02)',
    borderRadius: isHomeCircle ? '9999px' : undefined,
    backfaceVisibility: 'hidden',
  };

  const sharedVideoClass = cn(
    'absolute inset-0 w-full h-full min-w-full min-h-full object-cover banner-video-sharp select-none pointer-events-none transition-opacity duration-300',
    isHomeCircle ? 'rounded-full' : 'rounded-[inherit]'
  );

  const hasPositionClass = /\b(absolute|fixed|sticky|static)\b/.test(className || '');

  return (
    <div
      ref={rootRef}
      className={cn(
        !hasPositionClass && 'relative',
        isHomeCircle ? 'overflow-visible rounded-full' : 'overflow-hidden rounded-[inherit]',
        'w-full h-full min-w-full min-h-full flex items-center justify-center',
        className
      )}
      style={isHomeCircle ? { borderRadius: '9999px', ...style } : style}
    >
      {/* Dual Video Layer container */}
      <div
        style={
          isHomeCircle
            ? {
                containerType: 'size',
                borderRadius: '9999px',
                clipPath: 'circle(50% at 50% 50%)',
                WebkitClipPath: 'circle(50% at 50% 50%)',
              }
            : { containerType: 'size' }
        }
        className={cn(
          isHomeCircle ? 'home-circle-video-media rounded-full' : 'project-detail-banner-media rounded-[inherit]',
          'absolute inset-0 pointer-events-none overflow-hidden w-full h-full z-0'
        )}
      >
        {/* Ảnh nền tải trước giúp card không bị trống khi đệm luồng video */}
        {video1Id && !isPosterError && (
          <img
            src={`https://drive.google.com/thumbnail?id=${video1Id}&sz=w1600`}
            alt="Hình nền video"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            aria-hidden="true"
            onError={() => setIsPosterError(true)}
            style={sharedVideoStyle}
            className={cn(sharedVideoClass, isPlayingIntro && isVideo2Ready ? 'opacity-0 z-0' : 'opacity-100 z-0')}
          />
        )}

        {/* VIDEO 1 */}
        {video1Stage !== 'iframe' ? (
          <video
            ref={video1Ref}
            poster={video1Id ? `https://drive.google.com/thumbnail?id=${video1Id}&sz=w1600` : undefined}
            autoPlay={autoPlayVideo1}
            loop={loopVideo1}
            muted={!(!isPlayingIntro && isAudioOn)}
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, autoPlayVideo1 && !isPlayingIntroRef.current, loopVideo1);
              if (autoPlayVideo1 && !isPlayingIntroRef.current && v.paused) tryStartVideo1(v, audioOn);
            }}
            onLoadedData={(e) => {
              const v = e.currentTarget;
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, autoPlayVideo1 && !isPlayingIntroRef.current, loopVideo1);
              if (autoPlayVideo1 && !isPlayingIntroRef.current && v.paused) tryStartVideo1(v, audioOn);
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, autoPlayVideo1 && !isPlayingIntroRef.current, loopVideo1);
              if (autoPlayVideo1 && !isPlayingIntroRef.current && v.paused) tryStartVideo1(v, audioOn);
            }}
            onPlaying={(e) => {
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(e.currentTarget, !audioOn, autoPlayVideo1 && !isPlayingIntroRef.current, loopVideo1);
            }}
            onEnded={(e) => {
              if (isPlayingIntroRef.current || !loopVideo1) return;
              const v = e.currentTarget;
              const audioOn = isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, autoPlayVideo1, loopVideo1);
              v.currentTime = 0;
              tryStartVideo1(v, audioOn);
            }}
            onPause={(e) => {
              if (!autoPlayVideo1 || isPlayingIntroRef.current) return;
              if (typeof document !== 'undefined' && document.hidden) return;
              const v = e.currentTarget;
              if (v.seeking) return;
              tryStartVideo1(v, isAudioOnRef.current);
            }}
            onError={handleVideo1Error}
            style={sharedVideoStyle}
            className={cn(sharedVideoClass, isPlayingIntro && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]')}
          />
        ) : (
          <iframe
            src={`https://drive.google.com/file/d/${video1Id}/preview?autoplay=${autoPlayVideo1 ? 1 : 0}&mute=${muteVideo1 ? 1 : 0}&loop=${loopVideo1 ? 1 : 0}`}
            title="Video 1"
            allow="autoplay; fullscreen; picture-in-picture"
            tabIndex={-1}
            aria-hidden="true"
            className={cn(
              'banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none transition-opacity duration-300',
              isPlayingIntro && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]'
            )}
          />
        )}

        {/* VIDEO 2 */}
        {video2Stage !== 'iframe' ? (
          <video
            ref={video2Ref}
            loop
            muted={!(isPlayingIntro && isAudioOn)}
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (!isPlayingIntroRef.current) {
                enforceVideoAttributes(v, true, false, true);
                return;
              }
              enforceVideoAttributes(v, !isAudioOnRef.current, true, true);
              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
            }}
            onLoadedData={(e) => {
              const v = e.currentTarget;
              if (!isPlayingIntroRef.current) return;
              enforceVideoAttributes(v, !isAudioOnRef.current, true, true);
              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              if (!isPlayingIntroRef.current) return;
              enforceVideoAttributes(v, !isAudioOnRef.current, true, true);
              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
            }}
            onPlaying={(e) => {
              if (!isPlayingIntroRef.current) {
                e.currentTarget.pause();
                return;
              }
              enforceVideoAttributes(e.currentTarget, !isAudioOnRef.current, true, true);
              setIsVideo2Ready(true);
              const v1 = video1Ref.current;
              if (v1 && !v1.paused) v1.pause();
            }}
            onEnded={(e) => {
              if (!isPlayingIntroRef.current) return;
              const v = e.currentTarget;
              const audioOn = isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, true, true);
              v.currentTime = 0;
              tryStartVideo2(v, audioOn);
            }}
            onPause={(e) => {
              if (!isPlayingIntroRef.current) return;
              if (typeof document !== 'undefined' && document.hidden) return;
              const v = e.currentTarget;
              if (v.seeking) return;
              tryStartVideo2(v, isAudioOnRef.current);
            }}
            onError={handleVideo2Error}
            style={sharedVideoStyle}
            className={cn(sharedVideoClass, isPlayingIntro && isVideo2Ready ? 'opacity-100 z-[2]' : 'opacity-0 z-[0]')}
          />
        ) : (
          isPlayingIntro && (
            <iframe
              src={`https://drive.google.com/file/d/${video2Id}/preview?autoplay=1&loop=1`}
              title="Video 2"
              allow="autoplay; fullscreen; picture-in-picture"
              tabIndex={-1}
              aria-hidden="true"
              className="banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none z-[2]"
            />
          )
        )}
      </div>

      {/* Bottom-Right Rim Video Play (large circle) & Sound Toggle (small circle) */}
      {capsuleVariant === 'home' ? (
        <>
          <button
            id="home-hero-video-play-btn"
            type="button"
            onPointerEnter={warmUpVideo2}
            onFocus={warmUpVideo2}
            onClick={(e) => {
              e.stopPropagation();
              if (isPlayingIntro) {
                handleCancelIntro();
              } else {
                handlePlayIntro();
              }
            }}
            style={{ borderRadius: '9999px' }}
            className={cn(
              'video-play-btn video-play-btn--home bottom-[7%] right-[5%] sm:bottom-[8%] sm:right-[6%]',
              isPlayingIntro ? 'is-playing' : '',
              'absolute z-30 w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] aspect-square p-0 !rounded-full rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer pointer-events-auto select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'
            )}
            title={isPlayingIntro ? 'Bấm để hủy phát video' : 'Bấm để phát video'}
            aria-label={isPlayingIntro ? 'Hủy phát video' : 'Phát video'}
            aria-pressed={isPlayingIntro}
          >
            {isPlayingIntro ? (
              <WebIcon name="cancel" className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.6] text-current shrink-0" />
            ) : (
              <WebIcon name="play" className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-current translate-x-[1.5px] shrink-0" />
            )}
          </button>

          <button
            id="home-hero-video-mute-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleVideoMute();
            }}
            style={{ borderRadius: '9999px' }}
            className={cn(
              'video-play-btn video-play-btn--home bottom-[-1%] right-[20%] sm:bottom-[-1.5%] sm:right-[21%]',
              isAudioOn ? 'is-playing' : '',
              'absolute z-30 w-9 h-9 sm:w-10 sm:h-10 aspect-square p-0 !rounded-full rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer pointer-events-auto select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'
            )}
            title={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
            aria-label={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
            aria-pressed={isAudioOn}
          >
            <span
              className={cn(
                'video-play-btn__sound w-full h-full rounded-full flex items-center justify-center',
                isAudioOn ? 'text-current' : 'is-muted text-white'
              )}
            >
              {isAudioOn ? (
                <WebIcon name="volume-2" className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-current shrink-0" />
              ) : (
                <WebIcon name="volume-x" className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white shrink-0" />
              )}
            </span>
          </button>
        </>
      ) : (
        <div
          style={{ borderRadius: '999px' }}
          className={cn(
            'theme-video-capsule video-play-btn',
            'video-play-btn--about bottom-3 right-3 sm:bottom-4 sm:right-4',
            isPlayingIntro ? 'is-playing' : '',
            'absolute z-30 max-w-[calc(100%-24px)] inline-flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-200 pointer-events-auto select-none'
          )}
        >
          {!hideSpeaker && (
            <>
              {/* Speaker Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideoMute();
                }}
                className={cn(
                  'video-play-btn__sound w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
                  isAudioOn ? 'text-current shadow-xs' : 'is-muted text-white shadow-md'
                )}
                title={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
                aria-label={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
                aria-pressed={isAudioOn}
              >
                <span className="flex items-center justify-center">
                  {isAudioOn ? (
                    <WebIcon name="volume-2" className="w-4 h-4 text-current" />
                  ) : (
                    <WebIcon name="volume-x" className="w-4 h-4 text-white" />
                  )}
                </span>
              </button>

              <div className="w-[1px] h-4 bg-current opacity-25 shrink-0" />
            </>
          )}

          {/* Play / Cancel Toggle Button */}
          {!isPlayingIntro ? (
            <button
              type="button"
              onPointerEnter={warmUpVideo2}
              onFocus={warmUpVideo2}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayIntro();
              }}
              style={{ paddingLeft: '8px', paddingRight: '12px', borderRadius: '999px' }}
              className="inline-flex items-center justify-center gap-2 min-h-[34px] pr-3 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 font-play"
              title="Bấm để phát video"
            >
              <span className="flex items-center justify-center">
                <WebIcon name="play" className="w-4 h-4 fill-current text-current shrink-0" style={{ height: '16px', width: '16px' }} />
              </span>
              <span className="typo-button text-current whitespace-nowrap font-play text-left">
                Phát Video
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCancelIntro();
              }}
              style={{ paddingLeft: '8px', paddingRight: '12px', borderRadius: '999px' }}
              className="inline-flex items-center justify-center gap-2 min-h-[34px] pr-3 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 font-play"
              title="Bấm để hủy phát video"
            >
              <span className="flex items-center justify-center">
                <WebIcon name="cancel" className="w-4 h-4 stroke-[2.8] text-current shrink-0" style={{ height: '16px', width: '16px' }} />
              </span>
              <span className="typo-button text-current whitespace-nowrap font-play text-left">
                Hủy Phát
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DualLayerVideoPlayer;
