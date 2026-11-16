'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

export interface ContactViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentTheme = 'light-glass' }) => {
  void currentTheme;
  const bookingCardRef = useRef<HTMLDivElement>(null);
  const [syncedBannerHeight, setSyncedBannerHeight] = useState<number | null>(null);

  useEffect(() => {
    const syncHeight = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 1024) {
        setSyncedBannerHeight(null);
        return;
      }
      if (bookingCardRef.current) {
        const h = Math.round(bookingCardRef.current.getBoundingClientRect().height);
        if (h > 0) setSyncedBannerHeight(h);
      }
    };

    syncHeight();
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => syncHeight()) : null;
    if (observer && bookingCardRef.current) {
      observer.observe(bookingCardRef.current);
    }
    window.addEventListener('resize', syncHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, []);

  return (
    <div
      id="contact-page-container"
      data-element-name="Trang Liên Hệ Kết Nối"
      data-element-type="container"
      data-element-page="contact"
      data-element-parent="global-content-viewport"
      className="main-card w-full min-w-0 h-full max-h-full mx-auto flex flex-col lg:flex-row items-stretch p-[25px] rounded-[20px] gap-[15px] overflow-y-auto lg:overflow-hidden font-play text-left animate-fadeIn flex-1 min-h-0 box-border"
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* 1. HERO BANNER TRANG LIÊN HỆ (CHIỀU CAO BẰNG CHIỀU CAO THẺ ĐẶT LỊCH HẸN) */}
      <section
        id="contact-hero-banner"
        data-element-name="Banner Liên Hệ & Kết Nối"
        data-element-type="banner-card"
        data-section-card="true"
        data-element-page="contact"
        data-element-parent="contact-page-container"
        className="banner-card hero-banner w-full lg:w-[235px] lg:min-w-[235px] lg:max-w-[235px] lg:flex-[0_0_235px] xl:w-[255px] xl:min-w-[255px] xl:max-w-[255px] xl:flex-[0_0_255px] lg:self-stretch rounded-[14px] relative overflow-hidden shadow-xl text-white z-30 flex flex-col justify-between p-[15px] box-border"
        style={{
          padding: '15px',
          borderRadius: '14px',
          boxSizing: 'border-box',
          ...(syncedBannerHeight ? { height: `${syncedBannerHeight}px`, minHeight: `${syncedBannerHeight}px` } : {}),
        }}
      >
        {/* Background Image & Overlay */}
        <div id="contact-banner-img-wrap" className="absolute inset-0 pointer-events-none overflow-hidden rounded-[14px]">
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591947/Li%C3%AAn_h%E1%BB%87_2.png"
            alt="Banner Liên hệ & Kết nối"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div id="contact-banner-overlay" className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
        </div>

        {/* Hàng trên: Icon + Tiêu đề, Câu nói nằm ngay dưới tiêu đề */}
        <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
          <div className="flex items-start gap-2 w-full min-w-0" style={{ color: '#818cf8' }}>
            <WebIcon
              name="mail"
              className="w-[18px] h-[18px] shrink-0 mt-1 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#818cf8]"
              style={{ color: '#818cf8', width: '18px', height: '18px', fontSize: '18px' }}
            />
            <h1
              id="contact-banner-h1"
              className="typo-h1 font-play not-italic tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#818cf8] whitespace-normal min-w-0"
              style={{
                color: '#818cf8',
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              Liên Hệ • Kết Nối
            </h1>
          </div>
          <p
            id="contact-banner-quote"
            className="font-handwriting font-italianno not-italic text-[20px] sm:text-[22px] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left w-full whitespace-normal leading-snug"
            style={{ color: '#818cf8', fontFamily: "'Italianno', cursive, sans-serif", fontWeight: 400, fontStyle: 'normal' }}
          >
            &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
          </p>
        </div>
      </section>

      {/* 2. KHUNG NỘI DUNG CHÍNH (ĐẶT LỊCH HẸN FULL WIDTH & FULL HEIGHT) */}
      <div
        ref={bookingCardRef}
        id="contact-info-container"
        data-element-name="Khung đặt lịch hẹn trực tuyến"
        data-element-type="card"
        data-section-card="true"
        data-element-page="contact"
        data-element-parent="contact-page-container"
        className="bento-card glass-card w-full flex-1 min-w-0 min-h-[540px] lg:min-h-0 h-full lg:self-stretch flex flex-col rounded-[14px] shadow-xl gap-0 overflow-hidden relative p-0 box-border"
        style={{
          padding: '0px',
          gap: '0px',
          borderRadius: '14px',
          boxSizing: 'border-box',
        }}
      >
        {/* VÙNG HIỂN THỊ IFRAME GOOGLE CALENDAR MAX FULL WIDTH & MAX FULL HEIGHT */}
        <div
          id="contact-calendar-viewport"
          className="flex-1 w-full h-full min-h-[540px] lg:min-h-0 overflow-hidden rounded-[14px] border-0 bg-transparent shadow-none flex flex-col p-0 m-0"
          style={{ padding: '0px', margin: '0px' }}
        >
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
            style={{
              display: 'block',
              border: 0,
              borderRadius: '14px',
              width: '100%',
              height: '100%',
              padding: '0px',
              margin: '0px',
            }}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Đặt lịch hẹn Google Calendar"
            className="w-full h-full flex-1 min-h-[540px] lg:min-h-0 rounded-[14px] p-0 m-0 block"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactView;
