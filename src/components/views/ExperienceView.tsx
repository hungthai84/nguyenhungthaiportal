'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speakSiteText, stopActiveSpeech } from '@/utils/speechVoice';
// Icons migrated to WebIcon (Hugeicons)
import { motion, AnimatePresence } from 'motion/react';
import { EXPERIENCE_MILESTONES } from '@/data/experience';
import { MEMORIES_DATA } from '@/data/memories';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn, formatCardTitle, formatSentenceFourWords } from '@/lib/utils';
import { getCategoryTheme } from '@/utils/categoryTheme';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showJobCard) {
        setShowJobCard(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobCard]);
  const [hoveredMilestoneKey, setHoveredMilestoneKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [carouselSlideIdx, setCarouselSlideIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState<boolean>(false);
  const [featuredProdPage, setFeaturedProdPage] = useState<number>(0);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

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
            className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-hidden relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
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

          <div
            id="experience-timeline-track-card"
            ref={horizontalTrackRef}
            style={{
              borderRadius: '14px',
              backgroundColor: 'transparent',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
            }}
            className="w-full flex-1 min-h-0 rounded-[14px] bg-transparent border-0 shadow-none overflow-x-auto overflow-y-auto custom-scrollbar pb-4 pt-2 px-3 relative flex flex-row gap-5 items-stretch transition-all duration-300 snap-x"
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

                      {/* TIER 3: Soft Pastel Info Card (Banner is now inside at the top, replacing circular logo) */}
                      <div
                        onClick={() => handleOpenJobCard(item.key)}
                        style={{
                          ...cardSampleStyle,
                          borderRadius: '14px',
                          padding: '12px',
                          backgroundColor: isDark ? 'transparent' : undefined,
                          backgroundImage: isDark
                            ? `radial-gradient(circle at top right, ${item.primaryColor}22 0%, transparent 70%), linear-gradient(160deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)`
                            : item.cardBg,
                          borderColor: isDark
                            ? isSelected
                              ? item.primaryColor
                              : 'rgba(255, 255, 255, 0.16)'
                            : undefined,
                          ['--card-accent-color' as string]: item.primaryColor,
                        }}
                        className={`theme-pastel-card w-full flex-1 rounded-[14px] p-3 border backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-stretch text-center justify-between gap-2.5 relative group ${
                          !isDark ? item.borderColor : ''
                        } ${
                          isSelected
                            ? `ring-2 ${item.activeRing} shadow-[0_14px_34px_-4px_rgba(30,27,75,0.18)] dark:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.7),0_0_20px_${item.glowColor}] -translate-y-0.5`
                            : 'shadow-[0_8px_24px_-4px_rgba(30,27,75,0.08),0_2px_8px_rgba(15,23,42,0.04)] dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.65)] hover:shadow-[0_16px_36px_-4px_rgba(30,27,75,0.16)]'
                        } ${isHighlightedInStory ? 'ring-2 ring-amber-400 shadow-md' : ''}`}
                      >
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
                        <div className="w-full flex items-center justify-start gap-2.5 shrink-0 p-2.5 rounded-[12px] bg-white/75 dark:bg-slate-900/60 border border-black/5 dark:border-white/10 text-left">
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
                              className="typo-body font-bold font-play tracking-tight line-clamp-2 whitespace-normal break-words leading-snug w-full"
                              style={{ color: isDark ? (isSelected ? '#38bdf8' : '#f8fafc') : item.primaryColor, fontWeight: 700 }}
                              title={item.shortName}
                            >
                              {item.shortName}
                            </h4>
                          </div>
                        </div>

                        <div className="w-full flex flex-col items-start gap-1 shrink-0 p-2.5 rounded-[12px] bg-white/75 dark:bg-slate-900/60 border border-black/5 dark:border-white/10">
                          <div className="typo-body-sm font-bold text-[#475569] dark:text-[#94A3B8] flex items-center gap-1.5">
                            <WebIcon name="shopping-bag" className="w-3.5 h-3.5 shrink-0 text-sky-500" />
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

                        <div className="w-full flex flex-col items-start justify-start gap-1.5 shrink-0 p-2.5 rounded-[12px] bg-white/75 dark:bg-slate-900/60 border border-black/5 dark:border-white/10 text-left">
                          <div className="flex items-center justify-start gap-1.5 typo-body-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate w-full text-left">
                            <WebIcon name="briefcase" className="w-3.5 h-3.5 shrink-0" style={{ color: item.primaryColor }} />
                            <span className="truncate">{item.roleSummary}</span>
                          </div>

                          <div className="flex items-center justify-start gap-1.5 typo-body-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate w-full text-left">
                            <WebIcon name="user-group" className="w-3.5 h-3.5 shrink-0" style={{ color: item.primaryColor }} />
                            <span className="truncate">Quản lý: {item.headcountLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </>
      )}

      {/* =====================================================================
          5. THẺ CHI TIẾT CỘT MỐC ĐANG CHỌN (TỐI ƯU HÓA TOÀN DIỆN CHO TẤT CẢ CỘT MỐC)
          ===================================================================== */}
      {showJobCard && (() => {
        const isVedMilestone = activeKey === '2013' || activeKey.startsWith('2013');
        const contentKey = (activeKey === '2014' || activeKey === '2015' || activeKey.startsWith('2013') || activeKey === '2014-airpay') ? '2013' : activeKey;
        const customContent = MILESTONE_CUSTOM_CONTENT[contentKey] || MILESTONE_CUSTOM_CONTENT['2013'];

        // Lĩnh vực hoạt động lấy trực tiếp từ activeMilestone.industry (hoặc domains dự phòng)
        const domainsList = activeMilestone.industry
          ? activeMilestone.industry
              .split('/')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((label) => {
                const lower = label.toLowerCase();
                const icon = lower.includes('game') || lower.includes('esport')
                  ? '🎮'
                  : lower.includes('tmđt') || lower.includes('e-commerce') || lower.includes('shopee')
                  ? '🛒'
                  : lower.includes('fintech') || lower.includes('ví') || lower.includes('tài chính') || lower.includes('thanh toán')
                  ? '💳'
                  : lower.includes('bảo hiểm')
                  ? '🛡️'
                  : lower.includes('viễn thông') || lower.includes('internet') || lower.includes('truyền hình') || lower.includes('truyền thông')
                  ? '📡'
                  : lower.includes('bưu chính')
                  ? '📦'
                  : lower.includes('công nghệ') || lower.includes('crm') || lower.includes('chuyển đổi số')
                  ? '🤖'
                  : '🎧';
                return { icon, label };
              })
          : activeMilestone.domains && activeMilestone.domains.length > 0
          ? activeMilestone.domains.slice(0, 6).map((d) => ({
              icon: d.tag === 'TeleCom' ? '📡' : d.tag === 'Inbound' ? '🎧' : d.tag === 'Escalation' ? '⚡' : d.tag === 'FinTech' ? '💳' : d.tag === 'Coaching' ? '👥' : '🎯',
              label: d.title,
            }))
          : [
              { icon: '🎯', label: 'Chăm sóc khách hàng' },
              { icon: '⚙️', label: 'Vận hành hệ thống' },
              { icon: '📊', label: 'Kiểm soát chất lượng' },
              { icon: '👥', label: 'Đào tạo đội ngũ' },
            ];

        interface BrandBadgeItem {
          name: string;
          logo?: string;
          isCustomLogo?: boolean;
          textBadge?: boolean;
          textColor?: string;
        }

        // Các thương hiệu tiêu biểu & sản phẩm trực thuộc cột mốc
        const matchedRoadmap = roadmapCards.find((r) => r.key === activeKey);
        const milestoneProducts = (activeMilestone.products && activeMilestone.products.length > 0)
          ? activeMilestone.products.map((p: any) => ({
              name: p.name || p.alt || activeMilestone.company,
              logo: p.logo || p.src || activeMilestone.logo,
            }))
          : (matchedRoadmap?.products || []);

        const brandsList: BrandBadgeItem[] = isVedMilestone
          ? [
              { name: 'VED', logo: 'https://i.ibb.co/fYPJLfbw/VED.png', isCustomLogo: true },
              { name: 'Garena', logo: 'https://i.ibb.co/h1Md65yV/Garena.png', isCustomLogo: true },
              { name: 'Shopee', logo: 'https://i.ibb.co/BSVS4xf/Shopee.png', isCustomLogo: true },
              { name: 'ShopeePay', logo: 'https://i.ibb.co/LdYv3TJy/Shopee-Paye.png', isCustomLogo: true },
              { name: 'GCafe', logo: 'https://i.ibb.co/FkWk3s4W/GCafe.png', isCustomLogo: true },
              { name: 'LMHT & LQMB', textBadge: true, textColor: 'text-amber-700 dark:text-amber-400' },
            ]
          : milestoneProducts.length > 0
          ? milestoneProducts.map((p: any) => ({
              name: p.name || activeMilestone.company,
              logo: p.logo || activeMilestone.logo,
              isCustomLogo: true,
            }))
          : [
              { name: activeMilestone.company, logo: activeMilestone.logo, isCustomLogo: true },
            ];

        // Helper lọc bỏ logo công ty khỏi bộ sưu tập Hình ảnh kỷ niệm
        const isCompanyLogoAsset = (url?: string) => {
          if (!url) return false;
          if (activeMilestone.logo && url === activeMilestone.logo) return true;
          return /logo_|_logo|\/logo\//i.test(url);
        };

        // Danh sách hình ảnh kỷ niệm thực tế (đã loại bỏ hoàn toàn logo công ty)
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
        const photosList = [
          ...primaryMemoryPhoto,
          ...basePhotos.filter((p) => p.src !== safeMemoryImg),
        ];

        // Danh sách Mô tả công việc lấy trực tiếp từ activeMilestone.tasks
        const tasksList =
          activeMilestone.tasks && activeMilestone.tasks.length > 0
            ? activeMilestone.tasks
            : [
                'Quản lý và điều hành toàn diện hoạt động phòng CSKH',
                'Thiết lập chỉ số KPI/SLA và cơ chế giám sát chất lượng',
                'Tối ưu hóa quy trình tiếp nhận và xử lý khiếu nại',
              ];

        // Danh sách Dự án trọng điểm lấy trực tiếp từ activeMilestone.projects
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

        // Danh sách Cam kết chất lượng lấy trực tiếp từ activeMilestone.commitments
        const commitmentsList =
          activeMilestone.commitments && activeMilestone.commitments.length > 0
            ? activeMilestone.commitments
            : customContent.commitments.map((c) => `${c.title}: ${c.desc}`);

        // Danh sách Kết quả KPI lấy trực tiếp từ activeMilestone.kpis
        const kpisList =
          activeMilestone.kpis && activeMilestone.kpis.length > 0
            ? activeMilestone.kpis.map((k, idx) => ({
                label: k.label,
                percent: k.percent,
                displayValue: k.displayValue || `${k.percent}%`,
                barColor: idx === 2 ? 'bg-indigo-600' : 'bg-emerald-500',
              }))
            : [
                { label: 'Tiêu chuẩn chất lượng SOP', percent: 100, displayValue: '100%', barColor: 'bg-emerald-500' },
                { label: 'Tỷ lệ giải quyết FCR', percent: 92, displayValue: '92%', barColor: 'bg-emerald-500' },
                { label: 'Mức độ hài lòng CSAT', percent: 98, displayValue: '98%', barColor: 'bg-indigo-600' },
              ];

        // Danh sách Giới thiệu (3 trụ cột + Triết Lý Quản Trị)
        const introPillars =
          activeMilestone.intro && activeMilestone.intro.length > 0
            ? activeMilestone.intro
            : customContent.pillars.slice(0, 3).map((p) => ({ title: p.title, desc: p.desc }));

        const philosophyText =
          activeMilestone.philosophy ||
          'Khách hàng là trung tâm — Kiến tạo giá trị dịch vụ bền vững và chuẩn hóa vận hành xuất sắc.';

        return (
          <div
            id="experience-job-detail-card"
            style={{
              ...cardSampleStyle,
              borderRadius: '14px',
              padding: '15px',
            }}
            className="w-full h-full flex-1 min-h-0 flex flex-col justify-between rounded-[14px] border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-xl relative overflow-hidden gap-[15px] text-left transition-all duration-300 animate-fadeIn font-play p-[15px]"
          >
            {/* Header Bar: Icon không đóng khung cùng màu H3 + Nhãn thời gian + Nút Đóng X */}
            <div className="w-full flex items-center justify-between gap-3 shrink-0 pb-3 border-b border-[#E2E8F0] dark:border-[#334155] relative z-10 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap">
                <WebIcon name="briefcase" className="w-5 h-5 text-[#4338CA] dark:text-[#A5B4FC] shrink-0" />

                <h3
                  className="typo-h3 font-bold font-play leading-snug tracking-tight text-[#4338CA] dark:text-[#A5B4FC] flex items-center gap-1.5 whitespace-normal break-words"
                  title={`Chi tiết công tác — ${activeMilestone.company}`}
                >
                  <span>Chi tiết công tác</span>
                </h3>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold border bg-[#EEF2FF] dark:bg-[#1F2937] border-[#CBD5E1] dark:border-[#334155] text-[#4338CA] dark:text-[#A5B4FC] shrink-0">
                  <span>{activeMilestone.company}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold border bg-[#EEF2FF] dark:bg-[#1F2937] border-[#CBD5E1] dark:border-[#334155] text-[#1E1B4B] dark:text-[#E2E8F0] shrink-0">
                  <span>{activeMilestone.period} • {activeMilestone.headcount ? `${activeMilestone.headcount} nhân sự` : activeMilestone.scaleDesc}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    SoundEngine.playTap();
                    setShowJobCard(false);
                  }}
                  className="w-8 h-8 rounded-full bg-[#E2E8F0]/90 dark:bg-[#1F2937] hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-[#334155] dark:text-[#E2E8F0] transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 border border-[#CBD5E1] dark:border-[#334155]"
                  title="Đóng thẻ (Esc)"
                >
                  <WebIcon name="cancel" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Responsive Multicolor Bento Grid Container */}
            <div className="w-full flex-1 min-h-0 overflow-y-auto glass-scrollbar pr-0.5">
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-[15px] items-stretch">

                {/* BENTO 01: THÔNG TIN TỔNG QUAN (Indigo Pastel Mica) */}
                <section
                  id="experience-info-card"
                  data-multicolor-bento="true"
                  className="bento-tone-indigo md:col-span-6 lg:col-span-7 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#4338CA]/15 dark:border-[#A5B4FC]/20">
                    <div className="flex items-center gap-2 min-w-0 text-[#4338CA] dark:text-[#A5B4FC]">
                      <WebIcon name="building-2" className="w-4.5 h-4.5 shrink-0 text-[#4338CA] dark:text-[#A5B4FC]" />
                      <h3 className="typo-h3 font-bold font-play leading-tight break-words text-[#4338CA] dark:text-[#A5B4FC]">
                        Thông tin tổng quan
                      </h3>
                    </div>
                    {activeMilestone.code && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/85 dark:bg-[#1F2937] text-[#4338CA] dark:text-[#A5B4FC] border border-[#4338CA]/25 dark:border-[#A5B4FC]/30 typo-badge font-mono font-bold shrink-0">
                        Mốc {activeMilestone.code}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 min-w-0">
                    <div
                      style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                      className="w-16 h-16 aspect-square rounded-full bg-white dark:bg-[#111827] border border-[#CBD5E1] dark:border-[#334155] shadow-sm p-1 overflow-hidden flex items-center justify-center shrink-0"
                    >
                      <img
                        src={activeMilestone.logo}
                        alt={activeMilestone.company}
                        style={{ borderRadius: '50%' }}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="typo-h4 font-bold font-play text-[#1E1B4B] dark:text-[#F8FAFC] leading-snug break-words">
                        {activeMilestone.company}
                      </h4>
                      {activeMilestone.subCompanies && (
                        <p className="typo-caption font-semibold text-[#475569] dark:text-[#94A3B8] break-words">
                          {activeMilestone.subCompanies}
                        </p>
                      )}
                      <p className="typo-body-sm font-bold text-[#075985] dark:text-[#7DD3FC] flex items-center gap-1.5 flex-wrap break-words">
                        <WebIcon name="briefcase" className="w-3.5 h-3.5 shrink-0" />
                        <span>{activeMilestone.roleTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-[12px] bg-white/80 dark:bg-[#1F2937]/85 border border-[#CBD5E1]/70 dark:border-[#334155] min-w-0">
                      <span className="typo-label font-semibold text-[#475569] dark:text-[#94A3B8] block">Thời gian công tác</span>
                      <span className="typo-body-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC] mt-0.5 block break-words">
                        {activeMilestone.period}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white/80 dark:bg-[#1F2937]/85 border border-[#CBD5E1]/70 dark:border-[#334155] min-w-0">
                      <span className="typo-label font-semibold text-[#475569] dark:text-[#94A3B8] block">Quy mô phụ trách</span>
                      <span className="typo-body-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC] mt-0.5 block break-words">
                        {activeMilestone.headcount ? `${activeMilestone.headcount} nhân sự` : activeMilestone.scaleDesc}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white/80 dark:bg-[#1F2937]/85 border border-[#CBD5E1]/70 dark:border-[#334155] min-w-0">
                      <span className="typo-label font-semibold text-[#475569] dark:text-[#94A3B8] block">Địa điểm &amp; Thâm niên</span>
                      <span className="typo-body-sm font-bold text-[#1E1B4B] dark:text-[#F8FAFC] mt-0.5 block break-words">
                        {activeMilestone.location} • {activeMilestone.tenure}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="typo-body-sm text-[#334155] dark:text-[#E2E8F0] leading-relaxed break-words">
                      {activeMilestone.highlightText || activeMilestone.cardDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {domainsList.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2.5 py-1 rounded-[12px] bg-white/85 dark:bg-[#1F2937] border border-[#CBD5E1]/80 dark:border-[#334155] flex items-center gap-1.5 typo-badge font-bold text-[#075985] dark:text-[#7DD3FC]"
                        >
                          <span className="shrink-0">{d.icon}</span>
                          <span className="break-words">{d.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* BENTO CARD RIÊNG 01: BANNER NHẬN DIỆN ĐƠN VỊ CÔNG TÁC (Cyan Pastel Mica) */}
                <section
                  id="experience-banner-card"
                  data-multicolor-bento="true"
                  className="bento-tone-cyan md:col-span-6 lg:col-span-5 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#0E7490]/15 dark:border-[#67E8F9]/20">
                    <div className="flex items-center gap-2 min-w-0 text-[#0E7490] dark:text-[#67E8F9]">
                      <WebIcon name="flag" className="w-4.5 h-4.5 shrink-0 text-[#0E7490] dark:text-[#67E8F9]" />
                      <h3 className="typo-h3 font-bold font-play leading-tight break-words text-[#0E7490] dark:text-[#67E8F9]">
                        Nhận diện đơn vị
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/85 dark:bg-[#1F2937] text-[#0E7490] dark:text-[#67E8F9] border border-[#0E7490]/25 dark:border-[#67E8F9]/30 typo-badge font-mono font-bold shrink-0">
                      {activeMilestone.period}
                    </span>
                  </div>

                  <div className="rounded-[12px] text-white p-4 shadow-md flex flex-col justify-end relative overflow-hidden flex-1 min-h-[200px] group/banner border border-white/25">
                    <img
                      src={activeMilestone.bannerUrl || 'https://i.ibb.co/Xr7hKN4v/Kinh-nghi-m.png'}
                      alt={activeMilestone.company}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = 'https://i.ibb.co/Xr7hKN4v/Kinh-nghi-m.png';
                        if (target.src !== fallback) target.src = fallback;
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover/banner:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/45 to-[#0B1220]/15" />
                    <div className="relative z-10 space-y-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md typo-badge font-mono font-bold text-white">
                        {activeMilestone.period}
                      </span>
                      <h4 className="typo-h4 font-bold font-play text-white leading-snug break-words">
                        {activeMilestone.company}
                      </h4>
                      <p className="typo-caption text-white/90 font-medium break-words">
                        {activeMilestone.scaleDesc}
                      </p>
                    </div>
                  </div>
                </section>

                {/* BENTO CARD RIÊNG 02: HÌNH ẢNH KỶ NIỆM THỰC TẾ (Sky Pastel Mica - Tách riêng khỏi Banner) */}
                <section
                  id="experience-memories-card"
                  data-multicolor-bento="true"
                  className="bento-tone-sky md:col-span-6 lg:col-span-12 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#0369A1]/15 dark:border-[#7DD3FC]/20">
                    <div className="flex items-center gap-2 min-w-0 text-[#0369A1] dark:text-[#7DD3FC]">
                      <WebIcon name="image" className="w-4.5 h-4.5 shrink-0 text-[#0369A1] dark:text-[#7DD3FC]" />
                      <h3 className="typo-h3 font-bold font-play leading-tight break-words text-[#0369A1] dark:text-[#7DD3FC]">
                        Hình ảnh kỷ niệm
                      </h3>
                    </div>
                    {photosList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCarouselSlideIdx(0);
                          setIsPhotoLightboxOpen(true);
                        }}
                        className="px-3 py-1 rounded-full bg-white/90 dark:bg-[#1F2937] typo-button font-bold text-[#0369A1] dark:text-[#7DD3FC] border border-[#0369A1]/25 dark:border-[#7DD3FC]/30 hover:bg-[#0369A1] hover:text-white transition cursor-pointer shrink-0"
                      >
                        Phóng to ({photosList.length} ảnh)
                      </button>
                    )}
                  </div>

                  {photosList.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                      <div
                        onClick={() => {
                          setCarouselSlideIdx(0);
                          setIsPhotoLightboxOpen(true);
                        }}
                        className={cn(
                          'rounded-[12px] overflow-hidden relative cursor-pointer group shadow-inner bg-[#0B1220] border border-[#CBD5E1]/60 dark:border-[#334155] min-h-[200px]',
                          photosList.length > 1 ? 'lg:col-span-5 h-52 sm:h-60' : 'lg:col-span-12 h-56 sm:h-64'
                        )}
                      >
                        <img
                          src={photosList[0]?.src}
                          alt={photosList[0]?.title || activeMilestone.company}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/85 via-[#0B1220]/20 to-transparent flex flex-col justify-end p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="typo-body-sm font-bold text-white font-play truncate">
                              {photosList[0]?.title || activeMilestone.company}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md typo-badge font-mono font-bold text-white shrink-0">
                              1/{photosList.length}
                            </span>
                          </div>
                          <span className="typo-caption text-[#E2E8F0] truncate">
                            {photosList[0]?.desc || 'Khoảnh khắc kỷ niệm công tác'}
                          </span>
                        </div>
                      </div>

                      {photosList.length > 1 && (
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 content-start">
                          {photosList.map((photo, pIdx) => (
                            <button
                              key={`${photo.src}-${pIdx}`}
                              type="button"
                              onClick={() => {
                                SoundEngine.playTap();
                                setCarouselSlideIdx(pIdx);
                                setIsPhotoLightboxOpen(true);
                              }}
                              title={photo.title || `Ảnh kỷ niệm ${pIdx + 1}`}
                              className="relative aspect-[4/3] rounded-[10px] overflow-hidden bg-[#0B1220] border border-white/50 dark:border-[#334155] hover:border-[#0369A1] dark:hover:border-[#7DD3FC] shadow-xs cursor-pointer group/thumb transition-all"
                            >
                              <img
                                src={photo.src}
                                alt={photo.title || `Ảnh kỷ niệm ${pIdx + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#0B1220]/75 text-white typo-badge font-mono font-bold">
                                {pIdx + 1}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-[12px] bg-white/80 dark:bg-[#1F2937]/80 border border-[#CBD5E1] dark:border-[#334155] typo-body-sm text-[#475569] dark:text-[#94A3B8]">
                      Chưa có ảnh hoạt động tập thể riêng cho mốc này.
                    </div>
                  )}
                </section>

                {/* BENTO 02: VAI TRÒ, TRÁCH NHIỆM & TRIẾT LÝ QUẢN TRỊ (Purple Pastel Mica) */}
                <section
                  data-multicolor-bento="true"
                  className="bento-tone-purple md:col-span-6 lg:col-span-7 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-[#6D28D9]/15 dark:border-[#A5B4FC]/20 text-[#6D28D9] dark:text-[#C4B5FD]">
                    <WebIcon name="shield" className="w-4.5 h-4.5 shrink-0 text-[#6D28D9] dark:text-[#C4B5FD]" />
                    <h3 className="typo-h3 font-bold font-play leading-tight break-words text-[#6D28D9] dark:text-[#C4B5FD]">
                      Vai trò trách nhiệm
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 items-stretch">
                    {introPillars.map((item: { title: string; desc: string }, pIdx: number) => {
                      const styleConfigs = [
                        { icon: 'user-check', color: 'text-[#BE185D] dark:text-[#FDA4AF]', bg: 'bg-white/85 dark:bg-[#1F2937]/85 border-[#F9A8D4]/50 dark:border-[#334155]' },
                        { icon: 'headphones', color: 'text-[#075985] dark:text-[#7DD3FC]', bg: 'bg-white/85 dark:bg-[#1F2937]/85 border-[#93C5FD]/50 dark:border-[#334155]' },
                        { icon: 'shield', color: 'text-[#047857] dark:text-[#6EE7B7]', bg: 'bg-white/85 dark:bg-[#1F2937]/85 border-[#6EE7B7]/50 dark:border-[#334155]' },
                      ];
                      const cfg = styleConfigs[pIdx % styleConfigs.length];
                      return (
                        <div key={pIdx} className={`flex flex-col gap-1.5 p-3 rounded-[12px] border ${cfg.bg} min-w-0`}>
                          <div className="flex items-center gap-2">
                            <WebIcon name={cfg.icon} className={cn('w-4 h-4 shrink-0', cfg.color)} />
                            <span className={`typo-body-sm font-bold font-play leading-snug break-words ${cfg.color}`} title={item.title}>
                              {formatSentenceFourWords(item.title)}
                            </span>
                          </div>
                          <p className="typo-caption text-[#334155] dark:text-[#E2E8F0] leading-relaxed break-words">
                            {item.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {(() => {
                    const activeCategoryTheme = getCategoryTheme(activeMilestone?.company || 'MobiFone');
                    const philosophyColor = isDark ? '#C4B5FD' : activeCategoryTheme.color;
                    return (
                      <div className="p-3 rounded-[12px] bg-white/85 dark:bg-[#1F2937]/90 border border-[#C4B5FD]/60 dark:border-[#334155] flex items-start gap-2.5">
                        <WebIcon name="heart-handshake" className="w-4 h-4 shrink-0 mt-0.5" style={{ color: philosophyColor }} />
                        <div className="min-w-0 flex-1">
                          <span className="typo-body-sm font-bold font-play block" style={{ color: philosophyColor }}>
                            Triết lý quản trị
                          </span>
                          <p className="typo-body-sm text-[#334155] dark:text-[#E2E8F0] font-medium leading-relaxed mt-0.5 break-words">
                            {philosophyText}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </section>

                {/* BENTO 04: THÀNH TỰU VÀ KPI (Emerald Pastel Mica) */}
                <section
                  id="experience-stats-card"
                  data-multicolor-bento="true"
                  className="bento-tone-emerald md:col-span-6 lg:col-span-5 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#047857]/15 dark:border-[#6EE7B7]/20">
                    <div className="flex items-center gap-2 text-[#047857] dark:text-[#6EE7B7]">
                      <WebIcon name="chart" className="w-4.5 h-4.5 shrink-0 text-[#047857] dark:text-[#6EE7B7]" />
                      <h3 className="typo-h3 font-bold font-play leading-tight text-[#047857] dark:text-[#6EE7B7]">
                        Thành tựu đạt được
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    {kpisList.map((kpi, kIdx) => (
                      <div key={kIdx} className="p-2.5 rounded-[12px] bg-white/85 dark:bg-[#1F2937]/85 border border-[#6EE7B7]/45 dark:border-[#334155] space-y-1.5">
                        <div className="flex items-center justify-between typo-body-sm font-semibold gap-2">
                          <span className="text-[#334155] dark:text-[#E2E8F0] leading-tight break-words">{kpi.label}</span>
                          <span className="font-mono font-black typo-h5 text-[#047857] dark:text-[#6EE7B7] shrink-0">
                            {kpi.displayValue}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#E2E8F0] dark:bg-[#111827] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              kIdx === 0
                                ? 'bg-gradient-to-r from-[#047857] to-[#10B981]'
                                : kIdx === 1
                                ? 'bg-gradient-to-r from-[#0E7490] to-[#06B6D4]'
                                : kIdx === 2
                                ? 'bg-gradient-to-r from-[#4338CA] to-[#6D28D9]'
                                : 'bg-gradient-to-r from-[#075985] to-[#0EA5E9]'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(15, kpi.percent))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* BENTO 03: CÔNG VIỆC ĐÃ TRIỂN KHAI (Blue Pastel Mica) */}
                <section
                  id="experience-responsibility-card"
                  data-multicolor-bento="true"
                  className="bento-tone-blue md:col-span-3 lg:col-span-4 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-[#075985]/15 dark:border-[#7DD3FC]/20 text-[#075985] dark:text-[#7DD3FC]">
                    <WebIcon name="briefcase" className="w-4.5 h-4.5 shrink-0 text-[#075985] dark:text-[#7DD3FC]" />
                    <h3 className="typo-h3 font-bold font-play leading-tight text-[#075985] dark:text-[#7DD3FC]">
                      Công việc triển khai
                    </h3>
                  </div>

                  <div className="space-y-2 flex-1">
                    {tasksList.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2 rounded-[12px] bg-white/80 dark:bg-[#1F2937]/85 border border-[#93C5FD]/40 dark:border-[#334155]">
                        <div className="w-5 h-5 rounded-full bg-[#EFF6FF] dark:bg-[#111827] text-[#075985] dark:text-[#7DD3FC] border border-[#93C5FD]/60 dark:border-[#334155] font-mono font-bold typo-badge flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="typo-body-sm font-medium text-[#334155] dark:text-[#E2E8F0] leading-snug break-words">
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* BENTO 05: DỰ ÁN TRỌNG ĐIỂM ĐÃ THỰC HIỆN (Amber Pastel Mica) */}
                <section
                  id="experience-achievement-card"
                  data-multicolor-bento="true"
                  className="bento-tone-amber md:col-span-3 lg:col-span-4 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#92400E]/15 dark:border-[#FCD34D]/20">
                    <div className="flex items-center gap-2 text-[#92400E] dark:text-[#FCD34D] min-w-0">
                      <WebIcon name="folder" className="w-4.5 h-4.5 shrink-0 text-[#92400E] dark:text-[#FCD34D]" />
                      <h3 className="typo-h3 font-bold font-play leading-tight truncate text-[#92400E] dark:text-[#FCD34D]">
                        Dự án trọng điểm
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#1F2937] text-[#92400E] dark:text-[#FCD34D] border border-[#92400E]/20 dark:border-[#FCD34D]/30 typo-badge font-mono font-bold shrink-0">
                        {projectsList.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(7);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#92400E] hover:bg-amber-700 text-white font-bold typo-label shadow-2xs transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                      title="Chuyển đến trang Dự án"
                    >
                      <span>Xem Dự án</span>
                      <WebIcon name="arrow-up-right" className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2 flex-1 max-h-[340px] overflow-y-auto pr-1 no-scrollbar">
                    {projectsList.map((proj, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          SoundEngine.playTap();
                          if (onNavigateTab) onNavigateTab(7);
                          else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 7, slide: 0 } }));
                        }}
                        className="flex items-start gap-2 p-2.5 rounded-[12px] bg-white/85 dark:bg-[#1F2937]/85 border border-[#FCD34D]/50 dark:border-[#334155] hover:border-[#92400E]/50 transition-all cursor-pointer group/proj"
                        title="Click để xem chi tiết trang Dự án"
                      >
                        <div className="w-5 h-5 rounded-[8px] bg-[#FFF7ED] dark:bg-[#111827] border border-[#FCD34D]/60 dark:border-[#334155] text-[#92400E] dark:text-[#FCD34D] flex items-center justify-center shrink-0 mt-0.5">
                          <WebIcon name="folder" className="w-3 h-3" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="typo-body-sm font-bold font-play text-[#1E1B4B] dark:text-[#F8FAFC] leading-snug break-words group-hover/proj:text-[#92400E] dark:group-hover/proj:text-[#FCD34D]">
                            {proj.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* BENTO 06: SẢN PHẨM, HỆ THỐNG & CAM KẾT CHẤT LƯỢNG (Pink Pastel Mica) */}
                <section
                  id="experience-commitments-card"
                  data-multicolor-bento="true"
                  className="bento-tone-pink md:col-span-6 lg:col-span-4 p-[15px] rounded-[14px] flex flex-col justify-between gap-[15px] min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#BE185D]/15 dark:border-[#FDA4AF]/20">
                    <div className="flex items-center gap-2 text-[#BE185D] dark:text-[#FDA4AF] min-w-0">
                      <WebIcon name="package" className="w-4.5 h-4.5 shrink-0 text-[#BE185D] dark:text-[#FDA4AF]" />
                      <h3 className="typo-h3 font-bold font-play leading-tight truncate text-[#BE185D] dark:text-[#FDA4AF]">
                        Sản phẩm cam kết
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        if (onNavigateTab) onNavigateTab(4);
                        else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#BE185D] hover:bg-pink-700 text-white font-bold typo-label transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                      title="Chuyển đến trang Dịch vụ"
                    >
                      <span>Dịch vụ</span>
                      <WebIcon name="arrow-up-right" className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Thương hiệu / Sản phẩm trực thuộc */}
                  <div className="flex flex-wrap gap-2">
                    {brandsList.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        onClick={() => {
                          SoundEngine.playTap();
                          if (onNavigateTab) onNavigateTab(4);
                          else window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 4, slide: 0 } }));
                        }}
                        className="px-2.5 py-1.5 rounded-[12px] bg-white/85 dark:bg-[#1F2937]/85 border border-[#F9A8D4]/55 dark:border-[#334155] flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
                        title={`Xem chi tiết dịch vụ ${b.name}`}
                      >
                        {b.logo ? (
                          <img
                            src={b.logo}
                            alt={b.name}
                            style={{ borderRadius: '50%' }}
                            className="w-6 h-6 rounded-full object-cover bg-white border border-[#CBD5E1] shrink-0"
                          />
                        ) : (
                          <WebIcon name="shopping-bag" className="w-4 h-4 text-[#BE185D] dark:text-[#FDA4AF] shrink-0" />
                        )}
                        <span className="typo-label font-bold text-[#1E1B4B] dark:text-[#F8FAFC] truncate max-w-[120px]">
                          {b.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cam kết thực hiện */}
                  <div className="space-y-2 flex-1">
                    {commitmentsList.map((cmtText, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-[12px] bg-white/85 dark:bg-[#1F2937]/85 border border-[#F9A8D4]/50 dark:border-[#334155] flex items-start gap-2"
                      >
                        <WebIcon name="check-circle" className="w-4 h-4 text-[#047857] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                        <span className="typo-body-sm font-medium text-[#334155] dark:text-[#E2E8F0] leading-snug break-words">
                          {cmtText}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
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
