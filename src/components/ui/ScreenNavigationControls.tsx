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
          className={`nav-arrow-btn absolute ${leftOffsetClass} ${topOffsetClass} w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-[999px] aspect-square flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer z-40 group pointer-events-auto`}
          title={previousTitle}
          aria-label={previousTitle}
        >
          <svg
            className="w-[21px] h-[21px] sm:w-6 sm:h-6 stroke-[2.8] transition-transform duration-300 group-hover:-translate-x-0.5"
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
          className={`nav-arrow-btn absolute ${rightOffsetClass} ${topOffsetClass} w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-[999px] aspect-square flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer z-40 group pointer-events-auto`}
          title={nextTitle}
          aria-label={nextTitle}
        >
          <svg
            className="w-[21px] h-[21px] sm:w-6 sm:h-6 stroke-[2.8] transition-transform duration-300 group-hover:translate-x-0.5"
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
