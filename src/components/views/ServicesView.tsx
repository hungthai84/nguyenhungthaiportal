'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  ShoppingBag,
  ShieldCheck,
  Gamepad2,
  Wallet,
  Cpu,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Wrench,
  Building2,
  UserCheck,
  Tag,
  Users,
  Zap,
  Clock,
  Smile,
  TrendingUp,
  Activity,
  Layers,
  Award,
  HeartHandshake,
  RotateCcw,
} from 'lucide-react';
import { WebIcon } from '@/components/ui/WebIcon';
import { DOMAINS_DATA, DOMAINS_INTRO } from '@/data/domains';
import { DomainData, SiteTheme } from '@/types';
import { TechStackExplorerModal } from '@/components/domains/TechStackExplorerModal';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';

export interface ServicesViewProps {
  currentTheme?: SiteTheme;
}

type DomainIconKey =
  | 'smartphone'
  | 'shopping-bag'
  | 'shield-check'
  | 'gamepad-2'
  | 'wallet'
  | 'cpu';

type KpiIconKey =
  | 'users'
  | 'zap'
  | 'clock'
  | 'smile'
  | 'trending-up'
  | 'activity'
  | 'layers'
  | 'award'
  | 'heart-handshake'
  | 'rotate-ccw'
  | 'shield-check';

interface DomainUiMeta {
  shortTitle: string;
  shortTitleEn: string;
  iconKey: DomainIconKey;
  accentLight: string;
  accentDark: string;
  gradient: string;
  cardBgLight: string;
  cardBgDark: string;
  tintBgLight: string;
  tintBgDark: string;
  borderLight: string;
  borderDark: string;
  pillTextLight: string;
  pillTextDark: string;
  illustrationSrc: string;
  fallbackIllustration: string;
  frontMetrics: {
    label: string;
    labelEn: string;
    value: string;
    valueEn?: string;
  }[];
  detailKpis: {
    icon: KpiIconKey;
    value: string;
    valueEn?: string;
    label: string;
    labelEn: string;
  }[];
  tags: string[];
  tagsEn: string[];
}

const DOMAIN_UI_META: Record<string, DomainUiMeta> = {
  '01': {
    shortTitle: 'Viễn thông',
    shortTitleEn: 'Telecom Services',
    iconKey: 'smartphone',
    accentLight: '#0284c7',
    accentDark: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(224, 242, 254, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(12, 74, 110, 0.56) 100%)',
    tintBgLight: 'rgba(224, 242, 254, 0.58)',
    tintBgDark: 'rgba(14, 116, 144, 0.22)',
    borderLight: 'rgba(14, 165, 233, 0.34)',
    borderDark: 'rgba(56, 189, 248, 0.38)',
    pillTextLight: '#0369a1',
    pillTextDark: '#7dd3fc',
    illustrationSrc: 'https://i.ibb.co/4RYYfBvx/D-ch-v-vi-n-th-ng-removebg-preview.png',
    fallbackIllustration:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069236/Gemini_Generated_Image_9y00s39y00s39y00.png',
    frontMetrics: [
      { label: 'SLA & CSAT', labelEn: 'SLA & CSAT', value: '>98% · 96,5%' },
      { label: 'Quy mô ca kíp', labelEn: 'Operations Scale', value: '50–130+ · 24/7' },
    ],
    detailKpis: [
      { icon: 'shield-check', value: '> 98%', label: 'SLA tiếp nhận cuộc gọi', labelEn: 'Call Answer SLA' },
      { icon: 'smile', value: '96,5%', label: 'Chỉ số hài lòng (CSAT)', labelEn: 'Customer Satisfaction' },
      { icon: 'trending-up', value: '-20%', valueEn: '-20%', label: 'Chi phí khiếu nại cước', labelEn: 'Dispute Handling Cost' },
      { icon: 'users', value: '< 3%', label: 'Tỷ lệ nghỉ việc nhân sự', labelEn: 'Staff Attrition Rate' },
    ],
    tags: ['#ContactCenter', '#SLA98', '#24x7Ops', '#TelecomQA'],
    tagsEn: ['#ContactCenter', '#SLA98', '#24x7Ops', '#TelecomQA'],
  },
  '02': {
    shortTitle: 'TMĐT',
    shortTitleEn: 'Digital Commerce',
    iconKey: 'shopping-bag',
    accentLight: '#ea580c',
    accentDark: '#fb923c',
    gradient: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 237, 213, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(124, 45, 18, 0.56) 100%)',
    tintBgLight: 'rgba(255, 237, 213, 0.58)',
    tintBgDark: 'rgba(194, 65, 12, 0.22)',
    borderLight: 'rgba(249, 115, 22, 0.34)',
    borderDark: 'rgba(251, 146, 60, 0.38)',
    pillTextLight: '#c2410c',
    pillTextDark: '#fdba74',
    illustrationSrc:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542367/Th%C6%B0%C6%A1ng_m%E1%BA%A1i_%C4%91i%E1%BB%87n_t%E1%BB%AD-removebg-preview.png',
    fallbackIllustration:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069235/Gemini_Generated_Image_6g07kh6g07kh6g07.png',
    frontMetrics: [
      { label: 'CSKH & Fraud', labelEn: 'CS & Fraud Team', value: '>100 nhân sự', valueEn: '100+ Staff' },
      { label: 'CSAT & Chat', labelEn: 'CSAT & Chat', value: '88% → 96,5%' },
    ],
    detailKpis: [
      { icon: 'clock', value: '< 30 giây', valueEn: '< 30s', label: 'Thời gian chờ kênh Chat', labelEn: 'Chat Queue Wait Time' },
      { icon: 'smile', value: '88% → 96,5%', label: 'Chỉ số hài lòng (CSAT)', labelEn: 'CSAT Improvement' },
      { icon: 'rotate-ccw', value: '-30%', label: 'Tỷ lệ hủy đơn chậm hỗ trợ', labelEn: 'Support-Delay Cancellations' },
      { icon: 'trending-up', value: '-25%', label: 'Chi phí Cost-to-Serve', labelEn: 'Cost-to-Serve Savings' },
    ],
    tags: ['#Omnichannel', '#MegaSale', '#FraudControl', '#DisputeOps'],
    tagsEn: ['#Omnichannel', '#MegaSale', '#FraudControl', '#DisputeOps'],
  },
  '03': {
    shortTitle: 'Bảo hiểm',
    shortTitleEn: 'Finance Insurance',
    iconKey: 'shield-check',
    accentLight: '#e11d48',
    accentDark: '#fb7185',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #db2777 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 228, 230, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(136, 19, 55, 0.56) 100%)',
    tintBgLight: 'rgba(255, 228, 230, 0.58)',
    tintBgDark: 'rgba(190, 18, 60, 0.22)',
    borderLight: 'rgba(244, 63, 94, 0.34)',
    borderDark: 'rgba(251, 113, 133, 0.38)',
    pillTextLight: '#be123c',
    pillTextDark: '#fda4af',
    illustrationSrc:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542365/D%E1%BB%8Bch_v%E1%BB%A5_b%E1%BA%A3o_hi%E1%BB%83m-removebg-preview.png',
    fallbackIllustration:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069237/Gemini_Generated_Image_r1a3t4r1a3t4r1a3.png',
    frontMetrics: [
      { label: 'Xử lý yêu cầu', labelEn: 'Cycle Reduction', value: 'Giảm 45%', valueEn: '-45% Time' },
      { label: 'FCR & Retention', labelEn: 'FCR & Retention', value: '>92% · +15%' },
    ],
    detailKpis: [
      { icon: 'zap', value: '-45%', label: 'Rút ngắn thời gian xử lý', labelEn: 'Contract Cycle Time' },
      { icon: 'shield-check', value: '> 92%', label: 'Giải quyết lần đầu (FCR)', labelEn: 'First Contact Resolution' },
      { icon: 'heart-handshake', value: '+15%', label: 'Cải thiện duy trì hợp đồng', labelEn: 'Policy Retention Gain' },
      { icon: 'award', value: '95%', label: 'Cam kết chất lượng (SLA)', labelEn: 'Service Level Agreement' },
    ],
    tags: ['#FinanceQA', '#Compliance', '#FCR92', '#BCPContinuity'],
    tagsEn: ['#FinanceQA', '#Compliance', '#FCR92', '#BCPContinuity'],
  },
  '04': {
    shortTitle: 'eSports',
    shortTitleEn: 'Esports Gaming',
    iconKey: 'gamepad-2',
    accentLight: '#7c3aed',
    accentDark: '#c084fc',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(237, 233, 254, 0.74) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(76, 29, 149, 0.58) 100%)',
    tintBgLight: 'rgba(237, 233, 254, 0.62)',
    tintBgDark: 'rgba(109, 40, 217, 0.24)',
    borderLight: 'rgba(139, 92, 246, 0.34)',
    borderDark: 'rgba(192, 132, 252, 0.38)',
    pillTextLight: '#6d28d9',
    pillTextDark: '#d8b4fe',
    illustrationSrc:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542366/Game_eSports-removebg-preview.png',
    fallbackIllustration:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069238/Gemini_Generated_Image_s1e5xks1e5xks1e5.png',
    frontMetrics: [
      { label: 'Lưu lượng xử lý', labelEn: 'Ticket Volume', value: '>50.000/ngày', valueEn: '>50K / day' },
      { label: 'Phản hồi & CSAT', labelEn: 'Response & CSAT', value: '<30s · 96%' },
    ],
    detailKpis: [
      { icon: 'users', value: '~130', label: 'Nhân sự Game Support & Fraud', labelEn: 'Game Support & Fraud Team' },
      { icon: 'activity', value: '> 50.000', label: 'Yêu cầu hỗ trợ mỗi ngày', labelEn: 'Daily Support Tickets' },
      { icon: 'clock', value: '< 30 giây', valueEn: '< 30s', label: 'Phản hồi đầu Ticket/Chat', labelEn: 'First Response Time' },
      { icon: 'smile', value: '96%', label: 'Chỉ số hài lòng người chơi', labelEn: 'Player CSAT Score' },
    ],
    tags: ['#GameSupport', '#AccountSecurity', '#50kTickets', '#LTVRetention'],
    tagsEn: ['#GameSupport', '#AccountSecurity', '#50kTickets', '#LTVRetention'],
  },
  '05': {
    shortTitle: 'Thanh toán',
    shortTitleEn: 'Digital Payments',
    iconKey: 'wallet',
    accentLight: '#4338ca',
    accentDark: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(224, 231, 255, 0.74) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(49, 46, 129, 0.58) 100%)',
    tintBgLight: 'rgba(224, 231, 255, 0.62)',
    tintBgDark: 'rgba(67, 56, 202, 0.24)',
    borderLight: 'rgba(99, 102, 241, 0.34)',
    borderDark: 'rgba(129, 140, 248, 0.38)',
    pillTextLight: '#3730a3',
    pillTextDark: '#a5b4fc',
    illustrationSrc:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542372/Thanh_to%C3%A1n_%C4%91i%E1%BB%87n_t%E1%BB%AD-removebg-preview.png',
    fallbackIllustration:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069234/Gemini_Generated_Image_3b9s6n3b9s6n3b9s.png',
    frontMetrics: [
      { label: 'Hoàn tiền RPA', labelEn: 'RPA Refund', value: '48h → 90 giây', valueEn: '48h → 90s' },
      { label: 'CSAT & BPO SLA', labelEn: 'CSAT & BPO SLA', value: '98,2% · 98,6%' },
    ],
    detailKpis: [
      { icon: 'zap', value: '48h → 90s', label: 'Tự động hoàn tiền bằng RPA', labelEn: 'Automated RPA Refund' },
      { icon: 'smile', value: '98,2%', label: 'Chỉ số hài lòng (CSAT)', labelEn: 'Digital Finance CSAT' },
      { icon: 'award', value: '98,6%', label: 'SLA BPO (>150 vị trí)', labelEn: 'BPO Operations SLA' },
      { icon: 'shield-check', value: '-35%', label: 'Giảm tỷ lệ sự cố vận hành', labelEn: 'Incident Reduction' },
    ],
    tags: ['#FintechOps', '#RPAAutomation', '#CoreBanking', '#WarRoom'],
    tagsEn: ['#FintechOps', '#RPAAutomation', '#CoreBanking', '#WarRoom'],
  },
  '06': {
    shortTitle: 'Xây hệ thống',
    shortTitleEn: 'System Architecture',
    iconKey: 'cpu',
    accentLight: '#059669',
    accentDark: '#34d399',
    gradient: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
    cardBgLight: 'linear-gradient(140deg, rgba(255, 255, 255, 0.88) 0%, rgba(209, 250, 229, 0.72) 100%)',
    cardBgDark: 'linear-gradient(140deg, rgba(15, 23, 42, 0.88) 0%, rgba(6, 78, 59, 0.56) 100%)',
    tintBgLight: 'rgba(209, 250, 229, 0.58)',
    tintBgDark: 'rgba(4, 120, 87, 0.22)',
    borderLight: 'rgba(16, 185, 129, 0.34)',
    borderDark: 'rgba(52, 211, 153, 0.38)',
    pillTextLight: '#047857',
    pillTextDark: '#6ee7b7',
    illustrationSrc:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542368/X%C3%A2y_d%E1%BB%B1ng_h%E1%BB%87_th%E1%BB%91ng-removebg-preview.png',
    fallbackIllustration:
      'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069236/Gemini_Generated_Image_i12r2fi12r2fi12r.png',
    frontMetrics: [
      { label: 'Chuẩn hóa', labelEn: 'Standardization', value: '100% SOP/KPI' },
      { label: 'Onboarding & Perf', labelEn: 'Onboarding & Perf', value: '-65% · +40%' },
    ],
    detailKpis: [
      { icon: 'layers', value: '10–150+', label: 'Quy mô Contact Center thiết lập', labelEn: 'Contact Center Seats Built' },
      { icon: 'clock', value: '-65%', label: 'Rút ngắn thời gian Onboarding', labelEn: 'Onboarding Time Saved' },
      { icon: 'trending-up', value: '+40%', label: 'Cải thiện hiệu suất vận hành', labelEn: 'Operational Efficiency' },
      { icon: 'award', value: 'Value Center', label: 'Chuyển đổi Cost → Value', labelEn: 'Cost-to-Value Shift' },
    ],
    tags: ['#CXStrategy', '#SOPMatrix', '#AICopilot', '#ValueCenter'],
    tagsEn: ['#CXStrategy', '#SOPMatrix', '#AICopilot', '#ValueCenter'],
  },
};

const renderDomainIcon = (key: DomainIconKey, className?: string, color?: string) => {
  const props = { className: className || 'w-4 h-4 shrink-0', style: color ? { color } : undefined };
  switch (key) {
    case 'smartphone':
      return <Smartphone {...props} />;
    case 'shopping-bag':
      return <ShoppingBag {...props} />;
    case 'shield-check':
      return <ShieldCheck {...props} />;
    case 'gamepad-2':
      return <Gamepad2 {...props} />;
    case 'wallet':
      return <Wallet {...props} />;
    case 'cpu':
    default:
      return <Cpu {...props} />;
  }
};

const renderKpiIcon = (key: KpiIconKey, className?: string) => {
  const props = { className: className || 'w-4 h-4' };
  switch (key) {
    case 'users':
      return <Users {...props} />;
    case 'zap':
      return <Zap {...props} />;
    case 'clock':
      return <Clock {...props} />;
    case 'smile':
      return <Smile {...props} />;
    case 'trending-up':
      return <TrendingUp {...props} />;
    case 'activity':
      return <Activity {...props} />;
    case 'layers':
      return <Layers {...props} />;
    case 'award':
      return <Award {...props} />;
    case 'heart-handshake':
      return <HeartHandshake {...props} />;
    case 'rotate-ccw':
      return <RotateCcw {...props} />;
    case 'shield-check':
    default:
      return <ShieldCheck {...props} />;
  }
};

const getCardDomId = (id: string) => {
  switch (id) {
    case '01':
      return 'service-card-telecom';
    case '02':
      return 'service-card-ecommerce';
    case '03':
      return 'service-card-insurance';
    case '04':
      return 'service-card-esports';
    case '05':
      return 'service-card-ewallet';
    case '06':
    default:
      return 'service-card-cx-ops';
  }
};

export const ServicesView: React.FC<ServicesViewProps> = ({ currentTheme = 'liquid-glass' }) => {
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const { language, t } = useLanguage();
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'deep-ocean';
  const isLight = !isDark;
  const isEn = language === 'en';
  const isLeatherTheme = cardStyle === 'cowhide-leather';

  const [expandedDomain, setExpandedDomain] = useState<DomainData | null>(null);
  const [originDomainId, setOriginDomainId] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState<'idle' | 'entering' | 'open' | 'closing'>('idle');
  const [isGridDimmed, setIsGridDimmed] = useState(false);
  const [morphRect, setMorphRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [wrapperMinHeight, setWrapperMinHeight] = useState<number | undefined>(undefined);

  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState<boolean>(false);

  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const mainCardRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const expandedCardRef = useRef<HTMLDivElement | null>(null);
  const expandedBodyRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const computeTargetBounds = useCallback(() => {
    const hostEl = mainCardRef.current || cardsWrapperRef.current;
    if (!hostEl) return null;

    return {
      top: 0,
      left: 0,
      width: hostEl.clientWidth,
      height: hostEl.clientHeight,
      needsWrapperMinHeight: undefined,
    };
  }, []);

  const openExpandedCard = useCallback(
    (domain: DomainData, explicitCardEl?: HTMLDivElement | null) => {
      clearTimers();
      SoundEngine.playTap();

      const hostEl = mainCardRef.current || cardsWrapperRef.current;
      const originEl = explicitCardEl || cardRefs.current[domain.id];
      const targetBounds = computeTargetBounds();

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setActiveCategory(domain.id);
      setOriginDomainId(domain.id);
      setExpandedDomain(domain);

      if (prefersReducedMotion || !hostEl || !originEl || !targetBounds) {
        if (targetBounds) {
          setMorphRect({
            top: targetBounds.top,
            left: targetBounds.left,
            width: targetBounds.width,
            height: targetBounds.height,
          });
          setWrapperMinHeight(undefined);
        }
        setAnimPhase('open');
        setIsGridDimmed(true);
        return;
      }

      const hostRect = hostEl.getBoundingClientRect();
      const cardRect = originEl.getBoundingClientRect();

      setWrapperMinHeight(undefined);
      setAnimPhase('entering');
      setMorphRect({
        top: cardRect.top - hostRect.top,
        left: cardRect.left - hostRect.left,
        width: cardRect.width,
        height: cardRect.height,
      });

      rafRef.current = window.requestAnimationFrame(() => {
        if (expandedCardRef.current) {
          void expandedCardRef.current.offsetHeight;
        }
        rafRef.current = window.requestAnimationFrame(() => {
          setIsGridDimmed(true);
          setAnimPhase('open');
          setMorphRect({
            top: targetBounds.top,
            left: targetBounds.left,
            width: targetBounds.width,
            height: targetBounds.height,
          });
        });
      });
    },
    [clearTimers, computeTargetBounds]
  );

  const closeExpandedCard = useCallback(() => {
    if (!expandedDomain || animPhase === 'idle' || animPhase === 'closing') return;
    clearTimers();
    SoundEngine.playTap();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hostEl = mainCardRef.current || cardsWrapperRef.current;
    const targetId = originDomainId || expandedDomain.id;
    const originEl = cardRefs.current[targetId];

    setIsGridDimmed(false);
    setActiveCategory('ALL');

    if (prefersReducedMotion || !hostEl || !originEl) {
      setExpandedDomain(null);
      setOriginDomainId(null);
      setAnimPhase('idle');
      setMorphRect(null);
      setWrapperMinHeight(undefined);
      return;
    }

    const hostRect = hostEl.getBoundingClientRect();
    const cardRect = originEl.getBoundingClientRect();

    setAnimPhase('closing');
    setMorphRect({
      top: cardRect.top - hostRect.top,
      left: cardRect.left - hostRect.left,
      width: cardRect.width,
      height: cardRect.height,
    });

    animTimerRef.current = window.setTimeout(() => {
      setExpandedDomain(null);
      setOriginDomainId(null);
      setAnimPhase('idle');
      setMorphRect(null);
      setWrapperMinHeight(undefined);
    }, 580);
  }, [expandedDomain, animPhase, clearTimers, originDomainId]);

  const switchExpandedDomain = useCallback(
    (domain: DomainData) => {
      SoundEngine.playTap();
      setExpandedDomain(domain);
      setOriginDomainId(domain.id);
      setActiveCategory(domain.id);
      if (expandedBodyRef.current) {
        expandedBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  // Sync expanded bounds dynamically on container resize
  useEffect(() => {
    const hostEl = mainCardRef.current || cardsWrapperRef.current;
    if (!hostEl || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (animPhase !== 'open') return;
      const bounds = computeTargetBounds();
      if (!bounds) return;
      setMorphRect({
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      });
      setWrapperMinHeight(undefined);
    });

    observer.observe(hostEl);
    return () => observer.disconnect();
  }, [animPhase, computeTargetBounds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isFilterOpen) {
        setIsFilterOpen(false);
      } else if (isTechModalOpen) {
        setIsTechModalOpen(false);
      } else if (expandedDomain) {
        closeExpandedCard();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen, isTechModalOpen, expandedDomain, closeExpandedCard]);

  const filterCategories = [
    { id: 'ALL', label: isEn ? 'All 6 Domains' : 'Tất cả 6 lĩnh vực', icon: 'grid' },
    { id: '01', label: isEn ? 'Telecom Services' : 'Dịch vụ Viễn thông', icon: 'phone' },
    { id: '02', label: isEn ? 'E-Commerce Ops' : 'Thương mại điện tử', icon: 'shopping-cart' },
    { id: '03', label: isEn ? 'Finance & Insurance' : 'Tài chính bảo hiểm', icon: 'shield-check' },
    { id: '04', label: isEn ? 'Esports & Gaming' : 'Thể thao điện tử', icon: 'gamepad-2' },
    { id: '05', label: isEn ? 'Digital Payments' : 'Thanh toán điện tử', icon: 'credit-card' },
    { id: '06', label: isEn ? 'System Architecture' : 'Xây dựng hệ thống', icon: 'layers' },
  ];

  const getAccentColor = (id: string) => {
    if (isLeatherTheme) {
      return '#FDE68A';
    }
    const meta = DOMAIN_UI_META[id] || DOMAIN_UI_META['01'];
    return isLight ? meta.accentLight : meta.accentDark;
  };

  const renderTwoLineTitle = (title: string, iconKey: DomainIconKey, accentColor: string) => {
    const words = title.trim().split(/\s+/);
    const line1 = words.slice(0, 2).join(' ');
    const line2 = words.slice(2).join(' ');
    return (
      <>
        <span className="inline-flex items-center gap-1.5 flex-nowrap">
          {renderDomainIcon(iconKey, 'w-[17px] h-[17px] shrink-0 stroke-[2.2]', accentColor)}
          <span>{line1}</span>
        </span>
        {line2 ? <span className="block">{line2}</span> : null}
      </>
    );
  };

  const expandedMeta = expandedDomain ? DOMAIN_UI_META[expandedDomain.id] || DOMAIN_UI_META['01'] : null;
  const expandedAccent = expandedDomain ? getAccentColor(expandedDomain.id) : '#0284c7';

  return (
    <div
      id="services-page-container"
      data-element-name="Trang Dịch Vụ & Giải Pháp"
      data-element-type="container"
      data-element-page="services"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none text-[var(--text-primary)] box-border"
    >
      <div
        id="services-cards-track"
        data-element-name="Track căn giữa Dịch Vụ"
        data-element-type="container"
        data-element-page="services"
        data-element-parent="services-page-container"
        className="page-cards-track"
      >
        <div
          id="service-main-card"
          ref={mainCardRef}
          data-main-card="true"
          data-detail-open={expandedDomain ? 'true' : 'false'}
          data-detail-overlay={expandedDomain ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Dịch Vụ"
          data-element-type="card"
          data-element-page="services"
          data-element-parent="services-cards-track"
          className={`page-main-card relative flex flex-col justify-start p-[15px] gap-[15px] rounded-[14px] overflow-x-hidden glass-scrollbar box-border ${
            expandedDomain ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
          style={{ padding: '15px', gap: '15px', borderRadius: 'var(--radius-main, 30px)' }}
        >
          <div
            id="services-main-content"
            data-element-parent="service-main-card"
            className="w-full flex-1 flex flex-col justify-start gap-[15px] min-w-0"
          >
            {/* 1. HERO BANNER ĐẦU TRANG LĨNH VỰC */}
            <motion.div
              id="services-hero-banner"
              data-element-type="section"
              data-section-card="true"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="banner-card hero-banner group w-full max-w-full min-h-[140px] h-auto lg:h-[164px] lg:min-h-[164px] lg:max-h-[164px] mx-auto rounded-[14px] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-[15px] p-[15px] z-30 box-border transition-all duration-300"
              style={{
                padding: '15px',
                gap: '15px',
                width: '100%',
                maxWidth: '100%',
                borderRadius: 'var(--radius-banner, 24px)',
                boxSizing: 'border-box',
              }}
            >
              <div
                className="project-detail-banner-media absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
                style={{ borderRadius: 'var(--radius-banner, 24px)' }}
              >
                {!heroVideoFailed ? (
                  <video
                    src="https://res.cloudinary.com/q5tpzaxk/video/upload/v1795204134/D%E1%BB%8Bch_V%E1%BB%A5.mp4"
                    poster="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794041058/Gemini_Generated_Image_lpt3fplpt3fplpt3.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onError={() => setHeroVideoFailed(true)}
                    className="w-full h-full object-cover object-center rounded-[14px] transition-all duration-700"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794041058/Gemini_Generated_Image_lpt3fplpt3fplpt3.png"
                    alt="Banner Dịch vụ trọng tâm"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover object-center rounded-[14px] transition-all duration-700"
                  />
                )}
              </div>
              <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[14px] z-0" />

              {/* Vùng Tiêu Đề */}
              <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
                <div
                  className="card-header-sync flex items-center gap-2 min-w-0"
                  style={{ color: 'var(--text-link, var(--color-primary))' }}
                >
                  <WebIcon
                    name="layers"
                    className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                    style={{ width: '22px', height: '22px' }}
                  />
                  <h1
                    className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                    data-card-title="true"
                    style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                  >
                    {isEn ? '6 Core Expertise Domains' : '6 Lĩnh Vực Chuyên Môn & Quản Trị'}
                  </h1>
                </div>
                <p
                  className="banner-quote typo-h3 font-handwriting font-quote not-italic font-bold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[56%]"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                    fontWeight: 700,
                    fontStyle: 'normal',
                  }}
                >
                  &quot;{t(DOMAINS_INTRO.quote)} ♡&quot;
                </p>
              </div>

              {/* Bộ lọc & nút thao tác nhanh */}
              <div
                className="relative z-30 flex flex-wrap items-center justify-between mt-auto pt-0 gap-2.5"
                ref={filterMenuRef}
              >
                <div className="relative inline-flex items-center gap-2 flex-wrap text-left">
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterOpen((prev) => !prev);
                    }}
                    className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-play active:scale-95 group"
                    title={isEn ? 'Domain Filter' : 'Bộ lọc lĩnh vực'}
                    aria-label={isEn ? 'Domain Filter' : 'Bộ lọc lĩnh vực'}
                    aria-expanded={isFilterOpen}
                    aria-haspopup="listbox"
                  >
                    <WebIcon
                      name="sliders"
                      className="w-4 h-4 text-[var(--color-primary)] shrink-0"
                    />
                    <span>{isEn ? 'Domain Filter' : 'Bộ lọc lĩnh vực'}</span>
                    <WebIcon
                      name="chevron-down"
                      className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                        isFilterOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsTechModalOpen(true);
                    }}
                    className="banner-control-pill h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full transition-colors cursor-pointer typo-button font-play active:scale-95"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span>{isEn ? 'Tech Ecosystem' : 'Hệ sinh thái công nghệ'}</span>
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        id="services-filter-dropdown"
                        role="listbox"
                        className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14.5rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                      >
                        {filterCategories.map((cat) => {
                          const isActive = activeCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              data-selected={isActive ? 'true' : 'false'}
                              onClick={() => {
                                setIsFilterOpen(false);
                                if (cat.id === 'ALL') {
                                  if (expandedDomain) {
                                    closeExpandedCard();
                                  } else {
                                    SoundEngine.playTap();
                                    setActiveCategory('ALL');
                                  }
                                } else {
                                  const found = DOMAINS_DATA.find((d) => d.id === cat.id);
                                  if (!found) return;
                                  if (expandedDomain && animPhase === 'open') {
                                    switchExpandedDomain(found);
                                  } else {
                                    openExpandedCard(found);
                                  }
                                }
                              }}
                              className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left ${
                                isActive ? 'font-bold shadow-xs' : ''
                              }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <WebIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{cat.label}</span>
                              </span>
                              {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}

                        <div className="h-[1px] bg-[var(--border-subcard)] my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setIsFilterOpen(false);
                            setIsTechModalOpen(true);
                          }}
                          className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play text-[var(--text-link,var(--color-primary))] transition-all cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <WebIcon name="cpu" className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              {isEn ? 'Tech Stack Ecosystem' : 'Hệ Sinh Thái Công Nghệ'}
                            </span>
                          </span>
                          <WebIcon name="chevron-right" className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {expandedDomain && (
                  <button
                    type="button"
                    onClick={closeExpandedCard}
                    className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-play cursor-pointer transition active:scale-95"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back to 6 Domains' : 'Quay lại 6 thẻ lĩnh vực'}</span>
                  </button>
                )}
              </div>
            </motion.div>

            {/* 2. VÙNG LƯỚI 6 THẺ LĨNH VỰC + THẺ MỞ RỘNG MORPH FLIP TỪ VỊ TRÍ GỐC */}
            <div
              id="services-cards-wrapper"
              ref={cardsWrapperRef}
              className="relative w-full lg:flex-1 lg:min-h-0 flex flex-col"
              style={wrapperMinHeight ? { minHeight: `${wrapperMinHeight}px` } : undefined}
            >
              {/* Lưới 6 Thẻ Lĩnh Vực (3 cột x 2 hàng Desktop / 2 cột Tablet / 1 cột Mobile) */}
              <div
                id="services-cards-grid"
                ref={cardsGridRef}
                className={`services-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch w-full lg:flex-1 min-w-0 ${
                  isGridDimmed ? 'grid-dimmed' : ''
                }`}
              >
                {DOMAINS_DATA.map((domain) => {
                  const meta = DOMAIN_UI_META[domain.id] || DOMAIN_UI_META['01'];
                  const accentColor = getAccentColor(domain.id);
                  const cardTitle = isEn && domain.titleEn ? domain.titleEn : domain.title;
                  const shortCardTitle = isEn
                    ? meta.shortTitleEn
                    : domain.title;
                  const summaryText = isEn
                    ? domain.subtitleEn || domain.descEn
                    : domain.coreCompetency || domain.subtitle;
                  const serviceImage = domain.customIllustrationUrl || meta.illustrationSrc;
                  const tagsList = (isEn ? meta.tagsEn : meta.tags).slice(0, 2);

                  return (
                    <div
                      key={domain.id}
                      ref={(el) => {
                        cardRefs.current[domain.id] = el;
                      }}
                      id={getCardDomId(domain.id)}
                      data-element-type="card"
                      data-section-card="true"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => openExpandedCard(domain, e.currentTarget)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openExpandedCard(domain, e.currentTarget);
                        }
                      }}
                      style={{
                        background: isLeatherTheme
                          ? undefined
                          : isLight
                            ? meta.cardBgLight
                            : meta.cardBgDark,
                        borderColor: isLeatherTheme
                          ? undefined
                          : isLight
                            ? meta.borderLight
                            : meta.borderDark,
                      }}
                      className="service-card domain-card bento-card glass-card group relative rounded-[20px] p-[15px] box-border min-h-[250px] sm:min-h-[268px] lg:min-h-0 h-full w-full flex flex-col justify-between gap-2.5 text-left"
                    >
                      {/* Góc trên phải: Nút chỉ dấu mở rộng toàn khung */}
                      <span
                        aria-hidden="true"
                        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)]/80 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:scale-105 flex items-center justify-center transition-all duration-200"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>

                      {/* Tầng 1: Trái (Tiêu đề 2 dòng: Hàng 1 Icon + Tiêu đề | Hàng 2 Tiêu đề) | Phải (Hình minh họa nổi bật + Halo) */}
                      <div className="relative z-10 flex items-center justify-between gap-3 pt-0.5 pr-7 min-w-0">
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <h3
                            className="service-title-text card-title-synced typo-h4 font-play font-bold tracking-tight leading-snug m-0 break-words"
                            data-card-title="true"
                            style={{ color: accentColor }}
                            title={cardTitle}
                          >
                            {renderTwoLineTitle(
                              isEn ? shortCardTitle : domain.title,
                              meta.iconKey,
                              accentColor
                            )}
                          </h3>
                        </div>

                        {/* Ảnh minh họa tách nền trên quầng sáng domain */}
                        <div className="relative w-[84px] h-[84px] sm:w-[94px] sm:h-[94px] shrink-0 flex items-center justify-center">
                          <div
                            className="service-ambient-glow absolute inset-1 rounded-full blur-xl opacity-45 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"
                            style={{ background: meta.gradient }}
                          />
                          <img
                            src={serviceImage}
                            alt={cardTitle}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              if (e.currentTarget.src !== meta.fallbackIllustration) {
                                e.currentTarget.src = meta.fallbackIllustration;
                              }
                            }}
                            className="service-img-pop relative z-10 w-full h-full object-contain drop-shadow-[0_10px_16px_rgba(15,23,42,0.22)] select-none pointer-events-none"
                          />
                        </div>
                      </div>

                      {/* Tầng 2: 2 Ô KPI Nổi Bật Song Song (.domain-card-sub) */}
                      <div className="relative z-10 grid grid-cols-2 gap-2.5 w-full">
                        {meta.frontMetrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="domain-card-sub rounded-xl px-2.5 py-2 flex flex-col justify-center min-w-0"
                          >
                            <span
                              className="typo-body-sm sm:typo-body font-bold leading-tight truncate"
                              style={{ color: accentColor }}
                            >
                              {isEn && m.valueEn ? m.valueEn : m.value}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                              {isEn ? m.labelEn : m.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tầng 3: Tóm tắt giá trị cốt lõi (2 dòng gọn gàng) */}
                      <p
                        id={`service-card-desc-${domain.id}`}
                        className="relative z-10 typo-caption sm:typo-body-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 m-0"
                        title={summaryText}
                      >
                        {summaryText}
                      </p>

                      {/* Tầng 4: Footer Hashtags + Logo Doanh Nghiệp Tiêu Biểu */}
                      <div className="service-divider relative z-10 pt-2 border-t border-[var(--border-subcard)] flex items-center justify-between gap-2 shrink-0 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0 overflow-hidden">
                          {tagsList.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-full border truncate max-w-[110px]"
                              style={{
                                backgroundColor: isLight ? meta.tintBgLight : meta.tintBgDark,
                                borderColor: isLight ? meta.borderLight : meta.borderDark,
                                color: isLight ? meta.pillTextLight : meta.pillTextDark,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {(domain.companyLogos || []).slice(0, 4).map((partner, pIdx) => (
                            <div
                              key={partner.name || pIdx}
                              title={partner.name}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-white dark:bg-slate-800 border border-[var(--border-subcard)] flex items-center justify-center shrink-0 shadow-xs"
                            >
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  if (
                                    partner.fallbackLogo &&
                                    e.currentTarget.src !== partner.fallbackLogo
                                  ) {
                                    e.currentTarget.src = partner.fallbackLogo;
                                  } else {
                                    e.currentTarget.style.display = 'none';
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. THẺ CHI TIẾT MỞ RỘNG FLIP MORPH (PHÓNG TO TỪ ĐÚNG THẺ GỐC PHỦ TOÀN BỘ THẺ CHÍNH) */}
          {expandedDomain && expandedMeta && morphRect && (
            <div
              id="services-expanded-card"
              ref={expandedCardRef}
              data-element-type="card"
              role="region"
              aria-label={
                isEn && expandedDomain.titleEn ? expandedDomain.titleEn : expandedDomain.title
              }
              className={`domain-card-expanded ${
                animPhase === 'entering'
                  ? ''
                  : animPhase === 'open'
                    ? 'is-animating is-open'
                    : animPhase === 'closing'
                      ? 'is-animating is-closing'
                      : ''
              }`}
              style={{
                top: `${morphRect.top}px`,
                left: `${morphRect.left}px`,
                width: `${morphRect.width}px`,
                height: `${morphRect.height}px`,
                borderRadius:
                  animPhase === 'open'
                    ? 'var(--radius-main, 30px)'
                    : 'var(--radius-card, 20px)',
                zIndex: 50,
              }}
            >
                  {/* Header của thẻ chi tiết */}
                  <div
                    className="expanded-detail-content shrink-0 px-4 sm:px-5 py-3.5 border-b border-[var(--border-subcard)] flex flex-wrap items-center justify-between gap-3"
                    style={{
                      background: isLeatherTheme
                        ? undefined
                        : isLight
                          ? expandedMeta.tintBgLight
                          : expandedMeta.tintBgDark,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                        <div
                          className="absolute inset-0 rounded-full blur-md opacity-50 pointer-events-none"
                          style={{ background: expandedMeta.gradient }}
                        />
                        <img
                          src={expandedDomain.customIllustrationUrl || expandedMeta.illustrationSrc}
                          alt={expandedDomain.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== expandedMeta.fallbackIllustration) {
                              e.currentTarget.src = expandedMeta.fallbackIllustration;
                            }
                          }}
                          className="relative z-10 w-full h-full object-contain drop-shadow-md select-none"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="inline-flex items-center gap-1.5 typo-badge font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)]">
                            {renderDomainIcon(expandedMeta.iconKey, 'w-3.5 h-3.5 shrink-0', expandedAccent)}
                            <span>{isEn ? 'In-Depth Profile' : 'Hồ sơ chuyên sâu'}</span>
                          </span>
                        </div>
                        <h2
                          className="typo-h3 sm:typo-h2 font-play font-bold tracking-tight truncate m-0"
                          style={{ color: expandedAccent }}
                        >
                          {isEn && expandedDomain.titleEn
                            ? expandedDomain.titleEn
                            : expandedDomain.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setIsTechModalOpen(true);
                        }}
                        className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full typo-button font-play cursor-pointer transition active:scale-95"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {isEn ? 'Tech Stack' : 'Công nghệ'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={closeExpandedCard}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-play font-semibold text-white cursor-pointer transition hover:opacity-95 active:scale-95 shadow-sm"
                        style={{ background: expandedMeta.gradient }}
                        aria-label={isEn ? 'Minimize domain details' : 'Thu nhỏ chi tiết lĩnh vực'}
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Minimize' : 'Thu nhỏ'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Thân nội dung chi tiết (Cuộn nội bộ mượt mà) */}
                  <div
                    ref={expandedBodyRef}
                    className="expanded-detail-content flex-1 min-h-0 overflow-y-auto glass-scrollbar p-[15px] flex flex-col gap-[15px]"
                  >
                    {/* Hàng 1: 4 Thẻ KPI Trọng Tâm (Icon bỏ đóng khung, đặt cùng hàng với % / chỉ số) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px] shrink-0">
                      {expandedMeta.detailKpis.map((kpi, kIdx) => (
                        <div
                          key={kIdx}
                          data-subcard="true"
                          className="domain-card-sub rounded-2xl p-3 flex flex-col justify-center gap-1 min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="inline-flex items-center shrink-0"
                              style={{ color: expandedAccent }}
                            >
                              {renderKpiIcon(kpi.icon, 'w-5 h-5 shrink-0')}
                            </span>
                            <div
                              className="typo-h4 font-bold leading-tight truncate tabular-nums"
                              style={{ color: expandedAccent }}
                            >
                              {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                            </div>
                          </div>
                          <div className="typo-caption text-[var(--text-secondary)] leading-snug line-clamp-2">
                            {isEn ? kpi.labelEn : kpi.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hàng 2 & 3: 5 Thẻ Chuyên Đề Độc Lập + Thẻ Từ Khóa Năng Lực */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch flex-1 min-h-0">
                      {/* Thẻ 1: Quy mô vận hành */}
                      <div
                        data-subcard="true"
                        className="domain-card-sub lg:col-span-6 rounded-2xl p-[15px] flex flex-col gap-2.5 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className="w-4.5 h-4.5 shrink-0"
                            style={{ color: expandedAccent }}
                          />
                          <h3
                            className="typo-h4 font-play font-bold m-0"
                            style={{ color: expandedAccent }}
                          >
                            {isEn ? 'Operational Scale & Scope' : 'Quy mô vận hành'}
                          </h3>
                        </div>
                        <ul className="space-y-2 m-0 p-0 list-none">
                          {(expandedDomain.scaleAndScope || []).map((item, sIdx) => (
                            <li
                              key={sIdx}
                              className="flex items-start gap-2 typo-body-sm text-[var(--text-primary)] leading-relaxed"
                            >
                              <CheckCircle2
                                className="w-4 h-4 mt-0.5 shrink-0 opacity-85"
                                style={{ color: expandedAccent }}
                              />
                              <span className="min-w-0">
                                <strong className="font-semibold text-[var(--text-primary)]">
                                  {item.label}:{' '}
                                </strong>
                                <span className="text-[var(--text-secondary)]">
                                  {item.content}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Thẻ 2: Thách thức đặc thù */}
                      <div
                        data-subcard="true"
                        className="domain-card-sub lg:col-span-6 rounded-2xl p-[15px] flex flex-col gap-2.5 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: expandedMeta.gradient }}
                          />
                          <h3 className="typo-h4 font-play font-bold m-0 text-[var(--text-primary)]">
                            {expandedDomain.id === '06'
                              ? isEn
                                ? 'Strategic Transformation Scope'
                                : 'Bài toán chuyển đổi đặc thù'
                              : isEn
                                ? 'Specific Operational Challenges'
                                : 'Thách thức đặc thù'}
                          </h3>
                        </div>
                        <ul className="space-y-2 m-0 p-0 list-none">
                          {(expandedDomain.operationalChallenges || []).map((ch, cIdx) => (
                            <li
                              key={cIdx}
                              className="flex items-start gap-2.5 typo-body-sm text-[var(--text-secondary)] leading-relaxed"
                            >
                              <span
                                className="w-2 h-2 rounded-full mt-2 shrink-0"
                                style={{ background: expandedMeta.gradient }}
                              />
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Thẻ 3: Công nghệ quản trị */}
                      <div
                        data-subcard="true"
                        className="domain-card-sub lg:col-span-4 rounded-2xl p-[15px] flex flex-col gap-2.5 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench
                            className="w-4 h-4 shrink-0"
                            style={{ color: expandedAccent }}
                          />
                          <h3 className="typo-h4 font-play font-bold m-0 text-[var(--text-primary)]">
                            {isEn ? 'Management Platforms' : 'Công nghệ quản trị'}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(expandedDomain.tools || []).map((tool, tIdx) => (
                            <span
                              key={tIdx}
                              className="typo-caption font-semibold px-2.5 py-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-primary)]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Thẻ 4: Doanh nghiệp tiêu biểu */}
                      <div
                        data-subcard="true"
                        className="domain-card-sub lg:col-span-4 rounded-2xl p-[15px] flex flex-col gap-2.5 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <Building2
                            className="w-4 h-4 shrink-0"
                            style={{ color: expandedAccent }}
                          />
                          <h3 className="typo-h4 font-play font-bold m-0 text-[var(--text-primary)]">
                            {isEn ? 'Representative Enterprises' : 'Doanh nghiệp tiêu biểu'}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {(expandedDomain.companyLogos || []).map((partner, pIdx) => (
                            <div
                              key={partner.name || pIdx}
                              className="inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)]"
                            >
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-white dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    if (
                                      partner.fallbackLogo &&
                                      e.currentTarget.src !== partner.fallbackLogo
                                    ) {
                                      e.currentTarget.src = partner.fallbackLogo;
                                    } else {
                                      e.currentTarget.style.display = 'none';
                                    }
                                  }}
                                />
                              </div>
                              <span className="typo-caption font-semibold text-[var(--text-primary)]">
                                {partner.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Thẻ 5: Vai trò đảm nhiệm */}
                      <div
                        data-subcard="true"
                        className="domain-card-sub lg:col-span-4 rounded-2xl p-[15px] flex flex-col gap-2.5 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck
                            className="w-4 h-4 shrink-0"
                            style={{ color: expandedAccent }}
                          />
                          <h3 className="typo-h4 font-play font-bold m-0 text-[var(--text-primary)]">
                            {isEn ? 'Leadership Roles Held' : 'Vai trò đảm nhiệm'}
                          </h3>
                        </div>
                        <p className="typo-body-sm font-medium text-[var(--text-secondary)] leading-relaxed m-0">
                          {expandedDomain.typicalRolesLine ||
                            (expandedDomain.rolesHeld || []).join(' · ')}
                        </p>
                      </div>

                      {/* Panel Tinted: Từ khóa năng lực & Giá trị cốt lõi */}
                      <div
                        data-subcard="true"
                        className="lg:col-span-12 rounded-2xl p-[15px] border flex flex-col gap-2.5 min-w-0 justify-between"
                        style={{
                          backgroundColor: isLeatherTheme
                            ? undefined
                            : isLight
                              ? expandedMeta.tintBgLight
                              : expandedMeta.tintBgDark,
                          borderColor: isLeatherTheme
                            ? 'var(--border-subcard)'
                            : isLight
                              ? expandedMeta.borderLight
                              : expandedMeta.borderDark,
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag
                              className="w-4 h-4 shrink-0"
                              style={{ color: expandedAccent }}
                            />
                            <h3
                              className="typo-h4 font-play font-bold m-0"
                              style={{ color: expandedAccent }}
                            >
                              {isEn ? 'Capability Keywords' : 'Từ khóa năng lực'}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).map((tag) => (
                              <span
                                key={tag}
                                className="typo-badge font-bold px-2.5 py-1 rounded-full border bg-[var(--bg-card)]/75"
                                style={{
                                  borderColor: isLight
                                    ? expandedMeta.borderLight
                                    : expandedMeta.borderDark,
                                  color: expandedAccent,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {(expandedDomain.summaryNote || expandedDomain.valueDelivered) && (
                          <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0 pt-2 border-t border-[var(--border-subcard)]/70">
                            {expandedDomain.valueDelivered || expandedDomain.summaryNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer bar: Chuyển nhanh lĩnh vực 01 - 06 */}
                  <div className="expanded-detail-content shrink-0 px-4 sm:px-5 py-2.5 border-t border-[var(--border-subcard)] bg-[var(--bg-subcard)]/65 flex items-center justify-between gap-2 flex-wrap">
                    <span className="typo-caption font-semibold text-[var(--text-secondary)]">
                      {isEn ? 'Quick domain switch:' : 'Chuyển nhanh lĩnh vực:'}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {DOMAINS_DATA.map((item) => {
                        const itemMeta = DOMAIN_UI_META[item.id] || DOMAIN_UI_META['01'];
                        const isActiveItem = item.id === expandedDomain.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => switchExpandedDomain(item)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-caption font-semibold transition-all cursor-pointer active:scale-95 ${
                              isActiveItem
                                ? 'text-white shadow-sm'
                                : 'bg-[var(--bg-card)]/80 hover:bg-[var(--bg-subcard)] text-[var(--text-secondary)] border border-[var(--border-subcard)]'
                            }`}
                            style={isActiveItem ? { background: itemMeta.gradient } : undefined}
                          >
                            {renderDomainIcon(
                              itemMeta.iconKey,
                              `w-3 h-3 ${isActiveItem ? 'text-white' : ''}`
                            )}
                            <span>{isEn ? itemMeta.shortTitleEn : itemMeta.shortTitle}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>

      {/* 4. MODAL KHÁM PHÁ TECH STACK */}
      <TechStackExplorerModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />
    </div>
  );
};

export default ServicesView;
