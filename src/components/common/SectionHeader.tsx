import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { WebIcon } from '@/components/ui/WebIcon';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  divided?: boolean;
}

/**
 * Tiêu đề phân vùng chuẩn dùng chung cho mọi View & Card chi tiết.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  iconColor = 'var(--color-primary)',
  badge,
  actions,
  className,
  as = 'h2',
  divided = false,
}) => {
  const HeadingTag = as;
  return (
    <header
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3',
        divided && 'pb-3 border-b border-[var(--border-subcard)]',
        className
      )}
    >
      <div className="min-w-0 flex items-start sm:items-center gap-2.5">
        {icon && (
          <span
            className="w-8 h-8 rounded-[var(--radius-subcard,12px)] flex items-center justify-center shrink-0 border border-[var(--border-subcard)]"
            style={{ background: 'var(--bg-nested-badge, var(--bg-subcard))', color: iconColor }}
            aria-hidden="true"
          >
            <WebIcon name={icon} className="w-4 h-4" />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <HeadingTag
              className="typo-h3 font-play font-bold text-[var(--text-heading,var(--text-primary))] m-0 leading-snug"
              style={{ textTransform: 'none' }}
            >
              {title}
            </HeadingTag>
            {badge && (
              <span
                className="typo-badge font-mono px-2 py-0.5 rounded-[var(--radius-subcard,10px)] border border-[var(--border-subcard)] text-[var(--color-primary)]"
                style={{ background: 'var(--bg-nested-badge, var(--bg-subcard))' }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="typo-caption text-[var(--text-secondary)] m-0 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
};

export default SectionHeader;
