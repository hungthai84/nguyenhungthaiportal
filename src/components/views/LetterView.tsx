'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { WebIcon } from '@/components/ui/WebIcon';
import { Modal } from '@/components/ui/Modal';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { speakSiteText, stopActiveSpeech, VOICE_CHANGE_EVENT, getSavedVoiceURI, findBestVoice, findBestEnglishVoice, saveDefaultVoiceURI } from '@/utils/speechVoice';
import { useToast } from '@/components/ui/Toast';
import { formatCardTitle, cn } from '@/lib/utils';
import { getSavedMutedPref, saveMutedPref, AUDIO_PREF_EVENT } from '@/utils/audioPreference';
import {
  CAREER_MILESTONES_DATA,
  CORE_VALUES_DATA,
  OPERATIONAL_PRINCIPLES_DATA,
  CareerMilestoneItem,
} from '@/data/letterData';
import { SiteTheme } from '@/types';
import { useTheme } from '@/hooks/useTheme';

// Video thuyết minh Thư Ngỏ (Cloudinary Transition Studio)
export const LETTER_SLIDE_1_VIDEO_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793040322/transition-studio-take_24.mp4';

// Video Màn hình 2 từ Trang Chủ (Chân Dung Chuyên Gia & Lời Chào)
export const HOME_SCREEN_2_IDLE_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302150/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4';
export const HOME_SCREEN_2_INTRO_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793541818/Chinh_sua.mp4';

// Authentic Signature image for Nguyễn Hùng Thái
const SIGNATURE_IMAGE_URL =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/v1794826442/Ch%E1%BB%AF_k%C3%BD.png';

const SignatureSvg = () => (
  <img
    src={SIGNATURE_IMAGE_URL}
    alt="Chữ ký Nguyễn Hùng Thái"
    referrerPolicy="no-referrer"
    className="h-12 sm:h-14 w-auto max-w-[180px] sm:max-w-[220px] object-contain object-left bg-transparent border-0 p-0 shadow-none select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]"
  />
);

// 8 Thương hiệu từng đồng hành lấy trực tiếp từ trang kinh nghiệm (Experience)
const EXPERIENCE_BRANDS_MARQUEE = [
  { id: 'mobifone', company: 'MobiFone', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842198/Kinh%20nghi%E1%BB%87m/Logo_Mobifone.png' },
  { id: 'v247', company: 'Viễn Liên V247', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842199/Kinh%20nghi%E1%BB%87m/Logo_V247.png' },
  { id: 'lbc', company: 'LBC – HTVC', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842200/Kinh%20nghi%E1%BB%87m/Logo_LBC.png' },
  { id: 'ved', company: 'VED (Garena / Shopee)', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842328/Kinh%20nghi%E1%BB%87m/Logo_VED.png' },
  { id: 'prudential', company: 'Prudential Việt Nam', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842246/Kinh%20nghi%E1%BB%87m/Logo_Prudential.png' },
  { id: 'momo', company: 'Ví MoMo', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842331/Kinh%20nghi%E1%BB%87m/Logo_Momo.png' },
  { id: 'finviet', company: 'Finviet (Ví ECO)', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842205/Kinh%20nghi%E1%BB%87m/Logo_Finviet.png' },
  { id: 'challenge', company: 'Sẵn sàng thử thách mới', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842335/Kinh%20nghi%E1%BB%87m/Logo_PowerService.png' },
];

// Map icon string name to WebIcon name
const getMilestoneIconName = (name: string): string => {
  switch (name) {
    case 'Signal':
      return 'signal';
    case 'Headset':
      return 'headphones';
    case 'Tv':
      return 'tv';
    case 'Gamepad2':
      return 'gamepad';
    case 'ShoppingBag':
    case 'ShoppingCart':
      return 'shopping-bag';
    case 'ShieldCheck':
      return 'shield';
    case 'CreditCard':
      return 'card';
    case 'Heart':
      return 'heart';
    case 'Lightbulb':
      return 'lightbulb';
    case 'BarChart2':
      return 'chart';
    case 'Users':
      return 'users';
    case 'Target':
      return 'target';
    case 'Sparkles':
      return 'sparkles';
    case 'Award':
      return 'trophy';
    case 'Rocket':
      return 'rocket';
    case 'Network':
      return 'network';
    default:
      return 'briefcase';
  }
};

// Slide sections metadata for interactive navigation
const LETTER_SECTIONS = [
  { id: 0, shortLabel: 'Thông Điệp Hợp Tác', icon: 'mail' },
  { id: 1, shortLabel: 'Sự Nghiệp 2002 - 2011', icon: 'rocket' },
  { id: 2, shortLabel: 'Sự Nghiệp 2013 - 2023', icon: 'briefcase' },
  { id: 3, shortLabel: 'Triết Lý Quản Trị', icon: 'trophy' },
];

// Interface for Video Presentation Timecode Cues
interface VideoPresentationCue {
  id: string;
  startPct: number;
  endPct: number;
  slideIndex: number;
  targetId: string;
  noteBadge: string;
  noteTitle: string;
  noteSummary: string;
  highlightKeywords: string[];
  colorPreset: 'amber' | 'cyan' | 'purple' | 'emerald' | 'rose' | 'blue';
}

// 7 Mốc Thuyết Minh Đồng Bộ Toàn Diện Video Scena AI xuyên suốt 4 Slide
const PRESENTATION_VIDEO_CUES: VideoPresentationCue[] = [
  {
    id: 'cue-0-salutation',
    startPct: 0,
    endPct: 14,
    slideIndex: 0,
    targetId: 'callout-salutation',
    noteBadge: '🤝 Lời Mở Đầu',
    noteTitle: 'Kính Chào Quý Đối Tác',
    noteSummary: 'Gửi lời chào trân trọng và lời chúc hợp tác thịnh vượng đến Quý Doanh nghiệp.',
    highlightKeywords: ['Kính chào', 'Thông điệp', 'Hợp tác'],
    colorPreset: 'amber',
  },
  {
    id: 'cue-0-exp',
    startPct: 14,
    endPct: 28,
    slideIndex: 0,
    targetId: 'bento-experience-intro',
    noteBadge: '🌟 Bề Dày 22 Năm',
    noteTitle: 'Chuyên Gia Quản Trị Dịch Vụ',
    noteSummary: 'Hơn hai thập kỷ kiên định xây dựng, vận hành và chuẩn hóa hệ thống CSKH đa ngành.',
    highlightKeywords: ['Nguyễn Hùng Thái', '22 năm kinh nghiệm', 'xây dựng, vận hành'],
    colorPreset: 'cyan',
  },
  {
    id: 'cue-0-pillars',
    startPct: 28,
    endPct: 42,
    slideIndex: 0,
    targetId: 'card-core-values-pursued',
    noteBadge: '🏆 4 Giá Trị Cốt Lõi',
    noteTitle: 'Tận Tâm · Nhanh Nhạy · Đổi Mới · Phụng Sự',
    noteSummary: '4 nguyên lý định hình phong cách làm việc và kiến tạo thành công bền vững.',
    highlightKeywords: ['Quy Trình Tạo Nền Tảng', 'Con Người Tạo Giá Trị', 'Công Nghệ Tạo Đòn Bẩy'],
    colorPreset: 'emerald',
  },
  {
    id: 'cue-1-mobifone',
    startPct: 42,
    endPct: 56,
    slideIndex: 1,
    targetId: '2002',
    noteBadge: '🚀 Nền Tảng Viễn Thông',
    noteTitle: 'MobiFone (2002) & Bước Ngoặt HTV (2011)',
    noteSummary: 'Đào tạo bài bản tiêu chuẩn viễn thông, chuyển mình thành nhà quản trị toàn diện tại LBC – HTV.',
    highlightKeywords: ['MobiFone', 'Viễn Liên V247', 'LBC – Truyền hình Cáp HTV', 'chuẩn hóa quy trình'],
    colorPreset: 'blue',
  },
  {
    id: 'cue-2-shopee-garena',
    startPct: 56,
    endPct: 70,
    slideIndex: 2,
    targetId: '2013',
    noteBadge: '📦 Chuyển Đổi Số Quy Mô Lớn',
    noteTitle: 'Garena & Hành Trình Chuyển Đổi Số (2013)',
    noteSummary: 'Điều hành 129 nhân sự tại Garena, đồng hành cùng Shopee, AirPay, Gcafe và Liên Quân Mobile.',
    highlightKeywords: ['Garena', 'Shopee', 'AirPay', '129 nhân sự'],
    colorPreset: 'amber',
  },
  {
    id: 'cue-2-prudential-momo',
    startPct: 70,
    endPct: 84,
    slideIndex: 2,
    targetId: '2016',
    noteBadge: '💳 Bảo Hiểm & Tài Chính Số',
    noteTitle: 'Prudential (2016), MoMo (2018) & Ví ECO (2023)',
    noteSummary: 'Nâng chuẩn trải nghiệm khách hàng bảo hiểm và hoàn thiện hệ thống dịch vụ tài chính số hiện đại.',
    highlightKeywords: ['Prudential', 'MoMo', 'Ví ECO', 'tài chính số', 'minh bạch'],
    colorPreset: 'rose',
  },
  {
    id: 'cue-3-philosophy',
    startPct: 84,
    endPct: 100,
    slideIndex: 3,
    targetId: 'card-philosophy-gratitude',
    noteBadge: '💎 Triết Lý Phụng Sự',
    noteTitle: 'Đồng Hành & Phát Triển Bền Vững',
    noteSummary: 'Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.',
    highlightKeywords: ['Triết Lý Quản Trị', 'chân thành', 'phụng sự', 'bền vững'],
    colorPreset: 'purple',
  },
];

// Interface for AI Voice Narration Segment
interface NarrationSegment {
  id: string;
  slideIndex: number;
  targetId: string;
  label: string;
  text: string;
}

// Animated Audio Waveform Visualizer Component
const AudioWaveformVisualizer: React.FC<{
  isPlaying: boolean;
  barCount?: number;
  size?: 'sm' | 'md';
}> = ({ isPlaying, barCount = 12, size = 'md' }) => {
  const heights = [45, 85, 60, 100, 70, 95, 50, 90, 65, 100, 75, 55];
  const colors = [
    'from-blue-500 to-cyan-400',
    'from-cyan-500 to-teal-400',
    'from-indigo-500 to-blue-400',
    'from-purple-500 to-indigo-400',
    'from-rose-500 to-pink-400',
    'from-emerald-500 to-teal-400',
  ];

  return (
    <div
      className={`inline-flex items-center gap-[2.5px] ${
        size === 'sm' ? 'h-3.5' : 'h-4 sm:h-5'
      } px-1 select-none`}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }).map((_, idx) => {
        const maxH = heights[idx % heights.length];
        const colorGrad = colors[idx % colors.length];
        return (
          <span
            key={idx}
            className={`w-[2.5px] rounded-full bg-gradient-to-t ${colorGrad} transition-all duration-300 ${
              isPlaying ? 'animate-voice-bar' : 'opacity-40'
            }`}
            style={{
              height: isPlaying ? `${maxH}%` : '28%',
              animationDelay: `${(idx * 0.09).toFixed(2)}s`,
              animationDuration: `${(0.55 + (idx % 4) * 0.12).toFixed(2)}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// Animated Card Title Subcomponent
const AnimatedCardTitle: React.FC<{
  iconName: string;
  title: string;
  subtitle?: string;
  colorPreset?: 'emerald' | 'cyan' | 'purple' | 'rose' | 'orange' | 'blue';
  actionRight?: React.ReactNode;
  animateIcon?: boolean;
  matchTitleColor?: boolean;
}> = ({
  iconName,
  title,
  subtitle,
  colorPreset = 'blue',
  actionRight,
  animateIcon = false,
  matchTitleColor = false,
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-700/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      sub: 'text-emerald-700/90 dark:text-emerald-400',
    },
    cyan: {
      bg: 'bg-cyan-100/90 dark:bg-cyan-950/80 border border-cyan-200/80 dark:border-cyan-700/50',
      text: 'text-cyan-700 dark:text-cyan-300',
      sub: 'text-cyan-700/90 dark:text-cyan-400',
    },
    purple: {
      bg: 'bg-purple-100/90 dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-700/50',
      text: 'text-purple-700 dark:text-purple-300',
      sub: 'text-purple-700/90 dark:text-purple-400',
    },
    rose: {
      bg: 'bg-rose-100/90 dark:bg-rose-950/80 border border-rose-200/80 dark:border-rose-700/50',
      text: 'text-rose-700 dark:text-rose-300',
      sub: 'text-rose-700/90 dark:text-rose-400',
    },
    orange: {
      bg: 'bg-orange-100/90 dark:bg-orange-950/80 border border-orange-200/80 dark:border-orange-700/50',
      text: 'text-orange-700 dark:text-orange-300',
      sub: 'text-orange-700/90 dark:text-orange-400',
    },
    blue: {
      bg: 'bg-blue-100/90 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-700/50',
      text: 'text-blue-700 dark:text-blue-300',
      sub: 'text-blue-700/90 dark:text-blue-400',
    },
  };

  const scheme = colorMap[colorPreset] || colorMap.blue;

  return (
    <div className="w-full flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)]">
      <div className="flex flex-col gap-0.5 text-left min-w-0 flex-1">
        {/* Tiêu đề 16px in đậm, icon kích thước bằng tiêu đề (16px x 16px) */}
        <div
          className={`card-header-sync inline-flex items-center gap-2 ${scheme.text} max-w-full leading-tight`}
        >
          <span
            className={`inline-flex items-center justify-center w-[16px] h-[16px] shrink-0 ${
              animateIcon ? 'animate-[icon-floating_3s_ease-in-out_infinite]' : ''
            }`}
            style={{ width: '16px', height: '16px' }}
          >
            <WebIcon
              name={iconName}
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon"
              style={{ width: '16px', height: '16px', fontSize: '16px' }}
            />
          </span>
          <h3
            className={`card-title card-title-synced typo-h3 font-play tracking-tight ${scheme.text} break-words`}
            data-card-title="true"
          >
            {formatCardTitle(title)}
          </h3>
        </div>
        {subtitle && (
          <p className="typo-caption text-[var(--text-secondary)] leading-snug break-words">
            {subtitle}
          </p>
        )}
      </div>
      {actionRight && <div className="shrink-0">{actionRight}</div>}
    </div>
  );
};

export interface LetterViewProps {
  currentTheme?: string;
  onOpenBannerStudio?: (pageId: number) => void;
  onShowNotification: (msg: string) => void;
  onOpenMilestoneModal: (item: any) => void;
}

export const LetterView: React.FC<LetterViewProps> = ({
  currentTheme = 'light-glass',
  onOpenBannerStudio,
  onShowNotification,
  onOpenMilestoneModal,
}) => {
  const { showToast } = useToast();
  const { isDark: themeIsDark } = useTheme();

  // Saved default voice URI synchronized with AI Assistant and global system
  const GEMINI_PUCK_VOICE_URI = 'Google Vietnamese'; // Fallback
  const [currentVoiceURI, setCurrentVoiceURI] = useState<string>(GEMINI_PUCK_VOICE_URI);

  useEffect(() => {
    setCurrentVoiceURI(getSavedVoiceURI());
  }, []);

  // Chế độ hiển thị cố định 4 Slide tương tác
  const viewMode = 'slides' as const;

  // Current Theme detection
  const isDark = themeIsDark || currentTheme === 'dark-glassmorphism';

  // Chế độ thu gọn / mở rộng thanh tiện ích bên phải (Mặc định luôn hiển thị đầy đủ ở trang Thư Ngỏ)
  const [isRightDockCollapsed, setIsRightDockCollapsed] = useState<boolean>(false);

  // Floating expandable navigation control bar on hover
  const [isNavHovered, setIsNavHovered] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Selected milestone for detail modal
  const [selectedMilestone, setSelectedMilestone] = useState<CareerMilestoneItem | null>(null);

  // Collapse/Expand state for career milestones inline bilingual view
  const [expandedCard, setExpandedCard] = useState<Record<string, boolean>>({});

  // Dynamic position tracking for Right-Side Toolbar (Bám sát mép phải website right: 0, chiều cao bằng #center-card)
  const [sideToolbarPos, setSideToolbarPos] = useState<{
    top: number;
    height: number;
  }>({
    top: 0,
    height: 0,
  });
  const [isClientMounted, setIsClientMounted] = useState<boolean>(true);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

  // Slides and Presentation State
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Đồng bộ trạng thái Slide (0..3) với nút Tới trang / Qua trang ở Footer
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', { detail: { tabIndex: 1, slide: currentSlide } })
    );
  }, [currentSlide]);

  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.tabIndex === undefined || detail.tabIndex === 1) && typeof detail.slide === 'number') {
        const target = Math.max(0, Math.min(3, detail.slide));
        setSlideDirection(target >= currentSlide ? 'next' : 'prev');
        setCurrentSlide(target);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [currentSlide]);

  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const [isAutoplayPresentation, setIsAutoplayPresentation] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [narrationLanguage, setNarrationLanguage] = useState<'vi' | 'en'>('vi');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [videoProgressPct, setVideoProgressPct] = useState<number>(0);
  const [autoSyncVideoWithSlides, setAutoSyncVideoWithSlides] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  // Presentation Refs
  const isNarratingRef = useRef<boolean>(false);
  const autoAdvanceRef = useRef<boolean>(false);
  const speechRateRef = useRef<number>(1.0);
  const narrationLanguageRef = useRef<'vi' | 'en'>('vi');
  const savedVideoTimeRef = useRef<number>(0);
  const lastActiveCueIdRef = useRef<string | null>(null);
  const utteranceIdRef = useRef<number>(0);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const karaokeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const floatingVideoRef = useRef<HTMLVideoElement>(null);
  const isPausedRef = useRef<boolean>(false);

  // Floating Circle Video 2 (Màn hình 2 ở trang chủ)
  const circleVideoRef = useRef<HTMLVideoElement>(null);
  const [isCircleVideoPlaying, setIsCircleVideoPlaying] = useState<boolean>(false);
  const [circleVideoProgress, setCircleVideoProgress] = useState<number>(0);

  // Điều khiển phát Video 2 từ vòng tròn nổi và đồng bộ hiệu ứng tô chữ Thư Ngỏ
  const handleToggleCircleVideo = useCallback(() => {
    SoundEngine.playTap();
    if (!circleVideoRef.current) return;

    if (currentSlide !== 0) {
      setSlideDirection(0 > currentSlide ? 'next' : 'prev');
      setCurrentSlide(0);
    }

    if (isCircleVideoPlaying) {
      circleVideoRef.current.pause();
      setIsCircleVideoPlaying(false);
      showToast('Đã tạm dừng video 2');
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsNarrating(false);
      setIsCircleVideoPlaying(true);
      const video = circleVideoRef.current;
      video.src = HOME_SCREEN_2_INTRO_URL;
      video.loop = false;
      video.muted = false;
      video.currentTime = 0;
      video.play().then(() => {
        showToast('Đang phát video 2 và đồng bộ nội dung Thư Ngỏ 🔊');
      }).catch(() => {
        video.muted = true;
        video.play().catch(() => {});
        showToast('Đang phát video 2 (vui lòng chạm bật tiếng)');
      });
    }
  }, [currentSlide, isCircleVideoPlaying, showToast]);

  const handleCircleVideoEnded = useCallback(() => {
    setIsCircleVideoPlaying(false);
    setCircleVideoProgress(0);
    if (circleVideoRef.current) {
      circleVideoRef.current.src = HOME_SCREEN_2_IDLE_URL;
      circleVideoRef.current.loop = true;
      circleVideoRef.current.muted = true;
      circleVideoRef.current.play().catch(() => {});
    }
    showToast('Video 2 đã hoàn thành thuyết minh Thư Ngỏ');
  }, [showToast]);

  const handleCircleVideoTimeUpdate = useCallback(() => {
    if (!circleVideoRef.current) return;
    const { currentTime, duration } = circleVideoRef.current;
    if (duration > 0 && !isNaN(duration)) {
      const p = Math.min(1, Math.max(0, currentTime / duration));
      setCircleVideoProgress(p);
      setVideoProgressPct(p * 100);
    }
  }, []);

  // Hàm render karaoke từng từ/cụm từ theo tiến trình video
  const renderKaraokeWords = useCallback(
    (
      text: string,
      startRange: number,
      endRange: number,
      currentProgress: number,
      isActiveOverall: boolean
    ) => {
      if (!text) return null;
      if (!isActiveOverall) return text;

      // Nếu toàn bộ đoạn đã được đọc qua
      if (currentProgress >= endRange) {
        return (
          <span className="text-cyan-700 dark:text-cyan-300 font-bold transition-colors duration-200">
            {text}
          </span>
        );
      }

      // Nếu chưa đến mốc này
      if (currentProgress < startRange) {
        return <span>{text}</span>;
      }

      // Đang phát trong khoảng [startRange, endRange]
      const words = text.split(' ');
      const rangeSpan = Math.max(0.01, endRange - startRange);
      const subProgress = Math.max(0, Math.min(1, (currentProgress - startRange) / rangeSpan));
      const activeWordIndex = Math.floor(subProgress * words.length);

      return (
        <span>
          {words.map((w, idx) => {
            const isPast = idx < activeWordIndex;
            const isCurrent = idx === activeWordIndex;
            if (isCurrent) {
              return (
                <span
                  key={idx}
                  className="inline-block px-1 py-0.5 mx-0.5 rounded bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 text-slate-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.85)] ring-1 ring-amber-400 scale-[1.04] transition-all duration-150"
                >
                  {w}{' '}
                </span>
              );
            }
            if (isPast) {
              return (
                <span
                  key={idx}
                  className="text-cyan-600 dark:text-cyan-300 font-bold transition-colors duration-150"
                >
                  {w}{' '}
                </span>
              );
            }
            return <span key={idx}>{w} </span>;
          })}
        </span>
      );
    },
    []
  );

  // Constants / Nulls for disabled presentation features
  const activeTargetId = null;
  const [karaokeProgress, setKaraokeProgress] = useState<number>(0);
  const [isLofiAudioEnabled, setIsLofiAudioEnabled] = useState<boolean>(true);
  const [isDuckingActive, setIsDuckingActive] = useState<boolean>(false);
  const toggleLofiAudio = useCallback(() => setIsLofiAudioEnabled(prev => !prev), []);


  const clearKaraokeTimer = useCallback(() => {
    if (karaokeIntervalRef.current) {
      clearInterval(karaokeIntervalRef.current);
      karaokeIntervalRef.current = null;
    }
  }, []);

  // Cơ Chế Giảm Âm Lượng Nhạc Nền Tinh Tế (Ambient Audio Ducking Engine) - Disabled
  // useEffect(() => {
  //   if (!isLofiAudioEnabled) {
  //     AmbientSoundEngine.stop();
  //     return;
  //   }
  //
  //   if (!isAutoplayPresentation) {
  //     return;
  //   }
  //
  //   // Nhạc nền Lofi tự động giảm âm lượng khi có giọng đọc AI TTS hoặc khi video thuyết minh đang phát có tiếng
  //   const isVoiceActive = (isVideoPlaying && !isVideoMuted) || (isNarrating && !isPaused);
  //   // setIsDuckingActive(isVoiceActive);
  //
  //   if (isVoiceActive) {
  //     // Giảm âm lượng Lo-Fi xuống 12% để giọng đọc AI và thuyết minh nổi bật, rõ ràng
  //     AmbientSoundEngine.setVolume(12);
  //   } else {
  //     // Tăng âm lượng Lo-Fi trở lại mức nền thư thái 32%
  //     AmbientSoundEngine.setVolume(32);
  //   }
  // }, [isLofiAudioEnabled, isAutoplayPresentation, isVideoPlaying, isVideoMuted, isNarrating, isPaused]);

  // Lời chào chuẩn trang trọng gửi tới Quý Công ty / Quý Doanh nghiệp
  const companyDisplay = 'Quý Công ty';

  // Khôi phục cấu hình slide mặc định khi mở trang Thư Ngỏ
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedSlide = localStorage.getItem('hungthai_letter_active_slide');
      if (savedSlide !== null) {
        const parsed = parseInt(savedSlide, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 3) {
          setCurrentSlide(parsed);
        }
      }
      const savedAutoAdvance = localStorage.getItem('hungthai_letter_auto_advance');
      if (savedAutoAdvance !== null) {
        setAutoAdvance(savedAutoAdvance === 'true');
      }
      const savedRate = localStorage.getItem('hungthai_letter_speech_rate');
      if (savedRate !== null) {
        const rateParsed = parseFloat(savedRate);
        if (!isNaN(rateParsed) && rateParsed >= 0.5 && rateParsed <= 2) {
          setSpeechRate(rateParsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Lắng nghe sự kiện VOICE_CHANGE_EVENT để đồng bộ giọng đọc AI mặc định toàn hệ thống
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleVoiceChange = (e: CustomEvent<{ voiceURI: string }>) => {
      if (e.detail?.voiceURI) {
        setCurrentVoiceURI(e.detail.voiceURI);
      } else {
        setCurrentVoiceURI(getSavedVoiceURI());
      }
    };
    window.addEventListener(VOICE_CHANGE_EVENT as any, handleVoiceChange);
    return () => {
      window.removeEventListener(VOICE_CHANGE_EVENT as any, handleVoiceChange);
    };
  }, []);

  // Hàm áp dụng và lưu cấu hình làm mặc định
  const handleSaveDefaultSettings = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('hungthai_letter_active_slide', currentSlide.toString());
      localStorage.setItem('hungthai_letter_auto_advance', autoAdvance ? 'true' : 'false');
      localStorage.setItem('hungthai_letter_speech_rate', speechRate.toString());
      if (currentVoiceURI) {
        saveDefaultVoiceURI(currentVoiceURI);
      }
      SoundEngine.playTap();
      showToast(
        `Đã thiết lập Phần ${currentSlide + 1} (${LETTER_SECTIONS[currentSlide]?.shortLabel}) và Giọng đọc AI làm mặc định thành công!`
      );
    } catch (e) {
      console.warn('Could not save letter defaults:', e);
    }
  }, [currentSlide, autoAdvance, speechRate, currentVoiceURI, showToast]);

  // Sync refs with state
  useEffect(() => {
    isNarratingRef.current = isNarrating;
  }, [isNarrating]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // Xây dựng kịch bản thuyết minh Song Ngữ (Bilingual Narration: Tiếng Việt chuẩn mực & Tiếng Anh chuyên nghiệp)
  const narrationSegments = useMemo<NarrationSegment[]>(() => {
    const cleanBold = (str: string) => str.replace(/\*\*(.*?)\*\*/g, '$1');
    const isEn = narrationLanguage === 'en';

    // Slide 0: Mở đầu lời chào & Triết lý phục vụ
    const slide0Segments: NarrationSegment[] = [
      {
        id: 'seg-s0-1',
        slideIndex: 0,
        targetId: 'bento-commitment',
        label: isEn
          ? 'Cooperation Message — Opening Greeting'
          : 'Thông điệp hợp tác — Lời chào mở đầu',
        text: isEn
          ? `Warmest greetings to ${companyDisplay}! I am Nguyen Hung Thai, a Senior Customer Experience and Operations Leader with over 22 years of hands-on expertise in architecting, operating, and scaling customer service ecosystems.`
          : `Kính chào ${companyDisplay}! Tôi là Nguyễn Hùng Thái, Trưởng phòng Chăm sóc Khách hàng với hơn 22 năm kinh nghiệm trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.`,
      },
      {
        id: 'seg-s0-2',
        slideIndex: 0,
        targetId: 'bento-commitment',
        label: isEn
          ? 'Cooperation Message — Partnership & Commitment'
          : 'Thông điệp hợp tác — Đồng hành & Cam kết',
        text: isEn
          ? `I look forward to partnering with ${companyDisplay} to establish modern, customer-centric support systems that optimize operational costs and foster long-term sustainable growth. Thank you sincerely for your valuable time and attention!`
          : `Tôi mong muốn được đồng hành cùng ${companyDisplay} trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững. Xin trân trọng cảm ơn ${companyDisplay} đã dành thời gian lắng nghe!`,
      },
      {
        id: 'seg-s0-3',
        slideIndex: 0,
        targetId: 'quote-banner-slide-1',
        label: isEn ? 'Service Philosophy' : 'Phương châm phụng sự',
        text: isEn
          ? 'Service Credo: True success comes not merely from competence, but from genuine empathy and a steadfast dedication to service.'
          : 'Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.',
      },
    ];

    // Slide 1: 3 Cột mốc khởi đầu sự nghiệp (MobiFone, V247, LBC)
    const slide1Segments: NarrationSegment[] = CAREER_MILESTONES_DATA.slice(0, 4).map(
      (item) => ({
        id: `seg-s1-${item.id}`,
        slideIndex: 1,
        targetId: item.id,
        label: isEn
          ? `${item.company} (${item.yearLabelEn || item.yearLabelVi})`
          : item.milestoneTitleVi || `${item.company} (${item.yearLabelVi})`,
        text: isEn
          ? `${item.company} (${item.yearLabelEn || item.yearLabelVi}). Role: ${item.roleEn}. ${cleanBold(item.descEn)}. Key highlight: ${cleanBold(item.highlightEn)}.`
          : `${item.milestoneTitleVi || item.company}. ${cleanBold(item.descVi)}`,
      })
    );

    // Slide 2: 4 Cột mốc quản trị quy mô lớn (Garena Phần 2, Prudential, MoMo, Finviet)
    const slide2Segments: NarrationSegment[] = CAREER_MILESTONES_DATA.slice(4, 8).map(
      (item) => ({
        id: `seg-s2-${item.id}`,
        slideIndex: 2,
        targetId: item.id,
        label: isEn
          ? `${item.company} (${item.yearLabelEn || item.yearLabelVi})`
          : item.milestoneTitleVi || `${item.company} (${item.yearLabelVi})`,
        text: isEn
          ? `${item.company} (${item.yearLabelEn || item.yearLabelVi}). Role: ${item.roleEn}. ${cleanBold(item.descEn)}. Key highlight: ${cleanBold(item.highlightEn)}.`
          : `${item.milestoneTitleVi || item.company}. ${cleanBold(item.descVi)} ${
              item.descViPart2 ? cleanBold(item.descViPart2) : ''
            }`,
      })
    );

    // Slide 3: Triết lý quản trị & 4 Giá trị cốt lõi
    const slide3Segments: NarrationSegment[] = [
      {
        id: 'seg-s3-philosophy',
        slideIndex: 3,
        targetId: 'card-philosophy-gratitude',
        label: isEn ? 'Management Philosophy' : 'Triết lý quản trị',
        text: isEn
          ? 'Executive Leadership Philosophy. Over more than two decades across diverse industries, I have realized that customer service is not merely about resolving issues, but about architecting a foundation that enables sustainable business growth. I steadfastly adhere to three core pillars: Process establishes the foundation. People create real value. Technology delivers the leverage.'
          : 'Triết lý quản trị. Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững. Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi: Quy trình tạo nền tảng. Con người tạo giá trị. Công nghệ tạo đòn bẩy.',
      },
      {
        id: 'seg-s3-gratitude',
        slideIndex: 3,
        targetId: 'card-philosophy-gratitude',
        label: isEn
          ? `Dedication & Appreciation to ${companyDisplay}`
          : `Tâm niệm & Lời cảm ơn ${companyDisplay}`,
        text: isEn
          ? `Accordingly, I focus on integrating scalable CRM architectures, executive BI dashboards, AI chatbots, and smart automation workflows to boost operational throughput and empower data-driven decision making. Alongside technology, people remain the pivotal factor of enduring success. I nurture teams that listen with empathy and consistently exceed customer expectations. I eagerly look forward to joining hands with ${companyDisplay} on new horizons! Thank you sincerely!`
          : `Từ đó, tôi tập trung xây dựng các hệ thống CRM, Dashboard quản trị, AI Chatbot và các giải pháp tự động hóa, nhằm nâng cao hiệu quả vận hành, tối ưu trải nghiệm khách hàng và hỗ trợ nhà quản lý ra quyết định bằng dữ liệu. Bên cạnh công nghệ, tôi luôn xem con người là yếu tố quyết định thành công. Vì vậy, tôi chú trọng đào tạo đội ngũ biết lắng nghe, thấu hiểu và mang đến những trải nghiệm vượt mong đợi cho khách hàng. Tôi luôn tâm niệm: Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời. Tôi mong muốn được đồng hành cùng ${companyDisplay} trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững. Xin trân trọng cảm ơn ${companyDisplay} đã dành thời gian lắng nghe!`,
      },
      ...CORE_VALUES_DATA.map((val, idx) => ({
        id: `seg-s3-val-${val.number}`,
        slideIndex: 0,
        targetId: `core-val-${val.number}`,
        label: isEn
          ? `Core Value ${val.number}: ${val.titleEn}`
          : `Giá trị cốt lõi ${val.number}: ${val.titleVi}`,
        text: isEn
          ? `${idx === 0 ? 'Four guiding core values include: ' : ''}Value ${idx + 1}, ${val.titleEn}: ${val.descEn}`
          : `${
              idx === 0 ? 'Bốn giá trị cốt lõi phát triển gồm: ' : ''
            }Giá trị thứ ${idx + 1}, ${val.titleVi}: ${val.descVi}`,
      })),
    ];

    return [...slide0Segments, ...slide1Segments, ...slide2Segments, ...slide3Segments];
  }, [companyDisplay, narrationLanguage]);

  // Load browser speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (avail && avail.length > 0) {
        setVoices(avail);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      utteranceIdRef.current += 1;
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (karaokeIntervalRef.current) clearInterval(karaokeIntervalRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const stopNarration = useCallback(() => {
    utteranceIdRef.current += 1;
    clearFallbackTimer();
    clearKaraokeTimer();
    setKaraokeProgress(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
    setIsPaused(false);
    isNarratingRef.current = false;
    isPausedRef.current = false;
  }, [clearFallbackTimer, clearKaraokeTimer]);

  // Play a specific segment index and chain to the next segment
  const playSegmentAtIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= narrationSegments.length) {
        stopNarration();
        return;
      }

      const segment = narrationSegments[index];
      const currentCallId = ++utteranceIdRef.current;
      clearFallbackTimer();
      clearKaraokeTimer();
      setKaraokeProgress(0);

      setActiveSegmentIndex(index);
      setIsNarrating(true);
      setIsPaused(false);
      isNarratingRef.current = true;
      isPausedRef.current = false;

      // Automatically switch slide if segment belongs to another slide
      setCurrentSlide((prevSlide) => {
        if (prevSlide !== segment.slideIndex) {
          setSlideDirection(segment.slideIndex > prevSlide ? 'next' : 'prev');
          SoundEngine.playPageFlip();
          return segment.slideIndex;
        }
        return prevSlide;
      });

      const handleSegmentCompleted = () => {
        if (utteranceIdRef.current !== currentCallId || !isNarratingRef.current) return;
        clearFallbackTimer();
        clearKaraokeTimer();
        setKaraokeProgress(1);

        const nextIndex = index + 1;
        if (nextIndex >= narrationSegments.length) {
          stopNarration();
          return;
        }

        const nextSegment = narrationSegments[nextIndex];
        // Check if moving to a new slide section
        if (nextSegment.slideIndex !== segment.slideIndex && !autoAdvanceRef.current) {
          // Stop at end of current section if autoAdvance is disabled
          stopNarration();
          return;
        }

        playSegmentAtIndex(nextIndex);
      };

      // Estimated duration fallback in case browser TTS doesn't fire onend reliably
      const wordsCount = segment.text.split(/\s+/).length;
      const estimatedMs = Math.max(
        3500,
        Math.round(((wordsCount / 2.7) * 1000) / speechRateRef.current) + 1500
      );

      // Smooth Karaoke Word Sync progress tracker
      let elapsedMs = 0;
      const stepMs = 90;
      const speechDurationMs = Math.max(2000, estimatedMs - 1000);
      karaokeIntervalRef.current = setInterval(() => {
        if (!isNarratingRef.current || utteranceIdRef.current !== currentCallId) {
          clearKaraokeTimer();
          return;
        }
        if (isPausedRef.current) return;
        elapsedMs += stepMs;
        const pct = Math.min(0.98, elapsedMs / speechDurationMs);
        setKaraokeProgress((prev) => Math.max(prev, pct));
      }, stepMs);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(segment.text);
          const isEn = narrationLanguageRef.current === 'en';

          if (isEn) {
            utterance.lang = 'en-US';
            utterance.rate = speechRateRef.current * 0.96;
            utterance.pitch = 1.0;
            const chosenVoice = findBestEnglishVoice(voices);
            if (chosenVoice) {
              utterance.voice = chosenVoice;
            }
          } else {
            utterance.lang = 'vi-VN';
            utterance.rate = speechRateRef.current;
            utterance.pitch = 1.02;
            const chosenVoice = findBestVoice(voices);
            if (chosenVoice) {
              utterance.voice = chosenVoice;
            }
          }

          utterance.onboundary = (event) => {
            if (utteranceIdRef.current === currentCallId && segment.text.length > 0) {
              const charPct = Math.min(0.99, event.charIndex / segment.text.length);
              setKaraokeProgress((prev) => Math.max(prev, charPct));
            }
          };

          utterance.onend = () => {
            handleSegmentCompleted();
          };

          utterance.onerror = () => {
            // If speech synthesis errors or is blocked, still allow smooth visual narration fallback
            if (utteranceIdRef.current === currentCallId && isNarratingRef.current) {
              clearFallbackTimer();
              fallbackTimerRef.current = setTimeout(handleSegmentCompleted, 2600);
            }
          };

          window.speechSynthesis.speak(utterance);
          fallbackTimerRef.current = setTimeout(handleSegmentCompleted, estimatedMs);
        } catch {
          fallbackTimerRef.current = setTimeout(handleSegmentCompleted, estimatedMs);
        }
      } else {
        fallbackTimerRef.current = setTimeout(handleSegmentCompleted, estimatedMs);
      }
    },
    [narrationSegments, voices, clearFallbackTimer, clearKaraokeTimer, stopNarration]
  );

  // Phát giọng đọc AI trực tiếp cho 1 cột mốc năm bất kỳ (từ Timeline Mini hoặc Thẻ)
  const handleNarrateMilestone = useCallback(
    (milestoneId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      SoundEngine.playTap();
      const segIdx = narrationSegments.findIndex((s) => s.targetId === milestoneId);
      if (segIdx !== -1) {
        playSegmentAtIndex(segIdx);
      }
    },
    [narrationSegments, playSegmentAtIndex]
  );

  // Start or Toggle Play/Pause Voice Narration
  const handleToggleNarration = useCallback(() => {
    SoundEngine.playTap();
    if (!isNarrating) {
      // Find first segment of current slide to start reading from current slide
      const firstSegIdx = narrationSegments.findIndex((s) => s.slideIndex === currentSlide);
      playSegmentAtIndex(firstSegIdx >= 0 ? firstSegIdx : 0);
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      isPausedRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        playSegmentAtIndex(activeSegmentIndex);
      }
    } else {
      setIsPaused(true);
      isPausedRef.current = true;
      clearFallbackTimer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    }
  }, [
    isNarrating,
    isPaused,
    currentSlide,
    narrationSegments,
    activeSegmentIndex,
    playSegmentAtIndex,
    clearFallbackTimer,
  ]);

  // Cycle reading speed (0.9x -> 1.0x -> 1.15x -> 1.25x)
  const handleCycleSpeed = useCallback(() => {
    SoundEngine.playTap();
    const speeds = [0.9, 1.0, 1.15, 1.25];
    const nextIdx = (speeds.indexOf(speechRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setSpeechRate(nextSpeed);
    speechRateRef.current = nextSpeed;
    if (isNarrating && !isPaused) {
      playSegmentAtIndex(activeSegmentIndex);
    }
  }, [speechRate, isNarrating, isPaused, activeSegmentIndex, playSegmentAtIndex]);

  // Chuyển đổi ngôn ngữ giọng đọc Song Ngữ (Bilingual Narration Switcher: VI <-> EN)
  const handleToggleNarrationLanguage = useCallback(() => {
    SoundEngine.playTap();
    const nextLang: 'vi' | 'en' = narrationLanguage === 'vi' ? 'en' : 'vi';
    setNarrationLanguage(nextLang);
    narrationLanguageRef.current = nextLang;
    try {
      localStorage.setItem('hungthai_narration_lang', nextLang);
    } catch {}

    showToast(
      nextLang === 'en'
        ? '🇬🇧 Switched to Professional English Voice Narration'
        : '🇻🇳 Đã chuyển sang Giọng đọc Tiếng Việt chuẩn mực'
    );

    // Nếu đang phát thuyết minh, tự động phát lại đoạn hiện tại với ngôn ngữ mới
    if (isNarratingRef.current) {
      setTimeout(() => {
        playSegmentAtIndex(activeSegmentIndex);
      }, 150);
    }
  }, [narrationLanguage, showToast, playSegmentAtIndex, activeSegmentIndex]);

  // Chọn trực tiếp ngôn ngữ thuyết minh từ danh sách chọn
  const handleSelectNarrationLanguage = useCallback(
    (targetLang: 'vi' | 'en') => {
      SoundEngine.playTap();
      setNarrationLanguage(targetLang);
      narrationLanguageRef.current = targetLang;
      try {
        localStorage.setItem('hungthai_narration_lang', targetLang);
      } catch {}

      showToast(
        targetLang === 'en'
          ? '🇬🇧 Switched to Professional English Voice Narration'
          : '🇻🇳 Đã chuyển sang Giọng đọc Tiếng Việt chuẩn mực'
      );

      // Nếu đang phát thuyết minh, tự động phát lại đoạn hiện tại với ngôn ngữ mới
      if (isNarratingRef.current) {
        setTimeout(() => {
          playSegmentAtIndex(activeSegmentIndex);
        }, 150);
      }
      setIsLangMenuOpen(false);
    },
    [showToast, playSegmentAtIndex, activeSegmentIndex]
  );

  const handleSelectSlide = useCallback(
    (targetSlide: number) => {
      if (targetSlide === currentSlide) return;
      setSlideDirection(targetSlide > currentSlide ? 'next' : 'prev');
      setCurrentSlide(targetSlide);
      // If currently narrating, jump voice narration to the selected slide
      if (isNarratingRef.current) {
        const segIdx = narrationSegments.findIndex((s) => s.slideIndex === targetSlide);
        if (segIdx !== -1) {
          playSegmentAtIndex(segIdx);
        }
      }
    },
    [currentSlide, narrationSegments, playSegmentAtIndex]
  );

  const handlePrevSlide = useCallback(() => {
    setSlideDirection('prev');
    const targetSlide = currentSlide > 0 ? currentSlide - 1 : 3;
    setCurrentSlide(targetSlide);
    if (isNarratingRef.current) {
      const segIdx = narrationSegments.findIndex((s) => s.slideIndex === targetSlide);
      if (segIdx !== -1) playSegmentAtIndex(segIdx);
    }
  }, [currentSlide, narrationSegments, playSegmentAtIndex]);

  const handleNextSlide = useCallback(() => {
    setSlideDirection('next');
    const targetSlide = currentSlide < 3 ? currentSlide + 1 : 0;
    setCurrentSlide(targetSlide);
    if (isNarratingRef.current) {
      const segIdx = narrationSegments.findIndex((s) => s.slideIndex === targetSlide);
      if (segIdx !== -1) playSegmentAtIndex(segIdx);
    }
  }, [currentSlide, narrationSegments, playSegmentAtIndex]);

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMilestone) return;
      if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide, selectedMilestone]);

  // Floating Video Presentation Handlers & Synchronization
  const handleFloatingVideoLoadedMetadata = useCallback(() => {
    if (floatingVideoRef.current) {
      floatingVideoRef.current.muted = true;
      floatingVideoRef.current.defaultMuted = true;
      if (savedVideoTimeRef.current > 0) {
        floatingVideoRef.current.currentTime = savedVideoTimeRef.current;
      }
    }
  }, []);

  // Tắt chế độ thuyết trình tự động và mặc định mute video khi mở trang Thư Ngỏ
  useEffect(() => {
    setIsAutoplayPresentation(false);
    setIsVideoMuted(true);
    if (floatingVideoRef.current) {
      floatingVideoRef.current.muted = true;
      floatingVideoRef.current.defaultMuted = true;
    }
  }, []);

  const handleFloatingVideoTimeUpdate = useCallback(() => {
    if (!floatingVideoRef.current) return;
    const { currentTime, duration } = floatingVideoRef.current;
    if (!duration || isNaN(duration) || duration <= 0) return;
    savedVideoTimeRef.current = currentTime;
    const pct = Math.min(100, Math.max(0, (currentTime / duration) * 100));
    setVideoProgressPct(pct);

    const cue =
      PRESENTATION_VIDEO_CUES.find((c) => pct >= c.startPct && pct < c.endPct) ||
      PRESENTATION_VIDEO_CUES[PRESENTATION_VIDEO_CUES.length - 1];

    if (cue && cue.id !== lastActiveCueIdRef.current) {
      lastActiveCueIdRef.current = cue.id;
      if (autoSyncVideoWithSlides && cue.slideIndex !== currentSlide) {
        setSlideDirection(cue.slideIndex > currentSlide ? 'next' : 'prev');
        setCurrentSlide(cue.slideIndex);
        SoundEngine.playPageFlip();
      }
    }
  }, [autoSyncVideoWithSlides, currentSlide]);

  const toggleFloatingVideoPlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    SoundEngine.playTap();
    if (!floatingVideoRef.current) return;
    if (floatingVideoRef.current.paused) {
      floatingVideoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => {});
    } else {
      floatingVideoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, []);

  const toggleFloatingVideoMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    SoundEngine.playTap();
    setIsVideoMuted((prev) => {
      const next = !prev;
      if (floatingVideoRef.current) floatingVideoRef.current.muted = next;
      saveMutedPref(next);
      showToast(next ? 'Đã tắt tiếng video thuyết minh' : 'Đã bật tiếng video thuyết minh 🔊');
      return next;
    });
  }, [showToast]);

  const toggleAutoSyncVideoWithSlides = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    SoundEngine.playTap();
    setAutoSyncVideoWithSlides((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Đã bật tự động lật slide theo tiến trình video'
          : 'Đã tắt tự động lật slide theo tiến trình video'
      );
      return next;
    });
  }, [showToast]);

  // Bật / Tắt Chế Độ Thuyết Trình Tự Động Kèm Nhạc Nền Lo-Fi
  const handleToggleAutoplayPresentation = useCallback(() => {
    SoundEngine.playTap();
    if (isAutoplayPresentation) {
      setIsAutoplayPresentation(false);
      if (floatingVideoRef.current) {
        floatingVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
      // AmbientSoundEngine.stop();
      showToast('Đã dừng chế độ Thuyết trình Tự động');
    } else {
      setIsAutoplayPresentation(true);
      setAutoSyncVideoWithSlides(true);


      // Bật nhạc nền Lo-Fi 'cosmos' 432Hz thư thái
      // if (isLofiAudioEnabled) {
      //   AmbientSoundEngine.startTrack('cosmos', 32);
      // }

      // Khởi chạy video thuyết minh và đồng bộ âm thanh
      if (floatingVideoRef.current) {
        floatingVideoRef.current.muted = false;
        setIsVideoMuted(false);
        saveMutedPref(false);
        floatingVideoRef.current
          .play()
          .then(() => setIsVideoPlaying(true))
          .catch(() => {});
      }
      showToast('Bắt đầu Thuyết trình Tự động kèm Nhạc nền Lo-Fi (4 Slide)');
    }
  }, [isAutoplayPresentation, showToast]);

  // Bật / Tắt riêng Nhạc Nền Lo-Fi
  // const toggleLofiAudio = useCallback((e?: React.MouseEvent) => {
  //   if (e) e.stopPropagation();
  //   SoundEngine.playTap();
  //   setIsLofiAudioEnabled((prev) => {
  //     const next = !prev;
  //     if (next) {
  //       AmbientSoundEngine.startTrack('cosmos', isDuckingActive ? 12 : 32);
  //       showToast('Đã bật Nhạc Nền Lo-Fi Thư Thái (Ambient Pad 432Hz)');
  //     } else {
  //       AmbientSoundEngine.stop();
  //       showToast('Đã tắt Nhạc Nền Lo-Fi');
  //     }
  //     return next;
  //   });
  // }, [isDuckingActive, showToast]);

  // Active Video Cue based on playback progress percentage
  const activeVideoCue: any = null;

  // Tiến trình nội bộ của Cue Video Scena AI hiện tại (từ 0.0 đến 1.0)
  const currentCueProgress = useMemo(() => {
    if (!activeVideoCue) return 0;
    const span = activeVideoCue.endPct - activeVideoCue.startPct;
    if (span <= 0) return 0;
    return Math.max(0, Math.min(1, (videoProgressPct - activeVideoCue.startPct) / span));
  }, [videoProgressPct, activeVideoCue]);

  // Tiến trình Karaoke đồng bộ hiệu dụng (cả khi phát video Scena AI lẫn giọng đọc TTS)
  const effectiveKaraokeProgress = isVideoPlaying ? currentCueProgress : karaokeProgress;

  // Active segment metadata: Kết hợp cả AI Voice TTS lẫn Video Timecode Cues
  const currentSegment = narrationSegments[activeSegmentIndex] || narrationSegments[0];
  // const activeTargetId = isNarrating
  //   ? currentSegment?.targetId
  //   : isVideoPlaying
  //   ? activeVideoCue?.targetId
  //   : null;
  const progressPercent = isNarrating
    ? Math.round(((activeSegmentIndex + 1) / narrationSegments.length) * 100)
    : isVideoPlaying
    ? Math.round(videoProgressPct)
    : 0;

  // Dynamic theme-aware Card classes synced with global theme tokens
  const getGlassCardClass = useCallback(() => {
    return 'bento-card glass-card transition-all duration-300';
  }, []);

  // Đếm tổng số cụm từ khóa in đậm (**...**) trong đoạn văn
  const countBoldKeywords = useCallback((text?: string) => {
    if (!text) return 0;
    const tokens = text.split('**');
    return Math.floor(tokens.length / 2);
  }, []);

  // Feature 5: Helper format in đậm kết hợp Hiệu Ứng Highlight Từ Khóa Theo Giọng Đọc (Karaoke Word Sync)
  const renderFormattedText = useCallback(
    (
      text: string,
      options?: {
        isCardReading?: boolean;
        keywordOffset?: number;
        totalKeywords?: number;
      }
    ) => {
      if (!text) return '';
      const tokens = text.split('**');
      const isCardReading = options?.isCardReading ?? false;
      const keywordOffset = options?.keywordOffset ?? 0;
      const totalKeywords = options?.totalKeywords ?? Math.max(1, Math.floor(tokens.length / 2));
      const activeKwIndex = isCardReading
        ? Math.min(totalKeywords - 1, Math.floor(effectiveKaraokeProgress * totalKeywords))
        : -1;

      return tokens.map((part, i) => {
        if (i % 2 === 1) {
          const kwIdx = keywordOffset + Math.floor(i / 2);
          const isCurrentKeyword = isCardReading && kwIdx === activeKwIndex;
          const isPassedKeyword = isCardReading && kwIdx < activeKwIndex;

          return (
            <strong
              key={i}
              className={
                isCurrentKeyword
                  ? 'font-bold text-slate-950 dark:text-amber-100 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 dark:from-amber-500/45 dark:via-yellow-400/35 dark:to-amber-500/45 px-1.5 py-0.5 rounded-[14px] ring-2 ring-amber-400 dark:ring-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.75)] transition-all duration-300 inline-block scale-[1.03]'
                  : isPassedKeyword
                  ? 'font-bold text-emerald-700 dark:text-cyan-300 underline decoration-emerald-400/80 dark:decoration-cyan-400/80 decoration-2 underline-offset-2 transition-colors duration-300'
                  : 'font-bold text-slate-900 dark:text-white transition-colors duration-300'
              }
            >
              {part}
            </strong>
          );
        }
        return part;
      });
    },
    [effectiveKaraokeProgress]
  );

  // Feature 3: Nút Tải Bản PDF "Thư Ngỏ Nguyễn Hùng Thái" Chuẩn A4
  const handleExportLetterPDF = useCallback(() => {
    if (typeof window === 'undefined') return;
    SoundEngine.playTap();
    showToast(`Đang khởi tạo bản PDF Chuẩn A4 gửi tới ${companyDisplay}...`);

    const formatHtmlBold = (str?: string) =>
      (str || '').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0f172a;font-weight:700;">$1</strong>');

    const milestonesHtml = CAREER_MILESTONES_DATA.map(
      (m) => `
      <div class="milestone-item">
        <div class="milestone-header">
          <span class="milestone-title" style="color:${m.color}">${m.milestoneTitleVi || m.company}</span>
          <span class="milestone-role">${m.roleVi} (${m.yearLabelVi})</span>
        </div>
        <p class="milestone-desc">${formatHtmlBold(m.descVi)}</p>
        ${m.descViPart2 ? `<p class="milestone-desc" style="margin-top:6px;">${formatHtmlBold(m.descViPart2)}</p>` : ''}
      </div>
    `
    ).join('');

    const printHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Thư Ngỏ Nguyễn Hùng Thái - ${companyDisplay}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Play', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.55;
      font-size: 12.5px;
      background: #ffffff;
    }
    .page-container {
      max-width: 780px;
      margin: 0 auto;
      padding: 4px 0;
    }
    .letterhead {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #1e40af;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .author-name {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      text-transform: none;
      letter-spacing: 0.02em;
    }
    .author-title {
      font-size: 13px;
      font-weight: 700;
      color: #1d4ed8;
      margin-top: 2px;
    }
    .contact-meta {
      text-align: right;
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
    }
    .salutation {
      font-size: 15px;
      font-weight: 700;
      color: #c2410c;
      margin-bottom: 8px;
    }
    .intro-para {
      margin-bottom: 12px;
      text-align: justify;
    }
    .section-heading {
      font-size: 13.5px;
      font-weight: 700;
      color: #1e3a8a;
      border-left: 3.5px solid #2563eb;
      padding-left: 8px;
      margin: 12px 0 8px 0;
    }
    .milestone-item {
      margin-bottom: 9px;
      padding: 7px 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    .milestone-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    .milestone-title {
      font-size: 13px;
      font-weight: 700;
    }
    .milestone-role {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
    }
    .milestone-desc {
      text-align: justify;
      font-size: 12px;
      color: #334155;
    }
    .principles-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .principle-pill {
      padding: 7px 9px;
      border-radius: 7px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      font-size: 11.5px;
      font-weight: 700;
      color: #1e40af;
      text-align: center;
    }
    .quote-callout {
      margin: 9px 0;
      padding: 8px 12px;
      background: #fffbeb;
      border-left: 3.5px solid #f59e0b;
      font-style: italic;
      font-weight: 700;
      color: #92400e;
      font-size: 12px;
    }
    .closing-section {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      page-break-inside: avoid;
    }
    .signature-block {
      text-align: center;
      min-width: 210px;
    }
    .sig-img {
      height: 50px;
      width: auto;
      max-width: 190px;
      object-fit: contain;
      display: block;
      margin: 4px auto;
    }
    @media print {
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="letterhead">
      <div>
        <div class="author-name">Nguyễn Hùng Thái</div>
        <div class="author-title">Trưởng phòng Chăm sóc Khách hàng • 22+ Năm Kinh Nghiệm</div>
      </div>
      <div class="contact-meta">
        <div><strong>Hồ sơ năng lực:</strong> Hung Thai Executive Portal</div>
        <div><strong>Chuyên môn:</strong> Contact Center, CX, CRM & AI Automation</div>
        <div><strong>Người nhận:</strong> ${companyDisplay}</div>
      </div>
    </div>

    <div class="salutation">Kính chào ${companyDisplay}!</div>
    <p class="intro-para">
      Tôi là <strong>Nguyễn Hùng Thái</strong>, Trưởng phòng Chăm sóc Khách hàng với hơn <strong>22 năm kinh nghiệm</strong> trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.
    </p>

    <div class="section-heading">Hành Trình Sự Nghiệp & Dấu Ấn Quản Trị (2002 – 2023+)</div>
    ${milestonesHtml}

    <div class="section-heading">Triết Lý Quản Trị & Tâm Niệm Phụng Sự</div>
    <p class="intro-para">
      Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững. Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi:
    </p>
    <div class="principles-box">
      <div class="principle-pill">1. Quy trình tạo nền tảng.</div>
      <div class="principle-pill">2. Con người tạo giá trị.</div>
      <div class="principle-pill">3. Công nghệ tạo đòn bẩy.</div>
    </div>
    <p class="intro-para">
      Từ đó, tôi tập trung xây dựng các hệ thống <strong>CRM</strong>, <strong>Dashboard quản trị</strong>, <strong>AI Chatbot</strong> và các giải pháp <strong>tự động hóa</strong>, nhằm nâng cao hiệu quả vận hành, tối ưu trải nghiệm khách hàng và hỗ trợ nhà quản lý ra quyết định bằng dữ liệu. Bên cạnh công nghệ, tôi luôn xem <strong>con người là yếu tố quyết định thành công</strong>. Vì vậy, tôi chú trọng đào tạo đội ngũ biết lắng nghe, thấu hiểu và mang đến những trải nghiệm vượt mong đợi cho khách hàng. Tôi luôn tâm niệm:
    </p>
    <div class="quote-callout">
      “Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.”<br/>
      “Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.”
    </div>

    <div class="closing-section">
      <div style="max-width: 62%;">
        <p class="intro-para" style="margin-bottom:6px;">
          Tôi mong muốn được đồng hành cùng <strong>${companyDisplay}</strong> trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững.
        </p>
        <p style="font-weight:700; color:#0f172a;">
          Xin trân trọng cảm ơn ${companyDisplay} đã dành thời gian lắng nghe!
        </p>
      </div>
      <div class="signature-block">
        <div style="font-size:11px;color:#64748b;">Trân trọng kính chào,</div>
        <img class="sig-img" src="${SIGNATURE_IMAGE_URL}" alt="Chữ ký Nguyễn Hùng Thái" />
        <div style="font-size:14px;font-weight:700;color:#0f172a;">Nguyễn Hùng Thái</div>
        <div style="font-size:10.5px;color:#475569;font-weight:700;">Trưởng phòng Chăm sóc Khách hàng</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
    } else {
      window.print();
    }
  }, [companyDisplay, showToast]);

  // Subcomponent to render each career milestone as a responsive Multi-Color Bento View Card
  const renderCareerCard = (
    item: CareerMilestoneItem,
    bentoSpan: string = 'md:col-span-6',
    hideYear: boolean = false
  ) => {
    const roleIcon = getMilestoneIconName(item.roleIconName);
    const highlightIcon = getMilestoneIconName(item.highlightIconName || 'Sparkles');
    const isExpanded = !!expandedCard[item.id];
    const isCardBeingRead = activeTargetId === item.id;
    const isSelected = selectedMilestone?.id === item.id;
    const part1KwCount = countBoldKeywords(item.descVi);
    const part2KwCount = countBoldKeywords(item.descViPart2);
    const totalCardKeywords = Math.max(1, part1KwCount + part2KwCount);

    const rawTitle = item.milestoneTitleVi || item.company;
    const cleanTitle = hideYear
      ? rawTitle.replace(/\s*\(\d{4}[^\)]*\)/g, '').trim()
      : rawTitle;
    const displayTitle = cleanTitle;

    return (
      <article
        key={item.id}
        id={item.id}
        role={item.id === '2002' ? 'region' : 'button'}
        tabIndex={item.id === '2002' ? undefined : 0}
        aria-label={`${displayTitle} - ${item.roleVi}`}
        data-element-type="card"
        data-section-card="true"
        onClick={() => {
          if (item.id === '2002') return;
          SoundEngine.playTap();
          onOpenMilestoneModal(item);
        }}
        onKeyDown={(e) => {
          if (item.id === '2002') return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            SoundEngine.playTap();
            onOpenMilestoneModal(item);
          }
        }}
        style={{ gap: '12px', padding: '16px', borderRadius: '14px' }}
        className={`bento-view-card bento-card glass-card flex flex-col justify-between p-4 gap-3 relative transition-all duration-200 overflow-hidden group/mcard w-full mx-auto h-full min-h-0 min-w-0 ${
          item.id === '2002'
            ? 'cursor-default'
            : 'cursor-pointer hover:-translate-y-1 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
        } text-left rounded-[14px] ${bentoSpan} ${
          isSelected
            ? 'ring-2 ring-cyan-400 dark:ring-cyan-300 scale-[1.01] z-10'
            : ''
        }`}
      >
        {/* Subtle Brand Color Radial Tint */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none transition-opacity duration-200 group-hover/mcard:opacity-[0.11] dark:group-hover/mcard:opacity-[0.18]"
          style={{
            background: `radial-gradient(circle at bottom right, ${item.color}, transparent 70%)`,
          }}
        />

        {/* 1. HEADER ZONE: Focal Point (Logo 1:1, Title, Role Metadata & Year) */}
        <div className="w-full flex items-start justify-between gap-3 pb-3 border-b border-[var(--border-subcard)] shrink-0 relative z-10 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
            <div className="w-11 h-11 aspect-square rounded-full overflow-hidden border border-[var(--border-subcard)] shrink-0 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 transition-transform duration-200 group-hover/mcard:scale-105">
              <img
                src={item.logo}
                alt={item.company}
                className="w-full h-full aspect-square object-cover rounded-full border-0 p-0"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1 subcard-header-sync" style={{ color: item.color }}>
              <h4
                className="card-title subcard-title-synced typo-h4 tracking-tight line-clamp-2 font-play leading-snug break-words"
                data-subcard-title="true"
                style={{ color: item.color }}
                title={displayTitle}
              >
                {displayTitle}
              </h4>
              <div
                className="card-tag flex items-center gap-1.5 typo-caption font-semibold mt-0.5 min-w-0 opacity-90"
                style={{ color: item.color }}
              >
                <WebIcon name={roleIcon} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate" title={item.roleVi}>{item.roleVi}</span>
              </div>
            </div>
          </div>

          {!hideYear && (
            <span
              className="typo-badge font-bold font-play tabular-nums tracking-wide shrink-0 whitespace-nowrap pt-0.5"
              style={{ color: item.color }}
            >
              {/^\s*năm\s+/i.test(item.yearLabelVi) ? item.yearLabelVi : `Năm ${item.yearLabelVi}`}
            </span>
          )}
        </div>

        {/* 2. BODY ZONE: Supporting Content with Generous Whitespace (Single-Elevation) */}
        <div className="w-full flex-1 text-left relative z-10 flex flex-col justify-start gap-2.5 min-h-0 min-w-0 py-0.5">
          <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words [overflow-wrap:anywhere]">
            {renderFormattedText(item.descVi, {
              isCardReading: isCardBeingRead,
              keywordOffset: 0,
              totalKeywords: totalCardKeywords,
            })}
          </p>
          {item.descViPart2 && (
            <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words [overflow-wrap:anywhere] pt-2 border-t border-[var(--border-subcard)]">
              {renderFormattedText(item.descViPart2, {
                isCardReading: isCardBeingRead,
                keywordOffset: part1KwCount,
                totalKeywords: totalCardKeywords,
              })}
            </p>
          )}

          {isExpanded && (
            <p className="card-body-text typo-body-sm text-[var(--text-muted)] italic mt-1 pt-2 border-t border-[var(--border-subcard)] break-words [overflow-wrap:anywhere]">
              {item.descEn}
            </p>
          )}

          {item.showMoreLink && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
              }}
              className="card-tag typo-button font-bold text-rose-600 dark:text-rose-400 hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer self-start shrink-0"
            >
              {isExpanded ? (
                <>
                  <WebIcon name="chevron-up" className="w-3.5 h-3.5" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <span>Xem thêm →</span>
              )}
            </button>
          )}
        </div>

        {/* 3. FOOTER & CALL TO ACTION ZONE */}
        <div className="w-full pt-2.5 border-t border-[var(--border-subcard)] flex items-center justify-between gap-2 typo-body-sm font-semibold relative z-10 shrink-0 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1" style={{ color: item.color }}>
            <WebIcon name={highlightIcon} className="w-4 h-4 shrink-0" />
            <span className="truncate leading-snug text-left" title={item.highlightVi}>
              {item.highlightVi}
            </span>
          </div>
          <span
            className="typo-caption font-bold shrink-0 whitespace-nowrap inline-flex items-center gap-1 opacity-80 group-hover/mcard:opacity-100 group-hover/mcard:translate-x-0.5 transition-all duration-200"
            style={{ color: item.color }}
          >
            <span>Chi tiết</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </article>
    );
  };

  return (
    <div
      id="letter-page-container"
      data-element-name="Trang Thư Ngỏ"
      data-element-type="container"
      data-element-page="letter"
      data-element-parent="global-content-viewport"
      onWheel={(e) => {
        if (selectedMilestone) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest('.overflow-x-auto')) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 18) {
          const now = Date.now();
          if (now - lastWheelTimeRef.current < 320) return;
          lastWheelTimeRef.current = now;
          SoundEngine.playTap();
          if (e.deltaX > 0) {
            handleNextSlide();
          } else {
            handlePrevSlide();
          }
        }
      }}
      onTouchStart={(e) => {
        if (selectedMilestone) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest('.overflow-x-auto, button, input, select, textarea, video')) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touchStartRef.current || selectedMilestone) return;
        const diffX = touchStartRef.current.x - e.changedTouches[0].clientX;
        const diffY = touchStartRef.current.y - e.changedTouches[0].clientY;
        touchStartRef.current = null;
        if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
          SoundEngine.playTap();
          if (diffX > 0) {
            handleNextSlide();
          } else {
            handlePrevSlide();
          }
        }
      }}
      style={{ gap: '15px', rowGap: '15px', columnGap: '15px' }}
      className="group/letter main-card w-full min-w-0 h-full max-w-full mx-auto flex-1 min-h-0 flex flex-col justify-start p-[25px] gap-[15px] relative z-10 select-none overflow-hidden font-play text-left rounded-[14px] box-border"
    >



      {/* ========================================================================= */}
      {/* THANH ĐIỀU KHIỂN THUYẾT TRÌNH TỰ ĐỘNG KÈM NHẠC NỀN LO-FI (AUTOPLAY DOCK)   */}
      {/* ========================================================================= */}
      {isAutoplayPresentation && (
        <div
          role="region"
          aria-label="Điều khiển thuyết trình tự động"
          className="theme-popup fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-[14px] sm:rounded-full flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-center gap-2 sm:gap-3 max-w-[95vw] animate-slide-up select-none font-play"
        >
          {/* Nhãn trạng thái Slide & Cue */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full typo-badge font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs">
                Thuyết trình
              </span>
              <span className="typo-label font-bold text-[var(--text-primary)] hidden md:inline truncate max-w-[150px]">
                {activeVideoCue?.noteBadge || 'Tự động phát'}
              </span>
            </div>
          </div>

          {/* Huy hiệu Audio Ducking Nhạc nền Lo-Fi */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút chuyển đổi giọng đọc Song Ngữ VI / EN */}
            <button
              type="button"
              onClick={handleToggleNarrationLanguage}
              className={`px-2 py-1 rounded-full typo-badge font-bold border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                narrationLanguage === 'en'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-2xs'
                  : 'bg-emerald-600 text-white border-emerald-400 shadow-2xs'
              }`}
              title={
                narrationLanguage === 'vi'
                  ? 'Đang chọn Giọng Tiếng Việt. Nhấp để chuyển sang Tiếng Anh'
                  : 'Currently English. Click to switch to Vietnamese'
              }
            >
              <WebIcon name="globe" className="w-3 h-3 shrink-0" />
              <span>{narrationLanguage === 'vi' ? 'VI' : 'EN'}</span>
            </button>
          </div>

          {/* Thanh tiến trình Video */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <div className="w-20 xl:w-28 h-1.5 rounded-full bg-[var(--pillar-progress-track,rgba(148,163,184,0.28))] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${videoProgressPct}%` }}
              />
            </div>
            <span className="typo-label font-mono font-bold text-[var(--text-muted)]">
              {Math.round(videoProgressPct)}%
            </span>
          </div>

          {/* Bộ nút điều khiển Video */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleFloatingVideoPlay}
              className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
              title={isVideoPlaying ? 'Tạm dừng video' : 'Tiếp tục phát video'}
            >
              <WebIcon name={isVideoPlaying ? 'pause' : 'play'} className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={toggleFloatingVideoMute}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition cursor-pointer ${
                isVideoMuted
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300'
                  : 'bg-[var(--bg-subcard)] border-[var(--border-subcard)] text-[var(--text-primary)]'
              }`}
              title={isVideoMuted ? 'Bật tiếng thuyết minh video' : 'Tắt tiếng video'}
            >
              <WebIcon name={isVideoMuted ? 'volume-x' : 'volume-2'} className="w-3 h-3" />
            </button>
          </div>

          {/* Nút Dừng Thuyết Trình */}
          <button
            type="button"
            onClick={handleToggleAutoplayPresentation}
            className="px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white typo-badge font-bold flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            title="Dừng chế độ Thuyết trình Tự động"
          >
            <WebIcon name="stop" className="w-3 h-3" />
            <span>Dừng</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4 PRESENTATION CARDS CONTAINER WITH ABSOLUTE EDGE NAVIGATION BUTTONS    */}
      {/* ========================================================================= */}
      <div id="el-p1-div-77" className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-center p-0 font-play">


        {/* Direct Bento & Slide Content Container */}
        <div
          id="letter-sections-list"
          data-slide-direction={slideDirection}
          className={cn(
            'w-full h-full flex-1 min-h-0 self-stretch backdrop-blur-none rounded-none border-0 shadow-none overflow-y-auto overflow-x-clip glass-scrollbar bg-transparent relative z-10 flex flex-col gap-[15px] p-0 m-0'
          )}
          style={{
            background: 'transparent',
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            padding: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            margin: '0px',
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
          }}
        >
              {currentSlide === 0 && (
                <div
                  id="el-p1-div-85"
                  className="w-full h-full flex-1 min-h-0 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-[15px] items-stretch auto-rows-auto !bg-transparent border-0 shadow-none backdrop-blur-none"
                  style={{
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                  }}
                >
                    {/* THẺ BENTO 1: Khung Video Thuyết Minh (7/12 cột trên Desktop, 6/6 trên Tablet, 1/1 trên Mobile) */}
                    <article
                      id="bento-letter-video"
                      data-element-name="Thẻ Bento Video Thư Ngỏ"
                      data-element-type="card"
                      data-section-card="true"
                      data-element-page="letter"
                      style={{ padding: '16px', borderRadius: '14px' }}
                      className={`bento-card glass-card col-span-1 md:col-span-6 lg:col-span-7 rounded-[14px] min-h-[240px] sm:min-h-[260px] lg:min-h-[280px] w-full h-full min-w-0 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group/vcard ${
                        activeTargetId === 'bento-experience-intro' || activeTargetId === 'callout-salutation'
                          ? 'ring-2 ring-cyan-500/80 shadow-[0_0_24px_rgba(6,182,212,0.3)]'
                          : ''
                      }`}
                    >
                      <video
                        ref={floatingVideoRef}
                        src={LETTER_SLIDE_1_VIDEO_URL}
                        autoPlay
                        loop
                        playsInline
                        muted={isVideoMuted}
                        onTimeUpdate={handleFloatingVideoTimeUpdate}
                        onLoadedMetadata={handleFloatingVideoLoadedMetadata}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-500 group-hover/vcard:scale-[1.02]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/15 z-10 pointer-events-none" />
                    </article>

                    {/* THẺ BENTO 2: Thông Điệp Hợp Tác (5/12 cột trên Desktop, 6/6 trên Tablet, 1/1 trên Mobile) */}
                    <article
                      id="bento-commitment"
                      data-element-name="Thẻ Bento Thông Điệp Hợp Tác"
                      data-element-type="card"
                      data-section-card="true"
                      data-element-page="letter"
                      style={{ padding: '16px', gap: '12px', borderRadius: '14px' }}
                      className={`bento-card glass-card col-span-1 md:col-span-6 lg:col-span-5 p-4 rounded-[14px] flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 w-full h-full min-w-0 ${
                        activeTargetId === 'callout-salutation' || activeTargetId === 'bento-experience-intro' || activeTargetId === 'bento-commitment'
                          ? 'ring-2 ring-cyan-500/80 shadow-[0_0_24px_rgba(6,182,212,0.25)]'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard)] shrink-0 gap-2 min-w-0">
                        <div className="card-header-sync inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-300 leading-tight min-w-0">
                          <WebIcon
                            name="book"
                            size={16}
                            className="w-[16px] h-[16px] shrink-0 card-title-icon text-cyan-600 dark:text-cyan-300"
                            style={{ width: '16px', height: '16px', fontSize: '16px' }}
                          />
                          <h2
                            className="card-title card-title-synced typo-h3 font-play tracking-tight text-cyan-600 dark:text-cyan-300 truncate"
                            data-card-title="true"
                          >
                            Thông điệp hợp tác
                          </h2>
                        </div>
                        <span className="typo-badge font-bold font-play tabular-nums text-cyan-700 dark:text-cyan-300 whitespace-nowrap shrink-0">
                          22+ Năm CX
                        </span>
                      </div>

                      <div className="my-auto py-1 space-y-2.5 flex-1 flex flex-col justify-center text-left min-w-0">
                        <h3
                          id="callout-salutation"
                          className={cn(
                            "card-title typo-h4 font-play tracking-tight transition-all duration-300 break-words",
                            isCircleVideoPlaying && circleVideoProgress < 0.12
                              ? "text-slate-950 dark:text-amber-100 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-2.5 py-0.5 rounded-[14px] ring-2 ring-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.85)] inline-block w-fit"
                              : isCircleVideoPlaying && circleVideoProgress >= 0.12
                              ? "text-cyan-700 dark:text-cyan-300 font-semibold"
                              : "text-[var(--text-primary)]"
                          )}
                        >
                          Kính chào {companyDisplay}!
                        </h3>

                        <p className="card-body typo-body leading-relaxed text-[var(--text-secondary)] break-words [overflow-wrap:anywhere]">
                          {isCircleVideoPlaying ? (
                            renderKaraokeWords(
                              `Tôi là Nguyễn Hùng Thái , Trưởng phòng Chăm sóc Khách hàng với hơn 22 năm kinh nghiệm trong lĩnh vực xây dựng , vận hành và phát triển hệ thống dịch vụ khách hàng .`,
                              0.12,
                              0.45,
                              circleVideoProgress,
                              isCircleVideoPlaying
                            )
                          ) : (
                            <>
                              Tôi là{' '}
                              <strong className="font-bold text-[var(--text-primary)]">
                                Nguyễn Hùng Thái
                              </strong>
                              , Trưởng phòng Chăm sóc Khách hàng với hơn{' '}
                              <span className="font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
                                22 năm kinh nghiệm
                              </span>{' '}
                              trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.
                            </>
                          )}
                        </p>
                      </div>
                    </article>

                    {/* THẺ BENTO 3 (12/12 cols): GIÁ TRỊ CỐT LÕI PHÁT TRIỂN */}
                    <div
                      id="card-core-values-pursued"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '14px', padding: '16px', borderRadius: '14px' }}
                      className={`bento-view-card col-span-1 md:col-span-6 lg:col-span-12 w-full p-4 gap-3.5 transition-all duration-200 flex flex-col items-start group/values z-10 text-left rounded-[14px] shrink-0 min-w-0 ${getGlassCardClass()} ${
                        activeTargetId === 'card-core-values-pursued'
                          ? 'ring-2 ring-amber-400 dark:ring-cyan-400 shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                          : ''
                      }`}
                    >
                      <AnimatedCardTitle
                        iconName="trophy"
                        title="Giá trị cốt lỗi"
                        colorPreset="orange"
                      />

                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-[15px] items-stretch w-full"
                        style={{ gap: '15px' }}
                      >
                        {CORE_VALUES_DATA.map((val) => {
                          const valIconName =
                            val.number === '01'
                              ? 'heart'
                              : val.number === '02'
                              ? 'target'
                              : val.number === '03'
                              ? 'lightbulb'
                              : 'handshake';
                          const isValBeingRead = activeTargetId === `core-val-${val.number}`;

                          return (
                            <div
                              key={val.number}
                              id={`core-val-${val.number}`}
                              data-subcard="true"
                              style={{ gap: '10px', padding: '14px', borderRadius: '14px' }}
                              className={`sub-card letter-subcard relative overflow-hidden flex flex-col justify-between h-full p-3.5 gap-2.5 transition-all duration-200 hover:-translate-y-0.5 text-left group rounded-[14px] min-w-0 ${
                                isValBeingRead
                                  ? 'ring-2 ring-emerald-500 dark:ring-cyan-400 shadow-[0_0_24px_rgba(16,185,129,0.28)] -translate-y-1'
                                  : ''
                              }`}
                            >
                              <div
                                className="absolute inset-0 opacity-[0.06] dark:opacity-[0.14] pointer-events-none"
                                style={{
                                  background: `radial-gradient(circle at bottom right, ${val.colorTheme.primary}, transparent 70%)`,
                                }}
                              />

                              <div className="flex items-center justify-between relative z-10 gap-2 min-w-0">
                                <div
                                  className={`subcard-header-sync flex items-center gap-2 min-w-0 flex-1 ${val.colorTheme.text}`}
                                >
                                  <WebIcon name={valIconName} className="w-4 h-4 shrink-0" />
                                  <h4
                                    className={`card-title subcard-title-synced typo-h4 tracking-tight font-play truncate ${val.colorTheme.text}`}
                                    data-subcard-title="true"
                                  >
                                    {formatCardTitle(val.titleVi)}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isValBeingRead && (
                                    <AudioWaveformVisualizer isPlaying={!isPaused} barCount={4} size="sm" />
                                  )}
                                  <span
                                    className={`font-mono tabular-nums font-bold typo-kpi select-none ${val.colorTheme.numberText}`}
                                  >
                                    {val.number}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 flex items-center relative z-10 text-left min-w-0">
                                <p className="card-body-text typo-body text-[var(--text-secondary)] font-normal leading-relaxed break-words [overflow-wrap:anywhere]">
                                  {val.descVi}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* THẺ BENTO 6: Thương hiệu đồng hành */}
                    <article
                      id="bento-brands-marquee"
                      data-element-name="Thẻ Bento Thương Hiệu Đồng Hành"
                      data-element-type="card"
                      data-section-card="true"
                      data-element-page="letter"
                      style={{ padding: '16px', borderRadius: '14px' }}
                      className="bento-card glass-card col-span-1 md:col-span-6 lg:col-span-7 p-4 rounded-[14px] flex flex-col justify-between gap-2.5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group/marquee min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)] shrink-0 min-w-0">
                        <div className="card-header-sync inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 leading-tight min-w-0">
                          <WebIcon
                            name="briefcase"
                            size={16}
                            className="w-[16px] h-[16px] shrink-0 card-title-icon text-blue-600 dark:text-cyan-400"
                            style={{ width: '16px', height: '16px', fontSize: '16px' }}
                          />
                          <h3
                            className="card-title card-title-synced typo-h3 font-play text-blue-600 dark:text-cyan-400 truncate"
                            data-card-title="true"
                          >
                            Thương hiệu đồng hành
                          </h3>
                        </div>
                        <span className="typo-badge font-bold font-play tabular-nums text-blue-700 dark:text-blue-200 whitespace-nowrap shrink-0">
                          8 Tập đoàn
                        </span>
                      </div>

                      <div className="relative w-full overflow-hidden h-12 sm:h-14 flex items-center my-auto [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
                        <div className="animate-marquee flex items-center group-hover/marquee:[animation-play-state:paused]">
                          {[0, 1].map((trackIdx) => (
                            <div
                              key={trackIdx}
                              aria-hidden={trackIdx === 1}
                              className="flex items-center gap-8 sm:gap-12 whitespace-nowrap pr-8 sm:pr-12 shrink-0"
                            >
                              {EXPERIENCE_BRANDS_MARQUEE.map((item, idx) => (
                                <div
                                  key={`${trackIdx}-${item.id}-${idx}`}
                                  className="flex items-center gap-3 shrink-0 group/logo transition-all duration-300"
                                >
                                  <div
                                    className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-[99999px] overflow-hidden bg-white dark:bg-slate-800 p-0 border-2 border-slate-200/70 dark:border-white/10 shadow-sm group-hover/logo:scale-110 group-hover/logo:border-blue-500/50 transition-all duration-500 relative flex items-center justify-center shrink-0"
                                    style={{ borderRadius: '99999px' }}
                                  >
                                    <img
                                      src={item.logo}
                                      alt={item.company}
                                      style={{ borderRadius: '99999px', aspectRatio: '1 / 1' }}
                                      className="w-full h-full aspect-square object-cover rounded-[99999px] group-hover/logo:scale-110 transition-transform duration-700"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="card-tag typo-body-sm font-semibold font-play text-[var(--text-primary)] group-hover/logo:text-blue-700 dark:group-hover/logo:text-cyan-300 transition-colors whitespace-nowrap">
                                    {item.company}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>

                    {/* THẺ BENTO 7: Tuyên ngôn & Danh ngôn Phụng sự */}
                    <article
                      id="quote-banner-slide-1"
                      data-element-name="Thẻ Bento Danh Ngôn Phụng Sự"
                      data-element-type="card"
                      data-section-card="true"
                      data-element-page="letter"
                      style={{ padding: '16px', borderRadius: '14px' }}
                      className={`bento-card glass-card col-span-1 md:col-span-6 lg:col-span-5 relative overflow-hidden rounded-[14px] p-4 flex flex-col justify-between gap-2.5 transition-all duration-200 hover:-translate-y-0.5 group/quote min-w-0 ${
                        activeTargetId === 'quote-banner-slide-1'
                          ? 'ring-4 ring-sky-500/40 dark:ring-cyan-400/40 scale-[1.01]'
                          : ''
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
                      <div className="absolute -top-10 -left-10 w-28 h-28 bg-sky-400/15 blur-3xl rounded-full pointer-events-none" />

                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)] relative z-10 min-w-0">
                        <div className="card-header-sync inline-flex items-center gap-2 text-amber-600 dark:text-amber-300 leading-tight min-w-0">
                          <WebIcon
                            name="sparkles"
                            size={16}
                            className="w-[16px] h-[16px] shrink-0 card-title-icon text-amber-600 dark:text-amber-300"
                            style={{ width: '16px', height: '16px', fontSize: '16px' }}
                          />
                          <h3
                            className="card-title card-title-synced typo-h3 font-play text-amber-600 dark:text-amber-300 truncate"
                            data-card-title="true"
                          >
                            Châm ngôn phụng sự
                          </h3>
                        </div>
                      </div>

                      <p
                        className="font-handwriting font-italianno text-2xl sm:text-[26px] font-bold leading-snug tracking-wide text-amber-700 dark:text-amber-200 text-left drop-shadow-xs select-none relative z-10 my-auto break-words"
                        style={{ fontFamily: "'Italianno', cursive, sans-serif" }}
                      >
                        &ldquo;Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.&rdquo;
                      </p>
                    </article>
                </div>
              )}

              {currentSlide === 1 && (
                <div
                  className="w-full min-h-full flex-1 flex flex-col gap-[15px] bg-transparent"
                  style={{ background: 'transparent', width: '100%', maxWidth: '100%' }}
                >
                  <div
                    id="letter-slide-2-grid"
                    className="w-full min-h-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:grid-rows-2 auto-rows-fr gap-[15px] items-stretch bg-transparent"
                    style={{ gap: '15px', rowGap: '15px', columnGap: '15px', background: 'transparent', width: '100%' }}
                  >
                    {CAREER_MILESTONES_DATA.slice(0, 4).map((item) =>
                      renderCareerCard(item, 'min-w-0 col-span-1', false)
                    )}
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div
                  className="w-full min-h-full flex-1 flex flex-col gap-[15px] bg-transparent"
                  style={{ background: 'transparent', width: '100%', maxWidth: '100%' }}
                >
                  <div
                    id="letter-slide-3-grid"
                    className="w-full min-h-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:grid-rows-2 auto-rows-fr gap-[15px] items-stretch bg-transparent"
                    style={{ gap: '15px', rowGap: '15px', columnGap: '15px', background: 'transparent', width: '100%' }}
                  >
                    {CAREER_MILESTONES_DATA.slice(4, 8).map((item) =>
                      renderCareerCard(item, 'min-w-0 col-span-1', false)
                    )}
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div
                  className="w-full h-full flex-1 min-h-0 flex flex-col gap-[15px] bg-transparent"
                  style={{ background: 'transparent', width: '100%', height: '100%', maxWidth: '100%' }}
                >
                  <div
                    id="letter-slide-4-bento-grid"
                    className="w-full h-full flex-1 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-[15px] items-stretch bg-transparent"
                    style={{ gap: '15px', rowGap: '15px', columnGap: '15px', background: 'transparent', width: '100%', height: '100%' }}
                  >
                    {/* BENTO CARD 1 (6/12 cols): TRIẾT LÝ QUẢN TRỊ & 3 NGUYÊN TẮC CỐT LÕI */}
                    <div
                      id="card-philosophy-gratitude"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '14px', padding: '16px', borderRadius: '14px' }}
                      className={`bento-view-card col-span-1 md:col-span-6 lg:col-span-6 w-full h-full min-w-0 relative overflow-hidden p-4 gap-3.5 rounded-[14px] group text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${getGlassCardClass()} ${
                        activeTargetId === 'card-philosophy-gratitude'
                          ? 'ring-2 ring-purple-500/80 dark:ring-cyan-400/80 shadow-[0_0_25px_rgba(168,85,247,0.22)]'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-start text-left w-full gap-2.5 min-w-0">
                        <AnimatedCardTitle
                          iconName="sparkles"
                          title="Triết Lý Quản Trị"
                          subtitle="Ba nguyên tắc cốt lõi kiến tạo hệ thống phát triển bền vững"
                          colorPreset="purple"
                        />

                        <p className="card-body-text typo-body leading-relaxed text-[var(--text-primary)] break-words [overflow-wrap:anywhere]">
                          Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững.
                        </p>
                      </div>

                      {/* Three Core Principles Bento Sub-Grid */}
                      <div
                        className="flex flex-col gap-[15px] w-full min-w-0"
                        style={{ gap: '15px' }}
                      >
                        <p className="card-tag typo-body-sm font-semibold text-[var(--text-secondary)] tracking-wide font-mono">
                          Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi:
                        </p>

                        <div
                          className="grid grid-cols-1 auto-rows-fr gap-[15px] w-full items-stretch min-w-0"
                          style={{ gap: '15px' }}
                        >
                          {OPERATIONAL_PRINCIPLES_DATA.map((principle, idx) => {
                            const iconName = idx === 0 ? 'layers' : idx === 1 ? 'users' : 'network';
                            const principleColor = isDark
                              ? (idx === 0 ? '#7DD3FC' : idx === 1 ? '#D8B4FE' : '#6EE7B7')
                              : (idx === 0 ? '#1D4ED8' : idx === 1 ? '#7E22CE' : '#047857');
                            return (
                              <div
                                key={principle.id}
                                data-subcard="true"
                                style={{ padding: '14px', borderRadius: '14px' }}
                                className="sub-card letter-subcard h-full p-3.5 rounded-[14px] text-left flex flex-col justify-between gap-1.5 transition-all hover:-translate-y-0.5 duration-200 min-w-0"
                              >
                                <div className="flex items-center justify-between gap-2 min-w-0">
                                  <div
                                    className="subcard-header-sync flex items-center gap-2 font-semibold min-w-0"
                                    style={{
                                      color: principleColor,
                                    }}
                                  >
                                    <WebIcon name={iconName} className="w-4 h-4 shrink-0" style={{ color: principleColor }} />
                                    <h4
                                      className="card-title subcard-title-synced typo-h4 font-play tracking-tight truncate"
                                      data-subcard-title="true"
                                      style={{ color: principleColor }}
                                    >
                                      {principle.titleVi}
                                    </h4>
                                  </div>
                                  <span className="card-tag typo-label font-mono tabular-nums font-bold text-[var(--text-muted)] shrink-0">
                                    0{idx + 1}
                                  </span>
                                </div>
                                <p className="card-body-text typo-body text-[var(--text-secondary)] leading-relaxed break-words [overflow-wrap:anywhere]">
                                  {principle.descVi}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* BENTO CARD 2 (6/12 cols): TÂM THƯ ĐỒNG HÀNH, LỜI KẾT & CHỮ KÝ */}
                    <div
                      id="bento-companion-letter"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '14px', padding: '16px', borderRadius: '14px' }}
                      className={`bento-view-card col-span-1 md:col-span-6 lg:col-span-6 w-full h-full min-w-0 relative overflow-hidden p-4 gap-3.5 rounded-[14px] group text-left flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${getGlassCardClass()} ${
                        activeTargetId === 'card-philosophy-gratitude'
                          ? 'ring-2 ring-rose-500/70 dark:ring-cyan-400/70 shadow-[0_0_25px_rgba(244,63,94,0.18)]'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col gap-2.5 min-w-0">
                        <AnimatedCardTitle
                          iconName="heart"
                          title="Tâm Thư Đồng Hành"
                          subtitle="Công nghệ tự động hóa song hành cùng sự thấu hiểu con người"
                          colorPreset="rose"
                        />

                        <div className="card-body-text typo-body leading-relaxed text-[var(--text-secondary)] space-y-2 break-words [overflow-wrap:anywhere]">
                          <p>
                            Từ đó, tôi tập trung xây dựng các hệ thống{' '}
                            <strong className="font-bold text-blue-600 dark:text-cyan-400">CRM</strong>,{' '}
                            <strong className="font-bold text-blue-600 dark:text-cyan-400">
                              Dashboard quản trị
                            </strong>
                            ,{' '}
                            <strong className="font-bold text-blue-600 dark:text-cyan-400">
                              AI Chatbot
                            </strong>{' '}
                            và các giải pháp{' '}
                            <strong className="font-bold text-blue-600 dark:text-cyan-400">
                              tự động hóa
                            </strong>
                            , nhằm nâng cao hiệu quả vận hành, tối ưu trải nghiệm khách hàng và hỗ trợ nhà quản lý ra quyết định bằng dữ liệu. Bên cạnh công nghệ, tôi luôn xem{' '}
                            <strong className="font-bold text-rose-600 dark:text-rose-400">
                              con người là yếu tố quyết định thành công
                            </strong>
                            . Vì vậy, tôi chú trọng đào tạo đội ngũ biết lắng nghe, thấu hiểu và mang đến những trải nghiệm vượt mong đợi cho khách hàng. Tôi luôn tâm niệm:
                          </p>
                        </div>
                      </div>

                      {/* Quote box synthesis Bento Sub-card */}
                      <div
                        data-subcard="true"
                        style={{ padding: '14px', borderRadius: '14px' }}
                        className="sub-card letter-subcard w-full p-3.5 rounded-[14px] relative flex items-center gap-3 min-w-0"
                      >
                        <span className="text-amber-600 dark:text-amber-400 font-serif font-black text-xl leading-none shrink-0">
                          “
                        </span>
                        <p className="card-body-text typo-body text-amber-900 dark:text-amber-300 font-semibold italic leading-relaxed break-words [overflow-wrap:anywhere]">
                          &ldquo;Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.&rdquo;
                        </p>
                      </div>

                      <div className="card-body-text typo-body leading-relaxed text-[var(--text-secondary)] space-y-1.5 break-words [overflow-wrap:anywhere]">
                        <p>
                          Tôi mong muốn được đồng hành cùng{' '}
                          <strong className="font-bold text-[var(--text-primary)]">{companyDisplay}</strong> trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững.
                        </p>
                        <p className="font-bold text-cyan-700 dark:text-cyan-300">
                          Xin trân trọng cảm ơn {companyDisplay} đã dành thời gian lắng nghe!
                        </p>
                      </div>

                      {/* Bottom - Signature Block */}
                      <div className="w-full flex flex-wrap items-center justify-between gap-2 relative z-10 text-left pt-2.5 border-t border-[var(--border-subcard)]">
                        <div className="flex items-center gap-3">
                          <div className="-ml-1 shrink-0">
                            <SignatureSvg />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
        </div>
      </div>



      {/* ========================================================================= */}
      {/* VÒNG TRÒN NỔI AVATAR VIDEO VÀ BONG BÓNG LỜI NHẮC Ở GÓC TRÊN BÊN PHẢI      */}
      {/* ========================================================================= */}
      {isClientMounted && (
        <div
          className="fixed top-[68px] sm:top-[88px] right-2 sm:right-6 md:right-8 z-50 flex items-center gap-2 sm:gap-3 select-none pointer-events-auto max-w-[calc(100vw-24px)]"
          role="region"
          aria-label="Video Giới Thiệu Chân Dung Nổi"
        >
          {/* Bong bóng tin nhắn xanh dương bên trái với đuôi nhọn hướng sang vòng tròn avatar */}
          <div
            onClick={handleToggleCircleVideo}
            className="hidden sm:flex cursor-pointer group/bubble relative items-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 sm:px-5 py-2 sm:py-3 rounded-[14px] shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border border-blue-300/40"
            title="Bấm vào để xem video giới thiệu của anh!"
          >
            <p className="typo-button font-play text-white m-0 text-left">
              Bấm vào để xem video giới thiệu<br /> của anh!
            </p>

            {/* Đuôi nhọn của bubble hướng về avatar (bên phải) */}
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[7px] sm:border-y-[8px] border-y-transparent border-l-[9px] sm:border-l-[10px] border-l-[#2563eb] pointer-events-none drop-shadow-xs"
            />
          </div>

          {/* Vòng tròn Avatar chân dung phát sáng rực rỡ, chuyển động nhịp nhàng & nút Play đè ở chính giữa cạnh dưới */}
          <div className="relative group/circle cursor-pointer" onClick={handleToggleCircleVideo}>
            {/* Vòng sáng Laser Glow Aura bao quanh phát sáng & chuyển động */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-80 blur-md animate-pulse pointer-events-none" />

            {/* Vòng tròn avatar chân dung video lấp đầy 100% */}
            <div
              className={cn(
                "relative w-14 h-14 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 group-hover/circle:scale-110 border-[3px] shadow-[0_0_25px_rgba(6,182,212,0.8),0_0_45px_rgba(37,99,235,0.6)]",
                isCircleVideoPlaying
                  ? "border-cyan-300 ring-4 ring-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.95),0_0_60px_rgba(37,99,235,0.8)]"
                  : "border-blue-400 dark:border-cyan-400 hover:border-cyan-300"
              )}
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {/* Video nền hoặc video đang phát chân dung chuyên gia: LẮP ĐẦY HÌNH TRÒN 100% */}
              <video
                ref={circleVideoRef}
                src={isCircleVideoPlaying ? HOME_SCREEN_2_INTRO_URL : HOME_SCREEN_2_IDLE_URL}
                autoPlay
                loop={!isCircleVideoPlaying}
                playsInline
                muted={!isCircleVideoPlaying}
                onTimeUpdate={handleCircleVideoTimeUpdate}
                onEnded={handleCircleVideoEnded}
                className="w-full h-full min-w-full min-h-full object-cover object-center pointer-events-none scale-[1.08] rounded-full"
              />

              {/* Tag trạng thái nhỏ khi video đang phát */}
              {isCircleVideoPlaying && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-xs typo-badge font-mono text-cyan-300 font-bold border border-cyan-400/50 pointer-events-none shadow-xs whitespace-nowrap z-10">
                  Đang phát 🔊
                </div>
              )}
            </div>

            {/* Nút Play hình tròn màu đỏ NẰM CHÍNH GIỮA CẠNH DƯỚI HÌNH TRÒN (CENTER BOTTOM) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCircleVideo();
              }}
              className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(239,68,68,0.7),0_0_14px_rgba(239,68,68,0.9)] border-2 border-white dark:border-slate-900 transition-all duration-300 z-20 cursor-pointer group-hover/circle:scale-110"
              title={isCircleVideoPlaying ? "Tạm dừng video" : "Xem video giới thiệu"}
            >
              {isCircleVideoPlaying ? (
                <WebIcon name="pause" className="w-4 h-4 fill-white text-white" />
              ) : (
                <WebIcon name="play" className="w-4 h-4 fill-white text-white ml-0.5" />
              )}
            </button>

            {/* Nút bật/tắt tiếng mini bên cạnh khi video đang phát */}
            {isCircleVideoPlaying && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (circleVideoRef.current) {
                    circleVideoRef.current.muted = !circleVideoRef.current.muted;
                    showToast(circleVideoRef.current.muted ? 'Đã tắt tiếng video' : 'Đã bật âm thanh video');
                  }
                }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900/90 text-white flex items-center justify-center border border-white/50 typo-badge shadow-md z-20 cursor-pointer hover:bg-slate-800"
                title="Bật/Tắt âm thanh"
              >
                <WebIcon name="volume-2" className="w-3 h-3 text-cyan-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nút LÙI TRANG (Chevron Left) hình tròn nổi ở chính giữa cạnh trái kèm hiệu ứng cuộn ngang */}
      <button
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          handlePrevSlide();
        }}
        title={`Lùi trang (${((currentSlide - 1 + 4) % 4) + 1}/4)`}
        aria-label="Lùi trang"
        className="nav-arrow-btn theme-prev-next-btn absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center opacity-90 sm:opacity-55 sm:group-hover/letter:opacity-100 hover:!opacity-100 sm:-translate-x-1 sm:group-hover/letter:translate-x-0 hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:shadow-[0_10px_28px_rgba(236,125,33,0.35)] cursor-pointer group pointer-events-auto"
      >
        <WebIcon
          name="chevron-left"
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:scale-110"
        />
      </button>

      {/* Nút TỚI TRANG (Chevron Right) hình tròn nổi ở chính giữa cạnh phải kèm hiệu ứng cuộn ngang */}
      <button
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          handleNextSlide();
        }}
        title={`Tới trang (${((currentSlide + 1) % 4) + 1}/4)`}
        aria-label="Tới trang"
        className="nav-arrow-btn theme-prev-next-btn absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square flex items-center justify-center opacity-90 sm:opacity-55 sm:group-hover/letter:opacity-100 hover:!opacity-100 sm:translate-x-1 sm:group-hover/letter:translate-x-0 hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:shadow-[0_10px_28px_rgba(236,125,33,0.35)] cursor-pointer group pointer-events-auto"
      >
        <WebIcon
          name="chevron-right"
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110"
        />
      </button>
    </div>
  );
};

export default LetterView;
