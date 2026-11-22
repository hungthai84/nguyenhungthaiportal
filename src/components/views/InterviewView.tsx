'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INTERVIEW_QUESTIONS,
  INTERVIEW_TABS,
  INTERVIEW_VIDEO_1_ALT_STREAM_URL,
  INTERVIEW_VIDEO_1_ID,
  INTERVIEW_VIDEO_1_STREAM_URL,
  INTERVIEW_VIDEO_1_URL,
  INTERVIEW_VIDEO_2_ALT_STREAM_URL,
  INTERVIEW_VIDEO_2_ID,
  INTERVIEW_VIDEO_2_STREAM_URL,
  INTERVIEW_VIDEO_2_URL,
} from '@/data/interview';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn } from '@/lib/utils';

export interface InterviewViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

type InterviewStreamStage = 'primary' | 'alt' | 'iframe';

const INTERVIEW_VIDEO_SHARED_STYLE: React.CSSProperties = {
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

const INTERVIEW_VIDEO_SHARED_CLASS =
  'absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] banner-video-sharp select-none pointer-events-none transition-opacity duration-300';

export const InterviewView: React.FC<InterviewViewProps> = ({ currentTheme = 'liquid-glass' }) => {
  const { showToast } = useToast();
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const video1StageRef = useRef<InterviewStreamStage>('primary');
  const video2StageRef = useRef<InterviewStreamStage>('primary');
  const isPlayingVideo2Ref = useRef<boolean>(false);
  const isAudioOnRef = useRef<boolean>(false);
  const pendingSeekSecRef = useRef<number | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [video1Stage, setVideo1Stage] = useState<InterviewStreamStage>('primary');
  const [video2Stage, setVideo2Stage] = useState<InterviewStreamStage>('primary');
  const [isPlayingVideo2, setIsPlayingVideo2] = useState<boolean>(false);
  const [isVideo2Ready, setIsVideo2Ready] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [video2TimeSec, setVideo2TimeSec] = useState<number>(0);

  const currentQ = INTERVIEW_QUESTIONS[currentQIdx] || INTERVIEW_QUESTIONS[0];

  const progressPct = useMemo(() => {
    if (isPlayingVideo2) {
      const segDuration = Math.max(1, currentQ.endSec - currentQ.startSec);
      const elapsed = Math.max(0, Math.min(segDuration, video2TimeSec - currentQ.startSec));
      return Math.max(0, Math.min(100, (elapsed / segDuration) * 100));
    }
    return ((currentQIdx + 1) / Math.max(1, INTERVIEW_QUESTIONS.length)) * 100;
  }, [isPlayingVideo2, currentQ, video2TimeSec, currentQIdx]);

  const getVideo1StreamUrl = useCallback((stage: InterviewStreamStage): string => {
    return stage === 'alt' ? INTERVIEW_VIDEO_1_ALT_STREAM_URL : INTERVIEW_VIDEO_1_STREAM_URL;
  }, []);

  const getVideo2StreamUrl = useCallback((stage: InterviewStreamStage): string => {
    return stage === 'alt' ? INTERVIEW_VIDEO_2_ALT_STREAM_URL : INTERVIEW_VIDEO_2_STREAM_URL;
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
          // Nếu trình duyệt chặn phát có tiếng tự động thì lùi về tắt tiếng để luôn phát mượt
          if (audioOn && !isPlayingVideo2Ref.current) {
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
          if (!isPlayingVideo2Ref.current) return;
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
    (stage: InterviewStreamStage) => {
      video1StageRef.current = stage;
      setVideo1Stage(stage);
      if (stage === 'iframe') return;

      const video = video1Ref.current;
      if (!video) return;

      video.src = getVideo1StreamUrl(stage);
      video.preload = 'auto';
      const shouldAudioOn = !isPlayingVideo2Ref.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, true);
      try {
        video.load();
      } catch {
        // Ignore reload exception
      }
      if (!isPlayingVideo2Ref.current) {
        tryStartVideo1(video, shouldAudioOn);
      }
    },
    [enforceVideoAttributes, getVideo1StreamUrl, tryStartVideo1]
  );

  const loadVideo2 = useCallback(
    (stage: InterviewStreamStage, shouldPlayImmediately: boolean) => {
      video2StageRef.current = stage;
      setVideo2Stage(stage);
      if (stage === 'iframe') return;

      const video = video2Ref.current;
      if (!video) return;

      video.src = getVideo2StreamUrl(stage);
      video.preload = shouldPlayImmediately ? 'auto' : 'metadata';
      const shouldAudioOn = isPlayingVideo2Ref.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, shouldPlayImmediately);
      try {
        video.load();
      } catch {
        // Ignore reload exception
      }
      if (shouldPlayImmediately && isPlayingVideo2Ref.current) {
        tryStartVideo2(video, shouldAudioOn);
      }
    },
    [enforceVideoAttributes, getVideo2StreamUrl, tryStartVideo2]
  );

  // Khởi tạo Video 1 làm nền mặc định (tắt tiếng, vòng lặp) và gắn sẵn nguồn cho Video 2 (preload metadata)
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    loadVideo1('primary');
    const v2 = video2Ref.current;
    if (v2) {
      v2.src = getVideo2StreamUrl('primary');
      v2.preload = 'metadata';
      enforceVideoAttributes(v2, true, false);
    }
  }, [enforceVideoAttributes, getVideo2StreamUrl, loadVideo1]);

  // Tự động tiếp tục phát khi quay lại tab hoặc chạm lần đầu trên thiết bị di động
  useEffect(() => {
    const resumeActivePlayback = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      if (isPlayingVideo2Ref.current) {
        if (video2StageRef.current === 'iframe') return;
        const v2 = video2Ref.current;
        if (!v2 || !v2.paused) return;
        tryStartVideo2(v2, isAudioOnRef.current);
      } else {
        if (video1StageRef.current === 'iframe') return;
        const v1 = video1Ref.current;
        if (!v1 || !v1.paused) return;
        tryStartVideo1(v1, isAudioOnRef.current);
      }
    };
    document.addEventListener('visibilitychange', resumeActivePlayback);
    window.addEventListener('pointerdown', resumeActivePlayback, { passive: true, once: true });
    window.addEventListener('touchstart', resumeActivePlayback, { passive: true, once: true });
    return () => {
      document.removeEventListener('visibilitychange', resumeActivePlayback);
      window.removeEventListener('pointerdown', resumeActivePlayback);
      window.removeEventListener('touchstart', resumeActivePlayback);
    };
  }, [tryStartVideo1, tryStartVideo2]);

  const handlePlayVideo2 = useCallback(() => {
    isPlayingVideo2Ref.current = true;
    isAudioOnRef.current = true;
    setIsPlayingVideo2(true);
    setIsAudioOn(true);
    setIsVideo2Ready(false);
    setVideo2TimeSec(0);
    pendingSeekSecRef.current = 0;

    if (video2StageRef.current === 'iframe') {
      setIsVideo2Ready(true);
      const v1 = video1Ref.current;
      if (v1 && !v1.paused) {
        v1.pause();
      }
      showToast('Đang phát Video 2 phỏng vấn (có âm thanh)');
      return;
    }

    const v2 = video2Ref.current;
    if (v2) {
      const targetSrc = getVideo2StreamUrl(video2StageRef.current);
      if (!v2.src || !v2.src.includes(INTERVIEW_VIDEO_2_ID)) {
        v2.src = targetSrc;
      }
      v2.preload = 'auto';
      enforceVideoAttributes(v2, false, true);
      if (v2.readyState >= 1) {
        try {
          v2.currentTime = 0;
          pendingSeekSecRef.current = null;
        } catch {
          // Will seek on loadedmetadata
        }
      }
      tryStartVideo2(v2, true);
    }

    showToast('Đang phát Video 2 phỏng vấn (mở âm thanh)');
  }, [enforceVideoAttributes, getVideo2StreamUrl, showToast, tryStartVideo2]);

  const handleCancelVideo2 = useCallback(() => {
    isPlayingVideo2Ref.current = false;
    isAudioOnRef.current = false;
    pendingSeekSecRef.current = null;
    setIsPlayingVideo2(false);
    setIsVideo2Ready(false);
    setIsAudioOn(false);
    setVideo2TimeSec(0);

    const v2 = video2Ref.current;
    if (v2) {
      try {
        v2.pause();
      } catch {
        // Ignore
      }
      enforceVideoAttributes(v2, true, false);
      if (v2.readyState >= 1) {
        try {
          v2.currentTime = 0;
        } catch {
          // Ignore
        }
      }
    }

    const v1 = video1Ref.current;
    if (v1 && video1StageRef.current !== 'iframe') {
      enforceVideoAttributes(v1, true, true);
      tryStartVideo1(v1, false);
    }

    showToast('Đã hủy phát — quay về Video 1 mặc định');
  }, [enforceVideoAttributes, showToast, tryStartVideo1]);

  const togglePlayVideo = useCallback(() => {
    if (isPlayingVideo2Ref.current) {
      handleCancelVideo2();
    } else {
      handlePlayVideo2();
    }
  }, [handleCancelVideo2, handlePlayVideo2]);

  const toggleAudio = useCallback(() => {
    const nextAudioOn = !isAudioOnRef.current;
    isAudioOnRef.current = nextAudioOn;
    setIsAudioOn(nextAudioOn);

    if (isPlayingVideo2Ref.current) {
      const v2 = video2Ref.current;
      if (v2 && video2StageRef.current !== 'iframe') {
        enforceVideoAttributes(v2, !nextAudioOn, true);
        if (v2.paused) {
          tryStartVideo2(v2, nextAudioOn);
        }
      }
    } else {
      const v1 = video1Ref.current;
      if (v1 && video1StageRef.current !== 'iframe') {
        enforceVideoAttributes(v1, !nextAudioOn, true);
        if (v1.paused) {
          tryStartVideo1(v1, nextAudioOn);
        }
      }
    }

    showToast(nextAudioOn ? 'Đã bật âm thanh video' : 'Đã tắt âm thanh video');
  }, [enforceVideoAttributes, showToast, tryStartVideo1, tryStartVideo2]);

  const filteredQuestions = useMemo(() => {
    if (activeFilter === 'all') return INTERVIEW_QUESTIONS;
    return INTERVIEW_QUESTIONS.filter((q) => q.categoryKey === activeFilter);
  }, [activeFilter]);

  const selectQuestion = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(INTERVIEW_QUESTIONS.length - 1, idx));
      setCurrentQIdx(clamped);
      const q = INTERVIEW_QUESTIONS[clamped];

      if (isPlayingVideo2Ref.current && video2StageRef.current !== 'iframe') {
        const v2 = video2Ref.current;
        if (v2) {
          if (v2.readyState >= 1) {
            try {
              const maxDur = Number.isFinite(v2.duration) && v2.duration > 0 ? v2.duration : q.startSec;
              const target = Math.min(q.startSec, Math.max(0, maxDur - 0.5));
              v2.currentTime = target;
              setVideo2TimeSec(target);
              pendingSeekSecRef.current = null;
            } catch {
              pendingSeekSecRef.current = q.startSec;
            }
          } else {
            pendingSeekSecRef.current = q.startSec;
          }
          if (v2.paused) {
            tryStartVideo2(v2, isAudioOnRef.current);
          }
        }
      }

      showToast(`Đã chọn Câu ${String(q.stt).padStart(2, '0')}: ${q.categoryVi}`);
    },
    [showToast, tryStartVideo2]
  );

  // Phím tắt điều khiển nhanh (Space: Phát/Hủy Video 2, M: Bật/Tắt tiếng, Mũi tên Trái/Phải: Chuyển câu)
  useEffect(() => {
    const handleInterviewShortcuts = (e: KeyboardEvent) => {
      if (isFilterDropdownOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }

      if (e.code === 'Space' && tag !== 'BUTTON' && tag !== 'A') {
        e.preventDefault();
        togglePlayVideo();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleAudio();
      } else if (e.key === 'ArrowLeft' && currentQIdx > 0) {
        e.preventDefault();
        selectQuestion(currentQIdx - 1);
      } else if (e.key === 'ArrowRight' && currentQIdx < INTERVIEW_QUESTIONS.length - 1) {
        e.preventDefault();
        selectQuestion(currentQIdx + 1);
      }
    };

    window.addEventListener('keydown', handleInterviewShortcuts);
    return () => window.removeEventListener('keydown', handleInterviewShortcuts);
  }, [currentQIdx, isFilterDropdownOpen, selectQuestion, toggleAudio, togglePlayVideo]);

  const handleVideo1Error = () => {
    if (video1StageRef.current === 'primary') {
      loadVideo1('alt');
    } else if (video1StageRef.current === 'alt') {
      video1StageRef.current = 'iframe';
      setVideo1Stage('iframe');
    }
  };

  const handleVideo2Error = () => {
    if (video2StageRef.current === 'primary') {
      loadVideo2('alt', isPlayingVideo2Ref.current);
    } else if (video2StageRef.current === 'alt') {
      video2StageRef.current = 'iframe';
      setVideo2Stage('iframe');
      if (isPlayingVideo2Ref.current) {
        setIsVideo2Ready(true);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterDropdownOpen]);

  void currentTheme;

  const activeVideoSlot = isPlayingVideo2 ? 2 : 1;
  const activeVideoId = isPlayingVideo2 ? INTERVIEW_VIDEO_2_ID : INTERVIEW_VIDEO_1_ID;

  return (
    <div
      id="interview-page-container"
      data-element-name="Trang Phỏng Vấn"
      data-element-type="container"
      data-element-page="interview"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar select-none text-[var(--text-primary)] font-play text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="interview-cards-track"
        data-element-name="Track căn giữa Phỏng Vấn"
        data-element-type="container"
        data-element-page="interview"
        data-element-parent="interview-page-container"
        className="page-cards-track"
      >
        <div
          id="interview-main-card"
          data-main-card="true"
          data-layer-level="1"
          data-element-name="Thẻ chính Trang Phỏng Vấn"
          data-element-type="card"
          data-element-page="interview"
          data-element-parent="interview-cards-track"
          className="page-main-card relative flex flex-col p-[15px] rounded-[var(--radius-main,14px)] gap-0 justify-start select-none text-[var(--text-primary)] overflow-hidden font-play text-left box-border"
        >
          <div
            id="interview-main-scroll-viewport"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-center justify-start gap-[15px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
          >
      {/* Main Content Row: Video + Answer Detail always on 1 row & equal height at all sizes */}
      <div
        id="interview-main-content"
        className="w-full max-w-full min-w-0 flex-1 min-h-full h-full grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] grid-rows-[minmax(0,1fr)] items-stretch gap-[15px] overflow-hidden rounded-[var(--radius-card,14px)]"
      >
        
        {/* 1. VIDEO BANNER SECTION (Equal height & same single row with Chi tiết trả lời at all sizes) */}
        <section
          id="interview-questions-card"
          data-element-name="Card Video Phỏng Vấn"
          data-element-type="card"
          data-media-card="video"
          data-section-card="true"
          data-layer-level="2"
          data-video-slot={activeVideoSlot}
          data-video-id={activeVideoId}
          style={{
            borderRadius: 'var(--radius-card, 14px)',
            padding: '0px',
          }}
          className="bento-card glass-card w-full h-full min-h-0 max-h-full self-stretch rounded-[var(--radius-card,14px)] relative overflow-hidden text-[var(--text-primary)] min-w-0 z-30 flex flex-col justify-center items-center border group/video p-0 text-left"
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              padding: 0,
              margin: 0,
              borderRadius: 'inherit',
              overflow: 'hidden',
            }}
            className="relative w-full h-full flex-1 rounded-[inherit] overflow-hidden min-h-0 flex items-center justify-center"
          >
            {/* Lớp nền Video Phỏng vấn: Video 1 (mặc định tắt tiếng, vòng lặp) & Video 2 (cùng định dạng Video 1, phát mở tiếng khi bấm Phát Video) */}
            <div
              id="interview-video-background-layer"
              style={{ containerType: 'size' }}
              className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] w-full h-full z-0"
            >
            {/* VIDEO 1 — Màn hình nền mặc định */}
            {video1Stage !== 'iframe' ? (
              <video
                ref={video1Ref}
                id="interview-bg-video-1"
                data-video-slot={1}
                data-video-id={INTERVIEW_VIDEO_1_ID}
                data-video-layer-active={!isPlayingVideo2 ? 'true' : 'false'}
                autoPlay
                loop
                muted={!(!isPlayingVideo2 && isAudioOn)}
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                aria-hidden="true"
                tabIndex={-1}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  const audioOn = !isPlayingVideo2Ref.current && isAudioOnRef.current;
                  enforceVideoAttributes(v, !audioOn, !isPlayingVideo2Ref.current);
                  if (!isPlayingVideo2Ref.current && v.paused) tryStartVideo1(v, audioOn);
                }}
                onLoadedData={(e) => {
                  const v = e.currentTarget;
                  const audioOn = !isPlayingVideo2Ref.current && isAudioOnRef.current;
                  enforceVideoAttributes(v, !audioOn, !isPlayingVideo2Ref.current);
                  if (!isPlayingVideo2Ref.current && v.paused) tryStartVideo1(v, audioOn);
                }}
                onCanPlay={(e) => {
                  const v = e.currentTarget;
                  const audioOn = !isPlayingVideo2Ref.current && isAudioOnRef.current;
                  enforceVideoAttributes(v, !audioOn, !isPlayingVideo2Ref.current);
                  if (!isPlayingVideo2Ref.current && v.paused) tryStartVideo1(v, audioOn);
                }}
                onPlaying={(e) => {
                  const audioOn = !isPlayingVideo2Ref.current && isAudioOnRef.current;
                  enforceVideoAttributes(e.currentTarget, !audioOn, !isPlayingVideo2Ref.current);
                }}
                onEnded={(e) => {
                  if (isPlayingVideo2Ref.current) return;
                  const v = e.currentTarget;
                  const audioOn = isAudioOnRef.current;
                  enforceVideoAttributes(v, !audioOn, true);
                  v.currentTime = 0;
                  tryStartVideo1(v, audioOn);
                }}
                onPause={(e) => {
                  if (isPlayingVideo2Ref.current) return;
                  if (typeof document !== 'undefined' && document.hidden) return;
                  const v = e.currentTarget;
                  if (v.seeking) return;
                  tryStartVideo1(v, isAudioOnRef.current);
                }}
                onError={handleVideo1Error}
                style={INTERVIEW_VIDEO_SHARED_STYLE}
                className={cn(
                  INTERVIEW_VIDEO_SHARED_CLASS,
                  isPlayingVideo2 && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]'
                )}
              />
            ) : (
              <iframe
                key={`interview-bg-iframe-1-${INTERVIEW_VIDEO_1_ID}`}
                src={INTERVIEW_VIDEO_1_URL}
                title="Video phỏng vấn 1 - Nguyễn Hùng Thái"
                allow="autoplay; fullscreen; picture-in-picture"
                tabIndex={-1}
                aria-hidden="true"
                className={cn(
                  'banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none transition-opacity duration-300',
                  isPlayingVideo2 && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]'
                )}
              />
            )}

            {/* VIDEO 2 — Tạo y hệt định dạng Video 1 (autoPlay khi kích hoạt, vòng lặp, mở âm thanh mặc định, không control) */}
            {video2Stage !== 'iframe' ? (
              <video
                ref={video2Ref}
                id="interview-bg-video-2"
                data-video-slot={2}
                data-video-id={INTERVIEW_VIDEO_2_ID}
                data-video-layer-active={isPlayingVideo2 ? 'true' : 'false'}
                loop
                muted={!(isPlayingVideo2 && isAudioOn)}
                playsInline
                preload="metadata"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                aria-hidden="true"
                tabIndex={-1}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  if (!isPlayingVideo2Ref.current) {
                    enforceVideoAttributes(v, true, false);
                    return;
                  }
                  enforceVideoAttributes(v, !isAudioOnRef.current, true);
                  if (pendingSeekSecRef.current !== null) {
                    try {
                      v.currentTime = pendingSeekSecRef.current;
                      setVideo2TimeSec(pendingSeekSecRef.current);
                    } catch {
                      // Ignore seek errors
                    }
                    pendingSeekSecRef.current = null;
                  }
                  if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                }}
                onLoadedData={(e) => {
                  const v = e.currentTarget;
                  if (!isPlayingVideo2Ref.current) return;
                  enforceVideoAttributes(v, !isAudioOnRef.current, true);
                  if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                }}
                onCanPlay={(e) => {
                  const v = e.currentTarget;
                  if (!isPlayingVideo2Ref.current) return;
                  enforceVideoAttributes(v, !isAudioOnRef.current, true);
                  if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                }}
                onPlaying={(e) => {
                  if (!isPlayingVideo2Ref.current) {
                    e.currentTarget.pause();
                    return;
                  }
                  enforceVideoAttributes(e.currentTarget, !isAudioOnRef.current, true);
                  setIsVideo2Ready(true);
                  const v1 = video1Ref.current;
                  if (v1 && !v1.paused) {
                    v1.pause();
                  }
                }}
                onTimeUpdate={(e) => {
                  if (!isPlayingVideo2Ref.current) return;
                  setVideo2TimeSec(e.currentTarget.currentTime);
                }}
                onEnded={(e) => {
                  if (!isPlayingVideo2Ref.current) return;
                  const v = e.currentTarget;
                  const audioOn = isAudioOnRef.current;
                  enforceVideoAttributes(v, !audioOn, true);
                  v.currentTime = 0;
                  setVideo2TimeSec(0);
                  tryStartVideo2(v, audioOn);
                }}
                onPause={(e) => {
                  if (!isPlayingVideo2Ref.current) return;
                  if (typeof document !== 'undefined' && document.hidden) return;
                  const v = e.currentTarget;
                  if (v.seeking) return;
                  tryStartVideo2(v, isAudioOnRef.current);
                }}
                onError={handleVideo2Error}
                style={INTERVIEW_VIDEO_SHARED_STYLE}
                className={cn(
                  INTERVIEW_VIDEO_SHARED_CLASS,
                  isPlayingVideo2 && isVideo2Ready ? 'opacity-100 z-[2]' : 'opacity-0 z-[0]'
                )}
              />
            ) : (
              isPlayingVideo2 && (
                <iframe
                  key={`interview-bg-iframe-2-${INTERVIEW_VIDEO_2_ID}`}
                  src={INTERVIEW_VIDEO_2_URL}
                  title="Video phỏng vấn 2 - Nguyễn Hùng Thái"
                  allow="autoplay; fullscreen; picture-in-picture"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none z-[2]"
                />
              )
            )}
            </div>

            {/* Overlay Nội dung & Điều khiển bên trong khung Video */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-2.5 sm:p-3.5 pointer-events-none">
              {/* Hàng trên: Icon + Tiêu đề bên trái, Câu nói chữ ký bên phải */}
              <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full shrink-0 pointer-events-auto">
            <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
              <WebIcon name="mic" className="w-[22px] h-[22px] shrink-0" />
              <h1
                id="interview-hero-banner-title"
                className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                data-card-title="true"
                style={{
                  textTransform: 'none',
                  fontStyle: 'normal',
                  transform: 'none',
                }}
              >
                Phỏng vấn &amp; Đối thoại
              </h1>
            </div>
            <p
              className="banner-quote typo-h3 font-handwriting font-quote not-italic font-bold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
              style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 700, fontStyle: 'normal' }}
            >
              &quot;Giao lưu cởi mở để thấu hiểu và sẻ chia ♡&quot;
            </p>
          </div>

              {/* Hàng dưới: Bộ lọc câu hỏi (trái) & Nút Phát Video / Hủy Phát + Loa (phải) */}
              <div id="interview-video-banner-controls" className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full min-w-0 shrink-0 pointer-events-auto">
            {/* Nhóm các câu hỏi ở banner vào 1 nút filter với menu xổ xuống */}
            <div className="relative inline-block text-left max-w-full" ref={filterDropdownRef}>
              <button
                id="interview-question-filter-btn"
                type="button"
                onClick={() => {
                  setIsFilterDropdownOpen((prev) => !prev);
                }}
                className="banner-control-pill h-9 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0 rounded-full transition-all cursor-pointer typo-button font-bold font-play active:scale-95 group max-w-full shrink-0"
                title="Bộ lọc câu hỏi"
                aria-label="Bộ lọc câu hỏi phỏng vấn"
                aria-expanded={isFilterDropdownOpen}
                aria-haspopup="listbox"
              >
                <WebIcon
                  name="sliders"
                  className="w-4 h-4 text-[var(--color-primary)] shrink-0"
                />
                <span className="truncate">Bộ lọc câu hỏi</span>
                {activeFilter !== 'all' && (
                  <span className="banner-count-pill hidden sm:inline-flex px-2 py-0.2 rounded-full border typo-badge font-mono font-bold shrink-0">
                    {INTERVIEW_TABS.find((t) => t.key === activeFilter)?.labelVi}
                  </span>
                )}
                <WebIcon
                  name="chevron-down"
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
                    isFilterDropdownOpen ? 'rotate-180' : ''
                  )}
                />
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    id="interview-question-filter-listbox"
                    data-element-type="card"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    role="listbox"
                    className="banner-dropdown-menu bento-card glass-card absolute left-0 bottom-[calc(100%+8px)] w-[min(22rem,calc(100cqi-30px))] max-w-[calc(100vw-48px)] max-h-72 overflow-y-auto no-scrollbar rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                  >
                    <div className="px-2 py-1.5 border-b border-[var(--border-subcard)] flex flex-col gap-1.5 sticky top-0 bg-[var(--bg-popup)] z-10 rounded-t-[10px]">
                      <div className="flex items-center justify-between typo-label font-mono text-[var(--text-muted)]">
                        <span className="font-bold text-[var(--text-heading,var(--color-primary))] font-play typo-body-sm inline-flex items-center gap-1.5">
                          <WebIcon name="sliders" className="w-3.5 h-3.5 shrink-0" />
                          <span>Bộ lọc</span>
                        </span>
                      </div>
                    <div className="flex flex-wrap gap-1">
                      {INTERVIEW_TABS.map((tab) => {
                        const isTabActive = activeFilter === tab.key;
                        return (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveFilter(tab.key)}
                            style={isTabActive ? { background: 'var(--bg-button-primary)' } : undefined}
                            className={cn(
                              'px-2.5 py-0.5 rounded-full typo-tab transition-all cursor-pointer border',
                              isTabActive
                                ? 'text-white border-transparent shadow-2xs'
                                : 'bg-[var(--bg-subcard)] text-[var(--text-secondary)] border-[var(--border-subcard)] hover:bg-[var(--bg-subcard-hover)]'
                            )}
                          >
                            {tab.labelVi}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {filteredQuestions.map((q) => {
                    const origIdx = INTERVIEW_QUESTIONS.findIndex((item) => item.stt === q.stt);
                    const isSelected = origIdx === currentQIdx;
                    return (
                      <button
                        key={q.stt}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected ? 'true' : 'false'}
                        onClick={() => {
                          selectQuestion(origIdx !== -1 ? origIdx : 0);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'theme-dropdown-option w-full text-left px-3 py-2 rounded-[14px] transition-all cursor-pointer flex items-center justify-between gap-2 typo-nav font-play',
                          isSelected ? 'shadow-xs' : ''
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center typo-badge font-mono shrink-0',
                              isSelected
                                ? 'bg-white/25 text-white'
                                : 'bg-[var(--bg-nested-badge)] text-[var(--text-link,var(--color-primary))]'
                            )}
                          >
                            {String(q.stt).padStart(2, '0')}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-semibold">{q.categoryVi}</span>
                            <span className={cn('typo-label truncate', isSelected ? 'text-white/85' : 'text-[var(--text-muted)]')}>
                              {q.questionVi.replace(/^Câu hỏi\s*\d+:\s*/i, '')}
                            </span>
                          </div>
                        </div>
                        {isSelected && <WebIcon name="check" className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nút Phát Video / Hủy Phát kèm nút bật tắt âm thanh (cùng định dạng Card Giới thiệu) */}
            <div
              id="interview-play-video-capsule"
              style={{ borderRadius: '999px' }}
              className={cn(
                'theme-video-capsule video-play-btn video-play-btn--about ml-auto max-w-[calc(100%-16px)] inline-flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-300 cursor-pointer pointer-events-auto active:scale-98 select-none shrink-0',
                isPlayingVideo2 ? 'is-playing' : ''
              )}
            >
              {/* Nút bật / tắt âm thanh */}
              <button
                type="button"
                id="interview-btn-sound-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAudio();
                }}
                className={cn(
                  'video-play-btn__sound w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90',
                  isAudioOn ? 'text-current shadow-xs' : 'is-muted text-white shadow-md'
                )}
                title={isAudioOn ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                aria-label={isAudioOn ? 'Tắt tiếng video' : 'Bật âm thanh video'}
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

              {/* Đường ngăn cách dọc */}
              <div className="w-[1px] h-4 bg-current opacity-25 shrink-0 mx-0.5" />

              {/* Nút chuyển Video 1 ↔ Video 2 */}
              {!isPlayingVideo2 ? (
                <button
                  type="button"
                  id="interview-btn-play-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVideo2();
                  }}
                  style={{
                    paddingLeft: '8px',
                    paddingRight: '10px',
                    borderRadius: '999px',
                  }}
                  className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                  title="Bấm để chuyển sang Video 2 phỏng vấn và mở âm thanh"
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
                  id="interview-btn-play-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelVideo2();
                  }}
                  style={{
                    paddingLeft: '8px',
                    paddingRight: '10px',
                    borderRadius: '999px',
                  }}
                  className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                  title="Bấm để hủy phát Video 2 và quay về Video 1"
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
            </div>
          </div>
        </section>

        {/* 2. THẺ CHI TIẾT CÂU TRẢ LỜI (Always same 1 row & equal height with Video card) */}
        <div
          id="interview-answers-card"
          data-element-name="Thẻ Chi Tiết Trả Lời Phỏng Vấn"
          data-element-type="card"
          data-section-card="true"
          data-layer-level="2"
          className="w-full h-full min-h-0 max-h-full min-w-0 self-stretch flex flex-col rounded-[var(--radius-card,24px)] bento-card glass-card border p-[15px] transition-all duration-300 text-left justify-start gap-3 relative overflow-hidden"
        >
          {/* Header Tiêu đề thẻ (Pinned) */}
          <div className="space-y-2 shrink-0 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
              <h3 className="card-title card-header-sync card-title-synced typo-h3 flex items-center gap-2 text-pink-600 dark:text-pink-400 min-w-0" data-card-title="true">
                <WebIcon name="message-square" className="w-5 h-5 shrink-0" />
                <span className="truncate">Chi tiết trả lời</span>
              </h3>
              <span className="typo-caption font-semibold text-[var(--text-secondary)] shrink-0 tabular-nums whitespace-nowrap">
                {String(currentQ.stt).padStart(2, '0')}/{String(INTERVIEW_QUESTIONS.length).padStart(2, '0')}
                <span aria-hidden="true" className="mx-1 opacity-60">·</span>
                <span className="text-[var(--text-link,var(--color-primary))]">{currentQ.categoryVi}</span>
              </span>
            </div>

            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 shadow-2xs" />
          </div>

          {/* Segment Progress Bar (Pinned) */}
          <div
            id="interview-progress-card"
            data-element-type="card"
            data-subcard="true"
            className="exp-detail-subcard flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-[var(--radius-subcard,16px)] border shrink-0 typo-label"
          >
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-mono typo-label shrink-0 tabular-nums">
              <WebIcon name="clock" className="interview-meta-accent w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{currentQ.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-full h-1.5 rounded-full bg-[var(--pillar-progress-track)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="typo-badge font-mono tabular-nums text-[var(--text-muted)] shrink-0">
                {Math.round(currentQ.endSec - currentQ.startSec)}s
              </span>
            </div>
          </div>

          {/* Scrollable Body (Asker + Answer + Insights) */}
          <div
            data-scrollable="true"
            data-no-wheel-horizontal="true"
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden glass-scrollbar flex flex-col gap-3 pr-0.5"
          >
            {/* Asker (Hiển thị Câu hỏi số ở đầu câu hỏi) */}
            <div
              id="interview-asker-card"
              data-element-type="card"
              data-subcard="true"
              className="exp-detail-subcard p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2 shrink-0"
            >
              <div className="interview-asker-heading subcard-header-sync typo-h4 flex items-center gap-2 flex-wrap text-indigo-600 dark:text-indigo-400">
                <WebIcon name="circle-help" className="w-4 h-4 shrink-0" />
                <span className="subcard-title-synced tracking-wide text-indigo-600 dark:text-indigo-400 break-words" data-subcard-title="true">
                  Câu hỏi {String(currentQ.stt).padStart(2, '0')}: {currentQ.askerVi}
                </span>
              </div>
              <h3
                id="interview-question-title"
                className="typo-body font-semibold text-[var(--text-heading)] m-0 leading-relaxed break-words"
              >
                {currentQ.questionVi.replace(/^Câu hỏi\s*\d+:\s*/, '')}
              </h3>
            </div>

            {/* Answerer */}
            <div
              id="interview-answerer-card"
              data-element-type="card"
              data-subcard="true"
              className="exp-detail-subcard p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2 shrink-0"
            >
              <div className="interview-answerer-heading subcard-header-sync typo-h4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <WebIcon name="user-round" className="w-4 h-4 shrink-0" />
                <span className="subcard-title-synced tracking-wide text-emerald-700 dark:text-emerald-400" data-subcard-title="true">
                  Trả lời: {currentQ.answererVi}
                </span>
              </div>
              <p className="typo-body text-[var(--text-secondary)] leading-relaxed break-words m-0">
                {currentQ.answerVi}
              </p>
            </div>

            {/* Takeaway */}
            <div
              id="interview-insights-card"
              data-element-type="card"
              data-subcard="true"
              className="exp-detail-subcard p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2 shrink-0"
            >
              <div className="interview-insights-heading subcard-header-sync typo-h4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <WebIcon name="target" className="w-4 h-4 shrink-0" />
                <span className="subcard-title-synced tracking-wide text-amber-700 dark:text-amber-400" data-subcard-title="true">
                  Trọng tâm
                </span>
              </div>
              <p className="typo-body text-[var(--text-secondary)] leading-relaxed break-words m-0">
                {currentQ.keyTakeawayVi}
              </p>
            </div>
          </div>

          {/* Navigation Footer (Pinned) */}
          <div className="pt-2.5 border-t border-[var(--pillar-divider)] flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 relative z-10 min-w-0">
            <button
              type="button"
              disabled={currentQIdx === 0}
              onClick={() => selectQuestion(currentQIdx - 1)}
              className="theme-prev-next-btn typo-button disabled:opacity-35 disabled:pointer-events-none cursor-pointer inline-flex items-center justify-center gap-1 transition-all min-h-[34px] sm:min-h-[36px] py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-full border active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>‹ Trước</span>
            </button>

            <button
              type="button"
              onClick={() => selectQuestion(currentQIdx)}
              title="Phát lại câu hỏi hiện tại"
              className="typo-button text-[var(--text-link,var(--color-primary))] hover:bg-[var(--bg-subcard)] inline-flex items-center justify-center gap-1 cursor-pointer min-h-[34px] sm:min-h-[36px] py-1 sm:py-1.5 px-2 sm:px-3 rounded-full transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <WebIcon name="rotate-ccw" className="w-3.5 h-3.5 shrink-0" />
              <span>Lại</span>
            </button>

            <button
              type="button"
              disabled={currentQIdx === INTERVIEW_QUESTIONS.length - 1}
              onClick={() => selectQuestion(currentQIdx + 1)}
              className="theme-prev-next-btn typo-button disabled:opacity-35 disabled:pointer-events-none cursor-pointer inline-flex items-center justify-center gap-1 transition-all min-h-[34px] sm:min-h-[36px] py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-full border active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>Tiếp ›</span>
            </button>
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewView;