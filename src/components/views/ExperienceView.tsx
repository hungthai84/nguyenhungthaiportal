'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Briefcase, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { EXPERIENCE_MILESTONES } from '@/data/experience';
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
      }}
      title={`${logo.alt} — Nhấn vào logo để xem chi tiết công việc tại ${companyName}`}
      aria-label={`Xem chi tiết công việc tại ${companyName} (${logo.alt})`}
      className={cn(
        sizeClass,
        'aspect-square bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden shrink-0 transition-transform duration-300 hover:scale-110 hover:z-30 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        isStacked && 'ring-2 ring-white'
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
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      ) : (
        <span className="typo-badge font-bold text-slate-800">{initials}</span>
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
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({ 
  currentTheme = 'light-glass',
  onShowNotification,
  onNavigateTab
}) => {
  const { showToast } = useToast();
  const { isDark: themeIsDark, cardStyle } = useTheme();
  const isDark = themeIsDark || currentTheme === 'dark-glassmorphism';
  const isLeather = cardStyle === 'cowhide-leather';
  const isLightLeather = cardStyle === 'light-cowhide-leather';
  const isDarkSurface = isDark && !isLeather;

  const [activeKey, setActiveKey] = useState<string>('2013');
  const [showJobCard, setShowJobCard] = useState<boolean>(false);

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
  const dragStartXRef = useRef<number | null>(null);
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

  // Helper lọc bỏ logo công ty khỏi bộ sưu tập Hình ảnh kỷ niệm
  const isCompanyLogoAsset = (url?: string) => {
    if (!url) return false;
    if (activeMilestone.logo && url === activeMilestone.logo) return true;
    return /logo_|_logo|\/logo\//i.test(url);
  };
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

  const [memorySlideIdx, setMemorySlideIdx] = useState<number>(0);
  const [isMemoryHovered, setIsMemoryHovered] = useState<boolean>(false);
  const [memoryImgError, setMemoryImgError] = useState<boolean>(false);

  useEffect(() => {
    if (photosList.length <= 1 || isMemoryHovered) return;
    const timer = setInterval(() => {
      setMemorySlideIdx((prev) => (prev + 1) % photosList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photosList.length, isMemoryHovered, activeKey]);

  useEffect(() => {
    setMemorySlideIdx(0);
    setMemoryImgError(false);
  }, [activeKey]);

  useEffect(() => {
    setMemoryImgError(false);
  }, [memorySlideIdx]);

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
      companyLine1: 'Công ty CP Thông tin',
      companyLine2: 'Băng thông Rộng LBC',
      shortName: 'Công ty CP Thông tin Băng thông Rộng LBC',
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
      roleSummary: 'Trưởng Phòng Dịch vụ Khách hàng',
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
      roleSummary: 'Head of CS / CS Director',
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

  const handlePointerDown = (clientX: number, target: EventTarget | null) => {
    if ((target as HTMLElement | null)?.closest('button')) return;
    dragStartXRef.current = clientX;
    setIsDragging(true);
  };

  const handlePointerUp = (clientX: number) => {
    if (dragStartXRef.current === null) return;
    const diffX = dragStartXRef.current - clientX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
      } else {
        setStartIndex((prev) => Math.max(0, prev - 1));
      }
    }
    dragStartXRef.current = null;
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

  const allMilestoneKeys = ['2003', '2007', '2011', '2013', '2016', '2018', '2023', '2026'];
  const normalizedActiveKey = activeKey.startsWith('2013') || activeKey === '2014-airpay' ? '2013' : activeKey;
  const currentKeyIndex = allMilestoneKeys.indexOf(normalizedActiveKey);
  const prevKey = currentKeyIndex > 0 ? allMilestoneKeys[currentKeyIndex - 1] : null;
  const nextKey = currentKeyIndex < allMilestoneKeys.length - 1 ? allMilestoneKeys[currentKeyIndex + 1] : null;

  return (
    <div
      id="experience-page-container"
      data-element-name="Trang Hành trình sự nghiệp"
      data-element-type="card"
      data-section-card="true"
      data-element-page="experience"
      data-element-parent="global-content-viewport"
      className={cn(
        'main-card bento-card glass-card w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch justify-start p-[25px] gap-[15px] max-w-full mx-auto select-none relative text-[var(--text-primary)] glass-scrollbar font-play text-left animate-fadeIn rounded-[20px] box-border',
        showJobCard ? 'overflow-y-auto' : 'overflow-hidden'
      )}
    >
      {/* KHUNG TIMELINE BÌA GẤP 3D (CHỌN LOGO ĐỂ XEM CHI TIẾT CÔNG VIỆC — LẤP ĐẦY 100% THẺ CHÍNH) */}
      {!showJobCard && (
        <section
          ref={boardRef}
          id="experience-timeline-board"
          data-element-name="Bảng Timeline Hành trình sự nghiệp"
          data-element-type="section"
          data-element-page="experience"
          data-element-parent="experience-page-container"
          onWheel={handleWheelScroll}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.target)}
          onMouseUp={(e) => handlePointerUp(e.clientX)}
          onMouseLeave={() => {
            dragStartXRef.current = null;
            setIsDragging(false);
          }}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.target)}
          onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX)}
          style={
            isLeather
              ? {
                  background: 'linear-gradient(145deg, #653A17 0%, #4A280E 100%)',
                  outline: '1.5px dashed rgba(245, 222, 179, 0.52)',
                  outlineOffset: '-7px',
                }
              : isLightLeather
                ? {
                    background: 'linear-gradient(145deg, #FDF6EA 0%, #EFE0C4 100%)',
                    outline: '1.5px dashed rgba(139, 90, 43, 0.44)',
                    outlineOffset: '-7px',
                  }
                : isDarkSurface
                  ? {
                      background: 'rgba(15, 23, 42, 0.86)',
                    }
                  : undefined
          }
          className={cn(
            'group/board absolute inset-0 w-full h-full min-w-full min-h-full rounded-[20px] overflow-hidden select-none flex flex-col box-border z-[1]',
            !isLeather && !isLightLeather && !isDarkSurface && 'bg-[#E2E8F0]',
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
                      isLeather
                        ? '#F5DEB3'
                        : isLightLeather
                          ? '#9A6331'
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
                    : isLightLeather
                      ? '#9A3412'
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
                    : isLightLeather
                      ? '#2C1606'
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
                    isDarkSurface || isLeather
                      ? 'bg-slate-200'
                      : isLightLeather
                        ? 'bg-[#5C3415]'
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
                  : isLightLeather
                    ? 'bg-[#FFFBF2]/95 text-[#2C1606] border-[#C89B6E] hover:bg-[#9A3412] hover:text-white'
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
                  : isLightLeather
                    ? 'bg-[#FFFBF2]/95 text-[#2C1606] border-[#C89B6E] hover:bg-[#9A3412] hover:text-white'
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
                  : isLightLeather
                    ? isEven
                      ? 'linear-gradient(to bottom, #FDF7EB, #F2E2C7)'
                      : 'linear-gradient(to bottom, #F9EEDB, #EAD4B3)'
                    : isDarkSurface
                      ? item.colBgGradientDark
                      : item.colBgGradient;

                const resolvedAccent = isLeather
                  ? '#FDE68A'
                  : isLightLeather
                    ? '#9A3412'
                    : isDarkSurface
                      ? item.darkAccentColor
                      : item.accentColor;

                const primaryTextColor = isLeather
                  ? '#FFF8DC'
                  : isLightLeather
                    ? '#2C1606'
                    : isDarkSurface
                      ? '#F8FAFC'
                      : '#0F172A';

                const secondaryTextColor = isLeather
                  ? '#F5DEB3'
                  : isLightLeather
                    ? '#5C3415'
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
                          background: isLeather || isDarkSurface
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
                    <div className="relative z-[20] w-full h-full flex-1 min-h-0 flex flex-col pt-[104px] sm:pt-[122px] lg:pt-[140px] xl:pt-[152px]">
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
                        className="w-full h-[96px] sm:h-[112px] lg:h-[124px] shrink-0 flex items-center justify-center px-3 shadow-[0_12px_22px_-2px_rgba(15,23,42,0.25)] transition-all duration-300 group-hover:brightness-105"
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
                      <div className="flex-1 min-h-0 px-[8%] sm:px-[10%] pt-3.5 sm:pt-4 lg:pt-5 pb-12 sm:pb-14 flex flex-col overflow-y-auto no-scrollbar">
                        <h3
                          onClick={() => {
                            SoundEngine.playTap();
                            handleOpenJobCard(item.key);
                          }}
                          style={{ color: primaryTextColor }}
                          data-subcard-title="true"
                          title={`Nhấn để xem chi tiết công việc tại ${item.companyLine1} ${item.companyLine2}`}
                          className={cn(
                            'subcard-title-synced typo-h5 font-bold leading-[1.28] min-h-[2.8em] sm:min-h-[3.8em] lg:min-h-[4.2em] border-b pb-2 mb-2.5 break-words cursor-pointer hover:underline flex flex-col justify-center',
                            isLeather
                              ? 'border-[#F5DEB3]/35'
                              : isLightLeather
                                ? 'border-[#C89B6E]/60'
                                : isDarkSurface
                                  ? 'border-white/15'
                                  : 'border-slate-300'
                          )}
                        >
                          <span className="block leading-tight">{item.companyLine1}</span>
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
                          className="typo-caption font-normal leading-[1.45] break-words"
                        >
                          {item.description}
                        </p>
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
                : isLightLeather
                  ? 'bg-[#FFFBF2]/92 border-[#C89B6E]'
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
                      : isLightLeather
                        ? 'w-7 bg-[#9A3412]'
                        : isDarkSurface
                          ? 'w-7 bg-[#38BDF8]'
                          : 'w-7 bg-[#0284C7]'
                    : isLeather
                      ? 'w-2 bg-[#F5DEB3]/40 hover:bg-[#F5DEB3]/75'
                      : isLightLeather
                        ? 'w-2 bg-[#8B5A2B]/35 hover:bg-[#8B5A2B]/70'
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
          5. THẺ CHI TIẾT CỘT MỐC ĐANG CHỌN (BỐ CỤC CHUẨN THEO HÌNH THAM CHIẾU)
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

        // Danh sách hình ảnh kỷ niệm thực tế (đã loại bỏ hoàn toàn logo công ty)
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

        // Danh sách Dự án lấy trực tiếp từ activeMilestone.projects
        const projectsList =
          activeMilestone.projects && activeMilestone.projects.length > 0
            ? activeMilestone.projects.map((p, idx) => {
                const hasPrefix = /^\d+(\.\d+)?\s*[·.-]/.test(p.trim());
                return {
                  title: hasPrefix ? p : `${idx + 1}. ${p}`,
                };
              })
            : [
                { title: '1. Chuẩn hóa quy trình vận hành CSKH' },
                { title: '2. Ứng dụng giải pháp số hóa dịch vụ' },
              ];

        // Danh sách Cam kết lấy trực tiếp từ activeMilestone.commitments
        const commitmentsList =
          activeMilestone.commitments && activeMilestone.commitments.length > 0
            ? activeMilestone.commitments
            : customContent.commitments.map((c) => `${c.title}: ${c.desc}`);

        // Danh sách Kết quả & KPI lấy trực tiếp từ activeMilestone.kpis
        const kpisList =
          activeMilestone.kpis && activeMilestone.kpis.length > 0
            ? activeMilestone.kpis.map((k) => ({
                label: k.label,
                percent: k.percent,
                displayValue: k.displayValue || `${k.percent}%`,
              }))
            : [
                { label: 'Tiêu chuẩn chất lượng SOP', percent: 100, displayValue: '100%' },
                { label: 'Tỷ lệ giải quyết FCR', percent: 92, displayValue: '92%' },
                { label: 'Mức độ hài lòng CSAT', percent: 98, displayValue: '98%' },
              ];

        const narrativeTitle = narrationInfo?.title
          ? `Năm ${activeMilestone.year} – ${narrationInfo.title}`
          : `Năm ${activeMilestone.year} – ${activeMilestone.company}`;

        const storyParagraphs =
          activeMilestone.paragraphs && activeMilestone.paragraphs.length > 0
            ? activeMilestone.paragraphs
            : activeMilestone.intro && activeMilestone.intro.length > 0
            ? activeMilestone.intro.map((item: { title: string; desc: string }) => `${item.title}: ${item.desc}`)
            : [];

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

        const industryParts = activeMilestone.industry
          .split('/')
          .map((part) => part.trim())
          .filter(Boolean);

        return (
          <div
            id="experience-job-detail-card"
            data-section-card="true"
            className="bento-card glass-card w-full h-full flex-1 min-h-0 flex flex-col justify-start rounded-[14px] relative overflow-y-auto glass-scrollbar gap-[15px] text-left transition-all duration-300 animate-fadeIn font-play p-3.5 sm:p-5 lg:p-6"
          >
            {/* THANH ĐIỀU HƯỚNG NGỮ CẢNH: QUAY LẠI TIMELINE & CHUYỂN NHANH CỘT MỐC */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-1 shrink-0 min-w-0">
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setShowJobCard(false);
                }}
                className="theme-prev-next-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-full typo-button font-semibold cursor-pointer min-h-[40px]"
                title="Quay lại Bảng Timeline 3D"
              >
                <WebIcon name="arrow-left" className="w-4 h-4 shrink-0" />
                <span>Quay lại Timeline</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {prevKey && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      handleOpenJobCard(prevKey);
                    }}
                    className="theme-prev-next-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-full typo-label font-semibold cursor-pointer min-h-[40px]"
                    title={`Xem cột mốc trước (${prevKey})`}
                  >
                    <WebIcon name="chevron-left" className="w-4 h-4 shrink-0" />
                    <span className="tabular-nums">{prevKey}</span>
                  </button>
                )}

                <span className="typo-caption font-semibold text-[var(--text-secondary)] px-1.5 tabular-nums">
                  {currentKeyIndex >= 0 ? `${currentKeyIndex + 1} / ${allMilestoneKeys.length}` : activeMilestone.year}
                </span>

                {nextKey && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      handleOpenJobCard(nextKey);
                    }}
                    className="theme-prev-next-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-full typo-label font-semibold cursor-pointer min-h-[40px]"
                    title={`Xem cột mốc tiếp theo (${nextKey})`}
                  >
                    <span className="tabular-nums">{nextKey === '2026' ? '2026+' : nextKey}</span>
                    <WebIcon name="chevron-right" className="w-4 h-4 shrink-0" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setShowJobCard(false);
                  }}
                  className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] hover:bg-[var(--bg-button-primary)] hover:text-white text-[var(--text-secondary)] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ml-1"
                  title="Đóng chi tiết"
                  aria-label="Đóng chi tiết công việc"
                >
                  <WebIcon name="x" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* KHỐI 1: THẺ TÊN CÔNG TY (BENTO 12 CỘT RESPONSIVE: TRÁI THÔNG TIN · PHẢI SẢN PHẨM) */}
            <section
              id="experience-info-card"
              data-subcard="true"
              className="exp-detail-card w-full rounded-[14px] p-[15px] grid grid-cols-1 lg:grid-cols-12 items-stretch gap-[15px] shrink-0 min-w-0"
            >
              {/* Cột trái: Thời gian · Lĩnh vực, Logo 1:1, Tên công ty, Chức danh, Hệ sinh thái */}
              <div className="lg:col-span-6 xl:col-span-5 min-w-0 flex flex-col justify-center gap-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 typo-body-sm font-semibold text-[var(--text-secondary)] min-w-0">
                  <WebIcon name="calendar" className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span className="break-words font-bold">{activeMilestone.period}</span>
                  <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-link,var(--color-primary))] break-words">
                    {activeMilestone.tag}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                  <div
                    style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                    className="w-20 h-20 sm:w-[88px] sm:h-[88px] aspect-square rounded-full p-1 bg-white shadow-sm border border-slate-200/80 dark:border-white/15 flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <div
                      style={{ borderRadius: '50%' }}
                      className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={activeMilestone.logo}
                        alt={activeMilestone.company}
                        referrerPolicy="no-referrer"
                        style={{ borderRadius: '50%' }}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="typo-badge font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--bg-subcard)] px-2.5 py-0.5 rounded-full inline-block border border-[var(--border-subcard)]">
                      {activeMilestone.roleTitle}
                    </span>
                    <h2 className="typo-h2 font-play text-[var(--text-heading,var(--text-primary))] break-words [overflow-wrap:anywhere]">
                      {activeMilestone.company}
                    </h2>
                    {activeMilestone.subCompanies && (
                      <p className="typo-body-sm font-medium text-[var(--text-secondary)] break-words [overflow-wrap:anywhere]">
                        {activeMilestone.subCompanies}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vùng phải (Hairline divider thay cho lồng thẻ nhiều lớp): Danh mục Sản phẩm */}
              <div
                id="experience-products-card"
                className="lg:col-span-6 xl:col-span-7 w-full pt-4 lg:pt-0 lg:pl-5 border-t lg:border-t-0 lg:border-l border-[var(--border-subcard)] flex flex-col justify-between gap-2.5 min-w-0"
              >
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[var(--border-subcard)] min-w-0">
                  <div className="card-header-sync flex items-center gap-2 min-w-0 text-indigo-600 dark:text-indigo-400">
                    <WebIcon name="shopping-bag" className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="typo-h4 tabular-nums text-indigo-600 dark:text-indigo-400">06</span>
                    <h3 className="card-title card-title-synced typo-h4 font-play text-indigo-600 dark:text-indigo-400 m-0 truncate">
                      Sản phẩm
                    </h3>
                  </div>
                  <span className="typo-caption text-[var(--text-muted)] tabular-nums shrink-0">
                    {rawProductsList.length} sản phẩm
                  </span>
                </div>

                <div
                  className={cn(
                    'grid gap-[15px] w-full items-stretch',
                    rawProductsList.length === 1
                      ? 'grid-cols-1'
                      : rawProductsList.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  )}
                >
                  {rawProductsList.map((prod, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      data-subcard="true"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(4);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                      }}
                      title={`${prod.name} — Click để xem chi tiết lĩnh vực & dịch vụ`}
                      className="exp-detail-subcard w-full max-w-full rounded-[14px] p-[15px] hover:border-indigo-500/70 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-[15px] min-w-0 text-left group/prod focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <div className="w-10 h-10 aspect-square rounded-[10px] bg-white border border-indigo-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={prod.src}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover/prod:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = activeMilestone.logo;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="typo-body-sm font-bold text-[var(--text-heading,var(--text-primary))] block leading-tight truncate group-hover/prod:text-[var(--text-link,var(--color-primary))]">
                          {prod.name}
                        </span>
                        <span className="typo-caption text-[var(--text-muted)] block leading-tight mt-0.5 truncate">
                          {activeMilestone.tag}
                        </span>
                      </div>
                      <WebIcon
                        name="arrow-up-right"
                        className="w-3.5 h-3.5 text-indigo-500/70 opacity-60 group-hover/prod:opacity-100 shrink-0 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTAINER CÁC PHÂN MỤC CHI TIẾT TRẢI NGHIỆM - BENTO GRID 12 CỘT RESPONSIVE Ở MỌI KÍCH THƯỚC */}
            <div
              id="experience-sections-container"
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-[15px] items-stretch shrink-0 min-w-0"
            >
              {/* 01 · Thông tin công tác */}
              <section
                id="experience-management-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-5 rounded-[14px] p-[15px] flex flex-col gap-[15px] min-w-0"
              >
                <div className="card-header-sync flex items-center gap-2 pb-2.5 border-b border-[var(--border-subcard)] text-sky-600 dark:text-sky-400" data-card-accent="sky">
                  <WebIcon name="user-group" className="w-5 h-5 shrink-0" />
                  <span className="typo-h3 tabular-nums">01</span>
                  <h3 className="card-title card-title-synced typo-h3 font-play m-0 truncate" data-card-title="true">
                    Thông tin công tác
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] items-stretch flex-1 min-w-0">
                  {/* 1. Quy mô quản lý */}
                  <div data-subcard="true" className="exp-detail-subcard w-full rounded-[14px] p-[15px] flex items-start gap-[15px] min-w-0">
                    <div className="exp-icon-badge w-9 h-9 aspect-square rounded-full border text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                      <WebIcon name="user-group" className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="subcard-title-synced typo-h4 font-play text-sky-600 dark:text-sky-300 block break-words" data-subcard-title="true">
                        Quy mô quản lý
                      </span>
                      <div className="flex items-baseline gap-1.5 flex-wrap mt-1">
                        <span className="typo-kpi font-play tabular-nums text-sky-600 dark:text-sky-300 leading-none">
                          {activeMilestone.headcount}
                        </span>
                        <span className="typo-caption font-medium text-[var(--text-secondary)]">
                          nhân sự trực thuộc
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Chức danh quản trị */}
                  <div data-subcard="true" className="exp-detail-subcard w-full rounded-[14px] p-[15px] flex items-start gap-[15px] min-w-0">
                    <div className="exp-icon-badge w-9 h-9 aspect-square rounded-full border text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                      <WebIcon name="star" className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="subcard-title-synced typo-h4 font-play text-purple-600 dark:text-purple-300 block break-words" data-subcard-title="true">
                        Chức danh quản trị
                      </span>
                      <span className="typo-body-sm font-semibold text-[var(--text-heading,var(--text-primary))] break-words [overflow-wrap:anywhere] block mt-1">
                        {activeMilestone.roleTitle}
                      </span>
                    </div>
                  </div>

                  {/* 3. Thời gian công tác */}
                  <div data-subcard="true" className="exp-detail-subcard w-full rounded-[14px] p-[15px] flex items-start gap-[15px] min-w-0">
                    <div className="exp-icon-badge w-9 h-9 aspect-square rounded-full border text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0 mt-0.5">
                      <WebIcon name="clock" className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="subcard-title-synced typo-h4 font-play text-violet-600 dark:text-violet-300 block break-words" data-subcard-title="true">
                        Thời Gian Công Tác
                      </span>
                      <p className="typo-body-sm font-semibold tabular-nums text-violet-600 dark:text-violet-300 mt-1 break-words">
                        {activeMilestone.cardYearLabel}
                      </p>
                      <span className="typo-caption text-[var(--text-muted)] block break-words">
                        ({activeMilestone.tenure})
                      </span>
                    </div>
                  </div>

                  {/* 4. Địa điểm */}
                  <div data-subcard="true" className="exp-detail-subcard w-full rounded-[14px] p-[15px] flex items-start gap-[15px] min-w-0">
                    <div className="exp-icon-badge w-9 h-9 aspect-square rounded-full border text-pink-600 dark:text-pink-300 flex items-center justify-center shrink-0 mt-0.5">
                      <WebIcon name="map-pin" className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="subcard-title-synced typo-h4 font-play text-pink-600 dark:text-pink-300 block break-words" data-subcard-title="true">
                        Địa điểm
                      </span>
                      <p className="typo-body-sm font-semibold text-[var(--text-heading,var(--text-primary))] mt-1 break-words">
                        {activeMilestone.location}
                      </p>
                    </div>
                  </div>

                  {/* 5. Lĩnh vực */}
                  <div data-subcard="true" className="exp-detail-subcard w-full sm:col-span-2 rounded-[14px] p-[15px] flex items-start gap-[15px] min-w-0">
                    <div className="exp-icon-badge w-9 h-9 aspect-square rounded-full border text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                      <WebIcon name="game" className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="subcard-title-synced typo-h4 font-play text-indigo-600 dark:text-indigo-300 block break-words" data-subcard-title="true">
                        Lĩnh vực
                      </span>
                      <p className="typo-body-sm font-semibold text-[var(--text-heading,var(--text-primary))] mt-1 break-words [overflow-wrap:anywhere] leading-snug">
                        {industryParts.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Giới thiệu công tác */}
              <section
                id="experience-banner-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-7 rounded-[14px] p-[15px] flex flex-col gap-[15px] min-w-0"
              >
                <div className="card-header-sync flex items-center gap-2 pb-2.5 border-b border-[var(--border-subcard)] text-[var(--text-link,var(--color-primary))]" data-card-accent="blue">
                  <WebIcon name="shield-check" className="w-5 h-5 shrink-0" />
                  <h3 className="card-title card-title-synced typo-h3 font-play break-words m-0" data-card-title="true">
                    Giới thiệu công tác
                  </h3>
                </div>

                <div className="space-y-[15px] typo-body leading-relaxed text-[var(--text-secondary)] flex-1 flex flex-col justify-start min-w-0">
                  <p className="font-semibold text-[var(--text-heading,var(--text-primary))] break-words [overflow-wrap:anywhere]">
                    {narrativeTitle}
                  </p>

                  {(activeMilestone.highlightText || activeMilestone.cardDescription) && (
                    <p className="break-words [overflow-wrap:anywhere]">
                      {activeMilestone.highlightText || activeMilestone.cardDescription}
                    </p>
                  )}

                  {storyParagraphs.map((para: string, pIdx: number) => (
                    <p key={pIdx} className="break-words [overflow-wrap:anywhere]">
                      {para}
                    </p>
                  ))}

                  <p className="font-semibold text-[var(--text-heading,var(--text-primary))] break-words [overflow-wrap:anywhere] pt-1 border-t border-[var(--border-subcard)] mt-auto">
                    {philosophyText}
                  </p>
                </div>
              </section>

              {/* 02 · Kết quả & KPI */}
              <section
                id="experience-stats-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 rounded-[14px] p-[15px] flex flex-col gap-[15px] min-w-0"
              >
                <div className="card-header-sync flex items-center gap-2 pb-2.5 border-b border-[var(--border-subcard)] text-emerald-600 dark:text-emerald-400" data-card-accent="emerald">
                  <WebIcon name="trophy" className="w-5 h-5 shrink-0" />
                  <span className="typo-h3 tabular-nums">02</span>
                  <h3 className="card-title card-title-synced typo-h3 font-play m-0 truncate" data-card-title="true">
                    Kết quả đạt được
                  </h3>
                </div>

                <div className="space-y-[15px] flex-1 flex flex-col justify-start pt-1 min-w-0">
                  {kpisList.map((kpi, kIdx) => (
                    <div key={kIdx} className="space-y-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-2 typo-body-sm font-semibold min-w-0">
                        <span className="text-[var(--text-primary)] leading-snug break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                          {kpi.label}
                        </span>
                        <span className="font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-300 shrink-0">
                          {kpi.displayValue}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-emerald-200/75 dark:bg-emerald-950/90 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(15, kpi.percent))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 03 · Nội dung nhiệm vụ */}
              <section
                id="experience-responsibility-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-8 rounded-[14px] p-[15px] flex flex-col gap-[15px] min-w-0"
              >
                <div className="card-header-sync flex items-center gap-2 pb-2.5 border-b border-[var(--border-subcard)] text-purple-600 dark:text-purple-400" data-card-accent="purple">
                  <WebIcon name="briefcase" className="w-5 h-5 shrink-0" />
                  <span className="typo-h3 tabular-nums">03</span>
                  <h3 className="card-title card-title-synced typo-h3 font-play m-0 truncate" data-card-title="true">
                    Nội dung nhiệm vụ
                  </h3>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-[15px] content-start flex-1 min-w-0 items-stretch">
                  {tasksList.map((task, idx) => {
                    const cleanTask = task.replace(/^\d+\.\s*/, '');
                    const isOddLast = tasksList.length % 2 === 1 && idx === tasksList.length - 1;
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className={cn(
                          'exp-detail-subcard w-full flex items-start gap-[15px] p-[15px] rounded-[14px] min-w-0',
                          isOddLast && 'xl:col-span-2'
                        )}
                      >
                        <span className="exp-icon-badge w-6 h-6 rounded-full text-purple-600 dark:text-purple-300 border font-mono typo-badge flex items-center justify-center shrink-0 tabular-nums mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="typo-body-sm text-[var(--text-secondary)] break-words [overflow-wrap:anywhere] min-w-0 flex-1 leading-snug">
                          {cleanTask}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 04 · Hạng mục dự án */}
              <section
                id="experience-achievement-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-5 rounded-[14px] p-[15px] flex flex-col gap-[15px] min-w-0"
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)]">
                  <div className="card-header-sync flex items-center gap-2 min-w-0 text-amber-600 dark:text-amber-400" data-card-accent="amber">
                    <WebIcon name="network" className="w-5 h-5 shrink-0" />
                    <span className="typo-h3 tabular-nums">04</span>
                    <h3 className="card-title card-title-synced typo-h3 font-play truncate m-0" data-card-title="true">
                      Hạng mục dự án
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      if (onNavigateTab) onNavigateTab(7);
                      else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                    }}
                    className="exp-icon-badge px-3 py-1 rounded-full hover:bg-amber-600 hover:text-white text-amber-800 dark:text-amber-300 typo-label border transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                    title="Chuyển đến trang Dự án"
                  >
                    <span>Xem Dự án</span>
                    <WebIcon name="arrow-up-right" className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex flex-col gap-[15px] content-start flex-1 min-w-0">
                  {projectsList.map((proj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-subcard="true"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(7);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                      }}
                      className="exp-detail-subcard w-full flex items-center justify-between gap-[15px] p-[15px] rounded-[14px] hover:border-amber-500/60 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group/proj min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      title="Click để xem chi tiết trang Dự án"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <WebIcon name="folder" className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span className="typo-body-sm font-semibold text-[var(--text-secondary)] break-words [overflow-wrap:anywhere] min-w-0 flex-1 leading-snug group-hover/proj:text-amber-600 dark:group-hover/proj:text-amber-300">
                          {proj.title}
                        </span>
                      </div>
                      <WebIcon
                        name="arrow-up-right"
                        className="w-3.5 h-3.5 text-amber-600/70 dark:text-amber-300/70 opacity-60 group-hover/proj:opacity-100 shrink-0 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </section>

              {/* 05 · Cam kết chất lượng */}
              <section
                id="experience-commitments-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-7 rounded-[14px] p-[15px] flex flex-col gap-[15px] min-w-0"
              >
                <div className="card-header-sync flex items-center gap-2 pb-2.5 border-b border-[var(--border-subcard)] text-cyan-600 dark:text-cyan-400" data-card-accent="cyan">
                  <WebIcon name="shield-check" className="w-5 h-5 shrink-0" />
                  <span className="typo-h3 tabular-nums">05</span>
                  <h3 className="card-title card-title-synced typo-h3 font-play m-0 truncate" data-card-title="true">
                    Cam kết chất lượng
                  </h3>
                </div>

                <div className="flex flex-col gap-[15px] content-start flex-1 min-w-0">
                  {commitmentsList.map((cmtText, cIdx) => (
                    <div
                      key={cIdx}
                      data-subcard="true"
                      className="exp-detail-subcard p-[15px] rounded-[14px] flex items-start gap-[15px] min-w-0"
                    >
                      <div className="exp-icon-badge w-7 h-7 aspect-square rounded-full border text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                        <WebIcon name="shield-check" className="w-4 h-4" />
                      </div>
                      <span className="typo-body-sm font-medium text-[var(--text-secondary)] leading-snug break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                        {cmtText}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* KHỐI 4.5: THẺ HÌNH KỶ NIỆM (HIỂN THỊ ẢNH THỰC TẾ 16:9 + SCRIM CAPTION + TỚI/LÙI + LIGHTBOX) */}
              <section
                id="experience-memories-card"
                data-subcard="true"
                className="exp-detail-card col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-12 w-full rounded-[14px] p-[15px] flex flex-col gap-[15px] shrink-0 min-w-0"
                onMouseEnter={() => setIsMemoryHovered(true)}
                onMouseLeave={() => setIsMemoryHovered(false)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)]">
                  <div className="subcard-header-sync flex items-center gap-2.5 min-w-0 flex-wrap">
                    <div className="exp-icon-badge w-8 h-8 aspect-square rounded-[10px] text-rose-500 dark:text-rose-300 border flex items-center justify-center shrink-0">
                      <WebIcon name="image" className="w-4 h-4 text-rose-500 dark:text-rose-300" />
                    </div>
                    <h3 className="subcard-title-synced typo-h3 font-play text-rose-500 dark:text-rose-300 m-0" data-subcard-title="true">
                      Card Kỷ niệm
                    </h3>
                    <span className="typo-caption font-semibold text-[var(--text-muted)] tabular-nums">
                      <span aria-hidden="true">· </span>
                      {photosList.length > 0 ? `${memorySlideIdx + 1} / ${photosList.length} hình ảnh` : 'Chưa có hình ảnh'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {photosList.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setMemorySlideIdx((prev) => (prev - 1 + photosList.length) % photosList.length);
                          }}
                          className="w-8 h-8 rounded-full border flex items-center justify-center text-rose-600 dark:text-rose-300 hover:bg-rose-500 hover:text-white transition-all cursor-pointer active:scale-95"
                          title="Hình trước (Lùi)"
                          aria-label="Hình trước"
                        >
                          <WebIcon name="chevron-left" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setMemorySlideIdx((prev) => (prev + 1) % photosList.length);
                          }}
                          className="w-8 h-8 rounded-full border flex items-center justify-center text-rose-600 dark:text-rose-300 hover:bg-rose-500 hover:text-white transition-all cursor-pointer active:scale-95"
                          title="Hình tiếp (Tới)"
                          aria-label="Hình tiếp"
                        >
                          <WebIcon name="chevron-right" className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {photosList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          SoundEngine.playTap();
                          setCarouselSlideIdx(memorySlideIdx);
                          setIsPhotoLightboxOpen(true);
                        }}
                        className="exp-icon-badge px-3 py-1 rounded-full hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-300 font-bold typo-label border transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                        title="Phóng to thư viện ảnh kỷ niệm"
                      >
                        <span>Xem thư viện</span>
                        <WebIcon name="maximize-2" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {photosList.length > 0 ? (
                  <button
                    type="button"
                    data-subcard="true"
                    aria-label={`Xem hình kỷ niệm ${memorySlideIdx + 1}: ${photosList[memorySlideIdx]?.title || activeMilestone.company}`}
                    onClick={() => {
                      SoundEngine.playTap();
                      setCarouselSlideIdx(memorySlideIdx);
                      setIsPhotoLightboxOpen(true);
                    }}
                    className="exp-detail-subcard w-full rounded-[14px] p-0 hover:shadow-md transition-all cursor-pointer group min-w-0 relative overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[300px] overflow-hidden bg-slate-900/10 dark:bg-slate-950/60 flex items-center justify-center">
                      {!memoryImgError && photosList[memorySlideIdx]?.src ? (
                        <img
                          src={photosList[memorySlideIdx].src}
                          alt={photosList[memorySlideIdx]?.title || activeMilestone.company}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={() => setMemoryImgError(true)}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 bg-gradient-to-br from-rose-500/15 via-slate-500/10 to-indigo-500/15">
                          <WebIcon name="image" className="w-8 h-8 text-rose-500/70" />
                          <span className="typo-body-sm font-semibold text-[var(--text-primary)] text-center">
                            {photosList[memorySlideIdx]?.title || activeMilestone.company}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-end justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="typo-body-sm font-bold text-white truncate">
                            {photosList[memorySlideIdx]?.title || activeMilestone.company}
                          </p>
                          {photosList[memorySlideIdx]?.desc && (
                            <p className="typo-caption text-white/85 truncate mt-0.5">
                              {photosList[memorySlideIdx].desc}
                            </p>
                          )}
                        </div>
                        <span className="typo-caption text-white font-semibold shrink-0 flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/25">
                          <span>Phóng to</span>
                          <WebIcon name="maximize-2" className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div
                    data-subcard="true"
                    className="exp-detail-subcard rounded-[14px] p-[15px] flex items-center gap-[15px] min-w-0"
                  >
                    <span className="typo-body-sm text-[var(--text-muted)]">
                      Chưa có hình ảnh kỷ niệm cho cột mốc này.
                    </span>
                  </div>
                )}
              </section>

              {/* KHỐI 5: THANH TRÍCH DẪN TRIẾT LÝ QUẢN TRỊ Ở ĐÁY */}
              <section data-subcard="true" className="exp-detail-card col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-12 w-full rounded-[14px] p-[15px] flex items-center justify-between gap-[15px] relative overflow-hidden shrink-0">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 aspect-square rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md flex items-center justify-center shrink-0">
                    <WebIcon name="quote" className="w-5 h-5" />
                  </div>
                  <p className="typo-body font-semibold text-[var(--text-heading,var(--text-primary))] break-words [overflow-wrap:anywhere] min-w-0">
                    {philosophyText}
                  </p>
                </div>

                <svg
                  viewBox="0 0 110 72"
                  className="w-20 h-14 shrink-0 hidden sm:block opacity-90"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="exp-target-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="44" cy="64" rx="34" ry="5" fill="#C7D2FE" opacity="0.45" />
                  <circle cx="44" cy="36" r="24" fill="url(#exp-target-ring)" />
                  <circle cx="44" cy="36" r="17" fill="#FFFFFF" />
                  <circle cx="44" cy="36" r="11" fill="#6366F1" />
                  <circle cx="44" cy="36" r="5" fill="#F43F5E" />
                  <path d="M44 36 L76 12" stroke="#312E81" strokeWidth="3" strokeLinecap="round" />
                  <path d="M72 10 L82 8 L78 18 Z" fill="#818CF8" />
                  <path d="M82 58 C84 44, 94 36, 98 32 C98 44, 90 54, 82 58 Z" fill="#A5B4FC" opacity="0.7" />
                </svg>
              </section>
            </div>
          </div>
        );
      })()}

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
              <div className="relative aspect-[16/10] w-full bg-[#0B1220] flex items-center justify-center">
                <img
                  src={curPhoto.src}
                  alt={curPhoto.title || activeMilestone.company}
                  className="w-full h-full object-contain"
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
