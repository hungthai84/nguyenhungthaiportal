'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';

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
import { DOMAINS_DATA } from '@/data/domains';
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
      ? 'w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]'
      : total > 1
        ? 'w-[38px] h-[38px] sm:w-[40px] sm:h-[40px]'
        : 'w-[46px] h-[46px]';

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
        marginTop: isStacked && index > 0 ? (total >= 4 ? '-10px' : '-12px') : '0px',
        zIndex: total - index,
        background: 'var(--surface-secondary-bg, var(--bg-card))',
        border: 'none',
        boxShadow: 'var(--shadow-subcard, 0 6px 14px -4px rgba(15, 23, 42, 0.22))',
      }}
      title={`${logo.alt} — Nhấn vào logo để xem chi tiết công việc tại ${companyName}`}
      aria-label={`Xem chi tiết công việc tại ${companyName} (${logo.alt})`}
      className={cn(
        sizeClass,
        'relative aspect-square rounded-full p-0 border-0 ring-0 outline-none flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 hover:scale-110 hover:z-30 active:scale-95 cursor-pointer focus-visible:outline-none'
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
  '2003': {
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
  '2003': {
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
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'black-cowhide-leather' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-frost-ice-neu';
  const isBrownLeather = cardStyle === 'cowhide-leather';
  const isBlackLeather = cardStyle === 'black-cowhide-leather';
  const isLeather = isBrownLeather || isBlackLeather;
  const isDarkSurface = isDark && !isLeather;
  const isDarkCardText = isDarkSurface || isLeather;

  const [internalActiveKey, setInternalActiveKey] = useState<string>(activeKeyProp || '2013');
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

  // States cho Timeline hiệu ứng xếp giấy Chromatic Folds
  const [chosenFoldIdx, setChosenFoldIdx] = useState<number>(0);
  const [hoveredFoldIdx, setHoveredFoldIdx] = useState<number | null>(null);
  const [unfoldingFoldIdx, setUnfoldingFoldIdx] = useState<number | null>(null);
  const [isMobileFoldView, setIsMobileFoldView] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const boardRef = useRef<HTMLElement | null>(null);
  const detailCardRef = useRef<HTMLElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const didDragRef = useRef<boolean>(false);
  const lastWheelTimeRef = useRef<number>(0);
  const unfoldTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (unfoldTimerRef.current !== null) {
        window.clearTimeout(unfoldTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showJobCard) {
      setUnfoldingFoldIdx(null);
    }
  }, [showJobCard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPhotoLightboxOpen) {
          setIsPhotoLightboxOpen(false);
          return;
        }
        if (showJobCard) {
          setShowJobCard(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard, isPhotoLightboxOpen]);

  const activeMilestone = EXPERIENCE_MILESTONES[activeKey] || EXPERIENCE_MILESTONES['2013'];

  const [failedPhotoSrcs, setFailedPhotoSrcs] = useState<Record<string, boolean>>({});
  const [bannerImgError, setBannerImgError] = useState<boolean>(false);

  useEffect(() => {
    setFailedPhotoSrcs({});
    setBannerImgError(false);
    if (showJobCard && detailCardRef.current) {
      detailCardRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeKey, showJobCard]);

  const handleOpenJobCard = (key: string, idxOverride?: number) => {
    if (unfoldTimerRef.current !== null) {
      window.clearTimeout(unfoldTimerRef.current);
      unfoldTimerRef.current = null;
    }

    const matchedIdx =
      typeof idxOverride === 'number'
        ? idxOverride
        : roadmapCards.findIndex((c) => c.key === key || (key === '2014' && c.key === '2013'));

    if (matchedIdx >= 0) {
      setChosenFoldIdx(matchedIdx);
    }
    setHoveredFoldIdx(null);
    setActiveKey(key);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || matchedIdx < 0) {
      setUnfoldingFoldIdx(null);
      setShowJobCard(true);
      showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
      return;
    }

    setUnfoldingFoldIdx(matchedIdx);
    const unfoldDurationMs = isMobileFoldView ? 260 : 540;
    unfoldTimerRef.current = window.setTimeout(() => {
      setUnfoldingFoldIdx(null);
      setShowJobCard(true);
      unfoldTimerRef.current = null;
      showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
    }, unfoldDurationMs);
  };

  // Giữ nguyên 100% dữ liệu 8 cột mốc từ website, áp dụng hệ màu & bố cục từ mẫu đính kèm
  const roadmapCards = [
    {
      key: '2003',
      yearBadge: 'Năm 2003',
      companyLine1: 'Công ty',
      companyLine2: 'Viễn thông MobiFone',
      shortName: 'Công ty Viễn thông MobiFone',
      roleSummary: 'Nhân viên CSKH',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2003']?.cardDescription || '',
      logo: 'https://lh3.googleusercontent.com/d/16eGo8HBN14fjf9g3iPz6YjZdJCPrmLLX',
      productSummary: 'MobiFone Di Động',
      products: [
        { name: 'MobiFone', logo: 'https://lh3.googleusercontent.com/d/16eGo8HBN14fjf9g3iPz6YjZdJCPrmLLX' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/16eGo8HBN14fjf9g3iPz6YjZdJCPrmLLX',
          fallback: 'https://lh3.googleusercontent.com/d/16eGo8HBN14fjf9g3iPz6YjZdJCPrmLLX',
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
      logo: 'https://lh3.googleusercontent.com/d/1bRIA01aG_FBN5nrFyQczwOBEPXl1lO0r',
      productSummary: 'Call 247 Quốc Tế',
      products: [
        { name: 'Call 247', logo: 'https://lh3.googleusercontent.com/d/1bRIA01aG_FBN5nrFyQczwOBEPXl1lO0r' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1bRIA01aG_FBN5nrFyQczwOBEPXl1lO0r',
          fallback: 'https://lh3.googleusercontent.com/d/1bRIA01aG_FBN5nrFyQczwOBEPXl1lO0r',
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
      logo: 'https://lh3.googleusercontent.com/d/1abaPHlTrYu7tZl6vSCtEruWQ_qUUCdBH',
      productSummary: 'Truyền hình Cáp HTVC',
      products: [
        { name: 'HTVC', logo: 'https://lh3.googleusercontent.com/d/1eZFAQSz3jBKymiWy_vhswUjO7HF0bBE_' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1abaPHlTrYu7tZl6vSCtEruWQ_qUUCdBH',
          fallback: 'https://lh3.googleusercontent.com/d/1abaPHlTrYu7tZl6vSCtEruWQ_qUUCdBH',
          alt: 'Logo LBC',
        },
        {
          src: 'https://lh3.googleusercontent.com/d/1eZFAQSz3jBKymiWy_vhswUjO7HF0bBE_',
          fallback: 'https://lh3.googleusercontent.com/d/1eZFAQSz3jBKymiWy_vhswUjO7HF0bBE_',
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
      logo: 'https://lh3.googleusercontent.com/d/1Mr7QbcTxwqb2h_RRzMzxHqs3kFORpbYL',
      productSummary: 'Shopee · Garena · AirPay · GCafe',
      products: [
        { name: 'VED', logo: 'https://lh3.googleusercontent.com/d/1Mr7QbcTxwqb2h_RRzMzxHqs3kFORpbYL' },
        { name: 'Garena', logo: 'https://lh3.googleusercontent.com/d/1xlSa23bzlZKpRB1Pc4NxoLckK--PUAa7' },
        { name: 'GCafe', logo: 'https://lh3.googleusercontent.com/d/1-CTafAdaDF5JJZAeUcWwWNIULmm10ZIj' },
        { name: 'ShopeePay', logo: 'https://lh3.googleusercontent.com/d/1cJWJPhsaihMHclFOYHJromAEGYIUoOAC' },
        { name: 'Shopee', logo: 'https://lh3.googleusercontent.com/d/1V_wb5gQTZAIWB2vA2iBjk5KMyf0PUOjP' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1Mr7QbcTxwqb2h_RRzMzxHqs3kFORpbYL',
          fallback: 'https://lh3.googleusercontent.com/d/1v-FBxPLdWKF45qqt2nrmga_2aw2v20nZ',
          alt: 'Logo VED',
        },
        {
          src: 'https://lh3.googleusercontent.com/d/1xlSa23bzlZKpRB1Pc4NxoLckK--PUAa7',
          fallback: 'https://lh3.googleusercontent.com/d/1xlSa23bzlZKpRB1Pc4NxoLckK--PUAa7',
          alt: 'Logo Garena',
        },
        {
          src: 'https://lh3.googleusercontent.com/d/1-CTafAdaDF5JJZAeUcWwWNIULmm10ZIj',
          fallback: 'https://lh3.googleusercontent.com/d/1-CTafAdaDF5JJZAeUcWwWNIULmm10ZIj',
          alt: 'Logo GCafe',
        },
        {
          src: 'https://lh3.googleusercontent.com/d/1cJWJPhsaihMHclFOYHJromAEGYIUoOAC',
          fallback: 'https://lh3.googleusercontent.com/d/1cJWJPhsaihMHclFOYHJromAEGYIUoOAC',
          alt: 'Logo AirPay ShopeePay',
        },
        {
          src: 'https://lh3.googleusercontent.com/d/1V_wb5gQTZAIWB2vA2iBjk5KMyf0PUOjP',
          fallback: 'https://lh3.googleusercontent.com/d/1V_wb5gQTZAIWB2vA2iBjk5KMyf0PUOjP',
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
      logo: 'https://lh3.googleusercontent.com/d/1KKp9w_6Exn0eBziB0nElwULaU_3wPGFT',
      productSummary: 'Bảo hiểm PruLife',
      products: [
        { name: 'Prudential', logo: 'https://lh3.googleusercontent.com/d/1KKp9w_6Exn0eBziB0nElwULaU_3wPGFT' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1KKp9w_6Exn0eBziB0nElwULaU_3wPGFT',
          fallback: 'https://lh3.googleusercontent.com/d/1KKp9w_6Exn0eBziB0nElwULaU_3wPGFT',
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
      logo: 'https://lh3.googleusercontent.com/d/1JvZTySLhkS3fNGFhFVlimFGvU0epanMd',
      productSummary: 'Siêu ứng dụng Ví MoMo',
      products: [
        { name: 'Ví MoMo', logo: 'https://lh3.googleusercontent.com/d/1JvZTySLhkS3fNGFhFVlimFGvU0epanMd' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1JvZTySLhkS3fNGFhFVlimFGvU0epanMd',
          fallback: 'https://lh3.googleusercontent.com/d/1JvZTySLhkS3fNGFhFVlimFGvU0epanMd',
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
      logo: 'https://lh3.googleusercontent.com/d/1Zw2HIF5rsE5ZroMHNXA4KGdguyKgyH9R',
      productSummary: 'Chợ Số Finviet',
      products: [
        { name: 'Finviet', logo: 'https://lh3.googleusercontent.com/d/1Zw2HIF5rsE5ZroMHNXA4KGdguyKgyH9R' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1Zw2HIF5rsE5ZroMHNXA4KGdguyKgyH9R',
          fallback: 'https://lh3.googleusercontent.com/d/1Zw2HIF5rsE5ZroMHNXA4KGdguyKgyH9R',
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
      logo: 'https://lh3.googleusercontent.com/d/1LELjpA_3miO67AJKokZ1HW-Doo3g_gEH',
      productSummary: 'Power Service • CS Strategy',
      products: [
        { name: 'Power Service', logo: 'https://lh3.googleusercontent.com/d/1LELjpA_3miO67AJKokZ1HW-Doo3g_gEH' },
      ],
      logos: [
        {
          src: 'https://lh3.googleusercontent.com/d/1LELjpA_3miO67AJKokZ1HW-Doo3g_gEH',
          fallback: 'https://lh3.googleusercontent.com/d/1LELjpA_3miO67AJKokZ1HW-Doo3g_gEH',
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

  const maxFoldIdx = roadmapCards.length - 1;
  const activeFoldIdx = hoveredFoldIdx !== null ? hoveredFoldIdx : chosenFoldIdx;

  const handlePrev = () => {
    SoundEngine.playTap();
    setHoveredFoldIdx(null);
    setChosenFoldIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    SoundEngine.playTap();
    setHoveredFoldIdx(null);
    setChosenFoldIdx((prev) => Math.min(maxFoldIdx, prev + 1));
  };

  const handleWheelScroll = (e: React.WheelEvent<HTMLElement>) => {
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

    setHoveredFoldIdx(null);
    if (dominantDelta > 0) {
      setChosenFoldIdx((prev) => Math.min(maxFoldIdx, prev + 1));
    } else {
      setChosenFoldIdx((prev) => Math.max(0, prev - 1));
    }
  };

  const handlePointerDown = (clientX: number, clientY: number, target: EventTarget | null) => {
    didDragRef.current = false;
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
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      setHoveredFoldIdx(null);
      if (diffX > 0) {
        setChosenFoldIdx((prev) => Math.min(maxFoldIdx, prev + 1));
      } else {
        setChosenFoldIdx((prev) => Math.max(0, prev - 1));
      }
    }
    dragStartXRef.current = null;
    dragStartYRef.current = null;
    setIsDragging(false);
  };

  useEffect(() => {
    if (showJobCard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        setHoveredFoldIdx(null);
        setChosenFoldIdx((prev) => Math.max(0, prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setHoveredFoldIdx(null);
        setChosenFoldIdx((prev) => Math.min(maxFoldIdx, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard, maxFoldIdx]);

  const normalizedActiveKey = activeKey.startsWith('2013') || activeKey === '2014-airpay' ? '2013' : activeKey;

  return (
    <div
      id="experience-page-container"
      data-no-wheel-horizontal="true"
      data-element-name="Trang Hành trình sự nghiệp"
      data-element-type="container"
      data-element-page="experience"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-hidden select-none text-[var(--text-primary)] font-play text-left animate-fadeIn rounded-none box-border"
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
          id="experience-main-card"
          data-main-card="true"
          data-detail-open={showJobCard ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Hành trình sự nghiệp"
          data-element-type="card"
          data-element-page="experience"
          data-element-parent="experience-cards-track"
          className={cn(
            'page-main-card relative flex flex-col items-stretch justify-start select-none text-[var(--text-primary)] glass-scrollbar font-play text-left box-border rounded-[var(--radius-main,30px)] w-full h-full overflow-hidden',
            'p-0 gap-0'
          )}
          style={{
            padding: '0px',
            borderRadius: 'var(--radius-main, 30px)',
            gap: '0px',
          }}
        >
      {/* KHUNG TIMELINE BÌA GẤP 3D (CHỌN LOGO ĐỂ XEM CHI TIẾT CÔNG VIỆC — LẤP ĐẦY 100% THẺ CHÍNH) */}
      {!showJobCard && (
        <section
          ref={boardRef}
          id="experience-timeline-board"
          data-unfolding={unfoldingFoldIdx !== null ? 'true' : 'false'}
          data-element-name="Bảng Timeline Hành trình sự nghiệp"
          data-element-type="section"
          data-element-page="experience"
          data-element-parent="experience-main-card"
          onWheel={handleWheelScroll}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY, e.target)}
          onMouseUp={(e) => handlePointerUp(e.clientX, e.clientY)}
          onMouseLeave={() => {
            dragStartXRef.current = null;
            dragStartYRef.current = null;
            setIsDragging(false);
          }}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target)}
          onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
          style={
            isBlackLeather
              ? {
                  background: 'linear-gradient(145deg, #1E2128 0%, #101217 100%)',
                  border: 'none',
                  outline: '1.5px dashed rgba(255, 255, 255, 0.72)',
                  outlineOffset: '-7px',
                  borderRadius: 'inherit',
                }
              : isBrownLeather
                ? {
                    background: 'linear-gradient(145deg, #653A17 0%, #4A280E 100%)',
                    border: 'none',
                    outline: '1.5px dashed rgba(245, 222, 179, 0.52)',
                    outlineOffset: '-7px',
                    borderRadius: 'inherit',
                  }
                : {
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'inherit',
                  }
          }
          className={cn(
            'group/board relative w-full h-full min-h-0 flex-1 rounded-[inherit] overflow-hidden select-none flex flex-col box-border z-[1]',
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
        >
          {/* LỚP BẢN ĐỒ THẾ GIỚI DẠNG CHẤM TRÒN (HALFTONE DOTTED WORLD MAP) */}
          <div
            className={cn(
              'absolute inset-0 z-[15] pointer-events-none',
              isLeather || isDarkSurface ? 'opacity-20 mix-blend-screen' : 'opacity-25 mix-blend-multiply'
            )}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="halftoneDotsExp"
                  x="0"
                  y="0"
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="2.5"
                    cy="2.5"
                    r="1.45"
                    fill={
                      isBlackLeather
                        ? '#FFFFFF'
                        : isBrownLeather
                          ? '#F5DEB3'
                          : isDarkSurface
                            ? '#94A3B8'
                            : '#64748B'
                    }
                  />
                </pattern>
                <mask id="worldMapMaskExp">
                  <rect width="1600" height="900" fill="black" />
                  <path
                    d="M 65 160 Q 130 130 220 140 L 290 110 L 345 145 L 315 215 L 255 245 L 235 300 L 270 355 L 250 385 L 195 330 L 160 280 L 95 235 Z"
                    fill="white"
                  />
                  <path
                    d="M 355 75 L 445 65 L 465 115 L 405 145 L 365 115 Z"
                    fill="white"
                  />
                  <path
                    d="M 285 405 L 355 415 L 415 485 L 395 585 L 345 695 L 315 765 L 290 745 L 295 620 L 265 510 Z"
                    fill="white"
                  />
                  <path
                    d="M 520 135 L 610 100 L 690 120 L 720 185 L 665 245 L 595 265 L 535 255 L 510 205 Z"
                    fill="white"
                  />
                  <path
                    d="M 515 295 L 625 290 L 705 345 L 735 435 L 695 555 L 645 645 L 595 630 L 575 510 L 505 435 L 490 360 Z"
                    fill="white"
                  />
                  <path
                    d="M 730 125 L 920 95 L 1140 105 L 1340 130 L 1460 175 L 1420 265 L 1310 315 L 1245 415 L 1150 455 L 1045 435 L 965 465 L 895 405 L 805 375 L 745 290 Z"
                    fill="white"
                  />
                  <path
                    d="M 1145 485 L 1225 495 L 1265 535 L 1185 555 L 1125 525 Z"
                    fill="white"
                  />
                  <path
                    d="M 1285 515 L 1355 525 L 1365 555 L 1295 545 Z"
                    fill="white"
                  />
                  <path
                    d="M 1175 605 L 1295 595 L 1375 645 L 1365 735 L 1275 765 L 1185 725 L 1155 665 Z"
                    fill="white"
                  />
                </mask>
              </defs>
              <rect
                width="1600"
                height="900"
                fill="url(#halftoneDotsExp)"
                mask="url(#worldMapMaskExp)"
              />
            </svg>
          </div>

          {/* HEADER TRÊN CÙNG DẠNG NỔI KHÔNG CHIẾM KHÔNG GIAN: GIẤY XẾP LẤP ĐẦY 100% CHIỀU CAO & CHIỀU RỘNG THẺ CHÍNH */}
          <div
            id="experience-board-header"
            className="absolute top-0 left-0 right-0 z-[35] pointer-events-none flex items-center justify-between gap-2 px-[18px] sm:px-[24px] lg:px-[2.4%] pt-[12px] pb-[6px]"
          >
            {/* Tiêu đề Icon + 4 chữ "Thời Gian Công Tác" cùng 1 hàng + 5 chấm màu + gạch chân hồng */}
            <header className="min-w-0 pointer-events-auto">
              <div className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap min-w-0">
                <Briefcase
                  className="w-5 h-5 sm:w-[22px] sm:h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none"
                  strokeWidth={2.75}
                  style={{
                    color: isBlackLeather
                      ? '#FFFFFF'
                      : isBrownLeather
                        ? '#FDE68A'
                        : 'var(--color-primary, #0284C7)',
                  }}
                />
                <h1
                  id="experience-board-title"
                  data-card-title="true"
                  style={{
                    color: isBlackLeather
                      ? '#FFFFFF'
                      : isBrownLeather
                        ? '#FFF8DC'
                        : 'var(--text-heading, var(--text-primary))',
                  }}
                  className="typo-h3 sm:typo-h2 md:typo-h1 card-title-synced font-bold tracking-[0.04em] leading-none m-0 whitespace-nowrap"
                >
                  Thời gian công tác
                </h1>
              </div>
              {/* Hàng 5 chấm tròn màu + gạch chân hồng */}
              <div className="flex items-center gap-[6px] mt-1.5">
                <span className="w-[8px] h-[8px] rounded-full bg-[#F8C605]" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#EE2A7B]" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#00AEEF]" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#39B54A]" />
                <span
                  className={cn(
                    'w-[8px] h-[8px] rounded-full',
                    isDarkSurface || isLeather
                      ? 'bg-slate-200'
                      : 'bg-[#334155]'
                  )}
                />
                <span className="w-[44px] h-[2px] bg-[#EE2A7B] ml-1" />
              </div>
            </header>
          </div>

          {/* NÚT NỔI CHUYỂN ĐỔI QUA LẠI CÁC NẾP GẤP */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={chosenFoldIdx <= 0}
            aria-label="Chuyển tới mốc trước"
            style={
              !isLeather
                ? {
                    background: 'var(--bg-nav-pill, var(--bg-card))',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }
                : undefined
            }
            className={cn(
              'absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-[35] w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-md border shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:shadow-[0_10px_28px_rgba(56,189,248,0.35)] flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-90',
              isBlackLeather
                ? 'bg-[#14171D]/95 text-white border-white/70 hover:bg-[#272B35]'
                : isBrownLeather
                  ? 'bg-[#522E10]/95 text-[#FFF8DC] border-[#F5DEB3]/50 hover:bg-[#D97706]'
                  : ''
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={chosenFoldIdx >= maxFoldIdx}
            aria-label="Chuyển tới mốc tiếp theo"
            style={
              !isLeather
                ? {
                    background: 'var(--bg-nav-pill, var(--bg-card))',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }
                : undefined
            }
            className={cn(
              'absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-[35] w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-md border shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:shadow-[0_10px_28px_rgba(56,189,248,0.35)] flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-90',
              isBlackLeather
                ? 'bg-[#14171D]/95 text-white border-white/70 hover:bg-[#272B35]'
                : isBrownLeather
                  ? 'bg-[#522E10]/95 text-[#FFF8DC] border-[#F5DEB3]/50 hover:bg-[#D97706]'
                  : ''
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* HIỆU ỨNG XẾP GIẤY CHROMATIC FOLDS (DESKTOP/TABLET) & SLIDER RÕ NÉT TRÊN MOBILE */}
          {!isMobileFoldView ? (
            <div className="exp-chromatic-stage">
              <div
                id="experience-chromatic-folds"
                className="exp-chromatic-folds"
                onMouseLeave={() => setHoveredFoldIdx(null)}
              >
                {roadmapCards.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  const isUnfolding = unfoldingFoldIdx === idx;
                  const isExpanded = unfoldingFoldIdx !== null ? isUnfolding : activeFoldIdx === idx;
                  const foldNum = String(idx + 1).padStart(2, '0');
                  const milestoneData = EXPERIENCE_MILESTONES[item.key];

                  const colBackground = isBlackLeather
                    ? isEven
                      ? 'linear-gradient(145deg, #21242C 0%, #111318 100%)'
                      : 'linear-gradient(145deg, #191C22 0%, #0D0F14 100%)'
                    : isBrownLeather
                      ? item.colBgGradientLeather
                      : isEven
                        ? 'var(--surface-secondary-bg, var(--bg-card))'
                        : 'var(--bg-subcard, var(--surface-tertiary-bg, var(--bg-card)))';

                  const resolvedAccent = isBlackLeather
                    ? '#FFFFFF'
                    : isBrownLeather
                      ? '#FDE68A'
                      : isDarkSurface
                        ? item.darkAccentColor
                        : item.accentColor;

                  const primaryTextColor = isBlackLeather
                    ? '#FFFFFF'
                    : isBrownLeather
                      ? '#FFF8DC'
                      : 'var(--text-primary)';

                  const secondaryTextColor = isBlackLeather
                    ? '#E4E4E7'
                    : isBrownLeather
                      ? '#F5DEB3'
                      : 'var(--text-secondary)';

                  return (
                    <div
                      key={item.key}
                      id={`milestone-card-${item.key}`}
                      data-num={foldNum}
                      data-expanded={isExpanded ? 'true' : 'false'}
                      data-unfolding={isUnfolding ? 'true' : 'false'}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.yearBadge} — ${item.shortName}`}
                      aria-pressed={chosenFoldIdx === idx}
                      onMouseEnter={() => {
                        if (unfoldingFoldIdx === null) setHoveredFoldIdx(idx);
                      }}
                      onFocus={() => {
                        if (unfoldingFoldIdx === null) setChosenFoldIdx(idx);
                      }}
                      onClick={() => {
                        if (didDragRef.current || unfoldingFoldIdx !== null) return;
                        SoundEngine.playTap();
                        handleOpenJobCard(item.key, idx);
                      }}
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          SoundEngine.playTap();
                          handleOpenJobCard(item.key, idx);
                        }
                      }}
                      style={
                        {
                          '--fallback-i': idx + 1,
                          '--fallback-n': roadmapCards.length,
                          '--fold-color': item.accentColor,
                          background: isExpanded ? colBackground : item.blockGradient,
                        } as React.CSSProperties
                      }
                      className={cn(
                        'exp-fold-swatch group',
                        isExpanded && 'is-expanded',
                        isUnfolding && 'is-unfolding'
                      )}
                    >
                      {/* Lớp bóng đổ nếp gấp giấy Chromatic Folds */}
                      <div aria-hidden="true" className="exp-fold-shading" />

                      {/* GÁY XẾP GIẤY KHI GẤP GỌN: ICON LỊCH + NĂM & SỐ NĂM -> CỤM LOGO XẾP DỌC -> TÊN CÔNG TY DỌC */}
                      <div className="exp-fold-spine" aria-hidden={isExpanded}>
                        <div className="exp-fold-num">
                          <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                          <span>{item.key === '2026' ? '2026+' : item.key}</span>
                          {milestoneData?.tenure && (
                            <span className="typo-badge font-semibold opacity-90">
                              {milestoneData.tenure}
                            </span>
                          )}
                        </div>
                        {item.logos.length > 0 && (
                          <div className="exp-fold-spine-logo-stack">
                            {item.logos.map((spineLogo, sIdx) => (
                              <div
                                key={`${spineLogo.src}-${sIdx}`}
                                className="exp-fold-spine-logo"
                                style={{
                                  marginTop:
                                    sIdx > 0
                                      ? item.logos.length >= 4
                                        ? '-9px'
                                        : '-8px'
                                      : '0px',
                                  zIndex: item.logos.length - sIdx,
                                  width: item.logos.length >= 4 ? '28px' : undefined,
                                  height: item.logos.length >= 4 ? '28px' : undefined,
                                }}
                              >
                                <img
                                  src={spineLogo.src}
                                  alt={spineLogo.alt}
                                  className="w-full h-full object-cover rounded-full"
                                  loading="lazy"
                                  decoding="async"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <span className="exp-fold-spine-label">
                          {item.shortName}
                        </span>
                      </div>

                      {/* NỘI DUNG ĐẦY ĐỦ CỦA CỘT MỐC KHI MỞ NẾP GẤP: KHUNG MÀU THAY BANNER -> LOGO TRƯỚC TÊN CÔNG TY */}
                      <div className="exp-fold-sheet pt-[66px] sm:pt-[72px] pb-0">
                        {/* 1. Khung màu thương hiệu thay thế banner công ty: Icon Lịch + Năm + Số năm + Ngành */}
                        <div className="relative w-full shrink-0 mb-2.5 px-11 sm:px-14 overflow-hidden">
                          <div
                            style={{ background: item.blockGradient }}
                            className="relative w-full rounded-[14px] px-4 py-3 text-white shadow-[0_8px_18px_-4px_rgba(15,23,42,0.22)] flex flex-wrap items-center justify-between gap-2"
                          >
                            <span className="inline-flex items-center gap-2 typo-h5 font-bold tracking-[0.02em] leading-none">
                              <Calendar className="w-[16px] h-[16px] shrink-0" strokeWidth={2.5} />
                              <span>{item.yearBadge}</span>
                              {milestoneData?.tenure && (
                                <span className="typo-caption font-semibold opacity-90">
                                  · {milestoneData.tenure}
                                </span>
                              )}
                            </span>
                            {milestoneData?.tag && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full typo-badge font-semibold bg-white/20 text-white">
                                {milestoneData.tag}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 2. Thông tin công ty (Logo xếp chồng dọc chuyển xuống trước tên công ty), thời gian, vị trí, quản lý, mô tả */}
                        <div
                          data-no-wheel-horizontal="true"
                          className="exp-milestone-scroll flex-1 min-h-0 px-11 sm:px-14 pt-1 pb-10 flex flex-col justify-start overflow-y-auto overscroll-y-contain touch-pan-y no-scrollbar"
                        >
                          <div
                            className={cn(
                              'flex items-center gap-3.5 border-b pb-3 mb-2.5 min-w-0',
                              isBlackLeather
                                ? 'border-white/30'
                                : isBrownLeather
                                  ? 'border-[#F5DEB3]/35'
                                  : isDarkSurface
                                    ? 'border-white/15'
                                    : 'border-slate-300'
                            )}
                          >
                            <div className="flex flex-col items-center justify-center shrink-0">
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
                              style={{ color: primaryTextColor }}
                              data-subcard-title="true"
                              className="subcard-title-synced typo-h5 font-bold leading-[1.28] break-words flex flex-col justify-center min-w-0 flex-1 select-none"
                            >
                              <span className="leading-tight flex items-center gap-1.5">
                                <WebIcon name="building" className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                <span>{item.companyLine1}</span>
                              </span>
                              <span className="block leading-tight">{item.companyLine2}</span>
                            </h3>
                          </div>

                          <div className="space-y-1.5 mb-2 typo-label font-normal">
                            {milestoneData && (
                              <div className="flex items-start gap-1.5 leading-[1.35]">
                                <span
                                  style={{ color: resolvedAccent }}
                                  className="font-bold shrink-0 inline-flex items-center gap-1"
                                >
                                  <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={2.75} />
                                  Thời gian:
                                </span>
                                <span style={{ color: primaryTextColor }} className="font-medium break-words">
                                  {milestoneData.cardYearLabel} ({milestoneData.tenure})
                                </span>
                              </div>
                            )}

                            <div className="flex items-start gap-1.5 leading-[1.35]">
                              <span
                                style={{ color: resolvedAccent }}
                                className="font-bold shrink-0 inline-flex items-center gap-1"
                              >
                                <Briefcase className="w-3.5 h-3.5 shrink-0" strokeWidth={2.75} />
                                Vị trí:
                              </span>
                              <span style={{ color: primaryTextColor }} className="font-medium break-words">
                                {item.roleSummary}
                              </span>
                            </div>

                            <div className="flex items-start gap-1.5 leading-[1.35]">
                              <span
                                style={{ color: resolvedAccent }}
                                className="font-bold shrink-0 inline-flex items-center gap-1"
                              >
                                <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={2.75} />
                                Quản lý:
                              </span>
                              <span style={{ color: primaryTextColor }} className="font-medium break-words">
                                {item.headcountLabel}
                              </span>
                            </div>
                          </div>

                          <p
                            style={{ color: secondaryTextColor }}
                            className="typo-caption font-normal leading-[1.45] break-words mb-2.5"
                          >
                            {item.description}
                          </p>

                          <div className="mt-auto pt-1 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                SoundEngine.playTap();
                                handleOpenJobCard(item.key, idx);
                              }}
                              style={
                                !isLeather
                                  ? {
                                      color: resolvedAccent,
                                      background: 'var(--bg-nav-pill, var(--bg-subcard))',
                                      borderColor: 'var(--border-subcard, var(--border-color))',
                                    }
                                  : { color: resolvedAccent }
                              }
                              className={cn(
                                'exp-bento-rect-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] typo-button font-bold border transition-all cursor-pointer active:scale-95',
                                isBlackLeather
                                  ? 'bg-[#14171D]/90 border-white/65 hover:bg-[#232731]'
                                  : isBrownLeather
                                    ? 'bg-[#522E10]/85 border-[#F5DEB3]/45 hover:bg-[#522E10]'
                                    : ''
                              )}
                            >
                              <span className="text-current">Xem chi tiết</span>
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CHẾ ĐỘ MOBILE (< 768PX): TRƯỢT TỪNG TỜ XẾP GIẤY ĐẦY ĐỦ NỘI DUNG */
            <div className="relative w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden">
              <div
                className="flex w-full h-full flex-1 min-h-0 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${chosenFoldIdx * 100}%)`,
                }}
              >
                {roadmapCards.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  const milestoneData = EXPERIENCE_MILESTONES[item.key];
                  const colBackground = isBlackLeather
                    ? isEven
                      ? 'linear-gradient(145deg, #21242C 0%, #111318 100%)'
                      : 'linear-gradient(145deg, #191C22 0%, #0D0F14 100%)'
                    : isBrownLeather
                      ? item.colBgGradientLeather
                      : isEven
                        ? 'var(--surface-secondary-bg, var(--bg-card))'
                        : 'var(--bg-subcard, var(--surface-tertiary-bg, var(--bg-card)))';
                  const resolvedAccent = isBlackLeather
                    ? '#FFFFFF'
                    : isBrownLeather
                      ? '#FDE68A'
                      : isDarkSurface
                        ? item.darkAccentColor
                        : item.accentColor;
                  const primaryTextColor = isBlackLeather
                    ? '#FFFFFF'
                    : isBrownLeather
                      ? '#FFF8DC'
                      : 'var(--text-primary)';
                  const secondaryTextColor = isBlackLeather
                    ? '#E4E4E7'
                    : isBrownLeather
                      ? '#F5DEB3'
                      : 'var(--text-secondary)';

                  return (
                    <div
                      key={item.key}
                      id={`milestone-card-${item.key}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (didDragRef.current || unfoldingFoldIdx !== null) return;
                        SoundEngine.playTap();
                        handleOpenJobCard(item.key, idx);
                      }}
                      style={{
                        flex: '0 0 100%',
                        width: '100%',
                        background: colBackground,
                      }}
                      className={cn(
                        'relative h-full min-h-0 flex flex-col pt-[64px] pb-10 cursor-pointer transition-transform duration-300',
                        unfoldingFoldIdx === idx && 'scale-[1.015]'
                      )}
                    >
                      {/* Khung màu thương hiệu thay thế banner công ty trên Mobile */}
                      <div className="relative w-full shrink-0 mb-2.5 px-11 overflow-hidden">
                        <div
                          style={{ background: item.blockGradient }}
                          className="w-full rounded-[14px] px-4 py-2.5 text-white shadow-sm flex items-center justify-between gap-2"
                        >
                          <span className="inline-flex items-center gap-1.5 typo-h5 font-bold">
                            <Calendar className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                            <span>{item.yearBadge}</span>
                            {milestoneData?.tenure && (
                              <span className="typo-caption font-semibold opacity-90">
                                · {milestoneData.tenure}
                              </span>
                            )}
                          </span>
                          {milestoneData?.tag && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full typo-badge font-semibold bg-white/20 text-white">
                              {milestoneData.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        data-no-wheel-horizontal="true"
                        className="exp-milestone-scroll flex-1 min-h-0 px-12 pt-1 pb-2 flex flex-col overflow-y-auto no-scrollbar"
                      >
                        <div className="flex items-center gap-3 border-b border-slate-300/40 pb-2.5 mb-2 min-w-0">
                          <div className="flex flex-col items-center justify-center shrink-0">
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
                            style={{ color: primaryTextColor }}
                            data-subcard-title="true"
                            className="subcard-title-synced typo-h5 font-bold leading-[1.28] min-w-0 flex-1"
                          >
                            <span className="leading-tight flex items-center gap-1.5">
                              <WebIcon name="building" className="w-3.5 h-3.5 shrink-0 opacity-80" />
                              <span>{item.companyLine1}</span>
                            </span>
                            <span className="block leading-tight">{item.companyLine2}</span>
                          </h3>
                        </div>
                        <div className="space-y-1.5 mb-2 typo-label font-normal">
                          {milestoneData && (
                            <div className="flex items-start gap-1.5 leading-[1.35]">
                              <span style={{ color: resolvedAccent }} className="font-bold shrink-0 inline-flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={2.75} />
                                Thời gian:
                              </span>
                              <span style={{ color: primaryTextColor }} className="font-medium break-words">
                                {milestoneData.cardYearLabel} ({milestoneData.tenure})
                              </span>
                            </div>
                          )}
                          <div className="flex items-start gap-1.5 leading-[1.35]">
                            <span style={{ color: resolvedAccent }} className="font-bold shrink-0 inline-flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 shrink-0" strokeWidth={2.75} />
                              Vị trí:
                            </span>
                            <span style={{ color: primaryTextColor }} className="font-medium break-words">
                              {item.roleSummary}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5 leading-[1.35]">
                            <span style={{ color: resolvedAccent }} className="font-bold shrink-0 inline-flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={2.75} />
                              Quản lý:
                            </span>
                            <span style={{ color: primaryTextColor }} className="font-medium break-words">
                              {item.headcountLabel}
                            </span>
                          </div>
                        </div>
                        <p style={{ color: secondaryTextColor }} className="typo-caption font-normal leading-[1.45] break-words mb-2.5">
                          {item.description}
                        </p>
                        <div className="mt-auto pt-1 flex items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playTap();
                              handleOpenJobCard(item.key, idx);
                            }}
                            style={
                              !isLeather
                                ? {
                                    color: resolvedAccent,
                                    background: 'var(--bg-nav-pill, var(--bg-subcard))',
                                    borderColor: 'var(--border-subcard, var(--border-color))',
                                  }
                                : { color: resolvedAccent }
                            }
                            className="exp-bento-rect-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] typo-button font-bold border transition-all cursor-pointer active:scale-95"
                          >
                            <span className="text-current">Xem chi tiết</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* THANH CHỈ BÁO NẾP GẤP & PHÂN TRANG NỔI PHÍA DƯỚI */}
          <div
            id="experience-board-pagination"
            className="absolute bottom-2 left-4 right-4 z-[35] pointer-events-none flex items-center justify-between gap-2"
          >
            <span
              className="hidden sm:inline-flex items-center font-mono typo-overline tracking-[0.06em] opacity-80"
              style={{
                color: isBlackLeather ? '#E4E4E7' : isBrownLeather ? '#F5DEB3' : 'var(--text-secondary)',
              }}
            >
              Rê chuột để mở nếp gấp ↗
            </span>

            <div
              style={
                !isLeather
                  ? {
                      background: 'var(--bg-nav-pill, var(--bg-card))',
                      borderColor: 'var(--border-color)',
                    }
                  : undefined
              }
              className={cn(
                'pointer-events-auto mx-auto sm:mx-0 flex items-center gap-1.5 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border',
                isBlackLeather
                  ? 'bg-[#14171D]/92 border-white/55'
                  : isBrownLeather
                    ? 'bg-[#522E10]/90 border-[#F5DEB3]/45'
                    : ''
              )}
            >
              {roadmapCards.map((card, idx) => (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setHoveredFoldIdx(null);
                    setChosenFoldIdx(idx);
                  }}
                  aria-label={`Chọn mốc ${card.yearBadge}`}
                  title={`${card.yearBadge} — ${card.shortName}`}
                  style={
                    !isLeather
                      ? {
                          background:
                            activeFoldIdx === idx
                              ? card.accentColor
                              : 'var(--divider-nav-pill, rgba(148, 163, 184, 0.45))',
                        }
                      : undefined
                  }
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                    activeFoldIdx === idx
                      ? isBlackLeather
                        ? 'w-5 bg-white'
                        : isBrownLeather
                          ? 'w-5 bg-[#FDE68A]'
                          : 'w-5'
                      : isBlackLeather
                        ? 'w-1.5 bg-white/40 hover:bg-white/80'
                        : isBrownLeather
                          ? 'w-1.5 bg-[#F5DEB3]/40 hover:bg-[#F5DEB3]/75'
                          : 'w-1.5 hover:opacity-80'
                  )}
                />
              ))}
            </div>

            <span
              aria-live="polite"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full border typo-badge font-bold tracking-[0.04em] whitespace-nowrap"
              style={{
                borderColor: isBlackLeather
                  ? 'rgba(255,255,255,0.35)'
                  : isBrownLeather
                    ? 'rgba(245,222,179,0.4)'
                    : 'var(--border-color)',
                color: isBlackLeather ? '#FFFFFF' : isBrownLeather ? '#FFF8DC' : 'var(--text-primary)',
              }}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
              <span>
                {roadmapCards[activeFoldIdx]?.yearBadge}
                {EXPERIENCE_MILESTONES[roadmapCards[activeFoldIdx]?.key]?.tenure
                  ? ` · ${EXPERIENCE_MILESTONES[roadmapCards[activeFoldIdx]?.key]?.tenure}`
                  : ''}
              </span>
            </span>
          </div>
        </section>
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

        // Helper lọc bỏ logo công ty khỏi bộ sưu tập Hình ảnh kỷ niệm
        const isCompanyLogoAsset = (url?: string) => {
          if (!url) return false;
          if (activeMilestone.logo && url === activeMilestone.logo) return true;
          return /logo_|_logo|\/logo\//i.test(url);
        };

        // Danh sách hình ảnh kỷ niệm thực tế (giữ nguyên toàn bộ data thật)
        const basePhotos = (activeMilestone.photos || []).filter((p) => !isCompanyLogoAsset(p.src));
        const safeMemoryImg =
          activeMilestone.memoryImg && !isCompanyLogoAsset(activeMilestone.memoryImg)
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
        const photosList = [
          ...primaryMemoryPhoto,
          ...basePhotos.filter((p) => p.src !== safeMemoryImg),
        ];

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
        const rawProductsList =
          activeMilestone.products && activeMilestone.products.length > 0
            ? activeMilestone.products.map((p) => ({
                name: p.alt.replace(/^Logo\s+/i, '').trim() || activeMilestone.company,
                src: p.src,
              }))
            : currentRoadmapCard?.products && currentRoadmapCard.products.length > 0
              ? currentRoadmapCard.products.map((p) => ({
                  name: p.name,
                  src: p.logo,
                }))
              : [
                  {
                    name: activeMilestone.company,
                    src: activeMilestone.logo,
                  },
                ];

        const resolveServicesForLogo = (productName: string, logoUrl: string): string[] => {
          const matched: string[] = [];
          const addService = (title: string) => {
            if (title && !matched.includes(title)) matched.push(title);
          };

          const normSrc = logoUrl.toLowerCase();
          const normMilestoneLogo = (activeMilestone.logo || '').toLowerCase();
          const normName = productName.toLowerCase();

          // 1. Ưu tiên khớp chính xác theo URL logo trong DOMAINS_DATA
          DOMAINS_DATA.forEach((domain) => {
            const hasUrlMatch = (domain.companyLogos || []).some((cl) => {
              const clLogo = (cl.logo || '').toLowerCase();
              const clFallback = (cl.fallbackLogo || '').toLowerCase();
              return (
                (clLogo && (clLogo === normSrc || (rawProductsList.length === 1 && clLogo === normMilestoneLogo))) ||
                (clFallback && clFallback === normSrc)
              );
            });
            if (hasUrlMatch) {
              addService(domain.title);
            }
          });

          // 2. Fallback khớp theo từ khóa tên / tên file logo khi URL khác biến thể (vd: Mobifone_Logo.png)
          if (matched.length === 0) {
            const combined = `${normName} ${normSrc}`;
            if (combined.includes('mobifone') || combined.includes('v247') || combined.includes('htvc') || combined.includes('lbc')) {
              addService('Dịch vụ Viễn thông');
            }
            if (combined.includes('garena') || combined.includes('ved') || combined.includes('gcafe')) {
              addService('Thể thao điện tử');
            }
            if (combined.includes('shopeepay') || combined.includes('airpay') || combined.includes('momo')) {
              addService('Thanh toán điện tử');
            } else if (combined.includes('shopee')) {
              addService('Thương mại điện tử');
            }
            if (combined.includes('prudential')) {
              addService('Tài chính bảo hiểm');
            }
            if (combined.includes('finviet')) {
              addService('Thanh toán điện tử');
              addService('Thương mại điện tử');
              addService('Tài chính bảo hiểm');
            }
            if (combined.includes('power') || combined.includes('powerservice')) {
              addService('Xây dựng hệ thống');
            }
          }

          // Sắp xếp ưu tiên cho các logo đa dịch vụ (ShopeePay / Finviet) để badge chính hiển thị đầu tiên
          if (normName.includes('shopeepay') || normName.includes('airpay') || normSrc.includes('shopeepay')) {
            matched.sort((a, b) => (a === 'Thanh toán điện tử' ? -1 : b === 'Thanh toán điện tử' ? 1 : 0));
          } else if (normName.includes('finviet') || normSrc.includes('finviet')) {
            const priority = ['Thanh toán điện tử', 'Thương mại điện tử', 'Tài chính bảo hiểm'];
            matched.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
          }

          if (matched.length === 0 && activeMilestone.tag) {
            addService(activeMilestone.tag);
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
            <main
              ref={detailCardRef}
              id="experience-job-detail-card"
              data-no-wheel-horizontal="true"
              data-scrollable="true"
              data-element-name="Chi tiết thẻ công việc"
              data-element-type="card"
              data-element-page="experience"
              data-element-parent="experience-main-card"
              data-section-card="true"
              className="bento-card glass-card exp-detail-unfold-in flex-1 min-h-0 h-full overflow-y-auto overflow-x-hidden glass-scrollbar rounded-[var(--radius-main,30px)] border-0 block w-full min-w-0 p-[15px] font-play box-border"
              style={{ padding: '15px', borderRadius: 'var(--radius-main, 30px)' }}
            >
            {/* THANH ĐIỀU HƯỚNG CHI TIẾT TĨNH: Nút đóng ở góc trên bên phải */}
            <div
              id="experience-job-detail-toolbar"
              className="w-full flex items-center justify-end mb-[15px]"
            >
              {/* Nút X Close nằm gọn cùng hàng điều khiển */}
              <button
                id="experience-job-detail-close-btn"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setShowJobCard(false);
                }}
                title="Đóng chi tiết công việc (hoặc nhấn phím Esc)"
                aria-label="Đóng chi tiết công việc"
                className={cn(
                  'theme-modal-close w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 border backdrop-blur-md shrink-0',
                  isBlackLeather
                    ? 'bg-[#14171D] border-white/65 text-white hover:bg-[#232731]'
                    : isBrownLeather
                      ? 'bg-[#522E10] border-[#F5DEB3]/60 text-[#FFF8DC] hover:bg-[#653A17]'
                      : isDarkSurface
                        ? 'bg-slate-900/90 border-white/25 text-white hover:bg-slate-800'
                        : 'bg-white/95 border-slate-200/90 text-slate-900 hover:bg-slate-100'
                )}
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* BỐ CỤC MASONRY LAYOUT (PINTEREST GRID) CHO CHI TIẾT CÔNG VIỆC */}
            <div
              id="experience-bento-grid"
              data-layout-mode="masonry"
              className="experience-masonry-grid w-full min-w-0"
            >
              {/* THẺ 1: Thẻ công ty */}
              <section
                id="experience-info-card"
                data-multicolor-bento="true"
                data-bento-tone="sky"
                className={cn(
                  'experience-masonry-item exp-bento-surface-card bento-tone-sky transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] overflow-hidden shadow-[0_14px_34px_-8px_rgba(30,41,59,0.10),0_4px_12px_-2px_rgba(15,23,42,0.04)] backdrop-blur-md border flex flex-col gap-[15px] relative group min-w-0 h-auto',
                  isDarkCardText
                    ? 'bg-gradient-to-br from-sky-950/55 via-slate-900/72 to-indigo-950/48 border-sky-500/28 text-white'
                    : 'bg-gradient-to-br from-sky-50/92 via-white/85 to-indigo-50/88 border-sky-200/75 text-slate-900'
                )}
              >
                  {/* Banner Video / Image Header */}
                  {activeMilestone.videoCard ? (
                    <div
                      className={cn(
                        'exp-bento-hero-banner relative h-48 sm:h-56 w-full rounded-[var(--radius-banner,14px)] overflow-hidden shrink-0',
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
                  <div className="relative flex flex-col gap-[15px] min-w-0">
                    <div
                      id="experience-company-name-card"
                      data-bento-subtone="indigo"
                      className={cn(
                        'exp-bento-item-card w-full p-[15px] rounded-[var(--radius-subcard,16px)] border shadow-xs flex flex-col gap-3 min-w-0 relative z-10 bg-gradient-to-br',
                        isDarkCardText
                          ? 'from-indigo-950/55 via-slate-900/75 to-sky-950/45 border-indigo-400/25 text-white'
                          : 'from-indigo-50/88 via-white/90 to-sky-50/82 border-indigo-200/75 text-slate-900'
                      )}
                    >
                      <div className="min-w-0 w-full flex flex-col gap-[15px]">
                        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                          <div
                            className={cn(
                              'exp-bento-light-chip inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold border max-w-full w-fit',
                              isDarkCardText
                                ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                                : 'bg-rose-50/90 text-rose-700 border-rose-200/90'
                            )}
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

                          {/* Huy hiệu thời gian: Từ năm 2011 đến năm 2013 (2 Năm) chuyển vào thẻ công ty */}
                          <div
                            className={cn(
                              'px-3 py-1.5 rounded-full typo-caption sm:typo-body-sm font-bold shadow-2xs flex items-center gap-1.5 max-w-full border shrink-0',
                              isBlackLeather
                                ? 'bg-[#14171D] border-white/65 text-white'
                                : isBrownLeather
                                  ? 'bg-[#522E10] border-[#F5DEB3]/60 text-[#FFF8DC]'
                                  : isDarkSurface
                                    ? 'bg-slate-900/90 backdrop-blur-md border-white/25 text-white'
                                    : 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-900'
                            )}
                          >
                            <Calendar className={cn('w-3.5 h-3.5 shrink-0', isDarkCardText ? 'text-rose-400' : 'text-red-600')} />
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
                              <div className="flex flex-col items-center justify-center shrink-0">
                                {inlineLogos.map((logoItem, logoIdx) => (
                                  <div
                                    key={`${logoItem.src}-${logoIdx}`}
                                    style={{
                                      zIndex: inlineLogos.length - logoIdx,
                                      marginTop:
                                        logoIdx > 0
                                          ? useCompactLogo
                                            ? '-10px'
                                            : '-12px'
                                          : '0px',
                                      background: 'var(--surface-secondary-bg, var(--bg-card))',
                                      border: 'none',
                                      boxShadow: 'var(--shadow-subcard, 0 6px 16px -4px rgba(15, 23, 42, 0.22))',
                                    }}
                                    className={cn(
                                      'relative rounded-full overflow-hidden p-0 border-0 ring-0 outline-none flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 hover:z-30',
                                      useCompactLogo
                                        ? 'w-[30px] h-[30px] sm:w-[34px] sm:h-[34px]'
                                        : 'w-[46px] h-[46px]'
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
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  </div>
                                ))}
                              </div>

                              <h1
                                className={cn(
                                  'typo-h1 font-bold leading-tight break-words min-w-0 max-w-full',
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

                    {/* 3 THẺ THÔNG TIN: Chức vụ đảm nhiệm, Quy mô vận hành, Dịch vụ */}
                    <div
                      className={cn(
                        'grid grid-cols-1 sm:grid-cols-2 gap-[15px] pt-[15px] border-t items-start min-w-0 relative z-10',
                        isDarkCardText
                          ? 'border-white/10'
                          : 'border-slate-200/80'
                      )}
                    >
                      {/* Thẻ 1: Chức vụ đảm nhiệm */}
                      <div
                        data-bento-subtone="amber"
                        className={cn(
                          'exp-bento-item-card flex flex-col p-[15px] rounded-[var(--radius-subcard,16px)] border min-w-0 h-fit gap-3',
                          isDarkCardText
                            ? 'bg-gradient-to-br from-orange-950/55 to-amber-950/38 border-orange-500/28'
                            : 'bg-gradient-to-br from-orange-50/92 to-amber-50/78 border-orange-200/75'
                        )}
                      >
                        <div className={cn('subcard-header-sync flex items-center gap-2', isDarkCardText ? 'text-orange-300' : 'text-orange-600')}>
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <p className="subcard-title-synced typo-label font-semibold tracking-wide" data-subcard-title="true">
                            Chức vụ đảm nhiệm
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

                      {/* Thẻ 2: Quy mô vận hành */}
                      <div
                        data-bento-subtone="blue"
                        className={cn(
                          'exp-bento-item-card flex flex-col p-[15px] rounded-[var(--radius-subcard,16px)] border min-w-0 h-fit gap-3',
                          isDarkCardText
                            ? 'bg-gradient-to-br from-blue-950/55 to-indigo-950/38 border-blue-500/28'
                            : 'bg-gradient-to-br from-blue-50/92 to-indigo-50/78 border-blue-200/75'
                        )}
                      >
                        <div className={cn('subcard-header-sync flex items-center gap-2', isDarkCardText ? 'text-sky-400' : 'text-blue-600')}>
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
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

                      {/* Thẻ 3: Dịch vụ */}
                      <div
                        id="experience-company-services"
                        data-bento-subtone="teal"
                        className={cn(
                          'exp-bento-item-card sm:col-span-2 rounded-[var(--radius-subcard,16px)] p-[15px] border flex flex-col gap-3 min-w-0 h-fit bg-gradient-to-br',
                          isDarkCardText
                            ? 'from-teal-950/52 via-slate-900/70 to-emerald-950/42 border-teal-500/28 text-white'
                            : 'from-teal-50/88 via-white/90 to-emerald-50/78 border-teal-200/78 text-slate-900'
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2
                            className={cn(
                              'card-header-sync card-title-synced typo-h4 font-bold flex items-center gap-1.5',
                              isDarkCardText ? 'text-amber-400' : 'text-orange-700'
                            )}
                            data-card-title="true"
                          >
                            <Layers className="w-4 h-4 shrink-0" />
                            <span>Dịch vụ</span>
                          </h2>
                          <button
                            type="button"
                            onClick={navigateToServices}
                            className={cn(
                              'px-2 py-0.5 rounded-full typo-badge font-semibold border flex items-center gap-1 cursor-pointer transition-colors shrink-0',
                              isDarkCardText
                                ? 'bg-orange-500/15 border-orange-400/30 text-orange-200 hover:bg-orange-500/30'
                                : 'bg-white/95 border-orange-300 text-orange-800 hover:bg-orange-100'
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
              </section>

              {/* HÀNG 2: Giới thiệu hành trình cùng hàng với Hình ảnh kỷ niệm */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-start w-full min-w-0">
  {/* THẺ 5: Giới thiệu hành trình */}
                <section
                  id="experience-banner-card"
                  data-multicolor-bento="true"
                  data-bento-tone="pink"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-pink transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border min-w-0 h-auto flex flex-col gap-[15px]',
                    isDarkCardText
                      ? 'bg-gradient-to-br from-rose-950/52 via-slate-900/75 to-pink-950/42 border-rose-500/28 text-white'
                      : 'bg-gradient-to-br from-rose-50/92 via-pink-50/80 to-orange-50/88 border-rose-200/75 text-slate-900'
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2
                      className={cn(
                        'card-header-sync card-title-synced typo-h3 font-bold flex items-center gap-2',
                        isDarkCardText ? 'text-rose-300' : 'text-rose-700'
                      )}
                      data-card-title="true"
                    >
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
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
                        'exp-bento-item-card typo-body-sm leading-relaxed p-[15px] rounded-[var(--radius-subcard,16px)] border break-words bg-gradient-to-r',
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
                              'exp-bento-item-card p-[15px] rounded-[var(--radius-subcard,16px)] border shadow-sm min-w-0 h-fit flex flex-col gap-3',
                              isDarkCardText ? colStyle.darkBg : colStyle.lightBg
                            )}
                          >
                            <h3
                              className={cn(
                                'subcard-header-sync subcard-title-synced font-bold typo-h4 flex items-center gap-1.5',
                                colStyle.iconColor
                              )}
                              data-subcard-title="true"
                            >
                              <ColIcon className="w-4 h-4 shrink-0" />
                              <span className="break-words text-current">{item.title}</span>
                            </h3>
                            <p
                              className={cn(
                                'typo-body-sm leading-relaxed break-words',
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

                  <div className="flex items-start sm:items-center gap-[15px] bg-gradient-to-r from-rose-600 to-pink-600 text-white p-[15px] rounded-[var(--radius-subcard,16px)] shadow-sm">
                    <Gauge className="w-5 h-5 text-amber-300 shrink-0 mt-0.5 sm:mt-0" />
                    <p className="typo-body-sm font-medium leading-snug text-white break-words exp-bento-preserve-color">
                      {philosophyText}
                    </p>
                  </div>
                </section>

  {/* THẺ 2: Hình ảnh kỷ niệm (Masonry Item) */}
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
                              ? 'grid-cols-1'
                              : 'grid-cols-2'
                          )}
                        >
                          {photosList.map((photo, pIdx) => {
                            const hasImgFailed = Boolean(failedPhotoSrcs[photo.src]);
                            const borderHover = photoBorderAccents[pIdx % photoBorderAccents.length];
                            const count = photosList.length;
                            const isOddHero = count >= 3 && count % 2 === 1 && pIdx === 0;
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
                                  'exp-bento-rect-btn group relative rounded-[var(--radius-card,14px)] overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer p-0 text-left w-full',
                                  count <= 2 ? 'h-full min-h-[150px]' : 'aspect-[16/10]',
                                  isDarkSurface
                                    ? 'bg-slate-800 border-slate-700/70'
                                    : isBlackLeather
                                      ? 'bg-[#14171D] border-white/45'
                                      : isBrownLeather
                                        ? 'bg-[#522E10] border-[#F5DEB3]/35'
                                        : 'bg-white/80 border-slate-200/90 shadow-xs',
                                  borderHover,
                                  isOddHero && 'col-span-2 max-h-[210px]'
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
                                        : isBlackLeather
                                          ? 'bg-[#14171D] text-white'
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
                            'flex-1 min-h-[140px] rounded-[var(--radius-subcard,16px)] border p-[15px] flex items-center justify-center',
                            isDarkSurface
                              ? 'bg-slate-800/70 border-slate-700 text-slate-300'
                              : isBlackLeather
                                ? 'bg-[#14171D] border-white/45 text-white'
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
              </div>

              {/* HÀNG 3: Danh sách công việc cùng hàng với Danh sách dự án */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-start w-full min-w-0">
  {/* THẺ 6: Danh sách công việc */}
                <section
                  id="experience-responsibility-card"
                  data-multicolor-bento="true"
                  data-bento-tone="purple"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-purple transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border min-w-0 h-auto flex flex-col gap-[15px]',
                    isDarkCardText
                      ? 'bg-gradient-to-b from-purple-950/55 via-slate-900/74 to-violet-950/48 border-purple-500/28 text-white'
                      : 'bg-gradient-to-b from-purple-50/92 via-violet-50/78 to-fuchsia-50/85 border-purple-200/75 text-slate-900'
                  )}
                >
                    <div className="flex items-center justify-between gap-2">
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

                    <ul
                      className={cn(
                        'flex flex-col gap-[15px] typo-body-sm',
                        isDarkCardText ? 'text-slate-100' : 'text-slate-800'
                      )}
                    >
                      {tasksList.map((task, idx) => {
                        const cleanTask = task.replace(/^\d+\.\s*/, '');
                        const taskPalette = taskCardPalettes[idx % taskCardPalettes.length];
                        return (
                          <li
                            key={idx}
                            data-bento-subtone={taskPalette.tone}
                            className={cn(
                              'exp-bento-item-card p-[15px] rounded-[var(--radius-subcard,16px)] border shadow-sm hover:shadow-md transition-all flex items-start gap-[15px] min-w-0',
                              isDarkCardText ? taskPalette.dark : taskPalette.light
                            )}
                          >
                            <span
                              className={cn(
                                'w-6 h-6 rounded-full font-bold typo-badge flex items-center justify-center shrink-0 mt-0.5 shadow-sm tabular-nums exp-bento-preserve-color',
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
                </section>

  {/* THẺ 7: Danh sách dự án */}
                <section
                  id="experience-achievement-card"
                  data-multicolor-bento="true"
                  data-bento-tone="blue"
                  className={cn(
                    'experience-masonry-item exp-bento-surface-card bento-tone-blue transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border flex flex-col gap-[15px] min-w-0 h-auto',
                    isDarkCardText
                      ? 'bg-gradient-to-br from-blue-950/55 via-slate-900/74 to-indigo-950/48 border-blue-500/28 text-white'
                      : 'bg-gradient-to-br from-blue-50/92 via-indigo-50/78 to-sky-50/88 border-blue-200/75 text-slate-900'
                  )}
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
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
                          'px-3 py-1.5 rounded-full typo-badge font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95',
                          isDarkCardText
                            ? 'bg-orange-500/15 border-orange-400/30 text-orange-200 hover:bg-orange-500 hover:text-white'
                            : 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-600 hover:text-white hover:border-orange-600'
                        )}
                        title="Chuyển đến trang Dự án"
                      >
                        <span className="text-current">Xem Dự án</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-[12px] content-start">
                      {projectsList.map((proj, pIdx) => {
                        const palette = projectRowPalettes[pIdx % projectRowPalettes.length];
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            data-bento-subtone={palette.tone}
                            onClick={() => navigateToProjects(proj.projectId)}
                            title={`${proj.rawTitle} — Click để xem chi tiết dự án`}
                            className={cn(
                              'exp-bento-rect-btn exp-bento-item-card group p-[15px] rounded-[var(--radius-subcard,16px)] bg-gradient-to-r border transition-all flex items-center gap-[15px] text-left cursor-pointer min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                              isDarkCardText ? palette.rowDark : palette.rowLight
                            )}
                          >
                            <span
                              className={cn(
                                'px-2.5 py-1 rounded-lg font-bold typo-badge shrink-0 shadow-sm tabular-nums exp-bento-preserve-color',
                                palette.badge
                              )}
                            >
                              {proj.code}
                            </span>
                            <div className="min-w-0 flex-1 subcard-header-sync flex items-center gap-2">
                              <FolderKanban
                                className={cn(
                                  'w-4 h-4 shrink-0',
                                  isDarkCardText ? 'text-orange-300' : 'text-orange-600'
                                )}
                              />
                              <h3
                                data-subcard-title="true"
                                className={cn(
                                  'subcard-title-synced font-bold typo-h5 transition-colors leading-snug break-words min-w-0',
                                  isDarkCardText ? 'text-white' : 'text-slate-900',
                                  palette.titleHover
                                )}
                              >
                                {proj.title}
                              </h3>
                            </div>
                            <ArrowUpRight
                              className={cn(
                                'w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity',
                                isDarkCardText ? 'text-slate-300' : 'text-slate-600'
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                </section>
              </div>

              {/* HÀNG 4: Cam kết chất lượng cùng hàng với Kết quả đạt được */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px] items-start w-full min-w-0">
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
                        isBlackLeather
                          ? 'text-white'
                          : isBrownLeather
                            ? 'text-amber-300'
                            : isDarkSurface
                              ? 'text-teal-300'
                              : 'text-teal-700'
                      )}
                    >
                      <ShieldCheck className="w-6 h-6 shrink-0" />
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
                        const cmtIconColor = isBlackLeather
                          ? cIdx % 2 === 0
                            ? 'text-white'
                            : 'text-zinc-200'
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
                              'exp-bento-item-card rounded-[var(--radius-subcard,16px)] p-[15px] flex items-start gap-[15px] min-w-0 border bg-gradient-to-r',
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
                      'experience-masonry-item exp-bento-surface-card bento-tone-emerald transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[var(--radius-card,24px)] p-[15px] shadow-[0_14px_34px_-8px_rgba(30,41,59,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] backdrop-blur-md border min-w-0 h-auto flex flex-col gap-[15px]',
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

                      <div
                        className={cn(
                          'grid gap-[15px] items-start min-w-0 relative z-10',
                          kpisList.length === 1
                            ? 'grid-cols-1'
                            : 'grid-cols-1 sm:grid-cols-2'
                        )}
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
                          const spanLastOdd =
                            kpisList.length >= 3 && kpisList.length % 2 === 1 && kIdx === kpisList.length - 1;
                          return (
                            <div
                              key={`${kpi.label}-${kIdx}`}
                              data-bento-subtone={pal.tone}
                              className={cn(
                                'exp-bento-item-card p-[15px] rounded-[var(--radius-subcard,16px)] border bg-gradient-to-br flex flex-col justify-start gap-3 min-w-0 h-fit shadow-xs transition-all hover:shadow-md',
                                spanLastOdd && 'sm:col-span-2',
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
          </main>
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
              className="theme-modal-card max-w-4xl w-full rounded-[var(--radius-card,24px)] overflow-hidden shadow-2xl relative"
            >
              <div
                className={cn(
                  'relative aspect-[16/10] w-full flex items-center justify-center rounded-[var(--radius-subcard,16px)] overflow-hidden',
                  isDarkCardText ? 'bg-[#0B1220]' : 'bg-slate-100'
                )}
              >
                <img
                  src={curPhoto.src}
                  alt={curPhoto.title || activeMilestone.company}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-[var(--radius-subcard,16px)]"
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
