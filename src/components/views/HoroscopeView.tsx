'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Sparkles = createAnimatedIcon('sparkles');
const Search = createAnimatedIcon('search');
const Check = createAnimatedIcon('check');
const CheckCircle2 = createAnimatedIcon('check-circle');
import {
  Sun,
  Moon,
  Award,
  Compass,
  Shield,
  Users,
  Heart,
  Zap,
  Layers,
  Clock,
  Calendar,
  Briefcase,
  DollarSign,
  Globe,
  Cpu,
  BarChart2,
  Feather,
  Copy,
  Star,
  Target,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
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

const HOROSCOPE_CARD_GAP_PX = 10;

// Danh sách chế độ hiệu ứng thẻ & rê chuột chuẩn Bento Studio (đã xóa hiệu ứng gương lóe sáng)
export const HOROSCOPE_CARD_EFFECT_MODES = [
  { id: 'spotlight-3d', label: 'Hiệu ứng: Ánh sáng 3D', labelEn: 'FX: 3D Spotlight' },
  { id: 'float-shadow', label: 'Hiệu ứng: Nổi Khối & Đổ Bóng', labelEn: 'FX: Float & Shadow' },
  { id: 'neon', label: 'Hiệu ứng: Viền Neon', labelEn: 'FX: Neon Border' },
  { id: 'minimal', label: 'Hiệu ứng: Tối Giản', labelEn: 'FX: Minimal' },
] as const;

export type HoroscopeFxModeId = (typeof HOROSCOPE_CARD_EFFECT_MODES)[number]['id'];

interface HoroscopeBentoCardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'article' | 'div';
  fxMode: HoroscopeFxModeId;
  cardRef?: React.Ref<HTMLElement>;
  disableTilt?: boolean;
  isDarkText?: boolean;
}

/**
 * Component thẻ HoroscopeBentoCard (chuẩn Bento Studio):
 * - Hiệu ứng Spotlight bám theo tọa độ con trỏ chuột (--mx, --my)
 * - Hiệu ứng nghiêng 3D (Spotlight 3D), Nổi Khối & Đổ Bóng, Viền Neon, Tối Giản
 * - Hiệu ứng gợn sóng (Ripple) khi nhấn chuột
 * - Hiệu ứng xuất hiện mượt khi vào khung nhìn (IntersectionObserver)
 * - Vi tương tác biểu tượng Lucide khi rê chuột
 * - Đã loại bỏ hoàn toàn hiệu ứng gương lóe sáng (glass sweep)
 */
const HoroscopeBentoCard: React.FC<HoroscopeBentoCardProps> = ({
  as: Tag = 'article',
  className = '',
  fxMode,
  cardRef,
  disableTilt = false,
  isDarkText = false,
  onClick,
  style,
  children,
  ...rest
}) => {
  const localRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof cardRef === 'function') {
        cardRef(node);
      } else if (cardRef && 'current' in cardRef) {
        (cardRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [cardRef]
  );

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if ((fxMode !== 'spotlight-3d' || disableTilt) && localRef.current) {
      localRef.current.style.setProperty('--rx', '0deg');
      localRef.current.style.setProperty('--ry', '0deg');
    }
  }, [fxMode, disableTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = localRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);

    if (disableTilt) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (fxMode === 'spotlight-3d' && !prefersReducedMotion && rect.width > 0 && rect.height > 0) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (((y - centerY) / centerY) * -4.2).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * 4.2).toFixed(2);
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
    }
  };

  const handleMouseLeave = () => {
    const card = localRef.current;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, button')) return;
    const card = localRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.35;
    const ripple = document.createElement('span');
    ripple.className = 'horoscope-card-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    card.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 680);
  };

  const ElementTag = Tag as React.ElementType;

  return (
    <ElementTag
      ref={setRefs}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      data-horoscope-bento="true"
      data-multicolor-bento="true"
      data-dark-text={isDarkText ? 'true' : 'false'}
      style={style}
      className={cn(
        'horoscope-bento-studio-card bento-studio-border card-reveal',
        isVisible && 'is-visible',
        isDarkText ? 'text-gray-950' : 'text-white',
        className
      )}
      {...rest}
    >
      {children}
    </ElementTag>
  );
};

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
    bentoStyle: {
      // Mẫu Thẻ 14 / Thẻ 59: Sky-Blue-Slate
      gradientCss: 'linear-gradient(135deg, #0284c7 0%, #1e40af 52%, #0f172a 100%)',
      accentText: '#7dd3fc',
      badgeBg: 'rgba(255, 255, 255, 0.15)',
      badgeText: '#e0f2fe',
      focusBoxBg: 'rgba(0, 0, 0, 0.28)',
      focusBoxBorder: 'rgba(125, 211, 252, 0.25)',
      bottomBar: 'linear-gradient(90deg, #38bdf8 0%, #3b82f6 50%, #6366f1 100%)',
      watermarkColor: '#7dd3fc',
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
    bentoStyle: {
      // Mẫu Thẻ 34 / Thẻ 71: Teal-Cyan-Blue
      gradientCss: 'linear-gradient(135deg, #0d9488 0%, #155e75 52%, #172554 100%)',
      accentText: '#67e8f9',
      badgeBg: 'rgba(255, 255, 255, 0.15)',
      badgeText: '#cffafe',
      focusBoxBg: 'rgba(0, 0, 0, 0.28)',
      focusBoxBorder: 'rgba(103, 232, 249, 0.25)',
      bottomBar: 'linear-gradient(90deg, #2dd4bf 0%, #06b6d4 50%, #10b981 100%)',
      watermarkColor: '#67e8f9',
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
    bentoStyle: {
      // Mẫu Thẻ 63 / Thẻ 57: Lime-Emerald-Teal
      gradientCss: 'linear-gradient(135deg, #059669 0%, #047857 52%, #052e16 100%)',
      accentText: '#a7f3d0',
      badgeBg: 'rgba(255, 255, 255, 0.15)',
      badgeText: '#d1fae5',
      focusBoxBg: 'rgba(0, 0, 0, 0.28)',
      focusBoxBorder: 'rgba(110, 231, 183, 0.25)',
      bottomBar: 'linear-gradient(90deg, #34d399 0%, #a3e635 50%, #fbbf24 100%)',
      watermarkColor: '#6ee7b7',
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
    bentoStyle: {
      // Mẫu Thẻ 32 / Thẻ 45: Rose-Orange-Red
      gradientCss: 'linear-gradient(135deg, #e11d48 0%, #c2410c 55%, #450a0a 100%)',
      accentText: '#fda4af',
      badgeBg: 'rgba(0, 0, 0, 0.28)',
      badgeText: '#fecdd3',
      focusBoxBg: 'rgba(0, 0, 0, 0.28)',
      focusBoxBorder: 'rgba(253, 164, 175, 0.25)',
      bottomBar: 'linear-gradient(90deg, #fb7185 0%, #f97316 50%, #ef4444 100%)',
      watermarkColor: '#fda4af',
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
    bentoStyle: {
      // Mẫu Thẻ 60 / Thẻ 65: Amber-Orange-Stone
      gradientCss: 'linear-gradient(135deg, #b45309 0%, #9a3412 52%, #1c1917 100%)',
      accentText: '#fde047',
      badgeBg: 'rgba(0, 0, 0, 0.28)',
      badgeText: '#fef08a',
      focusBoxBg: 'rgba(0, 0, 0, 0.28)',
      focusBoxBorder: 'rgba(253, 224, 71, 0.25)',
      bottomBar: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #eab308 100%)',
      watermarkColor: '#fde047',
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
    bentoStyle: {
      // Mẫu Thẻ 81 / Thẻ 1: Purple-Fuchsia-Indigo
      gradientCss: 'linear-gradient(135deg, #7e22ce 0%, #86198f 52%, #1e1b4b 100%)',
      accentText: '#fde047',
      badgeBg: 'rgba(255, 255, 255, 0.15)',
      badgeText: '#f5d0fe',
      focusBoxBg: 'rgba(0, 0, 0, 0.28)',
      focusBoxBorder: 'rgba(240, 171, 252, 0.28)',
      bottomBar: 'linear-gradient(90deg, #38bdf8 0%, #c084fc 50%, #f472b6 100%)',
      watermarkColor: '#e879f9',
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
  const shouldReduceMotion = useReducedMotion();

  // Trạng thái chế độ hiệu ứng Bento Studio (Ánh sáng 3D / Nổi khối / Viền Neon / Tối giản)
  const [fxIndex, setFxIndex] = useState<number>(0);
  const currentFx = HOROSCOPE_CARD_EFFECT_MODES[fxIndex];

  const cycleCardEffectMode = useCallback(() => {
    SoundEngine.playTap();
    setFxIndex((prev) => {
      const next = (prev + 1) % HOROSCOPE_CARD_EFFECT_MODES.length;
      showToast(`Đã bật ${HOROSCOPE_CARD_EFFECT_MODES[next].label}`);
      return next;
    });
  }, [showToast]);

  const copySnippet = useCallback(
    (text: string) => {
      SoundEngine.playTap();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast(`Đã sao chép: ${text}`);
    },
    [showToast]
  );

  // Active Card State: 0..5 (6 main cards arranged horizontally with 10px gap, centered like HomeView)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [carouselMetrics, setCarouselMetrics] = useState<{
    containerWidth: number;
    cardWidth: number;
    alignLeftOffset: number;
  }>(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const fallbackCardW = vw < 640 ? Math.max(260, vw - 16) : Math.min(1050, Math.max(260, vw - 32));
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
      const rawTargetW = getComputedStyle(document.documentElement)
        .getPropertyValue('--main-card-target-w')
        .trim();
      const parsedTargetW = Number.parseFloat(rawTargetW);
      const targetMaxW = Number.isFinite(parsedTargetW) && parsedTargetW > 300 ? parsedTargetW : 1050;
      const fallbackW =
        docW < 640
          ? Math.max(260, docW - 16)
          : Math.min(targetMaxW, Math.max(260, docW - 32));
      const anchorEl =
        document.getElementById('app-header') ||
        document.getElementById('app-footer');
      const anchorRect = anchorEl ? anchorEl.getBoundingClientRect() : null;
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
      minHeight: '0px',
      maxHeight: '100%',
      margin: '0px',
      padding: 'var(--main-card-padding, 20px)',
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

  useEffect(() => {
    if (isTuViExpanded) return;
    const measureRow1 = () => {
      const c6 = card6Ref.current;
      const prof = profileCardRef.current;
      if (!prof) return;
      const profRect = prof.getBoundingClientRect();
      if (profRect.height <= 0) return;

      const exactProfH = Math.round(profRect.height);

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

              <button
                type="button"
                onClick={() => {
                  cycleCardEffectMode();
                  closeMenu();
                }}
                className="banner-control-pill w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full typo-button font-play cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{currentFx.label}</span>
              </button>

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

      {/* Vùng Điều Khiển Dưới Banner: Bộ lọc danh mục chuyển thẻ + Chuyển hiệu ứng Bento Studio + Badges */}
      <div
        id="horoscope-hero-banner-controls"
        className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto"
        ref={filterMenuRef}
      >
        <div className="flex flex-wrap items-center gap-2 max-w-full min-w-0">
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

          {/* Nút chuyển đổi 4 chế độ hiệu ứng Bento Studio (Spotlight 3D / Nổi khối / Neon / Tối giản) */}
          <button
            id="horoscope-fx-mode-btn"
            type="button"
            onClick={cycleCardEffectMode}
            title="Đổi hiệu ứng thẻ & rê chuột"
            className="banner-control-pill h-9 inline-flex items-center gap-1.5 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{currentFx.label}</span>
          </button>
        </div>

        {/* Badges thông tin bản mệnh */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 flex-wrap">
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
  // CARD 1: 1. HỒ SƠ NGUYỄN HÙNG THÁI (ÁP DỤNG MẪU THẺ 12, THẺ 19, THẺ 58, THẺ 23/45, THẺ 16/57)
  // =========================================================================
  const renderCard1HoSoTuViContent = () => (
    <>
      <div className="w-full flex items-center justify-between gap-2 pb-2.5 border-b border-white/15 min-w-0 shrink-0">
        <div className="subcard-header-sync flex items-center gap-2 min-w-0 text-purple-300">
          <Users className="lucide shrink-0 w-4 h-4 text-purple-300" />
          <h4
            className="card-title subcard-title-synced typo-h4 font-play font-bold text-white tracking-tight min-w-0 truncate m-0"
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
          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
          title="Chuyển sang 5. Kiểm Tra Tương Hợp Công Việc"
        >
          5. Tương hợp →
        </button>
      </div>

      {/* Lưới 4 sub-card thông tin bản mệnh chuẩn màu sắc & bố cục Bento Studio */}
      <div
        id="horoscope-profile-subgrid"
        data-card-layout={resolveAdaptiveCardLayout(4, false)}
        data-subcard-count={4}
        className="grid grid-cols-1 grid-rows-4 items-stretch gap-[10px] p-0 w-full flex-1 h-full min-h-0 min-w-0 bg-transparent border-0 shadow-none outline-none box-border"
      >
        {/* Tile 1: Ngày sinh dương lịch -> Mẫu Thẻ 19 (Thời Tiết / Dương Lịch Studio) & Thẻ 1 (Purple-Indigo) */}
        <HoroscopeBentoCard
          as="div"
          fxMode={currentFx.id}
          onClick={() => copySnippet('22/06/1984 (17:00 • Giáp Tý • Canh Ngọ • Quý Dậu)')}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 48%, #312e81 100%)',
            padding: '12px',
          }}
          className="w-full h-full min-h-0 min-w-0 flex flex-col justify-between gap-1 cursor-pointer"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sun className="lucide shrink-0 w-4 h-4 text-yellow-300" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-100 truncate m-0">
                Ngày sinh dương lịch
              </h5>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-yellow-200 border border-white/15 shrink-0">
              Dương
            </span>
          </div>
          <div className="relative z-10 min-w-0 flex flex-col gap-0.5">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              22/06/1984
            </div>
            <div className="text-[11px] text-purple-200 leading-snug truncate">
              (17:00 • Giáp Tý • Canh Ngọ • Quý Dậu)
            </div>
          </div>
        </HoroscopeBentoCard>

        {/* Tile 2: Ngày sinh âm lịch -> Mẫu Thẻ 58 (Lịch Âm & Ngày Hoàng Đạo: Red-800 via Rose-900 to Amber-950) */}
        <HoroscopeBentoCard
          as="div"
          fxMode={currentFx.id}
          onClick={() => copySnippet('24/05/1984 (Năm Giáp Tý 1984)')}
          style={{
            background: 'linear-gradient(135deg, #991b1b 0%, #881337 52%, #451a03 100%)',
            padding: '12px',
          }}
          className="w-full h-full min-h-0 min-w-0 flex flex-col justify-between gap-1 cursor-pointer"
        >
          <div className="relative z-10 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Moon className="lucide shrink-0 w-4 h-4 text-amber-300" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300 truncate m-0">
                Ngày sinh âm lịch
              </h5>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/25 shrink-0">
              Âm
            </span>
          </div>
          <div className="relative z-10 min-w-0 flex flex-col gap-0.5">
            <div className="text-xl sm:text-2xl font-bold text-amber-300 tracking-tight leading-tight">
              24/05/1984
            </div>
            <div className="text-[11px] text-rose-200 leading-snug truncate">
              (Năm Giáp Tý 1984)
            </div>
          </div>
        </HoroscopeBentoCard>

        {/* Tile 3: Giờ sinh can chi -> Mẫu Thẻ 45 / Thẻ 23 (Amber-500 via Orange-600 to Red-800) */}
        <HoroscopeBentoCard
          as="div"
          fxMode={currentFx.id}
          onClick={() => copySnippet('Giờ Quý Dậu (17h - 19h) • Thiên Can: Quý, Địa Chi: Dậu')}
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #ea580c 48%, #991b1b 100%)',
            padding: '12px',
          }}
          className="w-full h-full min-h-0 min-w-0 flex flex-col justify-between gap-1 cursor-pointer"
        >
          <div className="relative z-10 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Clock className="lucide shrink-0 w-4 h-4 text-amber-200" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-100 truncate m-0">
                Giờ sinh can chi
              </h5>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 text-amber-200 border border-white/15 shrink-0">
              Hoàng Đạo
            </span>
          </div>
          <div className="relative z-10 min-w-0 flex flex-col gap-0.5">
            <div className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight truncate">
              Giờ Quý Dậu (17h - 19h)
            </div>
            <div className="text-[11px] text-orange-100 leading-snug truncate">
              (Thiên Can: Quý, Địa Chi: Dậu)
            </div>
          </div>
        </HoroscopeBentoCard>

        {/* Tile 4: Năm sinh nạp âm -> Mẫu Thẻ 16 / Thẻ 57 (Emerald-700 via Teal-800 to Green-950) */}
        <HoroscopeBentoCard
          as="div"
          fxMode={currentFx.id}
          onClick={() => copySnippet('Hải Trung Kim (Vàng Ròng Đáy Biển Sâu)')}
          style={{
            background: 'linear-gradient(135deg, #047857 0%, #115e59 52%, #052e16 100%)',
            padding: '12px',
          }}
          className="w-full h-full min-h-0 min-w-0 flex flex-col justify-between gap-1 cursor-pointer"
        >
          <div className="relative z-10 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Shield className="lucide shrink-0 w-4 h-4 text-emerald-300" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-200 truncate m-0">
                Năm sinh nạp âm
              </h5>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 shrink-0">
              Mệnh Kim
            </span>
          </div>
          <div className="relative z-10 min-w-0 flex flex-col gap-0.5">
            <div className="text-lg sm:text-xl font-bold text-emerald-200 tracking-tight leading-tight">
              Hải Trung Kim
            </div>
            <div className="text-[11px] text-emerald-100/85 leading-snug truncate">
              (Vàng Ròng Đáy Biển Sâu)
            </div>
          </div>
        </HoroscopeBentoCard>
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
  // CARD 2: 2. PHONG CÁCH QUẢN TRỊ (ÁP DỤNG MẪU THẺ 1, THẺ 14, THẺ 25, THẺ 6)
  // =========================================================================
  const renderCard2PhongCachQuanTri = () => {
    const isActive = activeCardIndex === 1;
    const traitTemplates = [
      {
        // Mẫu Thẻ 1 (Purple-600 via Purple-700 to Indigo-900)
        bg: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 48%, #312e81 100%)',
        orbClass: 'bg-white/10 -right-12 -top-12 w-48 h-48',
        icon: <Compass className="lucide shrink-0 w-5 h-5 text-purple-200" />,
        titleClass: 'text-white',
        descClass: 'text-purple-100/95',
        subBadgeClass: 'bg-white/15 text-purple-100 border-white/20',
        tagBadgeClass: 'bg-purple-950/60 text-amber-300 border-purple-400/35',
        chipClass: 'bg-purple-950/55 hover:bg-purple-900/75 text-white border border-purple-400/30',
        checkColor: 'text-amber-300',
      },
      {
        // Mẫu Thẻ 14 (Cyan-600 to Blue-900)
        bg: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 52%, #1e3a8a 100%)',
        orbClass: 'bg-cyan-300/15 -right-10 -bottom-10 w-44 h-44',
        icon: <Shield className="lucide shrink-0 w-5 h-5 text-cyan-200" />,
        titleClass: 'text-white',
        descClass: 'text-cyan-100/95',
        subBadgeClass: 'bg-white/15 text-cyan-100 border-white/20',
        tagBadgeClass: 'bg-black/30 text-cyan-200 border-cyan-400/30',
        chipClass: 'bg-white/15 hover:bg-white/25 text-white border border-white/15',
        checkColor: 'text-cyan-200',
      },
      {
        // Mẫu Thẻ 25 / Thẻ 16 (Slate-800 via Teal-900 to Emerald-950)
        bg: 'linear-gradient(135deg, #065f46 0%, #134e4a 50%, #0f172a 100%)',
        orbClass: 'bg-emerald-400/15 -right-10 -top-10 w-44 h-44',
        icon: <Target className="lucide shrink-0 w-5 h-5 text-emerald-300" />,
        titleClass: 'text-white',
        descClass: 'text-emerald-100/90',
        subBadgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
        tagBadgeClass: 'bg-black/30 text-emerald-300 border-emerald-500/30',
        chipClass: 'bg-black/30 hover:bg-black/45 text-emerald-100 border border-emerald-400/25',
        checkColor: 'text-emerald-400',
      },
      {
        // Mẫu Thẻ 6 (Pink-600 to Purple-800 với chữ Gradient vàng-hồng)
        bg: 'linear-gradient(135deg, #db2777 0%, #9d174d 48%, #581c87 100%)',
        orbClass: 'bg-yellow-300/25 -top-8 -right-8 w-40 h-40',
        icon: <Users className="lucide shrink-0 w-5 h-5 text-yellow-300" />,
        titleClass: 'gradient-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-pink-200',
        descClass: 'text-pink-100/95',
        subBadgeClass: 'bg-white/15 text-pink-100 border-white/20',
        tagBadgeClass: 'bg-black/30 text-yellow-200 border-yellow-300/30',
        chipClass: 'bg-black/25 hover:bg-black/40 text-yellow-100 border border-yellow-300/25',
        checkColor: 'text-yellow-300',
      },
    ];

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
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border transition-opacity duration-200',
          isActive ? 'opacity-100' : 'cursor-pointer opacity-45 hover:opacity-80'
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
          className="w-full max-w-full min-w-0 flex-1 min-h-0 h-full grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-[15px] p-0 items-stretch bg-transparent border-0 shadow-none outline-none box-border"
        >
          {WORK_PERSONALITY_TRAITS.map((trait, index) => {
            const tpl = traitTemplates[index % traitTemplates.length];
            return (
              <HoroscopeBentoCard
                key={trait.id}
                fxMode={currentFx.id}
                onClick={() => showToast(`${trait.title} • ${trait.subtitle}`)}
                style={{
                  background: tpl.bg,
                  padding: '16px',
                }}
                className="flex flex-col justify-between gap-3 w-full h-full min-h-0 min-w-0 text-left cursor-pointer"
              >
                <div className={cn('absolute rounded-full blur-3xl pointer-events-none', tpl.orbClass)} />

                <div className="relative z-10 w-full flex flex-col gap-2.5 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className={cn('text-[11px] font-bold px-2.5 py-0.5 rounded-full border', tpl.subBadgeClass)}>
                      {trait.subtitle}
                    </span>
                    <span className={cn('text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', tpl.tagBadgeClass)}>
                      {trait.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/15 min-w-0">
                    {tpl.icon}
                    <h4
                      className={cn(
                        'text-lg sm:text-xl font-bold font-play tracking-tight break-words leading-snug m-0',
                        tpl.titleClass
                      )}
                      data-subcard-title="true"
                    >
                      {trait.title}
                    </h4>
                  </div>

                  <p className={cn('text-xs sm:text-sm leading-relaxed text-left break-words m-0', tpl.descClass)}>
                    {trait.description}
                  </p>
                </div>

                <div className="relative z-10 pt-2.5 border-t border-white/15 flex flex-wrap gap-1.5">
                  {trait.highlights.map((h, hIdx) => (
                    <span
                      key={hIdx}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors',
                        tpl.chipClass
                      )}
                    >
                      <CheckCircle className={cn('w-3.5 h-3.5 shrink-0', tpl.checkColor)} />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </HoroscopeBentoCard>
            );
          })}
        </div>
      </section>
    );
  };

  // =========================================================================
  // CARD 3: 3. CHÂN DUNG CÔNG VIỆC · 6 CUNG CỐT LÕI (ÁP DỤNG MẪU THẺ 8, 3, 29, 14, 26, 10)
  // =========================================================================
  const renderCard3ChanDungVaTrietLy = () => {
    const isActive = activeCardIndex === 2;
    const palaceTemplates = [
      {
        // Mẫu Thẻ 8 (Thành Tựu: Blue-600 via Blue-700 to Indigo-900 + Gradient Title)
        bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #312e81 100%)',
        icon: <Award className="lucide shrink-0 w-5 h-5 text-yellow-300" />,
        titleClass: 'gradient-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-pink-200',
        tagClass: 'bg-white/15 text-yellow-200 border-white/20',
        descClass: 'text-blue-100/95',
        starPrimaryClass: 'bg-yellow-400/25 text-yellow-200 border-yellow-300/40',
        starSecondaryClass: 'bg-white/15 text-white border-white/15',
        bulletIconColor: 'text-yellow-300',
      },
      {
        // Mẫu Thẻ 3 (Quy Trình AI: Emerald-600 to Teal-900)
        bg: 'linear-gradient(135deg, #059669 0%, #0f766e 52%, #134e4a 100%)',
        icon: <Briefcase className="lucide shrink-0 w-5 h-5 text-emerald-200" />,
        titleClass: 'text-white',
        tagClass: 'bg-black/35 text-emerald-300 border-emerald-400/30',
        descClass: 'text-emerald-100/95',
        starPrimaryClass: 'bg-emerald-400/25 text-emerald-200 border-emerald-300/40',
        starSecondaryClass: 'bg-black/25 text-emerald-100 border-white/15',
        bulletIconColor: 'text-emerald-300',
      },
      {
        // Mẫu Thẻ 29 / Thẻ 60 (Studio Platinum / Amber-700 via Orange-800 to Stone-900)
        bg: 'linear-gradient(135deg, #b45309 0%, #9a3412 52%, #1c1917 100%)',
        icon: <DollarSign className="lucide shrink-0 w-5 h-5 text-amber-300" />,
        titleClass: 'text-amber-200',
        tagClass: 'bg-black/35 text-amber-300 border-amber-400/30',
        descClass: 'text-amber-100/90',
        starPrimaryClass: 'bg-amber-400/25 text-amber-200 border-amber-300/40',
        starSecondaryClass: 'bg-black/25 text-amber-100 border-white/15',
        bulletIconColor: 'text-amber-300',
      },
      {
        // Mẫu Thẻ 14 / Thẻ 40 (Mạng Lưới Edge: Sky-600 via Blue-700 to Indigo-900)
        bg: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 52%, #1e1b4b 100%)',
        icon: <Globe className="lucide shrink-0 w-5 h-5 text-cyan-200" />,
        titleClass: 'text-white',
        tagClass: 'bg-white/15 text-sky-200 border-white/20',
        descClass: 'text-sky-100/95',
        starPrimaryClass: 'bg-cyan-400/25 text-cyan-200 border-cyan-300/40',
        starSecondaryClass: 'bg-white/15 text-white border-white/15',
        bulletIconColor: 'text-cyan-300',
      },
      {
        // Mẫu Thẻ 26 (Kho Mẫu Prompt: Violet-600 to Fuchsia-800)
        bg: 'linear-gradient(135deg, #7c3aed 0%, #6b21a8 52%, #701a75 100%)',
        icon: <Users className="lucide shrink-0 w-5 h-5 text-violet-200" />,
        titleClass: 'text-white',
        tagClass: 'bg-white/15 text-fuchsia-200 border-white/20',
        descClass: 'text-violet-100/95',
        starPrimaryClass: 'bg-fuchsia-400/25 text-fuchsia-200 border-fuchsia-300/40',
        starSecondaryClass: 'bg-white/15 text-white border-white/15',
        bulletIconColor: 'text-fuchsia-300',
      },
      {
        // Mẫu Thẻ 10 / Thẻ 80 (Rose-600 via Pink-700 to Purple-900)
        bg: 'linear-gradient(135deg, #e11d48 0%, #be185d 52%, #4c1d95 100%)',
        icon: <Heart className="lucide shrink-0 w-5 h-5 text-rose-200" />,
        titleClass: 'text-white',
        tagClass: 'bg-white/15 text-rose-200 border-white/20',
        descClass: 'text-rose-100/95',
        starPrimaryClass: 'bg-amber-400/25 text-amber-200 border-amber-300/40',
        starSecondaryClass: 'bg-black/25 text-rose-100 border-white/15',
        bulletIconColor: 'text-rose-300',
      },
    ];

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
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border transition-opacity duration-200',
          isActive ? 'opacity-100' : 'cursor-pointer opacity-45 hover:opacity-80'
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
              className="card-title card-title-synced typo-h3 tracking-tight font-play text-emerald-600 dark:text-emerald-400 truncate m-0 min-w-0"
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
          data-card-layout="responsive-grid"
          data-subcard-count={SIX_CORE_PALACES.length}
          className="w-full max-w-full min-w-0 flex-1 min-h-0 h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-[15px] p-0 items-stretch bg-transparent border-0 shadow-none outline-none box-border"
        >
          {SIX_CORE_PALACES.map((palace, index) => {
            const tpl = palaceTemplates[index % palaceTemplates.length];
            return (
              <HoroscopeBentoCard
                key={palace.id}
                fxMode={currentFx.id}
                onClick={() => showToast(`${palace.name} • ${palace.tag}`)}
                style={{
                  background: tpl.bg,
                  padding: '15px',
                }}
                className="flex flex-col justify-between gap-2.5 w-full h-full min-h-0 min-w-0 text-left cursor-pointer"
              >
                <div className="relative z-10 w-full flex flex-col gap-2 min-w-0">
                  <div className="w-full flex items-center justify-between gap-2 pb-2 border-b border-white/15 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {tpl.icon}
                      <h4
                        className={cn(
                          'text-base sm:text-lg font-bold font-play tracking-tight truncate m-0',
                          tpl.titleClass
                        )}
                        data-subcard-title="true"
                      >
                        {palace.name}
                      </h4>
                    </div>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0', tpl.tagClass)}>
                      {palace.tag}
                    </span>
                  </div>

                  <p className={cn('text-xs leading-relaxed text-left break-words m-0', tpl.descClass)}>
                    {palace.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {palace.stars.map((star, sIdx) => (
                      <span
                        key={sIdx}
                        className={cn(
                          'px-2 py-0.5 rounded-md text-[11px] font-bold border',
                          sIdx === 0 ? tpl.starPrimaryClass : tpl.starSecondaryClass
                        )}
                      >
                        ★ {star}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 space-y-1.5 pt-2 border-t border-white/15">
                  {palace.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 bg-black/20 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white">
                      <CheckCircle className={cn('w-3.5 h-3.5 shrink-0', tpl.bulletIconColor)} />
                      <span className="truncate leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </HoroscopeBentoCard>
            );
          })}
        </div>
      </section>
    );
  };

  // =========================================================================
  // MAIN CARD 4: 6 TRỤ CỘT TRIẾT LÝ LÃNH ĐẠO & HÀNH ĐỘNG (ÁP DỤNG MẪU THẺ 19, 9/73, 10, 16, 5, 22 + THẺ 51)
  // =========================================================================
  const renderCardPillarsTrietLy = () => {
    const isActive = activeCardIndex === 3;
    const pillarTemplates = [
      {
        // 01: Mẫu Thẻ 19 (Sky-500 via Blue-600 to Indigo-800)
        bg: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #3730a3 100%)',
        isDarkText: false,
        icon: <Compass className="lucide shrink-0 w-5 h-5 text-yellow-300" />,
        titleClass: 'text-white',
        descClass: 'text-sky-100/95',
        badgeClass: 'bg-white/15 text-yellow-200 border-white/20',
        footerLabel: 'Tầm nhìn 3–5 năm • Kiến trúc bền vững',
      },
      {
        // 02: Mẫu Thẻ 9 / Thẻ 73 (Slate-900 via Indigo-900 to Violet-950 + Mini Bar Chart)
        bg: 'linear-gradient(135deg, #312e81 0%, #4c1d95 52%, #0f172a 100%)',
        isDarkText: false,
        icon: <BarChart2 className="lucide shrink-0 w-5 h-5 text-cyan-300" />,
        titleClass: 'text-white',
        descClass: 'text-indigo-100/95',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        footerLabel: '100% Data-Driven • Minh bạch thực chứng',
      },
      {
        // 03: Mẫu Thẻ 10 (Rose-600 via Pink-700 to Purple-900)
        bg: 'linear-gradient(135deg, #e11d48 0%, #be185d 52%, #581c87 100%)',
        isDarkText: false,
        icon: <Heart className="lucide shrink-0 w-5 h-5 text-rose-200" />,
        titleClass: 'text-white',
        descClass: 'text-rose-100/95',
        badgeClass: 'bg-white/15 text-rose-200 border-white/20',
        footerLabel: 'Lắng nghe đa chiều • Thấu cảm từng điểm chạm',
      },
      {
        // 04: Mẫu Thẻ 16 (Emerald-800 via Teal-900 to Gray-900)
        bg: 'linear-gradient(135deg, #065f46 0%, #134e4a 52%, #111827 100%)',
        isDarkText: false,
        icon: <Shield className="lucide shrink-0 w-5 h-5 text-emerald-400" />,
        titleClass: 'text-white',
        descClass: 'text-emerald-100/90',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        footerLabel: 'Chính trực khách quan • Giá trị đạo đức gốc',
      },
      {
        // 05: Mẫu Thẻ 5 (Cập Nhật Siêu Tốc: Amber-400 via Orange-500 to Orange-600 + text-gray-950)
        bg: 'linear-gradient(135deg, #fbbf24 0%, #f97316 52%, #ea580c 100%)',
        isDarkText: true,
        icon: <Zap className="lucide shrink-0 w-5 h-5 text-gray-950" />,
        titleClass: 'text-gray-950',
        descClass: 'text-gray-900/90 font-medium',
        badgeClass: 'bg-gray-950/15 text-gray-950 border-gray-950/20',
        footerLabel: 'Thực thi quyết liệt • Tối ưu mỗi ngày',
      },
      {
        // 06: Mẫu Thẻ 22 (Đánh Giá Khách Hàng: Fuchsia-700 to Purple-950 + 5 Stars)
        bg: 'linear-gradient(135deg, #a21caf 0%, #6b21a8 52%, #3b0764 100%)',
        isDarkText: false,
        icon: <Award className="lucide shrink-0 w-5 h-5 text-amber-300" />,
        titleClass: 'text-white',
        descClass: 'text-fuchsia-100/95',
        badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-300/30',
        footerLabel: 'Thước đo: CSAT • Cost-to-Serve • Đội ngũ',
      },
    ];

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
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border transition-opacity duration-200',
          isActive ? 'opacity-100' : 'cursor-pointer opacity-45 hover:opacity-80'
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
          className="w-full max-w-full min-w-0 flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 items-stretch gap-[15px] p-0 bg-transparent border-0 shadow-none outline-none box-border"
        >
          {ACTION_PHILOSOPHY_CARDS.map((card, idx) => {
            const tpl = pillarTemplates[idx % pillarTemplates.length];
            return (
              <HoroscopeBentoCard
                key={idx}
                fxMode={currentFx.id}
                isDarkText={tpl.isDarkText}
                onClick={() => showToast(`Trụ cột 0${idx + 1}: ${card.title}`)}
                style={{
                  background: tpl.bg,
                  padding: '15px',
                }}
                className="flex flex-col justify-between gap-3 w-full h-full min-h-0 min-w-0 text-left cursor-pointer"
              >
                <div className="relative z-10 w-full flex flex-col gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'pb-2.5 border-b flex items-center justify-between gap-2',
                      tpl.isDarkText ? 'border-gray-950/15' : 'border-white/15'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {tpl.icon}
                      <h4
                        className={cn(
                          'text-base sm:text-lg font-play font-bold tracking-tight break-words leading-snug m-0',
                          tpl.titleClass
                        )}
                        data-subcard-title="true"
                      >
                        {card.title}
                      </h4>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-mono tabular-nums font-bold px-2.5 py-0.5 rounded-full border shrink-0',
                        tpl.badgeClass
                      )}
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  {idx === 5 && (
                    <div className="flex items-center gap-1 text-amber-300">
                      {[...Array(5)].map((_, sIdx) => (
                        <Star key={sIdx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  )}

                  <p className={cn('text-xs sm:text-sm leading-relaxed text-left break-words m-0', tpl.descClass)}>
                    {card.desc}
                  </p>
                </div>

                <div
                  className={cn(
                    'relative z-10 pt-2.5 border-t flex items-center justify-between text-[11px] font-bold uppercase tracking-wider',
                    tpl.isDarkText ? 'border-gray-950/15 text-gray-950' : 'border-white/15 text-white/80'
                  )}
                >
                  <span className="truncate">{tpl.footerLabel}</span>
                  {idx === 1 && (
                    <div className="flex items-end gap-1 h-4 shrink-0 ml-2">
                      <span className="w-1.5 bg-cyan-400/50 rounded-t h-2" />
                      <span className="w-1.5 bg-cyan-400/75 rounded-t h-3" />
                      <span className="w-1.5 bg-cyan-300 rounded-t h-4" />
                    </div>
                  )}
                </div>
              </HoroscopeBentoCard>
            );
          })}
        </div>

        {/* Câu nói hay bên dưới Card 4 -> Mẫu Thẻ 51 (Trích Dẫn Truyền Cảm Hứng Tương Tác) */}
        <HoroscopeBentoCard
          as="div"
          id="horoscope-card-pillars-quote"
          fxMode={currentFx.id}
          disableTilt
          style={{
            background: 'linear-gradient(135deg, #5b21b6 0%, #4c1d95 48%, #0f172a 100%)',
            padding: '14px 16px',
          }}
          className="shrink-0 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 box-border"
        >
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-full shrink-0">
              Triết Lý Lãnh Đạo
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-play font-bold italic text-white leading-snug m-0">
                “Lãnh đạo bền vững không đến từ uy quyền áp đặt, mà từ tầm nhìn sáng rõ, dữ liệu minh bạch, trái tim thấu cảm và kỷ luật hành động nhất quán mỗi ngày.”
              </p>
              <span className="text-[11px] font-bold text-amber-300 mt-0.5 block">
                — Triết lý lãnh đạo · Nguyễn Hùng Thái
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              copySnippet(
                '“Lãnh đạo bền vững không đến từ uy quyền áp đặt, mà từ tầm nhìn sáng rõ, dữ liệu minh bạch, trái tim thấu cảm và kỷ luật hành động nhất quán mỗi ngày.” — Triết lý lãnh đạo · Nguyễn Hùng Thái'
              )
            }
            className="relative z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition-colors cursor-pointer shrink-0 self-end sm:self-center"
            title="Sao chép câu nói"
          >
            <Copy className="w-4 h-4" />
          </button>
        </HoroscopeBentoCard>
      </section>
    );
  };

  // =========================================================================
  // CARD 5: 4. KỸ NĂNG NGŨ HÀNH (ÁP DỤNG MẪU THẺ 14, 34, 63, 32, 60, 81 + THẺ 53)
  // =========================================================================
  const renderCard4KyNangNguHanh = () => {
    const isActive = activeCardIndex === 4;
    const elementLucideIcons = [
      <Shield key="kim" className="lucide shrink-0 w-4 h-4" />,
      <Cpu key="thuy" className="lucide shrink-0 w-4 h-4" />,
      <Users key="moc" className="lucide shrink-0 w-4 h-4" />,
      <Heart key="hoa" className="lucide shrink-0 w-4 h-4" />,
      <Layers key="tho" className="lucide shrink-0 w-4 h-4" />,
      <Compass key="hop" className="lucide shrink-0 w-4 h-4" />,
    ];

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
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border transition-opacity duration-200',
          isActive ? 'opacity-100' : 'cursor-pointer opacity-45 hover:opacity-80'
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
          className="five-elements-grid w-full max-w-full min-w-0 flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 p-0 items-stretch bg-transparent border-0 shadow-none outline-none box-border"
        >
          {FIVE_ELEMENTS_GOVERNANCE.map((item, idx) => {
            const bs = item.bentoStyle;
            return (
              <HoroscopeBentoCard
                key={idx}
                fxMode={currentFx.id}
                onClick={() => showToast(`${item.title} (${item.palaceBadge})`)}
                style={{
                  background: bs.gradientCss,
                  padding: '14px',
                }}
                className="ngu-hanh-element-card flex flex-col justify-between gap-2 relative overflow-hidden w-full h-full min-h-0 min-w-0 text-left cursor-pointer"
              >
                {/* Chữ Hán chìm góc dưới phải */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -bottom-2 right-2 z-0 flex items-center justify-center opacity-15"
                  style={{ color: bs.watermarkColor }}
                >
                  <span className="text-[48px] font-bold leading-none font-serif">
                    {item.hanzi}
                  </span>
                </div>

                {/* Đầu thẻ & mô tả chính */}
                <div className="relative z-10 w-full flex flex-col gap-1.5 min-w-0">
                  <div className="pb-1.5 border-b border-white/15 flex items-center justify-between gap-2 min-w-0">
                    <div
                      className="flex items-center gap-1.5 min-w-0 flex-1"
                      style={{ color: bs.accentText }}
                    >
                      {elementLucideIcons[idx % elementLucideIcons.length]}
                      <h4
                        className="text-sm sm:text-base tracking-tight font-play font-bold truncate leading-snug m-0"
                        style={{ color: bs.accentText }}
                        data-subcard-title="true"
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 shrink-0 font-bold whitespace-nowrap"
                      style={{
                        background: bs.badgeBg,
                        color: bs.badgeText,
                      }}
                    >
                      {item.palaceBadge}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-snug text-left break-words m-0">
                    {item.desc}
                  </p>
                </div>

                {/* Khối trọng tâm & chân thẻ */}
                <div className="relative z-10 w-full flex flex-col gap-1.5 mt-auto min-w-0">
                  <div
                    style={{
                      background: bs.focusBoxBg,
                      borderColor: bs.focusBoxBorder,
                    }}
                    className="rounded-xl p-2.5 space-y-0.5 border"
                  >
                    <div
                      className="text-[11px] font-play font-bold leading-tight"
                      style={{ color: bs.accentText }}
                    >
                      {item.boxLabel}
                    </div>
                    <div className="text-xs font-bold text-white leading-snug">
                      {item.boxContent}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-white/15">
                    <div className="text-[11px] font-bold text-white/80 truncate">
                      {item.footer}
                    </div>
                    <div
                      className="h-1.5 w-full rounded-full"
                      style={{ background: bs.bottomBar }}
                    />
                  </div>
                </div>
              </HoroscopeBentoCard>
            );
          })}
        </div>

        {/* Câu nói hay bên dưới 4. Kỹ Năng Ngũ Hành -> Mẫu Thẻ 53 (Góc Suy Ngẫm: Cyan-800 to Slate-900) */}
        <HoroscopeBentoCard
          as="div"
          id="horoscope-card-4-quote"
          fxMode={currentFx.id}
          disableTilt
          style={{
            background: 'linear-gradient(135deg, #155e75 0%, #0f172a 100%)',
            padding: '12px 16px',
          }}
          className="shrink-0 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 box-border"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <Feather className="lucide w-5 h-5 text-cyan-300 shrink-0" />
            <div className="min-w-0 flex-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className="text-xs sm:text-sm font-play font-bold italic text-white leading-snug m-0">
                “Kim giữ chuẩn mực, Thủy khai hiệu suất, Mộc nuôi nội lực, Hỏa thắp trải nghiệm, Thổ dựng nền sâu — khi ngũ hành tương sinh, tổ chức tự khắc vận hành bền vững.”
              </p>
              <span className="text-xs font-bold text-cyan-300 shrink-0 whitespace-nowrap">
                — Ngũ Hành Quản Trị · Hải Trung Kim 1984
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              copySnippet(
                '“Kim giữ chuẩn mực, Thủy khai hiệu suất, Mộc nuôi nội lực, Hỏa thắp trải nghiệm, Thổ dựng nền sâu — khi ngũ hành tương sinh, tổ chức tự khắc vận hành bền vững.” — Ngũ Hành Quản Trị · Hải Trung Kim 1984'
              )
            }
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 transition-colors cursor-pointer shrink-0 self-end sm:self-center"
            title="Sao chép câu nói"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </HoroscopeBentoCard>
      </section>
    );
  };

  // =========================================================================
  // CARD 6: 5. KIỂM TRA TƯƠNG HỢP CÔNG VIỆC (ÁP DỤNG MẪU THẺ 2/73 + THẺ 75/80)
  // =========================================================================
  const renderCard5KiemTraCongViec = () => {
    const isActive = activeCardIndex === 5;
    const signInfo = currentCanChiResult.sign;
    const toneBadgeClass =
      signInfo.tone === 'positive'
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
        : signInfo.tone === 'caution'
          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
          : 'bg-sky-500/20 text-sky-300 border-sky-400/40';

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
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border transition-opacity duration-200',
          isActive ? 'opacity-100' : 'cursor-pointer opacity-45 hover:opacity-80'
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
          className="w-full max-w-full min-w-0 flex-1 min-h-0 h-full grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 items-stretch content-stretch gap-[15px] p-0 bg-transparent border-0 shadow-none outline-none box-border"
        >
          {/* TRA CỨU 12 CON GIÁP - CỘT TRÁI (Mẫu Thẻ 2 / Thẻ 73: Slate-900 via Gray-800 to Indigo-950) */}
          <HoroscopeBentoCard
            fxMode={currentFx.id}
            disableTilt
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1f2937 50%, #1e1b4b 100%)',
              padding: '16px',
            }}
            className="h-full min-h-0 flex flex-col justify-between gap-4 min-w-0 overflow-y-auto overflow-x-hidden no-scrollbar text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 min-w-0 pb-2.5 border-b border-white/15">
                <Calendar className="lucide w-5 h-5 text-purple-400 shrink-0" />
                <h4
                  className="text-lg sm:text-xl font-play font-bold text-white tracking-tight break-words leading-snug m-0"
                  data-subcard-title="true"
                >
                  Tra Cứu Tuổi Làm Việc Chung
                </h4>
              </div>

              {/* Input Tra Cứu chuẩn Bento Studio Thẻ 18 / Thẻ 81 */}
              <div className="relative flex items-center gap-2 pt-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={searchYearInput}
                  onChange={(e) => setSearchYearInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleYearSearch();
                  }}
                  placeholder="Nhập năm sinh (VD: 1992)"
                  className="flex-1 bg-black/35 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <button
                  id="horoscope-lookup-search-btn"
                  type="button"
                  onClick={handleYearSearch}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Tra Cứu</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-xs font-play font-bold text-gray-300">
                  Hoặc chọn nhanh 12 Con Giáp:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {ZODIAC_SIGNS.map((z) => {
                    const isSel = signInfo.key === z.key;
                    return (
                      <button
                        key={z.key}
                        type="button"
                        aria-pressed={isSel}
                        onClick={() => handleSelectZodiac(z.key)}
                        className={cn(
                          'p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group',
                          isSel
                            ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 text-gray-950 border-amber-300 shadow-lg scale-[1.04]'
                            : 'bg-gray-700/50 hover:bg-purple-600/30 hover:border-purple-400/50 border-white/10 text-white'
                        )}
                      >
                        <span className="text-xl leading-none group-hover:scale-110 transition-transform">
                          {z.icon}
                        </span>
                        <span className="text-xs font-bold">{z.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/10 text-xs text-gray-300 text-center">
              Nhập năm sinh bất kỳ hoặc chọn 1 trong 12 con giáp để đối chiếu Can Chi, Ngũ Hành và mức độ hòa hợp công việc với Giáp Tý 1984.
            </div>
          </HoroscopeBentoCard>

          {/* CỘT PHẢI: KẾT QUẢ ĐỐI CHIẾU (Mẫu Thẻ 75 / Thẻ 80: Violet-900 via Indigo-950 to Slate-900) */}
          <HoroscopeBentoCard
            id="horoscope-match-result-card"
            data-element-name="Thẻ Kết Quả Đối Chiếu Với Giáp Tý 1984"
            fxMode={currentFx.id}
            disableTilt
            style={{
              background: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 52%, #0f172a 100%)',
              padding: '16px',
            }}
            className="h-full min-h-0 flex flex-col justify-between gap-3 min-w-0 overflow-y-auto overflow-x-hidden no-scrollbar text-left"
          >
            <div className="flex-1 min-h-0 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15">
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="lucide w-5 h-5 text-amber-300 shrink-0" />
                  <h4
                    className="text-lg sm:text-xl font-play font-bold tracking-tight text-white break-words leading-snug m-0"
                    data-subcard-title="true"
                  >
                    Kết Quả Đối Chiếu Với Giáp Tý 1984
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copySnippet(
                      `Tuổi ${signInfo.name} (${activeLookupYear} • ${currentCanChiResult.canChi} • Mệnh ${currentCanChiResult.element}): ${signInfo.detail}`
                    )
                  }
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 cursor-pointer shrink-0"
                  title="Sao chép kết quả đối chiếu"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thông tin Con Giáp Được Chọn */}
              <div className="flex flex-col gap-2">
                <h5 className="text-base sm:text-lg font-play font-bold text-amber-300 break-words leading-snug m-0">
                  Tuổi {signInfo.name} ({activeLookupYear} • {currentCanChiResult.canChi} • Mệnh {currentCanChiResult.element})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border', toneBadgeClass)}>
                    {signInfo.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/35">
                    {currentCanChiResult.elementRelation}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/35">
                    Vai trò: {signInfo.role}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed text-left break-words m-0">
                {signInfo.detail}
              </p>

              {/* Grid 2 Khối: Điểm mạnh & Điểm nghẽn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-3">
                <div className="bg-emerald-500/15 border border-emerald-400/35 rounded-xl p-3 space-y-1">
                  <h5 className="text-xs font-play font-bold text-emerald-300 flex items-center gap-1.5 m-0">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Điểm mạnh kết hợp</span>
                  </h5>
                  <p className="text-xs text-white/90 leading-relaxed m-0">
                    {signInfo.strength}
                  </p>
                </div>

                <div className="bg-amber-500/15 border border-amber-400/35 rounded-xl p-3 space-y-1">
                  <h5 className="text-xs font-play font-bold text-amber-300 flex items-center gap-1.5 m-0">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Điểm nghẽn chú ý</span>
                  </h5>
                  <p className="text-xs text-white/90 leading-relaxed m-0">
                    {signInfo.caution}
                  </p>
                </div>
              </div>

              {/* Gợi ý điều phối */}
              <div className="bg-black/30 border border-purple-400/30 rounded-xl p-3 space-y-1">
                <h5 className="text-xs font-play font-bold text-purple-300 flex items-center gap-1.5 m-0">
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>Gợi ý điều phối</span>
                </h5>
                <p className="text-xs text-white/90 leading-relaxed m-0">
                  {signInfo.advice}
                </p>
              </div>
            </div>
          </HoroscopeBentoCard>
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
          'page-main-card floating-glass-surface floating-surface--main relative z-10 shrink-0 flex flex-col justify-start p-[15px] gap-[15px] rounded-[var(--radius-global,var(--radius-main,14px))] overflow-y-auto overflow-x-hidden no-scrollbar font-play text-left select-none box-border transition-opacity duration-200',
          isActive ? 'opacity-100' : 'cursor-pointer opacity-45 hover:opacity-80'
        )}
      >
        {renderHeroBanner()}

        {/* BỐ CỤC 70% CARD TỬ VI 6 & 30% HỒ SƠ NGUYỄN HÙNG THÁI (CHIỀU CAO FULL) */}
        <div
          ref={row1HorizontalRef}
          id="horoscope-row-1-horizontal"
          data-card-layout={resolveAdaptiveCardLayout(isTuViExpanded ? 1 : 2, true)}
          data-subcard-count={isTuViExpanded ? 1 : 2}
          data-book-expanded={isTuViExpanded ? 'true' : 'false'}
          className="relative z-10 w-full max-w-full min-w-0 flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] md:grid-rows-[minmax(0,1fr)] gap-[15px] p-0 items-stretch bg-transparent box-border"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px', padding: '0px', background: 'transparent', width: '100%', height: '100%', flex: '1 1 0%' }}
        >
          {/* Vị trí 1: Thẻ 6. Luận giải lá số tử vi (70% chiều ngang, full chiều cao, padding 5px) */}
          <HoroscopeBentoCard
            cardRef={card6Ref}
            id="horoscope-card-6"
            data-element-name="Card tử vi 6"
            data-element-type="card"
            data-section-card="true"
            data-element-page="horoscope"
            data-element-parent="horoscope-card-1"
            data-expanded={isTuViExpanded ? 'true' : 'false'}
            fxMode={currentFx.id}
            disableTilt
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 55%, #172554 100%)',
              padding: '5px',
              gap: '0px',
              height: '100%',
              minHeight: '100%',
              ...(isTuViExpanded
                ? {
                    minHeight: `${Math.max(combinedExpandedHeight, 540)}px`,
                  }
                : {}),
            }}
            className={cn(
              'w-full h-full min-h-0 min-w-0 flex flex-col justify-between gap-0 p-[5px] overflow-hidden box-border text-left',
              isTuViExpanded ? 'h-full col-span-full' : ''
            )}
          >
            {renderCard6LuanGiaiContent()}
          </HoroscopeBentoCard>

          {/* Vị trí 2: Thẻ Hồ sơ Nguyễn Hùng Thái (30% chiều ngang, Mẫu Thẻ 12: Slate-800 to Slate-900) */}
          {!isTuViExpanded && (
            <HoroscopeBentoCard
              cardRef={profileCardRef}
              id="horoscope-card-profile"
              data-element-name="Thẻ Hồ sơ Nguyễn Hùng Thái"
              data-element-type="card"
              data-section-card="true"
              data-element-page="horoscope"
              data-element-parent="horoscope-card-1"
              fxMode={currentFx.id}
              disableTilt
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: '15px',
                height: '100%',
                minHeight: '100%',
                containerType: 'inline-size',
                containerName: 'horoscope-profile-card',
              }}
              className="w-full h-full min-h-0 min-w-0 flex flex-col justify-between gap-[12px] p-[15px] overflow-hidden box-border text-left relative"
            >
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 w-full h-full min-h-0 flex flex-col justify-between gap-[12px]">
                {renderCard1HoSoTuViContent()}
              </div>
            </HoroscopeBentoCard>
          )}
        </div>
      </section>
    );
  };

  return (
    <div
      id="horoscope-page-shell"
      data-fx={currentFx.id}
      className="horoscope-bento-root relative w-full max-w-full min-w-0 h-full flex-1 flex flex-col items-center justify-start min-h-0 overflow-hidden bg-transparent"
    >
      {/* Toàn bộ CSS hiệu ứng thẻ & rê chuột chuẩn Bento Studio (Spotlight 3D, Float Shadow, Neon, Minimal, Ripple) */}
      <style>{`
        .horoscope-bento-studio-card {
          border-radius: 12px !important;
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease,
            background-color 0.3s ease,
            color 0.3s ease,
            opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        .horoscope-bento-studio-card[data-dark-text="false"] {
          color: #ffffff !important;
        }

        .horoscope-bento-studio-card[data-dark-text="true"] {
          color: #030712 !important;
        }

        .horoscope-bento-studio-card:active {
          transform: translateY(-2px) scale(0.992) !important;
          box-shadow:
            0 8px 18px -6px rgba(0, 0, 0, 0.5),
            0 3px 8px -2px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        }

        .horoscope-bento-studio-card.card-reveal {
          opacity: 0;
          transform: translateY(18px) scale(0.98);
        }

        .horoscope-bento-studio-card.card-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Lớp ánh sáng Spotlight bám theo con trỏ chuột (không dùng gương lóe sáng) */
        .horoscope-bento-studio-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(
            380px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.16),
            rgba(168, 85, 247, 0.08) 40%,
            transparent 72%
          );
        }

        /* Chế độ 1: Ánh sáng Spotlight + Nghiêng 3D + Nổi khối đổ bóng (Mặc định) */
        .horoscope-bento-root[data-fx="spotlight-3d"] .horoscope-bento-studio-card:hover {
          transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-8px) scale(1.015) !important;
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

        .horoscope-bento-root[data-fx="spotlight-3d"] .horoscope-bento-studio-card:hover::before {
          opacity: 1;
        }

        /* Chế độ 2: Nổi Khối & Đổ Bóng Chuyên Sâu */
        .horoscope-bento-root[data-fx="float-shadow"] .horoscope-bento-studio-card:hover {
          transform: translateY(-10px) scale(1.02) !important;
          box-shadow:
            0 36px 60px -14px rgba(0, 0, 0, 0.68),
            0 18px 28px -10px rgba(0, 0, 0, 0.46),
            0 0 0 1px rgba(255, 255, 255, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.32) !important;
        }

        .horoscope-bento-root[data-fx="float-shadow"] .horoscope-bento-studio-card:hover::before {
          opacity: 0.75;
        }

        /* Chế độ 3: Viền Neon rực rỡ bám chuột + Nổi khối */
        .horoscope-bento-root[data-fx="neon"] .horoscope-bento-studio-card::before {
          background: radial-gradient(
            340px circle at var(--mx) var(--my),
            rgba(56, 189, 248, 0.24),
            rgba(192, 132, 252, 0.16) 42%,
            transparent 72%
          );
        }

        .horoscope-bento-root[data-fx="neon"] .horoscope-bento-studio-card:hover {
          transform: translateY(-8px) scale(1.015) !important;
          border-color: rgba(192, 132, 252, 0.75) !important;
          box-shadow:
            0 28px 46px -12px rgba(0, 0, 0, 0.58),
            0 18px 34px -8px rgba(139, 92, 246, 0.48),
            0 0 26px -2px rgba(56, 189, 248, 0.42),
            inset 0 0 20px rgba(168, 85, 247, 0.14) !important;
        }

        .horoscope-bento-root[data-fx="neon"] .horoscope-bento-studio-card:hover::before {
          opacity: 1;
        }

        /* Chế độ 4: Tối Giản (Nổi nhẹ + Đổ bóng mềm) */
        .horoscope-bento-root[data-fx="minimal"] .horoscope-bento-studio-card:hover {
          transform: translateY(-5px) !important;
          box-shadow:
            0 22px 36px -10px rgba(0, 0, 0, 0.5),
            0 10px 18px -6px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        /* Vi tương tác biểu tượng bên trong thẻ khi rê chuột */
        .horoscope-bento-studio-card svg.lucide {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .horoscope-bento-studio-card:hover svg.lucide.shrink-0 {
          transform: scale(1.14) rotate(-5deg);
        }

        /* Hiệu ứng gợn sóng (Ripple) khi nhấn vào thẻ */
        .horoscope-card-ripple {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 25;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.34) 0%, rgba(168, 85, 247, 0.16) 55%, transparent 75%);
          transform: translate(-50%, -50%) scale(0);
          animation: horoscopeCardRippleAnim 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes horoscopeCardRippleAnim {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        .bento-studio-border {
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
        }

        .bento-studio-border:hover {
          border-color: rgba(255, 255, 255, 0.28) !important;
        }

        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }
      `}</style>

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

      {/* NÚT TRÒN ĐIỀU HƯỚNG TRÁI / PHẢI */}
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