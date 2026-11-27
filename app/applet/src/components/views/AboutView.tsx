'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { Modal } from '@/components/ui/Modal';
import { WebIcon } from '@/components/ui/WebIcon';
import { speakSiteText, stopActiveSpeech } from '@/utils/speechVoice';

import {
  Sparkles,
  Play,
  MapPin,
  Home,
  Mail,
  Phone,
  Globe,
  Volume2,
  VolumeX,
  X,
  Target,
  User,
  BarChart3,
  Heart,
  Leaf,
  Star,
  Award,
  Clock,
  HeartHandshake,
  Navigation,
  Bot,
  Calendar,
  Building2,
  ExternalLink,
  Quote,
  UserCheck,
  Sun,
  Moon,
  Video,
  CheckCircle,
  Info,
  Maximize2,
  Volume1,
  Copy,
} from 'lucide-react';

const ABOUT_VIDEO_1_STREAM_URL =
  'https://cdn.scena.ai/project/8606/e48a67884f3a52e8a68cf06b97979f3b22835ec92bf466a058c0d78da97c83b0.mp4';
const ABOUT_VIDEO_1_POSTER_URL =
  'https://lh3.googleusercontent.com/d/1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm';

const LOCAL_ABOUT_STATS = [
  {
    id: 'experience',
    icon: Calendar,
    labelVi: 'Kinh nghiệm CX & CS',
    metric: '22+',
    unitVi: 'Năm',
    color: '#38bdf8',
    desc: 'Hơn hai thập kỷ trực tiếp điều hành, thiết lập quy chuẩn và nâng cấp dịch vụ.',
  },
  {
    id: 'scale',
    icon: Building2,
    labelVi: 'Quy mô lớn',
    metric: '8+',
    unitVi: 'Môi trường',
    color: '#c084fc',
    desc: 'Từng quản lý và xây dựng hệ thống tại hơn 8 tập đoàn, doanh nghiệp quy mô lớn.',
  },
  {
    id: 'automation',
    icon: Bot,
    labelVi: 'Tự động hoá',
    metric: '24/7',
    unitVi: 'AI CRM',
    color: '#34d399',
    desc: 'Tích hợp công nghệ AI, CRM & quy trình tự động hoá chăm sóc khách hàng 24/7.',
  },
  {
    id: 'csat',
    icon: Heart,
    labelVi: 'Tỷ lệ hài lòng KH',
    metric: '99%',
    unitVi: 'CSAT',
    color: '#fb7185',
    desc: 'Chỉ số hài lòng khách hàng (CSAT) liên tục duy trì ở mức cao kỷ lục.',
  },
];

export interface AboutViewProps {
  currentTheme?: SiteTheme;
  onShowNotification?: (msg: string) => void;
  onOpenMapModal?: (loc: { type: string; title: string; address: string; query: string }) => void;
  onOpenBentoFocusModal?: (cardKey: string) => void;
}

const BentoCard = ({ className = '', onClick, children, id }: { className?: string; onClick?: (e: React.MouseEvent) => void; children: React.ReactNode; id?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -16px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('input, textarea, select, iframe')) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const ripple = document.createElement('span');
    ripple.className = 'card-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 680);
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      className={`bento-card bento-border card-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const AboutView: React.FC<AboutViewProps> = ({
  onShowNotification,
  onOpenMapModal,
}) => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);
  const [activeHeroMedia, setActiveHeroMedia] = useState<'video' | 'map'>('video');
  const [activeHeroMapType, setActiveHeroMapType] = useState<'tam_tru' | 'cu_tru'>('tam_tru');

  const video1Ref = useRef<HTMLVideoElement>(null);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const [detailInfoTab, setDetailInfoTab] = useState<'personal' | 'contact'>('personal');
  const [hoveredPillarOrValue, setHoveredPillarOrValue] = useState<string | null>(null);
  const [focusedBentoCard, setFocusedBentoCard] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type = 'info') => {
    if (onShowNotification) {
      onShowNotification(message);
    }
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, [onShowNotification]);

  const copySnippet = useCallback(
    (text: string, label = '') => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      showToast(label ? `✓ Đã sao chép ${label}: ${text}` : `✓ Đã sao chép: ${text}`, 'success');
    },
    [showToast]
  );

  const toggleVideoMute = useCallback(() => {
    const nextAudio = !isAudioOn;
    setIsAudioOn(nextAudio);

    const v1 = video1Ref.current;
    if (v1) {
      v1.muted = !nextAudio;
      if (v1.paused) v1.play().catch(() => {});
    }
    showToast(nextAudio ? 'Đã bật âm thanh video' : 'Đã tắt âm thanh video', 'info');
  }, [isAudioOn, showToast]);

  const handleSpeakSection = useCallback(
    (id: string, title: string, text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        showToast(`${title}: ${text}`, 'info');
        return;
      }

      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        showToast(`Đã dừng thuyết trình: ${title}`, 'info');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${title}. ${text}`);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.02;
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
      showToast(`Đang thuyết trình: ${title}...`, 'success');
    },
    [speakingId, showToast]
  );

  const isPillarHighlighted = useCallback(
    (pillarId: string) => {
      if (hoveredPillarOrValue === pillarId) return true;
      if (pillarId === 'pillar-1' && hoveredPillarOrValue === 'val-2') return true;
      if (pillarId === 'pillar-2' && hoveredPillarOrValue === 'val-3') return true;
      if (pillarId === 'pillar-3' && hoveredPillarOrValue === 'val-1') return true;
      return false;
    },
    [hoveredPillarOrValue]
  );

  const isValueHighlighted = useCallback(
    (valId: string) => {
      if (hoveredPillarOrValue === valId) return true;
      if (valId === 'val-1' && hoveredPillarOrValue === 'pillar-3') return true;
      if (valId === 'val-2' && hoveredPillarOrValue === 'pillar-1') return true;
      if (valId === 'val-3' && hoveredPillarOrValue === 'pillar-2') return true;
      return false;
    },
    [hoveredPillarOrValue]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedBentoCard) setFocusedBentoCard(null);
      } else if (e.key.toLowerCase() === 'm' && !focusedBentoCard) {
        setActiveHeroMedia((prev) => (prev === 'video' ? 'map' : 'video'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedBentoCard]);

  const personalItems = useMemo(
    () => [
      {
        id: 'birthday',
        label: 'Sinh nhật',
        value: '22/06/1984',
        icon: Calendar,
        iconCls: 'text-amber-300',
        chipCls: 'bg-amber-500/15 border-amber-400/30 hover:bg-amber-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => showToast('Sinh nhật: 22/06/1984', 'info'),
      },
      {
        id: 'horoscope',
        label: 'Tử vi',
        value: 'Giáp Tý · Hải Trung Kim',
        icon: Sparkles,
        iconCls: 'text-purple-300',
        chipCls: 'bg-purple-500/15 border-purple-400/30 hover:bg-purple-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => showToast('Tử vi: Giáp Tý - Mệnh Hải Trung Kim', 'info'),
      },
      {
        id: 'gender',
        label: 'Giới tính',
        value: 'Nam giới',
        icon: User,
        iconCls: 'text-sky-300',
        chipCls: 'bg-sky-500/15 border-sky-400/30 hover:bg-sky-500/25',
        colSpan: 'col-span-1 sm:col-span-2',
        action: () => showToast('Giới tính: Nam giới', 'info'),
      },
      {
        id: 'ethnicity',
        label: 'Dân tộc',
        value: 'Kinh',
        icon: Globe,
        iconCls: 'text-emerald-300',
        chipCls: 'bg-emerald-500/15 border-emerald-400/30 hover:bg-emerald-500/25',
        colSpan: 'col-span-1 sm:col-span-2',
        action: () => showToast('Dân tộc: Kinh', 'info'),
      },
      {
        id: 'marital',
        label: 'Hôn nhân',
        value: 'Độc thân',
        icon: Heart,
        iconCls: 'text-rose-300',
        chipCls: 'bg-rose-500/15 border-rose-400/30 hover:bg-rose-500/25',
        colSpan: 'col-span-1 sm:col-span-2',
        action: () => showToast('Hôn nhân: Độc thân', 'info'),
      },
    ],
    [showToast]
  );

  const contactItems = useMemo(
    () => [
      {
        id: 'phone',
        label: 'Điện thoại',
        value: '+84 0909097882',
        icon: Phone,
        iconCls: 'text-orange-300',
        chipCls: 'bg-orange-500/15 border-orange-400/30 hover:bg-orange-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => {
          window.open('https://zalo.me/0909097882', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'email',
        label: 'Hộp thư',
        value: 'hungthai84@gmail.com',
        icon: Mail,
        iconCls: 'text-pink-300',
        chipCls: 'bg-pink-500/15 border-pink-400/30 hover:bg-pink-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => copySnippet('hungthai84@gmail.com', 'Email'),
      },
      {
        id: 'website',
        label: 'Website',
        value: 'Vào website',
        icon: Globe,
        iconCls: 'text-sky-300',
        chipCls: 'bg-sky-500/15 border-sky-400/30 hover:bg-sky-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => {
          window.open('https://nguyenhungthai.powerservice.one/', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: 'Vào linkedin',
        icon: UserCheck,
        iconCls: 'text-indigo-300',
        chipCls: 'bg-indigo-500/15 border-indigo-400/30 hover:bg-indigo-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => {
          window.open('https://www.linkedin.com/in/hungthai84/', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'tam_tru',
        label: 'Tạm trú',
        value: 'P.Tân Phú (Q7) , TP. Hồ Chí Minh',
        icon: MapPin,
        iconCls: 'text-cyan-300',
        chipCls: `bg-cyan-500/15 border-cyan-400/30 hover:bg-cyan-500/25 ${
          activeHeroMedia === 'map' && activeHeroMapType === 'tam_tru' ? 'ring-2 ring-cyan-300' : ''
        }`,
        colSpan: 'col-span-1 sm:col-span-6',
        action: () => {
          setActiveHeroMedia('map');
          setActiveHeroMapType('tam_tru');
          onOpenMapModal?.({
            type: 'tam_tru',
            title: 'Tạm trú',
            address: 'P.Tân Phú (Q7), TP. Hồ Chí Minh',
            query: 'Chung Cư Tân Mỹ , P.Tân Phú (Q7) , TP. Hồ Chí Minh',
          });
          showToast('📍 Tạm trú: P.Tân Phú (Q7) , TP. Hồ Chí Minh', 'info');
        },
      },
      {
        id: 'cu_tru',
        label: 'Cư trú',
        value: 'Phường Mỹ Tho, Tỉnh Đồng Tháp',
        icon: Home,
        iconCls: 'text-teal-300',
        chipCls: `bg-teal-500/15 border-teal-400/30 hover:bg-teal-500/25 ${
          activeHeroMedia === 'map' && activeHeroMapType === 'cu_tru' ? 'ring-2 ring-teal-300' : ''
        }`,
        colSpan: 'col-span-1 sm:col-span-6',
        action: () => {
          setActiveHeroMedia('map');
          setActiveHeroMapType('cu_tru');
          onOpenMapModal?.({
            type: 'cu_tru',
            title: 'Cư trú',
            address: 'Phường Mỹ Tho, Tỉnh Đồng Tháp',
            query: '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp',
          });
          showToast('📍 Cư trú: Phường Mỹ Tho, Tỉnh Đồng Tháp', 'info');
        },
      },
    ],
    [activeHeroMapType, activeHeroMedia, copySnippet, onOpenMapModal, showToast]
  );

  return (
    <div
      id="about-page-container"
      data-element-name="Trang Giới Thiệu Chuyên Gia"
      data-element-type="container"
      data-element-page="about"
      data-element-parent="global-content-viewport"
      className="main-card page-main-card floating-surface--main bento-app-root text-white antialiased selection:bg-purple-500 selection:text-white w-full max-w-full h-full min-h-full flex flex-col justify-start p-3 sm:p-5 gap-4 overflow-y-auto overflow-x-hidden glass-scrollbar font-play text-left select-none box-border opacity-100"
      style={{
        width: '100%',
        maxWidth: 'var(--main-card-target-w, 1200px)',
        margin: '0 auto',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');

        .bento-app-root {
          font-family: 'Play', sans-serif;
          background-color: transparent;
        }

        .bento-card {
          border-radius: 14px;
          padding: 16px;
          --mx: 50%;
          --my: 50%;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease,
            background-color 0.3s ease,
            color 0.3s ease,
            opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .bento-card:active {
          transform: translateY(-2px) scale(0.994);
        }

        .bento-card.card-reveal {
          opacity: 0;
          transform: translateY(20px) scale(0.975);
        }

        .bento-card.card-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .bento-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(
            380px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.16),
            rgba(168, 85, 247, 0.08) 40%,
            transparent 72%
          );
        }

        .bento-card:hover {
          transform: perspective(900px) translateY(-6px) scale(1.01);
          box-shadow:
            0 28px 48px -12px rgba(0, 0, 0, 0.6),
            0 12px 22px -8px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.22),
            0 0 28px -6px rgba(139, 92, 246, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.26);
        }

        .bento-card:hover::before {
          opacity: 1;
        }

        .card-ripple {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 25;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.34) 0%, rgba(168, 85, 247, 0.16) 55%, transparent 75%);
          transform: translate(-50%, -50%) scale(0);
          animation: cardRippleAnim 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cardRippleAnim {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        .bento-border {
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .bento-border:hover {
          border-color: rgba(255, 255, 255, 0.28);
        }

        .bento-unified-title {
          font-family: 'Play', sans-serif;
          font-size: 16px !important;
          line-height: 1.3 !important;
          font-weight: 700 !important;
          letter-spacing: 0em !important;
        }
      `}</style>

      {/* Main Bento Grid (Đã xóa header #el-p2-header-1 và các nút hiệu ứng / sáng / xem video theo yêu cầu) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 min-h-0">
        {/* Thẻ 1: Video / Bản đồ */}
        <BentoCard
          id="about-hero-video-container"
          className="lg:col-span-7 bg-gray-800/90 backdrop-blur-md flex flex-col justify-between min-h-[300px] sm:min-h-[360px]"
        >
          <div className="relative w-full h-full flex-1 rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center border border-white/15 bg-gray-950 shadow-inner">
            {activeHeroMedia === 'video' ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={ABOUT_VIDEO_1_POSTER_URL}
                  alt="Nguyễn Hùng Thái"
                  className="absolute inset-0 w-full h-full object-cover object-[50%_22%] select-none pointer-events-none z-0"
                />

                <video
                  ref={video1Ref}
                  src={ABOUT_VIDEO_1_STREAM_URL}
                  poster={ABOUT_VIDEO_1_POSTER_URL}
                  autoPlay
                  loop
                  muted={!isAudioOn}
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  onLoadedMetadata={(e) => {
                    if ((e.currentTarget as HTMLVideoElement).paused) {
                      (e.currentTarget as HTMLVideoElement).play().catch(() => {});
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-[50%_22%] select-none pointer-events-none z-[1]"
                />

                <button
                  type="button"
                  onClick={() => setFocusedBentoCard('hero')}
                  className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-lg"
                  title="Phóng to chi tiết"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-950/80 hover:bg-gray-950/95 backdrop-blur-md border border-white/25 text-white shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={toggleVideoMute}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isAudioOn ? 'bg-emerald-500/25 text-emerald-300' : 'bg-rose-500/85 text-white'
                    }`}
                  >
                    {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-xs font-bold px-1">
                    {isAudioOn ? 'Âm thanh bật' : 'Tắt tiếng'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full z-10 flex flex-col justify-between">
                <iframe
                  title="Bản đồ vị trí"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    activeHeroMapType === 'tam_tru'
                      ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                      : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                  )}&t=&z=16&ie=UTF8&iwloc=B&output=embed`}
                  className="absolute inset-0 w-full h-full border-0 z-0"
                  loading="lazy"
                  allowFullScreen
                />

                <div className="relative z-20 p-3 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-gray-950/85 backdrop-blur-md border border-white/20 shadow-lg">
                    <button
                      type="button"
                      onClick={() => setActiveHeroMapType('tam_tru')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeHeroMapType === 'tam_tru'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Tạm trú</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroMapType('cu_tru')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeHeroMapType === 'cu_tru'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Cư trú</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveHeroMedia('video')}
                    className="px-3 py-1.5 rounded-full shadow-lg bg-gray-950/85 hover:bg-gray-900 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Đóng bản đồ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </BentoCard>

        {/* Thẻ 2: Thông tin chi tiết (Tabs) */}
        <BentoCard
          id="about-personal-info-card-right"
          className="lg:col-span-5 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex flex-col justify-between gap-0"
        >
          <div className="flex items-end justify-between gap-2 relative z-20">
            <div role="tablist" className="flex items-end gap-1.5">
              <button
                type="button"
                role="tab"
                aria-selected={detailInfoTab === 'personal'}
                onClick={() => setDetailInfoTab('personal')}
                className={`relative inline-flex items-start gap-1.5 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  detailInfoTab === 'personal'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-900/60 text-gray-400 hover:text-white'
                }`}
              >
                <span>Hồ sơ cá nhân</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={detailInfoTab === 'contact'}
                onClick={() => setDetailInfoTab('contact')}
                className={`relative inline-flex items-start gap-1.5 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  detailInfoTab === 'contact'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-900/60 text-gray-400 hover:text-white'
                }`}
              >
                <span>Kết nối & Địa chỉ</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setActiveHeroMedia((prev) => (prev === 'video' ? 'map' : 'video'));
              }}
              className="mb-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{activeHeroMedia === 'video' ? 'Bản đồ' : 'Video'}</span>
            </button>
          </div>

          <div className="relative z-10 bg-gray-900/80 backdrop-blur-md rounded-b-2xl rounded-tr-2xl p-4 border border-white/10 flex-1 flex flex-col justify-between">
            {detailInfoTab === 'personal' ? (
              <div className="grid grid-cols-6 gap-2.5">
                {personalItems.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        SoundEngine.playTap();
                        item.action();
                      }}
                      className={`${item.colSpan} p-2.5 rounded-xl border border-white/10 ${item.chipCls} transition-all cursor-pointer flex flex-col justify-between gap-1`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-400">{item.label}</span>
                        <IconComp className={`w-3.5 h-3.5 ${item.iconCls}`} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2.5">
                {contactItems.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        SoundEngine.playTap();
                        item.action();
                      }}
                      className={`${item.colSpan} p-2.5 rounded-xl border border-white/10 ${item.chipCls} transition-all cursor-pointer flex flex-col justify-between gap-1`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-400">{item.label}</span>
                        <IconComp className={`w-3.5 h-3.5 ${item.iconCls}`} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </BentoCard>

        {/* Thẻ 3: 4 Chỉ số cốt lõi (Stats) */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LOCAL_ABOUT_STATS.map((st) => {
            const IconComp = st.icon;
            return (
              <BentoCard
                key={st.id}
                className="bg-gray-800/85 backdrop-blur-md flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {st.labelVi}
                  </span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: `${st.color}25`, color: st.color }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {st.metric}
                  </span>
                  <span className="text-xs font-bold text-purple-300">{st.unitVi}</span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {st.desc}
                </p>
              </BentoCard>
            );
          })}
        </div>

        {/* Thẻ 4: Tầm nhìn & Sứ mệnh */}
        <BentoCard className="lg:col-span-6 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-gray-900 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-300 bg-cyan-950/70 border border-cyan-700/50 px-3 py-1 rounded-full">
              Tầm nhìn lãnh đạo CX
            </span>
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Chuẩn mực Trải nghiệm Khách hàng & Vận hành Đa kênh Toàn diện
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Kiến tạo hệ sinh thái dịch vụ chăm sóc khách hàng xuất sắc (COPC/CX), kết hợp nhân sự tận tâm cùng trí tuệ nhân tạo (AI CRM) để tối ưu hóa mọi điểm chạm và thúc đẩy sự trung thành của khách hàng dài lâu.
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>Chiến lược 22+ năm thực chiến</span>
            <button
              type="button"
              onClick={() => handleSpeakSection('vision', 'Tầm nhìn lãnh đạo', 'Kiến tạo hệ sinh thái dịch vụ chăm sóc khách hàng xuất sắc, kết hợp nhân sự tận tâm cùng trí tuệ nhân tạo để tối ưu hóa mọi điểm chạm.')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{speakingId === 'vision' ? 'Dừng đọc' : 'Nghe đọc'}</span>
            </button>
          </div>
        </BentoCard>

        {/* Thẻ 5: Triết lý hoạt động */}
        <BentoCard className="lg:col-span-6 bg-gradient-to-br from-purple-950/80 via-slate-900 to-gray-900 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-purple-300 bg-purple-950/70 border border-purple-700/50 px-3 py-1 rounded-full">
              Triết lý cốt lõi
            </span>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">
            &quot;Khách hàng là trung tâm · Dữ liệu là la bàn · Con người là linh hồn&quot;
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Mỗi tương tác thành công đều bắt nguồn từ sự thấu cảm sâu sắc, quy trình chuẩn hóa không ngừng và tinh thần đồng hành tận tâm vì giá trị bền vững của doanh nghiệp.
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>Giá trị & Cam kết chất lượng</span>
            <button
              type="button"
              onClick={() => handleSpeakSection('philosophy', 'Triết lý cốt lõi', 'Mỗi tương tác thành công đều bắt nguồn từ sự thấu cảm sâu sắc, quy trình chuẩn hóa không ngừng và tinh thần đồng hành tận tâm.')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{speakingId === 'philosophy' ? 'Dừng đọc' : 'Nghe đọc'}</span>
            </button>
          </div>
        </BentoCard>
      </div>

      {/* Modal Phóng to chi tiết Bento Card */}
      {focusedBentoCard && (
        <Modal
          isOpen={Boolean(focusedBentoCard)}
          onClose={() => setFocusedBentoCard(null)}
          title="Chi tiết Chuyên gia Nguyễn Hùng Thái"
          icon={<Sparkles className="w-5 h-5 text-purple-400" />}
          maxWidth="3xl"
        >
          <div className="p-6 flex flex-col gap-4 text-left font-play">
            <div className="flex items-center gap-4">
              <img
                src={ABOUT_VIDEO_1_POSTER_URL}
                alt="Nguyễn Hùng Thái"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-3 py-0.5 rounded-full">
                  Chuyên Gia CX • 22+ Năm
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Nguyễn Hùng Thái</h3>
                <p className="text-xs text-gray-400">Chuyên gia Điều hành & Thiết lập Quy chuẩn CSKH • COPC / CX</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Với hơn 22 năm kinh nghiệm thực chiến điều hành hệ thống Chăm sóc Khách hàng (Contact Center, Trung tâm CSKH đa kênh, AI CRM), ông Nguyễn Hùng Thái đã dẫn dắt và thiết lập chuẩn mực dịch vụ tại các tập đoàn lớn, mang lại sự hài lòng tối đa cho khách hàng và hiệu quả vận hành vượt trội.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setFocusedBentoCard(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
