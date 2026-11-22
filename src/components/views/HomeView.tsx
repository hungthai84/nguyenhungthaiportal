'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { speakSiteText, stopActiveSpeech } from '@/utils/speechVoice';
import { useLanguage } from '@/context/LanguageContext';
import { SmartFaceVideo } from '@/components/ui/SmartFaceVideo';
import { useBannerVideo } from '@/context/BannerVideoContext';
import { DriveAwareBannerMedia } from '@/components/common/DriveAwareBannerMedia';

export interface HomeViewProps {
  slideIndex?: number;
  currentTheme?: SiteTheme;
  onNavigateContact: () => void;
  onNavigatePage?: (pageIndex: number) => void;
  onOpenPagesCarousel?: () => void;
  onShowNotification?: (msg: string) => void;
}

export interface VideoScreenItem {
  id: number;
  label: string;
  badge: string;
  url: string;
  idleUrl: string;
  transitionUrl: string;
  playUrl: string;
  introUrl?: string;
  title: string;
  description: string;
  accentColor: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  heroBadge: string;
  heroIcon: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentTheme = 'liquid-glass',
  onNavigateContact,
  onNavigatePage,
  onOpenPagesCarousel,
  onShowNotification,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();
  const { bannerAssignments, openStudioModal } = useBannerVideo();
  const driveHomeBanner = bannerAssignments.home;
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'deep-ocean';

  // Danh sách video cho 3 màn hình: Màn hình chờ (idle), Chuyển cảnh (transition), Video phát (presentation)
  const VIDEO_SCREENS: VideoScreenItem[] = [
    {
      id: 1,
      label: isEn ? 'Screen 1' : 'Màn hình 1',
      badge: 'Video 1',
      url: 'https://drive.google.com/uc?export=download&id=1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp',
      idleUrl: 'https://drive.google.com/uc?export=download&id=1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp',
      transitionUrl: 'https://drive.google.com/uc?export=download&id=11FZeENhRMILyUrG-em1DIWPyx2zVdc9d',
      playUrl: 'https://drive.google.com/uc?export=download&id=12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm',
      introUrl: 'https://drive.google.com/file/d/1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp/preview',
      title: isEn ? 'Leadership Presence & Vision' : 'Phong Thái Lãnh Đạo & Tầm Nhìn',
      description: isEn
        ? 'Executive presence in premier customer experience management'
        : 'Phong thái chuyên gia quản trị trải nghiệm khách hàng cao cấp',
      accentColor: '#38BDF8',
      gradientFrom: '#1E40AF',
      gradientVia: '#38BDF8',
      gradientTo: '#22D3EE',
      heroBadge: isEn ? 'Leadership Vision' : 'Tầm Nhìn Lãnh Đạo',
      heroIcon: 'target',
    },
    {
      id: 2,
      label: isEn ? 'Screen 2' : 'Màn hình 2',
      badge: isEn ? 'Video 2 (Default)' : 'Video 2 (Gốc)',
      url: 'https://drive.google.com/uc?export=download&id=1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp',
      idleUrl: 'https://drive.google.com/uc?export=download&id=1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp',
      transitionUrl: 'https://drive.google.com/uc?export=download&id=11FZeENhRMILyUrG-em1DIWPyx2zVdc9d',
      playUrl: 'https://drive.google.com/uc?export=download&id=12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm',
      introUrl: 'https://drive.google.com/uc?export=download&id=12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm',
      title: isEn ? 'Executive Portrait & Greeting' : 'Chân Dung Chuyên Gia & Lời Chào',
      description: isEn
        ? 'Customer Service executive profile with 22+ years of hands-on experience'
        : 'Chân dung điều hành dịch vụ khách hàng 22+ năm kinh nghiệm',
      accentColor: '#F125D6',
      gradientFrom: '#4E56F6',
      gradientVia: '#8938F8',
      gradientTo: '#F125D6',
      heroBadge: isEn ? 'Senior Executive Profile' : 'Hồ Sơ Lãnh Đạo',
      heroIcon: 'user',
    },
    {
      id: 3,
      label: isEn ? 'Screen 3' : 'Màn hình 3',
      badge: 'Video 3',
      url: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793301974/beauty_stable_1783711951686.mp4',
      idleUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793301974/beauty_stable_1783711951686.mp4',
      transitionUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623270/Chuyen_man_hinh_cho_1.mp4',
      playUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793542148/Thuy%E1%BA%BFt_tr%C3%ACnh_b%E1%BA%A3n_m%E1%BB%9Bi_2.mp4',
      introUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793542148/Thuy%E1%BA%BFt_tr%C3%ACnh_b%E1%BA%A3n_m%E1%BB%9Bi_2.mp4',
      title: isEn ? 'Digital Space & Ecosystem' : 'Không Gian Số Hóa & Hệ Sinh Thái',
      description: isEn
        ? 'Automated technology infrastructure and modern solution architecture'
        : 'Hạ tầng công nghệ tự động hóa và kiến trúc giải pháp hiện đại',
      accentColor: '#10B981',
      gradientFrom: '#065F46',
      gradientVia: '#10B981',
      gradientTo: '#34D399',
      heroBadge: isEn ? 'Digital Ecosystem' : 'Hệ Sinh Thái Số',
      heroIcon: 'layers',
    },
  ];

  // Mount check for client-only rendering
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Màn hình video hiện tại mặc định là Màn hình Video 2
  const [activeVideoScreen, setActiveVideoScreen] = useState<number>(2);
  const [playbackMode, setPlaybackMode] = useState<'idle' | 'transition' | 'play'>('idle');
  const [isIntroMode, setIsIntroMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [videoFallbackStage, setVideoFallbackStage] = useState<0 | 1 | 2>(0);

  // Video URL đang active theo chế độ phát
  const currentScreen = VIDEO_SCREENS[activeVideoScreen - 1];

  const extractDrivePreviewId = (url: string): string | null => {
    const m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
    if (m?.[1]) return m[1];
    const dlMatch = url.match(/drive\.google\.com\/uc\?[^#]*id=([^&#]+)/i);
    return dlMatch?.[1] ?? null;
  };

  const toPlayableVideoUrl = (url: string): string => {
    const driveId = extractDrivePreviewId(url);
    return driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : url;
  };

  const toDriveUsercontentUrl = (url: string): string | null => {
    const driveId = extractDrivePreviewId(url);
    return driveId
      ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`
      : null;
  };

  const nativeMp4BackupForMode =
    playbackMode === 'play' || isIntroMode
      ? 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793542148/Thuy%E1%BA%BFt_tr%C3%ACnh_b%E1%BA%A3n_m%E1%BB%9Bi_2.mp4'
      : playbackMode === 'transition'
        ? 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623270/Chuyen_man_hinh_cho_1.mp4'
        : 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623267/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4';

  const handleToggleSpeak = () => {
    SoundEngine.playTap();
    if (isSpeaking) {
      stopActiveSpeech();
      setIsSpeaking(false);
      showToast(isEn ? '🔴 Voice narration stopped' : '🔴 Đã tắt đọc thuyết minh giọng nói');
    } else {
      stopActiveSpeech();
      const textToRead = isEn
        ? `Introducing ${currentScreen.title}. ${currentScreen.description}. Dedicated service, driven by measurable results.`
        : `Giới thiệu ${currentScreen.title}. ${currentScreen.description}. Tận tâm phụng sự, dẫn dắt bằng kết quả.`;
      speakSiteText(textToRead, {
        lang: language,
        rate: 1.0,
        onStart: () => {
          setIsSpeaking(true);
          showToast(
            isEn
              ? `🔊 Playing narration: ${currentScreen.title}`
              : `🔊 Đang đọc thuyết minh: ${currentScreen.title}`
          );
        },
        onEnd: () => {
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeaking(false);
          showToast(isEn ? '⚠️ Unable to play voice narration' : '⚠️ Không thể phát âm thanh thuyết minh');
        },
      });
    }
  };
  const rawActiveVideoUrl =
    playbackMode === 'play' || isIntroMode
      ? currentScreen.playUrl
      : playbackMode === 'transition'
      ? currentScreen.transitionUrl
      : currentScreen.idleUrl;
  const primaryVideoUrl = toPlayableVideoUrl(rawActiveVideoUrl);
  const driveAltVideoUrl = toDriveUsercontentUrl(rawActiveVideoUrl);
  const activeVideoUrl =
    videoFallbackStage === 0
      ? primaryVideoUrl
      : videoFallbackStage === 1
        ? driveAltVideoUrl || nativeMp4BackupForMode
        : nativeMp4BackupForMode;

  useEffect(() => {
    setVideoFallbackStage(0);
  }, [rawActiveVideoUrl]);

  useEffect(() => {
    if (videoFallbackStage >= 2) return;
    if (activeVideoUrl === nativeMp4BackupForMode) return;
    const stallTimer = window.setTimeout(() => {
      const el = videoRef.current;
      if (el && el.readyState < 2) {
        setVideoFallbackStage((prev) => (prev === 0 && driveAltVideoUrl ? 1 : 2));
      }
    }, 4500);
    return () => window.clearTimeout(stallTimer);
  }, [videoFallbackStage, activeVideoUrl, driveAltVideoUrl, nativeMp4BackupForMode]);

  // Đồng bộ âm thanh và tự động phát khi đổi màn hình video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = isMuted;
      video.muted = isMuted;
      video.currentTime = 0;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Trình duyệt có thể chặn autoplay nếu có tiếng
      });
    }
  }, [activeVideoScreen, activeVideoUrl, isMuted]);

  // Tự động chuyển tiếp từ video chuyển cảnh sang video màn hình chờ (idle) sau khi phát xong
  useEffect(() => {
    if (playbackMode === 'transition') {
      const fallbackTimer = setTimeout(() => {
        setPlaybackMode('idle');
      }, 4000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [playbackMode, activeVideoScreen]);

  // Điều hướng chuyển màn hình với video chuyển cảnh
  const handleSelectScreen = (nextScreenId: number) => {
    if (nextScreenId === activeVideoScreen && playbackMode !== 'idle') return;
    SoundEngine.playGlassChime();
    setIsIntroMode(false);
    setActiveVideoScreen(nextScreenId);
    const target = VIDEO_SCREENS[nextScreenId - 1];
    showToast(
      isEn
        ? `Switching to ${target.label} · ${target.title}`
        : `Đang chuyển sang ${target.label} · ${target.title}`
    );

    // Mở màn hình trực tiếp, không phát video chuyển cảnh
    setPlaybackMode('idle');
  };

  // Điều hướng màn hình video qua trái (Prev)
  const handlePrevVideoScreen = () => {
    const next = activeVideoScreen === 1 ? 3 : activeVideoScreen - 1;
    handleSelectScreen(next);
  };

  // Điều hướng màn hình video qua phải (Next)
  const handleNextVideoScreen = () => {
    const next = activeVideoScreen === 3 ? 1 : activeVideoScreen + 1;
    handleSelectScreen(next);
  };

  // Điều hướng 3 màn hình trang chủ bằng phím mũi tên Trái / Phải
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (isIntroMode) return;
      if (e.key === 'ArrowLeft') {
        handleSelectScreen(activeVideoScreen === 1 ? 3 : activeVideoScreen - 1);
      } else if (e.key === 'ArrowRight') {
        handleSelectScreen(activeVideoScreen === 3 ? 1 : activeVideoScreen + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoScreen, isIntroMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !isIntroMode) return;
    setCurrentTime(formatTime(video.currentTime));
    if (video.duration && !isNaN(video.duration)) {
      setDuration(formatTime(video.duration));
      setProgressPct((video.currentTime / video.duration) * 100);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackMode === 'transition') {
      // Khi video chuyển cảnh kết thúc, chuyển sang video màn hình chờ
      setPlaybackMode('idle');
    } else if (playbackMode === 'play' || isIntroMode) {
      handleCancelIntro();
    }
  };

  const handlePlayIntro = () => {
    const video = videoRef.current;
    setVideoFallbackStage(0);
    setIsIntroMode(true);
    setPlaybackMode('play');
    setIsMuted(false);
    setIsPlaying(true);
    if (video) {
      video.src = toPlayableVideoUrl(currentScreen.playUrl);
      video.loop = false;
      video.muted = false;
      video.controls = false;
      video.disablePictureInPicture = true;
      (video as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    showToast(
      isEn
        ? `Playing presentation video: ${currentScreen.title} 🔊`
        : `Đang phát video thuyết minh: ${currentScreen.title} 🔊`
    );
  };

  const handleCancelIntro = () => {
    const video = videoRef.current;
    setVideoFallbackStage(0);
    setIsIntroMode(false);
    setPlaybackMode('idle');
    setIsMuted(true);
    setIsPlaying(true);
    if (video) {
      video.src = toPlayableVideoUrl(currentScreen.idleUrl);
      video.loop = true;
      video.defaultMuted = true;
      video.muted = true;
      video.controls = false;
      video.disablePictureInPicture = true;
      (video as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    video.muted = nextMuted;
    showToast(
      nextMuted
        ? isEn
          ? 'Video muted'
          : 'Đã tắt tiếng video'
        : isEn
        ? 'Video sound enabled'
        : 'Đã bật âm thanh video'
    );
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = pct * video.duration;
  };

  return (
    <div
      id="home-page-container"
      data-element-name="Trang chủ cá nhân"
      data-element-type="container"
      data-element-page="home"
      data-element-parent="global-content-viewport"
      suppressHydrationWarning
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar select-none font-play rounded-none box-border"
    >
      <div
        id="home-cards-track"
        data-element-name="Track căn giữa Trang chủ"
        data-element-type="container"
        data-element-page="home"
        data-element-parent="home-page-container"
        className="page-cards-track"
      >
        <div
          id="home-main-card"
          data-main-card="true"
          data-layer-level="1"
          data-element-name="Thẻ chính Trang chủ cá nhân"
          data-element-type="card"
          data-element-page="home"
          data-element-parent="home-cards-track"
          className="page-main-card relative flex flex-col justify-between overflow-hidden select-none p-[15px] gap-[15px] font-play rounded-[var(--radius-main,30px)] box-border"
          style={{
            padding: 'var(--main-card-padding, 15px)',
            gap: '15px',
            borderRadius: 'var(--radius-main, 30px)',
          }}
        >
          <div
            id="home-main-content"
            data-element-name="Nội dung Trang chủ cá nhân"
            data-element-type="container"
            data-element-page="home"
            data-element-parent="home-main-card"
            className="relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-between overflow-hidden rounded-[var(--radius-card,24px)] p-[15px] gap-[15px] box-border"
            style={{
              borderRadius: 'var(--radius-card, 24px)',
              padding: 'var(--main-card-padding, 15px)',
              gap: '15px',
            }}
          >
            {/* 1. Main Background Video - Hỗ trợ đồng bộ video nền từ Google Drive Picker hoặc video mặc định */}
            <div className="project-detail-banner-media absolute inset-0 w-full h-full min-w-full min-h-full z-0 overflow-hidden pointer-events-none rounded-[inherit]">
              {driveHomeBanner && !isIntroMode ? (
                <DriveAwareBannerMedia
                  directVideoUrl={driveHomeBanner.directStreamUrl}
                  iframeFallbackUrl={driveHomeBanner.previewIframeUrl}
                  posterUrl="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
                  title={driveHomeBanner.fileName}
                  muted={isMuted}
                  loop={true}
                  className="transition-all duration-700 brightness-110 contrast-105"
                />
              ) : (
                <SmartFaceVideo
                  videoRef={videoRef}
                  key={`${videoFallbackStage}-${activeVideoUrl}`}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                  aria-hidden="true"
                  tabIndex={-1}
                  alwaysCover={true}
                  loop={playbackMode === 'idle' && !isIntroMode}
                  src={activeVideoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onPause={(e) => {
                    if (isIntroMode || playbackMode !== 'idle') return;
                    if (typeof document !== 'undefined' && document.hidden) return;
                    const v = e.currentTarget;
                    v.defaultMuted = true;
                    v.muted = true;
                    v.loop = true;
                    v.play().catch(() => {});
                  }}
                  onError={() => {
                    setVideoFallbackStage((prev) =>
                      prev === 0 && driveAltVideoUrl ? 1 : prev < 2 ? 2 : prev
                    );
                  }}
                  faceAnchor={{ x: 50, y: 18 }}
                  maxCropDistortion={1.6}
                  wrapperClassName="absolute inset-0 w-full h-full rounded-[inherit]"
                  className="banner-video-sharp transition-all duration-700"
                />
              )}
              {/* Lớp phủ nhẹ nhàng đồng bộ Sáng / Tối, giữ video rõ nét tươi sáng */}
              <div
                className={cn(
                  'absolute inset-0 pointer-events-none transition-colors duration-500 bg-gradient-to-t',
                  isDark
                    ? 'from-black/20 via-transparent to-black/10'
                    : 'from-white/10 via-transparent to-white/5'
                )}
              />
            </div>

            {/* Nút mở nhanh Google Drive Video Banner Studio ở góc trên trái */}
            {!isIntroMode && (
              <button
                id="home-drive-banner-studio-btn"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  openStudioModal('home');
                }}
                title={
                  isEn
                    ? 'Pick background video from Google Drive'
                    : 'Chọn video nền từ Google Drive & tự khớp trang Banner'
                }
                className="theme-video-capsule absolute top-3 left-3 sm:top-4 sm:left-4 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[999px] text-xs font-bold font-play cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto shadow-md"
              >
                <WebIcon name="video" className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Drive Video Banner' : 'Video Banner Drive'}</span>
                {driveHomeBanner && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                )}
              </button>
            )}

      {/* 2 Nút Trái và Phải qua lại giữa các màn hình trên Trang Chủ (không đè lên thẻ thông tin) - Ẩn khi đang phát video */}
      {!isIntroMode && (
        <>
          <button
            id="el-p0-button-1"
            data-element-id="el-p0-button-1"
            type="button"
            onClick={handlePrevVideoScreen}
            title="Màn hình trước (Chuyển màn hình video)"
            aria-label="Màn hình trước"
            className="nav-arrow-btn theme-prev-next-btn absolute left-3 sm:left-[15px] top-3 sm:top-1/2 sm:-translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-md"
          >
            <WebIcon name="chevron-left" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            id="el-p0-button-2"
            data-element-id="el-p0-button-2"
            type="button"
            onClick={handleNextVideoScreen}
            title="Màn hình kế tiếp (Chuyển màn hình video)"
            aria-label="Màn hình kế tiếp"
            className="nav-arrow-btn theme-prev-next-btn absolute right-3 sm:right-[15px] top-3 sm:top-1/2 sm:-translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-md"
          >
            <WebIcon name="chevron-right" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Video Intro Controller Modal (When intro is active) */}
      {isIntroMode && (
        <div className="theme-modal-card relative z-50 w-full max-w-md max-h-full overflow-y-auto mx-auto my-auto p-3.5 rounded-[var(--radius-modal,24px)] shadow-2xl animate-fadeIn text-left pointer-events-auto">
          <div
            className="flex items-center justify-between pb-2 border-b"
            style={{ borderColor: 'var(--border-subcard)' }}
          >
            <div className="flex items-center gap-2">
              <span className="typo-label font-bold font-play" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                {isEn
                  ? `Now Playing: Executive Introduction (${currentScreen.label})`
                  : `Đang phát: Lời Chào Giới Thiệu Chuyên Gia (${currentScreen.label})`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancelIntro}
              title={isEn ? 'Stop Video' : 'Hủy phát video'}
              className="theme-modal-close px-2.5 py-1 rounded-full typo-label font-bold transition cursor-pointer flex items-center gap-1"
            >
              <span>{isEn ? '✕ Stop' : '✕ Hủy'}</span>
            </button>
          </div>

          <div className="w-full space-y-1 my-2">
            <div
              className="w-full rounded-full h-1.5 overflow-hidden cursor-pointer relative"
              style={{ background: 'var(--pillar-progress-track, rgba(148, 163, 184, 0.28))' }}
              onClick={handleSeek}
            >
              <div
                className="h-1.5 rounded-full transition-all duration-150 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                style={{ width: `${progressPct}%`, background: `linear-gradient(to right, ${currentScreen.gradientFrom}, ${currentScreen.gradientTo})` }}
              />
            </div>
            <div className="flex justify-between typo-label font-mono font-bold" style={{ color: 'var(--text-secondary)' }}>
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-4 py-1.5 rounded-[999px] font-bold typo-button flex items-center gap-2 shadow-xs transition cursor-pointer active:scale-95 text-white"
              style={{ background: currentScreen.gradientFrom }}
            >
              {isPlaying ? <WebIcon name="pause" className="w-3.5 h-3.5 fill-current" /> : <WebIcon name="play" className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Resume' : 'Phát tiếp'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="theme-modal-close px-4 py-1.5 rounded-[999px] font-bold typo-button flex items-center gap-2 shadow-2xs transition cursor-pointer active:scale-95"
            >
              {isMuted ? <WebIcon name="volume-x" className="w-3.5 h-3.5 text-rose-500" /> : <WebIcon name="volume-2" className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{isMuted ? (isEn ? 'Unmute' : 'Bật tiếng') : isEn ? 'Mute' : 'Tắt tiếng'}</span>
            </button>

            <button
              type="button"
              onClick={handleCancelIntro}
              className="px-4 py-1.5 rounded-[999px] bg-rose-600 hover:bg-rose-700 text-white font-bold typo-button transition cursor-pointer active:scale-95 flex items-center gap-2 shadow-md"
            >
              <WebIcon name="cancel" className="w-3.5 h-3.5" />
              <span>{isEn ? 'Stop Video' : 'Hủy phát video'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Main Body: Hero Card Bottom Right (chừa hành lang an toàn tránh đè nút chuyển màn hình) - Ẩn khi đang phát video */}
      {!isIntroMode && (
        <div className="relative z-20 w-full flex-1 min-h-0 flex items-end justify-end pointer-events-none pt-14 sm:pt-0 sm:px-14">
          <div className="pointer-events-none flex items-end justify-end w-fit max-w-full ml-auto">
            <AnimatePresence mode="wait">
              <motion.div
                id={activeVideoScreen === 1 ? "home-intro-card" : activeVideoScreen === 2 ? "home-stats-card" : activeVideoScreen === 3 ? "home-capabilities-card" : "home-achievements-card"}
                data-element-name="Thẻ thông tin tổng quan trang chủ"
                data-element-type="card"
                data-element-page="home"
                data-element-parent="home-main-card"
                data-section-card="true"
                data-card-theme-sync="true"
                key={`hero-card-${activeVideoScreen}`}
                initial={{ opacity: 0, x: 30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="home-hero-card bento-card layered-card pointer-events-auto p-[15px] rounded-[var(--radius-card,24px)] relative max-h-full overflow-y-auto overflow-x-hidden glass-scrollbar group transition-all duration-500 w-fit max-w-full sm:max-w-fit text-left"
              >
                <div className="relative z-10 flex flex-col gap-[15px] w-full sm:w-fit">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="home-hero-badge inline-flex items-center gap-2 typo-h4 font-bold tracking-tight px-0 py-0 border-0 bg-transparent shadow-none"
                      style={{ color: 'var(--card-synced-accent, var(--color-primary, ' + currentScreen.accentColor + '))' }}
                    >
                      <span>{currentScreen.heroBadge}</span>
                    </div>
                  </div>

                  {/* Tiêu đề 1 hàng trên desktop, tự xuống dòng ở mobile */}
                  <div className="card-header-sync flex items-center gap-2 flex-wrap sm:flex-nowrap" style={{ color: 'var(--card-synced-accent, var(--text-heading, ' + currentScreen.accentColor + '))' }}>
                    <WebIcon
                      name={currentScreen.heroIcon || 'sparkles'}
                      className="w-5 h-5 shrink-0"
                      style={{ color: 'var(--card-synced-accent, var(--text-heading, ' + currentScreen.accentColor + '))' }}
                    />
                    <h3
                      className="card-title card-title-synced typo-h3 font-play tracking-tight leading-tight whitespace-normal"
                      data-card-title="true"
                      style={{ color: 'var(--card-synced-accent, var(--text-heading, ' + currentScreen.accentColor + '))' }}
                    >
                      {currentScreen.title}
                    </h3>
                  </div>

                  <p className="typo-body-sm font-medium leading-relaxed max-w-xs sm:max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                    {currentScreen.description}
                  </p>

                  {/* Tích hợp Nút Giới thiệu (Laser Beam Capsule) & Nút Bật Tắt Speak bên dưới */}
                  <div 
                    id="el-p0-group-container"
                    data-element-id="el-p0-group-container"
                    data-element-name="Nhóm điều khiển phát video trang chủ"
                    data-element-type="container"
                    data-element-page="home"
                    className="pt-0.5 flex flex-col items-end gap-2 w-full"
                  >
                    {/* Nút Giới Thiệu Video dạng nút capsule đồng bộ theo giao diện hiện hành */}
                    <div
                      id="el-p0-div-78"
                      role="button"
                      tabIndex={0}
                      data-element-id="el-p0-div-78"
                      data-element-name="Nút bật âm và phát video giới thiệu"
                      data-element-type="button"
                      data-element-page="home"
                      onClick={isIntroMode ? handleCancelIntro : handlePlayIntro}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (isIntroMode) {
                            handleCancelIntro();
                          } else {
                            handlePlayIntro();
                          }
                        }
                      }}
                      title={isIntroMode ? 'Dừng phát video giới thiệu' : 'Phát video giới thiệu chuyên gia'}
                      aria-label={isIntroMode ? 'Dừng phát video giới thiệu' : 'Phát video giới thiệu chuyên gia'}
                      style={{ borderRadius: '999px' }}
                      className={`theme-capsule-btn video-play-btn video-play-btn--home relative z-10 inline-flex items-center gap-2 px-2.5 py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-200 cursor-pointer pointer-events-auto shrink-0 active:scale-[0.98] select-none font-play ${
                        isIntroMode ? 'is-playing' : ''
                      }`}
                    >
                      {/* Speaker Toggle Control */}
                      <span
                        id="el-p0-btn-sound-toggle"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMute();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleMute();
                          }
                        }}
                        className={`video-play-btn__sound w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
                          !isMuted ? 'text-current shadow-xs' : 'is-muted text-white shadow-md'
                        }`}
                        title={!isMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                        aria-label={!isMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                      >
                        <span className="flex items-center justify-center">
                          {!isMuted ? (
                            <WebIcon name="volume-2" className="w-3.5 h-3.5 text-current" />
                          ) : (
                            <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
                          )}
                        </span>
                      </span>

                      <span className="w-[1px] h-4 bg-current opacity-25 shrink-0 mx-0.5" aria-hidden="true" />

                      {/* Play / Stop Label */}
                      <span
                        id="el-p0-btn-intro-toggle"
                        className="inline-flex items-center justify-center gap-2 pr-1.5 py-0.5 rounded-[999px] font-bold typo-button tracking-wide transition-all duration-200 font-play text-current"
                      >
                        <span className="flex items-center justify-center">
                          {!isIntroMode ? (
                            <WebIcon name="play" className="w-4 h-4 fill-current text-current shrink-0" style={{ height: '16px', width: '16px' }} />
                          ) : (
                            <WebIcon name="cancel" className="w-4 h-4 stroke-[2.8] text-current shrink-0" style={{ height: '16px', width: '16px' }} />
                          )}
                        </span>
                        <span className="font-bold typo-button truncate font-play text-left text-current" style={{ textAlign: 'left' }}>
                          {isIntroMode ? (isEn ? 'Stop Video' : 'Dừng phát') : isEn ? 'Play Video' : 'Phát Video'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 5. Bottom Center Bar: Dock chuyển đổi 3 màn hình đồng bộ theo giao diện website (thu gọn 1/2 kích thước) - Ẩn khi đang phát video */}
      {!isIntroMode && (
        <div className="relative z-30 w-full flex items-center justify-center pointer-events-auto shrink-0 pt-0.5">
          <div
            id="el-p0-div-16"
            data-element-id="el-p0-div-16"
            data-element-name="Thanh chuyển đổi màn hình trang chủ"
            data-element-type="card"
            data-element-page="home"
            className="theme-screen-switcher-dock inline-flex items-center gap-1 !rounded-[999px] border select-none transition-all duration-300 px-2 py-1 m-0"
            role="tablist"
            aria-label="Chuyển đổi màn hình trang chủ"
          >
            {VIDEO_SCREENS.map((screen) => {
              const isActive = activeVideoScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  id={`el-p0-screen-btn-${screen.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${screen.label}: ${screen.title}`}
                  title={`${screen.label} · ${screen.title}`}
                  onClick={() => handleSelectScreen(screen.id)}
                  className={`group relative h-1 sm:h-[5px] rounded-full transition-all duration-300 cursor-pointer focus:outline-none select-none ${
                    isActive
                      ? 'w-3.5 sm:w-[18px] scale-105'
                      : 'w-2.5 sm:w-3 hover:w-3 sm:hover:w-3.5 active:scale-95'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};
