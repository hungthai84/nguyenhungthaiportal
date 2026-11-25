'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { Modal } from '@/components/ui/Modal';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { speakSiteText, stopActiveSpeech, VOICE_CHANGE_EVENT, getSavedVoiceURI, findBestVoice, findBestEnglishVoice, saveDefaultVoiceURI, applyActivePersonaToUtterance } from '@/utils/speechVoice';
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
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';

// Video thuyết minh Thư Ngỏ (Đồng bộ từ Video Giới thiệu - AboutView Video 1 & Video 2)
export const LETTER_VIDEO_1_ID = '156Uwr88AhLmybquXyrMsXqzxdAs5I6lw';
export const LETTER_VIDEO_2_ID = '12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R';
export const LETTER_SLIDE_1_VIDEO_URL =
  'https://cdn.scena.ai/project/10223/73bc236e3e9c7f6be95f2e882e26e6ff67b5f2a108d180fba8b33518146ff2b7.mp4';
export const LETTER_SLIDE_2_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/87d892c1c37f70cfae99aa55e5888f93ea6b7015050fe44e5d1f54418f0b06b9.mp4';
const LETTER_SLIDE_1_DRIVE_ALT_URL =
  `https://drive.google.com/uc?export=download&id=${LETTER_VIDEO_1_ID}`;
const LETTER_SLIDE_1_MP4_BACKUP_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793623267/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4';


// Authentic Signature image for Nguyễn Hùng Thái
const SIGNATURE_IMAGE_URL =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/v1794826442/Ch%E1%BB%AF_k%C3%BD.png';

const SignatureSvg = () => (
  <img
    src={SIGNATURE_IMAGE_URL}
    alt="Chữ ký Nguyễn Hùng Thái"
    loading="lazy"
    decoding="async"
    referrerPolicy="no-referrer"
    className="h-12 sm:h-14 w-auto max-w-[180px] sm:max-w-[220px] object-contain object-left bg-transparent border-0 p-0 shadow-none select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]"
  />
);

// 8 Thương hiệu từng đồng hành lấy trực tiếp từ trang kinh nghiệm (Experience)
const EXPERIENCE_BRANDS_MARQUEE = [
  { id: 'mobifone', company: 'MobiFone', logo: 'https://i.postimg.cc/3N4xX9Xd/Mobifone.png' },
  { id: 'v247', company: 'Viễn Liên V247', logo: 'https://i.postimg.cc/wMyjXFXc/V247.png' },
  { id: 'lbc', company: 'LBC – HTVC', logo: 'https://i.postimg.cc/kG6gQwQ4/LBC.png' },
  { id: 'ved', company: 'VED (Garena / Shopee)', logo: 'https://i.postimg.cc/NF9j6b6x/VED.png' },
  { id: 'prudential', company: 'Prudential Việt Nam', logo: 'https://i.postimg.cc/C5BxGJGk/Prudential.png' },
  { id: 'momo', company: 'Ví MoMo', logo: 'https://i.postimg.cc/J0DzNKNy/Momo.png' },
  { id: 'finviet', company: 'Finviet (Ví ECO)', logo: 'https://i.postimg.cc/mD6r1KHh/Finviet.png' },
  { id: 'challenge', company: 'Sẵn sàng thử thách mới', logo: 'https://i.postimg.cc/sxQgYKYh/Power-Service.png' },
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

// Adaptive layout mode selector based on sub-card count & visual hierarchy
const resolveAdaptiveCardLayout = (
  subCardCount: number,
  hasAsymmetricFocalCard: boolean
): 'bento' | 'grid' => {
  if (hasAsymmetricFocalCard) return 'bento';
  return subCardCount >= 2 ? 'grid' : 'bento';
};

// Animated Card Title Subcomponent (Keep icon/logo before title, no sub-title, no left-of-title extra content)
const AnimatedCardTitle: React.FC<{
  iconName: string;
  title: string;
  colorPreset?: 'emerald' | 'cyan' | 'purple' | 'rose' | 'orange' | 'blue';
  actionRight?: React.ReactNode;
  animateIcon?: boolean;
}> = ({
  iconName,
  title,
  colorPreset = 'blue',
  actionRight,
  animateIcon = false,
}) => {
  const colorMap = {
    emerald: {
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    cyan: {
      text: 'text-cyan-700 dark:text-cyan-300',
    },
    purple: {
      text: 'text-purple-700 dark:text-purple-300',
    },
    rose: {
      text: 'text-rose-700 dark:text-rose-300',
    },
    orange: {
      text: 'text-orange-700 dark:text-orange-300',
    },
    blue: {
      text: 'text-blue-700 dark:text-blue-300',
    },
  };

  const scheme = colorMap[colorPreset] || colorMap.blue;

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2 shrink-0 border-0">
      <div
        className={`card-header-sync inline-flex items-center gap-2 ${scheme.text} max-w-full leading-tight min-w-0 flex-1`}
      >
        <span
          className={`inline-flex items-center justify-center w-[16px] h-[16px] shrink-0 bg-transparent border-0 p-0 shadow-none ${
            animateIcon ? 'animate-[icon-floating_3s_ease-in-out_infinite]' : ''
          }`}
          style={{ width: '16px', height: '16px' }}
        >
          <WebIcon
            name={iconName}
            size={16}
            className="w-[16px] h-[16px] shrink-0 card-title-icon"
            style={{ width: '16px', height: '16px' }}
          />
        </span>
        <h3
          className={`card-title card-title-synced typo-h3 font-play tracking-tight ${scheme.text} break-words`}
          data-card-title="true"
        >
          {formatCardTitle(title)}
        </h3>
      </div>
      {actionRight && <div className="shrink-0">{actionRight}</div>}
    </div>
  );
};

export interface LetterViewProps {
  currentTheme?: string;
  onOpenBannerStudio?: (pageId: number) => void;
  onShowNotification: (msg: string) => void;
  onOpenMilestoneModal?: (item: any) => void;
}

export const LetterView: React.FC<LetterViewProps> = ({
  currentTheme = 'liquid-glass',
  onOpenBannerStudio,
  onShowNotification,
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
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'black-cowhide-leather' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-frost-ice-neu';

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
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

  // Slides and Presentation State
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const currentSlideRef = useRef<number>(0);
  const lastRow23SlideRef = useRef<number>(1);
  const [verticalPeekState, setVerticalPeekState] = useState<{
    hasTopPeek: boolean;
    hasBottomPeek: boolean;
  }>({ hasTopPeek: false, hasBottomPeek: false });

  useEffect(() => {
    currentSlideRef.current = currentSlide;
    if (currentSlide === 1 || currentSlide === 2) {
      lastRow23SlideRef.current = currentSlide;
    }
  }, [currentSlide]);

  // Vertical scroll container & Card 1 reference size sync for Cards 2..4
  const letterContainerRef = useRef<HTMLDivElement>(null);
  const letterCard1Ref = useRef<HTMLDivElement>(null);
  const letterCardsRow23Ref = useRef<HTMLDivElement>(null);
  const [card1Size, setCard1Size] = useState<{ width: number; height: number } | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollAnimRafRef = useRef<number | null>(null);

  const activeVerticalRow = currentSlide === 0 ? 0 : currentSlide === 3 ? 2 : 1;

  const getStaticOffsetTop = useCallback((el: HTMLElement, container: HTMLElement): number => {
    let offset = 0;
    let cur: HTMLElement | null = el;
    while (cur && cur !== container) {
      offset += cur.offsetTop;
      const nextParent = cur.offsetParent as HTMLElement | null;
      if (!nextParent || !container.contains(nextParent)) {
        if (nextParent === container) {
          return offset;
        }
        return Math.max(
          0,
          Math.round(container.scrollTop + (el.getBoundingClientRect().top - container.getBoundingClientRect().top))
        );
      }
      cur = nextParent;
    }
    return offset;
  }, []);

  const getExactRowTargetTop = useCallback(
    (container: HTMLElement, slideIdx: number): number => {
      const rowEl =
        slideIdx === 0
          ? document.getElementById('letter-card-1')
          : slideIdx === 3
            ? document.getElementById('letter-card-4')
            : document.getElementById('letter-cards-row-2-3');
      if (!rowEl) return 0;
      const rowTop = getStaticOffsetTop(rowEl, container);
      const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const centeredTop = Math.round(rowTop - Math.max(0, (container.clientHeight - rowEl.offsetHeight) / 2));
      return Math.max(0, Math.min(maxTop, centeredTop));
    },
    [getStaticOffsetTop]
  );

  const getExactRowTargetLeft = useCallback((row: HTMLElement, slideIdx: number): number => {
    if (slideIdx !== 2) return 0;
    const card3 = document.getElementById('letter-card-3');
    const maxLeft = Math.max(0, row.scrollWidth - row.clientWidth);
    if (card3) {
      return Math.max(0, Math.min(maxLeft, Math.round(card3.offsetLeft)));
    }
    return maxLeft;
  }, []);

  const updateVerticalPeekState = useCallback(() => {
    const container = letterContainerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const rowIdx = currentSlideRef.current === 0 ? 0 : currentSlideRef.current === 3 ? 2 : 1;
    const rowEls = [
      document.getElementById('letter-card-1'),
      document.getElementById('letter-cards-row-2-3'),
      document.getElementById('letter-card-4'),
    ];

    let hasTopPeek = false;
    let hasBottomPeek = false;

    if (rowIdx > 0 && rowEls[rowIdx - 1]) {
      const prevRect = rowEls[rowIdx - 1]!.getBoundingClientRect();
      const visiblePrev = Math.min(prevRect.bottom, cRect.bottom) - Math.max(prevRect.top, cRect.top);
      hasTopPeek = visiblePrev >= 18;
    }

    if (rowIdx < 2 && rowEls[rowIdx + 1]) {
      const nextRect = rowEls[rowIdx + 1]!.getBoundingClientRect();
      const visibleNext = Math.min(nextRect.bottom, cRect.bottom) - Math.max(nextRect.top, cRect.top);
      hasBottomPeek = visibleNext >= 18;
    }

    setVerticalPeekState((prev) =>
      prev.hasTopPeek === hasTopPeek && prev.hasBottomPeek === hasBottomPeek
        ? prev
        : { hasTopPeek, hasBottomPeek }
    );
  }, []);

  useEffect(() => {
    const syncViewportHeight = () => {
      const vp = document.getElementById('global-content-viewport') || letterContainerRef.current;
      if (!vp) return;
      const cs = window.getComputedStyle(vp);
      const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const rawH = (vp.getBoundingClientRect().height || vp.clientHeight) - padY;
      const h = Math.max(120, Math.round(rawH));
      if (h > 0) {
        setViewportHeight((prev) => (prev === h ? prev : h));
      }
    };
    syncViewportHeight();
    let vpRo: ResizeObserver | null = null;
    const vpEl = document.getElementById('global-content-viewport') || letterContainerRef.current;
    if (typeof ResizeObserver !== 'undefined' && vpEl) {
      vpRo = new ResizeObserver(syncViewportHeight);
      vpRo.observe(vpEl);
    }
    window.addEventListener('resize', syncViewportHeight);
    return () => {
      if (vpRo) vpRo.disconnect();
      window.removeEventListener('resize', syncViewportHeight);
    };
  }, []);

  useEffect(() => {
    const el = letterCard1Ref.current;
    if (!el) return;
    const syncHorizontalRowPosition = () => {
      if (isProgrammaticScrollRef.current) return;
      const row = letterCardsRow23Ref.current;
      const container = letterContainerRef.current;
      const slideIdx = currentSlideRef.current;
      if (row) {
        if (slideIdx === 1 || slideIdx === 2) {
          const expectedLeft = getExactRowTargetLeft(row, slideIdx);
          if (Math.abs(row.scrollLeft - expectedLeft) > 1) {
            row.style.scrollSnapType = 'none';
            row.scrollLeft = expectedLeft;
            requestAnimationFrame(() => {
              if (letterCardsRow23Ref.current) {
                letterCardsRow23Ref.current.style.scrollSnapType = 'x mandatory';
              }
            });
          }
        } else if (slideIdx === 0 && row.scrollLeft !== 0) {
          row.scrollLeft = 0;
        }
      }
      if (container) {
        const expectedTop = getExactRowTargetTop(container, slideIdx);
        if (Math.abs(container.scrollTop - expectedTop) > 1) {
          container.scrollTop = expectedTop;
        }
      }
    };
    const measureCard1 = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;
      setCard1Size((prev) =>
        prev && prev.width === width && prev.height === height ? prev : { width, height }
      );
      requestAnimationFrame(() => {
        syncHorizontalRowPosition();
        updateVerticalPeekState();
      });
    };
    measureCard1();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measureCard1);
      ro.observe(el);
      if (letterContainerRef.current) ro.observe(letterContainerRef.current);
    }
    window.addEventListener('resize', measureCard1);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measureCard1);
    };
  }, [viewportHeight, updateVerticalPeekState, getExactRowTargetTop, getExactRowTargetLeft]);

  const row23TouchStartXRef = useRef<number | null>(null);
  const row23TouchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      if (scrollAnimRafRef.current) window.cancelAnimationFrame(scrollAnimRafRef.current);
    };
  }, []);

  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const scrollToLetterCard = useCallback(
    (targetSlide: number, smooth = true) => {
      const clamped = Math.max(0, Math.min(3, targetSlide));
      const prev = currentSlideRef.current;
      const prevRow = prev === 0 ? 0 : prev === 3 ? 2 : 1;
      const targetRow = clamped === 0 ? 0 : clamped === 3 ? 2 : 1;
      if (clamped !== prev) {
        setSlideDirection(clamped > prev ? 'next' : 'prev');
      }
      currentSlideRef.current = clamped;
      setCurrentSlide(clamped);

      const container = letterContainerRef.current;
      if (!container) return;

      const cardEl = document.getElementById(`letter-card-${clamped + 1}`);
      if (!cardEl) return;

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      if (scrollAnimRafRef.current) {
        window.cancelAnimationFrame(scrollAnimRafRef.current);
        scrollAnimRafRef.current = null;
      }

      isProgrammaticScrollRef.current = true;

      const targetTop = getExactRowTargetTop(container, clamped);
      const row = letterCardsRow23Ref.current;

      // When moving into row 2-3 from another vertical row, align horizontal slot immediately before vertical scroll
      let animateHorizontal = false;
      let startLeft = row ? row.scrollLeft : 0;
      let targetLeft = startLeft;

      if (row && (clamped === 1 || clamped === 2)) {
        targetLeft = getExactRowTargetLeft(row, clamped);
        if (prevRow !== 1) {
          row.style.scrollSnapType = 'none';
          row.scrollLeft = targetLeft;
          startLeft = targetLeft;
        } else if (Math.abs(targetLeft - startLeft) > 0.5) {
          animateHorizontal = true;
        }
      }

      const startTop = container.scrollTop;
      const animateVertical = Math.abs(targetTop - startTop) > 0.5;
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const finishScroll = () => {
        scrollAnimRafRef.current = null;
        container.scrollTop = targetTop;
        if (row && (clamped === 1 || clamped === 2)) {
          row.scrollLeft = getExactRowTargetLeft(row, clamped);
        }
        currentSlideRef.current = clamped;
        updateVerticalPeekState();
        window.requestAnimationFrame(() => {
          if (row) {
            row.style.scrollSnapType = 'x mandatory';
          }
          currentSlideRef.current = clamped;
          isProgrammaticScrollRef.current = false;
          updateVerticalPeekState();
          evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
        });
      };

      if (!smooth || prefersReduced || (!animateVertical && !animateHorizontal)) {
        if (row) row.style.scrollSnapType = 'none';
        finishScroll();
        return;
      }

      if (row && targetRow === 1) {
        row.style.scrollSnapType = 'none';
      }

      const durationMs = 260;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);

        if (animateVertical) {
          container.scrollTop = Math.round(startTop + (targetTop - startTop) * eased);
        }
        if (row && animateHorizontal) {
          row.scrollLeft = Math.round(startLeft + (targetLeft - startLeft) * eased);
        }

        if (progress < 1) {
          scrollAnimRafRef.current = window.requestAnimationFrame(step);
        } else {
          finishScroll();
        }
      };

      scrollAnimRafRef.current = window.requestAnimationFrame(step);
    },
    [updateVerticalPeekState, getExactRowTargetTop, getExactRowTargetLeft]
  );

  useEffect(() => {
    const rafId = window.requestAnimationFrame(updateVerticalPeekState);
    return () => window.cancelAnimationFrame(rafId);
  }, [currentSlide, viewportHeight, card1Size, updateVerticalPeekState]);

  const handleLetterContainerScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    updateVerticalPeekState();
    const container = letterContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const containerCenterY = containerRect.top + containerRect.height / 2;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    let nextSlide = currentSlideRef.current;
    let minScore = Infinity;
    for (let i = 0; i < 4; i++) {
      const cardEl = document.getElementById(`letter-card-${i + 1}`);
      if (cardEl) {
        const r = cardEl.getBoundingClientRect();
        const verticalDiff = Math.abs(r.top + r.height / 2 - containerCenterY);
        const horizontalDiff = i === 1 || i === 2 ? Math.abs(r.left + r.width / 2 - containerCenterX) * 0.65 : 0;
        const score = verticalDiff + horizontalDiff;
        if (score < minScore) {
          minScore = score;
          nextSlide = i;
        }
      }
    }
    if (nextSlide !== currentSlideRef.current) {
      setSlideDirection(nextSlide > currentSlideRef.current ? 'next' : 'prev');
      currentSlideRef.current = nextSlide;
      setCurrentSlide(nextSlide);
    }
  }, [updateVerticalPeekState]);

  const handleRow23HorizontalScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const row = letterCardsRow23Ref.current;
    if (!row) return;
    const maxHorizontalScroll = Math.max(1, row.scrollWidth - row.clientWidth);
    const nextSlide = row.scrollLeft > maxHorizontalScroll * 0.42 ? 2 : 1;
    if (nextSlide !== currentSlideRef.current) {
      setSlideDirection(nextSlide > currentSlideRef.current ? 'next' : 'prev');
      currentSlideRef.current = nextSlide;
      setCurrentSlide(nextSlide);
    }
  }, []);

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
        scrollToLetterCard(target, true);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [scrollToLetterCard]);

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
  const [letterVideoStage, setLetterVideoStage] = useState<0 | 1 | 2>(0);
  const activeLetterVideoUrl =
    letterVideoStage === 0
      ? LETTER_SLIDE_1_VIDEO_URL
      : letterVideoStage === 1
        ? LETTER_SLIDE_1_DRIVE_ALT_URL
        : LETTER_SLIDE_1_MP4_BACKUP_URL;
  const isPausedRef = useRef<boolean>(false);

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
          currentSlideRef.current = parsed;
          setCurrentSlide(parsed);
          if (parsed !== 0) {
            requestAnimationFrame(() => {
              scrollToLetterCard(parsed, false);
            });
          }
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
      if (currentSlideRef.current !== segment.slideIndex) {
        SoundEngine.playPageFlip();
        scrollToLetterCard(segment.slideIndex, true);
      }

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
          applyActivePersonaToUtterance(utterance, voices, isEn ? 'en' : 'vi', speechRateRef.current);

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
    [narrationSegments, voices, clearFallbackTimer, clearKaraokeTimer, stopNarration, scrollToLetterCard]
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
      if (targetSlide === currentSlideRef.current) return;
      scrollToLetterCard(targetSlide, true);
      // If currently narrating, jump voice narration to the selected slide
      if (isNarratingRef.current) {
        const segIdx = narrationSegments.findIndex((s) => s.slideIndex === targetSlide);
        if (segIdx !== -1) {
          playSegmentAtIndex(segIdx);
        }
      }
    },
    [scrollToLetterCard, narrationSegments, playSegmentAtIndex]
  );

  const handlePrevSlide = useCallback(() => {
    const targetSlide = currentSlideRef.current > 0 ? currentSlideRef.current - 1 : 3;
    scrollToLetterCard(targetSlide, true);
    if (isNarratingRef.current) {
      const segIdx = narrationSegments.findIndex((s) => s.slideIndex === targetSlide);
      if (segIdx !== -1) playSegmentAtIndex(segIdx);
    }
  }, [scrollToLetterCard, narrationSegments, playSegmentAtIndex]);

  const handleNextSlide = useCallback(() => {
    const targetSlide = currentSlideRef.current < 3 ? currentSlideRef.current + 1 : 0;
    scrollToLetterCard(targetSlide, true);
    if (isNarratingRef.current) {
      const segIdx = narrationSegments.findIndex((s) => s.slideIndex === targetSlide);
      if (segIdx !== -1) playSegmentAtIndex(segIdx);
    }
  }, [scrollToLetterCard, narrationSegments, playSegmentAtIndex]);

  // Keyboard navigation for slides (clamped 0..3 like AboutView peek-carousel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (selectedMilestone) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToLetterCard(Math.min(3, currentSlideRef.current + 1), true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToLetterCard(Math.max(0, currentSlideRef.current - 1), true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToLetterCard, selectedMilestone]);

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
      if (autoSyncVideoWithSlides && cue.slideIndex !== currentSlideRef.current) {
        scrollToLetterCard(cue.slideIndex, true);
        SoundEngine.playPageFlip();
      }
    }
  }, [autoSyncVideoWithSlides, scrollToLetterCard]);

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

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(printHtml);
        doc.close();
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch {
            window.print();
          }
          setTimeout(() => {
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          }, 2000);
        }, 400);
      } else {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        window.print();
      }
    } catch {
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

    const yearText = /^\s*năm\s+/i.test(item.yearLabelVi)
      ? item.yearLabelVi
      : `Năm ${item.yearLabelVi}`;

    return (
      <article
        key={item.id}
        id={item.id}
        role="region"
        aria-label={`${displayTitle} - ${item.roleVi}`}
        data-element-type="card"
        data-section-card="true"
        style={{ gap: '6px', padding: '12px', borderRadius: 'var(--radius-card, 24px)', background: 'transparent', backgroundColor: 'transparent' }}
        className={`bento-view-card bento-card glass-card flex flex-col justify-between p-[12px] gap-[6px] relative transition-colors duration-200 overflow-hidden group/mcard w-full mx-auto h-full min-h-0 min-w-0 cursor-default text-left rounded-[14px] bg-transparent ${bentoSpan} ${
          isSelected
            ? 'ring-2 ring-cyan-400 dark:ring-cyan-300 z-10'
            : ''
        }`}
      >
        {/* Subtle Brand Color Radial Tint */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none transition-opacity duration-200 group-hover/mcard:opacity-[0.08]"
          style={{
            background: `radial-gradient(circle at bottom right, ${item.color}, transparent 70%)`,
          }}
        />

        {/* 1. HEADER ZONE: Year - Icon & Title on Left, Logo 1:1 on Right */}
        <div className="w-full flex items-center justify-between gap-2.5 shrink-0 relative z-10 min-w-0 border-0">
          <div className="min-w-0 flex-1 subcard-header-sync text-left" style={{ color: item.color }}>
            <h4
              className="card-title subcard-title-synced typo-h4 tracking-tight font-play leading-snug break-words flex flex-wrap items-center gap-1.5 min-w-0"
              data-subcard-title="true"
              style={{ color: item.color }}
              title={!hideYear ? `${yearText} - ${displayTitle}` : displayTitle}
            >
              {!hideYear && (
                <>
                  <span
                    className="font-bold font-play tabular-nums tracking-wide shrink-0 whitespace-nowrap"
                    style={{ color: item.color }}
                  >
                    {yearText}
                  </span>
                  <span className="font-bold shrink-0" style={{ color: item.color }}>
                    -
                  </span>
                </>
              )}
              <WebIcon name="building-2" className="w-4 h-4 shrink-0" style={{ color: item.color }} />
              <span className="min-w-0 break-words">{displayTitle}</span>
            </h4>
          </div>

          <div
            style={{
              background: 'var(--surface-secondary-bg, var(--bg-card))',
              border: 'none',
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 aspect-square rounded-full overflow-hidden border-0 shrink-0 flex items-center justify-center p-0 shadow-none transition-transform duration-200 group-hover/mcard:scale-105 ml-auto"
          >
            <img
              src={item.logo}
              alt={item.company}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* 2. BODY ZONE: Supporting Content */}
        <div className="w-full flex-1 text-left relative z-10 flex flex-col justify-start gap-1.5 min-h-0 min-w-0">
          <div className="flex flex-col gap-0.5 typo-body-sm border-0">
            <div className="flex items-start gap-1.5 leading-snug">
              <span
                className="font-bold shrink-0 inline-flex items-center gap-1"
                style={{ color: item.color }}
              >
                <WebIcon name={roleIcon} className="w-3.5 h-3.5 shrink-0" />
                Vị trí:
              </span>
              <span className="font-semibold text-[var(--text-primary)] break-words">
                {item.roleVi}
              </span>
            </div>
            {item.managementVi && (
              <div className="flex items-start gap-1.5 leading-snug">
                <span
                  className="font-bold shrink-0 inline-flex items-center gap-1"
                  style={{ color: item.color }}
                >
                  <WebIcon name="users" className="w-3.5 h-3.5 shrink-0" />
                  Quản lý:
                </span>
                <span className="font-medium text-[var(--text-primary)] break-words">
                  {item.managementVi}
                </span>
              </div>
            )}
          </div>
          <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-snug text-left break-words [overflow-wrap:anywhere]">
            {renderFormattedText(item.descVi, {
              isCardReading: isCardBeingRead,
              keywordOffset: 0,
              totalKeywords: totalCardKeywords,
            })}
          </p>
          {item.descViPart2 && (
            <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-snug text-left break-words [overflow-wrap:anywhere] border-0">
              {renderFormattedText(item.descViPart2, {
                isCardReading: isCardBeingRead,
                keywordOffset: part1KwCount,
                totalKeywords: totalCardKeywords,
              })}
            </p>
          )}

          {isExpanded && (
            <p className="card-body-text typo-body-sm text-[var(--text-muted)] italic mt-0.5 break-words [overflow-wrap:anywhere] border-0">
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
              className="card-tag typo-button font-bold text-rose-600 dark:text-rose-400 mt-0.5 inline-flex items-center gap-1 cursor-pointer self-start shrink-0"
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

        {/* 3. FOOTER & HIGHLIGHT ZONE */}
        <div className="w-full flex items-center justify-between gap-2 typo-body-sm font-semibold relative z-10 shrink-0 min-w-0 border-0">
          <div className="flex items-start gap-1.5 min-w-0 flex-1" style={{ color: item.color }}>
            <WebIcon name={highlightIcon} className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="whitespace-normal break-words leading-snug text-left" title={item.highlightVi}>
              {item.highlightVi}
            </span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      id="letter-page-shell"
      className="relative w-full max-w-full min-w-0 h-full flex-1 flex flex-col items-center justify-start min-h-0 overflow-hidden bg-transparent"
    >
      <div
        ref={letterContainerRef}
        id="letter-page-container"
        data-element-name="Trang Thư Ngỏ"
        data-element-type="container"
        data-element-page="letter"
        data-element-parent="global-content-viewport"
        data-no-wheel-horizontal="true"
        onScroll={handleLetterContainerScroll}
        style={{
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          maxHeight: '100%',
          minHeight: '0px',
          flex: '1 1 0%',
          marginLeft: '0px',
          marginRight: '0px',
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          gap: '10px',
          rowGap: '10px',
          columnGap: '10px',
          borderRadius: '0px',
          background: 'transparent',
          containerType: 'size',
          containerName: 'letter-viewport',
        }}
        className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-col items-center justify-start p-0 gap-[10px] font-play text-left text-[var(--text-primary)] rounded-none overflow-y-auto overflow-x-hidden no-scrollbar z-10 select-none box-border"
      >
      <div
        id="letter-cards-track"
        data-element-name="Track Thư Ngỏ Hàng Dọc"
        data-element-type="container"
        data-element-page="letter"
        data-element-parent="letter-page-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '10px',
          rowGap: '10px',
          columnGap: '10px',
          width: '100%',
          maxWidth: '100%',
          minWidth: '0px',
          height: 'auto',
          marginLeft: '0px',
          marginRight: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          ...(viewportHeight
            ? ({
                '--letter-viewport-h': `${viewportHeight}px`,
              } as React.CSSProperties)
            : {}),
          ...(card1Size
            ? ({
                '--letter-card-1-w': `${card1Size.width}px`,
                '--letter-card-1-h': `${card1Size.height}px`,
              } as React.CSSProperties)
            : {}),
        }}
        className="flex flex-col items-stretch gap-[10px] w-full max-w-full min-w-0 m-0 h-auto overflow-x-hidden box-border"
      >
      {/* ========================================================================= */}
      {/* HÀNG DỌC 1: CARD THƯ NGỎ 1 (BẰNG 100% KÍCH THƯỚC MAIN CARD TRANG CHỦ)     */}
      {/* ========================================================================= */}
      <div
        id="letter-card-1"
        ref={letterCard1Ref}
        data-element-name="Thư ngỏ main card 1"
        data-element-type="card"
        data-main-card="true"
        data-floating-surface="main"
        data-element-page="letter"
        data-element-parent="letter-cards-track"
        onClick={() => {
          if (activeVerticalRow !== 0) {
            SoundEngine.playTap();
            scrollToLetterCard(0, true);
          }
        }}
        style={{
          width: '100%',
          maxWidth: '100%',
          minWidth: '100%',
          flex: '0 0 auto',
          height: '100cqh',
          minHeight: '100cqh',
          maxHeight: '100cqh',
          marginLeft: '0px',
          marginRight: '0px',
          padding: 'var(--main-card-padding, 15px)',
          gap: '12px',
          borderRadius: '0px',
        }}
        className="group/letter page-main-card floating-glass-surface floating-surface--main relative z-10 w-full max-w-full shrink-0 flex flex-col justify-start p-[15px] gap-[12px] rounded-none overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100"
      >
                <div
                  id="el-p1-div-85"
                  data-element-name="Lưới nội dung Thư ngỏ main card 1"
                  data-element-parent="letter-card-1"
                  data-card-layout={resolveAdaptiveCardLayout(5, true)}
                  data-subcard-count={5}
                  className="w-full max-w-full mx-auto min-h-0 h-full flex-1 grid grid-cols-1 md:grid-cols-12 gap-[12px] items-stretch auto-rows-auto p-0 rounded-none box-border"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    minHeight: '0px',
                    height: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingTop: '0px',
                    paddingRight: '0px',
                    paddingBottom: '0px',
                    paddingLeft: '0px',
                    gap: '12px',
                    rowGap: '12px',
                    columnGap: '12px',
                    borderRadius: '0px',
                  }}
                >
                    {/* THẺ BENTO 1: Video Card Thuyết Minh (Chiều cao khớp bằng Thông điệp hợp tác + Thương hiệu đồng hành) */}
                    <article
                      id="bento-letter-video"
                      data-element-name="Video card Thư ngỏ"
                      data-element-type="card"
                      data-media-card="video"
                      data-section-card="true"
                      data-element-page="letter"
                      data-element-parent="letter-card-1"
                      style={{ padding: '0px', borderRadius: 'var(--radius-card, 14px)' }}
                      className={`bento-card glass-card col-span-1 md:col-span-6 lg:col-span-7 rounded-[var(--radius-card,14px)] aspect-video md:aspect-auto min-h-[180px] md:min-h-0 self-stretch w-full h-full min-w-0 relative overflow-hidden flex flex-col justify-center items-center p-0 box-border transition-colors duration-200 group/video text-left ${
                        activeTargetId === 'bento-experience-intro' || activeTargetId === 'callout-salutation'
                          ? 'ring-2 ring-cyan-500/80 shadow-[0_0_24px_rgba(6,182,212,0.3)]'
                          : ''
                      }`}
                    >
                      <div
                        className="relative w-full h-full flex-1 rounded-[inherit] overflow-hidden min-h-0 flex items-center justify-center"
                      >
                        <DualLayerVideoPlayer
                          video1Id={LETTER_VIDEO_1_ID}
                          video1Src={LETTER_SLIDE_1_VIDEO_URL}
                          video2Id={LETTER_VIDEO_2_ID}
                          video2Src={LETTER_SLIDE_2_VIDEO_URL}
                          autoPlayVideo1={true}
                          muteVideo1={true}
                          loopVideo1={true}
                          className="absolute inset-0 z-0 pointer-events-auto"
                        />
                      </div>
                    </article>

                    {/* CỘT PHẢI HÀNG 1 (5/12 cột trên Desktop): Thông Điệp Hợp Tác + Thương Hiệu Đồng Hành */}
                    <div
                      id="letter-intro-right-stack"
                      className="letter-right-stack col-span-1 md:col-span-6 lg:col-span-5 flex flex-col gap-[12px] w-full h-full min-h-0 min-w-0"
                      style={{ gap: '12px', padding: '0px', background: 'transparent', border: 'none', boxShadow: 'none' }}
                    >
                      {/* THẺ BENTO 2: Thông Điệp Hợp Tác */}
                      <article
                        id="bento-commitment"
                        data-element-name="Thẻ Bento Thông Điệp Hợp Tác"
                        data-element-type="card"
                        data-section-card="true"
                        data-element-page="letter"
                        style={{ padding: '12px', gap: '8px', borderRadius: 'var(--radius-card, 24px)' }}
                        className={`bento-card glass-card h-auto flex-1 min-h-0 p-[12px] rounded-[14px] flex flex-col justify-between gap-[8px] relative overflow-hidden transition-colors duration-200 w-full min-w-0 ${
                          activeTargetId === 'callout-salutation' || activeTargetId === 'bento-experience-intro' || activeTargetId === 'bento-commitment'
                            ? 'ring-2 ring-cyan-500/80 shadow-[0_0_24px_rgba(6,182,212,0.25)]'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between shrink-0 gap-2 min-w-0 border-0">
                          <div className="card-header-sync inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-300 leading-tight min-w-0">
                            <WebIcon
                              name="book"
                              size={16}
                              className="w-[16px] h-[16px] shrink-0 card-title-icon text-cyan-600 dark:text-cyan-300"
                              style={{ width: '16px', height: '16px' }}
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

                        <div className="py-0 space-y-1.5 flex flex-col justify-start text-left min-w-0">
                          <h3
                            id="callout-salutation"
                            className="card-title typo-h4 font-play tracking-tight transition-all duration-300 break-words text-[var(--text-primary)]"
                          >
                            Kính chào {companyDisplay}!
                          </h3>

                          <p className="card-body typo-body-sm leading-snug text-[var(--text-secondary)] break-words [overflow-wrap:anywhere]">
                            Tôi là{' '}
                            <strong className="font-bold text-[var(--text-primary)]">
                              Nguyễn Hùng Thái
                            </strong>
                            , Trưởng phòng Chăm sóc Khách hàng với hơn{' '}
                            <span className="font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
                              22 năm kinh nghiệm
                            </span>{' '}
                            trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.
                          </p>
                        </div>
                      </article>

                      {/* THẺ BENTO 6 (Đổi vị trí lên cùng cột phải Hàng 1): Thương hiệu đồng hành */}
                      <article
                        id="bento-brands-marquee"
                        data-element-name="Thẻ Bento Thương Hiệu Đồng Hành"
                        data-element-type="card"
                        data-section-card="true"
                        data-element-page="letter"
                        style={{ padding: '12px', gap: '8px', borderRadius: 'var(--radius-card, 24px)' }}
                        className="partner-card bento-card glass-card shrink-0 w-full h-auto p-[12px] rounded-[14px] flex flex-col justify-start gap-[8px] transition-colors duration-200 group/marquee min-w-0"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 shrink-0 min-w-0 border-0">
                          <div className="card-header-sync inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 leading-tight min-w-0">
                            <WebIcon
                              name="briefcase"
                              size={16}
                              className="w-[16px] h-[16px] shrink-0 card-title-icon text-blue-600 dark:text-cyan-400"
                              style={{ width: '16px', height: '16px' }}
                            />
                            <h3
                              className="card-title card-title-synced typo-h3 font-play text-blue-600 dark:text-cyan-400 whitespace-normal break-words"
                              data-card-title="true"
                            >
                              Thương hiệu đồng hành
                            </h3>
                          </div>
                          <span className="typo-badge font-bold font-play tabular-nums text-blue-700 dark:text-blue-200 whitespace-nowrap shrink-0">
                            8 Tập đoàn
                          </span>
                        </div>

                        <div
                          id="brands-bento-grid"
                          className="flex flex-row flex-nowrap items-stretch gap-[12px] w-full overflow-hidden min-w-0"
                        >
                          <div className="animate-marquee-ltr flex flex-row items-center gap-[12px]">
                            {[...EXPERIENCE_BRANDS_MARQUEE, ...EXPERIENCE_BRANDS_MARQUEE].map((item, idx) => (
                              <div
                                key={`${item.id}-${idx}`}
                                data-subcard="true"
                                className="sub-card letter-subcard partner-brand-tile group/logo shrink-0 inline-flex flex-row flex-nowrap items-center gap-2 whitespace-nowrap px-2.5 py-1.5 rounded-[var(--radius-subcard,16px)] transition-colors duration-200"
                                title={item.company}
                              >
                                <div
                                  className="partner-logo-badge w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-full border-0 shadow-none group-hover/logo:scale-105 transition-all duration-300 relative shrink-0 p-0 overflow-hidden"
                                  style={{
                                    borderRadius: '9999px',
                                    background: 'var(--surface-secondary-bg, var(--bg-card))',
                                    border: 'none',
                                    padding: '0px',
                                  }}
                                >
                                  <img
                                    src={item.logo}
                                    alt={item.company}
                                    loading="lazy"
                                    decoding="async"
                                    className="partner-logo-img w-full h-full object-cover rounded-full transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span className="card-tag typo-body-sm font-semibold font-play text-[var(--text-primary)] group-hover/logo:text-blue-700 dark:group-hover/logo:text-cyan-300 transition-colors leading-tight whitespace-nowrap shrink-0">
                                  {item.company}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    </div>

                    {/* HÀNG 2 CÙNG HÀNG: GIÁ TRỊ CỐT LÕI (8/12) + CHÂM NGÔN PHỤNG SỰ (4/12) */}
                    <div
                      id="card-core-values-pursued"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)' }}
                      className={`bento-view-card col-span-1 md:col-span-7 lg:col-span-8 w-full h-full min-h-0 p-[12px] gap-[10px] transition-all duration-200 flex flex-col items-start justify-between group/values z-10 text-left rounded-[14px] min-w-0 ${getGlassCardClass()} ${
                        activeTargetId === 'card-core-values-pursued'
                          ? 'ring-2 ring-amber-400 dark:ring-cyan-400 shadow-[0_0_24px_rgba(251,191,36,0.35)]'
                          : ''
                      }`}
                    >
                      <AnimatedCardTitle
                        iconName="trophy"
                        title="Giá trị cốt lõi"
                        colorPreset="orange"
                      />

                      <div
                        id="core-values-grid"
                        data-card-layout={resolveAdaptiveCardLayout(CORE_VALUES_DATA.length, false)}
                        data-subcard-count={CORE_VALUES_DATA.length}
                        className="grid grid-cols-2 md:grid-cols-4 gap-[10px] auto-rows-auto items-stretch w-full flex-1 min-h-0 min-w-0"
                        style={{ gap: '10px', rowGap: '10px', columnGap: '10px' }}
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
                              style={{ borderRadius: 'var(--radius-subcard, 14px)' }}
                              className={`sub-card letter-subcard relative overflow-hidden flex flex-col justify-between h-full transition-colors duration-200 text-left group rounded-[14px] min-w-0 ${
                                isValBeingRead
                                  ? 'ring-2 ring-emerald-500 dark:ring-cyan-400 shadow-[0_0_24px_rgba(16,185,129,0.28)]'
                                  : ''
                              }`}
                            >
                              <div
                                className="absolute inset-0 opacity-[0.06] dark:opacity-[0.14] pointer-events-none"
                                style={{
                                  background: `radial-gradient(circle at bottom right, ${val.colorTheme.primary}, transparent 70%)`,
                                }}
                              />

                              <div className="flex items-center justify-between relative z-10 gap-1 min-w-0">
                                <div
                                  className={`subcard-header-sync flex items-center gap-1.5 min-w-0 flex-1 ${val.colorTheme.text}`}
                                >
                                  <WebIcon name={valIconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                  <h4
                                    className={`card-title subcard-title-synced typo-h4 tracking-tight font-play leading-snug break-words min-w-0 ${val.colorTheme.text}`}
                                    data-subcard-title="true"
                                  >
                                    {formatCardTitle(val.titleVi)}
                                  </h4>
                                </div>

                                {isValBeingRead && (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <AudioWaveformVisualizer isPlaying={!isPaused} barCount={4} size="sm" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 flex items-start relative z-10 text-left min-w-0">
                                <p className="card-body-text typo-body-sm text-[var(--text-secondary)] font-normal leading-snug break-words">
                                  {val.descVi}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* THẺ BENTO 7 (Cùng hàng với Giá trị cốt lỗi): Tuyên ngôn & Danh ngôn Phụng sự */}
                    <article
                      id="quote-banner-slide-1"
                      data-element-name="Thẻ Bento Danh Ngôn Phụng Sự"
                      data-element-type="card"
                      data-section-card="true"
                      data-element-page="letter"
                      style={{ padding: '16px', borderRadius: 'var(--radius-card, 14px)' }}
                      className={`motto-card bento-card glass-card col-span-1 md:col-span-5 lg:col-span-4 relative rounded-[14px] p-4 flex flex-col justify-between gap-3 transition-colors duration-200 group/quote w-full h-full min-h-0 min-w-0 ${
                        activeTargetId === 'quote-banner-slide-1'
                          ? 'ring-2 ring-sky-500/50 dark:ring-cyan-400/50'
                          : ''
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/15 blur-3xl rounded-full" />
                      </div>

                      <div className="flex items-center justify-between gap-2 relative z-10 min-w-0 shrink-0 border-0">
                        <div className="card-header-sync inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 leading-tight min-w-0">
                          <WebIcon
                            name="quote"
                            size={14}
                            className="w-[14px] h-[14px] shrink-0 text-amber-600 dark:text-amber-300"
                          />
                          <h3
                            className="card-title card-title-synced typo-badge font-play font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider whitespace-normal break-words"
                            data-card-title="true"
                          >
                            Châm ngôn phụng sự
                          </h3>
                        </div>
                      </div>

                      <div className="relative z-10 my-auto py-2 px-1 flex flex-col gap-2">
                        <span className="text-3xl font-serif text-amber-500/40 dark:text-amber-400/30 leading-none select-none">“</span>
                        <p
                          className="motto-quote-text typo-h3 font-handwriting font-quote font-bold tracking-wide text-amber-800 dark:text-amber-100 text-left drop-shadow-xs select-none relative z-10 -mt-3 pl-3 italic"
                          style={{ fontFamily: "var(--font-quote, 'Dancing Script', cursive)" }}
                        >
                          Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.
                        </p>
                        <span className="text-3xl font-serif text-amber-500/40 dark:text-amber-400/30 leading-none select-none text-right">”</span>
                      </div>
                    </article>
                </div>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG DỌC 2: CARD THƯ NGỎ 2 VÀ CARD THƯ NGỎ 3 NẰM NGANG BÊN PHẢI (NHÔ MÉP) */}
      {/* ========================================================================= */}
      <div
        id="letter-cards-row-2-3"
        ref={letterCardsRow23Ref}
        data-element-name="Hàng ngang Card thư ngỏ 2 và 3"
        onScroll={handleRow23HorizontalScroll}
        onTouchStart={(e) => {
          if (e.touches.length !== 1) return;
          row23TouchStartXRef.current = e.touches[0].clientX;
          row23TouchStartYRef.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const startX = row23TouchStartXRef.current;
          const startY = row23TouchStartYRef.current;
          row23TouchStartXRef.current = null;
          row23TouchStartYRef.current = null;
          if (startX === null || startY === null || e.changedTouches.length === 0) return;
          const dx = e.changedTouches[0].clientX - startX;
          const dy = e.changedTouches[0].clientY - startY;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
            if (dx < 0) {
              scrollToLetterCard(2, true);
            } else {
              scrollToLetterCard(1, true);
            }
          }
        }}
        className="relative w-full max-w-full min-w-full m-0 flex flex-row flex-nowrap gap-[10px] items-stretch overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory shrink-0 box-border"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: '10px',
          rowGap: '10px',
          columnGap: '10px',
          width: '100%',
          maxWidth: '100%',
          minWidth: '100%',
          height: '100cqh',
          minHeight: '100cqh',
          maxHeight: '100cqh',
          flex: '0 0 auto',
          marginLeft: '0px',
          marginRight: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'auto',
        }}
      >
        {/* Card 2: Hành trình khởi đầu sự nghiệp (2002 - 2013) */}
        <div
          id="letter-card-2"
          data-element-name="Thư ngỏ main card 2"
          data-element-type="card"
          data-main-card="true"
          data-floating-surface="main"
          data-element-page="letter"
          data-element-parent="letter-cards-row-2-3"
          onClick={() => {
            if (activeVerticalRow !== 1) {
              SoundEngine.playTap();
              scrollToLetterCard(lastRow23SlideRef.current, true);
              return;
            }
            const row = letterCardsRow23Ref.current;
            if (row && row.scrollLeft > 40) {
              scrollToLetterCard(1, true);
            }
          }}
          style={{
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
            flex: '0 0 100%',
            height: '100%',
            minHeight: '100%',
            maxHeight: '100%',
            margin: '0px',
            scrollSnapAlign: 'start',
            padding: 'var(--main-card-padding, 15px)',
            gap: '12px',
            borderRadius: '0px',
          }}
          className="page-main-card floating-glass-surface floating-surface--main shrink-0 snap-start relative z-10 flex flex-col justify-start overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100"
        >
          <div
            id="letter-slide-2-grid"
            data-element-name="Lưới nội dung Thư ngỏ main card 2"
            data-element-parent="letter-card-2"
            data-card-layout={resolveAdaptiveCardLayout(4, false)}
            data-subcard-count={4}
            className="w-full max-w-full min-w-0 min-h-0 flex-1 h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-[12px] p-0 items-stretch bg-transparent box-border"
            style={{ gap: '12px', rowGap: '12px', columnGap: '12px', padding: '0px', background: 'transparent', width: '100%', height: '100%', minHeight: '0px' }}
          >
            {CAREER_MILESTONES_DATA.slice(0, 4).map((item) =>
              renderCareerCard(item, 'min-w-0 col-span-1', false)
            )}
          </div>
        </div>

        {/* Card 3: Quản trị quy mô lớn & Chuyển đổi số (2013 - 2023) — Nằm bên phải Card 2 */}
        <div
          id="letter-card-3"
          data-element-name="Thư ngỏ main card 3"
          data-element-type="card"
          data-main-card="true"
          data-floating-surface="main"
          data-element-page="letter"
          data-element-parent="letter-cards-row-2-3"
          onClick={() => {
            if (activeVerticalRow !== 1) {
              SoundEngine.playTap();
              scrollToLetterCard(2, true);
              return;
            }
            const row = letterCardsRow23Ref.current;
            if (row && row.scrollLeft < 40) {
              scrollToLetterCard(2, true);
            }
          }}
          style={{
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
            flex: '0 0 100%',
            height: '100%',
            minHeight: '100%',
            maxHeight: '100%',
            margin: '0px',
            scrollSnapAlign: 'start',
            padding: 'var(--main-card-padding, 15px)',
            gap: '12px',
            borderRadius: '0px',
          }}
          className="page-main-card floating-glass-surface floating-surface--main shrink-0 snap-start relative z-10 flex flex-col justify-start overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100"
        >
          <div
            id="letter-slide-3-grid"
            data-element-name="Lưới nội dung Thư ngỏ main card 3"
            data-element-parent="letter-card-3"
            data-card-layout={resolveAdaptiveCardLayout(4, false)}
            data-subcard-count={4}
            className="w-full max-w-full min-w-0 min-h-0 flex-1 h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-[12px] p-0 items-stretch bg-transparent box-border"
            style={{ gap: '12px', rowGap: '12px', columnGap: '12px', padding: '0px', background: 'transparent', width: '100%', height: '100%', minHeight: '0px' }}
          >
            {CAREER_MILESTONES_DATA.slice(4, 8).map((item) =>
              renderCareerCard(item, 'min-w-0 col-span-1', false)
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG DỌC 3: CARD THƯ NGỎ 4 (KÍCH THƯỚC BẰNG CARD THƯ NGỎ 1)               */}
      {/* ========================================================================= */}
      <div
        id="letter-card-4"
        data-element-name="Thư ngỏ main card 4"
        data-element-type="card"
        data-main-card="true"
        data-floating-surface="main"
        data-element-page="letter"
        data-element-parent="letter-cards-track"
        onClick={() => {
          if (activeVerticalRow !== 2) {
            SoundEngine.playTap();
            scrollToLetterCard(3, true);
          }
        }}
        style={{
          width: '100%',
          maxWidth: '100%',
          minWidth: '100%',
          flex: '0 0 auto',
          height: '100cqh',
          minHeight: '100cqh',
          maxHeight: '100cqh',
          marginLeft: '0px',
          marginRight: '0px',
          padding: 'var(--main-card-padding, 15px)',
          gap: '12px',
          borderRadius: '0px',
        }}
        className="page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[12px] rounded-none overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100"
      >
        <div
          id="letter-slide-4-bento-grid"
          data-element-name="Lưới nội dung Thư ngỏ main card 4"
          data-element-parent="letter-card-4"
          data-card-layout={resolveAdaptiveCardLayout(3, true)}
          data-subcard-count={3}
          className="w-full max-w-full min-w-0 min-h-0 flex-1 h-full grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-auto gap-[12px] p-0 items-stretch bg-transparent box-border"
          style={{ gap: '12px', rowGap: '12px', columnGap: '12px', padding: '0px', background: 'transparent', width: '100%', height: '100%', minHeight: '0px' }}
        >
                    {/* BENTO CARD 1 (4/12 cols): TRIẾT LÝ QUẢN TRỊ */}
                    <div
                      id="card-philosophy"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)' }}
                      className={`bento-view-card col-span-1 md:col-span-3 lg:col-span-4 w-full h-full min-h-0 min-w-0 relative overflow-hidden p-[12px] gap-[10px] rounded-[14px] group text-left flex flex-col justify-between transition-colors duration-200 ${getGlassCardClass()} ${
                        activeTargetId === 'card-philosophy-gratitude' || activeTargetId === 'card-philosophy'
                          ? 'ring-2 ring-purple-500/80 dark:ring-cyan-400/80 shadow-[0_0_25px_rgba(168,85,247,0.22)]'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-start text-left w-full gap-[10px] min-w-0">
                        <AnimatedCardTitle
                          iconName="sparkles"
                          title="Triết Lý Quản Trị"
                          colorPreset="purple"
                        />

                        <p className="card-body-text typo-body-sm leading-snug text-[var(--text-primary)] break-words [overflow-wrap:anywhere]">
                          Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững.
                        </p>

                        <p className="card-body-text typo-body-sm leading-snug text-[var(--text-secondary)] break-words [overflow-wrap:anywhere]">
                          Một dịch vụ xuất sắc bắt nguồn từ sự thấu hiểu sâu sắc hành trình khách hàng, chuẩn hóa các điểm chạm và tối ưu hóa năng suất vận hành toàn diện.
                        </p>
                      </div>

                      <div
                        data-subcard="true"
                        style={{ padding: '10px 12px', borderRadius: 'var(--radius-subcard, 14px)' }}
                        className="sub-card letter-subcard w-full p-[10px] rounded-[var(--radius-subcard,14px)] flex items-center gap-2.5 min-w-0"
                      >
                        <WebIcon name="target" className="w-4 h-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                        <span className="typo-caption font-semibold text-purple-700 dark:text-cyan-300">
                          Khách hàng là trung tâm • Vận hành bền vững
                        </span>
                      </div>
                    </div>

                    {/* BENTO CARD 2 (4/12 cols): BA NGUYÊN TẮC CỐT LÕI */}
                    <div
                      id="card-three-principles"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)', containerType: 'inline-size', containerName: 'principles-card' }}
                      className={`bento-view-card col-span-1 md:col-span-3 lg:col-span-4 w-full h-full min-h-0 min-w-0 relative overflow-hidden p-[12px] gap-[10px] rounded-[14px] group text-left flex flex-col justify-between transition-colors duration-200 ${getGlassCardClass()} ${
                        activeTargetId === 'card-three-principles'
                          ? 'ring-2 ring-purple-500/80 dark:ring-cyan-400/80 shadow-[0_0_25px_rgba(168,85,247,0.22)]'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-start text-left w-full gap-1.5 min-w-0">
                        <AnimatedCardTitle
                          iconName="layers"
                          title="Nguyên Tắc Cốt Lõi"
                          colorPreset="blue"
                        />

                        <p className="card-tag typo-body-sm font-semibold text-[var(--text-secondary)] tracking-wide font-mono">
                          Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi:
                        </p>
                      </div>

                      <div
                        data-card-layout={resolveAdaptiveCardLayout(OPERATIONAL_PRINCIPLES_DATA.length, false)}
                        data-subcard-count={OPERATIONAL_PRINCIPLES_DATA.length}
                        className="letter-principles-subgrid grid grid-cols-1 auto-rows-auto gap-[10px] w-full items-stretch min-w-0 flex-1 min-h-0"
                        style={{ gap: '10px', rowGap: '10px', columnGap: '10px' }}
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
                              style={{ padding: '10px 12px', borderRadius: 'var(--radius-subcard, 14px)' }}
                              className="sub-card letter-subcard h-full p-[10px] rounded-[14px] text-left flex flex-col justify-center gap-1 transition-colors duration-200 min-w-0"
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
                              <p className="card-body-text typo-body-sm text-[var(--text-secondary)] leading-snug break-words [overflow-wrap:anywhere]">
                                {principle.descVi}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* BENTO CARD 3 (4/12 cols): TÂM THƯ ĐỒNG HÀNH, LỜI KẾT & CHỮ KÝ */}
                    <div
                      id="bento-companion-letter"
                      data-element-type="card"
                      data-section-card="true"
                      style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)' }}
                      className={`bento-view-card col-span-1 md:col-span-6 lg:col-span-4 w-full h-full min-h-0 min-w-0 relative overflow-hidden p-[12px] gap-[10px] rounded-[14px] group text-left flex flex-col justify-between transition-colors duration-200 ${getGlassCardClass()} ${
                        activeTargetId === 'card-philosophy-gratitude'
                          ? 'ring-2 ring-rose-500/70 dark:ring-cyan-400/70 shadow-[0_0_25px_rgba(244,63,94,0.18)]'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col gap-[8px] min-w-0">
                        <AnimatedCardTitle
                          iconName="heart"
                          title="Tâm Thư Đồng Hành"
                          colorPreset="rose"
                        />

                        <div className="card-body-text typo-body-sm leading-snug text-[var(--text-secondary)] space-y-1.5 break-words [overflow-wrap:anywhere]">
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
                        style={{ padding: '10px 12px', borderRadius: 'var(--radius-subcard, 14px)' }}
                        className="sub-card letter-subcard w-full p-[10px] rounded-[var(--radius-subcard,14px)] relative flex items-center gap-2.5 min-w-0"
                      >
                        <span className="text-amber-600 dark:text-amber-400 font-play font-bold text-xl leading-none shrink-0">
                          “
                        </span>
                        <p className="card-body-text typo-body-sm text-amber-900 dark:text-amber-300 font-semibold italic leading-snug break-words [overflow-wrap:anywhere]">
                          &ldquo;Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.&rdquo;
                        </p>
                      </div>

                      <div className="card-body-text typo-body-sm leading-snug text-[var(--text-secondary)] space-y-1 break-words [overflow-wrap:anywhere]">
                        <p>
                          Tôi mong muốn được đồng hành cùng{' '}
                          <strong className="font-bold text-[var(--text-primary)]">{companyDisplay}</strong> trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững.
                        </p>
                        <p className="font-bold text-cyan-700 dark:text-cyan-300">
                          Xin trân trọng cảm ơn {companyDisplay} đã dành thời gian lắng nghe!
                        </p>
                      </div>

                      {/* Bottom - Signature Block */}
                      <div className="w-full flex flex-wrap items-center justify-between gap-2 relative z-10 text-left border-0">
                        <div className="flex items-center gap-3">
                          <div className="-ml-1 shrink-0">
                            <SignatureSvg />
                          </div>
                        </div>
                      </div>
                    </div>

        </div>
      </div>
      </div>
      </div>

      {/* ========================================================================= */}
      {/* NÚT TRÒN ĐIỀU HƯỚNG TRÊN / DƯỚI (HIỆN KHI KHÔNG THẤY NHÔ MÉP TRÊN/DƯỚI)   */}
      {/* ========================================================================= */}
      {(activeVerticalRow > 0 && !verticalPeekState.hasTopPeek) ||
      (activeVerticalRow < 2 && !verticalPeekState.hasBottomPeek) ? (
        <div
          aria-label="Điều hướng thẻ dọc Thư ngỏ"
          className="pointer-events-none absolute inset-0 z-30"
          style={{ position: 'absolute', inset: 0 }}
        >
          {activeVerticalRow > 0 && !verticalPeekState.hasTopPeek && (
            <button
              type="button"
              id="letter-nav-up-btn"
              onClick={() => {
                SoundEngine.playTap();
                const targetSlide = activeVerticalRow === 2 ? lastRow23SlideRef.current : 0;
                scrollToLetterCard(targetSlide, true);
              }}
              aria-label="Chuyển lên thẻ trên"
              title="Lên thẻ trên"
              className="pointer-events-auto absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white border border-slate-200/80 dark:border-white/20 shadow-[0_6px_20px_rgba(15,23,42,0.22)] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-108 active:scale-95"
            >
              <WebIcon name="chevron-up" className="w-5 h-5" />
            </button>
          )}
          {activeVerticalRow < 2 && !verticalPeekState.hasBottomPeek && (
            <button
              type="button"
              id="letter-nav-down-btn"
              onClick={() => {
                SoundEngine.playTap();
                const targetSlide = activeVerticalRow === 0 ? lastRow23SlideRef.current : 3;
                scrollToLetterCard(targetSlide, true);
              }}
              aria-label="Chuyển xuống thẻ dưới"
              title="Xuống thẻ dưới"
              className="pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white border border-slate-200/80 dark:border-white/20 shadow-[0_6px_20px_rgba(15,23,42,0.22)] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-108 active:scale-95"
            >
              <WebIcon name="chevron-down" className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* THANH ĐIỀU KHIỂN THUYẾT TRÌNH TỰ ĐỘNG KÈM NHẠC NỀN LO-FI (AUTOPLAY DOCK)   */}
      {/* ========================================================================= */}
      {isAutoplayPresentation && (
        <div
          role="region"
          aria-label="Điều khiển thuyết trình tự động"
          className="theme-popup fixed bottom-[calc(10%+14px)] left-1/2 -translate-x-1/2 z-50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-[14px] sm:rounded-full flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-center gap-2 sm:gap-3 max-w-[95vw] animate-slide-up select-none font-play"
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
              className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-sm transition cursor-pointer"
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
            className="px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white typo-badge font-bold flex items-center gap-1 shadow-sm transition cursor-pointer shrink-0"
            title="Dừng chế độ Thuyết trình Tự động"
          >
            <WebIcon name="stop" className="w-3 h-3" />
            <span>Dừng</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default LetterView;
