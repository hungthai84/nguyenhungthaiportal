'use client';

import React from 'react';

export interface PageCardHeaderProps {
  pageId: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const PageCardHeader: React.FC<PageCardHeaderProps> = ({
  pageId,
  children,
  title,
}) => {
  return (
    <div
      id={pageId ? `${pageId}-card-header` : undefined}
      data-section-card="true"
      className="glass-card w-full rounded-[14px] p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300"
    >
      {title && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="typo-h2 font-play tracking-wide">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};
