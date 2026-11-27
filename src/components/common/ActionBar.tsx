import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ActionBarProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
  sticky?: boolean;
}

/**
 * Thanh công cụ lọc / tìm kiếm / chuyển chế độ hiển thị đồng bộ cho các View.
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  left,
  right,
  children,
  className,
  sticky = false,
}) => {
  return (
    <div
      className={cn(
        'bento-card glass-card w-full p-3 sm:p-4 rounded-[var(--radius-global,16px)] border border-[var(--border-subcard)] flex flex-col md:flex-row md:items-center justify-between gap-3',
        sticky && 'sticky top-0 z-20',
        className
      )}
      style={{ background: 'var(--bg-card)' }}
    >
      {children ? (
        children
      ) : (
        <>
          {left && <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">{left}</div>}
          {right && <div className="flex flex-wrap items-center gap-2 shrink-0">{right}</div>}
        </>
      )}
    </div>
  );
};

export default ActionBar;
