'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
// Icons migrated to WebIcon (Hugeicons)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCardTitle } from '@/lib/utils';
import { SiteTheme } from '@/types';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';

const Sparkles = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <WebIcon name="sparkles" className={className} style={style} />;
const ChevronLeft = ({ className }: { className?: string }) => <WebIcon name="chevron-left" className={className} />;
const ChevronRight = ({ className }: { className?: string }) => <WebIcon name="chevron-right" className={className} />;
const Pause = ({ className }: { className?: string }) => <WebIcon name="pause" className={className} />;
const Play = ({ className }: { className?: string }) => <WebIcon name="play" className={className} />;
const MapPin = ({ className }: { className?: string }) => <WebIcon name="location" className={className} />;
const Home = ({ className }: { className?: string }) => <WebIcon name="grid" className={className} />;
const Mail = ({ className }: { className?: string }) => <WebIcon name="mail" className={className} />;
const Phone = ({ className }: { className?: string }) => <WebIcon name="phone" className={className} />;
const Globe = ({ className }: { className?: string }) => <WebIcon name="globe" className={className} />;
const Volume2 = ({ className }: { className?: string }) => <WebIcon name="volume" className={className} />;
const VolumeX = ({ className }: { className?: string }) => <WebIcon name="mute" className={className} />;
const X = ({ className }: { className?: string }) => <WebIcon name="cancel" className={className} />;
const Target = ({ className }: { className?: string }) => <WebIcon name="target" className={className} />;
const User = ({ className }: { className?: string }) => <WebIcon name="user" className={className} />;
const BarChart3 = ({ className }: { className?: string }) => <WebIcon name="chart" className={className} />;
const ArrowRight = ({ className }: { className?: string }) => <WebIcon name="arrow-right" className={className} />;
const Heart = ({ className }: { className?: string }) => <WebIcon name="heart" className={className} />;
const Leaf = ({ className }: { className?: string }) => <WebIcon name="leaf" className={className} />;
const Star = ({ className }: { className?: string }) => <WebIcon name="star" className={className} />;
const Award = ({ className }: { className?: string }) => <WebIcon name="award" className={className} />;
const RotateCw = ({ className }: { className?: string }) => <WebIcon name="rotate-cw" className={className} />;
const RotateCcw = ({ className }: { className?: string }) => <WebIcon name="rotate-ccw" className={className} />;
const Clock = ({ className }: { className?: string }) => <WebIcon name="clock" className={className} />;
const HeartHandshake = ({ className }: { className?: string }) => <WebIcon name="heart-handshake" className={className} />;
const Navigation = ({ className }: { className?: string }) => <WebIcon name="navigation" className={className} />;
const Bot = ({ className }: { className?: string }) => <WebIcon name="bot" className={className} />;

import { findBestVoice, speakSiteText, stopActiveSpeech } from '@/utils/speechVoice';
import {
  ABOUT_PROFILE_STATS,
  PERSONAL_DEMOGRAPHICS,
  SERVICE_PHILOSOPHY_VALUES,
  ECOSYSTEM_BANNERS,
  EcosystemBannerItem,
} from '@/data/aboutData';
import { getSavedMutedPref, saveMutedPref, AUDIO_PREF_EVENT } from '@/utils/audioPreference';

// Định nghĩa 4 bộ màu sắc chủ đạo Bento (Bento Palette Theme)
export type BentoPaletteType = 'pastel' | 'cyber' | 'emerald' | 'rose';

export interface BentoPaletteConfig {
  id: BentoPaletteType;
  name: string;
  badge: string;
  iconColor: string;
  dotColor: string;
  pillColor: string;
  accentBorder: string;
  cardGlow: string;
  tintBg: string;
}

export const BENTO_PALETTES: Record<BentoPaletteType, BentoPaletteConfig> = {
  pastel: {
    id: 'pastel',
    name: 'Pastel Sáng',
    badge: '🌸 Pastel Sáng',
    iconColor: 'text-purple-600 dark:text-purple-400',
    dotColor: 'bg-gradient-to-r from-purple-400 to-pink-400',
    pillColor: 'from-purple-600 via-indigo-600 to-pink-600',
    accentBorder: 'border-purple-200/80 dark:border-purple-800/60',
    cardGlow: 'hover:shadow-[0_10px_28px_rgba(168,85,247,0.15)]',
    tintBg: 'from-purple-50/40 via-sky-50/20 to-pink-50/40 dark:from-purple-950/20 dark:via-slate-900/30 dark:to-pink-950/20',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Neon',
    badge: '⚡ Cyber Neon',
    iconColor: 'text-cyan-500 dark:text-cyan-300',
    dotColor: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    pillColor: 'from-cyan-500 via-blue-600 to-fuchsia-600',
    accentBorder: 'border-cyan-400/60 dark:border-cyan-400/70',
    cardGlow: 'hover:shadow-[0_10px_32px_rgba(6,182,212,0.3)] shadow-[0_0_12px_rgba(6,182,212,0.12)]',
    tintBg: 'from-cyan-950/20 via-blue-950/20 to-fuchsia-950/20 dark:from-cyan-950/45 dark:via-slate-950/40 dark:to-fuchsia-950/40',
  },
  emerald: {
    id: 'emerald',
    name: 'Royal Emerald',
    badge: '💎 Royal Emerald',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    dotColor: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    pillColor: 'from-emerald-600 via-teal-600 to-amber-500',
    accentBorder: 'border-emerald-300/80 dark:border-emerald-600/70',
    cardGlow: 'hover:shadow-[0_10px_30px_rgba(16,185,129,0.22)] shadow-[0_0_12px_rgba(16,185,129,0.1)]',
    tintBg: 'from-emerald-50/50 via-teal-50/30 to-amber-50/20 dark:from-emerald-950/35 dark:via-teal-950/25 dark:to-slate-900/30',
  },
  rose: {
    id: 'rose',
    name: 'Rose Gold',
    badge: '✨ Rose Gold',
    iconColor: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-gradient-to-r from-rose-400 to-amber-400',
    pillColor: 'from-rose-500 via-pink-600 to-amber-500',
    accentBorder: 'border-rose-300/80 dark:border-rose-600/70',
    cardGlow: 'hover:shadow-[0_10px_30px_rgba(244,63,94,0.22)] shadow-[0_0_12px_rgba(244,63,94,0.1)]',
    tintBg: 'from-rose-50/50 via-pink-50/30 to-orange-50/20 dark:from-rose-950/35 dark:via-pink-950/25 dark:to-slate-900/30',
  },
};

// Video 1: Video phát ngầm mặc định của trang Giới Thiệu
const ABOUT_IDLE_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/e48a67884f3a52e8a68cf06b97979f3b22835ec92bf466a058c0d78da97c83b0.mp4';

// Video 2: Video giới thiệu bản thân chi tiết
const ABOUT_INTRO_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/5f84521bf5c51ff234fb0f4029fb9fba29e7e386f13912a56bc7ee25aebcbc10.mp4';

const getWebIconName = (name: string): string => {
  const norm = name.toLowerCase();
  if (norm === 'barchart3') return 'chart';
  if (norm === 'building2') return 'briefcase';
  if (norm === 'mappin') return 'location';
  if (norm === 'linkedin') return 'link';
  return norm;
};

// Danh sách các Slide trong trang Giới Thiệu (Tất cả hợp nhất trong 1 Thẻ Bento Box Grid)
const ABOUT_SLIDES = [
  { id: 0, title: 'Tổng Quan Bento Grid', icon: 'user', subtitle: 'Chân dung, Thông tin cá nhân & Trụ cột triết lý' },
];

export interface AboutViewProps {
  currentTheme?: SiteTheme;
  onNavigatePage?: (pageIndex: number) => void;
  onShowNotification?: (msg: string) => void;
  onOpenMapModal?: (loc: any) => void;
  onOpenBentoFocusModal?: (key: any) => void;
}

/* Tích Hợp Hệ Sinh Thái & Thông Tin Cá Nhân (Phóng to, Nền Trong Suốt, Xoay Quanh Nhân Vật) */
interface IntegrationsUIProps {
  onOpenMap?: (location: { type: 'tam_tru' | 'cu_tru'; title: string; address: string; query: string }) => void;
  onNavigatePage?: (pageIndex: number) => void;
  onSetHeroMedia?: (media: 'video' | 'map') => void;
  onSetHeroMapType?: (type: 'tam_tru' | 'cu_tru') => void;
}

const IntegrationsUI: React.FC<IntegrationsUIProps> = ({ onOpenMap, onNavigatePage, onSetHeroMedia, onSetHeroMapType }) => {
  const { showToast } = useToast();
  const [isHold, setIsHold] = useState(false);
  const [activeIcon, setActiveIcon] = useState<number | null>(null);

  const { cardStyle } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;

  const personalItems = [
    {
      id: 'birthday',
      icon: 'calendar',
      label: 'Sinh nhật',
      shortLabel: '22/06/1984',
      value: '22/06/1984 (Giáp Tý - Mệnh Hải Trung Kim, Cung Đoài Kim)',
      color: '#F59E0B',
      r: 175,
      t: '26s',
      dir: 'normal',
      rdir: 'reverse',
      deg: 0,
      type: 'text' as const,
    },
    {
      id: 'horoscope',
      icon: 'sparkles',
      label: 'Tử vi phong thủy',
      shortLabel: 'Giáp Tý (1984)',
      value: 'Giáp Tý · Mệnh Hải Trung Kim · Cung Đoài Kim',
      color: '#A855F7',
      r: 175,
      t: '26s',
      dir: 'normal',
      rdir: 'reverse',
      deg: 90,
      type: 'page' as const,
      pageIndex: 10,
    },
    {
      id: 'temp_residence',
      icon: 'map-pin',
      label: 'Tạm trú hiện tại',
      shortLabel: 'Quận 7, TP.HCM',
      value: 'Quận 7, TP. Hồ Chí Minh',
      color: '#0284C7',
      r: 175,
      t: '26s',
      dir: 'normal',
      rdir: 'reverse',
      deg: 180,
      type: 'map' as const,
      mapData: {
        type: 'tam_tru' as const,
        title: 'Tạm trú (Quận 7, TP.HCM)',
        address: 'Quận 7, TP. Hồ Chí Minh',
        query: 'District 7, Ho Chi Minh City, Vietnam',
      },
    },
    {
      id: 'permanent_residence',
      icon: 'home',
      label: 'Cư trú quê quán',
      shortLabel: 'Mỹ Tho, Tiền Giang',
      value: 'TP. Mỹ Tho, Tỉnh Tiền Giang',
      color: '#10B981',
      r: 175,
      t: '26s',
      dir: 'normal',
      rdir: 'reverse',
      deg: 270,
      type: 'map' as const,
      mapData: {
        type: 'cu_tru' as const,
        title: 'Cư trú (TP. Mỹ Tho, Tiền Giang)',
        address: 'TP. Mỹ Tho, Tỉnh Tiền Giang',
        query: 'My Tho, Tien Giang, Vietnam',
      },
    },
    {
      id: 'email',
      icon: 'mail',
      label: 'Email chính',
      shortLabel: 'Email',
      value: 'hungthai84@gmail.com',
      color: '#06B6D4',
      r: 110,
      t: '18s',
      dir: 'reverse',
      rdir: 'normal',
      deg: 45,
      type: 'copy' as const,
      copyText: 'hungthai84@gmail.com',
    },
    {
      id: 'phone',
      icon: 'phone',
      label: 'Hotline / Zalo',
      shortLabel: '0909.097.882',
      value: '+84 0909097882',
      color: '#3B82F6',
      r: 110,
      t: '18s',
      dir: 'reverse',
      rdir: 'normal',
      deg: 135,
      type: 'link' as const,
      url: 'https://zalo.me/0909097882',
    },
    {
      id: 'experience',
      icon: 'briefcase',
      label: 'Kinh nghiệm quản trị',
      shortLabel: '22+ Năm CX',
      value: '22+ Năm thực chiến CSKH & Call Center',
      color: '#EC4899',
      r: 110,
      t: '18s',
      dir: 'reverse',
      rdir: 'normal',
      deg: 225,
      type: 'page' as const,
      pageIndex: 6,
    },
    {
      id: 'degree',
      icon: 'award',
      label: 'Học vấn & Bằng cấp',
      shortLabel: 'Cử nhân CNTT & QTKD',
      value: 'Cử nhân CNTT & Quản trị Kinh doanh',
      color: '#6366F1',
      r: 110,
      t: '18s',
      dir: 'reverse',
      rdir: 'normal',
      deg: 315,
      type: 'page' as const,
      pageIndex: 5,
    },
  ];


  const handleItemClick = (item: typeof personalItems[0]) => {
    SoundEngine.playPop();
    if (item.type === 'map' && item.mapData) {
      onSetHeroMedia?.('map');
      onSetHeroMapType?.(item.mapData.type);
      showToast(`📍 Hiển thị bản đồ vị trí: ${item.mapData.title}`);
    } else if (item.type === 'page' && typeof item.pageIndex === 'number' && onNavigatePage) {
      onNavigatePage(item.pageIndex);
      showToast(`Chuyển đến: ${item.label}`);
    } else if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'copy' && item.copyText) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(item.copyText);
        showToast(`✓ Đã sao chép: ${item.copyText}`);
      }
    } else {
      showToast(`${item.label}: ${item.value}`);
    }
  };

  return (
    <div
      className={`u306 mx-auto ${isHold ? 'is-hold' : ''}`}
      onMouseEnter={() => setIsHold(true)}
      onMouseLeave={() => setIsHold(false)}
      style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
    >
      {/* Vòng tròn quỹ đạo quay quanh nhân vật ở chính giữa - tích hợp toàn bộ các icon thông tin cá nhân vào vòng xoay */}
      <div className="u306-st flex flex-wrap items-center justify-center">
        {personalItems.map((item, idx) => (
          <div
            key={item.id}
            className="u306-rg"
            style={{ '--r': `${item.r}px`, '--t': item.t, '--dir': item.dir } as any}
          >
            <div className="u306-sl" style={{ transform: `rotate(${item.deg}deg) translateX(${item.r}px)` }}>
              <div className="u306-up" style={{ '--t': item.t, '--rdir': item.rdir } as any}>
                <button
                  type="button"
                  className={`u306-ic group/orbit ${activeIcon === idx ? 'is-on' : ''}`}
                  style={{ '--c': item.color } as any}
                  onMouseEnter={() => setActiveIcon(idx)}
                  onMouseLeave={() => setActiveIcon(null)}
                  onClick={() => handleItemClick(item)}
                  title={`${item.label}: ${item.value} (${item.shortLabel})`}
                  aria-label={item.shortLabel}
                >
                  <WebIcon name={item.icon as any} className="w-4 h-4 shrink-0" />
                  <span className="u306-lb">{item.shortLabel}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Center Hub: Holographic Aura Ring định tâm bao quanh nhân vật trong video */}
        <div
          className="u306-hb"
          title="Nguyễn Hùng Thái - Chuyên gia CX & Vận hành Dịch vụ"
          onClick={() => showToast('Nguyễn Hùng Thái · Chuyên gia Quản trị CX & Vận hành Contact Center')}
        >
          <div className="w-4 h-4 rounded-full border border-cyan-500/80 bg-cyan-500/20 animate-ping pointer-events-none" />
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] pointer-events-none" />
        </div>
      </div>

      <style>{`
        .u306 {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 380px;
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          overflow: visible;
        }
        .u306-hd {
          position: absolute;
          left: 0;
          right: 0;
          top: 10px;
          z-index: 10;
          text-align: center;
        }
        .u306-st {
          position: absolute;
          left: 50%;
          top: 190px;
          width: 0;
          height: 0;
          z-index: 5;
        }
        .u306-rg {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          animation: u306-r var(--t) linear infinite;
          animation-direction: var(--dir);
        }
        .u306-rg::before {
          content: "";
          position: absolute;
          left: calc(var(--r) * -1);
          top: calc(var(--r) * -1);
          width: calc(var(--r) * 2);
          height: calc(var(--r) * 2);
          border-radius: 50%;
          border: 1.5px dashed rgba(34, 211, 238, 0.4);
          box-shadow: 0 0 14px rgba(34, 211, 238, 0.12);
        }
        .u306.is-hold .u306-rg, .u306.is-hold .u306-up { animation-play-state: paused; }
        @keyframes u306-r { to { transform: rotate(360deg); } }
        .u306-sl { position: absolute; left: 0; top: 0; }
        .u306-up {
          position: absolute;
          left: -18px;
          top: -18px;
          animation: u306-r var(--t) linear infinite;
          animation-direction: var(--rdir);
        }
        .u306-ic {
          position: relative;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          padding: 0;
          border: 1.5px solid var(--c);
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.85);
          color: var(--c);
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.3,1.6,0.5,1), box-shadow 0.3s;
        }
        .u306-lb {
          position: absolute;
          top: calc(100% - 11px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 9px;
          font-weight: 700 !important;
          line-height: 1.1;
          padding: 2px 5px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.88);
          color: #f8fafc;
          border: 1px solid var(--c);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          pointer-events: none;
          opacity: 0.9;
          transition: all 0.25s ease;
        }
        .u306-ic:hover .u306-lb,
        .u306-ic.is-on .u306-lb {
          opacity: 1;
          background: var(--c);
          color: #ffffff;
          transform: translateX(-50%) scale(1.05);
        }
        .u306-ic:hover {
          background: #ffffff;
          transform: scale(1.15);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18), 0 0 12px var(--c);
        }
        .u306-ic.is-on {
          transform: scale(1.25);
          background: #ffffff;
          box-shadow: 0 0 0 2px var(--c), 0 0 20px var(--c);
          border-color: var(--c);
        }
        .u306-hb {
          position: absolute;
          left: -32px;
          top: -32px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px dashed rgba(34, 211, 238, 0.65);
          background: radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%);
          box-shadow: 0 0 24px rgba(6, 182, 212, 0.45);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 6;
        }
        .u306-hb:hover {
          transform: scale(1.1);
          border-color: rgba(34, 211, 238, 0.95);
          box-shadow: 0 0 32px rgba(34, 211, 238, 0.7);
        }
      `}</style>
    </div>
  );
};

export function AboutView({ 
  currentTheme = 'light-glass', 
  onNavigatePage,
  onShowNotification,
  onOpenMapModal,
  onOpenBentoFocusModal
}: AboutViewProps = {}) {
  const { showToast } = useToast();
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;

  // Chế độ xem: cố định duy nhất dạng Trình chiếu Slide ('slides')
  const [viewMode, setViewMode] = useState<'dashboard' | 'bento' | 'slides'>('slides');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Yêu cầu 1: Bento Palette Theme Switcher ('pastel' | 'cyber' | 'emerald' | 'rose')
  const [bentoPalette, setBentoPalette] = useState<BentoPaletteType>('pastel');
  const [isPaletteMenuOpen, setIsPaletteMenuOpen] = useState(false);

  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);
  const [isRightDockCollapsed, setIsRightDockCollapsed] = useState<boolean>(false);
  const [isAboutNavMenuOpen, setIsAboutNavMenuOpen] = useState(false);
  const [isAboutNavHovered, setIsAboutNavHovered] = useState(false);
  const aboutNavContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClientMounted(true);
    setViewMode('slides');
    try {
      const saved = localStorage.getItem('hungthai_bento_palette') as BentoPaletteType;
      if (saved && (saved === 'pastel' || saved === 'cyber' || saved === 'emerald' || saved === 'rose')) {
        setBentoPalette(saved);
      }
    } catch {}
  }, []);

  // Click outside to close about nav menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        aboutNavContainerRef.current &&
        !aboutNavContainerRef.current.contains(e.target as Node)
      ) {
        setIsAboutNavHovered(false);
        setIsAboutNavMenuOpen(false);
        setIsPaletteMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Yêu cầu 4: Hiệu ứng lật thẻ nhân khẩu học (Card 2.1)
  const [isDemographicFlipped, setIsDemographicFlipped] = useState(false);

  // Tính năng 5: Chế độ đối chiếu tương quan Trụ Cột & Giá Trị khi hover (Cross-Highlight Connection)
  const [hoveredPillarOrValue, setHoveredPillarOrValue] = useState<string | null>(null);

  // Tính năng 4: Nút nghe thuyết minh từng giá trị & trụ cột bằng Trợ Lý AI Tí Chuột
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Yêu cầu 5: Focus toàn màn hình từng Card Bento (Bento Expand Modal)
  const [focusedBentoCard, setFocusedBentoCard] = useState<string | null>(null);

  // Interactive Google Maps active preview state in Slide 2
  const [activeMapTab, setActiveMapTab] = useState<'tam_tru' | 'cu_tru'>('tam_tru');

  // Hero Media State: 'video' | 'map'
  const [activeHeroMedia, setActiveHeroMedia] = useState<'video' | 'map'>('video');
  const [activeHeroMapType, setActiveHeroMapType] = useState<'tam_tru' | 'cu_tru'>('tam_tru');

  // Video State & Controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  // Helper format mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Đồng bộ lưu & khôi phục trạng thái âm thanh qua CustomEvent
  useEffect(() => {
    setIsVideoMuted(getSavedMutedPref(true));
    const handleAudioPref = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.muted === 'boolean') {
        setIsVideoMuted(customEvent.detail.muted);
        if (videoRef.current) {
          videoRef.current.muted = customEvent.detail.muted;
        }
      }
    };
    window.addEventListener(AUDIO_PREF_EVENT, handleAudioPref);
    return () => window.removeEventListener(AUDIO_PREF_EVENT, handleAudioPref);
  }, []);

  // Active ecosystem banner tab index (7 Phân Hệ)
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

  // Bento Palette Handler
  const handleSelectBentoPalette = useCallback((palette: BentoPaletteType) => {
    SoundEngine.playTap();
    setBentoPalette(palette);
    setIsPaletteMenuOpen(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hungthai_bento_palette', palette);
      } catch {}
    }
    showToast(`Đã chuyển sang bộ màu Bento: ${BENTO_PALETTES[palette]?.name}`);
  }, [showToast]);

  // Lưu cấu hình hồ sơ mặc định
  const handleSaveAboutSettings = useCallback(() => {
    SoundEngine.playGlassChime();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hungthai_about_view_mode', viewMode);
        localStorage.setItem('hungthai_bento_palette', bentoPalette);
      } catch {}
    }
    showToast('Đã lưu cấu hình hồ sơ làm mặc định thành công!');
  }, [viewMode, bentoPalette, showToast]);

  // Flip demographic card handler
  const toggleDemographicFlip = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    SoundEngine.playPop();
    setIsDemographicFlipped((prev) => !prev);
  }, []);

  // 5 Floating Info Items xuất hiện ngẫu nhiên trong video và 1 phút (60s) tự động đổi vị trí
  const FLOATING_INFO_ITEMS = useMemo(() => [
    { id: 'gender', label: 'Giới tính', value: 'Nam giới', icon: 'user' as const, color: '#0284C7', bg: 'rgba(2, 132, 199, 0.18)', border: 'rgba(2, 132, 199, 0.45)' },
    { id: 'ethnicity', label: 'Dân tộc', value: 'Kinh', icon: 'globe' as const, color: '#059669', bg: 'rgba(5, 150, 105, 0.18)', border: 'rgba(5, 150, 105, 0.45)' },
    { id: 'marital', label: 'Hôn nhân', value: 'Độc thân', icon: 'heart' as const, color: '#E11D48', bg: 'rgba(225, 29, 72, 0.18)', border: 'rgba(225, 29, 72, 0.45)' },
    { id: 'birthday', label: 'Sinh nhật', value: '22/06/1984', icon: 'calendar' as const, color: '#D97706', bg: 'rgba(217, 119, 6, 0.18)', border: 'rgba(217, 119, 6, 0.45)' },
    { id: 'horoscope', label: 'Tử vi', value: 'Giáp Tý', icon: 'sparkles' as const, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.18)', border: 'rgba(124, 58, 237, 0.45)' },
  ], []);

  // 5 Floating Personal Info Chips sắp xếp chuẩn hình vòng tròn với khoảng cách góc bằng nhau (72° mỗi nấc) xung quanh nhân vật
  const [floatingPositions] = useState<Array<{ id: string; top: number; left: number }>>([
    { id: 'gender', top: 22, left: 47 },     // 216° Top-Left (Giới tính: Nam giới)
    { id: 'ethnicity', top: 20, left: 73 },  // 288° Top-Right (Dân tộc: Kinh)
    { id: 'marital', top: 44, left: 78 },    // 0° Mid-Right (Hôn nhân: Độc thân)
    { id: 'birthday', top: 66, left: 60 },   // 72° Bottom-Center (Sinh nhật: 22/06/1984)
    { id: 'horoscope', top: 40, left: 41 },  // 144° Mid-Left (Tử vi: Giáp Tý)
  ]);



  // Handler nghe thuyết trình AI ngắn gọn cho từng Trụ Cột / Giá Trị bằng giọng PUCK MC Nam Sài Gòn
  const handleSpeakItem = useCallback((id: string, text: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    SoundEngine.playTap();

    if (activeSpeechId === id) {
      stopActiveSpeech();
      setActiveSpeechId(null);
      showToast(`Đã dừng thuyết trình ${title}.`);
      return;
    }

    setActiveSpeechId(id);
    showToast(`Đang kết nối giọng PUCK MC Nam Sài Gòn: ${title}...`);

    speakSiteText(text, {
      speakingStyle: 'professional',
      rate: 1.02,
      pitch: 1.0,
      onStart: () => {
        setActiveSpeechId(id);
        showToast(`AI PUCK MC Sài Gòn đang thuyết trình: ${title}... 🎙️`);
      },
      onEnd: () => {
        setActiveSpeechId(null);
      },
      onError: (err) => {
        setActiveSpeechId(null);
        showToast(err || 'Lỗi phát âm thanh thuyết trình.');
      },
    });
  }, [activeSpeechId, showToast]);

  // Kiểm tra tương quan sáng viền giữa 3 Trụ Cột và 3 Giá Trị Cốt Lõi
  // Pillar 1 (Hiệu Quả) <-> Value 2 (Kịp Thời / Tốc độ xử lý & Quy trình)
  // Pillar 2 (Nhân Văn) <-> Value 3 (Đồng Cảm Chân Thành / Thấu cảm & Con người)
  // Pillar 3 (Bền Vững) <-> Value 1 (Sự Tận Tâm / Giá trị dài hạn & Trách nhiệm)
  const isPillarHighlighted = useCallback((pillarId: string) => {
    if (hoveredPillarOrValue === pillarId) return true;
    if (pillarId === 'pillar-1' && hoveredPillarOrValue === 'val-2') return true;
    if (pillarId === 'pillar-2' && hoveredPillarOrValue === 'val-3') return true;
    if (pillarId === 'pillar-3' && hoveredPillarOrValue === 'val-1') return true;
    return false;
  }, [hoveredPillarOrValue]);

  const isValueHighlighted = useCallback((valId: string) => {
    if (hoveredPillarOrValue === valId) return true;
    if (valId === 'val-1' && hoveredPillarOrValue === 'pillar-3') return true;
    if (valId === 'val-2' && hoveredPillarOrValue === 'pillar-1') return true;
    if (valId === 'val-3' && hoveredPillarOrValue === 'pillar-2') return true;
    return false;
  }, [hoveredPillarOrValue]);

  // Bento Focus Modal Handlers
  const handleOpenBentoFocus = useCallback((cardKey: string) => {
    SoundEngine.playPageFlip();
    setFocusedBentoCard(cardKey);
  }, []);

  const handleCloseBentoFocus = useCallback(() => {
    SoundEngine.playTap();
    setFocusedBentoCard(null);
  }, []);

  // Navigation handlers
  const handleSelectSlide = useCallback((slideIdx: number) => {
    SoundEngine.playTap();
    setSlideDirection(slideIdx > currentSlide ? 'next' : 'prev');
    setCurrentSlide(slideIdx);
  }, [currentSlide]);

  const handlePrevSlide = useCallback(() => {
    SoundEngine.playTap();
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : ABOUT_SLIDES.length - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    SoundEngine.playTap();
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev < ABOUT_SLIDES.length - 1 ? prev + 1 : 0));
  }, []);

  // Đồng bộ trạng thái Slide với nút Tới trang / Qua trang ở Footer
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', { detail: { tabIndex: 2, slide: currentSlide } })
    );
  }, [currentSlide]);

  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.tabIndex === undefined || detail.tabIndex === 2) && typeof detail.slide === 'number') {
        const target = Math.max(0, Math.min(ABOUT_SLIDES.length - 1, detail.slide));
        setSlideDirection(target >= currentSlide ? 'next' : 'prev');
        setCurrentSlide(target);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [currentSlide]);

  // Keyboard accessibility: ESC đóng modal/video, ArrowLeft/ArrowRight chuyển slide
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

      if (e.key === 'Escape') {
        if (focusedBentoCard) {
          handleCloseBentoFocus();
        } else if (isPlayingIntro) {
          handleCancelIntro();
        }
      } else if (viewMode === 'slides' && !isPlayingIntro && !focusedBentoCard) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextSlide();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayingIntro, viewMode, focusedBentoCard, handleCloseBentoFocus, handlePrevSlide, handleNextSlide]);

  // Video time tracking
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlayIntro = () => {
    setIsPlayingIntro(true);
    setIsVideoMuted(false);
    saveMutedPref(false);
    setIsVideoPaused(false);
    if (videoRef.current) {
      videoRef.current.src = ABOUT_INTRO_VIDEO_URL;
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    showToast('Đang phát Video: Giới thiệu bản thân 🎬');
  };

  const handleCancelIntro = () => {
    setIsPlayingIntro(false);
    setIsVideoMuted(true);
    saveMutedPref(true);
    setIsVideoPaused(false);
    setVideoCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.src = ABOUT_IDLE_VIDEO_URL;
      videoRef.current.muted = true;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    showToast('Đã dừng nghe — Quay về Video Ban đầu');
  };

  const handleVideoEnded = () => {
    if (isPlayingIntro) {
      handleCancelIntro();
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isVideoMuted;
    videoRef.current.muted = nextMuted;
    setIsVideoMuted(nextMuted);
    saveMutedPref(nextMuted);
    showToast(nextMuted ? 'Đã tắt âm thanh video' : 'Đã mở âm thanh video 🔊');
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsVideoPaused(false);
    } else {
      videoRef.current.pause();
      setIsVideoPaused(true);
    }
  };

  // Render nội dung phóng to chi tiết cho Bento Expand Modal (Yêu cầu 5)
  const renderFocusedCardContent = () => {
    switch (focusedBentoCard) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-900 text-white rounded-[14px] p-5 border border-slate-700">
              <div className="relative aspect-video rounded-[14px] overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                <video
                  src={ABOUT_INTRO_VIDEO_URL}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between gap-3 text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lãnh Đạo Vận Hành CX 22+ Năm</span>
                  </div>
                  <h3 className="card-title text-white">Nguyễn Hùng Thái</h3>
                  <div className="text-xs text-slate-300 font-normal leading-relaxed mt-2 space-y-2">
                    <p>
                      Một chuyên gia dịch vụ khách hàng với hơn <strong>22 năm kinh nghiệm thực chiến</strong>. Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá: để lắng nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.
                    </p>
                    <p>
                      Tôi tin rằng sự hài lòng không đến từ sự hoàn hảo tuyệt đối, mà đến từ <strong>sự tận tâm kịp thời</strong> và <strong>đồng cảm chân thành</strong>. Trong suốt sự nghiệp, tôi đã trực tiếp thiết kế và tối ưu hóa hàng chục quy trình, hệ thống Chăm Sóc Khách Hàng, luôn đặt trên nền tảng ba giá trị cốt lõi:
                    </p>
                    <div className="p-2 rounded-[14px] bg-white/10 border border-white/15 text-cyan-300 font-bold font-play text-xs text-center">
                      Hiệu quả – Nhân văn – Bền vững
                    </div>
                    <p>
                      Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà cốt lõi: <em>Họ luôn được lắng nghe.</em>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <img
                    src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.gif"
                    alt="Nguyễn Hùng Thái"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-[11px] text-slate-300">
                    <span className="font-bold text-cyan-400">Trợ Lý Ảo Tí Chuột:</span> “Sẵn sàng kết nối và đồng hành cùng quý doanh nghiệp!”
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ABOUT_PROFILE_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="p-3.5 rounded-[14px] bg-white/80 dark:bg-slate-900/75 border border-white/90 dark:border-white/10 shadow-sm flex flex-col justify-between"
                >
                  <div
                    className="w-8 h-8 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <WebIcon name={getWebIconName(stat.iconName)} className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div className="my-3">
                    <span
                      className="text-3xl font-black font-play leading-none tracking-tight block"
                      style={{ color: stat.color }}
                    >
                      {stat.metric}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mt-1 font-mono">
                      {stat.unitVi || 'THỰC CHIẾN'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    {stat.id === 'experience' && 'Hơn hai thập kỷ trực tiếp điều hành, thiết lập quy chuẩn và nâng cấp dịch vụ.'}
                    {stat.id === 'scale' && 'Từng quản lý và xây dựng hệ thống tại hơn 8 tập đoàn, doanh nghiệp quy mô lớn.'}
                    {stat.id === 'automation' && 'Tích hợp công nghệ AI, CRM & quy trình tự động hoá chăm sóc khách hàng 24/7.'}
                    {stat.id === 'csat' && 'Chỉ số hài lòng khách hàng (CSAT) liên tục duy trì ở mức cao kỷ lục.'}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-[14px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-bold">💡 Triết lý đo lường thực chiến:</strong> Số liệu phản ánh năng lực kiểm soát chi tiết từ vi mô (từng cuộc gọi, khiếu nại, phản hồi khách hàng) đến vĩ mô (chiến lược ngân sách, nhân sự, kiến trúc hệ thống CRM và chuyển đổi số).
            </div>
          </div>
        );

      case 'demographics':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PERSONAL_DEMOGRAPHICS.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-2.5 rounded-[14px] border flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-default',
                    item.colorTheme.bg,
                    item.colorTheme.border
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-[14px] flex items-center justify-center shrink-0', item.colorTheme.iconBg)}>
                    <WebIcon name={getWebIconName(item.iconName)} className={cn('w-4.5 h-4.5', item.colorTheme.iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={cn('text-[10px] font-bold block truncate', item.colorTheme.labelColor)}>
                      {item.labelVi}
                    </span>
                    <span className={cn('text-xs font-black font-play block truncate', item.colorTheme.valueColor)}>
                      {item.valueVi}
                    </span>
                  </div>
                </div>
              ))}
            </div>


          </div>
        );

      case 'map':
        return (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playPop();
                  setActiveMapTab('tam_tru');
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border',
                  activeMapTab === 'tam_tru'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                )}
              >
                <WebIcon name="location" className="w-3.5 h-3.5" />
                <span>Tạm trú: Quận 7, TP.HCM</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playPop();
                  setActiveMapTab('cu_tru');
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border',
                  activeMapTab === 'cu_tru'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                )}
              >
                <WebIcon name="home" className="w-3.5 h-3.5" />
                <span>Cư trú: Mỹ Tho, Tiền Giang</span>
              </button>
            </div>

            <div className="relative w-full h-[320px] rounded-[14px] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-950">
              <iframe
                title={activeMapTab === 'tam_tru' ? 'Bản đồ Quận 7' : 'Bản đồ Mỹ Tho'}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  activeMapTab === 'tam_tru' ? 'District 7, Ho Chi Minh City, Vietnam' : 'My Tho, Tien Giang, Vietnam'
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Địa chỉ: {activeMapTab === 'tam_tru' ? 'Quận 7, TP. Hồ Chí Minh' : 'Mỹ Tho, Tiền Giang'}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activeMapTab === 'tam_tru' ? 'District 7, Ho Chi Minh City, Vietnam' : 'My Tho, Tien Giang, Vietnam'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
              >
                <span>Mở trong Google Maps</span>
                <WebIcon name="external-link" className="w-3 h-3" />
              </a>
            </div>
          </div>
        );

      case 'pillars':
        return (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                3 nguyên lý vận hành cốt lõi qua hơn 22 năm điều hành hệ thống dịch vụ khách hàng:
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pillar 1 */}
              <div className="rounded-[14px] p-4 bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md flex flex-col justify-between layered-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <WebIcon name="chart" className="w-5 h-5 text-white shrink-0" />
                      <h4 className="text-base font-black font-play text-white">01. Hiệu quả</h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-[14px]">Trụ cột 01</span>
                  </div>
                  <p className="text-xs text-blue-100 font-semibold mt-1">Tối ưu quy trình &amp; Kết quả</p>
                  <p className="text-xs text-white/90 leading-relaxed mt-2.5">
                    Tối ưu hiệu suất vận hành, chuẩn hóa SOP, quản trị KPI, SLA, FCR và giải quyết triệt để rủi ro dịch vụ.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/20 text-[11px] text-blue-100 font-mono">
                  ✓ Chuẩn hóa SOP &amp; Đo lường ROI
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-[14px] p-4 bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md flex flex-col justify-between layered-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <WebIcon name="heart" className="w-5 h-5 text-white shrink-0" />
                      <h4 className="text-base font-black font-play text-white">02. Nhân văn</h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-[14px]">Trụ cột 02</span>
                  </div>
                  <p className="text-xs text-rose-100 font-semibold mt-1">Đồng cảm &amp; Thấu hiểu</p>
                  <p className="text-xs text-white/90 leading-relaxed mt-2.5">
                    Lắng nghe thấu hiểu từ tâm, lấy con người làm gốc rễ, đào tạo đội ngũ tận tâm và xây dựng văn hóa gắn kết.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/20 text-[11px] text-rose-100 font-mono">
                  ✓ Thấu cảm từ tâm &amp; Trao quyền
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-[14px] p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md flex flex-col justify-between layered-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <WebIcon name="leaf" className="w-5 h-5 text-white shrink-0" />
                      <h4 className="text-base font-black font-play text-white">03. Bền vững</h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-[14px]">Trụ cột 03</span>
                  </div>
                  <p className="text-xs text-emerald-100 font-semibold mt-1">Giá trị &amp; Tin cậy</p>
                  <p className="text-xs text-white/90 leading-relaxed mt-2.5">
                    Xây dựng niềm tin dài hạn, ứng dụng công nghệ CRM hiện đại, Data Analytics và tự động hóa AI tạo đòn bẩy.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/20 text-[11px] text-emerald-100 font-mono">
                  ✓ Công nghệ AI CRM &amp; Tăng trưởng
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-[14px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-handwriting text-blue-600 dark:text-cyan-400 text-base font-bold">
                Luôn bên bạn và tận tâm từng khoảnh khắc ♡
              </span>
              <span className="font-mono text-[11px] text-slate-500">22+ Năm Phụng Sự Dịch Vụ Khách Hàng</span>
            </div>
          </div>
        );

      case 'philosophy':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Khối 1: Giá trị cốt lõi */}
              <div id="about-core-values-card" className="rounded-[14px] p-5 bg-gradient-to-br from-amber-50/90 to-orange-100/70 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/50 flex flex-col justify-between layered-card">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                    <WebIcon name="star" className="w-5 h-5 fill-current" />
                    <h4 className="text-sm font-black font-play">Giá Trị Cốt Lõi: Khách Hàng Là Trung Tâm</h4>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    Sự hài lòng không đến từ sự hoàn hảo tuyệt đối, mà đến từ <strong className="text-amber-800 dark:text-amber-300 font-bold">sự tận tâm kịp thời</strong> và <strong className="text-amber-800 dark:text-amber-300 font-bold">đồng cảm chân thành</strong> trong từng điểm chạm (Touchpoint).
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-700 dark:text-amber-300 font-handwriting text-base font-bold">
                  Tận tâm phụng sự ♡
                </div>
              </div>

              {/* Khối 2: Triết lý tầm nhìn */}
              <div id="about-philosophy-card" className="rounded-[14px] p-5 bg-gradient-to-br from-sky-50/90 to-cyan-100/70 dark:from-sky-950/40 dark:to-cyan-950/30 border border-sky-200/80 dark:border-sky-800/50 flex flex-col justify-between layered-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                      <Sparkles className="w-5 h-5" />
                      <h4 className="text-sm font-black font-play">Triết Lý Tầm Nhìn CX 2026+</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white/90 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                      Kỷ Nguyên Mới
                    </span>
                  </div>
                  <blockquote className="text-sm font-black text-blue-800 dark:text-cyan-300 font-play leading-relaxed border-l-4 border-blue-500 pl-3 my-2">
                    “ Tận Tâm &amp; Đồng Hành Cùng Trải Nghiệm Khách Hàng ”
                  </blockquote>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    Kết hợp hài hòa giữa công nghệ chuyển đổi số (AI CRM, tự động hóa) và trái tim phụng sự nhân văn để tạo nên sự gắn kết thương hiệu bền lâu.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-sky-200/60 dark:border-sky-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Nguyễn Hùng Thái</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold">22+ Năm Vận Hành Thực Chiến</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isDark = themeIsDark || currentTheme === 'dark-neon';

  // Glass card classes
  const glassCardClass =
    isDark
      ? 'bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.65)] text-slate-100'
      : 'bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-5px_rgba(30,27,75,0.06)] text-slate-800';

  const renderAboutRightNavigationBar = () => null;

  return (
    <div
      id="about-page-container"
      data-element-name="Trang Giới Thiệu Chuyên Gia"
      data-element-type="container"
      data-element-page="about"
      data-element-parent="global-content-viewport"
      style={{ background: 'var(--bg-header)' }}
      className="main-card relative w-full h-full flex-1 flex flex-col justify-start items-stretch p-[15px] sm:p-[20px] lg:p-[25px] gap-[15px] font-play text-left text-slate-800 dark:text-slate-100 transition-all duration-300 rounded-[20px] border border-white/80 dark:border-white/10 backdrop-blur-xl shadow-xl overflow-y-auto glass-scrollbar z-10 select-none"
    >
      <div className="w-full flex flex-col gap-[15px] h-auto min-h-full shrink-0">
        {/* ========================================================================= */}
        {/* TỔNG QUAN BENTO BOX GRID HỢP NHẤT TOÀN DIỆN                             */}
        {/* ========================================================================= */}

        <div
          id="about-bento-grid"
          className="w-full h-auto min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[15px] overflow-visible content-start pb-4"
        >
            
            {/* CARD 1: CARD VIDEO CHÂN DUNG CHUYÊN GIA */}
            <div
              id="about-hero-video-container"
              data-element-name="Card video chân dung chuyên gia"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-page-container"
              style={{
                borderRadius: '14px',
                padding: '15px',
                ...cardSampleStyle,
              }}
              className="bento-card glass-card col-span-1 lg:col-span-7 xl:col-span-7 relative rounded-[14px] overflow-hidden flex flex-col justify-between min-h-[340px] sm:min-h-[420px] lg:min-h-0 h-full group/video p-[15px] text-left"
            >
                  {/* Hero Media Layer */}
                  {activeHeroMedia === 'video' ? (
                    <video
                      ref={videoRef}
                      id="about-hero-video"
                      data-element-name="Video giới thiệu chân dung chuyên gia"
                      data-element-type="media"
                      data-element-page="about"
                      data-element-parent="about-hero-video-container"
                      key={isPlayingIntro ? 'video-intro-2' : 'video-idle-1'}
                      autoPlay
                      loop={!isPlayingIntro}
                      muted={isPlayingIntro ? isVideoMuted : true}
                      playsInline
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleVideoEnded}
                      className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center pointer-events-none z-0 opacity-100 transition-opacity duration-700 brightness-105 contrast-105 scale-[1.01]"
                      src={isPlayingIntro ? ABOUT_INTRO_VIDEO_URL : ABOUT_IDLE_VIDEO_URL}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full z-0 animate-fadeIn">
                      <iframe
                        title={activeHeroMapType === 'tam_tru' ? 'Bản đồ Tạm trú' : 'Bản đồ Cư trú'}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          activeHeroMapType === 'tam_tru' ? 'District 7, Ho Chi Minh City, Vietnam' : 'My Tho, Tien Giang, Vietnam'
                        )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0 brightness-105 contrast-105"
                        loading="lazy"
                        allowFullScreen
                      />
                      {/* Close Map / Switch back to Video button overlay */}
                      <button
                        onClick={() => setActiveHeroMedia('video')}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-white/20 shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title="Quay lại xem Video"
                      >
                        <WebIcon name="cancel" className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Action Button Capsule - Only visible when Video is active (hidden when Map is shown) */}
                  {activeHeroMedia === 'video' && (
                    <div 
                      id="el-p2-div-103"
                      className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 z-30 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[999px] bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-[0_4px_20px_rgba(225,29,72,0.5)] hover:shadow-[0_6px_24px_rgba(225,29,72,0.7)] transition-all duration-300 cursor-pointer pointer-events-auto border border-white/35 active:scale-98 select-none"
                    >
                      {/* Speaker / Sound Toggle Button */}
                      <button
                        type="button"
                        id="el-p2-btn-sound-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextMuted = !isVideoMuted;
                          setIsVideoMuted(nextMuted);
                          saveMutedPref(nextMuted);
                          if (videoRef.current) {
                            videoRef.current.muted = nextMuted;
                          }
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
                          !isVideoMuted
                            ? 'bg-white/25 hover:bg-white/40 text-white shadow-xs'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                        }`}
                        title={!isVideoMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                        aria-label={!isVideoMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                      >
                        <span className="flex items-center justify-center">
                          {!isVideoMuted ? (
                            <WebIcon name="volume-2" className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
                          )}
                        </span>
                      </button>

                      {/* Vertical Divider */}
                      <div className="w-[1px] h-4 bg-white/35 shrink-0 mx-0.5" />

                      {/* Play / Pause Toggle Button */}
                      {!isPlayingIntro ? (
                        <button
                          type="button"
                          id="el-p2-button-2"
                          data-element-id="el-p2-button-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayIntro();
                          }}
                          className="inline-flex items-center justify-center gap-2 pr-1.5 py-1 rounded-[999px] text-white font-black text-[15px] tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                          title="Bấm để phát video thuyết minh chân dung chuyên gia"
                        >
                          <span id="el-p2-span-36" className="flex items-center justify-center">
                            <WebIcon id="el-p2-svg-17" name="play" className="w-4 h-4 fill-white text-white shrink-0" style={{ fontSize: '15px', height: '16px', width: '16px' }} />
                          </span>
                          <span id="el-p2-span-37" className="drop-shadow-sm font-black text-[15px] text-white truncate font-play text-left" style={{ fontSize: '15px', textAlign: 'left' }}>
                            Phát Video
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="el-p2-button-2"
                          data-element-id="el-p2-button-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelIntro();
                          }}
                          className="inline-flex items-center justify-center gap-2 pr-1.5 py-1 rounded-[999px] text-white font-black text-[15px] tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                          title="Bấm để hủy phát video"
                        >
                          <span id="el-p2-span-36" className="flex items-center justify-center">
                            <WebIcon id="el-p2-svg-17" name="cancel" className="w-4 h-4 stroke-[2.8] text-white shrink-0" style={{ fontSize: '15px', height: '16px', width: '16px' }} />
                          </span>
                          <span id="el-p2-span-37" className="drop-shadow-sm font-black text-[15px] text-white truncate font-play text-left" style={{ fontSize: '15px', textAlign: 'left' }}>
                            Hủy Phát
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                  </div>

            {/* CARD 2: CARD THÔNG TIN CHI TIẾT */}
            <div
              id="about-personal-info-card-right"
              data-element-name="Card thông tin chi tiết"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-page-container"
              style={{
                borderRadius: '14px',
                padding: '10px',
                ...cardSampleStyle,
              }}
              className="bento-card glass-card col-span-1 lg:col-span-5 xl:col-span-5 flex flex-col gap-2 h-auto min-h-0 text-left rounded-[14px] p-[10px] overflow-hidden"
            >
                  {/* Header Bento Box Bar */}
                  <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-2 shrink-0">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                      <WebIcon name="user" className="w-[18px] h-[18px] text-blue-600 dark:text-cyan-400 shrink-0" style={{ width: '18px', height: '18px' }} />
                      <h3 className="text-[17px] sm:text-[18px] font-bold font-play text-blue-600 dark:text-cyan-400 leading-tight">
                        Thông tin chi tiết
                      </h3>
                    </div>
                  </div>

                  {/* Sub-Card Bento Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 content-start py-0.5">
                    {[
                      {
                        id: 'gender',
                        label: 'Giới tính',
                        value: 'Nam giới',
                        icon: 'user',
                        cardCls: 'bg-sky-50/95 dark:bg-sky-950/85 border-sky-200/90 dark:border-sky-700/80 hover:bg-sky-100 dark:hover:bg-sky-900/90',
                        labelCls: 'text-sky-600/85 dark:text-sky-300/85',
                        valueCls: 'text-sky-950 dark:text-sky-100',
                        iconColorCls: 'text-sky-600 dark:text-sky-400',
                        action: () => showToast('Giới tính: Nam giới'),
                      },
                      {
                        id: 'ethnicity',
                        label: 'Dân tộc',
                        value: 'Kinh',
                        icon: 'globe',
                        cardCls: 'bg-emerald-50/95 dark:bg-emerald-950/85 border-emerald-200/90 dark:border-emerald-700/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/90',
                        labelCls: 'text-emerald-600/85 dark:text-emerald-300/85',
                        valueCls: 'text-emerald-950 dark:text-emerald-100',
                        iconColorCls: 'text-emerald-600 dark:text-emerald-400',
                        action: () => showToast('Dân tộc: Kinh'),
                      },
                      {
                        id: 'marital',
                        label: 'Hôn nhân',
                        value: 'Độc thân',
                        icon: 'heart',
                        cardCls: 'bg-rose-50/95 dark:bg-rose-950/85 border-rose-200/90 dark:border-rose-700/80 hover:bg-rose-100 dark:hover:bg-rose-900/90',
                        labelCls: 'text-rose-600/85 dark:text-rose-300/85',
                        valueCls: 'text-rose-950 dark:text-rose-100',
                        iconColorCls: 'text-rose-600 dark:text-rose-400',
                        action: () => showToast('Hôn nhân: Độc thân'),
                      },
                      {
                        id: 'birthday',
                        label: 'Sinh nhật',
                        value: '22/06/1984',
                        icon: 'calendar',
                        cardCls: 'bg-amber-50/95 dark:bg-amber-950/85 border-amber-200/90 dark:border-amber-700/80 hover:bg-amber-100 dark:hover:bg-amber-900/90',
                        labelCls: 'text-amber-600/85 dark:text-amber-300/85',
                        valueCls: 'text-amber-950 dark:text-amber-100',
                        iconColorCls: 'text-amber-600 dark:text-amber-400',
                        action: () => showToast('Sinh nhật: 22/06/1984'),
                      },
                      {
                        id: 'horoscope',
                        label: 'Tử vi',
                        value: 'Giáp Tý',
                        icon: 'sparkles',
                        cardCls: 'bg-purple-50/95 dark:bg-purple-950/85 border-purple-200/90 dark:border-purple-700/80 hover:bg-purple-100 dark:hover:bg-purple-900/90 col-span-1 sm:col-span-2',
                        labelCls: 'text-purple-600/85 dark:text-purple-300/85',
                        valueCls: 'text-purple-950 dark:text-purple-100',
                        iconColorCls: 'text-purple-600 dark:text-purple-400',
                        action: () => showToast('Tử vi: Giáp Tý - Mệnh Hải Trung Kim'),
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          SoundEngine.playPop();
                          item.action();
                        }}
                        className={cn(
                          'p-2.5 rounded-[14px] border backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border',
                          item.cardCls
                        )}
                      >
                        <WebIcon name={item.icon} className={cn('w-4 h-4 shrink-0 transition-transform group-hover/subcard:scale-110', item.iconColorCls)} style={{ width: '16px', height: '16px' }} />
                        <div className="text-left min-w-0 flex-1">
                          <span className={cn('text-[9.5px] font-bold block leading-tight truncate', item.labelCls)}>
                            {item.label}
                          </span>
                          <span
                            className={cn('text-[14px] sm:text-[15px] font-bold font-play block leading-tight truncate', item.valueCls)}
                            title={item.value}
                          >
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Sub Card: Tạm Trú (Cyan) */}
                    <div
                      onClick={() => {
                        SoundEngine.playPop();
                        setActiveHeroMedia('map');
                        setActiveHeroMapType('tam_tru');
                        showToast('📍 Hiển thị bản đồ Tạm trú tại Quận 7, TP.HCM');
                      }}
                      className="p-2.5 rounded-[14px] bg-cyan-50/95 dark:bg-cyan-950/85 hover:bg-cyan-100 dark:hover:bg-cyan-900/90 border border-cyan-200/90 dark:border-cyan-700/80 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border"
                    >
                      <MapPin className="w-4 h-4 shrink-0 text-cyan-600 dark:text-cyan-400 group-hover/subcard:scale-110 transition-transform" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9.5px] font-bold text-cyan-600/85 dark:text-cyan-300/85 block leading-tight truncate">Tạm trú</span>
                        <span className="text-[14px] sm:text-[15px] font-bold font-play text-cyan-950 dark:text-cyan-100 block leading-tight truncate">Quận 7, TP.HCM</span>
                      </div>
                    </div>

                    {/* Sub Card: Cư Trú (Teal) */}
                    <div
                      onClick={() => {
                        SoundEngine.playPop();
                        setActiveHeroMedia('map');
                        setActiveHeroMapType('cu_tru');
                        showToast('📍 Hiển thị bản đồ Cư trú tại Mỹ Tho, Tiền Giang');
                      }}
                      className="p-2.5 rounded-[14px] bg-teal-50/95 dark:bg-teal-950/85 hover:bg-teal-100 dark:hover:bg-teal-900/90 border border-teal-200/90 dark:border-teal-700/80 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border"
                    >
                      <Home className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400 group-hover/subcard:scale-110 transition-transform" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9.5px] font-bold text-teal-600/85 dark:text-teal-300/85 block leading-tight truncate">Cư trú</span>
                        <span className="text-[14px] sm:text-[15px] font-bold font-play text-teal-950 dark:text-teal-100 block leading-tight truncate">TP. Mỹ Tho</span>
                      </div>
                    </div>

                    {/* Sub Card: Hộp Thư (Pink) */}
                    <div
                      onClick={() => {
                        SoundEngine.playPop();
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText('hungthai84@gmail.com');
                          showToast('✓ Đã sao chép Email: hungthai84@gmail.com');
                        }
                      }}
                      title="hungthai84@gmail.com"
                      className="p-2.5 rounded-[14px] bg-pink-50/95 dark:bg-pink-950/85 hover:bg-pink-100 dark:hover:bg-pink-900/90 border border-pink-200/90 dark:border-pink-700/80 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border col-span-1 sm:col-span-2"
                    >
                      <Mail className="w-4 h-4 shrink-0 text-pink-600 dark:text-pink-400 group-hover/subcard:scale-110 transition-transform" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9.5px] font-bold text-pink-600/85 dark:text-pink-300/85 block leading-tight truncate">Hộp thư</span>
                        <span className="text-xs font-bold font-play text-pink-950 dark:text-pink-100 block leading-tight truncate">hungthai84@gmail.com</span>
                      </div>
                    </div>

                    {/* Sub Card: Điện Thoại (Orange) */}
                    <a
                      href="https://zalo.me/0909097882"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => SoundEngine.playPop()}
                      title="+84 0909097882"
                      className="p-2.5 rounded-[14px] bg-orange-50/95 dark:bg-orange-950/85 hover:bg-orange-100 dark:hover:bg-orange-900/90 border border-orange-200/90 dark:border-orange-700/80 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border"
                    >
                      <Phone className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400 group-hover/subcard:scale-110 transition-transform" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9.5px] font-bold text-orange-600/85 dark:text-orange-300/85 block leading-tight truncate">Điện thoại</span>
                        <span className="text-xs font-bold font-play text-orange-950 dark:text-orange-100 block leading-tight truncate">+84 0909097882</span>
                      </div>
                    </a>

                    {/* Sub Card: Website (Blue) */}
                    <a
                      href="https://nguyenhungthai.powerservice.one/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => SoundEngine.playPop()}
                      title="https://nguyenhungthai.powerservice.one/"
                      className="p-2.5 rounded-[14px] bg-blue-50/95 dark:bg-blue-950/85 hover:bg-blue-100 dark:hover:bg-blue-900/90 border border-blue-200/90 dark:border-blue-700/80 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border"
                    >
                      <Globe className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 group-hover/subcard:scale-110 transition-transform" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9.5px] font-bold text-blue-600/85 dark:text-blue-300/85 block leading-tight truncate">Website</span>
                        <span className="text-xs font-bold font-play text-blue-700 dark:text-cyan-300 block leading-tight truncate">powerservice.one</span>
                      </div>
                    </a>

                    {/* Sub Card: LinkedIn (Indigo) */}
                    <a
                      href="https://www.linkedin.com/in/hungthai84/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => SoundEngine.playPop()}
                      title="https://www.linkedin.com/in/hungthai84/"
                      className="p-2.5 rounded-[14px] bg-indigo-50/95 dark:bg-indigo-950/85 hover:bg-indigo-100 dark:hover:bg-indigo-900/90 border border-indigo-200/90 dark:border-indigo-700/80 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard flex items-center gap-2 overflow-hidden box-border col-span-1 sm:col-span-2"
                    >
                      <LinkedinIcon className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 group-hover/subcard:scale-110 transition-transform" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9.5px] font-bold text-indigo-600/85 dark:text-indigo-300/85 block leading-tight truncate">LinkedIn</span>
                        <span className="text-xs font-bold font-play text-indigo-700 dark:text-cyan-300 block leading-tight truncate">linkedin.com/in/hungthai84</span>
                      </div>
                    </a>
                  </div>


                </div>

            {/* CARD 3: CARD TRỤ CỘT VẬN HÀNH TRIẾT LÝ */}
            <div
              id="about-pillars-philosophy-bento-cell"
              data-element-name="Card Trụ Cột Vận Hành Triết Lý"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-page-container"
              style={{
                borderRadius: '14px',
                padding: '15px',
                ...cardSampleStyle,
              }}
              className="bento-card glass-card col-span-1 lg:col-span-12 xl:col-span-12 flex flex-col gap-3.5 text-left rounded-[14px] p-[15px] overflow-hidden"
            >
                  {/* Header Cell 3 */}
                  <div className="flex items-center justify-between pb-1 shrink-0">
                    <div className="flex items-center gap-2.5 text-blue-600 dark:text-cyan-400">
                      <Target className="w-5 h-5 stroke-[2.4] text-blue-600 dark:text-cyan-400 shrink-0" />
                      <h3 className="text-[18px] font-bold font-play text-blue-600 dark:text-cyan-400 leading-tight" style={{ fontSize: '18px', fontWeight: 700 }}>
                        {formatCardTitle('Trụ cột vận hành triết lý')}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      Triết lý &amp; Giá trị
                    </span>
                  </div>

                  {/* Sub Grid Row 1: Story GIF Card (5 cols) + 3 Pillars (7 cols) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                    {/* Left: Giới thiệu bản thân tôi với hình GIF làm nền card */}
                    <div
                      id="about-career-goal-card"
                      className="lg:col-span-5 rounded-[14px] border border-blue-100/90 dark:border-white/10 p-4 sm:p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-500 relative overflow-hidden group select-none min-h-[175px]"
                    >
                      {/* Prismatic Border Shimmer */}
                      <div className="absolute inset-0 rounded-[14px] border border-transparent group-hover:border-cyan-400/80 dark:group-hover:border-cyan-300/80 transition-all duration-500 pointer-events-none z-20 shadow-[inset_0_0_18px_rgba(56,189,248,0.22)]" />
                      <div className="absolute -inset-[1px] rounded-[14px] bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 opacity-0 group-hover:opacity-35 transition-opacity duration-700 blur-[2.5px] pointer-events-none z-0" />

                      {/* GIF Animation Background Layer */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                        <img
                          src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.gif"
                          alt="Nguyễn Hùng Thái Avatar"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-full h-full object-cover object-center opacity-30 dark:opacity-25 filter blur-[0.3px] scale-105 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/85 to-blue-50/80 dark:from-slate-900/95 dark:via-slate-900/85 dark:to-slate-950/80 backdrop-blur-[1px]" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 pb-2 border-b border-blue-200/60 dark:border-white/10">
                          <User className="w-4.5 h-4.5 text-blue-600 dark:text-sky-400 shrink-0" />
                          <h4 className="text-[18px] font-bold font-play text-blue-600 dark:text-sky-400" style={{ fontSize: '18px', fontWeight: 700 }}>
                            {formatCardTitle('Giới thiệu bản thân')}
                          </h4>
                        </div>

                        <p className="text-xs sm:text-[12.5px] text-slate-700 dark:text-slate-200 font-medium leading-relaxed mt-2.5">
                          Một chuyên gia dịch vụ khách hàng với hơn{' '}
                          <strong className="font-bold text-slate-950 dark:text-white">22 năm kinh nghiệm</strong> thực chiến.
                          Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò chuyện, mỗi khoảnh
                          khắc, dù là nhỏ nhất, đều là một cơ hội quý giá để lắng nghe, để thấu hiểu, và để tạo ra những trải
                          nghiệm vượt trên cả sự mong đợi.
                        </p>
                      </div>
                    </div>

                    {/* Right: 3 Trụ Cột Vận Hành */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                          <h4 className="text-[18px] font-bold font-play text-blue-600 dark:text-cyan-400" style={{ fontSize: '18px', fontWeight: 700 }}>
                            {formatCardTitle('3 Trụ cột vận')}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                          3 Trụ cột vận hành
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch flex-1">
                        {/* Pillar 1: Hiệu Quả */}
                        <div
                          onMouseEnter={() => setHoveredPillarOrValue('pillar-1')}
                          onMouseLeave={() => setHoveredPillarOrValue(null)}
                          onClick={() => {
                            SoundEngine.playPop();
                            showToast('Trụ cột 01: Hiệu Quả - Tối ưu kết quả thực chiến');
                          }}
                          className={cn(
                            'pillar-gradient-card layered-card rounded-[14px] bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-700 dark:via-indigo-800 dark:to-sky-700 text-white p-3.5 shadow-md flex flex-col justify-between min-h-[145px] relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/25 dark:border-white/20 text-left group cursor-pointer',
                            isPillarHighlighted('pillar-1') &&
                              'ring-2 ring-cyan-300 dark:ring-cyan-400 shadow-[0_0_24px_rgba(56,189,248,0.7)] scale-[1.02] -translate-y-1'
                          )}
                        >
                          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xs">
                              <BarChart3 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                              01
                            </span>
                          </div>

                          <div className="my-1.5 relative z-10">
                            <h5 className="text-xs sm:text-sm font-black font-play !text-white">Hiệu quả vận hành</h5>
                            <span className="text-[10px] text-blue-100 font-semibold block">Tối ưu &amp; Kết quả</span>
                            <p className="text-[11px] text-white/95 font-medium leading-snug mt-1">
                              Chuẩn hóa SLAs, tối ưu hiệu suất quy trình và tạo kết quả đo lường rõ ràng.
                            </p>
                          </div>

                          <div className="self-end relative z-10">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenBentoFocus('pillars');
                              }}
                              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer transition text-white"
                              title="Xem chi tiết trụ cột hiệu quả"
                            >
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Pillar 2: Nhân Văn */}
                        <div
                          onMouseEnter={() => setHoveredPillarOrValue('pillar-2')}
                          onMouseLeave={() => setHoveredPillarOrValue(null)}
                          onClick={() => {
                            SoundEngine.playPop();
                            showToast('Trụ cột 02: Nhân Văn - Đồng cảm và thấu hiểu');
                          }}
                          className={cn(
                            'pillar-gradient-card layered-card rounded-[14px] bg-gradient-to-br from-rose-500 via-pink-600 to-rose-600 dark:from-rose-600 dark:via-pink-700 dark:to-rose-800 text-white p-3.5 shadow-md flex flex-col justify-between min-h-[145px] relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/25 dark:border-white/20 text-left group cursor-pointer',
                            isPillarHighlighted('pillar-2') &&
                              'ring-2 ring-pink-300 dark:ring-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.7)] scale-[1.02] -translate-y-1'
                          )}
                        >
                          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xs">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                              02
                            </span>
                          </div>

                          <div className="my-1.5 relative z-10">
                            <h5 className="text-xs sm:text-sm font-black font-play !text-white">Nhân văn con người</h5>
                            <span className="text-[10px] text-rose-100 font-semibold block">Đồng cảm &amp; Thấu hiểu</span>
                            <p className="text-[11px] text-white/95 font-medium leading-snug mt-1">
                              Lắng nghe chân thành, phục vụ từ tâm và lấy con người làm trọng tâm.
                            </p>
                          </div>

                          <div className="self-end relative z-10">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenBentoFocus('pillars');
                              }}
                              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer transition text-white"
                              title="Xem chi tiết trụ cột nhân văn"
                            >
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Pillar 3: Bền Vững */}
                        <div
                          onMouseEnter={() => setHoveredPillarOrValue('pillar-3')}
                          onMouseLeave={() => setHoveredPillarOrValue(null)}
                          onClick={() => {
                            SoundEngine.playPop();
                            showToast('Trụ cột 03: Bền Vững - Giá trị dài hạn và tin cậy');
                          }}
                          className={cn(
                            'pillar-gradient-card layered-card rounded-[14px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-800 dark:to-cyan-700 text-white p-3.5 shadow-md flex flex-col justify-between min-h-[145px] relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/25 dark:border-white/20 text-left group cursor-pointer',
                            isPillarHighlighted('pillar-3') &&
                              'ring-2 ring-emerald-300 dark:ring-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)] scale-[1.02] -translate-y-1'
                          )}
                        >
                          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xs">
                              <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                              03
                            </span>
                          </div>

                          <div className="my-1.5 relative z-10">
                            <h5 className="text-xs sm:text-sm font-black font-play !text-white">Bền vững dài hạn</h5>
                            <span className="text-[10px] text-emerald-100 font-semibold block">Giá trị &amp; Tin cậy</span>
                            <p className="text-[11px] text-white/95 font-medium leading-snug mt-1">
                              Xây dựng niềm tin vững bền, bảo chứng chất lượng và đồng hành lâu dài.
                            </p>
                          </div>

                          <div className="self-end relative z-10">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenBentoFocus('pillars');
                              }}
                              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer transition text-white"
                              title="Xem chi tiết trụ cột bền vững"
                            >
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub Grid Row 2: Giá trị cốt lõi (7 cols) + Triết lý tầm nhìn (5 cols) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                    {/* Giá trị cốt lõi (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                          <h4 className="text-[18px] font-bold font-play text-amber-600 dark:text-amber-400" style={{ fontSize: '18px', fontWeight: 700 }}>
                            {formatCardTitle('Giá trị cốt lõi')}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                          3 Cam kết vàng chuẩn mực
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch flex-1">
                        {/* Core Value 1: Sự tận tâm */}
                        <div
                          onMouseEnter={() => setHoveredPillarOrValue('val-1')}
                          onMouseLeave={() => setHoveredPillarOrValue(null)}
                          onClick={() => {
                            SoundEngine.playPop();
                            showToast('Giá trị 01: Sự Tận Tâm - Dốc trọn tâm sức');
                          }}
                          className={cn(
                            'pillar-gradient-card layered-card rounded-[14px] bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 dark:from-amber-600 dark:via-amber-700 dark:to-orange-700 text-white p-3.5 shadow-md flex flex-col justify-between min-h-[168px] sm:min-h-[175px] relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/25 dark:border-white/20 text-left group cursor-pointer',
                            isValueHighlighted('val-1') &&
                              'ring-2 ring-amber-300 dark:ring-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.75)] scale-[1.02] -translate-y-1'
                          )}
                        >
                          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-300/20 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xs">
                              <Award className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                              01
                            </span>
                          </div>

                          <div className="my-1.5 relative z-10">
                            <h5 className="text-xs sm:text-sm font-black font-play !text-white">Sự tận tâm</h5>
                            <span className="text-[10px] text-amber-100 font-semibold block">Trách nhiệm &amp; Hết lòng</span>
                            <p className="text-[11px] text-white/95 font-medium leading-snug mt-1">
                              Dốc trọn tâm sức, chăm chút tỉ mỉ từng trải nghiệm khách hàng với tinh thần phụng sự cao nhất.
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-white/20 relative z-10">
                            <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-amber-100 mb-0.5">
                              <span>FCR Cam kết</span>
                              <span className="text-white font-black">94.5%</span>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: '94.5%' }} />
                            </div>
                          </div>
                        </div>

                        {/* Core Value 2: Kịp thời */}
                        <div
                          onMouseEnter={() => setHoveredPillarOrValue('val-2')}
                          onMouseLeave={() => setHoveredPillarOrValue(null)}
                          onClick={() => {
                            SoundEngine.playPop();
                            showToast('Giá trị 02: Kịp Thời - Nhanh nhạy & Đúng lúc');
                          }}
                          className={cn(
                            'pillar-gradient-card layered-card rounded-[14px] bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 dark:from-orange-600 dark:via-rose-600 dark:to-pink-700 text-white p-3.5 shadow-md flex flex-col justify-between min-h-[168px] sm:min-h-[175px] relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/25 dark:border-white/20 text-left group cursor-pointer',
                            isValueHighlighted('val-2') &&
                              'ring-2 ring-pink-300 dark:ring-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.75)] scale-[1.02] -translate-y-1'
                          )}
                        >
                          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-300/20 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xs">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                              02
                            </span>
                          </div>

                          <div className="my-1.5 relative z-10">
                            <h5 className="text-xs sm:text-sm font-black font-play !text-white">Kịp thời nhanh nhạy</h5>
                            <span className="text-[10px] text-rose-100 font-semibold block">Tốc độ &amp; Đúng lúc</span>
                            <p className="text-[11px] text-white/95 font-medium leading-snug mt-1">
                              Phản ứng nhanh chóng, đồng hành đúng thời điểm để giải quyết triệt để mọi vướng mắc.
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-white/20 relative z-10">
                            <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-rose-100 mb-0.5">
                              <span>SLA Phản hồi (&lt;15p)</span>
                              <span className="text-white font-black">98.8%</span>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: '98.8%' }} />
                            </div>
                          </div>
                        </div>

                        {/* Core Value 3: Đồng cảm chân thành */}
                        <div
                          onMouseEnter={() => setHoveredPillarOrValue('val-3')}
                          onMouseLeave={() => setHoveredPillarOrValue(null)}
                          onClick={() => {
                            SoundEngine.playPop();
                            showToast('Giá trị 03: Đồng Cảm Chân Thành - Lắng nghe & Thấu cảm');
                          }}
                          className={cn(
                            'pillar-gradient-card layered-card rounded-[14px] bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 dark:from-pink-600 dark:via-purple-700 dark:to-indigo-800 text-white p-3.5 shadow-md flex flex-col justify-between min-h-[168px] sm:min-h-[175px] relative overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/25 dark:border-white/20 text-left group cursor-pointer',
                            isValueHighlighted('val-3') &&
                              'ring-2 ring-purple-300 dark:ring-purple-400 shadow-[0_0_24px_rgba(192,132,252,0.75)] scale-[1.02] -translate-y-1'
                          )}
                        >
                          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-300/20 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xs">
                              <HeartHandshake className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                              03
                            </span>
                          </div>

                          <div className="my-1.5 relative z-10">
                            <h5 className="text-xs sm:text-sm font-black font-play !text-white">Đồng cảm chân thành</h5>
                            <span className="text-[10px] text-purple-100 font-semibold block">Lắng nghe &amp; Thấu cảm</span>
                            <p className="text-[11px] text-white/95 font-medium leading-snug mt-1">
                              Đặt trọn trái tim để lắng nghe, thấu hiểu cảm xúc và kết nối sâu sắc với từng khách hàng.
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-white/20 relative z-10">
                            <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-purple-100 mb-0.5">
                              <span>Chỉ số CSAT Hài lòng</span>
                              <span className="text-white font-black">98.6%</span>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: '98.6%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Triết lý và tầm nhìn (5 cols) */}
                    <div className="lg:col-span-5 p-4 sm:p-5 rounded-[14px] bg-gradient-to-br from-sky-50/90 via-cyan-50/70 to-blue-100/60 dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-blue-950/40 border border-sky-200/80 dark:border-sky-800/50 shadow-2xs flex flex-col justify-between relative hover:shadow-xs transition-all duration-300 min-h-[175px]">
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-sky-200/60 dark:border-sky-800/40">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                            <h5 className="text-xs sm:text-sm font-black font-play text-blue-600 dark:text-sky-400">
                              {formatCardTitle('Triết lý tầm nhìn')}
                            </h5>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
                            CX 2026+
                          </span>
                        </div>

                        <div className="my-2.5">
                          <p className="text-xs sm:text-[12.5px] font-black text-blue-700 dark:text-cyan-300 font-play leading-snug">
                            “ Tận Tâm &amp; Đồng Hành Cùng Trải Nghiệm Khách Hàng ”.
                          </p>
                          <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1.5">
                            Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi
                            khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn được lắng nghe.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

          </div>
      </div>



      {/* Bento Card Focus / Expand Modal (Yêu Cầu 5) */}
      <Modal
        isOpen={!!focusedBentoCard}
        onClose={handleCloseBentoFocus}
        title={
          focusedBentoCard === 'hero'
            ? 'Chân Dung Chuyên Gia & Trợ Lý Ảo'
            : focusedBentoCard === 'stats'
            ? '4 Dấu Ấn Năng Lực Vận Hành Thực Chiến'
            : focusedBentoCard === 'demographics'
            ? 'Hồ Sơ Nhân Khẩu Học & Lộ Trình Di Chuyển'
            : focusedBentoCard === 'map'
            ? 'Bản Đồ Cư Trú & Công Tác Tương Tác'
            : focusedBentoCard === 'pillars'
            ? '3 Trụ Cột Vận Hành Chiến Lược (22+ Năm)'
            : focusedBentoCard === 'philosophy'
            ? 'Giá Trị Cốt Lõi & Triết Lý Tầm Nhìn CX 2026+'
            : 'Chi Tiết Thẻ Bento'
        }
        icon={
          focusedBentoCard === 'hero' ? (
            <Bot className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          ) : focusedBentoCard === 'stats' ? (
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          ) : focusedBentoCard === 'demographics' ? (
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          ) : focusedBentoCard === 'map' ? (
            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : focusedBentoCard === 'pillars' ? (
            <Target className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          ) : focusedBentoCard === 'philosophy' ? (
            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-amber-500" />
          ) : undefined
        }
        maxWidth="5xl"
      >
        {renderFocusedCardContent()}
      </Modal>
    </div>
  );
}
