'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { Sparkles, Info } from 'lucide-react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const ArrowRight = createAnimatedIcon('arrow-right');
const Smartphone = createAnimatedIcon('smartphone');
const ShoppingBag = createAnimatedIcon('shopping-bag');
const ShieldCheck = createAnimatedIcon('shield-check');
const Gamepad2 = createAnimatedIcon('gamepad-2');
const Wallet = createAnimatedIcon('wallet');
const Cpu = createAnimatedIcon('cpu');
const Minimize2 = createAnimatedIcon('minimize-2');
const Users = createAnimatedIcon('users');
const Zap = createAnimatedIcon('zap');
const Clock = createAnimatedIcon('clock');
const Smile = createAnimatedIcon('smile');
const TrendingUp = createAnimatedIcon('trending-up');
const Activity = createAnimatedIcon('activity');
const Layers = createAnimatedIcon('layers');
const Award = createAnimatedIcon('award');
const HeartHandshake = createAnimatedIcon('heart-handshake');
const RotateCcw = createAnimatedIcon('rotate-ccw');
import { DOMAINS_DATA, DOMAINS_INTRO } from '@/data/services';
import { DomainData, SiteTheme } from '@/types';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import { useBannerVideo } from '@/context/BannerVideoContext';
import { ServiceDomainKey } from '@/utils/bannerVideoMatcher';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import {
  ServiceExpandedDetail,
  formatFourWordSentenceCase,
  type BentoFxMode,
  type DomainIconKey,
  type KpiIconKey,
  type DomainUiMeta,
  type ServiceInteractionState,
} from '@/components/views/services/ServiceExpandedDetail';

export interface ServicesViewProps {
  currentTheme?: SiteTheme;
}

const DOMAIN_UI_META: Record<string, DomainUiMeta> = {
  '01': {
    shortTitle: 'Dịch vụ viễn thông',
    shortTitleEn: 'Telecom contact center ops',
    iconKey: 'smartphone',
    accentLight: '#8b5cf6',
    accentDark: '#a78bfa',
    cardGradient: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.92) 55%, rgba(15, 23, 42, 0.96) 100%)',
    tintBg: 'rgba(139, 92, 246, 0.22)',
    isLightCard: false,
    illustrationSrc: 'https://i.postimg.cc/05cJC8p7/Vien-thong-di-dong.webp',
    fallbackIllustration: 'https://i.postimg.cc/05cJC8p7/Vien-thong-di-dong.webp',
    detailKpis: [
      { icon: 'shield-check', value: '> 98%', label: 'SLA tiếp nhận cuộc gọi', labelEn: 'Call Answer SLA' },
      { icon: 'smile', value: '96,5%', label: 'Chỉ số hài lòng (CSAT)', labelEn: 'Customer Satisfaction' },
      { icon: 'trending-up', value: '-20%', valueEn: '-20%', label: 'Chi phí khiếu nại cước', labelEn: 'Dispute Handling Cost' },
      { icon: 'users', value: '< 3%', label: 'Tỷ lệ nghỉ việc nhân sự', labelEn: 'Staff Attrition Rate' },
    ],
    tags: ['#ContactCenter', '#VienThong', '#24x7Ops', '#QASOP'],
    tagsEn: ['#ContactCenter', '#TelecomCX', '#24x7Ops', '#QASOP'],
  },
  '02': {
    shortTitle: 'Thương mại điện tử',
    shortTitleEn: 'Digital commerce support ops',
    iconKey: 'shopping-bag',
    accentLight: '#f97316',
    accentDark: '#fb923c',
    cardGradient: 'linear-gradient(135deg, rgba(124, 45, 18, 0.95) 0%, rgba(234, 88, 12, 0.92) 55%, rgba(69, 26, 3, 0.96) 100%)',
    tintBg: 'rgba(249, 115, 22, 0.24)',
    isLightCard: false,
    illustrationSrc: 'https://i.postimg.cc/FFDJx9jD/Thuong-mai-dien-tu.webp',
    fallbackIllustration: 'https://i.postimg.cc/FFDJx9jD/Thuong-mai-dien-tu.webp',
    detailKpis: [
      { icon: 'clock', value: '< 30s', valueEn: '< 30s', label: 'Thời gian chờ kênh Chat', labelEn: 'Chat Queue Wait Time' },
      { icon: 'smile', value: '96,5%', label: 'Chỉ số hài lòng (CSAT)', labelEn: 'CSAT Improvement' },
      { icon: 'rotate-ccw', value: '-30%', label: 'Tỷ lệ hủy đơn chậm hỗ trợ', labelEn: 'Support-Delay Cancellations' },
      { icon: 'trending-up', value: '-25%', label: 'Chi phí Cost-to-Serve', labelEn: 'Cost-to-Serve Savings' },
    ],
    tags: ['#Omnichannel', '#MegaSale', '#FraudControl', '#DisputeOps'],
    tagsEn: ['#Omnichannel', '#MegaSale', '#FraudControl', '#DisputeOps'],
  },
  '03': {
    shortTitle: 'Tài chính bảo hiểm',
    shortTitleEn: 'Finance insurance quality ops',
    iconKey: 'shield-check',
    accentLight: '#10b981',
    accentDark: '#34d399',
    cardGradient: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(5, 150, 105, 0.92) 55%, rgba(2, 44, 34, 0.96) 100%)',
    tintBg: 'rgba(16, 185, 129, 0.22)',
    isLightCard: false,
    illustrationSrc: 'https://i.postimg.cc/2y8LfJf1/Dich-vu-bao-hiem.webp',
    fallbackIllustration: 'https://i.postimg.cc/2y8LfJf1/Dich-vu-bao-hiem.webp',
    detailKpis: [
      { icon: 'zap', value: '-45%', label: 'Rút ngắn thời gian xử lý', labelEn: 'Contract Cycle Time' },
      { icon: 'shield-check', value: '> 92%', label: 'Giải quyết lần đầu (FCR)', labelEn: 'First Contact Resolution' },
      { icon: 'heart-handshake', value: '+15%', label: 'Cải thiện duy trì hợp đồng', labelEn: 'Policy Retention Gain' },
      { icon: 'award', value: '95%', label: 'Cam kết chất lượng (SLA)', labelEn: 'Service Level Agreement' },
    ],
    tags: ['#FinanceQA', '#Compliance', '#BaoHiem', '#RiskControl'],
    tagsEn: ['#FinanceQA', '#Compliance', '#InsuranceCX', '#RiskControl'],
  },
  '04': {
    shortTitle: 'Thể thao điện tử',
    shortTitleEn: 'Esports gaming support ops',
    iconKey: 'gamepad-2',
    accentLight: '#ec4899',
    accentDark: '#f472b6',
    cardGradient: 'linear-gradient(135deg, rgba(131, 24, 67, 0.95) 0%, rgba(219, 39, 119, 0.92) 55%, rgba(59, 7, 100, 0.96) 100%)',
    tintBg: 'rgba(236, 72, 153, 0.22)',
    isLightCard: false,
    illustrationSrc: 'https://i.postimg.cc/cC4tNjNr/The-thao-dien-tu.webp',
    fallbackIllustration: 'https://i.postimg.cc/cC4tNjNr/The-thao-dien-tu.webp',
    detailKpis: [
      { icon: 'users', value: '~130', label: 'Nhân sự Game Support', labelEn: 'Game Support & Fraud Team' },
      { icon: 'activity', value: '> 50.000', label: 'Yêu cầu hỗ trợ mỗi ngày', labelEn: 'Daily Support Tickets' },
      { icon: 'clock', value: '< 30s', valueEn: '< 30s', label: 'Phản hồi đầu Ticket/Chat', labelEn: 'First Response Time' },
      { icon: 'smile', value: '96%', label: 'Chỉ số hài lòng người chơi', labelEn: 'Player CSAT Score' },
    ],
    tags: ['#GameSupport', '#AccountSecurity', '#CongDong', '#EsportsOps'],
    tagsEn: ['#GameSupport', '#AccountSecurity', '#Community', '#EsportsOps'],
  },
  '05': {
    shortTitle: 'Thanh toán ví điện',
    shortTitleEn: 'Fintech digital payment ops',
    iconKey: 'wallet',
    accentLight: '#0ea5e9',
    accentDark: '#38bdf8',
    cardGradient: 'linear-gradient(135deg, rgba(12, 74, 110, 0.95) 0%, rgba(2, 132, 199, 0.92) 55%, rgba(8, 47, 73, 0.96) 100%)',
    tintBg: 'rgba(14, 165, 233, 0.22)',
    isLightCard: false,
    illustrationSrc: 'https://i.postimg.cc/zvtbDjJV/Thanh-toan-dien-tu.webp',
    fallbackIllustration: 'https://i.postimg.cc/zvtbDjJV/Thanh-toan-dien-tu.webp',
    detailKpis: [
      { icon: 'zap', value: '48h → 90s', label: 'Tự động hoàn tiền bằng RPA', labelEn: 'Automated RPA Refund' },
      { icon: 'smile', value: '98,2%', label: 'Chỉ số hài lòng (CSAT)', labelEn: 'Digital Finance CSAT' },
      { icon: 'award', value: '98,6%', label: 'SLA BPO (>150 vị trí)', labelEn: 'BPO Operations SLA' },
      { icon: 'shield-check', value: '-35%', label: 'Giảm tỷ lệ sự cố vận hành', labelEn: 'Incident Reduction' },
    ],
    tags: ['#FintechOps', '#ViDienTu', '#ThanhToanSo', '#CoreBanking'],
    tagsEn: ['#FintechOps', '#EWallet', '#DigitalPay', '#CoreBanking'],
  },
  '06': {
    shortTitle: 'Xây dựng hệ thống',
    shortTitleEn: 'System architecture cx ops',
    iconKey: 'cpu',
    accentLight: '#6366f1',
    accentDark: '#818cf8',
    cardGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 55%, rgba(49, 46, 129, 0.96) 100%)',
    tintBg: 'rgba(99, 102, 241, 0.22)',
    isLightCard: false,
    illustrationSrc: 'https://i.postimg.cc/L4NZVHzT/Xay-dung-he-thong.webp',
    fallbackIllustration: 'https://i.postimg.cc/L4NZVHzT/Xay-dung-he-thong.webp',
    detailKpis: [
      { icon: 'layers', value: '10–150+', label: 'Quy mô Contact Center', labelEn: 'Contact Center Seats Built' },
      { icon: 'clock', value: '-65%', label: 'Rút ngắn thời gian Onboarding', labelEn: 'Onboarding Time Saved' },
      { icon: 'trending-up', value: '+40%', label: 'Cải thiện hiệu suất vận hành', labelEn: 'Operational Efficiency' },
      { icon: 'award', value: 'Value Center', label: 'Chuyển đổi Cost → Value', labelEn: 'Cost-to-Value Shift' },
    ],
    tags: ['#CXStrategy', '#SOPMatrix', '#AICopilot', '#ValueCenter'],
    tagsEn: ['#CXStrategy', '#SOPMatrix', '#AICopilot', '#ValueCenter'],
  },
};

const CARD_EFFECT_MODES: { id: BentoFxMode; labelVi: string; labelEn: string }[] = [
  { id: 'spotlight-3d', labelVi: 'Hiệu ứng: Ánh sáng 3D', labelEn: 'FX: 3D Spotlight' },
  { id: 'float-shadow', labelVi: 'Hiệu ứng: Nổi Khối & Đổ Bóng', labelEn: 'FX: Float & Shadow' },
  { id: 'neon', labelVi: 'Hiệu ứng: Viền Neon', labelEn: 'FX: Neon Border' },
  { id: 'minimal', labelVi: 'Hiệu ứng: Tối Giản', labelEn: 'FX: Minimal' },
];

interface DomainBentoTemplate {
  cardBgClass: string;
  cardBgCss: string;
  orbClass: string;
  iconColor: string;
  titleGradient?: boolean;
  badgeClass: string;
  descClass: string;
  ctaClass: string;
  ringClass: string;
  dividerColor: string;
}

/**
 * Ánh xạ 6 mẫu thẻ Creator Studio Bento cho 6 thẻ Lĩnh vực Dịch vụ:
 * 01 → Thẻ 1 (Hero Purple → Indigo)
 * 02 → Thẻ 32 / 45 (Vibrant Rose → Orange → Amber)
 * 03 → Thẻ 3 / 16 (Emerald → Teal Zero-Trust)
 * 04 → Thẻ 6 / 10 (Pink → Rose → Purple + Gradient Title Accent)
 * 05 → Thẻ 14 / 19 (Cyan → Blue → Indigo Edge)
 * 06 → Thẻ 73 / 25 (Slate → Indigo → Violet Architect)
 */
const DOMAIN_BENTO_TEMPLATES: Record<string, DomainBentoTemplate> = {
  '01': {
    cardBgClass: 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900',
    cardBgCss: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #312e81 100%)',
    orbClass: 'bg-white/15',
    iconColor: '#e9d5ff',
    badgeClass: 'bg-purple-950/60 border border-purple-400/35 text-purple-100',
    descClass: 'text-purple-100/90',
    ctaClass: 'bg-purple-950/60 group-hover:bg-purple-900 border border-purple-400/35 text-white',
    ringClass: 'ring-2 ring-purple-950/70',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
  '02': {
    cardBgClass: 'bg-gradient-to-br from-rose-600 via-orange-600 to-amber-600',
    cardBgCss: 'linear-gradient(135deg, #e11d48 0%, #ea580c 52%, #d97706 100%)',
    orbClass: 'bg-yellow-300/25',
    iconColor: '#fef08a',
    badgeClass: 'bg-black/25 border border-white/25 text-amber-100',
    descClass: 'text-orange-50/90',
    ctaClass: 'bg-white/95 group-hover:bg-white border border-white/60 text-orange-700 shadow-sm',
    ringClass: 'ring-2 ring-orange-950/60',
    dividerColor: 'rgba(255, 255, 255, 0.2)',
  },
  '03': {
    cardBgClass: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950',
    cardBgCss: 'linear-gradient(135deg, #059669 0%, #0f766e 52%, #022c22 100%)',
    orbClass: 'bg-emerald-300/20',
    iconColor: '#a7f3d0',
    badgeClass: 'bg-black/25 border border-emerald-300/35 text-emerald-100',
    descClass: 'text-emerald-100/90',
    ctaClass: 'bg-emerald-500/25 group-hover:bg-emerald-500/40 border border-emerald-300/40 text-emerald-50',
    ringClass: 'ring-2 ring-emerald-950/75',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
  '04': {
    cardBgClass: 'bg-gradient-to-br from-pink-600 via-rose-600 to-purple-800',
    cardBgCss: 'linear-gradient(135deg, #db2777 0%, #e11d48 50%, #6b21a8 100%)',
    orbClass: 'bg-yellow-300/30',
    iconColor: '#fde047',
    titleGradient: true,
    badgeClass: 'bg-black/25 border border-pink-200/30 text-yellow-200',
    descClass: 'text-pink-100/90',
    ctaClass: 'bg-white/15 group-hover:bg-white/25 border border-white/25 text-yellow-200',
    ringClass: 'ring-2 ring-purple-950/75',
    dividerColor: 'rgba(255, 255, 255, 0.18)',
  },
  '05': {
    cardBgClass: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900',
    cardBgCss: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 52%, #312e81 100%)',
    orbClass: 'bg-cyan-300/25',
    iconColor: '#a5f3fc',
    badgeClass: 'bg-white/15 border border-cyan-200/35 text-cyan-100',
    descClass: 'text-cyan-100/90',
    ctaClass: 'bg-white/15 group-hover:bg-white/25 border border-white/25 text-cyan-50',
    ringClass: 'ring-2 ring-indigo-950/75',
    dividerColor: 'rgba(255, 255, 255, 0.18)',
  },
  '06': {
    cardBgClass: 'bg-gradient-to-br from-slate-800 via-indigo-950 to-violet-950',
    cardBgCss: 'linear-gradient(135deg, #1e293b 0%, #1e1b4b 52%, #2e1065 100%)',
    orbClass: 'bg-indigo-400/25',
    iconColor: '#c7d2fe',
    badgeClass: 'bg-indigo-500/25 border border-indigo-400/40 text-indigo-200',
    descClass: 'text-indigo-100/85',
    ctaClass: 'bg-indigo-600/85 group-hover:bg-indigo-500 border border-indigo-400/40 text-white',
    ringClass: 'ring-2 ring-slate-950/80',
    dividerColor: 'rgba(255, 255, 255, 0.14)',
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

export const ServicesView: React.FC<ServicesViewProps> = () => {
  const { cardStyle, isDark } = useTheme();
  const { language, t } = useLanguage();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { serviceAssignments } = useBannerVideo();
  const servicesBannerVideo = getDefaultBannerVideoConfig('services');
  const isEn = language === 'en';
  const isLeatherTheme =
    cardStyle === 'cowhide-leather' || cardStyle === 'walnut-wood';
  const micaServiceAccents = ['#C65927', '#FF7C17', '#3ABA8F', '#EA1A7F', '#16D6FA', '#5274FF'];

  // Controlled interaction state machine: idle | hovered | expanding | expanded | closing
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [interactionState, setInteractionState] = useState<ServiceInteractionState>('idle');
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);
  const [gridNaturalHeight, setGridNaturalHeight] = useState<number | undefined>(undefined);
  const [isGridLayerHidden, setIsGridLayerHidden] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [fxIndex, setFxIndex] = useState<number>(0);
  const [fxToast, setFxToast] = useState<string | null>(null);
  const fxToastTimerRef = useRef<number | null>(null);
  const currentFx = CARD_EFFECT_MODES[fxIndex];

  const cycleCardEffectMode = useCallback(() => {
    SoundEngine.playTap();
    setFxIndex((prev) => {
      const nextIdx = (prev + 1) % CARD_EFFECT_MODES.length;
      const nextMode = CARD_EFFECT_MODES[nextIdx];
      const msg = isEn
        ? `Enabled ${nextMode.labelEn}`
        : `Đã bật ${nextMode.labelVi}`;
      setFxToast(msg);
      if (fxToastTimerRef.current) {
        window.clearTimeout(fxToastTimerRef.current);
      }
      fxToastTimerRef.current = window.setTimeout(() => {
        setFxToast(null);
      }, 2400);
      return nextIdx;
    });
  }, [isEn]);

  useEffect(() => {
    if (currentFx.id !== 'spotlight-3d') {
      Object.values(cardRefs.current).forEach((el) => {
        if (el) {
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        }
      });
    }
  }, [currentFx.id]);

  useEffect(() => {
    return () => {
      if (fxToastTimerRef.current) {
        window.clearTimeout(fxToastTimerRef.current);
      }
    };
  }, []);

  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const mainCardRef = useRef<HTMLDivElement | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const expandedCardRef = useRef<HTMLDivElement | null>(null);
  const expandedBodyRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((tId) => tId !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const expandedDomain = selectedDomainId
    ? DOMAINS_DATA.find((d) => d.id === selectedDomainId) || null
    : null;
  const expandedMeta = expandedDomain
    ? DOMAIN_UI_META[expandedDomain.id] || DOMAIN_UI_META['01']
    : null;

  const openExpandedCard = useCallback(
    (domain: DomainData) => {
      if (interactionState === 'expanding' || interactionState === 'closing') return;
      if (selectedDomainId === domain.id) return;

      clearTimers();
      SoundEngine.playTap();

      if (cardsGridRef.current && !isGridLayerHidden) {
        const measuredHeight = cardsGridRef.current.offsetHeight;
        if (measuredHeight > 0) {
          setGridNaturalHeight(measuredHeight);
        }
      }

      setHoveredDomainId(null);
      setActiveCategory(domain.id);
      setSelectedDomainId(domain.id);

      // Giữ vùng thẻ mở rộng trong tầm nhìn trên mobile/tablet
      if (scrollViewportRef.current && cardsWrapperRef.current) {
        const vpRect = scrollViewportRef.current.getBoundingClientRect();
        const wrapRect = cardsWrapperRef.current.getBoundingClientRect();
        if (wrapRect.top < vpRect.top) {
          scrollViewportRef.current.scrollTo({
            top: Math.max(0, scrollViewportRef.current.scrollTop + (wrapRect.top - vpRect.top)),
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
        }
      }

      if (prefersReducedMotion) {
        setIsGridLayerHidden(true);
        setInteractionState('expanded');
        scheduleTimer(() => {
          closeButtonRef.current?.focus({ preventScroll: true });
        }, 20);
        return;
      }

      setIsGridLayerHidden(false);
      setInteractionState('expanding');

      // Sau khi 5 card còn lại fade/scale out mượt mà, ẩn tầng lưới khỏi dòng chảy để thẻ mở rộng chiếm trọn vùng hiển thị
      scheduleTimer(() => {
        setIsGridLayerHidden(true);
      }, 420);

      scheduleTimer(() => {
        setInteractionState('expanded');
        closeButtonRef.current?.focus({ preventScroll: true });
      }, 620);
    },
    [interactionState, selectedDomainId, clearTimers, isGridLayerHidden, prefersReducedMotion, scheduleTimer]
  );

  const closeExpandedCard = useCallback(() => {
    if (!selectedDomainId || interactionState === 'closing' || interactionState === 'idle') return;

    clearTimers();
    SoundEngine.playTap();

    const closingId = selectedDomainId;
    setActiveCategory('ALL');
    setHoveredDomainId(null);

    if (prefersReducedMotion) {
      setIsGridLayerHidden(false);
      setSelectedDomainId(null);
      setInteractionState('idle');
      setGridNaturalHeight(undefined);
      scheduleTimer(() => {
        cardRefs.current[closingId]?.focus({ preventScroll: true });
      }, 20);
      return;
    }

    // Bước 1: Fade out nội dung chi tiết & bật lại tầng lưới nền để sẵn sàng đón Card thu nhỏ về ô cũ
    setInteractionState('closing');
    setIsGridLayerHidden(false);

    // Bước 2: Motion LayoutId FLIP morph Card trở về đúng vị trí trong lưới & 5 Card còn lại fade in
    scheduleTimer(() => {
      setSelectedDomainId(null);
    }, 180);

    // Bước 3: Hoàn tất khôi phục trạng thái Idle & trả focus bàn phím về đúng Card nguồn
    scheduleTimer(() => {
      setInteractionState('idle');
      setGridNaturalHeight(undefined);
      cardRefs.current[closingId]?.focus({ preventScroll: true });
    }, 760);
  }, [selectedDomainId, interactionState, clearTimers, prefersReducedMotion, scheduleTimer]);

  const switchExpandedDomain = useCallback(
    (domain: DomainData) => {
      if (interactionState === 'closing' || domain.id === selectedDomainId) return;
      SoundEngine.playTap();
      setSelectedDomainId(domain.id);
      setActiveCategory(domain.id);
      setInteractionState('expanded');
      setIsGridLayerHidden(true);
      if (expandedBodyRef.current) {
        expandedBodyRef.current.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [interactionState, selectedDomainId, prefersReducedMotion]
  );

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
      } else if (selectedDomainId) {
        closeExpandedCard();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen, selectedDomainId, closeExpandedCard]);

  const filterCategories = [
    { id: 'ALL', label: isEn ? 'All 6 Domains' : 'Tất cả 6 lĩnh vực', icon: 'grid' },
    { id: '01', label: isEn ? 'Telecom Services' : 'Dịch vụ Viễn thông', icon: 'phone' },
    { id: '02', label: isEn ? 'E-Commerce Ops' : 'Thương mại Điện tử', icon: 'shopping-cart' },
    { id: '04', label: isEn ? 'Esports & Gaming' : 'Thể thao Điện tử', icon: 'gamepad-2' },
    { id: '03', label: isEn ? 'Finance & Insurance' : 'Tài chính & Bảo hiểm', icon: 'shield-check' },
    { id: '05', label: isEn ? 'Digital Payments' : 'Thanh toán Ví Điện tử', icon: 'credit-card' },
    { id: '06', label: isEn ? 'System Architecture' : 'Xây dựng Hệ thống', icon: 'layers' },
  ];

  const layoutSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 120, damping: 23, mass: 1.05 };
  const isAnyCardExpanded = Boolean(selectedDomainId);

  const fxToastNode = fxToast ? (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div className="toast-enter pointer-events-auto flex items-center gap-3 bg-gray-900/95 backdrop-blur-md border border-purple-500/50 text-purple-300 px-4 py-3 rounded-xl shadow-2xl max-w-sm">
        <Info className="w-5 h-5 shrink-0 text-purple-400" />
        <span className="text-sm font-bold text-gray-100">{fxToast}</span>
      </div>
    </div>
  ) : null;

  return (
    <div
      id="services-page-container"
      data-fx={currentFx.id}
      data-element-name="Trang Dịch Vụ & Giải Pháp"
      data-element-type="container"
      data-element-page="services"
      data-element-parent="global-content-viewport"
      className={cn(
        'main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-visible no-scrollbar font-play select-none text-left rounded-[var(--radius-global,var(--radius-main,14px))] text-[var(--text-primary)] box-border',
        !isDark && 'services-bento-light-mode'
      )}
    >
      {typeof document !== 'undefined' && fxToastNode ? createPortal(fxToastNode, document.body) : fxToastNode}

      {/* Hệ CSS Creator Studio Bento: Font Play, đổ bóng đa tầng, 4 chế độ FX (Spotlight 3D, Nổi Khối, Neon, Tối Giản), Ripple & vi tương tác icon */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');

        .bento-unified-title,
        .service-title-text {
          font-family: 'Play', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.3 !important;
          font-weight: 700 !important;
          letter-spacing: 0em !important;
        }

        .gradient-text {
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
        }

        /* Cấu trúc, màu sắc & đổ bóng đa tầng Creator Studio cho 6 Thẻ Dịch Vụ (chống ghi đè bởi theme) */
        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"],
        html[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"],
        html.dark[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"] {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;
          font-family: 'Play', sans-serif;
          background: var(--bento-card-bg) !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          transform-style: preserve-3d;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease !important;
        }

        html #services-page-container.services-bento-light-mode .service-card.domain-card[data-multicolor-bento="true"] {
          color: #ffffff !important;
          box-shadow:
            0 16px 32px -10px rgba(15, 23, 42, 0.26),
            0 6px 14px -4px rgba(15, 23, 42, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:active {
          transform: translateY(-2px) scale(0.992) !important;
          box-shadow:
            0 8px 18px -6px rgba(0, 0, 0, 0.5),
            0 3px 8px -2px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        }

        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"] .service-title-text:not(.has-gradient-title),
        html[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"] .service-title-text:not(.has-gradient-title),
        html[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"] .service-title-text:not(.has-gradient-title) > span {
          color: #ffffff !important;
        }

        /* Lớp ánh sáng Spotlight bám theo con trỏ chuột */
        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(
            380px circle at var(--mx, 50%) var(--my, 50%),
            rgba(255, 255, 255, 0.16),
            rgba(168, 85, 247, 0.08) 40%,
            transparent 72%
          );
        }

        @media (hover: hover) and (pointer: fine) {
          /* Chế độ 1: Ánh sáng Spotlight + Nghiêng 3D + Nổi khối đổ bóng (Mặc định) */
          html #services-page-container[data-fx="spotlight-3d"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover {
            transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-10px) scale(1.018) !important;
            border-color: rgba(255, 255, 255, 0.28) !important;
            box-shadow:
              0 30px 50px -12px rgba(0, 0, 0, 0.62),
              0 14px 24px -8px rgba(0, 0, 0, 0.42),
              0 0 0 1px rgba(255, 255, 255, 0.24),
              0 0 32px -6px rgba(139, 92, 246, 0.38),
              inset 0 1px 0 rgba(255, 255, 255, 0.28) !important;
            transition:
              transform 0.14s ease-out,
              box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.3s ease !important;
          }

          html #services-page-container[data-fx="spotlight-3d"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover::before {
            opacity: 1;
          }

          /* Chế độ 2: Nổi Khối & Đổ Bóng Chuyên Sâu */
          html #services-page-container[data-fx="float-shadow"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover {
            transform: translateY(-12px) scale(1.024) !important;
            border-color: rgba(255, 255, 255, 0.28) !important;
            box-shadow:
              0 36px 60px -14px rgba(0, 0, 0, 0.68),
              0 18px 28px -10px rgba(0, 0, 0, 0.46),
              0 0 0 1px rgba(255, 255, 255, 0.26),
              inset 0 1px 0 rgba(255, 255, 255, 0.32) !important;
          }

          html #services-page-container[data-fx="float-shadow"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover::before {
            opacity: 0.75;
          }

          /* Chế độ 3: Viền Neon rực rỡ bám chuột + Nổi khối */
          html #services-page-container[data-fx="neon"] .service-card.domain-card[data-multicolor-bento="true"]::before {
            background: radial-gradient(
              340px circle at var(--mx, 50%) var(--my, 50%),
              rgba(56, 189, 248, 0.24),
              rgba(192, 132, 252, 0.16) 42%,
              transparent 72%
            );
          }

          html #services-page-container[data-fx="neon"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover {
            transform: translateY(-10px) scale(1.018) !important;
            border-color: rgba(192, 132, 252, 0.75) !important;
            box-shadow:
              0 28px 46px -12px rgba(0, 0, 0, 0.58),
              0 18px 34px -8px rgba(139, 92, 246, 0.48),
              0 0 26px -2px rgba(56, 189, 248, 0.42),
              inset 0 0 20px rgba(168, 85, 247, 0.14) !important;
          }

          html #services-page-container[data-fx="neon"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover::before {
            opacity: 1;
          }

          /* Chế độ 4: Tối Giản (Nổi nhẹ + Đổ bóng mềm) */
          html #services-page-container[data-fx="minimal"] .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover {
            transform: translateY(-6px) !important;
            border-color: rgba(255, 255, 255, 0.24) !important;
            box-shadow:
              0 22px 36px -10px rgba(0, 0, 0, 0.5),
              0 10px 18px -6px rgba(0, 0, 0, 0.32),
              inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
          }

          html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:hover svg.lucide.shrink-0 {
            transform: scale(1.14) rotate(-5deg);
          }
        }

        html #services-page-container .service-card.domain-card svg.lucide {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .card-ripple {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 25;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.34) 0%,
            rgba(168, 85, 247, 0.16) 55%,
            transparent 75%
          );
          transform: translate(-50%, -50%) scale(0);
          animation: serviceCardRipple 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes serviceCardRipple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toast-enter {
          animation: toastSlideIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:hover {
            transform: none !important;
          }
          .card-ripple {
            display: none !important;
          }
        }
      `}</style>

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
          data-floating-surface="main"
          data-detail-open={expandedDomain ? 'true' : 'false'}
          data-detail-overlay={expandedDomain ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Dịch Vụ"
          data-element-type="card"
          data-element-page="services"
          data-element-parent="services-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[var(--main-card-padding,20px)] gap-0 rounded-[var(--radius-global,var(--radius-main,14px))] overflow-hidden box-border"
          style={{ padding: 'var(--main-card-padding, 20px)', gap: '0px', borderRadius: 'var(--radius-global, var(--radius-main, 14px))' }}
        >
          <div
            id="services-main-scroll-viewport"
            ref={scrollViewportRef}
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-center justify-start gap-[var(--space-card-gap,16px)] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
          >
          <div
            id="services-main-content"
            data-element-parent="service-main-card"
            className={cn(
              'w-full flex flex-col justify-start gap-[var(--space-card-gap,16px)] min-w-0 box-border',
              isAnyCardExpanded ? 'h-auto flex-none' : 'flex-1 min-h-full h-auto'
            )}
          >
            {/* 1. HERO BANNER ĐẦU TRANG LĨNH VỰC — TỰ ĐỘNG ẨN MƯỢT KHI THẺ DỊCH VỤ BUNG RỘNG */}
            <AnimatePresence initial={false}>
              {!isAnyCardExpanded && (
                <motion.div
                  key="services-hero-banner"
                  id="services-hero-banner"
                  data-element-type="section"
                  data-section-card="true"
                  data-has-compact-menu="true"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: -10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -14, scale: 0.98 }
                  }
                  transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
                  className="banner-card hero-banner group w-full max-w-full min-h-[110px] h-[clamp(120px,17vh,155px)] mx-0 rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[var(--space-card-padding,16px)] z-30 box-border transition-all duration-300"
                  style={{
                    padding: 'var(--space-card-padding, 16px)',
                    width: '100%',
                    maxWidth: '100%',
                    borderRadius: 'var(--radius-banner, 14px)',
                    boxSizing: 'border-box',
                  }}
                >
              <div
                className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
              >
                <VideoBanner
                  videoId={servicesBannerVideo.videoId}
                  title={servicesBannerVideo.title}
                  className="rounded-[inherit]"
                />
              </div>
              <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

              {/* Vùng Tiêu Đề */}
              <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
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
                    {isEn ? 'Core expertise domains' : 'Lĩnh vực chuyên môn'}
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

                <CompactBannerMenu
                  id="services-compact-menu-btn"
                  label={isEn ? 'Controls' : 'Điều khiển'}
                  ariaLabel={isEn ? 'Domain Filter' : 'Bộ lọc lĩnh vực'}
                  activeCount={activeCategory !== 'ALL' ? 1 : 0}
                >
                  {(closeMenu) => (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="typo-label text-[var(--text-muted)] px-1">
                          {isEn ? 'Domain Filter' : 'Bộ lọc lĩnh vực'}
                        </span>
                        {filterCategories.map((cat) => {
                          const isActive = activeCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              data-selected={isActive ? 'true' : 'false'}
                              onClick={() => {
                                closeMenu();
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
                                  if (expandedDomain && interactionState === 'expanded') {
                                    switchExpandedDomain(found);
                                  } else {
                                    openExpandedCard(found);
                                  }
                                }
                              }}
                              className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <WebIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{cat.label}</span>
                              </span>
                              {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          cycleCardEffectMode();
                          closeMenu();
                        }}
                        className="banner-control-pill w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full typo-button font-play cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">{isEn ? currentFx.labelEn : currentFx.labelVi}</span>
                      </button>

                      {expandedDomain && (
                        <button
                          type="button"
                          onClick={() => {
                            closeExpandedCard();
                            closeMenu();
                          }}
                          className="banner-control-pill w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full typo-button font-play cursor-pointer"
                        >
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Back to 6 Domains' : 'Quay lại 6 thẻ lĩnh vực'}</span>
                        </button>
                      )}
                    </>
                  )}
                </CompactBannerMenu>
              </div>

              {/* Bộ lọc & nút thao tác nhanh */}
              <div
                id="services-hero-banner-controls"
                className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between mt-auto pt-0 gap-2.5 w-full"
                ref={filterMenuRef}
              >
                <div className="relative inline-flex items-center gap-2 flex-wrap text-left">
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterOpen((prev) => !prev);
                    }}
                    className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-play group"
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

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        id="services-filter-dropdown"
                        role="listbox"
                        className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14.5rem] max-w-full rounded-[var(--radius-popup,var(--radius-global,14px))] py-2 px-2 z-50 flex flex-col gap-1"
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
                                  if (expandedDomain && interactionState === 'expanded') {
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={cycleCardEffectMode}
                    className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-play group"
                    title={isEn ? 'Switch Bento card hover FX mode' : 'Đổi hiệu ứng thẻ & rê chuột'}
                    aria-label={isEn ? currentFx.labelEn : currentFx.labelVi}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{isEn ? currentFx.labelEn : currentFx.labelVi}</span>
                  </button>
                </div>

                {expandedDomain && (
                  <button
                    type="button"
                    onClick={closeExpandedCard}
                    className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-play cursor-pointer transition"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back to 6 Domains' : 'Quay lại 6 thẻ lĩnh vực'}</span>
                  </button>
                )}
              </div>
            </motion.div>
              )}
            </AnimatePresence>

            {/* 2. VÙNG LƯỚI 6 THẺ LĨNH VỰC & EXPANDING SERVICE CARD (MOTION LAYOUT ANIMATION TRONG DÒNG CHẢY THẬT) */}
            <LayoutGroup id="services-cards-layout-group">
              <div
                id="services-cards-wrapper"
                ref={cardsWrapperRef}
                data-interaction-state={interactionState}
                className={cn(
                  'relative w-full',
                  isAnyCardExpanded ? 'h-auto flex-none' : 'flex-1 min-h-0 h-auto'
                )}
              >
                <div
                  id="services-cards-grid"
                  ref={cardsGridRef}
                  data-card-layout="responsive-grid"
                  aria-hidden={isAnyCardExpanded}
                  className={cn(
                    'unified-cards-grid services-cards-grid services-responsive-grid card-grid w-full min-w-0 h-auto',
                    isAnyCardExpanded && !isGridLayerHidden && 'is-exiting-layer',
                    isAnyCardExpanded && isGridLayerHidden && 'is-hidden-layer'
                  )}
                >
                  {DOMAINS_DATA.map((domain, idx) => {
                    const meta = DOMAIN_UI_META[domain.id] || DOMAIN_UI_META['01'];
                    const fullTitle = isEn && domain.titleEn ? domain.titleEn : domain.title;
                    const displayTitle = formatFourWordSentenceCase(
                      isEn ? meta.shortTitleEn : meta.shortTitle
                    );
                    const summaryText = isEn
                      ? domain.descEn || domain.subtitleEn || domain.desc
                      : domain.desc || domain.subtitle || domain.coreCompetency;
                    const driveServiceImg =
                      serviceAssignments[domain.id as ServiceDomainKey]?.directImageUrl;
                    const serviceImage =
                      driveServiceImg || domain.customIllustrationUrl || meta.illustrationSrc;

                    const accentColor =
                      cardStyle === 'walnut-wood'
                        ? '#F5C478'
                        : cardStyle === 'cowhide-leather'
                          ? '#E5B87E'
                          : cardStyle === 'deep-ocean'
                            ? '#38BDF8'
                            : cardStyle === 'mica-fluent'
                              ? micaServiceAccents[idx % micaServiceAccents.length]
                              : isDark
                                ? meta.accentDark
                                : meta.accentLight;
                    const bentoTpl = DOMAIN_BENTO_TEMPLATES[domain.id] || DOMAIN_BENTO_TEMPLATES['01'];

                    const isSelectedCard = selectedDomainId === domain.id;
                    const isOtherDimmed = isAnyCardExpanded && !isSelectedCard;

                    // Khi Card này đang mở rộng: giữ một placeholder vô hình cùng ô để 5 Card còn lại không nhảy bố cục khi fade out
                    if (isSelectedCard) {
                      return (
                        <div
                          key={`placeholder-${domain.id}`}
                          aria-hidden="true"
                          className="invisible pointer-events-none select-none w-full h-full min-h-0"
                        />
                      );
                    }

                    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                      if (isAnyCardExpanded) return;
                      const card = cardRefs.current[domain.id];
                      if (!card) return;
                      const rect = card.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      card.style.setProperty('--mx', `${x.toFixed(1)}px`);
                      card.style.setProperty('--my', `${y.toFixed(1)}px`);
                      card.style.setProperty('--hover-x', `${((x / rect.width) * 100).toFixed(1)}%`);
                      card.style.setProperty('--hover-y', `${((y / rect.height) * 100).toFixed(1)}%`);

                      if (currentFx.id === 'spotlight-3d' && !prefersReducedMotion) {
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (((y - centerY) / Math.max(1, centerY)) * -4.5).toFixed(2);
                        const rotateY = (((x - centerX) / Math.max(1, centerX)) * 4.5).toFixed(2);
                        card.style.setProperty('--rx', `${rotateX}deg`);
                        card.style.setProperty('--ry', `${rotateY}deg`);
                      }
                    };

                    const handleCardMouseLeave = () => {
                      const card = cardRefs.current[domain.id];
                      if (card) {
                        card.style.setProperty('--rx', '0deg');
                        card.style.setProperty('--ry', '0deg');
                      }
                      setHoveredDomainId(null);
                      setInteractionState((prev) => (prev === 'hovered' ? 'idle' : prev));
                    };

                    const handleCardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
                      if ((e.target as HTMLElement).closest('input, textarea, select')) return;
                      const card = e.currentTarget;
                      if (!card || prefersReducedMotion) return;
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
                      <motion.div
                        key={domain.id}
                        layoutId={`service-card-shell-${domain.id}`}
                        layout
                        ref={(el) => {
                          cardRefs.current[domain.id] = el;
                        }}
                        id={getCardDomId(domain.id)}
                        data-element-type="card"
                        data-section-card="true"
                        data-service-themed="true"
                        data-multicolor-bento="true"
                        data-bento-styled="true"
                        data-expanded-active={isAnyCardExpanded ? 'true' : 'false'}
                        data-hovered={hoveredDomainId === domain.id ? 'true' : 'false'}
                        role="button"
                        tabIndex={isAnyCardExpanded ? -1 : 0}
                        aria-expanded={false}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={
                          isOtherDimmed
                            ? { opacity: 0, scale: prefersReducedMotion ? 1 : 0.94, y: 0 }
                            : { opacity: 1, scale: 1, y: 0 }
                        }
                        transition={{
                          layout: layoutSpring,
                          opacity: {
                            duration: prefersReducedMotion ? 0 : isOtherDimmed ? 0.34 : 0.38,
                            delay: prefersReducedMotion || isOtherDimmed || interactionState !== 'idle' ? 0 : idx * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          scale: {
                            duration: prefersReducedMotion ? 0 : 0.36,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          y: {
                            duration: prefersReducedMotion ? 0 : 0.38,
                            delay: prefersReducedMotion ? 0 : idx * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                        onPointerEnter={(e) => {
                          if (e.pointerType !== 'mouse' || isAnyCardExpanded) return;
                          setHoveredDomainId(domain.id);
                          if (interactionState === 'idle') {
                            setInteractionState('hovered');
                          }
                        }}
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                        onMouseDown={handleCardMouseDown}
                        onClick={() => openExpandedCard(domain)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openExpandedCard(domain);
                          }
                        }}
                        style={{
                          '--bento-card-bg': bentoTpl.cardBgCss,
                          '--service-card-accent': meta.accentLight,
                          '--service-card-accent-dark': meta.accentDark,
                          '--service-card-active-accent': accentColor,
                          '--service-card-tint': meta.tintBg,
                          '--service-card-img-url': `url("${serviceImage}")`,
                        } as React.CSSProperties}
                        className={cn(
                          'service-card domain-card service-theme-card bento-card bento-border group relative rounded-[12px] p-[var(--grid-cards-padding,var(--space-card-padding,16px))] box-border w-full h-full min-h-[196px] sm:min-h-[216px] flex flex-col justify-between text-left text-white cursor-pointer overflow-hidden',
                          bentoTpl.cardBgClass
                        )}
                      >
                        {/* Ambient Glowing Orb góc thẻ từ mẫu Creator Studio Bento */}
                        <div
                          className={cn(
                            'absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500',
                            bentoTpl.orbClass
                          )}
                        />

                        {/* 3-Part Flexible Card Body */}
                        <div className="service-card-body relative z-10 flex flex-col flex-1 min-h-0 justify-between gap-2.5 w-full min-w-0">
                          {/* TOP: Creator Studio Header (Icon + Title) */}
                          <div className="flex flex-col gap-2 min-w-0 shrink-0">
                            <div className="service-card-header flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {renderDomainIcon(
                                  meta.iconKey,
                                  'w-5 h-5 shrink-0 stroke-[2.2] transition-transform duration-300',
                                  bentoTpl.iconColor
                                )}
                                <h3
                                  className={cn(
                                    'service-title-text bento-unified-title font-play text-[16px] font-bold tracking-tight leading-snug m-0 min-w-0 flex-1 line-clamp-2 [text-wrap:balance]',
                                    bentoTpl.titleGradient && 'has-gradient-title'
                                  )}
                                  title={fullTitle}
                                >
                                  <span
                                    className={
                                      bentoTpl.titleGradient
                                        ? 'gradient-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-pink-200'
                                        : 'text-white'
                                    }
                                  >
                                    {displayTitle}
                                  </span>
                                </h3>
                              </div>
                            </div>
                          </div>

                          {/* CENTER: Left Description & Right Frameless Zoomable Illustration */}
                          <div className="service-card-middle grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 flex-1 min-w-0 w-full">
                            <div className="service-card-text-col flex flex-col justify-center gap-2 min-w-0 text-left">
                              <div className="service-card-copy min-w-0 flex items-center">
                                <p
                                  id={`service-card-desc-${domain.id}`}
                                  className={cn(
                                    'service-desc-text relative z-10 m-0 leading-[1.52] text-[13px] font-normal line-clamp-4 break-words text-left',
                                    bentoTpl.descClass
                                  )}
                                  title={summaryText}
                                >
                                  {summaryText}
                                </p>
                              </div>
                            </div>

                            <div className="service-card-image-box min-w-0 relative flex items-center justify-center shrink-0 justify-self-end overflow-visible">
                              <img
                                src={serviceImage}
                                alt={fullTitle}
                                width={104}
                                height={104}
                                loading={idx < 3 ? 'eager' : 'lazy'}
                                fetchPriority={idx < 3 ? 'high' : 'auto'}
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  if (e.currentTarget.src !== meta.fallbackIllustration) {
                                    e.currentTarget.src = meta.fallbackIllustration;
                                  }
                                }}
                                className="service-img-pop relative z-10 max-h-[104px] w-auto max-w-full object-contain select-none pointer-events-none transition-transform duration-500 ease-out group-hover:scale-120 group-hover:-translate-y-2 drop-shadow-lg group-hover:drop-shadow-2xl"
                              />
                            </div>
                          </div>

                          {/* BOTTOM: Thẻ 4 Overlapping Partner Avatar Stack + Creator Studio CTA Pill */}
                          <div
                            className="service-divider mt-auto pt-2.5 flex items-center justify-between gap-2 min-w-0 shrink-0"
                            style={{ borderTop: `1px solid ${bentoTpl.dividerColor}` }}
                          >
                            {(domain.companyLogos || []).length > 0 && (
                              <div className="flex items-center -space-x-2.5 min-w-0">
                                {(domain.companyLogos || []).slice(0, 4).map((partner, pIdx) => (
                                  <div
                                    key={partner.name || pIdx}
                                    title={partner.name}
                                    className={cn(
                                      'company-logo-surface service-partner-logo w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-sm bg-white',
                                      bentoTpl.ringClass
                                    )}
                                    style={{
                                      background: '#ffffff',
                                    }}
                                  >
                                    <img
                                      src={partner.logo}
                                      alt={partner.name}
                                      loading="lazy"
                                      decoding="async"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-contain rounded-full select-none"
                                      style={{
                                        imageRendering: '-webkit-optimize-contrast',
                                      }}
                                      onError={(e) => {
                                        if (
                                          partner.fallbackLogo &&
                                          e.currentTarget.src !== partner.fallbackLogo
                                        ) {
                                          e.currentTarget.src = partner.fallbackLogo;
                                        } else {
                                          e.currentTarget.src = serviceImage;
                                        }
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            <span
                              data-bento-styled="true"
                              className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold font-play transition-all duration-200 group-hover:translate-x-0.5 shrink-0 ml-auto',
                                bentoTpl.ctaClass
                              )}
                            >
                              <span>{isEn ? 'Explore' : 'Chi tiết'}</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 3. HIỆU ỨNG 2: THẺ CHI TIẾT MỞ RỘNG BẰNG MOTION LAYOUT ANIMATION */}
                <AnimatePresence>
                  {expandedDomain && expandedMeta && (
                    <ServiceExpandedDetail
                      key="services-expanded-detail-panel"
                      expandedDomain={expandedDomain}
                      expandedMeta={expandedMeta}
                      allDomains={DOMAINS_DATA}
                      serviceAssignments={serviceAssignments}
                      interactionState={interactionState}
                      fxMode={currentFx.id}
                      minHeightPx={gridNaturalHeight}
                      prefersReducedMotion={prefersReducedMotion}
                      isEn={isEn}
                      isDarkMode={isDark}
                      isLeatherTheme={isLeatherTheme}
                      expandedCardRef={expandedCardRef}
                      expandedBodyRef={expandedBodyRef}
                      closeButtonRef={closeButtonRef}
                      onClose={closeExpandedCard}
                      onSwitchDomain={switchExpandedDomain}
                      renderDomainIcon={renderDomainIcon}
                      renderKpiIcon={renderKpiIcon}
                    />
                  )}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
