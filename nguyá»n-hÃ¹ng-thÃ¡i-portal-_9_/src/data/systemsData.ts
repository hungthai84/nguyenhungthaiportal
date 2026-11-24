import React from "react";
import { createAnimatedIcon } from "@/components/ui/MotionIcons";

const Server = createAnimatedIcon("server");
const Database = createAnimatedIcon("database");
const Network = createAnimatedIcon("network");
const Cpu = createAnimatedIcon("cpu");
const ShieldCheck = createAnimatedIcon("shield-check");
const Layers = createAnimatedIcon("layers");
const LayoutGrid = createAnimatedIcon("grid");
const MessageSquare = createAnimatedIcon("message-square");
const Bot = createAnimatedIcon("bot");
const Headphones = createAnimatedIcon("headphones");
const LineChart = createAnimatedIcon("line-chart");
const Coins = createAnimatedIcon("coins");
const Workflow = createAnimatedIcon("workflow");
const Globe = createAnimatedIcon("globe");

export interface PowerSystemItem {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  fullNameEn: string;
  category: string;
  badgeVi: string;
  badgeEn: string;
  badgeType: "active" | "pending" | "ai";
  url: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  watermarkIcon: React.ComponentType<{ className?: string }>;
  delay: number;
  featuresVi: string[];
  featuresEn: string[];
}

export const SYSTEM_CATEGORIES = [
  { id: "all", vi: "Tất cả (12)", en: "All (12)" },
  { id: "cskh", vi: "CSKH & Tổng đài", en: "CX & Contact Center" },
  { id: "erp", vi: "ERP & Quản trị", en: "ERP & Management" },
  { id: "ai", vi: "Trí tuệ Nhân tạo", en: "AI & Automation" },
  { id: "telecom", vi: "Viễn thông & Cloud", en: "Telecom & Cloud" }
];

export const POWER_SYSTEMS_12: PowerSystemItem[] = [
  {
    id: "crm",
    code: "SDP",
    nameVi: "Cổng làm việc CSKH",
    nameEn: "Service Delivery Platform",
    descVi: "Trang làm việc chính của Phòng CSKH, cổng truy cập tập trung để sử dụng toàn bộ các hệ thống nghiệp vụ.",
    descEn: "Service Delivery Platform: Main workspace for the Customer Service Department, a centralized access portal for all operational systems.",
    fullNameEn: "Service Delivery Platform",
    category: "cskh",
    badgeVi: "Hoạt động",
    badgeEn: "Active",
    badgeType: "active",
    url: "https://www.sdpplatfrom.powerservice.one",
    gradient: "from-blue-600 via-indigo-600 to-sky-600",
    icon: Database,
    watermarkIcon: Server,
    delay: 0,
    featuresVi: [
      "Cổng đăng nhập và truy cập tập trung (Single Sign-On & Portal) vào toàn bộ hệ sinh thái công cụ CSKH.",
      "Tích hợp bàn làm việc hợp nhất cho tư vấn viên (Single Agent Workspace & Omnichannel Interaction Hub).",
      "Kết nối và chuyển tiếp dữ liệu linh hoạt giữa các hệ thống CRM, ERP, HRM, BPM, OKR, LMS và AI Assistant.",
      "Quản lý phân quyền người dùng, điều phối luồng công việc và giám sát trạng thái vận hành thời gian thực."
    ],
    featuresEn: [
      "Centralized Single Sign-On & Portal access to the entire CSKH ecosystem.",
      "Integrated Single Agent Workspace & Omnichannel Interaction Hub.",
      "Flexible data connection and forwarding between CRM, ERP, HRM, BPM, OKR, LMS, and AI Assistant.",
      "User role management, workflow coordination, and real-time operational status monitoring."
    ]
  },
  {
    id: "erp",
    code: "ERP",
    nameVi: "Tài chính kế toán",
    nameEn: "Enterprise Resource Planning",
    descVi: "Quản lý nguồn lực doanh nghiệp, tài chính, kế toán, mua hàng, kho, sản xuất và tài sản.",
    descEn: "Managing enterprise resources, finance, accounting, purchasing, inventory, production, and assets.",
    fullNameEn: "Enterprise Resource Planning",
    category: "erp",
    badgeVi: "Đang chạy",
    badgeEn: "Live",
    badgeType: "active",
    url: "https://www.erpplatfrom.powerservice.one",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    icon: Server,
    watermarkIcon: Network,
    delay: 0.2,
    featuresVi: [
      "Quản lý hoạch định nguồn lực doanh nghiệp và tài chính kế toán.",
      "Tối ưu hóa quy trình mua hàng, quản lý kho và tài sản."
    ],
    featuresEn: [
      "Enterprise resource planning and financial accounting management.",
      "Optimization of purchasing, inventory, and asset management processes."
    ]
  },
  {
    id: "cc",
    code: "CRM",
    nameVi: "Quản lý Quan hệ Khách hàng",
    nameEn: "Customer Relationship Management",
    descVi: "Quản lý thông tin khách hàng 360 độ, bán hàng, marketing và hành trình trải nghiệm người dùng.",
    descEn: "Managing 360-degree customer information, sales, marketing, and user experience journeys.",
    fullNameEn: "Customer Relationship Management",
    category: "cskh",
    badgeVi: "Trực tuyến",
    badgeEn: "Online",
    badgeType: "active",
    url: "https://www.crmplatfrom.powerservice.one",
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    icon: Headphones,
    watermarkIcon: MessageSquare,
    delay: 0.4,
    featuresVi: [
      "Quản lý dữ liệu thông tin khách hàng 360 độ tập trung.",
      "Tối ưu hóa chiến dịch marketing, bán hàng và chăm sóc khách hàng."
    ],
    featuresEn: [
      "Centralized 360-degree customer data management.",
      "Optimization of marketing, sales, and customer service campaigns."
    ]
  },
  {
    id: "ai",
    code: "HRM",
    nameVi: "Quản lý Nguồn nhân lực",
    nameEn: "Human Resource Management",
    descVi: "Quản lý toàn bộ vòng đời nhân viên từ tuyển dụng, chấm công, tính lương đến đào tạo phát triển.",
    descEn: "Managing the entire employee lifecycle from recruitment, timekeeping, payroll, to training and development.",
    fullNameEn: "Human Resource Management",
    category: "ai",
    badgeVi: "AI Sẵn sàng",
    badgeEn: "AI Ready",
    badgeType: "ai",
    url: "https://www.hrmplatfrom.powerservice.one",
    gradient: "from-fuchsia-600 via-purple-600 to-pink-600",
    icon: Bot,
    watermarkIcon: Cpu,
    delay: 0.6,
    featuresVi: [
      "Quản lý tuyển dụng, hồ sơ nhân sự, chấm công và tính lương.",
      "Theo dõi đánh giá hiệu suất và lộ trình phát triển nhân viên."
    ],
    featuresEn: [
      "Management of recruitment, HR records, timekeeping, and payroll.",
      "Tracking of performance evaluations and employee development paths."
    ]
  },
  {
    id: "bi",
    code: "BPM",
    nameVi: "Quản lý Quy trình Nghiệp vụ",
    nameEn: "Business Process Management",
    descVi: "Số hóa và tự động hóa quy trình nghiệp vụ nhằm nâng cao hiệu quả vận hành liên phòng ban.",
    descEn: "Digitizing and automating business processes to improve cross-departmental operational efficiency.",
    fullNameEn: "Business Process Management",
    category: "erp",
    badgeVi: "Hoàn thiện",
    badgeEn: "Pending",
    badgeType: "pending",
    url: "https://www.bmpplatform.powerservice.one",
    gradient: "from-amber-600 via-orange-600 to-red-600",
    icon: LineChart,
    watermarkIcon: ShieldCheck,
    delay: 0.8,
    featuresVi: [
      "Số hóa và thiết kế quy trình luồng công việc tự động.",
      "Theo dõi và tối ưu hóa hiệu suất vận hành liên phòng ban."
    ],
    featuresEn: [
      "Digitization and design of automated workflow processes.",
      "Tracking and optimization of cross-departmental operational performance."
    ]
  },
  {
    id: "lms",
    code: "OKR",
    nameVi: "Quản lý Mục tiêu & Kết quả",
    nameEn: "Objectives & Key Results",
    descVi: "Thiết lập mục tiêu chiến lược, theo dõi kết quả then chốt và đánh giá hiệu suất minh bạch.",
    descEn: "Establishing strategic goals, tracking key results, and transparent performance evaluation.",
    fullNameEn: "Objectives & Key Results",
    category: "erp",
    badgeVi: "Hoạt động",
    badgeEn: "Active",
    badgeType: "active",
    url: "https://www.okrplatfrom.powerservice.one",
    gradient: "from-teal-600 via-emerald-600 to-green-600",
    icon: Layers,
    watermarkIcon: LayoutGrid,
    delay: 1.0,
    featuresVi: [
      "Thiết lập và quản lý bộ mục tiêu OKR chiến lược toàn công ty.",
      "Theo dõi tiến độ kết quả then chốt và đánh giá hiệu suất minh bạch."
    ],
    featuresEn: [
      "Establishing and managing company-wide strategic OKR sets.",
      "Tracking key results progress and transparent performance evaluation."
    ]
  },
  {
    id: "billing",
    code: "CLP",
    nameVi: "Khách hàng Thân thiết (Loyalty)",
    nameEn: "Customer Loyalty Program",
    descVi: "Quản lý chương trình thành viên, tích điểm, ưu đãi voucher và chiến dịch gia tăng sự trung thành.",
    descEn: "Managing membership programs, point accumulation, voucher offers, and loyalty campaigns.",
    fullNameEn: "Customer Loyalty Program",
    category: "telecom",
    badgeVi: "Bảo mật",
    badgeEn: "Secure",
    badgeType: "active",
    url: "https://www.clpplatform.powerservice.one",
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    icon: Coins,
    watermarkIcon: Globe,
    delay: 1.2,
    featuresVi: [
      "Quản lý phân hạng thành viên, chương trình tích điểm đổi quà.",
      "Phát hành voucher ưu đãi và triển khai các chiến dịch chăm sóc khách hàng thân thiết."
    ],
    featuresEn: [
      "Management of membership tiers and point redemption programs.",
      "Issuance of promotional vouchers and implementation of customer loyalty campaigns."
    ]
  },
  {
    id: "workflow",
    code: "LMS",
    nameVi: "Quản lý Đào tạo (Learning)",
    nameEn: "Learning Management System",
    descVi: "Xây dựng khóa học trực tuyến, kiểm tra đánh giá năng lực tự động và phát triển nguồn nhân lực.",
    descEn: "Building online courses, automated competency assessment, and human resource development.",
    fullNameEn: "Learning Management System",
    category: "ai",
    badgeVi: "Tự động",
    badgeEn: "Automated",
    badgeType: "active",
    url: "https://www.lmsplatfrom.powerservice.one",
    gradient: "from-rose-600 via-pink-600 to-purple-600",
    icon: Workflow,
    watermarkIcon: Cpu,
    delay: 1.4,
    featuresVi: [
      "Quản lý nội dung bài giảng, khóa học trực tuyến E-learning.",
      "Tự động hóa bài kiểm tra sát hạch và theo dõi tiến trình học tập."
    ],
    featuresEn: [
      "Management of lecture content and E-learning online courses.",
      "Automation of competency assessment tests and learning progress tracking."
    ]
  },
  {
    id: "telecom",
    code: "CSC",
    nameVi: "Trung tâm Chăm sóc Khách hàng",
    nameEn: "Customer Service Center",
    descVi: "Quản lý tương tác đa kênh (Omnichannel), tiếp nhận và xử lý Ticket, giám sát SLA và Helpdesk.",
    descEn: "Managing omnichannel interactions, receiving and processing tickets, monitoring SLA and Helpdesk.",
    fullNameEn: "Customer Service Center",
    category: "telecom",
    badgeVi: "99.99% Uptime",
    badgeEn: "99.99%",
    badgeType: "active",
    url: "https://www.cscplatform.powerservice.one",
    gradient: "from-sky-600 via-blue-600 to-indigo-700",
    icon: Network,
    watermarkIcon: Server,
    delay: 1.6,
    featuresVi: [
      "Tiếp nhận và quản lý yêu cầu hỗ trợ (Ticketing System) đa kênh.",
      "Theo dõi giám sát tuân thủ cam kết chất lượng dịch vụ SLA và Helpdesk."
    ],
    featuresEn: [
      "Omnichannel support request (Ticketing System) reception and management.",
      "Monitoring compliance with SLA and Helpdesk service quality commitments."
    ]
  },
  {
    id: "sec",
    code: "BI",
    nameVi: "Báo cáo & Phân tích",
    nameEn: "Business Intelligence Dashboard",
    descVi: "Trực quan hóa dữ liệu theo thời gian thực (Real-time Wallboard) hỗ trợ ra quyết định kinh doanh.",
    descEn: "Visualizing data in real-time (Real-time Wallboard) to support business decision-making.",
    fullNameEn: "Business Intelligence Dashboard",
    category: "erp",
    badgeVi: "ISO 27001",
    badgeEn: "Certified",
    badgeType: "active",
    url: "#",
    gradient: "from-slate-700 via-slate-800 to-indigo-950",
    icon: ShieldCheck,
    watermarkIcon: ShieldCheck,
    delay: 1.8,
    featuresVi: [
      "Tổng hợp và trực quan hóa các dữ liệu vận hành thời gian thực.",
      "Cung cấp báo cáo phân tích thông minh cho ban quản lý và C-Level."
    ],
    featuresEn: [
      "Aggregation and visualization of real-time operational data.",
      "Provision of smart analytics reports for management and C-Level executives."
    ]
  },
  {
    id: "portal",
    code: "POR",
    nameVi: "Cổng Khách hàng Thân thiết",
    nameEn: "Customer Self-Service Portal",
    descVi: "Cổng thông tin trực tuyến cho phép khách hàng tự tra cứu cước, tạo yêu cầu hỗ trợ và đổi điểm tích lũy.",
    descEn: "Online portal allowing customers to check bills, submit support tickets and redeem loyalty points.",
    fullNameEn: "Omnichannel Customer Self-Service Portal",
    category: "cskh",
    badgeVi: "Trực tuyến",
    badgeEn: "Online",
    badgeType: "active",
    url: "https://portal.powerservice.vn",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    icon: Globe,
    watermarkIcon: Network,
    delay: 2.0,
    featuresVi: [
      "Tra cứu cước & lịch sử dịch vụ 24/7",
      "Tạo và theo dõi tiến độ ticket hỗ trợ",
      "Chương trình khách hàng thân thiết VIP"
    ],
    featuresEn: [
      "Billing & service history lookup 24/7",
      "Create and track support ticket progress",
      "VIP customer loyalty program"
    ]
  },
  {
    id: "audit",
    code: "ADT",
    nameVi: "Giám sát & Kiểm soát Chất lượng",
    nameEn: "Quality Assurance & QA/QC",
    descVi: "Hệ thống chấm điểm cuộc gọi, đánh giá chất lượng phục vụ của điện thoại viên và báo cáo tuân thủ quy trình.",
    descEn: "Call scoring system, evaluating agent service quality and process compliance reporting.",
    fullNameEn: "Contact Center Quality Assurance Suite",
    category: "cskh",
    badgeVi: "Hoạt động",
    badgeEn: "Active",
    badgeType: "active",
    url: "https://audit.powerservice.vn",
    gradient: "from-emerald-700 via-teal-600 to-blue-700",
    icon: LayoutGrid,
    watermarkIcon: Layers,
    delay: 2.2,
    featuresVi: [
      "Biểu mẫu chấm điểm cuộc gọi chuẩn hóa",
      "Phân tích tự động nội dung đàm thoại AI",
      "Báo cáo hiệu suất QA/QC định kỳ"
    ],
    featuresEn: [
      "Standardized call scoring evaluation forms",
      "AI automated conversation content analysis",
      "Periodic QA/QC performance reporting"
    ]
  }
];
