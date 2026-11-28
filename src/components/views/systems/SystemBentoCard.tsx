'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Globe,
  DollarSign,
  Users,
  Briefcase,
  FileText,
  Target,
  Gift,
  GraduationCap,
  Headphones,
  TrendingUp,
  Cpu,
  ShoppingCart,
  ArrowRight,
  Play,
  ChevronUp,
  X,
} from 'lucide-react';
import { SystemData } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  getExpandCardLayoutTransition,
  getCardSettleTransition,
  getExpandDetailRevealTransition,
} from '@/components/ui/ExpandCardMotion';

export interface SystemBentoStyleConfig {
  cardBg: string;
  accentText: string;
  badgeTextColor: string;
  pillBg: string;
  archetype:
    | 'portal'
    | 'stats'
    | 'social'
    | 'team'
    | 'roadmap'
    | 'progress'
    | 'tiers'
    | 'learning'
    | 'kanban'
    | 'chart'
    | 'ai'
    | 'commerce';
}

export const BENTO_SYSTEM_STYLES: Record<string, SystemBentoStyleConfig> = {
  sdp: {
    cardBg: 'linear-gradient(135deg, #d97706 0%, #92400e 52%, #1e1b4b 100%)',
    accentText: '#fde047',
    badgeTextColor: '#854d0e',
    pillBg: 'rgba(253, 224, 71, 0.16)',
    archetype: 'portal',
  },
  erp: {
    cardBg: 'linear-gradient(135deg, #0d9488 0%, #115e59 55%, #0f172a 100%)',
    accentText: '#5eead4',
    badgeTextColor: '#0f766e',
    pillBg: 'rgba(94, 234, 212, 0.16)',
    archetype: 'stats',
  },
  crm: {
    cardBg: 'linear-gradient(135deg, #e11d48 0%, #9f1239 55%, #3b0764 100%)',
    accentText: '#fda4af',
    badgeTextColor: '#be123c',
    pillBg: 'rgba(253, 164, 175, 0.16)',
    archetype: 'social',
  },
  hrm: {
    cardBg: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 58%, #0f172a 100%)',
    accentText: '#93c5fd',
    badgeTextColor: '#1e40af',
    pillBg: 'rgba(147, 197, 253, 0.16)',
    archetype: 'team',
  },
  bpm: {
    cardBg: 'linear-gradient(135deg, #ea580c 0%, #9a3412 58%, #1c1917 100%)',
    accentText: '#fdba74',
    badgeTextColor: '#c2410c',
    pillBg: 'rgba(253, 186, 116, 0.16)',
    archetype: 'roadmap',
  },
  okr: {
    cardBg: 'linear-gradient(135deg, #4d7c0f 0%, #14532d 58%, #0f172a 100%)',
    accentText: '#bef264',
    badgeTextColor: '#3f6212',
    pillBg: 'rgba(190, 242, 100, 0.16)',
    archetype: 'progress',
  },
  clp: {
    cardBg: 'linear-gradient(135deg, #0f766e 0%, #164e63 58%, #090d16 100%)',
    accentText: '#67e8f9',
    badgeTextColor: '#0f766e',
    pillBg: 'rgba(103, 232, 249, 0.16)',
    archetype: 'tiers',
  },
  lms: {
    cardBg: 'linear-gradient(135deg, #2563eb 0%, #3730a3 58%, #1e1b4b 100%)',
    accentText: '#bfdbfe',
    badgeTextColor: '#1d4ed8',
    pillBg: 'rgba(191, 219, 254, 0.16)',
    archetype: 'learning',
  },
  csc: {
    cardBg: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 58%, #18181b 100%)',
    accentText: '#fed7aa',
    badgeTextColor: '#c2410c',
    pillBg: 'rgba(254, 215, 170, 0.16)',
    archetype: 'kanban',
  },
  bi: {
    cardBg: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 55%, #0f172a 100%)',
    accentText: '#ddd6fe',
    badgeTextColor: '#6d28d9',
    pillBg: 'rgba(221, 214, 254, 0.16)',
    archetype: 'chart',
  },
  ai: {
    cardBg: 'linear-gradient(135deg, #5b21b6 0%, #86198f 55%, #1e1b4b 100%)',
    accentText: '#f5d0fe',
    badgeTextColor: '#4c1d95',
    pillBg: 'rgba(245, 208, 254, 0.16)',
    archetype: 'ai',
  },
  pos: {
    cardBg: 'linear-gradient(135deg, #0284c7 0%, #1e40af 58%, #0f172a 100%)',
    accentText: '#7dd3fc',
    badgeTextColor: '#0369a1',
    pillBg: 'rgba(125, 211, 252, 0.16)',
    archetype: 'commerce',
  },
};

const SystemIcon: React.FC<{
  iconName?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ iconName, className = 'w-4 h-4', style }) => {
  const props = { className, style };
  switch (iconName) {
    case 'globe':
      return <Globe {...props} />;
    case 'chart':
      return <DollarSign {...props} />;
    case 'users':
      return <Users {...props} />;
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'file-text':
      return <FileText {...props} />;
    case 'target':
      return <Target {...props} />;
    case 'gift':
      return <Gift {...props} />;
    case 'graduation':
      return <GraduationCap {...props} />;
    case 'headphones':
      return <Headphones {...props} />;
    case 'trending':
      return <TrendingUp {...props} />;
    case 'robot':
      return <Cpu {...props} />;
    case 'shopping-cart':
      return <ShoppingCart {...props} />;
    default:
      return <Globe {...props} />;
  }
};

const ExpandedBentoModule: React.FC<{
  sys: SystemData;
  bentoStyle: SystemBentoStyleConfig;
  isEn: boolean;
  showToast: (msg: string) => void;
}> = ({ sys, bentoStyle, isEn, showToast }) => {
  switch (bentoStyle.archetype) {
    case 'portal':
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {['CRM 360°', 'ERP Ledger', 'HRM Core', 'AI Agent'].map((mod) => (
            <div
              key={mod}
              className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-xs font-bold text-amber-300">{mod}</div>
              <div className="text-[10px] text-white/70 mt-0.5">
                {isEn ? 'SSO Connected' : 'SSO Kết nối'}
              </div>
            </div>
          ))}
        </div>
      );
    case 'stats':
      return (
        <div className="bg-black/30 border border-white/10 rounded-xl p-3">
          <div className="flex justify-between gap-2 text-xs font-bold mb-2">
            <span className="text-teal-200">
              {isEn ? 'Resource & Finance Allocation' : 'Phân Bổ Nguồn Lực & Tài Chính'}
            </span>
            <span className="text-emerald-300 shrink-0">{sys.metrics}</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden flex gap-0.5">
            <div className="bg-teal-400 h-full w-[42%]" title={isEn ? 'Accounting' : 'Kế toán'} />
            <div className="bg-cyan-300 h-full w-[33%]" title={isEn ? 'Warehouse' : 'Kho vận'} />
            <div className="bg-amber-300 h-full w-[25%]" title={isEn ? 'Assets' : 'Tài sản'} />
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-white/80">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              {isEn ? 'Finance 42%' : 'Tài chính 42%'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-300" />
              {isEn ? 'Procurement & Stock 33%' : 'Mua hàng & Kho 33%'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-300" />
              {isEn ? 'Assets 25%' : 'Tài sản 25%'}
            </span>
          </div>
        </div>
      );
    case 'social':
      return (
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="text-lg font-bold text-white">360°</div>
            <div className="text-[10px] text-rose-200 uppercase">
              {isEn ? 'Unified Profile' : 'Hồ Sơ Tập Trung'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="text-lg font-bold text-emerald-300">+45%</div>
            <div className="text-[10px] text-rose-200 uppercase">
              {isEn ? 'CSAT Score' : 'Chỉ Số CSAT'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="text-lg font-bold text-amber-300">Real-time</div>
            <div className="text-[10px] text-rose-200 uppercase">
              {isEn ? 'CX Journey' : 'Hành Trình CX'}
            </div>
          </div>
        </div>
      );
    case 'team':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-blue-200">
              {isEn ? 'Schedule Adherence' : 'Tuân thủ lịch ca'}
            </span>
            <span className="font-bold text-emerald-300">95%</span>
          </div>
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-blue-200">{isEn ? 'HR Lifecycle' : 'Chu trình nhân sự'}</span>
            <span className="font-bold text-sky-300">
              {isEn ? 'Hire → Payroll' : 'Tuyển dụng → Lương'}
            </span>
          </div>
        </div>
      );
    case 'roadmap':
      return (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-black/30 border border-emerald-400/30 p-2.5 rounded-xl">
            <div className="text-[10px] font-bold text-emerald-300">
              {isEn ? 'STEP 01' : 'BƯỚC 01'}
            </div>
            <div className="font-bold text-white mt-0.5">
              {isEn ? 'Digital Forms' : 'Số hóa biểu mẫu'}
            </div>
          </div>
          <div className="bg-black/30 border border-amber-400/30 p-2.5 rounded-xl">
            <div className="text-[10px] font-bold text-amber-300">
              {isEn ? 'STEP 02' : 'BƯỚC 02'}
            </div>
            <div className="font-bold text-white mt-0.5">
              {isEn ? 'Auto Approval' : 'Phê duyệt tự động'}
            </div>
          </div>
          <div className="bg-black/30 border border-sky-400/30 p-2.5 rounded-xl">
            <div className="text-[10px] font-bold text-sky-300">
              {isEn ? 'STEP 03' : 'BƯỚC 03'}
            </div>
            <div className="font-bold text-white mt-0.5">
              {isEn ? 'Cross-Team Flow' : 'Tối ưu liên phòng'}
            </div>
          </div>
        </div>
      );
    case 'progress':
      return (
        <div className="bg-black/30 border border-white/10 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex justify-between font-bold">
            <span className="text-lime-200">
              {isEn ? 'Goal Alignment & Transparency' : 'Mức độ minh bạch & liên kết mục tiêu'}
            </span>
            <span className="text-lime-300">100%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-lime-300 to-emerald-400 h-full rounded-full w-full" />
          </div>
        </div>
      );
    case 'tiers':
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="font-bold text-teal-200">{isEn ? 'Member' : 'Thành Viên'}</div>
            <div className="text-[10px] text-white/70 mt-0.5">
              {isEn ? 'Base points' : 'Tích điểm cơ bản'}
            </div>
          </div>
          <div className="bg-teal-500/20 border border-teal-300/40 p-2.5 rounded-xl">
            <div className="font-bold text-amber-300">{isEn ? 'Gold Tier' : 'Hạng Vàng'}</div>
            <div className="text-[10px] text-white/85 mt-0.5">
              {isEn ? '2x Voucher perks' : 'Voucher ưu đãi x2'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="font-bold text-cyan-300">{isEn ? 'Diamond' : 'Kim Cương'}</div>
            <div className="text-[10px] text-white/70 mt-0.5">
              {isEn ? '+32 NPS Score' : '+32 Điểm NPS'}
            </div>
          </div>
        </div>
      );
    case 'learning':
      return (
        <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-xs">
          <div className="flex justify-between gap-2 mb-1.5">
            <span className="text-blue-200 font-bold">
              {isEn
                ? 'Accelerated Employee Onboarding'
                : 'Hiệu quả rút ngắn thời gian đào tạo hội nhập'}
            </span>
            <span className="text-emerald-300 font-bold shrink-0">-50% Onboarding</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-indigo-300 h-full rounded-full w-[85%]" />
          </div>
        </div>
      );
    case 'kanban':
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="text-base font-bold text-white">{isEn ? 'Multi' : 'Đa Kênh'}</div>
            <div className="text-[10px] text-orange-200">Omnichannel</div>
          </div>
          <div className="bg-black/30 border border-emerald-400/30 p-2.5 rounded-xl">
            <div className="text-base font-bold text-emerald-300">85% FCR</div>
            <div className="text-[10px] text-orange-200">
              {isEn ? 'First Contact' : 'Giải quyết ngay'}
            </div>
          </div>
          <div className="bg-black/30 border border-amber-400/30 p-2.5 rounded-xl">
            <div className="text-base font-bold text-amber-300">99.98%</div>
            <div className="text-[10px] text-orange-200">{isEn ? 'SLA Target' : 'Cam kết SLA'}</div>
          </div>
        </div>
      );
    case 'chart':
      return (
        <div className="bg-black/30 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-purple-200 font-bold">Real-time Wallboard Analytics</span>
            <span className="text-emerald-300 font-bold">100% Data-Driven</span>
          </div>
          <div className="flex items-end gap-1.5 h-12">
            <div className="flex-1 bg-purple-400/40 rounded-t h-2/5" />
            <div className="flex-1 bg-purple-400/55 rounded-t h-3/5" />
            <div className="flex-1 bg-purple-400/70 rounded-t h-1/2" />
            <div className="flex-1 bg-purple-300/80 rounded-t h-4/5" />
            <div className="flex-1 bg-indigo-300/90 rounded-t h-3/4" />
            <div className="flex-1 bg-gradient-to-t from-violet-400 to-fuchsia-300 rounded-t h-full" />
          </div>
        </div>
      );
    case 'ai':
      return (
        <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-fuchsia-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {isEn
                ? '24/7 Knowledge Copilot • Response < 400ms'
                : 'Trợ lý tri thức 24/7 • Phản hồi < 400ms'}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              SoundEngine.playTap();
              showToast(
                isEn
                  ? 'AI Assistant is ready to assist with knowledge lookup!'
                  : 'AI Assistant đã sẵn sàng hỗ trợ tra cứu tri thức!'
              );
            }}
            className="px-3 py-1.5 rounded-lg bg-white text-purple-950 font-bold hover:bg-purple-100 transition-colors shrink-0 cursor-pointer"
          >
            {isEn ? 'Ask AI Copilot' : 'Hỏi Trợ Lý AI'}
          </button>
        </div>
      );
    case 'commerce':
    default:
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="font-bold text-sky-300 text-sm">{isEn ? 'Instant' : 'Tức Thì'}</div>
            <div className="text-[10px] text-white/75">
              {isEn ? 'POS Checkout' : 'Thanh toán quầy'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="font-bold text-emerald-300 text-sm">CRM / ERP</div>
            <div className="text-[10px] text-white/75">
              {isEn ? 'Stock Sync' : 'Đồng bộ tồn kho'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 p-2.5 rounded-xl">
            <div className="font-bold text-amber-300 text-sm">PCI-DSS</div>
            <div className="text-[10px] text-white/75">99.99% Uptime</div>
          </div>
        </div>
      );
  }
};

export interface SystemBentoCardProps {
  sys: SystemData;
  isEn: boolean;
  isExpanded: boolean;
  hasAnyExpanded?: boolean;
  onToggleExpand: (id: string) => void;
  onCollapse: () => void;
  showToast: (msg: string) => void;
  cardRef?: (el: HTMLElement | null) => void;
}

export const SystemBentoCard: React.FC<SystemBentoCardProps> = ({
  sys,
  isEn,
  isExpanded,
  hasAnyExpanded = false,
  onToggleExpand,
  onCollapse,
  showToast,
  cardRef,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const bentoStyle = BENTO_SYSTEM_STYLES[sys.id] || BENTO_SYSTEM_STYLES.sdp;
  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);
  const fullVideoRef = useRef<HTMLVideoElement | null>(null);
  const thumbImgRef = useRef<HTMLImageElement | null>(null);

  const [isThumbHovered, setIsThumbHovered] = useState(false);
  const [isVideoFull, setIsVideoFull] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [inlineVideoStyle, setInlineVideoStyle] = useState<React.CSSProperties>({});
  const [inlineVideoFit, setInlineVideoFit] = useState<'object-cover' | 'object-contain'>(
    'object-contain'
  );

  const displayName = isEn ? sys.nameEn || sys.name : sys.nameVi || sys.name;
  const displayDesc = isEn
    ? sys.descEn || sys.description
    : sys.descVi || sys.description;
  const displayFullName = sys.nameEn || sys.fullName || sys.name;
  const displayFeatures =
    (isEn ? sys.features : sys.featuresVi || sys.features) || [];
  const badgeText = sys.code || sys.abbr || sys.badge;

  const smartAlignInlineVideo = useCallback(() => {
    const videoEl = inlineVideoRef.current;
    const imgEl = thumbImgRef.current;
    if (!videoEl || !imgEl) return;

    const imgRect = imgEl.getBoundingClientRect();
    const parentRect = imgEl.parentElement?.getBoundingClientRect();

    if (imgRect.width > 0 && imgRect.height > 0 && parentRect && parentRect.width > 0) {
      setInlineVideoStyle({
        left: `${imgRect.left - parentRect.left}px`,
        top: `${imgRect.top - parentRect.top}px`,
        width: `${imgRect.width}px`,
        height: `${imgRect.height}px`,
      });
    }

    if (videoEl.videoWidth && videoEl.videoHeight && imgRect.width && imgRect.height) {
      const videoRatio = videoEl.videoWidth / videoEl.videoHeight;
      const imgRatio = imgRect.width / imgRect.height;
      setInlineVideoFit(
        Math.abs(videoRatio - imgRatio) < 0.35 ? 'object-cover' : 'object-contain'
      );
    }
  }, []);

  const handleThumbMouseEnter = () => {
    if (isVideoFull || !sys.videoUrl) return;
    setIsThumbHovered(true);
    smartAlignInlineVideo();
    if (inlineVideoRef.current) {
      inlineVideoRef.current.play().catch(() => {});
    }
  };

  const handleThumbMouseLeave = () => {
    setIsThumbHovered(false);
    if (inlineVideoRef.current) {
      inlineVideoRef.current.pause();
    }
  };

  const enterFullCardVideo = useCallback(() => {
    if (!sys.videoUrl) return;
    SoundEngine.playTap();
    setIsVideoFull(true);
    setIsThumbHovered(false);
    if (inlineVideoRef.current) inlineVideoRef.current.pause();
    if (fullVideoRef.current) {
      fullVideoRef.current.currentTime = 0;
      fullVideoRef.current.play().catch(() => {});
    }
  }, [sys.videoUrl]);

  const exitFullCardVideo = useCallback(() => {
    SoundEngine.playTap();
    setIsVideoFull(false);
    if (fullVideoRef.current) {
      fullVideoRef.current.pause();
    }
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isVideoFull) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('.card-thumb-btn')
    ) {
      return;
    }
    SoundEngine.playTap();
    onToggleExpand(sys.id);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Escape' && isVideoFull) {
      e.preventDefault();
      exitFullCardVideo();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isVideoFull) {
        exitFullCardVideo();
      } else {
        SoundEngine.playTap();
        onToggleExpand(sys.id);
      }
    }
  };

  const layoutTransition = getExpandCardLayoutTransition(prefersReducedMotion);
  const settleTransition = getCardSettleTransition(prefersReducedMotion);
  const isSiblingDimmed = hasAnyExpanded && !isExpanded;

  return (
    <motion.article
      layout
      ref={cardRef}
      id={`systems-card-${sys.id}`}
      data-element-name={`Thẻ hệ thống ${sys.abbr}`}
      data-element-type="card"
      data-section-card="true"
      data-expand-motion="true"
      data-element-page="systems"
      data-element-parent="systems-cards-grid"
      data-multicolor-bento="true"
      data-system-bento-studio="true"
      data-expanded={isExpanded ? 'true' : 'false'}
      data-video-full={isVideoFull ? 'true' : 'false'}
      data-thumb-hover={isThumbHovered ? 'true' : 'false'}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      animate={
        isSiblingDimmed
          ? { opacity: 0.78, scale: prefersReducedMotion ? 1 : 0.982 }
          : { opacity: 1, scale: 1 }
      }
      whileHover={
        !isExpanded && !prefersReducedMotion
          ? { y: -8, scale: 1.02 }
          : undefined
      }
      whileTap={
        !isExpanded && !prefersReducedMotion
          ? { y: -2, scale: 0.992 }
          : undefined
      }
      transition={{
        layout: layoutTransition,
        opacity: { duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] },
        scale: settleTransition,
        y: settleTransition,
      }}
      style={
        {
          '--theme-color': sys.themeColor || '#38bdf8',
          '--badge-dark': bentoStyle.badgeTextColor,
          '--sys-bento-bg': bentoStyle.cardBg,
          '--sys-bento-accent': bentoStyle.accentText,
          background: bentoStyle.cardBg,
          backgroundImage: bentoStyle.cardBg,
          zIndex: isExpanded ? 20 : 1,
        } as React.CSSProperties
      }
      className={`sys-bento-studio-card system-card bento-card ${
        isExpanded
          ? 'sm:col-span-2 lg:col-span-3 ring-2 ring-purple-400/50 p-4 sm:p-5 justify-start'
          : 'h-full min-h-[154px] sm:min-h-[164px] p-3.5 sm:px-4 sm:py-3.5 justify-between'
      } relative text-white cursor-pointer flex flex-col text-left`}
    >
      {/* Video toàn thẻ khi nhấp vào hình minh họa */}
      {sys.videoUrl && (
        <>
          <div
            onClick={(e) => {
              if (isVideoFull) {
                e.stopPropagation();
                exitFullCardVideo();
              }
            }}
            className={`card-video-wrapper absolute inset-0 overflow-hidden rounded-[14px] ${
              isVideoFull
                ? 'opacity-100 z-20 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <video
              ref={fullVideoRef}
              src={sys.videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              className="w-full h-full object-cover scale-200 origin-center"
            />
          </div>

          {isVideoFull && (
            <button
              type="button"
              title={isEn ? 'Exit video' : 'Thoát video'}
              aria-label={isEn ? 'Exit video' : 'Thoát video'}
              onClick={(e) => {
                e.stopPropagation();
                exitFullCardVideo();
              }}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      {/* Lớp chuyển màu nền sang màu trắng khi rê chuột vào hình */}
      <div className="card-video-bg-sync" />

      {/* Top: Icon và Tên hệ thống chiếm trọn 1 hàng ngang phía trên cùng */}
      <motion.div
        layout="position"
        transition={{ layout: layoutTransition }}
        className={`card-header-top relative z-10 w-full ${
          isExpanded ? 'pb-2.5 mb-2.5' : 'pb-2 mb-2'
        } border-b border-white/15 flex items-center justify-between gap-2 ${
          isVideoFull ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        <h3
          className="flex items-center gap-2 text-sm sm:text-base font-bold leading-snug min-w-0 m-0 font-play"
          style={{ color: bentoStyle.accentText }}
          title={displayName}
        >
          <SystemIcon
            iconName={sys.iconName}
            className="sys-icon w-4 h-4 sm:w-5 sm:h-5 shrink-0"
            style={{ color: bentoStyle.accentText }}
          />
          <span className="truncate">{displayName}</span>
        </h3>
        <span className="sys-category-pill text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/25 text-white/85 border border-white/10 shrink-0">
          {sys.category}
        </span>
      </motion.div>

      {/* Thân thẻ ngang hình chữ nhật: Bên trái hình minh họa chữ nhật, Bên phải mô tả + Bottom Meta gọn 1 hàng */}
      <motion.div
        layout="position"
        transition={{ layout: layoutTransition }}
        className={`card-body-row relative z-10 flex-1 min-h-0 flex flex-row items-center gap-3.5 ${
          isVideoFull ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        {/* Cột trái (Khung chữ nhật ngang): Hình minh họa + video inline khi hover */}
        <div
          role={sys.videoUrl ? 'button' : undefined}
          tabIndex={sys.videoUrl ? 0 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            if (isVideoFull) {
              exitFullCardVideo();
            } else {
              enterFullCardVideo();
            }
          }}
          onKeyDown={(e) => {
            if (!sys.videoUrl) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              if (isVideoFull) {
                exitFullCardVideo();
              } else {
                enterFullCardVideo();
              }
            }
          }}
          onMouseEnter={handleThumbMouseEnter}
          onMouseLeave={handleThumbMouseLeave}
          title={isEn ? 'Click to watch full-card video' : 'Nhấp để xem video toàn thẻ'}
          aria-label={
            isEn ? `Play ${sys.abbr} video` : `Xem video toàn thẻ ${sys.abbr}`
          }
          className={`card-thumb-btn relative z-20 ${
            isExpanded
              ? 'w-[42%] h-40 sm:h-44'
              : 'w-[38%] max-w-[136px] h-[94px] sm:h-[104px]'
          } flex items-center justify-center shrink-0 overflow-hidden rounded-xl`}
        >
          {!imgFailed && sys.imageUrl ? (
            <img
              ref={thumbImgRef}
              src={sys.imageUrl}
              alt={sys.abbr}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onLoad={smartAlignInlineVideo}
              onError={() => setImgFailed(true)}
              className={`card-thumb-img w-full h-full object-contain select-none ${
                isThumbHovered ? 'opacity-0' : 'opacity-100'
              }`}
            />
          ) : (
            <div className="w-14 h-14 text-white flex items-center justify-center">
              <SystemIcon iconName={sys.iconName} className="w-7 h-7" />
            </div>
          )}

          {/* Video phát ngay tại vị trí hình khi rê chuột vào hình (phóng to gấp 2 lần) */}
          {sys.videoUrl && (
            <video
              ref={inlineVideoRef}
              src={sys.videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              onLoadedMetadata={smartAlignInlineVideo}
              style={{
                ...inlineVideoStyle,
                transform: 'scale(2)',
                transformOrigin: 'center center',
              }}
              className={`card-inline-video absolute inset-0 w-full h-full ${inlineVideoFit} pointer-events-none ${
                isThumbHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Cột phải: Mô tả 2-3 hàng & Tên viết tắt / Tên đầy đủ gọn 1 hàng ở Bottom */}
        <div className="card-content flex-1 h-full flex flex-col justify-between gap-1.5 min-w-0">
          <p
            className={`sys-desc-copy text-white font-medium text-xs sm:text-[13px] leading-snug m-0 ${
              isExpanded ? '' : 'line-clamp-2 sm:line-clamp-3'
            }`}
          >
            {displayDesc}
          </p>

          {/* Bottom: Tên viết tắt bên trái và Tên đầy đủ bên phải trên 1 hàng gọn */}
          <div className="sys-bottom-meta pt-1.5 mt-auto border-t border-white/15 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 min-w-0">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: bentoStyle.accentText }}
              />
              <span
                className="sys-abbr-badge text-[10px] font-bold uppercase tracking-wider truncate"
                style={{ color: bentoStyle.accentText }}
              >
                {badgeText}
              </span>
            </div>
            <div
              className="sys-fullname-copy text-[11px] font-medium text-white/95 leading-tight truncate m-0 text-right"
              title={displayFullName}
            >
              {displayFullName}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Nội dung chi tiết chuẩn Bento Studio khi thẻ bung rộng gấp 4 lần */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`expanded-details-${sys.id}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] } }
            }
            transition={getExpandDetailRevealTransition(prefersReducedMotion, false)}
            className={`card-expanded-details relative z-10 mt-3.5 pt-3.5 border-t border-white/15 flex flex-col gap-3.5 ${
              isVideoFull ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
          {/* Widget Bento phân tích chức năng chuyên biệt từng phân hệ */}
          <ExpandedBentoModule
            sys={sys}
            bentoStyle={bentoStyle}
            isEn={isEn}
            showToast={showToast}
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="sys-section-label text-xs font-bold uppercase tracking-wider"
                style={{ color: bentoStyle.accentText }}
              >
                {isEn ? 'Features & Operating Metrics' : 'Tính năng & Chỉ số vận hành'}
              </span>
              {sys.metrics && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/30 text-white border border-white/15">
                  {sys.metrics}
                </span>
              )}
            </div>
            <ul className="space-y-1.5 bg-black/20 border border-white/10 rounded-xl p-3 m-0 list-none">
              {displayFeatures.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90"
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: bentoStyle.accentText }}
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15">
            <div className="flex flex-wrap items-center gap-2">
              {sys.url ? (
                <a
                  href={sys.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-950 hover:bg-gray-100 text-xs font-bold shadow-lg no-underline"
                >
                  <span>{isEn ? 'Open System' : 'Truy cập hệ thống'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/35 text-amber-300 border border-amber-400/30 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{isEn ? 'Finalizing integration' : 'Đang hoàn thiện tích hợp'}</span>
                </span>
              )}

              {sys.videoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    enterFullCardVideo();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isEn ? 'Watch Video' : 'Xem Video'}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playTap();
                onCollapse();
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 text-xs font-bold cursor-pointer"
            >
              <span>{isEn ? 'Collapse' : 'Thu gọn'}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default SystemBentoCard;
