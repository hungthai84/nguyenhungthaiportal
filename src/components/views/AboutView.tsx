'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// Icons migrated to WebIcon (Hugeicons)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <WebIcon name="linkedin" className={className || 'w-4 h-4'} strokeWidth={2.75} />
);
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn, formatCardTitle } from '@/lib/utils';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';

const Sparkles = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <WebIcon name="sparkles" className={className} style={style} />;
const ChevronLeft = ({ className }: { className?: string }) => <WebIcon name="chevron-left" className={className} />;
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

// Video 1 làm hình nền mặc định cho Card Giới thiệu (tự động phát khi mở, tắt âm thanh, phát vòng lặp)
const ABOUT_VIDEO_1_ID = '1YBxLU_NyWM8T3WAjOvtjSz0iP_6m1aB5';
const ABOUT_VIDEO_1_STREAM_URL = 'https://cdn.scena.ai/project/8606/e48a67884f3a52e8a68cf06b97979f3b22835ec92bf466a058c0d78da97c83b0.mp4';
const ABOUT_VIDEO_1_UC_URL = ABOUT_VIDEO_1_STREAM_URL;
const ABOUT_VIDEO_1_ALT_STREAM_URL = ABOUT_VIDEO_1_STREAM_URL;
const ABOUT_VIDEO_1_POSTER_URL = `https://drive.google.com/thumbnail?id=${ABOUT_VIDEO_1_ID}&sz=w1600`;
const ABOUT_VIDEO_1_URL = ABOUT_VIDEO_1_STREAM_URL;

// Video 2 phát khi bấm nút Phát Video (tự động phát, vòng lặp, mở âm thanh mặc định, không control)
const ABOUT_VIDEO_2_ID = '12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R';
const ABOUT_VIDEO_2_STREAM_URL = 'https://cdn.scena.ai/project/9626/42eba857297b415c8be72327102671129b5ebbdbaab55ac9eb6897411b4bdeda.mp4';
const ABOUT_VIDEO_2_UC_URL = ABOUT_VIDEO_2_STREAM_URL;
const ABOUT_VIDEO_2_ALT_STREAM_URL = ABOUT_VIDEO_2_STREAM_URL;
const ABOUT_VIDEO_2_URL = ABOUT_VIDEO_2_STREAM_URL;

type AboutStreamStage = 'primary' | 'uc' | 'alt' | 'iframe';

const ABOUT_VIDEO_SHARED_STYLE: React.CSSProperties = {
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

const ABOUT_VIDEO_SHARED_CLASS =
  'absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] banner-video-sharp select-none pointer-events-none transition-opacity duration-300';

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

  // Chế độ xem: cố định duy nhất dạng Trình chiếu Slide ('slides')
  const [viewMode, setViewMode] = useState<'dashboard' | 'bento' | 'slides'>('slides');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Yêu cầu 1: Bento Palette Theme Switcher ('pastel' | 'cyber' | 'emerald' | 'rose')
  const [bentoPalette, setBentoPalette] = useState<BentoPaletteType>('pastel');
  const [isPaletteMenuOpen, setIsPaletteMenuOpen] = useState(false);

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

  const prefersReducedMotion = useReducedMotion();
  const peekReserve = viewportWidth < 640 ? 20 : 32;
  const aboutCardWidth = Math.min(1000, Math.max(260, viewportWidth - peekReserve));
  const aboutSideInset = Math.max(10, (aboutContainerWidth - aboutCardWidth) / 2);

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

  // Card Thông tin chi tiết: 2 Tabs (Tab 1: Thông tin cá nhân, Tab 2: Thông tin liên hệ)
  const [detailInfoTab, setDetailInfoTab] = useState<'personal' | 'contact'>('personal');
  const [detailTabDirection, setDetailTabDirection] = useState<1 | -1>(1);
  const personalTabRef = useRef<HTMLButtonElement | null>(null);
  const contactTabRef = useRef<HTMLButtonElement | null>(null);

  const handleSwitchDetailTab = useCallback(
    (nextTab: 'personal' | 'contact') => {
      if (nextTab === detailInfoTab) return;
      SoundEngine.playTap();
      setDetailTabDirection(nextTab === 'contact' ? 1 : -1);
      setDetailInfoTab(nextTab);
    },
    [detailInfoTab]
  );

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

  // Dual-Layer Video State & Controls (Format chuẩn giống 100% Card Phỏng vấn)
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const hasInitializedAboutVideosRef = useRef<boolean>(false);
  const video1StageRef = useRef<AboutStreamStage>('primary');
  const video2StageRef = useRef<AboutStreamStage>('primary');
  const isPlayingIntroRef = useRef<boolean>(false);
  const isAudioOnRef = useRef<boolean>(false);
  const shouldResetVideo2StartRef = useRef<boolean>(false);

  const [video1Stage, setVideo1Stage] = useState<AboutStreamStage>('primary');
  const [video2Stage, setVideo2Stage] = useState<AboutStreamStage>('primary');
  const [isPlayingIntro, setIsPlayingIntro] = useState<boolean>(false);
  const [isVideo2Ready, setIsVideo2Ready] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [video2PlayNonce, setVideo2PlayNonce] = useState<number>(0);

  const getVideo1StreamUrl = useCallback((stage: AboutStreamStage): string => {
    if (stage === 'uc') return ABOUT_VIDEO_1_UC_URL;
    if (stage === 'alt') return ABOUT_VIDEO_1_ALT_STREAM_URL;
    return ABOUT_VIDEO_1_STREAM_URL;
  }, []);

  const getVideo2StreamUrl = useCallback((stage: AboutStreamStage): string => {
    if (stage === 'uc') return ABOUT_VIDEO_2_UC_URL;
    if (stage === 'alt') return ABOUT_VIDEO_2_ALT_STREAM_URL;
    return ABOUT_VIDEO_2_STREAM_URL;
  }, []);

  const activeAboutIntroVideoUrl = getVideo2StreamUrl(video2Stage);

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

  // Intersection Observer to pause video when scrolled out of viewport and resume when entering viewport
  useEffect(() => {
    const el = document.getElementById('about-hero-video-container');
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
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
  }, [tryStartVideo1, tryStartVideo2]);

  const loadVideo1 = useCallback(
    (stage: AboutStreamStage) => {
      video1StageRef.current = stage;
      setVideo1Stage(stage);
      if (stage === 'iframe') return;

      const video = video1Ref.current;
      if (!video) return;

      video.src = getVideo1StreamUrl(stage);
      video.preload = 'auto';
      const shouldAudioOn = !isPlayingIntroRef.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, true);
      try {
        video.load();
      } catch {
        // Ignore reload exception
      }
      if (!isPlayingIntroRef.current) {
        tryStartVideo1(video, shouldAudioOn);
      }
    },
    [enforceVideoAttributes, getVideo1StreamUrl, tryStartVideo1]
  );

  const loadVideo2 = useCallback(
    (stage: AboutStreamStage, shouldPlayImmediately: boolean) => {
      video2StageRef.current = stage;
      setVideo2Stage(stage);
      if (stage === 'iframe') return;

      const video = video2Ref.current;
      if (!video) return;

      video.src = getVideo2StreamUrl(stage);
      video.preload = shouldPlayImmediately ? 'auto' : 'metadata';
      const shouldAudioOn = isPlayingIntroRef.current && isAudioOnRef.current;
      enforceVideoAttributes(video, !shouldAudioOn, shouldPlayImmediately);
      try {
        video.load();
      } catch {
        // Ignore reload exception
      }
      if (shouldPlayImmediately && isPlayingIntroRef.current) {
        tryStartVideo2(video, shouldAudioOn);
      }
    },
    [enforceVideoAttributes, getVideo2StreamUrl, tryStartVideo2]
  );

  // Khởi tạo Video 1 làm nền mặc định (tắt tiếng, vòng lặp) và gắn sẵn nguồn cho Video 2 (preload metadata)
  useEffect(() => {
    if (activeHeroMedia !== 'video') {
      hasInitializedAboutVideosRef.current = false;
      return;
    }
    if (hasInitializedAboutVideosRef.current) return;
    hasInitializedAboutVideosRef.current = true;
    loadVideo1(video1StageRef.current === 'iframe' ? 'primary' : video1StageRef.current);
    const v2 = video2Ref.current;
    if (v2 && video2StageRef.current !== 'iframe') {
      v2.src = getVideo2StreamUrl(video2StageRef.current);
      v2.preload = isPlayingIntroRef.current ? 'auto' : 'metadata';
      enforceVideoAttributes(v2, !(isPlayingIntroRef.current && isAudioOnRef.current), isPlayingIntroRef.current);
      if (isPlayingIntroRef.current) {
        tryStartVideo2(v2, isAudioOnRef.current);
      }
    }
  }, [activeHeroMedia, enforceVideoAttributes, getVideo2StreamUrl, loadVideo1, tryStartVideo2]);

  // Tự động tiếp tục phát khi quay lại tab hoặc chạm lần đầu trên thiết bị di động
  useEffect(() => {
    const resumeActivePlayback = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      if (activeHeroMedia !== 'video') return;
      if (isPlayingIntroRef.current) {
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
  }, [activeHeroMedia, tryStartVideo1, tryStartVideo2]);

  const handleVideo1Error = useCallback(() => {
    if (video1StageRef.current === 'primary') {
      loadVideo1('uc');
    } else if (video1StageRef.current === 'uc') {
      loadVideo1('alt');
    } else if (video1StageRef.current === 'alt') {
      video1StageRef.current = 'iframe';
      setVideo1Stage('iframe');
    }
  }, [loadVideo1]);

  const handleVideo2Error = useCallback(() => {
    if (video2StageRef.current === 'primary') {
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
  }, [loadVideo2]);

  // Video 1 là hình nền mặc định luôn tắt âm thanh khi mở; chỉ đồng bộ AUDIO_PREF_EVENT khi đang phát Video 2
  useEffect(() => {
    const handleAudioPref = (e: Event) => {
      if (!isPlayingIntroRef.current) return;
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.muted === 'boolean') {
        const nextAudioOn = !customEvent.detail.muted;
        isAudioOnRef.current = nextAudioOn;
        setIsAudioOn(nextAudioOn);
        const activeEl = video2Ref.current;
        if (activeEl) {
          enforceVideoAttributes(activeEl, !nextAudioOn, true);
        }
      }
    };
    window.addEventListener(AUDIO_PREF_EVENT, handleAudioPref);
    return () => window.removeEventListener(AUDIO_PREF_EVENT, handleAudioPref);
  }, [enforceVideoAttributes]);

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
        if (focusedBentoCard) {
          handleCloseBentoFocus();
        } else if (isPlayingIntro) {
          handleCancelIntro();
        }
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const lowerKey = e.key.toLowerCase();
      if (!focusedBentoCard) {
        if (lowerKey === 'm') {
          e.preventDefault();
          toggleHeroMediaMode();
          return;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlayingIntro,
    viewMode,
    focusedBentoCard,
    handleCloseBentoFocus,
    toggleHeroMediaMode,
  ]);

  const handlePlayIntro = useCallback(() => {
    isPlayingIntroRef.current = true;
    isAudioOnRef.current = true;
    shouldResetVideo2StartRef.current = true;
    setIsPlayingIntro(true);
    setIsAudioOn(true);
    setIsVideo2Ready(false);
    setVideo2PlayNonce((prev) => prev + 1);
    saveMutedPref(false);

    if (video2StageRef.current === 'iframe') {
      shouldResetVideo2StartRef.current = false;
      setIsVideo2Ready(true);
      const v1 = video1Ref.current;
      if (v1 && !v1.paused) {
        v1.pause();
      }
      showToast('Đang phát Video 2 giới thiệu (mở âm thanh)');
      return;
    }

    const v2 = video2Ref.current;
    if (v2) {
      const targetSrc = getVideo2StreamUrl(video2StageRef.current);
      const needsReload = v2.getAttribute('src') !== targetSrc || Boolean(v2.error);
      if (needsReload) {
        v2.src = targetSrc;
      }
      v2.preload = 'auto';
      enforceVideoAttributes(v2, false, true);
      if (needsReload) {
        try {
          v2.load();
        } catch {
          // Ignore reload exception
        }
      }
      if (v2.readyState >= 1 && v2.currentTime > 0.08) {
        try {
          v2.pause();
        } catch {
          // Ignore
        }
        try {
          v2.currentTime = 0;
        } catch {
          shouldResetVideo2StartRef.current = false;
          tryStartVideo2(v2, true);
        }
      } else {
        if (v2.readyState >= 1) {
          try {
            v2.currentTime = 0;
          } catch {
            // Ignore seek error
          }
        }
        tryStartVideo2(v2, true);
      }
    }

    showToast('Đang phát Video 2 giới thiệu (mở âm thanh)');
  }, [enforceVideoAttributes, getVideo2StreamUrl, showToast, tryStartVideo2]);

  const handleCancelIntro = useCallback(() => {
    isPlayingIntroRef.current = false;
    isAudioOnRef.current = false;
    shouldResetVideo2StartRef.current = false;
    setIsPlayingIntro(false);
    setIsVideo2Ready(false);
    setIsAudioOn(false);
    saveMutedPref(true);

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

    showToast('Đã hủy video — quay về Video 1 mặc định (tắt âm thanh)');
  }, [enforceVideoAttributes, showToast, tryStartVideo1]);

  const toggleVideoMute = useCallback(() => {
    const nextAudioOn = !isAudioOnRef.current;
    isAudioOnRef.current = nextAudioOn;
    setIsAudioOn(nextAudioOn);
    saveMutedPref(!nextAudioOn);

    if (isPlayingIntroRef.current) {
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

  // Render nội dung phóng to chi tiết cho Bento Expand Modal (Yêu cầu 5)
  const renderFocusedCardContent = () => {
    switch (focusedBentoCard) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="sub-card grid grid-cols-1 md:grid-cols-2 gap-4 items-center rounded-[14px] p-5 border border-[var(--border-subcard)] text-[var(--text-primary)]">
              <div className="relative aspect-video rounded-[14px] overflow-hidden bg-black/60 border border-[var(--border-subcard)] flex items-center justify-center">
                <video
                  src={activeAboutIntroVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  onError={handleVideo2Error}
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                    preload="metadata"
                    aria-hidden="true"
                    tabIndex={-1}
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget;
                      v.defaultMuted = true;
                      v.muted = true;
                      v.loop = true;
                      v.controls = false;
                      try {
                        v.currentTime = 0;
                      } catch {
                        // Ignore seek error
                      }
                      v.disablePictureInPicture = true;
                      (v as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
                      v.removeAttribute('controls');
                    }}
                    onCanPlay={(e) => {
                      const v = e.currentTarget;
                      v.defaultMuted = true;
                      v.muted = true;
                      v.loop = true;
                      if (v.paused) v.play().catch(() => {});
                    }}
                    onPause={(e) => {
                      if (typeof document !== 'undefined' && document.hidden) return;
                      const v = e.currentTarget;
                      v.defaultMuted = true;
                      v.muted = true;
                      v.loop = true;
                      v.play().catch(() => {});
                    }}
                    onEnded={(e) => {
                      const v = e.currentTarget;
                      v.currentTime = 0;
                      v.play().catch(() => {});
                    }}
                    style={{ objectFit: 'cover', transform: 'translateZ(0) scale(1.005)', backfaceVisibility: 'hidden' }}
                    className="w-full h-full min-w-full min-h-full object-cover object-[50%_18%] rounded-[inherit] pointer-events-none select-none banner-video-sharp"
                  />
              </div>
              <div className="flex flex-col justify-between gap-3 text-left">
                <div>
                  <h4 className="card-title card-header-sync card-title-synced typo-h4 font-play text-blue-600 dark:text-cyan-400 flex items-center gap-2 mb-2" data-card-title="true">
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />
                    <span>Lãnh Đạo Vận Hành CX 22+ Năm</span>
                  </h4>
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
                    src="https://lh3.googleusercontent.com/d/1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm"
                    alt="Nguyễn Hùng Thái"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
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
                    ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)', borderColor: 'transparent' }
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
                    ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)', borderColor: 'transparent' }
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
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white shadow-md typo-caption">
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
                <span className="text-red-500 font-bold typo-h4">📍</span>
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
                className="pillar-gradient-card rounded-[14px] p-4 shadow-md flex flex-col justify-between"
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
                className="pillar-gradient-card rounded-[14px] p-4 shadow-md flex flex-col justify-between"
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
                className="pillar-gradient-card rounded-[14px] p-4 shadow-md flex flex-col justify-between"
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
              <div data-subcard="true" className="exp-detail-card rounded-[14px] p-5 flex flex-col justify-between">
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
              <div data-subcard="true" className="exp-detail-card rounded-[14px] p-5 flex flex-col justify-between">
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
        gap: '10px',
        rowGap: '10px',
        columnGap: '10px',
        borderRadius: '0px',
        background: 'transparent',
        ['--about-card-w' as any]: `${aboutCardWidth}px`,
        ['--about-side-inset' as any]: `${aboutSideInset}px`,
      }}
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-col items-center justify-center p-0 gap-[10px] font-play text-left text-[var(--text-primary)] rounded-none overflow-visible z-10 box-border"
    >
      {/* ========================================================================= */}
      {/* CARD GIỚI THIỆU CHÍNH (BENTO MULTICOLOR VIEW): NHẬP CARD 1 & 2 LÀM 1      */}
      {/* ========================================================================= */}
      <div
        id="about-intro-card-1"
        data-main-card="true"
        data-floating-surface="main"
        data-element-name="Thẻ chính Trang Giới Thiệu Chuyên Gia"
        data-element-type="card"
        data-element-page="about"
        data-element-parent="about-page-container"
        style={{
          width: '100%',
          maxWidth: 'var(--main-card-target-w, 1600px)',
          height: '100%',
          minHeight: '0px',
          maxHeight: '100%',
          padding: 'var(--main-card-padding, clamp(10px, 1.4vw, 16px))',
          gap: 'clamp(10px, 1.1vw, 14px)',
          rowGap: 'clamp(10px, 1.1vw, 14px)',
          columnGap: 'clamp(10px, 1.1vw, 14px)',
          borderRadius: 'var(--radius-global, var(--radius-primary-surface, var(--radius-main, 14px)))',
          boxSizing: 'border-box',
          margin: '0 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        className="page-main-card floating-glass-surface floating-surface--main relative w-full max-w-full shrink-0 flex flex-col justify-start p-2.5 sm:p-[15px] gap-2.5 sm:gap-3 overflow-y-auto overflow-x-hidden glass-scrollbar box-border mx-auto opacity-100"
      >
        <div
          id="about-intro-grid-1"
          onWheel={(e) => {
            const el = e.currentTarget;
            if (el) {
              el.scrollTop += e.deltaY;
            }
          }}
          style={{
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            padding: '0px',
            gap: viewportWidth < 640 ? '10px' : '12px',
            rowGap: viewportWidth < 640 ? '10px' : '12px',
            columnGap: viewportWidth < 640 ? '10px' : '12px',
            borderRadius: '14px',
          }}
          className="main-card-scroll-viewport w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 p-0 rounded-[14px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
        >
            
            {/* BENTO TILE 1: CARD VIDEO CHÂN DUNG CHUYÊN GIA (SAPPHIRE BLUE) */}
            <motion.div
              id="about-hero-video-container"
              data-framer-bento="true"
              data-element-name="Card video chân dung chuyên gia"
              data-element-type="card"
              data-media-card={activeHeroMedia === 'video' ? 'video' : undefined}
              data-video-bg-card={activeHeroMedia === 'video' ? 'true' : 'false'}
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRadius: 'var(--radius-card, 14px)',
                padding: viewportWidth < 640 ? '10px' : '14px',
              }}
              className="bento-card bento-color-blue glass-card col-span-12 lg:col-span-7 relative rounded-[var(--radius-card,14px)] overflow-hidden flex flex-col justify-between self-stretch min-h-[250px] sm:min-h-[310px] lg:min-h-0 h-full min-w-0 group/video text-left p-2.5 sm:p-[14px]"
            >
                  <div
                    id="el-p2-div-87"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      minWidth: '100%',
                      minHeight: '200px',
                      flex: '1 1 0%',
                      padding: 0,
                      margin: 0,
                      borderRadius: 'calc(max(6px, var(--radius-card, 14px) - 2px))',
                      overflow: 'hidden',
                    }}
                    className="relative w-full h-full flex-1 rounded-[calc(max(6px,var(--radius-card,14px)-2px))] overflow-hidden min-h-0 flex items-center justify-center border border-[var(--border-subcard)] shadow-inner"
                  >
                  {activeHeroMedia === 'video' ? (
                      <div
                        id="about-video-background-layer"
                        data-video-slot={isPlayingIntro ? 2 : 1}
                        data-video-id={isPlayingIntro ? ABOUT_VIDEO_2_ID : ABOUT_VIDEO_1_ID}
                        style={{ containerType: 'size' }}
                        className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] w-full h-full z-0"
                      >
                        {/* Ảnh nền chân dung tải trước giúp card luôn hiển thị mượt mà trước khi luồng video bắt đầu */}
                        <img
                          src={ABOUT_VIDEO_1_POSTER_URL}
                          alt="Hình nền chân dung chuyên gia Nguyễn Hùng Thái"
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                          referrerPolicy="no-referrer"
                          aria-hidden="true"
                          style={ABOUT_VIDEO_SHARED_STYLE}
                          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover rounded-[inherit] select-none pointer-events-none z-0"
                        />

                        {/* VIDEO 1 — Hình nền mặc định Card Giới thiệu (tự động phát khi mở, tắt âm thanh, phát vòng lặp, không control) */}
                        {video1Stage !== 'iframe' ? (
                          <video
                            ref={video1Ref}
                            id="about-bg-video-1"
                            src={getVideo1StreamUrl(video1Stage)}
                            poster={ABOUT_VIDEO_1_POSTER_URL}
                            data-video-slot={1}
                            data-video-id={ABOUT_VIDEO_1_ID}
                            data-video-layer-active={!(isPlayingIntro && isVideo2Ready) ? 'true' : 'false'}
                            autoPlay
                            loop
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
                            style={ABOUT_VIDEO_SHARED_STYLE}
                            className={cn(
                              ABOUT_VIDEO_SHARED_CLASS,
                              isPlayingIntro && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]'
                            )}
                          />
                        ) : (
                          <iframe
                            key={`about-bg-iframe-1-${ABOUT_VIDEO_1_ID}`}
                            src={ABOUT_VIDEO_1_URL}
                            title="Video nền giới thiệu 1 - Nguyễn Hùng Thái"
                            allow="autoplay; fullscreen; picture-in-picture"
                            tabIndex={-1}
                            aria-hidden="true"
                            className={cn(
                              'banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none transition-opacity duration-300',
                              isPlayingIntro && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]'
                            )}
                          />
                        )}

                        {/* VIDEO 2 — Định dạng y hệt Video 1 (autoPlay khi kích hoạt, vòng lặp, mở âm thanh mặc định, không control) */}
                        {video2Stage !== 'iframe' ? (
                          <video
                            ref={video2Ref}
                            id="about-bg-video-2"
                            data-video-slot={2}
                            data-video-id={ABOUT_VIDEO_2_ID}
                            data-video-preparing={isPlayingIntro && !isVideo2Ready ? 'true' : 'false'}
                            data-video-layer-active={isPlayingIntro && isVideo2Ready ? 'true' : 'false'}
                            loop
                            muted={!(isPlayingIntro && isAudioOn)}
                            playsInline
                            preload={isPlayingIntro ? 'metadata' : 'none'}
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
                              if (shouldResetVideo2StartRef.current && v.currentTime > 0.08) {
                                try {
                                  v.currentTime = 0;
                                  return;
                                } catch {
                                  // Ignore
                                }
                              }
                              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                            }}
                            onLoadedData={(e) => {
                              const v = e.currentTarget;
                              if (!isPlayingIntroRef.current) return;
                              enforceVideoAttributes(v, !isAudioOnRef.current, true);
                              if (shouldResetVideo2StartRef.current && v.readyState >= 1 && v.currentTime > 0.08) {
                                try {
                                  v.currentTime = 0;
                                  return;
                                } catch {
                                  // Ignore
                                }
                              }
                              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                            }}
                            onCanPlay={(e) => {
                              const v = e.currentTarget;
                              if (!isPlayingIntroRef.current) return;
                              enforceVideoAttributes(v, !isAudioOnRef.current, true);
                              if (shouldResetVideo2StartRef.current && v.readyState >= 1 && v.currentTime > 0.08) {
                                try {
                                  v.currentTime = 0;
                                  return;
                                } catch {
                                  // Ignore
                                }
                              }
                              if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                            }}
                            onSeeked={(e) => {
                              if (!isPlayingIntroRef.current) return;
                              const v = e.currentTarget;
                              if (shouldResetVideo2StartRef.current && v.currentTime <= 0.15) {
                                shouldResetVideo2StartRef.current = false;
                                enforceVideoAttributes(v, !isAudioOnRef.current, true);
                                if (v.paused) tryStartVideo2(v, isAudioOnRef.current);
                              }
                            }}
                            onPlaying={(e) => {
                              const v = e.currentTarget;
                              if (!isPlayingIntroRef.current) {
                                v.pause();
                                return;
                              }
                              if (shouldResetVideo2StartRef.current && v.readyState >= 1 && v.currentTime > 0.15) {
                                try {
                                  v.pause();
                                  v.currentTime = 0;
                                } catch {
                                  shouldResetVideo2StartRef.current = false;
                                }
                                return;
                              }
                              shouldResetVideo2StartRef.current = false;
                              enforceVideoAttributes(v, !isAudioOnRef.current, true);
                              setIsVideo2Ready(true);
                              const v1 = video1Ref.current;
                              if (v1 && !v1.paused) {
                                v1.pause();
                              }
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
                              if (shouldResetVideo2StartRef.current) return;
                              if (typeof document !== 'undefined' && document.hidden) return;
                              const v = e.currentTarget;
                              if (v.seeking) return;
                              tryStartVideo2(v, isAudioOnRef.current);
                            }}
                            onError={handleVideo2Error}
                            style={ABOUT_VIDEO_SHARED_STYLE}
                            className={cn(
                              ABOUT_VIDEO_SHARED_CLASS,
                              isPlayingIntro && isVideo2Ready ? 'opacity-100 z-[2]' : 'opacity-0 z-[0]'
                            )}
                          />
                        ) : (
                          isPlayingIntro && (
                            <iframe
                              key={`about-bg-iframe-2-${ABOUT_VIDEO_2_ID}-${video2PlayNonce}`}
                              src={ABOUT_VIDEO_2_URL}
                              title="Video giới thiệu 2 - Nguyễn Hùng Thái"
                              allow="autoplay; fullscreen; picture-in-picture"
                              tabIndex={-1}
                              aria-hidden="true"
                              className="banner-drive-iframe-cover absolute top-1/2 left-1/2 border-0 pointer-events-none select-none z-[2]"
                            />
                          )
                        )}
                      </div>
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
                            className={`px-3 py-1 rounded-full typo-badge font-semibold font-play transition-all flex items-center gap-1.5 ${
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
                            className={`px-3 py-1 rounded-full typo-badge font-semibold font-play transition-all flex items-center gap-1.5 ${
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
                          className="theme-modal-close p-2 rounded-full shadow-lg bg-slate-950/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer flex items-center gap-1 typo-badge"
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
                          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0 text-red-600 dark:text-red-400 typo-h4">
                            📍
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold typo-body-sm text-cyan-700 dark:text-cyan-300">
                                {activeHeroMapType === 'tam_tru' ? 'Tạm trú hiện tại' : 'Cư trú quê quán'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 typo-badge font-mono">
                                Đã ghim đỏ trên Map
                              </span>
                            </div>
                            <p className="typo-caption text-slate-800 dark:text-slate-100 font-medium mt-0.5 leading-snug">
                              {activeHeroMapType === 'tam_tru'
                                ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                                : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 typo-caption">
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
                      className={`theme-video-capsule video-play-btn video-play-btn--about ${isPlayingIntro ? 'is-playing' : ''} absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 z-30 max-w-[calc(100%-16px)] inline-flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-300 cursor-pointer pointer-events-auto select-none`}
                    >
                      {/* Speaker / Sound Toggle Button — mặc định tắt ở Video 1, mặc định mở ở Video 2 */}
                      <button
                        type="button"
                        id="el-p2-btn-sound-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideoMute();
                        }}
                        className={`video-play-btn__sound w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                          isAudioOn
                            ? 'text-current shadow-xs'
                            : 'is-muted text-white shadow-md'
                        }`}
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
                          className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer font-play"
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
                          className="inline-flex items-center justify-center gap-2 pr-2 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer font-play"
                          title="Bấm để hủy video và quay về Video 1"
                        >
                          <span id="el-p2-span-36" className="flex items-center justify-center">
                            <WebIcon id="el-p2-svg-17" name="cancel" className="w-4 h-4 stroke-[2.8] text-current shrink-0" style={{ height: '16px', width: '16px' }} />
                          </span>
                          <span id="el-p2-span-37" className="typo-button text-current truncate font-play text-left" style={{ textAlign: 'left' }}>
                            Hủy Video
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                  </div>
                  </motion.div>

            {/* BENTO TILE 2: CARD THÔNG TIN CHI TIẾT (FORMAT TAB BÌA FOLDER) */}
            <motion.div
              id="about-personal-info-card-right"
              data-framer-bento="true"
              data-element-name="Card thông tin chi tiết"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRadius: 'var(--radius-card, 14px)',
              }}
              className="bento-card bento-color-emerald glass-card col-span-12 lg:col-span-5 flex flex-col justify-start items-stretch gap-0 self-stretch min-h-0 h-full min-w-0 text-left rounded-[var(--radius-card,14px)] p-2.5 sm:p-[14px] overflow-hidden"
            >
                  {/* Folder Wrapper: Đảm bảo Tab bìa folder và mặt giấy folder luôn gắn liền 0px gap trên mọi kích thước */}
                  <div className="flex flex-col gap-0 flex-1 min-h-0 w-full">
                      {/* Folder Cover Tab Strip (Tab bìa folder gắn liền mặt giấy bên dưới) */}
                    <div
                      role="tablist"
                      aria-label="Thông tin chi tiết"
                      className="card-header-sync relative z-20 flex items-end justify-start gap-1.5 pl-1 pr-2 min-w-0 shrink-0"
                    >
                      <button
                        ref={personalTabRef}
                        type="button"
                        role="tab"
                        id="about-tab-personal"
                        tabIndex={detailInfoTab === 'personal' ? 0 : -1}
                        aria-selected={detailInfoTab === 'personal'}
                        aria-controls="about-detail-tabpanel"
                        data-card-title={detailInfoTab === 'personal' ? 'true' : undefined}
                        onClick={() => handleSwitchDetailTab('personal')}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'End') {
                            e.preventDefault();
                            handleSwitchDetailTab('contact');
                            contactTabRef.current?.focus();
                          } else if (e.key === 'Home') {
                            e.preventDefault();
                            handleSwitchDetailTab('personal');
                            personalTabRef.current?.focus();
                          }
                        }}
                        style={{
                          borderColor: 'var(--border-subcard)',
                          borderBottomColor: 'transparent',
                          borderTopLeftRadius: '10px',
                          borderTopRightRadius: '10px',
                          borderBottomLeftRadius: '0px',
                          borderBottomRightRadius: '0px',
                          background: 'var(--surface-tertiary-bg, var(--bg-subcard, rgba(255, 255, 255, 0.78)))',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                        className={cn(
                          'no-theme-btn typo-h4 card-title-synced font-play relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 pt-2 pb-2 !rounded-tl-[10px] !rounded-tr-[10px] !rounded-bl-none !rounded-br-none border transition-all duration-200 cursor-pointer leading-tight whitespace-nowrap text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-cyan-400',
                          detailInfoTab === 'personal'
                            ? 'z-20 -mb-[1px] pb-[9px] text-blue-600 dark:text-cyan-400 font-bold opacity-100 border-b-transparent'
                            : 'z-0 mb-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold opacity-75 hover:opacity-95'
                        )}
                      >
                        <WebIcon
                          name="user"
                          className={cn(
                            'w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] shrink-0',
                            detailInfoTab === 'personal' ? 'text-blue-600 dark:text-cyan-400' : 'text-current'
                          )}
                        />
                        <span>Cá nhân</span>
                      </button>

                      <button
                        ref={contactTabRef}
                        type="button"
                        role="tab"
                        id="about-tab-contact"
                        tabIndex={detailInfoTab === 'contact' ? 0 : -1}
                        aria-selected={detailInfoTab === 'contact'}
                        aria-controls="about-detail-tabpanel"
                        data-card-title={detailInfoTab === 'contact' ? 'true' : undefined}
                        onClick={() => handleSwitchDetailTab('contact')}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home') {
                            e.preventDefault();
                            handleSwitchDetailTab('personal');
                            personalTabRef.current?.focus();
                          } else if (e.key === 'End') {
                            e.preventDefault();
                            handleSwitchDetailTab('contact');
                            contactTabRef.current?.focus();
                          }
                        }}
                        style={{
                          borderColor: 'var(--border-subcard)',
                          borderBottomColor: 'transparent',
                          borderTopLeftRadius: '10px',
                          borderTopRightRadius: '10px',
                          borderBottomLeftRadius: '0px',
                          borderBottomRightRadius: '0px',
                          background: 'var(--surface-tertiary-bg, var(--bg-subcard, rgba(255, 255, 255, 0.78)))',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                        className={cn(
                          'no-theme-btn typo-h4 card-title-synced font-play relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 pt-2 pb-2 !rounded-tl-[10px] !rounded-tr-[10px] !rounded-bl-none !rounded-br-none border transition-all duration-200 cursor-pointer leading-tight whitespace-nowrap text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-cyan-400',
                          detailInfoTab === 'contact'
                            ? 'z-20 -mb-[1px] pb-[9px] text-emerald-600 dark:text-emerald-400 font-bold opacity-100 border-b-transparent'
                            : 'z-0 mb-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold opacity-75 hover:opacity-95'
                        )}
                      >
                        <WebIcon
                          name="phone"
                          className={cn(
                            'w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] shrink-0',
                            detailInfoTab === 'contact' ? 'text-emerald-600 dark:text-emerald-400' : 'text-current'
                          )}
                        />
                        <span>Liên hệ</span>
                      </button>
                    </div>

                    {/* Shared Folder Cover Sheet Body */}
                    <div
                      id="about-detail-tabpanel"
                      role="tabpanel"
                      aria-labelledby={detailInfoTab === 'personal' ? 'about-tab-personal' : 'about-tab-contact'}
                      tabIndex={0}
                      style={{
                        background: 'var(--surface-tertiary-bg, var(--bg-subcard, rgba(255, 255, 255, 0.78)))',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderColor: 'var(--border-subcard)',
                        borderTopColor: 'transparent',
                      }}
                      className={cn(
                        'relative z-10 flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden glass-scrollbar p-2.5 sm:p-3 border shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-cyan-400 rounded-b-[12px] rounded-tr-[10px]',
                        detailInfoTab === 'personal' ? 'rounded-tl-[4px]' : 'rounded-tl-[10px]'
                      )}
                    >
                    <AnimatePresence mode="wait" initial={false}>
                      {detailInfoTab === 'personal' ? (
                        <motion.div
                          key="personal"
                          id="about-tabpanel-personal"
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: detailTabDirection * 18 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: -detailTabDirection * 18 }
                          }
                          transition={{
                            duration: prefersReducedMotion ? 0.01 : 0.24,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="w-full flex flex-col gap-2"
                        >
                          <div
                            id="about-personal-info-grid"
                            className="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full"
                          >
                            {[
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
                                value: 'Giáp Tý · Hải Trung Kim',
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
                              {
                                id: 'role_summary',
                                label: 'Vai trò & Kinh nghiệm',
                                value: 'Head of CX & CS Operations · 22+ Năm',
                                icon: 'award',
                                iconColorCls: 'text-blue-600 dark:text-cyan-300',
                                bgCls: 'bg-blue-500/10 dark:bg-cyan-500/15 border-blue-500/25 dark:border-cyan-400/30',
                                action: () => showToast('Head of CX & CS Operations · 22+ Năm thực chiến'),
                                colSpan: 'col-span-1 sm:col-span-6',
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
                                  'about-info-subcard h-full w-full flex flex-col justify-center gap-1 p-2 sm:px-2.5 sm:py-2 rounded-[14px] border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard overflow-hidden box-border min-w-0',
                                  item.colSpan,
                                  item.bgCls
                                )}
                              >
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
                                <div className="about-info-value typo-body-sm font-semibold font-play text-[var(--text-primary)] leading-tight whitespace-nowrap truncate min-w-0 w-full">
                                  {item.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="contact"
                          id="about-tabpanel-contact"
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: detailTabDirection * 18 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: -detailTabDirection * 18 }
                          }
                          transition={{
                            duration: prefersReducedMotion ? 0.01 : 0.24,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="w-full flex flex-col gap-2.5"
                        >
                          <div
                            id="about-personal-info-grid"
                            className="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full"
                          >
                            {[
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
                                  'about-info-subcard h-full w-full flex flex-col justify-center gap-1 p-2 sm:px-2.5 sm:py-2 rounded-[14px] border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 group/subcard overflow-hidden box-border min-w-0',
                                  item.colSpan,
                                  item.bgCls
                                )}
                              >
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
                                <div className="about-info-value typo-body-sm font-semibold font-play text-[var(--text-primary)] leading-tight whitespace-nowrap truncate min-w-0 w-full">
                                  {item.value}
                                </div>
                              </div>
                            ))}
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* BENTO GRID 2: GIỚI THIỆU BẢN THÂN, 3 TRỤ CỘT, GIÁ TRỊ & TRIẾT LÝ          */}
        {/* ========================================================================= */}
        <div
          id="about-intro-grid-2"
          style={{
            padding: '0px',
            gap: viewportWidth < 640 ? '10px' : '12px',
            rowGap: viewportWidth < 640 ? '10px' : '12px',
            columnGap: viewportWidth < 640 ? '10px' : '12px',
          }}
          className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 lg:[grid-auto-flow:dense] gap-2.5 sm:gap-3 items-stretch content-start box-border"
        >
            {/* BENTO TILE 3: CARD GIỚI THIỆU BẢN THÂN (PURPLE AMETHYST) */}
            <motion.div
              id="about-career-goal-card"
              data-framer-bento="true"
              data-element-name="Card Giới Thiệu Bản Thân Chuyên Gia"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: viewportWidth < 640 ? '10px' : '14px',
              }}
              className="bento-card bento-color-purple glass-card col-span-full lg:col-span-5 xl:col-span-5 h-full self-stretch flex flex-col justify-between gap-3 text-left rounded-[14px] p-2.5 sm:p-[14px] overflow-hidden group select-none relative"
            >
              <div className="relative z-10 h-full flex-1 flex flex-col justify-between gap-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subcard)] shrink-0">
                  <div className="card-header-sync flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                    <User className="w-4.5 h-4.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <h3 className="typo-h3 card-title-synced font-play text-blue-600 dark:text-cyan-400 leading-tight" data-card-title="true">
                      {formatCardTitle('Giới thiệu bản thân')}
                    </h3>
                  </div>
                </div>

                {/* Body Text: Giữ nguyên 100% dữ liệu, căn cân đối theo chiều cao Bento */}
                <div className="flex-1 flex items-center">
                  <p className="typo-body text-[var(--text-secondary)] m-0 leading-relaxed">
                    Một chuyên gia dịch vụ khách hàng với hơn{' '}
                    <strong className="font-semibold text-[var(--text-primary)]">22 năm kinh nghiệm</strong> thực chiến.
                    Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò chuyện, mỗi khoảnh
                    khắc, dù là nhỏ nhất, đều là một cơ hội quý giá để lắng nghe, để thấu hiểu, và để tạo ra những trải
                    nghiệm vượt trên cả sự mong đợi.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* BENTO TILE 4: CARD 3 TRỤ CỘT VẬN HÀNH (AMBER GOLD) */}
            <motion.div
              id="about-operating-pillars-card"
              data-framer-bento="true"
              data-element-name="Card 3 Trụ Cột Vận Hành Chiến Lược"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: viewportWidth < 640 ? '10px' : '14px',
              }}
              className="bento-card bento-color-amber glass-card col-span-full lg:col-span-7 xl:col-span-7 h-full self-stretch flex flex-col justify-between gap-3 text-left rounded-[14px] p-2.5 sm:p-[14px] overflow-hidden group select-none relative"
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

              {/* 3 Pillars Grid - Sub-cards stretch evenly */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
                {/* Pillar 1: Hiệu Quả */}
                <div
                  data-subcard="true"
                  data-accent="blue"
                  onMouseEnter={() => setHoveredPillarOrValue('pillar-1')}
                  onMouseLeave={() => setHoveredPillarOrValue(null)}
                  className={cn(
                    'pillar-gradient-card rounded-[14px] p-3 sm:p-3.5 shadow-md flex flex-col justify-start h-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group',
                    isPillarHighlighted('pillar-1') &&
                      'ring-2 ring-cyan-300 dark:ring-cyan-400 shadow-[0_0_24px_rgba(56,189,248,0.7)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="pillar-heading flex items-center gap-1.5 text-blue-600 dark:text-sky-300">
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-bold font-play m-0 leading-tight">Hiệu quả vận hành</h5>
                    </div>
                    <span className="pillar-sub typo-badge font-semibold opacity-90 block">Tối ưu &amp; Kết quả</span>
                    <p className="pillar-body typo-caption leading-relaxed m-0 text-[var(--text-secondary)]">
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
                    'pillar-gradient-card rounded-[14px] p-3 sm:p-3.5 shadow-md flex flex-col justify-start h-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group',
                    isPillarHighlighted('pillar-2') &&
                      'ring-2 ring-pink-300 dark:ring-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.7)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="pillar-heading flex items-center gap-1.5 text-rose-600 dark:text-rose-300">
                      <Heart className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-bold font-play m-0 leading-tight">Nhân văn con người</h5>
                    </div>
                    <span className="pillar-sub typo-badge font-semibold opacity-90 block">Đồng cảm &amp; Thấu hiểu</span>
                    <p className="pillar-body typo-caption leading-relaxed m-0 text-[var(--text-secondary)]">
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
                    'pillar-gradient-card rounded-[14px] p-3 sm:p-3.5 shadow-md flex flex-col justify-start h-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group',
                    isPillarHighlighted('pillar-3') &&
                      'ring-2 ring-emerald-300 dark:ring-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.7)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="pillar-heading flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                      <Leaf className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-bold font-play m-0 leading-tight">Bền vững dài hạn</h5>
                    </div>
                    <span className="pillar-sub typo-badge font-semibold opacity-90 block">Giá trị &amp; Tin cậy</span>
                    <p className="pillar-body typo-caption leading-relaxed m-0 text-[var(--text-secondary)]">
                      Xây dựng niềm tin vững bền, bảo chứng chất lượng và đồng hành lâu dài.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BENTO TILE 5: CARD GIÁ TRỊ CỐT LÕI (ROSE CORAL) */}
            <motion.div
              id="about-core-values-card"
              data-framer-bento="true"
              data-element-name="Card Giá Trị Cốt Lõi Vàng"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: viewportWidth < 640 ? '10px' : '14px',
              }}
              className="bento-card bento-color-rose glass-card col-span-full lg:col-span-7 xl:col-span-7 h-full self-stretch flex flex-col justify-between gap-3 text-left rounded-[14px] p-2.5 sm:p-[14px] overflow-hidden group select-none relative"
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

              {/* 3 Core Values Grid - Sub-cards stretch evenly */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
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
                    'pillar-gradient-card rounded-[14px] p-3 sm:p-3.5 shadow-md flex flex-col justify-start h-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group cursor-pointer',
                    isValueHighlighted('val-1') &&
                      'ring-2 ring-amber-300 dark:ring-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.75)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="pillar-heading flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                      <Award className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-bold font-play m-0 leading-tight">Tận tâm trách nhiệm</h5>
                    </div>
                    <span className="pillar-sub typo-badge font-semibold opacity-90 block">Trách nhiệm &amp; Hết lòng</span>
                    <p className="pillar-body typo-caption leading-relaxed m-0 text-[var(--text-secondary)]">
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
                    'pillar-gradient-card rounded-[14px] p-3 sm:p-3.5 shadow-md flex flex-col justify-start h-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group cursor-pointer',
                    isValueHighlighted('val-2') &&
                      'ring-2 ring-pink-300 dark:ring-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.75)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="pillar-heading flex items-center gap-1.5 text-pink-600 dark:text-pink-300">
                      <Clock className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-bold font-play m-0 leading-tight">Kịp thời nhanh nhạy</h5>
                    </div>
                    <span className="pillar-sub typo-badge font-semibold opacity-90 block">Tốc độ &amp; Đúng lúc</span>
                    <p className="pillar-body typo-caption leading-relaxed m-0 text-[var(--text-secondary)]">
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
                    'pillar-gradient-card rounded-[14px] p-3 sm:p-3.5 shadow-md flex flex-col justify-start h-auto relative overflow-hidden transition-all duration-300 hover:shadow-xl text-left group cursor-pointer',
                    isValueHighlighted('val-3') &&
                      'ring-2 ring-purple-300 dark:ring-purple-400 shadow-[0_0_24px_rgba(192,132,252,0.75)] scale-[1.02] -translate-y-1'
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="pillar-heading flex items-center gap-1.5 text-purple-600 dark:text-purple-300">
                      <HeartHandshake className="w-4 h-4 shrink-0" />
                      <h5 className="pillar-heading typo-h5 font-bold font-play m-0 leading-tight">Đồng cảm chân thành</h5>
                    </div>
                    <span className="pillar-sub typo-badge font-semibold opacity-90 block">Lắng nghe &amp; Thấu cảm</span>
                    <p className="pillar-body typo-caption leading-relaxed m-0 text-[var(--text-secondary)]">
                      Đặt trọn trái tim để lắng nghe, thấu hiểu cảm xúc và kết nối sâu sắc với từng khách hàng.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BENTO TILE 6: CARD TRIẾT LÝ TẦM NHÌN & CÂU NÓI HAY (CYAN TEAL) */}
            <motion.div
              id="about-philosophy-card"
              data-framer-bento="true"
              data-element-name="Card Triết Lý Tầm Nhìn CX 2026+"
              data-element-type="card"
              data-element-page="about"
              data-element-parent="about-intro-card-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: viewportWidth < 640 ? '10px' : '14px',
              }}
              className="bento-card bento-color-cyan glass-card col-span-full lg:col-span-5 xl:col-span-5 h-full self-stretch flex flex-col justify-between gap-3 text-left rounded-[14px] p-2.5 sm:p-[14px] overflow-hidden group select-none relative"
            >
              <div className="relative z-10 h-full flex-1 flex flex-col justify-between gap-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subcard)] shrink-0">
                  <div className="card-header-sync flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                    <Target className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <h3 className="typo-h3 card-title-synced font-play text-cyan-600 dark:text-cyan-400 leading-tight" data-card-title="true">
                      {formatCardTitle('Triết lý tầm nhìn')}
                    </h3>
                  </div>
                </div>

                {/* Bố cục Câu Nói Hay (Editorial Signature Quote) căn giữa tối ưu khoảng trắng */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-3 py-1 gap-2">
                  <WebIcon
                    name="quote"
                    className="w-6 h-6 text-cyan-500/80 dark:text-cyan-400/80 shrink-0"
                  />
                  <blockquote className="typo-h5 font-play font-bold italic text-cyan-700 dark:text-cyan-300 leading-snug text-balance m-0">
                    “Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn được lắng nghe.”
                  </blockquote>
                </div>
              </div>
            </motion.div>
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
