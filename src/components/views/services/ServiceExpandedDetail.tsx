'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { CheckCircle, Copy } from 'lucide-react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { DomainData } from '@/types';
import { ServiceAssignmentsMap } from '@/context/BannerVideoContext';
import { ServiceDomainKey } from '@/utils/bannerVideoMatcher';
import {
  getExpandCardLayoutTransition,
  getExpandDetailRevealTransition,
} from '@/components/ui/ExpandCardMotion';
import { U420CardHoverIcon, U420_STYLES, type U420Variant } from '@/components/ui/U420CardHoverIcon';
import { BlurUpImage } from '@/components/ui/BlurUpImage';

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

export interface ServiceScaleOrigin {
  originX: string;
  originY: string;
  initialScale: number;
  offsetX: number;
  offsetY: number;
}

interface ExpandedBentoTileProps {
  tileId: BentoTileId;
  tileBgCss: string;
  fxMode?: 'spotlight-3d' | 'float-shadow' | 'neon' | 'minimal';
  prefersReducedMotion?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ExpandedBentoTile: React.FC<ExpandedBentoTileProps> = ({
  tileId,
  tileBgCss,
  fxMode = 'spotlight-3d',
  prefersReducedMotion = false,
  className = '',
  children,
}) => {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const [isScaleClicked, setIsScaleClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const clickTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
      }
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tileRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x.toFixed(1)}px`);
    el.style.setProperty('--my', `${y.toFixed(1)}px`);
    if (fxMode === 'spotlight-3d' && !prefersReducedMotion && rect.width > 0 && rect.height > 0) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      el.style.setProperty('--rx', `${(((y - cy) / cy) * -3).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(((x - cx) / cx) * 3).toFixed(2)}deg`);
    }
  };

  const handleMouseLeave = () => {
    const el = tileRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input')) return;
    const el = tileRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.3;
    const ripple = document.createElement('span');
    ripple.className = 'bento-card-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 680);
  };

  const handleTileClick = () => {
    setIsScaleClicked(true);
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = window.setTimeout(() => {
      setIsScaleClicked(false);
    }, 340);
  };

  return (
    <div
      ref={tileRef}
      data-subcard="true"
      data-multicolor-bento="true"
      data-bento-styled="true"
      data-bento-tile-id={tileId}
      data-fx-mode={fxMode}
      data-scale-clicked={isScaleClicked ? 'true' : 'false'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onClick={handleTileClick}
      style={{ ['--bento-tile-bg' as string]: tileBgCss }}
      className={`u420-t bento-item service-bento-tile service-bento-studio-card bento-studio-card bento-card bento-border card-reveal ${
        isVisible ? 'is-visible' : ''
      } relative overflow-hidden flex flex-col text-white cursor-pointer ${className}`}
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
  scaleOrigin?: ServiceScaleOrigin;
  minHeightPx?: number;
  prefersReducedMotion: boolean;
  isEn: boolean;
  isDarkMode?: boolean;
  isFlatSoftLight?: boolean;
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
  scaleOrigin,
  minHeightPx,
  prefersReducedMotion,
  isEn,
  isDarkMode = false,
  isFlatSoftLight = false,
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
  const layoutTransition = getExpandCardLayoutTransition(prefersReducedMotion);
  const originX = scaleOrigin?.originX || '50%';
  const originY = scaleOrigin?.originY || '50%';
  const startScale = scaleOrigin?.initialScale ?? 0.78;
  const startOffsetX = scaleOrigin?.offsetX ?? 0;
  const startOffsetY = scaleOrigin?.offsetY ?? 18;

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
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              scale: startScale,
              x: startOffsetX * 0.32,
              y: startOffsetY * 0.32,
            }
      }
      animate={
        isClosing
          ? {
              opacity: 0,
              scale: prefersReducedMotion ? 1 : Math.max(0.74, startScale),
              x: prefersReducedMotion ? 0 : startOffsetX * 0.24,
              y: prefersReducedMotion ? 0 : startOffsetY * 0.24,
            }
          : {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              scale: Math.max(0.74, startScale),
              x: startOffsetX * 0.24,
              y: startOffsetY * 0.24,
            }
      }
      transition={{
        layout: layoutTransition,
        opacity: {
          duration: prefersReducedMotion ? 0 : isClosing ? 0.2 : 0.26,
          ease: [0.22, 1, 0.36, 1],
        },
        scale: prefersReducedMotion
          ? { duration: 0 }
          : isClosing
            ? { duration: 0.24, ease: [0.32, 0, 0.67, 0] }
            : { type: 'spring', stiffness: 265, damping: 23, mass: 0.92 },
        x: prefersReducedMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 265, damping: 24, mass: 0.92 },
        y: prefersReducedMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 265, damping: 24, mass: 0.92 },
      }}
      data-element-type="card"
      data-section-card="true"
      data-bento-styled={!isDarkMode ? 'true' : undefined}
      data-bento-canvas={isFlatSoftLight ? 'true' : undefined}
      data-expand-motion="true"
      data-scale-up-motion="true"
      data-compact-service-card="true"
      data-bento-service-detail="true"
      data-interaction-state={interactionState}
      role="region"
      aria-label={fullTitle}
      className={`u420-scope service-expanded-bento-shell col-start-1 row-start-1 bento-card glass-card relative w-full min-w-0 rounded-[var(--radius-card,var(--radius-global,14px))] p-3 sm:p-4 md:p-5 box-border text-[var(--text-primary)] shadow-2xl ${
        !isDarkMode
          ? isFlatSoftLight
            ? 'service-bento-light-host service-flat-soft-bento-studio'
            : 'service-bento-light-host'
          : ''
      }`}
      style={{
        minHeight: minHeightPx ? `${minHeightPx}px` : undefined,
        borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
        transformOrigin: `${originX} ${originY}`,
      }}
    >
      <style>{U420_STYLES}</style>
      {/* 4-Column Responsive Bento Grid (.bento-container / .bento-item) + Lucian UX/UI #420 hover lift & Click Scale Up */}
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
          transform-origin: center center;
          box-shadow:
            0 12px 26px -8px rgba(0, 0, 0, 0.48),
            0 4px 12px -3px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
          transition:
            transform 0.46s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        html #services-page-container #services-expanded-card .bento-container .col-span-2 {
          grid-column: span 2;
        }

        html #services-page-container #services-expanded-card .bento-container .row-span-2 {
          grid-row: span 2;
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

        html #services-page-container #services-expanded-card .bento-item[data-bento-tile-id="experience"] {
          container-type: inline-size;
          container-name: bento-exp-tile;
        }

        html #services-page-container #services-expanded-card .bento-exp-logos-row {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          gap: 8px !important;
        }

        html #services-page-container #services-expanded-card .bento-exp-logos-row .company-logo-surface {
          margin-left: 0 !important;
          transition:
            margin-left 220ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 220ms ease !important;
        }

        @container bento-exp-tile (max-width: 325px) {
          html #services-page-container #services-expanded-card .bento-exp-logos-row {
            gap: 0px !important;
          }

          html #services-page-container #services-expanded-card .bento-exp-logos-row .company-logo-surface + .company-logo-surface {
            margin-left: -10px !important;
          }
        }

        @media (max-width: 480px) {
          html #services-page-container #services-expanded-card .bento-exp-logos-row {
            gap: 0px !important;
          }

          html #services-page-container #services-expanded-card .bento-exp-logos-row .company-logo-surface + .company-logo-surface {
            margin-left: -10px !important;
          }
        }

        /* ========================================================================= */
        /* LIGHT MODE SERVICE EXPANDED BENTO (Tất cả 8 Bento tiles sáng sắc nét)     */
        /* ========================================================================= */
        html #services-page-container #services-expanded-card.service-bento-light-host {
          background: rgba(255, 255, 255, 0.94) !important;
          border: 1px solid rgba(148, 163, 184, 0.24) !important;
          box-shadow:
            0 20px 48px -12px rgba(15, 23, 42, 0.12),
            0 6px 18px -4px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.96) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .theme-modal-close {
          background: rgba(255, 255, 255, 0.94) !important;
          color: #0f172a !important;
          border: 1px solid rgba(148, 163, 184, 0.36) !important;
          box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.14) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .theme-modal-close:hover {
          background: #4f46e5 !important;
          color: #ffffff !important;
          border-color: #4f46e5 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="hero"] {
          background: linear-gradient(145deg, #ffffff 0%, #f5f3ff 54%, #ede9fe 100%) !important;
          border-color: rgba(124, 58, 237, 0.24) !important;
          color: #0f172a !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="partners"] {
          background: linear-gradient(150deg, #ffffff 0%, #f8fafc 60%, #f3e8ff 100%) !important;
          border-color: rgba(139, 92, 246, 0.22) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="capability"] {
          background: linear-gradient(155deg, #ffffff 0%, #f0f9ff 58%, #e0e7ff 100%) !important;
          border-color: rgba(14, 165, 233, 0.24) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="kpis"] {
          background: linear-gradient(150deg, #ffffff 0%, #fff1f2 58%, #fce7f3 100%) !important;
          border-color: rgba(244, 63, 94, 0.22) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="experience"] {
          background: linear-gradient(150deg, #ffffff 0%, #f8fafc 58%, #eef2ff 100%) !important;
          border-color: rgba(99, 102, 241, 0.22) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="tools"] {
          background: linear-gradient(150deg, #ffffff 0%, #f5f3ff 58%, #fae8ff 100%) !important;
          border-color: rgba(168, 85, 247, 0.24) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="focus"] {
          background: linear-gradient(150deg, #ffffff 0%, #eff6ff 58%, #f5f3ff 100%) !important;
          border-color: rgba(59, 130, 246, 0.22) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item[data-bento-tile-id="tech"] {
          background: linear-gradient(150deg, #ffffff 0%, #ecfdf5 58%, #ccfbf1 100%) !important;
          border-color: rgba(16, 185, 129, 0.24) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item {
          color: #0f172a !important;
          box-shadow:
            0 12px 26px -8px rgba(15, 23, 42, 0.08),
            0 4px 10px -4px rgba(15, 23, 42, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.96) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-bento-subtile {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(148, 163, 184, 0.26) !important;
          color: #0f172a !important;
          box-shadow:
            0 4px 12px -4px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-bento-subtile:hover {
          background: #ffffff !important;
          border-color: rgba(99, 102, 241, 0.36) !important;
          box-shadow: 0 8px 18px -6px rgba(15, 23, 42, 0.1) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item h2:not(.gradient-text),
        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item h3:not(.gradient-text) {
          color: #0f172a !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .gradient-text {
          background: linear-gradient(90deg, #be123c 0%, #db2777 50%, #7c3aed 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-ink {
          color: #0f172a !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-muted {
          color: #475569 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-purple {
          color: #6d28d9 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-cyan {
          color: #0369a1 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-rose {
          color: #be123c !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-emerald {
          color: #047857 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-blue {
          color: #1d4ed8 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-track {
          background: rgba(225, 29, 72, 0.14) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-icon-chip {
          background: rgba(244, 63, 94, 0.12) !important;
          color: #be123c !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-hero-chip {
          background: rgba(124, 58, 237, 0.12) !important;
          border-color: rgba(124, 58, 237, 0.26) !important;
          color: #6d28d9 !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-divider {
          border-color: rgba(148, 163, 184, 0.24) !important;
        }

        html #services-page-container #services-expanded-card.service-bento-light-host .bento-item .service-light-ring {
          --tw-ring-color: #ffffff !important;
        }

        @media (hover: hover) and (pointer: fine) {
          html #services-page-container #services-expanded-card .bento-item.u420-t:hover {
            transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-4px) scale(1.012) !important;
            border-color: rgba(255, 255, 255, 0.26) !important;
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.22),
              0 18px 32px -18px rgba(0, 0, 0, 0.65),
              inset 0 1px 0 rgba(255, 255, 255, 0.24) !important;
          }

          html #services-page-container #services-expanded-card.service-bento-light-host .bento-item.u420-t:hover {
            border-color: rgba(99, 102, 241, 0.34) !important;
            box-shadow:
              0 20px 36px -10px rgba(15, 23, 42, 0.14),
              0 8px 18px -6px rgba(99, 102, 241, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.98) !important;
          }
        }

        /* ========================================================================= */
        /* CREATOR STUDIO BENTO (GIAO DIỆN PHẲNG SÁNG — FLAT-SOFT-UI)               */
        /* Dotted pastel canvas + hiệu ứng Spotlight 3D, Float & Neon trên nền sáng  */
        /* ========================================================================= */
        html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio {
          background-color: #f4f7fb !important;
          background-image:
            radial-gradient(circle at 12% 14%, rgba(168, 85, 247, 0.16) 0%, transparent 44%),
            radial-gradient(circle at 88% 18%, rgba(14, 165, 233, 0.16) 0%, transparent 42%),
            radial-gradient(circle at 52% 90%, rgba(244, 114, 182, 0.14) 0%, transparent 46%),
            radial-gradient(rgba(71, 85, 105, 0.13) 1px, transparent 1px) !important;
          background-size: 100% 100%, 100% 100%, 100% 100%, 24px 24px !important;
          border: 1px solid rgba(255, 255, 255, 0.85) !important;
          box-shadow:
            0 20px 44px -14px rgba(15, 23, 42, 0.14),
            0 6px 16px -4px rgba(15, 23, 42, 0.08) !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item,
        html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item.u420-t {
          border-radius: 14px !important;
          padding: 16px !important;
          transition:
            transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            border-color 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 5;
          opacity: 0;
          transition: opacity 0.28s ease;
          background: radial-gradient(
            380px circle at var(--mx, 50%) var(--my, 50%),
            rgba(99, 102, 241, 0.1),
            rgba(255, 255, 255, 0.28) 42%,
            transparent 72%
          ) !important;
        }

        html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item::after {
          display: none !important;
        }

        @media (hover: hover) and (pointer: fine) {
          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item.u420-t:hover {
            border-color: rgba(99, 102, 241, 0.34) !important;
            box-shadow:
              0 22px 38px -12px rgba(15, 23, 42, 0.16),
              0 10px 20px -8px rgba(99, 102, 241, 0.16),
              inset 0 1px 0 rgba(255, 255, 255, 0.98) !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="spotlight-3d"]:hover {
            transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-8px) scale(1.015) !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="spotlight-3d"]:hover::before,
          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="neon"]:hover::before {
            opacity: 1 !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="float-shadow"]:hover {
            transform: translateY(-8px) scale(1.012) !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="float-shadow"]:hover::before {
            opacity: 0.72 !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="neon"]:hover {
            transform: translateY(-6px) scale(1.012) !important;
            border-color: rgba(244, 63, 94, 0.42) !important;
            box-shadow:
              0 22px 40px -12px rgba(15, 23, 42, 0.16),
              0 0 22px -4px rgba(244, 63, 94, 0.22),
              0 0 14px -4px rgba(168, 85, 247, 0.2) !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item[data-fx-mode="minimal"]:hover {
            transform: translateY(-4px) !important;
          }

          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item:hover svg.shrink-0 {
            transform: scale(1.14) rotate(-5deg);
          }
        }

        html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item svg.shrink-0 {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        html #services-page-container #services-expanded-card .bento-item[data-scale-clicked="true"] {
          transform: translateY(-4px) scale(1.022) !important;
          z-index: 15;
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
          html[data-card-style="flat-soft-ui"] #services-page-container #services-expanded-card.service-flat-soft-bento-studio .bento-item {
            border-radius: 14px !important;
            padding: 15px !important;
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
        <X className="w-4 h-4 shrink-0" />
      </motion.button>

      {/* Bố cục 4-Column Responsive Bento Grid (.bento-container / .bento-item / .col-span-2 / .row-span-2) */}
      <motion.div
        key={expandedDomain.id}
        ref={expandedBodyRef}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={isClosing ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={getExpandDetailRevealTransition(prefersReducedMotion, isClosing)}
        className="bento-container service-bento-grid w-full min-w-0"
      >
        {/* BENTO ITEM 1 (Cols 1-2, Row 1): Tổng Quan Lĩnh Vực — col-span-2 */}
        <ExpandedBentoTile
          tileId="hero"
          fxMode="spotlight-3d"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #312e81 100%)"
          className="col-span-2 justify-between gap-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900"
        >
          <div className="absolute -right-14 -top-14 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

          <div className="bento-hero-layout relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0 max-[1080px]:pr-12">
            <div className="flex-1 min-w-0 flex flex-col gap-2.5 w-full">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <span
                  data-bento-styled="true"
                  className="service-light-hero-chip inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-400/35 text-purple-100 shrink-0 shadow-md mt-0.5 sm:mt-0"
                >
                  {renderDomainIcon(
                    expandedMeta.iconKey,
                    'w-5 h-5 shrink-0 stroke-[2.2]',
                    !isDarkMode ? '#6d28d9' : '#e9d5ff'
                  )}
                </span>
                <div className="min-w-0 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-purple-200/95 service-light-purple">
                    <span className="shrink-0 tabular-nums">
                      {isEn ? `Domain #${expandedDomain.id}` : `Lĩnh vực #${expandedDomain.id}`}
                    </span>
                    <span aria-hidden="true" className="text-purple-300/60 service-light-muted">·</span>
                    <span className="break-words text-purple-100/95 service-light-ink">{fullTitle}</span>
                  </div>
                  <h2
                    className="bento-unified-title font-play text-[16px] font-bold tracking-tight leading-snug text-white m-0 mt-1 [text-wrap:balance] break-words"
                    title={fullTitle}
                  >
                    {formattedTitle}
                  </h2>
                </div>
                <U420CardHoverIcon variant="c1" />
              </div>
              {summaryText && (
                <p className="text-sm sm:text-[15px] text-purple-100/90 service-light-muted leading-relaxed m-0 max-w-2xl">
                  {summaryText}
                </p>
              )}
            </div>

            <div className="bento-hero-media relative shrink-0 w-24 h-20 sm:w-36 sm:h-28 flex items-center justify-center self-center sm:self-auto">
              <BlurUpImage
                src={illustrationUrl}
                fallbackSrc={expandedMeta.fallbackIllustration}
                alt={fullTitle}
                priority="eager"
                variant="contain"
                className="w-24 h-20 sm:w-36 sm:h-28 object-contain drop-shadow-2xl select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <div className="service-light-divider relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3.5 border-t border-white/15 text-xs font-semibold text-purple-100/90">
            <span className="text-white service-light-ink font-bold">
              {isEn ? 'Standardized Ops' : 'Vận hành chuẩn hóa'}
            </span>
            {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).slice(0, 4).map((tag, tIdx) => (
              <React.Fragment key={tIdx}>
                <span aria-hidden="true" className="text-purple-300/50 service-light-muted">·</span>
                <span className="text-purple-100/90 service-light-purple">{tag}</span>
              </React.Fragment>
            ))}
          </div>
        </ExpandedBentoTile>

        {/* BENTO ITEM 2 (Col 3, Row 1): Doanh nghiệp tiêu biểu — 1x1 (Thẻ 4 + Thẻ 21) */}
        <ExpandedBentoTile
          tileId="partners"
          fxMode="float-shadow"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #1f2937 0%, #111827 100%)"
          className="justify-between gap-3.5 bg-gray-800/90"
        >
          <div className="relative z-10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-5 h-5 shrink-0 text-purple-400 service-light-purple" />
                <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Enterprise Partners' : 'Doanh nghiệp tiêu biểu'}
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-300 service-light-purple shrink-0 tabular-nums whitespace-nowrap">
                {partners.length} {isEn ? 'partners' : 'đối tác'}
              </span>
            </div>
            <p className="text-xs text-slate-300/85 service-light-muted m-0 leading-relaxed">
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
                  <div
                    className="company-logo-surface w-8 h-8 aspect-square rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-sm"
                  >
                    <BlurUpImage
                      src={partner.logo}
                      fallbackSrc={partner.fallbackLogo || illustrationUrl}
                      alt={partner.name}
                      variant="contain"
                      className="w-full h-full object-contain rounded-full block"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-100 service-light-ink truncate">
                      {partner.name}
                    </span>
                    {partner.url && (
                      <ExternalLink className="w-3 h-3 text-purple-300 service-light-purple shrink-0" />
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

          <span className="relative z-10 text-xs font-semibold text-purple-300/95 service-light-purple truncate">
            {expandedDomain.typicalEntitiesLine ||
              (isEn ? 'Verified enterprise track record' : 'Kinh nghiệm triển khai thực tế đa ngành')}
          </span>
        </ExpandedBentoTile>

        {/* BENTO ITEM 3 (Col 4, Rows 1-2): Năng lực & Phạm vi — row-span-2 */}
        <ExpandedBentoTile
          tileId="capability"
          fxMode="spotlight-3d"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #0891b2 0%, #1d4ed8 52%, #312e81 100%)"
          className="row-span-2 justify-start gap-3.5 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900"
        >
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5 min-[1081px]:pr-11">
            <Compass className="w-5 h-5 shrink-0 text-cyan-200 service-light-cyan" />
            <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Capability & Scope' : 'Năng lực & Phạm vi'}
            </h3>
          </div>

          {expandedDomain.operationalCapability && (
            <p className="relative z-10 text-xs sm:text-[13px] text-cyan-50/90 service-light-muted leading-relaxed m-0">
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
                  <div className="font-play text-[13px] font-bold text-cyan-200 service-light-cyan leading-snug">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/90 service-light-muted leading-relaxed mt-0.5">
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
          fxMode="neon"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #be123c 0%, #9d174d 50%, #3b0764 100%)"
          className="col-span-2 justify-between gap-3.5 bg-gradient-to-br from-rose-700 via-pink-800 to-purple-950"
        >
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-5 h-5 shrink-0 text-amber-300 service-light-rose" />
              <h3 className="bento-unified-title gradient-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-pink-200 font-play text-[16px] font-bold tracking-tight m-0 truncate">
                {isEn ? 'Key Results' : 'Kết quả đạt được'}
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-200 service-light-rose shrink-0 whitespace-nowrap">
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
                  <span className="text-lg sm:text-xl font-bold text-amber-200 service-light-rose tabular-nums tracking-tight truncate">
                    {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                  </span>
                  <span className="service-light-icon-chip inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white/10 text-yellow-200 shrink-0">
                    {renderKpiIcon(kpi.icon, 'w-3.5 h-3.5 shrink-0')}
                  </span>
                </div>
                <span className="text-xs font-medium text-rose-100/90 service-light-muted leading-snug line-clamp-2">
                  {isEn ? kpi.labelEn : kpi.label}
                </span>
                <div className="service-light-track w-full bg-black/35 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-pink-400"
                    style={{ width: KPI_PROGRESS_WIDTHS[kIdx % KPI_PROGRESS_WIDTHS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>

          {expandedDomain.keyResultsSummary && (
            <p className="relative z-10 text-xs text-rose-100/90 service-light-muted leading-relaxed m-0">
              {expandedDomain.keyResultsSummary}
            </p>
          )}
        </ExpandedBentoTile>

        {/* BENTO ITEM 5 (Col 3, Row 2): Kinh nghiệm & Vai trò — 1x1 */}
        <ExpandedBentoTile
          tileId="experience"
          fxMode="minimal"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #1e293b 0%, #0f172a 52%, #1e1b4b 100%)"
          className="justify-between gap-3.5 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950"
        >
          <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Briefcase className="w-5 h-5 shrink-0 text-purple-400 service-light-purple" />
              <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                {isEn ? 'Experience & Roles' : 'Kinh nghiệm & Vai trò'}
              </h3>
            </div>

            {partners.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="bento-exp-logos-row flex items-center flex-nowrap shrink-0">
                  {partners.slice(0, 4).map((partner, pIdx) => (
                    <div
                      key={partner.name || pIdx}
                      title={partner.name}
                      className="company-logo-surface w-9 h-9 aspect-square rounded-full overflow-hidden flex items-center justify-center shadow-md"
                    >
                      <BlurUpImage
                        src={partner.logo}
                        fallbackSrc={partner.fallbackLogo || illustrationUrl}
                        alt={partner.name}
                        variant="contain"
                        className="w-full h-full object-contain rounded-full block"
                      />
                    </div>
                  ))}
                  {partners.length > 4 && (
                    <div className="w-9 h-9 aspect-square rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center border-0 ring-0 shadow-md tabular-nums">
                      +{partners.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-purple-300 service-light-purple truncate">
                  {expandedDomain.typicalEntitiesLabel || (isEn ? 'Key Leadership' : 'Điều hành thực chiến')}
                </span>
              </div>
            )}

            {(expandedDomain.experienceAndScale || expandedDomain.desc) && (
              <p className="text-xs sm:text-[13px] text-slate-300 service-light-muted leading-relaxed m-0">
                {expandedDomain.experienceAndScale || expandedDomain.desc}
              </p>
            )}
          </div>

          {rolesHeld.length > 0 && (
            <div className="service-light-divider relative z-10 flex flex-col gap-1.5 pt-3 border-t border-white/10">
              {rolesHeld.map((role, rIdx) => (
                <span
                  key={rIdx}
                  data-bento-styled="true"
                  className="service-bento-subtile text-xs font-semibold text-purple-200 service-light-purple leading-snug px-2.5 py-1.5 rounded-xl bg-black/25 border border-white/10"
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
          fxMode="spotlight-3d"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #7c3aed 0%, #7e22ce 50%, #86198f 100%)"
          className="justify-between gap-3.5 bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-fuchsia-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 shrink-0 text-violet-200 service-light-purple" />
                <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                  {isEn ? 'Standardized Tools' : 'Công cụ chuẩn hóa'}
                </h3>
              </div>
              <span className="text-xs font-bold shrink-0 tabular-nums text-violet-100 service-light-purple whitespace-nowrap">
                {tools.length} {isEn ? 'tools' : 'công cụ'}
              </span>
            </div>
            <p className="text-xs text-violet-100/85 service-light-muted leading-relaxed m-0">
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
                  <Copy className="w-3 h-3 shrink-0 text-violet-200 service-light-purple" />
                </button>
              ))}
            </div>
          )}
        </ExpandedBentoTile>

        {/* BENTO ITEM 7 (Col 2, Row 3): Trọng tâm vận hành — 1x1 (Thẻ 7) */}
        <ExpandedBentoTile
          tileId="focus"
          fxMode="float-shadow"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #1f2937 0%, #111827 100%)"
          className="justify-start gap-3.5 bg-gray-800/90"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-15 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5">
            <Activity className="w-5 h-5 shrink-0 text-blue-400 service-light-blue" />
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
                    <p className="text-xs sm:text-[13px] text-slate-200 service-light-ink leading-relaxed m-0 font-medium">
                      {challenge}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </ExpandedBentoTile>

        {/* BENTO ITEM 8 (Cols 3-4, Row 3): Giải pháp công nghệ — col-span-2 (Thẻ 25 + Thẻ 16 + Thẻ 78) */}
        <ExpandedBentoTile
          tileId="tech"
          fxMode="spotlight-3d"
          prefersReducedMotion={prefersReducedMotion}
          tileBgCss="linear-gradient(135deg, #1e293b 0%, #1f2937 52%, #022c22 100%)"
          className="col-span-2 justify-between gap-3.5 bg-gradient-to-br from-slate-800 via-gray-800 to-emerald-950"
        >
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-5 h-5 shrink-0 text-emerald-400 service-light-emerald" />
              <h3 className="bento-unified-title font-play text-[16px] font-bold text-white tracking-tight m-0 truncate">
                {isEn ? 'Tech Solutions' : 'Giải pháp công nghệ'}
              </h3>
            </div>
            <span className="text-xs font-bold shrink-0 tabular-nums text-emerald-300 service-light-emerald whitespace-nowrap">
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
                  <span className="font-play text-[14px] font-bold text-white service-light-ink leading-snug flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 service-light-emerald" />
                    <span>{sol.name}</span>
                  </span>
                  <span className="text-xs text-slate-300 service-light-muted leading-relaxed pl-6">
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