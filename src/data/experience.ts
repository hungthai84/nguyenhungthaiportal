export interface ExperienceMilestone {
  key: string;
  year: string;
  cardYearLabel: string;
  cardYearColor: string;
  period: string;
  company: string;
  subCompanies?: string;
  tag: string;
  tagCategory: string;
  hexColor: string;
  logo: string;
  bannerUrl: string;
  memoryImg: string;
  headcount: number;
  tenure: string;
  roleTitle: string;
  location: string;
  highlightText: string;
  cardDescription: string;
  paragraphs: string[];
  industry: string;
  tasks: string[];
  projects: string[];
  commitments: string[];
  kpis: Array<{ label: string; percent: number; displayValue: string }>;
  products?: Array<{ src: string; alt: string }>;
  domains?: Array<{ tag: string; title: string }>;
  photos?: Array<{ src: string; title?: string; desc?: string; alt?: string; caption?: string }>;
  videoCard?: { idleUrl: string; playUrl: string };
  intro?: any;
  philosophy?: any;
  scaleDesc?: string;
  code?: string;
  id?: string;
  yearLabelVi?: string;
  highlightVi?: string;
  highlightEn?: string;
  color?: string;
  roleVi?: string;
  yearBadgeGradient?: string;
  descVi?: string;
  descViPart2?: string;
  highlightIconName?: string;
}

export type CareerMilestone = ExperienceMilestone;

export const EXPERIENCE_MILESTONES: Record<string, ExperienceMilestone> = {
  "2002": {
    key: "2002",
    code: "4.8",
    year: "2002",
    cardYearLabel: "2002 - 2007",
    cardYearColor: "text-blue-500",
    period: "Từ năm 2002 đến năm 2007",
    company: "Công ty",
    subCompanies: "Viễn thông MobiFone",
    tag: "Viễn thông",
    tagCategory: "telecom",
    hexColor: "#0066FF",
    logo: "https://i.postimg.cc/3N4xX9Xd/Mobifone.png",
    bannerUrl: "https://i.postimg.cc/k5HZ6dyk/Mobifone.png",
    memoryImg: "https://i.postimg.cc/DwDN4kCM/Mobifone-1.webp",
    headcount: 12,
    scaleDesc: "12 nhân sự nhóm",
    tenure: "5 Năm",
    roleTitle: "Nhân viên CSKH",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Tôi bắt đầu sự nghiệp tại MobiFone, nơi tôi được đào tạo bài bản về dịch vụ khách hàng, quản lý tổng đài, xử lý sự cố và xây dựng quy trình phục vụ theo tiêu chuẩn ngành viễn thông.",
    cardDescription:
      "Khởi đầu Nhân viên CSKH ngành viễn thông di động: tổng đài 24/7, xử lý sự cố và rèn chuẩn quy trình phục vụ khách hàng.",
    paragraphs: [
      "Tư Vấn Nghiệp Vụ: Tiếp nhận và giải quyết các yêu cầu tư vấn dịch vụ, cước phí và khiếu nại viễn thông di động của khách hàng MobiFone.",
      "Khảo Sát & Hướng Dẫn: Thực hiện các cuộc gọi Outbound khảo sát chất lượng mạng và hỗ trợ đào tạo, hướng dẫn nghiệp vụ cho nhân viên mới.",
      "Quản Lý Khẩn Cấp: Xử lý linh hoạt các tình huống khẩn cấp, cuộc gọi khó hoặc quấy rối theo đúng quy chuẩn của tập đoàn.",
    ],
    intro: [
      {
        title: "1. Tư Vấn Nghiệp Vụ",
        desc: "Tiếp nhận và giải quyết các yêu cầu tư vấn dịch vụ, cước phí và khiếu nại viễn thông di động của khách hàng MobiFone.",
      },
      {
        title: "2. Khảo Sát & Hướng Dẫn",
        desc: "Thực hiện các cuộc gọi Outbound khảo sát chất lượng mạng và hỗ trợ đào tạo, hướng dẫn nghiệp vụ cho nhân viên mới.",
      },
      {
        title: "3. Quản Lý Khẩn Cấp",
        desc: "Xử lý linh hoạt các tình huống khẩn cấp, cuộc gọi khó hoặc quấy rối theo đúng quy chuẩn của tập đoàn.",
      },
    ],
    philosophy:
      "Tuân thủ chuẩn mực tác phong chuyên nghiệp, lắng nghe tận tâm và phục vụ khách hàng theo quy trình chuẩn của ngành viễn thông.",
    industry: "Viễn thông di động / Call Center tập đoàn",
    products: [
      { src: "https://i.postimg.cc/3N4xX9Xd/Mobifone.png", alt: "Mobifone" },
    ],
    tasks: [
      "1. Tiếp nhận và tư vấn cước, dịch vụ viễn thông di động MobiFone;",
      "2. xử lý các khiếu nại phức tạp;",
      "3. thực hiện cuộc gọi Outbound khảo sát chất lượng dịch vụ;",
      "4. hỗ trợ hướng dẫn nghiệp vụ cho nhân viên mới;",
      "5. xử lý các tình huống cuộc gọi quấy rối khẩn cấp.",
    ],
    projects: [
      "5.1 · Phát triển đào tạo trực tuyến",
      "5.4 · Chiến lược Lấy Khách hàng làm Trung tâm & Khung TQA chuẩn COPC",
      "5.2 · Khung năng lực và lộ trình phát triển",
    ],
    commitments: [
      "Tuân thủ nghiêm ngặt chuẩn mực tác phong tư vấn",
      "Quy trình chăm sóc khách hàng tiêu chuẩn tập đoàn viễn thông hàng đầu.",
    ],
    kpis: [
      { label: "Hoàn thành nhiệm vụ tư vấn", percent: 100, displayValue: "100%" },
      { label: "Phản hồi & Xử lý khiếu nại", percent: 95, displayValue: "95%" },
      { label: "Đạt Chứng nhận Tổng đài viên xuất sắc MobiFone", percent: 100, displayValue: "100%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/DwDN4kCM/Mobifone-1.webp", title: "Mobifone 1", desc: "Kỷ niệm công tác tại MobiFone" },
      { src: "https://i.postimg.cc/wjPrR8Wr/Mobifone-2.webp", title: "Mobifone 2", desc: "Đội ngũ CSKH MobiFone" },
      { src: "https://i.postimg.cc/htwYQWC6/Mobifone-3.webp", title: "Mobifone 3", desc: "Hoạt động nghiệp vụ tổng đài MobiFone" },
    ],
  },
  "2007": {
    key: "2007",
    code: "4.7",
    year: "2007",
    cardYearLabel: "2007 - 2011",
    cardYearColor: "text-purple-600",
    period: "Từ năm 2007 đến năm 2011",
    company: "Công ty",
    subCompanies: "Viễn Liên V247",
    tag: "Viễn thông quốc tế",
    tagCategory: "telecom",
    hexColor: "#7C4DFF",
    logo: "https://i.postimg.cc/wMyjXFXc/V247.png",
    bannerUrl: "https://i.postimg.cc/63GPC1jz/v247.png",
    memoryImg: "https://i.postimg.cc/0NwBpWFy/V247-1.webp",
    headcount: 12,
    scaleDesc: "12 nhân sự trực tiếp",
    tenure: "4 Năm",
    roleTitle: "Giám sát chăm sóc khách hàng",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Gia nhập Viễn Liên V247, tôi tiếp tục phát triển năng lực quản lý đội ngũ, giám sát chất lượng dịch vụ và tối ưu hiệu quả vận hành của trung tâm chăm sóc khách hàng.",
    cardDescription:
      "Thăng tiến Giám sát CSKH viễn thông quốc tế Hoa Kỳ – Việt Nam: điều phối ca 24/7, chấm điểm QA và đào tạo chuẩn SLA >98%.",
    paragraphs: [
      "Giám Sát Đa Kênh: Quản lý và giám sát hoạt động CSKH trên các kênh Email, Fax, Điện thoại và Live Chat, điều phối cuộc gọi theo lưu lượng thực tế.",
      "Đánh Giá Chất Lượng: Thực hiện chấm điểm chất lượng cuộc gọi (QA Call Scoring), huấn luyện kỹ năng nghiệp vụ và lập lịch trực ca vận hành 24/7.",
      "Xử Lý Khiếu Nại: Giải quyết các khiếu nại về cước và chất lượng dịch vụ viễn thông quốc tế cho khách hàng và kiều bào.",
    ],
    intro: [
      {
        title: "1. Giám Sát Đa Kênh",
        desc: "Quản lý và giám sát hoạt động CSKH trên các kênh Email, Fax, Điện thoại và Live Chat, điều phối cuộc gọi theo lưu lượng thực tế.",
      },
      {
        title: "2. Đánh Giá Chất Lượng",
        desc: "Thực hiện chấm điểm chất lượng cuộc gọi (QA Call Scoring), huấn luyện kỹ năng nghiệp vụ và lập lịch trực ca vận hành 24/7.",
      },
      {
        title: "3. Xử Lý Khiếu Nại",
        desc: "Giải quyết các khiếu nại về cước và chất lượng dịch vụ viễn thông quốc tế cho khách hàng và kiều bào.",
      },
    ],
    philosophy:
      "Đảm bảo chất lượng kết nối thông suốt 24/7, kiểm soát chặt chẽ tiêu chuẩn dịch vụ và hỗ trợ kịp thời cho khách hàng quốc tế.",
    industry: "Viễn thông quốc tế / Contact Center 24/7",
    products: [
      { src: "https://i.postimg.cc/wMyjXFXc/V247.png", alt: "V247" },
    ],
    tasks: [
      "1. Quản lý và giám sát vận hành đội ngũ CSKH đa kênh (Email, Fax, Phone, Live Chat);",
      "2. phân bổ cuộc gọi theo lưu lượng thực tế;",
      "3. đánh giá chất lượng cuộc gọi (QA Call Scoring);",
      "4. huấn luyện kỹ năng cho nhân viên;",
      "5. lập lịch trực ca 24/7;",
      "6. giải quyết khiếu nại cước viễn thông quốc tế.",
    ],
    projects: [
      "5.1 · Phát triển đào tạo trực tuyến",
      "5.4 · Chiến lược Lấy Khách hàng làm Trung tâm & Khung TQA chuẩn COPC",
      "2.1 · Chuẩn hóa quy trình CSKH",
    ],
    commitments: [
      "Đảm bảo chất lượng thoại và thời gian kết nối thông suốt 24/7",
      "Hỗ trợ kịp thời cho kiều bào và khách hàng quốc tế.",
    ],
    kpis: [
      { label: "Đào tạo Onboarding nhân viên mới", percent: 96, displayValue: "96%" },
      { label: "Biên soạn tài liệu nghiệp vụ", percent: 100, displayValue: "100%" },
      { label: "Chỉ số giải quyết cuộc gọi SLA", percent: 95, displayValue: "95%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/0NwBpWFy/V247-1.webp", title: "V247 1", desc: "Kỷ niệm công tác tại V247" },
      { src: "https://i.postimg.cc/PqwRm39x/V247-2.webp", title: "V247 2", desc: "Đội ngũ Giám sát & CSKH V247" },
      { src: "https://i.postimg.cc/QMTyp4w9/V247-3.webp", title: "V247 3", desc: "Hoạt động vận hành Contact Center 24/7" },
      { src: "https://i.postimg.cc/g0ZTvSQL/V247-4.webp", title: "V247 4", desc: "Đào tạo nghiệp vụ nội bộ V247" },
      { src: "https://i.postimg.cc/6Qvmdjgv/V247-5.webp", title: "V247 5", desc: "Gắn kết tập thể Viễn Liên V247" },
    ],
  },
  "2011": {
    key: "2011",
    code: "4.6",
    year: "2011",
    cardYearLabel: "2011 - 2013",
    cardYearColor: "text-emerald-600",
    period: "Từ năm 2011 đến năm 2013",
    company: "Công ty CP",
    subCompanies: "Băng thông Rộng LBC",
    tag: "Truyền thông",
    tagCategory: "telecom",
    hexColor: "#00C853",
    logo: "https://i.postimg.cc/kG6gQwQ4/LBC.png",
    bannerUrl: "https://i.postimg.cc/cJzjgNmq/LBC.png",
    memoryImg: "https://i.postimg.cc/P5c7vs62/HTVC-1.webp",
    products: [
      { src: "https://i.postimg.cc/kG6gQwQ4/LBC.png", alt: "LBC" },
      { src: "https://i.postimg.cc/V6HN02C6/HTVC.png", alt: "HTVC" },
    ],
    headcount: 12,
    scaleDesc: "12 nhân sự trực tiếp",
    tenure: "2 Năm",
    roleTitle: "Trưởng Phòng Dịch vụ Khách hàng",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Đây là dấu mốc quan trọng khi tôi lần đầu đảm nhiệm vị trí Trưởng phòng CSKH. Từ một nhà quản lý vận hành, tôi chuyển mình trở thành một nhà quản trị toàn diện.",
    cardDescription:
      "Trưởng phòng CSKH quy mô nhỏ ngành truyền hình cáp & internet: chuẩn hóa quy trình SOP, KPI và hệ thống phối hợp đa đơn vị.",
    paragraphs: [
      "Điều Hành Toàn Diện: Trực tiếp quản lý hoạt động phòng CSKH, chuẩn hóa quy trình xử lý sự cố truyền hình cáp và dịch vụ internet băng rộng.",
      "Phối Hợp MKT: Triển khai khảo sát mức độ hài lòng, phân tích thị trường, chăm sóc khách hàng VIP và phối hợp các chương trình khuyến mãi.",
      "Quản Lý Ngân Sách: Xây dựng kế hoạch hoạt động và kiểm soát ngân sách vận hành phòng CSKH hàng năm.",
    ],
    intro: [
      {
        title: "1. Điều Hành Toàn Diện",
        desc: "Trực tiếp quản lý hoạt động phòng CSKH, chuẩn hóa quy trình xử lý sự cố truyền hình cáp và dịch vụ internet băng rộng.",
      },
      {
        title: "2. Phối Hợp MKT",
        desc: "Triển khai khảo sát mức độ hài lòng, phân tích thị trường, chăm sóc khách hàng VIP và phối hợp các chương trình khuyến mãi.",
      },
      {
        title: "3. Quản Lý Ngân Sách",
        desc: "Xây dựng kế hoạch hoạt động và kiểm soát ngân sách vận hành phòng CSKH hàng năm.",
      },
    ],
    philosophy:
      "Đảm bảo phản hồi và xử lý sự cố kỹ thuật nhanh chóng, gia tăng tỷ lệ giữ chân khách hàng (Retention Rate) và nâng cao uy tín dịch vụ.",
    industry: "Truyền thông / Truyền hình cáp HTVC / Internet Băng rộng",
    tasks: [
      "1. Quản lý điều hành toàn diện phòng CSKH;",
      "2. cải thiện sản phẩm dịch vụ;",
      "3. thực hiện khảo sát độ hài lòng khách hàng;",
      "4. phối hợp phòng Marketing triển khai chương trình khuyến mãi;",
      "5. phân tích đối thủ cạnh tranh, lập kế hoạch và trực tiếp thăm hỏi khách hàng VIP;",
      "6. xây dựng và kiểm soát ngân sách CSKH hàng năm.",
    ],
    projects: [
      "1.1 · Xây dựng và vận hành Phòng Dịch vụ Khách hàng",
      "1.2 · Thiết lập mục tiêu phòng ban",
      "3.1 · Nâng cao chất lượng trải nghiệm khách hàng",
      "2.1 · Chuẩn hóa quy trình CSKH",
      "2.4 · Quản lý chiến dịch Outbound",
      "4.2 · Phân tích & Báo cáo",
    ],
    commitments: [
      "Đảm bảo quy trình xử lý sự cố tín hiệu truyền hình & internet nhanh chóng",
      "Gia tăng chỉ số giữ chân khách hàng (Retention Rate) và sự gắn kết thương hiệu.",
    ],
    kpis: [
      { label: "Chuẩn hóa quy trình SOP", percent: 100, displayValue: "100%" },
      { label: "Phản hồi & Hỗ trợ sự cố", percent: 95, displayValue: "95%" },
      { label: "Khảo sát sự hài lòng CSAT", percent: 92, displayValue: "92%" },
      { label: "Hoàn thành kế hoạch ngân sách", percent: 100, displayValue: "100%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/P5c7vs62/HTVC-1.webp", title: "HTVC 1", desc: "Hoạt động Phòng CSKH LBC - HTVC" },
      { src: "https://i.postimg.cc/3x6q05LL/HTVC-2.webp", title: "HTVC 2", desc: "Đội ngũ CSKH Truyền hình cáp HTVC" },
      { src: "https://i.postimg.cc/9QSkw5x1/HTVC-3.webp", title: "HTVC 3", desc: "Triển khai chương trình chăm sóc khách hàng" },
      { src: "https://i.postimg.cc/Mp4Lf2s3/HTVC-4.webp", title: "HTVC 4", desc: "Kỷ niệm công tác tại LBC HTVC" },
    ],
  },
  "2013": {
    key: "2013",
    code: "4.5",
    year: "2013",
    cardYearLabel: "2013 - 2016",
    cardYearColor: "text-slate-600",
    period: "Từ năm 2013 đến năm 2016",
    company: "Công ty cổ phần",
    subCompanies: "Vietnam eSport",
    tag: "eSport, Game & TMĐT",
    tagCategory: "gaming",
    hexColor: "#ED1C24",
    logo: "https://i.postimg.cc/NF9j6b6x/VED.png",
    bannerUrl: "https://i.postimg.cc/Fz5Bpg8S/VED.png",
    memoryImg: "https://i.postimg.cc/wvYbF5YR/VED-1.webp",
    products: [
      { src: "https://i.postimg.cc/NF9j6b6x/VED.png", alt: "Logo VED" },
      { src: "https://i.postimg.cc/QC9dQSQs/Garena.png", alt: "Garena" },
      { src: "https://i.postimg.cc/MTrGfgQH/GCafe.png", alt: "GCafe" },
      { src: "https://i.postimg.cc/J0DzNKNN/Shopee-Paye.png", alt: "ShopeePay" },
      { src: "https://i.postimg.cc/WzF1GSGw/Shopee.png", alt: "Shopee" },
    ],
    headcount: 130,
    scaleDesc: "130 nhân sự trực tiếp (80+ Game Supporter, CSKH, Fraud)",
    tenure: "3 Năm",
    roleTitle: "Trưởng phòng CSKH",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Gia nhập Garena, tôi quản lý hoạt động chăm sóc khách hàng trong lĩnh vực game trực tuyến, nơi yêu cầu tốc độ xử lý nhanh, độ chính xác cao và khả năng đáp ứng lượng khách hàng rất lớn.",
    cardDescription:
      "Trưởng phòng CSKH quản lý cấp cao (129–130 NS) đa lĩnh vực Game, eSports, TMĐT Shopee, AirPay & Gcafe: xây dựng hệ thống CRM, quy trình & đào tạo kế thừa.",
    paragraphs: [
      "Khởi Tạo Sản Phẩm: Tham gia xây dựng hệ thống CSKH cho các sản phẩm mới gồm Shopee, AirPay, Liên Quân Mobile và Liên Minh Huyền Thoại.",
      "Tổ Chức & Chuẩn Hóa: Quản lý bộ máy 130 nhân sự, chuẩn hóa Visual SOP, phát triển hệ thống CRM nội bộ Garena Customer Desk và đào tạo đội ngũ quản lý cấp trung.",
      "Hỗ Trợ Sự Kiện: Giải quyết khiếu nại đơn hàng TMĐT, xử lý sự cố tài khoản game lưu lượng lớn và phối hợp vận hành CSKH tại các giải đấu eSports.",
    ],
    intro: [
      {
        title: "1. Khởi Tạo Sản Phẩm",
        desc: "Tham gia xây dựng hệ thống CSKH cho các sản phẩm mới gồm Shopee, AirPay, Liên Quân Mobile và Liên Minh Huyền Thoại.",
      },
      {
        title: "2. Tổ Chức & Chuẩn Hóa",
        desc: "Quản lý bộ máy 130 nhân sự, chuẩn hóa Visual SOP, phát triển hệ thống CRM nội bộ Garena Customer Desk và đào tạo đội ngũ quản lý cấp trung.",
      },
      {
        title: "3. Hỗ Trợ Sự Kiện",
        desc: "Giải quyết khiếu nại đơn hàng TMĐT, xử lý sự cố tài khoản game lưu lượng lớn và phối hợp vận hành CSKH tại các giải đấu eSports.",
      },
    ],
    philosophy:
      "Đảm bảo tốc độ phản hồi nhanh (>50.000 ticket/ngày), bảo mật tài khoản người dùng và duy trì khả năng vận hành ổn định trong các sự kiện lớn.",
    industry: "eSports / Game Online / E-commerce (Shopee) / Ví điện tử (ShopeePay/AirPay) / GCafe",
    tasks: [
      "1. Tham gia xây dựng dự án sản phẩm mới (Shopee, AirPay, Liên Quân Mobile, LMHT);",
      "2. quản lý tổ chức bộ máy 130 nhân sự;",
      "3. chuẩn hóa Visual SOP;",
      "4. kiến trúc CRM nội bộ Garena Customer Desk;",
      "5. đào tạo đội ngũ quản lý cấp trung;",
      "6. giải quyết khiếu nại đơn hàng TMĐT & sự cố tài khoản game lượng truy cập khủng; phối hợp CSKH tại các giải đấu eSports lớn.",
    ],
    projects: [
      "1.1 · Xây dựng và vận hành Phòng Dịch vụ Khách hàng",
      "4.1 · Xây dựng hệ thống CRM",
      "5.2 · Khung năng lực và lộ trình phát triển",
      "2.1 · Chuẩn hóa quy trình CSKH",
      "5.1 · Phát triển đào tạo trực tuyến",
      "5.3 · Thành lập Trung tâm Hỗ trợ Khách hàng",
    ],
    commitments: [
      "Đảm bảo tốc độ phản hồi Ticket/Chat cực nhanh (> 50,000 ticket/ngày)",
      "Bảo mật tài khoản người dùng và khả năng chịu tải siêu cao trong các sự kiện game & Mega-sale.",
    ],
    kpis: [
      { label: "Chuẩn hóa quy trình SOP", percent: 100, displayValue: "100%" },
      { label: "Tốc độ phản hồi Chat/Ticket", percent: 100, displayValue: "< 30 giây" },
      { label: "Điểm CSAT", percent: 96, displayValue: "96%" },
      { label: "Hoàn thành dự án Onboarding & Đào tạo nội bộ", percent: 100, displayValue: "100%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/wvYbF5YR/VED-1.webp", title: "VED 1", desc: "Đội ngũ 130 nhân sự CSKH VED - Garena" },
      { src: "https://i.postimg.cc/Ls1bzCwP/VED-2.webp", title: "VED 2", desc: "Hoạt động vận hành sự kiện eSports" },
      { src: "https://i.postimg.cc/DZ3Y5Q3b/VED-3.webp", title: "VED 3", desc: "Đào tạo & phát triển đội ngũ VED" },
      { src: "https://i.postimg.cc/JnCdK3Ck/VED-4.webp", title: "VED 4", desc: "Kỷ niệm công tác tại Vietnam Esports" },
    ],
  },
  "2016": {
    key: "2016",
    code: "4.4",
    year: "2016",
    cardYearLabel: "2016 - 2018",
    cardYearColor: "text-red-600",
    period: "Từ năm 2016 đến năm 2018",
    company: "Công ty BNNT",
    subCompanies: "Prudential VN",
    tag: "Bảo hiểm",
    tagCategory: "insurance",
    hexColor: "#FF5252",
    logo: "https://i.postimg.cc/C5BxGJGk/Prudential.png",
    bannerUrl: "https://i.postimg.cc/4dh0pFL9/Prudentinal.png",
    memoryImg: "https://i.postimg.cc/FKLBjW8X/Prudential-1.webp",
    headcount: 12,
    scaleDesc: "12 nhân sự trực tiếp + 40+ Chuyên viên tư vấn",
    tenure: "2 Năm",
    roleTitle: "Trưởng Phòng Call Center",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Tại Prudential, tôi có cơ hội làm việc trong lĩnh vực bảo hiểm – một ngành dịch vụ đòi hỏi tính chính xác, minh bạch và mức độ tin cậy rất cao.",
    cardDescription:
      "Trưởng phòng Call Center ngành bảo hiểm nhân thọ: chuẩn hóa QA/QC, quy trình BCP, tư vấn Video Call và trải nghiệm chuẩn tin cậy.",
    paragraphs: [
      "Vận Hành Hệ Thống: Quản lý hoạt động Call Center bảo hiểm, tổ chức và sắp xếp nhân sự phù hợp cho giai đoạn chuyển đổi hệ thống mới.",
      "Đổi Mới Kênh Hỗ Trợ: Xây dựng quy trình tư vấn qua Video Call và phối hợp kết nối mảng thương mại điện tử (E-commerce) với hệ thống tổng đài.",
      "An Toàn Vận Hành: Cải tiến hệ thống BCP ứng phó sự cố và phối hợp giải quyết các nghiệp vụ đáo hạn, bồi thường bảo hiểm.",
    ],
    intro: [
      {
        title: "1. Vận Hành Hệ Thống",
        desc: "Quản lý hoạt động Call Center bảo hiểm, tổ chức và sắp xếp nhân sự phù hợp cho giai đoạn chuyển đổi hệ thống mới.",
      },
      {
        title: "2. Đổi Mới Kênh Hỗ Trợ",
        desc: "Xây dựng quy trình tư vấn qua Video Call và phối hợp kết nối mảng thương mại điện tử (E-commerce) với hệ thống tổng đài.",
      },
      {
        title: "3. An Toàn Vận Hành",
        desc: "Cải tiến hệ thống BCP ứng phó sự cố và phối hợp giải quyết các nghiệp vụ đáo hạn, bồi thường bảo hiểm.",
      },
    ],
    philosophy:
      "Đảm bảo tính chính xác tuyệt đối trong tư vấn hợp đồng bảo hiểm, xây dựng trải nghiệm dịch vụ chuẩn mực và duy trì tỷ lệ giải quyết ngay từ lần đầu (FCR > 92%).",
    industry: "Bảo hiểm nhân thọ / Tài chính cao cấp",
    products: [
      { src: "https://i.postimg.cc/C5BxGJGk/Prudential.png", alt: "Prudential" },
    ],
    tasks: [
      "1. Quản lý hệ thống Callcenter bảo hiểm của Prudential;",
      "2. sắp xếp nhân sự cho hệ thống chuyển đổi mới;",
      "3. xây dựng và phối hợp đưa E-commerce kết nối Callcenter;",
      "4. xây dựng quy trình quản trị tư vấn qua kênh Videocall;",
      "5. xây dựng và chỉnh sửa lại hệ thống BCP ứng phó sự cố;",
      "6. phối hợp giải quyết quyền lợi đáo hạn và bồi thường bảo hiểm.",
    ],
    projects: [
      "3.2 · Quản lý dự án CSKH",
      "2.2 · Tối ưu hóa kênh hỗ trợ",
      "3.1 · Nâng cao chất lượng trải nghiệm khách hàng",
      "3.3 · Đảm bảo chất lượng dịch vụ",
      "2.3 · Triển khai tự động hóa",
    ],
    commitments: [
      "Đảm bảo tính chính xác tuyệt đối trong tư vấn hợp đồng bảo hiểm",
      "Kiến tạo trải nghiệm khách hàng 5 sao và đạt tỷ lệ FCR > 92%.",
    ],
    kpis: [
      { label: "Quản lý Call Center SLA", percent: 95, displayValue: "95%" },
      { label: "Giảm 45% thời gian xử lý yêu cầu hợp đồng", percent: 45, displayValue: "45%" },
      { label: "Tỷ lệ FCR", percent: 92, displayValue: "> 92%" },
      { label: "Thương mại điện tử bảo hiểm", percent: 85, displayValue: "85%" },
      { label: "Chuẩn hóa quy trình BCP", percent: 100, displayValue: "100%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/FKLBjW8X/Prudential-1.webp", title: "Prudential 1", desc: "Đội ngũ Call Center Prudential Vietnam" },
      { src: "https://i.postimg.cc/FKLBjW84/Prudential-2.webp", title: "Prudential 2", desc: "Hoạt động quản trị chất lượng dịch vụ" },
      { src: "https://i.postimg.cc/Ls1bzCwm/Prudential-3.webp", title: "Prudential 3", desc: "Triển khai dự án tư vấn Video Call" },
      { src: "https://i.postimg.cc/9f7nG8KX/Prudential-4.webp", title: "Prudential 4", desc: "Đào tạo & huấn luyện chuyên viên tư vấn" },
      { src: "https://i.postimg.cc/tgxMhSwC/Prudential-5.webp", title: "Prudential 5", desc: "Sự kiện nội bộ Prudential Vietnam" },
      { src: "https://i.postimg.cc/SKMvWT3J/Prudential-6.webp", title: "Prudential 6", desc: "Vinh danh tập thể xuất sắc" },
      { src: "https://i.postimg.cc/CKqQjPXR/Prudential-7.webp", title: "Prudential 7", desc: "Kỷ niệm công tác tại Prudential" },
    ],
  },
  "2018": {
    key: "2018",
    code: "4.3",
    year: "2018",
    cardYearLabel: "2018 - 2021",
    cardYearColor: "text-pink-600",
    period: "Từ năm 2018 đến năm 2021",
    company: "Công ty cổ phần",
    subCompanies: "Dịch vụ Mservice",
    tag: "FinTech",
    tagCategory: "fintech",
    hexColor: "#EC008C",
    logo: "https://i.postimg.cc/J0DzNKNy/Momo.png",
    bannerUrl: "https://i.postimg.cc/25tJbfxM/Momo.png",
    memoryImg: "https://i.postimg.cc/pL7S5b0g/Momo-1.webp",
    products: [
      { src: "https://i.postimg.cc/J0DzNKNy/Momo.png", alt: "MoMo" },
    ],
    headcount: 60,
    scaleDesc: "60 nhân sự nội bộ + Hàng trăm nhân sự BPO (Mắt Bảo,...)",
    tenure: "3 Năm",
    roleTitle: "Trưởng Phòng CSKH",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Gia nhập MoMo, tôi tiếp tục mở rộng kinh nghiệm trong lĩnh vực tài chính số. Tôi tập trung tối ưu quy trình hỗ trợ khách hàng, nâng cao hiệu quả vận hành, ứng dụng công nghệ vào quản trị dịch vụ và cải thiện trải nghiệm khách hàng trên nền tảng số.",
    cardDescription:
      "Trưởng phòng CSKH cấp cao ngành FinTech (>30M user): quản trị 60 NS + BPO, xây dựng CRM thời gian thực, quy trình & đào tạo vận hành số.",
    paragraphs: [
      "Vận Hành Tối Ưu: Xây dựng và tinh gọn quy trình CSKH đa kênh, tự động hóa luồng xử lý yêu cầu và kiểm soát chặt chẽ chỉ số SLA/KPI cho cả đội ngũ nội bộ lẫn đối tác BPO.",
      "Xử Lý Sự Cố: Phối hợp trực tiếp cùng các bộ phận Công nghệ, Sản phẩm, Pháp chế và Ngân hàng để giải quyết nhanh các vấn đề giao dịch, khiếu nại và rủi ro phát sinh.",
      "Xây Dựng Hệ Thống: Phát triển hệ thống CRM quản trị quan hệ khách hàng thời gian thực, chuẩn hóa quy trình SOP và đào tạo nâng cao năng lực đội ngũ.",
    ],
    intro: [
      {
        title: "1. Vận Hành Tối Ưu",
        desc: "Xây dựng và tinh gọn quy trình CSKH đa kênh, tự động hóa luồng xử lý yêu cầu và kiểm soát chặt chẽ chỉ số SLA/KPI cho cả đội ngũ nội bộ lẫn đối tác BPO.",
      },
      {
        title: "2. Xử Lý Sự Cố",
        desc: "Phối hợp trực tiếp cùng các bộ phận Công nghệ, Sản phẩm, Pháp chế và Ngân hàng để giải quyết nhanh các vấn đề giao dịch, khiếu nại và rủi ro phát sinh.",
      },
      {
        title: "3. Xây Dựng Hệ Thống",
        desc: "Phát triển hệ thống CRM quản trị quan hệ khách hàng thời gian thực, chuẩn hóa quy trình SOP và đào tạo nâng cao năng lực đội ngũ.",
      },
    ],
    philosophy:
      "Đảm bảo dịch vụ khách hàng vận hành ổn định, phản hồi nhanh (SLA > 98%) và duy trì trải nghiệm thanh toán số liền mạch ngay cả trong các giai đoạn cao điểm.",
    industry: "FinTech / Ví điện tử / Thanh toán số",
    tasks: [
      "1. Quản lý phòng Dịch Vụ Khách Hàng đa kênh (Ví điện tử MoMo);",
      "2. xây dựng hệ thống CRM - Quan hệ khách hàng thời gian thực;",
      "3. xây dựng và cải thiện quy trình phối hợp cùng pháp lý; đào tạo và cải thiện khả năng Dịch Vụ Khách Hàng của nhân viên;",
      "4. chịu trách nhiệm toàn bộ KPIs và tỷ lệ giải quyết tra soát;",
      "5. đánh giá và nâng cấp trải nghiệm khách hàng in-app;",
      "6. quản lý đối tác gia công BPO Mắt Bão.",
    ],
    projects: [
      "1.1 · Xây dựng và vận hành Phòng Dịch vụ Khách hàng",
      "3.3 · Đảm bảo chất lượng dịch vụ",
      "2.1 · Chuẩn hóa quy trình CSKH",
      "2.3 · Triển khai tự động hóa",
      "4.2 · Phân tích & Báo cáo",
      "4.3 · Khảo sát & Đánh giá khách hàng",
      "5.3 · Thành lập Trung tâm Hỗ trợ Khách hàng",
      "3.4 · Quản trị vận hành BPO",
    ],
    commitments: [
      "Đảm bảo SLA tiếp nhận cuộc gọi > 98%",
      "Duy trì trải nghiệm liền mạch không ma sát cho hàng triệu người dùng ví ngay cả trong các đợt cao điểm Lễ/Tết & chiến dịch Mega-sale.",
    ],
    kpis: [
      { label: "Chuẩn hóa quy trình SOP", percent: 100, displayValue: "100%" },
      { label: "Điểm CSAT/NPS", percent: 98.2, displayValue: "98.2%" },
      { label: "Tỷ lệ giải quyết sự cố công nghệ", percent: 95, displayValue: "95%" },
      { label: "Quản lý đối tác BPO SLA", percent: 98.6, displayValue: "98.6%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/pL7S5b0g/Momo-1.webp", title: "Momo 1", desc: "Đội ngũ Dịch vụ Khách hàng Ví MoMo" },
      { src: "https://i.postimg.cc/T3Ss5M78/Momo-2.webp", title: "Momo 2", desc: "Vận hành Trung tâm Hỗ trợ Khách hàng MoMo" },
      { src: "https://i.postimg.cc/9QSkw585/Momo-3.webp", title: "Momo 3", desc: "Hoạt động đào tạo & phát triển nhân sự" },
      { src: "https://i.postimg.cc/t4fcnQSy/Momo-4.webp", title: "Momo 4", desc: "Chiến dịch Mega-Sale & Lễ Tết tại MoMo" },
      { src: "https://i.postimg.cc/QdPzKG4x/Momo-5.webp", title: "Momo 5", desc: "Phối hợp đối tác BPO & quản trị chất lượng" },
      { src: "https://i.postimg.cc/htwYQWyS/Momo-6.webp", title: "Momo 6", desc: "Vinh danh tập thể CSKH xuất sắc" },
      { src: "https://i.postimg.cc/nh5W9bRL/Momo-7.webp", title: "Momo 7", desc: "Sự kiện văn hóa doanh nghiệp M_Service" },
      { src: "https://i.postimg.cc/cLjzty9H/Momo-8.webp", title: "Momo 8", desc: "Kỷ niệm công tác tại Ví điện tử MoMo" },
    ],
  },
  "2023": {
    key: "2023",
    code: "4.2",
    year: "2023",
    cardYearLabel: "2023 - 2024",
    cardYearColor: "text-amber-500",
    period: "Từ năm 2023 đến năm 2024",
    company: "Công ty cổ phần",
    subCompanies: "Công nghệ Finviet",
    tag: "FinTech & AI",
    tagCategory: "fintech",
    hexColor: "#FFB300",
    logo: "https://i.postimg.cc/mD6r1KHh/Finviet.png",
    bannerUrl: "https://i.postimg.cc/6QPS2Nhb/Finviet.png",
    memoryImg: "https://i.postimg.cc/L87WgKyx/Finviet-1.webp",
    headcount: 17,
    scaleDesc: "17 nhân sự trực tiếp",
    tenure: "1 Năm",
    roleTitle: "Trưởng Phòng CSKH",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Tại Ví ECO, tôi tiếp tục phát triển chuyên môn trong lĩnh vực tài chính, nơi mọi hoạt động đều đặt yêu cầu cao về tính chính xác, minh bạch và sự tin cậy.",
    cardDescription:
      "Trưởng phòng CSKH ngành tài chính số & bán lẻ B2B: xây dựng hệ thống CSKH hiện đại kết hợp quy trình SOP, Omnichannel & AI Bot 24/7.",
    paragraphs: [
      "Mở Rộng Hệ Sinh Thái & Dịch Vụ: Trực tiếp tham gia thiết lập và tối ưu hóa hệ thống CSKH từ giai đoạn đầu cho nhiều dịch vụ FinTech và Ví điện tử ECO. Xây dựng mô hình hỗ trợ linh hoạt, phù hợp với hành vi tiêu dùng và đặc thù giao dịch tài chính số của từng nhóm khách hàng.",
      "Chuyển Đổi Số TMĐT & FinTech: Ứng dụng tư duy quản trị tài chính số hiện đại; số hóa hành trình trải nghiệm người dùng, triển khai hỗ trợ đa kênh (Omnichannel) và khai thác dữ liệu giao dịch để kiểm soát rủi ro, phòng chống gian lận và tối ưu hiệu quả vận hành.",
      "Quản Trị Nguồn Lực & Đội Ngũ: Trực tiếp điều hành và phát triển bộ máy CSKH, xây dựng cơ cấu tổ chức, chuẩn hóa quy trình SOP, thiết lập hệ thống KPI/SLA và đào tạo nguồn nhân lực kế thừa đáp ứng tốc độ tăng trưởng của công ty.",
    ],
    intro: [
      {
        title: "1. Mở Rộng Hệ Sinh Thái & Dịch Vụ",
        desc: "Trực tiếp tham gia thiết lập và tối ưu hóa hệ thống CSKH từ giai đoạn đầu cho nhiều dịch vụ FinTech và Ví điện tử ECO. Xây dựng mô hình hỗ trợ linh hoạt, phù hợp với hành vi tiêu dùng và đặc thù giao dịch tài chính số của từng nhóm khách hàng.",
      },
      {
        title: "2. Chuyển Đổi Số TMĐT & FinTech",
        desc: "Ứng dụng tư duy quản trị tài chính số hiện đại; số hóa hành trình trải nghiệm người dùng, triển khai hỗ trợ đa kênh (Omnichannel) và khai thác dữ liệu giao dịch để kiểm soát rủi ro, phòng chống gian lận và tối ưu hiệu quả vận hành.",
      },
      {
        title: "3. Quản Trị Nguồn Lực & Đội Ngũ",
        desc: "Trực tiếp điều hành và phát triển bộ máy CSKH, xây dựng cơ cấu tổ chức, chuẩn hóa quy trình SOP, thiết lập hệ thống KPI/SLA và đào tạo nguồn nhân lực kế thừa đáp ứng tốc độ tăng trưởng của công ty.",
      },
    ],
    philosophy:
      "Kiên định với nguyên tắc xây dựng hệ thống nền tảng vững chắc trước khi mở rộng quy mô, kết hợp giữa quy trình, công nghệ tự động hóa và phát triển con người, luôn lấy sự tin cậy của khách hàng làm trung tâm.",
    industry: "FinTech / Ví điện tử / Công nghệ tài chính",
    products: [
      { src: "https://i.postimg.cc/mD6r1KHh/Finviet.png", alt: "Finviet ECO" },
    ],
    tasks: [
      "1. Quản lý và giám sát đội ngũ Dịch Vụ Khách Hàng Finviet;",
      "2. theo dõi, phân bổ cuộc gọi và xử lý ticket tự động;",
      "3. đánh giá và huấn luyện nhân viên Dịch Vụ Khách Hàng;",
      "4. lập kế hoạch và lịch trình vận hành hệ thống;",
      "5. xây dựng AI Bot CSKH tự động trả lời 24/7;",
      "6. quản lý yêu cầu khách hàng đa kênh (Email, Hotline, Chat);",
      "7. khảo sát sự hài lòng và phân tích dữ liệu CRM.",
    ],
    projects: [
      "1.1 · Xây dựng và vận hành Phòng Dịch vụ Khách hàng",
      "1.2 · Thiết lập mục tiêu phòng ban",
      "2.1 · Chuẩn hóa quy trình CSKH",
      "2.2 · Tối ưu hóa kênh hỗ trợ",
      "2.3 · Triển khai tự động hóa",
      "2.4 · Quản lý chiến dịch Outbound",
      "4.1 · Xây dựng hệ thống CRM",
      "4.2 · Phân tích & Báo cáo",
      "4.3 · Khảo sát & Đánh giá khách hàng",
      "4.4 · Xây dựng AI Bot",
      "5.1 · Phát triển đào tạo trực tuyến",
    ],
    commitments: [
      "Đảm bảo xử lý 100% khiếu nại cước và tra soát tài chính đúng quy trình SLA",
      "Nâng cao tỷ lệ giải quyết triệt để và minh bạch giao dịch ví điện tử.",
    ],
    kpis: [
      { label: "Chuẩn hóa quy trình", percent: 100, displayValue: "100%" },
      { label: "Phản hồi & Hỗ trợ", percent: 80, displayValue: "80%" },
      { label: "Hỗ trợ sự kiện lớn", percent: 70, displayValue: "70%" },
      { label: "Hoàn thành dự án", percent: 80, displayValue: "80%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/L87WgKyx/Finviet-1.webp", title: "Finviet 1", desc: "Đội ngũ Phòng Dịch vụ Khách hàng Finviet" },
    ],
  },
  "2026": {
    key: "2026",
    code: "4.1",
    year: "2026",
    cardYearLabel: "2026+ đến hiện tại",
    cardYearColor: "text-indigo-500",
    period: "2026+ đến hiện tại",
    company: "Sẵn sàng",
    subCompanies: "Cho thử thách mới",
    tag: "Lãnh đạo Chiến lược",
    tagCategory: "strategy",
    hexColor: "#0066FF",
    logo: "https://i.postimg.cc/sxQgYKYh/Power-Service.png",
    bannerUrl: "https://i.postimg.cc/Px871F32/Tim-Co-hoi.png",
    memoryImg: "https://i.postimg.cc/Px871F32/Tim-Co-hoi.png",
    videoCard: {
      idleUrl: "https://cdn.scena.ai/project/9626/d97de7f6bb813019350838499ee0f3b11f711487c7d9961679f3a43d8a3bf7ff.mp4",
      playUrl: "https://cdn.scena.ai/project/9626/a5b5bdf1659991c0c74510ddfc59b9d27a3c7478f17c711b0fc39c5e51cf43d2.mp4",
    },
    headcount: 150,
    scaleDesc: "Lãnh đạo cấp phòng ban (> 100 – 150+ nhân sự điều hành đa ca, đa kênh)",
    tenure: "Hiện tại",
    roleTitle: "Trưởng phòng CSKH",
    location: "TP. Hồ Chí Minh",
    highlightText:
      "Sẵn sàng đảm nhận vị trí Trưởng phòng Dịch vụ Khách hàng (Head of CS) hoặc Giám đốc Trải nghiệm Khách hàng (CS Director) tại các doanh nghiệp Công nghệ, FinTech, Bảo hiểm.",
    cardDescription:
      "Trưởng phòng / Giám đốc CX cấp cao (100–150+ NS): xây dựng hệ thống AI CRM, tự động hóa quy trình COPC và đào tạo lãnh đạo kế thừa.",
    paragraphs: [
      "Hoạch Định & Thực Thi Strategy: Hoạch định & thực thi CX Strategy 2026+; tích hợp Generative AI, RAG & Automation CRM thế hệ mới.",
      "Chuẩn Hóa Contact Center: Chuẩn hóa và tối ưu hóa vận hành Contact Center đa kênh; kiến tạo bộ chỉ số KPI, CSAT, NPS, FCR, SLA chuẩn quốc tế COPC.",
      "Đào Tạo Lãnh Đạo Kế Thừa: Chú trọng đào tạo và phát triển đội ngũ lãnh đạo kế thừa.",
    ],
    intro: [
      {
        title: "1. Hoạch Định & Thực Thi Strategy",
        desc: "Hoạch định & thực thi CX Strategy 2026+; tích hợp Generative AI, RAG & Automation CRM thế hệ mới.",
      },
      {
        title: "2. Chuẩn Hóa Contact Center",
        desc: "Chuẩn hóa và tối ưu hóa vận hành Contact Center đa kênh; kiến tạo bộ chỉ số KPI, CSAT, NPS, FCR, SLA chuẩn quốc tế COPC.",
      },
      {
        title: "3. Đào Tạo Lãnh Đạo Kế Thừa",
        desc: "Chú trọng đào tạo và phát triển đội ngũ lãnh đạo kế thừa.",
      },
    ],
    philosophy:
      "Đảm bảo tính liên tục của dịch vụ 24/7, duy trì tiêu chuẩn CSAT/NPS tối thiểu 95% - 98%, chuẩn hóa 100% tài liệu quy trình vận hành SOP.",
    industry: "Công nghệ / FinTech / Bảo hiểm / Bưu chính / Game & eSports / Viễn thông / CRM & Chuyển đổi số",
    products: [
      { src: "https://i.postimg.cc/sxQgYKYh/Power-Service.png", alt: "Power Service" },
    ],
    tasks: [
      "1. Hoạch định và thực thi chiến lược CX Strategy 2026+;",
      "2. tích hợp Generative AI, RAG & Automation CRM thế hệ mới;",
      "3. chuẩn hóa và tối ưu hóa vận hành Contact Center đa kênh;",
      "4. kiến tạo bộ chỉ số KPI, CSAT, NPS, FCR, SLA chuẩn quốc tế COPC;",
      "5. đào tạo phát triển lãnh đạo kế thừa.",
    ],
    projects: [
      "1. Triển khai Hệ sinh thái AI Agent Copilot",
      "2. Speech-to-Text Auto-QA",
      "3. Chuyển đổi số toàn diện cho Contact Center thế hệ mới",
    ],
    commitments: [
      "Đảm bảo tính liên tục của dịch vụ 24/7",
      "Duy trì tiêu chuẩn CSAT/NPS tối thiểu 95% - 98%, chuẩn hóa 100% tài liệu quy trình vận hành SOP.",
    ],
    kpis: [
      { label: "Sẵn sàng vận hành 24/7", percent: 100, displayValue: "100%" },
      { label: "Ứng dụng AI Chatbot & Automation", percent: 98, displayValue: "98%" },
      { label: "Tối ưu hóa chỉ số CSAT/NPS", percent: 95, displayValue: "> 95%" },
      { label: "Chuẩn hóa quy trình SOP 2026", percent: 100, displayValue: "100%" },
    ],
    photos: [
      { src: "https://i.postimg.cc/Px871F32/Tim-Co-hoi.png", title: "Tìm cơ hội", desc: "Sẵn sàng cho thử thách mới (2026+ đến hiện tại)" },
    ],
  },
};
