'use client';

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
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

// Video 1 Trang chủ: Phong Thái Lãnh Đạo & Tầm Nhìn
export const HOME_VIDEO_1_ID = '1CtLHbBDYyACUJg2Xr0mtVAMG5Hdo8RDp';
export const HOME_VIDEO_1_SRC =
  'https://cdn.scena.ai/project/10169/eae59f7007421658e611c298c206755ca060c878d07087694c06935208b9d8f9.mp4';
export const HOME_VIDEO_2_ID = '12SPR7GJR0iw-bo4hWuJHKSNJjb4X_TIm';

export const HomeView: React.FC<HomeViewProps> = ({
  slideIndex = 0,
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
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDark = themeIsDark || getCardStyleConfig(normalizeCardStyle(currentTheme)).isDark;

  const [showCircleVideo, setShowCircleVideo] = useState<boolean>(false);
  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(() =>
    Math.max(0, Math.min(2, slideIndex || 0))
  );

  // Sync prop slideIndex from App.tsx
  useEffect(() => {
    const clamped = Math.max(0, Math.min(2, slideIndex || 0));
    setActiveSlideIndex(clamped);
  }, [slideIndex]);

  // Listen to global slide-navigation events for Home (tabIndex: 0)
  useEffect(() => {
    const handleSetSlide = (e: Event) => {
      const detail = (e as CustomEvent<{ tabIndex?: number; slide?: number }>).detail;
      if (!detail || (detail.tabIndex !== undefined && detail.tabIndex !== 0)) return;
      if (typeof detail.slide === 'number') {
        const clamped = Math.max(0, Math.min(2, detail.slide));
        setActiveSlideIndex(clamped);
      }
    };
    window.addEventListener('app:set-slide', handleSetSlide as EventListener);
    return () => window.removeEventListener('app:set-slide', handleSetSlide as EventListener);
  }, []);

  // Broadcast active slide state
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', {
        detail: { tabIndex: 0, slide: activeSlideIndex, totalSlides: 3 },
      })
    );
  }, [activeSlideIndex]);

  const goToSlide = useCallback((nextIdx: number) => {
    const clamped = Math.max(0, Math.min(2, nextIdx));
    setActiveSlideIndex((prev) => {
      if (prev !== clamped) {
        SoundEngine.playTap();
      }
      return clamped;
    });
  }, []);

  // Keyboard ArrowLeft / ArrowRight support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight' && activeSlideIndex < 2) {
        e.preventDefault();
        goToSlide(activeSlideIndex + 1);
      } else if (e.key === 'ArrowLeft' && activeSlideIndex > 0) {
        e.preventDefault();
        goToSlide(activeSlideIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSlideIndex, goToSlide]);

  // Width calculations for centered 1000px main cards with 10px slide gap
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [homeContainerWidth, setHomeContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useLayoutEffect(() => {
    const container = homeContainerRef.current;
    const updateWidths = () => {
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      if (container) {
        setHomeContainerWidth(container.clientWidth || window.innerWidth);
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
  const slideGapPx = 10;
  const centerOffsetPx = Math.max(0, (homeContainerWidth - homeCardWidth) / 2);
  const trackOffsetX = centerOffsetPx - activeSlideIndex * (homeCardWidth + slideGapPx);
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

  // Authentic CV Operating Pillars for Slide 2
  const operatingPillars = [
    {
      id: 'pillar-ops',
      icon: 'headphones',
      accent: 'from-blue-500 to-cyan-500',
      iconColor: '#2563EB',
      titleVi: 'Vận hành Tổng đài & Đa kênh',
      titleEn: 'Omnichannel Contact Center',
      descVi:
        'Thiết lập và chuẩn hóa quy trình vận hành Contact Center quy mô lớn, SLA minh bạch, kiểm soát chất lượng cuộc gọi và tối ưu thời gian phản hồi.',
      descEn:
        'Architecting large-scale omnichannel Contact Center workflows with clear SLA governance, QA calibration, and faster response turnaround.',
    },
    {
      id: 'pillar-digital',
      icon: 'cpu',
      accent: 'from-violet-500 to-fuchsia-500',
      iconColor: '#7C3AED',
      titleVi: 'Chuyển đổi số & Tự động hóa',
      titleEn: 'Digital & CRM Transformation',
      descVi:
        'Triển khai CRM hợp nhất, dữ liệu thời gian thực và quy trình tự động hóa giúp giảm tải tác vụ thủ công và ra quyết định chính xác.',
      descEn:
        'Deploying unified CRM stacks, real-time operational dashboards, and workflow automation for data-driven leadership decisions.',
    },
    {
      id: 'pillar-cx',
      icon: 'heart-handshake',
      accent: 'from-rose-500 to-orange-500',
      iconColor: '#E11D48',
      titleVi: 'Trải nghiệm Khách hàng Bền vững',
      titleEn: 'Human-Centric CX Design',
      descVi:
        'Đo lường hành trình khách hàng theo CSAT, NPS, CES; biến điểm chạm dịch vụ thành lợi thế giữ chân và tăng trưởng doanh thu dài hạn.',
      descEn:
        'Measuring end-to-end journeys via CSAT, NPS, and CES to transform every support touchpoint into loyalty and retention.',
    },
    {
      id: 'pillar-team',
      icon: 'users',
      accent: 'from-emerald-500 to-teal-500',
      iconColor: '#059669',
      titleVi: 'Đào tạo & Dẫn dắt Đội ngũ',
      titleEn: 'Talent Coaching & Leadership',
      descVi:
        'Xây dựng khung năng lực, huấn luyện đội ngũ quản lý cấp trung và nhân sự tuyến đầu vững chuyên môn, đồng cảm và chủ động.',
      descEn:
        'Building competency frameworks and mentoring supervisors and frontline specialists toward empathy, accountability, and excellence.',
    },
  ];

  const slide2Metrics = [
    {
      value: '22+ năm',
      valueEn: '22+ yrs',
      labelVi: 'Kinh nghiệm điều hành & tư vấn CSKH',
      labelEn: 'CS Leadership & Advisory',
      color: '#2563EB',
    },
    {
      value: '150+ nhân sự',
      valueEn: '150+ staff',
      labelVi: 'Quy mô trung tâm từng dẫn dắt',
      labelEn: 'Team Scale Managed',
      color: '#7C3AED',
    },
    {
      value: '95%+ CSAT',
      valueEn: '95%+ CSAT',
      labelVi: 'Chỉ số hài lòng khách hàng duy trì',
      labelEn: 'Sustained Satisfaction Score',
      color: '#059669',
    },
  ];

  // Authentic CV Values & Quick Links for Slide 3
  const coreValuesList = [
    {
      icon: 'target',
      color: '#EA580C',
      titleVi: 'Lấy con người làm gốc',
      titleEn: 'People-First Culture',
      descVi:
        'Công nghệ tạo tốc độ, còn sự thấu cảm tạo niềm tin. Mọi quy trình đều phục vụ nhân sự tuyến đầu và trải nghiệm thực chất của khách hàng.',
      descEn:
        'Technology accelerates speed while empathy builds lasting trust across every team and customer conversation.',
    },
    {
      icon: 'trending-up',
      color: '#0891B2',
      titleVi: 'Kỷ luật dữ liệu & Hiệu quả',
      titleEn: 'Data Discipline & Impact',
      descVi:
        'Mọi cải tiến vận hành đều gắn với chỉ số đo lường cụ thể: SLA, tỷ lệ giải quyết ngay lần đầu, chi phí trên mỗi tương tác và mức độ gắn bó.',
      descEn:
        'Every operational initiative ties directly to measurable outcomes across SLA, FCR, cost efficiency, and customer loyalty.',
    },
    {
      icon: 'award',
      color: '#D97706',
      titleVi: 'Chuẩn mực MBA & Thực chiến đa ngành',
      titleEn: 'MBA Rigor & Cross-Industry Practice',
      descVi:
        'Kết hợp tư duy quản trị chiến lược từ bằng Thạc sĩ QTKD với hơn hai thập kỷ trực tiếp xử lý bài toán tại Viễn thông, Thương mại điện tử, Tài chính và Công nghệ.',
      descEn:
        'Combining MBA strategic perspective with 22+ years solving live operational challenges in Telecom, E-commerce, Finance, and Tech.',
    },
  ];

  const slideQuickRoutes = [
    {
      pageId: 2,
      icon: 'user-round',
      labelVi: 'Hồ sơ năng lực',
      labelEn: 'Detailed Profile',
      color: '#E11D48',
    },
    {
      pageId: 7,
      icon: 'briefcase',
      labelVi: 'Dự án tiêu biểu',
      labelEn: 'Key Projects',
      color: '#0D9488',
    },
    {
      pageId: 8,
      icon: 'cpu',
      labelVi: 'Hệ thống vận hành',
      labelEn: 'Tech Systems',
      color: '#2563EB',
    },
    {
      pageId: 12,
      icon: 'mail',
      labelVi: 'Kết nối & Đặt lịch',
      labelEn: 'Contact & Book',
      color: '#4338CA',
    },
  ];

  const slideDockTabs = [
    { index: 0, icon: 'sparkles', labelVi: 'Tổng quan', labelEn: 'Overview' },
    { index: 1, icon: 'layers', labelVi: 'Trụ cột', labelEn: 'Pillars' },
    { index: 2, icon: 'compass', labelVi: 'Giá trị', labelEn: 'Values' },
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

  // Enlarged vivid multi-color orbiting badges around portrait frame
  const orbitBadges = [
    {
      id: 'home-orbit-icon-sparkles',
      icon: 'sparkles',
      posClass: '-top-3 left-[13%] sm:-top-4 sm:left-[14%]',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
      glow: '0 10px 24px rgba(236, 72, 153, 0.42)',
      floatY: [-5, 5, -5],
      floatX: [-2, 2, -2],
      duration: 4.2,
      delay: 0,
    },
    {
      id: 'home-orbit-icon-headphones',
      icon: 'headphones',
      posClass: 'top-[10%] -right-3 sm:top-[11%] sm:-right-4',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
      glow: '0 10px 24px rgba(59, 130, 246, 0.42)',
      floatY: [4, -5, 4],
      floatX: [2, -2, 2],
      duration: 4.8,
      delay: 0.35,
    },
    {
      id: 'home-orbit-icon-trending',
      icon: 'trending-up',
      posClass: 'top-[54%] -right-4 sm:-right-5',
      gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      glow: '0 10px 24px rgba(16, 185, 129, 0.42)',
      floatY: [-4, 4, -4],
      floatX: [3, -2, 3],
      duration: 5.1,
      delay: 0.7,
    },
    {
      id: 'home-orbit-icon-award',
      icon: 'award',
      posClass: 'bottom-[1%] left-[13%] sm:bottom-[2%] sm:left-[15%]',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
      glow: '0 10px 24px rgba(245, 158, 11, 0.44)',
      floatY: [5, -4, 5],
      floatX: [-2, 3, -2],
      duration: 4.5,
      delay: 0.5,
    },
    {
      id: 'home-orbit-icon-cpu',
      icon: 'cpu',
      posClass: 'top-[62%] -left-4 sm:-left-5',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      glow: '0 10px 24px rgba(139, 92, 246, 0.42)',
      floatY: [-5, 4, -5],
      floatX: [-3, 2, -3],
      duration: 5.4,
      delay: 0.9,
    },
    {
      id: 'home-orbit-icon-heart',
      icon: 'heart-handshake',
      posClass: 'top-[15%] -left-3.5 sm:top-[17%] sm:-left-4',
      gradient: 'linear-gradient(135deg, #F43F5E 0%, #A855F7 100%)',
      glow: '0 10px 24px rgba(244, 63, 94, 0.42)',
      floatY: [4, -4, 4],
      floatX: [-2, 2, -2],
      duration: 4.6,
      delay: 0.2,
    },
  ];

  const mainCardInlineStyle: React.CSSProperties = {
    width: `${homeCardWidth}px`,
    maxWidth: 'var(--main-card-target-w, 1000px)',
    minWidth: `${homeCardWidth}px`,
    flex: '0 0 auto',
    height: '100%',
    minHeight: '0px',
    maxHeight: '100%',
    padding: 'var(--main-card-padding, 15px)',
    paddingBottom: '54px',
    gap: '15px',
    borderRadius: '0px',
  };

  return (
    <div className="relative w-full max-w-full min-w-0 min-h-0 h-full flex-1 flex flex-col overflow-hidden">
      <div
        ref={homeContainerRef}
        id="home-page-container"
        data-element-name="Trang chủ cá nhân"
        data-element-type="container"
        data-element-page="home"
        data-element-parent="global-content-viewport"
        onTouchStart={(e) => {
          const t0 = e.touches[0];
          if (t0) touchStartRef.current = { x: t0.clientX, y: t0.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStartRef.current;
          touchStartRef.current = null;
          const tEnd = e.changedTouches[0];
          if (!start || !tEnd) return;
          const dx = tEnd.clientX - start.x;
          const dy = tEnd.clientY - start.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
            if (dx < 0 && activeSlideIndex < 2) goToSlide(activeSlideIndex + 1);
            if (dx > 0 && activeSlideIndex > 0) goToSlide(activeSlideIndex - 1);
          }
        }}
        style={{
          touchAction: 'pan-y',
          ['--about-card-w' as any]: `${homeCardWidth}px`,
          ['--about-side-inset' as any]: `${homeSideInset}px`,
        }}
        className="main-card relative w-full max-w-full min-w-0 min-h-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 overflow-x-hidden overflow-y-hidden no-scrollbar select-none font-play rounded-none box-border"
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
            height: '100%',
            minHeight: '100%',
            width: '100%',
            padding: '0px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
          className="page-cards-track relative w-full h-full min-h-full box-border"
        >
          <div
            id="home-slides-rail"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              gap: '10px',
              height: '100%',
              minHeight: '100%',
              width: 'max-content',
              transform: `translate3d(${trackOffsetX}px, 0, 0)`,
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              boxSizing: 'border-box',
            }}
          >
            {/* SCREEN 1: HERO PORTRAIT & LEADERSHIP VISION */}
            <div
              id="home-main-card-1"
              data-main-card="true"
              data-element-name="Thẻ chính Trang chủ 1 - Tầm nhìn Lãnh đạo"
              data-element-type="card"
              data-element-page="home"
              data-element-parent="home-cards-track"
              onClick={() => {
                if (activeSlideIndex !== 0) goToSlide(0);
              }}
              style={mainCardInlineStyle}
              className={`page-main-card home-screen-main-card relative shrink-0 flex flex-col justify-between overflow-hidden select-none font-play box-border transition-opacity duration-300 ${
                activeSlideIndex === 0 ? 'opacity-100' : 'opacity-65 hover:opacity-90 cursor-pointer'
              }`}
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

                  {/* Cột Phải: Khung chân dung vòng tròn đồng tâm & 6 huy hiệu màu nổi cỡ lớn */}
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
                              className="w-16 h-16"
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

            {/* SCREEN 2: 4 OPERATING PILLARS & CV MILESTONE METRICS */}
            <div
              id="home-main-card-2"
              data-main-card="true"
              data-element-name="Thẻ chính Trang chủ 2 - Trụ cột vận hành"
              data-element-type="card"
              data-element-page="home"
              data-element-parent="home-cards-track"
              onClick={() => {
                if (activeSlideIndex !== 1) goToSlide(1);
              }}
              style={mainCardInlineStyle}
              className={`page-main-card home-screen-main-card relative shrink-0 flex flex-col justify-between overflow-hidden select-none font-play box-border transition-opacity duration-300 ${
                activeSlideIndex === 1 ? 'opacity-100' : 'opacity-65 hover:opacity-90 cursor-pointer'
              }`}
            >
              <div
                id="home-hero-stage-2"
                data-section-card="true"
                data-element-name="Thẻ trụ cột điều hành và dấu ấn thực chiến"
                data-element-type="card"
                data-element-page="home"
                data-element-parent="home-main-card-2"
                className="bento-card glass-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-between gap-[15px] overflow-y-auto no-scrollbar rounded-[var(--radius-card,14px)] box-border text-left p-[18px] sm:p-[24px]"
                style={{ borderRadius: 'var(--radius-card, 14px)' }}
              >
                {renderAuroraLayer()}

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                      <WebIcon name="layers" className="w-5 h-5 shrink-0" />
                      <h2 className="typo-h2 font-extrabold tracking-tight truncate card-title-synced" data-card-title="true">
                        {isEn ? 'Four Operating Pillars' : 'Bốn Trụ Cột Điều Hành'}
                      </h2>
                    </div>
                    <p className="typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
                      {isEn
                        ? 'End-to-end management framework combining technology, process discipline, and empathetic leadership.'
                        : 'Khung năng lực điều hành toàn diện kết hợp công nghệ số, kỷ luật quy trình và lãnh đạo thấu cảm.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      SoundEngine.playTap();
                      onNavigatePage?.(5);
                    }}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-full typo-badge font-bold border transition-all hover:opacity-90 cursor-pointer shrink-0"
                    style={{
                      background: 'var(--bg-button-primary)',
                      color: 'var(--text-button-primary, #FFFFFF)',
                      borderColor: 'transparent',
                    }}
                  >
                    <WebIcon name="briefcase" className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Work History' : 'Lịch sử công tác'}</span>
                  </button>
                </div>

                {/* 3 Headline CV Metrics */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-[15px] items-stretch">
                  {slide2Metrics.map((metric) => (
                    <div
                      key={metric.value}
                      data-subcard="true"
                      className="sub-card h-full rounded-[var(--radius-subcard,14px)] p-3.5 flex flex-col justify-between gap-1 border"
                      style={{
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                      }}
                    >
                      <span
                        className="typo-h2 font-extrabold tracking-tight tabular-nums"
                        style={{ color: metric.color }}
                      >
                        {isEn ? metric.valueEn : metric.value}
                      </span>
                      <span className="typo-caption font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? metric.labelEn : metric.labelVi}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 4 Operating Pillars Grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-[15px] items-stretch flex-1 min-h-0">
                  {operatingPillars.map((pillar) => (
                    <article
                      key={pillar.id}
                      data-subcard="true"
                      className="sub-card h-full rounded-[var(--radius-subcard,14px)] p-4 flex items-start gap-3.5 border"
                      style={{
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                      }}
                    >
                      <div
                        className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${pillar.accent} text-white flex items-center justify-center shrink-0 shadow-md`}
                      >
                        <WebIcon name={pillar.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3
                          className="typo-h4 font-bold leading-snug card-title-synced"
                          data-subcard-title="true"
                          style={{ color: 'var(--text-heading, var(--text-primary))' }}
                        >
                          {isEn ? pillar.titleEn : pillar.titleVi}
                        </h3>
                        <p className="typo-body-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {isEn ? pillar.descEn : pillar.descVi}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* SCREEN 3: CORE VALUES, HONORS & QUICK ROUTES */}
            <div
              id="home-main-card-3"
              data-main-card="true"
              data-element-name="Thẻ chính Trang chủ 3 - Giá trị & Kết nối"
              data-element-type="card"
              data-element-page="home"
              data-element-parent="home-cards-track"
              onClick={() => {
                if (activeSlideIndex !== 2) goToSlide(2);
              }}
              style={mainCardInlineStyle}
              className={`page-main-card home-screen-main-card relative shrink-0 flex flex-col justify-between overflow-hidden select-none font-play box-border transition-opacity duration-300 ${
                activeSlideIndex === 2 ? 'opacity-100' : 'opacity-65 hover:opacity-90 cursor-pointer'
              }`}
            >
              <div
                id="home-hero-stage-3"
                data-section-card="true"
                data-element-name="Thẻ giá trị cốt lõi và điều hướng nhanh"
                data-element-type="card"
                data-element-page="home"
                data-element-parent="home-main-card-3"
                className="bento-card glass-card relative flex-1 w-full min-w-0 min-h-0 flex flex-col justify-between gap-[15px] overflow-y-auto no-scrollbar rounded-[var(--radius-card,14px)] box-border text-left p-[18px] sm:p-[24px]"
                style={{ borderRadius: 'var(--radius-card, 14px)' }}
              >
                {renderAuroraLayer()}

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                      <WebIcon name="compass" className="w-5 h-5 shrink-0" />
                      <h2 className="typo-h2 font-extrabold tracking-tight truncate card-title-synced" data-card-title="true">
                        {isEn ? 'Core Values & Strategic Impact' : 'Giá Trị Cốt Lõi & Định Hướng'}
                      </h2>
                    </div>
                    <p className="typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
                      {isEn
                        ? 'Guiding philosophy and direct shortcuts to explore systems, case studies, and direct partnership.'
                        : 'Kim chỉ nam nghề nghiệp và lối tắt khám phá nhanh hồ sơ, dự án thực chiến cùng hệ thống công nghệ.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickNavigatePdf}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-full typo-badge font-bold border transition-all hover:opacity-90 cursor-pointer shrink-0"
                    style={{
                      background: 'var(--bg-button-primary)',
                      color: 'var(--text-button-primary, #FFFFFF)',
                      borderColor: 'transparent',
                    }}
                  >
                    <WebIcon name="file-text" className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Open Full Profile' : 'Xem hồ sơ tổng hợp'}</span>
                  </button>
                </div>

                {/* 3 Core Values Cards */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-[15px] items-stretch flex-1 min-h-0">
                  {coreValuesList.map((val) => (
                    <article
                      key={val.icon}
                      data-subcard="true"
                      className="sub-card h-full rounded-[var(--radius-subcard,14px)] p-4 flex flex-col justify-start gap-2.5 border"
                      style={{
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                          style={{
                            background: `${val.color}18`,
                            color: val.color,
                          }}
                        >
                          <WebIcon name={val.icon} className="w-4 h-4" />
                        </span>
                        <h3
                          className="typo-h4 font-bold leading-snug card-title-synced"
                          data-subcard-title="true"
                          style={{ color: 'var(--text-heading, var(--text-primary))' }}
                        >
                          {isEn ? val.titleEn : val.titleVi}
                        </h3>
                      </div>
                      <p className="typo-body-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {isEn ? val.descEn : val.descVi}
                      </p>
                    </article>
                  ))}
                </div>

                {/* Quick Navigation Shortcuts */}
                <div
                  data-subcard="true"
                  className="sub-card relative z-10 rounded-[var(--radius-subcard,14px)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border"
                  style={{
                    background: 'var(--bg-subcard)',
                    borderColor: 'var(--border-subcard)',
                  }}
                >
                  <span className="typo-body-sm font-bold shrink-0" style={{ color: 'var(--text-heading)' }}>
                    {isEn ? 'Explore sections:' : 'Khám phá nhanh chuyên mục:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {slideQuickRoutes.map((route) => (
                      <button
                        key={route.pageId}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          SoundEngine.playPageSpecificSound(route.pageId);
                          onNavigatePage?.(route.pageId);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-badge font-bold border transition-transform hover:-translate-y-0.5 cursor-pointer"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: 'var(--border-subcard)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <WebIcon name={route.icon} className="w-3.5 h-3.5" style={{ color: route.color }} />
                        <span>{isEn ? route.labelEn : route.labelVi}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left / Right Slide Arrow Buttons (shown cleanly inside Home viewport) */}
        {activeSlideIndex > 0 && (
          <button
            id="home-slide-prev-btn"
            type="button"
            onClick={() => goToSlide(activeSlideIndex - 1)}
            aria-label={isEn ? 'Previous home screen' : 'Màn hình trước'}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full items-center justify-center border shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isDark ? 'rgba(15, 23, 42, 0.86)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(148, 163, 184, 0.35)',
              color: 'var(--text-heading, var(--text-primary))',
            }}
          >
            <WebIcon name="chevron-left" className="w-5 h-5" />
          </button>
        )}
        {activeSlideIndex < 2 && (
          <button
            id="home-slide-next-btn"
            type="button"
            onClick={() => goToSlide(activeSlideIndex + 1)}
            aria-label={isEn ? 'Next home screen' : 'Màn hình tiếp theo'}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full items-center justify-center border shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isDark ? 'rgba(15, 23, 42, 0.86)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(148, 163, 184, 0.35)',
              color: 'var(--text-heading, var(--text-primary))',
            }}
          >
            <WebIcon name="chevron-right" className="w-5 h-5" />
          </button>
        )}

        {/* Bottom Dock Screen Switcher (#el-p0-div-16) */}
        <div
          id="el-p0-div-16"
          role="tablist"
          aria-label={isEn ? 'Home screens' : 'Chuyển màn hình trang chủ'}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1 p-1 rounded-full"
        >
          {slideDockTabs.map((tab) => {
            const selected = activeSlideIndex === tab.index;
            return (
              <button
                key={tab.index}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => goToSlide(tab.index)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                <WebIcon name={tab.icon} className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? tab.labelEn : tab.labelVi}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

