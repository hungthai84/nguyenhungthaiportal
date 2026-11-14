'use client';

import React from 'react';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface ScreenNavigationControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  previousTitle?: string;
  nextTitle?: string;
  className?: string;
  leftOffsetClass?: string;
  rightOffsetClass?: string;
  topOffsetClass?: string;
}

export const ScreenNavigationControls: React.FC<ScreenNavigationControlsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  previousTitle = 'Màn hình trước',
  nextTitle = 'Màn hình kế tiếp',
  className = '',
  leftOffsetClass = 'left-1.5 sm:left-3',
  rightOffsetClass = 'right-1.5 sm:right-3',
  topOffsetClass = 'top-1/2 -translate-y-1/2',
}) => {
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canGoPrevious || !onPrevious) return;
    SoundEngine.playGlassChime();
    onPrevious();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canGoNext || !onNext) return;
    SoundEngine.playGlassChime();
    onNext();
  };

  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Previous Screen Button */}
      {canGoPrevious && onPrevious && (
        <button
          type="button"
          onClick={handlePrevClick}
          className={`absolute ${leftOffsetClass} ${topOffsetClass} w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-[999px] aspect-square bg-white/10 dark:bg-slate-900/30 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-sky-600 dark:text-sky-400 border border-sky-300/90 dark:border-sky-500/50 shadow-[0_4px_14px_rgba(14,165,233,0.28)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-40 group pointer-events-auto`}
          title={previousTitle}
          aria-label={previousTitle}
        >
          <span className="absolute inset-0 rounded-[999px] bg-sky-400/20 animate-ping pointer-events-none opacity-40" style={{ animationDuration: '3s' }} />
          <svg
            className="w-[21px] h-[21px] sm:w-6 sm:h-6 stroke-[2.6] transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Screen Button */}
      {canGoNext && onNext && (
        <button
          type="button"
          onClick={handleNextClick}
          className={`absolute ${rightOffsetClass} ${topOffsetClass} w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-[999px] aspect-square bg-white/10 dark:bg-slate-900/30 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-sky-600 dark:text-sky-400 border border-sky-300/90 dark:border-sky-500/50 shadow-[0_4px_14px_rgba(14,165,233,0.28)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-40 group pointer-events-auto`}
          title={nextTitle}
          aria-label={nextTitle}
        >
          <span className="absolute inset-0 rounded-[999px] bg-sky-400/20 animate-ping pointer-events-none opacity-40" style={{ animationDuration: '3s' }} />
          <svg
            className="w-[21px] h-[21px] sm:w-6 sm:h-6 stroke-[2.6] transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
