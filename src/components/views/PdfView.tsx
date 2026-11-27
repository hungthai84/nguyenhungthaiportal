'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { ABOUT_PROFILE_STATS, PERSONAL_DEMOGRAPHICS, SERVICE_PHILOSOPHY_VALUES } from '@/data/aboutData';
import { EDUCATION_COURSES } from '@/data/education';
import { DOMAINS_DATA, DOMAINS_INTRO, SERVICES_DATA, SERVICES_INTRO } from '@/data/services';
import { EXPERIENCE_MILESTONES } from '@/data/experience';
import { cn } from '@/lib/utils';
import { 
  STRENGTHS_DATA, 
  WEAKNESSES_DATA, 
  OPPORTUNITIES_DATA, 
  THREATS_DATA, 
  LANGUAGES_DATA,
} from '@/data/skills';
import { PROJECTS_DATA } from '@/data/projects';
import { ENTERPRISE_SYSTEMS_LIST } from '@/data/systems';
import { BannerBackgroundVideo } from '@/components/common/BannerBackgroundVideo';
import { DRIVE_AVATARS, DRIVE_BANNER_VIDEOS } from '@/config/driveMediaLinks';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';

const SERVICE_ACCENT_COLORS: Record<string, string> = {
  cyan: '#0284c7',
  orange: '#ea580c',
  rose: '#e11d48',
  indigo: '#7c3aed',
  purple: '#4f46e5',
  emerald: '#059669',
};

const DEMO_ICON_COLORS: Record<string, string> = {
  gender: '#0284c7',
  gender_ethnicity: '#0284c7',
  status: '#e11d48',
  birthday: '#d97706',
  birthday_horoscope: '#d97706',
  temp_residence: '#4f46e5',
  permanent_residence: '#059669',
  email: '#0891b2',
  phone_zalo: '#2563eb',
  website_netlify: '#0d9488',
  website_official: '#7c3aed',
  website: '#7c3aed',
  linkedin: '#0369a1',
};

function getDemoIconName(iconName: string): string {
  const norm = (iconName || 'user').toLowerCase().trim();
  if (norm === 'mappin') return 'map-pin';
  if (norm === 'externallink') return 'external-link';
  if (norm === 'building2') return 'building-2';
  if (norm === 'barchart3') return 'chart';
  return norm;
}

function getPhilosophyMeta(id: string): { icon: string; title: string; color: string } {
  if (id === 'efficiency') return { icon: 'chart', title: '01. Hiệu quả', color: '#2563eb' };
  if (id === 'humanity') return { icon: 'heart', title: '02. Nhân văn', color: '#e11d48' };
  return { icon: 'leaf', title: '03. Bền vững', color: '#059669' };
}

export interface PdfViewProps {
  onShowNotification?: (msg: string) => void;
  onNavigateTab?: (tabIndex: number) => void;
}

const PARTNER_BRANDS = [
  { id: 'mobifone', company: 'MobiFone', logo: 'https://i.postimg.cc/J0f8691x/Mobifone.webp' },
  { id: 'v247', company: 'Viễn Liên V247', logo: 'https://i.postimg.cc/zvsNt9J6/V247.webp' },
  { id: 'lbc', company: 'LBC – HTVC', logo: 'https://i.postimg.cc/hvknyHSr/LBC.webp' },
  { id: 'ved', company: 'VED (Garena / Shopee)', logo: 'https://i.postimg.cc/cCpW9Vsz/VED.webp' },
  { id: 'prudential', company: 'Prudential Việt Nam', logo: 'https://i.postimg.cc/D09hjt2Y/Prudential.webp' },
  { id: 'momo', company: 'Ví MoMo', logo: 'https://i.postimg.cc/90628vWg/Momo.webp' },
  { id: 'finviet', company: 'Finviet (Ví ECO)', logo: 'https://i.postimg.cc/3N47ZKHb/Finviet.webp' },
  { id: 'powerservice', company: 'Power Service', logo: 'https://i.postimg.cc/0jTvWL8Z/Power-Service.webp' },
];

const DISTINCT_COURSE_PALETTE = [
  '#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4',
  '#3B82F6', '#14B8A6', '#F97316', '#A855F7', '#6366F1', '#E11D48',
];

function getCourseColor(course: any, idx: number): string {
  if (course.accentColor && course.accentColor !== '#10B981') return course.accentColor;
  return DISTINCT_COURSE_PALETTE[idx % DISTINCT_COURSE_PALETTE.length];
}

const PDF_OPEN_LETTER_MILESTONES = [
  {
    id: '2002',
    title: 'Năm 2002 – Khởi đầu tại MobiFone',
    roleTier: 'Nhân viên CSKH',
    sector: 'Viễn thông di động',
    skillsFocus: 'Quy trình chuẩn · Xử lý sự cố · Tổng đài',
    body: 'Khởi nghiệp ở vị trí nhân viên tổng đài, được đào tạo bài bản về nghiệp vụ CSKH, xử lý sự cố và tuân thủ quy trình dịch vụ chuẩn viễn thông, đặt nền móng cho tư duy lấy khách hàng làm trung tâm.',
    icon: 'signal',
    accent: '#0284c7',
  },
  {
    id: '2007',
    title: 'Năm 2007 – Giám sát tại Viễn Liên V247',
    roleTier: 'Giám sát CSKH',
    sector: 'Viễn thông quốc tế',
    skillsFocus: 'Quản lý ca · Đào tạo · Giám sát chất lượng',
    body: 'Thăng tiến lên vai trò giám sát đội ngũ, trực tiếp điều phối ca trực, đào tạo nhân sự mới và xây dựng bộ chỉ số đánh giá chất lượng dịch vụ quy mô trung tâm.',
    icon: 'headset',
    accent: '#0d9488',
  },
  {
    id: '2011',
    title: 'Năm 2011 – Trưởng phòng tại LBC – HTVC',
    roleTier: 'Trưởng phòng CSKH (Quy mô nhỏ)',
    sector: 'Truyền hình Cáp & Internet',
    skillsFocus: 'Quản trị phòng ban · Chuẩn hóa SOP · KPI',
    body: 'Lần đầu đảm nhiệm vai trò Trưởng phòng CSKH quy mô nhỏ, trực tiếp xây dựng cơ cấu vận hành, chuẩn hóa quy trình SOP, thiết lập KPI và phối hợp liên phòng ban.',
    icon: 'tv',
    accent: '#7c3aed',
  },
  {
    id: '2013',
    title: 'Năm 2013 – Trưởng phòng cấp cao tại Garena (VED)',
    roleTier: 'Trưởng phòng cấp cao (129 nhân sự)',
    sector: 'Game / eSports · TMĐT (Shopee) · Ví AirPay · Gcafe',
    skillsFocus: 'Quản lý cấp trung · Quy trình đa ngành · Đào tạo kế thừa · Xây dựng hệ thống',
    body: 'Điều hành trực tiếp 129 nhân sự với tốc độ tăng trưởng cao cùng LMHT, Liên Quân Mobile, Shopee, AirPay và Gcafe. Xây dựng đội ngũ quản lý cấp trung, đào tạo nhân lực kế thừa và chuẩn hóa hệ thống CSKH đa lĩnh vực từ giai đoạn khởi đầu.',
    icon: 'rocket',
    accent: '#ea580c',
    fullWidth: true,
  },
  {
    id: '2016',
    title: 'Năm 2016 – Prudential Việt Nam',
    roleTier: 'Quản lý cấp cao Trải nghiệm Khách hàng',
    sector: 'Bảo hiểm Nhân thọ & Tài chính',
    skillsFocus: 'Quản trị trải nghiệm · Kiểm soát chất lượng · Đào tạo đồng cảm',
    body: 'Phát triển hệ thống CSKH trong ngành bảo hiểm đòi hỏi độ chính xác, minh bạch và tin cậy cao; hoàn thiện quy trình chăm sóc đa điểm chạm và nâng chuẩn chất lượng dịch vụ.',
    icon: 'shield-check',
    accent: '#e11d48',
  },
  {
    id: '2018',
    title: 'Năm 2018 – Trưởng phòng cấp cao tại Ví MoMo',
    roleTier: 'Trưởng phòng cấp cao (60+ NS nội bộ & BPO)',
    sector: 'Ví điện tử & Fintech (30M+ người dùng)',
    skillsFocus: 'Xây dựng hệ thống số · Quản trị BPO · Tự động hóa AI/CRM',
    body: 'Mở rộng điều hành CSKH tài chính số quy mô lớn, tích hợp CRM/Chatbot AI và chuẩn hóa quy trình phối hợp BPO nhằm tăng tốc xử lý và tối ưu trải nghiệm người dùng.',
    icon: 'credit-card',
    accent: '#db2777',
  },
  {
    id: '2023',
    title: 'Năm 2023 – Ví ECO (Finviet) & Tư vấn Hệ thống CX',
    roleTier: 'Trưởng phòng CSKH Cấp cao (100–150+ NS)',
    sector: 'Tài chính số · Thanh toán · Công nghệ AI & CX',
    skillsFocus: 'Quản trị toàn diện · Hệ sinh thái 12 phân hệ · Đào tạo & Quy trình',
    body: 'Hoàn thiện mô hình hệ thống CSKH hiện đại kết hợp quy trình chuẩn, đào tạo đội ngũ và công nghệ AI/BI, sẵn sàng dẫn dắt khối dịch vụ khách hàng đa lĩnh vực quy mô lớn.',
    icon: 'wallet',
    accent: '#059669',
    fullWidth: true,
  },
];

const PDF_OPEN_LETTER_PRINCIPLES = [
  { id: '1', text: 'Quy trình tạo nền tảng.', icon: 'layers', accent: '#0284c7' },
  { id: '2', text: 'Con người tạo giá trị.', icon: 'users', accent: '#059669' },
  { id: '3', text: 'Công nghệ tạo đòn bẩy.', icon: 'cpu', accent: '#7c3aed' },
];

const PDF_TOC_SECTIONS = [
  { id: 'cv-section-01-home', label: '01 · Tổng quan', icon: 'home' },
  { id: 'cv-section-02-letter', label: '02 · Thư ngỏ', icon: 'mail' },
  { id: 'cv-section-03-about', label: '03 · Giới thiệu', icon: 'user-round' },
  { id: 'cv-section-04-education', label: '04 · Học vấn', icon: 'graduation' },
  { id: 'cv-section-05-services', label: '05 · Dịch vụ', icon: 'heart-handshake' },
  { id: 'cv-section-06-experience', label: '06 · Kinh nghiệm', icon: 'briefcase' },
  { id: 'cv-section-07-skills', label: '07 · Kỹ năng', icon: 'brain' },
  { id: 'cv-section-08-projects', label: '08 · Dự án', icon: 'folder' },
  { id: 'cv-section-09-systems', label: '09 · Hệ thống', icon: 'server' },
];

export const PdfView: React.FC<PdfViewProps> = ({ onShowNotification, onNavigateTab }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('cv-section-01-home');
  const containerRef = useRef<HTMLDivElement>(null);
  const tocMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTocOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (tocMenuRef.current && !tocMenuRef.current.contains(event.target as Node)) {
        setIsTocOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTocOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isTocOpen]);

  const handlePrintOrExport = (mode: 'print' | 'download') => {
    SoundEngine.playTap();
    setIsExporting(true);

    if (onShowNotification) {
      onShowNotification(
        mode === 'download'
          ? 'Đang chuẩn bị file PDF hồ sơ... Trong hộp thoại in, hãy chọn "Save as PDF" (Lưu dưới dạng PDF).'
          : 'Đang mở hộp thoại in tài liệu CV Portfolio chuẩn A4...'
      );
    }

    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 250);
  };

  const experienceList = Object.values(EXPERIENCE_MILESTONES);

  return (
    <div
      ref={containerRef}
      id="pdf-page-container"
      data-main-card="true"
      data-floating-surface="main"
      data-element-name="Trang Website CV Portfolio Landing Page"
      data-element-type="container"
      data-element-page="pdf"
      data-element-parent="global-content-viewport"
      style={{
        gap: '15px',
      }}
      className="main-card page-main-card floating-glass-surface floating-surface--main w-full min-w-0 h-auto min-h-full mx-auto flex flex-col justify-start p-[15px] gap-[15px] overflow-visible font-play select-text text-left text-[var(--text-primary)] rounded-[14px] box-border"
    >
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
          }
          #website-root,
          #global-content-viewport,
          .tab-content-host,
          #pdf-page-container {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          #app-header,
          #app-header-container,
          #app-footer,
          #el-p0-div-98,
          #global-wallpaper-layer,
          .pdf-toolbar,
          .no-print {
            display: none !important;
          }
          .cv-portfolio-container {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .break-after-avoid {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          #pdf-page-container .print-card-bg,
          #pdf-page-container [data-section-card="true"].print-card-bg,
          #pdf-page-container [data-subcard="true"].print-card-bg,
          #pdf-page-container .nested-card.print-card-bg {
            background: #f8fafc !important;
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
          }
        }

        .shimmer-title {
          color: var(--text-heading, currentColor);
          display: inline-block;
        }
      `}</style>

      {/* THANH ĐIỀU KHIỂN XUẤT TẢI PDF (Mẫu Thẻ 27 Bento Studio: Bộ Nhận Diện Tài Nguyên) */}
      <header
        id="pdf-hero-banner"
        data-element-name="Banner card PDF"
        data-element-type="banner-card"
        data-section-card="true"
        data-has-compact-menu="true"
        className="pdf-toolbar banner-card hero-banner group no-print w-full max-w-[1250px] mx-auto mb-4 p-[15px] sm:p-5 rounded-[14px] relative overflow-hidden border text-[var(--text-primary)] flex flex-col gap-3 shrink-0 z-30 transition-all duration-300 shadow-xl"
      >
        {/* Bento Studio glowing ambient orb */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div
          className="project-detail-banner-media no-print absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
        >
          <BannerBackgroundVideo
            src={DRIVE_BANNER_VIDEOS.experience}
            poster={DRIVE_AVATARS.hungThai}
            alt="Banner Hồ sơ năng lực & CV Portfolio"
          />
        </div>
        <div className="project-detail-banner-scrim no-print absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

        <div className="banner-header-row relative z-10 flex items-center justify-between gap-3 flex-wrap w-full">
          <div className="card-header-sync flex items-center gap-2.5 min-w-0 text-blue-600 dark:text-sky-400">
            <WebIcon name="file-text" className="w-[22px] h-[22px] shrink-0" />
            <div className="flex flex-col min-w-0">
              <h1 className="typo-h3 card-title-synced font-bold font-play leading-tight text-blue-600 dark:text-sky-400 truncate m-0" data-card-title="true">
                Hồ sơ năng lực
              </h1>
              <span className="text-[11px] font-medium text-[var(--text-muted)] truncate">
                Tài liệu CV Portfolio chuẩn in ấn A4
              </span>
            </div>
          </div>

          <div className="banner-desktop-controls flex flex-1 items-center justify-between gap-2.5 flex-wrap min-w-0">
            {/* Mục lục thu gọn thành 1 nút nằm gần Hồ sơ năng lực */}
            <div ref={tocMenuRef} className="relative inline-block text-left shrink-0 z-30">
              <button
                id="pdf-toc-toggle-btn"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setIsTocOpen((prev) => !prev);
                }}
                aria-expanded={isTocOpen}
                aria-haspopup="menu"
                aria-label="Mục lục điều hướng nhanh 9 phần"
                title="Mục lục 9 phần CV"
                className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-all cursor-pointer typo-button font-play shrink-0 border border-white/10 hover:border-white/20 shadow-xs"
              >
                <WebIcon name="list" size={15} className="text-blue-600 dark:text-sky-400 shrink-0" />
                <span>Mục lục</span>
                <span className="banner-count-pill px-2 py-0.5 rounded-full typo-badge font-mono">
                  9
                </span>
                <WebIcon
                  name="chevron-down"
                  size={14}
                  className={cn(
                    'text-blue-600 dark:text-sky-400 transition-transform duration-200 shrink-0',
                    isTocOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {isTocOpen && (
                  <motion.div
                    id="pdf-toc-dropdown-menu"
                    role="menu"
                    aria-label="Mục lục các phần CV"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="banner-dropdown-menu dropdown-menu-enter absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-[min(280px,calc(100vw-48px))] rounded-[14px] p-2 z-50 flex flex-col gap-1 shadow-2xl backdrop-blur-md"
                  >
                    <div className="px-2.5 py-1 typo-label text-[var(--text-muted)] tracking-wider border-b border-[var(--border-subcard)] mb-1">
                      Mục lục 9 phần CV
                    </div>
                    {PDF_TOC_SECTIONS.map((sec) => {
                      const isCurrent = activeSectionId === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          role="menuitem"
                          data-selected={isCurrent ? 'true' : 'false'}
                          onClick={() => {
                            SoundEngine.playTap();
                            setActiveSectionId(sec.id);
                            setIsTocOpen(false);
                            document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="theme-dropdown-option flex items-center justify-between gap-2 w-full px-3 py-2 rounded-[14px] typo-nav font-play text-left transition-all cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-2 min-w-0">
                            <WebIcon name={sec.icon} size={14} className="shrink-0" />
                            <span className="truncate">{sec.label}</span>
                          </span>
                          {isCurrent && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-end gap-2.5 shrink-0 flex-wrap ml-auto">
              <button
                type="button"
                onClick={() => handlePrintOrExport('download')}
                disabled={isExporting}
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                className="banner-primary-cta inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full typo-button font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 shadow-md hover:scale-[1.02] active:scale-95"
                title="Tải tệp CV Portfolio dưới dạng PDF"
              >
                <WebIcon name="download" size={16} />
                <span>Tải PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  if (onNavigateTab) {
                    onNavigateTab(0);
                  } else {
                    window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 0, slide: 0 } }));
                  }
                }}
                className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full typo-button font-bold transition-all duration-200 cursor-pointer shrink-0 border border-white/10 hover:border-white/20 shadow-xs"
                title="Trở về Trang chủ"
              >
                <WebIcon name="arrow-left" size={15} />
                <span>Trở về</span>
              </button>
            </div>
          </div>

          <CompactBannerMenu
            id="pdf-compact-menu-btn"
            label="Điều khiển"
            ariaLabel="Mục lục và xuất PDF hồ sơ"
          >
            {(closeMenu) => (
              <>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handlePrintOrExport('download');
                      closeMenu();
                    }}
                    disabled={isExporting}
                    style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                    className="banner-primary-cta h-9 w-full inline-flex items-center justify-center gap-2 px-4 rounded-full typo-button font-bold cursor-pointer disabled:opacity-60"
                  >
                    <WebIcon name="download" size={15} />
                    <span>Tải PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      closeMenu();
                      if (onNavigateTab) {
                        onNavigateTab(0);
                      } else {
                        window.dispatchEvent(new CustomEvent('app:set-slide', { detail: { tabIndex: 0, slide: 0 } }));
                      }
                    }}
                    className="banner-control-pill h-9 w-full inline-flex items-center justify-center gap-1.5 px-3.5 rounded-full typo-button font-bold cursor-pointer"
                  >
                    <WebIcon name="arrow-left" size={15} />
                    <span>Trở về Trang chủ</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 pt-2 border-t border-[var(--border-subcard)]">
                  <span className="typo-label text-[var(--text-muted)] px-1">
                    Mục lục 9 phần CV
                  </span>
                  {PDF_TOC_SECTIONS.map((sec) => {
                    const isCurrent = activeSectionId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        data-selected={isCurrent ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playTap();
                          setActiveSectionId(sec.id);
                          closeMenu();
                          document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="theme-dropdown-option flex items-center justify-between gap-2 w-full px-3 py-1.5 rounded-[14px] typo-nav font-play text-left transition-all cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <WebIcon name={sec.icon} size={14} className="shrink-0" />
                          <span className="truncate">{sec.label}</span>
                        </span>
                        {isCurrent && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </CompactBannerMenu>
        </div>
      </header>

      {/* PHẦN 01 – TỔNG QUAN NĂNG LỰC */}
      <section id="cv-section-01-home" className="w-full flex flex-col break-inside-avoid">
        <div
          data-section-card="true"
          className="bento-card glass-card flex flex-col gap-5 p-5 rounded-[14px] print-card-bg"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-blue-600 dark:text-sky-400 min-w-0">
              <WebIcon name="home" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-blue-600 dark:text-sky-400 truncate" data-card-title="true">
                Tổng quan năng lực
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-blue-500/15 text-blue-700 dark:text-blue-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              01/09
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
              <div
                style={{ borderRadius: 'var(--radius-card, 14px)' }}
                className="relative w-44 h-44 sm:w-48 sm:h-48 overflow-hidden ring-4 ring-[var(--border-subcard)] shadow-xl"
              >
              <img
                src={DRIVE_AVATARS.hungThai}
                alt="Nguyễn Hùng Thái - Chuyên Gia Vận Hành CSKH"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-[inherit]"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sẵn sàng đảm nhận vai trò quản trị
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-3 text-left">
            <div>
              <span className="typo-label font-bold tracking-wider text-blue-600 dark:text-cyan-400">
                Hồ sơ cá nhân & Năng lực quản trị
              </span>
              <h1 className="typo-h1 font-bold font-play text-[var(--text-primary)] mt-0.5">
                Nguyễn Hùng Thái
              </h1>
              <p className="typo-h4 font-semibold text-cyan-700 dark:text-cyan-300 mt-1">
                Chuyên Gia Vận Hành CSKH & Chuyển Đổi Số · CX & Operations Director
              </p>
            </div>

            <p className="typo-body text-[var(--text-secondary)] leading-relaxed font-medium">
              Với hơn <strong>22 năm kinh nghiệm thực chiến</strong> trong việc kiến tạo, chuẩn hóa quy trình và điều hành các hệ thống Contact Center quy mô lớn tại các doanh nghiệp hàng đầu (Viễn thông, Thương mại điện tử, Tài chính bảo hiểm, Thanh toán điện tử).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-bold text-blue-600 dark:text-cyan-400 font-play">22+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Năm kinh nghiệm</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-bold text-emerald-600 dark:text-emerald-400 font-play">100+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Dự án chuyển đổi</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-bold text-amber-600 dark:text-amber-400 font-play">98%+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Hài lòng CSAT</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-bold text-purple-600 dark:text-purple-400 font-play">500+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Nhân sự dẫn dắt</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div data-subcard="true" className="sub-card p-3.5 rounded-[14px] print-card-bg flex flex-col gap-1 break-inside-avoid">
                <span className="typo-label font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <WebIcon name="headphones" size={14} />
                  <span>Vận hành Contact Center</span>
                </span>
                <p className="typo-caption text-[var(--text-secondary)]">
                  Thiết lập hệ thống tổng đài đa kênh, chuẩn hóa SOP, SLA, FCR và tối ưu hiệu suất vận hành quy mô lớn.
                </p>
              </div>
              <div data-subcard="true" className="sub-card p-3.5 rounded-[14px] print-card-bg flex flex-col gap-1 break-inside-avoid">
                <span className="typo-label font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <WebIcon name="cpu" size={14} />
                  <span>Chuyển đổi số & AI CRM</span>
                </span>
                <p className="typo-caption text-[var(--text-secondary)]">
                  Ứng dụng AI Chatbot, CRM hiện đại, Dashboard phân tích dữ liệu và tự động hóa quy trình nghiệp vụ.
                </p>
              </div>
              <div data-subcard="true" className="sub-card p-3.5 rounded-[14px] print-card-bg flex flex-col gap-1 break-inside-avoid">
                <span className="typo-label font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <WebIcon name="users" size={14} />
                  <span>Quản trị & Phát triển con người</span>
                </span>
                <p className="typo-caption text-[var(--text-secondary)]">
                  Xây dựng đội ngũ gắn kết, đào tạo nhân sự chuyên nghiệp, lấy khách hàng làm trung tâm phục vụ.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* PHẦN 02 – THƯ NGỎ */}
      <section id="cv-section-02-letter" className="w-full flex flex-col">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400 min-w-0">
              <WebIcon name="mail" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-cyan-600 dark:text-cyan-400 truncate" data-card-title="true">
                Thư ngỏ
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              02/09
            </span>
          </div>
          <div className="flex flex-col gap-2 break-inside-avoid">
            <h3 className="typo-h3 card-header-sync card-title-synced font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2" data-card-title="true">
              <WebIcon name="sparkles" className="w-5 h-5 shrink-0" />
              <span>Kính chào Quý Công ty!</span>
            </h3>
            <p className="typo-body text-[var(--text-secondary)] leading-relaxed">
              Tôi là Nguyễn Hùng Thái, Trưởng phòng Chăm sóc Khách hàng với hơn 22 năm kinh nghiệm trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.
            </p>
          </div>

          {/* Tóm tắt 3 trụ cột phát triển năng lực trong Hồ sơ năng lực */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 break-inside-avoid">
            <div data-subcard="true" className="sub-card p-3.5 rounded-[14px] print-card-bg flex flex-col gap-1 min-w-0">
              <span className="typo-label font-bold text-blue-600 dark:text-sky-400 flex items-center gap-1.5">
                <WebIcon name="trending-up" size={14} className="shrink-0" />
                <span>Thăng tiến cấp bậc</span>
              </span>
              <p className="typo-caption text-[var(--text-secondary)] leading-relaxed">
                Nhân viên CSKH (2002) → Giám sát (2007) → Trưởng phòng quy mô nhỏ (2011) → Trưởng phòng quản lý cấp cao 129–150+ nhân sự (2013–2026+).
              </p>
            </div>
            <div data-subcard="true" className="sub-card p-3.5 rounded-[14px] print-card-bg flex flex-col gap-1 min-w-0">
              <span className="typo-label font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <WebIcon name="layers" size={14} className="shrink-0" />
                <span>Kinh nghiệm đa lĩnh vực</span>
              </span>
              <p className="typo-caption text-[var(--text-secondary)] leading-relaxed">
                Viễn thông di động &amp; quốc tế · Truyền hình Cáp · Game/eSports · TMĐT (Shopee) · Ví điện tử (AirPay, MoMo, Ví ECO) · Bảo hiểm · AI &amp; CX.
              </p>
            </div>
            <div data-subcard="true" className="sub-card p-3.5 rounded-[14px] print-card-bg flex flex-col gap-1 min-w-0">
              <span className="typo-label font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <WebIcon name="award" size={14} className="shrink-0" />
                <span>4 Kỹ năng trọng tâm</span>
              </span>
              <p className="typo-caption text-[var(--text-secondary)] leading-relaxed">
                Quản lý đội ngũ đa cấp · Chuẩn hóa quy trình SOP/SLA · Đào tạo &amp; phát triển nhân sự kế thừa · Xây dựng hệ thống công nghệ CX/CRM.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PDF_OPEN_LETTER_MILESTONES.map((item) => (
              <article
                key={item.id}
                data-subcard="true"
                className={cn(
                  'sub-card p-4 rounded-[14px] shadow-sm print-card-bg flex flex-col gap-2 min-w-0 break-inside-avoid',
                  item.fullWidth && 'md:col-span-2'
                )}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <h4
                    className="typo-h5 subcard-header-sync subcard-title-synced font-bold flex items-center gap-2 min-w-0 break-words"
                    style={{ color: item.accent }}
                    data-subcard-title="true"
                  >
                    <WebIcon name="briefcase" className="w-4 h-4 shrink-0" style={{ color: item.accent }} />
                    <span className="break-words">{item.title}</span>
                  </h4>
                  <p className="typo-label text-[var(--text-muted)] font-semibold break-words">
                    <span className="text-[var(--text-primary)]">{item.roleTier}</span>
                    <span> · {item.sector}</span>
                    <span> · {item.skillsFocus}</span>
                  </p>
                </div>
                <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed break-words">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <div
            data-subcard="true"
            className="sub-card p-4 rounded-[14px] shadow-sm print-card-bg flex flex-col gap-3 min-w-0 break-inside-avoid"
          >
            <h4
              className="typo-h4 subcard-header-sync subcard-title-synced font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
              data-subcard-title="true"
            >
              <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />
              <span>Triết lý quản trị</span>
            </h4>
            <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed break-words">
              Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững. Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PDF_OPEN_LETTER_PRINCIPLES.map((principle) => (
                <div
                  key={principle.id}
                  className="p-3 rounded-[14px] border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] flex items-center gap-2.5 min-w-0 print-card-bg"
                >
                  <span
                    className="w-7 h-7 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${principle.accent}1a`, color: principle.accent }}
                  >
                    <WebIcon name={principle.icon} size={15} style={{ color: principle.accent }} />
                  </span>
                  <span className="typo-body-sm font-bold text-[var(--text-primary)] break-words">
                    {principle.text}
                  </span>
                </div>
              ))}
            </div>

            <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed break-words">
              Từ đó, tôi tập trung xây dựng các hệ thống CRM, Dashboard quản trị, AI Chatbot và các giải pháp tự động hóa, nhằm nâng cao hiệu quả vận hành, tối ưu trải nghiệm khách hàng và hỗ trợ nhà quản lý ra quyết định bằng dữ liệu. Bên cạnh công nghệ, tôi luôn xem con người là yếu tố quyết định thành công. Vì vậy, tôi chú trọng đào tạo đội ngũ biết lắng nghe, thấu hiểu và mang đến những trải nghiệm vượt mong đợi cho khách hàng. Tôi luôn tâm niệm:
            </p>

            <blockquote className="px-4 py-2.5 rounded-[14px] border border-[var(--border-subcard)] bg-cyan-500/10 text-[var(--text-primary)] font-semibold italic typo-body-sm leading-relaxed">
              &ldquo;Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.&rdquo;
            </blockquote>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-[var(--border-subcard)] break-inside-avoid">
            <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed">
              Tôi mong muốn được đồng hành cùng Quý Công ty trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững.
            </p>
            <p className="typo-body-sm font-bold text-cyan-700 dark:text-cyan-300">
              Xin trân trọng cảm ơn Quý Công ty đã dành thời gian lắng nghe!
            </p>
          </div>
        </div>
      </section>

      {/* PHẦN 03 – GIỚI THIỆU BẢN THÂN */}
      <section id="cv-section-03-about" className="w-full flex flex-col break-inside-avoid">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 min-w-0">
              <WebIcon name="user-round" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-emerald-600 dark:text-emerald-400 truncate" data-card-title="true">
                Giới thiệu bản thân
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              03/09
            </span>
          </div>

          {/* Thông tin cá nhân đầy đủ (có icon trước tiêu đề mỗi sub-card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PERSONAL_DEMOGRAPHICS.map((item) => {
              const iconColor = DEMO_ICON_COLORS[item.id] || '#059669';
              const iconName = getDemoIconName(item.iconName);
              const isExternalLink = item.type === 'link' || item.type === 'email';

              return (
                <div
                  key={item.id}
                  data-subcard="true"
                  className="sub-card p-3 rounded-[14px] flex flex-col justify-between gap-1.5 print-card-bg min-w-0 break-inside-avoid"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <WebIcon name={iconName} size={14} className="shrink-0" style={{ color: iconColor }} />
                    <span className="typo-label font-bold leading-tight truncate" style={{ color: iconColor }}>
                      {item.labelVi}
                    </span>
                  </div>
                  <div className="min-w-0">
                    {isExternalLink && item.href ? (
                      <a
                        href={item.href}
                        target={item.type === 'link' ? '_blank' : undefined}
                        rel={item.type === 'link' ? 'noopener noreferrer' : undefined}
                        className="typo-body-sm font-semibold text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-cyan-400 transition-colors break-all block leading-snug"
                      >
                        {item.valueVi}
                      </a>
                    ) : (
                      <span className="typo-body-sm font-semibold text-[var(--text-primary)] break-words block leading-snug">
                        {item.valueVi}
                      </span>
                    )}
                    {item.subtitleVi && (
                      <span className="typo-label text-[var(--text-muted)] block mt-0.5 leading-snug break-words">
                        {item.subtitleVi}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 04 – HỌC VẤN & BẰNG CẤP */}
      {/* ========================================================================= */}
      <section id="cv-section-04-education" className="w-full flex flex-col break-inside-avoid">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-purple-600 dark:text-purple-400 min-w-0">
              <WebIcon name="graduation-cap" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-purple-600 dark:text-purple-400 truncate" data-card-title="true">
                Học vấn bằng cấp
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-purple-500/15 text-purple-700 dark:text-purple-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              04/09
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {EDUCATION_COURSES.map((course, idx) => {
              const cardColor = getCourseColor(course, idx);
              return (
                <div
                  key={course.id}
                  data-subcard="true"
                  className="sub-card p-4 rounded-[14px] flex flex-col justify-between gap-2.5 break-inside-avoid print-card-bg relative overflow-hidden"
                  style={{ border: `1.5px solid ${cardColor}45` }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 font-bold" style={{ color: cardColor }}>
                        <WebIcon name="calendar" size={14} />
                        <span className="typo-label font-mono">Năm {course.year}</span>
                      </div>
                      {course.code && (
                        <span className="typo-badge font-mono font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: `${cardColor}15`, color: cardColor, borderColor: `${cardColor}40` }}>
                          {course.code}
                        </span>
                      )}
                    </div>

                    <div className="subcard-header-sync flex items-start gap-2" style={{ color: cardColor }}>
                      <WebIcon name="award" className="w-4 h-4 shrink-0 mt-1" style={{ color: cardColor }} />
                      <h3 className="typo-h4 subcard-title-synced font-bold leading-snug" data-subcard-title="true" style={{ color: cardColor }}>
                        {course.title}
                      </h3>
                    </div>

                    <div className="space-y-1 mt-2.5 pt-2 border-t border-[var(--border-subcard)] typo-caption">
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-[var(--text-muted)] shrink-0">Đơn vị:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{course.issuer}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="font-bold text-[var(--text-muted)] shrink-0">Hình thức đào tạo:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{course.type}</span>
                      </div>
                    </div>

                    <p className="typo-caption text-[var(--text-secondary)] mt-2 line-clamp-3 leading-relaxed">
                      {course.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 05 – DỊCH VỤ TRỌNG TÂM */}
      {/* ========================================================================= */}
      <section id="cv-section-05-services" className="w-full flex flex-col break-inside-avoid">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-amber-600 dark:text-amber-400 min-w-0">
              <WebIcon name="heart-handshake" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-amber-600 dark:text-amber-400 truncate" data-card-title="true">
                Dịch vụ trọng tâm
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-amber-500/15 text-amber-700 dark:text-amber-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              05/09
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DOMAINS_DATA.map((domain) => {
              const accentColor = SERVICE_ACCENT_COLORS[domain.color] || '#0d9488';

              return (
                <div
                  key={domain.id}
                  data-subcard="true"
                  className="sub-card p-4 rounded-[14px] flex flex-col justify-between gap-3 break-inside-avoid shadow-sm print-card-bg min-w-0"
                >
                  <div className="subcard-header-sync flex items-start gap-2 min-w-0" style={{ color: accentColor }}>
                    <WebIcon name="layers" className="w-4 h-4 shrink-0 mt-1" style={{ color: accentColor }} />
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h4 subcard-title-synced font-bold leading-tight break-words" data-subcard-title="true" style={{ color: accentColor }}>
                        {domain.title}
                      </h3>
                      <p className="typo-caption text-[var(--text-secondary)] font-medium mt-0.5 leading-snug break-words">
                        {domain.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--border-subcard)] typo-label min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--text-secondary)] shrink-0">Đơn vị:</span>
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {domain.companyLogos && domain.companyLogos.length > 0 ? (
                          domain.companyLogos.map((partner, pIdx) => {
                            const logoSrc =
                              partner.logo.toLowerCase().includes('.gif') && partner.fallbackLogo
                                ? partner.fallbackLogo
                                : partner.logo;
                            return (
                              <div
                                key={pIdx}
                                className="company-logo-surface w-7 h-7 rounded-full overflow-hidden p-0 border border-[var(--border-subcard)] shadow-xs flex items-center justify-center shrink-0"
                                title={partner.name}
                              >
                                <img
                                  src={logoSrc}
                                  alt={partner.name}
                                  loading="lazy"
                                  decoding="async"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover rounded-full p-0"
                                  onError={(e) => {
                                    if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                                      e.currentTarget.src = partner.fallbackLogo;
                                    } else {
                                      e.currentTarget.style.display = 'none';
                                    }
                                  }}
                                />
                              </div>
                            );
                          })
                        ) : (
                          <span className="font-medium text-blue-600 dark:text-cyan-400 text-right break-words">
                            {domain.typicalEntitiesLine}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 06 – KINH NGHIỆM */}
      {/* ========================================================================= */}
      <section id="cv-section-06-experience" className="w-full flex flex-col break-inside-avoid">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-blue-600 dark:text-sky-400 min-w-0">
              <WebIcon name="briefcase" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-blue-600 dark:text-sky-400 truncate" data-card-title="true">
                Kinh nghiệm công tác
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-blue-500/15 text-blue-700 dark:text-blue-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              06/09
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
            {experienceList.map((m) => {
              const formattedPeriod = (m.cardYearLabel === '2003 - 2007' || m.year === '2003')
                ? 'Từ năm 2003 đến năm 2007'
                : m.period;
              const rawColor = m.hexColor || '#2563EB';
              const expAccentColor =
                rawColor.toUpperCase() === '#FFB300'
                  ? '#d97706'
                  : rawColor.toUpperCase() === '#00C853'
                  ? '#059669'
                  : rawColor;
              const rawFields = [
                m.tag,
                ...(m.industry ? m.industry.split('/').map((s) => s.trim()) : []),
              ].filter(Boolean);
              const seenFields = new Set<string>();
              const fieldTags = rawFields.filter((item) => {
                const norm = item.toLowerCase();
                if (seenFields.has(norm)) return false;
                seenFields.add(norm);
                return true;
              });

              return (
                <div
                  key={m.key}
                  data-subcard="true"
                  className="sub-card p-4 rounded-[14px] flex flex-col justify-between gap-2.5 break-inside-avoid print-card-bg relative transition-all min-w-0"
                >
                  {/* Sub-card 1: Thời gian, Logo & Tên công ty */}
                  <div className="nested-card border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] p-3 rounded-[14px] flex flex-col gap-2 print-card-bg min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-blue-600 text-white font-bold font-play typo-badge">
                        {formattedPeriod}
                      </span>
                      {m.logo && (
                        <div className="company-logo-surface w-7 h-7 rounded-[8px] overflow-hidden border border-[var(--border-subcard)] p-0.5 shrink-0 flex items-center justify-center">
                          <img src={m.logo} alt={m.company} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-contain rounded-[inherit]" />
                        </div>
                      )}
                    </div>

                    <div className="subcard-header-sync flex items-center gap-2 min-w-0" style={{ color: expAccentColor }}>
                      <WebIcon name="building-2" className="w-4 h-4 shrink-0" style={{ color: expAccentColor }} />
                      <div className="min-w-0 flex-1">
                        <h3 className="typo-h4 subcard-title-synced font-bold leading-snug break-words" data-subcard-title="true" style={{ color: expAccentColor }}>
                          {m.company}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Sub-card 2: Vị trí & Quy mô nhân sự nằm dưới Vị trí */}
                  <ul className="nested-card border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] p-3 rounded-[14px] flex flex-col gap-1.5 print-card-bg min-w-0 list-none m-0">
                    <li className="typo-body-sm font-bold leading-snug flex items-center gap-1.5 min-w-0" style={{ color: expAccentColor }}>
                      <WebIcon name="briefcase" size={14} className="shrink-0" style={{ color: expAccentColor }} />
                      <span className="typo-body-sm break-words">Vị trí: {m.roleTitle}</span>
                    </li>
                    <li className="typo-body-sm font-medium text-purple-600 dark:text-purple-400 leading-snug flex items-center gap-1.5 min-w-0">
                      <WebIcon name="user-group" size={14} className="shrink-0 text-purple-600 dark:text-purple-400" />
                      <span className="typo-body-sm break-words">Quy mô nhân sự: {m.scaleDesc || `${m.headcount} nhân sự trực tiếp`}</span>
                    </li>
                  </ul>

                  {/* Sub-card 3: Thẻ Lĩnh vực riêng dạng tag */}
                  <div className="nested-card border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] p-3 rounded-[14px] flex flex-col gap-2 print-card-bg min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <WebIcon name="layers" size={14} className="shrink-0" style={{ color: expAccentColor }} />
                      <span className="typo-body-sm font-bold leading-tight" style={{ color: expAccentColor }}>
                        Lĩnh vực
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                      {fieldTags.map((fieldTag, fIdx) => (
                        <span
                          key={fIdx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full typo-label font-semibold border"
                          style={{
                            backgroundColor: `${expAccentColor}14`,
                            color: expAccentColor,
                            borderColor: `${expAccentColor}35`,
                          }}
                        >
                          {fieldTag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sub-card 4: Mô tả & Nhiệm vụ trọng tâm (List format với cỡ chữ đồng nhất) */}
                  <ul className="nested-card border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] p-3 rounded-[14px] flex-1 flex flex-col gap-1.5 print-card-bg min-w-0 list-none m-0">
                    <li className="typo-body-sm text-[var(--text-secondary)] leading-relaxed break-words flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="typo-body-sm min-w-0 flex-1">{m.cardDescription || m.descVi || m.highlightText}</span>
                    </li>

                    {m.tasks && m.tasks.length > 0 && (
                      <>
                        <li className="typo-body-sm font-bold text-[var(--text-primary)] pt-1.5 mt-0.5 border-t border-[var(--border-subcard)] break-words">
                          Nhiệm vụ &amp; Trọng tâm vận hành:
                        </li>
                        {m.tasks.slice(0, 3).map((task: any, idx: number) => (
                          <li key={idx} className="typo-body-sm text-[var(--text-secondary)] leading-relaxed break-words flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
                            <span className="typo-body-sm min-w-0 flex-1">{task}</span>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 07 – KỸ NĂNG */}
      {/* ========================================================================= */}
      <section id="cv-section-07-skills" className="w-full flex flex-col break-inside-avoid">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 text-rose-600 dark:text-rose-400 min-w-0">
              <WebIcon name="brain" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-rose-600 dark:text-rose-400 truncate" data-card-title="true">
                Kỹ năng chuyên môn
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-[8px] bg-rose-500/15 text-rose-700 dark:text-rose-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              07/09
            </span>
          </div>

          {/* 4 thẻ kỹ năng SWOT hiển thị trên 4 cột */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
            {[
              { key: 'S', icon: 'shield-check', title: 'Thế mạnh cốt lõi', data: STRENGTHS_DATA, color: '#1480C0' },
              { key: 'W', icon: 'trending-up', title: 'Khía cạnh hoàn thiện', data: WEAKNESSES_DATA, color: '#50B347' },
              { key: 'O', icon: 'rocket', title: 'Cơ hội phát triển', data: OPPORTUNITIES_DATA, color: '#EC7D21' },
              { key: 'T', icon: 'alert-triangle', title: 'Thách thức thích ứng', data: THREATS_DATA, color: '#E64C72' },
            ].map((quad) => (
              <div
                key={quad.key}
                data-subcard="true"
                style={{ border: `1.5px solid ${quad.color}40` }}
                className="sub-card p-3.5 rounded-[14px] flex flex-col gap-3 break-inside-avoid print-card-bg min-w-0"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-2 gap-2">
                  <div className="subcard-header-sync flex items-center gap-2 min-w-0" style={{ color: quad.color }}>
                    <WebIcon name={quad.icon} className="w-4 h-4 shrink-0" style={{ color: quad.color }} />
                    <h3 className="typo-h4 subcard-title-synced font-bold truncate" data-subcard-title="true" style={{ color: quad.color }}>
                      {quad.title}
                    </h3>
                  </div>
                  <span className="typo-badge font-mono font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${quad.color}18`, color: quad.color }}>
                    {quad.key}
                  </span>
                </div>
                <div className="space-y-2">
                  {quad.data.map((skill) => (
                    <div key={skill.id} className="nested-card border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] p-2.5 rounded-[14px] space-y-1.5 print-card-bg min-w-0">
                      <div className="flex justify-between items-center gap-2 typo-caption font-bold">
                        <span className="text-[var(--text-primary)] truncate">{skill.labelVi}</span>
                        <span
                          className="font-mono font-bold shrink-0 tabular-nums"
                          style={{ color: quad.color }}
                          title={quad.key === 'T' ? 'Mức độ tác động' : undefined}
                        >
                          {quad.key === 'T' ? `Tác động ${skill.percent}%` : `${skill.percent}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--pillar-progress-track,rgba(148,163,184,0.28))] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${skill.percent}%`, backgroundColor: quad.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Thẻ Ngôn ngữ giao tiếp tách riêng một hàng phía dưới */}
          <div
            data-subcard="true"
            style={{ border: '1.5px solid #6366f140' }}
            className="sub-card w-full p-4 rounded-[14px] flex flex-col justify-between gap-3 break-inside-avoid print-card-bg min-w-0"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-2 gap-2">
              <div className="subcard-header-sync flex items-center gap-2 min-w-0 text-indigo-600 dark:text-indigo-400">
                <WebIcon name="languages" className="w-4 h-4 shrink-0" />
                <h3 className="typo-h4 subcard-title-synced font-bold text-indigo-600 dark:text-indigo-400 truncate" data-subcard-title="true">
                  Ngôn ngữ giao tiếp
                </h3>
              </div>
              <span className="typo-badge font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 shrink-0">
                {LANGUAGES_DATA.length} Ngôn ngữ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 items-stretch">
              {LANGUAGES_DATA.map((lang) => {
                const langHex = lang.id === 'vi' ? '#059669' : lang.id === 'en' ? '#0284c7' : '#7c3aed';

                return (
                  <div
                    key={lang.id}
                    className="nested-card border border-[var(--border-subcard)] bg-[var(--bg-nested-card)] p-3 rounded-[14px] flex flex-col justify-between gap-2.5 print-card-bg min-w-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="subcard-header-sync flex items-center gap-1.5 min-w-0" style={{ color: langHex }}>
                        <WebIcon name="globe" className="w-4 h-4 shrink-0" style={{ color: langHex }} />
                        <h4 className="typo-h5 subcard-title-synced font-bold truncate" data-subcard-title="true" style={{ color: langHex }}>
                          {lang.nameVi}
                        </h4>
                      </div>
                      <span className="font-mono font-bold typo-label shrink-0 tabular-nums" style={{ color: langHex }}>
                        {lang.percent}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="typo-label font-semibold text-[var(--text-secondary)] break-words">
                        {lang.roleVi || lang.levelVi}
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-[var(--pillar-progress-track,rgba(148,163,184,0.28))] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${lang.percent}%`, backgroundColor: langHex }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 08 – DỰ ÁN TRỌNG ĐIỂM (HÀNG RIÊNG, CHIA 2 CỘT) */}
      {/* ========================================================================= */}
      <section id="cv-section-08-projects" className="w-full min-w-0 flex flex-col">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 min-w-0 text-indigo-600 dark:text-indigo-400">
              <WebIcon name="folder" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-indigo-600 dark:text-indigo-400 truncate" data-card-title="true">
                Dự án trọng điểm
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="typo-label font-mono font-bold text-indigo-600 dark:text-indigo-300">
                {PROJECTS_DATA.length} dự án
              </span>
              <span className="px-2.5 py-0.5 rounded-[8px] bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 typo-badge font-bold font-mono tracking-wide">
                08/09
              </span>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROJECTS_DATA.map((p) => {
              const projColor =
                p.groupKey === 'strategy'
                  ? '#0284c7'
                  : p.groupKey === 'cx'
                  ? '#e11d48'
                  : p.groupKey === 'sop'
                  ? '#059669'
                  : p.groupKey === 'tech'
                  ? '#7c3aed'
                  : '#d97706';

              return (
                <li
                  key={p.id}
                  data-subcard="true"
                  className="sub-card p-3 rounded-[14px] flex items-start justify-between gap-2.5 min-w-0 break-inside-avoid print-card-bg"
                >
                  <div className="min-w-0 flex-1">
                    <div className="subcard-header-sync flex items-start gap-1.5 min-w-0" style={{ color: projColor }}>
                      <WebIcon name="folder" className="w-4 h-4 shrink-0 mt-0.5" style={{ color: projColor }} />
                      <h3
                        className="typo-h5 subcard-title-synced font-bold leading-snug break-words min-w-0"
                        data-subcard-title="true"
                        style={{ color: projColor }}
                      >
                        {p.title}
                      </h3>
                    </div>
                      <p className="typo-caption text-[var(--text-secondary)] mt-1 leading-relaxed break-words">
                        <span className="font-semibold text-[var(--text-primary)]">Vai trò: {p.role}</span> · {p.description}
                      </p>
                    </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 09 – HỆ THỐNG CÔNG NGHỆ (HÀNG RIÊNG, CHIA 2 CỘT) */}
      {/* ========================================================================= */}
      <section id="cv-section-09-systems" className="w-full min-w-0 flex flex-col">
        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid gap-2">
            <div className="card-header-sync flex items-center gap-2.5 min-w-0 text-teal-600 dark:text-teal-400">
              <WebIcon name="server" className="w-5 h-5 shrink-0" />
              <h2 className="typo-h2 card-title-synced font-bold font-play text-teal-600 dark:text-teal-400 truncate" data-card-title="true">
                Hệ thống công nghệ
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="typo-label font-mono font-bold text-teal-600 dark:text-teal-300">
                {ENTERPRISE_SYSTEMS_LIST.length} hệ thống
              </span>
              <span className="px-2.5 py-0.5 rounded-[8px] bg-teal-500/15 text-teal-700 dark:text-teal-300 typo-badge font-bold font-mono tracking-wide">
                09/09
              </span>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ENTERPRISE_SYSTEMS_LIST.map((sys) => {
              const rawColor = sys.themeColor || '#0284c7';
              const isLightFill = rawColor.toUpperCase() === '#FFDF25' || rawColor.toUpperCase() === '#A3D43A';
              const badgeTextColor = isLightFill ? '#0f172a' : '#ffffff';
              const iconColor =
                rawColor.toUpperCase() === '#FFDF25'
                  ? '#ca8a04'
                  : rawColor.toUpperCase() === '#A3D43A'
                  ? '#4d7c0f'
                  : rawColor;

              return (
                <li
                  key={sys.id}
                  data-subcard="true"
                  className="sub-card p-3 rounded-[14px] flex items-start justify-between gap-2.5 min-w-0 break-inside-avoid print-card-bg"
                >
                  <div className="flex items-start justify-between gap-2.5 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h5 subcard-header-sync subcard-title-synced font-bold leading-snug flex items-center gap-1.5 flex-wrap min-w-0" data-subcard-title="true" style={{ color: iconColor }}>
                        <WebIcon name="cpu" className="w-4 h-4 shrink-0" style={{ color: iconColor }} />
                        <span className="break-words" style={{ color: iconColor }}>
                          {sys.nameVi}
                        </span>
                        <span className="typo-label font-mono font-semibold text-[var(--text-muted)]">
                          ({sys.category})
                        </span>
                      </h3>
                      <p className="typo-caption text-[var(--text-secondary)] mt-1 leading-relaxed break-words">
                        {sys.descVi}
                      </p>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-md font-mono typo-badge font-bold shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: rawColor, color: badgeTextColor }}
                    >
                      {sys.code || sys.abbr}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-[var(--border-subcard)] flex flex-col sm:flex-row items-center justify-between gap-4 typo-label text-[var(--text-muted)] break-inside-avoid">
        <div className="text-center sm:text-left">
          <p className="font-bold text-[var(--text-primary)] font-play typo-body-sm">
            Nguyễn Hùng Thái · Chuyên Gia Vận Hành CSKH & Chuyển Đổi Số
          </p>
          <p className="mt-0.5">
            Email: hungthai84@gmail.com · Hotline/Zalo: +84 0909097882 · TP. Hồ Chí Minh, Việt Nam
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p>© 2026 Nguyễn Hùng Thái. Toàn bộ thông tin được bảo hộ bản quyền.</p>
          <p className="mt-0.5 typo-label">Tài liệu xuất bản từ website Portfolio Nguyễn Hùng Thái</p>
        </div>
      </footer>

      {/* Back to Top Floating Button (Đặt trực tiếp trong #pdf-page-container) */}
      <button
        id="pdf-back-to-top-btn"
        type="button"
        onClick={() => {
          const root = document.getElementById('website-root') || document.documentElement || document.body;
          if (root) root.scrollTo({ top: 0, behavior: 'smooth' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="theme-back-to-top-btn theme-back-to-top-icon no-print fixed bottom-[88px] right-4 sm:right-6 z-[9990] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer pointer-events-auto"
        title="Lên đầu trang"
        aria-label="Lên đầu trang"
      >
        <WebIcon name="chevron-up" className="w-5 h-5" />
      </button>
    </div>
  );
};

