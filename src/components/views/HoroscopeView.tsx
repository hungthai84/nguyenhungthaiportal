'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Sparkles = createAnimatedIcon('sparkles');
const Search = createAnimatedIcon('search');
const Check = createAnimatedIcon('check');
const CheckCircle2 = createAnimatedIcon('check-circle');
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';
import { ZODIAC_SIGNS, ZODIAC_ORDER, getCanChiInfo } from '@/data/horoscope';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import TuViBookCard from '@/components/views/horoscope/TuViBookCard';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import { useTheme } from '@/hooks/useTheme';

const HOROSCOPE_CARD_GAP_PX = 10;

// Tự động quyết định Responsive Bento Card hay Responsive Grid Card theo số lượng & tính đối xứng của sub-card
const resolveAdaptiveCardLayout = (
  subCardCount: number,
  hasAsymmetricFocalCard: boolean
): 'bento' | 'grid' => {
  if (hasAsymmetricFocalCard) return 'bento';
  if (subCardCount <= 1) return 'bento';
  if (subCardCount % 2 === 1 && subCardCount >= 3) return 'bento';
  return 'grid';
};

export interface HoroscopeViewProps {
  currentTheme?: string;
}

export const HOROSCOPE_SLIDES = [
  { idx: 0, label: '1. Hồ sơ & 6. Luận giải', shortLabel: 'Hồ sơ & Luận giải', rawTitle: 'Hồ sơ bản mệnh & Luận giải lá số' },
  { idx: 1, label: '2. Phong cách quản trị', shortLabel: 'Phong cách quản trị', rawTitle: 'Phong cách quản trị' },
  { idx: 2, label: '3. Chân dung công việc', shortLabel: 'Chân dung công việc', rawTitle: 'Chân dung công việc · 6 Cung cốt lõi' },
  { idx: 3, label: '6 Trụ cột Triết lý lãnh đạo', shortLabel: '6 Trụ cột Triết lý', rawTitle: '6 Trụ Cột Triết Lý Lãnh Đạo & Hành Động' },
  { idx: 4, label: '4. Kỹ năng ngũ hành', shortLabel: 'Kỹ năng ngũ hành', rawTitle: 'Kỹ năng ngũ hành' },
  { idx: 5, label: '5. Kiểm tra tương hợp', shortLabel: 'Kiểm tra tương hợp', rawTitle: 'Kiểm tra tương hợp' },
];

export interface CompassLuckyDirection {
  direction: string;
  degree: number;
  starName: string;
  element: string;
  elementBadge: string;
  meaning: string;
  accent: string;
  badgeBg: string;
}

export const COMPASS_LUCKY_DIRECTIONS: CompassLuckyDirection[] = [
  {
    direction: 'Tây Bắc',
    degree: 315,
    starName: 'Sinh Khí',
    element: 'Kim',
    elementBadge: 'Đại Cát',
    meaning: 'Tài lộc hanh thông · Sự nghiệp thăng hoa · Vạn sự như ý',
    accent: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    direction: 'Tây Nam',
    degree: 225,
    starName: 'Thiên Y',
    element: 'Thổ',
    elementBadge: 'Thượng Cát',
    meaning: 'Quý nhân phù trợ · Sức khỏe khang an · Tâm trí an định',
    accent: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  {
    direction: 'Đông Bắc',
    degree: 45,
    starName: 'Diên Niên',
    element: 'Thổ',
    elementBadge: 'Thượng Cát',
    meaning: 'Hòa khí sinh tài · Đội ngũ gắn kết · Quan hệ bền chặt',
    accent: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  {
    direction: 'Tây',
    degree: 270,
    starName: 'Phục Vị',
    element: 'Kim',
    elementBadge: 'Trung Cát',
    meaning: 'Củng cố nội lực · Bản lĩnh kiên định · Vững vàng trước biến cố',
    accent: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
];

const WORK_PERSONALITY_TRAITS = [
  {
    id: 'strategic',
    title: 'Tư Duy Chiến Lược & Viễn Kiến',
    subtitle: 'Nhóm Tam Hợp Thân - Tý - Thìn',
    tag: 'Tầm Nhìn Dài Hạn',
    description:
      'Sở hữu khả năng nhìn xa trông rộng, luôn đặt mục tiêu sự nghiệp và thành tựu hệ thống lên hàng đầu. Trong công việc không thích làm theo lối mòn mà luôn tìm cách tái cấu trúc, tối ưu hóa quy trình để tạo ra giá trị bền vững.',
    highlights: ['Hoạch Định Lộ Trình 3-5 Năm', 'Tư Duy Hệ Thống Sắc Bén', 'Quyết Đoán Ở Thời Điểm Then Chốt'],
  },
  {
    id: 'depth',
    title: 'Nội Lực Sâu Sắc & Kín Kẽ',
    subtitle: 'Vàng Trong Đáy Biển',
    tag: 'Điềm Tĩnh & Bản Lĩnh',
    description:
      'Mang bản chất của kim loại quý ẩn sâu dưới lòng đại dương: không phô trương ồn ào nhưng nội lực cực kỳ thâm hậu. Càng trong môi trường áp lực cao hoặc khủng hoảng, sự điềm tĩnh và khả năng phân tích càng phát huy tối đa.',
    highlights: ['Chịu Áp Lực Cực Tốt', 'Giữ Bí Mật & Chữ Tín Cao', 'Không Bị Dao Động Bởi Đám Đông'],
  },
  {
    id: 'execution',
    title: 'Kỷ Luật Thép & Chuẩn Mực Cao',
    subtitle: 'Kim Tứ Cục',
    tag: 'Chính Xác & Minh Bạch',
    description:
      'Đề cao tính nguyên tắc, rõ ràng trong phân quyền và minh bạch trong đánh giá hiệu suất (KPI/OKR). Làm việc có đầu có đuôi, yêu cầu chất lượng đầu ra đạt độ tinh xảo cao nhất.',
    highlights: ['Quản Trị Bằng Dữ Liệu & Quy Chuẩn', 'Trách Nhiệm Đến Cùng', 'Tối Ưu Nguồn Lực Tinh Gọn'],
  },
  {
    id: 'diplomacy',
    title: 'Đắc Nhân Tâm & Thu Phục Hiền Tài',
    subtitle: 'Thiên Can Giáp Mộc • Thủy Hỏa Ký Tế',
    tag: 'Lãnh Đạo Truyền Cảm Hứng',
    description:
      'Biết cách lắng nghe, thấu hiểu tâm lý cộng sự và đối tác. Thay vì áp đặt quyền lực cứng nhắc, thường dùng lý lẽ thuyết phục và tạo không gian để nhân sự chủ động phát huy sở trường.',
    highlights: ['Giao Tiếp Khéo Léo, Sắc Sảo', 'Xây Dựng Đội Ngũ Trung Thành', 'Kết Nối Đối Tác Chiến Lược'],
  },
];

const SIX_CORE_PALACES = [
  {
    id: 'menh',
    name: 'Cung Mệnh (Tý)',
    tag: 'Bản Mệnh Chi Lực',
    description:
      'Chủ về trí tuệ mưu lược, tư duy nhạy bén và tính cách điềm tĩnh, trọng chữ Tín. Khí chất điềm đạm, có tài quy tụ lòng người và năng lực điều hành tổng thể.',
    stars: ['Hải Trung Kim', 'Thiên Phủ', 'Hóa Khoa'],
    bullets: ['Tư duy chiến lược dài hạn', 'Chính trực & trọng danh dự', 'Điềm đạm trước áp lực lớn'],
  },
  {
    id: 'quan',
    name: 'Cung Quan Lộc (Thìn)',
    tag: 'Sự Nghiệp Vận Hành',
    description:
      'Sự nghiệp gắn liền với quản trị hệ thống, dịch vụ quy mô lớn, công nghệ và chuyển đổi số. Càng dấn thân phụng sự khách hàng càng tỏa sáng rực rỡ.',
    stars: ['Thái Âm', 'Văn Xương', 'Thiên Khôi'],
    bullets: ['Vận hành Contact Center 150+', 'Kiến trúc CRM & AI Bot', '22 năm cống hiến thực chiến'],
  },
  {
    id: 'tai',
    name: 'Cung Tài Bạch (Thân)',
    tag: 'Tài Lộc Thực Chiến',
    description:
      'Tài lộc cộng chắc từ năng lực điều hành thực chiến và tối ưu hóa chi phí vận hành (Cost-to-Serve), tạo ra giá trị thặng dư bền vững cho tổ chức.',
    stars: ['Thiên Đồng', 'Lộc Tồn', 'Hóa Lộc'],
    bullets: ['Tối ưu chi phí vận hành', 'Quản trị ngân sách minh bạch', 'Đầu tư giá trị bền vững'],
  },
  {
    id: 'thien_di',
    name: 'Cung Thiên Di (Ngọ)',
    tag: 'Ngoại Giao & Mở Rộng',
    description:
      'Ra ngoài có nhiều quý nhân tương trợ, thích ứng nhanh với môi trường đa văn hóa, tập đoàn đa quốc gia và các thị trường công nghệ chuyển biến liên tục.',
    stars: ['Thất Sát', 'Thiên Mã', 'Quý Nhân'],
    bullets: ['Hòa nhập tập đoàn lớn', 'Kết nối đối tác chiến lược', 'Linh hoạt ứng biến thời cuộc'],
  },
  {
    id: 'no_boc',
    name: 'Cung Nô Bộc (Tỵ)',
    tag: 'Đội Ngũ Nhân Sự',
    description:
      'Đội ngũ cấp dưới đoàn kết, tôn trọng kỷ luật và luôn được truyền cảm hứng qua phong cách lãnh đạo thấu cảm (Empathetic Leadership).',
    stars: ['Tả Phù', 'Hữu Bật', 'Thiên Đức'],
    bullets: ['Lãnh đạo truyền cảm hứng', 'Đào tạo đội ngũ kế thừa', 'Giữ chân nhân tài (Low Churn)'],
  },
  {
    id: 'phuc_duc',
    name: 'Cung Phúc Đức (Dần)',
    tag: 'Phúc Khí & Đạo Tâm',
    description:
      'Gốc rễ phúc đức vững bền, tâm niệm luôn đặt đạo đức nghề nghiệp và lòng nhân ái lên hàng đầu. Biến nguy thành an qua mọi giai đoạn thử thách.',
    stars: ['Thiên Phúc', 'Thiên Quan', 'Long Trì'],
    bullets: ['Tâm sáng – Vận thông', 'Bình diện trước biến động', 'Lan tỏa năng lượng tích cực'],
  },
];

const FIVE_ELEMENTS_GOVERNANCE = [
  {
    hanzi: '金',
    watermarkIcon: 'shield-check',
    palaceBadge: 'Cung Quan Lộc',
    title: 'Kim • Quy Trình & Chuẩn Hóa',
    desc: 'Thiết lập khung chuẩn mực vận hành, đảm bảo kỷ luật và kiểm soát chất lượng bằng dữ liệu.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'SOP, KPI, SLA, Quality Assurance & Tuân Thủ',
    footer: 'Phong Cách: Kỷ Luật & Chính Trực',
    theme: {
      cardBg:
        'bg-gradient-to-br from-sky-50/95 via-blue-50/80 to-indigo-50/60 dark:from-sky-950/50 dark:via-slate-900/85 dark:to-blue-950/40',
      bgLight: 'linear-gradient(135deg, rgba(240, 249, 255, 0.94) 0%, rgba(224, 242, 254, 0.86) 55%, rgba(186, 230, 253, 0.72) 100%)',
      bgDark: 'linear-gradient(135deg, rgba(12, 74, 110, 0.46) 0%, rgba(15, 23, 42, 0.88) 100%)',
      subBgLight: 'rgba(255, 255, 255, 0.74)',
      subBgDark: 'rgba(14, 116, 144, 0.24)',
      borderColorLight: 'rgba(56, 189, 248, 0.45)',
      borderColorDark: 'rgba(56, 189, 248, 0.36)',
      watermarkColor: '#0284c7',
      border: 'border-sky-200/80 dark:border-sky-500/35 hover:border-sky-400 dark:hover:border-sky-400/70',
      hanziColor: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-white/90 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/50',
      iconColor: 'text-sky-600 dark:text-sky-300',
      labelColor: 'text-sky-600 dark:text-sky-400',
      bottomBar: 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500',
    },
  },
  {
    hanzi: '水',
    watermarkIcon: 'cpu',
    palaceBadge: 'Cung Thiên Di',
    title: 'Thủy • Công Nghệ & Tự Động',
    desc: 'Tận dụng CRM, AI và Omnichannel để tối ưu hóa quy trình, loại bỏ điểm nghẽn và nâng cao năng suất.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'CRM, AI Gen, Omnichannel, Data Analytics',
    footer: 'Phong Cách: Nhạy Bén Số & Tinh Gọn',
    theme: {
      cardBg:
        'bg-gradient-to-br from-cyan-50/95 via-teal-50/80 to-emerald-50/60 dark:from-cyan-950/50 dark:via-slate-900/85 dark:to-teal-950/40',
      bgLight: 'linear-gradient(135deg, rgba(236, 254, 255, 0.94) 0%, rgba(207, 250, 254, 0.86) 55%, rgba(165, 243, 252, 0.72) 100%)',
      bgDark: 'linear-gradient(135deg, rgba(22, 78, 99, 0.48) 0%, rgba(15, 23, 42, 0.88) 100%)',
      subBgLight: 'rgba(255, 255, 255, 0.74)',
      subBgDark: 'rgba(8, 145, 178, 0.24)',
      borderColorLight: 'rgba(6, 182, 212, 0.45)',
      borderColorDark: 'rgba(34, 211, 238, 0.36)',
      watermarkColor: '#0891b2',
      border: 'border-cyan-200/80 dark:border-cyan-500/35 hover:border-cyan-400 dark:hover:border-cyan-400/70',
      hanziColor: 'text-teal-600 dark:text-cyan-400',
      badge: 'bg-white/90 dark:bg-cyan-950/80 text-teal-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-700/50',
      iconColor: 'text-teal-600 dark:text-cyan-300',
      labelColor: 'text-teal-600 dark:text-cyan-400',
      bottomBar: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500',
    },
  },
  {
    hanzi: '木',
    watermarkIcon: 'users',
    palaceBadge: 'Cung Nô Bộc',
    title: 'Mộc • Con Người & Phát Triển',
    desc: 'Lãnh đạo bằng sự thấu cảm, huấn luyện đội ngũ kế thừa và xây dựng văn hóa gắn kết bền chặt.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'Training, Coaching 1-on-1, Talent Succession',
    footer: 'Phong Cách: Thấu Cảm & Phát Triển',
    theme: {
      cardBg:
        'bg-gradient-to-br from-emerald-50/95 via-green-50/80 to-lime-50/60 dark:from-emerald-950/50 dark:via-slate-900/85 dark:to-green-950/40',
      bgLight: 'linear-gradient(135deg, rgba(236, 253, 245, 0.94) 0%, rgba(209, 250, 229, 0.86) 55%, rgba(167, 243, 208, 0.72) 100%)',
      bgDark: 'linear-gradient(135deg, rgba(6, 78, 59, 0.48) 0%, rgba(15, 23, 42, 0.88) 100%)',
      subBgLight: 'rgba(255, 255, 255, 0.74)',
      subBgDark: 'rgba(5, 150, 105, 0.24)',
      borderColorLight: 'rgba(16, 185, 129, 0.45)',
      borderColorDark: 'rgba(52, 211, 153, 0.36)',
      watermarkColor: '#059669',
      border: 'border-emerald-200/80 dark:border-emerald-500/35 hover:border-emerald-400 dark:hover:border-emerald-400/70',
      hanziColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-white/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-700/50',
      iconColor: 'text-emerald-600 dark:text-emerald-300',
      labelColor: 'text-emerald-600 dark:text-emerald-400',
      bottomBar: 'bg-gradient-to-r from-emerald-500 via-lime-500 to-amber-400',
    },
  },
  {
    hanzi: '火',
    watermarkIcon: 'heart',
    palaceBadge: 'Cung Mệnh',
    title: 'Hỏa • Trải Nghiệm Khách Hàng',
    desc: 'Lấy khách hàng làm trọng tâm, phản hồi nhanh chóng và chuyển hóa khiếu nại thành cơ hội gắn kết.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'CSAT, NPS, FCR, Customer Journey Mapping',
    footer: 'Phong Cách: Quyết Đoán & Tận Tâm',
    theme: {
      cardBg:
        'bg-gradient-to-br from-rose-50/95 via-pink-50/80 to-fuchsia-50/60 dark:from-rose-950/50 dark:via-slate-900/85 dark:to-pink-950/40',
      bgLight: 'linear-gradient(135deg, rgba(255, 241, 242, 0.94) 0%, rgba(255, 228, 230, 0.86) 55%, rgba(254, 205, 211, 0.72) 100%)',
      bgDark: 'linear-gradient(135deg, rgba(136, 19, 55, 0.48) 0%, rgba(15, 23, 42, 0.88) 100%)',
      subBgLight: 'rgba(255, 255, 255, 0.74)',
      subBgDark: 'rgba(225, 29, 72, 0.24)',
      borderColorLight: 'rgba(244, 63, 94, 0.45)',
      borderColorDark: 'rgba(251, 113, 133, 0.36)',
      watermarkColor: '#e11d48',
      border: 'border-rose-200/80 dark:border-rose-500/35 hover:border-rose-400 dark:hover:border-rose-400/70',
      hanziColor: 'text-rose-500 dark:text-rose-400',
      badge: 'bg-white/90 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border-rose-200/80 dark:border-rose-700/50',
      iconColor: 'text-rose-600 dark:text-rose-300',
      labelColor: 'text-rose-600 dark:text-rose-400',
      bottomBar: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500',
    },
  },
  {
    hanzi: '土',
    watermarkIcon: 'layers',
    palaceBadge: 'Tài Bạch • Phúc Đức',
    title: 'Thổ • Tài Chính & Nền Tảng',
    desc: 'Tối ưu chi phí phục vụ (Cost-to-Serve), quản trị rủi ro và giữ vững tính liên tục của hệ thống.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'Cost-to-Serve, BCP, Security & Risk Management',
    footer: 'Phong Cách: Điềm Tĩnh & Bền Vững',
    theme: {
      cardBg:
        'bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-yellow-50/60 dark:from-amber-950/50 dark:via-slate-900/85 dark:to-orange-950/40',
      bgLight: 'linear-gradient(135deg, rgba(255, 251, 235, 0.94) 0%, rgba(254, 243, 199, 0.86) 55%, rgba(253, 230, 138, 0.72) 100%)',
      bgDark: 'linear-gradient(135deg, rgba(120, 53, 15, 0.48) 0%, rgba(15, 23, 42, 0.88) 100%)',
      subBgLight: 'rgba(255, 255, 255, 0.74)',
      subBgDark: 'rgba(217, 119, 6, 0.24)',
      borderColorLight: 'rgba(245, 158, 11, 0.45)',
      borderColorDark: 'rgba(251, 191, 36, 0.36)',
      watermarkColor: '#d97706',
      border: 'border-amber-200/80 dark:border-amber-500/35 hover:border-amber-400 dark:hover:border-amber-400/70',
      hanziColor: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-white/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-700/50',
      iconColor: 'text-amber-600 dark:text-amber-300',
      labelColor: 'text-amber-600 dark:text-amber-400',
      bottomBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500',
    },
  },
  {
    hanzi: '合',
    watermarkIcon: 'network',
    palaceBadge: 'Ngũ Hành Toàn Diện',
    title: 'Mô Hình Điều Hành Tích Hợp',
    desc: 'Quy trình (Kim) tạo chuẩn mực · Công nghệ (Thủy) tạo hiệu suất · Con người (Mộc) tạo nội lực · Trải nghiệm (Hỏa) tạo giá trị · Nền tảng (Thổ) tạo sự trường tồn.',
    boxLabel: 'Triết lý cốt lõi:',
    boxContent: 'Thuận Tự Nhiên Để Quản Trị Bền Vững & Chuẩn Hóa Xuất Sắc',
    footer: 'Đồng Bộ 5 Trụ Cột Vận Hành',
    theme: {
      cardBg:
        'bg-gradient-to-br from-purple-50/95 via-indigo-50/80 to-violet-50/60 dark:from-purple-950/50 dark:via-slate-900/85 dark:to-indigo-950/40',
      bgLight: 'linear-gradient(135deg, rgba(250, 245, 255, 0.94) 0%, rgba(243, 232, 255, 0.86) 55%, rgba(233, 213, 255, 0.72) 100%)',
      bgDark: 'linear-gradient(135deg, rgba(88, 28, 135, 0.48) 0%, rgba(15, 23, 42, 0.88) 100%)',
      subBgLight: 'rgba(255, 255, 255, 0.74)',
      subBgDark: 'rgba(147, 51, 234, 0.24)',
      borderColorLight: 'rgba(168, 85, 247, 0.45)',
      borderColorDark: 'rgba(192, 132, 252, 0.36)',
      watermarkColor: '#9333ea',
      border: 'border-purple-200/80 dark:border-purple-500/35 hover:border-purple-400 dark:hover:border-purple-400/70',
      hanziColor: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-white/90 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-700/50',
      iconColor: 'text-purple-600 dark:text-purple-300',
      labelColor: 'text-purple-600 dark:text-purple-400',
      bottomBar: 'bg-gradient-to-r from-sky-500 via-teal-500 to-purple-600',
    },
  },
];

const ACTION_PHILOSOPHY_CARDS = [
  {
    title: 'Tư Duy Bằng Chiến Lược',
    color: 'text-sky-600 dark:text-sky-400',
    desc: 'Xây dựng tầm nhìn dài hạn, định hình mô hình vận hành bền vững và dự báo chuẩn xác các xu thế chuyển dịch thị trường.',
  },
  {
    title: 'Dẫn Dắt Bằng Dữ Liệu',
    color: 'text-indigo-600 dark:text-indigo-400',
    desc: 'Mọi quyết định, cải tiến và tối ưu hóa quy trình đều dựa trên số liệu thực chứng minh bạch, khách quan và khoa học.',
  },
  {
    title: 'Thấu Cảm Bằng Trái Tim',
    color: 'text-rose-600 dark:text-rose-400',
    desc: 'Đặt trải nghiệm khách hàng và giá trị con người làm trọng tâm, lắng nghe đa chiều và thấu hiểu sâu sắc từng điểm chạm.',
  },
  {
    title: 'Lấy Chân Lý Làm Gốc',
    color: 'text-emerald-600 dark:text-emerald-400',
    desc: 'Mọi quyết sách đều dựa trên sự thật khách quan, dữ liệu minh bạch và giá trị đạo đức bền vững.',
  },
  {
    title: 'Lấy Hành Động Làm Đường',
    color: 'text-amber-600 dark:text-amber-400',
    desc: 'Không dừng lại ở lý thuyết suông; kiên trì thực thi, tối ưu từng quy trình và từng điểm chạm mỗi ngày.',
  },
  {
    title: 'Lấy Kết Quả Làm Thước Đo',
    color: 'text-purple-600 dark:text-purple-400',
    desc: 'Đo lường thành công bằng sự hài lòng của khách hàng (CSAT), hiệu quả chi phí (Cost-to-Serve) và sự trưởng thành của đội ngũ.',
  },
];

const ZODIAC_SAMPLE_YEAR_BY_KEY: Record<string, number> = {
  rat: 1984,
  ox: 1985,
  tiger: 1986,
  rabbit: 1987,
  dragon: 1988,
  snake: 1989,
  horse: 1990,
  goat: 1991,
  monkey: 1992,
  rooster: 1993,
  dog: 1994,
  pig: 1995,
};

export const HoroscopeView: React.FC<HoroscopeViewProps> = () => {
  const { showToast } = useToast();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  const shouldReduceMotion = useReducedMotion();

  const level2CardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-card, 14px)',
    padding: '15px',
    gap: '15px',
  };

  const level2InnerCardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-subcard, 14px)',
    padding: '12px',
  };

  // Active Card State: 0..5 (6 main cards arranged horizontally with 10px gap, centered like HomeView)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [carouselMetrics, setCarouselMetrics] = useState<{
    containerWidth: number;
    cardWidth: number;
    alignLeftOffset: number;
  }>(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const fallbackCardW = Math.min(1380, Math.max(260, Math.round(vw < 640 ? vw - 16 : Math.min(vw - 32, Math.max(1000, vw * 0.78)))));
    const resolvedCardW = Math.min(vw, fallbackCardW);
    return {
      containerWidth: vw,
      cardWidth: resolvedCardW,
      alignLeftOffset: Math.max(0, Math.round((vw - resolvedCardW) / 2)),
    };
  });
  const activeCardIndexRef = useRef<number>(0);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const horoscopeBannerVideo = getDefaultBannerVideoConfig('horoscope');
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const horoscopeContainerRef = useRef<HTMLDivElement>(null);
  const horoscopeCard1Ref = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const rafLayoutRef = useRef<number | null>(null);

  useEffect(() => {
    activeCardIndexRef.current = activeCardIndex;
  }, [activeCardIndex]);

  useEffect(() => {
    return () => {
      if (rafLayoutRef.current) window.cancelAnimationFrame(rafLayoutRef.current);
    };
  }, []);

  // Đo kích thước khung nhìn và đồng bộ chính xác mép trái + chiều rộng theo Header / Footer (#app-header / #app-footer)
  useEffect(() => {
    const container = horoscopeContainerRef.current;
    if (!container) return;

    const measureCarousel = () => {
      const containerRect = container.getBoundingClientRect();
      const docW = document.documentElement.clientWidth || window.innerWidth || 1000;
      const containerW = Math.max(260, Math.round(containerRect.width || docW));
      const anchorEl =
        document.getElementById('letter-main-card') ||
        document.getElementById('app-header') ||
        document.getElementById('app-footer');
      const anchorRect = anchorEl ? anchorEl.getBoundingClientRect() : null;
      const fallbackW = Math.max(260, Math.min(1000, docW - (docW < 640 ? 16 : 32)));
      const hasValidAnchor = Boolean(anchorRect && anchorRect.width > 240);
      const resolvedCardW = Math.max(
        260,
        Math.min(containerW, hasValidAnchor && anchorRect ? Math.round(anchorRect.width) : fallbackW)
      );
      const alignLeftOffset =
        hasValidAnchor && anchorRect
          ? Math.max(0, Math.round(anchorRect.left - containerRect.left))
          : Math.max(0, Math.round((containerW - resolvedCardW) / 2));

      setCarouselMetrics((prev) =>
        prev.containerWidth === containerW &&
        prev.cardWidth === resolvedCardW &&
        prev.alignLeftOffset === alignLeftOffset
          ? prev
          : { containerWidth: containerW, cardWidth: resolvedCardW, alignLeftOffset }
      );
    };

    measureCarousel();
    const rafId = window.requestAnimationFrame(measureCarousel);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measureCarousel);
      ro.observe(container);
      const viewportEl = document.getElementById('global-content-viewport');
      const headerEl = document.getElementById('app-header');
      const footerEl = document.getElementById('app-footer');
      if (viewportEl) ro.observe(viewportEl);
      if (headerEl) ro.observe(headerEl);
      if (footerEl) ro.observe(footerEl);
    }
    window.addEventListener('resize', measureCarousel, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measureCarousel);
    };
  }, []);

  const rightPeekSpacePx = Math.max(
    0,
    carouselMetrics.containerWidth - (carouselMetrics.alignLeftOffset + carouselMetrics.cardWidth)
  );
  const trackOffsetX =
    carouselMetrics.alignLeftOffset - activeCardIndex * (carouselMetrics.cardWidth + HOROSCOPE_CARD_GAP_PX);
  const canShowSidePeek =
    carouselMetrics.alignLeftOffset - HOROSCOPE_CARD_GAP_PX >= 24 &&
    rightPeekSpacePx - HOROSCOPE_CARD_GAP_PX >= 24;

  // Horoscope Main Card Style (Tách 6 card chính theo chiều ngang cách nhau 10px, cố định nằm ở center khi chuyển card)
  const horoscopeMainCardStyle: React.CSSProperties = useMemo(
    () => ({
      width: `${carouselMetrics.cardWidth}px`,
      minWidth: `${carouselMetrics.cardWidth}px`,
      maxWidth: `${carouselMetrics.cardWidth}px`,
      flex: '0 0 auto',
      height: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      margin: '0px',
      padding: 'var(--main-card-padding, 15px)',
      gap: '15px',
      borderRadius: 'var(--radius-global, var(--radius-main, 14px))',
      boxSizing: 'border-box',
    }),
    [carouselMetrics.cardWidth]
  );

  const scrollToHoroscopeCard = useCallback(
    (targetIdx: number, _smooth = true, _forcedDirection?: 1 | -1) => {
      const count = HOROSCOPE_SLIDES.length;
      const clamped = Math.max(0, Math.min(count - 1, targetIdx));
      activeCardIndexRef.current = clamped;
      setActiveCardIndex(clamped);

      if (rafLayoutRef.current) window.cancelAnimationFrame(rafLayoutRef.current);
      rafLayoutRef.current = window.requestAnimationFrame(() => {
        evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
      });
    },
    []
  );

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        if (dx < 0 && activeCardIndexRef.current < HOROSCOPE_SLIDES.length - 1) {
          SoundEngine.playTap();
          scrollToHoroscopeCard(activeCardIndexRef.current + 1, true, 1);
        } else if (dx > 0 && activeCardIndexRef.current > 0) {
          SoundEngine.playTap();
          scrollToHoroscopeCard(activeCardIndexRef.current - 1, true, -1);
        }
      }
    },
    [scrollToHoroscopeCard]
  );

  // Interactive 18-page TuViBookCard open/expand & MP3 playback state
  const [isTuViBookOpen, setIsTuViBookOpen] = useState<boolean>(false);
  const [isTuViMp3Playing, setIsTuViMp3Playing] = useState<boolean>(false);
  const [closeBookSignal, setCloseBookSignal] = useState<number>(0);
  const isTuViExpanded = isTuViBookOpen || isTuViMp3Playing;

  const row1HorizontalRef = useRef<HTMLDivElement>(null);
  const card6Ref = useRef<HTMLElement>(null);
  const profileCardRef = useRef<HTMLElement>(null);
  const [combinedExpandedHeight, setCombinedExpandedHeight] = useState<number>(0);
  const [profileMatchedHeight, setProfileMatchedHeight] = useState<number>(0);

  useEffect(() => {
    if (isTuViExpanded) return;
    const measureRow1 = () => {
      const c6 = card6Ref.current;
      const prof = profileCardRef.current;
      if (!prof) return;
      const profRect = prof.getBoundingClientRect();
      if (profRect.height <= 0) return;

      const exactProfH = Math.round(profRect.height);
      setProfileMatchedHeight((prev) => (Math.abs(prev - exactProfH) > 1 ? exactProfH : prev));

      if (!c6) return;
      const c6Rect = c6.getBoundingClientRect();
      const isSideBySide = Math.abs(c6Rect.top - profRect.top) < 16;
      const nextH = isSideBySide
        ? exactProfH
        : Math.round(exactProfH * 2 + 15);
      setCombinedExpandedHeight((prev) => (Math.abs(prev - nextH) > 2 ? nextH : prev));
    };

    measureRow1();
    const rafId = window.requestAnimationFrame(measureRow1);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measureRow1);
      if (profileCardRef.current) ro.observe(profileCardRef.current);
      if (row1HorizontalRef.current) ro.observe(row1HorizontalRef.current);
    }
    window.addEventListener('resize', measureRow1, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', measureRow1);
    };
  }, [isTuViExpanded]);

  // State for Card 5: Kiểm Tra Công Việc (12 Con Giáp Lookup)
  const [selectedZodiacKey, setSelectedZodiacKey] = useState<string>('monkey');
  const [searchYearInput, setSearchYearInput] = useState<string>('1992');
  const [activeLookupYear, setActiveLookupYear] = useState<number>(1992);

  useEffect(() => {
    if (activeCardIndex !== 0 && isTuViExpanded) {
      setIsTuViBookOpen(false);
      setIsTuViMp3Playing(false);
      setCloseBookSignal((prev) => prev + 1);
    }
  }, [activeCardIndex, isTuViExpanded]);

  // Sync active slide changes with parent App.tsx
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 10, slide: activeCardIndex },
      })
    );
  }, [activeCardIndex]);

  // Listen to external slide change events from App.tsx (e.g. footer navigation)
  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.tabIndex === undefined || detail.tabIndex === 10) && typeof detail.slide === 'number') {
        const target = Math.max(0, Math.min(HOROSCOPE_SLIDES.length - 1, detail.slide));
        scrollToHoroscopeCard(target, true);
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [scrollToHoroscopeCard]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  const handlePrevHoroscopeCard = useCallback(() => {
    if (activeCardIndexRef.current <= 0) return;
    SoundEngine.playTap();
    scrollToHoroscopeCard(activeCardIndexRef.current - 1, true, -1);
  }, [scrollToHoroscopeCard]);

  const handleNextHoroscopeCard = useCallback(() => {
    if (activeCardIndexRef.current >= HOROSCOPE_SLIDES.length - 1) return;
    SoundEngine.playTap();
    scrollToHoroscopeCard(activeCardIndexRef.current + 1, true, 1);
  }, [scrollToHoroscopeCard]);

  // Keyboard navigation Left/Right through 6 horizontal cards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevHoroscopeCard();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextHoroscopeCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterDropdownOpen, handlePrevHoroscopeCard, handleNextHoroscopeCard]);

  const handleYearSearch = () => {
    const val = searchYearInput.trim();
    if (!val) return;
    SoundEngine.playTap();
    const yearNum = parseInt(val, 10);
    if (!isNaN(yearNum) && yearNum >= 1900 && yearNum <= 2100) {
      const info = getCanChiInfo(yearNum);
      setActiveLookupYear(yearNum);
      setSelectedZodiacKey(info.sign.key);
      showToast(`Đã đối chiếu năm ${yearNum} (${info.canChi} · Tuổi ${info.sign.name})`);
    } else {
      showToast('Vui lòng nhập năm sinh hợp lệ (VD: 1992)');
    }
  };

  const handleSelectZodiac = (zodiacKey: string) => {
    SoundEngine.playTap();
    const sampleYear = ZODIAC_SAMPLE_YEAR_BY_KEY[zodiacKey] || 1992;
    setSelectedZodiacKey(zodiacKey);
    setActiveLookupYear(sampleYear);
    setSearchYearInput(String(sampleYear));
  };

  const currentCanChiResult = useMemo(() => {
    const derived = getCanChiInfo(activeLookupYear);
    const selectedSign = ZODIAC_SIGNS.find((s) => s.key === selectedZodiacKey) || derived.sign;
    const expectedKey = ZODIAC_ORDER[((activeLookupYear - 4) % 12 + 12) % 12];
    if (expectedKey === selectedSign.key) {
      return derived;
    }
    const fallbackYear = ZODIAC_SAMPLE_YEAR_BY_KEY[selectedSign.key] || 1992;
    return getCanChiInfo(fallbackYear);
  }, [activeLookupYear, selectedZodiacKey]);

  // =========================================================================
  // HERO BANNER TRANG TỬ VI
  // =========================================================================
  const renderHeroBanner = () => (
    <motion.section
      id="horoscope-hero-banner"
      data-element-name="Banner card"
      data-element-type="banner-card"
      data-element-page="horoscope"
      data-section-card="true"
      data-has-compact-menu="true"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="banner-card hero-banner group w-full max-w-full min-h-[140px] h-auto lg:h-[164px] lg:min-h-[164px] lg:max-h-[164px] mx-auto rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
      style={{
        padding: '15px',
        width: '100%',
        maxWidth: '100%',
        borderRadius: 'var(--radius-banner, 14px)',
      }}
    >
      {/* Lớp nền hình ảnh và gradient phủ */}
      <div
        id="horoscope-hero-banner-bg"
        className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
      >
        <VideoBanner
          videoId={horoscopeBannerVideo.videoId}
          title={horoscopeBannerVideo.title}
          className="rounded-[inherit]"
        />
      </div>
      <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

      {/* Vùng Tiêu Đề: Không có nội dung bên trái tiêu đề, không có sub tiêu đề */}
      <div
        id="horoscope-hero-banner-header"
        className="banner-header-row relative z-10 flex items-center justify-between gap-2 w-full min-w-0"
      >
        <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
          <WebIcon name="compass" className="w-5 h-5 shrink-0" />
          <h1
            id="horoscope-hero-banner-title"
            className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate m-0"
            data-card-title="true"
            style={{
              textTransform: 'none',
              fontStyle: 'normal',
              transform: 'none',
            }}
          >
            Bản đồ tử vi
          </h1>
        </div>

        <p
          id="horoscope-hero-banner-quote"
          className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
          style={{
            color: 'var(--text-secondary)',
            fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
            fontWeight: 600,
            fontStyle: 'normal',
          }}
        >
          &quot;Khai mở vận mệnh, kiến tạo lộ trình công danh bền vững ♡&quot;
        </p>

        <CompactBannerMenu
          id="horoscope-compact-menu-btn"
          label="Điều khiển"
          ariaLabel="Bộ lọc thẻ phân tích tử vi"
          activeCount={activeCardIndex > 0 ? 1 : 0}
        >
          {(closeMenu) => (
            <>
              <div className="flex flex-col gap-1">
                <span className="typo-label text-[var(--text-muted)] px-1">
                  Bộ lọc thẻ phân tích
                </span>
                {HOROSCOPE_SLIDES.map((slide) => {
                  const isCurrent = activeCardIndex === slide.idx;
                  return (
                    <button
                      key={slide.idx}
                      type="button"
                      data-selected={isCurrent ? 'true' : 'false'}
                      onClick={() => {
                        SoundEngine.playPop();
                        scrollToHoroscopeCard(slide.idx, true);
                        closeMenu();
                        showToast(
                          language === 'en'
                            ? `Switched to ${t(slide.label)}`
                            : `Đã chuyển sang ${slide.label}`
                        );
                      }}
                      className="theme-dropdown-option flex items-center justify-between w-full px-3 py-1.5 rounded-[14px] typo-nav font-play text-left transition-all cursor-pointer"
                    >
                      <span className="truncate">{slide.label}</span>
                      {isCurrent && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subcard)]">
                <span className="banner-control-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-badge font-play">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Giáp Tý 1984 · Hải Trung Kim
                </span>
                <span className="banner-control-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-badge font-play">
                  Đoài (Kim) · Kim Tứ Cục
                </span>
              </div>
            </>
          )}
        </CompactBannerMenu>
      </div>

      {/* Vùng Điều Khiển Dưới Banner: Bộ lọc danh mục chuyển thẻ + Badges */}
      <div
        id="horoscope-hero-banner-controls"
        className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto"
        ref={filterMenuRef}
      >
        <div className="flex flex-wrap items-center gap-2 max-w-full min-w-0">
          {/* Dropdown Menu chuyển thẻ phân tích Tử vi (Nút bộ lọc duy nhất) */}
          <div className="relative inline-block text-left max-w-full min-w-0">
            <button
              id="horoscope-filter-toggle-btn"
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterDropdownOpen((prev) => !prev);
              }}
              className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-play group max-w-full min-w-0"
              title="Bộ lọc tử vi"
              aria-label="Bộ lọc tử vi"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="listbox"
            >
              <WebIcon
                name="sliders"
                className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
              />
              <span className="shrink-0">Bộ lọc tử vi</span>
              <span className="banner-count-pill px-2 py-0.5 rounded-full typo-badge font-mono truncate max-w-[140px]">
                {HOROSCOPE_SLIDES[activeCardIndex]?.label || HOROSCOPE_SLIDES[0].label}
              </span>
              <WebIcon
                name="chevron-down"
                className={cn(
                  'w-3.5 h-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-200 shrink-0',
                  isFilterDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.div
                  id="horoscope-filter-listbox"
                  data-element-type="card"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  role="listbox"
                  className="banner-dropdown-menu dropdown-menu-enter absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full rounded-[14px] p-2 z-50 flex flex-col gap-1"
                >
                  <div className="px-2.5 py-1 typo-label text-[var(--text-muted)] tracking-wider border-b border-[var(--border-subcard)] mb-1">
                    Bộ lọc thẻ phân tích
                  </div>
                  {HOROSCOPE_SLIDES.map((slide) => {
                    const isCurrent = activeCardIndex === slide.idx;
                    return (
                      <button
                        key={slide.idx}
                        type="button"
                        data-selected={isCurrent ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playPop();
                          scrollToHoroscopeCard(slide.idx, true);
                          setIsFilterDropdownOpen(false);
                          showToast(
                            language === 'en'
                              ? `Switched to ${t(slide.label)}`
                              : `Đã chuyển sang ${slide.label}`
                          );
                        }}
                        className="theme-dropdown-option flex items-center justify-between w-full px-3 py-2 rounded-[14px] typo-nav font-play text-left transition-all cursor-pointer"
                      >
                        <span>{slide.label}</span>
                        {isCurrent && <WebIcon name="check" className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Badges thông tin bản mệnh */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-play">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Giáp Tý 1984 · Hải Trung Kim
            </span>
            <span className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-play">
              Đoài (Kim) · Kim Tứ Cục
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );

  // =========================================================================
  // CARD 6: 6. LUẬN GIẢI LÁ SỐ TỬ VI (XẾP THEO CHIỀU NGANG VỚI CARD 1)
  // =========================================================================
  const renderCard6LuanGiaiContent = () => (
    <>
      {isTuViExpanded && (
        <div className="absolute top-3 right-3 z-35 flex items-center justify-end w-full pointer-events-none px-3">
          <button
            id="horoscope-card-6-close-btn"
            type="button"
            onClick={() => {
              SoundEngine.playTap();
              setCloseBookSignal((prev) => prev + 1);
              setIsTuViBookOpen(false);
              setIsTuViMp3Playing(false);
            }}
            className="pointer-events-auto px-3.5 py-1.5 rounded-full typo-btn font-semibold bg-amber-500/85 text-slate-950 backdrop-blur-md shadow-lg border border-white/30 hover:bg-amber-400 transition-colors cursor-pointer shrink-0"
          >
            Đóng sách
          </button>
        </div>
      )}

      {/* Sách Luận giải lá số tử vi tương tác 18 trang kèm âm thanh */}
      <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center min-w-0 relative overflow-hidden">
        <TuViBookCard
          fitToHeight
          isActive={activeCardIndex === 0}
          onBookOpenChange={setIsTuViBookOpen}
          onMp3PlayingChange={setIsTuViMp3Playing}
          closeSignal={closeBookSignal}
        />
      </div>
    </>
  );

  // =========================================================================
  // CARD 1: 1. HỒ SƠ NGUYỄN HÙNG THÁI
  // =========================================================================
  const renderCard1HoSoTuViContent = () => (
    <>
      <div className="w-full flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] min-w-0 shrink-0">
        <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-purple-600 dark:text-purple-400">
          <WebIcon name="user-check" className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
          <h4
            className="card-title subcard-title-synced typo-h4 font-play font-bold text-purple-600 dark:text-purple-400 tracking-tight min-w-0 truncate m-0"
            data-subcard-title="true"
          >
            Hồ sơ Nguyễn Hùng Thái
          </h4>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(5, true);
          }}
          className="typo-badge px-2.5 py-0.5 rounded-full bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 transition-colors cursor-pointer shrink-0"
          title="Chuyển sang 5. Kiểm Tra Tương Hợp Công Việc"
        >
          5. Tương hợp →
        </button>
      </div>

      {/* Lưới 4 sub-card thông tin bản mệnh (chiều cao theo nội dung, cùng hàng bằng nhau) */}
      <div
        id="horoscope-profile-subgrid"
        data-card-layout={resolveAdaptiveCardLayout(4, false)}
        data-subcard-count={4}
        className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto items-stretch gap-[15px] p-0 w-full min-w-0 flex-none h-auto bg-transparent bg-none border-0 shadow-none box-border"
        style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
      >
        {/* Bento Tile 1: Ngày sinh dương lịch */}
        <div
          data-subcard="true"
          style={level2InnerCardStyle}
          className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] w-full h-full min-w-0 flex flex-col justify-between gap-1.5"
        >
          <h5 className="typo-label font-play font-semibold tracking-wide text-purple-600 dark:text-purple-400 whitespace-normal break-words m-0">
            Ngày sinh dương lịch
          </h5>
          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="typo-h4 font-play font-bold text-[var(--text-primary)] break-words">22/06/1984</div>
            <div className="typo-caption text-[var(--text-secondary)] break-words leading-snug">
              (17:00 • Giáp Tý • Canh Ngọ • Quý Dậu)
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Ngày sinh âm lịch */}
        <div
          data-subcard="true"
          style={level2InnerCardStyle}
          className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] w-full h-full min-w-0 flex flex-col justify-between gap-1.5"
        >
          <h5 className="typo-label font-play font-semibold tracking-wide text-purple-600 dark:text-purple-400 whitespace-normal break-words m-0">
            Ngày sinh âm lịch
          </h5>
          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="typo-h4 font-play font-bold text-[var(--text-primary)] break-words">24/05/1984</div>
            <div className="typo-caption text-[var(--text-secondary)] break-words leading-snug">
              (Năm Giáp Tý 1984)
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Giờ sinh can chi */}
        <div
          data-subcard="true"
          style={level2InnerCardStyle}
          className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] w-full h-full min-w-0 flex flex-col justify-between gap-1.5"
        >
          <h5 className="typo-label font-play font-semibold tracking-wide text-amber-600 dark:text-amber-400 whitespace-normal break-words m-0">
            Giờ sinh can chi
          </h5>
          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="typo-h4 font-play font-bold text-[var(--text-primary)] break-words">Giờ Quý Dậu (17h - 19h)</div>
            <div className="typo-caption text-[var(--text-secondary)] break-words leading-snug">
              (Thiên Can: Quý, Địa Chi: Dậu)
            </div>
          </div>
        </div>

        {/* Bento Tile 4: Năm sinh nạp âm */}
        <div
          data-subcard="true"
          style={level2InnerCardStyle}
          className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] w-full h-full min-w-0 flex flex-col justify-between gap-1.5"
        >
          <h5 className="typo-label font-play font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 whitespace-normal break-words m-0">
            Năm sinh nạp âm
          </h5>
          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="typo-h4 font-play font-bold text-emerald-700 dark:text-emerald-300 break-words">Hải Trung Kim</div>
            <div className="typo-caption text-[var(--text-secondary)] break-words leading-snug">
              (Vàng Ròng Đáy Biển Sâu)
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Quick Header Action helper for Horoscope Cards 2..6 to jump back to Card 1 or step Prev/Next between cards
  const renderCardHeaderQuickNav = (slideNumber: number) => {
    const currentIdx = slideNumber - 1;
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            SoundEngine.playTap();
            scrollToHoroscopeCard(0, true, -1);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-semibold border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
          title="Quay lại 1. Hồ sơ & Luận giải"
        >
          <span>← 1. Hồ sơ</span>
        </button>
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            disabled={currentIdx <= 0}
            onClick={() => {
              SoundEngine.playTap();
              scrollToHoroscopeCard(currentIdx - 1, true, -1);
            }}
            className="w-7 h-7 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-heading)] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
            title="Thẻ trước"
            aria-label="Thẻ trước"
          >
            <WebIcon name="chevron-left" className="w-3.5 h-3.5" />
          </button>
          <span className="typo-badge px-2 py-0.5 rounded-full font-mono tabular-nums border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)]">
            {slideNumber}/{HOROSCOPE_SLIDES.length}
          </span>
          <button
            type="button"
            disabled={currentIdx >= HOROSCOPE_SLIDES.length - 1}
            onClick={() => {
              SoundEngine.playTap();
              scrollToHoroscopeCard(currentIdx + 1, true, 1);
            }}
            className="w-7 h-7 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-heading)] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
            title="Thẻ tiếp theo"
            aria-label="Thẻ tiếp theo"
          >
            <WebIcon name="chevron-right" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // =========================================================================
  // CARD 2: 2. PHONG CÁCH QUẢN TRỊ (ĐỒNG BỘ BỐ CỤC CARD THƯ NGỎ)
  // =========================================================================
  const renderCard2PhongCachQuanTri = () => {
    const isActive = activeCardIndex === 1;
    const traitIcons = ['compass', 'shield-check', 'users', 'sparkles'];
    return (
      <section
        id="horoscope-card-2"
        data-element-name="Card tử vi 2"
        data-element-type="card"
        data-main-card="true"
        data-active-slide={isActive ? 'true' : 'false'}
        data-floating-surface="main"
        data-element-page="horoscope"
        data-element-parent="horoscope-cards-track"
        onClickCapture={(e) => {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(1, true);
          }
        }}
        style={horoscopeMainCardStyle}
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100',
          !isActive && 'cursor-pointer'
        )}
      >
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 min-w-0 flex-1">
            <WebIcon
              name="compass"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-blue-600 dark:text-cyan-400"
              style={{ width: '16px', height: '16px' }}
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-blue-600 dark:text-cyan-400 truncate m-0"
              data-card-title="true"
            >
              2. Phong Cách Quản Trị
            </h3>
          </div>
          {renderCardHeaderQuickNav(2)}
        </div>

        <div
          id="horoscope-card-2-grid"
          data-element-name="Lưới nội dung Tử vi main card 2"
          data-element-parent="horoscope-card-2"
          data-card-layout={resolveAdaptiveCardLayout(WORK_PERSONALITY_TRAITS.length, false)}
          data-subcard-count={WORK_PERSONALITY_TRAITS.length}
          className="w-full max-w-full min-w-0 min-h-0 flex-none h-auto grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-[15px] p-0 items-stretch bg-transparent bg-none border-0 shadow-none box-border"
          style={{
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
            padding: '0px',
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            width: '100%',
          }}
        >
          {WORK_PERSONALITY_TRAITS.map((trait, index) => {
            const palettes = [
              { text: 'text-sky-700 dark:text-sky-300' },
              { text: 'text-violet-700 dark:text-violet-300' },
              { text: 'text-emerald-700 dark:text-emerald-300' },
              { text: 'text-amber-700 dark:text-amber-300' },
            ];
            const p = palettes[index % 4];
            const iconName = traitIcons[index % traitIcons.length];
            return (
              <article
                key={trait.id}
                data-element-type="card"
                data-section-card="true"
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${p.text}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4
                        className={`card-title subcard-title-synced typo-h4 ${p.text} font-play font-bold tracking-tight break-words leading-snug m-0`}
                        data-subcard-title="true"
                      >
                        {trait.title}
                      </h4>
                    </div>
                  </div>
                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {trait.description}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[var(--border-subcard)] flex flex-wrap gap-1.5">
                  {trait.highlights.map((h, hIdx) => (
                    <span key={hIdx} className="project-detail-chip px-2.5 py-0.5 rounded-full typo-badge flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0 stroke-[2.5]" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // =========================================================================
  // CARD 3: 3. CHÂN DUNG CÔNG VIỆC (6 CUNG CỐT LÕI - ĐỒNG BỘ BỐ CỤC CARD THƯ NGỎ)
  // =========================================================================
  const renderCard3ChanDungVaTrietLy = () => {
    const isActive = activeCardIndex === 2;
    const palaceIcons = ['crown', 'briefcase', 'globe', 'coins', 'users', 'shield-check'];
    return (
      <section
        id="horoscope-card-3"
        data-element-name="Card tử vi 3"
        data-element-type="card"
        data-main-card="true"
        data-active-slide={isActive ? 'true' : 'false'}
        data-floating-surface="main"
        data-element-page="horoscope"
        data-element-parent="horoscope-cards-track"
        onClickCapture={(e) => {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(2, true);
          }
        }}
        style={horoscopeMainCardStyle}
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100',
          !isActive && 'cursor-pointer'
        )}
      >
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 min-w-0 flex-1">
            <WebIcon
              name="award"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-emerald-600 dark:text-emerald-400"
              style={{ width: '16px', height: '16px' }}
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-emerald-600 dark:text-emerald-400 truncate m-0"
              data-card-title="true"
            >
              3. Chân Dung Công Việc · 6 Cung Cốt Lõi
            </h3>
          </div>
          {renderCardHeaderQuickNav(3)}
        </div>

        <div
          id="horoscope-card-3-grid"
          data-element-name="Lưới nội dung Tử vi main card 3"
          data-element-parent="horoscope-card-3"
          data-card-layout={resolveAdaptiveCardLayout(SIX_CORE_PALACES.length, false)}
          data-subcard-count={SIX_CORE_PALACES.length}
          className="w-full max-w-full min-w-0 min-h-0 flex-none h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto items-stretch gap-[15px] p-0 bg-transparent bg-none border-0 shadow-none box-border"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none', width: '100%' }}
        >
          {SIX_CORE_PALACES.map((palace, index) => {
            const palettes = [
              'text-rose-700 dark:text-rose-300',
              'text-amber-700 dark:text-amber-300',
              'text-emerald-700 dark:text-emerald-300',
              'text-cyan-700 dark:text-cyan-300',
              'text-indigo-700 dark:text-indigo-300',
              'text-fuchsia-700 dark:text-fuchsia-300',
            ];
            const titleColor = palettes[index % 6];
            const iconName = palaceIcons[index % palaceIcons.length];
            return (
              <article
                key={palace.id}
                data-element-type="card"
                data-section-card="true"
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="w-full pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${titleColor}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4
                        className={`card-title subcard-title-synced typo-h4 ${titleColor} font-play font-bold tracking-tight break-words leading-snug m-0`}
                        data-subcard-title="true"
                      >
                        {palace.name}
                      </h4>
                    </div>
                  </div>
                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {palace.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {palace.stars.map((star, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-2 py-0.5 rounded-full typo-badge border ${
                          sIdx === 0
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                            : 'project-detail-chip'
                        }`}
                      >
                        ★ {star}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 pt-2.5 border-t border-[var(--border-subcard)]">
                  {palace.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 typo-body-sm font-medium text-[var(--text-primary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                      <span className="break-words leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // =========================================================================
  // MAIN CARD 4: 6 TRỤ CỘT TRIẾT LÝ LÃNH ĐẠO & HÀNH ĐỘNG (ĐỒNG BỘ BỐ CỤC CARD THƯ NGỎ)
  // =========================================================================
  const renderCardPillarsTrietLy = () => {
    const isActive = activeCardIndex === 3;
    const pillarIcons = ['compass', 'bar-chart-2', 'heart', 'shield-check', 'zap', 'trophy'];
    return (
      <section
        id="horoscope-card-pillars"
        data-element-name="Card chính 6 Trụ Cột Triết Lý Lãnh Đạo & Hành Động"
        data-element-type="card"
        data-main-card="true"
        data-active-slide={isActive ? 'true' : 'false'}
        data-floating-surface="main"
        data-element-page="horoscope"
        data-element-parent="horoscope-cards-track"
        onClickCapture={(e) => {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(3, true);
          }
        }}
        style={horoscopeMainCardStyle}
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100',
          !isActive && 'cursor-pointer'
        )}
      >
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 min-w-0 flex-1">
            <WebIcon
              name="sparkles"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-amber-600 dark:text-amber-400"
              style={{ width: '16px', height: '16px' }}
            />
            <h3
              className="card-title card-title-synced typo-h3 font-play font-bold tracking-tight text-amber-600 dark:text-amber-400 truncate m-0"
              data-card-title="true"
            >
              6 Trụ Cột Triết Lý Lãnh Đạo &amp; Hành Động
            </h3>
          </div>
          {renderCardHeaderQuickNav(4)}
        </div>

        <div
          id="horoscope-card-pillars-grid"
          data-element-name="Lưới nội dung Tử vi main card 4"
          data-element-parent="horoscope-card-pillars"
          data-card-layout={resolveAdaptiveCardLayout(ACTION_PHILOSOPHY_CARDS.length, false)}
          data-subcard-count={ACTION_PHILOSOPHY_CARDS.length}
          className="w-full max-w-full min-w-0 min-h-0 flex-none h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto items-stretch gap-[15px] p-0 bg-transparent bg-none border-0 shadow-none box-border"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none', width: '100%' }}
        >
          {ACTION_PHILOSOPHY_CARDS.map((card, idx) => {
            const iconName = pillarIcons[idx % pillarIcons.length];
            return (
              <article
                key={idx}
                data-element-type="card"
                data-section-card="true"
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)] flex items-center justify-between gap-2">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${card.color}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4
                        className={`card-title subcard-title-synced typo-h4 ${card.color} font-play font-bold tracking-tight break-words leading-snug m-0`}
                        data-subcard-title="true"
                      >
                        {card.title}
                      </h4>
                    </div>
                    <span className="typo-label font-mono tabular-nums font-bold text-[var(--text-muted)] shrink-0">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {card.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // =========================================================================
  // CARD 5: 4. KỸ NĂNG NGŨ HÀNH (ĐỒNG BỘ BỐ CỤC CARD THƯ NGỎ)
  // =========================================================================
  const renderCard4KyNangNguHanh = () => {
    const isActive = activeCardIndex === 4;
    const elementIcons = ['shield-check', 'cpu', 'users', 'heart', 'layers', 'network'];
    return (
      <section
        id="horoscope-card-4"
        data-element-name="Card tử vi 4"
        data-element-type="card"
        data-main-card="true"
        data-active-slide={isActive ? 'true' : 'false'}
        data-floating-surface="main"
        data-element-page="horoscope"
        data-element-parent="horoscope-cards-track"
        onClickCapture={(e) => {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(4, true);
          }
        }}
        style={horoscopeMainCardStyle}
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100',
          !isActive && 'cursor-pointer'
        )}
      >
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 min-w-0 flex-1">
            <WebIcon
              name="layers"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-cyan-600 dark:text-cyan-400"
              style={{ width: '16px', height: '16px' }}
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-cyan-600 dark:text-cyan-400 truncate m-0"
              data-card-title="true"
            >
              4. Kỹ Năng Ngũ Hành
            </h3>
          </div>
          {renderCardHeaderQuickNav(5)}
        </div>

        <div
          id="horoscope-card-4-grid"
          data-element-name="Lưới nội dung Tử vi main card 5"
          data-element-parent="horoscope-card-4"
          data-card-layout={resolveAdaptiveCardLayout(FIVE_ELEMENTS_GOVERNANCE.length, false)}
          data-subcard-count={FIVE_ELEMENTS_GOVERNANCE.length}
          className="five-elements-grid w-full max-w-full min-w-0 min-h-0 flex-none h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-[15px] p-0 items-stretch bg-transparent bg-none border-0 shadow-none box-border"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none', width: '100%' }}
        >
          {FIVE_ELEMENTS_GOVERNANCE.map((item, idx) => {
            const iconName = elementIcons[idx % elementIcons.length];
            const cardElementBg = isDark ? item.theme.bgDark : item.theme.bgLight;
            const subElementBg = isDark ? item.theme.subBgDark : item.theme.subBgLight;
            const borderElementColor = isDark ? item.theme.borderColorDark : item.theme.borderColorLight;
            return (
              <article
                key={idx}
                data-element-type="card"
                data-section-card="true"
                data-ngu-hanh-card="true"
                style={{
                  ...level2CardStyle,
                  background: cardElementBg,
                  borderColor: borderElementColor,
                }}
                className="bento-view-card bento-card glass-card ngu-hanh-element-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[var(--radius-card,14px)]"
              >
                {/* Icon chìm Ngũ Hành & Chữ Hán chìm góc dưới bên phải */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -bottom-3 -right-2 z-0 flex items-center justify-center opacity-[0.11] dark:opacity-[0.15]"
                  style={{ color: item.theme.watermarkColor }}
                >
                  <WebIcon name={item.watermarkIcon || iconName} className="w-24 h-24" />
                  <span className="absolute text-[54px] font-bold leading-none font-serif">
                    {item.hanzi}
                  </span>
                </div>

                <div className="relative z-10 w-full flex flex-col gap-2.5 min-w-0">
                  <div
                    className="pb-2.5 border-b flex flex-wrap items-center justify-between gap-1.5"
                    style={{ borderColor: borderElementColor }}
                  >
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${item.theme.iconColor}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4
                        className={`card-title subcard-title-synced typo-h4 ${item.theme.iconColor} tracking-tight font-play font-bold break-words leading-snug m-0`}
                        data-subcard-title="true"
                      >
                        {item.title}
                      </h4>
                    </div>
                    <span
                      className="typo-badge px-2 py-0.5 rounded-full border shrink-0 font-semibold"
                      style={{
                        background: subElementBg,
                        borderColor: borderElementColor,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.palaceBadge}
                    </span>
                  </div>
                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 w-full flex flex-col gap-2.5 pt-1 min-w-0">
                  <div
                    data-subcard="true"
                    style={{
                      ...level2InnerCardStyle,
                      background: subElementBg,
                      borderColor: borderElementColor,
                    }}
                    className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] space-y-1 border"
                  >
                    <div className={`typo-label font-play font-semibold ${item.theme.labelColor}`}>
                      {item.boxLabel}
                    </div>
                    <div className="card-body-text typo-body-sm font-semibold text-[var(--text-primary)] leading-snug">
                      {item.boxContent}
                    </div>
                  </div>

                  <div
                    className="space-y-1.5 pt-2 border-t"
                    style={{ borderColor: borderElementColor }}
                  >
                    <div className="typo-caption font-semibold text-[var(--text-secondary)]">
                      {item.footer}
                    </div>
                    <div className={`h-1 w-full rounded-full ${item.theme.bottomBar}`} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // =========================================================================
  // CARD 6: 5. KIỂM TRA TƯƠNG HỢP CÔNG VIỆC (12 Con Giáp & Tương Hợp 4 Phòng Ban)
  // =========================================================================
  const renderCard5KiemTraCongViec = () => {
    const isActive = activeCardIndex === 5;
    const signInfo = currentCanChiResult.sign;
    const toneBadgeClass =
      signInfo.tone === 'positive'
        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
        : signInfo.tone === 'caution'
          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
          : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';

    return (
      <section
        id="horoscope-card-5"
        data-element-name="Card tử vi 5"
        data-element-type="card"
        data-main-card="true"
        data-active-slide={isActive ? 'true' : 'false'}
        data-floating-surface="main"
        data-element-page="horoscope"
        data-element-parent="horoscope-cards-track"
        onClickCapture={(e) => {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(5, true);
          }
        }}
        style={horoscopeMainCardStyle}
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100',
          !isActive && 'cursor-pointer'
        )}
      >
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0">
          <div className="card-header-sync inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 min-w-0">
            <WebIcon
              name="handshake"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-purple-600 dark:text-purple-400"
              style={{ width: '16px', height: '16px' }}
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-purple-600 dark:text-purple-400 truncate m-0"
              data-card-title="true"
            >
              5. Kiểm Tra Tương Hợp Công Việc
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-full min-w-0">
            {renderCardHeaderQuickNav(6)}
          </div>
        </div>

        <div
          id="horoscope-card-5-grid"
          data-element-name="Lưới nội dung Tử vi main card 6"
          data-element-parent="horoscope-card-5"
          data-card-layout={resolveAdaptiveCardLayout(2, false)}
          data-subcard-count={2}
          className="w-full max-w-full min-w-0 min-h-0 flex-none h-auto grid grid-cols-1 lg:grid-cols-12 auto-rows-auto items-stretch content-start gap-[15px] p-0 bg-transparent bg-none border-0 shadow-none box-border"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none', width: '100%' }}
        >
          {/* TRA CỨU 12 CON GIÁP - CỘT TRÁI */}
              <article
                data-element-type="card"
                data-section-card="true"
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card h-full lg:col-span-6 flex flex-col justify-between p-[15px] gap-[15px] rounded-[14px] min-w-0 text-left"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-indigo-600 dark:text-indigo-300">
                      <WebIcon name="search" className="w-4 h-4 shrink-0" />
                      <h4
                        className="card-title subcard-title-synced typo-h4 font-play font-bold text-indigo-600 dark:text-indigo-300 tracking-tight break-words leading-snug m-0"
                        data-subcard-title="true"
                      >
                        Tra Cứu Tuổi Làm Việc Chung
                      </h4>
                    </div>
                  </div>

                  {/* Input Tra Cứu */}
                  <div className="relative flex items-center pt-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={searchYearInput}
                      onChange={(e) => setSearchYearInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleYearSearch();
                      }}
                      placeholder="Nhập năm sinh (VD: 1992)"
                      className="theme-input w-full pl-3.5 pr-28 py-2.5 rounded-[12px] typo-input font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    />
                    <button
                      id="horoscope-lookup-search-btn"
                      type="button"
                      onClick={handleYearSearch}
                      style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                      className="absolute right-1 px-4 py-1.5 rounded-[10px] typo-button font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Tra Cứu</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="typo-label font-play font-semibold text-[var(--text-secondary)]">
                      Hoặc chọn nhanh 12 Con Giáp:
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-[10px]">
                      {ZODIAC_SIGNS.map((z) => {
                        const isSel = signInfo.key === z.key;
                        return (
                          <button
                            key={z.key}
                            type="button"
                            aria-pressed={isSel}
                            onClick={() => handleSelectZodiac(z.key)}
                            style={{
                              borderRadius: 'var(--radius-subcard, 14px)',
                              ...(isSel
                                ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)', borderColor: 'transparent' }
                                : {
                                    background: 'var(--bg-subcard)',
                                    color: 'var(--text-primary)',
                                    borderColor: 'var(--border-subcard)',
                                  }),
                            }}
                            className={`p-2 border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSel ? 'shadow-md scale-[1.03]' : 'hover:opacity-90'
                            }`}
                          >
                            <span className="typo-h5 leading-none">{z.icon}</span>
                            <span className="typo-label font-bold">{z.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[var(--border-subcard)] typo-caption text-[var(--text-secondary)] text-center">
                  Nhập năm sinh bất kỳ hoặc chọn 1 trong 12 con giáp để đối chiếu Can Chi, Ngũ Hành và mức độ hòa hợp công việc với Giáp Tý 1984.
                </div>
              </article>

              {/* CỘT PHẢI: KẾT QUẢ ĐỐI CHIẾU */}
              <article
                data-element-type="card"
                data-section-card="true"
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card h-full lg:col-span-6 flex flex-col justify-between p-[15px] gap-[15px] rounded-[14px] min-w-0 text-left"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-purple-600 dark:text-purple-300">
                      <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
                      <h4
                        className="card-title subcard-title-synced typo-h4 font-play font-bold tracking-tight text-purple-600 dark:text-purple-300 break-words leading-snug m-0"
                        data-subcard-title="true"
                      >
                        Kết Quả Đối Chiếu Với Giáp Tý 1984
                      </h4>
                    </div>
                  </div>

                  {/* Thông tin Con Giáp Được Chọn */}
                  <div
                    data-subcard="true"
                    style={level2InnerCardStyle}
                    className="sub-card letter-subcard flex flex-col gap-2 rounded-[var(--radius-subcard,14px)]"
                  >
                    <h5 className="typo-h5 font-play font-bold text-[var(--text-heading)] break-words leading-snug m-0">
                      Tuổi {signInfo.name} ({activeLookupYear} • {currentCanChiResult.canChi} • Mệnh {currentCanChiResult.element})
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full typo-badge border ${toneBadgeClass}`}>
                        {signInfo.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full typo-badge bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
                        {currentCanChiResult.elementRelation}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full typo-badge bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                        Vai trò: {signInfo.role}
                      </span>
                    </div>
                  </div>

                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {signInfo.detail}
                  </p>

                  {/* Grid 2 Khối: Điểm mạnh & Điểm nghẽn (15px gap, equal height) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-[15px]">
                    <div
                      data-subcard="true"
                      style={level2InnerCardStyle}
                      className="sub-card letter-subcard h-full rounded-[var(--radius-subcard,14px)] space-y-1.5"
                    >
                      <h5 className="typo-h5 font-play font-bold text-emerald-600 dark:text-emerald-400 m-0">
                        Điểm mạnh kết hợp
                      </h5>
                      <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                        {signInfo.strength}
                      </p>
                    </div>

                    <div
                      data-subcard="true"
                      style={level2InnerCardStyle}
                      className="sub-card letter-subcard h-full rounded-[var(--radius-subcard,14px)] space-y-1.5"
                    >
                      <h5 className="typo-h5 font-play font-bold text-amber-600 dark:text-amber-400 m-0">
                        Điểm nghẽn chú ý
                      </h5>
                      <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                        {signInfo.caution}
                      </p>
                    </div>
                  </div>

                  {/* Gợi ý điều phối */}
                  <div
                    data-subcard="true"
                    style={level2InnerCardStyle}
                    className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] space-y-1.5"
                  >
                    <h5 className="typo-h5 font-play font-bold text-purple-600 dark:text-purple-400 m-0">
                      Gợi ý điều phối
                    </h5>
                    <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                      {signInfo.advice}
                    </p>
                  </div>
                </div>
              </article>
        </div>
      </section>
    );
  };

  // =========================================================================
  // CARD 1: 1. HỒ SƠ NGUYỄN HÙNG THÁI + BANNER + 6. LUẬN GIẢI LÁ SỐ TỬ VI
  // =========================================================================
  const renderCard1HoSoVaLuanGiaiMainCard = () => {
    const isActive = activeCardIndex === 0;
    return (
      <section
        id="horoscope-card-1"
        ref={horoscopeCard1Ref}
        data-element-name="Thẻ main chính tử vi 1"
        data-element-type="card"
        data-main-card="true"
        data-active-slide={isActive ? 'true' : 'false'}
        data-floating-surface="main"
        data-element-page="horoscope"
        data-element-parent="horoscope-cards-track"
        onClickCapture={(e) => {
          if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            SoundEngine.playTap();
            scrollToHoroscopeCard(0, true);
          }
        }}
        style={horoscopeMainCardStyle}
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border opacity-100',
          !isActive && 'cursor-pointer'
        )}
      >
        {/* Banner trang Tử Vi nằm trong Thẻ chính Tử Vi 1 */}
        {renderHeroBanner()}

        {/* BỐ CỤC BENTO 12 CỘT RESPONSIVE: 6. LUẬN GIẢI LÁ SỐ TỬ VI (5/12 hoặc 12/12 khi mở sách / phát MP3) & HỒ SƠ NGUYỄN HÙNG THÁI (7/12, ẩn khi mở sách / phát MP3) */}
        <div
          ref={row1HorizontalRef}
          id="horoscope-row-1-horizontal"
          data-card-layout={resolveAdaptiveCardLayout(isTuViExpanded ? 1 : 2, true)}
          data-subcard-count={isTuViExpanded ? 1 : 2}
          data-book-expanded={isTuViExpanded ? 'true' : 'false'}
          className="relative z-10 w-full max-w-full min-w-0 min-h-0 flex-none h-auto grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 auto-rows-auto gap-[15px] p-0 items-start bg-transparent box-border"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', width: '100%' }}
        >
          {/* Vị trí 1: Thẻ 6. Luận giải lá số tử vi (chiều cao luôn bằng #horoscope-card-profile khi thu gọn trên mọi kích thước màn hình) */}
          <article
            ref={card6Ref}
            id="horoscope-card-6"
            data-element-name="Card tử vi 6"
            data-element-type="card"
            data-section-card="true"
            data-element-page="horoscope"
            data-element-parent="horoscope-card-1"
            data-expanded={isTuViExpanded ? 'true' : 'false'}
            style={{
              ...level2CardStyle,
              ...(isTuViExpanded
                ? {
                    minHeight: `${Math.max(combinedExpandedHeight, 540)}px`,
                  }
                : profileMatchedHeight > 0
                  ? {
                      height: `${profileMatchedHeight}px`,
                      minHeight: `${profileMatchedHeight}px`,
                      maxHeight: `${profileMatchedHeight}px`,
                    }
                  : {}),
            }}
            className={cn(
              'bento-view-card bento-card glass-card w-full min-h-0 min-w-0 flex flex-col justify-between gap-[15px] p-[15px] rounded-[var(--radius-card,14px)] overflow-hidden box-border text-left transition-all duration-300',
              isTuViExpanded
                ? 'h-full md:col-span-12 lg:col-span-12'
                : 'md:col-span-6 lg:col-span-5'
            )}
          >
            {renderCard6LuanGiaiContent()}
          </article>

          {/* Vị trí 2: Thẻ Hồ sơ Nguyễn Hùng Thái (chiều cao bằng đúng nội dung bên trong thẻ) */}
          {!isTuViExpanded && (
            <article
              ref={profileCardRef}
              id="horoscope-card-profile"
              data-element-name="Thẻ Hồ sơ Nguyễn Hùng Thái"
              data-element-type="card"
              data-section-card="true"
              data-element-page="horoscope"
              data-element-parent="horoscope-card-1"
              style={{
                ...level2CardStyle,
                height: 'fit-content',
                minHeight: '0px',
                containerType: 'inline-size',
                containerName: 'horoscope-profile-card',
              }}
              className="md:col-span-6 lg:col-span-7 bento-view-card bento-card glass-card w-full h-auto self-start min-h-0 min-w-0 flex flex-col justify-start gap-[15px] p-[15px] rounded-[var(--radius-card,14px)] overflow-hidden box-border text-left"
            >
              {renderCard1HoSoTuViContent()}
            </article>
          )}
        </div>
      </section>
    );
  };

  return (
    <div
      id="horoscope-page-shell"
      className="relative w-full max-w-full min-w-0 h-full flex-1 flex flex-col items-center justify-start min-h-0 overflow-hidden bg-transparent"
    >
      <div
        ref={horoscopeContainerRef}
        id="horoscope-page-container"
        data-element-name="Trang Tử Vi & Phong Thủy"
        data-element-type="container"
        data-element-page="horoscope"
        data-element-parent="global-content-viewport"
        data-no-wheel-horizontal="true"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          maxHeight: '100%',
          minHeight: '0px',
          flex: '1 1 0%',
          marginLeft: '0px',
          marginRight: '0px',
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          border: 'none',
          borderRadius: '0px',
          background: 'transparent',
          overflow: 'hidden',
        }}
        className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 font-play text-left text-[var(--text-primary)] rounded-none overflow-hidden no-scrollbar z-10 select-none box-border"
      >
        <div
          id="horoscope-cards-track"
          data-element-name="Track Tử Vi Hàng Ngang"
          data-element-type="container"
          data-element-page="horoscope"
          data-element-parent="horoscope-page-container"
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
              gap: `${HOROSCOPE_CARD_GAP_PX}px`,
              width: 'max-content',
              height: '100%',
              '--horoscope-card-w': `${carouselMetrics.cardWidth}px`,
              '--horoscope-track-x': `${trackOffsetX}px`,
              transform: `translate3d(${trackOffsetX}px, 0, 0)`,
              transition: shouldReduceMotion
                ? 'none'
                : 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform',
              boxSizing: 'border-box',
            } as React.CSSProperties
          }
          className="page-cards-track flex flex-row flex-nowrap items-stretch gap-[10px] h-full box-border"
        >
          {renderCard1HoSoVaLuanGiaiMainCard()}
          {renderCard2PhongCachQuanTri()}
          {renderCard3ChanDungVaTrietLy()}
          {renderCardPillarsTrietLy()}
          {renderCard4KyNangNguHanh()}
          {renderCard5KiemTraCongViec()}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NÚT TRÒN ĐIỀU HƯỚNG TRÁI / PHẢI (CHỈ HIỆN KHI KHÔNG THẤY NHÔ MÉP TRÁI/PHẢI) */}
      {/* ========================================================================= */}
      {!canShowSidePeek && (
        <div
          aria-label="Điều hướng thẻ ngang Tử vi"
          className="pointer-events-none absolute inset-0 z-30"
          style={{ position: 'absolute', inset: 0 }}
        >
          {activeCardIndex > 0 && (
            <button
              type="button"
              id="horoscope-nav-left-btn"
              onClick={handlePrevHoroscopeCard}
              aria-label={language === 'en' ? 'Previous card' : 'Thẻ trước'}
              title={`${language === 'en' ? 'Previous card' : 'Thẻ trước'} (${activeCardIndex}/${HOROSCOPE_SLIDES.length})`}
              className="pointer-events-auto absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-[var(--bg-nav-arrow,var(--bg-card))] text-[var(--text-nav-arrow,var(--text-primary))] border border-[var(--border-nav-arrow,var(--border-subcard))] shadow-[var(--shadow-nav-arrow,0_6px_20px_rgba(15,23,42,0.22))] backdrop-blur-md flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <WebIcon name="chevron-left" className="w-5 h-5" />
            </button>
          )}
          {activeCardIndex < HOROSCOPE_SLIDES.length - 1 && (
            <button
              type="button"
              id="horoscope-nav-right-btn"
              onClick={handleNextHoroscopeCard}
              aria-label={language === 'en' ? 'Next card' : 'Thẻ tiếp theo'}
              title={`${language === 'en' ? 'Next card' : 'Thẻ tiếp theo'} (${activeCardIndex + 2}/${HOROSCOPE_SLIDES.length})`}
              className="pointer-events-auto absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full bg-[var(--bg-nav-arrow,var(--bg-card))] text-[var(--text-nav-arrow,var(--text-primary))] border border-[var(--border-nav-arrow,var(--border-subcard))] shadow-[var(--shadow-nav-arrow,0_6px_20px_rgba(15,23,42,0.22))] backdrop-blur-md flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <WebIcon name="chevron-right" className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};