'use client';

import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { BentoCard } from '@/components/ui/BentoCard';
import { useLanguage } from '@/context/LanguageContext';

export interface ContactViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentTheme = 'liquid-glass', onShowNotification }) => {
  void currentTheme;
  void onShowNotification;
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div
      id="contact-page-container"
      data-element-name="Trang Đặt lịch hẹn & Liên hệ"
      data-element-type="container"
      data-element-page="contact"
      data-element-parent="global-content-viewport"
      data-no-wheel-horizontal="true"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-visible no-scrollbar font-play text-left rounded-[var(--radius-global,var(--radius-main,14px))] text-[var(--text-primary)] box-border"
    >
      <div
        id="contact-cards-track"
        data-element-name="Track căn giữa Liên hệ"
        data-element-type="container"
        data-element-page="contact"
        data-element-parent="contact-page-container"
        className="page-cards-track"
      >
        <div
          id="contact-main-card"
          data-main-card="true"
          data-floating-surface="main"
          data-element-name="Thẻ chính Trang Đặt lịch hẹn"
          data-element-type="card"
          data-element-page="contact"
          data-element-parent="contact-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[var(--main-card-padding,20px)] gap-0 rounded-[var(--radius-global,var(--radius-main,14px))] overflow-hidden box-border"
          style={{ padding: 'var(--main-card-padding, 20px)', gap: '0px', borderRadius: 'var(--radius-global, var(--radius-main, 14px))' }}
        >
          <div
            id="contact-main-scroll-viewport"
            data-no-wheel-horizontal="true"
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-stretch justify-start overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y no-scrollbar box-border"
          >
            <div
              id="contact-main-content"
              data-element-parent="contact-main-card"
              className="w-full h-full min-h-0 flex-1 flex flex-col items-stretch justify-start gap-[14px] min-w-0 box-border"
            >
              {/* 1. THẺ THÔNG TIN ĐẶT LỊCH & KÊNH LIÊN HỆ NHANH (BentoCard Action + Info Light Mode) */}
              <BentoCard
                as="section"
                id="contact-quick-info-card"
                variant="info"
                fxMode="spotlight-3d"
                isDarkText={true}
                data-element-name="Thẻ Thông tin đặt lịch & Liên hệ nhanh"
                data-element-type="card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="w-full shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/75 dark:from-slate-900/90 dark:via-slate-900/85 dark:to-indigo-950/60 border border-indigo-200/70 dark:border-indigo-400/25 shadow-md"
              >
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      id="contact-badge-label"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-badge font-bold tracking-wide bg-indigo-50 border-indigo-200/80 text-indigo-700 dark:bg-indigo-500/15 dark:border-indigo-400/30 dark:text-indigo-300"
                    >
                      <WebIcon name="calendar" className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? 'Online Appointment' : 'Đặt lịch hẹn trực tuyến'}</span>
                    </span>
                    <p
                      id="contact-banner-quote"
                      className="banner-quote typo-body-sm font-handwriting font-quote not-italic font-bold select-none text-left m-0 text-indigo-600 dark:text-indigo-300"
                      style={{ fontFamily: "var(--font-quote, 'Dancing Script', cursive)" }}
                    >
                      &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
                    </p>
                  </div>

                  <h1
                    id="contact-heading-title"
                    className="typo-h3 font-bold tracking-tight text-left m-0 leading-tight text-slate-900 dark:text-white"
                    data-card-title="true"
                  >
                    {isEn ? 'Schedule a Meeting' : 'Lịch hẹn & Trao đổi'}
                  </h1>

                  <p
                    id="contact-desc-text"
                    className="typo-caption sm:typo-body-sm text-left m-0 leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    {isEn
                      ? 'Select a convenient time slot via Google Calendar for executive recruitment, CX consulting, or project collaboration discussions.'
                      : 'Chọn thời gian phù hợp qua Google Calendar để trao đổi trực tiếp về cơ hội tuyển dụng, tư vấn chiến lược CX hoặc hợp tác dự án.'}
                  </p>
                </div>

                {/* Các Sub-card hành động kết nối nhanh */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 shrink-0">
                  <BentoCard
                    as="div"
                    variant="action"
                    fxMode="float-shadow"
                    className="!p-0 border border-emerald-200/85 bg-gradient-to-br from-emerald-50 to-teal-50/80 dark:from-emerald-950/60 dark:to-teal-950/50 dark:border-emerald-500/30 shadow-sm"
                  >
                    <a
                      href="tel:0909097882"
                      className="flex items-center gap-2 px-3.5 py-2.5 typo-caption font-bold text-slate-800 dark:text-emerald-100 no-underline"
                      title="Gọi điện trực tiếp: 0909097882"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <WebIcon name="phone" className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      <div className="flex flex-col leading-tight min-w-0">
                        <span className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300">
                          {isEn ? 'Direct Call' : 'Gọi trực tiếp'}
                        </span>
                        <span className="text-[13px] font-extrabold tracking-tight truncate">0909097882</span>
                      </div>
                    </a>
                  </BentoCard>

                  <BentoCard
                    as="div"
                    variant="action"
                    fxMode="neon"
                    className="!p-0 border border-sky-200/85 bg-gradient-to-br from-sky-50 to-indigo-50/80 dark:from-sky-950/60 dark:to-indigo-950/50 dark:border-sky-500/30 shadow-sm"
                  >
                    <a
                      href="https://zalo.me/0909097882"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2.5 typo-caption font-bold text-slate-800 dark:text-sky-100 no-underline"
                      title="Kết nối Zalo: 0909097882"
                    >
                      <span className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                        <WebIcon name="message-circle" className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
                      </span>
                      <div className="flex flex-col leading-tight min-w-0">
                        <span className="text-[10.5px] font-semibold text-sky-700 dark:text-sky-300">
                          {isEn ? 'Quick Message' : 'Nhắn tin nhanh'}
                        </span>
                        <span className="text-[13px] font-extrabold tracking-tight truncate">Zalo Chat</span>
                      </div>
                    </a>
                  </BentoCard>
                </div>
              </BentoCard>

              {/* 2. GOOGLE CALENDAR APPOINTMENT SCHEDULER (BentoCard Main Container Light Mode) */}
              <BentoCard
                as="div"
                id="contact-info-container"
                variant="main"
                fxMode="minimal"
                isDarkText={true}
                data-element-name="Khung đặt lịch hẹn"
                data-element-type="card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="flex-1 min-w-0 w-full h-full min-h-[540px] lg:min-h-0 flex flex-col gap-[12px] overflow-hidden relative !p-[15px] bg-white/95 dark:bg-slate-900/85 border border-slate-200/85 dark:border-slate-700/60 shadow-lg"
              >
                <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                  <h3 className="typo-h5 font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300 m-0">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <WebIcon name="calendar" className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <span>{isEn ? 'Google Calendar Appointment Schedule' : 'Lịch hẹn trực tuyến Google Calendar'}</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                    {isEn ? 'Available' : 'Sẵn sàng'}
                  </span>
                </div>

                <div
                  id="contact-calendar-viewport"
                  className="relative z-10 flex-1 w-full h-full min-h-[470px] lg:min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[var(--radius-subcard,12px)] border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 shadow-inner flex flex-col p-0 m-0"
                  style={{ padding: '0px', margin: '0px', scrollbarWidth: 'none' }}
                >
                  <iframe
                    id="contact-calendar-iframe"
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
                    style={{
                      display: 'block',
                      border: 0,
                      borderRadius: 'var(--radius-subcard, 12px)',
                      width: '100%',
                      height: '100%',
                      minHeight: '470px',
                      padding: '0px',
                      margin: '0px',
                    }}
                    width="100%"
                    height="100%"
                    scrolling="no"
                    frameBorder="0"
                    title="Đặt lịch hẹn Google Calendar"
                    className="w-full h-full flex-1 rounded-[var(--radius-subcard,12px)] p-0 m-0 block"
                  />
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
