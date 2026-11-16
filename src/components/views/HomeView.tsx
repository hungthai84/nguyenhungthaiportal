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
  currentTheme = 'light-glass',
  onNavigateContact,
  onNavigatePage,
  onOpenPagesCarousel,
  onShowNotification,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDark = themeIsDark || currentTheme === 'dark-neon';

  // Danh sách video cho 3 màn hình: Màn hình chờ (idle), Chuyển cảnh (transition), Video phát (presentation)
  const VIDEO_SCREENS: VideoScreenItem[] = [
    {
      id: 1,
      label: isEn ? 'Screen 1' : 'Màn hình 1',
      badge: 'Video 1',
      url: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302419/Man_hinh_cho_4.mp4',
      idleUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302419/Man_hinh_cho_4.mp4',
      transitionUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793541875/M%C3%A0n_h%C3%ACnh_chuy%E1%BB%83n.mp4',
      playUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302434/Thuyet_trinh_4.mp4',
      introUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302434/Thuyet_trinh_4.mp4',
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
      url: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302150/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4',
      idleUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302150/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4',
      transitionUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793303029/Man_hinh_2_chuyen_sang_man_hinh_1.mp4',
      playUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793541818/Chinh_sua.mp4',
      introUrl: 'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793541818/Chinh_sua.mp4',
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

  // Video URL đang active theo chế độ phát
  const currentScreen = VIDEO_SCREENS[activeVideoScreen - 1];

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
  const activeVideoUrl =
    playbackMode === 'play' || isIntroMode
      ? currentScreen.playUrl
      : playbackMode === 'transition'
      ? currentScreen.transitionUrl
      : currentScreen.idleUrl;

  // Đồng bộ âm thanh và tự động phát khi đổi màn hình video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
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
    if (!video) return;
    setIsIntroMode(true);
    setPlaybackMode('play');
    setIsMuted(false);
    setIsPlaying(true);
    video.src = currentScreen.playUrl;
    video.loop = false;
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
    showToast(
      isEn
        ? `Playing presentation video: ${currentScreen.title} 🔊`
        : `Đang phát video thuyết minh: ${currentScreen.title} 🔊`
    );
  };

  const handleCancelIntro = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsIntroMode(false);
    setPlaybackMode('idle');
    setIsMuted(true);
    setIsPlaying(true);
    video.src = currentScreen.idleUrl;
    video.loop = true;
    video.muted = true;
    video.currentTime = 0;
    video.play().catch(() => {});
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
      className="main-card relative w-full min-w-0 h-full min-h-full mx-auto flex flex-col justify-between overflow-hidden select-none p-[25px] gap-[15px] font-play rounded-[20px] box-border"
    >
      {/* 1. Main Background Video - Hiển Thị Toàn Bộ Thẻ Chính Lắp Đầy 100% Chiều Rộng và Chiều Cao */}
      <div className="absolute inset-0 w-full h-full min-w-full min-h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          key={activeVideoUrl}
          autoPlay
          muted={isMuted}
          playsInline
          loop={playbackMode === 'idle' && !isIntroMode}
          src={activeVideoUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center transition-all duration-700 brightness-110 contrast-105 scale-[1.01]"
        />
        {/* Lớp phủ sáng trong suốt nhẹ nhàng cho Giao diện Sáng (Light Mode), giữ video rõ nét tươi sáng */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500 bg-gradient-to-t from-white/10 via-transparent to-white/5"
        />
      </div>

      {/* 2 Nút Center Trái và Center Phải qua lại giữa các màn hình trên Trang Chủ (Giao diện Sáng) - Ẩn khi đang phát video */}
      {!isIntroMode && (
        <>
          <button
            id="el-p0-button-1"
            data-element-id="el-p0-button-1"
            type="button"
            onClick={handlePrevVideoScreen}
            title="Màn hình trước (Chuyển màn hình video)"
            aria-label="Màn hình trước"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto"
            style={{
              background: 'var(--bg-header, rgba(255,255,255,0.85))',
              borderColor: currentScreen.accentColor,
              color: currentScreen.accentColor,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
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
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto"
            style={{
              background: 'var(--bg-header, rgba(255,255,255,0.85))',
              borderColor: currentScreen.accentColor,
              color: currentScreen.accentColor,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <WebIcon name="chevron-right" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Video Intro Controller Modal (When intro is active) */}
      {isIntroMode && (
        <div className="theme-modal-card relative z-50 w-full max-w-md mx-auto my-auto p-3.5 rounded-[14px] shadow-2xl animate-fadeIn text-left pointer-events-auto">
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

          <div className="flex items-center justify-between gap-1.5 pt-0.5">
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

      {/* 4. Main Body: Hero Card Bottom Right (Giao diện Sáng) - Ẩn khi đang phát video */}
      {!isIntroMode && (
        <div className="relative z-20 w-full flex-1 min-h-0 flex items-end justify-end pointer-events-none p-0">
          <div className="pointer-events-none flex items-end justify-end w-fit max-w-full ml-auto">
            <AnimatePresence mode="wait">
              <motion.div
                id={activeVideoScreen === 1 ? "home-intro-card" : activeVideoScreen === 2 ? "home-stats-card" : activeVideoScreen === 3 ? "home-capabilities-card" : "home-achievements-card"}
                data-element-name="Thẻ thông tin tổng quan trang chủ"
                data-element-type="card"
                data-element-page="home"
                data-element-parent="home-page-container"
                data-section-card="true"
                key={`hero-card-${activeVideoScreen}`}
                initial={{ opacity: 0, x: 30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ borderRadius: '14px' }}
                className="bento-card glass-card layered-card pointer-events-auto p-4 sm:p-5 md:p-6 rounded-[14px] relative overflow-hidden group transition-all duration-500 w-fit max-w-full sm:max-w-fit text-left"
              >
                <div className="relative z-10 space-y-2.5 w-full sm:w-fit">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="inline-flex items-center gap-2 typo-h4 font-bold tracking-tight px-0 py-0 border-0 bg-transparent shadow-none"
                      style={{ color: currentScreen.accentColor }}
                    >
                      <WebIcon
                        name={currentScreen.heroIcon}
                        className="w-[18px] h-[18px] shrink-0"
                        style={{ color: currentScreen.accentColor, width: '18px', height: '18px' }}
                      />
                      <span>{currentScreen.heroBadge}</span>
                    </div>
                  </div>

                  {/* Tiêu đề 1 hàng trên desktop, tự xuống dòng ở mobile */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <h3
                      className="card-title card-title-synced typo-h3 font-play tracking-tight leading-tight whitespace-normal"
                      style={{ color: currentScreen.accentColor }}
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
                    {/* Nút Giới Thiệu Video formatted theo chuẩn AboutView với màu sắc riêng biệt cho từng màn hình (1, 2, 3) */}
                    <div 
                      id="el-p0-div-78"
                      data-element-id="el-p0-div-78"
                      data-element-name="Nút bật âm và phát video giới thiệu"
                      data-element-type="container"
                      data-element-page="home"
                      className={`relative z-10 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[999px] text-white transition-all duration-500 cursor-pointer pointer-events-auto shrink-0 border border-white/35 active:scale-98 select-none ${
                        activeVideoScreen === 1
                          ? 'bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 shadow-[0_4px_20px_rgba(14,165,233,0.5)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.7)]'
                          : activeVideoScreen === 3
                          ? 'bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-cyan-500 shadow-[0_4px_20px_rgba(16,185,129,0.5)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.7)]'
                          : 'bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-500 shadow-[0_4px_20px_rgba(236,72,153,0.5)] hover:shadow-[0_6px_24px_rgba(236,72,153,0.7)]'
                      }`}
                    >
                      {/* Speaker Toggle Button */}
                      <button
                        id="el-p0-btn-sound-toggle"
                        type="button"
                        onClick={handleToggleMute}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
                          !isMuted
                            ? 'bg-white/25 hover:bg-white/40 text-white shadow-xs'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                        }`}
                        title={!isMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                        aria-label={!isMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                      >
                        <span className="flex items-center justify-center">
                          {!isMuted ? (
                            <WebIcon name="volume-2" className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
                          )}
                        </span>
                      </button>

                      <div className="w-[1px] h-4 bg-white/35 shrink-0 mx-0.5" />

                      {/* Play / Pause Toggle Button */}
                      <button
                        id="el-p0-btn-intro-toggle"
                        type="button"
                        onClick={isIntroMode ? handleCancelIntro : handlePlayIntro}
                        className="inline-flex items-center justify-center gap-2 pr-1.5 py-1 rounded-[999px] text-white font-black typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                        title={isIntroMode ? 'Dừng phát video giới thiệu' : 'Phát video giới thiệu chuyên gia'}
                        aria-label={isIntroMode ? 'Dừng phát video giới thiệu' : 'Phát video giới thiệu chuyên gia'}
                      >
                        <span className="flex items-center justify-center">
                          {!isIntroMode ? (
                            <WebIcon name="play" className="w-4 h-4 fill-white text-white shrink-0" style={{ height: '16px', width: '16px' }} />
                          ) : (
                            <WebIcon name="cancel" className="w-4 h-4 stroke-[2.8] text-white shrink-0" style={{ height: '16px', width: '16px' }} />
                          )}
                        </span>
                        <span className="drop-shadow-sm font-black typo-button text-white truncate font-play text-left" style={{ textAlign: 'left' }}>
                          {isIntroMode ? (isEn ? 'Stop Video' : 'Dừng phát') : isEn ? 'Play Video' : 'Phát Video'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 5. Bottom Center Bar: Dock chuyển đổi 3 màn hình dạng Kính đa sắc cao cấp - Ẩn khi đang phát video */}
      {!isIntroMode && (
        <div className="relative z-30 w-full flex items-center justify-center pointer-events-auto shrink-0 pt-1">
          <div
            id="el-p0-div-16"
            data-element-id="el-p0-div-16"
            data-element-name="Thanh chuyển đổi màn hình trang chủ"
            data-element-type="card"
            data-element-page="home"
            style={{
              borderRadius: '999px',
              background: 'var(--bg-header)',
              borderColor: 'var(--border-subcard)',
              boxShadow: 'var(--shadow-nav-pill)',
            }}
            className="inline-flex items-center gap-1.5 rounded-[999px] border select-none transition-all duration-300 backdrop-blur-xl px-2.5 py-1.5 m-0"
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
                  className={`group relative h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none select-none ${
                    isActive
                      ? 'w-7 sm:w-9 shadow-md scale-105'
                      : 'w-5 sm:w-6 hover:w-6 sm:hover:w-7 active:scale-95'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${screen.gradientFrom}, ${screen.gradientTo})`,
                          boxShadow: `0 3px 10px ${screen.accentColor}66`,
                        }
                      : {
                          background: 'var(--divider-nav-pill, rgba(148, 163, 184, 0.55))',
                        }
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
