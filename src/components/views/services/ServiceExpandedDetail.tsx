'use client';

import React from 'react';
import { createAnimatedIcon } from '@/components/ui/MotionIcons';
import { WebIcon } from '@/components/ui/WebIcon';

const Award = createAnimatedIcon('award');
const Building2 = createAnimatedIcon('building-2');
const CheckCircle2 = createAnimatedIcon('check-circle');
const ChevronLeft = createAnimatedIcon('chevron-left');
const ChevronRight = createAnimatedIcon('chevron-right');
const ExternalLink = createAnimatedIcon('external-link');
const Layers = createAnimatedIcon('layers');
const Minimize2 = createAnimatedIcon('minimize-2');
const Sparkles = createAnimatedIcon('sparkles');
const Tag = createAnimatedIcon('tag');
const TrendingUp = createAnimatedIcon('trending-up');
const UserCheck = createAnimatedIcon('user-check');
const Wrench = createAnimatedIcon('wrench');
import { DomainData } from '@/types';
import { ServiceAssignmentsMap } from '@/context/BannerVideoContext';
import { ServiceDomainKey } from '@/utils/bannerVideoMatcher';

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

interface ServiceExpandedDetailProps {
  expandedDomain: DomainData;
  expandedMeta: DomainUiMeta;
  expandedAccent: string;
  allDomains: DomainData[];
  domainMetaMap: Record<string, DomainUiMeta>;
  serviceAssignments: ServiceAssignmentsMap;
  animPhase: 'idle' | 'entering' | 'open' | 'closing';
  morphRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  isEn: boolean;
  isLight: boolean;
  isLeatherTheme: boolean;
  expandedCardRef: React.RefObject<HTMLDivElement | null>;
  expandedBodyRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSwitchDomain: (domain: DomainData) => void;
  renderDomainIcon: (key: DomainIconKey, className?: string, color?: string) => React.ReactNode;
  renderKpiIcon: (key: KpiIconKey, className?: string) => React.ReactNode;
}

export const ServiceExpandedDetail: React.FC<ServiceExpandedDetailProps> = ({
  expandedDomain,
  expandedMeta,
  expandedAccent,
  allDomains,
  domainMetaMap,
  serviceAssignments,
  animPhase,
  morphRect,
  isEn,
  isLight,
  isLeatherTheme,
  expandedCardRef,
  expandedBodyRef,
  onClose,
  onSwitchDomain,
  renderDomainIcon,
  renderKpiIcon,
}) => {
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

  const illustrationUrl =
    serviceAssignments[expandedDomain.id as ServiceDomainKey]?.directImageUrl ||
    expandedDomain.customIllustrationUrl ||
    expandedMeta.illustrationSrc;

  return (
    <div
      id="services-expanded-card"
      ref={expandedCardRef}
      data-element-type="card"
      role="region"
      aria-label={domainTitle}
      className={`domain-card-expanded ${
        animPhase === 'entering'
          ? ''
          : animPhase === 'open'
            ? 'is-animating is-open'
            : animPhase === 'closing'
              ? 'is-animating is-closing'
              : ''
      }`}
      style={{
        top: `${morphRect.top}px`,
        left: `${morphRect.left}px`,
        width: `${morphRect.width}px`,
        height: `${morphRect.height}px`,
        borderRadius:
          animPhase === 'open'
            ? 'var(--radius-main, 30px)'
            : 'var(--radius-card, 20px)',
        zIndex: 50,
      }}
    >
      {/* 1. HEADER: Cân đối, rõ phân cấp, tích hợp điều hướng trước/sau */}
      <div
        className="expanded-detail-content shrink-0 px-4 sm:px-5 py-3 border-b border-[var(--border-subcard)] flex flex-wrap items-center justify-between gap-2.5 sm:gap-4"
        style={{
          background: isLeatherTheme
            ? undefined
            : isLight
              ? expandedMeta.tintBgLight
              : expandedMeta.tintBgDark,
        }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-50 pointer-events-none"
              style={{ background: expandedMeta.gradient }}
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
              className="relative z-10 w-full h-full object-contain drop-shadow-md select-none"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="card-header-sync min-w-0" style={{ color: expandedAccent }}>
              <h2
                className="typo-h3 sm:typo-h2 card-title-synced font-play font-bold tracking-tight truncate m-0"
                data-card-title="true"
                style={{ color: expandedAccent }}
              >
                {domainTitle}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {prevDomain && nextDomain && (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSwitchDomain(prevDomain)}
                className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-card)]/80 hover:bg-[var(--bg-subcard)] text-[var(--text-primary)] inline-flex items-center justify-center transition cursor-pointer active:scale-95"
                title={isEn ? 'Previous domain' : 'Lĩnh vực trước'}
                aria-label={isEn ? 'Previous domain' : 'Lĩnh vực trước'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSwitchDomain(nextDomain)}
                className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-card)]/80 hover:bg-[var(--bg-subcard)] text-[var(--text-primary)] inline-flex items-center justify-center transition cursor-pointer active:scale-95"
                title={isEn ? 'Next domain' : 'Lĩnh vực tiếp theo'}
                aria-label={isEn ? 'Next domain' : 'Lĩnh vực tiếp theo'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-play font-semibold text-white cursor-pointer transition hover:opacity-95 active:scale-95 shadow-sm"
            style={{ background: expandedMeta.gradient }}
            aria-label={isEn ? 'Minimize domain details' : 'Thu nhỏ chi tiết lĩnh vực'}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Minimize' : 'Thu nhỏ'}</span>
          </button>
        </div>
      </div>

      {/* 2. THÂN NỘI DUNG BENTO AUTO-FIT SMART WHITESPACE (Cuộn nội bộ mượt mà, đầy đủ dữ liệu thực chiến) */}
      <div
        ref={expandedBodyRef}
        className="expanded-detail-content flex-1 min-h-0 overflow-y-auto glass-scrollbar p-[15px] flex flex-col gap-[15px]"
      >
        {/* TẦNG 1: 4 Thẻ KPI Trọng Tâm (Compact Auto-Fit Strip) */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-[15px] items-stretch shrink-0">
          {expandedMeta.detailKpis.map((kpi, kIdx) => (
            <div
              key={kIdx}
              data-subcard="true"
              className="domain-card-sub rounded-2xl p-3.5 flex flex-col justify-between gap-2 min-w-0 h-full"
            >
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div
                  className="typo-h3 sm:typo-h2 font-bold leading-tight truncate tabular-nums tracking-tight"
                  style={{ color: expandedAccent }}
                >
                  {isEn && kpi.valueEn ? kpi.valueEn : kpi.value}
                </div>
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
                  style={{
                    backgroundColor: isLeatherTheme
                      ? 'rgba(253, 230, 138, 0.14)'
                      : isLight
                        ? expandedMeta.tintBgLight
                        : expandedMeta.tintBgDark,
                    color: expandedAccent,
                  }}
                >
                  {renderKpiIcon(kpi.icon, 'w-4 h-4 shrink-0')}
                </span>
              </div>
              <div className="typo-caption font-medium text-[var(--text-secondary)] leading-snug line-clamp-2">
                {isEn ? kpi.labelEn : kpi.label}
              </div>
            </div>
          ))}
        </div>

        {/* TẦNG 2: Feature Wide Bento Card — Năng lực vận hành, Chuyên môn, Kinh nghiệm & Giá trị chuyển đổi */}
        <div
          data-subcard="true"
          className="domain-card-sub services-detail-overview-subcard rounded-2xl p-[15px] flex flex-col gap-3 h-fit w-full shrink-0"
          style={{
            backgroundColor: isLeatherTheme
              ? undefined
              : isLight
                ? expandedMeta.tintBgLight
                : expandedMeta.tintBgDark,
            borderColor: isLeatherTheme
              ? 'var(--border-subcard)'
              : isLight
                ? expandedMeta.borderLight
                : expandedMeta.borderDark,
          }}
        >
          <div className="subcard-header-sync flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Award
                className="w-4 h-4 shrink-0"
                style={{ color: expandedAccent }}
              />
              <h3
                className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]"
                data-subcard-title="true"
              >
                {isEn
                  ? 'Operational, Core Competency & Field Experience'
                  : 'Năng lực vận hành, Chuyên môn & Kinh nghiệm thực chiến'}
              </h3>
            </div>
            {expandedDomain.serviceCode && (
              <span
                className="typo-badge font-bold px-2.5 py-0.5 rounded-full border shrink-0"
                style={{
                  backgroundColor: isLeatherTheme
                    ? 'rgba(253, 230, 138, 0.14)'
                    : isLight
                      ? 'rgba(255, 255, 255, 0.72)'
                      : expandedMeta.tintBgDark,
                  borderColor: isLeatherTheme
                    ? 'var(--border-subcard)'
                    : isLight
                      ? expandedMeta.borderLight
                      : expandedMeta.borderDark,
                  color: expandedAccent,
                }}
              >
                {expandedDomain.serviceCode} · {isEn ? expandedMeta.shortTitleEn : expandedMeta.shortTitle}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl p-3 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/70 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: expandedAccent }} />
                <span className="typo-badge font-bold" style={{ color: expandedAccent }}>
                  {isEn
                    ? 'Operational Capability'
                    : expandedDomain.operationalCapabilityLabel || 'Năng lực vận hành'}
                </span>
              </div>
              <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed m-0">
                {isEn
                  ? expandedDomain.subtitleEn || expandedDomain.descEn
                  : expandedDomain.operationalCapability || expandedDomain.desc}
              </p>
            </div>

            <div className="rounded-xl p-3 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/70 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: expandedAccent }} />
                <span className="typo-badge font-bold" style={{ color: expandedAccent }}>
                  {isEn ? 'Core Expertise' : 'Năng lực chuyên môn'}
                </span>
              </div>
              <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed m-0">
                {isEn
                  ? expandedDomain.subtitleEn || expandedDomain.descEn
                  : expandedDomain.coreCompetency || expandedDomain.subtitle}
              </p>
            </div>

            <div className="rounded-xl p-3 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/70 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: expandedAccent }} />
                <span className="typo-badge font-bold" style={{ color: expandedAccent }}>
                  {isEn ? 'Field Experience' : 'Kinh nghiệm thực chiến'}
                </span>
              </div>
              <p className="typo-body-sm text-[var(--text-secondary)] leading-relaxed m-0">
                {isEn
                  ? expandedDomain.descEn
                  : expandedDomain.experienceAndScale || expandedDomain.desc}
              </p>
            </div>
          </div>

          {expandedDomain.valueDelivered && (
            <div className="rounded-xl px-3.5 py-2.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/75 flex items-start gap-2.5 min-w-0">
              <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: expandedAccent }} />
              <div className="typo-body-sm text-[var(--text-primary)] leading-relaxed m-0">
                <span className="font-bold mr-1.5" style={{ color: expandedAccent }}>
                  {isEn ? 'Strategic Value:' : 'Giá trị chuyển đổi:'}
                </span>
                <span className="text-[var(--text-secondary)]">{expandedDomain.valueDelivered}</span>
              </div>
            </div>
          )}
        </div>

        {/* TẦNG 3: Lưới Bento Đa Kích Thước Dense (7/5 · 6/6 · 7/5 trên Desktop, 2 cột Tablet, 1 cột Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-[15px] [grid-auto-flow:dense] items-stretch min-w-0">
          {/* Tile 1 (Wide 7 cols): Quy mô & Phạm vi vận hành */}
          <div
            data-subcard="true"
            className="domain-card-sub xl:col-span-7 rounded-2xl p-[15px] flex flex-col justify-between gap-3 w-full min-w-0 h-full"
          >
            <div className="flex flex-col gap-3 min-w-0">
              <div className="subcard-header-sync flex items-center gap-2">
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: expandedAccent }}
                />
                <h3
                  className="typo-h4 subcard-title-synced font-play font-bold m-0"
                  data-subcard-title="true"
                  style={{ color: expandedAccent }}
                >
                  {isEn ? 'Operational Scale & Scope' : 'Quy mô & Phạm vi vận hành'}
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[var(--border-subcard)]/70">
                {(expandedDomain.scaleAndScope || []).map((item, sIdx) => (
                  <div
                    key={sIdx}
                    className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 typo-body-sm"
                  >
                    <span
                      className="font-semibold shrink-0 sm:min-w-[145px]"
                      style={{ color: expandedAccent }}
                    >
                      {item.label}
                    </span>
                    <span className="text-[var(--text-secondary)] leading-relaxed min-w-0">
                      {item.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tile 2 (Standard 5 cols): Thách thức đặc thù */}
          <div
            data-subcard="true"
            className="domain-card-sub xl:col-span-5 rounded-2xl p-[15px] flex flex-col justify-start gap-3 w-full min-w-0 h-full"
          >
            <div className="flex items-center gap-2 subcard-header-sync">
              <WebIcon
                name="shield-alert"
                className="w-4 h-4 shrink-0"
                style={{ color: expandedAccent }}
              />
              <h3
                className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]"
                data-subcard-title="true"
              >
                {expandedDomain.id === '06'
                  ? isEn
                    ? 'Strategic Transformation Scope'
                    : 'Bài toán chuyển đổi đặc thù'
                  : isEn
                    ? 'Specific Operational Challenges'
                    : 'Thách thức đặc thù'}
              </h3>
            </div>
            <ul className="space-y-2.5 m-0 p-0 list-none">
              {(expandedDomain.operationalChallenges || []).map((ch, cIdx) => (
                <li
                  key={cIdx}
                  className="flex items-start gap-2.5 typo-body-sm text-[var(--text-secondary)] leading-relaxed"
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold tabular-nums shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isLeatherTheme
                        ? 'rgba(253, 230, 138, 0.16)'
                        : isLight
                          ? expandedMeta.tintBgLight
                          : expandedMeta.tintBgDark,
                      color: expandedAccent,
                    }}
                  >
                    {String(cIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">{ch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tile 3 (Balanced 6 cols): Điểm nhấn thực chiến (experienceItems) */}
          {(expandedDomain.experienceItems || []).length > 0 && (
            <div
              data-subcard="true"
              className="domain-card-sub xl:col-span-6 rounded-2xl p-[15px] flex flex-col justify-start gap-3 w-full min-w-0 h-full"
            >
              <div className="subcard-header-sync flex items-center gap-2">
                <Sparkles
                  className="w-4 h-4 shrink-0"
                  style={{ color: expandedAccent }}
                />
                <h3
                  className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]"
                  data-subcard-title="true"
                >
                  {isEn ? 'Executive Execution Highlights' : 'Điểm nhấn kinh nghiệm thực chiến'}
                </h3>
              </div>
              <ul className="space-y-2 m-0 p-0 list-none">
                {(expandedDomain.experienceItems || []).map((exp, eIdx) => (
                  <li
                    key={eIdx}
                    className="rounded-xl px-3 py-2 border border-[var(--border-subcard)]/75 bg-[var(--bg-card)]/55 flex items-start gap-2.5 typo-body-sm text-[var(--text-secondary)] leading-relaxed"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: expandedAccent }}
                    />
                    <span className="min-w-0">{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tile 4 (Balanced 6 cols): Kết quả định lượng & Đánh giá tổng hợp */}
          {((expandedDomain.operationalResults || []).length > 0 || expandedDomain.summaryNote) && (
            <div
              data-subcard="true"
              className="domain-card-sub xl:col-span-6 rounded-2xl p-[15px] flex flex-col justify-between gap-3 w-full min-w-0 h-full"
            >
              <div className="flex flex-col gap-3 min-w-0">
                <div className="subcard-header-sync flex items-center gap-2">
                  <TrendingUp
                    className="w-4 h-4 shrink-0"
                    style={{ color: expandedAccent }}
                  />
                  <h3
                    className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]"
                    data-subcard-title="true"
                  >
                    {isEn ? 'Quantified Outcomes & Impact' : 'Kết quả định lượng & Hiệu quả'}
                  </h3>
                </div>

                {(expandedDomain.operationalResults || []).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(expandedDomain.operationalResults || []).map((res, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-xl px-3 py-2 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/65 flex flex-col gap-0.5 min-w-0"
                      >
                        <span className="typo-caption font-medium text-[var(--text-secondary)] leading-snug">
                          {res.indicator}
                        </span>
                        <span
                          className="typo-body-sm font-bold leading-snug"
                          style={{ color: expandedAccent }}
                        >
                          {res.outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {expandedDomain.summaryNote && (
                <div className="rounded-xl px-3 py-2.5 border border-[var(--border-subcard)]/80 bg-[var(--bg-subcard)]/75 typo-caption text-[var(--text-secondary)] leading-relaxed m-0">
                  <span className="font-semibold text-[var(--text-primary)] mr-1">
                    {isEn ? 'Summary:' : 'Tổng kết:'}
                  </span>
                  {expandedDomain.summaryNote}
                </div>
              )}
            </div>
          )}

          {/* Tile 5 (Wide 7 cols): Giải pháp & Công nghệ quản trị */}
          <div
            data-subcard="true"
            className="domain-card-sub xl:col-span-7 rounded-2xl p-[15px] flex flex-col justify-between gap-3 w-full min-w-0 h-full"
          >
            <div className="flex flex-col gap-3">
              <div className="subcard-header-sync flex items-center gap-2">
                <Wrench
                  className="w-4 h-4 shrink-0"
                  style={{ color: expandedAccent }}
                />
                <h3
                  className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]"
                  data-subcard-title="true"
                >
                  {isEn
                    ? 'Technology & Management Solutions'
                    : 'Giải pháp & Công nghệ quản trị'}
                </h3>
              </div>

              {(expandedDomain.techSolutions || []).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(expandedDomain.techSolutions || []).map((sol, solIdx) => (
                    <div
                      key={solIdx}
                      className="rounded-xl px-3 py-2 border border-[var(--border-subcard)]/80 bg-[var(--bg-card)]/55 flex flex-col gap-0.5 min-w-0"
                    >
                      <span
                        className="typo-body-sm font-semibold leading-snug"
                        style={{ color: expandedAccent }}
                      >
                        {sol.name}
                      </span>
                      <span className="typo-caption text-[var(--text-secondary)] leading-relaxed">
                        {sol.desc}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(expandedDomain.tools || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subcard)]/70">
                {(expandedDomain.tools || []).map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="typo-caption font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] text-[var(--text-primary)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tile 6 (Standard 5 cols): Doanh nghiệp tiêu biểu, Vai trò đảm nhiệm & Thẻ chuyên môn */}
          <div
            data-subcard="true"
            className="domain-card-sub xl:col-span-5 rounded-2xl p-[15px] flex flex-col justify-between gap-3 w-full min-w-0 h-full"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2.5">
                <div className="subcard-header-sync flex items-center gap-2">
                  <Building2
                    className="w-4 h-4 shrink-0"
                    style={{ color: expandedAccent }}
                  />
                  <h3
                    className="typo-h4 subcard-title-synced font-play font-bold m-0 text-[var(--text-primary)]"
                    data-subcard-title="true"
                  >
                    {isEn ? 'Representative Enterprises' : 'Doanh nghiệp tiêu biểu'}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(expandedDomain.companyLogos || []).map((partner, pIdx) => {
                    const content = (
                      <>
                        <div
                          className="w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-0 border-0"
                          style={{
                            background: 'var(--surface-secondary-bg, var(--bg-card))',
                            border: 'none',
                          }}
                        >
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              if (
                                partner.fallbackLogo &&
                                e.currentTarget.src !== partner.fallbackLogo
                              ) {
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
                          <ExternalLink className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                        )}
                      </>
                    );

                    return partner.url ? (
                      <a
                        key={partner.name || pIdx}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] hover:border-[var(--color-primary)] transition-colors"
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        key={partner.name || pIdx}
                        className="inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)]"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>

              {(expandedDomain.rolesHeld || []).length > 0 && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--border-subcard)]/70">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: expandedAccent }} />
                    <span className="typo-caption font-bold text-[var(--text-primary)]">
                      {isEn ? 'Leadership Roles Held' : 'Vai trò đảm nhiệm'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(expandedDomain.rolesHeld || []).map((role, roleIdx) => (
                      <span
                        key={roleIdx}
                        className="typo-caption font-medium px-2.5 py-0.5 rounded-lg border border-[var(--border-subcard)] bg-[var(--bg-card)]/65 text-[var(--text-secondary)]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {expandedDomain.ecosystemNote && (
                <p className="typo-caption text-[var(--text-secondary)] leading-relaxed m-0 pt-2 border-t border-[var(--border-subcard)]/70">
                  {expandedDomain.ecosystemNote}
                </p>
              )}
            </div>

            {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[var(--border-subcard)]/70">
                <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: expandedAccent }} />
                {(isEn ? expandedMeta.tagsEn : expandedMeta.tags).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: isLeatherTheme
                        ? 'rgba(253, 230, 138, 0.14)'
                        : isLight
                          ? expandedMeta.tintBgLight
                          : expandedMeta.tintBgDark,
                      borderColor: isLeatherTheme
                        ? 'var(--border-subcard)'
                        : isLight
                          ? expandedMeta.borderLight
                          : expandedMeta.borderDark,
                      color: isLeatherTheme
                        ? '#FDE68A'
                        : isLight
                          ? expandedMeta.pillTextLight
                          : expandedMeta.pillTextDark,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceExpandedDetail;
