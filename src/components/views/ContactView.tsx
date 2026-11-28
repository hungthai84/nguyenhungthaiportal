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
            className="main-card-scroll-viewport w-full h-full flex-1 min-h-0 flex flex-col items-stretch justify-start overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y no-scrollbar box-border"
          >
            <div
              id="contact-main-content"
              data-element-parent="contact-main-card"
              className="w-full h-full min-h-0 flex-1 flex flex-col lg:flex-row items-stretch justify-start gap-[15px] min-w-0 box-border"
            >
              {/* 1. HERO BANNER (CÙNG HÀNG VỚI KHUNG LỊCH TRÊN DESKTOP - VIDEO LÀM HÌNH NỀN BANNER) */}
              <section
                id="contact-hero-banner"
                data-element-name="Banner phần đầu Đặt lịch"
                data-element-type="banner-card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="banner-card bento-card glass-card group w-full min-h-[210px] sm:min-h-[230px] lg:min-h-0 lg:self-stretch shrink-0 h-auto lg:h-full flex flex-col justify-between rounded-[14px] shadow-xl overflow-hidden relative p-[15px] gap-[15px] box-border transition-all duration-300"
                style={{
                  padding: '15px',
                  gap: '15px',
                  borderRadius: 'var(--radius-card, 14px)',
                  boxSizing: 'border-box',
                }}
              >
                {/* Video làm hình nền toàn khung Banner Đặt lịch */}
                <div
                  id="contact-banner-video-bg"
                  aria-hidden="true"
                  className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0"
                >
                  <VideoBanner
                    videoId={contactBannerVideo.videoId}
                    title={contactBannerVideo.title}
                    className="w-full h-full"
                    objectPosition="50% 25%"
                    backgroundMode
                  />
                </div>
                <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

                {/* Nội dung thông điệp đặt lịch nổi trên nền video */}
                <div className="relative z-10 flex-1 flex flex-col justify-between gap-3 min-w-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        id="contact-badge-label"
                        className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-badge font-bold uppercase tracking-wider shadow-sm backdrop-blur-md"
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
                      className="typo-h3 sm:typo-h2 font-bold tracking-tight text-left w-full m-0 p-0 leading-tight"
                      data-card-title="true"
                      style={{
                        color: 'var(--text-primary)',
                        textShadow: '0 1px 10px rgba(0, 0, 0, 0.28)',
                      }}
                    >
                      {isEn ? 'Schedule a Meeting' : 'Lịch hẹn & Trao đổi'}
                    </h1>
                    <p
                      id="contact-desc-text"
                      className="typo-body text-left w-full m-0 p-2.5 rounded-[12px] leading-relaxed text-[13px] line-clamp-4 backdrop-blur-md border"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'color-mix(in srgb, var(--bg-subcard, rgba(255,255,255,0.78)) 78%, transparent)',
                        borderColor: 'var(--border-subcard)',
                      }}
                    >
                      {isEn
                        ? 'Select a convenient time slot via Google Calendar for executive recruitment, CX consulting, or project collaboration discussions.'
                        : 'Chọn thời gian phù hợp qua Google Calendar để trao đổi trực tiếp về cơ hội tuyển dụng, tư vấn chiến lược CX hoặc hợp tác dự án.'}
                    </p>
                  </div>

                  {/* Kênh liên hệ bổ trợ nhanh & Câu trích dẫn */}
                  <div className="mt-auto flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
                      <a
                        href="tel:0909097882"
                        className="flex items-center gap-1.5 p-2 rounded-lg backdrop-blur-md border border-[var(--border-subcard)] typo-caption font-bold text-[var(--text-primary)] transition-colors hover:brightness-105"
                        style={{
                          background: 'color-mix(in srgb, var(--bg-subcard, rgba(255,255,255,0.85)) 85%, transparent)',
                        }}
                        title="Gọi điện trực tiếp: 0909097882"
                      >
                        <WebIcon name="phone" className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                        <span className="truncate">0909097882</span>
                      </a>
                      <a
                        href="https://zalo.me/0909097882"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 p-2 rounded-lg backdrop-blur-md border border-[var(--border-subcard)] typo-caption font-bold text-[var(--text-primary)] transition-colors hover:brightness-105"
                        style={{
                          background: 'color-mix(in srgb, var(--bg-subcard, rgba(255,255,255,0.85)) 85%, transparent)',
                        }}
                        title="Kết nối Zalo: 0909097882"
                      >
                        <WebIcon name="message-circle" className="w-3.5 h-3.5 shrink-0 text-sky-500" />
                        <span className="truncate">Zalo Chat</span>
                      </a>
                    </div>

                    <p
                      id="contact-banner-quote"
                      className="banner-quote typo-h4 font-handwriting font-quote not-italic font-semibold select-none text-left w-full whitespace-normal leading-snug m-0"
                      style={{
                        color: '#FFFFFF',
                        fontFamily: "var(--font-quote, 'Dancing Script', cursive)",
                        fontWeight: 700,
                        fontStyle: 'normal',
                        textShadow: '0 2px 6px rgba(0, 0, 0, 0.78), 0 1px 2px rgba(0, 0, 0, 0.9)',
                      }}
                    >
                      &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. GOOGLE CALENDAR APPOINTMENT SCHEDULER (CÙNG HÀNG) */}
              <div
                id="contact-info-container"
                data-element-name="Khung đặt lịch hẹn"
                data-element-type="card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="bento-card glass-card flex-1 min-w-0 w-full h-full min-h-[550px] lg:min-h-0 flex flex-col rounded-[14px] shadow-xl gap-[12px] overflow-hidden relative p-[15px] box-border transition-all duration-300"
                style={{
                  padding: '15px',
                  gap: '12px',
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
                  className="relative z-10 flex-1 w-full h-full min-h-[480px] lg:min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[var(--radius-subcard,14px)] border border-[var(--border-subcard)] bg-transparent shadow-none flex flex-col p-0 m-0"
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
                      minHeight: '480px',
                      padding: '0px',
                      margin: '0px',
                    }}
                    width="100%"
                    height="100%"
                    scrolling="no"
                    frameBorder="0"
                    title="Đặt lịch hẹn Google Calendar"
                    className="w-full h-full flex-1 rounded-[var(--radius-subcard,14px)] p-0 m-0 block"
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
