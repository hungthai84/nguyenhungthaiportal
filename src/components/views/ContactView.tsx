'use client';

import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

export interface ContactViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentTheme = 'light-multicolor-glass' }) => {
  void currentTheme;

  return (
    <div
      id="contact-page-container"
      data-element-name="Trang Liên Hệ Kết Nối"
      data-element-type="container"
      data-element-page="contact"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play text-left animate-fadeIn rounded-none box-border"
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div
        id="contact-cards-track"
        data-element-name="Track căn giữa Liên Hệ"
        data-element-type="container"
        data-element-page="contact"
        data-element-parent="contact-page-container"
        className="page-cards-track"
      >
        <div
          id="contact-main-card"
          data-main-card="true"
          data-element-name="Thẻ chính Trang Liên Hệ"
          data-element-type="card"
          data-element-page="contact"
          data-element-parent="contact-cards-track"
          className="page-main-card flex flex-col items-stretch p-[15px] gap-[15px] rounded-[14px] overflow-y-auto lg:overflow-hidden font-play text-left box-border"
        >
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch gap-[15px]">
      {/* 1. HERO BANNER TRANG LIÊN HỆ (CHIỀU CAO CO GIÃN ĐỒNG BỘ THEO KHUNG ĐẶT LỊCH HẸN) */}
      <section
        id="contact-hero-banner"
        data-element-name="Banner Liên Hệ & Kết Nối"
        data-element-type="banner-card"
        data-section-card="true"
        data-element-page="contact"
        data-element-parent="contact-main-card"
        className="banner-card bento-card glass-card group w-full lg:w-[235px] lg:min-w-[235px] lg:max-w-[235px] lg:flex-[0_0_235px] xl:w-[255px] xl:min-w-[255px] xl:max-w-[255px] xl:flex-[0_0_255px] lg:self-stretch rounded-[14px] border relative overflow-hidden text-[var(--text-primary)] z-30 flex flex-col justify-between p-[15px] box-border shadow-xl transition-all duration-300"
        style={{
          padding: '15px',
          borderRadius: '14px',
          boxSizing: 'border-box',
        }}
      >
        {/* Background Image & Scrim */}
        <div className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[14px] z-0">
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591947/Li%C3%AAn_h%E1%BB%87_2.png"
            alt="Banner Liên hệ & Kết nối"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center rounded-[14px] transition-all duration-700"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[14px] z-0" />

        {/* Hàng trên: Icon + Tiêu đề, Câu nói nằm ngay dưới tiêu đề */}
        <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
          <div className="card-header-sync flex items-start gap-2 w-full min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon
              name="mail"
              className="w-[18px] h-[18px] shrink-0 mt-1"
            />
            <h1
              id="contact-banner-h1"
              className="typo-h3 card-title-synced font-play not-italic tracking-tight leading-tight whitespace-normal min-w-0"
              data-card-title="true"
            >
              Liên Hệ • Kết Nối
            </h1>
          </div>
          <p
            id="contact-banner-quote"
            className="typo-h2 font-moon-dance not-italic font-normal select-none text-left w-full whitespace-normal leading-snug"
            style={{ color: 'var(--text-secondary)', fontFamily: "'Moon Dance', cursive, sans-serif", fontWeight: 400, fontStyle: 'normal' }}
          >
            &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
          </p>
        </div>
      </section>

      {/* 2. KHUNG NỘI DUNG CHÍNH (ĐẶT LỊCH HẸN FULL WIDTH & FULL HEIGHT) */}
      <div
        id="contact-info-container"
        data-element-name="Khung đặt lịch hẹn trực tuyến"
        data-element-type="card"
        data-section-card="true"
        data-element-page="contact"
        data-element-parent="contact-main-card"
        className="bento-card glass-card w-full flex-1 min-w-0 min-h-[480px] lg:min-h-0 h-full lg:self-stretch flex flex-col rounded-[14px] shadow-xl gap-[15px] overflow-hidden relative p-[15px] box-border"
        style={{
          padding: '15px',
          gap: '15px',
          borderRadius: '14px',
          boxSizing: 'border-box',
        }}
      >
        {/* VÙNG HIỂN THỊ IFRAME GOOGLE CALENDAR MAX FULL WIDTH & MAX FULL HEIGHT */}
        <div
          id="contact-calendar-viewport"
          className="flex-1 w-full h-full min-h-[480px] lg:min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[14px] border-0 bg-transparent shadow-none flex flex-col p-0 m-0"
          style={{ padding: '0px', margin: '0px', scrollbarWidth: 'none' }}
        >
          <iframe
            id="contact-calendar-iframe"
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
            style={{
              display: 'block',
              border: 0,
              borderRadius: '14px',
              width: '100%',
              height: '100%',
              minHeight: '740px',
              padding: '0px',
              margin: '0px',
            }}
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="0"
            title="Đặt lịch hẹn Google Calendar"
            className="w-full h-full flex-1 min-h-[740px] rounded-[14px] p-0 m-0 block"
          />
        </div>
      </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
