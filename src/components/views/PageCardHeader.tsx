'use client';

import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { TABS_DATA } from '@/data/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export interface PageCardHeaderProps {
  tabIndex?: number;
  pageId?: string;
  title?: string;
  subtitle?: string;
  partLabel?: string;
  variant?: 'default' | 'overlay';
  className?: string;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
}

// Theme-aware CSS custom property mapping per tabIndex (0..16)
const PAGE_ACCENT_VAR_MAP: Record<number, string> = {
  0: 'var(--accent-amber)',
  1: 'var(--accent-orange)',
  2: 'var(--accent-rose)',
  3: 'var(--accent-sky)',
  4: 'var(--accent-teal)',
  5: 'var(--accent-sky)',
  6: 'var(--accent-indigo)',
  7: 'var(--accent-cyan)',
  8: 'var(--accent-blue)',
  9: 'var(--accent-green)',
  10: 'var(--accent-orange)',
  11: 'var(--accent-violet)',
  12: 'var(--accent-indigo)',
  13: 'var(--accent-purple)',
  14: 'var(--accent-pink)',
  15: 'var(--accent-indigo)',
  16: 'var(--accent-blue)',
};

export const PageCardHeader: React.FC<PageCardHeaderProps> = ({
  tabIndex,
  pageId,
  title,
  subtitle,
  partLabel,
  variant = 'default',
  className,
  rightSlot,
  children,
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const resolvedIndex =
    typeof tabIndex === 'number' && tabIndex >= 0 && tabIndex < TABS_DATA.length
      ? tabIndex
      : undefined;
  const tabItem = resolvedIndex !== undefined ? TABS_DATA[resolvedIndex] : undefined;

  const accentColor =
    resolvedIndex !== undefined
      ? PAGE_ACCENT_VAR_MAP[resolvedIndex] || 'var(--color-primary)'
      : 'var(--color-primary)';

  const pageNumber =
    resolvedIndex !== undefined ? String(resolvedIndex + 1).padStart(2, '0') : undefined;
  const totalPages = String(TABS_DATA.length).padStart(2, '0');

  const resolvedTitle =
    title ?? (tabItem ? (isEn ? tabItem.nameEn || tabItem.name : tabItem.name) : '');
  const resolvedSubtitle =
    subtitle ?? (tabItem ? (isEn ? tabItem.quoteEn || tabItem.quote : tabItem.quote) : '');
  const resolvedPartLabel = partLabel ? t(partLabel) : undefined;
  const resolvedIcon = tabItem?.icon || 'grid';

  return (
    <header
      id={pageId ? `${pageId}-card-header` : resolvedIndex !== undefined ? `page-card-header-${resolvedIndex + 1}` : undefined}
      data-element-type="page-card-header"
      data-variant={variant}
      style={{ '--page-header-accent': accentColor } as React.CSSProperties}
      className={cn(
        'w-full shrink-0 min-w-0 flex items-center justify-between gap-3 font-play text-left transition-all duration-200',
        variant === 'overlay'
          ? 'relative z-30 rounded-[var(--radius-card,12px)] px-3.5 py-2.5'
          : 'pb-2.5',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="page-card-header-icon w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-subcard,10px)] flex items-center justify-center shrink-0 border transition-colors duration-200"
          style={{ color: accentColor }}
        >
          <WebIcon name={resolvedIcon} className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" style={{ color: accentColor }} />
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
          <div className="flex items-baseline gap-2 min-w-0">
            {pageNumber && (
              <>
                <span
                  className="font-mono tabular-nums font-bold text-xs sm:text-sm shrink-0 select-none"
                  style={{ color: accentColor }}
                >
                  {pageNumber}
                </span>
                <span aria-hidden="true" className="text-[var(--text-muted)] text-xs shrink-0 select-none">
                  ·
                </span>
              </>
            )}
            <h1
              className="card-title card-title-synced typo-h3 font-play font-bold tracking-tight truncate m-0 leading-tight"
              data-card-title="true"
              style={{ color: accentColor }}
              title={resolvedTitle}
            >
              {resolvedTitle}
            </h1>
            {resolvedPartLabel && (
              <>
                <span aria-hidden="true" className="text-[var(--text-muted)] text-xs shrink-0 hidden sm:inline select-none">
                  ·
                </span>
                <span className="typo-caption font-medium text-[var(--text-muted)] shrink-0 hidden sm:inline truncate">
                  {resolvedPartLabel}
                </span>
              </>
            )}
          </div>

          {resolvedSubtitle && (
            <p
              className="typo-caption sm:typo-body-sm text-[var(--text-secondary)] truncate m-0 leading-snug"
              title={resolvedSubtitle}
            >
              {resolvedSubtitle}
            </p>
          )}
        </div>
      </div>

      {rightSlot ? (
        <div className="shrink-0 flex items-center gap-2">{rightSlot}</div>
      ) : (
        pageNumber && (
          <span
            aria-label={isEn ? `Page ${pageNumber} of ${totalPages}` : `Trang ${pageNumber} trên ${totalPages}`}
            className="hidden sm:inline font-mono tabular-nums typo-caption font-semibold text-[var(--text-muted)] shrink-0 select-none"
          >
            {pageNumber} / {totalPages}
          </span>
        )
      )}

      {children}
    </header>
  );
};

export default PageCardHeader;
