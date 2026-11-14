'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { ABOUT_PROFILE_STATS, PERSONAL_DEMOGRAPHICS, SERVICE_PHILOSOPHY_VALUES } from '@/data/about';
import { CORE_VALUES_DATA, OPERATIONAL_PRINCIPLES_DATA } from '@/data/letterData';
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

export const PdfView: React.FC<PdfViewProps> = ({ onShowNotification, onNavigateTab }) => {
  const { cardStyle } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;
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
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '20px',
      }}
      className="bento-card glass-card w-full h-full flex flex-col p-[15px] sm:p-[20px] gap-[20px] sm:gap-[28px] overflow-y-auto no-scrollbar font-play select-text text-left animate-fadeIn rounded-[14px]"
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
        style={cardSampleStyle}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <WebIcon name="file-text" size={24} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <div className="min-w-0">
              <h1 className="typo-h3 font-bold font-play text-blue-600 dark:text-sky-400 leading-tight truncate">
                Hồ sơ năng lực & CV Portfolio — Nguyễn Hùng Thái
              </h1>
              <p className="typo-label text-[#475569] dark:text-[#94A3B8] mt-0.5 truncate tracking-wide font-bold">
                Thiết kế chuẩn A4 · 22 Năm Kinh Nghiệm · CSKH & Vận Hành
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => handlePrintOrExport('download')}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full typo-button font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-[0_4px_16px_rgba(2,132,199,0.35)] hover:shadow-[0_6px_20px_rgba(2,132,199,0.45)] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-60"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full typo-button font-bold bg-slate-700 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer shrink-0 border border-slate-600/40"
              title="Trở về Trang chủ"
            >
              <WebIcon name="arrow-left" size={15} className="text-white" />
              <span>Trở về</span>
            </button>
          </div>
        </div>

        {/* Mục lục điều hướng nhanh 9 phần (ẩn khi in) */}
        <nav
          aria-label="Điều hướng nhanh các phần CV"
          className="no-print flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-200/70 dark:border-slate-700/60"
        >
          <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold font-play text-blue-600 dark:text-sky-400 whitespace-nowrap shrink-0">
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-play whitespace-nowrap bg-slate-100/90 hover:bg-sky-100 dark:bg-slate-800/90 dark:hover:bg-sky-900/60 text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 border border-slate-200/80 dark:border-slate-700 transition cursor-pointer shrink-0"
            >
              <WebIcon name={sec.icon} size={13} className="shrink-0" />
              <span>{sec.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* PHẦN 01 – TỔNG QUAN NĂNG LỰC */}
      <section id="cv-section-01-home" className="w-full flex flex-col gap-5 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono tracking-wide">
              01/09
            </span>
            <WebIcon name="home" size={22} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-blue-600 dark:text-sky-400">
              Tổng quan năng lực
            </h2>
          </div>
        </div>

        <div
          data-section-card="true"
          style={cardSampleStyle}
          className="bento-card glass-card grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-5 rounded-[14px] print-card-bg"
        >
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-[14px] overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-xl">
              <img
                src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
                alt="Nguyễn Hùng Thái - Chuyên Gia Vận Hành CSKH"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sẵn sàng đảm nhận vai trò quản trị
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-3 text-left">
            <div>
              <span className="typo-label font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Hồ sơ cá nhân & Năng lực quản trị
              </span>
              <h1 className="typo-h1 font-bold font-play text-slate-950 dark:text-white mt-0.5">
                Nguyễn Hùng Thái
              </h1>
              <p className="typo-h4 font-semibold text-cyan-700 dark:text-cyan-300 mt-1">
                Chuyên Gia Vận Hành CSKH & Chuyển Đổi Số · CX & Operations Director
              </p>
            </div>

            <p className="typo-body text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Với hơn <strong>22 năm kinh nghiệm thực chiến</strong> trong việc kiến tạo, chuẩn hóa quy trình và điều hành các hệ thống Contact Center quy mô lớn tại các doanh nghiệp hàng đầu (Viễn thông, Thương mại điện tử, Tài chính bảo hiểm, Thanh toán điện tử).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div data-subcard="true" className="sub-card p-3 rounded-[12px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-blue-600 dark:text-cyan-400 font-play">22+</span>
                <span className="typo-label font-bold uppercase text-slate-600 dark:text-slate-400 font-mono block mt-1">Năm kinh nghiệm</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[12px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-emerald-600 dark:text-emerald-400 font-play">100+</span>
                <span className="typo-label font-bold uppercase text-slate-600 dark:text-slate-400 font-mono block mt-1">Dự án chuyển đổi</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[12px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-amber-600 dark:text-amber-400 font-play">98%+</span>
                <span className="typo-label font-bold uppercase text-slate-600 dark:text-slate-400 font-mono block mt-1">Hài lòng CSAT</span>
              </div>
              <div data-subcard="true" className="sub-card p-3 rounded-[12px] shadow-sm text-center break-inside-avoid print-card-bg">
                <span className="typo-kpi font-extrabold text-purple-600 dark:text-purple-400 font-play">500+</span>
                <span className="typo-label font-bold uppercase text-slate-600 dark:text-slate-400 font-mono block mt-1">Nhân sự dẫn dắt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHẦN 02 – THƯ NGỎ */}
      <section id="cv-section-02-letter" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 typo-badge font-bold font-mono tracking-wide">
              02/09
            </span>
            <WebIcon name="mail" size={22} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-cyan-600 dark:text-cyan-400">
              Thư ngỏ tâm huyết
            </h2>
          </div>
        </div>

        <div
          data-section-card="true"
          style={cardSampleStyle}
          className="bento-card glass-card p-5 rounded-[14px] flex flex-col gap-4 print-card-bg"
        >
          <h3 className="typo-h3 font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
            <WebIcon name="mail" size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Kính gửi Quý Ban Lãnh Đạo & Quý Đối Tác,</span>
          </h3>
          <p className="typo-body text-slate-700 dark:text-slate-300 leading-relaxed">
            Tôi là <strong>Nguyễn Hùng Thái</strong>, Trưởng phòng Chăm sóc Khách hàng với hơn <strong>22 năm kinh nghiệm</strong> trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng đa kênh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {OPERATIONAL_PRINCIPLES_DATA.map((pillar) => (
              <div key={pillar.id} data-subcard="true" className="sub-card p-3.5 rounded-[12px] shadow-sm print-card-bg">
                <span className="typo-label font-bold uppercase text-blue-600 dark:text-sky-400">Trụ cột #{pillar.id}</span>
                <h4 className="typo-h5 font-bold text-blue-600 dark:text-sky-400 mt-1 flex items-center gap-1.5">
                  <WebIcon name="sparkles" size={15} className="text-blue-600 dark:text-sky-400 shrink-0" />
                  <span>{pillar.titleVi}</span>
                </h4>
                <p className="typo-caption text-slate-600 dark:text-slate-400 mt-1">{pillar.descVi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHẦN 03 – GIỚI THIỆU BẢN THÂN */}
      <section id="cv-section-03-about" className="w-full flex flex-col gap-4 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 typo-badge font-bold font-mono tracking-wide">
              03/09
            </span>
            <WebIcon name="user-round" size={22} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-emerald-600 dark:text-emerald-400">
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
                style={cardSampleStyle}
                className="bento-card glass-card p-3 rounded-[12px] flex flex-col justify-between gap-1.5 print-card-bg min-w-0 break-inside-avoid"
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
                      className="typo-body-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition-colors break-all block leading-snug"
                    >
                      {item.valueVi}
                    </a>
                  ) : (
                    <span className="typo-body-sm font-semibold text-slate-900 dark:text-white break-words block leading-snug">
                      {item.valueVi}
                    </span>
                  )}
                  {item.subtitleVi && (
                    <span className="typo-label text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug break-words">
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono tracking-wide">
              04/09
            </span>
            <WebIcon name="graduation" size={22} className="text-purple-600 dark:text-purple-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-purple-600 dark:text-purple-400">
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
                className="bento-card glass-card p-4 rounded-[12px] flex flex-col justify-between gap-2.5 break-inside-avoid print-card-bg relative overflow-hidden"
                style={{ ...cardSampleStyle, borderColor: `${cardColor}45` }}
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

                  <div className="flex items-start gap-2">
                    <WebIcon name="award" size={18} className="shrink-0 mt-0.5" style={{ color: cardColor }} />
                    <h3 className="typo-h4 font-bold leading-snug" style={{ color: cardColor }}>
                      {course.title}
                    </h3>
                  </div>

                  <div className="space-y-1 mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 typo-caption">
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-slate-600 dark:text-slate-400 shrink-0">Đơn vị:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{course.issuer}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-slate-600 dark:text-slate-400 shrink-0">Hình thức đào tạo:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{course.type}</span>
                    </div>
                  </div>

                  <p className="typo-caption text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 typo-badge font-bold font-mono tracking-wide">
              05/09
            </span>
            <WebIcon name="heart-handshake" size={22} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-amber-600 dark:text-amber-400">
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
                style={cardSampleStyle}
                className="bento-card glass-card p-4 rounded-[14px] flex flex-col justify-between gap-3 break-inside-avoid shadow-sm print-card-bg min-w-0"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-2 min-w-0">
                    <WebIcon
                      name={(domain.icon || 'briefcase').toLowerCase()}
                      size={18}
                      className="shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h4 font-bold leading-tight break-words" style={{ color: accentColor }}>
                        {domain.title}
                      </h3>
                      <p className="typo-caption text-slate-600 dark:text-slate-300 font-medium mt-0.5 leading-snug break-words">
                        {domain.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700 typo-label min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Đơn vị:</span>
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
                              className="w-7 h-7 rounded-full overflow-hidden p-0 border border-slate-200/80 dark:border-white/20 shadow-xs bg-white flex items-center justify-center shrink-0"
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 typo-badge font-bold font-mono tracking-wide">
              06/09
            </span>
            <WebIcon name="briefcase" size={22} className="text-blue-600 dark:text-sky-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-blue-600 dark:text-sky-400">
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
                style={cardSampleStyle}
                className="bento-card glass-card p-4 rounded-[14px] flex flex-col justify-between gap-2.5 break-inside-avoid print-card-bg relative transition-all min-w-0"
              >
                {/* Sub-card 1: Thời gian, Logo & Tên công ty */}
                <div data-subcard="true" className="sub-card p-3 rounded-[12px] flex flex-col gap-2 print-card-bg min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-blue-600 text-white font-bold font-play typo-badge">
                      {formattedPeriod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0">
                    {m.logo ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 shrink-0 flex items-center justify-center">
                        <img src={m.logo} alt={m.company} className="w-full h-full object-contain rounded-[4px]" />
                      </div>
                    ) : (
                      <WebIcon name="building" size={18} className="shrink-0" style={{ color: expAccentColor }} />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h4 font-bold leading-snug break-words" style={{ color: expAccentColor }}>
                        {m.company}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Sub-card 2: Vị trí & Quy mô nhân sự nằm dưới Vị trí */}
                <ul data-subcard="true" className="sub-card p-3 rounded-[12px] flex flex-col gap-1.5 print-card-bg min-w-0 list-none m-0">
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
                <div data-subcard="true" className="sub-card p-3 rounded-[12px] flex flex-col gap-2 print-card-bg min-w-0">
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
                <ul data-subcard="true" className="sub-card p-3 rounded-[12px] flex-1 flex flex-col gap-1.5 print-card-bg min-w-0 list-none m-0">
                  <li className="typo-body-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="typo-body-sm min-w-0 flex-1">{m.cardDescription || m.descVi || m.highlightText}</span>
                  </li>

                  {m.tasks && m.tasks.length > 0 && (
                    <>
                      <li className="typo-body-sm font-bold text-slate-800 dark:text-slate-200 pt-1.5 mt-0.5 border-t border-slate-200/70 dark:border-slate-700/70 break-words">
                        Nhiệm vụ &amp; Trọng tâm vận hành:
                      </li>
                      {m.tasks.slice(0, 3).map((task: any, idx: number) => (
                        <li key={idx} className="typo-body-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words flex items-start gap-2">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 typo-badge font-bold font-mono tracking-wide">
              07/09
            </span>
            <WebIcon name="brain" size={22} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-rose-600 dark:text-rose-400">
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
              style={{ ...cardSampleStyle, borderColor: `${quad.color}40` }}
              className="bento-card glass-card p-3.5 rounded-[14px] flex flex-col gap-3 break-inside-avoid print-card-bg min-w-0"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <WebIcon name={quad.icon} size={17} className="shrink-0" style={{ color: quad.color }} />
                  <h3 className="typo-h4 font-bold truncate" style={{ color: quad.color }}>
                    {quad.title}
                  </h3>
                </div>
                <span className="typo-badge font-mono font-black px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${quad.color}18`, color: quad.color }}>
                  {quad.key}
                </span>
              </div>
              <div className="space-y-2">
                {quad.data.map((skill) => (
                  <div key={skill.id} data-subcard="true" className="sub-card p-2.5 rounded-[10px] space-y-1.5 print-card-bg min-w-0">
                    <div className="flex justify-between items-center gap-2 typo-caption font-bold">
                      <span className="text-slate-800 dark:text-slate-200 truncate">{skill.labelVi}</span>
                      <span
                        className="font-mono font-black shrink-0 tabular-nums"
                        style={{ color: quad.color }}
                        title={quad.key === 'T' ? 'Mức độ tác động' : undefined}
                      >
                        {quad.key === 'T' ? `Tác động ${skill.percent}%` : `${skill.percent}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
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
          style={{ ...cardSampleStyle, borderColor: '#6366f140' }}
          className="bento-card glass-card w-full p-4 rounded-[14px] flex flex-col justify-between gap-3 break-inside-avoid print-card-bg min-w-0"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <WebIcon name="globe" size={18} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
              <h3 className="typo-h4 font-bold text-indigo-600 dark:text-indigo-400 truncate">
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
                  className="sub-card p-3 rounded-[12px] flex flex-col justify-between gap-2.5 print-card-bg min-w-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <WebIcon name={langIcon} size={16} className="shrink-0" style={{ color: langHex }} />
                      <h4 className="typo-h5 font-bold truncate" style={{ color: langHex }}>
                        {lang.nameVi}
                      </h4>
                    </div>
                    <span className="font-mono font-black typo-label shrink-0 tabular-nums" style={{ color: langHex }}>
                      {lang.percent}%
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="typo-label font-semibold text-slate-600 dark:text-slate-300 break-words">
                      {lang.roleVi || lang.levelVi}
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              08/09
            </span>
            <WebIcon name="folder" size={22} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-indigo-600 dark:text-indigo-400 truncate">
              Dự án trọng điểm
            </h2>
          </div>
          <span className="typo-label font-mono font-bold text-indigo-600 dark:text-indigo-300 shrink-0">
            {PROJECTS_DATA.length} dự án
          </span>
        </div>

        <div
          data-section-card="true"
          style={cardSampleStyle}
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
                  className="sub-card p-3 rounded-[12px] flex items-start justify-between gap-2.5 min-w-0 break-inside-avoid print-card-bg"
                >
                    <div className="min-w-0 flex-1">
                      <h3
                        className="typo-h5 font-bold leading-snug flex items-start gap-1.5 min-w-0"
                        style={{ color: projColor }}
                      >
                        <WebIcon name={projIcon} size={15} className="shrink-0 mt-0.5" style={{ color: projColor }} />
                        <span className="break-words">{p.title}</span>
                      </h3>
                      <p className="typo-caption text-slate-600 dark:text-slate-300 mt-1 leading-relaxed break-words">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Vai trò: {p.role}</span> · {p.description}
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 break-after-avoid">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 typo-badge font-bold font-mono tracking-wide shrink-0">
              09/09
            </span>
            <WebIcon name="server" size={22} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <h2 className="typo-h2 font-bold font-play text-teal-600 dark:text-teal-400 truncate">
              Hệ thống công nghệ
            </h2>
          </div>
          <span className="typo-label font-mono font-bold text-teal-600 dark:text-teal-300 shrink-0">
            {ENTERPRISE_SYSTEMS_LIST.length} hệ thống
          </span>
        </div>

        <div
          data-section-card="true"
          style={cardSampleStyle}
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
                  className="sub-card p-3 rounded-[12px] flex items-start justify-between gap-2.5 min-w-0 break-inside-avoid print-card-bg"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span
                      className="px-2 py-0.5 rounded-md font-mono typo-badge font-black shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: rawColor, color: badgeTextColor }}
                    >
                      {sys.code || sys.abbr}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="typo-h5 font-bold leading-snug flex items-start gap-1.5 flex-wrap min-w-0">
                        <WebIcon name={sys.iconName || 'server'} size={14} className="shrink-0 mt-0.5" style={{ color: iconColor }} />
                        <span className="break-words" style={{ color: iconColor }}>
                          {sys.nameVi}
                        </span>
                        <span className="typo-label font-mono font-semibold text-slate-500 dark:text-slate-400">
                          ({sys.category})
                        </span>
                      </h3>
                      <p className="typo-caption text-slate-600 dark:text-slate-300 mt-1 leading-relaxed break-words">
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
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 typo-label text-slate-500 dark:text-slate-400 break-inside-avoid">
        <div className="text-center sm:text-left">
          <p className="font-bold text-slate-800 dark:text-slate-200 font-play typo-body-sm">
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
            style={{
              ...cardSampleStyle,
              borderRadius: '999px',
            }}
            className="no-print fixed bottom-[88px] right-4 sm:right-6 z-[9990] w-12 h-12 rounded-[999px] bg-blue-600/90 hover:bg-blue-700 text-white shadow-[0_8px_24px_rgba(37,99,235,0.45)] border-2 border-white/80 dark:border-slate-800 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <WebIcon name="chevron-up" className="w-5 h-5 text-white" />
          </button>,
          document.body
        )}
    </div>
  );
};

