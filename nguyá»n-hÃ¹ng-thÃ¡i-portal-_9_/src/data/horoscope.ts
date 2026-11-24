export interface ZodiacSignInfo {
  key: string;
  name: string;
  icon: string;
  type: string;
  tone: 'positive' | 'neutral' | 'caution';
  role: string;
  detail: string;
  strength: string;
  caution: string;
  advice: string;
}

export interface CanChiResult {
  can: string;
  chi: string;
  canChi: string;
  element: string;
  elementRelation: string;
  sign: ZodiacSignInfo;
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    key: 'rat',
    name: 'Tý',
    icon: '🐭',
    type: 'Đồng Chi · Cùng chí hướng',
    tone: 'neutral',
    role: 'Phản biện & Tối ưu giải pháp',
    detail: 'Cùng địa chi Tý mang lại tần số suy nghĩ và tốc độ nắm bắt vấn đề tương đồng. Thấu hiểu ý tưởng của nhau nhanh chóng, không mất nhiều thời gian giải thích.',
    strength: 'Đồng điệu trong phân tích chi tiết, nhạy bén với cơ hội mới và hướng tới hiệu quả cao.',
    caution: 'Dễ trùng góc nhìn hoặc cùng rơi vào trạng thái quá thận trọng khi rủi ro phát sinh.',
    advice: 'Cần phân định ranh giới quyết định minh bạch (Owner rõ ràng); khuyến khích góc nhìn trái chiều để tránh điểm mù chung.',
  },
  {
    key: 'ox',
    name: 'Sửu',
    icon: '🐂',
    type: 'Lục Hợp · Trụ cột vận hành',
    tone: 'positive',
    role: 'Đối tác chiến lược - Thực thi',
    detail: 'Thuộc quan hệ Lục Hợp (Tý - Sửu nhị hợp). Sự điềm đạm, kiên định và tỉ mỉ của Sửu là bệ đỡ hoàn hảo cho khả năng kiến tạo hệ thống và tư duy chiến lược của Giáp Tý.',
    strength: 'Giáp Tý định hướng và thiết kế mô hình; Sửu đảm bảo tuân thủ, bám sát deadline và giữ vững vận hành.',
    caution: 'Sửu ưa chuộng quy trình ổn định nên có thể cần thời gian thích nghi khi Giáp Tý muốn đột phá công nghệ nhanh.',
    advice: 'Phân vai rõ ràng: một bên mở đường đổi mới, một bên giữ nhịp và bảo vệ chất lượng chuẩn mực.',
  },
  {
    key: 'tiger',
    name: 'Dần',
    icon: '🐅',
    type: 'Bình Hòa · Tiên phong bứt phá',
    tone: 'neutral',
    role: 'Mở rộng thị trường & Đột phá',
    detail: 'Quan hệ bình hòa, không xung đột. Năng lượng tiên phong, quyết đoán và xông xáo của Dần có thể kích hoạt mạnh mẽ các ý tưởng mang tính chiến lược của Giáp Tý.',
    strength: 'Kết hợp tốt giữa năng lực phân tích hệ thống (Tý) và tốc độ chiếm lĩnh mục tiêu mới (Dần).',
    caution: 'Dần thường thích quyền tự chủ cao và nhịp độ nhanh, dễ nóng vội trước sự kiểm soát chặt chẽ của Tý.',
    advice: 'Trao quyền theo mục tiêu cam kết (Outcome-based), đồng thuận trước về các chỉ số KPI/SLA cốt lõi.',
  },
  {
    key: 'rabbit',
    name: 'Mão',
    icon: '🐈',
    type: 'Tương Hình · Cần minh bạch quy trình',
    tone: 'caution',
    role: 'Phát triển dịch vụ & Chăm sóc',
    detail: 'Quan niệm xưa xếp Tý - Mão vào thế tương hình vô lễ. Trong công việc, đây là lời nhắc nhở về phong cách giao tiếp và cách ứng xử khéo léo khi có sự khác biệt về quan điểm.',
    strength: 'Mão mềm mỏng, tinh tế, giỏi xử lý giao tiếp khách hàng và chăm sóc đội ngũ tuyến đầu.',
    caution: 'Mão nhạy cảm với cách phản hồi trực diện, trong khi Giáp Tý thường thẳng thắn và đề cao tính kỷ luật.',
    advice: 'Giao tiếp rõ ràng bằng văn bản, thống nhất quy chuẩn làm việc từ đầu; phản hồi dựa trên số liệu khách quan thay vì cảm tính.',
  },
  {
    key: 'dragon',
    name: 'Thìn',
    icon: '🐉',
    type: 'Tam Hợp · Kiến tạo tầm nhìn',
    tone: 'positive',
    role: 'Mở rộng quy mô & Dẫn dắt',
    detail: 'Nằm trong bộ Tam Hợp (Thân - Tý - Thìn). Thìn mang tầm vóc lớn, khả năng truyền cảm hứng và dẫn dắt tập thể, hòa hợp tự nhiên với năng lực tư duy kiến trúc hệ thống của Giáp Tý.',
    strength: 'Tạo thành liên minh vững chắc: Thìn định hướng thị trường và tạo động lực, Tý thiết lập bộ máy quy trình và công nghệ vận hành chuẩn xác.',
    caution: 'Cần một người đóng vai trò quản lý chi tiết nguồn lực tài chính để tránh mở rộng quá đà.',
    advice: 'Cùng xây dựng Roadmap chiến lược dài hạn, tổ chức review định kỳ để kiểm soát ngân sách và tiến độ.',
  },
  {
    key: 'snake',
    name: 'Tỵ',
    icon: '🐍',
    type: 'Bình Hòa · Linh hoạt sắc bén',
    tone: 'neutral',
    role: 'Đàm phán & Quản trị rủi ro',
    detail: 'Quan hệ bình hòa. Tỵ mang sự sâu sắc, tính toán cẩn trọng và khéo léo trong quan hệ đối ngoại, rất tương hợp với tính điềm tĩnh của Giáp Tý.',
    strength: 'Phối hợp hiệu quả trong xử lý khủng hoảng truyền thông, đàm phán hợp đồng lớn và tối ưu chi phí.',
    caution: 'Cả hai bên đều có xu hướng quan sát kỹ và ít bộc lộ suy nghĩ ban đầu, có thể làm chậm nhịp phối hợp thời gian đầu.',
    advice: 'Tạo cơ chế chia sẻ thông tin hai chiều thường xuyên; thiết lập các điểm chạm ngắn gọn hàng tuần.',
  },
  {
    key: 'horse',
    name: 'Ngọ',
    icon: '🐎',
    type: 'Tương Xung · Bổ khuyết tương phản',
    tone: 'caution',
    role: 'Tốc độ & Thực chiến',
    detail: 'Tý - Ngọ là cặp chính xung theo Can Chi (Thủy khắc Hỏa, Tĩnh đối Động). Tuy nhiên trong kinh doanh hiện đại, đây là cặp bổ trợ ngược cực kỳ mạnh mẽ nếu biết cách điều hòa.',
    strength: 'Ngọ năng động, quyết liệt và hành động nhanh; Tý điềm tĩnh, suy xét sâu và quản trị rủi ro.',
    caution: 'Khác biệt lớn về nhịp độ: Ngọ muốn làm ngay, Tý muốn chuẩn bị quy trình hoàn chỉnh.',
    advice: 'Dùng dữ liệu và báo cáo tiến độ trung lập làm trọng tài; phân tách rõ mảng thực chiến bám thị trường (Ngọ) và mảng hậu phương điều phối (Tý).',
  },
  {
    key: 'goat',
    name: 'Mùi',
    icon: '🐐',
    type: 'Tương Hại · Cần rõ ràng trách nhiệm',
    tone: 'caution',
    role: 'Trải nghiệm khách hàng & Thiết kế',
    detail: 'Cặp Tý - Mùi tương hại trong dân gian thực chất là cảnh báo về sự thiếu nhất quán trong mong đợi. Khi làm việc chung, cần minh bạch hóa mọi điều khoản hợp tác.',
    strength: 'Mùi chu đáo, thấu cảm và có gu thẩm mỹ cao, phù hợp với các sáng kiến tối ưu trải nghiệm (CX).',
    caution: 'Mùi dễ ngần ngại nêu thẳng vấn đề khó, trong khi Tý cần sự rõ ràng để tối ưu hệ thống.',
    advice: 'Xây dựng môi trường tâm lý an toàn để Mùi thoải mái chia sẻ khó khăn; ghi nhận cam kết bằng biên bản và task management rõ ràng.',
  },
  {
    key: 'monkey',
    name: 'Thân',
    icon: '🐒',
    type: 'Tam Hợp · Đổi mới & Trí tuệ',
    tone: 'positive',
    role: 'Công nghệ & Giải pháp thông minh',
    detail: 'Thuộc bộ Tam Hợp (Thân - Tý - Thìn). Thân nổi bật với sự thông minh, tháo vát và thích ứng cực nhanh với công nghệ mới, là cộng sự đắc lực trong chuyển đổi số của Giáp Tý.',
    strength: 'Sự sáng tạo linh hoạt của Thân kết hợp với tư duy bài bản của Tý giúp biến ý tưởng công nghệ (CRM, AI) thành hệ thống vận hành thực tế.',
    caution: 'Thân thích sự mới mẻ nên đôi khi giảm hứng thú với các công việc duy trì sự ổn định lặp đi lặp lại.',
    advice: 'Giao cho Thân phụ trách các dự án đổi mới, cải tiến mô hình; Tý hỗ trợ chuẩn hóa quy trình chuyển giao.',
  },
  {
    key: 'rooster',
    name: 'Dậu',
    icon: '🐓',
    type: 'Tương Phá · Kỷ luật & Tiêu chuẩn',
    tone: 'caution',
    role: 'Kiểm soát chất lượng (QA/QC)',
    detail: 'Quan hệ Tý - Dậu trong dân gian gọi là tương phá. Cả hai đều rất kỹ tính và cầu toàn về mặt kết quả, do đó dễ có tranh luận về phương pháp tiếp cận.',
    strength: 'Cùng coi trọng tiêu chuẩn cao, không chấp nhận sự cẩu thả, tạo ra sản phẩm dịch vụ chất lượng vượt trội.',
    caution: 'Dễ sa vào tranh cãi ai đúng ai sai về chi tiết nhỏ nếu thiếu người chốt quyền tối cao.',
    advice: 'Thống nhất tiêu chí nghiệm thu (Acceptance Criteria) định lượng cụ thể trước khi bắt đầu dự án.',
  },
  {
    key: 'dog',
    name: 'Tuất',
    icon: '🐕',
    type: 'Bình Hòa · Trung thành & Trách nhiệm',
    tone: 'neutral',
    role: 'Bảo mật & Giám sát tuân thủ',
    detail: 'Quan hệ bình hòa, vững chắc. Tuất mang tinh thần trung thực, trách nhiệm và bảo vệ tổ chức tuyệt đối, tạo nên môi trường làm việc đáng tin cậy cho Giáp Tý.',
    strength: 'Tuất giữ vững hậu phương, đảm bảo tính liên tục của hệ thống và tuân thủ các quy tắc bảo mật.',
    caution: 'Tuất có tính phòng vệ cao, đôi khi do dự trước những thay đổi mang tính đột phá toàn diện.',
    advice: 'Cung cấp đầy đủ cơ sở lý luận và đánh giá rủi ro rõ ràng trước khi triển khai các cải tiến lớn.',
  },
  {
    key: 'pig',
    name: 'Hợi',
    icon: '🐖',
    type: 'Bình Hòa · Hài hòa & Kết nối',
    tone: 'neutral',
    role: 'Văn hóa doanh nghiệp & Hậu cần',
    detail: 'Quan hệ bình hòa (cùng hành Thủy). Hợi mang đến không khí hòa nhã, bao dung và khéo léo xoa dịu những căng thẳng trong đội ngũ.',
    strength: 'Hỗ trợ Giáp Tý xây dựng tinh thần đồng đội bền vững, giảm thiểu áp lực vận hành và giữ chân nhân tài.',
    caution: 'Hợi dễ thỏa hiệp và ngại xung đột, cần sự thúc đẩy từ tính kỷ luật của Giáp Tý.',
    advice: 'Phân công Hợi các mảng việc kết nối nhân sự, hỗ trợ hậu cần và duy trì gắn kết văn hóa nhóm.',
  },
];

export const ZODIAC_BY_KEY: Record<string, ZodiacSignInfo> = Object.fromEntries(
  ZODIAC_SIGNS.map((s) => [s.key, s])
);

export const ZODIAC_ORDER = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
];

export const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export function getCanChiInfo(year: number): CanChiResult {
  const canIndex = ((year - 4) % 10 + 10) % 10;
  const chiIndex = ((year - 4) % 12 + 12) % 12;
  const can = CAN_NAMES[canIndex];
  const chi = CHI_NAMES[chiIndex];
  const signKey = ZODIAC_ORDER[chiIndex];

  const canVal = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5][canIndex];
  const chiVal = [0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2][chiIndex];
  let sum = canVal + chiVal;
  if (sum > 5) sum -= 5;
  const elements: Record<number, string> = { 1: 'Kim', 2: 'Thủy', 3: 'Hỏa', 4: 'Thổ', 5: 'Mộc' };
  const element = elements[sum] || 'Kim';

  let elementRelation = 'Bình hòa';
  if (element === 'Thổ') elementRelation = 'Thổ sinh Kim (Được tương trợ, bồi đắp)';
  else if (element === 'Kim') elementRelation = 'Đồng hành Kim (Cộng hưởng, cùng tần số)';
  else if (element === 'Thủy') elementRelation = 'Kim sinh Thủy (Chủ động hỗ trợ, trao quyền)';
  else if (element === 'Hỏa') elementRelation = 'Hỏa khắc Kim (Cần dung hòa, tránh va chạm)';
  else if (element === 'Mộc') elementRelation = 'Kim khắc Mộc (Cần điều phối khéo, tránh áp đặt)';

  return {
    can,
    chi,
    canChi: `${can} ${chi}`,
    element,
    elementRelation,
    sign: ZODIAC_BY_KEY[signKey] || ZODIAC_SIGNS[0],
  };
}

export function getSignFromYear(year: number): ZodiacSignInfo {
  const index = ((year - 4) % 12 + 12) % 12;
  return ZODIAC_BY_KEY[ZODIAC_ORDER[index]] || ZODIAC_SIGNS[0];
}

export const QUICK_YEARS = [1992, 1988, 1985, 1990, 1989, 1995];

// Slide 1 Data
export const SLIDE_1_IDENTITY = {
  name: 'Nguyễn Hùng Thái',
  title: 'Customer Experience & Operations Director',
  initials: 'HT',
  badge: 'GIÁP TÝ 1984',
  profileItems: [
    { label: 'Năm sinh', value: 'Giáp Tý · 1984' },
    { label: 'Bản mệnh', value: 'Hải Trung Kim' },
    { label: 'Cung mệnh', value: 'Đoài (Tây Tứ Mệnh)' },
    { label: 'Giờ sinh', value: 'Quý Dậu · 17–19h' },
  ],
  stats: [
    { value: '22+', label: 'Năm kinh nghiệm' },
    { value: '5', label: 'Trụ cột vận hành' },
    { value: '6', label: 'Nguyên tắc hành động' },
  ],
  traits: [
    {
      id: 'depth',
      tag: 'CHIỀU SÂU',
      title: 'Hiểu bản chất',
      desc: 'Đào sâu phân tích nguyên nhân gốc rễ (Root Cause) trước khi đưa ra quyết định.',
      icon: 'search',
      tone: 'tone-yellow',
      iconColor: '#b28b05',
      tagColor: '#8f6d00',
    },
    {
      id: 'tenacity',
      tag: 'KIÊN ĐỊNH',
      title: 'Theo đuổi dài hạn',
      desc: 'Giữ vững định hướng chiến lược và chất lượng thực thi nhất quán trước mọi biến động.',
      icon: 'anchor',
      tone: 'tone-pink',
      iconColor: '#dc3e97',
      tagColor: '#dc3e97',
    },
    {
      id: 'prestige',
      tag: 'UY TÍN',
      title: 'Giá trị nội tại',
      desc: 'Coi trọng năng lực chuyên môn, cam kết trung thực và hiệu quả thực tiễn hơn hình thức.',
      icon: 'gem',
      tone: 'tone-mint',
      iconColor: '#1d997d',
      tagColor: '#1d997d',
    },
  ],
  philosophy: {
    sectionLabel: 'Hải Trung Kim · Vàng trong biển',
    quote: '“Thấu hiểu con người, làm chủ hệ thống, dẫn dắt bằng trí tuệ và xây dựng giá trị bằng sự tận tâm.”',
    desc: 'Giá trị tích lũy qua thời gian; bản lĩnh thể hiện qua cách giữ vững nguyên tắc và tạo ra kết quả thực chất.',
    commitmentLabel: 'Cam kết định vị',
    commitmentDesc: 'Chuẩn hóa quy trình vận hành · Nâng tầm trải nghiệm khách hàng · Tối ưu hiệu quả chi phí qua CRM & AI.',
    pills: [
      { label: 'Tư duy hệ thống', icon: 'layers' },
      { label: 'Chính trực', icon: 'shield-check' },
    ],
  },
};

// Slide 2 Data: 5 Pillars & Luc Cung
export const SLIDE_2_PILLARS = [
  {
    id: 'kim',
    symbol: '金',
    palaceTag: 'Cung Quan lộc',
    title: 'KIM · Quy trình & Chuẩn hóa',
    desc: 'Thiết lập khung chuẩn mực vận hành, đảm bảo kỷ luật và kiểm soát chất lượng bằng dữ liệu.',
    focusLabel: 'Trọng tâm quản trị:',
    focusText: 'SOP, KPI, SLA, Quality Assurance & Tuân thủ',
    styleTag: 'Phong cách: Kỷ luật & Chính trực',
    tone: 'tone-blue',
    symbolColor: '#1283e0',
    tagColor: '#1283e0',
    barColor: '#1283e0',
    icon: 'settings',
  },
  {
    id: 'thuy',
    symbol: '水',
    palaceTag: 'Cung Thiên di',
    title: 'THỦY · Công nghệ & Tự động',
    desc: 'Tận dụng CRM, AI và Omnichannel để tối ưu hóa quy trình, loại bỏ điểm nghẽn và nâng cao năng suất.',
    focusLabel: 'Trọng tâm quản trị:',
    focusText: 'CRM, AI Gen, Omnichannel, Data Analytics',
    styleTag: 'Phong cách: Nhạy bén số & Tinh gọn',
    tone: 'tone-mint',
    symbolColor: '#269e83',
    tagColor: '#1f9e80',
    barColor: '#35c4a7',
    icon: 'droplet',
  },
  {
    id: 'moc',
    symbol: '木',
    palaceTag: 'Cung Nô bộc',
    title: 'MỘC · Con người & Phát triển',
    desc: 'Lãnh đạo bằng sự thấu cảm, huấn luyện đội ngũ kế thừa và xây dựng văn hóa gắn kết bền chặt.',
    focusLabel: 'Trọng tâm quản trị:',
    focusText: 'Training, Coaching 1-on-1, Talent Succession',
    styleTag: 'Phong cách: Thấu cảm & Phát triển',
    tone: 'tone-yellow',
    symbolColor: '#9e8705',
    tagColor: '#8f6d00',
    barColor: '#ffc917',
    icon: 'sprout',
  },
  {
    id: 'hoa',
    symbol: '火',
    palaceTag: 'Cung Mệnh',
    title: 'HỎA · Trải nghiệm khách hàng',
    desc: 'Lấy khách hàng làm trọng tâm, phản hồi nhanh chóng và chuyển hóa khiếu nại thành cơ hội gắn kết.',
    focusLabel: 'Trọng tâm quản trị:',
    focusText: 'CSAT, NPS, FCR, Customer Journey Mapping',
    styleTag: 'Phong cách: Quyết đoán & Tận tâm',
    tone: 'tone-pink',
    symbolColor: '#dc3e97',
    tagColor: '#dc3e97',
    barColor: '#eb4472',
    icon: 'flame',
  },
  {
    id: 'tho',
    symbol: '土',
    palaceTag: 'Tài bạch · Phúc đức',
    title: 'THỔ · Tài chính & Nền tảng',
    desc: 'Tối ưu chi phí phục vụ (Cost-to-Serve), quản trị rủi ro và giữ vững tính liên tục của hệ thống.',
    focusLabel: 'Trọng tâm quản trị:',
    focusText: 'Cost-to-Serve, BCP, Security & Risk Management',
    styleTag: 'Phong cách: Điềm tĩnh & Bền vững',
    tone: 'tone-orange',
    symbolColor: '#db671a',
    tagColor: '#db671a',
    barColor: '#f2722b',
    icon: 'landmark',
  },
];

// Slide 3 Data: 6 Action Principles & 4 Proofs
export const SLIDE_3_PRINCIPLES = [
  {
    num: '01',
    title: '01. Tư duy bằng chiến lược',
    desc: 'Nhìn vấn đề hệ thống, hoạch định mục tiêu & lộ trình dài hạn.',
    icon: 'target',
    color: '#1283e0',
  },
  {
    num: '02',
    title: '02. Dẫn dắt bằng dữ liệu',
    desc: 'Sử dụng KPI & dữ kiện thực tế để đánh giá, ra quyết định.',
    icon: 'bar-chart-3',
    color: '#a88200',
  },
  {
    num: '03',
    title: '03. Thấu cảm bằng trái tim',
    desc: 'Lắng nghe khách hàng & nhân viên bằng sự chân thành, kịp thời.',
    icon: 'heart-handshake',
    color: '#d93666',
  },
  {
    num: '04',
    title: '04. Lấy chính trực làm gốc',
    desc: 'Minh bạch báo cáo, nhất quán cam kết & chịu trách nhiệm.',
    icon: 'scale',
    color: '#6a4ff5',
  },
  {
    num: '05',
    title: '05. Lấy hành động làm đường',
    desc: 'Biến chiến lược thành kế hoạch, kiên trì cải tiến liên tục.',
    icon: 'rocket',
    color: '#db671a',
  },
  {
    num: '06',
    title: '06. Lấy kết quả làm thước đo',
    desc: 'Đo lường bằng CSAT, Cost-to-Serve, năng suất & sự trưởng thành.',
    icon: 'trophy',
    color: '#1d997d',
  },
];

export const SLIDE_3_PROOFS = [
  {
    id: 'proof-system',
    title: 'Quản trị hệ thống',
    desc: 'Chuẩn hóa toàn diện quy trình vận hành dịch vụ.',
    proofTag: 'Proof: SOP, SLA, QA scoring',
    tone: 'tone-blue',
    icon: 'settings-2',
    color: '#1283e0',
  },
  {
    id: 'proof-cx',
    title: 'Trải nghiệm CX & CSAT',
    desc: 'Nâng cao mức độ hài lòng và trung thành của khách hàng.',
    proofTag: 'Proof: CSAT > 90%, FCR, NPS',
    tone: 'tone-mint',
    icon: 'smile',
    color: '#1d997d',
  },
  {
    id: 'proof-ai',
    title: 'Chuyển đổi số & AI',
    desc: 'Tự động hóa kênh hỗ trợ, triển khai Omnichannel & CRM.',
    proofTag: 'Proof: Chatbot AI, CRM Deployment',
    tone: 'tone-purple',
    icon: 'cpu',
    color: '#6a4ff5',
  },
  {
    id: 'proof-cost',
    title: 'Tối ưu chi phí phục vụ',
    desc: 'Quản trị ngân sách, giảm Cost-to-Serve hiệu quả.',
    proofTag: 'Proof: Cost/Contact, P&L Vận hành',
    tone: 'tone-orange',
    icon: 'wallet',
    color: '#db671a',
  },
];
