import React from 'react';
import { cn } from '@/lib/utils';
import { WebIcon } from '@/components/ui/WebIcon';

export type BentoTone =
  | 'default'
  | 'indigo'
  | 'cyan'
  | 'sky'
  | 'purple'
  | 'emerald'
  | 'blue'
  | 'amber'
  | 'pink'
  | 'teal';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  colsDesktop?: 12 | 4 | 3 | 2;
  gap?: 'compact' | 'default';
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
  colsDesktop = 12,
  gap = 'default',
  ...props
}) => {
  const colClasses =
    colsDesktop === 12
      ? 'grid-cols-1 md:grid-cols-8 lg:grid-cols-12'
      : colsDesktop === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : colsDesktop === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2';

  const gapClass = gap === 'compact' ? 'gap-[12px]' : 'gap-[15px]';

  return (
    <div
      className={cn(
        'grid w-full min-w-0 items-stretch content-start',
        colClasses,
        gapClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: BentoTone;
  multicolor?: boolean;
  padding?: 'sm' | 'md';
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  tone = 'default',
  multicolor = false,
  padding = 'md',
  ...props
}) => {
  const toneClass = tone !== 'default' ? `bento-tone-${tone}` : '';
  const padClass = padding === 'sm' ? 'p-[10px]' : 'p-[15px]';

  return (
    <div
      data-element-type="card"
      data-section-card="true"
      data-multicolor-bento={multicolor || tone !== 'default' ? 'true' : undefined}
      className={cn(
        'bento-card glass-card rounded-[var(--radius-card,24px)] min-w-0 max-w-full flex flex-col justify-between transition-all duration-300',
        padClass,
        toneClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  badge?: React.ReactNode;
  accentClassName?: string;
  className?: string;
}

export const BentoCardHeader: React.FC<BentoCardHeaderProps> = ({
  icon,
  title,
  badge,
  accentClassName = 'text-indigo-600 dark:text-cyan-400',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subcard)] min-w-0',
        className
      )}
    >
      <div className={cn('card-heading card-header-sync flex items-center gap-2 min-w-0', accentClassName)}>
        <span className="shrink-0 flex items-center">
          {icon || <WebIcon name="sparkles" className="w-4 h-4 shrink-0" />}
        </span>
        <h3 className="card-heading__title card-title card-title-synced typo-h3 font-play truncate" data-card-title="true">
          {title}
        </h3>
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
};

export interface BentoSubCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const BentoSubCard: React.FC<BentoSubCardProps> = ({
  children,
  className,
  interactive = false,
  ...props
}) => {
  return (
    <div
      data-subcard="true"
      className={cn(
        'sub-card rounded-[var(--radius-subcard,16px)] p-[15px] min-w-0 max-w-full transition-all duration-200',
        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
