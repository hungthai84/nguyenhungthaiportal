'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Award = createAnimatedIcon('award');
const Building2 = createAnimatedIcon('building-2');
const CheckCircle2 = createAnimatedIcon('check-circle');
const ChevronDown = createAnimatedIcon('chevron-down');
const ChevronLeft = createAnimatedIcon('chevron-left');
const ChevronRight = createAnimatedIcon('chevron-right');
const ChevronUp = createAnimatedIcon('chevron-up');
const ExternalLink = createAnimatedIcon('external-link');
const Layers = createAnimatedIcon('layers');
const Sparkles = createAnimatedIcon('sparkles');
const Tag = createAnimatedIcon('tag');
const TrendingUp = createAnimatedIcon('trending-up');
const UserCheck = createAnimatedIcon('user-check');
const Wrench = createAnimatedIcon('wrench');
const X = createAnimatedIcon('x');

import { DomainData } from '@/types';
import { ServiceAssignmentsMap } from '@/context/BannerVideoContext';
import { ServiceDomainKey } from '@/utils/bannerVideoMatcher';

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
  gradient: string;
  cardBgLight: string;
  cardBgDark: string;
  tintBgLight: string;
  tintBgDark: string;
  borderLight: string;
  borderDark: string;
  pillTextLight: string;
  pillTextDark: string;
  illustrationSrc: string;
  fallbackIllustration: string;
  frontMetrics: {
    label: string;
    labelEn: string;
    value: string;
    valueEn?: string;
  }[];
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

type CompactSectionKey = 'overview' | 'scaleChallenges' | 'outcomesTech';

interface ServiceExpandedDetailProps {
  expandedDomain: DomainData;
  expandedMeta: DomainUiMeta;
  allDomains: DomainData[];
  serviceAssignments: ServiceAssignmentsMap;
  interactionState: ServiceInteractionState;
  minHeightPx?: number;
  prefersReducedMotion: boolean;
  isEn: boolean;
  isLeatherTheme: boolean;
  expandedCardRef: React.RefObject<HTMLDivElement | null>;
  expandedBodyRef: React.RefObject<HTMLDivElement | null>;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSwitchDomain: (domain: DomainData) => void;
  renderDomainIcon: (key: DomainIconKey, className?: string, color?: string) => React.ReactNode;
  renderKpiIcon: (key: KpiIconKey, className?: string) => React.ReactNode;
}

export const ServiceExpandedDetail: React.FC<ServiceExpandedDetailProps> = ({
  expandedDomain,
  expandedMeta,
  allDomains,
  serviceAssignments,
  interactionState,
  prefersReducedMotion,
  isEn,
  isLeatherTheme,
  expandedCardRef,
  expandedBodyRef,
  closeButtonRef,
  onClose,
  onSwitchDomain,
  renderDomainIcon,
  renderKpiIcon,
}) => {
  const [openSections, setOpenSections] = useState<Partial<Record<CompactSectionKey, boolean>>>({});

  useEffect(() => {
    setOpenSections({});
  }, [expandedDomain.id]);

  const toggleSection = (key: CompactSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allSectionKeys: CompactSectionKey[] = ['overview', 'scaleChallenges', 'outcomesTech'];
  const areAllExpanded = allSectionKeys.every((k) => Boolean(openSections[k]));
  const toggleAllSections = () => {
    if (areAllExpanded) {
      setOpenSections({});
    } else {
      setOpenSections({ overview: true, scaleChallenges: true, outcomesTech: true });
    }
  };

  const currentIndex = allDomains.findIndex((d) => d.id === expandedDomain.id);
  const prevDomain =
    allDomains.length > 1
      ? allDomains[(currentIndex - 1 + allDomains.length) % allDomains.length]
      : null;
  const nextDomain =
    allDomains.length > 1
      ? allDomains[(currentIndex + 1) % allDomains.length]
      : null;

  const domainTitle =
    isEn && expandedDomain.titleEn ? expandedDomain.titleEn : expandedDomain.title;
  const domainSubtitle = isEn
    ? expandedDomain.subtitleEn || expandedDomain.descEn
    : expandedDomain.subtitle || expandedDomain.desc;
  const domainSummaryDesc = isEn
    ? expandedDomain.descEn || expandedDomain.subtitleEn
    : expandedDomain.desc || expandedDomain.subtitle;

  const illustrationUrl =
    serviceAssignments[expandedDomain.id as ServiceDomainKey]?.directImageUrl ||
    expandedDomain.customIllustrationUrl ||
    expandedMeta.illustrationSrc;

  const themeAccent = 'var(--text-link, var(--color-primary))';
  const themeTintBg = isLeatherTheme
    ? 'rgba(253, 230, 138, 0.12)'
    : 'color-mix(in srgb, var(--color-primary, #6D28D9) 10%, var(--bg-subcard, transparent))';
  const themeTintBorder = isLeatherTheme
    ? 'var(--border-subcard)'
    : 'color-mix(in srgb, var(--color-primary, #6D28D9) 28%, var(--border-subcard, rgba(255,255,255,0.4)))';

  const isClosing = interactionState === 'closing';
  const layoutTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 215, damping: 27, mass: 0.95 };

  const activeTags = isEn ? expandedMeta.tagsEn : expandedMeta.tags;

  return (
    <motion.div
      id="services-expanded-card"
      ref={expandedCardRef}
      layoutId={`service-card-shell-${expandedDomain.id}`}
      layout
      transition={{ layout: layoutTransition }}
      data-element-type="card"
      data-compact-service-card="true"
      data-interaction-state={interactionState}
      role="region"
      aria-label={domainTitle}
      className="domain-card-expanded domain-card-compact w-full min-w-0 h-fit"
      style={{
        borderRadius: 'var(--radius-main, 14px)',
      }}
    >
      {/* 1. COMPACT HEADER */}
      <motion.div
        layout="position"
        initial={prefersReducedMotion ? false : { opacity: 0.6 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.14 : 0.24,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="expanded-detail-content shrink-0 px-3.5 sm:px-4 py-2.5 border-b border-[var(--border-subcard)] flex flex-wrap items-center justify-between gap-2.5"
        style={{ background: themeTintBg }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-30 pointer-events-none"
              style={{ background: 'var(--color-primary)' }}
            />
            <img
              src={illustrationUrl}
              alt={domainTitle}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src !== expandedMeta.fallbackIllustration) {
                  e.currentTarget.src = expandedMeta.fallbackIllustration;
                }
              }}
              className="relative z-10 w-full h-full object-contain drop-shadow-sm select-none"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: themeAccent }}>
              {renderDomainIcon(expandedMeta.iconKey, 'w-4 h-4 shrink-0 stroke-[2.2]', themeAccent)}
              <h2
                className="typo-h4 sm:typo-h3 card-title-synced font-play font-bold tracking-tight truncate m-0"
                data-card-title="true"
                style={{ color: themeAccent }}
              >
                {domainTitle}
              </h2>
              {expandedDomain.serviceCode && (
                <span
                  className="hidden sm:inline-flex typo-badge font-bold px-2 py-0.5 rounded-full border shrink-0"
                  style={{
                    background: 'var(--bg-badge, var(--bg-subcard))',
                    borderColor: 'var(--border-badge, var(--border-subcard))',
                    color: themeAccent,
                  }}
                >
                  {expandedDomain.serviceCode}
                </span>
              )}
            </div>
            {domainSubtitle && (
              <p className="typo-caption text-[var(--text-secondary)] truncate m-0 mt-0.5">
                {domainSubtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {prevDomain && nextDomain && (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSwitchDomain(prevDomain)}
                className="nav-arrow-btn theme-prev-next-btn w-8 h-8 rounded-full border inline-flex items-center justify-center transition cursor-pointer"
                title={isEn ? 'Previous domain' : 'Lĩnh vực trước'}
                aria-label={isEn ? 'Previous domain' : 'Lĩnh vực trước'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSwitchDomain(nextDomain)}
                className="nav-arrow-btn theme-prev-next-btn w-8 h-8 rounded-full border inline-flex items-center justify-center transition cursor-pointer"
                title={isEn ? 'Next domain' : 'Lĩnh vực tiếp theo'}
                aria-label={isEn ? 'Next domain' : 'Lĩnh vực tiếp theo'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleAllSections}
            className="banner-control-pill inline-flex items-center gap-1 px-3 py-1.5 rounded-full typo-caption font-play font-semibold cursor-pointer transition border border-[var(--border-subcard)]"
            aria-expanded={areAllExpanded}
            title={
              areAllExpanded
                ? isEn
                  ? 'Collapse all sections'
                  : 'Thu gọn tất cả mục'
                : isEn
                  ? 'Expand all sections'
                  : 'Mở rộng tất cả mục'
            }
          >
            {areAllExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {areAllExpanded
                ? isEn
                  ? 'Collapse'
                  : 'Thu gọn'
                : isEn
                  ? 'Expand details'
                  : 'Xem chi tiết'}
            </span>
          </button>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full typo-button font-play font-semibold cursor-pointer transition hover:opacity-95 shadow-sm border border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            style={{
              background: 'var(--bg-button-primary, var(--color-primary))',
              color: 'var(--text-button-primary, #FFFFFF)',
            }}
            aria-label={isEn ? 'Close compact service card' : 'Đóng thẻ dịch vụ'}
            title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
          >
            <X className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'Close' : 'Đóng'}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. COMPACT CORE SUMMARY + COLLAPSIBLE ACCORDION SECTIONS */}
      <motion.div
        key={expandedDomain.id}
        ref={expandedBodyRef}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={isClosing ? { opacity: 0, y: 6 } : { opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : isClosing ? 0.14 : 0.26,
          delay: prefersReducedMotion ? 0 : isClosing ? 0 : 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="expanded-detail-content p-3.5 sm:p-4 flex flex-col gap-3 h-fit"
      >
        {/* KPI Tóm Tắt (4 chỉ số gọn trong 1 hàng) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 items-stretch">
          {expandedMeta.detailKpis.map((kpi, kIdx) => (
            <div
              key={kIdx}
              data-subcard="true"
              className="domain-card-sub rounded-xl p-2.5 flex flex-col justify-between gap-1 min-w-0"
            >
              <div className="flex items-center justify-between gap-1.5 min-w-0">
                <span
                  className="typo-h4 font-bold leading-tight truncate tabular-nums tracking-tight"
                  style={{ color: themeAccent }}
                >
                  {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                </span>
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
                  style={{
                    backgroundColor: themeTintBg,
                    color: themeAccent,
                  }}
                >
                  {renderKpiIcon(kpi.icon, 'w-3.5 h-3.5 shrink-0')}
                </span>
              </div>
              <span className="typo-caption font-medium text-[var(--text-secondary)] leading-snug line-clamp-1">
                {isEn ? kpi.labelEn : kpi.label}
              </span>
            </div>
          ))}
        </div>

        {/* Thẻ Tóm Tắt Trọng Tâm & Doanh Nghiệp Tiêu Biểu */}
        <div
          data-subcard="true"
          className="domain-card-sub rounded-xl p-3 flex flex-col gap-2.5 min-w-0"
          style={{
            background: themeTintBg,
            borderColor: themeTintBorder,
          }}
        >
          {domainSummaryDesc && (
            <p className="typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
              {domainSummaryDesc}
            </p>
          )}

          {expandedDomain.valueDelivered && (
            <div className="flex items-start gap-2 rounded-lg px-2.5 py-2 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/70 typo-caption leading-relaxed">
              <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: themeAccent }} />
              <div className="min-w-0">
                <span className="font-bold mr-1" style={{ color: themeAccent }}>
                  {isEn ? 'Strategic Value:' : 'Giá trị chuyển đổi:'}
                </span>
                <span className="text-[var(--text-secondary)]">{expandedDomain.valueDelivered}</span>
              </div>
            </div>
          )}

          {/* Hàng Doanh nghiệp tiêu biểu + Thẻ từ khóa gọn */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[var(--border-subcard)]/70">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1 typo-caption font-semibold text-[var(--text-muted)] mr-1">
                <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: themeAccent }} />
                <span>{isEn ? 'Enterprises:' : 'Tiêu biểu:'}</span>
              </span>
              {(expandedDomain.companyLogos || []).map((partner, pIdx) => {
                const badge = (
                  <>
                    <div
                      className="company-logo-surface w-5 h-5 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-0 border-0"
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
                            e.currentTarget.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                    <span className="typo-caption font-semibold text-[var(--text-primary)]">
                      {partner.name}
                    </span>
                    {partner.url && (
                      <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)] shrink-0" />
                    )}
                  </>
                );
                return partner.url ? (
                  <a
                    key={partner.name || pIdx}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 pr-2 pl-1 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-card)]/75 hover:border-[var(--color-primary)] transition-colors"
                  >
                    {badge}
                  </a>
                ) : (
                  <div
                    key={partner.name || pIdx}
                    className="inline-flex items-center gap-1.5 pr-2 pl-1 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-card)]/75"
                  >
                    {badge}
                  </div>
                );
              })}
            </div>

            {activeTags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="w-3 h-3 shrink-0" style={{ color: themeAccent }} />
                {activeTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="typo-caption font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      background: 'var(--bg-badge, var(--bg-subcard))',
                      borderColor: 'var(--border-badge, var(--border-subcard))',
                      color: themeAccent,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3 MỤC CHI TIẾT THU GỌN (Nhấn để mở rộng từng phần) */}
        <div className="flex flex-col gap-2 min-w-0">
          {/* Mục 1: Năng lực vận hành, Chuyên môn & Kinh nghiệm thực chiến */}
          <div
            data-subcard="true"
            className="domain-card-sub rounded-xl border border-[var(--border-subcard)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('overview')}
              aria-expanded={Boolean(openSections.overview)}
              className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-[var(--bg-subcard)]/50 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Award className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
                <span className="typo-body-sm font-bold text-[var(--text-primary)] truncate">
                  {isEn
                    ? 'Operational Capability & Core Expertise'
                    : 'Năng lực vận hành, Chuyên môn & Thực chiến'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                  openSections.overview ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openSections.overview && (
                <motion.div
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-[var(--border-subcard)]/70"
                >
                  <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <div className="rounded-lg p-2.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/65 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: themeAccent }} />
                        <span className="typo-badge font-bold" style={{ color: themeAccent }}>
                          {isEn
                            ? 'Operational Capability'
                            : expandedDomain.operationalCapabilityLabel || 'Năng lực vận hành'}
                        </span>
                      </div>
                      <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                        {isEn
                          ? expandedDomain.subtitleEn || expandedDomain.descEn
                          : expandedDomain.operationalCapability || expandedDomain.desc}
                      </p>
                    </div>

                    <div className="rounded-lg p-2.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/65 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: themeAccent }} />
                        <span className="typo-badge font-bold" style={{ color: themeAccent }}>
                          {isEn ? 'Core Expertise' : 'Năng lực chuyên môn'}
                        </span>
                      </div>
                      <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                        {isEn
                          ? expandedDomain.subtitleEn || expandedDomain.descEn
                          : expandedDomain.coreCompetency || expandedDomain.subtitle}
                      </p>
                    </div>

                    <div className="rounded-lg p-2.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/65 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: themeAccent }} />
                        <span className="typo-badge font-bold" style={{ color: themeAccent }}>
                          {isEn ? 'Field Experience' : 'Kinh nghiệm thực chiến'}
                        </span>
                      </div>
                      <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                        {isEn
                          ? expandedDomain.descEn
                          : expandedDomain.experienceAndScale || expandedDomain.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mục 2: Quy mô, Phạm vi & Thách thức đặc thù */}
          <div
            data-subcard="true"
            className="domain-card-sub rounded-xl border border-[var(--border-subcard)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('scaleChallenges')}
              aria-expanded={Boolean(openSections.scaleChallenges)}
              className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-[var(--bg-subcard)]/50 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <WebIcon name="shield-alert" className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
                <span className="typo-body-sm font-bold text-[var(--text-primary)] truncate">
                  {expandedDomain.id === '06'
                    ? isEn
                      ? 'Operational Scale & Transformation Scope'
                      : 'Quy mô & Bài toán chuyển đổi đặc thù'
                    : isEn
                      ? 'Operational Scale & Specific Challenges'
                      : 'Quy mô, Phạm vi & Thách thức đặc thù'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                  openSections.scaleChallenges ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openSections.scaleChallenges && (
                <motion.div
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-[var(--border-subcard)]/70"
                >
                  <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col divide-y divide-[var(--border-subcard)]/70 min-w-0">
                      {(expandedDomain.scaleAndScope || []).map((item, sIdx) => (
                        <div
                          key={sIdx}
                          className="py-1.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 typo-caption"
                        >
                          <span className="font-semibold shrink-0 sm:min-w-[130px]" style={{ color: themeAccent }}>
                            {item.label}
                          </span>
                          <span className="text-[var(--text-secondary)] leading-relaxed min-w-0">
                            {item.content}
                          </span>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-1.5 m-0 p-0 list-none min-w-0">
                      {(expandedDomain.operationalChallenges || []).map((ch, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-2 typo-caption text-[var(--text-secondary)] leading-relaxed"
                        >
                          <span
                            className="inline-flex items-center justify-center w-4.5 h-4.5 rounded typo-caption font-bold tabular-nums shrink-0 mt-0.5"
                            style={{ backgroundColor: themeTintBg, color: themeAccent }}
                          >
                            {String(cIdx + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0">{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mục 3: Điểm nhấn thực chiến, Kết quả, Công nghệ & Vai trò */}
          <div
            data-subcard="true"
            className="domain-card-sub rounded-xl border border-[var(--border-subcard)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection('outcomesTech')}
              aria-expanded={Boolean(openSections.outcomesTech)}
              className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-[var(--bg-subcard)]/50 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Wrench className="w-4 h-4 shrink-0" style={{ color: themeAccent }} />
                <span className="typo-body-sm font-bold text-[var(--text-primary)] truncate">
                  {isEn
                    ? 'Execution Highlights, Outcomes, Tech & Roles'
                    : 'Điểm nhấn thực chiến, Kết quả, Công nghệ & Vai trò'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                  openSections.outcomesTech ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openSections.outcomesTech && (
                <motion.div
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-[var(--border-subcard)]/70"
                >
                  <div className="p-3 flex flex-col gap-3">
                    {(expandedDomain.experienceItems || []).length > 0 && (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 m-0 p-0 list-none">
                        {(expandedDomain.experienceItems || []).map((exp, eIdx) => (
                          <li
                            key={eIdx}
                            className="rounded-lg px-2.5 py-1.5 border border-[var(--border-subcard)]/75 bg-[var(--bg-card)]/55 flex items-start gap-2 typo-caption text-[var(--text-secondary)] leading-relaxed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: themeAccent }} />
                            <span className="min-w-0">{exp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {(expandedDomain.operationalResults || []).length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {(expandedDomain.operationalResults || []).map((res, rIdx) => (
                          <div
                            key={rIdx}
                            className="rounded-lg px-2.5 py-1.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/65 flex flex-col gap-0.5 min-w-0"
                          >
                            <span className="typo-caption font-medium text-[var(--text-secondary)] leading-snug">
                              {res.indicator}
                            </span>
                            <span className="typo-caption font-bold leading-snug" style={{ color: themeAccent }}>
                              {res.outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {expandedDomain.summaryNote && (
                      <div className="rounded-lg px-2.5 py-2 border border-[var(--border-subcard)]/80 bg-[var(--bg-subcard)]/75 typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                        <span className="font-semibold text-[var(--text-primary)] mr-1">
                          {isEn ? 'Summary:' : 'Tổng kết:'}
                        </span>
                        {expandedDomain.summaryNote}
                      </div>
                    )}

                    {(expandedDomain.techSolutions || []).length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(expandedDomain.techSolutions || []).map((sol, solIdx) => (
                          <div
                            key={solIdx}
                            className="rounded-lg px-2.5 py-1.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/55 flex flex-col gap-0.5 min-w-0"
                          >
                            <span className="typo-caption font-semibold leading-snug" style={{ color: themeAccent }}>
                              {sol.name}
                            </span>
                            <span className="typo-caption text-[var(--text-secondary)] leading-relaxed">
                              {sol.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {((expandedDomain.tools || []).length > 0 || (expandedDomain.rolesHeld || []).length > 0) && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subcard)]/70">
                        {(expandedDomain.rolesHeld || []).length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: themeAccent }} />
                            {(expandedDomain.rolesHeld || []).map((role, roleIdx) => (
                              <span
                                key={roleIdx}
                                className="typo-caption font-medium px-2 py-0.5 rounded-md border border-[var(--border-subcard)] bg-[var(--bg-card)]/65 text-[var(--text-secondary)]"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                        {(expandedDomain.tools || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {(expandedDomain.tools || []).map((tool, tIdx) => (
                              <span
                                key={tIdx}
                                className="typo-caption font-semibold px-2 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-primary)]"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {expandedDomain.ecosystemNote && (
                      <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                        {expandedDomain.ecosystemNote}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceExpandedDetail;
