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
const X = createAnimatedIcon('x');
const Zap = createAnimatedIcon('zap');

export type ServiceInteractionState = 'idle' | 'hovered' | 'expanding' | 'expanded' | 'closing';
export type BentoFxMode = 'spotlight-3d' | 'float-shadow' | 'neon' | 'minimal';

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
  fxMode: BentoFxMode;
  tileBgCss: string;
  className?: string;
  prefersReducedMotion: boolean;
  children: React.ReactNode;
}

/**
 * Thẻ Bento tương tác lấy nguyên bản từ bộ Creator Studio Bento:
 * - Hỗ trợ 4 chế độ hiệu ứng: spotlight-3d, float-shadow, neon, minimal
 * - Spotlight bám theo con trỏ chuột (--mx, --my)
 * - Nghiêng 3D ±4.5deg theo tọa độ chuột (--rx, --ry) khi bật spotlight-3d
 * - Hiệu ứng gợn sóng (Ripple) khi nhấn
 */
const ExpandedBentoTile: React.FC<ExpandedBentoTileProps> = ({
  tileId,
  fxMode,
  tileBgCss,
  className = '',
  prefersReducedMotion,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (fxMode !== 'spotlight-3d' && cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0deg');
      cardRef.current.style.setProperty('--ry', '0deg');
    }
  }, [fxMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x.toFixed(1)}px`);
    card.style.setProperty('--my', `${y.toFixed(1)}px`);

    if (fxMode === 'spotlight-3d' && !prefersReducedMotion) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (((y - centerY) / Math.max(1, centerY)) * -4.5).toFixed(2);
      const rotateY = (((x - centerX) / Math.max(1, centerX)) * 4.5).toFixed(2);
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
    if ((e.target as HTMLElement).closest('input, textarea, select')) return;
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const ripple = document.createElement('span');
    ripple.className = 'service-bento-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    card.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 680);
  };

  return (
    <div
      ref={cardRef}
      data-subcard="true"
      data-multicolor-bento="true"
      data-bento-styled="true"
      data-bento-tile-id={tileId}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      style={{ ['--bento-tile-bg' as string]: tileBgCss }}
      className={`bento-item service-bento-tile service-bento-studio-card bento-card bento-border relative overflow-hidden flex flex-col text-white ${className}`}
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
  fxMode?: BentoFxMode;
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

const TIMELINE_DOT_STYLES = [
  { dot: 'bg-blue-400 ring-blue-400/20', line: 'from-blue-400 to-blue-400/20' },
  { dot: 'bg-purple-400 ring-purple-400/20', line: 'from-purple-400 to-purple-400/20' },
  { dot: 'bg-pink-400 ring-pink-400/20', line: 'from-pink-400 to-pink-400/20' },
  { dot: 'bg-emerald-400 ring-emerald-400/20', line: 'from-emerald-400 to-emerald-400/20' },
];

const KPI_PROGRESS_WIDTHS = ['96%', '92%', '88%', '94%'];

export const ServiceExpandedDetail: React.FC<ServiceExpandedDetailProps> = ({
  expandedDomain,
  expandedMeta,
  allDomains: _allDomains,
  serviceAssignments,
  interactionState,
  fxMode = 'spotlight-3d',
  minHeightPx,
  prefersReducedMotion,
  isEn,
  isDarkMode = false,
  expandedCardRef,
  expandedBodyRef,
  closeButtonRef,
  onClose,
  onSwitchDomain: _onSwitchDomain,
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
      <div className="toast-enter pointer-events-auto flex items-center gap-3 bg-gray-900/95 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl max-w-sm">
        <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
        <span className="text-sm font-bold text-gray-100">
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
      data-section-card="true"
      data-compact-service-card="true"
      data-bento-service-detail="true"
      data-fx={fxMode}
      data-interaction-state={interactionState}
      role="region"
      aria-label={fullTitle}
      className={`service-expanded-bento-shell bento-card glass-card relative w-full min-w-0 rounded-[var(--radius-card,var(--radius-global,14px))] p-3 sm:p-4 md:p-5 box-border text-[var(--text-primary)] shadow-2xl ${
        isDarkMode ? '' : 'service-bento-light-host'
      }`}
      style={{
        minHeight: minHeightPx ? `${minHeightPx}px` : undefined,
        borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
      }}
    >
      {/* Toàn bộ hệ hiệu ứng Creator Studio Bento + 4-Column Responsive Bento Grid (.bento-container / .bento-item) */}
      <style>{`
        html #services-page-container #services-expanded-card .bento-container {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          grid-auto-flow: dense !important;
          gap: 16px !important;
          width: 100% !important;
          min-width: 0 !important;
          align-items: stretch !important;
        }

        html #services-page-container #services-expanded-card .bento-item,
        html[data-card-style] #services-page-container #services-expanded-card .bento-item {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;
          font-family: 'Play', sans-serif;
          background: var(--bento-tile-bg, #1e293b) !important;
          border-radius: 24px !important;
          padding: 24px !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          color: #ffffff !important;
          width: 100% !important;
          height: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          align-self: stretch !important;
          box-sizing: border-box !important;
          transform-style: preserve-3d;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease !important;
        }

        html #services-page-container #services-expanded-card .bento-container .col-span-2 {
          grid-column: span 2;
        }

        html #services-page-container #services-expanded-card .bento-container .row-span-2 {
          grid-row: span 2;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item {
          color: #ffffff !important;
          box-shadow:
            0 16px 32px -10px rgba(15, 23, 42, 0.26),
            0 6px 14px -4px rgba(15, 23, 42, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        html #services-page-container #services-expanded-card .bento-item:active {
          transform: translateY(-2px) scale(0.992) !important;
          box-shadow:
            0 8px 18px -6px rgba(0, 0, 0, 0.5),
            0 3px 8px -2px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        }

        /* Lớp ánh sáng Spotlight bám theo con trỏ chuột */
        html #services-page-container #services-expanded-card .bento-item::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(
            380px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.16),
            rgba(168, 85, 247, 0.08) 40%,
            transparent 72%
          );
        }

        @media (hover: hover) and (pointer: fine) {
          /* Chế độ 1: Ánh sáng Spotlight + Nghiêng 3D + Nổi khối đổ bóng (Mặc định) */
          html #services-page-container #services-expanded-card[data-fx="spotlight-3d"] .bento-item:hover {
            transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-6px) scale(1.01) !important;
            border-color: rgba(255, 255, 255, 0.28) !important;
            box-shadow:
              0 30px 50px -12px rgba(0, 0, 0, 0.62),
              0 14px 24px -8px rgba(0, 0, 0, 0.42),
              0 0 0 1px rgba(255, 255, 255, 0.24),
              0 0 32px -6px rgba(139, 92, 246, 0.38),
              inset 0 1px 0 rgba(255, 255, 255, 0.28) !important;
            transition:
              transform 0.14s ease-out,
              box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.3s ease !important;
          }

          html #services-page-container #services-expanded-card[data-fx="spotlight-3d"] .bento-item:hover::before {
            opacity: 1;
          }

          /* Chế độ 2: Nổi Khối & Đổ Bóng Chuyên Sâu */
          html #services-page-container #services-expanded-card[data-fx="float-shadow"] .bento-item:hover {
            transform: translateY(-8px) scale(1.014) !important;
            border-color: rgba(255, 255, 255, 0.28) !important;
            box-shadow:
              0 36px 60px -14px rgba(0, 0, 0, 0.68),
              0 18px 28px -10px rgba(0, 0, 0, 0.46),
              0 0 0 1px rgba(255, 255, 255, 0.26),
              inset 0 1px 0 rgba(255, 255, 255, 0.32) !important;
          }

          html #services-page-container #services-expanded-card[data-fx="float-shadow"] .bento-item:hover::before {
            opacity: 0.75;
          }

          /* Chế độ 3: Viền Neon rực rỡ bám chuột + Nổi khối */
          html #services-page-container #services-expanded-card[data-fx="neon"] .bento-item::before {
            background: radial-gradient(
              340px circle at var(--mx) var(--my),
              rgba(56, 189, 248, 0.24),
              rgba(192, 132, 252, 0.16) 42%,
              transparent 72%
            );
          }

          html #services-page-container #services-expanded-card[data-fx="neon"] .bento-item:hover {
            transform: translateY(-6px) scale(1.012) !important;
            border-color: rgba(192, 132, 252, 0.75) !important;
            box-shadow:
              0 28px 46px -12px rgba(0, 0, 0, 0.58),
              0 18px 34px -8px rgba(139, 92, 246, 0.48),
              0 0 26px -2px rgba(56, 189, 248, 0.42),
              inset 0 0 20px rgba(168, 85, 247, 0.14) !important;
          }

          html #services-page-container #services-expanded-card[data-fx="neon"] .bento-item:hover::before {
            opacity: 1;
          }

          /* Chế độ 4: Tối Giản (Nổi nhẹ + Đổ bóng mềm) */
          html #services-page-container #services-expanded-card[data-fx="minimal"] .bento-item:hover {
            transform: translateY(-4px) !important;
            border-color: rgba(255, 255, 255, 0.24) !important;
            box-shadow:
              0 22px 36px -10px rgba(0, 0, 0, 0.5),
              0 10px 18px -6px rgba(0, 0, 0, 0.32),
              inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
          }

          html #services-page-container #services-expanded-card .bento-item:hover svg.lucide.shrink-0 {
            transform: scale(1.14) rotate(-5deg);
          }
        }

        /* Tablet Responsiveness (769px - 1080px): 2-column Bento */
        @media (max-width: 1080px) {
          html #services-page-container #services-expanded-card .bento-container {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px !important;
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          html #services-page-container #services-expanded-card .bento-container {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          html #services-page-container #services-expanded-card .bento-item {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            border-radius: 20px !important;
            padding: 18px !important;
            height: auto !important;
          }
        }

        html #services-page-container #services-expanded-card .service-bento-studio-card svg.lucide {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        html #services-page-container #services-expanded-card .service-bento-studio-card h2:not(.gradient-text),
        html #services-page-container #services-expanded-card .service-bento-studio-card h3:not(.gradient-text) {
          font-family: 'Play', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.3 !important;
          font-weight: 700 !important;
          letter-spacing: 0em !important;
          color: #ffffff !important;
          text-transform: none !important;
        }

        html #services-page-container #services-expanded-card .service-bento-studio-card .gradient-text {
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          font-family: 'Play', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.3 !important;
          font-weight: 700 !important;
        }

        html #services-page-container #services-expanded-card .service-bento-ripple {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 25;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.34) 0%,
            rgba(168, 85, 247, 0.16) 55%,
            transparent 75%
          );
          transform: translate(-50%, -50%) scale(0);
          animation: serviceBentoRipple 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toast-enter {
          animation: toastSlideIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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

      {/* Nút đóng nổi (Floating Close Button) nằm trên góc phải */}
      <motion.button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={isClosing ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.14 : 0.26,
          delay: prefersReducedMotion ? 0 : isClosing ? 0 : 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="theme-modal-close nav-arrow-btn absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-10 h-10 rounded-full inline-flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-gray-900/85 hover:bg-purple-600 text-white border border-white/20 shadow-xl backdrop-blur-md"
        aria-label={isEn ? 'Close service detail' : 'Đóng chi tiết dịch vụ'}
        title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
      >
        <X className="w-4 h-4 shrink-0 text-white" />
      </motion.button>

      {/* Bố cục 4-Column Responsive Bento Grid (.bento-container / .bento-item / .col-span-2 / .row-span-2) */}
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
        className="bento-container service-bento-grid w-full min-w-0"
      >
        {/* BENTO ITEM 1 (Cols 1-2, Row 1): Tổng Quan Lĩnh Vực — col-span-2 */}
        <ExpandedBentoTile
          tileId="hero"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #312e81 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="col-span-2 justify-between gap-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900"
        >
          <div className="absolute -right-14 -top-14 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

          <div className="bento-hero-layout relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0 max-[1080px]:pr-12">
            <div className="flex-1 min-w-0 flex flex-col gap-2.5 w-full">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <span
                  data-bento-styled="true"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-400/35 text-purple-100 shrink-0 shadow-md mt-0.5 sm:mt-0"
                >
                  {renderDomainIcon(expandedMeta.iconKey, 'w-5 h-5 shrink-0 stroke-[2.2]', '#e9d5ff')}
                </span>
                <div className="min-w-0 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-purple-200/95">
                    <span className="shrink-0 tabular-nums">
                      {isEn ? `Domain #${expandedDomain.id}` : `Lĩnh vực #${expandedDomain.id}`}
                    </span>
                    <span aria-hidden="true" className="text-purple-300/60">·</span>
                    <span className="break-words text-purple-100/95">{fullTitle}</span>
                  </div>
                  <h2
                    className="bento-unified-title font-play text-[16px] font-bold tracking-tight leading-snug text-white m-0 mt-1 [text-wrap:balance] break-words"
                    title={fullTitle}
                  >
                    {formattedTitle}
                  </h2>
                </div>
              </div>
              {summaryText && (
                <p className="text-sm sm:text-[15px] text-purple-100/90 leading-relaxed m-0 max-w-2xl">
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

          <div className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3.5 border-t border-white/15 text-xs font-semibold text-purple-100/90">
            <span className="text-white font-bold">
              {isEn ? 'Standardized Ops' : 'Vận hành chuẩn hóa'}
            </span>
            {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).slice(0, 4).map((tag, tIdx) => (
              <React.Fragment key={tIdx}>
                <span aria-hidden="true" className="text-purple-300/50">·</span>
                <span className="text-purple-100/90">{tag}</span>
              </React.Fragment>
            ))}
          </div>
        </ExpandedBentoTile>

        {/* BENTO ITEM 2 (Col 3, Row 1): Doanh nghiệp tiêu biểu — 1x1 */}
        <ExpandedBentoTile
          tileId="partners"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #1e293b 0%, #1f2937 55%, #0f172a 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="justify-between gap-3.5 bg-slate-800"
        >
          <div className="relative z-10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-5 h-5 shrink-0 text-purple-400" />
                <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Enterprise Partners' : 'Doanh nghiệp tiêu biểu'}
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-300 shrink-0 tabular-nums whitespace-nowrap">
                {partners.length} {isEn ? 'partners' : 'đối tác'}
              </span>
            </div>
            <p className="text-xs text-slate-300/85 m-0 leading-relaxed">
              {isEn
                ? 'Trusted organizations & ecosystems served directly.'
                : 'Các tập đoàn và hệ sinh thái doanh nghiệp đã trực tiếp vận hành.'}
            </p>
          </div>

          <div
            className={`bento-partners-grid relative z-10 grid gap-2.5 ${
              partners.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {partners.map((partner, pIdx) => {
              const content = (
                <>
                  <div className="company-logo-surface w-8 h-8 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm border border-white/20">
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
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {partner.name}
                    </span>
                    {partner.url && (
                      <ExternalLink className="w-3 h-3 text-purple-300 shrink-0" />
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
                  className="service-bento-subtile p-2.5 rounded-2xl bg-slate-900/55 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/50 flex items-center gap-2 transition-all duration-200 min-w-0"
                  title={partner.name}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={partner.name || pIdx}
                  data-bento-styled="true"
                  className="service-bento-subtile p-2.5 rounded-2xl bg-slate-900/55 border border-white/10 flex items-center gap-2 min-w-0"
                  title={partner.name}
                >
                  {content}
                </div>
              );
            })}
          </div>

          <span className="relative z-10 text-xs font-semibold text-purple-300/95 truncate">
            {expandedDomain.typicalEntitiesLine ||
              (isEn ? 'Verified enterprise track record' : 'Kinh nghiệm triển khai thực tế đa ngành')}
          </span>
        </ExpandedBentoTile>

        {/* BENTO ITEM 3 (Col 4, Rows 1-2): Năng lực & Phạm vi — row-span-2 */}
        <ExpandedBentoTile
          tileId="capability"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #0891b2 0%, #1d4ed8 52%, #312e81 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="row-span-2 justify-start gap-3.5 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900"
        >
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5 min-[1081px]:pr-11">
            <Compass className="w-5 h-5 shrink-0 text-cyan-200" />
            <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Capability & Scope' : 'Năng lực & Phạm vi'}
            </h3>
          </div>

          {expandedDomain.operationalCapability && (
            <p className="relative z-10 text-xs sm:text-[13px] text-cyan-50/90 leading-relaxed m-0">
              {expandedDomain.operationalCapability}
            </p>
          )}

          {scaleItems.length > 0 && (
            <div className="relative z-10 flex-1 flex flex-col justify-between gap-2.5">
              {scaleItems.map((item, sIdx) => (
                <div
                  key={sIdx}
                  data-bento-styled="true"
                  className="service-bento-subtile px-3.5 py-2.5 rounded-2xl bg-black/25 border border-white/15 hover:border-white/30 transition-colors"
                >
                  <div className="font-play text-[13px] font-bold text-cyan-200 leading-snug">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/90 leading-relaxed mt-0.5">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO ITEM 4 (Cols 1-2, Row 2): Kết quả đạt được & Chỉ số KPI — col-span-2 */}
        <ExpandedBentoTile
          tileId="kpis"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #be123c 0%, #9d174d 50%, #3b0764 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="col-span-2 justify-between gap-3.5 bg-gradient-to-br from-rose-700 via-pink-800 to-purple-950"
        >
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-5 h-5 shrink-0 text-amber-300" />
              <h3 className="bento-unified-title gradient-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-pink-200 font-play text-[16px] font-bold tracking-tight m-0 truncate">
                {isEn ? 'Key Results' : 'Kết quả đạt được'}
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-200 shrink-0 whitespace-nowrap">
              {isEn ? 'SLA Verified' : 'Đạt chuẩn SLA'}
            </span>
          </div>

          <div className="bento-kpi-grid relative z-10 grid grid-cols-2 gap-3">
            {expandedMeta.detailKpis.map((kpi, kIdx) => (
              <div
                key={kIdx}
                data-bento-styled="true"
                className="service-bento-subtile rounded-2xl bg-black/25 border border-white/10 hover:border-amber-200/35 p-3 flex flex-col justify-between gap-2 min-w-0 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg sm:text-xl font-bold text-amber-200 tabular-nums tracking-tight truncate">
                    {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white/10 text-yellow-200 shrink-0">
                    {renderKpiIcon(kpi.icon, 'w-3.5 h-3.5 shrink-0')}
                  </span>
                </div>
                <span className="text-xs font-medium text-rose-100/90 leading-snug line-clamp-2">
                  {isEn ? kpi.labelEn : kpi.label}
                </span>
                <div className="w-full bg-black/35 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-pink-400"
                    style={{ width: KPI_PROGRESS_WIDTHS[kIdx % KPI_PROGRESS_WIDTHS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>

          {expandedDomain.keyResultsSummary && (
            <p className="relative z-10 text-xs text-rose-100/90 leading-relaxed m-0">
              {expandedDomain.keyResultsSummary}
            </p>
          )}
        </ExpandedBentoTile>

        {/* BENTO ITEM 5 (Col 3, Row 2): Kinh nghiệm & Vai trò — 1x1 */}
        <ExpandedBentoTile
          tileId="experience"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #1e293b 0%, #0f172a 52%, #1e1b4b 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="justify-between gap-3.5 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950"
        >
          <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Briefcase className="w-5 h-5 shrink-0 text-purple-400" />
              <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                {isEn ? 'Experience & Roles' : 'Kinh nghiệm & Vai trò'}
              </h3>
            </div>

            {partners.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center -space-x-2.5 shrink-0">
                  {partners.slice(0, 4).map((partner, pIdx) => (
                    <div
                      key={partner.name || pIdx}
                      title={partner.name}
                      className="company-logo-surface w-9 h-9 rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5 ring-2 ring-slate-900 shadow-md"
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
                  {partners.length > 4 && (
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-900 shadow-md tabular-nums">
                      +{partners.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-purple-300 truncate">
                  {expandedDomain.typicalEntitiesLabel || (isEn ? 'Key Leadership' : 'Điều hành thực chiến')}
                </span>
              </div>
            )}

            {(expandedDomain.experienceAndScale || expandedDomain.desc) && (
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed m-0">
                {expandedDomain.experienceAndScale || expandedDomain.desc}
              </p>
            )}
          </div>

          {rolesHeld.length > 0 && (
            <div className="relative z-10 flex flex-col gap-1.5 pt-3 border-t border-white/10">
              {rolesHeld.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="text-xs font-semibold text-purple-200 leading-snug"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO ITEM 6 (Col 1, Row 3): Công cụ chuẩn hóa — 1x1 */}
        <ExpandedBentoTile
          tileId="tools"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #7c3aed 0%, #7e22ce 50%, #86198f 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="justify-between gap-3.5 bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-fuchsia-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 shrink-0 text-violet-200" />
                <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Standardized Tools' : 'Công cụ chuẩn hóa'}
                </h3>
              </div>
              <span className="text-xs font-bold shrink-0 tabular-nums text-violet-100 whitespace-nowrap">
                {tools.length} {isEn ? 'tools' : 'công cụ'}
              </span>
            </div>
            <p className="text-xs text-violet-100/85 leading-relaxed m-0">
              {isEn
                ? 'Operational platforms, CRM suites, and analytics tools standardized across teams (tap to copy):'
                : 'Hệ thống nền tảng, phần mềm CRM và bộ công cụ vận hành được triển khai chuẩn hóa (chạm để sao chép):'}
            </p>
          </div>

          {tools.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-2">
              {tools.map((tool, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  data-bento-styled="true"
                  onClick={() => handleCopyChip(tool)}
                  title={isEn ? `Copy ${tool}` : `Sao chép ${tool}`}
                  className="service-bento-subtile inline-flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 border border-white/15 hover:border-white/35 text-white px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95"
                >
                  <span>{tool}</span>
                  <Copy className="w-3 h-3 shrink-0 text-violet-200" />
                </button>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO ITEM 7 (Col 2, Row 3): Trọng tâm vận hành — 1x1 */}
        <ExpandedBentoTile
          tileId="focus"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #1e293b 0%, #1e1b4b 60%, #172554 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="justify-start gap-3.5 bg-slate-800"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-15 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5">
            <Activity className="w-5 h-5 shrink-0 text-blue-400" />
            <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Operational Focus' : 'Trọng tâm vận hành'}
            </h3>
          </div>

          <ol className="relative z-10 flex-1 flex flex-col justify-between gap-3 p-0 list-none">
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
                        className={`w-[2px] h-full min-h-[20px] bg-gradient-to-b ${palette.line} rounded-full mt-1.5`}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed m-0 font-medium">
                      {challenge}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </ExpandedBentoTile>

        {/* BENTO ITEM 8 (Cols 3-4, Row 3): Giải pháp công nghệ — col-span-2 */}
        <ExpandedBentoTile
          tileId="tech"
          fxMode={fxMode}
          tileBgCss="linear-gradient(135deg, #1e293b 0%, #134e4a 55%, #022c22 100%)"
          prefersReducedMotion={prefersReducedMotion}
          className="col-span-2 justify-between gap-3.5 bg-gradient-to-br from-slate-800 via-teal-950 to-emerald-950"
        >
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-5 h-5 shrink-0 text-emerald-400" />
              <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                {isEn ? 'Tech Solutions' : 'Giải pháp công nghệ'}
              </h3>
            </div>
            <span className="text-xs font-bold shrink-0 tabular-nums text-emerald-300 whitespace-nowrap">
              {techSolutions.length} {isEn ? 'solutions' : 'giải pháp'}
            </span>
          </div>

          <div className="bento-tech-grid relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {techSolutions.map((sol, solIdx) => {
              const isOddLast =
                techSolutions.length % 2 === 1 && solIdx === techSolutions.length - 1;
              return (
                <div
                  key={solIdx}
                  data-bento-styled="true"
                  className={`service-bento-subtile p-3.5 rounded-2xl bg-black/25 border border-white/10 hover:border-emerald-400/35 flex flex-col justify-center gap-1.5 transition-colors ${
                    isOddLast ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span className="font-play text-[14px] font-bold text-white leading-snug flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{sol.name}</span>
                  </span>
                  <span className="text-xs text-slate-300 leading-relaxed pl-6">
                    {sol.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </ExpandedBentoTile>
      </motion.div>
    </motion.div>
  );
};

export default ServiceExpandedDetail;