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
  managementVi: string;
  managementEn: string;
  workVi: string;
  workEn: string;
  borderClass?: string;
}

const LETTER_MILESTONE_DEFINITIONS: Array<{
  id: string;
  sourceKey: keyof typeof EXPERIENCE_MILESTONES;
  yearLabelVi: string;
  yearLabelEn: string;
  roleVi: string;
  roleEn: string;
  managementVi: string;
  managementEn: string;
  workVi: string;
  workEn: string;
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
    sourceKey: '2002',
    yearLabelVi: '2002',
    yearLabelEn: '2002',
    roleVi: 'Nhân viên CSKH',
    roleEn: 'Customer Service Specialist',
    managementVi: '12 nhân sự nhóm',
    managementEn: '12 team peers',
    workVi: 'Hỗ trợ tổng đài & hướng dẫn nhân sự mới',
    workEn: 'Hotline support & onboarding coaching',
    milestoneTitleVi: 'Khởi đầu tại MobiFone',
    milestoneTitleEn: 'Starting Out at MobiFone',
    descVi:
      'Tôi bắt đầu sự nghiệp tại **MobiFone**, nơi tôi được đào tạo bài bản về dịch vụ khách hàng, quản lý tổng đài, xử lý sự cố và xây dựng quy trình phục vụ theo tiêu chuẩn ngành viễn thông. Đây là nền tảng giúp tôi hình thành tư duy lấy khách hàng làm trung tâm và hiểu rõ tầm quan trọng của quy trình trong vận hành dịch vụ.',
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
    roleVi: 'Giám sát CSKH',
    roleEn: 'Customer Service Supervisor',
    managementVi: '12 nhân sự trực tiếp',
    managementEn: '12 direct staff',
    workVi: 'Điều phối ca trực 24/7 & đánh giá QA',
    workEn: '24/7 shift orchestration & QA evaluation',
    milestoneTitleVi: 'Phát triển tại Viễn Liên V247',
    milestoneTitleEn: 'Growth at Vien Lien V247',
    descVi:
      'Gia nhập **Viễn Liên V247**, tôi tiếp tục phát triển năng lực quản lý đội ngũ, giám sát chất lượng dịch vụ và tối ưu hiệu quả vận hành của trung tâm chăm sóc khách hàng. Giai đoạn này giúp tôi tích lũy kinh nghiệm quản lý hoạt động với quy mô lớn và xây dựng các chỉ số đánh giá chất lượng dịch vụ.',
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
    roleVi: 'Trưởng phòng CSKH',
    roleEn: 'Customer Service Manager',
    managementVi: '12 nhân sự trực tiếp',
    managementEn: '12 direct staff',
    workVi: 'Điều hành phòng CSKH & ngân sách',
    workEn: 'CS department ops & budgeting',
    milestoneTitleVi: 'Bước ngoặt tại LBC – HTVC',
    milestoneTitleEn: 'Turning Point at LBC – HTVC',
    descVi:
      'Đây là dấu mốc quan trọng khi tôi lần đầu đảm nhiệm vị trí **Trưởng phòng Chăm sóc Khách hàng**. Từ một nhà quản lý vận hành, tôi chuyển mình trở thành một nhà quản trị toàn diện. Tôi trực tiếp điều hành hoạt động của phòng ban, xây dựng và chuẩn hóa quy trình, phát triển đội ngũ, thiết lập hệ thống KPI, đồng thời phối hợp với nhiều đơn vị nhằm nâng cao chất lượng dịch vụ và hiệu quả vận hành. Chính giai đoạn này đã giúp tôi hình thành tư duy quản trị hệ thống và phát triển con người song song với mục tiêu kinh doanh.',
    descEn:
      'First CS Manager role in cable TV & broadband at LBC – HTVC: standardized SOPs, established KPIs, trained staff, and aligned cross-team ops.',
    highlightVi: 'Trưởng phòng · Chuẩn hóa Quy trình & Quản trị KPI',
    highlightEn: 'CS Manager · SOP Standardization & KPIs',
    highlightIconName: 'Tv',
  },
  {
    id: '2013',
    sourceKey: '2013',
    yearLabelVi: '2013 (Phần 1)',
    yearLabelEn: '2013 (Part 1)',
    roleVi: 'Trưởng phòng CSKH cấp cao',
    roleEn: 'Senior CS Manager',
    managementVi: '129 nhân sự trực tiếp',
    managementEn: '129 direct staff',
    workVi: 'Cơ cấu bộ máy, Game Supporter & quản lý kế thừa',
    workEn: 'Org design, Game Support & succession leaders',
    milestoneTitleVi: 'Garena & eSports',
    milestoneTitleEn: 'Garena & eSports',
    descVi:
      'Gia nhập **Garena**, tôi quản lý hoạt động chăm sóc khách hàng trong lĩnh vực game trực tuyến, nơi yêu cầu tốc độ xử lý nhanh, độ chính xác cao và khả năng đáp ứng lượng khách hàng rất lớn. Tại Garena, tôi trực tiếp quản lý **129 nhân sự**, xây dựng cơ cấu tổ chức, phát triển đội ngũ quản lý cấp trung, chuẩn hóa quy trình vận hành, thiết lập hệ thống đánh giá hiệu quả công việc và đào tạo nguồn nhân lực kế thừa.',
    descEn:
      'Joined Garena managing online gaming CS across 129 staff, establishing team structure, middle-management development, and workflow standards.',
    highlightVi: 'Trưởng phòng cấp cao (129 NS) · Quản lý, Đào tạo & Hệ thống',
    highlightEn: 'Senior Manager (129 staff) · Leadership, Training & Systems',
    highlightIconName: 'Gamepad2',
  },
  {
    id: '2014',
    sourceKey: '2013',
    yearLabelVi: '2013 (Phần 2)',
    yearLabelEn: '2013 (Part 2)',
    roleVi: 'Trưởng phòng CSKH Đa lĩnh vực',
    roleEn: 'Multi-Sector CX Lead',
    managementVi: 'Đội ngũ CSKH đa nền tảng',
    managementEn: 'Multi-platform CX teams',
    workVi: 'TMĐT Shopee, Ví AirPay & Gcafe',
    workEn: 'Shopee E-commerce, AirPay & Gcafe',
    milestoneTitleVi: 'Hệ sinh thái Số (Shopee, AirPay, Gcafe)',
    milestoneTitleEn: 'Digital Ecosystem (Shopee, AirPay, Gcafe)',
    descVi:
      'Trong thời gian này, Garena phát triển mạnh với Liên Minh Huyền Thoại, đồng thời mở rộng thành Vietnam eSport và đầu tư vào nhiều lĩnh vực mới như **Shopee**, **AirPay**, **Gcafe** và **Liên Quân Mobile**. Tôi có cơ hội đồng hành cùng các dự án ngay từ giai đoạn đầu. Mỗi sản phẩm đều có mô hình vận hành, hành vi người dùng và kỳ vọng khách hàng khác nhau, buộc tôi phải liên tục học hỏi, thích nghi và cập nhật kiến thức để xây dựng các quy trình chăm sóc khách hàng phù hợp với từng lĩnh vực. Đặc biệt, việc tham gia vào giai đoạn phát triển ban đầu của **Shopee** giúp tôi tiếp cận tư duy quản trị thương mại điện tử hiện đại, từ hành trình khách hàng, trải nghiệm đa kênh, vận hành dịch vụ quy mô lớn đến ứng dụng dữ liệu trong quản trị chất lượng và tối ưu hiệu quả hoạt động. Làm việc trong môi trường tăng trưởng với tốc độ rất cao giúp tôi rèn luyện khả năng ra quyết định dưới áp lực, xử lý nhanh các tình huống phát sinh, điều phối nguồn lực hiệu quả và liên tục cải tiến quy trình để đáp ứng sự thay đổi của thị trường. Đây cũng là giai đoạn đặt nền móng cho triết lý quản trị của tôi: **xây dựng hệ thống trước khi mở rộng quy mô, phát triển con người song hành cùng công nghệ và luôn lấy khách hàng làm trung tâm trong mọi quyết định**.',
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
    roleVi: 'Trưởng phòng Call Center',
    roleEn: 'Call Center Manager',
    managementVi: '12 nhân sự trực tiếp + 40+ chuyên viên tư vấn',
    managementEn: '12 direct staff + 40+ advisors',
    workVi: 'Call Center Bảo hiểm',
    workEn: 'Insurance Call Center',
    milestoneTitleVi: 'Prudential Việt Nam',
    milestoneTitleEn: 'Prudential Vietnam',
    descVi:
      'Tại **Prudential**, tôi có cơ hội làm việc trong lĩnh vực bảo hiểm – một ngành dịch vụ đòi hỏi tính chính xác, minh bạch và mức độ tin cậy rất cao. Thời gian này giúp tôi hiểu sâu hơn về quản trị trải nghiệm khách hàng, quản lý chất lượng dịch vụ và xây dựng niềm tin bền vững thông qua quy trình chuyên nghiệp và sự đồng cảm trong từng điểm chạm với khách hàng.',
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
    roleVi: 'Trưởng phòng CSKH cấp cao (FinTech)',
    roleEn: 'Senior CS Manager (FinTech)',
    managementVi: '60 nhân sự nội bộ + hàng trăm nhân sự đối tác BPO',
    managementEn: '60 internal staff + hundreds of BPO partner agents',
    workVi: 'Tối ưu quy trình hỗ trợ, vận hành đa kênh & CRM số',
    workEn: 'Omnichannel ops, process optimization & digital CRM',
    milestoneTitleVi: 'Ví MoMo',
    milestoneTitleEn: 'MoMo E-Wallet',
    descVi:
      'Gia nhập **MoMo**, tôi tiếp tục mở rộng kinh nghiệm trong lĩnh vực tài chính số. Tôi tập trung tối ưu quy trình hỗ trợ khách hàng, nâng cao hiệu quả vận hành, ứng dụng công nghệ vào quản trị dịch vụ và cải thiện trải nghiệm khách hàng trên nền tảng số.',
    descEn:
      'Led internal staff and BPO operations at MoMo FinTech: scaled omnichannel ops, built real-time CRM systems, streamlined workflows, and automated service.',
    highlightVi: 'Quản lý cấp cao FinTech · Tối ưu quy trình & Tài chính số',
    highlightEn: 'Senior FinTech Lead · Process Optimization & Digital Finance',
    highlightIconName: 'CreditCard',
  },
  {
    id: '2023',
    sourceKey: '2023',
    yearLabelVi: '2023',
    yearLabelEn: '2023',
    roleVi: 'Trưởng phòng CSKH',
    roleEn: 'Head of Customer Service',
    managementVi: '17 nhân sự trực tiếp',
    managementEn: '17 direct staff',
    workVi: 'Hệ thống CSKH Ví ECO & bán lẻ B2B',
    workEn: 'ECO Wallet CS & B2B retail ops',
    milestoneTitleVi: 'Ví ECO · Công nghệ Finviet',
    milestoneTitleEn: 'ECO Wallet · Finviet Tech',
    descVi:
      'Tại **Ví ECO**, tôi tiếp tục phát triển chuyên môn trong lĩnh vực tài chính, nơi mọi hoạt động đều đặt yêu cầu cao về tính chính xác, minh bạch và sự tin cậy. Giai đoạn này giúp tôi hoàn thiện hơn tư duy xây dựng hệ thống dịch vụ khách hàng hiện đại, kết hợp giữa quy trình, công nghệ và trải nghiệm người dùng.',
    descEn:
      'Spearheaded modern CS architecture for ECO Wallet & B2B FinTech, unifying Management, Process, Training, and Systems for trusted UX.',
    highlightVi: 'Trưởng phòng CSKH · Tài chính số & Trải nghiệm tin cậy',
    highlightEn: 'Head of CS · Digital Finance & Trusted User Experience',
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
    roleTitle: def.roleVi,
    roleEn: def.roleEn,
    managementVi: def.managementVi,
    managementEn: def.managementEn,
    workVi: def.workVi,
    workEn: def.workEn,
    highlightVi: def.highlightVi,
    highlightEn: def.highlightEn,
    milestoneTitleVi: def.milestoneTitleVi,
    descVi: def.descVi,
    descEn: def.descEn,
    descViPart2: '',
    roleIconName: 'briefcase',
    highlightIconName: def.highlightIconName,
    color: base.hexColor,
    roleVi: def.roleVi,
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
