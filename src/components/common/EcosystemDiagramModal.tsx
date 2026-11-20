import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Activity,
  RotateCcw,
  Table,
  LayoutGrid,
  Users,
  UserCheck,
  Headset,
  Award,
  ShoppingCart,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Layers,
  KeyRound,
  GitMerge,
  Bot,
  Gauge,
  Lock,
  ExternalLink,
  LineChart,
  Cpu,
  Boxes,
  UserCog,
  GitBranch,
  Target,
  X,
  CheckCircle,
  Copy,
  Move
} from 'lucide-react';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface EcosystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowNotification?: (msg: string) => void;
}

// Dữ liệu chi tiết 12 phân hệ trong hệ sinh thái PowerService
const SYSTEMS_DATA: Record<string, any> = {
  SDP: {
    code: '9.1',
    name: 'Cổng làm việc CSKH',
    abbr: 'SDP',
    full: 'Service Delivery Platform',
    category: 'core',
    icon: 'layers',
    color: '#2563eb',
    desc: 'Service Delivery Platform: Trang làm việc chính của Phòng CSKH, cổng truy cập tập trung để sử dụng toàn bộ các hệ thống nghiệp vụ.',
    features: [
      'Cổng đăng nhập và truy cập tập trung (Single Sign-On & Portal) vào toàn bộ hệ sinh thái công cụ CSKH.',
      'Tích hợp bàn làm việc hợp nhất cho tư vấn viên (Single Agent Workspace & Omnichannel Interaction Hub).',
      'Kết nối và chuyển tiếp dữ liệu linh hoạt giữa các hệ thống CRM, ERP, HRM, BPM, OKR, LMS và AI Assistant.',
      'Quản lý phân quyền người dùng, điều phối luồng công việc và giám sát trạng thái vận hành thời gian thực.'
    ],
    url: 'https://www.sdpplatfrom.powerservice.one',
    flows: [
      { to: 'CRM', type: '2 Chiều', desc: 'Đồng bộ hồ sơ KH 360°, thông tin liên hệ và lịch sử tương tác' },
      { to: 'CSC', type: '2 Chiều', desc: 'Nhận Ticket tổng đài, gán việc cho Agent & đẩy tiến độ xử lý' },
      { to: 'CLP', type: '2 Chiều', desc: 'Tra cứu điểm thưởng, phát hành voucher ưu đãi trực tiếp' },
      { to: 'POS', type: 'Nhận data', desc: 'Tra cứu đơn mua tại quầy, chi tiết hóa đơn & đối soát' },
      { to: 'ERP', type: '2 Chiều', desc: 'Truy vấn công nợ, đối chiếu hóa đơn & kích hoạt xuất đổi hàng' },
      { to: 'BPM', type: 'Gửi trigger', desc: 'Khởi tạo luồng phê duyệt ngoại lệ (bồi hoàn, bảo hành)' },
      { to: 'HRM', type: 'Xác thực', desc: 'Đồng bộ danh sách tư vấn viên, ca trực & phân quyền tài khoản' },
      { to: 'OKR', type: 'Gửi chỉ số', desc: 'Tự động tính điểm năng suất giải quyết ticket và SLA vào OKR' },
      { to: 'LMS', type: 'Tra cứu', desc: 'Mở nhanh cẩm nang quy chuẩn nghiệp vụ & kiểm tra quy chuẩn' },
      { to: 'AI Assistant', type: 'Real-time API', desc: 'Gợi ý câu trả lời thông minh, phân tích cảm xúc hội thoại' },
      { to: 'BI Dashboard', type: 'Streaming', desc: 'Bơm dữ liệu KPI, thời lượng xử lý Ticket lên màn hình Wallboard' }
    ]
  },
  ERP: {
    code: '9.2',
    name: 'Tài chính kế toán',
    abbr: 'ERP',
    full: 'Enterprise Resource Planning',
    category: 'enterprise',
    icon: 'boxes',
    color: '#9333ea',
    desc: 'Quản lý nguồn lực doanh nghiệp, tài chính, kế toán, mua hàng, kho, sản xuất và tài sản.',
    features: [
      'Quản lý hoạch định nguồn lực doanh nghiệp và tài chính kế toán.',
      'Tối ưu hóa quy trình mua hàng, quản lý kho và tài sản.'
    ],
    url: 'https://www.erpplatfrom.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Đồng bộ', desc: 'Cung cấp dữ liệu tồn kho, tình trạng phiếu xuất hoàn tiền' },
      { to: 'POS', type: '2 Chiều', desc: 'Đồng bộ tồn kho tức thì khi có giao dịch bán lẻ tại quầy' },
      { to: 'BPM', type: '2 Chiều', desc: 'Tự động hạch toán sau khi quy trình duyệt chi hoàn tất' },
      { to: 'CRM', type: '2 Chiều', desc: 'Đồng bộ hợp đồng B2B, hóa đơn điện tử VAT và công nợ' },
      { to: 'HRM', type: 'Tài chính', desc: 'Tự động hạch toán quỹ lương, bảo hiểm và thưởng nhân sự' }
    ]
  },
  CRM: {
    code: '9.3',
    name: 'Quản lý Quan hệ Khách hàng',
    abbr: 'CRM',
    full: 'Customer Relationship Management',
    category: 'core_crm',
    icon: 'user-check',
    color: '#06b6d4',
    desc: 'Quản lý thông tin khách hàng 360 độ, bán hàng, marketing và hành trình trải nghiệm người dùng.',
    features: [
      'Quản lý dữ liệu thông tin khách hàng 360 độ tập trung.',
      'Tối ưu hóa chiến dịch marketing, bán hàng và chăm sóc khách hàng.'
    ],
    url: 'https://www.crmplatfrom.powerservice.one',
    flows: [
      { to: 'SDP', type: '2 Chiều', desc: 'Cung cấp lịch sử mua hàng, nhật ký tương tác và phân khúc KH' },
      { to: 'CLP', type: '2 Chiều', desc: 'Đồng bộ điểm tích lũy và điều kiện nâng hạng VIP' },
      { to: 'POS', type: '2 Chiều', desc: 'Nhận dữ liệu khách mua hàng tại quầy để cập nhật hồ sơ CRM' },
      { to: 'ERP', type: '2 Chiều', desc: 'Đồng bộ hợp đồng bán lẻ, công nợ và hóa đơn điện tử' },
      { to: 'BI', type: 'Streaming', desc: 'Đẩy dữ liệu phễu bán hàng, chuyển đổi và tỷ lệ rời bỏ (Churn)' }
    ]
  },
  HRM: {
    code: '9.4',
    name: 'Quản lý Nguồn nhân lực',
    abbr: 'HRM',
    full: 'Human Resource Management',
    category: 'enterprise',
    icon: 'user-cog',
    color: '#db2777',
    desc: 'Quản lý toàn bộ vòng đời nhân viên từ tuyển dụng, chấm công, tính lương đến đào tạo phát triển.',
    features: [
      'Quản lý tuyển dụng, hồ sơ nhân sự, chấm công và tính lương.',
      'Theo dõi đánh giá hiệu suất và lộ trình phát triển nhân viên.'
    ],
    url: 'https://www.hrmplatfrom.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Master Identity', desc: 'Cung cấp thông tin danh tính, phòng ban và ca trực CSKH' },
      { to: 'LMS', type: '2 Chiều', desc: 'Đồng bộ kết quả đào tạo nhân sự để phục vụ đánh giá nâng bậc' },
      { to: 'ERP', type: 'Hạch toán', desc: 'Truyền dữ liệu bảng lương định kỳ để hạch toán chi phí sổ cái' },
      { to: 'BPM', type: '2 Chiều', desc: 'Phê duyệt luồng tuyển dụng, bổ nhiệm và quản lý ngày phép' },
      { to: 'OKR', type: 'Đánh giá', desc: 'Đối chiếu kết quả hoàn thành OKR phục vụ xếp loại nhân sự' }
    ]
  },
  BPM: {
    code: '9.5',
    name: 'Quản lý Quy trình Nghiệp vụ',
    abbr: 'BPM',
    full: 'Business Process Management',
    category: 'enterprise',
    icon: 'git-branch',
    color: '#6366f1',
    desc: 'Số hóa và tự động hóa quy trình nghiệp vụ nhằm nâng cao hiệu quả vận hành liên phòng ban.',
    features: [
      'Số hóa và thiết kế quy trình luồng công việc tự động.',
      'Theo dõi và tối ưu hóa hiệu suất vận hành liên phòng ban.'
    ],
    url: 'https://www.bmpplatform.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Workflow', desc: 'Điều phối phê duyệt yêu cầu bồi hoàn, bảo hành đặc biệt từ CSKH' },
      { to: 'ERP', type: 'Trigger', desc: 'Kích hoạt hạch toán kế toán khi luồng duyệt hợp lệ' },
      { to: 'HRM', type: 'Phê duyệt', desc: 'Số hóa quy trình duyệt tuyển dụng, công tác và nghỉ phép' }
    ]
  },
  OKR: {
    code: '9.6',
    name: 'Quản lý Mục tiêu & Kết quả',
    abbr: 'OKR',
    full: 'Objectives & Key Results',
    category: 'enterprise',
    icon: 'target',
    color: '#f97316',
    desc: 'Thiết lập mục tiêu chiến lược, theo dõi kết quả then chốt và đánh giá hiệu suất minh bạch.',
    features: [
      'Thiết lập và quản lý bộ mục tiêu OKR chiến lược toàn công ty.',
      'Theo dõi tiến độ kết quả then chốt và đánh giá hiệu suất minh bạch.'
    ],
    url: 'https://www.okrplatfrom.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Chỉ tiêu', desc: 'Hiển thị chỉ tiêu OKR (CSAT, FCR, SLA) trực tiếp lên trang làm việc' },
      { to: 'BI', type: 'Đồng bộ', desc: 'Đối chiếu kết quả thực tế từ Wallboard với mục tiêu kế hoạch' },
      { to: 'HRM', type: 'Hiệu suất', desc: 'Cung cấp điểm số hoàn thành OKR phục vụ xét thưởng nhân viên' }
    ]
  },
  CLP: {
    code: '9.7',
    name: 'Khách hàng Thân thiết (Loyalty)',
    abbr: 'CLP',
    full: 'Customer Loyalty Program',
    category: 'core_crm',
    icon: 'award',
    color: '#eab308',
    desc: 'Quản lý chương trình thành viên, tích điểm, ưu đãi voucher và chiến dịch gia tăng sự trung thành.',
    features: [
      'Quản lý phân hạng thành viên, chương trình tích điểm đổi quà.',
      'Phát hành voucher ưu đãi và triển khai các chiến dịch chăm sóc khách hàng thân thiết.'
    ],
    url: 'https://www.clpplatform.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Real-time API', desc: 'Nhân viên áp mã coupon đền bù hoặc cộng điểm ưu đãi tức thì' },
      { to: 'CRM', type: '2 Chiều', desc: 'Cập nhật phân hạng và mức chi tiêu của từng khách' },
      { to: 'POS', type: 'Tra cứu', desc: 'Xác thực voucher & giảm giá trực tiếp khi khách thanh toán tại quầy' },
      { to: 'CSC', type: 'Đền bù', desc: 'Tự động phát hành voucher ưu đãi khi Agent giải quyết khiếu nại' }
    ]
  },
  LMS: {
    code: '9.8',
    name: 'Quản lý Đào tạo (Learning)',
    abbr: 'LMS',
    full: 'Learning Management System',
    category: 'intelligence',
    icon: 'graduation-cap',
    color: '#14b8a6',
    desc: 'Xây dựng khóa học trực tuyến, kiểm tra đánh giá năng lực tự động và phát triển nguồn nhân lực.',
    features: [
      'Quản lý nội dung bài giảng, khóa học trực tuyến E-learning.',
      'Tự động hóa bài kiểm tra sát hạch và theo dõi tiến trình học tập.'
    ],
    url: 'https://www.lmsplatfrom.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Portal', desc: 'Nhúng khóa học quy trình xử lý khủng hoảng và cẩm nang hỗ trợ' },
      { to: 'AI Assistant', type: 'Cơ sở tri thức', desc: 'Cung cấp giáo trình chuẩn để AI huấn luyện và giải đáp' },
      { to: 'HRM', type: 'Đồng bộ', desc: 'Cập nhật chứng chỉ và điểm sát hạch vào hồ sơ nhân sự' }
    ]
  },
  CSC: {
    code: '9.9',
    name: 'Trung tâm Chăm sóc Khách hàng',
    abbr: 'CSC',
    full: 'Customer Service Center',
    category: 'core_crm',
    icon: 'headset',
    color: '#6366f1',
    desc: 'Quản lý tương tác đa kênh (Omnichannel), tiếp nhận và xử lý Ticket, giám sát SLA và Helpdesk.',
    features: [
      'Tiếp nhận và quản lý yêu cầu hỗ trợ (Ticketing System) đa kênh.',
      'Theo dõi giám sát tuân thủ cam kết chất lượng dịch vụ SLA và Helpdesk.'
    ],
    url: 'https://www.cscplatform.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Hub cốt lõi', desc: 'Truyền tải luồng Ticket từ Hotline, Livechat, Zalo về Agent Workspace' },
      { to: 'CRM', type: 'Đồng bộ', desc: 'Ghi lại lịch sử tương tác cuộc gọi vào hồ sơ khách hàng 360°' },
      { to: 'AI Assistant', type: 'Streaming', desc: 'Voice AI Copilot phân tích cảm xúc và gợi ý phản hồi tức thời' },
      { to: 'CLP', type: 'API', desc: 'Yêu cầu kích hoạt voucher quà tặng xin lỗi khách hàng' }
    ]
  },
  BI: {
    code: '9.10',
    name: 'Báo cáo & Phân tích',
    abbr: 'BI Dashboard',
    full: 'Business Intelligence Dashboard',
    category: 'intelligence',
    icon: 'line-chart',
    color: '#22c55e',
    desc: 'Trực quan hóa dữ liệu theo thời gian thực (Real-time Wallboard) hỗ trợ ra quyết định kinh doanh.',
    features: [
      'Tổng hợp và trực quan hóa các dữ liệu vận hành thời gian thực.',
      'Cung cấp báo cáo phân tích thông minh cho ban quản lý và C-Level.'
    ],
    url: '(Đang hoàn thiện tích hợp)',
    isPending: true,
    flows: [
      { to: 'SDP', type: 'Nhận dữ liệu', desc: 'Thu nạp toàn bộ Event log, thời gian thao tác và trạng thái của Agent' },
      { to: 'Toàn hệ thống', type: 'ETL Pipeline', desc: 'Tổng hợp data từ CRM, ERP, POS, CSC và BPM phục vụ báo cáo BI' },
      { to: 'OKR', type: 'Đối chiếu', desc: 'Hiển thị tiến độ hoàn thành các chỉ tiêu trọng yếu thời gian thực' },
      { to: 'AI Assistant', type: 'Phân tích', desc: 'Nạp dữ liệu dự báo xu hướng khách hàng và rủi ro vận hành' }
    ]
  },
  AI: {
    code: '9.11',
    name: 'Trợ lý Trí tuệ Nhân tạo',
    abbr: 'AI Assistant',
    full: 'Artificial Intelligence Assistant',
    category: 'intelligence',
    icon: 'sparkles',
    color: '#8b5cf6',
    desc: 'Hỗ trợ người dùng bằng AI trong việc tìm kiếm tri thức, phân tích dữ liệu tự động và xử lý tác vụ 24/7.',
    features: [
      'Tìm kiếm và truy xuất cơ sở tri thức nghiệp vụ tự động 24/7.',
      'Hỗ trợ tư vấn viên gợi ý câu trả lời và tự động hóa xử lý tác vụ.'
    ],
    url: 'https://www.aiplatfrom.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Real-time Copilot', desc: 'Lắng nghe nội dung chat/thoại để đưa ra kịch bản trả lời mẫu tối ưu' },
      { to: 'LMS', type: 'Đọc tài liệu', desc: 'Nạp cơ sở tri thức từ quy trình LMS để trả lời chuẩn nghiệp vụ' },
      { to: 'CSC', type: 'Copilot', desc: 'Hỗ trợ tư vấn viên phân tích hội thoại và gợi ý câu trả lời theo thời gian thực' },
      { to: 'BI', type: 'Dự báo', desc: 'Cung cấp mô hình phân tích hành vi và dự đoán churn rate' }
    ]
  },
  POS: {
    code: '9.12',
    name: 'Quản lý Bán hàng tại Quầy',
    abbr: 'POS',
    full: 'Point of Sale',
    category: 'core_crm',
    icon: 'shopping-cart',
    color: '#10b981',
    desc: 'Quản lý đơn hàng, thanh toán, hóa đơn, tồn kho và đồng bộ hóa dữ liệu trực tiếp với CRM/ERP.',
    features: [
      'Quản lý giao dịch bán hàng, tạo đơn và thanh toán hóa đơn tại quầy.',
      'Đồng bộ dữ liệu đơn hàng và tồn kho trực tiếp với CRM/ERP.'
    ],
    url: 'https://www.posplatform.powerservice.one',
    flows: [
      { to: 'SDP', type: 'Tra cứu', desc: 'Cho phép CSKH kiểm tra hóa đơn mua trực tiếp tại quầy vật lý' },
      { to: 'ERP', type: '2 Chiều', desc: 'Trừ tồn kho ngay lập tức và hạch toán doanh số bán lẻ' },
      { to: 'CRM', type: '2 Chiều', desc: 'Tích điểm thành viên và lưu vết hành vi mua hàng tại cửa hàng' },
      { to: 'CLP', type: 'Tra cứu', desc: 'Xác thực mã ưu đãi coupon và chiết khấu điểm loyalty tại quầy' }
    ]
  }
};

// Phân quyền SDP
const SDP_ROLES: Record<string, any> = {
  admin: {
    title: 'Quản trị viên (Admin Toàn quyền)',
    badge: 'Toàn bộ 12 Phân hệ',
    accessibleNodes: ['CRM', 'CSC', 'CLP', 'POS', 'ERP', 'HRM', 'BPM', 'OKR', 'LMS', 'AI', 'BI']
  },
  lead: {
    title: 'Trưởng nhóm CSKH (Team Lead)',
    badge: 'CRM • CSC • CLP • BPM • OKR • BI • AI',
    accessibleNodes: ['CRM', 'CSC', 'CLP', 'BPM', 'OKR', 'BI', 'AI']
  },
  agent: {
    title: 'Tư vấn viên (Agent Workspace)',
    badge: 'CRM • CSC • CLP • AI • LMS • POS',
    accessibleNodes: ['CRM', 'CSC', 'CLP', 'AI', 'LMS', 'POS']
  }
};

// Cấu hình 11 tuyến kết nối vào Hub SDP
const SATELLITE_CONFIGS = [
  { id: 'CRM', category: 'core_crm', group: 'crm_retail', label: '360° Profile', color: '#0891b2' },
  { id: 'CSC', category: 'core_crm', group: 'crm_retail', label: 'Omni Tickets', color: '#4f46e5' },
  { id: 'CLP', category: 'core_crm', group: 'crm_retail', label: 'Loyalty & Points', color: '#ca8a04' },
  { id: 'POS', category: 'core_crm', group: 'crm_retail', label: 'POS In-store', color: '#059669' },
  { id: 'ERP', category: 'enterprise', group: 'enterprise', label: 'ERP Ledger', color: '#9333ea' },
  { id: 'HRM', category: 'enterprise', group: 'enterprise', label: 'HR Identity', color: '#db2777' },
  { id: 'BPM', category: 'enterprise', group: 'enterprise', label: 'BPM Approvals', color: '#4338ca' },
  { id: 'OKR', category: 'enterprise', group: 'enterprise', label: 'OKR Metrics', color: '#ea580c' },
  { id: 'AI',  category: 'intelligence', group: 'ai_bi', label: 'AI Copilot', color: '#7c3aed' },
  { id: 'LMS', category: 'intelligence', group: 'ai_bi', label: 'LMS Training', color: '#0d9488' },
  { id: 'BI',  category: 'intelligence', group: 'ai_bi', label: 'BI Telemetry', color: '#16a34a' }
];

// Cấu hình 16 tuyến dữ liệu liên phân hệ
const INTER_SYSTEM_LINKS = [
  { from: 'CRM', to: 'CSC', color: '#0284c7', offsetIdx: 1, side: 'left', group: 'crm_retail', label: 'Ticket 360°' },
  { from: 'CRM', to: 'CLP', color: '#d97706', offsetIdx: 2, side: 'left', group: 'crm_retail', label: 'Tier & Points' },
  { from: 'CRM', to: 'POS', color: '#059669', offsetIdx: 3, side: 'left', group: 'crm_retail', label: 'In-Store Trans' },
  { from: 'CSC', to: 'CLP', color: '#4f46e5', offsetIdx: 4, side: 'left', group: 'crm_retail', label: 'Gift & Point' },
  { from: 'CLP', to: 'POS', color: '#b45309', offsetIdx: 5, side: 'left', group: 'crm_retail', label: 'Voucher POS' },
  { from: 'ERP', to: 'HRM', color: '#db2777', offsetIdx: 1, side: 'right', group: 'enterprise', label: 'Payroll Ledger' },
  { from: 'BPM', to: 'ERP', color: '#7c3aed', offsetIdx: 2, side: 'right', group: 'enterprise', label: 'Auto Voucher' },
  { from: 'BPM', to: 'HRM', color: '#4f46e5', offsetIdx: 3, side: 'right', group: 'enterprise', label: 'HR Approval' },
  { from: 'HRM', to: 'OKR', color: '#ea580c', offsetIdx: 4, side: 'right', group: 'enterprise', label: 'Perf Review' },
  { from: 'AI',  to: 'LMS', color: '#7c3aed', offsetIdx: 1, isTopDirect: true, group: 'ai_bi', label: 'SOP Docs' },
  { from: 'CSC', to: 'AI',  color: '#8b5cf6', routeType: 'leftOuterToTop', offsetIdx: 6, group: 'ai_bi', label: 'Voice AI Copilot' },
  { from: 'CRM', to: 'ERP', color: '#0284c7', routeType: 'topCauseway', offsetIdx: 1, group: 'crm_retail', label: 'B2B Debt & Invoice' },
  { from: 'POS', to: 'ERP', color: '#059669', routeType: 'bottomToRightOuter', offsetIdx: 5, group: 'crm_retail', label: 'Sync Stock & Ledger' },
  { from: 'OKR', to: 'BI',  color: '#ea580c', routeType: 'rightToBottom', offsetIdx: 1, group: 'ai_bi', label: 'KPI Target' },
  { from: 'CRM', to: 'BI',  color: '#06b6d4', routeType: 'leftOuterToBottom', offsetIdx: 7, group: 'ai_bi', label: 'Funnel & Churn' },
  { from: 'AI',  to: 'BI',  color: '#8b5cf6', routeType: 'centerBypassToBottom', offsetIdx: 1, group: 'ai_bi', label: 'Predictive BI' }
];

// Bảng dữ liệu ma trận 21 tuyến truyền thông
const MATRIX_ROWS = [
  { from: 'SDP (Cổng CSKH)', dir: '⇄ 2 Chiều', to: 'CRM (Khách hàng)', data: 'Hồ sơ 360°, thông tin liên hệ, lịch sử tương tác', proto: 'REST API / OAuth2', freq: 'Real-time (<100ms)' },
  { from: 'SDP (Cổng CSKH)', dir: '⇄ 2 Chiều', to: 'CSC (Helpdesk)', data: 'Hàng đợi Ticket, Voice Call Event, SLA Counter', proto: 'WebSocket / WSS', freq: 'Streaming tức thời' },
  { from: 'SDP (Cổng CSKH)', dir: '⇄ 2 Chiều', to: 'CLP (Loyalty)', data: 'Điểm tích lũy, phân hạng VIP, cấp voucher', proto: 'GraphQL / REST', freq: 'Theo giao dịch' },
  { from: 'SDP (Cổng CSKH)', dir: '⇄ 2 Chiều', to: 'ERP (Tài chính)', data: 'Hóa đơn tài chính, đối soát hoàn tiền, tồn kho', proto: 'REST / JSON RPC', freq: 'Theo sự kiện' },
  { from: 'SDP (Cổng CSKH)', dir: '→ Gửi trigger', to: 'BPM (Quy trình)', data: 'Yêu cầu phê duyệt ngoại lệ: đổi trả, miễn giảm cước', proto: 'Kafka Event / Webhook', freq: 'Bất đồng bộ' },
  { from: 'HRM (Nhân sự)', dir: '→ 1 Chiều', to: 'SDP (Cổng CSKH)', data: 'Tài khoản Agent, quyền hạn, ca trực CSKH', proto: 'LDAP / SCIM / SSO', freq: 'Định kỳ & Khi đổi quyền' },
  { from: 'SDP (Cổng CSKH)', dir: '⇄ 2 Chiều', to: 'AI Assistant', data: 'Nội dung chat/thoại ➔ Gợi ý câu trả lời & tri thức', proto: 'gRPC / SSE Stream', freq: 'Thời gian thực (<50ms)' },
  { from: 'SDP (Cổng CSKH)', dir: '→ Đẩy metrics', to: 'OKR (Mục tiêu)', data: 'Chỉ số FCR, CSAT, vi phạm cam kết SLA', proto: 'RESTful API', freq: 'Cuối ca / Hàng ngày' },
  { from: 'SDP (Cổng CSKH)', dir: '⇄ Tra cứu', to: 'LMS (Đào tạo)', data: 'Sổ tay quy trình CSKH, kịch bản trả lời mẫu', proto: 'REST / SSO Embed', freq: 'Theo nhu cầu Agent' },
  { from: 'CSC (Tổng đài)', dir: '⇄ AI Copilot', to: 'AI Assistant', data: 'Voice Stream & Chat ➔ Gợi ý kịch bản trả lời tức thì', proto: 'gRPC / WebSocket', freq: 'Thời gian thực (<50ms)' },
  { from: 'CRM (Khách hàng)', dir: '⇄ 2 Chiều', to: 'ERP (Tài chính)', data: 'Hợp đồng B2B, hóa đơn điện tử, công nợ khách', proto: 'RESTful / Webhook', freq: 'Theo phát sinh đơn' },
  { from: 'POS (Quầy bán)', dir: '⇄ 2 Chiều', to: 'ERP & CRM', data: 'Doanh thu bán lẻ quầy, chiết khấu thẻ VIP, bill VAT', proto: 'RESTful / Message Queue', freq: 'Ngay khi in bill' },
  { from: 'CLP (Loyalty)', dir: '⇄ Tra cứu', to: 'POS (Quầy bán)', data: 'Xác thực voucher ưu đãi & chiết khấu điểm loyalty tại quầy', proto: 'RESTful API', freq: 'Thời gian thực' },
  { from: 'CSC (Tổng đài)', dir: '→ Cấp bù', to: 'CLP (Loyalty)', data: 'Tặng voucher ưu đãi, tích điểm đền bù khách hàng', proto: 'REST API', freq: 'Theo sự vụ' },
  { from: 'ERP (Tài chính)', dir: '⇄ 2 Chiều', to: 'HRM (Nhân sự)', data: 'Hạch toán chi phí lương, bảo hiểm, thưởng nhân sự', proto: 'Batch Job / REST', freq: 'Cuối kỳ tính lương' },
  { from: 'BPM (Quy trình)', dir: '⇄ 2 Chiều', to: 'HRM (Nhân sự)', data: 'Luồng phê duyệt tuyển dụng, thăng cấp, nghỉ phép', proto: 'Webhook / Kafka', freq: 'Theo yêu cầu duyệt' },
  { from: 'HRM (Nhân sự)', dir: '⇄ Đối chiếu', to: 'OKR (Mục tiêu)', data: 'Dữ liệu kết quả OKR phục vụ xếp loại hiệu suất nhân sự', proto: 'RESTful API', freq: 'Theo quý / Năm' },
  { from: 'AI Assistant', dir: '⇄ Đọc tri thức', to: 'LMS (Đào tạo)', data: 'Nạp bộ câu hỏi, cẩm nang CSKH phục vụ gợi ý trả lời', proto: 'Vector DB / Embedding', freq: 'Hàng ngày' },
  { from: 'AI Assistant', dir: '→ Dự báo', to: 'BI Dashboard', data: 'Mô hình phân tích hành vi và dự đoán churn rate', proto: 'Python API / Kafka', freq: 'Near-Realtime' },
  { from: 'CRM (Khách hàng)', dir: '→ Phân tích', to: 'BI Dashboard', data: 'Phễu chuyển đổi bán hàng, vòng đời khách hàng LTV', proto: 'ETL Pipeline', freq: 'Mỗi giờ' },
  { from: 'Toàn bộ 11 phân hệ', dir: '→ Streaming', to: 'BI Dashboard', data: 'Toàn bộ event tương tác, thời gian phản hồi, wallboard', proto: 'Kafka / ClickHouse / SQL', freq: 'Near-Realtime (5s)' }
];

// Helper render icon động từ lucide-react
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, any> = {
    layers: Layers,
    boxes: Boxes,
    'user-check': UserCheck,
    'user-cog': UserCog,
    'git-branch': GitBranch,
    target: Target,
    award: Award,
    'graduation-cap': GraduationCap,
    headset: Headset,
    'line-chart': LineChart,
    sparkles: Sparkles,
    'shopping-cart': ShoppingCart
  };
  const IconComp = icons[name] || Layers;
  return <IconComp className={className} />;
}

// Các hàm tính toán đường vẽ vuông góc bo góc (Orthogonal Manhattan Routing)
function makeOrthogonalBusPath(x1: number, y1: number, x2: number, y2: number, channelX: number, radius = 6) {
  if (Math.abs(y1 - y2) < 2) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const dirY = y2 > y1 ? 1 : -1;
  const dirX1 = channelX > x1 ? 1 : -1;
  const dirX2 = x2 > channelX ? 1 : -1;
  const r = Math.min(radius, Math.abs(channelX - x1) / 2, Math.abs(x2 - channelX) / 2, Math.abs(y2 - y1) / 2);
  if (r < 1) return `M ${x1} ${y1} L ${channelX} ${y1} L ${channelX} ${y2} L ${x2} ${y2}`;
  return [
    `M ${x1} ${y1}`,
    `L ${channelX - r * dirX1} ${y1}`,
    `Q ${channelX} ${y1} ${channelX} ${y1 + r * dirY}`,
    `L ${channelX} ${y2 - r * dirY}`,
    `Q ${channelX} ${y2} ${channelX + r * dirX2} ${y2}`,
    `L ${x2} ${y2}`
  ].join(' ');
}

function makeVerticalBusPath(x1: number, y1: number, x2: number, y2: number, channelY: number, radius = 6) {
  if (Math.abs(x1 - x2) < 2) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const dirX = x2 > x1 ? 1 : -1;
  const dirY1 = channelY > y1 ? 1 : -1;
  const dirY2 = y2 > channelY ? 1 : -1;
  const r = Math.min(radius, Math.abs(channelY - y1) / 2, Math.abs(y2 - channelY) / 2, Math.abs(x2 - x1) / 2);
  if (r < 1) return `M ${x1} ${y1} L ${x1} ${channelY} L ${x2} ${channelY} L ${x2} ${y2}`;
  return [
    `M ${x1} ${y1}`,
    `L ${x1} ${channelY - r * dirY1}`,
    `Q ${x1} ${channelY} ${x1 + r * dirX} ${channelY}`,
    `L ${x2 - r * dirX} ${channelY}`,
    `Q ${x2} ${channelY} ${x2} ${channelY + r * dirY2}`,
    `L ${x2} ${y2}`
  ].join(' ');
}

function makeOuterDetourPath(x1: number, y1: number, x2: number, y2: number, corridorX: number, radius = 5) {
  const dirY = y2 > y1 ? 1 : -1;
  const dirX1 = corridorX > x1 ? 1 : -1;
  const dirX2 = x2 > corridorX ? 1 : -1;
  const r = Math.min(radius, Math.abs(corridorX - x1) / 2, Math.abs(x2 - corridorX) / 2, Math.abs(y2 - y1) / 2);
  if (r < 1) return `M ${x1} ${y1} L ${corridorX} ${y1} L ${corridorX} ${y2} L ${x2} ${y2}`;
  return [
    `M ${x1} ${y1}`,
    `L ${corridorX - r * dirX1} ${y1}`,
    `Q ${corridorX} ${y1} ${corridorX} ${y1 + r * dirY}`,
    `L ${corridorX} ${y2 - r * dirY}`,
    `Q ${corridorX} ${y2} ${corridorX + r * dirX2} ${y2}`,
    `L ${x2} ${y2}`
  ].join(' ');
}

export const EcosystemDiagramModal: React.FC<EcosystemDiagramModalProps> = ({
  isOpen,
  onClose,
  onShowNotification,
}) => {
  // State quản lý UI và Filter
  const [currentRole, setCurrentRole] = useState('admin');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeLineGroup, setActiveLineGroup] = useState('all');
  const [showHubLines, setShowHubLines] = useState(true);
  const [showInterSystemLines, setShowInterSystemLines] = useState(true);
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'matrix'>('diagram');
  const [selectedSystemKey, setSelectedSystemKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Tọa độ dịch chuyển khi kéo thả từng thẻ
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Dữ liệu hình học SVG được tính toán động
  const [svgData, setSvgData] = useState<{
    hubLines: any[];
    hubDots: any[];
    hubBadges: any[];
    interLines: any[];
    interDots: any[];
    interBadges: any[];
  }>({
    hubLines: [],
    hubDots: [],
    hubBadges: [],
    interLines: [],
    interDots: [],
    interBadges: []
  });

  // Refs DOM
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (onShowNotification) {
      onShowNotification(msg);
    }
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 2300);
  }, [onShowNotification]);

  // Đóng Popover Filter khi click ra ngoài hoặc nhấn ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterOpen(false);
        if (selectedSystemKey) {
          setSelectedSystemKey(null);
        } else if (viewMode === 'matrix') {
          setViewMode('diagram');
        } else if (isOpen) {
          onClose();
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewMode, selectedSystemKey, isOpen, onClose]);

  // Tính toán toàn bộ đường line & nhãn chống chồng chéo
  const recalculateLines = useCallback(() => {
    if (viewMode !== 'diagram') return;
    const boardEl = boardRef.current;
    const sdpEl = nodeRefs.current['SDP'];
    if (!boardEl || !sdpEl) return;

    const svgRect = boardEl.getBoundingClientRect();
    const sdpRect = sdpEl.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return;

    const allowedNodes = SDP_ROLES[currentRole]?.accessibleNodes || [];
    const placedBadgeBoxes: any[] = [];

    const hubLines: any[] = [];
    const hubDots: any[] = [];
    const hubBadges: any[] = [];
    const interLines: any[] = [];
    const interDots: any[] = [];
    const interBadges: any[] = [];

    const createBadgeObj = (textStr: string, x: number, y: number, color: string) => {
      const approxWidth = textStr.length * 5.1 + 10;
      const badgeHeight = 14;
      const padX = 6;
      const padY = 8;

      let finalX = Math.max(approxWidth / 2 + padX, Math.min(svgRect.width - approxWidth / 2 - padX, x));
      let finalY = Math.max(badgeHeight / 2 + padY, Math.min(svgRect.height - badgeHeight / 2 - padY, y));

      const isColliding = (cx: number, cy: number) => {
        const left = cx - approxWidth / 2 - 2;
        const right = cx + approxWidth / 2 + 2;
        const top = cy - badgeHeight / 2 - 1.5;
        const bottom = cy + badgeHeight / 2 + 1.5;
        return placedBadgeBoxes.some(b => !(right < b.left || left > b.right || bottom < b.top || top > b.bottom));
      };

      if (isColliding(finalX, finalY)) {
        const offsetsY = [15, -15, 30, -30, 45, -45];
        let resolved = false;
        for (const dy of offsetsY) {
          const candY = finalY + dy;
          if (candY >= badgeHeight / 2 + padY && candY <= svgRect.height - badgeHeight / 2 - padY && !isColliding(finalX, candY)) {
            finalY = candY;
            resolved = true;
            break;
          }
        }
        if (!resolved) {
          for (const dx of [36, -36, 72, -72]) {
            const candX = finalX + dx;
            if (candX >= approxWidth / 2 + padX && candX <= svgRect.width - approxWidth / 2 - padX && !isColliding(candX, finalY)) {
              finalX = candX;
              break;
            }
          }
        }
      }

      placedBadgeBoxes.push({
        left: finalX - approxWidth / 2,
        right: finalX + approxWidth / 2,
        top: finalY - badgeHeight / 2,
        bottom: finalY + badgeHeight / 2
      });

      return { text: textStr, x: finalX, y: finalY, width: approxWidth, height: badgeHeight, color };
    };

    // 1. ĐƯỜNG LINE VÀO SDP HUB
    if (showHubLines) {
      const HUB_LINE_INACTIVE = '#94a3b8';
      const HUB_STROKE_WIDTH = '2.2';

      const sdpLeft = sdpRect.left - svgRect.left;
      const sdpRight = sdpRect.right - svgRect.left;
      const sdpTop = sdpRect.top - svgRect.top;
      const sdpBottom = sdpRect.bottom - svgRect.top;
      const sdpWidth = sdpRect.width;
      const sdpHeight = sdpRect.height;
      const sdpCenterX = sdpLeft + sdpWidth / 2;
      const sdpCenterY = sdpTop + sdpHeight / 2;

      const positionGroups: Record<string, any[]> = { left: [], right: [], top: [], bottom: [] };

      SATELLITE_CONFIGS.forEach(item => {
        const el = nodeRefs.current[item.id];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const nodeCenterX = r.left + r.width / 2 - svgRect.left;
        const nodeCenterY = r.top + r.height / 2 - svgRect.top;
        const dx = nodeCenterX - sdpCenterX;
        const dy = nodeCenterY - sdpCenterY;

        if (Math.abs(dx) >= Math.abs(dy) * 0.9) {
          if (dx < 0) positionGroups.left.push({ ...item, r, nodeCenterX, nodeCenterY });
          else positionGroups.right.push({ ...item, r, nodeCenterX, nodeCenterY });
        } else {
          if (dy < 0) positionGroups.top.push({ ...item, r, nodeCenterX, nodeCenterY });
          else positionGroups.bottom.push({ ...item, r, nodeCenterX, nodeCenterY });
        }
      });

      // Nhánh Trái
      positionGroups.left.sort((a, b) => a.nodeCenterY - b.nodeCenterY);
      const leftCount = positionGroups.left.length;
      positionGroups.left.forEach((item, index) => {
        const isGroupMatch = activeLineGroup === 'all' || activeLineGroup === 'sdp_hub' || activeLineGroup === item.group;
        if (!isGroupMatch) return;

        const isHighlighted = (activeFilter === 'all' || activeFilter === item.category) && allowedNodes.includes(item.id);
        const lineColor = isHighlighted ? item.color : HUB_LINE_INACTIVE;

        const targetPoint = { x: item.r.right - svgRect.left, y: item.r.top + item.r.height / 2 - svgRect.top };
        const sdpPortPoint = { x: sdpLeft, y: sdpTop + (sdpHeight * (index + 1)) / (leftCount + 1) };
        const gutterWidth = Math.max(20, sdpLeft - targetPoint.x);
        const channelX = targetPoint.x + (gutterWidth * (index + 1)) / (leftCount + 1.2);

        hubLines.push({
          key: `hub-l-${item.id}`,
          d: makeOrthogonalBusPath(sdpPortPoint.x, sdpPortPoint.y, targetPoint.x, targetPoint.y, channelX, 6),
          color: lineColor,
          strokeWidth: isHighlighted ? HUB_STROKE_WIDTH : '1.2',
          opacity: isHighlighted ? '0.95' : '0.22',
          animated: isAnimationActive && isHighlighted
        });
        hubDots.push({ key: `dot-l1-${item.id}`, cx: sdpPortPoint.x, cy: sdpPortPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubDots.push({ key: `dot-l2-${item.id}`, cx: targetPoint.x, cy: targetPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubBadges.push({
          key: `badge-l-${item.id}`,
          ...createBadgeObj(item.label, targetPoint.x + gutterWidth * 0.5, targetPoint.y, lineColor)
        });
      });

      // Nhánh Phải
      positionGroups.right.sort((a, b) => a.nodeCenterY - b.nodeCenterY);
      const rightCount = positionGroups.right.length;
      positionGroups.right.forEach((item, index) => {
        const isGroupMatch = activeLineGroup === 'all' || activeLineGroup === 'sdp_hub' || activeLineGroup === item.group;
        if (!isGroupMatch) return;

        const isHighlighted = (activeFilter === 'all' || activeFilter === item.category) && allowedNodes.includes(item.id);
        const lineColor = isHighlighted ? item.color : HUB_LINE_INACTIVE;

        const targetPoint = { x: item.r.left - svgRect.left, y: item.r.top + item.r.height / 2 - svgRect.top };
        const sdpPortPoint = { x: sdpRight, y: sdpTop + (sdpHeight * (index + 1)) / (rightCount + 1) };
        const gutterWidth = Math.max(20, targetPoint.x - sdpRight);
        const channelX = sdpRight + (gutterWidth * (rightCount - index)) / (rightCount + 1.2);

        hubLines.push({
          key: `hub-r-${item.id}`,
          d: makeOrthogonalBusPath(sdpPortPoint.x, sdpPortPoint.y, targetPoint.x, targetPoint.y, channelX, 6),
          color: lineColor,
          strokeWidth: isHighlighted ? HUB_STROKE_WIDTH : '1.2',
          opacity: isHighlighted ? '0.95' : '0.22',
          animated: isAnimationActive && isHighlighted
        });
        hubDots.push({ key: `dot-r1-${item.id}`, cx: sdpPortPoint.x, cy: sdpPortPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubDots.push({ key: `dot-r2-${item.id}`, cx: targetPoint.x, cy: targetPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubBadges.push({
          key: `badge-r-${item.id}`,
          ...createBadgeObj(item.label, sdpRight + gutterWidth * 0.5, targetPoint.y, lineColor)
        });
      });

      // Nhánh Trên
      positionGroups.top.sort((a, b) => a.nodeCenterX - b.nodeCenterX);
      const topCount = positionGroups.top.length;
      positionGroups.top.forEach((item, index) => {
        const isGroupMatch = activeLineGroup === 'all' || activeLineGroup === 'sdp_hub' || activeLineGroup === item.group;
        if (!isGroupMatch) return;

        const isHighlighted = (activeFilter === 'all' || activeFilter === item.category) && allowedNodes.includes(item.id);
        const lineColor = isHighlighted ? item.color : HUB_LINE_INACTIVE;

        const targetPoint = { x: item.r.left + item.r.width / 2 - svgRect.left, y: item.r.bottom - svgRect.top };
        const sdpPortPoint = { x: sdpLeft + (sdpWidth * (index + 1)) / (topCount + 1), y: sdpTop };
        const channelY = sdpPortPoint.y - Math.max(12, (sdpPortPoint.y - targetPoint.y) * 0.5);

        hubLines.push({
          key: `hub-t-${item.id}`,
          d: makeVerticalBusPath(sdpPortPoint.x, sdpPortPoint.y, targetPoint.x, targetPoint.y, channelY, 6),
          color: lineColor,
          strokeWidth: isHighlighted ? HUB_STROKE_WIDTH : '1.2',
          opacity: isHighlighted ? '0.95' : '0.22',
          animated: isAnimationActive && isHighlighted
        });
        hubDots.push({ key: `dot-t1-${item.id}`, cx: sdpPortPoint.x, cy: sdpPortPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubDots.push({ key: `dot-t2-${item.id}`, cx: targetPoint.x, cy: targetPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubBadges.push({
          key: `badge-t-${item.id}`,
          ...createBadgeObj(item.label, targetPoint.x, channelY, lineColor)
        });
      });

      // Nhánh Dưới
      positionGroups.bottom.sort((a, b) => a.nodeCenterX - b.nodeCenterX);
      const bottomCount = positionGroups.bottom.length;
      positionGroups.bottom.forEach((item, index) => {
        const isGroupMatch = activeLineGroup === 'all' || activeLineGroup === 'sdp_hub' || activeLineGroup === item.group;
        if (!isGroupMatch) return;

        const isHighlighted = (activeFilter === 'all' || activeFilter === item.category) && allowedNodes.includes(item.id);
        const lineColor = isHighlighted ? item.color : HUB_LINE_INACTIVE;

        const targetPoint = { x: item.r.left + item.r.width / 2 - svgRect.left, y: item.r.top - svgRect.top };
        const sdpPortPoint = { x: sdpLeft + (sdpWidth * (index + 1)) / (bottomCount + 1), y: sdpBottom };
        const channelY = sdpPortPoint.y + Math.max(12, (targetPoint.y - sdpPortPoint.y) * 0.5);

        hubLines.push({
          key: `hub-b-${item.id}`,
          d: makeVerticalBusPath(sdpPortPoint.x, sdpPortPoint.y, targetPoint.x, targetPoint.y, channelY, 6),
          color: lineColor,
          strokeWidth: isHighlighted ? HUB_STROKE_WIDTH : '1.2',
          opacity: isHighlighted ? '0.95' : '0.22',
          animated: isAnimationActive && isHighlighted
        });
        hubDots.push({ key: `dot-b1-${item.id}`, cx: sdpPortPoint.x, cy: sdpPortPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubDots.push({ key: `dot-b2-${item.id}`, cx: targetPoint.x, cy: targetPoint.y, r: isHighlighted ? 3.5 : 2.5, color: lineColor });
        hubBadges.push({
          key: `badge-b-${item.id}`,
          ...createBadgeObj(item.label, targetPoint.x, channelY, lineColor)
        });
      });
    }

    // 2. ĐƯỜNG LINE LIÊN HỆ THỐNG (HÀNH LANG NGOÀI TÁCH BIỆT, KHÔNG CẮT QUA THẺ)
    if (showInterSystemLines && activeLineGroup !== 'sdp_hub') {
      const sdpLeft = sdpRect.left - svgRect.left;
      const leftCoords = ['CRM', 'CSC', 'CLP', 'POS']
        .map(id => nodeRefs.current[id]?.getBoundingClientRect().left)
        .filter((val): val is number => typeof val === 'number');
      const rightCoords = ['ERP', 'HRM', 'BPM', 'OKR']
        .map(id => nodeRefs.current[id]?.getBoundingClientRect().right)
        .filter((val): val is number => typeof val === 'number');
      const leftCardAnchorX = (leftCoords.length ? Math.min(...leftCoords) : svgRect.left + 80) - svgRect.left;
      const rightCardAnchorX = (rightCoords.length ? Math.max(...rightCoords) : svgRect.right - 80) - svgRect.left;

      INTER_SYSTEM_LINKS.forEach((link, idx) => {
        if (activeLineGroup !== 'all' && link.group !== activeLineGroup) return;

        const fromEl = nodeRefs.current[link.from];
        const toEl = nodeRefs.current[link.to];
        if (!fromEl || !toEl) return;

        const isVisible = allowedNodes.includes(link.from) && allowedNodes.includes(link.to) && activeFilter === 'all';
        const fromR = fromEl.getBoundingClientRect();
        const toR = toEl.getBoundingClientRect();

        let pathData = '';
        let p1 = { x: 0, y: 0 };
        let p2 = { x: 0, y: 0 };
        let labelX = 0;
        let labelY = 0;

        const portRatioA = 0.25 + ((link.offsetIdx - 1) % 4) * 0.16;
        const portRatioB = 0.75 - ((link.offsetIdx - 1) % 4) * 0.16;

        if (link.isTopDirect) {
          p1 = { x: fromR.right - svgRect.left, y: fromR.top + fromR.height / 2 - svgRect.top };
          p2 = { x: toR.left - svgRect.left, y: toR.top + toR.height / 2 - svgRect.top };
          pathData = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
          labelX = (p1.x + p2.x) / 2;
          labelY = p1.y - 8;
        } else if (link.routeType === 'topCauseway') {
          p1 = { x: fromR.left + fromR.width * 0.5 - svgRect.left, y: fromR.top - svgRect.top };
          p2 = { x: toR.left + toR.width * 0.5 - svgRect.left, y: toR.top - svgRect.top };
          const topY = Math.max(5, 6 + (link.offsetIdx || 1) * 6);
          const dirX = p2.x > p1.x ? 1 : -1;
          pathData = [
            `M ${p1.x} ${p1.y}`,
            `L ${p1.x} ${topY + 4}`,
            `Q ${p1.x} ${topY} ${p1.x + 4 * dirX} ${topY}`,
            `L ${p2.x - 4 * dirX} ${topY}`,
            `Q ${p2.x} ${topY} ${p2.x} ${topY + 4}`,
            `L ${p2.x} ${p2.y}`
          ].join(' ');
          labelX = (p1.x + p2.x) * 0.5;
          labelY = topY + 2;
        } else if (link.routeType === 'leftOuterToTop') {
          p1 = { x: fromR.left - svgRect.left, y: fromR.top + fromR.height * 0.3 - svgRect.top };
          p2 = { x: toR.left + toR.width * 0.32 - svgRect.left, y: toR.top - svgRect.top };
          const corridorX = Math.max(6, leftCardAnchorX - 46);
          const topY = 12;
          pathData = [
            `M ${p1.x} ${p1.y}`,
            `L ${corridorX + 4} ${p1.y}`,
            `Q ${corridorX} ${p1.y} ${corridorX} ${p1.y - 4}`,
            `L ${corridorX} ${topY + 4}`,
            `Q ${corridorX} ${topY} ${corridorX + 4} ${topY}`,
            `L ${p2.x - 4} ${topY}`,
            `Q ${p2.x} ${topY} ${p2.x} ${topY + 4}`,
            `L ${p2.x} ${p2.y}`
          ].join(' ');
          labelX = (corridorX + p2.x) * 0.45;
          labelY = topY + 2;
        } else if (link.routeType === 'bottomToRightOuter') {
          p1 = { x: fromR.left + fromR.width * 0.5 - svgRect.left, y: fromR.bottom - svgRect.top };
          p2 = { x: toR.right - svgRect.left, y: toR.top + toR.height * 0.72 - svgRect.top };
          const bottomY = svgRect.height - 8;
          const corridorX = Math.min(svgRect.width - 6, rightCardAnchorX + 44);
          pathData = [
            `M ${p1.x} ${p1.y}`,
            `L ${p1.x} ${bottomY - 4}`,
            `Q ${p1.x} ${bottomY} ${p1.x + 4} ${bottomY}`,
            `L ${corridorX - 4} ${bottomY}`,
            `Q ${corridorX} ${bottomY} ${corridorX} ${bottomY - 4}`,
            `L ${corridorX} ${p2.y + 4}`,
            `Q ${corridorX} ${p2.y} ${corridorX - 4} ${p2.y}`,
            `L ${p2.x} ${p2.y}`
          ].join(' ');
          labelX = p1.x + (corridorX - p1.x) * 0.25;
          labelY = bottomY - 2;
        } else if (link.routeType === 'rightToBottom') {
          p1 = { x: fromR.left + fromR.width * 0.35 - svgRect.left, y: fromR.bottom - svgRect.top };
          p2 = { x: toR.right - svgRect.left, y: toR.top + toR.height * 0.5 - svgRect.top };
          pathData = makeVerticalBusPath(p1.x, p1.y, p2.x, p2.y, p2.y, 5);
          labelX = (p1.x + p2.x) / 2;
          labelY = p2.y;
        } else if (link.routeType === 'leftOuterToBottom') {
          p1 = { x: fromR.left - svgRect.left, y: fromR.top + fromR.height * 0.72 - svgRect.top };
          p2 = { x: toR.left - svgRect.left, y: toR.top + toR.height * 0.55 - svgRect.top };
          const corridorX = Math.max(4, leftCardAnchorX - 53);
          pathData = makeOuterDetourPath(p1.x, p1.y, p2.x, p2.y, corridorX, 5);
          labelX = p2.x - 48;
          labelY = p2.y;
        } else if (link.routeType === 'centerBypassToBottom') {
          p1 = { x: fromR.left + 16 - svgRect.left, y: fromR.bottom - svgRect.top };
          p2 = { x: toR.left + 16 - svgRect.left, y: toR.top - svgRect.top };
          const bypassX = Math.min(p1.x, sdpLeft - 12);
          pathData = makeOuterDetourPath(p1.x, p1.y, p2.x, p2.y, bypassX, 6);
          labelX = bypassX;
          labelY = sdpRect.bottom - svgRect.top + 14;
        } else if (link.side === 'left') {
          const corridorX = Math.max(8, leftCardAnchorX - (8 + (link.offsetIdx - 1) * 7.5));
          p1 = { x: fromR.left - svgRect.left, y: fromR.top + fromR.height * portRatioA - svgRect.top };
          p2 = { x: toR.left - svgRect.left, y: toR.top + toR.height * portRatioB - svgRect.top };
          pathData = makeOuterDetourPath(p1.x, p1.y, p2.x, p2.y, corridorX, 5);
          labelX = corridorX;
          const tRatio = 0.22 + ((link.offsetIdx - 1) % 5) * 0.14;
          labelY = p1.y + (p2.y - p1.y) * tRatio;
        } else {
          const corridorX = Math.min(svgRect.width - 8, rightCardAnchorX + (8 + (link.offsetIdx - 1) * 8.5));
          p1 = { x: fromR.right - svgRect.left, y: fromR.top + fromR.height * portRatioA - svgRect.top };
          p2 = { x: toR.right - svgRect.left, y: toR.top + toR.height * portRatioB - svgRect.top };
          pathData = makeOuterDetourPath(p1.x, p1.y, p2.x, p2.y, corridorX, 5);
          labelX = corridorX;
          const tRatio = 0.22 + ((link.offsetIdx - 1) % 4) * 0.18;
          labelY = p1.y + (p2.y - p1.y) * tRatio;
        }

        interLines.push({
          key: `inter-${link.from}-${link.to}-${idx}`,
          d: pathData,
          color: link.color,
          strokeWidth: isVisible ? '1.8' : '1',
          opacity: isVisible ? '0.85' : '0.12',
          animated: isAnimationActive && isVisible
        });

        if (isVisible) {
          interDots.push({ key: `idot-1-${link.from}-${link.to}-${idx}`, cx: p1.x, cy: p1.y, r: 2.5, color: link.color });
          interDots.push({ key: `idot-2-${link.from}-${link.to}-${idx}`, cx: p2.x, cy: p2.y, r: 2.5, color: link.color });
        }

        if (isVisible && link.label) {
          interBadges.push({
            key: `inter-badge-${link.from}-${link.to}-${idx}`,
            ...createBadgeObj(link.label, labelX, labelY, link.color)
          });
        }
      });
    }

    setSvgData({ hubLines, hubDots, hubBadges, interLines, interDots, interBadges });
  }, [currentRole, activeFilter, activeLineGroup, showHubLines, showInterSystemLines, isAnimationActive, viewMode]);

  useEffect(() => {
    if (!isOpen) return;
    recalculateLines();
    const settleTimer = setTimeout(recalculateLines, 420);
    const boardEl = boardRef.current;
    if (!boardEl || typeof ResizeObserver === 'undefined') {
      return () => clearTimeout(settleTimer);
    }

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(recalculateLines);
    });
    ro.observe(boardEl);
    window.addEventListener('resize', recalculateLines);
    return () => {
      clearTimeout(settleTimer);
      ro.disconnect();
      window.removeEventListener('resize', recalculateLines);
    };
  }, [recalculateLines, offsets, isOpen]);

  // Xử lý kéo thả (Drag & Drop) và Click xem chi tiết
  const handlePointerDown = (e: React.PointerEvent, sysKey: string) => {
    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('select')) return;

    const cardEl = nodeRefs.current[sysKey];
    const boardEl = boardRef.current;
    if (!cardEl || !boardEl) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialOffset = offsets[sysKey] || { x: 0, y: 0 };
    let hasMoved = false;

    const bRect = boardEl.getBoundingClientRect();
    const cRect = cardEl.getBoundingClientRect();
    const minX = initialOffset.x - (cRect.left - bRect.left) + 4;
    const maxX = initialOffset.x + (bRect.right - cRect.right) - 4;
    const minY = initialOffset.y - (cRect.top - bRect.top) + 4;
    const maxY = initialOffset.y + (bRect.bottom - cRect.bottom) - 4;

    setDraggingId(sysKey);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }
      const clampedX = Math.max(minX, Math.min(initialOffset.x + dx, maxX));
      const clampedY = Math.max(minY, Math.min(initialOffset.y + dy, maxY));

      setOffsets(prev => ({
        ...prev,
        [sysKey]: { x: clampedX, y: clampedY }
      }));
    };

    const onPointerUp = () => {
      setDraggingId(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (!hasMoved) {
        setSelectedSystemKey(sysKey);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const getNodeVisualStyle = (sysKey: string) => {
    const off = offsets[sysKey] || { x: 0, y: 0 };
    const style: React.CSSProperties = {
      transform: `translate(${off.x}px, ${off.y}px)`
    };

    if (sysKey === 'SDP') return style;

    const allowedNodes = SDP_ROLES[currentRole]?.accessibleNodes || [];
    const groupNodeMap: Record<string, string[]> = {
      all: ['SDP', 'CRM', 'CSC', 'CLP', 'POS', 'ERP', 'HRM', 'BPM', 'OKR', 'LMS', 'AI', 'BI'],
      sdp_hub: ['SDP', 'CRM', 'CSC', 'CLP', 'POS', 'ERP', 'HRM', 'BPM', 'OKR', 'LMS', 'AI', 'BI'],
      crm_retail: ['SDP', 'CRM', 'CSC', 'CLP', 'POS', 'ERP'],
      enterprise: ['SDP', 'ERP', 'HRM', 'BPM', 'OKR', 'LMS'],
      ai_bi: ['SDP', 'AI', 'LMS', 'CSC', 'BI', 'OKR', 'CRM']
    };

    const sys = SYSTEMS_DATA[sysKey];
    const isRoleAllowed = allowedNodes.includes(sysKey);
    const isCatAllowed = activeFilter === 'all' || sys?.category === activeFilter;
    const isGroupAllowed = (groupNodeMap[activeLineGroup] || groupNodeMap.all).includes(sysKey);

    if (!isRoleAllowed || !isCatAllowed || !isGroupAllowed) {
      style.opacity = 0.3;
      style.filter = 'grayscale(85%)';
    } else {
      style.opacity = 1;
      style.filter = 'none';
    }
    return style;
  };

  const activeFilterCount =
    (!showHubLines ? 1 : 0) +
    (!showInterSystemLines ? 1 : 0) +
    (activeLineGroup !== 'all' ? 1 : 0) +
    (activeFilter !== 'all' ? 1 : 0);

  const groupLabels: Record<string, string> = {
    all: 'Tất cả Lines',
    sdp_hub: 'Chỉ Trục SDP Hub',
    crm_retail: 'Nhóm Bán Hàng & KH',
    enterprise: 'Nhóm Quản Trị',
    ai_bi: 'Nhóm AI & Báo Cáo'
  };
  const catLabels: Record<string, string> = {
    all: '12 Phân hệ',
    core_crm: 'KH & Bán Hàng',
    enterprise: 'Quản Trị',
    intelligence: 'AI & Đào Tạo'
  };
  const filterSummaryText = `${groupLabels[activeLineGroup] || ''} • ${catLabels[activeFilter] || ''}`;

  const resetAllFilters = () => {
    setShowHubLines(true);
    setShowInterSystemLines(true);
    setActiveLineGroup('all');
    setActiveFilter('all');
    showToast('Đã đặt lại toàn bộ bộ lọc về mặc định');
  };

  const resetPositions = () => {
    setOffsets({});
    showToast('Đã đưa vị trí các thẻ về mặc định');
  };

  const handleCopyUrl = (url: string) => {
    if (!url || url.includes('Đang hoàn thiện')) return;
    navigator.clipboard?.writeText(url).catch(() => {});
    showToast(`Đã sao chép: ${url}`);
  };

  // Component render từng thẻ vệ tinh (Số thứ tự cùng hàng tên viết tắt, cỡ chữ tên đầy đủ bằng tên viết tắt)
  const renderSatelliteCard = (
    sysKey: string,
    themeClass: string,
    _badgeBgClass: string,
    iconTextColorClass: string,
    moveTextColorClass: string,
    isCompact = false
  ) => {
    const sys = SYSTEMS_DATA[sysKey];
    if (!sys) return null;
    const isDragging = draggingId === sysKey;
    const uniformTextSize = isCompact ? 'text-[10.5px] sm:text-[11px]' : 'text-[11px] sm:text-xs';

    return (
      <div
        key={sysKey}
        ref={el => { nodeRefs.current[sysKey] = el; }}
        onPointerDown={e => handlePointerDown(e, sysKey)}
        style={getNodeVisualStyle(sysKey)}
        className={`draggable-card ${themeClass} glass-flat-hover rounded-[14px] p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-md ${isDragging ? 'dragging' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <DynamicIcon
            name={sys.icon}
            className={`${isCompact ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-7 h-7 sm:w-8 sm:h-8'} ${iconTextColorClass} shrink-0`}
          />
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className={`font-bold text-slate-950 ${uniformTextSize} tracking-tight whitespace-nowrap leading-tight`}>
                {sys.abbr}
              </h4>
              <span className={`${isCompact ? 'w-5 h-5 text-[8.5px]' : 'w-6 h-6 text-[9px] sm:text-[9.5px]'} rounded-full bg-transparent ${iconTextColorClass} flex items-center justify-center shrink-0 border-[1.5px] border-current font-bold leading-none`}>
                {sys.code}
              </span>
            </div>
            <p className={`${uniformTextSize} text-slate-900 whitespace-nowrap font-bold mt-0.5 leading-tight`}>
              {sys.full}
            </p>
          </div>
        </div>

        <Move className={`w-3 h-3 ${moveTextColorClass} shrink-0 opacity-70`} />
      </div>
    );
  };

  const selectedSystem = selectedSystemKey ? SYSTEMS_DATA[selectedSystemKey] : null;
  const currentRoleData = SDP_ROLES[currentRole] || SDP_ROLES.admin;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={() => {
          SoundEngine.playTap();
          onClose();
        }}
        style={{
          background: 'var(--bg-modal-backdrop)',
          backdropFilter: 'blur(var(--blur-modal, 6px))',
          WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-[12px] sm:p-[18px] overflow-hidden"
      >
        {/* MODAL FULL CONTAINER: KÍCH THƯỚC BẰNG THẺ CHÍNH CHUẨN VỚI HIỆU ỨNG MỞ MƯỢT TỪ TỪ */}
        <motion.div
          id="ecosystem-diagram-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Sơ Đồ Liên Kết Hệ Sinh Thái 12 Phân Hệ PowerService"
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 18 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="theme-modal-card rounded-[14px] shadow-2xl flex flex-col relative z-50 text-left w-full h-full max-w-full max-h-full p-[12px] sm:p-[15px] overflow-hidden"
          style={{ width: '100%', height: '100%', padding: '15px' }}
        >
          {/* Scoped Style Rules */}
          <style>{`
            #ecosystem-diagram-modal .glass-flat {
              background: rgba(255, 255, 255, 0.92);
              backdrop-filter: blur(18px);
              -webkit-backdrop-filter: blur(18px);
              border: 1.5px solid rgba(203, 213, 225, 0.95);
              box-shadow: 0 10px 35px -4px rgba(71, 85, 105, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .glass-flat-hover {
              transition: box-shadow 0.2s ease, opacity 0.25s ease, filter 0.25s ease;
            }
            #ecosystem-diagram-modal .glass-flat-hover:hover {
              box-shadow: 0 14px 30px -4px rgba(30, 41, 59, 0.22), inset 0 1px 2px rgba(255, 255, 255, 1);
            }
            #ecosystem-diagram-modal .draggable-card {
              user-select: none;
              touch-action: none;
              width: fit-content;
              height: fit-content;
              max-width: 100%;
              cursor: grab;
            }
            #ecosystem-diagram-modal .draggable-card:active { cursor: grabbing; }
            #ecosystem-diagram-modal .dragging {
              opacity: 0.96 !important;
              z-index: 60 !important;
              cursor: grabbing !important;
              box-shadow: 0 22px 38px -5px rgba(15, 23, 42, 0.35), 0 0 0 2.5px rgba(37, 99, 235, 0.9) !important;
            }

            #ecosystem-diagram-modal .theme-sdp {
              background: linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.95) 50%, rgba(191, 219, 254, 0.9) 100%);
              border: 2px solid #3b82f6;
              box-shadow: 0 6px 20px -2px rgba(37, 99, 235, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-crm {
              background: linear-gradient(135deg, rgba(236, 254, 255, 0.98) 0%, rgba(207, 250, 254, 0.94) 100%);
              border: 2px solid #06b6d4;
              box-shadow: 0 5px 16px -2px rgba(6, 182, 212, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-csc {
              background: linear-gradient(135deg, rgba(238, 242, 255, 0.98) 0%, rgba(224, 231, 255, 0.94) 100%);
              border: 2px solid #6366f1;
              box-shadow: 0 5px 16px -2px rgba(99, 102, 241, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-clp {
              background: linear-gradient(135deg, rgba(254, 252, 232, 0.98) 0%, rgba(254, 240, 138, 0.92) 100%);
              border: 2px solid #eab308;
              box-shadow: 0 5px 16px -2px rgba(234, 179, 8, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-pos {
              background: linear-gradient(135deg, rgba(236, 253, 245, 0.98) 0%, rgba(167, 243, 208, 0.92) 100%);
              border: 2px solid #10b981;
              box-shadow: 0 5px 16px -2px rgba(16, 185, 129, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-erp {
              background: linear-gradient(135deg, rgba(250, 245, 255, 0.98) 0%, rgba(233, 213, 255, 0.94) 100%);
              border: 2px solid #a855f7;
              box-shadow: 0 5px 16px -2px rgba(168, 85, 247, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-hrm {
              background: linear-gradient(135deg, rgba(253, 242, 248, 0.98) 0%, rgba(251, 207, 232, 0.94) 100%);
              border: 2px solid #ec4899;
              box-shadow: 0 5px 16px -2px rgba(236, 72, 153, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-bpm {
              background: linear-gradient(135deg, rgba(240, 245, 255, 0.98) 0%, rgba(199, 210, 254, 0.94) 100%);
              border: 2px solid #6366f1;
              box-shadow: 0 5px 16px -2px rgba(99, 102, 241, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-okr {
              background: linear-gradient(135deg, rgba(255, 247, 237, 0.98) 0%, rgba(254, 215, 170, 0.94) 100%);
              border: 2px solid #f97316;
              box-shadow: 0 5px 16px -2px rgba(249, 115, 22, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-lms {
              background: linear-gradient(135deg, rgba(240, 253, 250, 0.98) 0%, rgba(153, 246, 228, 0.92) 100%);
              border: 2px solid #14b8a6;
              box-shadow: 0 5px 16px -2px rgba(20, 184, 166, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-ai {
              background: linear-gradient(135deg, rgba(245, 243, 255, 0.98) 0%, rgba(221, 214, 254, 0.95) 100%);
              border: 2px solid #8b5cf6;
              box-shadow: 0 5px 16px -2px rgba(139, 92, 246, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }
            #ecosystem-diagram-modal .theme-bi {
              background: linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(187, 247, 208, 0.94) 100%);
              border: 2px solid #22c55e;
              box-shadow: 0 5px 16px -2px rgba(34, 197, 94, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.98);
            }

            @keyframes ecoDashStream {
              to { stroke-dashoffset: -24; }
            }
            #ecosystem-diagram-modal .flow-stream {
              stroke-dasharray: 7, 5;
              animation: ecoDashStream 1.5s linear infinite;
            }
            #ecosystem-diagram-modal .inter-sys-stream {
              stroke-dasharray: 5, 4;
              animation: ecoDashStream 2s linear infinite;
            }



            /* Light Cowhide Leather inside Ecosystem Diagram Modal */
            html[data-card-style="light-cowhide-leather"] #ecosystem-diagram-modal .glass-flat,
            html[data-card-style="light-cowhide-leather"] #ecosystem-diagram-modal :is(.theme-sdp, .theme-crm, .theme-csc, .theme-clp, .theme-pos, .theme-erp, .theme-hrm, .theme-bpm, .theme-okr, .theme-lms, .theme-ai, .theme-bi) {
              background: linear-gradient(145deg, #fbfcfc 0%, #edf1f4 100%) !important;
              border: 2px solid #d1d5db !important;
              outline: 1.5px dashed rgba(17, 24, 39, 0.65);
              outline-offset: -4px;
              box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08), inset 0 1px 2px #ffffff !important;
              color: #111827 !important;
            }
            html[data-card-style="light-cowhide-leather"] #ecosystem-diagram-modal :is(.glass-flat, .theme-sdp, .theme-crm, .theme-csc, .theme-clp, .theme-pos, .theme-erp, .theme-hrm, .theme-bpm, .theme-okr, .theme-lms, .theme-ai, .theme-bi) :is(h3, h4, p, span) {
              color: #111827;
            }

            /* Dark Cowhide Leather inside Ecosystem Diagram Modal */
            html[data-card-style="cowhide-leather"] #ecosystem-diagram-modal .glass-flat,
            html[data-card-style="cowhide-leather"] #ecosystem-diagram-modal :is(.theme-sdp, .theme-crm, .theme-csc, .theme-clp, .theme-pos, .theme-erp, .theme-hrm, .theme-bpm, .theme-okr, .theme-lms, .theme-ai, .theme-bi) {
              background: linear-gradient(145deg, rgba(122, 74, 32, 0.94) 0%, rgba(82, 46, 16, 0.97) 100%) !important;
              border: 1.5px solid #522E10 !important;
              outline: 1px dashed rgba(245, 222, 179, 0.45);
              outline-offset: -4px;
              box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 220, 180, 0.2) !important;
              color: #FFFFFF !important;
            }
            html[data-card-style="cowhide-leather"] #ecosystem-diagram-modal :is(.glass-flat, .theme-sdp, .theme-crm, .theme-csc, .theme-clp, .theme-pos, .theme-erp, .theme-hrm, .theme-bpm, .theme-okr, .theme-lms, .theme-ai, .theme-bi) :is(.text-slate-950, .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600) {
              color: #FFFFFF !important;
            }
            html[data-card-style="cowhide-leather"] #ecosystem-diagram-modal :is(.bg-white, .bg-white\\/90, .bg-white\\/85, .bg-white\\/80, .bg-slate-50, .bg-slate-100) {
              background-color: rgba(61, 33, 11, 0.85) !important;
              border-color: rgba(245, 222, 179, 0.35) !important;
              color: #FDE68A !important;
            }

            /* Black Cowhide Leather inside Ecosystem Diagram Modal */
            html[data-card-style="black-cowhide-leather"] #ecosystem-diagram-modal .glass-flat,
            html[data-card-style="black-cowhide-leather"] #ecosystem-diagram-modal :is(.theme-sdp, .theme-crm, .theme-csc, .theme-clp, .theme-pos, .theme-erp, .theme-hrm, .theme-bpm, .theme-okr, .theme-lms, .theme-ai, .theme-bi) {
              background: linear-gradient(145deg, #252830 0%, #15171c 100%) !important;
              border: 1.5px solid #090a0d !important;
              outline: 1px dashed rgba(226, 232, 240, 0.45);
              outline-offset: -4px;
              box-shadow: 0 10px 24px rgba(0, 0, 0, 0.65), inset 0 1px 2px rgba(255, 255, 255, 0.08) !important;
              color: #FFFFFF !important;
            }
            html[data-card-style="black-cowhide-leather"] #ecosystem-diagram-modal :is(.glass-flat, .theme-sdp, .theme-crm, .theme-csc, .theme-clp, .theme-pos, .theme-erp, .theme-hrm, .theme-bpm, .theme-okr, .theme-lms, .theme-ai, .theme-bi) :is(.text-slate-950, .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600) {
              color: #FFFFFF !important;
            }
            html[data-card-style="black-cowhide-leather"] #ecosystem-diagram-modal :is(.bg-white, .bg-white\\/90, .bg-white\\/85, .bg-white\\/80, .bg-slate-50, .bg-slate-100) {
              background-color: rgba(17, 19, 24, 0.9) !important;
              border-color: rgba(226, 232, 240, 0.28) !important;
              color: #E2E8F0 !important;
            }
          `}</style>

          {/* TOP HEADER */}
          <header className="theme-modal-header -mx-[15px] -mt-[15px] px-[15px] pt-3 pb-2.5 flex items-center justify-between z-30 shrink-0 gap-2 relative">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-[14px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <GitMerge className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="typo-popup-title font-play truncate" style={{ color: 'var(--accent-blue, var(--color-primary))' }}>
                  Sơ đồ liên kết
                </h2>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Filter Popover */}
              <div className="relative" ref={filterWrapperRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFilterOpen(prev => !prev);
                  }}
                  title="Mở bộ lọc hệ thống & luồng dữ liệu"
                  aria-label="Bộ lọc"
                  className="banner-control-pill w-8 h-8 rounded-full typo-label font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  <Filter className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                </button>

                {isFilterOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="theme-popup absolute right-0 mt-1.5 w-[310px] sm:w-[350px] rounded-[14px] shadow-2xl p-3 z-50 space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-subcard)' }}>
                      <span className="typo-body-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                        <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                        Tùy chỉnh Hiển thị & Bộ lọc
                      </span>
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="typo-label font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        style={{ color: 'var(--text-link, var(--color-primary))' }}
                      >
                        <RefreshCw className="w-3 h-3" /> Mặc định
                      </button>
                    </div>

                    {/* Nhóm 1: Bật/Tắt Loại Đường Kết Nối */}
                    <div className="space-y-1.5">
                      <label className="typo-label font-bold tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
                        1. Hiển thị Loại Đường Kết Nối
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 typo-label">
                        <button
                          type="button"
                          onClick={() => setShowHubLines(prev => !prev)}
                          style={
                            showHubLines
                              ? { background: 'var(--bg-button-primary)', color: '#FFFFFF' }
                              : { background: 'var(--bg-button-secondary)', color: 'var(--text-secondary)' }
                          }
                          className="px-2 py-1.5 rounded-[14px] font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>{showHubLines ? 'Line vào SDP' : 'Line vào SDP (Tắt)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowInterSystemLines(prev => !prev)}
                          style={
                            showInterSystemLines
                              ? { background: 'var(--bg-button-primary)', color: '#FFFFFF' }
                              : { background: 'var(--bg-button-secondary)', color: 'var(--text-secondary)' }
                          }
                          className="px-2 py-1.5 rounded-[14px] font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>{showInterSystemLines ? 'Line Liên Hệ Thống' : 'Line Liên HT (Tắt)'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAnimationActive(prev => !prev)}
                        className="theme-modal-subcard w-full px-2.5 py-1.5 rounded-[14px] flex items-center justify-between font-bold typo-label transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} /> Hiệu ứng luồng tín hiệu
                        </span>
                        <span
                          className="px-1.5 py-0.2 rounded font-bold typo-badge"
                          style={
                            isAnimationActive
                              ? { background: 'rgba(16, 185, 129, 0.16)', color: 'var(--accent-emerald, #059669)' }
                              : { background: 'var(--bg-button-secondary)', color: 'var(--text-muted)' }
                          }
                        >
                          {isAnimationActive ? 'Đang chạy' : 'Tạm dừng'}
                        </span>
                      </button>
                    </div>

                    {/* Nhóm 2: Lọc Nhóm Tuyến Line */}
                    <div className="space-y-1.5 border-t pt-2.5" style={{ borderColor: 'var(--border-subcard)' }}>
                      <label className="typo-label font-bold tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
                        2. Lọc Nhóm Tuyến Line
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { key: 'all', label: 'Tất cả (28 Lines)' },
                          { key: 'sdp_hub', label: 'Chỉ Trục SDP Hub (11)' },
                          { key: 'crm_retail', label: 'Bán Hàng & KH' },
                          { key: 'enterprise', label: 'Quản Trị Doanh Nghiệp' },
                          { key: 'ai_bi', label: 'Trí Tuệ & Báo Cáo' }
                        ].map(item => (
                          <button
                            key={item.key}
                            type="button"
                            data-selected={activeLineGroup === item.key ? 'true' : undefined}
                            onClick={() => setActiveLineGroup(item.key)}
                            className={`theme-dropdown-option px-2 py-1 rounded-[8px] typo-label transition-all cursor-pointer ${
                              activeLineGroup === item.key ? 'font-bold shadow-xs' : 'font-semibold'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nhóm 3: Lọc Nhóm Thẻ Phân Hệ */}
                    <div className="space-y-1.5 border-t pt-2.5" style={{ borderColor: 'var(--border-subcard)' }}>
                      <label className="typo-label font-bold tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
                        3. Lọc Nhóm Thẻ Phân Hệ
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { key: 'all', label: 'Tất cả (12 Phân hệ)' },
                          { key: 'core_crm', label: 'KH & Bán Hàng' },
                          { key: 'enterprise', label: 'Quản Trị Vận Hành' },
                          { key: 'intelligence', label: 'AI & Đào Tạo' }
                        ].map(cat => (
                          <button
                            key={cat.key}
                            type="button"
                            data-selected={activeFilter === cat.key ? 'true' : undefined}
                            onClick={() => setActiveFilter(cat.key)}
                            className={`theme-dropdown-option px-2 py-1 rounded-[8px] text-left typo-label transition-all cursor-pointer ${
                              activeFilter === cat.key ? 'font-bold shadow-xs' : 'font-semibold'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {viewMode === 'diagram' && (
                <button
                  type="button"
                  onClick={resetPositions}
                  title="Đưa vị trí các thẻ về mặc định ban đầu"
                  className="banner-control-pill px-2.5 py-1 rounded-full typo-label font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Khôi phục</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewMode(prev => (prev === 'diagram' ? 'matrix' : 'diagram'))}
                style={viewMode === 'matrix' ? { background: 'var(--bg-button-primary)' } : undefined}
                className={`px-2.5 py-1 rounded-full typo-label font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'text-white border border-transparent'
                    : 'banner-control-pill'
                }`}
              >
                {viewMode === 'matrix' ? (
                  <>
                    <LayoutGrid className="w-3 h-3" />
                    <span>Sơ Đồ</span>
                  </>
                ) : (
                  <>
                    <Table className="w-3 h-3" />
                    <span>Ma Trận</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* MAIN DIAGRAM / MATRIX BODY */}
          <main className="flex-1 overflow-hidden p-1 sm:p-2 relative flex flex-col justify-between min-h-0 mt-2">
            {viewMode === 'matrix' ? (
              /* MA TRẬN LUỒNG DỮ LIỆU TÍCH HỢP */
              <div className="theme-modal-subcard flex-1 flex flex-col rounded-[14px] overflow-hidden min-h-0 shadow-inner">
                <div className="theme-modal-header px-4 py-2.5 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="typo-h4 font-bold" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
                      Ma Trận Luồng Dữ Liệu & Giao Thức (12 Hệ Thống • 21 Tuyến Kết Nối)
                    </h3>
                    <p className="typo-caption font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Chi tiết hướng truyền tải, giao thức kỹ thuật và tần suất đồng bộ giữa SDP và các phân hệ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode('diagram')}
                    className="theme-modal-close px-3 py-1.5 rounded-full typo-button font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Quay lại Sơ Đồ
                  </button>
                </div>

                <div className="flex-1 overflow-auto horizontal-scroll-smooth p-1">
                  <table className="theme-table w-full text-left border-collapse typo-caption">
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b font-bold typo-label" style={{ borderColor: 'var(--border-table)' }}>
                        <th className="py-2 px-3">Hệ thống nguồn</th>
                        <th className="py-2 px-3 text-center">Hướng</th>
                        <th className="py-2 px-3">Hệ thống đích</th>
                        <th className="py-2 px-3">Nội dung dữ liệu truyền tải</th>
                        <th className="py-2 px-3">Giao thức</th>
                        <th className="py-2 px-3">Tần suất</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium" style={{ borderColor: 'var(--border-table)' }}>
                      {MATRIX_ROWS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-sky-500/10 transition-colors">
                          <td className="py-2 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--text-heading, var(--text-primary))' }}>{row.from}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold whitespace-nowrap" style={{ color: 'var(--color-primary)' }}>{row.dir}</td>
                          <td className="py-2 px-3 font-bold whitespace-nowrap" style={{ color: 'var(--text-heading, var(--text-primary))' }}>{row.to}</td>
                          <td className="py-2 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>{row.data}</td>
                          <td className="py-2 px-3 font-mono font-bold whitespace-nowrap" style={{ color: 'var(--color-primary)' }}>{row.proto}</td>
                          <td className="py-2 px-3 font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{row.freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* SƠ ĐỒ KIẾN TRÚC TƯƠNG TÁC */
              <div
                ref={boardRef}
                style={{
                  background: 'var(--bg-nested-card)',
                  borderColor: 'var(--border-subcard)',
                }}
                className="relative flex-1 flex flex-col justify-between rounded-[14px] p-2 sm:p-2.5 min-h-0 overflow-hidden border"
              >
                {/* SVG LAYER 1: Lines (Z-10) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    {svgData.interLines.map(line => (
                      <path
                        key={line.key}
                        d={line.d}
                        fill="none"
                        stroke={line.color}
                        strokeWidth={line.strokeWidth}
                        strokeOpacity={line.opacity}
                        className={line.animated ? 'inter-sys-stream' : undefined}
                        strokeDasharray={line.animated ? undefined : '4, 4'}
                      />
                    ))}
                    {svgData.interDots.map(dot => (
                      <circle key={dot.key} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} />
                    ))}
                  </g>
                  <g>
                    {svgData.hubLines.map(line => (
                      <path
                        key={line.key}
                        d={line.d}
                        fill="none"
                        stroke={line.color}
                        strokeWidth={line.strokeWidth}
                        strokeOpacity={line.opacity}
                        className={line.animated ? 'flow-stream' : undefined}
                        strokeDasharray={line.animated ? undefined : '5, 5'}
                      />
                    ))}
                    {svgData.hubDots.map(dot => (
                      <circle key={dot.key} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} />
                    ))}
                  </g>
                </svg>

                {/* SVG LAYER 2: Badges (Z-30) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="badgeShadow" x="-15%" y="-25%" width="130%" height="160%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0f172a" floodOpacity="0.16" />
                    </filter>
                  </defs>
                  <g>
                    {svgData.interBadges.map(badge => (
                      <g key={badge.key} transform={`translate(${badge.x}, ${badge.y})`} filter="url(#badgeShadow)">
                        <rect
                          x={-badge.width / 2}
                          y={-badge.height / 2}
                          width={badge.width}
                          height={badge.height}
                          rx={4}
                          fill="#ffffff"
                          stroke={badge.color}
                          strokeWidth="1.2"
                        />
                        <text
                          x={0}
                          y={3.3}
                          textAnchor="middle"
                          fill={badge.color}
                          fontSize="8px"
                          fontWeight="700"
                          fontFamily="'Play', sans-serif"
                        >
                          {badge.text}
                        </text>
                      </g>
                    ))}
                  </g>
                  <g>
                    {svgData.hubBadges.map(badge => (
                      <g key={badge.key} transform={`translate(${badge.x}, ${badge.y})`} filter="url(#badgeShadow)">
                        <rect
                          x={-badge.width / 2}
                          y={-badge.height / 2}
                          width={badge.width}
                          height={badge.height}
                          rx={4}
                          fill="#ffffff"
                          stroke={badge.color}
                          strokeWidth="1.2"
                        />
                        <text
                          x={0}
                          y={3.3}
                          textAnchor="middle"
                          fill={badge.color}
                          fontSize="8px"
                          fontWeight="700"
                          fontFamily="'Play', sans-serif"
                        >
                          {badge.text}
                        </text>
                      </g>
                    ))}
                  </g>
                </svg>

                {/* GRID LAYOUT 3 CỘT CÂN XỨNG */}
                <div className="relative z-20 grid grid-cols-12 gap-2 sm:gap-3 lg:gap-4 h-full items-stretch min-h-0 overflow-y-auto md:overflow-hidden no-scrollbar px-1 sm:px-2">
                  {/* CỘT TRÁI (TÂY): 4 Hệ Thống Khách hàng & Điểm Bán (Tạo lề ngoài bên trái cho đường liên hệ thống) */}
                  <div className="col-span-12 md:col-span-3 flex flex-col justify-between h-full py-1 sm:py-1.5 min-h-0 pl-0 md:pl-12 lg:pl-14">
                    <div className="flex flex-col justify-around items-start flex-1 gap-2 sm:gap-2.5 py-1 sm:py-2 min-h-0">
                      {renderSatelliteCard('CRM', 'theme-crm', 'bg-cyan-800', 'text-cyan-700', 'text-cyan-800')}
                      {renderSatelliteCard('CSC', 'theme-csc', 'bg-indigo-800', 'text-indigo-700', 'text-indigo-800')}
                      {renderSatelliteCard('CLP', 'theme-clp', 'bg-amber-800', 'text-amber-700', 'text-amber-800')}
                      {renderSatelliteCard('POS', 'theme-pos', 'bg-emerald-800', 'text-emerald-700', 'text-emerald-800')}
                    </div>
                  </div>

                  {/* CỘT GIỮA: TRỤC TRUNG TÂM (BẮC: AI & LMS | GIỮA: SDP HUB | NAM: BI DASHBOARD) */}
                  <div className="col-span-12 md:col-span-6 flex flex-col justify-between items-center h-full py-1 sm:py-1.5 px-2 sm:px-4 min-h-0">
                    {/* TẦNG TRÊN (BẮC): AI ASSISTANT & LMS (Giãn khoảng cách ngang giữa 2 thẻ để rõ line SOP Docs) */}
                    <div className="w-full flex items-center justify-center gap-6 sm:gap-12 shrink-0 pt-2">
                      {renderSatelliteCard('AI', 'theme-ai', 'bg-violet-900', 'text-violet-700', 'text-violet-800', true)}
                      {renderSatelliteCard('LMS', 'theme-lms', 'bg-teal-900', 'text-teal-700', 'text-teal-800', true)}
                    </div>

                    {/* TẦNG GIỮA: 9.1 SDP TRUNG TÂM CỔNG CSKH */}
                    <div
                      ref={el => { nodeRefs.current['SDP'] = el; }}
                      onPointerDown={e => handlePointerDown(e, 'SDP')}
                      style={getNodeVisualStyle('SDP')}
                      className={`draggable-card theme-sdp !max-w-[365px] !w-full relative group rounded-[14px] shadow-2xl p-2.5 sm:p-3 my-auto shrink-0 ${
                        draggingId === 'SDP' ? 'dragging' : ''
                      }`}
                    >
                      {/* Hover glow halo removed per user request */}

                      <div className="relative flex flex-col items-center text-center">
                        <div className="flex items-center justify-between w-full mb-1 gap-1.5 sm:gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-blue-700 text-white text-[9.5px] sm:text-[10px] font-bold border border-blue-400 flex items-center gap-1 shadow-xs shrink-0">
                            9.1 Trung tâm
                          </span>

                          <div
                            className="flex items-center gap-1 bg-white border-2 border-blue-500 px-1.5 py-0.5 rounded-[14px] shadow-xs"
                            onClick={e => e.stopPropagation()}
                          >
                            <ShieldCheck className="w-3 h-3 text-blue-700 shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-800">Quyền:</span>
                            <select
                              value={currentRole}
                              onChange={e => {
                                setCurrentRole(e.target.value);
                                showToast(`Đã chuyển sang phân quyền: ${SDP_ROLES[e.target.value]?.title || ''}`);
                              }}
                              className="text-[9px] sm:text-[10px] font-bold text-blue-950 bg-transparent border-0 outline-none cursor-pointer"
                            >
                              <option value="admin">Quản trị viên (Admin Toàn quyền)</option>
                              <option value="lead">Trưởng nhóm CSKH (Lead)</option>
                              <option value="agent">Tư vấn viên (Agent)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 my-0.5 sm:my-1">
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-105 transition-transform p-1.5 shrink-0 border-2 border-white">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight leading-none">SDP</h2>
                            <p className="text-[10px] sm:text-[11px] text-blue-900 font-bold font-mono mt-0.5">Service Delivery Platform</p>
                            <p className="text-[10px] sm:text-[11px] text-slate-900 font-bold">Cổng làm việc CSKH</p>
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-[11px] text-slate-900 font-bold mt-0.5 leading-tight px-1 hidden sm:block">
                          Trang làm việc chính của Phòng CSKH, cổng truy cập tập trung để sử dụng toàn bộ các hệ thống nghiệp vụ (Single Agent Workspace &amp; SSO).
                        </p>

                        {/* Core 4 Capabilities Chips */}
                        <div className="mt-1.5 grid grid-cols-2 gap-1 sm:gap-1.5 w-full text-left text-[9.5px] sm:text-[10.5px]">
                          <div className="bg-white p-1 sm:p-1.5 rounded-[14px] border border-blue-400 shadow-xs">
                            <div className="font-bold text-blue-900 flex items-center gap-1">
                              <KeyRound className="w-2.5 h-2.5 text-blue-700 shrink-0" /> SSO &amp; Portal
                            </div>
                            <span className="text-[8.5px] sm:text-[9.5px] text-slate-800 font-bold">Đăng nhập tập trung</span>
                          </div>
                          <div className="bg-white p-1 sm:p-1.5 rounded-[14px] border border-cyan-400 shadow-xs">
                            <div className="font-bold text-cyan-900 flex items-center gap-1">
                              <GitMerge className="w-2.5 h-2.5 text-cyan-700 shrink-0" /> Hub Tích Hợp
                            </div>
                            <span className="text-[8.5px] sm:text-[9.5px] text-slate-800 font-bold">Chuyển tiếp Data</span>
                          </div>
                          <div className="bg-white p-1 sm:p-1.5 rounded-[14px] border border-indigo-400 shadow-xs">
                            <div className="font-bold text-indigo-900 flex items-center gap-1">
                              <Bot className="w-2.5 h-2.5 text-indigo-700 shrink-0" /> AI Workspace
                            </div>
                            <span className="text-[8.5px] sm:text-[9.5px] text-slate-800 font-bold">Bàn làm việc Agent</span>
                          </div>
                          <div className="bg-white p-1 sm:p-1.5 rounded-[14px] border border-emerald-400 shadow-xs">
                            <div className="font-bold text-emerald-900 flex items-center gap-1">
                              <Gauge className="w-2.5 h-2.5 text-emerald-700 shrink-0" /> Giám Sát Realtime
                            </div>
                            <span className="text-[8.5px] sm:text-[9.5px] text-slate-800 font-bold">Điều phối luồng việc</span>
                          </div>
                        </div>

                        {/* Phân quyền hiện hành */}
                        <div className="mt-1.5 w-full px-2 py-0.5 sm:py-1 bg-blue-100/95 border-2 border-blue-400 rounded-[14px] text-left text-[9px] sm:text-[10px] text-blue-950 flex items-center justify-between gap-2 shadow-xs">
                          <span className="flex items-center gap-1 font-bold truncate">
                            <Lock className="w-2.5 h-2.5 text-blue-800 shrink-0" />
                            <span className="truncate">Quyền: {currentRoleData.title}</span>
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-blue-800 text-white font-mono text-[8.5px] font-bold shrink-0">
                            {currentRoleData.badge}
                          </span>
                        </div>

                        {/* Footer Quick info */}
                        <div className="mt-1 pt-1 border-t border-blue-400/80 w-full flex items-center justify-between text-[9.5px] sm:text-[10.5px] text-blue-950 font-bold gap-2">
                          <span className="flex items-center gap-1 truncate">
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" /> sdp.powerservice.one
                          </span>
                          <span className="text-slate-900 font-bold text-[8.5px] sm:text-[9.5px] shrink-0">
                            Bấm: Chi tiết | Kéo: Đổi chỗ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TẦNG DƯỚI (NAM): 9.10 BI DASHBOARD */}
                    <div className="w-full flex items-center justify-center shrink-0 pb-2">
                      {renderSatelliteCard('BI', 'theme-bi', 'bg-emerald-900', 'text-emerald-700', 'text-emerald-800', true)}
                    </div>
                  </div>

                  {/* CỘT PHẢI (ĐÔNG): 4 Hệ Thống Quản Trị & Vận Hành Doanh Nghiệp (Tạo lề ngoài bên phải cho đường liên hệ thống) */}
                  <div className="col-span-12 md:col-span-3 flex flex-col justify-between h-full py-1 sm:py-1.5 min-h-0 pr-0 md:pr-12 lg:pr-14">
                    <div className="flex flex-col justify-around items-end flex-1 gap-2 sm:gap-2.5 py-1 sm:py-2 min-h-0">
                      {renderSatelliteCard('ERP', 'theme-erp', 'bg-purple-900', 'text-purple-700', 'text-purple-800')}
                      {renderSatelliteCard('HRM', 'theme-hrm', 'bg-pink-900', 'text-pink-700', 'text-pink-800')}
                      {renderSatelliteCard('BPM', 'theme-bpm', 'bg-indigo-900', 'text-indigo-700', 'text-indigo-800')}
                      {renderSatelliteCard('OKR', 'theme-okr', 'bg-orange-900', 'text-orange-700', 'text-orange-800')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </motion.div>
      </div>

      {/* MODAL CHI TIẾT KHI CLICK VÀO 1 PHÂN HỆ */}
      {selectedSystem && (
        <div
          onClick={() => setSelectedSystemKey(null)}
          style={{
            background: 'var(--bg-modal-backdrop)',
            backdropFilter: 'blur(var(--blur-modal, 6px))',
            WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedSystem.abbr} - ${selectedSystem.name}`}
            onClick={e => e.stopPropagation()}
            className="theme-modal-card w-full max-w-xl rounded-[14px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-left"
          >
            <div className="theme-modal-header p-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: selectedSystem.color }}
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md shrink-0"
                >
                  <DynamicIcon name={selectedSystem.icon} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="typo-badge font-mono px-2 py-0.2 rounded bg-sky-500/15 font-bold" style={{ color: 'var(--color-primary)' }}>
                      {selectedSystem.code}
                    </span>
                    <span className="typo-caption font-mono font-bold" style={{ color: 'var(--text-secondary)' }}>{selectedSystem.full}</span>
                  </div>
                  <h3 className="typo-popup-title mt-0.5" style={{ color: selectedSystem.color }}>
                    {selectedSystem.abbr} - {selectedSystem.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSystemKey(null)}
                className="theme-modal-close w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 typo-body-sm overflow-y-auto font-play">
              <div>
                <label className="typo-label font-bold tracking-wider block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Mô tả tổng quan
                </label>
                <p className="theme-modal-subcard font-medium leading-relaxed p-2.5 rounded-[14px]">
                  {selectedSystem.desc}
                </p>
              </div>

              <div>
                <label className="typo-label font-bold tracking-wider block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Tính năng chính
                </label>
                <ul className="space-y-1">
                  {selectedSystem.features?.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                      <span className="leading-normal">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedSystem.flows && (
                <div>
                  <label className="typo-label font-bold tracking-wider block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Luồng Dữ Liệu Tương Tác Với Hệ Sinh Thái
                  </label>
                  <div className="theme-modal-subcard p-2.5 rounded-[14px] space-y-1.5">
                    {selectedSystem.flows.map((fl: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 border-b pb-1.5 last:border-b-0 last:pb-0" style={{ borderColor: 'var(--border-subcard)' }}>
                        <span className="px-1.5 py-0.2 rounded bg-sky-500/15 font-mono typo-badge font-bold shrink-0" style={{ color: 'var(--color-primary)' }}>
                          {fl.type}
                        </span>
                        <div>
                          <span className="font-bold" style={{ color: 'var(--text-heading, var(--text-primary))' }}>{fl.to}:</span>
                          <span className="ml-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{fl.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="theme-modal-footer p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="typo-label font-bold block" style={{ color: 'var(--text-secondary)' }}>
                  Đường dẫn hệ thống:
                </span>
                {selectedSystem.isPending ? (
                  <span className="typo-caption font-mono font-bold italic text-amber-600 dark:text-amber-400">
                    {selectedSystem.url}
                  </span>
                ) : (
                  <a
                    href={selectedSystem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="typo-caption font-mono font-bold truncate block max-w-[280px] hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {selectedSystem.url}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {!selectedSystem.isPending && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedSystem.url)}
                      className="theme-modal-close px-3 py-1.5 rounded-full font-bold typo-button transition cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép URL
                    </button>
                    <a
                      href={selectedSystem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: 'var(--bg-button-primary)' }}
                      className="px-3 py-1.5 rounded-full text-white font-bold typo-button transition cursor-pointer hover:opacity-90 flex items-center gap-1"
                    >
                      <span>Mở website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSystemKey(null)}
                  className="theme-modal-close px-3 py-1.5 rounded-full font-bold typo-button transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST MESSAGE */}
      {toastMsg && (
        <div className="theme-popup fixed bottom-4 right-4 z-50 px-3.5 py-2 rounded-[14px] shadow-xl flex items-center gap-2 typo-body-sm font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>{toastMsg}</span>
        </div>
      )}
    </AnimatePresence>
  );
};
