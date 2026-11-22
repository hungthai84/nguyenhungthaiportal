'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useBannerVideo } from '@/context/BannerVideoContext';
import { DriveAwareBannerMedia } from '@/components/common/DriveAwareBannerMedia';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';

export interface HomeViewProps {
  slideIndex?: number;
  currentTheme?: SiteTheme;
  onNavigateContact: () => void;
  onNavigatePage?: (pageIndex: number) => void;
  onOpenPagesCarousel?: () => void;
  onShowNotification?: (msg: string) => void;
}

export interface VideoScreenItem {
  id: 1 | 2 | 3;
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

const SCREEN_1_IDLE_MP4 =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623267/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4';
const SCREEN_1_PLAY_MP4 =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4';
const DEFAULT_IDLE_MP4_BACKUP =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623267/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4';
const DEFAULT_TRANSITION_MP4_BACKUP =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623270/Chuyen_man_hinh_cho_1.mp4';
const DEFAULT_PLAY_MP4_BACKUP =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793542148/Thuy%E1%BA%BFt_tr%C3%ACnh_b%E1%BA%A3n_m%E1%BB%9Bi_2.mp4';

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

export const HomeView: React.FC<HomeViewProps> = ({
  slideIndex,
  currentTheme = 'liquid-glass',
  onNavigateContact,
  onNavigatePage,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();
  const { bannerAssignments, openStudioModal } = useBannerVideo();
  const driveHomeBanner = bannerAssignments.home;

  const homeContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const activeScreenRef = useRef<1 | 2 | 3>(2);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const hasInitializedScrollRef = useRef<boolean>(false);
  const touchSwipeRef = useRef<{
    x: number;
    y: number;
    time: number;
    isHorizontal: boolean;
  } | null>(null);

  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond';

  // Danh sách video tách biệt cho 3 màn hình (Màn hình 1, Màn hình 2, Màn hình 3 có bối cảnh hình ảnh khác nhau)
  const VIDEO_SCREENS: VideoScreenItem[] = [
    {
      id: 1,
      label: isEn ? 'Screen 1' : 'Màn hình 1',
      badge: 'Video 1',
      url: SCREEN_1_IDLE_MP4,
      idleUrl: SCREEN_1_IDLE_MP4,
      transitionUrl: DEFAULT_TRANSITION_MP4_BACKUP,
      playUrl: SCREEN_1_PLAY_MP4,
      introUrl: SCREEN_1_PLAY_MP4,
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

  const initialScreen: 1 | 2 | 3 =
    slideIndex === 0 ? 1 : slideIndex === 2 ? 3 : 2;

  const [activeVideoScreen, setActiveVideoScreen] = useState<1 | 2 | 3>(initialScreen);
  const [playbackMode, setPlaybackMode] = useState<'idle' | 'transition' | 'play'>('idle');
  const [isIntroMode, setIsIntroMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [activeVideoReady, setActiveVideoReady] = useState<boolean>(false);
  const [videoFallbackStages, setVideoFallbackStages] = useState<Record<number, 0 | 1 | 2>>({
    1: 0,
    2: 0,
    3: 0,
  });

  // Đo kích thước khung nhìn & container để căn giữa 1 Main Card / màn hình và hé lộ thẻ kế bên (peek)
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [homeContainerWidth, setHomeContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const container = homeContainerRef.current;
    const updateWidths = () => {
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      if (container) {
        setHomeContainerWidth(container.clientWidth || window.innerWidth);
      }
    };
    updateWidths();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro && container) {
      ro.observe(container);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateWidths);
    };
  }, []);

  const peekReserve = viewportWidth <= 1023 ? 32 : 112;
  const homeCardWidth = Math.min(1250, Math.max(260, viewportWidth - peekReserve));
  const homeSideInset = Math.max(15, (homeContainerWidth - homeCardWidth) / 2);

  const currentScreen = VIDEO_SCREENS[activeVideoScreen - 1];

  const getPreloadPriority = (screenId: 1 | 2 | 3): 'auto' | 'metadata' | 'none' => {
    const distance = Math.abs(screenId - activeVideoScreen);
    if (distance === 0) return 'auto';
    if (distance === 1) return activeVideoReady ? 'auto' : 'metadata';
    return 'none';
  };

  const getVideoUrlsForScreen = (
    screen: VideoScreenItem,
    isActive: boolean
  ): {
    rawUrl: string;
    activeUrl: string;
    driveAltUrl: string | null;
    backupUrl: string;
  } => {
    const mode = isActive ? playbackMode : 'idle';
    const inIntro = isActive && isIntroMode;
    const rawUrl =
      mode === 'play' || inIntro
        ? screen.playUrl
        : mode === 'transition'
          ? screen.transitionUrl
          : screen.idleUrl;

    const primaryUrl = toPlayableVideoUrl(rawUrl);
    const driveAltUrl = toDriveUsercontentUrl(rawUrl);
    const backupUrl =
      mode === 'play' || inIntro
        ? DEFAULT_PLAY_MP4_BACKUP
        : mode === 'transition'
          ? DEFAULT_TRANSITION_MP4_BACKUP
          : DEFAULT_IDLE_MP4_BACKUP;

    const stage = videoFallbackStages[screen.id] ?? 0;
    const activeUrl =
      stage === 0
        ? primaryUrl
        : stage === 1
          ? driveAltUrl || backupUrl
          : backupUrl;

    return { rawUrl, activeUrl, driveAltUrl, backupUrl };
  };

  const getCenteredScrollLeftForCard = useCallback(
    (screenId: 1 | 2 | 3) => {
      const container = homeContainerRef.current;
      if (!container) return (screenId - 1) * (homeCardWidth + 15);
      const cardEl = document.getElementById(`home-main-card-${screenId}`);
      if (!cardEl) return (screenId - 1) * (homeCardWidth + 15);
      const headerEl = document.getElementById('app-header');
      const containerRect = container.getBoundingClientRect();
      const headerRect = headerEl?.getBoundingClientRect();
      const desiredCenterX =
        headerRect && headerRect.width > 0
          ? headerRect.left + headerRect.width / 2
          : containerRect.left + container.clientLeft + container.clientWidth / 2;
      const desiredLeftInContainer =
        desiredCenterX - (containerRect.left + container.clientLeft) - cardEl.offsetWidth / 2;
      return Math.max(0, Math.round(cardEl.offsetLeft - desiredLeftInContainer));
    },
    [homeCardWidth]
  );

  const scrollToHomeCard = useCallback(
    (targetId: 1 | 2 | 3, smooth = true) => {
      activeScreenRef.current = targetId;
      setActiveVideoScreen(targetId);
      const container = homeContainerRef.current;
      if (!container) return;
      const targetLeft = getCenteredScrollLeftForCard(targetId);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      isProgrammaticScrollRef.current = true;
      if (smooth) {
        container.scrollTo({
          left: targetLeft,
          behavior: 'smooth',
        });
      } else {
        container.scrollLeft = targetLeft;
      }
      scrollTimeoutRef.current = window.setTimeout(
        () => {
          const settledLeft = getCenteredScrollLeftForCard(targetId);
          if (Math.abs(container.scrollLeft - settledLeft) > 1) {
            container.scrollLeft = settledLeft;
          }
          isProgrammaticScrollRef.current = false;
          evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
        },
        smooth ? 520 : 60
      );
    },
    [getCenteredScrollLeftForCard]
  );

  // Căn giữa Màn hình mặc định (Màn hình 2) ngay khi mount xong
  useLayoutEffect(() => {
    if (!hasInitializedScrollRef.current && homeContainerWidth > 0) {
      hasInitializedScrollRef.current = true;
      scrollToHomeCard(activeScreenRef.current, false);
    }
  }, [homeContainerWidth, scrollToHomeCard]);

  // Giữ thẻ đang chọn luôn căn giữa thẳng hàng với #app-header khi resize
  useEffect(() => {
    const container = homeContainerRef.current;
    if (!container || isProgrammaticScrollRef.current) return;
    const raf = requestAnimationFrame(() => {
      const expectedLeft = getCenteredScrollLeftForCard(activeScreenRef.current);
      if (Math.abs(container.scrollLeft - expectedLeft) > 1) {
        container.scrollLeft = expectedLeft;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [homeCardWidth, homeContainerWidth, getCenteredScrollLeftForCard]);

  // Đồng bộ trạng thái màn hình hiện tại với Footer Prev/Next
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 0, slide: activeVideoScreen - 1 },
      })
    );
  }, [activeVideoScreen]);

  // Lắng nghe sự kiện điều hướng slide từ Footer / Header
  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (
        detail &&
        (detail.tabIndex === undefined || detail.tabIndex === 0) &&
        typeof detail.slide === 'number'
      ) {
        const clampedSlide = Math.max(0, Math.min(2, detail.slide));
        const targetId = (clampedSlide + 1) as 1 | 2 | 3;
        setIsIntroMode(false);
        setPlaybackMode('idle');
        setIsMuted(true);
        scrollToHomeCard(targetId, true);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [scrollToHomeCard]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Mở khóa preload thẻ lân cận sau khi thẻ trung tâm sẵn sàng hoặc sau 1.4s để ưu tiên băng thông
  useEffect(() => {
    setActiveVideoReady(false);
    const activeEl = videoRefs.current[activeVideoScreen];
    if (activeEl && activeEl.readyState >= 2) {
      setActiveVideoReady(true);
      return;
    }
    const priorityUnlockTimer = window.setTimeout(() => {
      setActiveVideoReady(true);
    }, 1400);
    return () => window.clearTimeout(priorityUnlockTimer);
  }, [activeVideoScreen, playbackMode, isIntroMode]);

  // Kiểm tra stall cho thẻ ưu tiên (active & adjacent); thẻ ở xa preload="none" không ép fallback sớm
  useEffect(() => {
    const timers: number[] = [];
    VIDEO_SCREENS.forEach((screen) => {
      const distance = Math.abs(screen.id - activeVideoScreen);
      if (distance > 1) return;
      if (distance === 1 && !activeVideoReady) return;
      const isActive = screen.id === activeVideoScreen;
      const stage = videoFallbackStages[screen.id] ?? 0;
      if (stage >= 2) return;
      const { activeUrl, driveAltUrl, backupUrl } = getVideoUrlsForScreen(screen, isActive);
      if (activeUrl === backupUrl) return;

      const timer = window.setTimeout(() => {
        const el = videoRefs.current[screen.id];
        if (el && el.readyState < 2) {
          setVideoFallbackStages((prev) => ({
            ...prev,
            [screen.id]: stage === 0 && driveAltUrl ? 1 : 2,
          }));
        }
      }, isActive ? 4200 : 6000);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [activeVideoScreen, activeVideoReady, playbackMode, isIntroMode, videoFallbackStages]);

  // Quản lý phát theo mức độ ưu tiên: thẻ active phát ngay, thẻ lân cận phát sau khi thẻ chính sẵn sàng, thẻ xa tạm dừng tiết kiệm băng thông
  useEffect(() => {
    VIDEO_SCREENS.forEach((screen) => {
      const el = videoRefs.current[screen.id];
      if (!el) return;
      const isActive = screen.id === activeVideoScreen;
      const distance = Math.abs(screen.id - activeVideoScreen);
      const shouldMute = isActive ? isMuted : true;
      el.defaultMuted = shouldMute;
      el.muted = shouldMute;

      if (isActive) {
        if (!isIntroMode && playbackMode === 'idle') {
          el.loop = true;
          if (el.paused) el.play().catch(() => {});
        }
      } else if (distance === 1 && activeVideoReady) {
        el.loop = true;
        if (el.paused) el.play().catch(() => {});
      } else if (distance > 1) {
        if (!el.paused) el.pause();
      }
    });
  }, [activeVideoScreen, activeVideoReady, isMuted, isIntroMode, playbackMode]);

  // Tự động quay về idle nếu ở chế độ transition
  useEffect(() => {
    if (playbackMode === 'transition') {
      const fallbackTimer = window.setTimeout(() => {
        setPlaybackMode('idle');
      }, 4000);
      return () => window.clearTimeout(fallbackTimer);
    }
  }, [playbackMode, activeVideoScreen]);

  const handleSelectScreen = useCallback(
    (nextScreenId: 1 | 2 | 3) => {
      if (nextScreenId === activeScreenRef.current && playbackMode === 'idle' && !isIntroMode) {
        return;
      }
      SoundEngine.playGlassChime();
      setIsIntroMode(false);
      setPlaybackMode('idle');
      setIsMuted(true);
      setIsPlaying(true);
      setCurrentTime('0:00');
      setDuration('0:00');
      setProgressPct(0);
      setVideoFallbackStages((prev) => ({ ...prev, [nextScreenId]: 0 }));

      const prevVideo = videoRefs.current[activeScreenRef.current];
      if (prevVideo) {
        prevVideo.muted = true;
        prevVideo.loop = true;
      }

      scrollToHomeCard(nextScreenId, true);
      const target = VIDEO_SCREENS[nextScreenId - 1];
      showToast(
        isEn
          ? `Switching to ${target.label} · ${target.title}`
          : `Đang chuyển sang ${target.label} · ${target.title}`
      );
    },
    [playbackMode, isIntroMode, scrollToHomeCard, showToast, isEn]
  );

  const handlePrevVideoScreen = useCallback(() => {
    const next = (activeVideoScreen === 1 ? 3 : activeVideoScreen - 1) as 1 | 2 | 3;
    handleSelectScreen(next);
  }, [activeVideoScreen, handleSelectScreen]);

  const handleNextVideoScreen = useCallback(() => {
    const next = (activeVideoScreen === 3 ? 1 : activeVideoScreen + 1) as 1 | 2 | 3;
    handleSelectScreen(next);
  }, [activeVideoScreen, handleSelectScreen]);

  const handleHomeContainerScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const container = homeContainerRef.current;
    if (!container) return;
    const ids: Array<1 | 2 | 3> = [1, 2, 3];
    let closestId: 1 | 2 | 3 = activeScreenRef.current;
    let closestDist = Number.POSITIVE_INFINITY;
    ids.forEach((id) => {
      const dist = Math.abs(container.scrollLeft - getCenteredScrollLeftForCard(id));
      if (dist < closestDist) {
        closestDist = dist;
        closestId = id;
      }
    });
    if (closestId !== activeScreenRef.current) {
      activeScreenRef.current = closestId;
      setIsIntroMode(false);
      setPlaybackMode('idle');
      setIsMuted(true);
      setActiveVideoScreen(closestId);
    }
  }, [getCenteredScrollLeftForCard]);

  // Hỗ trợ vuốt cảm ứng (Touch Swipe) mượt mà cho track Trang chủ trên mobile/tablet
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isIntroMode || e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchSwipeRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        isHorizontal: false,
      };
    },
    [isIntroMode]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const state = touchSwipeRef.current;
    if (!state || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - state.x;
    const dy = touch.clientY - state.y;
    if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      state.isHorizontal = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const state = touchSwipeRef.current;
      touchSwipeRef.current = null;
      if (!state || isIntroMode || e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - state.x;
      const dy = touch.clientY - state.y;
      const elapsed = Date.now() - state.time;

      const isQuickFlick = Math.abs(dx) >= 24 && elapsed <= 260;
      const isClearSwipe = Math.abs(dx) >= 42 || isQuickFlick;
      if (!isClearSwipe || Math.abs(dx) <= Math.abs(dy) * 1.15) return;

      if (dx < 0 && activeScreenRef.current < 3) {
        handleSelectScreen((activeScreenRef.current + 1) as 1 | 2 | 3);
      } else if (dx > 0 && activeScreenRef.current > 1) {
        handleSelectScreen((activeScreenRef.current - 1) as 1 | 2 | 3);
      }
    },
    [isIntroMode, handleSelectScreen]
  );

  // Điều hướng 3 màn hình trang chủ bằng phím mũi tên Trái / Phải
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (isIntroMode) return;
      if (e.key === 'ArrowLeft') {
        handlePrevVideoScreen();
      } else if (e.key === 'ArrowRight') {
        handleNextVideoScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntroMode, handlePrevVideoScreen, handleNextVideoScreen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const handleTimeUpdate = (screenId: 1 | 2 | 3) => {
    if (screenId !== activeVideoScreen || !isIntroMode) return;
    const video = videoRefs.current[screenId];
    if (!video) return;
    setCurrentTime(formatTime(video.currentTime));
    if (video.duration && !isNaN(video.duration)) {
      setDuration(formatTime(video.duration));
      setProgressPct((video.currentTime / video.duration) * 100);
    }
  };

  const handleCancelIntro = () => {
    const video = videoRefs.current[activeVideoScreen];
    setVideoFallbackStages((prev) => ({ ...prev, [activeVideoScreen]: 0 }));
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

  const handleEnded = (screenId: 1 | 2 | 3) => {
    if (screenId !== activeVideoScreen) return;
    if (playbackMode === 'transition') {
      setPlaybackMode('idle');
    } else if (playbackMode === 'play' || isIntroMode) {
      handleCancelIntro();
    }
  };

  const handlePlayIntro = () => {
    const video = videoRefs.current[activeVideoScreen];
    setVideoFallbackStages((prev) => ({ ...prev, [activeVideoScreen]: 0 }));
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

  const handleTogglePlay = () => {
    const video = videoRefs.current[activeVideoScreen];
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
    const video = videoRefs.current[activeVideoScreen];
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (video) {
      video.muted = nextMuted;
    }
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
    const video = videoRefs.current[activeVideoScreen];
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = pct * video.duration;
  };

  const handleQuickNavigateAbout = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPageFlip();
    onNavigatePage?.(2);
  };

  const handleQuickNavigateContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPageFlip();
    onNavigateContact();
  };

  return (
    <div className="relative w-full max-w-full min-w-0 min-h-0 h-full flex-1 flex flex-col overflow-hidden">
      {/* Khung cuộn ngang chứa 3 Main Card (1 Main Card cho mỗi màn hình, hỗ trợ vuốt cảm ứng) */}
      <div
        ref={homeContainerRef}
        id="home-page-container"
        data-element-name="Trang chủ cá nhân"
        data-element-type="container"
        data-element-page="home"
        data-element-parent="global-content-viewport"
        data-no-wheel-horizontal="true"
        onScroll={handleHomeContainerScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        suppressHydrationWarning
        style={{
          touchAction: 'pan-y',
          ['--about-card-w' as any]: `${homeCardWidth}px`,
          ['--about-side-inset' as any]: `${homeSideInset}px`,
        }}
        className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-hidden overflow-y-hidden no-scrollbar select-none font-play rounded-none box-border"
      >
        <div
          id="home-cards-track"
          data-element-name="Track căn giữa Trang chủ"
          data-element-type="container"
          data-element-page="home"
          data-element-parent="home-page-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
            paddingLeft: `${homeSideInset}px`,
            paddingRight: `${homeSideInset}px`,
            height: '100%',
            minHeight: '100%',
            width: 'max-content',
            boxSizing: 'border-box',
          }}
          className="page-cards-track flex flex-row items-stretch gap-[15px] h-full min-h-full box-border"
        >
          {VIDEO_SCREENS.map((screen) => {
            const isActive = activeVideoScreen === screen.id;
            const preloadPriority = getPreloadPriority(screen.id);
            const { activeUrl, driveAltUrl } = getVideoUrlsForScreen(screen, isActive);
            const stage = videoFallbackStages[screen.id] ?? 0;
            const heroCardId =
              screen.id === 1
                ? 'home-intro-card'
                : screen.id === 2
                  ? 'home-stats-card'
                  : 'home-capabilities-card';

            return (
              <div
                key={screen.id}
                id={`home-main-card-${screen.id}`}
                data-main-card="true"
                data-layer-level="1"
                data-element-name={`Thẻ chính Trang chủ - ${screen.label}`}
                data-element-type="card"
                data-element-page="home"
                data-element-parent="home-cards-track"
                onClickCapture={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectScreen(screen.id);
                  }
                }}
                title={
                  !isActive
                    ? isEn
                      ? `Click to focus ${screen.label}`
                      : `Click để chuyển ${screen.label} ra chính giữa màn hình`
                    : undefined
                }
                style={{
                  width: `${homeCardWidth}px`,
                  maxWidth: '1250px',
                  minWidth: `${homeCardWidth}px`,
                  flex: `0 0 ${homeCardWidth}px`,
                  height: '100%',
                  minHeight: '100%',
                  padding: 'var(--main-card-padding, 15px)',
                  gap: '15px',
                  borderRadius: 'var(--radius-main, 30px)',
                }}
                className={cn(
                  'page-main-card home-screen-main-card relative shrink-0 h-full min-h-full flex flex-col justify-between overflow-hidden select-none font-play box-border transition-opacity duration-300',
                  !isActive ? 'cursor-pointer opacity-80 hover:opacity-100' : 'opacity-100'
                )}
              >
                {/* Khung Video & Nội dung bên trong Main Card của màn hình */}
                <div
                  id={`home-main-content-${screen.id}`}
                  data-media-card="video"
                  data-element-name={`Khung video ${screen.label}`}
                  data-element-type="container"
                  data-element-page="home"
                  data-element-parent={`home-main-card-${screen.id}`}
                  className="home-screen-media-stage relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-between overflow-hidden rounded-[var(--radius-card,24px)] p-[15px] gap-[15px] box-border"
                  style={{
                    borderRadius: 'var(--radius-card, 24px)',
                    padding: 'var(--main-card-padding, 15px)',
                    gap: '15px',
                    background: `radial-gradient(circle at 30% 25%, ${screen.gradientFrom}55, ${screen.gradientTo}22 65%, rgba(15, 23, 42, 0.45) 100%)`,
                  }}
                >
                  {/* 1. Video nền riêng của từng Main Card với chiến lược Preload theo thứ tự ưu tiên */}
                  <div className="project-detail-banner-media absolute inset-0 w-full h-full min-w-full min-h-full z-0 overflow-hidden pointer-events-none rounded-[inherit]">
                    {isActive && driveHomeBanner && !isIntroMode ? (
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
                      <video
                        ref={(el) => {
                          videoRefs.current[screen.id] = el;
                        }}
                        key={`home-screen-${screen.id}-${stage}-${activeUrl}`}
                        autoPlay={isActive || (Math.abs(screen.id - activeVideoScreen) === 1 && activeVideoReady)}
                        muted={isActive ? isMuted : true}
                        playsInline
                        preload={preloadPriority}
                        controls={false}
                        disablePictureInPicture
                        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                        aria-hidden="true"
                        tabIndex={-1}
                        loop={!isActive || (playbackMode === 'idle' && !isIntroMode)}
                        src={activeUrl}
                        onLoadedData={() => {
                          if (isActive) setActiveVideoReady(true);
                        }}
                        onCanPlay={() => {
                          if (isActive) setActiveVideoReady(true);
                        }}
                        onTimeUpdate={() => handleTimeUpdate(screen.id)}
                        onEnded={() => handleEnded(screen.id)}
                        onPause={(e) => {
                          if (!isActive && Math.abs(screen.id - activeVideoScreen) > 1) return;
                          if (isActive && (isIntroMode || playbackMode !== 'idle')) return;
                          if (typeof document !== 'undefined' && document.hidden) return;
                          const v = e.currentTarget;
                          v.defaultMuted = true;
                          v.muted = true;
                          v.loop = true;
                          v.play().catch(() => {});
                        }}
                        onError={() => {
                          setVideoFallbackStages((prev) => {
                            const cur = prev[screen.id] ?? 0;
                            const nextStage =
                              cur === 0 && driveAltUrl ? 1 : cur < 2 ? 2 : cur;
                            return nextStage === cur ? prev : { ...prev, [screen.id]: nextStage };
                          });
                        }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: '50% 18%',
                          transform: 'translateZ(0) scale(1.02)',
                        }}
                        className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] banner-video-sharp transition-all duration-700"
                      />
                    )}
                    {/* Lớp phủ scrim dịu giữ độ tương phản chữ tốt */}
                    <div
                      className={cn(
                        'project-detail-banner-scrim absolute inset-0 pointer-events-none transition-colors duration-500 bg-gradient-to-t',
                        isDark
                          ? 'from-black/25 via-transparent to-black/10'
                          : 'from-white/10 via-transparent to-white/5'
                      )}
                    />
                  </div>

                  {/* 2. Hàng trên trong Card: Nút Drive Studio (khi active) & nhãn màn hình */}
                  {!(isActive && isIntroMode) && (
                    <div className="relative z-20 flex items-center justify-between gap-3 pointer-events-none">
                      {isActive ? (
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
                          className="theme-video-capsule ml-[48px] sm:ml-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[999px] text-xs font-bold font-play cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto shadow-md"
                        >
                          <WebIcon name="video" className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Drive Video Banner' : 'Video Banner Drive'}</span>
                          {driveHomeBanner && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          )}
                        </button>
                      ) : (
                        <span
                          className="text-xs font-semibold tracking-wide px-1 py-0.5 select-none"
                          style={{
                            color: isDark ? 'rgba(241,245,249,0.85)' : 'rgba(15,23,42,0.8)',
                            textShadow: isDark
                              ? '0 1px 4px rgba(0,0,0,0.65)'
                              : '0 1px 4px rgba(255,255,255,0.85)',
                          }}
                        >
                          {screen.label} · {screen.id} / {VIDEO_SCREENS.length}
                        </span>
                      )}

                      {isActive && (
                        <span
                          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide px-1 py-0.5 select-none tabular-nums"
                          style={{
                            color: isDark ? 'rgba(241,245,249,0.88)' : 'rgba(15,23,42,0.82)',
                            textShadow: isDark
                              ? '0 1px 6px rgba(0,0,0,0.6)'
                              : '0 1px 6px rgba(255,255,255,0.9)',
                          }}
                        >
                          {screen.label} · {screen.id}/{VIDEO_SCREENS.length}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 3. Modal điều khiển khi đang phát video thuyết minh trong Card */}
                  {isActive && isIntroMode && (
                    <div className="theme-modal-card relative z-50 w-full max-w-md max-h-full overflow-y-auto mx-auto my-auto p-3.5 rounded-[var(--radius-modal,24px)] shadow-2xl animate-fadeIn text-left pointer-events-auto">
                      <div
                        className="flex items-center justify-between pb-2 border-b"
                        style={{ borderColor: 'var(--border-subcard)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="typo-label font-bold font-play"
                            style={{ color: 'var(--text-heading, var(--text-primary))' }}
                          >
                            {isEn
                              ? `Now Playing: Executive Introduction (${screen.label})`
                              : `Đang phát: Lời Chào Giới Thiệu Chuyên Gia (${screen.label})`}
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
                          style={{
                            background: 'var(--pillar-progress-track, rgba(148, 163, 184, 0.28))',
                          }}
                          onClick={handleSeek}
                        >
                          <div
                            className="h-1.5 rounded-full transition-all duration-150 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                            style={{
                              width: `${progressPct}%`,
                              background: `linear-gradient(to right, ${screen.gradientFrom}, ${screen.gradientTo})`,
                            }}
                          />
                        </div>
                        <div
                          className="flex justify-between typo-label font-mono font-bold tabular-nums"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <span>{currentTime}</span>
                          <span>{duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="px-4 py-1.5 rounded-[999px] font-bold typo-button flex items-center gap-2 shadow-xs transition cursor-pointer active:scale-95 text-white"
                          style={{ background: screen.gradientFrom }}
                        >
                          {isPlaying ? (
                            <WebIcon name="pause" className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <WebIcon name="play" className="w-3.5 h-3.5 fill-current" />
                          )}
                          <span>
                            {isPlaying
                              ? isEn
                                ? 'Pause'
                                : 'Tạm dừng'
                              : isEn
                                ? 'Resume'
                                : 'Phát tiếp'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleToggleMute}
                          className="theme-modal-close px-4 py-1.5 rounded-[999px] font-bold typo-button flex items-center gap-2 shadow-2xs transition cursor-pointer active:scale-95"
                        >
                          {isMuted ? (
                            <WebIcon name="volume-x" className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <WebIcon name="volume-2" className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          <span>
                            {isMuted
                              ? isEn
                                ? 'Unmute'
                                : 'Bật tiếng'
                              : isEn
                                ? 'Mute'
                                : 'Tắt tiếng'}
                          </span>
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

                  {/* 4. Thẻ thông tin tổng quan nằm ở góc dưới phải bên trong chính Main Card của màn hình */}
                  {!(isActive && isIntroMode) && (
                    <div className="relative z-20 w-full flex-1 min-h-0 flex items-end justify-end pointer-events-none pt-10 sm:pt-0 sm:px-14 pb-6 sm:pb-5">
                      <div className="pointer-events-none flex items-end justify-end w-fit max-w-full ml-auto">
                        <div
                          id={heroCardId}
                          data-element-name={`Thẻ thông tin tổng quan ${screen.label}`}
                          data-element-type="card"
                          data-element-page="home"
                          data-element-parent={`home-main-card-${screen.id}`}
                          data-section-card="true"
                          data-card-theme-sync="true"
                          className="home-hero-card bento-card layered-card pointer-events-auto p-[15px] rounded-[var(--radius-card,24px)] relative max-h-full overflow-y-auto overflow-x-hidden glass-scrollbar group transition-all duration-300 w-fit max-w-full sm:max-w-fit text-left"
                        >
                          <div className="relative z-10 flex flex-col gap-[15px] w-full sm:w-fit">
                            <div className="flex items-center justify-between gap-3">
                              <div
                                className="home-hero-badge inline-flex items-center gap-2 typo-h4 font-bold tracking-tight px-0 py-0 border-0 bg-transparent shadow-none"
                                style={{
                                  color: `var(--card-synced-accent, var(--color-primary, ${screen.accentColor}))`,
                                }}
                              >
                                <span>{screen.heroBadge}</span>
                              </div>
                            </div>

                            <div
                              className="card-header-sync flex items-center gap-2 flex-wrap sm:flex-nowrap"
                              style={{
                                color: `var(--card-synced-accent, var(--text-heading, ${screen.accentColor}))`,
                              }}
                            >
                              <WebIcon
                                name={screen.heroIcon || 'sparkles'}
                                className="w-5 h-5 shrink-0"
                                style={{
                                  color: `var(--card-synced-accent, var(--text-heading, ${screen.accentColor}))`,
                                }}
                              />
                              <h3
                                className="card-title card-title-synced typo-h3 font-play tracking-tight leading-tight whitespace-normal"
                                data-card-title="true"
                                style={{
                                  color: `var(--card-synced-accent, var(--text-heading, ${screen.accentColor}))`,
                                }}
                              >
                                {screen.title}
                              </h3>
                            </div>

                            <p
                              className="typo-body-sm font-medium leading-relaxed max-w-xs sm:max-w-sm"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {screen.description}
                            </p>

                            {/* Nhóm điều khiển: Nút hành động phụ chuyển nhanh Giới thiệu / Liên hệ + Nút Phát Video */}
                            <div
                              id={isActive ? 'el-p0-group-container' : `home-group-container-${screen.id}`}
                              data-element-name="Nhóm điều khiển phát video và chuyển nhanh trang"
                              data-element-type="container"
                              data-element-page="home"
                              className="pt-0.5 flex flex-wrap items-center justify-end gap-2 w-full"
                            >
                              {/* Nút hành động phụ: Giới thiệu */}
                              <button
                                id={isActive ? 'home-quick-about-btn' : `home-quick-about-btn-${screen.id}`}
                                type="button"
                                onClick={handleQuickNavigateAbout}
                                title={isEn ? 'Open Executive Profile (About)' : 'Xem chi tiết Hồ sơ Giới thiệu'}
                                aria-label={isEn ? 'About Profile' : 'Giới thiệu'}
                                className="theme-modal-close inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[999px] typo-button font-bold font-play whitespace-nowrap shrink-0 cursor-pointer pointer-events-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                              >
                                <WebIcon name="user" className="w-3.5 h-3.5 shrink-0" />
                                <span>{isEn ? 'About' : 'Giới thiệu'}</span>
                              </button>

                              {/* Nút hành động phụ: Liên hệ */}
                              <button
                                id={isActive ? 'home-quick-contact-btn' : `home-quick-contact-btn-${screen.id}`}
                                type="button"
                                onClick={handleQuickNavigateContact}
                                title={isEn ? 'Go to Contact & Booking' : 'Đặt lịch hẹn & Liên hệ trực tiếp'}
                                aria-label={isEn ? 'Contact' : 'Liên hệ'}
                                className="theme-modal-close inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-[999px] typo-button font-bold font-play whitespace-nowrap shrink-0 cursor-pointer pointer-events-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                              >
                                <WebIcon name="calendar" className="w-3.5 h-3.5 shrink-0" />
                                <span>{isEn ? 'Contact' : 'Liên hệ'}</span>
                              </button>

                              {/* Nút chính: Phát Video giới thiệu */}
                              <div
                                id={isActive ? 'el-p0-div-78' : `home-play-capsule-${screen.id}`}
                                role="button"
                                tabIndex={0}
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
                                title={
                                  isIntroMode
                                    ? 'Dừng phát video giới thiệu'
                                    : 'Phát video giới thiệu chuyên gia'
                                }
                                aria-label={
                                  isIntroMode
                                    ? 'Dừng phát video giới thiệu'
                                    : 'Phát video giới thiệu chuyên gia'
                                }
                                style={{ borderRadius: '999px' }}
                                className={`theme-capsule-btn video-play-btn video-play-btn--home relative z-10 inline-flex items-center gap-2 px-2.5 py-1.5 min-h-[40px] !rounded-[999px] rounded-[999px] transition-all duration-200 cursor-pointer pointer-events-auto shrink-0 whitespace-nowrap active:scale-[0.98] select-none font-play ${
                                  isActive && isIntroMode ? 'is-playing' : ''
                                }`}
                              >
                                <span
                                  id={isActive ? 'el-p0-btn-sound-toggle' : `home-sound-toggle-${screen.id}`}
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
                                    !(isActive ? isMuted : true)
                                      ? 'text-current shadow-xs'
                                      : 'is-muted text-white shadow-md'
                                  }`}
                                  title={!(isActive ? isMuted : true) ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                                  aria-label={!(isActive ? isMuted : true) ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                                >
                                  <span className="flex items-center justify-center">
                                    {!(isActive ? isMuted : true) ? (
                                      <WebIcon name="volume-2" className="w-3.5 h-3.5 text-current" />
                                    ) : (
                                      <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
                                    )}
                                  </span>
                                </span>

                                <span
                                  className="w-[1px] h-4 bg-current opacity-25 shrink-0 mx-0.5"
                                  aria-hidden="true"
                                />

                                <span
                                  id={isActive ? 'el-p0-btn-intro-toggle' : `home-intro-toggle-${screen.id}`}
                                  className="inline-flex items-center justify-center gap-2 pr-1.5 py-0.5 rounded-[999px] font-bold typo-button tracking-wide transition-all duration-200 font-play text-current"
                                >
                                  <span className="flex items-center justify-center">
                                    {!(isActive && isIntroMode) ? (
                                      <WebIcon
                                        name="play"
                                        className="w-4 h-4 fill-current text-current shrink-0"
                                        style={{ height: '16px', width: '16px' }}
                                      />
                                    ) : (
                                      <WebIcon
                                        name="cancel"
                                        className="w-4 h-4 stroke-[2.8] text-current shrink-0"
                                        style={{ height: '16px', width: '16px' }}
                                      />
                                    )}
                                  </span>
                                  <span
                                    className="font-bold typo-button truncate font-play text-left text-current"
                                    style={{ textAlign: 'left' }}
                                  >
                                    {isActive && isIntroMode
                                      ? isEn
                                        ? 'Stop Video'
                                        : 'Dừng phát'
                                      : isEn
                                        ? 'Play Video'
                                        : 'Phát Video'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lớp điều khiển nổi căn theo thẻ chính ở giữa: Nút Trái/Phải & Dock chuyển 3 Main Card */}
      {!isIntroMode && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-stretch justify-center overflow-hidden">
          <div
            className="relative h-full max-w-full pointer-events-none"
            style={{ width: `${homeCardWidth}px` }}
          >
            <button
              id="el-p0-button-1"
              data-element-id="el-p0-button-1"
              type="button"
              onClick={handlePrevVideoScreen}
              title="Màn hình trước (Chuyển màn hình video)"
              aria-label="Màn hình trước"
              className="nav-arrow-btn theme-prev-next-btn absolute left-[26px] sm:left-[26px] top-[26px] sm:top-1/2 sm:-translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-md"
            >
              <WebIcon
                name="chevron-left"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform"
              />
            </button>

            <button
              id="el-p0-button-2"
              data-element-id="el-p0-button-2"
              type="button"
              onClick={handleNextVideoScreen}
              title="Màn hình kế tiếp (Chuyển màn hình video)"
              aria-label="Màn hình kế tiếp"
              className="nav-arrow-btn theme-prev-next-btn absolute right-[26px] sm:right-[26px] top-[26px] sm:top-1/2 sm:-translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto shadow-md"
            >
              <WebIcon
                name="chevron-right"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform"
              />
            </button>

            <div className="absolute bottom-[22px] left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
              <div
                id="el-p0-div-16"
                data-element-id="el-p0-div-16"
                data-element-name="Thanh chuyển đổi màn hình trang chủ"
                data-element-type="card"
                data-element-page="home"
                className="theme-screen-switcher-dock pointer-events-auto inline-flex items-center gap-1 !rounded-[999px] border select-none transition-all duration-300 px-2 py-1 m-0"
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
          </div>
        </div>
      )}
    </div>
  );
};
