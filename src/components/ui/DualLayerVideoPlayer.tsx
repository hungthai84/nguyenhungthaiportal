// Magnetic Button, by DesignBookmark (https://designbookmark.com/motion#db-magnetic-button)
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface MagSpring1D {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
}

const createMagSpring = (x: number, k = 400, c = 30): MagSpring1D => ({
  x,
  v: 0,
  t: x,
  k,
  c,
});

const stepMagSpring = (s: MagSpring1D, dt: number) => {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};

const clampMag = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

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
  const { language } = useLanguage();
  const isEn = language === 'en';
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isInViewportRef = useRef<boolean>(true);
  const magBtnRef = useRef<HTMLButtonElement | null>(null);
  const magLblRef = useRef<HTMLSpanElement | null>(null);
  const magCurRef = useRef<HTMLSpanElement | null>(null);

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

  // DesignBookmark Magnetic Button physics for Home Play Button (#home-hero-video-play-btn)
  useEffect(() => {
    if (!isHomeCircle) return;
    const field = rootRef.current;
    const mag = magBtnRef.current;
    const lbl = magLblRef.current;
    const cur = magCurRef.current;
    if (!field || !mag || !lbl) return;

    const R = 130;
    const bx = createMagSpring(0, 170, 13);
    const by = createMagSpring(0, 170, 13);
    const lx = createMagSpring(0, 220, 15);
    const ly = createMagSpring(0, 220, 15);
    const sc = createMagSpring(1, 400, 18);
    const co = createMagSpring(0, 200, 26);

    let px: number | null = null;
    let py: number | null = null;
    let last = -1e9;
    let clock = 0;
    let gx = 0;
    let gy = 0;
    let isPressed = false;
    let rafId: number | null = null;
    let lastNow = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      const r = field.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      last = clock;
    };
    const onPointerLeave = () => {
      px = null;
      isPressed = false;
    };
    const onPointerDown = () => {
      isPressed = true;
      sc.t = 0.94;
    };
    const onPointerUp = () => {
      isPressed = false;
      sc.t = 1;
      sc.v = 3;
    };

    field.addEventListener('pointermove', onPointerMove, { passive: true });
    field.addEventListener('pointerleave', onPointerLeave, { passive: true });
    mag.addEventListener('pointerdown', onPointerDown, { passive: true });
    mag.addEventListener('pointerup', onPointerUp, { passive: true });
    mag.addEventListener('pointercancel', onPointerUp, { passive: true });

    const loop = (now: number) => {
      if (!isInViewportRef.current) {
        lastNow = now;
        rafId = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min((now - lastNow) / 1000, 1 / 30);
      lastNow = now;

      // Resting center of #home-hero-video-play-btn relative to field
      const cx = mag.offsetLeft + mag.offsetWidth / 2;
      const cy = mag.offsetTop + mag.offsetHeight / 2;

      const sub = 4;
      const subDt = dt / sub;
      for (let k = 0; k < sub; k++) {
        clock += subDt;
        const ghost = px === null || clock - last > 2.5;
        if (ghost) {
          // 7 s loop: come in from the left, circle the button, leave to the right
          const t = clock % 7;
          if (t < 1.4) {
            gx = cx - 96 + (t / 1.4) * 66;
            gy = cy + 32 - (t / 1.4) * 26;
          } else if (t < 5) {
            const a = ((t - 1.4) / 3.6) * Math.PI * 2 + Math.PI;
            gx = cx + Math.cos(a) * 34;
            gy = cy + Math.sin(a) * 14 + 3;
          } else {
            const prog = (t - 5) / 2;
            gx = cx - 34 + prog * 145;
            gy = cy + 3 + prog * 36;
          }
          co.t = 0.55;
        } else {
          gx = px!;
          gy = py!;
          co.t = 0;
        }

        const dx = gx - cx;
        const dy = gy - cy;
        const d = Math.hypot(dx, dy);
        const pull = d < R ? 1 - (d / R) * 0.35 : 0;

        bx.t = dx * 0.32 * pull;
        by.t = dy * 0.38 * pull;
        lx.t = dx * 0.14 * pull;
        ly.t = dy * 0.18 * pull;
        sc.t = isPressed ? 0.94 : 1 + 0.06 * pull;

        stepMagSpring(bx, subDt);
        stepMagSpring(by, subDt);
        stepMagSpring(lx, subDt);
        stepMagSpring(ly, subDt);
        stepMagSpring(sc, subDt);
        stepMagSpring(co, subDt);
      }

      mag.style.transform = `translate(${bx.x.toFixed(2)}px, ${by.x.toFixed(2)}px) scale(${sc.x.toFixed(4)})`;
      lbl.style.transform = `translate(${lx.x.toFixed(2)}px, ${ly.x.toFixed(2)}px)`;
      if (cur) {
        cur.style.opacity = clampMag(co.x, 0, 1).toFixed(3);
        cur.style.transform = `translate(${gx.toFixed(2)}px, ${gy.toFixed(2)}px)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      field.removeEventListener('pointermove', onPointerMove);
      field.removeEventListener('pointerleave', onPointerLeave);
      mag.removeEventListener('pointerdown', onPointerDown);
      mag.removeEventListener('pointerup', onPointerUp);
      mag.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isHomeCircle]);

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

      {/* Bottom Rim Video Play ("Nghe giới thiệu" capsule formatted to active theme + DesignBookmark Magnetic Button) & Sound Toggle */}
      {capsuleVariant === 'home' ? (
        <>
          <div
            ref={magBtnRef as unknown as React.RefObject<HTMLDivElement>}
            id="home-hero-video-play-btn"
            role="group"
            aria-label={isEn ? 'Intro video & audio controls' : 'Điều khiển âm thanh & nghe giới thiệu'}
            onPointerEnter={warmUpVideo2}
            onFocus={warmUpVideo2}
            style={{ borderRadius: '999px' }}
            className={cn(
              'video-play-btn video-play-btn--home db-magnetic-play-btn bottom-[3%] right-[1%] sm:bottom-[4%] sm:right-[2%]',
              isPlayingIntro ? 'is-playing' : '',
              'absolute z-30 min-h-[40px] sm:min-h-[46px] pl-1.5 pr-3.5 sm:pl-2 sm:pr-4.5 py-1.5 sm:py-2 !rounded-[999px] rounded-[999px] inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap font-play font-bold typo-button tracking-wide pointer-events-auto select-none'
            )}
          >
            <span
              ref={magLblRef}
              className="db-mag-lbl inline-flex items-center justify-center gap-1.5 sm:gap-2 will-change-transform whitespace-nowrap"
            >
              {/* Nút Âm thanh gộp chung bên trái trong cùng viên thuốc Nghe giới thiệu */}
              <button
                id="home-hero-video-mute-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideoMute();
                }}
                style={{ borderRadius: '9999px' }}
                className={cn(
                  'video-play-btn__sound w-7 h-7 sm:w-8 sm:h-8 aspect-square p-0 !rounded-full rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 border border-current/20 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
                  isAudioOn ? 'text-current bg-white/15' : 'is-muted text-current bg-black/15 opacity-85'
                )}
                title={isAudioOn ? (isEn ? 'Mute video' : 'Tắt âm thanh video') : (isEn ? 'Unmute video' : 'Bật âm thanh video')}
                aria-label={isAudioOn ? (isEn ? 'Mute video' : 'Tắt âm thanh video') : (isEn ? 'Unmute video' : 'Bật âm thanh video')}
                aria-pressed={isAudioOn}
              >
                {isAudioOn ? (
                  <WebIcon name="volume-2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current shrink-0" />
                ) : (
                  <WebIcon name="volume-x" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current shrink-0" />
                )}
              </button>

              <span aria-hidden="true" className="w-[1px] h-4 sm:h-4.5 bg-current/25 shrink-0" />

              {/* Nút Phát / Dừng giới thiệu */}
              <button
                id="home-hero-video-intro-action-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPlayingIntro) {
                    handleCancelIntro();
                  } else {
                    handlePlayIntro();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-transparent border-0 p-0 text-current cursor-pointer focus-visible:outline-none"
                title={
                  isPlayingIntro
                    ? isEn
                      ? 'Click to stop intro video'
                      : 'Bấm để dừng video giới thiệu'
                    : isEn
                      ? 'Click to listen to intro'
                      : 'Bấm để nghe giới thiệu'
                }
                aria-label={
                  isPlayingIntro
                    ? isEn
                      ? 'Stop Intro'
                      : 'Dừng giới thiệu'
                    : isEn
                      ? 'Listen Intro'
                      : 'Nghe giới thiệu'
                }
                aria-pressed={isPlayingIntro}
              >
                {isPlayingIntro ? (
                  <WebIcon name="cancel" className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.6] text-current shrink-0" />
                ) : (
                  <WebIcon name="play" className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-current text-current translate-x-[0.5px] shrink-0" />
                )}
                <span className="typo-button font-play font-bold text-current whitespace-nowrap leading-none">
                  {isPlayingIntro
                    ? isEn
                      ? 'Stop Intro'
                      : 'Dừng giới thiệu'
                    : isEn
                      ? 'Listen Intro'
                      : 'Nghe giới thiệu'}
                </span>
              </button>
            </span>
          </div>

          {/* DesignBookmark Magnetic Button ghost cursor dot when idle */}
          <span
            ref={magCurRef}
            aria-hidden="true"
            className="db-mag-cur absolute left-0 top-0 z-30 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-sky-300/90 shadow-[0_0_10px_rgba(56,189,248,0.85)] opacity-0 pointer-events-none will-change-[transform,opacity]"
          />
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
