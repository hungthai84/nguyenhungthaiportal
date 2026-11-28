'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { OrigamiUnfoldStage } from './experience/OrigamiUnfoldStage';
import { ExperienceSliderView } from './experience/ExperienceSliderView';
import { ExperienceBentoStudioCard } from './experience/ExperienceBentoStudioCard';
import { BlurUpImage } from '@/components/ui/BlurUpImage';
import { COMPANY_LOGOS } from '@/utils/companyBrandAssets';
import {
  getExpandCardLayoutTransition,
  getCardSettleTransition,
  getExpandDetailRevealTransition,
} from '@/components/ui/ExpandCardMotion';
import {
  type OrigamiFoldPhase,
  ORIGAMI_TIMINGS,
  contentRevealVariants,
} from './experience/origamiMotion';

const Calendar = createAnimatedIcon('calendar');
const Building2 = createAnimatedIcon('building-2');
const Briefcase = createAnimatedIcon('briefcase');
const Users = createAnimatedIcon('users');
const ChevronLeft = createAnimatedIcon('chevron-left');
const ChevronRight = createAnimatedIcon('chevron-right');
const Layers = createAnimatedIcon('layers');
const Trophy = createAnimatedIcon('trophy');
const ShoppingBag = createAnimatedIcon('shopping-bag');
const Wallet = createAnimatedIcon('wallet');
const Monitor = createAnimatedIcon('monitor');
const Cpu = createAnimatedIcon('cpu');
const BookOpen = createAnimatedIcon('book-open');
const Sparkles = createAnimatedIcon('sparkles');
const Network = createAnimatedIcon('network');
const Headphones = createAnimatedIcon('headphones');
const Gauge = createAnimatedIcon('gauge');
const ShieldCheck = createAnimatedIcon('shield-check');
const Flame = createAnimatedIcon('flame');
const Lock = createAnimatedIcon('lock');
const ListChecks = createAnimatedIcon('list-checks');
const FolderKanban = createAnimatedIcon('folder-kanban');
const Camera = createAnimatedIcon('camera');
const ZoomIn = createAnimatedIcon('zoom-in');
const ArrowLeft = createAnimatedIcon('arrow-left');
const MapPin = createAnimatedIcon('map-pin');
const PhoneCall = createAnimatedIcon('phone-call');
const Tv = createAnimatedIcon('tv');
const ArrowUpRight = createAnimatedIcon('arrow-up-right');
const TrendingUp = createAnimatedIcon('trending-up');
const CheckCircle2 = createAnimatedIcon('check-circle');
const ArrowLeftRight = createAnimatedIcon('arrow-left-right');
const ChevronDown = createAnimatedIcon('chevron-down');
const ChevronUp = createAnimatedIcon('chevron-up');
const X = createAnimatedIcon('x');
const Award = createAnimatedIcon('award');
const Clock = createAnimatedIcon('clock');
const Compass = createAnimatedIcon('compass');
const Folder = createAnimatedIcon('folder');
const Shield = createAnimatedIcon('shield');
const Target = createAnimatedIcon('target');
const Zap = createAnimatedIcon('zap');
const BarChart3 = createAnimatedIcon('bar-chart-3');
import { EXPERIENCE_MILESTONES } from '@/data/experience';
import { PROJECTS_DATA } from '@/data/projects';
import { DOMAINS_DATA } from '@/data/services';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { saveMutedPref } from '@/utils/audioPreference';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';

interface MilestoneLogoItem {
  src: string;
  fallback: string;
  alt: string;
}

const CircularLogo: React.FC<{
  logo: MilestoneLogoItem;
  isStacked: boolean;
  index: number;
  total: number;
  onOpenDetail: () => void;
  companyName: string;
}> = ({ logo, isStacked, index, total, onOpenDetail, companyName }) => {
  const [imgSrc, setImgSrc] = useState(logo.src);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const sizeClass =
    total >= 4
      ? 'w-[60px] h-[60px] sm:w-[68px] sm:h-[68px]'
      : total > 1
        ? 'w-[76px] h-[76px] sm:w-[80px] sm:h-[80px]'
        : 'w-[92px] h-[92px]';

  const initials = logo.alt.replace(/^Logo\s+/i, '').trim().slice(0, 4) || 'Logo';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        SoundEngine.playTap();
        onOpenDetail();
      }}
      style={{
        marginLeft: isStacked && index > 0 ? (total >= 4 ? '-16px' : '-18px') : '0px',
        zIndex: total - index,
        border: 'none',
        boxShadow: 'var(--shadow-subcard, 0 6px 14px -4px rgba(15, 23, 42, 0.22))',
      }}
      title={`${logo.alt} — Nhấn vào logo để xem chi tiết công việc tại ${companyName}`}
      aria-label={`Xem chi tiết công việc tại ${companyName} (${logo.alt})`}
      className={cn(
        sizeClass,
        'company-logo-surface relative aspect-square rounded-full p-0 border-0 ring-0 outline-none flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 hover:scale-105 hover:z-30 cursor-pointer focus-visible:outline-none'
      )}
    >
      {!hasFailedAll ? (
        <BlurUpImage
          src={imgSrc}
          fallbackSrc={logo.fallback}
          variant="contain"
          onError={() => {
            if (imgSrc !== logo.fallback) {
              setImgSrc(logo.fallback);
            } else {
              setHasFailedAll(true);
            }
          }}
          alt={logo.alt}
          className="w-full h-full object-cover rounded-full pointer-events-none select-none"
        />
      ) : (
        <span className="typo-badge font-bold text-[var(--text-primary)]">{initials}</span>
      )}
    </button>
  );
};

const STORY_NARRATIONS: Record<
  string,
  {
    title: string;
    stage: string;
    summary: string;
    voiceScript: string;
    highlightKpis: string[];
  }
> = {
  '2002': {
    title: 'MobiFone',
    stage: 'Cấp bậc 1 · Nhân viên CSKH (Viễn thông di động)',
    summary: 'Khởi đầu nhân viên tổng đài, rèn chuẩn quy trình viễn thông, xử lý sự cố và tư duy lấy khách hàng làm trung tâm.',
    voiceScript: 'Năm 2003, khởi đầu Nhân viên CSKH tại MobiFone, rèn chuẩn quy trình phục vụ ngành viễn thông.',
    highlightKpis: ['Nhân viên CSKH', 'Quy trình chuẩn', '12 Nhân sự'],
  },
  '2007': {
    title: 'Viễn Liên V247',
    stage: 'Cấp bậc 2 · Giám sát CSKH (Viễn thông quốc tế)',
    summary: 'Phát triển từ Nhân viên lên Giám sát ca 24/7: quản lý đội ngũ, đào tạo nghiệp vụ và xây dựng chỉ số QA/SLA >98%.',
    voiceScript: 'Năm 2007, thăng tiến Giám sát CSKH tại Viễn Liên V247, quản lý ca trực quốc tế 24/7 và đào tạo QA.',
    highlightKpis: ['Giám sát CSKH', 'SLA 98.6%', 'Đào tạo & QA'],
  },
  '2011': {
    title: 'LBC - HTVC',
    stage: 'Cấp bậc 3 · Trưởng phòng quy mô nhỏ (Truyền hình Cáp & ISP)',
    summary: 'Lần đầu làm Trưởng phòng CSKH quy mô nhỏ: chuẩn hóa quy trình SOP, lập KPI, đào tạo đội ngũ và điều hành đa đơn vị.',
    voiceScript: 'Năm 2011, đảm nhiệm Trưởng phòng CSKH quy mô nhỏ tại LBC HTVC, chuẩn hóa quy trình và hệ thống KPI.',
    highlightKpis: ['Trưởng phòng (Nhỏ)', 'Chuẩn hóa SOP', '12 Nhân sự'],
  },
  '2013': {
    title: 'VED (Garena / Shopee / AirPay / Gcafe)',
    stage: 'Cấp bậc 4 · Trưởng phòng quản lý cấp cao (129–130 NS · Đa lĩnh vực)',
    summary: 'Quản lý cấp cao 129 NS đa ngành Game (LMHT, Liên Quân), TMĐT Shopee, Ví AirPay & Gcafe: xây dựng hệ thống CRM, quy trình & đào tạo.',
    voiceScript: 'Năm 2013, Trưởng phòng quản lý cấp cao 129 nhân sự tại Garena, đồng hành Shopee, AirPay, Gcafe.',
    highlightKpis: ['Quản lý cấp cao', '129 Nhân sự', 'Đa lĩnh vực số'],
  },
  '2016': {
    title: 'Prudential Việt Nam',
    stage: 'Đa lĩnh vực · Trưởng phòng Call Center (Bảo hiểm nhân thọ)',
    summary: 'Quản trị trải nghiệm & chất lượng ngành Bảo hiểm: chuẩn hóa quy trình thẩm định/BCP, đào tạo đồng cảm và giữ vững niềm tin.',
    voiceScript: 'Năm 2016, Trưởng phòng Call Center Prudential, chuẩn hóa quy trình tin cậy và trải nghiệm bảo hiểm.',
    highlightKpis: ['Ngành Bảo hiểm', 'QA/QC 96%', 'Quy trình BCP'],
  },
  '2018': {
    title: 'Ví MoMo',
    stage: 'Quản lý cấp cao · Trưởng phòng CSKH FinTech (60+ NS & BPO)',
    summary: 'Dẫn dắt khối CSKH Tài chính số quy mô lớn: quản lý nội bộ + BPO, xây dựng hệ thống CRM thời gian thực và tối ưu quy trình số.',
    voiceScript: 'Năm 2018, Trưởng phòng CSKH cấp cao Ví MoMo, xây dựng CRM thời gian thực phục vụ chục triệu ví.',
    highlightKpis: ['Quản lý cấp cao', '60+ NS & BPO', 'CRM Realtime'],
  },
  '2023': {
    title: 'Finviet (Ví ECO)',
    stage: 'Hoàn thiện Hệ thống · Trưởng phòng CSKH (Ví điện tử & Bán lẻ B2B)',
    summary: 'Hoàn thiện mô hình CSKH hiện đại ngành Tài chính – B2B: kết hợp Quản lý, Quy trình, Đào tạo và Hệ thống (Omnichannel, BI, AI Bot).',
    voiceScript: 'Năm 2023, Trưởng phòng CSKH Finviet Ví ECO, hoàn thiện hệ thống dịch vụ kết hợp quy trình và AI Bot.',
    highlightKpis: ['Ví ECO · B2B', 'AI Bot 24/7', '4 Trụ cột kỹ năng'],
  },
  '2026': {
    title: 'Chiến Lược CX 2026+',
    stage: 'Tầm nhìn · Trưởng phòng / Giám đốc Trải nghiệm Khách hàng',
    summary: 'Hội tụ >22 năm đa ngành: Quản lý cấp cao (100–150+ NS), Xây dựng hệ thống AI CRM, Chuẩn hóa quy trình COPC & Đào tạo kế thừa.',
    voiceScript: 'Năm 2026 trở đi, định hướng Giám đốc Trải nghiệm Khách hàng với hệ thống AI CRM và văn hóa phụng sự.',
    highlightKpis: ['CX Director', 'AI & CRM Hệ thống', '100–150+ NS'],
  },
};

interface MilestoneCustomContent {
  bannerTitle: string;
  bannerDesc: string;
  gradient: string;
  pillars: Array<{ title: string; desc: string; icon: string; color: string; bg: string }>;
  commitments: Array<{ title: string; desc: string }>;
}

const MILESTONE_CUSTOM_CONTENT: Record<string, MilestoneCustomContent> = {
  '2002': {
    bannerTitle: 'Tiên phong viễn thông di động<br />Chuẩn mực dịch vụ khách hàng',
    bannerDesc: 'Khởi đầu sự nghiệp với nền tảng quy trình viễn thông nghiêm ngặt, rèn luyện kỹ năng lắng nghe, thấu cảm và giải quyết khiếu nại cước đa kênh.',
    gradient: 'from-blue-700 via-blue-600 to-sky-700',
    pillars: [
      { title: 'Nền tảng CSKH Viễn Thông', desc: 'Đào tạo bài bản nghiệp vụ tổng đài di động', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Quản lý Hotline 24/7', desc: 'Tiếp nhận và tư vấn cước viễn thông liên tục', icon: 'phone', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Xử lý khiếu nại FCR', desc: 'Giải quyết triệt để ngay cuộc gọi đầu tiên', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Đào tạo & Kèm cặp', desc: 'Huấn luyện thế hệ nhân sự mới chuẩn SOP', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Giải quyết khiếu nại cước di động lần đầu (FCR) đạt > 89%.' },
      { title: 'Quy chuẩn nghiệp vụ', desc: 'Tuân thủ nghiêm ngặt quy trình CSKH viễn thông di động quốc gia.' },
    ],
  },
  '2007': {
    bannerTitle: 'Kết nối kiều bào toàn cầu<br />Vận hành tổng đài quốc tế 24/7',
    bannerDesc: 'Quản lý ca trực Call Center quốc tế đa múi giờ Hoa Kỳ - Việt Nam, nâng tỷ lệ FCR từ 74% lên 89% và giảm 30% thời gian chờ đợi của khách hàng.',
    gradient: 'from-purple-800 via-purple-700 to-indigo-800',
    pillars: [
      { title: 'Giám sát Call Center', desc: 'Quản lý vận hành ca trực đa múi giờ Hoa Kỳ', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Chuẩn hóa tài liệu SOP', desc: 'Biên soạn bộ quy trình chăm sóc đa kênh', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Cam kết SLA > 98%', desc: 'Kiểm soát chất lượng ghi âm và phản hồi nhanh', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Coaching & Đào tạo', desc: 'Huấn luyện chuẩn mực giao tiếp quốc tế chuyên nghiệp', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Đảm bảo hoạt động tổng đài viễn thông quốc tế 24/7 không gián đoạn.' },
      { title: 'Chất lượng thoại kiều bào', desc: 'Tối ưu chất lượng kết nối và kiểm soát cước quốc tế minh bạch.' },
    ],
  },
  '2011': {
    bannerTitle: 'Truyền hình & Băng rộng số<br />Nâng tầm trải nghiệm giải trí gia đình',
    bannerDesc: 'Chuẩn hóa quy trình chăm sóc khách hàng truyền hình cáp HTVC và internet băng rộng, phối hợp xử lý sự cố kỹ thuật hiện trường 24/7.',
    gradient: 'from-emerald-800 via-emerald-700 to-teal-800',
    pillars: [
      { title: 'Lãnh đạo phòng ban CSKH', desc: 'Quản trị toàn diện hoạt động phòng dịch vụ khách hàng', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Phối hợp kỹ thuật hiện trường', desc: 'Điều phối xử lý sự cố tín hiệu truyền hình cáp', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Quản trị thuê bao CRM', desc: 'Kiểm soát dữ liệu và tối ưu thời gian phản hồi', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Gắn kết khách hàng', desc: 'Duy trì tỷ lệ gia hạn thuê bao và hài lòng dịch vụ', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Tối ưu quy trình tiếp nhận và phân bổ xử lý sự cố kỹ thuật truyền hình.' },
      { title: 'Trải nghiệm thuê bao', desc: 'Đảm bảo tín hiệu truyền hình cáp và internet ổn định cho các hộ gia đình.' },
    ],
  },
  '2013': {
    bannerTitle: 'Vietnam Esports (VED)<br />Kiến tạo giá trị bền vững',
    bannerDesc: 'Với thế mạnh trong lĩnh vực eSports, Thương mại điện tử và Dịch vụ số, VED mang đến những trải nghiệm vượt trội cho hàng triệu người dùng Việt Nam.',
    gradient: 'from-blue-700 via-blue-600 to-indigo-800',
    pillars: [
      { title: 'Xây dựng đội ngũ CSKH', desc: 'với tinh thần phục vụ khách hàng', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Vận hành Contact Center', desc: 'chuẩn quy mô 200 – 500+ nhân sự', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Phát triển hệ sinh thái', desc: 'eSports – TMĐT – Ví điện tử', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Đóng góp cộng đồng', desc: 'Game thủ & người dùng Việt Nam', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Đảm bảo các chỉ số phản hồi Ticket/Chat đạt chuẩn > 90%, 80.000 ticket/ngày.' },
      { title: 'Bảo mật tài khoản người dùng', desc: 'Xử lý sự cố, bảo vệ tài khoản, hạn chế rủi ro gian lận.' },
    ],
  },
  '2016': {
    bannerTitle: 'Tận tâm bảo vệ tương lai<br />Chuẩn mực dịch vụ bảo hiểm quốc tế',
    bannerDesc: 'Chỉ huy trung tâm CallCenter giải quyết quyền lợi bảo hiểm PruLife, nâng cao chỉ số NPS và đảm bảo tính nhân văn trong từng tương tác khách hàng.',
    gradient: 'from-rose-800 via-red-700 to-rose-900',
    pillars: [
      { title: 'Quản lý CallCenter Bảo Hiểm', desc: 'Dẫn dắt đội ngũ tư vấn viên chuẩn mực quốc tế', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Giải quyết quyền lợi', desc: 'Xử lý bồi thường và thủ tục hợp đồng minh bạch', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Đo lường NPS & CSAT', desc: 'Duy trì chỉ số hài lòng khắt khe từ tập đoàn Prudential', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Văn hóa thấu cảm', desc: 'Đặt sự an tâm của khách hàng lên vị trí ưu tiên hàng đầu', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Tỷ lệ tiếp nhận cuộc gọi CallCenter đạt 95%, đo lường NPS chặt chẽ.' },
      { title: 'Bảo mật thông tin hợp đồng', desc: 'Tuân thủ quy định bảo mật thông tin bảo hiểm nhân thọ quốc tế.' },
    ],
  },
  '2018': {
    bannerTitle: 'Kiến tạo trải nghiệm tài chính số<br />Phục vụ 31 Triệu+ người dùng',
    bannerDesc: 'Dẫn dắt trung tâm CSKH 60+ nhân sự, tối ưu hóa tỷ lệ SLA 98.6% và CSAT 98.2%, phục vụ thanh toán không tiền mặt cho hàng triệu người tiêu dùng.',
    gradient: 'from-pink-700 via-rose-600 to-purple-800',
    pillars: [
      { title: 'Chăm sóc 31M+ Người dùng', desc: 'Quản lý trung tâm CSKH Ví MoMo 60 nhân sự', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'SLA 98.6% & CSAT 98.2%', desc: 'Chỉ số đo lường dịch vụ hàng đầu ngành FinTech', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Bảo mật giao dịch số', desc: 'Kiểm soát rủi ro gian lận và tra soát tiền tệ 24/7', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Chuyển đổi số thanh toán', desc: 'Thúc đẩy lối sống không tiền mặt tiện lợi tại VN', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Duy trì SLA phản hồi đa kênh > 98.6%, CSAT đạt 98.2% trên 31M ví.' },
      { title: 'Bảo mật giao dịch tài chính', desc: 'Phòng chống gian lận, bảo vệ số dư và giải quyết tra soát giao dịch 24/7.' },
    ],
  },
  '2023': {
    bannerTitle: 'Chuyển đổi số thương mại truyền thống<br />Hệ sinh thái B2B FinTech & Chợ Số',
    bannerDesc: 'Xây dựng hệ thống CSKH số cho ECO SCC và Chợ Số Finviet, số hóa hàng chục ngàn đại lý tạp hóa truyền thống với quy trình chuẩn hóa cao.',
    gradient: 'from-amber-600 via-orange-600 to-yellow-700',
    pillars: [
      { title: 'Vận hành ECO SCC & Chợ Số', desc: 'Kết nối mạng lưới 30.000+ điểm bán lẻ tạp hóa', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Xây dựng SOP FinTech B2B', desc: 'Quy chuẩn hóa quy trình phân phối và hoàn tiền', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Tích hợp đa kênh Omnichannel', desc: 'Tổng đài, Zalo OA, Ticket đồng bộ thời gian thực', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Đồng hành cùng tiểu thương', desc: 'Số hóa và tối ưu nguồn thu cho các đại lý bán lẻ', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Phục vụ mạng lưới 30.000+ điểm bán lẻ ECO SCC với thời gian giải quyết < 15 phút.' },
      { title: 'An toàn dữ liệu B2B', desc: 'Kiểm soát rủi ro luồng tiền ví điện tử và dòng hàng hóa trên Chợ Số.' },
    ],
  },
  '2026': {
    bannerTitle: 'Chiến lược CX toàn diện 2026+<br />Tích hợp AI Agents & Tự động hóa CRM',
    bannerDesc: 'Định hình kiến trúc trải nghiệm khách hàng tương lai, tích hợp AI Agents, CRM tự động hóa và phát triển văn hóa phụng sự lấy khách hàng làm trọng tâm.',
    gradient: 'from-blue-700 via-indigo-600 to-cyan-800',
    pillars: [
      { title: 'Chiến lược CX Toàn Diện', desc: 'Định vị trải nghiệm là lợi thế cạnh tranh cốt lõi', icon: 'user-check', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/60' },
      { title: 'Tích hợp AI Agents & VoiceBot', desc: 'Tự động hóa 60% tác vụ và hỗ trợ tức thì 24/7', icon: 'headphones', color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/60' },
      { title: 'Kiến trúc tự động hóa CRM', desc: 'Đồng bộ hóa 12 phân hệ vận hành doanh nghiệp', icon: 'shield', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/60' },
      { title: 'Tối đa hóa giá trị CLV', desc: 'Gắn kết khách hàng dài hạn và tăng trưởng bền vững', icon: 'heart-handshake', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/60' },
    ],
    commitments: [
      { title: 'Cam kết chất lượng', desc: 'Ứng dụng AI CRM tự động hóa giúp giảm 40% thời gian xử lý yêu cầu khách hàng.' },
      { title: 'Chiến lược CX dẫn đầu', desc: 'Tối đa hóa giá trị vòng đời khách hàng (CLV) và gắn kết thương hiệu.' },
    ],
  },
};

export interface ExperienceViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
  onNavigateTab?: (tabIndex: number) => void;
  activeKey?: string;
  onActiveKeyChange?: (key: string) => void;
  showJobCard?: boolean;
  onShowJobCardChange?: (show: boolean) => void;
  onOpenProjectFromJob?: (projectId?: string) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({ 
  currentTheme = 'liquid-glass',
  onShowNotification,
  onNavigateTab,
  activeKey: activeKeyProp,
  onActiveKeyChange,
  showJobCard: showJobCardProp,
  onShowJobCardChange,
  onOpenProjectFromJob,
}) => {
  const { showToast } = useToast();
  const { isDark: themeIsDark, cardStyle } = useTheme();
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond';
  const isBrownLeather = cardStyle === 'cowhide-leather';
  const isDarkLeather = false;
  const isWalnutWood = cardStyle === 'walnut-wood';
  const isLeather = isBrownLeather || isDarkLeather;
  const isDarkSurface = isDark && !isLeather && !isWalnutWood;
  const isDarkCardText = isDarkSurface || isLeather || isWalnutWood;

  const [internalActiveKey, setInternalActiveKey] = useState<string>(activeKeyProp || '2002');
  const [internalShowJobCard, setInternalShowJobCard] = useState<boolean>(Boolean(showJobCardProp));

  const activeKey = activeKeyProp !== undefined ? activeKeyProp : internalActiveKey;
  const showJobCard = showJobCardProp !== undefined ? showJobCardProp : internalShowJobCard;

  const setActiveKey = (next: string) => {
    setInternalActiveKey(next);
    onActiveKeyChange?.(next);
  };
  const setShowJobCard = (next: boolean) => {
    setInternalShowJobCard(next);
    onShowJobCardChange?.(next);
  };

  // Tab 5 Kinh nghiệm chỉ có 1 Slide duy nhất (Lịch sử công tác 8 mốc)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 5, slide: 0 },
      })
    );
  }, []);

  const [carouselSlideIdx, setCarouselSlideIdx] = useState<number>(0);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState<boolean>(false);

  const prefersReducedMotionHook = useReducedMotion();

  const experienceMainCardRef = useRef<HTMLDivElement | null>(null);
  const milestoneRefs = useRef<Record<string, HTMLElement | null>>({});
  const [morphRect, setMorphRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [animPhase, setAnimPhase] = useState<'idle' | 'entering' | 'open' | 'closing'>('idle');
  const [originMilestoneKey, setOriginMilestoneKey] = useState<string | null>(null);
  const [isBoardDimmed, setIsBoardDimmed] = useState<boolean>(false);

  const computeTargetBounds = useCallback(() => {
    const hostEl = experienceMainCardRef.current;
    if (!hostEl) return null;
    return {
      top: 0,
      left: 0,
      width: hostEl.clientWidth,
      height: hostEl.clientHeight,
    };
  }, []);

  // Unified 5-state 3D Origami machine: folded -> partial -> unfolding -> expanded -> folding -> folded
  const [foldPhase, setFoldPhase] = useState<OrigamiFoldPhase>(() =>
    Boolean(showJobCardProp) ? 'expanded' : 'folded'
  );
  const [selectedFoldIdx, setSelectedFoldIdx] = useState<number | null>(null);
  const [mobileSlideIdx, setMobileSlideIdx] = useState<number>(0);
  const [origamiTargetIdx, setOrigamiTargetIdx] = useState<number>(0);
  const [isClosingDetailContent, setIsClosingDetailContent] = useState<boolean>(false);
  const [isMobileFoldView, setIsMobileFoldView] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [experienceViewMode, setExperienceViewMode] = useState<'origami' | 'slider'>('slider');

  const isFoldLocked = foldPhase === 'unfolding' || foldPhase === 'folding';
  const unfoldingFoldIdx = foldPhase === 'unfolding' ? origamiTargetIdx : null;

  const boardRef = useRef<HTMLElement | null>(null);
  const detailCardRef = experienceMainCardRef;
  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const didDragRef = useRef<boolean>(false);
  const lastWheelTimeRef = useRef<number>(0);
  const unfoldTimerRef = useRef<number | null>(null);
  const foldExitTimerRef = useRef<number | null>(null);
  const foldBackTimerRef = useRef<number | null>(null);
  const singleClickTimerRef = useRef<number | null>(null);

  const clearOrigamiTimers = () => {
    if (unfoldTimerRef.current !== null) {
      window.clearTimeout(unfoldTimerRef.current);
      unfoldTimerRef.current = null;
    }
    if (foldExitTimerRef.current !== null) {
      window.clearTimeout(foldExitTimerRef.current);
      foldExitTimerRef.current = null;
    }
    if (foldBackTimerRef.current !== null) {
      window.clearTimeout(foldBackTimerRef.current);
      foldBackTimerRef.current = null;
    }
    if (singleClickTimerRef.current !== null) {
      window.clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearOrigamiTimers();
    };
  }, []);

  // Sync external showJobCard prop if toggled externally
  useEffect(() => {
    if (showJobCard && foldPhase !== 'expanded' && foldPhase !== 'folding') {
      setFoldPhase('expanded');
      setIsClosingDetailContent(false);
    } else if (!showJobCard && foldPhase === 'expanded') {
      setFoldPhase('folded');
      setSelectedFoldIdx(null);
      setIsClosingDetailContent(false);
    }
  }, [showJobCard, foldPhase]);

  const isReducedMotionActive = () =>
    Boolean(prefersReducedMotionHook) ||
    (typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches));

  const handleCloseJobCard = () => {
    if (animPhase === 'closing' || !showJobCard) return;
    if (singleClickTimerRef.current !== null) {
      window.clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }

    SoundEngine.playTap();
    clearOrigamiTimers();
    const reduced = isReducedMotionActive();

    setIsBoardDimmed(false);
    setIsClosingDetailContent(false);
    setFoldPhase('folded');
    setSelectedFoldIdx(null);

    if (reduced) {
      setShowJobCard(false);
      setAnimPhase('idle');
      setMorphRect(null);
      setOriginMilestoneKey(null);
      return;
    }

    setAnimPhase('closing');
    setShowJobCard(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPhotoLightboxOpen) {
          setIsPhotoLightboxOpen(false);
          return;
        }
        if (showJobCard && foldPhase === 'expanded') {
          handleCloseJobCard();
          return;
        }
        if (!showJobCard && foldPhase === 'partial') {
          SoundEngine.playTap();
          setSelectedFoldIdx(null);
          setFoldPhase('folded');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard, isPhotoLightboxOpen, foldPhase]);

  const activeMilestone = EXPERIENCE_MILESTONES[activeKey] || EXPERIENCE_MILESTONES['2013'];

  const [failedPhotoSrcs, setFailedPhotoSrcs] = useState<Record<string, boolean>>({});
  const [failedBannerKeys, setFailedBannerKeys] = useState<Record<string, boolean>>({});
  const [bannerImgError, setBannerImgError] = useState<boolean>(false);

  useEffect(() => {
    setFailedPhotoSrcs({});
    setBannerImgError(false);
    if (showJobCard && detailCardRef.current) {
      detailCardRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeKey, showJobCard]);

  const handleOpenJobCard = (key: string, idxOverride?: number) => {
    if (isFoldLocked) return;
    clearOrigamiTimers();

    const matchedIdx =
      typeof idxOverride === 'number'
        ? idxOverride
        : roadmapCards.findIndex((c) => c.key === key || (key === '2014' && c.key === '2013'));

    const resolvedIdx = matchedIdx >= 0 ? matchedIdx : 0;
    setSelectedFoldIdx(resolvedIdx);
    setMobileSlideIdx(resolvedIdx);
    setOrigamiTargetIdx(resolvedIdx);
    setActiveKey(key);
    setIsClosingDetailContent(false);
    setOriginMilestoneKey(key);

    const hostEl = experienceMainCardRef.current;
    const originEl =
      milestoneRefs.current[key] ||
      (typeof document !== 'undefined'
        ? (document.querySelector(`[data-milestone-key="${key}"].active`) as HTMLElement | null) ||
          (document.querySelector(`[data-milestone-key="${key}"]`) as HTMLElement | null) ||
          document.getElementById(`milestone-card-${key}`)
        : null);
    const targetBounds = computeTargetBounds();
    const prefersReducedMotion = isReducedMotionActive();

    if (!prefersReducedMotion && hostEl && originEl) {
      const hostRect = hostEl.getBoundingClientRect();
      const cardRect = originEl.getBoundingClientRect();
      if (cardRect.width > 0 && cardRect.height > 0) {
        setMorphRect({
          top: cardRect.top - hostRect.top,
          left: cardRect.left - hostRect.left,
          width: cardRect.width,
          height: cardRect.height,
        });
      } else {
        setMorphRect(targetBounds || null);
      }
    } else {
      setMorphRect(targetBounds || null);
    }

    setIsBoardDimmed(true);
    setAnimPhase('open');
    setFoldPhase('expanded');
    setShowJobCard(true);
    showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
  };

  const handleDesktopFoldClick = (itemKey: string, idx: number) => {
    if (didDragRef.current || isFoldLocked) return;

    // If clicking a folded milestone: immediately open partially (State 1 -> State 2)
    if (selectedFoldIdx !== idx || foldPhase !== 'partial') {
      if (singleClickTimerRef.current !== null) {
        window.clearTimeout(singleClickTimerRef.current);
        singleClickTimerRef.current = null;
      }
      SoundEngine.playTap();
      setSelectedFoldIdx(idx);
      setMobileSlideIdx(idx);
      setActiveKey(itemKey);
      setFoldPhase('partial');
      return;
    }

    // Already in partial unfold: debounce single click so Double Click unfolds fully without folding back first
    if (singleClickTimerRef.current !== null) {
      window.clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
      SoundEngine.playTap();
      handleOpenJobCard(itemKey, idx);
      return;
    }

    singleClickTimerRef.current = window.setTimeout(() => {
      singleClickTimerRef.current = null;
      SoundEngine.playTap();
      setSelectedFoldIdx(null);
      setFoldPhase('folded');
    }, ORIGAMI_TIMINGS.doubleClickWindowMs);
  };

  const handleDesktopFoldDoubleClick = (itemKey: string, idx: number) => {
    if (didDragRef.current || isFoldLocked) return;
    if (singleClickTimerRef.current !== null) {
      window.clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }
    SoundEngine.playTap();
    handleOpenJobCard(itemKey, idx);
  };

  // Giữ nguyên 100% dữ liệu 8 cột mốc từ website, áp dụng hệ màu & bố cục từ mẫu đính kèm
  const roadmapCards = [
    {
      key: '2002',
      yearBadge: 'Năm 2002',
      companyLine1: 'Công ty',
      companyLine2: 'Viễn thông MobiFone',
      shortName: 'Công ty Viễn thông MobiFone',
      roleSummary: 'Nhân viên CSKH',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2002']?.cardDescription || '',
      logo: COMPANY_LOGOS.mobifone,
      productSummary: 'MobiFone Di Động',
      products: [
        { name: 'MobiFone', logo: COMPANY_LOGOS.mobifone },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.mobifone,
          fallback: COMPANY_LOGOS.mobifone,
          alt: 'Logo Mobifone',
        },
      ],
      accentColor: '#06629E',
      darkAccentColor: '#38BDF8',
      blockGradient: 'linear-gradient(to bottom, #0E7EC4, #06629E)',
      colBgGradient: 'linear-gradient(to bottom, #FFFFFF, #F7F9FC)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.84), rgba(23, 33, 52, 0.88))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(126, 76, 33, 0.90), rgba(92, 52, 18, 0.94))',
    },
    {
      key: '2007',
      yearBadge: 'Năm 2007',
      companyLine1: 'Công ty',
      companyLine2: 'Viễn Liên V247',
      shortName: 'Công ty Viễn Liên V247',
      roleSummary: 'Giám sát CSKH',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2007']?.cardDescription || '',
      logo: COMPANY_LOGOS.v247,
      productSummary: 'Call 247 Quốc Tế',
      products: [
        { name: 'Call 247', logo: COMPANY_LOGOS.v247 },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.v247,
          fallback: COMPANY_LOGOS.v247,
          alt: 'Logo V247',
        },
      ],
      accentColor: '#E37E12',
      darkAccentColor: '#FB923C',
      blockGradient: 'linear-gradient(to bottom, #F99B2A, #E37E12)',
      colBgGradient: 'linear-gradient(to bottom, #F9FBFD, #F0F4F8)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(20, 29, 48, 0.86), rgba(30, 41, 59, 0.90))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(112, 65, 27, 0.92), rgba(78, 43, 14, 0.96))',
    },
    {
      key: '2011',
      yearBadge: 'Năm 2011',
      companyLine1: 'Công ty CP',
      companyLine2: 'Băng thông Rộng LBC',
      shortName: 'Công ty CP Băng thông Rộng LBC',
      roleSummary: 'Trưởng phòng (Quy mô nhỏ)',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2011']?.cardDescription || '',
      logo: COMPANY_LOGOS.lbc,
      productSummary: 'Truyền hình Cáp HTVC',
      products: [
        { name: 'HTVC', logo: COMPANY_LOGOS.htvc },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.lbc,
          fallback: COMPANY_LOGOS.lbc,
          alt: 'Logo LBC',
        },
        {
          src: COMPANY_LOGOS.htvc,
          fallback: COMPANY_LOGOS.htvc,
          alt: 'Logo HTVC',
        },
      ],
      accentColor: '#0D9488',
      darkAccentColor: '#2DD4BF',
      blockGradient: 'linear-gradient(to bottom, #0D9488, #0F766E)',
      colBgGradient: 'linear-gradient(to bottom, #F3F6FA, #E8EEF4)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.84), rgba(23, 33, 52, 0.88))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(126, 76, 33, 0.90), rgba(92, 52, 18, 0.94))',
    },
    {
      key: '2013',
      yearBadge: 'Năm 2013',
      companyLine1: 'Công ty cổ phần',
      companyLine2: 'Vietnam eSport',
      shortName: 'Công ty cổ phần Vietnam eSport',
      roleSummary: 'Trưởng phòng cấp cao',
      headcountLabel: '129–130 Nhân sự',
      description: EXPERIENCE_MILESTONES['2013']?.cardDescription || '',
      logo: COMPANY_LOGOS.ved,
      productSummary: 'Shopee · Garena · AirPay · GCafe',
      products: [
        { name: 'VED', logo: COMPANY_LOGOS.ved },
        { name: 'Garena', logo: COMPANY_LOGOS.garena },
        { name: 'GCafe', logo: COMPANY_LOGOS.gcafe },
        { name: 'ShopeePay', logo: COMPANY_LOGOS.shopeepay },
        { name: 'Shopee', logo: COMPANY_LOGOS.shopee },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.ved,
          fallback: COMPANY_LOGOS.ved,
          alt: 'Logo VED',
        },
        {
          src: COMPANY_LOGOS.garena,
          fallback: COMPANY_LOGOS.garena,
          alt: 'Logo Garena',
        },
        {
          src: COMPANY_LOGOS.gcafe,
          fallback: COMPANY_LOGOS.gcafe,
          alt: 'Logo GCafe',
        },
        {
          src: COMPANY_LOGOS.shopeepay,
          fallback: COMPANY_LOGOS.shopeepay,
          alt: 'Logo AirPay ShopeePay',
        },
        {
          src: COMPANY_LOGOS.shopee,
          fallback: COMPANY_LOGOS.shopee,
          alt: 'Logo Shopee',
        },
      ],
      accentColor: '#475569',
      darkAccentColor: '#CBD5E1',
      blockGradient: 'linear-gradient(to bottom, #64748B, #475569)',
      colBgGradient: 'linear-gradient(to bottom, #EDF1F7, #E1E8F0)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(20, 29, 48, 0.86), rgba(30, 41, 59, 0.90))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(112, 65, 27, 0.92), rgba(78, 43, 14, 0.96))',
    },
    {
      key: '2016',
      yearBadge: 'Năm 2016',
      companyLine1: 'Công ty BNNT',
      companyLine2: 'Prudential VN',
      shortName: 'Công ty BNNT Prudential VN',
      roleSummary: 'Trưởng Phòng CallCenter',
      headcountLabel: '12 NS + 40 Tư vấn',
      description: EXPERIENCE_MILESTONES['2016']?.cardDescription || '',
      logo: COMPANY_LOGOS.prudential,
      productSummary: 'Bảo hiểm PruLife',
      products: [
        { name: 'Prudential', logo: COMPANY_LOGOS.prudential },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.prudential,
          fallback: COMPANY_LOGOS.prudential,
          alt: 'Logo Prudential Vietnam',
        },
      ],
      accentColor: '#DC2626',
      darkAccentColor: '#F87171',
      blockGradient: 'linear-gradient(to bottom, #EF4444, #DC2626)',
      colBgGradient: 'linear-gradient(to bottom, #E7ECF3, #DAE2EC)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.84), rgba(23, 33, 52, 0.88))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(126, 76, 33, 0.90), rgba(92, 52, 18, 0.94))',
    },
    {
      key: '2018',
      yearBadge: 'Năm 2018',
      companyLine1: 'Công ty cổ phần',
      companyLine2: 'Dịch vụ Mservice',
      shortName: 'Công ty cổ phần Dịch vụ Mservice',
      roleSummary: 'Trưởng phòng cấp cao',
      headcountLabel: '60+ NS & BPO',
      description: EXPERIENCE_MILESTONES['2018']?.cardDescription || '',
      logo: COMPANY_LOGOS.momo,
      productSummary: 'Siêu ứng dụng Ví MoMo',
      products: [
        { name: 'Ví MoMo', logo: COMPANY_LOGOS.momo },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.momo,
          fallback: COMPANY_LOGOS.momo,
          alt: 'Logo MoMo',
        },
      ],
      accentColor: '#D1007A',
      darkAccentColor: '#F472B6',
      blockGradient: 'linear-gradient(to bottom, #F50893, #D1007A)',
      colBgGradient: 'linear-gradient(to bottom, #E0E7EF, #D3DCE7)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(20, 29, 48, 0.86), rgba(30, 41, 59, 0.90))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(112, 65, 27, 0.92), rgba(78, 43, 14, 0.96))',
    },
    {
      key: '2023',
      yearBadge: 'Năm 2023',
      companyLine1: 'Công ty cổ phần',
      companyLine2: 'Công nghệ Finviet',
      shortName: 'Công ty cổ phần Công nghệ Finviet',
      roleSummary: 'Trưởng Phòng CSKH',
      headcountLabel: '17 Nhân sự',
      description: EXPERIENCE_MILESTONES['2023']?.cardDescription || '',
      logo: COMPANY_LOGOS.finviet,
      productSummary: 'Chợ Số Finviet',
      products: [
        { name: 'Finviet', logo: COMPANY_LOGOS.finviet },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.finviet,
          fallback: COMPANY_LOGOS.finviet,
          alt: 'Logo Finviet',
        },
      ],
      accentColor: '#C29300',
      darkAccentColor: '#FACC15',
      blockGradient: 'linear-gradient(to bottom, #FAD022, #E6B509)',
      colBgGradient: 'linear-gradient(to bottom, #DAE1EB, #CCD6E2)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.84), rgba(23, 33, 52, 0.88))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(126, 76, 33, 0.90), rgba(92, 52, 18, 0.94))',
    },
    {
      key: '2026',
      yearBadge: 'Năm 2026+',
      companyLine1: 'Sẵn sàng',
      companyLine2: 'Cho thử thách mới',
      shortName: 'Sẵn sàng Cho thử thách mới',
      roleSummary: 'Trưởng phòng / GĐ CX',
      headcountLabel: '100–150+ Nhân sự',
      description: EXPERIENCE_MILESTONES['2026']?.cardDescription || '',
      logo: COMPANY_LOGOS.powerservice,
      productSummary: 'Power Service • CS Strategy',
      products: [
        { name: 'Power Service', logo: COMPANY_LOGOS.powerservice },
      ],
      logos: [
        {
          src: COMPANY_LOGOS.powerservice,
          fallback: COMPANY_LOGOS.powerservice,
          alt: 'Logo Power Service',
        },
      ],
      accentColor: '#0A74B8',
      darkAccentColor: '#60A5FA',
      blockGradient: 'linear-gradient(to bottom, #0E7EC4, #06629E)',
      colBgGradient: 'linear-gradient(to bottom, #D4DCE7, #C5D0DD)',
      colBgGradientDark: 'linear-gradient(to bottom, rgba(20, 29, 48, 0.86), rgba(30, 41, 59, 0.90))',
      colBgGradientLeather: 'linear-gradient(to bottom, rgba(112, 65, 27, 0.92), rgba(78, 43, 14, 0.96))',
    },
  ];

  // Tự động phát hiện chế độ Mobile (< 768px) để giữ trải nghiệm đọc rõ nét
  useEffect(() => {
    const updateFoldMode = () => {
      const boardWidth = boardRef.current?.clientWidth || window.innerWidth;
      setIsMobileFoldView(boardWidth < 768);
    };
    updateFoldMode();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && boardRef.current) {
      ro = new ResizeObserver(updateFoldMode);
      ro.observe(boardRef.current);
    }
    window.addEventListener('resize', updateFoldMode);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateFoldMode);
    };
  }, [showJobCard]);

  // Chromatic Folds: Keep --fold-angle at 0deg so paper pleats stand straight vertically facing directly outward
  useEffect(() => {
    if (showJobCard || isMobileFoldView) return;
    const container = boardRef.current?.querySelector('#experience-chromatic-folds');
    if (!container) return;
    const swatches = Array.from(container.querySelectorAll<HTMLElement>('.exp-fold-swatch'));
    swatches.forEach((swatch) => {
      swatch.style.setProperty('--fold-angle', '0deg');
    });
  }, [showJobCard, isMobileFoldView, roadmapCards.length]);

  const maxFoldIdx = roadmapCards.length - 1;
  const activeFoldIdx = selectedFoldIdx;
  const currentNavIdx = selectedFoldIdx !== null ? selectedFoldIdx : mobileSlideIdx;

  const selectPartialMilestone = (nextIdx: number) => {
    if (isFoldLocked) return;
    const clamped = Math.max(0, Math.min(maxFoldIdx, nextIdx));
    setSelectedFoldIdx(clamped);
    setMobileSlideIdx(clamped);
    setFoldPhase('partial');
    const card = roadmapCards[clamped];
    if (card) setActiveKey(card.key);
  };

  const handlePrev = () => {
    if (isFoldLocked) return;
    SoundEngine.playTap();
    if (selectedFoldIdx === null && !isMobileFoldView) {
      selectPartialMilestone(Math.max(0, mobileSlideIdx));
      return;
    }
    selectPartialMilestone(Math.max(0, currentNavIdx - 1));
  };

  const handleNext = () => {
    if (isFoldLocked) return;
    SoundEngine.playTap();
    if (selectedFoldIdx === null && !isMobileFoldView) {
      selectPartialMilestone(Math.min(maxFoldIdx, mobileSlideIdx));
      return;
    }
    selectPartialMilestone(Math.min(maxFoldIdx, currentNavIdx + 1));
  };

  const handleWheelScroll = (e: React.WheelEvent<HTMLElement>) => {
    if (isFoldLocked) return;
    const isVerticalWheel = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    if (isVerticalWheel && e.target instanceof Element) {
      const scrollArea = e.target.closest('.exp-milestone-scroll') as HTMLElement | null;
      if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight + 2) {
        const canScrollDown =
          e.deltaY > 0 && scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 2;
        const canScrollUp = e.deltaY < 0 && scrollArea.scrollTop > 2;
        if (canScrollDown || canScrollUp) {
          return;
        }
      }
    }

    const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(dominantDelta) < 12) return;

    const now = Date.now();
    if (now - lastWheelTimeRef.current < 260) return;
    lastWheelTimeRef.current = now;

    if (dominantDelta > 0) {
      selectPartialMilestone(Math.min(maxFoldIdx, currentNavIdx + 1));
    } else {
      selectPartialMilestone(Math.max(0, currentNavIdx - 1));
    }
  };

  const handlePointerDown = (clientX: number, clientY: number, target: EventTarget | null) => {
    didDragRef.current = false;
    if (isFoldLocked) return;
    if ((target as HTMLElement | null)?.closest('button')) return;
    dragStartXRef.current = clientX;
    dragStartYRef.current = clientY;
    setIsDragging(true);
  };

  const handlePointerUp = (clientX: number, clientY: number) => {
    if (dragStartXRef.current === null) return;
    const diffX = dragStartXRef.current - clientX;
    const diffY = dragStartYRef.current !== null ? dragStartYRef.current - clientY : 0;
    if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
      didDragRef.current = true;
    }
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) && !isFoldLocked) {
      if (diffX > 0) {
        selectPartialMilestone(Math.min(maxFoldIdx, currentNavIdx + 1));
      } else {
        selectPartialMilestone(Math.max(0, currentNavIdx - 1));
      }
    }
    dragStartXRef.current = null;
    dragStartYRef.current = null;
    setIsDragging(false);
  };

  useEffect(() => {
    if (showJobCard || isFoldLocked) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        selectPartialMilestone(Math.max(0, currentNavIdx - 1));
      }
      if (e.key === 'ArrowRight') {
        selectPartialMilestone(Math.min(maxFoldIdx, currentNavIdx + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard, isFoldLocked, currentNavIdx, maxFoldIdx]);

  const normalizedActiveKey = activeKey.startsWith('2013') || activeKey === '2014-airpay' ? '2013' : activeKey;

  const isCompanyLogoAsset = (url?: string, milestoneLogo?: string) => {
    if (!url) return false;
    if (milestoneLogo && url === milestoneLogo) return true;
    return /logo_|_logo|\/logo\//i.test(url);
  };

  const getMilestonePhotosList = (milestone?: (typeof EXPERIENCE_MILESTONES)[string]) => {
    if (!milestone) return [];
    const basePhotos = (milestone.photos || []).filter(
      (p) => !isCompanyLogoAsset(p.src, milestone.logo)
    );
    const safeMemoryImg =
      milestone.memoryImg && !isCompanyLogoAsset(milestone.memoryImg, milestone.logo)
        ? milestone.memoryImg
        : '';
    const primaryMemoryPhoto = safeMemoryImg
      ? [
          {
            src: safeMemoryImg,
            title: milestone.company,
            desc: `${milestone.roleTitle} (${milestone.period})`,
          },
        ]
      : [];
    return [...primaryMemoryPhoto, ...basePhotos.filter((p) => p.src !== safeMemoryImg)];
  };

  const getMilestoneProductsWithServices = (
    milestone: (typeof EXPERIENCE_MILESTONES)[string],
    matchedRoadmapCard?: (typeof roadmapCards)[number]
  ) => {
    const rawProductsList =
      milestone.products && milestone.products.length > 0
        ? milestone.products.map((p) => ({
            name: p.alt.replace(/^Logo\s+/i, '').trim() || milestone.company,
            src: p.src,
          }))
        : matchedRoadmapCard?.products && matchedRoadmapCard.products.length > 0
          ? matchedRoadmapCard.products.map((p) => ({
              name: p.name,
              src: p.logo,
            }))
          : [
              {
                name: milestone.company,
                src: milestone.logo,
              },
            ];

    const resolveServicesForLogo = (productName: string, logoUrl: string): string[] => {
      const matched: string[] = [];
      const addService = (title: string) => {
        if (title && !matched.includes(title)) matched.push(title);
      };

      const normSrc = logoUrl.toLowerCase();
      const normMilestoneLogo = (milestone.logo || '').toLowerCase();
      const normName = productName.toLowerCase();

      DOMAINS_DATA.forEach((domain) => {
        const hasUrlMatch = (domain.companyLogos || []).some((cl) => {
          const clLogo = (cl.logo || '').toLowerCase();
          const clFallback = (cl.fallbackLogo || '').toLowerCase();
          return (
            (clLogo &&
              (clLogo === normSrc ||
                (rawProductsList.length === 1 && clLogo === normMilestoneLogo))) ||
            (clFallback && clFallback === normSrc)
          );
        });
        if (hasUrlMatch) {
          addService(domain.title);
        }
      });

      if (matched.length === 0) {
        const combined = `${normName} ${normSrc}`;
        if (
          combined.includes('mobifone') ||
          combined.includes('v247') ||
          combined.includes('htvc') ||
          combined.includes('lbc')
        ) {
          addService('Dịch vụ Viễn thông');
        }
        if (combined.includes('garena') || combined.includes('ved') || combined.includes('gcafe')) {
          addService('Thể thao Điện tử');
        }
        if (combined.includes('shopeepay') || combined.includes('airpay') || combined.includes('momo')) {
          addService('Thanh toán Ví Điện tử');
        } else if (combined.includes('shopee')) {
          addService('Thương mại Điện tử');
        }
        if (combined.includes('prudential')) {
          addService('Tài chính & Bảo hiểm');
        }
        if (combined.includes('finviet')) {
          addService('Thanh toán Ví Điện tử');
          addService('Thương mại Điện tử');
          addService('Tài chính & Bảo hiểm');
        }
        if (combined.includes('power') || combined.includes('powerservice')) {
          addService('Xây dựng Hệ thống');
        }
      }

      if (normName.includes('shopeepay') || normName.includes('airpay') || normSrc.includes('shopeepay')) {
        matched.sort((a, b) => (a === 'Thanh toán Ví Điện tử' ? -1 : b === 'Thanh toán Ví Điện tử' ? 1 : 0));
      } else if (normName.includes('finviet') || normSrc.includes('finviet')) {
        const priority = ['Thanh toán Ví Điện tử', 'Thương mại Điện tử', 'Tài chính & Bảo hiểm'];
        matched.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
      }

      if (matched.length === 0 && milestone.tag) {
        addService(milestone.tag);
      }
      return matched;
    };

    const productsWithServices = rawProductsList.map((prod) => ({
      ...prod,
      services: resolveServicesForLogo(prod.name, prod.src),
    }));

    const derivedServicesList = Array.from(
      new Set(productsWithServices.flatMap((prod) => prod.services))
    );

    return { productsWithServices, derivedServicesList };
  };

  const renderMilestoneColumnFrames = ({
    item,
    idx,
    milestoneData,
    resolvedAccent,
    primaryTextColor,
    secondaryTextColor,
    isMobileMode = false,
  }: {
    item: (typeof roadmapCards)[number];
    idx: number;
    milestoneData?: (typeof EXPERIENCE_MILESTONES)[string];
    resolvedAccent: string;
    primaryTextColor: string;
    secondaryTextColor: string;
    isMobileMode?: boolean;
  }) => {
    const photosList = getMilestonePhotosList(milestoneData);
    const { derivedServicesList } = milestoneData
      ? getMilestoneProductsWithServices(milestoneData, item)
      : { derivedServicesList: [] as string[] };
    const servicesText =
      derivedServicesList.length > 0
        ? derivedServicesList.join(' · ')
        : milestoneData?.tag || item.productSummary;

    const frameCardStyle: React.CSSProperties = isWalnutWood
      ? {
          background: 'rgba(34, 20, 12, 0.88)',
          borderColor: 'rgba(245, 196, 120, 0.26)',
        }
      : isDarkLeather
        ? {
            background: 'rgba(28, 22, 19, 0.90)',
            borderColor: 'rgba(245, 222, 179, 0.28)',
          }
        : isBrownLeather
        ? {
            background: 'rgba(82, 46, 16, 0.72)',
            borderColor: 'rgba(245, 222, 179, 0.30)',
          }
        : {
            background: 'var(--bg-subcard, var(--surface-tertiary-bg, rgba(255, 255, 255, 0.72)))',
            borderColor: 'var(--border-subcard, var(--border-color, rgba(148, 163, 184, 0.25)))',
          };

    const hasBannerFailed = Boolean(failedBannerKeys[item.key]);

    return (
      <div
        data-no-wheel-horizontal="true"
        style={{ padding: '15px' }}
        className={cn(
          'exp-milestone-scroll flex-1 min-h-0 flex flex-col justify-start gap-2 overflow-y-auto overscroll-y-contain touch-pan-y glass-scrollbar p-[15px]'
        )}
      >
        <div className="flex flex-col gap-2 min-w-0">
          {/* 1. KHUNG BANNER (Tăng gấp đôi chiều cao) */}
          <div
            style={{
              borderColor: frameCardStyle.borderColor,
              background: item.blockGradient,
            }}
            className="exp-bento-item-card relative w-full h-[140px] sm:h-[164px] shrink-0 rounded-[var(--radius-subcard,14px)] overflow-hidden border shadow-xs"
          >
            {!hasBannerFailed && milestoneData?.bannerUrl ? (
              <BlurUpImage
                src={milestoneData.bannerUrl}
                alt={`Banner ${item.shortName}`}
                variant="cover"
                onError={() => setFailedBannerKeys((prev) => ({ ...prev, [item.key]: true }))}
                className="w-full h-full object-cover object-center block select-none pointer-events-none"
              />
            ) : (
              <div
                style={{ background: item.blockGradient }}
                className="w-full h-full flex items-center justify-center text-white font-bold typo-h4 px-3 text-center"
              >
                {item.shortName}
              </div>
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent pointer-events-none"
            />
          </div>

          {/* 2. KHUNG TÊN CÔNG TY (Bên trái: Logo & Tên công ty tăng gấp đôi | Bên phải: Năm & Dịch vụ) */}
          <div
            style={frameCardStyle}
            className="exp-bento-item-card w-full shrink-0 rounded-[var(--radius-subcard,14px)] border px-3 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 min-w-0"
          >
            {/* Bên trái: Logo và tên công ty (tăng gấp đôi kích thước) */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex flex-row items-center justify-start shrink-0">
                {item.logos.map((logo, logoIdx) => (
                  <CircularLogo
                    key={logoIdx}
                    logo={logo}
                    isStacked={item.logos.length > 1}
                    index={logoIdx}
                    total={item.logos.length}
                    companyName={item.shortName}
                    onOpenDetail={() => handleOpenJobCard(item.key, idx)}
                  />
                ))}
              </div>
              <h3
                style={{
                  color: primaryTextColor,
                  fontSize: 'calc(var(--fs-body-sm, 13.5px) * 2)',
                  lineHeight: 1.18,
                }}
                data-subcard-title="true"
                className="subcard-title-synced font-bold break-words flex flex-col justify-center min-w-0 flex-1 select-none m-0"
              >
                <span className="leading-tight flex items-center gap-1.5 min-w-0">
                  <Building2 className="w-7 h-7 shrink-0 opacity-80" />
                  <span className="truncate">{item.companyLine1}</span>
                </span>
                {item.companyLine2 && <span className="block leading-tight truncate">{item.companyLine2}</span>}
              </h3>
            </div>

            {/* Bên phải: Năm và dịch vụ */}
            <div className="flex flex-col items-start sm:items-end justify-center text-left sm:text-right shrink-0 sm:max-w-[46%] min-w-0 gap-0.5">
              <span
                style={{ color: resolvedAccent }}
                className="inline-flex items-center gap-1 typo-caption font-bold tabular-nums leading-tight"
              >
                <Calendar className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                <span>
                  {item.yearBadge}
                  {milestoneData?.tenure ? ` · ${milestoneData.tenure}` : ''}
                </span>
              </span>
              <span
                style={{ color: secondaryTextColor }}
                className="typo-badge font-semibold leading-tight break-words line-clamp-1"
                title={servicesText}
              >
                {servicesText}
              </span>
            </div>
          </div>

          {/* 3. KHUNG THÔNG TIN (Thời gian, Vị trí, Quản lý) */}
          <div
            style={frameCardStyle}
            className="exp-bento-item-card w-full shrink-0 rounded-[var(--radius-subcard,14px)] border px-2.5 py-1.5 flex flex-col gap-1 typo-caption font-normal min-w-0"
          >
            {milestoneData && (
              <div className="flex items-start gap-1.5 leading-[1.3] min-w-0">
                <span
                  style={{ color: resolvedAccent }}
                  className="font-bold shrink-0 inline-flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                  <span>Thời gian:</span>
                </span>
                <span style={{ color: primaryTextColor }} className="font-medium break-words min-w-0">
                  {milestoneData.cardYearLabel} ({milestoneData.tenure})
                </span>
              </div>
            )}

            <div className="flex items-start gap-1.5 leading-[1.3] min-w-0">
              <span
                style={{ color: resolvedAccent }}
                className="font-bold shrink-0 inline-flex items-center gap-1"
              >
                <Briefcase className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                <span>Vị trí:</span>
              </span>
              <span style={{ color: primaryTextColor }} className="font-medium break-words min-w-0">
                {item.roleSummary}
              </span>
            </div>

            <div className="flex items-start gap-1.5 leading-[1.3] min-w-0">
              <span
                style={{ color: resolvedAccent }}
                className="font-bold shrink-0 inline-flex items-center gap-1"
              >
                <Users className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                <span>Quản lý:</span>
              </span>
              <span style={{ color: primaryTextColor }} className="font-medium break-words min-w-0">
                {item.headcountLabel}
              </span>
            </div>
          </div>

          {/* 4. KHUNG MÔ TẢ */}
          <div
            style={frameCardStyle}
            className="exp-bento-item-card w-full shrink-0 rounded-[var(--radius-subcard,14px)] border px-2.5 py-1.5 flex flex-col gap-0.5 min-w-0"
          >
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 shrink-0" style={{ color: resolvedAccent }} />
              <span style={{ color: resolvedAccent }} className="typo-caption font-bold">
                Mô tả
              </span>
            </div>
            <p
              style={{ color: primaryTextColor }}
              title={item.description}
              className="typo-caption font-normal leading-[1.36] break-words line-clamp-3 m-0"
            >
              {item.description}
            </p>
          </div>

          {/* 5. KHUNG HÌNH ẢNH KỶ NIỆM */}
          <div
            style={frameCardStyle}
            className="exp-bento-item-card w-full shrink-0 rounded-[var(--radius-subcard,14px)] border px-2.5 py-1.5 flex flex-col gap-1.5 min-w-0"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <Camera className="w-3 h-3 shrink-0" style={{ color: resolvedAccent }} />
                <span style={{ color: resolvedAccent }} className="typo-caption font-bold truncate">
                  Hình ảnh kỷ niệm
                </span>
              </div>
              {photosList.length > 0 && (
                <span
                  style={{ color: secondaryTextColor }}
                  className="typo-badge font-semibold tabular-nums shrink-0"
                >
                  {photosList.length} ảnh
                </span>
              )}
            </div>

            {photosList.length > 0 ? (
              <div
                className={cn(
                  'grid gap-1.5',
                  photosList.length === 1
                    ? 'grid-cols-1'
                    : photosList.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                )}
              >
                {photosList.slice(0, 3).map((photo, pIdx) => {
                  const hasImgFailed = Boolean(failedPhotoSrcs[photo.src]);
                  return (
                    <button
                      key={`${item.key}-col-photo-${pIdx}`}
                      type="button"
                      data-media-card="image"
                      onClick={(e) => {
                        e.stopPropagation();
                        SoundEngine.playTap();
                        setActiveKey(item.key);
                        setCarouselSlideIdx(pIdx);
                        setIsPhotoLightboxOpen(true);
                      }}
                      aria-label={`Phóng to hình kỷ niệm ${pIdx + 1}: ${photo.title || item.shortName}`}
                      className={cn(
                        'exp-bento-rect-btn group/photo relative w-full overflow-hidden rounded-[8px] border p-0 text-left cursor-pointer transition-transform duration-200 hover:scale-[1.02]',
                        isMobileMode ? 'h-[68px]' : 'h-[54px] sm:h-[60px]'
                      )}
                      style={{ borderColor: frameCardStyle.borderColor }}
                    >
                      {!hasImgFailed ? (
                        <BlurUpImage
                          src={photo.src}
                          alt={photo.title || item.shortName}
                          variant="cover"
                          onError={() =>
                            setFailedPhotoSrcs((prev) => ({ ...prev, [photo.src]: true }))
                          }
                          className="w-full h-full object-cover block"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1 bg-slate-200/50 dark:bg-slate-800/70">
                          <Camera className="w-3.5 h-3.5" style={{ color: resolvedAccent }} />
                          <span
                            style={{ color: secondaryTextColor }}
                            className="typo-badge truncate max-w-full"
                          >
                            {photo.title || item.shortName}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-end justify-end p-1">
                        <ZoomIn className="w-3 h-3 text-white shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: secondaryTextColor }} className="typo-caption m-0">
                Chưa có hình ảnh kỷ niệm cho cột mốc này.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="experience-page-container"
      data-no-wheel-horizontal="true"
      data-element-name="Trang Hành trình sự nghiệp"
      data-element-type="container"
      data-element-page="experience"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-hidden select-none text-[var(--text-primary)] font-play text-left rounded-none box-border"
    >
      <div
        id="experience-cards-track"
        data-element-name="Track căn giữa Hành trình sự nghiệp"
        data-element-type="container"
        data-element-page="experience"
        data-element-parent="experience-page-container"
        className="page-cards-track"
      >
        <div
          ref={experienceMainCardRef}
          id="experience-main-card"
          data-main-card="true"
          data-floating-surface="main"
          data-detail-open={showJobCard ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Hành trình sự nghiệp"
          data-element-type="card"
          data-element-page="experience"
          data-element-parent="experience-cards-track"
          className={cn(
            'page-main-card floating-glass-surface floating-surface--main relative flex flex-col items-stretch justify-start select-none text-[var(--text-primary)] glass-scrollbar font-play text-left box-border rounded-[var(--radius-main,14px)] w-full h-full',
            showJobCard ? 'overflow-y-auto overflow-x-hidden p-[15px] gap-[15px]' : 'overflow-hidden p-0 gap-0'
          )}
          style={{
            padding: showJobCard ? '15px' : '0px',
            borderRadius: 'var(--radius-main, 14px)',
            gap: showJobCard ? '15px' : '0px',
          }}
        >
      {/* 3D ORIGAMI MULTI-PANEL STAGE (UNFOLDING / FOLDING BACK SEQUENCE) */}
      {(foldPhase === 'unfolding' || (foldPhase === 'folding' && !showJobCard)) && (() => {
        const stageCard = roadmapCards[origamiTargetIdx] || roadmapCards[0];
        const stageMilestone = EXPERIENCE_MILESTONES[stageCard.key];
        return (
          <OrigamiUnfoldStage
            key={`origami-stage-${foldPhase}-${stageCard.key}`}
            mode={foldPhase === 'unfolding' ? 'unfolding' : 'folding'}
            milestone={{
              key: stageCard.key,
              yearBadge: stageCard.yearBadge,
              shortName: stageCard.shortName,
              roleSummary: stageCard.roleSummary,
              tenure: stageMilestone?.tenure,
              logo: stageCard.logo,
              accentColor: stageCard.accentColor,
              blockGradient: stageCard.blockGradient,
            }}
            slotIndex={origamiTargetIdx}
            totalSlots={roadmapCards.length}
            compact={isMobileFoldView}
            isDarkSurface={isDarkSurface}
            isBrownLeather={isBrownLeather}
            isDarkLeather={isDarkLeather}
            isWalnutWood={isWalnutWood}
          />
        );
      })()}

      {/* KHUNG TIMELINE SLIDER CARD — lùi mượt theo cơ chế Expand Card khi mở chi tiết */}
      <div
        aria-hidden={showJobCard}
        className={cn(
          'w-full h-full min-h-0',
          showJobCard ? 'absolute inset-0 pointer-events-none z-0' : 'relative z-10'
        )}
      >
        <motion.div
          data-expand-motion="true"
          className="w-full h-full min-h-0"
          animate={
            isBoardDimmed || showJobCard
              ? {
                  opacity: 0,
                  scale: isReducedMotionActive() ? 1 : 0.94,
                  y: isReducedMotionActive() ? 0 : -24,
                }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={getCardSettleTransition(isReducedMotionActive())}
        >
          <ExperienceSliderView
            roadmapCards={roadmapCards.map((card) => {
              const milestone = EXPERIENCE_MILESTONES[card.key];
              return {
                ...card,
                period: milestone?.period,
                tenure: milestone?.tenure,
                roleTitle: milestone?.roleTitle || card.roleSummary,
                bannerUrl: milestone?.bannerUrl || card.logo,
              };
            })}
            activeKey={activeKey}
            onSelectMilestone={(key, idx) => {
              handleOpenJobCard(key, idx);
            }}
            isDarkSurface={isDarkSurface}
            isWalnutWood={isWalnutWood}
            isDarkLeather={isDarkLeather}
            isBrownLeather={isBrownLeather}
          />
        </motion.div>
      </div>

      {/* =====================================================================
          5. THẺ CHI TIẾT CỘT MỐC ĐANG CHỌN (BENTO GRID + EXPAND CARD SPRING)
          ===================================================================== */}
      <AnimatePresence
        onExitComplete={() => {
          setAnimPhase('idle');
          setMorphRect(null);
          setOriginMilestoneKey(null);
        }}
      >
      {showJobCard && (() => {
        const reducedMotion = isReducedMotionActive();
        const hostEl = experienceMainCardRef.current;
        const hostW = hostEl?.clientWidth || 960;
        const hostH = hostEl?.clientHeight || 560;
        const originCenterX = morphRect ? morphRect.left + morphRect.width / 2 : hostW / 2;
        const originCenterY = morphRect ? morphRect.top + morphRect.height / 2 : hostH / 2;
        const originOffsetX = morphRect ? Math.max(-180, Math.min(180, originCenterX - hostW / 2)) : 0;
        const originOffsetY = morphRect ? Math.max(-90, Math.min(90, originCenterY - hostH / 2)) : 24;
        const originScale = morphRect
          ? Math.max(0.76, Math.min(0.94, morphRect.width / Math.max(1, hostW)))
          : 0.92;
        const expandSpring = getExpandCardLayoutTransition(reducedMotion);
        const contentKey =
          activeKey === '2014' ||
          activeKey === '2015' ||
          activeKey.startsWith('2013') ||
          activeKey === '2014-airpay'
            ? '2013'
            : activeKey;
        const customContent = MILESTONE_CUSTOM_CONTENT[contentKey] || MILESTONE_CUSTOM_CONTENT['2013'];
        const narrationInfo = STORY_NARRATIONS[normalizedActiveKey];

        const photosList = getMilestonePhotosList(activeMilestone);

        // Danh sách Công việc lấy trực tiếp từ activeMilestone.tasks
        const tasksList =
          activeMilestone.tasks && activeMilestone.tasks.length > 0
            ? activeMilestone.tasks
            : [
                'Quản lý và điều hành toàn diện hoạt động phòng CSKH',
                'Thiết lập chỉ số KPI/SLA và cơ chế giám sát chất lượng',
                'Tối ưu hóa quy trình tiếp nhận và xử lý khiếu nại',
              ];

        // Danh sách Dự án lấy từ activeMilestone.projects, ánh xạ đồng bộ tiêu đề & mã số theo PROJECTS_DATA
        const projectsList = (
          activeMilestone.projects && activeMilestone.projects.length > 0
            ? activeMilestone.projects
            : [
                '1. Chuẩn hóa quy trình vận hành CSKH',
                '2. Ứng dụng giải pháp số hóa dịch vụ',
              ]
        ).map((rawProject, idx) => {
          const trimmed = rawProject.trim();
          const codeMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*[·.\-–]\s*(.+)$/);
          const rawCode = codeMatch ? codeMatch[1] : `${idx + 1}`;
          const rawTitle = codeMatch ? codeMatch[2].trim() : trimmed;
          const lowerRaw = trimmed.toLowerCase();

          let matchedProj = undefined as (typeof PROJECTS_DATA)[number] | undefined;
          if (codeMatch && rawCode.includes('.')) {
            if (lowerRaw.includes('bpo')) {
              matchedProj = PROJECTS_DATA.find((p) => p.id === 'p2_5');
            } else {
              const expectedId = `p${rawCode.replace('.', '_')}`;
              matchedProj = PROJECTS_DATA.find((p) => p.id === expectedId);
            }
          } else if (lowerRaw.includes('copilot')) {
            matchedProj = PROJECTS_DATA.find((p) => p.id === 'p5_6');
          } else if (lowerRaw.includes('auto-qa') || lowerRaw.includes('speech-to-text')) {
            matchedProj = PROJECTS_DATA.find((p) => p.id === 'p4_4');
          } else if (lowerRaw.includes('contact center')) {
            matchedProj = PROJECTS_DATA.find((p) => p.id === 'p2_2');
          }

          const displayCode = matchedProj ? matchedProj.code : rawCode;
          const displayTitle = matchedProj
            ? matchedProj.title.replace(/^[\d.]+\s*·\s*/, '').trim()
            : rawTitle;

          return {
            code: displayCode,
            title: displayTitle,
            rawTitle: matchedProj ? matchedProj.title : trimmed,
            projectId: matchedProj?.id,
          };
        });

        // Danh sách Cam kết lấy trực tiếp từ activeMilestone.commitments
        const commitmentsList =
          activeMilestone.commitments && activeMilestone.commitments.length > 0
            ? activeMilestone.commitments
            : customContent.commitments.map((c) => `${c.title}: ${c.desc}`);

        // Danh sách Kết quả đạt được lấy trực tiếp từ activeMilestone.kpis
        const kpisList = Array.isArray(activeMilestone.kpis) ? activeMilestone.kpis : [];

        const narrativeTitle = narrationInfo?.title
          ? `Năm ${activeMilestone.year} – ${narrationInfo.title}`
          : `Năm ${activeMilestone.year} – ${activeMilestone.company}`;

        const introBlocks: Array<{ title: string; desc: string }> =
          Array.isArray(activeMilestone.intro) && activeMilestone.intro.length > 0
            ? activeMilestone.intro.map((item: { title: string; desc: string }) => ({
                title: item.title,
                desc: item.desc,
              }))
            : (activeMilestone.paragraphs || []).map((para: string, idx: number) => {
                const colonIdx = para.indexOf(':');
                if (colonIdx > 0 && colonIdx < 45) {
                  return {
                    title: `${idx + 1}. ${para.slice(0, colonIdx).trim()}`,
                    desc: para.slice(colonIdx + 1).trim(),
                  };
                }
                return {
                  title: `Trọng tâm ${idx + 1}`,
                  desc: para,
                };
              });

        const philosophyText =
          activeMilestone.philosophy ||
          'Khách hàng là trung tâm — Kiến tạo giá trị dịch vụ bền vững và chuẩn hóa vận hành xuất sắc.';

        const currentRoadmapCard = roadmapCards.find(
          (c) => c.key === activeMilestone.key || c.key === activeKey
        );
        const { derivedServicesList } = getMilestoneProductsWithServices(
          activeMilestone,
          currentRoadmapCard
        );

        // Helpers ánh xạ màu & icon cho từng chip Dịch vụ hoạt động (tương thích Sáng / Tối)
        const getIndustryChipVisual = (label: string, idx: number) => {
          const lower = label.toLowerCase();
          if (lower.includes('thể thao điện tử') || lower.includes('esport') || lower.includes('game')) {
            return {
              Icon: Trophy,
              chipClass: isDarkCardText
                ? 'bg-red-500/20 border-red-400/35 text-red-100 hover:bg-red-500/30'
                : 'bg-red-50 border-red-200/90 text-red-800 hover:bg-red-100/80',
              iconClass: isDarkCardText ? 'text-red-300' : 'text-red-600',
            };
          }
          if (lower.includes('thương mại điện tử') || lower.includes('e-commerce') || lower.includes('tmđt') || lower.includes('bán lẻ')) {
            return {
              Icon: ShoppingBag,
              chipClass: isDarkCardText
                ? 'bg-orange-500/20 border-orange-400/35 text-orange-100 hover:bg-orange-500/30'
                : 'bg-orange-50 border-orange-200/90 text-orange-800 hover:bg-orange-100/80',
              iconClass: isDarkCardText ? 'text-orange-300' : 'text-orange-600',
            };
          }
          if (lower.includes('bảo hiểm')) {
            return {
              Icon: ShieldCheck,
              chipClass: isDarkCardText
                ? 'bg-rose-500/20 border-rose-400/35 text-rose-100 hover:bg-rose-500/30'
                : 'bg-rose-50 border-rose-200/90 text-rose-800 hover:bg-rose-100/80',
              iconClass: isDarkCardText ? 'text-rose-300' : 'text-rose-600',
            };
          }
          if (lower.includes('thanh toán') || lower.includes('ví') || lower.includes('fintech') || lower.includes('tài chính')) {
            return {
              Icon: Wallet,
              chipClass: isDarkCardText
                ? 'bg-sky-500/20 border-sky-400/35 text-sky-100 hover:bg-sky-500/30'
                : 'bg-sky-50 border-sky-200/90 text-sky-800 hover:bg-sky-100/80',
              iconClass: isDarkCardText ? 'text-sky-300' : 'text-sky-600',
            };
          }
          if (lower.includes('truyền hình') || lower.includes('truyền thông')) {
            return {
              Icon: Tv,
              chipClass: isDarkCardText
                ? 'bg-teal-500/20 border-teal-400/35 text-teal-100 hover:bg-teal-500/30'
                : 'bg-teal-50 border-teal-200/90 text-teal-800 hover:bg-teal-100/80',
              iconClass: isDarkCardText ? 'text-teal-300' : 'text-teal-600',
            };
          }
          if (lower.includes('viễn thông') || lower.includes('call center') || lower.includes('contact center')) {
            return {
              Icon: PhoneCall,
              chipClass: isDarkCardText
                ? 'bg-indigo-500/20 border-indigo-400/35 text-indigo-100 hover:bg-indigo-500/30'
                : 'bg-indigo-50 border-indigo-200/90 text-indigo-800 hover:bg-indigo-100/80',
              iconClass: isDarkCardText ? 'text-indigo-300' : 'text-indigo-600',
            };
          }
          if (lower.includes('xây dựng hệ thống') || lower.includes('hệ thống')) {
            return {
              Icon: Layers,
              chipClass: isDarkCardText
                ? 'bg-emerald-500/20 border-emerald-400/35 text-emerald-100 hover:bg-emerald-500/30'
                : 'bg-emerald-50 border-emerald-200/90 text-emerald-800 hover:bg-emerald-100/80',
              iconClass: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
            };
          }
          const fallbackPalettes = isDarkCardText
            ? [
                { Icon: Monitor, chipClass: 'bg-emerald-500/20 border-emerald-400/35 text-emerald-100 hover:bg-emerald-500/30', iconClass: 'text-emerald-300' },
                { Icon: Layers, chipClass: 'bg-violet-500/20 border-violet-400/35 text-violet-100 hover:bg-violet-500/30', iconClass: 'text-violet-300' },
                { Icon: Cpu, chipClass: 'bg-amber-500/20 border-amber-400/35 text-amber-100 hover:bg-amber-500/30', iconClass: 'text-amber-300' },
              ]
            : [
                { Icon: Monitor, chipClass: 'bg-emerald-50 border-emerald-200/90 text-emerald-800 hover:bg-emerald-100/80', iconClass: 'text-emerald-600' },
                { Icon: Layers, chipClass: 'bg-violet-50 border-violet-200/90 text-violet-800 hover:bg-violet-100/80', iconClass: 'text-violet-600' },
                { Icon: Cpu, chipClass: 'bg-amber-50 border-amber-200/90 text-amber-800 hover:bg-amber-100/80', iconClass: 'text-amber-600' },
              ];
          return fallbackPalettes[idx % fallbackPalettes.length];
        };

        // Bảng màu riêng biệt cho từng sub-card trong Danh sách công việc
        const taskCardPalettes = [
          {
            tone: 'blue',
            light: 'bg-gradient-to-r from-blue-50/95 to-sky-50/75 border-blue-200/85 hover:border-blue-400',
            dark: 'bg-gradient-to-r from-blue-950/55 to-sky-950/35 border-blue-500/30 hover:border-blue-400/60',
            badge: 'bg-blue-600 text-white',
          },
          {
            tone: 'emerald',
            light: 'bg-gradient-to-r from-emerald-50/95 to-teal-50/75 border-emerald-200/85 hover:border-emerald-400',
            dark: 'bg-gradient-to-r from-emerald-950/55 to-teal-950/35 border-emerald-500/30 hover:border-emerald-400/60',
            badge: 'bg-emerald-600 text-white',
          },
          {
            tone: 'amber',
            light: 'bg-gradient-to-r from-orange-50/95 to-amber-50/75 border-orange-200/85 hover:border-orange-400',
            dark: 'bg-gradient-to-r from-orange-950/55 to-amber-950/35 border-orange-500/30 hover:border-orange-400/60',
            badge: 'bg-orange-500 text-white',
          },
          {
            tone: 'purple',
            light: 'bg-gradient-to-r from-purple-50/95 to-violet-50/75 border-purple-200/85 hover:border-purple-400',
            dark: 'bg-gradient-to-r from-purple-950/55 to-violet-950/35 border-purple-500/30 hover:border-purple-400/60',
            badge: 'bg-purple-600 text-white',
          },
          {
            tone: 'pink',
            light: 'bg-gradient-to-r from-rose-50/95 to-pink-50/75 border-rose-200/85 hover:border-rose-400',
            dark: 'bg-gradient-to-r from-rose-950/55 to-pink-950/35 border-rose-500/30 hover:border-rose-400/60',
            badge: 'bg-rose-600 text-white',
          },
          {
            tone: 'cyan',
            light: 'bg-gradient-to-r from-cyan-50/95 to-indigo-50/75 border-cyan-200/85 hover:border-cyan-400',
            dark: 'bg-gradient-to-r from-cyan-950/55 to-indigo-950/35 border-cyan-500/30 hover:border-cyan-400/60',
            badge: 'bg-cyan-600 text-white',
          },
          {
            tone: 'amber',
            light: 'bg-gradient-to-r from-amber-50/95 to-yellow-50/75 border-amber-200/85 hover:border-amber-400',
            dark: 'bg-gradient-to-r from-amber-950/55 to-yellow-950/35 border-amber-500/30 hover:border-amber-400/60',
            badge: 'bg-amber-600 text-white',
          },
          {
            tone: 'indigo',
            light: 'bg-gradient-to-r from-indigo-50/95 to-fuchsia-50/75 border-indigo-200/85 hover:border-indigo-400',
            dark: 'bg-gradient-to-r from-indigo-950/55 to-fuchsia-950/35 border-indigo-500/30 hover:border-indigo-400/60',
            badge: 'bg-indigo-600 text-white',
          },
        ];

        // Palette 3 cột Giới thiệu hành trình
        const introColumnStyles = [
          {
            tone: 'amber',
            Icon: Sparkles,
            titleColor: isDarkCardText ? 'text-orange-300' : 'text-orange-600',
            iconColor: isDarkCardText ? 'text-orange-300' : 'text-orange-600',
            lightBg: 'bg-gradient-to-br from-amber-50/92 to-orange-50/75 border-amber-200/80',
            darkBg: 'bg-gradient-to-br from-amber-950/50 to-orange-950/35 border-amber-500/30',
          },
          {
            tone: 'sky',
            Icon: Network,
            titleColor: isDarkCardText ? 'text-sky-300' : 'text-blue-600',
            iconColor: isDarkCardText ? 'text-sky-300' : 'text-blue-600',
            lightBg: 'bg-gradient-to-br from-sky-50/92 to-blue-50/75 border-sky-200/80',
            darkBg: 'bg-gradient-to-br from-sky-950/50 to-blue-950/35 border-sky-500/30',
          },
          {
            tone: 'emerald',
            Icon: Headphones,
            titleColor: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
            iconColor: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
            lightBg: 'bg-gradient-to-br from-emerald-50/92 to-teal-50/75 border-emerald-200/80',
            darkBg: 'bg-gradient-to-br from-emerald-950/50 to-teal-950/35 border-emerald-500/30',
          },
        ];

        // Palette 6 màu cho các dự án trọng điểm
        const projectCardPalettes = [
          'text-sky-300 border-sky-500/30 hover:bg-white/10',
          'text-emerald-300 border-emerald-500/30 hover:bg-white/10',
          'text-purple-300 border-purple-500/30 hover:bg-white/10',
          'text-amber-300 border-amber-500/30 hover:bg-white/10',
          'text-pink-300 border-pink-500/30 hover:bg-white/10',
          'text-cyan-300 border-cyan-500/30 hover:bg-white/10',
        ];

        const introPillarColors = [
          'text-amber-300',
          'text-cyan-300',
          'text-rose-300',
          'text-emerald-300',
        ];

        const kpiValueColors = [
          'text-emerald-300',
          'text-cyan-300',
          'text-amber-300',
          'text-purple-300',
        ];

        const kpiBarGradients = [
          'from-emerald-600 to-emerald-300',
          'from-cyan-600 to-sky-300',
          'from-amber-600 to-yellow-300',
          'from-purple-600 to-pink-400',
        ];

        const matchedRoadmapCard = roadmapCards.find((r) => r.key === activeKey);
        const inlineLogos = matchedRoadmapCard?.logos?.length
          ? matchedRoadmapCard.logos
          : [
              {
                src: activeMilestone.logo,
                fallback: activeMilestone.logo,
                alt: activeMilestone.company,
              },
            ];
        const shortTagLabel =
          matchedRoadmapCard?.shortName ||
          activeMilestone.subCompanies ||
          activeMilestone.tag;
        const companyFullName = `${activeMilestone.company}${
          activeMilestone.subCompanies ? ` ${activeMilestone.subCompanies}` : ''
        }`;

        const navigateToServices = () => {
          SoundEngine.playTap();
          if (onNavigateTab) onNavigateTab(4);
          else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
        };

        const navigateToProjects = (projectId?: string) => {
          SoundEngine.playTap();
          if (onOpenProjectFromJob) {
            onOpenProjectFromJob(projectId);
          } else if (onNavigateTab) {
            onNavigateTab(7);
          } else {
            window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
          }
        };

        void taskCardPalettes;
        void introColumnStyles;

        return (
          <React.Fragment key={`experience-job-detail-${activeKey}`}>
            {/* THANH ĐIỀU HƯỚNG CHI TIẾT TĨNH: Thu gọn + Nút đóng (44x44px touch target trên Mobile) */}
            <motion.div
              id="experience-job-detail-toolbar"
              data-expand-motion="true"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, x: originOffsetX * 0.45, y: originOffsetY * 0.45 + 16, scale: originScale }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: originOffsetX * 0.35, y: originOffsetY * 0.35 + 18, scale: Math.max(0.88, originScale) }
              }
              transition={expandSpring}
              className="relative z-20 w-full flex flex-wrap items-center justify-between gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={handleCloseJobCard}
                title="Bấm để thu gọn về thẻ công ty / slider"
                style={{
                  background: 'var(--bg-nav-pill, var(--surface-interactive-bg))',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-subcard, var(--border-default))',
                  boxShadow: 'var(--shadow-nav-pill)',
                }}
                className="typo-button min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold font-play cursor-pointer border backdrop-blur-md"
              >
                <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                <span>Thu gọn thẻ</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* Nút X Close gấp giấy 3D Origami trở lại Timeline */}
                <button
                  id="experience-job-detail-close-btn"
                  type="button"
                  onClick={handleCloseJobCard}
                  title="Đóng chi tiết công việc và xếp giấy trở lại (hoặc nhấn phím Esc)"
                  aria-label="Đóng chi tiết công việc"
                  style={{
                    background: isWalnutWood
                      ? '#2A190F'
                      : isDarkLeather
                        ? '#1C1613'
                        : isBrownLeather
                          ? '#522E10'
                          : 'var(--bg-nav-pill, var(--surface-interactive-bg))',
                    borderColor: isWalnutWood
                      ? 'rgba(245, 196, 120, 0.6)'
                      : isDarkLeather || isBrownLeather
                        ? 'rgba(245, 222, 179, 0.6)'
                        : 'var(--border-subcard, var(--border-default))',
                    color: isWalnutWood || isDarkLeather || isBrownLeather ? '#FFF8EE' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-nav-pill)',
                  }}
                  className="theme-modal-close w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer border backdrop-blur-md shrink-0"
                >
                  <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </motion.div>

            {/* BỐ CỤC BENTO CHI TIẾT CÔNG VIỆC — 1 CSS GRID 4 CỘT (span 2 / row-span 2) */}
            <motion.div
              id="experience-bento-grid"
              data-expand-motion="true"
              data-layout-mode="bento-4col-grid"
              data-card-layout="bento-4col-grid"
              initial={reducedMotion ? false : { opacity: 0, y: 10, scale: originScale }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, transition: { duration: 0.12 } }}
              transition={getExpandDetailRevealTransition(reducedMotion, false)}
              className="relative z-20 exp-studio-grid exp-bento-4col-grid ux-u214-grid w-full min-w-0"
            >
              {/* Ô NỔI BẬT (2x2): LOGO + ĐỊNH DANH CÔNG TY + BANNER */}
              <ExperienceBentoStudioCard
                id="experience-info-card"
                variant="hero-purple"
                u214RestText={`${companyFullName} · ${activeMilestone.period}`}
                u214TypeText={`${companyFullName} · ${activeMilestone.roleTitle} (${activeMilestone.tenure})`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button, a, video, .exp-bento-hero-banner, input')) return;
                  handleCloseJobCard();
                }}
                title="Bấm vào vùng trống để thu gọn lại"
                className="exp-bento-item exp-bento-span-2x2 cursor-pointer"
              >
                {/* Header Identity Row */}
                <div
                  id="experience-company-name-card"
                  className="relative z-10 flex flex-col gap-3 pb-3 border-b border-white/10 min-w-0 shrink-0"
                >
                  <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                    <div className="u214-logo-gather flex items-center -space-x-2 shrink-0">
                      {inlineLogos.map((logoItem, logoIdx) => (
                        <div
                          key={`${logoItem.src}-${logoIdx}`}
                          style={{ zIndex: inlineLogos.length - logoIdx }}
                          className={cn(
                            'rounded-2xl bg-white p-1.5 shadow-sm border border-white/20 shrink-0 overflow-hidden flex items-center justify-center',
                            inlineLogos.length >= 4
                              ? 'w-10 h-10 sm:w-11 sm:h-11'
                              : 'w-12 h-12 sm:w-14 sm:h-14'
                          )}
                        >
                          <BlurUpImage
                            src={logoItem.src}
                            fallbackSrc={logoItem.fallback}
                            alt={logoItem.alt || companyFullName}
                            variant="contain"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold text-rose-200 mb-1 tabular-nums">
                        <span>{activeMilestone.cardYearLabel || activeMilestone.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-300">{activeMilestone.roleTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeMilestone.tenure}</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight [text-wrap:balance] break-words m-0">
                        {companyFullName}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-gray-200">
                    <span className="font-semibold text-white">{activeMilestone.tag}</span>
                    {activeMilestone.location && (
                      <>
                        <span aria-hidden="true" className="opacity-50">·</span>
                        <span className="text-emerald-300 font-semibold">{activeMilestone.location}</span>
                      </>
                    )}
                    {shortTagLabel && shortTagLabel !== companyFullName && (
                      <>
                        <span aria-hidden="true" className="opacity-50">·</span>
                        <span className="opacity-85">{shortTagLabel}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Banner Video / Image Preview filling remaining vertical space of the 2x2 compartment */}
                {activeMilestone.videoCard ? (
                  <div className="exp-bento-hero-banner relative flex-1 min-h-[210px] sm:min-h-[240px] w-full rounded-[12px] overflow-hidden bg-slate-950 border border-white/15">
                    <DualLayerVideoPlayer
                      video1Id=""
                      video2Id=""
                      video1Src={activeMilestone.videoCard.idleUrl}
                      video2Src={activeMilestone.videoCard.playUrl}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      capsuleVariant="about"
                      className="w-full h-full z-0 pointer-events-auto"
                    />
                  </div>
                ) : (
                  !bannerImgError &&
                  activeMilestone.bannerUrl && (
                    <div className="exp-bento-hero-banner relative flex-1 min-h-[210px] sm:min-h-[240px] w-full rounded-[12px] overflow-hidden bg-slate-950 border border-white/15">
                      <BlurUpImage
                        src={activeMilestone.bannerUrl}
                        alt={`Banner ${companyFullName}`}
                        priority="eager"
                        variant="cover"
                        onError={() => setBannerImgError(true)}
                        className="w-full h-full object-cover object-center brightness-105 contrast-105 saturate-105 block"
                      />
                    </div>
                  )
                )}
              </ExperienceBentoStudioCard>

              {/* Ô 1 (2x1): 1. THÔNG TIN CÔNG TY */}
              <ExperienceBentoStudioCard
                id="experience-general-info-card"
                variant="amber-highlight"
                u214MarqueeItems={derivedServicesList.map((srv, idx) => {
                  const palette = ['#7B61FF', '#2F8FE0', '#119C72', '#D6731E', '#D93A55', '#E2B714'];
                  return { label: srv, color: palette[idx % palette.length] };
                })}
                className="exp-bento-item exp-bento-span-2x1 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Briefcase className="w-4 h-4 text-amber-300 shrink-0 exp-studio-icon" />
                      <h2
                        className="text-xs font-bold tracking-wide text-rose-200 truncate m-0"
                        data-card-title="true"
                      >
                        1. Thông Tin Công Ty
                      </h2>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-200 tabular-nums shrink-0">
                      {activeMilestone.tenure}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div
                      id="experience-company-services"
                      className="exp-studio-subtile no-card-hover flex items-start gap-2 rounded-xl px-3 py-2 min-w-0"
                    >
                      <Layers className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-rose-200/80 block text-[11px]">Lĩnh vực</span>
                          <button
                            type="button"
                            onClick={navigateToServices}
                            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-300 hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                            title="Xem chi tiết Lĩnh vực & Dịch vụ"
                          >
                            <span>{derivedServicesList.length} dịch vụ</span>
                            <ArrowUpRight className="w-3 h-3 shrink-0" />
                          </button>
                        </div>
                        <span className="font-bold text-white block break-words">
                          {activeMilestone.industry || activeMilestone.tag}
                        </span>
                        {derivedServicesList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {derivedServicesList.map((serviceName, idx) => {
                              const { Icon } = getIndustryChipVisual(serviceName, idx);
                              return (
                                <button
                                  key={serviceName}
                                  type="button"
                                  onClick={navigateToServices}
                                  title={`${serviceName} — Click để xem chi tiết dịch vụ`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[11px] font-semibold text-gray-100 hover:bg-white/20 cursor-pointer whitespace-nowrap"
                                >
                                  <Icon className="w-3 h-3 shrink-0" />
                                  <span>{serviceName}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeMilestone.location && (
                        <div className="exp-studio-subtile no-card-hover flex items-start gap-2 rounded-xl px-3 py-2 min-w-0">
                          <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-rose-200/80 block text-[11px]">Địa điểm</span>
                            <span className="font-bold text-white break-words">
                              {activeMilestone.location}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="exp-studio-subtile no-card-hover flex items-start gap-2 rounded-xl px-3 py-2 min-w-0">
                        <Clock className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-rose-200/80 block text-[11px]">Thời gian</span>
                          <span className="font-bold text-white break-words tabular-nums">
                            {activeMilestone.period}
                          </span>
                        </div>
                      </div>

                      <div className="exp-studio-subtile no-card-hover flex items-start gap-2 rounded-xl px-3 py-2 min-w-0">
                        <Award className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-rose-200/80 block text-[11px]">Chức danh</span>
                          <span className="font-bold text-amber-300 break-words">
                            {activeMilestone.roleTitle}
                          </span>
                        </div>
                      </div>

                      <div className="exp-studio-subtile no-card-hover flex items-start gap-2 rounded-xl px-3 py-2 min-w-0">
                        <Users className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-rose-200/80 block text-[11px]">Quy mô vận hành</span>
                          <span className="font-bold text-white break-words">
                            {activeMilestone.scaleDesc || `${activeMilestone.headcount} nhân sự`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ExperienceBentoStudioCard>

              {/* Ô 2 (1x1): 5. CAM KẾT CỦA DOANH NGHIỆP */}
              <ExperienceBentoStudioCard
                id="experience-enterprise-commitment-card"
                variant="commitment-amber"
                u214RestText={activeMilestone.roleTitle}
                u214TypeText={philosophyText.slice(0, 48)}
                className="exp-bento-item exp-bento-span-1x1 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Award className="w-4 h-4 text-yellow-200 shrink-0 exp-studio-icon" />
                    <h2
                      className="text-xs font-bold tracking-wide text-amber-100 truncate m-0"
                      data-card-title="true"
                    >
                      5. Cam Kết Doanh Nghiệp
                    </h2>
                  </div>
                  <blockquote className="exp-studio-subtile no-card-hover text-xs font-semibold text-white leading-relaxed rounded-xl p-3 my-1 break-words">
                    “{philosophyText}”
                  </blockquote>
                </div>

                <div className="pt-2.5 border-t border-white/15 text-xs min-w-0">
                  <div className="font-bold text-yellow-200 truncate">
                    {companyFullName}
                  </div>
                  <div className="text-amber-100/85 mt-0.5 truncate tabular-nums">
                    {activeMilestone.period}
                  </div>
                </div>
              </ExperienceBentoStudioCard>

              {/* Ô 3 (1x1): 4. CAM KẾT CHẤT LƯỢNG */}
              <ExperienceBentoStudioCard
                id="experience-commitments-card"
                variant="emerald-trust"
                className="exp-bento-item exp-bento-span-1x1 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <Shield className="w-4 h-4 text-emerald-300 shrink-0 exp-studio-icon" />
                      <h2
                        className="text-xs font-bold tracking-wide text-emerald-200 truncate m-0"
                        data-card-title="true"
                      >
                        4. Cam Kết Chất Lượng
                      </h2>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-200 tabular-nums shrink-0">
                      {commitmentsList.length} chuẩn
                    </span>
                  </div>

                  <div className="space-y-2">
                    {commitmentsList.map((cmtText, cIdx) => {
                      const CmtIcon = cIdx % 2 === 0 ? Zap : Shield;
                      const colonIdx = cmtText.indexOf(':');
                      const hasCustomLabel = colonIdx > 0 && colonIdx < 36;
                      const cmtHeading = hasCustomLabel
                        ? cmtText.slice(0, colonIdx).trim()
                        : `Tiêu chuẩn ${cIdx + 1}`;
                      const cmtBody = hasCustomLabel
                        ? cmtText.slice(colonIdx + 1).trim()
                        : cmtText;
                      return (
                        <div
                          key={cIdx}
                          className="exp-studio-subtile no-card-hover rounded-xl p-2.5 min-w-0"
                        >
                          <div
                            className={cn(
                              'flex items-center gap-1.5 text-[11px] font-bold mb-0.5',
                              cIdx % 2 === 0 ? 'text-amber-300' : 'text-cyan-300'
                            )}
                          >
                            <CmtIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{cmtHeading}</span>
                          </div>
                          <p className="text-xs text-emerald-50/90 leading-snug break-words m-0">
                            {cmtBody}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ExperienceBentoStudioCard>

              {/* Ô NỔI BẬT (2x2): 3. DANH SÁCH CÔNG VIỆC */}
              <ExperienceBentoStudioCard
                id="experience-responsibility-card"
                variant="slate-tasks"
                u214RestText="Rê chuột xem hạng mục..."
                u214TypeText={(tasksList[0] || activeMilestone.roleTitle).replace(/^\d+\.\s*/, '').slice(0, 42)}
                className="exp-bento-item exp-bento-span-2x2 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0 exp-studio-icon" />
                      <h4
                        className="text-xs sm:text-sm font-bold text-white tracking-wide m-0"
                        data-card-title="true"
                      >
                        3. Danh Sách Công Việc
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-purple-300 shrink-0 tabular-nums">
                      {tasksList.length} hạng mục
                    </span>
                  </div>

                  <ul className="divide-y divide-white/10 text-xs sm:text-sm m-0 p-0 list-none">
                    {tasksList.map((task, idx) => {
                      const cleanTask = task.replace(/^\d+\.\s*/, '');
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-3 py-2.5 px-1.5 rounded-lg hover:bg-white/5 transition-colors min-w-0"
                        >
                          <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                            {idx + 1}
                          </span>
                          <span className="text-gray-100 leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                            {cleanTask}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </ExperienceBentoStudioCard>

              {/* Ô 5 (2x1): 2. GIỚI THIỆU HÀNH TRÌNH */}
              <ExperienceBentoStudioCard
                id="experience-banner-card"
                variant="roadmap-violet"
                u214RestText={narrativeTitle}
                u214TypeText={philosophyText}
                className="exp-bento-item exp-bento-span-2x1 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <Compass className="w-4 h-4 text-purple-300 shrink-0 exp-studio-icon" />
                      <h2
                        className="text-xs sm:text-sm font-bold tracking-wide text-purple-200 m-0"
                        data-card-title="true"
                      >
                        2. Giới Thiệu Hành Trình
                      </h2>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-100 opacity-85 truncate">
                      {narrativeTitle}
                    </span>
                  </div>

                  {(activeMilestone.highlightText || activeMilestone.cardDescription) && (
                    <p className="exp-studio-subtile no-card-hover text-xs sm:text-sm text-purple-100/95 leading-relaxed mb-3 rounded-xl p-3 break-words m-0">
                      {activeMilestone.highlightText || activeMilestone.cardDescription}
                    </p>
                  )}

                  {introBlocks.length > 0 && (
                    <div
                      className={cn(
                        'grid gap-2.5',
                        introBlocks.length === 1
                          ? 'grid-cols-1'
                          : 'grid-cols-1 sm:grid-cols-2'
                      )}
                    >
                      {introBlocks.map((item, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'exp-studio-subtile no-card-hover rounded-xl p-3 min-w-0 flex flex-col gap-1',
                            introBlocks.length === 3 && idx === 2 && 'sm:col-span-2'
                          )}
                        >
                          <div
                            className={cn(
                              'text-xs font-bold mb-0.5 break-words',
                              introPillarColors[idx % introPillarColors.length]
                            )}
                            data-subcard-title="true"
                          >
                            {item.title}
                          </div>
                          <p className="text-xs text-gray-200 leading-relaxed break-words m-0">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ExperienceBentoStudioCard>

              {/* Ô 6 (2x1): 6. DANH SÁCH DỰ ÁN */}
              <ExperienceBentoStudioCard
                id="experience-achievement-card"
                variant="indigo-docs"
                u214RestText="Tìm kiếm dự án..."
                u214TypeText={
                  projectsList[0]
                    ? `${projectsList[0].code} · ${projectsList[0].title}`.slice(0, 42)
                    : activeMilestone.company
                }
                className="exp-bento-item exp-bento-span-2x1 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder className="w-4 h-4 text-cyan-400 shrink-0 exp-studio-icon" />
                      <h4
                        className="text-xs sm:text-sm font-bold text-white tracking-wide m-0"
                        data-card-title="true"
                      >
                        6. Danh Sách Dự Án
                      </h4>
                      <span className="text-xs font-semibold text-cyan-300 tabular-nums">
                        · {projectsList.length} dự án
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateToProjects()}
                      className="min-h-[40px] sm:min-h-0 px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold bg-white/10 border border-white/20 text-sky-200 hover:bg-white/20 flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
                      title="Chuyển đến trang Dự án"
                    >
                      <span>Tất cả dự án</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {projectsList.map((proj, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => navigateToProjects(proj.projectId)}
                        title={`${proj.rawTitle} — Click để mở liên kết dự án`}
                        className={cn(
                          'exp-studio-subtile no-card-hover w-full rounded-xl p-2.5 cursor-pointer flex items-start gap-2 text-left transition-colors min-w-0',
                          projectCardPalettes[pIdx % projectCardPalettes.length]
                        )}
                      >
                        <span className="font-bold text-sm shrink-0 tabular-nums">
                          {proj.code}
                        </span>
                        <span className="text-white font-bold leading-snug break-words min-w-0 flex-1">
                          – {proj.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </ExperienceBentoStudioCard>

              {/* Ô 7 (2x1): 7. KẾT QUẢ ĐẠT ĐƯỢC */}
              {kpisList.length > 0 && (
                <ExperienceBentoStudioCard
                  id="experience-results-card"
                  data-element-name="Thẻ Kết quả đạt được"
                  data-element-type="card"
                  variant="rose-kpi"
                  u214BarHeights={kpisList.map((k) =>
                    Math.min(1, Math.max(0.25, (Number(k.percent) || 75) / 100))
                  )}
                  className="exp-bento-item exp-bento-span-2x1 justify-between"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <Target className="w-4 h-4 text-emerald-400 shrink-0 exp-studio-icon" />
                      <h4
                        className="text-xs sm:text-sm font-bold text-white tracking-wide m-0"
                        data-card-title="true"
                      >
                        7. Kết Quả Đạt Được
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-emerald-300 shrink-0 tabular-nums">
                      {kpisList.length} chỉ số nổi bật
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 items-stretch min-w-0">
                    {/* Bảng Chỉ số -> Kết quả */}
                    <div className="exp-studio-subtile no-card-hover rounded-xl overflow-hidden flex flex-col justify-between min-w-0">
                      <div className="grid grid-cols-3 bg-white/10 px-3.5 py-2 text-[11px] font-bold tracking-wide text-gray-300">
                        <span className="col-span-2">Chỉ số</span>
                        <span className="text-right">Kết quả</span>
                      </div>
                      <div className="divide-y divide-white/10 text-xs">
                        {kpisList.map((kpi, kIdx) => (
                          <div
                            key={`${kpi.label}-${kIdx}`}
                            className="grid grid-cols-3 items-center px-3.5 py-2.5 gap-2 min-w-0"
                          >
                            <span className="col-span-2 text-gray-100 font-bold break-words min-w-0">
                              {kpi.label}
                            </span>
                            <span
                              className={cn(
                                'text-right font-bold text-sm tabular-nums break-words',
                                kpiValueColors[kIdx % kpiValueColors.length]
                              )}
                            >
                              {kpi.displayValue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Biểu đồ tăng trưởng KPI */}
                    <div className="exp-studio-subtile no-card-hover rounded-xl p-3.5 flex flex-col justify-between min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-bold tracking-wide text-emerald-300">
                            Biểu đồ tăng trưởng KPI
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-300 font-semibold tabular-nums">
                          {activeMilestone.cardYearLabel
                            ? activeMilestone.cardYearLabel.replace(/\s*-\s*/, ' → ')
                            : activeMilestone.period}
                        </span>
                      </div>

                      <div
                        className="grid gap-2 sm:gap-3 items-end h-32 pt-2"
                        style={{
                          gridTemplateColumns: `repeat(${Math.max(1, kpisList.length)}, minmax(0, 1fr))`,
                        }}
                      >
                        {kpisList.map((kpi, kIdx) => {
                          const clampedPercent = Math.min(100, Math.max(12, Number(kpi.percent) || 75));
                          const shortLabel =
                            kpi.label.length > 16 ? `${kpi.label.slice(0, 14)}…` : kpi.label;
                          return (
                            <div
                              key={`${kpi.label}-bar-${kIdx}`}
                              title={`${kpi.label}: ${kpi.displayValue}`}
                              className="flex flex-col items-center gap-1 h-full justify-end min-w-0"
                            >
                              <span className="text-[11px] font-bold text-white tabular-nums truncate max-w-full">
                                {kpi.displayValue}
                              </span>
                              <div
                                className={cn(
                                  'w-full rounded-t-lg bg-gradient-to-t transition-transform duration-200 hover:scale-[1.03]',
                                  kpiBarGradients[kIdx % kpiBarGradients.length]
                                )}
                                style={{ height: `${clampedPercent}%` }}
                              />
                              <span className="text-[10.5px] text-gray-300 font-semibold text-center truncate max-w-full">
                                {shortLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </ExperienceBentoStudioCard>
              )}

              {/* Ô 8 (2x1 hoặc 4x1 nếu không có KPI): 8. HÌNH ẢNH KỶ NIỆM */}
              <ExperienceBentoStudioCard
                id="experience-memories-card"
                variant="gallery-pink"
                u214MarqueeItems={photosList.map((ph, idx) => {
                  const palette = ['#F472B6', '#FB7185', '#E879F9', '#C084FC', '#38BDF8', '#34D399'];
                  const captionText =
                    ph.title || ('caption' in ph && ph.caption ? ph.caption : undefined) || `Kỷ niệm ${idx + 1}`;
                  return {
                    label: captionText,
                    color: palette[idx % palette.length],
                  };
                })}
                className={cn(
                  'exp-bento-item justify-between',
                  kpisList.length > 0 ? 'exp-bento-span-2x1' : 'exp-bento-span-4x1'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <h4
                    className="text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 text-white m-0"
                    data-card-title="true"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-pink-300 exp-studio-icon" />
                    <span>8. Hình Ảnh Kỷ Niệm</span>
                  </h4>
                  {photosList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        setCarouselSlideIdx(0);
                        setIsPhotoLightboxOpen(true);
                      }}
                      className="min-h-[40px] sm:min-h-0 typo-badge flex items-center gap-1.5 shrink-0 cursor-pointer font-bold px-3 py-1.5 sm:py-1 rounded-lg bg-white/15 border border-white/25 text-white whitespace-nowrap"
                      title="Phóng to thư viện ảnh kỷ niệm"
                    >
                      <ZoomIn className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                      <span>Phóng to ({photosList.length})</span>
                    </button>
                  )}
                </div>

                {photosList.length > 0 ? (
                  <div
                    className={cn(
                      'grid gap-2.5 content-start items-start',
                      kpisList.length === 0
                        ? photosList.length >= 4
                          ? 'grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-4'
                          : photosList.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-1 sm:grid-cols-2'
                        : photosList.length === 1
                          ? 'grid-cols-1'
                          : 'grid-cols-1 min-[375px]:grid-cols-2'
                    )}
                  >
                    {photosList.map((photo, pIdx) => {
                      const hasImgFailed = Boolean(failedPhotoSrcs[photo.src]);
                      return (
                        <button
                          key={photo.src + pIdx}
                          type="button"
                          data-media-card="image"
                          onClick={() => {
                            SoundEngine.playTap();
                            setCarouselSlideIdx(pIdx);
                            setIsPhotoLightboxOpen(true);
                          }}
                          aria-label={`Phóng to hình kỷ niệm ${pIdx + 1}: ${photo.title || companyFullName}`}
                          style={{ padding: '0px', borderRadius: '12px' }}
                          className="exp-bento-rect-btn no-card-hover relative rounded-[12px] overflow-hidden border border-white/20 bg-slate-950 focus:outline-none cursor-pointer p-0 text-left w-full aspect-[16/10]"
                        >
                          {!hasImgFailed ? (
                            <BlurUpImage
                              src={photo.src}
                              alt={photo.title || companyFullName}
                              variant="cover"
                              onError={() =>
                                setFailedPhotoSrcs((prev) => ({ ...prev, [photo.src]: true }))
                              }
                              className="w-full h-full object-cover block"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 text-slate-200">
                              <Camera className="w-6 h-6 text-pink-300" />
                              <span className="typo-caption font-semibold text-center truncate max-w-full">
                                {photo.title || companyFullName}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end justify-between gap-2 p-2.5">
                            <span className="typo-caption font-semibold text-white truncate">
                              {photo.title || `Kỷ niệm #${pIdx + 1}`}
                            </span>
                            <ZoomIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="exp-studio-subtile no-card-hover p-4 flex items-center justify-center text-white/80">
                    <span className="typo-body-sm">
                      Chưa có hình ảnh kỷ niệm cho cột mốc này.
                    </span>
                  </div>
                )}
              </ExperienceBentoStudioCard>
            </motion.div>
          </React.Fragment>
      );
    })()}
      </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal for Photo (Đã loại bỏ logo công ty) */}
      {isPhotoLightboxOpen && (() => {
        const isCompanyLogoAsset = (url?: string) => {
          if (!url) return false;
          if (activeMilestone.logo && url === activeMilestone.logo) return true;
          return /logo_|_logo|\/logo\//i.test(url);
        };
        const basePhotos = (activeMilestone.photos || []).filter((p) => !isCompanyLogoAsset(p.src));
        const safeMemoryImg = activeMilestone.memoryImg && !isCompanyLogoAsset(activeMilestone.memoryImg)
          ? activeMilestone.memoryImg
          : '';
        const primaryMemoryPhoto = safeMemoryImg
          ? [
              {
                src: safeMemoryImg,
                title: activeMilestone.company,
                desc: `${activeMilestone.roleTitle} (${activeMilestone.period})`,
              },
            ]
          : [];
        const lightboxPhotos = [
          ...primaryMemoryPhoto,
          ...basePhotos.filter((p) => p.src !== safeMemoryImg),
        ];
        const curPhoto = lightboxPhotos[carouselSlideIdx] || lightboxPhotos[0];
        if (!curPhoto) return null;
        return (
          <div
            onClick={() => setIsPhotoLightboxOpen(false)}
            style={{
              background: 'var(--bg-modal-backdrop, rgba(2, 6, 23, 0.78))',
              backdropFilter: 'blur(var(--blur-modal, 8px))',
              WebkitBackdropFilter: 'blur(var(--blur-modal, 8px))',
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Thư viện ảnh ${activeMilestone.company}`}
              onClick={(e) => e.stopPropagation()}
              className="theme-modal-card max-w-4xl w-full rounded-[var(--radius-card,14px)] overflow-hidden shadow-2xl relative"
            >
              <div
                className={cn(
                  'relative aspect-[16/10] w-full flex items-center justify-center rounded-[var(--radius-subcard,14px)] overflow-hidden',
                  isDarkCardText ? 'bg-[#0B1220]' : 'bg-slate-100'
                )}
              >
                <BlurUpImage
                  src={curPhoto.src}
                  alt={curPhoto.title || activeMilestone.company}
                  priority="eager"
                  variant="contain"
                  className="w-full h-full object-contain rounded-[var(--radius-subcard,14px)]"
                />
                {lightboxPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setCarouselSlideIdx((prev) => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length)
                      }
                      aria-label="Ảnh trước"
                      className="theme-modal-close absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <WebIcon name="chevron-left" className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCarouselSlideIdx((prev) => (prev + 1) % lightboxPhotos.length)
                      }
                      aria-label="Ảnh tiếp theo"
                      className="theme-modal-close absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <WebIcon name="chevron-right" className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label="Đóng trình xem ảnh"
                  onClick={() => setIsPhotoLightboxOpen(false)}
                  className="theme-modal-close absolute top-3 right-3 w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center typo-button cursor-pointer"
                >
                  <WebIcon name="cancel" className="w-4 h-4" />
                </button>
              </div>
              <div className="theme-modal-footer p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="card-header-sync flex items-center gap-2 min-w-0">
                    <WebIcon name="camera" className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
                    <h4 className="typo-popup-title card-title-synced text-[var(--text-heading,var(--text-primary))] truncate" data-card-title="true">
                      {curPhoto.title || activeMilestone.company}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-nested-badge)] border border-[var(--border-subcard)] typo-badge font-mono text-[var(--text-link,var(--color-primary))] shrink-0">
                      {carouselSlideIdx + 1}/{lightboxPhotos.length}
                    </span>
                  </div>
                  <p className="typo-caption text-[var(--text-secondary)] mt-1">
                    {curPhoto.desc || activeMilestone.roleTitle}
                  </p>
                </div>
                {lightboxPhotos.length > 1 && (
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    {lightboxPhotos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Chọn ảnh ${idx + 1}`}
                        onClick={() => setCarouselSlideIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          idx === carouselSlideIdx ? 'bg-[var(--color-primary)] scale-125' : 'bg-[var(--divider-nav-pill)] hover:opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
