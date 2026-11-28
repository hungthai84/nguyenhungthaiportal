'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';
import { BlurUpImage } from '@/components/ui/BlurUpImage';
import { CARD_SETTLE_SPRING } from '@/components/ui/ExpandCardMotion';
import { U420CardHoverIcon, U420_STYLES, type U420Variant } from '@/components/ui/U420CardHoverIcon';

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
  type DomainIconKey,
  type KpiIconKey,
  type DomainUiMeta,
  type ServiceInteractionState,
  type ServiceScaleOrigin,
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
    accentDark: '#7dd3fc',
    cardGradient: 'linear-gradient(135deg, #0284c7 0%, #1e40af 52%, #0f172a 100%)',
    tintBg: 'rgba(14, 165, 233, 0.22)',
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
    accentLight: '#e11d48',
    accentDark: '#fda4af',
    cardGradient: 'linear-gradient(135deg, #e11d48 0%, #c2410c 55%, #450a0a 100%)',
    tintBg: 'rgba(225, 29, 72, 0.24)',
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
    accentLight: '#059669',
    accentDark: '#a7f3d0',
    cardGradient: 'linear-gradient(135deg, #059669 0%, #047857 52%, #052e16 100%)',
    tintBg: 'rgba(5, 150, 105, 0.22)',
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
    accentLight: '#7e22ce',
    accentDark: '#f5d0fe',
    cardGradient: 'linear-gradient(135deg, #7e22ce 0%, #86198f 52%, #1e1b4b 100%)',
    tintBg: 'rgba(126, 34, 206, 0.24)',
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
    accentLight: '#0d9488',
    accentDark: '#67e8f9',
    cardGradient: 'linear-gradient(135deg, #0d9488 0%, #155e75 52%, #172554 100%)',
    tintBg: 'rgba(13, 148, 136, 0.22)',
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
    accentLight: '#b45309',
    accentDark: '#fde047',
    cardGradient: 'linear-gradient(135deg, #b45309 0%, #9a3412 52%, #1c1917 100%)',
    tintBg: 'rgba(180, 83, 9, 0.24)',
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

const DOMAIN_U420_VARIANTS: Record<string, U420Variant> = {
  '01': 'c1',
  '02': 'c2',
  '03': 'c4',
  '04': 'c3',
  '05': 'c4',
  '06': 'c1',
};

interface DomainBentoTemplate {
  cardBgClass: string;
  cardBgCss: string;
  borderColor?: string;
  orbClass: string;
  iconColor: string;
  titleGradient?: boolean;
  isDarkTextCard?: boolean;
  badgeClass: string;
  descClass: string;
  ctaClass: string;
  dividerColor: string;
}

/**
 * Đồng bộ 6 màu nền thẻ Lĩnh vực Dịch vụ giống hệt 6 màu nền thẻ Trang Tử Vi (HoroscopeView):
 * 01 → Kim (Sky → Blue → Slate: #0284c7 → #1e40af → #0f172a)
 * 02 → Hỏa (Rose → Orange → Deep Red: #e11d48 → #c2410c → #450a0a)
 * 03 → Mộc (Emerald → Forest: #059669 → #047857 → #052e16)
 * 04 → Hợp (Purple → Fuchsia → Indigo: #7e22ce → #86198f → #1e1b4b)
 * 05 → Thủy (Teal → Cyan → Deep Blue: #0d9488 → #155e75 → #172554)
 * 06 → Thổ (Amber → Rust → Stone: #b45309 → #9a3412 → #1c1917)
 */
const DOMAIN_BENTO_TEMPLATES: Record<string, DomainBentoTemplate> = {
  '01': {
    cardBgClass: 'bg-gradient-to-br from-sky-600 via-blue-800 to-slate-900',
    cardBgCss: 'linear-gradient(135deg, #0284c7 0%, #1e40af 52%, #0f172a 100%)',
    orbClass: 'bg-sky-300/20',
    iconColor: '#7dd3fc',
    badgeClass: 'bg-white/15 border border-sky-200/30 text-sky-100',
    descClass: 'text-sky-100/95 font-medium',
    ctaClass: 'bg-white/15 group-hover:bg-white/25 border border-sky-200/30 text-sky-50',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
  '02': {
    cardBgClass: 'bg-gradient-to-br from-rose-600 via-orange-700 to-red-950',
    cardBgCss: 'linear-gradient(135deg, #e11d48 0%, #c2410c 55%, #450a0a 100%)',
    orbClass: 'bg-rose-300/20',
    iconColor: '#fda4af',
    badgeClass: 'bg-black/28 border border-rose-200/30 text-rose-100',
    descClass: 'text-rose-100/95 font-medium',
    ctaClass: 'bg-black/28 group-hover:bg-black/40 border border-rose-200/30 text-rose-50',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
  '03': {
    cardBgClass: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-950',
    cardBgCss: 'linear-gradient(135deg, #059669 0%, #047857 52%, #052e16 100%)',
    orbClass: 'bg-emerald-300/20',
    iconColor: '#a7f3d0',
    badgeClass: 'bg-white/15 border border-emerald-200/30 text-emerald-100',
    descClass: 'text-emerald-100/95 font-medium',
    ctaClass: 'bg-white/15 group-hover:bg-white/25 border border-emerald-200/30 text-emerald-50',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
  '04': {
    cardBgClass: 'bg-gradient-to-br from-purple-700 via-fuchsia-800 to-indigo-950',
    cardBgCss: 'linear-gradient(135deg, #7e22ce 0%, #86198f 52%, #1e1b4b 100%)',
    orbClass: 'bg-fuchsia-300/25',
    iconColor: '#fde047',
    titleGradient: true,
    badgeClass: 'bg-white/15 border border-fuchsia-200/30 text-fuchsia-100',
    descClass: 'text-fuchsia-100/95 font-medium',
    ctaClass: 'bg-white/15 group-hover:bg-white/25 border border-fuchsia-200/30 text-yellow-200',
    dividerColor: 'rgba(255, 255, 255, 0.18)',
  },
  '05': {
    cardBgClass: 'bg-gradient-to-br from-teal-600 via-cyan-800 to-blue-950',
    cardBgCss: 'linear-gradient(135deg, #0d9488 0%, #155e75 52%, #172554 100%)',
    orbClass: 'bg-cyan-300/20',
    iconColor: '#67e8f9',
    badgeClass: 'bg-white/15 border border-cyan-200/30 text-cyan-100',
    descClass: 'text-cyan-100/95 font-medium',
    ctaClass: 'bg-white/15 group-hover:bg-white/25 border border-cyan-200/30 text-cyan-50',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
  '06': {
    cardBgClass: 'bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900',
    cardBgCss: 'linear-gradient(135deg, #b45309 0%, #9a3412 52%, #1c1917 100%)',
    orbClass: 'bg-amber-300/20',
    iconColor: '#fde047',
    badgeClass: 'bg-black/28 border border-amber-200/30 text-amber-100',
    descClass: 'text-amber-100/95 font-medium',
    ctaClass: 'bg-black/28 group-hover:bg-black/40 border border-amber-200/30 text-amber-100',
    dividerColor: 'rgba(255, 255, 255, 0.16)',
  },
};

/**
 * Giao diện phẳng sáng (flat-soft-ui): Màu nền 6 thẻ Dịch vụ lấy trực tiếp từ dải màu
 * chủ đạo của từng hình minh họa dịch vụ (pixel-sampled harmony):
 * 01 Viễn thông      → #396CB4 / #8BC9F0 (Sky Cobalt Pastel)
 * 02 Thương mại ĐT   → #EFBB76 / #E6A780 / #D94842 (Warm Peach Apricot Honey)
 * 03 Tài chính BH    → #FCE5E4 / #F58D96 / #EB6A81 (Blush Rose Coral — tiệp nền hình #FCE5E4)
 * 04 Thể thao ĐT     → #563CD0 / #3C43C8 / #9D5CE5 (Periwinkle Lavender Violet)
 * 05 Thanh toán Ví   → #FCD1E6 / #8A6ED6 / #F7B9DF (Orchid Pink Lilac — tiệp nền hình #FCD1E6)
 * 06 Xây dựng HT     → #7FDCE1 / #92DDC7 / #96C4D6 (Aqua Mint Glacier)
 */
const DOMAIN_FLAT_LIGHT_TEMPLATES: Record<string, DomainBentoTemplate> = {
  '01': {
    cardBgClass: 'bg-gradient-to-br from-[#F5FAFF] via-[#E3F2FD] to-[#CBE6FB]',
    cardBgCss: 'linear-gradient(145deg, #F5FAFF 0%, #E3F2FD 52%, #CBE6FB 100%)',
    borderColor: 'rgba(57, 108, 180, 0.28)',
    orbClass: 'bg-[#8BC9F0]/40',
    iconColor: '#2557A7',
    isDarkTextCard: true,
    badgeClass: 'bg-white/85 border border-[#396CB4]/25 text-[#1E4B94]',
    descClass: 'text-slate-700 font-medium',
    ctaClass: 'bg-white/88 group-hover:bg-white border border-[#396CB4]/28 text-[#1E4B94] shadow-xs',
    dividerColor: 'rgba(57, 108, 180, 0.18)',
  },
  '02': {
    cardBgClass: 'bg-gradient-to-br from-[#FFFBF5] via-[#FEF0DC] to-[#FBE0BF]',
    cardBgCss: 'linear-gradient(145deg, #FFFBF5 0%, #FEF0DC 52%, #FBE0BF 100%)',
    borderColor: 'rgba(217, 119, 66, 0.30)',
    orbClass: 'bg-[#EFBB76]/45',
    iconColor: '#C24B24',
    isDarkTextCard: true,
    badgeClass: 'bg-white/85 border border-[#D94842]/25 text-[#B4411C]',
    descClass: 'text-slate-700 font-medium',
    ctaClass: 'bg-white/88 group-hover:bg-white border border-[#D97742]/30 text-[#B4411C] shadow-xs',
    dividerColor: 'rgba(217, 119, 66, 0.20)',
  },
  '03': {
    cardBgClass: 'bg-gradient-to-br from-[#FFF8F8] via-[#FCE5E4] to-[#F9D2D5]',
    cardBgCss: 'linear-gradient(145deg, #FFF8F8 0%, #FCE5E4 54%, #F9D2D5 100%)',
    borderColor: 'rgba(235, 106, 129, 0.30)',
    orbClass: 'bg-[#F58D96]/40',
    iconColor: '#C93B59',
    isDarkTextCard: true,
    badgeClass: 'bg-white/85 border border-[#EB6A81]/28 text-[#BE2E4C]',
    descClass: 'text-slate-700 font-medium',
    ctaClass: 'bg-white/88 group-hover:bg-white border border-[#EB6A81]/30 text-[#BE2E4C] shadow-xs',
    dividerColor: 'rgba(235, 106, 129, 0.20)',
  },
  '04': {
    cardBgClass: 'bg-gradient-to-br from-[#F7F5FF] via-[#EAE5FF] to-[#DDD4FD]',
    cardBgCss: 'linear-gradient(145deg, #F7F5FF 0%, #EAE5FF 52%, #DDD4FD 100%)',
    borderColor: 'rgba(86, 60, 208, 0.28)',
    orbClass: 'bg-[#9D5CE5]/35',
    iconColor: '#4F36C4',
    isDarkTextCard: true,
    badgeClass: 'bg-white/85 border border-[#563CD0]/25 text-[#452EB3]',
    descClass: 'text-slate-700 font-medium',
    ctaClass: 'bg-white/88 group-hover:bg-white border border-[#563CD0]/28 text-[#452EB3] shadow-xs',
    dividerColor: 'rgba(86, 60, 208, 0.18)',
  },
  '05': {
    cardBgClass: 'bg-gradient-to-br from-[#FFF5FA] via-[#FCE0EE] to-[#F6D0EB]',
    cardBgCss: 'linear-gradient(145deg, #FFF5FA 0%, #FCE0EE 52%, #F6D0EB 100%)',
    borderColor: 'rgba(174, 123, 233, 0.32)',
    orbClass: 'bg-[#F7B9DF]/45',
    iconColor: '#8B3D9E',
    isDarkTextCard: true,
    badgeClass: 'bg-white/85 border border-[#8A6ED6]/28 text-[#7E3191]',
    descClass: 'text-slate-700 font-medium',
    ctaClass: 'bg-white/88 group-hover:bg-white border border-[#AE7BE9]/34 text-[#7E3191] shadow-xs',
    dividerColor: 'rgba(138, 110, 214, 0.20)',
  },
  '06': {
    cardBgClass: 'bg-gradient-to-br from-[#F2FCFC] via-[#DEF6F5] to-[#C9EFEA]',
    cardBgCss: 'linear-gradient(145deg, #F2FCFC 0%, #DEF6F5 52%, #C9EFEA 100%)',
    borderColor: 'rgba(45, 165, 165, 0.30)',
    orbClass: 'bg-[#7FDCE1]/45',
    iconColor: '#0E7490',
    isDarkTextCard: true,
    badgeClass: 'bg-white/85 border border-[#0E7490]/25 text-[#0F6973]',
    descClass: 'text-slate-700 font-medium',
    ctaClass: 'bg-white/88 group-hover:bg-white border border-[#2DA5A5]/32 text-[#0F6973] shadow-xs',
    dividerColor: 'rgba(14, 116, 144, 0.18)',
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
  const isFlatSoftLight = cardStyle === 'flat-soft-ui';
  const isLeatherTheme =
    cardStyle === 'cowhide-leather' || cardStyle === 'walnut-wood';
  const micaServiceAccents = ['#C65927', '#FF7C17', '#3ABA8F', '#EA1A7F', '#16D6FA', '#5274FF'];

  const SERVICE_FLIP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const SERVICE_FLIP_DURATION = 0.8; // 800ms

  // Controlled React state managing the `expanded` service card & FLIP lifecycle
  const [expanded, setExpanded] = useState<string | null>(null);
  const selectedDomainId = expanded;
  const [interactionState, setInteractionState] = useState<ServiceInteractionState>('idle');
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);
  const [gridNaturalHeight, setGridNaturalHeight] = useState<number | undefined>(undefined);
  const [scaleOrigin, setScaleOrigin] = useState<ServiceScaleOrigin | undefined>(undefined);
  const [siblingVectors, setSiblingVectors] = useState<
    Record<string, { dx: number; dy: number; delay: number }>
  >({});

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
  const lastOpenedIdRef = useRef<string | null>(null);
  const closeFlipTimerRef = useRef<number | null>(null);
  const hasMountedGridRef = useRef<boolean>(false);

  useEffect(() => {
    hasMountedGridRef.current = true;
    return () => {
      if (closeFlipTimerRef.current) {
        window.clearTimeout(closeFlipTimerRef.current);
      }
    };
  }, []);

  const expandedDomain = expanded
    ? DOMAINS_DATA.find((d) => d.id === expanded) || null
    : null;
  const expandedMeta = expandedDomain
    ? DOMAIN_UI_META[expandedDomain.id] || DOMAIN_UI_META['01']
    : null;

  const computeCardScaleOrigin = useCallback(
    (domainId: string): { origin: ServiceScaleOrigin; vectors: Record<string, { dx: number; dy: number; delay: number }>; measuredGridHeight?: number } => {
      const cardEl = cardRefs.current[domainId];
      const gridEl = cardsGridRef.current || cardsWrapperRef.current;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const bentoTpl = isFlatSoftLight
        ? DOMAIN_FLAT_LIGHT_TEMPLATES[domainId] || DOMAIN_FLAT_LIGHT_TEMPLATES['01']
        : DOMAIN_BENTO_TEMPLATES[domainId] || DOMAIN_BENTO_TEMPLATES['01'];

      const vectors: Record<string, { dx: number; dy: number; delay: number }> = {};

      if (cardEl && gridEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const gridRect = gridEl.getBoundingClientRect();
        if (gridRect.width > 0 && gridRect.height > 0 && cardRect.width > 0 && cardRect.height > 0) {
          const fromLeft = Math.max(0, cardRect.left - gridRect.left);
          const fromTop = Math.max(0, cardRect.top - gridRect.top);
          const fromRight = Math.max(0, gridRect.width - (fromLeft + cardRect.width));
          const fromBottom = Math.max(0, gridRect.height - (fromTop + cardRect.height));

          const cardCenterX = fromLeft + cardRect.width / 2;
          const cardCenterY = fromTop + cardRect.height / 2;
          const pctX = Math.max(6, Math.min(94, (cardCenterX / gridRect.width) * 100));
          const pctY = Math.max(6, Math.min(94, (cardCenterY / gridRect.height) * 100));

          const rawClipTop = Math.max(0, Math.min(86, (fromTop / gridRect.height) * 100));
          const rawClipRight = Math.max(0, Math.min(86, (fromRight / gridRect.width) * 100));
          const rawClipBottom = Math.max(0, Math.min(86, (fromBottom / gridRect.height) * 100));
          const rawClipLeft = Math.max(0, Math.min(86, (fromLeft / gridRect.width) * 100));

          // On mobile 1x6 vertical stacks, keep initial clip band well inside viewport
          const clipTopPct = isMobile ? Math.min(rawClipTop, 56) : rawClipTop;
          const clipBottomPct = isMobile
            ? Math.max(8, Math.min(72, 100 - clipTopPct - 24))
            : rawClipBottom;

          // Compute directional outward push vectors & staggered delays for the 5 sibling cards
          DOMAINS_DATA.forEach((d) => {
            if (d.id === domainId) return;
            const sibEl = cardRefs.current[d.id];
            if (!sibEl) {
              vectors[d.id] = { dx: 0, dy: 14, delay: 0.03 };
              return;
            }
            const sibRect = sibEl.getBoundingClientRect();
            const sibCenterX = sibRect.left - gridRect.left + sibRect.width / 2;
            const sibCenterY = sibRect.top - gridRect.top + sibRect.height / 2;
            const deltaX = sibCenterX - cardCenterX;
            const deltaY = sibCenterY - cardCenterY;
            const dist = Math.hypot(deltaX, deltaY) || 1;
            const normX = deltaX / dist;
            const normY = deltaY / dist;
            const maxGridDist = Math.hypot(gridRect.width, gridRect.height) || 1;
            const normalizedDist = Math.min(1, dist / maxGridDist);
            vectors[d.id] = {
              dx: Math.round(normX * 20),
              dy: Math.round(normY * 18),
              delay: Number((normalizedDist * 0.09).toFixed(3)),
            };
          });

          const ratioW = cardRect.width / gridRect.width;
          const initialScale = Math.max(0.72, Math.min(0.94, ratioW * 1.45));

          return {
            measuredGridHeight: Math.round(gridRect.height),
            vectors,
            origin: {
              originX: `${pctX.toFixed(1)}%`,
              originY: `${pctY.toFixed(1)}%`,
              initialScale,
              offsetX: Math.max(-180, Math.min(180, cardCenterX - gridRect.width / 2)),
              offsetY: Math.max(-110, Math.min(110, cardCenterY - gridRect.height / 2)),
              clipTopPct,
              clipRightPct: isMobile ? 2 : rawClipRight,
              clipBottomPct,
              clipLeftPct: isMobile ? 2 : rawClipLeft,
              isMobile,
              cardBgCss: bentoTpl.cardBgCss,
              isDarkTextCard: bentoTpl.isDarkTextCard,
            },
          };
        }
      }

      const idx = DOMAINS_DATA.findIndex((d) => d.id === domainId);
      const col = idx >= 0 ? idx % 3 : 1;
      const row = idx >= 0 ? Math.floor(idx / 3) : 0;
      const fallbackX = col === 0 ? '17%' : col === 1 ? '50%' : '83%';
      const fallbackY = row === 0 ? '25%' : '75%';
      DOMAINS_DATA.forEach((d, i) => {
        if (d.id === domainId) return;
        const c = i % 3;
        const r = Math.floor(i / 3);
        vectors[d.id] = {
          dx: (c - col) * 14,
          dy: (r - row) * 16,
          delay: Math.min(0.09, (Math.abs(c - col) + Math.abs(r - row)) * 0.03),
        };
      });

      return {
        vectors,
        origin: {
          originX: fallbackX,
          originY: fallbackY,
          initialScale: 0.78,
          offsetX: (col - 1) * 90,
          offsetY: row === 0 ? -45 : 45,
          clipTopPct: row === 0 ? 0 : 52,
          clipRightPct: col === 2 ? 0 : col === 1 ? 34 : 68,
          clipBottomPct: row === 0 ? 52 : 0,
          clipLeftPct: col === 0 ? 0 : col === 1 ? 34 : 68,
          isMobile,
          cardBgCss: bentoTpl.cardBgCss,
          isDarkTextCard: bentoTpl.isDarkTextCard,
        },
      };
    },
    [isFlatSoftLight]
  );

  const openExpandedCard = useCallback(
    (domain: DomainData) => {
      if (expanded === domain.id) return;

      if (closeFlipTimerRef.current) {
        window.clearTimeout(closeFlipTimerRef.current);
        closeFlipTimerRef.current = null;
      }

      SoundEngine.playTap();

      const { origin, vectors, measuredGridHeight } = computeCardScaleOrigin(domain.id);
      if (measuredGridHeight && measuredGridHeight > 0 && !expanded) {
        setGridNaturalHeight(measuredGridHeight);
      }

      lastOpenedIdRef.current = domain.id;
      setScaleOrigin(origin);
      setSiblingVectors(vectors);
      setHoveredDomainId(null);
      setActiveCategory(domain.id);
      setExpanded(domain.id);
      setInteractionState(prefersReducedMotion ? 'expanded' : 'expanding');

      // On mobile/tablet, smoothly keep the expanded grid area in view
      if (origin.isMobile && scrollViewportRef.current && cardsWrapperRef.current) {
        const vpRect = scrollViewportRef.current.getBoundingClientRect();
        const wrapRect = cardsWrapperRef.current.getBoundingClientRect();
        if (wrapRect.top < vpRect.top || wrapRect.top > vpRect.top + 80) {
          scrollViewportRef.current.scrollTo({
            top: Math.max(0, scrollViewportRef.current.scrollTop + (wrapRect.top - vpRect.top)),
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
        }
      }
    },
    [expanded, computeCardScaleOrigin, prefersReducedMotion]
  );

  const handleExpandComplete = useCallback(() => {
    if (!expanded) return;
    setInteractionState('expanded');
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [expanded]);

  const closeExpandedCard = useCallback(() => {
    if (!expanded) return;

    if (closeFlipTimerRef.current) {
      window.clearTimeout(closeFlipTimerRef.current);
      closeFlipTimerRef.current = null;
    }

    SoundEngine.playTap();
    lastOpenedIdRef.current = expanded;
    setActiveCategory('ALL');
    setHoveredDomainId(null);
    setInteractionState(prefersReducedMotion ? 'idle' : 'closing');
    setExpanded(null);

    if (prefersReducedMotion) {
      setGridNaturalHeight(undefined);
      const closingId = lastOpenedIdRef.current;
      if (closingId) {
        cardRefs.current[closingId]?.focus({ preventScroll: true });
      }
    } else {
      // Keep FLIP guard active for the full 800ms return transition before restoring idle hover transitions
      closeFlipTimerRef.current = window.setTimeout(() => {
        closeFlipTimerRef.current = null;
        setInteractionState('idle');
        setGridNaturalHeight(undefined);
        const closingId = lastOpenedIdRef.current;
        if (closingId) {
          cardRefs.current[closingId]?.focus({ preventScroll: true });
        }
      }, Math.round(SERVICE_FLIP_DURATION * 1000) + 30);
    }
  }, [expanded, prefersReducedMotion]);

  const handleExpandExitComplete = useCallback(() => {
    if (expanded || closeFlipTimerRef.current) return;
    setInteractionState('idle');
    setGridNaturalHeight(undefined);
    const closingId = lastOpenedIdRef.current;
    if (closingId) {
      cardRefs.current[closingId]?.focus({ preventScroll: true });
    }
  }, [expanded]);

  const switchExpandedDomain = useCallback(
    (domain: DomainData) => {
      if (domain.id === expanded) return;
      SoundEngine.playTap();
      const { origin, vectors } = computeCardScaleOrigin(domain.id);
      lastOpenedIdRef.current = domain.id;
      setScaleOrigin(origin);
      setSiblingVectors(vectors);
      setExpanded(domain.id);
      setActiveCategory(domain.id);
      setInteractionState('expanded');
      if (expandedCardRef.current) {
        expandedCardRef.current.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [expanded, computeCardScaleOrigin, prefersReducedMotion]
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

  const flipLayoutTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: SERVICE_FLIP_DURATION,
        ease: SERVICE_FLIP_EASE,
      };
  const selectedDomainIdx = expanded
    ? DOMAINS_DATA.findIndex((d) => d.id === expanded)
    : -1;
  const isAnyCardExpanded = Boolean(expanded);
  const isFlipAnimating =
    interactionState === 'expanding' ||
    interactionState === 'expanded' ||
    interactionState === 'closing';

  return (
    <div
      id="services-page-container"
      data-element-name="Trang Dịch Vụ & Giải Pháp"
      data-element-type="container"
      data-element-page="services"
      data-element-parent="global-content-viewport"
      className={cn(
        'u420-scope main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-visible no-scrollbar font-play select-none text-left rounded-[var(--radius-global,var(--radius-main,14px))] text-[var(--text-primary)] box-border',
        isFlatSoftLight
          ? 'services-flat-soft-bento-studio'
          : !isDark && 'services-bento-light-mode'
      )}
    >
      <style>{U420_STYLES}</style>
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

        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"],
        html[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"],
        html.dark[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"],
        html #services-page-container.services-bento-light-mode .service-card.domain-card[data-multicolor-bento="true"] {
          font-family: 'Play', sans-serif;
          background: var(--bento-card-bg) !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
          transition:
            transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1),
            box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-dark-text-card="true"]) .service-title-text:not(.has-gradient-title),
        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-dark-text-card="true"]) .service-title-text:not(.has-gradient-title) > span {
          color: #ffffff !important;
        }

        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-dark-text-card="true"]) .service-desc-text {
          color: rgba(248, 250, 252, 0.94) !important;
        }

        .card-bounce {
          transition: transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }

        .card-bounce:hover,
        .card-bounce:active {
          transform: scale(1.055) !important;
        }

        @media (hover: hover) and (pointer: fine) {
          html #services-page-container .service-card.domain-card.u420-t[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover {
            transform: translateY(-4px) scale(1.055) !important;
            border-color: rgba(255, 255, 255, 0.26) !important;
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.22),
              0 18px 32px -18px rgba(0, 0, 0, 0.65),
              inset 0 1px 0 rgba(255, 255, 255, 0.24) !important;
          }
        }

        /* Hiệu ứng 1. Scale Up / Scale Transform khi click vào Thẻ Dịch Vụ */
        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-expanded-active="true"]):active {
          transform: translateY(-2px) scale(1.045) !important;
          border-color: rgba(255, 255, 255, 0.44) !important;
          box-shadow:
            0 0 0 1.5px rgba(255, 255, 255, 0.36),
            0 24px 48px -12px rgba(0, 0, 0, 0.72),
            inset 0 1px 0 rgba(255, 255, 255, 0.34) !important;
          z-index: 25 !important;
        }

        html #services-page-container #services-cards-wrapper.services-flip-stage--expanded {
          isolation: isolate;
        }

        html #services-page-container #services-cards-grid.services-grid--expanded {
          pointer-events: none;
        }

        html #services-page-container .service-card-grid-slot {
          min-width: 0;
          min-height: 0;
        }

        /* FLIP CSS classes: yield transform control 100% to Framer Motion during 800ms cubic-bezier(0.22, 1, 0.36, 1) expansion */
        html #services-page-container #services-cards-wrapper[data-flip-animating="true"] .service-card.domain-card[data-multicolor-bento="true"],
        html[data-card-style] #services-page-container #services-cards-wrapper[data-flip-animating="true"] .service-card.domain-card[data-multicolor-bento="true"],
        html.dark[data-card-style] #services-page-container #services-cards-wrapper[data-flip-animating="true"] .service-card.domain-card[data-multicolor-bento="true"],
        html #services-page-container .service-card.domain-card[data-expanded-active="true"],
        html[data-card-style] #services-page-container .service-card.domain-card[data-expanded-active="true"],
        html #services-page-container .service-card.service-card--sibling-hidden,
        html #services-page-container .service-card.service-card--flip-animating {
          transition:
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.35s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        html #services-page-container .service-card.domain-card[data-expanded-active="true"],
        html #services-page-container .service-card.service-card--sibling-hidden {
          pointer-events: none !important;
        }

        html #services-page-container #services-cards-wrapper[data-flip-animating="true"] .card-bounce:hover,
        html #services-page-container #services-cards-wrapper[data-flip-animating="true"] .card-bounce:active,
        html #services-page-container .service-card.service-card--sibling-hidden:hover,
        html #services-page-container .service-card.service-card--sibling-hidden:active {
          transform: none !important;
        }

        /* Active expanded CSS class occupying 100% of the 6-card Grid container for FLIP target */
        html:root body #services-page-container #services-expanded-card.service-card--expanded,
        html:root[data-card-style] body #services-page-container #services-expanded-card.service-card--expanded {
          grid-column: 1 / -1 !important;
          grid-row: 1 / -1 !important;
          width: 100% !important;
          z-index: 30 !important;
          transition:
            box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        html:root body #services-page-container #services-expanded-card.service-card--expanded[data-locked-grid-height="true"],
        html:root[data-card-style] body #services-page-container #services-expanded-card.service-card--expanded[data-locked-grid-height="true"] {
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }

        html #services-page-container .service-card.domain-card[data-scale-expanding="true"] {
          z-index: 28 !important;
          filter: brightness(1.06);
          border-color: rgba(255, 255, 255, 0.48) !important;
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.38),
            0 28px 56px -12px rgba(0, 0, 0, 0.78),
            inset 0 1px 0 rgba(255, 255, 255, 0.38) !important;
        }

        html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-dark-text-card="true"]) .service-title-text:not(.has-gradient-title),
        html[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-dark-text-card="true"]) .service-title-text:not(.has-gradient-title),
        html.dark[data-card-style] #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:not([data-dark-text-card="true"]) .service-title-text:not(.has-gradient-title) > span {
          color: #ffffff !important;
        }

        /* =================================================================== */
        /* CREATOR STUDIO BENTO (GIAO DIỆN PHẲNG SÁNG — FLAT-SOFT-UI)         */
        /* Dotted pastel canvas + full-color Bento cards + Spotlight & 3D Tilt */
        /* =================================================================== */
        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio #service-main-card {
          background-color: #f4f7fb !important;
          background-image:
            radial-gradient(circle at 12% 14%, rgba(168, 85, 247, 0.16) 0%, transparent 44%),
            radial-gradient(circle at 88% 18%, rgba(14, 165, 233, 0.16) 0%, transparent 42%),
            radial-gradient(circle at 52% 90%, rgba(244, 114, 182, 0.14) 0%, transparent 46%),
            radial-gradient(rgba(71, 85, 105, 0.13) 1px, transparent 1px) !important;
          background-size: 100% 100%, 100% 100%, 100% 100%, 24px 24px !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-multicolor-bento="true"] {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;
          transform-style: preserve-3d;
          background: var(--bento-card-bg) !important;
          color: #0f172a !important;
          border-radius: 12px !important;
          padding: 15px !important;
          border: 1px solid var(--bento-card-border, rgba(148, 163, 184, 0.28)) !important;
          box-shadow:
            0 4px 14px -4px rgba(15, 23, 42, 0.08),
            0 10px 24px -8px rgba(15, 23, 42, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.92) !important;
          transition:
            transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-dark-text-card="true"] {
          color: #0f172a !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-dark-text-card="true"] .service-title-text,
        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-dark-text-card="true"] .service-title-text > span {
          color: #0f172a !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-dark-text-card="true"] .service-desc-text {
          color: #334155 !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-multicolor-bento="true"]::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 5;
          opacity: 0;
          transition: opacity 0.28s ease;
          background: radial-gradient(
            380px circle at var(--mx, 50%) var(--my, 50%),
            rgba(255, 255, 255, 0.48),
            rgba(255, 255, 255, 0.14) 42%,
            transparent 72%
          ) !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-multicolor-bento="true"]::after {
          display: none !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card .service-card-header svg {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (hover: hover) and (pointer: fine) {
          html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card.u420-t[data-multicolor-bento="true"]:not([data-expanded-active="true"]):hover {
            transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-8px) scale(1.018) !important;
            border-color: var(--bento-card-border, rgba(99, 102, 241, 0.36)) !important;
            box-shadow:
              0 22px 42px -12px rgba(15, 23, 42, 0.16),
              0 10px 20px -6px rgba(15, 23, 42, 0.09),
              inset 0 1px 0 rgba(255, 255, 255, 0.98) !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card[data-multicolor-bento="true"]:hover::before {
            opacity: 1 !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container.services-flat-soft-bento-studio .service-card.domain-card:hover .service-card-header svg {
            transform: scale(1.14) rotate(-5deg);
          }
        }

        html #services-page-container .service-card.domain-card {
          container-type: inline-size;
          container-name: service-card-box;
        }

        html #services-page-container .service-partner-logos-row {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          gap: 8px !important;
          min-width: 0 !important;
        }

        html #services-page-container .service-partner-logos-row .service-partner-logo {
          margin-left: 0 !important;
          transition:
            margin-left 220ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 220ms ease !important;
        }

        @container service-card-box (max-width: 315px) {
          html #services-page-container .service-partner-logos-row {
            gap: 0px !important;
          }

          html #services-page-container .service-partner-logos-row .service-partner-logo + .service-partner-logo {
            margin-left: -10px !important;
          }
        }

        @media (max-width: 480px) {
          html #services-page-container .service-partner-logos-row {
            gap: 0px !important;
          }

          html #services-page-container .service-partner-logos-row .service-partner-logo + .service-partner-logo {
            margin-left: -10px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html #services-page-container .service-card.domain-card[data-multicolor-bento="true"]:hover {
            transform: none !important;
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
          data-bento-canvas={isFlatSoftLight ? 'true' : undefined}
          data-floating-surface="main"
          data-detail-open={expandedDomain ? 'true' : 'false'}
          data-detail-overlay={expandedDomain ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Dịch Vụ"
          data-element-type="card"
          data-element-page="services"
          data-element-parent="services-cards-track"
          onClick={(e) => {
            if (!selectedDomainId) return;
            const target = e.target as HTMLElement;
            if (
              target.closest('#services-expanded-card') ||
              target.closest('#services-hero-banner-controls') ||
              target.closest('#services-compact-menu-btn') ||
              target.closest('button, a, [role="listbox"], [role="option"]')
            ) {
              return;
            }
            closeExpandedCard();
          }}
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
            className="w-full flex flex-col justify-start gap-[var(--space-card-gap,16px)] min-w-0 flex-1 min-h-full h-auto box-border"
          >
            {/* 1. HERO BANNER ĐẦU TRANG LĨNH VỰC — GIỮ NGUYÊN VỊ TRÍ ĐỂ ZERO LAYOUT SHIFT */}
            <div
              id="services-hero-banner"
              data-element-type="section"
              data-section-card="true"
              data-has-compact-menu="true"
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
            </div>

            {/* 2. VÙNG LƯỚI 6 THẺ LĨNH VỰC & PROGRESSIVE FULL-GRID EXPANSION */}
            <LayoutGroup id="services-cards-layout-group">
              <div
                id="services-cards-wrapper"
                ref={cardsWrapperRef}
                data-interaction-state={interactionState}
                data-expanded={isAnyCardExpanded ? 'true' : 'false'}
                data-flip-animating={isFlipAnimating ? 'true' : 'false'}
                data-expand-effect="framer-flip-full-grid"
                className={cn(
                  'relative w-full grid grid-cols-1 items-start flex-1 min-h-0 h-auto',
                  isAnyCardExpanded && 'services-flip-stage--expanded'
                )}
              >
                <div
                  id="services-cards-grid"
                  ref={cardsGridRef}
                  data-card-layout="responsive-grid"
                  data-expanded={isAnyCardExpanded ? 'true' : 'false'}
                  aria-hidden={isAnyCardExpanded}
                  className={cn(
                    'unified-cards-grid services-cards-grid services-responsive-grid card-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-start-1 row-start-1 w-full min-w-0 h-auto',
                    isAnyCardExpanded && 'services-grid--expanded is-exiting-layer',
                    isAnyCardExpanded && scaleOrigin?.isMobile && 'is-hidden-layer'
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
                    const bentoTpl = isFlatSoftLight
                      ? DOMAIN_FLAT_LIGHT_TEMPLATES[domain.id] || DOMAIN_FLAT_LIGHT_TEMPLATES['01']
                      : DOMAIN_BENTO_TEMPLATES[domain.id] || DOMAIN_BENTO_TEMPLATES['01'];
                    const effectiveIconColor = bentoTpl.iconColor;

                    const isSelectedCard = expanded === domain.id;
                    const isOtherDimmed = isAnyCardExpanded && !isSelectedCard;
                    const isReturningFromFlip =
                      hasMountedGridRef.current && lastOpenedIdRef.current === domain.id;

                    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                      const el = cardRefs.current[domain.id];
                      if (!el) return;
                      const rect = el.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      el.style.setProperty('--mx', `${x.toFixed(1)}px`);
                      el.style.setProperty('--my', `${y.toFixed(1)}px`);
                      if (!prefersReducedMotion && rect.width > 0 && rect.height > 0) {
                        const cx = rect.width / 2;
                        const cy = rect.height / 2;
                        el.style.setProperty('--rx', `${(((y - cy) / cy) * -3.5).toFixed(2)}deg`);
                        el.style.setProperty('--ry', `${(((x - cx) / cx) * 3.5).toFixed(2)}deg`);
                      }
                    };

                    const handleCardMouseLeave = () => {
                      const el = cardRefs.current[domain.id];
                      if (el) {
                        el.style.setProperty('--rx', '0deg');
                        el.style.setProperty('--ry', '0deg');
                      }
                      setHoveredDomainId(null);
                      setInteractionState((prev) => (prev === 'hovered' ? 'idle' : prev));
                    };

                    const handleCardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
                      const el = cardRefs.current[domain.id];
                      if (!el) return;
                      const rect = el.getBoundingClientRect();
                      const size = Math.max(rect.width, rect.height) * 1.3;
                      const ripple = document.createElement('span');
                      ripple.className = 'bento-card-ripple';
                      ripple.style.width = `${size}px`;
                      ripple.style.height = `${size}px`;
                      ripple.style.left = `${e.clientX - rect.left}px`;
                      ripple.style.top = `${e.clientY - rect.top}px`;
                      el.appendChild(ripple);
                      window.setTimeout(() => ripple.remove(), 680);
                    };

                    const u420Variant = DOMAIN_U420_VARIANTS[domain.id] || 'c1';

                    return (
                      <div
                        key={domain.id}
                        data-service-slot={domain.id}
                        data-expanded={isSelectedCard ? 'true' : 'false'}
                        className={cn(
                          'service-card-grid-slot relative w-full h-full min-h-[196px] sm:min-h-[216px]',
                          isSelectedCard && 'service-card-grid-slot--expanded'
                        )}
                      >
                        {!isSelectedCard && (
                      <motion.div
                        layout
                        layoutId={`service-card-flip-${domain.id}`}
                        ref={(el) => {
                          cardRefs.current[domain.id] = el;
                        }}
                        id={getCardDomId(domain.id)}
                        data-element-type="card"
                        data-section-card="true"
                        data-expand-motion="true"
                        data-flip-motion="true"
                        data-scale-up-motion="true"
                        data-service-themed="true"
                        data-multicolor-bento="true"
                        data-bento-styled="true"
                        data-dark-text-card={
                          isFlatSoftLight && bentoTpl.isDarkTextCard ? 'true' : 'false'
                        }
                        data-expanded="false"
                        data-expanded-active={isAnyCardExpanded ? 'true' : 'false'}
                        data-scale-expanding="false"
                        data-hovered={hoveredDomainId === domain.id ? 'true' : 'false'}
                        role="button"
                        tabIndex={isAnyCardExpanded ? -1 : 0}
                        aria-expanded={false}
                        initial={
                          prefersReducedMotion || isReturningFromFlip
                            ? false
                            : { opacity: 0, y: 14, scale: 0.96 }
                        }
                        whileTap={
                          !isAnyCardExpanded && !prefersReducedMotion
                            ? { scale: 1.03, y: -2 }
                            : undefined
                        }
                        animate={
                          isOtherDimmed
                            ? {
                                opacity: 0,
                                scale: prefersReducedMotion ? 1 : 0.88,
                                x: prefersReducedMotion
                                  ? 0
                                  : siblingVectors[domain.id]?.dx ?? 0,
                                y: prefersReducedMotion
                                  ? 0
                                  : siblingVectors[domain.id]?.dy ??
                                    (selectedDomainIdx === -1
                                      ? 0
                                      : idx < selectedDomainIdx
                                        ? -16
                                        : 16),
                              }
                            : { opacity: 1, scale: 1, x: 0, y: 0 }
                        }
                        transition={{
                          layout: flipLayoutTransition,
                          opacity: {
                            duration: prefersReducedMotion
                              ? 0
                              : isOtherDimmed
                                ? 0.44
                                : 0.48,
                            delay: prefersReducedMotion
                              ? 0
                              : isOtherDimmed
                                ? siblingVectors[domain.id]?.delay ?? 0
                                : interactionState === 'closing'
                                  ? 0.16 + (siblingVectors[domain.id]?.delay ?? 0) * 0.6
                                  : interactionState === 'idle' && !hasMountedGridRef.current
                                    ? idx * 0.03
                                    : 0,
                            ease: SERVICE_FLIP_EASE,
                          },
                          scale: {
                            duration: prefersReducedMotion
                              ? 0
                              : isOtherDimmed
                                ? 0.48
                                : 0.56,
                            delay: prefersReducedMotion
                              ? 0
                              : isOtherDimmed
                                ? siblingVectors[domain.id]?.delay ?? 0
                                : interactionState === 'closing'
                                  ? 0.12
                                  : 0,
                            ease: SERVICE_FLIP_EASE,
                          },
                          x: {
                            duration: prefersReducedMotion ? 0 : 0.52,
                            delay: prefersReducedMotion
                              ? 0
                              : isOtherDimmed
                                ? siblingVectors[domain.id]?.delay ?? 0
                                : interactionState === 'closing'
                                  ? 0.12
                                  : 0,
                            ease: SERVICE_FLIP_EASE,
                          },
                          y:
                            interactionState === 'idle' &&
                            !prefersReducedMotion &&
                            !hasMountedGridRef.current
                              ? { ...CARD_SETTLE_SPRING, delay: idx * 0.035 }
                              : {
                                  duration: prefersReducedMotion ? 0 : 0.52,
                                  delay: prefersReducedMotion
                                    ? 0
                                    : isOtherDimmed
                                      ? siblingVectors[domain.id]?.delay ?? 0
                                      : interactionState === 'closing'
                                        ? 0.12
                                        : 0,
                                  ease: SERVICE_FLIP_EASE,
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
                          borderRadius: 12,
                          '--bento-card-bg': bentoTpl.cardBgCss,
                          '--bento-card-border': bentoTpl.borderColor,
                          '--service-card-accent': meta.accentLight,
                          '--service-card-accent-dark': meta.accentDark,
                          '--service-card-active-accent': accentColor,
                          '--service-card-tint': meta.tintBg,
                          '--service-card-img-url': `url("${serviceImage}")`,
                        } as React.CSSProperties}
                        className={cn(
                          'u420-t service-card domain-card service-theme-card bento-card bento-border group relative rounded-[12px] p-[var(--grid-cards-padding,var(--space-card-padding,16px))] box-border w-full h-full min-h-[196px] sm:min-h-[216px] flex flex-col justify-between text-left cursor-pointer overflow-hidden card-bounce',
                          isOtherDimmed && 'service-card--sibling-hidden',
                          isFlipAnimating && 'service-card--flip-animating',
                          isFlatSoftLight && bentoTpl.isDarkTextCard ? 'text-slate-900' : 'text-white',
                          bentoTpl.cardBgClass
                        )}
                      >
                        {/* Ambient Glowing Orb góc thẻ từ mẫu Creator Studio Bento (tắt lóe sáng khi rê chuột) */}
                        <div
                          className={cn(
                            'absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-65',
                            bentoTpl.orbClass
                          )}
                        />

                        {/* 3-Part Flexible Card Body */}
                        <div className="service-card-body relative z-10 flex flex-col flex-1 min-h-0 justify-between gap-2.5 w-full min-w-0">
                          {/* TOP: Creator Studio Header (Icon + Title + Lucian #420 Hover SVG Badge) */}
                          <div className="flex flex-col gap-2 min-w-0 shrink-0">
                            <div className="service-card-header flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {renderDomainIcon(
                                  meta.iconKey,
                                  'w-5 h-5 shrink-0 stroke-[2.2] transition-transform duration-300',
                                  effectiveIconColor
                                )}
                                <h3
                                  className={cn(
                                    'service-title-text bento-unified-title font-play text-[16px] font-bold tracking-tight leading-snug m-0 min-w-0 flex-1 line-clamp-2 [text-wrap:balance]',
                                    bentoTpl.titleGradient && 'has-gradient-title'
                                  )}
                                  title={fullTitle}
                                >
                                  <span
                                    style={{
                                      color: bentoTpl.titleGradient
                                        ? undefined
                                        : isFlatSoftLight && bentoTpl.isDarkTextCard
                                          ? '#0f172a'
                                          : '#ffffff',
                                    }}
                                    className={
                                      bentoTpl.titleGradient
                                        ? 'gradient-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-pink-200'
                                        : isFlatSoftLight && bentoTpl.isDarkTextCard
                                          ? 'text-slate-900'
                                          : 'text-white'
                                    }
                                  >
                                    {displayTitle}
                                  </span>
                                </h3>
                              </div>
                              <U420CardHoverIcon variant={u420Variant} />
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
                              <BlurUpImage
                                src={serviceImage}
                                fallbackSrc={meta.fallbackIllustration}
                                alt={fullTitle}
                                width={104}
                                height={104}
                                priority={idx < 3 ? 'eager' : 'lazy'}
                                variant="contain"
                                fetchPriority={idx < 3 ? 'high' : 'auto'}
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
                              <div className="service-partner-logos-row flex items-center flex-nowrap min-w-0">
                                {(domain.companyLogos || []).slice(0, 4).map((partner, pIdx) => (
                                  <div
                                    key={partner.name || pIdx}
                                    title={partner.name}
                                    className="company-logo-surface service-partner-logo w-[30px] h-[30px] aspect-square rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
                                  >
                                    <BlurUpImage
                                      src={partner.logo}
                                      fallbackSrc={partner.fallbackLogo || serviceImage}
                                      alt={partner.name}
                                      variant="contain"
                                      className="w-full h-full object-contain rounded-full block select-none"
                                      style={{
                                        imageRendering: '-webkit-optimize-contrast',
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
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 3. THẺ CHI TIẾT MỞ RỘNG CHIẾM TOÀN BỘ VÙNG GRID 6 THẺ (PROGRESSIVE FLIP) */}
                <AnimatePresence onExitComplete={handleExpandExitComplete}>
                  {expandedDomain && expandedMeta && (
                    <ServiceExpandedDetail
                      key="services-expanded-detail-panel"
                      expandedDomain={expandedDomain}
                      expandedMeta={expandedMeta}
                      allDomains={DOMAINS_DATA}
                      serviceAssignments={serviceAssignments}
                      interactionState={interactionState}
                      scaleOrigin={scaleOrigin}
                      minHeightPx={gridNaturalHeight}
                      prefersReducedMotion={prefersReducedMotion}
                      isEn={isEn}
                      isDarkMode={isDark}
                      isFlatSoftLight={isFlatSoftLight}
                      isLeatherTheme={isLeatherTheme}
                      expandedCardRef={expandedCardRef}
                      expandedBodyRef={expandedBodyRef}
                      closeButtonRef={closeButtonRef}
                      onClose={closeExpandedCard}
                      onExpandComplete={handleExpandComplete}
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
