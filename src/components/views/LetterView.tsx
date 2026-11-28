'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Briefcase,
  Target,
  Radio,
  Users,
  Monitor,
  Gamepad2,
  ShoppingCart,
  ShieldCheck,
  Smartphone,
  Wallet,
  Settings,
  TrendingUp,
  Cpu,
  Quote,
  Heart,
  Handshake,
  Star,
  MailOpen,
  FastForward,
} from 'lucide-react';
import { DualLayerVideoPlayer } from '@/components/ui/DualLayerVideoPlayer';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';

export const getThemeLetterContent = (cardStyle: string) => {
  if (cardStyle === 'cowhide-leather') {
    return {
      title: 'Thư Ngỏ Tôn Vinh Giá Trị Cổ Điển & Bền Vững',
      greeting: 'Kính chào Quý Lãnh đạo & Đối tác chiến lược!',
      intro: 'Với bề dày 22+ năm thực chiến kiến tạo và chuẩn hóa hệ thống chăm sóc khách hàng, tôi trân trọng gửi gắm tâm huyết đồng hành cùng sự phát triển bền vững của Quý Công ty.',
      focusArea: 'Quản Trị Vận Hành Cổ Điển & Bền Vững',
      quote: '“Giá trị cốt lõi của dịch vụ đỉnh cao nằm ở sự tận tâm qua từng năm tháng.”',
      partnershipText: 'Sẵn sàng kề vai sát cánh cùng Quý Công ty xây dựng nền móng vận hành vững chắc, nhân văn và trường tồn.',
    };
  }
  if (cardStyle === 'walnut-wood') {
    return {
      title: 'Thư Ngỏ Quản Trị Doanh Nghiệp & Kiến Trúc Trưởng',
      greeting: 'Kính chào Hội Đồng Quản Trị & Ban Tổng Giám Đốc!',
      intro: 'Trong vai trò cố vấn và chuyên gia vận hành hệ thống, tôi mang đến góc nhìn quản trị toàn diện, kết hợp chặt chẽ giữa chiến lược, con người và công nghệ.',
      focusArea: 'Quản Trị Doanh Nghiệp & Kiến Trúc Tổng Thể',
      quote: '“Người giữ được nền tảng vững chắc sẽ tạo nên giá trị trường tồn cho tổ chức.”',
      partnershipText: 'Hân hạnh đồng hành cùng ban lãnh đạo để kiện toàn cấu trúc vận hành, tối ưu hóa nguồn lực và hiện thực hóa mục tiêu chiến lược.',
    };
  }
  if (cardStyle === 'deep-ocean') {
    return {
      title: 'Thư Ngỏ Giải Pháp Chăm Sóc Khách Hàng Toàn Diện',
      greeting: 'Kính chào Quý Công ty & Đội ngũ Vận Hành!',
      intro: 'Hòa mình vào dòng chảy chuyển đổi số, tôi chuyên tâm kiến tạo các trung tâm chăm sóc khách hàng đa kênh với độ sẵn sàng cao và trải nghiệm liền mạch.',
      focusArea: 'Hệ Thống Tổng Đài Đa Kênh & CX Sâu Thẳm',
      quote: '“Dịch vụ xuất sắc là đại dương bao la được nuôi dưỡng từ hàng triệu giọt đồng cảm nhỏ nhất.”',
      partnershipText: 'Cam kết mang đến giải pháp vận hành liền mạch, minh bạch và tối ưu hóa trải nghiệm khách hàng vượt trội.',
    };
  }
  if (cardStyle === 'iridescent-liquid-glass' || cardStyle === 'dark-iridescent-liquid-glass') {
    return {
      title: 'Thư Ngỏ Đổi Mới Sáng Tạo & Trải Nghiệm Đỉnh Cao',
      greeting: 'Kính chào Quý Đối tác Đổi Mới Sáng Tạo!',
      intro: 'Khám phá bức tranh chuyển đổi số đa sắc thái với các giải pháp công nghệ tiên phong, giao diện tương tác đỉnh cao và hiệu suất vận hành bứt phá.',
      focusArea: 'Chuyển Đổi Số & Trải Nghiệm Khách Hàng Tiên Phong',
      quote: '“Tương lai thuộc về những tổ chức dám tiên phong kiến tạo trải nghiệm khác biệt.”',
      partnershipText: 'Sẵn sàng cùng Quý Công ty bứt phá giới hạn, dẫn dắt xu hướng dịch vụ khách hàng trong kỷ nguyên số.',
    };
  }
  if (cardStyle === 'gradient-dopamine') {
    return {
      title: 'Thư Ngỏ Năng Lượng & Tăng Trưởng Đột Phá',
      greeting: 'Kính chào Quý Doanh nghiệp Đầy Nhiệt Huyết!',
      intro: 'Mang đến nguồn năng lượng tích cực, giải pháp tối ưu hóa hiệu suất và chiến lược tăng trưởng đột phá cho hệ thống kinh doanh và chăm sóc khách hàng.',
      focusArea: 'Hiệu Suất Tối Đa & Tăng Trưởng Đột Phá',
      quote: '“Năng lượng tích cực và sự tận tâm là chìa khóa mở mọi cánh cửa thành công.”',
      partnershipText: 'Đồng hành tạo nên những cột mốc tăng trưởng ấn tượng và trải nghiệm khách hàng tràn đầy cảm hứng.',
    };
  }
  return {
    title: 'Thư Ngỏ Hành Trình Chuyên Sâu & Tâm Quyết',
    greeting: 'Kính chào Quý Công ty!',
    intro: 'Trân trọng chào mừng bạn đến với không gian giới thiệu hành trình và năng lực chuyên môn của Nguyễn Hùng Thái trong lĩnh vực quản trị vận hành và chăm sóc khách hàng.',
    focusArea: 'Vận Hành Chăm Sóc Khách Hàng & Chuyển Đổi Số',
    quote: '“Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.”',
    partnershipText: 'Mong muốn được đồng hành cùng Quý Công ty để xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm.',
  };
};

// Video thuyết minh Thư Ngỏ được giữ lại và đưa trực tiếp vào trong thư
export const LETTER_VIDEO_1_ID = '156Uwr88AhLmybquXyrMsXqzxdAs5I6lw';
export const LETTER_VIDEO_2_ID = '12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R';
export const LETTER_SLIDE_1_VIDEO_URL =
  'https://cdn.scena.ai/project/10223/73bc236e3e9c7f6be95f2e882e26e6ff67b5f2a108d180fba8b33518146ff2b7.mp4';
export const LETTER_SLIDE_2_VIDEO_URL =
  'https://cdn.scena.ai/project/8606/87d892c1c37f70cfae99aa55e5888f93ea6b7015050fe44e5d1f54418f0b06b9.mp4';

const WELCOME_SESSION_KEY = 'nht_welcome_letter_seen_v1';

interface BrandLogoItem {
  src: string;
  alt: string;
}

const BrandBadge: React.FC<{
  logos?: BrandLogoItem[];
  name?: string;
  title?: string;
}> = ({ logos = [], name = '', title = '' }) => {
  return (
    <span className="nht-brand-badge" title={title || name}>
      {logos.map((logo, idx) => (
        <img
          key={idx}
          src={logo.src}
          alt={logo.alt || name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="nht-brand-logo-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ))}
      {name && (
        <strong className="font-bold text-[var(--text-primary)]">
          {name}
        </strong>
      )}
    </span>
  );
};

interface WelcomeEnvelopeIntroProps {
  onRevealStart?: () => void;
  onComplete?: () => void;
}

const WelcomeEnvelopeIntro: React.FC<WelcomeEnvelopeIntroProps> = ({
  onRevealStart,
  onComplete,
}) => {
  const { cardStyle } = useTheme();
  const themeLetter = getThemeLetterContent(cardStyle);

  const [isVisible, setIsVisible] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isOpenedRef = useRef(false);
  const isClosedRef = useRef(false);
  const autoOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crossFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideOverlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllIntroTimers = () => {
    if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
    if (crossFadeTimerRef.current) clearTimeout(crossFadeTimerRef.current);
    if (hideOverlayTimerRef.current) clearTimeout(hideOverlayTimerRef.current);
  };

  const handleSkipIntro = () => {
    if (isClosedRef.current) return;
    isClosedRef.current = true;
    clearAllIntroTimers();

    try {
      sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
    } catch {
      // Ignore storage access restrictions
    }

    setIsClosing(true);
    if (onRevealStart) onRevealStart();

    hideOverlayTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 450);
  };

  const handleOpenEnvelope = () => {
    if (isOpenedRef.current || isClosedRef.current) return;
    isOpenedRef.current = true;
    SoundEngine.playTap?.();

    if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
    // Mở nắp bao thư, lá thư trượt lên ngay ngắn (không phóng to) rồi chuyển mượt vào nội dung thư chính
    setIsOpened(true);

    try {
      sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
    } catch {
      // Ignore storage access restrictions
    }

    crossFadeTimerRef.current = setTimeout(() => {
      if (isClosedRef.current) return;
      isClosedRef.current = true;
      if (onRevealStart) onRevealStart();
      setIsClosing(true);
    }, 1500);

    hideOverlayTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2150);
  };

  useEffect(() => {
    // Replay envelope welcome intro every time LetterView mounts
    setIsVisible(true);

    autoOpenTimerRef.current = setTimeout(() => {
      handleOpenEnvelope();
    }, 1200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isClosedRef.current) {
        handleSkipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearAllIntroTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="welcomeEnvelopeOverlay"
      className={`nht-welcome-overlay ${isClosing ? 'is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcomeLetterHeading"
    >
      <button
        id="skipIntroBtn"
        type="button"
        onClick={handleSkipIntro}
        className="no-theme-btn absolute top-3 right-3 sm:top-4 sm:right-4 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md transition-all duration-200 cursor-pointer hover:opacity-90"
        style={{
          background: 'var(--bg-card, var(--surface-secondary-bg))',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subcard, var(--border-color))',
        }}
      >
        <span>Bỏ qua</span>
        <FastForward className="w-3 h-3" />
      </button>

      <div
        id="envelopeStage"
        className={`nht-envelope-stage ${isOpened ? 'is-opened' : ''}`}
      >
        <div
          className="nht-envelope-3d-wrapper cursor-pointer"
          onClick={handleOpenEnvelope}
        >
          <div className="nht-envelope-back">
            <div className="nht-envelope-lining" />
          </div>

          <div
            id="welcomeLetterSheet"
            className="nht-welcome-letter-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-1.5 w-full rounded-full mb-3.5 opacity-90"
              style={{
                background:
                  'repeating-linear-gradient(-45deg, var(--color-primary, #4f46e5), var(--color-primary, #4f46e5) 10px, transparent 10px, transparent 16px, var(--color-accent, #f59e0b) 16px, var(--color-accent, #f59e0b) 26px, transparent 26px, transparent 32px)',
              }}
            />

            <div className="flex items-center justify-between gap-3 mb-2.5 nht-letter-stagger nht-letter-stagger-1">
              <div>
                <p
                  className="text-[11px] font-bold tracking-wide mb-0.5"
                  style={{ color: 'var(--color-accent, var(--color-primary, #d97706))' }}
                >
                  Lời chào trân trọng
                </p>
                <h2
                  id="welcomeLetterHeading"
                  className="text-xl sm:text-2xl font-bold tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {themeLetter.title}
                </h2>
              </div>

            </div>

            <div
              className="space-y-2.5 text-[12.5px] sm:text-[13.5px] leading-[1.62]"
              style={{ color: 'var(--text-secondary, var(--text-primary))' }}
            >
              <p className="nht-letter-stagger nht-letter-stagger-2">
                {themeLetter.intro}
              </p>
              <p className="nht-letter-stagger nht-letter-stagger-3">
                Lĩnh vực chuyên môn trọng tâm:{' '}
                <strong
                  className="font-bold"
                  style={{ color: 'var(--text-link, var(--color-primary))' }}
                >
                  {themeLetter.focusArea}
                </strong>
                .
              </p>
              <p
                className="italic font-semibold pl-3 py-0.5 nht-letter-stagger nht-letter-stagger-4"
                style={{
                  color: 'var(--text-primary)',
                  borderLeft: '2px solid var(--color-accent, var(--color-primary, #f59e0b))',
                }}
              >
                {themeLetter.quote}
              </p>
            </div>

            <div
              className="mt-4 pt-3 border-t border-dashed flex flex-col sm:flex-row sm:items-end justify-between gap-3 nht-letter-stagger nht-letter-stagger-5"
              style={{ borderColor: 'var(--border-subcard, var(--border-color))' }}
            >
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted, var(--text-secondary))' }}>
                  Trân trọng,
                </p>
                <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  Nguyễn Hùng Thái
                </p>
              </div>
            </div>
          </div>

          {/* Envelope Front Pocket & Bottom Flap SVG (Crisp proportional geometry, zero protruding corners) */}
          <div className="nht-envelope-front-pocket" aria-hidden="true">
            <svg
              viewBox="0 0 440 275"
              preserveAspectRatio="none"
              className="w-full h-full block"
              data-thin-stroke="true"
            >
              <defs>
                <linearGradient id="nhtEnvLeftFlap" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4338ca" />
                  <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
                <linearGradient id="nhtEnvRightFlap" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
                <linearGradient id="nhtEnvBottomFlap" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="55%" stopColor="#3730a3" />
                  <stop offset="100%" stopColor="#2e1065" />
                </linearGradient>
              </defs>
              {/* Left & Right Side Flaps */}
              <polygon points="0,0 226,142 0,275" fill="url(#nhtEnvLeftFlap)" />
              <polygon points="440,0 214,142 440,275" fill="url(#nhtEnvRightFlap)" />
              {/* Bottom Triangle Flap with softly rounded peak */}
              <path
                d="M 0,275 L 204,138 Q 220,127 236,138 L 440,275 Z"
                fill="url(#nhtEnvBottomFlap)"
              />
              {/* Crisp Gold Seam Accent Lines */}
              <path
                d="M 0,275 L 204,138 Q 220,127 236,138 L 440,275"
                fill="none"
                stroke="rgba(253, 224, 71, 0.35)"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          <div className="nht-envelope-gold-trim" aria-hidden="true" />

          {/* Top Flap 3D Hinge SVG (Smooth rounded upper corners + tapered apex) */}
          <div className="nht-envelope-top-flap" aria-hidden="true">
            <svg
              viewBox="0 0 440 165"
              preserveAspectRatio="none"
              className="w-full h-full block"
              data-thin-stroke="true"
            >
              <defs>
                <linearGradient id="nhtEnvTopFlap" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3730a3" />
                </linearGradient>
              </defs>
              <path
                d="M 18,0 L 422,0 Q 440,0 434,14 L 234,151 Q 220,161 206,151 L 6,14 Q 0,0 18,0 Z"
                fill="url(#nhtEnvTopFlap)"
              />
              <path
                d="M 8,14 L 206,151 Q 220,161 234,151 L 432,14"
                fill="none"
                stroke="rgba(253, 224, 71, 0.45)"
                strokeWidth="1.25"
              />
            </svg>
          </div>


        </div>

        <div className="nht-envelope-cta-area">
          <p
            className="font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <MailOpen
              className="w-4 h-4 shrink-0"
              style={{ color: 'var(--color-accent, var(--color-primary, #d97706))' }}
            />
            <span>Bạn có một lá thư mới</span>
          </p>
          <button
            id="openEnvelopeBtn"
            type="button"
            onClick={handleOpenEnvelope}
            className="no-theme-btn hidden"
            aria-hidden="true"
          >
            <span>Mở thư</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export interface LetterViewProps {
  currentTheme?: string;
  onOpenBannerStudio?: (pageId: number) => void;
  onShowNotification: (msg: string) => void;
  onOpenMilestoneModal?: (item: any) => void;
}

export const LetterView: React.FC<LetterViewProps> = () => {
  const { cardStyle } = useTheme();
  const themeLetter = getThemeLetterContent(cardStyle);

  const [introState, setIntroState] = useState<'active' | 'revealed'>(() => {
    try {
      return sessionStorage.getItem(WELCOME_SESSION_KEY) === 'true'
        ? 'revealed'
        : 'active';
    } catch {
      return 'active';
    }
  });

  const [signatureError, setSignatureError] = useState(false);
  const [heroCardHeight, setHeroCardHeight] = useState<number | null>(null);
  const letterScrollViewportRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncVideoHeightToHero = () => {
      const heroEl = profileCardRef.current;
      if (!heroEl || typeof window === 'undefined') return;
      if (window.innerWidth < 1024) {
        setHeroCardHeight(null);
        return;
      }
      const measured = Math.round(heroEl.getBoundingClientRect().height);
      if (measured > 100) {
        setHeroCardHeight((prev) => (prev === measured ? prev : measured));
      }
    };

    syncVideoHeightToHero();
    const rafId = requestAnimationFrame(syncVideoHeightToHero);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && profileCardRef.current) {
      observer = new ResizeObserver(() => {
        syncVideoHeightToHero();
      });
      observer.observe(profileCardRef.current);
    }
    window.addEventListener('resize', syncVideoHeightToHero);

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('resize', syncVideoHeightToHero);
    };
  }, [introState]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('app:slide-changed', { detail: { tabIndex: 1, slide: 0 } })
    );

    const handleExternalSlide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && (detail.tabIndex === undefined || detail.tabIndex === 1)) {
        letterScrollViewportRef.current?.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    };
    window.addEventListener('app:set-slide', handleExternalSlide);
    return () => window.removeEventListener('app:set-slide', handleExternalSlide);
  }, []);

  return (
    <div
      id="letter-page-shell"
      className="relative w-full max-w-full min-w-0 h-full flex-1 flex flex-col items-center justify-start min-h-0 overflow-hidden bg-transparent"
    >
      <style>{`
        #letter-main-scroll-viewport {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
          min-height: 0 !important;
          max-height: 100% !important;
          flex: 1 1 0% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          overscroll-behavior-y: contain !important;
          touch-action: pan-y !important;
          -webkit-overflow-scrolling: touch !important;
          border-radius: var(--radius-card, 14px) !important;
          background: var(--surface-secondary-bg, var(--bg-card, rgba(255, 255, 255, 0.72)));
          border: var(--card-border-width, 1px) solid var(--surface-secondary-border, var(--border-subcard, rgba(148, 163, 184, 0.24)));
          box-shadow: var(--layer-l2-shadow, var(--shadow-card, none));
        }

        /* Theme-Synchronized Open Letter Sheet inside Card nội dung thư ngỏ */
        .nht-letter-sheet {
          display: block;
          width: 100%;
          height: auto !important;
          min-height: max-content;
          flex: 0 0 auto;
          background: transparent;
          border-radius: var(--radius-card, 14px);
          border: none;
          position: relative;
          overflow: hidden;
          color: var(--text-primary, inherit);
        }

        .nht-letter-top-border {
          height: 7px;
          width: 100%;
          background: repeating-linear-gradient(
            -45deg,
            #4f46e5,
            #4f46e5 14px,
            #ffffff 14px,
            #ffffff 22px,
            #f59e0b 22px,
            #f59e0b 36px,
            #ffffff 36px,
            #ffffff 44px
          );
          opacity: 0.9;
        }

        .nht-envelope-flap-line {
          position: absolute;
          top: 7px;
          left: 0;
          right: 0;
          height: 54px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.55;
        }

        #letter-main-card .nht-wax-seal,
        .nht-welcome-overlay .nht-wax-seal,
        .nht-wax-seal {
          width: 52px !important;
          min-width: 52px !important;
          max-width: 52px !important;
          height: 52px !important;
          min-height: 52px !important;
          max-height: 52px !important;
          aspect-ratio: 1 / 1 !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 9999px !important;
          background: radial-gradient(
            circle at 30% 30%,
            #fde68a,
            #d97706 65%,
            #92400e 100%
          ) !important;
          box-shadow:
            0 6px 14px rgba(180, 83, 9, 0.35),
            inset 0 2px 4px rgba(255, 255, 255, 0.65),
            inset 0 -3px 6px rgba(120, 53, 15, 0.55) !important;
          border: 2px dashed rgba(255, 251, 235, 0.78) !important;
          display: inline-flex;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 0 auto !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          color: #fffbeb !important;
          font-weight: 700;
          line-height: 1 !important;
          letter-spacing: 0.5px;
          white-space: nowrap !important;
          transform: rotate(8deg);
        }

        #letter-main-card .nht-wax-seal.nht-wax-seal--sm,
        .nht-welcome-overlay .nht-wax-seal.nht-wax-seal--sm,
        .nht-wax-seal.nht-wax-seal--sm {
          width: 42px !important;
          min-width: 42px !important;
          max-width: 42px !important;
          height: 42px !important;
          min-height: 42px !important;
          max-height: 42px !important;
        }

        #letter-main-card .nht-wax-seal.nht-wax-seal--lg,
        .nht-welcome-overlay .nht-wax-seal.nht-wax-seal--lg,
        #waxSealTrigger.nht-wax-seal.nht-wax-seal--lg {
          width: 56px !important;
          min-width: 56px !important;
          max-width: 56px !important;
          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;
        }

        .nht-bento-item {
          display: block;
          border-radius: var(--radius-subcard, 16px);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .nht-bento-item:hover {
          transform: translateY(-2px);
        }

        .nht-gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        /* Timeline inside Letter */
        .nht-timeline-container {
          position: relative;
          padding-left: 34px;
        }

        .nht-timeline-line {
          position: absolute;
          left: 11px;
          top: 14px;
          bottom: 14px;
          width: 2.5px;
          background: linear-gradient(
            180deg,
            #3b82f6 0%,
            #8b5cf6 45%,
            #ec4899 75%,
            #f59e0b 100%
          );
          opacity: 0.85;
          border-radius: 99px;
          z-index: 1;
        }

        .nht-timeline-item {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          padding: 8px 11px;
          border-radius: 0.85rem;
          background-color: rgba(248, 250, 252, 0.96);
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        html.dark .nht-timeline-item {
          background-color: rgba(30, 41, 59, 0.72);
          border-color: rgba(148, 163, 184, 0.2);
          box-shadow: 0 4px 12px rgba(2, 6, 23, 0.25);
        }

        .nht-timeline-item:hover {
          background-color: #ffffff;
          border-color: #c4b5fd;
          box-shadow: 0 6px 14px rgba(99, 102, 241, 0.08);
          transform: translateX(3px);
        }

        html.dark .nht-timeline-item:hover {
          background-color: rgba(30, 41, 59, 0.95);
          border-color: rgba(167, 139, 250, 0.5);
        }

        .nht-timeline-icon-box {
          position: absolute;
          left: -34px;
          top: 9px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          z-index: 3;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        html.dark .nht-timeline-icon-box {
          background-color: #0f172a;
          border-color: rgba(148, 163, 184, 0.35);
        }

        .nht-timeline-item:hover .nht-timeline-icon-box {
          transform: scale(1.1);
          border-color: #a78bfa;
        }

        .nht-brand-badge {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 1px 7px 1px 5px;
          margin: 0 2px;
          background: transparent !important;
          color: var(--text-primary, #0f172a);
          border: 1px solid var(--border-subcard, rgba(148, 163, 184, 0.32));
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.07);
          vertical-align: middle;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .nht-brand-badge::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: var(--surface-primary-bg, var(--bg-card, var(--bg-main, #ffffff)));
          opacity: 0.3;
        }

        html.dark .nht-brand-badge {
          color: var(--text-primary, #f8fafc);
          border-color: var(--border-subcard, rgba(148, 163, 184, 0.28));
        }

        .nht-timeline-item:hover .nht-brand-badge {
          transform: translateY(-1px);
          border-color: var(--accent-primary, #cbd5e1);
        }

        .nht-brand-logo-img {
          height: 14px;
          width: auto;
          max-width: 46px;
          object-fit: contain;
          display: inline-block;
        }

        /* Welcome Envelope Intro Scoped Inside #letter-main-card — Đồng bộ nền của giao diện đang chọn */
        .nht-welcome-overlay {
          position: absolute;
          inset: 0;
          z-index: 40;
          background: var(--surface-secondary-bg, var(--bg-card, var(--app-bg-gradient, transparent)));
          backdrop-filter: blur(var(--glass-main-blur, 18px)) saturate(140%);
          -webkit-backdrop-filter: blur(var(--glass-main-blur, 18px)) saturate(140%);
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-radius: inherit;
          transition:
            opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0.75s ease;
          overflow: hidden;
        }

        .nht-welcome-overlay.is-closing {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .nht-envelope-stage {
          perspective: 1400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 500px;
          max-height: 100%;
          opacity: 0;
          transform: scale(0.9) translateY(14px);
          animation: nhtEnvelopeEntrance 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transition:
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.7s ease;
        }

        .nht-welcome-overlay.is-closing .nht-envelope-stage {
          opacity: 0;
        }

        @keyframes nhtEnvelopeEntrance {
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .nht-envelope-3d-wrapper {
          position: relative;
          width: min(420px, 88%, 78vw);
          aspect-ratio: 16 / 10;
          height: auto;
          flex-shrink: 0;
          transform-style: preserve-3d;
          transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease;
        }

        .nht-envelope-stage.is-opened .nht-envelope-3d-wrapper {
          transform: translateY(14px) scale(0.98);
        }

        .nht-envelope-back {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: linear-gradient(145deg, #312e81 0%, #1e1b4b 100%);
          box-shadow:
            0 25px 50px -12px rgba(30, 27, 75, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.25) inset;
          z-index: 1;
          transform: translateZ(0px);
        }

        .nht-envelope-lining {
          position: absolute;
          inset: 6px;
          border-radius: 14px;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.04) 8px,
            rgba(251, 191, 36, 0.06) 8px,
            rgba(251, 191, 36, 0.06) 16px
          );
          z-index: 2;
        }

        /* Lá thư: Đồng bộ nền thẻ & viền theo giao diện đang chọn */
        .nht-welcome-letter-sheet {
          position: absolute;
          left: 50%;
          top: 50%;
          bottom: auto;
          width: min(410px, 94%);
          max-height: min(56vh, 330px);
          overflow-y: auto;
          transform: translate(-50%, -44%) translateZ(2px) scale(0.84);
          transform-origin: center center;
          opacity: 0;
          background: var(--surface-primary-bg, var(--bg-card, #ffffff));
          color: var(--text-primary);
          border-radius: var(--radius-card, 16px);
          border: var(--card-border-width, 1.5px) solid var(--surface-secondary-border, var(--border-subcard, rgba(148, 163, 184, 0.35)));
          box-shadow: var(--shadow-card-hover, 0 22px 48px -10px rgba(15, 23, 42, 0.3));
          backdrop-filter: blur(var(--glass-card-blur, 18px)) saturate(140%);
          -webkit-backdrop-filter: blur(var(--glass-card-blur, 18px)) saturate(140%);
          padding: 1.15rem 1.35rem;
          z-index: 4;
          pointer-events: none;
          will-change: transform, opacity;
          transition:
            transform 0.88s cubic-bezier(0.22, 1, 0.36, 1) 0.34s,
            opacity 0.55s ease 0.32s,
            box-shadow 0.8s ease;
        }

        /* Khi bao thư mở, lá thư hiện ra ngay ngắn trên mặt bao thư (không phóng to) */
        .nht-envelope-stage.is-opened .nht-welcome-letter-sheet {
          transform: translate(-50%, -50%) translateZ(28px) scale(1);
          opacity: 1;
          z-index: 26;
          pointer-events: auto;
        }

        .nht-welcome-overlay.is-closing .nht-welcome-letter-sheet {
          opacity: 0;
        }

        .nht-letter-stagger {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }

        .nht-envelope-stage.is-opened .nht-letter-stagger {
          opacity: 1;
          transform: translateY(0);
        }

        .nht-envelope-stage.is-opened .nht-letter-stagger-1 { transition-delay: 0.55s; }
        .nht-envelope-stage.is-opened .nht-letter-stagger-2 { transition-delay: 0.68s; }
        .nht-envelope-stage.is-opened .nht-letter-stagger-3 { transition-delay: 0.8s; }
        .nht-envelope-stage.is-opened .nht-letter-stagger-4 { transition-delay: 0.92s; }
        .nht-envelope-stage.is-opened .nht-letter-stagger-5 { transition-delay: 1.04s; }

        .nht-envelope-front-pocket {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          overflow: hidden;
          z-index: 5;
          transform: translateZ(6px);
          pointer-events: none;
          filter: drop-shadow(0 -3px 6px rgba(15, 23, 42, 0.16));
        }

        .nht-envelope-gold-trim {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          border: 1.5px solid rgba(253, 224, 71, 0.45);
          z-index: 7;
          transform: translateZ(8px);
          pointer-events: none;
        }

        .nht-envelope-top-flap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60%;
          transform-origin: top center;
          transform: translateZ(10px) rotateX(0deg);
          z-index: 8;
          pointer-events: none;
          filter: drop-shadow(0 6px 12px rgba(15, 23, 42, 0.28));
          transition:
            transform 0.78s cubic-bezier(0.34, 1.35, 0.64, 1),
            z-index 0s linear 0.28s;
        }

        .nht-envelope-stage.is-opened .nht-envelope-top-flap {
          transform: translateZ(2px) rotateX(176deg);
          z-index: 2;
        }

        #letter-main-card .nht-envelope-center-seal,
        .nht-envelope-center-seal {
          position: absolute !important;
          top: 52% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(6deg) !important;
          z-index: 9 !important;
          cursor: pointer;
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.45s ease !important;
        }

        #letter-main-card .nht-envelope-center-seal:hover,
        .nht-envelope-center-seal:hover {
          transform: translate(-50%, -50%) scale(1.08) rotate(0deg) !important;
        }

        #letter-main-card .nht-envelope-stage.is-opened .nht-envelope-center-seal,
        .nht-envelope-stage.is-opened .nht-envelope-center-seal {
          transform: translate(-50%, -50%) scale(0.4) rotate(45deg) !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .nht-envelope-cta-area {
          margin-top: 1.15rem;
          text-align: center;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .nht-envelope-stage.is-opened .nht-envelope-cta-area {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
        }

        .nht-letter-sheet-reveal {
          transition: opacity 0.55s ease;
        }

        .nht-letter-sheet-reveal.intro-active {
          opacity: 0;
          transform: none;
          filter: none;
        }

        .nht-letter-sheet-reveal.intro-revealed {
          opacity: 1;
          transform: none;
          filter: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .nht-welcome-overlay,
          .nht-envelope-stage,
          .nht-envelope-3d-wrapper,
          .nht-envelope-top-flap,
          .nht-welcome-letter-sheet,
          .nht-letter-stagger,
          .nht-letter-sheet-reveal {
            transition-duration: 0.1s !important;
            animation-duration: 0.1s !important;
          }
        }
      `}</style>

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
          {/* THẺ CHÍNH DUY NHẤT TRANG THƯ NGỎ (#letter-main-card) */}
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
              borderRadius:
                'var(--radius-global, var(--radius-primary-surface, var(--radius-main, 14px)))',
            }}
            className="group/letter page-main-card floating-glass-surface floating-surface--main relative z-10 w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col justify-start p-[14px] sm:p-[15px] overflow-hidden font-play text-left box-border opacity-100 transition-colors duration-200"
          >
            {/* Hiệu ứng mở phong bì thư 3D trong khung Thư ngỏ */}
            <WelcomeEnvelopeIntro
              onRevealStart={() => setIntroState('revealed')}
              onComplete={() => setIntroState('revealed')}
            />

            <div
              ref={letterScrollViewportRef}
              id="letter-main-scroll-viewport"
              data-element-name="Card nội dung thư ngỏ"
              data-element-type="card"
              data-section-card="true"
              data-element-page="letter"
              data-element-parent="letter-main-card"
              data-no-wheel-horizontal="true"
              className="main-card-scroll-viewport bento-card glass-card block w-full max-w-full min-w-0 h-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y glass-scrollbar box-border rounded-[var(--radius-card,14px)]"
            >
              {/* LÁ THƯ CHÍNH (NỘI DUNG THEO CODE ĐÍNH KÈM + CARD VIDEO ĐƯA VÀO TRONG THƯ) */}
              <div
                id="pageContainer"
                className={`nht-letter-sheet nht-letter-sheet-reveal w-full mx-auto shrink-0 ${
                  introState === 'active' ? 'intro-active' : 'intro-revealed'
                }`}
              >
                {/* Decorative Top Letter Border Strip */}
                <div className="nht-letter-top-border" />

                {/* Subtle Envelope Flap SVG Crease */}
                <svg
                  className="nht-envelope-flap-line w-full"
                  viewBox="0 0 1200 60"
                  preserveAspectRatio="none"
                  data-thin-stroke="true"
                  aria-hidden="true"
                >
                  <path
                    d="M0,0 L600,56 L1200,0"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-300 dark:text-slate-700"
                    strokeWidth="1.2"
                    strokeDasharray="6 4"
                  />
                </svg>

                {/* Letter Inner Content Padding */}
                <div className="p-3.5 sm:p-5 lg:p-6 relative z-10">
                  <div
                    id="contentGrid"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 text-[12px] leading-[1.55]"
                  >
                    {/* LEFT COLUMN (6 cols): Thư chào + Dòng thời gian sự nghiệp */}
                    <div
                      id="leftCol"
                      className="lg:col-span-6 lg:border-r lg:border-dashed lg:border-slate-300 dark:lg:border-slate-700 lg:pr-5 flex flex-col justify-between gap-3"
                    >
                      {/* TOP BENTO HERO CARD: Vibrant Purple-Indigo Letterhead (Mẫu Thẻ 1: Bento Studio Hero Card) */}
                      <div
                        id="letter-profile-capability-card"
                        ref={profileCardRef}
                        className="nht-bento-item bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 p-4 sm:p-5 relative overflow-hidden shadow-xl text-white rounded-[var(--radius-subcard,16px)] border border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                      >
                        {/* Bento Studio glowing ambient orb */}
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                          {/* Header Row */}
                          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/20">
                            <div className="inline-flex items-center gap-2 text-white text-[13px] font-bold">
                              <Award className="w-4 h-4 text-amber-300 shrink-0" />
                              <span className="nht-gradient-text bg-gradient-to-r from-yellow-200 via-amber-100 to-pink-200 font-extrabold tracking-wide">
                                Hồ sơ năng lực cá nhân
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 shadow-xs backdrop-blur-xs">
                                <Briefcase className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                                <span className="text-purple-100">Kinh nghiệm:</span>
                                <strong className="text-white">22+ Năm</strong>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 shadow-xs backdrop-blur-xs">
                                <Target className="w-3.5 h-3.5 text-pink-200 shrink-0" />
                                <strong className="text-white">
                                  Khách Hàng Làm Trung Tâm
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Salutation & Intro */}
                          <div>
                            <p className="font-bold text-yellow-300 text-[15px] sm:text-base mb-1.5 drop-shadow-xs">
                              {themeLetter.greeting}
                            </p>
                            <p className="text-purple-100 text-[12.5px] sm:text-[13px] leading-[1.6]">
                              Tôi là{' '}
                              <strong className="font-bold text-white">
                                Nguyễn Hùng Thái
                              </strong>
                              , {themeLetter.intro}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TIMELINE SECTION (8 Cột mốc doanh nghiệp) */}
                      <div className="nht-timeline-container flex-grow flex flex-col justify-between">
                        <div className="nht-timeline-line" />

                        {/* 2002 */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-blue-600 dark:text-blue-400"
                            title="2002 - MobiFone"
                          >
                            <Radio className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Tôi bắt đầu sự nghiệp từ năm{' '}
                            <strong className="font-bold text-blue-700 dark:text-blue-400">
                              2002
                            </strong>{' '}
                            tại{' '}
                             <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/J0f8691x/Mobifone.webp',
                                  alt: 'MobiFone',
                                },
                              ]}
                              name="MobiFone"
                            />
                            , nơi tôi được đào tạo nền tảng về dịch vụ khách hàng, quản lý tổng đài, xử lý sự cố và xây dựng quy trình phục vụ theo tiêu chuẩn viễn thông.
                          </p>
                        </div>

                        {/* 2007 */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-indigo-600 dark:text-indigo-400"
                            title="Viễn Liên V247"
                          >
                            <Users className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Tiếp đó, tại{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/zvsNt9J6/V247.webp',
                                  alt: 'Viễn Liên V247',
                                },
                              ]}
                              name="Viễn Liên V247"
                            />{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/0jTvWL8Z/Power-Service.webp',
                                  alt: 'Power Service',
                                },
                              ]}
                              title="Power Service"
                            />
                            , tôi phát triển năng lực quản lý đội ngũ, giám sát chất lượng dịch vụ và tối ưu hiệu quả vận hành của trung tâm chăm sóc khách hàng.
                          </p>
                        </div>

                        {/* 2011 */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-purple-600 dark:text-purple-400"
                            title="LBC - Truyền hình Cáp HTV"
                          >
                            <Monitor className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Một cột mốc quan trọng trong sự nghiệp của tôi là khi gia nhập{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/hvknyHSr/LBC.webp',
                                  alt: 'LBC',
                                },
                                {
                                  src: 'https://i.postimg.cc/C5BY4FVP/HTVC.webp',
                                  alt: 'HTVC',
                                },
                              ]}
                              name="LBC – Truyền hình Cáp HTV"
                            />
                            , nơi tôi lần đầu tiên đảm nhiệm vị trí{' '}
                            <strong className="font-bold text-purple-700 dark:text-purple-300">
                              Trưởng phòng Chăm sóc Khách hàng
                            </strong>
                            . Đây là giai đoạn giúp tôi chuyển mình từ một nhà quản lý vận hành sang một nhà quản trị toàn diện. Tôi học cách điều hành hoạt động của cả phòng ban, xây dựng và chuẩn hóa quy trình, phát triển đội ngũ, thiết lập các chỉ số quản trị (KPI) và phối hợp hiệu quả với nhiều phòng ban nhằm nâng cao chất lượng dịch vụ.
                          </p>
                        </div>

                        {/* 2013 */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-pink-600 dark:text-pink-400"
                            title="Garena"
                          >
                            <Gamepad2 className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Khi làm việc tại{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/gjXdKYPT/Garena.webp',
                                  alt: 'Garena',
                                },
                              ]}
                              name="Garena"
                            />{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/3N47ZKHf/GCafe.webp',
                                  alt: 'GCafe',
                                },
                              ]}
                              title="GCafe"
                            />
                            , tôi quản lý hoạt động chăm sóc khách hàng trong lĩnh vực game, nơi đòi hỏi tốc độ xử lý nhanh, chính xác và khả năng đáp ứng khối lượng khách hàng rất lớn.
                          </p>
                        </div>

                        {/* VED / Shopee / AirPay */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-orange-500 dark:text-orange-400"
                            title="VED, Shopee & AirPay"
                          >
                            <ShoppingCart className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Trong giai đoạn phát triển{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/cCpW9Vsz/VED.webp',
                                  alt: 'VED',
                                },
                              ]}
                              name="VED"
                            />
                            ,{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/zvsNt9Jt/Shopee.webp',
                                  alt: 'Shopee',
                                },
                              ]}
                              name="Shopee"
                            />{' '}
                            và{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/kG0C1knp/Shopee-Paye.webp',
                                  alt: 'AirPay / ShopeePay',
                                },
                              ]}
                              name="AirPay"
                            />
                            , tôi tham gia xây dựng trải nghiệm khách hàng trong lĩnh vực thương mại điện tử và thanh toán số, với định hướng lấy khách hàng làm trung tâm.
                          </p>
                        </div>

                        {/* 2016 */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-rose-600 dark:text-rose-400"
                            title="Prudential"
                          >
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Làm việc tại{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/D09hjt2Y/Prudential.webp',
                                  alt: 'Prudential',
                                },
                              ]}
                              name="Prudential"
                            />
                            , tôi hiểu sâu sắc về trải nghiệm khách hàng ngành Bảo hiểm, đòi hỏi sự chuẩn xác, minh bạch và củng cố niềm tin tuyệt đối.
                          </p>
                        </div>

                        {/* 2018 */}
                        <div className="nht-timeline-item">
                          <div
                            className="nht-timeline-icon-box text-fuchsia-600 dark:text-fuchsia-400"
                            title="MoMo"
                          >
                            <Smartphone className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Tại{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/90628vWg/Momo.webp',
                                  alt: 'MoMo',
                                },
                              ]}
                              name="MoMo"
                            />
                            , tôi tiếp tục mở rộng kinh nghiệm trong lĩnh vực dịch vụ tài chính số, tối ưu quy trình hỗ trợ khách hàng và nâng cao hiệu quả vận hành trên nền tảng công nghệ.
                          </p>
                        </div>

                        {/* 2023 */}
                        <div className="nht-timeline-item mb-0">
                          <div
                            className="nht-timeline-icon-box text-emerald-600 dark:text-emerald-400"
                            title="Ví ECO - Finviet"
                          >
                            <Wallet className="w-3 h-3" />
                          </div>
                          <p className="text-[12px] leading-[1.52] text-slate-700 dark:text-slate-200">
                            Và{' '}
                            <BrandBadge
                              logos={[
                                {
                                  src: 'https://i.postimg.cc/3N47ZKHb/Finviet.webp',
                                  alt: 'Finviet - Ví ECO',
                                },
                              ]}
                              name="Ví ECO"
                            />{' '}
                            giúp tôi hiểu sâu hơn về trải nghiệm khách hàng trong lĩnh vực tài chính, nơi sự chính xác, minh bạch và niềm tin luôn được đặt lên hàng đầu.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN (6 cols): Card Video Thư Ngỏ + Triết lý + Nguyên tắc + Chữ ký */}
                    <div
                      id="rightCol"
                      className="lg:col-span-6 flex flex-col justify-between gap-2.5"
                    >
                      {/* 0. CARD VIDEO THƯ NGỎ ĐƯỢC ĐƯA TRỰC TIẾP VÀO TRONG THƯ */}
                      <article
                        id="bento-letter-video"
                        data-element-name="Video card Thư ngỏ"
                        data-element-type="card"
                        data-media-card="video"
                        data-section-card="true"
                        data-element-page="letter"
                        data-element-parent="letter-main-card"
                        style={{
                          padding: '0px',
                          borderRadius: 'var(--radius-subcard, 16px)',
                          ...(heroCardHeight
                            ? {
                                height: `${heroCardHeight}px`,
                                minHeight: `${heroCardHeight}px`,
                                maxHeight: `${heroCardHeight}px`,
                                aspectRatio: 'auto',
                                flex: '0 0 auto',
                              }
                            : {}),
                        }}
                        className={`nht-bento-item relative w-full ${
                          heroCardHeight
                            ? ''
                            : 'aspect-video min-h-[195px] sm:min-h-[220px]'
                        } rounded-[var(--radius-subcard,16px)] overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-700/70 bg-slate-900`}
                      >
                        <DualLayerVideoPlayer
                          video1Id={LETTER_VIDEO_1_ID}
                          video1Src={LETTER_SLIDE_1_VIDEO_URL}
                          video2Id={LETTER_VIDEO_2_ID}
                          video2Src={LETTER_SLIDE_2_VIDEO_URL}
                          autoPlayVideo1={true}
                          muteVideo1={true}
                          loopVideo1={true}
                          hideSpeaker={true}
                          className="absolute inset-0 z-0 pointer-events-auto"
                        />
                      </article>

                      {/* 1. Philosophy Highlight Bento Card (Mẫu Thẻ 52: Triết Lý Tối Giản) */}
                      <div className="nht-bento-item bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-4 relative overflow-hidden shadow-lg text-white rounded-[var(--radius-subcard,16px)] border border-white/15 transition-all duration-300 hover:-translate-y-0.5">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <p className="relative z-10 text-[12.5px] leading-[1.6] text-blue-50 text-left font-medium">
                          Qua mỗi môi trường làm việc, tôi nhận ra rằng{' '}
                          <strong className="font-bold text-white drop-shadow-xs">
                            chăm sóc khách hàng không chỉ là giải quyết vấn đề, mà còn là xây dựng một hệ thống giúp doanh nghiệp phát triển bền vững.
                          </strong>
                        </p>
                      </div>

                      {/* 2. 3 Core Principles Bento Card (Mẫu Thẻ 21 & 25: Pipeline Action Grid) */}
                      <div className="nht-bento-item bg-[var(--surface-tertiary-bg,var(--bg-subcard))] p-4 border border-[var(--border-subcard,rgba(148,163,184,0.3))] rounded-[var(--radius-subcard,16px)] shadow-md transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--border-subcard,rgba(148,163,184,0.2))]">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-indigo-500 shrink-0" />
                            <p className="text-[12.5px] font-bold text-[var(--text-primary)]">
                              Tôi luôn làm việc với ba nguyên tắc cốt lõi:
                            </p>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[var(--text-muted)]">
                            Core Pillars
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                          {/* Pillar 1 */}
                          <div className="relative overflow-hidden py-3.5 px-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center group shadow-md transition-all duration-300 hover:scale-[1.03]">
                            <Settings className="w-14 h-14 text-white/10 absolute -right-2 -bottom-2 transform group-hover:rotate-45 transition-transform duration-500 pointer-events-none" />
                            <span className="relative z-10 font-bold text-white text-[13.5px] tracking-wide">
                              Quy trình
                            </span>
                            <span className="relative z-10 text-blue-100 text-[11px] font-medium mt-0.5">
                              tạo nền tảng.
                            </span>
                          </div>

                          {/* Pillar 2 */}
                          <div className="relative overflow-hidden py-3.5 px-2.5 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 flex flex-col items-center justify-center group shadow-md transition-all duration-300 hover:scale-[1.03]">
                            <Users className="w-14 h-14 text-slate-950/15 absolute -right-2 -bottom-2 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                            <span className="relative z-10 font-black text-slate-950 text-[13.5px] tracking-wide">
                              Con người
                            </span>
                            <span className="relative z-10 text-slate-950/90 font-bold text-[11px] mt-0.5">
                              tạo giá trị.
                            </span>
                          </div>

                          {/* Pillar 3 */}
                          <div className="relative overflow-hidden py-3.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex flex-col items-center justify-center group shadow-md transition-all duration-300 hover:scale-[1.03]">
                            <TrendingUp className="w-14 h-14 text-white/10 absolute -right-2 -bottom-2 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                            <span className="relative z-10 font-bold text-white text-[13.5px] tracking-wide">
                              Công nghệ
                            </span>
                            <span className="relative z-10 text-emerald-50 text-[11px] font-medium mt-0.5">
                              tạo đòn bẩy.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Tech Focus Bento Card */}
                      <div className="nht-bento-item bg-gradient-to-r from-emerald-600 to-teal-700 p-3.5 shadow-md flex items-center gap-3 text-white rounded-[var(--radius-subcard,16px)] border border-emerald-400/20">
                        <Cpu className="w-5 h-5 text-amber-300 shrink-0" />
                        <p className="text-[12px] leading-[1.55] text-emerald-50">
                          Từ những nguyên tắc đó, tôi tập trung xây dựng các hệ thống{' '}
                          <strong className="font-bold text-white">
                            CRM, Dashboard quản trị, AI Chatbot
                          </strong>{' '}
                          cùng các giải pháp{' '}
                          <strong className="font-bold text-amber-200">
                            tự động hóa
                          </strong>{' '}
                          nhằm nâng cao hiệu quả vận hành.
                        </p>
                      </div>

                      {/* 4. People & Training Bento Card */}
                      <div className="nht-bento-item bg-[var(--surface-tertiary-bg,var(--bg-subcard))] p-3.5 border border-[var(--border-subcard,rgba(148,163,184,0.3))] relative overflow-hidden flex items-center gap-3 rounded-[var(--radius-subcard,16px)] shadow-xs">
                        <Users className="w-5 h-5 text-indigo-500 shrink-0 relative z-10" />
                        <p className="text-[12px] text-[var(--text-secondary)] leading-[1.55] relative z-10">
                          Bên cạnh công nghệ, tôi luôn chú trọng{' '}
                          <strong className="font-bold text-[var(--text-primary)]">
                            đào tạo đội ngũ
                          </strong>{' '}
                          biết{' '}
                          <strong className="font-bold text-amber-600 dark:text-amber-400">
                            lắng nghe, thấu hiểu
                          </strong>{' '}
                          và mang đến những{' '}
                          <strong className="font-bold text-purple-600 dark:text-purple-400">
                            trải nghiệm vượt mong đợi
                          </strong>{' '}
                          cho khách hàng.
                        </p>
                      </div>

                      {/* 5. Standalone Quote Bento Card (Mẫu Thẻ 51: Trích Dẫn Bento Studio) */}
                      <div className="nht-bento-item bg-gradient-to-br from-pink-600 via-rose-600 to-purple-800 p-4 overflow-hidden relative shadow-xl flex items-center gap-3.5 text-white rounded-[var(--radius-subcard,16px)] border border-white/20 transition-all duration-300 hover:shadow-2xl">
                        <Quote className="w-16 h-16 text-white/10 absolute right-2 -bottom-2 pointer-events-none" />

                        <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shrink-0 shadow-sm">
                          <Quote className="w-5 h-5 text-yellow-300 shrink-0 rotate-180" />
                        </div>
                        <div className="flex-grow relative z-10">
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-200 mb-1 flex items-center gap-1.5">
                            <Heart className="w-3 h-3 text-yellow-300 fill-yellow-300" />{' '}
                            Triết lý tâm niệm
                          </p>
                          <p className="italic font-bold text-white text-[13.5px] leading-[1.5] drop-shadow-xs">
                            “Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời.”
                          </p>
                        </div>
                      </div>

                      {/* 6. Standalone Partnership Callout Bento Card (Mẫu Thẻ 38: Kết Nối Thiện Chí) */}
                      <div className="nht-bento-item bg-[var(--surface-tertiary-bg,var(--bg-subcard))] p-4 border border-[var(--border-subcard,rgba(148,163,184,0.3))] relative overflow-hidden flex items-center gap-3.5 rounded-[var(--radius-subcard,16px)] shadow-md transition-all duration-300 hover:shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
                          <Handshake className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        </div>
                        <div className="flex-grow relative z-10">
                          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />{' '}
                            Mục tiêu & thiện chí hợp tác
                          </p>
                          <p className="text-[12px] text-[var(--text-secondary)] leading-[1.55]">
                            Tôi mong muốn được{' '}
                            <strong className="font-bold text-[var(--text-primary)]">
                              đồng hành cùng Quý Công ty
                            </strong>{' '}
                            để xây dựng một hệ thống chăm sóc khách hàng hiện đại,{' '}
                            <strong className="font-bold text-emerald-600 dark:text-emerald-400">
                              lấy khách hàng làm trung tâm
                            </strong>
                            , tối ưu hiệu quả vận hành và tạo ra{' '}
                            <strong className="font-bold text-amber-600 dark:text-amber-400">
                              giá trị phát triển bền vững
                            </strong>
                            .
                          </p>
                        </div>
                      </div>

                      {/* 7. Closing Letter Sign-off Section */}
                      <div className="nht-bento-item bg-[var(--surface-tertiary-bg,var(--bg-subcard))] px-4 py-3 border-t-2 border-dashed border-[var(--border-subcard,rgba(148,163,184,0.4))] border-x border-b border-[var(--border-subcard,rgba(148,163,184,0.25))] rounded-[var(--radius-subcard,16px)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
                        <div className="max-w-[290px]">
                          <p className="font-bold text-[var(--text-primary)] text-[12.5px] leading-snug">
                            Xin trân trọng cảm ơn Quý Công ty đã dành thời gian lắng nghe!
                          </p>
                        </div>

                        <div className="flex flex-col items-end text-right shrink-0">
                          <p className="text-[var(--text-muted)] text-[11px] font-medium">
                            Trân trọng,
                          </p>
                          <div className="my-0.5 flex justify-end min-h-[36px] items-center">
                            {!signatureError ? (
                              <img
                                src="https://i.ibb.co/JWsPFKrh/Ch-k.png"
                                alt="Chữ ký Nguyễn Hùng Thái"
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="h-9 max-w-[150px] object-contain dark:brightness-0 dark:invert"
                                onError={() => setSignatureError(true)}
                              />
                            ) : (
                              <span
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                                className="text-2xl font-bold text-[var(--text-primary)] pr-1"
                              >
                                Nguyễn Hùng Thái
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-[var(--text-primary)] text-[13.5px] mt-0.5">
                            Nguyễn Hùng Thái
                          </p>
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
    </div>
  );
};

export default LetterView;
