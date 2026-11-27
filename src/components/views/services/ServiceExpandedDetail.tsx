'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { CheckCircle, Copy } from 'lucide-react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { DomainData } from '@/types';
import { ServiceAssignmentsMap } from '@/context/BannerVideoContext';
import { ServiceDomainKey } from '@/utils/bannerVideoMatcher';

const Activity = createAnimatedIcon('activity');
const Award = createAnimatedIcon('award');
const BookOpen = createAnimatedIcon('book-open');
const Briefcase = createAnimatedIcon('briefcase');
const Building2 = createAnimatedIcon('building-2');
const Compass = createAnimatedIcon('compass');
const ExternalLink = createAnimatedIcon('external-link');
const Minimize2 = createAnimatedIcon('minimize-2');
const X = createAnimatedIcon('x');
const Zap = createAnimatedIcon('zap');

export type ServiceInteractionState = 'idle' | 'hovered' | 'expanding' | 'expanded' | 'closing';

export type DomainIconKey =
  | 'smartphone'
  | 'shopping-bag'
  | 'shield-check'
  | 'gamepad-2'
  | 'wallet'
  | 'cpu';

export type KpiIconKey =
  | 'users'
  | 'zap'
  | 'clock'
  | 'smile'
  | 'trending-up'
  | 'activity'
  | 'layers'
  | 'award'
  | 'heart-handshake'
  | 'rotate-ccw'
  | 'shield-check';

export interface DomainUiMeta {
  shortTitle: string;
  shortTitleEn: string;
  iconKey: DomainIconKey;
  accentLight: string;
  accentDark: string;
  cardGradient: string;
  tintBg: string;
  isLightCard?: boolean;
  illustrationSrc: string;
  fallbackIllustration: string;
  detailKpis: {
    icon: KpiIconKey;
    value: string;
    valueEn?: string;
    label: string;
    labelEn: string;
  }[];
  tags: string[];
  tagsEn: string[];
}

export const formatFourWordSentenceCase = (rawText: string): string => {
  const words = rawText
    .replace(/[&/–—\-:.,()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  if (words.length === 0) return '';
  const joined = words.join(' ').toLocaleLowerCase('vi-VN');
  return joined.charAt(0).toLocaleUpperCase('vi-VN') + joined.slice(1);
};

type BentoTileId =
  | 'hero'
  | 'partners'
  | 'capability'
  | 'experience'
  | 'kpis'
  | 'tools'
  | 'focus'
  | 'tech';

interface ExpandedBentoTileProps {
  tileId: BentoTileId;
  className?: string;
  prefersReducedMotion: boolean;
  children: React.ReactNode;
}

/**
 * Thẻ Bento tương tác từ bộ Studio Bento:
 * - Spotlight bám theo con trỏ chuột (--mx, --my)
 * - Nghiêng 3D nhẹ theo tọa độ chuột (--rx, --ry)
 * - Hiệu ứng gợn sóng (Ripple) khi nhấn
 * - Hỗ trợ Container Query (@container bento-tile) thích ứng không gian
 */
const ExpandedBentoTile: React.FC<ExpandedBentoTileProps> = ({
  tileId,
  className = '',
  prefersReducedMotion,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x.toFixed(1)}px`);
    card.style.setProperty('--my', `${y.toFixed(1)}px`);

    if (!prefersReducedMotion) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (((y - centerY) / Math.max(1, centerY)) * -3.5).toFixed(2);
      const rotateY = (((x - centerX) / Math.max(1, centerX)) * 3.5).toFixed(2);
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return;
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.35;
    const ripple = document.createElement('span');
    ripple.className = 'service-bento-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    card.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 660);
  };

  return (
    <div
      ref={cardRef}
      data-subcard="true"
      data-multicolor-bento="true"
      data-bento-tile-id={tileId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className={`service-bento-tile service-bento-studio-card bento-card relative overflow-hidden flex flex-col text-white ${className}`}
    >
      {children}
    </div>
  );
};

interface ServiceExpandedDetailProps {
  expandedDomain: DomainData;
  expandedMeta: DomainUiMeta;
  allDomains: DomainData[];
  serviceAssignments: ServiceAssignmentsMap;
  interactionState: ServiceInteractionState;
  minHeightPx?: number;
  prefersReducedMotion: boolean;
  isEn: boolean;
  isDarkMode?: boolean;
  isLeatherTheme: boolean;
  expandedCardRef: React.RefObject<HTMLDivElement | null>;
  expandedBodyRef: React.RefObject<HTMLDivElement | null>;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSwitchDomain: (domain: DomainData) => void;
  renderDomainIcon: (key: DomainIconKey, className?: string, color?: string) => React.ReactNode;
  renderKpiIcon: (key: KpiIconKey, className?: string) => React.ReactNode;
}

const DOMAIN_SHORT_TITLES: Record<string, { vi: string; en: string }> = {
  '01': { vi: 'Viễn thông', en: 'Telecom' },
  '02': { vi: 'Thương mại ĐT', en: 'E-Commerce' },
  '03': { vi: 'Tài chính BH', en: 'Finance & Ins.' },
  '04': { vi: 'Thể thao ĐT', en: 'Esports' },
  '05': { vi: 'Thanh toán số', en: 'Fintech' },
  '06': { vi: 'Hệ thống CX', en: 'CX Systems' },
};

const TIMELINE_DOT_STYLES = [
  { dot: 'bg-blue-400 ring-blue-400/20', line: 'from-blue-400 to-blue-400/20' },
  { dot: 'bg-purple-400 ring-purple-400/20', line: 'from-purple-400 to-purple-400/20' },
  { dot: 'bg-pink-400 ring-pink-400/20', line: 'from-pink-400 to-pink-400/20' },
  { dot: 'bg-emerald-400 ring-emerald-400/20', line: 'from-emerald-400 to-emerald-400/20' },
];

export const ServiceExpandedDetail: React.FC<ServiceExpandedDetailProps> = ({
  expandedDomain,
  expandedMeta,
  allDomains,
  serviceAssignments,
  interactionState,
  minHeightPx,
  prefersReducedMotion,
  isEn,
  isDarkMode = false,
  expandedCardRef,
  expandedBodyRef,
  closeButtonRef,
  onClose,
  onSwitchDomain,
  renderDomainIcon,
  renderKpiIcon,
}) => {
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyChip = useCallback((label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(label).catch(() => {});
    }
    setCopiedNotice(label);
    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedNotice(null);
    }, 2400);
  }, []);

  const fullTitle =
    isEn && expandedDomain.titleEn ? expandedDomain.titleEn : expandedDomain.title;
  const formattedTitle = formatFourWordSentenceCase(
    isEn ? expandedMeta.shortTitleEn : expandedMeta.shortTitle
  );
  const summaryText = isEn
    ? expandedDomain.descEn || expandedDomain.subtitleEn || expandedDomain.desc
    : expandedDomain.desc || expandedDomain.subtitle || expandedDomain.coreCompetency;

  const illustrationUrl =
    serviceAssignments[expandedDomain.id as ServiceDomainKey]?.directImageUrl ||
    expandedDomain.customIllustrationUrl ||
    expandedMeta.illustrationSrc;

  const accentColor = isDarkMode ? expandedMeta.accentDark : expandedMeta.accentLight;
  const isClosing = interactionState === 'closing';
  const layoutTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 120, damping: 23, mass: 1.05 };

  const partners = expandedDomain.companyLogos || [];
  const scaleItems = expandedDomain.scaleAndScope || [];
  const challenges = expandedDomain.operationalChallenges || [];
  const techSolutions = expandedDomain.techSolutions || [];
  const rolesHeld = expandedDomain.rolesHeld || [];
  const tools = expandedDomain.tools || [];

  const copyToast = copiedNotice ? (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2.5 bg-gray-900/95 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span className="text-xs sm:text-sm font-bold text-gray-100">
          {isEn ? `Copied: ${copiedNotice}` : `Đã sao chép: ${copiedNotice}`}
        </span>
      </div>
    </div>
  ) : null;

  return (
    <motion.div
      id="services-expanded-card"
      ref={expandedCardRef}
      layoutId={`service-card-shell-${expandedDomain.id}`}
      layout
      transition={{ layout: layoutTransition }}
      data-element-type="card"
      data-compact-service-card="true"
      data-bento-service-detail="true"
      data-interaction-state={interactionState}
      role="region"
      aria-label={fullTitle}
      className="service-expanded-bento-shell bento-card glass-card relative w-full min-w-0 rounded-[var(--radius-card,var(--radius-global,14px))] p-3 sm:p-4 md:p-5 box-border text-[var(--text-primary)] shadow-2xl"
      style={{
        minHeight: minHeightPx ? `${minHeightPx}px` : undefined,
        borderColor: `color-mix(in srgb, ${accentColor} 40%, var(--border-card, var(--border-color)))`,
        borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
      }}
    >
      {/* CSS đặc trưng từ hệ Studio Bento: Spotlight chuột + Nghiêng 3D + Gợn sóng + Bảo toàn màu thẻ trên cả Sáng & Tối */}
      <style>{`
        html #services-page-container #services-expanded-card .service-bento-studio-card {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;
          border-radius: var(--radius-card, 14px) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          color: #ffffff !important;
          transform-style: preserve-3d;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.45),
            0 4px 12px -3px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.16) !important;
          transition:
            transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.28s ease !important;
        }

        html #services-page-container #services-expanded-card .service-bento-studio-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.28s ease;
          background: radial-gradient(
            360px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.16),
            rgba(168, 85, 247, 0.08) 40%,
            transparent 72%
          );
        }

        @media (hover: hover) and (pointer: fine) {
          html #services-page-container #services-expanded-card .service-bento-studio-card:hover {
            transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-5px) scale(1.01) !important;
            border-color: rgba(255, 255, 255, 0.32) !important;
            box-shadow:
              0 24px 44px -12px rgba(0, 0, 0, 0.56),
              0 10px 20px -6px rgba(0, 0, 0, 0.36),
              0 0 0 1px rgba(255, 255, 255, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.26) !important;
          }

          html #services-page-container #services-expanded-card .service-bento-studio-card:hover::before {
            opacity: 1;
          }

          html #services-page-container #services-expanded-card .service-bento-studio-card:hover svg.lucide.shrink-0 {
            transform: scale(1.12) rotate(-5deg);
          }
        }

        html #services-page-container #services-expanded-card .service-bento-studio-card svg.lucide {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        html #services-page-container #services-expanded-card .service-bento-studio-card h2,
        html #services-page-container #services-expanded-card .service-bento-studio-card h3 {
          color: #ffffff !important;
          text-transform: none !important;
        }

        html #services-page-container #services-expanded-card .service-bento-ripple {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 25;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.32) 0%,
            rgba(168, 85, 247, 0.14) 55%,
            transparent 75%
          );
          transform: translate(-50%, -50%) scale(0);
          animation: serviceBentoRipple 0.64s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes serviceBentoRipple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html #services-page-container #services-expanded-card .service-bento-studio-card:hover {
            transform: none !important;
          }
          html #services-page-container #services-expanded-card .service-bento-ripple {
            display: none !important;
          }
        }
      `}</style>

      {typeof document !== 'undefined' && copyToast ? createPortal(copyToast, document.body) : copyToast}

      {/* Top Bento Switcher & Close Bar */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={isClosing ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.14 : 0.3,
          delay: prefersReducedMotion ? 0 : isClosing ? 0 : 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="service-bento-topbar flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[var(--border-subcard,var(--border-color))] min-w-0"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={onClose}
            className="banner-control-pill inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full text-xs font-bold font-play cursor-pointer transition-all hover:opacity-90 shrink-0 border border-white/10 hover:border-white/20 shadow-xs whitespace-nowrap"
          >
            <Minimize2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'All 6 Domains' : '6 lĩnh vực'}</span>
          </button>

          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {allDomains.map((dom) => {
              const isCurrent = dom.id === expandedDomain.id;
              const shortLabel = DOMAIN_SHORT_TITLES[dom.id]
                ? isEn
                  ? DOMAIN_SHORT_TITLES[dom.id].en
                  : DOMAIN_SHORT_TITLES[dom.id].vi
                : dom.title;
              return (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => onSwitchDomain(dom)}
                  className="min-h-[36px] px-3 py-1.5 rounded-full text-[12px] font-semibold font-play transition-all duration-200 cursor-pointer border shrink-0 whitespace-nowrap shadow-xs hover:scale-[1.02]"
                  style={
                    isCurrent
                      ? {
                          background: `color-mix(in srgb, ${accentColor} 20%, transparent)`,
                          borderColor: `color-mix(in srgb, ${accentColor} 50%, transparent)`,
                          color: accentColor,
                          boxShadow: `0 0 12px color-mix(in srgb, ${accentColor} 30%, transparent)`,
                        }
                      : {
                          background: 'var(--surface-tertiary-bg, var(--bg-subcard))',
                          borderColor: 'var(--border-subcard, var(--border-color))',
                          color: 'var(--text-secondary)',
                        }
                  }
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="theme-modal-close nav-arrow-btn w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/10 hover:border-white/25 shadow-xs"
          aria-label={isEn ? 'Close service detail' : 'Đóng chi tiết dịch vụ'}
          title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
        >
          <X className="w-4 h-4 shrink-0" />
        </button>
      </motion.div>

      {/* Lưới 8 Thẻ Bento Grid đồng bộ mẫu màu & bố cục Studio Bento (Space-Adaptive Responsive) */}
      <motion.div
        key={expandedDomain.id}
        ref={expandedBodyRef}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={isClosing ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.16 : 0.36,
          delay: prefersReducedMotion ? 0 : isClosing ? 0 : 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="service-bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[14px] lg:gap-[15px] w-full min-w-0 [grid-auto-flow:dense]"
      >
        {/* BENTO CARD 1 (2x1): Áp dụng Mẫu Thẻ 1 — Thẻ Chào Mừng Chính (Purple -> Indigo Gradient + Glow Orb) */}
        <ExpandedBentoTile
          tileId="hero"
          prefersReducedMotion={prefersReducedMotion}
          className="sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 justify-between p-4 sm:p-5 gap-4"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="bento-hero-layout relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
            <div className="flex-1 min-w-0 flex flex-col gap-2.5 w-full">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <span className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-950/60 border border-purple-400/30 shrink-0 shadow-lg text-purple-200 mt-0.5 sm:mt-0">
                  {renderDomainIcon(expandedMeta.iconKey, 'w-5 h-5 shrink-0 stroke-[2.2]', '#e9d5ff')}
                </span>
                <div className="min-w-0 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold text-purple-200/95">
                    <span className="shrink-0">{isEn ? `Domain #${expandedDomain.id}` : `Lĩnh vực #${expandedDomain.id}`}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-purple-100 break-words">{fullTitle}</span>
                  </div>
                  <h2
                    className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight leading-snug text-white m-0 mt-0.5 [text-wrap:balance] break-words"
                    title={fullTitle}
                  >
                    {formattedTitle}
                  </h2>
                </div>
              </div>
              {summaryText && (
                <p className="text-sm sm:text-[15px] text-purple-100/95 leading-relaxed m-0 max-w-2xl">
                  {summaryText}
                </p>
              )}
            </div>

            <div className="bento-hero-media relative shrink-0 w-24 h-20 sm:w-36 sm:h-28 flex items-center justify-center self-center sm:self-auto">
              <img
                src={illustrationUrl}
                alt={fullTitle}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (e.currentTarget.src !== expandedMeta.fallbackIllustration) {
                    e.currentTarget.src = expandedMeta.fallbackIllustration;
                  }
                }}
                className="w-24 h-20 sm:w-36 sm:h-28 object-contain drop-shadow-2xl select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 pt-3 border-t border-white/15">
            <span className="inline-flex items-center gap-2 text-white bg-purple-950/60 border border-purple-400/30 font-bold py-1.5 px-3 rounded-xl text-xs shadow-md">
              {isEn ? 'Standardized Ops' : 'Vận hành chuẩn hóa'}
            </span>
            {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).slice(0, 4).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-bold transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </ExpandedBentoTile>

        {/* BENTO CARD 2 (1x1): Áp dụng Mẫu Thẻ 21 — Tích Hợp Nhanh (Gray 800/90 + Grid Tiles) */}
        <ExpandedBentoTile
          tileId="partners"
          prefersReducedMotion={prefersReducedMotion}
          className="bg-gray-800/90 backdrop-blur-md justify-between p-4 sm:p-5 gap-3"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-5 h-5 text-purple-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Enterprise Partners' : 'Doanh nghiệp tiêu biểu'}
                </h3>
              </div>
              <span className="text-xs font-bold text-gray-400 shrink-0 tabular-nums">
                {partners.length} {isEn ? 'partners' : 'đối tác'}
              </span>
            </div>
            <p className="text-xs text-gray-400 m-0">
              {isEn
                ? 'Trusted organizations & ecosystems served directly.'
                : 'Các tập đoàn và hệ sinh thái doanh nghiệp đã trực tiếp vận hành.'}
            </p>
          </div>

          <div className="bento-partners-grid relative z-10 grid grid-cols-2 gap-2.5 my-auto">
            {partners.map((partner, pIdx) => {
              const content = (
                <>
                  <div className="company-logo-surface w-9 h-9 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm border border-white/20">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                          e.currentTarget.src = partner.fallbackLogo;
                        } else {
                          e.currentTarget.src = illustrationUrl;
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-100 truncate">
                      {partner.name}
                    </span>
                    {partner.url && (
                      <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                    )}
                  </div>
                </>
              );

              return partner.url ? (
                <a
                  key={partner.name || pIdx}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-bento-styled="true"
                  className="service-bento-subtile p-2.5 rounded-xl bg-gray-700/55 hover:bg-gray-700 border border-white/10 flex items-center gap-2 transition-colors min-w-0"
                  title={partner.name}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={partner.name || pIdx}
                  data-bento-styled="true"
                  className="service-bento-subtile p-2.5 rounded-xl bg-gray-700/55 border border-white/10 flex items-center gap-2 min-w-0"
                  title={partner.name}
                >
                  {content}
                </div>
              );
            })}
          </div>

          <span className="relative z-10 text-xs text-purple-400 font-bold">
            {expandedDomain.typicalEntitiesLine || (isEn ? 'Verified enterprise track record' : 'Kinh nghiệm triển khai thực tế đa ngành')}
          </span>
        </ExpandedBentoTile>

        {/* BENTO CARD 3 (1x1): Áp dụng Mẫu Thẻ 14 — Mạng Lưới Edge (Cyan -> Blue Gradient + Translucent Blocks) */}
        <ExpandedBentoTile
          tileId="capability"
          prefersReducedMotion={prefersReducedMotion}
          className="bg-gradient-to-br from-cyan-600 to-blue-900 justify-between p-4 sm:p-5 gap-3"
        >
          <div className="relative z-10 flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-cyan-200 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Capability & Scope' : 'Năng lực & Phạm vi'}
            </h3>
          </div>

          {expandedDomain.operationalCapability && (
            <p className="relative z-10 text-xs sm:text-[13px] text-cyan-100/90 leading-relaxed m-0">
              {expandedDomain.operationalCapability}
            </p>
          )}

          {scaleItems.length > 0 && (
            <div className="relative z-10 grid grid-cols-1 gap-2 mt-auto">
              {scaleItems.map((item, sIdx) => (
                <div
                  key={sIdx}
                  data-bento-styled="true"
                  className="service-bento-subtile bg-white/15 border border-white/15 px-3 py-2 rounded-xl"
                >
                  <div className="text-xs font-bold text-white leading-snug">
                    {item.label}
                  </div>
                  <div className="text-xs text-cyan-100/90 leading-relaxed mt-0.5">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO CARD 4 (1x1): Áp dụng Mẫu Thẻ 4 & 12 — Cộng Đồng & Hồ Sơ (Slate 800 -> Slate 900 + Overlapping Stack) */}
        <ExpandedBentoTile
          tileId="experience"
          prefersReducedMotion={prefersReducedMotion}
          className="bg-gradient-to-br from-slate-800 to-slate-900 justify-between p-4 sm:p-5 gap-3.5"
        >
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Briefcase className="w-5 h-5 text-purple-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Experience & Roles' : 'Kinh nghiệm & Vai trò'}
                </h3>
              </div>
            </div>

            {partners.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center -space-x-2.5 shrink-0">
                  {partners.slice(0, 4).map((partner, pIdx) => (
                    <div
                      key={partner.name || pIdx}
                      title={partner.name}
                      className="company-logo-surface w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5 ring-2 ring-slate-800 shadow-sm"
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                            e.currentTarget.src = partner.fallbackLogo;
                          } else {
                            e.currentTarget.src = illustrationUrl;
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-purple-400 truncate">
                  {expandedDomain.typicalEntitiesLabel || (isEn ? 'Key Leadership' : 'Điều hành thực chiến')}
                </span>
              </div>
            )}

            {(expandedDomain.experienceAndScale || expandedDomain.desc) && (
              <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed m-0">
                {expandedDomain.experienceAndScale || expandedDomain.desc}
              </p>
            )}
          </div>

          {rolesHeld.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5 pt-3 border-t border-white/10 mt-auto">
              {rolesHeld.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-600/30 border border-purple-400/35 text-purple-200 text-xs font-bold"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO CARD 5 (1x1): Áp dụng Mẫu Thẻ 80 & 50 — Hiệu Suất & Chỉ Số KPI (Rose -> Pink -> Purple 950) */}
        <ExpandedBentoTile
          tileId="kpis"
          prefersReducedMotion={prefersReducedMotion}
          className="bg-gradient-to-br from-rose-700 via-pink-800 to-purple-950 justify-between p-4 sm:p-5 gap-3"
        >
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-5 h-5 text-amber-300 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
                {isEn ? 'Key Results' : 'Kết quả đạt được'}
              </h3>
            </div>
            <span className="text-xs font-bold bg-white/15 text-white px-2.5 py-0.5 rounded-full shrink-0">
              {isEn ? 'SLA Verified' : 'Đạt chuẩn SLA'}
            </span>
          </div>

          <div className="bento-kpi-grid relative z-10 grid grid-cols-2 gap-2.5 my-auto">
            {expandedMeta.detailKpis.map((kpi, kIdx) => (
              <div
                key={kIdx}
                data-bento-styled="true"
                className="service-bento-subtile bg-black/25 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between gap-1.5 min-w-0"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-base sm:text-lg font-bold tabular-nums tracking-tight text-white truncate">
                    {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/15 text-amber-300 shrink-0">
                    {renderKpiIcon(kpi.icon, 'w-3.5 h-3.5 shrink-0')}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-rose-100/90 leading-snug line-clamp-2">
                  {isEn ? kpi.labelEn : kpi.label}
                </span>
                <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300"
                    style={{ width: '90%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {expandedDomain.keyResultsSummary && (
            <p className="relative z-10 text-xs text-rose-100/90 leading-relaxed m-0 pt-1">
              {expandedDomain.keyResultsSummary}
            </p>
          )}
        </ExpandedBentoTile>

        {/* BENTO CARD 6 (1x1): Áp dụng Mẫu Thẻ 26 — Kho Mẫu & Công Cụ (Violet -> Fuchsia Gradient + Chip Grid) */}
        <ExpandedBentoTile
          tileId="tools"
          prefersReducedMotion={prefersReducedMotion}
          className="bg-gradient-to-br from-violet-600 to-fuchsia-800 justify-between p-4 sm:p-5 gap-3"
        >
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 text-violet-200 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Standardized Tools' : 'Công cụ chuẩn hóa'}
                </h3>
              </div>
              <span className="text-xs font-bold text-violet-100 bg-white/15 px-2.5 py-0.5 rounded-full shrink-0 tabular-nums">
                {tools.length} {isEn ? 'tools' : 'công cụ'}
              </span>
            </div>
            <p className="text-xs text-violet-100/90 leading-relaxed m-0">
              {isEn
                ? 'Operational platforms, CRM suites, and analytics tools standardized across teams (tap to copy):'
                : 'Hệ thống nền tảng, phần mềm CRM và bộ công cụ vận hành được triển khai chuẩn hóa (chạm để sao chép):'}
            </p>
          </div>

          {tools.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
              {tools.map((tool, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => handleCopyChip(tool)}
                  title={isEn ? `Copy ${tool}` : `Sao chép ${tool}`}
                  className="inline-flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  <span>{tool}</span>
                  <Copy className="w-3 h-3 text-violet-200 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO CARD 7 (1x1): Áp dụng Mẫu Thẻ 7 — Lịch Sự Kiện Timeline (Gray 800/90 + Blue/Purple Wash + Glowing Nodes) */}
        <ExpandedBentoTile
          tileId="focus"
          prefersReducedMotion={prefersReducedMotion}
          className="bg-gray-800/90 justify-between p-4 sm:p-5 gap-3"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-15 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-blue-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Operational Focus' : 'Trọng tâm vận hành'}
            </h3>
          </div>

          <ol className="relative z-10 flex flex-col gap-3.5 my-auto p-0 list-none">
            {challenges.map((challenge, cIdx) => {
              const isLast = cIdx === challenges.length - 1;
              const palette = TIMELINE_DOT_STYLES[cIdx % TIMELINE_DOT_STYLES.length];
              return (
                <li key={cIdx} className="relative flex items-start gap-3">
                  <div className="relative flex flex-col items-center shrink-0 mt-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ring-4 ${palette.dot}`} />
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className={`w-[2px] h-full min-h-[24px] bg-gradient-to-b ${palette.line} rounded-full mt-1.5`}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-[13px] text-gray-200 leading-relaxed m-0 font-medium">
                      {challenge}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </ExpandedBentoTile>

        {/* BENTO CARD 8 (1x1 Desktop / 2x1 Tablet): Áp dụng Mẫu Thẻ 25 — Quy Trình CI/CD (Slate 800 -> Gray 800 -> Emerald 950) */}
        <ExpandedBentoTile
          tileId="tech"
          prefersReducedMotion={prefersReducedMotion}
          className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-800 via-gray-800 to-emerald-950 justify-between p-4 sm:p-5 gap-3"
        >
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-5 h-5 text-emerald-400 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight m-0 truncate">
                {isEn ? 'Tech Solutions' : 'Giải pháp công nghệ'}
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full shrink-0 tabular-nums">
              {techSolutions.length} {isEn ? 'solutions' : 'giải pháp'}
            </span>
          </div>

          <div className="bento-tech-grid relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 my-auto">
            {techSolutions.map((sol, solIdx) => (
              <div
                key={solIdx}
                data-bento-styled="true"
                className="service-bento-subtile bg-black/25 border border-white/10 p-3 rounded-xl flex flex-col gap-1"
              >
                <span className="text-xs sm:text-[13px] font-bold text-white leading-snug flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{sol.name}</span>
                </span>
                <span className="text-xs text-gray-300 leading-relaxed pl-6">
                  {sol.desc}
                </span>
              </div>
            ))}
          </div>
        </ExpandedBentoTile>
      </motion.div>
    </motion.div>
  );
};

export default ServiceExpandedDetail;
