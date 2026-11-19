'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Building2,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  Layers,
  Trophy,
  ShoppingBag,
  Wallet,
  Monitor,
  Cpu,
  BookOpen,
  Sparkles,
  Network,
  Headphones,
  Gauge,
  ShieldCheck,
  Flame,
  Lock,
  ListChecks,
  FolderKanban,
  Camera,
  ZoomIn,
  ArrowLeft,
  MapPin,
  PhoneCall,
  Tv,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  X,
} from 'lucide-react';
import { EXPERIENCE_MILESTONES } from '@/data/experience';
import { PROJECTS_DATA } from '@/data/projects';
import { DOMAINS_DATA } from '@/data/domains';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';

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
      ? 'w-[40px] h-[40px] sm:w-[44px] sm:h-[44px]'
      : 'w-[50px] h-[50px]';

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
        marginInlineStart: isStacked && index > 0 ? '-12px' : '0px',
        zIndex: total - index,
        background: 'rgba(255, 255, 255, 0.50)',
        border: '1px solid rgba(255, 255, 255, 0.75)',
        boxShadow: '0 18px 40px -4px rgba(0, 0, 0, 0.35), 0 6px 16px -2px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
      title={`${logo.alt} — Nhấn vào logo để xem chi tiết công việc tại ${companyName}`}
      aria-label={`Xem chi tiết công việc tại ${companyName} (${logo.alt})`}
      className={cn(
        sizeClass,
        'aspect-square rounded-full p-0 ring-0 outline-none flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 hover:scale-110 hover:-translate-y-1 hover:z-30 active:scale-95 cursor-pointer focus-visible:outline-none'
      )}
    >
      {!hasFailedAll ? (
        <img
          src={imgSrc}
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
    stage: 'Nền Tảng Đầu Tiên: Chăm Sóc Khách Hàng Viễn Thông Di Động',
    summary: 'Khởi đầu sự nghiệp tại MobiFone, rèn luyện sự thấu hiểu tâm lý khách hàng, giao tiếp chuẩn mực và kỷ luật nghiệp vụ viễn thông.',
    voiceScript: 'Năm 2003, khởi đầu sự nghiệp tại MobiFone, phục vụ khách hàng mạng di động với chuẩn mực tận tâm.',
    highlightKpis: ['CSAT 98.2%', '12 Nhân sự', 'Xử lý đa nghiệp vụ'],
  },
  '2007': {
    title: 'Viễn Liên V247',
    stage: 'Bước Đệm Giám Sát: Lãnh Đạo Đội Ngũ Dịch Vụ Quốc Tế',
    summary: 'Thăng tiến lên Trưởng nhóm CSKH / Supervisor, phụ trách phân luồng cuộc gọi viễn thông quốc tế và đào tạo nhân viên mới.',
    voiceScript: 'Năm 2007, thăng tiến lên Trưởng nhóm CSKH tại Viễn Liên V247, tối ưu chất lượng phục vụ cước viễn thông quốc tế.',
    highlightKpis: ['SLA 98.6%', '12 Nhân sự', 'Giám sát vận hành'],
  },
  '2011': {
    title: 'LBC - HTVC',
    stage: 'Mở Rộng Quy Mô Đa Kênh: Truyền Hình & Internet Băng Thông Rộng',
    summary: 'Trưởng Phòng CSKH điều hành dịch vụ truyền hình cáp HTVC và viễn thông LBC, nâng cao tỷ lệ giải quyết khiếu nại tại chỗ.',
    voiceScript: 'Năm 2011, đảm nhiệm Trưởng Phòng CSKH tại LBC - HTVC, quản trị dịch vụ truyền hình và internet đa kênh.',
    highlightKpis: ['Giải quyết 95% khiếu nại', '12 Nhân sự', 'Hạ tầng đa dịch vụ'],
  },
  '2013': {
    title: 'VED (Garena / Shopee / AirPay)',
    stage: 'Bứt Phá Đỉnh Cao: Xây Dựng & Vận Hành Khối CSKH 130 Nhân Sự',
    summary: 'Kiến tạo và chỉ huy toàn diện trung tâm Contact Center quy mô 130 nhân sự, phục vụ triệu game thủ và người dùng TMĐT/Ví điện tử, xác lập kỷ lục CSAT 98.2%.',
    voiceScript: 'Năm 2013, bứt phá tại VED và Garena, lãnh đạo trung tâm CSKH 130 nhân sự, đạt CSAT 98.2%.',
    highlightKpis: ['CSAT 98.2%', 'SLA 98.6%', '130 Nhân sự VED'],
  },
  '2016': {
    title: 'Prudential Việt Nam',
    stage: 'Chuẩn Hóa Tài Chính - Bảo Hiểm: Kỷ Luật Tuân Thủ & Vận Hành Call Center',
    summary: 'Trưởng Phòng CallCenter Prudential, thiết lập quy trình kiểm soát chất lượng QA/QC nghiêm ngặt theo tiêu chuẩn tập đoàn tài chính đa quốc gia.',
    voiceScript: 'Năm 2016, Trưởng Phòng CallCenter Prudential, thiết lập quy chuẩn vận hành tài chính và bảo hiểm nghiêm ngặt.',
    highlightKpis: ['SLA 98.6%', 'QA/QC 96%', '12 Nhân sự'],
  },
  '2018': {
    title: 'Ví MoMo',
    stage: 'Kỷ Nguyên FinTech: Đồng Hành Cùng Siêu Ứng Dụng Hàng Chục Triệu Khách Hàng',
    summary: 'Trưởng Phòng CSKH MoMo, dẫn dắt đội ngũ hỗ trợ giao dịch số thời kỳ tăng trưởng nóng, ứng dụng tự động hóa giảm thời gian chờ.',
    voiceScript: 'Năm 2018, Trưởng Phòng CSKH Ví MoMo, đồng hành cùng sự tăng trưởng thần tốc của siêu ứng dụng thanh toán.',
    highlightKpis: ['FCR 91%', 'Triệu GD/ngày', 'FinTech SuperApp'],
  },
  '2023': {
    title: 'Finviet (ECO SCC)',
    stage: 'Số Hóa B2B: Vận Hành Hệ Sinh Thái Chợ Số & Chuỗi Bán Lẻ Toàn Quốc',
    summary: 'Trưởng Phòng Vận hành CSKH Finviet, số hóa hỗ trợ hơn 100.000 điểm tạp hóa và đại lý bán lẻ trên nền tảng chuỗi cung ứng ECO.',
    voiceScript: 'Năm 2023, Trưởng Phòng Vận hành CSKH Finviet, số hóa hệ thống chăm sóc mạng lưới đối tác tạp hóa và điểm bán lẻ.',
    highlightKpis: ['100.000+ Điểm bán', 'CSAT 95%', 'Hệ sinh thái B2B'],
  },
  '2026': {
    title: 'Chiến Lược CX 2026+',
    stage: 'Tầm Nhìn Giám Đốc Trải Nghiệm Khách Hàng (CX Director)',
    summary: 'Định hình chiến lược CX toàn diện: Lấy khách hàng làm trọng tâm, tích hợp AI Agents, CRM chuyên sâu và phát triển văn hóa dịch vụ phụng sự xuất sắc.',
    voiceScript: 'Năm 2026 trở đi, sẵn sàng cho cương vị Giám đốc Trải nghiệm Khách hàng, kiến tạo hệ thống dịch vụ lấy khách hàng làm trọng tâm.',
    highlightKpis: ['CX Director Vision', 'AI & CRM tích hợp', '100+ Nhân sự'],
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
  currentTheme = 'light-multicolor-glass-color',
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
    currentTheme === 'light-multicolor-glass-dark' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'black-cowhide-leather' ||
    currentTheme === 'dark-ice-blue-neu';
  const isLeather = cardStyle === 'cowhide-leather';
  const isBlackLeather = cardStyle === 'black-cowhide-leather';
  const isLightLeather = cardStyle === 'light-cowhide-leather';
  const isDarkSurface = isDark && !isLeather && !isBlackLeather;
  const isDarkCardText = isDarkSurface || isBlackLeather || isLeather;

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

  // States cho Timeline bìa gấp 3D theo cấu trúc mẫu đính kèm
  const [startIndex, setStartIndex] = useState<number>(0);
  const [visibleCols, setVisibleCols] = useState<number>(5);
  const isFolded = true;
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const boardRef = useRef<HTMLElement | null>(null);
  const detailCardRef = useRef<HTMLElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef<number>(0);

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

  const handleOpenJobCard = (key: string) => {
    setActiveKey(key);
    setShowJobCard(true);
    showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
  };

  // Giữ nguyên 100% dữ liệu 8 cột mốc từ website, áp dụng hệ màu & bố cục từ mẫu đính kèm
  const roadmapCards = [
    {
      key: '2003',
      yearBadge: 'Năm 2003',
      companyLine1: 'Tổng công ty',
      companyLine2: 'Viễn thông Mobifone',
      shortName: 'Tổng công ty Viễn thông Mobifone',
      roleSummary: 'Nhân viên CSKH',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2003']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Mobifone.png',
      productSummary: 'MobiFone Di Động',
      products: [
        { name: 'MobiFone', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Mobifone.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842198/Kinh%20nghi%E1%BB%87m/Logo_Mobifone.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Mobifone.png',
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
      companyLine2: 'Viễn liên V247',
      shortName: 'Công ty Viễn liên V247',
      roleSummary: 'Trưởng nhóm CSKH',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2007']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/V247.png',
      productSummary: 'Call 247 Quốc Tế',
      products: [
        { name: 'Call 247', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/V247.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842199/Kinh%20nghi%E1%BB%87m/Logo_V247.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/V247.png',
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
      roleSummary: 'Trưởng Phòng CSKH',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2011']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070947/LBC.png',
      productSummary: 'Truyền hình Cáp HTVC',
      products: [
        { name: 'HTVC', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/HTVC.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842200/Kinh%20nghi%E1%BB%87m/Logo_LBC.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070947/LBC.png',
          alt: 'Logo LBC',
        },
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842202/Kinh%20nghi%E1%BB%87m/Logo_HTVC.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/HTVC.png',
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
      roleSummary: 'Trưởng phòng CSKH',
      headcountLabel: '130 Nhân sự',
      description: EXPERIENCE_MILESTONES['2013']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070950/VED.png',
      productSummary: 'Shopee · Garena · AirPay · GCafe',
      products: [
        { name: 'VED', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070950/VED.png' },
        { name: 'Garena', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Garena.png' },
        { name: 'Shopee', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee.png' },
        { name: 'AirPay', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee_Paye.png' },
        { name: 'GCafe', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/GCafe.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842328/Kinh%20nghi%E1%BB%87m/Logo_VED.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070950/VED.png',
          alt: 'Logo VED',
        },
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793265515/Garena.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Garena.png',
          alt: 'Logo Garena',
        },
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842329/Kinh%20nghi%E1%BB%87m/Logo_GCafe.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/GCafe.png',
          alt: 'Logo GCafe',
        },
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842332/Kinh%20nghi%E1%BB%87m/Logo_AirPay_ShopeePay.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee_Paye.png',
          alt: 'Logo AirPay ShopeePay',
        },
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842203/Kinh%20nghi%E1%BB%87m/Logo_Shopee.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee.png',
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
      companyLine2: 'Prudentinal VN',
      shortName: 'Công ty BNNT Prudentinal VN',
      roleSummary: 'Trưởng Phòng CallCenter',
      headcountLabel: '12 Nhân sự',
      description: EXPERIENCE_MILESTONES['2016']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Prudential.png',
      productSummary: 'Bảo hiểm PruLife',
      products: [
        { name: 'Prudential', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Prudential.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842246/Kinh%20nghi%E1%BB%87m/Logo_Prudential.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Prudential.png',
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
      roleSummary: 'Trưởng Phòng CSKH',
      headcountLabel: '60 Nhân sự',
      description: EXPERIENCE_MILESTONES['2018']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Momo.png',
      productSummary: 'Siêu ứng dụng Ví MoMo',
      products: [
        { name: 'Ví MoMo', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Momo.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842331/Kinh%20nghi%E1%BB%87m/Logo_Momo.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Momo.png',
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
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Finviet.png',
      productSummary: 'Chợ Số Finviet',
      products: [
        { name: 'Finviet', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Finviet.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842205/Kinh%20nghi%E1%BB%87m/Logo_Finviet.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Finviet.png',
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
      shortName: 'Sẵn sàng cho thử thách mới',
      roleSummary: 'Trưởng phòng CSKH',
      headcountLabel: '100 Nhân sự',
      description: EXPERIENCE_MILESTONES['2026']?.cardDescription || '',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Power_Service.png',
      productSummary: 'Power Service • CS Strategy',
      products: [
        { name: 'Power Service', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Power_Service.png' },
      ],
      logos: [
        {
          src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842335/Kinh%20nghi%E1%BB%87m/Logo_PowerService.png',
          fallback: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Power_Service.png',
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

  // Tự động điều chỉnh số cột hiển thị theo kích thước thực tế của khung (Desktop: 5, Tablet: 3, Mobile: 1)
  useEffect(() => {
    const updateCols = () => {
      const boardWidth = boardRef.current?.clientWidth || window.innerWidth;
      if (boardWidth < 600) {
        setVisibleCols(1);
      } else if (boardWidth < 960) {
        setVisibleCols(3);
      } else {
        setVisibleCols(5);
      }
    };
    updateCols();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && boardRef.current) {
      ro = new ResizeObserver(updateCols);
      ro.observe(boardRef.current);
    }
    window.addEventListener('resize', updateCols);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateCols);
    };
  }, [showJobCard]);

  const maxStartIndex = Math.max(0, roadmapCards.length - visibleCols);

  useEffect(() => {
    if (startIndex > maxStartIndex) {
      setStartIndex(maxStartIndex);
    }
  }, [maxStartIndex, startIndex]);

  const handlePrev = () => {
    SoundEngine.playTap();
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    SoundEngine.playTap();
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
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

    if (dominantDelta > 0) {
      setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
    } else {
      setStartIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handlePointerDown = (clientX: number, clientY: number, target: EventTarget | null) => {
    if ((target as HTMLElement | null)?.closest('button')) return;
    dragStartXRef.current = clientX;
    dragStartYRef.current = clientY;
    setIsDragging(true);
  };

  const handlePointerUp = (clientX: number, clientY: number) => {
    if (dragStartXRef.current === null) return;
    const diffX = dragStartXRef.current - clientX;
    const diffY = dragStartYRef.current !== null ? dragStartYRef.current - clientY : 0;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
      } else {
        setStartIndex((prev) => Math.max(0, prev - 1));
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
      if (e.key === 'ArrowLeft') setStartIndex((prev) => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard, maxStartIndex]);

  const translatePercent = (startIndex * 100) / visibleCols;

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
          data-element-name="Thẻ chính Trang Hành trình sự nghiệp"
          data-element-type="card"
          data-element-page="experience"
          data-element-parent="experience-cards-track"
          className="page-main-card relative flex flex-col items-stretch justify-start select-none text-[var(--text-primary)] glass-scrollbar font-play text-left box-border p-[15px] gap-[15px] rounded-[14px] w-full h-full overflow-hidden"
          style={{ padding: '15px', borderRadius: '14px', gap: '15px' }}
        >
      {/* KHUNG TIMELINE BÌA GẤP 3D (CHỌN LOGO ĐỂ XEM CHI TIẾT CÔNG VIỆC — LẤP ĐẦY 100% THẺ CHÍNH VỚI ĐỆM 15PX) */}
      {!showJobCard && (
        <section
          ref={boardRef}
          id="experience-timeline-board"
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
            isLeather
              ? {
                  background: 'linear-gradient(145deg, #653A17 0%, #4A280E 100%)',
                  outline: '1.5px dashed rgba(245, 222, 179, 0.52)',
                  outlineOffset: '-7px',
                  borderRadius: '14px',
                }
                : isBlackLeather
                  ? {
                      background: 'linear-gradient(145deg, #1b1e25 0%, #0b0c10 100%)',
                      outline: '1.5px dashed rgba(226, 232, 240, 0.45)',
                      outlineOffset: '-7px',
                      borderRadius: '14px',
                    }
                : isLightLeather
                  ? {
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)',
                      outline: '1.5px dashed rgba(15, 23, 42, 0.78)',
                      outlineOffset: '-7px',
                      borderRadius: '14px',
                    }
                  : isDarkSurface
                    ? {
                        background: 'rgba(15, 23, 42, 0.86)',
                        borderRadius: '14px',
                      }
                    : { borderRadius: '14px' }
          }
          className={cn(
            'group/board relative w-full h-full min-h-0 flex-1 rounded-[14px] overflow-hidden select-none flex flex-col box-border z-[1]',
            !isLeather && !isBlackLeather && !isLightLeather && !isDarkSurface && 'bg-[#E2E8F0]',
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
        >
          {/* LỚP BẢN ĐỒ THẾ GIỚI DẠNG CHẤM TRÒN (HALFTONE DOTTED WORLD MAP) */}
          <div
            className={cn(
              'absolute inset-0 z-[15] pointer-events-none',
              isLeather || isBlackLeather || isDarkSurface ? 'opacity-20 mix-blend-screen' : 'opacity-25 mix-blend-multiply'
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
                      isLeather
                        ? '#F5DEB3'
                        : isBlackLeather
                          ? '#E2E8F0'
                          : isLightLeather
                            ? '#0F172A'
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

          {/* HEADER TRÊN CÙNG: TIÊU ĐỀ NỔI PHÍA TRÊN GIÚP CÁC CỘT LẤP ĐẦY 100% CHIỀU CAO Ở MỌI KÍCH THƯỚC */}
          <div className="absolute top-0 inset-x-0 z-[30] shrink-0 flex flex-wrap items-start justify-between gap-3 px-[25px] pt-[22px] sm:pt-[25px] lg:px-[2.8%] lg:pt-[2.8%] pointer-events-none">
            {/* Tiêu đề "Thời Gian / Công Tác" + 5 chấm màu + gạch chân hồng */}
            <header className="pointer-events-auto">
              <div
                style={{
                  color: isLeather
                    ? '#FDE68A'
                    : isBlackLeather
                      ? '#E2E8F0'
                      : isLightLeather
                        ? '#0F172A'
                        : isDarkSurface
                          ? '#38BDF8'
                          : '#0284C7',
                }}
                className="typo-h2 font-normal tracking-[0.06em] leading-[1.1]"
              >
                Thời Gian
              </div>
              <h1
                style={{
                  color: isLeather
                    ? '#FFF8DC'
                    : isBlackLeather
                      ? '#FFFFFF'
                      : isLightLeather
                        ? '#000000'
                        : isDarkSurface
                          ? '#F8FAFC'
                          : '#1E293B',
                }}
                className="typo-h1 font-bold tracking-[0.06em] leading-[1.08] mt-1 m-0"
              >
                Công Tác
              </h1>
              {/* Hàng 5 chấm tròn màu + gạch chân hồng */}
              <div className="flex items-center gap-[6px] mt-2.5 sm:mt-3">
                <span className="w-[8px] h-[8px] rounded-full bg-[#F8C605]" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#EE2A7B]" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#00AEEF]" />
                <span className="w-[8px] h-[8px] rounded-full bg-[#39B54A]" />
                <span
                  className={cn(
                    'w-[8px] h-[8px] rounded-full',
                    isDarkSurface || isLeather || isBlackLeather
                      ? 'bg-slate-200'
                      : isLightLeather
                        ? 'bg-[#0F172A]'
                        : 'bg-[#334155]'
                  )}
                />
                <span className="w-[44px] h-[2px] bg-[#EE2A7B] ml-1" />
              </div>
            </header>
          </div>

          {/* NÚT CUỘN NỔI HAI BÊN MÉP TRÁI / PHẢI KHI RÊ CHUỘT VÀO THẺ */}
          {startIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Cuộn lùi sang trái"
              className={cn(
                'absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 z-[40] w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border shadow-[0_10px_25px_rgba(15,23,42,0.22)] flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover/board:opacity-100 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer',
                isLeather
                  ? 'bg-[#522E10]/95 text-[#FFF8DC] border-[#F5DEB3]/50 hover:bg-[#D97706]'
                  : isBlackLeather
                    ? 'bg-[#1b1e25]/95 text-[#FFFFFF] border-[#E2E8F0]/40 hover:bg-[#334155]'
                    : isLightLeather
                      ? 'bg-white/95 text-[#000000] border-[#0F172A]/70 hover:bg-[#0F172A] hover:text-white'
                      : isDarkSurface
                        ? 'bg-slate-900/90 text-slate-100 border-white/25 hover:bg-[#0284C7] hover:text-white'
                        : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-[#0284C7] hover:text-white'
              )}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {startIndex < maxStartIndex && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Cuộn tới sang phải"
              className={cn(
                'absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 z-[40] w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border shadow-[0_10px_25px_rgba(15,23,42,0.22)] flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover/board:opacity-100 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer',
                isLeather
                  ? 'bg-[#522E10]/95 text-[#FFF8DC] border-[#F5DEB3]/50 hover:bg-[#D97706]'
                  : isBlackLeather
                    ? 'bg-[#1b1e25]/95 text-[#FFFFFF] border-[#E2E8F0]/40 hover:bg-[#334155]'
                    : isLightLeather
                      ? 'bg-white/95 text-[#000000] border-[#0F172A]/70 hover:bg-[#0F172A] hover:text-white'
                      : isDarkSurface
                        ? 'bg-slate-900/90 text-slate-100 border-white/25 hover:bg-[#0284C7] hover:text-white'
                        : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-[#0284C7] hover:text-white'
              )}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* KHUNG SLIDER HIỂN THỊ CÁC CỘT MỐC CÙNG LÚC */}
          <div
            className="relative w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden"
            style={{ perspective: '2200px' }}
          >
            <div
              className="flex w-full h-full flex-1 min-h-0 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${translatePercent}%)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {roadmapCards.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const isHovered = hoveredCol === item.key;
                const foldAngle = isFolded
                  ? visibleCols === 1
                    ? 0
                    : isHovered
                      ? 0
                      : isEven
                        ? -6
                        : 6
                  : 0;
                const needsEdgeCompensation = foldAngle !== 0;

                const colBackground = isLeather
                  ? item.colBgGradientLeather
                  : isBlackLeather
                    ? isEven
                      ? 'linear-gradient(to bottom, #252830, #15171c)'
                      : 'linear-gradient(to bottom, #1b1e25, #0f1116)'
                    : isLightLeather
                      ? isEven
                        ? 'linear-gradient(to bottom, #FFFFFF, #F1F5F9)'
                        : 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)'
                      : isDarkSurface
                        ? item.colBgGradientDark
                        : item.colBgGradient;

                const resolvedAccent = isLeather
                  ? '#FDE68A'
                  : isBlackLeather
                    ? '#93C5FD'
                    : isLightLeather
                      ? '#0F172A'
                      : isDarkSurface
                        ? item.darkAccentColor
                        : item.accentColor;

                const primaryTextColor = isLeather
                  ? '#FFF8DC'
                  : isBlackLeather
                    ? '#FFFFFF'
                    : isLightLeather
                      ? '#000000'
                      : isDarkSurface
                        ? '#F8FAFC'
                        : '#0F172A';

                const secondaryTextColor = isLeather
                  ? '#F5DEB3'
                  : isBlackLeather
                    ? '#CBD5E1'
                    : isLightLeather
                      ? '#1E293B'
                      : isDarkSurface
                        ? '#CBD5E1'
                        : '#475569';

                return (
                  <div
                    key={item.key}
                    id={`milestone-card-${item.key}`}
                    onMouseEnter={() => setHoveredCol(item.key)}
                    onMouseLeave={() => setHoveredCol(null)}
                    style={{
                      flex: `0 0 ${100 / visibleCols}%`,
                      width: `${100 / visibleCols}%`,
                      background: colBackground,
                      transform: `rotateY(${foldAngle}deg) ${
                        isHovered ? 'translateZ(14px)' : 'translateZ(0px)'
                      } ${needsEdgeCompensation ? 'scaleY(1.018) scaleX(1.012)' : ''}`,
                      transformOrigin: isEven ? 'left center' : 'right center',
                      zIndex: isHovered ? 25 : idx + 1,
                    }}
                    className="group relative h-full min-h-0 transition-all duration-300 shadow-[-10px_0_20px_-4px_rgba(15,23,42,0.12)] flex flex-col"
                  >
                    {/* Đường nếp gấp ánh sáng/bóng đổ tạo độ nổi 3D */}
                    {isFolded && visibleCols > 1 && (
                      <div
                        className="absolute inset-0 pointer-events-none z-[12] transition-opacity duration-300"
                        style={{
                          background: isLeather || isBlackLeather || isDarkSurface
                            ? isEven
                              ? 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.22) 100%)'
                              : 'linear-gradient(to right, rgba(0,0,0,0.24) 0%, rgba(255,255,255,0.07) 50%, rgba(0,0,0,0.16) 100%)'
                            : isEven
                              ? 'linear-gradient(to right, rgba(255,255,255,0.25) 0%, rgba(15,23,42,0.06) 100%)'
                              : 'linear-gradient(to right, rgba(15,23,42,0.08) 0%, rgba(255,255,255,0.22) 50%, rgba(15,23,42,0.04) 100%)',
                          opacity: isHovered ? 0.15 : 1,
                        }}
                      />
                    )}

                    {/* NỘI DUNG TỪNG CỘT MỐC (CĂN ĐỒNG ĐỀU THEO TRỤC DỌC, LẤP ĐẦY MỌI KÍCH THƯỚC) */}
                    <div className="relative z-[20] w-full h-full flex-1 min-h-0 flex flex-col pt-[112px] sm:pt-[128px] lg:pt-[142px] xl:pt-[152px]">
                      {/* 1. ICON LỊCH + NĂM */}
                      <div
                        style={{ color: primaryTextColor }}
                        className="w-full h-7 shrink-0 flex items-center justify-center gap-1.5 typo-h5 font-bold tracking-[0.03em] leading-none mb-2"
                      >
                        <Calendar className="w-[17px] h-[17px] shrink-0" strokeWidth={2.3} />
                        <span>{item.yearBadge}</span>
                      </div>

                      {/* 2. KHỐI MÀU NGANG CHỨA LOGO TRÒN Ở GIỮA — CLICK LOGO ĐỂ XEM CHI TIẾT CÔNG VIỆC */}
                      <div
                        style={{ background: item.blockGradient }}
                        className="w-full h-[92px] sm:h-[108px] lg:h-[120px] shrink-0 flex items-center justify-center px-3 shadow-[0_12px_22px_-2px_rgba(15,23,42,0.25)] transition-all duration-300 group-hover:brightness-105"
                      >
                        <div className="flex items-center justify-center">
                          {item.logos.map((logo, logoIdx) => (
                            <CircularLogo
                              key={logoIdx}
                              logo={logo}
                              isStacked={item.logos.length > 1}
                              index={logoIdx}
                              total={item.logos.length}
                              companyName={item.shortName}
                              onOpenDetail={() => handleOpenJobCard(item.key)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* 3. THÔNG TIN CÔNG TY, VỊ TRÍ, QUẢN LÝ & MÔ TẢ PHÍA DƯỚI */}
                      <div
                        data-no-wheel-horizontal="true"
                        className="exp-milestone-scroll flex-1 min-h-0 px-[8%] sm:px-[10%] pt-3 sm:pt-4 pb-12 sm:pb-14 flex flex-col overflow-y-auto overscroll-y-contain touch-pan-y no-scrollbar"
                      >
                        <h3
                          style={{ color: primaryTextColor }}
                          data-subcard-title="true"
                          className={cn(
                            'subcard-title-synced typo-h5 font-bold leading-[1.28] min-h-[2.6em] sm:min-h-[3.2em] border-b pb-2 mb-2.5 break-words flex flex-col justify-center select-none',
                            isLeather
                              ? 'border-[#F5DEB3]/35'
                              : isBlackLeather
                                ? 'border-[#E2E8F0]/25'
                                : isLightLeather
                                  ? 'border-[#0F172A]/35'
                                  : isDarkSurface
                                    ? 'border-white/15'
                                    : 'border-slate-300'
                          )}
                        >
                          <span className="leading-tight flex items-center gap-1.5">
                            <WebIcon name="building" className="w-3.5 h-3.5 shrink-0 opacity-80" />
                            <span>{item.companyLine1}</span>
                          </span>
                          <span className="block leading-tight">{item.companyLine2}</span>
                        </h3>

                        {/* Vị trí & Quản lý kèm icon */}
                        <div className="space-y-1.5 mb-2.5 typo-label font-normal">
                          <div className="flex items-start gap-1.5 leading-[1.35]">
                            <span
                              style={{ color: resolvedAccent }}
                              className="font-bold shrink-0 inline-flex items-center gap-1"
                            >
                              <Briefcase className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
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
                              <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
                              Quản lý:
                            </span>
                            <span style={{ color: primaryTextColor }} className="font-medium break-words">
                              {item.headcountLabel}
                            </span>
                          </div>
                        </div>

                        {/* Mô tả chi tiết (Dữ liệu thật từ EXPERIENCE_MILESTONES) */}
                        <p
                          style={{ color: secondaryTextColor }}
                          className="typo-caption font-normal leading-[1.45] break-words mb-3"
                        >
                          {item.description}
                        </p>

                        <div className="mt-auto pt-1 flex items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playTap();
                              handleOpenJobCard(item.key);
                            }}
                            style={{ color: resolvedAccent }}
                            className={cn(
                              'exp-bento-rect-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] text-xs font-bold border transition-all cursor-pointer active:scale-95',
                              isLeather
                                ? 'bg-[#522E10]/85 border-[#F5DEB3]/45 hover:bg-[#522E10]'
                                : isBlackLeather
                                  ? 'bg-[#1b1e25]/90 border-[#E2E8F0]/30 hover:bg-[#252830]'
                                  : isLightLeather
                                    ? 'bg-white border-[#cbd5e1] hover:bg-slate-100'
                                    : isDarkSurface
                                      ? 'bg-slate-900/75 border-white/20 hover:bg-slate-800'
                                      : 'bg-white/85 border-slate-300/80 hover:bg-white shadow-xs'
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

          {/* CHẤM PHÂN TRANG DƯỚI ĐÁY THẺ ĐỂ CHUYỂN NHANH */}
          <div
            className={cn(
              'absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[35] flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border',
              isLeather
                ? 'bg-[#522E10]/90 border-[#F5DEB3]/45'
                : isBlackLeather
                  ? 'bg-[#15171c]/95 border-[#E2E8F0]/35'
                  : isLightLeather
                    ? 'bg-white/95 border-[#0F172A]/60'
                    : isDarkSurface
                      ? 'bg-slate-900/85 border-white/20'
                      : 'bg-white/80 border-slate-200/70'
            )}
          >
            {Array.from({ length: maxStartIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setStartIndex(idx);
                }}
                aria-label={`Chuyển tới trang ${idx + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 cursor-pointer',
                  startIndex === idx
                    ? isLeather
                      ? 'w-7 bg-[#FDE68A]'
                      : isBlackLeather
                        ? 'w-7 bg-[#E2E8F0]'
                        : isLightLeather
                          ? 'w-7 bg-[#0F172A]'
                          : isDarkSurface
                            ? 'w-7 bg-[#38BDF8]'
                            : 'w-7 bg-[#0284C7]'
                    : isLeather
                      ? 'w-2 bg-[#F5DEB3]/40 hover:bg-[#F5DEB3]/75'
                      : isBlackLeather
                        ? 'w-2 bg-[#E2E8F0]/30 hover:bg-[#E2E8F0]/65'
                        : isLightLeather
                          ? 'w-2 bg-[#0F172A]/35 hover:bg-[#0F172A]/75'
                          : isDarkSurface
                            ? 'w-2 bg-slate-600 hover:bg-slate-400'
                            : 'w-2 bg-slate-300 hover:bg-slate-400'
                )}
              />
            ))}
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
            light: 'bg-gradient-to-r from-blue-50/95 to-sky-50/75 border-blue-200/85 hover:border-blue-400',
            dark: 'bg-gradient-to-r from-blue-950/55 to-sky-950/35 border-blue-500/30 hover:border-blue-400/60',
            badge: 'bg-blue-600 text-white',
          },
          {
            light: 'bg-gradient-to-r from-emerald-50/95 to-teal-50/75 border-emerald-200/85 hover:border-emerald-400',
            dark: 'bg-gradient-to-r from-emerald-950/55 to-teal-950/35 border-emerald-500/30 hover:border-emerald-400/60',
            badge: 'bg-emerald-600 text-white',
          },
          {
            light: 'bg-gradient-to-r from-orange-50/95 to-amber-50/75 border-orange-200/85 hover:border-orange-400',
            dark: 'bg-gradient-to-r from-orange-950/55 to-amber-950/35 border-orange-500/30 hover:border-orange-400/60',
            badge: 'bg-orange-500 text-white',
          },
          {
            light: 'bg-gradient-to-r from-purple-50/95 to-violet-50/75 border-purple-200/85 hover:border-purple-400',
            dark: 'bg-gradient-to-r from-purple-950/55 to-violet-950/35 border-purple-500/30 hover:border-purple-400/60',
            badge: 'bg-purple-600 text-white',
          },
          {
            light: 'bg-gradient-to-r from-rose-50/95 to-pink-50/75 border-rose-200/85 hover:border-rose-400',
            dark: 'bg-gradient-to-r from-rose-950/55 to-pink-950/35 border-rose-500/30 hover:border-rose-400/60',
            badge: 'bg-rose-600 text-white',
          },
          {
            light: 'bg-gradient-to-r from-cyan-50/95 to-indigo-50/75 border-cyan-200/85 hover:border-cyan-400',
            dark: 'bg-gradient-to-r from-cyan-950/55 to-indigo-950/35 border-cyan-500/30 hover:border-cyan-400/60',
            badge: 'bg-cyan-600 text-white',
          },
          {
            light: 'bg-gradient-to-r from-amber-50/95 to-yellow-50/75 border-amber-200/85 hover:border-amber-400',
            dark: 'bg-gradient-to-r from-amber-950/55 to-yellow-950/35 border-amber-500/30 hover:border-amber-400/60',
            badge: 'bg-amber-600 text-white',
          },
          {
            light: 'bg-gradient-to-r from-indigo-50/95 to-fuchsia-50/75 border-indigo-200/85 hover:border-indigo-400',
            dark: 'bg-gradient-to-r from-indigo-950/55 to-fuchsia-950/35 border-indigo-500/30 hover:border-indigo-400/60',
            badge: 'bg-indigo-600 text-white',
          },
        ];

        // Palette 3 cột Giới thiệu hành trình
        const introColumnStyles = [
          {
            Icon: Sparkles,
            titleColor: isDarkCardText ? 'text-orange-300' : 'text-orange-600',
            iconColor: isDarkCardText ? 'text-orange-300' : 'text-orange-600',
          },
          {
            Icon: Network,
            titleColor: isDarkCardText ? 'text-sky-300' : 'text-blue-600',
            iconColor: isDarkCardText ? 'text-sky-300' : 'text-blue-600',
          },
          {
            Icon: Headphones,
            titleColor: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
            iconColor: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
          },
        ];

        // Palette 6 màu cho các dự án trọng điểm
        const projectRowPalettes = [
          {
            rowLight: 'from-rose-50 to-orange-50/40 border-rose-100 hover:border-rose-300',
            rowDark: 'from-rose-950/45 to-slate-900/80 border-rose-500/30 hover:border-rose-400/60',
            badge: 'bg-rose-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-rose-300' : 'group-hover:text-rose-700',
          },
          {
            rowLight: 'from-blue-50 to-sky-50/40 border-blue-100 hover:border-blue-300',
            rowDark: 'from-blue-950/45 to-slate-900/80 border-blue-500/30 hover:border-blue-400/60',
            badge: 'bg-blue-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-sky-300' : 'group-hover:text-blue-700',
          },
          {
            rowLight: 'from-amber-50 to-yellow-50/40 border-amber-100 hover:border-amber-300',
            rowDark: 'from-amber-950/45 to-slate-900/80 border-amber-500/30 hover:border-amber-400/60',
            badge: 'bg-amber-500 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-amber-300' : 'group-hover:text-amber-700',
          },
          {
            rowLight: 'from-emerald-50 to-teal-50/40 border-emerald-100 hover:border-emerald-300',
            rowDark: 'from-emerald-950/45 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400/60',
            badge: 'bg-emerald-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-700',
          },
          {
            rowLight: 'from-purple-50 to-fuchsia-50/40 border-purple-100 hover:border-purple-300',
            rowDark: 'from-purple-950/45 to-slate-900/80 border-purple-500/30 hover:border-purple-400/60',
            badge: 'bg-purple-600 text-white',
            titleHover: isDarkCardText ? 'group-hover:text-purple-300' : 'group-hover:text-purple-700',
          },
          {
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

        const currentMilestoneIdx = roadmapCards.findIndex((c) => c.key === activeMilestone.key || c.key === activeKey);
        const prevMilestone = currentMilestoneIdx > 0 ? roadmapCards[currentMilestoneIdx - 1] : null;
        const nextMilestone =
          currentMilestoneIdx >= 0 && currentMilestoneIdx < roadmapCards.length - 1
            ? roadmapCards[currentMilestoneIdx + 1]
            : null;

        return (
          <>
            {/* Nút X Close thẻ chi tiết công việc nằm bên trên góc phải */}
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
                'theme-modal-close absolute top-5 right-5 sm:top-6 sm:right-6 z-[60] w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border backdrop-blur-md',
                isLightLeather
                  ? 'bg-[#fbfcfc]/95 border-[#cbd5e1] text-[#111827] hover:bg-[#111827] hover:text-white'
                  : isBlackLeather
                    ? 'bg-[#15171c]/95 border-[#E2E8F0]/40 text-white hover:bg-[#1b1e25]'
                    : isLeather
                      ? 'bg-[#522E10]/95 border-[#F5DEB3]/60 text-[#FFF8DC] hover:bg-[#653A17]'
                      : isDarkSurface
                        ? 'bg-slate-900/90 border-white/25 text-white hover:bg-slate-800'
                        : 'bg-white/95 border-slate-200/90 text-slate-900 hover:bg-slate-100'
              )}
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

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
              className="bento-card glass-card flex-1 min-h-0 h-full overflow-y-auto overflow-x-hidden glass-scrollbar rounded-[14px] block w-full min-w-0 p-[15px] animate-fadeIn font-play box-border"
              style={{ padding: '15px' }}
            >
            <div
              id="experience-bento-grid"
              className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-start content-start w-full min-w-0"
            >
              {/* CỘT TRÁI (Desktop lg:col-span-7 | Tablet/Mobile: display contents theo order đọc tự nhiên) */}
              <div
                id="experience-bento-col-left"
                className="contents lg:col-span-7 lg:flex lg:flex-col lg:gap-[15px] min-w-0"
              >
              {/* 1. HERO CARD: Banner, Điều hướng mốc & Thông tin tổng quan */}
              <section
                id="experience-info-card"
                className={cn(
                  'exp-bento-surface-card order-1 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] overflow-hidden shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08),0_4px_10px_-2px_rgba(15,23,42,0.04)] border flex flex-col gap-[15px] relative group min-w-0 h-auto',
                  isDarkCardText
                    ? 'bg-slate-900/75 border-white/15 text-white'
                    : 'bg-white border-slate-100 text-slate-900'
                )}
              >
                {/* Banner Image Header */}
                <div
                  className={cn(
                    'exp-bento-hero-banner relative h-44 sm:h-52 w-full rounded-[14px] overflow-hidden shrink-0',
                    isDarkSurface || isLeather || isBlackLeather ? 'bg-slate-900' : 'bg-slate-200'
                  )}
                >
                  {!bannerImgError && activeMilestone.bannerUrl ? (
                    <img
                      src={activeMilestone.bannerUrl}
                      alt={`Banner ${activeMilestone.company}`}
                      referrerPolicy="no-referrer"
                      onError={() => setBannerImgError(true)}
                      className="w-full h-full object-cover object-center rounded-[14px] group-hover:scale-105 transition-transform duration-700 opacity-95"
                    />
                  ) : (
                    <div
                      className={cn(
                        'w-full h-full bg-gradient-to-br opacity-95 rounded-[14px]',
                        customContent.gradient
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t to-transparent pointer-events-none',
                      isDarkSurface || isLeather || isBlackLeather
                        ? 'from-slate-950/15 via-slate-900/10'
                        : 'from-slate-900/10 via-slate-900/5'
                    )}
                  />

                  {/* Top Action Bar inside Banner: Quay lại Timeline + Chuyển mốc + Time Badge */}
                  <div className="absolute top-0 inset-x-0 z-10 p-[15px] flex flex-wrap items-center justify-between gap-[15px] pr-12 sm:pr-14">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setShowJobCard(false);
                        }}
                        className={cn(
                          'exp-bento-rect-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] text-xs font-bold border shadow-lg cursor-pointer transition-all active:scale-95',
                          isLightLeather
                            ? 'bg-[#fbfcfc]/95 border-[#cbd5e1] text-[#111827] hover:bg-white'
                            : isBlackLeather
                              ? 'bg-[#15171c]/95 border-[#E2E8F0]/40 text-white hover:bg-[#1b1e25]'
                              : isLeather
                                ? 'bg-[#522E10]/95 border-[#F5DEB3]/60 text-[#FFF8DC] hover:bg-[#653A17]'
                                : isDarkSurface
                                  ? 'bg-slate-900/90 backdrop-blur-md border-white/25 text-white hover:bg-slate-800'
                                  : 'bg-white/95 backdrop-blur-md border-white/85 text-slate-900 hover:bg-white'
                        )}
                        title="Quay lại Bảng Timeline (hoặc nhấn phím Esc)"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                        <span className="exp-bento-preserve-color">Timeline</span>
                      </button>

                      {prevMilestone && (
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setActiveKey(prevMilestone.key);
                          }}
                          aria-label={`Mốc trước: ${prevMilestone.yearBadge}`}
                          title={`Mốc trước: ${prevMilestone.shortName}`}
                          className={cn(
                            'exp-bento-rect-btn w-8 h-8 rounded-[14px] border shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-95',
                            isLightLeather
                              ? 'bg-[#fbfcfc]/95 border-[#cbd5e1] text-[#111827] hover:bg-white'
                              : isBlackLeather
                                ? 'bg-[#15171c]/95 border-[#E2E8F0]/40 text-white hover:bg-[#1b1e25]'
                                : isLeather
                                  ? 'bg-[#522E10]/95 border-[#F5DEB3]/60 text-[#FFF8DC] hover:bg-[#653A17]'
                                  : isDarkSurface
                                    ? 'bg-slate-900/90 backdrop-blur-md border-white/25 text-white hover:bg-slate-800'
                                    : 'bg-white/95 backdrop-blur-md border-white/85 text-slate-900 hover:bg-white'
                          )}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}

                      {nextMilestone && (
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setActiveKey(nextMilestone.key);
                          }}
                          aria-label={`Mốc tiếp theo: ${nextMilestone.yearBadge}`}
                          title={`Mốc tiếp theo: ${nextMilestone.shortName}`}
                          className={cn(
                            'exp-bento-rect-btn w-8 h-8 rounded-[14px] border shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-95',
                            isLightLeather
                              ? 'bg-[#fbfcfc]/95 border-[#cbd5e1] text-[#111827] hover:bg-white'
                              : isBlackLeather
                                ? 'bg-[#15171c]/95 border-[#E2E8F0]/40 text-white hover:bg-[#1b1e25]'
                                : isLeather
                                  ? 'bg-[#522E10]/95 border-[#F5DEB3]/60 text-[#FFF8DC] hover:bg-[#653A17]'
                                  : isDarkSurface
                                    ? 'bg-slate-900/90 backdrop-blur-md border-white/25 text-white hover:bg-slate-800'
                                    : 'bg-white/95 backdrop-blur-md border-white/85 text-slate-900 hover:bg-white'
                          )}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Time Badge */}
                    <div
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg flex items-center gap-1.5 max-w-full border',
                        isLightLeather
                          ? 'bg-[#fbfcfc] border-[#d1d5db] text-[#111827]'
                          : isBlackLeather
                            ? 'bg-[#15171c] border-[#E2E8F0]/40 text-white'
                            : isLeather
                              ? 'bg-[#522E10] border-[#F5DEB3]/60 text-[#FFF8DC]'
                              : isDarkSurface
                                ? 'bg-slate-900/90 backdrop-blur-md border-white/25 text-white'
                                : 'bg-white/95 backdrop-blur-md border-white/85 text-slate-900'
                      )}
                    >
                      <Calendar className={cn('w-3.5 h-3.5 shrink-0', isDarkCardText ? 'text-rose-400' : 'text-red-600')} />
                      <span className="truncate exp-bento-preserve-color">
                        {activeMilestone.period} ({activeMilestone.tenure})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Company Content Body */}
                <div className="relative flex flex-col gap-[15px] min-w-0">
                  <div
                    id="experience-company-name-card"
                    className={cn(
                      'exp-bento-item-card w-full p-[15px] rounded-[14px] border shadow-xs flex flex-col gap-[15px] min-w-0 relative z-10',
                      isDarkCardText
                        ? 'bg-slate-800/80 border-white/15 text-white'
                        : isLightLeather
                          ? 'bg-[#fbfcfc] border-[#d1d5db] text-[#111827]'
                          : 'bg-white/90 border-slate-200/90 text-slate-900'
                    )}
                  >
                    <div className="min-w-0 w-full flex flex-col gap-[15px]">
                      <div
                        className={cn(
                          'exp-bento-light-chip inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border max-w-full w-fit',
                          isDarkCardText
                            ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                            : isLightLeather
                              ? 'bg-[#edf1f4] text-rose-700 border-[#cbd5e1]'
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
                            <div className="flex items-center shrink-0">
                              {inlineLogos.map((logoItem, logoIdx) => (
                                <div
                                  key={`${logoItem.src}-${logoIdx}`}
                                  style={{
                                    zIndex: inlineLogos.length - logoIdx,
                                    marginInlineStart: logoIdx > 0 ? '-12px' : '0px',
                                    background: 'rgba(255, 255, 255, 0.50)',
                                    border: '1px solid rgba(255, 255, 255, 0.75)',
                                    boxShadow: '0 18px 40px -4px rgba(0, 0, 0, 0.35), 0 6px 16px -2px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                                  }}
                                  className={cn(
                                    'relative rounded-full overflow-hidden p-0 ring-0 outline-none flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 hover:-translate-y-1',
                                    useCompactLogo
                                      ? 'w-[40px] h-[40px] sm:w-[44px] sm:h-[44px]'
                                      : 'w-[48px] h-[48px]'
                                  )}
                                >
                                  <img
                                    src={logoItem.src}
                                    alt={logoItem.alt || activeMilestone.company}
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
                                'text-lg sm:text-2xl lg:text-3xl font-extrabold leading-tight break-words min-w-0 max-w-full',
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

                  {/* 3 THẺ CÙNG HÀNG: Chức vụ đảm nhiệm, Quy mô vận hành, Dịch vụ */}
                  <div
                    className={cn(
                      'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[15px] pt-[15px] border-t items-stretch min-w-0 relative z-10',
                      isDarkCardText
                        ? 'border-white/10'
                        : isLightLeather
                          ? 'border-slate-300/80'
                          : 'border-slate-200/80'
                    )}
                  >
                    {/* Thẻ 1: Chức vụ đảm nhiệm */}
                    <div
                      className={cn(
                        'exp-bento-item-card flex flex-col p-[15px] rounded-[14px] border min-w-0 h-full gap-[15px]',
                        isDarkCardText
                          ? 'bg-gradient-to-br from-orange-950/50 to-amber-950/35 border-orange-500/25'
                          : isLightLeather
                            ? 'bg-[#edf1f4] border-[#cbd5e1]'
                            : 'bg-gradient-to-br from-orange-50 to-amber-50/70 border-orange-100'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className={cn('w-4 h-4 sm:w-5 sm:h-5 shrink-0', isDarkCardText ? 'text-orange-300' : 'text-orange-600')} />
                        <p
                          className={cn(
                            'text-xs font-semibold tracking-wide',
                            isDarkCardText ? 'text-slate-300' : 'text-slate-600'
                          )}
                        >
                          Chức vụ đảm nhiệm
                        </p>
                      </div>
                      <p
                        className={cn(
                          'font-bold text-sm sm:text-base leading-snug break-words',
                          isDarkCardText ? 'text-white' : 'text-slate-900'
                        )}
                      >
                        {activeMilestone.roleTitle}
                      </p>
                    </div>

                    {/* Thẻ 2: Quy mô vận hành */}
                    <div
                      className={cn(
                        'exp-bento-item-card flex flex-col p-[15px] rounded-[14px] border min-w-0 h-full gap-[15px]',
                        isDarkCardText
                          ? 'bg-gradient-to-br from-blue-950/50 to-indigo-950/35 border-blue-500/25'
                          : isLightLeather
                            ? 'bg-[#edf1f4] border-[#cbd5e1]'
                            : 'bg-gradient-to-br from-blue-50 to-indigo-50/70 border-blue-100'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Users
                          className={cn(
                            'w-4 h-4 sm:w-5 sm:h-5 shrink-0',
                            isDarkCardText ? 'text-sky-400' : 'text-blue-600'
                          )}
                        />
                        <p
                          className={cn(
                            'text-xs font-semibold tracking-wide',
                            isDarkCardText ? 'text-slate-300' : 'text-slate-600'
                          )}
                        >
                          Quy mô vận hành
                        </p>
                      </div>
                      <p
                        className={cn(
                          'font-bold text-sm sm:text-base leading-snug break-words',
                          isDarkCardText ? 'text-white' : 'text-slate-900'
                        )}
                      >
                        {activeMilestone.scaleDesc || `${activeMilestone.headcount} nhân sự`}
                      </p>
                    </div>

                    {/* Thẻ 3: Dịch vụ */}
                    <div
                      id="experience-company-services"
                      className={cn(
                        'exp-bento-item-card sm:col-span-2 xl:col-span-1 rounded-[14px] p-[15px] border flex flex-col gap-[15px] min-w-0 h-full',
                        isDarkCardText
                          ? 'bg-slate-900/55 border-white/10 text-white'
                          : isLightLeather
                            ? 'bg-[#edf1f4] border-[#cbd5e1] text-[#111827]'
                            : 'bg-gradient-to-br from-amber-50/60 via-white/90 to-orange-50/60 border-orange-200/70 text-slate-900'
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2
                          className={cn(
                            'text-sm sm:text-base font-bold flex items-center gap-1.5',
                            isDarkCardText
                              ? 'text-amber-400'
                              : isLightLeather
                                ? 'text-[#111827]'
                                : 'text-orange-700'
                          )}
                        >
                          <Layers className={cn('w-4 h-4 shrink-0', isLightLeather && 'text-orange-700')} />
                          <span>Dịch vụ</span>
                        </h2>
                        <button
                          type="button"
                          onClick={navigateToServices}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors shrink-0',
                            isDarkCardText
                              ? 'bg-orange-500/15 border-orange-400/30 text-orange-200 hover:bg-orange-500/30'
                              : isLightLeather
                                ? 'bg-white border-[#cbd5e1] text-[#111827] hover:bg-slate-200/80'
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
                                'exp-bento-light-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border text-xs font-semibold leading-snug transition-colors cursor-pointer',
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

              {/* 5. GIỚI THIỆU HÀNH TRÌNH */}
              <section
                id="experience-banner-card"
                className={cn(
                  'exp-bento-surface-card order-5 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06),0_4px_10px_-2px_rgba(15,23,42,0.03)] border min-w-0 h-auto flex flex-col gap-[15px]',
                  isDarkCardText
                    ? 'bg-gradient-to-br from-rose-950/35 via-slate-900/80 to-orange-950/30 border-rose-500/25 text-white'
                    : 'bg-gradient-to-br from-rose-50 via-white to-orange-50 border-rose-100 text-slate-900'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2
                    className={cn(
                      'text-base sm:text-lg font-bold flex items-center gap-2',
                      isDarkCardText
                        ? 'text-rose-300'
                        : isLightLeather
                          ? 'text-[#111827]'
                          : 'text-rose-700'
                    )}
                  >
                    <BookOpen className={cn('w-5 h-5 sm:w-6 sm:h-6 shrink-0', isLightLeather && 'text-rose-700')} />
                    <span>Giới thiệu hành trình</span>
                  </h2>
                  <span
                    className={cn(
                      'exp-bento-light-chip text-xs sm:text-sm font-semibold px-3 py-1 rounded-full border self-start sm:self-auto',
                      isDarkCardText
                        ? 'bg-rose-500/15 border-rose-400/30 text-rose-200'
                        : isLightLeather
                          ? 'bg-[#edf1f4] border-[#cbd5e1] text-[#111827]'
                          : 'bg-white/85 border-rose-200/90 text-rose-700'
                    )}
                  >
                    {narrativeTitle}
                  </span>
                </div>

                {(activeMilestone.highlightText || activeMilestone.cardDescription) && (
                  <p
                    className={cn(
                      'exp-bento-item-card text-sm sm:text-base leading-relaxed p-[15px] rounded-[14px] border break-words',
                      isDarkCardText
                        ? 'bg-slate-900/70 border-white/10 text-slate-200'
                        : 'bg-white/85 border-rose-100/90 text-slate-800'
                    )}
                  >
                    {activeMilestone.highlightText || activeMilestone.cardDescription}
                  </p>
                )}

                {introBlocks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-[15px] items-stretch">
                    {introBlocks.map((item, idx) => {
                      const colStyle = introColumnStyles[idx % introColumnStyles.length];
                      const ColIcon = colStyle.Icon;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            'exp-bento-item-card p-[15px] rounded-[14px] border shadow-sm min-w-0 h-full flex flex-col gap-[15px]',
                            isDarkCardText
                              ? 'bg-slate-900/75 border-white/10'
                              : 'bg-white border-slate-100'
                          )}
                        >
                          <h3
                            className={cn(
                              'font-bold text-base flex items-center gap-1.5',
                              colStyle.titleColor
                            )}
                          >
                            <ColIcon className={cn('w-4 h-4 shrink-0', colStyle.iconColor)} />
                            <span className="break-words text-current">{item.title}</span>
                          </h3>
                          <p
                            className={cn(
                              'text-sm sm:text-base leading-relaxed break-words',
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

                <div className="flex items-start sm:items-center gap-[15px] bg-rose-600 text-white p-[15px] rounded-[14px] shadow-sm">
                  <Gauge className="w-5 h-5 text-amber-300 shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-sm sm:text-base font-medium leading-snug text-white break-words exp-bento-preserve-color">
                    {philosophyText}
                  </p>
                </div>
              </section>

              {/* 6. DANH SÁCH CÔNG VIỆC */}
              <section
                id="experience-responsibility-card"
                className={cn(
                  'exp-bento-surface-card order-6 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06),0_4px_10px_-2px_rgba(15,23,42,0.03)] border min-w-0 h-auto flex flex-col gap-[15px]',
                  isDarkCardText
                    ? 'bg-gradient-to-b from-purple-950/35 to-slate-900/80 border-purple-500/25 text-white'
                    : 'bg-gradient-to-b from-purple-50/85 to-white border-purple-100 text-slate-900'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2
                    className={cn(
                      'text-base sm:text-lg font-bold flex items-center gap-2',
                      isDarkCardText
                        ? 'text-purple-300'
                        : isLightLeather
                          ? 'text-[#111827]'
                          : 'text-purple-700'
                    )}
                  >
                    <ListChecks className={cn('w-5 h-5 shrink-0', isLightLeather && 'text-purple-700')} />
                    <span>Danh sách công việc</span>
                  </h2>
                  <span
                    className={cn(
                      'exp-bento-light-chip text-xs font-bold px-2.5 py-1 rounded-full shrink-0 tabular-nums border',
                      isDarkCardText
                        ? 'bg-purple-500/20 text-purple-200 border-purple-400/30'
                        : isLightLeather
                          ? 'bg-[#edf1f4] text-[#111827] border-[#cbd5e1]'
                          : 'bg-purple-100/90 text-purple-800 border-purple-200/80'
                    )}
                  >
                    {tasksList.length} Hạng mục
                  </span>
                </div>

                <ul
                  className={cn(
                    'flex flex-col gap-[15px] text-sm sm:text-base',
                    isDarkCardText ? 'text-slate-100' : 'text-slate-800'
                  )}
                >
                  {tasksList.map((task, idx) => {
                    const cleanTask = task.replace(/^\d+\.\s*/, '');
                    const taskPalette = taskCardPalettes[idx % taskCardPalettes.length];
                    return (
                      <li
                        key={idx}
                        className={cn(
                          'exp-bento-item-card p-[15px] rounded-[14px] border shadow-sm hover:shadow-md transition-all flex items-start gap-[15px] min-w-0',
                          isDarkCardText ? taskPalette.dark : taskPalette.light
                        )}
                      >
                        <span
                          className={cn(
                            'w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm tabular-nums exp-bento-preserve-color',
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

              {/* 9. HÌNH ẢNH KỶ NIỆM GALLERY */}
              <section
                id="experience-memories-card"
                className={cn(
                  'exp-bento-surface-card order-9 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08),0_4px_10px_-2px_rgba(15,23,42,0.04)] border relative overflow-hidden flex flex-col gap-[15px] min-w-0 h-auto',
                  isDarkCardText
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : 'bg-gradient-to-br from-white via-amber-50/45 to-orange-50/55 border-amber-200/75 text-slate-900'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    className={cn(
                      'text-base sm:text-lg font-bold flex items-center gap-2',
                      isDarkCardText
                        ? 'text-amber-400'
                        : isLightLeather
                          ? 'text-[#111827]'
                          : 'text-amber-700'
                    )}
                  >
                    <Camera
                      className={cn(
                        'w-5 h-5 sm:w-6 sm:h-6 shrink-0',
                        isDarkCardText ? 'text-amber-400' : 'text-amber-700'
                      )}
                    />
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
                        'text-xs flex items-center gap-1 shrink-0 cursor-pointer transition-colors font-semibold px-2.5 py-1 rounded-full border',
                        isDarkCardText
                          ? 'bg-amber-500/15 border-amber-400/30 text-amber-200 hover:bg-amber-500/30'
                          : isLightLeather
                            ? 'bg-[#edf1f4] border-[#cbd5e1] text-[#111827] hover:bg-slate-200'
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
                      'grid gap-[15px] content-start',
                      photosList.length === 1
                        ? 'grid-cols-1'
                        : photosList.length >= 6
                          ? 'grid-cols-2 xl:grid-cols-3'
                          : 'grid-cols-2'
                    )}
                  >
                    {photosList.map((photo, pIdx) => {
                      const hasImgFailed = Boolean(failedPhotoSrcs[photo.src]);
                      const borderHover = photoBorderAccents[pIdx % photoBorderAccents.length];
                      const count = photosList.length;
                      const isTwoColHero = (count === 3 || count === 5) && pIdx === 0;
                      const isSevenColHero = count === 7 && pIdx === 0;
                      const isEightColHero = count === 8 && pIdx === 0;
                      return (
                        <button
                          key={photo.src + pIdx}
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setCarouselSlideIdx(pIdx);
                            setIsPhotoLightboxOpen(true);
                          }}
                          aria-label={`Phóng to hình kỷ niệm ${pIdx + 1}: ${photo.title || activeMilestone.company}`}
                          className={cn(
                            'exp-bento-rect-btn group relative rounded-[14px] overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer p-0 text-left',
                            isEightColHero ? 'aspect-[16/10] xl:aspect-auto xl:h-full' : 'aspect-[16/10]',
                            isDarkSurface
                              ? 'bg-slate-800 border-slate-700/70'
                              : isBlackLeather
                                ? 'bg-[#1b1e25] border-[#E2E8F0]/25'
                                : isLightLeather
                                  ? 'bg-[#edf1f4] border-[#d1d5db]'
                                  : isLeather
                                    ? 'bg-[#522E10] border-[#F5DEB3]/35'
                                    : 'bg-white/80 border-slate-200/90 shadow-xs',
                            borderHover,
                            isTwoColHero && 'col-span-2 max-h-[240px] w-full',
                            isSevenColHero && 'col-span-2 xl:col-span-3 max-h-[240px] w-full',
                            isEightColHero && 'xl:col-span-2 w-full',
                            count === 1 && 'min-h-[180px]'
                          )}
                        >
                          {!hasImgFailed ? (
                            <img
                              src={photo.src}
                              alt={photo.title || activeMilestone.company}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={() =>
                                setFailedPhotoSrcs((prev) => ({ ...prev, [photo.src]: true }))
                              }
                              className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div
                              className={cn(
                                'w-full h-full flex flex-col items-center justify-center gap-[15px] p-[15px]',
                                isDarkSurface
                                  ? 'bg-slate-800 text-slate-300'
                                  : isBlackLeather
                                    ? 'bg-[#1b1e25] text-white'
                                    : isLightLeather
                                      ? 'bg-[#edf1f4] text-[#374151]'
                                      : isLeather
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
                              <span className="text-xs font-semibold text-center truncate max-w-full">
                                {photo.title || activeMilestone.company}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between gap-2 p-2.5">
                            <span className="text-xs font-semibold text-white truncate exp-bento-preserve-color">
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
                      'rounded-[14px] border p-[15px] flex items-center justify-center',
                      isDarkSurface
                        ? 'bg-slate-800/70 border-slate-700 text-slate-300'
                        : isBlackLeather
                          ? 'bg-[#1b1e25] border-[#E2E8F0]/25 text-white'
                          : isLightLeather
                            ? 'bg-[#edf1f4] border-[#d1d5db] text-[#374151]'
                            : isLeather
                              ? 'bg-[#522E10] border-[#F5DEB3]/35 text-[#FFF8DC]'
                              : 'bg-white/75 border-slate-200/80 text-slate-700'
                    )}
                  >
                    <span className="text-sm">
                      Chưa có hình ảnh kỷ niệm cho cột mốc này.
                    </span>
                  </div>
                )}
              </section>
              </div>

              {/* CỘT PHẢI (Desktop lg:col-span-5 | Tablet/Mobile: display contents theo order đọc tự nhiên) */}
              <div
                id="experience-bento-col-right"
                className="contents lg:col-span-5 lg:flex lg:flex-col lg:gap-[15px] min-w-0"
              >

              {/* 4. KẾT QUẢ ĐẠT ĐƯỢC (KPIs & THÀNH TỰU ĐO LƯỜNG) */}
              {kpisList.length > 0 && (
                <section
                  id="experience-results-card"
                  data-element-name="Thẻ Kết quả đạt được"
                  data-element-type="card"
                  className={cn(
                    'exp-bento-surface-card order-4 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06),0_4px_10px_-2px_rgba(15,23,42,0.03)] border min-w-0 h-auto flex flex-col gap-[15px]',
                    isDarkCardText
                      ? 'bg-gradient-to-br from-emerald-950/35 via-slate-900/80 to-cyan-950/30 border-emerald-500/25 text-white'
                      : 'bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/60 border-emerald-100 text-slate-900'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                    <h2
                      className={cn(
                        'text-base sm:text-lg font-bold flex items-center gap-2',
                        isDarkCardText
                          ? 'text-emerald-300'
                          : isLightLeather
                            ? 'text-[#111827]'
                            : 'text-emerald-700'
                      )}
                    >
                      <Trophy className={cn('w-5 h-5 sm:w-6 sm:h-6 shrink-0', isLightLeather && 'text-emerald-700')} />
                      <span>Kết quả đạt được</span>
                    </h2>
                    <span
                      className={cn(
                        'exp-bento-light-chip text-xs font-bold px-2.5 py-1 rounded-full shrink-0 tabular-nums border',
                        isDarkCardText
                          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                          : isLightLeather
                            ? 'bg-[#edf1f4] text-[#111827] border-[#cbd5e1]'
                            : 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80'
                      )}
                    >
                      {kpisList.length} Chỉ số
                    </span>
                  </div>

                  <div
                    className={cn(
                      'grid gap-[15px] items-stretch min-w-0 relative z-10',
                      kpisList.length === 1
                        ? 'grid-cols-1'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'
                    )}
                  >
                    {kpisList.map((kpi, kIdx) => {
                      const kpiPalettes = [
                        {
                          light: 'from-emerald-50/90 to-teal-50/65 border-emerald-200/80',
                          dark: 'from-emerald-950/50 to-teal-950/35 border-emerald-500/30',
                          value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-emerald-300' : 'text-emerald-700',
                          bar: 'from-emerald-500 to-teal-500',
                          icon: isDarkCardText ? 'text-emerald-300' : 'text-emerald-600',
                        },
                        {
                          light: 'from-sky-50/90 to-blue-50/65 border-sky-200/80',
                          dark: 'from-sky-950/50 to-blue-950/35 border-sky-500/30',
                          value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-sky-300' : 'text-blue-700',
                          bar: 'from-sky-500 to-blue-600',
                          icon: isDarkCardText ? 'text-sky-300' : 'text-blue-600',
                        },
                        {
                          light: 'from-amber-50/90 to-orange-50/65 border-amber-200/80',
                          dark: 'from-amber-950/50 to-orange-950/35 border-amber-500/30',
                          value: isLeather ? 'text-amber-200' : isDarkCardText ? 'text-amber-300' : 'text-orange-700',
                          bar: 'from-amber-500 to-orange-500',
                          icon: isDarkCardText ? 'text-amber-300' : 'text-orange-600',
                        },
                        {
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
                          className={cn(
                            'exp-bento-item-card p-[15px] rounded-[14px] border bg-gradient-to-br flex flex-col justify-between gap-[15px] min-w-0 h-full shadow-xs transition-all hover:shadow-md',
                            spanLastOdd && 'sm:col-span-2 lg:col-span-1 xl:col-span-2',
                            isDarkCardText ? pal.dark : isLightLeather ? 'bg-[#edf1f4] border-[#cbd5e1]' : pal.light
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 min-w-0">
                            <span
                              className={cn(
                                'w-8 h-8 rounded-[14px] flex items-center justify-center shrink-0 border',
                                isDarkCardText
                                  ? 'bg-white/10 border-white/15'
                                  : isLightLeather
                                    ? 'bg-white border-[#cbd5e1]'
                                    : 'bg-white/85 border-slate-200/80'
                              )}
                            >
                              {kIdx % 2 === 0 ? (
                                <TrendingUp className={cn('w-4 h-4 shrink-0', pal.icon)} />
                              ) : (
                                <CheckCircle2 className={cn('w-4 h-4 shrink-0', pal.icon)} />
                              )}
                            </span>
                            <span
                              className={cn(
                                'text-xl sm:text-2xl font-extrabold tabular-nums tracking-tight shrink-0 exp-bento-preserve-color',
                                isLightLeather ? 'text-[#111827]' : pal.value
                              )}
                            >
                              {kpi.displayValue}
                            </span>
                          </div>

                          <p
                            className={cn(
                              'text-sm sm:text-base font-semibold leading-snug break-words',
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

              {/* 7. DANH SÁCH DỰ ÁN */}
              <section
                id="experience-achievement-card"
                className={cn(
                  'exp-bento-surface-card order-7 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06),0_4px_10px_-2px_rgba(15,23,42,0.03)] border flex flex-col gap-[15px] min-w-0 h-auto',
                  isDarkCardText
                    ? 'bg-slate-900/75 border-white/15 text-white'
                    : 'bg-white border-slate-100 text-slate-900'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    className={cn(
                      'text-base sm:text-lg font-bold flex items-center gap-2',
                      isDarkCardText
                        ? 'text-orange-300'
                        : isLightLeather
                          ? 'text-[#111827]'
                          : 'text-orange-700'
                    )}
                  >
                    <FolderKanban className={cn('w-5 h-5 sm:w-6 sm:h-6 shrink-0', isLightLeather && 'text-orange-700')} />
                    <span>Danh sách dự án</span>
                  </h2>

                  <button
                    type="button"
                    onClick={() => navigateToProjects()}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95',
                      isDarkCardText
                        ? 'bg-orange-500/15 border-orange-400/30 text-orange-200 hover:bg-orange-500 hover:text-white'
                        : isLightLeather
                          ? 'bg-[#edf1f4] border-[#cbd5e1] text-[#111827] hover:bg-[#111827] hover:text-white hover:border-[#111827]'
                          : 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-600 hover:text-white hover:border-orange-600'
                    )}
                    title="Chuyển đến trang Dự án"
                  >
                    <span className="text-current">Xem Dự án</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>

                <div className="flex flex-col gap-[15px] content-start">
                  {projectsList.map((proj, pIdx) => {
                    const palette = projectRowPalettes[pIdx % projectRowPalettes.length];
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => navigateToProjects(proj.projectId)}
                        title={`${proj.rawTitle} — Click để xem chi tiết dự án`}
                        className={cn(
                          'exp-bento-rect-btn exp-bento-item-card group p-[15px] rounded-[14px] bg-gradient-to-r border transition-all flex items-center gap-[15px] text-left cursor-pointer min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                          isDarkCardText ? palette.rowDark : palette.rowLight
                        )}
                      >
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-lg font-extrabold text-xs shrink-0 shadow-sm tabular-nums exp-bento-preserve-color',
                            palette.badge
                          )}
                        >
                          {proj.code}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3
                            className={cn(
                              'font-bold text-sm sm:text-base transition-colors leading-snug break-words',
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

              {/* 8. CAM KẾT CHẤT LƯỢNG */}
              <section
                id="experience-commitments-card"
                className={cn(
                  'exp-bento-surface-card order-8 lg:order-none transition-all duration-300 hover:-translate-y-0.5 w-full rounded-[14px] p-[15px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.12),0_4px_10px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col gap-[15px] min-w-0 h-auto border',
                  isLightLeather
                    ? 'text-[#111827]'
                    : isDarkSurface || isLeather || isBlackLeather
                      ? 'text-white'
                      : 'text-slate-900'
                )}
              >
                <div className="flex items-center gap-2.5 relative z-10">
                  <ShieldCheck
                    className={cn(
                      'w-6 h-6 shrink-0',
                      isLightLeather
                        ? 'text-amber-700'
                        : isBlackLeather
                          ? 'text-[#E2E8F0]'
                          : isLeather
                            ? 'text-amber-300'
                            : isDarkSurface
                              ? 'text-teal-300'
                              : 'text-teal-700'
                    )}
                  />
                  <h2
                    className={cn(
                      'text-base sm:text-lg font-bold',
                      isLightLeather
                        ? 'text-[#111827]'
                        : isBlackLeather
                          ? 'text-[#E2E8F0]'
                          : isLeather
                            ? 'text-amber-300'
                            : isDarkSurface
                              ? 'text-teal-300'
                              : 'text-teal-700'
                    )}
                  >
                    Cam kết chất lượng
                  </h2>
                </div>

                <div className="flex flex-col gap-[15px] relative z-10">
                  {commitmentsList.map((cmtText, cIdx) => {
                    const CmtIcon = cIdx % 2 === 0 ? Flame : Lock;
                    const cmtIconColor = isLightLeather
                      ? cIdx % 2 === 0
                        ? 'text-amber-700'
                        : 'text-teal-700'
                      : isBlackLeather
                        ? cIdx % 2 === 0
                          ? 'text-[#E2E8F0]'
                          : 'text-sky-300'
                        : isLeather
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
                        className="exp-bento-item-card rounded-[14px] p-[15px] flex items-start gap-[15px] min-w-0 border"
                      >
                        <CmtIcon className={cn('w-5 h-5 shrink-0 mt-0.5', cmtIconColor)} />
                        <p
                          className={cn(
                            'text-sm sm:text-base font-medium leading-snug break-words min-w-0 flex-1',
                            isLightLeather
                              ? 'text-[#111827]'
                              : isDarkSurface || isLeather || isBlackLeather
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
              className="theme-modal-card max-w-4xl w-full rounded-[14px] overflow-hidden shadow-2xl relative"
            >
              <div
                className={cn(
                  'relative aspect-[16/10] w-full flex items-center justify-center rounded-[14px] overflow-hidden',
                  isDarkCardText ? 'bg-[#0B1220]' : 'bg-slate-100'
                )}
              >
                <img
                  src={curPhoto.src}
                  alt={curPhoto.title || activeMilestone.company}
                  className="w-full h-full object-contain rounded-[14px]"
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
                  <div className="flex items-center gap-2">
                    <h4 className="typo-popup-title text-[var(--text-heading,var(--text-primary))] truncate">
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
