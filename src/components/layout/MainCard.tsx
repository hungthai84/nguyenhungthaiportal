import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface MainCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  pageId?: string;
  pageName?: string;
  hasCustomScroll?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Standardized Unified Main Card Container Component
 * Ensures 100% visual harmony, universal 14px border radius, 25px padding,
 * and synchronized elevation shadow across all website views.
 */
export const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      id,
      pageId,
      pageName,
      hasCustomScroll = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const computedId = id || (pageId ? `${pageId}-main-card` : 'main-card-container');
    const computedName = pageName ? `Thẻ chính: ${pageName}` : 'Thẻ chính hiển thị nội dung trang';

    return (
      <div
        ref={ref}
        id={computedId}
        data-element-name={computedName}
        data-element-type="card"
        data-element-page={pageId || 'global'}
        data-main-card="true"
        data-layer-level="1"
        className={cn(
          'main-card w-full min-w-0 h-full max-w-[1250px] mx-auto flex flex-col justify-start p-[15px] gap-[15px] font-play select-none text-left animate-fadeIn rounded-[var(--radius-main,30px)] box-border relative transition-all duration-300 ease-in-out',
          !hasCustomScroll && 'overflow-y-auto no-scrollbar',
          className
        )}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '1250px',
          marginInline: 'auto',
          padding: 'var(--main-card-padding, 15px)',
          borderRadius: 'var(--radius-main, 30px)',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MainCard.displayName = 'MainCard';

export default MainCard;
