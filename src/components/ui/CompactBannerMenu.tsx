'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { cn } from '@/lib/utils';

export interface CompactBannerMenuProps {
  id: string;
  label?: string;
  ariaLabel?: string;
  iconName?: string;
  activeCount?: number;
  className?: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}

export const CompactBannerMenu: React.FC<CompactBannerMenuProps> = ({
  id,
  label = 'Điều khiển',
  ariaLabel,
  iconName = 'sliders',
  activeCount = 0,
  className,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div
      ref={containerRef}
      className={cn('banner-compact-menu-anchor relative z-50 shrink-0 ml-auto', className)}
    >
      <button
        id={id}
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={ariaLabel || label}
        title={ariaLabel || label}
        className="banner-control-pill banner-compact-menu-trigger h-9 inline-flex items-center gap-1.5 px-3 py-0 rounded-full transition-colors cursor-pointer typo-button font-play shrink-0 whitespace-nowrap"
      >
        <WebIcon name={iconName} className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
        <span className="truncate max-w-[120px]">{label}</span>
        {activeCount > 0 && (
          <span className="banner-count-pill px-1.5 py-0.5 rounded-full typo-badge font-mono tabular-nums">
            {activeCount}
          </span>
        )}
        <WebIcon
          name="chevron-down"
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${id}-panel`}
            role="dialog"
            aria-label={ariaLabel || label}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="banner-dropdown-menu bento-card glass-card absolute right-0 top-[calc(100%+8px)] w-[min(calc(100vw-36px),330px)] max-h-[min(68vh,430px)] overflow-y-auto glass-scrollbar rounded-[14px] p-3 z-[90] flex flex-col gap-3 text-left shadow-xl"
          >
            {typeof children === 'function' ? children(closeMenu) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
