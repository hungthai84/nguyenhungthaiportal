'use client';

import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

export interface GlobalLoadingOverlayProps {
  message?: string;
}

export const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({ message = 'Đang tải nội dung...' }) => {
  return (
    <div
      id="global-loading-overlay"
      className="w-full h-full min-h-[320px] flex-1 flex flex-col items-center justify-center gap-4 py-16 px-4 select-none relative z-30"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 via-sky-500/20 to-pink-500/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-3 border-[var(--color-primary,var(--primary))] border-t-transparent animate-spin flex items-center justify-center shadow-lg">
          <WebIcon name="sparkles" className="w-5 h-5 animate-pulse" style={{ color: 'var(--color-primary)' }} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="typo-h6 font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {message}
        </span>
        <span className="typo-caption" style={{ color: 'var(--text-secondary)' }}>
          Đang chuẩn bị giao diện và dữ liệu...
        </span>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
