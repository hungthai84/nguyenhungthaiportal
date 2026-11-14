'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion } from 'motion/react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useToast } from '@/components/ui/Toast';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';

export interface ContactViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentTheme = 'light-glass', onShowNotification }) => {
  void currentTheme;
  const { showToast } = useToast();
  const { cardStyle } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cleanCardStyle } = rawCardStyle as any;
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
      className="w-full h-full max-h-full flex flex-col lg:flex-row items-stretch p-[15px] gap-[15px] overflow-y-auto lg:overflow-hidden font-play text-left animate-fadeIn flex-1 min-h-0"
      style={{
        ...cleanCardStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
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
        className="banner-card hero-banner w-full lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] lg:flex-[0_0_400px] lg:self-stretch rounded-[14px] relative overflow-hidden border border-white/80 dark:border-white/20 shadow-xl text-white z-30 flex flex-col justify-between p-[15px] box-border"
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
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
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
          <div className="flex items-center gap-2 shrink-0" style={{ color: '#818cf8' }}>
            <WebIcon
              name="mail"
              className="w-[18px] h-[18px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#818cf8]"
              style={{ color: '#818cf8', width: '18px', height: '18px', fontSize: '18px' }}
            />
            <h1
              id="contact-banner-h1"
              className="text-[18px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#818cf8] whitespace-nowrap"
              style={{
                color: '#818cf8',
                fontSize: '18px',
                fontWeight: 700,
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
            className="font-handwriting font-italianno not-italic text-[18px] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left w-full whitespace-normal leading-snug"
            style={{ color: '#818cf8', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '18px', fontWeight: 400, fontStyle: 'normal' }}
          >
            &quot;Luôn sẵn sàng lắng nghe và đồng hành ♡&quot;
          </p>
        </div>

        {/* Hàng dưới: Trạng thái & Thông tin liên hệ nhanh */}
        <div id="contact-hero-banner-controls" className="relative z-30 flex flex-col items-stretch gap-3 mt-auto w-full">
          <div className="flex flex-col items-stretch gap-2">
            <span className="px-3 py-1.5 rounded-full text-[11px] font-bold font-play bg-white/95 dark:bg-[#111827]/95 text-slate-800 dark:text-[#F8FAFC] border border-indigo-300 dark:border-indigo-500/50 shadow-md backdrop-blur-md inline-flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sẵn sàng kết nối 24/7</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-[11px] font-bold font-play bg-white/95 dark:bg-[#111827]/95 text-indigo-950 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/50 shadow-md backdrop-blur-md inline-flex items-center gap-1.5 justify-center">
              <WebIcon name="globe" className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Toàn quốc • Global</span>
            </span>
          </div>

          <div className="flex flex-col items-stretch gap-2">
            <a
              href="tel:+840909097882"
              className="px-3 py-1.5 rounded-full text-[11px] font-bold font-play bg-white/95 dark:bg-[#111827]/95 text-slate-700 dark:text-[#E2E8F0] border border-slate-300 dark:border-[#334155] shadow-md backdrop-blur-md flex items-center gap-1.5 justify-center hover:bg-indigo-50 dark:hover:bg-[#1F2937] transition"
            >
              <WebIcon name="phone" className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>+84 0909097882</span>
            </a>

            <a
              href="mailto:hungthai84@gmail.com"
              className="px-3 py-2 rounded-full text-[12px] font-bold font-play bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 text-white shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-1.5 justify-center border border-white/60"
            >
              <WebIcon name="mail" className="w-4 h-4 shrink-0" />
              <span>Gửi Email Ngay</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. KHUNG NỘI DUNG CHÍNH (ĐẶT LỊCH HẸN) */}
      <div
        ref={bookingCardRef}
        id="contact-info-container"
        data-element-name="Khung đặt lịch hẹn trực tuyến"
        data-element-type="card"
        data-section-card="true"
        data-element-page="contact"
        data-element-parent="contact-page-container"
        className="bento-card glass-card flex-1 min-w-0 min-h-0 lg:self-stretch flex flex-col justify-between bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-[14px] shadow-xl backdrop-blur-xl gap-[15px] overflow-hidden relative p-[15px] box-border"
        style={{
          ...cleanCardStyle,
          padding: '15px',
          gap: '15px',
          borderRadius: '14px',
          boxSizing: 'border-box',
        }}
      >
        {/* TOP HEADER BAR CỦA KHUNG LỊCH HẸN */}
        <div
          id="contact-card-header"
          className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-indigo-100 dark:border-slate-800 shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-xs">
              HT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="card-title text-indigo-900 dark:text-indigo-200" style={{ fontSize: '18px' }}>
                  Đặt Lịch Hẹn Trực Tuyến Với Anh Hùng Thái
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Google Calendar Sync
                </span>
              </div>
              <p className="text-[15px] text-slate-500 dark:text-slate-400">
                Lựa chọn thời gian phù hợp bên dưới để nhận được xác nhận lịch hẹn tự động
              </p>
            </div>
          </div>
        </div>

        {/* VÙNG HIỂN THỊ IFRAME GOOGLE CALENDAR */}
        <div
          id="contact-calendar-viewport"
          className="flex-1 overflow-hidden rounded-[14px] border border-slate-200/80 dark:border-slate-700 bg-white shadow-xs flex flex-col min-h-0"
        >
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
            style={{ border: 0, borderRadius: '14px' }}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Đặt lịch hẹn Google Calendar"
            className="w-full flex-1 h-full min-h-[420px] rounded-[14px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactView;
