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

const TIMELINE_DOT_COLORS = [
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-cyan-400',
];

export const ServiceExpandedDetail: React.FC<ServiceExpandedDetailProps> = ({
  expandedDomain,
  expandedMeta,
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
    : { type: 'spring' as const, stiffness: 215, damping: 27, mass: 0.95 };

  const partners = expandedDomain.companyLogos || [];
  const scaleItems = expandedDomain.scaleAndScope || [];
  const challenges = expandedDomain.operationalChallenges || [];
  const techSolutions = expandedDomain.techSolutions || [];
  const rolesHeld = expandedDomain.rolesHeld || [];
  const tools = expandedDomain.tools || [];

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
      className="service-expanded-bento-shell relative w-full min-w-0 rounded-[var(--radius-card,var(--radius-global,14px))] border-[1.5px] p-4 shadow-xl box-border"
      style={{
        minHeight: minHeightPx ? `${minHeightPx}px` : undefined,
        borderColor: accentColor,
        borderRadius: 'var(--radius-card, var(--radius-global, 14px))',
      }}
    >
      {/* Floating top-right Close Button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="service-expanded-close-btn absolute top-3 right-3 z-30 w-9 h-9 rounded-full inline-flex items-center justify-center bg-gray-900/90 hover:bg-gray-950 text-white border border-white/25 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={isEn ? 'Close service detail' : 'Đóng chi tiết dịch vụ'}
        title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
      >
        <X className="w-4 h-4 shrink-0" />
      </button>

      {/* 3-Column Creative Bento Grid (8 Cards) */}
      <motion.div
        key={expandedDomain.id}
        ref={expandedBodyRef}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={isClosing ? { opacity: 0, y: 6 } : { opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.14 : 0.28,
          delay: prefersReducedMotion ? 0 : isClosing ? 0 : 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="service-bento-grid grid grid-cols-1 md:grid-cols-3 gap-4 w-full min-w-0"
      >
        {/* CARD 1 (Row 1, Col 1–2): Hero Overview Card */}
        <div className="service-bento-tile md:col-span-2 relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gradient-to-br from-purple-600 to-indigo-800 text-white flex flex-col justify-between gap-4 min-w-0">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {renderDomainIcon(expandedMeta.iconKey, 'w-6 h-6 shrink-0 stroke-[2.2]', '#ffffff')}
                <h2
                  className="text-xl sm:text-2xl font-bold tracking-tight leading-snug text-white m-0 truncate"
                  title={fullTitle}
                >
                  {formattedTitle}
                </h2>
              </div>
              {summaryText && (
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed m-0">
                  {summaryText}
                </p>
              )}
            </div>

            <div className="relative shrink-0 w-24 h-20 sm:w-28 sm:h-24 flex items-center justify-center self-center sm:self-auto">
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
                className="w-24 h-20 sm:w-28 sm:h-24 object-contain drop-shadow-md select-none"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 border-t border-white/15">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold tracking-wide">
              {isEn ? 'Standardized Ops →' : 'Vận hành chuẩn hóa →'}
            </span>
            {tools.slice(0, 3).map((tool, tIdx) => (
              <span
                key={tIdx}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 text-purple-100 border border-white/15 text-[11px] font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2 (Row 1, Col 3): Enterprise Partners */}
        <div className="service-bento-tile relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 pr-11 shadow-lg bg-gray-800 text-white flex flex-col justify-between gap-3 min-w-0">
          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <Building2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Enterprise Partners' : 'Doanh nghiệp tiêu biểu'}
            </h3>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2.5 flex-1 content-start">
            {partners.map((partner, pIdx) => {
              const content = (
                <>
                  <div className="company-logo-surface w-9 h-9 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm">
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
                    <span className="text-xs font-semibold text-gray-100 truncate">
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
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 transition-colors min-w-0"
                  title={partner.name}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={partner.name || pIdx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/8 border border-white/10 min-w-0"
                  title={partner.name}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 3 (Row 2, Col 1): Scope & Capabilities */}
        <div className="service-bento-tile relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gradient-to-br from-green-500 to-emerald-700 text-white flex flex-col gap-3 min-w-0">
          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <Compass className="w-5 h-5 shrink-0 text-white" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight m-0 truncate">
              {isEn ? 'Capability & Scope' : 'Năng lực & Phạm vi'}
            </h3>
          </div>

          {expandedDomain.operationalCapability && (
            <p className="relative z-10 text-xs sm:text-[13px] text-emerald-50 leading-relaxed m-0">
              {expandedDomain.operationalCapability}
            </p>
          )}

          {scaleItems.length > 0 && (
            <div className="relative z-10 flex flex-col gap-2 mt-auto">
              {scaleItems.map((item, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-xl px-3 py-2 bg-white/15 border border-white/15 backdrop-blur-xs"
                >
                  <div className="text-[11px] font-bold text-white/95 leading-snug">
                    {item.label}
                  </div>
                  <div className="text-xs text-emerald-50/95 leading-relaxed mt-0.5">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARD 4 (Row 2, Col 2): Experience & Roles */}
        <div className="service-bento-tile relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gray-800 text-white flex flex-col justify-between gap-3 min-w-0">
          <div className="relative z-10 flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Briefcase className="w-5 h-5 shrink-0 text-sky-400" />
              <h3 className="text-sm sm:text-base font-bold text-sky-400 tracking-tight m-0 truncate">
                {isEn ? 'Experience & Roles' : 'Kinh nghiệm & Vai trò'}
              </h3>
            </div>

            {partners.length > 0 && (
              <div className="flex items-center -space-x-2 shrink-0">
                {partners.slice(0, 4).map((partner, pIdx) => (
                  <div
                    key={partner.name || pIdx}
                    title={partner.name}
                    className="w-7 h-7 rounded-full ring-2 ring-gray-800 bg-white overflow-hidden flex items-center justify-center p-0.5"
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
            <p className="relative z-10 text-xs sm:text-[13px] text-gray-200 leading-relaxed m-0">
              {expandedDomain.experienceAndScale || expandedDomain.desc}
            </p>
          )}

          {rolesHeld.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5 pt-1 mt-auto">
              {rolesHeld.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-200 border border-sky-400/25 text-[11px] font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CARD 5 (Row 2, Col 3): Key Results (Warm Yellow → Orange, Dark Ink) */}
        <div className="service-bento-tile service-bento-tile-light relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gradient-to-br from-yellow-400 to-orange-600 text-gray-900 flex flex-col justify-between gap-3 min-w-0">
          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <Zap className="w-5 h-5 shrink-0 text-gray-900" />
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight m-0 truncate">
              {isEn ? 'Key Results' : 'Kết quả đạt được'}
            </h3>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2">
            {expandedMeta.detailKpis.map((kpi, kIdx) => (
              <div
                key={kIdx}
                className="rounded-xl p-2.5 bg-gray-900/12 border border-gray-900/10 flex flex-col justify-between gap-1 min-w-0"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold text-gray-900 tabular-nums tracking-tight truncate">
                    {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                  </span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gray-900/12 text-gray-900 shrink-0">
                    {renderKpiIcon(kpi.icon, 'w-3.5 h-3.5 shrink-0')}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-gray-900/85 leading-snug line-clamp-2">
                  {isEn ? kpi.labelEn : kpi.label}
                </span>
              </div>
            ))}
          </div>

          {expandedDomain.keyResultsSummary && (
            <p className="relative z-10 text-xs font-medium text-gray-900/90 leading-relaxed m-0">
              {expandedDomain.keyResultsSummary}
            </p>
          )}
        </div>

        {/* CARD 6 (Row 3, Col 1): Standardized Tools */}
        <div className="service-bento-tile relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white flex flex-col justify-between gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-yellow-300/35 blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-5 h-5 shrink-0 text-yellow-300" />
              <h3 className="text-sm sm:text-base font-bold text-yellow-300 tracking-tight m-0 truncate">
                {isEn ? 'Standardized Tools' : 'Công cụ chuẩn hóa'}
              </h3>
            </div>
            <p className="text-xs text-pink-100 leading-relaxed m-0">
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
                  className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/18 text-white border border-white/25 text-xs font-semibold"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CARD 7 (Row 3, Col 2): Operational Focus Timeline */}
        <div className="service-bento-tile relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gray-800 text-white flex flex-col gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-blue-500/12 via-transparent to-purple-500/16 pointer-events-none"
          />

          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <Activity className="w-5 h-5 shrink-0 text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-blue-400 tracking-tight m-0 truncate">
              {isEn ? 'Operational Focus' : 'Trọng tâm vận hành'}
            </h3>
          </div>

          <ol className="relative z-10 flex flex-col gap-3 m-0 p-0 list-none">
            {challenges.map((challenge, cIdx) => {
              const dotClass = TIMELINE_DOT_COLORS[cIdx % TIMELINE_DOT_COLORS.length];
              const isLast = cIdx === challenges.length - 1;
              return (
                <li key={cIdx} className="relative flex items-start gap-3">
                  <div className="relative flex flex-col items-center shrink-0 mt-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotClass} shadow-xs`} />
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="w-[1.5px] h-full min-h-[22px] bg-white/15 mt-1"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed m-0 min-w-0">
                    {challenge}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* CARD 8 (Row 3, Col 3): Applied Tech Solutions */}
        <div className="service-bento-tile relative overflow-hidden rounded-[var(--radius-card,var(--radius-global,14px))] p-5 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-yellow-300/25 blur-2xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-pink-400/25 blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <Award className="w-5 h-5 shrink-0 text-yellow-300" />
            <h3 className="text-sm sm:text-base font-bold text-yellow-300 tracking-tight m-0 truncate">
              {isEn ? 'Tech Solutions' : 'Giải pháp công nghệ'}
            </h3>
          </div>

          <div className="relative z-10 flex flex-col gap-2.5">
            {techSolutions.map((sol, solIdx) => (
              <div
                key={solIdx}
                className="rounded-xl p-3 bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col gap-1"
              >
                <span className="text-xs sm:text-[13px] font-bold text-yellow-200 leading-snug">
                  {sol.name}
                </span>
                <span className="text-xs text-blue-100 leading-relaxed">
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
