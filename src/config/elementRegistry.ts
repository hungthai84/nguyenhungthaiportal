import { ElementRegistryItem, ElementValidationReport, ElementPage, ElementType } from '@/types/element.types';

export const CENTRAL_ELEMENT_REGISTRY: ElementRegistryItem[] = [
  // Global & Root Layout
  { id: 'website-root', name: 'Khung chứa toàn bộ trang web', type: 'container', page: 'global', description: 'Root DOM container chứa sidebar và main view' },
  { id: 'global-sidebar', name: 'Thanh điều hướng Sidebar', type: 'sidebar', page: 'global', parentId: 'website-root', description: 'Sidebar điều hướng các trang chính' },
  { id: 'global-top-header', name: 'Thanh tiêu đề Top Header', type: 'header', page: 'global', parentId: 'website-root', description: 'Header hiển thị đồng hồ, avatar, theme switcher' },
  { id: 'global-theme-switcher', name: 'Nút chuyển đổi giao diện Sáng/Tối', type: 'control', page: 'global', parentId: 'global-top-header', description: 'Nút bật tắt Light Mode và Dark Mode' },
  { id: 'global-content-viewport', name: 'Khung hiển thị nội dung chính', type: 'container', page: 'global', parentId: 'website-root', description: 'Main viewport chứa các View component' },
  { id: 'el-p5-div-1', name: 'Khung chuyển đổi tab nội dung', type: 'container', page: 'global', parentId: 'global-content-viewport', description: 'Container chuyển đổi các view nội dung với kích thước max full' },

  // Home Page
  { id: 'home-page-container', name: 'Trang chủ cá nhân', type: 'container', page: 'home', parentId: 'global-content-viewport', description: 'Vùng thông tin tổng quan trang chủ' },
  { id: 'home-hero-card', name: 'Thẻ Hồ sơ Chuyên gia Trang chủ', type: 'card', page: 'home', parentId: 'home-page-container', description: 'Thẻ hero chứa thông tin cá nhân và số liệu' },
  { id: 'home-hero-avatar', name: 'Ảnh đại diện chuyên gia', type: 'image', page: 'home', parentId: 'home-hero-card', description: 'Avatar chân dung Nguyễn Hùng Thái' },
  { id: 'home-hero-name', name: 'Họ và tên Nguyễn Hùng Thái', type: 'heading', page: 'home', parentId: 'home-hero-card', description: 'Tiêu đề chính họ tên nhân vật' },
  { id: 'home-hero-title', name: 'Chức danh Giám đốc Trải nghiệm Khách hàng', type: 'text', page: 'home', parentId: 'home-hero-card', description: 'Chức danh CX Director / Head of CS' },
  { id: 'home-stats-experience', name: 'Số liệu 22+ năm kinh nghiệm', type: 'widget', page: 'home', parentId: 'home-hero-card', description: 'Thống kê năm kinh nghiệm thực chiến' },
  { id: 'home-stats-headcount', name: 'Số liệu 130+ nhân sự điều hành', type: 'widget', page: 'home', parentId: 'home-hero-card', description: 'Thống kê quy mô đội ngũ lớn nhất' },
  { id: 'home-stats-csat', name: 'Chỉ số CSAT 98.2%', type: 'widget', page: 'home', parentId: 'home-hero-card', description: 'Chỉ số hài lòng khách hàng kỷ lục' },

  // Letter Page
  { id: 'letter-page-container', name: 'Trang Thư Ngỏ', type: 'container', page: 'letter', parentId: 'global-content-viewport', description: 'Container trang Thư Ngỏ' },
  { id: 'letter-main-card', name: 'Thẻ chính Trang Thư Ngỏ', type: 'card', page: 'letter', parentId: 'letter-page-container', description: 'Main card chứa toàn bộ nội dung trang Thư Ngỏ' },

  // Education Page
  { id: 'education-page-container', name: 'Trang Học vấn & Bằng cấp', type: 'container', page: 'education', parentId: 'global-content-viewport', description: 'Danh mục trình độ học vấn và chứng chỉ' },
  { id: 'education-hero-banner', name: 'Banner Học vấn & Bằng cấp', type: 'section', page: 'education', parentId: 'education-page-container', description: 'Banner tiêu đề trang học vấn' },
  { id: 'education-degree-card-stu', name: 'Bằng Cử nhân Kỹ thuật Điện tử - STU', type: 'card', page: 'education', parentId: 'education-page-container', description: 'Thẻ bằng cấp Đại học Công nghệ Sài Gòn' },

  // Experience Page
  { id: 'experience-page-container', name: 'Trang Hành trình sự nghiệp', type: 'container', page: 'experience', parentId: 'global-content-viewport', description: 'Timeline mốc lịch sử công tác' },
  { id: 'experience-hero-banner', name: 'Banner Hành trình sự nghiệp', type: 'section', page: 'experience', parentId: 'experience-page-container', description: 'Banner tiêu đề trang kinh nghiệm' },
  { id: 'experience-company-card-finviet', name: 'Thẻ công tác Finviet 2023', type: 'card', page: 'experience', parentId: 'experience-page-container', description: 'Thẻ kinh nghiệm Trưởng phòng CSKH Finviet' },
  { id: 'experience-company-card-momo', name: 'Thẻ công tác Ví MoMo 2018', type: 'card', page: 'experience', parentId: 'experience-page-container', description: 'Thẻ kinh nghiệm Trưởng phòng CSKH Ví MoMo' },
  { id: 'experience-company-card-prudential', name: 'Thẻ công tác Prudential 2016', type: 'card', page: 'experience', parentId: 'experience-page-container', description: 'Thẻ kinh nghiệm Trưởng phòng CallCenter Prudential' },
  { id: 'experience-company-card-ved', name: 'Thẻ công tác VED / Garena 2013', type: 'card', page: 'experience', parentId: 'experience-page-container', description: 'Thẻ kinh nghiệm Trưởng phòng Dịch vụ KH VED' },

  // Skills Page
  { id: 'skills-page-container', name: 'Trang Kỹ năng & Năng lực', type: 'container', page: 'skills', parentId: 'global-content-viewport', description: 'Ma trận năng lực quản trị và công nghệ' },
  { id: 'skills-card-crm', name: 'Thẻ kỹ năng CRM & Omnichannel', type: 'card', page: 'skills', parentId: 'skills-page-container', description: 'Kỹ năng vận hành CRM đa kênh' },
  { id: 'skills-card-automation', name: 'Thẻ kỹ năng AI & Tự động hóa', type: 'card', page: 'skills', parentId: 'skills-page-container', description: 'Kỹ năng ứng dụng AI Agents workflows' },

  // Projects Page
  { id: 'projects-page-container', name: 'Trang Dự án trọng điểm', type: 'container', page: 'projects', parentId: 'global-content-viewport', description: 'Danh sách các dự án cải tiến CX tiêu biểu' },
  { id: 'projects-hero-banner', name: 'Banner Dự án trọng điểm', type: 'section', page: 'projects', parentId: 'projects-page-container', description: 'Banner tiêu đề trang dự án' },
  { id: 'projects-card-01', name: 'Dự án Tái cấu trúc CRM Shopee & Garena', type: 'card', page: 'projects', parentId: 'projects-page-container', description: 'Thẻ dự án quy mô 130 nhân sự' },

  // Systems Page
  { id: 'systems-page-container', name: 'Trang Hệ thống doanh nghiệp', type: 'container', page: 'systems', parentId: 'global-content-viewport', description: 'Mô hình 12 hệ thống vận hành doanh nghiệp' },
  { id: 'systems-hero-banner', name: 'Banner Hệ thống doanh nghiệp', type: 'section', page: 'systems', parentId: 'systems-page-container', description: 'Banner tiêu đề trang hệ thống' },
  { id: 'systems-card-sdp', name: 'Thẻ hệ thống Nền tảng Dịch vụ SDP', type: 'card', page: 'systems', parentId: 'systems-page-container', description: 'Thẻ 3D Service Delivery Platform' },

  // Horoscope Page
  { id: 'horoscope-page-container', name: 'Trang Bản đồ tử vi', type: 'container', page: 'horoscope', parentId: 'global-content-viewport', description: 'Phân tích phong thủy tử vi quản trị' },
  { id: 'horoscope-main-card', name: 'Thẻ chính Trang Tử Vi & Phong Thủy', type: 'card', page: 'horoscope', parentId: 'horoscope-page-container', description: 'Main card chứa toàn bộ nội dung trang Tử Vi' },
  { id: 'horoscope-hero-banner', name: 'Banner Bản đồ tử vi', type: 'section', page: 'horoscope', parentId: 'horoscope-main-card', description: 'Banner tiêu đề trang tử vi' },

  // Memories Page
  { id: 'memories-page-container', name: 'Trang Khoảnh khắc kỷ niệm', type: 'container', page: 'memories', parentId: 'global-content-viewport', description: 'Bộ sưu tập hình ảnh kỷ niệm công tác' },
  { id: 'memories-hero-banner', name: 'Banner Khoảnh khắc kỷ niệm', type: 'section', page: 'memories', parentId: 'memories-page-container', description: 'Banner tiêu đề trang kỷ niệm' },

  // Wallpaper Page
  { id: 'wallpaper-page-container', name: 'Trang Không gian hình nền', type: 'container', page: 'wallpaper', parentId: 'global-content-viewport', description: 'Bộ sưu tập hình nền và phong cách giao diện' },
  { id: 'wallpaper-hero-banner', name: 'Banner Không gian hình nền', type: 'section', page: 'wallpaper', parentId: 'wallpaper-page-container', description: 'Banner tiêu đề trang hình nền' },
];

export function getElementRegistry(): ElementRegistryItem[] {
  return CENTRAL_ELEMENT_REGISTRY;
}

export function getElementById(id: string): ElementRegistryItem | undefined {
  return CENTRAL_ELEMENT_REGISTRY.find((item) => item.id === id);
}

export function getElementsByPage(page: ElementPage): ElementRegistryItem[] {
  return CENTRAL_ELEMENT_REGISTRY.filter((item) => item.page === page);
}

export function getElementsByType(type: ElementType): ElementRegistryItem[] {
  return CENTRAL_ELEMENT_REGISTRY.filter((item) => item.type === type);
}

/**
 * Validates DOM elements currently loaded in document
 */
export function validateElementRegistry(): ElementValidationReport {
  if (typeof document === 'undefined') {
    return {
      totalRegistered: CENTRAL_ELEMENT_REGISTRY.length,
      totalValidInDom: 0,
      missingInDom: CENTRAL_ELEMENT_REGISTRY.length,
      duplicateIdsInDom: [],
      missingNamesInDom: 0,
      pagesIdentified: [],
      status: 'WARNING',
      details: 'Môi trường Server-Side (SSR) - không có DOM để kiểm tra.',
    };
  }

  const domElements = document.querySelectorAll('[id]');
  const idCounts: Record<string, number> = {};
  const duplicates: string[] = [];
  const pagesSet = new Set<string>();
  let missingNames = 0;

  domElements.forEach((el) => {
    const id = el.id;
    if (id) {
      idCounts[id] = (idCounts[id] || 0) + 1;
      if (idCounts[id] === 2) {
        duplicates.push(id);
      }
    }
    const name = el.getAttribute('data-element-name');
    if (!name && el.hasAttribute('data-element-type')) {
      missingNames++;
    }
    const page = el.getAttribute('data-element-page');
    if (page) {
      pagesSet.add(page);
    }
  });

  let validInDom = 0;
  CENTRAL_ELEMENT_REGISTRY.forEach((reg) => {
    if (document.getElementById(reg.id)) {
      validInDom++;
    }
  });

  const missingCount = CENTRAL_ELEMENT_REGISTRY.length - validInDom;
  const status = duplicates.length > 0 ? 'ERROR' : missingCount > 5 ? 'WARNING' : 'SUCCESS';

  return {
    totalRegistered: CENTRAL_ELEMENT_REGISTRY.length,
    totalValidInDom: validInDom,
    missingInDom: missingCount,
    duplicateIdsInDom: duplicates,
    missingNamesInDom: missingNames,
    pagesIdentified: Array.from(pagesSet),
    status,
    details: `Đã xác nhận ${validInDom}/${CENTRAL_ELEMENT_REGISTRY.length} phần tử đăng ký tồn tại trong DOM. ${duplicates.length} ID bị trùng lặp.`,
  };
}
