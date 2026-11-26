'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

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
import { DOMAINS_DATA, DOMAINS_INTRO } from '@/data/domains';
import { DomainData, SiteTheme } from '@/types';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { isNeumorphismCardStyle } from '@/config/ui/themeDefaults';
import { useLanguage } from '@/context/LanguageContext';
import { useBannerVideo } from '@/context/BannerVideoContext';
import { ServiceDomainKey } from '@/utils/bannerVideoMatcher';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import {
  ServiceExpandedDetail,
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
    illustrationSrc: 'https://i.postimg.cc/5Nq2wsTG/Vien-thong-di-dong.png',
    fallbackIllustration: 'https://i.postimg.cc/5Nq2wsTG/Vien-thong-di-dong.png',
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
    tags: ['#ContactCenter', '#VienThong', '#24x7Ops', '#QASOP'],
    tagsEn: ['#ContactCenter', '#TelecomCX', '#24x7Ops', '#QASOP'],
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
    illustrationSrc: 'https://i.postimg.cc/bNHwQm4j/Thuong-mai-dien-tu.png',
    fallbackIllustration: 'https://i.postimg.cc/bNHwQm4j/Thuong-mai-dien-tu.png',
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
    illustrationSrc: 'https://i.postimg.cc/RVQZcgyT/Dich-vu-bao-hiem.png',
    fallbackIllustration: 'https://i.postimg.cc/RVQZcgyT/Dich-vu-bao-hiem.png',
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
    tags: ['#FinanceQA', '#Compliance', '#BaoHiem', '#RiskControl'],
    tagsEn: ['#FinanceQA', '#Compliance', '#InsuranceCX', '#RiskControl'],
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
    illustrationSrc: '/assets/services/the-thao-dien-tu.png',
    fallbackIllustration: '/assets/services/the-thao-dien-tu.png',
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
    tags: ['#GameSupport', '#AccountSecurity', '#CongDong', '#EsportsOps'],
    tagsEn: ['#GameSupport', '#AccountSecurity', '#Community', '#EsportsOps'],
  },
  '05': {
    shortTitle: 'Ví điện tử',
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
    illustrationSrc: 'https://i.postimg.cc/rFCwSf3j/Thanh-toan-dien-tu.png',
    fallbackIllustration: 'https://i.postimg.cc/rFCwSf3j/Thanh-toan-dien-tu.png',
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
    tags: ['#FintechOps', '#ViDienTu', '#ThanhToanSo', '#CoreBanking'],
    tagsEn: ['#FintechOps', '#EWallet', '#DigitalPay', '#CoreBanking'],
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
    illustrationSrc: 'https://i.postimg.cc/QxkdpfvL/Xay-dung-he-thong.png',
    fallbackIllustration: 'https://i.postimg.cc/QxkdpfvL/Xay-dung-he-thong.png',
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

export const ServicesView: React.FC<ServicesViewProps> = () => {
  const { cardStyle } = useTheme();
  const { language, t } = useLanguage();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { serviceAssignments } = useBannerVideo();
  const servicesBannerVideo = getDefaultBannerVideoConfig('services');
  const isEn = language === 'en';
  const isLeatherTheme = cardStyle === 'cowhide-leather' || cardStyle === 'dark-cowhide-leather' || cardStyle === 'walnut-wood';
  const isNeumorphismActive = isNeumorphismCardStyle(cardStyle);

  // Controlled interaction state machine: idle | hovered | expanding | expanded | closing
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [interactionState, setInteractionState] = useState<ServiceInteractionState>('idle');
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);
  const [gridNaturalHeight, setGridNaturalHeight] = useState<number | undefined>(undefined);
  const [isGridLayerHidden, setIsGridLayerHidden] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

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

      // Sau khi 5 card còn lại fade/scale out mượt mà, ẩn tầng lưới khỏi dòng chảy để không dư chiều cao
      scheduleTimer(() => {
        setIsGridLayerHidden(true);
      }, 280);

      scheduleTimer(() => {
        setInteractionState('expanded');
        closeButtonRef.current?.focus({ preventScroll: true });
      }, 420);
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
    }, 170);

    // Bước 3: Hoàn tất khôi phục trạng thái Idle & trả focus bàn phím về đúng Card nguồn
    scheduleTimer(() => {
      setInteractionState('idle');
      setGridNaturalHeight(undefined);
      cardRefs.current[closingId]?.focus({ preventScroll: true });
    }, 620);
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

  const themeAccent = 'var(--text-link, var(--color-primary))';
  const layoutSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 215, damping: 27, mass: 0.95 };
  const isAnyCardExpanded = Boolean(selectedDomainId);

  return (
    <div
      id="services-page-container"
      data-element-name="Trang Dịch Vụ & Giải Pháp"
      data-element-type="container"
      data-element-page="services"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left rounded-none text-[var(--text-primary)] box-border"
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
          className="page-main-card relative flex flex-col justify-start p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden box-border"
          style={{ padding: '15px', gap: '0px', borderRadius: 'var(--radius-main, 14px)' }}
        >
          <div
            id="services-main-scroll-viewport"
            ref={scrollViewportRef}
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-center justify-start gap-[15px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
          >
          <div
            id="services-main-content"
            data-element-parent="service-main-card"
            className="w-full flex-1 flex flex-col justify-start gap-[15px] min-w-0"
          >
            {/* 1. HERO BANNER ĐẦU TRANG LĨNH VỰC (ĐỒNG BỘ FORMAT BỐ CỤC NHƯ HỆ THỐNG) */}
            <motion.div
              id="services-hero-banner"
              data-element-type="section"
              data-section-card="true"
              data-has-compact-menu="true"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-0 rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 box-border transition-all duration-300"
              style={{
                padding: '15px',
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

            {/* 2. VÙNG LƯỚI 6 THẺ LĨNH VỰC & EXPANDING SERVICE CARD (MOTION LAYOUT ANIMATION TRONG DÒNG CHẢY THẬT) */}
            <LayoutGroup id="services-cards-layout-group">
              <div
                id="services-cards-wrapper"
                ref={cardsWrapperRef}
                data-interaction-state={interactionState}
                className="relative w-full"
              >
                <div
                  id="services-cards-grid"
                  ref={cardsGridRef}
                  aria-hidden={isAnyCardExpanded}
                  className={cn(
                    'services-cards-grid card-grid w-full min-w-0',
                    isAnyCardExpanded && !isGridLayerHidden && 'is-exiting-layer',
                    isAnyCardExpanded && isGridLayerHidden && 'is-hidden-layer'
                  )}
                >
                  {DOMAINS_DATA.map((domain, idx) => {
                    const meta = DOMAIN_UI_META[domain.id] || DOMAIN_UI_META['01'];
                    const cardTitle = isEn && domain.titleEn ? domain.titleEn : domain.title;
                    const shortCardTitle = isEn ? meta.shortTitleEn : domain.title;
                    const summaryText = isEn
                      ? domain.descEn || domain.subtitleEn
                      : domain.desc || domain.subtitle || domain.coreCompetency;
                    const driveServiceImg =
                      serviceAssignments[domain.id as ServiceDomainKey]?.directImageUrl;
                    const serviceImage =
                      driveServiceImg || domain.customIllustrationUrl || meta.illustrationSrc;

                    const isSelectedCard = selectedDomainId === domain.id;
                    const isOtherDimmed = isAnyCardExpanded && !isSelectedCard;

                    // Khi Card này đang mở rộng: giữ một placeholder vô hình cùng ô để 5 Card còn lại không nhảy bố cục khi fade out
                    if (isSelectedCard) {
                      return (
                        <div
                          key={`placeholder-${domain.id}`}
                          aria-hidden="true"
                          className="invisible pointer-events-none select-none min-h-[148px]"
                        />
                      );
                    }

                    const updateHoverOrigin = (e: React.PointerEvent<HTMLDivElement>) => {
                      if (e.pointerType !== 'mouse' || isAnyCardExpanded) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      if (!rect.width || !rect.height) return;
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--hover-x', `${x.toFixed(1)}%`);
                      e.currentTarget.style.setProperty('--hover-y', `${y.toFixed(1)}%`);
                    };

                    return (
                      <motion.div
                        key={domain.id}
                        layoutId={`service-card-shell-${domain.id}`}
                        layout="position"
                        ref={(el) => {
                          cardRefs.current[domain.id] = el;
                        }}
                        id={getCardDomId(domain.id)}
                        data-element-type="card"
                        data-section-card="true"
                        data-expanded-active={isAnyCardExpanded ? 'true' : 'false'}
                        data-hovered={hoveredDomainId === domain.id ? 'true' : 'false'}
                        role="button"
                        tabIndex={isAnyCardExpanded ? -1 : 0}
                        aria-expanded={false}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={
                          isOtherDimmed
                            ? { opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, y: 0 }
                            : { opacity: 1, scale: 1, y: 0 }
                        }
                        transition={{
                          layout: layoutSpring,
                          opacity: {
                            duration: prefersReducedMotion ? 0 : isOtherDimmed ? 0.24 : 0.34,
                            delay: prefersReducedMotion || isOtherDimmed || interactionState !== 'idle' ? 0 : idx * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          scale: {
                            duration: prefersReducedMotion ? 0 : 0.28,
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
                          updateHoverOrigin(e);
                          setHoveredDomainId(domain.id);
                          if (interactionState === 'idle') {
                            setInteractionState('hovered');
                          }
                        }}
                        onPointerMove={updateHoverOrigin}
                        onPointerLeave={(e) => {
                          if (e.pointerType !== 'mouse') return;
                          setHoveredDomainId((prev) => (prev === domain.id ? null : prev));
                          setInteractionState((prev) => (prev === 'hovered' ? 'idle' : prev));
                        }}
                        onClick={() => openExpandedCard(domain)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openExpandedCard(domain);
                          }
                        }}
                        style={{
                          height: 'auto',
                          '--service-card-accent': meta.accentLight,
                          '--service-card-accent-dark': meta.accentDark,
                          '--service-card-tint-light': meta.tintBgLight,
                          '--service-card-tint-dark': meta.tintBgDark,
                          '--service-card-border-light': meta.borderLight,
                          '--service-card-border-dark': meta.borderDark,
                          '--service-card-img-url': `url("${serviceImage}")`,
                        } as React.CSSProperties}
                        className="service-card domain-card bento-card glass-card group relative rounded-[14px] p-4 box-border w-full h-auto flex flex-col justify-start text-left"
                      >
                        {/* Hiệu ứng 1: Lớp Liquid Color Reveal đồng bộ sắc độ từ hình ảnh minh họa của chính thẻ dịch vụ */}
                        <span aria-hidden="true" className="service-card-hover-flood">
                          <span className="service-card-hover-image-aura" />
                        </span>

                        {/* Bố cục Thẻ dịch vụ 3 phần: Top (icon + tiêu đề), Center (2 cột: mô tả + hình ảnh), Bottom (logo công ty) */}
                        <div className="relative z-10 flex flex-col gap-3 w-full min-w-0">
                          {/* TOP: Icon & Tiêu đề dịch vụ */}
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="inline-flex items-center justify-center p-2 rounded-xl shrink-0 shadow-xs border"
                              style={{
                                background: 'var(--surface-secondary-bg, rgba(255, 255, 255, 0.82))',
                                borderColor: 'var(--border-subcard, rgba(255, 255, 255, 0.3))',
                              }}
                            >
                              {renderDomainIcon(
                                meta.iconKey,
                                'w-[18px] h-[18px] shrink-0 stroke-[2.2]',
                                themeAccent
                              )}
                            </div>
                            <h3
                              className="service-title-text card-title-synced typo-h4 font-play font-bold tracking-tight leading-snug m-0 min-w-0 line-clamp-2"
                              data-card-title="true"
                              style={{ color: themeAccent }}
                              title={cardTitle}
                            >
                              {isEn ? shortCardTitle : domain.title}
                            </h3>
                          </div>

                          {/* CENTER: Chia làm 2 cột 50% / 50% (Cột trái: Mô tả, Cột phải: Hình ảnh có kích thước bằng chiều cao 4 dòng mô tả) */}
                          <div className="grid grid-cols-2 gap-3 items-center min-w-0 w-full">
                            {/* Cột bên trái (50%): Chứa mô tả dịch vụ */}
                            <div className="col-span-1 min-w-0 flex items-center">
                              <p
                                id={`service-card-desc-${domain.id}`}
                                className="service-desc-text relative z-10 text-[var(--text-secondary)] line-clamp-4 m-0 leading-[1.45] typo-body-sm font-normal"
                                title={summaryText}
                              >
                                {summaryText}
                              </p>
                            </div>

                            {/* Cột bên phải (50%): Hình ảnh dịch vụ tăng gấp 2 lần (chiều cao 160px, gấp đôi ban đầu) */}
                            <div className="service-card-image-box col-span-1 min-w-0 relative flex items-center justify-center h-[160px] min-h-[160px] max-h-[160px] w-full">
                              <img
                                src={serviceImage}
                                alt={cardTitle}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  if (e.currentTarget.src !== meta.fallbackIllustration) {
                                    e.currentTarget.src = meta.fallbackIllustration;
                                  }
                                }}
                                className="service-img-pop relative z-10 w-full h-[160px] max-h-[160px] object-contain select-none pointer-events-none"
                              />
                            </div>
                          </div>

                          {/* BOTTOM: Chứa logo công ty */}
                          <div
                            className={cn(
                              'service-divider pt-2.5 flex items-center justify-start gap-2 min-w-0',
                              isNeumorphismActive ? 'border-0' : 'border-t border-[var(--border-subcard)]'
                            )}
                          >
                            {(domain.companyLogos || []).length > 0 && (
                              <div className="flex items-center flex-wrap gap-2 min-w-0">
                                {(domain.companyLogos || []).slice(0, 4).map((partner, pIdx) => (
                                  <div
                                    key={partner.name || pIdx}
                                    title={partner.name}
                                    style={{
                                      background: 'var(--surface-secondary-bg, var(--bg-card))',
                                      border: 'none',
                                    }}
                                    className="w-[38px] h-[38px] rounded-full overflow-hidden border-0 flex items-center justify-center p-0 shrink-0 shadow-xs"
                                  >
                                    <img
                                      src={partner.logo}
                                      alt={partner.name}
                                      loading="lazy"
                                      decoding="async"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover rounded-full"
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
                      minHeightPx={gridNaturalHeight}
                      prefersReducedMotion={prefersReducedMotion}
                      isEn={isEn}
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
