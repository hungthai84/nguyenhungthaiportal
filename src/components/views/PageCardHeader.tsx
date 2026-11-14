'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';

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
  subtitle,
}) => {
  const { language } = useLanguage();
  const { isDark, cardStyle } = useTheme();
  const isLightMode = !isDark;
  const { borderRadius: _, background: __, ...cardSampleStyle } = getCardStyleProperties(cardStyle) as any;

  return (
    <div
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
      }}
      className={`w-full rounded-[14px] p-4 sm:p-5 border ${
        isLightMode
          ? 'bg-white/80 text-[#1E1B4B] border-white/90 shadow-[0_10px_30px_rgba(30,27,75,0.08)]'
          : 'bg-[#111827]/90 text-[#F8FAFC] border-white/12 shadow-[0_10px_30px_rgba(0,0,0,0.45)]'
      } backdrop-blur-xl flex flex-col gap-3 transition-all duration-300`}
    >
      {title && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-black font-play tracking-wide">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};
