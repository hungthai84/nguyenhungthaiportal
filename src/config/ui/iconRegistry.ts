/* iconRegistry.ts - Centralized semantic Icon Registry for Lucide Icons */

export interface IconConfig {
  id: string;
  icon: string;
  category: 'core' | 'career' | 'learning' | 'service' | 'system' | 'tech' | 'contact' | 'nav';
  label: string;
  desc?: string;
}

export const ICON_REGISTRY: Record<string, IconConfig> = {
  // Navigation & Core Pages
  home: { id: 'home', icon: 'home', category: 'nav', label: 'Trang chủ' },
  letter: { id: 'letter', icon: 'file-text', category: 'nav', label: 'Thư ngỏ' },
  about: { id: 'about', icon: 'user-round', category: 'nav', label: 'Giới thiệu bản thân' },
  education: { id: 'education', icon: 'graduation-cap', category: 'learning', label: 'Học vấn & đào tạo' },
  services: { id: 'services', icon: 'briefcase', category: 'service', label: 'Lĩnh vực chuyên môn' },
  experience: { id: 'experience', icon: 'briefcase-business', category: 'career', label: 'Kinh nghiệm làm việc' },
  skills: { id: 'skills', icon: 'brain', category: 'core', label: 'Kỹ năng & năng lực' },
  projects: { id: 'projects', icon: 'folder-kanban', category: 'system', label: 'Dự án thực tế' },
  interview: { id: 'interview', icon: 'messages-square', category: 'service', label: 'Phỏng vấn' },
  horoscope: { id: 'horoscope', icon: 'compass', category: 'core', label: 'Tử vi & triết lý' },
  memories: { id: 'memories', icon: 'images', category: 'core', label: 'Kỷ niệm & hoạt động' },
  systems: { id: 'systems', icon: 'network', category: 'system', label: 'Hệ thống quản trị' },
  contact: { id: 'contact', icon: 'contact-round', category: 'contact', label: 'Thông tin liên hệ' },

  // Business & Domain Specifics
  customerService: { id: 'customerService', icon: 'headset', category: 'service', label: 'Chăm sóc khách hàng' },
  serviceManagement: { id: 'serviceManagement', icon: 'settings', category: 'service', label: 'Quản trị dịch vụ' },
  technology: { id: 'technology', icon: 'cpu', category: 'tech', label: 'Công nghệ & kỹ thuật' },
  ai: { id: 'ai', icon: 'bot', category: 'tech', label: 'Trí tuệ nhân tạo' },
  achievement: { id: 'achievement', icon: 'trophy', category: 'career', label: 'Thành tựu' },
  certificate: { id: 'certificate', icon: 'award', category: 'learning', label: 'Chứng chỉ' },
  phone: { id: 'phone', icon: 'phone', category: 'contact', label: 'Điện thoại' },
  email: { id: 'email', icon: 'mail', category: 'contact', label: 'Email' },
  location: { id: 'location', icon: 'map-pin', category: 'contact', label: 'Địa chỉ' },
  analytics: { id: 'analytics', icon: 'chart-no-axes-combined', category: 'system', label: 'Phân tích dữ liệu' },
  performance: { id: 'performance', icon: 'gauge', category: 'service', label: 'Hiệu suất' },
  process: { id: 'process', icon: 'workflow', category: 'system', label: 'Quy trình vận hành' },
  team: { id: 'team', icon: 'users-round', category: 'career', label: 'Đội ngũ' },
  training: { id: 'training', icon: 'presentation', category: 'learning', label: 'Đào tạo nội bộ' },
};

export function getIconName(key: string, fallback = 'sparkles'): string {
  if (ICON_REGISTRY[key]) {
    return ICON_REGISTRY[key].icon;
  }
  return fallback;
}
