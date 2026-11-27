'use client';

import React from 'react';
import { motion } from 'motion/react';
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

  const accentBadgeStyle: React.CSSProperties = {
    background: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
    borderColor: `color-mix(in srgb, ${accentColor} 28%, transparent)`,
    color: accentColor,
  };

  const tileBaseClass =
    'service-bento-tile bento-card glass-card relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-4 sm:p-5 flex flex-col gap-3.5 min-w-0 text-[var(--text-primary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(0,0,0,0.35)]';

  const nestedSubBoxClass =
    'service-bento-subtile sub-card rounded-[var(--radius-subcard,14px)] p-3 border border-[var(--border-subcard,var(--border-color))] bg-[var(--surface-tertiary-bg,var(--bg-subcard))] transition-all duration-200 hover:border-white/25 hover:shadow-md';

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
      className="service-expanded-bento-shell bento-card glass-card relative w-full min-w-0 rounded-[var(--radius-card,var(--radius-global,14px))] p-3.5 sm:p-5 box-border text-[var(--text-primary)] shadow-2xl"
      style={{
        minHeight: minHeightPx ? `${minHeightPx}px` : undefined,
        borderColor: `color-mix(in srgb, ${accentColor} 40%, var(--border-card, var(--border-color)))`,
        borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
      }}
    >
      {/* Top Bento Switcher & Close Bar */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={isClosing ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.14 : 0.3,
          delay: prefersReducedMotion ? 0 : isClosing ? 0 : 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[var(--border-subcard,var(--border-color))]"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={onClose}
            className="banner-control-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-play cursor-pointer transition-all hover:opacity-90 shrink-0 border border-white/10 hover:border-white/20 shadow-xs"
          >
            <Minimize2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'All 6 Domains' : '6 lĩnh vực'}</span>
          </button>

          <div className="flex items-center gap-1.5 flex-nowrap sm:flex-wrap shrink-0">
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
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold font-play transition-all duration-200 cursor-pointer border shrink-0 whitespace-nowrap shadow-xs hover:scale-[1.02]"
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
          className="theme-modal-close nav-arrow-btn w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/10 hover:border-white/25 shadow-xs"
          aria-label={isEn ? 'Close service detail' : 'Đóng chi tiết dịch vụ'}
          title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
        >
          <X className="w-4 h-4 shrink-0" />
        </button>
      </motion.div>

      {/* 3-Column Theme-Synced Bento Grid (8 Bento Cards) */}
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
        className="service-bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] w-full min-w-0 [grid-auto-flow:dense]"
      >
        {/* BENTO CARD 1 (Row 1, Col 1–2): Hero Overview (Mẫu Thẻ 1: Bento Studio Hero Banner) */}
        <div
          data-subcard="true"
          className={`${tileBaseClass} sm:col-span-2 lg:col-span-2 justify-between relative overflow-hidden`}
          style={{
            borderColor: `color-mix(in srgb, ${accentColor} 38%, var(--border-subcard, var(--border-color)))`,
          }}
        >
          {/* Bento Studio glowing ambient orb */}
          <div
            className="absolute -right-12 -top-12 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] border shrink-0 shadow-md"
                  style={accentBadgeStyle}
                >
                  {renderDomainIcon(expandedMeta.iconKey, 'w-5 h-5 shrink-0 stroke-[2.2]', accentColor)}
                </span>
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[var(--text-muted)]">
                      Lĩnh vực #{expandedDomain.id}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                  </div>
                  <h2
                    className="text-lg sm:text-2xl font-bold tracking-tight leading-snug text-[var(--text-primary)] m-0 truncate mt-0.5"
                    title={fullTitle}
                  >
                    {formattedTitle}
                  </h2>
                  <span className="text-xs font-medium text-[var(--text-muted)] truncate">
                    {fullTitle}
                  </span>
                </div>
              </div>
              {summaryText && (
                <p className="text-xs sm:text-[14px] text-[var(--text-secondary)] leading-relaxed m-0">
                  {summaryText}
                </p>
              )}
            </div>

            <div className="relative shrink-0 w-28 h-24 sm:w-36 sm:h-28 flex items-center justify-center self-center sm:self-auto">
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
                className="w-28 h-24 sm:w-36 sm:h-28 object-contain drop-shadow-xl select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 pt-3.5 border-t border-[var(--border-subcard,var(--border-color))]">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-xs"
              style={accentBadgeStyle}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              {isEn ? 'Standardized Ops' : 'Vận hành chuẩn hóa'}
            </span>
            {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).slice(0, 4).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--surface-tertiary-bg,var(--bg-subcard))] text-[var(--text-secondary)] border border-[var(--border-subcard,var(--border-color))] text-[11px] font-medium transition-colors hover:text-[var(--text-primary)] hover:border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* BENTO CARD 2 (Row 1, Col 3): Enterprise Partners (Mẫu Thẻ 21: Integration Grid) */}
        <div data-subcard="true" className={`${tileBaseClass} justify-between`}>
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                {isEn ? 'Enterprise Partners' : 'Doanh nghiệp tiêu biểu'}
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)]">
              {partners.length} đối tác
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2 flex-1 content-start">
            {partners.map((partner, pIdx) => {
              const content = (
                <>
                  <div className="company-logo-surface w-9 h-9 rounded-full bg-transparent overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm border border-white/10">
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
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {partner.name}
                    </span>
                    {partner.url && (
                      <ExternalLink className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
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
                  className={`${nestedSubBoxClass} p-2 flex items-center gap-2 transition-all hover:scale-[1.02] hover:opacity-95 min-w-0`}
                  title={partner.name}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={partner.name || pIdx}
                  className={`${nestedSubBoxClass} p-2 flex items-center gap-2 min-w-0`}
                  title={partner.name}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* BENTO CARD 3 (Row 2, Col 1): Scope & Capabilities (Mẫu Thẻ 23: Capability Matrix) */}
        <div data-subcard="true" className={tileBaseClass}>
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                {isEn ? 'Capability & Scope' : 'Năng lực & Phạm vi'}
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          </div>

          {expandedDomain.operationalCapability && (
            <p className="relative z-10 text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed m-0">
              {expandedDomain.operationalCapability}
            </p>
          )}

          {scaleItems.length > 0 && (
            <div className="relative z-10 grid grid-cols-1 gap-2 mt-auto">
              {scaleItems.map((item, sIdx) => (
                <div
                  key={sIdx}
                  className={nestedSubBoxClass}
                  style={{
                    borderLeftWidth: '3px',
                    borderLeftColor: accentColor,
                  }}
                >
                  <div
                    className="text-[12px] font-bold leading-snug flex items-center gap-1.5"
                    style={{ color: accentColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    {item.label}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BENTO CARD 4 (Row 2, Col 2): Experience & Roles (Mẫu Thẻ 4: Active Roles) */}
        <div data-subcard="true" className={`${tileBaseClass} justify-between`}>
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
            <div className="flex items-center gap-2 min-w-0">
              <Briefcase className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                {isEn ? 'Experience & Roles' : 'Kinh nghiệm & Vai trò'}
              </h3>
            </div>

            {partners.length > 0 && (
              <div className="flex items-center -space-x-2 shrink-0">
                {partners.slice(0, 4).map((partner, pIdx) => (
                  <div
                    key={partner.name || pIdx}
                    title={partner.name}
                    className="company-logo-surface w-7 h-7 rounded-full bg-transparent overflow-hidden flex items-center justify-center p-0.5 shadow-sm border border-white/15"
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
            )}
          </div>

          {(expandedDomain.experienceAndScale || expandedDomain.desc) && (
            <p className="relative z-10 text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed m-0">
              {expandedDomain.experienceAndScale || expandedDomain.desc}
            </p>
          )}

          {rolesHeld.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5 pt-1 mt-auto">
              {rolesHeld.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all hover:scale-105"
                  style={accentBadgeStyle}
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BENTO CARD 5 (Row 2, Col 3): Key Results KPI Bento Grid (Mẫu Thẻ 9 & 20 & 50: KPI Stat Tiles) */}
        <div
          data-subcard="true"
          className={`${tileBaseClass} justify-between`}
          style={{
            borderColor: `color-mix(in srgb, ${accentColor} 32%, var(--border-subcard, var(--border-color)))`,
          }}
        >
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                {isEn ? 'Key Results' : 'Kết quả đạt được'}
              </h3>
            </div>
            <span className="text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              SLA Verified
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2">
            {expandedMeta.detailKpis.map((kpi, kIdx) => (
              <div
                key={kIdx}
                className={`${nestedSubBoxClass} p-2.5 flex flex-col justify-between gap-1.5 min-w-0 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className="text-base sm:text-lg font-black tabular-nums tracking-tight truncate drop-shadow-xs"
                    style={{ color: accentColor }}
                  >
                    {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                  </span>
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md border shrink-0"
                    style={accentBadgeStyle}
                  >
                    {renderKpiIcon(kpi.icon, 'w-3.5 h-3.5 shrink-0')}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[var(--text-secondary)] leading-snug line-clamp-2">
                  {isEn ? kpi.labelEn : kpi.label}
                </span>
                {/* Bento progress indicator line */}
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: '88%',
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {expandedDomain.keyResultsSummary && (
            <p className="relative z-10 text-xs font-medium text-[var(--text-secondary)] leading-relaxed m-0 pt-1">
              {expandedDomain.keyResultsSummary}
            </p>
          )}
        </div>

        {/* BENTO CARD 6 (Row 3, Col 1): Standardized Tools (Mẫu Thẻ 26 & 27: Resource Tag Hub) */}
        <div data-subcard="true" className={`${tileBaseClass} justify-between`}>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                  {isEn ? 'Standardized Tools' : 'Công cụ chuẩn hóa'}
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)]">
                {tools.length} công cụ
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
              {isEn
                ? 'Operational platforms, CRM suites, and analytics tools standardized across teams:'
                : 'Hệ thống nền tảng, phần mềm CRM và bộ công cụ vận hành được triển khai chuẩn hóa:'}
            </p>
          </div>

          {tools.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5 mt-auto">
              {tools.map((tool, tIdx) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-tertiary-bg,var(--bg-subcard))] text-[var(--text-primary)] border border-[var(--border-subcard,var(--border-color))] text-xs font-semibold transition-all hover:border-white/30 hover:scale-105"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BENTO CARD 7 (Row 3, Col 2): Operational Focus Timeline (Mẫu Thẻ 7: Milestone Timeline) */}
        <div data-subcard="true" className={tileBaseClass}>
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
            <div className="flex items-center gap-2 min-w-0">
              <Activity className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                {isEn ? 'Operational Focus' : 'Trọng tâm vận hành'}
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          </div>

          <ol className="relative z-10 flex flex-col gap-3.5 m-0 p-0 list-none">
            {challenges.map((challenge, cIdx) => {
              const isLast = cIdx === challenges.length - 1;
              return (
                <li key={cIdx} className="relative flex items-start gap-3">
                  <div className="relative flex flex-col items-center shrink-0 mt-1">
                    <span
                      className="w-3 h-3 rounded-full ring-4 shadow-sm"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 10px ${accentColor}`,
                      }}
                    />
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="w-[1.5px] h-full min-h-[26px] bg-[var(--border-subcard,var(--border-color))] mt-1"
                      />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0 min-w-0 font-medium">
                    {challenge}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* BENTO CARD 8 (Row 3, Col 3): Applied Tech Solutions (Mẫu Thẻ 25: Pipeline Solution Cards) */}
        <div data-subcard="true" className={`${tileBaseClass} sm:col-span-2 lg:col-span-1`}>
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0 pb-1 border-b border-[var(--border-subcard,var(--border-color))]">
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-4.5 h-4.5 shrink-0" style={{ color: accentColor }} />
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight m-0 truncate">
                {isEn ? 'Tech Solutions' : 'Giải pháp công nghệ'}
              </h3>
            </div>
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)]">
              {techSolutions.length} giải pháp
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {techSolutions.map((sol, solIdx) => (
              <div
                key={solIdx}
                className={`${nestedSubBoxClass} flex flex-col gap-1`}
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: accentColor,
                }}
              >
                <span
                  className="text-xs sm:text-[13px] font-bold leading-snug flex items-center gap-1.5"
                  style={{ color: accentColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  {sol.name}
                </span>
                <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {sol.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceExpandedDetail;
