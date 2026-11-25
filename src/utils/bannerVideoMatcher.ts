import {
  DRIVE_AVATARS,
  DRIVE_EXPERIENCE_BANNERS,
  DRIVE_EDUCATION_BANNERS,
  DRIVE_MEMORIES,
  DRIVE_PROJECT_BANNERS,
  DRIVE_SERVICE_IMAGES,
  DRIVE_SYSTEM_MEDIA,
} from '@/config/driveMediaLinks';

export type BannerPageKey =
  | 'home'
  | 'wallpaper'
  | 'memories'
  | 'experience'
  | 'education'
  | 'services'
  | 'skills'
  | 'systems'
  | 'interface'
  | 'contact'
  | 'horoscope'
  | 'about'
  | 'projects';

export type ServiceDomainKey = '01' | '02' | '03' | '04' | '05' | '06';

export type FolderRoleType = 'banner-video' | 'service-image' | 'dynamic';

export interface BannerPageMeta {
  key: BannerPageKey;
  tabIndex: number;
  shortLabelVi: string;
  labelVi: string;
  labelEn: string;
  expectedFilename: string;
  keywords: string[];
  posterUrl: string;
  previewTitleVi: string;
  previewTitleEn: string;
  previewSubtitleVi: string;
  previewSubtitleEn: string;
  ctaLabelVi: string;
  ctaLabelEn: string;
  accentGradient: string;
}

export interface ServiceDomainMeta {
  id: ServiceDomainKey;
  titleVi: string;
  titleEn: string;
  expectedFilename: string;
  keywords: string[];
  defaultImageUrl: string;
  accentGradient: string;
  taglineVi: string;
}

export const PRIMARY_9_BANNER_PAGE_KEYS: BannerPageKey[] = [
  'wallpaper',
  'memories',
  'experience',
  'education',
  'services',
  'systems',
  'interface',
  'contact',
  'horoscope',
];

export const BANNER_PAGES: BannerPageMeta[] = [
  {
    key: 'home',
    tabIndex: 0,
    shortLabelVi: 'Trang Chủ',
    labelVi: 'Trang Chủ (Home / Landing Page)',
    labelEn: 'Home Page Banner',
    expectedFilename: 'Trang chủ.mp4',
    keywords: ['home', 'trang-chu', 'main'],
    posterUrl: DRIVE_AVATARS.hungThai,
    previewTitleVi: 'Nguyễn Hùng Thái · Lãnh Đạo Vận Hành CX',
    previewTitleEn: 'Nguyen Hung Thai · CX Operations Leader',
    previewSubtitleVi:
      '22+ năm kinh nghiệm điều hành Contact Center, FinTech & Chuyển đổi số Trải nghiệm Khách hàng.',
    previewSubtitleEn:
      '22+ years leading Contact Centers, FinTech Operations & Customer Experience Digital Transformation.',
    ctaLabelVi: 'Khám phá Hồ sơ',
    ctaLabelEn: 'Explore Profile',
    accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    key: 'wallpaper',
    tabIndex: 14,
    shortLabelVi: 'Hình Nền',
    labelVi: 'Trang Hình Nền & Giao Diện (Wallpaper)',
    labelEn: 'Wallpaper & Ambient Page Banner',
    expectedFilename: 'Hình nền.mp4',
    keywords: ['hinh-nen', 'wallpaper', 'wallpapers'],
    posterUrl: DRIVE_AVATARS.hungThai,
    previewTitleVi: 'Hình Nền Động & Không Gian Trực Quan Sáng Tạo',
    previewTitleEn: 'Dynamic Wallpapers & Creative Visual Space',
    previewSubtitleVi:
      'Không gian trực quan khơi nguồn cảm hứng sáng tạo với thư viện hình nền video & WebGL 3D.',
    previewSubtitleEn:
      'Inspiring visual workspace powered by motion video wallpapers & interactive WebGL scenes.',
    ctaLabelVi: 'Chọn Hình Nền',
    ctaLabelEn: 'Browse Wallpapers',
    accentGradient: 'from-sky-500 via-indigo-500 to-purple-600',
  },
  {
    key: 'memories',
    tabIndex: 11,
    shortLabelVi: 'Kỷ Niệm',
    labelVi: 'Trang Kỷ Niệm / Hành Trình (Memories)',
    labelEn: 'Memories & Journey Banner',
    expectedFilename: 'Kỷ niệm.mp4',
    keywords: ['ky-niem', 'memories', 'hanh-trinh'],
    posterUrl: DRIVE_MEMORIES.momo[0],
    previewTitleVi: 'Khoảnh Khắc Kỷ Niệm & Dấu Ấn Hành Trình',
    previewTitleEn: 'Memories & Career Milestones',
    previewSubtitleVi:
      'Mỗi khoảnh khắc đồng hành cùng đội ngũ là một mảnh ghép tự hào của hành trình 22 năm.',
    previewSubtitleEn:
      'Every milestone alongside dedicated teams marks a proud chapter of a 22-year journey.',
    ctaLabelVi: 'Xem Thư Viện Kỷ Niệm',
    ctaLabelEn: 'View Memories',
    accentGradient: 'from-pink-500 via-rose-500 to-amber-500',
  },
  {
    key: 'experience',
    tabIndex: 5,
    shortLabelVi: 'Kinh Nghiệm',
    labelVi: 'Trang Kinh Nghiệm Làm Việc (Experience)',
    labelEn: 'Work Experience Banner',
    expectedFilename: 'Kinh nghiệm.mp4',
    keywords: ['kinh-nghiem', 'experience', 'work'],
    posterUrl: DRIVE_EXPERIENCE_BANNERS.momo,
    previewTitleVi: 'Kinh Nghiệm Điều Hành & Thực Chiến Đa Ngành',
    previewTitleEn: 'Executive Experience & Multi-Industry Leadership',
    previewSubtitleVi:
      'Tận tâm phụng sự, dẫn dắt bằng kết quả từ Viễn thông, Thương mại Điện tử, eSports đến FinTech.',
    previewSubtitleEn:
      'Result-driven leadership across Telecom, eCommerce, eSports, Insurance, and FinTech.',
    ctaLabelVi: 'Xem Cột Mốc Sự Nghiệp',
    ctaLabelEn: 'Explore Milestones',
    accentGradient: 'from-blue-600 via-indigo-600 to-violet-600',
  },
  {
    key: 'education',
    tabIndex: 3,
    shortLabelVi: 'Học Vấn',
    labelVi: 'Trang Học Vấn & Chứng Chỉ (Education)',
    labelEn: 'Education & Certifications Banner',
    expectedFilename: 'Học vấn.mp4',
    keywords: ['hoc-van', 'education', 'chung-chi'],
    posterUrl: DRIVE_EDUCATION_BANNERS.seniorMgmt,
    previewTitleVi: 'Học Vấn, Bằng Cấp & Chứng Chỉ Quốc Tế',
    previewTitleEn: 'Education & Professional Certifications',
    previewSubtitleVi:
      'Tri thức mở đường, tư duy định hình tương lai — Kết hợp quản trị CX, COPC, ITIL và AI.',
    previewSubtitleEn:
      'Continuous learning across CX Governance, COPC, ITIL, and AI-enabled Operations.',
    ctaLabelVi: 'Xem Chứng Chỉ',
    ctaLabelEn: 'View Credentials',
    accentGradient: 'from-emerald-500 via-teal-500 to-sky-600',
  },
  {
    key: 'services',
    tabIndex: 4,
    shortLabelVi: 'Dịch Vụ',
    labelVi: 'Trang Tổng Quan Dịch Vụ (Services Overview)',
    labelEn: 'Services Overview Banner',
    expectedFilename: 'Dịch Vụ.mp4',
    keywords: ['dich-vu', 'service', 'services', 'solution'],
    posterUrl: DRIVE_SERVICE_IMAGES.systemBuild,
    previewTitleVi: 'Hệ Sinh Thái 6 Lĩnh Vực Dịch Vụ Trọng Tâm',
    previewTitleEn: '6 Core Service Domains & CX Solutions',
    previewSubtitleVi:
      'Viễn thông di động, Thương mại điện tử, Bảo hiểm, eSports, Thanh toán điện tử & Xây dựng hệ thống.',
    previewSubtitleEn:
      'Telecom, eCommerce, Insurance, eSports, Digital Payments & Enterprise Platform Engineering.',
    ctaLabelVi: 'Khám Phá 6 Dịch Vụ',
    ctaLabelEn: 'Explore 6 Domains',
    accentGradient: 'from-teal-500 via-emerald-500 to-cyan-500',
  },
  {
    key: 'systems',
    tabIndex: 8,
    shortLabelVi: 'Hệ Thống',
    labelVi: 'Trang Hệ Thống (Systems)',
    labelEn: 'Enterprise Systems Banner',
    expectedFilename: 'Hệ thống.mp4',
    keywords: ['he-thong', 'system', 'systems', 'platform'],
    posterUrl: DRIVE_SYSTEM_MEDIA.crm.image,
    previewTitleVi: 'Kiến Trúc 12 Hệ Thống Vận Hành & Power Service',
    previewTitleEn: '12 Enterprise Operating Systems & Power Service',
    previewSubtitleVi:
      'CRM, Omnichannel Contact Center, RPA, BI Analytics & Nền tảng AI quản trị chuẩn SLA.',
    previewSubtitleEn:
      'CRM, Omnichannel Contact Center, RPA, BI Analytics & SLA-governed AI Platforms.',
    ctaLabelVi: 'Xem Sơ Đồ Hệ Thống',
    ctaLabelEn: 'Inspect Systems',
    accentGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
  },
  {
    key: 'interface',
    tabIndex: 15,
    shortLabelVi: 'Giao Diện',
    labelVi: 'Trang Giao Diện (Interface / UI-UX)',
    labelEn: 'Interface & UI/UX Studio Banner',
    expectedFilename: 'Giao diện.mp4',
    keywords: ['giao-dien', 'interface', 'ui', 'ux', 'theme'],
    posterUrl: DRIVE_SYSTEM_MEDIA.biDashboard.image,
    previewTitleVi: 'Xưởng Giao Diện Glassmorphism & Hệ Thống Thiết Kế',
    previewTitleEn: 'Glassmorphism UI/UX & Appearance Studio',
    previewSubtitleVi:
      'Tinh tế từng sắc màu, đồng bộ Light/Dark theo hệ thống và kiến trúc đa lớp trực quan.',
    previewSubtitleEn:
      'Refined aesthetics, automatic Light/Dark system sync, and multi-layer Glassmorphism.',
    ctaLabelVi: 'Tùy Biến Giao Diện',
    ctaLabelEn: 'Customize UI',
    accentGradient: 'from-fuchsia-500 via-purple-600 to-indigo-600',
  },
  {
    key: 'contact',
    tabIndex: 12,
    shortLabelVi: 'Đặt Lịch',
    labelVi: 'Trang Đặt Lịch / Liên Hệ (Booking & Contact)',
    labelEn: 'Booking & Contact Banner',
    expectedFilename: 'Đặt lịch.mp4',
    keywords: ['dat-lich', 'lien-he', 'contact', 'booking'],
    posterUrl: DRIVE_AVATARS.hungThai,
    previewTitleVi: 'Đặt Lịch Hẹn & Kết Nối Hợp Tác Chiến Lược',
    previewTitleEn: 'Schedule Consultation & Strategic Partnership',
    previewSubtitleVi:
      'Luôn sẵn sàng lắng nghe, trao đổi trực tiếp và đồng hành giải quyết bài toán vận hành CX.',
    previewSubtitleEn:
      'Ready to connect, schedule meetings, and partner on CX transformation initiatives.',
    ctaLabelVi: 'Đặt Lịch Trao Đổi',
    ctaLabelEn: 'Book Meeting',
    accentGradient: 'from-indigo-600 via-violet-600 to-fuchsia-600',
  },
  {
    key: 'horoscope',
    tabIndex: 10,
    shortLabelVi: 'Tử Vi',
    labelVi: 'Trang Tử Vi / Tiện Ích (Horoscope & Utilities)',
    labelEn: 'Horoscope & Utilities Banner',
    expectedFilename: 'Tử Vi.mp4',
    keywords: ['tu-vi', 'horoscope', 'tien-ich', 'utilities'],
    posterUrl: DRIVE_AVATARS.hungThai,
    previewTitleVi: 'Bản Đồ Tử Vi, Ngũ Hành & Tiện Ích Lãnh Đạo',
    previewTitleEn: 'Horoscope, Five Elements & Executive Utilities',
    previewSubtitleVi:
      'Góc nhìn văn hóa phương Đông kết hợp phong cách quản trị cân bằng và tương hợp đội ngũ.',
    previewSubtitleEn:
      'Eastern cultural insights harmonizing leadership philosophy and team synergy.',
    ctaLabelVi: 'Khám Phá Bản Đồ',
    ctaLabelEn: 'Explore Horoscope',
    accentGradient: 'from-amber-600 via-rose-600 to-purple-700',
  },
  {
    key: 'about',
    tabIndex: 2,
    shortLabelVi: 'Giới Thiệu',
    labelVi: 'Trang Giới Thiệu (About Page)',
    labelEn: 'About Page Banner',
    expectedFilename: 'Giới thiệu.mp4',
    keywords: ['about', 'gioi-thieu', 'profile'],
    posterUrl: DRIVE_AVATARS.hungThai,
    previewTitleVi: 'Chân Dung Chuyên Gia & Triết Lý Phụng Sự',
    previewTitleEn: 'Executive Profile & Service Philosophy',
    previewSubtitleVi:
      'Hiệu quả – Nhân văn – Bền vững: Cân bằng quy trình SOP/SLA và sự thấu cảm con người.',
    previewSubtitleEn:
      'Effective – Humane – Sustainable: Balancing SOP/SLA discipline with authentic human empathy.',
    ctaLabelVi: 'Xem Hồ Sơ',
    ctaLabelEn: 'View Profile',
    accentGradient: 'from-rose-500 via-pink-500 to-purple-600',
  },
  {
    key: 'projects',
    tabIndex: 7,
    shortLabelVi: 'Dự Án',
    labelVi: 'Trang Dự Án / Sản Phẩm (Portfolio Page)',
    labelEn: 'Portfolio / Projects Page Banner',
    expectedFilename: 'Dự án.mp4',
    keywords: ['product', 'san-pham', 'portfolio', 'du-an'],
    posterUrl: DRIVE_PROJECT_BANNERS['1.1'],
    previewTitleVi: 'Danh Mục Dự Án Thực Chiến & Hệ Sinh Thái Số',
    previewTitleEn: 'Flagship Projects & Digital Ecosystem Portfolio',
    previewSubtitleVi:
      'Garena, Shopee, Prudential, MoMo, Finviet & 12 hệ thống quản trị doanh nghiệp Power Service.',
    previewSubtitleEn:
      'Garena, Shopee, Prudential, MoMo, Finviet & 12 Power Service enterprise platforms.',
    ctaLabelVi: 'Xem Chi Tiết Dự Án',
    ctaLabelEn: 'View Case Studies',
    accentGradient: 'from-cyan-500 via-sky-500 to-indigo-600',
  },
  {
    key: 'skills',
    tabIndex: 6,
    shortLabelVi: 'Kỹ Năng',
    labelVi: 'Trang Kỹ Năng & SWOT (Skills)',
    labelEn: 'Skills & SWOT Matrix Banner',
    expectedFilename: 'Kỷ năng.mp4',
    keywords: ['ky-nang', 'skills', 'swot'],
    posterUrl: DRIVE_EDUCATION_BANNERS.dataAnalysis,
    previewTitleVi: 'Năng Lực Quản Trị & Ma Trận Kỹ Năng SWOT',
    previewTitleEn: 'Leadership Competencies & SWOT Skills Matrix',
    previewSubtitleVi:
      'Kỹ năng là nền tảng nâng tầm dịch vụ — Kết hợp tư duy chiến lược, vận hành và công nghệ AI.',
    previewSubtitleEn:
      'Skills are the foundation that elevates service excellence across strategy, operations, and AI.',
    ctaLabelVi: 'Xem Ma Trận Kỹ Năng',
    ctaLabelEn: 'Explore Skills',
    accentGradient: 'from-violet-500 via-indigo-500 to-purple-600',
  },
];

export const BANNER_PAGE_MAP: Record<BannerPageKey, BannerPageMeta> = BANNER_PAGES.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<BannerPageKey, BannerPageMeta>
);

export const SERVICE_DOMAINS_META: ServiceDomainMeta[] = [
  {
    id: '01',
    titleVi: 'Dịch vụ Viễn thông',
    titleEn: 'Telecom Services',
    expectedFilename: 'Viễn thông di động.png',
    keywords: ['vien-thong-di-dong', 'vien-thong', 'telecom', 'di-dong'],
    defaultImageUrl: 'https://i.postimg.cc/5Nq2wsTG/Vien-thong-di-dong.png',
    accentGradient: 'from-sky-500 to-blue-600',
    taglineVi: 'Vận hành tổng đài CSKH đa kênh quy mô triệu thuê bao (Mobifone / Telecom).',
  },
  {
    id: '02',
    titleVi: 'Thương mại Điện tử',
    titleEn: 'E-Commerce Operations',
    expectedFilename: 'Thương mại điện tử.png',
    keywords: ['thuong-mai-dien-tu', 'tmdt', 'ecommerce', 'e-commerce', 'shopee'],
    defaultImageUrl: 'https://i.postimg.cc/bNHwQm4j/Thuong-mai-dien-tu.png',
    accentGradient: 'from-orange-500 to-rose-600',
    taglineVi: 'Quản trị xử lý khiếu nại, hoàn trả & vận hành sàn TMĐT tốc độ cao.',
  },
  {
    id: '03',
    titleVi: 'Dịch vụ Bảo hiểm',
    titleEn: 'Financial & Insurance CX',
    expectedFilename: 'Dịch vụ bảo hiểm.png',
    keywords: ['dich-vu-bao-hiem', 'bao-hiem', 'insurance', 'prudential'],
    defaultImageUrl: 'https://i.postimg.cc/RVQZcgyT/Dich-vu-bao-hiem.png',
    accentGradient: 'from-rose-500 to-pink-600',
    taglineVi: 'Chăm sóc khách hàng hợp đồng bảo hiểm, bảo mật thông tin & chuẩn tuân thủ.',
  },
  {
    id: '04',
    titleVi: 'Thể thao Điện tử (eSports)',
    titleEn: 'Gaming & eSports CX',
    expectedFilename: 'Thể thao điện tử.png',
    keywords: ['the-thao-dien-tu', 'esports', 'e-sports', 'game', 'garena'],
    defaultImageUrl: 'https://i.postimg.cc/Nf7j1dSk/The-thao-dien-tu.png',
    accentGradient: 'from-violet-500 to-indigo-600',
    taglineVi: 'Điều phối hỗ trợ cộng đồng game thủ 24/7, giải đấu & an toàn tài khoản.',
  },
  {
    id: '05',
    titleVi: 'Thanh toán Điện tử (FinTech)',
    titleEn: 'FinTech & E-Wallet',
    expectedFilename: 'Thanh toán điện tử.png',
    keywords: ['thanh-toan-dien-tu', 'fintech', 'ewallet', 'e-wallet', 'payment', 'momo', 'finviet'],
    defaultImageUrl: 'https://i.postimg.cc/rFCwSf3j/Thanh-toan-dien-tu.png',
    accentGradient: 'from-fuchsia-500 to-purple-600',
    taglineVi: 'Giám sát giao dịch, xử lý tra soát thanh toán tức thời & chống gian lận.',
  },
  {
    id: '06',
    titleVi: 'Xây dựng Hệ thống',
    titleEn: 'System Engineering & CX Platform',
    expectedFilename: 'Xây dựng hệ thống.png',
    keywords: ['xay-dung-he-thong', 'xay-he-thong', 'he-thong', 'system', 'platform'],
    defaultImageUrl: 'https://i.postimg.cc/QxkdpfvL/Xay-dung-he-thong.png',
    accentGradient: 'from-emerald-500 to-teal-600',
    taglineVi: 'Kiến trúc phần mềm CRM, Ticketing, Workforce Management & AI Automation.',
  },
];

export const SERVICE_DOMAIN_MAP: Record<ServiceDomainKey, ServiceDomainMeta> =
  SERVICE_DOMAINS_META.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<ServiceDomainKey, ServiceDomainMeta>
  );

/**
 * Chuẩn hóa tên tập tin hoặc tên thư mục: bỏ phần mở rộng, khử dấu tiếng Việt (kể cả đ/Đ),
 * chuyển về chữ thường và chuẩn hóa ký tự phân tách.
 */
export function normalizeFilenameForMatch(name: string): {
  hyphenated: string;
  spaced: string;
  compact: string;
} {
  const withoutExt = (name || '').replace(/\.[^/.]+$/, '');
  const ascii = withoutExt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase();

  const spaced = ascii
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  const hyphenated = spaced.replace(/\s+/g, '-');
  const compact = spaced.replace(/\s+/g, '');

  return { hyphenated, spaced, compact };
}

/**
 * Tầng 1: Nhận diện vai trò từ Tên Thư Mục Con
 */
export function classifyFolderRole(folderName: string): FolderRoleType {
  const norm = normalizeFilenameForMatch(folderName);
  const words = new Set(norm.spaced.split(' ').filter(Boolean));

  const isBannerFolder =
    words.has('banner') ||
    words.has('video') ||
    words.has('hero') ||
    norm.spaced.includes('video banner');

  if (isBannerFolder) {
    return 'banner-video';
  }

  const isServiceFolder =
    norm.spaced.includes('dich vu') ||
    words.has('service') ||
    words.has('services') ||
    norm.spaced.includes('linh vuc');

  if (isServiceFolder) {
    return 'service-image';
  }

  return 'dynamic';
}

export interface FilenameMatchResult {
  pageKey: BannerPageKey | null;
  matchedKeyword: string | null;
  confidence: 'auto' | 'manual-required';
}

const BANNER_KEYWORD_RULES: Array<{
  pageKey: BannerPageKey;
  keyword: string;
  matchTokens: string[];
}> = [
  // Hình nền (WallpaperView)
  { pageKey: 'wallpaper', keyword: 'Hình nền', matchTokens: ['hinh-nen', 'hinh nen', 'hinhnen', 'wallpaper', 'wallpapers'] },
  // Trang chủ
  { pageKey: 'home', keyword: 'trang-chu', matchTokens: ['trang-chu', 'trang chu', 'trangchu'] },
  { pageKey: 'home', keyword: 'home', matchTokens: ['home'] },
  { pageKey: 'home', keyword: 'main', matchTokens: ['main'] },

  // Kỷ niệm
  { pageKey: 'memories', keyword: 'Kỷ niệm', matchTokens: ['ky-niem', 'ky niem', 'kyniem'] },
  { pageKey: 'memories', keyword: 'memories', matchTokens: ['memories', 'memory'] },

  // Kinh nghiệm
  {
    pageKey: 'experience',
    keyword: 'Kinh nghiệm',
    matchTokens: ['kinh-nghiem', 'kinh nghiem', 'kinhnghiem'],
  },
  { pageKey: 'experience', keyword: 'experience', matchTokens: ['experience'] },

  // Học vấn
  { pageKey: 'education', keyword: 'Học vấn', matchTokens: ['hoc-van', 'hoc van', 'hocvan'] },
  { pageKey: 'education', keyword: 'education', matchTokens: ['education'] },

  // Dịch vụ
  { pageKey: 'services', keyword: 'Dịch Vụ', matchTokens: ['dich-vu', 'dich vu', 'dichvu'] },
  { pageKey: 'services', keyword: 'service', matchTokens: ['service', 'services'] },
  { pageKey: 'services', keyword: 'solution', matchTokens: ['solution', 'solutions'] },

  // Hệ thống
  { pageKey: 'systems', keyword: 'Hệ thống', matchTokens: ['he-thong', 'he thong', 'hethong'] },
  { pageKey: 'systems', keyword: 'system', matchTokens: ['system', 'systems'] },

  // Giao diện
  { pageKey: 'interface', keyword: 'Giao diện', matchTokens: ['giao-dien', 'giao dien', 'giaodien'] },
  { pageKey: 'interface', keyword: 'interface', matchTokens: ['interface', 'uiux'] },

  // Đặt lịch / Liên hệ
  { pageKey: 'contact', keyword: 'Đặt lịch', matchTokens: ['dat-lich', 'dat lich', 'datlich'] },
  { pageKey: 'contact', keyword: 'Liên hệ', matchTokens: ['lien-he', 'lien he', 'lienhe'] },
  { pageKey: 'contact', keyword: 'contact', matchTokens: ['contact', 'booking'] },

  // Tử vi
  { pageKey: 'horoscope', keyword: 'Tử Vi', matchTokens: ['tu-vi', 'tu vi', 'tuvi'] },
  { pageKey: 'horoscope', keyword: 'horoscope', matchTokens: ['horoscope', 'tien-ich', 'tien ich'] },

  // Giới thiệu & Dự án (tương thích ngược)
  {
    pageKey: 'about',
    keyword: 'Giới thiệu',
    matchTokens: ['gioi-thieu', 'gioi thieu', 'gioithieu', 'about', 'profile'],
  },
  {
    pageKey: 'projects',
    keyword: 'Dự án',
    matchTokens: ['du-an', 'du an', 'duan', 'san-pham', 'san pham', 'portfolio', 'product'],
  },
  {
    pageKey: 'skills',
    keyword: 'Kỷ năng',
    matchTokens: ['ky-nang', 'ky nang', 'kynang', 'skills', 'skill'],
  },
];

const SERVICE_KEYWORD_RULES: Array<{
  serviceId: ServiceDomainKey;
  keyword: string;
  matchTokens: string[];
}> = [
  {
    serviceId: '01',
    keyword: 'Viễn thông di động',
    matchTokens: ['vien-thong-di-dong', 'vien thong di dong', 'vien-thong', 'vien thong', 'telecom', 'di-dong', 'di dong'],
  },
  {
    serviceId: '02',
    keyword: 'Thương mại điện tử',
    matchTokens: ['thuong-mai-dien-tu', 'thuong mai dien tu', 'tmdt', 'ecommerce', 'e-commerce'],
  },
  {
    serviceId: '03',
    keyword: 'Dịch vụ bảo hiểm',
    matchTokens: ['dich-vu-bao-hiem', 'dich vu bao hiem', 'bao-hiem', 'bao hiem', 'insurance'],
  },
  {
    serviceId: '04',
    keyword: 'Thể thao điện tử',
    matchTokens: ['the-thao-dien-tu', 'the thao dien tu', 'esports', 'e-sports', 'game'],
  },
  {
    serviceId: '05',
    keyword: 'Thanh toán điện tử',
    matchTokens: ['thanh-toan-dien-tu', 'thanh toan dien tu', 'fintech', 'ewallet', 'e-wallet', 'payment'],
  },
  {
    serviceId: '06',
    keyword: 'Xây dựng hệ thống',
    matchTokens: ['xay-dung-he-thong', 'xay dung he thong', 'xay-he-thong', 'xay he thong', 'he-thong', 'he thong', 'system'],
  },
];

function findRuleMatch<T extends { keyword: string; matchTokens: string[] }>(
  fileName: string,
  rules: T[]
): T | null {
  const normalized = normalizeFilenameForMatch(fileName);
  const words = new Set(normalized.spaced.split(' ').filter(Boolean));

  for (const rule of rules) {
    for (const token of rule.matchTokens) {
      if (token.includes(' ') || token.includes('-')) {
        if (
          normalized.spaced.includes(token) ||
          normalized.hyphenated.includes(token) ||
          normalized.compact.includes(token.replace(/[-\s]/g, ''))
        ) {
          return rule;
        }
      } else if (words.has(token) || normalized.compact.includes(token)) {
        return rule;
      }
    }
  }
  return null;
}

export function classifyVideoFilename(fileName: string): FilenameMatchResult {
  const matched = findRuleMatch(fileName, BANNER_KEYWORD_RULES);
  if (matched) {
    return {
      pageKey: matched.pageKey,
      matchedKeyword: matched.keyword,
      confidence: 'auto',
    };
  }
  return {
    pageKey: null,
    matchedKeyword: null,
    confidence: 'manual-required',
  };
}

export interface TwoTierMatchResult {
  folderRole: FolderRoleType;
  targetType: 'banner' | 'service' | null;
  pageKey: BannerPageKey | null;
  serviceId: ServiceDomainKey | null;
  matchedKeyword: string | null;
  confidence: 'auto' | 'manual-required';
}

/**
 * Logic ánh xạ 2 tầng: Kết hợp [Tên Thư Mục Con] + [Tên Tập Tin]
 */
export function classifyDriveAssetTwoTier(params: {
  fileName: string;
  folderName: string;
  mediaKind: 'video' | 'image' | 'other';
}): TwoTierMatchResult {
  const folderRole = classifyFolderRole(params.folderName || '');

  // Tầng 1A: Thư mục Video Banner -> map các file video vào Banner của 9+ trang
  if (folderRole === 'banner-video' && params.mediaKind === 'video') {
    const matched = findRuleMatch(params.fileName, BANNER_KEYWORD_RULES);
    if (matched) {
      return {
        folderRole,
        targetType: 'banner',
        pageKey: matched.pageKey,
        serviceId: null,
        matchedKeyword: matched.keyword,
        confidence: 'auto',
      };
    }
    return {
      folderRole,
      targetType: null,
      pageKey: null,
      serviceId: null,
      matchedKeyword: null,
      confidence: 'manual-required',
    };
  }

  // Tầng 1B: Thư mục Dịch Vụ -> map các file hình ảnh vào 6 Thẻ Dịch Vụ Bento
  if (folderRole === 'service-image' && params.mediaKind === 'image') {
    const matchedService = findRuleMatch(params.fileName, SERVICE_KEYWORD_RULES);
    if (matchedService) {
      return {
        folderRole,
        targetType: 'service',
        pageKey: null,
        serviceId: matchedService.serviceId,
        matchedKeyword: matchedService.keyword,
        confidence: 'auto',
      };
    }
    return {
      folderRole,
      targetType: null,
      pageKey: null,
      serviceId: null,
      matchedKeyword: null,
      confidence: 'manual-required',
    };
  }

  // Fallback thông minh nếu video nằm ngay thư mục gốc và tên khớp rõ ràng trang Banner
  if (folderRole === 'dynamic' && params.mediaKind === 'video') {
    const matched = findRuleMatch(params.fileName, BANNER_KEYWORD_RULES);
    if (matched) {
      return {
        folderRole: 'banner-video',
        targetType: 'banner',
        pageKey: matched.pageKey,
        serviceId: null,
        matchedKeyword: matched.keyword,
        confidence: 'auto',
      };
    }
  }

  // Tầng 1C: Thư mục động (VD: Dự Án, Khách Hàng, Blog) hoặc file chưa khớp tên
  return {
    folderRole,
    targetType: null,
    pageKey: null,
    serviceId: null,
    matchedKeyword: null,
    confidence: 'manual-required',
  };
}

export function generateBannerSnippetCode(params: {
  pageKey: BannerPageKey;
  fileId: string;
  fileName: string;
  directStreamUrl: string;
  previewIframeUrl: string;
  posterUrl?: string;
}): string {
  const page = BANNER_PAGE_MAP[params.pageKey];
  const poster = params.posterUrl || page.posterUrl;
  const componentName = `${params.pageKey.charAt(0).toUpperCase()}${params.pageKey.slice(1)}HeroBanner`;

  return `import React, { useState } from 'react';

/**
 * ${page.labelVi} — Background Video từ Google Drive
 * File: ${params.fileName} (FILE_ID: ${params.fileId})
 */
export function ${componentName}() {
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const DIRECT_VIDEO_URL = '${params.directStreamUrl}';
  const IFRAME_FALLBACK_URL = '${params.previewIframeUrl}';
  const POSTER_IMAGE_URL = '${poster}';

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-6 font-['Play',sans-serif]">
      {/* 1. Video nền từ Google Drive (Direct Stream + Iframe Fallback) */}
      {!useIframeFallback ? (
        <video
          src={DIRECT_VIDEO_URL}
          poster={POSTER_IMAGE_URL}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          preload="auto"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setUseIframeFallback(true);
          }}
          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0 banner-video-sharp"
        />
      ) : (
        <iframe
          src={IFRAME_FALLBACK_URL}
          title="${params.fileName}"
          allow="autoplay; encrypted-media"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-110 z-0"
          onLoad={() => setIsLoading(false)}
        />
      )}

      {/* 2. Poster dự phòng & trạng thái tải mượt mà */}
      {isLoading && (
        <img
          src={POSTER_IMAGE_URL}
          alt="${page.previewTitleVi}"
          className="absolute inset-0 w-full h-full object-cover z-[1] animate-pulse"
        />
      )}

      {/* 3. Gradient Overlay nhẹ bảo đảm tương phản chữ */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/35 to-slate-950/20 dark:from-black/80 dark:via-slate-950/45 dark:to-black/30 z-10 pointer-events-none" />

      {/* 4. Thẻ nội dung Glassmorphism trung tâm (bo góc 16px, nút bo tròn 999px) */}
      <div className="relative z-20 max-w-xl w-full rounded-[16px] bg-white/15 dark:bg-slate-900/45 backdrop-blur-md border border-white/30 dark:border-white/15 p-6 text-center shadow-2xl">
        <span className="inline-block px-3 py-1 rounded-[999px] text-xs font-bold bg-white/20 text-white mb-3">
          ${page.labelVi}
        </span>
        <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
          ${page.previewTitleVi}
        </h1>
        <p className="mt-2.5 text-sm md:text-base text-white/90 leading-relaxed">
          ${page.previewSubtitleVi}
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="#explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[999px] bg-gradient-to-r ${page.accentGradient} text-white text-sm font-bold shadow-lg hover:brightness-110 transition"
          >
            ${page.ctaLabelVi}
          </a>
        </div>
      </div>
    </section>
  );
}`;
}

export function generateFullWebsiteExportCode(params: {
  bannerAssignments: Partial<
    Record<
      BannerPageKey,
      {
        fileId: string;
        fileName: string;
        directStreamUrl: string;
        previewIframeUrl: string;
      }
    >
  >;
  serviceAssignments: Partial<
    Record<
      ServiceDomainKey,
      {
        fileId: string;
        fileName: string;
        directImageUrl: string;
      }
    >
  >;
}): string {
  const bannerEntries = PRIMARY_9_BANNER_PAGE_KEYS.map((key) => {
    const meta = BANNER_PAGE_MAP[key];
    const assigned = params.bannerAssignments[key];
    return `  ${key}: {
    label: '${meta.shortLabelVi}',
    fileName: '${assigned?.fileName || meta.expectedFilename}',
    fileId: '${assigned?.fileId || 'UNASSIGNED'}',
    directStreamUrl: '${
      assigned?.directStreamUrl ||
      `https://drive.google.com/uc?export=download&id=${assigned?.fileId || 'YOUR_FILE_ID'}`
    }',
    previewIframeUrl: '${
      assigned?.previewIframeUrl ||
      `https://drive.google.com/file/d/${assigned?.fileId || 'YOUR_FILE_ID'}/preview?autoplay=1&mute=1&loop=1`
    }',
    posterUrl: '${meta.posterUrl}',
    title: '${meta.previewTitleVi}',
    subtitle: '${meta.previewSubtitleVi}',
    ctaLabel: '${meta.ctaLabelVi}',
  }`;
  }).join(',\n');

  const serviceEntries = SERVICE_DOMAINS_META.map((svc) => {
    const assigned = params.serviceAssignments[svc.id];
    const imgUrl =
      assigned?.directImageUrl ||
      (assigned?.fileId
        ? `https://lh3.googleusercontent.com/d/${assigned.fileId}`
        : svc.defaultImageUrl);
    return `  {
    id: '${svc.id}',
    title: '${svc.titleVi}',
    tagline: '${svc.taglineVi}',
    fileName: '${assigned?.fileName || svc.expectedFilename}',
    imageUrl: '${imgUrl}',
  }`;
  }).join(',\n');

  return `import React, { useState } from 'react';

/**
 * ============================================================================
 * WEBSITE PORTFOLIO & DỊCH VỤ ĐỒNG BỘ TỰ ĐỘNG TỪ GOOGLE DRIVE
 * Font: Play | Light/Dark theo hệ thống | Glassmorphism 16px | Nút 999px | Bento Grid
 * ============================================================================
 */
export const DRIVE_BANNER_CONFIG = {
${bannerEntries}
} as const;

export type DriveBannerPageKey = keyof typeof DRIVE_BANNER_CONFIG;

export const DRIVE_SERVICES_BENTO = [
${serviceEntries}
];

export function PortfolioDriveSyncedWebsite() {
  const [activePage, setActivePage] = useState<DriveBannerPageKey>('home');
  const [useIframe, setUseIframe] = useState(false);
  const current = DRIVE_BANNER_CONFIG[activePage];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-['Play',sans-serif]">
      {/* Thanh điều hướng nhanh 9 trang */}
      <header className="sticky top-0 z-40 px-4 py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
          {(Object.keys(DRIVE_BANNER_CONFIG) as DriveBannerPageKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setUseIframe(false);
                setActivePage(key);
              }}
              className={\`px-4 py-1.5 rounded-[999px] text-xs font-bold transition \${
                activePage === key
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'
              }\`}
            >
              {DRIVE_BANNER_CONFIG[key].label}
            </button>
          ))}
        </nav>
      </header>

      {/* Banner toàn màn hình 100vh + Glassmorphism trung tâm */}
      <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center p-6">
        {!useIframe ? (
          <video
            key={current.directStreamUrl}
            src={current.directStreamUrl}
            poster={current.posterUrl}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            preload="auto"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
            onError={() => setUseIframe(true)}
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0 banner-video-sharp"
          />
        ) : (
          <iframe
            key={current.previewIframeUrl}
            src={current.previewIframeUrl}
            title={current.fileName}
            allow="autoplay; encrypted-media"
            className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-110 z-0"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-slate-950/20 z-10 pointer-events-none" />

        <div className="relative z-20 max-w-2xl w-full rounded-[16px] bg-white/15 dark:bg-slate-900/45 backdrop-blur-md border border-white/30 dark:border-white/15 p-8 text-center shadow-2xl">
          <span className="inline-block px-3 py-1 rounded-[999px] text-xs font-bold bg-white/20 text-white mb-3">
            {current.label}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {current.title}
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/90 leading-relaxed">
            {current.subtitle}
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="#services-bento"
              className="inline-flex items-center px-6 py-2.5 rounded-[999px] bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 text-white text-sm font-bold shadow-lg"
            >
              {current.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Bento Grid 6 Thẻ Dịch Vụ */}
      <section id="services-bento" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Lĩnh Vực Dịch Vụ Trọng Tâm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DRIVE_SERVICES_BENTO.map((item) => (
            <article
              key={item.id}
              className="rounded-[16px] bg-white/75 dark:bg-slate-900/65 backdrop-blur-md border border-black/10 dark:border-white/15 p-5 flex flex-col gap-4 shadow-md"
            >
              <div className="aspect-[16/10] w-full rounded-[12px] overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.tagline}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}`;
}
