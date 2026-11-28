'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
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
  ArrowLeftRight,
  Play,
  Clock,
  CheckCircle2,
  Minimize2,
  X,
  Activity,
  Server,
  ShieldCheck,
  Network,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  ChevronDown,
} from 'lucide-react';
import { SystemData } from '@/types';
import { BlurUpImage } from '@/components/ui/BlurUpImage';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { WebIcon } from '@/components/ui/WebIcon';
import { useTheme } from '@/hooks/useTheme';
import { getSavedMutedPref, saveMutedPref, AUDIO_PREF_EVENT } from '@/utils/audioPreference';
import {
  getExpandCardLayoutTransition,
  getCardSettleTransition,
  getExpandDetailRevealTransition,
} from '@/components/ui/ExpandCardMotion';
import {
  SYSTEM_TECH_SPECS_MAP,
  SYSTEM_CONNECTIONS_MAP,
  SYSTEM_DESIGN_MAP,
  getRealtimeFlowDescription,
} from './systemsMeta';

export interface SystemBentoStyleConfig {
  cardBg: string;
  darkCardBg: string;
  borderTint: string;
  accentText: string;
  darkAccentText: string;
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
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #fffbeb 100%)',
    darkCardBg: 'linear-gradient(135deg, #d97706 0%, #92400e 52%, #1e1b4b 100%)',
    borderTint: 'rgba(217, 119, 6, 0.24)',
    accentText: '#b45309',
    darkAccentText: '#fde047',
    badgeTextColor: '#92400e',
    pillBg: 'rgba(217, 119, 6, 0.10)',
    archetype: 'portal',
  },
  erp: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #f0fdfa 100%)',
    darkCardBg: 'linear-gradient(135deg, #0d9488 0%, #115e59 55%, #0f172a 100%)',
    borderTint: 'rgba(13, 148, 136, 0.24)',
    accentText: '#0f766e',
    darkAccentText: '#5eead4',
    badgeTextColor: '#0f766e',
    pillBg: 'rgba(13, 148, 136, 0.10)',
    archetype: 'stats',
  },
  crm: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #fff1f2 100%)',
    darkCardBg: 'linear-gradient(135deg, #e11d48 0%, #9f1239 55%, #3b0764 100%)',
    borderTint: 'rgba(225, 29, 72, 0.24)',
    accentText: '#be123c',
    darkAccentText: '#fda4af',
    badgeTextColor: '#be123c',
    pillBg: 'rgba(225, 29, 72, 0.10)',
    archetype: 'social',
  },
  hrm: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #eff6ff 100%)',
    darkCardBg: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 58%, #0f172a 100%)',
    borderTint: 'rgba(37, 99, 235, 0.24)',
    accentText: '#1d4ed8',
    darkAccentText: '#93c5fd',
    badgeTextColor: '#1e40af',
    pillBg: 'rgba(37, 99, 235, 0.10)',
    archetype: 'team',
  },
  bpm: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #fff7ed 100%)',
    darkCardBg: 'linear-gradient(135deg, #ea580c 0%, #9a3412 58%, #1c1917 100%)',
    borderTint: 'rgba(234, 88, 12, 0.24)',
    accentText: '#c2410c',
    darkAccentText: '#fdba74',
    badgeTextColor: '#c2410c',
    pillBg: 'rgba(234, 88, 12, 0.10)',
    archetype: 'roadmap',
  },
  okr: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #f7fee7 100%)',
    darkCardBg: 'linear-gradient(135deg, #4d7c0f 0%, #14532d 58%, #0f172a 100%)',
    borderTint: 'rgba(101, 163, 13, 0.24)',
    accentText: '#3f6212',
    darkAccentText: '#bef264',
    badgeTextColor: '#3f6212',
    pillBg: 'rgba(101, 163, 13, 0.10)',
    archetype: 'progress',
  },
  clp: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #ecfeff 100%)',
    darkCardBg: 'linear-gradient(135deg, #0f766e 0%, #164e63 58%, #090d16 100%)',
    borderTint: 'rgba(8, 145, 178, 0.24)',
    accentText: '#0e7490',
    darkAccentText: '#67e8f9',
    badgeTextColor: '#0f766e',
    pillBg: 'rgba(8, 145, 178, 0.10)',
    archetype: 'tiers',
  },
  lms: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #eef2ff 100%)',
    darkCardBg: 'linear-gradient(135deg, #2563eb 0%, #3730a3 58%, #1e1b4b 100%)',
    borderTint: 'rgba(79, 70, 229, 0.24)',
    accentText: '#3730a3',
    darkAccentText: '#bfdbfe',
    badgeTextColor: '#1d4ed8',
    pillBg: 'rgba(79, 70, 229, 0.10)',
    archetype: 'learning',
  },
  csc: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #fff7ed 100%)',
    darkCardBg: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 58%, #18181b 100%)',
    borderTint: 'rgba(194, 65, 12, 0.24)',
    accentText: '#9a3412',
    darkAccentText: '#fed7aa',
    badgeTextColor: '#c2410c',
    pillBg: 'rgba(194, 65, 12, 0.10)',
    archetype: 'kanban',
  },
  bi: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #f5f3ff 100%)',
    darkCardBg: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 55%, #0f172a 100%)',
    borderTint: 'rgba(109, 40, 217, 0.24)',
    accentText: '#6d28d9',
    darkAccentText: '#ddd6fe',
    badgeTextColor: '#6d28d9',
    pillBg: 'rgba(109, 40, 217, 0.10)',
    archetype: 'chart',
  },
  ai: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #fdf4ff 100%)',
    darkCardBg: 'linear-gradient(135deg, #5b21b6 0%, #86198f 55%, #1e1b4b 100%)',
    borderTint: 'rgba(162, 28, 175, 0.24)',
    accentText: '#86198f',
    darkAccentText: '#f5d0fe',
    badgeTextColor: '#4c1d95',
    pillBg: 'rgba(162, 28, 175, 0.10)',
    archetype: 'ai',
  },
  pos: {
    cardBg: 'linear-gradient(155deg, #ffffff 0%, #f0f9ff 100%)',
    darkCardBg: 'linear-gradient(135deg, #0284c7 0%, #1e40af 58%, #0f172a 100%)',
    borderTint: 'rgba(2, 132, 199, 0.24)',
    accentText: '#0369a1',
    darkAccentText: '#7dd3fc',
    badgeTextColor: '#0369a1',
    pillBg: 'rgba(2, 132, 199, 0.10)',
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
  isDark: boolean;
  isEn: boolean;
  showToast: (msg: string) => void;
}> = ({ sys, bentoStyle, isDark, isEn, showToast }) => {
  const tileBoxCls = isDark
    ? 'bg-black/30 border border-white/12'
    : 'bg-white/90 border border-slate-200/85 shadow-xs';
  const mainInkCls = isDark ? 'text-white' : 'text-slate-900';
  const mutedInkCls = isDark ? 'text-white/75' : 'text-slate-600';

  switch (bentoStyle.archetype) {
    case 'portal':
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['CRM 360°', 'ERP Ledger', 'HRM Core', 'AI Agent'].map((mod) => (
            <div
              key={mod}
              className={`${tileBoxCls} rounded-xl p-2 text-center transition-colors`}
            >
              <div className={`text-xs font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                {mod}
              </div>
              <div className={`text-[10px] mt-0.5 ${mutedInkCls}`}>
                {isEn ? 'SSO Connected' : 'SSO Kết nối'}
              </div>
            </div>
          ))}
        </div>
      );
    case 'stats':
      return (
        <div className={`${tileBoxCls} rounded-xl p-2.5`}>
          <div className="flex justify-between gap-2 text-xs font-bold mb-1.5">
            <span className={isDark ? 'text-teal-200' : 'text-teal-800'}>
              {isEn ? 'Resource & Finance Allocation' : 'Phân Bổ Nguồn Lực & Tài Chính'}
            </span>
            <span className={`shrink-0 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              {sys.metrics}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden flex gap-0.5 ${isDark ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="bg-teal-500 h-full w-[42%]" title={isEn ? 'Accounting' : 'Kế toán'} />
            <div className="bg-cyan-500 h-full w-[33%]" title={isEn ? 'Warehouse' : 'Kho vận'} />
            <div className="bg-amber-400 h-full w-[25%]" title={isEn ? 'Assets' : 'Tài sản'} />
          </div>
          <div className={`flex flex-wrap gap-3 mt-1.5 text-[11px] ${mutedInkCls}`}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-teal-500" />
              {isEn ? 'Finance 42%' : 'Tài chính 42%'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-cyan-500" />
              {isEn ? 'Procurement & Stock 33%' : 'Mua hàng & Kho 33%'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-amber-400" />
              {isEn ? 'Assets 25%' : 'Tài sản 25%'}
            </span>
          </div>
        </div>
      );
    case 'social':
      return (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`text-sm sm:text-base font-bold ${mainInkCls}`}>360°</div>
            <div className={`text-[10px] font-semibold ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>
              {isEn ? 'Unified Profile' : 'Hồ Sơ Tập Trung'}
            </div>
          </div>
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>+45%</div>
            <div className={`text-[10px] font-semibold ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>
              {isEn ? 'CSAT Score' : 'Chỉ Số CSAT'}
            </div>
          </div>
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>Real-time</div>
            <div className={`text-[10px] font-semibold ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>
              {isEn ? 'CX Journey' : 'Hành Trình CX'}
            </div>
          </div>
        </div>
      );
    case 'team':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className={`${tileBoxCls} p-2.5 rounded-xl flex items-center justify-between`}>
            <span className={isDark ? 'text-blue-200' : 'text-slate-700 font-semibold'}>
              {isEn ? 'Schedule Adherence' : 'Tuân thủ lịch ca'}
            </span>
            <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>95%</span>
          </div>
          <div className={`${tileBoxCls} p-2.5 rounded-xl flex items-center justify-between`}>
            <span className={isDark ? 'text-blue-200' : 'text-slate-700 font-semibold'}>
              {isEn ? 'HR Lifecycle' : 'Chu trình nhân sự'}
            </span>
            <span className={`font-bold ${isDark ? 'text-sky-300' : 'text-blue-700'}`}>
              {isEn ? 'Hire → Payroll' : 'Tuyển dụng → Lương'}
            </span>
          </div>
        </div>
      );
    case 'roadmap':
      return (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`${isDark ? 'bg-black/30 border-emerald-400/30' : 'bg-emerald-50/90 border-emerald-200'} border p-2 rounded-xl`}>
            <div className={`text-[10px] font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              {isEn ? 'Step 01' : 'Bước 01'}
            </div>
            <div className={`font-bold mt-0.5 ${mainInkCls}`}>
              {isEn ? 'Digital Forms' : 'Số hóa biểu mẫu'}
            </div>
          </div>
          <div className={`${isDark ? 'bg-black/30 border-amber-400/30' : 'bg-amber-50/90 border-amber-200'} border p-2 rounded-xl`}>
            <div className={`text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {isEn ? 'Step 02' : 'Bước 02'}
            </div>
            <div className={`font-bold mt-0.5 ${mainInkCls}`}>
              {isEn ? 'Auto Approval' : 'Phê duyệt tự động'}
            </div>
          </div>
          <div className={`${isDark ? 'bg-black/30 border-sky-400/30' : 'bg-sky-50/90 border-sky-200'} border p-2 rounded-xl`}>
            <div className={`text-[10px] font-bold ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
              {isEn ? 'Step 03' : 'Bước 03'}
            </div>
            <div className={`font-bold mt-0.5 ${mainInkCls}`}>
              {isEn ? 'Cross-Team Flow' : 'Tối ưu liên phòng'}
            </div>
          </div>
        </div>
      );
    case 'progress':
      return (
        <div className={`${tileBoxCls} rounded-xl p-2.5 space-y-1.5 text-xs`}>
          <div className="flex justify-between font-bold">
            <span className={isDark ? 'text-lime-200' : 'text-lime-900'}>
              {isEn ? 'Goal Alignment & Transparency' : 'Mức độ minh bạch & liên kết mục tiêu'}
            </span>
            <span className={isDark ? 'text-lime-300' : 'text-lime-700'}>100%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="bg-gradient-to-r from-lime-500 to-emerald-500 h-full rounded-full w-full" />
          </div>
        </div>
      );
    case 'tiers':
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`font-bold ${isDark ? 'text-teal-200' : 'text-teal-800'}`}>
              {isEn ? 'Member' : 'Thành Viên'}
            </div>
            <div className={`text-[10px] mt-0.5 ${mutedInkCls}`}>
              {isEn ? 'Base points' : 'Tích điểm cơ bản'}
            </div>
          </div>
          <div className={`${isDark ? 'bg-teal-500/20 border-teal-300/40' : 'bg-amber-50 border-amber-200'} border p-2 rounded-xl`}>
            <div className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {isEn ? 'Gold Tier' : 'Hạng Vàng'}
            </div>
            <div className={`text-[10px] mt-0.5 ${mutedInkCls}`}>
              {isEn ? '2x Voucher perks' : 'Voucher ưu đãi x2'}
            </div>
          </div>
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
              {isEn ? 'Diamond' : 'Kim Cương'}
            </div>
            <div className={`text-[10px] mt-0.5 ${mutedInkCls}`}>
              {isEn ? '+32 NPS Score' : '+32 Điểm NPS'}
            </div>
          </div>
        </div>
      );
    case 'learning':
      return (
        <div className={`${tileBoxCls} rounded-xl p-2.5 text-xs`}>
          <div className="flex justify-between gap-2 mb-1.5">
            <span className={`font-bold ${isDark ? 'text-blue-200' : 'text-indigo-900'}`}>
              {isEn
                ? 'Accelerated Employee Onboarding'
                : 'Hiệu quả rút ngắn thời gian đào tạo hội nhập'}
            </span>
            <span className={`font-bold shrink-0 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              -50% Onboarding
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full w-[85%]" />
          </div>
        </div>
      );
    case 'kanban':
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`text-sm sm:text-base font-bold ${mainInkCls}`}>{isEn ? 'Multi' : 'Đa Kênh'}</div>
            <div className={`text-[10px] font-semibold ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
              Omnichannel
            </div>
          </div>
          <div className={`${isDark ? 'bg-black/30 border-emerald-400/30' : 'bg-emerald-50/90 border-emerald-200'} border p-2 rounded-xl`}>
            <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>85% FCR</div>
            <div className={`text-[10px] font-semibold ${isDark ? 'text-orange-200' : 'text-emerald-700'}`}>
              {isEn ? 'First Contact' : 'Giải quyết ngay'}
            </div>
          </div>
          <div className={`${isDark ? 'bg-black/30 border-amber-400/30' : 'bg-amber-50/90 border-amber-200'} border p-2 rounded-xl`}>
            <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>99.98%</div>
            <div className={`text-[10px] font-semibold ${isDark ? 'text-orange-200' : 'text-amber-700'}`}>
              {isEn ? 'SLA Target' : 'Cam kết SLA'}
            </div>
          </div>
        </div>
      );
    case 'chart':
      return (
        <div className={`${tileBoxCls} rounded-xl p-2.5`}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`font-bold ${isDark ? 'text-purple-200' : 'text-violet-900'}`}>
              Real-time Wallboard Analytics
            </span>
            <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              100% Data-Driven
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-10">
            <div className="flex-1 bg-purple-400/45 rounded-t h-2/5" />
            <div className="flex-1 bg-purple-400/60 rounded-t h-3/5" />
            <div className="flex-1 bg-purple-500/70 rounded-t h-1/2" />
            <div className="flex-1 bg-purple-500/80 rounded-t h-4/5" />
            <div className="flex-1 bg-indigo-500/90 rounded-t h-3/4" />
            <div className="flex-1 bg-gradient-to-t from-violet-600 to-fuchsia-400 rounded-t h-full" />
          </div>
        </div>
      );
    case 'ai':
      return (
        <div className={`${tileBoxCls} rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs`}>
          <div className={`flex items-center gap-2 font-semibold ${isDark ? 'text-fuchsia-200' : 'text-fuchsia-900'}`}>
            <Cpu className={`w-4 h-4 shrink-0 ${isDark ? 'text-fuchsia-300' : 'text-fuchsia-700'}`} />
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
            className={`px-3 py-1 rounded-lg font-bold transition-colors shrink-0 cursor-pointer ${
              isDark
                ? 'bg-white text-purple-950 hover:bg-purple-100'
                : 'bg-purple-700 text-white hover:bg-purple-800 shadow-xs'
            }`}
          >
            {isEn ? 'Ask AI Copilot' : 'Hỏi Trợ Lý AI'}
          </button>
        </div>
      );
    case 'commerce':
    default:
      return (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`font-bold text-sm ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
              {isEn ? 'Instant' : 'Tức Thì'}
            </div>
            <div className={`text-[10px] ${mutedInkCls}`}>
              {isEn ? 'POS Checkout' : 'Thanh toán quầy'}
            </div>
          </div>
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`font-bold text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              CRM / ERP
            </div>
            <div className={`text-[10px] ${mutedInkCls}`}>
              {isEn ? 'Stock Sync' : 'Đồng bộ tồn kho'}
            </div>
          </div>
          <div className={`${tileBoxCls} p-2 rounded-xl`}>
            <div className={`font-bold text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              PCI-DSS
            </div>
            <div className={`text-[10px] ${mutedInkCls}`}>99.99% Uptime</div>
          </div>
        </div>
      );
  }
};

export interface SystemBentoCardProps {
  sys: SystemData;
  allSystems: SystemData[];
  isEn: boolean;
  isExpanded: boolean;
  hasAnyExpanded?: boolean;
  expandedSixCardHeight?: number;
  onToggleExpand: (id: string) => void;
  onCollapse: () => void;
  onSelectSystem: (id: string) => void;
  onOpenDiagram: () => void;
  showToast: (msg: string) => void;
  cardRef?: (el: HTMLElement | null) => void;
}

export const SystemBentoCard: React.FC<SystemBentoCardProps> = ({
  sys,
  allSystems,
  isEn,
  isExpanded,
  hasAnyExpanded = false,
  expandedSixCardHeight,
  onToggleExpand,
  onCollapse,
  onSelectSystem,
  onOpenDiagram,
  showToast,
  cardRef,
}) => {
  const { isDark } = useTheme();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const bentoStyle = BENTO_SYSTEM_STYLES[sys.id] || BENTO_SYSTEM_STYLES.sdp;
  const designMeta = SYSTEM_DESIGN_MAP[sys.id] || SYSTEM_DESIGN_MAP.sdp;
  const techSpec = SYSTEM_TECH_SPECS_MAP[sys.id] || SYSTEM_TECH_SPECS_MAP.sdp;
  const connections = SYSTEM_CONNECTIONS_MAP[sys.id] || ['sdp', 'crm'];

  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);
  const fullVideoRef = useRef<HTMLVideoElement | null>(null);
  const expandedDemoVideoRef = useRef<HTMLVideoElement | null>(null);
  const thumbImgRef = useRef<HTMLImageElement | null>(null);

  const [isThumbHovered, setIsThumbHovered] = useState(false);
  const [isVideoFull, setIsVideoFull] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [inlineVideoStyle, setInlineVideoStyle] = useState<React.CSSProperties>({});
  const [inlineVideoFit, setInlineVideoFit] = useState<'object-cover' | 'object-contain'>(
    'object-contain'
  );

  // Merged Detail States (when expanded inside the 6-card Bento container)
  const [detailTab, setDetailTab] = useState<'all' | 'overview' | 'arch' | 'sync'>('all');
  const [isExpandedVideoMuted, setIsExpandedVideoMuted] = useState<boolean>(() =>
    getSavedMutedPref(true)
  );
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedQrUrl, setCopiedQrUrl] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareTargetId, setCompareTargetId] = useState<string>(
    connections.find((cId) => cId !== sys.id) || (sys.id === 'sdp' ? 'crm' : 'sdp')
  );
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(
    connections[0] || null
  );

  // Sync audio mute preference across tabs/players
  useEffect(() => {
    const handleAudioPref = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.muted === 'boolean') {
        setIsExpandedVideoMuted(customEvent.detail.muted);
      }
    };
    window.addEventListener(AUDIO_PREF_EVENT, handleAudioPref);
    return () => window.removeEventListener(AUDIO_PREF_EVENT, handleAudioPref);
  }, []);

  // Reset detail drawers cleanly when card collapses or switches system
  useEffect(() => {
    if (!isExpanded) {
      setIsQrOpen(false);
      setIsCompareOpen(false);
      setDetailTab('all');
      return;
    }
    const defaultConns = SYSTEM_CONNECTIONS_MAP[sys.id] || ['sdp', 'crm'];
    setSelectedConnectionId(defaultConns[0] || null);
    setCompareTargetId(
      defaultConns.find((cId) => cId !== sys.id) || (sys.id === 'sdp' ? 'crm' : 'sdp')
    );
    if (expandedDemoVideoRef.current && sys.videoUrl) {
      expandedDemoVideoRef.current.muted = isExpandedVideoMuted;
      expandedDemoVideoRef.current.play().catch(() => {});
    }
  }, [isExpanded, sys.id, sys.videoUrl, isExpandedVideoMuted]);

  // Generate dynamic QR Code when QR panel is toggled inside expanded card
  useEffect(() => {
    if (!isExpanded || !isQrOpen) return;
    const targetUrl =
      sys.url ||
      (typeof window !== 'undefined' ? window.location.href : 'https://powerservice.one');
    let active = true;
    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 2,
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
  }, [isExpanded, isQrOpen, sys.url]);

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
    if (isVideoFull || !sys.videoUrl || isExpanded) return;
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

  const handleCopyPortalUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedQrUrl(true);
      showToast(isEn ? 'System URL copied!' : 'Đã sao chép đường dẫn truy cập hệ thống!');
      window.setTimeout(() => setCopiedQrUrl(false), 1800);
    } catch {
      showToast(isEn ? 'Unable to copy URL' : 'Không thể sao chép liên kết lúc này');
    }
  };

  const handleOpenExternalUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!url || url === '#') {
      showToast(
        isEn
          ? 'BI Dashboard API integration is being finalized.'
          : 'Hệ thống BI Dashboard đang hoàn thiện tích hợp API thời gian thực!'
      );
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isVideoFull) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('.card-thumb-btn') ||
      (isExpanded && target.closest('.card-expanded-details'))
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

  const activeAccent = isDark ? bentoStyle.darkAccentText : bentoStyle.accentText;
  const activeBg = isDark ? bentoStyle.darkCardBg : bentoStyle.cardBg;
  const dividerBorderCls = isDark ? 'border-white/15' : 'border-slate-900/10';
  const subtileBoxCls = isDark
    ? 'bg-black/28 border border-white/14 text-white'
    : 'bg-white/88 border border-slate-200/90 text-slate-900 shadow-2xs';
  const subtileMutedCls = isDark ? 'text-white/75' : 'text-slate-600';
  const subtileHeadingCls = isDark ? 'text-white' : 'text-slate-900';

  const compareTargetSystem =
    allSystems.find((s) => s.id === compareTargetId && s.id !== sys.id) ||
    allSystems.find((s) => s.id !== sys.id) ||
    sys;

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
          ? { opacity: 0.78, scale: prefersReducedMotion ? 1 : 0.985 }
          : isExpanded
            ? { opacity: 1, scale: prefersReducedMotion ? 1 : [0.97, 1.01, 1] }
            : { opacity: 1, scale: 1 }
      }
      whileHover={
        !isExpanded && !prefersReducedMotion
          ? { y: -6, scale: 1.015 }
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
        scale: {
          type: 'spring',
          stiffness: isExpanded ? 280 : 320,
          damping: 22,
          mass: 0.85,
        },
        y: settleTransition,
      }}
      style={
        {
          '--theme-color': sys.themeColor || '#38bdf8',
          '--badge-dark': bentoStyle.badgeTextColor,
          '--sys-bento-bg': activeBg,
          '--sys-bento-accent': activeAccent,
          '--sys-bento-border': bentoStyle.borderTint,
          ...(isExpanded && expandedSixCardHeight
            ? { '--sys-expanded-height': `${expandedSixCardHeight}px` }
            : {}),
          background: activeBg,
          backgroundImage: activeBg,
          zIndex: isExpanded ? 20 : 1,
        } as React.CSSProperties
      }
      className={`sys-bento-studio-card system-card bento-card ${
        isExpanded
          ? 'sm:col-span-2 sm:row-span-3 lg:col-span-3 lg:row-span-2 ring-2 ring-indigo-500/40 p-4 sm:p-5 justify-start'
          : 'h-full min-h-[154px] sm:min-h-[164px] p-3.5 sm:px-4 sm:py-3.5 justify-between'
      } relative ${isDark ? 'text-white' : 'text-slate-900'} cursor-pointer flex flex-col text-left`}
    >
      {/* Video toàn thẻ khi nhấp vào hình minh họa hoặc nút Xem Video */}
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
                ? 'opacity-100 z-30 pointer-events-auto'
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
              className="w-full h-full object-cover origin-center"
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
              className="absolute top-3 right-3 z-40 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      {/* Lớp chuyển màu nền sang màu trắng khi rê chuột vào hình (trạng thái thu gọn) */}
      <div className="card-video-bg-sync" />

      {/* TOP BAR: Icon + Tên hệ thống + Category / Controls khi bung rộng 6 thẻ */}
      <motion.div
        layout="position"
        transition={{ layout: layoutTransition }}
        className={`card-header-top relative z-10 w-full shrink-0 ${
          isExpanded ? 'pb-2.5 mb-2' : 'pb-2 mb-2'
        } border-b ${dividerBorderCls} flex flex-wrap items-center justify-between gap-2 ${
          isVideoFull ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isExpanded && (designMeta.illustrationSrc || sys.imageUrl) && (
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/85 dark:bg-black/30 p-0.5 border border-black/10 dark:border-white/15 flex items-center justify-center">
              <img
                src={designMeta.illustrationSrc || sys.imageUrl}
                alt={sys.abbr}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <h3
            className="flex items-center gap-2 text-sm sm:text-base font-bold leading-snug min-w-0 m-0 font-play"
            style={{ color: activeAccent }}
            title={displayName}
          >
            <SystemIcon
              iconName={sys.iconName}
              className="sys-icon w-4 h-4 sm:w-5 sm:h-5 shrink-0"
              style={{ color: activeAccent }}
            />
            <span className="truncate">{displayName}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center shrink-0 ml-0.5 opacity-85"
              style={{ color: activeAccent }}
            >
              <ChevronDown className="w-4 h-4 shrink-0" />
            </motion.div>
          </h3>
          <span
            className={`sys-category-pill text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-full border shrink-0 flex items-center gap-1.5 ${
              isExpanded
                ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40 shadow-xs'
                : isDark
                  ? 'bg-black/25 text-white/90 border-white/15'
                  : 'bg-white/90 text-slate-700 border-slate-200/90'
            }`}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3 text-indigo-400 animate-pulse shrink-0" />
                <span>{isEn ? 'Expanded Interactive View' : 'Đang mở rộng tương tác'}</span>
              </>
            ) : (
              sys.category
            )}
          </span>
        </div>

        {isExpanded && (
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playTap();
                setIsCompareOpen((prev) => !prev);
                setIsQrOpen(false);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                isCompareOpen
                  ? 'bg-indigo-600 text-white border-transparent shadow-xs'
                  : isDark
                    ? 'bg-black/30 hover:bg-black/45 text-white border-white/20'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
              }`}
              title={isEn ? 'Compare systems side-by-side' : 'So sánh song song'}
            >
              <ArrowLeftRight className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">{isEn ? 'Compare' : 'So sánh'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playTap();
                setIsQrOpen((prev) => !prev);
                setIsCompareOpen(false);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                isQrOpen
                  ? 'bg-emerald-600 text-white border-transparent shadow-xs'
                  : isDark
                    ? 'bg-black/30 hover:bg-black/45 text-white border-white/20'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
              }`}
              title={isEn ? 'Quick QR Access' : 'Mã QR truy cập'}
            >
              <QrCode className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">QR</span>
            </button>

            {sys.url && (
              <button
                type="button"
                onClick={(e) => handleOpenExternalUrl(e, sys.url)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-white/15 hover:bg-white/25 text-white border-white/25'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                }`}
                title={sys.url}
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="hidden md:inline">{isEn ? 'Live' : 'Cổng Live'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playTechChimeCollapse?.();
                onCollapse();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xs cursor-pointer hover:brightness-110 transition"
              style={{ background: designMeta.gradient }}
              aria-label={isEn ? 'Collapse system card' : 'Thu gọn thẻ hệ thống'}
            >
              <Minimize2 className="w-3 h-3 shrink-0" />
              <span>{isEn ? 'Minimize' : 'Thu gọn'}</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* TRẠNG THÁI THU GỌN: Thẻ ngang 1x1 với hình minh họa + mô tả ngắn */}
      {!isExpanded && (
        <motion.div
          layout="position"
          transition={{ layout: layoutTransition }}
          className={`card-body-row relative z-10 flex-1 min-h-0 flex flex-row items-center gap-3.5 ${
            isVideoFull ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
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
            className="card-thumb-btn relative z-20 w-[38%] max-w-[136px] h-[94px] sm:h-[104px] flex items-center justify-center shrink-0 overflow-hidden rounded-xl"
          >
            {!imgFailed && sys.imageUrl ? (
              <BlurUpImage
                ref={thumbImgRef}
                src={sys.imageUrl}
                alt={sys.abbr}
                variant="contain"
                onLoad={smartAlignInlineVideo}
                onError={() => setImgFailed(true)}
                className={`card-thumb-img w-full h-full object-contain select-none ${
                  isThumbHovered ? 'opacity-0' : 'opacity-100'
                }`}
              />
            ) : (
              <div
                className={`w-14 h-14 flex items-center justify-center ${
                  isDark ? 'text-white' : 'text-slate-700'
                }`}
              >
                <SystemIcon iconName={sys.iconName} className="w-7 h-7" />
              </div>
            )}

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

          <div className="card-content flex-1 h-full flex flex-col justify-between gap-1.5 min-w-0">
            <p
              className={`sys-desc-copy font-medium text-xs sm:text-[13px] leading-snug m-0 line-clamp-2 sm:line-clamp-3 ${
                isDark ? 'text-white/90' : 'text-slate-800'
              }`}
            >
              {displayDesc}
            </p>

            <div className={`sys-bottom-meta pt-1.5 mt-auto border-t ${dividerBorderCls} flex items-center justify-between gap-2 min-w-0`}>
              <span
                className="sys-abbr-badge text-[11px] font-bold tracking-wide truncate shrink-0"
                style={{ color: activeAccent }}
              >
                {badgeText}
              </span>
              <div
                className={`sys-fullname-copy text-[11px] font-medium leading-tight truncate m-0 text-right ${
                  isDark ? 'text-white/85' : 'text-slate-600'
                }`}
                title={displayFullName}
              >
                {displayFullName}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TRẠNG THÁI BUNG RỘNG = 6 THẺ CỘNG LẠI: Tích hợp toàn bộ nội dung Chi Tiết Hệ Thống */}
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
            onClick={(e) => e.stopPropagation()}
            className={`card-expanded-details relative z-10 flex-1 min-h-0 flex flex-col gap-2.5 ${
              isVideoFull ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            {/* Thanh điều hướng nhanh các nhóm thông tin chi tiết ngay trong thẻ */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: 'all', labelVi: 'Tất cả chi tiết', labelEn: 'All Details' },
                    { id: 'overview', labelVi: 'Tổng quan & KPI', labelEn: 'Overview & KPI' },
                    { id: 'arch', labelVi: 'Hạ tầng & Tính năng', labelEn: 'Stack & Features' },
                    { id: 'sync', labelVi: 'Liên thông ESB', labelEn: 'ESB Ecosystem' },
                  ] as const
                ).map((tab) => {
                  const active = detailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        setDetailTab(tab.id);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                        active
                          ? 'text-white border-transparent shadow-xs'
                          : isDark
                            ? 'bg-black/25 text-white/80 border-white/15 hover:bg-black/40'
                            : 'bg-white/85 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                      style={active ? { background: designMeta.gradient } : undefined}
                    >
                      {isEn ? tab.labelEn : tab.labelVi}
                    </button>
                  );
                })}
              </div>

              <span className={`text-[11px] font-mono truncate max-w-[260px] ${subtileMutedCls}`}>
                {displayFullName}
              </span>
            </div>

            {/* Vùng cuộn nội dung chi tiết bên trong khung kích thước bằng 6 thẻ */}
            <div className="flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-1 space-y-2.5 cursor-default">
              {/* Optional Drawer: Mã QR truy cập nhanh */}
              {isQrOpen && (
                <div className={`${subtileBoxCls} rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3`}>
                  <div className="w-24 h-24 rounded-xl bg-white p-1.5 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR ${sys.abbr}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${subtileHeadingCls}`}>
                        <QrCode className="w-4 h-4 shrink-0" style={{ color: activeAccent }} />
                        <span>
                          {isEn
                            ? `Quick QR Portal Access — ${sys.abbr}`
                            : `Mã QR truy cập nhanh — ${sys.abbr}`}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsQrOpen(false)}
                        className={`text-[11px] font-bold cursor-pointer ${subtileMutedCls}`}
                      >
                        {isEn ? 'Close' : 'Đóng'}
                      </button>
                    </div>
                    <p className={`text-xs m-0 ${subtileMutedCls}`}>
                      {sys.url
                        ? isEn
                          ? 'Scan on mobile/tablet to launch the live system portal directly.'
                          : 'Quét bằng điện thoại hoặc máy tính bảng để mở trực tiếp cổng vận hành hệ thống.'
                        : isEn
                          ? 'Live domain is under final integration; QR links to the Systems Hub.'
                          : 'Cổng phân hệ đang hoàn thiện tích hợp API; mã QR liên kết tới Hệ sinh thái.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <code
                        className={`px-2 py-0.5 rounded text-[11px] font-mono border truncate max-w-full ${
                          isDark
                            ? 'bg-black/35 border-white/15 text-white/90'
                            : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {sys.url || 'https://powerservice.one (Systems Hub)'}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyPortalUrl(sys.url || window.location.href)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${
                          isDark
                            ? 'bg-white/15 hover:bg-white/25 border-white/20 text-white'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {copiedQrUrl ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>
                          {copiedQrUrl ? (isEn ? 'Copied' : 'Đã chép') : isEn ? 'Copy URL' : 'Sao chép'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Drawer: So sánh trực tiếp 2 phân hệ */}
              {isCompareOpen && compareTargetSystem && (() => {
                const targetTech =
                  SYSTEM_TECH_SPECS_MAP[compareTargetSystem.id] || SYSTEM_TECH_SPECS_MAP.sdp;
                const pairFlow = getRealtimeFlowDescription(sys, compareTargetSystem, isEn);
                const targetAccent = isDark
                  ? SYSTEM_DESIGN_MAP[compareTargetSystem.id]?.darkAccent || '#38bdf8'
                  : SYSTEM_DESIGN_MAP[compareTargetSystem.id]?.lightAccent || '#0284c7';
                return (
                  <div className={`${subtileBoxCls} rounded-xl p-3 space-y-2.5`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${subtileHeadingCls}`}>
                        <ArrowLeftRight className="w-4 h-4 shrink-0" style={{ color: activeAccent }} />
                        <span>
                          {isEn
                            ? `Side-by-Side Comparison: ${sys.abbr} vs ${compareTargetSystem.abbr}`
                            : `So sánh trực tiếp: ${sys.abbr} ⇄ ${compareTargetSystem.abbr}`}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCompareOpen(false)}
                        className={`text-[11px] font-bold cursor-pointer ${subtileMutedCls}`}
                      >
                        {isEn ? 'Hide Compare' : 'Ẩn so sánh'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[11px] mr-1 ${subtileMutedCls}`}>
                        {isEn ? 'Compare with:' : 'Chọn phân hệ đối chiếu:'}
                      </span>
                      {allSystems
                        .filter((s) => s.id !== sys.id)
                        .map((cand) => {
                          const isTarget = cand.id === compareTargetSystem.id;
                          return (
                            <button
                              key={cand.id}
                              type="button"
                              onClick={() => {
                                SoundEngine.playTap();
                                setCompareTargetId(cand.id);
                              }}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer transition-colors ${
                                isTarget
                                  ? 'text-white border-transparent shadow-xs'
                                  : isDark
                                    ? 'bg-black/30 border-white/15 text-white/80 hover:text-white'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                              style={
                                isTarget
                                  ? {
                                      background:
                                        SYSTEM_DESIGN_MAP[cand.id]?.gradient || designMeta.gradient,
                                    }
                                  : undefined
                              }
                            >
                              {cand.abbr}
                            </button>
                          );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div className={`rounded-xl p-2.5 border text-xs space-y-1 ${isDark ? 'bg-black/25 border-white/12' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <div className="font-bold" style={{ color: activeAccent }}>
                          {sys.abbr} — {isEn ? sys.nameEn : sys.nameVi}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>{isEn ? 'Metrics:' : 'Hiệu năng:'}</strong> {sys.metrics}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>DB:</strong> {techSpec.database}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>API:</strong> {techSpec.apiProtocol}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>ISO:</strong> {techSpec.isoSecurity}
                        </div>
                      </div>

                      <div className={`rounded-xl p-2.5 border text-xs space-y-1 ${isDark ? 'bg-black/25 border-white/12' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold" style={{ color: targetAccent }}>
                            {compareTargetSystem.abbr} —{' '}
                            {isEn ? compareTargetSystem.nameEn : compareTargetSystem.nameVi}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              SoundEngine.playTap();
                              onSelectSystem(compareTargetSystem.id);
                            }}
                            className="text-[11px] font-bold hover:underline cursor-pointer shrink-0"
                            style={{ color: activeAccent }}
                          >
                            {isEn ? 'Switch →' : 'Mở thẻ này →'}
                          </button>
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>{isEn ? 'Metrics:' : 'Hiệu năng:'}</strong> {compareTargetSystem.metrics}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>DB:</strong> {targetTech.database}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>API:</strong> {targetTech.apiProtocol}
                        </div>
                        <div className={subtileMutedCls}>
                          <strong>ISO:</strong> {targetTech.isoSecurity}
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-xl p-2.5 border text-xs space-y-1 ${isDark ? 'bg-black/25 border-white/12' : 'bg-slate-50/90 border-slate-200/80'}`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`font-bold ${subtileHeadingCls}`}>
                          {isEn ? 'Real-Time Data Bridge:' : 'Cơ chế đồng bộ dữ liệu trực tiếp:'}{' '}
                          <span style={{ color: activeAccent }}>{pairFlow.protocol}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          Latency ~{pairFlow.latency}
                        </span>
                      </div>
                      <p className={`m-0 leading-relaxed ${subtileMutedCls}`}>
                        {pairFlow.payloadSummary}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* 1. 4 CHỈ SỐ KPI TRỌNG TÂM */}
              {(detailTab === 'all' || detailTab === 'overview') && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className={`${subtileBoxCls} rounded-xl p-2.5 flex flex-col gap-0.5`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Activity className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span
                        className="text-xs font-bold truncate"
                        style={{ color: activeAccent }}
                        title={sys.metrics}
                      >
                        {sys.metrics}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${subtileMutedCls}`}>
                      {isEn ? 'Core Performance' : 'Hiệu năng cốt lõi'}
                    </span>
                  </div>

                  <div className={`${subtileBoxCls} rounded-xl p-2.5 flex flex-col gap-0.5`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Server className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span
                        className="text-xs font-bold truncate"
                        style={{ color: activeAccent }}
                        title={techSpec.slaCommitment}
                      >
                        {techSpec.slaCommitment}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${subtileMutedCls}`}>
                      {isEn ? 'SLA Commitment' : 'Cam kết SLA'}
                    </span>
                  </div>

                  <div className={`${subtileBoxCls} rounded-xl p-2.5 flex flex-col gap-0.5`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Users className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span className="text-xs font-bold truncate" style={{ color: activeAccent }}>
                        ~{techSpec.baseOnlineUsers}+{' '}
                        {isEn ? techSpec.onlineRoleLabelEn : techSpec.onlineRoleLabel}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${subtileMutedCls}`}>
                      {isEn ? 'Active Concurrency' : 'Quy mô trực tuyến'}
                    </span>
                  </div>

                  <div className={`${subtileBoxCls} rounded-xl p-2.5 flex flex-col gap-0.5`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span
                        className="text-xs font-bold truncate"
                        style={{ color: activeAccent }}
                        title={techSpec.isoSecurity}
                      >
                        {techSpec.isoSecurity}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate ${subtileMutedCls}`}>
                      {isEn ? 'Security Compliance' : 'Chuẩn bảo mật'}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. TỔNG QUAN PHÂN HỆ + VIDEO / MINH HỌA + WIDGET CHUYÊN BIỆT */}
              {(detailTab === 'all' || detailTab === 'overview') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
                  <div className={`${subtileBoxCls} lg:col-span-7 rounded-xl p-3 flex flex-col justify-between gap-2.5`}>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                      {(sys.videoUrl || designMeta.illustrationSrc || sys.imageUrl) && (
                        <div
                          className={`sm:col-span-5 relative aspect-video rounded-xl overflow-hidden border ${
                            sys.videoUrl
                              ? 'bg-black border-white/15'
                              : isDark
                                ? 'bg-black/30 border-white/15'
                                : 'bg-white border-slate-200'
                          }`}
                        >
                          {sys.videoUrl ? (
                            <>
                              <video
                                ref={expandedDemoVideoRef}
                                src={sys.videoUrl}
                                poster={designMeta.illustrationSrc || sys.imageUrl || undefined}
                                autoPlay
                                loop
                                muted={isExpandedVideoMuted}
                                playsInline
                                preload="metadata"
                                controls={false}
                                disablePictureInPicture
                                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                                onError={(e) => {
                                  const v = e.currentTarget;
                                  const m = v.src.match(/[?&]id=([^&#]+)/i);
                                  if (m?.[1] && v.dataset.driveAltTried !== m[1]) {
                                    v.dataset.driveAltTried = m[1];
                                    v.src = `https://drive.usercontent.google.com/download?id=${m[1]}&export=download&confirm=t`;
                                    v.play().catch(() => {});
                                  }
                                }}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !isExpandedVideoMuted;
                                  setIsExpandedVideoMuted(next);
                                  saveMutedPref(next);
                                  if (expandedDemoVideoRef.current) {
                                    expandedDemoVideoRef.current.muted = next;
                                  }
                                }}
                                aria-label={
                                  isExpandedVideoMuted
                                    ? isEn
                                      ? 'Unmute demo video'
                                      : 'Bật âm thanh'
                                    : isEn
                                      ? 'Mute demo video'
                                      : 'Tắt âm thanh'
                                }
                                className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/25 flex items-center justify-center cursor-pointer"
                              >
                                {isExpandedVideoMuted ? (
                                  <VolumeX className="w-3 h-3" />
                                ) : (
                                  <Volume2 className="w-3 h-3 text-emerald-300" />
                                )}
                              </button>
                            </>
                          ) : (
                            <BlurUpImage
                              src={designMeta.illustrationSrc || sys.imageUrl}
                              alt={displayName}
                              priority="eager"
                              variant="contain"
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                      )}

                      <div className="sm:col-span-7 flex flex-col gap-1.5 min-w-0">
                        <span className="text-xs font-bold" style={{ color: activeAccent }}>
                          {isEn ? 'System Overview' : 'Tổng quan phân hệ'}
                        </span>
                        <p className={`text-xs sm:text-[13px] leading-relaxed m-0 ${subtileHeadingCls}`}>
                          {displayDesc}
                        </p>
                      </div>
                    </div>

                    <ExpandedBentoModule
                      sys={sys}
                      bentoStyle={bentoStyle}
                      isDark={isDark}
                      isEn={isEn}
                      showToast={showToast}
                    />
                  </div>

                  {/* Hạ tầng kỹ thuật 2x2 ngay bên phải trên Desktop */}
                  <div className={`${subtileBoxCls} lg:col-span-5 rounded-xl p-3 flex flex-col justify-between gap-2`}>
                    <div className="flex items-center gap-1.5 pb-1.5 border-b border-current/10">
                      <Server className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span className="text-xs font-bold" style={{ color: activeAccent }}>
                        {isEn ? 'Technical Architecture' : 'Hạ tầng kỹ thuật'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                      <div className={`rounded-lg p-2 border ${isDark ? 'bg-black/25 border-white/10' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <span className={`block text-[10px] font-mono ${subtileMutedCls}`}>
                          {isEn ? 'Database Stack' : 'Cơ sở dữ liệu (DB)'}
                        </span>
                        <span className={`text-xs font-bold break-words ${subtileHeadingCls}`}>
                          {techSpec.database}
                        </span>
                      </div>

                      <div className={`rounded-lg p-2 border ${isDark ? 'bg-black/25 border-white/10' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <span className={`block text-[10px] font-mono ${subtileMutedCls}`}>
                          {isEn ? 'API & Streaming Protocol' : 'Giao thức API kết nối'}
                        </span>
                        <span className="text-xs font-bold break-words" style={{ color: activeAccent }}>
                          {techSpec.apiProtocol}
                        </span>
                      </div>

                      <div className={`rounded-lg p-2 border ${isDark ? 'bg-black/25 border-white/10' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <span className={`block text-[10px] font-mono ${subtileMutedCls}`}>
                          {isEn ? 'Service Level & Availability' : 'Cam kết chất lượng (SLA)'}
                        </span>
                        <span className={`text-xs font-bold break-words ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          {techSpec.slaCommitment}
                        </span>
                      </div>

                      <div className={`rounded-lg p-2 border ${isDark ? 'bg-black/25 border-white/10' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <span className={`block text-[10px] font-mono ${subtileMutedCls}`}>
                          {isEn ? 'Compliance & Encryption' : 'Bảo mật & Tuân thủ ISO'}
                        </span>
                        <span className={`text-xs font-bold break-words ${subtileHeadingCls}`}>
                          {techSpec.isoSecurity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TÍNH NĂNG TRỌNG TÂM & HẠ TẦNG (KHI TAB = ARCH HOẶC ALL) */}
              {(detailTab === 'all' || detailTab === 'arch') && (
                <div className={`${subtileBoxCls} rounded-xl p-3 space-y-2`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-current/10">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span className="text-xs font-bold" style={{ color: activeAccent }}>
                        {isEn ? 'Core Capabilities & Features' : 'Tính năng trọng tâm & Chỉ số vận hành'}
                      </span>
                    </div>
                    {sys.metrics && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          isDark
                            ? 'bg-black/30 text-white border-white/15'
                            : 'bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        {sys.metrics}
                      </span>
                    )}
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 m-0 p-0 list-none">
                    {displayFeatures.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className={`rounded-lg p-2 border flex items-start gap-2 text-xs leading-snug ${
                          isDark ? 'bg-black/25 border-white/10 text-white/92' : 'bg-slate-50/85 border-slate-200/80 text-slate-800'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: designMeta.gradient }}
                        >
                          {fIdx + 1}
                        </span>
                        <span className="min-w-0 flex-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. HỆ THỐNG LIÊN THÔNG & KIẾN TRÚC ESB */}
              {(detailTab === 'all' || detailTab === 'sync') && (
                <div className={`${subtileBoxCls} rounded-xl p-3 space-y-2.5`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1.5 border-b border-current/10">
                    <div className="flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 shrink-0" style={{ color: activeAccent }} />
                      <span className="text-xs font-bold" style={{ color: activeAccent }}>
                        {isEn ? 'Connected Systems & Ecosystem ESB' : 'Hệ thống liên thông & Kiến trúc ESB'}
                      </span>
                    </div>
                    <span className={`text-[11px] ${subtileMutedCls}`}>
                      {isEn ? 'Select a node to inspect live sync' : 'Chọn phân hệ để xem luồng dữ liệu'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {connections.map((connId) => {
                      const connSys = allSystems.find((s) => s.id === connId);
                      if (!connSys) return null;
                      const isSel = selectedConnectionId === connId;
                      const connMeta = SYSTEM_DESIGN_MAP[connId] || SYSTEM_DESIGN_MAP.sdp;
                      return (
                        <button
                          key={connId}
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setSelectedConnectionId(connId);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-colors ${
                            isSel
                              ? 'text-white border-transparent shadow-xs'
                              : isDark
                                ? 'bg-black/30 border-white/15 text-white hover:bg-black/45'
                                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                          style={isSel ? { background: connMeta.gradient } : undefined}
                        >
                          <WebIcon name={connMeta.iconName} className="w-3 h-3 shrink-0" />
                          <span>{connSys.abbr}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedConnectionId && (() => {
                    const connTarget = allSystems.find((s) => s.id === selectedConnectionId);
                    if (!connTarget) return null;
                    const flow = getRealtimeFlowDescription(sys, connTarget, isEn);
                    return (
                      <div className={`rounded-lg p-2.5 border text-xs space-y-1 ${isDark ? 'bg-black/25 border-white/12' : 'bg-slate-50/90 border-slate-200/80'}`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`font-bold ${subtileHeadingCls}`}>
                            {sys.abbr} ⇄ {connTarget.abbr} ·{' '}
                            <span style={{ color: activeAccent }}>{flow.protocol}</span> ({flow.latency})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              SoundEngine.playTap();
                              onSelectSystem(connTarget.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white cursor-pointer hover:brightness-110"
                            style={{
                              background:
                                SYSTEM_DESIGN_MAP[connTarget.id]?.gradient || designMeta.gradient,
                            }}
                          >
                            <span>{isEn ? `Open ${connTarget.abbr}` : `Xem ${connTarget.abbr}`}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        <p className={`m-0 leading-relaxed ${subtileMutedCls}`}>
                          {flow.payloadSummary}
                        </p>
                      </div>
                    );
                  })()}

                  <div className={`rounded-lg p-2.5 border text-xs ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50/75 border-slate-200/75'}`}>
                    <div className="flex items-center gap-1.5 font-bold mb-0.5" style={{ color: activeAccent }}>
                      <WebIcon name="git-merge" className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isEn ? 'Omnichannel Architecture' : 'Kiến trúc kết nối toàn hệ sinh thái'}
                      </span>
                    </div>
                    <p className={`m-0 leading-relaxed ${subtileMutedCls}`}>
                      {isEn
                        ? `${sys.abbr} operates inside the ${techSpec.ecosystemLabelEn} layer, exchanging real-time telemetry with 11 companion modules.`
                        : `${sys.abbr} vận hành trong phân hệ ${techSpec.ecosystemLabel}, liên thông dữ liệu thời gian thực với 11 phân hệ còn lại qua Enterprise Service Bus.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className={`shrink-0 flex flex-wrap items-center justify-between gap-2 pt-2 border-t ${dividerBorderCls}`}>
              <div className="flex flex-wrap items-center gap-2">
                {sys.url ? (
                  <button
                    type="button"
                    onClick={(e) => handleOpenExternalUrl(e, sys.url)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer hover:brightness-110 transition"
                    style={{ background: designMeta.gradient }}
                  >
                    <span>{isEn ? 'Launch Website' : 'Truy cập Website'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                      isDark
                        ? 'bg-black/35 text-amber-300 border-amber-400/30'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'Finalizing integration' : 'Đang hoàn thiện tích hợp'}</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTechChimeExpand();
                    onOpenDiagram();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-white/12 hover:bg-white/22 text-white border-white/20'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <WebIcon name="git-merge" className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Full Diagram' : 'Sơ đồ hệ sinh thái'}</span>
                </button>

                {sys.videoUrl && (
                  <button
                    type="button"
                    onClick={enterFullCardVideo}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-white/12 hover:bg-white/22 text-white border-white/20'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isEn ? 'Full Video' : 'Video toàn thẻ'}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTechChimeCollapse?.();
                  onCollapse();
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  isDark
                    ? 'text-white/85 hover:text-white hover:bg-white/15'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/5'
                }`}
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Collapse' : 'Thu gọn'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default SystemBentoCard;
