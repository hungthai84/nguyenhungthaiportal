'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Sparkles = createAnimatedIcon('sparkles');
const Search = createAnimatedIcon('search');
const Check = createAnimatedIcon('check');
const CheckCircle2 = createAnimatedIcon('check-circle');
const Building2 = createAnimatedIcon('building-2');
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

export interface DepartmentSynergy {
  id: string;
  name: string;
  shortName: string;
  element: string;
  elementSymbol: string;
  matchScore: number;
  matchGrade: string;
  relationType: string;
  relationDesc: string;
  iconName: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  badgeBg: string;
  leadershipSynergy: string;
  pros: string;
  cons: string;
  strategy: string;
  kpis: string[];
}

export const DEPARTMENT_FENGSHUI_MATRIX: DepartmentSynergy[] = [
  {
    id: 'cskh',
    name: 'Chăm Sóc Khách Hàng & Trải Nghiệm (CSKH & CX)',
    shortName: 'CSKH & Trải Nghiệm CX',
    element: 'Hành Mộc & Thủy (Nuôi dưỡng & Thấu cảm)',
    elementSymbol: '木 / 水',
    matchScore: 92,
    matchGrade: 'Xuất Sắc · Hòa Hợp Tâm Thức',
    relationType: 'Thủy dưỡng tâm · Kim rèn chuẩn mực',
    relationDesc:
      'Sử dụng sự thấu cảm (Thủy) làm mềm lòng khách hàng và kỷ luật (Kim) uốn nắn chuẩn mực dịch vụ hoàn hảo.',
    iconName: 'headset',
    accentColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-300/80 dark:border-purple-600/40',
    bgGradient: 'from-purple-500/15 via-indigo-500/10 to-transparent',
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    leadershipSynergy:
      'Trọng tâm sự nghiệp 22+ năm của anh Thái. Lãnh đạo bằng sự lắng nghe đa chiều, thấu hiểu áp lực nhân viên tuyến đầu và trao quyền xử lý sự cố ngay tại điểm chạm đầu tiên (First Contact Resolution).',
    pros: 'Nhân viên gắn kết cao, tỷ lệ nghỉ việc thấp (Low Agent Turnover < 4%), dịch vụ đồng nhất đa kênh và chỉ số CSAT/NPS luôn duy trì trên 95%.',
    cons: 'Cần tránh việc nhân sự bị quá tải cảm xúc khi xử lý khách hàng khó tính kéo dài; cần phân bổ thời gian nghỉ ngơi hợp lý.',
    strategy:
      'Chuẩn hóa kịch bản đa kênh (Omnichannel SOP), tổ chức huấn luyện tâm lý tiếp xúc định kỳ và áp dụng cơ chế khen thưởng nóng cho các ca xử lý xuất sắc.',
    kpis: ['CSAT ≥ 96%', 'NPS ≥ 75', 'FCR ≥ 88%', 'Attrition < 4%'],
  },
  {
    id: 'tech',
    name: 'Kỹ Thuật & Công Nghệ (IT / System / AI)',
    shortName: 'Kỹ Thuật & Công Nghệ',
    element: 'Hành Thủy & Kim (Logic & Dữ liệu)',
    elementSymbol: '水 / 金',
    matchScore: 96,
    matchGrade: 'Tuyệt Đỉnh · Kim Sinh Thủy Hoàn Hảo',
    relationType: 'Kim sinh Thủy tương sinh đại cát',
    relationDesc:
      'Bản mệnh Kim sinh Thủy tạo dòng chảy công nghệ thông suốt. Anh Thái nói chung ngôn ngữ logic, định lượng và kiến trúc dữ liệu với khối Tech.',
    iconName: 'cpu',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-300/80 dark:border-cyan-600/40',
    bgGradient: 'from-cyan-500/15 via-blue-500/10 to-transparent',
    badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    leadershipSynergy:
      'Chuyển hóa xuất sắc các bài toán vận hành phức tạp thành Product Backlog và User Stories chi tiết, giúp đội ngũ Kỹ thuật xây dựng các giải pháp CRM, AI Bot và Omnichannel đúng trúng nhu cầu.',
    pros: 'Hệ thống Contact Center và Helpdesk vận hành mượt mà, tự động hóa cao, giảm thiểu lỗi kỹ thuật và bảo đảm thời gian hoạt động 99.9% uptime.',
    cons: 'Đòi hỏi dữ liệu đầu vào cực kỳ chuẩn mực; có thể phát sinh tranh luận kỹ thuật sâu nếu thiếu khung kiểm thử chấp nhận (UAT criteria) rõ ràng.',
    strategy:
      'Triển khai mô hình Agile Sprint 2 tuần; phân quyền tích hợp API linh hoạt và duy trì cơ chế đánh giá định kỳ giữa đội Tech và đội Vận hành dịch vụ.',
    kpis: ['Uptime 99.9%', 'API Latency < 120ms', 'Bug Resolution < 2h', 'Automation 40%+'],
  },
  {
    id: 'ops',
    name: 'Vận Hành & Đảm Bảo Chất Lượng (Operations / QA)',
    shortName: 'Vận Hành & QA Chuẩn Hóa',
    element: 'Hành Thổ & Kim (Vững chãi & Kỷ luật)',
    elementSymbol: '土 / 金',
    matchScore: 94,
    matchGrade: 'Mẫu Mực · Thổ Sinh Kim Bền Vững',
    relationType: 'Thổ dưỡng Kim vững như bàn thạch',
    relationDesc:
      'Nền tảng Thổ vững chắc bồi đắp cho kỷ luật Kim, tạo hệ thống vận hành có tính lặp lại cao, chuẩn COPC/ISO và kiểm soát rủi ro triệt để.',
    iconName: 'settings',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-300/80 dark:border-emerald-600/40',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    leadershipSynergy:
      'Phối hợp nhịp nhàng theo các chuẩn quản trị COPC, ISO và Six Sigma. Anh Thái truyền cảm hứng bằng nguyên tắc đo lường minh bạch, quản trị dựa trên dữ liệu thực chứng và triết lý Kaizen cải tiến liên tục.',
    pros: 'Hệ thống vận hành chính xác như đồng hồ Thụy Sĩ, định mức năng suất (AHT/CPH) được kiểm soát chặt chẽ, chi phí phục vụ (Cost-to-Serve) giảm thiểu đáng kể.',
    cons: 'Cần tránh rập khuôn máy móc theo quy trình giấy tờ khi xử lý các tình huống khiếu nại phát sinh ngoại lệ chưa từng có tiền lệ.',
    strategy:
      'Áp dụng bộ tiêu chí chấm điểm chất lượng cuộc gọi (QA Scorecard) đa chiều, khuyến khích sáng kiến tinh gọn quy trình từ nhân viên và số hóa 100% báo cáo.',
    kpis: ['QA Score ≥ 95%', 'SLA Compliance ≥ 98%', 'Cost-to-Serve -18%', 'FCR ≥ 88%'],
  },
  {
    id: 'sales',
    name: 'Kinh Doanh & Phát Triển (Sales & BizDev)',
    shortName: 'Kinh Doanh & Bán Hàng',
    element: 'Hành Hỏa & Kim (Nhiệt huyết & Mục tiêu)',
    elementSymbol: '火 / 金',
    matchScore: 88,
    matchGrade: 'Mạnh Mẽ · Hỏa Luyện Kim Thành Khí',
    relationType: 'Lửa thử vàng · Áp lực tạo kim cương',
    relationDesc:
      'Năng lượng Hỏa nhiệt huyết của khối Sales được định hướng bởi kỷ luật Kim, biến các mục tiêu doanh thu thách thức thành kết quả bền vững.',
    iconName: 'briefcase',
    accentColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-300/80 dark:border-amber-600/40',
    bgGradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    leadershipSynergy:
      'Anh Thái đóng vai trò là "hậu phương vững chắc" cho Sales: biến lời hứa bán hàng thành trải nghiệm dịch vụ thực tế xuất sắc, kích thích khách hàng mua lại và giới thiệu khách hàng mới.',
    pros: 'Nâng tỷ lệ giữ chân khách hàng (Customer Retention) lên mức kỷ lục, biến khách hàng thành đại sứ thương hiệu và giảm áp lực chi phí tìm khách mới (CAC).',
    cons: 'Cần tránh xung đột giữa tốc độ chốt hợp đồng nhanh của Sales và tiêu chuẩn thẩm định dịch vụ nghiêm ngặt của bộ phận vận hành.',
    strategy:
      'Tổ chức giao ban tuần định kỳ giữa Sales và CSKH, gắn KPI hoa hồng với tỷ lệ duy trì dịch vụ sau bán và chuẩn hóa cam kết SLA trước khi ký kết hợp đồng.',
    kpis: ['Retention Rate ≥ 92%', 'Repeat Order +25%', 'CAC Recovery < 3m', 'Promoters 70%+'],
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
    palaceBadge: 'Cung Quan Lộc',
    title: 'Kim • Quy Trình & Chuẩn Hóa',
    desc: 'Thiết lập khung chuẩn mực vận hành, đảm bảo kỷ luật và kiểm soát chất lượng bằng dữ liệu.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'SOP, KPI, SLA, Quality Assurance & Tuân Thủ',
    footer: 'Phong Cách: Kỷ Luật & Chính Trực',
    theme: {
      cardBg:
        'bg-gradient-to-br from-sky-50/95 via-blue-50/80 to-indigo-50/60 dark:from-sky-950/50 dark:via-slate-900/85 dark:to-blue-950/40',
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
    palaceBadge: 'Cung Thiên Di',
    title: 'Thủy • Công Nghệ & Tự Động',
    desc: 'Tận dụng CRM, AI và Omnichannel để tối ưu hóa quy trình, loại bỏ điểm nghẽn và nâng cao năng suất.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'CRM, AI Gen, Omnichannel, Data Analytics',
    footer: 'Phong Cách: Nhạy Bén Số & Tinh Gọn',
    theme: {
      cardBg:
        'bg-gradient-to-br from-cyan-50/95 via-teal-50/80 to-emerald-50/60 dark:from-cyan-950/50 dark:via-slate-900/85 dark:to-teal-950/40',
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
    palaceBadge: 'Cung Nô Bộc',
    title: 'Mộc • Con Người & Phát Triển',
    desc: 'Lãnh đạo bằng sự thấu cảm, huấn luyện đội ngũ kế thừa và xây dựng văn hóa gắn kết bền chặt.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'Training, Coaching 1-on-1, Talent Succession',
    footer: 'Phong Cách: Thấu Cảm & Phát Triển',
    theme: {
      cardBg:
        'bg-gradient-to-br from-emerald-50/95 via-green-50/80 to-lime-50/60 dark:from-emerald-950/50 dark:via-slate-900/85 dark:to-green-950/40',
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
    palaceBadge: 'Cung Mệnh',
    title: 'Hỏa • Trải Nghiệm Khách Hàng',
    desc: 'Lấy khách hàng làm trọng tâm, phản hồi nhanh chóng và chuyển hóa khiếu nại thành cơ hội gắn kết.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'CSAT, NPS, FCR, Customer Journey Mapping',
    footer: 'Phong Cách: Quyết Đoán & Tận Tâm',
    theme: {
      cardBg:
        'bg-gradient-to-br from-rose-50/95 via-pink-50/80 to-fuchsia-50/60 dark:from-rose-950/50 dark:via-slate-900/85 dark:to-pink-950/40',
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
    palaceBadge: 'Tài Bạch • Phúc Đức',
    title: 'Thổ • Tài Chính & Nền Tảng',
    desc: 'Tối ưu chi phí phục vụ (Cost-to-Serve), quản trị rủi ro và giữ vững tính liên tục của hệ thống.',
    boxLabel: 'Trọng tâm quản trị:',
    boxContent: 'Cost-to-Serve, BCP, Security & Risk Management',
    footer: 'Phong Cách: Điềm Tĩnh & Bền Vững',
    theme: {
      cardBg:
        'bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-yellow-50/60 dark:from-amber-950/50 dark:via-slate-900/85 dark:to-orange-950/40',
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
    palaceBadge: 'Ngũ Hành Toàn Diện',
    title: 'Mô Hình Điều Hành Tích Hợp',
    desc: 'Quy trình (Kim) tạo chuẩn mực · Công nghệ (Thủy) tạo hiệu suất · Con người (Mộc) tạo nội lực · Trải nghiệm (Hỏa) tạo giá trị · Nền tảng (Thổ) tạo sự trường tồn.',
    boxLabel: 'Triết lý cốt lõi:',
    boxContent: 'Thuận Tự Nhiên Để Quản Trị Bền Vững & Chuẩn Hóa Xuất Sắc',
    footer: 'Đồng Bộ 5 Trụ Cột Vận Hành',
    theme: {
      cardBg:
        'bg-gradient-to-br from-purple-50/95 via-indigo-50/80 to-violet-50/60 dark:from-purple-950/50 dark:via-slate-900/85 dark:to-indigo-950/40',
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

  const level2CardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-card, 14px)',
    padding: '15px',
    gap: '15px',
  };

  const level2InnerCardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-subcard, 14px)',
    padding: '12px',
  };

  const horoscopeBannerVideo = getDefaultBannerVideoConfig('horoscope');
  const horoscopeScrollViewportRef = useRef<HTMLDivElement>(null);

  // Interactive 18-page TuViBookCard open/expand & MP3 playback state
  const [isTuViBookOpen, setIsTuViBookOpen] = useState<boolean>(false);
  const [isTuViMp3Playing, setIsTuViMp3Playing] = useState<boolean>(false);
  const [closeBookSignal, setCloseBookSignal] = useState<number>(0);

  // State for Card 5: Kiểm Tra Công Việc (12 Con Giáp Lookup & 4 Phòng Ban)
  const [selectedZodiacKey, setSelectedZodiacKey] = useState<string>('monkey');
  const [searchYearInput, setSearchYearInput] = useState<string>('1992');
  const [activeLookupYear, setActiveLookupYear] = useState<number>(1992);
  const [synergyCheckTab, setSynergyCheckTab] = useState<'zodiac' | 'department'>('zodiac');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(DEPARTMENT_FENGSHUI_MATRIX[0].id);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 10, slide: 0 },
      })
    );
  }, []);

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

  const activeDepartment = useMemo(() => {
    return (
      DEPARTMENT_FENGSHUI_MATRIX.find((d) => d.id === selectedDepartmentId) ||
      DEPARTMENT_FENGSHUI_MATRIX[0]
    );
  }, [selectedDepartmentId]);

  // HERO BANNER
  const renderHeroBanner = () => (
    <motion.section
      id="horoscope-hero-banner"
      data-element-name="Banner card"
      data-element-type="banner-card"
      data-element-page="horoscope"
      data-section-card="true"
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
      </div>

      <div
        id="horoscope-hero-banner-controls"
        className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto"
      >
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-play">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Giáp Tý 1984 · Hải Trung Kim
          </span>
          <span className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-play">
            Đoài (Kim) · Kim Tứ Cục
          </span>
        </div>
      </div>
    </motion.section>
  );

  // CARD 6: LUẬN GIẢI LÁ SỐ
  const renderCard6LuanGiaiContent = () => (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] w-full text-left min-w-0 shrink-0">
        <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-purple-600 dark:text-purple-400">
          <WebIcon name="book-open" className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
          <h4
            className="card-title subcard-title-synced typo-h4 font-play font-bold text-purple-600 dark:text-purple-400 tracking-tight truncate m-0"
            data-subcard-title="true"
          >
            6. Luận giải lá số tử vi
          </h4>
        </div>

        {(isTuViBookOpen || isTuViMp3Playing) && (
          <button
            id="horoscope-card-6-close-btn"
            type="button"
            onClick={() => {
              SoundEngine.playTap();
              setCloseBookSignal((prev) => prev + 1);
              setIsTuViBookOpen(false);
              setIsTuViMp3Playing(false);
            }}
            className="px-3 py-1 rounded-full typo-btn font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/35 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
          >
            Đóng sách
          </button>
        )}
      </div>

      <div className="w-full flex-1 min-h-[320px] flex flex-col items-center justify-center min-w-0 relative overflow-hidden">
        <TuViBookCard
          fitToHeight
          isActive={true}
          onBookOpenChange={setIsTuViBookOpen}
          onMp3PlayingChange={setIsTuViMp3Playing}
          closeSignal={closeBookSignal}
        />
      </div>
    </div>
  );

  // CARD 1: HỒ SƠ NGUYỄN HÙNG THÁI
  const renderCard1HoSoTuViContent = () => (
    <div className="flex flex-col h-full gap-3">
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
      </div>

      <div
        id="horoscope-profile-subgrid"
        className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto items-stretch gap-[15px] w-full min-w-0 flex-none h-auto"
        style={{ gap: '15px', rowGap: '15px', columnGap: '15px' }}
      >
        <div
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

        <div
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

        <div
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

        <div
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
    </div>
  );

  // CARD 2: PHONG CÁCH QUẢN TRỊ
  const renderCard2PhongCachQuanTriContent = () => {
    const traitIcons = ['compass', 'shield-check', 'users', 'sparkles'];
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 min-w-0 flex-1">
            <WebIcon
              name="compass"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-blue-600 dark:text-cyan-400"
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-blue-600 dark:text-cyan-400 truncate m-0"
              data-card-title="true"
            >
              2. Phong Cách Quản Trị
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-[15px] p-0 items-stretch bg-transparent box-border">
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
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${p.text}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4 className={`card-title subcard-title-synced typo-h4 ${p.text} font-play font-bold tracking-tight break-words leading-snug m-0`}>
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
      </div>
    );
  };

  // CARD 3: CHÂN DUNG CÔNG VIỆC
  const renderCard3ChanDungVaTrietLyContent = () => {
    const palaceIcons = ['crown', 'briefcase', 'globe', 'coins', 'users', 'shield-check'];
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 min-w-0 flex-1">
            <WebIcon
              name="award"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-emerald-600 dark:text-emerald-400"
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-emerald-600 dark:text-emerald-400 truncate m-0"
              data-card-title="true"
            >
              3. Chân Dung Công Việc · 6 Cung Cốt Lõi
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto items-stretch gap-[15px] p-0 bg-transparent box-border">
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
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="w-full pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${titleColor}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4 className={`card-title subcard-title-synced typo-h4 ${titleColor} font-play font-bold tracking-tight break-words leading-snug m-0`}>
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
      </div>
    );
  };

  // CARD 4: 6 TRỤ CỘT TRIẾT LÝ
  const renderCardPillarsTrietLyContent = () => {
    const pillarIcons = ['compass', 'bar-chart-2', 'heart', 'shield-check', 'zap', 'trophy'];
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 min-w-0 flex-1">
            <WebIcon
              name="sparkles"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-amber-600 dark:text-amber-400"
            />
            <h3
              className="card-title card-title-synced typo-h3 font-play font-bold tracking-tight text-amber-600 dark:text-amber-400 truncate m-0"
              data-card-title="true"
            >
              6 Trụ Cột Triết Lý Lãnh Đạo &amp; Hành Động
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto items-stretch gap-[15px] p-0 bg-transparent box-border">
          {ACTION_PHILOSOPHY_CARDS.map((card, idx) => {
            const iconName = pillarIcons[idx % pillarIcons.length];
            return (
              <article
                key={idx}
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)] flex items-center justify-between gap-2">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${card.color}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4 className={`card-title subcard-title-synced typo-h4 ${card.color} font-play font-bold tracking-tight break-words leading-snug m-0`}>
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
      </div>
    );
  };

  // CARD 5: KỸ NĂNG NGŨ HÀNH
  const renderCard4KyNangNguHanhContent = () => {
    const elementIcons = ['shield-check', 'cpu', 'users', 'heart', 'layers', 'network'];
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0 min-w-0 max-w-full">
          <div className="card-header-sync inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 min-w-0 flex-1">
            <WebIcon
              name="layers"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-cyan-600 dark:text-cyan-400"
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-cyan-600 dark:text-cyan-400 truncate m-0"
              data-card-title="true"
            >
              4. Kỹ Năng Ngũ Hành
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-[15px] p-0 items-stretch bg-transparent box-border">
          {FIVE_ELEMENTS_GOVERNANCE.map((item, idx) => {
            const iconName = elementIcons[idx % elementIcons.length];
            return (
              <article
                key={idx}
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card flex flex-col justify-between p-[15px] gap-[15px] relative transition-colors duration-200 overflow-hidden w-full h-full min-h-0 min-w-0 text-left rounded-[14px]"
              >
                <div className="w-full flex flex-col gap-2.5 min-w-0">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)] flex flex-wrap items-center justify-between gap-1.5">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${item.theme.iconColor}`}>
                      <WebIcon name={iconName} className="w-4 h-4 shrink-0" />
                      <h4 className={`card-title subcard-title-synced typo-h4 ${item.theme.iconColor} tracking-tight font-play font-bold break-words leading-snug m-0`}>
                        {item.title}
                      </h4>
                    </div>
                    <span className="typo-badge px-2 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-secondary)] shrink-0">
                      {item.palaceBadge}
                    </span>
                  </div>
                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {item.desc}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-2.5 pt-1 min-w-0">
                  <div
                    style={level2InnerCardStyle}
                    className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] space-y-1"
                  >
                    <div className={`typo-label font-play font-semibold ${item.theme.labelColor}`}>
                      {item.boxLabel}
                    </div>
                    <div className="card-body-text typo-body-sm font-semibold text-[var(--text-primary)] leading-snug">
                      {item.boxContent}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[var(--border-subcard)]">
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
      </div>
    );
  };

  // CARD 5: KIỂM TRA TƯƠNG HỢP CÔNG VIỆC
  const renderCard5KiemTraCongViecContent = () => {
    const signInfo = currentCanChiResult.sign;
    const toneBadgeClass =
      signInfo.tone === 'positive'
        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
        : signInfo.tone === 'caution'
          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
          : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';

    return (
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] shrink-0">
          <div className="card-header-sync inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 min-w-0">
            <WebIcon
              name="handshake"
              size={16}
              className="w-[16px] h-[16px] shrink-0 card-title-icon text-purple-600 dark:text-purple-400"
            />
            <h3
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-purple-600 dark:text-purple-400 truncate m-0"
              data-card-title="true"
            >
              5. Kiểm Tra Tương Hợp Công Việc
            </h3>
          </div>

          <div
            role="tablist"
            aria-label="Chế độ kiểm tra tương hợp công việc"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border max-w-full min-w-0"
            style={{
              background: 'var(--bg-subcard)',
              borderColor: 'var(--border-subcard)',
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={synergyCheckTab === 'zodiac'}
              onClick={() => {
                SoundEngine.playTap();
                setSynergyCheckTab('zodiac');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer ${
                synergyCheckTab === 'zodiac' ? 'shadow-xs' : 'hover:opacity-90'
              }`}
              style={
                synergyCheckTab === 'zodiac'
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>Tra cứu 12 Con Giáp</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={synergyCheckTab === 'department'}
              onClick={() => {
                SoundEngine.playTap();
                setSynergyCheckTab('department');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer ${
                synergyCheckTab === 'department' ? 'shadow-xs' : 'hover:opacity-90'
              }`}
              style={
                synergyCheckTab === 'department'
                  ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Tương hợp 4 Phòng ban</span>
            </button>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 auto-rows-auto items-stretch content-start gap-[15px] p-0 bg-transparent box-border">
          {synergyCheckTab === 'zodiac' ? (
            <>
              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card h-full lg:col-span-6 flex flex-col justify-between p-[15px] gap-[15px] rounded-[14px] min-w-0 text-left"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-indigo-600 dark:text-indigo-300">
                      <WebIcon name="search" className="w-4 h-4 shrink-0" />
                      <h4 className="card-title subcard-title-synced typo-h4 font-play font-bold text-indigo-600 dark:text-indigo-300 tracking-tight break-words leading-snug m-0">
                        Tra Cứu Tuổi Làm Việc Chung
                      </h4>
                    </div>
                  </div>

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

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card h-full lg:col-span-6 flex flex-col justify-between p-[15px] gap-[15px] rounded-[14px] min-w-0 text-left"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-purple-600 dark:text-purple-300">
                      <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
                      <h4 className="card-title subcard-title-synced typo-h4 font-play font-bold tracking-tight text-purple-600 dark:text-purple-300 break-words leading-snug m-0">
                        Kết Quả Đối Chiếu Với Giáp Tý 1984
                      </h4>
                    </div>
                  </div>

                  <div
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-[15px]">
                    <div
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

                  <div
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
            </>
          ) : (
            <>
              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card h-full lg:col-span-5 flex flex-col justify-between p-[15px] gap-[15px] rounded-[14px] min-w-0 text-left"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="subcard-header-sync flex items-center gap-1.5 min-w-0 text-indigo-600 dark:text-indigo-300">
                      <WebIcon name="building-2" className="w-4 h-4 shrink-0" />
                      <h4 className="card-title subcard-title-synced typo-h4 font-play font-bold text-indigo-600 dark:text-indigo-300 tracking-tight break-words leading-snug m-0">
                        Chọn Khối Phòng Ban
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    {DEPARTMENT_FENGSHUI_MATRIX.map((dept) => {
                      const isSel = dept.id === activeDepartment.id;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          aria-pressed={isSel}
                          onClick={() => {
                            SoundEngine.playTap();
                            setSelectedDepartmentId(dept.id);
                          }}
                          style={{
                            borderRadius: 'var(--radius-subcard, 14px)',
                            background: isSel ? 'var(--bg-card)' : 'var(--bg-subcard)',
                            borderColor: isSel ? 'var(--color-primary)' : 'var(--border-subcard)',
                          }}
                          className={`w-full text-left p-3 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSel ? 'shadow-sm ring-1 ring-[var(--color-primary)]/40' : 'hover:opacity-95'
                          }`}
                        >
                          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                            <div className={`typo-body-sm font-bold break-words leading-snug ${dept.accentColor}`}>
                              {dept.shortName}
                            </div>
                            <div className="typo-caption text-[var(--text-secondary)] break-words leading-snug">
                              {dept.element}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`px-2.5 py-0.5 rounded-full typo-badge font-mono font-bold border shrink-0 ${dept.badgeBg}`}>
                              {dept.matchScore}%
                            </span>
                            <span className="typo-badge font-mono text-[var(--text-muted)]">
                              {dept.elementSymbol}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[var(--border-subcard)] typo-caption text-[var(--text-secondary)]">
                  Đối chiếu bản mệnh Hải Trung Kim (Giáp Tý 1984) với ngũ hành đặc thù của từng khối chức năng vận hành.
                </div>
              </article>

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card h-full lg:col-span-7 flex flex-col justify-between p-[15px] gap-[15px] rounded-[14px] min-w-0 text-left"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className={`subcard-header-sync flex items-center gap-1.5 min-w-0 ${activeDepartment.accentColor}`}>
                      <WebIcon name="network" className="w-4 h-4 shrink-0" />
                      <h4 className={`card-title subcard-title-synced typo-h4 font-play font-bold tracking-tight break-words leading-snug m-0 ${activeDepartment.accentColor}`}>
                        {activeDepartment.name}
                      </h4>
                    </div>
                  </div>

                  <div
                    style={level2InnerCardStyle}
                    className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`typo-label font-bold ${activeDepartment.accentColor}`}>
                        {activeDepartment.matchGrade} ({activeDepartment.matchScore}%)
                      </span>
                      <span className="typo-caption font-semibold text-[var(--text-secondary)]">
                        {activeDepartment.relationType}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--pillar-progress-track,rgba(148,163,184,0.28))]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${activeDepartment.matchScore}%`,
                          background: 'var(--bg-button-primary)',
                        }}
                      />
                    </div>
                    <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                      {activeDepartment.relationDesc}
                    </p>
                  </div>

                  <p className="card-body-text typo-body text-[var(--text-primary)] leading-relaxed text-left break-words m-0">
                    {activeDepartment.leadershipSynergy}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-[15px]">
                    <div
                      style={level2InnerCardStyle}
                      className="sub-card letter-subcard h-full rounded-[var(--radius-subcard,14px)] space-y-1.5"
                    >
                      <h5 className="typo-h5 font-play font-bold text-emerald-600 dark:text-emerald-400 m-0">
                        Ưu thế cộng hưởng
                      </h5>
                      <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                        {activeDepartment.pros}
                      </p>
                    </div>

                    <div
                      style={level2InnerCardStyle}
                      className="sub-card letter-subcard h-full rounded-[var(--radius-subcard,14px)] space-y-1.5"
                    >
                      <h5 className="typo-h5 font-play font-bold text-amber-600 dark:text-amber-400 m-0">
                        Điểm cần cân bằng
                      </h5>
                      <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                        {activeDepartment.cons}
                      </p>
                    </div>
                  </div>

                  <div
                    style={level2InnerCardStyle}
                    className="sub-card letter-subcard rounded-[var(--radius-subcard,14px)] space-y-2"
                  >
                    <h5 className="typo-h5 font-play font-bold text-purple-600 dark:text-purple-400 m-0">
                      Chiến lược phối hợp
                    </h5>
                    <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                      {activeDepartment.strategy}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeDepartment.kpis.map((kpi) => (
                        <span
                          key={kpi}
                          className={`px-2.5 py-0.5 rounded-full typo-badge font-semibold border ${activeDepartment.badgeBg}`}
                        >
                          {kpi}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="horoscope-page-shell"
      className="relative w-full max-w-full min-w-0 h-full flex-1 flex flex-col items-center justify-start min-h-0 overflow-hidden bg-transparent"
    >
      <div
        id="horoscope-page-container"
        className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-col items-center justify-start p-0 font-play text-left text-[var(--text-primary)] rounded-none overflow-hidden z-10 select-none box-border bg-transparent"
      >
        <div
          id="horoscope-cards-track"
          className="page-cards-track relative w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch overflow-hidden m-0 p-0 box-border"
        >
          <div
            id="horoscope-main-card"
            style={{
              padding: 'var(--main-card-padding, 15px)',
              borderRadius: 'var(--radius-global, var(--radius-primary-surface, var(--radius-main, 14px)))',
            }}
            className="group/horoscope page-main-card floating-glass-surface floating-surface--main relative z-10 w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col justify-start p-[14px] sm:p-[15px] overflow-hidden font-play text-left box-border opacity-100 transition-colors duration-200"
          >
            <div
              ref={horoscopeScrollViewportRef}
              id="horoscope-main-scroll-viewport"
              className="main-card-scroll-viewport block w-full max-w-full min-w-0 h-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y glass-scrollbar box-border pb-2 space-y-4"
            >
              {renderHeroBanner()}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <article
                  style={level2CardStyle}
                  className="bento-view-card bento-card glass-card lg:col-span-6 flex flex-col justify-between rounded-[14px] overflow-hidden box-border text-left"
                >
                  {renderCard6LuanGiaiContent()}
                </article>
                <article
                  style={level2CardStyle}
                  className="bento-view-card bento-card glass-card lg:col-span-6 flex flex-col justify-start rounded-[14px] overflow-hidden box-border text-left"
                >
                  {renderCard1HoSoTuViContent()}
                </article>
              </div>

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card rounded-[14px] overflow-hidden box-border text-left"
              >
                {renderCard2PhongCachQuanTriContent()}
              </article>

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card rounded-[14px] overflow-hidden box-border text-left"
              >
                {renderCard3ChanDungVaTrietLyContent()}
              </article>

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card rounded-[14px] overflow-hidden box-border text-left"
              >
                {renderCardPillarsTrietLyContent()}
              </article>

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card rounded-[14px] overflow-hidden box-border text-left"
              >
                {renderCard4KyNangNguHanhContent()}
              </article>

              <article
                style={level2CardStyle}
                className="bento-view-card bento-card glass-card rounded-[14px] overflow-hidden box-border text-left"
              >
                {renderCard5KiemTraCongViecContent()}
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
