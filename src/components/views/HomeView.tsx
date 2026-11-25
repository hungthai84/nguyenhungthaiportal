'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import { evaluateOverallLayoutTypography } from '@/config/typographyScale';
import { DualLayerVideoPlayer, type DualLayerVideoPlayerHandle } from '@/components/ui/DualLayerVideoPlayer';
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
  const homeVideoRef = useRef<DualLayerVideoPlayerHandle | null>(null);
  const [homeVideoState, setHomeVideoState] = useState<{ isPlayingIntro: boolean; isAudioOn: boolean }>({
    isPlayingIntro: false,
    isAudioOn: false,
  });
  const handleHomeVideoStateChange = useCallback(
    (next: { isPlayingIntro: boolean; isAudioOn: boolean }) => {
      setHomeVideoState((prev) =>
        prev.isPlayingIntro === next.isPlayingIntro && prev.isAudioOn === next.isAudioOn ? prev : next
      );
    },
    []
  );
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
      label: 'Trang web · nguyenhungthai.powerservice.one',
      href: 'https://nguyenhungthai.powerservice.one/',
      external: true,
    },
    {
      id: 'home-social-pdf',
      icon: 'file-text',
      label: isEn ? 'View & Download CV Profile' : 'Xem & Tải Hồ sơ năng lực',
      onClick: handleQuickNavigatePdf,
    },
  ];

  // Aurora pastel background gradient layer
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

  // Kho biểu tượng đa sắc được chọn ngẫu nhiên quanh vòng tròn Trang chủ (tránh góc dưới phải của nút phát video)
  const orbitBadges = useMemo(() => {
    const iconPool = [
      {
        icon: 'sparkles',
        gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
        glow: '0 10px 24px rgba(236, 72, 153, 0.42)',
      },
      {
        icon: 'headphones',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        glow: '0 10px 24px rgba(59, 130, 246, 0.42)',
      },
      {
        icon: 'trending-up',
        gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
        glow: '0 10px 24px rgba(16, 185, 129, 0.42)',
      },
      {
        icon: 'award',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
        glow: '0 10px 24px rgba(245, 158, 11, 0.44)',
      },
      {
        icon: 'cpu',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
        glow: '0 10px 24px rgba(139, 92, 246, 0.42)',
      },
      {
        icon: 'heart-handshake',
        gradient: 'linear-gradient(135deg, #F43F5E 0%, #A855F7 100%)',
        glow: '0 10px 24px rgba(244, 63, 94, 0.42)',
      },
      {
        icon: 'shield-check',
        gradient: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
        glow: '0 10px 24px rgba(14, 165, 233, 0.42)',
      },
      {
        icon: 'bar-chart-3',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
        glow: '0 10px 24px rgba(99, 102, 241, 0.42)',
      },
      {
        icon: 'target',
        gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
        glow: '0 10px 24px rgba(239, 68, 68, 0.42)',
      },
      {
        icon: 'crown',
        gradient: 'linear-gradient(135deg, #D97706 0%, #FACC15 100%)',
        glow: '0 10px 24px rgba(217, 119, 6, 0.44)',
      },
      {
        icon: 'globe',
        gradient: 'linear-gradient(135deg, #0891B2 0%, #10B981 100%)',
        glow: '0 10px 24px rgba(8, 145, 178, 0.42)',
      },
      {
        icon: 'compass',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        glow: '0 10px 24px rgba(124, 58, 237, 0.42)',
      },
      {
        icon: 'layers',
        gradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        glow: '0 10px 24px rgba(37, 99, 235, 0.42)',
      },
      {
        icon: 'users',
        gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
        glow: '0 10px 24px rgba(5, 150, 105, 0.42)',
      },
      {
        icon: 'briefcase',
        gradient: 'linear-gradient(135deg, #EA580C 0%, #EC4899 100%)',
        glow: '0 10px 24px rgba(234, 88, 12, 0.42)',
      },
      {
        icon: 'brain',
        gradient: 'linear-gradient(135deg, #9333EA 0%, #3B82F6 100%)',
        glow: '0 10px 24px rgba(147, 51, 234, 0.42)',
      },
      {
        icon: 'trophy',
        gradient: 'linear-gradient(135deg, #EAB308 0%, #F97316 100%)',
        glow: '0 10px 24px rgba(234, 179, 8, 0.44)',
      },
      {
        icon: 'workflow',
        gradient: 'linear-gradient(135deg, #14B8A6 0%, #0284C7 100%)',
        glow: '0 10px 24px rgba(20, 184, 166, 0.42)',
      },
    ];

    // Xáo trộn Fisher-Yates để mỗi lần vào Trang chủ chọn 6 biểu tượng & màu sắc ngẫu nhiên
    const shuffled = [...iconPool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picked = shuffled.slice(0, 6);

    // Phân bổ ngẫu nhiên trên cung tròn an toàn (104° → 364°, tránh vùng nút Phát & Âm thanh ở góc dưới phải ~15°–95°)
    const arcStartDeg = 104;
    const arcSpanDeg = 260;
    const sectorStep = arcSpanDeg / picked.length;

    return picked.map((item, idx) => {
      const jitterDeg = (Math.random() - 0.5) * (sectorStep * 0.52);
      const angleDeg = arcStartDeg + (idx + 0.5) * sectorStep + jitterDeg;
      const angleRad = (angleDeg * Math.PI) / 180;
      // Bán kính ngẫu nhiên nhẹ quanh viền vòng tròn ngoài (47.5% – 51.5%)
      const radiusPct = 47.5 + Math.random() * 4;
      const leftPct = 50 + Math.cos(angleRad) * radiusPct;
      const topPct = 50 + Math.sin(angleRad) * radiusPct;

      const ampY = 3.5 + Math.random() * 3.5;
      const ampX = 2 + Math.random() * 2.5;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      const dirX = Math.random() > 0.5 ? 1 : -1;
      const rotAmp = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 5);

      return {
        id: `home-orbit-icon-${item.icon}-${idx}`,
        icon: item.icon,
        leftPct: `${leftPct.toFixed(2)}%`,
        topPct: `${topPct.toFixed(2)}%`,
        gradient: item.gradient,
        glow: item.glow,
        floatY: [dirY * -ampY, dirY * ampY, dirY * -ampY],
        floatX: [dirX * -ampX, dirX * ampX, dirX * -ampX],
        floatRotate: [-rotAmp, rotAmp, -rotAmp],
        duration: Number((4.0 + Math.random() * 1.8).toFixed(2)),
        delay: Number((Math.random() * 0.9).toFixed(2)),
      };
    });
  }, []);

  const mainCardInlineStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 'var(--main-card-target-w, 1000px)',
    flex: '0 0 auto',
    height: '100%',
    minHeight: '0px',
    maxHeight: '100%',
    margin: '0 auto',
    padding: 'var(--main-card-padding, 15px)',
    gap: '15px',
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
      className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-auto flex-1 flex flex-row items-center justify-center p-0 overflow-x-hidden overflow-y-hidden no-scrollbar select-none font-play box-border"
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
          overflow: 'hidden',
        }}
        className="page-cards-track relative w-full h-full min-h-full box-border"
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
            data-section-card="true"
            data-element-name="Card chính Trang chủ 2 cột ngang"
            data-element-type="card"
            data-element-page="home"
            data-element-parent="home-main-card-1"
            className="bento-card glass-card home-split-hero-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-center overflow-y-auto md:overflow-hidden no-scrollbar rounded-[var(--radius-card,14px)] box-border text-left !p-0"
            style={{ borderRadius: 'var(--radius-card, 14px)' }}
          >
            {renderAuroraLayer()}

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
                  <div
                    aria-hidden="true"
                    className="absolute inset-[12px] sm:inset-[14px] rounded-full border-[1.5px] pointer-events-none"
                    style={{
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.16)'
                        : 'rgba(255, 255, 255, 0.72)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-3 top-[48%] w-7 h-7 sm:w-9 sm:h-9 rounded-full blur-[6px]"
                    style={{
                      background: isDark
                        ? 'rgba(244, 114, 182, 0.55)'
                        : 'rgba(244, 114, 182, 0.65)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2.5 top-[34%] w-8 h-8 sm:w-10 sm:h-10 rounded-full blur-[7px]"
                    style={{
                      background: isDark
                        ? 'rgba(96, 165, 250, 0.55)'
                        : 'rgba(59, 130, 246, 0.62)',
                    }}
                  />

                  {/* 6 biểu tượng đa sắc ngẫu nhiên bay quanh viền vòng tròn */}
                  {orbitBadges.map((badge) => (
                    <div
                      key={badge.id}
                      style={{
                        left: badge.leftPct,
                        top: badge.topPct,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="pointer-events-none select-none absolute z-10"
                    >
                      <motion.div
                        id={badge.id}
                        aria-hidden="true"
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                y: badge.floatY,
                                x: badge.floatX,
                                rotate: badge.floatRotate,
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
                        className="w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full border-2 flex items-center justify-center"
                      >
                        <WebIcon name={badge.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-xs" />
                      </motion.div>
                    </div>
                  ))}

                  <div
                    className="relative w-[calc(100%-44px)] h-[calc(100%-44px)] sm:w-[calc(100%-56px)] sm:h-[calc(100%-56px)] rounded-full overflow-hidden flex items-center justify-center shadow-[0_20px_48px_rgba(15,23,42,0.18)]"
                    style={{
                      background: isDark
                        ? 'linear-gradient(145deg, rgba(30,41,59,0.72), rgba(51,65,85,0.45))'
                        : 'linear-gradient(145deg, rgba(255,255,255,0.75), rgba(238,242,255,0.58))',
                      border: isDark
                        ? '2px solid rgba(255, 255, 255, 0.22)'
                        : '2px solid rgba(255, 255, 255, 0.92)',
                    }}
                  >
                    <DualLayerVideoPlayer
                      ref={homeVideoRef}
                      video1Id={HOME_VIDEO_1_ID}
                      video1Src={HOME_VIDEO_1_SRC}
                      video2Id={HOME_VIDEO_2_ID}
                      video2Src={HOME_VIDEO_2_SRC}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      capsuleVariant="home"
                      hideCapsule={true}
                      onStateChange={handleHomeVideoStateChange}
                      className="absolute inset-0 z-0 pointer-events-auto rounded-full"
                    />
                  </div>

                  {/* Nút bật/tắt âm thanh tròn nhỏ vệ tinh cạnh nút phát chính */}
                  <button
                    id="home-video-circle-sound-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEngine.playTap();
                      homeVideoRef.current?.toggleMute();
                    }}
                    style={{ borderRadius: '9999px' }}
                    className={`video-play-btn__sound absolute bottom-1 right-[74px] sm:bottom-2 sm:right-[88px] lg:right-[96px] z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border shadow-md backdrop-blur-md transition-all duration-200 cursor-pointer pointer-events-auto select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                      homeVideoState.isAudioOn
                        ? 'bg-sky-500/90 border-white/80 text-white'
                        : 'bg-rose-600/95 border-white/75 text-white'
                    }`}
                    title={
                      homeVideoState.isAudioOn
                        ? isEn
                          ? 'Mute video'
                          : 'Tắt âm thanh video'
                        : isEn
                          ? 'Unmute video'
                          : 'Bật âm thanh video'
                    }
                    aria-label={
                      homeVideoState.isAudioOn
                        ? isEn
                          ? 'Mute video'
                          : 'Tắt âm thanh video'
                        : isEn
                          ? 'Unmute video'
                          : 'Bật âm thanh video'
                    }
                    aria-pressed={homeVideoState.isAudioOn}
                  >
                    <WebIcon
                      name={homeVideoState.isAudioOn ? 'volume-2' : 'volume-x'}
                      className="w-4 h-4 text-white"
                    />
                  </button>

                  {/* Nút Phát Video hình tròn lớn bên góc dưới mép bên phải */}
                  <button
                    id="home-video-circle-play-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEngine.playPop();
                      if (homeVideoState.isPlayingIntro) {
                        homeVideoRef.current?.cancelIntro();
                      } else {
                        homeVideoRef.current?.playIntro();
                      }
                    }}
                    style={{ borderRadius: '9999px' }}
                    className={`video-play-btn video-play-btn--home home-video-circle-play ${
                      homeVideoState.isPlayingIntro ? 'is-playing' : ''
                    } absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-30 w-16 h-16 sm:w-[74px] sm:h-[74px] lg:w-[82px] lg:h-[82px] rounded-full aspect-square p-0 flex items-center justify-center cursor-pointer pointer-events-auto select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`}
                    title={
                      homeVideoState.isPlayingIntro
                        ? isEn
                          ? 'Stop intro video'
                          : 'Hủy phát video giới thiệu'
                        : isEn
                          ? 'Play intro video'
                          : 'Bấm để phát video giới thiệu'
                    }
                    aria-label={
                      homeVideoState.isPlayingIntro
                        ? isEn
                          ? 'Stop intro video'
                          : 'Hủy phát video giới thiệu'
                        : isEn
                          ? 'Play intro video'
                          : 'Phát Video giới thiệu'
                    }
                    aria-pressed={homeVideoState.isPlayingIntro}
                  >
                    <WebIcon
                      name={homeVideoState.isPlayingIntro ? 'cancel' : 'play'}
                      className={
                        homeVideoState.isPlayingIntro
                          ? 'w-7 h-7 sm:w-8 sm:h-8 stroke-[2.6] text-current shrink-0'
                          : 'w-7 h-7 sm:w-8 sm:h-8 translate-x-[2px] fill-current text-current shrink-0'
                      }
                    />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

