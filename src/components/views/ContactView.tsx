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
              {/* 1. GOOGLE CALENDAR APPOINTMENT SCHEDULER */}
              <BentoCard
                as="div"
                id="contact-info-container"
                variant="main"
                cardType="nested"
                elevation="elevated"
                surface="glass"
                accent="indigo"
                fxMode="minimal"
                isDarkText={true}
                data-element-name="Khung đặt lịch hẹn"
                data-element-type="card"
                data-section-card="true"
                data-element-page="contact"
                data-element-parent="contact-main-card"
                className="flex-1 min-w-0 w-full h-full min-h-[540px] lg:min-h-0 flex flex-col gap-3 overflow-hidden relative !p-4 bg-white/95 dark:bg-slate-900/85 border border-slate-200/85 dark:border-slate-700/60"
              >
                <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-700/60">
                  <h3 className="bento-card-subtitle font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300 m-0">
                    <span className="w-7 h-7 rounded-[var(--subcard-radius,11px)] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <WebIcon name="calendar" className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <span>{isEn ? 'Google Calendar Appointment Schedule' : 'Lịch hẹn trực tuyến Google Calendar'}</span>
                  </h3>
                  <span className="bento-card-label font-bold text-emerald-700 dark:text-emerald-300">
                    {isEn ? 'Available' : 'Sẵn sàng'}
                  </span>
                </div>

                <div
                  id="contact-calendar-viewport"
                  className="relative z-10 flex-1 w-full h-full min-h-[470px] lg:min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[var(--subcard-radius,11px)] border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 shadow-inner flex flex-col p-0 m-0"
                  style={{ padding: '0px', margin: '0px', scrollbarWidth: 'none' }}
                >
                  <iframe
                    id="contact-calendar-iframe"
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true"
                    style={{
                      display: 'block',
                      border: 0,
                      borderRadius: 'var(--subcard-radius, 11px)',
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
                    className="w-full h-full flex-1 rounded-[var(--subcard-radius,11px)] p-0 m-0 block"
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
