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
  milestoneTitleVi: string;
  descVi: string;
  descEn: string;
  highlightVi: string;
  highlightIconName: string;
}> = [
  {
    id: '2002',
    sourceKey: '2003',
    yearLabelVi: '2002',
    milestoneTitleVi: 'Khởi đầu tại MobiFone',
    descVi:
      'Tôi bắt đầu sự nghiệp tại **MobiFone**, nơi tôi được đào tạo bài bản về **dịch vụ khách hàng**, **quản lý tổng đài**, **xử lý sự cố** và **xây dựng quy trình phục vụ** theo tiêu chuẩn ngành viễn thông. Đây là nền tảng giúp tôi hình thành **tư duy lấy khách hàng làm trung tâm** và hiểu rõ tầm quan trọng của **quy trình** trong vận hành dịch vụ.',
    descEn:
      'Started at MobiFone with structured training in customer service, contact center operations, incident handling, and telecom-grade service SOPs, forming a customer-centric operational mindset.',
    highlightVi: 'Nền tảng chuẩn mực dịch vụ & quy trình viễn thông',
    highlightIconName: 'Signal',
  },
  {
    id: '2007',
    sourceKey: '2007',
    yearLabelVi: '2007',
    milestoneTitleVi: 'Phát triển năng lực quản lý tại Viễn Liên V247',
    descVi:
      'Gia nhập **Viễn Liên V247**, tôi tiếp tục phát triển **năng lực quản lý đội ngũ**, **giám sát chất lượng dịch vụ** và **tối ưu hiệu quả vận hành** của trung tâm chăm sóc khách hàng. Giai đoạn này giúp tôi tích lũy kinh nghiệm **quản lý hoạt động với quy mô lớn** và xây dựng các **chỉ số đánh giá chất lượng dịch vụ**.',
    descEn:
      'Expanded team leadership, QA supervision, and contact center operational optimization at Vien Lien V247, building large-scale operations and service quality metrics.',
    highlightVi: 'Quản lý vận hành quy mô lớn & hệ thống đánh giá chất lượng',
    highlightIconName: 'Headset',
  },
  {
    id: '2011',
    sourceKey: '2011',
    yearLabelVi: '2011',
    milestoneTitleVi: 'Bước ngoặt tại LBC – Truyền hình Cáp HTV',
    descVi:
      'Đây là dấu mốc quan trọng khi tôi lần đầu đảm nhiệm vị trí **Trưởng phòng Chăm sóc Khách hàng**. Từ một nhà quản lý vận hành, tôi chuyển mình trở thành một **nhà quản trị toàn diện**. Tôi trực tiếp điều hành hoạt động của phòng ban, **xây dựng và chuẩn hóa quy trình**, **phát triển đội ngũ**, **thiết lập hệ thống KPI**, đồng thời phối hợp với nhiều đơn vị nhằm nâng cao chất lượng dịch vụ và hiệu quả vận hành. Chính giai đoạn này đã giúp tôi hình thành **tư duy quản trị hệ thống** và **phát triển con người** song song với **mục tiêu kinh doanh**.',
    descEn:
      'First tenure as Customer Service Manager at LBC – HTV Cable TV, transitioning into holistic department leadership across SOP standardization, KPI design, team development, and cross-unit alignment.',
    highlightVi: 'Bước ngoặt Trưởng phòng CSKH · Tư duy quản trị toàn diện',
    highlightIconName: 'Tv',
  },
  {
    id: '2013',
    sourceKey: '2013',
    yearLabelVi: '2013 (Phần 1)',
    milestoneTitleVi: 'Garena & Vận hành eSports',
    descVi:
      'Gia nhập **Garena**, tôi quản lý hoạt động chăm sóc khách hàng trong lĩnh vực game trực tuyến, nơi yêu cầu tốc độ xử lý nhanh, độ chính xác cao và khả năng đáp ứng lượng khách hàng rất lớn. Trong thời gian này, Garena phát triển mạnh với **Liên Minh Huyền Thoại** và **Liên Quân Mobile**. Tại Garena, tôi trực tiếp quản lý **129 nhân sự**, xây dựng cơ cấu tổ chức, phát triển đội ngũ quản lý cấp trung, chuẩn hóa quy trình vận hành, thiết lập hệ thống đánh giá hiệu quả công việc và đào tạo nguồn nhân lực kế thừa.',
    descEn:
      'Led 129-person customer operations at Garena across League of Legends and Arena of Valor, establishing middle management, SOPs, and data-driven QA.',
    highlightVi: 'Quản lý 129 nhân sự · Vận hành Game Support eSports',
    highlightIconName: 'Gamepad2',
  },
  {
    id: '2014',
    sourceKey: '2013',
    yearLabelVi: '2013 (Phần 2)',
    milestoneTitleVi: 'Garena & Hệ sinh thái Số (Shopee, AirPay, Gcafe)',
    descVi:
      'Đồng hành ngay từ giai đoạn phát triển ban đầu của **Shopee**, **AirPay** và **Gcafe**. Việc tham gia vào giai đoạn đầu của **Shopee** giúp tôi tiếp cận tư duy quản trị thương mại điện tử hiện đại, từ hành trình khách hàng, trải nghiệm đa kênh, vận hành dịch vụ quy mô lớn đến ứng dụng dữ liệu trong quản trị chất lượng. Đây là giai đoạn đặt nền móng cho triết lý quản trị của tôi: **xây dựng hệ thống trước khi mở rộng quy mô**, **phát triển con người song hành cùng công nghệ** và **luôn lấy khách hàng làm trung tâm**.',
    descEn:
      'Early-stage scaling for Shopee, AirPay & Gcafe, shaping modern e-commerce CX, omnichannel operations, and user journey management.',
    highlightVi: 'Đồng hành Shopee, AirPay, Gcafe · Tư duy thương mại điện tử',
    highlightIconName: 'Rocket',
  },
  {
    id: '2016',
    sourceKey: '2016',
    yearLabelVi: '2016',
    milestoneTitleVi: 'Prudential Việt Nam',
    descVi:
      'Tại **Prudential**, tôi có cơ hội làm việc trong lĩnh vực **bảo hiểm** – một ngành dịch vụ đòi hỏi tính **chính xác**, **minh bạch** và **mức độ tin cậy rất cao**. Thời gian này giúp tôi hiểu sâu hơn về **quản trị trải nghiệm khách hàng**, **quản lý chất lượng dịch vụ** và xây dựng niềm tin bền vững thông qua **quy trình chuyên nghiệp** và **sự đồng cảm** trong từng điểm chạm với khách hàng.',
    descEn:
      'Advanced customer experience governance and service quality in life insurance at Prudential Vietnam, reinforcing trust through rigorous standards and empathetic touchpoints.',
    highlightVi: 'Quản trị trải nghiệm khách hàng chuẩn mực & sự đồng cảm',
    highlightIconName: 'ShieldCheck',
  },
  {
    id: '2018',
    sourceKey: '2018',
    yearLabelVi: '2018',
    milestoneTitleVi: 'MoMo',
    descVi:
      'Gia nhập **MoMo**, tôi tiếp tục mở rộng kinh nghiệm trong lĩnh vực **tài chính số**. Tôi tập trung **tối ưu quy trình hỗ trợ khách hàng**, **nâng cao hiệu quả vận hành**, **ứng dụng công nghệ** vào quản trị dịch vụ và **cải thiện trải nghiệm khách hàng** trên nền tảng số.',
    descEn:
      'Scaled digital fintech support at MoMo by streamlining support workflows, elevating operational efficiency, and applying service technology on mobile digital platforms.',
    highlightVi: 'Tối ưu vận hành tài chính số & ứng dụng công nghệ dịch vụ',
    highlightIconName: 'CreditCard',
  },
  {
    id: '2023',
    sourceKey: '2023',
    yearLabelVi: '2023',
    milestoneTitleVi: 'Ví ECO',
    descVi:
      'Tại **Ví ECO**, tôi tiếp tục phát triển chuyên môn trong lĩnh vực **tài chính**, nơi mọi hoạt động đều đặt yêu cầu cao về tính **chính xác**, **minh bạch** và **sự tin cậy**. Giai đoạn này giúp tôi hoàn thiện hơn tư duy **xây dựng hệ thống dịch vụ khách hàng hiện đại**, kết hợp giữa **quy trình**, **công nghệ** và **trải nghiệm người dùng**.',
    descEn:
      'Refined modern fintech customer service architecture at ECO Wallet, harmonizing rigorous process compliance, technology automation, and seamless user experience.',
    highlightVi: 'Hoàn thiện hệ thống dịch vụ số · Quy trình, Công nghệ & Trải nghiệm',
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
    yearLabelEn: def.yearLabelVi,
    roleTitle: base.roleTitle,
    roleEn: base.roleTitle,
    highlightVi: def.highlightVi,
    highlightEn: def.highlightVi,
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
