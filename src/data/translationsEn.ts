import { DOMAINS_DATA } from './domains';
import { SERVICE_PHILOSOPHY_VALUES } from './aboutData';
import { CAREER_MILESTONES_DATA, CORE_VALUES_DATA } from './letterData';
import { POWER_SYSTEMS_12 } from './systemsData';
import { TABS_DATA } from './tabs';

export const STATIC_VI_TO_EN: Record<string, string> = {
  // Navigation & Global Chrome
  'Trang chủ': 'Home',
  'Thư Ngỏ': 'Cover Letter',
  'Thư ngỏ': 'Cover Letter',
  'Giới thiệu': 'About',
  'Học vấn': 'Education',
  'Dịch vụ': 'Domains',
  'Lĩnh vực': 'Domains',
  'Kinh nghiệm': 'Experience',
  'Kỹ năng': 'Skills',
  'Dự án': 'Projects',
  'Hệ thống': 'Systems',
  'Phỏng vấn': 'Interview',
  'Tử vi': 'Horoscope',
  'Kỷ niệm': 'Memories',
  'Liên hệ': 'Contact',
  'AI Hỗ Trợ': 'AI Support',
  'AI hỗ trợ': 'AI Support',
  'Hình nền': 'Wallpaper',
  'Hình Nền': 'Wallpaper',
  'Giao diện': 'Interface',
  'Tải PDF': 'Download PDF',
  'Trang trước': 'Previous page',
  'Trang sau': 'Next page',
  'Trang trước (Prev)': 'Previous page',
  'Trang sau (Next)': 'Next page',

  // Footer & Popups
  'Chọn ngôn ngữ': 'Select Language',
  'Theo trình duyệt (Mặc định)': 'Follow Browser (Default)',
  'Tự động: Tiếng Việt': 'Auto: Vietnamese',
  'Tự động: English': 'Auto: English',
  'VI · Trình duyệt': 'VI · Browser',
  'EN · Trình duyệt': 'EN · Browser',
  'VI · Đã chọn': 'VI · Selected',
  'EN · Đã chọn': 'EN · Selected',
  'Danh sách Giao diện (4)': 'Interface Themes (4)',
  'Độc lập': 'Standalone',
  'Cấu hình giao diện ⚙': 'Configure Interface ⚙',
  'Tùy chỉnh': 'Customize',
  'Trợ lý 24/7': '24/7 Assistant',
  'Giao diện Chuẩn': 'Standard Light',
  'Kính': 'Frosted Glass',
  'Kính (Giao diện sáng)': 'Frosted Glass (Light)',
  'Kính · Đa sắc': 'Glass · Multicolor',
  'Kính mờ đa sắc': 'Multicolor Frosted Glass',
  'Kính Tối Neon': 'Dark Neon Glass',
  'Kính Tối Neon đa sắc': 'Multicolor Dark Neon Glass',
  'Kính Neon': 'Neon Glass',
  'Kính Neon đa sắc': 'Multicolor Neon Glass',
  'Chỉ giao diện Sáng': 'Light Mode Only',
  'Giao diện Tối Neon đa sắc': 'Multicolor Dark Neon Mode',
  'Chuẩn': 'Standard',
  'Chuẩn · Sáng': 'Standard · Light',
  'Mica · Sáng': 'Mica · Light',
  'Giao diện sáng': 'Light Mode',
  'Đóng cửa sổ': 'Close',
  'In PDF / Print': 'Print / Save PDF',
  'Tải Xuống PDF': 'Download PDF',

  // Weather Widget
  'TP. Hồ Chí Minh': 'Ho Chi Minh City',
  'TP.HCM': 'HCMC',
  'TP.HCM · Hôm nay': 'HCMC · Today',
  'Độ ẩm': 'Humidity',
  'Sức gió': 'Wind',
  'Gió': 'Wind',
  'Áp suất': 'Pressure',
  'Tầm nhìn': 'Visibility',
  'Chỉ số UV': 'UV Index',
  'Chất lượng không khí': 'Air Quality',
  'Dự báo thời tiết': 'Weather Forecast',
  'Dự báo 7 ngày': '7-Day Forecast',
  'Dự báo theo giờ': 'Hourly Forecast',
  'Cập nhật trực tiếp': 'Live Update',
  'Cảm giác như': 'Feels like',

  // Home View
  'Màn hình 1': 'Screen 1',
  'Màn hình 2': 'Screen 2',
  'Màn hình 3': 'Screen 3',
  'Video 2 (Gốc)': 'Video 2 (Main)',
  'Phong Thái Lãnh Đạo & Tầm Nhìn': 'Executive Presence & Vision',
  'Phong thái chuyên gia quản trị trải nghiệm khách hàng cao cấp': 'Senior Customer Experience & Operations Executive presence',
  'Tầm Nhìn Lãnh Đạo': 'Leadership Vision',
  'Chân Dung Chuyên Gia & Lời Chào': 'Executive Portrait & Greeting',
  'Chân dung điều hành dịch vụ khách hàng 22+ năm kinh nghiệm': 'Customer Service Operations leader with 22+ years of experience',
  'Hồ Sơ Điều Hành': 'Executive Profile',
  'Không Gian Số Hóa & Hệ Sinh Thái': 'Digital Ecosystem & Architecture',
  'Hạ tầng công nghệ tự động hóa và kiến trúc giải pháp hiện đại': 'Modern automation infrastructure and solution architecture',
  'Hệ Sinh Thái Số': 'Digital Ecosystem',
  'Khởi đầu mọi hành trình với sự tận tâm và khát vọng': 'Every journey begins with dedication and aspiration',

  // Section Headings & Page Banners
  'Dự án trọng điểm': 'Flagship Projects',
  '"Khát vọng đổi mới, ghi dấu giá trị thực tiễn ♡"': '"Driven to innovate, delivering measurable impact ♡"',
  'Bộ lọc dự án': 'Project Filter',
  'Tất cả (21 Dự án)': 'All (21 Projects)',
  'Chiến Lược (3)': 'Strategy (3)',
  'Chuẩn Hóa SOP (5)': 'SOP Excellence (5)',
  'Trải Nghiệm CX (5)': 'CX Design (5)',
  'Công Nghệ AI (5)': 'Tech & AI (5)',
  'Đào Tạo (3)': 'Learning (3)',
  'Chi Tiết': 'Details',
  'Sơ Đồ': 'Mindmap',
  'Mở ảnh gốc trong tab mới': 'Open original image in new tab',

  // All 21 Project Titles (Cleaned)
  'Xây dựng và vận hành Phòng CSKH chuyên nghiệp': 'Customer Service Department Establishment & Operations',
  'Thiết lập mục tiêu và hệ thống KPI/OKR phòng ban': 'Departmental KPI & OKR Governance Framework',
  'Thiết kế hành trình và nâng cao trải nghiệm khách hàng': 'Customer Journey Mapping & Experience Design (CJM)',
  'Quản trị dự án và cải tiến vận hành CSKH': 'CS Operations Project & Continuous Improvement Management',
  'Phân tích phản hồi và thúc đẩy cải tiến sản phẩm': 'Voice of Customer (VoC) Analytics & Product Improvement',
  'Ứng phó khủng hoảng và kiểm soát khách hàng rời bỏ': 'Crisis Response & Customer Churn Prevention',
  'Chuẩn hóa quy trình và tiêu chuẩn vận hành CSKH': 'Visual SOP Standardization & Service Excellence',
  'Tích hợp và tối ưu hệ thống hỗ trợ đa kênh': 'Omnichannel Support Integration & Optimization',
  'Tự động hóa quy trình CSKH bằng công nghệ RPA': 'CS Process Automation via RPA Technology',
  'Điều hành chiến dịch Outbound chăm sóc khách hàng': 'Proactive Outbound Customer Care Campaigns',
  'Quản trị chất lượng và hiệu quả đối tác BPO': 'BPO Partner Quality & Performance Governance',
  'Xây dựng nền tảng CRM và hồ sơ khách hàng 360': 'Enterprise CRM Platform & Customer 360 Profile',
  'Phân tích dữ liệu và xây dựng báo cáo BI': 'Operational Data Analytics & Real-Time BI Reporting',
  'Đo lường trải nghiệm qua CSAT, NPS và CES': 'Experience Measurement via CSAT, NPS & CES',
  'Phát triển Chatbot và Voicebot AI đa kênh': 'Omnichannel AI Chatbot & Voicebot Development',
  'Phát triển CS Academy và hệ thống đào tạo trực tuyến': 'CS Academy & Digital LMS Training Ecosystem',
  'Xây dựng khung năng lực ASK và lộ trình nghề nghiệp': 'ASK Competency Framework & Career Pathways',
  'Xây dựng trung tâm hỗ trợ khách hàng tự phục vụ': 'Intelligent Self-Service Customer Help Center',
  'Xây dựng văn hóa khách hàng và chuẩn chất lượng COPC': 'Customer-Centric Culture & COPC Quality Standard',
  'Quản trị thay đổi và ứng phó khủng hoảng dịch vụ': 'Change Management & Service Crisis Continuity',
  'Ứng dụng AI Copilot và Auto-QA nâng cao hiệu suất': 'AI Copilot & Auto-QA Performance Acceleration',

  // Skills & SWOT
  'Điểm mạnh': 'Strengths',
  'Hoàn thiện': 'Refinements',
  'Phát triển': 'Growth Opportunities',
  'Thách thức': 'Challenges',
  'Mức độ tác động': 'Impact Level',
  'Mức độ kỹ năng': 'Proficiency Level',
  'Phân tích SWOT': 'SWOT Analysis',
  'Ma trận SWOT': 'SWOT Matrix',

  // About, Letter, Education, Experience, Interview, Horoscope, Memories, Contact, AI, PDF
  'Hồ sơ chuyên gia': 'Executive Profile',
  'Thông tin cá nhân': 'Personal Information',
  'Họ & Tên': 'Full Name',
  'Họ & Tên:': 'Full Name:',
  'Chức danh chính:': 'Primary Title:',
  'Kinh nghiệm:': 'Experience:',
  'Trình độ:': 'Education:',
  'Email liên hệ:': 'Contact Email:',
  'Điện thoại / Zalo:': 'Phone / Zalo:',
  '22+ Năm Quản Lý CSKH': '22+ Years in CS Management',
  'Thạc Sĩ Quản Trị Kinh Doanh': 'Master of Business Administration (MBA)',
  'Trưởng Phòng Vận Hành CSKH': 'Head of Customer Service Operations',
  'Tóm tắt thông tin hồ sơ': 'Profile Summary',
  'Đã xác thực': 'Verified',
  'Bản chính thức 2026': 'Official 2026 Edition',
  'Hồ Sơ Năng Lực & Kinh Nghiệm Công Tác': 'Executive Capability & Career Dossier',
  'Bộ lọc câu hỏi': 'Question Filter',
  'Hội Đồng Phỏng Vấn': 'Interview Panel',
  'Bản đồ tử vi': 'Horoscope Chart',
  'Lên đầu trang': 'Back to top',
  'Quay lại': 'Back',
  'Xem chi tiết': 'View Details',
  'Tất cả': 'All',
  'Đang hoạt động': 'Active',
  'Đang bật': 'Enabled',
  'Đã áp dụng': 'Applied',
};

export function buildInstantViToEnMap(): Map<string, string> {
  const map = new Map<string, string>();

  const add = (vi?: string, en?: string) => {
    if (!vi || !en) return;
    const cleanVi = vi.trim();
    const cleanEn = en.trim();
    if (cleanVi && cleanEn && cleanVi !== cleanEn) {
      map.set(cleanVi, cleanEn);
    }
  };

  Object.entries(STATIC_VI_TO_EN).forEach(([vi, en]) => add(vi, en));

  // Auto-ingest bilingual data already existing in data modules
  DOMAINS_DATA.forEach((d) => {
    add(d.title, d.titleEn);
    add(d.subtitle, d.subtitleEn);
    add(d.desc, d.descEn);
  });

  SERVICE_PHILOSOPHY_VALUES.forEach((v) => {
    add(v.titleVi, v.titleEn);
    add(v.subtitleVi, v.subtitleEn);
    add(v.descVi, v.descEn);
  });

  CAREER_MILESTONES_DATA.forEach((m) => {
    add(m.descVi, m.descEn);
    add(m.highlightVi, m.highlightEn);
    add(m.yearLabelVi, m.yearLabelEn);
    add(m.roleVi, m.roleEn);
  });

  CORE_VALUES_DATA.forEach((c) => {
    add(c.titleVi, c.titleEn);
    add(c.descVi, c.descEn);
  });

  POWER_SYSTEMS_12.forEach((s) => {
    add(s.nameVi, s.nameEn);
    add(s.descVi, s.descEn);
    add(s.badgeVi, s.badgeEn);
  });

  // Tab quotes
  TABS_DATA.forEach((t) => {
    if (t.name && STATIC_VI_TO_EN[t.name]) {
      add(t.name, STATIC_VI_TO_EN[t.name]);
    }
  });

  return map;
}
