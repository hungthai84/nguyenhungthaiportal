'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
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

// Video 1 & Video 2 Trang chủ: Phong Thái Lãnh Đạo & Tầm Nhìn
export const HOME_VIDEO_1_ID = '1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp';
export const HOME_VIDEO_1_SRC =
  'https://cdn.scena.ai/project/10169/eae59f7007421658e611c298c206755ca060c878d07087694c06935208b9d8f9.mp4';
export const HOME_VIDEO_2_ID = '12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm';
export const HOME_VIDEO_2_SRC =
  'https://cdn.scena.ai/project/10169/0f6e39f01533134c70012f61be38d29126100c0300c9c0ea607adb305b5f7102.mp4';

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
  const isDark = themeIsDark || getCardStyleConfig(normalizeCardStyle(currentTheme)).isDark;

  // Broadcast active slide state (single screen on Home)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 0, slide: 0, totalSlides: 1 },
      })
    );
  }, []);

  // Width calculations for centered 1000px main card
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useLayoutEffect(() => {
    const container = homeContainerRef.current;
    const updateWidths = () => {
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      evaluateOverallLayoutTypography(document.getElementById('global-content-viewport'));
    };
    updateWidths();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro && container) {
      ro.observe(container);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateWidths);
    };
  }, []);

  const peekReserve = viewportWidth < 640 ? 16 : 32;
  const homeCardWidth = Math.min(1000, Math.max(260, viewportWidth - peekReserve));
  const homeSideInset = 0;

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
      isEn ? 'Opening CV Resume preview' : 'Đang mở bản xem trước Hồ sơ cá nhân'
    );
  };

  const contactSocialLinks: Array<{
    id: string;
    icon: string;
    label: string;
    href?: string;
    external?: boolean;
    gradient: string;
    glow: string;
    borderColor: string;
    onClick?: (e: React.MouseEvent) => void;
  }> = [
    {
      id: 'home-social-email',
      icon: 'mail',
      label: 'Email · hungthai84@gmail.com',
      href: 'mailto:hungthai84@gmail.com',
      gradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
      glow: '0 6px 16px rgba(244, 63, 94, 0.34)',
      borderColor: 'rgba(255, 255, 255, 0.42)',
    },
    {
      id: 'home-social-phone',
      icon: 'phone',
      label: 'Zalo & Điện thoại · +84 0909097882',
      href: 'https://zalo.me/0909097882',
      external: true,
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      glow: '0 6px 16px rgba(16, 185, 129, 0.34)',
      borderColor: 'rgba(255, 255, 255, 0.42)',
    },
    {
      id: 'home-social-linkedin',
      icon: 'linkedin',
      label: 'LinkedIn · linkedin.com/in/hungthai84',
      href: 'https://www.linkedin.com/in/hungthai84/',
      external: true,
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      glow: '0 6px 16px rgba(14, 165, 233, 0.34)',
      borderColor: 'rgba(255, 255, 255, 0.42)',
    },
    {
      id: 'home-social-website',
      icon: 'globe',
      label: 'Trang web · nguyenhungthai.powerservice.one',
      href: 'https://nguyenhungthai.powerservice.one/',
      external: true,
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      glow: '0 6px 16px rgba(139, 92, 246, 0.34)',
      borderColor: 'rgba(255, 255, 255, 0.42)',
    },
    {
      id: 'home-social-pdf',
      icon: 'file-text',
      label: isEn ? 'View & Download CV Profile' : 'Xem & Tải Hồ sơ năng lực',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
      glow: '0 6px 16px rgba(245, 158, 11, 0.34)',
      borderColor: 'rgba(255, 255, 255, 0.42)',
      onClick: handleQuickNavigatePdf,
    },
  ];


  // 3 vivid multi-color orbiting circular badges around portrait frame
  const orbitBadges = [
    {
      id: 'home-orbit-icon-sparkles',
      icon: 'sparkles',
      posClass: 'top-[4%] right-[12%] sm:top-[5%] sm:right-[13%]',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
      glow: '0 10px 24px rgba(236, 72, 153, 0.42)',
      floatY: [-5, 5, -5],
      floatX: [-2, 2, -2],
      duration: 4.2,
      delay: 0,
    },
    {
      id: 'home-orbit-icon-trending',
      icon: 'trending-up',
      posClass: 'bottom-[26%] right-[0.5%] sm:bottom-[27%] sm:right-[1%]',
      gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      glow: '0 10px 24px rgba(16, 185, 129, 0.42)',
      floatY: [-4, 4, -4],
      floatX: [3, -2, 3],
      duration: 5.0,
      delay: 0.45,
    },
    {
      id: 'home-orbit-icon-cpu',
      icon: 'cpu',
      posClass: 'top-[44%] -left-3.5 sm:top-[44%] sm:-left-4',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      glow: '0 10px 24px rgba(139, 92, 246, 0.42)',
      floatY: [-5, 4, -5],
      floatX: [-3, 2, -3],
      duration: 5.4,
      delay: 0.85,
    },
  ];

  const mainCardInlineStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 'var(--main-card-target-w, 1600px)',
    flex: '0 0 auto',
    height: '100%',
    minHeight: '0px',
    maxHeight: '100%',
    margin: '0 auto',
    padding: 'var(--main-card-padding, clamp(12px, 1.5vw, 20px))',
    gap: 'clamp(10px, 1.2vw, 15px)',
    borderRadius: 'var(--radius-global, var(--radius-main, 14px))',
  };

  return (
    <div
      ref={homeContainerRef}
      id="home-page-container"
      data-element-name="Trang chủ cá nhân"
      data-element-type="container"
      data-element-page="home"
      data-element-parent="global-content-viewport"
      style={{
        ['--about-card-w' as any]: `${homeCardWidth}px`,
        ['--about-side-inset' as any]: `${homeSideInset}px`,
      }}
      className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-auto flex-1 flex flex-row items-center justify-center p-0 overflow-visible no-scrollbar select-none font-play box-border"
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
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '100%',
          width: '100%',
          padding: '0px',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
        className="page-cards-track relative w-full h-full min-h-full box-border overflow-visible"
      >
        {/* SCREEN 1: HERO PORTRAIT & LEADERSHIP VISION */}
        <div
          id="home-main-card-1"
          data-main-card="true"
          data-element-name="Thẻ chính Trang chủ 1 - Tầm nhìn Lãnh đạo"
          data-element-type="card"
          data-element-page="home"
          data-element-parent="home-cards-track"
          style={mainCardInlineStyle}
          className="page-main-card home-screen-main-card relative shrink-0 flex flex-col justify-center items-center overflow-hidden select-none font-play box-border opacity-100"
        >
          <div
            id="home-hero-stage-1"
            data-element-name="Bố cục Trang chủ 2 cột ngang"
            data-element-type="container"
            data-element-page="home"
            data-element-parent="home-main-card-1"
            className="relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-center overflow-y-auto md:overflow-hidden no-scrollbar rounded-[var(--radius-card,14px)] box-border text-left !p-0 bg-transparent border-0 shadow-none"
            style={{
              borderRadius: 'var(--radius-card, 14px)',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
            }}
          >
            <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12 items-center gap-4 sm:gap-6 lg:gap-8 px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
              {/* Cột Trái: Tiêu đề, mô tả, nút CTA & liên kết */}
              <div className="md:col-span-6 flex flex-col justify-center items-start gap-4 sm:gap-5 min-w-0 order-2 md:order-1">
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
                    className="font-play font-extrabold tracking-tight leading-[1.12] typo-h1"
                    style={{ color: 'var(--text-heading, var(--text-primary))' }}
                  >
                    <span className="block">Nguyễn Hùng Thái</span>
                    <span
                      className="block mt-0.5 typo-h2 font-bold"
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
                    : 'Hơn 22 năm kinh nghiệm thực chiến kiến tạo, chuẩn hóa quy trình và điều hành hệ thống tổng đài đa kênh quy mô lớn tại các doanh nghiệp hàng đầu. Hiệu quả – Nhân văn – Bền vững.'}
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
                      'w-9 h-9 rounded-full inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 cursor-pointer border';
                    const itemStyle: React.CSSProperties = {
                      background: item.gradient,
                      borderColor: item.borderColor,
                      boxShadow: item.glow,
                      color: '#FFFFFF',
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
                          style={itemStyle}
                        >
                          <WebIcon name={item.icon} className="w-[17px] h-[17px] text-white" />
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
                        style={itemStyle}
                      >
                        <WebIcon name={item.icon} className="w-[17px] h-[17px] text-white" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cột Phải: Khung hình tròn Video 1 & Video 2 đồng tâm & 6 huy hiệu màu nổi cỡ lớn */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                className="md:col-span-6 flex items-center justify-center order-1 md:order-2 py-3 sm:py-4"
              >
                <div
                  id="el-p0-div-96"
                  className="relative flex items-center justify-center w-[min(294px,74vw)] h-[min(294px,74vw)] sm:w-[min(375px,68vw)] sm:h-[min(375px,68vw)] md:w-[min(390px,42vw)] md:h-[min(390px,42vw)] lg:w-[min(450px,44vw,58vh)] lg:h-[min(450px,44vw,58vh)] xl:w-[min(465px,44vw,62vh)] xl:h-[min(465px,44vw,62vh)] shrink-0"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-[1.5px] pointer-events-none"
                    style={{
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.24)'
                        : 'rgba(255, 255, 255, 0.88)',
                    }}
                  />

                  {/* 6 biểu tượng đa sắc kích thước lớn bay quanh viền vòng tròn */}
                  {orbitBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      id={badge.id}
                      aria-hidden="true"
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : {
                              y: badge.floatY,
                              x: badge.floatX,
                            }
                      }
                      transition={
                        prefersReducedMotion
                          ? undefined
                          : {
                              duration: badge.duration,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: badge.delay,
                            }
                      }
                      style={{
                        background: badge.gradient,
                        borderColor: 'rgba(255, 255, 255, 0.85)',
                        color: '#FFFFFF',
                        boxShadow: badge.glow,
                      }}
                      className={`pointer-events-none select-none absolute z-10 w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full border-2 flex items-center justify-center ${badge.posClass}`}
                    >
                      <WebIcon name={badge.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-xs" />
                    </motion.div>
                  ))}

                  <div
                    id="home-hero-circle-frame"
                    className="relative w-[calc(100%-44px)] h-[calc(100%-44px)] sm:w-[calc(100%-56px)] sm:h-[calc(100%-56px)] rounded-full overflow-visible flex items-center justify-center shadow-[0_20px_48px_rgba(15,23,42,0.18)]"
                    style={{
                      borderRadius: '9999px',
                      background: isDark
                        ? 'linear-gradient(145deg, rgba(30,41,59,0.72), rgba(51,65,85,0.45))'
                        : 'linear-gradient(145deg, rgba(255,255,255,0.75), rgba(238,242,255,0.58))',
                      border: isDark
                        ? '2px solid rgba(255, 255, 255, 0.22)'
                        : '2px solid rgba(255, 255, 255, 0.92)',
                    }}
                  >
                    <DualLayerVideoPlayer
                      video1Id={HOME_VIDEO_1_ID}
                      video1Src={HOME_VIDEO_1_SRC}
                      video2Id={HOME_VIDEO_2_ID}
                      video2Src={HOME_VIDEO_2_SRC}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      capsuleVariant="home"
                      className="absolute inset-0 z-0 pointer-events-auto rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

