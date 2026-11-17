'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { ABOUT_PROFILE_STATS, PERSONAL_DEMOGRAPHICS, SERVICE_PHILOSOPHY_VALUES } from '@/data/about';
import { EDUCATION_COURSES } from '@/data/education';
import { DOMAINS_DATA, DOMAINS_INTRO } from '@/data/domains';
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
  { id: 'mobifone', company: 'MobiFone', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842198/Kinh%20nghi%E1%BB%87m/Logo_Mobifone.png' },
  { id: 'v247', company: 'Viễn Liên V247', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842199/Kinh%20nghi%E1%BB%87m/Logo_V247.png' },
  { id: 'lbc', company: 'LBC – HTVC', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842200/Kinh%20nghi%E1%BB%87m/Logo_LBC.png' },
  { id: 'ved', company: 'VED (Garena / Shopee)', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842328/Kinh%20nghi%E1%BB%87m/Logo_VED.png' },
  { id: 'prudential', company: 'Prudential Việt Nam', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842246/Kinh%20nghi%E1%BB%87m/Logo_Prudential.png' },
  { id: 'momo', company: 'Ví MoMo', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842331/Kinh%20nghi%E1%BB%87m/Logo_Momo.png' },
  { id: 'finviet', company: 'Finviet (Ví ECO)', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842205/Kinh%20nghi%E1%BB%87m/Logo_Finviet.png' },
  { id: 'powerservice', company: 'Power Service', logo: 'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793842335/Kinh%20nghi%E1%BB%87m/Logo_PowerService.png' },
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
    body: 'Tôi bắt đầu sự nghiệp tại MobiFone, nơi tôi được đào tạo bài bản về dịch vụ khách hàng, quản lý tổng đài, xử lý sự cố và xây dựng quy trình phục vụ theo tiêu chuẩn ngành viễn thông. Đây là nền tảng giúp tôi hình thành tư duy lấy khách hàng làm trung tâm và hiểu rõ tầm quan trọng của quy trình trong vận hành dịch vụ.',
    icon: 'signal',
    accent: '#0284c7',
  },
  {
    id: '2007',
    title: 'Năm 2007 – Phát triển năng lực quản lý tại Viễn Liên V247',
    body: 'Gia nhập Viễn Liên V247, tôi tiếp tục phát triển năng lực quản lý đội ngũ, giám sát chất lượng dịch vụ và tối ưu hiệu quả vận hành của trung tâm chăm sóc khách hàng. Giai đoạn này giúp tôi tích lũy kinh nghiệm quản lý hoạt động với quy mô lớn và xây dựng các chỉ số đánh giá chất lượng dịch vụ.',
    icon: 'headset',
    accent: '#0d9488',
  },
  {
    id: '2011',
    title: 'Năm 2011 – Bước ngoặt tại LBC – Truyền hình Cáp HTV',
    body: 'Đây là dấu mốc quan trọng khi tôi lần đầu đảm nhiệm vị trí Trưởng phòng Chăm sóc Khách hàng. Từ một nhà quản lý vận hành, tôi chuyển mình trở thành một nhà quản trị toàn diện. Tôi trực tiếp điều hành hoạt động của phòng ban, xây dựng và chuẩn hóa quy trình, phát triển đội ngũ, thiết lập hệ thống KPI, đồng thời phối hợp với nhiều đơn vị nhằm nâng cao chất lượng dịch vụ và hiệu quả vận hành. Chính giai đoạn này đã giúp tôi hình thành tư duy quản trị hệ thống và phát triển con người song song với mục tiêu kinh doanh.',
    icon: 'tv',
    accent: '#7c3aed',
  },
  {
    id: '2013',
    title: 'Năm 2013 – Garena và hành trình chuyển đổi số',
    body: 'Gia nhập Garena, tôi quản lý hoạt động chăm sóc khách hàng trong lĩnh vực game trực tuyến, nơi yêu cầu tốc độ xử lý nhanh, độ chính xác cao và khả năng đáp ứng lượng khách hàng rất lớn. Trong thời gian này, Garena phát triển mạnh với Liên Minh Huyền Thoại, đồng thời mở rộng thành Vietnam eSport và đầu tư vào nhiều lĩnh vực mới như Shopee, AirPay, Gcafe và Liên Quân Mobile. Tôi có cơ hội đồng hành cùng các dự án ngay từ giai đoạn đầu. Mỗi sản phẩm đều có mô hình vận hành, hành vi người dùng và kỳ vọng khách hàng khác nhau, buộc tôi phải liên tục học hỏi, thích nghi và cập nhật kiến thức để xây dựng các quy trình chăm sóc khách hàng phù hợp với từng lĩnh vực. Đặc biệt, việc tham gia vào giai đoạn phát triển ban đầu của Shopee giúp tôi tiếp cận tư duy quản trị thương mại điện tử hiện đại, từ hành trình khách hàng, trải nghiệm đa kênh, vận hành dịch vụ quy mô lớn đến ứng dụng dữ liệu trong quản trị chất lượng và tối ưu hiệu quả hoạt động. Tại Garena, tôi trực tiếp quản lý 129 nhân sự, xây dựng cơ cấu tổ chức, phát triển đội ngũ quản lý cấp trung, chuẩn hóa quy trình vận hành, thiết lập hệ thống đánh giá hiệu quả công việc và đào tạo nguồn nhân lực kế thừa. Làm việc trong môi trường tăng trưởng với tốc độ rất cao giúp tôi rèn luyện khả năng ra quyết định dưới áp lực, xử lý nhanh các tình huống phát sinh, điều phối nguồn lực hiệu quả và liên tục cải tiến quy trình để đáp ứng sự thay đổi của thị trường. Đây cũng là giai đoạn đặt nền móng cho triết lý quản trị của tôi: xây dựng hệ thống trước khi mở rộng quy mô, phát triển con người song hành cùng công nghệ và luôn lấy khách hàng làm trung tâm trong mọi quyết định.',
    icon: 'rocket',
    accent: '#ea580c',
    fullWidth: true,
  },
  {
    id: '2016',
    title: 'Năm 2016 – Prudential Việt Nam',
    body: 'Tại Prudential, tôi có cơ hội làm việc trong lĩnh vực bảo hiểm – một ngành dịch vụ đòi hỏi tính chính xác, minh bạch và mức độ tin cậy rất cao. Thời gian này giúp tôi hiểu sâu hơn về quản trị trải nghiệm khách hàng, quản lý chất lượng dịch vụ và xây dựng niềm tin bền vững thông qua quy trình chuyên nghiệp và sự đồng cảm trong từng điểm chạm với khách hàng.',
    icon: 'shield-check',
    accent: '#e11d48',
  },
  {
    id: '2018',
    title: 'Năm 2018 – MoMo',
    body: 'Gia nhập MoMo, tôi tiếp tục mở rộng kinh nghiệm trong lĩnh vực tài chính số. Tôi tập trung tối ưu quy trình hỗ trợ khách hàng, nâng cao hiệu quả vận hành, ứng dụng công nghệ vào quản trị dịch vụ và cải thiện trải nghiệm khách hàng trên nền tảng số.',
    icon: 'credit-card',
    accent: '#db2777',
  },
  {
    id: '2023',
    title: 'Năm 2023 – Ví ECO',
    body: 'Tại Ví ECO, tôi tiếp tục phát triển chuyên môn trong lĩnh vực tài chính, nơi mọi hoạt động đều đặt yêu cầu cao về tính chính xác, minh bạch và sự tin cậy. Giai đoạn này giúp tôi hoàn thiện hơn tư duy xây dựng hệ thống dịch vụ khách hàng hiện đại, kết hợp giữa quy trình, công nghệ và trải nghiệm người dùng.',
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

export const PdfView: React.FC<PdfViewProps> = ({ onShowNotification, onNavigateTab }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      data-element-name="Trang Website CV Portfolio Landing Page"
      data-element-type="card"
      data-section-card="true"
      data-element-page="pdf"
      style={{
        gap: '20px',
      }}
      className="main-card bento-card glass-card w-full min-w-0 h-full mx-auto flex flex-col justify-start p-[25px] gap-[20px] sm:gap-[28px] overflow-y-auto no-scrollbar font-play select-text text-left text-[var(--text-primary)] animate-fadeIn rounded-[14px] box-border"
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
          }
          #app-header,
          #app-footer,
          #global-wallpaper-layer,
          .pdf-toolbar,
          .no-print {
            display: none !important;
          }
          #global-content-viewport {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
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
          #pdf-page-container [data-subcard="true"].print-card-bg {
            background: #f8fafc !important;
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
          }
        }

        @keyframes titleShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-title {
          background: linear-gradient(
            90deg,
            currentColor 0%,
            currentColor 25%,
            #0284c7 45%,
            #38bdf8 52%,
            #818cf8 60%,
            currentColor 75%,
            currentColor 100%
          );
          background-size: 200% auto;
          color: inherit;
          background-clip: text;
          -webkit-background-clip: text;
          animation: titleShimmer 7.5s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      {/* THANH ĐIỀU KHIỂN XUẤT TẢI PDF (NO-PRINT) */}
      <header
        data-section-card="true"
        className="pdf-toolbar bento-card glass-card no-print w-full max-w-[1250px] mx-auto mb-4 p-3.5 sm:p-4 rounded-[14px] flex flex-col gap-3 shrink-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="card-header-sync flex items-center gap-3 min-w-0 text-blue-600 dark:text-sky-400">
            <WebIcon name="file-text" size={24} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <div className="min-w-0">
              <h1 className="typo-h3 card-title-synced font-bold font-play text-blue-600 dark:text-sky-400 leading-tight truncate" data-card-title="true">
                Hồ sơ năng lực & CV Portfolio — Nguyễn Hùng Thái
              </h1>
              <p className="typo-label text-[var(--text-secondary)] mt-0.5 truncate tracking-wide font-bold">
                Thiết kế chuẩn A4 · 22 Năm Kinh Nghiệm · CSKH & Vận Hành
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => handlePrintOrExport('download')}
              disabled={isExporting}
              style={{ background: 'var(--bg-button-primary)', color: '#FFFFFF' }}
              className="banner-primary-cta inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full typo-button font-bold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-60"
              title="Tải tệp CV Portfolio dưới dạng PDF"
            >
              <WebIcon name="download" size={16} className="text-white animate-bounce" />
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
              className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full typo-button font-bold transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
              title="Trở về Trang chủ"
            >
              <WebIcon name="arrow-left" size={15} />
              <span>Trở về</span>
            </button>
          </div>
        </div>

        {/* Mục lục điều hướng nhanh 9 phần (ẩn khi in) */}
        <nav
          aria-label="Điều hướng nhanh các phần CV"
          className="no-print flex items-center gap-1.5 overflow-x-auto horizontal-scroll-smooth pt-2 border-t border-[var(--border-subcard)]"
        >
          <span className="inline-flex items-center gap-1.5 px-2 py-1 typo-label font-play text-blue-600 dark:text-sky-400 whitespace-nowrap shrink-0">
            <WebIcon name="list" size={14} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <span>Mục lục:</span>
          </span>
          {[
            { id: 'cv-section-01-home', label: '01 · Tổng quan', icon: 'home' },
            { id: 'cv-section-02-letter', label: '02 · Thư ngỏ', icon: 'mail' },
            { id: 'cv-section-03-about', label: '03 · Giới thiệu', icon: 'user-round' },
            { id: 'cv-section-04-education', label: '04 · Học vấn', icon: 'graduation' },
            { id: 'cv-section-05-services', label: '05 · Dịch vụ', icon: 'heart-handshake' },
            { id: 'cv-section-06-experience', label: '06 · Kinh nghiệm', icon: 'briefcase' },
            { id: 'cv-section-07-skills', label: '07 · Kỹ năng', icon: 'brain' },
            { id: 'cv-section-08-projects', label: '08 · Dự án', icon: 'folder' },
            { id: 'cv-section-09-systems', label: '09 · Hệ thống', icon: 'server' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="banner-control-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-label font-play whitespace-nowrap transition cursor-pointer shrink-0"
            >
              <WebIcon name={sec.icon} size={13} className="shrink-0" />
              <span>{sec.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* PHẦN 01 – TỔNG QUAN NĂNG LỰC */}
      <section id="cv-section-01-home" className="w-full flex flex-col gap-5 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-blue-600 dark:text-sky-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 typo-badge font-bold font-mono tracking-wide">
              01/09
            </span>
            <WebIcon name="home" size={22} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-blue-600 dark:text-sky-400" data-card-title="true">
              Tổng quan năng lực
            </h2>
          </div>
        </div>

        <div
          data-section-card="true"
          className="bento-card glass-card grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-5 rounded-[14px] print-card-bg"
        >
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-[14px] overflow-hidden ring-4 ring-[var(--border-subcard)] shadow-xl">
              <img
                src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
                alt="Nguyễn Hùng Thái - Chuyên Gia Vận Hành CSKH"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
                <span className="typo-kpi font-extrabold text-blue-600 dark:text-cyan-400 font-play">22+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Năm kinh nghiệm</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-emerald-600 dark:text-emerald-400 font-play">100+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Dự án chuyển đổi</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-amber-600 dark:text-amber-400 font-play">98%+</span>
                <span className="typo-label font-bold text-[var(--text-muted)] font-mono block mt-1">Hài lòng CSAT</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[14px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-purple-600 dark:text-purple-400 font-play">500+</span>
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
      </section>

      {/* PHẦN 02 – THƯ NGỎ */}
      <section id="cv-section-02-letter" className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 typo-badge font-bold font-mono tracking-wide">
              02/09
            </span>
            <WebIcon name="mail" size={22} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-cyan-600 dark:text-cyan-400" data-card-title="true">
              Thư ngỏ
            </h2>
          </div>
        </div>

        <div
          data-section-card="true"
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg min-w-0"
        >
          <div className="flex flex-col gap-2 break-inside-avoid">
            <h3 className="typo-h3 card-header-sync card-title-synced font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2" data-card-title="true">
              <WebIcon name="mail" size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Kính chào Quý Công ty!</span>
            </h3>
            <p className="typo-body text-[var(--text-secondary)] leading-relaxed">
              Tôi là Nguyễn Hùng Thái, Trưởng phòng Chăm sóc Khách hàng với hơn 22 năm kinh nghiệm trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.
            </p>
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
                <h4
                  className="typo-h5 subcard-header-sync subcard-title-synced font-bold flex items-center gap-2 min-w-0 break-words"
                  style={{ color: item.accent }}
                  data-subcard-title="true"
                >
                  <WebIcon name={item.icon} size={16} className="shrink-0" style={{ color: item.accent }} />
                  <span className="break-words">{item.title}</span>
                </h4>
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
              <WebIcon name="compass" size={17} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Triết lý quản trị</span>
            </h4>
            <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed break-words">
              Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững. Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PDF_OPEN_LETTER_PRINCIPLES.map((principle) => (
                <div
                  key={principle.id}
                  className="p-3 rounded-[14px] border border-[var(--border-subcard)] bg-white/40 dark:bg-slate-900/40 flex items-center gap-2.5 min-w-0 print-card-bg"
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

            <blockquote className="px-4 py-2.5 rounded-[14px] border-l-4 border-cyan-500 bg-cyan-500/10 text-[var(--text-primary)] font-semibold italic typo-body-sm leading-relaxed">
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
      <section id="cv-section-03-about" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 typo-badge font-bold font-mono tracking-wide">
              03/09
            </span>
            <WebIcon name="user-round" size={22} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-emerald-600 dark:text-emerald-400" data-card-title="true">
              Giới thiệu bản thân
            </h2>
          </div>
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
                data-section-card="true"
                className="bento-card glass-card p-3 rounded-[14px] flex flex-col justify-between gap-1.5 print-card-bg min-w-0 break-inside-avoid"
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
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 04 – HỌC VẤN & BẰNG CẤP */}
      {/* ========================================================================= */}
      <section id="cv-section-04-education" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-purple-600 dark:text-purple-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-purple-500/15 text-purple-700 dark:text-purple-300 typo-badge font-bold font-mono tracking-wide">
              04/09
            </span>
            <WebIcon name="graduation" size={22} className="text-purple-600 dark:text-purple-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-purple-600 dark:text-purple-400" data-card-title="true">
              Học vấn bằng cấp
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {EDUCATION_COURSES.map((course, idx) => {
            const cardColor = getCourseColor(course, idx);
            return (
              <div
                key={course.id}
                data-section-card="true"
                className="bento-card glass-card p-4 rounded-[14px] flex flex-col justify-between gap-2.5 break-inside-avoid print-card-bg relative overflow-hidden"
                style={{ border: `1.5px solid ${cardColor}45` }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 font-bold" style={{ color: cardColor }}>
                      <WebIcon name="calendar" size={14} />
                      <span className="typo-label font-mono">Năm {course.year}</span>
                    </div>
                    {course.code && (
                      <span className="typo-badge font-mono font-black px-2 py-0.5 rounded-full border" style={{ backgroundColor: `${cardColor}15`, color: cardColor, borderColor: `${cardColor}40` }}>
                        {course.code}
                      </span>
                    )}
                  </div>

                  <div className="card-header-sync flex items-start gap-2" style={{ color: cardColor }}>
                    <WebIcon name="award" size={18} className="shrink-0 mt-0.5" style={{ color: cardColor }} />
                    <h3 className="typo-h4 card-title-synced font-bold leading-snug" data-card-title="true" style={{ color: cardColor }}>
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
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 05 – DỊCH VỤ TRỌNG TÂM */}
      {/* ========================================================================= */}
      <section id="cv-section-05-services" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-amber-500/15 text-amber-700 dark:text-amber-300 typo-badge font-bold font-mono tracking-wide">
              05/09
            </span>
            <WebIcon name="heart-handshake" size={22} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-amber-600 dark:text-amber-400" data-card-title="true">
              Dịch vụ trọng tâm
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {DOMAINS_DATA.map((domain) => {
            const accentColor = SERVICE_ACCENT_COLORS[domain.color] || '#0d9488';

            return (
              <div
                key={domain.id}
                data-section-card="true"
                className="bento-card glass-card p-4 rounded-[14px] flex flex-col justify-between gap-3 break-inside-avoid shadow-sm print-card-bg min-w-0"
              >
                <div className="min-w-0">
                  <div className="card-header-sync flex items-start gap-2 min-w-0" style={{ color: accentColor }}>
                    <WebIcon
                      name={(domain.icon || 'briefcase').toLowerCase()}
                      size={18}
                      className="shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h4 card-title-synced font-bold leading-tight break-words" data-card-title="true" style={{ color: accentColor }}>
                        {domain.title}
                      </h3>
                      <p className="typo-caption text-[var(--text-secondary)] font-medium mt-0.5 leading-snug break-words">
                        {domain.subtitle}
                      </p>
                    </div>
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
                              className="w-7 h-7 rounded-full overflow-hidden p-0 border border-[var(--border-subcard)] shadow-xs bg-white flex items-center justify-center shrink-0"
                              title={partner.name}
                            >
                              <img
                                src={logoSrc}
                                alt={partner.name}
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
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 06 – KINH NGHIỆM */}
      {/* ========================================================================= */}
      <section id="cv-section-06-experience" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-blue-600 dark:text-sky-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-blue-500/15 text-blue-700 dark:text-blue-300 typo-badge font-bold font-mono tracking-wide">
              06/09
            </span>
            <WebIcon name="briefcase" size={22} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-blue-600 dark:text-sky-400" data-card-title="true">
              Kinh nghiệm công tác
            </h2>
          </div>
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
                data-section-card="true"
                className="bento-card glass-card p-4 rounded-[14px] flex flex-col justify-between gap-2.5 break-inside-avoid print-card-bg relative transition-all min-w-0"
              >
                {/* Sub-card 1: Thời gian, Logo & Tên công ty */}
                <div data-subcard="true" className="sub-card p-3 rounded-[14px] flex flex-col gap-2 print-card-bg min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-blue-600 text-white font-bold font-play typo-badge">
                      {formattedPeriod}
                    </span>
                  </div>

                  <div className="subcard-header-sync flex items-center gap-2.5 min-w-0" style={{ color: expAccentColor }}>
                    {m.logo ? (
                      <div className="w-8 h-8 rounded-[14px] overflow-hidden bg-white border border-[var(--border-subcard)] p-0.5 shrink-0 flex items-center justify-center">
                        <img src={m.logo} alt={m.company} className="w-full h-full object-contain rounded-[4px]" />
                      </div>
                    ) : (
                      <WebIcon name="building" size={18} className="shrink-0" style={{ color: expAccentColor }} />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h4 subcard-title-synced font-bold leading-snug break-words" data-subcard-title="true" style={{ color: expAccentColor }}>
                        {m.company}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Sub-card 2: Vị trí & Quy mô nhân sự nằm dưới Vị trí */}
                <ul data-subcard="true" className="sub-card p-3 rounded-[14px] flex flex-col gap-1.5 print-card-bg min-w-0 list-none m-0">
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
                <div data-subcard="true" className="sub-card p-3 rounded-[14px] flex flex-col gap-2 print-card-bg min-w-0">
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
                <ul data-subcard="true" className="sub-card p-3 rounded-[14px] flex-1 flex flex-col gap-1.5 print-card-bg min-w-0 list-none m-0">
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
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 07 – KỸ NĂNG */}
      {/* ========================================================================= */}
      <section id="cv-section-07-skills" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-rose-500/15 text-rose-700 dark:text-rose-300 typo-badge font-bold font-mono tracking-wide">
              07/09
            </span>
            <WebIcon name="brain" size={22} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-rose-600 dark:text-rose-400" data-card-title="true">
              Kỹ năng chuyên môn
            </h2>
          </div>
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
              data-section-card="true"
              style={{ border: `1.5px solid ${quad.color}40` }}
              className="bento-card glass-card p-3.5 rounded-[14px] flex flex-col gap-3 break-inside-avoid print-card-bg min-w-0"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-2 gap-2">
                <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: quad.color }}>
                  <WebIcon name={quad.icon} size={17} className="shrink-0" style={{ color: quad.color }} />
                  <h3 className="typo-h4 card-title-synced font-bold truncate" data-card-title="true" style={{ color: quad.color }}>
                    {quad.title}
                  </h3>
                </div>
                <span className="typo-badge font-mono font-black px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${quad.color}18`, color: quad.color }}>
                  {quad.key}
                </span>
              </div>
              <div className="space-y-2">
                {quad.data.map((skill) => (
                  <div key={skill.id} data-subcard="true" className="sub-card p-2.5 rounded-[14px] space-y-1.5 print-card-bg min-w-0">
                    <div className="flex justify-between items-center gap-2 typo-caption font-bold">
                      <span className="text-[var(--text-primary)] truncate">{skill.labelVi}</span>
                      <span
                        className="font-mono font-black shrink-0 tabular-nums"
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
          data-section-card="true"
          style={{ border: '1.5px solid #6366f140' }}
          className="bento-card glass-card w-full p-4 rounded-[14px] flex flex-col justify-between gap-3 break-inside-avoid print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-2 gap-2">
            <div className="card-header-sync flex items-center gap-2 min-w-0 text-indigo-600 dark:text-indigo-400">
              <WebIcon name="globe" size={18} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
              <h3 className="typo-h4 card-title-synced font-bold text-indigo-600 dark:text-indigo-400 truncate" data-card-title="true">
                Ngôn ngữ giao tiếp
              </h3>
            </div>
            <span className="typo-badge font-mono font-black px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 shrink-0">
              {LANGUAGES_DATA.length} Ngôn ngữ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 items-stretch">
            {LANGUAGES_DATA.map((lang) => {
              const langHex = lang.id === 'vi' ? '#059669' : lang.id === 'en' ? '#0284c7' : '#7c3aed';
              const langIcon = lang.id === 'ai' ? 'cpu' : 'globe';

              return (
                <div
                  key={lang.id}
                  data-subcard="true"
                  className="sub-card p-3 rounded-[14px] flex flex-col justify-between gap-2.5 print-card-bg min-w-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="subcard-header-sync flex items-center gap-2 min-w-0" style={{ color: langHex }}>
                      <WebIcon name={langIcon} size={16} className="shrink-0" style={{ color: langHex }} />
                      <h4 className="typo-h5 subcard-title-synced font-bold truncate" data-subcard-title="true" style={{ color: langHex }}>
                        {lang.nameVi}
                      </h4>
                    </div>
                    <span className="font-mono font-black typo-label shrink-0 tabular-nums" style={{ color: langHex }}>
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
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 08 – DỰ ÁN TRỌNG ĐIỂM (HÀNG RIÊNG, CHIA 2 CỘT) */}
      {/* ========================================================================= */}
      <section id="cv-section-08-projects" className="w-full min-w-0 flex flex-col gap-3.5">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              08/09
            </span>
            <WebIcon name="folder" size={22} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-indigo-600 dark:text-indigo-400 truncate" data-card-title="true">
              Dự án trọng điểm
            </h2>
          </div>
          <span className="typo-label font-mono font-bold text-indigo-600 dark:text-indigo-300 shrink-0">
            {PROJECTS_DATA.length} dự án
          </span>
        </div>

        <div
          data-section-card="true"
          className="bento-card glass-card p-4 rounded-[14px] flex flex-col print-card-bg min-w-0"
        >
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
              const projIcon =
                p.groupKey === 'strategy'
                  ? 'target'
                  : p.groupKey === 'cx'
                  ? 'heart'
                  : p.groupKey === 'sop'
                  ? 'workflow'
                  : p.groupKey === 'tech'
                  ? 'cpu'
                  : 'graduation';

              return (
                <li
                  key={p.id}
                  data-subcard="true"
                  className="sub-card p-3 rounded-[14px] flex items-start justify-between gap-2.5 min-w-0 break-inside-avoid print-card-bg"
                >
                  <div className="min-w-0 flex-1">
                    <div className="subcard-header-sync flex items-start gap-1.5 min-w-0" style={{ color: projColor }}>
                      <WebIcon name={projIcon} size={15} className="shrink-0 mt-0.5" style={{ color: projColor }} />
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
      <section id="cv-section-09-systems" className="w-full min-w-0 flex flex-col gap-3.5">
        <div className="flex items-center justify-between border-b border-[var(--border-subcard)] pb-3 break-after-avoid">
          <div className="card-header-sync flex items-center gap-2.5 min-w-0 text-teal-600 dark:text-teal-400">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-teal-500/15 text-teal-700 dark:text-teal-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              09/09
            </span>
            <WebIcon name="server" size={22} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <h2 className="typo-h2 card-title-synced font-bold font-play text-teal-600 dark:text-teal-400 truncate" data-card-title="true">
              Hệ thống công nghệ
            </h2>
          </div>
          <span className="typo-label font-mono font-bold text-teal-600 dark:text-teal-300 shrink-0">
            {ENTERPRISE_SYSTEMS_LIST.length} hệ thống
          </span>
        </div>

        <div
          data-section-card="true"
          className="bento-card glass-card p-4 rounded-[14px] flex flex-col print-card-bg min-w-0"
        >
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
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span
                      className="px-2 py-0.5 rounded-md font-mono typo-badge font-black shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: rawColor, color: badgeTextColor }}
                    >
                      {sys.code || sys.abbr}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h5 subcard-header-sync subcard-title-synced font-bold leading-snug flex items-start gap-1.5 flex-wrap min-w-0" data-subcard-title="true" style={{ color: iconColor }}>
                        <WebIcon name={sys.iconName || 'server'} size={14} className="shrink-0 mt-0.5" style={{ color: iconColor }} />
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
            Email: hunghungthai@gmail.com · Hotline: 0903.007.444 · TP. Hồ Chí Minh, Việt Nam
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p>© 2026 Nguyễn Hùng Thái. Toàn bộ thông tin được bảo hộ bản quyền.</p>
          <p className="mt-0.5 typo-label">Tài liệu xuất bản từ website Portfolio Nguyễn Hùng Thái</p>
        </div>
      </footer>

      {/* Back to Top Floating Button (Portal ra body để cố định ở góc phải bên dưới website với định dạng chuẩn giao diện) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <button
            id="pdf-back-to-top-btn"
            type="button"
            onClick={() => {
              const container = document.getElementById('pdf-page-container') || document.querySelector('.overflow-y-auto');
              if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="theme-back-to-top-btn theme-back-to-top-icon no-print fixed bottom-[88px] right-4 sm:right-6 z-[9990] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <WebIcon name="chevron-up" className="w-5 h-5" />
          </button>,
          document.body
        )}
    </div>
  );
};

