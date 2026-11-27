'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  CheckCircle,
  Info,
  Maximize2,
  Volume1,
  Copy,
} from 'lucide-react';

// ============================================================================
// 1. DỮ LIỆU GỐC (GIỮ NGUYÊN 100% DATA CỦA CHUYÊN GIA NGUYỄN HÙNG THÁI)
// ============================================================================

const ABOUT_VIDEO_1_STREAM_URL =
  'https://cdn.scena.ai/project/8606/e48a67884f3a52e8a68cf06b97979f3b22835ec92bf466a058c0d78da97c83b0.mp4';
const ABOUT_VIDEO_1_POSTER_URL =
  'https://lh3.googleusercontent.com/d/1QsrsSttLLg_AtUxWiWc4WOe0EWLZ-kPm';
const ABOUT_VIDEO_2_STREAM_URL =
  'https://cdn.scena.ai/project/9626/42eba857297b415c8be72327102671129b5ebbdbaab55ac9eb6897411b4bdeda.mp4';

const ABOUT_PROFILE_STATS = [
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

// ============================================================================
// 2. COMPONENT BENTO CARD TĨNH
// ============================================================================

interface BentoCardProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

const BentoCard: React.FC<BentoCardProps> = ({ className = '', onClick, children, id, style }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      style={style}
      className={`bento-card bento-border ${className}`}
    >
      {children}
    </div>
  );
};

export interface AboutViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
  onOpenMapModal?: (loc: any) => void;
  onOpenBentoFocusModal?: (key: string) => void;
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success';
}

// ============================================================================
// 3. ỨNG DỤNG CHÍNH: HỒ SƠ CHUYÊN GIA NGUYỄN HÙNG THÁI (ABOUT VIEW)
// ============================================================================

export function AboutView({ onShowNotification }: AboutViewProps = {}) {
  // Hệ thống thông báo Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Media Card 1: 'video' | 'map'
  const [activeHeroMedia, setActiveHeroMedia] = useState<'video' | 'map'>('video');
  const [activeHeroMapType, setActiveHeroMapType] = useState<'tam_tru' | 'cu_tru'>('tam_tru');

  // Dual-Layer Video State & Refs
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [isVideo2Ready, setIsVideo2Ready] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  // Box Tabs trong Card Thông tin chi tiết ('personal' | 'contact')
  const [detailInfoTab, setDetailInfoTab] = useState<'personal' | 'contact'>('personal');

  // Cross-Highlight Connection giữa 3 Trụ Cột & 3 Giá Trị Cốt Lõi
  const [hoveredPillarOrValue, setHoveredPillarOrValue] = useState<string | null>(null);

  // Modal phóng to chi tiết từng Bento Card
  const [focusedBentoCard, setFocusedBentoCard] = useState<'hero' | 'stats' | null>(null);

  // State đọc thuyết minh TTS
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const showToast = useCallback(
    (message: string, type: 'info' | 'success' = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (onShowNotification) {
        onShowNotification(message);
      }
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    [onShowNotification]
  );

  const copySnippet = useCallback(
    (text: string, label: string = '') => {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      showToast(label ? `✓ Đã sao chép ${label}: ${text}` : `✓ Đã sao chép: ${text}`, 'success');
    },
    [showToast]
  );

  // Điều khiển Video 1 (nền mặc định) & Video 2 (giới thiệu có tiếng)
  const handlePlayIntro = useCallback(() => {
    setIsPlayingIntro(true);
    setIsAudioOn(true);
    setIsVideo2Ready(false);

    const v2 = video2Ref.current;
    if (v2) {
      v2.muted = false;
      v2.volume = 1;
      v2.currentTime = 0;
      const p = v2.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          v2.muted = true;
          setIsAudioOn(false);
          v2.play().catch(() => {});
          showToast('Trình duyệt tạm chặn âm thanh tự động — bấm biểu tượng loa để bật tiếng.');
        });
      }
    }
    showToast('Đang phát Video 2 giới thiệu (mở âm thanh)', 'success');
  }, [showToast]);

  const handleCancelIntro = useCallback(() => {
    setIsPlayingIntro(false);
    setIsVideo2Ready(false);
    setIsAudioOn(false);

    const v2 = video2Ref.current;
    if (v2) {
      v2.pause();
      v2.muted = true;
      v2.currentTime = 0;
    }

    const v1 = video1Ref.current;
    if (v1) {
      v1.muted = true;
      v1.play().catch(() => {});
    }
    showToast('Đã hủy video — quay về Video 1 mặc định (tắt âm thanh)', 'info');
  }, [showToast]);

  const toggleVideoMute = useCallback(() => {
    const nextAudio = !isAudioOn;
    setIsAudioOn(nextAudio);

    if (isPlayingIntro) {
      const v2 = video2Ref.current;
      if (v2) {
        v2.muted = !nextAudio;
        if (v2.paused) v2.play().catch(() => {});
      }
    } else {
      const v1 = video1Ref.current;
      if (v1) {
        v1.muted = !nextAudio;
        if (v1.paused) v1.play().catch(() => {});
      }
    }
    showToast(nextAudio ? 'Đã bật âm thanh video' : 'Đã tắt âm thanh video', 'info');
  }, [isAudioOn, isPlayingIntro, showToast]);

  // Thuyết minh giọng đọc Web Speech API
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

  // Tương quan sáng viền giữa 3 Trụ Cột & 3 Giá Trị Cốt Lõi
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
        else if (isPlayingIntro) handleCancelIntro();
      } else if (e.key.toLowerCase() === 'm' && !focusedBentoCard) {
        setActiveHeroMedia((prev) => (prev === 'video' ? 'map' : 'video'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedBentoCard, isPlayingIntro, handleCancelIntro]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Danh sách thông tin Cá nhân (Giữ nguyên 100% dữ liệu)
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

  // Danh sách thông tin Liên hệ (Giữ nguyên 100% dữ liệu)
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
          if (typeof window !== 'undefined') {
            window.open('https://zalo.me/0909097882', '_blank', 'noopener,noreferrer');
          }
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
          if (typeof window !== 'undefined') {
            window.open('https://nguyenhungthai.powerservice.one/', '_blank', 'noopener,noreferrer');
          }
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
          if (typeof window !== 'undefined') {
            window.open('https://www.linkedin.com/in/hungthai84/', '_blank', 'noopener,noreferrer');
          }
        },
      },
      {
        id: 'tam_tru',
        label: 'Tạm trú',
        value: 'P.Tân Phú (Q7) , TP. Hồ Chí Minh',
        icon: MapPin,
        iconCls: 'text-cyan-300',
        chipCls: `bg-cyan-500/15 border-cyan-400/30 hover:bg-cyan-500/25 ${
          activeHeroMedia === 'map' && activeHeroMapType === 'tam_tru'
            ? 'ring-2 ring-cyan-300'
            : ''
        }`,
        colSpan: 'col-span-1 sm:col-span-6',
        action: () => {
          setActiveHeroMedia('map');
          setActiveHeroMapType('tam_tru');
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
          activeHeroMedia === 'map' && activeHeroMapType === 'cu_tru'
            ? 'ring-2 ring-teal-300'
            : ''
        }`,
        colSpan: 'col-span-1 sm:col-span-6',
        action: () => {
          setActiveHeroMedia('map');
          setActiveHeroMapType('cu_tru');
          showToast('📍 Cư trú: Phường Mỹ Tho, Tỉnh Đồng Tháp', 'info');
        },
      },
    ],
    [activeHeroMapType, activeHeroMedia, copySnippet, showToast]
  );

  const toastOverlay = (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 bg-gray-900/95 backdrop-blur-md border px-4 py-3 rounded-xl shadow-2xl max-w-sm ${
            t.type === 'success'
              ? 'border-emerald-500/50 text-emerald-300'
              : 'border-purple-500/50 text-purple-300'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <Info className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-bold text-gray-100">{t.message}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      id="about-page-container"
      data-element-name="Trang giới thiệu"
      data-element-type="container"
      data-element-page="about"
      data-element-parent="global-content-viewport"
      data-no-wheel-horizontal="true"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-visible no-scrollbar font-play text-left rounded-[var(--radius-global,var(--radius-main,14px))] text-[var(--text-primary)] box-border"
    >
      {/* Toàn bộ hệ thống CSS tĩnh cho trang Giới thiệu */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');

        #about-main-card {
          padding: var(--main-card-padding, 20px) !important;
          gap: 0px !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          align-items: stretch !important;
          overflow: hidden !important;
          height: 100% !important;
          max-height: 100% !important;
          min-height: 0 !important;
        }

        #about-main-scroll-viewport {
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          flex: 1 1 0% !important;
          min-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          align-items: stretch !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          overscroll-behavior-y: contain !important;
          -webkit-overflow-scrolling: touch !important;
          scroll-behavior: smooth !important;
        }

        #about-main-content {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          flex: 0 0 auto !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }

        .bento-app-root {
          font-family: 'Play', sans-serif;
          background: transparent;
        }

        .bento-card {
          border-radius: 14px;
          padding: 16px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .bento-border {
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* Chuẩn hóa đồng nhất 100% kích thước, độ đậm và giãn cách chữ cho tiêu đề Card & Sub-card */
        .bento-unified-title {
          font-family: 'Play', sans-serif;
          font-size: 16px !important;
          line-height: 1.3 !important;
          font-weight: 700 !important;
          letter-spacing: 0em !important;
        }

        /* Box Tab liền mạch cho Card Thông tin chi tiết (Cá nhân & Liên hệ) */
        #about-personal-info-card-right {
          gap: 0px !important;
          row-gap: 0px !important;
        }

        #about-box-tabs-shell {
          display: flex !important;
          flex-direction: column !important;
          gap: 0px !important;
          row-gap: 0px !important;
        }

        #about-box-tabs-shell [role="tablist"] {
          display: flex !important;
          align-items: flex-end !important;
          gap: 6px !important;
          margin: 0 !important;
          padding: 0 !important;
          position: relative !important;
          z-index: 30 !important;
        }

        #about-box-tabs-shell [role="tab"] {
          position: relative !important;
          overflow: visible !important;
          border-top-left-radius: 12px !important;
          border-top-right-radius: 12px !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          border-bottom: none !important;
          box-shadow: none !important;
          transform: none !important;
          margin: 0 !important;
        }

        #about-box-tabs-shell [role="tab"]::before {
          display: none !important;
        }

        #about-box-tabs-shell [role="tab"][aria-selected="true"] {
          background: #0b101b !important;
          border-top: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-bottom: none !important;
          padding-bottom: 10px !important;
          margin-bottom: -1px !important;
          z-index: 35 !important;
        }

        #about-box-tabs-shell [role="tab"][aria-selected="true"]::after {
          content: '' !important;
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          bottom: -2px !important;
          height: 4px !important;
          background: #0b101b !important;
          pointer-events: none !important;
        }

        #about-box-tabs-shell [role="tab"][aria-selected="false"] {
          background: rgba(15, 23, 42, 0.55) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-bottom: none !important;
          padding-bottom: 8px !important;
          margin-bottom: 0px !important;
          z-index: 15 !important;
        }

        #about-box-tabs-shell [role="tabpanel"] {
          background: #0b101b !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          margin-top: 0px !important;
          position: relative !important;
          z-index: 20 !important;
        }
      `}</style>

      {/* Vùng hiển thị thông báo nổi (Toast) */}
      {typeof document !== 'undefined' ? createPortal(toastOverlay, document.body) : toastOverlay}

      <div
        id="about-cards-track"
        data-element-name="Track căn giữa Giới thiệu"
        data-element-type="container"
        data-element-page="about"
        data-element-parent="about-page-container"
        className="page-cards-track"
      >
        <div
          id="about-main-card"
          data-main-card="true"
          data-floating-surface="main"
          data-element-name="Thẻ chính Trang giới thiệu"
          data-element-type="card"
          data-element-page="about"
          data-element-parent="about-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[var(--main-card-padding,20px)] gap-0 rounded-[var(--radius-global,var(--radius-main,14px))] overflow-hidden box-border"
          style={{ padding: 'var(--main-card-padding, 20px)', gap: '0px', borderRadius: 'var(--radius-global, var(--radius-main, 14px))' }}
        >
          <div
            id="about-main-scroll-viewport"
            data-no-wheel-horizontal="true"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[15px] overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y no-scrollbar box-border"
          >
            {/* Khung chứa chính (Tối đa 1050px theo yêu cầu) */}
            <div
              id="about-main-content"
              data-element-parent="about-main-card"
              className="bento-app-root text-white antialiased selection:bg-purple-500 selection:text-white w-full h-auto shrink-0 flex flex-col justify-start gap-4 min-w-0 box-border"
            >
              {/* ===================================================================== */}
              {/* LƯỚI BENTO GRID CHÍNH                                                 */}
              {/* ===================================================================== */}
              <div id="about-bento-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full">
          {/* ------------------------------------------------------------------- */}
          {/* THẺ 1: CARD VIDEO CHÂN DUNG / BẢN ĐỒ TƯƠNG TÁC                      */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-hero-video-container"
            className="lg:col-span-7 bg-gray-800/90 backdrop-blur-md flex flex-col justify-between min-h-[300px] sm:min-h-[370px]"
          >
            <div className="relative w-full h-full flex-1 rounded-xl overflow-hidden min-h-[270px] flex items-center justify-center border border-white/15 bg-gray-950 shadow-inner">
              {activeHeroMedia === 'video' ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {/* Ảnh nền chân dung tải trước */}
                  <img
                    src={ABOUT_VIDEO_1_POSTER_URL}
                    alt="Hình nền chân dung chuyên gia Nguyễn Hùng Thái"
                    className="absolute inset-0 w-full h-full object-cover object-[50%_22%] select-none pointer-events-none z-0"
                  />

                  {/* VIDEO 1 — Hình nền mặc định (tự động phát, tắt âm thanh, phát vòng lặp) */}
                  <video
                    ref={video1Ref}
                    src={ABOUT_VIDEO_1_STREAM_URL}
                    poster={ABOUT_VIDEO_1_POSTER_URL}
                    autoPlay
                    loop
                    muted={!(!isPlayingIntro && isAudioOn)}
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    onLoadedMetadata={(e) => {
                      if (!isPlayingIntro && e.currentTarget.paused) {
                        e.currentTarget.play().catch(() => {});
                      }
                    }}
                    className={`absolute inset-0 w-full h-full object-cover object-[50%_22%] select-none pointer-events-none ${
                      isPlayingIntro && isVideo2Ready ? 'opacity-0 z-[1]' : 'opacity-100 z-[1]'
                    }`}
                  />

                  {/* VIDEO 2 — Video giới thiệu khi bấm Phát Video */}
                  <video
                    ref={video2Ref}
                    src={ABOUT_VIDEO_2_STREAM_URL}
                    loop
                    muted={!(isPlayingIntro && isAudioOn)}
                    playsInline
                    preload="metadata"
                    controls={false}
                    disablePictureInPicture
                    onPlaying={() => {
                      if (isPlayingIntro) {
                        setIsVideo2Ready(true);
                        if (video1Ref.current && !video1Ref.current.paused) {
                          video1Ref.current.pause();
                        }
                      }
                    }}
                    className={`absolute inset-0 w-full h-full object-cover object-[50%_22%] select-none pointer-events-none ${
                      isPlayingIntro && isVideo2Ready ? 'opacity-100 z-[2]' : 'opacity-0 z-[0]'
                    }`}
                  />

                  {/* Nút phóng to toàn cảnh góc trên phải */}
                  <button
                    type="button"
                    onClick={() => setFocusedBentoCard('hero')}
                    className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white cursor-pointer shadow-lg"
                    title="Phóng to chi tiết chân dung chuyên gia"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Action Capsule góc dưới phải: Loa + Phát Video / Hủy Video */}
                  <div className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-950/80 hover:bg-gray-950/95 backdrop-blur-md border border-white/25 text-white shadow-xl">
                    <button
                      type="button"
                      onClick={toggleVideoMute}
                      className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${
                        isAudioOn
                          ? 'bg-emerald-500/25 text-emerald-300'
                          : 'bg-rose-500/85 text-white'
                      }`}
                      title={isAudioOn ? 'Tắt âm thanh video' : 'Bật âm thanh video'}
                    >
                      {isAudioOn ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="w-[1px] h-4 bg-white/25" />

                    {!isPlayingIntro ? (
                      <button
                        type="button"
                        onClick={handlePlayIntro}
                        className="inline-flex items-center gap-1.5 pr-1 py-0.5 text-xs font-bold tracking-wide cursor-pointer hover:text-cyan-300"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Phát Video</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCancelIntro}
                        className="inline-flex items-center gap-1.5 pr-1 py-0.5 text-xs font-bold tracking-wide text-rose-300 hover:text-rose-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Hủy Video</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC */
                <div className="absolute inset-0 w-full h-full z-10 flex flex-col justify-between">
                  <iframe
                    title={
                      activeHeroMapType === 'tam_tru'
                        ? 'Bản đồ Tạm trú: Chung Cư Tân Mỹ'
                        : 'Bản đồ Cư trú: 7D7 Hoàng Hoa Tám'
                    }
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
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeHeroMapType === 'tam_tru'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
                        <span>Tạm trú</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveHeroMapType('cu_tru')}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeHeroMapType === 'cu_tru'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
                        <span>Cư trú</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveHeroMedia('video')}
                      className="px-3 py-1.5 rounded-full shadow-lg bg-gray-950/85 hover:bg-gray-900 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Quay lại video</span>
                    </button>
                  </div>

                  <div className="relative z-20 m-3 p-3 rounded-xl bg-gray-950/90 backdrop-blur-md border border-white/20 text-white shadow-xl flex flex-col gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0 text-base">
                        📍
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-cyan-300">
                            {activeHeroMapType === 'tam_tru'
                              ? 'Tạm trú hiện tại'
                              : 'Cư trú quê quán'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                            Đã ghim đỏ trên Map
                          </span>
                        </div>
                        <p className="text-xs text-gray-100 font-bold mt-0.5 leading-snug">
                          {activeHeroMapType === 'tam_tru'
                            ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                            : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/10 text-xs">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          activeHeroMapType === 'tam_tru'
                            ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                            : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-1.5"
                      >
                        <span>Mở Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          activeHeroMapType === 'tam_tru'
                            ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                            : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold inline-flex items-center gap-1.5"
                      >
                        <span>Chỉ đường</span>
                        <Navigation className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 2: CARD THÔNG TIN CHI TIẾT (BOX TABS: CÁ NHÂN & LIÊN HỆ)        */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-personal-info-card-right"
            className="lg:col-span-5 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex flex-col justify-start gap-0"
          >
            <div id="about-box-tabs-shell" className="flex-1 flex flex-col justify-start gap-0 min-h-0 w-full">
              {/* Box Tabs Header */}
              <div className="flex items-end justify-between gap-2 relative z-30">
                <div
                  role="tablist"
                  aria-label="Thông tin chi tiết"
                  className="flex items-end gap-1.5 pl-0"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={detailInfoTab === 'personal'}
                    onClick={() => setDetailInfoTab('personal')}
                    className={`no-theme-btn relative inline-flex items-center gap-1.5 px-4 pt-2 pb-2 rounded-t-xl rounded-b-none text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                      detailInfoTab === 'personal'
                        ? 'text-sky-300'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <User
                      className={`w-4 h-4 shrink-0 ${
                        detailInfoTab === 'personal' ? 'text-sky-300' : 'text-current'
                      }`}
                    />
                    <span className="leading-tight">Cá nhân</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={detailInfoTab === 'contact'}
                    onClick={() => setDetailInfoTab('contact')}
                    className={`no-theme-btn relative inline-flex items-center gap-1.5 px-4 pt-2 pb-2 rounded-t-xl rounded-b-none text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                      detailInfoTab === 'contact'
                        ? 'text-emerald-300'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Phone
                      className={`w-4 h-4 shrink-0 ${
                        detailInfoTab === 'contact' ? 'text-emerald-300' : 'text-current'
                      }`}
                    />
                    <span className="leading-tight">Liên hệ</span>
                  </button>
                </div>
              </div>

              {/* Box Tabs Content Container (Liền mạch hoàn toàn với tab đang chọn, không có line ngăn) */}
              <div
                role="tabpanel"
                className={`flex-1 rounded-b-xl rounded-tr-xl ${
                  detailInfoTab === 'contact' ? 'rounded-tl-xl' : 'rounded-tl-none'
                } p-2.5 sm:p-3 bg-[#0b101b] border border-white/15 flex flex-col justify-between gap-2 relative z-20`}
              >
              {detailInfoTab === 'personal' ? (
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full">
                  {personalItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        title={`${item.label}: ${item.value}`}
                        className={`flex flex-col justify-center gap-1 p-2.5 rounded-xl border cursor-pointer min-w-0 ${item.colSpan} ${item.chipCls}`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <IconComp className={`w-3.5 h-3.5 shrink-0 ${item.iconCls}`} />
                          <span className={`text-[11px] font-bold truncate ${item.iconCls}`}>
                            {item.label}
                          </span>
                        </div>
                        <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                          {item.value}
                        </div>
                      </div>
                    );
                  })}

                  {/* Quick Stats Strip (4 chỉ số cốt lõi) */}
                  <div className="col-span-1 sm:col-span-6 grid grid-cols-4 gap-2 pt-1.5">
                    {ABOUT_PROFILE_STATS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setFocusedBentoCard('stats')}
                        className="p-2 rounded-xl bg-gray-900/75 hover:bg-gray-800 border border-white/10 text-center cursor-pointer"
                        title={st.desc}
                      >
                        <div
                          className="text-sm sm:text-base font-bold leading-tight"
                          style={{ color: st.color }}
                        >
                          {st.metric}
                        </div>
                        <div className="text-[10px] font-bold text-gray-300 truncate mt-0.5">
                          {st.id === 'experience'
                            ? 'Kinh nghiệm'
                            : st.id === 'scale'
                            ? 'Quy mô lớn'
                            : st.id === 'automation'
                            ? 'AI CRM'
                            : 'Hài lòng'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full">
                  {contactItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        title={`${item.label}: ${item.value}`}
                        className={`flex flex-col justify-center gap-1 p-2.5 rounded-xl border cursor-pointer min-w-0 ${item.colSpan} ${item.chipCls}`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <IconComp className={`w-3.5 h-3.5 shrink-0 ${item.iconCls}`} />
                          <span className={`text-[11px] font-bold truncate ${item.iconCls}`}>
                            {item.label}
                          </span>
                        </div>
                        <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                          {item.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              </div>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 3: CARD GIỚI THIỆU BẢN THÂN CHUYÊN GIA                          */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-career-goal-card"
            className="lg:col-span-5 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 flex flex-col justify-between gap-3 relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-white/15">
              <div className="flex items-start gap-2 text-purple-200">
                <User className="w-5 h-5 text-purple-200 shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-purple-200">
                  Giới thiệu bản thân
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakSection(
                      'intro',
                      'Giới thiệu bản thân',
                      'Một chuyên gia dịch vụ khách hàng với hơn 22 năm kinh nghiệm thực chiến. Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá để lắng nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.'
                    )
                  }
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    speakingId === 'intro'
                      ? 'bg-white text-purple-900 border-white'
                      : 'bg-purple-950/50 hover:bg-purple-900 text-purple-200 border-purple-400/30'
                  }`}
                  title="Nghe thuyết minh Giới thiệu bản thân"
                >
                  <Volume1 className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-300/30 text-purple-100">
                  22+ Năm CX
                </span>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex items-center">
              <p className="text-sm sm:text-[15px] text-purple-100 leading-relaxed">
                Một chuyên gia dịch vụ khách hàng với hơn{' '}
                <strong className="font-bold text-white">22 năm kinh nghiệm</strong> thực chiến.
                Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc
                trò chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá để lắng
                nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.
              </p>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 4: CARD TRỤ CỘT VẬN HÀNH (3 Ô CON MÀU SẮC TƯƠNG ỨNG)            */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-operating-pillars-card"
            className="lg:col-span-7 bg-gray-800/90 backdrop-blur-md flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-start gap-2 text-cyan-400">
                <Target className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-cyan-400">
                  Trụ cột vận hành
                </h3>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-2.5 items-stretch">
              {/* Pillar 1: Hiệu Quả */}
              <div
                onMouseEnter={() => setHoveredPillarOrValue('pillar-1')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                className={`rounded-xl p-3 bg-gradient-to-br from-cyan-600/35 to-blue-900/55 border border-cyan-400/30 shadow-md flex flex-col justify-start relative overflow-hidden min-w-0 ${
                  isPillarHighlighted('pillar-1') ? 'ring-2 ring-cyan-300' : ''
                }`}
              >
                <BarChart3
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 opacity-15 text-cyan-300 pointer-events-none"
                />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-cyan-300">
                    <BarChart3 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title text-cyan-300 whitespace-nowrap">
                      Hiệu quả vận hành
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-200">
                    Tối ưu &amp; Kết quả
                  </span>
                  <p className="text-xs text-cyan-50/90 leading-relaxed">
                    Chuẩn hóa SLAs, tối ưu hiệu suất quy trình và tạo kết quả đo lường rõ ràng.
                  </p>
                </div>
              </div>

              {/* Pillar 2: Nhân Văn */}
              <div
                onMouseEnter={() => setHoveredPillarOrValue('pillar-2')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                className={`rounded-xl p-3 bg-gradient-to-br from-rose-600/35 via-pink-800/45 to-purple-900/55 border border-rose-400/30 shadow-md flex flex-col justify-start relative overflow-hidden min-w-0 ${
                  isPillarHighlighted('pillar-2') ? 'ring-2 ring-pink-300' : ''
                }`}
              >
                <Heart
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 opacity-15 text-rose-300 pointer-events-none"
                />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-rose-300">
                    <Heart className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title text-rose-300 whitespace-nowrap">
                      Nhân văn con người
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-rose-200">
                    Đồng cảm &amp; Thấu hiểu
                  </span>
                  <p className="text-xs text-rose-50/90 leading-relaxed">
                    Lắng nghe chân thành, phục vụ từ tâm và lấy con người làm trọng tâm.
                  </p>
                </div>
              </div>

              {/* Pillar 3: Bền Vững */}
              <div
                onMouseEnter={() => setHoveredPillarOrValue('pillar-3')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                className={`rounded-xl p-3 bg-gradient-to-br from-emerald-600/35 to-teal-900/55 border border-emerald-400/30 shadow-md flex flex-col justify-start relative overflow-hidden min-w-0 ${
                  isPillarHighlighted('pillar-3') ? 'ring-2 ring-emerald-300' : ''
                }`}
              >
                <Leaf
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 opacity-15 text-emerald-300 pointer-events-none"
                />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-emerald-300">
                    <Leaf className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title text-emerald-300 whitespace-nowrap">
                      Bền vững dài hạn
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-200">
                    Giá trị &amp; Tin cậy
                  </span>
                  <p className="text-xs text-emerald-50/90 leading-relaxed">
                    Xây dựng niềm tin vững bền, bảo chứng chất lượng và đồng hành lâu dài.
                  </p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 5: CARD GIÁ TRỊ CỐT LÕI (3 Ô CON MÀU SẮC TƯƠNG ỨNG)             */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-core-values-card"
            className="lg:col-span-7 bg-gray-800/90 backdrop-blur-md flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-start gap-2 text-amber-300">
                <Star className="w-5 h-5 text-amber-300 fill-current shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-amber-300">
                  Giá trị cốt lõi
                </h3>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-2.5 items-stretch">
              {/* Core Value 1: Tận tâm trách nhiệm */}
              <div
                onMouseEnter={() => setHoveredPillarOrValue('val-1')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                onClick={() =>
                  showToast('Giá trị 01: Tận tâm trách nhiệm - Dốc trọn tâm sức', 'success')
                }
                className={`rounded-xl p-3 bg-gradient-to-br from-amber-500/35 via-orange-600/45 to-amber-950/60 border border-amber-400/35 shadow-md flex flex-col justify-start relative overflow-hidden cursor-pointer min-w-0 ${
                  isValueHighlighted('val-1') ? 'ring-2 ring-amber-300' : ''
                }`}
              >
                <Award
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 opacity-15 text-amber-300 pointer-events-none"
                />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-amber-300">
                    <Award className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title text-amber-300 whitespace-nowrap">
                      Tận tâm trách nhiệm
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-200">
                    Trách nhiệm &amp; Hết lòng
                  </span>
                  <p className="text-xs text-amber-50/90 leading-relaxed">
                    Dốc trọn tâm sức, chăm chút tỉ mỉ từng trải nghiệm khách hàng với tinh thần
                    phụng sự cao nhất.
                  </p>
                </div>
              </div>

              {/* Core Value 2: Kịp thời nhanh nhạy */}
              <div
                onMouseEnter={() => setHoveredPillarOrValue('val-2')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                onClick={() =>
                  showToast('Giá trị 02: Kịp Thời - Nhanh nhạy & Đúng lúc', 'success')
                }
                className={`rounded-xl p-3 bg-gradient-to-br from-pink-600/35 to-purple-900/55 border border-pink-400/35 shadow-md flex flex-col justify-start relative overflow-hidden cursor-pointer min-w-0 ${
                  isValueHighlighted('val-2') ? 'ring-2 ring-pink-300' : ''
                }`}
              >
                <Clock
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 opacity-15 text-pink-300 pointer-events-none"
                />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-pink-300">
                    <Clock className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title text-pink-300 whitespace-nowrap">
                      Kịp thời nhanh nhạy
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-pink-200">
                    Tốc độ &amp; Đúng lúc
                  </span>
                  <p className="text-xs text-pink-50/90 leading-relaxed">
                    Phản ứng nhanh chóng, đồng hành đúng thời điểm để giải quyết triệt để mọi vướng
                    mắc.
                  </p>
                </div>
              </div>

              {/* Core Value 3: Đồng cảm chân thành */}
              <div
                onMouseEnter={() => setHoveredPillarOrValue('val-3')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                onClick={() =>
                  showToast('Giá trị 03: Đồng Cảm Chân Thành - Lắng nghe & Thấu cảm', 'success')
                }
                className={`rounded-xl p-3 bg-gradient-to-br from-violet-600/35 to-fuchsia-900/55 border border-violet-400/35 shadow-md flex flex-col justify-start relative overflow-hidden cursor-pointer min-w-0 ${
                  isValueHighlighted('val-3') ? 'ring-2 ring-purple-300' : ''
                }`}
              >
                <HeartHandshake
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 opacity-15 text-violet-300 pointer-events-none"
                />
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5 text-violet-300">
                    <HeartHandshake className="w-4 h-4 text-violet-300 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title text-violet-300 whitespace-nowrap">
                      Đồng cảm chân thành
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-violet-200">
                    Lắng nghe &amp; Thấu cảm
                  </span>
                  <p className="text-xs text-violet-50/90 leading-relaxed">
                    Đặt trọn trái tim để lắng nghe, thấu hiểu cảm xúc và kết nối sâu sắc với từng
                    khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 6: CARD TRIẾT LÝ TẦM NHÌN & CÂU NÓI HAY                         */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-philosophy-card"
            className="lg:col-span-5 bg-gradient-to-br from-violet-800 via-purple-900 to-slate-900 flex flex-col justify-between gap-3 relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-start gap-2 text-amber-300">
                <Target className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-amber-300">
                  Triết lý tầm nhìn
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakSection(
                      'quote',
                      'Triết lý tầm nhìn',
                      'Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn được lắng nghe.'
                    )
                  }
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    speakingId === 'quote'
                      ? 'bg-amber-400 text-gray-950 border-amber-300'
                      : 'bg-white/10 hover:bg-white/20 text-amber-300 border-amber-400/30'
                  }`}
                  title="Nghe thuyết minh Triết lý tầm nhìn"
                >
                  <Volume1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copySnippet(
                      '“Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý. Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn được lắng nghe.” — Nguyễn Hùng Thái',
                      'Triết lý tầm nhìn'
                    )
                  }
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 cursor-pointer"
                  title="Sao chép câu nói"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                  Tầm nhìn 2026+
                </span>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-2 py-2 gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-300/30 flex items-center justify-center shadow-xs">
                <Quote className="w-4 h-4 text-amber-300 shrink-0" />
              </div>
              <blockquote className="text-sm sm:text-[15px] font-bold italic text-white leading-relaxed">
                “Tôi luôn nỗ lực để mang lại sản phẩm, dịch vụ chất lượng cao với chi phí hợp lý.
                Và trên hết, để mỗi khách hàng cảm nhận được một điều đơn giản mà rất lớn: họ luôn
                được lắng nghe.”
              </blockquote>
            </div>
          </BentoCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL PHÓNG TO CHI TIẾT (HERO / 4 DẤU ẤN)                             */}
      {/* ===================================================================== */}
      {focusedBentoCard && (() => {
        const modalNode = (
          <div
            onClick={() => setFocusedBentoCard(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-2xl bg-gray-900/95 border border-white/15 p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className={`flex items-start gap-2.5 ${focusedBentoCard === 'hero' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                {focusedBentoCard === 'hero' ? (
                  <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <h3 className={`text-lg font-bold leading-tight ${focusedBentoCard === 'hero' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  {focusedBentoCard === 'hero'
                    ? 'Chân Dung Chuyên Gia & Trợ Lý Ảo'
                    : '4 Dấu Ấn Năng Lực Vận Hành Thực Chiến'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFocusedBentoCard(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {focusedBentoCard === 'hero' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/15">
                  <video
                    src={ABOUT_VIDEO_2_STREAM_URL}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-[50%_20%]"
                  />
                </div>
                <div className="space-y-3 text-sm text-gray-200">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Lãnh Đạo Vận Hành CX 22+ Năm</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Nguyễn Hùng Thái</h4>
                  <p className="leading-relaxed">
                    Một chuyên gia dịch vụ khách hàng với hơn{' '}
                    <strong className="text-white">22 năm kinh nghiệm thực chiến</strong>. Với tôi,
                    Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò
                    chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá: để lắng
                    nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.
                  </p>
                  <div className="p-2.5 rounded-xl bg-purple-600/25 border border-purple-400/30 text-purple-200 font-bold text-center text-xs sm:text-sm">
                    Hiệu quả – Nhân văn – Bền vững
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {ABOUT_PROFILE_STATS.map((stat) => {
                    const IconComp = stat.icon;
                    return (
                      <div
                        key={stat.id}
                        className="p-4 rounded-xl bg-gray-800/90 border border-white/10 flex flex-col justify-between"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${stat.color}25` }}
                        >
                          <IconComp className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                        <div className="my-3">
                          <span
                            className="text-2xl font-bold block"
                            style={{ color: stat.color }}
                          >
                            {stat.metric}
                          </span>
                          <span className="text-xs font-bold text-gray-400 block mt-0.5">
                            {stat.unitVi}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{stat.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300">
                  <strong className="text-white">💡 Triết lý đo lường thực chiến:</strong> Số liệu
                  phản ánh năng lực kiểm soát chi tiết từ vi mô (từng cuộc gọi, khiếu nại, phản
                  hồi khách hàng) đến vĩ mô (chiến lược ngân sách, nhân sự, kiến trúc hệ thống CRM
                  và chuyển đổi số).
                </div>
              </div>
            )}
            </div>
          </div>
        );
        return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
      })()}
    </div>
  );
}

export default AboutView;
