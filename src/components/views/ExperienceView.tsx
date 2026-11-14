'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speakSiteText, stopActiveSpeech } from '@/utils/speechVoice';
// Icons migrated to WebIcon (Hugeicons)
import { motion, AnimatePresence } from 'motion/react';
import { EXPERIENCE_MILESTONES } from '@/data/experience';
import { MEMORIES_DATA } from '@/data/memories';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';

const getWebIconName = (name: string): string => {
  const norm = (name || '').toLowerCase();
  if (norm.includes('users')) return 'user-group';
  if (norm.includes('filetext')) return 'edit';
  if (norm.includes('settings')) return 'settings';
  if (norm.includes('target')) return 'target';
  if (norm.includes('calendar')) return 'calendar';
  if (norm.includes('briefcase')) return 'briefcase';
  if (norm.includes('volume2')) return 'volume';
  if (norm.includes('volumex')) return 'mute';
  if (norm.includes('play')) return 'play';
  if (norm.includes('pause')) return 'pause';
  if (norm.includes('x')) return 'cancel';
  return norm || 'sparkles';
};

const STORY_KEYS = ['2003', '2007', '2011', '2013', '2016', '2018', '2023', '2026'];

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
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;
  const isDark = themeIsDark || currentTheme === 'dark-neon';

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

  const [hoveredMilestoneKey, setHoveredMilestoneKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [carouselSlideIdx, setCarouselSlideIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState<boolean>(false);
  const [featuredProdPage, setFeaturedProdPage] = useState<number>(0);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPhotoLightboxOpen) {
          setIsPhotoLightboxOpen(false);
          return;
        }
        if (isFilterDropdownOpen) {
          setIsFilterDropdownOpen(false);
          return;
        }
        if (showJobCard) {
          setShowJobCard(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard, isPhotoLightboxOpen, isFilterDropdownOpen]);

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

  // Tính năng 1: Panoramic History Slider
  const [sliderYearIndex, setSliderYearIndex] = useState<number>(3); // 2013 là mốc mặc định

  const handleSliderChange = (newIdx: number) => {
    setSliderYearIndex(newIdx);
    const targetCard = filteredRoadmapCards[newIdx];
    if (targetCard) {
      handleSelectMilestone(targetCard.key);
      const cardEl = document.getElementById(`milestone-card-${targetCard.key}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // 4 items per view pagination states & horizontal scroll effect
  const CARDS_PER_PAGE = 4;
  const [timelinePage, setTimelinePage] = useState<number>(0);
  const [isTimelineAutoScroll, setIsTimelineAutoScroll] = useState<boolean>(false);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const scrollHorizontal = (offset: number) => {
    if (horizontalTrackRef.current) {
      horizontalTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Trạng thái isDark lấy trực tiếp từ useTheme() bên trên để đồng bộ tức thì Sáng / Tối

  // Auto-Play Career Story Mode states
  const [isStoryActive, setIsStoryActive] = useState<boolean>(false);
  const [storyIndex, setStoryIndex] = useState<number>(0);
  const [isStoryPaused, setIsStoryPaused] = useState<boolean>(false);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeMilestone = EXPERIENCE_MILESTONES[activeKey] || EXPERIENCE_MILESTONES['2013'];

  // Speech synthesis helpers using Google Gemini TTS - PUCK MC Nam Miền Nam Sài Gòn (Phong cách Thuyết trình Chuyên nghiệp)
  const speakStoryScript = useCallback((script: string) => {
    if (typeof window === 'undefined') return;
    speakSiteText(script, {
      speakingStyle: 'professional',
      rate: 1.0,
    });
  }, []);

  const stopStoryVoice = useCallback(() => {
    stopActiveSpeech();
  }, []);

  // Handle story step change
  const goToStoryStep = useCallback((newIdx: number, autoSpeak: boolean = true) => {
    const clampedIdx = (newIdx + STORY_KEYS.length) % STORY_KEYS.length;
    setStoryIndex(clampedIdx);
    setStoryProgress(0);
    const key = STORY_KEYS[clampedIdx];
    setActiveKey(key);
    if (autoSpeak && isVoiceEnabled) {
      const nar = STORY_NARRATIONS[key];
      if (nar) {
        speakStoryScript(nar.voiceScript);
      }
    }
  }, [isVoiceEnabled, speakStoryScript]);

  // Story Mode auto-progress timer (4.5s per milestone)
  useEffect(() => {
    if (!isStoryActive || isStoryPaused) {
      if (storyTimerRef.current) clearInterval(storyTimerRef.current);
      return;
    }

    const intervalMs = 60;
    const totalDuration = 4500;
    const increment = (intervalMs / totalDuration) * 100;

    storyTimerRef.current = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          setStoryIndex((curIdx) => {
            const nextIdx = (curIdx + 1) % STORY_KEYS.length;
            const nextKey = STORY_KEYS[nextIdx];
            setActiveKey(nextKey);
            if (isVoiceEnabled) {
              const nar = STORY_NARRATIONS[nextKey];
              if (nar) speakStoryScript(nar.voiceScript);
            }
            return nextIdx;
          });
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => {
      if (storyTimerRef.current) clearInterval(storyTimerRef.current);
    };
  }, [isStoryActive, isStoryPaused, isVoiceEnabled, speakStoryScript]);

  // Toggle Story Mode
  const handleToggleStoryMode = () => {
    if (isStoryActive) {
      setIsStoryActive(false);
      setIsStoryPaused(false);
      setStoryProgress(0);
      stopStoryVoice();
      showToast('Đã dừng chế độ Trình chiếu Hành trình Sự nghiệp');
    } else {
      setIsStoryActive(true);
      setIsStoryPaused(false);
      setStoryIndex(0);
      setStoryProgress(0);
      setActiveKey(STORY_KEYS[0]);
      if (isVoiceEnabled) {
        speakStoryScript(STORY_NARRATIONS[STORY_KEYS[0]].voiceScript);
      }
      showToast('Bắt đầu Trình chiếu Hành trình Sự nghiệp (2003 → 2026+)');
    }
  };

  const handleSelectMilestone = (key: string) => {
    setActiveKey(key);
    showToast(`Đã chọn mốc: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
    const cardIdx = filteredRoadmapCards.findIndex((c) => c.key === key);
    if (cardIdx !== -1) {
      setSliderYearIndex(cardIdx);
      const cardEl = document.getElementById(`milestone-card-${key}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleOpenJobCard = (key: string) => {
    setActiveKey(key);
    setShowJobCard(true);
    showToast(`Chi tiết công tác: ${EXPERIENCE_MILESTONES[key]?.company || key}`);
  };

  // 8 Timeline Columns matching 100% the uploaded reference infographic while preserving 100% data
  const roadmapCards = [
    {
      key: '2003',
      yearBadge: 'Năm 2003',
      shortName: 'Công ty Viễn thông Mobifone',
      roleSummary: 'Nhân viên CSKH',
      headcountLabel: '12 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Mobifone.png',
      productSummary: 'MobiFone Di Động',
      products: [
        { name: 'MobiFone', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Mobifone.png' },
      ],
      primaryColor: '#0c85f3',
      badgeBg: 'linear-gradient(135deg, #1b93ff 0%, #0976e6 100%)',
      badgeColor: '#0c85f3',
      glowColor: 'rgba(12, 133, 243, 0.24)',
      outerRingBg: '#e4f2ff',
      cardBg: 'linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.75) 100%)',
      iconCircleBg: 'rgba(12, 133, 243, 0.14)',
      iconName: 'tower' as const,
      borderColor: 'border-blue-200/90',
      activeRing: 'ring-blue-400',
      titleColor: 'text-blue-900',
      pillBg: 'bg-white/90 backdrop-blur-sm text-blue-700 border-blue-200/90',
      arrowBg: '#0c85f3',
      arrowBorder: '#bfdbfe',
      bullets: [
        { text: 'Chăm sóc khách hàng', icon: 'shield' },
        { text: 'Tư vấn dịch vụ', icon: 'message' },
        { text: 'Giải quyết khiếu nại', icon: 'scale' },
      ],
    },
    {
      key: '2007',
      yearBadge: 'Năm 2007',
      shortName: 'Công ty Viễn Liên V247',
      roleSummary: 'Trưởng nhóm CSKH',
      headcountLabel: '12 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/V247.png',
      productSummary: 'Call 247 Quốc Tế',
      products: [
        { name: 'Call 247', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/V247.png' },
      ],
      primaryColor: '#8042f6',
      badgeBg: 'linear-gradient(135deg, #8e52ff 0%, #7334eb 100%)',
      badgeColor: '#8042f6',
      glowColor: 'rgba(128, 66, 246, 0.24)',
      outerRingBg: '#efe5ff',
      cardBg: 'linear-gradient(180deg, rgba(245, 243, 255, 0.95) 0%, rgba(237, 233, 254, 0.75) 100%)',
      iconCircleBg: 'rgba(128, 66, 246, 0.14)',
      iconName: 'globe' as const,
      borderColor: 'border-purple-200/90',
      activeRing: 'ring-purple-400',
      titleColor: 'text-purple-900',
      pillBg: 'bg-white/90 backdrop-blur-sm text-purple-700 border-purple-200/90',
      arrowBg: '#8042f6',
      arrowBorder: '#bbf7d0',
      bullets: [
        { text: 'Quản lý nhóm', icon: 'users' },
        { text: 'Đào tạo nhân sự', icon: 'graduation' },
        { text: 'Nâng cao chất lượng CSKH', icon: 'trend' },
      ],
    },
    {
      key: '2011',
      yearBadge: 'Năm 2011',
      shortName: 'Công ty CPTT Băng Rộng Cuộc Sống LBC',
      roleSummary: 'Trưởng Phòng CSKH',
      headcountLabel: '12 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070947/LBC.png',
      productSummary: 'Truyền hình Cáp HTVC',
      products: [
        { name: 'HTVC', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/HTVC.png' },
      ],
      primaryColor: '#069c47',
      badgeBg: 'linear-gradient(135deg, #0eb256 0%, #058c3f 100%)',
      badgeColor: '#069c47',
      glowColor: 'rgba(6, 156, 71, 0.24)',
      outerRingBg: '#def7e9',
      cardBg: 'linear-gradient(180deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.75) 100%)',
      iconCircleBg: 'rgba(6, 156, 71, 0.14)',
      iconName: 'tv' as const,
      borderColor: 'border-emerald-200/90',
      activeRing: 'ring-emerald-400',
      titleColor: 'text-emerald-900',
      pillBg: 'bg-white/90 backdrop-blur-sm text-emerald-700 border-emerald-200/90',
      arrowBg: '#069c47',
      arrowBorder: '#a5f3fc',
      bullets: [
        { text: 'Xây dựng quy trình', icon: 'file' },
        { text: 'Quản lý vận hành', icon: 'gear' },
        { text: 'Phát triển đội ngũ', icon: 'rocket' },
      ],
    },
    {
      key: '2013',
      yearBadge: 'Năm 2013',
      shortName: 'Công ty Cổ phần Việt Nam eSport',
      roleSummary: 'Trưởng Phòng Dịch vụ Khách hàng',
      headcountLabel: '130 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070950/VED.png',
      productSummary: 'Shopee · Garena · AirPay · GCafe',
      products: [
        { name: 'VED', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070950/VED.png' },
        { name: 'Garena', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Garena.png' },
        { name: 'Shopee', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee.png' },
        { name: 'AirPay', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee_Paye.png' },
        { name: 'GCafe', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/GCafe.png' },
      ],
      primaryColor: '#ed1c24',
      badgeBg: 'linear-gradient(135deg, #ff2a32 0%, #d60e15 100%)',
      badgeColor: '#ed1c24',
      glowColor: 'rgba(237, 28, 36, 0.24)',
      outerRingBg: '#ffe5e6',
      cardBg: 'linear-gradient(180deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.75) 100%)',
      iconCircleBg: 'rgba(237, 28, 36, 0.14)',
      iconName: 'gamepad' as const,
      borderColor: 'border-red-200/90',
      activeRing: 'ring-red-400',
      titleColor: 'text-red-950',
      pillBg: 'bg-white/90 backdrop-blur-sm text-red-700 border-red-200/90',
      arrowBg: '#ed1c24',
      arrowBorder: '#fecdd3',
      bullets: [
        { text: 'Quản lý 130 nhân sự', icon: 'users' },
        { text: 'Xây dựng CRM Garena', icon: 'file' },
        { text: 'CSKH TMĐT & eSports', icon: 'rocket' },
      ],
    },

    {
      key: '2016',
      yearBadge: 'Năm 2016',
      shortName: 'Công ty Bảo hiểm Nhân thọ Prudential Vietnam',
      roleSummary: 'Trưởng Phòng CallCenter',
      headcountLabel: '12 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Prudential.png',
      productSummary: 'Bảo hiểm PruLife',
      products: [
        { name: 'Prudential', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Prudential.png' },
      ],
      primaryColor: '#f64d25',
      badgeBg: 'linear-gradient(135deg, #ff5d36 0%, #e83e17 100%)',
      badgeColor: '#f64d25',
      glowColor: 'rgba(246, 77, 37, 0.24)',
      outerRingBg: '#ffe8e0',
      cardBg: 'linear-gradient(180deg, rgba(255, 241, 242, 0.95) 0%, rgba(255, 228, 230, 0.75) 100%)',
      iconCircleBg: 'rgba(246, 77, 37, 0.14)',
      iconName: 'shield' as const,
      borderColor: 'border-rose-200/90',
      activeRing: 'ring-rose-400',
      titleColor: 'text-rose-950',
      pillBg: 'bg-white/90 backdrop-blur-sm text-rose-800 border-rose-200/90',
      arrowBg: '#f64d25',
      arrowBorder: '#fbcfe8',
      bullets: [
        { text: 'Quản lý tổng đài', icon: 'phone' },
        { text: 'Đào tạo & phát triển', icon: 'book' },
        { text: 'Tối ưu hiệu suất', icon: 'zap' },
      ],
    },
    {
      key: '2018',
      yearBadge: 'Năm 2018',
      shortName: 'Công ty Cổ phần Mservice',
      roleSummary: 'Trưởng Phòng CSKH',
      headcountLabel: '60 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Momo.png',
      productSummary: 'Siêu ứng dụng Ví MoMo',
      products: [
        { name: 'Ví MoMo', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Momo.png' },
      ],
      primaryColor: '#f74f9e',
      badgeBg: 'linear-gradient(135deg, #ff5eab 0%, #e83d8e 100%)',
      badgeColor: '#f74f9e',
      glowColor: 'rgba(247, 79, 158, 0.24)',
      outerRingBg: '#fee5f2',
      cardBg: 'linear-gradient(180deg, rgba(253, 242, 248, 0.95) 0%, rgba(252, 231, 243, 0.75) 100%)',
      iconCircleBg: 'rgba(247, 79, 158, 0.14)',
      iconName: 'wallet' as const,
      borderColor: 'border-pink-200/90',
      activeRing: 'ring-pink-400',
      titleColor: 'text-pink-950',
      pillBg: 'bg-white/90 backdrop-blur-sm text-pink-700 border-pink-200/90',
      arrowBg: '#f74f9e',
      arrowBorder: '#fde68a',
      bullets: [
        { text: 'Chăm sóc khách hàng', icon: 'message' },
        { text: 'Phân tích dữ liệu', icon: 'chart' },
        { text: 'Phát triển dịch vụ', icon: 'star' },
      ],
    },
    {
      key: '2023',
      yearBadge: 'Năm 2023',
      shortName: 'Công ty Cổ phần Công nghệ Finviet',
      roleSummary: 'Trưởng Phòng CSKH',
      headcountLabel: '17 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Finviet.png',
      productSummary: 'Chợ Số Finviet',
      products: [
        { name: 'Finviet', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Finviet.png' },
      ],
      primaryColor: '#f9a800',
      badgeBg: 'linear-gradient(135deg, #ffb703 0%, #ef9b00 100%)',
      badgeColor: '#f9a800',
      glowColor: 'rgba(249, 168, 0, 0.24)',
      outerRingBg: '#fef3d6',
      cardBg: 'linear-gradient(180deg, rgba(254, 252, 232, 0.95) 0%, rgba(254, 243, 199, 0.75) 100%)',
      iconCircleBg: 'rgba(249, 168, 0, 0.16)',
      iconName: 'shopping-bag' as const,
      borderColor: 'border-amber-200/90',
      activeRing: 'ring-amber-400',
      titleColor: 'text-amber-950',
      pillBg: 'bg-white/90 backdrop-blur-sm text-amber-800 border-amber-200/90',
      arrowBg: '#f9a800',
      arrowBorder: '#bfdbfe',
      bullets: [
        { text: 'Quản lý nhóm', icon: 'users' },
        { text: 'Xây dựng quy trình', icon: 'file' },
        { text: 'Tăng trưởng khách hàng', icon: 'trend' },
      ],
    },
    {
      key: '2026',
      yearBadge: 'Năm 2026+',
      shortName: 'Sẵn sàng cho thử thách mới',
      roleSummary: 'Head of CS / CS Director',
      headcountLabel: '100 Nhân sự',
      logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Power_Service.png',
      productSummary: 'Power Service • CS Strategy',
      products: [
        { name: 'Power Service', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070948/Power_Service.png' },
      ],
      primaryColor: '#157efb',
      badgeBg: 'linear-gradient(135deg, #268bff 0%, #0d6efd 100%)',
      badgeColor: '#157efb',
      glowColor: 'rgba(21, 126, 251, 0.24)',
      outerRingBg: '#e0efff',
      cardBg: 'linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(224, 231, 255, 0.75) 100%)',
      iconCircleBg: 'rgba(21, 126, 251, 0.14)',
      iconName: 'rocket' as const,
      borderColor: 'border-indigo-200/90',
      activeRing: 'ring-indigo-400',
      titleColor: 'text-indigo-950',
      pillBg: 'bg-white/90 backdrop-blur-sm text-indigo-700 border-indigo-200/90',
      arrowBg: '#157efb',
      arrowBorder: '#bfdbfe',
      bullets: [
        { text: 'Chiến lược CSKH', icon: 'globe' },
        { text: 'Chuyển đổi số', icon: 'refresh' },
        { text: 'Phát triển bền vững', icon: 'leaf' },
      ],
    },
  ];

  const renderCardMilestoneIcon = (iconName: string, color: string) => {
    const props = { className: 'w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0', style: { color } };
    let finalName = 'tower';
    switch (iconName) {
      case 'tower': finalName = 'tower'; break;
      case 'globe': finalName = 'globe'; break;
      case 'tv': finalName = 'tv'; break;
      case 'gamepad': finalName = 'gamepad'; break;
      case 'shield': finalName = 'shield'; break;
      case 'wallet': finalName = 'wallet'; break;
      case 'shopping-bag': finalName = 'shopping-bag'; break;
      case 'rocket': finalName = 'rocket'; break;
      case 'users': finalName = 'user-group'; break;
      case 'chart': finalName = 'chart'; break;
      case 'monitor': finalName = 'monitor'; break;
      case 'factory': finalName = 'briefcase'; break;
      case 'smartphone': finalName = 'phone'; break;
      case 'megaphone': finalName = 'notification'; break;
      case 'clipboard': finalName = 'save'; break;
      default: finalName = iconName || 'tower';
    }
    return <WebIcon name={finalName} {...props} />;
  };

  const renderBulletIcon = (icon: string, color: string) => {
    const props = { className: 'w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0', style: { color } };
    let finalName = 'check';
    switch (icon) {
      case 'shield': finalName = 'shield'; break;
      case 'message': finalName = 'chat'; break;
      case 'scale': finalName = 'standard'; break;
      case 'users': finalName = 'user-group'; break;
      case 'graduation': finalName = 'graduation'; break;
      case 'trend': finalName = 'chart'; break;
      case 'file': finalName = 'edit'; break;
      case 'gear': finalName = 'settings'; break;
      case 'rocket': finalName = 'rocket'; break;
      case 'headset': finalName = 'phone'; break;
      case 'monitor': finalName = 'monitor'; break;
      case 'target': finalName = 'target'; break;
      case 'phone': finalName = 'phone'; break;
      case 'book': finalName = 'book'; break;
      case 'zap': finalName = 'zap'; break;
      case 'chart': finalName = 'chart'; break;
      case 'star': finalName = 'star'; break;
      case 'globe': finalName = 'globe'; break;
      case 'refresh': finalName = 'refresh'; break;
      case 'leaf': finalName = 'leaf'; break;
      default: finalName = 'check';
    }
    return <WebIcon name={finalName} {...props} />;
  };

  // VED 5 Brands Ecosystem
  const subEntities2013 = [
    { key: '2013', name: 'VED', role: 'Game Online', src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070950/VED.png' },
    { key: '2013-garena', name: 'Garena', role: 'Game Publisher', src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/Garena.png' },
    { key: '2013-gcafe', name: 'Gcafe', role: 'Phần mềm B2B', src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070946/GCafe.png' },
    { key: '2013-shopee', name: 'Shopee', role: 'Sàn TMĐT', src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee.png' },
    { key: '2014-airpay', name: 'AirPay', role: 'Ví Điện Tử', src: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793070949/Shopee_Paye.png' },
  ];

  // Featured Products Carousel (Right Widget in the image)
  const featuredProductPages = [
    {
      label: '4 sản phẩm (VED, Garena, Shopee, AirPay)',
      items: [
        { name: 'VED eSports', sub: 'eSports & Game Online', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/VED.png', targetKey: '2013' },
        { name: 'Garena', sub: 'LMHT, FO3 & VCS', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Garena.png', targetKey: '2013-garena' },
        { name: 'Shopee', sub: 'Sàn Thương Mại Điện Tử', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Shopee.png', targetKey: '2013-shopee' },
        { name: 'ShopeePay / AirPay', sub: 'Ví Điện Tử Thanh Toán', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Shopee_Paye.png', targetKey: '2014-airpay' },
      ],
    },
    {
      label: 'Sản phẩm Finviet',
      items: [
        { name: 'Finviet', sub: 'FinTech Ecosystem', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Finviet.png', targetKey: '2023' },
      ],
    },
    {
      label: '2 sản phẩm (FinTech & Bảo hiểm)',
      items: [
        { name: 'Ví MoMo', sub: 'Siêu ứng dụng Thanh toán', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Momo.png', targetKey: '2018' },
        { name: 'Prudential', sub: 'Bảo hiểm Nhân thọ', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Prudential.png', targetKey: '2016' },
      ],
    },
    {
      label: '3 sản phẩm (Viễn thông & Truyền hình)',
      items: [
        { name: 'MobiFone', sub: 'Viễn thông Di động', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Mobifone.png', targetKey: '2003' },
        { name: 'Call 247 / LBC', sub: 'Viễn thông Quốc tế', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/V247.png', targetKey: '2007' },
        { name: 'LBC - HTVC', sub: 'Truyền hình Cáp & Internet', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/LBC.png', targetKey: '2011' },
      ],
    },
  ];

  const is2013GroupActive =
    activeKey === '2013' || activeKey.startsWith('2013') || activeKey === '2014-airpay';

  // Filter roadmap cards if user types in search box
  const filteredRoadmapCards = roadmapCards.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const ms = EXPERIENCE_MILESTONES[c.key];
    return (
      c.shortName.toLowerCase().includes(q) ||
      c.yearBadge.toLowerCase().includes(q) ||
      c.roleSummary.toLowerCase().includes(q) ||
      (ms && ms.company.toLowerCase().includes(q)) ||
      (ms && ms.industry?.toLowerCase().includes(q))
    );
  });

  const allMilestoneKeys = ['2003', '2007', '2011', '2013', '2016', '2018', '2023', '2026'];
  const normalizedActiveKey = activeKey.startsWith('2013') || activeKey === '2014-airpay' ? '2013' : activeKey;
  const currentKeyIndex = allMilestoneKeys.indexOf(normalizedActiveKey);
  const prevKey = currentKeyIndex > 0 ? allMilestoneKeys[currentKeyIndex - 1] : null;
  const nextKey = currentKeyIndex < allMilestoneKeys.length - 1 ? allMilestoneKeys[currentKeyIndex + 1] : null;

  const currentProdSlide = featuredProductPages[featuredProdPage] || featuredProductPages[0];

  // 4 items per view pagination calculations & horizontal scroll handlers
  const totalTimelinePages = Math.max(1, Math.ceil(filteredRoadmapCards.length / CARDS_PER_PAGE));
  const timelinePagesData = Array.from({ length: totalTimelinePages }, (_, pageIdx) =>
    filteredRoadmapCards.slice(pageIdx * CARDS_PER_PAGE, (pageIdx + 1) * CARDS_PER_PAGE)
  );

  const handlePrevTimelinePage = () => {
    setTimelinePage((prev) => (prev > 0 ? prev - 1 : totalTimelinePages - 1));
  };

  const handleNextTimelinePage = () => {
    setTimelinePage((prev) => (prev < totalTimelinePages - 1 ? prev + 1 : 0));
  };

  // Vị trí logo hiện tại đang được chọn (từ 0 đến 7)
  const currentLogoIdx = filteredRoadmapCards.findIndex(
    (c) => c.key === activeKey || (c.key === '2013' && is2013GroupActive)
  );

  // Tính năng nút scroll lướt qua từng logo kế tiếp
  const handleScrollNextLogo = () => {
    if (filteredRoadmapCards.length === 0) return;
    const nextIdx = currentLogoIdx < filteredRoadmapCards.length - 1 ? currentLogoIdx + 1 : 0;
    const nextCard = filteredRoadmapCards[nextIdx];
    if (nextCard) {
      handleSelectMilestone(nextCard.key);
      const targetPage = Math.floor(nextIdx / CARDS_PER_PAGE);
      if (targetPage !== timelinePage && targetPage < totalTimelinePages) {
        setTimelinePage(targetPage);
      }
      setTimeout(() => {
        document.getElementById(`milestone-card-${nextCard.key}`)?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }, 40);
    }
  };

  // Tính năng nút scroll lướt về logo trước đó
  const handleScrollPrevLogo = () => {
    if (filteredRoadmapCards.length === 0) return;
    const prevIdx = currentLogoIdx > 0 ? currentLogoIdx - 1 : filteredRoadmapCards.length - 1;
    const prevCard = filteredRoadmapCards[prevIdx];
    if (prevCard) {
      handleSelectMilestone(prevCard.key);
      const targetPage = Math.floor(prevIdx / CARDS_PER_PAGE);
      if (targetPage !== timelinePage && targetPage < totalTimelinePages) {
        setTimelinePage(targetPage);
      }
      setTimeout(() => {
        document.getElementById(`milestone-card-${prevCard.key}`)?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }, 40);
    }
  };

  // Tự động đồng bộ timelinePage khi activeKey thay đổi hoặc Story Mode chạy
  useEffect(() => {
    const cardIdx = filteredRoadmapCards.findIndex(
      (c) => c.key === activeKey || (c.key === '2013' && is2013GroupActive)
    );
    if (cardIdx !== -1) {
      const targetPage = Math.floor(cardIdx / CARDS_PER_PAGE);
      if (targetPage !== timelinePage && targetPage < totalTimelinePages) {
        setTimelinePage(targetPage);
      }
    }
  }, [activeKey, filteredRoadmapCards, is2013GroupActive, totalTimelinePages, timelinePage]);

  // Đảm bảo timelinePage không vượt quá totalTimelinePages khi tìm kiếm
  useEffect(() => {
    if (timelinePage >= totalTimelinePages) {
      setTimelinePage(Math.max(0, totalTimelinePages - 1));
    }
  }, [totalTimelinePages, timelinePage]);

  // Tự động trượt ngang (Auto-Scroll Carousel Mode) mỗi 8 giây nếu được bật
  useEffect(() => {
    if (!isTimelineAutoScroll || isStoryActive) return;
    const interval = setInterval(() => {
      setTimelinePage((prev) => (prev + 1) % totalTimelinePages);
    }, 8000);
    return () => clearInterval(interval);
  }, [isTimelineAutoScroll, isStoryActive, totalTimelinePages]);

  return (
    <div
      id="experience-page-container"
      data-element-name="Trang Hành trình sự nghiệp"
      data-element-type="card"
      data-section-card="true"
      data-element-page="experience"
      data-element-parent="global-content-viewport"
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
      }}
      className="bento-card glass-card w-full h-full flex-1 min-h-0 flex flex-col justify-start p-[15px] gap-[15px] max-w-full mx-auto select-none relative text-slate-800 dark:text-slate-100 overflow-y-auto glass-scrollbar font-play text-left animate-fadeIn rounded-[14px]"
    >
      {/* BANNER KINH NGHIỆM VÀ TIMELINE */}
      {!showJobCard && (
        <>
          <motion.div
            id="experience-hero-banner"
            data-element-name="Banner Hành trình sự nghiệp"
            data-element-type="section"
            data-element-page="experience"
            data-element-parent="experience-page-container"
            data-section-card="true"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
            style={{ padding: '15px', width: '100%', maxWidth: '100%', height: '200px', minHeight: '200px', maxHeight: '200px', borderRadius: '14px' }}
          >
           <div
             className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
             style={{
               background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
               borderRadius: '14px',
             }}
           >
             <img
               src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042092/Kinh_nghi%E1%BB%87m.png"
               alt="Hành trình sự nghiệp"
               referrerPolicy="no-referrer"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
               }}
               className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
           </div>

           <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
             <div className="flex items-center gap-2 shrink-0">
               <WebIcon
                 name="briefcase"
                 className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
                 style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
               />
               <h1
                 className="typo-h1 font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] whitespace-nowrap"
                 style={{ color: '#38bdf8', fontWeight: 700, textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
               >
                 Hành trình sự nghiệp
               </h1>
             </div>
             <p
               className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
               style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '28px', fontWeight: 700, fontStyle: 'normal' }}
             >
               &quot;Tận tâm phụng sự, dẫn dắt bằng kết quả ♡&quot;
             </p>
           </div>

           {/* Nhóm các nút lại thành 1 filter icon ở bên dưới bên trái - filter dạng drop menu list, tiêu đề nhóm nút còn 4 từ */}
           <div className="relative z-30 flex items-center justify-start mt-auto" ref={filterMenuRef}>
             <div className="relative inline-block text-left">
               <button
                 type="button"
                 onClick={() => {
                   SoundEngine.playTap();
                   setIsFilterDropdownOpen((prev) => !prev);
                 }}
                 className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/90 hover:bg-[#EEF2FF] dark:hover:bg-[#1F2937] text-[#4338CA] dark:text-[#A5B4FC] border border-[#CBD5E1] dark:border-[#334155] shadow-sm backdrop-blur-md transition-all cursor-pointer typo-button font-bold font-play active:scale-95 group"
                 title="Bộ lọc cột mốc"
                 aria-expanded={isFilterDropdownOpen}
                 aria-haspopup="listbox"
               >
                 <WebIcon name="sliders" className="w-4 h-4 text-indigo-600 dark:text-indigo-300 transition-transform group-hover:rotate-45 shrink-0" />
                 <span>Bộ lọc cột mốc</span>
                 <span className="px-1.5 py-0.2 rounded-full bg-indigo-100/90 dark:bg-indigo-500/25 border border-indigo-200 dark:border-indigo-400/50 typo-badge font-mono text-indigo-700 dark:text-indigo-200">
                   {normalizedActiveKey}
                 </span>
                 <WebIcon
                   name="chevron-down"
                   className={cn(
                     'w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300 transition-transform duration-200 shrink-0',
                     isFilterDropdownOpen && 'rotate-180'
                   )}
                 />
               </button>

               <AnimatePresence>
                 {isFilterDropdownOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: 6, scale: 0.96 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 6, scale: 0.96 }}
                     transition={{ duration: 0.16 }}
                     role="listbox"
                     className="bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-64 max-h-80 overflow-y-auto custom-scrollbar rounded-[14px] bg-white/95 dark:bg-[#111827]/95 border border-indigo-200 dark:border-indigo-400/50 shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.75)] backdrop-blur-xl py-1.5 px-1.5 z-50 flex flex-col gap-1 text-[#334155] dark:text-[#F8FAFC]"
                   >
                     <div className="px-2.5 py-1 typo-label font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                       Chế độ hiển thị
                     </div>
                     <button
                       type="button"
                       onClick={() => {
                         SoundEngine.playTap();
                         setShowJobCard(false);
                         setIsFilterDropdownOpen(false);
                       }}
                       className={cn(
                         'w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-button font-bold font-play transition-all cursor-pointer text-left',
                         !showJobCard
                           ? 'bg-indigo-100 dark:bg-indigo-500/25 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-400/60'
                           : 'text-[#334155] dark:text-[#E2E8F0] hover:bg-indigo-50 dark:hover:bg-white/10 hover:text-indigo-900 dark:hover:text-white border border-transparent'
                       )}
                     >
                       <span>Lịch sử công tác (8 Mốc)</span>
                     </button>
                     <button
                       type="button"
                       onClick={() => {
                         SoundEngine.playTap();
                         setShowJobCard(false);
                         handleToggleStoryMode();
                         setIsFilterDropdownOpen(false);
                       }}
                       className={cn(
                         'w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-button font-bold font-play transition-all cursor-pointer text-left',
                         isStoryActive
                           ? 'bg-amber-100 dark:bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-400/60'
                           : 'text-[#334155] dark:text-[#E2E8F0] hover:bg-amber-50 dark:hover:bg-white/10 hover:text-amber-900 dark:hover:text-white border border-transparent'
                       )}
                     >
                       <span>{isStoryActive ? 'Dừng trình chiếu hành trình' : 'Trình chiếu hành trình tự động'}</span>
                     </button>

                     <div className="my-1 border-t border-slate-200/80 dark:border-white/10" />
                     <div className="px-2.5 py-1 typo-label font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                       Chọn nhanh cột mốc
                     </div>
                     {roadmapCards.map((c) => {
                       const isSelected = normalizedActiveKey === c.key && showJobCard;
                       return (
                         <button
                           key={c.key}
                           type="button"
                           onClick={() => {
                             SoundEngine.playTap();
                             handleOpenJobCard(c.key);
                             setIsFilterDropdownOpen(false);
                           }}
                           className={cn(
                             'w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-button font-bold font-play transition-all cursor-pointer text-left',
                             isSelected
                               ? 'bg-indigo-100 dark:bg-indigo-500/25 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-400/60'
                               : 'text-[#334155] dark:text-[#E2E8F0] hover:bg-indigo-50 dark:hover:bg-white/10 hover:text-indigo-900 dark:hover:text-white border border-transparent'
                           )}
                         >
                           <span className="truncate">{c.yearBadge} · {c.shortName}</span>
                         </button>
                       );
                     })}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           </div>
          </motion.div>

          {/* Story Narration Bar (Khi ở chế độ Trình Chiếu Hành Trình) */}
          {isStoryActive && (
            <div className="w-full p-3 sm:p-3.5 rounded-[14px] bg-gradient-to-r from-[#1E1B4B]/95 via-indigo-950/95 to-[#0B1220]/95 text-white shadow-[0_16px_36px_-8px_rgba(30,27,75,0.3)] border border-white/20 backdrop-blur-2xl relative overflow-hidden animate-fadeIn shrink-0">
              {/* 4.5s Progress Bar across bottom of narration banner */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-75 ease-linear"
                  style={{ width: `${storyProgress}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Cột trái: Cột mốc & Nội dung thuyết minh */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <WebIcon name="sparkles" className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#0B1220] typo-badge font-black font-mono uppercase tracking-wider shadow-2xs">
                        Cột mốc {storyIndex + 1}/8 • {STORY_KEYS[storyIndex]}
                      </span>
                      <h4 className="typo-h5 font-black font-play text-white break-words">
                        {STORY_NARRATIONS[STORY_KEYS[storyIndex]]?.stage}
                      </h4>
                    </div>
                    <p className="typo-caption text-slate-200 mt-1 break-words leading-relaxed">
                      {STORY_NARRATIONS[STORY_KEYS[storyIndex]]?.summary}
                    </p>
                  </div>
                </div>

                {/* Cột phải: Điều khiển trình chiếu */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Bật/Tắt giọng đọc */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isVoiceEnabled;
                      setIsVoiceEnabled(next);
                      if (!next) stopStoryVoice();
                      else speakStoryScript(STORY_NARRATIONS[STORY_KEYS[storyIndex]].voiceScript);
                      showToast(next ? 'Đã bật giọng đọc thuyết minh' : 'Đã tắt giọng đọc thuyết minh');
                    }}
                    className={`p-1.5 px-2.5 rounded-full typo-label font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      isVoiceEnabled
                        ? 'bg-emerald-500/80 border-emerald-300 text-white shadow-xs'
                        : 'bg-white/10 border-white/20 text-slate-300 hover:text-white'
                    }`}
                    title={isVoiceEnabled ? 'Giọng đọc tiếng Việt: BẬT' : 'Giọng đọc: TẮT'}
                  >
                    {isVoiceEnabled ? <WebIcon name="volume" className="w-3.5 h-3.5" /> : <WebIcon name="mute" className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isVoiceEnabled ? 'Giọng đọc' : 'Tắt giọng'}</span>
                  </button>

                  {/* Lùi mốc */}
                  <button
                    type="button"
                    onClick={() => goToStoryStep(storyIndex - 1)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
                    title="Mốc trước đó"
                  >
                    <WebIcon name="backward" className="w-3.5 h-3.5" />
                  </button>

                  {/* Tạm dừng / Tiếp tục */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isStoryPaused;
                      setIsStoryPaused(next);
                      if (next) stopStoryVoice();
                      showToast(next ? 'Đã tạm dừng trình chiếu' : 'Tiếp tục trình chiếu');
                    }}
                    className="p-1.5 px-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black typo-button transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                    title={isStoryPaused ? 'Tiếp tục' : 'Tạm dừng'}
                  >
                    {isStoryPaused ? <WebIcon name="play" className="w-3.5 h-3.5 fill-current" /> : <WebIcon name="pause" className="w-3.5 h-3.5 fill-current" />}
                    <span>{isStoryPaused ? 'Phát' : 'Dừng'}</span>
                  </button>

                  {/* Tới mốc kế tiếp */}
                  <button
                    type="button"
                    onClick={() => goToStoryStep(storyIndex + 1)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
                    title="Mốc tiếp theo"
                  >
                    <WebIcon name="forward" className="w-3.5 h-3.5" />
                  </button>

                  {/* Nút đóng story mode */}
                  <button
                    type="button"
                    onClick={handleToggleStoryMode}
                    className="p-1.5 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-400 text-white transition-all cursor-pointer active:scale-95 ml-1"
                    title="Thoát chế độ trình chiếu"
                  >
                    <WebIcon name="cancel" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex-1 min-h-0 flex flex-col">
            <div
              id="experience-timeline-track-card"
              ref={horizontalTrackRef}
              data-section-card="true"
              style={{
                ...cardSampleStyle,
                borderRadius: '14px',
              }}
              className="w-full flex-1 min-h-0 rounded-[14px] overflow-x-auto overflow-y-auto custom-scrollbar pb-4 pt-2 px-3 relative flex flex-row gap-5 items-stretch transition-all duration-300 snap-x"
            >
                {filteredRoadmapCards.map((item) => {
                  const isSelected =
                    activeKey === item.key || (item.key === '2013' && is2013GroupActive);
                  const isHighlightedInStory = isStoryActive && STORY_KEYS[storyIndex] === item.key;

                  const COMPANY_BANNERS: Record<string, string> = {
                    '2003': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Mobifone.png',
                    '2007': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/V247.png',
                    '2011': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/LBC.png',
                    '2013': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/VED.png',
                    '2016': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Prudential.png',
                    '2018': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Momo.png',
                    '2023': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Finviet.png',
                    '2026': 'https://res.cloudinary.com/q5tpzaxk/image/upload/Kinh%20nghi%E1%BB%87m/logo%20c%C3%B4ng%20ty/Power_Service.png',
                  };
                  const COMPANY_BANNERS_FALLBACK: Record<string, string> = {
                    '2003': 'https://i.ibb.co/KzryKQHx/Mobifone.png',
                    '2007': 'https://i.ibb.co/bMZKjMhX/v247.png',
                    '2011': 'https://i.ibb.co/Mykxzbbz/LBC.png',
                    '2013': 'https://i.ibb.co/jknPRhj3/VED.png',
                    '2016': 'https://i.ibb.co/whFY0YV0/Prudentinal.png',
                    '2018': 'https://i.ibb.co/GQLRGwrw/Momo.png',
                    '2023': 'https://i.ibb.co/cSXPhWcp/Finviet.png',
                    '2026': 'https://i.ibb.co/fYVwSxRW/T-m-C-h-i.png',
                  };
                  const bannerImg = COMPANY_BANNERS[item.key] || COMPANY_BANNERS['2003'];
                  const bannerFallback = COMPANY_BANNERS_FALLBACK[item.key] || COMPANY_BANNERS_FALLBACK['2003'];

                  return (
                    <div
                      key={item.key}
                      id={`milestone-card-${item.key}`}
                      className={`relative flex flex-col items-center min-h-full h-auto w-[300px] sm:w-[340px] shrink-0 snap-start select-none transition-all duration-300 justify-start ${
                        isHighlightedInStory ? 'scale-[1.02] z-30' : ''
                      }`}
                    >
                      {/* TIER 1: Top Year Pill Badge */}
                      <div className="flex flex-col items-center shrink-0 z-20 w-full mb-2">
                        <button
                          type="button"
                          onClick={() => handleSelectMilestone(item.key)}
                          className={`w-[78%] max-w-[145px] py-1.5 px-3.5 rounded-full text-white font-black font-play typo-button tracking-tight shadow-sm flex items-center justify-center transition-all duration-300 whitespace-nowrap cursor-pointer ${
                            isSelected ? 'scale-105 ring-2 ring-white shadow-md' : 'hover:scale-105'
                          } ${isHighlightedInStory ? 'ring-2 ring-amber-300 shadow-lg' : ''}`}
                          style={{ background: item.badgeBg }}
                        >
                          <span>{item.yearBadge}</span>
                        </button>
                        <div
                          className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] -mt-[0.5px]"
                          style={{ borderTopColor: item.primaryColor }}
                        />
                      </div>

                      {/* TIER 3: Themed Info Card (Banner is now inside at the top, replacing circular logo) */}
                      <div
                        role="button"
                        tabIndex={0}
                        data-subcard="true"
                        onClick={() => handleOpenJobCard(item.key)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenJobCard(item.key);
                          }
                        }}
                        style={{
                          borderRadius: '14px',
                          padding: '12px',
                          ['--card-accent-color' as string]: item.primaryColor,
                        }}
                        className={`experience-milestone-card w-full flex-1 rounded-[14px] p-3 border transition-all duration-300 cursor-pointer flex flex-col items-stretch text-center justify-between gap-2.5 relative group ${
                          isSelected
                            ? `ring-2 ${item.activeRing} shadow-[0_14px_34px_-4px_rgba(30,27,75,0.18)] dark:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.7),0_0_20px_${item.glowColor}] -translate-y-0.5`
                            : 'hover:-translate-y-0.5'
                        } ${isHighlightedInStory ? 'ring-2 ring-amber-400 shadow-md' : ''}`}
                      >
                        <div
                          className="w-full h-1 rounded-full shrink-0"
                          style={{ background: item.badgeBg }}
                        />
                        {/* Company Banner inside card frame on top of company name */}
                        <div className="w-full h-[76px] rounded-[10px] overflow-hidden border border-white/80 dark:border-white/15 shadow-2xs relative shrink-0 bg-slate-900/10">
                          <img
                            src={bannerImg}
                            alt={`${item.shortName} banner`}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== bannerFallback) {
                                target.src = bannerFallback;
                              }
                            }}
                            className="w-full h-full object-cover object-center pointer-events-none select-none"
                            loading="lazy"
                          />
                        </div>

                        {/* Company Name (2 lines uniform) & Circular Logo */}
                        <div data-subcard="true" className="exp-detail-subcard w-full flex items-center justify-start gap-2.5 shrink-0 p-2.5 rounded-[12px] text-left">
                          <div
                            style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                            className="w-12 h-12 rounded-full aspect-square overflow-hidden bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center shadow-2xs"
                          >
                            <img
                              src={item.logo}
                              alt={item.shortName}
                              style={{ borderRadius: '50%' }}
                              className="w-full h-full object-cover rounded-full pointer-events-none select-none"
                            />
                          </div>
                          <div className="flex-1 min-w-0 min-h-[2.75rem] flex items-center">
                            <h4
                              className="typo-body font-bold font-play tracking-tight line-clamp-2 whitespace-normal break-words leading-snug w-full text-[#0F172A] dark:text-[#F8FAFC]"
                              style={{ color: isDark ? (isSelected ? '#38bdf8' : '#f8fafc') : item.primaryColor, fontWeight: 700 }}
                              title={item.shortName}
                            >
                              {item.shortName}
                            </h4>
                          </div>
                        </div>

                        <div data-subcard="true" className="exp-detail-subcard w-full flex flex-col items-start gap-1 shrink-0 p-2.5 rounded-[12px]">
                          <div className="text-[15px] sm:text-[16px] font-bold text-sky-500 dark:text-sky-300 flex items-center gap-1.5">
                            <WebIcon name="shopping-bag" className="w-4 h-4 shrink-0 text-sky-500 dark:text-sky-300" />
                            <span>Sản phẩm & Dịch vụ</span>
                          </div>
                          <div className="w-full pt-1 flex items-center justify-start gap-2 flex-wrap shrink-0">
                            {(item.products && item.products.length > 0 ? item.products : [{ name: item.shortName, logo: item.logo }]).map((p, pIdx) => (
                              <div
                                key={pIdx}
                                style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                                className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                                title={p.name}
                              >
                                <img
                                  src={p.logo}
                                  alt={p.name}
                                  style={{ borderRadius: '50%' }}
                                  className="w-full h-full object-cover rounded-full pointer-events-none select-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div data-subcard="true" className="exp-detail-subcard w-full flex flex-col items-start justify-start gap-1.5 shrink-0 p-2.5 rounded-[12px] text-left">
                          <div className="flex items-center justify-start gap-1.5 typo-body-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate w-full text-left">
                            <WebIcon name="briefcase" className="w-3.5 h-3.5 shrink-0" style={{ color: isDark ? '#FDE68A' : item.primaryColor }} />
                            <span className="truncate">{item.roleSummary}</span>
                          </div>

                          <div className="flex items-center justify-start gap-1.5 typo-body-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate w-full text-left">
                            <WebIcon name="user-group" className="w-3.5 h-3.5 shrink-0" style={{ color: isDark ? '#FDE68A' : item.primaryColor }} />
                            <span className="truncate">Quản lý: {item.headcountLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Nút LÙI TRANG (Chevron Left) hình tròn nổi ở chính giữa cạnh trái thẻ #experience-timeline-track-card */}
            <button
              type="button"
              onClick={handleScrollPrevLogo}
              title="Lùi mốc thời gian trước"
              aria-label="Lùi trang"
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95"
              style={{
                background: 'var(--bg-header)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-popup)',
                backdropFilter: 'blur(var(--bg-blur))',
                WebkitBackdropFilter: 'blur(var(--bg-blur))',
              }}
            >
              <WebIcon
                name="chevron-left"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
                style={{ color: 'var(--color-primary)' }}
              />
            </button>

            {/* Nút TỚI TRANG (Chevron Right) hình tròn nổi ở chính giữa cạnh phải thẻ #experience-timeline-track-card */}
            <button
              type="button"
              onClick={handleScrollNextLogo}
              title="Tới mốc thời gian tiếp theo"
              aria-label="Tới trang"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95"
              style={{
                background: 'var(--bg-header)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-popup)',
                backdropFilter: 'blur(var(--bg-blur))',
                WebkitBackdropFilter: 'blur(var(--bg-blur))',
              }}
            >
              <WebIcon
                name="chevron-right"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
                style={{ color: 'var(--color-primary)' }}
              />
            </button>
          </div>
        </>
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

        const memoryPreviewSrc =
          photosList[0]?.src || activeMilestone.bannerUrl || 'https://i.ibb.co/Xr7hKN4v/Kinh-nghi-m.png';

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
        const productSummaryText =
          currentRoadmapCard?.productSummary ||
          activeMilestone.subCompanies ||
          activeMilestone.industry;

        return (
          <div
            id="experience-job-detail-card"
            data-section-card="true"
            style={{
              ...cardSampleStyle,
              borderRadius: '14px',
              padding: '15px',
            }}
            className="w-full h-full flex-1 min-h-0 flex flex-col justify-start rounded-[14px] border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-xl relative overflow-y-auto glass-scrollbar gap-[15px] text-left transition-all duration-300 animate-fadeIn font-play p-[15px]"
          >
            {/* Thanh điều hướng nhanh giữa các cột mốc + Nút quay lại Timeline */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 shrink-0 pb-2 border-b border-indigo-200/50 dark:border-white/10">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setShowJobCard(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1F2937] hover:bg-indigo-50 dark:hover:bg-slate-800 text-[#4338CA] dark:text-[#A5B4FC] border border-indigo-200/80 dark:border-[#334155] typo-button font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  <WebIcon name="arrow-left" className="w-3.5 h-3.5 shrink-0" />
                  <span>Lịch sử công tác</span>
                </button>

                {prevKey && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      handleOpenJobCard(prevKey);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/85 dark:bg-[#1F2937] hover:bg-indigo-50 dark:hover:bg-slate-800 text-[#334155] dark:text-[#E2E8F0] border border-slate-200/80 dark:border-[#334155] typo-caption font-bold transition-all cursor-pointer active:scale-95"
                    title={`Mốc trước: ${EXPERIENCE_MILESTONES[prevKey]?.company}`}
                  >
                    <WebIcon name="chevron-left" className="w-3.5 h-3.5 shrink-0" />
                    <span>{EXPERIENCE_MILESTONES[prevKey]?.year}</span>
                  </button>
                )}

                {nextKey && (
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      handleOpenJobCard(nextKey);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/85 dark:bg-[#1F2937] hover:bg-indigo-50 dark:hover:bg-slate-800 text-[#334155] dark:text-[#E2E8F0] border border-slate-200/80 dark:border-[#334155] typo-caption font-bold transition-all cursor-pointer active:scale-95"
                    title={`Mốc tiếp theo: ${EXPERIENCE_MILESTONES[nextKey]?.company}`}
                  >
                    <span>{EXPERIENCE_MILESTONES[nextKey]?.year}</span>
                    <WebIcon name="chevron-right" className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  SoundEngine.playTap();
                  setShowJobCard(false);
                }}
                aria-label="Đóng chi tiết công việc"
                className="w-8 h-8 rounded-full bg-white/90 dark:bg-[#1F2937] hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-[#334155] dark:text-[#E2E8F0] transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 border border-slate-200/80 dark:border-[#334155]"
                title="Đóng (Esc)"
              >
                <WebIcon name="cancel" className="w-4 h-4" />
              </button>
            </div>

            {/* KHỐI 1: THẺ THÔNG TIN DOANH NGHIỆP & CARD KỶ NIỆM */}
            <section
              id="experience-info-card"
              data-subcard="true"
              className="exp-detail-card w-full rounded-[18px] p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shrink-0"
            >
              {/* Cột trái: Thời gian, Logo tròn lớn, Tên công ty, Hệ sinh thái, Nhãn ngành */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 typo-body-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                  <WebIcon name="calendar" className="w-4 h-4 text-[#6366F1] dark:text-[#A5B4FC] shrink-0" />
                  <span className="break-words">{activeMilestone.period}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                  <div
                    style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                    className="w-20 h-20 sm:w-[92px] sm:h-[92px] rounded-full p-1 bg-gradient-to-br from-sky-200 via-indigo-100 to-purple-200 dark:from-sky-500/35 dark:via-indigo-500/30 dark:to-purple-500/35 shadow-[0_8px_20px_rgba(79,70,229,0.14)] shrink-0"
                  >
                    <div
                      style={{ borderRadius: '50%' }}
                      className="w-full h-full rounded-full bg-white p-1.5 flex items-center justify-center overflow-hidden border border-white/80"
                    >
                      <img
                        src={activeMilestone.logo}
                        alt={activeMilestone.company}
                        style={{ borderRadius: '50%' }}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h2 className="text-[19px] sm:text-[22px] font-bold font-play text-[#1E1B4B] dark:text-[#F8FAFC] leading-snug break-words">
                      {activeMilestone.company}
                    </h2>
                    {activeMilestone.subCompanies && (
                      <p className="text-[15px] sm:text-[17px] font-semibold text-[#4F46E5] dark:text-[#A5B4FC] leading-snug break-words">
                        {activeMilestone.subCompanies}
                      </p>
                    )}
                    <div className="pt-0.5 flex flex-wrap items-center gap-2">
                      <span className="exp-icon-badge inline-flex items-center px-3 py-0.5 rounded-full text-[#4338CA] dark:text-[#FDE68A] border typo-badge font-bold">
                        {activeMilestone.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: Card Kỷ niệm (Mở Lightbox ảnh kỷ niệm) */}
              <div
                id="experience-memories-card"
                data-subcard="true"
                role="button"
                tabIndex={0}
                aria-label={`Mở Card Kỷ niệm (${photosList.length} hình ảnh)`}
                onClick={() => {
                  if (photosList.length > 0) {
                    SoundEngine.playTap();
                    setCarouselSlideIdx(0);
                    setIsPhotoLightboxOpen(true);
                  } else {
                    showToast('Chưa có hình ảnh kỷ niệm cho cột mốc này');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (photosList.length > 0) {
                      SoundEngine.playTap();
                      setCarouselSlideIdx(0);
                      setIsPhotoLightboxOpen(true);
                    }
                  }
                }}
                className="exp-detail-subcard w-full lg:w-[270px] xl:w-[295px] shrink-0 rounded-[16px] p-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="w-full h-24 sm:h-[94px] rounded-[12px] overflow-hidden bg-slate-900/10 relative border border-white/70 dark:border-white/10">
                  <img
                    src={memoryPreviewSrc}
                    alt={`Kỷ niệm ${activeMilestone.company}`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = 'https://i.ibb.co/Xr7hKN4v/Kinh-nghi-m.png';
                      if (target.src !== fallback) target.src = fallback;
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="flex items-center gap-2.5 pt-2.5 px-1 pb-0.5">
                  <div className="exp-icon-badge w-8 h-8 rounded-[10px] text-rose-500 dark:text-rose-300 border flex items-center justify-center shrink-0">
                    <WebIcon name="image" className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[15px] sm:text-[16px] font-bold text-rose-500 dark:text-rose-300 block leading-tight">
                      Card Kỷ niệm
                    </span>
                    <span className="typo-caption text-[#64748B] dark:text-[#CBD5E1] block leading-tight mt-0.5 tabular-nums">
                      {photosList.length > 0 ? `${photosList.length} hình ảnh` : 'Chưa có hình ảnh'}
                    </span>
                  </div>
                  {photosList.length > 0 && (
                    <WebIcon
                      name="maximize-2"
                      className="w-3.5 h-3.5 text-rose-400 dark:text-rose-300 opacity-75 group-hover:opacity-100 shrink-0 transition-opacity"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* KHỐI 2: CÂU CHUYỆN HÀNH TRÌNH (FULL WIDTH) */}
            <section
              id="experience-banner-card"
              data-subcard="true"
              className="exp-detail-card w-full rounded-[18px] p-4 sm:p-5 flex flex-col gap-3.5 shrink-0"
            >
              <div className="w-full space-y-3.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="exp-icon-badge w-8 h-8 rounded-[10px] border text-[#4F46E5] dark:text-[#A5B4FC] flex items-center justify-center shrink-0">
                    <WebIcon name="shield-check" className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="card-title text-[17px] sm:text-[18px] font-bold font-play text-[#4F46E5] dark:text-[#A5B4FC] leading-snug break-words m-0">
                    {narrativeTitle}
                  </h3>
                </div>

                <div className="space-y-3 typo-body-sm sm:text-[14.5px] text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
                  {(activeMilestone.highlightText || activeMilestone.cardDescription) && (
                    <p className="break-words">
                      {activeMilestone.highlightText || activeMilestone.cardDescription}
                    </p>
                  )}

                  {storyParagraphs.map((para: string, pIdx: number) => (
                    <p key={pIdx} className="break-words">
                      {para}
                    </p>
                  ))}

                  <p className="font-bold text-[#1E1B4B] dark:text-[#F8FAFC] break-words pt-0.5">
                    {philosophyText}
                  </p>
                </div>
              </div>
            </section>

            {/* KHỐI 3: HÀNG 3 THẺ (01 QUẢN LÝ · 02 KẾT QUẢ & KPI · 03 CÔNG VIỆC) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[15px] items-stretch shrink-0">
              {/* 01 · Quản lý */}
              <section
                id="experience-management-card"
                data-subcard="true"
                className="exp-detail-card lg:col-span-4 rounded-[18px] p-4 shadow-sm flex flex-col gap-3 min-w-0"
              >
                <div className="flex items-center gap-2 pb-1 text-sky-600 dark:text-sky-400">
                  <WebIcon name="user-group" className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="text-[18px] font-bold tabular-nums text-sky-600 dark:text-sky-400">01</span>
                  <h3 className="card-title typo-h4 text-[17px] sm:text-[18px] font-bold font-play text-sky-600 dark:text-sky-400 m-0">
                    Quản lý
                  </h3>
                </div>

                <div className="space-y-2.5 flex-1 flex flex-col justify-start">
                  {/* 1. Quy mô quản lý */}
                  <div data-subcard="true" className="exp-detail-subcard rounded-[14px] p-3 flex items-center gap-3 min-w-0">
                    <div className="exp-icon-badge w-9 h-9 rounded-full border text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0 shadow-2xs">
                      <WebIcon name="user-group" className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[15px] sm:text-[16px] font-bold font-play text-sky-600 dark:text-sky-300 block">
                        Quy mô quản lý
                      </span>
                      <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[20px] font-black font-play tabular-nums text-sky-600 dark:text-sky-300 leading-none">
                          {activeMilestone.headcount}
                        </span>
                        <span className="typo-caption font-medium text-[#334155] dark:text-[#CBD5E1]">
                          nhân sự trực thuộc
                        </span>
                      </div>
                      {activeMilestone.scaleDesc && (
                        <span className="typo-caption text-[#475569] dark:text-[#CBD5E1] break-words block mt-0.5">
                          {activeMilestone.scaleDesc}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Chức danh quản trị */}
                  <div data-subcard="true" className="exp-detail-subcard p-3 rounded-[14px] flex items-center gap-3 min-w-0">
                    <div className="exp-icon-badge w-9 h-9 rounded-full border text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                      <WebIcon name="star" className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[15px] sm:text-[16px] font-bold font-play text-purple-600 dark:text-purple-300 block">
                        Chức danh quản trị
                      </span>
                      <span className="typo-body-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC] break-words block mt-0.5">
                        {activeMilestone.roleTitle}
                      </span>
                    </div>
                  </div>

                  {/* 3. Lĩnh vực */}
                  <div data-subcard="true" className="exp-detail-subcard rounded-[14px] p-3 flex items-center gap-3 min-w-0">
                    <div className="exp-icon-badge w-9 h-9 rounded-full border text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 shadow-2xs">
                      <WebIcon name="game" className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[15px] sm:text-[16px] font-bold font-play text-indigo-600 dark:text-indigo-300 block">
                        Lĩnh vực
                      </span>
                      <p className="typo-caption sm:typo-body-sm font-semibold text-[#1E1B4B] dark:text-[#E2E8F0] mt-0.5 break-words leading-snug">
                        {activeMilestone.industry}
                      </p>
                    </div>
                  </div>

                  {/* 4. Thời gian & Địa điểm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div data-subcard="true" className="exp-detail-subcard rounded-[14px] p-3 flex items-center gap-2.5 min-w-0">
                      <div className="exp-icon-badge w-8 h-8 rounded-full border text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0 shadow-2xs">
                        <WebIcon name="calendar" className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[15px] sm:text-[16px] font-bold font-play text-violet-600 dark:text-violet-300 block">
                          Thời gian
                        </span>
                        <p className="text-[14px] font-bold tabular-nums text-violet-600 dark:text-violet-300 mt-0.5 leading-tight break-words">
                          {activeMilestone.cardYearLabel}
                        </p>
                        <span className="typo-caption text-[#475569] dark:text-[#CBD5E1] block">
                          ({activeMilestone.tenure})
                        </span>
                      </div>
                    </div>

                    <div data-subcard="true" className="exp-detail-subcard rounded-[14px] p-3 flex items-center gap-2.5 min-w-0">
                      <div className="exp-icon-badge w-8 h-8 rounded-full border text-pink-600 dark:text-pink-300 flex items-center justify-center shrink-0 shadow-2xs">
                        <WebIcon name="map-pin" className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[15px] sm:text-[16px] font-bold font-play text-pink-600 dark:text-pink-300 block">
                          Địa điểm
                        </span>
                        <p className="typo-body-sm font-semibold text-[#1E1B4B] dark:text-[#F8FAFC] mt-0.5 break-words">
                          {activeMilestone.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 02 · Kết quả & KPI */}
              <section
                id="experience-stats-card"
                data-subcard="true"
                className="exp-detail-card lg:col-span-4 rounded-[18px] p-4 shadow-sm flex flex-col gap-3 min-w-0"
              >
                <div className="flex items-center gap-2 pb-1 text-emerald-600 dark:text-emerald-400">
                  <WebIcon name="trophy" className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[18px] font-bold tabular-nums text-emerald-600 dark:text-emerald-400">02</span>
                  <h3 className="card-title typo-h4 text-[17px] sm:text-[18px] font-bold font-play text-emerald-600 dark:text-emerald-400 m-0">
                    Kết quả &amp; KPI
                  </h3>
                </div>

                <div data-subcard="true" className="exp-detail-subcard p-3.5 rounded-[14px] space-y-3 flex-1">
                  {kpisList.map((kpi, kIdx) => (
                    <div key={kIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 typo-body-sm font-semibold">
                        <span className="text-[#1E293B] dark:text-[#E2E8F0] leading-snug break-words">
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

              {/* 03 · Công việc */}
              <section
                id="experience-responsibility-card"
                data-subcard="true"
                className="exp-detail-card md:col-span-2 lg:col-span-4 rounded-[18px] p-4 shadow-sm flex flex-col gap-3 min-w-0"
              >
                <div className="flex items-center gap-2 pb-1 text-purple-600 dark:text-purple-400">
                  <WebIcon name="briefcase" className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-[18px] font-bold tabular-nums text-purple-600 dark:text-purple-400">03</span>
                  <h3 className="card-title typo-h4 text-[17px] sm:text-[18px] font-bold font-play text-purple-600 dark:text-purple-400 m-0">
                    Công việc
                  </h3>
                </div>

                <div className="space-y-2 flex-1">
                  {tasksList.map((task, idx) => {
                    const cleanTask = task.replace(/^\d+\.\s*/, '');
                    return (
                      <div
                        key={idx}
                        data-subcard="true"
                        className="exp-detail-subcard flex items-center gap-2.5 px-3 py-2 rounded-full"
                      >
                        <span className="exp-icon-badge w-5 h-5 rounded-full text-purple-600 dark:text-purple-300 border font-mono font-bold typo-badge flex items-center justify-center shrink-0 tabular-nums">
                          {idx + 1}
                        </span>
                        <p className="typo-caption sm:typo-body-sm font-medium text-[#334155] dark:text-[#E2E8F0] leading-snug break-words min-w-0">
                          {cleanTask}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* KHỐI 4: HÀNG CUỐI (04 DỰ ÁN · 05 CAM KẾT · MINH HỌA CÚP TĂNG TRƯỞNG) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[15px] items-stretch shrink-0">
              {/* 04 · Dự án */}
              <section
                id="experience-achievement-card"
                data-subcard="true"
                className="exp-detail-card lg:col-span-4 rounded-[18px] p-4 shadow-sm flex flex-col gap-3 min-w-0"
              >
                <div className="flex items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-2 min-w-0 text-amber-600 dark:text-amber-400">
                    <WebIcon name="network" className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-[18px] font-bold tabular-nums text-amber-600 dark:text-amber-400">04</span>
                    <h3 className="card-title typo-h4 text-[17px] sm:text-[18px] font-bold font-play text-amber-600 dark:text-amber-400 truncate m-0">
                      Dự án
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      if (onNavigateTab) onNavigateTab(7);
                      else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                    }}
                    className="exp-icon-badge px-2.5 py-1 rounded-full hover:bg-amber-600 hover:text-white text-amber-800 dark:text-amber-300 font-bold typo-label border transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                    title="Chuyển đến trang Dự án"
                  >
                    <span>Xem Dự án</span>
                    <WebIcon name="arrow-up-right" className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1">
                  {projectsList.map((proj, idx) => (
                    <div
                      key={idx}
                      data-subcard="true"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(7);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          SoundEngine.playTap();
                          if (onNavigateTab) onNavigateTab(7);
                          else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                        }
                      }}
                      className="exp-detail-subcard flex items-center gap-2 px-3 py-1.5 rounded-[10px] hover:border-amber-500/60 transition-all cursor-pointer group/proj"
                      title="Click để xem chi tiết trang Dự án"
                    >
                      <WebIcon name="folder" className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="typo-caption sm:typo-body-sm font-semibold text-[#334155] dark:text-[#E2E8F0] leading-snug break-words group-hover/proj:text-amber-600 dark:group-hover/proj:text-amber-300">
                        {proj.title}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 05 · Cam kết */}
              <section
                id="experience-commitments-card"
                data-subcard="true"
                className="exp-detail-card lg:col-span-4 rounded-[18px] p-4 shadow-sm flex flex-col gap-3 min-w-0"
              >
                <div className="flex items-center gap-2 pb-1 text-cyan-600 dark:text-cyan-400">
                  <WebIcon name="shield-check" className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="text-[18px] font-bold tabular-nums text-cyan-600 dark:text-cyan-400">05</span>
                  <h3 className="card-title typo-h4 text-[17px] sm:text-[18px] font-bold font-play text-cyan-600 dark:text-cyan-400 m-0">
                    Cam kết
                  </h3>
                </div>

                <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                  {commitmentsList.map((cmtText, cIdx) => (
                    <div
                      key={cIdx}
                      data-subcard="true"
                      className="exp-detail-subcard p-3 rounded-[14px] flex items-start gap-2.5"
                    >
                      <div className="exp-icon-badge w-7 h-7 rounded-full border text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                        <WebIcon name="shield-check" className="w-4 h-4" />
                      </div>
                      <span className="typo-body-sm font-medium text-[#334155] dark:text-[#E2E8F0] leading-snug break-words">
                        {cmtText}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Khối minh họa 3D Cúp Vàng & Bệ Tăng Trưởng (bên phải) */}
              <div data-subcard="true" className="exp-detail-card md:col-span-2 lg:col-span-4 rounded-[18px] p-4 flex items-center justify-center relative overflow-hidden min-h-[210px]">
                <svg
                  viewBox="0 0 320 220"
                  className="w-full max-w-[280px] h-auto drop-shadow-[0_14px_24px_rgba(37,99,235,0.18)]"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="exp-trophy-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="exp-trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="45%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                    <linearGradient id="exp-bar-top" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="100%" stopColor="#93C5FD" />
                    </linearGradient>
                    <linearGradient id="exp-bar-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>
                    <linearGradient id="exp-arrow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="160" cy="186" rx="122" ry="22" fill="url(#exp-trophy-glow)" />
                  {/* Cột 1 */}
                  <rect x="64" y="142" width="44" height="44" rx="6" fill="url(#exp-bar-top)" opacity="0.85" />
                  {/* Cột 2 */}
                  <rect x="114" y="122" width="46" height="64" rx="6" fill="url(#exp-bar-top)" />
                  {/* Cột 3 chính giữa */}
                  <rect x="166" y="132" width="52" height="54" rx="6" fill="url(#exp-bar-dark)" />
                  {/* Cột 4 */}
                  <rect x="224" y="148" width="40" height="38" rx="6" fill="url(#exp-bar-top)" opacity="0.9" />
                  {/* Mũi tên tăng trưởng */}
                  <path
                    d="M52 150 C96 144, 158 118, 246 72 L236 62 L272 58 L258 92 L250 82 C164 128, 102 152, 54 156 Z"
                    fill="url(#exp-arrow-grad)"
                    opacity="0.92"
                  />
                  {/* Đế cúp */}
                  <rect x="142" y="114" width="38" height="12" rx="4" fill="#1E40AF" />
                  <rect x="148" y="106" width="26" height="9" rx="3" fill="url(#exp-trophy-gold)" />
                  {/* Thân & Quai cúp */}
                  <path
                    d="M138 56 C122 56, 120 82, 138 86"
                    fill="none"
                    stroke="url(#exp-trophy-gold)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M184 56 C200 56, 202 82, 184 86"
                    fill="none"
                    stroke="url(#exp-trophy-gold)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M136 44 H186 L181 78 C179 94, 169 102, 161 102 C153 102, 143 94, 141 78 Z"
                    fill="url(#exp-trophy-gold)"
                  />
                  <ellipse cx="161" cy="44" rx="25" ry="5" fill="#FEF3C7" />
                  <path d="M148 54 C149 70, 152 82, 155 88" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" opacity="0.65" fill="none" />
                </svg>
              </div>
            </div>

            {/* KHỐI 4.5: CARD SẢN PHẨM & HỆ SINH THÁI DỊCH VỤ */}
            <section
              id="experience-products-card"
              data-subcard="true"
              className="exp-detail-card w-full rounded-[18px] p-4 shadow-sm flex flex-col gap-3 shrink-0 min-w-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <div className="flex items-center gap-2 min-w-0 flex-wrap text-indigo-600 dark:text-indigo-400">
                  <WebIcon name="shopping-bag" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-[18px] font-bold tabular-nums text-indigo-600 dark:text-indigo-400">06</span>
                  <h3 className="card-title typo-h4 text-[17px] sm:text-[18px] font-bold font-play text-indigo-600 dark:text-indigo-400 m-0">
                    Sản phẩm
                  </h3>
                  <span className="exp-icon-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-indigo-700 dark:text-indigo-200 border typo-badge font-bold tabular-nums">
                    {rawProductsList.length} sản phẩm
                  </span>
                  {productSummaryText && (
                    <span className="typo-caption font-medium text-[#475569] dark:text-[#CBD5E1] break-words">
                      · {productSummaryText}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    if (onNavigateTab) onNavigateTab(4);
                    else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                  }}
                  className="exp-icon-badge px-2.5 py-1 rounded-full hover:bg-indigo-600 hover:text-white text-indigo-800 dark:text-indigo-300 font-bold typo-label border transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                  title="Chuyển đến trang Lĩnh vực / Dịch vụ"
                >
                  <span>Xem Dịch vụ</span>
                  <WebIcon name="arrow-up-right" className="w-3 h-3" />
                </button>
              </div>

              <div
                className={cn(
                  'grid gap-2.5 w-full',
                  rawProductsList.length === 1
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : rawProductsList.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : rawProductsList.length <= 4
                        ? 'grid-cols-2 sm:grid-cols-4'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                )}
              >
                {rawProductsList.map((prod, pIdx) => (
                  <div
                    key={pIdx}
                    data-subcard="true"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      SoundEngine.playTap();
                      if (onNavigateTab) onNavigateTab(4);
                      else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(4);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                      }
                    }}
                    title={`${prod.name} — Click để xem chi tiết lĩnh vực & dịch vụ`}
                    className="exp-detail-subcard rounded-[14px] p-3 hover:border-indigo-500/70 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-3 min-w-0 group/prod"
                  >
                    <div className="w-11 h-11 rounded-[10px] bg-white border border-indigo-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                      <img
                        src={prod.src}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover/prod:scale-105 transition-transform"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = activeMilestone.logo;
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="typo-body-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC] block leading-tight break-words group-hover/prod:text-indigo-700 dark:group-hover/prod:text-indigo-300">
                        {prod.name}
                      </span>
                      <span className="typo-label text-[#475569] dark:text-[#CBD5E1] block leading-tight mt-0.5 truncate">
                        {activeMilestone.tag}
                      </span>
                    </div>
                  </div>
                ))}

                {rawProductsList.length === 1 && (
                  <div
                    data-subcard="true"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      SoundEngine.playTap();
                      if (onNavigateTab) onNavigateTab(4);
                      else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(4);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                      }
                    }}
                    className="exp-detail-subcard rounded-[14px] p-3 border-dashed hover:border-indigo-500 transition-all cursor-pointer flex items-center gap-3 min-w-0"
                  >
                    <div className="exp-icon-badge w-11 h-11 rounded-[10px] border text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                      <WebIcon name="layers" className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[15px] sm:text-[16px] font-bold font-play text-indigo-600 dark:text-indigo-300 block">
                        Hệ sinh thái &amp; Lĩnh vực vận hành
                      </span>
                      <span className="typo-body-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC] block leading-snug break-words mt-0.5">
                        {activeMilestone.industry}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* KHỐI 5: THANH TRÍCH DẪN TRIẾT LÝ QUẢN TRỊ Ở ĐÁY */}
            <section data-subcard="true" className="exp-detail-card w-full rounded-[18px] px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between gap-4 relative overflow-hidden shrink-0">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md flex items-center justify-center shrink-0">
                  <WebIcon name="quote" className="w-5 h-5" />
                </div>
                <p className="typo-body-sm sm:text-[15px] font-semibold text-[#312E81] dark:text-[#E0E7FF] leading-relaxed break-words min-w-0">
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
            role="dialog"
            aria-modal="true"
            aria-label={`Thư viện ảnh ${activeMilestone.company}`}
            onClick={() => setIsPhotoLightboxOpen(false)}
            className="fixed inset-0 z-[9999] bg-[#0B1220]/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full rounded-[14px] overflow-hidden bg-[#111827] border border-[#334155] shadow-2xl relative"
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1F2937]/85 hover:bg-[#4338CA] text-white flex items-center justify-center cursor-pointer border border-white/15 transition-colors"
                    >
                      <WebIcon name="chevron-left" className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCarouselSlideIdx((prev) => (prev + 1) % lightboxPhotos.length)
                      }
                      aria-label="Ảnh tiếp theo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1F2937]/85 hover:bg-[#4338CA] text-white flex items-center justify-center cursor-pointer border border-white/15 transition-colors"
                    >
                      <WebIcon name="chevron-right" className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label="Đóng trình xem ảnh"
                  onClick={() => setIsPhotoLightboxOpen(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1F2937]/85 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-sm cursor-pointer border border-white/15"
                >
                  <WebIcon name="cancel" className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 bg-[#111827] text-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="typo-h5 font-bold text-[#F8FAFC] truncate">
                      {curPhoto.title || activeMilestone.company}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#1F2937] border border-[#334155] typo-badge font-mono font-bold text-[#A5B4FC] shrink-0">
                      {carouselSlideIdx + 1}/{lightboxPhotos.length}
                    </span>
                  </div>
                  <p className="typo-caption text-[#94A3B8] mt-1">
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
                          idx === carouselSlideIdx ? 'bg-[#A5B4FC] scale-125' : 'bg-white/30 hover:bg-white/60'
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
