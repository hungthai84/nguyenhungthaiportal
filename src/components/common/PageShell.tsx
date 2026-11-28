import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageShellProps {
  id?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: string;
  ariaLabel?: string;
  dataPage?: string;
}

/**
 * Khung bố cục chuẩn cho các View chính, bám sát Main Card 1050px & Layer Depth Level 1.
 */
export const PageShell: React.FC<PageShellProps> = ({
  id,
  children,
  className,
  maxWidth = 'var(--main-card-target-w, 1200px)',
  ariaLabel,
  dataPage,
}) => {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-page={dataPage}
      style={{ maxWidth }}
      className={cn(
        'w-full mx-auto flex flex-col gap-[var(--card-gap,16px)] min-h-0',
        className
      )}
    >
      {children}
    </section>
  );
};

export default PageShell;
