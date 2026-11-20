import { EXPERIENCE_MILESTONES, ExperienceMilestone } from './experience';

export interface CareerMilestoneItem extends ExperienceMilestone {
  id: string;
  yearLabelVi: string;
  yearLabelEn?: string;
  roleTitle: string;
  roleEn?: string;
  highlightVi: string;
  highlightEn: string;
  milestoneTitleVi: string;
  descVi: string;
  descEn: string;
  descViPart2: string;
  roleIconName: string;
  highlightIconName: string;
  yearBadgeGradient?: string;
  showMoreLink?: string;
  color?: string;
  roleVi: string;
  borderClass?: string;
}

const LETTER_MILESTONE_DEFINITIONS: Array<{
  id: string;
  sourceKey: keyof typeof EXPERIENCE_MILESTONES;
  yearLabelVi: string;
  yearLabelEn: string;
  roleEn: string;
  milestoneTitleVi: string;
  milestoneTitleEn: string;
  descVi: string;
  descEn: string;
  highlightVi: string;
  highlightEn: string;
  highlightIconName: string;
}> = [
  {
    id: '2002',
    sourceKey: '2003',
    yearLabelVi: '2002',
    yearLabelEn: '2002',
    roleEn: 'Customer Service Staff (Telecom)',
    milestoneTitleVi: 'Khởi đầu tại MobiFone · Nhân viên CSKH',
    milestoneTitleEn: 'Starting Out at MobiFone · CS Specialist',
    descVi:
      'Khởi đầu sự nghiệp ở vị trí **Nhân viên CSKH** ngành viễn thông tại **MobiFone**, được đào tạo bài bản về dịch vụ khách hàng, quản lý tổng đài, xử lý sự cố và chuẩn **quy trình** phục vụ – nền móng cho tư duy lấy khách hàng làm trung tâm.',
    descEn:
      'Started as a Customer Service Specialist at MobiFone in telecom, mastering call center support, incident handling, and service SOPs as a customer-centric foundation.',
    highlightVi: 'Nhân viên CSKH · Nền tảng quy trình ngành Viễn thông',
    highlightEn: 'CS Specialist · Telecom service & SOP foundation',
    highlightIconName: 'Signal',
  },
  {
    id: '2007',
    sourceKey: '2007',
    yearLabelVi: '2007',
    yearLabelEn: '2007',
    roleEn: 'Customer Service Supervisor (Int’l Telecom)',
    milestoneTitleVi: 'Phát triển tại Viễn Liên V247 · Giám sát CSKH',
    milestoneTitleEn: 'Growth at Vien Lien V247 · CS Supervisor',
    descVi:
      'Thăng tiến lên vị trí **Giám sát CSKH** ngành viễn thông quốc tế tại **Viễn Liên V247**, trực tiếp **quản lý đội ngũ**, **đào tạo** ca trực 24/7, giám sát chất lượng dịch vụ và xây dựng chỉ số đánh giá SLA/QA quy mô lớn.',
    descEn:
      'Promoted to CS Supervisor in international telecom at V247, leading 24/7 shift teams, training agents, supervising QA, and establishing service quality metrics.',
    highlightVi: 'Nhân viên → Giám sát · Quản lý đội ngũ & Đào tạo QA 24/7',
    highlightEn: 'Promoted to Supervisor · Team management & 24/7 QA',
    highlightIconName: 'Headset',
  },
  {
    id: '2011',
    sourceKey: '2011',
    yearLabelVi: '2011',
    yearLabelEn: '2011',
    roleEn: 'CS Manager (Small Scale · Cable TV & ISP)',
    milestoneTitleVi: 'Bước ngoặt tại LBC – HTVC · Trưởng phòng (Quy mô nhỏ)',
    milestoneTitleEn: 'Turning Point at LBC – HTVC · CS Manager (Small Scale)',
    descVi:
      'Lần đầu đảm nhiệm **Trưởng phòng CSKH (quy mô nhỏ)** trong lĩnh vực truyền hình cáp & internet tại **LBC – HTVC**: trực tiếp điều hành phòng ban, **chuẩn hóa quy trình**, thiết lập KPI, **đào tạo** nhân sự và phối hợp liên phòng ban.',
    descEn:
      'First CS Manager role (small department scale) in cable TV & broadband at LBC – HTVC: standardized SOPs, established KPIs, trained staff, and aligned cross-team ops.',
    highlightVi: 'Trưởng phòng quy mô nhỏ · Chuẩn hóa Quy trình & Quản trị KPI',
    highlightEn: 'Small-scale CS Manager · SOP Standardization & KPIs',
    highlightIconName: 'Tv',
  },
  {
    id: '2013',
    sourceKey: '2013',
    yearLabelVi: '2013 (Phần 1)',
    yearLabelEn: '2013 (Part 1)',
    roleEn: 'Senior CS Manager (129 Staff · Gaming & eSports)',
    milestoneTitleVi: 'Garena & eSports · Trưởng phòng cấp cao (129 NS)',
    milestoneTitleEn: 'Garena & eSports · Senior CS Manager (129 Staff)',
    descVi:
      'Mở rộng sang lĩnh vực Game trực tuyến (**Liên Minh Huyền Thoại**, **Liên Quân Mobile**) với vai trò **Trưởng phòng quản lý cấp cao** trực tiếp điều hành **129 nhân sự**: kiến thiết cơ cấu, **xây dựng hệ thống**, chuẩn hóa quy trình và **đào tạo** quản lý kế thừa.',
    descEn:
      'Transitioned to Senior CS Manager leading 129 staff in online gaming (LoL, Arena of Valor) at Garena: org design, system architecture, SOPs, and middle-manager coaching.',
    highlightVi: 'Trưởng phòng cấp cao (129 NS) · Quản lý, Đào tạo & Hệ thống',
    highlightEn: 'Senior Manager (129 staff) · Leadership, Training & Systems',
    highlightIconName: 'Gamepad2',
  },
  {
    id: '2014',
    sourceKey: '2013',
    yearLabelVi: '2013 (Phần 2)',
    yearLabelEn: '2013 (Part 2)',
    roleEn: 'Multi-Sector CX Lead (Shopee, AirPay, Gcafe)',
    milestoneTitleVi: 'Hệ sinh thái Số (Shopee, AirPay, Gcafe) · Đa lĩnh vực',
    milestoneTitleEn: 'Digital Ecosystem (Shopee, AirPay, Gcafe) · Multi-Sector',
    descVi:
      'Đồng hành từ ngày đầu ra mắt **Shopee**, **AirPay** và **Gcafe**, làm chủ mô hình **TMĐT, Ví điện tử & Phòng máy**. Khẳng định triết lý: **xây dựng hệ thống trước khi mở rộng**, chuẩn **quy trình** và phát triển **con người** song hành cùng công nghệ.',
    descEn:
      'Launched CX foundations for Shopee, AirPay, and Gcafe across e-commerce, e-wallet, and retail tech—proving systems-first scaling and data-driven quality.',
    highlightVi: 'Đa lĩnh vực (TMĐT, FinTech, Game) · Xây dựng Hệ thống từ đầu',
    highlightEn: 'Multi-sector (E-commerce, FinTech, Game) · Systems from Day 1',
    highlightIconName: 'Rocket',
  },
  {
    id: '2016',
    sourceKey: '2016',
    yearLabelVi: '2016',
    yearLabelEn: '2016',
    roleEn: 'Call Center Manager (Insurance)',
    milestoneTitleVi: 'Prudential Việt Nam · Ngành Bảo hiểm',
    milestoneTitleEn: 'Prudential Vietnam · Life Insurance',
    descVi:
      'Chuyển sang ngành **Bảo hiểm nhân thọ** đòi hỏi kỷ luật và tin cậy cao: điều hành Call Center, hoàn thiện **quy trình** thẩm định & BCP, **đào tạo** văn hóa đồng cảm và chuẩn hóa **hệ thống** quản trị trải nghiệm đa kênh.',
    descEn:
      'Directed Call Center operations in high-compliance life insurance at Prudential: refined QA/BCP SOPs, coached empathetic teams, and modernized CX workflows.',
    highlightVi: 'Ngành Bảo hiểm · Chuẩn Quy trình tin cậy & Văn hóa đồng cảm',
    highlightEn: 'Insurance Sector · High-trust SOPs & Empathetic Culture',
    highlightIconName: 'ShieldCheck',
  },
  {
    id: '2018',
    sourceKey: '2018',
    yearLabelVi: '2018',
    yearLabelEn: '2018',
    roleEn: 'Senior CS Manager (FinTech · 60+ Staff & BPO)',
    milestoneTitleVi: 'Ví MoMo · Trưởng phòng CSKH cấp cao (FinTech)',
    milestoneTitleEn: 'MoMo · Senior CS Manager (FinTech)',
    descVi:
      'Dẫn dắt khối CSKH ngành **Tài chính số** quy mô 60 NS nội bộ + BPO: **quản lý** vận hành hàng triệu giao dịch, **xây dựng hệ thống** CRM thời gian thực, tinh gọn **quy trình** và **đào tạo** đội ngũ ứng dụng công nghệ tự động hóa.',
    descEn:
      'Led 60+ internal staff and BPO operations at MoMo FinTech: scaled omnichannel ops, built real-time CRM systems, streamlined workflows, and automated service.',
    highlightVi: 'Quản lý cấp cao FinTech · Hệ thống CRM & Tự động hóa',
    highlightEn: 'Senior FinTech Lead · Real-Time CRM & Automation',
    highlightIconName: 'CreditCard',
  },
  {
    id: '2023',
    sourceKey: '2023',
    yearLabelVi: '2023',
    yearLabelEn: '2023',
    roleEn: 'Head of Customer Service (ECO Wallet)',
    milestoneTitleVi: 'Ví ECO · Hoàn thiện Hệ thống CSKH hiện đại',
    milestoneTitleEn: 'ECO Wallet · Modern CS Architecture',
    descVi:
      'Tiếp tục vai trò **Trưởng phòng CSKH** lĩnh vực **Ví điện tử & Bán lẻ B2B**, hoàn thiện năng lực kết hợp **Quản lý – Quy trình – Đào tạo – Xây dựng hệ thống** (CRM, Dashboard BI, AI Chatbot) nhằm tối ưu trải nghiệm và tin cậy.',
    descEn:
      'Spearheaded modern CS architecture for ECO Wallet & B2B FinTech, unifying Management, Process, Training, and Systems (CRM, BI, AI Bot) for trusted UX.',
    highlightVi: 'Trưởng phòng cấp cao · Quản lý, Quy trình, Đào tạo & Hệ thống',
    highlightEn: 'Head of CS · Unified Management, Process, Training & Systems',
    highlightIconName: 'Sparkles',
  },
];

export const CAREER_MILESTONES_DATA: CareerMilestoneItem[] = LETTER_MILESTONE_DEFINITIONS.map((def) => {
  const base = EXPERIENCE_MILESTONES[def.sourceKey];
  return {
    ...base,
    id: def.id,
    year: def.yearLabelVi,
    yearLabelVi: def.yearLabelVi,
    yearLabelEn: def.yearLabelEn,
    roleTitle: base.roleTitle,
    roleEn: def.roleEn,
    highlightVi: def.highlightVi,
    highlightEn: def.highlightEn,
    milestoneTitleVi: def.milestoneTitleVi,
    descVi: def.descVi,
    descEn: def.descEn,
    descViPart2: '',
    roleIconName: 'briefcase',
    highlightIconName: def.highlightIconName,
    color: base.hexColor,
    roleVi: base.roleTitle,
  };
});

export interface CoreValueItem {
  number: string | number;
  idName: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  colorTheme: {
    primary: string;
    bgGradient: string;
    border: string;
    glow: string;
    bg: string;
    text: string;
    badgeBg: string;
    iconBg: string;
    numberText: string;
    tagText: string;
  };
}

export const CORE_VALUES_DATA: CoreValueItem[] = [
  {
    number: '01',
    idName: 'efficiency',
    titleVi: 'Hiệu quả',
    titleEn: 'Efficiency',
    descVi: 'Tối ưu hiệu suất.',
    descEn: 'Optimize performance.',
    colorTheme: {
      primary: '#0284c7',
      bgGradient: 'from-sky-50/90 to-blue-50/70 dark:from-slate-900/90 dark:to-sky-950/50',
      border: 'border-sky-300 dark:border-sky-500/40',
      glow: 'rgba(14, 165, 233, 0.25)',
      bg: 'bg-sky-50/80 dark:bg-sky-950/50',
      text: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-sky-500',
      iconBg: 'bg-sky-100 dark:bg-sky-900/60',
      numberText: 'text-sky-600 dark:text-sky-400',
      tagText: 'text-sky-700 dark:text-sky-300',
    },
  },
  {
    number: '02',
    idName: 'humanity',
    titleVi: 'Nhân văn',
    titleEn: 'Humanity',
    descVi: 'Thấu hiểu con người.',
    descEn: 'Empathy.',
    colorTheme: {
      primary: '#059669',
      bgGradient: 'from-emerald-50/90 to-teal-50/70 dark:from-slate-900/90 dark:to-emerald-950/50',
      border: 'border-emerald-300 dark:border-emerald-500/40',
      glow: 'rgba(16, 185, 129, 0.25)',
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      numberText: 'text-emerald-600 dark:text-emerald-400',
      tagText: 'text-emerald-700 dark:text-emerald-300',
    },
  },
  {
    number: '03',
    idName: 'sustainability',
    titleVi: 'Bền vững',
    titleEn: 'Sustainability',
    descVi: 'Giá trị bền vững.',
    descEn: 'Sustainable value.',
    colorTheme: {
      primary: '#d97706',
      bgGradient: 'from-amber-50/90 to-orange-50/70 dark:from-slate-900/90 dark:to-amber-950/50',
      border: 'border-amber-300 dark:border-amber-500/40',
      glow: 'rgba(245, 158, 11, 0.25)',
      bg: 'bg-amber-50/80 dark:bg-amber-950/50',
      text: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60',
      numberText: 'text-amber-600 dark:text-amber-400',
      tagText: 'text-amber-700 dark:text-amber-300',
    },
  },
  {
    number: '04',
    idName: 'innovation',
    titleVi: 'Sáng tạo',
    titleEn: 'Innovation',
    descVi: 'Không ngừng đổi mới.',
    descEn: 'Innovation.',
    colorTheme: {
      primary: '#7c3aed',
      bgGradient: 'from-purple-50/90 to-indigo-50/70 dark:from-slate-900/90 dark:to-purple-950/50',
      border: 'border-purple-300 dark:border-purple-500/40',
      glow: 'rgba(168, 85, 247, 0.25)',
      bg: 'bg-purple-50/80 dark:bg-purple-950/50',
      text: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/60',
      numberText: 'text-purple-600 dark:text-purple-400',
      tagText: 'text-purple-700 dark:text-purple-300',
    },
  },
];

export interface OperationalPrincipleItem {
  id: string;
  title: string;
  titleVi: string;
  descVi: string;
  borderClass?: string;
}

export const OPERATIONAL_PRINCIPLES_DATA: OperationalPrincipleItem[] = [
  {
    id: '1',
    title: 'Quy trình tạo nền tảng',
    titleVi: 'Quy trình tạo nền tảng',
    descVi: 'Chuẩn hóa SOP, SLA và lưu đồ xử lý giúp hệ thống vận hành nhất quán, minh bạch.',
    borderClass: 'border-sky-300 dark:border-sky-500/40',
  },
  {
    id: '2',
    title: 'Con người tạo giá trị',
    titleVi: 'Con người tạo giá trị',
    descVi: 'Đào tạo, trao quyền và truyền cảm hứng để mỗi nhân sự là một đại sứ thương hiệu.',
    borderClass: 'border-emerald-300 dark:border-emerald-500/40',
  },
  {
    id: '3',
    title: 'Công nghệ tạo đòn bẩy',
    titleVi: 'Công nghệ tạo đòn bẩy',
    descVi: 'Ứng dụng AI, CRM, Omnichannel và tự động hóa để bứt phá năng suất và trải nghiệm.',
    borderClass: 'border-purple-300 dark:border-purple-500/40',
  },
];
