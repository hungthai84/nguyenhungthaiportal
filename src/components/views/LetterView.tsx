'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { formatCardTitle } from '@/lib/utils';
import {
  CAREER_MILESTONES_DATA,
  CORE_VALUES_DATA,
  OPERATIONAL_PRINCIPLES_DATA,
  CareerMilestoneItem,
} from '@/data/letterData';
import { useTheme } from '@/hooks/useTheme';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';

// Video thuyết minh Thư Ngỏ (Đồng bộ từ Video Giới thiệu - AboutView Video 1 & Video 2)
export const LETTER_VIDEO_1_ID = '156Uwr88AhLmybquXyrMsXqzxdAs5I6lw';
export const LETTER_VIDEO_2_ID = '12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R';
export const LETTER_SLIDE_1_VIDEO_URL =
  'https://cdn.scena.ai/project/10223/73bc236e3e9c7f6be95f2e882e26e6ff67b5f2a108d180fba8b33518146ff2b7.mp4';
export const LETTER_SLIDE_2_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/87d892c1c37f70cfae99aa55e5888f93ea6b7015050fe44e5d1f54418f0b06b9.mp4';

// Authentic Signature image for Nguyễn Hùng Thái
const SIGNATURE_IMAGE_URL =
  'https://res.cloudinary.com/q5tpzaxk/image/upload/v1794826442/Ch%E1%BB%AF_k%C3%BD.png';

const SignatureSvg = () => (
  <img
    src={SIGNATURE_IMAGE_URL}
    alt="Chữ ký Nguyễn Hùng Thái"
    loading="lazy"
    decoding="async"
    referrerPolicy="no-referrer"
    className="h-12 sm:h-14 w-auto max-w-[180px] sm:max-w-[220px] object-contain object-left bg-transparent border-0 p-0 shadow-none select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]"
  />
);

// 8 Thương hiệu từng đồng hành lấy trực tiếp từ trang kinh nghiệm (Experience)
const EXPERIENCE_BRANDS_MARQUEE = [
  { id: 'mobifone', company: 'MobiFone', logo: 'https://i.postimg.cc/3N4xX9Xd/Mobifone.png' },
  { id: 'v247', company: 'Viễn Liên V247', logo: 'https://i.postimg.cc/wMyjXFXc/V247.png' },
  { id: 'lbc', company: 'LBC – HTVC', logo: 'https://i.postimg.cc/kG6gQwQ4/LBC.png' },
  { id: 'ved', company: 'VED (Garena / Shopee)', logo: 'https://i.postimg.cc/NF9j6b6x/VED.png' },
  { id: 'prudential', company: 'Prudential Việt Nam', logo: 'https://i.postimg.cc/C5BxGJGk/Prudential.png' },
  { id: 'momo', company: 'Ví MoMo', logo: 'https://i.postimg.cc/J0DzNKNy/Momo.png' },
  { id: 'finviet', company: 'Finviet (Ví ECO)', logo: 'https://i.postimg.cc/mD6r1KHh/Finviet.png' },
  { id: 'challenge', company: 'Sẵn sàng thử thách mới', logo: 'https://i.postimg.cc/sxQgYKYh/Power-Service.png' },
];

// Map icon string name to WebIcon name
const getMilestoneIconName = (name: string): string => {
  switch (name) {
    case 'Signal':
      return 'signal';
    case 'Headset':
      return 'headphones';
    case 'Tv':
      return 'tv';
    case 'Gamepad2':
      return 'gamepad';
    case 'ShoppingBag':
    case 'ShoppingCart':
      return 'shopping-bag';
    case 'ShieldCheck':
      return 'shield';
    case 'CreditCard':
      return 'card';
    case 'Heart':
      return 'heart';
    case 'Lightbulb':
      return 'lightbulb';
    case 'BarChart2':
      return 'chart';
    case 'Users':
      return 'users';
    case 'Target':
      return 'target';
    case 'Sparkles':
      return 'sparkles';
    case 'Award':
      return 'trophy';
    case 'Rocket':
      return 'rocket';
    case 'Network':
      return 'network';
    default:
      return 'briefcase';
  }
};

// Adaptive layout mode selector based on sub-card count & visual hierarchy
const resolveAdaptiveCardLayout = (
  subCardCount: number,
  hasAsymmetricFocalCard: boolean
): 'bento' | 'grid' => {
  if (hasAsymmetricFocalCard) return 'bento';
  return subCardCount >= 2 ? 'grid' : 'bento';
};

// Animated Card Title Subcomponent (Keep icon/logo before title, no sub-title, no extra content on the right of title)
const AnimatedCardTitle: React.FC<{
  iconName: string;
  title: string;
  colorPreset?: 'emerald' | 'cyan' | 'purple' | 'rose' | 'orange' | 'blue';
  actionRight?: React.ReactNode;
  animateIcon?: boolean;
}> = ({
  iconName,
  title,
  colorPreset = 'blue',
  actionRight,
  animateIcon = false,
}) => {
  const colorMap = {
    emerald: {
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    cyan: {
      text: 'text-cyan-700 dark:text-cyan-300',
    },
    purple: {
      text: 'text-purple-700 dark:text-purple-300',
    },
    rose: {
      text: 'text-rose-700 dark:text-rose-300',
    },
    orange: {
      text: 'text-orange-700 dark:text-orange-300',
    },
    blue: {
      text: 'text-blue-700 dark:text-blue-300',
    },
  };

  const scheme = colorMap[colorPreset] || colorMap.blue;

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2 shrink-0 border-0">
      <div
        className={`card-header-sync inline-flex items-center gap-2 ${scheme.text} max-w-full leading-tight min-w-0 flex-1`}
      >
        <span
          className={`inline-flex items-center justify-center w-[16px] h-[16px] shrink-0 bg-transparent border-0 p-0 shadow-none ${
            animateIcon ? 'animate-[icon-floating_3s_ease-in-out_infinite]' : ''
          }`}
          style={{ width: '16px', height: '16px' }}
        >
          <WebIcon
            name={iconName}
            size={16}
            className="w-[16px] h-[16px] shrink-0 card-title-icon"
            style={{ width: '16px', height: '16px' }}
          />
        </span>
        <h3
          className={`card-title card-title-synced typo-h3 font-play tracking-tight ${scheme.text} break-words`}
          data-card-title="true"
        >
          {formatCardTitle(title)}
        </h3>
      </div>
      {actionRight && <div className="shrink-0">{actionRight}</div>}
    </div>
  );
};

export interface LetterViewProps {
  currentTheme?: string;
  onOpenBannerStudio?: (pageId: number) => void;
  onShowNotification: (msg: string) => void;
  onOpenMilestoneModal?: (item: any) => void;
}

export const LetterView: React.FC<LetterViewProps> = ({
  currentTheme = 'liquid-glass',
}) => {
  const { isDark: themeIsDark } = useTheme();

  // Current Theme detection
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'dark-cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-frost-ice-neu';

  // Collapse/Expand state for career milestones inline bilingual view
  const [expandedCard, setExpandedCard] = useState<Record<string, boolean>>({});

  // Scroll viewport ref inside the unified single main card
  const letterScrollViewportRef = useRef<HTMLDivElement>(null);

  // Sync single-card slide state (slide 0) with global Footer controls
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', { detail: { tabIndex: 1, slide: 0 } })
    );

    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.tabIndex === undefined || detail.tabIndex === 1)) {
        letterScrollViewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, []);

  // Lời chào chuẩn trang trọng gửi tới Quý Công ty
  const companyDisplay = 'Quý Công ty';

  // Dynamic theme-aware Card classes synced with global theme tokens
  const getGlassCardClass = useCallback(() => {
    return 'bento-card glass-card transition-all duration-300';
  }, []);

  // Helper format in đậm (**...**) giữ nguyên toàn bộ nội dung văn bản gốc
  const renderFormattedText = useCallback((text: string) => {
    if (!text) return '';
    const tokens = text.split('**');
    return tokens.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong
            key={i}
            className="font-bold text-slate-900 dark:text-white transition-colors duration-300"
          >
            {part}
          </strong>
        );
      }
      return part;
    });
  }, []);

  // Subcomponent to render each career milestone as a responsive Multi-Color Bento View Card
  const renderCareerCard = (
    item: CareerMilestoneItem,
    bentoSpan: string = 'md:col-span-6',
    hideYear: boolean = false
  ) => {
    const roleIcon = getMilestoneIconName(item.roleIconName);
    const highlightIcon = getMilestoneIconName(item.highlightIconName || 'Sparkles');
    const isExpanded = !!expandedCard[item.id];

    const rawTitle = item.milestoneTitleVi || item.company;
    const cleanTitle = hideYear
      ? rawTitle.replace(/\s*\(\d{4}[^\)]*\)/g, '').trim()
      : rawTitle;
    const displayTitle = cleanTitle;

    const yearText = /^\s*năm\s+/i.test(item.yearLabelVi)
      ? item.yearLabelVi
      : `Năm ${item.yearLabelVi}`;

    return (
      <article
        key={item.id}
        id={item.id}
        role="region"
        aria-label={`${displayTitle} - ${item.roleVi}`}
        data-element-type="card"
        data-section-card="true"
        style={{
          gap: '6px',
          padding: '12px',
          borderRadius: 'var(--radius-card, 24px)',
          background: 'transparent',
          backgroundColor: 'transparent',
        }}
        className={`bento-view-card bento-card glass-card flex flex-col justify-between p-[12px] gap-[6px] relative transition-colors duration-200 overflow-visible group/mcard w-full mx-auto h-full min-h-0 min-w-0 cursor-default text-left rounded-[14px] bg-transparent ${bentoSpan}`}
      >
        {/* Subtle Brand Color Radial Tint */}
        <div
          className="absolute inset-0 rounded-[inherit] overflow-hidden opacity-[0.03] dark:opacity-[0.06] pointer-events-none transition-opacity duration-200 group-hover/mcard:opacity-[0.08]"
          style={{
            background: `radial-gradient(circle at bottom right, ${item.color}, transparent 70%)`,
          }}
        />

        {/* 1. HEADER ZONE: Year - Icon & Title on Left, Logo 1:1 on Right */}
        <div className="w-full flex items-center justify-between gap-2.5 shrink-0 relative z-10 min-w-0 border-0">
          <div className="min-w-0 flex-1 subcard-header-sync text-left" style={{ color: item.color }}>
            <h4
              className="card-title subcard-title-synced typo-h4 tracking-tight font-play leading-snug break-words flex flex-wrap items-center gap-1.5 min-w-0"
              data-subcard-title="true"
              style={{ color: item.color }}
              title={!hideYear ? `${yearText} - ${displayTitle}` : displayTitle}
            >
              {!hideYear && (
                <>
                  <span
                    className="font-bold font-play tabular-nums tracking-wide shrink-0 whitespace-nowrap"
                    style={{ color: item.color }}
                  >
                    {yearText}
                  </span>
                  <span className="font-bold shrink-0" style={{ color: item.color }}>
                    -
                  </span>
                </>
              )}
              <WebIcon name="building-2" className="w-4 h-4 shrink-0" style={{ color: item.color }} />
              <span className="min-w-0 break-words">{displayTitle}</span>
            </h4>
          </div>

          <div
            style={{
              background: 'var(--surface-secondary-bg, var(--bg-card))',
              border: 'none',
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 aspect-square rounded-full overflow-hidden border-0 shrink-0 flex items-center justify-center p-0 shadow-none transition-transform duration-200 group-hover/mcard:scale-105 ml-auto"
          >
            <img
              src={item.logo}
              alt={item.company}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* 2. BODY ZONE: Supporting Content */}
        <div className="w-full flex-1 text-left relative z-10 flex flex-col justify-start gap-1.5 min-h-0 min-w-0">
          <div className="flex flex-col gap-0.5 typo-body-sm border-0">
            <div className="flex items-start gap-1.5 leading-snug">
              <span
                className="font-bold shrink-0 inline-flex items-center gap-1"
                style={{ color: item.color }}
              >
                <WebIcon name={roleIcon} className="w-3.5 h-3.5 shrink-0" />
                Vị trí:
              </span>
              <span className="font-semibold text-[var(--text-primary)] break-words">
                {item.roleVi}
              </span>
            </div>
            {item.managementVi && (
              <div className="flex items-start gap-1.5 leading-snug">
                <span
                  className="font-bold shrink-0 inline-flex items-center gap-1"
                  style={{ color: item.color }}
                >
                  <WebIcon name="users" className="w-3.5 h-3.5 shrink-0" />
                  Quản lý:
                </span>
                <span className="font-medium text-[var(--text-primary)] break-words">
                  {item.managementVi}
                </span>
              </div>
            )}
            {item.workVi && (
              <div className="flex items-start gap-1.5 leading-snug">
                <span
                  className="font-bold shrink-0 inline-flex items-center gap-1"
                  style={{ color: item.color }}
                >
                  <WebIcon name="list-checks" className="w-3.5 h-3.5 shrink-0" />
                  Công việc:
                </span>
                <span className="font-medium text-[var(--text-primary)] break-words">
                  {item.workVi}
                </span>
              </div>
            )}
          </div>
          <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-snug text-left break-words [overflow-wrap:anywhere]">
            {renderFormattedText(item.descVi)}
          </p>
          {item.descViPart2 && (
            <p className="card-body-text typo-body-sm text-[var(--text-primary)] leading-snug text-left break-words [overflow-wrap:anywhere] border-0">
              {renderFormattedText(item.descViPart2)}
            </p>
          )}

          {isExpanded && (
            <p className="card-body-text typo-body-sm text-[var(--text-muted)] italic mt-0.5 break-words [overflow-wrap:anywhere] border-0">
              {item.descEn}
            </p>
          )}

          {item.showMoreLink && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playTap();
                setExpandedCard((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
              }}
              className="card-tag typo-button font-bold text-rose-600 dark:text-rose-400 mt-0.5 inline-flex items-center gap-1 cursor-pointer self-start shrink-0"
            >
              {isExpanded ? (
                <>
                  <WebIcon name="chevron-up" className="w-3.5 h-3.5" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <span>Xem thêm →</span>
              )}
            </button>
          )}
        </div>

        {/* 3. FOOTER & HIGHLIGHT ZONE */}
        <div className="w-full flex items-center justify-between gap-2 typo-body-sm font-semibold relative z-10 shrink-0 min-w-0 border-0">
          <div className="flex items-start gap-1.5 min-w-0 flex-1" style={{ color: item.color }}>
            <WebIcon name={highlightIcon} className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="whitespace-normal break-words leading-snug text-left" title={item.highlightVi}>
              {item.highlightVi}
            </span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      id="letter-page-shell"
      className="relative w-full max-w-full min-w-0 h-full flex-1 flex flex-col items-center justify-start min-h-0 overflow-hidden bg-transparent"
    >
      <div
        id="letter-page-container"
        data-element-name="Trang Thư Ngỏ"
        data-element-type="container"
        data-element-page="letter"
        data-element-parent="global-content-viewport"
        data-no-wheel-horizontal="true"
        className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-col items-center justify-start p-0 font-play text-left text-[var(--text-primary)] rounded-none overflow-hidden z-10 select-none box-border bg-transparent"
      >
        <div
          id="letter-cards-track"
          data-element-name="Khung Thư Ngỏ Chính"
          data-element-type="container"
          data-element-page="letter"
          data-element-parent="letter-page-container"
          className="page-cards-track relative w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch overflow-hidden m-0 p-0 box-border"
        >
          {/* ========================================================================= */}
          {/* THẺ CHÍNH DUY NHẤT TRANG THƯ NGỎ (#letter-main-card)                      */}
          {/* ========================================================================= */}
          <div
            id="letter-main-card"
            data-element-name="Thẻ chính Thư ngỏ"
            data-element-type="card"
            data-main-card="true"
            data-floating-surface="main"
            data-element-page="letter"
            data-element-parent="letter-cards-track"
            style={{
              padding: 'var(--main-card-padding, 15px)',
              borderRadius: 'var(--radius-global, var(--radius-primary-surface, var(--radius-main, 14px)))',
            }}
            className="group/letter page-main-card floating-glass-surface floating-surface--main relative z-10 w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col justify-start p-[15px] overflow-hidden font-play text-left select-none box-border opacity-100 transition-all duration-300"
          >
            <div
              ref={letterScrollViewportRef}
              id="letter-main-scroll-viewport"
              data-element-name="Vùng cuộn nội dung Thư ngỏ"
              data-element-page="letter"
              data-element-parent="letter-main-card"
              className="main-card-scroll-viewport w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[12px] overflow-y-auto overflow-x-hidden no-scrollbar box-border"
            >
              {/* ========================================================================= */}
              {/* PHẦN 1: VIDEO + THÔNG ĐIỆP HỢP TÁC + THƯƠNG HIỆU + GIÁ TRỊ + CHÂM NGÔN    */}
              {/* ========================================================================= */}
              <div
                id="el-p1-div-85"
                data-element-name="Lưới nội dung Giới thiệu Thư ngỏ"
                data-element-parent="letter-main-card"
                data-card-layout={resolveAdaptiveCardLayout(5, true)}
                data-subcard-count={5}
                className="w-full max-w-full mx-auto h-auto min-h-0 shrink-0 grid grid-cols-1 md:grid-cols-12 gap-[12px] items-stretch auto-rows-auto p-0 rounded-none box-border"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  minHeight: '0px',
                  height: 'auto',
                  flex: '0 0 auto',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px',
                  gap: '12px',
                  rowGap: '12px',
                  columnGap: '12px',
                  borderRadius: '0px',
                }}
              >
                {/* THẺ BENTO 1: Video Card Thuyết Minh (Chiều cao khớp bằng Thông điệp hợp tác + Thương hiệu đồng hành) */}
                <article
                  id="bento-letter-video"
                  data-element-name="Video card Thư ngỏ"
                  data-element-type="card"
                  data-media-card="video"
                  data-section-card="true"
                  data-element-page="letter"
                  data-element-parent="letter-main-card"
                  style={{ padding: '0px', borderRadius: 'var(--radius-card, 14px)' }}
                  className="bento-card glass-card col-span-1 md:col-span-6 lg:col-span-7 rounded-[var(--radius-card,14px)] aspect-video md:aspect-auto min-h-[200px] md:min-h-[240px] self-stretch w-full h-full min-w-0 relative overflow-hidden flex flex-col justify-center items-center p-0 box-border transition-colors duration-200 group/video text-left object-cover"
                >
                  <div
                    className="relative w-full h-full flex-1 rounded-[var(--radius-card,14px)] overflow-hidden min-h-0 flex items-center justify-center object-cover"
                    style={{ objectFit: 'cover', borderRadius: 'var(--radius-card, 14px)' }}
                  >
                    <DualLayerVideoPlayer
                      video1Id={LETTER_VIDEO_1_ID}
                      video1Src={LETTER_SLIDE_1_VIDEO_URL}
                      video2Id={LETTER_VIDEO_2_ID}
                      video2Src={LETTER_SLIDE_2_VIDEO_URL}
                      autoPlayVideo1={true}
                      muteVideo1={true}
                      loopVideo1={true}
                      className="absolute inset-0 z-0 pointer-events-auto"
                    />
                  </div>
                </article>

                {/* CỘT PHẢI HÀNG 1 (5/12 cột trên Desktop): Thông Điệp Hợp Tác + Thương Hiệu Đồng Hành */}
                <div
                  id="letter-intro-right-stack"
                  className="letter-right-stack col-span-1 md:col-span-6 lg:col-span-5 flex flex-col gap-[12px] w-full h-full min-h-0 min-w-0"
                  style={{ gap: '12px', padding: '0px', background: 'transparent', border: 'none', boxShadow: 'none' }}
                >
                  {/* THẺ BENTO 2: Thông Điệp Hợp Tác */}
                  <article
                    id="bento-commitment"
                    data-element-name="Thẻ Bento Thông Điệp Hợp Tác"
                    data-element-type="card"
                    data-section-card="true"
                    data-element-page="letter"
                    style={{ padding: '12px', gap: '8px', borderRadius: 'var(--radius-card, 24px)' }}
                    className="bento-card glass-card h-auto flex-1 min-h-0 p-[12px] rounded-[14px] flex flex-col justify-between gap-[8px] relative overflow-visible transition-colors duration-200 w-full min-w-0"
                  >
                    <div className="flex items-center justify-between shrink-0 gap-2 min-w-0 border-0">
                      <div className="card-header-sync inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-300 leading-tight min-w-0">
                        <WebIcon
                          name="book"
                          size={16}
                          className="w-[16px] h-[16px] shrink-0 card-title-icon text-cyan-600 dark:text-cyan-300"
                          style={{ width: '16px', height: '16px' }}
                        />
                        <h2
                          className="card-title card-title-synced typo-h3 font-play tracking-tight text-cyan-600 dark:text-cyan-300 truncate"
                          data-card-title="true"
                        >
                          Thông điệp hợp tác
                        </h2>
                      </div>
                    </div>

                    <div className="py-0 space-y-1.5 flex flex-col justify-start text-left min-w-0">
                      <h3
                        id="callout-salutation"
                        className="card-title typo-h4 font-play tracking-tight transition-all duration-300 break-words text-[var(--text-primary)]"
                      >
                        Kính chào {companyDisplay}!
                      </h3>

                      <p className="card-body typo-body-sm leading-snug text-[var(--text-secondary)] break-words [overflow-wrap:anywhere]">
                        Tôi là{' '}
                        <strong className="font-bold text-[var(--text-primary)]">
                          Nguyễn Hùng Thái
                        </strong>
                        , Trưởng phòng Chăm sóc Khách hàng với hơn{' '}
                        <span className="font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
                          22 năm kinh nghiệm
                        </span>{' '}
                        trong lĩnh vực xây dựng, vận hành và phát triển hệ thống dịch vụ khách hàng.
                      </p>
                    </div>
                  </article>

                  {/* THẺ BENTO 6: Thương hiệu đồng hành */}
                  <article
                    id="bento-brands-marquee"
                    data-element-name="Thẻ Bento Thương Hiệu Đồng Hành"
                    data-element-type="card"
                    data-section-card="true"
                    data-element-page="letter"
                    style={{ padding: '12px', gap: '8px', borderRadius: 'var(--radius-card, 24px)' }}
                    className="partner-card bento-card glass-card shrink-0 w-full h-auto p-[12px] rounded-[14px] flex flex-col justify-start gap-[8px] transition-colors duration-200 group/marquee min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 shrink-0 min-w-0 border-0">
                      <div className="card-header-sync inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 leading-tight min-w-0">
                        <WebIcon
                          name="briefcase"
                          size={16}
                          className="w-[16px] h-[16px] shrink-0 card-title-icon text-blue-600 dark:text-cyan-400"
                          style={{ width: '16px', height: '16px' }}
                        />
                        <h3
                          className="card-title card-title-synced typo-h3 font-play text-blue-600 dark:text-cyan-400 whitespace-normal break-words"
                          data-card-title="true"
                        >
                          Thương hiệu đồng hành
                        </h3>
                      </div>
                    </div>

                    <div
                      id="brands-bento-grid"
                      className="flex flex-row flex-nowrap items-stretch gap-[12px] w-full overflow-hidden min-w-0"
                    >
                      <div className="animate-marquee-ltr flex flex-row items-center gap-[12px]">
                        {[...EXPERIENCE_BRANDS_MARQUEE, ...EXPERIENCE_BRANDS_MARQUEE].map((item, idx) => (
                          <div
                            key={`${item.id}-${idx}`}
                            data-subcard="true"
                            className="sub-card letter-subcard partner-brand-tile group/logo shrink-0 inline-flex flex-row flex-nowrap items-center gap-2 whitespace-nowrap px-2.5 py-1.5 rounded-[var(--radius-subcard,16px)] transition-colors duration-200"
                            title={item.company}
                          >
                            <div
                              className="partner-logo-badge w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-full border-0 shadow-none group-hover/logo:scale-105 transition-all duration-300 relative shrink-0 p-0 overflow-hidden"
                              style={{
                                borderRadius: '9999px',
                                background: 'var(--surface-secondary-bg, var(--bg-card))',
                                border: 'none',
                                padding: '0px',
                              }}
                            >
                              <img
                                src={item.logo}
                                alt={item.company}
                                loading="lazy"
                                decoding="async"
                                className="partner-logo-img w-full h-full object-cover rounded-full transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="card-tag typo-body-sm font-semibold font-play text-[var(--text-primary)] group-hover/logo:text-blue-700 dark:group-hover/logo:text-cyan-300 transition-colors leading-tight whitespace-nowrap shrink-0">
                              {item.company}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>

                {/* HÀNG 2 CÙNG HÀNG: GIÁ TRỊ CỐT LÕI (8/12) + CHÂM NGÔN PHỤNG SỰ (4/12) */}
                <div
                  id="card-core-values-pursued"
                  data-element-type="card"
                  data-section-card="true"
                  style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)', containerType: 'inline-size', containerName: 'core-values-card' }}
                  className={`bento-view-card col-span-1 md:col-span-7 lg:col-span-8 w-full h-full min-h-0 p-[12px] gap-[10px] transition-all duration-200 flex flex-col items-start justify-between group/values z-10 text-left rounded-[14px] min-w-0 ${getGlassCardClass()}`}
                >
                  <AnimatedCardTitle
                    iconName="trophy"
                    title="Giá trị cốt lõi"
                    colorPreset="orange"
                  />

                  <div
                    id="core-values-grid"
                    data-card-layout={resolveAdaptiveCardLayout(CORE_VALUES_DATA.length, false)}
                    data-subcard-count={CORE_VALUES_DATA.length}
                    className="grid grid-cols-2 md:grid-cols-4 gap-[10px] auto-rows-auto items-stretch w-full flex-1 min-h-0 min-w-0"
                    style={{ gap: '10px', rowGap: '10px', columnGap: '10px' }}
                  >
                    {CORE_VALUES_DATA.map((val) => {
                      const valIconName =
                        val.number === '01'
                          ? 'heart'
                          : val.number === '02'
                          ? 'target'
                          : val.number === '03'
                          ? 'lightbulb'
                          : 'handshake';

                      return (
                        <div
                          key={val.number}
                          id={`core-val-${val.number}`}
                          data-subcard="true"
                          style={{ borderRadius: 'var(--radius-subcard, 14px)' }}
                          className="sub-card letter-subcard relative overflow-visible flex flex-col justify-between h-full transition-colors duration-200 text-left group rounded-[14px] min-w-0"
                        >
                          <div
                            className="absolute inset-0 rounded-[inherit] overflow-hidden opacity-[0.06] dark:opacity-[0.14] pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at bottom right, ${val.colorTheme.primary}, transparent 70%)`,
                            }}
                          />

                          <div className="flex items-center justify-between relative z-10 gap-1 min-w-0">
                            <div
                              className={`subcard-header-sync flex items-center gap-1.5 min-w-0 flex-1 ${val.colorTheme.text}`}
                            >
                              <WebIcon name={valIconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                              <h4
                                className={`card-title subcard-title-synced typo-h4 tracking-tight font-play leading-snug break-words min-w-0 ${val.colorTheme.text}`}
                                data-subcard-title="true"
                              >
                                {formatCardTitle(val.titleVi)}
                              </h4>
                            </div>
                          </div>

                          <div className="flex-1 flex items-start relative z-10 text-left min-w-0">
                            <p className="card-body-text typo-body-sm text-[var(--text-secondary)] font-normal leading-snug break-words">
                              {val.descVi}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* THẺ BENTO 7: Tuyên ngôn & Danh ngôn Phụng sự */}
                <article
                  id="quote-banner-slide-1"
                  data-element-name="Thẻ Bento Danh Ngôn Phụng Sự"
                  data-element-type="card"
                  data-section-card="true"
                  data-element-page="letter"
                  style={{ padding: '16px', borderRadius: 'var(--radius-card, 14px)' }}
                  className="motto-card bento-card glass-card col-span-1 md:col-span-5 lg:col-span-4 relative rounded-[14px] p-4 flex flex-col justify-between gap-3 transition-colors duration-200 group/quote w-full h-full min-h-0 min-w-0"
                >
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/15 blur-3xl rounded-full" />
                  </div>

                  <div className="flex items-center justify-between gap-2 relative z-10 min-w-0 shrink-0 border-0">
                    <div className="card-header-sync inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 leading-tight min-w-0">
                      <WebIcon
                        name="quote"
                        size={16}
                        className="w-[16px] h-[16px] shrink-0 card-title-icon text-amber-700 dark:text-amber-300"
                        style={{ width: '16px', height: '16px' }}
                      />
                      <h3
                        className="card-title card-title-synced typo-h3 font-play tracking-tight text-amber-700 dark:text-amber-300 whitespace-normal break-words"
                        data-card-title="true"
                      >
                        Châm ngôn phụng sự
                      </h3>
                    </div>
                  </div>

                  <div className="relative z-10 my-auto py-2 px-1 flex flex-col gap-2">
                    <span className="text-3xl font-serif text-amber-500/40 dark:text-amber-400/30 leading-none select-none">“</span>
                    <p
                      className="motto-quote-text typo-h3 font-handwriting font-quote font-bold tracking-wide text-amber-800 dark:text-amber-100 text-left drop-shadow-xs select-none relative z-10 -mt-3 pl-3 italic"
                      style={{ fontFamily: "var(--font-quote, 'Dancing Script', cursive)" }}
                    >
                      Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.
                    </p>
                    <span className="text-3xl font-serif text-amber-500/40 dark:text-amber-400/30 leading-none select-none text-right">”</span>
                  </div>
                </article>
              </div>

              {/* ========================================================================= */}
              {/* PHẦN 2: HÀNH TRÌNH KHỞI ĐẦU SỰ NGHIỆP (2002 - 2013)                       */}
              {/* ========================================================================= */}
              <div
                id="letter-slide-2-grid"
                data-element-name="Lưới cột mốc sự nghiệp 1"
                data-element-parent="letter-main-card"
                data-card-layout={resolveAdaptiveCardLayout(4, false)}
                data-subcard-count={4}
                className="w-full max-w-full min-w-0 h-auto min-h-0 shrink-0 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-[12px] p-0 items-stretch bg-transparent box-border"
                style={{
                  gap: '12px',
                  rowGap: '12px',
                  columnGap: '12px',
                  padding: '0px',
                  background: 'transparent',
                  width: '100%',
                  height: 'auto',
                  minHeight: '0px',
                  flex: '0 0 auto',
                }}
              >
                {CAREER_MILESTONES_DATA.slice(0, 4).map((item) =>
                  renderCareerCard(item, 'min-w-0 col-span-1', false)
                )}
              </div>

              {/* ========================================================================= */}
              {/* PHẦN 3: QUẢN TRỊ QUY MÔ LỚN & CHUYỂN ĐỔI SỐ (2013 - 2023)                 */}
              {/* ========================================================================= */}
              <div
                id="letter-slide-3-grid"
                data-element-name="Lưới cột mốc sự nghiệp 2"
                data-element-parent="letter-main-card"
                data-card-layout={resolveAdaptiveCardLayout(4, false)}
                data-subcard-count={4}
                className="w-full max-w-full min-w-0 h-auto min-h-0 shrink-0 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-[12px] p-0 items-stretch bg-transparent box-border"
                style={{
                  gap: '12px',
                  rowGap: '12px',
                  columnGap: '12px',
                  padding: '0px',
                  background: 'transparent',
                  width: '100%',
                  height: 'auto',
                  minHeight: '0px',
                  flex: '0 0 auto',
                }}
              >
                {CAREER_MILESTONES_DATA.slice(4, 8).map((item) =>
                  renderCareerCard(item, 'min-w-0 col-span-1', false)
                )}
              </div>

              {/* ========================================================================= */}
              {/* PHẦN 4: TRIẾT LÝ QUẢN TRỊ + NGUYÊN TẮC CỐT LÕI + TÂM THƯ ĐỒNG HÀNH        */}
              {/* ========================================================================= */}
              <div
                id="letter-slide-4-bento-grid"
                data-element-name="Lưới Triết lý & Tâm thư Thư ngỏ"
                data-element-parent="letter-main-card"
                data-card-layout={resolveAdaptiveCardLayout(3, true)}
                data-subcard-count={3}
                className="w-full max-w-full min-w-0 h-auto min-h-0 shrink-0 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-auto gap-[12px] p-0 items-stretch bg-transparent box-border"
                style={{
                  gap: '12px',
                  rowGap: '12px',
                  columnGap: '12px',
                  padding: '0px',
                  background: 'transparent',
                  width: '100%',
                  height: 'auto',
                  minHeight: '0px',
                  flex: '0 0 auto',
                }}
              >
                {/* BENTO CARD 1 (Full row 12/12): BA NGUYÊN TẮC CỐT LÕI (3 sub-card ngang hàng cân đối) */}
                <div
                  id="card-three-principles"
                  data-element-type="card"
                  data-section-card="true"
                  style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)', containerType: 'inline-size', containerName: 'principles-card' }}
                  className={`bento-view-card col-span-1 md:col-span-6 lg:col-span-12 w-full h-full min-h-0 min-w-0 relative overflow-visible p-[12px] gap-[10px] rounded-[14px] group text-left flex flex-col justify-between transition-colors duration-200 ${getGlassCardClass()}`}
                >
                  <div className="flex flex-col items-start text-left w-full gap-1.5 min-w-0">
                    <AnimatedCardTitle
                      iconName="layers"
                      title="Nguyên Tắc Cốt Lõi"
                      colorPreset="blue"
                    />

                    <p className="card-tag typo-body-sm font-semibold text-[var(--text-secondary)] tracking-wide font-mono">
                      Tôi luôn làm việc dựa trên ba nguyên tắc cốt lõi:
                    </p>
                  </div>

                  <div
                    data-card-layout={resolveAdaptiveCardLayout(OPERATIONAL_PRINCIPLES_DATA.length, false)}
                    data-subcard-count={OPERATIONAL_PRINCIPLES_DATA.length}
                    className="letter-principles-subgrid grid grid-cols-1 md:grid-cols-3 auto-rows-auto gap-[10px] w-full items-stretch min-w-0 flex-1 min-h-0"
                    style={{ gap: '10px', rowGap: '10px', columnGap: '10px' }}
                  >
                    {OPERATIONAL_PRINCIPLES_DATA.map((principle, idx) => {
                      const iconName = idx === 0 ? 'layers' : idx === 1 ? 'users' : 'network';
                      const principleColor = isDark
                        ? (idx === 0 ? '#7DD3FC' : idx === 1 ? '#D8B4FE' : '#6EE7B7')
                        : (idx === 0 ? '#1D4ED8' : idx === 1 ? '#7E22CE' : '#047857');
                      return (
                        <div
                          key={principle.id}
                          data-subcard="true"
                          style={{ padding: '10px 12px', borderRadius: 'var(--radius-subcard, 14px)' }}
                          className="sub-card letter-subcard h-full p-[10px] rounded-[14px] text-left flex flex-col justify-between gap-1.5 transition-colors duration-200 min-w-0"
                        >
                          <div className="flex items-center justify-between gap-2 min-w-0">
                            <div
                              className="subcard-header-sync flex items-center gap-2 font-semibold min-w-0"
                              style={{
                                color: principleColor,
                              }}
                            >
                              <WebIcon name={iconName} className="w-4 h-4 shrink-0" style={{ color: principleColor }} />
                              <h4
                                className="card-title subcard-title-synced typo-h4 font-play tracking-tight break-words leading-snug"
                                data-subcard-title="true"
                                style={{ color: principleColor }}
                              >
                                {principle.titleVi}
                              </h4>
                            </div>
                            <span className="card-tag typo-label font-mono tabular-nums font-bold text-[var(--text-muted)] shrink-0">
                              0{idx + 1}
                            </span>
                          </div>
                          <p className="card-body-text typo-body-sm text-[var(--text-secondary)] leading-snug break-words [overflow-wrap:anywhere]">
                            {principle.descVi}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BENTO CARD 2 (5/12 cols): TRIẾT LÝ QUẢN TRỊ */}
                <div
                  id="card-philosophy"
                  data-element-type="card"
                  data-section-card="true"
                  style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)' }}
                  className={`bento-view-card col-span-1 md:col-span-3 lg:col-span-5 w-full h-full min-h-0 min-w-0 relative overflow-visible p-[12px] gap-[10px] rounded-[14px] group text-left flex flex-col justify-between transition-colors duration-200 ${getGlassCardClass()}`}
                >
                  <div className="flex flex-col items-start text-left w-full gap-[10px] min-w-0">
                    <AnimatedCardTitle
                      iconName="sparkles"
                      title="Triết Lý Quản Trị"
                      colorPreset="purple"
                    />

                    <p className="card-body-text typo-body-sm leading-snug text-[var(--text-primary)] break-words [overflow-wrap:anywhere]">
                      Qua hơn hai thập kỷ làm việc trong nhiều lĩnh vực khác nhau, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề mà là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững.
                    </p>

                    <p className="card-body-text typo-body-sm leading-snug text-[var(--text-secondary)] break-words [overflow-wrap:anywhere]">
                      Một dịch vụ xuất sắc bắt nguồn từ sự thấu hiểu sâu sắc hành trình khách hàng, chuẩn hóa các điểm chạm và tối ưu hóa năng suất vận hành toàn diện.
                    </p>
                  </div>

                  <div
                    data-subcard="true"
                    style={{ padding: '10px 12px', borderRadius: 'var(--radius-subcard, 14px)' }}
                    className="sub-card letter-subcard w-full p-[10px] rounded-[var(--radius-subcard,14px)] flex items-center gap-2.5 min-w-0"
                  >
                    <WebIcon name="target" className="w-4 h-4 text-purple-600 dark:text-cyan-400 shrink-0" />
                    <span className="typo-caption font-semibold text-purple-700 dark:text-cyan-300">
                      Khách hàng là trung tâm • Vận hành bền vững
                    </span>
                  </div>
                </div>

                {/* BENTO CARD 3 (7/12 cols): TÂM THƯ ĐỒNG HÀNH, LỜI KẾT & CHỮ KÝ */}
                <div
                  id="bento-companion-letter"
                  data-element-type="card"
                  data-section-card="true"
                  style={{ gap: '10px', padding: '12px', borderRadius: 'var(--radius-card, 14px)' }}
                  className={`bento-view-card col-span-1 md:col-span-3 lg:col-span-7 w-full h-full min-h-0 min-w-0 relative overflow-visible p-[12px] gap-[10px] rounded-[14px] group text-left flex flex-col justify-between transition-colors duration-200 ${getGlassCardClass()}`}
                >
                  <div className="flex flex-col gap-[8px] min-w-0">
                    <AnimatedCardTitle
                      iconName="heart"
                      title="Tâm Thư Đồng Hành"
                      colorPreset="rose"
                    />

                    <div className="card-body-text typo-body-sm leading-snug text-[var(--text-secondary)] space-y-1.5 break-words [overflow-wrap:anywhere]">
                      <p>
                        Từ đó, tôi tập trung xây dựng các hệ thống{' '}
                        <strong className="font-bold text-blue-600 dark:text-cyan-400">CRM</strong>,{' '}
                        <strong className="font-bold text-blue-600 dark:text-cyan-400">
                          Dashboard quản trị
                        </strong>
                        ,{' '}
                        <strong className="font-bold text-blue-600 dark:text-cyan-400">
                          AI Chatbot
                        </strong>{' '}
                        và các giải pháp{' '}
                        <strong className="font-bold text-blue-600 dark:text-cyan-400">
                          tự động hóa
                        </strong>
                        , nhằm nâng cao hiệu quả vận hành, tối ưu trải nghiệm khách hàng và hỗ trợ nhà quản lý ra quyết định bằng dữ liệu. Bên cạnh công nghệ, tôi luôn xem{' '}
                        <strong className="font-bold text-rose-600 dark:text-rose-400">
                          con người là yếu tố quyết định thành công
                        </strong>
                        . Vì vậy, tôi chú trọng đào tạo đội ngũ biết lắng nghe, thấu hiểu và mang đến những trải nghiệm vượt mong đợi cho khách hàng. Tôi luôn tâm niệm:
                      </p>
                    </div>
                  </div>

                  {/* Quote box synthesis Bento Sub-card */}
                  <div
                    data-subcard="true"
                    style={{ padding: '10px 12px', borderRadius: 'var(--radius-subcard, 14px)' }}
                    className="sub-card letter-subcard w-full p-[10px] rounded-[var(--radius-subcard,14px)] relative flex items-center gap-2.5 min-w-0"
                  >
                    <span className="text-amber-600 dark:text-amber-400 font-play font-bold text-xl leading-none shrink-0">
                      “
                    </span>
                    <p className="card-body-text typo-body-sm text-amber-900 dark:text-amber-300 font-semibold italic leading-snug break-words [overflow-wrap:anywhere]">
                      &ldquo;Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.&rdquo;
                    </p>
                  </div>

                  <div className="card-body-text typo-body-sm leading-snug text-[var(--text-secondary)] space-y-1 break-words [overflow-wrap:anywhere]">
                    <p>
                      Tôi mong muốn được đồng hành cùng{' '}
                      <strong className="font-bold text-[var(--text-primary)]">{companyDisplay}</strong> trong việc xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững.
                    </p>
                    <p className="font-bold text-cyan-700 dark:text-cyan-300">
                      Xin trân trọng cảm ơn {companyDisplay} đã dành thời gian lắng nghe!
                    </p>
                  </div>

                  {/* Bottom - Signature Block */}
                  <div className="w-full flex flex-wrap items-center justify-between gap-2 relative z-10 text-left border-0">
                    <div className="flex items-center gap-3">
                      <div className="-ml-1 shrink-0">
                        <SignatureSvg />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterView;
