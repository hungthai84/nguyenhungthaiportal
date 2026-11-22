export interface DomainCaseStudy {
  domainId: string;
  titleVi: string;
  titleEn: string;
  challengeVi: string;
  solutionVi: string;
  outcomeVi: string;
  projectTitle?: string;
  companyContext?: string;
  timeframe?: string;
  situation?: string;
  task?: string;
  actions?: string[];
  results?: { metric: string; label: string; sub?: string; value?: string; desc?: string }[];
}

export const DOMAIN_CASE_STUDIES: Record<string, DomainCaseStudy> = {
  '01': {
    domainId: '01',
    titleVi: 'Chuẩn Hóa Tổng Đài Viễn Thông & Truyền Hình Cáp 24/7',
    titleEn: '24/7 Telecom & Cable TV Contact Center Standardization',
    challengeVi: 'Lưu lượng cuộc gọi báo hỏng và tra cứu cước tăng đột biến vào giờ cao điểm.',
    solutionVi: 'Thiết lập hệ thống IVR phân luồng thông minh và chuẩn hóa quy trình SOP phối hợp kỹ thuật hiện trường.',
    outcomeVi: 'Rút ngắn 35% thời gian chờ cuộc gọi, duy trì SLA > 98.5% và FCR đạt 91.5%.',
  },
  '02': {
    domainId: '02',
    titleVi: 'Vận Hành Mega Sale Sàn Thương Mại Điện Tử & Chuỗi Cung Ứng',
    titleEn: 'E-Commerce Mega Sale & Digital Supply Chain Operations',
    challengeVi: 'Sản lượng ticket tăng gấp 5 lần trong các chiến dịch Mega Sale (9.9, 11.11, 12.12).',
    solutionVi: 'Tự động hóa quy trình hoàn tiền/trả hàng và tích hợp hệ thống OMS/3PL thời gian thực.',
    outcomeVi: 'Xử lý 50,000+ tickets/ngày với 130+ nhân sự, đạt CSAT kỷ lục 99.0%.',
  },
  '03': {
    domainId: '03',
    titleVi: 'Nâng Tầm Trải Nghiệm Giải Quyết Quyền Lợi Bảo Hiểm Nhân Thọ',
    titleEn: 'Life Insurance Claims & VIP Policyholder Care Elevation',
    challengeVi: 'Yêu cầu khắt khe về tính bảo mật, tuân thủ pháp lý và sự thấu cảm trong tư vấn quyền lợi.',
    solutionVi: 'Triển khai khung QA/QC 100% cuộc gọi kết hợp khảo sát VoC đa điểm chạm.',
    outcomeVi: 'Đạt QA Score 98.5%, NPS +68 và tỷ lệ duy trì hợp đồng 94.2%.',
  },
  '04': {
    domainId: '04',
    titleVi: 'Hệ Sinh Thái Chăm Sóc 10 Triệu+ Game Thủ & 15,000 Phòng Máy',
    titleEn: '10M+ Gamers & 15,000 Cybercafes Support Ecosystem',
    challengeVi: 'Đa dạng sự cố tài khoản, nạp thẻ và kỹ thuật phòng máy GCafe trên toàn quốc.',
    solutionVi: 'Xây dựng cổng Self-Service Portal và hệ thống đào tạo trực tuyến cho hơn 100,000 học viên.',
    outcomeVi: 'Giảm 45% ticket lặp lại, bảo vệ an toàn tài khoản và vận hành ổn định các giải đấu lớn.',
  },
  '05': {
    domainId: '05',
    titleVi: 'Tối Ưu Hỗ Trợ Giao Dịch Ví Điện Tử & Phòng Chống Gian Lận 24/7',
    titleEn: 'Real-Time E-Wallet Transaction Support & Fraud Prevention',
    challengeVi: 'Áp lực xử lý tức thì các giao dịch lỗi liên ngân hàng, định danh eKYC và rủi ro gian lận.',
    solutionVi: 'Kết nối trực tiếp hệ thống Core Banking/Risk và ứng dụng AI Bot hỗ trợ tự động 65% tác vụ.',
    outcomeVi: 'SLA phản hồi dưới 30 giây, rút ngắn tra soát từ 3 ngày xuống < 4 giờ, CSAT đạt 97.8%.',
  },
  '06': {
    domainId: '06',
    titleVi: 'Kiến Trúc Hệ Thống Omnichannel CRM, BI Dashboard & AI Agent',
    titleEn: 'Omnichannel CRM, Real-Time BI & AI Agent Architecture',
    challengeVi: 'Dữ liệu khách hàng phân mảnh trên nhiều kênh (Voice, Chat, Email, Zalo OA, Facebook).',
    solutionVi: 'Hợp nhất toàn bộ kênh tương tác về một màn hình Agent duy nhất kèm BI Dashboard thời gian thực.',
    outcomeVi: 'Tối ưu 28% chi phí vận hành, tăng 42% năng suất đội ngũ qua 18+ dự án chuyển đổi số.',
  },
};
