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
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import NotificationStack, { type StackNotification } from '@/components/ui/NotificationStack';

// ============================================================================
// 1. DỮ LIỆU GỐC (GIỮ NGUYÊN 100% DATA CỦA CHUYÊN GIA NGUYỄN HÙNG THÁI)
// ============================================================================

const ABOUT_VIDEO_1_STREAM_URL =
  'https://cdn.scena.ai/project/8606/e48a67884f3a52e8a68cf06b97979f3b22835ec92bf466a058c0d78da97c83b0.mp4';
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
      data-section-card="true"
      onClick={onClick}
      style={style}
      className={`bento-card glass-card bento-border ${className}`}
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

export function AboutView({ currentTheme, onShowNotification }: AboutViewProps = {}) {
  const { isDark: themeIsDark } = useTheme();
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'dark-cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-flat-soft-ui' ||
    currentTheme === 'dark-iridescent-liquid-glass';

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

  // Danh sách thông tin Cá nhân (Giữ nguyên 100% dữ liệu)
  const personalItems = useMemo(
    () => [
      {
        id: 'birthday',
        label: 'Sinh nhật',
        value: '22/06/1984',
        icon: Calendar,
        iconCls: 'text-amber-600 dark:text-amber-300',
        chipCls: 'bg-amber-500/10 border-amber-400/40 dark:bg-amber-500/15 dark:border-amber-400/30 hover:bg-amber-500/20 dark:hover:bg-amber-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => showToast('Sinh nhật: 22/06/1984', 'info'),
      },
      {
        id: 'horoscope',
        label: 'Tử vi',
        value: 'Giáp Tý · Hải Trung Kim',
        icon: Sparkles,
        iconCls: 'text-purple-600 dark:text-purple-300',
        chipCls: 'bg-purple-500/10 border-purple-400/40 dark:bg-purple-500/15 dark:border-purple-400/30 hover:bg-purple-500/20 dark:hover:bg-purple-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => showToast('Tử vi: Giáp Tý - Mệnh Hải Trung Kim', 'info'),
      },
      {
        id: 'gender',
        label: 'Giới tính',
        value: 'Nam giới',
        icon: User,
        iconCls: 'text-sky-600 dark:text-sky-300',
        chipCls: 'bg-sky-500/10 border-sky-400/40 dark:bg-sky-500/15 dark:border-sky-400/30 hover:bg-sky-500/20 dark:hover:bg-sky-500/25',
        colSpan: 'col-span-1 sm:col-span-2',
        action: () => showToast('Giới tính: Nam giới', 'info'),
      },
      {
        id: 'ethnicity',
        label: 'Dân tộc',
        value: 'Kinh',
        icon: Globe,
        iconCls: 'text-emerald-600 dark:text-emerald-300',
        chipCls: 'bg-emerald-500/10 border-emerald-400/40 dark:bg-emerald-500/15 dark:border-emerald-400/30 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25',
        colSpan: 'col-span-1 sm:col-span-2',
        action: () => showToast('Dân tộc: Kinh', 'info'),
      },
      {
        id: 'marital',
        label: 'Hôn nhân',
        value: 'Độc thân',
        icon: Heart,
        iconCls: 'text-rose-600 dark:text-rose-300',
        chipCls: 'bg-rose-500/10 border-rose-400/40 dark:bg-rose-500/15 dark:border-rose-400/30 hover:bg-rose-500/20 dark:hover:bg-rose-500/25',
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
        iconCls: 'text-orange-600 dark:text-orange-300',
        chipCls: 'bg-orange-500/10 border-orange-400/40 dark:bg-orange-500/15 dark:border-orange-400/30 hover:bg-orange-500/20 dark:hover:bg-orange-500/25',
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
        iconCls: 'text-pink-600 dark:text-pink-300',
        chipCls: 'bg-pink-500/10 border-pink-400/40 dark:bg-pink-500/15 dark:border-pink-400/30 hover:bg-pink-500/20 dark:hover:bg-pink-500/25',
        colSpan: 'col-span-1 sm:col-span-3',
        action: () => copySnippet('hungthai84@gmail.com', 'Email'),
      },
      {
        id: 'website',
        label: 'Website',
        value: 'Vào website',
        icon: Globe,
        iconCls: 'text-sky-600 dark:text-sky-300',
        chipCls: 'bg-sky-500/10 border-sky-400/40 dark:bg-sky-500/15 dark:border-sky-400/30 hover:bg-sky-500/20 dark:hover:bg-sky-500/25',
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
        iconCls: 'text-indigo-600 dark:text-indigo-300',
        chipCls: 'bg-indigo-500/10 border-indigo-400/40 dark:bg-indigo-500/15 dark:border-indigo-400/30 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/25',
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
        iconCls: 'text-cyan-600 dark:text-cyan-300',
        chipCls: `bg-cyan-500/10 border-cyan-400/40 dark:bg-cyan-500/15 dark:border-cyan-400/30 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25 ${
          activeHeroMedia === 'map' && activeHeroMapType === 'tam_tru'
            ? 'ring-2 ring-cyan-500 dark:ring-cyan-300'
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
        iconCls: 'text-teal-600 dark:text-teal-300',
        chipCls: `bg-teal-500/10 border-teal-400/40 dark:bg-teal-500/15 dark:border-teal-400/30 hover:bg-teal-500/20 dark:hover:bg-teal-500/25 ${
          activeHeroMedia === 'map' && activeHeroMapType === 'cu_tru'
            ? 'ring-2 ring-teal-500 dark:ring-teal-300'
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

  const personalStackItems = useMemo<StackNotification[]>(
    () => [
      {
        id: 'birthday',
        app: 'Hồ sơ cá nhân',
        title: 'Sinh nhật · 22/06/1984',
        body: 'Cung Cự Giải · Hành trình hơn 22 năm gắn bó ngành dịch vụ khách hàng.',
        time: '1984',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-amber-400/35 bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Calendar className="size-4" />
          </span>
        ),
        onClick: personalItems[0]?.action,
      },
      {
        id: 'horoscope',
        app: 'Tử vi & Bản mệnh',
        title: 'Giáp Tý · Hải Trung Kim',
        body: 'Bản mệnh Vàng trong biển · Điềm tĩnh, sâu sắc và bền bỉ trong quản trị.',
        time: 'Mệnh Kim',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-purple-400/35 bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <Sparkles className="size-4" />
          </span>
        ),
        onClick: personalItems[1]?.action,
      },
      {
        id: 'gender',
        app: 'Thông tin cơ bản',
        title: 'Giới tính · Nam giới',
        body: 'Phong thái chuyên nghiệp, quyết đoán và tận tâm trong từng điểm chạm.',
        time: 'Cá nhân',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-sky-400/35 bg-sky-500/15 text-sky-600 dark:text-sky-300">
            <User className="size-4" />
          </span>
        ),
        onClick: personalItems[2]?.action,
      },
      {
        id: 'ethnicity',
        app: 'Quốc tịch & Văn hóa',
        title: 'Dân tộc · Kinh',
        body: 'Việt Nam · Am hiểu văn hóa bản địa và chuẩn mực dịch vụ quốc tế.',
        time: 'Việt Nam',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-emerald-400/35 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <Globe className="size-4" />
          </span>
        ),
        onClick: personalItems[3]?.action,
      },
      {
        id: 'marital',
        app: 'Gia đình',
        title: 'Hôn nhân · Độc thân',
        body: 'Sẵn sàng linh hoạt công tác, tập trung toàn tâm cho sự nghiệp CX.',
        time: 'Hiện tại',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-rose-400/35 bg-rose-500/15 text-rose-600 dark:text-rose-300">
            <Heart className="size-4" />
          </span>
        ),
        onClick: personalItems[4]?.action,
      },
    ],
    [personalItems]
  );

  const contactStackItems = useMemo<StackNotification[]>(
    () => [
      {
        id: 'phone',
        app: 'Zalo & Hotline',
        title: 'Điện thoại · +84 0909097882',
        body: 'Liên hệ trực tiếp hoặc nhắn tin qua Zalo để trao đổi công việc nhanh.',
        time: 'Mở Zalo',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-orange-400/35 bg-orange-500/15 text-orange-600 dark:text-orange-300">
            <Phone className="size-4" />
          </span>
        ),
        onClick: contactItems[0]?.action,
      },
      {
        id: 'email',
        app: 'Hộp thư điện tử',
        title: 'hungthai84@gmail.com',
        body: 'Bấm để sao chép nhanh địa chỉ email hợp tác và tư vấn chuyên môn.',
        time: 'Sao chép',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-pink-400/35 bg-pink-500/15 text-pink-600 dark:text-pink-300">
            <Mail className="size-4" />
          </span>
        ),
        onClick: contactItems[1]?.action,
      },
      {
        id: 'website',
        app: 'Trang web chính thức',
        title: 'nguyenhungthai.powerservice.one',
        body: 'Khám phá hệ sinh thái năng lực, dịch vụ và tài liệu CX của chuyên gia.',
        time: 'Truy cập',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-sky-400/35 bg-sky-500/15 text-sky-600 dark:text-sky-300">
            <Globe className="size-4" />
          </span>
        ),
        onClick: contactItems[2]?.action,
      },
      {
        id: 'linkedin',
        app: 'Mạng lưới nghề nghiệp',
        title: 'LinkedIn · /in/hungthai84',
        body: 'Kết nối hồ sơ quản trị và kinh nghiệm điều hành dịch vụ khách hàng.',
        time: 'Kết nối',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-indigo-400/35 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <UserCheck className="size-4" />
          </span>
        ),
        onClick: contactItems[3]?.action,
      },
      {
        id: 'tam_tru',
        app: 'Địa điểm tạm trú',
        title: 'Tạm trú · P. Tân Phú (Q7)',
        body: 'TP. Hồ Chí Minh · Bấm để ghim và xem vị trí trực tiếp trên bản đồ.',
        time: 'Xem Map',
        active: activeHeroMedia === 'map' && activeHeroMapType === 'tam_tru',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-cyan-400/35 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
            <MapPin className="size-4" />
          </span>
        ),
        onClick: contactItems[4]?.action,
      },
      {
        id: 'cu_tru',
        app: 'Địa điểm cư trú',
        title: 'Cư trú · Phường Mỹ Tho',
        body: 'Tỉnh Đồng Tháp · Bấm để chuyển bản đồ sang khu vực quê quán.',
        time: 'Xem Map',
        active: activeHeroMedia === 'map' && activeHeroMapType === 'cu_tru',
        icon: (
          <span className="flex size-8 items-center justify-center rounded-[10px] border border-teal-400/35 bg-teal-500/15 text-teal-600 dark:text-teal-300">
            <Home className="size-4" />
          </span>
        ),
        onClick: contactItems[5]?.action,
      },
    ],
    [activeHeroMapType, activeHeroMedia, contactItems]
  );

  const toastOverlay = (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass-card pointer-events-auto flex items-center gap-3 border px-4 py-3 rounded-[var(--radius-card,14px)] shadow-2xl max-w-sm"
          style={{
            background: 'var(--surface-secondary-bg, var(--bg-card))',
            borderColor:
              t.type === 'success'
                ? 'color-mix(in srgb, #10b981 48%, var(--border-card, var(--border-color)))'
                : 'color-mix(in srgb, var(--color-primary, #6366f1) 48%, var(--border-card, var(--border-color)))',
            color: 'var(--text-primary)',
          }}
        >
          {t.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <Info className="w-5 h-5 shrink-0 text-[var(--color-primary)]" />
          )}
          <span className="text-sm font-bold text-[var(--text-primary)]">{t.message}</span>
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
      data-theme-mode={isDark ? 'dark' : 'light'}
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

        #about-page-container .bento-card {
          border-radius: var(--radius-card, var(--radius-global, 14px));
          padding: 16px;
          position: relative;
          overflow: hidden;
          background: var(--surface-secondary-bg, var(--bg-card));
          color: var(--text-primary);
          border: var(--card-border-width, 1px) solid var(--surface-secondary-border, var(--border-card, var(--border-color)));
          box-shadow: var(--surface-secondary-shadow, var(--shadow-card));
          backdrop-filter: blur(var(--surface-secondary-blur, var(--glass-card-blur, 18px))) saturate(var(--surface-secondary-saturate, var(--glass-card-saturate, 140%)));
          -webkit-backdrop-filter: blur(var(--surface-secondary-blur, var(--glass-card-blur, 18px))) saturate(var(--surface-secondary-saturate, var(--glass-card-saturate, 140%)));
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        /* Chuẩn hóa đồng nhất 100% kích thước, độ đậm và giãn cách chữ cho tiêu đề Card & Sub-card */
        .bento-unified-title {
          font-family: 'Play', sans-serif;
          font-size: 16px !important;
          line-height: 1.3 !important;
          font-weight: 700 !important;
          letter-spacing: 0em !important;
        }

        /* Box Tab liền mạch cho Card Thông tin chi tiết (Cá nhân & Liên hệ) - Cấu hình đồng bộ 100% theo giao diện */
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
          margin-bottom: calc(-1 * var(--card-border-width, 1px)) !important;
          padding: 0 !important;
          position: relative !important;
          z-index: 30 !important;
          border-bottom: none !important;
        }

        html:root body #about-page-container #about-box-tabs-shell button[role="tab"],
        html:root[data-card-style] body #about-page-container #about-box-tabs-shell button[role="tab"],
        html:root body #el-p2-button-4,
        html:root body #el-p2-button-5,
        #about-box-tabs-shell [role="tab"] {
          position: relative !important;
          overflow: visible !important;
          border-top-left-radius: var(--radius-subcard, var(--radius-card, 14px)) !important;
          border-top-right-radius: var(--radius-subcard, var(--radius-card, 14px)) !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          border-radius: var(--radius-subcard, var(--radius-card, 14px)) var(--radius-subcard, var(--radius-card, 14px)) 0px 0px !important;
          border-bottom: none !important;
          transform: none !important;
          margin: 0 !important;
          cursor: pointer !important;
          backdrop-filter: blur(var(--surface-tertiary-blur, var(--blur-subcard, 14px))) saturate(var(--surface-tertiary-saturate, var(--glass-saturate, 140%))) !important;
          -webkit-backdrop-filter: blur(var(--surface-tertiary-blur, var(--blur-subcard, 14px))) saturate(var(--surface-tertiary-saturate, var(--glass-saturate, 140%))) !important;
          transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease !important;
        }

        #about-box-tabs-shell [role="tab"]::before {
          display: none !important;
        }

        #about-page-container #about-box-tabs-shell [role="tab"][aria-selected="true"] {
          background: var(--surface-tertiary-bg, var(--bg-subcard, var(--bg-card))) !important;
          border-top: var(--card-border-width, 1px) solid var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) !important;
          border-left: var(--card-border-width, 1px) solid var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) !important;
          border-right: var(--card-border-width, 1px) solid var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) !important;
          border-bottom: none !important;
          box-shadow: var(--surface-tertiary-shadow, var(--shadow-subcard, none)) !important;
          outline: var(--outline-subcard, none) !important;
          outline-offset: var(--outline-offset-subcard, -4px) !important;
          color: var(--text-link, var(--color-primary)) !important;
          padding-top: 8px !important;
          padding-bottom: 11px !important;
          margin-bottom: calc(-1 * var(--card-border-width, 1px)) !important;
          z-index: 40 !important;
        }

        #about-page-container #about-box-tabs-shell [role="tab"][aria-selected="true"]::after {
          content: '' !important;
          position: absolute !important;
          left: 0px !important;
          right: 0px !important;
          bottom: -3px !important;
          height: 6px !important;
          background: var(--surface-tertiary-bg, var(--bg-subcard, var(--bg-card))) !important;
          z-index: 50 !important;
          pointer-events: none !important;
        }

        #about-page-container #about-box-tabs-shell [role="tab"][aria-selected="false"] {
          background: color-mix(in srgb, var(--surface-tertiary-bg, var(--bg-subcard, var(--bg-card))) 58%, transparent) !important;
          border-top: var(--card-border-width, 1px) solid color-mix(in srgb, var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) 72%, transparent) !important;
          border-left: var(--card-border-width, 1px) solid color-mix(in srgb, var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) 72%, transparent) !important;
          border-right: var(--card-border-width, 1px) solid color-mix(in srgb, var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) 72%, transparent) !important;
          border-bottom: var(--card-border-width, 1px) solid var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) !important;
          box-shadow: none !important;
          color: var(--text-secondary) !important;
          padding-top: 6px !important;
          padding-bottom: 8px !important;
          margin-bottom: 0px !important;
          z-index: 15 !important;
          opacity: 0.82 !important;
        }

        #about-page-container #about-box-tabs-shell [role="tab"][aria-selected="false"]:hover {
          opacity: 1 !important;
          color: var(--text-primary) !important;
          background: color-mix(in srgb, var(--surface-tertiary-bg, var(--bg-subcard, var(--bg-card))) 86%, transparent) !important;
        }

        #about-page-container #about-box-tabs-shell [role="tabpanel"] {
          background: var(--surface-tertiary-bg, var(--bg-subcard, var(--bg-card))) !important;
          border: var(--card-border-width, 1px) solid var(--surface-tertiary-border, var(--border-subcard, var(--border-color))) !important;
          box-shadow: var(--surface-tertiary-shadow, var(--shadow-subcard, none)) !important;
          backdrop-filter: blur(var(--surface-tertiary-blur, var(--blur-subcard, 14px))) saturate(var(--surface-tertiary-saturate, var(--glass-saturate, 140%))) !important;
          -webkit-backdrop-filter: blur(var(--surface-tertiary-blur, var(--blur-subcard, 14px))) saturate(var(--surface-tertiary-saturate, var(--glass-saturate, 140%))) !important;
          outline: var(--outline-subcard, none) !important;
          outline-offset: var(--outline-offset-subcard, -5px) !important;
          border-bottom-left-radius: var(--radius-subcard, var(--radius-card, 14px)) !important;
          border-bottom-right-radius: var(--radius-subcard, var(--radius-card, 14px)) !important;
          border-top-right-radius: var(--radius-subcard, var(--radius-card, 14px)) !important;
          margin-top: 0px !important;
          position: relative !important;
          z-index: 20 !important;
          transition: background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease !important;
        }

        #about-page-container #about-box-tabs-shell [role="tabpanel"][data-active-tab="personal"] {
          border-top-left-radius: 0px !important;
        }

        #about-page-container #about-box-tabs-shell [role="tabpanel"][data-active-tab="contact"] {
          border-top-left-radius: var(--radius-subcard, var(--radius-card, 14px)) !important;
        }

        #about-page-container #about-box-tabs-shell .about-tab-info-chip {
          background: var(--bg-nested-card, var(--bg-nested, var(--bg-subcard))) !important;
          border: var(--card-border-width, 1px) solid var(--border-nested-badge, var(--border-subcard, var(--border-color))) !important;
          box-shadow: var(--shadow-nested, none) !important;
          border-radius: var(--radius-subcard, 12px) !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
        }

        #about-page-container #about-box-tabs-shell .about-tab-info-chip:hover {
          border-color: color-mix(in srgb, var(--color-primary, #4F46E5) 52%, var(--border-subcard, var(--border-color))) !important;
          background: var(--bg-subcard-hover, var(--bg-nested-card, var(--bg-subcard))) !important;
        }

        html[data-surface-depth="flat"] #about-page-container #about-box-tabs-shell :is([role="tab"], [role="tabpanel"], .about-tab-info-chip) {
          box-shadow: none !important;
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
              className="bento-app-root text-[var(--text-primary)] antialiased selection:bg-purple-500 selection:text-white w-full h-auto shrink-0 flex flex-col justify-start gap-4 min-w-0 box-border"
            >
              {/* ===================================================================== */}
              {/* LƯỚI BENTO GRID CHÍNH                                                 */}
              {/* ===================================================================== */}
              <div
                id="about-bento-grid"
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full bg-transparent"
                style={{
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  backgroundImage: 'none',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  boxShadow: 'none',
                  border: 'none',
                }}
              >
          {/* ------------------------------------------------------------------- */}
          {/* THẺ 1: CARD VIDEO CHÂN DUNG / BẢN ĐỒ TƯƠNG TÁC                      */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-hero-video-container"
            className="lg:col-span-7 flex flex-col justify-between min-h-[300px] sm:min-h-[370px] text-[var(--text-primary)]"
          >
            <div className="relative w-full h-full flex-1 rounded-xl overflow-hidden min-h-[270px] flex items-center justify-center border border-[var(--border-subcard,var(--border-color))] bg-slate-950 shadow-inner">
              {activeHeroMedia === 'video' ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {/* VIDEO 1 — Hình nền mặc định (tự động phát, tắt âm thanh, phát vòng lặp) */}
                  <video
                    ref={video1Ref}
                    src={ABOUT_VIDEO_1_STREAM_URL}
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
                    <div
                      className="inline-flex items-center gap-1.5 p-1 rounded-full backdrop-blur-md border shadow-lg"
                      style={{
                        background: 'var(--surface-secondary-bg, var(--bg-card))',
                        borderColor: 'var(--border-card, var(--border-color))',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveHeroMapType('tam_tru')}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeHeroMapType === 'tam_tru'
                            ? 'bg-[var(--bg-button-primary,var(--color-primary))] text-[var(--text-button-primary,#ffffff)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>Tạm trú</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveHeroMapType('cu_tru')}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                          activeHeroMapType === 'cu_tru'
                            ? 'bg-[var(--bg-button-primary,var(--color-primary))] text-[var(--text-button-primary,#ffffff)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>Cư trú</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveHeroMedia('video')}
                      className="px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border text-[var(--text-primary)] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      style={{
                        background: 'var(--surface-secondary-bg, var(--bg-card))',
                        borderColor: 'var(--border-card, var(--border-color))',
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Quay lại video</span>
                    </button>
                  </div>

                  <div
                    className="relative z-20 m-3 p-3 rounded-xl backdrop-blur-md border text-[var(--text-primary)] shadow-xl flex flex-col gap-2"
                    style={{
                      background: 'var(--surface-secondary-bg, var(--bg-card))',
                      borderColor: 'var(--border-card, var(--border-color))',
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0 text-base">
                        📍
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-[var(--text-link,var(--color-primary))]">
                            {activeHeroMapType === 'tam_tru'
                              ? 'Tạm trú hiện tại'
                              : 'Cư trú quê quán'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] font-bold">
                            Đã ghim đỏ trên Map
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] font-bold mt-0.5 leading-snug">
                          {activeHeroMapType === 'tam_tru'
                            ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                            : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[var(--border-subcard,var(--border-color))] text-xs">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          activeHeroMapType === 'tam_tru'
                            ? 'Chung Cư Tân Mỹ , Phường Tân mỹ , TP. Hồ Chí Minh'
                            : '7D7 Hoàng Hoa Tám, Phường Mỹ Tho, Tỉnh Đồng Tháp'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-[var(--bg-button-primary,var(--color-primary))] text-[var(--text-button-primary,#ffffff)] font-bold inline-flex items-center gap-1.5"
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
                        className="px-3 py-1.5 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard,var(--border-color))] text-[var(--text-primary)] font-bold inline-flex items-center gap-1.5"
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
            className="lg:col-span-5 flex flex-col justify-start gap-0 text-[var(--text-primary)]"
          >
            <div
              id="about-box-tabs-shell"
              data-theme-synced="true"
              className="flex-1 flex flex-col justify-start gap-0 min-h-0 w-full"
            >
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
                    data-box-tab="true"
                    data-theme-synced="true"
                    aria-selected={detailInfoTab === 'personal'}
                    onClick={() => setDetailInfoTab('personal')}
                    className={`no-theme-btn bento-unified-title relative inline-flex items-center gap-1.5 px-4 pt-2 pb-2 font-play text-[16px] font-bold cursor-pointer transition-colors ${
                      detailInfoTab === 'personal'
                        ? 'text-[var(--text-link,var(--color-primary))]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <User
                      className={`w-4 h-4 shrink-0 ${
                        detailInfoTab === 'personal'
                          ? 'text-[var(--text-link,var(--color-primary))]'
                          : 'text-current'
                      }`}
                    />
                    <span className="leading-tight">Cá nhân</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    data-box-tab="true"
                    data-theme-synced="true"
                    aria-selected={detailInfoTab === 'contact'}
                    onClick={() => setDetailInfoTab('contact')}
                    className={`no-theme-btn bento-unified-title relative inline-flex items-center gap-1.5 px-4 pt-2 pb-2 font-play text-[16px] font-bold cursor-pointer transition-colors ${
                      detailInfoTab === 'contact'
                        ? 'text-[var(--text-link,var(--color-primary))]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Phone
                      className={`w-4 h-4 shrink-0 ${
                        detailInfoTab === 'contact'
                          ? 'text-[var(--text-link,var(--color-primary))]'
                          : 'text-current'
                      }`}
                    />
                    <span className="leading-tight">Liên hệ</span>
                  </button>
                </div>
              </div>

              {/* Box Tabs Content Container (Liền mạch hoàn toàn với tab đang chọn, đồng bộ theo giao diện đang dùng) */}
              <div
                role="tabpanel"
                data-active-tab={detailInfoTab}
                data-theme-synced="true"
                className="flex-1 p-3 sm:p-3.5 flex flex-col justify-between gap-3 relative z-20"
              >
                {detailInfoTab === 'personal' ? (
                  <NotificationStack
                    key="personal-stack"
                    notifications={personalStackItems}
                    headerTitle="Hồ sơ cá nhân"
                    showAllLabel="Xem tất cả"
                    showLessLabel="Thu gọn"
                    emptyLabel="Đã ẩn các thẻ thông tin cá nhân."
                    resetLabel="Hiện lại thẻ"
                    onDismiss={(id) => showToast(`Đã ẩn thẻ ${id} — bấm "Hiện lại thẻ" để khôi phục`, 'info')}
                  />
                ) : (
                  <NotificationStack
                    key="contact-stack"
                    notifications={contactStackItems}
                    headerTitle="Kênh liên hệ & Địa chỉ"
                    showAllLabel="Xem tất cả"
                    showLessLabel="Thu gọn"
                    emptyLabel="Đã ẩn các thẻ thông tin liên hệ."
                    resetLabel="Hiện lại thẻ"
                    onDismiss={(id) => showToast(`Đã ẩn thẻ ${id} — bấm "Hiện lại thẻ" để khôi phục`, 'info')}
                  />
                )}

                <div className="pt-2.5 border-t border-[var(--border-subcard,var(--border-color))] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                  <span>Di chuột hoặc chạm để bung thẻ · Vuốt ngang để ẩn</span>
                  <div className="flex items-center gap-3 shrink-0 font-bold">
                    <button
                      type="button"
                      onClick={() => copySnippet('hungthai84@gmail.com', 'Email')}
                      className="no-theme-btn text-[var(--text-link,var(--color-primary))] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Sao chép Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveHeroMedia((prev) => (prev === 'map' ? 'video' : 'map'));
                      }}
                      className="no-theme-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer whitespace-nowrap"
                    >
                      {activeHeroMedia === 'map' ? 'Xem Video' : 'Xem Bản đồ'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 3: CARD GIỚI THIỆU BẢN THÂN CHUYÊN GIA                          */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-career-goal-card"
            className="lg:col-span-5 flex flex-col justify-between gap-3 relative overflow-hidden text-[var(--text-primary)]"
          >
            <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard,var(--border-color))]">
              <div className="flex items-start gap-2 text-[var(--text-link,var(--color-primary))]">
                <User className="w-5 h-5 shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-[var(--text-link,var(--color-primary))]">
                  Giới thiệu bản thân
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    background: 'color-mix(in srgb, var(--color-primary, #4F46E5) 14%, var(--bg-subcard))',
                    borderColor: 'color-mix(in srgb, var(--color-primary, #4F46E5) 32%, var(--border-subcard))',
                    color: 'var(--text-link, var(--color-primary))',
                  }}
                >
                  22+ Năm CX
                </span>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex items-center">
              <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                Một chuyên gia dịch vụ khách hàng với hơn{' '}
                <strong className="font-bold text-[var(--text-primary)]">22 năm kinh nghiệm</strong> thực chiến.
                Với tôi, Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc
                trò chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá để lắng
                nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.
              </p>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 4: CARD TRỤ CỘT VẬN HÀNH (3 Ô CON ĐỒNG BỘ GIAO DIỆN ĐANG DÙNG)  */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-operating-pillars-card"
            className="lg:col-span-7 flex flex-col justify-between gap-3 text-[var(--text-primary)]"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard,var(--border-color))]">
              <div className="flex items-start gap-2 text-[var(--text-link,var(--color-primary))]">
                <Target className="w-5 h-5 shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-[var(--text-link,var(--color-primary))]">
                  Trụ cột vận hành
                </h3>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 grid-rows-1 gap-2.5 items-stretch min-w-0">
              {/* Pillar 1: Hiệu Quả */}
              <div
                data-subcard="true"
                onMouseEnter={() => setHoveredPillarOrValue('pillar-1')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                style={{
                  background: 'color-mix(in srgb, #06b6d4 10%, var(--bg-subcard, var(--bg-card)))',
                  borderColor: isPillarHighlighted('pillar-1')
                    ? '#06b6d4'
                    : 'color-mix(in srgb, #06b6d4 30%, var(--border-subcard, var(--border-color)))',
                }}
                className={cn(
                  'rounded-[var(--radius-subcard,12px)] p-2.5 sm:p-3 border flex flex-col justify-start relative overflow-hidden min-w-0 h-full transition-all',
                  isPillarHighlighted('pillar-1') ? 'ring-2 ring-cyan-400/70' : ''
                )}
              >
                <BarChart3
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 pointer-events-none opacity-12 text-cyan-500"
                />
                <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-start gap-1.5 text-cyan-600 dark:text-cyan-300 min-w-0">
                    <BarChart3 className="w-4 h-4 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title break-words min-w-0">
                      Hiệu quả vận hành
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-300 opacity-90 break-words">
                    Tối ưu &amp; Kết quả
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
                    Chuẩn hóa SLAs, tối ưu hiệu suất quy trình và tạo kết quả đo lường rõ ràng.
                  </p>
                </div>
              </div>

              {/* Pillar 2: Nhân Văn */}
              <div
                data-subcard="true"
                onMouseEnter={() => setHoveredPillarOrValue('pillar-2')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                style={{
                  background: 'color-mix(in srgb, #f43f5e 10%, var(--bg-subcard, var(--bg-card)))',
                  borderColor: isPillarHighlighted('pillar-2')
                    ? '#f43f5e'
                    : 'color-mix(in srgb, #f43f5e 30%, var(--border-subcard, var(--border-color)))',
                }}
                className={cn(
                  'rounded-[var(--radius-subcard,12px)] p-2.5 sm:p-3 border flex flex-col justify-start relative overflow-hidden min-w-0 h-full transition-all',
                  isPillarHighlighted('pillar-2') ? 'ring-2 ring-rose-400/70' : ''
                )}
              >
                <Heart
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 pointer-events-none opacity-12 text-rose-500"
                />
                <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-start gap-1.5 text-rose-600 dark:text-rose-300 min-w-0">
                    <Heart className="w-4 h-4 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title break-words min-w-0">
                      Nhân văn con người
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-300 opacity-90 break-words">
                    Đồng cảm &amp; Thấu hiểu
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
                    Lắng nghe chân thành, phục vụ từ tâm và lấy con người làm trọng tâm.
                  </p>
                </div>
              </div>

              {/* Pillar 3: Bền Vững */}
              <div
                data-subcard="true"
                onMouseEnter={() => setHoveredPillarOrValue('pillar-3')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                style={{
                  background: 'color-mix(in srgb, #10b981 10%, var(--bg-subcard, var(--bg-card)))',
                  borderColor: isPillarHighlighted('pillar-3')
                    ? '#10b981'
                    : 'color-mix(in srgb, #10b981 30%, var(--border-subcard, var(--border-color)))',
                }}
                className={cn(
                  'rounded-[var(--radius-subcard,12px)] p-2.5 sm:p-3 border flex flex-col justify-start relative overflow-hidden min-w-0 h-full transition-all',
                  isPillarHighlighted('pillar-3') ? 'ring-2 ring-emerald-400/70' : ''
                )}
              >
                <Leaf
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 pointer-events-none opacity-12 text-emerald-500"
                />
                <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-300 min-w-0">
                    <Leaf className="w-4 h-4 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title break-words min-w-0">
                      Bền vững dài hạn
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-300 opacity-90 break-words">
                    Giá trị &amp; Tin cậy
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
                    Xây dựng niềm tin vững bền, bảo chứng chất lượng và đồng hành lâu dài.
                  </p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ------------------------------------------------------------------- */}
          {/* THẺ 5: CARD GIÁ TRỊ CỐT LÕI (3 Ô CON ĐỒNG BỘ GIAO DIỆN ĐANG DÙNG)   */}
          {/* ------------------------------------------------------------------- */}
          <BentoCard
            id="about-core-values-card"
            className="lg:col-span-7 flex flex-col justify-between gap-3 text-[var(--text-primary)]"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard,var(--border-color))]">
              <div className="flex items-start gap-2 text-[var(--text-link,var(--color-primary))]">
                <Star className="w-5 h-5 fill-current shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-[var(--text-link,var(--color-primary))]">
                  Giá trị cốt lõi
                </h3>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 grid-rows-1 gap-2.5 items-stretch min-w-0">
              {/* Core Value 1: Tận tâm trách nhiệm */}
              <div
                data-subcard="true"
                onMouseEnter={() => setHoveredPillarOrValue('val-1')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                onClick={() =>
                  showToast('Giá trị 01: Tận tâm trách nhiệm - Dốc trọn tâm sức', 'success')
                }
                style={{
                  background: 'color-mix(in srgb, #f59e0b 10%, var(--bg-subcard, var(--bg-card)))',
                  borderColor: isValueHighlighted('val-1')
                    ? '#f59e0b'
                    : 'color-mix(in srgb, #f59e0b 30%, var(--border-subcard, var(--border-color)))',
                }}
                className={cn(
                  'rounded-[var(--radius-subcard,12px)] p-2.5 sm:p-3 border flex flex-col justify-start relative overflow-hidden cursor-pointer min-w-0 h-full transition-all',
                  isValueHighlighted('val-1') ? 'ring-2 ring-amber-400/70' : ''
                )}
              >
                <Award
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 pointer-events-none opacity-12 text-amber-500"
                />
                <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-start gap-1.5 text-amber-600 dark:text-amber-300 min-w-0">
                    <Award className="w-4 h-4 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title break-words min-w-0">
                      Tận tâm trách nhiệm
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-300 opacity-90 break-words">
                    Trách nhiệm &amp; Hết lòng
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
                    Dốc trọn tâm sức, chăm chút tỉ mỉ từng trải nghiệm khách hàng với tinh thần
                    phụng sự cao nhất.
                  </p>
                </div>
              </div>

              {/* Core Value 2: Kịp thời nhanh nhạy */}
              <div
                data-subcard="true"
                onMouseEnter={() => setHoveredPillarOrValue('val-2')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                onClick={() =>
                  showToast('Giá trị 02: Kịp Thời - Nhanh nhạy & Đúng lúc', 'success')
                }
                style={{
                  background: 'color-mix(in srgb, #ec4899 10%, var(--bg-subcard, var(--bg-card)))',
                  borderColor: isValueHighlighted('val-2')
                    ? '#ec4899'
                    : 'color-mix(in srgb, #ec4899 30%, var(--border-subcard, var(--border-color)))',
                }}
                className={cn(
                  'rounded-[var(--radius-subcard,12px)] p-2.5 sm:p-3 border flex flex-col justify-start relative overflow-hidden cursor-pointer min-w-0 h-full transition-all',
                  isValueHighlighted('val-2') ? 'ring-2 ring-pink-400/70' : ''
                )}
              >
                <Clock
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 pointer-events-none opacity-12 text-pink-500"
                />
                <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-start gap-1.5 text-pink-600 dark:text-pink-300 min-w-0">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title break-words min-w-0">
                      Kịp thời nhanh nhạy
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-pink-600 dark:text-pink-300 opacity-90 break-words">
                    Tốc độ &amp; Đúng lúc
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
                    Phản ứng nhanh chóng, đồng hành đúng thời điểm để giải quyết triệt để mọi vướng
                    mắc.
                  </p>
                </div>
              </div>

              {/* Core Value 3: Đồng cảm chân thành */}
              <div
                data-subcard="true"
                onMouseEnter={() => setHoveredPillarOrValue('val-3')}
                onMouseLeave={() => setHoveredPillarOrValue(null)}
                onClick={() =>
                  showToast('Giá trị 03: Đồng Cảm Chân Thành - Lắng nghe & Thấu cảm', 'success')
                }
                style={{
                  background: 'color-mix(in srgb, #8b5cf6 10%, var(--bg-subcard, var(--bg-card)))',
                  borderColor: isValueHighlighted('val-3')
                    ? '#8b5cf6'
                    : 'color-mix(in srgb, #8b5cf6 30%, var(--border-subcard, var(--border-color)))',
                }}
                className={cn(
                  'rounded-[var(--radius-subcard,12px)] p-2.5 sm:p-3 border flex flex-col justify-start relative overflow-hidden cursor-pointer min-w-0 h-full transition-all',
                  isValueHighlighted('val-3') ? 'ring-2 ring-violet-400/70' : ''
                )}
              >
                <HeartHandshake
                  aria-hidden="true"
                  className="w-16 h-16 absolute -bottom-2 -right-2 pointer-events-none opacity-12 text-violet-500"
                />
                <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-start gap-1.5 text-violet-600 dark:text-violet-300 min-w-0">
                    <HeartHandshake className="w-4 h-4 shrink-0 mt-0.5" />
                    <h4 className="bento-unified-title break-words min-w-0">
                      Đồng cảm chân thành
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-300 opacity-90 break-words">
                    Lắng nghe &amp; Thấu cảm
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
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
            className="lg:col-span-5 flex flex-col justify-between gap-3 relative overflow-hidden text-[var(--text-primary)]"
          >
            <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-[var(--border-subcard,var(--border-color))]">
              <div className="flex items-start gap-2 text-[var(--text-link,var(--color-primary))]">
                <Target className="w-5 h-5 shrink-0 mt-0.5" />
                <h3 className="bento-unified-title text-[var(--text-link,var(--color-primary))]">
                  Triết lý tầm nhìn
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border"
                  style={{
                    background: 'color-mix(in srgb, var(--color-primary, #4F46E5) 14%, var(--bg-subcard))',
                    borderColor: 'color-mix(in srgb, var(--color-primary, #4F46E5) 32%, var(--border-subcard))',
                    color: 'var(--text-link, var(--color-primary))',
                  }}
                >
                  Tầm nhìn 2026+
                </span>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-2 py-2 gap-2.5">
              <div
                className="w-9 h-9 rounded-full border flex items-center justify-center shadow-xs"
                style={{
                  background: 'color-mix(in srgb, var(--color-primary, #4F46E5) 14%, var(--bg-subcard))',
                  borderColor: 'color-mix(in srgb, var(--color-primary, #4F46E5) 32%, var(--border-subcard))',
                  color: 'var(--text-link, var(--color-primary))',
                }}
              >
                <Quote className="w-4 h-4 shrink-0" />
              </div>
              <blockquote className="text-sm sm:text-[15px] font-bold italic text-[var(--text-primary)] leading-relaxed">
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
              className="glass-card bento-card w-full max-w-4xl rounded-[var(--radius-card,var(--radius-global,16px))] border border-[var(--border-card,var(--border-color))] p-5 sm:p-6 shadow-2xl text-[var(--text-primary)] max-h-[90vh] overflow-y-auto"
              style={{
                background: 'var(--surface-secondary-bg, var(--bg-card))',
              }}
            >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subcard,var(--border-color))]">
              <div className="flex items-start gap-2.5 text-[var(--text-link,var(--color-primary))]">
                {focusedBentoCard === 'hero' ? (
                  <Bot className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <BarChart3 className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <h3 className="text-lg font-bold leading-tight text-[var(--text-link,var(--color-primary))]">
                  {focusedBentoCard === 'hero'
                    ? 'Chân Dung Chuyên Gia & Trợ Lý Ảo'
                    : '4 Dấu Ấn Năng Lực Vận Hành Thực Chiến'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFocusedBentoCard(null)}
                className="theme-modal-close p-2 rounded-full bg-[var(--bg-subcard)] border border-[var(--border-subcard,var(--border-color))] cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {focusedBentoCard === 'hero' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[var(--border-subcard,var(--border-color))]">
                  <video
                    src={ABOUT_VIDEO_2_STREAM_URL}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-[50%_20%]"
                  />
                </div>
                <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-link,var(--color-primary))]">
                    <Sparkles className="w-4 h-4" />
                    <span>Lãnh Đạo Vận Hành CX 22+ Năm</span>
                  </div>
                  <h4 className="text-xl font-bold text-[var(--text-primary)]">Nguyễn Hùng Thái</h4>
                  <p className="leading-relaxed">
                    Một chuyên gia dịch vụ khách hàng với hơn{' '}
                    <strong className="text-[var(--text-primary)]">22 năm kinh nghiệm thực chiến</strong>. Với tôi,
                    Chăm Sóc Khách Hàng không chỉ là phục vụ, mà là sự đồng hành. Mỗi cuộc trò
                    chuyện, mỗi khoảnh khắc, dù là nhỏ nhất, đều là một cơ hội quý giá: để lắng
                    nghe, để thấu hiểu, và để tạo ra những trải nghiệm vượt trên cả sự mong đợi.
                  </p>
                  <div
                    className="p-2.5 rounded-xl border font-bold text-center text-xs sm:text-sm"
                    style={{
                      background: 'color-mix(in srgb, var(--color-primary, #4F46E5) 14%, var(--bg-subcard))',
                      borderColor: 'color-mix(in srgb, var(--color-primary, #4F46E5) 32%, var(--border-subcard))',
                      color: 'var(--text-link, var(--color-primary))',
                    }}
                  >
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
                        data-subcard="true"
                        className="p-4 rounded-xl bg-[var(--bg-subcard)] border border-[var(--border-subcard,var(--border-color))] flex flex-col justify-between"
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
                          <span className="text-xs font-bold text-[var(--text-secondary)] block mt-0.5">
                            {stat.unitVi}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{stat.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-subcard)] border border-[var(--border-subcard,var(--border-color))] text-xs sm:text-sm text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">💡 Triết lý đo lường thực chiến:</strong> Số liệu
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
