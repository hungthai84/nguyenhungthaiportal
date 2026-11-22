'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export interface DualLayerVideoPlayerProps {
  video1Id?: string;
  video2Id?: string;
  className?: string;
  style?: React.CSSProperties;
}

type StreamStage = 'primary' | 'alt' | 'iframe';

const DEFAULT_VIDEO_1_ID = '1-XpJWJEyTq4PYh902i7FQbWYnpO17PvM';
const DEFAULT_VIDEO_2_ID = '1YBxLU_NyWM8T3WAjOvtjSz0iP_6m1aB5';

export const DualLayerVideoPlayer: React.FC<DualLayerVideoPlayerProps> = ({
  video1Id = DEFAULT_VIDEO_1_ID,
  video2Id = DEFAULT_VIDEO_2_ID,
  className,
  style,
}) => {
  const { showToast } = useToast();
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  const video1StageRef = useRef<StreamStage>('primary');
  const video2StageRef = useRef<StreamStage>('primary');
  const isPlayingIntroRef = useRef<boolean>(false);
  const isAudioOnRef = useRef<boolean>(false);

  const [video1Stage, setVideo1Stage] = useState<StreamStage>('primary');
  const [video2Stage, setVideo2Stage] = useState<StreamStage>('primary');
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(false);
  const [isVideo2Ready, setIsVideo2Ready] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);

  const getVideo1StreamUrl = useCallback((stage: StreamStage, id: string): string => {
    return stage === 'alt'
      ? `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`
      : `/api/media/drive-video/${id}`;
  }, []);

  const getVideo2StreamUrl = useCallback((stage: StreamStage, id: string): string => {
    return stage === 'alt'
      ? `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`
      : `/api/media/drive-video/${id}`;
  }, []);

  const enforceVideoAttributes = useCallback((el: HTMLVideoElement | null, muted: boolean, autoplay: boolean) => {
    if (!el) return;
    el.defaultMuted = muted;
    el.muted = muted;
    el.volume = 1;
    el.loop = true;
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
    el.setAttribute('loop', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');
    el.removeAttribute('controls');
  }, []);

  const tryStartVideo1 = useCallback(
    (el: HTMLVideoElement | null, audioOn: boolean) => {
      if (!el) return;
      enforceVideoAttributes(el, !audioOn, true);
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (audioOn && !isPlayingIntroRef.current) {
            isAudioOnRef.current = false;
            setIsAudioOn(false);
            enforceVideoAttributes(el, true, true);
            el.play().catch(() => {});
          }
        });
      }
    },
    [enforceVideoAttributes]
  );

  const tryStartVideo2 = useCallback(
    (el: HTMLVideoElement | null, audioOn: boolean) => {
      if (!el) return;
      enforceVideoAttributes(el, !audioOn, true);
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          if (!isPlayingIntroRef.current) return;
          if (err && err.name === 'NotAllowedError' && audioOn) {
            isAudioOnRef.current = false;
            setIsAudioOn(false);
            enforceVideoAttributes(el, true, true);
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
      video.preload = 'auto';
      const shouldAudioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, true);
      try {
        video.load();
      } catch {}
      if (!isPlayingIntroRef.current) {
        tryStartVideo1(video, shouldAudioOn);
      }
    },
    [enforceVideoAttributes, getVideo1StreamUrl, tryStartVideo1, video1Id]
  );

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
      enforceVideoAttributes(video, !shouldAudioOn, shouldPlayImmediately);
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
    loadVideo1(video1StageRef.current === 'iframe' ? 'primary' : video1StageRef.current);
    const v2 = video2Ref.current;
    if (v2 && video2StageRef.current !== 'iframe') {
      v2.src = getVideo2StreamUrl(video2StageRef.current, video2Id);
      v2.preload = isPlayingIntroRef.current ? 'auto' : 'metadata';
      enforceVideoAttributes(v2, !(isPlayingIntroRef.current && isAudioOnRef.current), isPlayingIntroRef.current);
      if (isPlayingIntroRef.current) {
        tryStartVideo2(v2, isAudioOnRef.current);
      }
    }
  }, [enforceVideoAttributes, getVideo2StreamUrl, loadVideo1, tryStartVideo2, video1Id, video2Id]);

  const handleVideo1Error = useCallback(() => {
    if (video1StageRef.current === 'primary') {
      loadVideo1('alt');
    } else if (video1StageRef.current === 'alt') {
      video1StageRef.current = 'iframe';
      setVideo1Stage('iframe');
    }
  }, [loadVideo1]);

  const handleVideo2Error = useCallback(() => {
    if (video2StageRef.current === 'primary') {
      loadVideo2('alt', isPlayingIntroRef.current);
    } else if (video2StageRef.current === 'alt') {
      video2StageRef.current = 'iframe';
      setVideo2Stage('iframe');
      if (isPlayingIntroRef.current) {
        setIsVideo2Ready(true);
      }
    }
  }, [loadVideo2]);

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
      if (!v2.src || !v2.src.includes(video2Id)) {
        v2.src = targetSrc;
      }
      v2.preload = 'auto';
      enforceVideoAttributes(v2, false, true);
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
    isAudioOnRef.current = false;
    setIsPlayingIntro(false);
    setIsVideo2Ready(false);
    setIsAudioOn(false);

    const v2 = video2Ref.current;
    if (v2) {
      try {
        v2.pause();
      } catch {}
      enforceVideoAttributes(v2, true, false);
      if (v2.readyState >= 1) {
        try {
          v2.currentTime = 0;
        } catch {}
      }
    }

    const v1 = video1Ref.current;
    if (v1 && video1StageRef.current !== 'iframe') {
      enforceVideoAttributes(v1, true, true);
      tryStartVideo1(v1, false);
    }
    showToast('Đã quay về Video 1 (tắt âm thanh)');
  }, [enforceVideoAttributes, showToast, tryStartVideo1]);

  const toggleVideoMute = useCallback(() => {
    const nextAudioOn = !isAudioOnRef.current;
    isAudioOnRef.current = nextAudioOn;
    setIsAudioOn(nextAudioOn);

    if (isPlayingIntroRef.current) {
      const v2 = video2Ref.current;
      if (v2 && video2StageRef.current !== 'iframe') {
        enforceVideoAttributes(v2, !nextAudioOn, true);
        if (v2.paused) tryStartVideo2(v2, nextAudioOn);
      }
    } else {
      const v1 = video1Ref.current;
      if (v1 && video1StageRef.current !== 'iframe') {
        enforceVideoAttributes(v1, !nextAudioOn, true);
        if (v1.paused) tryStartVideo1(v1, nextAudioOn);
      }
    }
    showToast(nextAudioOn ? 'Đã bật âm thanh video' : 'Đã tắt âm thanh video');
  }, [enforceVideoAttributes, showToast, tryStartVideo1, tryStartVideo2]);

  const sharedVideoStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover',
    objectPosition: '50% 22%',
    transform: 'translateZ(0) scale(1.02)',
    backfaceVisibility: 'hidden',
  };

  const sharedVideoClass =
    'absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] banner-video-sharp select-none pointer-events-none transition-opacity duration-300';

  const hasPositionClass = /\b(absolute|fixed|sticky|static)\b/.test(className || '');

  return (
    <div
      className={cn(
        !hasPositionClass && 'relative',
        'w-full h-full min-w-full min-h-full overflow-hidden rounded-[inherit] flex items-center justify-center',
        className
      )}
      style={style}
    >
      {/* Dual Video Layer container */}
      <div
        style={{ containerType: 'size' }}
        className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] w-full h-full z-0"
      >
        {/* VIDEO 1 */}
        {video1Stage !== 'iframe' ? (
          <video
            ref={video1Ref}
            autoPlay
            loop
            muted={!(!isPlayingIntro && isAudioOn)}
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, !isPlayingIntroRef.current);
              if (!isPlayingIntroRef.current && v.paused) tryStartVideo1(v, audioOn);
            }}
            onLoadedData={(e) => {
              const v = e.currentTarget;
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, !isPlayingIntroRef.current);
              if (!isPlayingIntroRef.current && v.paused) tryStartVideo1(v, audioOn);
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, !isPlayingIntroRef.current);
              if (!isPlayingIntroRef.current && v.paused) tryStartVideo1(v, audioOn);
            }}
            onPlaying={(e) => {
              const audioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
              enforceVideoAttributes(e.currentTarget, !audioOn, !isPlayingIntroRef.current);
            }}
            onEnded={(e) => {
              if (isPlayingIntroRef.current) return;
              const v = e.currentTarget;
              const audioOn = isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, true);
              v.currentTime = 0;
              tryStartVideo1(v, audioOn);
            }}
            onPause={(e) => {
              if (isPlayingIntroRef.current) return;
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
            src={`https://drive.google.com/file/d/${video1Id}/preview`}
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
                enforceVideoAttributes(v, true, false);
                return;
              }
              enforceVideoAttributes(v, !isAudioOnRef.current, true);
              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
            }}
            onLoadedData={(e) => {
              const v = e.currentTarget;
              if (!isPlayingIntroRef.current) return;
              enforceVideoAttributes(v, !isAudioOnRef.current, true);
              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
            }}
            onCanPlay={(e) => {
              const v = e.currentTarget;
              if (!isPlayingIntroRef.current) return;
              enforceVideoAttributes(v, !isAudioOnRef.current, true);
              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
            }}
            onPlaying={(e) => {
              if (!isPlayingIntroRef.current) {
                e.currentTarget.pause();
                return;
              }
              enforceVideoAttributes(e.currentTarget, !isAudioOnRef.current, true);
              setIsVideo2Ready(true);
              const v1 = video1Ref.current;
              if (v1 && !v1.paused) v1.pause();
            }}
            onEnded={(e) => {
              if (!isPlayingIntroRef.current) return;
              const v = e.currentTarget;
              const audioOn = isAudioOnRef.current;
              enforceVideoAttributes(v, !audioOn, true);
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
              src={`https://drive.google.com/file/d/${video2Id}/preview`}
              title="Video 2"
              allow="autoplay; fullscreen; picture-in-picture"
              tabIndex={-1}
              aria-hidden="true"
              className="banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none z-[2]"
            />
          )
        )}
      </div>

      {/* Bottom-right Capsule Control */}
      <div
        style={{ borderRadius: '999px' }}
        className={cn(
          'theme-video-capsule video-play-btn video-play-btn--about',
          isPlayingIntro ? 'is-playing' : '',
          'absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 z-30 max-w-[calc(100%-16px)] inline-flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-300 cursor-pointer pointer-events-auto active:scale-98 select-none'
        )}
      >
        {/* Speaker Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleVideoMute();
          }}
          className={cn(
            'video-play-btn__sound w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90',
            isAudioOn ? 'text-current shadow-xs' : 'is-muted text-white shadow-md'
          )}
          title={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
          aria-label={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
          aria-pressed={isAudioOn}
        >
          <span className="flex items-center justify-center">
            {isAudioOn ? (
              <WebIcon name="volume-2" className="w-3.5 h-3.5 text-current" />
            ) : (
              <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
            )}
          </span>
        </button>

        <div className="w-[1px] h-4 bg-current opacity-25 shrink-0 mx-0.5" />

        {/* Play / Cancel Toggle Button */}
        {!isPlayingIntro ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayIntro();
            }}
            style={{ paddingLeft: '8px', paddingRight: '10px', borderRadius: '999px' }}
            className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
            title="Bấm để phát video"
          >
            <span className="flex items-center justify-center">
              <WebIcon name="play" className="w-4 h-4 fill-current text-current shrink-0" style={{ height: '16px', width: '16px' }} />
            </span>
            <span className="typo-button text-current truncate font-play text-left">
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
            style={{ paddingLeft: '8px', paddingRight: '10px', borderRadius: '999px' }}
            className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
            title="Bấm để hủy phát video"
          >
            <span className="flex items-center justify-center">
              <WebIcon name="cancel" className="w-4 h-4 stroke-[2.8] text-current shrink-0" style={{ height: '16px', width: '16px' }} />
            </span>
            <span className="typo-button text-current truncate font-play text-left">
              Hủy Phát
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DualLayerVideoPlayer;
