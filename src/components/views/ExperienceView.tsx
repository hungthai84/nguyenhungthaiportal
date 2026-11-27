'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { OrigamiUnfoldStage } from './experience/OrigamiUnfoldStage';
import { ExperienceSliderView } from './experience/ExperienceSliderView';
import { COMPANY_LOGOS } from '@/utils/companyBrandAssets';
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
        <img
          src={imgSrc}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
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
    const reduced = isReducedMotionActive();
    const hostEl = experienceMainCardRef.current;
    const targetKey = originMilestoneKey || activeKey;

    setIsBoardDimmed(false);

    if (reduced || !hostEl) {
      clearOrigamiTimers();
      setIsClosingDetailContent(false);
      setShowJobCard(false);
      setAnimPhase('idle');
      setMorphRect(null);
      setOriginMilestoneKey(null);
      setFoldPhase('folded');
      setSelectedFoldIdx(null);
      return;
    }

    window.requestAnimationFrame(() => {
      const originEl = milestoneRefs.current[targetKey] || document.getElementById(`milestone-card-${targetKey}`);
      if (!originEl) {
        setShowJobCard(false);
        setAnimPhase('idle');
        setMorphRect(null);
        setOriginMilestoneKey(null);
        setFoldPhase('folded');
        setSelectedFoldIdx(null);
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

      window.setTimeout(() => {
        setShowJobCard(false);
        setAnimPhase('idle');
        setMorphRect(null);
        setOriginMilestoneKey(null);
        setFoldPhase('folded');
        setSelectedFoldIdx(null);
      }, 720);
    });
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
    const originEl = milestoneRefs.current[key] || document.getElementById(`milestone-card-${key}`);
    const targetBounds = computeTargetBounds();

    const prefersReducedMotion = isReducedMotionActive();

    if (prefersReducedMotion || !hostEl || !originEl || !targetBounds) {
      setMorphRect(targetBounds ? targetBounds : null);
      setAnimPhase('open');
      setIsBoardDimmed(true);
      setFoldPhase('expanded');
      setShowJobCard(true);
      showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
      return;
    }

    const hostRect = hostEl.getBoundingClientRect();
    const cardRect = originEl.getBoundingClientRect();

    setAnimPhase('entering');
    setMorphRect({
      top: cardRect.top - hostRect.top,
      left: cardRect.left - hostRect.left,
      width: cardRect.width,
      height: cardRect.height,
    });
    setIsBoardDimmed(true);

    window.requestAnimationFrame(() => {
      if (detailCardRef.current) {
        void detailCardRef.current.offsetHeight;
      }
      const liveBounds = computeTargetBounds() || targetBounds;
      window.requestAnimationFrame(() => {
        setAnimPhase('open');
        if (liveBounds) {
          setMorphRect({
            top: liveBounds.top,
            left: liveBounds.left,
            width: liveBounds.width,
            height: liveBounds.height,
          });
        }
        setFoldPhase('expanded');
        setShowJobCard(true);
        showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
      });
    });
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
              <img
                src={milestoneData.bannerUrl}
                alt={`Banner ${item.shortName}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
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
                        <img
                          src={photo.src}
                          alt={photo.title || item.shortName}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
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
            'page-main-card floating-surface--main relative flex flex-col items-stretch justify-start select-none text-[var(--text-primary)] glass-scrollbar font-play text-left box-border rounded-[var(--radius-main,14px)] w-full h-full',
            showJobCard ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden',
            'p-0 gap-0'
          )}
          style={{
            padding: '0px',
            borderRadius: 'var(--radius-main, 14px)',
            gap: '0px',
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

      {/* KHUNG TIMELINE SLIDER CARD */}
      {!showJobCard && (
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
      )}

      {/* =====================================================================
          5. THẺ CHI TIẾT CỘT MỐC ĐANG CHỌN (BENTO GRID THEO CODE THAM CHIẾU)
          ===================================================================== */}
      {showJobCard && (() => {
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
        const projectRowPalettes = [
          {
            tone: 'pink',
            rowLight: 'from-rose-50 to-orange-50/40 border-rose-100 hover:border-rose-300',
            rowDark: 'from-rose-950/45 to-slate-900/80 border-rose-500/30 hover:border-rose-400/60',
            badge: 'bg-rose-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-rose-300' : 'group-hover:text-rose-700',
          },
          {
            tone: 'blue',
            rowLight: 'from-blue-50 to-sky-50/40 border-blue-100 hover:border-blue-300',
            rowDark: 'from-blue-950/45 to-slate-900/80 border-blue-500/30 hover:border-blue-400/60',
            badge: 'bg-blue-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-sky-300' : 'group-hover:text-blue-700',
          },
          {
            tone: 'amber',
            rowLight: 'from-amber-50 to-yellow-50/40 border-amber-100 hover:border-amber-300',
            rowDark: 'from-amber-950/45 to-slate-900/80 border-amber-500/30 hover:border-amber-400/60',
            badge: 'bg-amber-500 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-amber-300' : 'group-hover:text-amber-700',
          },
          {
            tone: 'emerald',
            rowLight: 'from-emerald-50 to-teal-50/40 border-emerald-100 hover:border-emerald-300',
            rowDark: 'from-emerald-950/45 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400/60',
            badge: 'bg-emerald-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-700',
          },
          {
            tone: 'purple',
            rowLight: 'from-purple-50 to-fuchsia-50/40 border-purple-100 hover:border-purple-300',
            rowDark: 'from-purple-950/45 to-slate-900/80 border-purple-500/30 hover:border-purple-400/60',
            badge: 'bg-purple-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-purple-300' : 'group-hover:text-purple-700',
          },
          {
            tone: 'indigo',
            rowLight: 'from-indigo-50 to-violet-50/40 border-indigo-100 hover:border-indigo-300',
            rowDark: 'from-indigo-950/45 to-slate-900/80 border-indigo-500/30 hover:border-indigo-400/60',
            badge: 'bg-indigo-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-indigo-300' : 'group-hover:text-indigo-700',
          },
        ];

        const photoBorderAccents = [
          'hover:border-amber-400',
          'hover:border-orange-400',
          'hover:border-emerald-400',
          'hover:border-sky-400',
          'hover:border-purple-400',
          'hover:border-rose-400',
        ];

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

        return (
            <>
            {/* THANH ĐIỀU HƯỚNG CHI TIẾT TĨNH: Nút thu gọn / đóng ở góc trên bên phải */}
            <div
              id="experience-job-detail-toolbar"
              className="w-full flex items-center justify-between mb-[15px]"
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
                className="typo-button px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold font-play cursor-pointer border transition-all hover:scale-105 backdrop-blur-md"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Thu gọn thẻ</span>
              </button>

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
                className="theme-modal-close w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 border backdrop-blur-md shrink-0"
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* BỐ CỤC BENTO GRID CHO CHI TIẾT CÔNG VIỆC */}
            <div
              id="experience-bento-grid"
              data-layout-mode="masonry"
              className="experience-masonry-grid w-full min-w-0"
            >
              {/* HÀNG 1: Thẻ thông tin công ty cùng hàng với Thẻ giới thiệu hành trình */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-stretch w-full min-w-0">
                {/* THẺ 1: Thẻ công ty & Thông tin (Mẫu Thẻ 1: Bento Studio Hero Statement) */}
                <section
                  id="experience-info-card"
                  data-multicolor-bento="true"
                  data-bento-tone="sky"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button, a, video, .exp-bento-hero-banner, input')) return;
                    handleCloseJobCard();
                  }}
                  title="Bấm vào thẻ công ty để thu gọn lại"
                  style={{
                    background: 'var(--surface-secondary-bg, var(--bg-card))',
                    borderColor: 'var(--surface-secondary-border, var(--border-card))',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--surface-secondary-shadow, var(--shadow-card))',
                  }}
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-sky transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl w-full h-full rounded-[var(--radius-card,14px)] p-[15px] overflow-hidden backdrop-blur-md border flex flex-col justify-between gap-[15px] relative group min-w-0 cursor-pointer'
                  )}
                >
                  {/* Bento Studio glowing ambient orb */}
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
                  {/* Banner Video / Image Header */}
                  {activeMilestone.videoCard ? (
                    <div
                      className={cn(
                        'exp-bento-hero-banner relative h-44 sm:h-52 w-full rounded-[var(--radius-banner,14px)] overflow-hidden shrink-0',
                        isDarkSurface || isLeather ? 'bg-slate-900' : 'bg-slate-200'
                      )}
                    >
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
                      <div
                        className={cn(
                          'exp-bento-hero-banner relative h-44 sm:h-52 w-full rounded-[var(--radius-banner,14px)] p-[5px] overflow-hidden shrink-0',
                          isDarkSurface || isLeather ? 'bg-slate-900' : 'bg-slate-200'
                        )}
                      >
                        <img
                          src={activeMilestone.bannerUrl}
                          alt={`Banner ${activeMilestone.company}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => setBannerImgError(true)}
                          style={{ borderRadius: 'calc(var(--radius-banner, 14px) - 5px)' }}
                          className="w-full h-full object-cover object-center transition-opacity duration-700 opacity-100 brightness-105 contrast-105 saturate-105 block"
                        />
                        <div
                          style={{ inset: '5px', borderRadius: 'calc(var(--radius-banner, 14px) - 5px)' }}
                          className={cn(
                            'absolute bg-gradient-to-b from-slate-950/24 via-transparent to-slate-950/12 pointer-events-none'
                          )}
                        />
                      </div>
                    )
                  )}

                  {/* Company Content Body */}
                  <div className="relative flex-1 flex flex-col justify-between gap-[15px] min-w-0">
                    <div
                      id="experience-company-name-card"
                      data-bento-subtone="indigo"
                      style={{
                        background: 'var(--surface-tertiary-bg, var(--bg-subcard))',
                        borderColor: 'var(--surface-tertiary-border, var(--border-subcard))',
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--surface-tertiary-shadow, var(--shadow-subcard))',
                      }}
                      className="exp-bento-item-card w-full p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-3 min-w-0 relative z-10"
                    >
                      <div className="min-w-0 w-full flex flex-col gap-[12px]">
                        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                          <div
                            style={{
                              background: 'var(--bg-badge, var(--bg-highlight))',
                              borderColor: 'var(--border-subcard, var(--border-default))',
                              color: 'var(--text-badge, var(--color-primary))',
                            }}
                            className="exp-bento-light-chip inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold border max-w-full w-fit"
                          >
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-current">{activeMilestone.tag}</span>
                            {activeMilestone.location && (
                              <>
                                <span aria-hidden="true" className="text-current">·</span>
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="text-current">{activeMilestone.location}</span>
                              </>
                            )}
                          </div>

                          {/* Huy hiệu thời gian */}
                          <div
                            style={{
                              background: isWalnutWood
                                ? '#2A190F'
                                : isDarkLeather
                                  ? '#1C1613'
                                  : isBrownLeather
                                    ? '#522E10'
                                    : 'var(--bg-banner-pill, var(--surface-tertiary-bg))',
                              borderColor: isWalnutWood
                                ? 'rgba(245, 196, 120, 0.55)'
                                : isDarkLeather || isBrownLeather
                                  ? 'rgba(245, 222, 179, 0.55)'
                                  : 'var(--border-subcard, var(--border-default))',
                              color: isWalnutWood || isDarkLeather || isBrownLeather ? '#FFF8EE' : 'var(--text-primary)',
                            }}
                            className="px-3 py-1.5 rounded-full typo-caption sm:typo-body-sm font-bold shadow-2xs flex items-center gap-1.5 max-w-full border shrink-0 backdrop-blur-md"
                          >
                            <Calendar className={cn('w-3.5 h-3.5 shrink-0', isDarkCardText ? 'text-rose-400' : 'text-[var(--color-primary)]')} />
                            <span className="truncate exp-bento-preserve-color">
                              {activeMilestone.period} ({activeMilestone.tenure})
                            </span>
                          </div>
                        </div>

                        {(() => {
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
                          const useCompactLogo = inlineLogos.length >= 4;
                          return (
                            <div className="flex flex-wrap items-center gap-[15px] min-w-0 w-full">
                              {/* Logo công ty group theo chiều ngang: tăng gấp đôi, bỏ viền logo */}
                              <div className="flex flex-row items-center justify-start shrink-0 -space-x-2">
                                {inlineLogos.map((logoItem, logoIdx) => (
                                  <div
                                    key={`${logoItem.src}-${logoIdx}`}
                                    style={{
                                      zIndex: inlineLogos.length - logoIdx,
                                      border: 'none',
                                      boxShadow: 'none',
                                      background: 'transparent',
                                    }}
                                    className={cn(
                                      'relative rounded-full bg-transparent overflow-hidden p-0 border-0 ring-0 outline-none flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 hover:z-30',
                                      useCompactLogo
                                        ? 'w-[52px] h-[52px] sm:w-[58px] sm:h-[58px]'
                                        : 'w-[68px] h-[68px] sm:w-[76px] sm:h-[76px]'
                                    )}
                                  >
                                    <img
                                      src={logoItem.src}
                                      alt={logoItem.alt || activeMilestone.company}
                                      loading="lazy"
                                      decoding="async"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        const img = e.currentTarget as HTMLImageElement;
                                        if (logoItem.fallback && img.src !== logoItem.fallback) {
                                          img.src = logoItem.fallback;
                                        }
                                      }}
                                      className="w-full h-full object-contain rounded-full"
                                    />
                                  </div>
                                ))}
                              </div>

                              <h1
                                className={cn(
                                  'typo-h1 font-bold leading-tight break-words min-w-0 max-w-full flex-1',
                                  isDarkCardText ? 'text-white' : 'text-slate-900'
                                )}
                              >
                                {activeMilestone.company}
                                {activeMilestone.subCompanies ? ` ${activeMilestone.subCompanies}` : ''}
                              </h1>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* THẺ THÔNG TIN: Chứa Chức vụ đảm nhận, Quy mô vận hành, Lĩnh vực đảm nhận */}
                    <div
                      id="experience-general-info-card"
                      data-bento-subtone="sky"
                      className={cn(
                        'exp-bento-item-card flex-1 w-full p-[15px] rounded-[var(--radius-subcard,16px)] border shadow-xs flex flex-col justify-between gap-[12px] min-w-0 relative z-10 bg-gradient-to-br',
                        isDarkCardText
                          ? 'from-slate-900/80 via-sky-950/45 to-indigo-950/40 border-sky-400/25 text-white'
                          : 'from-white/95 via-sky-50/75 to-indigo-50/70 border-sky-200/80 text-slate-900'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h2
                          className={cn(
                            'card-header-sync card-title-synced typo-h4 font-bold flex items-center gap-2',
                            isDarkCardText ? 'text-sky-300' : 'text-sky-700'
                          )}
                          data-card-title="true"
                        >
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span>Thông tin</span>
                        </h2>
                        <span
                          className={cn(
                            'exp-bento-light-chip typo-badge font-bold px-2.5 py-0.5 rounded-full border',
                            isDarkCardText
                              ? 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                              : 'bg-sky-100/90 text-sky-800 border-sky-200/85'
                          )}
                        >
                          3 Hạng mục
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] items-stretch min-w-0">
                        {/* Sub-card 1: Chức vụ đảm nhận */}
                        <div
                          data-bento-subtone="amber"
                          className={cn(
                            'exp-bento-item-card flex flex-col justify-between p-[14px] rounded-[var(--radius-subcard,14px)] border min-w-0 gap-2',
                            isDarkCardText
                              ? 'bg-gradient-to-br from-orange-950/55 to-amber-950/38 border-orange-500/28'
                              : 'bg-gradient-to-br from-orange-50/92 to-amber-50/78 border-orange-200/75'
                          )}
                        >
                          <div className={cn('subcard-header-sync flex items-center gap-2', isDarkCardText ? 'text-orange-300' : 'text-orange-600')}>
                            <Briefcase className="w-4 h-4 shrink-0" />
                            <p className="subcard-title-synced typo-label font-semibold tracking-wide" data-subcard-title="true">
                              Chức vụ đảm nhận
                            </p>
                          </div>
                          <p
                            className={cn(
                              'typo-h4 font-bold leading-snug break-words',
                              isDarkCardText ? 'text-white' : 'text-slate-900'
                            )}
                          >
                            {activeMilestone.roleTitle}
                          </p>
                        </div>

                        {/* Sub-card 2: Quy mô vận hành */}
                        <div
                          data-bento-subtone="blue"
                          className={cn(
                            'exp-bento-item-card flex flex-col justify-between p-[14px] rounded-[var(--radius-subcard,14px)] border min-w-0 gap-2',
                            isDarkCardText
                              ? 'bg-gradient-to-br from-blue-950/55 to-indigo-950/38 border-blue-500/28'
                              : 'bg-gradient-to-br from-blue-50/92 to-indigo-50/78 border-blue-200/75'
                          )}
                        >
                          <div className={cn('subcard-header-sync flex items-center gap-2', isDarkCardText ? 'text-sky-400' : 'text-blue-600')}>
                            <Users className="w-4 h-4 shrink-0" />
                            <p className="subcard-title-synced typo-label font-semibold tracking-wide" data-subcard-title="true">
                              Quy mô vận hành
                            </p>
                          </div>
                          <p
                            className={cn(
                              'typo-h4 font-bold leading-snug break-words',
                              isDarkCardText ? 'text-white' : 'text-slate-900'
                            )}
                          >
                            {activeMilestone.scaleDesc || `${activeMilestone.headcount} nhân sự`}
                          </p>
                        </div>

                        {/* Sub-card 3: Lĩnh vực đảm nhận */}
                        <div
                          id="experience-company-services"
                          data-bento-subtone="teal"
                          className={cn(
                            'sm:col-span-2 exp-bento-item-card rounded-[var(--radius-subcard,14px)] p-[14px] border flex flex-col justify-between gap-2.5 min-w-0 bg-gradient-to-br',
                            isDarkCardText
                              ? 'from-teal-950/52 via-slate-900/70 to-emerald-950/42 border-teal-500/28 text-white'
                              : 'from-teal-50/88 via-white/90 to-emerald-50/78 border-teal-200/78 text-slate-900'
                          )}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div
                              className={cn(
                                'subcard-header-sync flex items-center gap-1.5',
                                isDarkCardText ? 'text-teal-300' : 'text-teal-700'
                              )}
                            >
                              <Layers className="w-4 h-4 shrink-0" />
                              <p className="subcard-title-synced typo-label font-semibold tracking-wide" data-subcard-title="true">
                                Lĩnh vực đảm nhận
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={navigateToServices}
                              className={cn(
                                'px-2 py-0.5 rounded-full typo-badge font-semibold border flex items-center gap-1 cursor-pointer transition-colors shrink-0',
                                isDarkCardText
                                  ? 'bg-teal-500/15 border-teal-400/30 text-teal-200 hover:bg-teal-500/30'
                                  : 'bg-white/95 border-teal-300 text-teal-800 hover:bg-teal-100'
                              )}
                              title="Xem chi tiết Lĩnh vực & Dịch vụ"
                            >
                              <span className="text-current">{derivedServicesList.length} dịch vụ</span>
                              <ArrowUpRight className="w-3 h-3 shrink-0" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5 min-w-0">
                            {derivedServicesList.map((serviceName, idx) => {
                              const { Icon, chipClass, iconClass } = getIndustryChipVisual(serviceName, idx);
                              return (
                                <button
                                  key={serviceName}
                                  type="button"
                                  onClick={navigateToServices}
                                  title={`${serviceName} — Click để xem chi tiết dịch vụ`}
                                  className={cn(
                                    'exp-bento-light-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border typo-label font-semibold leading-snug transition-colors cursor-pointer',
                                    chipClass
                                  )}
                                >
                                  <Icon className={cn('w-3.5 h-3.5 shrink-0', iconClass)} />
                                  <span className="text-current">{serviceName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* THẺ 2: Giới thiệu hành trình (cùng hàng với Thẻ thông tin) */}
                <section
                  id="experience-banner-card"
                  data-multicolor-bento="true"
                  data-bento-tone="pink"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-pink transition-all duration-300 hover:-translate-y-0.5 w-full h-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border min-w-0 flex flex-col justify-between gap-[15px]',
                    isDarkCardText
                      ? 'bg-gradient-to-br from-rose-950/52 via-slate-900/75 to-pink-950/42 border-rose-500/28 text-white'
                      : 'bg-gradient-to-br from-rose-50/92 via-pink-50/80 to-orange-50/88 border-rose-200/75 text-slate-900'
                  )}
                >
                  <div className="flex flex-col gap-[15px] min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2
                        className={cn(
                          'card-header-sync card-title-synced typo-h3 font-bold flex items-center gap-2',
                          isDarkCardText ? 'text-rose-300' : 'text-rose-700'
                        )}
                        data-card-title="true"
                      >
                        <BookOpen className={cn('w-5 h-5 sm:w-6 sm:h-6 shrink-0', isDarkCardText ? 'text-rose-300' : 'text-rose-700')} />
                        <span>Giới thiệu hành trình</span>
                      </h2>
                      <span
                        className={cn(
                          'exp-bento-light-chip typo-caption font-semibold px-3 py-1 rounded-full border self-start sm:self-auto',
                          isDarkCardText
                            ? 'bg-rose-500/15 border-rose-400/30 text-rose-200'
                            : 'bg-white/85 border-rose-200/90 text-rose-700'
                        )}
                      >
                        {narrativeTitle}
                      </span>
                    </div>

                    {(activeMilestone.highlightText || activeMilestone.cardDescription) && (
                      <p
                        data-bento-subtone="pink"
                        className={cn(
                          'exp-bento-item-card typo-body-sm leading-relaxed p-[15px] rounded-[var(--radius-subcard,16px)] border break-words bg-gradient-to-r m-0',
                          isDarkCardText
                            ? 'from-rose-950/48 to-slate-900/72 border-rose-400/25 text-slate-200'
                            : 'from-white/90 to-rose-50/82 border-rose-200/80 text-slate-800'
                        )}
                      >
                        {activeMilestone.highlightText || activeMilestone.cardDescription}
                      </p>
                    )}

                    {introBlocks.length > 0 && (
                      <div className="grid grid-cols-1 gap-[12px] items-start">
                        {introBlocks.map((item, idx) => {
                          const colStyle = introColumnStyles[idx % introColumnStyles.length];
                          const ColIcon = colStyle.Icon;
                          return (
                            <div
                              key={idx}
                              data-bento-subtone={colStyle.tone}
                              className={cn(
                                'exp-bento-item-card p-[15px] rounded-[var(--radius-subcard,16px)] border shadow-sm min-w-0 h-fit flex flex-col gap-2.5',
                                isDarkCardText ? colStyle.darkBg : colStyle.lightBg
                              )}
                            >
                              <h3
                                className={cn(
                                  'subcard-header-sync subcard-title-synced font-bold typo-h4 flex items-center gap-1.5 m-0',
                                  colStyle.iconColor
                                )}
                                data-subcard-title="true"
                              >
                                <ColIcon className="w-4 h-4 shrink-0" />
                                <span className="break-words text-current">{item.title}</span>
                              </h3>
                              <p
                                className={cn(
                                  'typo-body-sm leading-relaxed break-words m-0',
                                  isDarkCardText ? 'text-slate-300' : 'text-slate-700'
                                )}
                              >
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start sm:items-center gap-[15px] bg-gradient-to-r from-rose-600 to-pink-600 text-white p-[15px] rounded-[var(--radius-subcard,16px)] shadow-sm">
                    <Gauge className="w-5 h-5 text-amber-300 shrink-0 mt-0.5 sm:mt-0" />
                    <p className="typo-body-sm font-medium leading-snug text-white break-words exp-bento-preserve-color m-0">
                      {philosophyText}
                    </p>
                  </div>
                </section>
              </div>

              {/* HÀNG 2: Danh sách công việc cùng hàng và cùng chiều cao với Danh sách dự án */}
              <div
                id="experience-tasks-projects-row"
                className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-stretch w-full min-w-0"
              >
                {/* THẺ: Danh sách công việc */}
                <section
                  id="experience-responsibility-card"
                  data-multicolor-bento="true"
                  data-bento-tone="purple"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-purple transition-all duration-300 hover:-translate-y-0.5 w-full h-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border min-w-0 flex flex-col gap-[15px]',
                    isDarkCardText
                      ? 'bg-gradient-to-b from-purple-950/55 via-slate-900/74 to-violet-950/48 border-purple-500/28 text-white'
                      : 'bg-gradient-to-b from-purple-50/92 via-violet-50/78 to-fuchsia-50/85 border-purple-200/75 text-slate-900'
                  )}
                >
                  <div className="flex items-center justify-between gap-2 shrink-0">
                    <h2
                      className={cn(
                        'card-header-sync card-title-synced typo-h4 font-bold flex items-center gap-2',
                        isDarkCardText ? 'text-purple-300' : 'text-purple-700'
                      )}
                      data-card-title="true"
                    >
                      <ListChecks className="w-5 h-5 shrink-0" />
                      <span>Danh sách công việc</span>
                    </h2>
                    <span
                      className={cn(
                        'exp-bento-light-chip typo-badge font-bold px-2.5 py-1 rounded-full shrink-0 tabular-nums border',
                        isDarkCardText
                          ? 'bg-purple-500/20 text-purple-200 border-purple-400/30'
                          : 'bg-purple-100/90 text-purple-800 border-purple-200/80'
                      )}
                    >
                      {tasksList.length} Hạng mục
                    </span>
                  </div>

                  {/* Danh sách công việc: Dạng list co giãn đồng bộ chiều cao với Danh sách dự án */}
                  <div
                    data-bento-subtone="purple"
                    className={cn(
                      'exp-bento-item-card flex-1 flex flex-col rounded-[var(--radius-subcard,16px)] border overflow-hidden',
                      isDarkCardText
                        ? 'bg-slate-900/65 border-purple-500/25 text-slate-100'
                        : 'bg-white/90 border-purple-200/80 text-slate-800'
                    )}
                  >
                    <ul
                      className={cn(
                        'flex-1 flex flex-col justify-between divide-y typo-body-sm m-0 p-0 list-none',
                        isDarkCardText ? 'divide-purple-500/20' : 'divide-purple-200/60'
                      )}
                    >
                      {tasksList.map((task, idx) => {
                        const cleanTask = task.replace(/^\d+\.\s*/, '');
                        const taskPalette = taskCardPalettes[idx % taskCardPalettes.length];
                        return (
                          <li
                            key={idx}
                            className="flex-1 px-3.5 py-2.5 flex items-center gap-3 min-w-0 transition-colors hover:bg-purple-500/5"
                          >
                            <span
                              className={cn(
                                'w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 tabular-nums exp-bento-preserve-color',
                                taskPalette.badge
                              )}
                            >
                              {idx + 1}
                            </span>
                            <span className="leading-snug break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                              {cleanTask}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>

                {/* THẺ: Danh sách dự án (cùng chiều cao với Danh sách công việc) */}
                <section
                  id="experience-achievement-card"
                  data-multicolor-bento="true"
                  data-bento-tone="blue"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-blue transition-all duration-300 hover:-translate-y-0.5 w-full h-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border flex flex-col gap-[15px] min-w-0',
                    isDarkCardText
                      ? 'bg-gradient-to-br from-blue-950/55 via-slate-900/74 to-indigo-950/48 border-blue-500/28 text-white'
                      : 'bg-gradient-to-br from-blue-50/92 via-indigo-50/78 to-sky-50/88 border-blue-200/75 text-slate-900'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <h2
                      className={cn(
                        'card-header-sync card-title-synced typo-h4 font-bold flex items-center gap-2',
                        isDarkCardText ? 'text-orange-300' : 'text-orange-700'
                      )}
                      data-card-title="true"
                    >
                      <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                      <span>Danh sách dự án</span>
                    </h2>

                    <button
                      type="button"
                      onClick={() => navigateToProjects()}
                      className={cn(
                        'px-3 py-1.5 rounded-full typo-badge font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0',
                        isDarkCardText
                          ? 'bg-orange-500/15 border-orange-400/30 text-orange-200 hover:bg-orange-500 hover:text-white'
                          : 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-600 hover:text-white hover:border-orange-600'
                      )}
                      title="Chuyển đến trang Dự án"
                    >
                      <span className="text-current">Tất cả dự án</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  <div
                    data-bento-subtone="blue"
                    className={cn(
                      'exp-bento-item-card flex-1 flex flex-col rounded-[var(--radius-subcard,16px)] border overflow-hidden',
                      isDarkCardText
                        ? 'bg-slate-900/65 border-blue-500/25'
                        : 'bg-white/90 border-blue-200/80'
                    )}
                  >
                    <ul
                      className={cn(
                        'flex-1 flex flex-col justify-between divide-y m-0 p-0 list-none',
                        isDarkCardText ? 'divide-blue-500/20' : 'divide-blue-200/60'
                      )}
                    >
                      {projectsList.map((proj, pIdx) => {
                        const palette = projectRowPalettes[pIdx % projectRowPalettes.length];
                        return (
                          <li key={pIdx} className="flex-1 flex min-w-0">
                            <button
                              type="button"
                              onClick={() => navigateToProjects(proj.projectId)}
                              title={`${proj.rawTitle} — Click để mở liên kết dự án`}
                              className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors hover:bg-blue-500/10 group focus-visible:outline-none"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span
                                  className={cn(
                                    'px-2 py-0.5 rounded-md font-bold text-[11px] shrink-0 tabular-nums exp-bento-preserve-color',
                                    palette.badge
                                  )}
                                >
                                  {proj.code}
                                </span>
                                <span
                                  className={cn(
                                    'typo-body-sm font-semibold leading-snug break-words min-w-0 flex-1 underline-offset-2 group-hover:underline',
                                    isDarkCardText ? 'text-white' : 'text-slate-900',
                                    palette.titleHover
                                  )}
                                >
                                  {proj.title}
                                </span>
                              </div>
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 text-[11.5px] font-bold shrink-0',
                                  isDarkCardText
                                    ? 'text-sky-300 group-hover:text-sky-200'
                                    : 'text-blue-600 group-hover:text-blue-700'
                                )}
                              >
                                <span className="hidden sm:inline">Mở link</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>
              </div>

              {/* HÀNG 3: Hình ảnh kỷ niệm */}
              <section
                id="experience-memories-card"
                data-multicolor-bento="true"
                data-bento-tone="amber"
                className={cn(
                  'experience-masonry-item exp-bento-surface-card bento-tone-amber transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border relative overflow-hidden flex flex-col gap-[15px] min-w-0 h-auto',
                  isDarkCardText
                    ? 'bg-gradient-to-br from-amber-950/55 via-slate-900/74 to-orange-950/48 border-amber-500/28 text-white'
                    : 'bg-gradient-to-br from-amber-50/92 via-orange-50/78 to-yellow-50/88 border-amber-200/78 text-slate-900'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <h2
                    className={cn(
                      'card-header-sync card-title-synced typo-h4 font-bold flex items-center gap-2',
                      isDarkCardText ? 'text-amber-400' : 'text-amber-700'
                    )}
                    data-card-title="true"
                  >
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    <span>Hình ảnh kỷ niệm</span>
                  </h2>
                  {photosList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        setCarouselSlideIdx(0);
                        setIsPhotoLightboxOpen(true);
                      }}
                      className={cn(
                        'typo-badge flex items-center gap-1 shrink-0 cursor-pointer transition-colors font-semibold px-2.5 py-1 rounded-full border',
                        isDarkCardText
                          ? 'bg-amber-500/15 border-amber-400/30 text-amber-200 hover:bg-amber-500/30'
                          : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                      )}
                      title="Phóng to thư viện ảnh kỷ niệm"
                    >
                      <ZoomIn
                        className={cn(
                          'w-3.5 h-3.5 shrink-0',
                          isDarkCardText ? 'text-amber-300' : 'text-amber-700'
                        )}
                      />
                      <span className="text-current">Phóng to ({photosList.length})</span>
                    </button>
                  )}
                </div>

                {photosList.length > 0 ? (
                  <div
                    className={cn(
                      'grid gap-[12px] content-start',
                      photosList.length === 1
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : photosList.length === 2
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : photosList.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-2 sm:grid-cols-4'
                    )}
                  >
                    {photosList.map((photo, pIdx) => {
                      const hasImgFailed = Boolean(failedPhotoSrcs[photo.src]);
                      const borderHover = photoBorderAccents[pIdx % photoBorderAccents.length];
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
                          aria-label={`Phóng to hình kỷ niệm ${pIdx + 1}: ${photo.title || activeMilestone.company}`}
                          style={{ padding: '0px', borderRadius: 'var(--radius-card, 14px)' }}
                          className={cn(
                            'exp-bento-rect-btn group relative rounded-[var(--radius-card,14px)] overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer p-0 text-left w-full aspect-[16/10]',
                            isDarkSurface
                              ? 'bg-slate-800 border-slate-700/70'
                              : isWalnutWood
                                ? 'bg-[#2A190F] border-[#F5C478]/40'
                                : isDarkLeather
                                  ? 'bg-[#1C1613] border-[#F5DEB3]/40'
                                  : isBrownLeather
                                    ? 'bg-[#522E10] border-[#F5DEB3]/35'
                                    : 'bg-white/80 border-slate-200/90 shadow-xs',
                            borderHover
                          )}
                        >
                          {!hasImgFailed ? (
                            <img
                              src={photo.src}
                              alt={photo.title || activeMilestone.company}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                              onError={() =>
                                setFailedPhotoSrcs((prev) => ({ ...prev, [photo.src]: true }))
                              }
                              style={{ borderRadius: 'calc(var(--radius-card, 14px) - 1px)' }}
                              className="w-full h-full object-cover block"
                            />
                          ) : (
                            <div
                              className={cn(
                                'w-full h-full flex flex-col items-center justify-center gap-[12px] p-[12px]',
                                isDarkSurface
                                  ? 'bg-slate-800 text-slate-300'
                                  : isWalnutWood
                                    ? 'bg-[#2A190F] text-[#FFFBF4]'
                                    : isDarkLeather
                                      ? 'bg-[#1C1613] text-[#FFF8EE]'
                                      : isBrownLeather
                                        ? 'bg-[#522E10] text-[#FFF8DC]'
                                        : 'bg-slate-100 text-slate-700'
                              )}
                            >
                              <Camera
                                className={cn(
                                  'w-6 h-6',
                                  isDarkCardText ? 'text-amber-400' : 'text-amber-600'
                                )}
                              />
                              <span className="typo-caption font-semibold text-center truncate max-w-full">
                                {photo.title || activeMilestone.company}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between gap-2 p-2.5">
                            <span className="typo-caption font-semibold text-white truncate exp-bento-preserve-color">
                              {photo.title || `Kỷ niệm #${pIdx + 1}`}
                            </span>
                            <ZoomIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex-1 min-h-[120px] rounded-[var(--radius-subcard,16px)] border p-[15px] flex items-center justify-center',
                      isDarkSurface
                        ? 'bg-slate-800/70 border-slate-700 text-slate-300'
                        : isWalnutWood
                          ? 'bg-[#2A190F] border-[#F5C478]/40 text-[#FFFBF4]'
                          : isDarkLeather
                            ? 'bg-[#1C1613] border-[#F5DEB3]/35 text-[#FFF8EE]'
                            : isBrownLeather
                              ? 'bg-[#522E10] border-[#F5DEB3]/35 text-[#FFF8DC]'
                              : 'bg-white/75 border-slate-200/80 text-slate-700'
                    )}
                  >
                    <span className="typo-body-sm">
                      Chưa có hình ảnh kỷ niệm cho cột mốc này.
                    </span>
                  </div>
                )}
              </section>

              {/* HÀNG 4: Cam kết chất lượng cùng hàng với Kết quả đạt được */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-stretch w-full min-w-0">
  {/* THẺ 4: CAM KẾT CHẤT LƯỢNG */}
                <section
                  id="experience-commitments-card"
                  data-multicolor-bento="true"
                  data-bento-tone="cyan"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-cyan transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md relative overflow-hidden flex flex-col gap-[15px] min-w-0 h-auto border',
                    isDarkSurface || isLeather
                      ? 'text-white bg-gradient-to-br from-cyan-950/55 via-slate-900/74 to-teal-950/48 border-cyan-500/28'
                      : 'text-slate-900 bg-gradient-to-br from-cyan-50/92 via-teal-50/78 to-sky-50/88 border-cyan-200/75'
                  )}
                >
                    <div
                      className={cn(
                        'card-header-sync flex items-center gap-2.5 relative z-10',
                        isWalnutWood
                          ? 'text-[#F5C478]'
                          : isDarkLeather
                            ? 'text-[#E5B87E]'
                            : isBrownLeather
                              ? 'text-amber-300'
                              : isDarkSurface
                                ? 'text-teal-300'
                                : 'text-teal-700'
                      )}
                    >
                      <ShieldCheck className={cn("w-6 h-6 shrink-0", isWalnutWood ? 'text-[#F5C478]' : isDarkLeather ? 'text-[#E5B87E]' : isBrownLeather ? 'text-amber-300' : isDarkSurface ? 'text-teal-300' : 'text-teal-700')} />
                      <h2
                        className="card-title-synced typo-h4 font-bold"
                        data-card-title="true"
                      >
                        Cam kết chất lượng
                      </h2>
                    </div>

                    <div className="flex flex-col gap-[12px] relative z-10">
                      {commitmentsList.map((cmtText, cIdx) => {
                        const CmtIcon = cIdx % 2 === 0 ? Flame : Lock;
                        const cmtSubtone = cIdx % 2 === 0 ? 'amber' : 'teal';
                        const cmtIconColor = isWalnutWood
                          ? cIdx % 2 === 0
                            ? 'text-[#F5C478]'
                            : 'text-[#F5E9D6]'
                          : isDarkLeather
                            ? cIdx % 2 === 0
                              ? 'text-[#E5B87E]'
                              : 'text-[#E9DFD3]'
                            : isBrownLeather
                              ? cIdx % 2 === 0
                                ? 'text-amber-300'
                                : 'text-cyan-200'
                              : isDarkSurface
                                ? cIdx % 2 === 0
                                  ? 'text-amber-300'
                                  : 'text-teal-300'
                                : cIdx % 2 === 0
                                  ? 'text-amber-600'
                                  : 'text-teal-700';
                        return (
                          <div
                            key={cIdx}
                            data-bento-subtone={cmtSubtone}
                            className={cn(
                              'exp-bento-item-card rounded-[var(--radius-subcard,14px)] p-[15px] flex items-start gap-[15px] min-w-0 border bg-gradient-to-r',
                              isDarkCardText
                                ? cIdx % 2 === 0
                                  ? 'from-amber-950/48 to-slate-900/70 border-amber-500/25'
                                  : 'from-teal-950/48 to-slate-900/70 border-teal-500/25'
                                : cIdx % 2 === 0
                                  ? 'from-amber-50/88 to-orange-50/70 border-amber-200/75'
                                  : 'from-teal-50/88 to-cyan-50/70 border-teal-200/75'
                            )}
                          >
                            <CmtIcon className={cn('w-5 h-5 shrink-0 mt-0.5', cmtIconColor)} />
                            <p
                              className={cn(
                                'typo-body-sm font-medium leading-snug break-words min-w-0 flex-1',
                                isDarkSurface || isLeather
                                  ? 'text-white'
                                  : 'text-slate-800'
                              )}
                            >
                              {cmtText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                </section>

  {/* THẺ 3: KẾT QUẢ ĐẠT ĐƯỢC (KPIs & THÀNH TỰU ĐO LƯỜNG) */}
                {kpisList.length > 0 && (
                  <section
                    id="experience-results-card"
                    data-element-name="Thẻ Kết quả đạt được"
                    data-element-type="card"
                    data-multicolor-bento="true"
                    data-bento-tone="emerald"
                    className={cn(
                      'experience-masonry-item exp-bento-surface-card bento-tone-emerald transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,14px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border min-w-0 h-auto flex flex-col gap-[15px]',
                      isDarkCardText
                        ? 'bg-gradient-to-br from-emerald-950/55 via-slate-900/74 to-cyan-950/48 border-emerald-500/28 text-white'
                        : 'bg-gradient-to-br from-emerald-50/92 via-teal-50/80 to-cyan-50/88 border-emerald-200/75 text-slate-900'
                    )}
                  >
                      <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                        <h2
                          className={cn(
                            'card-header-sync card-title-synced typo-h4 font-bold flex items-center gap-2',
                            isDarkCardText ? 'text-emerald-300' : 'text-emerald-700'
                          )}
                          data-card-title="true"
                        >
                          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                          <span>Kết quả đạt được</span>
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              'exp-bento-light-chip typo-badge font-bold px-2.5 py-1 rounded-full shrink-0 tabular-nums border',
                              isDarkCardText
                                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                                : 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80'
                            )}
                          >
                            {kpisList.length} Chỉ số
                          </span>
                        </div>
                      </div>

                      {/* Kết quả đạt được: sub card 1 hàng */}
                      <div
                        style={{
                          gridTemplateColumns: `repeat(${Math.max(1, kpisList.length)}, minmax(135px, 1fr))`,
                        }}
                        className="grid gap-[12px] items-stretch min-w-0 overflow-x-auto no-scrollbar relative z-10"
                      >
                        {kpisList.map((kpi, kIdx) => {
                          const kpiPalettes = [
                            {
                              tone: 'emerald',
                              light: 'from-emerald-50/90 to-teal-50/65 border-emerald-200/80',
                              dark: 'from-emerald-950/50 to-teal-950/35 border-emerald-500/30',
                              value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-emerald-300' : 'text-emerald-700',
                              bar: 'from-emerald-500 to-teal-500',
                              icon: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
                            },
                            {
                              tone: 'sky',
                              light: 'from-sky-50/90 to-blue-50/65 border-sky-200/80',
                              dark: 'from-sky-950/50 to-blue-950/35 border-sky-500/30',
                              value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-sky-300' : 'text-blue-700',
                              bar: 'from-sky-500 to-blue-600',
                              icon: isDarkCardText ? 'text-sky-300' : 'text-blue-600',
                            },
                            {
                              tone: 'amber',
                              light: 'from-amber-50/90 to-orange-50/65 border-amber-200/80',
                              dark: 'from-amber-950/50 to-orange-950/35 border-amber-500/30',
                              value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-amber-300' : 'text-orange-700',
                              bar: 'from-amber-500 to-orange-500',
                              icon: isDarkCardText ? 'text-amber-300' : 'text-orange-600',
                            },
                            {
                              tone: 'purple',
                              light: 'from-purple-50/90 to-indigo-50/65 border-purple-200/80',
                              dark: 'from-purple-950/50 to-indigo-950/35 border-purple-500/30',
                              value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-purple-300' : 'text-purple-700',
                              bar: 'from-purple-500 to-indigo-600',
                              icon: isDarkCardText ? 'text-purple-300' : 'text-purple-600',
                            },
                          ];
                          const pal = kpiPalettes[kIdx % kpiPalettes.length];
                          const clampedPercent = Math.min(100, Math.max(0, Number(kpi.percent) || 0));
                          return (
                            <div
                              key={`${kpi.label}-${kIdx}`}
                              data-bento-subtone={pal.tone}
                              className={cn(
                                'exp-bento-item-card p-[13px] rounded-[var(--radius-subcard,14px)] border bg-gradient-to-br flex flex-col justify-between gap-2.5 min-w-0 h-full shadow-xs transition-all hover:shadow-md',
                                isDarkCardText ? pal.dark : pal.light
                              )}
                            >
                              <div className="flex items-center justify-between gap-2 min-w-0">
                                <span className="inline-flex items-center justify-center shrink-0">
                                  {kIdx % 2 === 0 ? (
                                    <TrendingUp className={cn('w-5 h-5 shrink-0', pal.icon)} />
                                  ) : (
                                    <CheckCircle2 className={cn('w-5 h-5 shrink-0', pal.icon)} />
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    'typo-kpi font-bold tabular-nums tracking-tight shrink-0 exp-bento-preserve-color',
                                    pal.value
                                  )}
                                >
                                  {kpi.displayValue}
                                </span>
                              </div>

                              <p
                                className={cn(
                                  'typo-h5 font-semibold leading-snug break-words',
                                  isDarkCardText ? 'text-slate-100' : 'text-slate-800'
                                )}
                              >
                                {kpi.label}
                              </p>

                              <div
                                className={cn(
                                  'w-full h-2 rounded-full overflow-hidden',
                                  isDarkCardText ? 'bg-white/10' : 'bg-slate-200/85'
                                )}
                                role="progressbar"
                                aria-valuenow={clampedPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${kpi.label}: ${kpi.displayValue}`}
                              >
                                <div
                                  className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', pal.bar)}
                                  style={{ width: `${clampedPercent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
              </div>

            </div>
          </>
      );
    })()}
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
                <img
                  src={curPhoto.src}
                  alt={curPhoto.title || activeMilestone.company}
                  decoding="async"
                  referrerPolicy="no-referrer"
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
                      className="theme-modal-close absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <WebIcon name="chevron-left" className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCarouselSlideIdx((prev) => (prev + 1) % lightboxPhotos.length)
                      }
                      aria-label="Ảnh tiếp theo"
                      className="theme-modal-close absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <WebIcon name="chevron-right" className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label="Đóng trình xem ảnh"
                  onClick={() => setIsPhotoLightboxOpen(false)}
                  className="theme-modal-close absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center typo-button cursor-pointer"
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
