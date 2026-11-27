import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { WebIcon } from '@/components/ui/WebIcon';

export type ViewStateVariant = 'empty' | 'loading' | 'error';

export interface ViewStateProps {
  id?: string;
  variant?: ViewStateVariant;
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
  extraAction?: ReactNode;
  className?: string;
}

/**
 * Trạng thái Trống / Đang tải / Lỗi chuẩn hóa dùng chung trên toàn hệ thống View.
 */
export const ViewState: React.FC<ViewStateProps> = ({
  id,
  variant = 'empty',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  extraAction,
  className,
}) => {
  const resolvedIcon: string =
    icon ||
    (variant === 'loading'
      ? 'refresh-cw'
      : variant === 'error'
      ? 'alert-circle'
      : 'search');

  const accentClasses =
    variant === 'error'
      ? 'bg-rose-500/15 text-rose-500 border-rose-500/25'
      : variant === 'loading'
      ? 'bg-sky-500/15 text-[var(--color-primary)] border-sky-500/25'
      : 'bg-rose-500/12 text-rose-500 border-rose-500/20';

  return (
    <div
      id={id}
      role={variant === 'error' ? 'alert' : 'status'}
      data-element-type="card"
      className={cn(
        'bento-card glass-card w-full py-12 px-6 rounded-[var(--radius-global,16px)] border border-[var(--border-subcard)] text-center flex flex-col items-center justify-center gap-3',
        className
      )}
      style={{ background: 'var(--bg-card)' }}
    >
      <span
        className={cn(
          'w-12 h-12 rounded-[var(--radius-subcard,14px)] border flex items-center justify-center shrink-0',
          accentClasses
        )}
        aria-hidden="true"
      >
        <WebIcon
          name={resolvedIcon}
          className={cn('w-6 h-6', variant === 'loading' && 'animate-spin')}
        />
      </span>
      <p
        className="typo-h4 font-play font-semibold text-[var(--text-heading,var(--text-primary))] m-0"
        style={{ textTransform: 'none' }}
      >
        {title}
      </p>
      {description && (
        <p className="typo-caption text-[var(--text-secondary)] max-w-md m-0">
          {description}
        </p>
      )}
      {(actionLabel && onAction) || extraAction ? (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              style={{
                background: 'var(--bg-button-primary)',
                color: 'var(--text-button-primary, #FFFFFF)',
              }}
              className="px-4 py-2 rounded-full typo-button font-semibold shadow-sm hover:brightness-110 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              {actionIcon && <WebIcon name={actionIcon} className="w-3.5 h-3.5" />}
              <span>{actionLabel}</span>
            </button>
          )}
          {extraAction}
        </div>
      ) : null}
    </div>
  );
};

export default ViewState;
