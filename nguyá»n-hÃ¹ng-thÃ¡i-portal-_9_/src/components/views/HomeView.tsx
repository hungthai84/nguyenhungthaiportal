'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
import { DRIVE_AVATARS, driveVideoUrl } from '@/config/driveMediaLinks';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';
import { getCardStyleConfig, normalizeCardStyle } from '@/config/ui/cardStyles';

export interface HomeViewProps {
  slideIndex?: number;
  currentTheme?: SiteTheme;
  onNavigateContact: () => void;
  onNavigatePage?: (pageIndex: number) => void;
  onOpenPagesCarousel?: () => void;
  onShowNotification?: (msg: string) => void;
}

export type HomeScreenId = 1;

// Video 1 Trang chủ: Phong Thái Lãnh Đạo & Tầm Nhìn (Auto Play, Loop vòng lặp, mặc định Mute)
export const HOME_VIDEO_1_ID = '1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp';
export const HOME_VIDEO_1_SRC =
  'https://cdn.scena.ai/project/10169/eae59f7007421658e611c298c206755ca060c878d07087694c06935208b9d8f9.mp4';

// Video 2 Trang chủ (dùng làm lớp video 2 cho trình phát tròn trên Màn hình 1)
export const HOME_VIDEO_2_ID = '12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm';

export interface VideoScreenItem {
  id: HomeScreenId;
  label: string;
  badge: string;
  title: string;
  description: string;
  accentColor: string;
  heroBadge: string;
  heroIcon: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentTheme = 'liquid-glass',
  onNavigateContact,
  onNavigatePage,
  onShowNotification,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { isDark: themeIsDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const homeContainerRef = useRef<HTMLDivElement | null>(null);
  const hasInitializedScrollRef = useRef<boolean>(false);

  const isDark = themeIsDark || getCardStyleConfig(normalizeCardStyle(currentTheme)).isDark;

  const [showCircleVideo, setShowCircleVideo] = useState<boolean>(false);
  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

  // Màn hình duy nhất của Trang chủ sử dụng 100% dữ liệu thực tế từ hồ sơ
  const HOME_SCREEN_1: VideoScreenItem = {
    id: 1,
    label: isEn ? 'Screen 1' : 'Màn hình 1',
    badge: isEn ? 'Overview' : 'Tổng quan',
    title: isEn ? 'Leadership Presence & Vision' : 'Phong Thái Lãnh Đạo & Tầm Nhìn',
    description: isEn
      ? 'Executive presence in premier customer experience management'
      : 'Phong thái chuyên gia quản trị trải nghiệm khách hàng cao cấp',
    accentColor: '#38BDF8',
    heroBadge: isEn ? 'Leadership Vision' : 'Tầm Nhìn Lãnh Đạo',
    heroIcon: 'target',
  };

  // Đo kích thước khung nhìn & container để căn giữa Main Card và đồng bộ chuẩn 100% bằng header
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [homeContainerWidth, setHomeContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [exactHeaderWidth, setExactHeaderWidth] = useState<number>(0);

  useEffect(() => {
    const container = homeContainerRef.current;
    const updateWidths = () => {
      const headerEl = document.getElementById('app-header');
      if (headerEl) {
        const w = headerEl.getBoundingClientRect().width;
        if (w > 0) {
          setExactHeaderWidth(w);
        }
      }
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      if (container) {
        setHomeContainerWidth(container.clientWidth || window.innerWidth);
      }
    };
    updateWidths();
    const headerEl = document.getElementById('app-header');
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro) {
      if (container) ro.observe(container);
      if (headerEl) ro.observe(headerEl);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateWidths);
    };
  }, []);

  const peekReserve = viewportWidth <= 1023 ? 32 : 112;
  const fallbackWidth = Math.min(1250, Math.max(260, viewportWidth - peekReserve));
  const homeCardWidth = exactHeaderWidth > 0 ? exactHeaderWidth : fallbackWidth;
  const homeSideInset = Math.max(0, (homeContainerWidth - homeCardWidth) / 2);

  const getCenteredScrollLeftForCard = useCallback(() => {
    const container = homeContainerRef.current;
    if (!container) return 0;
    const cardEl = document.getElementById('home-main-card-1');
    if (!cardEl) return 0;
    const headerEl = document.getElementById('app-header');
    const containerRect = container.getBoundingClientRect();
    const headerRect = headerEl?.getBoundingClientRect();
    const desiredCenterX =
      headerRect && headerRect.width > 0
        ? headerRect.left + headerRect.width / 2
        : containerRect.left + container.clientLeft + container.clientWidth / 2;
    const desiredLeftInContainer =
      desiredCenterX - (containerRect.left + container.clientLeft) - cardEl.offsetWidth / 2;
    return Math.max(0, Math.round(cardEl.offsetLeft - desiredLeftInContainer));
  }, []);

  const centerHomeCard = useCallback(() => {
    const container = homeContainerRef.current;
    if (!container) return;
    const targetLeft = getCenteredScrollLeftForCard();
    if (Math.abs(container.scrollLeft - targetLeft) > 1) {
      container.scrollLeft = targetLeft;
    }
    evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
  }, [getCenteredScrollLeftForCard]);

  useLayoutEffect(() => {
    if (!hasInitializedScrollRef.current && homeContainerWidth > 0) {
      hasInitializedScrollRef.current = true;
      centerHomeCard();
    }
  }, [homeContainerWidth, centerHomeCard]);

  useEffect(() => {
    const container = homeContainerRef.current;
    if (!container) return;
    const raf = requestAnimationFrame(() => {
      const expectedLeft = getCenteredScrollLeftForCard();
      if (Math.abs(container.scrollLeft - expectedLeft) > 1) {
        container.scrollLeft = expectedLeft;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [homeCardWidth, homeContainerWidth, getCenteredScrollLeftForCard]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 0, slide: 0 },
      })
    );
  }, []);

  useEffect(() => {
    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (
        detail &&
        (detail.tabIndex === undefined || detail.tabIndex === 0) &&
        typeof detail.slide === 'number'
      ) {
        centerHomeCard();
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, [centerHomeCard]);

  const handleQuickNavigateAbout = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPageFlip();
    onNavigatePage?.(2);
  };

  const handleQuickNavigateContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPageFlip();
    onNavigateContact();
  };

  const handleQuickNavigatePdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playTap();
    onNavigatePage?.(16);
    onShowNotification?.(
      isEn ? 'Opening CV Resume PDF preview' : 'Đang mở bản xem trước Hồ sơ CV PDF'
    );
  };

  const contactSocialLinks: Array<{
    id: string;
    icon: string;
    label: string;
    href?: string;
    external?: boolean;
    onClick?: (e: React.MouseEvent) => void;
  }> = [
    {
      id: 'home-social-email',
      icon: 'mail',
      label: 'Email · hungthai84@gmail.com',
      href: 'mailto:hungthai84@gmail.com',
    },
    {
      id: 'home-social-phone',
      icon: 'phone',
      label: 'Zalo & Điện thoại · +84 0909097882',
      href: 'https://zalo.me/0909097882',
      external: true,
    },
    {
      id: 'home-social-linkedin',
      icon: 'linkedin',
      label: 'LinkedIn · linkedin.com/in/hungthai84',
      href: 'https://www.linkedin.com/in/hungthai84/',
      external: true,
    },
    {
      id: 'home-social-website',
      icon: 'globe',
      label: 'Website · nguyenhungthai.powerservice.one',
      href: 'https://nguyenhungthai.powerservice.one/',
      external: true,
    },
    {
      id: 'home-social-pdf',
      icon: 'file-text',
      label: isEn ? 'Download CV Resume PDF' : 'Xem & Tải Hồ sơ CV PDF',
      onClick: handleQuickNavigatePdf,
    },
  ];

  // Nền aurora pastel dịu nhẹ cho Trang chủ
  const renderAuroraLayer = () => (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div
        className="absolute -left-24 -top-24 w-[360px] h-[360px] rounded-full blur-[72px] opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, rgba(168, 85, 247, 0.14) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(244, 114, 182, 0.34) 0%, rgba(192, 132, 252, 0.22) 48%, transparent 76%)',
        }}
      />
      <div
        className="absolute right-[-60px] top-[15%] w-[380px] h-[380px] rounded-full blur-[80px] opacity-55"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(99, 102, 241, 0.12) 55%, transparent 78%)'
            : 'radial-gradient(circle, rgba(196, 181, 253, 0.34) 0%, rgba(147, 197, 253, 0.22) 52%, transparent 78%)',
        }}
      />
      <div
        className="absolute left-[38%] -bottom-24 w-[320px] h-[260px] rounded-full blur-[70px] opacity-50"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, transparent 75%)'
            : 'radial-gradient(circle, rgba(254, 215, 170, 0.32) 0%, rgba(251, 207, 232, 0.18) 55%, transparent 78%)',
        }}
      />
    </div>
  );

  return (
    <div className="relative w-full max-w-full min-w-0 min-h-0 h-full flex-1 flex flex-col overflow-hidden">
      {/* Khung chứa Main Card Trang Chủ */}
      <div
        ref={homeContainerRef}
        id="home-page-container"
        data-element-name="Trang chủ cá nhân"
        data-element-type="container"
        data-element-page="home"
        data-element-parent="global-content-viewport"
        data-no-wheel-horizontal="true"
        suppressHydrationWarning
        style={{
          touchAction: 'pan-y',
          ['--about-card-w' as any]: `${homeCardWidth}px`,
          ['--about-side-inset' as any]: `${homeSideInset}px`,
        }}
        className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-hidden overflow-y-hidden no-scrollbar select-none font-play rounded-none box-border"
      >
        <div
          id="home-cards-track"
          data-element-name="Track căn giữa Trang chủ"
          data-element-type="container"
          data-element-page="home"
          data-element-parent="home-page-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: '15px',
            rowGap: '15px',
            columnGap: '15px',
            height: '100%',
            minHeight: '100%',
            width: 'max-content',
            paddingLeft: `${homeSideInset}px`,
            paddingRight: `${homeSideInset}px`,
            boxSizing: 'border-box',
          }}
          className="page-cards-track flex flex-row items-stretch justify-start gap-[15px] h-full min-h-full box-border"
        >
          <div
            id="home-main-card-1"
            data-main-card="true"
            data-element-name={`Thẻ chính Trang chủ - ${HOME_SCREEN_1.label}`}
            data-element-type="card"
            data-element-page="home"
            data-element-parent="home-cards-track"
            style={{
              width: `${homeCardWidth}px`,
              maxWidth: '1250px',
              minWidth: `${homeCardWidth}px`,
              flex: `0 0 ${homeCardWidth}px`,
              height: '100%',
              minHeight: '100%',
              padding: 'var(--main-card-padding, 15px)',
              gap: '15px',
              borderRadius: 'var(--radius-main, 30px)',
            }}
            className={cn(
              'page-main-card home-screen-main-card relative shrink-0 h-full min-h-full flex flex-col justify-between overflow-hidden select-none font-play box-border opacity-100'
            )}
          >
            {/* MÀN HÌNH 1: HERO SPLIT CHÂN DUNG & VIDEO PHONG THÁI LÃNH ĐẠO */}
            <div
              id="home-hero-stage-1"
              data-section-card="true"
              data-element-name="Card chính Trang chủ 2 cột ngang"
              data-element-type="card"
              data-element-page="home"
              data-element-parent="home-main-card-1"
              className="bento-card glass-card home-split-hero-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-center overflow-y-auto md:overflow-hidden rounded-[var(--radius-card,24px)] box-border text-left !p-0"
              style={{ borderRadius: 'var(--radius-card, 24px)' }}
            >
                    {renderAuroraLayer()}

                    {/* Lưới 2 chiều ngang chuẩn responsive */}
                    <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 lg:gap-10 px-6 py-6 sm:px-9 sm:py-8 lg:px-14 lg:py-10">
                      {/* Cột Trái: Tiêu đề chính, giới thiệu, 2 nút CTA ngang & dãy icon liên kết */}
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-7 flex flex-col justify-center items-start gap-4 sm:gap-5 min-w-0 order-2 md:order-1"
                      >
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border typo-badge font-semibold"
                          style={{
                            background: isDark
                              ? 'rgba(255, 255, 255, 0.08)'
                              : 'rgba(255, 255, 255, 0.65)',
                            borderColor: isDark
                              ? 'rgba(255, 255, 255, 0.16)'
                              : 'rgba(255, 255, 255, 0.85)',
                            color: 'var(--text-link, var(--color-primary))',
                          }}
                        >
                          <WebIcon name="award" className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isEn
                              ? '22+ Years · CX & Contact Center Leader'
                              : '22+ Năm Thực Chiến · Chuyên Gia CSKH & CX'}
                          </span>
                        </div>

                        <div className="space-y-1.5 max-w-xl">
                          <h1
                            id="home-hero-heading"
                            className="font-play font-extrabold tracking-tight leading-[1.12] text-[clamp(1.75rem,3.6vw,3.15rem)]"
                            style={{ color: 'var(--text-heading, var(--text-primary))' }}
                          >
                            <span className="block">Nguyễn Hùng Thái</span>
                            <span
                              className="block mt-0.5 text-[clamp(1.25rem,2.4vw,2.15rem)] font-bold"
                              style={{ color: 'var(--text-link, var(--color-primary))' }}
                            >
                              {isEn
                                ? 'Customer Experience & Digital Transformation'
                                : 'Vận Hành CSKH & Chuyển Đổi Số'}
                            </span>
                          </h1>
                        </div>

                        <p
                          className="typo-body leading-relaxed max-w-lg font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {isEn
                            ? 'Over 22 years designing, standardizing, and leading large-scale Contact Center & omnichannel CRM operations across telecom, e-commerce, finance, and fintech. Effective – Human-centric – Sustainable.'
                            : 'Hơn 22 năm kinh nghiệm thực chiến kiến tạo, chuẩn hóa quy trình và điều hành hệ thống Contact Center quy mô lớn tại các doanh nghiệp hàng đầu. Hiệu quả – Nhân văn – Bền vững.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                          <button
                            id="home-hero-cta-primary"
                            type="button"
                            onClick={handleQuickNavigateAbout}
                            onMouseEnter={() => SoundEngine.playTap()}
                            style={{
                              background: 'var(--bg-button-primary, linear-gradient(135deg, #3B66F5, #2563EB))',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }}
                            className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-[14px] font-bold typo-button shadow-[0_10px_24px_rgba(37,99,235,0.28)] hover:brightness-105 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                          >
                            <WebIcon name="user-round" className="w-4 h-4 shrink-0" />
                            <span>{isEn ? 'Explore Profile' : 'Hồ Sơ Năng Lực'}</span>
                          </button>

                          <button
                            id="home-hero-cta-secondary"
                            type="button"
                            onClick={handleQuickNavigateContact}
                            onMouseEnter={() => SoundEngine.playTap()}
                            style={{
                              background: isDark
                                ? 'rgba(255, 255, 255, 0.10)'
                                : 'rgba(255, 255, 255, 0.92)',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.22)'
                                : 'rgba(255, 255, 255, 0.98)',
                              color: 'var(--text-heading, var(--text-primary))',
                            }}
                            className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-[14px] border font-bold typo-button shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                          >
                            <WebIcon
                              name="mail"
                              className="w-4 h-4 shrink-0"
                              style={{ color: 'var(--text-link, var(--color-primary))' }}
                            />
                            <span>{isEn ? 'Contact & Booking' : 'Liên Hệ Ngay'}</span>
                          </button>
                        </div>

                        <div
                          className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-3 sm:pt-5"
                          aria-label={isEn ? 'Quick contact links' : 'Kênh kết nối nhanh'}
                        >
                          {contactSocialLinks.map((item) => {
                            const sharedClasses =
                              'w-9 h-9 rounded-full inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border';
                            const sharedStyle: React.CSSProperties = {
                              background: isDark
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(255, 255, 255, 0.56)',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.16)'
                                : 'rgba(255, 255, 255, 0.85)',
                              color: 'var(--text-heading, var(--text-primary))',
                            };

                            if (item.href) {
                              return (
                                <a
                                  key={item.id}
                                  id={item.id}
                                  href={item.href}
                                  target={item.external ? '_blank' : undefined}
                                  rel={item.external ? 'noopener noreferrer' : undefined}
                                  aria-label={item.label}
                                  title={item.label}
                                  onClick={() => SoundEngine.playTap()}
                                  className={sharedClasses}
                                  style={sharedStyle}
                                >
                                  <WebIcon name={item.icon} className="w-[17px] h-[17px]" />
                                </a>
                              );
                            }

                            return (
                              <button
                                key={item.id}
                                id={item.id}
                                type="button"
                                aria-label={item.label}
                                title={item.label}
                                onClick={item.onClick}
                                className={sharedClasses}
                                style={sharedStyle}
                              >
                                <WebIcon name={item.icon} className="w-[17px] h-[17px]" />
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Cột Phải: Khung chân dung vòng tròn đồng tâm */}
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-5 flex items-center justify-center order-1 md:order-2 py-2"
                      >
                        <div className="relative flex items-center justify-center w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] md:w-[295px] md:h-[295px] lg:w-[350px] lg:h-[350px] xl:w-[380px] xl:h-[380px] shrink-0">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full border-[1.5px] pointer-events-none"
                            style={{
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.24)'
                                : 'rgba(255, 255, 255, 0.88)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-[8px] sm:inset-[10px] rounded-full border-[1.5px] pointer-events-none"
                            style={{
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.16)'
                                : 'rgba(255, 255, 255, 0.72)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-2.5 top-[48%] w-5 h-5 sm:w-7 sm:h-7 rounded-full blur-[5px]"
                            style={{
                              background: isDark
                                ? 'rgba(244, 114, 182, 0.55)'
                                : 'rgba(244, 114, 182, 0.65)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-2 top-[34%] w-6 h-6 sm:w-8 sm:h-8 rounded-full blur-[6px]"
                            style={{
                              background: isDark
                                ? 'rgba(96, 165, 250, 0.55)'
                                : 'rgba(59, 130, 246, 0.62)',
                            }}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[24%] -bottom-4 sm:-bottom-5 w-4 h-4 sm:w-5 sm:h-5 rounded-full opacity-80"
                            style={{
                              background: isDark
                                ? 'rgba(251, 113, 133, 0.65)'
                                : 'rgba(253, 164, 175, 0.88)',
                            }}
                          />

                          <div
                            className="relative w-[calc(100%-34px)] h-[calc(100%-34px)] sm:w-[calc(100%-42px)] sm:h-[calc(100%-42px)] rounded-full overflow-hidden flex items-center justify-center shadow-[0_20px_48px_rgba(15,23,42,0.18)]"
                            style={{
                              background: isDark
                                ? 'linear-gradient(145deg, rgba(30,41,59,0.72), rgba(51,65,85,0.45))'
                                : 'linear-gradient(145deg, rgba(255,255,255,0.75), rgba(238,242,255,0.58))',
                              border: isDark
                                ? '2px solid rgba(255, 255, 255, 0.22)'
                                : '2px solid rgba(255, 255, 255, 0.92)',
                            }}
                          >
                            {showCircleVideo ? (
                              <DualLayerVideoPlayer
                                video1Id={HOME_VIDEO_1_ID}
                                video1Src={HOME_VIDEO_1_SRC}
                                video2Id={HOME_VIDEO_2_ID}
                                video2Src={driveVideoUrl(HOME_VIDEO_2_ID)}
                                autoPlayVideo1={true}
                                muteVideo1={true}
                                loopVideo1={true}
                                capsuleVariant="home"
                                className="absolute inset-0 z-0 pointer-events-auto"
                              />
                            ) : !avatarLoadError ? (
                              <img
                                src={DRIVE_AVATARS.hungThai}
                                alt="Nguyễn Hùng Thái - Chuyên gia vận hành CSKH & CX"
                                referrerPolicy="no-referrer"
                                loading="eager"
                                decoding="async"
                                onError={() => setAvatarLoadError(true)}
                                className="w-full h-full object-cover object-top select-none"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <WebIcon
                                  name="user-round"
                                  className="w-14 h-14"
                                  style={{ color: 'var(--color-primary)' }}
                                />
                                <span
                                  className="typo-caption font-bold"
                                  style={{ color: 'var(--text-heading)' }}
                                >
                                  Nguyễn Hùng Thái
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            id="home-hero-media-toggle-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SoundEngine.playTap();
                              setShowCircleVideo((prev) => !prev);
                            }}
                            title={
                              showCircleVideo
                                ? isEn
                                  ? 'Switch back to Portrait'
                                  : 'Quay lại ảnh chân dung'
                                : isEn
                                  ? 'Watch Leadership Vision Video'
                                  : 'Xem Video Phong Thái Lãnh Đạo'
                            }
                            aria-label={
                              showCircleVideo
                                ? isEn
                                  ? 'Switch to portrait'
                                  : 'Chuyển sang ảnh chân dung'
                                : isEn
                                  ? 'Play leadership video'
                                  : 'Phát video phong thái lãnh đạo'
                            }
                            style={{
                              background: isDark
                                ? 'rgba(15, 23, 42, 0.82)'
                                : 'rgba(255, 255, 255, 0.94)',
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.25)'
                                : 'rgba(255, 255, 255, 1)',
                              color: 'var(--text-link, var(--color-primary))',
                            }}
                            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg typo-badge font-bold hover:scale-105 transition-all duration-200 cursor-pointer"
                          >
                            <WebIcon
                              name={showCircleVideo ? 'image' : 'play'}
                              className="w-3.5 h-3.5 shrink-0"
                            />
                            <span>
                              {showCircleVideo
                                ? isEn
                                  ? 'Portrait'
                                  : 'Chân dung'
                                : 'Video'}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
          </div>
        </div>
      </div>
    </div>
  );
};
