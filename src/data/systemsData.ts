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
    id: "sdp",
    code: "SDP",
    nameVi: "Cổng Làm Việc Chăm Sóc Khách Hàng",
    nameEn: "Service Delivery Platform",
    descVi: "Cổng truy cập hợp nhất giúp tư vấn viên vận hành liền mạch mọi hệ thống nghiệp vụ CSKH.",
    descEn: "Unified workspace portal enabling service agents to operate all customer support systems seamlessly.",
    fullNameEn: "Service Delivery Platform",
    category: "cskh",
    badgeVi: "01 · SDP",
    badgeEn: "01 · SDP",
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
    nameVi: "Quản Lý Tài Chính Kế Toán Doanh Nghiệp",
    nameEn: "Enterprise Resource Planning",
    descVi: "Hoạch định nguồn lực tổng thể, kiểm soát chặt chẽ tài chính, kế toán, kho vận và tài sản.",
    descEn: "Comprehensive resource planning managing finance, accounting, procurement, inventory, and enterprise assets.",
    fullNameEn: "Enterprise Resource Planning",
    category: "erp",
    badgeVi: "02 · ERP",
    badgeEn: "02 · ERP",
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
    id: "crm",
    code: "CRM",
    nameVi: "Quản Lý Quan Hệ Khách Hàng",
    nameEn: "Customer Relationship Management",
    descVi: "Lưu trữ hồ sơ khách hàng toàn diện, tối ưu quy trình bán hàng, tiếp thị và chăm sóc.",
    descEn: "Centralizes 360-degree customer profiles to optimize sales pipelines, marketing campaigns, and retention.",
    fullNameEn: "Customer Relationship Management",
    category: "cskh",
    badgeVi: "03 · CRM",
    badgeEn: "03 · CRM",
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
    id: "hrm",
    code: "HRM",
    nameVi: "Quản Lý Nguồn Nhân Lực Doanh Nghiệp",
    nameEn: "Human Resource Management",
    descVi: "Quản lý trọn vẹn vòng đời nhân sự từ tuyển dụng, chấm công, tính lương đến đánh giá.",
    descEn: "Manages the complete employee lifecycle from recruitment, attendance, and payroll to growth.",
    fullNameEn: "Human Resource Management",
    category: "ai",
    badgeVi: "04 · HRM",
    badgeEn: "04 · HRM",
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
    id: "bpm",
    code: "BPM",
    nameVi: "Quản Lý Quy Trình Nghiệp Vụ",
    nameEn: "Business Process Management",
    descVi: "Số hóa luồng phê duyệt và tự động hóa tác vụ, nâng cao hiệu suất phối hợp liên phòng.",
    descEn: "Digitizes approval workflows and automates tasks to accelerate cross-departmental operational efficiency.",
    fullNameEn: "Business Process Management",
    category: "erp",
    badgeVi: "05 · BPM",
    badgeEn: "05 · BPM",
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
    id: "okr",
    code: "OKR",
    nameVi: "Quản Lý Mục Tiêu Kết Quả Doanh Nghiệp",
    nameEn: "Objectives & Key Results",
    descVi: "Thiết lập mục tiêu chiến lược, đo lường kết quả then chốt và đánh giá hiệu suất minh bạch.",
    descEn: "Aligns strategic objectives, tracks measurable key results, and ensures transparent performance reviews.",
    fullNameEn: "Objectives & Key Results",
    category: "erp",
    badgeVi: "06 · OKR",
    badgeEn: "06 · OKR",
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
    id: "clp",
    code: "CLP",
    nameVi: "Quản Lý Chương Trình Khách Hàng Thân Thiết",
    nameEn: "Customer Loyalty Program",
    descVi: "Quản lý phân hạng hội viên, tích điểm đổi quà, ưu đãi voucher và gia tăng gắn kết.",
    descEn: "Manages membership tiers, loyalty points, voucher campaigns, and long-term customer retention.",
    fullNameEn: "Customer Loyalty Program",
    category: "telecom",
    badgeVi: "07 · CLP",
    badgeEn: "07 · CLP",
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
    id: "lms",
    code: "LMS",
    nameVi: "Quản Lý Đào Tạo Học Tập Trực Tuyến",
    nameEn: "Learning Management System",
    descVi: "Triển khai khóa học trực tuyến, sát hạch năng lực tự động và rút ngắn thời gian hội nhập.",
    descEn: "Delivers e-learning courses, automated competency assessments, and faster employee onboarding programs.",
    fullNameEn: "Learning Management System",
    category: "ai",
    badgeVi: "08 · LMS",
    badgeEn: "08 · LMS",
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
    id: "csc",
    code: "CSC",
    nameVi: "Trung Tâm Dịch Vụ Chăm Sóc Khách Hàng",
    nameEn: "Customer Service Center",
    descVi: "Hợp nhất tương tác đa kênh, điều phối xử lý yêu cầu và giám sát cam kết SLA tức thì.",
    descEn: "Unifies omnichannel inquiries, streamlines ticket resolution, and monitors real-time SLA compliance.",
    fullNameEn: "Customer Service Center",
    category: "telecom",
    badgeVi: "09 · CSC",
    badgeEn: "09 · CSC",
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
    id: "bi",
    code: "BI",
    nameVi: "Hệ Thống Báo Cáo Phân Tích Dữ Liệu",
    nameEn: "Business Intelligence Dashboard",
    descVi: "Trực quan hóa chỉ số vận hành theo thời gian thực, hỗ trợ lãnh đạo ra quyết định nhanh.",
    descEn: "Visualizes operational metrics on real-time dashboards to empower faster data-driven leadership decisions.",
    fullNameEn: "Business Intelligence Dashboard",
    category: "erp",
    badgeVi: "10 · BI",
    badgeEn: "10 · BI",
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
    id: "ai",
    code: "AI",
    nameVi: "Trợ Lý Trí Tuệ Nhân Tạo Thông Minh",
    nameEn: "Artificial Intelligence Assistant",
    descVi: "Tra cứu tri thức tức thì, phân tích dữ liệu tự động và hỗ trợ xử lý tác vụ 24/7.",
    descEn: "Provides instant knowledge retrieval, automated data analysis, and 24/7 operational task assistance.",
    fullNameEn: "Artificial Intelligence Assistant",
    category: "ai",
    badgeVi: "11 · AI",
    badgeEn: "11 · AI",
    badgeType: "ai",
    url: "https://studio.d-id.com/agents/share?id=v2_agt_1tkm8qYc&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNRGMzTkRnMk5qUTNPVGt4T1RZeU16QTJOVFk2UkVkNldUaDFXR3R3VEUxTGVWTlpObkp5VUU1UQ==",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    icon: Globe,
    watermarkIcon: Network,
    delay: 2.0,
    featuresVi: [
      "Hỗ trợ tìm kiếm thông tin tri thức và trả lời câu hỏi thông minh.",
      "Tự động hóa xử lý tác vụ và phân tích dữ liệu đa nguồn."
    ],
    featuresEn: [
      "Instant knowledge lookup and smart question answering.",
      "Automation of task processing and multi-source data analysis."
    ]
  },
  {
    id: "pos",
    code: "POS",
    nameVi: "Quản Lý Bán Hàng Thanh Toán Tại Quầy",
    nameEn: "Point of Sale Operations",
    descVi: "Xử lý đơn hàng nhanh chóng, thanh toán linh hoạt và đồng bộ tồn kho doanh thu tức thì.",
    descEn: "Processes counter orders quickly, supports flexible payments, and syncs inventory revenue instantly.",
    fullNameEn: "Point of Sale Operations",
    category: "cskh",
    badgeVi: "12 · POS",
    badgeEn: "12 · POS",
    badgeType: "active",
    url: "https://powerservice.one/self-service",
    gradient: "from-emerald-700 via-teal-600 to-blue-700",
    icon: LayoutGrid,
    watermarkIcon: Layers,
    delay: 2.2,
    featuresVi: [
      "Quản lý giao dịch bán hàng và tích hợp các phương thức thanh toán.",
      "Đồng bộ tồn kho và báo cáo doanh thu tức thì."
    ],
    featuresEn: [
      "Sales transaction management and payment method integration.",
      "Real-time inventory and revenue report synchronization."
    ]
  }
];
