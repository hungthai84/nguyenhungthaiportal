'use client';

import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';

export interface ContactViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentTheme = 'liquid-glass', onShowNotification }) => {
  void currentTheme;
  void onShowNotification;
  const { language } = useLanguage();
  const isEn = language === 'en';
  const contactBannerVideo = getDefaultBannerVideoConfig('contact');

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
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[15px] overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y no-scrollbar box-border"
          >
            <div
              id="contact-main-content"
              data-element-parent="contact-main-card"
              className="w-full h-auto shrink-0 flex flex-col justify-start gap-[15px] min-w-0 box-border"
            >
              {/* 1. HERO BANNER */}
              <section
                id="contact-hero-banner"
                data-element-name="Banner phần đầu Đặt lịch"
                data-element-type="card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="bento-card glass-card w-full shrink-0 flex flex-col sm:flex-row items-stretch rounded-[14px] shadow-xl overflow-hidden relative p-[15px] gap-[15px] box-border transition-all duration-300"
                style={{
                  padding: '15px',
                  gap: '15px',
                  borderRadius: 'var(--radius-card, 14px)',
                  boxSizing: 'border-box',
                }}
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="w-full sm:w-[280px] md:w-[320px] lg:w-[360px] shrink-0 self-stretch flex flex-col rounded-[12px] overflow-hidden border relative" style={{ borderColor: 'var(--border-subcard)' }}>
                  <VideoBanner
                    videoId={contactBannerVideo.videoId}
                    title={contactBannerVideo.title}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-2.5 min-w-0 z-10">
                  <div className="flex items-center gap-2">
                    <span
                      id="contact-badge-label"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-badge font-bold uppercase tracking-wider shadow-sm"
                      style={{
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <WebIcon name="calendar" className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? 'Online Appointment' : 'Đặt lịch hẹn trực tuyến'}</span>
                    </span>
                  </div>
                  <h1
                    id="contact-heading-title"
                    className="typo-h2 font-bold tracking-tight text-left w-full m-0 p-0"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {isEn ? 'Schedule a Meeting' : 'Lịch hẹn & Trao đổi công việc'}
                  </h1>
                  <p
                    id="contact-desc-text"
                    className="typo-body text-left w-full m-0 p-0 leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {isEn
                      ? 'Select a convenient time slot via Google Calendar for executive recruitment, CX consulting, or project collaboration discussions.'
                      : 'Chọn thời gian phù hợp qua Google Calendar để trao đổi trực tiếp về cơ hội tuyển dụng, tư vấn chiến lược CX hoặc hợp tác dự án.'}
                  </p>
                  <p
                    id="contact-banner-quote"
                    className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left w-full whitespace-normal leading-snug"
                    style={{
                      color: 'var(--text-secondary)',
                      fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                      fontWeight: 600,
                      fontStyle: 'normal',
                    }}
                  >
                    &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
                  </p>
                </div>
              </section>

              {/* 2. GOOGLE CALENDAR APPOINTMENT SCHEDULER */}
              <div
                id="contact-info-container"
                data-element-name="Khung đặt lịch hẹn"
                data-element-type="card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="bento-card glass-card w-full flex-1 min-w-0 min-h-[500px] lg:min-h-[700px] h-full lg:self-stretch flex flex-col rounded-[14px] shadow-xl gap-[15px] overflow-hidden relative p-[15px] box-border transition-all duration-300"
                style={{
                  padding: '15px',
                  gap: '15px',
                  borderRadius: 'var(--radius-card, 14px)',
                  boxSizing: 'border-box',
                }}
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b" style={{ borderColor: 'var(--border-subcard)' }}>
                  <h3 className="typo-h5 font-bold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                    <WebIcon name="calendar" className="w-4 h-4 shrink-0" />
                    <span>{isEn ? 'Google Calendar Appointment Schedule' : 'Lịch hẹn trực tuyến Google Calendar'}</span>
                  </h3>
                </div>

                <div
                  id="contact-calendar-viewport"
                  className="relative z-10 flex-1 w-full h-full min-h-[600px] lg:min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[var(--radius-subcard,14px)] border border-[var(--border-subcard)] bg-transparent shadow-none flex flex-col p-0 m-0"
                  style={{ padding: '0px', margin: '0px', scrollbarWidth: 'none' }}
                >
                  <iframe
                    id="contact-calendar-iframe"
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
                    style={{
                      display: 'block',
                      border: 0,
                      borderRadius: 'var(--radius-subcard, 14px)',
                      width: '100%',
                      height: '100%',
                      minHeight: '700px',
                      padding: '0px',
                      margin: '0px',
                    }}
                    width="100%"
                    height="100%"
                    scrolling="no"
                    frameBorder="0"
                    title="Đặt lịch hẹn Google Calendar"
                    className="w-full h-full flex-1 min-h-[700px] rounded-[var(--radius-subcard,14px)] p-0 m-0 block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
