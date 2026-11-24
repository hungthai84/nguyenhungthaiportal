export interface EducationCourse {
  id: number;
  title: string;
  year: string;
  code?: string;
  category: 'degree' | 'management' | 'tech' | 'skills';
  issuer: string;
  desc: string;
  skills: string[];
  image: string;
  courseImg?: string;
  certImg?: string;
  type?: string;
  orientation?: string;
  focus?: string;
  modules: string[];
  application?: string;
  result?: string;
  accentColor?: string;
}

export interface CredentialVerification {
  credentialId: string;
  organization: string;
  registryName: string;
  status: string;
  verifyUrl: string;
  twoWordTitle?: string;
}

export interface AcademicRadarAxis {
  axis: string;
  score: number;
  fullMark: number;
}

export const ACADEMIC_COMPETENCY_RADAR: AcademicRadarAxis[] = [
  { axis: 'CNTT & Phần mềm', score: 94, fullMark: 100 },
  { axis: 'Quản trị Kinh doanh', score: 95, fullMark: 100 },
  { axis: 'Vận hành Contact Center', score: 98, fullMark: 100 },
  { axis: 'Quản lý Dự án (PMP)', score: 92, fullMark: 100 },
  { axis: 'Quản trị Rủi ro', score: 90, fullMark: 100 },
  { axis: 'AI & Tự động hóa CRM', score: 96, fullMark: 100 },
];

export const CREDENTIAL_VERIFICATION_MAP: Record<number, CredentialVerification> = {
  1: {
    credentialId: 'WEB-UIUX-2026-001',
    organization: 'Tự học phát triển',
    registryName: 'Cổng Quản Trị Dự Án & Portfolio',
    status: 'Đã hoàn thành xuất sắc',
    verifyUrl: 'https://github.com',
    twoWordTitle: 'Thiết Kế Web',
  },
  2: {
    credentialId: 'PRU-DATA-2019-204',
    organization: 'Prudential Vietnam',
    registryName: 'Prudential Learning Registry',
    status: 'Đã xác thực doanh nghiệp',
    verifyUrl: 'https://prudential.com.vn',
    twoWordTitle: 'Phân Tích Dữ Liệu',
  },
  3: {
    credentialId: 'PRU-RM-2017-104',
    organization: 'Prudential Vietnam',
    registryName: 'Prudential Learning Registry',
    status: 'Đã xác thực doanh nghiệp',
    verifyUrl: 'https://prudential.com.vn',
    twoWordTitle: 'Quản Trị Rủi Ro',
  },
  4: {
    credentialId: 'PRU-PM-2016-042',
    organization: 'Prudential Vietnam',
    registryName: 'Prudential Learning Registry',
    status: 'Đã xác thực doanh nghiệp',
    verifyUrl: 'https://prudential.com.vn',
    twoWordTitle: 'Quản Lý Dự Án',
  },
  5: {
    credentialId: 'DC-VED-2015-EXEC',
    organization: 'Dale Carnegie & VED',
    registryName: 'Dale Carnegie Leadership Registry',
    status: 'Đã xác thực cấp cao',
    verifyUrl: 'https://dalecarnegie.com',
    twoWordTitle: 'Quản Lý Cấp Cao',
  },
  6: {
    credentialId: 'DC-VED-2014-MID',
    organization: 'Dale Carnegie & VED',
    registryName: 'Dale Carnegie Leadership Registry',
    status: 'Đã xác thực cấp trung',
    verifyUrl: 'https://dalecarnegie.com',
    twoWordTitle: 'Quản Lý Cấp Trung',
  },
  7: {
    credentialId: 'VW-TRAIN-2013-088',
    organization: 'VietnamWorks',
    registryName: 'VietnamWorks Training Registry',
    status: 'Đã xác thực kỹ năng',
    verifyUrl: 'https://vietnamworks.com',
    twoWordTitle: 'Kỹ Năng Đào Tạo',
  },
  8: {
    credentialId: 'VW-PRES-2013-112',
    organization: 'VietnamWorks',
    registryName: 'VietnamWorks Training Registry',
    status: 'Đã xác thực kỹ năng',
    verifyUrl: 'https://vietnamworks.com',
    twoWordTitle: 'Thuyết Trình',
  },
  9: {
    credentialId: 'VW-INTV-2013-205',
    organization: 'VietnamWorks',
    registryName: 'VietnamWorks Training Registry',
    status: 'Đã xác thực kỹ năng',
    verifyUrl: 'https://vietnamworks.com',
    twoWordTitle: 'Phỏng Vấn',
  },
  10: {
    credentialId: 'VW-RECR-2013-331',
    organization: 'VietnamWorks',
    registryName: 'VietnamWorks Training Registry',
    status: 'Đã xác thực kỹ năng',
    verifyUrl: 'https://vietnamworks.com',
    twoWordTitle: 'Tuyển Dụng',
  },
  11: {
    credentialId: 'STU-IT-2007-1109',
    organization: 'Trường ĐH Công nghệ Sài Gòn (STU)',
    registryName: 'Cổng Tra Cứu Văn Bằng Quốc Gia',
    status: 'Đã xác thực chính quy',
    verifyUrl: 'https://stu.edu.vn',
    twoWordTitle: 'Cử Nhân CNTT',
  },
  12: {
    credentialId: 'MOBIFONE-CC-2007-88',
    organization: 'MobiFone',
    registryName: 'MobiFone Telecom Registry',
    status: 'Chứng nhận xuất sắc',
    verifyUrl: 'https://mobifone.vn',
    twoWordTitle: 'Nghiệp Vụ Tổng Đài',
  },
  13: {
    credentialId: 'NN-CCNA-2006-441',
    organization: 'Trường Nghề Nhất Nghệ',
    registryName: 'Nhất Nghệ Cisco Registry',
    status: 'Chứng nhận CCNA',
    verifyUrl: 'https://nhatnghe.com',
    twoWordTitle: 'Quản Trị Mạng',
  },
  14: {
    credentialId: 'NN-MCSA-2005-219',
    organization: 'Trường Nghề Nhất Nghệ',
    registryName: 'Nhất Nghệ Microsoft Registry',
    status: 'Chứng nhận MCSA',
    verifyUrl: 'https://nhatnghe.com',
    twoWordTitle: 'Quản Trị Máy Chủ',
  },
};

export const EDUCATION_LIST: EducationCourse[] = [
  {
    id: 1,
    title: 'Thiết Kế Web',
    year: '2026',
    code: 'WEB-2026',
    category: 'tech',
    issuer: 'Tự học phát triển',
    desc: 'Phát triển năng lực thiết kế và xây dựng sản phẩm số hiện đại kết hợp Web Development, Responsive UI/UX và AI Agent Workflows.',
    skills: ['UI/UX', 'Web Development', 'AI Agent Workflows', 'Responsive Design'],
    image: 'https://lh3.googleusercontent.com/d/1Ln25-tPm-HgA_rBlfVIJfrw3qPCI_h7p',
    courseImg: 'https://lh3.googleusercontent.com/d/1fz5ISv0B6Q2TWgo3VjyIwgGbuM3P8y-p',
    certImg: 'https://lh3.googleusercontent.com/d/1mmzjhzSEnX5BBdkM6w59-71QvwOnH_XI',
    type: 'Tự học phát triển',
    orientation: 'Phát triển năng lực thiết kế và xây dựng sản phẩm số hiện đại, kết hợp Web Development, Responsive UI/UX và AI Agent Workflows.',
    focus: 'Kỹ thuật lập trình web, Thiết kế giao diện UI/UX chuẩn Responsive, Ứng dụng AI Agent Workflows trong tự động hóa vận hành.',
    modules: [
      'HTML5, CSS3, JS, PHP, C++, GitHub',
      'Responsive UI/UX, Bento & AI Agent'
    ],
    application: 'Ứng dụng kiến thức Web, UI/UX và AI để phát triển các công cụ số phục vụ Chăm sóc Khách hàng, Quản trị vận hành, Knowledge Base, Đào tạo nội bộ, Phân tích trải nghiệm và Tự động hóa quy trình.',
    result: 'Xây dựng hoàn chỉnh các hệ thống website, Tối ưu giao diện trải nghiệm người dùng, Ứng dụng thành thạo AI vào tự động hóa vận hành.',
    accentColor: '#3B82F6',
  },
  {
    id: 2,
    title: 'Phân Tích Dữ Liệu',
    year: '2019',
    code: 'PRU-DATA-19',
    category: 'degree',
    issuer: 'Prudential Vietnam',
    desc: 'Chương trình đào tạo chuyên sâu về khai thác, xử lý và mô hình hóa dữ liệu lớn nhằm phục vụ công tác quản trị doanh nghiệp.',
    skills: ['Data Analytics', 'Power BI', 'Dashboard', 'KPI Operations'],
    image: 'https://lh3.googleusercontent.com/d/1_Y7ZKywau6Gnj8riTsYnN6eP-J95sEqM',
    courseImg: 'https://lh3.googleusercontent.com/d/18uxscIa6RLvk6wkuLAmank04RqO6Xdxn',
    certImg: 'https://i.ibb.co/bj6CYy2L/Ph-n-t-ch-d-li-u.png',
    type: 'Đào tạo nội bộ',
    orientation: 'Chương trình đào tạo chuyên sâu về khai thác, xử lý và mô hình hóa dữ liệu lớn nhằm phục vụ công tác quản trị doanh nghiệp.',
    focus: 'Khai thác, xử lý và mô hình hóa dữ liệu lớn, Phân tích dữ liệu & Trực quan hóa dữ liệu, Thiết lập hệ thống báo cáo KPI tự động & Xây dựng Dashboard điều hành.',
    modules: [
      'Phân tích dữ liệu và Trực quan hóa dữ liệu',
      'Thiết lập hệ thống báo cáo KPI tự động',
      'Xây dựng Dashboard điều hành',
      'Xây dựng hệ thống Dashboard Realtime Power BI đo lường hiệu suất CSKH',
      'Mô hình hóa dữ liệu hành vi và phân tích cảm xúc khách hàng (VoC)'
    ],
    application: 'Ứng dụng dữ liệu để quản trị hiệu suất CSKH, thiết lập báo cáo C-Level tự động và dự báo các chỉ số rủi ro rời bỏ (Churn Rate).',
    result: 'Chứng nhận hoàn thành đào tạo Phân tích dữ liệu do Prudential Vietnam cấp',
    accentColor: '#0EA5E9',
  },
  {
    id: 3,
    title: 'Quản Trị Rủi Ro',
    year: '2017',
    code: 'PRU-RM-17',
    category: 'management',
    issuer: 'Prudential Vietnam',
    desc: 'Đào tạo nâng cao năng lực nhận diện, đánh giá và kiểm soát rủi ro trong hoạt động vận hành và dịch vụ khách hàng.',
    skills: ['Risk Management', 'Crisis Control', 'SOP Compliance', 'Operations'],
    image: 'https://lh3.googleusercontent.com/d/1bd7HOaRJi5LI-9vNNYMRvzFGfzlg_3Vv',
    courseImg: 'https://lh3.googleusercontent.com/d/16ijuDgJOz0A6_CxQ7EPjkXGIKYUtNa07',
    certImg: 'https://lh3.googleusercontent.com/d/1mpHIPh-OLP1rtt0-HclyG05bQkyO3BlN',
    type: 'Đào tạo nội bộ',
    orientation: 'Đào tạo nâng cao năng lực nhận diện, đánh giá và kiểm soát rủi ro trong hoạt động vận hành và dịch vụ khách hàng.',
    focus: 'Nhận diện, đánh giá và kiểm soát rủi ro trong vận hành và CSKH, Kiểm soát điểm nghẽn hệ thống và xử lý khủng hoảng truyền thông.',
    modules: [
      'Quy trình đánh giá rủi ro vận hành',
      'Kiểm soát điểm nghẽn hệ thống',
      'Xử lý khủng hoảng truyền thông',
      'Giải quyết khiếu nại cấp cao',
      'Xây dựng kịch bản ứng phó sự cố vận hành và khủng hoảng dịch vụ'
    ],
    application: 'Áp dụng kiến thức quản trị rủi ro để đảm bảo tính liên tục của dịch vụ, kiểm soát sự cố vận hành CSKH và xử lý khiếu nại phức tạp.',
    result: 'Chứng chỉ mã PRU-RM-2017-104 do Prudential Vietnam cấp',
    accentColor: '#F59E0B',
  },
  {
    id: 4,
    title: 'Quản Lý Dự Án',
    year: '2016',
    code: 'PRU-PM-16',
    category: 'management',
    issuer: 'Prudential Vietnam',
    desc: 'Quản trị dự án theo phương pháp luận chuẩn quốc tế, kiểm soát toàn diện vòng đời dự án và cải tiến dịch vụ liên phòng ban.',
    skills: ['Project Management', 'WBS', 'SLA Control', 'Cross-functional'],
    image: 'https://lh3.googleusercontent.com/d/1cJI_fElnQtlMghz_J0tChzzgxmUoXGWJ',
    courseImg: 'https://lh3.googleusercontent.com/d/1IUFdB97H20H5b2F50Hk4fr80mjbtkrFf',
    certImg: 'https://lh3.googleusercontent.com/d/1v56_L-7vEOMzt08542VXI7z6pTKM81n1',
    type: 'Đào tạo nội bộ',
    orientation: 'Quản trị dự án theo phương pháp luận chuẩn quốc tế, kiểm soát toàn diện vòng đời dự án.',
    focus: 'Khóa học quản trị dự án theo phương pháp luận chuẩn quốc tế, kiểm soát toàn diện vòng đời dự án.',
    modules: [
      'Lập kế hoạch dự án & Phân bổ nguồn lực',
      'Quản lý tiến độ & Kiểm soát ngân sách',
      'Đảm bảo chất lượng và đánh giá sau triển khai',
      'Lập kế hoạch và quản lý các dự án cải tiến dịch vụ khách hàng liên phòng ban'
    ],
    application: 'Ứng dụng phương pháp luận quản lý dự án để điều hành chuỗi dự án chuyển đổi số, chuẩn hóa SOP và xây dựng hạ tầng Contact Center.',
    result: 'Chứng chỉ mã PRU-PM-2016-042 do Prudential Vietnam cấp',
    accentColor: '#10B981',
  },
  {
    id: 5,
    title: 'Quản Lý Cấp Cao',
    year: '2015',
    code: 'DC-VED-15',
    category: 'management',
    issuer: 'Dale Carnegie & VED',
    desc: 'Chương trình phát triển năng lực điều hành và tư duy lãnh đạo chiến lược dành cho quản lý cấp cao.',
    skills: ['Executive Leadership', 'Change Management', 'Strategy', 'Organization'],
    image: 'https://lh3.googleusercontent.com/d/1S4Zjbvc5I9-CweSC0uG9wfyuFK6_E23v',
    courseImg: 'https://lh3.googleusercontent.com/d/1ZZxMjxgAp77vPhSJUDHTSqK9ZYeR4rFB',
    certImg: 'https://lh3.googleusercontent.com/d/1a7N9I-7R6ltBjWWUCvCLqYSc5fjv7cHa',
    type: 'Đào tạo bên ngoài',
    orientation: 'Phát triển năng lực điều hành và tư duy lãnh đạo chiến lược dành cho quản lý cấp cao.',
    focus: 'Chương trình phát triển năng lực điều hành và tư duy lãnh đạo chiến lược dành cho quản lý cấp cao.',
    modules: [
      'Tư duy lãnh đạo chiến lược',
      'Quản trị sự thay đổi',
      'Xây dựng bộ máy tổ chức',
      'Truyền cảm hứng và điều hành doanh nghiệp',
      'Thiết kế sơ đồ tổ chức bộ máy CSKH quy mô lớn (>100-150 nhân sự)'
    ],
    application: 'Định hình tầm nhìn chiến lược phòng CSKH, dẫn dắt quá trình tái cấu trúc tổ chức và xây dựng đội ngũ lãnh đạo kế thừa.',
    result: 'Chứng nhận hoàn thành chương trình Quản lý cấp cao Dale Carnegie & VED',
    accentColor: '#8B5CF6',
  },
  {
    id: 6,
    title: 'Quản Lý Cấp Trung',
    year: '2014',
    code: 'DC-VED-14',
    category: 'management',
    issuer: 'Dale Carnegie & VED',
    desc: 'Khóa đào tạo kỹ năng quản lý thực chiến và điều hành đội ngũ phòng ban hiệu quả.',
    skills: ['Middle Management', 'Team Leading', 'KPIs', 'Delegation'],
    image: 'https://lh3.googleusercontent.com/d/12zw9joYktTse1gx_IHtZMsVzYAGXDAxu',
    courseImg: 'https://lh3.googleusercontent.com/d/1-58rxKVaNpiIibAZR3C3tMdbWAfzzXO7',
    certImg: 'https://lh3.googleusercontent.com/d/1HdqsMYNlTVrCufATtCqnVKLBvwlc6I1P',
    type: 'Đào tạo bên ngoài',
    orientation: 'Đào tạo kỹ năng quản lý thực chiến và điều hành đội ngũ phòng ban hiệu quả.',
    focus: 'Khóa đào tạo kỹ năng quản lý thực chiến và điều hành đội ngũ phòng ban hiệu quả.',
    modules: [
      'Kỹ năng quản trị nhân sự',
      'Giao việc và ủy quyền',
      'Giám sát hiệu suất',
      'Huấn luyện đội ngũ và hợp tác liên phòng ban',
      'Xây dựng ma trận ủy quyền và quy trình giám sát KPI ca kíp'
    ],
    application: 'Thực thi điều hành phòng ban CSKH hàng ngày, phân công công việc hiệu quả và phát triển đội ngũ trưởng nhóm/giám sát.',
    result: 'Chứng nhận hoàn thành chương trình Quản lý cấp trung Dale Carnegie & VED',
    accentColor: '#06B6D4',
  },
  {
    id: 7,
    title: 'Kỹ Năng Đào Tạo',
    year: '2013',
    code: 'VW-TRAIN-13',
    category: 'skills',
    issuer: 'VietnamWorks',
    desc: 'Phương pháp sư phạm doanh nghiệp, thiết kế bài giảng và nghệ thuật làm chủ sân khấu truyền cảm hứng.',
    skills: ['Train the Trainer', 'Sư phạm', 'Giảng dạy nội bộ', 'Onboarding'],
    image: 'https://lh3.googleusercontent.com/d/1y71nbmxwE-Sp_eNnvf3YyoCsUUrWwDQb',
    courseImg: 'https://lh3.googleusercontent.com/d/1TzP7fzl1HOBGefFOVtyXMFJSg59lkcEe',
    certImg: 'https://lh3.googleusercontent.com/d/1DXWjMttGGcanShm_N4eyarWzWuo1qkeI',
    type: 'Đào tạo bên ngoài',
    orientation: 'Phương pháp sư phạm doanh nghiệp, thiết kế bài giảng và nghệ thuật làm chủ sân khấu truyền cảm hứng.',
    focus: 'Khóa học phương pháp sư phạm doanh nghiệp, thiết kế bài giảng và nghệ thuật làm chủ sân khấu truyền cảm hứng.',
    modules: [
      'Xây dựng giáo trình đào tạo nội bộ',
      'Phương pháp truyền đạt sư phạm & Kỹ năng đứng lớp',
      'Nghệ thuật thuyết trình trước đám đông',
      'Xây dựng bộ giáo trình Onboarding và tài liệu đào tạo nghiệp vụ CSKH nội bộ'
    ],
    application: 'Thành lập và vận hành các trung tâm đào tạo CS Academy nội bộ, rút ngắn thời gian Onboarding và đảm bảo chất lượng dịch vụ đồng nhất.',
    result: 'Chứng nhận hoàn thành khóa Kỹ năng Đào tạo do VietnamWorks cấp',
    accentColor: '#EC4899',
  },
  {
    id: 8,
    title: 'Kỹ Năng Thuyết Trình',
    year: '2013',
    code: 'VW-PRES-13',
    category: 'skills',
    issuer: 'VietnamWorks',
    desc: 'Phương pháp xây dựng bài thuyết trình chuyên nghiệp, truyền đạt ý tưởng mạch lạc và thuyết phục hội đồng/C-Level.',
    skills: ['Presentation', 'Public Speaking', 'C-Level Pitching', 'Storytelling'],
    image: 'https://lh3.googleusercontent.com/d/1iBwxHGSei5P8O9jUkY71oCEzLofJv4Kb',
    courseImg: 'https://lh3.googleusercontent.com/d/1aGJZfedbXSST3_5byRLYXpngzNe043JU',
    certImg: 'https://lh3.googleusercontent.com/d/1C6yDlcQ7i5DOt1N7Hmhia6bj5xzoWrjI',
    type: 'Đào tạo bên ngoài',
    orientation: 'Phương pháp xây dựng bài thuyết trình chuyên nghiệp, truyền đạt ý tưởng mạch lạc và thuyết phục hội đồng/C-Level.',
    focus: 'Phương pháp xây dựng bài thuyết trình chuyên nghiệp, truyền đạt ý tưởng mạch lạc và thuyết phục hội đồng/C-Level.',
    modules: [
      'Cấu trúc bài thuyết trình kinh doanh',
      'Kỹ thuật diễn đạt và ngôn ngữ cơ thể',
      'Nghệ thuật làm chủ sân khấu và tương tác khán giả',
      'Xây dựng và trình bày các đề án chiến lược CX, báo cáo ngân sách trước C-Level'
    ],
    application: 'Truyền cảm hứng cho đội ngũ nhân sự quy mô lớn, bảo vệ đề án chiến lược trước Ban Giám đốc và đại diện doanh nghiệp chia sẻ tại các sự kiện.',
    result: 'Chứng nhận hoàn thành khóa Kỹ năng Thuyết trình do VietnamWorks cấp',
    accentColor: '#6366F1',
  },
  {
    id: 9,
    title: 'Kỹ Năng Phỏng Vấn',
    year: '2013',
    code: 'VW-INTV-13',
    category: 'skills',
    issuer: 'VietnamWorks',
    desc: 'Chương trình đào tạo kỹ thuật phỏng vấn hành vi và đánh giá tiềm năng nhân sự chuyên nghiệp.',
    skills: ['BEI Interview', 'STAR Method', 'Evaluation', 'Recruitment'],
    image: 'https://lh3.googleusercontent.com/d/1r_6zEKN6G0lnG6AwVvOd2m0RwTf30XOO',
    courseImg: 'https://lh3.googleusercontent.com/d/1eyEqrFhkyw4Dj_lAAvQgy7ow1be47NG1',
    certImg: 'https://lh3.googleusercontent.com/d/1YGEDpOrZHewmDVPXvSoKznMhAJbQo2PU',
    type: 'Đào tạo bên ngoài',
    orientation: 'Kỹ thuật phỏng vấn và đánh giá tiềm năng nhân sự chuyên nghiệp.',
    focus: 'Chương trình đào tạo kỹ thuật phỏng vấn và đánh giá tiềm năng nhân sự chuyên nghiệp.',
    modules: [
      'Kỹ thuật phỏng vấn hành vi (BEI)',
      'Đánh giá ứng viên theo khung ASK',
      'Xây dựng bộ câu hỏi phỏng vấn hành vi STAR/BEI cho các cấp bậc CSKH',
      'Trực tiếp phỏng vấn tuyển dụng hàng trăm vị trí từ chuyên viên đến quản lý cấp trung'
    ],
    application: 'Xây dựng đội ngũ CSKH chất lượng cao, chọn lọc ứng viên có tư duy dịch vụ thấu cảm chuẩn xác và giảm tỷ lệ thất thoát nhân sự sau thử việc.',
    result: 'Chứng nhận hoàn thành khóa Kỹ năng Phỏng vấn do VietnamWorks cấp',
    accentColor: '#14B8A6',
  },
  {
    id: 10,
    title: 'Kỹ Năng Tuyển Dụng',
    year: '2013',
    code: 'VW-RECR-13',
    category: 'skills',
    issuer: 'VietnamWorks',
    desc: 'Chương trình đào tạo chiến lược tuyển dụng và xây dựng thương hiệu tuyển dụng chuyên nghiệp.',
    skills: ['Talent Acquisition', 'Sourcing', 'Cost-per-Hire', 'Employer Branding'],
    image: 'https://lh3.googleusercontent.com/d/180WJFqcuq5Qk19XqbzEnIfa-pfBL6M5r',
    courseImg: 'https://lh3.googleusercontent.com/d/1eyEqrFhkyw4Dj_lAAvQgy7ow1be47NG1',
    certImg: 'https://lh3.googleusercontent.com/d/1mmzjhzSEnX5BBdkM6w59-71QvwOnH_XI',
    type: 'Đào tạo bên ngoài',
    orientation: 'Chiến lược tuyển dụng và xây dựng thương hiệu tuyển dụng chuyên nghiệp.',
    focus: 'Chương trình đào tạo chiến lược tuyển dụng và xây dựng thương hiệu tuyển dụng chuyên nghiệp.',
    modules: [
      'Xây dựng tiêu chí tuyển dụng & Quy trình thu hút nhân tài',
      'Tối ưu hóa chi phí tuyển dụng (Cost-per-Hire)',
      'Lập chiến dịch tuyển dụng quy mô lớn cho các dự án khởi tạo (Shopee, AirPay, Contact Center)',
      'Chuẩn hóa mô tả công việc (JD) và tiêu chuẩn đầu vào cho từng vị trí CSKH'
    ],
    application: 'Chủ động hoạch định nhân sự ca kíp, mở rộng bộ máy CSKH nhanh chóng đáp ứng các giai đoạn tăng trưởng nóng của doanh nghiệp.',
    result: 'Chứng nhận hoàn thành khóa Kỹ năng Tuyển dụng do VietnamWorks cấp',
    accentColor: '#84CC16',
  },
  {
    id: 11,
    title: 'Cử Nhân CNTT',
    year: '2007',
    code: 'STU-IT-07',
    category: 'degree',
    issuer: 'Trường ĐH Công nghệ Sài Gòn (STU)',
    desc: 'Chương trình đào tạo đại học chính quy về khoa học máy tính, kỹ thuật phần mềm và hệ thống thông tin.',
    skills: ['Software Engineering', 'Database', 'Networks', 'IT Architecture'],
    image: 'https://lh3.googleusercontent.com/d/1XzUpOgdR62UyIHBDjvp5YrsLMqSSTkhV',
    courseImg: 'https://lh3.googleusercontent.com/d/11-4-JT4ZQIR206CMRRhfioTBeQrFK1rl',
    certImg: 'https://i.ibb.co/tpNF0Bqw/C-nh-n-CNTT.png',
    type: 'Đào tạo chính quy',
    orientation: 'Khoa học máy tính, kỹ thuật phần mềm và hệ thống thông tin',
    focus: 'Chương trình đào tạo đại học chính quy về khoa học máy tính, kỹ thuật phần mềm và hệ thống thông tin',
    modules: [
      'Lập trình máy tính & Cơ sở dữ liệu',
      'Mạng máy tính và viễn thông',
      'An toàn thông tin & Phân tích thiết kế hệ thống phần mềm',
      'Phân tích và thiết kế kiến trúc hệ thống phần mềm quản lý dữ liệu'
    ],
    application: 'Tạo lợi thế giao thoa khác biệt giữa IT và CX, trực tiếp làm việc với bộ phận Kỹ thuật/Sản phẩm để kiến trúc hệ thống CRM, AI Bot và chuyển đổi số vận hành.',
    result: 'Bằng Cử nhân CNTT chính quy do Trường ĐH Công nghệ Sài Gòn (STU) cấp',
    accentColor: '#3B82F6',
  },
  {
    id: 12,
    title: 'Nghiệp Vụ Tổng Đài',
    year: '2007',
    code: 'MOBIFONE-07',
    category: 'skills',
    issuer: 'MobiFone',
    desc: 'Chương trình đào tạo chuẩn hóa nghiệp vụ vận hành Contact Center và chăm sóc khách hàng viễn thông.',
    skills: ['Call Center', 'VoIP', 'Empathy', 'Complaint Handling'],
    image: 'https://lh3.googleusercontent.com/d/1kZI5SLvvotudF4CgmsJyX-fPTwdDF3Bc',
    courseImg: 'https://lh3.googleusercontent.com/d/19ySA3qb3nrjzqFsvusxHi4nPLoFhd6CG',
    certImg: 'https://lh3.googleusercontent.com/d/18mFBwlcaxq1qBvkbVVF2WJlcrdCyV5g5',
    type: 'Đào tạo nội bộ',
    orientation: 'Chuẩn hóa nghiệp vụ vận hành Contact Center và chăm sóc khách hàng viễn thông',
    focus: 'Chương trình đào tạo chuẩn hóa nghiệp vụ vận hành Contact Center và chăm sóc khách hàng viễn thông',
    modules: [
      'Nghiệp vụ tổng đài viễn thông & Quy trình tiếp nhận & xử lý yêu cầu',
      'Kỹ năng lắng nghe thấu cảm & Giải quyết tình huống khó',
      'Xử lý thực chiến hàng chục nghìn cuộc gọi tư vấn cước và giải quyết khiếu nại MobiFone'
    ],
    application: 'Thấu hiểu tường tận công việc thực địa của tư vấn viên tuyến đầu, từ đó xây dựng kịch bản SOP sát thực tế và đồng cảm sâu sắc với đội ngũ.',
    result: 'Chứng nhận Tổng đài viên xuất sắc do MobiFone cấp',
    accentColor: '#0EA5E9',
  },
  {
    id: 13,
    title: 'Quản Trị Mạng CCNA',
    year: '2006',
    code: 'CCNA-06',
    category: 'tech',
    issuer: 'Trường Nghề Nhất Nghệ',
    desc: 'Chương trình đào tạo quản trị hạ tầng mạng Cisco tiêu chuẩn quốc tế.',
    skills: ['Cisco CCNA', 'Routing', 'Switching', 'VoIP Infrastructure'],
    image: 'https://lh3.googleusercontent.com/d/16nznDnT7x4W3fdjuJiIENKtkfhQVSIKr',
    courseImg: 'https://lh3.googleusercontent.com/d/1ATXsweNOTQTACp9ToytxV_aohnVPpHAK',
    certImg: 'https://lh3.googleusercontent.com/d/1KvmNdpodr-j4wieW29VHKgXupmZbuPGD',
    type: 'Đào tạo học nghề',
    orientation: 'Quản trị hạ tầng mạng Cisco tiêu chuẩn quốc tế',
    focus: 'Chương trình đào tạo quản trị hạ tầng mạng Cisco tiêu chuẩn quốc tế',
    modules: [
      'Thiết kế mạng & Kỹ thuật Routing và Switching',
      'Mô hình TCP/IP & Cấu hình VLAN',
      'Thiết kế và cấu hình sơ đồ hạ tầng mạng cho Contact Center',
      'Cấu hình thiết bị định tuyến Router/Switch Cisco đảm bảo kết nối thoại thông suốt'
    ],
    application: 'Làm chủ hạ tầng viễn thông VoIP/Telephony cho Call Center, giám sát độ ổn định mạng và tối ưu băng thông kết nối đa kênh.',
    result: 'Chứng chỉ CCNA do Trường Nghề Nhất Nghệ cấp',
    accentColor: '#6366F1',
  },
  {
    id: 14,
    title: 'Quản Trị Máy Chủ MCSA',
    year: '2005',
    code: 'MCSA-05',
    category: 'tech',
    issuer: 'Trường Nghề Nhất Nghệ',
    desc: 'Khóa đào tạo chuyên sâu về quản trị hạ tầng hệ thống máy chủ doanh nghiệp Microsoft Windows Server.',
    skills: ['MCSA', 'Windows Server', 'Active Directory', 'System Admin'],
    image: 'https://lh3.googleusercontent.com/d/1rGdH6SH173jDC57cDOzc3AiLg5TGAX2S',
    courseImg: 'https://lh3.googleusercontent.com/d/1wFYyXG7ZabnmUsMcDNKItYDcldjw_nNP',
    certImg: 'https://lh3.googleusercontent.com/d/1zK_n0ZUo8_Ka07uPQvHMR_dwgZ6kJgTi',
    type: 'Đào tạo học nghề',
    orientation: 'Quản trị hạ tầng hệ thống máy chủ doanh nghiệp Microsoft Windows Server',
    focus: 'Khóa đào tạo chuyên sâu về quản trị hạ tầng hệ thống máy chủ doanh nghiệp Microsoft Windows Server',
    modules: [
      'Quản trị Windows Server & Cấu hình Active Directory',
      'Dịch vụ DNS, DHCP & Phân quyền bảo mật',
      'Triển khai và quản trị hệ thống máy chủ Windows Server cho phòng ban'
    ],
    application: 'Quản trị tài khoản, phân quyền bảo mật dữ liệu khách hàng và hỗ trợ hạ tầng máy chủ cho các phần mềm nghiệp vụ CSKH.',
    result: 'Chứng chỉ MCSA do Trường Nghề Nhất Nghệ cấp',
    accentColor: '#10B981',
  },
];

export const EDUCATION_COURSES = EDUCATION_LIST;
