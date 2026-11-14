export interface SkillItem {
  icon: string;
  name: string;
  percent: number;
  desc: string;
}

export interface SkillCategory {
  id: string;
  code: string;
  quadrant: 'S' | 'W' | 'O' | 'T';
  title: string;
  desc: string;
  headerIcon: string;
  theme: {
    accent: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    barGradient: string;
    subBg: string;
    subBorder: string;
    iconBg: string;
  };
  skills: SkillItem[];
}

export interface LanguageSkill {
  id: string;
  icon: string;
  name: string;
  percent: number;
  level: string;
  desc: string;
  strokeColor: string;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'strengths',
    code: '7.1',
    quadrant: 'S',
    title: '7.1. Điểm mạnh: Nền tảng vận hành & lãnh đạo',
    desc: 'Những năng lực cốt lõi đã được chứng minh qua thực tiễn quản lý, vận hành và phát triển hệ thống Dịch vụ Khách hàng.',
    headerIcon: 'gem',
    theme: {
      accent: 'text-blue-600',
      border: 'border-blue-200/80',
      badgeBg: 'bg-blue-500/10',
      badgeText: 'text-blue-700 border-blue-200',
      barGradient: 'from-blue-500 to-cyan-500',
      subBg: 'bg-blue-50/40 hover:bg-white',
      subBorder: 'border-blue-100/70',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    skills: [
      { icon: 'target', name: 'Trải nghiệm khách hàng', percent: 98, desc: 'Xây dựng và tối ưu hóa trải nghiệm khách hàng toàn diện' },
      { icon: 'phone', name: 'Hệ thống CRM', percent: 96, desc: 'Quản trị và vận hành hệ thống CRM & Contact Center đa kênh' },
      { icon: 'chart', name: 'Quản trị hiệu suất', percent: 96, desc: 'Thiết lập và theo dõi bộ chỉ số KPI/SLA vận hành' },
      { icon: 'users', name: 'Lãnh đạo đội ngũ', percent: 95, desc: 'Lãnh đạo, đào tạo và phát triển đội ngũ quy mô lớn' },
      { icon: 'clipboard', name: 'Chuẩn hóa quy trình', percent: 95, desc: 'Xây dựng quy trình vận hành tiêu chuẩn chuẩn hóa 100%' },
      { icon: 'shield', name: 'Xử lý khủng hoảng', percent: 94, desc: 'Quản trị sự cố và xử lý khủng hoảng dịch vụ khẩn cấp' },
    ],
  },
  {
    id: 'weaknesses',
    code: '7.2',
    quadrant: 'W',
    title: '7.2. Hoàn thiện: Nâng cao năng lực quản trị',
    desc: 'Những năng lực cần tiếp tục hoàn thiện để nâng tầm vai trò quản lý từ vận hành hiệu quả sang quản trị chiến lược và phát triển bền vững.',
    headerIcon: 'trend-up',
    theme: {
      accent: 'text-amber-600',
      border: 'border-amber-200/80',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-700 border-amber-200',
      barGradient: 'from-amber-500 to-orange-500',
      subBg: 'bg-amber-50/40 hover:bg-white',
      subBorder: 'border-amber-100/70',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    skills: [
      { icon: 'search', name: 'Tốc độ nghiên cứu', percent: 75, desc: 'Cần cải thiện tốc độ phân tích và nghiên cứu dữ liệu sâu' },
      { icon: 'users', name: 'Mở rộng mối quan hệ', percent: 80, desc: 'Phát triển mạng lưới kết nối chuyên gia trong ngành' },
      { icon: 'pencil', name: 'Chi tiết thiết kế', percent: 82, desc: 'Nâng cao sự tinh tế trong thiết kế trải nghiệm người dùng' },
      { icon: 'layers', name: 'Xử lý đa nhiệm', percent: 85, desc: 'Tối ưu hóa khả năng điều phối nhiều dự án cùng lúc' },
    ],
  },
  {
    id: 'opportunities',
    code: '7.3',
    quadrant: 'O',
    title: '7.3. Cơ hội: Công nghệ & chuyển đổi dịch vụ',
    desc: 'Những năng lực tạo đòn bẩy để nâng cao hiệu quả vận hành, tối ưu nguồn lực và chuyển đổi mô hình Dịch vụ Khách hàng trong thời đại số.',
    headerIcon: 'rocket',
    theme: {
      accent: 'text-purple-600',
      border: 'border-purple-200/80',
      badgeBg: 'bg-purple-500/10',
      badgeText: 'text-purple-700 border-purple-200',
      barGradient: 'from-purple-500 to-pink-500',
      subBg: 'bg-purple-50/40 hover:bg-white',
      subBorder: 'border-purple-100/70',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    skills: [
      { icon: 'bot', name: 'Tích hợp AI', percent: 95, desc: 'Ứng dụng Generative AI và RPA tự động hóa thao tác' },
      { icon: 'globe', name: 'Mở rộng toàn cầu', percent: 90, desc: 'Cơ hội triển khai hệ thống vận hành quy mô quốc tế' },
      { icon: 'bolt', name: 'Công nghiệp 4.0', percent: 92, desc: 'Tận dụng công nghệ số trong cuộc cách mạng 4.0' },
      { icon: 'home', name: 'Làm việc Hybrid', percent: 88, desc: 'Xây dựng mô hình vận hành linh hoạt và hiệu quả' },
    ],
  },
  {
    id: 'threats',
    code: '7.4',
    quadrant: 'T',
    title: '7.4. Thách thức: Thích ứng & quản trị biến động',
    desc: 'Những yếu tố bên ngoài tác động trực tiếp đến chất lượng dịch vụ, nhân sự và hiệu quả vận hành, đòi hỏi khả năng thích ứng và quản trị chủ động.',
    headerIcon: 'target',
    theme: {
      accent: 'text-rose-600',
      border: 'border-rose-200/80',
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-700 border-rose-200',
      barGradient: 'from-red-500 to-rose-600',
      subBg: 'bg-rose-50/40 hover:bg-white',
      subBorder: 'border-rose-100/70',
      iconBg: 'bg-rose-100 text-rose-700',
    },
    skills: [
      { icon: 'trend-down', name: 'Bão hòa công nghệ', percent: 85, desc: 'Áp lực thích nghi với tốc độ bão hòa nhanh của công nghệ' },
      { icon: 'alert-triangle', name: 'Lỗi thời kỹ năng', percent: 80, desc: 'Nguy cơ các kỹ năng truyền thống bị thay thế bởi AI' },
      { icon: 'flame', name: 'Nguy cơ kiệt sức', percent: 78, desc: 'Quản trị áp lực công việc để tránh Burnout trong vận hành' },
      { icon: 'users', name: 'Tính cạnh tranh cao', percent: 82, desc: 'Áp lực từ sự cạnh tranh khốc liệt trên thị trường nhân sự' },
    ],
  },
];

export const LANGUAGE_SKILLS: LanguageSkill[] = [
  {
    id: 'vi',
    icon: 'globe',
    name: 'Tiếng Việt',
    percent: 90,
    level: 'Ngôn ngữ bản xứ',
    desc: 'Ngôn ngữ bản xứ, thành thạo chuyên sâu trong giao tiếp và điều hành',
    strokeColor: '#10b981',
  },
  {
    id: 'en',
    icon: 'globe',
    name: 'Tiếng Anh',
    percent: 60,
    level: '',
    desc: 'Giao tiếp chuyên nghiệp, đáp ứng công việc trong môi trường quốc tế',
    strokeColor: '#3b82f6',
  },
  {
    id: 'ai',
    icon: 'bot',
    name: 'Ứng dụng AI',
    percent: 85,
    level: 'Thành thạo',
    desc: 'Dịch thuật & Trợ lý AI thời gian thực hỗ trợ trao đổi đa quốc gia',
    strokeColor: '#8b5cf6',
  },
];

export interface SwotSkillItem {
  id: string;
  iconName: string;
  labelVi: string;
  labelEn: string;
  percent: number;
  descVi?: string;
  descEn?: string;
}

export interface LanguageProficiencyItem {
  id: string;
  nameVi: string;
  nameEn: string;
  roleVi: string;
  roleEn: string;
  levelVi: string;
  levelEn: string;
  percent: number;
  color: string;
  descVi?: string;
}

export const STRENGTHS_DATA: SwotSkillItem[] = [
  { id: 's-1', iconName: 'Target', labelVi: 'Trải nghiệm khách hàng toàn diện nhất', labelEn: 'Comprehensive Customer Experience', percent: 98, descVi: 'Xây dựng và tối ưu hóa trải nghiệm khách hàng toàn diện' },
  { id: 's-2', iconName: 'Phone', labelVi: 'Vận hành CRM và Contact Center', labelEn: 'CRM & Contact Center Operations', percent: 96, descVi: 'Quản trị và vận hành hệ thống CRM & Contact Center đa kênh' },
  { id: 's-3', iconName: 'BarChart3', labelVi: 'Quản trị hiệu suất vận hành chuẩn', labelEn: 'Standard Performance Management', percent: 96, descVi: 'Thiết lập và theo dõi bộ chỉ số KPI/SLA vận hành' },
  { id: 's-4', iconName: 'Users', labelVi: 'Lãnh đạo và phát triển đội ngũ', labelEn: 'Team Leadership & Development', percent: 95, descVi: 'Lãnh đạo, đào tạo và phát triển đội ngũ quy mô lớn' },
  { id: 's-5', iconName: 'Clipboard', labelVi: 'Xây dựng quy trình vận hành SOP', labelEn: 'SOP Standardization & Design', percent: 95, descVi: 'Xây dựng quy trình vận hành tiêu chuẩn chuẩn hóa 100%' },
  { id: 's-6', iconName: 'ShieldAlert', labelVi: 'Quản trị và xử lý khủng hoảng', labelEn: 'Crisis Management & Resolution', percent: 94, descVi: 'Quản trị sự cố và xử lý khủng hoảng dịch vụ khẩn cấp' },
];

export const WEAKNESSES_DATA: SwotSkillItem[] = [
  { id: 'w-1', iconName: 'Heart', labelVi: 'Phát triển tư duy dịch vụ', labelEn: 'Service Mindset Development', percent: 92, descVi: 'Định hướng triết lý phụng sự và văn hóa thấu cảm trong tổ chức' },
  { id: 'w-2', iconName: 'MessageSquare', labelVi: 'Kỹ năng giao tiếp đàm phán', labelEn: 'Communication & Negotiation Skills', percent: 90, descVi: 'Kỹ năng truyền thông, thuyết phục và đàm phán cấp cao' },
  { id: 'w-3', iconName: 'Compass', labelVi: 'Tư duy hoạch định chiến lược', labelEn: 'Strategic Planning Mindset', percent: 88, descVi: 'Hoạch định tầm nhìn dài hạn và chuyển đổi chiến lược CX' },
  { id: 'w-4', iconName: 'Kanban', labelVi: 'Năng lực quản trị dự án', labelEn: 'Agile Project Management', percent: 88, descVi: 'Điều hành các dự án cải tiến theo phương pháp Agile/Kanban' },
  { id: 'w-5', iconName: 'Sparkles', labelVi: 'Ứng dụng công nghệ đổi mới', labelEn: 'Innovative Technology Application', percent: 86, descVi: 'Nghiên cứu và thử nghiệm công nghệ nâng cao hiệu suất' },
  { id: 'w-6', iconName: 'Code', labelVi: 'Kỹ năng thiết kế lập trình', labelEn: 'Programming & System Design Skills', percent: 78, descVi: 'Tự phát triển kỹ năng kỹ thuật để làm chủ hệ thống số' },
];

export const OPPORTUNITIES_DATA: SwotSkillItem[] = [
  { id: 'o-1', iconName: 'Bot', labelVi: 'Trí tuệ nhân tạo tự động', labelEn: 'AI & Automation Leverage', percent: 94, descVi: 'Ứng dụng Generative AI và RPA tự động hóa thao tác' },
  { id: 'o-2', iconName: 'TrendingUp', labelVi: 'Cải tiến liên tục quy trình', labelEn: 'Continuous Process Improvement', percent: 94, descVi: 'Tư duy cải tiến liên tục quy trình và loại bỏ lãng phí' },
  { id: 'o-3', iconName: 'DollarSign', labelVi: 'Tối ưu chi phí vận hành', labelEn: 'Cost-to-Serve Optimization', percent: 93, descVi: 'Tối ưu hóa Cost-to-Serve nhưng vẫn giữ vững chất lượng CSAT' },
  { id: 'o-4', iconName: 'Workflow', labelVi: 'Chuyển đổi số dịch vụ khách', labelEn: 'Customer Service Digital Leap', percent: 92, descVi: 'Số hóa toàn diện kênh tương tác và luồng công việc CSKH' },
  { id: 'o-5', iconName: 'Database', labelVi: 'Quản trị dữ liệu trải nghiệm', labelEn: 'Experience Data & VoC Analytics', percent: 91, descVi: 'Khai thác dữ liệu hành vi và phân tích cảm xúc khách hàng VoC' },
  { id: 'o-6', iconName: 'Cpu', labelVi: 'Thiết kế kiến trúc hệ thống', labelEn: 'Scalable System Architecture', percent: 87, descVi: 'Kiến trúc hạ tầng Contact Center linh hoạt và mở rộng dễ dàng' },
];

export const THREATS_DATA: SwotSkillItem[] = [
  { id: 't-1', iconName: 'Scale', labelVi: 'Tối ưu chi phí hiệu năng', labelEn: 'Performance vs Cost Balance', percent: 94, descVi: 'Áp lực giảm chi phí vận hành nhưng phải duy trì hiệu năng cao' },
  { id: 't-2', iconName: 'Cpu', labelVi: 'Trí tuệ nhân tạo thay đổi', labelEn: 'Rapid AI Transformation', percent: 92, descVi: 'Tốc độ chuyển đổi AI nhanh đòi hỏi tái đào tạo nhân sự kịp thời' },
  { id: 't-3', iconName: 'Zap', labelVi: 'Công nghệ đổi mới thị trường', labelEn: 'Market Tech Disruption', percent: 90, descVi: 'Sự xuất hiện liên tục của các công cụ số mới trên thị trường' },
  { id: 't-4', iconName: 'ShieldAlert', labelVi: 'Quản trị rủi ro vận hành', labelEn: 'Operational Risk Governance', percent: 90, descVi: 'Rủi ro biến động nhân sự, an toàn thông tin và khủng hoảng CSKH' },
  { id: 't-5', iconName: 'Users', labelVi: 'Cạnh tranh nguồn nhân lực cao', labelEn: 'Talent Market Competition', percent: 88, descVi: 'Tỷ lệ xoay dòng nhân sự ngành CSKH cao, đòi hỏi chính sách giữ chân tốt' },
  { id: 't-6', iconName: 'Network', labelVi: 'Phối hợp công việc liên phòng', labelEn: 'Cross-functional Alignment', percent: 86, descVi: 'Xung đột điểm nghẽn quy trình giữa CSKH, Sản phẩm và Kinh doanh' },
];

export const LANGUAGES_DATA: LanguageProficiencyItem[] = [
  {
    id: 'vi',
    nameVi: 'Tiếng Việt',
    nameEn: 'Vietnamese',
    roleVi: 'Ngôn ngữ bản xứ',
    roleEn: 'Native language',
    levelVi: 'Ngôn ngữ bản xứ',
    levelEn: 'Native Proficiency',
    percent: 90,
    color: 'text-emerald-600 dark:text-emerald-400',
    descVi: 'Ngôn ngữ bản xứ, thành thạo chuyên sâu trong giao tiếp và điều hành',
  },
  {
    id: 'en',
    nameVi: 'Tiếng Anh',
    nameEn: 'English',
    roleVi: 'Giao tiếp văn phòng',
    roleEn: 'Professional working',
    levelVi: '',
    levelEn: 'Professional Working',
    percent: 60,
    color: 'text-blue-600 dark:text-sky-400',
    descVi: 'Giao tiếp văn phòng, đáp ứng công việc trong môi trường quốc tế',
  },
  {
    id: 'ai',
    nameVi: 'Ứng dụng AI',
    nameEn: 'AI Multilingual Assistant',
    roleVi: 'Dịch thuật & Trợ lý AI thời gian thực',
    roleEn: 'Real-time AI Translation & Assistant',
    levelVi: '',
    levelEn: '',
    percent: 85,
    color: 'text-purple-600 dark:text-purple-400',
    descVi: 'Dịch thuật & Trợ lý AI thời gian thực hỗ trợ trao đổi đa quốc gia',
  },
];

export interface SkillGroup {
  id: string;
  titleVi: string;
  titleEn: string;
  code: string;
  descVi: string;
  items: SwotSkillItem[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  { id: 'strengths', titleVi: '7.1. Điểm mạnh: Nền tảng vận hành & lãnh đạo', titleEn: '7.1. Operational & Leadership Core Strengths', code: 'S', descVi: 'Những năng lực cốt lõi đã được chứng minh qua thực tiễn quản lý, vận hành và phát triển hệ thống Dịch vụ Khách hàng.', items: STRENGTHS_DATA },
  { id: 'weaknesses', titleVi: '7.2. Hoàn thiện: Nâng cao năng lực quản trị', titleEn: '7.2. Strategic Management Refinements', code: 'W', descVi: 'Những năng lực cần tiếp tục hoàn thiện để nâng tầm vai trò quản lý từ vận hành hiệu quả sang quản trị chiến lược và phát triển bền vững.', items: WEAKNESSES_DATA },
  { id: 'opportunities', titleVi: '7.3. Cơ hội: Công nghệ & chuyển đổi dịch vụ', titleEn: '7.3. Technology & Service Transformation Opportunities', code: 'O', descVi: 'Những năng lực tạo đòn bẩy để nâng cao hiệu quả vận hành, tối ưu nguồn lực và chuyển đổi mô hình Dịch vụ Khách hàng trong thời đại số.', items: OPPORTUNITIES_DATA },
  { id: 'threats', titleVi: '7.4. Thách thức: Thích ứng & quản trị biến động', titleEn: '7.4. Adaptation & Volatility Management Threats', code: 'T', descVi: 'Những yếu tố bên ngoài tác động trực tiếp đến chất lượng dịch vụ, nhân sự và hiệu quả vận hành, đòi hỏi khả năng thích ứng và quản trị chủ động.', items: THREATS_DATA },
];
