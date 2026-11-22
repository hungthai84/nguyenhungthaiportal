'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SmartFaceVideo } from '@/components/ui/SmartFaceVideo';
import { useBannerVideo } from '@/context/BannerVideoContext';
import { DriveAwareBannerMedia } from '@/components/common/DriveAwareBannerMedia';
// Icons migrated to WebIcon (Hugeicons)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import {
  Maximize2,
  Minimize2,
  Copy,
  Check,
  QrCode,
  Download,
  Map as MapIcon,
} from 'lucide-react';
import { cn, formatCardTitle } from '@/lib/utils';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';

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
      shortLabel: 'Tân Mỹ, TP.HCM',
      value: 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh',
      color: '#0284C7',
      r: 175,
      t: '26s',
      dir: 'normal',
      rdir: 'reverse',
      deg: 180,
      type: 'map' as const,
      mapData: {
        type: 'tam_tru' as const,
        title: 'Tạm trú: Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh',
        address: 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh',
        query: 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh',
      },
    },
    {
      id: 'permanent_residence',
      icon: 'home',
      label: 'Cư trú',
      shortLabel: 'Mỹ Tho, Đồng Tháp',
      value: '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp',
      color: '#10B981',
      r: 175,
      t: '26s',
      dir: 'normal',
      rdir: 'reverse',
      deg: 270,
      type: 'map' as const,
      mapData: {
        type: 'cu_tru' as const,
        title: 'Cư trú: 7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp',
        address: '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp',
        query: '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp',
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
      const a = document.createElement('a');
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
          will-change: transform;
          backface-visibility: hidden;
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
        @keyframes u306-r { to { transform: rotate3d(0, 0, 1, 360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .u306-rg, .u306-up { animation: none !important; will-change: auto; }
        }
        .u306-sl { position: absolute; left: 0; top: 0; }
        .u306-up {
          position: absolute;
          left: -18px;
          top: -18px;
          will-change: transform;
          backface-visibility: hidden;
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
          font-size: var(--fs-label, 12px);
          font-weight: 600 !important;
          line-height: 1.2;
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
        html.dark .u306-ic {
          background: rgba(15, 23, 42, 0.92);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(148, 163, 184, 0.28);
        }
        html.dark .u306-ic:hover,
        html.dark .u306-ic.is-on {
          background: rgba(30, 41, 59, 0.98);
        }
        @media (max-width: 440px) {
          .u306 {
            transform: scale(0.76);
            transform-origin: top center;
            height: 295px;
            margin-bottom: -10px;
          }
        }
      `}</style>
    </div>
  );
};

export function AboutView({ 
  currentTheme = 'liquid-glass', 
  onNavigatePage,
  onShowNotification,
  onOpenMapModal,
  onOpenBentoFocusModal
}: AboutViewProps = {}) {
  const { showToast } = useToast();
  const { bannerAssignments } = useBannerVideo();
  const driveAboutBanner = bannerAssignments.about;

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

  // Horizontal peek-carousel centering state for Card 1 & Card 2
  const aboutContainerRef = useRef<HTMLDivElement>(null);
  const [activeIntroCard, setActiveIntroCard] = useState<1 | 2>(1);
  const activeIntroCardRef = useRef<1 | 2>(1);
  useEffect(() => {
    activeIntroCardRef.current = activeIntroCard;
  }, [activeIntroCard]);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [aboutContainerWidth, setAboutContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.max(320, window.innerWidth - 2) : 1440
  );
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const peekReserve = viewportWidth <= 1023 ? 32 : 112;
  const aboutCardWidth = Math.min(1250, Math.max(260, viewportWidth - peekReserve));
  const aboutSideInset = Math.max(15, (aboutContainerWidth - aboutCardWidth) / 2);

  useEffect(() => {
    const el = aboutContainerRef.current;
    const updateWidth = () => {
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      if (el) {
        const w = el.clientWidth;
        if (w > 0) setAboutContainerWidth(w);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    if (el && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateWidth);
      ro.observe(el);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', updateWidth);
      };
    }
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

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

  // Chế độ thu phóng toàn cảnh Card Video, sao chép danh thiếp 1 chạm & mã QR vCard động
  const [isVideoFullscreenOpen, setIsVideoFullscreenOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrMode, setQrMode] = useState<'vcard' | 'url'>('vcard');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isVCardCopied, setIsVCardCopied] = useState(false);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const ABOUT_VCARD_PAYLOAD = useMemo(
    () =>
      [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Nguyễn;Hùng Thái;;;',
        'FN:Nguyễn Hùng Thái',
        'TITLE:Head of CX & CS Operations (22+ Năm)',
        'TEL;TYPE=CELL,VOICE:+84909097882',
        'EMAIL;TYPE=INTERNET:hungthai84@gmail.com',
        'URL:https://nguyenhungthai.powerservice.one/',
        'ADR;TYPE=HOME:;;Chung Cư Tân Mỹ, Phường Tân Phú (Q7);TP. Hồ Chí Minh;;VN',
        'ADR;TYPE=WORK:;;7D7 Hoàng Hoa Tám, Phường Mỹ Tho;Tỉnh Đồng Tháp;;VN',
        'NOTE:LinkedIn: https://www.linkedin.com/in/hungthai84/ | Tu vi: Giap Ty 1984 (Hai Trung Kim)',
        'END:VCARD',
      ].join('\n'),
    []
  );

  const ABOUT_CONTACT_SHARE_TEXT = useMemo(
    () =>
      [
        'Nguyễn Hùng Thái — Head of CX & CS Operations (22+ Năm)',
        '• Điện thoại / Zalo: +84 0909097882',
        '• Hộp thư: hungthai84@gmail.com',
        '• Website: https://nguyenhungthai.powerservice.one/',
        '• LinkedIn: https://www.linkedin.com/in/hungthai84/',
        '• Tạm trú: Chung Cư Tân Mỹ, P. Tân Phú (Q7), TP. Hồ Chí Minh',
        '• Cư trú: 7D7 Hoàng Hoa Tám, P. Mỹ Tho, Tỉnh Đồng Tháp',
      ].join('\n'),
    []
  );

  useEffect(() => {
    if (!isQrModalOpen) return;
    let active = true;
    const payload = qrMode === 'vcard' ? ABOUT_VCARD_PAYLOAD : 'https://nguyenhungthai.powerservice.one/';
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [isQrModalOpen, qrMode, ABOUT_VCARD_PAYLOAD]);

  const handleCopyFullVCard = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      SoundEngine.playPop();
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(ABOUT_CONTACT_SHARE_TEXT);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = ABOUT_CONTACT_SHARE_TEXT;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        setIsVCardCopied(true);
        showToast('✓ Đã sao chép toàn bộ danh thiếp liên hệ!');
        window.setTimeout(() => setIsVCardCopied(false), 2200);
      } catch {
        showToast('Không thể truy cập khay nhớ tạm, vui lòng thử lại.');
      }
    },
    [ABOUT_CONTACT_SHARE_TEXT, showToast]
  );

  const handleDownloadVcf = useCallback(() => {
    SoundEngine.playPop();
    const blob = new Blob([ABOUT_VCARD_PAYLOAD], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nguyen_Hung_Thai_CX.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✓ Đã tải danh thiếp điện tử (.vcf)');
  }, [ABOUT_VCARD_PAYLOAD, showToast]);

  const toggleHeroMediaMode = useCallback(() => {
    SoundEngine.playPop();
    setActiveHeroMedia((prev) => {
      const next = prev === 'video' ? 'map' : 'video';
      showToast(
        next === 'map'
          ? `Đã chuyển sang Bản đồ (${activeHeroMapType === 'tam_tru' ? 'Tạm trú TP.HCM' : 'Cư trú Đồng Tháp'})`
          : 'Đã quay lại chế độ Video chân dung'
      );
      return next;
    });
  }, [activeHeroMapType, showToast]);

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



  // Handler nghe thuyết trình AI ngắn gọn cho từng Trụ Cột / Giá Trị bằng giọng AI Trí Nhân (Puck 10 tuổi Miền Nam)
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
    showToast(`Đang kết nối giọng AI Trí Nhân (Puck): ${title}...`);

    speakSiteText(text, {
      useGeminiTts: true,
      speakingStyle: 'puck',
      rate: 1.03,
      pitch: 1.32,
      onStart: () => {
        setActiveSpeechId(id);
        showToast(`AI Trí Nhân (Puck) đang thuyết trình: ${title}... 🎙️`);
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

  const getCenteredScrollLeftForCard = useCallback(
    (cardNumber: 1 | 2) => {
      const container = aboutContainerRef.current;
      if (!container) return cardNumber === 1 ? 0 : aboutCardWidth + 15;
      const cardEl = document.getElementById(`about-intro-card-${cardNumber}`);
      if (!cardEl) return cardNumber === 1 ? 0 : aboutCardWidth + 15;
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
    [aboutCardWidth]
  );

  const scrollToIntroCard = useCallback(
    (targetCard: 1 | 2, smooth = true) => {
      activeIntroCardRef.current = targetCard;
      setActiveIntroCard(targetCard);
      const container = aboutContainerRef.current;
      if (!container) return;
      const targetLeft = getCenteredScrollLeftForCard(targetCard);
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
      scrollTimeoutRef.current = window.setTimeout(() => {
        const settledLeft = getCenteredScrollLeftForCard(targetCard);
        if (Math.abs(container.scrollLeft - settledLeft) > 1) {
          container.scrollLeft = settledLeft;
        }
        isProgrammaticScrollRef.current = false;
        evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
      }, smooth ? 560 : 60);
    },
    [getCenteredScrollLeftForCard]
  );

  // Đồng bộ trạng thái Card 1 / Card 2 với nút Tới trang / Lùi trang ở Footer
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', { detail: { tabIndex: 2, slide: activeIntroCard - 1 } })
    );
  }, [activeIntroCard]);

  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.tabIndex === undefined || detail.tabIndex === 2) && typeof detail.slide === 'number') {
        const clampedSlide = Math.max(0, Math.min(1, detail.slide));
        const targetCard: 1 | 2 = clampedSlide === 0 ? 1 : 2;
        scrollToIntroCard(targetCard, true);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [scrollToIntroCard]);

  // Chiều cao Card Video & Card Thông tin chi tiết được đồng bộ trực tiếp bằng CSS Grid (equal 1fr tracks) ở mọi kích thước

  // Keep active intro card centered with #app-header when viewport resizes
  useEffect(() => {
    const container = aboutContainerRef.current;
    if (!container || isProgrammaticScrollRef.current) return;
    const raf = requestAnimationFrame(() => {
      const expectedLeft = getCenteredScrollLeftForCard(activeIntroCardRef.current);
      if (Math.abs(container.scrollLeft - expectedLeft) > 1) {
        container.scrollLeft = expectedLeft;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [aboutCardWidth, aboutContainerWidth, getCenteredScrollLeftForCard]);

  const handleAboutContainerScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const container = aboutContainerRef.current;
    if (!container) return;
    const c1 = getCenteredScrollLeftForCard(1);
    const c2 = getCenteredScrollLeftForCard(2);
    const nextCard: 1 | 2 =
      Math.abs(container.scrollLeft - c2) <= Math.abs(container.scrollLeft - c1) ? 2 : 1;
    if (nextCard !== activeIntroCardRef.current) {
      activeIntroCardRef.current = nextCard;
      setActiveIntroCard(nextCard);
    }
  }, [getCenteredScrollLeftForCard]);

  // Keyboard accessibility: ESC đóng modal/video, M chuyển Video/Bản đồ, F thu phóng Video, ArrowLeft/ArrowRight chuyển Card 1/2
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
        if (isVideoFullscreenOpen) {
          setIsVideoFullscreenOpen(false);
        } else if (isQrModalOpen) {
          setIsQrModalOpen(false);
        } else if (focusedBentoCard) {
          handleCloseBentoFocus();
        } else if (isPlayingIntro) {
          handleCancelIntro();
        }
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const lowerKey = e.key.toLowerCase();
      if (!isQrModalOpen && !focusedBentoCard) {
        if (lowerKey === 'm') {
          e.preventDefault();
          if (isVideoFullscreenOpen) setIsVideoFullscreenOpen(false);
          toggleHeroMediaMode();
          return;
        }
        if (lowerKey === 'f' && activeHeroMedia === 'video') {
          e.preventDefault();
          SoundEngine.playPop();
          setIsVideoFullscreenOpen((prev) => !prev);
          return;
        }
      }

      if (viewMode === 'slides' && !isPlayingIntro && !focusedBentoCard && !isVideoFullscreenOpen && !isQrModalOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          scrollToIntroCard(1, true);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          scrollToIntroCard(2, true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlayingIntro,
    viewMode,
    focusedBentoCard,
    isVideoFullscreenOpen,
    isQrModalOpen,
    activeHeroMedia,
    handleCloseBentoFocus,
    scrollToIntroCard,
    toggleHeroMediaMode,
  ]);

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
            <div className="sub-card grid grid-cols-1 md:grid-cols-2 gap-4 items-center rounded-[14px] p-5 border border-[var(--border-subcard)] text-[var(--text-primary)]">
              <div className="relative aspect-video rounded-[14px] overflow-hidden bg-black/60 border border-[var(--border-subcard)] flex items-center justify-center">
                <video
                  src={ABOUT_INTRO_VIDEO_URL}
                  controls
                  playsInline
                  className="w-full h-full object-cover object-[50%_18%] rounded-[14px]"
                />
              </div>
              <div className="flex flex-col justify-between gap-3 text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-cyan-300 typo-badge border border-blue-500/30 dark:border-cyan-500/30 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                    <span>Lãnh Đạo Vận Hành CX 22+ Năm</span>
                  </div>
                  <h3 className="card-title card-header-sync card-title-synced typo-h3 text-[var(--text-primary)] flex items-center gap-2" data-card-title="true">
                    <WebIcon name="user-round" className="w-5 h-5 shrink-0 text-[var(--color-primary)]" />
                    <span>Nguyễn Hùng Thái</span>
                  </h3>
                  <div className="typo-body-sm text-[var(--text-secondary)] mt-2 space-y-2">
                    <p>
                      Một chuyên gia dịch vụ khách hàng với hơn <strong>22 năm kinh nghiệm thực chiến</strong>. Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá: để lắng nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.
                    </p>
                    <p>
                      Tôi tin rằng sự hài lòng không đến từ sự hoàn hảo tuyệt đối, mà đến từ <strong>sự tận tâm kịp thời</strong> và <strong>đồng cảm chân thành</strong>. Trong suốt sự nghiệp, tôi đã trực tiếp thiết kế và tối ưu hóa hàng chục quy trình, hệ thống Chăm Sóc Khách Hàng, luôn đặt trên nền tảng ba giá trị cốt lõi:
                    </p>
                    <div className="p-2 rounded-[14px] bg-[var(--bg-nested-badge)] border border-[var(--border-subcard)] text-blue-600 dark:text-cyan-300 typo-h5 font-play text-center">
                      Hiệu quả – Nhân văn – Bền vững
                    </div>
                    <p>
                      Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà cốt lõi: <em>Họ luôn được lắng nghe.</em>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subcard)]">
                  <img
                    src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.gif"
                    alt="Nguyễn Hùng Thái"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="typo-caption text-[var(--text-secondary)]">
                    <span className="font-semibold text-blue-600 dark:text-cyan-400">Trợ Lý Ảo Tí Chuột:</span> “Sẵn sàng kết nối và đồng hành cùng quý doanh nghiệp!”
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
                  data-subcard="true"
                  className="sub-card p-3.5 rounded-[14px] border border-[var(--border-subcard)] shadow-sm flex flex-col justify-between"
                >
                  <div
                    className="w-8 h-8 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <WebIcon name={getWebIconName(stat.iconName)} className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div className="my-3">
                    <span
                      className="typo-kpi font-play block"
                      style={{ color: stat.color }}
                    >
                      {stat.metric}
                    </span>
                    <span className="typo-label text-[var(--text-muted)] block mt-1 font-mono">
                      {stat.unitVi || 'Thực chiến'}
                    </span>
                  </div>
                  <p className="typo-body-sm text-[var(--text-secondary)] leading-snug">
                    {stat.id === 'experience' && 'Hơn hai thập kỷ trực tiếp điều hành, thiết lập quy chuẩn và nâng cấp dịch vụ.'}
                    {stat.id === 'scale' && 'Từng quản lý và xây dựng hệ thống tại hơn 8 tập đoàn, doanh nghiệp quy mô lớn.'}
                    {stat.id === 'automation' && 'Tích hợp công nghệ AI, CRM & quy trình tự động hoá chăm sóc khách hàng 24/7.'}
                    {stat.id === 'csat' && 'Chỉ số hài lòng khách hàng (CSAT) liên tục duy trì ở mức cao kỷ lục.'}
                  </p>
                </div>
              ))}
            </div>
            <div data-subcard="true" className="sub-card p-4 rounded-[14px] border border-[var(--border-subcard)] typo-body-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)] font-semibold">💡 Triết lý đo lường thực chiến:</strong> Số liệu phản ánh năng lực kiểm soát chi tiết từ vi mô (từng cuộc gọi, khiếu nại, phản hồi khách hàng) đến vĩ mô (chiến lược ngân sách, nhân sự, kiến trúc hệ thống CRM và chuyển đổi số).
            </div>
          </div>
        );

      case 'demographics':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {PERSONAL_DEMOGRAPHICS.map((item) => {
                const isWideRow = item.id === 'hometown' || item.id === 'residence' || item.valueVi.length > 22;
                return (
                  <div
                    key={item.id}
                    data-subcard="true"
                    title={`${item.labelVi}: ${item.valueVi}`}
                    className={cn(
                      'about-info-subcard px-3 py-2.5 rounded-[14px] border flex flex-row items-center gap-2 transition-all hover:scale-[1.01] cursor-default min-w-0 overflow-hidden',
                      isWideRow && 'sm:col-span-2'
                    )}
                  >
                    <div className="exp-icon-badge w-7 h-7 rounded-[10px] border flex items-center justify-center shrink-0">
                      <WebIcon name={getWebIconName(item.iconName)} className={cn('w-4 h-4', item.colorTheme.iconColor)} />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-row items-center gap-1 whitespace-nowrap overflow-hidden">
                      <span className="about-info-label typo-label text-[var(--text-secondary)] shrink-0">
                        {item.labelVi}:
                      </span>
                      <span className="about-info-value typo-body-sm font-semibold font-play text-[var(--text-primary)] truncate min-w-0 flex-1">
                        {item.valueVi}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>
        );

      case 'map':
        return (
          <div className="space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playPop();
                  setActiveMapTab('tam_tru');
                }}
                style={
                  activeMapTab === 'tam_tru'
                    ? { background: 'var(--bg-button-primary)', color: '#FFFFFF', borderColor: 'transparent' }
                    : undefined
                }
                className={cn(
                  'px-3.5 py-1.5 rounded-full typo-button transition-all cursor-pointer flex items-center gap-1.5 border',
                  activeMapTab === 'tam_tru'
                    ? 'shadow-sm'
                    : 'bg-[var(--bg-subcard)] text-[var(--text-secondary)] border-[var(--border-subcard)]'
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 inline-block ring-2 ring-red-400/50" />
                <span>Tạm trú: Chung Cư Tân Mỹ (TP.HCM)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playPop();
                  setActiveMapTab('cu_tru');
                }}
                style={
                  activeMapTab === 'cu_tru'
                    ? { background: 'var(--bg-button-primary)', color: '#FFFFFF', borderColor: 'transparent' }
                    : undefined
                }
                className={cn(
                  'px-3.5 py-1.5 rounded-full typo-button transition-all cursor-pointer flex items-center gap-1.5 border',
                  activeMapTab === 'cu_tru'
                    ? 'shadow-sm'
                    : 'bg-[var(--bg-subcard)] text-[var(--text-secondary)] border-[var(--border-subcard)]'
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 inline-block ring-2 ring-red-400/50" />
                <span>Cư trú: 7D7 Hoàng Hoa Tám (Đồng Tháp)</span>
              </button>
            </div>

            <div className="relative w-full h-[360px] rounded-[14px] overflow-hidden border border-[var(--border-subcard)] shadow-inner bg-[var(--bg-subcard)]">
              <iframe
                title={activeMapTab === 'tam_tru' ? 'Bản đồ Tạm trú Chung Cư Tân Mỹ' : 'Bản đồ Cư trú 7D7 Hoàng Hoa Tám'}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  activeMapTab === 'tam_tru'
                    ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                    : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                )}&t=&z=16&ie=UTF8&iwloc=B&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Red Pin Badge in Modal Map */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white shadow-md text-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                </span>
                <span className="font-semibold text-red-400">Ghim đỏ địa chỉ:</span>
                <span className="truncate max-w-[260px] sm:max-w-md">
                  {activeMapTab === 'tam_tru'
                    ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                    : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-[14px] bg-[var(--bg-subcard)] border border-[var(--border-subcard)] typo-caption">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="text-red-500 font-bold text-base">📍</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {activeMapTab === 'tam_tru' ? 'Tạm trú hiện tại' : 'Cư trú quê quán'}
                  </div>
                  <div className="text-[var(--text-secondary)]">
                    {activeMapTab === 'tam_tru'
                      ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                      : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeMapTab === 'tam_tru'
                      ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                      : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium inline-flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Mở Google Maps</span>
                  <WebIcon name="external-link" className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );

      case 'pillars':
        return (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subcard)]">
              <span className="typo-body-sm text-[var(--text-secondary)] font-medium">
                3 nguyên lý vận hành cốt lõi qua hơn 22 năm điều hành hệ thống dịch vụ khách hàng:
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pillar 1 */}
              <div
                data-subcard="true"
                data-accent="blue"
                className="pillar-gradient-card layered-card rounded-[14px] p-4 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="subcard-header-sync flex items-center gap-2 text-blue-600 dark:text-sky-300">
                      <WebIcon name="chart" className="w-4 h-4 shrink-0" />
                      <h4 className="pillar-heading subcard-title-synced typo-h4 font-play text-blue-600 dark:text-sky-300" data-subcard-title="true">01. Hiệu quả</h4>
                    </div>
                    <span className="pillar-badge typo-badge font-mono px-2 py-0.5 rounded-[14px]">Trụ cột 01</span>
                  </div>
                  <p className="pillar-sub typo-caption font-semibold mt-1">Tối ưu quy trình &amp; Kết quả</p>
                  <p className="pillar-body typo-body-sm mt-2.5">
                    Tối ưu hiệu suất vận hành, chuẩn hóa SOP, quản trị KPI, SLA, FCR và giải quyết triệt để rủi ro dịch vụ.
                  </p>
                </div>
                <div className="pillar-divider pillar-sub mt-4 pt-2 border-t typo-label font-mono">
                  ✓ Chuẩn hóa SOP &amp; Đo lường ROI
                </div>
              </div>

              {/* Pillar 2 */}
              <div
                data-subcard="true"
                data-accent="rose"
                className="pillar-gradient-card layered-card rounded-[14px] p-4 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="subcard-header-sync flex items-center gap-2 text-rose-600 dark:text-rose-300">
                      <WebIcon name="heart" className="w-4 h-4 shrink-0" />
                      <h4 className="pillar-heading subcard-title-synced typo-h4 font-play text-rose-600 dark:text-rose-300" data-subcard-title="true">02. Nhân văn</h4>
                    </div>
                    <span className="pillar-badge typo-badge font-mono px-2 py-0.5 rounded-[14px]">Trụ cột 02</span>
                  </div>
                  <p className="pillar-sub typo-caption font-semibold mt-1">Đồng cảm &amp; Thấu hiểu</p>
                  <p className="pillar-body typo-body-sm mt-2.5">
                    Lắng nghe thấu hiểu từ tâm, lấy con người làm gốc rễ, đào tạo đội ngũ tận tâm và xây dựng văn hóa gắn kết.
                  </p>
                </div>
                <div className="pillar-divider pillar-sub mt-4 pt-2 border-t typo-label font-mono">
                  ✓ Thấu cảm từ tâm &amp; Trao quyền
                </div>
              </div>

              {/* Pillar 3 */}
              <div
                data-subcard="true"
                data-accent="emerald"
                className="pillar-gradient-card layered-card rounded-[14px] p-4 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="subcard-header-sync flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                      <WebIcon name="leaf" className="w-4 h-4 shrink-0" />
                      <h4 className="pillar-heading subcard-title-synced typo-h4 font-play text-emerald-600 dark:text-emerald-300" data-subcard-title="true">03. Bền vững</h4>
                    </div>
                    <span className="pillar-badge typo-badge font-mono px-2 py-0.5 rounded-[14px]">Trụ cột 03</span>
                  </div>
                  <p className="pillar-sub typo-caption font-semibold mt-1">Giá trị &amp; Tin cậy</p>
                  <p className="pillar-body typo-body-sm mt-2.5">
                    Xây dựng niềm tin dài hạn, ứng dụng công nghệ CRM hiện đại, Data Analytics và tự động hóa AI tạo đòn bẩy.
                  </p>
                </div>
                <div className="pillar-divider pillar-sub mt-4 pt-2 border-t typo-label font-mono">
                  ✓ Công nghệ AI CRM &amp; Tăng trưởng
                </div>
              </div>
            </div>

            <div data-subcard="true" className="exp-detail-subcard p-3.5 rounded-[14px] flex items-center justify-between typo-caption text-[var(--text-secondary)]">
              <span className="typo-h3 font-handwriting text-blue-600 dark:text-cyan-400 font-bold">
                Luôn bên bạn và tận tâm từng khoảnh khắc ♡
              </span>
              <span className="font-mono typo-label text-[var(--text-muted)]">22+ Năm Phụng Sự Dịch Vụ Khách Hàng</span>
            </div>
          </div>
        );

      case 'philosophy':
        return (
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Khối 1: Giá trị cốt lõi */}
              <div data-subcard="true" className="exp-detail-card rounded-[14px] p-5 flex flex-col justify-between layered-card">
                <div>
                  <div className="subcard-header-sync flex items-center gap-2 text-amber-600 dark:text-amber-300 mb-2">
                    <WebIcon name="star" className="w-5 h-5 fill-current text-amber-600 dark:text-amber-300" />
                    <h4 className="typo-h4 subcard-title-synced font-play text-amber-600 dark:text-amber-300" data-subcard-title="true">Giá Trị Cốt Lõi: Khách Hàng Là Trung Tâm</h4>
                  </div>
                  <p className="typo-body-sm text-[var(--text-primary)]">
                    Sự hài lòng không đến từ sự hoàn hảo tuyệt đối, mà đến từ <strong className="text-amber-700 dark:text-amber-300 font-semibold">sự tận tâm kịp thời</strong> và <strong className="text-amber-700 dark:text-amber-300 font-semibold">đồng cảm chân thành</strong> trong từng điểm chạm (Touchpoint).
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-amber-200/40 dark:border-amber-400/20 text-amber-700 dark:text-amber-300 typo-h3 font-handwriting font-bold">
                  Tận tâm phụng sự ♡
                </div>
              </div>

              {/* Khối 2: Triết lý tầm nhìn */}
              <div data-subcard="true" className="exp-detail-card rounded-[14px] p-5 flex flex-col justify-between layered-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="subcard-header-sync flex items-center gap-2 text-blue-600 dark:text-sky-300">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-sky-300" />
                      <h4 className="typo-h4 subcard-title-synced font-play text-blue-600 dark:text-sky-300" data-subcard-title="true">Triết Lý Tầm Nhìn CX 2026+</h4>
                    </div>
                    <span className="exp-icon-badge typo-badge font-mono px-2 py-0.5 rounded-full border text-[var(--text-secondary)]">
                      Kỷ Nguyên Mới
                    </span>
                  </div>
                  <div className="my-2 text-center space-y-2 py-2 px-3 rounded-[14px] bg-blue-500/8 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-400/20">
                    <WebIcon name="quote" className="w-5 h-5 text-blue-600 dark:text-cyan-400 mx-auto opacity-80" />
                    <blockquote className="typo-h5 font-semibold italic text-blue-800 dark:text-cyan-300 font-play leading-snug text-balance">
                      “Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn được lắng nghe.”
                    </blockquote>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-sky-200/40 dark:border-sky-400/20 flex items-center justify-between typo-label font-mono text-[var(--text-muted)]">
                  <span>Nguyễn Hùng Thái</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-semibold">22+ Năm Vận Hành Thực Chiến</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={aboutContainerRef}
      id="about-page-container"
      data-element-name="Trang Giới Thiệu Chuyên Gia"
      data-element-type="container"
      data-element-page="about"
      data-element-parent="global-content-viewport"
      data-no-wheel-horizontal="true"
      onScroll={handleAboutContainerScroll}
      style={{
        width: '100%',
        maxWidth: '100%',
        marginLeft: '0px',
        marginRight: '0px',
        paddingTop: '0px',
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        gap: '15px',
        rowGap: '15px',
        columnGap: '15px',
        borderRadius: '0px',
        background: 'transparent',
        ['--about-card-w' as any]: `${aboutCardWidth}px`,
        ['--about-side-inset' as any]: `${aboutSideInset}px`,
      }}
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] font-play text-left text-[var(--text-primary)] transition-all duration-300 rounded-none overflow-x-hidden overflow-y-hidden no-scrollbar z-10 select-none box-border"
    >
      <div
        id="about-cards-track"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '15px',
          rowGap: '15px',
          columnGap: '15px',
          paddingLeft: `${aboutSideInset}px`,
          paddingRight: `${aboutSideInset}px`,
          height: '100%',
          minHeight: '100%',
          width: 'max-content',
          boxSizing: 'border-box',
        }}
        className="page-cards-track flex flex-row items-stretch gap-[15px] h-full min-h-full box-border"
      >
      {/* ========================================================================= */}
      {/* CARD GIỚI THIỆU 1: CHỨA CARD VIDEO VÀ CARD THÔNG TIN CHI TIẾT             */}
      {/* ========================================================================= */}
      <div
        id="about-intro-card-1"
        data-main-card="true"
        data-element-name="Card giới thiệu 1"
        data-element-type="card"
        data-element-page="about"
        data-element-parent="about-page-container"
        onClickCapture={(e) => {
          if (activeIntroCard !== 1) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToIntroCard(1, true);
          }
        }}
        title={activeIntroCard !== 1 ? 'Click để chuyển Card giới thiệu 1 ra chính giữa màn hình' : undefined}
        style={{
          width: `${aboutCardWidth}px`,
          maxWidth: '1250px',
          minWidth: `${aboutCardWidth}px`,
          flex: `0 0 ${aboutCardWidth}px`,
          height: '100%',
          minHeight: '100%',
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px',
          gap: '15px',
          rowGap: '15px',
          columnGap: '15px',
          borderRadius: 'var(--radius-main, 30px)',
        }}
        className={cn(
          'page-main-card max-w-[1250px] shrink-0 h-full min-h-full flex flex-col justify-center p-[15px] gap-[15px] rounded-[var(--radius-main,30px)] overflow-y-auto overflow-x-hidden glass-scrollbar box-border transition-opacity duration-300',
          activeIntroCard !== 1 ? 'cursor-pointer opacity-90 hover:opacity-100' : 'opacity-100'
        )}
      >
        <div
          id="about-intro-grid-1"
          style={{ padding: '0px' }}
          className="w-full flex-1 min-h-0 my-auto grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] grid-rows-[minmax(0,1fr)] gap-[10px] sm:gap-[15px] p-0 overflow-hidden items-stretch box-border"
        >
            
            {/* CARD 1: CARD VIDEO CHÂN DUNG CHUYÊN GIA (70%) */}
            <div
              id="about-hero-video-container"
              data-element-name="Card video chân dung chuyên gia"
              data-element-type="card"
              data-media-card="video"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              style={{
                borderRadius: 'var(--radius-card, 14px)',
                padding: '5px',
              }}
              className="bento-card glass-card col-span-1 relative rounded-[var(--radius-card,14px)] overflow-hidden flex flex-col justify-center items-center self-stretch h-full min-h-0 min-w-0 group/video p-[5px] text-left"
            >
                  <div
                    style={{ borderRadius: 'calc(var(--radius-card, 14px) - 5px)' }}
                    className="relative w-full h-full flex-1 overflow-hidden min-h-0 flex items-center justify-center"
                  >
                  {activeHeroMedia === 'video' ? (
                    <>
                      {driveAboutBanner && !isPlayingIntro ? (
                        <div className="absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none z-0">
                          <DriveAwareBannerMedia
                            directVideoUrl={driveAboutBanner.directStreamUrl}
                            iframeFallbackUrl={driveAboutBanner.previewIframeUrl}
                            posterUrl="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.png"
                            title={driveAboutBanner.fileName}
                            muted={true}
                            loop={true}
                            className="pointer-events-none opacity-100 transition-opacity duration-700 brightness-105 contrast-105"
                          />
                        </div>
                      ) : (
                        <SmartFaceVideo
                          videoRef={videoRef}
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
                          faceAnchor={{ x: 50, y: 18 }}
                          maxCropDistortion={1.6}
                          wrapperClassName="absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none z-0"
                          className="pointer-events-none opacity-100 transition-opacity duration-700 brightness-105 contrast-105"
                          src={isPlayingIntro ? ABOUT_INTRO_VIDEO_URL : ABOUT_IDLE_VIDEO_URL}
                        />
                      )}
                      <button
                        type="button"
                        id="about-video-expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          SoundEngine.playPop();
                          setIsVideoFullscreenOpen(true);
                        }}
                        title="Mở rộng toàn cảnh Video giới thiệu (Phím F)"
                        aria-label="Mở rộng toàn cảnh Video giới thiệu"
                        className="theme-video-capsule absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold font-play cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto"
                      >
                        <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline whitespace-nowrap">Toàn cảnh</span>
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 w-full h-full z-0 animate-fadeIn flex flex-col justify-between">
                      {/* Google Maps Iframe with Red Pin marker centered */}
                      <iframe
                        title={activeHeroMapType === 'tam_tru' ? 'Bản đồ Tạm trú: Chung Cư Tân Mỹ' : 'Bản đồ Cư trú: 7D7 Hoàng Hoa Tám'}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          activeHeroMapType === 'tam_tru'
                            ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                            : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                        )}&t=&z=16&ie=UTF8&iwloc=B&output=embed`}
                        className="absolute inset-0 w-full h-full border-0 brightness-105 contrast-105 z-0"
                        loading="lazy"
                        allowFullScreen
                      />

                      {/* Header bar overlay: Location Selector & Red Pin Indicator */}
                      <div className="relative z-20 p-2.5 sm:p-3 flex items-center justify-between gap-2 pointer-events-auto">
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/25 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              SoundEngine.playPop();
                              setActiveHeroMapType('tam_tru');
                              setActiveMapTab('tam_tru');
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold font-play transition-all flex items-center gap-1.5 ${
                              activeHeroMapType === 'tam_tru'
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block ring-1 ring-white" />
                            <span>Tạm trú</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              SoundEngine.playPop();
                              setActiveHeroMapType('cu_tru');
                              setActiveMapTab('cu_tru');
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold font-play transition-all flex items-center gap-1.5 ${
                              activeHeroMapType === 'cu_tru'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block ring-1 ring-white" />
                            <span>Cư trú</span>
                          </button>
                        </div>

                        {/* Close Map / Switch back to Video button */}
                        <button
                          type="button"
                          onClick={() => setActiveHeroMedia('video')}
                          className="theme-modal-close p-2 rounded-full shadow-lg bg-slate-950/80 backdrop-blur-md border border-white/20 text-white active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-xs"
                          title="Quay lại xem Video chân dung"
                        >
                          <WebIcon name="cancel" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Quay lại video</span>
                        </button>
                      </div>

                      {/* Bottom Place Details Card Overlay (Chi tiết địa điểm với Ghim Đỏ) */}
                      <div className="relative z-20 m-2.5 sm:m-3 p-3 rounded-[14px] bg-white/95 dark:bg-slate-950/85 backdrop-blur-md border border-slate-200/80 dark:border-white/20 text-slate-900 dark:text-white flex flex-col gap-2 pointer-events-auto">
                        <div className="flex items-start gap-2.5">
                          {/* Red Pin Badge */}
                          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0 text-red-600 dark:text-red-400 text-base">
                            📍
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-cyan-700 dark:text-cyan-300">
                                {activeHeroMapType === 'tam_tru' ? 'Tạm trú hiện tại' : 'Cư trú quê quán'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 typo-badge font-mono">
                                Đã ghim đỏ trên Map
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 dark:text-slate-100 font-medium mt-0.5 leading-snug">
                              {activeHeroMapType === 'tam_tru'
                                ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                                : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              activeHeroMapType === 'tam_tru'
                                ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                                : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium inline-flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <span>Mở Google Maps</span>
                            <WebIcon name="external-link" className="w-3 h-3" />
                          </a>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              activeHeroMapType === 'tam_tru'
                                ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                                : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white font-medium inline-flex items-center gap-1.5 transition-all"
                          >
                            <span>Chỉ đường</span>
                            <WebIcon name="navigation" className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button Capsule - Only visible when Video is active (hidden when Map is shown) */}
                  {activeHeroMedia === 'video' && (
                    <div 
                      id="el-p2-div-103"
                      style={{ borderRadius: '999px' }}
                      className={`theme-video-capsule video-play-btn video-play-btn--about ${isPlayingIntro ? 'is-playing' : ''} absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 z-30 max-w-[calc(100%-16px)] inline-flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-300 cursor-pointer pointer-events-auto active:scale-98 select-none`}
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
                        className={`video-play-btn__sound w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
                          !isVideoMuted
                            ? 'text-current shadow-xs'
                            : 'is-muted text-white shadow-md'
                        }`}
                        title={!isVideoMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                        aria-label={!isVideoMuted ? 'Tắt tiếng video' : 'Bật âm thanh video'}
                      >
                        <span className="flex items-center justify-center">
                          {!isVideoMuted ? (
                            <WebIcon name="volume-2" className="w-3.5 h-3.5 text-current" />
                          ) : (
                            <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
                          )}
                        </span>
                      </button>

                      {/* Vertical Divider */}
                      <div className="w-[1px] h-4 bg-current opacity-25 shrink-0 mx-0.5" />

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
                          style={{
                            paddingLeft: '8px',
                            paddingRight: '10px',
                            borderRadius: '999px',
                          }}
                          className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                          title="Bấm để phát video thuyết minh chân dung chuyên gia"
                        >
                          <span id="el-p2-span-36" className="flex items-center justify-center">
                            <WebIcon id="el-p2-svg-17" name="play" className="w-4 h-4 fill-current text-current shrink-0" style={{ height: '16px', width: '16px' }} />
                          </span>
                          <span id="el-p2-span-37" className="typo-button text-current truncate font-play text-left" style={{ textAlign: 'left' }}>
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
                          style={{
                            paddingLeft: '8px',
                            paddingRight: '10px',
                            borderRadius: '999px',
                          }}
                          className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                          title="Bấm để hủy phát video"
                        >
                          <span id="el-p2-span-36" className="flex items-center justify-center">
                            <WebIcon id="el-p2-svg-17" name="cancel" className="w-4 h-4 stroke-[2.8] text-current shrink-0" style={{ height: '16px', width: '16px' }} />
                          </span>
                          <span id="el-p2-span-37" className="typo-button text-current truncate font-play text-left" style={{ textAlign: 'left' }}>
                            Hủy Phát
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                  </div>
                  </div>

            {/* CARD 2: CARD THÔNG TIN CHI TIẾT (30% - Chiều cao luôn bằng Card Video) */}
            <div
              id="about-personal-info-card-right"
              data-element-name="Card thông tin chi tiết"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              style={{
                borderRadius: 'var(--radius-card, 14px)',
              }}
              className="bento-card glass-card col-span-1 flex flex-col justify-between gap-2 sm:gap-2.5 self-stretch h-full min-h-0 min-w-0 text-left rounded-[var(--radius-card,14px)] p-2.5 sm:p-[15px] overflow-hidden"
            >
                  {/* Header Bento Box Bar + Thanh thao tác nhanh (Lật Bản đồ M, Sao chép 1 chạm, Mã QR vCard) */}
                  <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 border-b border-[var(--border-subcard)] pb-1.5 sm:pb-2 shrink-0 min-w-0">
                    <div className="card-header-sync flex items-center gap-1.5 sm:gap-2 text-blue-600 dark:text-cyan-400 min-w-0 flex-1">
                      <WebIcon name="user" className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-cyan-400 shrink-0" />
                      <h3 className="typo-h3 card-title-synced font-play text-blue-600 dark:text-cyan-400 leading-tight truncate" data-card-title="true">
                        Thông tin chi tiết
                      </h3>
                    </div>
                  </div>

                  {/* Sub-Card Bento Grid (Sắp xếp 3 tầng ưu tiên: Liên hệ trực tiếp -> Bản đồ vị trí -> Nhân khẩu học, 6 hàng cân đối không ô trống) */}
                  <div
                    id="about-personal-info-grid"
                    className="grid grid-cols-1 sm:grid-cols-6 lg:auto-rows-fr gap-2 sm:gap-2.5 py-0.5 flex-1 min-h-0 overflow-y-auto glass-scrollbar items-stretch w-full min-w-0"
                  >
                    {[
                      // TẦNG 1: LIÊN HỆ & KẾT NỐI TRỰC TIẾP
                      {
                        id: 'phone',
                        label: 'Điện thoại',
                        value: '+84 0909097882',
                        icon: 'phone',
                        iconColorCls: 'text-orange-600 dark:text-orange-300',
                        bgCls: 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500/25 dark:border-orange-400/30',
                        action: () => {
                          window.open('https://zalo.me/0909097882', '_blank', 'noopener,noreferrer');
                        },
                        colSpan: 'col-span-1 sm:col-span-3',
                      },
                      {
                        id: 'email',
                        label: 'Hộp thư',
                        value: 'hungthai84@gmail.com',
                        icon: 'mail',
                        iconColorCls: 'text-pink-600 dark:text-pink-300',
                        bgCls: 'bg-pink-500/10 dark:bg-pink-500/15 border-pink-500/25 dark:border-pink-400/30',
                        action: () => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText('hungthai84@gmail.com');
                            showToast('✓ Đã sao chép Email: hungthai84@gmail.com');
                          }
                        },
                        colSpan: 'col-span-1 sm:col-span-3',
                      },
                      {
                        id: 'website',
                        label: 'Website',
                        value: 'Vào website',
                        icon: 'globe',
                        iconColorCls: 'text-blue-600 dark:text-sky-300',
                        bgCls: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/25 dark:border-blue-400/30',
                        action: () => {
                          window.open('https://nguyenhungthai.powerservice.one/', '_blank', 'noopener,noreferrer');
                        },
                        colSpan: 'col-span-1 sm:col-span-3',
                      },
                      {
                        id: 'linkedin',
                        label: 'LinkedIn',
                        value: 'Vào linkedin',
                        icon: 'user-check',
                        iconColorCls: 'text-indigo-600 dark:text-indigo-300',
                        bgCls: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/25 dark:border-indigo-400/30',
                        action: () => {
                          window.open('https://www.linkedin.com/in/hungthai84/', '_blank', 'noopener,noreferrer');
                        },
                        colSpan: 'col-span-1 sm:col-span-3',
                      },
                      // TẦNG 2: ĐỊA ĐIỂM & BẢN ĐỒ TƯƠNG TÁC
                      {
                        id: 'tam_tru',
                        label: 'Tạm trú',
                        value: 'P.Tân Phú (Q7) , TP. Hồ Chí Minh',
                        icon: 'map-pin',
                        iconColorCls: 'text-cyan-600 dark:text-cyan-300',
                        bgCls: cn(
                          'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/25 dark:border-cyan-400/30',
                          activeHeroMedia === 'map' && activeHeroMapType === 'tam_tru' && 'ring-2 ring-cyan-500/70'
                        ),
                        action: () => {
                          setActiveHeroMedia('map');
                          setActiveHeroMapType('tam_tru');
                          setActiveMapTab('tam_tru');
                          showToast('📍 Tạm trú: P.Tân Phú (Q7) , TP. Hồ Chí Minh');
                        },
                        colSpan: 'col-span-1 sm:col-span-6',
                      },
                      {
                        id: 'cu_tru',
                        label: 'Cư trú',
                        value: 'Phường Mỹ Tho, Tỉnh Đồng Tháp',
                        icon: 'home',
                        iconColorCls: 'text-teal-600 dark:text-teal-300',
                        bgCls: cn(
                          'bg-teal-500/10 dark:bg-teal-500/15 border-teal-500/25 dark:border-teal-400/30',
                          activeHeroMedia === 'map' && activeHeroMapType === 'cu_tru' && 'ring-2 ring-teal-500/70'
                        ),
                        action: () => {
                          setActiveHeroMedia('map');
                          setActiveHeroMapType('cu_tru');
                          setActiveMapTab('cu_tru');
                          showToast('📍 Cư trú: Phường Mỹ Tho, Tỉnh Đồng Tháp');
                        },
                        colSpan: 'col-span-1 sm:col-span-6',
                      },
                      // TẦNG 3: THÔNG TIN CÁ NHÂN & NHÂN KHẨU HỌC
                      {
                        id: 'birthday',
                        label: 'Sinh nhật',
                        value: '22/06/1984',
                        icon: 'calendar',
                        iconColorCls: 'text-amber-600 dark:text-amber-300',
                        bgCls: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/25 dark:border-amber-400/30',
                        action: () => showToast('Sinh nhật: 22/06/1984'),
                        colSpan: 'col-span-1 sm:col-span-3',
                      },
                      {
                        id: 'horoscope',
                        label: 'Tử vi',
                        value: 'Giáp Tý',
                        icon: 'sparkles',
                        iconColorCls: 'text-purple-600 dark:text-purple-300',
                        bgCls: 'bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/25 dark:border-purple-400/30',
                        action: () => showToast('Tử vi: Giáp Tý - Mệnh Hải Trung Kim'),
                        colSpan: 'col-span-1 sm:col-span-3',
                      },
                      {
                        id: 'gender',
                        label: 'Giới tính',
                        value: 'Nam giới',
                        icon: 'user',
                        iconColorCls: 'text-sky-600 dark:text-sky-300',
                        bgCls: 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/25 dark:border-sky-400/30',
                        action: () => showToast('Giới tính: Nam giới'),
                        colSpan: 'col-span-1 sm:col-span-2',
                      },
                      {
                        id: 'ethnicity',
                        label: 'Dân tộc',
                        value: 'Kinh',
                        icon: 'globe',
                        iconColorCls: 'text-emerald-600 dark:text-emerald-300',
                        bgCls: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/25 dark:border-emerald-400/30',
                        action: () => showToast('Dân tộc: Kinh'),
                        colSpan: 'col-span-1 sm:col-span-2',
                      },
                      {
                        id: 'marital',
                        label: 'Hôn nhân',
                        value: 'Độc thân',
                        icon: 'heart',
                        iconColorCls: 'text-rose-600 dark:text-rose-300',
                        bgCls: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/25 dark:border-rose-400/30',
                        action: () => showToast('Hôn nhân: Độc thân'),
                        colSpan: 'col-span-1 sm:col-span-2',
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        data-subcard="true"
                        onClick={() => {
                          SoundEngine.playPop();
                          item.action();
                        }}
                        title={`${item.label}: ${item.value}`}
                        className={cn(
                          'about-info-subcard h-full min-h-[60px] sm:min-h-[64px] w-full flex flex-col justify-between p-2.5 rounded-[14px] border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard overflow-hidden box-border min-w-0',
                          item.colSpan,
                          item.bgCls
                        )}
                      >
                        {/* Hàng 1: Icon & Tiêu đề */}
                        <div className="flex items-center gap-1.5 min-w-0 w-full">
                          <WebIcon
                            name={item.icon}
                            className={cn('w-3.5 h-3.5 shrink-0', item.iconColorCls)}
                            style={{ width: '14px', height: '14px' }}
                          />
                          <span className={cn('about-info-label typo-label font-bold leading-tight whitespace-nowrap truncate min-w-0', item.iconColorCls)}>
                            {item.label}
                          </span>
                        </div>

                        {/* Hàng 2: Chỉ hiển thị 1 dòng */}
                        <div className="about-info-value typo-body-sm font-semibold font-play text-[var(--text-primary)] leading-tight whitespace-nowrap truncate min-w-0 w-full">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>


                </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD GIỚI THIỆU 2: GIỚI THIỆU BẢN THÂN, 3 TRỤ CỘT, GIÁ TRỊ & TRIẾT LÝ     */}
      {/* ========================================================================= */}
      <div
        id="about-intro-card-2"
        data-main-card="true"
        data-element-name="Card giới thiệu 2"
        data-element-type="card"
        data-element-page="about"
        data-element-parent="about-page-container"
        onClickCapture={(e) => {
          if (activeIntroCard !== 2) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToIntroCard(2, true);
          }
        }}
        title={activeIntroCard !== 2 ? 'Click để chuyển Card giới thiệu 2 ra chính giữa màn hình' : undefined}
        style={{
          width: `${aboutCardWidth}px`,
          maxWidth: '1250px',
          minWidth: `${aboutCardWidth}px`,
          flex: `0 0 ${aboutCardWidth}px`,
          height: '100%',
          minHeight: '100%',
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px',
          gap: '15px',
          rowGap: '15px',
          columnGap: '15px',
        }}
        className={cn(
          'page-main-card max-w-[1250px] shrink-0 h-full min-h-full flex flex-col p-[15px] gap-[15px] rounded-[14px] overflow-y-auto overflow-x-hidden glass-scrollbar box-border transition-opacity duration-300',
          activeIntroCard !== 2 ? 'cursor-pointer opacity-90 hover:opacity-100' : 'opacity-100'
        )}
      >
        <div
          id="about-intro-grid-2"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px' }}
          className="w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 lg:auto-rows-fr gap-[15px] p-0 overflow-visible items-stretch box-border"
        >
            {/* CARD 3: CARD GIỚI THIỆU BẢN THÂN (ABOUT ME) - ĐÃ XÓA HÌNH NỀN THẺ VIDEO */}
            <div
              id="about-career-goal-card"
              data-element-name="Card Giới Thiệu Bản Thân Chuyên Gia"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-2"
              style={{
                padding: '15px',
              }}
              className="bento-card glass-card col-span-1 lg:col-span-5 xl:col-span-5 h-full flex flex-col justify-between gap-[15px] text-left rounded-[14px] p-[15px] overflow-hidden group select-none relative"
            >
              <div className="relative z-10 flex flex-col justify-between h-full gap-[15px]">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subcard)] shrink-0">
                  <div className="card-header-sync flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                    <User className="w-4.5 h-4.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <h3 className="typo-h3 card-title-synced font-play text-blue-600 dark:text-cyan-400 leading-tight" data-card-title="true">
                      {formatCardTitle('Giới thiệu bản thân')}
                    </h3>
                  </div>
                </div>

                {/* Body Text: Giữ nguyên 100% dữ liệu */}
                <p className="typo-body text-[var(--text-secondary)] my-auto">
                  Một chuyên gia dịch vụ khách hàng với hơn{' '}
                  <strong className="font-semibold text-[var(--text-primary)]">22 năm kinh nghiệm</strong> thực chiến.
                  Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò chuyện, mỗi khoảnh
                  khắc, dù là nhỏ nhất, đều là một cơ hội quý giá để lắng nghe, để thấu hiểu, và để tạo ra những trải
                  nghiệm vượt trên cả sự mong đợi.
                </p>
              </div>
            </div>

            {/* CARD 4: CARD 3 TRỤ CỘT VẬN HÀNH (3 OPERATING PILLARS) - THẺ ĐỘC LẬP */}
            <div
              id="about-operating-pillars-card"
              data-element-name="Card 3 Trụ Cột Vận Hành Chiến Lược"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-2"
              style={{
                padding: '15px',
              }}
              className="bento-card glass-card col-span-1 lg:col-span-7 xl:col-span-7 h-full flex flex-col justify-between gap-[15px] text-left rounded-[14px] p-[15px] overflow-hidden group select-none relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subcard)] shrink-0">
                <div className="card-header-sync flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                  <Target className="w-4.5 h-4.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <h3 className="typo-h3 card-title-synced font-play text-blue-600 dark:text-cyan-400 leading-tight" data-card-title="true">
                    {formatCardTitle('3 Trụ cột vận hành')}
                  </h3>
                </div>
              </div>

              {/* 3 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[15px] items-stretch flex-1">
                {/* Pillar 1: Hiệu Quả */}
                <div
                  data-subcard="true"
                  data-accent="blue"
                  onMouseEnter={() => setHoveredPillarOrValue('pillar-1')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  className={cn(
                    'pillar-gradient-card layered-card rounded-[14px] p-[15px] gap-[15px] shadow-md flex flex-col justify-center min-h-[145px] relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group',
                    isPillarHighlighted('pillar-1') &&
                      'ring-2 ring-cyan-300 dark:ring-cyan-400 shadow-[0_0_24px_rgba(56,189,248,0.7)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="my-auto relative z-10">
                    <div className="pillar-heading flex items-center gap-2 text-blue-600 dark:text-sky-300">
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-play m-0">Hiệu quả vận hành</h5>
                    </div>
                    <span className="pillar-sub typo-label block mt-0.5">Tối ưu &amp; Kết quả</span>
                    <p className="pillar-body typo-body-sm mt-1">
                      Chuẩn hóa SLAs, tối ưu hiệu suất quy trình và tạo kết quả đo lường rõ ràng.
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Nhân Văn */}
                <div
                  data-subcard="true"
                  data-accent="rose"
                  onMouseEnter={() => setHoveredPillarOrValue('pillar-2')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  className={cn(
                    'pillar-gradient-card layered-card rounded-[14px] p-[15px] gap-[15px] shadow-md flex flex-col justify-center min-h-[145px] relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group',
                    isPillarHighlighted('pillar-2') &&
                      'ring-2 ring-pink-300 dark:ring-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.7)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="my-auto relative z-10">
                    <div className="pillar-heading flex items-center gap-2 text-rose-600 dark:text-rose-300">
                      <Heart className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-play m-0">Nhân văn con người</h5>
                    </div>
                    <span className="pillar-sub typo-label block mt-0.5">Đồng cảm &amp; Thấu hiểu</span>
                    <p className="pillar-body typo-body-sm mt-1">
                      Lắng nghe chân thành, phục vụ từ tâm và lấy con người làm trọng tâm.
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Bền Vững */}
                <div
                  data-subcard="true"
                  data-accent="emerald"
                  onMouseEnter={() => setHoveredPillarOrValue('pillar-3')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  className={cn(
                    'pillar-gradient-card layered-card rounded-[14px] p-[15px] gap-[15px] shadow-md flex flex-col justify-center min-h-[145px] relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group',
                    isPillarHighlighted('pillar-3') &&
                      'ring-2 ring-emerald-300 dark:ring-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="my-auto relative z-10">
                    <div className="pillar-heading flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                      <Leaf className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-play m-0">Bền vững dài hạn</h5>
                    </div>
                    <span className="pillar-sub typo-label block mt-0.5">Giá trị &amp; Tin cậy</span>
                    <p className="pillar-body typo-body-sm mt-1">
                      Xây dựng niềm tin vững bền, bảo chứng chất lượng và đồng hành lâu dài.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5: CARD GIÁ TRỊ CỐT LÕI (CORE VALUES) - THẺ ĐỘC LẬP */}
            <div
              id="about-core-values-card"
              data-element-name="Card Giá Trị Cốt Lõi Vàng"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-2"
              className="bento-card glass-card col-span-1 lg:col-span-7 xl:col-span-7 h-full flex flex-col justify-between gap-[16px] text-left rounded-[16px] p-[16px] overflow-hidden group select-none relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subcard)] shrink-0">
                <div className="card-header-sync flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Star className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 fill-current shrink-0" />
                  <h3 className="typo-h3 card-title-synced font-play text-amber-600 dark:text-amber-400 leading-tight" data-card-title="true">
                    {formatCardTitle('Giá trị cốt lõi')}
                  </h3>
                </div>
              </div>

              {/* 3 Core Values Grid (Không có speaker, không lật thẻ) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px] items-stretch flex-1">
                {/* Core Value 1: Tận tâm trách nhiệm */}
                <div
                  data-subcard="true"
                  data-accent="amber"
                  onMouseEnter={() => setHoveredPillarOrValue('val-1')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  onClick={() => {
                    SoundEngine.playPop();
                    showToast('Giá trị 01: Tận tâm trách nhiệm - Dốc trọn tâm sức');
                  }}
                  className={cn(
                    'pillar-gradient-card layered-card rounded-[12px] p-[12px] gap-[12px] shadow-md flex flex-col justify-center min-h-[168px] sm:min-h-[175px] relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group cursor-pointer',
                    isValueHighlighted('val-1') &&
                      'ring-2 ring-amber-300 dark:ring-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.75)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="my-auto relative z-10">
                    <div className="pillar-heading flex items-center gap-2 text-amber-600 dark:text-amber-300">
                      <Award className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-play m-0">Tận tâm trách nhiệm</h5>
                    </div>
                    <span className="pillar-sub typo-label block mt-0.5">Trách nhiệm &amp; Hết lòng</span>
                    <p className="pillar-body typo-body-sm mt-1">
                      Dốc trọn tâm sức, chăm chút tỉ mỉ từng trải nghiệm khách hàng với tinh thần phụng sự cao nhất.
                    </p>
                  </div>
                </div>

                {/* Core Value 2: Kịp thời */}
                <div
                  data-subcard="true"
                  data-accent="pink"
                  onMouseEnter={() => setHoveredPillarOrValue('val-2')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  onClick={() => {
                    SoundEngine.playPop();
                    showToast('Giá trị 02: Kịp Thời - Nhanh nhạy & Đúng lúc');
                  }}
                  className={cn(
                    'pillar-gradient-card layered-card rounded-[12px] p-[12px] gap-[12px] shadow-md flex flex-col justify-center min-h-[168px] sm:min-h-[175px] relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group cursor-pointer',
                    isValueHighlighted('val-2') &&
                      'ring-2 ring-pink-300 dark:ring-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.75)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="my-auto relative z-10">
                    <div className="pillar-heading flex items-center gap-2 text-pink-600 dark:text-pink-300">
                      <Clock className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-play m-0">Kịp thời nhanh nhạy</h5>
                    </div>
                    <span className="pillar-sub typo-label block mt-0.5">Tốc độ &amp; Đúng lúc</span>
                    <p className="pillar-body typo-body-sm mt-1">
                      Phản ứng nhanh chóng, đồng hành đúng thời điểm để giải quyết triệt để mọi vướng mắc.
                    </p>
                  </div>
                </div>

                {/* Core Value 3: Đồng cảm chân thành */}
                <div
                  data-subcard="true"
                  data-accent="purple"
                  onMouseEnter={() => setHoveredPillarOrValue('val-3')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  onClick={() => {
                    SoundEngine.playPop();
                    showToast('Giá trị 03: Đồng Cảm Chân Thành - Lắng nghe & Thấu cảm');
                  }}
                  className={cn(
                    'pillar-gradient-card layered-card rounded-[12px] p-[12px] gap-[12px] shadow-md flex flex-col justify-center min-h-[168px] sm:min-h-[175px] relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group cursor-pointer',
                    isValueHighlighted('val-3') &&
                      'ring-2 ring-purple-300 dark:ring-purple-400 shadow-[0_0_24px_rgba(192,132,252,0.75)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="my-auto relative z-10">
                    <div className="pillar-heading flex items-center gap-2 text-purple-600 dark:text-purple-300">
                      <HeartHandshake className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-play m-0">Đồng cảm chân thành</h5>
                    </div>
                    <span className="pillar-sub typo-label block mt-0.5">Lắng nghe &amp; Thấu cảm</span>
                    <p className="pillar-body typo-body-sm mt-1">
                      Đặt trọn trái tim để lắng nghe, thấu hiểu cảm xúc và kết nối sâu sắc với từng khách hàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 6: CARD TRIẾT LÝ TẦM NHÌN (CÂU NÓI HAY / SIGNATURE QUOTE) */}
            <div
              id="about-philosophy-card"
              data-element-name="Card Triết Lý Tầm Nhìn CX 2026+"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-2"
              className="bento-card glass-card col-span-1 lg:col-span-5 xl:col-span-5 h-full flex flex-col justify-between gap-[16px] text-left rounded-[16px] p-[16px] overflow-hidden group select-none relative"
            >
              <div className="relative z-10 flex flex-col justify-between h-full gap-[16px]">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subcard)] shrink-0">
                  <div className="card-header-sync flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                    <Target className="w-4.5 h-4.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <h3 className="typo-h3 card-title-synced font-play text-blue-600 dark:text-cyan-400 leading-tight" data-card-title="true">
                      {formatCardTitle('Triết lý tầm nhìn')}
                    </h3>
                  </div>
                </div>

                {/* Bố cục Câu Nói Hay (Editorial Signature Quote) */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-3 py-1 gap-2.5 my-auto">
                  <WebIcon
                    name="quote"
                    className="w-6 h-6 text-blue-500/80 dark:text-cyan-400/80 shrink-0"
                  />
                  <blockquote className="typo-h5 font-play font-bold italic text-blue-700 dark:text-cyan-300 leading-snug text-balance m-0">
                    “Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn được lắng nghe.”
                  </blockquote>
                </div>

                {/* Footer trích dẫn tác giả */}
                <div className="pt-2 border-t border-[var(--border-subcard)] flex items-center justify-between gap-2 shrink-0">
                  <span className="typo-h3 font-handwriting text-blue-600 dark:text-cyan-300 font-bold leading-none">
                    Nguyễn Hùng Thái
                  </span>
                  <span className="typo-label font-mono text-[var(--text-muted)] truncate">
                    22+ Năm Phụng Sự CX
                  </span>
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

      {/* Modal Mã QR Danh Thiếp Cá Nhân Động (vCard 3.0 / URL) */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Mã QR Danh Thiếp Cá Nhân"
        subtitle="Quét mã bằng camera điện thoại để lưu thẳng liên hệ (vCard) vào danh bạ"
        icon={<QrCode className="w-5 h-5 text-blue-600 dark:text-cyan-400" />}
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4">
          {/* Segmented switcher: vCard vs Website */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard)] self-center">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setQrMode('vcard');
              }}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold font-play transition-all cursor-pointer whitespace-nowrap',
                qrMode === 'vcard'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              Lưu Danh Bạ (vCard)
            </button>
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setQrMode('url');
              }}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold font-play transition-all cursor-pointer whitespace-nowrap',
                qrMode === 'url'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              Mở Hồ Sơ Online
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Khung mã QR nền trắng độ tương phản chuẩn */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-[14px] bg-white border border-slate-200 shadow-sm">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Mã QR Danh thiếp Nguyễn Hùng Thái"
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-500">
                  Đang tạo mã QR...
                </div>
              )}
              <span className="mt-2 text-[11px] font-mono text-slate-600">
                {qrMode === 'vcard' ? 'vCard 3.0 · Quét để lưu' : 'URL Hồ sơ chuyên gia'}
              </span>
            </div>

            {/* Tóm tắt thông tin danh thiếp */}
            <div className="sm:col-span-7 flex flex-col justify-between gap-3">
              <div className="space-y-1.5 text-sm">
                <div className="font-bold text-base text-[var(--text-primary)]">Nguyễn Hùng Thái</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Head of CX &amp; CS Operations · 22+ Năm thực chiến
                </div>
                <div className="pt-2 border-t border-[var(--border-subcard)] space-y-1 text-xs text-[var(--text-secondary)]">
                  <div>Điện thoại: <strong className="text-[var(--text-primary)] tabular-nums">+84 0909097882</strong></div>
                  <div>Hộp thư: <strong className="text-[var(--text-primary)]">hungthai84@gmail.com</strong></div>
                  <div>Tạm trú: <strong className="text-[var(--text-primary)]">P. Tân Phú (Q7), TP. Hồ Chí Minh</strong></div>
                  <div>Cư trú: <strong className="text-[var(--text-primary)]">P. Mỹ Tho, Tỉnh Đồng Tháp</strong></div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadVcf}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold cursor-pointer shadow-sm hover:opacity-95 active:scale-95 transition whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file .vcf</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyFullVCard}
                  className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer active:scale-95 transition whitespace-nowrap"
                >
                  {isVCardCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isVCardCopied ? 'Đã sao chép' : 'Sao chép text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Chế độ Thu Phóng Toàn Cảnh Card Video kèm Thanh Thông Số Tóm Tắt Trượt Nhẹ ở Cạnh Dưới */}
      {isClientMounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isVideoFullscreenOpen && (
              <motion.div
                id="about-video-panoramic-overlay"
                role="dialog"
                aria-modal="true"
                aria-label="Chế độ toàn cảnh Video giới thiệu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[1050] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none font-play"
              >
                {/* Video toàn khung */}
                <video
                  ref={fullscreenVideoRef}
                  key={isPlayingIntro ? 'fs-intro' : 'fs-idle'}
                  src={isPlayingIntro ? ABOUT_INTRO_VIDEO_URL : ABOUT_IDLE_VIDEO_URL}
                  autoPlay
                  loop={!isPlayingIntro}
                  muted={isPlayingIntro ? isVideoMuted : true}
                  playsInline
                  onEnded={handleVideoEnded}
                  className="absolute inset-0 w-full h-full object-contain sm:object-cover object-[50%_18%] z-0"
                />

                {/* Scrim trên & dưới đảm bảo độ tương phản WCAG AA (>= 4.5:1) */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/35 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/55 to-transparent z-10" />

                {/* Thanh tiêu đề trên cùng */}
                <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-4 sm:p-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550449/Avata_H%C3%B9ng_Th%C3%A1i.gif"
                      alt="Nguyễn Hùng Thái"
                      className="w-10 h-10 rounded-full object-cover border border-white/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-bold text-white truncate">
                        Nguyễn Hùng Thái · Video Giới Thiệu Chuyên Gia
                      </div>
                      <div className="text-xs text-slate-300 flex items-center gap-2 truncate">
                        <span>{isPlayingIntro ? 'Đang phát Video Thuyết Minh' : 'Video Chân Dung Tĩnh'}</span>
                        <span aria-hidden="true">·</span>
                        <span>22+ Năm Kinh Nghiệm CX</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (isPlayingIntro) {
                          handleCancelIntro();
                        } else {
                          handlePlayIntro();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-semibold cursor-pointer transition whitespace-nowrap"
                    >
                      {isPlayingIntro ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingIntro ? 'Về video nền' : 'Phát thuyết minh'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        const nextMuted = !isVideoMuted;
                        setIsVideoMuted(nextMuted);
                        saveMutedPref(nextMuted);
                        if (fullscreenVideoRef.current) fullscreenVideoRef.current.muted = nextMuted;
                        if (videoRef.current) videoRef.current.muted = nextMuted;
                      }}
                      title={isVideoMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                      aria-label={isVideoMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                      className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 flex items-center justify-center cursor-pointer transition"
                    >
                      {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        setIsVideoFullscreenOpen(false);
                      }}
                      title="Thu nhỏ lại Card Video (ESC)"
                      aria-label="Đóng chế độ toàn cảnh"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold cursor-pointer transition whitespace-nowrap"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Thu nhỏ</span>
                    </button>
                  </div>
                </div>

                {/* Thanh thông số tóm tắt trượt nhẹ ở cạnh dưới */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-20 mx-3 sm:mx-6 mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-[18px] bg-slate-950/75 backdrop-blur-xl border border-white/20 shadow-2xl text-white flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 min-w-0">
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-300">Kinh nghiệm</div>
                      <div className="text-xs sm:text-sm font-bold text-cyan-300 truncate tabular-nums">22+ Năm CX Ops</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-300">Điện thoại / Zalo</div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate tabular-nums">+84 0909097882</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-300">Hộp thư</div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">hungthai84@gmail.com</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-300">Nơi làm việc</div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">P. Tân Phú (Q7), TP.HCM</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/15 lg:pl-4">
                    <button
                      type="button"
                      onClick={handleCopyFullVCard}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold cursor-pointer transition whitespace-nowrap"
                    >
                      {isVCardCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isVCardCopied ? 'Đã sao chép' : 'Sao chép danh thiếp'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playPop();
                        setIsVideoFullscreenOpen(false);
                        setIsQrModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold cursor-pointer hover:opacity-95 transition whitespace-nowrap"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Mã QR vCard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playPop();
                        setIsVideoFullscreenOpen(false);
                        setActiveHeroMedia('map');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold cursor-pointer transition whitespace-nowrap"
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Xem Bản đồ</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
