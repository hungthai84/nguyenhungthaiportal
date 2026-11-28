'use client';

import React from 'react';
import { motion } from 'motion/react';

export interface GlobalLoadingOverlayProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

/**
 * GlobalLoadingOverlay
 * Hiển thị khung thẻ chính (.page-main-card) ngay lập tức kèm các khối hình mờ (blurred skeleton placeholders)
 * trong quá trình chờ tải trang hoặc dữ liệu.
 */
export const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({
  title = 'Đang tải nội dung trang...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={title}
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 overflow-hidden select-none font-play text-left"
    >
      <div className="page-cards-track w-full h-full flex items-center justify-center">
        <div
          id="loading-skeleton-main-card"
          data-main-card="true"
          data-floating-surface="main"
          data-element-type="card"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start w-full h-full rounded-[var(--radius-main,14px)] p-[15px] gap-[15px] overflow-hidden box-border"
        >
          {/* 1. Khung Banner Mờ (Blurred Hero Banner Placeholder) */}
          <div
            className="relative w-full h-[126px] sm:h-[148px] shrink-0 rounded-[var(--radius-card,14px)] border overflow-hidden p-4 flex flex-col justify-between"
            style={{
              background: 'var(--surface-secondary-bg, var(--bg-subcard, rgba(148, 163, 184, 0.14)))',
              borderColor: 'var(--border-subcard, rgba(148, 163, 184, 0.22))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Shimmer wave */}
            <motion.div
              aria-hidden="true"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-current opacity-15 animate-pulse" />
                <div className="h-5 w-44 sm:w-60 rounded-full bg-current opacity-15 animate-pulse" />
              </div>
              <div className="hidden sm:block h-4 w-52 rounded-full bg-current opacity-10 animate-pulse" />
            </div>

            <div className="flex items-center justify-between gap-2 mt-auto">
              <div className="flex items-center gap-2">
                <div className="h-8 w-28 rounded-full bg-current opacity-12 animate-pulse" />
                <div className="hidden sm:block h-8 w-24 rounded-full bg-current opacity-10 animate-pulse" />
              </div>
              <div className="h-8 w-36 sm:w-48 rounded-full bg-current opacity-12 animate-pulse" />
            </div>
          </div>

          {/* 2. Lưới các thẻ hình mờ trong lúc chờ load (Blurred Grid Card Placeholders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 w-full">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-[var(--radius-card,14px)] border p-4 flex flex-col justify-between gap-3 overflow-hidden min-h-[150px]"
                style={{
                  background: 'var(--surface-secondary-bg, var(--bg-subcard, rgba(148, 163, 184, 0.10)))',
                  borderColor: 'var(--border-subcard, rgba(148, 163, 184, 0.18))',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                }}
              >
                <motion.div
                  aria-hidden="true"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 1.75,
                    delay: idx * 0.12,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="h-4 w-24 rounded-full bg-current opacity-15 animate-pulse" />
                  <div className="w-7 h-7 rounded-lg bg-current opacity-12 animate-pulse" />
                </div>

                <div className="flex items-center gap-3 my-auto">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 w-4/5 rounded-full bg-current opacity-15 animate-pulse" />
                    <div className="h-3 w-3/5 rounded-full bg-current opacity-10 animate-pulse" />
                  </div>
                  <div className="w-20 h-14 rounded-[10px] bg-current opacity-12 animate-pulse shrink-0 blur-[1px]" />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-current/10">
                  <div className="h-3 w-20 rounded-full bg-current opacity-10 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-current opacity-15 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
